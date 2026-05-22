import { useState } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close, ArrowUp, ArrowDown } from '@carbon/icons-react'

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

const fmt  = n => `$${Math.abs(n) >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : (n / 1_000).toFixed(0) + 'K'}`
const fmtS = n => (n >= 0 ? '+' : '') + fmt(n)
const pct  = (a, b) => b ? ((a - b) / Math.abs(b) * 100).toFixed(1) : '—'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PL_LINES = [
  { line: 'Revenue',              actual: 284_200_000, budget: 271_500_000, py: 253_800_000, type: 'header' },
  { line: '  Product Revenue',    actual: 201_400_000, budget: 192_000_000, py: 178_200_000, type: 'sub'    },
  { line: '  Services Revenue',   actual: 82_800_000,  budget: 79_500_000,  py: 75_600_000,  type: 'sub'    },
  { line: 'Cost of Revenue',      actual: -112_300_000,budget: -109_400_000,py: -104_200_000,type: 'header' },
  { line: 'Gross Profit',         actual: 171_900_000, budget: 162_100_000, py: 149_600_000, type: 'total'  },
  { line: '  Gross Margin %',     actual: 60.5,        budget: 59.7,        py: 59.0,        type: 'pct'    },
  { line: 'Operating Expenses',   actual: -108_400_000,budget: -104_200_000,py: -98_100_000, type: 'header' },
  { line: '  Sales & Marketing',  actual: -51_200_000, budget: -49_500_000, py: -46_800_000, type: 'sub'    },
  { line: '  R&D',                actual: -38_600_000, budget: -36_800_000, py: -33_400_000, type: 'sub'    },
  { line: '  G&A',                actual: -18_600_000, budget: -17_900_000, py: -17_900_000, type: 'sub'    },
  { line: 'EBITDA',               actual: 63_500_000,  budget: 57_900_000,  py: 51_500_000,  type: 'total'  },
  { line: '  EBITDA Margin %',    actual: 22.3,        budget: 21.3,        py: 20.3,        type: 'pct'    },
  { line: 'D&A',                  actual: -9_200_000,  budget: -8_900_000,  py: -8_400_000,  type: 'sub'    },
  { line: 'EBIT',                 actual: 54_300_000,  budget: 49_000_000,  py: 43_100_000,  type: 'total'  },
  { line: 'Net Income',           actual: 38_900_000,  budget: 34_200_000,  py: 29_800_000,  type: 'total'  },
]

const BRIDGE_ITEMS = [
  { label: 'Prior Year Actual', value: 51_500_000,  type: 'base',      color: '#334155' },
  { label: 'Volume',            value: 7_800_000,   type: 'positive',  color: C.green   },
  { label: 'Price / Rate',      value: 4_200_000,   type: 'positive',  color: '#0891b2' },
  { label: 'Mix',               value: -1_400_000,  type: 'negative',  color: C.amber   },
  { label: 'FX Impact',         value: -2_100_000,  type: 'negative',  color: C.red     },
  { label: 'Cost Efficiency',   value: 3_500_000,   type: 'positive',  color: C.green   },
  { label: 'Investments',       value: -5_400_000,  type: 'negative',  color: C.red     },
  { label: 'Other',             value: 1_400_000,   type: 'positive',  color: C.muted   },
  { label: 'Current EBITDA',    value: 63_500_000,  type: 'base',      color: C.purple  },
]

