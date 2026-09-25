# Security & Data Handling

## How this wizard runs
As a Claude.ai artifact it runs on each user's own Claude account — there is **no API key or secret in this source file**. In self-hosted mode the key lives on the backend (`.env`), never in the frontend.

## Data handling
- Prompts and any content you provide are processed **in your Claude session** to generate the requested form artifacts and guidance.
- Treat generated outputs and any client-specific inputs as **confidential**.
- Avoid pasting sensitive client identifiers unless required; scrub where possible.

> A self-hosted deployment may persist runs on a server; that variant has its own data-protection posture and is not covered by this repository.

## Reporting a concern
Report any security or data-handling concern to your pilot lead (or the PMO Agent Suite owner), including what you observed. Do not attach confidential client documents when reporting.
