let overlay = null;

// Function to create the overlay element
function createOverlay() {
  if (overlay) return;

  const div = document.createElement("div");
  div.id = "url-show-overlay";

  const domain = window.location.hostname;
  const savedData = JSON.parse(
    localStorage.getItem(`urlShowPos_${domain}`) || "{}",
  );

  div.style.cssText =
    "position:fixed; z-index:999999; background-color:#333; color:white; padding:15px; border-radius:8px; font-family:sans-serif; box-shadow:0 4px 12px rgba(0,0,0,0.5); word-wrap:break-word;";

  if (
    savedData &&
    typeof savedData === "object" &&
    savedData.left !== undefined
  ) {
    div.style.left = savedData.left + "px";
    div.style.top = savedData.top + "px";
  } else {
    div.style.bottom = "20px";
    div.style.right = "20px";
  }

  div.innerHTML = `
    <div id="url-show-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #555; padding-bottom:5px;">
        <span style="font-weight:bold;">URL Show</span>
        <div style="display:flex; gap: 5px;">
            <button id="copy-btn">Copy</button>
            <button id="decode-btn">Decode</button>
            <button id="params-btn">Params</button>
            <button id="hide-btn">Hide</button>
            <button id="width-btn">Full</button>
        </div>
    </div>
    <div id="url-show-content" style="margin-top:10px; white-space:pre-wrap;"></div>
    `;

  document.body.appendChild(div);
  overlay = div;

  const contentArea = document.getElementById("url-show-content");
  const header = document.getElementById("url-show-header");
  const copyBtn = document.getElementById("copy-btn");
  const decodeBtn = document.getElementById("decode-btn");
  const paramsBtn = document.getElementById("params-btn");
  const hideBtn = document.getElementById("hide-btn");
  const widthBtn = document.getElementById("width-btn");

  let currentURL = window.location.href;
  let isDecoded = false;

  function updateContent() {
    if (isDecoded) {
      contentArea.textContent = decodeURIComponent(currentURL);
    } else {
      contentArea.textContent = currentURL;
    }
  }

  updateContent();

  // Button Listeners
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(currentURL).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "Copied!";
      setTimeout(() => (copyBtn.innerText = originalText), 2000);
    });
  };

  decodeBtn.onclick = () => {
    isDecoded = !isDecoded;
    updateContent();
    decodeBtn.innerText = isDecoded ? "Encode" : "Decode";
  };

  paramsBtn.onclick = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.toString() === "") {
      contentArea.textContent = "No parameters found.";
    } else {
      contentArea.textContent = Array.from(params.entries())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
    }
  };

  hideBtn.onclick = () => {
    const isHidden = overlay.classList.toggle("hidden");
    hideBtn.innerText = isHidden ? "Show" : "Hide";
  };

  widthBtn.onclick = () => {
    overlay.classList.toggle("full-width");
    widthBtn.innerText = overlay.classList.contains("full-width")
      ? "Shrink"
      : "Full";
  };

  // Dragging Logic
  let isDragging = false;
  let offsetX, offsetY;

  header.onmousedown = (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    offsetX = e.clientX - overlay.offsetLeft;
    offsetY = e.clientY - overlay.offsetTop;
    overlay.style.cursor = "grabbing";
  };

  window.onmousemove = (e) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    overlay.style.left = x + "px";
    overlay.style.top = y + "px";
    overlay.style.bottom = "auto";
    overlay.style.right = "auto";

    localStorage.setItem(
      `urlShowPos_${domain}`,
      JSON.stringify({ left: x, top: y }),
    );
  };

  window.onmouseup = () => {
    if (isDragging) {
      const savedPosition = JSON.parse(
        localStorage.getItem(`urlShowPos_${domain}`) || "{}",
      );
      if (savedPosition.left !== undefined) {
        overlay.style.left = savedPosition.left + "px";
        overlay.style.top = savedPosition.top + "px";
      }
    }
    isDragging = false;
    overlay.style.cursor = "default";
  };

  // Apply styles to make some elements behave as expected
  overlay.classList.add("max-width-300"); // Actually set in CSS but let's be safe
  overlay.style.maxWidth = "300px";
}

// Handle messages from background/popup scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleOverlay") {
    console.log("Received toggle request:", request.action); // Debug log
    if (overlay) {
      const isHidden = overlay.classList.toggle("hidden");
      const btn = document.getElementById("hide-btn");
      if (btn) btn.innerText = isHidden ? "Show" : "Hide";
      console.log("Overlay hidden status:", !isHidden); // Debug log
    } else {
      createOverlay();
      console.log("Created fresh overlay");
    }
    sendResponse({ success: true });
  }
  return true; // Keep the message port open for asynchronous responses
});

// Initial call to register listeners/setup but don't show yet unless instructed
console.log("URL Show Content Script Loaded");

// Don't auto-create - wait for user to click the button
// The toggleOverlay message will create it on first click
