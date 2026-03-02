// --- BACKGROUND SCENES ---
const images = [
     'Green water.jpg',
     'Grey Mountains.jpg',
     'The street.jpg',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070',
    'https://images.unsplash.com/photo-1516331138075-f3ad1576e0c1?q=80&w=2000',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000'
];
let currentImageIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}
changeBackground();

// --- TRACKING & TIMER LOGIC ---
let startingTime = 25 * 60; 
let timeLeft = startingTime; 
let timerInterval = null;
let isBreakMode = false;

// Statistics
let focusSeconds = 0;
let breakSeconds = 0;

const display = document.getElementById('timer-display');
const focusDisplay = document.getElementById('focus-total');
const breakDisplay = document.getElementById('break-total');

function formatStatsTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (timerInterval) return; 
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            
            // Increment the correct tracker
            if (!isBreakMode) {
                focusSeconds++;
                focusDisplay.innerText = formatStatsTime(focusSeconds);
            } else {
                breakSeconds++;
                breakDisplay.innerText = formatStatsTime(breakSeconds);
            }
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert(isBreakMode ? "Break is over!" : "Focus session finished!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timeLeft = startingTime;
    updateDisplay();
}

function startBreak(mins) {
    pauseTimer();
    isBreakMode = true;
    startingTime = mins * 60;
    timeLeft = startingTime;
    updateDisplay();
    startTimer();
}

function setCustomTime() {
    const input = document.getElementById('user-minutes');
    if (input.value > 0) {
        pauseTimer();
        isBreakMode = false; // Custom time assumes a new focus session
        startingTime = input.value * 60;
        timeLeft = startingTime;
        updateDisplay();
        input.value = '';
    }
}

function resetStats() {
    if(confirm("Reset focus and break timers to zero?")) {
        focusSeconds = 0;
        breakSeconds = 0;
        focusDisplay.innerText = "0m 0s";
        breakDisplay.innerText = "0m 0s";
    }
}

// --- FOCUS MUSIC PLAYER ---
const tracks = ['Alpha waves 1.mp3', 'White Noise 1.mp3']; 
let currentTrackIndex = 0;
let isPlaying = false;
let isRepeating = false;
let audio = new Audio(tracks[currentTrackIndex]);

const playBtn = document.getElementById('play-pause-btn');
const repeatBtn = document.getElementById('repeat-btn');
const trackLabel = document.getElementById('track-label');

function formatTrackName(filename) {
    return filename.replace('.m4a', '').toUpperCase();
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
    } else {
        audio.play().catch(e => console.log("Click required"));
        playBtn.innerText = '⏸';
    }
    isPlaying = !isPlaying;
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.style.opacity = isRepeating ? "1" : "0.5";
    repeatBtn.style.textShadow = isRepeating ? "0 0 10px white" : "none";
}

function handleTrackEnd() {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextTrack();
    }
}

function loadTrack(index) {
    audio.pause();
    currentTrackIndex = index;
    audio = new Audio(tracks[currentTrackIndex]);
    trackLabel.innerText = formatTrackName(tracks[currentTrackIndex]);
    audio.onended = () => handleTrackEnd();
    if (isPlaying) audio.play();
}

function nextTrack() { loadTrack((currentTrackIndex + 1) % tracks.length); }
function prevTrack() { loadTrack((currentTrackIndex - 1 + tracks.length) % tracks.length); }

audio.onended = () => handleTrackEnd();
