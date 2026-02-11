# Portfolio Blog Starter

[![Build App](https://img.shields.io/badge/Build-Manually%20Trigger-blue?style=for-the-badge&logo=github-actions)](https://github.com/rahul-parmar-rp/portfolio/actions/workflows/build.yml)

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Chrome Extension: Full URL Bar Overlay

A simple Chrome extension that shows the full current page URL in a movable, copyable overlay.

See setup and usage docs in [chrome-extension/README.md](chrome-extension/README.md).

## Twitter Poster MVP with AI

This project also includes a Twitter posting MVP that uses Ollama (local LLM) to generate tweets and posts them to Twitter via API.

### Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up Ollama**

   ```bash
   # Install Ollama (macOS)
   curl -fsSL https://ollama.ai/install.sh | sh

   # Pull llama3 model
   ollama pull llama3

   # Start Ollama server
   ollama serve
   ```

3. **Configure environment**

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Edit .env.local and add your Twitter API credentials
   # You need API Key, API Secret, Access Token, and Access Secret
   ```

4. **Run the application**

   ```bash
   pnpm dev
   ```

5. **Use the Twitter Poster**
   - Open http://localhost:3000/twitter-poster
   - **Single Tweet**: Enter topic → Generate → Edit → Post
   - **Bulk CSV**: Upload CSV file → Post all tweets with rate limiting

### Twitter API Setup

1. Go to https://developer.twitter.com/
2. Create a new app or use existing one
3. Go to \"Keys and tokens\" tab
4. Copy these credentials to your `.env.local`:
   - API Key → `TWITTER_API_KEY`
   - API Secret → `TWITTER_API_SECRET`
   - Access Token → `TWITTER_ACCESS_TOKEN`
   - Access Token Secret → `TWITTER_ACCESS_SECRET`

### CSV Format

For bulk posting, use CSV with these columns:

```csv
tweet,url,hashtags
\"Your tweet content here\",\"https://example.com\",\"#hashtag1 #hashtag2\"
\"Another tweet\",\"\",\"#coding\"
```

3. **Configure environment**

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Edit .env.local and add your Twitter Bearer Token
   # Get it from https://developer.twitter.com/
   ```

4. **Run the application**

   ```bash
   pnpm dev
   ```

5. **Use the Twitter Poster**
   - Open http://localhost:3000/twitter-poster
   - Enter a topic for your tweet
   - Click "Generate Tweet"
   - Edit the generated content if needed
   - Click "Post to Twitter"

### Twitter API Setup

1. Go to https://developer.twitter.com/
2. Create a new app or use existing one
3. Go to "Keys and tokens" tab
4. Generate Bearer Token
5. Add it to your `.env.local` file as `TWITTER_BEARER_TOKEN`

### Architecture

- **Frontend**: Next.js 14 (App Router) + React
- **AI**: Ollama with llama3 model (local)
- **API**: Next.js API routes
- **Social**: Twitter API v2

The MVP includes:

- ✅ AI-powered tweet generation
- ✅ Single-page UI with real-time editing
- ✅ Character count validation
- ✅ Direct Twitter posting
- ✅ Error handling and loading states
- ✅ No database required

## Demo

https://portfolio-blog-starter.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog&project-name=blog&repository-name=blog)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Then, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).
