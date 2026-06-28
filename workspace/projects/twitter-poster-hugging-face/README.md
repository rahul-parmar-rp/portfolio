# Twitter Poster with Hugging Face

Standalone Node.js tool to generate one mini tweet from a topic using Hugging Face Inference API, then optionally post it to Twitter using `twitter-api-v2`.

## Setup

1. Copy env template:
   - `cp .env.example .env`
2. Fill in:
   - `HF_API_KEY`
   - `HF_MODEL_ID`
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_SECRET`

Install dependencies:

```bash
pnpm install
```

## CLI Usage

Generate only:

```bash
pnpm generate -- --topic "AI coding tips"
```

Generate + post:

```bash
pnpm generate-and-post -- --topic "JavaScript micro learning"
```

## API Usage

Start server:

```bash
pnpm server
```

Generate only:

```bash
curl -X POST http://localhost:8787/generate \
  -H "content-type: application/json" \
  -d '{"topic":"Node.js productivity"}'
```

Generate + post:

```bash
curl -X POST http://localhost:8787/generate-and-post \
  -H "content-type: application/json" \
  -d '{"topic":"TypeScript clean code"}'
```

## Notes

- Enforces single tweet output and max 280 chars.
- Uses environment variables only for credentials.
- Returns structured JSON for both CLI and API responses.
