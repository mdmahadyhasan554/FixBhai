import { useEffect, useCallback } from 'react'

/**
 * Modal
 *
 * Props:
 *   show        — controls visibility
 *   onClose     — called when backdrop or × is clicked
 *   title       — modal heading
 *   size        — 'sm' | 'md' (default) | 'lg' | 'xl' | 'fullscreen'
 *   centered    — vertically centred (default: true)
 *   scrollable  — scrollable body for long content
 *   closeOnBackdrop — dismiss when clicking outside (default: true)
 *   footer      — ReactNode rendered in the footer slot
 *   children    — modal body content
 *
 * Accessibility:
 *   - role="dialog" with aria-modal and aria-labelledby
 *   - Escape key closes the modal
 *   - Body scroll locked while open
 */
const SIZE_MAP = {
  sm:         'modal-sm',
  md:         '',
  lg:         'modal-lg',
  xl:         'modal-xl',
  fullscreen: 'modal-fullscreen',
}

const Modal = ({
  show,
  onClose,
  title,
  size             = 'md',
  centered         = true,
  scrollable       = false,
  closeOnBackdrop  = true,
  footer,
  children,
}) => {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [show])

  // Close on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.()
  }, [onClose])

  useEffect(() => {
    if (show) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [show, handleKeyDown])

  if (!show) return null

  const dialogClass = [
    'modal-dialog',
    SIZE_MAP[size],
    centered   ? 'modal-dialog-centered'   : '',
    scrollable ? 'modal-dialog-scrollable' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className="modal d-block"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(2px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div className={dialogClass} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-4 shadow-lg">

          {/* Header */}
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <h5 className="modal-title fw-bold" id="modal-title">{title}</h5>
            <button
              className="btn-close"
              onClick={onClose}
              aria-label="Close modal"
            />
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-3">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
              {footer}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Modal
