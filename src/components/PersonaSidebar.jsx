import { Users } from 'lucide-react'

export default function PersonaSidebar({ module, activePersona, onPersonaSelect }) {
  const wave1Personas = module.personas.filter(p => p.wave === 1)
  const futurePersonas = module.personas.filter(p => p.wave > 1)

  return (
    <aside className="w-48 flex-shrink-0 bg-white border-r border-brand-silver flex flex-col">
      <div className="p-3 border-b border-brand-silver">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-teal uppercase tracking-widest">
          <Users size={11} />
          Personas
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {wave1Personas.map(p => (
          <button
            key={p.id}
            onClick={() => onPersonaSelect(p.id)}
            className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] transition-all ${
              activePersona === p.id
                ? 'bg-brand-teal text-white font-semibold shadow-sm'
                : 'text-brand-ink hover:bg-brand-silver/40'
            }`}
          >
            {p.label}
          </button>
        ))}

        {futurePersonas.length > 0 && (
          <>
            <div className="px-2.5 pt-3 pb-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Future Waves
            </div>
            {futurePersonas.map(p => (
              <div
                key={p.id}
                className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] text-gray-400 flex items-center justify-between"
              >
                <span>{p.label}</span>
                <span className="text-[8px] px-1 py-0.5 rounded bg-gray-100 text-gray-400">
                  W{p.wave}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="p-3 border-t border-brand-silver">
        <div className="text-[9px] text-gray-400 text-center">
          {module.personas.filter(p => p.wave === 1).length} active ·{' '}
          {module.personas.length} total
        </div>
      </div>
    </aside>
  )
}
