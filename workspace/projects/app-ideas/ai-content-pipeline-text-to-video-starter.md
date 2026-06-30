# Draft Plan: AI Content Pipeline (Text to Short Video Starter)

## Idea Summary

Build a starter pipeline that turns a short text idea into:

1. social caption
2. script outline
3. short video draft (voiceover + scene cards)

## Problem

Creators lose momentum between idea capture and consistent video publishing.

## Core MVP

- Input: one-line topic or short paragraph
- Step 1: Generate hooks and captions
- Step 2: Generate 30 to 60 second script
- Step 3: Generate storyboard frames and voiceover text
- Step 4: Export assets for manual editing in CapCut/Premiere

## MVP Scope (Keep It Small)

- No full auto video editor on day one
- Focus on script + storyboard + asset pack
- Add one-click publishing later

## Recommended Stack

- Frontend: React SPA for prompt input and preview
- Backend: Node API for generation jobs
- Storage: local folder + optional cloud bucket
- Optional AI: local LLM first, cloud model fallback

## Output Package

- `caption.txt`
- `script.txt`
- `scene-plan.json`
- `voiceover.txt`
- `thumbnail-copy.txt`

## Milestones

1. Topic to caption/script generator
2. Scene plan and shot list generator
3. Asset pack exporter
4. Optional text-to-video integration

## MVP Success Metrics

- Reduce idea-to-draft time below 10 minutes
- Produce at least 5 publish-ready content packs/day
- Increase consistency of posting cadence
