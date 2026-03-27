import { useState, useCallback } from 'react'

/**
 * useAsync — wraps a one-shot async operation with loading / error state.
 *
 * Difference from useApi:
 *   useApi   = data-fetching (auto-runs, has data state, refetchable)
 *   useAsync = mutations (run manually, no data state by default)
 *
 * Usage:
 *   const { run, loading, error, fieldErrors } = useAsync()
 *   await run(() => bookingApi.createBooking(payload))
 *
 * fieldErrors — populated when the server returns 422 with per-field errors
 *   { email: 'Already taken', phone: 'Invalid format' }
 */
const useAsync = () => {
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const run = useCallback(async (asyncFn) => {
    setLoading(true)
    setError(null)
    setFieldErrors({})
    try {
      const result = await asyncFn()
      return result
    } catch (err) {
      setError(err?.message || 'Something went wrong')
      if (err?.fieldErrors) setFieldErrors(err.fieldErrors)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setFieldErrors({})
  }, [])

  return { run, loading, error, fieldErrors, reset }
}

export default useAsync
