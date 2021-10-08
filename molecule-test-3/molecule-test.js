const maxPosition = { x : 0, y : 0, avg : 0}
const position = { x : 0, y : 0 }
const context = new Tone.Context({ lookAhead: 0.1, latencyHint: "interactive" });


// set this context as the global Context
Tone.setContext(context);
const reverb = new Tone.Reverb();
const delay = new Tone.Delay();
const vibrato = new Tone.Vibrato();
const pitch = new Tone.PitchShift();
const player = new Tone.GrainPlayer({
    url : "/data/audio/loops/0.mp3",
    loop : true,
});
player.chain(vibrato,delay,reverb,Tone.getDestination());
$(document).ready(function(){

    $(".legend").hide();
    $("button").click (function() {
        Tone.start();
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
        onDrag: throttled(100,function() {


            position.y = ($(".draggable").offset().top - $("#mask").offset().top)
            position.x = ($(".draggable").offset().left - $("#mask").offset().left)
            position.avg = (position.x + position.y)/2;

            reverb.decay = Math.abs((position.x/maxPosition.x)*4+1);
            player.detune = ((position.x/maxPosition.x)*100-50);
            vibrato.frequency.value = Math.abs((position.y/maxPosition.y)*10);
            vibrato.depth.value =  (position.x/maxPosition.x)*0.5+0.5;
            pitch.pitch = ((position.y/maxPosition.y)*12-6);
            reverb.wet.value = Math.min(1,Math.abs(position.y/maxPosition.y)*0.5+0.5);
            player.grainSize = (position.y/maxPosition.y)*3.9+0.1;
            player.loopStart = Math.abs((position.y/maxPosition.y)*5);
            player.loopEnd = Math.abs((position.x/maxPosition.x)*10+5);
            delay.delayTime.value = (position.avg/maxPosition.avg)*0.6;
``
            console.log( (position.avg/maxPosition.avg)*0.6);

            $("#decay").text(reverb.decay.toFixed(2));
            $("#wet").text(reverb.wet.value.toFixed(2));
            $("#delayTime").text(delay.delayTime.value.toFixed(2));
            $("#detune").text(player.detune.toFixed(2));
            $("#grainSize").text(player.grainSize.toFixed(2));
            $("#loopstart").text(player.loopStart.toFixed(2));
            $("#loopend").text(player.loopEnd.toFixed(2));
            $("#frequency").text(vibrato.frequency.value.toFixed(2));
            $("#depth").text(vibrato.depth.value.toFixed(2));
            $("#pitch").text(pitch.pitch.toFixed(2));
        })
    }
    );

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


