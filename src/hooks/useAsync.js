import { useState, useCallback } from 'react'

/**
 * Wraps an async function with loading / error state.
 * Usage:
 *   const { run, loading, error } = useAsync()
 *   await run(() => someAsyncFn())
 */
const useAsync = () => {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const run = useCallback(async (asyncFn) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn()
      return result
    } catch (err) {
      setError(err?.message || 'Something went wrong')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { run, loading, error }
}

export default useAsync
