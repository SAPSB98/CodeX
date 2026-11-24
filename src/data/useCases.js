export const phases = [
  {
    id: 'discover-prepare',
    name: 'Discover & Prepare',
    completion: '10%',
    icon: '🔍',
    color: '#4F46E5',
    agentGroups: [
      {
        name: 'PMO Agent',
        count: 5,
        useCases: [
          {
            id: 'pmo-project-charter',
            title: 'PMO Agent – Project Charter',
            status: 'released',
            artifactUrl: 'https://claude.ai/artifacts/latest/b8dc19d0-ab38-4752-8a24-1175dc77a9ed',
            demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_8eenyx9a/412014342',
          },
          { id: 'pmo-kickoff-deck', title: 'PMO Agent – Project Kick Off Deck', status: 'ideation' },
          { id: 'pmo-l4-plan', title: 'L4 Plan (MVP)', status: 'released', artifactUrl: 'https://sapsb98.github.io/CodeX/L4_Plan_Agent_MVP.html', demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_f7zjb0ua/412014342' },
          { id: 'pmo-onboarding-kit', title: 'PMO Agent – Onboarding Kit', status: 'released', artifactUrl: 'https://sapsb98.github.io/CodeX/S4HANA_Onboarding_Walkthrough.html', demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_klqt138p/412014342' },
          { id: 'pmo-steerco', title: 'PMO Agent – Steerco Agent', status: 'ideation' },
        ],
      },
      {
        name: 'Security Agent',
        count: 4,
        useCases: [
          {
            id: 'orion-phase-1',
            title: 'Orion Agent – Prepare Phase I',
            status: 'released',
            subAgents: [
              {
                id: 'orion-sbpa-mtar',
                title: 'Orion - SBPA Automation Project MTAR - For Developers',
                status: 'ideation',
                subFolders: [
                  { id: 'orion-sbpa-demo', title: 'Demo Video', icon: '🎬' },
                  { id: 'orion-sbpa-guide', title: 'Inputs & User Guidelines', icon: '📋' },
                ],
              },
              {
                id: 'orion-calm-setup',
                title: 'Orion BOT - CALM Project Set-up',
                status: 'ideation',
                subFolders: [
                  { id: 'orion-calm-demo', title: 'Demo Video', icon: '🎬' },
                  { id: 'orion-calm-guide', title: 'Inputs & User Guidelines', icon: '📋' },
                ],
              },
              {
                id: 'orion-cbc-setup',
                title: 'Orion BOT - CBC Set-up',
                status: 'ideation',
                subFolders: [
                  { id: 'orion-cbc-demo', title: 'Demo Video', icon: '🎬' },
                  { id: 'orion-cbc-guide', title: 'Inputs & User Guidelines', icon: '📋' },
                ],
              },
              {
                id: 'orion-joule',
                title: 'Orion BOT - Joule Enablement',
                status: 'released',
                subFolders: [
                  {
                    id: 'orion-joule-demo',
                    title: 'Demo Video',
                    icon: '🎬',
                    videoUrls: [
                      { label: 'Video 1', url: 'https://mediaexchange.accenture.com/media/t/1_a1b302ez' },
                      { label: 'Video 2', url: 'https://mediaexchange.accenture.com/media/t/1_9rjs8afv' },
                      { label: 'Video 3', url: 'https://mediaexchange.accenture.com/media/t/1_n2arhwi7' },
                      { label: 'Video 4', url: 'https://mediaexchange.accenture.com/media/t/1_auibky2u' },
                      { label: 'Video 5', url: 'https://mediaexchange.accenture.com/media/t/1_3v7xli7o' },
                    ],
                  },
                  { id: 'orion-joule-guide', title: 'Inputs & User Guidelines', icon: '📋', componentKey: 'orion-joule-guide' },
                ],
              },
              {
                id: 'orion-user-provisioning',
                title: 'Orion BOT - User Provisioning',
                status: 'released',
                subFolders: [
                  {
                    id: 'orion-prov-demo',
                    title: 'Demo Video',
                    icon: '🎬',
                    videoUrl: 'https://ts.accenture.com/sites/Global_S4HPC_CoP/_layouts/15/stream.aspx?id=%2Fsites%2FGlobal%5FS4HPC%5FCoP%2FShared%20Documents%2FGeneral%2FADVANCE%20Delivery%20Documents%2F04%2E%20Orion%5FBOT%2FAdvance%20%2D%20Orion%20BOT%20%2D%20User%20Creation%20Demo%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Edd232171%2D4477%2D49df%2Db3d1%2Db444edcfb4bb',
                  },
                  { id: 'orion-prov-guide', title: 'Inputs & User Guidelines', icon: '📋', componentKey: 'orion-user-provisioning-guide' },
                ],
              },
            ],
          },
          { id: 'orion-phase-2', title: 'Orion Agent – Prepare Phase II', status: 'in-progress' },
          { id: 'roles-auth-matrix', title: 'Roles & Authorization Matrix', status: 'released', artifactUrl: 'https://sapsb98.github.io/CodeX/BRRGM.html', demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_ju402l2u' },
          { id: 'system-roles-update', title: 'System Update of Roles Matrix', status: 'in-progress' },
        ],
      },
    ],
  },
  {
    id: 'explore',
    name: 'Explore',
    completion: '15%',
    icon: '🧭',
    color: '#7C3AED',
    agentGroups: [
      {
        name: 'Solution Confirmation Agent',
        count: 7,
        useCases: [
          {
            id: 'explore-accelerator',
            title: 'Explore Accelerator',
            description: 'Fit to Standard – Material Generation · KDD & BDCQ User Guide · Business Process Design L1 to L5 · WRICEF Inventory Generator',
            status: 'released',
            agentCount: 4,
            docs: [
              { title: 'Demo Video', subtitle: 'Explore Accelerator — end-to-end walkthrough', url: 'https://sapsb98.github.io/CodeX/media/Explore-Accelerator-Demo.mp4', icon: '🎬', cta: 'Watch Video' },
              { title: 'User Guide', subtitle: 'SAP S/4HANA Cloud PE Explore Accelerator — full user guide (v2)', url: 'https://sapsb98.github.io/CodeX/ExploreAccelerator/ExploreAccelerator_UserGuide_v2.html', icon: '📄', cta: 'Open Guide' },
            ],
          },
          { id: 'workshop-analysis', title: 'Workshop Analysis Utility Agent', status: 'ideation' },
          { id: 'user-stories', title: 'User Stories', status: 'ideation' },
          { id: 'architecture-design', title: 'Architecture Design Agent', status: 'ideation' },
        ],
      },
      {
        name: 'Functional Agent',
        count: 4,
        useCases: [
          {
            id: 'functional-design-doc',
            title: 'Functional Design Document Phase 1',
            status: 'released',
            artifactUrl: 'https://claude.ai/artifacts/latest/bc95ba51-4b37-42e9-b98d-29b0f00aa11d',
            demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_prwb8kt3/412014342',
          },
          {
            id: 'functional-design-phase2',
            title: 'Functional Design Document-Phase 2',
            status: 'released',
            artifactUrl: 'https://claude.ai/artifacts/latest/ad106cf1-ab6a-430f-b6f8-42eb50e654cc',
            demoVideoUrl: 'https://mediaexchange.accenture.com/edit/1_pojb774m',
            description: 'RICEFW FD Studio · Wave 1 Form Specialist · XDP/XSD Parser · Word Export',
          },
          { id: 'config-rationale', title: 'Config Rationale', status: 'in-progress' },
          {
            id: 'config-wizard',
            title: 'Config Wizard Agent',
            status: 'released',
            docs: [
              { title: 'Demo Video', subtitle: 'Config Wizard Agent — walkthrough on Accenture Media Exchange', url: 'https://mediaexchange.accenture.com/media/t/1_8jkt4fet', icon: '🎬', cta: 'Watch Video' },
              {
                title: 'Setup Guide',
                subtitle: 'Installation & First-Time Configuration · Version 1.0',
                url: 'https://sapsb98.github.io/CodeX/docs/SAP-Config-Agent-Setup-Guide.pdf',
              },
              { title: 'User Guide', subtitle: 'For Functional Consultants · Version 1.0', url: 'https://sapsb98.github.io/CodeX/docs/SAP-Config-Agent-User-Guide.pdf' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'realize',
    name: 'Realize',
    completion: '55%',
    icon: '⚙️',
    color: '#9333EA',
    agentGroups: [
      {
        name: 'Intelligent Build Agent',
        count: 7,
        useCases: [
          {
            id: 'rcefw-builder',
            title: 'RCEFW Builder',
            description: 'Technical Design · RAP Code Generation · CAP Code Generation · UI Code Generation',
            status: 'released',
            agentCount: 4,
            artifactUrl: 'https://claude.ai/artifacts/latest/66e02cb5-7040-436b-9bbe-63f191f0469b',
            links: [
              { icon: '🎬', label: 'Watch Demo Video · Part 1', url: 'https://mediaexchange.accenture.com/media/t/1_6qxk5vzb' },
              { icon: '🎬', label: 'Watch Demo Video · Part 2', url: 'https://mediaexchange.accenture.com/media/t/1_1rhhze2n' },
              { icon: '📄', label: 'S4PC Catalyst – User Guide', url: 'https://sapsb98.github.io/CodeX/docs/S4PC-Catalyst-User-Guide.html' },
              { icon: '❓', label: 'S4PC Catalyst – FAQ', url: 'https://sapsb98.github.io/CodeX/GrowActivAIte_Agent_FAQ.html#agent-26' },
            ],
          },
          { id: 'form-wizard', title: 'Form Wizard', status: 'released', artifactUrl: 'https://sapsb98.github.io/CodeX/SAP_Adobe_Form_Wizard_v5.12.html', demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_ld072i7e/412014342' },
          {
            id: 'cpi-tdd-integration',
            title: 'Technical Design-Integration',
            status: 'released',
            artifactUrl: 'https://claude.ai/artifacts/latest/f17e6bb8-3334-4173-9827-e9a2a0564993',
            demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_oo7whsi8',
          },
          { id: 'interface-mapper', title: 'Interface Mapper', status: 'released', artifactUrl: 'https://claude.ai/artifacts/latest/bc95ba51-4b37-42e9-b98d-29b0f00aa11d', demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_prwb8kt3/412014342' },
          { id: 'integration-flow', title: 'Integration Flow Builder & Deployment', status: 'in-progress' },
          {
            id: 'code-quality',
            title: 'Code Quality / Impact Analysis',
            description: 'SAP Code Reviewer · Clean-Core review · PDF + Excel findings reports',
            status: 'released',
            docs: [
              { title: 'Demo Video', subtitle: 'SAP Code Reviewer walkthrough · Accenture Media Exchange', url: 'https://mediaexchange.accenture.com/media/t/1_01eujj32', icon: '🎬', cta: 'Watch Video' },
              { title: 'User Guide', subtitle: 'Tool overview, prerequisites, installation & known limitations', url: 'https://sapsb98.github.io/CodeX/docs/SAP-Code-Reviewer-User-Guide.html', icon: '📄', cta: 'Open Guide' },
            ],
          },
          { id: 'technical-strategy', title: 'Technical Strategy Builder', status: 'in-progress' },
        ],
      },
      {
        name: 'Data Agent',
        count: 2,
        useCases: [
          {
            id: 'data-migration-agent',
            title: 'S/4HANA Public Cloud Data Migration Agent',
            description: 'Data Migration · Data Cleansing & Enrichment',
            status: 'released',
            artifactUrl: 'https://sapsb98.github.io/CodeX/S4HANA_DataMigration_Walkthrough.html',
            demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_1kz5iidw/412014342',
          },
          {
            id: 'data-strategy',
            title: 'Data Strategy Builder',
            description: 'SOW-driven data strategy · 8-step guided workflow · Scope, objects & principles · Export-ready draft',
            status: 'released',
            docs: [
              { title: 'Demo Video', subtitle: 'Data Strategy Builder — walkthrough on Accenture Media Exchange', url: 'https://mediaexchange.accenture.com/media/t/1_7o2zt5w6', icon: '🎬', cta: 'Watch Video' },
              { title: 'User Guide', subtitle: 'Sign-in, the 8 steps, good practice & quick reference', url: 'https://sapsb98.github.io/CodeX/docs/Data-Strategy-Builder-User-Guide.html', icon: '📄', cta: 'Open Guide' },
            ],
          },
        ],
      },
      {
        name: 'Quality Engineering Agent',
        count: 4,
        useCases: [
          { id: 'defect-resolver-qe', title: 'Defect Resolver', status: 'released', artifactUrl: 'https://claude.ai/artifacts/latest/d9a7f4f1-c8cf-4583-9698-90423f2c1ec2', demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_nir7diep/412014342' },
          {
            id: 'test-strategy-builder',
            title: 'Test Strategy Builder',
            description: 'SOW-driven test strategy · Test plan & capacity · RTM & automation · Excel working pack',
            status: 'released',
            docs: [
              { title: 'Demo Video', subtitle: 'Test Strategy Generator — walkthrough on Accenture Media Exchange', url: 'https://mediaexchange.accenture.com/media/t/1_1s61vwpl', icon: '🎬', cta: 'Watch Video' },
              { title: 'User Guide', subtitle: 'Workflow, outputs, calculations & troubleshooting', url: 'https://sapsb98.github.io/CodeX/docs/SAP-Test-Strategy-Generator-User-Guide.html', icon: '📄', cta: 'Open Guide' },
            ],
          },
          { id: 'test-case-generator', title: 'Test Case / Script Generator', status: 'in-progress' },
          { id: 'test-data', title: 'Test Data', status: 'ideation' },
        ],
      },
    ],
  },
  {
    id: 'deploy',
    name: 'Deploy',
    completion: '20%',
    icon: '🚀',
    color: '#C026D3',
    agentGroups: [
      {
        name: 'Change & Talent Agent',
        count: 5,
        useCases: [
          { id: 'change-impact', title: 'Change Impact Agent', status: 'in-progress' },
          { id: 'change-strategy', title: 'Change Strategy Agent', status: 'ideation' },
          { id: 'talent-training', title: 'Talent Agent – Training Plan & Material', status: 'ideation' },
          { id: 'comms-template', title: 'Communication Template Generation Agent', status: 'ideation' },
          { id: 'kut-eut-training', title: 'KUT / EUT Training Material Agent', status: 'ideation' },
        ],
      },
      {
        name: 'Deployment Agent',
        count: 2,
        useCases: [
          { id: 'cutover-plan', title: 'Cutover Approach & Plan / Task Generator', status: 'ideation' },
          { id: 'copy-reference', title: 'Copy Reference', status: 'ideation' },
        ],
      },
    ],
  },
  {
    id: 'run',
    name: 'Run',
    completion: null,
    icon: '▶️',
    color: '#7c6ff7',
    agentGroups: [
      {
        name: 'Run Support Agent',
        count: 4,
        useCases: [
          { id: 'defect-resolver-run', title: 'Defect Resolver', status: 'released', artifactUrl: 'https://claude.ai/artifacts/latest/d9a7f4f1-c8cf-4583-9698-90423f2c1ec2', demoVideoUrl: 'https://mediaexchange.accenture.com/media/t/1_nir7diep/412014342' },
          { id: 'autonomous-ops', title: 'Autonomous Ops / Knowledge Steward', status: 'ideation' },
          { id: 'incident-resolution', title: 'Incident Resolution / Service Requests', status: 'ideation' },
          { id: 'release-impact', title: 'Release Impact Agent', status: 'ideation' },
        ],
      },
    ],
  },
]

export const useCaseMap = Object.fromEntries(
  phases.flatMap(p => p.agentGroups.flatMap(g => g.useCases)).map(uc => [uc.id, uc])
)
