import { useState, useMemo } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close, CheckmarkOutline, Warning, Renew } from '@carbon/icons-react'

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

const fmt = n => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`
const fmtN = n => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(1)}K`

// ─── Data ─────────────────────────────────────────────────────────────────────

const INVOICES = [
  { id: 'INV-240891', customer: 'Accenture Federal Services', amount: 4_820_000, type: 'Milestone',  status: 'PENDING',   age: 3,  contract: 'MSA-2024-001', issue: null,             billedBy: 'Auto',   region: 'US' },
  { id: 'INV-240892', customer: 'Deutsche Bank AG',            amount: 2_150_000, type: 'Recurring',  status: 'HOLD',      age: 5,  contract: 'MSA-2023-088', issue: 'PO mismatch',   billedBy: 'Manual', region: 'DE' },
  { id: 'INV-240893', customer: 'Nestlé S.A.',                 amount: 890_000,   type: 'T&M',        status: 'APPROVED',  age: 1,  contract: 'SOW-2024-021', issue: null,             billedBy: 'Auto',   region: 'CH' },
  { id: 'INV-240894', customer: 'British Petroleum plc',       amount: 3_400_000, type: 'Milestone',  status: 'DISPUTED',  age: 12, contract: 'MSA-2024-007', issue: 'Scope dispute',  billedBy: 'Manual', region: 'UK' },
  { id: 'INV-240895', customer: 'BNP Paribas',                 amount: 620_000,   type: 'Recurring',  status: 'PENDING',   age: 2,  contract: 'MSA-2023-045', issue: null,             billedBy: 'Auto',   region: 'FR' },
  { id: 'INV-240896', customer: 'Siemens AG',                  amount: 1_780_000, type: 'Fixed-fee',  status: 'SENT',      age: 8,  contract: 'SOW-2024-033', issue: null,             billedBy: 'Auto',   region: 'DE' },
  { id: 'INV-240897', customer: 'Tata Consultancy Services',   amount: 940_000,   type: 'T&M',        status: 'PENDING',   age: 4,  contract: 'MSA-2024-012', issue: null,             billedBy: 'Manual', region: 'IN' },
  { id: 'INV-240898', customer: 'Rio Tinto Group',             amount: 2_100_000, type: 'Milestone',  status: 'APPROVED',  age: 1,  contract: 'SOW-2024-018', issue: null,             billedBy: 'Auto',   region: 'AU' },
  { id: 'INV-240899', customer: 'Toyota Motor Corporation',    amount: 550_000,   type: 'Recurring',  status: 'HOLD',      age: 7,  contract: 'MSA-2023-102', issue: 'Tax code error', billedBy: 'Auto',   region: 'JP' },
  { id: 'INV-240900', customer: 'Amazon Web Services',         amount: 3_950_000, type: 'Fixed-fee',  status: 'SENT',      age: 6,  contract: 'MSA-2024-020', issue: null,             billedBy: 'Auto',   region: 'US' },
  { id: 'INV-240901', customer: 'LVMH Group',                  amount: 730_000,   type: 'T&M',        status: 'PENDING',   age: 2,  contract: 'SOW-2024-041', issue: null,             billedBy: 'Manual', region: 'FR' },
  { id: 'INV-240902', customer: 'Volkswagen AG',               amount: 1_250_000, type: 'Milestone',  status: 'APPROVED',  age: 3,  contract: 'MSA-2024-015', issue: null,             billedBy: 'Auto',   region: 'DE' },
]

