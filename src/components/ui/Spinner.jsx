const Spinner = ({ overlay = false, size = '' }) => {
  const spinner = (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className={`spinner-border text-primary ${size}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
  if (overlay) return <div className="spinner-overlay">{spinner}</div>
  return spinner
}

export default Spinner
