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

// ── State synced with the offscreen audio engine ──────────────────────────────
let isPlaying = false;
let isLooping = true;
let currentFile = null;
let progressInterval = null;

function fmt(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden = false;
  setTimeout(() => {
    errorMsg.hidden = true;
  }, 4000);
}

function setStatus(text) {
  fileStatus.textContent = text;
}

// ── Message helpers ───────────────────────────────────────────────────────────
async function send(msg) {
  return chrome.runtime.sendMessage(msg);
}

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
  errorMsg.hidden = true;
  setStatus("Loading…");

  // Read file as base64 so it can be passed to the offscreen document
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
      seekBar.max = resp.duration;
      durationEl.textContent = fmt(resp.duration);
    }

    setStatus("Playing in loop");
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
    startProgressPoll();

    // Persist settings
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
  ["lastFileName", "loop", "volume", "speed"],
  (data) => {
    if (data.loop !== undefined) {
      isLooping = data.loop;
      loopBtn.classList.toggle("active", isLooping);
    } else {
      loopBtn.classList.add("active"); // loop ON by default
    }
    if (data.volume !== undefined) volumeSlider.value = data.volume;
    if (data.speed !== undefined) speedSelect.value = data.speed;
    if (data.lastFileName) fileName.textContent = `Last: ${data.lastFileName}`;
  },
);

// ── Sync UI with any already-running audio ────────────────────────────────────
(async () => {
  const resp = await send({ type: "GET_PROGRESS" });
  if (resp && resp.duration > 0) {
    fileInfo.hidden = false;
    controls.hidden = false;
    seekBar.max = resp.duration;
    seekBar.value = resp.currentTime;
    currentTimeEl.textContent = fmt(resp.currentTime);
    durationEl.textContent = fmt(resp.duration);
    isPlaying = resp.playing;
    playPauseBtn.textContent = resp.playing ? "⏸" : "▶";
    setStatus(resp.playing ? "Playing in loop" : "Paused");
    if (resp.playing) startProgressPoll();
  }
})();
