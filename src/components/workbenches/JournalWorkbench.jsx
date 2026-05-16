import { useState } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close, CheckmarkFilled, Play, Pause, WarningAlt } from '@carbon/icons-react'

const C = {
  blue:   '#0072c3',
  green:  '#24a148',
  red:    '#da1e28',
  amber:  '#f1c21b',
  purple: '#6929c4',
  navy:   '#0E2841',
  slate:  '#525252',
  muted:  '#8d8d8d',
  bg:     '#f4f4f4',
  border: '#e0e0e0',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PIPELINE = [
  { id: 'JE-2025-0850', type: 'Depreciation',          entity: 'Corp HQ',      amount: 284750,  method: 'Auto',      status: 'posted',    risk: 'low',    preparer: 'System',       age: '1h ago'  },
  { id: 'JE-2025-0849', type: 'Payroll Accrual',        entity: 'All Entities', amount: 1250000, method: 'Auto',      status: 'posted',    risk: 'low',    preparer: 'System',       age: '1h ago'  },
  { id: 'JE-2025-0848', type: 'Lease Liability (IFRS)', entity: 'Corp HQ',      amount: 45200,   method: 'Auto',      status: 'posted',    risk: 'low',    preparer: 'System',       age: '2h ago'  },
  { id: 'JE-2025-0847', type: 'SaaS Subscription Accrual', entity: 'Corp HQ', amount: 142500,  method: 'Manual',    status: 'approved',  risk: 'low',    preparer: 'K. Patel',     age: '2h ago'  },
  { id: 'JE-2025-0846', type: 'Marketing Reclassification', entity: 'Corp HQ', amount: 38200,  method: 'Manual',    status: 'pending',   risk: 'medium', preparer: 'A. Rodriguez', age: '3h ago'  },
  { id: 'JE-2025-0845', type: 'Fixed Asset Write-off',  entity: 'EMEA',         amount: 18500,   method: 'Manual',    status: 'pending',   risk: 'medium', preparer: 'M. Lee',       age: '4h ago'  },
  { id: 'JE-2025-0844', type: 'Revenue Deferral',       entity: 'Corp HQ',      amount: 97000,   method: 'Auto',      status: 'posted',    risk: 'low',    preparer: 'System',       age: '5h ago'  },
  { id: 'JE-2025-0843', type: 'IC Management Fee',      entity: 'IC Corp→Sub',  amount: 52500,   method: 'Manual',    status: 'pending',   risk: 'high',   preparer: 'T. Nguyen',    age: '6h ago'  },
  { id: 'JE-2025-0842', type: 'AP Month-end Accrual',   entity: 'Corp HQ',      amount: 320000,  method: 'Auto',      status: 'posted',    risk: 'low',    preparer: 'System',       age: '6h ago'  },
  { id: 'JE-2025-0841', type: 'Commission Accrual',     entity: 'Sales Org',    amount: 312000,  method: 'Manual',    status: 'pending',   risk: 'low',    preparer: 'Sales Ops',    age: '7h ago'  },
  { id: 'JE-2025-0840', type: 'FX Revaluation',         entity: 'EMEA',         amount: 8900,    method: 'Scheduled', status: 'scheduled', risk: 'low',    preparer: 'System',       age: 'May 31'  },
  { id: 'JE-2025-0839', type: 'Bonus Accrual Q2',       entity: 'All Entities', amount: 425000,  method: 'Manual',    status: 'failed',    risk: 'high',   preparer: 'D. Kim',       age: '8h ago'  },
  { id: 'JE-2025-0838', type: 'Tax Provision',          entity: 'Corp HQ',      amount: 890000,  method: 'Manual',    status: 'scheduled', risk: 'low',    preparer: 'Tax Team',     age: 'May 31'  },
  { id: 'JE-2025-0837', type: 'Goodwill Assessment',    entity: 'Corp HQ',      amount: 0,       method: 'Manual',    status: 'scheduled', risk: 'low',    preparer: 'CFO Office',   age: 'May 31'  },
]

const RULES = [
  { id: 'APR-001', name: 'Depreciation — All Entities',       journalType: 'Depreciation',        source: 'Fixed Assets Module', threshold: 'Any amount',  conditions: 'FA batch reconciled · zero exceptions',            status: 'active',  lastRun: '1h ago',     applied: 4  },
  { id: 'APR-002', name: 'Payroll Accrual',                   journalType: 'Payroll Accrual',      source: 'HR System',           threshold: '≤ $2M / run', conditions: 'HR sign-off present · within 5% of prior month',   status: 'active',  lastRun: '1h ago',     applied: 1  },
  { id: 'APR-003', name: 'Lease Liability (IFRS 16)',         journalType: 'Lease Liability',      source: 'Lease Module',        threshold: 'Any amount',  conditions: 'Lease contract active · rate unchanged',           status: 'active',  lastRun: '2h ago',     applied: 4  },
  { id: 'APR-004', name: 'Revenue Deferral Auto-release',     journalType: 'Revenue Deferral',     source: 'CRM / Contract',      threshold: '≤ $500K / JE',conditions: 'ASC 606 milestone met · contract active',          status: 'active',  lastRun: '5h ago',     applied: 8  },
  { id: 'APR-005', name: 'AP Month-end Accrual',              journalType: 'AP Accrual',           source: 'AP Sub-ledger',       threshold: '≤ $1M',       conditions: 'Subledger reconciled · vendor invoice present',    status: 'active',  lastRun: '6h ago',     applied: 12 },
  { id: 'APR-006', name: 'Intercompany — Below Threshold',    journalType: 'Intercompany',         source: 'IC Agreement',        threshold: '< $25K / JE', conditions: 'IC agreement signed · elimination confirmed',      status: 'paused',  lastRun: '1d ago',     applied: 0  },
  { id: 'APR-007', name: 'FX Revaluation',                    journalType: 'FX Revaluation',       source: 'Treasury System',     threshold: 'Any amount',  conditions: 'Month-end rate loaded · net exposure < $10M',      status: 'active',  lastRun: 'EOM sched.', applied: 0  },
]

const ACCRUALS = [
  { id: 'ACC-001', name: 'SaaS Subscription Accruals',  freq: 'Monthly',    amount: 142500,  nextRun: 'May 31', reversal: 'Jun 1',  status: 'posted',    source: 'AP',          control: 'GL-CTL-0041' },
  { id: 'ACC-002', name: 'Bonus Accrual',               freq: 'Monthly',    amount: 425000,  nextRun: 'May 31', reversal: 'None',   status: 'failed',    source: 'HR Comp',     control: 'GL-CTL-0055' },
  { id: 'ACC-003', name: 'Rent & Occupancy',            freq: 'Monthly',    amount: 162000,  nextRun: 'May 31', reversal: 'Jun 1',  status: 'posted',    source: 'Lease Mgr',   control: 'GL-CTL-0033' },
  { id: 'ACC-004', name: 'Professional Services',       freq: 'Monthly',    amount: 85000,   nextRun: 'May 31', reversal: 'Jun 1',  status: 'scheduled', source: 'AP',          control: 'GL-CTL-0039' },
  { id: 'ACC-005', name: 'Commission Accrual',          freq: 'Monthly',    amount: 312000,  nextRun: 'May 31', reversal: 'None',   status: 'scheduled', source: 'Sales Ops',   control: 'GL-CTL-0047' },
  { id: 'ACC-006', name: 'R&D Capitalisation',         freq: 'Quarterly',  amount: 2100000, nextRun: 'Jun 30', reversal: 'None',   status: 'scheduled', source: 'R&D Finance', control: 'GL-CTL-0060' },
  { id: 'ACC-007', name: 'Tax Provision',               freq: 'Monthly',    amount: 890000,  nextRun: 'May 31', reversal: 'None',   status: 'scheduled', source: 'Tax Team',    control: 'GL-CTL-0070' },
  { id: 'ACC-008', name: 'Warranty Reserve',            freq: 'Quarterly',  amount: 145000,  nextRun: 'Jun 30', reversal: 'None',   status: 'scheduled', source: 'Operations',  control: 'GL-CTL-0061' },
]

const CLOSE_STEPS = [
  { step: 1,  name: 'Sub-ledger Feeds',       type: 'system', status: 'done',      dep: null,     journals: 48, auto: 48, note: 'AP, AR, FA, Payroll feeds complete'        },
  { step: 2,  name: 'Depreciation Run',       type: 'auto',   status: 'done',      dep: '1',      journals: 4,  auto: 4,  note: 'Batch D-2025-05 · all entities'             },
  { step: 3,  name: 'Lease Accounting',       type: 'auto',   status: 'done',      dep: '1',      journals: 4,  auto: 4,  note: 'IFRS 16 · 4 leases'                         },
  { step: 4,  name: 'Revenue Recognition',    type: 'auto',   status: 'done',      dep: '1',      journals: 8,  auto: 8,  note: 'ASC 606 milestones processed'               },
  { step: 5,  name: 'Payroll Accruals',       type: 'auto',   status: 'done',      dep: '1',      journals: 1,  auto: 1,  note: 'HR sign-off received · posted'              },
  { step: 6,  name: 'AP Month-end Accruals',  type: 'auto',   status: 'done',      dep: '1, 5',   journals: 12, auto: 12, note: 'Subledger reconciled · auto-posted'         },
  { step: 7,  name: 'Manual JE Review',       type: 'manual', status: 'active',    dep: '6',      journals: 8,  auto: 0,  note: '4 approved · 4 pending'                     },
  { step: 8,  name: 'Intercompany Netting',   type: 'manual', status: 'pending',   dep: '7',      journals: 6,  auto: 2,  note: 'Waiting on Step 7'                          },
  { step: 9,  name: 'FX Revaluation',         type: 'auto',   status: 'scheduled', dep: '8',      journals: 3,  auto: 3,  note: 'Scheduled: May 31 EOM'                      },
  { step: 10, name: 'Consolidation Journals', type: 'manual', status: 'scheduled', dep: '9',      journals: 12, auto: 0,  note: 'Corp FP&A · Day 5'                          },
  { step: 11, name: 'Tax Provision',          type: 'manual', status: 'scheduled', dep: '10',     journals: 2,  auto: 0,  note: 'Tax team · Day 5'                           },
  { step: 12, name: 'Final TB Lock',          type: 'system', status: 'scheduled', dep: '11',     journals: 0,  auto: 0,  note: 'ERP period lock · Day 5 EOD'                },
]

const TABS = ['Journal Pipeline', 'Auto-Post Rules', 'Accrual Engine', 'Close Sequence']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n === 0) return '—'
  return n >= 1000000
    ? `$${(n / 1000000).toFixed(2)}M`
    : `$${(n / 1000).toFixed(0)}K`
}

