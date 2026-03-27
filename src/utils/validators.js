export const required = (value) =>
  value?.toString().trim() ? '' : 'This field is required'

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email'

export const minLength = (min) => (value) =>
  value?.length >= min ? '' : `Minimum ${min} characters required`

/** Run an array of validator fns against a value; return first error */
export const validate = (value, ...validators) => {
  for (const fn of validators) {
    const err = fn(value)
    if (err) return err
  }
  return ''
}
