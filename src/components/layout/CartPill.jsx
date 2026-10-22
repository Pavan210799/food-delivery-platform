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
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between rounded-full bg-ink px-5 py-3.5 text-cream shadow-[0_18px_40px_-20px_rgba(28,22,18,0.8)] md:hidden"
    >
      <span className="text-sm font-semibold">View order · {count}</span>
      <span className="text-sm tabular-nums">{money(quote.subtotal)}</span>
    </Link>
  )
}
