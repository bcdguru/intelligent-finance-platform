import { useState, useMemo } from 'react'
import {
  Button, Tag, ProgressBar, InlineNotification,
  Tabs, TabList, Tab, TabPanel, TabPanels,
} from '@carbon/react'
import { Close, ArrowUp, ArrowDown, Analytics } from '@carbon/icons-react'
import { BS_ACCOUNTS, ANOMALIES, AUTO_COMMENTARY, calcTotals } from '../../data/fluxData'

const fmtM  = v => `$${Math.abs(v).toFixed(1)}M`
const fmtDelta = v => `${v >= 0 ? '+' : '−'}$${Math.abs(v).toFixed(1)}M`

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ period, onPeriod, onClose }) {
  return (
    <div style={{
      background: '#161616', color: '#f4f4f4', flexShrink: 0,
      padding: '0.75rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      borderBottom: '2px solid #156082',
    }}>
      <span style={{ color: '#156082', fontSize: 18 }}>⬡</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Flux Agent — Variance & Anomaly Intelligence</div>
        <div style={{ fontSize: 11, color: '#8d8d8d' }}>R2R · General Accounting · Balance Sheet Flux</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
        {['Aug 2024', 'Sep 2024', 'Oct 2024'].map(p => (
          <button key={p} onClick={() => onPeriod(p)} style={{
            padding: '3px 10px', border: '1px solid',
            borderColor: period === p ? '#78a9ff' : '#393939',
            background: period === p ? '#002d9c' : 'transparent',
            color: period === p ? '#fff' : '#8d8d8d',
            fontSize: 11, cursor: 'pointer',
          }}>{p}</button>
        ))}
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#8d8d8d', cursor: 'pointer',
          display: 'flex', alignItems: 'center', marginLeft: 8,
        }}><Close size={20} /></button>
      </div>
    </div>
  )
}

// ─── KPI strip ───────────────────────────────────────────────────────────────

function KPIStrip({ totals, adjustedImpact }) {
  const { netActual, avb, avpy } = totals
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', flexShrink: 0 }}>
      <KPICard label="Net Position (Actual)" value={fmtM(netActual)} />
      <KPICard
        label="vs Budget" value={fmtDelta(avb)}
        sub={avb >= 0 ? 'Favourable' : 'Unfavourable'}
        color={avb >= 0 ? '#24a148' : '#da1e28'}
        Icon={avb >= 0 ? ArrowUp : ArrowDown}
      />
      <KPICard
        label="vs Prior Year" value={fmtDelta(avpy)}
        sub={avpy >= 0 ? 'Favourable' : 'Unfavourable'}
        color={avpy >= 0 ? '#24a148' : '#da1e28'}
        Icon={avpy >= 0 ? ArrowUp : ArrowDown}
      />
      <KPICard
        label="Anomalies Detected" value={`${ANOMALIES.length}`}
        sub="2 High Risk · Review required"
        color="#c7922b"
      />
      {adjustedImpact !== 0 && (
        <KPICard
          label="What-If Adjustment" value={fmtDelta(adjustedImpact)}
          sub="Simulator active"
          color="#156082"
        />
      )}
    </div>
  )
}

