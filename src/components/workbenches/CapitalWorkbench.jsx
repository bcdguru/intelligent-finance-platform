import { useState } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close, WarningAlt } from '@carbon/icons-react'

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

const ASSETS = [
  { id: 'FA-001', name: 'HQ Office Fit-out',              category: 'Leasehold Improvements', cost: 4200000, accDep: 1680000, nbv: 2520000, method: 'SL',  life: 10, remaining: 6.0, status: 'active'            },
  { id: 'FA-002', name: 'Data Centre Servers',             category: 'IT Equipment',           cost: 1850000, accDep: 925000,  nbv: 925000,  method: 'SL',  life: 4,  remaining: 2.0, status: 'active'            },
  { id: 'FA-003', name: 'Manufacturing Line A',            category: 'Plant & Machinery',      cost: 8500000, accDep: 2125000, nbv: 6375000, method: 'SL',  life: 20, remaining: 15,  status: 'active'            },
  { id: 'FA-004', name: 'Salesforce CRM Platform',        category: 'Intangible — Software',  cost: 620000,  accDep: 310000,  nbv: 310000,  method: 'SL',  life: 5,  remaining: 2.5, status: 'active'            },
  { id: 'FA-005', name: 'Delivery Fleet (12 vehicles)',   category: 'Motor Vehicles',         cost: 780000,  accDep: 390000,  nbv: 390000,  method: 'DDB', life: 5,  remaining: 2.5, status: 'active'            },
  { id: 'FA-006', name: 'Legacy ERP System',              category: 'Intangible — Software',  cost: 2100000, accDep: 2100000, nbv: 0,       method: 'SL',  life: 7,  remaining: 0,   status: 'fully-depreciated' },
  { id: 'FA-007', name: 'EMEA Office Fit-out',            category: 'Leasehold Improvements', cost: 1900000, accDep: 475000,  nbv: 1425000, method: 'SL',  life: 10, remaining: 7.5, status: 'active'            },
  { id: 'FA-008', name: 'R&D Lab Equipment',              category: 'Plant & Machinery',      cost: 340000,  accDep: 68000,   nbv: 272000,  method: 'SL',  life: 10, remaining: 8.0, status: 'active'            },
  { id: 'FA-009', name: 'Singapore Office Fit-out',       category: 'Leasehold Improvements', cost: 1320000, accDep: 22000,   nbv: 1298000, method: 'SL',  life: 5,  remaining: 4.9, status: 'active'            },
]

const PROJECTS = [
  { id: 'CAPEX-001', name: 'ERP Cloud Migration',                   category: 'IT Infrastructure',     budget: 3500000, spent: 2100000, committed: 800000, stage: 'Build',     pct: 60,  wip: 2100000, targetDate: 'Q3 2025', status: 'on-track',    pm: 'A. Singh'    },
  { id: 'CAPEX-002', name: 'Manufacturing Line B Expansion',        category: 'Plant & Machinery',     budget: 6200000, spent: 1550000, committed: 2480000, stage: 'Design',    pct: 25,  wip: 1550000, targetDate: 'Q1 2026', status: 'on-track',    pm: 'R. Torres'   },
  { id: 'CAPEX-003', name: 'APAC Office Fit-out — Singapore',       category: 'Leasehold Improvements',budget: 1200000, spent: 1320000, committed: 0,       stage: 'Close-out', pct: 110, wip: 0,       targetDate: 'May 2025',status: 'over-budget', pm: 'Y. Tanaka'   },
  { id: 'CAPEX-004', name: 'Customer Portal Rebuild (ASC 350-40)', category: 'Intangible — Software', budget: 890000,  spent: 445000,  committed: 200000,  stage: 'Build',     pct: 50,  wip: 445000,  targetDate: 'Q4 2025', status: 'on-track',    pm: 'D. Johnson'  },
  { id: 'CAPEX-005', name: 'Warehouse Automation — Phase 1',        category: 'Plant & Machinery',     budget: 2800000, spent: 140000,  committed: 560000,  stage: 'Planning',  pct: 5,   wip: 140000,  targetDate: 'Q2 2026', status: 'on-track',    pm: 'B. Okafor'   },
]

