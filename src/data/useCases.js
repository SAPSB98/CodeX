
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
        count: 6,
        useCases: [
          { id: 'pmo-project-charter', title: 'PMO Agent – Project Charter',        status: 'released', artifactUrl: 'https://claude.ai/artifacts/latest/b8dc19d0-ab38-4752-8a24-1175dc77a9ed' },
          { id: 'project-charter-agent', title: 'Project Charter Agent',            status: 'released', artifactUrl: 'https://sapsb98.github.io/CodeX/ProjectCharterAgent.html' },
          { id: 'pmo-kickoff-deck',    title: 'PMO Agent – Project Kick Off Deck',  status: 'ideation' },
          { id: 'pmo-l4-plan',         title: 'PMO – L4 Plan with Milestones',      status: 'ideation' },
          { id: 'pmo-onboarding-kit',  title: 'PMO Agent – Onboarding Kit',         status: 'ideation' },
          { id: 'pmo-steerco',         title: 'PMO Agent – Steerco Agent',          status: 'ideation' },
        ]
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
                id: 'orion-sbpa-mtar', title: 'Orion - SBPA Automation Project MTAR - For Developers', status: 'ideation',
                subFolders: [
                  { id: 'orion-sbpa-demo',  title: 'Demo Video',              icon: '🎬' },
                  { id: 'orion-sbpa-guide', title: 'Inputs & User Guidelines', icon: '📋' },
                ]
              },
              {
                id: 'orion-calm-setup', title: 'Orion BOT - CALM Project Set-up', status: 'ideation',
                subFolders: [
                  { id: 'orion-calm-demo',  title: 'Demo Video',              icon: '🎬' },
                  { id: 'orion-calm-guide', title: 'Inputs & User Guidelines', icon: '📋' },
                ]
              },
              {
                id: 'orion-cbc-setup', title: 'Orion BOT - CBC Set-up', status: 'ideation',
                subFolders: [
                  { id: 'orion-cbc-demo',  title: 'Demo Video',              icon: '🎬' },
                  { id: 'orion-cbc-guide', title: 'Inputs & User Guidelines', icon: '📋' },
                ]
              },
              {
                id: 'orion-joule', title: 'Orion BOT - Joule Enablement', status: 'released',
                subFolders: [
                  {
                    id: 'orion-joule-demo', title: 'Demo Video', icon: '🎬',
                    videoUrls: [
                      { label: 'Video 1', url: 'https://mediaexchange.accenture.com/media/t/1_a1b302ez' },
                      { label: 'Video 2', url: 'https://mediaexchange.accenture.com/media/t/1_9rjs8afv' },
                      { label: 'Video 3', url: 'https://mediaexchange.accenture.com/media/t/1_n2arhwi7' },
                      { label: 'Video 4', url: 'https://mediaexchange.accenture.com/media/t/1_auibky2u' },
                      { label: 'Video 5', url: 'https://mediaexchange.accenture.com/media/t/1_3v7xli7o' },
                    ]
                  },
                  { id: 'orion-joule-guide', title: 'Inputs & User Guidelines', icon: '📋', componentKey: 'orion-joule-guide' },
                ]
              },
              {
                id: 'orion-user-provisioning', title: 'Orion BOT - User Provisioning', status: 'released',
                subFolders: [
                  { id: 'orion-prov-demo',  title: 'Demo Video',              icon: '🎬', videoUrl: 'https://ts.accenture.com/sites/Global_S4HPC_CoP/_layouts/15/stream.aspx?id=%2Fsites%2FGlobal%5FS4HPC%5FCoP%2FShared%20Documents%2FGeneral%2FADVANCE%20Delivery%20Documents%2F04%2E%20Orion%5FBOT%2FAdvance%20%2D%20Orion%20BOT%20%2D%20User%20Creation%20Demo%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Edd232171%2D4477%2D49df%2Db3d1%2Db444edcfb4bb' },
                  { id: 'orion-prov-guide', title: 'Inputs & User Guidelines', icon: '📋', componentKey: 'orion-user-provisioning-guide' },
                ]
              },
            ]
          },
          { id: 'orion-phase-2',       title: 'Orion Agent – Prepare Phase II',     status: 'in-progress' },
          { id: 'roles-auth-matrix',   title: 'Roles & Authorization Matrix',       status: 'released',    artifactUrl: 'https://sapsb98.github.io/CodeX/BRRGM.html' },
          { id: 'system-roles-update', title: 'System Update of Roles Matrix',      status: 'in-progress' },
        ]
      }
    ]
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
        count: 9,
        useCases: [
          { id: 'bdcq-agent',          title: 'BDCQ Agent',                            status: 'ideation' },
          { id: 'fit-to-standard',     title: 'Fit to Standard – Material Generation', status: 'released', artifactUrl: 'https://sapsb98.github.io/CodeX/FitToStandard_v5_BDCQ.html' },
          { id: 'kdd-creation',        title: 'KDD Creation',                          status: 'released',    artifactUrl: 'https://claude.ai/artifacts/latest/670550fc-93f9-4dab-a24e-55f983b2422b' },
          { id: 'fulcrum-kdd',         title: 'Fulcrum – KDD Generator',               status: 'released',    artifactUrl: 'https://sapsb98.github.io/CodeX/FulcrumAgent.html', description: 'Bulk KDD generation from scope catalog · 5-stage AI pipeline · Cloud PE compliant · Excel export' },
          { id: 'workshop-analysis',   title: 'Workshop Analysis Utility Agent',       status: 'ideation' },
          { id: 'user-stories',        title: 'User Stories',                          status: 'ideation' },
          { id: 'bp-design-l1-l5',    title: 'Business Process Design L1 to L5',      status: 'released',    artifactUrl: 'https://claude.ai/artifacts/latest/816f329f-30c7-4c38-b4cf-fa144db9b464' },
          { id: 'architecture-design', title: 'Architecture Design Agent',             status: 'ideation' },
          { id: 'wricef-inventory',    title: 'WRICEF Inventory Generator',            status: 'ideation' },
        ]
      },
      {
        name: 'Functional Agent',
        count: 4,
        useCases: [
          { id: 'functional-design-doc',    title: 'Functional Design Document Phase 1', status: 'released',  artifactUrl: 'https://claude.ai/artifacts/latest/bc95ba51-4b37-42e9-b98d-29b0f00aa11d' },
          { id: 'functional-design-phase2', title: 'Functional Design Document-Phase 2', status: 'released',  artifactUrl: 'https://claude.ai/artifacts/latest/ad106cf1-ab6a-430f-b6f8-42eb50e654cc', description: 'RICEFW FD Studio · Wave 1 Form Specialist · XDP/XSD Parser · Word Export' },
          { id: 'config-rationale',         title: 'Config Rationale',                   status: 'in-progress' },
          { id: 'config-wizard',            title: 'Config Wizard Agent',                status: 'in-progress' },
        ]
      }
    ]
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
          },
          { id: 'form-wizard',           title: 'Form Wizard',                           status: 'released',    artifactUrl: 'https://sapsb98.github.io/CodeX/SAP_Adobe_Form_Wizard_v5.12.html' },
          { id: 'cpi-tdd-integration',   title: 'Technical Design-Integration',          status: 'released',    componentKey: 'cpi-tdd-agent' },
          { id: 'interface-mapper',      title: 'Interface Mapper',                      status: 'released',    artifactUrl: 'https://claude.ai/artifacts/latest/bc95ba51-4b37-42e9-b98d-29b0f00aa11d' },
          { id: 'integration-flow',   title: 'Integration Flow Builder & Deployment', status: 'in-progress' },
          { id: 'code-quality',       title: 'Code Quality / Impact Analysis',        status: 'in-progress' },
          { id: 'technical-strategy', title: 'Technical Strategy Builder',            status: 'in-progress' },
        ]
      },
      {
        name: 'Data Agent',
        count: 4,
        useCases: [
          { id: 'data-migration-agent', title: 'S/4HANA Public Cloud Data Migration Agent', status: 'released',    artifactUrl: 'https://claude.ai/artifacts/latest/79ef1661-25be-4c47-927a-9fd3188abd83' },
          { id: 'data-strategy',        title: 'Data Strategy Builder',                     status: 'in-progress' },
          { id: 'data-cleansing',       title: 'Data Cleansing & Enrichment Agent',         status: 'in-progress' },
          { id: 'data-profiler',        title: 'Accenture Data Profiler (ADCMC)',            status: 'in-progress' },
        ]
      },
      {
        name: 'Quality Engineering Agent',
        count: 4,
        useCases: [
          { id: 'defect-resolver-qe',    title: 'Defect Resolver',               status: 'released',    artifactUrl: 'https://claude.ai/artifacts/latest/d9a7f4f1-c8cf-4583-9698-90423f2c1ec2' },
          { id: 'test-strategy-builder', title: 'Test Strategy Builder',         status: 'in-progress' },
          { id: 'test-case-generator',   title: 'Test Case / Script Generator',  status: 'in-progress' },
          { id: 'test-data',             title: 'Test Data',                     status: 'ideation' },
        ]
      }
    ]
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
          { id: 'change-impact',    title: 'Change Impact Agent',                    status: 'in-progress' },
          { id: 'change-strategy',  title: 'Change Strategy Agent',                  status: 'ideation' },
          { id: 'talent-training',  title: 'Talent Agent – Training Plan & Material', status: 'ideation' },
          { id: 'comms-template',   title: 'Communication Template Generation Agent', status: 'ideation' },
          { id: 'kut-eut-training', title: 'KUT / EUT Training Material Agent',      status: 'ideation' },
        ]
      },
      {
        name: 'Deployment Agent',
        count: 2,
        useCases: [
          { id: 'cutover-plan',   title: 'Cutover Approach & Plan / Task Generator', status: 'ideation' },
          { id: 'copy-reference', title: 'Copy Reference',                           status: 'ideation' },
        ]
      }
    ]
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
          { id: 'defect-resolver-run',  title: 'Defect Resolver',                        status: 'released',    artifactUrl: 'https://claude.ai/artifacts/latest/d9a7f4f1-c8cf-4583-9698-90423f2c1ec2' },
          { id: 'autonomous-ops',       title: 'Autonomous Ops / Knowledge Steward',     status: 'ideation' },
          { id: 'incident-resolution',  title: 'Incident Resolution / Service Requests', status: 'ideation' },
          { id: 'release-impact',       title: 'Release Impact Agent',                   status: 'ideation' },
        ]
      }
    ]
  }
]

export const useCaseMap = Object.fromEntries(
  phases.flatMap(p => p.agentGroups.flatMap(g => g.useCases)).map(uc => [uc.id, uc])
)
