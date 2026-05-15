import { useState } from 'react'
import { Button, Tag, ProgressBar, InlineNotification, Tabs, TabList, Tab, TabPanel, TabPanels } from '@carbon/react'
import { Close, ArrowUp, ArrowDown } from '@carbon/icons-react'

const C = {
  orange:  '#E97132',
  green:   '#059669',
  red:     '#dc2626',
  amber:   '#d97706',
  navy:    '#1e293b',
  slate:   '#475569',
  muted:   '#94a3b8',
  bg:      '#f8fafc',
  border:  '#e2e8f0',
  teal:    '#0891b2',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const KPI_DATA = [
  { label: 'Total AR',          value: '$496.5M', sub: '1,100 open invoices',         topColor: C.orange, delta: null },
  { label: 'DSO',               value: '32d',     sub: '↓ −17.3d with AI agents',     topColor: C.green,  delta: true },
  { label: 'CEI',               value: '78%',     sub: '↑ +21.6pp vs baseline',        topColor: C.green,  delta: true },
  { label: 'Auto-Match Rate',   value: '83%',     sub: '↑ +36pp from 47% baseline',    topColor: C.teal,   delta: true },
  { label: 'Open Disputes',     value: '$13.9M',  sub: '3.8% dispute rate · 47 cases', topColor: C.amber,  delta: null },
]

const AGING = [
  { label: 'Current (0–30d)', pct: 57, amt: '$282.9M', color: C.green },
  { label: '31–60 days',      pct: 14, amt: '$69.5M',  color: '#84cc16' },
  { label: '61–90 days',      pct: 12, amt: '$59.6M',  color: C.amber },
  { label: '91–120 days',     pct: 9,  amt: '$44.7M',  color: '#f97316' },
  { label: '120+ days',       pct: 8,  amt: '$39.7M',  color: C.red },
]

const BU_SPLIT = [
  { label: 'Americas', pct: 52, amt: '$258.2M', color: C.orange },
  { label: 'Europe',   pct: 31, amt: '$153.9M', color: '#8b5cf6' },
  { label: 'APAC',     pct: 17, amt: '$84.4M',  color: C.teal },
]

const CUSTOMERS = [
  { priority: 100, name: 'Accenture Federal Services', id: 'CUST-00142', country: 'US', risk: 'HIGH',   outstanding: 28.4, dso: 67, aging: '120+',   lastContact: 'Nov 12', flags: ['DISPUTED', 'STRATEGIC'] },
  { priority: 99,  name: 'Deutsche Bank AG',            id: 'CUST-00089', country: 'DE', risk: 'WATCH',  outstanding: 19.2, dso: 54, aging: '61–90',  lastContact: 'Nov 14', flags: ['BROKEN PTP'] },
  { priority: 97,  name: 'Tata Consultancy Services',   id: 'CUST-00234', country: 'IN', risk: 'MEDIUM', outstanding: 15.7, dso: 43, aging: '31–60',  lastContact: 'Nov 10', flags: ['NEAR LIMIT'] },
  { priority: 94,  name: 'British Petroleum plc',       id: 'CUST-00156', country: 'UK', risk: 'HIGH',   outstanding: 12.9, dso: 72, aging: '120+',   lastContact: 'Nov 08', flags: ['DISPUTED'] },
  { priority: 92,  name: 'Siemens AG',                  id: 'CUST-00078', country: 'DE', risk: 'MEDIUM', outstanding: 11.4, dso: 38, aging: '31–60',  lastContact: 'Nov 15', flags: [] },
  { priority: 89,  name: 'Toyota Motor Corporation',    id: 'CUST-00312', country: 'JP', risk: 'LOW',    outstanding: 9.8,  dso: 29, aging: '1–30',   lastContact: 'Nov 16', flags: ['STRATEGIC'] },
  { priority: 87,  name: 'Nestlé S.A.',                 id: 'CUST-00198', country: 'CH', risk: 'MEDIUM', outstanding: 8.3,  dso: 45, aging: '31–60',  lastContact: 'Nov 11', flags: [] },
  { priority: 84,  name: 'Amazon Web Services',         id: 'CUST-00067', country: 'US', risk: 'LOW',    outstanding: 7.6,  dso: 22, aging: '1–30',   lastContact: 'Nov 17', flags: [] },
  { priority: 82,  name: 'BNP Paribas',                 id: 'CUST-00201', country: 'FR', risk: 'WATCH',  outstanding: 6.9,  dso: 58, aging: '61–90',  lastContact: 'Nov 09', flags: ['BANKRUPTCY WATCH'] },
  { priority: 79,  name: 'Rio Tinto Group',             id: 'CUST-00143', country: 'AU', risk: 'MEDIUM', outstanding: 5.8,  dso: 35, aging: '31–60',  lastContact: 'Nov 13', flags: [] },
]

const RISK_COLORS = { HIGH: C.red, WATCH: C.amber, MEDIUM: '#ca8a04', LOW: C.muted }

const PERF_METRICS = [
  { label: 'Collections Effectiveness', actual: 78, target: 85, unit: '%', ai: true },
  { label: 'DSO Reduction',             actual: 32, target: 28, unit: 'd', ai: true },
  { label: 'Cash App Auto-Match',       actual: 83, target: 90, unit: '%', ai: true },
  { label: 'Dispute Resolution Time',   actual: 8,  target: 5,  unit: 'd', ai: true },
]

const AI_AGENTS = [
  { icon: '📞', name: 'Collections AI Agent',     impact: '+$41.2M recovered',   detail: 'AI-prioritised dunning calls based on payment probability scoring' },
  { icon: '💳', name: 'Cash Application Agent',   impact: '83% auto-matched',    detail: 'Remittance parsing + bank statement reconciliation without human touch' },
  { icon: '⚖️',  name: 'Dispute Resolution Agent', impact: '47 cases active',     detail: 'Root cause classification + routing to pricing / delivery / credit teams' },
  { icon: '🔐', name: 'Credit Scoring Agent',     impact: 'Real-time limit calc', detail: 'Continuous re-scoring against payment history and external signals' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header({ onClose }) {
  return (
    <div style={{
      background: C.navy, color: '#f1f5f9', flexShrink: 0,
      padding: '0.75rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      borderBottom: `3px solid ${C.orange}`,
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 6,
        background: C.orange, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 16, flexShrink: 0,
      }}>⬡</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
          AR Director Workbench
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
          Accounts Receivable · Executive Dashboard · FY 2025 · Q4
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#4ade80',
          background: '#166534', padding: '3px 8px', borderRadius: 8,
        }}>● Live · O2C Wave 3</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', display: 'flex' }}>
          <Close size={20} />
        </button>
      </div>
    </div>
  )
}

function KPIStrip() {
  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
      {KPI_DATA.map(({ label, value, sub, topColor, delta }) => (
        <div key={label} style={{
          flex: 1, padding: '1rem 1.25rem',
          borderRight: `1px solid ${C.border}`,
          borderTop: `3px solid ${topColor}`,
        }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: topColor === C.orange ? C.navy : topColor, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: C.slate, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
        </div>
      ))}
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: C.bg }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {/* Aging */}
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}`, padding: '1rem', borderRadius: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
            AR Aging Distribution
          </div>
          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', marginBottom: '0.875rem' }}>
            {AGING.map(a => (
              <div key={a.label} style={{ width: `${a.pct}%`, background: a.color }} title={`${a.label}: ${a.pct}%`} />
            ))}
          </div>
          {AGING.map(a => (
            <div key={a.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.slate }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                {a.label}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{a.pct}%</span>
              <span style={{ fontSize: 11, color: C.muted, minWidth: 70, textAlign: 'right' }}>{a.amt}</span>
            </div>
          ))}
        </div>

        {/* Business unit */}
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}`, padding: '1rem', borderRadius: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
            Business Unit Breakdown
          </div>
          {BU_SPLIT.map(b => (
            <div key={b.label} style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{b.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.pct}% · {b.amt}</span>
              </div>
              <div style={{ height: 8, background: C.border, borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: '0.5rem' }}>AI vs Baseline</div>
            {[
              { label: 'DSO', baseline: '49d', ai: '32d', delta: '↓ −17.3d', good: true },
              { label: 'CEI', baseline: '61%', ai: '78%', delta: '↑ +17pp', good: true },
              { label: 'Write-offs', baseline: '2.1%', ai: '0.8%', delta: '↓ −1.3pp', good: true },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 11 }}>
                <span style={{ color: C.muted, minWidth: 80 }}>{r.label}</span>
                <span style={{ color: C.slate, textDecoration: 'line-through' }}>{r.baseline}</span>
                <span style={{ color: C.green, fontWeight: 700 }}>{r.ai}</span>
                <span style={{ color: C.green, fontWeight: 600, marginLeft: 'auto' }}>{r.delta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute breakdown */}
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}`, padding: '1rem', borderRadius: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
            Dispute Breakdown · $13.9M
          </div>
          {[
            { type: 'Pricing Error',     amt: '$5.2M', pct: 37, color: C.red },
            { type: 'Short Delivery',    amt: '$3.8M', pct: 27, color: C.amber },
            { type: 'Duplicate Invoice', amt: '$2.9M', pct: 21, color: '#f97316' },
            { type: 'Quality Claim',     amt: '$1.4M', pct: 10, color: '#84cc16' },
            { type: 'Other',             amt: '$0.6M', pct: 5,  color: C.muted },
          ].map(d => (
            <div key={d.type} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: C.slate }}>{d.type}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{d.amt} · {d.pct}%</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Agent cards */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {AI_AGENTS.map(a => (
          <div key={a.name} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            padding: '0.875rem', borderRadius: 2,
            borderTop: `3px solid ${C.orange}`,
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{a.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: C.slate, lineHeight: 1.5, marginBottom: 8 }}>{a.detail}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.orange }}>{a.impact}</div>
            <button style={{
              marginTop: 8, background: 'none', border: 'none', color: C.orange,
              fontSize: 11, cursor: 'pointer', padding: 0, fontWeight: 600,
            }}>View AI Actions →</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Customer Portfolio tab ───────────────────────────────────────────────────

function CustomerPortfolioTab() {
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [selectedRow, setSelectedRow] = useState(null)
  const [actionMsg, setActionMsg] = useState(null)

  const filtered = riskFilter === 'ALL' ? CUSTOMERS : CUSTOMERS.filter(c => c.risk === riskFilter)

  const handleAction = (action, customer) => {
    setActionMsg(`${action} sent to ${customer.name}`)
    setTimeout(() => setActionMsg(null), 3000)
  }

  return (
    <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: C.bg }}>
      {actionMsg && (
        <InlineNotification kind="success" title={actionMsg} style={{ marginBottom: '0.75rem', maxWidth: '100%' }} />
      )}
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Filter risk:</span>
        {['ALL', 'HIGH', 'WATCH', 'MEDIUM', 'LOW'].map(r => (
          <button key={r} onClick={() => setRiskFilter(r)} style={{
            padding: '4px 14px', borderRadius: 4, border: '1px solid',
            borderColor: riskFilter === r ? (RISK_COLORS[r] || C.navy) : C.border,
            background: riskFilter === r ? ((RISK_COLORS[r] || C.navy) + '18') : '#fff',
            color: riskFilter === r ? (RISK_COLORS[r] || C.navy) : C.slate,
            fontSize: 11, fontWeight: 500, cursor: 'pointer',
          }}>{r}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>
          Showing {filtered.length} of {CUSTOMERS.length} · Scored by exposure × risk × age
        </span>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              {['Priority', 'Customer', 'Risk', 'Outstanding', 'DSO', 'Aging', 'Last Contact', 'Flags', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Customer' ? 'left' : 'right', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const isSelected = selectedRow === c.id
              return (
                <tr key={c.id}
                  onClick={() => setSelectedRow(isSelected ? null : c.id)}
                  style={{
                    background: isSelected ? '#e0f2fe' : (i % 2 === 0 ? '#fff' : C.bg),
                    borderBottom: `1px solid ${C.border}`,
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block', width: 32, height: 32, borderRadius: '50%',
                      background: c.priority >= 95 ? C.red : c.priority >= 88 ? C.amber : '#e2e8f0',
                      color: c.priority >= 88 ? '#fff' : C.navy,
                      fontWeight: 800, fontSize: 11, lineHeight: '32px', textAlign: 'center',
                    }}>{c.priority}</span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: C.navy }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{c.id} · {c.country}</div>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                      background: (RISK_COLORS[c.risk] || C.muted) + '20',
                      color: RISK_COLORS[c.risk] || C.muted,
                      border: `1px solid ${(RISK_COLORS[c.risk] || C.muted)}40`,
                    }}>{c.risk}</span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: C.navy }}>${c.outstanding.toFixed(1)}M</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: c.dso > 60 ? C.red : c.dso > 40 ? C.amber : C.slate }}>{c.dso}d</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, padding: '2px 6px', borderRadius: 3,
                      background: c.aging.includes('120') ? C.red + '20' : c.aging.includes('61') ? C.amber + '20' : '#dcfce7',
                      color: c.aging.includes('120') ? C.red : c.aging.includes('61') ? C.amber : C.green,
                      fontWeight: 600,
                    }}>{c.aging}</span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: C.muted, fontSize: 11 }}>{c.lastContact}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {c.flags.map(f => (
                        <span key={f} style={{
                          fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                          background: f.includes('DISPUTED') ? C.red + '20' : f.includes('PTP') ? C.amber + '20' : '#e0f2fe',
                          color: f.includes('DISPUTED') ? C.red : f.includes('PTP') ? C.amber : C.teal,
                        }}>{f}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      {['Dunning', 'PTP', 'Escalate'].map(action => (
                        <button key={action}
                          onClick={e => { e.stopPropagation(); handleAction(action, c) }}
                          style={{
                            padding: '3px 8px', border: `1px solid ${C.border}`, borderRadius: 3,
                            background: '#fff', color: C.slate, fontSize: 10, cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}>
                          {action}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Performance tab ──────────────────────────────────────────────────────────

function PerformanceTab() {
  return (
    <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: C.bg }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 2, background: '#fff', border: `1px solid ${C.border}`, padding: '1rem', borderRadius: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Performance vs Targets
          </div>
          {PERF_METRICS.map(m => {
            const pct = Math.min(100, (m.actual / (m.label.includes('DSO') ? 50 : 100)) * 100)
            const targetPct = Math.min(100, (m.target / (m.label.includes('DSO') ? 50 : 100)) * 100)
            const onTarget = m.label.includes('DSO') ? m.actual <= m.target : m.actual >= m.target
            return (
              <div key={m.label} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{m.label}</span>
                  <span style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 800, color: onTarget ? C.green : C.amber }}>
                      {m.actual}{m.unit}
                    </span>
                    <span style={{ color: C.muted }}> / target {m.target}{m.unit}</span>
                  </span>
                </div>
                <div style={{ position: 'relative', height: 10, background: C.border, borderRadius: 5 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: onTarget ? C.green : C.amber, borderRadius: 5 }} />
                  <div style={{
                    position: 'absolute', top: -2, height: 14, width: 2,
                    left: `${targetPct}%`, background: C.navy,
                  }} />
                </div>
                <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>
                  {onTarget ? '✓ On target' : `⚠ ${Math.abs(m.actual - m.target)}${m.unit} from target`}
                  {m.ai && <span style={{ marginLeft: 8, color: C.teal }}>● AI-assisted</span>}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Cumulative Cash Recovered', value: '$41.2M', sub: 'AI Collections Agent · YTD 2025', color: C.green },
            { label: 'Dunning Actions Automated', value: '8,420',  sub: '94% zero-touch rate · this quarter', color: C.teal },
            { label: 'Auto-Match Savings',         value: '2,847h', sub: 'FTE hours saved · vs manual baseline', color: C.orange },
            { label: 'Dispute Cycle Time',          value: '8d',    sub: '↓ from 21d baseline · Dispute Agent', color: C.amber },
          ].map(k => (
            <div key={k.label} style={{
              background: '#fff', border: `1px solid ${C.border}`, padding: '0.875rem',
              borderTop: `3px solid ${k.color}`, borderRadius: 2,
            }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 10, color: C.slate, marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ARWorkbench({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <Header onClose={onClose} />
      <KPIStrip />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs>
          <TabList aria-label="AR workbench tabs" contained>
            <Tab>Executive Overview</Tab>
            <Tab>Customer Portfolio</Tab>
            <Tab>Performance & AI Impact</Tab>
          </TabList>
          <TabPanels style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}><OverviewTab /></TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}><CustomerPortfolioTab /></TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}><PerformanceTab /></TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  )
}
