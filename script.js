// --- BACKGROUNDS ---
const images = ["Green water.jpg", "Grey Mountains.jpg", "The street.jpg"];
let currentImg = 0;
function changeBackground() {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[currentImg]}')`;
    currentImg = (currentImg + 1) % images.length;
}
changeBackground();

// --- TIMER & STATS ---
let timeLeft = 25 * 60;
let timerVar = null;
let isBreak = false;
let focusSecs = 0, breakSecs = 0;

function updateDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function startTimer() {
    if (timerVar) return;
    timerVar = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            if (!isBreak) { focusSecs++; document.getElementById('focus-total').innerText = `${Math.floor(focusSecs/60)}m ${focusSecs%60}s`; }
            else { breakSecs++; document.getElementById('break-total').innerText = `${Math.floor(breakSecs/60)}m ${breakSecs%60}s`; }
        } else { pauseTimer(); alert("Time is up!"); }
    }, 1000);
}

function pauseTimer() { clearInterval(timerVar); timerVar = null; }
function resetTimer() { pauseTimer(); isBreak = false; timeLeft = 25 * 60; updateDisplay(); }
function runBreak() { pauseTimer(); isBreak = true; timeLeft = 5 * 60; updateDisplay(); startTimer(); }
function resetStats() { focusSecs = 0; breakSecs = 0; document.getElementById('focus-total').innerText = "0m 0s"; document.getElementById('break-total').innerText = "0m 0s"; }

// --- TO-DO LOGIC ---
function toggleTodo() { document.getElementById('todo-panel').classList.toggle('active'); }

function addTask() {
    const input = document.getElementById('todo-input');
    if (input.value.trim() === "") return;
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `<span>${input.value}</span><button onclick="this.parentElement.remove()">✕</button>`;
    document.getElementById('todo-list').appendChild(li);
    input.value = "";
}

// --- MUSIC PLAYER ---
const tracks = ["Alpha waves 1.mp3", "White Noise 1.mp3"];
let currentTrack = 0, playing = false, loop = false;
let audio = new Audio(tracks[currentTrack]);

function toggleMusic() {
    if (playing) { audio.pause(); document.getElementById('play-pause-btn').innerText = '▶'; }
    else { audio.play().catch(() => {}); document.getElementById('play-pause-btn').innerText = '⏸'; }
    playing = !playing;
}

function toggleRepeat() { loop = !loop; document.getElementById('repeat-btn').style.opacity = loop ? "1" : "0.5"; }

function loadTrack(idx) {
    audio.pause();
    currentTrack = idx;
    audio = new Audio(tracks[currentTrack]);
    document.getElementById('track-label').innerText = tracks[currentTrack].replace('.mp3', '').toUpperCase();
    audio.onended = () => { if(loop) { audio.currentTime = 0; audio.play(); } else { nextTrack(); } };
    if (playing) audio.play();
}

function nextTrack() { loadTrack((currentTrack + 1) % tracks.length); }
function prevTrack() { loadTrack((currentTrack - 1 + tracks.length) % tracks.length); }
audio.onended = () => { if(loop) { audio.currentTime = 0; audio.play(); } else { nextTrack(); } };
