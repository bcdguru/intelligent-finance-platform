const C = { border: '#e2e8f0', text: '#1e293b', sub: '#64748b', bg: '#f8fafc' }

export default function MetricsBar({ metrics, color }) {
  return (
    <div style={{
      display: 'flex',
      borderTop: `1px solid ${C.border}`,
      marginTop: '0.75rem',
      background: C.bg,
      borderRadius: '0 0 6px 6px',
    }}>
      {metrics.map((m, i) => (
        <div key={m.label} style={{
          flex: 1,
          padding: '0.625rem 1rem',
          borderRight: i < metrics.length - 1 ? `1px solid ${C.border}` : 'none',
          borderTop: `3px solid ${i === 0 ? color : 'transparent'}`,
          marginTop: -1,
        }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1, letterSpacing: '-0.02em' }} className="count-up">
            {m.value}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
              {m.label}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: m.up ? '#059669' : '#0891b2',
              background: m.up ? '#d1fae5' : '#e0f2fe',
              padding: '0 5px', borderRadius: 4,
            }}>
              {m.delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
