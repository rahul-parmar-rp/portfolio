const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileStatus = document.getElementById("fileStatus");
const controls = document.getElementById("controls");
const playPauseBtn = document.getElementById("playPauseBtn");
const loopBtn = document.getElementById("loopBtn");
const volumeSlider = document.getElementById("volumeSlider");
const speedSelect = document.getElementById("speedSelect");
const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const errorMsg = document.getElementById("errorMsg");

// Custom loop UI
const loopSection = document.getElementById("loopSection");
const modeFullSong = document.getElementById("modeFullSong");
const modeCustom = document.getElementById("modeCustom");
const rangeTrack = document.getElementById("rangeTrack");
const rangeHighlight = document.getElementById("rangeHighlight");
const thumbStart = document.getElementById("thumbStart");
const thumbEnd = document.getElementById("thumbEnd");
const trackStartEl = document.getElementById("trackStart");
const trackEndEl = document.getElementById("trackEnd");
const startInput = document.getElementById("startInput");
const endInput = document.getElementById("endInput");
const loopDurationDisplay = document.getElementById("loopDurationDisplay");
const setStartBtn = document.getElementById("setStartBtn");
const setEndBtn = document.getElementById("setEndBtn");
const clearLoopBtn = document.getElementById("clearLoopBtn");

// ── State ─────────────────────────────────────────────────────────────────────
let isPlaying = false;
let isLooping = true;
let progressInterval = null;
let audioDuration = 0;
let loopStart = 0;
let loopEnd = 0;
let loopMode = "full"; // "full" | "custom"

function fmt(secs) {
  if (!isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Accept "90", "1:30", "0:01:30" → seconds */
function parseTime(str) {
  const s = str.trim();
  if (/^\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const parts = s.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return NaN;
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden = false;
  setTimeout(() => { errorMsg.hidden = true; }, 4000);
}

function setStatus(text) {
  fileStatus.textContent = text;
}

async function send(msg) {
  return chrome.runtime.sendMessage(msg);
}

// ── Custom loop range ─────────────────────────────────────────────────────────
function updateRangeUI() {
  if (!audioDuration) return;
  const startPct = (loopStart / audioDuration) * 100;
  const endPct = (loopEnd / audioDuration) * 100;
  thumbStart.style.left = `${startPct}%`;
  thumbEnd.style.left = `${endPct}%`;
  rangeHighlight.style.left = `${startPct}%`;
  rangeHighlight.style.width = `${endPct - startPct}%`;
  trackStartEl.textContent = fmt(loopStart);
  trackEndEl.textContent = fmt(loopEnd);
  startInput.value = fmt(loopStart);
  endInput.value = fmt(loopEnd);
  const dur = loopEnd - loopStart;
  loopDurationDisplay.textContent = dur > 0 ? fmt(dur) : "—";
}

function applyLoopRange() {
  if (loopMode === "custom") {
    send({ type: "SET_CUSTOM_LOOP", loopStart, loopEnd });
    chrome.storage.local.set({ loopMode, loopStart, loopEnd });
  }
}

function initLoopRange(duration) {
  audioDuration = duration;
  loopEnd = duration;
  updateRangeUI();
}

// Drag thumbs on the visual timeline
function makeDraggable(thumb, isStart) {
  thumb.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const rect = rangeTrack.getBoundingClientRect();

    function onMove(ev) {
      let pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const t = pct * audioDuration;
      if (isStart) {
        loopStart = Math.min(t, loopEnd - 0.5);
        if (loopStart < 0) loopStart = 0;
      } else {
        loopEnd = Math.max(t, loopStart + 0.5);
        if (loopEnd > audioDuration) loopEnd = audioDuration;
      }
      updateRangeUI();
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      applyLoopRange();
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
}

makeDraggable(thumbStart, true);
makeDraggable(thumbEnd, false);

startInput.addEventListener("change", () => {
  const t = parseTime(startInput.value);
  if (isNaN(t)) { showError("Invalid start time"); return; }
  if (t >= loopEnd) { showError("Start must be less than end time"); return; }
  loopStart = Math.max(0, t);
  updateRangeUI();
  applyLoopRange();
});

endInput.addEventListener("change", () => {
  const t = parseTime(endInput.value);
  if (isNaN(t)) { showError("Invalid end time"); return; }
  if (t <= loopStart) { showError("End time must be greater than start time"); return; }
  loopEnd = Math.min(audioDuration || t, t);
  updateRangeUI();
  applyLoopRange();
});

setStartBtn.addEventListener("click", async () => {
  const resp = await send({ type: "GET_PROGRESS" });
  if (resp) {
    loopStart = Math.min(resp.currentTime, loopEnd - 0.5);
    if (loopStart < 0) loopStart = 0;
    updateRangeUI();
    applyLoopRange();
  }
});

setEndBtn.addEventListener("click", async () => {
  const resp = await send({ type: "GET_PROGRESS" });
  if (resp) {
    loopEnd = Math.max(resp.currentTime, loopStart + 0.5);
    if (loopEnd > audioDuration) loopEnd = audioDuration;
    updateRangeUI();
    applyLoopRange();
  }
});

clearLoopBtn.addEventListener("click", () => {
  loopStart = 0;
  loopEnd = audioDuration;
  updateRangeUI();
  applyLoopRange();
});

// Loop mode radio
[modeFullSong, modeCustom].forEach((radio) => {
  radio.addEventListener("change", () => {
    loopMode = radio.value;
    if (loopMode === "full") {
      send({ type: "SET_CUSTOM_LOOP", loopStart: null, loopEnd: null });
    } else {
      applyLoopRange();
    }
    chrome.storage.local.set({ loopMode });
  });
});

// ── File handling ─────────────────────────────────────────────────────────────
async function loadFile(file) {
  if (!file.type.startsWith("audio/")) {
    showError("Please select a valid audio file.");
    return;
  }

  currentFile = file;
  fileName.textContent = file.name;
  fileInfo.hidden = false;
  controls.hidden = false;
  loopSection.hidden = false;
  errorMsg.hidden = true;
  setStatus("Loading…");

  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    const resp = await send({
      type: "LOAD",
      dataUrl,
      loop: isLooping,
      volume: parseFloat(volumeSlider.value),
      speed: parseFloat(speedSelect.value),
    });

    if (resp && resp.duration) {
      audioDuration = resp.duration;
      seekBar.max = resp.duration;
      durationEl.textContent = fmt(resp.duration);
      initLoopRange(resp.duration);
      // Re-apply stored custom loop if mode is custom
      if (loopMode === "custom") applyLoopRange();
    }

    setStatus("Playing in loop");
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
    startProgressPoll();

    chrome.storage.local.set({
      lastFileName: file.name,
      loop: isLooping,
      volume: volumeSlider.value,
      speed: speedSelect.value,
    });
  };
  reader.onerror = () => showError("Unable to read file.");
  reader.readAsDataURL(file);
}

// ── Controls ──────────────────────────────────────────────────────────────────
playPauseBtn.addEventListener("click", async () => {
  if (isPlaying) {
    await send({ type: "PAUSE" });
    isPlaying = false;
    playPauseBtn.textContent = "▶";
    setStatus("Paused");
    stopProgressPoll();
  } else {
    await send({ type: "PLAY" });
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
    setStatus("Playing in loop");
    startProgressPoll();
  }
});

loopBtn.addEventListener("click", async () => {
  isLooping = !isLooping;
  loopBtn.classList.toggle("active", isLooping);
  await send({ type: "SET_LOOP", loop: isLooping });
  chrome.storage.local.set({ loop: isLooping });
});

volumeSlider.addEventListener("input", () => {
  send({ type: "SET_VOLUME", volume: parseFloat(volumeSlider.value) });
  chrome.storage.local.set({ volume: volumeSlider.value });
});

speedSelect.addEventListener("change", () => {
  send({ type: "SET_SPEED", speed: parseFloat(speedSelect.value) });
  chrome.storage.local.set({ speed: speedSelect.value });
});

seekBar.addEventListener("change", () => {
  send({ type: "SEEK", time: parseFloat(seekBar.value) });
});

// ── Progress polling ──────────────────────────────────────────────────────────
function startProgressPoll() {
  if (progressInterval) return;
  progressInterval = setInterval(async () => {
    const resp = await send({ type: "GET_PROGRESS" });
    if (resp) {
      seekBar.value = resp.currentTime;
      currentTimeEl.textContent = fmt(resp.currentTime);
      if (resp.duration) {
        seekBar.max = resp.duration;
        durationEl.textContent = fmt(resp.duration);
        if (!audioDuration) initLoopRange(resp.duration);
      }
    }
  }, 500);
}

function stopProgressPoll() {
  clearInterval(progressInterval);
  progressInterval = null;
}

// ── Drag & drop ───────────────────────────────────────────────────────────────
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("drag-over"),
);

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) loadFile(fileInput.files[0]);
});

