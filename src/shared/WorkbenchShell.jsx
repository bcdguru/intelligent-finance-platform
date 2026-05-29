import { Button, Tag } from '@carbon/react'
import { Close } from '@carbon/icons-react'

/**
 * WorkbenchShell — shared full-screen overlay wrapper for all workbenches.
 *
 * Props:
 *   title       {string}    — Workbench headline (e.g. "Collections Copilot")
 *   subtitle    {string}    — Module · role · wave descriptor
 *   badge       {string?}   — Optional Tag text (e.g. "Wave 1 · Live")
 *   badgeType   {string?}   — Carbon Tag type: 'green' | 'blue' | 'purple'. Default 'green'
 *   onClose     {function}  — Called when the Close button is clicked
 *   children    {ReactNode} — KPI strip, tab bar, content go here
 */
export default function WorkbenchShell({
  title,
  subtitle,
  badge,
  badgeType = 'green',
  onClose,
  children,
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      display: 'flex', flexDirection: 'column',
      background: '#f4f4f4',
    }}>
      {/* ── Standard header ─────────────────────────────────────────────────── */}
      <div style={{
        background: '#0E2841',
        color: '#fff',
        flexShrink: 0,
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid #393939',
      }}>
        {/* Platform icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: '#156082',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 16, flexShrink: 0,
        }}>⬡</div>

        {/* Title + subtitle */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>{subtitle}</div>
          )}
        </div>

        {/* Right side — badge + close */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {badge && <Tag type={badgeType} size="sm">{badge}</Tag>}
          <Button
            size="sm"
            kind="ghost"
            renderIcon={Close}
            iconDescription="Close"
            hasIconOnly
            onClick={onClose}
          />
        </div>
      </div>

      {/* ── Workbench content (KPI strip, tabs, body) ───────────────────────── */}
      {children}
    </div>
  )
}
