import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSplash } from '../context/SplashContext'

/** After splash (and on each path change), keep the page in a skeleton state briefly. */
export function usePageSkeleton(durationMs = 800) {
  const { splashDone } = useSplash()
  const { pathname } = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!splashDone) {
      setReady(false)
      return undefined
    }

    setReady(false)
    const timer = window.setTimeout(() => setReady(true), durationMs)
    return () => window.clearTimeout(timer)
  }, [splashDone, pathname, durationMs])

  return !ready
}
