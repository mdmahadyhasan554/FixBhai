const Input = ({ label, icon, error, className = '', ...props }) => (
  <div className={`mb-3 ${className}`}>
    {label && <label className="form-label fw-500">{label}</label>}
    <div className={icon ? 'input-group' : ''}>
      {icon && <span className="input-group-text bg-white"><i className={`bi bi-${icon}`} /></span>}
      <input className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  </div>
)

export default Input
