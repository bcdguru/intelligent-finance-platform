export default function MetricsBar({ metrics, color }) {
  return (
    <div style={{
      display: 'flex',
      gap: 0,
      borderTop: '1px solid #e0e0e0',
      marginLeft: -24,
      marginRight: -24,
    }}>
      {metrics.map((m, i) => (
        <div key={m.label} style={{
          flex: 1,
          padding: '0.625rem 1rem',
          borderRight: i < metrics.length - 1 ? '1px solid #e0e0e0' : 'none',
          borderTop: `2px solid ${i === 0 ? color : 'transparent'}`,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#161616', lineHeight: 1 }} className="count-up">
            {m.value}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#525252' }}>{m.label}</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: m.up ? '#24a148' : '#0f62fe',
              background: m.up ? '#defbe6' : '#edf5ff',
              padding: '0 4px', borderRadius: 2,
            }}>
              {m.delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
