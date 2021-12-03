const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x121212,
    //backgroundColor: 0xb3ced5,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
});

console.log(app.renderer.multisample)
const player = new Tone.Player ({
    url : "../../_data/audio/loops/-1.mp3",
    loop: true,
    onload: () => {
        player.start();
        player.connect(fft)
        player.connect(meter)
    }
}).toDestination();

const fft = new Tone.FFT ({
    size: 16,
    smoothing : 0.75,
    normalRange : false
});

const meter = new Tone.Meter ({
    size: 16,
    smoothing : 0.75,
    normalRange : true
});

let tick = 0;

const dropShadow = new PIXI.filters.DropShadowFilter();
document.body.appendChild(app.view);
const fftVisualizer = new PIXI.Graphics();
const fftVisualizer2 = new PIXI.Graphics();
const fftVisualizer3 = new PIXI.Graphics();
const fftVisualizer4 = new PIXI.ParticleContainer(500);
fftVisualizer2.filters = [dropShadow];
fftVisualizer3.filters = [dropShadow];
//fftVisualizer4.filters = [dropShadow];
fftVisualizer4.width = 200;
fftVisualizer4.height = 200;
//const circle = new PIXI.Graphics().lineStyle(200,0xFFFFFF,1).drawCircle(0,0,1000);
const circle = new PIXI.Graphics().beginFill(0xFFFFFF,0.2).drawCircle(0,0,1000).endFill();
const tex = app.renderer.generateTexture(circle);

const particles = [];
const c = new PIXI.Sprite(tex)
c.x = 100
c.y = 100
c.scale.set(1/100,1/100)
app.stage.addChild(c)
for (let i=0; i<100; i++) {
    const p = new PIXI.Sprite(tex)
    p.anchor.set(0.5)
    p.angle = Math.random()*Math.PI*2
    p.radius = Math.random()*200
    p.speed = Math.random()
    p.randomsize = Math.random()*8+1
    p.scale.set(p.randomsize/1000,p.randomsize/1000)
    //p.width = p.randomsize;
    //p.height = p.randomsize;
    p.x = p.radius * Math.cos(p.angle);
    p.y = p.radius * Math.sin(p.angle);
    p.freq = Math.floor(Math.random()*15)
    particles.push(p)
    fftVisualizer4.addChild(p);
}
fftVisualizer.lineStyle(1,0xFFFFFF,1)
fftVisualizer2.lineStyle(1,0xFFFFFF,1)
fftVisualizer3.lineStyle(1,0xFFFFFF,1)

//fftVisualizer.x = app.screen.width / 2;
//fftVisualizer.y = app.screen.height / 2;

fftVisualizer2.x = 3 * app.screen.width / 4;
fftVisualizer2.y = app.screen.height / 4;

fftVisualizer3.x = app.screen.width / 4;
fftVisualizer3.y = 3* app.screen.height / 4;
fftVisualizer4.x = 3* app.screen.width / 4;
fftVisualizer4.y = 3* app.screen.height / 4;
app.stage.addChild(fftVisualizer2);
app.stage.addChild(fftVisualizer3);
app.stage.addChild(fftVisualizer4);
const moleculeContainer = new PIXI.Container();
moleculeContainer.addChild(fftVisualizer);
//moleculeContainer.filters = [dropShadow];
app.stage.addChild(moleculeContainer);

// Create a new texture
const molecule = new PIXI.Graphics();
molecule.lineStyle(2, 0xb67339, 1);
molecule.drawCircle(0, 0, 137.5);
molecule.endFill();
molecule.drawCircle(0, 0, 132.5);
molecule.drawCircle(0, 0, 127.5);
molecule.drawCircle(0, 0, 122.5);
//molecule.drawCircle(0, 0, 82.44);
//molecule.drawCircle(0, 0, 64);
//molecule.drawCircle(0, 0, 42.8);
//molecule.drawCircle(0, 0, 38.6);
//molecule.drawCircle(0, 0, 27.4);
molecule.moveTo(97.22,-97.22);
molecule.lineTo(97.22+48.5,-97.22-48.5);
molecule.moveTo(97.22,97.22);
molecule.lineTo(97.22+48.5,97.22+48.5);
molecule.drawCircle(97.22+37.5+37.5, -97.22-37.5-37.5, 37.5);
molecule.drawCircle(97.22+37.5+37.5, +97.22+37.5+37.5, 37.5);
//molecule.moveTo(53, 53);
//molecule.lineTo(77,77);
molecule.lineStyle(2, 0xFFFFFF, 1);
//molecule.drawCircle(0, 0, 76.2);
//molecule.drawCircle(0, 0, 70.0);
//molecule.drawCircle(0, 0, 57.8);
//molecule.drawCircle(0, 0, 31.3);
//molecule.drawCircle(0, 0, 20.3);
//molecule.drawCircle(0, 0, 12.8);
//molecule.drawCircle(0, 0, 8.2);
molecule.drawCircle(97.22+37.5+37.5, -97.22-37.5-37.5, 12.5);
molecule.drawCircle(97.22+37.5+37.5, +97.22+37.5+37.5, 12.5);


moleculeContainer.addChild(molecule);

//gsap.to(boundary.scale, {
//    x: 1.2, y: 1.2, duration: 1, repeat: -1, ease: "back"
//});
//gsap.to(boundary, {
//    alpha: 0, duration: 1, repeat: -1, ease: "back"
//});
// Move container to the center

moleculeContainer.x = app.screen.width / 2;
moleculeContainer.y = app.screen.height / 2;



app.ticker.add(() => {

        fftVisualizer.clear();
        fftVisualizer2.clear();
        fftVisualizer3.clear();
        fftVisualizer4.removeChildren();
        fftVisualizer.lineStyle(1,0xFFFFFF,1)
        fftVisualizer2.lineStyle(1,0xFFFFFF,1)
        fftVisualizer3.beginFill(0xFFFFFF)

        const fftData = fft.getValue();
        const ampData2 = fftData.map(x => {
            let y= (x + 140);
            y = y*(80)/140 + 20
            return y
        });
        const ampData = fftData.map(x => {
            let y= (x + 140);
            return y
        });
        ampData.forEach((x,i) => {
            fftVisualizer.drawCircle(0, 0, x);
//            if ( i > 4 && i < 13)
        });
        const ampData3 = fftData.map(x => {
            let y= (x + 140);
            return y
        });
        ampData2.forEach((x,i) => {

            if( i < 8 )
                fftVisualizer2.lineTo(x*Math.cos(i*2*Math.PI/8), -1*x*Math.sin(i*2*Math.PI/8));
            else
                fftVisualizer2.lineTo(x*Math.cos((2*i-15)*Math.PI/8), -1*x*Math.sin((2*i-15)*Math.PI/8));
            fftVisualizer2.moveTo(0,0);
        });
        ampData3.forEach((x,i) => {
            if ( i > 1 && i < 15) 
            fftVisualizer3.drawCircle(10*i*Math.cos(tick*0.02*i+1.618*i),10*i*Math.sin(tick*0.02*i+1.618*i),x/4);
        });

        fftVisualizer3.endFill();
        for ( let i=0; i < particles.length; i++) {
           const p = particles[i];
            p.x = (p.radius + 5*Math.sin(tick)) * Math.cos(p.angle + p.speed*tick/10)
            p.y = (p.radius + 5*Math.sin(tick)) * Math.sin(p.angle + p.speed*tick/10)
            p.width = ampData[p.freq]/5 + p.randomsize
            p.height = ampData[p.freq]/5 + p.randomsize
        fftVisualizer4.addChild(p);
        }

    tick += 0.02;
});

