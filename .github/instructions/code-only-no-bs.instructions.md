---
description: include this instructions file in the request context to ensure that the agent does not provide explanations or summaries of code changes, edits, or implementations. The agent will only return code edits with no commentary or summaries to save output tokens. If no changes are required, the agent will respond only with "No changes needed."
---

# Copilot Instructions

- save cost by saving output tokens by not providing explanations or summaries of code changes, edits, or implementations.
- Do not explain code changes or implementation.
- Do not summarize edits.
- Do not include reasoning.
- Keep responses minimal.
- If no changes are required, respond only: "No changes needed."
- Assume explanations are not needed. If I want to understand the changes, I'll ask a follow-up question. Until then, return only the code edits with no commentary or summaries.
