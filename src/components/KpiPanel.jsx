export default function KpiPanel({ kpis }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-bold text-brand-teal uppercase tracking-widest mb-1">
        KPI Goals
      </div>
      {kpis.map(kpi => (
        <div
          key={kpi.id}
          className="flex items-start gap-2 p-2 rounded-lg bg-white border slide-in"
          style={{ borderLeft: `3px solid ${kpi.color}` }}
        >
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
            style={{ background: kpi.color }}
          >
            {kpi.icon}
          </span>
          <span className="text-[11px] text-brand-ink leading-snug">{kpi.label}</span>
        </div>
      ))}
    </div>
  )
}