function StatusTag({ status }) {
  const map = {
    posted:    { type: 'green',     label: 'Posted'    },
    approved:  { type: 'blue',      label: 'Approved'  },
    pending:   { type: 'warm-gray', label: 'Pending'   },
    failed:    { type: 'red',       label: 'Failed'    },
    scheduled: { type: 'gray',      label: 'Scheduled' },
  }
  const t = map[status] || map.pending
  return <Tag type={t.type} size="sm">{t.label}</Tag>
}

function MethodBadge({ method }) {
  const colors = { Auto: C.green, Manual: C.blue, Scheduled: C.slate }
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10,
      background: `${colors[method]}18`, color: colors[method],
      border: `1px solid ${colors[method]}40`, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>{method}</span>
  )
}

function RiskDot({ risk }) {
  const colors = { low: C.green, medium: C.amber, high: C.red }
  return (
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors[risk] || C.green, display: 'inline-block', flexShrink: 0 }} />
  )
}

function SectionHeader({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
      {children}
    </div>
  )
}

function KPICard({ label, value, sub, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, background: '#fff',
      border: `1px solid ${C.border}`, borderTop: `3px solid ${color}`,
      borderRadius: 4, padding: '0.625rem 1rem',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ─── Tab: Journal Pipeline ────────────────────────────────────────────────────

const PIPELINE_FILTERS = ['All', 'Auto-Posted', 'Manual', 'Scheduled', 'Exceptions']

function PipelineTab() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(new Set())

  const visible = PIPELINE.filter(j => {
    if (filter === 'Auto-Posted') return j.method === 'Auto'
    if (filter === 'Manual')      return j.method === 'Manual'
    if (filter === 'Scheduled')   return j.status === 'scheduled'
    if (filter === 'Exceptions')  return j.status === 'failed' || j.risk === 'high'
    return true
  })

  const autoPosted = PIPELINE.filter(j => j.status === 'posted' && j.method === 'Auto').length
  const pending    = PIPELINE.filter(j => j.status === 'pending').length
  const failed     = PIPELINE.filter(j => j.status === 'failed').length
  const stpPct     = Math.round((autoPosted / PIPELINE.length) * 100)

  const toggleAll = () => {
    const pendingIds = visible.filter(j => j.status === 'pending').map(j => j.id)
    if (pendingIds.every(id => selected.has(id))) setSelected(new Set())
    else setSelected(new Set(pendingIds))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* KPI strip */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="Journal STP Rate" value={`${stpPct}%`} sub={`${autoPosted} of ${PIPELINE.length} straight-through`} color={C.green} />
        <KPICard label="Auto-Posted"      value={autoPosted}   sub="No human touch required"                                  color={C.blue}  />
        <KPICard label="Pending Review"   value={pending}      sub="Awaiting controller approval"                             color={C.amber} />
        <KPICard label="Exceptions"       value={failed}       sub="Failed posting — action required"                         color={C.red}   />
      </div>

      {/* Filter bar + bulk action */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <div style={{ padding: '0.625rem 1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {PIPELINE_FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '3px 10px', fontSize: 11, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: filter === f ? C.blue : '#e0e0e0',
                color: filter === f ? '#fff' : C.slate,
                fontWeight: filter === f ? 700 : 400, fontFamily: 'inherit',
              }}>{f}</button>
            ))}
          </div>
          {selected.size > 0 && (
            <Button size="sm" kind="primary" renderIcon={CheckmarkFilled}>
              Approve {selected.size} selected
            </Button>
          )}
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: `1px solid ${C.border}` }}>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.06em', width: 28 }}>
                <input type="checkbox" onChange={toggleAll} style={{ cursor: 'pointer' }}
                  checked={visible.filter(j => j.status === 'pending').every(j => selected.has(j.id)) && visible.some(j => j.status === 'pending')} />
              </th>
              {['Journal ID', 'Type', 'Entity', 'Amount', 'Method', 'Status', 'Preparer', 'Age'].map(h => (
                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((j, i) => (
              <tr key={j.id} onClick={() => {
                if (j.status !== 'pending') return
                setSelected(s => { const n = new Set(s); n.has(j.id) ? n.delete(j.id) : n.add(j.id); return n })
              }} style={{
                borderBottom: `1px solid ${C.border}`,
                background: selected.has(j.id) ? '#edf5ff' : i % 2 === 0 ? '#fff' : '#fafafa',
                cursor: j.status === 'pending' ? 'pointer' : 'default',
              }}>
                <td style={{ padding: '0.5rem 0.75rem' }}>
                  {j.status === 'pending' && (
                    <input type="checkbox" checked={selected.has(j.id)} onChange={() => {}}
                      style={{ cursor: 'pointer' }} />
                  )}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: C.purple, fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <RiskDot risk={j.risk} />
                    {j.id}
                  </div>
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#161616', maxWidth: 180, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{j.type}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: C.slate, fontSize: 11 }}>{j.entity}</td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'right' }}>{fmt(j.amount)}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}><MethodBadge method={j.method} /></td>
                <td style={{ padding: '0.5rem 0.75rem' }}><StatusTag status={j.status} /></td>
                <td style={{ padding: '0.5rem 0.75rem', color: C.slate }}>{j.preparer}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: C.muted, fontSize: 11 }}>{j.age}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: '0.5rem 1rem', borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>
          {visible.length} journals · Total value: {fmt(visible.reduce((s, j) => s + j.amount, 0))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Auto-Post Rules ─────────────────────────────────────────────────────

function RulesTab() {
  const [rules, setRules] = useState(RULES.map(r => ({ ...r })))

  const toggle = (id) => setRules(rs => rs.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r))

  const active = rules.filter(r => r.status === 'active').length
  const totalApplied = rules.reduce((s, r) => s + r.applied, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="Active Rules"    value={active}        sub={`${rules.length - active} paused`} color={C.green} />
        <KPICard label="JEs Auto-posted" value={totalApplied}  sub="This close period"                 color={C.blue}  />
        <KPICard label="STP Contribution" value="91%"          sub="Journals bypassing manual review"  color={C.blue}  />
        <KPICard label="Rules Reviewed"  value="7 / 7"         sub="Last reviewed: May 1 2025"         color={C.green} />
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: `1px solid ${C.border}` }}>
              {['Rule ID', 'Name', 'Journal Type', 'Source', 'Threshold', 'Auto-Post Conditions', 'Applied', 'Last Run', 'Status'].map(h => (
                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: C.purple, fontSize: 11 }}>{r.id}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontWeight: 600, color: '#161616', whiteSpace: 'nowrap' }}>{r.name}</td>
                <td style={{ padding: '0.625rem 0.75rem', color: C.slate }}>{r.journalType}</td>
                <td style={{ padding: '0.625rem 0.75rem', color: C.slate, fontSize: 11 }}>{r.source}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}>{r.threshold}</td>
                <td style={{ padding: '0.625rem 0.75rem', color: C.slate, fontSize: 11, maxWidth: 240 }}>{r.conditions}</td>
                <td style={{ padding: '0.625rem 0.75rem', textAlign: 'center', fontWeight: 700, color: r.applied > 0 ? C.green : C.muted }}>{r.applied}</td>
                <td style={{ padding: '0.625rem 0.75rem', color: C.muted, fontSize: 11, whiteSpace: 'nowrap' }}>{r.lastRun}</td>
                <td style={{ padding: '0.625rem 0.75rem' }}>
                  <button onClick={() => toggle(r.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    background: r.status === 'active' ? `${C.green}18` : `${C.amber}18`,
                    color: r.status === 'active' ? C.green : C.amber, fontSize: 11, fontWeight: 600,
                  }}>
                    {r.status === 'active' ? <><Play size={10} /> Active</> : <><Pause size={10} /> Paused</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Tab: Accrual Engine ──────────────────────────────────────────────────────

function AccrualTab() {
  const totalPosted    = ACCRUALS.filter(a => a.status === 'posted').reduce((s, a) => s + a.amount, 0)
  const totalScheduled = ACCRUALS.filter(a => a.status === 'scheduled').reduce((s, a) => s + a.amount, 0)
  const totalFailed    = ACCRUALS.filter(a => a.status === 'failed').reduce((s, a) => s + a.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="Posted This Period" value={fmt(totalPosted)}    sub={`${ACCRUALS.filter(a => a.status === 'posted').length} accruals`}    color={C.green} />
        <KPICard label="Scheduled (EOM)"    value={fmt(totalScheduled)} sub={`${ACCRUALS.filter(a => a.status === 'scheduled').length} accruals`} color={C.blue}  />
        <KPICard label="Failed"             value={fmt(totalFailed)}    sub="Needs manual intervention"                                             color={C.red}   />
        <KPICard label="Auto-reversal"      value={`${ACCRUALS.filter(a => a.reversal !== 'None').length} / ${ACCRUALS.length}`} sub="Have auto-reversal scheduled" color={C.green} />
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: `1px solid ${C.border}` }}>
              {['ID', 'Accrual Name', 'Frequency', 'Amount', 'Next Run', 'Reversal', 'Source', 'Control', 'Status'].map(h => (
                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACCRUALS.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: C.purple, fontSize: 11 }}>{a.id}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontWeight: 600, color: '#161616' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {a.status === 'failed' && <WarningAlt size={14} color={C.red} />}
                    {a.name}
                  </div>
                </td>
                <td style={{ padding: '0.625rem 0.75rem' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
                    background: a.freq === 'Monthly' ? '#edf5ff' : '#f4f0ff',
                    color: a.freq === 'Monthly' ? C.blue : C.purple,
                  }}>{a.freq}</span>
                </td>
                <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'right' }}>{fmt(a.amount)}</td>
                <td style={{ padding: '0.625rem 0.75rem', color: C.slate, fontSize: 11 }}>{a.nextRun}</td>
                <td style={{ padding: '0.625rem 0.75rem', color: a.reversal === 'None' ? C.muted : C.green, fontSize: 11 }}>{a.reversal}</td>
                <td style={{ padding: '0.625rem 0.75rem', color: C.slate, fontSize: 11 }}>{a.source}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: C.purple, fontSize: 10 }}>{a.control}</td>
                <td style={{ padding: '0.625rem 0.75rem' }}><StatusTag status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '0.5rem 1rem', borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>
          Total period accruals: {fmt(ACCRUALS.reduce((s, a) => s + a.amount, 0))} · {ACCRUALS.filter(a => a.reversal !== 'None').length} with auto-reversal scheduled
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Close Sequence ──────────────────────────────────────────────────────

