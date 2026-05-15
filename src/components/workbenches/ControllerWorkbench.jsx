import { useState } from 'react'
import {
  Button, Tag, Tile, ProgressBar,
  Accordion, AccordionItem,
  StructuredListWrapper, StructuredListHead, StructuredListBody,
  StructuredListRow, StructuredListCell,
  Modal, Search, InlineNotification,
  Grid, Column,
} from '@carbon/react'
import {
  Close, Security, CheckmarkFilled, Search as SearchIcon,
  ArrowUp, ArrowDown, Launch,
} from '@carbon/icons-react'

// ─── Demo data ────────────────────────────────────────────────────────────────

const CLOSE_TASKS = [
  { label: 'Sub-ledger Close',  pct: 83,  eta: 'ETA 4 pm',    risk: 'amber', owner: 'AP / AR Team'  },
  { label: 'Journal Entries',   pct: 91,  eta: 'ETA 2 pm',    risk: 'green', owner: 'GL Team'       },
  { label: 'Reconciliations',   pct: 75,  eta: 'ETA 6 pm',    risk: 'red',   owner: 'GL Team'       },
  { label: 'Flux Review',       pct: 60,  eta: 'Day 4',       risk: 'amber', owner: 'Controller'    },
  { label: 'Control Sign-offs', pct: 100, eta: 'Done',        risk: 'green', owner: 'Compliance'    },
  { label: 'Consolidation',     pct: 0,   eta: 'Day 5',       risk: 'green', owner: 'Corp FP&A'     },
]

const SUBLEDGER_STATUS = [
  { name: 'AP',           status: 'green' },
  { name: 'AR',           status: 'green' },
  { name: 'Fixed Assets', status: 'amber' },
  { name: 'Inventory',    status: 'green' },
  { name: 'Payroll',      status: 'red'   },
  { name: 'Intercompany', status: 'green' },
]

const AGENT_LOG = [
  { time: '09:16', kind: 'success', msg: 'JE-2025-0847 approved and posted to GL', agent: 'Journal Advisor'    },
  { time: '09:14', kind: 'info',    msg: 'Flux narratives generated for 6 accounts', agent: 'Flux Agent'        },
  { time: '09:10', kind: 'warning', msg: 'Fixed Asset recon break: $3,840 — investigating', agent: 'Recon Agent' },
  { time: '08:58', kind: 'success', msg: 'Bank ↔ Cash GL reconciled · $0 break', agent: 'Recon Agent'          },
  { time: '08:45', kind: 'warning', msg: 'CTL-EX-0091 raised: SOX 404 cut-off risk', agent: 'Control Agent'    },
  { time: '08:30', kind: 'info',    msg: 'Close checklist initialized · Day 3 of 5', agent: 'Orchestrator'     },
]

