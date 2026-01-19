# Tools & Mini Apps

This directory contains small applications and utilities.

## Available Tools

### Twitter Poster
Post tweets programmatically using the Twitter API.
- [Documentation](./twitter-poster/README.md)
- API Routes: `/api/tools/twitter-poster/*`
- Scripts: `pnpm twitter:post-time` or `pnpm twitter:post-csv`

## Adding New Tools

Each tool should have its own directory with:
- `README.md` - Documentation
- `api/` - Next.js API routes (if applicable)
- `scripts/` - Standalone scripts (if applicable)
