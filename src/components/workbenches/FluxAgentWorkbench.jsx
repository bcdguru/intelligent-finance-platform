import { useState, useMemo } from 'react'
import {
  Button, Tag, ProgressBar, InlineNotification,
  Tabs, TabList, Tab, TabPanel, TabPanels,
} from '@carbon/react'
import { Close, ArrowUp, ArrowDown } from '@carbon/icons-react'
import { BS_ACCOUNTS, ANOMALIES, AUTO_COMMENTARY, calcTotals } from '../../data/fluxData'

// agentstart-aligned palette
const C = {
  teal:    '#0891b2',
  green:   '#059669',
  red:     '#dc2626',
  amber:   '#d97706',
  navy:    '#1e293b',
  slate:   '#475569',
  muted:   '#94a3b8',
  bg:      '#f8fafc',
  border:  '#e2e8f0',
}

const fmtM     = v => `$${Math.abs(v).toFixed(1)}M`
const fmtDelta = v => `${v >= 0 ? '+' : '−'}$${Math.abs(v).toFixed(1)}M`

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ period, onPeriod, onClose }) {
  return (
    <div style={{
      background: C.navy, color: '#f1f5f9', flexShrink: 0,
      padding: '0.75rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      borderBottom: `3px solid ${C.teal}`,
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 6,
        background: C.teal, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 16, flexShrink: 0,
      }}>⬡</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Flux Agent — Variance & Anomaly Intelligence
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
          R2R · General Accounting · Balance Sheet Flux
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
        {['Aug 2024', 'Sep 2024', 'Oct 2024'].map(p => (
          <button key={p} onClick={() => onPeriod(p)} style={{
            padding: '4px 12px', border: '1px solid',
            borderColor: period === p ? C.teal : '#334155',
            background: period === p ? C.teal + '22' : 'transparent',
            color: period === p ? C.teal : '#94a3b8',
            fontSize: 11, cursor: 'pointer', borderRadius: 4,
          }}>{p}</button>
        ))}
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
          display: 'flex', alignItems: 'center', marginLeft: 8, padding: 4,
        }}><Close size={20} /></button>
      </div>
    </div>
  )
}

// ─── KPI strip ───────────────────────────────────────────────────────────────

function KPIStrip({ totals, adjustedImpact }) {
  const { netActual, avb, avpy } = totals
  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
      <KPICard
        label="Net Position · Actual"
        value={fmtM(netActual)}
        topColor={C.teal}
      />
      <KPICard
        label="vs Budget"
        value={fmtDelta(avb)}
        sub={avb >= 0 ? '▲ Favourable' : '▼ Unfavourable'}
        topColor={avb >= 0 ? C.green : C.red}
        valueColor={avb >= 0 ? C.green : C.red}
      />
      <KPICard
        label="vs Prior Year"
        value={fmtDelta(avpy)}
        sub={avpy >= 0 ? '▲ Favourable' : '▼ Unfavourable'}
        topColor={avpy >= 0 ? C.green : C.red}
        valueColor={avpy >= 0 ? C.green : C.red}
      />
      <KPICard
        label="Anomalies Detected"
        value={`${ANOMALIES.length}`}
        sub="2 High Risk · Immediate review"
        topColor={C.amber}
        valueColor={C.amber}
      />
      {adjustedImpact !== 0 && (
        <KPICard
          label="What-If Adjustment"
          value={fmtDelta(adjustedImpact)}
          sub="Simulator active"
          topColor={C.teal}
          valueColor={C.teal}
        />
      )}
    </div>
  )
}