const BILLING_RULES = [
  { id: 'BR-001', name: 'Auto-invoice on milestone completion',   trigger: 'Milestone delivered',      template: 'MSA Standard',   active: true,  ran: 248, blocked: 3 },
  { id: 'BR-002', name: 'Recurring monthly SaaS billing',         trigger: '1st of each month',        template: 'SaaS Recurring', active: true,  ran: 1840, blocked: 0 },
  { id: 'BR-003', name: 'T&M invoice every 2 weeks',              trigger: 'Bi-weekly timesheet close', template: 'T&M Detail',     active: true,  ran: 412, blocked: 7 },
  { id: 'BR-004', name: 'PO match before invoice release',        trigger: 'Invoice creation',         template: 'PO Validation',  active: true,  ran: 2100, blocked: 18 },
  { id: 'BR-005', name: 'Tax code enrichment (EMEA)',             trigger: 'Invoice for EU customers',  template: 'Tax Engine v3',  active: true,  ran: 590, blocked: 2 },
  { id: 'BR-006', name: 'Retainage holdback (10%)',               trigger: 'Fixed-fee milestone',      template: 'Retainage',      active: false, ran: 0,   blocked: 0 },
  { id: 'BR-007', name: 'Intercompany netting before billing',    trigger: 'IC transfer detected',     template: 'Interco Net',    active: false, ran: 34,  blocked: 0 },
]

const REVREC_ITEMS = [
  { id: 'RR-001', customer: 'Accenture Federal Services', contract: 'MSA-2024-001', totalValue: 42_000_000, recognized: 28_400_000, remaining: 13_600_000, method: 'POC',      pob: 'Implementation', period: 'Q4-2024', risk: 'LOW'    },
  { id: 'RR-002', customer: 'Deutsche Bank AG',            contract: 'MSA-2023-088', totalValue: 18_500_000, recognized: 11_200_000, remaining: 7_300_000,  method: 'Milestone', pob: 'Licence + Svc',  period: 'Q4-2024', risk: 'MEDIUM' },
  { id: 'RR-003', customer: 'British Petroleum plc',       contract: 'MSA-2024-007', totalValue: 31_000_000, recognized: 17_900_000, remaining: 13_100_000, method: 'POC',      pob: 'Consulting',     period: 'Q4-2024', risk: 'HIGH'   },
  { id: 'RR-004', customer: 'Nestlé S.A.',                 contract: 'SOW-2024-021', totalValue: 5_200_000,  recognized: 4_100_000,  remaining: 1_100_000,  method: 'Milestone', pob: 'Implementation', period: 'Q4-2024', risk: 'LOW'    },
  { id: 'RR-005', customer: 'Siemens AG',                  contract: 'SOW-2024-033', totalValue: 9_800_000,  recognized: 3_600_000,  remaining: 6_200_000,  method: 'T&M',      pob: 'Managed Svc',    period: 'Q4-2024', risk: 'LOW'    },
  { id: 'RR-006', customer: 'Amazon Web Services',         contract: 'MSA-2024-020', totalValue: 22_000_000, recognized: 19_500_000, remaining: 2_500_000,  method: 'SaaS',     pob: 'Subscription',   period: 'Q4-2024', risk: 'LOW'    },
]