const JOURNALS = [
  {
    id: 'JE-2025-0847', type: 'Accrual',
    desc: 'Monthly SaaS subscription accrual — Q2 prepayment amortization',
    amount: 142500, dr: 'Prepaid Expenses (1240)', cr: 'SaaS Subscription Expense (6110)',
    source: 'Vendor Invoice #INV-20250514-Salesforce', policy: 'ASC 350-40 / IFRS 15 §B63',
    control: 'GL-CTL-0041', status: 'pending', risk: 'low', preparer: 'K. Patel', age: '2h ago',
  },
  {
    id: 'JE-2025-0846', type: 'Reclassification',
    desc: 'Q2 marketing expense reclassification — digital vs. events',
    amount: 38200, dr: 'Marketing — Digital (6415)', cr: 'Marketing — Events (6410)',
    source: 'Budget Auth #BA-0291', policy: 'Internal Policy P-042',
    control: 'GL-CTL-0039', status: 'flagged', risk: 'medium', preparer: 'A. Rodriguez', age: '3h ago',
  },
  {
    id: 'JE-2025-0845', type: 'Depreciation',
    desc: 'Fixed asset depreciation — May automated run',
    amount: 284750, dr: 'Depreciation Expense (6510)', cr: 'Accumulated Depreciation (1750)',
    source: 'FA Module — Batch D-2025-05', policy: 'ASC 360-10',
    control: 'GL-CTL-0033', status: 'pending', risk: 'low', preparer: 'System', age: '4h ago',
  },
  {
    id: 'JE-2025-0844', type: 'Revenue Deferral',
    desc: 'Unearned revenue recognition — May release',
    amount: 97000, dr: 'Deferred Revenue (2310)', cr: 'Software Revenue (4110)',
    source: 'Contract CN-2024-0189', policy: 'ASC 606',
    control: 'GL-CTL-0044', status: 'approved', risk: 'low', preparer: 'J. Chen', age: '5h ago',
  },
  {
    id: 'JE-2025-0843', type: 'Intercompany',
    desc: 'IC management fee allocation — May',
    amount: 52500, dr: 'IC Mgmt Fee Expense (6810)', cr: 'IC Revenue — Corp (4910)',
    source: 'IC Agreement IA-2024-Corp-01', policy: 'Transfer Pricing Policy v3.1',
    control: 'GL-CTL-0050', status: 'flagged', risk: 'high', preparer: 'T. Nguyen', age: '6h ago',
  },
]

const FLUX_ITEMS = [
  { account: 'SaaS & Software (6110)',        actual: '$890K', prior: '$720K', variance: '+$170K', pct: '+23.6%', up: true,
    narrative: 'Increase driven by Q2 Salesforce renewal (+$95K) and new Databricks contract activation (+$75K). Both backed by approved vendor agreements.' },
  { account: 'Professional Services (6210)',  actual: '$340K', prior: '$410K', variance: '–$70K',  pct: '–17.1%', up: false,
    narrative: 'Reduction from in-sourcing of audit-prep activities. Prior-period advisory fee not repeated; $40K of work absorbed by internal FP&A team.' },
  { account: 'Travel & Entertainment (6320)', actual: '$88K',  prior: '$62K',  variance: '+$26K',  pct: '+41.9%', up: true,
    narrative: 'Return to pre-pandemic travel normalisation; 3 customer QBRs in period vs. 1 prior quarter. Within annual T&E policy cap.' },
]

const RECON_ROWS = [
  { area: 'GL ↔ AP Sub-ledger',         status: 'green', diff: '$0',      last: '2 min ago'  },
  { area: 'GL ↔ AR Sub-ledger',         status: 'green', diff: '$0',      last: '2 min ago'  },
  { area: 'GL ↔ Fixed Assets Register', status: 'amber', diff: '$3,840',  last: '14 min ago' },
  { area: 'GL ↔ Payroll System',        status: 'red',   diff: '$19,200', last: '1 hr ago'   },
  { area: 'Bank ↔ Cash GL',             status: 'green', diff: '$0',      last: '5 min ago'  },
]

const EVIDENCE = [
  { id: 'GL-CTL-0041', action: '/draft-journal',             user: 'K. Patel (GL Accountant)',     ts: '09:14:22', hash: 'a3f9c1d2' },
  { id: 'GL-CTL-0041', action: 'Human approval — approved',  user: 'S. Kim (Controller)',           ts: '09:16:08', hash: 'b7e2a9f1' },
  { id: 'GL-CTL-0038', action: '/reconcile-subledger',       user: 'System (Reconciliation Agent)', ts: '08:55:01', hash: 'c1d4b8e7' },
  { id: 'GL-CTL-0037', action: '/control-exception-triage',  user: 'System (Control Agent)',        ts: '08:30:14', hash: 'd2f5c9a3' },
]

// ─── Shared helpers ───────────────────────────────────────────────────────────

const STATUS_DOT = {
  green: { bg: '#24a148', label: 'Reconciled' },
  amber: { bg: '#f1c21b', label: 'Exception'  },
  red:   { bg: '#da1e28', label: 'Break'       },
}

