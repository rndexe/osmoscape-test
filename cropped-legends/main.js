const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    view: canvas
});

let datasets;
document.body.appendChild(app.view);
let backgroundContainer,legendContainer;
let mainScrollWidth;
let mainScrollScale;
$(document).ready(function() {
    // executes when HTML-Document is loaded and DOM is ready
    console.log("Document is ready");
    console.log("Started loading assets");
    let HQPath = '../_data/images/SCROLL_cs6_ver23_APP_final_150ppi-LOW-';
    PIXI.Loader.shared
        .add(HQPath+'01-or8.png')
        .add(HQPath+'02-or8.png')
        .load( ()=>{
            console.log('Loaded HQ image');
            let scroll_01 = new PIXI.Sprite(PIXI.Loader.shared.resources[HQPath+'01-or8.png'].texture);
            let scroll_02 = new PIXI.Sprite(PIXI.Loader.shared.resources[HQPath+'02-or8.png'].texture);

            let scale = app.screen.height/scroll_01.height;
            mainScrollscale = scale; 
            scroll_01.scale.set(scale, scale);
            scroll_02.scale.set(scale, scale);
            //Change the sprite's position
            scroll_01.x = 0;
            scroll_02.x = scroll_01.x + scroll_01.width;
            mainScrollWidth = scroll_01.width + scroll_02.width;
            backgroundContainer = new PIXI.Container();
            app.stage.addChild(backgroundContainer);
            backgroundContainer.addChild(scroll_01)
            backgroundContainer.addChild(scroll_02)
            loadLegends();
        });

    $('#canvas').on('wheel', (event) =>{
        event.preventDefault();
        app.stage.position.x -= event.originalEvent.deltaY;
    }
    );


});

const loadLegends = () => {

    fetch("../_data/dataSummary_cropped.json")
        .then(res => res.json())
        .then(data => {
            allLegendContainer = new PIXI.Container();            
            for (const id in data) {
                let legend = data[id]
                let legendCtr = new PIXI.Container();            
                if(legend.hasOwnProperty('legendpath')){
                    let legendTexture = PIXI.Texture.from(legend.legendpath);
                    let legendLoaded = false;
                    legendTexture.on('update', () => {
                        if (!legendLoaded) {
                            let legendSprite = new PIXI.Sprite.from(legendTexture)
                            let legendRefHeight = (legend.position.height/623.5)
                            let legendScale = (legendRefHeight/legendTexture.height)*app.screen.height;
                            legendSprite.scale.set(legendScale,legendScale)
                            // 501 here is the difference between the width of background and legend.svg at the height of 623.5
                            // it'd be lesser for -1,0 and 64
                            legendCtr.x = ((legend.position.x+501)/623.5)*app.screen.height
                            legendCtr.y = (legend.position.y/623.5)*app.screen.height
                            legendSprite.alpha=0
                            //legendSprite.interactive = true; 

                            let mask = new PIXI.Graphics();
                            fetch(legend.maskpath)
                                .then(res => res.json())
                                .then(data => {

                                    mask.beginFill(0xFFA500);
                                    mask.lineStyle(1, 0xFF0000);
                                    mask.alpha = 0.2;
                                    let maskScale = app.screen.height/623.5
                                    mask.scale.set(maskScale, maskScale);
                                    mask.x += (500*maskScale);
                                    mask.interactive = true;
                                    mask.buttonMode = true;
                                    
                                    for (let s of data.shapes){
                                        mask.drawPolygon(s.shape);
                                    }

                                    mask.on('pointerover',()=> {
                                        backgroundContainer.alpha = 0.1
                                        legendSprite.alpha=1;
                                        mask.alpha = 0;
                                    });

                                    mask.on('pointerout',()=> {
                                        backgroundContainer.alpha = 1
                                        legendSprite.alpha=0;
                                        mask.alpha = 0.2;
                                    });
                                    allLegendContainer.addChild(mask)
                                });
                            legendCtr.addChild(legendSprite);
                        }
                        legendLoaded = true;
                    });
                }
                app.stage.addChild(legendCtr)
            }
            app.stage.addChild(allLegendContainer)
        })
}
