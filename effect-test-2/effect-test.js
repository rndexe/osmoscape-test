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
    baseUrl: "../_data/audio/loops/"
});

const crossfade = new Tone.CrossFade({
    fade : 0
}).toDestination();
const reverb = new Tone.Reverb();
const delay = new Tone.Delay();
const vibrato = new Tone.Vibrato();
const pitchshift = new Tone.PitchShift();
const distortion = new Tone.Distortion();
const osc = new Tone.Oscillator(440,"sawtooth");
const player = new Tone.Player({
    url : "../_data/audio/loops/-1.mp3",
    loop : true,
}).connect(crossfade.a);
//grainplayer.chain(delay,vibrato,pitchshift,crossfade.b);

$(document).ready(function(){

    init(); 
    $("button").click (function() {
        Tone.start();
        osc.start();
        player.start();
        $("button").hide();
        $(".legend").show();

        setMaxPosition();
        getEffectChainFromInput();
    });

    let molecule = Draggable.create(".draggable",{
        //        bounds:"#hitArea",
        type: "x,y",
        onDrag: throttled(150,function() {


            let position = getNormalizedPosition();

            if (!position){
                crossfade.fade.rampTo(0,1.0)
            }
            else {
                crossfade.fade.rampTo(0.05,1.0)


                vibrato.frequency.rampTo(position.y*
                    ($("#vfmx").val()-$("#vfmn").val())+$("#vfmn").val()*1
                    ,0.1);
                vibrato.depth.rampTo(position.x*
                    ($("#vdmx").val()-$("#vdmn").val())+$("#vdmn").val()*1
                    ,0.1);

                pitchshift.pitch = position.y*
                    ($("#pmx").val()-$("#pmn").val())+$("#pmn").val()*1

                distortion.distortion = position.x*
                    ($("#rwmx").val()-$("#rwmn").val())+$("#rwmn").val()*1

            }
        })
    }
    );

    $('#loops').change(function() {
        player.buffer = buffers.get($(this).val().toString());
        osc.restart();
        player.restart();
    });
    $('#ec').change(function() {
        getEffectChainFromInput();
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

const effects = {

    "vibrato" : vibrato,
    "pitchshift" : pitchshift,
    "distortion" : distortion,

}
function getEffectChainFromInput() {
    
    const effectNameArray = $("#ec").val().split(',');
    const effectArray = effectNameArray.map(i => effects[i])
   
    console.log(effectNameArray);
    console.log(effectArray[0].name);
    osc.connect(effectArray[0]);
    effectArray[0].connect(crossfade.b);

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

