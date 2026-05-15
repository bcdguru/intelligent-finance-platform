import {
  Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction,
  HeaderNavigation, HeaderMenuItem,
} from '@carbon/react'
import { Notification, UserAvatar, Activity } from '@carbon/icons-react'
import { MODULES, MODULE_ORDER } from '../data/modules'

export default function TopNav({ activeModule, onModuleChange }) {
  return (
    <Header aria-label="Intelligent Finance Platform">
      <HeaderName href="#" prefix="">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: 24, height: 24, borderRadius: 4,
            background: '#156082', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 13, flexShrink: 0,
          }}>⬡</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Intelligent Finance Platform</span>
          <span style={{ fontSize: 11, opacity: 0.45, fontWeight: 400 }}>Office of the CFO</span>
        </span>
      </HeaderName>

      <HeaderNavigation aria-label="Finance modules">
        {MODULE_ORDER.map(id => {
          const mod = MODULES[id]
          const isLive = mod.wave === 1
          const active = activeModule === id
          return (
            <HeaderMenuItem
              key={id}
              isCurrentPage={active}
              onClick={() => onModuleChange(id)}
              style={{ cursor: 'pointer' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: mod.color, flexShrink: 0 }} />
                <span style={{ fontWeight: active ? 600 : 400 }}>{mod.label}</span>
                {isLive && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 4px',
                    borderRadius: 8, background: '#24a14822', color: '#24a148',
                    border: '1px solid #24a14844',
                  }}>Live</span>
                )}
              </span>
            </HeaderMenuItem>
          )
        })}

        {/* Atlas separator + entry */}
        <HeaderMenuItem
          isCurrentPage={activeModule === 'atlas'}
          onClick={() => onModuleChange('atlas')}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 14, height: 14, borderRadius: 2,
              background: activeModule === 'atlas' ? '#f4f4f4' : 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, flexShrink: 0, color: '#fff', fontWeight: 700,
            }}>⬡</span>
            <span style={{ fontWeight: activeModule === 'atlas' ? 600 : 400 }}>Atlas</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 4px',
              borderRadius: 8, background: 'rgba(120,169,255,0.2)', color: '#78a9ff',
              border: '1px solid rgba(120,169,255,0.3)',
            }}>All</span>
          </span>
        </HeaderMenuItem>
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
