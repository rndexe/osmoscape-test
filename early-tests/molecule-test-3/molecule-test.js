const maxPosition = { x : 0, y : 0, avg : 0}
const position = { x : 0, y : 0 }
const context = new Tone.Context({ latencyHint: "balanced"});


// set this context as the global Context
Tone.setContext(context);
const reverb = new Tone.Reverb();
const delay = new Tone.Delay();
const vibrato = new Tone.Vibrato();
const pitch = new Tone.PitchShift();
const player = new Tone.GrainPlayer({
    url : "../data/audio/tracks/Baseline_2.mp3",
    loop : true,
});
player.chain(delay,vibrato,pitch,Tone.getDestination());
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
        onDrag: throttled(150,function() {


            position.y = ($(".draggable").offset().top - $("#mask").offset().top)
            position.x = ($(".draggable").offset().left - $("#mask").offset().left)
            position.avg = (position.x + position.y)/2;

            reverb.decay = Math.abs((position.x/maxPosition.x)*4+1);
            reverb.wet.rampTo(Math.min(1,Math.abs(position.y/maxPosition.y)*0.5+0.5),0,1);
            
            delay.delayTime.rampTo(Math.abs(position.avg/maxPosition.avg)*0.6,0.1);
            
            vibrato.frequency.rampTo(Math.abs((position.y/maxPosition.y)*10),0.1);
            vibrato.depth.rampTo((Math.min(1,Math.abs(position.x/maxPosition.x))*0.5+0.5),0.1);
            
            pitch.pitch = ((position.y/maxPosition.y)*12-6);
            
            player.detune = ((position.x/maxPosition.x)*100-50);
            player.grainSize= (position.y/maxPosition.y)*3.9+0.1;
            player.loopStart = Math.abs((position.y/maxPosition.y)*5);
            player.loopEnd = Math.abs((position.x/maxPosition.x)*10+5);
//            console.log( (position.avg/maxPosition.avg)*0.6);

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


