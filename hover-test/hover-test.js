let csvData;
let windowSize = {};
let blockSize = {};
let currentPos = {};
const player = new Tone.Player({
    url : "../data/audio/tracks/Baseline_1.mp3",
    loop : true,
    fadeOut: 2,
    fadeIn: 2,
}).toDestination();

const split = new Tone.MultibandSplit();
split.low.toDestination();
split.high.toDestination();

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
        qSize = ((windowSize.x + windowSize.y)/2)/csvData.Q.length;
        console.log(qSize);
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
                    //console.log(e.pageX+","+e.pageY);
                    currentPos.x = Math.floor(e.pageX/blockSize.x); 
                    currentPos.y = Math.floor(e.pageY/blockSize.y); 
                    qPos = Math.floor(((e.pageX + e.pageY)/2)/qSize);
                    console.log("Current",currentPos);
                    //if(currentPos != prevPos) {
                    //console.log("Changed");
                        setBandSplitParameters();
                }
            );
        }
    );
    $(window).click (function() {
        Tone.start();
        player.start();
    });

    function setBandSplitParameters() {
        split.set({
            lowFrequency : csvData.lowfreq[currentPos.x],
            highFrequency : csvData.highfreq[currentPos.y],
            Q : csvData.Q[qPos],
        })
        console.log(split.get().lowFrequency)
        console.log(split.get().highFrequency)
        console.log(split.get().Q)
    }
});


