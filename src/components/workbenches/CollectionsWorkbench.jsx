import { useState, useMemo } from 'react'
import { Button, Tag, InlineNotification, ProgressBar } from '@carbon/react'
import { Close, ArrowUp, ArrowDown } from '@carbon/icons-react'

const C = {
  orange:  '#E97132',
  purple:  '#7c3aed',
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

const RISK_COLORS = { HIGH: C.red, WATCH: C.amber, MEDIUM: '#ca8a04', LOW: C.muted }

// ─── Worklist data ────────────────────────────────────────────────────────────

const QUEUE = [
  { priority: 100, name: 'Accenture Federal Services', id: 'CUST-00142', country: 'US', risk: 'HIGH',   outstanding: 28_400_000, age: 67, aging: '90+',    lastActivity: 'Nov 12, 2024', flags: ['DISPUTED', 'STRATEGIC'],    nextAction: 'Escalate to VP', ptpDate: null },
  { priority: 99,  name: 'Deutsche Bank AG',            id: 'CUST-00089', country: 'DE', risk: 'WATCH',  outstanding: 19_200_000, age: 54, aging: '61-90',  lastActivity: 'Nov 14, 2024', flags: ['BROKEN PTP'],               nextAction: 'Re-negotiate PTP', ptpDate: 'Nov 30' },
  { priority: 97,  name: 'British Petroleum plc',       id: 'CUST-00156', country: 'UK', risk: 'HIGH',   outstanding: 12_900_000, age: 72, aging: '90+',    lastActivity: 'Nov 08, 2024', flags: ['DISPUTED'],                 nextAction: 'Legal notice', ptpDate: null },
  { priority: 94,  name: 'BNP Paribas',                 id: 'CUST-00201', country: 'FR', risk: 'WATCH',  outstanding: 6_900_000,  age: 58, aging: '61-90',  lastActivity: 'Nov 09, 2024', flags: ['BANKRUPTCY WATCH'],         nextAction: 'Credit review', ptpDate: null },
  { priority: 91,  name: 'Tata Consultancy Services',   id: 'CUST-00234', country: 'IN', risk: 'MEDIUM', outstanding: 15_700_000, age: 43, aging: '31-60',  lastActivity: 'Nov 10, 2024', flags: ['NEAR LIMIT'],               nextAction: 'Dunning call', ptpDate: 'Dec 05' },
  { priority: 88,  name: 'Nestlé S.A.',                 id: 'CUST-00198', country: 'CH', risk: 'MEDIUM', outstanding: 8_300_000,  age: 45, aging: '31-60',  lastActivity: 'Nov 11, 2024', flags: [],                           nextAction: 'Email dunning', ptpDate: 'Dec 10' },
  { priority: 85,  name: 'Rio Tinto Group',             id: 'CUST-00143', country: 'AU', risk: 'MEDIUM', outstanding: 5_800_000,  age: 35, aging: '31-60',  lastActivity: 'Nov 13, 2024', flags: [],                           nextAction: 'Email dunning', ptpDate: null },
  { priority: 82,  name: 'Siemens AG',                  id: 'CUST-00078', country: 'DE', risk: 'MEDIUM', outstanding: 11_400_000, age: 38, aging: '31-60',  lastActivity: 'Nov 15, 2024', flags: [],                           nextAction: 'Auto-dunning', ptpDate: 'Dec 08' },
  { priority: 76,  name: 'Toyota Motor Corporation',    id: 'CUST-00312', country: 'JP', risk: 'LOW',    outstanding: 9_800_000,  age: 29, aging: '1-30',   lastActivity: 'Nov 16, 2024', flags: ['STRATEGIC'],                nextAction: 'Monitor', ptpDate: null },
  { priority: 71,  name: 'Amazon Web Services',         id: 'CUST-00067', country: 'US', risk: 'LOW',    outstanding: 7_600_000,  age: 22, aging: '1-30',   lastActivity: 'Nov 17, 2024', flags: [],                           nextAction: 'Auto-dunning', ptpDate: null },
]

const fmt = n => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ onClose }) {
  return (
    <div style={{
      background: C.navy, color: '#f1f5f9', flexShrink: 0,
      padding: '0.75rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      borderBottom: `3px solid ${C.purple}`,
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 6,
        background: C.purple, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 16, flexShrink: 0,
      }}>📞</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>Collections Copilot</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
          Credit & Collections Analyst · AI-Prioritised Worklist · O2C
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: 'IBM Plex Mono, monospace' }}>
          Scored: exposure × risk × age × strategic
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', display: 'flex', padding: 4 }}>
          <Close size={20} />
        </button>
      </div>
    </div>
  )
}

// ─── KPI strip ────────────────────────────────────────────────────────────────

