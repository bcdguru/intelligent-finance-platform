import { MODULE_ORDER, MODULES } from '../data/modules'

const WAVE_LABELS = { 1: 'Wave 1', 2: 'Wave 2', 3: 'Wave 3', 4: 'Wave 4', 5: 'Wave 5' }

export default function TopNav({ activeModule, onModuleChange }) {
  return (
    <header className="bg-brand-navy shadow-lg flex-shrink-0">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Brand bar */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">⬡</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Intelligent Finance Platform</div>
              <div className="text-white/50 text-[10px]">Office of the CFO · Powered by AI</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-white/50">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live Demo Environment
            </div>
            <div className="w-7 h-7 rounded-full bg-brand-teal/30 flex items-center justify-center text-white/70 text-[11px] font-semibold">
              SK
            </div>
          </div>
        </div>

        {/* Module tabs */}
        <div className="flex gap-1 py-1.5">
          {MODULE_ORDER.map(id => {
            const mod = MODULES[id]
            const active = activeModule === id
            const isLive = mod.wave === 1
            return (
              <button
                key={id}
                onClick={() => onModuleChange(id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-t-lg text-[11px] font-semibold transition-all ${
                  active
                    ? 'bg-white text-brand-ink shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: mod.color }}
                />
                <span>{mod.label}</span>
                <span className="hidden sm:block text-[9px] opacity-70">
                  {mod.fullName}
                </span>
                {isLive ? (
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                    LIVE
                  </span>
                ) : (
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-white/10 text-white/40">
                    {WAVE_LABELS[mod.wave]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
