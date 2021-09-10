import HorizontalScroll from '@oberon-amsterdam/horizontal';
import * as Tone from 'tone';
window.onload = init;

let horizontal = new HorizontalScroll();
let player;
let blockWidth;
let playButton;
let prevBlock = 0;
const baselineBuffers = new Tone.ToneAudioBuffers({
    urls : {
        baseline1: "Baseline_1.mp3",
        baseline2: "Baseline_2.mp3",
        baseline3: "Baseline_3.mp3",
    },
    onload : () => {
        console.log("loaded");
    },

    baseUrl : "data/audio/tracks/"
});
function init() {

    player = new Tone.Player({
        url: baselineBuffers.get("baseline1"),
        loop: true,
        fadeIn: 2,
        fadeOut: 2,
    }).toDestination();
    player.volume.value=6;
    blockWidth = document.getElementById('play').offsetWidth;
    playButton = document.getElementById('play');                                                                                                        
    playButton.addEventListener('click', event => {                                                                                                                 
        console.log("clicked");
        Tone.start();
        player.start();    
    });     
    horizontal.on('scroll', scrollListener)

}


function scrollListener () {
    let currentBlock = Math.round(scrollX/blockWidth);
    if ( currentBlock != prevBlock ){
        console.log(currentBlock);
        player.buffer = baselineBuffers.get("baseline"+(currentBlock+1));
        player.restart();
    }
    prevBlock = currentBlock;
}

