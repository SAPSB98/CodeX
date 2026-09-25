import { useState } from 'react'
import UserProvisioningGuide from './UserProvisioningGuide'
import JouleEnablementGuide from './JouleEnablementGuide'
import CPITDDAgent from './CPITDDAgent'
import FunctionalDesignStudio from './FunctionalDesignStudio'

const INLINE_COMPONENTS = {
  'orion-user-provisioning-guide': UserProvisioningGuide,
  'orion-joule-guide': JouleEnablementGuide,
  'cpi-tdd-agent': CPITDDAgent,
  'functional-design-studio': FunctionalDesignStudio,
}

// Map agent IDs to their IPOV slide image paths
const IPOV_SLIDES = {
  'orion-user-provisioning': ['/CodeX/ipov/orion-user-provisioning.png'],
  'orion-joule':             ['/CodeX/ipov/orion-joule.png'],
  'fit-to-standard':         ['/CodeX/ipov/fit-to-standard.png'],
  'bp-design-l1-l5':        ['/CodeX/ipov/bp-design-l1-l5.png'],
  'functional-design-doc':   ['/CodeX/ipov/functional-design-doc.png'],
  'data-migration-agent':    ['/CodeX/ipov/data-migration-agent.png'],
  'defect-resolver-qe':      ['/CodeX/ipov/defect-resolver.png'],
  'defect-resolver-run':     ['/CodeX/ipov/defect-resolver.png'],
  'form-wizard':             ['/CodeX/ipov/form-wizard.png'],
  'interface-mapper':        ['/CodeX/ipov/interface-mapper.png'],
  'rcefw-builder':           ['/CodeX/ipov/rcefw-rap.png', '/CodeX/ipov/rcefw-cap.png', '/CodeX/ipov/rcefw-ui.png'],
  'kdd-creation':            ['/CodeX/ipov/kdd-creation.png'],
  'pmo-project-charter':     ['/CodeX/ipov/pmo-project-charter.png'],
  'cpi-tdd-integration':     ['/CodeX/ipov/cpi-tdd-integration.png'],
  'roles-auth-matrix':       ['/CodeX/ipov/roles-auth-matrix.png'],
  'functional-design-phase2':['/CodeX/ipov/functional-design-phase2.png'],
}

