/**
 * passwordStrength(value)
 * Returns { score: 0–4, label, color, width }
 *   0 = empty  1 = weak  2 = fair  3 = good  4 = strong
 */
const LEVELS = [
  { label: '',       color: '#e2e8f0', bg: '#e2e8f0' },
  { label: 'Weak',   color: '#ef4444', bg: '#fee2e2' },
  { label: 'Fair',   color: '#f59e0b', bg: '#fef3c7' },
  { label: 'Good',   color: '#3b82f6', bg: '#dbeafe' },
  { label: 'Strong', color: '#10b981', bg: '#d1fae5' },
]

export const passwordStrength = (value = '') => {
  if (!value) return { score: 0, ...LEVELS[0] }
  let score = 1
  if (value.length >= 8)          score++
  if (/[A-Z]/.test(value))        score++
  if (/[0-9]/.test(value))        score++
  if (/[^A-Za-z0-9]/.test(value)) score = Math.min(4, score + 1)
  const capped = Math.min(4, score)
  return { score: capped, ...LEVELS[capped] }
}
