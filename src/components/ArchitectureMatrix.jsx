import { useState } from 'react'

const LAYER_COLORS = {
  compliance:    { bg: '#EEF6FF', border: '#156082', text: '#156082' },
  analysis:      { bg: '#F0FBF0', border: '#196B24', text: '#196B24' },
  orchestration: { bg: '#FFF7F0', border: '#E97132', text: '#E97132' },
  action:        { bg: '#F5EFFF', border: '#A02B93', text: '#A02B93' },
  integration:   { bg: '#F0F9FF', border: '#0F9ED5', text: '#0F9ED5' },
}

const AGENT_COLORS = {
  'Journal Agent':         '#156082',
  'Reconciliation Agent':  '#196B24',
  'Close Agent':           '#E97132',
  'Control Agent':         '#A02B93',
  'Interco Agent':         '#0961FD',
  'Cash Agent':            '#4EA72E',
  'Asset Agent':           '#0E2841',
  'Reporting Agent':       '#156082',
  'Monitor Agent':         '#E97132',
  'Orchestration Agent':   '#C1C7CD',
  'Extraction/Data Agent': '#8B9CB0',
  'Flux Agent':            '#0F9ED5',
  'Contract Agent':        '#A02B93',
  'Forecasting Agent':     '#196B24',
  'Performance Agent':     '#E97132',
}

function AgentChip({ name, isWorkbench, onClick }) {
  const color = AGENT_COLORS[name] || '#156082'
  if (isWorkbench) {
    return (
      <button
        onClick={() => onClick && onClick(name)}
        className="slide-in inline-flex items-center gap-1 px-2 py-0.5 rounded text-white text-[10px] font-semibold shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
        style={{ background: color, border: `1.5px solid ${color}` }}
        title={`Open ${name}`}
      >
        <span className="text-[8px]">⬡</span>
        {name}
      </button>
    )
  }
  return (
    <span
      className="slide-in inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}
    >
      {name}
    </span>
  )
}

function Cell({ cell, onWorkbenchClick }) {
  if (!cell) return <td className="border border-brand-silver bg-white/40 p-1" />
  return (
    <td className="border border-brand-silver bg-white/60 p-1.5 align-top">
      <div className="flex flex-col gap-1">
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
  const [hoveredArea, setHoveredArea] = useState(null)

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse w-full text-xs" style={{ minWidth: 900 }}>
        <thead>
          {/* Process Area header row */}
          <tr>
            <th className="w-24 border border-brand-silver bg-brand-navy text-white text-[10px] font-semibold p-2 text-center">
              <div>L3</div>
            </th>
            {module.processAreas.map(area => (
              <th
                key={area.id}
                className="border border-brand-silver text-white text-[10px] font-semibold p-2 text-center cursor-pointer transition-opacity"
                style={{ background: area.color, opacity: hoveredArea && hoveredArea !== area.id ? 0.75 : 1 }}
                onMouseEnter={() => setHoveredArea(area.id)}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <div className="font-bold">{area.label}</div>
                <div className="font-normal opacity-80 mt-0.5">{area.sub}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {module.layers.map(layer => {
            const lc = LAYER_COLORS[layer.id] || LAYER_COLORS.integration
            return (
              <tr key={layer.id}>
                <td
                  className="border border-brand-silver text-center font-semibold text-[10px] p-2 w-24"
                  style={{ background: lc.bg, color: lc.text, borderLeft: `3px solid ${lc.border}` }}
                >
                  {layer.label}
                </td>
                {module.processAreas.map(area => (
                  <Cell
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
    </div>
  )
}
