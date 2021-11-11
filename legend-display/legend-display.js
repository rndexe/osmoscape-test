const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    view: canvas
});

let datasets,mergedLegends;
let mainScrollScale;
let mainScrollWidth;
document.body.appendChild(app.view);

let legendsURL = '../data/encodedSVG.json';
let dataURL = '../data/dataSummary.json';

$(document).ready(function() {
    // executes when HTML-Document is loaded and DOM is ready
    console.log("Document is ready");
    console.log("Started loading assets");
    console.log("Loading dataSummary from: " + dataURL);
    $.getJSON(dataURL, function( data ) {
        datasets = data;
        console.log('Loaded dataSummary.json');
    });
    console.log("Loading Legends from " + legendsURL);
    $.getJSON(legendsURL, function( data ) {
        mergedLegends = data;
        console.log('Loaded Legend files');
    });
    let _url = '../data/images/SCROLL_cs6_ver23_APP_final_150ppi-LOW-';
    PIXI.Loader.shared.add(_url+'01-or8.png').load(() => {
        let scroll_01 = new PIXI.Sprite(PIXI.Loader.shared.resources[_url+'01-or8.png'].texture);
        mainScrollScale = app.screen.height/scroll_01.height;
        mainScrollWidth=scroll_01.width*2*mainScrollScale;
    });

});

$("#m").on("change", function() {
    let i = ($(this).val());
    if(i in datasets) {
        console.log(datasets[i].title)
        app.stage.removeChildren();
        $("p").text(datasets[i].title);
        if(datasets[i].hasOwnProperty("popdimensions")) {

            loadLegend(i)
        } else {
            $("p").text(i + datasets[i].title + " has no popdimensions");
        }
    } else {
        $("p").text("No dataset for id number " + i);
        app.stage.removeChildren();
    }
});

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
    //
    legend.x = 0
    let s = app.screen.height/821;
    _x = _x*s-(mainScrollWidth-legend.width);
    _y = _y*s;
    _width = _width*s;
    _height = _height*s;
    let _widthPopupScale = (50/100)*app.screen.width/(_width)
    let _heightPopupScale = (80/100)*app.screen.height/(_height)
    let bb = new PIXI.Graphics()
        .lineStyle(1, 0xFF0000, 1)
        .beginFill(0xFFFFFF,0.05)
        .drawRect(_x,_y,_width,_height)
        .endFill()
    app.stage.position = new PIXI.Point(-1*_x +app.screen.width/2 - _width/2 , -1*_y + app.screen.height/2 - _height/2 )
    app.stage.addChild(bb)
}

class SoundInteractionArea {
    constructor() {
        this.areas = {};
    }
    setNew(num,s,pos) {
        if(num in this.areas) {
            this.currentArea = this.areas[num];
            this.setInitialPositionAndScale(num,s,pos)
        }
        else {
            this.loadNew(num)
            this.currentArea = this.areas[num];
            this.setInitialPositionAndScale(num,s,pos)
        }
    }
    setInitialPositionAndScale(num,s,pos) {
        /*        let bounds = this.areas[num].getBounds()
        let scale=(window.innerWidth-200)/bounds.width;
        this.areas[num].scale.set(scale*0.75)
        let newBounds = this.areas[num].getBounds()
        let startx = this.areas[num].x - newBounds.x+100;
        let starty = this.areas[num].y - newBounds.y+100;
        this.areas[num].startx = startx;
        this.areas[num].starty = starty;
        this.areas[num].x = startx;
        this.areas[num].y = starty;

        */
        console.log(s,pos)
        this.areas[num].scale.set(s)
        this.areas[num].position = pos
        this.currentBounds = this.currentArea.getBounds()
        //        console.log("Bounds:",this.currentBounds);
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
        //console.log(shapeArray)
        if (datasets[num].rect === "true") {
            let rect = shapeArray[0].shape;
            //console.log(rect)
            this.areas[num] = new PIXI.Graphics()
                .beginFill(0xFFA500,0.2)
                .drawRect(rect[0], rect[1], rect[2]-rect[0], rect[3]-rect[1])
                .endFill();
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