// ── Restore settings on open ──────────────────────────────────────────────────
chrome.storage.local.get(
  ["lastFileName", "loop", "volume", "speed", "loopMode", "loopStart", "loopEnd"],
  (data) => {
    if (data.loop !== undefined) {
      isLooping = data.loop;
      loopBtn.classList.toggle("active", isLooping);
    } else {
      loopBtn.classList.add("active");
    }
    if (data.volume !== undefined) volumeSlider.value = data.volume;
    if (data.speed !== undefined) speedSelect.value = data.speed;
    if (data.lastFileName) fileName.textContent = `Last: ${data.lastFileName}`;
    if (data.loopMode) {
      loopMode = data.loopMode;
      if (loopMode === "custom") modeCustom.checked = true;
    }
    if (data.loopStart !== undefined) loopStart = data.loopStart;
    if (data.loopEnd !== undefined) loopEnd = data.loopEnd;
  },
);

// ── Sync UI with any already-running audio ────────────────────────────────────
(async () => {
  const resp = await send({ type: "GET_PROGRESS" });
  if (resp && resp.duration > 0) {
    fileInfo.hidden = false;
    controls.hidden = false;
    loopSection.hidden = false;
    audioDuration = resp.duration;
    seekBar.max = resp.duration;
    seekBar.value = resp.currentTime;
    currentTimeEl.textContent = fmt(resp.currentTime);
    durationEl.textContent = fmt(resp.duration);
    if (!loopEnd) loopEnd = resp.duration;
    updateRangeUI();
    isPlaying = resp.playing;
    playPauseBtn.textContent = resp.playing ? "⏸" : "▶";
    setStatus(resp.playing ? "Playing in loop" : "Paused");
    if (resp.playing) startProgressPoll();
  }
})();
