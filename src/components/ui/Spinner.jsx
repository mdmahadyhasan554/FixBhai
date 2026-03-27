/**
 * Spinner
 *
 * Props:
 *   variant  — Bootstrap colour: 'primary' (default) | 'secondary' | 'success' | etc.
 *   size     — 'sm' | 'md' (default) | 'lg'
 *   type     — 'border' (default) | 'grow'
 *   overlay  — renders a full-page semi-transparent overlay
 *   label    — accessible screen-reader text (default: 'Loading...')
 *   inline   — removes the centering wrapper (use inside buttons or inline)
 *   className — additional classes on the spinner element
 */

const SIZE_STYLE = {
  sm: { width: '1rem',    height: '1rem',    borderWidth: '0.15em' },
  md: { width: '2rem',    height: '2rem',    borderWidth: '0.2em'  },
  lg: { width: '3.5rem',  height: '3.5rem',  borderWidth: '0.25em' },
}

const Spinner = ({
  variant   = 'primary',
  size      = 'md',
  type      = 'border',
  overlay   = false,
  label     = 'Loading...',
  inline    = false,
  className = '',
}) => {
  const sizeStyle = SIZE_STYLE[size] || SIZE_STYLE.md

  const spinnerEl = (
    <div
      className={`spinner-${type} text-${variant} ${className}`}
      role="status"
      style={sizeStyle}
      aria-label={label}
    >
      <span className="visually-hidden">{label}</span>
    </div>
  )

  if (inline)   return spinnerEl
  if (overlay)  return (
    <div
      className="spinner-overlay"
      role="alert"
      aria-live="assertive"
      aria-label={label}
    >
      <div className="text-center">
        {spinnerEl}
        <p className="text-muted small mt-3 mb-0">{label}</p>
      </div>
    </div>
  )

  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      {spinnerEl}
    </div>
  )
}

export default Spinner
