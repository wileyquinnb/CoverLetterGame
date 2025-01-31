// Get the audio element
var audio = document.getElementById('elevmus');

// Unmute the audio after the page loads
window.addEventListener('load', function () {
    audio.muted = false;
    audio.play();
});