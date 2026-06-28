---
title: Twitter Poster With AI MVP Spec
description: Practical MVP specification for a local-first Twitter posting tool powered by Next.js and Ollama.
sidebar_position: 2
slug: /social/twitter-poster-ai-mvp-spec
---

This is the cleaned-up product spec version of the original builder prompt.

## Product Goal

Build a local MVP that generates tweet drafts with Ollama, lets the user edit them, and posts them to X from a single Next.js app.

## Fixed Constraints

- one Next.js app
- one page UI
- route handlers only where needed
- no database
- no auth system
- no background jobs
- no queues
- environment variables for secrets
- Ollama runs locally

## Required Flow

1. User enters a topic or prompt.
2. The app calls Ollama and generates tweet text.
3. The generated text is shown in an editable UI.
4. The user posts it to X.

## Expected File Structure

```text
app/
  page.tsx
  api/
    generate/
      route.ts
    twitter/
      route.ts
lib/
  ollama.ts
  twitter.ts
.env.example
README.md
```

## Build Order

The original MVP prompt had a strict delivery sequence. The useful implementation order is:

1. scaffold the minimal project structure
2. add Ollama generation on the backend
3. build the single-page UI
4. add the Twitter posting endpoint
5. wire generate -> edit -> post together
6. document environment variables
7. document local run steps

## Backend Requirements

### Ollama

- call the Ollama HTTP API
- default model: `llama3`
- keep prompts short and output tweet-friendly
- return a simple payload such as:

```json
{
  "content": "Shipping fast beats shipping perfect..."
}
```

### Twitter Posting

- validate character count before sending
- read credentials from environment variables
- return clear success and failure responses

## UI Rules

- keep everything on one page
- avoid routing for the MVP flow
- use plain `useState`
- optimize for local usability, not multi-user architecture

## UI Requirements

- one page only
- text input for the prompt or topic
- generate button
- editable textarea for the generated tweet
- post button
- loading and error states
- plain `useState` is enough for the MVP

## Environment Variables

```bash
OLLAMA_BASE_URL=http://localhost:11434
TWITTER_BEARER_TOKEN=your_token_here
```

To obtain the Twitter token, create a developer app in the X developer portal and copy the bearer token or other credential format required by the chosen endpoint.

## Local Run Checklist

```bash
ollama pull llama3
ollama serve
pnpm dev
```

Suggested test flow:

1. start Ollama locally
2. open the UI
3. enter a topic
4. generate a tweet draft
5. edit the text if needed
6. post it to X

## Delivery Standard

- prefer runnable code over architectural perfection
- do not add platforms beyond X for the MVP
- do not add persistence until the single-flow prototype works locally
- keep the structure ready for later extension, but do not build the extension layer yet

## Final MVP Check

Before calling the MVP done, verify:

- it runs locally
- it does not require a database
- it uses Ollama as a first-class local dependency
- it only depends on an external social platform for the final post action
