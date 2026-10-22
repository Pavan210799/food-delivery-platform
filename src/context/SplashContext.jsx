import { createContext, useContext, useMemo, useState } from 'react'

const SplashContext = createContext(null)

export function SplashProvider({ children }) {
  const [splashDone, setSplashDone] = useState(false)
  const value = useMemo(() => ({ splashDone, setSplashDone }), [splashDone])
  return <SplashContext.Provider value={value}>{children}</SplashContext.Provider>
}

export function useSplash() {
  const value = useContext(SplashContext)
  if (!value) throw new Error('useSplash must be used within SplashProvider')
  return value
}