const SCENARIOS = [
  {
    id: 'base',   label: 'Base Case',   color: C.blue,
    revenue: 284_200_000, gm: 60.5, ebitda: 63_500_000, ebitdaPct: 22.3,
    headcount: 4820, avgRev: 58_900, assumptions: ['Organic growth 12%', 'No major M&A', 'FX flat to Jan'],
  },
  {
    id: 'upside', label: 'Upside',      color: C.green,
    revenue: 301_500_000, gm: 62.1, ebitda: 74_200_000, ebitdaPct: 24.6,
    headcount: 4820, avgRev: 62_400, assumptions: ['2 new enterprise wins', 'APAC expansion on plan', 'EUR strengthens 5%'],
  },
  {
    id: 'down',   label: 'Downside',    color: C.red,
    revenue: 261_800_000, gm: 58.2, ebitda: 48_100_000, ebitdaPct: 18.4,
    headcount: 4750, avgRev: 55_100, assumptions: ['Key renewal slippage', 'EMEA macro headwind', 'USD strengthens 8%'],
  },
]

const MARGIN_LINES = [
  { segment: 'Enterprise SaaS',  rev: 142_000_000, cogs: 49_700_000, gm: 92_300_000, gmPct: 65.0 },
  { segment: 'Mid-Market SaaS',  rev: 59_400_000,  cogs: 26_200_000, gm: 33_200_000, gmPct: 55.9 },
  { segment: 'Professional Svcs',rev: 42_800_000,  cogs: 24_900_000, gm: 17_900_000, gmPct: 41.8 },
  { segment: 'Support & Success',rev: 24_100_000,  cogs: 8_400_000,  gm: 15_700_000, gmPct: 65.1 },
  { segment: 'HW / Other',       rev: 15_900_000,  cogs: 12_100_000, gm: 3_800_000,  gmPct: 23.9 },
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
        <div style={{ fontSize: 15, fontWeight: 600 }}>FP&amp;A Analyst Workbench</div>
        <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>
          FP&amp;A — Variance Analysis · Scenario Modelling · Margin Intelligence
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
  const kpis = [
    { label: 'YTD Revenue',       value: '$284.2M', sub: '+$12.7M vs Budget',        color: C.blue   },
    { label: 'EBITDA',            value: '$63.5M',  sub: '22.3% margin · +5.6M BvA', color: C.green  },
    { label: 'EBITDA vs Budget',  value: '+9.7%',   sub: 'Favourable',                color: C.green  },
    { label: 'Revenue vs PY',     value: '+12.0%',  sub: '$30.4M growth YTD',         color: C.purple },
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

// ─── Tab 1: Variance Explorer ─────────────────────────────────────────────────

function VarianceExplorer() {
  const [view, setView] = useState('bva') // bva = budget vs actual, pya = py vs actual

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* View toggle */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Compare to:</span>
        {[['bva', 'Budget vs Actual'], ['pya', 'Prior Year vs Actual']].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} style={{
            padding: '5px 14px', borderRadius: 4, border: '1px solid',
            borderColor: view === id ? C.purple : C.border,
            background: view === id ? C.purple + '15' : '#fff',
            color: view === id ? C.purple : C.slate,
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>{label}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>Period: YTD Q1 2025 · All Entities</span>
      </div>

      {/* P&L table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', width: '32%' }}>P&amp;L LINE</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>ACTUAL</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>{view === 'bva' ? 'BUDGET' : 'PRIOR YEAR'}</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>VAR ($)</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>VAR (%)</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>TREND</th>
            </tr>
          </thead>
          <tbody>
            {PL_LINES.map((row, i) => {
              if (row.type === 'pct') {
                const comp = view === 'bva' ? row.budget : row.py
                const varV = row.actual - comp
                return (
                  <tr key={row.line} style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '7px 16px', color: C.muted, fontSize: 11, paddingLeft: 32 }}>{row.line}</td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', color: C.slate, fontWeight: 600 }}>{row.actual.toFixed(1)}%</td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', color: C.slate }}>{comp.toFixed(1)}%</td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 700, color: varV >= 0 ? C.green : C.red }}>{varV >= 0 ? '+' : ''}{varV.toFixed(1)} pp</td>
                    <td colSpan={2} />
                  </tr>
                )
              }
              const comp    = view === 'bva' ? row.budget : row.py
              const varVal  = row.actual - comp
              const varPct  = pct(row.actual, comp)
              const isFav   = (row.line.includes('Cost') || row.line.includes('Expense') || row.line.includes('D&A'))
                ? varVal <= 0 : varVal >= 0
              const bgColor = row.type === 'total' ? '#f0f9ff' : row.type === 'header' ? '#f8fafc' : '#fff'
              const fontW   = row.type === 'total' ? 800 : row.type === 'header' ? 700 : 400
              return (
                <tr key={row.line} style={{ background: bgColor, borderBottom: `1px solid ${C.border}` }}>
                  <td style={{
                    padding: '9px 16px', fontWeight: fontW, color: C.navy, fontSize: 12,
                    paddingLeft: row.type === 'sub' ? 32 : 16,
                    borderLeft: row.type === 'total' ? `3px solid ${C.purple}` : '3px solid transparent',
                  }}>{row.line}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: fontW, color: C.navy }}>{fmt(row.actual)}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', color: C.slate }}>{fmt(comp)}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: isFav ? C.green : C.red }}>
                    {fmtS(varVal)}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: isFav ? C.green : C.red }}>
                    {varPct === '—' ? '—' : `${varPct > 0 ? '+' : ''}${varPct}%`}
                  </td>
                  <td style={{ padding: '9px 12px' }}>
                    {isFav
                      ? <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>▲ Fav</span>
                      : <span style={{ color: C.red,   fontSize: 11, fontWeight: 700 }}>▼ Unfav</span>
                    }
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

// ─── Tab 2: Variance Bridge ───────────────────────────────────────────────────

function VarianceBridge() {
  const maxVal = Math.max(...BRIDGE_ITEMS.map(b => Math.abs(b.value)))
  let running = BRIDGE_ITEMS[0].value

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Title */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, padding: '1rem 1.25rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1.25rem' }}>
          EBITDA Bridge — Prior Year to Current · Waterfall Analysis
        </div>
        {/* Waterfall bars */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 200, padding: '0 0.5rem' }}>
          {BRIDGE_ITEMS.map((b, i) => {
            const isBase = b.type === 'base'
            const barHeight = (Math.abs(b.value) / maxVal) * 160
            const isPos     = b.value >= 0

            if (isBase) {
              return (
                <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: b.color }}>{fmt(b.value)}</div>
                  <div style={{ width: '100%', height: `${(b.value / maxVal) * 160}px`, background: b.color, borderRadius: '3px 3px 0 0' }} />
                  <div style={{ fontSize: 9, color: C.muted, textAlign: 'center', lineHeight: 1.3 }}>{b.label}</div>
                </div>
              )
            }

            return (
              <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: b.color }}>
                  {b.value >= 0 ? '+' : ''}{fmt(b.value)}
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 160 }}>
                  <div style={{
                    width: '100%', height: barHeight,
                    background: b.color, borderRadius: isPos ? '3px 3px 0 0' : '0 0 3px 3px',
                    opacity: 0.85,
                  }} />
                </div>
                <div style={{ fontSize: 9, color: C.muted, textAlign: 'center', lineHeight: 1.3 }}>{b.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bridge detail table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Bridge Components — EBITDA Variance Attribution
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <tbody>
            {BRIDGE_ITEMS.slice(1, -1).map((b, i) => (
              <tr key={b.label} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: C.navy }}>{b.label}</td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 800, color: b.color, fontSize: 14 }}>
                  {b.value >= 0 ? '+' : ''}{fmt(b.value)}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: '100%', height: 6, background: C.border, borderRadius: 3 }}>
                    <div style={{
                      width: `${(Math.abs(b.value) / maxVal) * 100}%`,
                      height: '100%', background: b.color, borderRadius: 3,
                    }} />
                  </div>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontSize: 10, color: C.muted, fontWeight: 500 }}>
                  {b.value >= 0 ? 'Favourable' : 'Unfavourable'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              <td style={{ padding: '10px 16px', fontWeight: 700 }}>Net EBITDA Bridge</td>
              <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 800, color: '#86efac' }}>
                +{fmt(BRIDGE_ITEMS[BRIDGE_ITEMS.length - 1].value - BRIDGE_ITEMS[0].value)}
              </td>
              <td colSpan={2} style={{ padding: '10px 16px', fontSize: 11, color: '#94a3b8' }}>
                Total variance from prior year EBITDA
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Tab 3: Scenario Builder ──────────────────────────────────────────────────

