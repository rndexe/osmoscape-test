const legendsURL = '../data/mergedLegends.json';
const parser = new DOMParser();
const svgEncodedJSON = {};
console.log("Loading Legends from " + legendsURL);
$.getJSON(legendsURL, function( data ) {
    mergedLegends = data;
    console.log('Loaded Legend files');
    for (const i in mergedLegends) {
        let doc = parser.parseFromString(mergedLegends[i], 'image/svg+xml');
        let s = new XMLSerializer().serializeToString(doc);
        let svgEncoded = 'data:image/svg+xml;base64,' + window.btoa(s);
        svgEncodedJSON[i] = svgEncoded;
    }
    download(JSON.stringify(svgEncodedJSON),'encodedSVG.json', 'application/json');
});
function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

