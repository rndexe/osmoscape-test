//const vol = new Tone.Volume().toDestination();
const reverb = new Tone.Reverb().toDestination();
const player = new Tone.Player ({

    url : "../data/audio/loops/4.mp3",
    loop: true,
    //grainSize : 0.1,
    //overlap : 0.05,
}).connect(reverb);

const playButton = document.getElementById('play');
const volSlider = document.getElementById('volumeCtrl');
const grainSizeSlider = document.getElementById('grainCtrl');
const overlapSlider = document.getElementById('overlapCtrl');
const detuneSlider = document.getElementById('detuneCtrl');
const reverbwetSlider = document.getElementById('reverbwetCtrl');
const reverbdecaySlider = document.getElementById('reverbdecayCtrl');
const reverbpredelaySlider = document.getElementById('reverbpredelayCtrl');
const playbackRateSlider = document.getElementById('playbackrateCtrl');

volSlider.addEventListener('input', event => {
    player.volume.value = volSlider.value;
});
grainSizeSlider.addEventListener('input', event => {
    player.grainSize = grainSizeSlider.value;
});
overlapSlider.addEventListener('input', event => {
    player.overlap = overlapSlider.value;
})
detuneSlider.addEventListener('input', event => {
    player.detune = detuneSlider.value;
});
reverbwetSlider.addEventListener('input', event => {
    reverb.wet.value = reverbwetSlider.value;
});
reverbdecaySlider.addEventListener('input', event => {
    reverb.decay = reverbdecaySlider.value;
});
reverbpredelaySlider.addEventListener('input', event => {
    reverb.predelay = reverbpredelaySlider.value;
});
playbackRateSlider.addEventListener('input', event => {
    player.playbackRate = playbackRateSlider.value;
});
playButton.addEventListener('click', event => {
    if ( playButton.innerText == "Play") {
        Tone.start();
        reverb.generate().then(()=>{player.start();});
        playButton.innerText = "Pause"
    } else {
        player.stop();
        playButton.innerText = "Play" 
    }
});
