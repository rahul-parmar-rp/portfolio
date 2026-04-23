## Plan: HF Mini Tweet Poster (DRAFT)

Build a self-contained Node.js tool in [projects-git-submodules/twitter-poster-hugging-face](projects-git-submodules/twitter-poster-hugging-face) that generates one short tweet from a topic using Hugging Face Inference API, validates length/style, and posts it via `twitter-api-v2`. The implementation keeps responsibilities separated (`hf client` → `tweet composer` → `twitter publisher`) so CLI and API endpoints reuse the same core logic. This avoids coupling with the existing root app while still following proven patterns from the repo (dotenv env loading, `twitter-api-v2`, structured error handling). Key decisions applied: standalone folder only, support both CLI and HTTP API, model configured by env with explicit model ID, single tweet output per run.

**Steps**

1. Initialize project scaffold in [projects-git-submodules/twitter-poster-hugging-face/package.json](projects-git-submodules/twitter-poster-hugging-face/package.json), [projects-git-submodules/twitter-poster-hugging-face/README.md](projects-git-submodules/twitter-poster-hugging-face/README.md), and [projects-git-submodules/twitter-poster-hugging-face/.env.example](projects-git-submodules/twitter-poster-hugging-face/.env.example) with scripts for `generate`, `post`, and `generate-and-post`.
2. Add config/env loader in [projects-git-submodules/twitter-poster-hugging-face/src/config.ts](projects-git-submodules/twitter-poster-hugging-face/src/config.ts) with `HF_API_KEY`, `HF_MODEL_ID`, `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`, optional `PORT`.
3. Implement Hugging Face client in [projects-git-submodules/twitter-poster-hugging-face/src/hf.ts](projects-git-submodules/twitter-poster-hugging-face/src/hf.ts) with `generateMiniTweet(topic)` calling Inference API (`model` from env), timeout handling, and normalized text extraction.
4. Implement tweet shaping/validation in [projects-git-submodules/twitter-poster-hugging-face/src/tweet.ts](projects-git-submodules/twitter-poster-hugging-face/src/tweet.ts) with `sanitizeTweet(text)` and `assertTweetConstraints(text)` enforcing single tweet, max 280 chars, no empty output.
5. Implement Twitter publishing in [projects-git-submodules/twitter-poster-hugging-face/src/twitter.ts](projects-git-submodules/twitter-poster-hugging-face/src/twitter.ts) with `postTweet(text)` using `TwitterApi`, structured success payload (`id`, `text`, `createdAt`) and clear API/auth error mapping.
6. Compose app service in [projects-git-submodules/twitter-poster-hugging-face/src/service.ts](projects-git-submodules/twitter-poster-hugging-face/src/service.ts) with `generateAndPost(topic)` orchestration and optional dry-run mode.
7. Add CLI entry points in [projects-git-submodules/twitter-poster-hugging-face/src/cli/generate.ts](projects-git-submodules/twitter-poster-hugging-face/src/cli/generate.ts) and [projects-git-submodules/twitter-poster-hugging-face/src/cli/post.ts](projects-git-submodules/twitter-poster-hugging-face/src/cli/post.ts) parsing `--topic` and printing JSON results.
8. Add minimal API server in [projects-git-submodules/twitter-poster-hugging-face/src/server.ts](projects-git-submodules/twitter-poster-hugging-face/src/server.ts) with `POST /generate` and `POST /generate-and-post`, then document setup/run examples in [projects-git-submodules/twitter-poster-hugging-face/README.md](projects-git-submodules/twitter-poster-hugging-face/README.md).

**Verification**

- Install and run: `pnpm --dir projects-git-submodules/twitter-poster-hugging-face install`
- Generate only: `pnpm --dir projects-git-submodules/twitter-poster-hugging-face run generate -- --topic "AI coding tips"`
- Generate + post: `pnpm --dir projects-git-submodules/twitter-poster-hugging-face run generate-and-post -- --topic "JavaScript micro learning"`
- API smoke test: start server, then `curl -X POST http://localhost:8787/generate-and-post -H "content-type: application/json" -d '{"topic":"Node.js productivity"}'`
- Confirm output includes tweet text length ≤ 280 and successful Twitter response id.

**Decisions**

- Scope: standalone only in [projects-git-submodules/twitter-poster-hugging-face](projects-git-submodules/twitter-poster-hugging-face).
- Runtime surface: both CLI scripts and HTTP API endpoints.
- HF integration: Inference API with env-configured model ID.
- Content policy in tool: one concise tweet per request (no thread/batch in MVP).
