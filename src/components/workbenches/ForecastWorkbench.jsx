import { useState } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close } from '@carbon/icons-react'

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

const fmt = n => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLLING_MONTHS = [
  { month: 'May-24', locked: true,  actual: 43_600_000,  forecast: 43_600_000  },
  { month: 'Jun-24', locked: true,  actual: 44_200_000,  forecast: 44_200_000  },
  { month: 'Jul-24', locked: true,  actual: 44_800_000,  forecast: 44_800_000  },
  { month: 'Aug-24', locked: true,  actual: 45_600_000,  forecast: 45_600_000  },
  { month: 'Sep-24', locked: true,  actual: 46_300_000,  forecast: 46_300_000  },
  { month: 'Oct-24', locked: true,  actual: 47_100_000,  forecast: 47_100_000  },
  { month: 'Nov-24', locked: true,  actual: 47_800_000,  forecast: 47_800_000  },
  { month: 'Dec-24', locked: true,  actual: 48_600_000,  forecast: 48_600_000  },
  { month: 'Jan-25', locked: true,  actual: 46_200_000,  forecast: 46_200_000  },
  { month: 'Feb-25', locked: true,  actual: 47_100_000,  forecast: 47_100_000  },
  { month: 'Mar-25', locked: true,  actual: 47_900_000,  forecast: 47_900_000  },
  { month: 'Apr-25', locked: false, actual: null,         forecast: 48_800_000  },
  { month: 'May-25', locked: false, actual: null,         forecast: 49_600_000  },
  { month: 'Jun-25', locked: false, actual: null,         forecast: 50_400_000  },
  { month: 'Jul-25', locked: false, actual: null,         forecast: 51_100_000  },
  { month: 'Aug-25', locked: false, actual: null,         forecast: 51_900_000  },
]

const DRIVERS = [
  { category: 'Revenue Drivers', items: [
    { id: 'volume',       label: 'New Logo Growth',         value: 12.0, unit: '%',   impact: 14_800_000, description: 'YoY new customer acquisition rate' },
    { id: 'price',        label: 'Average Selling Price',   value: 3.8,  unit: '%',   impact: 4_700_000,  description: 'ASP increase from pricing actions' },
    { id: 'churn',        label: 'Gross Churn Rate',        value: -4.2, unit: '%',   impact: -5_200_000, description: 'Annual gross revenue churn' },
    { id: 'expansion',    label: 'Expansion / Upsell',      value: 8.5,  unit: '%',   impact: 10_500_000, description: 'NRR expansion from existing base' },
    { id: 'mix',          label: 'Enterprise Mix Shift',    value: 2.1,  unit: 'pp',  impact: 3_100_000,  description: 'Enterprise as % of new bookings' },
  ]},
  { category: 'Cost Drivers', items: [
    { id: 'cogs',         label: 'COGS as % Revenue',       value: 39.5, unit: '%',   impact: -112_300_000, description: 'Blended cost of revenue rate' },
    { id: 'headcount',    label: 'Headcount Growth',        value: 3.5,  unit: '%',   impact: -8_400_000,   description: 'Net headcount adds vs plan' },
    { id: 'avg-comp',     label: 'Avg Compensation Uplift', value: 4.2,  unit: '%',   impact: -6_200_000,   description: 'Annual merit and equity cycle' },
    { id: 'opex',         label: 'Discretionary OpEx',      value: -1.2, unit: '%',   impact: 2_100_000,    description: 'Travel, marketing, programs' },
    { id: 'capex',        label: 'CapEx / Revenue',         value: 4.2,  unit: '%',   impact: -11_900_000,  description: 'Infrastructure and product investment' },
  ]},
]

