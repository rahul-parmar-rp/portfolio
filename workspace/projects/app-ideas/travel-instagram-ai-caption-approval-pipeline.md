# Draft Plan: Travel Instagram AI Caption Approval Pipeline

## Idea Summary

Build a system for your travel Instagram business profile that:

1. Picks images from a selected source folder (local folder or Google Photos sync folder)
2. Generates multiple caption options using local AI or free AI APIs
3. Sends a WhatsApp approval message with the image + caption choices
4. Posts to your Instagram business profile after you confirm one caption

## Problem

Posting quality travel content regularly takes too much manual effort (image selection, caption writing, and posting steps).

## Suggested Folder Strategy

- Create a source folder: `content_pool/travel_raw/`
- Move shortlisted post-ready photos into: `content_pool/travel_selected/`
- Keep posted files in: `content_pool/travel_posted/`
- Optional metadata file: `content_pool/captions_queue.csv`

If you use Google Photos, first sync/export selected albums to `travel_selected` via an approved workflow.

## Core MVP Flow

1. Scan `travel_selected` for unposted images
2. Pick one image (or rank by quality score)
3. Generate 3 to 5 caption options
4. Send WhatsApp message with:
   - image preview
   - caption options (A, B, C...)
   - quick reply format (for example: `POST B`)
5. Wait for your approval reply
6. On approval, publish through Instagram Graph API to your business profile
7. Move the used image to `travel_posted` and log result

## AI Caption Options

### Local AI path

- Ollama + small/medium model
- Prompt template for travel tone, hashtags, and CTA

### Free/low-cost API path

- Free-tier LLM APIs or budget inference endpoints
- Add fallback provider if primary fails

## WhatsApp Approval Layer

- Use WhatsApp Business API compatible flow
- Keep approval syntax simple (`POST A`, `SKIP`, `REGENERATE`)
- Include safety checks before posting

## Instagram Publishing Notes

- Use Instagram Graph API for business/creator profiles
- Handle token refresh and permissions (`instagram_content_publish` etc.)
- Validate media and caption length before publish

## Data and Logging

- Maintain `posts_log.csv` or SQLite table with:
  - filename
  - chosen caption
  - posted time
  - instagram media id
  - status

## Risks and Controls

- Duplicate posting: hash image before publish
- API failures: retry with backoff
- Wrong caption choice: require explicit approval keyword
- Compliance: use official APIs only

## Milestones

1. Folder watcher + queue manager
2. Caption generator with multiple options
3. WhatsApp approval integration
4. Instagram publish + audit logs
5. Scheduling and best-time posting optimization
