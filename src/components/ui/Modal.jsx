import { useEffect } from 'react'

const Modal = ({ show, onClose, title, children, footer }) => {
  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [show])

  if (!show) return null

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content rounded-4 border-0">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer border-0 pt-0">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export default Modal
