let csvData;
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
})

$(document).ready(function(){
    $("#water-mask").click(
        function() {
            $("#water-legend").show();
            player.stop();
            player2.start();

            $(window).mousemove(
                function(e) {
                    console.log(e.pageX+","+e.pageY);
                }
            );
        }
    );
    $(window).click (function() {
        Tone.start();
        player.start();
    });

});
