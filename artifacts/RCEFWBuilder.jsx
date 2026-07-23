import { useState, useCallback, useRef } from "react";
import mammoth from "mammoth";

const API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

const t = {
  // surfaces Ã¢Â€Â” warm neutral "paper" instead of cool Fiori gray
  bg: "#f3f1ec", surface: "#ffffff", surfaceAlt: "#edeae3", border: "#e2ddd3",
  borderStrong: "#d3cdc0",
  // accent Ã¢Â€Â” deep violet, grounded in the Accenture purple used in exports
  accent: "#6a1fd0", accentLight: "#efe7ff", accentDeep: "#4a0fb0", accentVivid: "#a100ff",
  // status / layer colors, retuned to sit on warm paper
  green: "#0f7a4d", greenLight: "#e4f2e9", greenDeep: "#0b5f3c",
  amber: "#b5620a", amberLight: "#f8ecda",
  red: "#c2261c", redLight: "#f8e6e3", redDeep: "#9a1a12",
  purple: "#7a2ad6", purpleLight: "#f0e8fc",
  indigo: "#4338ca", indigoLight: "#e7e6fa",
  sky: "#0e6fa8", skyLight: "#e0eef7",
  // text Ã¢Â€Â” violet-tinted ink
  text: "#1a1826", textSec: "#4c4a5a", textMuted: "#8b8798", ink: "#131120",
  shadow: "0 1px 2px rgba(19,17,32,0.05),0 2px 8px rgba(19,17,32,0.045)",
  shadowLg: "0 8px 30px rgba(19,17,32,0.10)",
  // typography
  sans: "'IBM Plex Sans','Segoe UI',system-ui,-apple-system,sans-serif",
  mono: "'IBM Plex Mono','SFMono-Regular',Menlo,Consolas,monospace",
  display: "'Space Grotesk','IBM Plex Sans',system-ui,sans-serif",
};

const APPROACH_META = {
  customisation: { icon: "sliders", label: "Customisation",           sub: "Standard Configuration (SSCUI / Fit-to-Standard)", color: t.accent,  bg: t.accentLight,  mixed: false },
  keyuser:       { icon: "user",    label: "Key User Extensibility",  sub: "Custom fields Ã‚Â· logic via BAdI Ã‚Â· flexible workflow", color: t.purple,  bg: t.purpleLight,  mixed: false },
  developer:     { icon: "terminal",label: "Developer Extensibility",  sub: "RAP / ABAP Cloud Ã¢Â€Â” Embedded Steampunk",            color: t.green,   bg: t.greenLight,   mixed: false },
  sidebyside:    { icon: "cloud",   label: "Side-by-Side (BTP)",      sub: "CAP Ã‚Â· UI5/Fiori Ã‚Â· SBPA Ã‚Â· Build Ã‚Â· DMS",             color: t.amber,   bg: t.amberLight,   mixed: false },
  inapp_btp:     { icon: "layers",  label: "Developer + BTP Mixed",   sub: "RAP in S/4 + side-by-side on BTP",                 color: t.indigo,  bg: t.indigoLight,  mixed: true  },
  keyuser_inapp: { icon: "link",    label: "Key User + Developer Mixed", sub: "Key User for config, RAP for custom",           color: t.sky,     bg: t.skyLight,     mixed: true  },
};

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ S/4HANA Public Cloud extensibility model + BTP catalogue (grounded in SAP Discovery Center) Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
const TAXONOMY = `S/4HANA PUBLIC CLOUD EXTENSIBILITY MODEL Ã¢Â€Â” there are exactly THREE extensibility types. Classify every requirement precisely into one (or a justified combination):
1. KEY USER EXTENSIBILITY (in-app, low-code / no-code via web-based Key User tools Ã¢Â€Â” no ABAP): custom fields, custom CDS views (Key User), custom business objects, custom logic through PRE-DELIVERED BAdIs / enhancement spots, UI adaptation (Adapt UI), flexible workflow, custom forms & email templates, situation handling, custom analytical queries.
2. DEVELOPER EXTENSIBILITY (in-app, pro-code Ã¢Â€Â” ABAP Cloud / RAP in the embedded S/4HANA Cloud ABAP Environment "Embedded Steampunk", via ADT/Eclipse): RAP behavior definitions & business objects on released CDS, released APIs and released extension points only. No classic ABAP, no BAPIs, no custom BAdI creation.
3. SIDE-BY-SIDE EXTENSIBILITY (decoupled apps/services on SAP BTP, integrated ONLY via released remote APIs from SAP Business Accelerator Hub and business events): built with the BTP services listed below.`;

const BTP_SERVICES = `SAP BTP SERVICES FOR PUBLIC-CLOUD SIDE-BY-SIDE (use ONLY services available for S/4HANA Public Cloud per the SAP Discovery Center; name each exactly, do not invent services):
- Pro-code app dev: SAP Build Code, SAP Cloud Application Programming Model (CAP / CAPM), SAP Business Application Studio (BAS), SAPUI5 / SAP Fiori elements, SAP BTP ABAP Environment (Steampunk)
- Low-code / no-code: SAP Build Apps, SAP Build Process Automation (SBPA), SAP Build Work Zone (standard / advanced)
- Integration & events: SAP Integration Suite (Cloud Integration / iFlows, API Management), SAP Event Mesh / SAP Integration Suite advanced event mesh
- Data & analytics: SAP HANA Cloud, SAP Datasphere, SAP Analytics Cloud
- Content & documents: SAP Document Management Service (DMS), SAP Forms Service by Adobe
- AI: SAP AI Core, SAP AI Launchpad, Generative AI Hub, Joule / Joule Studio
- Mobile: SAP Mobile Services (MDK)
- Foundation (required by BTP apps): SAP Authorization & Trust Management (XSUAA) / SAP Cloud Identity Services (IAS / IPS), Destination service, Connectivity service, and a runtime (Cloud Foundry or Kyma)
S/4HANA data is reachable from BTP ONLY through released remote OData/SOAP APIs (SAP Business Accelerator Hub) and business events Ã¢Â€Â” never direct DB access or unreleased interfaces.`;

// Authoritative reference sources every generated artifact must cite/verify against
const REFS = `AUTHORITATIVE SOURCES (verify every object/API/service against these Ã¢Â€Â” do not invent identifiers):
- S/4HANA Public Cloud released APIs, CDS views, events, extension points: SAP Business Accelerator Hub Ã¢Â†Â’ https://hub.sap.com/products/SAPS4HANACloud/overview
- SAP BTP services (availability, plans, APIs): SAP Business Accelerator Hub Ã¢Â†Â’ https://hub.sap.com/products/SAPCloudPlatform/overview
- BTP service catalogue, missions & SAP AI services: SAP Discovery Center Ã¢Â†Â’ https://discovery-center.cloud.sap/
When you name an API, CDS view, event, BAdI, or BTP service, state that it must be confirmed on the relevant hub above and give its expected hub path. If you are not certain an identifier exists, say so explicitly rather than guessing.`;

// Standard-first / AI-first evaluation Ã¢Â€Â” check SAP standard + AI before any custom build
const AI_FIRST = `STANDARD-FIRST & AI-FIRST EVALUATION (MANDATORY Ã¢Â€Â” do this BEFORE proposing any custom development):
Step 1 Ã¢Â€Â” Standard capability: check whether standard SAP configuration / a delivered app or best-practice scope item already meets the requirement. If yes, prefer it.
Step 2 Ã¢Â€Â” Standard SAP AI: check whether a delivered SAP AI capability already covers the need before building anything custom. Consider, and name explicitly when relevant:
  - Joule (copilot: informational, navigational, transactional/actionable scenarios; Joule Base is included at no extra cost) and Joule Agents (e.g. Project Setup Agent, Tender Analysis Agent) built/extended via Joule Studio in SAP Build
  - Embedded AI in SAP S/4HANA Public Cloud (Base vs Premium AI): e.g. SAP Document AI (document information extraction Ã¢Â€Â” quality certificates, invoices, sales-order creation from unstructured docs), AI-assisted account/GL & costing-variant explanations, cash application / payment-exception assistance, situation handling, predictive analytics, AI-driven international trade classification, smart summarization on Fiori elements
  - SAP AI Foundation on BTP for building custom AI only where standard does not fit: SAP AI Core, SAP AI Launchpad, Generative AI Hub, Document Information Extraction service Ã¢Â€Â” note these consume SAP AI Units
Step 3 Ã¢Â€Â” Only if standard config and standard SAP AI do NOT meet the requirement, proceed to Key User / Developer / Side-by-Side custom development, and state clearly why the standard/AI options were insufficient.
Verify AI feature availability and cost tier (Base vs Premium / AI Units) on the SAP Discovery Center (https://discovery-center.cloud.sap/) and SAP Business Accelerator Hub. Never assume an AI feature exists Ã¢Â€Â” confirm it.`;

const UI_HOSTING = `UI PLACEMENT & APPROACH-CONSISTENCY RULES (critical Ã¢Â€Â” never contradict yourself):
- SAP Fiori Elements apps (annotation-driven: List Report, Object Page, Analytical List Page, Overview Page) generated on a released or custom RAP OData service run IN-APP and are part of DEVELOPER EXTENSIBILITY Ã¢Â€Â” they do NOT require SAP BTP. A standard listÃ¢Â†Â’detail (two-screen) flow, table actions, and a confirmation/action dialog (e.g. Calculate / Save) that ARE achievable through Fiori Elements annotations + RAP actions stay PURE Developer Extensibility. Do not label these as a limitation and do not push them to BTP.
- The BTP (side-by-side) layer is required Ã¢Â€Â” making the answer a MIXED "Developer + BTP" (id "inapp_btp") or "Side-by-Side" recommendation Ã¢Â€Â” only when the UI/app genuinely cannot be delivered by Fiori Elements on RAP, e.g.: freestyle SAPUI5 with bespoke controls or non-standard multi-step UX beyond FE annotations, custom UI hosting on SAP Build Work Zone, CAP services, Integration Suite / Event Mesh, cross-system or non-SAP orchestration, or any artifact deployed on BTP.
- SELF-CONSISTENCY (mandatory): the recommended approach MUST match the artifacts you list. If ANY tool or limitation you list for the recommended approach implies a BTP-hosted artifact (freestyle SAPUI5 on BTP, CAP, SAP Build, Integration Suite, Event Mesh, BAS-deployed UI, etc.), you MUST recommend the corresponding MIXED approach ("inapp_btp") or "sidebyside" Ã¢Â€Â” NEVER a pure in-app approach (customisation / keyuser / developer). It is a contradiction to describe a BTP artifact as a "limitation" of a pure approach and still recommend that pure approach.
- Conversely, if Fiori Elements on RAP fully covers the UI, do NOT invent a BTP need Ã¢Â€Â” keep it pure Developer Extensibility and state explicitly that no BTP layer is required and why.`;

const UI_TRADEOFF = `UI EFFORT vs COST TRADE-OFF (weigh this in EVERY UI-bearing recommendation Ã¢Â€Â” do not decide on "can it be built in-app?" alone):
- First classify the UI nature: (a) display/reporting, (b) standard transactional (create/edit forms, listÃ¢Â†Â’detail, simple actions), or (c) dynamic/interactive (conditional rendering, bespoke controls, wizards, live recalculation, drag/drop, heavy client-side logic).
- Fiori Elements on RAP (in-app / Developer Extensibility): NO incremental runtime or licensing cost Ã¢Â€Â” it runs inside the S/4HANA Cloud you already own Ã¢Â€Â” BUT development effort and complexity rise sharply for non-standard or dynamic UI: annotation limits, verbose RAP/behavior code, and disproportionate effort for small bespoke interactions (even a single custom button/action can require substantial code). Strong fit for (a) and (b).
- Freestyle SAPUI5 / apps on SAP BTP (Side-by-Side): far more flexible and usually faster to build for dynamic/interactive UX and custom controls, BUT carries a real COMMERCIAL COST Ã¢Â€Â” BTP runtime (Cloud Foundry / Kyma), service plans, HTML5 app hosting / SAP Build Work Zone, plus any SAP AI Units Ã¢Â€Â” and its own lifecycle / DevOps overhead. Often the pragmatic fit for (c).
- DECISION RULE: balance (1) UI complexity & feasibility and the RAP build effort it implies against (2) the BTP commercial cost. If FE-on-RAP fits with reasonable effort, prefer it and note the zero incremental runtime cost. If the UI is dynamic/complex enough that RAP effort becomes disproportionate or infeasible, recommend Developer + BTP and STATE the trade-off explicitly: BTP cost is accepted to gain feasibility / better UX / lower build effort. Always make the cost-vs-effort reasoning visible in the recommendation.`;

