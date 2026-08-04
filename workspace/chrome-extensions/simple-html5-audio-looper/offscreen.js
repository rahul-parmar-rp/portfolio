const audio = new Audio();
audio.loop = true;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.target !== "offscreen") return;

  switch (msg.type) {
    case "LOAD":
      audio.src = msg.dataUrl;
      audio.loop = msg.loop ?? true;
      audio.volume = msg.volume ?? 1;
      audio.playbackRate = msg.speed ?? 1;
      audio.play().catch(() => {});
      // Wait for metadata so we can return duration
      audio.addEventListener(
        "loadedmetadata",
        () => {
          sendResponse({ duration: audio.duration });
        },
        { once: true },
      );
      return true; // async

    case "PLAY":
      audio.play().catch(() => {});
      sendResponse({ ok: true });
      break;

    case "PAUSE":
      audio.pause();
      sendResponse({ ok: true });
      break;

    case "SET_LOOP":
      audio.loop = msg.loop;
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
