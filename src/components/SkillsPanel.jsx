import { Code } from '@carbon/icons-react'

const C = { bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b', sub: '#64748b', muted: '#94a3b8', teal: '#0891b2' }

export default function SkillsPanel({ module }) {
  return (
    <div style={{
      background: '#ffffff',
      border: `1px solid ${C.border}`,
      borderTop: `3px solid ${C.teal}`,
      borderRadius: 6,
      padding: '0.75rem 1rem',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '0.625rem',
      }}>
        <Code size={13} color={C.teal} />
        <span style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Skill-as-Code
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: C.muted, fontWeight: 500 }}>
          {module.skills.length} active
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {module.skills.map(skill => (
          <span
            key={skill}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 4,
              background: '#e0f2fe',
              color: C.teal,
              border: '1px solid #bae6fd',
              cursor: 'pointer',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
