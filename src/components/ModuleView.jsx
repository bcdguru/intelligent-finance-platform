import { useState } from 'react'
import { Grid, Column, Tag, Button, Tile } from '@carbon/react'
import { Launch, ChevronRight, ArrowRight } from '@carbon/icons-react'
import ArchitectureMatrix from './ArchitectureMatrix'
import KpiPanel from './KpiPanel'
import PersonaSidebar from './PersonaSidebar'
import SkillsPanel from './SkillsPanel'
import MetricsBar from './MetricsBar'
import ControllerWorkbench from './workbenches/ControllerWorkbench'

const WORKBENCH_TRIGGERS = new Set([
  'Controller Workbench', 'Journal Advisor', 'Audit Agent',
  'Treasurer Workbench', 'Capital Workbench', 'Journal Workbench',
])

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
    if (WORKBENCH_TRIGGERS.has(name)) setOpenWorkbench('controller')
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#f4f4f4' }}>
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
          borderBottom: '1px solid #e0e0e0',
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
              <span style={{ fontSize: 16, fontWeight: 600, color: '#161616' }}>
                {module.fullName}
              </span>
              <span style={{ fontSize: 12, color: '#8d8d8d' }}>·</span>
              <span style={{ fontSize: 12, color: '#525252' }}>{module.tagline}</span>
              {isLive ? (
                <Tag type="green" size="sm">Wave 1 · Live</Tag>
              ) : (
                <Tag type="blue" size="sm">Wave {module.wave} · Weeks {(module.wave - 1) * 12 + 1}–{module.wave * 12}</Tag>
              )}
            </div>
            {isLive && (
              <Button
                size="sm"
                kind="primary"
                renderIcon={Launch}
                onClick={() => setOpenWorkbench('controller')}
                style={{ background: module.color, borderColor: module.color }}
              >
                Controller Workbench
              </Button>
            )}
          </div>

          {/* Metric strip */}
          <MetricsBar metrics={metrics} color={module.color} />
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          <Grid fullWidth condensed style={{ gap: '1rem' }}>
            {/* Architecture matrix */}
            <Column lg={13} md={6} sm={4}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                marginBottom: '1rem',
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#161616', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Reference Architecture — {module.label}
                  </span>
                  <span style={{ fontSize: 11, color: '#8d8d8d' }}>
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
      {openWorkbench === 'controller' && !isLive && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tile style={{ maxWidth: 400, textAlign: 'center', padding: '2rem' }} className="slide-in">
            <div style={{ fontSize: 32, marginBottom: '1rem' }}>⬡</div>
            <h2 style={{ marginBottom: '0.5rem' }}>{module.label} Workbench</h2>
            <p style={{ color: '#525252', marginBottom: '1.5rem' }}>
              Available in Wave {module.wave} · Weeks {(module.wave - 1) * 12 + 1}–{module.wave * 12}
            </p>
            <Button kind="primary" onClick={() => setOpenWorkbench(null)}>Close</Button>
          </Tile>
        </div>
      )}
    </div>
  )
}
