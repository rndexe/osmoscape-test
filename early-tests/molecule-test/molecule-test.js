let windowSize = { w : 0, h : 0};
const position = { x : 0, y: 0 }
const absPosition = { x : 0, y: 0 }
const decay = { min: 1, max : 5, range: 4}
const reverb = new Tone.Reverb().toDestination();

const player = new Tone.Player({
    url : "../data/audio/loops/0.mp3",
    loop : true,
}).connect(reverb);

$(document).ready(function(){


    windowSize.w = $(window).width();
    windowSize.h = $(window).height();

    $("#volumeCtrl").change (function() {
        player.volume.value = $("#volumeCtrl").val();
    });
    $("#decayMin").change (function() {
        decay.min = $("#decayMin").val();
        decay.range = decay.max - decay.min;
    });
    $("#decayMax").change (function() {
        decay.max = $("#decayMax").val();
        decay.range = decay.max - decay.min;
    });
    console.log(windowSize);
    $(".legend").hide();
    $("button").click (function() {
        player.start();
        $("button").hide();
        $(".legend").show();
    });

    $(window).mousemove (function(e) {
        absPosition.x = e.pageX
        absPosition.y = e.pageY
    })
    interact('.draggable').draggable({
        listeners: {
            move (event) {
                position.x += event.dx
                position.y += event.dy
                reverb.decay = (absPosition.x/windowSize.w)*decay.range+decay.min;
                reverb.wet.value =(absPosition.y/windowSize.h);
                $("#decay").text(reverb.decay.toFixed(2));
                $("#wet").text(reverb.wet.value.toFixed(2));
                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`
            },
        }
    })
});


