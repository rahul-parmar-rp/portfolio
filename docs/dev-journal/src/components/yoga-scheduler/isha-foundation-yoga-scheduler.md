# Draft Plan: Isha Foundation Yoga Scheduler

## Idea Summary

Build a simple practice companion app for daily yoga and meditation routines, with bell-based audio guidance inspired by guided experiences like Miracle of Mind.

Primary focus:

- scheduled daily sessions
- minimal screen interaction during practice
- bell and tone cues for each stage

## Problem

Many users start practice with good intent but miss consistency due to poor routine tracking and distracting app experiences.

## Core Concept

The app guides users through a session with audio cues (bell sounds, interval markers, start/end tones) so they can practice without constantly checking the screen.

## Core MVP

- Practice scheduler (morning/evening routines)
- Session presets (for example: short, standard, deep)
- Bell cue engine:
  - start bell
  - transition bell
  - end bell
- Daily streak and completion history
- Offline-first behavior for core flows

## Specific Feature Note

For Shambhavi Mudra Kriya style routines, use carefully timed sound indicators so the user can follow the process from bell cues only, without visual prompts.

## User Flow

1. Select routine template
2. Set preferred daily time
3. Choose sound profile and cue volume
4. Start session
5. Follow bell cues until completion
6. Mark session complete automatically

## MVP Screens

- Home: today's session and streak
- Schedule: time and reminder setup
- Session Player: timer + cue state
- History: weekly completion view
- Settings: sound themes and vibration toggle

## Suggested Tech Stack

- Frontend: React Native or web SPA prototype
- Local storage: SQLite or local key-value store
- Audio cues: local bundled sound assets
- Notifications: local reminders

## Safety and Product Boundaries

- Position as wellness support, not medical treatment
- Allow users to pause and resume easily
- Provide clear beginner mode guidance
- Keep spiritual/cultural references respectful and optional

## Milestones

1. Build scheduler and reminder setup
2. Implement bell cue session engine
3. Add streak and history tracking
4. Add preset routines and beginner mode
5. Polish offline behavior and exports

## MVP Success Metrics

- 7-day retention above baseline habit apps
- average weekly sessions per active user increases
- users complete sessions without screen unlock interruptions
