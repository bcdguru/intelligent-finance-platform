import { useState } from 'react'

const LAYER_META = {
  compliance:    { label: 'Compliance',    bg: '#e5f6ff', accent: '#0072c3', text: '#0072c3' },
  analysis:      { label: 'Analysis',      bg: '#defbe6', accent: '#24a148', text: '#0e6027' },
  orchestration: { label: 'Orchestration', bg: '#fff8e1', accent: '#f1c21b', text: '#7a4f00' },
  action:        { label: 'Action',        bg: '#ffd6e8', accent: '#d12771', text: '#9f1853' },
  integration:   { label: 'Integration',   bg: '#f4f4f4', accent: '#8d8d8d', text: '#525252' },
}

const AGENT_META = {
  'Journal Agent':         { bg: '#e5f6ff', color: '#0072c3' },
  'Reconciliation Agent':  { bg: '#defbe6', color: '#24a148' },
  'Close Agent':           { bg: '#fff8e1', color: '#7a4f00' },
  'Control Agent':         { bg: '#ffd6e8', color: '#9f1853' },
  'Interco Agent':         { bg: '#e8daff', color: '#6929c4' },
  'Cash Agent':            { bg: '#defbe6', color: '#0e6027' },
  'Asset Agent':           { bg: '#f4f4f4', color: '#393939' },
  'Reporting Agent':       { bg: '#e5f6ff', color: '#0072c3' },
  'Monitor Agent':         { bg: '#fff8e1', color: '#7a4f00' },
  'Orchestration Agent':   { bg: '#f4f4f4', color: '#6f6f6f' },
  'Extraction/Data Agent': { bg: '#f4f4f4', color: '#8d8d8d' },
  'Flux Agent':            { bg: '#e5f6ff', color: '#0072c3' },
  'Contract Agent':        { bg: '#e8daff', color: '#6929c4' },
  'Forecasting Agent':     { bg: '#defbe6', color: '#0e6027' },
  'Performance Agent':     { bg: '#fff8e1', color: '#7a4f00' },
  'Journal Scheduler':     { bg: '#e5f6ff', color: '#0072c3' },
  'Capital Spend Agent':   { bg: '#f4f4f4', color: '#393939' },
  'Project & Asset Master Agent': { bg: '#defbe6', color: '#0e6027' },
}

function AgentChip({ name, isWorkbench, onClick }) {
  const meta = AGENT_META[name] || { bg: '#e5f6ff', color: '#0072c3' }
  if (isWorkbench) {
    return (
      <button
        onClick={() => onClick?.(name)}
        title={`Open ${name}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 7px', borderRadius: 2,
          fontSize: 10, fontWeight: 600, fontFamily: 'IBM Plex Sans, sans-serif',
          background: meta.color, color: '#fff',
          border: 'none', cursor: 'pointer',
          marginBottom: 3, lineHeight: '18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        ⬡ {name}
      </button>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '1px 6px', borderRadius: 2,
      fontSize: 10, fontWeight: 500, fontFamily: 'IBM Plex Sans, sans-serif',
      background: meta.bg, color: meta.color,
      border: `1px solid ${meta.color}30`,
      marginBottom: 2, lineHeight: '16px',
    }}>
      {name}
    </span>
  )
}

function MatrixCell({ cell, onWorkbenchClick }) {
  if (!cell) {
    return <td style={{ border: '1px solid #e0e0e0', background: '#fafafa', width: 130 }} />
  }
  return (
    <td style={{
      border: '1px solid #e0e0e0',
      background: '#ffffff',
      padding: '6px 8px',
      verticalAlign: 'top',
      width: 130,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cell.agents.map(a => (
          <AgentChip key={a} name={a} isWorkbench={false} />
        ))}
        {cell.workbench && (
          <AgentChip name={cell.workbench} isWorkbench onClick={onWorkbenchClick} />
        )}
      </div>
    </td>
  )
}

export default function ArchitectureMatrix({ module, onWorkbenchClick }) {
  const [hoveredCol, setHoveredCol] = useState(null)

  return (
    <table style={{
      borderCollapse: 'collapse',
      width: '100%',
      minWidth: 820,
      fontSize: 11,
      fontFamily: 'IBM Plex Sans, sans-serif',
    }}>
      <thead>
        <tr>
          <th style={{
            width: 80, background: '#161616', color: '#f4f4f4',
            border: '1px solid #393939', padding: '6px 8px',
            fontSize: 10, fontWeight: 600, textAlign: 'center',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Layer
          </th>
          {module.processAreas.map(area => (
            <th
              key={area.id}
              style={{
                background: hoveredCol === area.id ? area.color : area.color + 'cc',
                color: '#fff',
                border: '1px solid ' + area.color,
                padding: '6px 8px',
                fontSize: 10, fontWeight: 600,
                textAlign: 'center',
                cursor: 'default',
                transition: 'background 0.15s',
                width: 130,
              }}
              onMouseEnter={() => setHoveredCol(area.id)}
              onMouseLeave={() => setHoveredCol(null)}
            >
              <div style={{ fontWeight: 700 }}>{area.label}</div>
              <div style={{ fontWeight: 400, opacity: 0.85, marginTop: 2, fontSize: 9 }}>{area.sub}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {module.layers.map(layer => {
          const lm = LAYER_META[layer.id] || LAYER_META.integration
          return (
            <tr key={layer.id}>
              <td style={{
                background: lm.bg,
                color: lm.text,
                border: '1px solid #e0e0e0',
                borderLeft: `3px solid ${lm.accent}`,
                padding: '6px 8px',
                fontWeight: 600,
                fontSize: 10,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {lm.label}
              </td>
              {module.processAreas.map(area => (
                <MatrixCell
                  key={area.id}
                  cell={layer.cells[area.id]}
                  onWorkbenchClick={onWorkbenchClick}
                />
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
