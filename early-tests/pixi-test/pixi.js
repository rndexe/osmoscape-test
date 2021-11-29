const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xb3ced5, resolution: window.devicePixelRatio || 1,
    antialias: true,
});
document.body.appendChild(app.view);
gsap.registerPlugin(PixiPlugin);
//const legendTexture = new PIXI.Texture.from('legend.svg')
//const legend = new PIXI.Sprite(legendTexture)
const moleculeContainer = new PIXI.Container();
//const legendContainer = new PIXI.Container();
//legendContainer.addChild(legend);
moleculeContainer.interactive = true;
moleculeContainer.buttonMode = true;
//app.stage.addChild(legendContainer);
app.stage.addChild(moleculeContainer);

// Create a new texture
const molecule = new PIXI.Graphics();
const boundary = new PIXI.Graphics();
molecule.lineStyle(1, 0xb67339, 1);
molecule.beginFill(0xeaf1f3, 0.53);
molecule.drawCircle(0, 0, 75);
molecule.endFill();
molecule.drawCircle(0, 0, 25);
boundary.lineStyle(3, 0xb67339, 1);
boundary.drawCircle(0, 0, 75);
moleculeContainer.addChild(boundary);
moleculeContainer.addChild(molecule);
        moleculeContainer.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

gsap.to(boundary.scale, {
    x: 1.2, y: 1.2, duration: 1, repeat: -1, ease: "back"
});
gsap.to(boundary, {
    alpha: 0, duration: 1, repeat: -1, ease: "back"
});
// Move container to the center

//moleculeContainer.pivot.x = moleculeContainer.width / 2;
//moleculeContainer.pivot.y = moleculeContainer.height / 2;
//legend.anchor.set(0.5);
//legend.scale.set(1.2);
//legend.interactive = true;
//legend.hitArea = new PIXI.Circle(0,-30,150)
//const hitareagraphics = new PIXI.Graphics().lineStyle(1,0xFFFFFF,1).drawCircle(0,-30,150)
//legend.addChild(hitareagraphics)
moleculeContainer.x = app.screen.width / 2;
moleculeContainer.y = app.screen.height / 2;
//legendContainer.x = app.screen.width / 2;
//legendContainer.y = app.screen.height / 2;

/*const sprites = new PIXI.ParticleContainer(10, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
});*/
//moleculeContainer.addChild(sprites);

const particles = [];
    const dudeG = new PIXI.Graphics()
        dudeG.lineStyle(1,0xFFFFFF,1).drawRect(0,0,10,10);

    const tex = app.renderer.generateTexture(dudeG)
for (let i = 0; i < 10; i++) {
    // create a new Sprite
    // set the anchor point so the texture is centerd on the sprite
    const dude = new PIXI.Sprite(tex)

    dude.anchor.set(0.5);

    // different maggots, different sizes
    dude.scale.set(0.8 + Math.random() * 0.3);

    // scatter them all
    dude.x = Math.random() * moleculeContainer.width;
    dude.y = Math.random() * moleculeContainer.height;

//    dude.tint = Math.random() * 0x808080;

    // create a random direction in radians
    dude.direction = Math.random() * Math.PI * 2;

    // this number will be used to modify the direction of the sprite over time
    dude.turningSpeed = Math.random() - 0.8;

    // create a random speed between 0 - 2, and these maggots are slooww
    dude.speed = (2 + Math.random() * 2) * 0.2;

    dude.offset = Math.random() * 100;

    // finally we push the dude into the maggots array so it it can be easily accessed later
    particles.push(dude);

    //sprites.addChild(dude);
}

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
        //console.log(newPosition)
    //    const local = legend.toLocal(newPosition)
    //    if(legend.hitArea.contains(local.x,local.y)) {
    //        console.log("molecule inside hitest")
    //    }
    }
}

let tick = 0;

app.ticker.add(() => {
    // iterate through the sprites and update their position
    /*for (let i = 0; i < particles.length; i++) {
        const dude = particles[i];
        dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
        dude.direction += dude.turningSpeed * 0.01;
        dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
        dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
        dude.rotation = -dude.direction + Math.PI;

    }

    // increment the ticker
    tick += 0.1;*/

});
