# SAP Adobe Form Wizard

**PMO Agent Suite · SAP S/4HANA Public Cloud**

An AI-assisted wizard for designing and generating **Adobe Forms** on SAP S/4HANA Public Cloud — powered by claude-sonnet-4-6.

---

## What it does

The SAP Adobe Form Wizard guides you step by step through creating Adobe Form artifacts for S/4HANA Public Cloud. It uses Claude to generate the requested content and give clear, SAP-aligned guidance, and it bundles an in-app User Guide and demo video so a user can get productive without training.

Highlights:
- **Step-by-step wizard** for Adobe Forms tasks
- **Claude AI modes** for generation and guidance
- **Outputs & downloads** for the produced artifacts
- **Custom Fields & BAdI reference** built in
- **In-app User Guide** (8 sections) + **Demo Video**

---

## How to run it

This is a single-file React component that is **self-sufficient and environment-aware** — it auto-detects where it runs and calls the model accordingly (no manual switching).

**As a Claude.ai artifact (simplest):**
1. Sign in to Claude.ai in the organization where you want it available.
2. Start a new chat, paste the contents of `Adobe_Form_Wizard.jsx`, and let Claude render it as an artifact.
3. **Publish** the artifact and share that link. It calls the model directly (sandbox mode) — no server, no API key for users.

**Self-hosted (localhost / your server):**
1. Run the streaming `POST /api/messages` backend (the shared `main.py` proxy; API key in `.env`).
2. Serve the page from your server and open it via `http://localhost:8000`.
3. It auto-detects localhost and routes model calls through your backend.

> Multi-org note: artifacts live inside the organization that created them. If your users span more than one org, publish a copy in each org.

---

## Environment auto-detection

The wizard picks its transport at load:

| Where it runs | Transport | Model call |
|---|---|---|
| Claude artifact / any non-localhost host | `sandbox` | Direct to the API (runtime supplies auth) |
| localhost | `backend` | Through your `POST /api/messages` proxy |

Force a mode with `MODEL_TRANSPORT_OVERRIDE` (`"sandbox"` / `"backend"` / `"direct"`) at the top of the file. In backend mode it runs an on-load health check and warns if the server isn't reachable.

---

## Repository contents

| File | Description |
|---|---|
| `Adobe_Form_Wizard.jsx` | The wizard (single-file React). Paste into Claude.ai to run as an artifact. |
| `README.md` | This file. |
| `CHANGELOG.md` | Release history. |
| `SECURITY.md` | Data-handling and how to report issues. |
| `CONTRIBUTING.md` | How to propose changes. |
| `LICENSE` | Usage terms. |
| `.gitignore` | Excludes secrets and build/cache files. |

---

*PMO Agent Suite · SAP Adobe Form Wizard*
