import { Code2, CheckCircle } from 'lucide-react'

export default function SkillsPanel({ module }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-brand-silver shadow-sm slide-in">
      <div className="flex items-center gap-2 mb-3">
        <Code2 size={14} className="text-brand-teal" />
        <span className="text-[11px] font-bold text-brand-ink uppercase tracking-wide">
          Skills · Skill-as-Code
        </span>
        <span className="ml-auto text-[10px] text-gray-400">{module.skills.length} active</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {module.skills.map(skill => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-teal/8 text-brand-teal border border-brand-teal/20 text-[10px] font-mono font-medium hover:bg-brand-teal/15 cursor-pointer transition-colors"
          >
            <CheckCircle size={9} className="text-brand-teal/60" />
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
