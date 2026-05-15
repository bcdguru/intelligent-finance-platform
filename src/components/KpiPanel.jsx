import { CheckmarkFilled } from '@carbon/icons-react'

const C = { bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b', sub: '#64748b', muted: '#94a3b8' }

export default function KpiPanel({ kpis, color }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: C.sub,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '0.75rem',
      }}>
        KPI Goals
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {kpis.map(kpi => (
          <div key={kpi.id} style={{
            background: '#ffffff',
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${kpi.color}`,
            borderRadius: 6,
            padding: '0.625rem 0.75rem',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: kpi.color, flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckmarkFilled size={11} color="#fff" />
              </div>
              <span style={{ fontSize: 11, color: C.text, lineHeight: 1.45, fontWeight: 500 }}>
                {kpi.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
