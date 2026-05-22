import { useState } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close, CheckmarkOutline, Warning, Edit } from '@carbon/icons-react'

const C = {
  blue:    '#0072c3',
  green:   '#24a148',
  red:     '#da1e28',
  amber:   '#f1c21b',
  purple:  '#A02B93',
  navy:    '#0E2841',
  slate:   '#525252',
  muted:   '#8d8d8d',
  bg:      '#f4f4f4',
  border:  '#e0e0e0',
}

const fmt = n => `$${Math.abs(n) >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : (n / 1_000).toFixed(0) + 'K'}`

// ─── Data ─────────────────────────────────────────────────────────────────────

const BOARD_PACK_SECTIONS = [
  { id: 'exec-summary',  title: 'Executive Summary',          agent: 'Reporting Agent', status: 'APPROVED', draftedBy: 'Agent', reviewedBy: 'S. Patel',    pages: 2, note: 'All narratives aligned to Q1 commentary' },
  { id: 'pl',            title: 'P&L — Actuals vs Budget',   agent: 'Reporting Agent', status: 'APPROVED', draftedBy: 'Agent', reviewedBy: 'S. Patel',    pages: 4, note: 'EBITDA bridge included; favourable $5.6M' },
  { id: 'balance-sheet', title: 'Balance Sheet',             agent: 'Reporting Agent', status: 'REVIEW',   draftedBy: 'Agent', reviewedBy: null,           pages: 3, note: 'Working capital commentary pending CFO input' },
  { id: 'cash-flow',     title: 'Cash Flow Statement',       agent: 'Cash Agent',      status: 'APPROVED', draftedBy: 'Agent', reviewedBy: 'R. Nguyen',    pages: 3, note: 'Free cash flow $42.1M; conversion 86%' },
  { id: 'kpi-page',      title: 'KPI Dashboard',            agent: 'Performance Agent',status: 'APPROVED', draftedBy: 'Agent', reviewedBy: 'S. Patel',    pages: 2, note: '12 KPIs; 9 green, 2 amber, 1 red' },
  { id: 'forecast',      title: 'Updated Forecast (Recast)', agent: 'Forecasting Agent',status: 'REVIEW',  draftedBy: 'Agent', reviewedBy: null,           pages: 4, note: 'Awaiting BU recast confirmations from 2 regions' },
  { id: 'segment',       title: 'Segment Deep-Dive',         agent: 'Performance Agent',status: 'APPROVED', draftedBy: 'Agent', reviewedBy: 'M. Kumar',    pages: 5, note: 'Enterprise SaaS margin expansion highlighted' },
  { id: 'risks',         title: 'Risks & Opportunities',    agent: 'Monitor Agent',   status: 'DRAFT',    draftedBy: 'Agent', reviewedBy: null,           pages: 2, note: '3 new risks from macro signals — needs CFO review' },
  { id: 'appendix',      title: 'Appendix & Data Tables',   agent: 'Reporting Agent', status: 'APPROVED', draftedBy: 'Agent', reviewedBy: 'R. Nguyen',   pages: 8, note: 'Auto-generated; validated against GL' },
]

const FORECAST_ACCURACY = [
  { month: 'May-24', actual: 248_100_000, forecast: 245_600_000, mape: 1.0 },
  { month: 'Jun-24', actual: 251_400_000, forecast: 254_800_000, mape: 1.4 },
  { month: 'Jul-24', actual: 255_200_000, forecast: 251_000_000, mape: 1.6 },
  { month: 'Aug-24', actual: 259_800_000, forecast: 261_500_000, mape: 0.7 },
  { month: 'Sep-24', actual: 264_500_000, forecast: 260_800_000, mape: 1.4 },
  { month: 'Oct-24', actual: 268_900_000, forecast: 272_100_000, mape: 1.2 },
  { month: 'Nov-24', actual: 274_100_000, forecast: 270_400_000, mape: 1.3 },
  { month: 'Dec-24', actual: 279_300_000, forecast: 281_600_000, mape: 0.8 },
  { month: 'Jan-25', actual: 281_800_000, forecast: 279_200_000, mape: 0.9 },
  { month: 'Feb-25', actual: 282_900_000, forecast: 283_700_000, mape: 0.3 },
  { month: 'Mar-25', actual: 284_200_000, forecast: 281_000_000, mape: 1.1 },
  { month: 'Apr-25', actual: null,        forecast: 286_500_000, mape: null },
]