const LEASES = [
  { id: 'L-001', asset: 'HQ Office — Floors 12–14', type: 'Property', rouAsset: 4850000, liability: 4200000, payment: 85000,  interest: 14700, dep: 67361, nextPayment: 'Jun 1',  maturity: 'May 2031', rate: '4.2%' },
  { id: 'L-002', asset: 'EMEA Office — London',     type: 'Property', rouAsset: 1920000, liability: 1680000, payment: 35000,  interest: 5880,  dep: 26667, nextPayment: 'Jun 1',  maturity: 'Mar 2029', rate: '4.2%' },
  { id: 'L-003', asset: 'Delivery Fleet (12 veh.)', type: 'Vehicle',  rouAsset: 780000,  liability: 390000,  payment: 18500,  interest: 1365,  dep: 13000, nextPayment: 'Jun 1',  maturity: 'Nov 2027', rate: '4.2%' },
  { id: 'L-004', asset: 'Warehouse — Unit 4B',      type: 'Property', rouAsset: 920000,  liability: 740000,  payment: 22000,  interest: 2590,  dep: 15333, nextPayment: 'Jun 1',  maturity: 'Aug 2028', rate: '4.2%' },
  { id: 'L-005', asset: 'Data Centre Co-location',  type: 'IT Infra', rouAsset: 540000,  liability: 270000,  payment: 12000,  interest: 945,   dep: 9000,  nextPayment: 'Jun 15', maturity: 'Jun 2027', rate: '4.2%' },
]

const CAPEX_BUDGET = [
  { category: 'IT Infrastructure',       budget: 4500000, spent: 2545000, committed: 1000000 },
  { category: 'Plant & Machinery',       budget: 9000000, spent: 1690000, committed: 3040000 },
  { category: 'Leasehold Improvements', budget: 2100000, spent: 1320000, committed: 0       },
  { category: 'Intangible — Software',  budget: 1510000, spent: 755000,  committed: 200000  },
  { category: 'Motor Vehicles',         budget: 400000,  spent: 0,       committed: 0       },
  { category: 'R&D Capitalisation',     budget: 2100000, spent: 420000,  committed: 0       },
]

