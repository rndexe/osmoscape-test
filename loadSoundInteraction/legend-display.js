const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    view: canvas
});

let datasets,mergedSoundAreas,mergedLegends;
let mainScrollScale;
let mainScrollWidth;
let includeSpecialCase = true;
document.body.appendChild(app.view);

class Molecule {
    constructor() {
        this.moleculeContainer = new PIXI.Container();
        this.moleculeContainer.interactive = true;
        this.moleculeContainer.buttonMode = true;
        this.molecule = new PIXI.Graphics()
            .lineStyle(1, 0xb67339, 1)
            .beginFill(0xeaf1f3, 0.53)
            .drawCircle(0, 0, 75)
            .endFill()
            .drawCircle(0, 0, 25)
        this.moleculeContainer.addChild(this.molecule);
        this.moleculeContainer.on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);

        this.moleculeContainer.x = app.screen.width / 2;
        this.moleculeContainer.y = app.screen.height / 2;
        app.stage.addChild(this.moleculeContainer);
    }
    onDragStart(event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.dragging = true;
    }
    onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
    }
    onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.global;
            this.x = newPosition.x;
            this.y = newPosition.y;
            //            const local = graphics.toLocal(newPosition)
            //            console.log("global",newPosition)
            soundeffects.crossfade.fade.rampTo(0,1.0)
            if(soundareas.containsPoint(newPosition)) {
                soundeffects.crossfade.fade.rampTo(1,1.0)
                let np = getNormalizedPosition(newPosition)
                soundeffects.changeParameters(np);
            }
        }
    }
}

class SoundEffects {
    constructor() {
        this.context = new Tone.Context({ latencyHint: "balanced"});
        Tone.setContext(this.context);
        this.crossfade = new Tone.CrossFade({fade : 0});
        this.player = new Tone.Player({loop : true});
        this.grainplayer = new Tone.GrainPlayer({loop : true});
        this.pitchshift = new Tone.PitchShift();
        this.vibrato = new Tone.Vibrato();
        this.delay = new Tone.Delay();

        this.makeEffectChain();
        this.setDefaultParameterRange();
    }
    makeEffectChain() {
        this.player.connect(this.crossfade.a)

        this.grainplayer.connect(this.delay)
        this.delay.connect(this.vibrato);
        this.vibrato.connect(this.pitchshift);
        this.pitchshift.connect(this.crossfade.b);

        this.crossfade.connect(Tone.getDestination());
    }
    setNewBuffer(num) {
        const currentBuffer = new Tone.ToneAudioBuffer({
            url:   "../_data/audio/loops/"+num+".mp3",
            onload: () => {

                this.grainplayer.buffer = currentBuffer; 
                this.player.buffer = currentBuffer;

                this.player.start();
                this.grainplayer.start();
            }
        }
        ); 
    }
    setDefaultParameterRange() {

        this.delayRange = (0.6 - 0.01);
        this.delayMin = 0.01;
        this.freqRange = (10 - 0.1);
        this.freqMin = 0.1;
        this.depthRange = (1 - 0);
        this.depthMin = 0;
        this.pitchRange = (12 + 12);
        this.pitchMin = -12;
        this.detuneRange = (12 + 12);
        this.detuneMin = -12;
        this.grainSizeRange = (3 - 0.01);
        this.grainSizeMin = 0.01;
        this.loopStartRange = this.grainplayer.buffer.length/2;
        this.loopStartMin = 0;
        this.loopEndRange = this.grainplayer.buffer.length/2;
        this.loopEndMin = this.grainplayer.buffer.length/2;

    }
    changeParameters(np) {

        this.delay.delayTime.rampTo(np.navg * this.delayRange + this.delayMin,0.1);

        this.vibrato.frequency.rampTo(np.ny * this.freqRange + this.freqMin,0.1);
        this.vibrato.depth.rampTo(np.nx * this.depthRange + this.depthMin,0.1);

        this.pitchshift.pitch = np.ny * this.pitchRange + this.pitchMin;

        this.grainplayer.detune = np.nx * this.detuneRange + this.detuneMin;
        this.grainplayer.grainSize = np.ny * this.grainSizeRange + this.grainSizeMin; 
        this.grainplayer.loopStart = np.ny * this.loopStartRange + this.loopStartMin;
        this.grainplayer.loopEnd = np.nx * this.loopEndRange + this.loopEndMin;
    }
}
class SoundInteractionArea {
    constructor() {
        this.areaContainer = new PIXI.Container();
    }
    setNew(num,s,pos) {
        this.loadNew(num)
        this.setInitialPositionAndScale(num,s,pos)
    }
    setInitialPositionAndScale(num,s,pos) {
        this.areaContainer.scale.set(s)
        this.areaContainer.position = pos
        this.currentBounds = this.areaContainer.getBounds()
    }
    setNewPositionAndScale(num, newx, newy) {
        this.areas[num].x = newx;
        this.areas[num].y = newy;
        this.currentBounds = this.areas[num].getBounds()
        //     console.log("Position:",this.areas[num].getBounds());
    }
    loadNew(num) {
        let splid = num;
        let hasSpecialFile = datasets[num].hasOwnProperty("speciallegend")
        if(includeSpecialCase && hasSpecialFile)
            splid = num + '_spl'
        //
        this.areaContainer.removeChildren()
        let soundArea = JSON.parse(mergedSoundAreas[splid]);
        //let rect = soundArea.shapes[0][0].shape;
        let shapeArray = soundArea.shapes;
        //console.log(shapeArray)
        for ( const shape in shapeArray) {
            console.log(shape);
        let s = shapeArray[shape].reduce((graphics, shape, index, array) => {
            if (index === 0) { 
                graphics.beginFill(0xFFA500);
                graphics.alpha = 0.2;
            }
            graphics.drawPolygon(shape.shape)
            if (index === array.length - 1) {
                graphics.endFill();
                graphics.visible = true;
            };
            return graphics;
        }, new PIXI.Graphics());
        this.areaContainer.addChild(s)
        }
 
    }
    containsPoint(pos) {
        let shapeArray = this.areaContainer.children; 
        let contains = false;
        for (const shape in shapeArray) {
            if (shapeArray[shape].containsPoint(pos)){
                contains = true;
                return contains
            }
        }
        return contains
    }
}

