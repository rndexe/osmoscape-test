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
            soundeffects.crossfade.fade.rampTo(0,0.02)
            if(soundareas.currentArea.containsPoint(newPosition)) {
            //console.log("inside",newPosition)
                soundeffects.crossfade.fade.rampTo(1,0.02)

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
        this.grainplayer.buffer = buffers.get(num); 
        this.player.buffer = buffers.get(num);

        this.player.start();
        this.grainplayer.start();
    }

}
class SoundInteractionArea {

    constructor() {
        this.areas = {};
         
    }

    setNew(num) {
    
        if(num in this.areas) {
            this.currentArea = this.areas[num];
            this.setInitialPosition(num)
        }
        else {
            this.loadNew(num)
            this.currentArea = this.areas[num];
            this.setInitialPosition(num)
        }
    }

    setInitialPosition(num) {
        
        let startx = this.areas[num].x - this.areas[num].getBounds().x + 100;
        this.areas[num].startx = startx;
        this.areas[num].x = startx;
        console.log("Position:",this.areas[num].getBounds());
    }

    setNewPosition(num, newx, newy) {
        this.areas[num].x = newx;
        this.areas[num].y = newy;
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
                .lineStyle(1, 0xFF0000)
                .drawRect(rect[0], rect[1], rect[2]-rect[0], rect[3]-rect[1]);
        } else {
            this.areas[num] = shapeArray.reduce((graphics, shape, index, array) => {

                if (index === 0) { 
                    graphics.beginFill(0xFFA500);
                    graphics.lineStyle(1, 0xFF0000);
                    graphics.alpha = 0.2;
                }
                //        console.log(shape.shape)
                graphics.drawPolygon(shape.shape)

                if (index === array.length - 1) {
                    graphics.endFill();
                    graphics.visible = true;
                };

                return graphics;

            }, new PIXI.Graphics());

        }
        //    graphics.hitArea = graphics;
        //app.stage.addChild(graphics)

    }

}

const molecule = new Molecule();
const soundareas = new SoundInteractionArea();
const soundeffects = new SoundEffects();
let mergedSoundURL = '../data/mergedSoundAreas.json';
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

    //
    console.log("Loading Soundarea data from: " + mergedSoundURL);
    $.getJSON(mergedSoundURL, function( data ) {
        mergedSoundAreas = data;
        console.log("Loaded Soundarea data");
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
        //console.log(soundareas)
        app.stage.addChild(soundareas.currentArea)
        //loadSoundInteractionArea(i)
        app.stage.addChild(molecule.moleculeContainer);
        
    } else {
        $("p").text("No dataset for that id");
    }
});


function loadBuffers() {
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
            "48a": "48.mp3",
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