const BU_SUBMISSIONS = [
  { bu: 'Americas — Enterprise',   lead: 'J. Rodriguez', submitted: true,  submittedAt: 'Apr 28',  variance: +2_100_000, status: 'LOCKED',   comment: 'Within guidance; 3 upside deals in pipeline' },
  { bu: 'Americas — Mid-Market',   lead: 'K. Thompson',  submitted: true,  submittedAt: 'Apr 28',  variance: -800_000,   status: 'LOCKED',   comment: 'Slightly below plan; 2 deals slipped to Q2' },
  { bu: 'EMEA — Enterprise',       lead: 'P. Müller',    submitted: true,  submittedAt: 'Apr 29',  variance: +400_000,   status: 'REVIEW',   comment: 'FX headwind €1.2M partially offset by volume' },
  { bu: 'EMEA — Services',         lead: 'L. Dubois',    submitted: false, submittedAt: null,       variance: null,       status: 'OVERDUE',  comment: 'DUE: Apr 29 — awaiting regional CFO sign-off' },
  { bu: 'APAC',                    lead: 'R. Sharma',    submitted: true,  submittedAt: 'Apr 27',  variance: +1_600_000, status: 'LOCKED',   comment: 'Strong Japan performance; China recovery on track' },
  { bu: 'Corporate / Central',     lead: 'S. Patel',     submitted: true,  submittedAt: 'Apr 30',  variance: -300_000,   status: 'LOCKED',   comment: 'G&A over-run offset by project timing' },
]
const TOPDOWN_TARGET = 286_500_000

const KPIS = [
  { name: 'Annual Recurring Revenue',  value: '$341.2M',  target: '$338.0M',  rag: 'G', trend: [88,91,93,96,99,100], unit: 'ARR' },
  { name: 'Net Revenue Retention',     value: '112%',     target: '≥110%',    rag: 'G', trend: [107,109,110,111,112,112], unit: '%' },
  { name: 'Gross Margin',              value: '60.5%',    target: '≥60%',     rag: 'G', trend: [58,59,59,60,60,61], unit: '%' },
  { name: 'EBITDA Margin',             value: '22.3%',    target: '≥21%',     rag: 'G', trend: [18,19,20,21,22,22], unit: '%' },
  { name: 'Sales Efficiency (Magic #)', value: '0.82',   target: '≥0.80',    rag: 'G', trend: [0.71,0.74,0.77,0.79,0.81,0.82], unit: 'x' },
  { name: 'Customer Acquisition Cost', value: '$28.4K',  target: '≤$30K',    rag: 'G', trend: [34,32,31,30,29,28], unit: 'K' },
  { name: 'DSO',                       value: '32 days',  target: '≤35d',     rag: 'G', trend: [48,45,42,38,35,32], unit: 'd' },
  { name: 'Forecast Accuracy (MAPE)',  value: '1.1%',     target: '≤3%',      rag: 'G', trend: [5.2,4.1,3.2,2.4,1.8,1.1], unit: '%' },
  { name: 'Headcount vs Plan',         value: '4,820',    target: '≤4,900',   rag: 'G', trend: [4650,4680,4710,4760,4800,4820], unit: '' },
  { name: 'Operating Cash Conversion', value: '86%',      target: '≥80%',     rag: 'G', trend: [74,77,79,82,84,86], unit: '%' },
  { name: 'CapEx / Revenue',           value: '4.2%',     target: '≤5%',      rag: 'G', trend: [5.8,5.4,5.1,4.8,4.5,4.2], unit: '%' },
  { name: 'Employee Attrition (R12)',  value: '11.2%',    target: '≤12%',     rag: 'A', trend: [9.8,10.1,10.5,11.0,11.1,11.2], unit: '%' },
]

