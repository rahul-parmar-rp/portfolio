const audio = new Audio();
audio.loop = true;

// Custom A-B loop state
let customLoopStart = null;
let customLoopEnd = null;
let abInterval = null;

function startABLoop() {
  if (abInterval) return;
  // Poll at 100 ms to catch the end boundary accurately
  abInterval = setInterval(() => {
    if (customLoopStart === null || customLoopEnd === null) return;
    if (!audio.paused && audio.currentTime >= customLoopEnd) {
      audio.currentTime = customLoopStart;
      audio.play().catch(() => {});
    }
  }, 100);
}

function stopABLoop() {
  clearInterval(abInterval);
  abInterval = null;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.target !== "offscreen") return;

  switch (msg.type) {
    case "LOAD":
      audio.src = msg.dataUrl;
      audio.loop = customLoopStart === null ? (msg.loop ?? true) : false;
      audio.volume = msg.volume ?? 1;
      audio.playbackRate = msg.speed ?? 1;
      audio.play().catch(() => {});
      audio.addEventListener(
        "loadedmetadata",
        () => { sendResponse({ duration: audio.duration }); },
        { once: true },
      );
      return true;

    case "PLAY":
      audio.play().catch(() => {});
      sendResponse({ ok: true });
      break;

    case "PAUSE":
      audio.pause();
      sendResponse({ ok: true });
      break;

    case "SET_LOOP":
      // Only apply native loop when not in custom A-B mode
      if (customLoopStart === null) audio.loop = msg.loop;
      sendResponse({ ok: true });
      break;

    case "SET_CUSTOM_LOOP":
      if (msg.loopStart === null || msg.loopEnd === null) {
        // Revert to full-song loop
        customLoopStart = null;
        customLoopEnd = null;
        audio.loop = true;
        stopABLoop();
      } else {
        customLoopStart = msg.loopStart;
        customLoopEnd = msg.loopEnd;
        audio.loop = false; // native loop off; we manage boundaries manually
        startABLoop();
        // Seek into range if currently outside it
        if (audio.currentTime < customLoopStart || audio.currentTime > customLoopEnd) {
          audio.currentTime = customLoopStart;
        }
      }
      sendResponse({ ok: true });
      break;

    case "SET_VOLUME":
      audio.volume = Math.min(1, Math.max(0, msg.volume));
      sendResponse({ ok: true });
      break;

    case "SET_SPEED":
      audio.playbackRate = msg.speed;
      sendResponse({ ok: true });
      break;

    case "SEEK":
      audio.currentTime = msg.time;
      sendResponse({ ok: true });
      break;

    case "GET_PROGRESS":
      sendResponse({
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
        playing: !audio.paused,
      });
      break;

    default:
      sendResponse({ error: "unknown message type" });
  }
});
