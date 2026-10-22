import { useEffect } from 'react'

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Marlow` : 'Marlow — Dinner, delivered'
  }, [title])
}
