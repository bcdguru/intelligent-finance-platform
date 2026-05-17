import { useState, useMemo } from 'react'
import {
  PROC_PHASES, PROC_PHASE_ORDER, PROC_LAYERS, PROC_LENS_ORDER, PROC_LENSES,
  buildProcNodeMap, getProcCellAppearance, getProcCellText,
  MATURITY_COLORS, PROC_SYSTEM_COLORS, RISK_COLORS, DATA_COLORS, SIGMA_COLORS, CFO_COLORS,
  PROC_BENCHMARKS,
} from '../data/procAtlas'
import APProcessingWorkbench from './workbenches/APProcessingWorkbench'

const LAYER_ORDER = ['compliance', 'analysis', 'orchestration', 'action', 'integration']
const LAYER_ABBREV = {
  compliance:    'Compliance',
  analysis:      'Analysis',
  orchestration: 'Orchestration',
  action:        'Action',
  integration:   'Integration',
}

const LENS_LEGEND = {
  cpo:   null,
  coo:   MATURITY_COLORS,
  cio:   PROC_SYSTEM_COLORS,
  ciso:  RISK_COLORS,
  cfo:   CFO_COLORS,
  sigma: SIGMA_COLORS,
}

// ─── Lens bar ─────────────────────────────────────────────────────────────────
function LensBar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '0.5rem 1rem',
      background: '#fff', borderBottom: '1px solid #e0e0e0',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8 }}>
        Lens
      </span>
      {PROC_LENS_ORDER.map(id => {
        const lens = PROC_LENSES[id]
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              padding: '4px 14px',
              border: '1px solid',
              borderColor: isActive ? '#161616' : '#c6c6c6',
              borderRadius: 2,
              background: isActive ? '#161616' : 'transparent',
              color: isActive ? '#ffffff' : '#525252',
              fontSize: 12, fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {lens.label}
          </button>
        )
      })}
      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8d8d8d' }}>
        {PROC_LENSES[active].description}
      </span>
    </div>
  )
}

// ─── Legend ──────────────────────────────────────────────────────────────────
function Legend({ lens }) {
  const entries = LENS_LEGEND[lens]
  if (!entries) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legend:</span>
      {Object.entries(entries).map(([key, val]) => (
        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: val.bg, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: '#525252' }}>{val.label || key}</span>
        </span>
      ))}
    </div>
  )
}