const AGING_BANDS = [
  { band: 'Current (0–30d)',  amount: 28_400_000, count: 4, color: C.green  },
  { band: '31–60 days',       amount: 16_700_000, count: 3, color: C.amber  },
  { band: '61–90 days',       amount: 9_200_000,  count: 2, color: '#f97316' },
  { band: '90+ days',         amount: 14_100_000, count: 3, color: C.red    },
]
const AGING_TOTAL = AGING_BANDS.reduce((s, b) => s + b.amount, 0)

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_META = {
  PENDING:  { bg: '#eff6ff', color: C.blue,   label: 'Pending'  },
  APPROVED: { bg: '#dcfce7', color: C.green,  label: 'Approved' },
  SENT:     { bg: '#f0fdf4', color: '#15803d', label: 'Sent'    },
  HOLD:     { bg: '#fff7ed', color: '#c2410c', label: 'On Hold' },
  DISPUTED: { bg: '#fef2f2', color: C.red,    label: 'Disputed' },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.PENDING
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
      background: m.bg, color: m.color, border: `1px solid ${m.color}30`,
    }}>{m.label}</span>
  )
}

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
        <div style={{ fontSize: 15, fontWeight: 600 }}>Billing Specialist Workbench</div>
        <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>
          O2C — Invoice Management · Revenue Recognition · Billing Automation
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
  const totalBilled = INVOICES.reduce((s, i) => s + i.amount, 0)
  const pendingCount = INVOICES.filter(i => i.status === 'PENDING').length
  const holdCount    = INVOICES.filter(i => i.status === 'HOLD' || i.status === 'DISPUTED').length
  const autoRate     = Math.round((INVOICES.filter(i => i.billedBy === 'Auto').length / INVOICES.length) * 100)
  const kpis = [
    { label: 'Invoice Queue Value', value: fmt(totalBilled),       sub: `${INVOICES.length} invoices in queue`, color: C.blue   },
    { label: 'Pending Approval',    value: `${pendingCount}`,      sub: 'Awaiting billing manager',              color: C.amber  },
    { label: 'Blocked / Disputed',  value: `${holdCount}`,         sub: 'Require intervention',                  color: C.red    },
    { label: 'Auto-Bill Rate',      value: `${autoRate}%`,         sub: 'Touchless invoice creation',            color: C.green  },
  ]
  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
      {kpis.map(k => (
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

// ─── Tab: Invoice Queue ───────────────────────────────────────────────────────

function InvoiceQueue() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState([])

  const filtered = useMemo(() =>
    statusFilter === 'ALL' ? INVOICES : INVOICES.filter(i => i.status === statusFilter),
    [statusFilter]
  )

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const approvable = filtered.filter(i => i.status === 'PENDING' && selected.includes(i.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.875rem' }}>
      {/* Filter row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Status:</span>
        {['ALL', 'PENDING', 'APPROVED', 'SENT', 'HOLD', 'DISPUTED'].map(s => {
          const m = STATUS_META[s]
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '5px 14px', borderRadius: 4, border: '1px solid',
              borderColor: statusFilter === s ? (m?.color || C.navy) : C.border,
              background: statusFilter === s ? ((m?.color || C.navy) + '15') : '#fff',
              color: statusFilter === s ? (m?.color || C.navy) : C.slate,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>{s === 'ALL' ? 'All Invoices' : m?.label || s}</button>
          )
        })}
        {approvable.length > 0 && (
          <button style={{
            marginLeft: 'auto', padding: '6px 16px', borderRadius: 4,
            background: C.green, color: '#fff', border: 'none',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <CheckmarkOutline size={14} />
            Approve {approvable.length} Selected
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              <th style={{ width: 32, padding: '10px 8px' }}></th>
              {['Invoice', 'Customer', 'Type', 'Region', 'Contract', 'Amount', 'Age', 'Billed By', 'Issue', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px',
                  textAlign: h === 'Customer' || h === 'Contract' || h === 'Invoice' ? 'left' : 'right',
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, i) => {
              const isSelected = selected.includes(inv.id)
              return (
                <tr key={inv.id} style={{
                  background: isSelected ? '#eff6ff' : (i % 2 === 0 ? '#fff' : C.bg),
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: isSelected ? `3px solid ${C.blue}` : '3px solid transparent',
                  cursor: 'pointer',
                }} onClick={() => toggleSelect(inv.id)}>
                  <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => {}} style={{ cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: C.blue, whiteSpace: 'nowrap' }}>{inv.id}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <div style={{ fontWeight: 600, color: C.navy, fontSize: 11 }}>{inv.customer}</div>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                      background: '#e5f6ff', color: C.blue,
                    }}>{inv.type}</span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: C.slate, fontSize: 11 }}>{inv.region}</td>
                  <td style={{ padding: '8px 12px', color: C.muted, fontSize: 10 }}>{inv.contract}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, color: C.navy }}>{fmtN(inv.amount)}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: inv.age > 7 ? C.red : C.slate }}>{inv.age}d</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: inv.billedBy === 'Auto' ? '#dcfce7' : '#fff7ed',
                      color: inv.billedBy === 'Auto' ? C.green : '#c2410c',
                      fontWeight: 600,
                    }}>{inv.billedBy}</span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    {inv.issue ? (
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: C.red,
                        display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end',
                      }}>
                        <Warning size={12} /> {inv.issue}
                      </span>
                    ) : <span style={{ color: C.muted, fontSize: 10 }}>—</span>}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <StatusBadge status={inv.status} />
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

// ─── Tab: Billing Rules ───────────────────────────────────────────────────────

function BillingRules() {
  const [rules, setRules] = useState(BILLING_RULES)

  const toggle = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Active Rules', value: rules.filter(r => r.active).length, color: C.green },
          { label: 'Runs Today',   value: rules.reduce((s, r) => s + r.ran, 0).toLocaleString(), color: C.blue },
          { label: 'Blocked',      value: rules.reduce((s, r) => s + r.blocked, 0), color: C.red },
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

      {/* Rules list */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Auto-Billing Rules
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['Rule', 'Trigger', 'Template', 'Runs', 'Blocked', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px',
                  textAlign: h === 'Rule' || h === 'Trigger' || h === 'Template' ? 'left' : 'right',
                  fontSize: 10, fontWeight: 600, color: C.muted,
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: 600, color: C.navy, fontSize: 12 }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{r.id}</div>
                </td>
                <td style={{ padding: '10px 12px', color: C.slate, fontSize: 11 }}>{r.trigger}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                    background: '#e5f6ff', color: C.blue,
                  }}>{r.template}</span>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: C.slate }}>{r.ran.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  {r.blocked > 0 ? (
                    <span style={{ fontWeight: 700, color: C.red }}>{r.blocked}</span>
                  ) : <span style={{ color: C.muted }}>0</span>}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <button onClick={() => toggle(r.id)} style={{
                    padding: '4px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: r.active ? C.green + '20' : C.muted + '20',
                    color: r.active ? C.green : C.muted,
                    fontWeight: 700, fontSize: 11,
                    transition: 'all 0.15s',
                  }}>
                    {r.active ? '● Active' : '○ Paused'}
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

// ─── Tab: Revenue Recognition ─────────────────────────────────────────────────

function RevenueRecognition() {
  const totalValue      = REVREC_ITEMS.reduce((s, r) => s + r.totalValue, 0)
  const totalRecognized = REVREC_ITEMS.reduce((s, r) => s + r.recognized, 0)
  const totalDeferred   = REVREC_ITEMS.reduce((s, r) => s + r.remaining, 0)

  const RISK_COLORS = { LOW: C.green, MEDIUM: C.amber, HIGH: C.red }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* ASC 606 summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total Contract Value',  value: fmt(totalValue),      color: C.navy   },
          { label: 'Revenue Recognized',    value: fmt(totalRecognized), color: C.green  },
          { label: 'Deferred / Remaining',  value: fmt(totalDeferred),   color: C.purple },
          { label: 'Recognition Rate',      value: `${Math.round((totalRecognized/totalValue)*100)}%`, color: C.blue },
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

      {/* RevRec table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            ASC 606 / IFRS 15 — Revenue Recognition Schedule
          </span>
          <span style={{ fontSize: 10, color: C.muted }}>Period: Q4-2024</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['ID', 'Customer', 'Contract', 'POB', 'Method', 'Total Value', 'Recognized', 'Remaining', '% Complete', 'Risk'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px',
                  textAlign: h === 'ID' || h === 'Customer' || h === 'Contract' || h === 'POB' ? 'left' : 'right',
                  fontSize: 10, fontWeight: 600, color: C.muted,
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REVREC_ITEMS.map((r, i) => {
              const pct = Math.round((r.recognized / r.totalValue) * 100)
              return (
                <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 12px', color: C.blue, fontWeight: 600, fontSize: 11 }}>{r.id}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy, fontSize: 11 }}>{r.customer}</td>
                  <td style={{ padding: '10px 12px', color: C.muted, fontSize: 10 }}>{r.contract}</td>
                  <td style={{ padding: '10px 12px', fontSize: 11 }}>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: '#e8daff', color: C.purple, fontWeight: 600,
                    }}>{r.pob}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11 }}>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: '#e5f6ff', color: C.blue, fontWeight: 600,
                    }}>{r.method}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: C.navy }}>{fmt(r.totalValue)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: C.green }}>{fmt(r.recognized)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: C.purple }}>{fmt(r.remaining)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <div style={{
                        width: 64, height: 6, borderRadius: 3, background: C.border, overflow: 'hidden',
                      }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? C.green : pct > 50 ? C.blue : C.amber, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontWeight: 700, color: C.slate, fontSize: 11 }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: (RISK_COLORS[r.risk] || C.muted) + '20',
                      color: RISK_COLORS[r.risk] || C.muted,
                    }}>{r.risk}</span>
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

// ─── Tab: Aging Summary ───────────────────────────────────────────────────────

function AgingSummary() {
  const maxAmt = Math.max(...AGING_BANDS.map(b => b.amount))

  const TOP_AGED = INVOICES.filter(i => i.age > 5).sort((a, b) => b.age - a.age)

  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      {/* Left: aging bars */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Bar chart */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, padding: '1rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>
            Invoice Aging Distribution
          </div>
          {AGING_BANDS.map(b => {
            const pct = (b.amount / AGING_TOTAL) * 100
            const barW = (b.amount / maxAmt) * 100
            return (
              <div key={b.band} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: C.navy }}>{b.band}</span>
                  <span style={{ color: b.color, fontWeight: 700 }}>{fmt(b.amount)} · {b.count} inv · {pct.toFixed(1)}%</span>
                </div>
                <div style={{ height: 20, background: C.bg, borderRadius: 2, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                  <div style={{
                    width: `${barW}%`, height: '100%',
                    background: b.color, borderRadius: 2,
                    transition: 'width 0.4s ease',
                    display: 'flex', alignItems: 'center', paddingLeft: 6,
                  }}>
                    {barW > 20 && <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{fmt(b.amount)}</span>}
                  </div>
                </div>
              </div>
            )
          })}
          {/* Totals */}
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Total AR Outstanding</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{fmt(AGING_TOTAL)}</span>
          </div>
        </div>

        {/* DSO trend mockup */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, padding: '1rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>
            DSO Trend — Last 6 Months
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
            {[48, 45, 43, 41, 38, 32].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: v === 32 ? C.green : C.slate }}>{v}d</div>
                <div style={{
                  width: '100%', height: `${(v / 50) * 60}px`,
                  background: v === 32 ? C.green : (i === 5 ? C.green : C.blue),
                  borderRadius: '2px 2px 0 0', opacity: i === 5 ? 1 : 0.4 + i * 0.1,
                }} />
                <div style={{ fontSize: 9, color: C.muted }}>
                  {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'][i]}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: 11, color: C.green, fontWeight: 600 }}>
            ↓ DSO improved 16 days YTD · Target: ≤30d by Q2
          </div>
        </div>
      </div>

      {/* Right: oldest invoices */}
      <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Oldest Outstanding
          </span>
        </div>
        {TOP_AGED.map((inv, i) => (
          <div key={inv.id} style={{
            padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`,
            borderLeft: `3px solid ${inv.age > 10 ? C.red : C.amber}`,
            background: i % 2 === 0 ? '#fff' : C.bg,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{inv.customer.split(' ').slice(0, 2).join(' ')}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: inv.age > 10 ? C.red : C.amber }}>{inv.age}d</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: C.muted }}>{inv.id}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.slate }}>{fmtN(inv.amount)}</span>
            </div>
            {inv.issue && (
              <div style={{ marginTop: 3, fontSize: 10, color: C.red, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Warning size={10} /> {inv.issue}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'queue',  label: 'Invoice Queue'        },
  { id: 'rules',  label: 'Billing Rules'         },
  { id: 'revrec', label: 'Revenue Recognition'   },
  { id: 'aging',  label: 'Aging Summary'         },
]

// ─── Main export ──────────────────────────────────────────────────────────────

export default function BillingWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState('queue')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <WBHeader onClose={onClose} />
      <KPIStrip />

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0, background: '#fff',
        borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
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
        {activeTab === 'queue'  && <InvoiceQueue />}
        {activeTab === 'rules'  && <BillingRules />}
        {activeTab === 'revrec' && <RevenueRecognition />}
        {activeTab === 'aging'  && <AgingSummary />}
      </div>
    </div>
  )
}
