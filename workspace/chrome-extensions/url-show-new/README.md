# Full URL Bar Overlay (Chrome Extension)

Shows the full current page URL in a movable, copyable overlay. The overlay starts in the bottom-right corner and can be dragged anywhere on the page. The position is saved per-site using localStorage.

## Features

- [] Full URL shown (no ellipsis)
- [] Movable overlay (drag the header)
- [] Copy button for quick clipboard copy
- [] Decode toggle (switch between encoded and decoded URL)
- [] Query params toggle (view params in a readable list)
- [] Hide/Show toggle (collapses the URL field)
- [] Width toggle (expand to near full page width)

## Install (Developer Mode)

1. Open Chrome and go to chrome://extensions
2. Enable **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the root directory of the project

## Usage

- Drag the header to move the overlay.
- Click **Copy** to copy the full URL.
- Click **Decode** to show a decoded URL, **Encoded** to switch back.
- Click **Params** to show query parameters, **Hide Params** to collapse.
- Click **Hide** to collapse the URL field, then **Show** to expand it again.
- Click **Expand** to widen the overlay, **Shrink** to return.
