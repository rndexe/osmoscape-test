class SoundInteractionArea {
    constructor() {
        this.areaContainer = new PIXI.Container();
    }
    setNew(num,s,pos) {
            this.loadNew(num)
            this.setInitialPositionAndScale(num,s,pos)
    }
    setInitialPositionAndScale(num,s,pos) {
        //console.log(s,pos)
            this.areaContainer.scale.set(s)
            this.areaContainer.position = pos
            this.currentBounds = this.areaContainer.getBounds()
        //this.areas[num].scale.set(s)
        //this.areas[num].position = pos
        //        console.log("Bounds:",this.currentBounds);
    }
    setNewPositionAndScale(num, newx, newy) {
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
}
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    view: canvas
});

const soundareas = new SoundInteractionArea();
let datasets,mergedLegends,mergedSoundAreas;
let mainScrollScale;
let mainScrollWidth;
document.body.appendChild(app.view);

let legendsURL = '../_data/encodedSVG.json';
let dataURL = '../_data/dataSummary.json';
let mergedSoundURL = '../_data/mergedSoundAreas.json';

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
    console.log("Loading Soundarea data from: " + mergedSoundURL);
    $.getJSON(mergedSoundURL, function( data ) {
        mergedSoundAreas = data;
        console.log("Loaded Soundarea data");
    });
    let _url = '../_data/images/SCROLL_cs6_ver23_APP_final_150ppi-LOW-';
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
