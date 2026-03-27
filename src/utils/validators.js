export function required(value) {
  return value && value.toString().trim() ? '' : 'This field is required'
}
export function isEmail(value) {
  if (!value || !value.toString().trim()) return 'Email is required'
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address'
}
export function minLength(min) {
  return function(value) {
    return value && value.length >= min ? '' : 'Minimum ' + min + ' characters required'
  }
}
export function maxLength(max) {
  return function(value) {
    return !value || value.length <= max ? '' : 'Maximum ' + max + ' characters allowed'
  }
}
export function isPhone(value) {
  if (!value || !value.toString().trim()) return 'Phone number is required'
  return /^[+]?[\d\s\-().]{7,15}$/.test(value.trim()) ? '' : 'Enter a valid phone number'
}
export function isStrongPassword(value) {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter'
  if (!/[0-9]/.test(value)) return 'Include at least one number'
  return ''
}
export function matchesField(otherValue, label) {
  return function(value) {
    return value === otherValue ? '' : (label || 'Passwords') + ' do not match'
  }
}
export function validate(value, fn1, fn2, fn3) {
  var fns = [fn1, fn2, fn3].filter(Boolean)
  for (var i = 0; i < fns.length; i++) {
    var err = fns[i](value)
    if (err) return err
  }
  return ''
}