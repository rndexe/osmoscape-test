const maxPosition = { x : 0, y : 0, avg : 0}
const context = new Tone.Context({ latencyHint: "balanced"});
Tone.setContext(context);

const buffers = new Tone.ToneAudioBuffers({
    urls: {
        "-1": "-1.mp3",
        "0": "0.mp3",
        "1": "1.mp3",
        "4": "4.mp3",
        "5": "5.mp3",
        "6": "6.mp3",
        "7": "7.mp3",
        "8": "8.mp3",
    },
    onload: () => {
        console.log("hello")
        $("button").show();
        console.log("loaded");
    },
    baseUrl: "/data/audio/loops/"
});

const crossfade = new Tone.CrossFade({
    fade : 0
}).toDestination();
const reverb = new Tone.Reverb();
const delay = new Tone.Delay();
const vibrato = new Tone.Vibrato();
const pitch = new Tone.PitchShift();
const grainplayer = new Tone.GrainPlayer({
    url : "/data/audio/loops/-1.mp3",
    loop : true,
});
const player = new Tone.Player({
    url : "/data/audio/loops/-1.mp3",
    loop : true,
}).connect(crossfade.a);
grainplayer.chain(vibrato,delay,crossfade.b);

$(document).ready(function(){

    init(); 
    $("button").click (function() {
        Tone.start();
        grainplayer.start();
        player.start();
        $("button").hide();
        $(".legend").show();

        setMaxPosition();
    });

    let molecule = Draggable.create(".draggable",{
        //        bounds:"#hitArea",
        type: "x,y",
        onDrag: throttled(150,function() {


            let position = getNormalizedPosition();

            if (!position){
                crossfade.fade.rampTo(0,0.2)
            }
            else {
                crossfade.fade.rampTo(1,0.2)
                reverb.decay = (position.x)*
                    ($("#rdmx").val()-$("#rdmn").val())+$("#rdmn").val()*1
                reverb.wet.rampTo(position.y*
                    ($("#rwmx").val()-$("#rwmn").val())+$("#rwmn").val()*1
                    ,0.1);

                delay.delayTime.rampTo(position.avg*
                    ($("#dtmx").val()-$("#dtmn").val())+$("#dtmn").val()*1
                    ,0.1);

                vibrato.frequency.rampTo(position.y*
                    ($("#vfmx").val()-$("#vfmn").val())+$("#vfmn").val()*1
                    ,0.1);
                vibrato.depth.rampTo(position.x*
                    ($("#vdmx").val()-$("#vdmn").val())+$("#vdmn").val()*1
                    ,0.1);

                pitch.pitch = position.y*
                    ($("#pmx").val()-$("#pmn").val())+$("#pmn").val()*1

                grainplayer.detune = position.x *
                    ($("#dmx").val()-$("#dmn").val())+$("#dmn").val()*1;
                grainplayer.grainSize= position.y*
                    ($("#gsmx").val()-$("#gsmn").val())+$("#gsmn").val()*1;
                grainplayer.loopStart = position.y*
                    ($("#lstmx").val()-$("#lstmn").val())+$("#lstmn").val()*1;
                grainplayer.loopEnd = position.x*
                    ($("#lemx").val()-$("#lemn").val())+$("#lemn").val()*1;

                $("#decay").text(reverb.decay.toFixed(2));
                $("#wet").text(reverb.wet.value.toFixed(2));
                $("#delayTime").text(delay.delayTime.value.toFixed(2));
                $("#detune").text(grainplayer.detune.toFixed(2));
                $("#grainSize").text(grainplayer.grainSize.toFixed(2));
                $("#loopstart").text(grainplayer.loopStart.toFixed(2));
                $("#loopend").text(grainplayer.loopEnd.toFixed(2));
                $("#frequency").text(vibrato.frequency.value.toFixed(2));
                $("#depth").text(vibrato.depth.value.toFixed(2));
                $("#pitch").text(pitch.pitch.toFixed(2));
            }
        })
    }
    );

    $('#loops').change(function() {
        grainplayer.buffer = buffers.get($(this).val().toString());
        player.buffer = buffers.get($(this).val().toString());
        grainplayer.restart();
        player.restart();
    });
});

function init() {

    $(".legend").hide();
    $('#loops').append('<option value="-1" selected>-1</option>');    
    $('#loops').append('<option value="0">0</option>');    
    $('#loops').append('<option value="1">1</option>');    
    $('#loops').append('<option value="4">4</option>');    
    $('#loops').append('<option value="5">5</option>');    
    $('#loops').append('<option value="6">6</option>');    
    $('#loops').append('<option value="7">7</option>');    
    $('#loops').append('<option value="8">8</option>');    
}

function setMaxPosition() {

    maxPosition.x = $("#hitArea").width()-$(".draggable").width();
    maxPosition.y = $("#hitArea").height()-$(".draggable").height();
    maxPosition.avg = (maxPosition.x + maxPosition.y)/2;
}
function getCurrentPosition() {

    let position = { x : 0, y : 0 }
    position.y = ($(".draggable").offset().top - $("#hitArea").offset().top)
    position.x = ($(".draggable").offset().left - $("#hitArea").offset().left)
    position.avg = (position.x + position.y)/2;
    return position;
}

function isMoleculeInsideInteractiveArea() {

    if (
        ($(".draggable").offset().top < $("#hitArea").offset().top) ||
        ($(".draggable").offset().left < $("#hitArea").offset().left) ||
        (
            ($(".draggable").offset().left + $(".draggable").width()/2) > 
            ($("#hitArea").offset().left + $("#hitArea").width())
        ) ||
        (
            ($(".draggable").offset().top + $(".draggable").height()/2) > 
            ($("#hitArea").offset().top + $("#hitArea").height())
        )
    ) {
        return false;
    } else {
        return true
    }
}

function getNormalizedPosition() {
    if (!isMoleculeInsideInteractiveArea()){
        return null;
    }
    let position = getCurrentPosition()
    let normalizedPosition = { x : 0, y : 0, avg: 0 }
    normalizedPosition.x = Math.min(1,Math.abs(position.x/maxPosition.x)); 
    normalizedPosition.y = Math.min(1,Math.abs(position.y/maxPosition.y)); 
    normalizedPosition.avg = Math.min(1,Math.abs(position.avg/maxPosition.avg));
    return normalizedPosition;
}
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


