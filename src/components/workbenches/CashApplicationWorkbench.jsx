import { useState, useMemo } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close, Warning, CheckmarkOutline, Renew } from '@carbon/icons-react'

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

const fmt  = n => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`
const fmtN = n => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(3)}M` : `$${(n / 1_000).toFixed(1)}K`

// ─── Data ─────────────────────────────────────────────────────────────────────

const REMITTANCES = [
  { id: 'REM-24-8801', customer: 'Accenture Federal Services', bank: 'JPMorgan Chase',     amount: 4_200_000, received: 'May 20', method: 'Wire',  matched: 'AUTO',   matchedTo: 'INV-240857, INV-240862', confidence: 98, status: 'MATCHED',   unapplied: 0        },
  { id: 'REM-24-8802', customer: 'Deutsche Bank AG',            bank: 'Deutsche Bank',      amount: 1_950_000, received: 'May 20', method: 'SEPA',  matched: 'AUTO',   matchedTo: 'INV-240843',              confidence: 94, status: 'MATCHED',   unapplied: 0        },
  { id: 'REM-24-8803', customer: 'British Petroleum plc',       bank: 'Barclays',           amount: 3_100_000, received: 'May 19', method: 'CHAPS', matched: 'MANUAL', matchedTo: 'INV-240831',              confidence: 61, status: 'REVIEW',    unapplied: 100_000  },
  { id: 'REM-24-8804', customer: 'BNP Paribas',                 bank: 'BNP Paribas',        amount: 620_000,   received: 'May 19', method: 'SEPA',  matched: 'AUTO',   matchedTo: 'INV-240851',              confidence: 99, status: 'MATCHED',   unapplied: 0        },
  { id: 'REM-24-8805', customer: 'Nestlé S.A.',                 bank: 'UBS',                amount: 890_000,   received: 'May 18', method: 'Wire',  matched: 'NONE',   matchedTo: '',                        confidence: 0,  status: 'UNMATCHED', unapplied: 890_000  },
  { id: 'REM-24-8806', customer: 'Siemens AG',                  bank: 'Commerzbank',        amount: 2_250_000, received: 'May 18', method: 'Wire',  matched: 'AUTO',   matchedTo: 'INV-240844, INV-240852',  confidence: 96, status: 'MATCHED',   unapplied: 0        },
  { id: 'REM-24-8807', customer: 'Tata Consultancy Services',   bank: 'HDFC Bank',          amount: 740_000,   received: 'May 17', method: 'SWIFT', matched: 'MANUAL', matchedTo: 'INV-240838',              confidence: 55, status: 'SHORT PAY', unapplied: 200_000  },
  { id: 'REM-24-8808', customer: 'Rio Tinto Group',             bank: 'ANZ',                amount: 2_100_000, received: 'May 17', method: 'Wire',  matched: 'AUTO',   matchedTo: 'INV-240849',              confidence: 99, status: 'MATCHED',   unapplied: 0        },
  { id: 'REM-24-8809', customer: 'Toyota Motor Corporation',    bank: 'MUFG',               amount: 550_000,   received: 'May 16', method: 'SWIFT', matched: 'AUTO',   matchedTo: 'INV-240829',              confidence: 97, status: 'MATCHED',   unapplied: 0        },
  { id: 'REM-24-8810', customer: 'Amazon Web Services',         bank: 'Bank of America',    amount: 3_950_000, received: 'May 16', method: 'ACH',   matched: 'AUTO',   matchedTo: 'INV-240855, INV-240861',  confidence: 100, status: 'MATCHED',  unapplied: 0        },
]

