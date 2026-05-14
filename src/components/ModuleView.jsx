import { useState } from 'react'
import ArchitectureMatrix from './ArchitectureMatrix'
import KpiPanel from './KpiPanel'
import PersonaSidebar from './PersonaSidebar'
import SkillsPanel from './SkillsPanel'
import ControllerWorkbench from './workbenches/ControllerWorkbench'

const WORKBENCH_MAP = {
  'Controller Workbench': 'controller',
  'Journal Advisor':      'controller',
  'Audit Agent':          'audit',
  'Treasurer Workbench':  'controller',
  'Capital Workbench':    'controller',
  'Journal Workbench':    'controller',
}

export default function ModuleView({ module }) {
  const [activePersona, setActivePersona] = useState(module.personas[0]?.id)
  const [openWorkbench, setOpenWorkbench] = useState(null)
  const isLive = module.wave === 1

  const handleWorkbenchClick = (name) => {
    const wb = WORKBENCH_MAP[name]
    if (wb) setOpenWorkbench(wb)
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Persona sidebar */}
      <PersonaSidebar
        module={module}
        activePersona={activePersona}
        onPersonaSelect={setActivePersona}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Module hero banner */}
        <div
          className="px-6 py-4 flex-shrink-0 border-b border-brand-silver"
          style={{ background: `linear-gradient(135deg, ${module.color}12, ${module.accentColor}08)` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-brand-ink flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: module.color }}
                />
                Intelligent {module.label} Process — {module.fullName}
              </h1>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isLive
                  ? `Wave ${module.wave} · Live Demo · ${module.tagline}`
                  : `Wave ${module.wave} · Roadmap · ${module.tagline}`}
              </p>
            </div>
            {!isLive && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  Wave {module.wave} · Coming Soon
                </span>
                <span className="text-[10px] text-gray-400">
                  Weeks {(module.wave - 1) * 12 + 1}–{module.wave * 12}
                </span>
              </div>
            )}
            {isLive && (
              <button
                onClick={() => setOpenWorkbench('controller')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[11px] font-bold shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: module.color }}
              >
                ⬡ Open Controller Workbench
              </button>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 flex gap-5">
            {/* Architecture matrix + skills */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-brand-silver shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-brand-silver flex items-center justify-between">
                  <div className="text-[11px] font-bold text-brand-ink uppercase tracking-wide">
                    Reference Architecture — {module.fullName}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Shift to Continuous Accounting from Periodic Book Close
                  </div>
                </div>
                <div className="p-3">
                  <ArchitectureMatrix
                    module={module}
                    onWorkbenchClick={handleWorkbenchClick}
                  />
                </div>
              </div>
              <SkillsPanel module={module} />
            </div>

            {/* KPI panel */}
            <div className="w-56 flex-shrink-0">
              <KpiPanel kpis={module.kpis} />
            </div>
          </div>
        </div>
      </div>

      {/* Workbench overlay */}
      {openWorkbench === 'controller' && module.wave === 1 && (
        <ControllerWorkbench onClose={() => setOpenWorkbench(null)} />
      )}
      {openWorkbench === 'controller' && module.wave > 1 && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center slide-in">
            <div className="w-16 h-16 rounded-full bg-brand-silver flex items-center justify-center mx-auto mb-4 text-2xl">⬡</div>
            <h2 className="text-lg font-bold text-brand-ink mb-2">
              {module.label} Workbench
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Available in Wave {module.wave} · Weeks {(module.wave - 1) * 12 + 1}–{module.wave * 12}
            </p>
            <button
              onClick={() => setOpenWorkbench(null)}
              className="px-6 py-2 rounded-lg bg-brand-teal text-white text-sm font-semibold hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