// ─── Header ───────────────────────────────────────────────────────────────────

function WBHeader({ onClose }) {
  return (
    <div style={{
      background: '#0E2841', color: '#fff', flexShrink: 0,
      padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      borderBottom: '1px solid #393939',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 6, background: '#156082',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
      }}>⬡</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Head of FP&amp;A Workbench</div>
        <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>
          FP&amp;A — Board Pack · Forecast Accuracy · Planning Hub · KPI Governance
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tag type="blue" size="sm">Wave 5 · FP&amp;A</Tag>
        <Button size="sm" kind="ghost" renderIcon={Close} iconDescription="Close" hasIconOnly onClick={onClose} />
      </div>
    </div>
  )
}

// ─── KPI strip ────────────────────────────────────────────────────────────────

function KPIStrip() {
  const approved = BOARD_PACK_SECTIONS.filter(s => s.status === 'APPROVED').length
  const total    = BOARD_PACK_SECTIONS.length
  const avgMape  = (FORECAST_ACCURACY.filter(f => f.mape).reduce((s, f) => s + f.mape, 0) / FORECAST_ACCURACY.filter(f => f.mape).length).toFixed(1)
  const overdue  = BU_SUBMISSIONS.filter(b => b.status === 'OVERDUE').length

  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
      {[
        { label: 'Board Pack Progress',    value: `${approved}/${total}`,  sub: 'Sections approved by Head FP&A',  color: C.purple },
        { label: 'Forecast MAPE (R12)',    value: `${avgMape}%`,           sub: 'vs 5.2% prior year · ↓ 4.1pp',   color: C.green  },
        { label: 'BU Submissions',         value: `${BU_SUBMISSIONS.filter(b=>b.submitted).length}/${BU_SUBMISSIONS.length}`, sub: `${overdue} overdue`, color: overdue > 0 ? C.red : C.green },
        { label: 'KPIs in Target',         value: `${KPIS.filter(k=>k.rag==='G').length}/${KPIS.length}`, sub: `${KPIS.filter(k=>k.rag==='A').length} amber · ${KPIS.filter(k=>k.rag==='R').length} red`, color: C.blue },
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

// ─── Tab 1: Board Pack Status ─────────────────────────────────────────────────

function BoardPackStatus() {
  const [sections, setSections] = useState(BOARD_PACK_SECTIONS)

  const approve = (id) => setSections(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED', reviewedBy: 'Head FP&A' } : s))

  const STATUS_META = {
    APPROVED: { bg: '#dcfce7', color: C.green,  label: 'Approved'  },
    REVIEW:   { bg: '#eff6ff', color: C.blue,   label: 'In Review' },
    DRAFT:    { bg: '#fdf4ff', color: C.purple, label: 'Draft'     },
  }

  const totalPages = sections.reduce((s, sec) => s + sec.pages, 0)
  const approved   = sections.filter(s => s.status === 'APPROVED').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Progress banner */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Board Pack — Q1 2025</span>
            <span style={{ fontSize: 11, color: C.muted, marginLeft: 12 }}>{totalPages} pages total · Agent-drafted, Head FP&A approved</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>{approved}/{sections.length} sections approved</div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${(approved / sections.length) * 100}%`, height: '100%', background: C.purple, borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Section list */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              {['Section', 'Agent', 'Pages', 'Reviewed By', 'Status', 'Note', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
                  textAlign: h === 'Section' || h === 'Note' ? 'left' : 'right',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((s, i) => {
              const sm = STATUS_META[s.status] || STATUS_META.DRAFT
              return (
                <tr key={s.id} style={{
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${sm.color}`,
                }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy }}>{s.title}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: '#fdf4ff', color: C.purple }}>{s.agent}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: C.slate, fontWeight: 600 }}>{s.pages}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: s.reviewedBy ? C.green : C.red, fontSize: 11, fontWeight: 600 }}>
                    {s.reviewedBy || '—'}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: sm.bg, color: sm.color,
                    }}>{sm.label}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: C.muted, fontSize: 11, maxWidth: 240 }}>{s.note}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    {s.status !== 'APPROVED'
                      ? <button onClick={() => approve(s.id)} style={{
                          padding: '4px 12px', borderRadius: 4, border: `1px solid ${C.green}`,
                          background: '#dcfce7', color: C.green, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        }}>Approve</button>
                      : <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>✓ Done</span>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Agent note */}
      <div style={{
        background: '#fdf4ff', border: `1px solid ${C.purple}30`, borderRadius: 4,
        padding: '0.75rem 1rem', display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 14 }}>⬡</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 3 }}>Reporting Agent — Pack Assembly Status</div>
          <div style={{ fontSize: 11, color: C.navy, lineHeight: 1.5 }}>
            Board pack on track for May 30 submission. 2 sections in review — Balance Sheet commentary awaits CFO input on working capital assumptions;
            Forecast Recast pending EMEA resubmission. Agent can auto-compile PDF upon your approval of remaining sections.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab 2: Forecast Accuracy ─────────────────────────────────────────────────