const MATCH_RULES = [
  { id: 'MR-001', name: 'Exact invoice number from remittance advice', priority: 1, hitRate: 62, type: 'Reference Match', active: true  },
  { id: 'MR-002', name: 'Exact amount + customer IBAN',               priority: 2, hitRate: 18, type: 'Amount + Bank',   active: true  },
  { id: 'MR-003', name: 'Amount within ±$500 tolerance',              priority: 3, hitRate: 8,  type: 'Fuzzy Amount',    active: true  },
  { id: 'MR-004', name: 'Multi-invoice sum matching',                 priority: 4, hitRate: 7,  type: 'Aggregation',     active: true  },
  { id: 'MR-005', name: 'ML pattern matching (customer history)',     priority: 5, hitRate: 3,  type: 'ML Model',        active: true  },
  { id: 'MR-006', name: 'Manual review (no rule matched)',            priority: 6, hitRate: 2,  type: 'Manual',          active: true  },
  { id: 'MR-007', name: 'Legacy ERP reference code lookup',          priority: 7, hitRate: 0,  type: 'Reference Match', active: false },
]

const SHORT_PAYS = [
  { id: 'SP-001', customer: 'Tata Consultancy Services',   invoice: 'INV-240838', billed: 940_000,   paid: 740_000,   gap: 200_000, reason: 'Services not delivered', status: 'OPEN',     age: 5,  owner: 'R. Mehta'    },
  { id: 'SP-002', customer: 'British Petroleum plc',       invoice: 'INV-240831', billed: 3_200_000, paid: 3_100_000, gap: 100_000, reason: 'Deduction — rebate',      status: 'REVIEW',   age: 3,  owner: 'A. Clarke'   },
  { id: 'SP-003', customer: 'Deutsche Bank AG',             invoice: 'INV-240820', billed: 2_150_000, paid: 2_080_000, gap: 70_000,  reason: 'Bank fees deducted',      status: 'RESOLVED', age: 14, owner: 'P. Müller'   },
  { id: 'SP-004', customer: 'Nestlé S.A.',                  invoice: 'INV-240815', billed: 890_000,   paid: 0,         gap: 890_000, reason: 'Payment not received',    status: 'ESCALATED',age: 8,  owner: 'L. Dubois'   },
  { id: 'SP-005', customer: 'Siemens AG',                   invoice: 'INV-240809', billed: 1_780_000, paid: 1_750_000, gap: 30_000,  reason: 'Price dispute on T&M',    status: 'OPEN',     age: 2,  owner: 'K. Fischer'  },
]

const BANK_RECS = [
  { bank: 'JPMorgan Chase (USD)',  glBalance: 48_200_000, bankBalance: 48_215_000, variance: 15_000,   outstandingItems: 3,  status: 'MINOR',   lastRec: 'May 19' },
  { bank: 'Deutsche Bank (EUR)',   glBalance: 22_100_000, bankBalance: 22_100_000, variance: 0,        outstandingItems: 0,  status: 'CLEAR',   lastRec: 'May 20' },
  { bank: 'Barclays (GBP)',        glBalance: 14_800_000, bankBalance: 14_750_000, variance: -50_000,  outstandingItems: 7,  status: 'HOLD',    lastRec: 'May 18' },
  { bank: 'ANZ (AUD)',             glBalance: 9_400_000,  bankBalance: 9_400_000,  variance: 0,        outstandingItems: 0,  status: 'CLEAR',   lastRec: 'May 20' },
  { bank: 'MUFG (JPY equiv)',      glBalance: 6_300_000,  bankBalance: 6_298_000,  variance: -2_000,   outstandingItems: 2,  status: 'MINOR',   lastRec: 'May 19' },
]

// ─── Header ───────────────────────────────────────────────────────────────────

function WBHeader({ onClose }) {
  return (
    <div style={{
      background: '#0E2841', color: '#fff', flexShrink: 0,
      padding: '0.875rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      borderBottom: '1px solid #393939',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 6,
        background: '#156082', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 16, flexShrink: 0,
      }}>⬡</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Cash Application Workbench</div>
        <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>
          O2C — Remittance Matching · Short Pay Disputes · Bank Reconciliation
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tag type="green" size="sm">Wave 3 · Live</Tag>
        <Button size="sm" kind="ghost" renderIcon={Close} iconDescription="Close" hasIconOnly onClick={onClose} />
      </div>
    </div>
  )
}