// ─── Single procurement matrix (6 phases × 5 layers) ─────────────────────────
function ProcMatrix({ nodeMap, lens, selectedKey, onSelect }) {
  const CELL_H   = 52
  const HEADER_H = 56
  const LABEL_W  = 100

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
      {/* Phase column headers */}
      <div style={{ display: 'flex', marginLeft: LABEL_W }}>
        {PROC_PHASES.map(phase => (
          <div key={phase.id} style={{
            flex: 1, height: HEADER_H,
            background: phase.color,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
            padding: '4px 6px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.25, letterSpacing: '0.02em' }}>
              {phase.label}
            </span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 2, lineHeight: 1.2 }}>
              {phase.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Layer rows */}
      {LAYER_ORDER.map(layerId => (
        <div key={layerId} style={{ display: 'flex', borderTop: '1px solid #e0e0e0' }}>
          {/* Layer label */}
          <div style={{
            width: LABEL_W, flexShrink: 0,
            height: CELL_H,
            display: 'flex', alignItems: 'center',
            padding: '0 10px',
            borderRight: '1px solid #e0e0e0',
            background: '#f4f4f4',
          }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {LAYER_ABBREV[layerId]}
            </span>
          </div>

          {/* Phase cells */}
          {PROC_PHASES.map(phase => {
            const key     = `${phase.id}|${layerId}`
            const node    = nodeMap[key]
            const { bg, fg, border } = getProcCellAppearance(node, lens)
            const text    = getProcCellText(node, lens)
            const isSelected   = selectedKey === key
            const hasWorkbench = node?.workbench

            return (
              <div
                key={phase.id}
                onClick={() => onSelect(key, node)}
                title={node ? `${node.nodeId}\n${node.agents.join(', ')}` : ''}
                style={{
                  flex: 1, height: CELL_H,
                  background: isSelected ? '#161616' : bg,
                  borderLeft: '1px solid rgba(0,0,0,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative',
                  transition: 'filter 0.1s',
                  outline: border && !isSelected ? `1px solid ${border}` : 'none',
                  outlineOffset: -1,
                }}
              >
                {/* Workbench indicator dot */}
                {hasWorkbench && (
                  <span style={{
                    position: 'absolute', top: 3, right: 3,
                    width: 5, height: 5, borderRadius: '50%',
                    background: isSelected ? '#42be65' : (fg || '#fff'),
                    opacity: 0.9,
                  }} />
                )}
                {/* Agent count badge (CPO lens only) */}
                {lens === 'cpo' && node?.agents?.length > 0 && !isSelected && (
                  <span style={{
                    position: 'absolute', top: 3, left: 4,
                    fontSize: 8, fontWeight: 700,
                    color: fg,
                    opacity: 0.7,
                  }}>
                    {node.agents.length}A
                  </span>
                )}
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: isSelected ? '#fff' : fg,
                  textAlign: 'center', lineHeight: 1.2,
                  padding: '0 4px',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  maxWidth: '100%',
                }}>
                  {isSelected ? '●' : text}
                </span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── Node detail panel (bottom bar) ──────────────────────────────────────────
function NodeDetail({ node, onClose, onWorkbench }) {
  if (!node) return null
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#161616', color: '#f4f4f4',
      borderTop: '2px solid ' + node.phaseColor,
      padding: '0.75rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '2rem',
      zIndex: 500, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 220 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: node.phaseColor, flexShrink: 0 }} />
        <code style={{ fontSize: 11, color: '#78a9ff', fontFamily: 'IBM Plex Mono, monospace' }}>
          {node.nodeId}
        </code>
        <button onClick={onClose} style={{
          marginLeft: 4, background: 'none', border: 'none',
          color: '#8d8d8d', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0,
        }}>×</button>
      </div>

      <DetailItem label="Phase"   value={node.phaseLabel} />
      <DetailItem label="Layer"   value={node.layerLabel} />
      <DetailItem label="Agents"  value={node.agents.join(', ') || '—'} />
      {node.workbench && (
        <div>
          <div style={{ fontSize: 9, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Workbench</div>
          <button
            onClick={() => onWorkbench(node.workbench)}
            style={{
              fontSize: 12, fontWeight: 600, color: '#42be65',
              background: 'none', border: '1px solid #42be65',
              padding: '2px 10px', borderRadius: 3, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ⬡ {node.workbench}
          </button>
        </div>
      )}
      <DetailItem label="System"   value={node.system}   />
      <DetailItem label="Maturity" value={node.maturity} />
      <DetailItem label="Risk"     value={node.risk}     />
      <DetailItem label="CFO"      value={node.cfoImpact}/>
      <DetailItem label="Quality"  value={`${node.sigma}σ`} />
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#f4f4f4' }}>{value}</div>
    </div>
  )
}

// ─── Search bar ───────────────────────────────────────────────────────────────
function SearchBar({ query, onChange, results }) {
  return (
    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
      <input
        placeholder="Search nodes, agents, systems… (e.g. Coupa, 2σ, Critical, Fraud Detection)"
        value={query}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '0.5rem 1rem',
          border: '1px solid #c6c6c6',
          background: '#fff', fontSize: 12, color: '#161616',
          outline: 'none', borderRadius: 0,
          fontFamily: 'inherit',
        }}
      />
      {query && (
        <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#8d8d8d' }}>
          {results} nodes matched
        </span>
      )}
    </div>
  )
}

// ─── Benchmark panel ─────────────────────────────────────────────────────────
function BenchmarkPanel() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e0e0e0',
      padding: '0.875rem 1rem', marginTop: '1rem',
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
        Hackett Group Benchmarks · World Class vs Median
      </div>
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(PROC_BENCHMARKS).map(([key, b]) => (
          <div key={key} style={{ minWidth: 120 }}>
            <div style={{ fontSize: 10, color: '#8d8d8d', marginBottom: 3 }}>{b.label}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>{b.worldClass}</span>
              <span style={{ fontSize: 11, color: '#8d8d8d' }}>vs</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#ea580c' }}>{b.median}</span>
            </div>
            <div style={{ fontSize: 9, color: '#a0a0a0', marginTop: 1, display: 'flex', gap: 8 }}>
              <span style={{ color: '#16a34a' }}>● World Class</span>
              <span style={{ color: '#ea580c' }}>● Median</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Summary distribution ─────────────────────────────────────────────────────
function AtlasSummary({ nodeMap, lens }) {
  const counts = useMemo(() => {
    const c = {}
    Object.values(nodeMap).forEach(n => {
      if (!n) return
      let key
      switch (lens) {
        case 'cpo':   key = n.phaseLabel; break
        case 'coo':   key = n.maturity;   break
        case 'cio':   key = n.system;     break
        case 'ciso':  key = n.risk;       break
        case 'cfo':   key = n.cfoImpact;  break
        case 'sigma': key = `${n.sigma}σ`; break
        default:      key = 'Unknown'
      }
      c[key] = (c[key] || 0) + 1
    })
    return Object.entries(c).sort((a, b) => b[1] - a[1])
  }, [nodeMap, lens])

  const total = Object.values(nodeMap).filter(Boolean).length

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
        Distribution · {PROC_LENSES[lens].description}
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {counts.map(([key, count]) => (
          <div key={key} style={{ minWidth: 80 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#161616' }}>{count}</span>
              <span style={{ fontSize: 10, color: '#8d8d8d' }}>/ {total}</span>
            </div>
            <div style={{ height: 4, background: '#e0e0e0', borderRadius: 2, marginBottom: 2 }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${(count / total) * 100}%`, background: '#161616' }} />
            </div>
            <span style={{ fontSize: 10, color: '#525252' }}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main viewer ──────────────────────────────────────────────────────────────
export default function ProcurementAtlasViewer() {
  const [activeLens,    setActiveLens]    = useState('coo')
  const [selectedKey,   setSelectedKey]   = useState(null)
  const [selectedNode,  setSelectedNode]  = useState(null)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [openWorkbench, setOpenWorkbench] = useState(null)

  const nodeMap = useMemo(() => buildProcNodeMap(), [])

  const matchedKeys = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase()
    return new Set(
      Object.entries(nodeMap)
        .filter(([, n]) =>
          n.nodeId.toLowerCase().includes(q) ||
          n.agents.some(a => a.toLowerCase().includes(q)) ||
          n.system.toLowerCase().includes(q) ||
          n.maturity.toLowerCase().includes(q) ||
          n.risk.toLowerCase().includes(q) ||
          n.phaseLabel.toLowerCase().includes(q) ||
          String(n.sigma).includes(q)
        )
        .map(([k]) => k)
    )
  }, [nodeMap, searchQuery])

  const matchCount = matchedKeys ? matchedKeys.size : null

  const handleSelect = (key, node) => {
    if (selectedKey === key) {
      setSelectedKey(null); setSelectedNode(null)
    } else {
      setSelectedKey(key); setSelectedNode(node)
    }
  }

  const effectiveNodeMap = useMemo(() => {
    if (!matchedKeys) return nodeMap
    const filtered = {}
    Object.entries(nodeMap).forEach(([k, v]) => {
      filtered[k] = matchedKeys.has(k) ? v : null
    })
    return filtered
  }, [nodeMap, matchedKeys])

  const handleWorkbench = (name) => {
    if (name === 'AP Processing Workbench') setOpenWorkbench('ap')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#f4f4f4' }}>
      <LensBar active={activeLens} onChange={setActiveLens} />

      <div style={{
        flex: 1,
        overflowY: 'auto', overflowX: 'auto',
        padding: '1rem 1.5rem',
        paddingBottom: selectedNode ? '6rem' : '1rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#161616' }}>Procurement Agent Atlas</span>
            <span style={{ fontSize: 11, color: '#8d8d8d', marginLeft: 8 }}>
              {Object.keys(nodeMap).length} process nodes · 6 phases · 5 layers
            </span>
            <span style={{
              marginLeft: 10, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
              background: 'rgba(21,97,192,0.1)', color: '#1565C0',
              border: '1px solid rgba(21,97,192,0.25)',
            }}>
              Source-to-Pay Intelligence
            </span>
          </div>
          <span style={{ fontSize: 10, color: '#8d8d8d' }}>
            Click any cell to inspect · Green dot = workbench available
          </span>
        </div>

        <SearchBar
          query={searchQuery}
          onChange={setSearchQuery}
          results={matchCount ?? Object.keys(nodeMap).length}
        />

        <Legend lens={activeLens} />

        {/* Procurement matrix */}
        <div style={{ minWidth: 900 }}>
          <ProcMatrix
            nodeMap={effectiveNodeMap}
            lens={activeLens}
            selectedKey={selectedKey}
            onSelect={handleSelect}
          />
        </div>

        {/* Phase pipeline strip */}
        <div style={{
          display: 'flex', alignItems: 'center', marginTop: '0.75rem',
          background: '#fff', border: '1px solid #e0e0e0', padding: '0.5rem 0',
        }}>
          {PROC_PHASES.map((phase, i) => (
            <div key={phase.id} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{
                flex: 1, textAlign: 'center',
                padding: '4px 8px',
                borderLeft: i > 0 ? '1px solid #e0e0e0' : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: phase.color, margin: '0 auto 3px',
                }} />
                <div style={{ fontSize: 9, fontWeight: 600, color: phase.color }}>{phase.label}</div>
                <div style={{ fontSize: 8, color: '#8d8d8d', marginTop: 1 }}>Phase {i + 1}</div>
              </div>
              {i < PROC_PHASES.length - 1 && (
                <span style={{ color: '#c6c6c6', fontSize: 10, flexShrink: 0 }}>›</span>
              )}
            </div>
          ))}
        </div>

        <AtlasSummary nodeMap={effectiveNodeMap} lens={activeLens} />
        <BenchmarkPanel />
      </div>

      <NodeDetail
        node={selectedNode}
        onClose={() => { setSelectedKey(null); setSelectedNode(null) }}
        onWorkbench={handleWorkbench}
      />

      {/* AP Processing Workbench overlay */}
      {openWorkbench === 'ap' && (
        <APProcessingWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
    </div>
  )
}