function KPICard({ label, value, sub, topColor, valueColor }) {
  return (
    <div style={{
      flex: 1, padding: '1rem 1.5rem',
      borderRight: `1px solid ${C.border}`,
      borderTop: `3px solid ${topColor || C.teal}`,
    }}>
      <div style={{
        fontSize: 10, color: C.muted,
        textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
      }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: valueColor || C.navy, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: valueColor || C.slate, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
  )
}

// ─── Variance Analysis tab ────────────────────────────────────────────────────

function VarianceTab() {
  const [varMode, setVarMode] = useState('both')
  const totals = useMemo(() => calcTotals(BS_ACCOUNTS), [])
  const maxVal = Math.max(...BS_ACCOUNTS.map(a => a.actual))
  const anomalySet = new Set(ANOMALIES.map(a => a.code))

  return (
    <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: C.bg }}>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: C.muted, marginRight: 4, fontWeight: 500 }}>Variance view:</span>
        {[['avb', 'Act vs Budget'], ['avpy', 'Act vs PY'], ['both', 'Both']].map(([key, lbl]) => (
          <button key={key} onClick={() => setVarMode(key)} style={{
            padding: '5px 16px', borderRadius: 4, border: '1px solid',
            borderColor: varMode === key ? C.navy : C.border,
            background: varMode === key ? C.navy : '#fff',
            color: varMode === key ? '#fff' : C.slate,
            fontSize: 11, fontWeight: 500, cursor: 'pointer',
          }}>{lbl}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: C.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 12, height: 4, background: C.teal, borderRadius: 2, display: 'inline-block' }} /> Actual
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 12, height: 4, background: C.border, borderRadius: 2, display: 'inline-block' }} /> Budget
          </span>
        </span>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.navy, color: '#f1f5f9' }}>
              <th style={TH}>Code</th>
              <th style={{ ...TH, textAlign: 'left', paddingLeft: 16 }}>Account</th>
              <th style={TH}>PY ($M)</th>
              <th style={TH}>Actual ($M)</th>
              <th style={TH}>Budget ($M)</th>
              {(varMode === 'avb'  || varMode === 'both') && <th style={TH}>AvB</th>}
              {(varMode === 'avpy' || varMode === 'both') && <th style={TH}>AvPY</th>}
              <th style={{ ...TH, width: 130 }}>Bar</th>
            </tr>
          </thead>
          <tbody>
            {BS_ACCOUNTS.map((acc, i) => {
              const avb  = acc.actual - acc.budget
              const avpy = acc.actual - acc.py
              const isLiab = acc.category === 'Liability'
              const avbFav  = isLiab ? avb  <= 0 : avb  >= 0
              const avpyFav = isLiab ? avpy <= 0 : avpy >= 0
              const barW = (acc.actual / maxVal) * 100
              const budW = (acc.budget / maxVal) * 100
              const flagged = anomalySet.has(acc.code)
              return (
                <tr key={acc.code} style={{
                  background: flagged ? '#fffbeb' : (i % 2 === 0 ? '#fff' : '#f8fafc'),
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <td style={TD}>
                    <code style={{ fontSize: 10, color: C.muted, fontFamily: 'IBM Plex Mono, monospace' }}>{acc.code}</code>
                  </td>
                  <td style={{ ...TD, textAlign: 'left', paddingLeft: 16 }}>
                    <span style={{ fontWeight: 500, color: C.navy }}>{acc.desc}</span>
                    <span style={{ fontSize: 9, color: C.muted, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {acc.category}
                    </span>
                    {flagged && <span style={{ marginLeft: 4, fontSize: 10, color: C.amber }}>⚠</span>}
                  </td>
                  <td style={{ ...TD, color: C.muted }}>{acc.py.toFixed(1)}</td>
                  <td style={{ ...TD, fontWeight: 700, color: C.navy }}>{acc.actual.toFixed(1)}</td>
                  <td style={{ ...TD, color: C.slate }}>{acc.budget.toFixed(1)}</td>
                  {(varMode === 'avb' || varMode === 'both') && (
                    <td style={{ ...TD, fontWeight: 700, color: avbFav ? C.green : C.red }}>
                      {avb >= 0 ? '+' : ''}{avb.toFixed(1)}
                    </td>
                  )}
                  {(varMode === 'avpy' || varMode === 'both') && (
                    <td style={{ ...TD, fontWeight: 700, color: avpyFav ? C.green : C.red }}>
                      {avpy >= 0 ? '+' : ''}{avpy.toFixed(1)}
                    </td>
                  )}
                  <td style={{ ...TD, paddingLeft: 8, paddingRight: 16 }}>
                    <div style={{ position: 'relative', height: 16 }}>
                      <div style={{ position: 'absolute', top: 2, left: 0, height: 7, width: `${barW}%`, background: C.teal, borderRadius: 2 }} />
                      <div style={{ position: 'absolute', top: 9, left: 0, height: 4, width: `${budW}%`, background: C.border, borderRadius: 2 }} />
                    </div>
                  </td>
                </tr>
              )
            })}
            <tr style={{ background: C.navy, color: '#f1f5f9', fontWeight: 700, fontSize: 12 }}>
              <td style={TD} colSpan={2} />
              <td style={{ ...TD, fontWeight: 700 }}>Net BS Position</td>
              <td style={TD}>{totals.netPY.toFixed(1)}</td>
              <td style={{ ...TD, color: C.teal }}>{totals.netActual.toFixed(1)}</td>
              <td style={TD}>{totals.netBudget.toFixed(1)}</td>
              {(varMode === 'avb' || varMode === 'both') && (
                <td style={{ ...TD, color: totals.avb >= 0 ? '#4ade80' : '#f87171' }}>
                  {totals.avb >= 0 ? '+' : ''}{totals.avb.toFixed(1)}
                </td>
              )}
              {(varMode === 'avpy' || varMode === 'both') && (
                <td style={{ ...TD, color: totals.avpy >= 0 ? '#4ade80' : '#f87171' }}>
                  {totals.avpy >= 0 ? '+' : ''}{totals.avpy.toFixed(1)}
                </td>
              )}
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TH = { padding: '10px 12px', textAlign: 'right', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap', letterSpacing: '0.04em' }
const TD = { padding: '9px 12px', textAlign: 'right' }

// ─── Anomaly Intelligence tab ─────────────────────────────────────────────────

const RISK_TYPE_COUNTS = { 'High Risk': 2, 'Statistical': 3, 'Seasonal': 2, 'Benchmark': 4, 'YoY Trend': 5 }

function AnomalyTab() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: C.bg }}>
      {/* Summary tiles */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
        {Object.entries(RISK_TYPE_COUNTS).map(([type, count]) => (
          <div key={type} style={{
            flex: 1, background: '#fff',
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${type === 'High Risk' ? C.red : C.muted}`,
            padding: '0.875rem', textAlign: 'center', borderRadius: 2,
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: type === 'High Risk' ? C.red : C.navy, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{type}</div>
          </div>
        ))}
      </div>

      <InlineNotification
        kind="warning"
        title="2 high-risk anomalies require review before period close."
        subtitle="Fixed Assets (1500) and Trade Receivables (1100) exceed 1.5σ threshold."
        style={{ marginBottom: '1rem', maxWidth: '100%' }}
      />

      {/* Anomaly cards */}
      {ANOMALIES.map(a => {
        const isOpen = expanded === a.id
        const riskColor = a.risk === 'high' ? C.red : a.risk === 'medium' ? C.amber : C.green
        return (
          <div key={a.id} style={{
            background: '#fff', border: `1px solid ${C.border}`,
            borderLeft: `4px solid ${riskColor}`, marginBottom: 8, borderRadius: 2,
          }}>
            <button onClick={() => setExpanded(isOpen ? null : a.id)} style={{
              width: '100%', background: 'none', border: 'none',
              padding: '0.875rem 1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left',
            }}>
              <code style={{ fontSize: 10, color: C.muted, fontFamily: 'IBM Plex Mono, monospace', minWidth: 36 }}>{a.code}</code>
              <span style={{ fontWeight: 600, fontSize: 12, flex: 1, color: C.navy }}>{a.desc}</span>
              <span style={{ fontSize: 10, color: C.muted, fontFamily: 'IBM Plex Mono, monospace' }}>{a.sigma}σ</span>
              <Tag type={a.risk === 'high' ? 'red' : a.risk === 'medium' ? 'warm-gray' : 'green'} size="sm">{a.type}</Tag>
              <span style={{ fontSize: 13, fontWeight: 800, minWidth: 64, textAlign: 'right', color: a.impact < 0 ? C.red : C.green }}>
                {a.impact >= 0 ? '+' : ''}{a.impact.toFixed(1)}M
              </span>
              <span style={{ fontSize: 10, color: C.muted }}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0.875rem 1rem', borderTop: `1px solid ${C.border}`, background: C.bg }}>
                <p style={{ fontSize: 12, color: C.slate, lineHeight: 1.6, margin: '0 0 0.75rem' }}>{a.finding}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" kind="ghost">Drill Into Account</Button>
                  <Button size="sm" kind="ghost">Create Task</Button>
                  <Button size="sm" kind="ghost">Dismiss</Button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Risk heat strip */}
      <div style={{ marginTop: '1.5rem', background: '#fff', border: `1px solid ${C.border}`, padding: '1rem', borderRadius: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Risk Heat Strip — All Accounts
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {BS_ACCOUNTS.map(acc => {
            const a = ANOMALIES.find(x => x.code === acc.code)
            const bg = a ? (a.risk === 'high' ? C.red : a.risk === 'medium' ? C.amber : '#22c55e') : C.border
            return (
              <div key={acc.code} title={`${acc.desc}: ${a ? a.risk + ' · ' + a.sigma + 'σ' : 'no anomaly'}`}
                style={{ flex: 1, height: 28, background: bg, borderRadius: 3 }} />
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {BS_ACCOUNTS.map(acc => (
            <div key={acc.code} style={{ flex: 1, fontSize: 8, color: C.muted, textAlign: 'center' }}>{acc.code}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: '0.5rem' }}>
          {[[C.red, 'High'], [C.amber, 'Medium'], '#22c55e', 'Low'].flat().reduce((acc, v, i, arr) =>
            i % 2 === 0 ? [...acc, [v, arr[i + 1]]] : acc, []).map(([color, label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.slate }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />{label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── What-If Simulator tab ────────────────────────────────────────────────────

function WhatIfTab({ onImpactChange, totals }) {
  const [corrections, setCorrections] = useState({})

  const adjustedImpact = useMemo(() =>
    ANOMALIES.reduce((sum, a) => sum + a.impact * ((corrections[a.id] || 0) / 100), 0),
  [corrections])
  const adjustedNet = totals.netActual + adjustedImpact
  const avbAdj = adjustedNet - totals.netBudget
  const corrected = Object.values(corrections).filter(v => v !== 0).length
  const confidence = Math.min(96, 72 + corrected * 4)

  useMemo(() => onImpactChange?.(adjustedImpact), [adjustedImpact])

  return (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: C.bg }}>
      <div style={{ flex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Anomaly Correction Simulator
        </div>
        {ANOMALIES.map(a => {
          const val = corrections[a.id] || 0
          const riskColor = a.risk === 'high' ? C.red : a.risk === 'medium' ? C.amber : C.green
          return (
            <div key={a.id} style={{
              background: '#fff', border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${riskColor}`, padding: '0.875rem 1rem', marginBottom: 10, borderRadius: 2,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <code style={{ fontSize: 10, color: C.muted, fontFamily: 'IBM Plex Mono, monospace' }}>{a.code}</code>
                <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: C.navy }}>{a.desc}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: val > 0 ? C.teal : C.muted }}>{val}%</span>
              </div>
              <input type="range" min={0} max={100} step={10} value={val}
                onChange={e => setCorrections(p => ({ ...p, [a.id]: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: C.teal, cursor: 'pointer', height: 4 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: C.muted, marginTop: 4 }}>
                <span>0% — no correction</span>
                <span style={{ fontWeight: val > 0 ? 700 : 400, color: val > 0 ? C.teal : C.muted }}>
                  {val > 0 ? `Adj: ${(a.impact * val / 100) >= 0 ? '+' : ''}${(a.impact * val / 100).toFixed(1)}M` : '—'}
                </span>
                <span>100% — full</span>
              </div>
            </div>
          )
        })}
        <Button kind="secondary" size="sm" onClick={() => setCorrections({})}>Reset All</Button>
      </div>

      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
          Impact on Key Metrics
          <span style={{ fontSize: 10, color: C.green, fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>● Live</span>
        </div>
        {[
          { label: 'Adjusted Net Position', value: `$${adjustedNet.toFixed(1)}M`, sub: adjustedImpact !== 0 ? `${adjustedImpact >= 0 ? '+' : ''}${adjustedImpact.toFixed(1)}M vs baseline` : 'No adjustment', color: C.teal },
          { label: 'Variance to Budget', value: `${avbAdj >= 0 ? '+' : '−'}$${Math.abs(avbAdj).toFixed(1)}M`, color: avbAdj >= 0 ? C.green : C.red },
          { label: 'Anomalies Corrected', value: `${corrected} / ${ANOMALIES.length}`, sub: `${Math.round((corrected / ANOMALIES.length) * 100)}% resolved` },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '0.875rem 1rem', marginBottom: 8, borderRadius: 2 }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: color || C.navy }}>{value}</div>
            {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</div>}
          </div>
        ))}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '0.875rem 1rem', borderRadius: 2 }}>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Forecast Confidence</div>
          <ProgressBar value={confidence} max={100} label="" hideLabel size="sm" />
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: C.navy }}>{confidence}%</div>
          <div style={{ fontSize: 10, color: C.muted }}>{confidence >= 90 ? 'High — ready to submit' : confidence >= 80 ? 'Moderate' : 'Review recommended'}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Commentary & Assign tab ──────────────────────────────────────────────────

