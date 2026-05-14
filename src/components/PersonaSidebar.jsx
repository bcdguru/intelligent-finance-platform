import { Tag } from '@carbon/react'
import { User } from '@carbon/icons-react'

export default function PersonaSidebar({ module, activePersona, onPersonaSelect }) {
  const wave1 = module.personas.filter(p => p.wave === 1)
  const future = module.personas.filter(p => p.wave > 1)

  return (
    <div style={{
      width: 180,
      flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.625rem 1rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', gap: '0.375rem',
      }}>
        <User size={14} color="#525252" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#161616', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Personas
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Active wave */}
        <div style={{ padding: '0.5rem 0' }}>
          {wave1.map(p => {
            const active = activePersona === p.id
            return (
              <button
                key={p.id}
                onClick={() => onPersonaSelect(p.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 1rem',
                  fontSize: 12,
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#ffffff' : '#161616',
                  background: active ? '#156082' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  borderLeft: active ? '3px solid #0f9ed5' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f4f4f4' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {/* Future waves */}
        {future.length > 0 && (
          <>
            <div style={{
              padding: '0.375rem 1rem',
              fontSize: 10, fontWeight: 700, color: '#8d8d8d',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              borderTop: '1px solid #e0e0e0',
            }}>
              Future Waves
            </div>
            {future.map(p => (
              <div key={p.id} style={{
                padding: '0.4rem 1rem',
                fontSize: 12, color: '#a8a8a8',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>{p.label}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px',
                  background: '#e0e0e0', color: '#6f6f6f', borderRadius: 2,
                }}>W{p.wave}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.5rem 1rem',
        borderTop: '1px solid #e0e0e0',
        fontSize: 10, color: '#8d8d8d', textAlign: 'center',
      }}>
        {wave1.length} active · {module.personas.length} total
      </div>
    </div>
  )
}