function ForecastAccuracyTab() {
  const mapes = FORECAST_ACCURACY.filter(f => f.mape !== null).map(f => f.mape)
  const avgMape = (mapes.reduce((s, v) => s + v, 0) / mapes.length).toFixed(1)
  const maxMape = Math.max(...mapes)
  const maxRev  = Math.max(...FORECAST_ACCURACY.map(f => f.forecast))

  const BU_ACCURACY = [
    { bu: 'Americas — Enterprise',  mape: 0.8, color: C.green  },
    { bu: 'Americas — Mid-Market',  mape: 1.4, color: C.green  },
    { bu: 'EMEA — Enterprise',      mape: 2.1, color: C.amber  },
    { bu: 'EMEA — Services',        mape: 3.8, color: C.red    },
    { bu: 'APAC',                   mape: 1.1, color: C.green  },
    { bu: 'Corporate / Central',    mape: 0.4, color: C.green  },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* MAPE summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Rolling 12m MAPE', value: `${avgMape}%`, sub: 'vs ≤3% target', color: C.green },
          { label: 'Best Month',        value: `0.3%`,        sub: 'Feb 2025',       color: C.green },
          { label: 'Worst Month',       value: `${maxMape}%`, sub: 'Jul 2024',       color: C.amber },
          { label: 'Prior Year MAPE',   value: '5.2%',        sub: '↓ 4.1pp improvement', color: C.purple },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            borderTop: `3px solid ${k.color}`, padding: '0.75rem 1rem', borderRadius: 2,
          }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.slate, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue actuals vs forecast chart */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, padding: '1rem 1.25rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>
          Rolling Forecast vs Actuals — Revenue · 12 Months
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
          {FORECAST_ACCURACY.map((f, i) => {
            const isProjected = f.actual === null
            const actH   = f.actual   ? (f.actual   / maxRev) * 100 : 0
            const foreH  = (f.forecast / maxRev) * 100
            return (
              <div key={f.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 100 }}>
                  {f.actual && (
                    <div style={{
                      flex: 1, height: `${actH}px`, background: C.blue,
                      borderRadius: '2px 2px 0 0', opacity: 0.85,
                    }} />
                  )}
                  <div style={{
                    flex: 1, height: `${foreH}px`,
                    background: isProjected ? C.purple + '60' : C.purple + '30',
                    borderRadius: '2px 2px 0 0',
                    border: isProjected ? `1px dashed ${C.purple}` : 'none',
                  }} />
                </div>
                <div style={{ fontSize: 8, color: C.muted, whiteSpace: 'nowrap' }}>{f.month.replace('-', '\n')}</div>
                {f.mape !== null && (
                  <div style={{ fontSize: 8, fontWeight: 700, color: f.mape > 2 ? C.amber : C.green }}>
                    {f.mape}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: '0.75rem', fontSize: 10, color: C.muted }}>
          <span><span style={{ color: C.blue, fontWeight: 700 }}>■</span> Actual Revenue</span>
          <span><span style={{ color: C.purple, fontWeight: 700 }}>■</span> Forecast</span>
          <span style={{ marginLeft: 'auto' }}>MAPE shown below bars · Apr-25 = projection</span>
        </div>
      </div>

      {/* BU accuracy table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Forecast MAPE by Business Unit
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {BU_ACCURACY.map((bu, i) => (
            <div key={bu.bu} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1.25rem',
              background: i % 2 === 0 ? '#fff' : C.bg,
              borderBottom: `1px solid ${C.border}`,
              borderLeft: `3px solid ${bu.color}`,
            }}>
              <div style={{ width: 200, fontWeight: 600, color: C.navy, fontSize: 12 }}>{bu.bu}</div>
              <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(bu.mape / 5) * 100}%`, height: '100%', background: bu.color, borderRadius: 4 }} />
              </div>
              <div style={{ width: 50, textAlign: 'right', fontWeight: 800, color: bu.color, fontSize: 13 }}>{bu.mape}%</div>
              <div style={{ width: 80, textAlign: 'right', fontSize: 10, color: bu.mape > 3 ? C.red : bu.mape > 1.5 ? C.amber : C.green, fontWeight: 600 }}>
                {bu.mape > 3 ? '▲ Needs work' : bu.mape > 1.5 ? '● Monitor' : '✓ On target'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab 3: Planning Hub ──────────────────────────────────────────────────────

function PlanningHub() {
  const submitted = BU_SUBMISSIONS.filter(b => b.submitted)
  const totalBU   = submitted.reduce((s, b) => s + (b.variance || 0), 0)
  const bottomUp  = TOPDOWN_TARGET + totalBU
  const gap       = bottomUp - TOPDOWN_TARGET

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Top-down vs bottom-up */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Top-Down Target',   value: fmt(TOPDOWN_TARGET), color: C.navy   },
          { label: 'Bottom-Up (BUs)',   value: fmt(bottomUp),       color: submitted.length === BU_SUBMISSIONS.length ? C.green : C.amber },
          { label: 'Gap vs Target',     value: (gap >= 0 ? '+' : '') + fmt(gap), color: gap >= 0 ? C.green : C.red },
          { label: 'Submissions',       value: `${submitted.length}/${BU_SUBMISSIONS.length}`, color: submitted.length < BU_SUBMISSIONS.length ? C.red : C.green },
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

      {/* BU submissions table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            BU Forecast Submissions — Q1 Recast
          </span>
          <span style={{ fontSize: 10, color: C.muted }}>Deadline: Apr 30</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['Business Unit', 'Lead', 'Submitted', 'Variance to Target', 'Status', 'Comment'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px', fontSize: 10, fontWeight: 600, color: C.muted,
                  textAlign: h === 'Business Unit' || h === 'Lead' || h === 'Comment' ? 'left' : 'right',
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BU_SUBMISSIONS.map((b, i) => {
              const statusColor = b.status === 'LOCKED' ? C.green : b.status === 'REVIEW' ? C.blue : C.red
              const statusBg    = b.status === 'LOCKED' ? '#dcfce7' : b.status === 'REVIEW' ? '#eff6ff' : '#fef2f2'
              return (
                <tr key={b.bu} style={{
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${statusColor}`,
                }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy }}>{b.bu}</td>
                  <td style={{ padding: '10px 12px', color: C.slate, fontSize: 11 }}>{b.lead}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: b.submittedAt ? C.green : C.red, fontWeight: 600, fontSize: 11 }}>
                    {b.submittedAt || 'Not submitted'}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: b.variance === null ? C.muted : b.variance >= 0 ? C.green : C.red }}>
                    {b.variance === null ? '—' : (b.variance >= 0 ? '+' : '') + fmt(b.variance)}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: statusBg, color: statusColor,
                    }}>{b.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: C.muted, fontSize: 11 }}>{b.comment}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              <td colSpan={3} style={{ padding: '10px 12px', fontWeight: 700 }}>Bottom-Up Total</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: gap >= 0 ? '#86efac' : '#fca5a5' }}>
                {(gap >= 0 ? '+' : '') + fmt(gap)} vs target
              </td>
              <td colSpan={2} style={{ padding: '10px 12px', fontSize: 11, color: '#94a3b8' }}>
                {submitted.length}/{BU_SUBMISSIONS.length} BUs submitted
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Tab 4: KPI Scorecard ─────────────────────────────────────────────────────

function KPIScorecard() {
  const RAG_META = {
    G: { label: 'On Target', color: C.green,  bg: '#dcfce7' },
    A: { label: 'Monitor',   color: '#b45309', bg: '#fef3c7' },
    R: { label: 'At Risk',   color: C.red,     bg: '#fef2f2' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* RAG summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'On Target', count: KPIS.filter(k => k.rag === 'G').length, color: C.green  },
          { label: 'Monitor',   count: KPIS.filter(k => k.rag === 'A').length, color: '#b45309' },
          { label: 'At Risk',   count: KPIS.filter(k => k.rag === 'R').length, color: C.red     },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            borderTop: `3px solid ${k.color}`, padding: '0.75rem 1rem', borderRadius: 2,
          }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: k.color, lineHeight: 1.2 }}>{k.count}</div>
          </div>
        ))}
        <div style={{ flex: 3, background: '#fff', border: `1px solid ${C.border}`, borderTop: `3px solid ${C.purple}`, padding: '0.75rem 1rem', borderRadius: 2 }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Overall Health</div>
          <div style={{ height: 10, background: C.border, borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${KPIS.filter(k=>k.rag==='G').length/KPIS.length*100}%`, background: C.green }} />
            <div style={{ width: `${KPIS.filter(k=>k.rag==='A').length/KPIS.length*100}%`, background: '#f59e0b' }} />
            <div style={{ width: `${KPIS.filter(k=>k.rag==='R').length/KPIS.length*100}%`, background: C.red }} />
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{Math.round(KPIS.filter(k=>k.rag==='G').length/KPIS.length*100)}% of KPIs on target</div>
        </div>
      </div>

      {/* KPI table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Corporate KPI Scorecard — Q1 2025
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['KPI', 'Current', 'Target', 'Trend (6m)', 'RAG'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px', fontSize: 10, fontWeight: 600, color: C.muted,
                  textAlign: h === 'KPI' ? 'left' : 'right',
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KPIS.map((k, i) => {
              const rm = RAG_META[k.rag]
              const min = Math.min(...k.trend)
              const max = Math.max(...k.trend)
              return (
                <tr key={k.name} style={{
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${rm.color}`,
                }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy }}>{k.name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: rm.color, fontSize: 13 }}>{k.value}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: C.muted, fontSize: 11 }}>{k.target}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    {/* Sparkline using mini divs */}
                    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'flex-end', height: 24 }}>
                      {k.trend.map((v, j) => {
                        const h = max === min ? 12 : ((v - min) / (max - min)) * 20 + 4
                        const isLast = j === k.trend.length - 1
                        return (
                          <div key={j} style={{
                            width: 5, height: h,
                            background: isLast ? rm.color : rm.color + '60',
                            borderRadius: 2,
                          }} />
                        )
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: rm.bg, color: rm.color,
                    }}>{rm.label}</span>
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

// ─── Main export ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'boardpack', label: 'Board Pack'        },
  { id: 'accuracy',  label: 'Forecast Accuracy' },
  { id: 'planning',  label: 'Planning Hub'       },
  { id: 'kpi',       label: 'KPI Scorecard'      },
]

export default function HeadOfFPAWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState('boardpack')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <WBHeader onClose={onClose} />
      <KPIStrip />
      <div style={{ display: 'flex', background: '#fff', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '0.75rem 1.25rem', border: 'none', background: 'none',
            borderBottom: activeTab === t.id ? `2px solid ${C.purple}` : '2px solid transparent',
            color: activeTab === t.id ? C.purple : C.slate,
            fontWeight: activeTab === t.id ? 700 : 400,
            fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.5rem' }}>
        {activeTab === 'boardpack' && <BoardPackStatus />}
        {activeTab === 'accuracy'  && <ForecastAccuracyTab />}
        {activeTab === 'planning'  && <PlanningHub />}
        {activeTab === 'kpi'       && <KPIScorecard />}
      </div>
    </div>
  )
}