const TABS = ['Asset Register', 'WIP & Projects', 'Lease Schedule', 'CapEx vs Budget']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n, decimals = 0) {
  if (n === 0) return '—'
  if (n >= 1000000) return `$${(n / 1000000).toFixed(decimals === 0 ? 1 : decimals)}M`
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
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

function Th({ children, right }) {
  return (
    <th style={{
      padding: '0.5rem 0.75rem', textAlign: right ? 'right' : 'left',
      fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase',
      letterSpacing: '0.06em', whiteSpace: 'nowrap', background: '#f4f4f4',
    }}>{children}</th>
  )
}

function Td({ children, mono, right, muted, color }) {
  return (
    <td style={{
      padding: '0.625rem 0.75rem', fontSize: 12,
      textAlign: right ? 'right' : 'left',
      fontFamily: mono ? 'IBM Plex Mono, monospace' : 'inherit',
      color: color || (muted ? C.muted : '#161616'),
    }}>{children}</td>
  )
}

// ─── Tab: Asset Register ──────────────────────────────────────────────────────

function AssetRegisterTab() {
  const [catFilter, setCatFilter] = useState('All')
  const categories = ['All', ...new Set(ASSETS.map(a => a.category))]

  const visible = catFilter === 'All' ? ASSETS : ASSETS.filter(a => a.category === catFilter)

  const totalCost   = ASSETS.reduce((s, a) => s + a.cost, 0)
  const totalAccDep = ASSETS.reduce((s, a) => s + a.accDep, 0)
  const totalNBV    = ASSETS.reduce((s, a) => s + a.nbv, 0)
  const monthlyDep  = ASSETS.reduce((s, a) => s + (a.nbv > 0 ? a.nbv / (a.remaining * 12) : 0), 0)
  const fullyDep    = ASSETS.filter(a => a.status === 'fully-depreciated').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="Gross Asset Cost" value={fmt(totalCost)}   sub="Total carrying cost" color={C.blue}  />
        <KPICard label="Net Book Value"   value={fmt(totalNBV)}    sub="After depreciation"  color={C.green} />
        <KPICard label="Acc. Depreciation"value={fmt(totalAccDep)} sub={`${Math.round(totalAccDep/totalCost*100)}% of gross cost written down`} color={C.amber} />
        <KPICard label="Monthly Dep. Run" value={fmt(monthlyDep)}  sub={`${fullyDep} assets fully depreciated`} color={C.purple} />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            padding: '3px 10px', fontSize: 11, borderRadius: 10, border: 'none', cursor: 'pointer',
            background: catFilter === c ? C.blue : '#e0e0e0',
            color: catFilter === c ? '#fff' : C.slate,
            fontWeight: catFilter === c ? 700 : 400, fontFamily: 'inherit',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <Th>Asset ID</Th><Th>Name</Th><Th>Category</Th>
              <Th right>Gross Cost</Th><Th right>Acc. Dep.</Th><Th right>NBV</Th>
              <Th>Method</Th><Th right>Useful Life</Th><Th right>Yrs Left</Th><Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a, i) => {
              const depPct = Math.round(a.accDep / a.cost * 100)
              return (
                <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <Td mono color={C.purple}>{a.id}</Td>
                  <Td><span style={{ fontWeight: 500 }}>{a.name}</span></Td>
                  <Td muted>{a.category}</Td>
                  <Td mono right>{fmt(a.cost)}</Td>
                  <Td mono right color={C.amber}>{fmt(a.accDep)}</Td>
                  <Td mono right color={a.nbv === 0 ? C.muted : C.green}>{a.nbv === 0 ? '—' : fmt(a.nbv)}</Td>
                  <td style={{ padding: '0.625rem 0.75rem' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 8, background: '#edf5ff', color: C.blue }}>{a.method}</span>
                  </td>
                  <Td right muted>{a.life}y</Td>
                  <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                      <span style={{ fontSize: 12, color: a.remaining === 0 ? C.muted : '#161616' }}>
                        {a.remaining === 0 ? '—' : `${a.remaining}y`}
                      </span>
                      <div style={{ width: 48, height: 3, background: C.border, borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${100 - depPct}%`, background: a.remaining === 0 ? C.muted : C.blue, borderRadius: 2 }} />
                      </div>
                    </div>
                  </td>
                  <Td>
                    {a.status === 'fully-depreciated'
                      ? <Tag type="gray" size="sm">Fully Dep.</Tag>
                      : <Tag type="green" size="sm">Active</Tag>}
                  </Td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f4f4f4', borderTop: `2px solid ${C.border}` }}>
              <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontSize: 12, fontWeight: 700, color: '#161616' }}>Total</td>
              <Td mono right><strong>{fmt(totalCost)}</strong></Td>
              <Td mono right color={C.amber}><strong>{fmt(totalAccDep)}</strong></Td>
              <Td mono right color={C.green}><strong>{fmt(totalNBV)}</strong></Td>
              <td colSpan={4} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Tab: WIP & Projects ──────────────────────────────────────────────────────

function WIPTab() {
  const totalBudget    = PROJECTS.reduce((s, p) => s + p.budget, 0)
  const totalSpent     = PROJECTS.reduce((s, p) => s + p.spent, 0)
  const totalCommitted = PROJECTS.reduce((s, p) => s + p.committed, 0)
  const totalWIP       = PROJECTS.reduce((s, p) => s + p.wip, 0)
  const atRisk         = PROJECTS.filter(p => p.status === 'over-budget').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="Total CapEx Budget"  value={fmt(totalBudget)}    sub="FY 2025 approved"                      color={C.blue}  />
        <KPICard label="Spent YTD"           value={fmt(totalSpent)}     sub={`${Math.round(totalSpent/totalBudget*100)}% of budget utilised`} color={C.green} />
        <KPICard label="Committed"           value={fmt(totalCommitted)} sub="POs raised, not yet invoiced"          color={C.amber} />
        <KPICard label="WIP Balance"         value={fmt(totalWIP)}       sub={atRisk > 0 ? `${atRisk} project over budget` : 'All within budget'} color={atRisk > 0 ? C.red : C.green} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {PROJECTS.map(p => {
          const utilised = p.spent / p.budget
          const overBudget = p.pct > 100
          return (
            <div key={p.id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4, padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                    {overBudget && <WarningAlt size={14} color={C.red} />}
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#161616' }}>{p.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: 11, color: C.muted }}>
                    <span>{p.id}</span>
                    <span>PM: {p.pm}</span>
                    <span>{p.category}</span>
                    <span>Target: {p.targetDate}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                    background: '#edf5ff', color: C.blue,
                  }}>{p.stage}</span>
                  {overBudget
                    ? <Tag type="red" size="sm">Over Budget</Tag>
                    : <Tag type="green" size="sm">On Track</Tag>}
                </div>
              </div>

              {/* Budget bar */}
              <div style={{ marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11 }}>
                  <span style={{ color: C.slate }}>Budget utilisation</span>
                  <span style={{ fontWeight: 600, color: overBudget ? C.red : '#161616' }}>{p.pct}%</span>
                </div>
                <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${Math.min(utilised * 100, 100)}%`,
                    background: overBudget ? C.red : utilised > 0.8 ? C.amber : C.blue,
                    transition: 'width 0.4s',
                  }} />
                </div>
              </div>

              {/* Spend breakdown */}
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: 12 }}>
                <span style={{ color: C.muted }}>Budget: <strong style={{ color: '#161616' }}>{fmt(p.budget)}</strong></span>
                <span style={{ color: C.muted }}>Spent: <strong style={{ color: C.blue }}>{fmt(p.spent)}</strong></span>
                <span style={{ color: C.muted }}>Committed: <strong style={{ color: C.amber }}>{fmt(p.committed)}</strong></span>
                <span style={{ color: C.muted }}>WIP Balance: <strong style={{ color: C.green }}>{fmt(p.wip)}</strong></span>
                <span style={{ color: C.muted }}>Remaining: <strong style={{ color: overBudget ? C.red : '#161616' }}>{overBudget ? `(${fmt(p.spent - p.budget)} over)` : fmt(p.budget - p.spent - p.committed)}</strong></span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab: Lease Schedule (IFRS 16) ───────────────────────────────────────────

function LeaseTab() {
  const totalLiability = LEASES.reduce((s, l) => s + l.liability, 0)
  const totalROU       = LEASES.reduce((s, l) => s + l.rouAsset, 0)
  const totalPayment   = LEASES.reduce((s, l) => s + l.payment, 0)
  const totalDep       = LEASES.reduce((s, l) => s + l.dep, 0)
  const totalInterest  = LEASES.reduce((s, l) => s + l.interest, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="Lease Liability"      value={fmt(totalLiability)} sub="IFRS 16 balance sheet"            color={C.blue}   />
        <KPICard label="ROU Assets"           value={fmt(totalROU)}       sub="Right-of-use carrying value"      color={C.green}  />
        <KPICard label="Monthly Cash Out"     value={fmt(totalPayment)}   sub="Lease payments due"               color={C.amber}  />
        <KPICard label="Monthly P&L Charge"  value={fmt(totalDep + totalInterest)} sub={`Dep ${fmt(totalDep)} · Int ${fmt(totalInterest)}`} color={C.purple} />
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <div style={{ padding: '0.625rem 1rem', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>
          IFRS 16 — Right-of-use assets and lease liabilities · Incremental borrowing rate 4.2% · May 2025
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <Th>ID</Th><Th>Leased Asset</Th><Th>Type</Th>
              <Th right>ROU Asset</Th><Th right>Lease Liability</Th>
              <Th right>Monthly Payment</Th><Th right>Interest</Th><Th right>Depreciation</Th>
              <Th>Next Payment</Th><Th>Maturity</Th><Th>Rate</Th>
            </tr>
          </thead>
          <tbody>
            {LEASES.map((l, i) => (
              <tr key={l.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <Td mono color={C.purple}>{l.id}</Td>
                <Td><span style={{ fontWeight: 500 }}>{l.asset}</span></Td>
                <Td>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 8,
                    background: l.type === 'Property' ? '#edf5ff' : l.type === 'Vehicle' ? '#f4f0ff' : '#e8f5e9',
                    color: l.type === 'Property' ? C.blue : l.type === 'Vehicle' ? C.purple : C.green,
                  }}>{l.type}</span>
                </Td>
                <Td mono right color={C.green}>{fmt(l.rouAsset)}</Td>
                <Td mono right color={C.blue}>{fmt(l.liability)}</Td>
                <Td mono right>{fmt(l.payment)}</Td>
                <Td mono right muted>{fmt(l.interest)}</Td>
                <Td mono right muted>{fmt(l.dep)}</Td>
                <Td muted>{l.nextPayment}</Td>
                <Td muted>{l.maturity}</Td>
                <Td mono muted>{l.rate}</Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f4f4f4', borderTop: `2px solid ${C.border}` }}>
              <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontSize: 12, fontWeight: 700, color: '#161616' }}>Total</td>
              <Td mono right color={C.green}><strong>{fmt(totalROU)}</strong></Td>
              <Td mono right color={C.blue}><strong>{fmt(totalLiability)}</strong></Td>
              <Td mono right><strong>{fmt(totalPayment)}</strong></Td>
              <Td mono right muted><strong>{fmt(totalInterest)}</strong></Td>
              <Td mono right muted><strong>{fmt(totalDep)}</strong></Td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Maturity profile mini-chart */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4, padding: '1rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Lease Liability Maturity Profile</div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', height: 60 }}>
          {[
            { yr: '2025', val: 920000 },
            { yr: '2026', val: 1120000 },
            { yr: '2027', val: 1085000 },
            { yr: '2028', val: 980000 },
            { yr: '2029', val: 850000 },
            { yr: '2030+', val: 3325000 },
          ].map((b, i) => {
            const maxVal = 3325000
            const ht = Math.max((b.val / maxVal) * 52, 4)
            return (
              <div key={b.yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>{fmt(b.val)}</div>
                <div style={{ width: '80%', height: ht, background: i === 5 ? C.blue : '#bfdbfe', borderRadius: '3px 3px 0 0' }} />
                <div style={{ fontSize: 10, color: C.slate, marginTop: 4 }}>{b.yr}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: CapEx vs Budget ─────────────────────────────────────────────────────

function CapExTab() {
  const totalBudget    = CAPEX_BUDGET.reduce((s, c) => s + c.budget, 0)
  const totalSpent     = CAPEX_BUDGET.reduce((s, c) => s + c.spent, 0)
  const totalCommitted = CAPEX_BUDGET.reduce((s, c) => s + c.committed, 0)
  const remaining      = totalBudget - totalSpent - totalCommitted
  const utilisedPct    = Math.round((totalSpent + totalCommitted) / totalBudget * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <KPICard label="FY 2025 Budget"   value={fmt(totalBudget)}    sub="Board-approved CapEx envelope" color={C.blue}  />
        <KPICard label="Spent YTD"        value={fmt(totalSpent)}     sub={`${Math.round(totalSpent/totalBudget*100)}% of budget`}          color={C.green} />
        <KPICard label="Committed"        value={fmt(totalCommitted)} sub="POs raised, not yet invoiced"  color={C.amber} />
        <KPICard label="Remaining"        value={fmt(remaining)}      sub={`${100 - utilisedPct}% of budget headroom`}     color={remaining < 0 ? C.red : C.green} />
      </div>

      {/* Category breakdown */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, color: '#161616' }}>
          Spend by Category — FY 2025
        </div>
        <div style={{ padding: '1rem' }}>
          {CAPEX_BUDGET.map(c => {
            const spentPct     = c.budget > 0 ? c.spent / c.budget : 0
            const committedPct = c.budget > 0 ? c.committed / c.budget : 0
            const over         = (c.spent + c.committed) > c.budget
            return (
              <div key={c.category} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#161616' }}>{c.category}</span>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: 11 }}>
                    <span style={{ color: C.muted }}>Budget: <strong style={{ color: '#161616' }}>{fmt(c.budget)}</strong></span>
                    <span style={{ color: C.muted }}>Spent: <strong style={{ color: C.blue }}>{fmt(c.spent)}</strong></span>
                    <span style={{ color: C.muted }}>Committed: <strong style={{ color: C.amber }}>{fmt(c.committed)}</strong></span>
                    {over && <span style={{ color: C.red, fontWeight: 700 }}>Over budget</span>}
                  </div>
                </div>
                {/* Stacked bar */}
                <div style={{ height: 10, background: C.border, borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${Math.min(spentPct * 100, 100)}%`, background: C.blue, transition: 'width 0.4s' }} />
                  <div style={{ width: `${Math.min(committedPct * 100, 100 - spentPct * 100)}%`, background: C.amber, opacity: 0.7, transition: 'width 0.4s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: C.muted }}>
                  <span>{Math.round(spentPct * 100)}% spent · {Math.round(committedPct * 100)}% committed</span>
                  <span>Remaining: {fmt(c.budget - c.spent - c.committed)}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ padding: '0.75rem 1rem', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '1.5rem', fontSize: 11 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 8, borderRadius: 2, background: C.blue, display: 'inline-block' }} /> Spent
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 8, borderRadius: 2, background: C.amber, opacity: 0.7, display: 'inline-block' }} /> Committed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 8, borderRadius: 2, background: C.border, display: 'inline-block' }} /> Remaining
          </span>
        </div>
      </div>

      {/* CapEx vs EBITDA covenant */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4, padding: '1rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>CapEx / EBITDA Covenant</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11 }}>
              <span style={{ color: C.slate }}>Current: <strong style={{ color: C.green }}>9.2%</strong></span>
              <span style={{ color: C.slate }}>Limit: <strong style={{ color: C.red }}>≤ 15%</strong></span>
            </div>
            <div style={{ height: 10, background: C.border, borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '100%', width: '61%', background: C.green, borderRadius: 5, transition: 'width 0.4s' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: '0%', width: 2, background: C.red }} />
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>5.8pp headroom · Covenant: CapEx ÷ EBITDA ≤ 15%</div>
          </div>
          <Tag type="green" size="sm">Compliant</Tag>
        </div>
      </div>
    </div>
  )
}

// ─── Main Workbench ───────────────────────────────────────────────────────────

export default function CapitalWorkbench({ onClose }) {
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
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Capital Workbench</div>
            <div style={{ color: '#8d8d8d', fontSize: 11, marginTop: 1 }}>Capital Accounting · Fixed Assets, Leases & WIP · R2R Wave 1</div>
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
        {activeTab === 0 && <AssetRegisterTab />}
        {activeTab === 1 && <WIPTab />}
        {activeTab === 2 && <LeaseTab />}
        {activeTab === 3 && <CapExTab />}
      </div>
    </div>
  )
}
