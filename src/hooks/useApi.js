import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useApi — data-fetching hook with loading / error / data state.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(
 *     () => serviceApi.getServices(),
 *     { immediate: true, initialData: [] }
 *   )
 *
 * Options:
 *   immediate   — fetch on mount (default: true)
 *   initialData — value of `data` before first successful fetch
 *   onSuccess   — callback(data) after successful fetch
 *   onError     — callback(error) after failed fetch
 *   deps        — extra dependency array to re-trigger fetch
 */
const useApi = (apiFn, options = {}) => {
  const {
    immediate   = true,
    initialData = null,
    onSuccess,
    onError,
    deps        = [],
  } = options

  const [data,    setData]    = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFn(...args)
      if (!mountedRef.current) return result
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      if (!mountedRef.current) return
      const msg = err?.message || 'Something went wrong'
      setError(msg)
      onError?.(err)
      throw err
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [apiFn, onSuccess, onError]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fetch on mount and when deps change
  useEffect(() => {
    if (immediate) execute()
  }, [immediate, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    setData,
    refetch: execute,
  }
}

export default useApi
