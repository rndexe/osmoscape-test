let sprite, graphic, hitAreaShapes;
let polygons;
const ea = ["delay","vibrato","pitchshift"];
changeToneContext();
const crossfade = new Tone.CrossFade({
    fade : 0
}).toDestination();
class Sounds {
    
    constructor (file,effectNameArray,isCSV) {
        this.player = new Tone.Player({
            url : file,
            loop : true,
        }).connect(crossfade.a);
        this.grainplayer = new Tone.GrainPlayer({
            url : file,
            loop : true,
        });
        this.isCSV = isCSV;
        this.createEffectChain(effectNameArray); 
    }
    
    createEffectChain(effectNameArray) {
        
        const effectArray = effectNameArray.map(i => effects.effectnames[i])
        this.grainplayer.connect(effectArray[0]);
        for (let i = 0; i < effectArray.length-1; i++) {
            console.log(effectArray[i].name,"connected to",effectArray[i+1].name);
            effectArray[i].connect(effectArray[i+1])
        }
        effectArray[effectArray.length-1].connect(crossfade.b);
       // return effectArray;
    }    
}

class Effects {

    constructor() {
        this.delay = new Tone.Delay();
        this.pitchshift = new Tone.PitchShift();
        this.vibrato = new Tone.Vibrato();

        this.effectnames = {

            "delay" : this.delay,
            "reverb" : this.reverb,
            "vibrato" : this.vibrato,
            "pitchshift" : this.pitchshift,

        }

    }

    getEffectFromEffectName(effectName) {
        return this.effectnames[effectName];
    }
    updateParameters(effectName,parameter1,parameter2){
        

    }
}
const effects = new Effects();
const sound = new Sounds("../data/audio/loops/1.mp3",ea)

function changeToneContext() {
    const context = new Tone.Context({ latencyHint: "balanced"});
    Tone.setContext(context);
    const crossfade = new Tone.CrossFade({
        fade : 0
    }).toDestination();
}
// Physicseditor Exporter with phaser(P2)
fetch('./water-space-mask.json')
    .then(data => data.json())
    .then(data => {
        polygons = data;
        hitAreaShapes = new HitAreaShapes(polygons);
        legend.hitArea = hitAreaShapes
        createSpriteShape();
    });

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
});
app.renderer.plugins.interaction.interactionFrequency = 150;
document.body.appendChild(app.view);


const legendTexture = new PIXI.Texture.from('legend.svg')
const legend = new PIXI.Sprite(legendTexture)
const moleculeContainer = new PIXI.Container();
const legendContainer = new PIXI.Container();
legendContainer.addChild(legend);
moleculeContainer.interactive = true;
moleculeContainer.buttonMode = true;
app.stage.addChild(legendContainer);
app.stage.addChild(moleculeContainer);

// Create a new texture
const molecule = new PIXI.Graphics()
    .lineStyle(1, 0xb67339, 1)
    .beginFill(0xeaf1f3, 0.53)
    .drawCircle(0, 0, 75)
    .endFill()
    .drawCircle(0, 0, 25)
moleculeContainer.addChild(molecule);
moleculeContainer.on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
// Move container to the center

//moleculeContainer.pivot.x = moleculeContainer.width / 2;
//moleculeContainer.pivot.y = moleculeContainer.height / 2;
//legend.anchor.set(0.5);
legend.scale.set(1.5);
legend.interactive = true;
//legend.hitArea = new PIXI.Circle(0,-30,150)
moleculeContainer.x = app.screen.width / 2;
moleculeContainer.y = app.screen.height / 2;
//legendContainer.x = app.screen.width / 2;
//legendContainer.y = app.screen.height / 2;

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
//        console.log(newPosition)
        const local = legend.toLocal(newPosition)
       crossfade.fade.rampTo(0,0.2)
        if(legend.hitArea.contains(local.x,local.y)) {
            console.log("molecule inside hitest")
            console.log(newPosition)
            crossfade.fade.rampTo(1,0.02)
        }
    }
}

function createSpriteShape() {
    graphic = hitAreaShapes.shapes.reduce((graphic, shape, index, array) => {

        if (index === 0) graphic.beginFill(0x00ffcc);

        graphic.drawPolygon(shape)

        if (index === array.length - 1) {
            graphic.endFill();
            graphic.visible = true;
        };

        return graphic;

    }, new PIXI.Graphics());

    legend.addChild(graphic);
}

function throttled(delay, fn) {
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

document.getElementById("play").onclick = function() {
    Tone.start();
    sound.player.start();
    sound.grainplayer.start();
}