function CommentaryTab() {
  const [text, setText] = useState(AUTO_COMMENTARY)
  const [generating, setGenerating] = useState(false)
  const [assignee, setAssignee] = useState('')
  const [status, setStatus] = useState('pending')
  const [sent, setSent] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 1800)
  }

  return (
    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box', background: C.bg }}>
      <div style={{ flex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Commentary</span>
          <span style={{ fontSize: 10, color: C.muted }}>Oct 2024 · Balance Sheet Flux</span>
          <Button kind="ghost" size="sm" onClick={handleGenerate} disabled={generating} style={{ marginLeft: 'auto' }}>
            {generating ? 'Generating…' : '↻ Regenerate'}
          </Button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} style={{
          width: '100%', height: 220, padding: '1rem', boxSizing: 'border-box',
          fontSize: 12, lineHeight: 1.7, color: C.navy,
          border: `1px solid ${C.border}`, fontFamily: 'IBM Plex Sans, sans-serif',
          resize: 'vertical', outline: 'none', borderRadius: 4, background: '#fff',
        }} />
        {generating && <ProgressBar value={null} label="" hideLabel size="sm" style={{ marginTop: 4 }} />}

        <div style={{ marginTop: '1rem', background: '#fff', border: `1px solid ${C.border}`, padding: '0.875rem 1rem', borderRadius: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>Key Drivers</div>
          {[
            { code: '1500', text: 'Fixed Assets −$20.7M vs PY (−16.6%)', risk: 'high' },
            { code: '1100', text: 'Trade Receivables −$11.1M vs PY', risk: 'high' },
            { code: '2100', text: 'Accrued Liabilities −$6.8M vs PY · seasonal', risk: 'medium' },
            { code: '1010', text: 'Cash: 3rd consecutive monthly decline', risk: 'low' },
          ].map(d => (
            <div key={d.code} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
              <code style={{ fontSize: 10, color: C.muted, fontFamily: 'IBM Plex Mono, monospace', minWidth: 36 }}>{d.code}</code>
              <span style={{ fontSize: 11, color: C.slate, flex: 1 }}>{d.text}</span>
              <Tag type={d.risk === 'high' ? 'red' : d.risk === 'medium' ? 'warm-gray' : 'green'} size="sm">{d.risk}</Tag>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assign for Review</div>
        {sent ? (
          <InlineNotification kind="success" title="Assignment sent" subtitle="Commentary routed for Controller review." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Assign To', content: (
                <select value={assignee} onChange={e => setAssignee(e.target.value)} style={SEL}>
                  <option value="">— Select team member —</option>
                  <option>S. Kim (Controller)</option>
                  <option>K. Patel (GL Accountant)</option>
                  <option>M. Chen (Audit & Compliance)</option>
                  <option>T. Okafor (Treasury Analyst)</option>
                </select>
              )},
              { label: 'Due Date', content: <input type="date" style={SEL} /> },
            ].map(({ label, content }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: C.slate, fontWeight: 500, marginBottom: 4 }}>{label}</div>
                {content}
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: C.slate, fontWeight: 500, marginBottom: 4 }}>Status</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[['pending', '⏳'], ['submitted', '📩'], ['approved', '✓']].map(([s, icon]) => (
                  <button key={s} onClick={() => setStatus(s)} style={{
                    flex: 1, padding: '6px', border: `1px solid ${status === s ? C.teal : C.border}`,
                    background: status === s ? C.teal + '18' : '#fff',
                    color: status === s ? C.teal : C.slate,
                    fontSize: 10, cursor: 'pointer', borderRadius: 2, textTransform: 'capitalize',
                  }}>{icon} {s}</button>
                ))}
              </div>
            </div>
            <textarea placeholder="Note for reviewer…" style={{ ...SEL, height: 64, resize: 'vertical', padding: '0.5rem' }} />
            <Button kind="primary" size="sm" disabled={!assignee} onClick={() => setSent(true)}>Send Assignment</Button>
            <Button kind="ghost" size="sm">Export as PDF</Button>
          </div>
        )}
      </div>
    </div>
  )
}

