const maxPosition = { x : 0, y : 0, avg : 0}
const position = { x : 0, y : 0 }
const reverb = new Tone.Reverb();
const delay = new Tone.Delay();

const player = new Tone.Player({
    url : "../data/audio/loops/0.mp3",
    loop : true,
});
player.chain(delay,reverb,Tone.Destination);

$(document).ready(function(){



    $(".legend").hide();
    $("button").click (function() {
        player.start();
        $("button").hide();
        $(".legend").show();
        maxPosition.x = $("#mask").width()-$(".draggable").width();
        maxPosition.y = $("#mask").height()-$(".draggable").height();
        maxPosition.avg = (maxPosition.x + maxPosition.y)/2;
    });

    let molecule = Draggable.create(".draggable",{
        bounds: "#mask",
        type: "x,y",
        onDrag: function() {
            position.y = ($(".draggable").offset().top - $("#mask").offset().top)
            position.x = ($(".draggable").offset().left - $("#mask").offset().left)
            position.avg = (position.x + position.y)/2;
            reverb.decay = Math.abs((position.x/maxPosition.x)*4+1);
            reverb.wet.value = Math.min(1,Math.abs(position.y/maxPosition.y));
            delay.delayTime.value = (position.avg/maxPosition.avg)*0.6;
            console.log( (position.avg/maxPosition.avg)*0.6);
            $("#decay").text(reverb.decay.toFixed(2));
            $("#wet").text(reverb.wet.value.toFixed(2));
            $("#delayTime").text(delay.delayTime.value.toFixed(2));
        }
    }
    );

});


