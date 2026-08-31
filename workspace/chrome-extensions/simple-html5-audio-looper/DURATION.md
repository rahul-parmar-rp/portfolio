New Feature: Custom Audio Loop Duration / Section Looping
Feature Name

Custom Range Loop Player

Goal

Add a new feature to the Audio Loop Player Chrome extension that allows users to select a specific section of an audio file and loop only that selected duration repeatedly.

The user should not have to listen to the entire audio file. They should be able to choose a start time and end time, and the extension should continuously repeat only that selected section.

User Flow

User selects an audio file.

Extension loads the audio and displays:

Total duration
Audio timeline
Current playback position

Example:

Audio Length: 05:30

User selects a custom loop range.

The user can choose:

Start Time

Example:

Start: 01:15

End Time

Example:

End: 02:45

This means only:

01:15 → 02:45

will repeat continuously.

Loop Behavior

When playback reaches the selected end time:

The player should automatically jump back to the selected start time.

Example:

Start: 60 seconds
End: 120 seconds

Playback:

60s
|
|
120s
|
|
jump back
|
|
60s

The selected section should continue looping forever.

Technical Requirements

Use the HTML5 Audio API.

Monitor playback using:

audio.currentTime

Example logic:

if(audio.currentTime >= loopEnd){
audio.currentTime = loopStart;
audio.play();
}

User Interface Addition

Add a new section in the extension popup:

## Custom Loop Section

Custom Loop

Start Time:
[ 00:00 ]

End Time:
[ 00:00 ]

[ Set Loop Range ]

[ Enable Custom Loop ]

---

Timeline Slider Feature

Add a visual timeline.

Requirements:

User can drag start marker.
User can drag end marker.
Display selected range visually.

Example:

|-----------------------------|
^ ^
| |
Start End

Time Input Support

Allow two methods:

Method 1: Manual Input

User types:

Start:
01:30

End:
03:00

Accept formats:

90
01:30
00:01:30

Convert everything into seconds internally.

Method 2: Timeline Selection

User drags markers on the audio timeline.

The extension automatically updates:

Start Time
End Time
Duration

Display Selected Loop Duration

Show:

Example:

Loop Duration:

01:30 minutes

Formula:

loopDuration = endTime - startTime

Controls

Add buttons:

Set Start Point

When clicked:

Use current playback position as loop start.

Example:

Current Position:
02:15

Set Start

Set End Point

When clicked:

Use current playback position as loop end.

Example:

Current Position:
04:00

Set End

Clear Loop

Reset:

Start = 0
End = Full Audio Length

Loop Modes

Support two modes:

Full Track Loop

Existing behavior:

Entire audio repeats

Custom Section Loop

New behavior:

Only selected range repeats

Add a toggle:

Loop Mode:

( ) Full Song
( ) Selected Section

Background Playback Compatibility

The custom loop feature must continue working when:

Popup is closed
User changes tabs
Chrome window changes focus

The loop timing logic should run in the background audio engine, not only inside popup.js.

Recommended:

Popup
|
|
Background Service Worker
|
|
Offscreen Audio Document

The offscreen audio document should handle:

currentTime monitoring
loop start/end checking
restarting playback
State Management

Save settings using:

chrome.storage.local

Store:

{
audioFileName:"",
loopMode:"custom",
loopStart:75,
loopEnd:180
}

Edge Cases

Handle:

Invalid Range

Example:

Start:
03:00

End:
02:00

Show:

"End time must be greater than start time"

Start Equals End

Do not allow:

Start: 60
End: 60

End Greater Than Audio Length

Automatically limit:

End = Audio Duration

Optional Advanced Features

Add:

A-B Repeat Mode

Similar to professional music players:

Button:

A → Set Start
B → Set End

After B is selected:

Automatically loop A-B range.

Fade Transition

Optional:

Before jumping back:

Fade volume down
Restart
Fade volume up

Duration:

0.5 - 2 seconds

Final Deliverable

Implement this as a separate feature module without breaking the existing infinite loop functionality.

Provide:

Updated extension code.
New UI components.
Background audio changes.
Testing instructions.
Explanation of the custom loop algorithm.
