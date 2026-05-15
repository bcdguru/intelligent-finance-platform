import { User } from '@carbon/icons-react'

const C = { navy: '#1e293b', teal: '#0891b2', bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b', sub: '#64748b', muted: '#94a3b8' }

export default function PersonaSidebar({ module, activePersona, onPersonaSelect }) {
  const wave1 = module.personas.filter(p => p.wave === 1)
  const future = module.personas.filter(p => p.wave > 1)

  return (
    <div style={{
      width: 188,
      flexShrink: 0,
      background: '#ffffff',
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.625rem 1rem',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        background: C.bg,
      }}>
        <User size={13} color={C.muted} />
        <span style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Personas
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0.375rem 0' }}>
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
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: active ? 600 : 400,
                  color: active ? C.teal : C.text,
                  background: active ? '#e0f2fe' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  borderLeft: active ? `3px solid ${C.teal}` : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.bg }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {future.length > 0 && (
          <>
            <div style={{
              padding: '0.375rem 1rem',
              fontSize: 10, fontWeight: 700, color: C.muted,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              borderTop: `1px solid ${C.border}`,
            }}>
              Future Waves
            </div>
            {future.map(p => (
              <div key={p.id} style={{
                padding: '0.4rem 1rem',
                fontSize: 12, color: C.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>{p.label}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px',
                  background: '#f1f5f9', color: C.sub, borderRadius: 4,
                  border: `1px solid ${C.border}`,
                }}>W{p.wave}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.5rem 1rem',
        borderTop: `1px solid ${C.border}`,
        fontSize: 10, color: C.muted, textAlign: 'center',
        background: C.bg,
      }}>
        {wave1.length} active · {module.personas.length} total
      </div>
    </div>
  )
}
