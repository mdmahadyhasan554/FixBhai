/**
 * Badge
 *
 * Props:
 *   type      — semantic colour key: 'primary' | 'success' | 'warning' |
 *               'danger' | 'info' | 'secondary' | 'dark' | 'light'
 *   size      — 'sm' | 'md' (default) | 'lg'
 *   dot       — shows a small coloured dot before the label
 *   icon      — bootstrap-icons name shown before label
 *   pill      — rounded-pill shape (default: true)
 *   className — additional classes
 *
 * Colour tokens map to custom CSS classes defined in index.css:
 *   .badge-success, .badge-warning, .badge-danger, .badge-info
 * For Bootstrap native colours, falls back to bg-{type}.
 */

const CUSTOM_TYPES = ['success', 'warning', 'danger', 'info']

const SIZE_MAP = {
  sm: { fontSize: '0.7rem',  padding: '3px 10px' },
  md: { fontSize: '0.78rem', padding: '5px 12px' },
  lg: { fontSize: '0.88rem', padding: '6px 16px' },
}

const DOT_COLOUR = {
  success:   '#10b981',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  info:      '#3b82f6',
  primary:   '#2563eb',
  secondary: '#64748b',
  dark:      '#1e293b',
  light:     '#94a3b8',
}

const Badge = ({
  children,
  type      = 'info',
  size      = 'md',
  dot       = false,
  icon      = '',
  pill      = true,
  className = '',
  ...props
}) => {
  const isCustom   = CUSTOM_TYPES.includes(type)
  const colourClass = isCustom ? `badge-${type}` : `bg-${type}`
  const sizeStyle   = SIZE_MAP[size] || SIZE_MAP.md

  const classes = [
    'badge',
    'd-inline-flex',
    'align-items-center',
    'gap-1',
    colourClass,
    pill ? 'rounded-pill' : 'rounded-2',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      style={{ fontSize: sizeStyle.fontSize, padding: sizeStyle.padding }}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: DOT_COLOUR[type] || '#64748b',
            flexShrink: 0,
          }}
        />
      )}
      {icon && <i className={`bi bi-${icon}`} aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Badge
