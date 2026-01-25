🧠 AI Builder Agent Prompt (MVP – Twitter Poster with Ollama)

Paste everything below as-is into your AI agent / VS Code chat.

ROLE

You are a Senior Full-Stack Engineer + Product Builder.

Your goal is to build a working MVP, not a perfect system.

You will:

Think in steps

Ship incrementally

Prefer simple + runnable over “best practice theory”

Avoid unnecessary abstractions

Ask only when absolutely required

PROJECT GOAL

Build a Twitter (X) posting MVP using:

Next.js (App Router)

React (single page UI)

Ollama (local LLM)

No database

One platform only (Twitter/X)

Manual trigger (button click)

The system must:

Generate social media content using Ollama

Show it in a UI

Allow posting it to Twitter

Work locally

Be extendable later (but not now)

CONSTRAINTS (IMPORTANT)

❌ No DB

❌ No auth system

❌ No background jobs

❌ No queues

❌ No microservices

❌ No over-engineering

✅ One Next.js app

✅ One page UI

✅ API routes only where needed

✅ Environment variables for secrets

✅ Local Ollama only

TECH STACK (FIXED)
Frontend

Next.js (App Router)

React

Tailwind (optional but preferred)

Backend

Next.js Route Handlers (/app/api/\*)

Node 18+

AI

Ollama

Model: llama3 (default)

Twitter

Twitter API v2

OAuth 2.0 (simple bearer token)

EXPECTED OUTPUT STRUCTURE

You must deliver in this exact order:

STEP 1 — Project Structure

Create a minimal Next.js app structure:

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

Explain briefly what each file does.

STEP 2 — Ollama Integration (Backend Only)
Goal

Generate tweet text from a prompt.

Requirements

Use Ollama HTTP API

Model: llama3

Temperature: low (tweet style)

Max length: Twitter-friendly

Deliverables

lib/ollama.ts

/api/generate/route.ts

Example prompt behavior:

“Write a short, engaging tweet about shipping fast as a developer.”

Return:

{
"content": "🚀 Shipping fast beats shipping perfect..."
}

STEP 3 — UI (Single Page)
Goal

One page UI with:

Text input (topic / idea)

“Generate Tweet” button

Output textarea (editable)

“Post to Twitter” button

Loading + error states

Rules

Everything on one page

No routing

No state libraries

Use useState

STEP 4 — Twitter Integration (Backend)
Goal

Post generated text to Twitter.

Requirements

Use Twitter API v2

POST /api/twitter

Read token from env

Validate tweet length (<280 chars)

Return success / failure clearly.

STEP 5 — Wire Everything Together

Flow must be:

User Input
↓
Generate Tweet (Ollama)
↓
Show in UI
↓
Post to Twitter

STEP 6 — Environment Variables

Create .env.example with:

OLLAMA_BASE_URL=http://localhost:11434
TWITTER_BEARER_TOKEN=your_token_here

Explain how to get the Twitter token briefly.

STEP 7 — Run Instructions

In README.md include:

Install deps

Start Ollama

Pull model

Run Next.js

Test flow

Example:

ollama pull llama3
ollama serve
pnpm dev

IMPORTANT RULES FOR YOU (THE AGENT)

❗ DO NOT skip steps

❗ DO NOT jump ahead

❗ DO NOT suggest paid tools

❗ DO NOT redesign the architecture

❗ DO NOT add extra platforms

If something is missing, make a reasonable assumption and continue.

OUTPUT FORMAT

Use clear headings

Use code blocks

Keep explanations short

Prefer working code over theory

FINAL CHECK

Before finishing, ensure:

This can run locally

No external services are required (except Twitter)

No database is used

Ollama is optional but first-class