// ─── KPI strip ────────────────────────────────────────────────────────────────

function KPIStrip() {
  const totalReceived = REMITTANCES.reduce((s, r) => s + r.amount, 0)
  const autoMatched   = REMITTANCES.filter(r => r.matched === 'AUTO' && r.status === 'MATCHED').length
  const autoRate      = Math.round((autoMatched / REMITTANCES.length) * 100)
  const unmatched     = REMITTANCES.filter(r => r.status === 'UNMATCHED' || r.status === 'SHORT PAY').length
  const unapplied     = REMITTANCES.reduce((s, r) => s + r.unapplied, 0)

  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
      {[
        { label: 'Cash Received Today',  value: fmt(totalReceived), sub: `${REMITTANCES.length} remittances`,     color: C.green  },
        { label: 'Auto-Match Rate',      value: `${autoRate}%`,     sub: `${autoMatched} fully matched`,          color: C.blue   },
        { label: 'Exceptions',           value: `${unmatched}`,     sub: 'Need manual intervention',              color: C.red    },
        { label: 'Unapplied Cash',       value: fmt(unapplied),     sub: 'Awaiting invoice matching',             color: C.amber  },
      ].map(k => (
        <div key={k.label} style={{
          flex: 1, padding: '0.875rem 1.25rem',
          borderRight: `1px solid ${C.border}`, borderTop: `3px solid ${k.color}`,
        }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{k.label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 4, fontWeight: 500 }}>{k.sub}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Tab: Remittance Queue ────────────────────────────────────────────────────

const STATUS_META = {
  MATCHED:   { bg: '#dcfce7', color: C.green,   label: 'Matched'    },
  REVIEW:    { bg: '#fff7ed', color: '#c2410c',  label: 'Review'     },
  UNMATCHED: { bg: '#fef2f2', color: C.red,      label: 'Unmatched'  },
  'SHORT PAY': { bg: '#fdf4ff', color: C.purple, label: 'Short Pay'  },
}

function RemittanceQueue() {
  const [filter, setFilter] = useState('ALL')
  const filtered = useMemo(() =>
    filter === 'ALL' ? REMITTANCES : REMITTANCES.filter(r => r.status === filter),
    [filter]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.875rem' }}>
      {/* Filter row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Status:</span>
        {['ALL', 'MATCHED', 'REVIEW', 'UNMATCHED', 'SHORT PAY'].map(s => {
          const m = STATUS_META[s]
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '5px 14px', borderRadius: 4, border: '1px solid',
              borderColor: filter === s ? (m?.color || C.navy) : C.border,
              background: filter === s ? ((m?.color || C.navy) + '15') : '#fff',
              color: filter === s ? (m?.color || C.navy) : C.slate,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>{s === 'ALL' ? 'All Remittances' : m?.label || s}</button>
          )
        })}
        <button style={{
          marginLeft: 'auto', padding: '5px 14px', borderRadius: 4,
          background: C.blue + '15', color: C.blue, border: `1px solid ${C.blue}`,
          fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Renew size={13} /> Re-run Match
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              {['Remittance ID', 'Customer', 'Bank', 'Received', 'Method', 'Amount', 'Matched To', 'Confidence', 'Unapplied', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px',
                  textAlign: h === 'Remittance ID' || h === 'Customer' || h === 'Bank' || h === 'Matched To' ? 'left' : 'right',
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const sm = STATUS_META[r.status] || STATUS_META.MATCHED
              return (
                <tr key={r.id} style={{
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${sm.color}`,
                }}>
                  <td style={{ padding: '9px 12px', fontWeight: 600, color: C.blue, fontSize: 11, whiteSpace: 'nowrap' }}>{r.id}</td>
                  <td style={{ padding: '9px 12px', fontWeight: 600, color: C.navy, fontSize: 11 }}>{r.customer}</td>
                  <td style={{ padding: '9px 12px', color: C.slate, fontSize: 11 }}>{r.bank}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', color: C.slate, fontSize: 11 }}>{r.received}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                      background: '#e5f6ff', color: C.blue,
                    }}>{r.method}</span>
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: C.navy }}>{fmtN(r.amount)}</td>
                  <td style={{ padding: '9px 12px', fontSize: 10, color: C.muted, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.matchedTo || <span style={{ color: C.red, fontWeight: 600 }}>—</span>}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                    {r.confidence > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                        <div style={{ width: 48, height: 5, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${r.confidence}%`, height: '100%', borderRadius: 3,
                            background: r.confidence >= 90 ? C.green : r.confidence >= 70 ? C.amber : C.red,
                          }} />
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          color: r.confidence >= 90 ? C.green : r.confidence >= 70 ? C.amber : C.red,
                        }}>{r.confidence}%</span>
                      </div>
                    ) : <span style={{ color: C.muted, fontSize: 10 }}>—</span>}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: r.unapplied > 0 ? C.red : C.muted, fontSize: 11 }}>
                    {r.unapplied > 0 ? fmtN(r.unapplied) : '—'}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: sm.bg, color: sm.color,
                    }}>{sm.label}</span>
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

// ─── Tab: Matching Rules ──────────────────────────────────────────────────────

function MatchingRules() {
  const [rules, setRules] = useState(MATCH_RULES)
  const totalHit = rules.filter(r => r.active).reduce((s, r) => s + r.hitRate, 0)

  const toggle = (id) => setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r))

  const TYPE_COLORS = {
    'Reference Match': C.blue,
    'Amount + Bank':   C.green,
    'Fuzzy Amount':    C.amber,
    'Aggregation':     C.purple,
    'ML Model':        '#0891b2',
    'Manual':          C.slate,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Active Rules',    value: rules.filter(r => r.active).length, color: C.green },
          { label: 'Auto-Match Coverage', value: `${totalHit}%`, color: C.blue  },
          { label: 'Manual Review',   value: `${100 - totalHit}%`, color: C.amber },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            borderTop: `3px solid ${k.color}`, padding: '0.75rem 1rem', borderRadius: 2,
          }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, lineHeight: 1.2 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Waterfall cascade */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Matching Rule Cascade (Priority Order)
          </span>
          <span style={{ fontSize: 10, color: C.muted }}>Hit rate = % of remittances matched by this rule</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['#', 'Rule Name', 'Type', 'Hit Rate', 'Waterfall', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px',
                  textAlign: h === 'Rule Name' ? 'left' : h === '#' ? 'center' : 'right',
                  fontSize: 10, fontWeight: 600, color: C.muted,
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => {
              const tc = TYPE_COLORS[r.type] || C.slate
              return (
                <tr key={r.id} style={{
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  opacity: r.active ? 1 : 0.5,
                }}>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: C.muted, fontSize: 11 }}>{r.priority}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, color: C.navy, fontSize: 12 }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{r.id}</div>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                      background: tc + '20', color: tc,
                    }}>{r.type}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: tc, fontSize: 13 }}>
                    {r.hitRate}%
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ width: '100%', height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${r.hitRate}%`, height: '100%', background: tc, borderRadius: 4,
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <button onClick={() => toggle(r.id)} style={{
                      padding: '4px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: r.active ? C.green + '20' : C.muted + '20',
                      color: r.active ? C.green : C.muted,
                      fontWeight: 700, fontSize: 11, transition: 'all 0.15s',
                    }}>
                      {r.active ? '● Active' : '○ Off'}
                    </button>
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

// ─── Tab: Short Pay & Disputes ────────────────────────────────────────────────

function ShortPayDisputes() {
  const SP_STATUS_META = {
    OPEN:      { bg: '#fff7ed', color: '#c2410c',  label: 'Open'      },
    REVIEW:    { bg: '#eff6ff', color: C.blue,     label: 'In Review' },
    ESCALATED: { bg: '#fef2f2', color: C.red,      label: 'Escalated' },
    RESOLVED:  { bg: '#dcfce7', color: C.green,    label: 'Resolved'  },
  }

  const totalGap = SHORT_PAYS.reduce((s, sp) => s + sp.gap, 0)
  const openCount = SHORT_PAYS.filter(sp => sp.status !== 'RESOLVED').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Open Disputes', value: `${openCount}`, color: C.amber },
          { label: 'Total Gap',     value: fmt(totalGap),  color: C.red   },
          { label: 'Avg Age',       value: `${Math.round(SHORT_PAYS.filter(s => s.status !== 'RESOLVED').reduce((s, sp) => s + sp.age, 0) / openCount)}d`, color: C.slate },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            borderTop: `3px solid ${k.color}`, padding: '0.75rem 1rem', borderRadius: 2,
          }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, lineHeight: 1.2 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Disputes table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Short Pay & Dispute Register
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['ID', 'Customer', 'Invoice', 'Billed', 'Paid', 'Gap', 'Reason', 'Owner', 'Age', 'Status', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px',
                  textAlign: h === 'ID' || h === 'Customer' || h === 'Invoice' || h === 'Reason' || h === 'Owner' ? 'left' : 'right',
                  fontSize: 10, fontWeight: 600, color: C.muted,
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHORT_PAYS.map((sp, i) => {
              const sm = SP_STATUS_META[sp.status] || SP_STATUS_META.OPEN
              return (
                <tr key={sp.id} style={{
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${sm.color}`,
                }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: C.blue, fontSize: 11 }}>{sp.id}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy, fontSize: 11 }}>{sp.customer.split(' ').slice(0,3).join(' ')}</td>
                  <td style={{ padding: '10px 12px', color: C.muted, fontSize: 10 }}>{sp.invoice}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: C.slate, fontWeight: 600 }}>{fmtN(sp.billed)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: sp.paid === 0 ? C.red : C.green, fontWeight: 600 }}>
                    {sp.paid === 0 ? '—' : fmtN(sp.paid)}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: C.red }}>{fmtN(sp.gap)}</td>
                  <td style={{ padding: '10px 12px', color: C.slate, fontSize: 11 }}>{sp.reason}</td>
                  <td style={{ padding: '10px 12px', color: C.slate, fontSize: 11 }}>{sp.owner}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: sp.age > 7 ? C.red : C.amber }}>{sp.age}d</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: sm.bg, color: sm.color,
                    }}>{sm.label}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    {sp.status !== 'RESOLVED' && (
                      <button style={{
                        padding: '4px 10px', borderRadius: 4, border: `1px solid ${C.border}`,
                        background: '#fff', color: C.navy, fontSize: 10, fontWeight: 600, cursor: 'pointer',
                      }}>Review →</button>
                    )}
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

