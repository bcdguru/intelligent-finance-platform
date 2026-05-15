import { useState } from 'react'
import { Button, Tag } from '@carbon/react'
import { Close } from '@carbon/icons-react'

const C = {
  blue:   '#0072c3',
  teal:   '#0072c3',
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

// ── 13-Week Rolling Forecast ──────────────────────────────────────────────────
const FORECAST = [
  { wk: 'W1',  date: 'May 19', open: 182, coll: 47, payroll: -28, opex: -12, debtDiv:   0, other: -5, close: 184, p50: 180, p10: 165, p90: 195 },
  { wk: 'W2',  date: 'May 26', open: 184, coll: 51, payroll:   0, opex: -14, debtDiv: -45, other: -4, close: 172, p50: 167, p10: 150, p90: 183 },
  { wk: 'W3',  date: 'Jun 2',  open: 172, coll: 44, payroll: -29, opex: -11, debtDiv:   0, other: -6, close: 170, p50: 164, p10: 147, p90: 181 },
  { wk: 'W4',  date: 'Jun 9',  open: 170, coll: 53, payroll:   0, opex: -13, debtDiv:   0, other: -4, close: 206, p50: 199, p10: 181, p90: 217 },
  { wk: 'W5',  date: 'Jun 16', open: 206, coll: 48, payroll: -27, opex: -12, debtDiv:   0, other: -5, close: 210, p50: 202, p10: 183, p90: 221 },
  { wk: 'W6',  date: 'Jun 23', open: 210, coll: 55, payroll:   0, opex: -14, debtDiv: -45, other: -3, close: 203, p50: 194, p10: 174, p90: 214 },
  { wk: 'W7',  date: 'Jun 30', open: 203, coll: 46, payroll: -30, opex: -11, debtDiv:   0, other: -6, close: 202, p50: 193, p10: 172, p90: 214 },
  { wk: 'W8',  date: 'Jul 7',  open: 202, coll: 52, payroll:   0, opex: -13, debtDiv:   0, other: -4, close: 237, p50: 226, p10: 204, p90: 248 },
  { wk: 'W9',  date: 'Jul 14', open: 237, coll: 49, payroll: -28, opex: -12, debtDiv: -90, other: -5, close: 151, p50: 140, p10: 118, p90: 162 },
  { wk: 'W10', date: 'Jul 21', open: 151, coll: 57, payroll:   0, opex: -14, debtDiv:   0, other: -4, close: 190, p50: 178, p10: 154, p90: 202 },
  { wk: 'W11', date: 'Jul 28', open: 190, coll: 44, payroll: -29, opex: -11, debtDiv:   0, other: -5, close: 189, p50: 175, p10: 150, p90: 200 },
  { wk: 'W12', date: 'Aug 4',  open: 189, coll: 56, payroll:   0, opex: -13, debtDiv: -45, other: -3, close: 184, p50: 168, p10: 142, p90: 194 },
  { wk: 'W13', date: 'Aug 11', open: 184, coll: 51, payroll: -28, opex: -12, debtDiv:   0, other: -4, close: 191, p50: 173, p10: 146, p90: 200 },
]

// ── Waterfall: precomputed offsets (max running = 435) ────────────────────────
const WF_MAX = 435
const WF_ITEMS = [
  { label: 'Opening Cash (Jan 1)',  type: 'start', value:  148, leftPct:  0.0, widthPct: 34.0 },
  { label: 'Operating Cash Flow',  type: 'pos',   value: +287, leftPct: 34.0, widthPct: 66.0 },
  { label: 'Working Capital Δ',    type: 'neg',   value:  -42, leftPct: 90.3, widthPct:  9.7 },
  { label: 'Capital Expenditures', type: 'neg',   value:  -78, leftPct: 72.4, widthPct: 17.9 },
  { label: 'Debt Repayment (Q1)',  type: 'neg',   value:  -90, leftPct: 51.7, widthPct: 20.7 },
  { label: 'Interest & Fees',      type: 'neg',   value:  -18, leftPct: 47.6, widthPct:  4.1 },
  { label: 'Other Investing',      type: 'neg',   value:  -15, leftPct: 44.1, widthPct:  3.4 },
  { label: 'Closing Cash (May 15)',type: 'end',   value:  192, leftPct:  0.0, widthPct: 44.1 },
]

const MONTHLY = [
  { month: 'Jan', actual: 188, plan: 180 },
  { month: 'Feb', actual: 172, plan: 185 },
  { month: 'Mar', actual: 204, plan: 195 },
  { month: 'Apr', actual: 195, plan: 200 },
  { month: 'May (MTD)', actual: 98, plan: 195 },
]

// ── Debt & Covenants ──────────────────────────────────────────────────────────
const FACILITIES = [
  { name: 'Revolving Credit Facility', committed: 400, drawn:  85, avail: 315, maturity: 'Aug 2027', rate: 'SOFR+125', status: 'ok'    },
  { name: 'Term Loan A',               committed: 200, drawn: 200, avail:   0, maturity: 'Mar 2026', rate: 'SOFR+150', status: 'watch' },
  { name: 'Senior Notes 4.75%',        committed: 300, drawn: 300, avail:   0, maturity: 'Jun 2028', rate: '4.75% Fixed', status: 'ok' },
  { name: 'Senior Notes 5.50%',        committed: 150, drawn: 150, avail:   0, maturity: 'Sep 2031', rate: '5.50% Fixed', status: 'ok' },
]

const COVENANTS = [
  { name: 'Net Leverage',      limit: '≤ 3.5×',  actual: '1.8×',  headroom: '1.7× buffer',  bar: 48  },
  { name: 'Interest Coverage', limit: '≥ 3.0×',  actual: '6.4×',  headroom: '+3.4× buffer', bar: 85  },
  { name: 'Min Liquidity',     limit: '≥ $100M', actual: '$497M', headroom: '$397M buffer', bar: 80  },
  { name: 'CapEx / EBITDA',    limit: '≤ 15%',   actual: '9.2%',  headroom: '5.8pp buffer', bar: 39  },
]

const MATURITY_PTS = [
  { label: 'Now',  sub: '',              color: C.slate },
  { label: '2026', sub: 'Term A $200M',  color: C.amber },
  { label: '2027', sub: 'RCF $400M',    color: C.blue  },
  { label: '2028', sub: 'Notes 4.75%',  color: C.teal  },
  { label: '2031', sub: 'Notes 5.50%',  color: C.green },
]

// ── AR Aging ──────────────────────────────────────────────────────────────────
const AR_AGING = [
  { bucket: '0–30 days',  amount: 124, pct: 68, rate: '0.2%',  prov: 0.2, net: 123.8, trend:  0 },
  { bucket: '31–60 days', amount:  38, pct: 21, rate: '1.5%',  prov: 0.6, net:  37.4, trend: -1 },
  { bucket: '61–90 days', amount:  14, pct:  8, rate: '4.0%',  prov: 0.6, net:  13.4, trend:  1 },
  { bucket: '90+ days',   amount:   6, pct:  3, rate: '15.0%', prov: 0.9, net:   5.1, trend:  0 },
]

// ── Shared sub-components ─────────────────────────────────────────────────────
function KPICard({ label, value, sub, topColor }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, background: '#fff',
      border: `1px solid ${C.border}`, borderTop: `3px solid ${topColor}`,
      borderRadius: 6, padding: '0.75rem 1rem',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 5, fontWeight: 500 }}>{sub}</div>}
    </div>
  )
}

