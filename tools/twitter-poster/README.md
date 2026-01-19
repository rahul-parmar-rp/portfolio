# Twitter Poster Tool

A simple tool to post tweets programmatically using the Twitter API.

## Setup

1. Copy `.env.example` to `.env` in the project root
2. Add your Twitter API credentials to `.env`

## Usage

### API Routes (Next.js)

Start the dev server and POST to:

- `http://localhost:3000/api/tools/twitter-poster/post-time`
- `http://localhost:3000/api/tools/twitter-poster/post-from-csv`

### Scripts

```bash
# Post current time
pnpm twitter:post-time

# Post from CSV
pnpm twitter:post-csv
```

## Files

- `api/` - Next.js API routes
- `scripts/` - Standalone Node.js scripts
- `posts.csv` - Tweet data for batch posting
