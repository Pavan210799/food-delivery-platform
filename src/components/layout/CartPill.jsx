import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { money } from '../../lib/format'

const hiddenPaths = ['/cart', '/checkout']

export default function CartPill() {
  const { count, quote } = useCart()
  const location = useLocation()
  const hidden =
    count === 0 ||
    hiddenPaths.includes(location.pathname) ||
    location.pathname.startsWith('/orders')

  if (hidden) return null

  return (
    <Link
      to="/cart"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-ink px-4 py-3.5 text-cream shadow-[0_18px_40px_-20px_rgba(28,22,18,0.8)] sm:inset-x-4 sm:bottom-4 sm:px-5 md:hidden"
    >
      <span className="min-w-0 truncate text-sm font-semibold">View order · {count}</span>
      <span className="shrink-0 text-sm tabular-nums">{money(quote.subtotal)}</span>
    </Link>
  )
}
