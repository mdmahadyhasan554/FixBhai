import { useState } from 'react'
import { passwordStrength } from '../../utils/passwordStrength'

/**
 * PasswordInput
 *
 * Password field with:
 *   - Show / hide toggle
 *   - Optional strength meter (showStrength prop)
 *   - Forwards all standard input props
 *
 * Props:
 *   label        — field label
 *   name         — input name
 *   value        — controlled value
 *   onChange     — change handler
 *   error        — validation error string
 *   showStrength — show password strength bar (default: false)
 *   placeholder  — input placeholder
 */
const PasswordInput = ({
  label        = 'Password',
  name         = 'password',
  value        = '',
  onChange,
  error,
  showStrength = false,
  placeholder  = 'Enter password',
  ...props
}) => {
  const [visible, setVisible] = useState(false)
  const strength = showStrength ? passwordStrength(value) : null
  const inputId  = `field-${name}`

  return (
    <div className="mb-3">
      <label htmlFor={inputId} className="form-label fw-semibold small">
        {label}
      </label>

      <div className="input-group">
        {/* Lock icon */}
        <span className="input-group-text bg-white border-end-0" aria-hidden="true">
          <i className="bi bi-lock text-muted" />
        </span>

        {/* Input */}
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          name={name}
          className={`form-control border-start-0 border-end-0 ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : showStrength ? `${inputId}-strength` : undefined}
          autoComplete={name === 'confirmPassword' ? 'new-password' : name === 'password' && showStrength ? 'new-password' : 'current-password'}
          {...props}
        />

        {/* Show/hide toggle */}
        <button
          type="button"
          className="input-group-text bg-white border-start-0"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          <i className={`bi bi-eye${visible ? '-slash' : ''} text-muted`} aria-hidden="true" />
        </button>
      </div>

      {/* Validation error */}
      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback d-block" role="alert">
          <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Strength meter */}
      {showStrength && value && (
        <div id={`${inputId}-strength`} className="mt-2" aria-live="polite">
          {/* Bar */}
          <div className="d-flex gap-1 mb-1" aria-hidden="true">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="rounded-pill flex-grow-1"
                style={{
                  height: 4,
                  background: i <= strength.score ? strength.color : '#e2e8f0',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
          {/* Label */}
          <div className="d-flex justify-content-between align-items-center">
            <span className="form-text" style={{ color: strength.color, fontWeight: 600 }}>
              {strength.label && `${strength.label} password`}
            </span>
            {strength.score < 3 && value && (
              <span className="form-text text-muted">
                Add uppercase, numbers or symbols
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PasswordInput
