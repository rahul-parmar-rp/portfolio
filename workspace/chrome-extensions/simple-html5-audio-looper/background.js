const OFFSCREEN_URL = chrome.runtime.getURL('offscreen.html');

async function ensureOffscreen() {
  const existing = await chrome.offscreen.hasDocument();
  if (!existing) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_URL,
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play local audio file in an infinite loop',
    });
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    await ensureOffscreen();
    // Forward every message to the offscreen document and relay its response
    const response = await chrome.runtime.sendMessage({ ...msg, target: 'offscreen' });
    sendResponse(response);
  })();
  return true; // keep channel open for async response
});
