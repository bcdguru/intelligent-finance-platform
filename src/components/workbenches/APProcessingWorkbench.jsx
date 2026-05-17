import { useState } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close } from '@carbon/icons-react'

const C = {
  navy:   '#0E2841',
  iconBg: '#156082',
  blue:   '#0072c3',
  green:  '#24a148',
  red:    '#da1e28',
  amber:  '#f1c21b',
  bg:     '#f4f4f4',
  border: '#393939',
  sub:    '#525252',
  muted:  '#8d8d8d',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const INVOICES = [
  { id: 'INV-2025-0842', supplier: 'Siemens AG',        amount: 184500, cur: 'USD', po: 'PO-4401', status: 'Auto-Posted', touchless: true,  received: '2025-05-14', due: '2025-06-13', matchType: '3-Way' },
  { id: 'INV-2025-0841', supplier: 'Henkel GmbH',        amount:  22800, cur: 'USD', po: 'PO-4398', status: 'Exception',   touchless: false, received: '2025-05-14', due: '2025-06-14', matchType: 'Price Var', flag: '+8.2% price variance' },
  { id: 'INV-2025-0840', supplier: 'BASF Corp',           amount:  67200, cur: 'USD', po: 'PO-4392', status: 'Approved',    touchless: true,  received: '2025-05-13', due: '2025-06-12', matchType: '3-Way' },
  { id: 'INV-2025-0839', supplier: 'Bosch Industrial',    amount:  12400, cur: 'EUR', po: 'PO-4389', status: 'Auto-Posted', touchless: true,  received: '2025-05-13', due: '2025-06-12', matchType: '2-Way' },
  { id: 'INV-2025-0838', supplier: 'Oracle Corp',         amount:  48000, cur: 'USD', po: 'PO-4385', status: 'Matching',   touchless: false, received: '2025-05-13', due: '2025-06-13', matchType: 'Service' },
  { id: 'INV-2025-0837', supplier: 'ABB Ltd',             amount:  94300, cur: 'USD', po: '—',       status: 'Exception',  touchless: false, received: '2025-05-12', due: '2025-06-11', matchType: 'Missing PO', flag: 'No PO reference' },
  { id: 'INV-2025-0836', supplier: 'Schneider Electric',  amount:  31600, cur: 'USD', po: 'PO-4379', status: 'Scheduled',  touchless: true,  received: '2025-05-12', due: '2025-06-11', matchType: '3-Way' },
  { id: 'INV-2025-0835', supplier: 'Linde PLC',           amount:   8750, cur: 'USD', po: 'PO-4376', status: 'Paid',       touchless: true,  received: '2025-05-10', due: '2025-06-09', matchType: '3-Way' },
  { id: 'INV-2025-0834', supplier: 'Honeywell Intl',      amount: 156000, cur: 'USD', po: 'PO-4374', status: 'Auto-Posted', touchless: true,  received: '2025-05-10', due: '2025-06-09', matchType: '3-Way' },
  { id: 'INV-2025-0833', supplier: 'DHL Supply Chain',    amount:   5200, cur: 'USD', po: 'PO-4371', status: 'Exception',  touchless: false, received: '2025-05-09', due: '2025-06-08', matchType: 'Duplicate', flag: 'Possible dup of INV-2025-0820' },
  { id: 'INV-2025-0832', supplier: 'Caterpillar Inc',     amount: 284000, cur: 'USD', po: 'PO-4368', status: 'Approved',   touchless: true,  received: '2025-05-09', due: '2025-06-08', matchType: '3-Way' },
  { id: 'INV-2025-0831', supplier: 'Thales Group',        amount:  43500, cur: 'EUR', po: 'PO-4365', status: 'Received',   touchless: false, received: '2025-05-15', due: '2025-06-14', matchType: 'Service' },
]

const EXCEPTIONS = [
  {
    id: 'EXC-0841', invoiceId: 'INV-2025-0841', supplier: 'Henkel GmbH',
    amount: 22800, type: 'Price Variance', priority: 'Medium',
    detail: 'Invoice price $48.50/unit vs PO price $44.80/unit (+8.2%)',
    suggestion: 'Check blanket order amendment BPO-2024-118 — price increase approved Q2 2025',
    actions: ['Approve with note', 'Query supplier', 'Block payment'],
  },
  {
    id: 'EXC-0837', invoiceId: 'INV-2025-0837', supplier: 'ABB Ltd',
    amount: 94300, type: 'Missing PO', priority: 'High',
    detail: 'Invoice submitted without PO reference. Goods receipt confirmed via WMS.',
    suggestion: 'Create retrospective PO against cost centre CC-4401 (IT Infrastructure)',
    actions: ['Create retro PO', 'Reject invoice', 'Escalate to buyer'],
  },
  {
    id: 'EXC-0833', invoiceId: 'INV-2025-0833', supplier: 'DHL Supply Chain',
    amount: 5200, type: 'Duplicate', priority: 'High',
    detail: 'Invoice DHL-DE-88221 matches INV-2025-0820 (paid 2025-04-28, $5,200)',
    suggestion: 'Confidence 99.1% duplicate. Block payment and auto-notify supplier.',
    actions: ['Block & notify', 'Mark duplicate', 'Request clarification'],
  },
  {
    id: 'EXC-0829', invoiceId: 'INV-2025-0829', supplier: 'Kuehne+Nagel',
    amount: 18400, type: 'Qty Mismatch', priority: 'Medium',
    detail: 'GR quantity 240 units vs invoiced 260 units (delta 20 units, $1,540)',
    suggestion: 'GR confirmed short delivery — issue partial payment for 240 units, query balance',
    actions: ['Partial pay', 'Hold full payment', 'Escalate logistics'],
  },
]

const PAYMENT_RUNS = [
  { id: 'PAY-RUN-0522', date: '2025-05-22', method: 'SEPA Credit Transfer', cur: 'EUR', count: 34, total: 1284500, discount: 28400, status: 'Scheduled', dpo: 41 },
  { id: 'PAY-RUN-0529', date: '2025-05-29', method: 'USD Wire Transfer',     cur: 'USD', count: 22, total:  847200, discount: 12600, status: 'Draft',     dpo: 38 },
]

const DISCOUNTS = [
  { supplier: 'Siemens AG',       invoiceId: 'INV-2025-0842', amount: 184500, terms: '2/10 Net 30',  saving: 3690, deadline: '2025-05-24', status: 'Available' },
  { supplier: 'Honeywell Intl',   invoiceId: 'INV-2025-0834', amount: 156000, terms: '2/10 Net 30',  saving: 3120, deadline: '2025-05-20', status: 'Available' },
  { supplier: 'Caterpillar Inc',  invoiceId: 'INV-2025-0832', amount: 284000, terms: '1.5/10 Net 45',saving: 4260, deadline: '2025-05-19', status: 'Expired'   },
  { supplier: 'Schneider Electric', invoiceId: 'INV-2025-0836', amount: 31600, terms: '2/10 Net 30', saving:  632, deadline: '2025-05-22', status: 'Available' },
]

const SUPPLIER_STMTS = [
  { supplier: 'Siemens AG',         cur: 'USD', ourBal: -184500, theirBal: -184500, variance:    0, status: 'Reconciled', invoices: 3, lastRecon: '2025-05-15' },
  { supplier: 'Henkel GmbH',        cur: 'USD', ourBal:  -22800, theirBal:  -22800, variance:    0, status: 'In Dispute', invoices: 1, lastRecon: '2025-05-10', note: 'Price variance dispute pending' },
  { supplier: 'BASF Corp',          cur: 'USD', ourBal:  -67200, theirBal:  -71400, variance: 4200, status: 'Variance',   invoices: 2, lastRecon: '2025-05-12' },
  { supplier: 'Bosch Industrial',   cur: 'EUR', ourBal:  -12400, theirBal:  -12400, variance:    0, status: 'Reconciled', invoices: 2, lastRecon: '2025-05-14' },
  { supplier: 'Caterpillar Inc',    cur: 'USD', ourBal: -284000, theirBal: -284000, variance:    0, status: 'Reconciled', invoices: 4, lastRecon: '2025-05-13' },
  { supplier: 'Oracle Corp',        cur: 'USD', ourBal:  -48000, theirBal:  -48000, variance:    0, status: 'Pending',    invoices: 1, lastRecon: '2025-05-08' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

function StatusTag({ status }) {
  const map = {
    'Auto-Posted': { type: 'green',  label: 'Auto-Posted' },
    'Approved':    { type: 'green',  label: 'Approved'    },
    'Paid':        { type: 'gray',   label: 'Paid'        },
    'Scheduled':   { type: 'blue',   label: 'Scheduled'   },
    'Matching':    { type: 'purple', label: 'Matching'    },
    'Received':    { type: 'teal',   label: 'Received'    },
    'Exception':   { type: 'red',    label: 'Exception'   },
  }
  const m = map[status] || { type: 'gray', label: status }
  return <Tag type={m.type} size="sm">{m.label}</Tag>
}

function PriorityDot({ priority }) {
  const color = priority === 'High' ? C.red : C.amber
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 4 }} />
}

// ─── Tab: Invoice Pipeline ────────────────────────────────────────────────────
const INV_FILTERS = ['All', 'Auto-Posted', 'Exception', 'Matching', 'Approved', 'Scheduled', 'Received', 'Paid']

function InvoicePipeline() {
  const [filter, setFilter]     = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'All' ? INVOICES : INVOICES.filter(i => i.status === filter)
  const kpis = {
    touchlessRate: Math.round((INVOICES.filter(i => i.touchless).length / INVOICES.length) * 100),
    exceptions:    INVOICES.filter(i => i.status === 'Exception').length,
    totalValue:    INVOICES.reduce((s, i) => s + i.amount, 0),
    avgAge:        3.4,
  }

  const sel = selected ? INVOICES.find(i => i.id === selected) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* KPI strip */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Touchless Rate', value: `${kpis.touchlessRate}%`,   sub: 'World-class: 84%',   color: C.green  },
          { label: 'Exceptions',     value: `${kpis.exceptions}`,        sub: 'Require attention',  color: C.red    },
          { label: 'Pipeline Value', value: `$${fmt(kpis.totalValue)}`,  sub: 'In process today',   color: C.blue   },
          { label: 'Avg Age',        value: `${kpis.avgAge}d`,           sub: 'Days in pipeline',   color: C.amber  },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: '1px solid #e0e0e0',
            borderTop: `3px solid ${k.color}`, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#161616', fontFamily: 'IBM Plex Mono, monospace' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {INV_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 12px', borderRadius: 2, border: '1px solid',
            borderColor: filter === f ? '#161616' : '#c6c6c6',
            background: filter === f ? '#161616' : 'transparent',
            color: filter === f ? '#fff' : C.sub,
            fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
          }}>{f}</button>
        ))}
      </div>

      {/* Split: list + detail */}
      <div style={{ display: 'flex', gap: 10, minHeight: 280 }}>
        {/* Invoice list */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e0e0e0', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #e0e0e0' }}>
                {['Invoice', 'Supplier', 'Amount', 'PO', 'Type', 'Status', 'Due'].map(h => (
                  <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr
                  key={inv.id}
                  onClick={() => setSelected(selected === inv.id ? null : inv.id)}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: selected === inv.id ? '#e5f6ff' : (inv.status === 'Exception' ? '#fff8f8' : '#fff'),
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '7px 10px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, whiteSpace: 'nowrap' }}>
                    {inv.id}
                    {inv.touchless && <span style={{ marginLeft: 4, fontSize: 8, color: C.green, fontWeight: 700 }}>⚡</span>}
                  </td>
                  <td style={{ padding: '7px 10px', fontWeight: 500 }}>{inv.supplier}</td>
                  <td style={{ padding: '7px 10px', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'right' }}>
                    {inv.cur} {fmt(inv.amount)}
                  </td>
                  <td style={{ padding: '7px 10px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: C.sub }}>{inv.po}</td>
                  <td style={{ padding: '7px 10px' }}>
                    <span style={{ fontSize: 10, padding: '2px 6px', background: '#f4f4f4', borderRadius: 2, color: C.sub }}>{inv.matchType}</span>
                  </td>
                  <td style={{ padding: '7px 10px' }}><StatusTag status={inv.status} /></td>
                  <td style={{ padding: '7px 10px', fontSize: 10, color: C.muted }}>{inv.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail pane */}
        <div style={{ width: 240, background: '#fff', border: '1px solid #e0e0e0', padding: sel ? 16 : 0, flexShrink: 0 }}>
          {sel ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#161616' }}>{sel.supplier}</div>
              <code style={{ fontSize: 10, color: C.blue, fontFamily: 'IBM Plex Mono, monospace' }}>{sel.id}</code>
              {[
                ['Amount',   `${sel.cur} ${fmt(sel.amount)}`],
                ['PO',       sel.po],
                ['Received', sel.received],
                ['Due',      sel.due],
                ['Match',    sel.matchType],
                ['Touchless',sel.touchless ? '✓ Yes' : '✗ Manual'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{k}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#161616' }}>{v}</div>
                </div>
              ))}
              {sel.flag && (
                <div style={{ background: '#fff8f8', border: '1px solid #ffd6d6', borderRadius: 3, padding: '8px 10px', fontSize: 11, color: C.red }}>
                  ⚠ {sel.flag}
                </div>
              )}
              <StatusTag status={sel.status} />
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: C.muted }}>Select an invoice</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Exception Manager ───────────────────────────────────────────────────
function ExceptionManager() {
  const [resolved, setResolved] = useState(new Set())

  const handleAction = (excId) => {
    setResolved(prev => new Set([...prev, excId]))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header stats */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Open Exceptions', value: EXCEPTIONS.length - resolved.size, color: C.red },
          { label: 'Avg Resolution', value: '1.8h', color: C.green },
          { label: 'Auto-Resolved Today', value: '14', color: C.blue },
          { label: 'Exception Rate', value: '6.2%', color: C.amber },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: '1px solid #e0e0e0',
            borderTop: `3px solid ${k.color}`, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#161616', fontFamily: 'IBM Plex Mono, monospace' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Exception cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {EXCEPTIONS.map(exc => {
          const isResolved = resolved.has(exc.id)
          return (
            <div key={exc.id} style={{
              background: isResolved ? '#f4fff6' : '#fff',
              border: `1px solid ${isResolved ? '#a7f0ba' : (exc.priority === 'High' ? '#ffd6d6' : '#ffe0b2')}`,
              borderLeft: `4px solid ${isResolved ? C.green : (exc.priority === 'High' ? C.red : C.amber)}`,
              borderRadius: 2, padding: '14px 16px',
              opacity: isResolved ? 0.65 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <PriorityDot priority={exc.priority} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#161616' }}>{exc.type}</span>
                  <span style={{ fontSize: 10, color: C.muted, fontFamily: 'IBM Plex Mono, monospace' }}>{exc.id}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.blue, fontFamily: 'IBM Plex Mono, monospace' }}>
                    ${fmt(exc.amount)}
                  </span>
                  {isResolved && <Tag type="green" size="sm">Resolved</Tag>}
                </div>
              </div>

              <div style={{ fontSize: 11, color: C.sub, marginBottom: 6 }}>
                <strong>{exc.supplier}</strong> · {exc.invoiceId}
              </div>
              <div style={{ fontSize: 11, color: '#161616', marginBottom: 6 }}>{exc.detail}</div>

              {/* AI suggestion */}
              <div style={{
                background: '#e5f6ff', border: '1px solid #bae6fd',
                borderRadius: 3, padding: '8px 10px', marginBottom: 10,
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 12, color: C.blue, flexShrink: 0 }}>⬡</span>
                <span style={{ fontSize: 11, color: '#0050a0' }}><strong>AI:</strong> {exc.suggestion}</span>
              </div>

              {!isResolved && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {exc.actions.map((action, i) => (
                    <button
                      key={action}
                      onClick={() => i === 0 && handleAction(exc.id)}
                      style={{
                        padding: '5px 12px', borderRadius: 2, fontSize: 11, cursor: 'pointer',
                        border: '1px solid',
                        background: i === 0 ? C.blue : 'transparent',
                        color: i === 0 ? '#fff' : C.sub,
                        borderColor: i === 0 ? C.blue : '#c6c6c6',
                        fontFamily: 'inherit', fontWeight: i === 0 ? 600 : 400,
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab: Payment Run ─────────────────────────────────────────────────────────
function PaymentRun() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Payment runs */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #e0e0e0', fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Scheduled Payment Runs
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: '1px solid #e0e0e0' }}>
              {['Run ID', 'Pay Date', 'Method', 'Invoices', 'Total Amount', 'Discount Captured', 'DPO', 'Status'].map(h => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYMENT_RUNS.map(run => (
              <tr key={run.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: C.blue }}>{run.id}</td>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{run.date}</td>
                <td style={{ padding: '10px 12px', color: C.sub }}>{run.method}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>{run.count}</td>
                <td style={{ padding: '10px 12px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>
                  {run.cur} {fmt(run.total)}
                </td>
                <td style={{ padding: '10px 12px', fontFamily: 'IBM Plex Mono, monospace', color: C.green, fontWeight: 600 }}>
                  +${fmt(run.discount)}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>{run.dpo}d</td>
                <td style={{ padding: '10px 12px' }}>
                  <Tag type={run.status === 'Scheduled' ? 'blue' : 'gray'} size="sm">{run.status}</Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Early pay discount opportunities */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Early Pay Discount Opportunities
          </span>
          <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>
            ${fmt(DISCOUNTS.filter(d => d.status === 'Available').reduce((s, d) => s + d.saving, 0))} available
          </span>
        </div>
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DISCOUNTS.map(d => (
            <div key={d.invoiceId} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              background: d.status === 'Available' ? '#f0fff4' : '#fafafa',
              border: `1px solid ${d.status === 'Available' ? '#a7f0ba' : '#e0e0e0'}`,
              borderRadius: 2,
            }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{d.supplier}</span>
                <span style={{ fontSize: 10, color: C.muted, marginLeft: 6, fontFamily: 'IBM Plex Mono, monospace' }}>{d.invoiceId}</span>
              </div>
              <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: C.sub }}>${fmt(d.amount)}</span>
              <span style={{ fontSize: 11, padding: '2px 8px', background: '#e5f6ff', color: C.blue, borderRadius: 2 }}>{d.terms}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: d.status === 'Available' ? C.green : C.muted, fontFamily: 'IBM Plex Mono, monospace' }}>
                +${fmt(d.saving)}
              </span>
              <span style={{ fontSize: 10, color: C.muted }}>by {d.deadline}</span>
              <Tag type={d.status === 'Available' ? 'green' : 'gray'} size="sm">{d.status}</Tag>
              {d.status === 'Available' && (
                <button style={{
                  padding: '4px 10px', background: C.green, color: '#fff',
                  border: 'none', borderRadius: 2, fontSize: 10, cursor: 'pointer',
                  fontWeight: 600, fontFamily: 'inherit',
                }}>Capture</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DPO gauge */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Current DPO',        value: '41d', sub: 'World-class: 58d', color: C.blue  },
          { label: 'Discount Capture',   value: '73%', sub: 'World-class: 78%', color: C.green },
          { label: 'Working Capital',    value: '$2.1M', sub: 'Released this quarter', color: C.blue },
          { label: 'Avg Payment Cycle',  value: '3.2d', sub: 'From approval to pay',  color: C.green },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: '1px solid #e0e0e0',
            borderTop: `3px solid ${k.color}`, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#161616', fontFamily: 'IBM Plex Mono, monospace' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Supplier Statements ─────────────────────────────────────────────────
function SupplierStatements() {
  const statusColor = { Reconciled: C.green, 'In Dispute': C.red, Variance: C.amber, Pending: C.blue }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Reconciled',   value: SUPPLIER_STMTS.filter(s => s.status === 'Reconciled').length,   color: C.green },
          { label: 'Variance',     value: SUPPLIER_STMTS.filter(s => s.status === 'Variance').length,     color: C.amber },
          { label: 'In Dispute',   value: SUPPLIER_STMTS.filter(s => s.status === 'In Dispute').length,   color: C.red   },
          { label: 'Pending',      value: SUPPLIER_STMTS.filter(s => s.status === 'Pending').length,      color: C.blue  },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: '1px solid #e0e0e0',
            borderTop: `3px solid ${k.color}`, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#161616' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Statements table */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #e0e0e0', fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Supplier Statement Reconciliation
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: '1px solid #e0e0e0' }}>
              {['Supplier', 'Our Balance', 'Supplier Balance', 'Variance', 'Invoices', 'Last Recon', 'Status'].map(h => (
                <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SUPPLIER_STMTS.map(s => (
              <tr key={s.supplier} style={{
                borderBottom: '1px solid #f0f0f0',
                background: s.status === 'Variance' ? '#fffbf0' : (s.status === 'In Dispute' ? '#fff8f8' : '#fff'),
              }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                  {s.supplier}
                  {s.note && <div style={{ fontSize: 10, color: C.red, marginTop: 2 }}>{s.note}</div>}
                </td>
                <td style={{ padding: '10px 12px', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'right' }}>
                  {s.cur} ({fmt(Math.abs(s.ourBal))})
                </td>
                <td style={{ padding: '10px 12px', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'right' }}>
                  {s.cur} ({fmt(Math.abs(s.theirBal))})
                </td>
                <td style={{ padding: '10px 12px', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'right',
                  color: s.variance > 0 ? C.amber : C.green, fontWeight: s.variance > 0 ? 700 : 400 }}>
                  {s.variance > 0 ? `+${fmt(s.variance)}` : '—'}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>{s.invoices}</td>
                <td style={{ padding: '10px 12px', color: C.muted, fontSize: 10 }}>{s.lastRecon}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 2,
                    background: (statusColor[s.status] || C.muted) + '18',
                    color: statusColor[s.status] || C.muted,
                    border: `1px solid ${(statusColor[s.status] || C.muted)}30`,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[s.status] || C.muted }} />
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aging analysis */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          AP Aging Profile
        </div>
        <div style={{ display: 'flex', gap: 0, height: 32, borderRadius: 2, overflow: 'hidden' }}>
          {[
            { label: 'Current',   pct: 62, color: '#16a34a' },
            { label: '1–30d',     pct: 21, color: '#65a30d' },
            { label: '31–60d',    pct: 10, color: '#d97706' },
            { label: '61–90d',    pct:  5, color: '#ea580c' },
            { label: '90d+',      pct:  2, color: '#dc2626' },
          ].map(a => (
            <div key={a.label} style={{ width: `${a.pct}%`, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: a.pct > 5 ? 'auto' : 0 }}>
              {a.pct > 7 && <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{a.pct}%</span>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          {[
            { label: 'Current', pct: 62, color: '#16a34a' },
            { label: '1–30d', pct: 21, color: '#65a30d' },
            { label: '31–60d', pct: 10, color: '#d97706' },
            { label: '61–90d', pct: 5, color: '#ea580c' },
            { label: '90d+', pct: 2, color: '#dc2626' },
          ].map(a => (
            <span key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 1, background: a.color }} />
              <span style={{ color: C.sub }}>{a.label} {a.pct}%</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main workbench ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'pipeline',    label: 'Invoice Pipeline'   },
  { id: 'exceptions',  label: 'Exception Manager'  },
  { id: 'payment-run', label: 'Payment Run'         },
  { id: 'statements',  label: 'Supplier Statements' },
]

export default function APProcessingWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState('pipeline')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'IBM Plex Sans, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: C.navy, borderBottom: `1px solid ${C.border}`,
        padding: '0 1.25rem', height: 48,
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        {/* Icon */}
        <div style={{
          width: 28, height: 28, borderRadius: 4,
          background: C.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#fff', flexShrink: 0,
        }}>⬡</div>

        <span style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f4', letterSpacing: '-0.01em' }}>
          AP Processing Workbench
        </span>
        <span style={{ fontSize: 11, color: '#8d8d8d', marginLeft: 2 }}>Invoice & AP · Procurement Atlas</span>

        <Tag type="green" size="sm" style={{ marginLeft: 4 }}>Phase 5</Tag>
        <Tag type="blue"  size="sm">Live</Tag>

        {/* KPI pills */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
          {[
            { label: 'Touchless', value: '84%',   color: '#42be65' },
            { label: 'Cost/Inv',  value: '$2.18',  color: '#78a9ff' },
            { label: 'DPO',       value: '41d',    color: '#ff832b' },
          ].map(k => (
            <div key={k.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: k.color, fontFamily: 'IBM Plex Mono, monospace' }}>{k.value}</span>
              <span style={{ fontSize: 9, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
            </div>
          ))}
        </div>

        <Button
          kind="ghost"
          size="sm"
          renderIcon={Close}
          iconDescription="Close workbench"
          hasIconOnly
          onClick={onClose}
          style={{ color: '#c6c6c6', marginLeft: 8 }}
        />
      </div>

      {/* Tab bar */}
      <div style={{
        background: '#1a3550', borderBottom: `1px solid #2a4a65`,
        display: 'flex', gap: 0, flexShrink: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.625rem 1.125rem',
              background: 'transparent',
              color: activeTab === tab.id ? '#f4f4f4' : '#8d8d8d',
              borderBottom: `2px solid ${activeTab === tab.id ? '#C41E3A' : 'transparent'}`,
              border: 'none', borderBottom: activeTab === tab.id ? '2px solid #C41E3A' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
              fontFamily: 'IBM Plex Sans, sans-serif',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: C.bg,
        padding: '1rem 1.25rem',
      }}>
        {activeTab === 'pipeline'    && <InvoicePipeline    />}
        {activeTab === 'exceptions'  && <ExceptionManager   />}
        {activeTab === 'payment-run' && <PaymentRun          />}
        {activeTab === 'statements'  && <SupplierStatements  />}
      </div>
    </div>
  )
}
