import { useState } from 'react'

export default function App() {
  const [tab, setTab] = useState('generate')
  const [form, setForm] = useState({
    framework: 'cap',
    entity: '',
    pattern: 'crud',
    description: ''
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

async function generate() {
    if (!form.entity.trim()) return setError('Entity name is required')
    setLoading(true); setError(''); setOutput('')
    try {
      let result
      const apiKey = await window.electronAPI.getApiKey()
      if (!apiKey) {
        // MOCK MODE — no API key needed
        result = getMockOutput(form)
      } else {
        result = await window.electronAPI.generateCode(form)
      }
      setOutput(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function saveFiles() {
    const files = parseFiles(output)
    const folder = await window.electronAPI.saveFiles(files)
    if (folder) alert(`✅ Files saved to: ${folder}`)
  }

  async function saveApiKey() {
    await window.electronAPI.saveApiKey(apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function parseFiles(text) {
    const files = []
    const blocks = text.split(/===\s*(.+?)\s*===/)
    for (let i = 1; i < blocks.length; i += 2) {
      files.push({ name: blocks[i].trim(), content: blocks[i + 1]?.trim() || '' })
    }
    return files
  }
function getMockOutput({ framework, entity, pattern }) {
  if (framework === 'cap') {
    return `=== db/schema.cds ===
namespace com.accenture.codex;

entity ${entity} {
  key ID          : UUID;
  title           : String(100) @title: 'Title';
  description     : String(500) @title: 'Description';
  status          : String(20)  @title: 'Status';
  createdAt       : DateTime;
  createdBy       : String(100);
  modifiedAt      : DateTime;
  modifiedBy      : String(100);
}

=== srv/service.cds ===
using com.accenture.codex from '../db/schema';

@requires: 'authenticated-user'
service ${entity}Service {
  entity ${entity}s as projection on codex.${entity};
}

=== srv/service-handler.js ===
const cds = require('@sap/cds')

module.exports = cds.service.impl(async function() {
  const { ${entity}s } = this.entities

  this.before('CREATE', ${entity}s, async req => {
    if (!req.data.title) {
      req.reject(400, 'Title is required')
    }
  })

  this.after('READ', ${entity}s, (data, req) => {
    return data
  })
})

=== package.json ===
{
  "name": "${entity.toLowerCase()}-service",
  "version": "1.0.0",
  "dependencies": {
    "@sap/cds": "^7.0.0",
    "express": "^4.18.0"
  }
}

=== mta.yaml ===
_schema-version: '3.1'
ID: ${entity.toLowerCase()}-app
version: 1.0.0
modules:
  - name: ${entity.toLowerCase()}-srv
    type: nodejs
    path: gen/srv
    requires:
      - name: ${entity.toLowerCase()}-db
resources:
  - name: ${entity.toLowerCase()}-db
    type: com.sap.xs.hdi-container`
  }

  if (framework === 'rap') {
    return `=== Z${entity.toUpperCase()}_INTF.asddls ===
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@Metadata.ignorePropagatedAnnotations: true
define view entity Z${entity.toUpperCase()}_INTF
  as select from z${entity.toLowerCase()}
{
  key id           as Id,
      title        as Title,
      description  as Description,
      status       as Status,
      created_at   as CreatedAt,
      created_by   as CreatedBy
}

=== Z${entity.toUpperCase()}_BDEF.asbdef ===
managed implementation in class ZBP_${entity.toUpperCase()}_IMPL unique;
strict ( 2 );

define behavior for Z${entity.toUpperCase()}_INTF
persistent table z${entity.toLowerCase()}
{
  create;
  update;
  delete;

  field ( readonly ) Id, CreatedAt, CreatedBy;

  validation validateTitle on save { create; update; }
  determination setStatus on modify { create; }
}

=== ZBP_${entity.toUpperCase()}_IMPL.abap ===
CLASS zbp_${entity.toLowerCase()}_impl DEFINITION
  PUBLIC ABSTRACT FINAL
  FOR BEHAVIOR OF z${entity.toUpperCase()}_intf.

  PUBLIC SECTION.
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zbp_${entity.toLowerCase()}_impl IMPLEMENTATION.
ENDCLASS.`
  }

  if (framework === 'btp') {
    return `=== mta.yaml ===
_schema-version: '3.1'
ID: ${entity.toLowerCase()}-btp-app
version: 1.0.0
modules:
  - name: ${entity.toLowerCase()}-srv
    type: nodejs
    path: srv
    requires:
      - name: ${entity.toLowerCase()}-xsuaa
      - name: ${entity.toLowerCase()}-db

resources:
  - name: ${entity.toLowerCase()}-xsuaa
    type: org.cloudfoundry.managed-service
    parameters:
      service: xsuaa
      service-plan: application
      path: ./xs-security.json
  - name: ${entity.toLowerCase()}-db
    type: com.sap.xs.hdi-container

=== xs-security.json ===
{
  "xsappname": "${entity.toLowerCase()}-app",
  "tenant-mode": "dedicated",
  "scopes": [
    { "name": "$XSAPPNAME.read",  "description": "Read access"  },
    { "name": "$XSAPPNAME.write", "description": "Write access" }
  ],
  "role-templates": [
    {
      "name": "Viewer",
      "scope-references": [ "$XSAPPNAME.read" ]
    },
    {
      "name": "Editor",
      "scope-references": [ "$XSAPPNAME.read", "$XSAPPNAME.write" ]
    }
  ]
}`
  }

  return 'Mock output not available for this framework.'
}
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f4f6f9' }}>

      {/* Sidebar */}
      <div style={{ width: 200, background: '#1a1a2e', color: '#fff', padding: '24px 16px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, color: '#7c6ff7' }}>CodeX</div>
        {['generate', 'settings'].map(t => (
          <div key={t} onClick={() => setTab(t)}
            style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 8, cursor: 'pointer',
              background: tab === t ? '#7c6ff7' : 'transparent', textTransform: 'capitalize' }}>
            {t === 'generate' ? '⚡ Generate' : '⚙️ Settings'}
          </div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {tab === 'generate' && (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Form panel */}
            <div style={{ width: 340, padding: 24, borderRight: '1px solid #ddd', background: '#fff', overflowY: 'auto' }}>
              <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Generate Code</h2>

              <label style={labelStyle}>Framework</label>
              <select value={form.framework} onChange={e => setForm({ ...form, framework: e.target.value })} style={inputStyle}>
                <option value="cap">CAP</option>
                <option value="rap">RAP</option>
                <option value="btp">BTP</option>
              </select>

              <label style={labelStyle}>Entity Name</label>
              <input value={form.entity} onChange={e => setForm({ ...form, entity: e.target.value })}
                placeholder="e.g. SalesOrder" style={inputStyle} />

              <label style={labelStyle}>Pattern</label>
              <select value={form.pattern} onChange={e => setForm({ ...form, pattern: e.target.value })} style={inputStyle}>
                <option value="crud">CRUD</option>
                <option value="draft">Draft Enabled</option>
                <option value="readonly">Read Only</option>
                <option value="integration">Integration</option>
              </select>

              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what this entity does..." rows={4}
                style={{ ...inputStyle, resize: 'vertical' }} />

              {error && <div style={{ color: 'red', fontSize: 13, marginBottom: 10 }}>{error}</div>}

              <button onClick={generate} disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#7c6ff7', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Generating...' : '⚡ Generate'}
              </button>
            </div>

            {/* Output panel */}
            <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0, color: '#1a1a2e' }}>Output</h2>
                {output && (
                  <button onClick={saveFiles}
                    style={{ padding: '8px 16px', background: '#28a745', color: '#fff',
                      border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                    💾 Save Files
                  </button>
                )}
              </div>
              <pre style={{ flex: 1, background: '#1e1e2e', color: '#cdd6f4', padding: 16,
                borderRadius: 8, overflow: 'auto', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {output || 'Your generated code will appear here...'}
              </pre>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ padding: 32, maxWidth: 500 }}>
            <h2 style={{ color: '#1a1a2e' }}>⚙️ Settings</h2>
            <label style={labelStyle}>Anthropic API Key</label>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..." style={inputStyle} />
            <button onClick={saveApiKey}
              style={{ padding: '10px 20px', background: '#7c6ff7', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 8 }}>
              {saved ? '✅ Saved!' : 'Save API Key'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, marginTop: 14, color: '#444' }
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 13, boxSizing: 'border-box' }