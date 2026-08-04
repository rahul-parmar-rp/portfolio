Build a Chrome Extension: Local Audio File Infinite Loop Player
Project Goal

Create a Google Chrome extension that allows the user to select any local audio file (especially .wav files) from their computer and play it continuously in an infinite loop.

The extension should work as a simple local audio looping tool, similar to a mini music player.

Core Requirements

1. Extension Type

Build a Manifest V3 Chrome Extension.

The extension should be installable through:

Chrome → Extensions → Developer Mode → Load Unpacked

Main User Flow
User clicks the Chrome extension icon.
Extension popup opens.
User sees a button:

"Choose Audio File"

User selects a local audio file from their computer.

Supported formats:

.wav
.mp3
.ogg
.m4a
After selecting the file:
Audio should immediately load.
Audio should automatically start playing.
Audio should repeat forever.
User should not need to manually restart it.
Audio Playback Requirements

Use the HTML5 Audio API.

The audio element should behave like:

audio.loop = true;
audio.autoplay = true;

Requirements:

Continuous playback
No stopping after the file ends
Seamless restart
Preserve audio quality
Support large audio files
User Interface Requirements

Create a clean minimal popup UI.

Popup Layout

Top:

Application name:

"Audio Loop Player"

Middle:

File selection button:

"Select Audio File"

After file selection show:

File name:

example.wav

Duration:

03:45

Status:

Playing in loop

Controls:

Buttons:

▶ Play

⏸ Pause

🔁 Loop ON/OFF

🔊 Volume slider

Technical Implementation
File Handling

Use:

<input type="file">

Allow:

accept="audio/\*"

When a user selects a file:

Create an object URL:

URL.createObjectURL(file)

Load it into an Audio object.

Example:

const audioURL = URL.createObjectURL(file);
audio.src = audioURL;

Audio Engine

Use JavaScript Audio object:

const audio = new Audio();

audio.loop = true;
audio.autoplay = true;

Functions required:

Play
audio.play();

Pause
audio.pause();

Loop Toggle

Allow switching:

ON:

audio.loop = true;

OFF:

audio.loop = false;

Remember Last File (Optional Feature)

Add Chrome storage support.

Use:

chrome.storage.local

Remember:

Last selected file name
Playback settings

Note:
Because browsers cannot permanently store arbitrary local file permissions, the extension should ask the user to select the file again after browser restart if required.

Background Playback Requirement

The audio should continue playing when:

Popup is closed
User switches tabs
User opens another website

Important:

Do not keep the audio only inside popup.html because Chrome destroys popup pages after closing.

Use:

Background service worker
OR
Offscreen document API (recommended for Manifest V3)

Architecture:

Popup UI
|
|
Background Service Worker
|
|
Offscreen Audio Player

The audio playback engine should live outside the popup.

Required Files

Create:

audio-loop-player/

├── manifest.json

├── popup.html

├── popup.js

├── popup.css

├── background.js

├── offscreen.html

├── offscreen.js

└── icons/
└── icon.png

Manifest Requirements

Use Manifest Version 3.

Required permissions:

[
"storage",
"offscreen"
]

Add:

"action": {
"default_popup": "popup.html"
}

Error Handling

Handle:

Unsupported file types
Empty file selection
Audio loading errors
Browser autoplay restrictions

Show friendly messages:

Example:

"Please select an audio file"

"Unable to play this file"

Design Requirements

Style:

Modern
Simple
Dark theme preferred

Popup size:

Approximately:

350px x 400px

Use:

Rounded buttons
Clear spacing
Simple icons
Additional Features (Optional)

Add:

Drag and Drop

Allow user to drag a file into popup.

Playback Position

Show:

01:24 / 04:30

with progress bar.

Speed Control

Options:

0.5x
1x
1.25x
1.5x
2x

Multiple File Playlist

Allow adding multiple audio files:

Song1.wav
Song2.wav
Song3.wav

with:

Loop current file
Loop playlist
Final Deliverable

Provide:

Complete Chrome extension source code.
Folder structure.
Installation instructions.
Explanation of how background audio handling works.
Testing instructions.

The final extension should behave like a dedicated "local WAV file infinite loop player" inside Chrome.

All files are created. The extension is at simple-html5-audio-looper:

File Purpose
manifest.json MV3 manifest with offscreen + storage permissions
popup.html UI with file picker, drag-drop, progress bar, controls
popup.css Dark theme styles
popup.js File loading, control wiring, progress polling
background.js Service worker — creates the offscreen document and forwards messages
offscreen.html Hidden page that hosts the <audio> engine
offscreen.js Audio engine (play/pause/loop/seek/volume/speed)
icons/ 16/48/128 px purple PNG icons
To install: Chrome → chrome://extensions → enable Developer mode → Load unpacked → select the simple-html5-audio-looper folder.
