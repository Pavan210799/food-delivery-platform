import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const KitchenQueryContext = createContext(null)

const BROWSE_PATHS = new Set(['/', '/restaurants'])

function buildParams({ q, cat, sort }) {
  const next = new URLSearchParams()
  const query = (q ?? '').trim()
  if (query) next.set('q', query)
  if (cat && cat !== 'all') next.set('cat', cat)
  if (sort && sort !== 'featured') next.set('sort', sort)
  return next
}

export function KitchenQueryProvider({ children }) {
  const [params, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const onHome = location.pathname === '/'
  const onBrowse = BROWSE_PATHS.has(location.pathname)
  const wasSearching = useRef(false)

  const query = params.get('q') ?? ''
  const category = params.get('cat') ?? 'all'
  const sort = params.get('sort') ?? 'featured'
  const searching = onHome && query.trim().length > 0

  useEffect(() => {
    if (searching && !wasSearching.current) {
      const focusSearch = () => {
        const field = document.getElementById('nav-search')
        if (!field) return
        field.focus()
        const end = field.value.length
        try {
          field.setSelectionRange(end, end)
        } catch {
          /* some inputs reject selection */
        }
      }
      window.requestAnimationFrame(() => {
        focusSearch()
        window.requestAnimationFrame(focusSearch)
      })
    }
    wasSearching.current = searching
  }, [searching])

  const paramsRef = useRef(params)
  paramsRef.current = params
  const pathRef = useRef(location.pathname)
  pathRef.current = location.pathname

  const update = useCallback(
    (patch) => {
      const currentParams = paramsRef.current
      const current = {
        q: currentParams.get('q') ?? '',
        cat: currentParams.get('cat') ?? 'all',
        sort: currentParams.get('sort') ?? 'featured',
      }
      const merged = { ...current, ...patch }

      if (Object.prototype.hasOwnProperty.call(patch, 'q') && String(merged.q).trim()) {
        merged.cat = 'all'
      }

      const next = buildParams(merged)
      const nextQuery = (merged.q ?? '').trim()
      const prevQuery = (current.q ?? '').trim()
      const searchModeChanged = Boolean(prevQuery) !== Boolean(nextQuery)
      const search = next.toString()
      const path = pathRef.current

      // Text always opens results on home.
      if (nextQuery) {
        navigate({ pathname: '/', search: `?${search}` })
        return
      }

      // Filters/sort stay on the current browse page when possible.
      if (BROWSE_PATHS.has(path)) {
        setSearchParams(next, {
          replace: true,
          preventScrollReset: !searchModeChanged,
        })
        if (searchModeChanged) {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          })
        }
        return
      }

      navigate({ pathname: '/restaurants', search: search ? `?${search}` : '' })
    },
    [navigate, setSearchParams],
  )

  const clearSearch = useCallback(() => {
    update({ q: '' })
  }, [update])

  const value = useMemo(
    () => ({ query, category, sort, searching, update, clearSearch, onHome, onBrowse }),
    [query, category, sort, searching, update, clearSearch, onHome, onBrowse],
  )

  return <KitchenQueryContext.Provider value={value}>{children}</KitchenQueryContext.Provider>
}

export function useKitchenQuery() {
  const value = useContext(KitchenQueryContext)
  if (!value) {
    throw new Error('useKitchenQuery must be used within KitchenQueryProvider')
  }
  return value
}
