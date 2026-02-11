(() => {
  const OVERLAY_ID = "full-url-overlay";
  const STORAGE_KEY = "full_url_overlay_position";

  if (document.getElementById(OVERLAY_ID)) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;

  const header = document.createElement("div");
  header.className = "overlay-header";

  const title = document.createElement("div");
  title.className = "overlay-title";
  title.textContent = "Current URL";

  const actions = document.createElement("div");
  actions.className = "overlay-actions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy";

  const decodeButton = document.createElement("button");
  decodeButton.type = "button";
  decodeButton.textContent = "Decode";

  const paramsButton = document.createElement("button");
  paramsButton.type = "button";
  paramsButton.textContent = "Params";

  const widthButton = document.createElement("button");
  widthButton.type = "button";
  widthButton.textContent = "Expand";

  const hideButton = document.createElement("button");
  hideButton.type = "button";
  hideButton.textContent = "Hide";

  actions.appendChild(copyButton);
  actions.appendChild(decodeButton);
  actions.appendChild(paramsButton);
  actions.appendChild(widthButton);
  actions.appendChild(hideButton);
  header.appendChild(title);
  header.appendChild(actions);

  const body = document.createElement("div");
  body.className = "overlay-body";

  const input = document.createElement("textarea");
  input.readOnly = true;
  input.spellcheck = false;
  input.value = window.location.href;
  input.rows = 2;

  const paramsSection = document.createElement("div");
  paramsSection.className = "overlay-params";

  const paramsTitle = document.createElement("div");
  paramsTitle.className = "overlay-params-title";
  paramsTitle.textContent = "Query Params";

  const paramsList = document.createElement("div");

  paramsSection.appendChild(paramsTitle);
  paramsSection.appendChild(paramsList);

  body.appendChild(input);
  body.appendChild(paramsSection);
  overlay.appendChild(header);
  overlay.appendChild(body);
  overlay.classList.add("collapsed");
  hideButton.textContent = "Show URL";
  document.documentElement.appendChild(overlay);

  let showDecoded = false;
  let showParams = false;

  const getDisplayUrl = () => {
    const rawUrl = window.location.href;
    if (!showDecoded) return rawUrl;
    try {
      return decodeURIComponent(rawUrl);
    } catch {
      return rawUrl;
    }
  };

  const resizeTextarea = () => {
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  };

  const decodeFormComponent = (value) => {
    const withSpaces = value.replace(/\+/g, " ");
    try {
      return decodeURIComponent(withSpaces);
    } catch {
      return value;
    }
  };

  const getQueryPairs = () => {
    const rawQuery = window.location.search.replace(/^\?/, "");
    if (!rawQuery) return [];
    return rawQuery.split("&").map((pair) => {
      const [rawKey, rawValue = ""] = pair.split("=");
      if (!showDecoded) {
        return { key: rawKey, value: rawValue };
      }
      return {
        key: decodeFormComponent(rawKey),
        value: decodeFormComponent(rawValue),
      };
    });
  };

  const renderParams = () => {
    const pairs = getQueryPairs();
    paramsList.innerHTML = "";
    if (pairs.length === 0) {
      const empty = document.createElement("div");
      empty.className = "param-value";
      empty.textContent = "No query params";
      paramsList.appendChild(empty);
      return;
    }
    pairs.forEach(({ key, value }) => {
      const row = document.createElement("div");
      row.className = "overlay-param";

      const keyEl = document.createElement("div");
      keyEl.className = "param-key";
      keyEl.textContent = key || "(empty)";

      const valueEl = document.createElement("div");
      valueEl.className = "param-value";
      valueEl.textContent = value || "(empty)";

      row.appendChild(keyEl);
      row.appendChild(valueEl);
      paramsList.appendChild(row);
    });
  };

  const updateUrl = () => {
    input.value = getDisplayUrl();
    resizeTextarea();
    renderParams();
  };

  const observer = new MutationObserver(updateUrl);
  observer.observe(document, { subtree: true, childList: true });

  window.addEventListener("hashchange", updateUrl);
  window.addEventListener("popstate", updateUrl);

  copyButton.addEventListener("click", async () => {
    input.select();
    input.setSelectionRange(0, input.value.length);
    try {
      await navigator.clipboard.writeText(input.value);
      copyButton.textContent = "Copied";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1200);
    } catch (error) {
      document.execCommand("copy");
    }
  });

  hideButton.addEventListener("click", () => {
    overlay.classList.toggle("collapsed");
    const isCollapsed = overlay.classList.contains("collapsed");
    hideButton.textContent = isCollapsed ? "Show URL" : "Hide";
    if (isCollapsed) {
      overlay.style.left = "auto";
      overlay.style.top = "auto";
      overlay.style.right = "16px";
      overlay.style.bottom = "16px";
    }
  });

  decodeButton.addEventListener("click", () => {
    showDecoded = !showDecoded;
    decodeButton.textContent = showDecoded ? "Encoded" : "Decode";
    updateUrl();
  });

  paramsButton.addEventListener("click", () => {
    showParams = !showParams;
    overlay.classList.toggle("show-params", showParams);
    paramsButton.textContent = showParams ? "Hide Params" : "Params";
    renderParams();
  });

  widthButton.addEventListener("click", () => {
    overlay.classList.toggle("expanded");
    widthButton.textContent = overlay.classList.contains("expanded")
      ? "Shrink"
      : "Expand";
    resizeTextarea();
  });

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const loadPosition = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved) return;
      overlay.style.left = `${saved.left}px`;
      overlay.style.top = `${saved.top}px`;
      overlay.style.right = "auto";
      overlay.style.bottom = "auto";
    } catch {
      // ignore
    }
  };

  const savePosition = (left, top) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ left, top }));
  };

  header.addEventListener("mousedown", (event) => {
    if (overlay.classList.contains("collapsed")) {
      return;
    }
    isDragging = true;
    const rect = overlay.getBoundingClientRect();
    startX = event.clientX;
    startY = event.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    overlay.style.right = "auto";
    overlay.style.bottom = "auto";
    event.preventDefault();
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    const maxLeft = window.innerWidth - overlay.offsetWidth - 8;
    const maxTop = window.innerHeight - overlay.offsetHeight - 8;
    const nextLeft = clamp(startLeft + deltaX, 8, maxLeft);
    const nextTop = clamp(startTop + deltaY, 8, maxTop);
    overlay.style.left = `${nextLeft}px`;
    overlay.style.top = `${nextTop}px`;
    savePosition(nextLeft, nextTop);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("resize", () => {
    const rect = overlay.getBoundingClientRect();
    const maxLeft = window.innerWidth - overlay.offsetWidth - 8;
    const maxTop = window.innerHeight - overlay.offsetHeight - 8;
    const nextLeft = clamp(rect.left, 8, maxLeft);
    const nextTop = clamp(rect.top, 8, maxTop);
    overlay.style.left = `${nextLeft}px`;
    overlay.style.top = `${nextTop}px`;
    savePosition(nextLeft, nextTop);
  });

  loadPosition();
  resizeTextarea();
  renderParams();
})();
