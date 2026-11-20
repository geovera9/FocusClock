const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function pad(n) {
  return String(n).padStart(2, '0');
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

const clockTime = document.getElementById('clockTime');
const clockDate = document.getElementById('clockDate');

function updateClock() {
  const now = new Date();
  clockTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  clockDate.textContent = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

updateClock();
setInterval(updateClock, 1000);

const swTime = document.getElementById('swTime');
const swStart = document.getElementById('swStart');
const swLap = document.getElementById('swLap');
const swReset = document.getElementById('swReset');
const laps = document.getElementById('laps');

let swBase = 0;
let swBegan = 0;
let swInterval = null;

function formatStopwatch(ms) {
  const centiseconds = Math.floor(ms / 10) % 100;
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000);
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

function swElapsed() {
  return swBase + (swInterval ? Date.now() - swBegan : 0);
}

function swRender() {
  swTime.textContent = formatStopwatch(swElapsed());
}

function swStop() {
  swBase = swElapsed();
  clearInterval(swInterval);
  swInterval = null;
  swStart.textContent = 'Start';
  swRender();
}

swStart.addEventListener('click', () => {
  if (swInterval) {
    swStop();
    return;
  }
  swBegan = Date.now();
  swInterval = setInterval(swRender, 50);
  swStart.textContent = 'Pause';
});

swLap.addEventListener('click', () => {
  if (!swInterval) return;
  const li = document.createElement('li');
  li.innerHTML = `<span>Lap ${laps.children.length + 1}</span><span>${formatStopwatch(swElapsed())}</span>`;
  laps.prepend(li);
});

swReset.addEventListener('click', () => {
  swStop();
  swBase = 0;
  swRender();
  laps.innerHTML = '';
});

const tMin = document.getElementById('tMin');
const tSec = document.getElementById('tSec');
const tDisplay = document.getElementById('tDisplay');
const tStart = document.getElementById('tStart');
const tReset = document.getElementById('tReset');
const timerPanel = document.getElementById('timer');

let tRemaining = 0;
let tEnd = 0;
let tInterval = null;

function readInputs() {
  const minutes = Math.min(99, Math.max(0, Number(tMin.value) || 0));
  const seconds = Math.min(59, Math.max(0, Number(tSec.value) || 0));
  return minutes * 60 + seconds;
}

function showTime(totalSeconds) {
  tDisplay.textContent = `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
}

function timerLeft() {
  return Math.max(0, Math.ceil((tEnd - Date.now()) / 1000));
}

function pauseTimer() {
  tRemaining = timerLeft();
  clearInterval(tInterval);
  tInterval = null;
  tStart.textContent = 'Start';
}

function tick() {
  showTime(timerLeft());
  if (timerLeft() === 0) {
    pauseTimer();
    timerPanel.classList.add('done');
    alert("Time's up!");
  }
}

tStart.addEventListener('click', () => {
  if (tInterval) {
    pauseTimer();
    return;
  }
  if (tRemaining === 0) tRemaining = readInputs();
  if (tRemaining === 0) return;
  timerPanel.classList.remove('done');
  tEnd = Date.now() + tRemaining * 1000;
  tInterval = setInterval(tick, 250);
  tStart.textContent = 'Pause';
});

tReset.addEventListener('click', () => {
  pauseTimer();
  tRemaining = readInputs();
  showTime(tRemaining);
  timerPanel.classList.remove('done');
});

[tMin, tSec].forEach(input => {
  input.addEventListener('input', () => {
    if (tInterval) return;
    tRemaining = readInputs();
    showTime(tRemaining);
  });
});

tRemaining = readInputs();
showTime(tRemaining);

const backgrounds = ['background.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg'];
const bgBtn = document.getElementById('bgBtn');
let bgIndex = 0;

bgBtn.addEventListener('click', () => {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  document.documentElement.style.setProperty('--bg-image', `url('${backgrounds[bgIndex]}')`);
});