const AGENTS = [
  { id: "analysis", label: "Approach Analyst", icon: "search",  color: t.accent,  bg: t.accentLight,  desc: "Scores 6 approaches across Key User, Developer & Side-by-Side" },
  { id: "design",   label: "Solution Design",  icon: "compass", color: t.purple,  bg: t.purpleLight,  desc: "Layer-split architecture for mixed approaches" },
  { id: "code",     label: "Developer Guide",  icon: "gear",    color: t.green,   bg: t.greenLight,   desc: "S/4 steps + BTP steps + Layer Integration step" },
  { id: "test",     label: "Test Pack",        icon: "flask",   color: t.amber,   bg: t.amberLight,   desc: "ABAP Unit + Jest/Mocha + cross-layer matrix" },
  { id: "td",       label: "TD Document",      icon: "doc",     color: t.red,     bg: t.redLight,     desc: "Sign-off doc with Layer Architecture section" },
];

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ Helpers Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
const isMixed = (ap) => ap && (ap.id === "inapp_btp" || ap.id === "keyuser_inapp");
const apName  = (ap) => ap ? (ap.name || ap.id) : "";

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ Monoline icon set (single stroke weight Ã¢Â€Â” the visual signature) Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
const ICON_PATHS = {
  search:   "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4",
  compass:  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z",
  gear:     "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2",
  flask:    "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9",
  doc:      "M6 3h8l4 4v14H6V3ZM14 3v4h4M9 12h6M9 16h6",
  sliders:  "M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4M14 4v4M6 10v4M12 16v4",
  user:     "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM5 21a7 7 0 0 1 14 0",
  terminal: "M4 4h16v16H4V4ZM7 9l3 3-3 3M13 15h4",
  cloud:    "M7 18a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.7 1.3A3.5 3.5 0 0 1 17.5 18H7Z",
  layers:   "M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5",
  link:     "M9 15l6-6M10.5 6.5 13 4a4 4 0 0 1 5.7 5.7L16 12.5M13.5 17.5 11 20a4 4 0 0 1-5.7-5.7L8 11.5",
  upload:   "M12 16V4M7 9l5-5 5 5M4 20h16",
  refresh:  "M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4",
  reset:    "M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4",
  check:    "M5 13l4 4L19 7",
  close:    "M6 6l12 12M18 6 6 18",
  alert:    "M12 4 2.5 20h19L12 4ZM12 10v4M12 17.5v.5",
  star:     "M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19.5l1-5.8L3.5 9.6l5.9-.8L12 3.5Z",
  arrow:    "M5 12h14M13 6l6 6-6 6",
  download: "M12 3v11M8 10l4 4 4-4M5 20h14",
  edit:     "M4 20h4l10-10-4-4L4 16v4ZM13.5 6.5l4 4",
  spark:    "M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3",
  file:     "M6 3h8l4 4v14H6V3ZM14 3v4h4",
  chevron:  "M9 6l6 6-6 6",
};
function Icon({ name, size = 16, color = "currentColor", stroke = 1.6, style }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: "block", ...style }} aria-hidden="true">
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ Prompts Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
function getAnalysisPrompt(fd) {
  return `You are an SAP S/4HANA Public Cloud Solution Architect. Analyze the provided Functional Design and evaluate exactly 6 approaches.

CRITICAL S/4HANA PUBLIC CLOUD RULES (apply to ALL approaches):
- NO BAPIs Ã¢Â€Â” they do not exist in S/4HANA Public Cloud
- NO custom BAdI creation Ã¢Â€Â” ONLY pre-delivered BAdIs from Business Accelerator Hub can be used
- CDS Views: ONLY released CDS views (C1 contract) from Business Accelerator Hub
- APIs: ONLY released APIs via Communication Scenarios from Business Accelerator Hub
- ABAP Cloud (Tier 1 released objects) only Ã¢Â€Â” no classic ABAP
- Business Accelerator Hub is the single source of truth

${TAXONOMY}

${BTP_SERVICES}

${AI_FIRST}

${REFS}

${UI_HOSTING}

${UI_TRADEOFF}

Map the 6 approaches to this model: "keyuser" = Key User Extensibility; "developer" = Developer Extensibility (RAP); "sidebyside" = Side-by-Side on BTP (populate "tools" ONLY from the BTP services list above); "customisation" = standard config only; the two mixed approaches combine the pillars. For any approach that uses BTP, its "tools" must be exact service names from the list above.
Additionally, in "recommendation_reason" you MUST state the result of the Standard-First & AI-First evaluation: whether a standard SAP capability or a standard SAP AI service (name it) could meet the requirement, and if so why it is preferred over custom development Ã¢Â€Â” or why custom development is nonetheless required.

For the two mixed approaches, include a "layer_split" object that clearly states what each layer handles and why both are needed.
For a mixed recommendation, explain what drives each layer.
For a pure recommendation, explain why mixed would be over-engineering.

FUNCTIONAL DESIGN:
${fd}

RESPOND WITH ONLY VALID JSON Ã¢Â€Â” a single complete object, no markdown, no backticks, no preamble. Keep it COMPACT to avoid truncation: each of benefits/limitations/tools = max 3 short items; each summary = max 2 sentences; do not pad. Ensure the JSON is fully closed.
{
  "approaches": [
    {
      "id": "customisation",
      "name": "Customisation (Standard Configuration)",
      "feasibility_score": 6,
      "effort": "Low",
      "risk": "Low",
      "can_fully_meet": false,
      "benefits": ["..."],
      "limitations": ["..."],
      "tools": ["..."],
      "summary": "2-3 sentences"
    },
    {
      "id": "keyuser",
      "name": "Key User Extensibility",
      "feasibility_score": 6,
      "effort": "Medium",
      "risk": "Low",
      "can_fully_meet": false,
      "benefits": ["..."],
      "limitations": ["..."],
      "tools": ["..."],
      "summary": "..."
    },
    {
      "id": "developer",
      "name": "Developer Extensibility (ABAP Cloud / RAP)",
      "feasibility_score": 8,
      "effort": "High",
      "risk": "Medium",
      "can_fully_meet": true,
      "benefits": ["..."],
      "limitations": ["..."],
      "tools": ["..."],
      "summary": "..."
    },
    {
      "id": "sidebyside",
      "name": "Side-by-Side Extensibility (SAP BTP)",
      "feasibility_score": 7,
      "effort": "High",
      "risk": "High",
      "can_fully_meet": true,
      "benefits": ["..."],
      "limitations": ["..."],
      "tools": ["..."],
      "summary": "..."
    },
    {
      "id": "inapp_btp",
      "name": "In-App + BTP Mixed",
      "feasibility_score": 9,
      "effort": "High",
      "risk": "Medium",
      "can_fully_meet": true,
      "benefits": ["..."],
      "limitations": ["..."],
      "tools": ["..."],
      "summary": "...",
      "layer_split": {
        "layer1_label": "S/4HANA In-App (RAP / ABAP Cloud)",
        "layer1_handles": ["business logic", "CDS data model", "OData service exposure"],
        "layer2_label": "SAP BTP (CAP / Integration Suite)",
        "layer2_handles": ["complex UI", "cross-system orchestration", "non-SAP integration"],
        "why_both_needed": "RAP handles core S/4 logic efficiently; BTP is required because..."
      }
    },
    {
      "id": "keyuser_inapp",
      "name": "Key User + In-App Mixed",
      "feasibility_score": 8,
      "effort": "Medium",
      "risk": "Low",
      "can_fully_meet": true,
      "benefits": ["..."],
      "limitations": ["..."],
      "tools": ["..."],
      "summary": "...",
      "layer_split": {
        "layer1_label": "Key User Layer (Fiori-based, no ABAP)",
        "layer1_handles": ["custom fields", "simple validations via BAdI", "screen adaptations"],
        "layer2_label": "In-App RAP Layer (ABAP Cloud)",
        "layer2_handles": ["complex business logic", "custom entities", "advanced validations"],
        "why_both_needed": "Key User covers configuration-level needs without dev effort; RAP is needed only where..."
      }
    }
  ],
  "recommended": "developer",
  "recommendation_reason": "3-4 sentence justification. If mixed recommended, explain what drives each layer. If pure, explain why mixed would be over-engineering.",
  "ai_evaluation": {
    "standard_capability": "Does standard SAP config / a delivered app already cover this? yes/no + which.",
    "standard_ai": "Name any delivered SAP AI capability that could meet the need (Joule / Joule Agent, SAP Document AI, embedded AI feature, etc.), or 'none applicable'.",
    "recommendation": "Use standard SAP AI | Extend a standard SAP AI feature | Custom build required",
    "reason": "1-2 sentences on why standard/AI is or is not sufficient, so custom effort is only spent where it adds value."
  },
  "ui_tradeoff": {
    "ui_nature": "display | standard transactional | dynamic/interactive",
    "rap_effort": "effort & complexity of delivering this UI as Fiori Elements on RAP (note: NO incremental runtime cost).",
    "btp_cost": "flexibility BTP adds for this UI AND its commercial cost (runtime, service plans, hosting, AI units).",
    "verdict": "Fiori Elements on RAP (in-app, no runtime cost) | Developer + BTP (accept BTP cost for feasibility/UX)"
  }
}`;
}

// Enhancement / brownfield context injected into downstream prompts
function enhBlock(mode, baseline) {
  if (mode !== "enhance") return "";
  return `
ENHANCEMENT / BROWNFIELD CONTEXT (MANDATORY Ã¢Â€Â” READ FIRST):
- This is NOT a greenfield build. You are enhancing an EXISTING, already-delivered RICEFW object.
- PRESERVE-FIRST: reuse the existing solution as designed in the baseline TSD/FD. Do NOT redesign, replace, or re-architect working functionality, and do NOT switch extensibility paradigm, unless the change is impossible within the existing design (state why explicitly if so).
- MINIMUM DEVIATION: deliver the change as the smallest possible delta inside the existing objects and their existing paradigm. Prefer extending current objects over adding new ones; prefer adding a small new artifact over any new layer/solution.
- Produce a DELTA: mark every item as [NEW], [MODIFIED], or [UNCHANGED Ã¢Â€Â” reference only].
- Maintain clean-core: enhancements must extend released objects / released extension points only.

EXISTING TECHNICAL DESIGN (BASELINE):
${baseline && baseline.trim() ? baseline : "(baseline TD not provided Ã¢Â€Â” infer the current state from the change request and flag every assumption clearly)"}
`;
}

function getEnhancementAnalysisPrompt(change, baseline) {
  return `You are an SAP S/4HANA Public Cloud Solution Architect performing an ENHANCEMENT IMPACT ANALYSIS on an already-delivered RICEFW object.

CORE PRINCIPLE Ã¢Â€Â” PRESERVE-FIRST / MINIMUM DEVIATION (this is an enhancement, NOT a greenfield build):
- The existing solution designed in the TSD/FD is the baseline and MUST be reused. Do NOT propose a new solution or a different extensibility paradigm unless the change is genuinely INFEASIBLE within the existing design.
- Your DEFAULT and strongly-preferred answer is to absorb the change inside the EXISTING objects, within their EXISTING extensibility paradigm, as the smallest possible delta.
- Escalate to anything new ONLY when a lower-deviation option cannot work Ã¢Â€Â” and then justify precisely why the existing solution cannot accommodate it.

You are given the EXISTING Technical Design (baseline) and a CHANGE REQUEST / updated Functional Design.

S/4HANA PUBLIC CLOUD RULES (apply to every option):
- NO BAPIs, NO custom BAdI creation (pre-delivered BAdIs from Business Accelerator Hub only)
- Released CDS views (C1 contract) and released APIs via Communication Scenarios only
- ABAP Cloud (Tier 1 released objects) only Ã¢Â€Â” no classic ABAP

${TAXONOMY}

${BTP_SERVICES}

${AI_FIRST}

${REFS}

${UI_HOSTING}

${UI_TRADEOFF}

FIRST, assess fit within the existing solution. THEN present options as an ESCALATION LADDER ordered by LEAST deviation first. Include ONLY the rungs that are actually relevant, and make "recommended" the LOWEST feasible rung:
- Tier 0 Ã¢Â€Â” Absorb within existing config / Key User (no code change): the existing objects already support it, or a standard config / custom field / adaptation covers it.
- Tier 1 Ã¢Â€Â” Extend the existing object in place (PREFERRED for code changes): add fields/logic to the CURRENT RAP BO / CAP service / CDS, same paradigm, minimal footprint.
- Tier 2 Ã¢Â€Â” Add a minimal net-new artifact wired into the existing flow: only if the existing object cannot hold the change; keep it small and connected to the current design.
- Tier 3 Ã¢Â€Â” New solution / different paradigm or new layer (e.g. move to BTP): LAST RESORT, only if Tiers 0Ã¢Â€Â“2 are infeasible; state exactly why the existing solution cannot accommodate the change.
Every rung above Tier 1 MUST carry a "gate" explaining why the lower tiers were insufficient. Do not offer higher tiers as free alternatives.

EXISTING TECHNICAL DESIGN (BASELINE):
${baseline && baseline.trim() ? baseline : "(baseline TD not provided Ã¢Â€Â” infer current state from the change request and flag assumptions)"}

CHANGE REQUEST / UPDATED FUNCTIONAL DESIGN:
${change}

RESPOND WITH ONLY VALID JSON Ã¢Â€Â” a single complete object, no markdown, no backticks, no preamble. Keep it COMPACT to avoid truncation: benefits/limitations/tools/impact = max 3 short items each; summary = max 2 sentences. Ensure the JSON is fully closed.
{
  "fit_assessment": {
    "fits_existing_solution": true,
    "existing_paradigm": "the extensibility paradigm already used by the baseline (e.g. Developer Extensibility / RAP)",
    "verdict": "Extend existing solution | New solution required",
    "why": "1-2 sentences. If a new solution is required, state precisely why the existing design cannot absorb the change; otherwise confirm the change stays inside the existing objects/paradigm."
  },
  "approaches": [
    {
      "id": "extend_in_place",
      "name": "Tier 1 Ã¢Â€Â” Extend Existing Object In Place",
      "tier": 1,
      "gate": "",
      "feasibility_score": 8,
      "effort": "Low",
      "risk": "Low",
      "can_fully_meet": true,
      "benefits": ["smallest blast radius", "..."],
      "limitations": ["..."],
      "tools": ["ADT","RAP","..."],
      "impact": ["[MODIFIED] <object> Ã¢Â€Â” what changes", "[UNCHANGED] <object> Ã¢Â€Â” untouched"],
      "summary": "2 sentences on how this rung delivers the change within the existing solution"
    }
  ],
  "recommended": "extend_in_place",
  "recommendation_reason": "3-4 sentences. Confirm this is the lowest-deviation feasible rung, state the blast radius, what it deliberately reuses/keeps untouched from the existing design, and (only if a higher tier was chosen) why the existing solution could not absorb the change."
}`;
}

