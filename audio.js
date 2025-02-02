

const audio = document.getElementById("elevmus");
const button = document.getElementById("music");

button.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        button.textContent = "Pause";
    } else {
        audio.pause();
        button.textContent = "Play";
    }
});