function ScenarioBuilder() {
  const [active, setActive] = useState('base')
  const sel = SCENARIOS.find(s => s.id === active)

  const ROWS = [
    { label: 'Revenue',         key: 'revenue',    fmt: v => fmt(v) },
    { label: 'Gross Margin %',  key: 'gm',         fmt: v => `${v.toFixed(1)}%` },
    { label: 'EBITDA',          key: 'ebitda',     fmt: v => fmt(v) },
    { label: 'EBITDA Margin %', key: 'ebitdaPct',  fmt: v => `${v.toFixed(1)}%` },
    { label: 'Headcount',       key: 'headcount',  fmt: v => v.toLocaleString() },
    { label: 'Rev / FTE',       key: 'avgRev',     fmt: v => `$${(v / 1000).toFixed(0)}K` },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Scenario cards */}
      <div style={{ display: 'flex', gap: 12 }}>
        {SCENARIOS.map(s => (
          <div
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              flex: 1, background: '#fff', border: `2px solid ${active === s.id ? s.color : C.border}`,
              borderTop: `4px solid ${s.color}`, borderRadius: 4, padding: '1rem',
              cursor: 'pointer', transition: 'border-color 0.15s',
              boxShadow: active === s.id ? `0 0 0 3px ${s.color}20` : 'none',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>{fmt(s.revenue)}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Revenue · {s.ebitdaPct.toFixed(1)}% EBITDA</div>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {s.assumptions.map(a => (
                <div key={a} style={{ fontSize: 10, color: C.slate, display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                  <span style={{ color: s.color, flexShrink: 0 }}>→</span> {a}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-side comparison table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Scenario Comparison — Key P&amp;L Metrics
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: C.muted, borderBottom: `1px solid ${C.border}` }}>Metric</th>
              {SCENARIOS.map(s => (
                <th key={s.id} style={{
                  padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 700,
                  color: s.color, borderBottom: `1px solid ${C.border}`,
                  background: active === s.id ? s.color + '08' : 'transparent',
                }}>{s.label}</th>
              ))}
              <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, color: C.muted, borderBottom: `1px solid ${C.border}` }}>Range</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.label} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: C.navy }}>{r.label}</td>
                {SCENARIOS.map(s => (
                  <td key={s.id} style={{
                    padding: '10px 12px', textAlign: 'right', fontWeight: active === s.id ? 800 : 500,
                    color: active === s.id ? s.color : C.slate,
                    background: active === s.id ? s.color + '08' : 'transparent',
                  }}>{r.fmt(s[r.key])}</td>
                ))}
                <td style={{ padding: '10px 12px', textAlign: 'right', color: C.muted, fontSize: 11 }}>
                  {r.fmt(Math.min(...SCENARIOS.map(s => s[r.key])))} – {r.fmt(Math.max(...SCENARIOS.map(s => s[r.key])))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Tab 4: Margin Analysis ───────────────────────────────────────────────────

function MarginAnalysis() {
  const totalRev = MARGIN_LINES.reduce((s, l) => s + l.rev, 0)
  const totalGM  = MARGIN_LINES.reduce((s, l) => s + l.gm, 0)
  const blendedGM = (totalGM / totalRev * 100).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Summary banner */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total Revenue',     value: fmt(totalRev),      color: C.blue   },
          { label: 'Gross Profit',      value: fmt(totalGM),       color: C.green  },
          { label: 'Blended GM%',       value: `${blendedGM}%`,    color: C.purple },
          { label: 'Highest-GM Segment',value: 'Enterprise SaaS',  color: C.navy   },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: '#fff', border: `1px solid ${C.border}`,
            borderTop: `3px solid ${k.color}`, padding: '0.75rem 1rem', borderRadius: 2,
          }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Segment table + GM bars */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Gross Margin by Revenue Segment — YTD
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['Segment', 'Revenue', 'COGS', 'Gross Profit', 'GM %', 'Mix %', 'GM Profile'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px', fontSize: 10, fontWeight: 600, color: C.muted,
                  textAlign: h === 'Segment' ? 'left' : 'right',
                  borderBottom: `1px solid ${C.border}`, letterSpacing: '0.04em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MARGIN_LINES.map((l, i) => {
              const mixPct = (l.rev / totalRev * 100).toFixed(1)
              const gmColor = l.gmPct >= 60 ? C.green : l.gmPct >= 45 ? C.blue : l.gmPct >= 30 ? C.amber : C.red
              return (
                <tr key={l.segment} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: C.navy }}>{l.segment}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: C.slate }}>{fmt(l.rev)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: C.red }}>{fmt(l.cogs)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: C.green }}>{fmt(l.gm)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: gmColor, fontSize: 13 }}>{l.gmPct.toFixed(1)}%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: C.muted, fontSize: 11 }}>{mixPct}%</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{ width: 80, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${l.gmPct}%`, height: '100%', background: gmColor, borderRadius: 4 }} />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              <td style={{ padding: '10px 12px', fontWeight: 700 }}>Total / Blended</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>{fmt(totalRev)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{fmt(MARGIN_LINES.reduce((s,l)=>s+l.cogs,0))}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>{fmt(totalGM)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#86efac' }}>{blendedGM}%</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#94a3b8' }}>100%</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mix vs Margin scatter proxy */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2, padding: '1rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>
          Mix vs Margin — Segment Positioning
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {MARGIN_LINES.map(l => {
            const mixPct = (l.rev / totalRev * 100)
            const gmColor = l.gmPct >= 60 ? C.green : l.gmPct >= 45 ? C.blue : l.gmPct >= 30 ? C.amber : C.red
            return (
              <div key={l.segment} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: gmColor }}>{l.gmPct.toFixed(0)}%</div>
                <div style={{
                  width: '80%', height: `${(l.gmPct / 70) * 120}px`,
                  background: `linear-gradient(to top, ${gmColor}, ${gmColor}80)`,
                  borderRadius: '3px 3px 0 0',
                  minHeight: 20,
                }} />
                <div style={{
                  width: `${mixPct * 2.5}px`, height: 6, background: gmColor + '50',
                  borderRadius: 3, margin: '0 auto',
                }} />
                <div style={{ fontSize: 9, color: C.muted, textAlign: 'center', lineHeight: 1.3, maxWidth: 80 }}>
                  {l.segment.replace(' SaaS', '').replace(' Svcs', '').replace('Professional ', 'Prof ')}
                </div>
                <div style={{ fontSize: 9, color: C.slate, fontWeight: 600 }}>{mixPct.toFixed(0)}% mix</div>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: 10, color: C.muted, textAlign: 'center' }}>
          Bar height = GM% · Bar width = revenue mix · Goal: grow high-GM segments
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'variance', label: 'Variance Explorer' },
  { id: 'bridge',   label: 'Variance Bridge'   },
  { id: 'scenario', label: 'Scenario Builder'   },
  { id: 'margin',   label: 'Margin Analysis'    },
]

export default function FPAAnalystWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState('variance')

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
        {activeTab === 'variance' && <VarianceExplorer />}
        {activeTab === 'bridge'   && <VarianceBridge />}
        {activeTab === 'scenario' && <ScenarioBuilder />}
        {activeTab === 'margin'   && <MarginAnalysis />}
      </div>
    </div>
  )
}
