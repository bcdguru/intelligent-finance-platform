import { Tag } from '@carbon/react'
import { Code } from '@carbon/icons-react'

export default function SkillsPanel({ module }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      padding: '0.75rem 1rem',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '0.625rem',
      }}>
        <Code size={14} color="#525252" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#161616', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Skill-as-Code
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8d8d8d' }}>
          {module.skills.length} active
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {module.skills.map(skill => (
          <Tag
            key={skill}
            type="blue"
            size="sm"
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, cursor: 'pointer' }}
          >
            {skill}
          </Tag>
        ))}
      </div>
    </div>
  )
}
