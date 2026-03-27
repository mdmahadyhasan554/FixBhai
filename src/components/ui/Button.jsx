/**
 * Button
 *
 * Props:
 *   variant   — Bootstrap colour: 'primary' | 'secondary' | 'success' | 'danger' |
 *               'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | etc.
 *   size      — 'sm' | 'lg' | '' (default)
 *   loading   — shows inline spinner and disables the button
 *   icon      — bootstrap-icons name shown before children (e.g. 'plus-circle')
 *   iconEnd   — bootstrap-icons name shown after children
 *   block     — full-width button
 *   rounded   — extra-rounded pill style
 *   className — additional classes
 */
const Button = ({
  children,
  variant   = 'primary',
  size      = '',
  loading   = false,
  icon      = '',
  iconEnd   = '',
  block     = false,
  rounded   = false,
  className = '',
  type      = 'button',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size      ? `btn-${size}`  : '',
    block     ? 'w-100'        : '',
    rounded   ? 'rounded-pill' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={loading || props.disabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />
      )}
      {!loading && icon && <i className={`bi bi-${icon} ${children ? 'me-2' : ''}`} aria-hidden="true" />}
      {children}
      {!loading && iconEnd && <i className={`bi bi-${iconEnd} ${children ? 'ms-2' : ''}`} aria-hidden="true" />}
    </button>
  )
}

export default Button
