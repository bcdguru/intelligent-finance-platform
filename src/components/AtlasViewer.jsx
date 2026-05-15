import { useState, useMemo } from 'react'
import { MODULES, MODULE_ORDER } from '../data/modules'
import {
  buildNodeMap, LENSES, LENS_ORDER,
  getCellAppearance, getCellText,
  MATURITY_COLORS, SYSTEM_COLORS, RISK_COLORS, DATA_COLORS, SIGMA_COLORS,
} from '../data/atlas'

const LAYER_ORDER = ['compliance', 'analysis', 'orchestration', 'action', 'integration']
const LAYER_ABBREV = {
  compliance:    'Compliance',
  analysis:      'Analysis',
  orchestration: 'Orchestration',
  action:        'Action',
  integration:   'Integration',
}

const LENS_LEGEND = {
  finance: null,
  coo:     MATURITY_COLORS,
  cio:     SYSTEM_COLORS,
  ciso:    RISK_COLORS,
  cdo:     DATA_COLORS,
  sigma:   SIGMA_COLORS,
}

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
      {LENS_ORDER.map(id => {
        const lens = LENSES[id]
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
        {LENSES[active].description}
      </span>
    </div>
  )
}

function Legend({ lens }) {
  const entries = LENS_LEGEND[lens]
  if (!entries) return null

  const items = Object.entries(entries)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legend:</span>
      {items.map(([key, val]) => (
        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: val.bg, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: '#525252' }}>{val.label || key}</span>
        </span>
      ))}
    </div>
  )
}

