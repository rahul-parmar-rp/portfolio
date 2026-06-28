# Portfolio Blog Starter

[![Build Status](https://github.com/rahul-parmar-rp/portfolio/actions/workflows/build.yml/badge.svg)](https://github.com/rahul-parmar-rp/portfolio/actions/workflows/build.yml)

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Common PNPM Commands

Run these from the repo root.

```bash
pnpm dev             # start the main Next.js app
pnpm build           # build the main Next.js app
pnpm lint            # lint the root app
pnpm typecheck       # type-check the root app

pnpm docs:dev        # start the Docusaurus dev journal
pnpm docs:build      # build the Docusaurus site
pnpm docs:serve      # serve the built Docusaurus site
pnpm docs:typecheck  # type-check the Docusaurus project

pnpm submodule:status          # list tracked submodules and their current commits
pnpm submodule:init            # initialize and fetch submodules after clone
pnpm submodule:sync            # sync submodule URLs from .gitmodules
pnpm submodule:example:status  # show status for workspace/git-submodules-example-repo
pnpm submodule:example:commit  # commit changes inside the example submodule, pass MSG='...'
pnpm submodule:example:push    # push the example submodule repo to its own remote
pnpm submodule:parent:stage    # stage the parent repo's submodule pointer and .gitmodules
pnpm submodule:parent:commit   # commit the parent repo change, pass MSG='...'
pnpm submodule:parent:push     # push the parent repo
```

## Submodule Workflow

This repo now includes a real Git submodule at [workspace/git-submodules-example-repo](workspace/git-submodules-example-repo).

### How the submodule was created

From inside the child folder, a standalone repo was initialized and pushed to GitHub:

```bash
cd workspace/git-submodules-example-repo
git init -b main
git add README.md PLAN.md
git commit -m "Initial commit"
gh repo create rahul-parmar-rp/git-submodules-example-repo --public --source=. --remote=origin --push
```

Then, from the parent repo root, that GitHub repo was linked back in as a real submodule:

```bash
git submodule add https://github.com/rahul-parmar-rp/git-submodules-example-repo.git workspace/git-submodules-example-repo
git commit -m "Add git-submodules-example-repo submodule"
```

### How to link a repo to the parent folder as a submodule

Use this pattern from the parent repo root:

```bash
git submodule add <repo-url> workspace/<folder-name>
git commit -m "Add <folder-name> submodule"
```

This creates or updates [.gitmodules](.gitmodules) and records a submodule pointer in the parent repository.

### How to commit submodule changes correctly

There are always two commits in a normal submodule workflow.

First commit inside the submodule itself:

```bash
cd workspace/git-submodules-example-repo
git add -A
git commit -m "Your child repo change"
git push
```

Then record the new submodule commit in the parent repo:

```bash
cd /path/to/portfolio
git add workspace/git-submodules-example-repo .gitmodules
git commit -m "Update git-submodules-example-repo pointer"
git push
```

### Using the root package scripts

Example child repo workflow:

```bash
pnpm submodule:example:status
pnpm submodule:example:commit -- MSG="Update child repo files"
pnpm submodule:example:push
```

Then update the parent repo:

```bash
pnpm submodule:parent:stage
pnpm submodule:parent:commit -- MSG="Update submodule pointer"
pnpm submodule:parent:push
```

### Important rule

If you change files inside a submodule, pushing the child repo is not enough. The parent repo must also commit the updated submodule pointer, otherwise other clones of the parent repo will still reference the old child commit.

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