export default function UseCaseView({ useCase, phaseColor, onBack }) {
  const [activeSubAgent, setActiveSubAgent] = useState(null)
  const [activeSubFolder, setActiveSubFolder] = useState(null)
  const [activeTab, setActiveTab] = useState('agent')
  const [launchedIds, setLaunchedIds] = useState(new Set())

  const current = activeSubFolder ?? activeSubAgent ?? useCase
  const Component = current.component
  const InlineComponent = current.componentKey ? INLINE_COMPONENTS[current.componentKey] : null
  const ipovSlide = IPOV_SLIDES[current.id]
  const isLeafAgent = !current.subAgents

  function handleBack() {
    if (activeSubFolder) {
      setActiveSubFolder(null)
    } else if (activeSubAgent) {
      setActiveSubAgent(null)
    } else {
      onBack()
    }
  }

  // Breadcrumb label
  function renderBreadcrumb() {
    if (activeSubFolder) {
      return (
        <span style={{ fontSize: 11, fontWeight: 700, color: phaseColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          <span style={{ opacity: 0.5, cursor: 'pointer' }} onClick={() => { setActiveSubAgent(null); setActiveSubFolder(null) }}>{useCase.title}</span>
          {' › '}
          <span style={{ opacity: 0.5, cursor: 'pointer' }} onClick={() => setActiveSubFolder(null)}>{activeSubAgent.title}</span>
          {' › '}
          {activeSubFolder.title}
        </span>
      )
    }
    if (activeSubAgent) {
      return (
        <span style={{ fontSize: 11, fontWeight: 700, color: phaseColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          <span style={{ opacity: 0.5, cursor: 'pointer' }} onClick={() => setActiveSubAgent(null)}>{useCase.title}</span>
          {' › '}
          {activeSubAgent.title}
        </span>
      )
    }
    return <span style={{ fontSize: 11, fontWeight: 700, color: phaseColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>Pilot Ready</span>
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f0f0f8' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 28px',
        background: '#fff',
        borderBottom: `3px solid ${phaseColor}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        flexShrink: 0
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#374151'
          }}
        >
          ← Back
        </button>
        <div style={{ width: 1, height: 24, background: '#e5e7eb', flexShrink: 0 }} />
        <div>
          <div style={{ marginBottom: 2 }}>{renderBreadcrumb()}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b' }}>
            {current.title}
          </div>
          {current.description && (
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
              {current.description}
            </div>
          )}
        </div>
      </div>

      {/* IPOV tab bar — only show on leaf agent views */}
      {isLeafAgent && (
        <div style={{ display: 'flex', gap: 4, padding: '0 24px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          {['agent', 'ipov'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${phaseColor}` : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                color: activeTab === tab ? phaseColor : '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                transition: 'all 0.15s',
              }}
            >
              {tab === 'agent' ? 'Agent' : 'IPOV'}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* IPOV tab content */}
        {isLeafAgent && activeTab === 'ipov' ? (
          ipovSlide ? (
            <div style={{ flex: 1, overflow: 'auto', background: '#f0f0f8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 24 }}>
              {ipovSlide.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`IPOV Slide ${i + 1}`}
                  style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                />
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, background: '#f0f0f8' }}>
              <div style={{ fontSize: 40 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b' }}>IPOV Slide Coming Soon</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>The Integrated Point of View for this agent is being prepared.</div>
            </div>
          )
        ) : (
          /* Agent tab content (original) */
          !activeSubAgent && useCase.subAgents ? (
            <SubAgentGrid parentUseCase={useCase} phaseColor={phaseColor} onSelect={(a) => { setActiveSubAgent(a); setActiveTab('agent') }} />
          ) : activeSubAgent && !activeSubFolder && activeSubAgent.subFolders ? (
            <SubFolderGrid parentAgent={activeSubAgent} phaseColor={phaseColor} onSelect={setActiveSubFolder} />
          ) : current.videoUrls ? (
            <MultiVideoLauncher useCase={current} phaseColor={phaseColor} />
          ) : current.videoUrl ? (
            <VideoLauncher useCase={current} phaseColor={phaseColor} />
          ) : current.componentKey ? (
            InlineComponent && launchedIds.has(current.id)
              ? <div style={{ flex: 1, overflow: 'auto' }}><InlineComponent /></div>
              : <InlineLauncher useCase={current} phaseColor={phaseColor} onLaunch={InlineComponent ? () => setLaunchedIds(s => new Set([...s, current.id])) : null} />
          ) : current.artifactUrl ? (
            window.electronAPI && !current.artifactUrl.includes('claude.ai') ? (
              <webview src={current.artifactUrl} style={{ flex: 1, width: '100%', border: 'none', display: 'block' }} allowpopups="true" />
            ) : (
              <ArtifactLauncher useCase={current} phaseColor={phaseColor} />
            )
          ) : Component ? (
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Component onSendPrompt={null} height="calc(100vh - 65px)" style={{ height: 'calc(100vh - 65px)' }} />
            </div>
          ) : (
            <div style={{ flex: 1, overflow: 'auto' }}>
              <PlaceholderContent useCase={current} phaseColor={phaseColor} />
            </div>
          )
        )}
      </div>
    </div>
  )
}

function SubAgentGrid({ parentUseCase, phaseColor, onSelect }) {
  const [hovered, setHovered] = useState(null)
  const subAgents = parentUseCase.subAgents ?? []

  return (
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: '36px 40px',
      background: 'linear-gradient(160deg, #f5f3ff 0%, #f0f0f8 60%, #ede9fe 100%)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: '#fff',
          border: `1.5px solid ${phaseColor}30`,
          borderRadius: 12,
          padding: '10px 18px',
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            boxShadow: `0 4px 12px ${phaseColor}40`,
          }}>
            🤖
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: phaseColor, marginBottom: 2 }}>
              Super Agent
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1e1b4b' }}>
              {parentUseCase.title}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#6b7280', marginLeft: 2 }}>
          Select a sub-agent to open
        </div>
      </div>

      {/* Folder grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {subAgents.map((sa) => {
          const isReady = sa.status === 'released'
          const isIdeation = sa.status === 'ideation'
          const isInProgress = sa.status === 'in-progress'
          const badgeColor = isReady ? phaseColor : isInProgress ? '#D97706' : '#DC2626'
          const badgeBg    = isReady ? phaseColor + '15' : isInProgress ? '#FEF3C7' : '#FEE2E2'
          const accentColor= isReady ? phaseColor : isInProgress ? '#F59E0B' : '#EF4444'
          const badgeLabel = isReady ? 'Pilot Ready' : isInProgress ? 'In-Progress' : 'Ideation'
          const cardOpacity= isReady ? 1 : isInProgress ? 0.9 : 0.8
          const borderColor= hovered === sa.id
            ? (isReady ? phaseColor : accentColor)
            : (isReady ? phaseColor + '33' : accentColor + '55')

          return (
            <div
              key={sa.id}
              onClick={isReady ? () => onSelect(sa) : undefined}
              onMouseEnter={() => setHovered(sa.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 220,
                background: '#fff',
                borderRadius: 14,
                border: `1.5px solid ${borderColor}`,
                boxShadow: isReady && hovered === sa.id
                  ? `0 8px 28px ${phaseColor}28`
                  : '0 2px 8px rgba(0,0,0,0.07)',
                transform: isReady && hovered === sa.id ? 'translateY(-3px)' : 'none',
                transition: 'all 0.15s ease',
                cursor: isReady ? 'pointer' : 'default',
                opacity: cardOpacity,
                overflow: 'hidden',
              }}
            >
              <div style={{
                height: 6,
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
              }} />
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ fontSize: 32, marginBottom: 10, lineHeight: 1 }}>📁</div>
                <div style={{
                  display: 'inline-block',
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  color: badgeColor,
                  background: badgeBg,
                  borderRadius: 20,
                  padding: '2px 8px',
                  marginBottom: 8
                }}>
                  ● {badgeLabel}
                </div>
                <div style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#1e1b4b',
                  lineHeight: 1.45,
                  marginBottom: 10,
                }}>
                  {sa.title}
                </div>
                {isReady && (
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: hovered === sa.id ? phaseColor : phaseColor + 'aa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'color 0.15s',
                  }}>
                    Open →
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SubFolderGrid({ parentAgent, phaseColor, onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: '36px 40px',
      background: 'linear-gradient(160deg, #f5f3ff 0%, #f0f0f8 60%, #ede9fe 100%)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: '#fff',
          border: `1.5px solid ${phaseColor}30`,
          borderRadius: 12,
          padding: '10px 18px',
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <span style={{ fontSize: 28 }}>📁</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: phaseColor, marginBottom: 2 }}>
              Sub-Agent
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1e1b4b' }}>
              {parentAgent.title}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginLeft: 2 }}>
          Select a folder to open
        </div>
      </div>

      {/* Folder cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {parentAgent.subFolders.map((sf) => (
          <div
            key={sf.id}
            onClick={() => onSelect(sf)}
            onMouseEnter={() => setHovered(sf.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: 240,
              background: '#fff',
              borderRadius: 16,
              border: `1.5px solid ${hovered === sf.id ? phaseColor : phaseColor + '33'}`,
              boxShadow: hovered === sf.id
                ? `0 8px 28px ${phaseColor}28`
                : '0 2px 8px rgba(0,0,0,0.07)',
              transform: hovered === sf.id ? 'translateY(-3px)' : 'none',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: 6, background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)` }} />
            <div style={{ padding: '24px 22px 22px' }}>
              <div style={{ fontSize: 40, marginBottom: 14, lineHeight: 1 }}>{sf.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1e1b4b', marginBottom: 10, lineHeight: 1.3 }}>
                {sf.title}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700,
                color: hovered === sf.id ? phaseColor : phaseColor + 'aa',
                display: 'flex', alignItems: 'center', gap: 4,
                transition: 'color 0.15s',
              }}>
                Open →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MultiVideoLauncher({ useCase, phaseColor }) {
  const [hovered, setHovered] = useState(null)

  function open(url) {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: '40px 32px',
      background: 'linear-gradient(160deg, #f5f3ff 0%, #f0f0f8 60%, #ede9fe 100%)',
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    }}>
      <div style={{
        background: '#fff', borderRadius: 24,
        boxShadow: '0 12px 48px rgba(124,111,247,0.15)',
        border: `1.5px solid ${phaseColor}22`,
        maxWidth: 520, width: '100%', overflow: 'hidden',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${phaseColor}18 0%, ${phaseColor}06 100%)`,
          borderBottom: `1px solid ${phaseColor}20`,
          padding: '28px 36px 24px',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, marginBottom: 14,
            boxShadow: `0 6px 20px ${phaseColor}40`,
          }}>🎬</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: phaseColor, marginBottom: 6 }}>
            Demo Videos
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', lineHeight: 1.2 }}>
            {useCase.title}
          </div>
        </div>

        <div style={{ padding: '20px 36px 28px' }}>
          <div style={{
            background: '#f8f7ff', border: `1px solid ${phaseColor}25`,
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📺</span>
            <div style={{ fontSize: 12.5, color: '#4c4a5a', lineHeight: 1.6 }}>
              Hosted on <strong>Accenture Media Exchange</strong>. Each link opens in your browser — sign in with your Accenture account if prompted.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {useCase.videoUrls.map((v, i) => (
              <button
                key={i}
                onClick={() => open(v.url)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: '100%', padding: '12px 20px',
                  background: hovered === i
                    ? `linear-gradient(135deg, ${phaseColor} 0%, ${phaseColor}cc 100%)`
                    : '#f8f7ff',
                  color: hovered === i ? '#fff' : phaseColor,
                  border: `1.5px solid ${phaseColor}40`,
                  borderRadius: 12,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all 0.15s ease',
                  boxShadow: hovered === i ? `0 4px 16px ${phaseColor}44` : 'none',
                }}
              >
                <span style={{ fontSize: 16 }}>▶️</span>
                {v.label}
                <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.75, fontWeight: 600 }}>↗</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoLauncher({ useCase, phaseColor }) {
  function open() {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(useCase.videoUrl)
    } else {
      window.open(useCase.videoUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%', padding: '48px 32px',
      background: 'linear-gradient(160deg, #f5f3ff 0%, #f0f0f8 60%, #ede9fe 100%)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 24,
        boxShadow: '0 12px 48px rgba(124,111,247,0.15)',
        border: `1.5px solid ${phaseColor}22`,
        maxWidth: 480, width: '100%', overflow: 'hidden',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${phaseColor}18 0%, ${phaseColor}06 100%)`,
          borderBottom: `1px solid ${phaseColor}20`,
          padding: '32px 36px 28px',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, marginBottom: 16,
            boxShadow: `0 6px 20px ${phaseColor}40`,
          }}>🎬</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: phaseColor, marginBottom: 6 }}>
            Demo Video
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', lineHeight: 1.2 }}>
            {useCase.title}
          </div>
        </div>
        <div style={{ padding: '24px 36px 32px' }}>
          <div style={{
            background: '#f8f7ff', border: `1px solid ${phaseColor}25`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 24,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📺</span>
            <div style={{ fontSize: 12.5, color: '#4c4a5a', lineHeight: 1.6 }}>
              Hosted on <strong>Accenture SharePoint Stream</strong>. Clicking Watch Video opens it in your browser — sign in with your Accenture account if prompted.
            </div>
          </div>
          <button
            onClick={open}
            style={{
              width: '100%', padding: '15px 24px',
              background: `linear-gradient(135deg, ${phaseColor} 0%, ${phaseColor}cc 100%)`,
              color: '#fff', border: 'none', borderRadius: 14,
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, boxShadow: `0 6px 24px ${phaseColor}44`,
            }}
          >
            <span style={{ fontSize: 18 }}>▶️</span>
            Watch Video
            <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 600 }}>↗</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function InlineLauncher({ useCase, phaseColor, onLaunch }) {
  const agents = (useCase.description || '').split('·').map(s => s.trim()).filter(Boolean)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      padding: '48px 32px',
      background: 'linear-gradient(160deg, #f5f3ff 0%, #f0f0f8 60%, #ede9fe 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 12px 48px rgba(124,111,247,0.15)',
        border: `1.5px solid ${phaseColor}22`,
        maxWidth: 520,
        width: '100%',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${phaseColor}18 0%, ${phaseColor}06 100%)`,
          borderBottom: `1px solid ${phaseColor}20`,
          padding: '32px 36px 28px',
        }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            marginBottom: 16,
            boxShadow: `0 6px 20px ${phaseColor}40`,
          }}>
            🤖
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: phaseColor, marginBottom: 6 }}>
            AI Agent · Pilot Ready
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', lineHeight: 1.2 }}>
            {useCase.title}
          </div>
        </div>

        <div style={{ padding: '28px 36px 36px' }}>
          {agents.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10 }}>
                Includes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {agents.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: phaseColor, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13.5, color: '#374151', fontWeight: 500 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            background: '#f8f7ff',
            border: `1px solid ${phaseColor}25`,
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 24,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚡</span>
            <div style={{ fontSize: 12.5, color: '#4c4a5a', lineHeight: 1.6 }}>
              This agent runs <strong>natively inside CodeX</strong> — no external URL needed.
              Your API key is used securely from local storage.
            </div>
          </div>

          <button
            onClick={onLaunch ?? undefined}
            disabled={!onLaunch}
            style={{
              width: '100%',
              padding: '15px 24px',
              background: onLaunch
                ? `linear-gradient(135deg, ${phaseColor} 0%, ${phaseColor}cc 100%)`
                : '#e5e7eb',
              color: onLaunch ? '#fff' : '#9ca3af',
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 800,
              cursor: onLaunch ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: onLaunch ? `0 6px 24px ${phaseColor}44` : 'none',
              letterSpacing: 0.3,
            }}
          >
            <span style={{ fontSize: 18 }}>{onLaunch ? '🚀' : '⏳'}</span>
            {onLaunch ? 'Launch Agent' : 'New Version Coming Soon'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ArtifactLauncher({ useCase, phaseColor }) {
  function launch() {
    const url = useCase.artifactUrl
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const agents = (useCase.description || '').split('·').map(s => s.trim()).filter(Boolean)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      padding: '48px 32px',
      background: 'linear-gradient(160deg, #f5f3ff 0%, #f0f0f8 60%, #ede9fe 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 12px 48px rgba(124,111,247,0.15)',
        border: `1.5px solid ${phaseColor}22`,
        maxWidth: 520,
        width: '100%',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${phaseColor}18 0%, ${phaseColor}06 100%)`,
          borderBottom: `1px solid ${phaseColor}20`,
          padding: '32px 36px 28px',
        }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            marginBottom: 16,
            boxShadow: `0 6px 20px ${phaseColor}40`,
          }}>
            🤖
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: phaseColor, marginBottom: 6 }}>
            AI Agent · Pilot Ready
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', lineHeight: 1.2 }}>
            {useCase.title}
          </div>
        </div>

        <div style={{ padding: '28px 36px 36px' }}>
          {agents.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10 }}>
                Includes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {agents.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: phaseColor, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13.5, color: '#374151', fontWeight: 500 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            background: '#f8f7ff',
            border: `1px solid ${phaseColor}25`,
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 24,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚡</span>
            <div style={{ fontSize: 12.5, color: '#4c4a5a', lineHeight: 1.6 }}>
              This agent runs on <strong>Claude.ai</strong> — clicking Launch opens it directly.
              No download or setup needed. Sign in with your Claude account to use it.
            </div>
          </div>

          <button
            onClick={launch}
            style={{
              width: '100%',
              padding: '15px 24px',
              background: `linear-gradient(135deg, ${phaseColor} 0%, ${phaseColor}cc 100%)`,
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: `0 6px 24px ${phaseColor}44`,
              letterSpacing: 0.3,
            }}
          >
            <span style={{ fontSize: 18 }}>🚀</span>
            Launch Agent
            <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 600 }}>↗</span>
          </button>
        </div>
      </div>

    </div>
  )
}

function PlaceholderContent({ useCase, phaseColor }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 16,
      padding: 40
    }}>
      <div style={{
        width: 72, height: 72,
        borderRadius: 20,
        background: phaseColor + '15',
        border: `2px dashed ${phaseColor}55`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32
      }}>
        🔗
      </div>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <h2 style={{ margin: '0 0 8px', color: '#1e1b4b', fontSize: 20 }}>
          {useCase.title}
        </h2>
        <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
          The artifact for this use case will be linked here.
          Share the JSX file and it will be embedded directly in this view.
        </p>
        <div style={{
          display: 'inline-block',
          fontSize: 11,
          fontWeight: 700,
          color: phaseColor,
          background: phaseColor + '15',
          borderRadius: 20,
          padding: '4px 14px',
          textTransform: 'uppercase',
          letterSpacing: 0.6
        }}>
          Pilot Ready — Artifact Pending
        </div>
      </div>
    </div>
  )
}
