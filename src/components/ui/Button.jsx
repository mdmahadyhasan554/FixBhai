const Button = ({ children, variant = 'primary', size = '', loading = false, className = '', ...props }) => (
  <button
    className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
    {children}
  </button>
)

export default Button