function getDesignPrompt(fd, ap, edit, mode, baseline) {
  const apn = apName(ap);
  const mixed = isMixed(ap);
  const enh = mode === "enhance";
  const mixedInstr = mixed ? `
MIXED APPROACH INSTRUCTIONS (MANDATORY):
- Split EVERY section into clearly labelled layers Ã¢Â€Â” never blur the boundary
- In Architecture: draw each layer separately with the integration bridge between them
- In Data Model, Process Flow, Validations, Integration Points: label which layer owns each item
${ap && ap.id === "inapp_btp" ? "- Show exactly how the RAP OData service is consumed by BTP via Communication Scenario" : ""}
${ap && ap.id === "keyuser_inapp" ? "- Show which requirements Key User handles and precisely where RAP takes over" : ""}
` : "";

  return `You are an SAP S/4HANA Public Cloud Solution Architect. Write a ${enh ? "solution design DELTA document for an enhancement to an existing build" : "unified solution design document"}.
${enhBlock(mode, baseline)}
S/4HANA PUBLIC CLOUD RULES:
- Business Accelerator Hub: source for ALL released objects (CDS, APIs, BAdIs, Fiori apps)
- NO BAPIs, NO custom BAdIs, released CDS views (C1 contract) only
- APIs via Communication Scenarios only, ABAP Cloud Tier 1 only
${REFS}
${UI_HOSTING}
${UI_TRADEOFF}
${(mixed || (ap && ap.id === "sidebyside")) ? "\n" + BTP_SERVICES + "\nName BTP services in the architecture and service tables using ONLY the exact names above.\n" : ""}

ARCHITECTURE RULES (MANDATORY):
- Assume APIs are exposed from ABAP CDS views via OData V4 or V2
- All filtering, transformation, and business logic goes in the CAP (CAPM) layer Ã¢Â€Â” not ABAP
- Custom tables may be created as CBO (Custom Business Objects) in S/4HANA where required
- Reflect this CDS-as-API-source + CAPM-filtering-layer pattern in all service definitions

S/4HANA PUBLIC CLOUD API REQUIREMENTS:
- List EVERY S/4HANA public cloud API needed for this BTP app (extracted from the FD)
- For each API provide: Name, API Hub URL, OData version, Entity sets used, Operations (GET/POST/PATCH/DELETE), Purpose in context of this app
- Only reference APIs available on SAP API Business Hub for public cloud Ã¢Â€Â” no internal FM calls

UI5 ENTITY-TO-VIEW MAPPING (MANDATORY):
- For each UI5 view, specify which CDS or OData entity set is bound and the service that exposes it
- For every page navigation, list the exact routing parameters passed (e.g. ?ID={SalesOrderID})
- Where RAP API metadata is available, extract NavigationProperty definitions (name, target entity type, multiplicity) from the \$metadata document and use them directly in expand operations and binding paths Ã¢Â€Â” do not guess navigation paths
${mixedInstr}
${enh ? "CHANGE REQUEST / UPDATED FUNCTIONAL DESIGN:" : "FUNCTIONAL DESIGN:"}
${fd}

APPROVED ${enh ? "ENHANCEMENT STRATEGY" : "APPROACH"}: ${apn}${edit ? "\n\nUSER EDIT REQUEST: " + edit : ""}

Write the following sections in order:

# Solution Design${enh ? " Ã¢Â€Â” Enhancement Delta" : ""}: [Title]
${enh ? "\n## Change Impact & Scope\nWhat exists today, what this change touches, and what stays untouched. Table: Object | Type | [NEW]/[MODIFIED]/[UNCHANGED] | Impact of change.\n" : ""}
## Overview
What is being built, which ${enh ? "enhancement strategy" : "approach"}, and why. Include one line confirming the Standard-First & AI-First check: whether a standard SAP capability or standard SAP AI service (name it) was considered and why custom development is justified.

## Architecture
Text-based component diagram showing all layers. ${mixed ? "Draw each layer separately with the integration bridge between them." : "Show SAP modules, integration points, data flow."} Reflect the CDS-as-API-source + CAPM-filtering-layer pattern.

## S/4HANA Public Cloud APIs Required
Table: API Name | API Hub URL | OData Version | Entity Sets Used | Operations Required | Purpose in This App

## Process Flow
Numbered end-to-end steps from trigger to completion. Include decision points. ${mixed ? "Label each step with [Layer] prefix." : ""}

## Data Model
Table: CDS View/Entity | Type | Key Fields | Purpose | ${mixed ? "Layer | " : ""}Associations | Navigation Properties

## UI5 View-to-Entity Mapping
Table: UI5 View | Bound Entity Set | Exposing Service | Route Parameters | Navigation Properties Used (from \$metadata)

## Validations & Business Rules
List each rule, trigger, check logic, error message. ${mixed ? "Label which layer owns each validation." : ""} For BAdI-based: exact pre-delivered BAdI name from Business Accelerator Hub.

## Integration Points
Table: Direction | API/Comm Scenario | Method | Auth | Error Handling | ${mixed ? "Layer" : ""}

## Security
Roles, catalogs, restrictions table.

## Business Accelerator Hub Objects
Table: Object Type | Technical Name | Description | Release Status | Used In

## Configuration Checklist
Numbered config/setup steps before code works.`;
}

function getCodePrompt(fd, ap, design, edit, mode, baseline) {
  const apn = apName(ap);
  const mixed = isMixed(ap);
  const enh = mode === "enhance";
  const mixedInstr = mixed ? `
MIXED APPROACH Ã¢Â€Â” MANDATORY STRUCTURE:
${ap && ap.id === "inapp_btp" ? `Group steps under two banners:
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
 LAYER 1 Ã¢Â€Â” S/4HANA IN-APP STEPS (ABAP Cloud, ADT, RAP)
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
[All RAP/ABAP steps here]

Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
 LAYER 2 Ã¢Â€Â” BTP STEPS (CAP Node.js/Java, Integration Suite)
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
[All BTP/CAP steps here]

Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
 LAYER INTEGRATION STEP (MANDATORY)
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
Show exactly: which OData service is exposed from S/4, which Communication Scenario is used, and how BTP calls it (destination config, service binding, HTTP client code).` : ""}
${ap && ap.id === "keyuser_inapp" ? `Group steps under two banners:
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
 LAYER 1 Ã¢Â€Â” KEY USER STEPS (Fiori apps, no ABAP)
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
[All Key User steps here Ã¢Â€Â” Custom Fields, BAdI implementations via Fiori, screen adaptations]

Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
 LAYER 2 Ã¢Â€Â” IN-APP RAP STEPS (ABAP Cloud, ADT)
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
[Only RAP steps for requirements Key User cannot meet]

Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
 LAYER INTEGRATION STEP (MANDATORY)
Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
Show how Key User objects and RAP objects co-exist and interact.` : ""}
` : "";

  return `You are an SAP S/4HANA Public Cloud Developer Tutor. Generate a step-by-step ${enh ? "ENHANCEMENT build guide Ã¢Â€Â” a delta on an existing object" : "build guide"}.
${enhBlock(mode, baseline)}${enh ? "For every step, tag it [NEW], [MODIFIED], or [UNCHANGED Ã¢Â€Â” reference only]. For [MODIFIED] steps, show the existing code state and the changed lines. Do not re-emit unchanged objects in full Ã¢Â€Â” reference them.\n" : ""}
S/4HANA PUBLIC CLOUD MANDATORY RULES:
- NO BAPIs, NO custom BAdI creation, ABAP Cloud (Tier 1) only
- ADT (Eclipse) is the IDE Ã¢Â€Â” not SE80/SE38
- Released CDS views (C1) and pre-delivered BAdIs from Business Accelerator Hub only
- No classic ABAP (no CALL FUNCTION, no SELECT from unreleased tables)
${(mixed || (ap && ap.id === "sidebyside")) ? "\n" + BTP_SERVICES + "\nEvery BTP step must name the exact service(s) from the list above; do not reference services unavailable for S/4HANA Public Cloud.\n" : ""}

SAP UI5 + CAP CODING STANDARDS (MANDATORY Ã¢Â€Â” apply to every generated artifact):

Package & API hygiene:
- Use ONLY non-deprecated npm packages Ã¢Â€Â” verify each package before use; never include deprecated libraries
- Use ONLY non-deprecated SAP UI5 controls Ã¢Â€Â” check SAP UI5 SDK before use; flag any control that may be deprecated
- Use ONLY non-deprecated OData APIs Ã¢Â€Â” verify on SAP API Business Hub before referencing
- Prefer OData V4 for ALL CAP-compatible service connections; use V2 only when V4 is unavailable and state why
- Do not generate code with deprecated patterns even if functionally equivalent

Email functionality (when required):
- Use a cost-effective cloud email service (e.g. SendGrid free tier or SAP BTP Mail service)
- Integrate email sending via a CAP action Ã¢Â€Â” never via direct SMTP calls from UI5
- Validate service availability and free-tier limits; include the chosen service in the implementation steps

Auto-save draft (apply to ALL CDS HDI entities with user data entry):
- Implement auto-save to Draft for every applicable CDS entity
- Trigger save via a debounced CAP action call Ã¢Â€Â” NOT on every keystroke
- Explicitly state which entities have draft enabled and the debounce interval used

Initial load + lazy loading (apply to ALL views):
- Cap every onInit() data fetch to 50Ã¢Â€Â“100 records using OData \$top
- Never load unbounded data on initialization
- Implement lazy loading (scroll-triggered or pagination) for all subsequent records
- Apply to ALL SmartTable, Table, and List controls across every XML view Ã¢Â€Â” not just the primary view

SmartTable filters + column widths (apply to EVERY SmartTable):
- Verify all filter bar fields are correctly bound and functional in every XML view
- Set precise column widths per field content type Ã¢Â€Â” never use auto-width
- Adjust column widths after data load to prevent truncation or excess whitespace
- Check every SmartTable instance across all XML views Ã¢Â€Â” not just the primary view

Custom entity class + chunk fetch (apply to ALL external API calls):
- Route ALL external API calls through a custom CAP entity class method Ã¢Â€Â” no direct calls from UI5
- Implement chunked fetch: split requests into batches (e.g. 50 records per chunk)
- Process chunks sequentially or with a defined concurrency limit
- Merge all chunk results before returning from the entity method
- Declare the API-to-entity field mapping explicitly inside the custom method

Architecture Ã¢Â€Â” CDS-as-API-source + CAPM filtering layer:
- Assume APIs are exposed from ABAP CDS views via OData V4 or V2
- All filtering, transformation, and business logic goes in the CAP (CAPM) layer Ã¢Â€Â” not ABAP
- Custom tables may be created as CBO (Custom Business Objects) in S/4HANA where appropriate
- Reflect this architecture in all CAP service definitions and handler implementations

UI5 entity-to-view mapping + routing parameters:
- For each UI5 view, specify which CDS or OData entity set is bound and the service exposing it
- For every page navigation, list the exact routing parameters passed (e.g. ?ID={SalesOrderID})
- Provide the same level of detail as RAP requirements Ã¢Â€Â” no shortcuts

Navigation property analysis:
- When RAP API metadata is available, analyse the \$metadata document for the target entity
- Extract all NavigationProperty definitions: name, target entity type, multiplicity
- Use extracted navigation properties directly in UI5 expand operations and binding paths
- Do not manually guess navigation paths Ã¢Â€Â” derive them from metadata only
${mixedInstr}
FUNCTIONAL DESIGN: ${fd}
APPROACH: ${apn}
DESIGN: ${design}${edit ? "\n\nUSER EDIT REQUEST: " + edit : ""}

For EACH development object write:

### Step N: [What you are creating]
**Open:** Exact navigation path
**Name:** Object name and type
**Code:**
\`\`\`abap
// Complete code Ã¢Â€Â” never abbreviate
\`\`\`
**Activate & Verify:** What to check after activation
**Troubleshooting:** Specific errors and fixes

Cover every object needed. Complete code in every step Ã¢Â€Â” never use "..." or "similar to above". Include troubleshooting for every step.`;
}

