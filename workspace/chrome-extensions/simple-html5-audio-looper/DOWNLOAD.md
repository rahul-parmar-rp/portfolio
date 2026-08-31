New Feature: Export / Download Selected Audio Loop Section
Feature Name

Export Custom Loop Range as New Audio File

Goal

Add a new feature to the Audio Loop Player Chrome Extension that allows users to cut a selected section of an audio file and download it as a separate new audio file.

The user should be able to:

Select a start time.
Select an end time.
Preview that section.
Export only that selected range.
Download the extracted audio clip.

Example:

Original file:

Song.wav
Duration: 05:30

User selects:

Start: 01:15
End: 02:45

The extension creates:

Song_01m15s_to_02m45s.wav

User Flow

User loads an audio file into the extension.

User selects a custom loop range using the existing Custom Loop feature.

Example:

Start:
00:45

End:
02:30

Add a new button:
Download Selected Section

When clicked:

The extension extracts only that selected range.

Browser downloads the new audio file automatically.
New UI Addition

Add a new section:

---

Export Audio Section

Selected Range:

Start:
01:15

End:
02:45

Duration:
01:30

[ Download Section ]

---

Technical Requirements
Audio Processing

Use the Web Audio API.

Recommended workflow:

Load the original audio file.

Decode audio data:

audioContext.decodeAudioData()

Extract selected samples:
startTime → endTime

Create a new AudioBuffer containing only that range.

Encode and export the result.

Supported Export Formats

Minimum requirement:

.wav

Optional:

.mp3

if encoder support is added.

WAV Export Requirements

Create a WAV encoder.

The exported file should preserve:

Original sample rate
Channel count
Audio quality

Example:

Input:

44100Hz Stereo WAV

Output:

44100Hz Stereo WAV

File Naming

Automatically generate a useful filename.

Example:

Original:

guitar-recording.wav

Export:

guitar-recording_clip_01m15s-02m45s.wav

Format:

(original name)_clip_(start)-(end).wav

Download Implementation

Use browser download API:

chrome.downloads.download()

or:

<a download>

The file should save directly to the Downloads folder.

Validation Rules

Before exporting check:

Invalid Range

Example:

Start:
03:00

End:
01:30

Show:

End time must be after start time

Empty Selection

If no range is selected:

Show:

Please select an audio section first

Range Longer Than File

Automatically limit:

End = Audio Duration

Progress Indicator

For large files show:

Preparing audio...

Processing:

████████░░ 80%

Creating WAV file...

Background Compatibility

The export process should not interrupt playback.

The user should still be able to:

Play the original file
Loop the selected section
Export the section

at the same time.

Heavy processing should happen outside the popup.

Recommended:

Popup UI

     |

Background Service Worker

     |

Audio Processing Worker

Optional Advanced Features
Export Current Loop Automatically

Add button:

Export Current Loop

It uses the currently active A-B loop range.

Export Multiple Repetitions

Allow user to create:

Repeat section 5 times

Example:

Selected:

00:30 - 01:00

Export:

5 minute practice loop

Fade In / Fade Out

Optional processing:

Before export:

Fade in:

0.5 seconds

Fade out:

0.5 seconds

to avoid clicks at cut points.

Final Deliverable

Implement this as an independent feature module.

Provide:

Updated Chrome extension source code.
Audio extraction logic.
WAV encoding implementation.
Download functionality.
UI changes.
Testing instructions.

The final extension should work as a complete audio practice tool where users can:

select a part of a song,
loop it,
and download that exact section as a new audio file.
