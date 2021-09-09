let csvData;
let windowSize = {};
let blockSize = {};
let prevPos = {};
let currentPos = {};
const player = new Tone.Player({
    url : "../data/audio/tracks/Baseline_1.mp3",
    loop : true,
    fadeOut: 2,
    fadeIn: 2,
}).toDestination();
const split = new Tone.MultibandSplit().mid.toDestination();
const player2 = new Tone.Player({
    url : "../data/audio/loops/1.mp3",
    loop : true,
}).connect(split);

fetch('../data/csv/interaction-data.json')
  .then(response => response.json())
  .then((data) => {
    console.log(data);
    csvData = data;
    blockSize.x = windowSize.x/(csvData.lowfreq.length);
    blockSize.y = windowSize.y/(csvData.highfreq.length);
    console.log(blockSize);
    console.log(windowSize);
    console.log(csvData.highfreq.length);
})

$(document).ready(function(){
    
    windowSize.x = $(window).width();
    windowSize.y = $(window).height();
    $("#water-mask").click(
        function() {
            $("#water-legend").show();
            player.stop();
            player2.start();

            $(window).mousemove(
                function(e) {
                    console.log(e.pageX+","+e.pageY);
                    currentPos.x = Math.floor(e.pageX/blockSize.x); 
                    currentPos.y = Math.floor(e.pageY/blockSize.y); 
                    console.log(currentPos);
//                    setBandSplitParameters(e.pageX, e.pageY);
                }
            );
        }
    );
    $(window).click (function() {
        Tone.start();
        player.start();
    });

});
