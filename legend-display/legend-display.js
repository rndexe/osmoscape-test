const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
});
const refPopupSize = {
	width: 1440.0,
	height: 821.0
};

document.body.appendChild(app.view);

let popupBBoxes = {}

let dataURL = '../data/dataSummary.json';
let legendsURL = '../data/mergedLegends.json';
let polygonsURL = '../data/mergedSoundAreas.json';

function loadHQ(){
    //load an image and run the `setup` function when it's done
    let HQpath = '../data/images/SCROLL_cs6_ver23_APP_final_150ppi-LOW-';
    PIXI.Loader.shared
        .add(HQpath+'01-or8.png')
        .add(HQpath+'02-or8.png')
        .load(function(){
            console.log('Loaded HQ image');
            let scroll_01 = new PIXI.Sprite(PIXI.Loader.shared.resources[HQpath+'01-or8.png'].texture);
            let s = window.innerHeight/scroll_01.height;
            mainScrollScale = s;
//            console.log('SCALE: ' + s);
        });
}
function loadDataset(id) {
    if (datasets.hasOwnProperty(id)) {
        //console.log('Loading data for : ' + id);
        let legenddata = mergedLegends[id];
        //
        let lpath = datasets[id].legendpath;
        let title = datasets[id].title;
        //
        if(datasets[id].hasOwnProperty('popdimensions')){
          //  console.log('Loading dimensions for : ' + id);
            //
            let dim = datasets[id].popdimensions;
            popupBBoxes[id] = {
                mask: null,
                legend: null,
                paths: [],
                rects: [],
                dimensions: dim,
            //    polygons: datasets[id].physics
            };
            //
            //
            let count = popupBBoxes[id]['dimensions'].length;
            //console.log('boxes: ' + count);
            //
            let s = mainScrollScale;
            let rs = (window.innerHeight/refPopupSize.height);
            //console.log('pixi scale ratio: ' + rs);
            //
        }
        legendLoad(title, legenddata, lpath, id);
    }

}
function legendLoad(title, svgxml, svgpath, num){
	//
	let skipLoad = false;
	const lpromise = new Promise((resolve, reject) => {
		if(skipLoad)
			resolve('m'+num);
		else{
			//
			//
			var parser = new DOMParser();
			var doc = parser.parseFromString(svgxml, 'image/svg+xml');
			let s = new XMLSerializer().serializeToString(doc);
			var svgEncoded = 'data:image/svg+xml;base64,' + window.btoa(s);
			let resource = new PIXI.SVGResource (svgEncoded, {scale: 1.5});
			let legendTexture = PIXI.Texture.from(resource, {resolution: 8.0});
			let legendLoaded = false;
            legendTexture.on('update', () => {
                if(!legendLoaded){
                    //
                    let legend = new PIXI.Sprite(legendTexture);
                    //legendFiles.push(legend);
                    //
                   // console.log('Loaded '+num+' legend');
                    //$('#status').text('Loaded '+num+' legend');
                    //
                    //
                    if(popupBBoxes[num] != undefined)
                        popupBBoxes[num]['legend'] = legend;
                    //
                    //
                    //
                    if(legend.data == undefined)
                        legend.data = {};
                    legend.data.legendName = 'legend-'+num;
                    legend.data.maskName = 'mask-' + num;
                    legend.name = 'legend-' + num;
                    //legend.visible = false;
                    //
                    //
                    //
                    //
                    let s = mainScrollScale;
                    let lms = window.innerHeight/legendTexture.height;
//                    console.log('MAIN SCALE: ' + s);
//                    console.log('LEGEND SCALE: ' + lms);
                    //
                    //let offset = 0;
					//let offset = 1028;
                    legend.scale.set(lms, lms);
					legend.x = (window.innerWidth*s*3/4);
                    app.stage.addChild(legend);
                    addSoundInteractionAreaToLegend(legend,num)
                    showLegend(legend,num)
                                        //legend.x = offset*s + (window.innerWidth*s*3/4);
                    //
                    resolve('l'+num);
                }
                legendLoaded = true;
            });
			//
		}
	});
	//
	return lpromise;
}

function addSoundInteractionAreaToLegend(legend,num) {


    let soundArea = JSON.parse(mergedSoundAreas[num]);
    let rect = soundArea.shapes[0][0].shape;

    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFA500);
    graphics.lineStyle(1, 0xFF0000);
    graphics.alpha = 0.2;
    graphics.drawRect(rect[0], rect[1], rect[2]-rect[0], rect[3]-rect[1]);
    
    let maskHeight = 623.52;
    maskScale = window.innerHeight/maskHeight;
    //
    //let offset = 1028;
    graphics.scale.set(maskScale, maskScale);
    graphics.x = (window.innerWidth*mainScrollScale*3/4);

    app.stage.addChild(graphics)

}

function showLegend(legend,number){
    console.log('Opening legend ' + number);
    let _x = parseInt(popupBBoxes[number]['dimensions'][0].x);
    let _y = parseInt(popupBBoxes[number]['dimensions'][0].y);
    let _width = parseInt(popupBBoxes[number]['dimensions'][0].width);
    let _height = parseInt(popupBBoxes[number]['dimensions'][0].height);
    //
    let rs = (window.innerHeight/refPopupSize.height);
    _x *= rs;// _x += (pixiWidth*mainScrollScale*3/4);
    _y *= rs;
    _width *= rs;
    _height *= rs;
    var newViewCenter = new PIXI.Point(-1*_x, 0);

    app.stage.position = newViewCenter;

    //
}


$(document).ready(function() {
    // executes when HTML-Document is loaded and DOM is ready
    console.log("document is ready");
    console.log('dataURL: ' + dataURL);
    $.getJSON(dataURL, function( data ) {
        console.log('Loaded dataset summary');
        datasets = data;
    });
    console.log('mergedLegendURL: ' + legendsURL);
    $.getJSON(legendsURL, function( data ) {
        mergedLegends = data;
        console.log('Loaded legend files');
    });

    //
    console.log('mergedPolygonsURL: ' + polygonsURL);
    $.getJSON(polygonsURL, function( data ) {
        mergedSoundAreas = data;
        console.log(mergedSoundAreas);
        console.log('Loaded soundareas files');
    });


    loadHQ();
});

$("#m").on("change", function() {
    console.log($(this).val());

    let i = ($(this).val());
    if(i in datasets) {
        console.log(datasets[i].title)
        app.stage.removeChildren();
        $("p").text(datasets[i].title);
        loadDataset(i)
    }
});


