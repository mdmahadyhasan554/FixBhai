/**
 * Input
 *
 * Props:
 *   label     — field label text
 *   hint      — small helper text below the input
 *   icon      — bootstrap-icons name shown as left addon (e.g. 'envelope')
 *   iconEnd   — bootstrap-icons name shown as right addon
 *   error     — validation error string; triggers is-invalid styling
 *   success   — show is-valid styling
 *   size      — 'sm' | 'lg' | '' (default)
 *   as        — 'input' | 'textarea' | 'select'
 *   className — wrapper div classes
 *   All native input/textarea/select props are forwarded.
 */
const Input = ({
  label,
  hint,
  icon,
  iconEnd,
  error,
  success   = false,
  size      = '',
  as        = 'input',
  className = '',
  children,   // for <select> options
  id,
  ...props
}) => {
  const inputId      = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const controlClass = [
    as === 'input' || as === 'textarea' ? 'form-control' : 'form-select',
    size    ? `form-control-${size}` : '',
    error   ? 'is-invalid'           : '',
    success ? 'is-valid'             : '',
    icon    ? 'border-start-0'       : '',
    iconEnd ? 'border-end-0'         : '',
  ].filter(Boolean).join(' ')

  const Tag = as

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label fw-semibold small">
          {label}
        </label>
      )}

      <div className={icon || iconEnd ? 'input-group' : ''}>
        {icon && (
          <span className="input-group-text bg-white" aria-hidden="true">
            <i className={`bi bi-${icon} text-muted`} />
          </span>
        )}

        <Tag
          id={inputId}
          className={controlClass}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        >
          {as === 'select' ? children : undefined}
        </Tag>

        {iconEnd && (
          <span className="input-group-text bg-white" aria-hidden="true">
            <i className={`bi bi-${iconEnd} text-muted`} />
          </span>
        )}
      </div>

      {hint && !error && (
        <div id={`${inputId}-hint`} className="form-text text-muted">
          {hint}
        </div>
      )}
      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  )
}

export default Input