function KPIStrip({ filtered }) {
  const totalOverdue   = filtered.reduce((s, c) => s + c.outstanding, 0)
  const openInvoices   = 5260
  const brokenPTPs     = filtered.filter(c => c.flags.includes('BROKEN PTP')).length
  const highRisk       = filtered.filter(c => c.risk === 'HIGH').length

  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
      {[
        { label: 'Total Overdue',       value: fmt(totalOverdue),      sub: `${filtered.length} accounts in queue`,     topColor: C.red    },
        { label: 'Open Invoices',       value: openInvoices.toLocaleString(), sub: 'Cross all aging buckets',           topColor: C.amber  },
        { label: 'Broken PTPs',         value: `${brokenPTPs}`,        sub: `${filtered.filter(c=>c.flags.includes('BROKEN PTP')).length} in current view`, topColor: C.purple },
        { label: 'High Risk Accounts',  value: `${highRisk}`,          sub: 'Requiring immediate action',               topColor: C.red    },
      ].map(({ label, value, sub, topColor }) => (
        <div key={label} style={{
          flex: 1, padding: '1rem 1.25rem',
          borderRight: `1px solid ${C.border}`,
          borderTop: `3px solid ${topColor}`,
        }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: topColor === C.red ? C.red : (topColor === C.purple ? C.purple : C.navy), lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: C.slate, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
        </div>
      ))}
    </div>
  )
}

// ─── Action panel ─────────────────────────────────────────────────────────────