function getTestPrompt(fd, ap, design, code, edit, mode, baseline) {
  const apn = apName(ap);
  const mixed = isMixed(ap);
  const enh = mode === "enhance";
  const mixedInstr = mixed ? `
MIXED APPROACH Ã¢Â€Â” MANDATORY TEST STRUCTURE:
${ap && ap.id === "inapp_btp" ? `- Split unit tests by layer: ABAP Unit tests for S/4 layer; Jest/Mocha tests for BTP CAP layer
- Add a MANDATORY cross-layer integration test matrix: BTP trigger Ã¢Â†Â’ S/4 API call Ã¢Â†Â’ expected response for each scenario
- Add a Layer Integration Troubleshooting block covering:
  * Destination misconfiguration (exact error codes, diagnosis steps, fix)
  * Communication Arrangement failures (exact navigation, error codes, fix)
  * Principal propagation errors (symptom, root cause, step-by-step fix)` : ""}
${ap && ap.id === "keyuser_inapp" ? `- Validate Key User objects via Fiori navigation steps (exact click paths)
- Validate RAP objects via ABAP Unit tests
- Add cross-layer validation: confirm Key User custom fields flow through to RAP entities` : ""}
` : "";

  return `You are an SAP S/4HANA Public Cloud QA Engineer. Generate a complete test pack${enh ? " for an ENHANCEMENT Ã¢Â€Â” cover both regression of existing behavior and the new/changed behavior" : ""}.
${enhBlock(mode, baseline)}${enh ? "MANDATORY: include a Regression section that verifies unchanged functionality still works, plus targeted tests for every [NEW]/[MODIFIED] item.\n" : ""}
S/4HANA PUBLIC CLOUD CONTEXT:
- All BAdIs are pre-delivered from Business Accelerator Hub
- All CDS views are released (C1) or custom-built on released views
- No BAPIs Ã¢Â€Â” only released APIs via Communication Scenarios
${mixedInstr}
${enh ? "CHANGE REQUEST / UPDATED FD:" : "FUNCTIONAL DESIGN:"} ${fd}
${enh ? "ENHANCEMENT STRATEGY:" : "APPROACH:"} ${apn}
DESIGN: ${design}
CODE: ${code}${edit ? "\n\nUSER EDIT REQUEST: " + edit : ""}

## A. Unit Tests
${mixed && ap.id === "inapp_btp"
  ? "### A1. S/4HANA Layer Ã¢Â€Â” ABAP Unit Tests\nComplete ABAP Unit test classes for each behavior implementation method.\n\n### A2. BTP Layer Ã¢Â€Â” Jest/Mocha Tests\nComplete Jest/Mocha test suites for CAP service handlers."
  : "Complete ABAP Unit test classes for each behavior implementation method Ã¢Â€Â” full code, not stubs."}

## B. Known Issues & Troubleshooting
For EACH validation/business rule, write a block:
### B.N [Issue Title]
**Symptom:** What the user sees
**Root Cause:** Specific reason
**Diagnosis Steps:** Exact navigation paths, field names, error codes
**Fix:** Step-by-step resolution
**Prevention:** How to avoid recurrence
${mixed && ap.id === "inapp_btp" ? "\n### Layer Integration Troubleshooting\nCover: destination misconfiguration, Communication Arrangement failures, principal propagation errors Ã¢Â€Â” each with exact error codes and fix steps." : ""}

## C. Integration Tests
Table: Test ID | Scenario | API/Event | Input | Expected Output | Pass Criteria
${mixed && ap.id === "inapp_btp" ? "\n### Cross-Layer Integration Matrix\nTable: BTP Trigger | S/4 API Called | Input Payload | Expected S/4 Response | Pass Criteria" : ""}

## D. UAT Scripts
Table: ID | User Action (exact Fiori navigation) | Expected Result | Data Needed

## E. Negative Tests
Table: ID | What Goes Wrong | Expected Error | How to Verify

CRITICAL: Troubleshooting section must be extremely specific Ã¢Â€Â” exact navigation, exact field names, exact error codes. A developer reading at 2 AM must be able to diagnose any issue.`;
}

function getTDPrompt(fd, ap, design, code, tests, edit, mode, baseline) {
  const apn = apName(ap);
  const mixed = isMixed(ap);
  const enh = mode === "enhance";
  const today = new Date().toISOString().split("T")[0];

  return `You are an SAP S/4HANA Public Cloud Technical Design Document author.
Write a CONCISE sign-off TD document Ã¢Â€Â” target 8Ã¢Â€Â“12 pages maximum. Follow the template structure below exactly.
${enhBlock(mode, baseline)}
STRICT LENGTH RULES (non-negotiable):
- Do NOT repeat information already stated in another section
- Do NOT add sections beyond those listed below
- Prose paragraphs: 3Ã¢Â€Â“5 sentences max per section
- Every table: only rows with real data Ã¢Â€Â” no filler rows
- Processing Logic: bullet points only Ã¢Â€Â” no lengthy paragraphs
- No appendix, no glossary, no deployment plan, no risk matrix

S/4HANA PUBLIC CLOUD RULES:
- No BAPIs. Pre-delivered BAdIs only (Business Accelerator Hub). Released CDS views (C1 contract) only.
- APIs via Communication Scenarios only. ABAP Cloud Tier 1 only.
${mixed ? `MIXED APPROACH: Tag every object and config step with its layer Ã¢Â€Â” [S/4 In-App] or [BTP] or [Key User] or [RAP].` : ""}
${enh ? `ENHANCEMENT: This is an UPDATE to an existing TD. Bump the version (e.g. 2.0). Tag every object/step [NEW], [MODIFIED], or [UNCHANGED]. Add a "Change Log" listing exactly what this revision changes versus the baseline.` : ""}

${enh ? "CHANGE REQUEST / UPDATED FD:" : "FUNCTIONAL DESIGN:"} ${fd}
APPROVED ${enh ? "ENHANCEMENT STRATEGY" : "APPROACH"}: ${apn}
SOLUTION DESIGN: ${design}${edit ? "\n\nUSER EDIT REQUEST: " + edit : ""}

---

# Technical Design Document${enh ? " (Enhancement)" : ""}

## 1. Revision History
Table: Version | Date | Author | Reviewed By | Approved By | Changes
One row: ${enh ? "2.0" : "1.0"} | ${today} | [Author] | [Reviewer] | [Approver] | ${enh ? "Enhancement Ã¢Â€Â” see Change Log" : "Initial draft"}
${enh ? "\n### 1.1 Change Log\nTable: # | Object / Step | [NEW]/[MODIFIED]/[UNCHANGED] | What changed vs. baseline. List every delta.\n" : ""}

## 2. General

### 2.1 Priority
State priority: High / Medium / Low Ã¢Â€Â” one line, with brief justification.

### 2.2 Phase Tracking
Table: TD Prepared By | TD Reviewed By | Sign Off By | User Contact | Date
One row with today's date (${today}), other fields blank for manual completion.

## 3. Technical Specification

### 3.1 Development Attributes
Table (two-column key-value): include only fields relevant to this approach Ã¢Â€Â”
${mixed && ap && ap.id === "inapp_btp" ? `
Package Name | [value]
Triggering App | [Fiori tile / BTP app]
Menu Path | [navigation path]
Type of Solution | SAP Fiori + CAPM + Node.js
Output Type | Fiori Screen
Module Name (BAS) | [app-id]
Technical Project Type | Freestyle
App ID | [app-id]
Destination | [destination name]
Communication Arrangement | [comm arrangement ID]
Scenario ID | [SAP_COM_XXXX]
Communication System | [system name]
Communication User | [user name]
OData Services Used | [list each /sap/opu/... path]
Build WorkZone Tile Name | [tile name]
Target Mapping (Semantic Object-Action) | [semantic-object-action]
Dev Space on BTP | [space name]
Service Instances on BTP | [list instances]
` : mixed && ap && ap.id === "keyuser_inapp" ? `
Package Name | [value]
Triggering App | [Fiori tile]
Menu Path | [navigation path]
Type of Solution | Key User + ABAP Cloud
Output Type | Fiori Screen
Custom Fields & Logic App | [app name]
BAdI Name | [pre-delivered BAdI]
RAP Object | [behavior definition name]
` : `
Package Name | [value]
Triggering App | [Fiori tile / app]
Menu Path | [navigation path]
Type of Solution | [Standard / Custom ABAP / SAP Fiori / CAPM]
Output Type | [Fiori Screen / Report / Form]
Transport Request Number | NA
Export Software Collection | [value]
`}

### 3.2 OData Services & APIs
Table: Service Path | OData Version | Entity Sets Used | Operations | Communication Scenario
List every API used. Only APIs from SAP API Business Hub for public cloud.

${mixed ? `### 3.3 Layer Architecture
Two-column table: Layer | Components Owned
Row 1: ${ap && ap.id === "inapp_btp" ? "S/4HANA In-App (RAP/ABAP Cloud)" : "Key User Layer"} | [list components]
Row 2: ${ap && ap.id === "inapp_btp" ? "SAP BTP (CAP/Integration Suite)" : "In-App RAP Layer"} | [list components]
Integration bridge: state the Communication Scenario and Destination used.
` : ""}

## 4. Processing Logic

Bullet-point description of the custom logic flow Ã¢Â€Â” triggered by what event, conditions checked, outcomes produced. Keep to 10Ã¢Â€Â“15 bullets maximum. Reference exact CDS views, BAdIs, or CAP handlers by technical name.

${mixed ? `Split into two sub-sections:
#### ${ap && ap.id === "inapp_btp" ? "S/4HANA In-App Logic" : "Key User Logic"}
[Bullet points for this layer]

#### ${ap && ap.id === "inapp_btp" ? "BTP/CAP Logic" : "RAP Logic"}
[Bullet points for this layer]
` : ""}

Custom Fields (if any):
Table: No. | Label | Technical Name | Field Type | Business Context

Custom Business Objects (if any):
Table: No. | Label | Technical Name

Pre-delivered BAdI used (if any): [BAdI technical name Ã¢Â€Â” from Business Accelerator Hub only]

UI Screen Logic (for each screen/view):
- Screen name and purpose (1 line)
- What triggers rendering (user action / route / event)
- OData entity or CAP method supplying data
- Key user interactions and outcomes (bullet list, max 6 bullets per screen)
- Conditional display rules (visibility, enable/disable)

Assumptions / Notes: bullet list, max 5 items.

## 5. Security Requirement

### 5.1 Authorizations
Table: Authorization Name | Field | Description | Screen / Report
List only real authorization objects needed Ã¢Â€Â” no filler rows.

### 5.2 Others
One sentence if additional security considerations exist, otherwise state "None."

## 6. Error Handling / Validations
Table: Screen / Report / Form | Error Condition | Error Result / Message | Remarks
Cover every validation from the FD Ã¢Â€Â” one row per validation rule. Keep messages concise.

## 7. Additional Information
Any notes not covered above Ã¢Â€Â” max 3 bullet points. If none, state "None."

---
TONE: Concise technical document for developer handoff and stakeholder sign-off. No marketing language. No repeated content across sections. Tables must contain real data rows Ã¢Â€Â” no placeholder-only rows.`;
}

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ API Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
async function callClaudeFull(prompt, maxCont = 2, onProgress) {
  let fullText = "";
  let messages = [{ role: "user", content: prompt }];
  for (let i = 0; i <= maxCont; i++) {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 8192, messages }),
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    const chunk = d.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    fullText += chunk;
    if (onProgress) onProgress(i + 1, maxCont + 1);
    if (d.stop_reason === "end_turn") break;
    if (d.stop_reason === "max_tokens" && i < maxCont) {
      messages = [
        { role: "user", content: prompt },
        { role: "assistant", content: fullText },
        { role: "user", content: "Continue exactly where you left off. No preamble, no repetition." },
      ];
    } else break;
  }
  return fullText;
}

// Extract the first balanced top-level JSON object from a string (brace-aware, string-aware)
function extractJsonObject(text) {
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else {
      if (c === '"') inStr = true;
      else if (c === "{") depth++;
      else if (c === "}") { depth--; if (depth === 0) return text.slice(start, i + 1); }
    }
  }
  return null; // unterminated Ã¢Â€Â” response was truncated
}

async function callClaudeJSON(prompt, maxCont = 3) {
  let raw = "";
  let messages = [{ role: "user", content: prompt }];
  for (let i = 0; i <= maxCont; i++) {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 8192, messages }),
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    raw += d.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    // If we already have a complete balanced object, stop early
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    if (extractJsonObject(cleaned)) { raw = cleaned; break; }
    if (d.stop_reason === "max_tokens" && i < maxCont) {
      messages = [
        { role: "user", content: prompt },
        { role: "assistant", content: raw },
        { role: "user", content: "Continue the JSON EXACTLY where you left off. Output only the remaining raw JSON Ã¢Â€Â” no preamble, no repetition, no backticks." },
      ];
    } else break;
  }
  raw = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  let json = extractJsonObject(raw) || raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  const attempts = [
    json,
    json.replace(/,\s*([}\]])/g, "$1"),           // strip trailing commas
    json.replace(/,\s*([}\]])/g, "$1").replace(/[\u0000-\u001F]+/g, " "), // + strip control chars
  ];
  for (const a of attempts) {
    try { return JSON.parse(a); } catch { /* try next */ }
  }
  throw new Error("Failed to parse AI response. Please try again.");
}

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ File readers Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
const toBase64 = (f) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = () => rej(new Error("Read failed")); r.readAsDataURL(f); });
const readText = (f) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(new Error("Read failed")); r.readAsText(f); });
const readBuf  = (f) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(new Error("Read failed")); r.readAsArrayBuffer(f); });

async function extractPdf(base64) {
  const r = await fetch(API, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 8192, messages: [{ role: "user", content: [
      { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
      { type: "text", text: "Extract the complete text. Preserve formatting." },
    ]}] }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (["txt", "md", "csv", "json", "xml"].includes(ext)) return await readText(file);
  if (ext === "pdf") return await extractPdf(await toBase64(file));
  if (["docx", "doc"].includes(ext)) {
    const res = await mammoth.extractRawText({ arrayBuffer: await readBuf(file) });
    if (res.value?.trim().length > 0) return res.value;
    throw new Error("No text found in document.");
  }
  throw new Error(`Unsupported file type: .${ext}`);
}

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ Markdown renderer Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
function inl(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${t.text};font-weight:600">$1</strong>`)
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, `<code style="background:${t.surfaceAlt};padding:1.5px 5px;border-radius:4px;font-size:0.85em;color:${t.accentDeep};font-family:${t.mono}">$1</code>`)
    .replace(/Ã¢Â†Â’/g, `<span style="color:${t.accent}">Ã¢Â†Â’</span>`);
}

