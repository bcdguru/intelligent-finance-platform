import { useState } from 'react'
import { Grid, Column, Tag, Button, Tile } from '@carbon/react'
import { Launch } from '@carbon/icons-react'
import ArchitectureMatrix from './ArchitectureMatrix'
import KpiPanel from './KpiPanel'
import PersonaSidebar from './PersonaSidebar'
import SkillsPanel from './SkillsPanel'
import MetricsBar from './MetricsBar'
import ControllerWorkbench from './workbenches/ControllerWorkbench'
import FluxAgentWorkbench from './workbenches/FluxAgentWorkbench'
import ARWorkbench from './workbenches/ARWorkbench'
import CollectionsWorkbench from './workbenches/CollectionsWorkbench'
import CashLiquidityWorkbench from './workbenches/CashLiquidityWorkbench'
import JournalWorkbench from './workbenches/JournalWorkbench'
import CapitalWorkbench from './workbenches/CapitalWorkbench'

const C = {
  navy: '#1e293b', teal: '#0891b2', bg: '#f8fafc',
  border: '#e2e8f0', text: '#1e293b', sub: '#64748b', muted: '#94a3b8',
}

const WORKBENCH_MAP = {
  'Controller Workbench':  'controller',
  'Journal Advisor':       'controller',
  'Audit Agent':           'controller',
  'Treasurer Workbench':   'treasury',
  'Capital Workbench':     'capital',
  'Journal Workbench':     'journal',
  'Flux Workbench':        'flux',
  'AR Director Workbench': 'ar',
  'Collections Workbench': 'collections',
}

const MODULE_METRICS = {
  r2r: [
    { label: 'Close Cycle',   value: '3.2 days', delta: '−1.8d', up: false },
    { label: 'Journal STP',   value: '91%',       delta: '+14%',  up: true  },
    { label: 'Recon Rate',    value: '99.4%',     delta: '+2.1%', up: true  },
    { label: 'Control Hits',  value: '0',         delta: '−3',    up: false },
  ],
  o2c: [
    { label: 'DSO',           value: '32 days',   delta: '−8d',   up: false },
    { label: 'Auto-match',    value: '78%',       delta: '+23%',  up: true  },
    { label: 'Billing STP',   value: '84%',       delta: '+11%',  up: true  },
    { label: 'RevRec Issues', value: '0',         delta: '−2',    up: false },
  ],
  s2p: [
    { label: 'Touchless AP',  value: '43%',       delta: '+18%',  up: true  },
    { label: 'DPO',           value: '47 days',   delta: '+5d',   up: true  },
    { label: 'Dup. Invoices', value: '0.03%',     delta: '−0.08%',up: false },
    { label: 'Supplier Risk', value: '2 alerts',  delta: '−6',    up: false },
  ],
  fpa: [
    { label: 'Forecast MAPE', value: '4.2%',      delta: '−3.1%', up: false },
    { label: 'Board Pack',    value: '<24h',       delta: '−3d',   up: false },
    { label: 'Reforecast',    value: 'Real-time',  delta: 'New',   up: true  },
    { label: 'No-touch Rpts', value: '87%',        delta: '+62%',  up: true  },
  ],
}

export default function ModuleView({ module, onModuleChange }) {
  const [activePersona, setActivePersona] = useState(module.personas[0]?.id)
  const [openWorkbench, setOpenWorkbench] = useState(null)
  const isLive = module.wave === 1
  const metrics = MODULE_METRICS[module.id] || []

  const handleWorkbenchClick = (name) => {
    const target = WORKBENCH_MAP[name]
    if (target) setOpenWorkbench(target)
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: C.bg }}>
      {/* Persona sidebar */}
      <PersonaSidebar
        module={module}
        activePersona={activePersona}
        onPersonaSelect={setActivePersona}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Module banner */}
        <div style={{
          background: '#ffffff',
          borderBottom: `1px solid ${C.border}`,
          padding: '0.875rem 1.5rem',
          flexShrink: 0,
        }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: module.color, flexShrink: 0,
              }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>
                {module.fullName}
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>·</span>
              <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>{module.tagline}</span>
              {isLive ? (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                  background: 'rgba(5,150,105,0.1)', color: '#059669',
                  border: '1px solid rgba(5,150,105,0.25)',
                }}>Wave 1 · Live</span>
              ) : (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                  background: 'rgba(8,145,178,0.1)', color: C.teal,
                  border: '1px solid rgba(8,145,178,0.25)',
                }}>Wave {module.wave} · Weeks {(module.wave - 1) * 12 + 1}–{module.wave * 12}</span>
              )}
            </div>
            {isLive && (
              <button
                onClick={() => setOpenWorkbench('controller')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 6,
                  background: module.color, color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              >
                <Launch size={14} />
                Controller Workbench
              </button>
            )}
          </div>

          {/* Metric strip */}
          <MetricsBar metrics={metrics} color={module.color} />
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', background: C.bg }}>
          <Grid fullWidth condensed style={{ gap: '1rem' }}>
            {/* Architecture matrix */}
            <Column lg={13} md={6} sm={4}>
              <div style={{
                background: '#ffffff',
                border: `1px solid ${C.border}`,
                borderTop: `3px solid ${module.color}`,
                borderRadius: 6,
                marginBottom: '1rem',
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Reference Architecture — {module.label}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>
                    Continuous Accounting from Periodic Book Close
                  </span>
                </div>
                <div style={{ padding: '0.75rem', overflowX: 'auto' }}>
                  <ArchitectureMatrix module={module} onWorkbenchClick={handleWorkbenchClick} />
                </div>
              </div>
              <SkillsPanel module={module} />
            </Column>

            {/* KPI panel */}
            <Column lg={3} md={2} sm={4}>
              <KpiPanel kpis={module.kpis} color={module.color} />
            </Column>
          </Grid>
        </div>
      </div>

      {/* Workbench overlay */}
      {openWorkbench === 'controller' && isLive && (
        <ControllerWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'flux' && (
        <FluxAgentWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'ar' && (
        <ARWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'collections' && (
        <CollectionsWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'treasury' && (
        <CashLiquidityWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'journal' && (
        <JournalWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'capital' && (
        <CapitalWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'controller' && !isLive && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
          zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, maxWidth: 400, width: '90%',
            textAlign: 'center', padding: '2.5rem 2rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            borderTop: `4px solid ${module.color}`,
          }} className="slide-in">
            <div style={{ fontSize: 36, marginBottom: '1rem' }}>⬡</div>
            <h2 style={{ marginBottom: '0.5rem', color: C.text, fontSize: 18, fontWeight: 700 }}>
              {module.label} Workbench
            </h2>
            <p style={{ color: C.sub, marginBottom: '1.5rem', fontSize: 13 }}>
              Available in Wave {module.wave} · Weeks {(module.wave - 1) * 12 + 1}–{module.wave * 12}
            </p>
            <button
              onClick={() => setOpenWorkbench(null)}
              style={{
                padding: '8px 24px', borderRadius: 6,
                background: C.navy, color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
