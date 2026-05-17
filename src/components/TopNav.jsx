import {
  Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction,
  HeaderNavigation, HeaderMenuItem,
} from '@carbon/react'
import { Notification, UserAvatar, Activity } from '@carbon/icons-react'
import { MODULES, MODULE_ORDER } from '../data/modules'

const C = { navy: '#1e293b', teal: '#0891b2', border: '#334155', muted: '#94a3b8' }

export default function TopNav({ activeModule, onModuleChange }) {
  return (
    <Header aria-label="Intelligent Finance Platform" style={{ background: C.navy, borderBottom: `1px solid ${C.border}` }}>
      <HeaderName href="#" prefix="">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: 26, height: 26, borderRadius: 6,
            background: C.teal, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14, flexShrink: 0,
          }}>⬡</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
            Intelligent Finance
          </span>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>· Office of the CFO</span>
        </span>
      </HeaderName>

      <HeaderNavigation aria-label="Finance modules">
        {/* Finance Atlas */}
        <HeaderMenuItem
          isCurrentPage={activeModule === 'atlas'}
          onClick={() => onModuleChange('atlas')}
          style={{
            cursor: 'pointer',
            borderBottom: activeModule === 'atlas' ? `2px solid ${C.teal}` : '2px solid transparent',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 14, height: 14, borderRadius: 3,
              background: activeModule === 'atlas' ? C.teal : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, flexShrink: 0, color: '#fff', fontWeight: 700,
            }}>⬡</span>
            <span style={{ fontWeight: activeModule === 'atlas' ? 600 : 400, fontSize: 13 }}>Finance Atlas</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 5px',
              borderRadius: 10, background: 'rgba(8,145,178,0.2)', color: '#67e8f9',
              border: '1px solid rgba(103,232,249,0.3)',
            }}>R2R–FP&A</span>
          </span>
        </HeaderMenuItem>

        {/* Procurement Atlas */}
        <HeaderMenuItem
          isCurrentPage={activeModule === 'proc-atlas'}
          onClick={() => onModuleChange('proc-atlas')}
          style={{
            cursor: 'pointer',
            borderBottom: activeModule === 'proc-atlas' ? '2px solid #C41E3A' : '2px solid transparent',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 14, height: 14, borderRadius: 3,
              background: activeModule === 'proc-atlas' ? '#C41E3A' : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, flexShrink: 0, color: '#fff', fontWeight: 700,
            }}>⬡</span>
            <span style={{ fontWeight: activeModule === 'proc-atlas' ? 600 : 400, fontSize: 13 }}>Proc Atlas</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 5px',
              borderRadius: 10, background: 'rgba(196,30,58,0.2)', color: '#ff8389',
              border: '1px solid rgba(255,131,137,0.3)',
            }}>S2P</span>
          </span>
        </HeaderMenuItem>

        {/* Finance modules */}
        {MODULE_ORDER.map(id => {
          const mod = MODULES[id]
          const isLive = mod.wave === 1
          const active = activeModule === id
          return (
            <HeaderMenuItem
              key={id}
              isCurrentPage={active}
              onClick={() => onModuleChange(id)}
              style={{
                cursor: 'pointer',
                borderBottom: active ? `2px solid ${C.teal}` : '2px solid transparent',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: mod.color, flexShrink: 0 }} />
                <span style={{ fontWeight: active ? 600 : 400, fontSize: 13 }}>{mod.label}</span>
                {isLive && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 5px',
                    borderRadius: 10, background: 'rgba(5,150,105,0.2)', color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.3)',
                  }}>Live</span>
                )}
              </span>
            </HeaderMenuItem>
          )
        })}
      </HeaderNavigation>

      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Activity" tooltipAlignment="end">
          <Activity size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="end">
          <Notification size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="User" tooltipAlignment="end">
          <UserAvatar size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  )
}