function Md({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const els = [];
  let inCode = false, codeLines = [], inTable = false, tableRows = [];

  const flushTable = (key) => {
    if (!tableRows.length) return;
    const rows = tableRows.filter((r) => !r.match(/^\|[\s\-:|]+\|$/));
    const parsed = rows.map((r) => r.split("|").filter((c) => c.trim() !== "").map((c) => c.trim()));
    els.push(
      <div key={key} style={{ overflowX: "auto", margin: "12px 0", border: `1px solid ${t.border}`, borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, lineHeight: 1.6 }}>
          {parsed.length > 0 && (
            <thead>
              <tr>{parsed[0].map((c, i) => <th key={i} style={{ padding: "9px 12px", background: t.surfaceAlt, color: t.accent, fontWeight: 600, textAlign: "left", borderBottom: `1px solid ${t.borderStrong}`, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: t.mono }}>{c}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {parsed.slice(1).map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? t.surface : t.surfaceAlt }}>
                {row.map((c, ci) => <td key={ci} style={{ padding: "8px 12px", borderBottom: `1px solid ${t.border}`, color: t.textSec }}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = []; inTable = false;
  };

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inTable) flushTable(`t${i}`);
      if (inCode) {
        els.push(<pre key={`c${i}`} style={{ background: t.ink, color: "#e7e3f2", borderRadius: 8, padding: 16, overflowX: "auto", fontSize: 12.5, lineHeight: 1.65, fontFamily: t.mono, margin: "10px 0", border: `1px solid ${t.accentDeep}` }}><code>{codeLines.join("\n")}</code></pre>);
        codeLines = []; inCode = false;
      } else inCode = true;
      return;
    }
    if (inCode) { codeLines.push(line); return; }
    if (line.startsWith("|")) { inTable = true; tableRows.push(line); return; }
    if (inTable) flushTable(`t${i}`);
    if (line.startsWith("# "))        els.push(<h2 key={i} style={{ fontSize: 18, fontWeight: 600, color: t.text, margin: "22px 0 8px", paddingBottom: 8, borderBottom: `2px solid ${t.accent}`, fontFamily: t.display, letterSpacing: "-0.01em" }}>{line.slice(2)}</h2>);
    else if (line.startsWith("## "))  els.push(<h3 key={i} style={{ fontSize: 15, fontWeight: 600, color: t.accent, margin: "18px 0 6px", fontFamily: t.display }}>{line.slice(3)}</h3>);
    else if (line.startsWith("### ")) els.push(<h4 key={i} style={{ fontSize: 12.5, fontWeight: 600, color: t.text, margin: "14px 0 4px", padding: "7px 12px", background: t.surfaceAlt, borderRadius: 6, borderLeft: `3px solid ${t.accent}`, fontFamily: t.mono, letterSpacing: "0.2px" }}>{line.slice(4)}</h4>);
    else if (line.startsWith("---"))  els.push(<hr key={i} style={{ border: "none", borderTop: `1px solid ${t.border}`, margin: "16px 0" }} />);
    else if (line.startsWith("- ") || line.startsWith("* "))
      els.push(<div key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: t.textSec, margin: "2px 0", paddingLeft: 4, display: "flex", alignItems: "baseline" }}><span style={{ color: t.accent, marginRight: 10, fontWeight: 700, fontFamily: t.mono }}>Ã¢Â€Â”</span><span dangerouslySetInnerHTML={{ __html: inl(line.slice(2)) }} /></div>);
    else if (/^\d+\.\s/.test(line)) {
      const n = line.match(/^(\d+)\./)[1];
      els.push(<div key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: t.textSec, margin: "2px 0", paddingLeft: 4, display: "flex", alignItems: "baseline" }}><span style={{ color: t.accent, marginRight: 10, fontWeight: 600, minWidth: 20, fontFamily: t.mono }}>{n}.</span><span dangerouslySetInnerHTML={{ __html: inl(line.replace(/^\d+\.\s*/, "")) }} /></div>);
    }
    else if (line.trim() === "") els.push(<div key={i} style={{ height: 6 }} />);
    else els.push(<p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: t.textSec, margin: "3px 0" }} dangerouslySetInnerHTML={{ __html: inl(line) }} />);
  });
  if (inTable) flushTable("tend");
  return <>{els}</>;
}

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ UI primitives Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
function ScoreRing({ score, size = 60, color }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r, offset = circ - (score * 10 / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.surfaceAlt} strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: size * 0.34, fontWeight: 600, fill: color, fontFamily: t.display }}>{score}</text>
    </svg>
  );
}

function Badge({ label, variant }) {
  const c = { Low: { bg: t.greenLight, c: t.greenDeep }, Medium: { bg: t.amberLight, c: t.amber }, High: { bg: t.redLight, c: t.red } }[label]
    || (variant === "true" ? { bg: t.greenLight, c: t.greenDeep } : variant === "false" ? { bg: t.redLight, c: t.red } : { bg: t.surfaceAlt, c: t.textMuted });
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 600, background: c.bg, color: c.c, fontFamily: t.mono, letterSpacing: "0.2px" }}>{label}</span>;
}