function ModuleZone({ module, nodeMap, lens, selectedKey, onSelect }) {
  const CELL_H = 34
  const AREA_HEADER_H = 48
  const MODULE_HEADER_H = 28
  const LABEL_W = 90

  const areaAbbrevs = module.processAreas.map(a => {
    const words = a.label.split(' ')
    return words.length > 1 ? words.map(w => w[0]).join('') : a.label.substring(0, 4)
  })

  return (
    <div style={{
      flex: 1,
      minWidth: 280,
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
    }}>
      {/* Module header */}
      <div style={{
        height: MODULE_HEADER_H,
        background: module.color,
        display: 'flex', alignItems: 'center',
        padding: '0 0.75rem', gap: 6,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {module.label}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
          · {module.fullName}
        </span>
        {module.wave === 1 && (
          <span style={{
            marginLeft: 'auto', fontSize: 9, fontWeight: 700,
            padding: '1px 6px', borderRadius: 8,
            background: 'rgba(255,255,255,0.2)', color: '#fff',
          }}>LIVE</span>
        )}
      </div>

      {/* Process area headers */}
      <div style={{ display: 'flex', marginLeft: LABEL_W }}>
        {module.processAreas.map((area, i) => (
          <div key={area.id} style={{
            flex: 1,
            height: AREA_HEADER_H,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderLeft: i > 0 ? '1px solid #e0e0e0' : 'none',
            borderBottom: '1px solid #e0e0e0',
            padding: '2px',
            background: '#f9f9f9',
          }}>
            <span style={{
              fontSize: 9, fontWeight: 600, color: '#525252',
              textAlign: 'center', lineHeight: 1.2,
              writingMode: 'vertical-lr', transform: 'rotate(180deg)',
            }}>
              {area.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {LAYER_ORDER.map((layerId, layerIdx) => (
        <div key={layerId} style={{ display: 'flex', borderTop: '1px solid #e0e0e0' }}>
          {/* Layer label */}
          <div style={{
            width: LABEL_W, flexShrink: 0,
            height: CELL_H,
            display: 'flex', alignItems: 'center',
            padding: '0 8px',
            borderRight: '1px solid #e0e0e0',
            background: '#f4f4f4',
          }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {LAYER_ABBREV[layerId]}
            </span>
          </div>

          {/* Cells */}
          {module.processAreas.map((area, i) => {
            const key = `${module.id}|${area.id}|${layerId}`
            const node = nodeMap[key]
            const { bg, fg, border } = getCellAppearance(node, lens)
            const text = getCellText(node, lens)
            const isSelected = selectedKey === key
            const hasWorkbench = node?.workbench

            return (
              <div
                key={area.id}
                onClick={() => onSelect(key, node)}
                style={{
                  flex: 1,
                  height: CELL_H,
                  background: isSelected ? '#161616' : bg,
                  borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'opacity 0.1s',
                  outline: border && !isSelected ? `1px solid ${border}` : 'none',
                  outlineOffset: -1,
                }}
                title={node ? `${node.nodeId}\n${node.agents.join(', ')}` : ''}
              >
                {hasWorkbench && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2,
                    width: 4, height: 4, borderRadius: '50%',
                    background: isSelected ? '#fff' : (fg || '#fff'),
                    opacity: 0.7,
                  }} />
                )}
                <span style={{
                  fontSize: 8, fontWeight: 700,
                  color: isSelected ? '#fff' : fg,
                  textAlign: 'center', lineHeight: 1.1,
                  padding: '0 2px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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

function NodeDetail({ node, onClose }) {
  if (!node) return null
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#161616', color: '#f4f4f4',
      borderTop: '2px solid ' + node.moduleColor,
      padding: '0.75rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '2rem',
      zIndex: 500, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: node.moduleColor, flexShrink: 0,
        }} />
        <code style={{ fontSize: 11, color: '#78a9ff', fontFamily: 'IBM Plex Mono, monospace' }}>
          {node.nodeId}
        </code>
        <button onClick={onClose} style={{
          marginLeft: 8, background: 'none', border: 'none',
          color: '#8d8d8d', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0,
        }}>×</button>
      </div>

      <Detail label="Module" value={`${node.moduleLabel} · ${node.areaLabel}`} />
      <Detail label="Layer" value={node.layerLabel} />
      <Detail label="Agent(s)" value={node.agents.join(', ') || '—'} />
      {node.workbench && <Detail label="Workbench" value={node.workbench} highlight />}
      <Detail label="System" value={node.system} />
      <Detail label="Maturity" value={node.maturity} />
      <Detail label="Risk" value={node.risk} />
      <Detail label="Data" value={node.data} />
      <Detail label="Quality" value={`${node.sigma}σ`} />
    </div>
  )
}

function Detail({ label, value, highlight }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, fontWeight: highlight ? 600 : 400, color: highlight ? '#42be65' : '#f4f4f4' }}>
        {value}
      </div>
    </div>
  )
}

function SearchBar({ query, onChange, results }) {
  return (
    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
      <input
        placeholder="Search process nodes, agents, systems… (e.g. BlackLine, 2σ, Critical)"
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
        <span style={{
          position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
          fontSize: 11, color: '#8d8d8d',
        }}>
          {results} nodes matched
        </span>
      )}
    </div>
  )
}

export default function AtlasViewer() {
  const [activeLens, setActiveLens] = useState('coo')
  const [selectedKey, setSelectedKey] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const nodeMap = useMemo(() => buildNodeMap(), [])

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
          n.data.toLowerCase().includes(q) ||
          String(n.sigma).includes(q)
        )
        .map(([k]) => k)
    )
  }, [nodeMap, searchQuery])

  const matchCount = matchedKeys ? matchedKeys.size : null

  const handleSelect = (key, node) => {
    if (selectedKey === key) {
      setSelectedKey(null)
      setSelectedNode(null)
    } else {
      setSelectedKey(key)
      setSelectedNode(node)
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#f4f4f4' }}>
      <LensBar active={activeLens} onChange={setActiveLens} />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'auto',
        padding: '1rem 1.5rem',
        paddingBottom: selectedNode ? '6rem' : '1rem',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#161616' }}>Finance Atlas</span>
            <span style={{ fontSize: 11, color: '#8d8d8d', marginLeft: 8 }}>
              {Object.keys(nodeMap).length} process nodes · 4 modules · 5 layers
            </span>
          </div>
          <span style={{ fontSize: 10, color: '#8d8d8d' }}>
            Click any cell to inspect · Dot = workbench available
          </span>
        </div>

        <SearchBar
          query={searchQuery}
          onChange={setSearchQuery}
          results={matchCount ?? Object.keys(nodeMap).length}
        />

        <Legend lens={activeLens} />

        {/* Module grid */}
        <div style={{ display: 'flex', gap: '0.5rem', minWidth: 1000 }}>
          {MODULE_ORDER.map(moduleId => (
            <ModuleZone
              key={moduleId}
              module={MODULES[moduleId]}
              nodeMap={effectiveNodeMap}
              lens={activeLens}
              selectedKey={selectedKey}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Summary counts by lens value */}
        <AtlasSummary nodeMap={nodeMap} lens={activeLens} />
      </div>

      <NodeDetail node={selectedNode} onClose={() => { setSelectedKey(null); setSelectedNode(null) }} />
    </div>
  )
}

function AtlasSummary({ nodeMap, lens }) {
  const counts = useMemo(() => {
    const c = {}
    Object.values(nodeMap).forEach(n => {
      let key
      switch (lens) {
        case 'finance': key = n.moduleLabel; break
        case 'coo':     key = n.maturity;    break
        case 'cio':     key = n.system;      break
        case 'ciso':    key = n.risk;        break
        case 'cdo':     key = n.data;        break
        case 'sigma':   key = `${n.sigma}σ`; break
        default: key = 'Unknown'
      }
      c[key] = (c[key] || 0) + 1
    })
    return Object.entries(c).sort((a, b) => b[1] - a[1])
  }, [nodeMap, lens])

  const total = Object.keys(nodeMap).length

  return (
    <div style={{
      marginTop: '1rem',
      background: '#fff',
      border: '1px solid #e0e0e0',
      padding: '0.75rem 1rem',
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
        Distribution · {LENSES[lens].description}
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {counts.map(([key, count]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 80 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#161616' }}>{count}</span>
              <span style={{ fontSize: 10, color: '#8d8d8d' }}>/ {total}</span>
            </div>
            <div style={{
              height: 4, background: '#e0e0e0', borderRadius: 2, width: '100%',
            }}>
              <div style={{
                height: '100%', borderRadius: 2, width: `${(count / total) * 100}%`,
                background: '#161616',
              }} />
            </div>
            <span style={{ fontSize: 10, color: '#525252' }}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
