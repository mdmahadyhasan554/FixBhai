import { useState, useMemo } from 'react'

/**
 * Generic filter + sort hook.
 * @param {Array}    items
 * @param {Function} filterFn  - (item, filters, query) => boolean
 * @param {Function} sortFn    - (a, b, sortKey) => number
 */
const useFilter = (items = [], filterFn, sortFn) => {
  const [query,   setQuery]   = useState('')
  const [filters, setFilters] = useState({})
  const [sortKey, setSortKey] = useState('')

  const result = useMemo(() => {
    let list = items.filter(item => filterFn(item, filters, query))
    if (sortFn && sortKey) list = [...list].sort((a, b) => sortFn(a, b, sortKey))
    return list
  }, [items, filters, query, sortKey, filterFn, sortFn])

  return { result, query, setQuery, filters, setFilters, sortKey, setSortKey }
}

export default useFilter
