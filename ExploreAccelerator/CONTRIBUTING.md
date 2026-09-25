# Contributing

Thanks for helping improve the SAP Adobe Form Wizard.

## How to propose a change
1. Open an issue describing the change and why.
2. Make the change in `Adobe_Form_Wizard.jsx`.
3. Test in both environments: open it as a Claude artifact, and (if applicable) self-hosted on localhost with the backend running.
4. Note the change in `CHANGELOG.md`.
5. Submit a pull request for review.

## Principles to preserve
- Keep it a **single self-contained file** so it runs as a Claude artifact without a build step.
- Preserve the **environment auto-detection** (artifact → direct; localhost → backend).
- Keep the in-app **User Guide** accurate to the current behaviour.
