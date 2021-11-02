const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
});

let datasets,mergedSoundAreas;
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
            soundeffects.crossfade.fade.rampTo(0,0.2)
            if(soundareas.currentArea.containsPoint(newPosition)) {
                soundeffects.crossfade.fade.rampTo(1,0.2)
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
        this.grainplayer.buffer = buffers.get(num); 
        this.player.buffer = buffers.get(num);

        this.player.start();
        this.grainplayer.start();
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
        this.areas = {};
    }
    setNew(num) {
        if(num in this.areas) {
            this.currentArea = this.areas[num];
            this.setInitialPositionAndScale(num)
        }
        else {
            this.loadNew(num)
            this.currentArea = this.areas[num];
            this.setInitialPositionAndScale(num)
        }
    }
    setInitialPositionAndScale(num) {
        let bounds = this.areas[num].getBounds()
        let scale=(window.innerWidth-200)/bounds.width;
        this.areas[num].scale.set(scale*0.75)
        let newBounds = this.areas[num].getBounds()
        let startx = this.areas[num].x - newBounds.x+100;
        let starty = this.areas[num].y - newBounds.y+100;
        this.areas[num].startx = startx;
        this.areas[num].starty = starty;
        this.areas[num].x = startx;
        this.areas[num].y = starty;

        this.currentBounds = this.areas[num].getBounds()
        console.log("Bounds:",this.currentBounds);
    }
    setNewPositionAndScale(num, newx, newy) {
        this.areas[num].x = newx;
        this.areas[num].y = newy;
        this.currentBounds = this.areas[num].getBounds()
        //     console.log("Position:",this.areas[num].getBounds());
    }
    loadNew(num) {
        let soundArea = JSON.parse(mergedSoundAreas[num]);
        //let rect = soundArea.shapes[0][0].shape;
        let shapeArray = soundArea.shapes.default;
        console.log(shapeArray)
        if (datasets[num].rect === "true") {
            let rect = shapeArray[0].shape;
            console.log(rect)
            this.areas[num] = new PIXI.Graphics()
                .beginFill(0xFFA500,0.2)
                .drawRect(rect[0], rect[1], rect[2]-rect[0], rect[3]-rect[1]);
        } else {
            this.areas[num] = shapeArray.reduce((graphics, shape, index, array) => {
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
        }
    }
}

const molecule = new Molecule();
const soundareas = new SoundInteractionArea();
const soundeffects = new SoundEffects();
let mergedSoundURL = '../data/mergedSoundAreas_v2.json';
let mergedCsvURL = '../data/csv/mergedCsvData.json';
let dataURL = '../data/dataSummary.json';
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
    $("#p").on("click",() => {
        loadBuffers();
    });
});

$("#m").on("change", function() {
    let i = ($(this).val());
    if(i in datasets) {
        console.log(i,datasets[i].title)
        app.stage.removeChildren();
        $("p").text(datasets[i].title);
        soundareas.setNew(i);
        soundeffects.setNewBuffer(i);
        //app.stage.addChild(soundareas.currentArea)
        app.stage.addChild(molecule.moleculeContainer);

    } else {
        $("p").text("No dataset for that id");
    }
});


const loadBuffers = () => {
    buffers = new Tone.ToneAudioBuffers({
        urls: {
            "4": "4.mp3",
            "5": "5.mp3",
            "7": "7.mp3",
            "8": "8.mp3",
            "9": "9.mp3",
            "11": "11.mp3",
            "14": "14.mp3",
            "15": "15.mp3",
            "16": "16.mp3",
            "32": "32.mp3",
            "36": "36.mp3",
            "38": "38.mp3",
            "44": "44.mp3",
            "45": "45.mp3",
            "50": "50.mp3",
            "53": "53.mp3",
            "55": "55.mp3",
            "63": "63.mp3",
            "48": "48.mp3",
        },
        onload: async () => {
            console.log("Sound loops loaded");
            $("#p").text("Loaded");
            $("#p").prop("disabled", true);

            await Tone.start();
            console.log("Context started");
        },
        baseUrl: "../data/audio/loops/"
    });
}

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

const throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}


