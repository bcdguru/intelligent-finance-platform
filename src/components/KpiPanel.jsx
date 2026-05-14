import { Tile } from '@carbon/react'
import { CheckmarkFilled } from '@carbon/icons-react'

export default function KpiPanel({ kpis, color }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: '#161616',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '0.75rem',
      }}>
        KPI Goals
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {kpis.map(kpi => (
          <Tile key={kpi.id} style={{ padding: '0.75rem', borderLeft: `3px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: kpi.color, flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckmarkFilled size={12} color="#fff" />
              </div>
              <span style={{ fontSize: 11, color: '#161616', lineHeight: 1.4 }}>
                {kpi.label}
              </span>
            </div>
          </Tile>
        ))}
      </div>
    </div>
  )
}
