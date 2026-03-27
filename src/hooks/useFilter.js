import { useState, useMemo } from 'react'

/**
 * useFilter — generic client-side filter + sort hook.
 *
 * Separates filter/sort logic from UI components. The caller provides
 * pure functions for filtering and sorting; this hook manages the state.
 *
 * @param {Array}    items    — the full unfiltered dataset
 * @param {Function} filterFn — (item, filters, query) => boolean
 *                              Return true to include the item.
 * @param {Function} [sortFn] — (a, b, sortKey) => number
 *                              Standard comparator. Only called when sortKey is set.
 *
 * @returns {{
 *   result:     Array,    — filtered + sorted items (memoised)
 *   query:      string,   — current search string
 *   setQuery:   Function,
 *   filters:    object,   — current filter values { service, available, ... }
 *   setFilters: Function,
 *   sortKey:    string,   — current sort key e.g. 'rating'
 *   setSortKey: Function,
 * }}
 *
 * @example
 *   const { result, query, setQuery } = useFilter(
 *     TECHNICIANS,
 *     (tech, filters, q) => tech.name.includes(q),
 *     (a, b, key) => key === 'rating' ? b.rating - a.rating : 0
 *   )
 */
const useFilter = (items = [], filterFn, sortFn) => {
  const [query,   setQuery]   = useState('')
  const [filters, setFilters] = useState({})
  const [sortKey, setSortKey] = useState('')

  const result = useMemo(() => {
    // 1. Filter
    let list = items.filter(item => filterFn(item, filters, query))
    // 2. Sort (only when a sort key is active)
    if (sortFn && sortKey) list = [...list].sort((a, b) => sortFn(a, b, sortKey))
    return list
  }, [items, filters, query, sortKey, filterFn, sortFn])

  return { result, query, setQuery, filters, setFilters, sortKey, setSortKey }
}

export default useFilter