const SCENARIOS_FULL = [
  {
    id: 'base', label: 'Base Case', color: C.blue,
    fy: 588_000_000, ebitda: 131_000_000, ebitdaPct: 22.3,
    assumptions: [
      { key: 'New Logo Growth',   base: '12%',   val: '12%'   },
      { key: 'Gross Churn',       base: '4.2%',  val: '4.2%'  },
      { key: 'ASP Increase',      base: '3.8%',  val: '3.8%'  },
      { key: 'COGS Rate',         base: '39.5%', val: '39.5%' },
      { key: 'HC Growth',         base: '3.5%',  val: '3.5%'  },
      { key: 'FX (EUR/USD)',      base: '1.08',  val: '1.08'  },
    ],
  },
  {
    id: 'upside', label: 'Upside (+10%)', color: C.green,
    fy: 635_000_000, ebitda: 158_000_000, ebitdaPct: 24.9,
    assumptions: [
      { key: 'New Logo Growth',   base: '12%',   val: '18%'   },
      { key: 'Gross Churn',       base: '4.2%',  val: '3.4%'  },
      { key: 'ASP Increase',      base: '3.8%',  val: '5.5%'  },
      { key: 'COGS Rate',         base: '39.5%', val: '38.0%' },
      { key: 'HC Growth',         base: '3.5%',  val: '3.5%'  },
      { key: 'FX (EUR/USD)',      base: '1.08',  val: '1.12'  },
    ],
  },
  {
    id: 'downside', label: 'Downside (−15%)', color: C.red,
    fy: 521_000_000, ebitda: 91_000_000, ebitdaPct: 17.5,
    assumptions: [
      { key: 'New Logo Growth',   base: '12%',   val: '6%'    },
      { key: 'Gross Churn',       base: '4.2%',  val: '7.1%'  },
      { key: 'ASP Increase',      base: '3.8%',  val: '1.0%'  },
      { key: 'COGS Rate',         base: '39.5%', val: '41.5%' },
      { key: 'HC Growth',         base: '3.5%',  val: '2.0%'  },
      { key: 'FX (EUR/USD)',      base: '1.08',  val: '1.03'  },
    ],
  },
]

