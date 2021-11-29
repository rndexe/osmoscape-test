const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    view: canvas
});

const effectData = {
     "14" : {
        "invertY" : true
    },
     "15" : {
        "pitchshift" : {
            "min" : 36,
            "max" : -12
        }
    },
      "16" : {
        "pitchshift" : {
            "min" : 36,
            "max" : -12
        }
    },
       "17" : {
        "pitchshift" : {
            "min" : 36,
            "max" : -12
        }
    },
     "19" : {
        "invertY" : true
    },
      "24" : {
        "invertY" : true
    },
   "30" : {
        "pitchshift" : {
            "min" : -36,
            "max" : 36
        },
        "grainsize" : {
            "min" : 0.01,
            "max" : 0.8
        }
    },
    "33" : {
        "pitchshift" : {
            "min" : -36,
            "max" : 12
        }
    },
    "35" : {
        "pitchshift" : {
            "min" : -36,
            "max" : 12
        }
    },
    "36" : {
        "pitchshift" : {
            "min" : -48,
            "max" : -12
        }
    },
    "37" : {
        "pitchshift" : {
            "min" : -18,
            "max" : 6
        }
    },
    "38" : {
        "pitchshift" : {
            "min" : -18,
            "max" : 6
        }
    },
    "40" : {
        "pitchshift" : {
            "min" : -36,
            "max" : -12
        },
        "invertY" : true
    },
    "41" : {
        "pitchshift" : {
            "min" : -24,
            "max" : -12
        },
        "invertY" : true
    },
    "42" : {
        "pitchshift" : {
            "min" : -36,
            "max" : -30
        },
        "detune" : {
            "min" : 0,
            "max" : 24
        },
        "grainsize" : {
            "min" : 2,
            "max" : 3
        },
         "freq" : {
            "min" : 0.3,
            "max" : 1
        },
        "depth" : {
            "min" : 0,
            "max" : 1
        },
    },
    "43" : {
        "grainsize" : {
            "min" : 0.01,
            "max" : 0.5
        },
        "detune" : {
            "min" : -24,
            "max" : 2
        },
        "freq" : {
            "min" : 0.3,
            "max" : 10
        },
        "depth" : {
            "min" : 0,
            "max" : 0.2
        },
        "pitchshift" : {
            "min" : -24,
            "max" : 7
        },
        "delay" : {
            "min" : 0.01,
            "max" : 0.8
        }
 
    },
    "44" : {
        "pitchshift" : {
            "min" : -36,
            "max" : 0
        },
        "invertY" : true
    },
    "45" : {
        "invertY" : true
    },
    "46" : {
        "pitchshift" : {
            "min" : -36,
            "max" : 12
        }
    },
    "48" : {
        "pitchshift" : {
            "min" : -36,
            "max" : 12
        }
    },
     "50" : {
         "grainsize" : {
            "min" : 0.01,
            "max" : 0.5
        },
        "detune" : {
            "min" : -40,
            "max" : 10
        },
        "freq" : {
            "min" : 0.3,
            "max" : 2
        },
        "depth" : {
            "min" : 0,
            "max" : 1
        },
        "pitchshift" : {
            "min" : -10,
            "max" : 0
        },
        "delay" : {
            "min" : 0,
            "max" : 1
        },
        "invertY" : true
    },
    "52" : {
          "grainsize" : {
           "min" : 0.01,
            "max" : 1
        },
        "detune" : {
            "min" : -10,
            "max" : 10
        },
        "freq" : {
            "min" : 0.3,
            "max" : 4
        },
        "depth" : {
            "min" : 0,
            "max" : 0.5
        },
        "pitchshift" : {
            "min" : -24,
            "max" : 1
        },
        "delay" : {
            "min" : 0,
            "max" : 1
        }
    },
    "53" : {
         "grainsize" : {
           "min" : 0.01,
            "max" : 1
        },
        "detune" : {
            "min" : -10,
            "max" : 10
        },
        "freq" : {
            "min" : 0.3,
            "max" : 4
        },
        "depth" : {
            "min" : 0,
            "max" : .01
        },
        "pitchshift" : {
            "min" : -24,
            "max" : 1
        },
        "delay" : {
            "min" : 0,
            "max" : 1
        },
        "invertY" : true
    },
    "55" : {
          "grainsize" : {
            "min" : 0.01,
            "max" : 2
        },
        "detune" : {
            "min" : -5,
            "max" : 24
        },
        "freq" : {
            "min" : 0.3,
            "max" : 4
        },
        "depth" : {
            "min" : 0,
            "max" : 1
        },
        "pitchshift" : {
            "min" : -24,
            "max" : 30
        },
        "delay" : {
            "min" : 0,
            "max" : 0.05
        },
        "invertY" : true
    },
    "58" : {
        "grainsize" : {
            "min" : 0.01,
            "max" : 0.5
        },
        "detune" : {
            "min" : -24,
            "max" : 24
        },
        "freq" : {
            "min" : 0.3,
            "max" : 0.5
        },
        "depth" : {
            "min" : 0,
            "max" : 1
        },
        "pitchshift" : {
            "min" : -5,
            "max" : 24
        },
        "delay" : {
            "min" : 0.01,
            "max" : 0.6
        },
        "invertY" : true
    },
     "60" : {
        "grainsize" : {
            "min" : 0.01,
            "max" : 0.5
        },
        "detune" : {
            "min" : -24,
            "max" : 24
        },
        "freq" : {
            "min" : 0.3,
            "max" : 0.5
        },
        "depth" : {
            "min" : 0,
            "max" : 1
        },
        "pitchshift" : {
            "min" : -5,
            "max" : 24
        },
        "delay" : {
            "min" : 0.01,
            "max" : 0.6
        }
    },
    "63" : {
         "grainsize" : {
            "min" : 0.01,
            "max" : 0.5
        },
        "detune" : {
            "min" : -24,
            "max" : 24
        },
        "freq" : {
            "min" : 0.3,
            "max" : 1.5
        },
        "depth" : {
            "min" : 0,
            "max" : 1
        },
        "pitchshift" : {
            "min" : -5,
            "max" : 15
        },
        "delay" : {
            "min" : 0.01,
            "max" : 0.1
        }
    },
    "64" : {
         "grainsize" : {
            "min" : 0.01,
            "max" : 0.3
        },
        "detune" : {
            "min" : -24,
            "max" : 10
        },
        "freq" : {
            "min" : 0.3,
            "max" : 0.7
        },
        "depth" : {
            "min" : 0,
            "max" : 1
        },
        "pitchshift" : {
            "min" : -3,
            "max" : 0
        },
        "delay" : {
            "min" : 0.01,
            "max" : 1
        }
    }
}
let datasets,mergedSoundAreas,mergedLegends;
let mainScrollScale;
let mainScrollWidth;
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
                this.id = num;
                this.setDefaultParameterRange();
                this.player.start();
                this.grainplayer.start();
            }
        }
        ); 
    }
    setDefaultParameterRange() {

        if (effectData.hasOwnProperty(this.id) && effectData[this.id].hasOwnProperty("delay")) {
            this.delayRange = (effectData[this.id].delay.max - effectData[this.id].delay.min);
            this.delayMin = effectData[this.id].delay.min;
        } else {
            this.delayRange = (0.6 - 0.01);
            this.delayMin = 0.01;
        }
        if (effectData.hasOwnProperty(this.id) && effectData[this.id].hasOwnProperty("freq")) {
            this.freqRange = (effectData[this.id].freq.max - effectData[this.id].freq.min);
            this.freqMin = effectData[this.id].freq.min;
        } else {
            this.freqRange = (10 - 0.3);
            this.freqMin = 0.3;
        }
        if (effectData.hasOwnProperty(this.id) && effectData[this.id].hasOwnProperty("depth")) {
            this.depthRange = (effectData[this.id].depth.max - effectData[this.id].depth.min);
            this.depthMin = effectData[this.id].depth.min;
        } else {
            this.depthRange = (1 - 0);
            this.depthMin = 0;
        }
        if (effectData.hasOwnProperty(this.id) && effectData[this.id].hasOwnProperty("pitchshift")) {
            this.pitchRange = (effectData[this.id].pitchshift.max - effectData[this.id].pitchshift.min);
            this.pitchMin = effectData[this.id].pitchshift.min;
        } else {
            this.pitchRange = (24 + 24);
            this.pitchMin = -24;
        }
        if (effectData.hasOwnProperty(this.id) && effectData[this.id].hasOwnProperty("detune")) {
            this.detuneRange = (effectData[this.id].detune.max - effectData[this.id].detune.min);
            this.detuneMin = effectData[this.id].detune.min;

        } else {
            this.detuneRange = (24 + 24);
            this.detuneMin = -24;
        }
        if (effectData.hasOwnProperty(this.id) && effectData[this.id].hasOwnProperty("grainsize")) {
            this.grainSizeRange = (effectData[this.id].grainsize.max - effectData[this.id].grainsize.min);
            this.grainSizeMin = effectData[this.id].grainsize.min;
        } else {
            this.grainSizeRange = (3 - 0.01);
            this.grainSizeMin = 0.01;
        }
        this.loopStartRange = this.grainplayer.buffer.duration/2;
        this.loopStartMin = 0;
        this.loopEndRange = this.grainplayer.buffer.duration/2;
        this.loopEndMin = this.grainplayer.buffer.duration/2;

    }
    setDefaultParameterRangeFromInput() {
        this.delayRange = ($("#dtmx").val()-$("#dtmn").val())
        this.delayMin = $("#dtmn").val()

        this.freqRange = ($("#vfmx").val()-$("#vfmn").val())
        this.freqMin = ($("#vfmn").val())
        this.depthRange = ($("#vdmx").val()-$("#vdmn").val())
        this.depthMin = $("#vdmn").val()

        this.pitchRange = ($("#pmx").val()-$("#pmn").val())
        this.pitchMin = $("#pmn").val()

        this.detuneRange = ($("#dmx").val()-$("#dmn").val())
        this.detuneMin = $("#dmn").val()
        this.grainSizeRange = ($("#gsmx").val()-$("#gsmn").val())
        this.grainSizeMin = $("#gsmn").val();
        this.loopStartRange = this.grainplayer.buffer.duration/2;
        this.loopStartMin = 0;
        this.loopEndRange = this.grainplayer.buffer.duration/2;
        this.loopEndMin = this.grainplayer.buffer.duration/2;
    }
    changeParameters(np) {

        if ( effectData.hasOwnProperty(this.id) && effectData[this.id].hasOwnProperty("invertY")){
            np.ny = 1.0 - np.ny;
            np.navg = (np.nx+np.ny)/2;
        }
        this.delay.delayTime.rampTo(np.navg * this.delayRange + this.delayMin*1,0.1);

        this.vibrato.frequency.rampTo(np.ny * this.freqRange + this.freqMin*1,0.1);
        this.vibrato.depth.rampTo(np.nx * this.depthRange + this.depthMin*1,0.1);

        this.pitchshift.pitch = np.navg * this.pitchRange + this.pitchMin*1;

        this.grainplayer.detune = np.nx * this.detuneRange + this.detuneMin*1;
        this.grainplayer.grainSize = np.nx * this.grainSizeRange + this.grainSizeMin*1; 
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
        //this is only for loading sound areas, not legends with them
        this.currentBounds = this.areaContainer.getBounds();
        if (this.currentBounds.height > this.currentBounds.width) {
            this.areaContainer.scale.set(app.screen.height/this.currentBounds.height * 0.5)
        } else {
            this.areaContainer.scale.set(app.screen.width/this.currentBounds.width * 0.75)
        }
        this.currentBounds = this.areaContainer.getBounds();
        this.areaContainer.x -= this.currentBounds.x
        this.areaContainer.y -= this.currentBounds.y
        this.areaContainer.y += 100
        this.areaContainer.x += 200


        this.currentBounds = this.areaContainer.getBounds();
        console.log(this.currentBounds)

        //console.log(this.areaContainer.x) 
    }
    setNewPositionAndScale(num, newx, newy) {
        this.areas[num].x = newx;
        this.areas[num].y = newy;
        this.currentBounds = this.areas[num].getBounds()
        //     console.log("Position:",this.areas[num].getBounds());
    }
    loadNew(num) {
        this.areaContainer.removeChildren()
        let soundArea = JSON.parse(mergedSoundAreas[num]);
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
let mergedSoundURL = '../_data/mergedSoundAreas_mine.json';
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
            //loadLegend(i)
            soundeffects.setNewBuffer(i);
            app.stage.addChild(molecule.moleculeContainer);
            soundareas.setNew(i,1,50);
            app.stage.addChild(soundareas.areaContainer)
        } else {
            $("p").text(i + datasets[i].title + " has no popdimensions");
        }
    } else {
        $("p").text("No dataset for id number " + i);
        app.stage.removeChildren();
    }
});
//$("#t").on("change", function() {
//    soundeffects.setDefaultParameterRangeFromInput();
//});

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

const loadLegend = (id) => {

    if (datasets.hasOwnProperty(id)) {
        console.log('Loading data for : ' + id);
        let legenddata = mergedLegends[id];
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


