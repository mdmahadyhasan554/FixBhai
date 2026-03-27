import { createContext, useContext, useState, useCallback } from 'react'

/**
 * ToastContext — lightweight global notification system.
 *
 * Usage:
 *   const { toast } = useToast()
 *   toast.success('Booking confirmed!')
 *   toast.error('Something went wrong')
 *   toast.info('Your session will expire soon')
 *   toast.warning('Please fill all required fields')
 */
const ToastContext = createContext(null)

const ICONS = {
  success: 'check-circle-fill',
  error:   'exclamation-triangle-fill',
  warning: 'exclamation-circle-fill',
  info:    'info-circle-fill',
}

const COLOURS = {
  success: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', icon: '#059669' },
  error:   { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', icon: '#ef4444' },
  warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', icon: '#f59e0b' },
  info:    { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: '#3b82f6' },
}

let _id = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg, dur) => add(msg, 'success', dur),
    error:   (msg, dur) => add(msg, 'error',   dur),
    warning: (msg, dur) => add(msg, 'warning', dur),
    info:    (msg, dur) => add(msg, 'info',    dur),
  }

  return (
    <ToastContext.Provider value={{ toast, remove }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside <ToastProvider>')
  return ctx
}

// ── Toast UI ──────────────────────────────────────────────

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 360,
        width: '100%',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

const ToastItem = ({ toast, onRemove }) => {
  const c = COLOURS[toast.type] || COLOURS.info
  return (
    <div
      role="alert"
      style={{
        background:   c.bg,
        border:       `1px solid ${c.border}`,
        borderRadius: 12,
        padding:      '12px 16px',
        display:      'flex',
        alignItems:   'flex-start',
        gap:          10,
        boxShadow:    '0 4px 16px rgba(0,0,0,0.1)',
        animation:    'slideInRight 0.25s ease',
      }}
    >
      <i
        className={`bi bi-${ICONS[toast.type]} flex-shrink-0 mt-1`}
        style={{ color: c.icon, fontSize: '1rem' }}
        aria-hidden="true"
      />
      <span style={{ color: c.text, fontSize: '0.875rem', lineHeight: 1.5, flex: 1 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: c.text, opacity: 0.6, padding: 0, lineHeight: 1,
        }}
      >
        <i className="bi bi-x" style={{ fontSize: '1rem' }} />
      </button>
    </div>
  )
}