const MACRO_SIGNALS = [
  { signal: 'US GDP Growth (Q1 2025)',      value: '2.4%',   prior: '2.8%',   direction: 'down',  impact: 'NEUTRAL', note: 'Slight softening; enterprise pipeline resilient',      category: 'Macro'    },
  { signal: 'US CPI (YoY)',                 value: '3.2%',   prior: '3.9%',   direction: 'down',  impact: 'POS',     note: 'Cooling inflation → rate cut expectations → IT spend ↑', category: 'Macro'    },
  { signal: 'Fed Funds Rate',               value: '5.00%',  prior: '5.25%',  direction: 'down',  impact: 'POS',     note: 'First cut in 18m; cost of capital improving',             category: 'Macro'    },
  { signal: 'EUR/USD FX Rate',              value: '1.08',   prior: '1.03',   direction: 'up',    impact: 'POS',     note: 'EUR strengthening → EMEA revenue tailwind ~$2.1M',        category: 'FX'       },
  { signal: 'GBP/USD FX Rate',             value: '1.27',   prior: '1.24',   direction: 'up',    impact: 'POS',     note: 'UK revenue +$0.8M at current rates',                       category: 'FX'       },
  { signal: 'JPY/USD FX Rate',             value: '152',    prior: '142',    direction: 'up',    impact: 'NEG',     note: 'JPY weakening → APAC revenue headwind ~$1.4M',             category: 'FX'       },
  { signal: 'Global IT Spend Growth',       value: '+8.3%',  prior: '+6.1%',  direction: 'up',    impact: 'POS',     note: 'Gartner upward revision; SaaS leader to benefit',          category: 'Industry' },
  { signal: 'AI / Automation Budget Share', value: '18%',   prior: '11%',    direction: 'up',    impact: 'POS',     note: 'CFO AI mandate accelerating; align pipeline messaging',    category: 'Industry' },
  { signal: 'Software VC Funding (Q1)',     value: '$18.4B', prior: '$14.1B', direction: 'up',    impact: 'NEG',     note: 'Competitor funding ↑; watch for pricing pressure',         category: 'Industry' },
  { signal: 'Enterprise Software P/E',      value: '28x',   prior: '24x',    direction: 'up',    impact: 'NEUTRAL', note: 'Multiple expansion; CFO evaluating M&A optionality',       category: 'Market'   },
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
        <div style={{ fontSize: 15, fontWeight: 600 }}>Forecast Workbench</div>
        <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>
          FP&amp;A — Rolling Forecast · Driver Model · Scenario Planning · Macro Intelligence
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
  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
      {[
        { label: 'FY25 Forecast Revenue',  value: '$588M',   sub: 'Base case · 12% growth',      color: C.blue   },
        { label: 'FY25 EBITDA',            value: '$131M',   sub: '22.3% margin · +1.0pp YoY',   color: C.green  },
        { label: 'Upside Potential',       value: '+$47M',   sub: 'Upside case vs base',          color: C.purple },
        { label: 'Downside Risk',          value: '−$67M',   sub: 'Downside case vs base',        color: C.red    },
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

// ─── Tab 1: Rolling Forecast ──────────────────────────────────────────────────

function RollingForecast() {
  const maxVal = Math.max(...ROLLING_MONTHS.map(m => m.forecast))
  const locked = ROLLING_MONTHS.filter(m => m.locked)
  const open   = ROLLING_MONTHS.filter(m => !m.locked)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Chart */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Monthly Revenue — Rolling 16m Forecast
          </span>
          <div style={{ display: 'flex', gap: 12, fontSize: 10, color: C.muted }}>
            <span><span style={{ color: C.blue, fontWeight: 700 }}>■</span> Actual (locked)</span>
            <span><span style={{ color: C.purple, fontWeight: 700 }}>▥</span> Forecast (open)</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 140 }}>
          {ROLLING_MONTHS.map((m, i) => {
            const h = (m.forecast / maxVal) * 120
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: m.locked ? C.blue : C.purple, whiteSpace: 'nowrap' }}>
                  {fmt(m.forecast).replace('$', '')}
                </div>
                <div style={{
                  width: '100%', height: h,
                  background: m.locked ? C.blue : C.purple + '50',
                  borderRadius: '2px 2px 0 0',
                  border: m.locked ? 'none' : `1px dashed ${C.purple}`,
                }} />
                <div style={{ fontSize: 8, color: C.muted, whiteSpace: 'nowrap', transform: 'rotate(-45deg)', transformOrigin: 'top center', marginTop: 8, height: 32 }}>
                  {m.month}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: 24, fontSize: 11, paddingTop: '0.5rem', borderTop: `1px solid ${C.border}` }}>
          <div><span style={{ color: C.muted }}>Actuals locked: </span><span style={{ fontWeight: 700, color: C.navy }}>{locked.length} months · {fmt(locked.reduce((s,m)=>s+m.actual,0))}</span></div>
          <div><span style={{ color: C.muted }}>Forecast open: </span><span style={{ fontWeight: 700, color: C.purple }}>{open.length} months · {fmt(open.reduce((s,m)=>s+m.forecast,0))}</span></div>
          <div style={{ marginLeft: 'auto' }}><span style={{ color: C.muted }}>FY25 Run-Rate: </span><span style={{ fontWeight: 700, color: C.green }}>$588M base</span></div>
        </div>
      </div>

      {/* Monthly detail table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              {['Month', 'Actual', 'Forecast', 'Δ vs Prior Month', 'Lock Status', 'Confidence'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
                  textAlign: h === 'Month' ? 'left' : 'right',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLLING_MONTHS.filter((_, i) => i >= 8).map((m, i, arr) => {
              const prior = arr[i - 1]?.forecast || 0
              const delta = m.forecast - prior
              return (
                <tr key={m.month} style={{
                  background: m.locked ? '#f0f9ff' : (i % 2 === 0 ? '#fff' : C.bg),
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${m.locked ? C.blue : C.purple}`,
                }}>
                  <td style={{ padding: '9px 12px', fontWeight: 600, color: C.navy }}>{m.month}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: m.actual ? C.blue : C.muted }}>
                    {m.actual ? fmt(m.actual) : '—'}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: m.locked ? 600 : 800, color: m.locked ? C.slate : C.purple }}>
                    {fmt(m.forecast)}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600, color: delta >= 0 ? C.green : C.red }}>
                    {prior ? (delta >= 0 ? '+' : '') + fmt(delta) : '—'}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                      background: m.locked ? '#eff6ff' : '#fdf4ff',
                      color: m.locked ? C.blue : C.purple,
                    }}>{m.locked ? '🔒 Locked' : '✏️ Open'}</span>
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                    <span style={{ fontSize: 10, color: m.locked ? C.green : C.muted, fontWeight: 600 }}>
                      {m.locked ? '100% — Actual' : i < 3 ? 'High' : i < 5 ? 'Medium' : 'Low'}
                    </span>
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

// ─── Tab 2: Driver Model ──────────────────────────────────────────────────────

function DriverModel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {DRIVERS.map(group => (
        <div key={group.category} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {group.category}
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {['Driver', 'Base Value', 'Unit', 'P&L Impact', 'Impact Bar', 'Description'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', fontSize: 10, fontWeight: 600, color: C.muted,
                    textAlign: h === 'Driver' || h === 'Description' ? 'left' : 'right',
                    borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.items.map((d, i) => {
                const absImpact = Math.abs(d.impact)
                const maxImpact = Math.max(...group.items.map(x => Math.abs(x.impact)))
                const barW = (absImpact / maxImpact) * 100
                const impactColor = d.impact >= 0 ? C.green : C.red
                return (
                  <tr key={d.id} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy }}>{d.label}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: C.blue, fontSize: 13 }}>
                      {d.value > 0 && d.unit !== '$' ? '' : ''}{d.value}{d.unit}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: '#e5f6ff', color: C.blue, fontWeight: 600 }}>{d.unit}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: impactColor, fontSize: 12 }}>
                      {d.impact >= 0 ? '+' : ''}{fmt(d.impact)}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <div style={{ width: 80, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${barW}%`, height: '100%', background: impactColor, borderRadius: 4 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: C.muted, fontSize: 11 }}>{d.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

// ─── Tab 3: Scenario Comparison ───────────────────────────────────────────────

function ScenarioComparison() {
  const [active, setActive] = useState('base')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Scenario summary cards */}
      <div style={{ display: 'flex', gap: 12 }}>
        {SCENARIOS_FULL.map(s => (
          <div
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              flex: 1, background: '#fff', cursor: 'pointer',
              border: `2px solid ${active === s.id ? s.color : C.border}`,
              borderTop: `4px solid ${s.color}`, borderRadius: 4, padding: '1rem',
              boxShadow: active === s.id ? `0 0 0 3px ${s.color}20` : 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.navy }}>{fmt(s.fy)}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>FY25 Revenue</div>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase' }}>EBITDA</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{fmt(s.ebitda)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase' }}>Margin</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.ebitdaPct}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assumptions comparison */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Key Assumptions — Base vs Scenarios
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: C.muted, borderBottom: `1px solid ${C.border}` }}>Assumption</th>
              {SCENARIOS_FULL.map(s => (
                <th key={s.id} style={{
                  padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700, color: s.color,
                  borderBottom: `1px solid ${C.border}`,
                  background: active === s.id ? s.color + '08' : 'transparent',
                }}>{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCENARIOS_FULL[0].assumptions.map((a, i) => (
              <tr key={a.key} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy }}>{a.key}</td>
                {SCENARIOS_FULL.map((s, si) => {
                  const val = s.assumptions[i].val
                  const baseVal = SCENARIOS_FULL[0].assumptions[i].val
                  const isDiff = si > 0 && val !== baseVal
                  return (
                    <td key={s.id} style={{
                      padding: '10px 12px', textAlign: 'right',
                      fontWeight: isDiff ? 800 : 500,
                      color: isDiff ? s.color : C.slate,
                      background: active === s.id ? s.color + '08' : 'transparent',
                    }}>{val}</td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          {/* P&L summary footer */}
          <tfoot>
            {[
              { label: 'FY25 Revenue',    vals: SCENARIOS_FULL.map(s => fmt(s.fy))    },
              { label: 'EBITDA',          vals: SCENARIOS_FULL.map(s => fmt(s.ebitda)) },
              { label: 'EBITDA Margin',   vals: SCENARIOS_FULL.map(s => `${s.ebitdaPct}%`) },
            ].map(r => (
              <tr key={r.label} style={{ background: C.navy, color: '#f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700 }}>{r.label}</td>
                {SCENARIOS_FULL.map((s, i) => (
                  <td key={s.id} style={{
                    padding: '10px 12px', textAlign: 'right', fontWeight: 800,
                    color: i === 1 ? '#86efac' : i === 2 ? '#fca5a5' : '#f1f5f9',
                    background: active === s.id ? s.color + '20' : 'transparent',
                  }}>{r.vals[i]}</td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Tab 4: Macro Signals ─────────────────────────────────────────────────────

function MacroSignals() {
  const IMPACT_META = {
    POS:     { label: 'Positive',  bg: '#dcfce7', color: C.green,  icon: '▲' },
    NEG:     { label: 'Negative',  bg: '#fef2f2', color: C.red,    icon: '▼' },
    NEUTRAL: { label: 'Neutral',   bg: '#f4f4f4', color: C.muted,  icon: '●' },
  }
  const CATEGORIES = ['Macro', 'FX', 'Industry', 'Market']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Impact summary */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Positive Signals', count: MACRO_SIGNALS.filter(s=>s.impact==='POS').length, color: C.green  },
          { label: 'Negative Signals', count: MACRO_SIGNALS.filter(s=>s.impact==='NEG').length, color: C.red    },
          { label: 'Neutral Signals',  count: MACRO_SIGNALS.filter(s=>s.impact==='NEUTRAL').length, color: C.muted },
          { label: 'Net Signal Score', count: `+${MACRO_SIGNALS.filter(s=>s.impact==='POS').length - MACRO_SIGNALS.filter(s=>s.impact==='NEG').length}`, color: C.blue },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            borderTop: `3px solid ${k.color}`, padding: '0.75rem 1rem', borderRadius: 2,
          }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1.2 }}>{k.count}</div>
          </div>
        ))}
      </div>

      {/* Signals by category */}
      {CATEGORIES.map(cat => {
        const signals = MACRO_SIGNALS.filter(s => s.category === cat)
        return (
          <div key={cat} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
            <div style={{ padding: '0.625rem 1rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {cat} Signals
              </span>
            </div>
            {signals.map((sig, i) => {
              const im = IMPACT_META[sig.impact]
              return (
                <div key={sig.signal} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '0.75rem 1rem',
                  background: i % 2 === 0 ? '#fff' : C.bg,
                  borderBottom: i < signals.length - 1 ? `1px solid ${C.border}` : 'none',
                  borderLeft: `3px solid ${im.color}`,
                }}>
                  <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 16, color: im.color }}>{im.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 3 }}>
                      <div style={{ fontWeight: 600, color: C.navy, fontSize: 12 }}>{sig.signal}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: C.muted }}>prev: {sig.prior}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: im.color }}>{sig.value}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                          background: im.bg, color: im.color,
                        }}>{im.label}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>{sig.note}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Agent observation */}
      <div style={{
        background: '#fdf4ff', border: `1px solid ${C.purple}30`, borderRadius: 4,
        padding: '0.75rem 1rem', display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 14 }}>⬡</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 3 }}>Forecasting Agent — Signal Overlay</div>
          <div style={{ fontSize: 11, color: C.navy, lineHeight: 1.5 }}>
            Net macro signals are positive (6 positive vs 2 negative). Key upside drivers: IT spend revisions from Gartner (+$8.3%),
            rate cut cycle beginning, and EUR/GBP strengthening. Key risk: JPY weakness ($1.4M headwind) and competitive funding environment.
            Recommended: increase base forecast by +$4.2M. Upside scenario probability elevated to ~35%.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'rolling',   label: 'Rolling Forecast'      },
  { id: 'drivers',   label: 'Driver Model'           },
  { id: 'scenarios', label: 'Scenario Comparison'    },
  { id: 'macro',     label: 'Macro Signals'          },
]

export default function ForecastWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState('rolling')

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
        {activeTab === 'rolling'   && <RollingForecast />}
        {activeTab === 'drivers'   && <DriverModel />}
        {activeTab === 'scenarios' && <ScenarioComparison />}
        {activeTab === 'macro'     && <MacroSignals />}
      </div>
    </div>
  )
}