const molecule = new Molecule();
const soundareas = new SoundInteractionArea();
const soundeffects = new SoundEffects();
let mergedSoundURL = '../_data/mergedSoundAreas.json';
let mergedCsvURL = '../_data/csv/mergedCsvData.json';
let legendsURL = '../_data/encodedSVG.json';
let dataURL = '../_data/dataSummary.json';
let buffers = {};

$(document).ready(function() {
    // executes when HTML-Document is loaded and DOM is ready
    console.log("Document is ready");
    console.log("Started loading assets");
    console.log("Loading dataSummary from: " + dataURL);
    $.getJSON(dataURL, function( data ) {
        datasets = data;
        console.log('Loaded dataSummary.json');
    });
    console.log("Loading Soundarea data from: " + mergedSoundURL);
    $.getJSON(mergedSoundURL, function( data ) {
        mergedSoundAreas = data;
        console.log("Loaded Soundarea data");
    });
    $.getJSON(mergedCsvURL, function( data ) {
        mergedCsvData = data;
        console.log("Loaded CSV data");
    });
    console.log("Loading Legends from " + legendsURL);
    $.getJSON(legendsURL, function( data ) {
        mergedLegends = data;
        console.log('Loaded Legend files');
    });
    let _url = '../_data/images/SCROLL_cs6_ver23_APP_final_150ppi-LOW-';
    PIXI.Loader.shared.add(_url+'01-or8.png').load(() => {
        let scroll_01 = new PIXI.Sprite(PIXI.Loader.shared.resources[_url+'01-or8.png'].texture);
        mainScrollScale = app.screen.height/scroll_01.height;
        mainScrollWidth=scroll_01.width*2*mainScrollScale;
    });

    $("#p").on("click",async () => {
        $("#p").prop("disabled", true);
        await Tone.start();
        console.log("Context started");
        $("#p").text("Started");
    });
});

$("#m").on("change", function() {
    let i = ($(this).val());
    if(i in datasets) {
        console.log(datasets[i].title)
        app.stage.removeChildren();
        $("p").text(datasets[i].title);
        if(datasets[i].hasOwnProperty("popdimensions")) {
                loadLegend(i, datasets[i].hasOwnProperty("speciallegend"))
                soundeffects.setNewBuffer(i);
                app.stage.addChild(molecule.moleculeContainer);
        } else {
            $("p").text(i + datasets[i].title + " has no popdimensions");
        }
    } else {
        $("p").text("No dataset for id number " + i);
        app.stage.removeChildren();
    }
});

const getNormalizedPosition = (pos) => {

    let np = {};
    np.x = pos.x - soundareas.currentBounds.x;
    np.y = pos.y - soundareas.currentBounds.y;
    np.nx = np.x/soundareas.currentBounds.width;
    np.ny = np.y/soundareas.currentBounds.height;
    np.navg = (np.nx+np.ny)/2;
    //    console.log(np);
    return np;
}

const loadLegend = (id, hasSpecialFile) => {
    let splid = id;
    if(includeSpecialCase && hasSpecialFile)
        splid = id + '_spl'
    if (datasets.hasOwnProperty(id)) {
        let legenddata = mergedLegends[splid];
        let dim = datasets[id].popdimensions;
        let resource = new PIXI.SVGResource (legenddata, {scale: 1.5});
        let legendTexture = PIXI.Texture.from(resource);
        let legendLoaded = false;
        legendTexture.on('update', () => {
            if(!legendLoaded){
                let legend = new PIXI.Sprite(legendTexture);
                let s = mainScrollScale;
                let legendScale = app.screen.height/legendTexture.height;
                legend.scale.set(legendScale, legendScale);
                app.stage.addChild(legend);
                showLegend(id,legend,dim);
                soundareas.setNew(id,app.screen.height/623.5,legend.position);
                app.stage.addChild(soundareas.areaContainer)
            }
            legendLoaded = true;
        });
    }
}


const showLegend = (number,legend,dim) => {
    console.log('Repositioning legend ' + number);
    let _x = parseInt(dim[0].x);
    let _y = parseInt(dim[0].y);
    let _width = parseInt(dim[0].width);
    let _height = parseInt(dim[0].height);
    let s = app.screen.height/821;
    _x = _x*s-(mainScrollWidth-legend.width);
    _y = _y*s;
    _width = _width*s;
    _height = _height*s;
    legend.x -= (_x -app.screen.width/2 + _width/2)
    legend.y -= (_y - app.screen.height/2 + _height/2)
}


