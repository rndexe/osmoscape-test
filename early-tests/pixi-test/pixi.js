const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xb3ced5, resolution: window.devicePixelRatio || 1,
    antialias: true,
});

const player = new Tone.Player ({
    url : "../../_data/audio/loops/-1.mp3",
    loop: true,
    onload: () => {
        player.start();
        player.connect(fft)
    }
}).toDestination();

const fft = new Tone.FFT ({
    size: 16
});

let tick = 0;

document.body.appendChild(app.view);
gsap.registerPlugin(PixiPlugin);
const moleculeContainer = new PIXI.Container();
moleculeContainer.interactive = true;
moleculeContainer.buttonMode = true;
app.stage.addChild(moleculeContainer);

// Create a new texture
const molecule = new PIXI.Graphics();
molecule.lineStyle(1, 0xb67339, 1);
molecule.beginFill(0xeaf1f3, 0.53);
molecule.drawCircle(0, 0, 137.5);
molecule.endFill();
molecule.drawCircle(0, 0, 132.5);
molecule.drawCircle(0, 0, 127.5);
molecule.drawCircle(0, 0, 122.5);
molecule.drawCircle(0, 0, 82.44);
molecule.drawCircle(0, 0, 64);
molecule.drawCircle(0, 0, 42.8);
molecule.drawCircle(0, 0, 38.6);
molecule.drawCircle(0, 0, 27.4);
molecule.moveTo(97.22,-97.22);
molecule.lineTo(97.22+48.5,-97.22-48.5);
molecule.moveTo(97.22,97.22);
molecule.lineTo(97.22+48.5,97.22+48.5);
molecule.drawCircle(97.22+37.5+37.5, -97.22-37.5-37.5, 37.5);
molecule.drawCircle(97.22+37.5+37.5, +97.22+37.5+37.5, 37.5);
//molecule.moveTo(53, 53);
//molecule.lineTo(77,77);
molecule.lineStyle(1, 0xFFFFFF, 1);
molecule.drawCircle(0, 0, 76.2);
molecule.drawCircle(0, 0, 70.0);
molecule.drawCircle(0, 0, 57.8);
molecule.drawCircle(0, 0, 31.3);
molecule.drawCircle(0, 0, 20.3);
molecule.drawCircle(0, 0, 12.8);
molecule.drawCircle(0, 0, 8.2);
molecule.drawCircle(97.22+37.5+37.5, -97.22-37.5-37.5, 12.5);
molecule.drawCircle(97.22+37.5+37.5, +97.22+37.5+37.5, 12.5);

const boundary = new PIXI.Graphics();
boundary.lineStyle(3, 0xb67339, 1);
boundary.drawCircle(0, 0, 137.5);

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

moleculeContainer.x = app.screen.width / 2;
moleculeContainer.y = app.screen.height / 2;


const fftVisualizer= new PIXI.Graphics();

app.stage.addChild(fftVisualizer);
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
    }
}

app.ticker.speed = 2

app.ticker.add(() => {

    if(player.state ==="started") {
        fftVisualizer.clear();
        const fftData = fft.getValue();

        const ampData = fftData.map(x => Math.min(100,Math.floor(Math.pow(2,Math.abs(x)/20))));

        fftVisualizer.lineStyle(1,0xFFFFFF,1)
        console.log(ampData)
        //

        ampData.forEach((x,i) => {
            if(i== 10)
            fftVisualizer.drawCircle(0, 0, x*10);
        });
    }

    molecule.clear();
molecule.lineStyle(1, 0xb67339, 1);
molecule.beginFill(0xeaf1f3, 0.53);
molecule.drawCircle(0, 0, 137.5*Math.sin(tick));
molecule.endFill();
molecule.drawCircle(0, 0, 132.5*Math.sin(tick));
molecule.drawCircle(0, 0, 127.5);
molecule.drawCircle(0, 0, 122.5);
molecule.drawCircle(0, 0, 82.44);
molecule.drawCircle(0, 0, 64);
molecule.drawCircle(0, 0, 42.8);
molecule.drawCircle(0, 0, 38.6);
molecule.drawCircle(0, 0, 27.4);
molecule.moveTo(97.22,-97.22);
molecule.lineTo(97.22+48.5,-97.22-48.5);
molecule.moveTo(97.22,97.22);
molecule.lineTo(97.22+48.5,97.22+48.5);
molecule.drawCircle(97.22+37.5+37.5, -97.22-37.5-37.5, 37.5);
molecule.drawCircle(97.22+37.5+37.5, +97.22+37.5+37.5, 37.5);
//molecule.moveTo(53, 53);
//molecule.lineTo(77,77);
molecule.lineStyle(1, 0xFFFFFF, 1);
molecule.drawCircle(0, 0, 76.2);
molecule.drawCircle(0, 0, 70.0);
molecule.drawCircle(0, 0, 57.8);
molecule.drawCircle(0, 0, 31.3);
molecule.drawCircle(0, 0, 20.3);
molecule.drawCircle(0, 0, 12.8);
molecule.drawCircle(0, 0, 8.2);
molecule.drawCircle(97.22+37.5+37.5, -97.22-37.5-37.5, 12.5);
molecule.drawCircle(97.22+37.5+37.5, +97.22+37.5+37.5, 12.5);


    tick += 0.02;
});