// ─── Tab: Bank Reconciliation ─────────────────────────────────────────────────

function BankReconciliation() {
  const REC_STATUS = {
    CLEAR: { bg: '#dcfce7', color: C.green,  label: 'Clear'      },
    MINOR: { bg: '#fff7ed', color: '#c2410c', label: 'Minor Var'  },
    HOLD:  { bg: '#fef2f2', color: C.red,    label: 'On Hold'    },
  }

  const totalGL   = BANK_RECS.reduce((s, r) => s + r.glBalance, 0)
  const totalBank = BANK_RECS.reduce((s, r) => s + r.bankBalance, 0)
  const totalVar  = totalBank - totalGL

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total GL Balance',   value: fmt(totalGL),   color: C.navy   },
          { label: 'Total Bank Balance', value: fmt(totalBank), color: C.blue   },
          { label: 'Net Variance',       value: (totalVar >= 0 ? '+' : '') + fmt(Math.abs(totalVar)), color: Math.abs(totalVar) < 20_000 ? C.green : C.red },
          { label: 'Accounts Cleared',   value: `${BANK_RECS.filter(r => r.status === 'CLEAR').length} / ${BANK_RECS.length}`, color: C.green },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            borderTop: `3px solid ${k.color}`, padding: '0.75rem 1rem', borderRadius: 2,
          }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Rec table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Bank Account Reconciliation
          </span>
          <button style={{
            padding: '5px 14px', borderRadius: 4, border: `1px solid ${C.blue}`,
            background: C.blue + '15', color: C.blue, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Renew size={13} /> Auto-Reconcile All
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['Bank Account', 'GL Balance', 'Bank Balance', 'Variance', 'Outstanding Items', 'Last Rec.', 'Status', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px',
                  textAlign: h === 'Bank Account' ? 'left' : 'right',
                  fontSize: 10, fontWeight: 600, color: C.muted,
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BANK_RECS.map((r, i) => {
              const sm = REC_STATUS[r.status] || REC_STATUS.CLEAR
              const varColor = r.variance === 0 ? C.green : Math.abs(r.variance) < 10_000 ? C.amber : C.red
              return (
                <tr key={r.bank} style={{
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${sm.color}`,
                }}>
                  <td style={{ padding: '12px 12px', fontWeight: 600, color: C.navy }}>{r.bank}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: C.slate }}>{fmt(r.glBalance)}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: C.slate }}>{fmt(r.bankBalance)}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 800, color: varColor }}>
                    {r.variance === 0 ? '—' : (r.variance > 0 ? '+' : '') + fmtN(r.variance)}
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: r.outstandingItems > 0 ? C.amber : C.green }}>
                    {r.outstandingItems > 0 ? r.outstandingItems : '✓ 0'}
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', color: C.muted, fontSize: 11 }}>{r.lastRec}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: sm.bg, color: sm.color,
                    }}>{sm.label}</span>
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                    {r.status !== 'CLEAR' ? (
                      <button style={{
                        padding: '4px 10px', borderRadius: 4, border: `1px solid ${C.border}`,
                        background: '#fff', color: C.navy, fontSize: 10, fontWeight: 600, cursor: 'pointer',
                      }}>Reconcile →</button>
                    ) : (
                      <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>✓ Done</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
          {/* Footer */}
          <tfoot>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              <td style={{ padding: '10px 12px', fontWeight: 700 }}>Total</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>{fmt(totalGL)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>{fmt(totalBank)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: Math.abs(totalVar) < 20_000 ? '#86efac' : '#fca5a5' }}>
                {(totalVar >= 0 ? '+' : '') + fmtN(totalVar)}
              </td>
              <td colSpan={4} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Agent note */}
      <div style={{
        background: '#eff6ff', border: `1px solid ${C.blue}30`, borderRadius: 4,
        padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>⬡</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 3 }}>Cash Agent — Automated Observation</div>
          <div style={{ fontSize: 11, color: C.navy, lineHeight: 1.5 }}>
            Barclays GBP account shows a £50K variance from 7 unmatched items. Agent has identified 5 of 7 as in-transit wires (ETA May 22).
            2 items require manual review — flagged to Priya Singh (Treasury). Auto-reconciliation scheduled after confirmation.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab bar & main export ────────────────────────────────────────────────────

const TABS = [
  { id: 'queue',    label: 'Remittance Queue'     },
  { id: 'rules',    label: 'Matching Rules'        },
  { id: 'disputes', label: 'Short Pay & Disputes'  },
  { id: 'bankrec',  label: 'Bank Reconciliation'   },
]

export default function CashApplicationWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState('queue')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <WBHeader onClose={onClose} />
      <KPIStrip />

      {/* Tab bar */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '0.75rem 1.25rem', border: 'none', background: 'none',
            borderBottom: activeTab === t.id ? `2px solid ${C.blue}` : '2px solid transparent',
            color: activeTab === t.id ? C.blue : C.slate,
            fontWeight: activeTab === t.id ? 700 : 400,
            fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.5rem' }}>
        {activeTab === 'queue'    && <RemittanceQueue />}
        {activeTab === 'rules'    && <MatchingRules />}
        {activeTab === 'disputes' && <ShortPayDisputes />}
        {activeTab === 'bankrec'  && <BankReconciliation />}
      </div>
    </div>
  )
}