function KPICard({ label, value, sub, color, Icon }) {
  return (
    <div style={{ flex: 1, padding: '0.875rem 1.25rem', borderRight: '1px solid #e0e0e0' }}>
      <div style={{ fontSize: 10, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {Icon && <Icon size={14} style={{ color }} />}
        <span style={{ fontSize: 22, fontWeight: 700, color: color || '#161616', lineHeight: 1 }}>{value}</span>
      </div>
      {sub && <div style={{ fontSize: 10, color: color || '#8d8d8d', marginTop: 3 }}>{sub}</div>}
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
    <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#8d8d8d', marginRight: 8 }}>Show variance:</span>
        {[['avb', 'Act vs Budget'], ['avpy', 'Act vs PY'], ['both', 'Both']].map(([key, lbl]) => (
          <button key={key} onClick={() => setVarMode(key)} style={{
            padding: '4px 14px', border: '1px solid',
            borderColor: varMode === key ? '#161616' : '#c6c6c6',
            background: varMode === key ? '#161616' : '#fff',
            color: varMode === key ? '#fff' : '#525252',
            fontSize: 11, cursor: 'pointer',
          }}>{lbl}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#8d8d8d', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 3, background: '#156082', display: 'inline-block' }} /> Actual &nbsp;
          <span style={{ width: 10, height: 3, background: '#c6c6c6', display: 'inline-block' }} /> Budget
        </span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#161616', color: '#f4f4f4' }}>
            <th style={TH}>Code</th>
            <th style={{ ...TH, textAlign: 'left' }}>Account</th>
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
                background: flagged ? '#fff8e1' : (i % 2 === 0 ? '#fff' : '#f9f9f9'),
                borderBottom: '1px solid #e0e0e0',
              }}>
                <td style={TD}>
                  <code style={{ fontSize: 10, color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace' }}>{acc.code}</code>
                </td>
                <td style={{ ...TD, textAlign: 'left' }}>
                  <span style={{ fontWeight: 500 }}>{acc.desc}</span>
                  <span style={{ fontSize: 9, color: '#8d8d8d', marginLeft: 4 }}>{acc.category}</span>
                  {flagged && <span style={{ marginLeft: 4, fontSize: 9, color: '#c7922b', fontWeight: 700 }}>⚠</span>}
                </td>
                <td style={{ ...TD, color: '#8d8d8d' }}>{acc.py.toFixed(1)}</td>
                <td style={{ ...TD, fontWeight: 600 }}>{acc.actual.toFixed(1)}</td>
                <td style={{ ...TD, color: '#8d8d8d' }}>{acc.budget.toFixed(1)}</td>
                {(varMode === 'avb' || varMode === 'both') && (
                  <td style={{ ...TD, fontWeight: 600, color: avbFav ? '#24a148' : '#da1e28' }}>
                    {avb >= 0 ? '+' : ''}{avb.toFixed(1)}
                  </td>
                )}
                {(varMode === 'avpy' || varMode === 'both') && (
                  <td style={{ ...TD, fontWeight: 600, color: avpyFav ? '#24a148' : '#da1e28' }}>
                    {avpy >= 0 ? '+' : ''}{avpy.toFixed(1)}
                  </td>
                )}
                <td style={{ ...TD, paddingLeft: 8, paddingRight: 8 }}>
                  <div style={{ position: 'relative', height: 16 }}>
                    <div style={{ position: 'absolute', top: 1, left: 0, height: 8, width: `${barW}%`, background: '#156082', borderRadius: 1 }} />
                    <div style={{ position: 'absolute', top: 9, left: 0, height: 4, width: `${budW}%`, background: '#c6c6c6', borderRadius: 1 }} />
                  </div>
                </td>
              </tr>
            )
          })}
          {/* Totals */}
          <tr style={{ background: '#161616', color: '#f4f4f4', fontWeight: 700, fontSize: 12 }}>
            <td style={TD} colSpan={2}>Net Balance Sheet Position</td>
            <td style={TD}>{totals.netPY.toFixed(1)}</td>
            <td style={TD}>{totals.netActual.toFixed(1)}</td>
            <td style={TD}>{totals.netBudget.toFixed(1)}</td>
            {(varMode === 'avb' || varMode === 'both') && (
              <td style={{ ...TD, color: totals.avb >= 0 ? '#42be65' : '#fa4d56' }}>
                {totals.avb >= 0 ? '+' : ''}{totals.avb.toFixed(1)}
              </td>
            )}
            {(varMode === 'avpy' || varMode === 'both') && (
              <td style={{ ...TD, color: totals.avpy >= 0 ? '#42be65' : '#fa4d56' }}>
                {totals.avpy >= 0 ? '+' : ''}{totals.avpy.toFixed(1)}
              </td>
            )}
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const TH = { padding: '8px 12px', textAlign: 'right', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }
const TD = { padding: '8px 12px', textAlign: 'right' }

// ─── Anomaly Intelligence tab ─────────────────────────────────────────────────

const RISK_TYPE_COUNTS = { 'High Risk': 2, 'Statistical': 3, 'Seasonal': 2, 'Benchmark': 4, 'YoY Trend': 5 }

function AnomalyTab() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Summary tiles */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        {Object.entries(RISK_TYPE_COUNTS).map(([type, count]) => (
          <div key={type} style={{
            flex: 1, background: '#fff', border: '1px solid #e0e0e0',
            borderTop: `2px solid ${type === 'High Risk' ? '#da1e28' : '#8d8d8d'}`,
            padding: '0.75rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: type === 'High Risk' ? '#da1e28' : '#161616', lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 10, color: '#525252', marginTop: 4 }}>{type}</div>
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
        const riskBorder = a.risk === 'high' ? '#da1e28' : a.risk === 'medium' ? '#c7922b' : '#24a148'
        return (
          <div key={a.id} style={{
            background: '#fff', border: '1px solid #e0e0e0',
            borderLeft: `3px solid ${riskBorder}`, marginBottom: 8,
          }}>
            <button
              onClick={() => setExpanded(isOpen ? null : a.id)}
              style={{
                width: '100%', background: 'none', border: 'none',
                padding: '0.75rem 1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left',
              }}
            >
              <code style={{ fontSize: 10, color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace', minWidth: 36 }}>{a.code}</code>
              <span style={{ fontWeight: 600, fontSize: 12, flex: 1 }}>{a.desc}</span>
              <span style={{ fontSize: 10, color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace' }}>{a.sigma}σ</span>
              <Tag type={a.risk === 'high' ? 'red' : a.risk === 'medium' ? 'warm-gray' : 'green'} size="sm">{a.type}</Tag>
              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 60, textAlign: 'right', color: a.impact < 0 ? '#da1e28' : '#24a148' }}>
                {a.impact >= 0 ? '+' : ''}{a.impact.toFixed(1)}M
              </span>
              <span style={{ fontSize: 10, color: '#8d8d8d' }}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e0e0e0', background: '#fafafa' }}>
                <p style={{ fontSize: 12, color: '#525252', lineHeight: 1.6, margin: 0 }}>{a.finding}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem' }}>
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
      <div style={{ marginTop: '1.5rem', background: '#fff', border: '1px solid #e0e0e0', padding: '1rem' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#161616', marginBottom: '0.75rem' }}>
          Risk Heat Strip — All Accounts
        </div>
        <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
          {BS_ACCOUNTS.map(acc => {
            const anomaly = ANOMALIES.find(a => a.code === acc.code)
            const bg = anomaly
              ? (anomaly.risk === 'high' ? '#da1e28' : anomaly.risk === 'medium' ? '#f1c21b' : '#42be65')
              : '#e0e0e0'
            return (
              <div key={acc.code} title={`${acc.desc}: ${anomaly ? anomaly.risk + ' risk · ' + anomaly.sigma + 'σ' : 'no anomaly'}`}
                style={{ flex: 1, height: 28, background: bg, borderRadius: 2, cursor: 'default' }}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {BS_ACCOUNTS.map(acc => (
            <div key={acc.code} style={{ flex: 1, fontSize: 8, color: '#8d8d8d', textAlign: 'center', overflow: 'hidden' }}>
              {acc.code}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: '0.5rem' }}>
          {[['#da1e28', 'High Risk'], ['#f1c21b', 'Medium'], ['#42be65', 'Low'], ['#e0e0e0', 'None']].map(([c, l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#525252' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
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
    [corrections]
  )
  const adjustedNet = totals.netActual + adjustedImpact
  const avbAdj = adjustedNet - totals.netBudget
  const corrected = Object.values(corrections).filter(v => v !== 0).length
  const confidence = Math.min(96, 72 + corrected * 4)

  useMemo(() => onImpactChange?.(adjustedImpact), [adjustedImpact])

  const handleReset = () => setCorrections({})

  return (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem 1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Sliders */}
      <div style={{ flex: 2 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#161616', marginBottom: '0.75rem' }}>
          Anomaly Correction Simulator
        </div>
        {ANOMALIES.map(a => {
          const val = corrections[a.id] || 0
          return (
            <div key={a.id} style={{
              background: '#fff', border: '1px solid #e0e0e0',
              borderLeft: `3px solid ${a.risk === 'high' ? '#da1e28' : a.risk === 'medium' ? '#c7922b' : '#24a148'}`,
              padding: '0.75rem 1rem', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <code style={{ fontSize: 10, color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace' }}>{a.code}</code>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{a.desc}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: val > 0 ? '#156082' : '#8d8d8d', minWidth: 36, textAlign: 'right' }}>{val}%</span>
              </div>
              <input
                type="range" min={0} max={100} step={10} value={val}
                onChange={e => setCorrections(prev => ({ ...prev, [a.id]: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: '#156082', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#8d8d8d', marginTop: 2 }}>
                <span>0% — no correction</span>
                <span style={{ fontWeight: val > 0 ? 600 : 400, color: val > 0 ? '#156082' : '#8d8d8d' }}>
                  Adj: {val > 0 ? `${a.impact >= 0 ? '+' : ''}${(a.impact * val / 100).toFixed(1)}M` : '—'}
                </span>
                <span>100% — full correction</span>
              </div>
            </div>
          )
        })}
        <Button kind="secondary" size="sm" onClick={handleReset} style={{ marginTop: 4 }}>Reset All Corrections</Button>
      </div>

      {/* Live metrics panel */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#161616', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          Impact on Key Metrics
          <span style={{ fontSize: 10, color: '#24a148' }}>● Live</span>
        </div>

        {[
          { label: 'Adjusted Net Position', value: `$${adjustedNet.toFixed(1)}M`, sub: adjustedImpact !== 0 ? `${adjustedImpact >= 0 ? '+' : ''}${adjustedImpact.toFixed(1)}M vs baseline` : 'No adjustment' },
          { label: 'Variance to Budget', value: `${avbAdj >= 0 ? '+' : '−'}$${Math.abs(avbAdj).toFixed(1)}M`, color: avbAdj >= 0 ? '#24a148' : '#da1e28' },
          { label: 'Anomalies Corrected', value: `${corrected} / ${ANOMALIES.length}`, sub: `${Math.round((corrected / ANOMALIES.length) * 100)}% resolved` },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '0.75rem', marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#8d8d8d', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: color || '#161616' }}>{value}</div>
            {sub && <div style={{ fontSize: 10, color: '#8d8d8d', marginTop: 2 }}>{sub}</div>}
          </div>
        ))}

        <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '0.75rem', marginTop: 8 }}>
          <div style={{ fontSize: 10, color: '#8d8d8d', marginBottom: 6 }}>Forecast Confidence</div>
          <ProgressBar value={confidence} max={100} label="" hideLabel size="sm" />
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{confidence}%</div>
          <div style={{ fontSize: 10, color: '#8d8d8d' }}>{confidence >= 90 ? 'High confidence' : confidence >= 80 ? 'Moderate' : 'Review recommended'}</div>
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
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('pending')
  const [sent, setSent] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 1800)
  }

  return (
    <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1.5rem', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Narrative */}
      <div style={{ flex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>AI-Generated Commentary</span>
          <span style={{ fontSize: 10, color: '#8d8d8d' }}>Oct 2024 · Balance Sheet Flux</span>
          <Button kind="ghost" size="sm" onClick={handleGenerate} disabled={generating} style={{ marginLeft: 'auto' }}>
            {generating ? 'Generating…' : '↻ Regenerate'}
          </Button>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          style={{
            width: '100%', height: 220, padding: '0.875rem',
            boxSizing: 'border-box', fontSize: 12, lineHeight: 1.7,
            color: '#161616', border: '1px solid #c6c6c6',
            fontFamily: 'IBM Plex Sans, sans-serif', resize: 'vertical', outline: 'none',
          }}
        />
        {generating && <ProgressBar value={null} label="" hideLabel size="sm" style={{ marginTop: 4 }} />}

        <div style={{ marginTop: '1rem', background: '#f4f4f4', border: '1px solid #e0e0e0', padding: '0.75rem' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Key Drivers Referenced
          </div>
          {[
            { code: '1500', text: 'Fixed Assets −$20.7M vs PY (16.6%)', risk: 'high' },
            { code: '1100', text: 'Trade Receivables −$11.1M vs PY', risk: 'high' },
            { code: '2100', text: 'Accrued Liabilities −$6.8M vs PY (seasonal)', risk: 'medium' },
            { code: '1010', text: 'Cash 3rd consecutive monthly decline', risk: 'low' },
          ].map(d => (
            <div key={d.code} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <code style={{ fontSize: 10, color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace', minWidth: 36 }}>{d.code}</code>
              <span style={{ fontSize: 11, color: '#525252', flex: 1 }}>{d.text}</span>
              <Tag type={d.risk === 'high' ? 'red' : d.risk === 'medium' ? 'warm-gray' : 'green'} size="sm">{d.risk}</Tag>
            </div>
          ))}
        </div>
      </div>

      {/* Assign workflow */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: '0.75rem' }}>Assign for Review</div>
        {sent ? (
          <InlineNotification kind="success" title="Assignment sent" subtitle="Commentary routed for Controller review." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Assign To">
              <select value={assignee} onChange={e => setAssignee(e.target.value)}
                style={SELECT_STYLE}>
                <option value="">— Select team member —</option>
                <option>S. Kim (Controller)</option>
                <option>K. Patel (GL Accountant)</option>
                <option>M. Chen (Audit & Compliance)</option>
                <option>T. Okafor (Treasury Analyst)</option>
              </select>
            </Field>
            <Field label="Due Date">
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                style={{ ...SELECT_STYLE, cursor: 'pointer' }} />
            </Field>
            <Field label="Status">
              <div style={{ display: 'flex', gap: 4 }}>
                {[['pending', '⏳ Pending'], ['submitted', '📩 Submitted'], ['approved', '✓ Approved']].map(([s, l]) => (
                  <button key={s} onClick={() => setStatus(s)} style={{
                    flex: 1, padding: '5px 4px', border: '1px solid',
                    borderColor: status === s ? '#156082' : '#c6c6c6',
                    background: status === s ? '#e5f6ff' : '#fff',
                    color: status === s ? '#156082' : '#525252',
                    fontSize: 10, cursor: 'pointer',
                  }}>{l}</button>
                ))}
              </div>
            </Field>
            <Field label="Note (optional)">
              <textarea placeholder="Add instructions for the reviewer…" style={{
                ...SELECT_STYLE, height: 72, resize: 'vertical', padding: '0.5rem',
              }} />
            </Field>
            <Button kind="primary" size="sm" disabled={!assignee} onClick={() => setSent(true)}>
              Send Assignment
            </Button>
            <Button kind="ghost" size="sm" onClick={() => {}}>
              Export as PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#525252', marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  )
}

const SELECT_STYLE = {
  width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #c6c6c6',
  fontSize: 12, fontFamily: 'IBM Plex Sans, sans-serif',
  background: '#fff', color: '#161616', outline: 'none', boxSizing: 'border-box',
}

// ─── Main workbench ───────────────────────────────────────────────────────────

export default function FluxAgentWorkbench({ onClose }) {
  const [period, setPeriod] = useState('Oct 2024')
  const [adjustedImpact, setAdjustedImpact] = useState(0)
  const totals = useMemo(() => calcTotals(BS_ACCOUNTS), [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      display: 'flex', flexDirection: 'column',
      background: '#f4f4f4',
    }}>
      <Header period={period} onPeriod={setPeriod} onClose={onClose} />
      <KPIStrip totals={totals} adjustedImpact={adjustedImpact} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs>
          <TabList aria-label="Flux analysis" contained>
            <Tab>Variance Analysis</Tab>
            <Tab>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Anomaly Intelligence
                <Tag type="red" size="sm" style={{ marginLeft: 4 }}>{ANOMALIES.length}</Tag>
              </span>
            </Tab>
            <Tab>What-If Simulator</Tab>
            <Tab>Commentary & Assign</Tab>
          </TabList>
          <TabPanels style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
              <VarianceTab />
            </TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
              <AnomalyTab />
            </TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
              <WhatIfTab totals={totals} onImpactChange={setAdjustedImpact} />
            </TabPanel>
            <TabPanel style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
              <CommentaryTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  )
}