function Spinner({ size = 16, color = t.accent }) {
  return <div style={{ width: size, height: size, border: `2px solid ${t.border}`, borderTopColor: color, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />;
}

function EditBox({ label, onSubmit, loading }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ background: t.surfaceAlt, borderRadius: 10, padding: 16, marginTop: 16, border: `1px solid ${t.border}` }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: t.accent, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8, fontFamily: t.mono, display: "flex", alignItems: "center", gap: 7 }}><Icon name="edit" size={13} color={t.accent} /> Edit &amp; regenerate {label}</div>
      <textarea value={val} onChange={(e) => setVal(e.target.value)}
        placeholder="What needs to change? Be specificÃ¢Â€Â¦"
        style={{ width: "100%", minHeight: 70, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 12, color: t.text, fontSize: 13, fontFamily: t.sans, lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
      <button onClick={() => { if (val.trim()) { onSubmit(val); setVal(""); } }} disabled={loading || !val.trim()}
        style={{ marginTop: 8, background: loading || !val.trim() ? t.surfaceAlt : t.accent, color: loading || !val.trim() ? t.textMuted : "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: loading || !val.trim() ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
        {loading ? <><Spinner size={14} color="#fff" /> RegeneratingÃ¢Â€Â¦</> : <><Icon name="refresh" size={14} color="#fff" /> Regenerate</>}
      </button>
    </div>
  );
}

// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ Word download Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
function buildWordDoc(title, subtitle, bodyHtml, filename) {
  const acn = { purple: "#A100FF", black: "#000000", gray: "#333333", light: "#F2F2F2", border: "#CCCCCC" };
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>@page{size:A4;margin:2cm 2.5cm}body{font-family:Calibri,sans-serif;font-size:11pt;color:${acn.gray};line-height:1.6}table{border-collapse:collapse}</style></head>
<body>
<div style="text-align:center;padding-top:120px">
  <div style="font-size:11pt;color:${acn.purple};font-weight:bold;letter-spacing:6px;text-transform:uppercase;margin-bottom:40px;font-family:Calibri">ACCENTURE</div>
  <hr style="border:none;border-top:4px solid ${acn.purple};width:80px;margin:0 auto 40px auto">
  <div style="font-size:28pt;color:${acn.black};font-weight:bold;margin-bottom:16px;font-family:Calibri">${title}</div>
  <div style="font-size:16pt;color:${acn.purple};margin-bottom:8px;font-family:Calibri">S/4HANA Public Cloud</div>
  <div style="font-size:13pt;color:${acn.gray};margin-bottom:40px;font-family:Calibri">${subtitle}</div>
  <hr style="border:none;border-top:4px solid ${acn.purple};width:80px;margin:0 auto 40px auto">
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:60%;margin:40px auto;border:1px solid ${acn.border}">
    <tr><td style="padding:10px 16px;border:1px solid ${acn.border};font-weight:bold;background:${acn.light};width:40%;font-family:Calibri;font-size:10pt">Version</td><td style="padding:10px 16px;border:1px solid ${acn.border};font-family:Calibri;font-size:10pt">1.0</td></tr>
    <tr><td style="padding:10px 16px;border:1px solid ${acn.border};font-weight:bold;background:${acn.light};font-family:Calibri;font-size:10pt">Date</td><td style="padding:10px 16px;border:1px solid ${acn.border};font-family:Calibri;font-size:10pt">${today}</td></tr>
    <tr><td style="padding:10px 16px;border:1px solid ${acn.border};font-weight:bold;background:${acn.light};font-family:Calibri;font-size:10pt">Status</td><td style="padding:10px 16px;border:1px solid ${acn.border};font-family:Calibri;font-size:10pt">Draft</td></tr>
    <tr><td style="padding:10px 16px;border:1px solid ${acn.border};font-weight:bold;background:${acn.light};font-family:Calibri;font-size:10pt">Classification</td><td style="padding:10px 16px;border:1px solid ${acn.border};font-family:Calibri;font-size:10pt">Confidential</td></tr>
  </table>
  <div style="font-size:9pt;font-family:Calibri;color:#999;margin-top:60px">&copy; ${new Date().getFullYear()} Accenture. All Rights Reserved.</div>
</div>
<br clear="all" style="page-break-before:always">
${bodyHtml}
</body></html>`;
  const blob = new Blob(["\ufeff" + html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function mdToWordHtml(text, acn) {
  let body = "", inCB = false, inTbl = false, tRows = [];
  const flushTbl = () => {
    if (!tRows.length) return;
    const rows = tRows.filter((r) => !r.match(/^\|[\s\-:|]+\|$/));
    const parsed = rows.map((r) => r.split("|").filter((c) => c.trim()).map((c) => c.trim()));
    body += `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin:12px 0;border:1px solid ${acn.border}">`;
    if (parsed[0]) { body += "<thead><tr>"; parsed[0].forEach((c) => { body += `<th style="background:${acn.purple};color:#fff;font-weight:bold;padding:10px 12px;text-align:left;border:1px solid ${acn.purple};font-size:10pt;font-family:Calibri">${c}</th>`; }); body += "</tr></thead>"; }
    body += "<tbody>";
    parsed.slice(1).forEach((row, ri) => { body += `<tr style="background:${ri % 2 === 0 ? "#fff" : acn.light}">`; row.forEach((c) => { body += `<td style="padding:8px 12px;border:1px solid ${acn.border};font-size:10pt;vertical-align:top;font-family:Calibri;color:${acn.gray}">${c}</td>`; }); body += "</tr>"; });
    body += "</tbody></table>"; tRows = []; inTbl = false;
  };
  const mk = (s) => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, `<code style="background:${acn.light};padding:1px 4px;font-family:Consolas;font-size:9pt">$1</code>`);
  text.split("\n").forEach((l) => {
    if (l.startsWith("```")) { if (inTbl) flushTbl(); if (inCB) { body += "</pre>"; inCB = false; } else { inCB = true; body += `<pre style="background:${acn.light};border:1px solid ${acn.border};padding:12px;font-family:Consolas;font-size:9pt;white-space:pre-wrap;margin:8px 0;line-height:1.5">`; } return; }
    if (inCB) { body += l.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n"; return; }
    if (l.startsWith("|")) { inTbl = true; tRows.push(l); return; }
    if (inTbl) flushTbl();
    if (l.startsWith("# "))        body += `<h1 style="font-size:22pt;color:${acn.purple};font-family:Calibri;border-bottom:3px solid ${acn.purple};padding-bottom:8px;margin-top:32px">${l.slice(2)}</h1>`;
    else if (l.startsWith("## "))  body += `<h2 style="font-size:16pt;color:${acn.purple};font-family:Calibri;margin-top:26px;border-bottom:1px solid ${acn.border};padding-bottom:6px">${l.slice(3)}</h2>`;
    else if (l.startsWith("### ")) body += `<h3 style="font-size:13pt;color:${acn.black};font-family:Calibri;margin-top:20px">${l.slice(4)}</h3>`;
    else if (l.startsWith("#### "))body += `<h4 style="font-size:11pt;color:${acn.purple};font-family:Calibri;margin-top:14px">${l.slice(5)}</h4>`;
    else if (l.startsWith("---"))  body += `<hr style="border:none;border-top:2px solid ${acn.purple};margin:20px 0">`;
    else if (l.startsWith("- ") || l.startsWith("* ")) body += `<p style="margin:3px 0 3px 24px;font-family:Calibri;font-size:11pt;color:${acn.gray};line-height:1.6">&bull; ${mk(l.slice(2))}</p>`;
    else if (/^\d+\.\s/.test(l))   body += `<p style="margin:3px 0 3px 24px;font-family:Calibri;font-size:11pt;color:${acn.gray};line-height:1.6">${mk(l)}</p>`;
    else if (l.trim())             body += `<p style="margin:4px 0;font-family:Calibri;font-size:11pt;color:${acn.gray};line-height:1.6">${mk(l)}</p>`;
  });
  if (inTbl) flushTbl();
  return body;
}

// Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
// Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€ MAIN APP Ã¢Â”Â€Ã¢Â”Â€
// Ã¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•ÂÃ¢Â•Â
export default function App() {
  const [phase, setPhase]                   = useState("input");
  const [mode, setMode]                     = useState("new"); // "new" | "enhance"
  const [fdText, setFdText]                 = useState("");
  const [fileName, setFileName]             = useState("");
  const [fileLoading, setFileLoading]       = useState(false);
  const [baseText, setBaseText]             = useState("");   // existing TD baseline (enhance mode)
  const [baseName, setBaseName]             = useState("");
  const [baseLoading, setBaseLoading]       = useState(false);
  const [approaches, setApproaches]         = useState(null);
  const [recommended, setRecommended]       = useState("");
  const [recReason, setRecReason]           = useState("");
  const [aiEval, setAiEval]                 = useState(null);
  const [uiTradeoff, setUiTradeoff]         = useState(null);
  const [fitAssess, setFitAssess]           = useState(null);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [results, setResults]               = useState({});
  const [loading, setLoading]               = useState(false);
  const [loadingAgent, setLoadingAgent]     = useState("");
  const [loadingMsg, setLoadingMsg]         = useState("");
  const [activeTab, setActiveTab]           = useState("design");
  const [error, setError]                   = useState(null);
  const [dragOver, setDragOver]             = useState(false);
  const [baseDragOver, setBaseDragOver]     = useState(false);
  const resultRef   = useRef(null);
  const approachRef = useRef(null);
  const fileInputRef = useRef(null);
  const baseInputRef = useRef(null);

  const enh = mode === "enhance";
  const aLabel = (a) => (enh && a.id === "analysis") ? "Impact Analysis" : a.label;

  // Consistency guard: a "pure" in-app approach that lists BTP-hosted artifacts is self-contradictory
  const PURE_IDS = ["customisation", "keyuser", "developer"];
  const BTP_HINT = /\bBTP\b|freestyle|CAP\b|CAPM|SAP Build|Work Zone|Integration Suite|Event Mesh|side-?by-?side|Business Application Studio|\bBAS\b|Kyma|Cloud Foundry/i;
  const btpInText = (ap) => [...(ap?.tools || []), ...(ap?.limitations || []), ap?.summary || ""].some((s) => BTP_HINT.test(String(s)));
  const consistencyWarn = (() => {
    const rec = (approaches || []).find((a) => a.id === recommended);
    if (rec && PURE_IDS.includes(rec.id) && btpInText(rec)) return rec;
    return null;
  })();

  const progressPct = { input: 0, analysis: 16, design: 33, code: 50, test: 66, td: 83, complete: 100 }[phase] || 0;
  const scrollTo = (ref) => setTimeout(() => ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);

  const processFile = async (file) => {
    if (!file) return;
    setFileLoading(true); setError(null); setFileName(file.name);
    try { setFdText(await readFile(file)); }
    catch (e) { setError(e.message); setFileName(""); setFdText(""); }
    finally { setFileLoading(false); }
  };
  const removeFile = () => { setFdText(""); setFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const processBaseFile = async (file) => {
    if (!file) return;
    setBaseLoading(true); setError(null); setBaseName(file.name);
    try { setBaseText(await readFile(file)); }
    catch (e) { setError(e.message); setBaseName(""); setBaseText(""); }
    finally { setBaseLoading(false); }
  };
  const removeBaseFile = () => { setBaseText(""); setBaseName(""); if (baseInputRef.current) baseInputRef.current.value = ""; };

  const runAgent = useCallback(async (id, prompt) => {
    setLoading(true); setLoadingAgent(id); setError(null); setLoadingMsg("Generating...");
    try {
      const maxCont = ["code", "test", "td"].includes(id) ? 3 : 1;
      const res = await callClaudeFull(prompt, maxCont, (step, total) => {
        if (step > 1) setLoadingMsg(`Continuing... part ${step}/${total}`);
      });
      setResults((p) => ({ ...p, [id]: res }));
      setActiveTab(id);
      return res;
    } catch (e) { setError(e.message); return null; }
    finally { setLoading(false); setLoadingAgent(""); setLoadingMsg(""); }
  }, []);

  const handleAnalyze = async () => {
    if (!fdText.trim()) return;
    setPhase("analysis"); setLoading(true); setLoadingAgent("analysis"); setError(null);
    try {
      const d = await callClaudeJSON(enh ? getEnhancementAnalysisPrompt(fdText, baseText) : getAnalysisPrompt(fdText));
      setApproaches(d.approaches || []); setRecommended(d.recommended || ""); setRecReason(d.recommendation_reason || ""); setAiEval(d.ai_evaluation || null); setUiTradeoff(d.ui_tradeoff || null); setFitAssess(d.fit_assessment || null);
      setSelectedApproach(null); setResults({});
      scrollTo(approachRef);
    } catch (e) { setError((enh ? "Impact analysis failed: " : "Analysis failed: ") + e.message); }
    finally { setLoading(false); setLoadingAgent(""); }
  };

  const handleApprove = async (ap) => {
    setSelectedApproach(ap); setPhase("design");
    if (await runAgent("design", getDesignPrompt(fdText, ap, "", mode, baseText))) scrollTo(resultRef);
  };
  const handleCode = async (edit) => { setPhase("code"); if (await runAgent("code", getCodePrompt(fdText, selectedApproach, (results.design || "").slice(0, 4000), edit, mode, baseText))) scrollTo(resultRef); };
  const handleTest = async (edit) => { setPhase("test"); if (await runAgent("test", getTestPrompt(fdText, selectedApproach, (results.design || "").slice(0, 2500), (results.code || "").slice(0, 2500), edit, mode, baseText))) scrollTo(resultRef); };
  const handleTD   = async (edit) => {
    setPhase("td");
    const sn = (x, n) => (x || "").slice(0, n);
    if (await runAgent("td", getTDPrompt(fdText, selectedApproach, sn(results.design, 6000), sn(results.code, 6000), sn(results.test, 4000), edit, mode, baseText))) {
      setPhase("complete"); scrollTo(resultRef);
    }
  };

  const regenDesign = (edit) => runAgent("design", getDesignPrompt(fdText, selectedApproach, edit, mode, baseText));
  const regenCode   = (edit) => runAgent("code",   getCodePrompt(fdText, selectedApproach, (results.design || "").slice(0, 4000), edit, mode, baseText));
  const regenTest   = (edit) => runAgent("test",   getTestPrompt(fdText, selectedApproach, (results.design || "").slice(0, 2500), (results.code || "").slice(0, 2500), edit, mode, baseText));
  const regenTD     = async (edit) => {
    const sn = (x, n) => (x || "").slice(0, n);
    if (await runAgent("td", getTDPrompt(fdText, selectedApproach, sn(results.design, 6000), sn(results.code, 6000), sn(results.test, 4000), edit, mode, baseText))) setPhase("complete");
  };

  const downloadDevGuide = () => {
    const acn = { purple: "#A100FF", black: "#000000", gray: "#333333", light: "#F2F2F2", border: "#CCCCCC" };
    buildWordDoc(`Developer Implementation Guide${enh ? " (Enhancement)" : ""}`, apName(selectedApproach), mdToWordHtml(results.code || "", acn), `DevGuide_S4HANA_${new Date().toISOString().split("T")[0]}.doc`);
  };
  const downloadTD = () => {
    const acn = { purple: "#A100FF", black: "#000000", gray: "#333333", light: "#F2F2F2", border: "#CCCCCC" };
    buildWordDoc(`Technical Design Document${enh ? " (Enhancement)" : ""}`, apName(selectedApproach), mdToWordHtml(results.td || "", acn), `TD_S4HANA_${new Date().toISOString().split("T")[0]}.doc`);
  };

  const resetAll = () => {
    setPhase("input"); setFdText(""); setFileName(""); setBaseText(""); setBaseName(""); setApproaches(null); setRecommended(""); setRecReason(""); setAiEval(null); setUiTradeoff(null); setFitAssess(null);
    setSelectedApproach(null); setResults({}); setLoading(false); setLoadingAgent(""); setLoadingMsg(""); setError(null); setActiveTab("design");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (baseInputRef.current) baseInputRef.current.value = "";
  };

  const nxt = (() => {
    if (results.test && !results.td)   return { label: "Generate TD Document",    icon: "doc",   fn: () => handleTD(),   color: t.red   };
    if (results.code && !results.test) return { label: "Generate Test Pack",       icon: "flask", fn: () => handleTest(), color: t.amber };
    if (results.design && !results.code) return { label: "Generate Developer Guide", icon: "gear",  fn: () => handleCode(), color: t.green };
    return null;
  })();

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: t.sans, color: t.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flow{to{background-position:14px 0}}
        button{font-family:${t.sans}}
        button:hover:not(:disabled){filter:brightness(1.04);transform:translateY(-1px)}
        button:active:not(:disabled){transform:translateY(0);filter:brightness(0.97)}
        button:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:2px solid ${t.accent};outline-offset:2px}
        ::-webkit-scrollbar{width:9px;height:9px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.borderStrong};border-radius:6px;border:2px solid ${t.bg}}
        ::-webkit-scrollbar-thumb:hover{background:${t.textMuted}}
        ::selection{background:${t.accentLight};color:${t.accentDeep}}
        *{box-sizing:border-box}
        textarea:focus{border-color:${t.accent}!important;box-shadow:0 0 0 3px ${t.accentLight}!important;}
        @media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important}}
      `}</style>

      {/* Header */}
      <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: "18px 28px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: `linear-gradient(150deg,${t.accent},${t.accentDeep})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: t.display, letterSpacing: "-0.02em", boxShadow: `0 4px 14px ${t.accent}40` }}>S/4</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: t.text, margin: 0, fontFamily: t.display, letterSpacing: "-0.015em" }}>Solution Designer <span style={{ color: t.accent }}>Ã‚Â·</span> <span style={{ color: t.textMuted, fontWeight: 500 }}>S/4HANA Public Cloud</span></h1>
              <p style={{ fontSize: 10.5, color: t.textMuted, marginTop: 3, fontFamily: t.mono, letterSpacing: "0.3px" }}>FD Ã¢Â†Â’ 6 APPROACHES Ã¢Â†Â’ DESIGN Ã¢Â†Â’ CODE Ã¢Â†Â’ TEST Ã¢Â†Â’ TD Ã‚Â· mixed-layer aware</p>
            </div>
          </div>
          {phase !== "input" && <button onClick={resetAll} style={{ background: t.surface, color: t.textSec, border: `1px solid ${t.borderStrong}`, borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.mono }}><Icon name="reset" size={14} color={t.textSec} /> Start over</button>}
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 28px" }}>

        {/* Pipeline rail Ã¢Â€Â” the track behind the nodes IS the progress bar */}
        <div style={{ position: "relative", marginBottom: 22, paddingTop: 4 }}>
          <div style={{ position: "absolute", top: 21, left: 0, right: 0, height: 2, background: t.border, borderRadius: 2 }} />
          <div style={{ position: "absolute", top: 21, left: 0, height: 2, background: `linear-gradient(90deg,${t.accent},${t.accentVivid})`, borderRadius: 2, width: `${progressPct}%`, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 4, flexWrap: "wrap" }}>
            {AGENTS.map((a) => {
              const done   = a.id === "analysis" ? !!approaches : !!results[a.id];
              const active = loadingAgent === a.id;
              const on = done || active;
              return (
                <div key={a.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "1 1 0", minWidth: 84 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: on ? t.surface : t.bg, border: `1.5px solid ${on ? a.color : t.border}`, color: on ? a.color : t.textMuted, boxShadow: on ? `0 0 0 4px ${a.bg}` : "none", transition: "all 0.3s", position: "relative" }}>
                    {active ? <Spinner size={14} color={a.color} /> : done ? <Icon name="check" size={16} color={a.color} stroke={2} /> : <Icon name={a.icon} size={16} color={t.textMuted} />}
                  </div>
                  <span style={{ fontSize: 9.5, fontWeight: 600, textAlign: "center", lineHeight: 1.25, color: on ? a.color : t.textMuted, fontFamily: t.mono, letterSpacing: "0.2px", textTransform: "uppercase" }}>{aLabel(a)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload card */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: approaches ? "14px 20px" : 28, marginBottom: 20, boxShadow: t.shadow }}>
          {!approaches && (
            <div style={{ display: "flex", gap: 6, marginBottom: 20, background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 10, padding: 4, maxWidth: 420 }}>
              {[
                { id: "new",     label: "New build",   icon: "spark",  desc: "Greenfield Ã¢Â€Â” pick from 6 approaches" },
                { id: "enhance", label: "Enhancement", icon: "edit",   desc: "Change a pre-built RICEFW" },
              ].map((m) => {
                const sel = mode === m.id;
                return (
                  <button key={m.id} onClick={() => { setMode(m.id); setError(null); }} disabled={loading}
                    title={m.desc}
                    style={{ flex: 1, background: sel ? t.surface : "transparent", color: sel ? t.accent : t.textMuted, border: sel ? `1px solid ${t.accent}40` : "1px solid transparent", borderRadius: 7, padding: "9px 12px", fontSize: 12.5, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: t.mono, boxShadow: sel ? t.shadow : "none", transition: "all 0.15s" }}>
                    <Icon name={m.icon} size={14} color={sel ? t.accent : t.textMuted} /> {m.label}
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.4px", color: t.accent, marginBottom: approaches ? 8 : 14, fontFamily: t.mono, display: "flex", alignItems: "center", gap: 8 }}><Icon name="file" size={13} color={t.accent} /> {enh ? "Enhancement Requirement Ã¢Â€Â” updated FD / change request" : "Functional Design"}</div>
          {approaches && fdText ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: t.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={15} color={t.green} stroke={2} /></div>
                <div><span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{fileName}</span> <span style={{ fontSize: 11, color: t.textMuted, fontFamily: t.mono }}>Ã‚Â· {fdText.length.toLocaleString()} chars</span></div>
                {enh && <span style={{ fontSize: 10, fontFamily: t.mono, color: t.purple, background: t.purpleLight, padding: "2px 8px", borderRadius: 5, letterSpacing: "0.5px" }}>ENHANCEMENT{baseName ? " Ã‚Â· baseline: " + baseName : " Ã‚Â· no baseline"}</span>}
              </div>
              <button onClick={() => { setApproaches(null); setSelectedApproach(null); setResults({}); setPhase("input"); }} style={{ background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: 7, padding: "5px 12px", fontSize: 11, fontWeight: 500, color: t.textSec, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: t.mono }}><Icon name="refresh" size={12} color={t.textSec} /> Re-analyze</button>
            </div>
          ) : (
            <>
              {!fdText && !fileLoading ? (
                <div onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer?.files?.[0]); }}
                  style={{ border: `1.5px dashed ${dragOver ? t.accent : t.borderStrong}`, borderRadius: 12, padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? t.accentLight : t.surfaceAlt, transition: "all 0.2s" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: t.surface, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><Icon name="upload" size={26} color={t.accent} stroke={1.5} /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 5, fontFamily: t.display }}>{enh ? "Upload the change request / updated FD" : "Upload your Functional Design"}</div>
                  <div style={{ fontSize: 11.5, color: t.textMuted, fontFamily: t.mono, letterSpacing: "0.3px" }}>PDF Ã‚Â· DOCX Ã‚Â· TXT Ã‚Â· MD Ã¢Â€Â” click or drag &amp; drop</div>
                  <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md,.csv,.xml,.json,.docx" onChange={(e) => processFile(e.target.files?.[0])} style={{ display: "none" }} />
                </div>
              ) : fileLoading ? (
                <div style={{ textAlign: "center", padding: "48px 24px", background: t.accentLight, borderRadius: 12 }}>
                  <Spinner size={28} /><div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginTop: 12, fontFamily: t.mono }}>Reading {fileName}Ã¢Â€Â¦</div>
                </div>
              ) : (
                <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surfaceAlt, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Icon name="file" size={16} color={t.accent} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{fileName}</span>
                      <span style={{ fontSize: 11, color: t.textMuted, fontFamily: t.mono }}>{fdText.length.toLocaleString()} chars</span>
                    </div>
                    <button onClick={removeFile} disabled={loading} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}><Icon name="close" size={13} color={t.textMuted} /></button>
                  </div>
                  <div style={{ padding: 14, maxHeight: 140, overflowY: "auto", fontSize: 12, lineHeight: 1.6, color: t.textSec, fontFamily: t.mono, whiteSpace: "pre-wrap" }}>
                    {fdText.slice(0, 1200)}{fdText.length > 1200 ? "\nÃ¢Â€Â¦" : ""}
                  </div>
                </div>
              )}

              {/* Baseline (existing TD) Ã¢Â€Â” enhancement mode only */}
              {enh && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.4px", color: t.purple, marginBottom: 10, fontFamily: t.mono, display: "flex", alignItems: "center", gap: 8 }}><Icon name="layers" size={13} color={t.purple} /> Existing TD / build baseline <span style={{ color: t.textMuted, fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>Ã‚Â· optional but recommended</span></div>
                  {!baseText && !baseLoading ? (
                    <div onClick={() => baseInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setBaseDragOver(true); }}
                      onDragLeave={() => setBaseDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setBaseDragOver(false); processBaseFile(e.dataTransfer?.files?.[0]); }}
                      style={{ border: `1.5px dashed ${baseDragOver ? t.purple : t.borderStrong}`, borderRadius: 12, padding: "26px 24px", textAlign: "center", cursor: "pointer", background: baseDragOver ? t.purpleLight : t.surfaceAlt, transition: "all 0.2s" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: t.textSec, fontFamily: t.mono }}>Drop the existing TD (or built FD) here</div>
                      <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>Gives the delta a baseline so unchanged parts stay stable</div>
                      <input ref={baseInputRef} type="file" accept=".pdf,.txt,.md,.csv,.xml,.json,.docx" onChange={(e) => processBaseFile(e.target.files?.[0])} style={{ display: "none" }} />
                    </div>
                  ) : baseLoading ? (
                    <div style={{ textAlign: "center", padding: "26px 24px", background: t.purpleLight, borderRadius: 12 }}>
                      <Spinner size={22} color={t.purple} /><div style={{ fontSize: 12.5, fontWeight: 500, color: t.text, marginTop: 10, fontFamily: t.mono }}>Reading {baseName}Ã¢Â€Â¦</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${t.purple}30`, borderRadius: 10, background: t.purpleLight, padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Icon name="layers" size={15} color={t.purple} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{baseName}</span>
                        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: t.mono }}>{baseText.length.toLocaleString()} chars</span>
                      </div>
                      <button onClick={removeBaseFile} disabled={loading} style={{ background: t.surface, border: `1px solid ${t.purple}30`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}><Icon name="close" size={13} color={t.purple} /></button>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <button onClick={handleAnalyze} disabled={loading || !fdText.trim()}
                  style={{ background: loading || !fdText.trim() ? t.surfaceAlt : `linear-gradient(135deg,${t.accent},${t.accentDeep})`, color: loading || !fdText.trim() ? t.textMuted : "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 13.5, fontWeight: 600, cursor: loading || !fdText.trim() ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: loading || !fdText.trim() ? "none" : `0 4px 14px ${t.accent}38` }}>
                  {loadingAgent === "analysis" ? <><Spinner size={16} color="#fff" /> {enh ? "Analyzing impactÃ¢Â€Â¦" : "AnalyzingÃ¢Â€Â¦"}</> : <><Icon name="search" size={16} color="#fff" /> {enh ? "Analyze impact" : "Analyze approaches"}</>}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: t.redLight, border: `1px solid ${t.red}40`, borderRadius: 10, padding: 16, marginBottom: 18, display: "flex", gap: 11, alignItems: "flex-start" }}>
            <Icon name="alert" size={18} color={t.red} style={{ marginTop: 1 }} />
            <div><div style={{ fontWeight: 600, color: t.red, fontSize: 11, fontFamily: t.mono, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Error</div><p style={{ fontSize: 13, color: t.textSec, margin: 0, lineHeight: 1.5 }}>{error}</p></div>
          </div>
        )}

        {/* Approaches */}
        {approaches && (
          <div ref={approachRef} style={{ animation: "fadeUp 0.4s ease", marginBottom: 20 }}>
            {enh && fitAssess && (fitAssess.verdict || fitAssess.why) && (() => {
              const newSol = /new solution/i.test(fitAssess.verdict || "");
              const c = newSol ? { bg: t.amberLight, line: t.amber, dark: t.amber } : { bg: t.greenLight, line: t.green, dark: t.greenDeep };
              return (
                <div style={{ background: c.bg, border: `1px solid ${c.line}40`, borderRadius: 10, padding: "14px 18px", marginBottom: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: t.surface, border: `1px solid ${c.line}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={newSol ? "alert" : "check"} size={16} color={c.dark} stroke={newSol ? 1.6 : 2.2} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: t.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: t.textMuted, marginBottom: 5, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      Fit within existing solution
                      {fitAssess.verdict && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: t.surface, color: c.dark, border: `1px solid ${c.line}40` }}>{fitAssess.verdict}</span>}
                      {fitAssess.existing_paradigm && <span style={{ color: t.textMuted, letterSpacing: 0, textTransform: "none", fontSize: 11 }}>Ã‚Â· reusing {fitAssess.existing_paradigm}</span>}
                    </div>
                    <div style={{ fontSize: 12.5, color: t.textSec, lineHeight: 1.6 }}>{fitAssess.why}</div>
                    {!newSol && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Change absorbed as a delta on the existing design Ã¢Â€Â” no new solution proposed.</div>}
                  </div>
                </div>
              );
            })()}
            {recReason && (
              <div style={{ background: t.accentLight, border: `1px solid ${t.accent}30`, borderRadius: 10, padding: "15px 18px", marginBottom: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Icon name="star" size={18} color={t.accent} style={{ marginTop: 1 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: t.accent, marginBottom: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: t.mono, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.8px", color: t.textMuted }}>Recommended</span>
                    <span style={{ fontFamily: t.display, fontSize: 14 }}>{APPROACH_META[recommended]?.label || recommended}</span>
                    {APPROACH_META[recommended]?.mixed && <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: "linear-gradient(90deg,#7a2ad6,#b5620a)", color: "#fff", fontFamily: t.mono, letterSpacing: "0.5px" }}>MIXED</span>}
                  </div>
                  <p style={{ fontSize: 12.5, color: t.textSec, margin: 0, lineHeight: 1.6 }}>{recReason}</p>
                </div>
              </div>
            )}
            {aiEval && (aiEval.standard_ai || aiEval.recommendation) && (
              <div style={{ background: t.surface, border: `1px solid ${t.sky}30`, borderRadius: 10, padding: "14px 18px", marginBottom: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: t.skyLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="spark" size={16} color={t.sky} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: t.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: t.textMuted, marginBottom: 5, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    Standard-first Ã‚Â· AI-first check
                    {aiEval.recommendation && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.3px", background: /custom/i.test(aiEval.recommendation) ? t.amberLight : t.greenLight, color: /custom/i.test(aiEval.recommendation) ? t.amber : t.greenDeep }}>{aiEval.recommendation}</span>}
                  </div>
                  {aiEval.standard_ai && <div style={{ fontSize: 12.5, color: t.textSec, lineHeight: 1.6 }}><span style={{ fontWeight: 600, color: t.text }}>Standard SAP AI:</span> {aiEval.standard_ai}</div>}
                  {aiEval.standard_capability && <div style={{ fontSize: 12.5, color: t.textSec, lineHeight: 1.6 }}><span style={{ fontWeight: 600, color: t.text }}>Standard capability:</span> {aiEval.standard_capability}</div>}
                  {aiEval.reason && <div style={{ fontSize: 11.5, color: t.textMuted, lineHeight: 1.55, marginTop: 3 }}>{aiEval.reason}</div>}
                </div>
              </div>
            )}
            {uiTradeoff && (uiTradeoff.verdict || uiTradeoff.ui_nature) && (
              <div style={{ background: t.surface, border: `1px solid ${t.indigo}30`, borderRadius: 10, padding: "14px 18px", marginBottom: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: t.indigoLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="sliders" size={16} color={t.indigo} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: t.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: t.textMuted, marginBottom: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    UI effort vs cost
                    {uiTradeoff.ui_nature && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: t.indigoLight, color: t.indigo }}>{uiTradeoff.ui_nature}</span>}
                    {uiTradeoff.verdict && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: /btp/i.test(uiTradeoff.verdict) ? t.amberLight : t.greenLight, color: /btp/i.test(uiTradeoff.verdict) ? t.amber : t.greenDeep }}>{uiTradeoff.verdict}</span>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {uiTradeoff.rap_effort && <div style={{ borderLeft: `2px solid ${t.green}`, paddingLeft: 10 }}><div style={{ fontSize: 10, fontFamily: t.mono, color: t.greenDeep, marginBottom: 2 }}>RAP (in-app) Ã¢Â€Â” no runtime cost</div><div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.55 }}>{uiTradeoff.rap_effort}</div></div>}
                    {uiTradeoff.btp_cost && <div style={{ borderLeft: `2px solid ${t.amber}`, paddingLeft: 10 }}><div style={{ fontSize: 10, fontFamily: t.mono, color: t.amber, marginBottom: 2 }}>BTP Ã¢Â€Â” flexibility, has cost</div><div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.55 }}>{uiTradeoff.btp_cost}</div></div>}
                  </div>
                </div>
              </div>
            )}
            {consistencyWarn && (
              <div style={{ background: t.amberLight, border: `1px solid ${t.amber}40`, borderRadius: 10, padding: "13px 16px", marginBottom: 14, display: "flex", gap: 11, alignItems: "flex-start" }}>
                <Icon name="alert" size={17} color={t.amber} style={{ marginTop: 1 }} />
                <div>
                  <div style={{ fontFamily: t.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: t.amber, marginBottom: 3 }}>Consistency check</div>
                  <div style={{ fontSize: 12.5, color: t.textSec, lineHeight: 1.55 }}>The recommended <strong style={{ color: t.text }}>{APPROACH_META[consistencyWarn.id]?.label || consistencyWarn.id}</strong> is a pure in-app approach, yet its details reference a BTP-hosted artifact (freestyle SAPUI5, CAP, SAP Build, Integration SuiteÃ¢Â€Â¦). If that artifact is truly needed, the right answer is a <strong style={{ color: t.text }}>Developer + BTP (mixed)</strong> approach; if the UI fits Fiori Elements on RAP, remove the BTP reference. Consider re-analyzing.</div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {approaches.map((ap) => {
                const meta   = APPROACH_META[ap.id] || { icon: "layers", label: ap.name, color: t.accent, bg: t.accentLight, sub: "", mixed: false };
                const isRec  = ap.id === recommended;
                const isSel  = selectedApproach?.id === ap.id;
                const effortCls = { Low: t.green, Medium: t.amber, High: t.red }[ap.effort] || t.textMuted;
                const riskCls   = { Low: t.green, Medium: t.amber, High: t.red }[ap.risk]   || t.textMuted;

                return (
                  <div key={ap.id} style={{ background: t.surface, borderRadius: 12, overflow: "hidden", border: isSel ? `1.5px solid ${t.green}` : isRec ? `1.5px solid ${meta.color}` : `1px solid ${t.border}`, boxShadow: isRec ? `0 0 0 3px ${meta.bg}, ${t.shadow}` : t.shadow }}>
                    <div style={{ padding: "15px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, background: isSel ? t.greenLight : isRec ? meta.bg : t.surfaceAlt }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: t.surface, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={meta.icon} size={19} color={meta.color} /></div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            {enh && typeof ap.tier === "number" && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: ap.tier <= 1 ? t.greenLight : ap.tier === 2 ? t.amberLight : t.redLight, color: ap.tier <= 1 ? t.greenDeep : ap.tier === 2 ? t.amber : t.red, fontFamily: t.mono, letterSpacing: "0.5px" }}>TIER {ap.tier}</span>}
                            <span style={{ fontWeight: 600, fontSize: 15.5, color: t.text, fontFamily: t.display, letterSpacing: "-0.01em" }}>{meta.label}</span>
                            {meta.mixed && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: "linear-gradient(90deg,#7a2ad6,#b5620a)", color: "#fff", fontFamily: t.mono, letterSpacing: "0.5px" }}>MIXED</span>}
                            {isRec && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: meta.color, color: "#fff", fontFamily: t.mono, letterSpacing: "0.5px", display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="star" size={10} color="#fff" /> {enh ? "PREFERRED" : "RECOMMENDED"}</span>}
                            {isSel && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: t.green, color: "#fff", fontFamily: t.mono, letterSpacing: "0.5px", display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="check" size={10} color="#fff" stroke={2.2} /> APPROVED</span>}
                          </div>
                          <div style={{ fontSize: 10.5, color: t.textMuted, marginTop: 2, fontFamily: t.mono, letterSpacing: "0.2px" }}>{meta.sub}</div>
                        </div>
                      </div>
                      <ScoreRing score={ap.feasibility_score} size={56} color={meta.color} />
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                      {enh && ap.gate && (
                        <div style={{ background: t.amberLight, border: `1px solid ${t.amber}30`, borderRadius: 8, padding: "9px 12px", marginBottom: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <Icon name="alert" size={14} color={t.amber} style={{ marginTop: 1 }} />
                          <div style={{ fontSize: 11.5, color: t.textSec, lineHeight: 1.5 }}><span style={{ fontFamily: t.mono, fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.6px", color: t.amber, marginRight: 6 }}>Escalation gate</span>{ap.gate}</div>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                        {[
                          { l: "Feasibility", v: <><span style={{ fontSize: 21, fontWeight: 600, color: meta.color, fontFamily: t.display }}>{ap.feasibility_score}</span><span style={{ fontSize: 12, color: t.textMuted, fontFamily: t.mono }}>/10</span></> },
                          { l: "Effort", v: <Badge label={ap.effort} /> },
                          { l: "Risk",   v: <Badge label={ap.risk} /> },
                          { l: "Meets FD?", v: <Badge label={ap.can_fully_meet ? "Yes" : "Partial"} variant={ap.can_fully_meet ? "true" : "false"} /> },
                        ].map((m, i) => (
                          <div key={i} style={{ flex: 1, minWidth: 100, background: t.surfaceAlt, borderRadius: 8, padding: "9px 12px", border: `1px solid ${t.border}` }}>
                            <div style={{ fontSize: 9, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 5, fontFamily: t.mono }}>{m.l}</div>
                            {m.v}
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.65, color: t.textSec, marginBottom: 14 }}>{ap.summary}</p>

                      {/* Layer split for mixed approaches */}
                      {meta.mixed && ap.layer_split && (
                        <div style={{ background: t.purpleLight, border: `1px solid ${t.purple}30`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: t.purple, textTransform: "uppercase", marginBottom: 10, fontFamily: t.mono, letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: 7 }}><Icon name="layers" size={13} color={t.purple} /> Layer split</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 12, color: t.textSec }}>
                            <div style={{ borderLeft: `2px solid ${t.green}`, paddingLeft: 10 }}>
                              <div style={{ fontWeight: 600, color: t.greenDeep, fontSize: 11, marginBottom: 5, fontFamily: t.mono }}>{ap.layer_split.layer1_label || "Layer 1"}</div>
                              {(ap.layer_split.layer1_handles || []).map((x, i) => <div key={i} style={{ margin: "3px 0", display: "flex", gap: 6 }}><span style={{ color: t.green, fontFamily: t.mono }}>Ã¢Â€Â”</span>{x}</div>)}
                            </div>
                            <div style={{ borderLeft: `2px solid ${t.amber}`, paddingLeft: 10 }}>
                              <div style={{ fontWeight: 600, color: t.amber, fontSize: 11, marginBottom: 5, fontFamily: t.mono }}>{ap.layer_split.layer2_label || "Layer 2"}</div>
                              {(ap.layer_split.layer2_handles || []).map((x, i) => <div key={i} style={{ margin: "3px 0", display: "flex", gap: 6 }}><span style={{ color: t.amber, fontFamily: t.mono }}>Ã¢Â€Â”</span>{x}</div>)}
                            </div>
                          </div>
                          {ap.layer_split.why_both_needed && (
                            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.purple}20`, fontSize: 11.5, color: t.textMuted, lineHeight: 1.55 }}>{ap.layer_split.why_both_needed}</div>
                          )}
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                        <div style={{ background: t.greenLight, borderRadius: 8, padding: 13 }}>
                          <div style={{ fontSize: 9.5, fontWeight: 600, color: t.greenDeep, marginBottom: 6, textTransform: "uppercase", fontFamily: t.mono, letterSpacing: "0.8px" }}>Benefits</div>
                          {ap.benefits.map((b, i) => <div key={i} style={{ fontSize: 12, color: t.textSec, lineHeight: 1.55, display: "flex", gap: 7, margin: "2px 0" }}><span style={{ color: t.green, fontFamily: t.mono }}>+</span>{b}</div>)}
                        </div>
                        <div style={{ background: t.redLight, borderRadius: 8, padding: 13 }}>
                          <div style={{ fontSize: 9.5, fontWeight: 600, color: t.red, marginBottom: 6, textTransform: "uppercase", fontFamily: t.mono, letterSpacing: "0.8px" }}>Limitations</div>
                          {ap.limitations.map((l, i) => <div key={i} style={{ fontSize: 12, color: t.textSec, lineHeight: 1.55, display: "flex", gap: 7, margin: "2px 0" }}><span style={{ color: t.red, fontFamily: t.mono }}>Ã¢ÂˆÂ’</span>{l}</div>)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {ap.tools.map((tool, i) => <span key={i} style={{ padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 500, background: meta.bg, color: meta.color, fontFamily: t.mono, border: `1px solid ${meta.color}20` }}>{tool}</span>)}
                      </div>
                      {!selectedApproach && (
                        <button onClick={() => handleApprove(ap)} disabled={loading}
                          style={{ background: loading ? t.surfaceAlt : isRec ? `linear-gradient(135deg,${t.green},${t.greenDeep})` : t.surface, color: loading ? t.textMuted : isRec ? "#fff" : t.green, border: isRec ? "none" : `1.5px solid ${t.green}`, borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 9, width: "100%", justifyContent: "center" }}>
                          {loadingAgent === "design" ? <><Spinner size={14} color={isRec ? "#fff" : t.green} /> Generating designÃ¢Â€Â¦</> : <><Icon name="check" size={15} color={isRec ? "#fff" : t.green} stroke={2} /> Approve &amp; generate design</>}
                        </button>
                      )}
                      {isSel && <div style={{ color: t.green, fontWeight: 600, fontSize: 12, marginTop: 8, display: "flex", alignItems: "center", gap: 7, fontFamily: t.mono }}><Icon name="check" size={14} color={t.green} stroke={2} /> Approved</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div ref={resultRef} style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", gap: 2, background: t.surfaceAlt, borderRadius: "12px 12px 0 0", padding: "6px 6px 0", overflowX: "auto", borderBottom: `1px solid ${t.border}` }}>
              {AGENTS.filter((a) => results[a.id]).map((a) => (
                <div key={a.id} onClick={() => setActiveTab(a.id)}
                  style={{ padding: "9px 14px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", borderRadius: "8px 8px 0 0", whiteSpace: "nowrap", background: activeTab === a.id ? t.surface : "transparent", color: activeTab === a.id ? a.color : t.textMuted, borderBottom: activeTab === a.id ? `2px solid ${a.color}` : "2px solid transparent", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.mono, letterSpacing: "0.2px" }}>
                  <Icon name={a.icon} size={14} color={activeTab === a.id ? a.color : t.textMuted} /> {aLabel(a)}
                </div>
              ))}
            </div>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderTop: "none", borderRadius: "0 0 12px 12px", padding: 22, boxShadow: t.shadow }}>
              {AGENTS.filter((a) => a.id === activeTab && results[a.id]).map((a) => (
                <div key={a.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: a.bg, border: `1px solid ${a.color}25` }}><Icon name={a.icon} size={19} color={a.color} /></div>
                    <div><div style={{ fontWeight: 600, fontSize: 14.5, color: t.text, fontFamily: t.display }}>{aLabel(a)}</div><div style={{ fontSize: 11, color: t.textMuted, fontFamily: t.mono, letterSpacing: "0.2px" }}>{a.desc}</div></div>
                  </div>
                  <div style={{ maxHeight: 640, overflowY: "auto", paddingRight: 6 }}><Md text={results[a.id]} /></div>
                  {a.id === "design" && <EditBox label="Design" onSubmit={regenDesign} loading={loadingAgent === "design"} />}
                  {a.id === "code" && (
                    <>
                      <EditBox label="Code" onSubmit={regenCode} loading={loadingAgent === "code"} />
                      <div style={{ marginTop: 12 }}>
                        <button onClick={downloadDevGuide} style={{ background: `linear-gradient(135deg,${t.green},${t.greenDeep})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9 }}>
                          <Icon name="download" size={15} color="#fff" /> Download Developer Guide <span style={{ fontFamily: t.mono, opacity: 0.75, fontSize: 11 }}>.doc</span>
                        </button>
                      </div>
                    </>
                  )}
                  {a.id === "test" && <EditBox label="Test Pack" onSubmit={regenTest} loading={loadingAgent === "test"} />}
                  {a.id === "td" && (
                    <>
                      <EditBox label="TD" onSubmit={regenTD} loading={loadingAgent === "td"} />
                      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button onClick={downloadTD} style={{ background: `linear-gradient(135deg,${t.red},${t.redDeep})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9 }}>
                          <Icon name="download" size={15} color="#fff" /> Download TD for sign-off <span style={{ fontFamily: t.mono, opacity: 0.75, fontSize: 11 }}>.doc</span>
                        </button>
                        <button onClick={downloadDevGuide} style={{ background: t.surface, color: t.green, border: `1.5px solid ${t.green}`, borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9 }}>
                          <Icon name="download" size={15} color={t.green} /> Download Developer Guide <span style={{ fontFamily: t.mono, opacity: 0.75, fontSize: 11 }}>.doc</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
                {nxt && (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, background: `${nxt.color}0c`, border: `1px solid ${nxt.color}30`, borderRadius: 12, padding: "14px 18px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: nxt.color, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 3, fontFamily: t.mono }}>Next step</div>
                      <div style={{ fontSize: 13.5, color: t.text, fontFamily: t.display }}>{nxt.label}</div>
                    </div>
                    <button onClick={nxt.fn} disabled={loading}
                      style={{ background: loading ? t.surfaceAlt : nxt.color, color: loading ? t.textMuted : "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 13.5, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: loading ? "none" : `0 4px 12px ${nxt.color}44`, flexShrink: 0 }}>
                      {loading ? <><Spinner size={14} color="#fff" /> WorkingÃ¢Â€Â¦</> : <><Icon name={nxt.icon} size={15} color="#fff" /> Generate <Icon name="arrow" size={14} color="#fff" /></>}
                    </button>
                  </div>
                )}
                {phase === "complete" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.greenLight, border: `1px solid ${t.green}35`, borderRadius: 12, padding: "14px 18px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: t.surface, border: `1px solid ${t.green}40`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={18} color={t.green} stroke={2.2} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: t.greenDeep, fontFamily: t.display }}>Pipeline complete</div>
                      <div style={{ fontSize: 12, color: t.textSec }}>Download the TD (sign-off) and Developer Guide from the tabs above.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div style={{ background: t.surface, border: `1px solid ${t.accentLight}`, borderRadius: 10, padding: "16px 20px", marginTop: 18, display: "flex", alignItems: "center", gap: 14, boxShadow: `0 0 0 3px ${t.accentLight}` }}>
            <Spinner size={24} />
            <div>
              <div style={{ fontWeight: 600, color: t.text, fontSize: 13, display: "flex", alignItems: "center", gap: 8, fontFamily: t.display }}>
                {(() => { const la = AGENTS.find((a) => a.id === loadingAgent); return la ? <><Icon name={la.icon} size={15} color={la.color} /> {aLabel(la)} workingÃ¢Â€Â¦</> : "Agent workingÃ¢Â€Â¦"; })()}
              </div>
              <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2, animation: "pulse 1.5s ease infinite", fontFamily: t.mono, letterSpacing: "0.2px" }}>{loadingMsg || "ProcessingÃ¢Â€Â¦"}</div>
            </div>
          </div>
        )}

        {/* Pipeline overview on fresh start */}
        {phase === "input" && !approaches && Object.keys(results).length === 0 && (
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24, boxShadow: t.shadow }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.4px", color: t.accent, marginBottom: 18, fontFamily: t.mono, display: "flex", alignItems: "center", gap: 8 }}><Icon name="spark" size={13} color={t.accent} /> Pipeline Ã¢Â€Â” 6-approach, mixed-layer aware</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
              {AGENTS.map((a, i) => (
                <div key={a.id} style={{ padding: 15, background: t.surfaceAlt, borderRadius: 10, border: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: a.bg, border: `1px solid ${a.color}25` }}><Icon name={a.icon} size={16} color={a.color} /></div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: a.color, fontFamily: t.display, opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 12.5, color: t.text, marginBottom: 3, fontFamily: t.display }}>{aLabel(a)}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