function SectionHeader({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
      {children}
    </div>
  )
}

// ── Tab: 13-Week Forecast ─────────────────────────────────────────────────────
function ForecastTab() {
  const maxClose = Math.max(...FORECAST.map(w => w.close))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Mini trend chart */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <SectionHeader>13-Week Closing Balance · P10 / P50 / P90 Range</SectionHeader>
          <div style={{ display: 'flex', gap: 12 }}>
            {[{ color: C.green, label: 'Above P50' }, { color: C.amber, label: 'Below P50' }].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.slate }}>
                <div style={{ width: 10, height: 10, background: l.color, borderRadius: 2 }} />{l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80, marginBottom: 6 }}>
          {FORECAST.map((w, i) => {
            const ht = Math.max((w.close / maxClose) * 76, 4)
            const above = w.close >= w.p50
            const low = w.close < 160
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: 80, justifyContent: 'flex-end' }}>
                {/* P90 tick */}
                <div style={{ width: 2, height: Math.max((w.p90 - w.close) / maxClose * 76, 2), background: '#bae6fd', borderRadius: 1, marginBottom: 1 }} />
                <div
                  title={`${w.wk} ${w.date}: $${w.close}M (P50: $${w.p50}M, P10: $${w.p10}M, P90: $${w.p90}M)`}
                  style={{ width: '100%', height: ht, background: low ? C.amber : above ? C.green : C.teal, borderRadius: '2px 2px 0 0', cursor: 'default', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                />
                {/* P10 tick */}
                <div style={{ width: 2, height: Math.max((w.close - w.p10) / maxClose * 76, 2), background: '#bae6fd', borderRadius: 1, marginTop: 1 }} />
              </div>
            )
          })}
        </div>

        {/* Week labels */}
        <div style={{ display: 'flex', gap: 5 }}>
          {FORECAST.map((w, i) => (
            <div key={i} style={{ flex: 1, fontSize: 8.5, color: C.muted, textAlign: 'center' }}>{w.wk}</div>
          ))}
        </div>

        {/* Floor annotation */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 2, background: C.red, borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: C.red, fontWeight: 600 }}>$100M min covenant floor · W9 trough $151M (+$51M headroom)</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: C.muted }}>ML Forecast Agent · 1.8% MAPE</span>
        </div>
      </div>

      {/* Forecast table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                {['Week', 'Date', 'Opening $M', 'Collections', 'Payroll', 'Corp OpEx', 'Debt / Div', 'Other', 'Closing $M', 'P50', 'Δ vs P50'].map(h => (
                  <th key={h} style={{ padding: '0.45rem 0.75rem', textAlign: h === 'Week' || h === 'Date' ? 'left' : 'right', fontWeight: 700, color: C.slate, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FORECAST.map((w, i) => {
                const delta = w.close - w.p50
                const isLow = w.close < 160
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: isLow ? '#fffbeb' : i % 2 === 0 ? '#fff' : C.bg }}>
                    <td style={{ padding: '0.4rem 0.75rem', fontWeight: 700, color: C.navy }}>{w.wk}</td>
                    <td style={{ padding: '0.4rem 0.75rem', color: C.muted, fontSize: 10 }}>{w.date}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: C.slate }}>{w.open}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: C.green, fontWeight: 600 }}>+{w.coll}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: w.payroll < 0 ? C.red : C.muted }}>{w.payroll || '—'}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: C.red }}>{w.opex}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: w.debtDiv < 0 ? C.red : C.muted, fontWeight: w.debtDiv < 0 ? 700 : 400 }}>{w.debtDiv || '—'}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: C.red }}>{w.other}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', fontWeight: 700, color: isLow ? C.amber : C.navy }}>{w.close}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: C.muted }}>{w.p50}</td>
                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: delta >= 0 ? C.green : C.amber }}>{delta >= 0 ? '+' : ''}{delta}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Tab: Cash Flow Bridge ─────────────────────────────────────────────────────
function CashFlowTab() {
  const maxMonth = 220

  const wfColor = (type) =>
    type === 'start' ? C.navy : type === 'end' ? C.blue : type === 'pos' ? C.green : C.red

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {/* Waterfall */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '1rem' }}>
        <SectionHeader>Cash Flow Bridge · FY 2025 YTD (Jan – May 15)</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {WF_ITEMS.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 140, fontSize: 10, color: C.slate, textAlign: 'right', flexShrink: 0, lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ flex: 1, height: 22, position: 'relative', background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  left: `${item.leftPct}%`,
                  width: `${item.widthPct}%`,
                  height: '100%',
                  background: wfColor(item.type),
                  borderRadius: 2,
                  minWidth: 3,
                }} />
              </div>
              <div style={{ width: 54, fontSize: 10, fontWeight: 700, color: wfColor(item.type), textAlign: 'right', flexShrink: 0 }}>
                {item.type === 'pos' ? `+$${item.value}M` : item.type === 'neg' ? `$${item.value}M` : `$${item.value}M`}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
          <span style={{ color: C.slate }}>YTD net change: <strong style={{ color: C.green }}>+$44M</strong></span>
          <span style={{ color: C.slate }}>vs plan: <strong style={{ color: C.blue }}>+$12M</strong></span>
        </div>

        {/* AI narrative */}
        <div style={{ marginTop: 10, padding: '0.625rem', background: '#eff6ff', borderRadius: 4, borderLeft: `3px solid ${C.blue}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.blue, marginBottom: 3 }}>Narrative Author · AI Commentary</div>
          <div style={{ fontSize: 10, color: C.navy, lineHeight: 1.55 }}>
            Strong operating cash flow of +$287M offsets planned capex ($78M) and debt service ($90M). Net position +$44M ahead of opening, tracking $12M above FY plan.
          </div>
        </div>
      </div>

      {/* Monthly collections */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '1rem' }}>
        <SectionHeader>Monthly Collections · Actual vs Plan ($M)</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MONTHLY.map((m, i) => {
            const above = m.actual >= m.plan
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>{m.month}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: above ? C.green : C.amber }}>
                    ${m.actual}M {above ? '▲' : '▼'} / ${m.plan}M plan
                  </span>
                </div>
                <div style={{ position: 'relative', height: 14, background: C.bg, borderRadius: 4, overflow: 'visible' }}>
                  {/* Actual bar */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${m.actual / maxMonth * 100}%`, background: above ? C.teal : C.amber, borderRadius: 4 }} />
                  {/* Plan marker */}
                  <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${m.plan / maxMonth * 100}%`, width: 2, background: C.slate, borderRadius: 1 }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* FX exposure callout */}
        <div style={{ marginTop: '1rem' }}>
          <SectionHeader>Multi-Currency Exposure (13-Week)</SectionHeader>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { ccy: 'USD', pct: 68, color: C.blue },
              { ccy: 'EUR', pct: 14, color: C.teal },
              { ccy: 'GBP', pct: 9,  color: C.purple },
              { ccy: 'CAD', pct: 5,  color: C.green },
              { ccy: 'Other', pct: 4, color: C.muted },
            ].map(c => (
              <div key={c.ccy} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: C.bg, borderRadius: 4, border: `1px solid ${C.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: C.navy }}>{c.ccy}</span>
                <span style={{ fontSize: 10, color: C.muted }}>{c.pct}%</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: C.muted }}>
            FX hedge ratio 82% · net exposure $34M · ML Forecast Agent models 10 currencies (1.8% MAPE)
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tab: Debt & Covenants ─────────────────────────────────────────────────────
function DebtCovenantsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Facilities table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <SectionHeader>Debt Facilities & Availability</SectionHeader>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                {['Facility', 'Committed $M', 'Drawn $M', 'Available $M', 'Maturity', 'Rate', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.45rem 0.875rem', textAlign: h === 'Facility' ? 'left' : 'right', fontWeight: 700, color: C.slate, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FACILITIES.map((f, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : C.bg }}>
                  <td style={{ padding: '0.55rem 0.875rem', fontWeight: 600, color: C.navy }}>{f.name}</td>
                  <td style={{ padding: '0.55rem 0.875rem', textAlign: 'right', color: C.slate }}>{f.committed}</td>
                  <td style={{ padding: '0.55rem 0.875rem', textAlign: 'right', fontWeight: 600, color: C.navy }}>{f.drawn}</td>
                  <td style={{ padding: '0.55rem 0.875rem', textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: f.avail > 0 ? C.green : C.muted }}>
                      {f.avail > 0 ? f.avail : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '0.55rem 0.875rem', textAlign: 'right', color: f.status === 'watch' ? C.amber : C.slate }}>{f.maturity}</td>
                  <td style={{ padding: '0.55rem 0.875rem', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.slate }}>{f.rate}</td>
                  <td style={{ padding: '0.55rem 0.875rem', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                      background: f.status === 'ok' ? '#d1fae5' : '#fef3c7',
                      color: f.status === 'ok' ? C.green : C.amber,
                      border: `1px solid ${f.status === 'ok' ? '#6ee7b7' : '#fcd34d'}`,
                    }}>
                      {f.status === 'ok' ? '✓ OK' : '⚠ Watch'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Maturity timeline */}
        <div style={{ padding: '0.875rem 1rem', borderTop: `1px solid ${C.border}`, background: C.bg }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Maturity Profile</div>
          <div style={{ position: 'relative', display: 'flex', paddingBottom: 4 }}>
            <div style={{ position: 'absolute', top: 8, left: '5%', right: '5%', height: 2, background: C.border }} />
            {MATURITY_PTS.map((pt, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: pt.color, border: '2px solid #fff', boxShadow: `0 0 0 1.5px ${pt.color}` }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: C.slate, marginTop: 5 }}>{pt.label}</div>
                {pt.sub && <div style={{ fontSize: 8, color: pt.color, marginTop: 2, fontWeight: 600, textAlign: 'center' }}>{pt.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Covenant cards */}
      <div>
        <SectionHeader>Covenant Compliance · All 4 Covenants Passing</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {COVENANTS.map((cov, i) => (
            <div key={i} style={{
              background: '#fff', border: `1px solid ${C.border}`,
              borderTop: `3px solid ${C.green}`, borderRadius: 6, padding: '0.875rem 1rem',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{cov.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', marginBottom: 2 }}>{cov.actual}</div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>Limit: {cov.limit}</div>
              <div style={{ background: C.bg, borderRadius: 4, height: 5, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: `${cov.bar}%`, height: '100%', background: C.green, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>✓ {cov.headroom}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Guardian note */}
      <div style={{ background: '#f0fdf4', border: `1px solid #6ee7b7`, borderRadius: 6, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green }}>Compliance Guardian · All Covenants Certified</div>
          <div style={{ fontSize: 10, color: C.slate, marginTop: 2 }}>Last tested 2025-05-14 22:00 UTC · Next test 2025-05-15 22:00 · 0 covenant breaches in trailing 12 months · SOX-compliant audit trail active</div>
        </div>
      </div>
    </div>
  )
}

// ── Tab: Liquidity Position ───────────────────────────────────────────────────
function LiquidityTab() {
  const totalAR = AR_AGING.reduce((s, r) => s + r.amount, 0)
  const totalProv = AR_AGING.reduce((s, r) => s + r.prov, 0)

  const LIQUIDITY_STACK = [
    { label: 'Cash on Hand', value: 182, color: C.blue },
    { label: 'Undrawn RCF',  value: 315, color: C.teal },
  ]
  const totalLiq = 497

  const LIQ_ROWS = [
    { label: 'Cash on Hand',              value: '$182M', color: C.blue  },
    { label: 'Undrawn Revolving Credit',  value: '$315M', color: C.teal  },
    { label: 'Total Available Liquidity', value: '$497M', color: C.navy, bold: true },
    { label: 'Min Liquidity Covenant',    value: '$100M', color: C.slate },
    { label: 'Headroom Above Floor',      value: '$397M', color: C.green },
    { label: 'Days of OpEx Coverage',     value: '38 days', color: C.teal },
    { label: '13-Wk Minimum Cash (W9)',   value: '$151M', color: C.amber },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {/* Liquidity breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '1rem' }}>
          <SectionHeader>Liquidity Position · May 19 2025</SectionHeader>

          {/* Stacked bar */}
          <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 36, marginBottom: 10 }}>
            {LIQUIDITY_STACK.map((item, i) => (
              <div key={i} style={{
                width: `${item.value / totalLiq * 100}%`, background: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>${item.value}M</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: '1rem' }}>
            {LIQUIDITY_STACK.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.slate }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                {item.label}: <strong style={{ color: C.navy }}>${item.value}M</strong>
              </div>
            ))}
          </div>

          {/* KPI rows */}
          {LIQ_ROWS.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`,
              ...(row.bold ? { borderTop: `2px solid ${C.border}`, marginTop: 2, paddingTop: '0.5rem' } : {}),
            }}>
              <span style={{ fontSize: 11, color: C.slate, fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* ML agent card */}
        <div style={{ padding: '0.875rem 1rem', background: '#eff6ff', borderRadius: 6, border: `1px solid #bfdbfe`, borderLeft: `3px solid ${C.blue}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.blue, marginBottom: 4 }}>ML Forecast Agent · Liquidity Risk Summary</div>
          <div style={{ fontSize: 10, color: C.navy, lineHeight: 1.6 }}>
            All 13 forecast weeks maintain cash above the $100M covenant floor.
            W9 trough at $151M is driven by the $90M scheduled debt repayment — $51M buffer maintained.
            P10 downside scenario: $118M at W9 (still above floor).
            No liquidity events flagged in the 13-week horizon.
          </div>
        </div>
      </div>

      {/* AR Aging & CECL */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}` }}>
          <SectionHeader>AR Aging & CECL Provision</SectionHeader>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {['Aging Bucket', 'Amount $M', '% of AR', 'CECL Rate', 'Provision $M', 'Net $M', 'Trend'].map(h => (
                <th key={h} style={{ padding: '0.45rem 0.75rem', textAlign: h === 'Aging Bucket' ? 'left' : 'right', fontWeight: 700, color: C.slate, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AR_AGING.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : C.bg }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: C.navy }}>{row.bucket}</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: C.slate }}>{row.amount}</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <div style={{ width: row.pct * 0.5, height: 6, background: C.blue, borderRadius: 2, opacity: 0.6 }} />
                    <span style={{ color: C.slate }}>{row.pct}%</span>
                  </div>
                </td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, color: i === 0 ? C.green : i === 1 ? C.amber : C.red }}>{row.rate}</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: C.red }}>{row.prov.toFixed(1)}</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: C.navy }}>{row.net.toFixed(1)}</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                  {row.trend === 1 ? <span style={{ color: C.red, fontWeight: 700 }}>▲</span>
                    : row.trend === -1 ? <span style={{ color: C.green, fontWeight: 700 }}>▼</span>
                    : <span style={{ color: C.muted }}>—</span>}
                </td>
              </tr>
            ))}
            <tr style={{ background: C.bg, borderTop: `2px solid ${C.border}` }}>
              <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: C.navy }}>Total</td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: C.navy }}>{totalAR}</td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: C.slate }}>100%</td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.slate }}>1.3% blended</td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: C.red }}>{totalProv.toFixed(1)}</td>
              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: C.navy }}>{(totalAR - totalProv).toFixed(1)}</td>
              <td />
            </tr>
          </tbody>
        </table>
        <div style={{ padding: '0.625rem 0.875rem', background: '#f0fdf4', borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.green, fontWeight: 600 }}>
          ✓ CECL provision adequate · last stress-tested 2025-05-01 · Compliance Guardian certified
        </div>

        {/* DSO trend */}
        <div style={{ padding: '0.875rem 1rem', borderTop: `1px solid ${C.border}` }}>
          <SectionHeader>DSO Trend (90-Day)</SectionHeader>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
            {[42, 44, 39, 41, 38, 40, 37, 35, 34, 34, 33, 32].map((dso, i) => {
              const ht = (dso / 50) * 44
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '80%', height: ht, background: i === 11 ? C.blue : '#bfdbfe', borderRadius: '2px 2px 0 0' }} />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: C.muted }}>
            <span>Feb</span><span>Mar</span><span>Apr</span><span>May (now)</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: C.slate }}>Current DSO: <strong style={{ color: C.blue }}>32 days</strong> · Target ≤ 35 · <span style={{ color: C.green }}>▼ −10d vs Feb</span></div>
        </div>
      </div>
    </div>
  )
}

// ── Main Workbench ────────────────────────────────────────────────────────────
const TABS = ['13-Week Forecast', 'Cash Flow Bridge', 'Debt & Covenants', 'Liquidity Position']

export default function CashLiquidityWorkbench({ onClose }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: '#f4f4f4' }}>

        {/* Header */}
        <div style={{ background: '#0E2841', borderBottom: '1px solid #393939', padding: '0.875rem 1.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#156082', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>⬡</div>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Cash & Liquidity Workbench</div>
                <div style={{ color: '#8d8d8d', fontSize: 11, marginTop: 1 }}>Treasury Management · FY 2025 · Week of May 19</div>
              </div>
              <Tag type="green" size="sm">Live · R2R Wave 1</Tag>
            </div>
            <Button size="sm" kind="ghost" renderIcon={Close} iconDescription="Close" hasIconOnly onClick={onClose} />
          </div>
        </div>

        {/* KPI bar */}
        <div style={{ display: 'flex', gap: 10, padding: '0.875rem 1.5rem', flexShrink: 0, background: '#fff', borderBottom: `1px solid ${C.border}` }}>
          <KPICard label="Available Liquidity"  value="$497M"  sub="▲ +$34M vs plan · Cash + Undrawn RCF"  topColor={C.blue} />
          <KPICard label="Forecast Accuracy"    value="1.8%"   sub="MAPE · 13-week rolling · ↓ −0.4pp vs Q3" topColor={C.green} />
          <KPICard label="Undrawn RCF"          value="$315M"  sub="of $400M facility · matures Aug 2027"    topColor={C.teal} />
          <KPICard label="Net Leverage"         value="1.8×"   sub="Target ≤ 3.5× · 1.7× headroom"          topColor={C.green} />
          <KPICard label="13-Wk Cash Floor"     value="$151M"  sub="W9 Jul 14 · $51M above $100M covenant"   topColor={C.amber} />
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: '#fff' }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              padding: '0.625rem 1.25rem', fontSize: 12,
              fontWeight: activeTab === i ? 700 : 500,
              color: activeTab === i ? C.blue : C.slate,
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === i ? `2px solid ${C.blue}` : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {activeTab === 0 && <ForecastTab />}
          {activeTab === 1 && <CashFlowTab />}
          {activeTab === 2 && <DebtCovenantsTab />}
          {activeTab === 3 && <LiquidityTab />}
        </div>
    </div>
  )
}
