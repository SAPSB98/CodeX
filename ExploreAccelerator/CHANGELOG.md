# Changelog

All notable changes to the SAP Adobe Form Wizard are recorded here.

## v5.11 (current)

**Added**
- In-app **User Guide** (8 sections: Introduction & Purpose, Before You Start, Step-by-Step Usage, Claude AI Modes, Outputs & Downloads, Custom Fields & BAdI Reference, Tips & Common Mistakes, Glossary) with a **Demo Video**.

**Changed — aligned with the Project Charter Agent infrastructure**
- The wizard now **calls the model itself** instead of handing the prompt to a host chatbot.
- **Environment auto-detection**: Claude artifact → direct API (sandbox); localhost → backend proxy (`/api/messages`).
- **Streaming** model responses (SSE) shown in an in-app result panel with a Stop control.
- **Backend health check** on load with a clear warning banner.
- Graceful fallback: if a host supplies `onSendPrompt`, the wizard hands off to it (integration mode preserved).