function ActionPanel({ customer, onAction, onClose }) {
  const [note, setNote] = useState('')
  const [ptpDate, setPtpDate] = useState(customer.ptpDate ? `2024-12-${customer.ptpDate.split(' ')[1]}` : '')
  const [submitted, setSubmitted] = useState(null)

  const actions = [
    { id: 'dunning',   label: '📧 Send Dunning Email',    color: C.teal   },
    { id: 'call',      label: '📞 Log Collection Call',   color: C.purple },
    { id: 'ptp',       label: '🤝 Record Promise to Pay', color: C.orange },
    { id: 'escalate',  label: '⚠️ Escalate to Manager',   color: C.red    },
    { id: 'dispute',   label: '⚖️ Raise Dispute Ticket',  color: C.amber  },
    { id: 'legal',     label: '⚡ Flag for Legal Review',  color: C.navy   },
  ]

  const handleAction = (id) => {
    setSubmitted(id)
    setTimeout(() => { setSubmitted(null); onAction?.(id, customer) }, 1200)
  }

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0, width: 320,
      background: '#fff', borderLeft: `1px solid ${C.border}`,
      zIndex: 100, display: 'flex', flexDirection: 'column',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
    }}>
      <div style={{
        background: C.navy, padding: '0.875rem 1rem',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: `3px solid ${RISK_COLORS[customer.risk] || C.muted}`,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{customer.name}</div>
          <div style={{ fontSize: 10, color: C.muted }}>{customer.id} · {customer.country}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}>
          <Close size={16} />
        </button>
      </div>

      <div style={{ padding: '0.875rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <Metric label="Outstanding" value={fmt(customer.outstanding)} color={C.red} />
          <Metric label="Age" value={`${customer.age}d`} color={customer.age > 60 ? C.red : C.amber} />
          <Metric label="Aging" value={customer.aging} color={C.slate} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {customer.flags.map(f => (
            <span key={f} style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
              background: f.includes('DISPUTED') ? C.red + '20' : f.includes('PTP') ? C.purple + '20' : C.amber + '20',
              color: f.includes('DISPUTED') ? C.red : f.includes('PTP') ? C.purple : C.amber,
            }}>{f}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.slate, marginTop: 6, fontWeight: 500 }}>
          Next Action: <span style={{ color: C.orange }}>{customer.nextAction}</span>
        </div>
      </div>

      <div style={{ padding: '0.875rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
          Actions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {actions.map(a => (
            <button key={a.id} onClick={() => handleAction(a.id)} disabled={submitted === a.id} style={{
              padding: '0.625rem 0.875rem', border: `1px solid ${C.border}`, borderRadius: 4,
              background: submitted === a.id ? a.color + '18' : '#fff',
              color: submitted === a.id ? a.color : C.navy,
              fontWeight: 600, fontSize: 12, cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.15s',
              borderLeft: `3px solid ${a.color}`,
            }}>
              {submitted === a.id ? '✓ Sent' : a.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Note</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Log a note for this account…" style={{
            width: '100%', height: 80, padding: '0.5rem', boxSizing: 'border-box',
            border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 11,
            fontFamily: 'IBM Plex Sans, sans-serif', resize: 'vertical', outline: 'none', color: C.navy,
          }} />
        </div>

        {customer.ptpDate !== null && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
              Promise to Pay Date
            </div>
            <input type="date" value={ptpDate} onChange={e => setPtpDate(e.target.value)} style={{
              width: '100%', padding: '0.5rem', border: `1px solid ${C.border}`,
              borderRadius: 4, fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box',
            }} />
          </div>
        )}
      </div>
    </div>
  )
}

function Metric({ label, value, color }) {
  return (
    <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}`, padding: '0.5rem', borderRadius: 2, textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color }}>{value}</div>
    </div>
  )
}

// ─── Main workbench ───────────────────────────────────────────────────────────

export default function CollectionsWorkbench({ onClose }) {
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [actionLog, setActionLog] = useState([])
  const [successMsg, setSuccessMsg] = useState(null)

  const filtered = useMemo(() =>
    riskFilter === 'ALL' ? QUEUE : QUEUE.filter(c => c.risk === riskFilter),
    [riskFilter]
  )

  const handleAction = (actionId, customer) => {
    const msg = `${actionId.charAt(0).toUpperCase() + actionId.slice(1)} actioned for ${customer.name}`
    setActionLog(prev => [{ msg, ts: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)])
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <Header onClose={onClose} />
      <KPIStrip filtered={filtered} />

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem', paddingRight: selectedCustomer ? 340 : '1.5rem', boxSizing: 'border-box' }}>
        {successMsg && (
          <InlineNotification kind="success" title={successMsg} style={{ marginBottom: '0.75rem', maxWidth: '100%' }} />
        )}

        {/* Filter row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Risk class:</span>
          {['ALL', 'HIGH', 'WATCH', 'MEDIUM', 'LOW'].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)} style={{
              padding: '5px 16px', borderRadius: 4, border: '1px solid',
              borderColor: riskFilter === r ? (RISK_COLORS[r] || C.navy) : C.border,
              background: riskFilter === r ? ((RISK_COLORS[r] || C.navy) + '18') : '#fff',
              color: riskFilter === r ? (RISK_COLORS[r] || C.navy) : C.slate,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>{r === 'ALL' ? 'All Risk Classes' : r}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>
            {filtered.length} accounts · {filtered.filter(c => c.risk === 'HIGH' || c.risk === 'WATCH').length} require action
          </span>
        </div>

        {/* Worklist table */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <tr style={{ background: C.navy, color: '#f1f5f9' }}>
                {['Priority', 'Customer', 'Risk', 'Outstanding', 'Age', 'Aging', 'Last Activity', 'Flags', 'Next Action'].map(h => (
                  <th key={h} style={{
                    padding: '10px 12px', textAlign: h === 'Customer' || h === 'Next Action' ? 'left' : 'right',
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const isSelected = selectedCustomer?.id === c.id
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(isSelected ? null : c)}
                    style={{
                      background: isSelected ? '#ede9fe' : (i % 2 === 0 ? '#fff' : C.bg),
                      borderBottom: `1px solid ${C.border}`,
                      cursor: 'pointer', transition: 'background 0.1s',
                      borderLeft: isSelected ? `3px solid ${C.purple}` : '3px solid transparent',
                    }}
                  >
                    {/* Priority bubble */}
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex', width: 34, height: 34, borderRadius: '50%',
                        alignItems: 'center', justifyContent: 'center',
                        background: c.priority >= 95 ? C.red : c.priority >= 85 ? C.amber : (c.priority >= 75 ? '#fef9c3' : C.bg),
                        color: c.priority >= 85 ? '#fff' : C.navy,
                        fontWeight: 800, fontSize: 11,
                        border: `2px solid ${c.priority >= 95 ? C.red : c.priority >= 85 ? C.amber : C.border}`,
                      }}>{c.priority}</span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: C.navy }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{c.id} · {c.country}</div>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                        background: (RISK_COLORS[c.risk] || C.muted) + '20',
                        color: RISK_COLORS[c.risk] || C.muted,
                        border: `1px solid ${(RISK_COLORS[c.risk] || C.muted)}40`,
                      }}>{c.risk}</span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, color: c.outstanding > 15_000_000 ? C.red : C.navy }}>{fmt(c.outstanding)}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: c.age > 60 ? C.red : c.age > 40 ? C.amber : C.slate }}>{c.age}d</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <span style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 4,
                        background: c.aging === '90+' ? C.red + '18' : c.aging.includes('61') ? C.amber + '18' : '#dcfce7',
                        color: c.aging === '90+' ? C.red : c.aging.includes('61') ? C.amber : C.green,
                        fontWeight: 700,
                      }}>{c.aging}</span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: C.muted, fontSize: 11 }}>{c.lastActivity}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {c.flags.map(f => (
                          <span key={f} style={{
                            fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3, whiteSpace: 'nowrap',
                            background: f.includes('DISPUTED') ? C.red + '20' : f.includes('PTP') ? C.purple + '20' : f.includes('BANK') ? '#dc262620' : C.amber + '20',
                            color: f.includes('DISPUTED') ? C.red : f.includes('PTP') ? C.purple : f.includes('BANK') ? C.red : C.amber,
                          }}>{f}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '8px 16px', textAlign: 'left' }}>
                      <span style={{
                        fontSize: 11, color: C.orange, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        {c.nextAction} →
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Activity log */}
        {actionLog.length > 0 && (
          <div style={{ flexShrink: 0, marginTop: '0.75rem', background: '#fff', border: `1px solid ${C.border}`, padding: '0.75rem', borderRadius: 2 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
              Recent Activity
            </div>
            {actionLog.map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.slate, marginBottom: 3 }}>
                <span>✓ {log.msg}</span>
                <span style={{ color: C.muted }}>{log.ts}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right action panel */}
      {selectedCustomer && (
        <ActionPanel
          customer={selectedCustomer}
          onAction={handleAction}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  )
}