const STEP_COLORS = { done: C.green, active: C.blue, pending: C.amber, scheduled: C.muted }
const STEP_BG     = { done: '#defbe6', active: '#edf5ff', pending: '#fff1e8', scheduled: '#f4f4f4' }
const TYPE_COLORS = { system: C.purple, auto: C.green, manual: C.blue }

function CloseSequenceTab() {
  const done = CLOSE_STEPS.filter(s => s.status === 'done').length
  const totalJournals = CLOSE_STEPS.reduce((s, st) => s + st.journals, 0)
  const totalAuto     = CLOSE_STEPS.reduce((s, st) => s + st.auto, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="Steps Complete"    value={`${done} / ${CLOSE_STEPS.length}`} sub="Day 3 of 5 close"           color={C.green} />
        <KPICard label="Total Journals"    value={totalJournals}                      sub="Across all close steps"     color={C.blue}  />
        <KPICard label="Auto-posted"       value={totalAuto}                          sub={`${Math.round(totalAuto/totalJournals*100)}% no-touch rate`} color={C.green} />
        <KPICard label="Pending / Blocked" value={CLOSE_STEPS.filter(s => s.status === 'pending' || s.status === 'active').length} sub="Steps in progress or waiting" color={C.amber} />
      </div>

      {/* Progress bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#161616' }}>Overall close progress</span>
          <span style={{ fontSize: 11, color: C.slate }}>{Math.round(done / CLOSE_STEPS.length * 100)}%</span>
        </div>
        <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${done / CLOSE_STEPS.length * 100}%`, background: C.green, borderRadius: 3, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: '0.75rem' }}>
          {CLOSE_STEPS.map(s => (
            <div key={s.step} title={s.name} style={{
              flex: 1, height: 8, borderRadius: 2,
              background: STEP_BG[s.status], border: `1px solid ${STEP_COLORS[s.status]}40`,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {[['done', 'Complete'], ['active', 'In Progress'], ['pending', 'Blocked'], ['scheduled', 'Scheduled']].map(([k, l]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.slate }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: STEP_COLORS[k] }} />{l}
            </span>
          ))}
        </div>
      </div>

      {/* Steps list */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        {CLOSE_STEPS.map((s, i) => (
          <div key={s.step} style={{
            display: 'flex', alignItems: 'flex-start', gap: '1rem',
            padding: '0.75rem 1rem',
            borderBottom: i < CLOSE_STEPS.length - 1 ? `1px solid ${C.border}` : 'none',
            background: s.status === 'active' ? '#edf5ff' : 'transparent',
          }}>
            {/* Step number + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: STEP_BG[s.status], border: `2px solid ${STEP_COLORS[s.status]}`,
                fontSize: 11, fontWeight: 700, color: STEP_COLORS[s.status],
              }}>{s.step}</div>
              {i < CLOSE_STEPS.length - 1 && (
                <div style={{ width: 2, height: 12, background: s.status === 'done' ? C.green : C.border, marginTop: 2 }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#161616' }}>{s.name}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                  background: `${TYPE_COLORS[s.type]}15`, color: TYPE_COLORS[s.type],
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>{s.type}</span>
                {s.status === 'active' && <Tag type="blue" size="sm">In Progress</Tag>}
                {s.status === 'done'   && <Tag type="green" size="sm">Done ✓</Tag>}
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>{s.note}</div>
              {s.dep && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Depends on: Step {s.dep}</div>}
            </div>

            {/* Journal counts */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#161616' }}>{s.journals}</div>
              <div style={{ fontSize: 10, color: C.muted }}>journals</div>
              {s.journals > 0 && (
                <div style={{ fontSize: 10, color: s.auto === s.journals ? C.green : C.blue, marginTop: 2 }}>
                  {s.auto}/{s.journals} auto
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Workbench ───────────────────────────────────────────────────────────

export default function JournalWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: '#f4f4f4' }}>

      {/* Header */}
      <div style={{
        background: '#0E2841', borderBottom: '1px solid #393939',
        padding: '0.875rem 1.5rem', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#156082', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>⬡</div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Journal Workbench</div>
            <div style={{ color: '#8d8d8d', fontSize: 11, marginTop: 1 }}>General Accounting — Orchestration · May 2025 · R2R Wave 1</div>
          </div>
          <Tag type="green" size="sm">Live</Tag>
        </div>
        <Button size="sm" kind="ghost" renderIcon={Close} iconDescription="Close" hasIconOnly onClick={onClose} />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: '0.625rem 1.25rem', fontSize: 12, border: 'none', cursor: 'pointer',
            background: 'transparent', whiteSpace: 'nowrap', fontFamily: 'inherit',
            fontWeight: activeTab === i ? 700 : 500,
            color: activeTab === i ? C.blue : C.slate,
            borderBottom: activeTab === i ? `2px solid ${C.blue}` : '2px solid transparent',
          }}>{t}</button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
        {activeTab === 0 && <PipelineTab />}
        {activeTab === 1 && <RulesTab />}
        {activeTab === 2 && <AccrualTab />}
        {activeTab === 3 && <CloseSequenceTab />}
      </div>
    </div>
  )
}
