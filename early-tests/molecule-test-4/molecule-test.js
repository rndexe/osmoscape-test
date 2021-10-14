const maxPosition = { x : 0, y : 0, avg : 0}
let blockSize = {};
const position = { x : 0, y : 0 }
const currentPos = { x:0, y:0};
let csvData,qSize,qPos;

const context = new Tone.Context({ latencyHint: "interactive" });
// set this context as the global Context
Tone.setContext(context);
const split = new Tone.MultibandSplit();
split.low.toDestination();
const player = new Tone.Player({
    url : "../data/audio/loops/1.mp3",
    loop : true,
}).connect(split);
$(document).ready(function(){


    let element = document.querySelector('#mask')
    // And pass it to panzoom
    panzoom(element, {
        bounds: true,
        boundsPadding: 0.1,
        maxZoom: 2,
  minZoom: 0.1,
    });
    $(".legend").hide();
    $("button").click (function() {
        player.start();
        $("button").hide();
        $(".legend").show();
        maxPosition.x = $("#mask").width()-$(".draggable").width();
        maxPosition.y = $("#mask").height()-$(".draggable").height();
        fetch('../data/csv/interaction-data.json')
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                csvData = data;
                blockSize.x = maxPosition.x/(csvData.lowfreq.length);
                blockSize.y = maxPosition.y/(csvData.highfreq.length);
                qSize = maxPosition.avg/csvData.Q.length;
                console.log(qSize);
                console.log(blockSize);
                console.log(maxPosition);
                console.log(csvData.highfreq.length);
            })


        maxPosition.avg = (maxPosition.x + maxPosition.y)/2;
    });

    let molecule = Draggable.create(".draggable",{
        bounds: "#mask",
        type: "x,y",
        onDrag: throttled(500,function() {


            position.y = ($(".draggable").offset().top - $("#mask").offset().top)
            position.x = ($(".draggable").offset().left - $("#mask").offset().left)
            position.avg = (position.x + position.y)/2;

            currentPos.x = Math.floor(position.x/blockSize.x); 
            currentPos.y = Math.floor(position.y/blockSize.y); 
            qPos = Math.floor(position.avg/qSize);
            console.log("Current",currentPos);
            //reverb.decay = Math.abs((position.x/maxPosition.x)*4+1);
            //reverb.wet.value = Math.min(1,Math.abs(position.y/maxPosition.y)*0.5+0.5);
            //delay.delayTime.value = (position.avg/maxPosition.avg)*0.6;

            //console.log( (position.avg/maxPosition.avg)*0.6);
            setBandSplitParameters();
        })
    }
    );

    function setBandSplitParameters() {
        split.set({
            lowFrequency : csvData.lowfreq[currentPos.y],
            highFrequency : csvData.highfreq[currentPos.x],
            Q : csvData.Q[qPos],
        })
        $("#decay").text(split.get().lowFrequency.toFixed(2));
        $("#wet").text(split.get().highFrequency.toFixed(2));
        $("#delayTime").text(split.get().Q.toFixed(2));
    }
});

function throttled(delay, fn) {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}