const SEL = {
  width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${C.border}`,
  fontSize: 12, fontFamily: 'IBM Plex Sans, sans-serif', background: '#fff',
  color: C.navy, outline: 'none', boxSizing: 'border-box', borderRadius: 2,
}

// ─── Main workbench ───────────────────────────────────────────────────────────

export default function FluxAgentWorkbench({ onClose }) {
  const [period, setPeriod] = useState('Oct 2024')
  const [adjustedImpact, setAdjustedImpact] = useState(0)
  const totals = useMemo(() => calcTotals(BS_ACCOUNTS), [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <Header period={period} onPeriod={setPeriod} onClose={onClose} />
      <KPIStrip totals={totals} adjustedImpact={adjustedImpact} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs>
          <TabList aria-label="Flux analysis" contained>
            <Tab>Variance Analysis</Tab>
            <Tab><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Anomaly Intelligence <Tag type="red" size="sm">{ANOMALIES.length}</Tag></span></Tab>
            <Tab>What-If Simulator</Tab>
            <Tab>Commentary & Assign</Tab>
          </TabList>
          <TabPanels style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}><VarianceTab /></TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}><AnomalyTab /></TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}><WhatIfTab totals={totals} onImpactChange={setAdjustedImpact} /></TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}><CommentaryTab /></TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  )
}
