const Badge = ({ children, type = 'info', className = '' }) => (
  <span className={`badge badge-${type} rounded-pill px-3 py-2 ${className}`} style={{ fontSize: '0.78rem' }}>
    {children}
  </span>
)

export default Badge
