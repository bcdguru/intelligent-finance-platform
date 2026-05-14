import {
  Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction,
  HeaderNavigation, HeaderMenuItem,
} from '@carbon/react'
import { Notification, UserAvatar, Activity } from '@carbon/icons-react'
import { MODULES, MODULE_ORDER } from '../data/modules'

const WAVE_STATUS = { 1: { label: 'Live', color: '#42be65' }, 2: { label: 'W2', color: '#78a9ff' }, 3: { label: 'W3', color: '#78a9ff' }, 4: { label: 'W4', color: '#78a9ff' }, 5: { label: 'W5', color: '#78a9ff' } }

export default function TopNav({ activeModule, onModuleChange }) {
  return (
    <Header aria-label="Intelligent Finance Platform">
      <HeaderName href="#" prefix="">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: 28, height: 28, borderRadius: 6,
            background: '#156082', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14, flexShrink: 0,
          }}>⬡</span>
          <span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Intelligent Finance Platform</span>
            <span style={{ fontSize: 11, opacity: 0.5, marginLeft: 8, fontWeight: 400 }}>Office of the CFO</span>
          </span>
        </span>
      </HeaderName>

      <HeaderNavigation aria-label="Finance modules">
        {MODULE_ORDER.map(id => {
          const mod = MODULES[id]
          const ws = WAVE_STATUS[mod.wave]
          const active = activeModule === id
          return (
            <HeaderMenuItem
              key={id}
              isCurrentPage={active}
              onClick={() => onModuleChange(id)}
              style={{ cursor: 'pointer' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: mod.color, flexShrink: 0,
                }} />
                <span style={{ fontWeight: active ? 600 : 400 }}>{mod.label}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px',
                  borderRadius: 10, background: ws.color + '22',
                  color: ws.color, border: `1px solid ${ws.color}44`,
                }}>
                  {ws.label}
                </span>
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
        <HeaderGlobalAction aria-label="User profile" tooltipAlignment="end">
          <UserAvatar size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  )
}