function Dot({ status }) {
  const s = STATUS_DOT[status] || STATUS_DOT.green
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: s.bg, flexShrink: 0,
    }} />
  )
}

function JournalStatusTag({ status, risk }) {
  if (status === 'posted')   return <Tag type="green"     size="sm">Posted ✓</Tag>
  if (status === 'approved') return <Tag type="blue"      size="sm">Approved</Tag>
  if (status === 'flagged')  return <Tag type={risk === 'high' ? 'red' : 'magenta'} size="sm">{risk === 'high' ? '⚠ High Risk' : 'Flagged'}</Tag>
  return                            <Tag type="warm-gray" size="sm">Pending</Tag>
}

// ─── Panel: Close Cockpit ─────────────────────────────────────────────────────

function CloseCockpit() {
  const pctDone = Math.round(CLOSE_TASKS.reduce((s, t) => s + t.pct, 0) / CLOSE_TASKS.length)
  return (
    <Tile>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#161616' }}>Close Cockpit</div>
          <div style={{ fontSize: 11, color: '#8d8d8d', marginTop: 2 }}>May 2025 · Day 3 of 5</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#0072c3', lineHeight: 1 }}>{pctDone}%</div>
          <Tag type="blue" size="sm">In Progress</Tag>
        </div>
      </div>

      {/* Close timeline */}
      <div style={{ display: 'flex', gap: 3, marginBottom: '0.875rem' }}>
        {[1, 2, 3, 4, 5].map(d => (
          <div key={d} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 4, borderRadius: 2, marginBottom: 3,
              background: d < 3 ? '#24a148' : d === 3 ? '#0072c3' : '#e0e0e0',
            }} />
            <span style={{
              fontSize: 9, fontWeight: 600,
              color: d < 3 ? '#24a148' : d === 3 ? '#0072c3' : '#8d8d8d',
            }}>D{d}</span>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.875rem' }}>
        {CLOSE_TASKS.map(t => (
          <div key={t.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Dot status={t.risk} />
                <span style={{ fontSize: 11, color: '#525252' }}>{t.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#8d8d8d' }}>{t.eta}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: t.pct === 100 ? '#24a148' : '#161616', minWidth: 28, textAlign: 'right' }}>
                  {t.pct}%
                </span>
              </div>
            </div>
            <ProgressBar
              value={t.pct} max={100} size="sm"
              status={t.pct === 100 ? 'finished' : t.pct === 0 ? 'error' : 'active'}
              hideLabel
            />
            <div style={{ fontSize: 9, color: '#8d8d8d', marginTop: 2 }}>Owner: {t.owner}</div>
          </div>
        ))}
      </div>

      {/* Subledger dots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', borderTop: '1px solid #e0e0e0', paddingTop: '0.625rem' }}>
        {SUBLEDGER_STATUS.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Dot status={s.status} />
            <span style={{ fontSize: 10, color: '#525252' }}>{s.name}</span>
          </div>
        ))}
      </div>
    </Tile>
  )
}

// ─── Panel: Agent Activity ────────────────────────────────────────────────────

const LOG_COLORS = {
  success: { bg: '#defbe6', fg: '#24a148', icon: '✓' },
  warning: { bg: '#fff1e8', fg: '#f1c21b', icon: '⚠' },
  info:    { bg: '#edf5ff', fg: '#0072c3', icon: '◈' },
}

function AgentActivity() {
  return (
    <Tile style={{ padding: '0.75rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.625rem' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#161616' }}>Agent Activity</div>
        <div style={{ fontSize: 10, color: '#8d8d8d' }}>Live · last 60 min</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {AGENT_LOG.map((entry, i) => {
          const c = LOG_COLORS[entry.kind]
          return (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: '#8d8d8d', width: 38, flexShrink: 0, paddingTop: 2 }}>{entry.time}</span>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, color: c.fg, fontWeight: 700,
              }}>{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#161616', lineHeight: 1.3 }}>{entry.msg}</div>
                <div style={{ fontSize: 10, color: '#8d8d8d', marginTop: 1 }}>{entry.agent}</div>
              </div>
            </div>
          )
        })}
      </div>
    </Tile>
  )
}

// ─── Panel: Journal Advisor (Queue + Detail) ──────────────────────────────────

function JournalAdvisor() {
  const [filter, setFilter]   = useState('all')
  const [selected, setSelected] = useState(0)
  const [states, setStates]   = useState(
    Object.fromEntries(JOURNALS.map(j => [j.id, j.status]))
  )

  const visible = JOURNALS.filter(j => {
    const s = states[j.id]
    if (filter === 'pending') return s === 'pending'
    if (filter === 'flagged') return s === 'flagged'
    return true
  })

  const safeIdx = Math.min(selected, visible.length - 1)
  const j = visible[safeIdx] || JOURNALS[0]
  const st = states[j.id]

  const pendingCount = JOURNALS.filter(j => states[j.id] === 'pending').length
  const flaggedCount = JOURNALS.filter(j => states[j.id] === 'flagged').length

  return (
    <Tile style={{ padding: 0 }}>
      <div style={{ display: 'flex', minHeight: 400 }}>

        {/* ── List pane ────────────────────────────────── */}
        <div style={{ width: 248, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

          {/* Queue header */}
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#161616' }}>Journal Advisor</div>
            <div style={{ fontSize: 11, color: '#8d8d8d', marginTop: 1 }}>
              {pendingCount} pending · {flaggedCount} flagged
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: '0.5rem' }}>
              {['all', 'pending', 'flagged'].map(f => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setSelected(0) }}
                  style={{
                    padding: '2px 8px', fontSize: 10, borderRadius: 10, cursor: 'pointer', border: 'none',
                    background: filter === f ? '#0072c3' : '#e0e0e0',
                    color: filter === f ? '#fff' : '#525252',
                    fontWeight: filter === f ? 700 : 400, textTransform: 'capitalize',
                    fontFamily: 'inherit',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Journal rows */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {visible.map((jItem, i) => {
              const s = states[jItem.id]
              return (
                <div
                  key={jItem.id}
                  onClick={() => setSelected(i)}
                  style={{
                    padding: '0.625rem 1rem', borderBottom: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    background: safeIdx === i ? '#edf5ff' : 'transparent',
                    borderLeft: safeIdx === i ? '3px solid #0072c3' : '3px solid transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: '#6929c4' }}>{jItem.id}</span>
                    <JournalStatusTag status={s} risk={jItem.risk} />
                  </div>
                  <div style={{ fontSize: 11, color: '#161616', marginBottom: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {jItem.desc}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8d8d8d' }}>
                    <span>{jItem.type}</span>
                    <span>${(jItem.amount / 1000).toFixed(1)}K · {jItem.age}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Detail pane ──────────────────────────────── */}
        <div style={{ flex: 1, padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Detail header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: '0.75rem' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#161616', marginBottom: 3 }}>{j.desc}</div>
              <div style={{ fontSize: 11, color: '#8d8d8d' }}>{j.type} · Prepared by {j.preparer} · {j.age}</div>
            </div>
            <JournalStatusTag status={st} risk={j.risk} />
          </div>

          {/* DR / CR */}
          <div style={{ background: '#f4f4f4', padding: '0.75rem', marginBottom: '0.75rem', borderRadius: 2 }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ color: '#525252', paddingBottom: 5 }}><strong>DR</strong>&nbsp; {j.dr}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', paddingBottom: 5 }}>
                    ${j.amount.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: '#525252' }}><strong>CR</strong>&nbsp; {j.cr}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>
                    ${j.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Citations */}
          <div style={{ fontSize: 11, marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { label: 'Source',  value: j.source,  style: { color: '#0072c3', textDecoration: 'underline', cursor: 'pointer' } },
              { label: 'Policy',  value: j.policy,  style: { color: '#161616' } },
              { label: 'Control', value: j.control, style: { fontFamily: 'IBM Plex Mono, monospace', color: '#6929c4' } },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#8d8d8d', width: 50, flexShrink: 0 }}>{row.label}</span>
                <span style={row.style}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Contextual notices */}
          {j.risk === 'high' && st === 'flagged' && (
            <InlineNotification kind="error" title="High Risk —" subtitle="IC journal requires dual approval and Transfer Pricing review before posting."
              hideCloseButton lowContrast style={{ marginBottom: '0.5rem' }} />
          )}
          {j.risk === 'medium' && st === 'flagged' && (
            <InlineNotification kind="warning" title="Review Required —" subtitle="Reclassification needs budget owner sign-off."
              hideCloseButton lowContrast style={{ marginBottom: '0.5rem' }} />
          )}
          {st === 'posted' && (
            <InlineNotification kind="success" title="Posted to GL —" subtitle={`Evidence recorded · Control: ${j.control}`}
              hideCloseButton lowContrast style={{ marginBottom: '0.5rem' }} />
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #e0e0e0' }}>
            {(st === 'pending' || st === 'flagged') && <>
              <Button size="sm" kind="primary" renderIcon={CheckmarkFilled}
                onClick={() => setStates(s => ({ ...s, [j.id]: 'approved' }))}>
                Approve
              </Button>
              <Button size="sm" kind="ghost">Request Changes</Button>
            </>}
            {st === 'approved' && (
              <Button size="sm" kind="primary" renderIcon={Launch}
                onClick={() => setStates(s => ({ ...s, [j.id]: 'posted' }))}>
                Post to GL
              </Button>
            )}
          </div>
        </div>
      </div>
    </Tile>
  )
}

// ─── Panel: Flux Agent ────────────────────────────────────────────────────────

function FluxAgent() {
  return (
    <Tile>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#161616', marginBottom: 2 }}>Flux Agent</div>
      <div style={{ fontSize: 11, color: '#8d8d8d', marginBottom: '0.75rem' }}>/flux-explainer · May 2025 vs Apr 2025</div>
      <Accordion>
        {FLUX_ITEMS.map(item => (
          <AccordionItem
            key={item.account}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: item.up ? '#fff1f1' : '#defbe6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.up ? <ArrowUp size={12} color="#da1e28" /> : <ArrowDown size={12} color="#24a148" />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{item.account}</span>
                <span style={{ fontSize: 12, fontWeight: 700, marginRight: 8, color: item.up ? '#da1e28' : '#24a148' }}>
                  {item.variance}
                  <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 4, opacity: 0.7 }}>({item.pct})</span>
                </span>
              </div>
            }
          >
            <p style={{ fontSize: 12, color: '#525252', lineHeight: 1.5, margin: 0 }}>{item.narrative}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: 11, color: '#8d8d8d' }}>Actual: <strong style={{ color: '#161616' }}>{item.actual}</strong></span>
              <span style={{ fontSize: 11, color: '#8d8d8d' }}>Prior: <strong style={{ color: '#161616' }}>{item.prior}</strong></span>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </Tile>
  )
}

// ─── Panel: Reconciliation Agent ─────────────────────────────────────────────

function ReconciliationAgent() {
  return (
    <Tile>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#161616', marginBottom: 2 }}>Reconciliation Agent</div>
      <div style={{ fontSize: 11, color: '#8d8d8d', marginBottom: '0.75rem' }}>/reconcile-subledger · real-time</div>
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Sub-ledger</StructuredListCell>
            <StructuredListCell head>Status</StructuredListCell>
            <StructuredListCell head>Break</StructuredListCell>
            <StructuredListCell head>Updated</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {RECON_ROWS.map(r => (
            <StructuredListRow key={r.area}>
              <StructuredListCell style={{ fontSize: 12 }}>{r.area}</StructuredListCell>
              <StructuredListCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Dot status={r.status} />
                  <span style={{ fontSize: 11, color: '#525252' }}>{STATUS_DOT[r.status]?.label}</span>
                </div>
              </StructuredListCell>
              <StructuredListCell style={{
                fontSize: 12, fontFamily: 'IBM Plex Mono, monospace',
                color: r.diff !== '$0' ? '#da1e28' : '#24a148',
              }}>{r.diff}</StructuredListCell>
              <StructuredListCell style={{ fontSize: 11, color: '#8d8d8d' }}>{r.last}</StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </Tile>
  )
}

// ─── Audit Agent Modal ────────────────────────────────────────────────────────

function AuditModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  const run = () => {
    if (!query.trim()) return
    setResults(EVIDENCE.filter(r =>
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.action.toLowerCase().includes(query.toLowerCase())
    ))
  }

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading="Audit Agent — Evidence Vault"
      modalLabel="Control-ID indexed · WORM-grade · hash-chained"
      passiveModal
      size="md"
    >
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <Search
              placeholder="Enter control ID or skill name… e.g. GL-CTL-0041"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              size="lg"
            />
          </div>
          <Button size="lg" kind="primary" renderIcon={SearchIcon} onClick={run}>Query</Button>
        </div>
      </div>

      {results === null && (
        <p style={{ color: '#8d8d8d', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>
          Every agent invocation, approver, and source record — queryable by control ID.
        </p>
      )}
      {results?.length === 0 && (
        <p style={{ color: '#8d8d8d', fontSize: 13, textAlign: 'center', padding: '1rem 0' }}>No evidence records found.</p>
      )}
      {results?.length > 0 && (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Control ID</StructuredListCell>
              <StructuredListCell head>Action</StructuredListCell>
              <StructuredListCell head>User</StructuredListCell>
              <StructuredListCell head>Time</StructuredListCell>
              <StructuredListCell head>Hash</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {results.map((r, i) => (
              <StructuredListRow key={i}>
                <StructuredListCell style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#6929c4', fontSize: 12 }}>{r.id}</StructuredListCell>
                <StructuredListCell style={{ fontSize: 12 }}>{r.action}</StructuredListCell>
                <StructuredListCell style={{ fontSize: 12, color: '#525252' }}>{r.user}</StructuredListCell>
                <StructuredListCell style={{ fontSize: 12, color: '#8d8d8d' }}>{r.ts}</StructuredListCell>
                <StructuredListCell style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#0072c3' }}>{r.hash}</StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      )}
    </Modal>
  )
}

// ─── Main Workbench ───────────────────────────────────────────────────────────

export default function ControllerWorkbench({ onClose }) {
  const [auditOpen, setAuditOpen] = useState(false)

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: '#f4f4f4' }}>

        {/* Header */}
        <div style={{
          background: '#0E2841', color: '#fff',
          padding: '0.875rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, borderBottom: '1px solid #393939',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: '#156082', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⬡</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Controller Workbench</div>
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>May 2025 Close · Continuous and Compliant Close · R2R Wave 1</div>
            </div>
            <Tag type="green" size="sm">Live</Tag>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button size="sm" kind="ghost" renderIcon={Security} onClick={() => setAuditOpen(true)}
              style={{ color: '#c5a3ff', borderColor: '#c5a3ff4d' }}>
              Audit Agent
            </Button>
            <Button size="sm" kind="ghost" renderIcon={Close} iconDescription="Close" hasIconOnly onClick={onClose} />
          </div>
        </div>

        {/* Body */}
        <div className="workbench-body" style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          <Grid fullWidth condensed style={{ gap: '1rem' }}>

            {/* Left column */}
            <Column lg={5} md={4} sm={4}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="slide-in"><CloseCockpit /></div>
                <div className="slide-in"><AgentActivity /></div>
                <div className="slide-in"><ReconciliationAgent /></div>
              </div>
            </Column>

            {/* Right column */}
            <Column lg={11} md={4} sm={4}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="slide-in"><JournalAdvisor /></div>
                <div className="slide-in"><FluxAgent /></div>
              </div>
            </Column>

          </Grid>
        </div>
      </div>

      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </>
  )
}
