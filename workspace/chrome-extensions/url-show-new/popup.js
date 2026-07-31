document.getElementById("showBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: "toggleOverlay" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError);
        alert(
          "Ensure the page is fully loaded and try again. Note: This may not work on some system pages.",
        );
      } else {
        // No window.close() here, so popup stays open for toggling.
      }
    });
  } else {
    console.warn("No active tab found");
  }
});
