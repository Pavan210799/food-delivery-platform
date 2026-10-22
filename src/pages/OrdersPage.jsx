import { useEffect, useState } from 'react'
import OrderSummaryCard from '../components/orders/OrderSummaryCard'
import { ButtonLink } from '../components/ui/Button'
import { OrdersSkeleton } from '../components/ui/PageSkeletons'
import { useOrders } from '../context/OrdersContext'
import { usePageSkeleton } from '../hooks/usePageSkeleton'
import { useTitle } from '../hooks/useTitle'

export default function OrdersPage() {
  const { orders } = useOrders()
  const loading = usePageSkeleton(750)
  const [now, setNow] = useState(() => Date.now())

  useTitle(loading ? 'Loading' : 'Orders')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000)
    return () => window.clearInterval(timer)
  }, [])

  if (loading) {
    return <OrdersSkeleton />
  }

  return (
    <div className="page-wrap py-10 sm:py-14">
      <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">History</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Your orders</h1>
        <ButtonLink to="/#kitchens" variant="ghost">
          Browse kitchens
        </ButtonLink>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-[1.75rem] border border-dashed border-line bg-paper px-6 py-16 text-center">
          <p className="font-display text-3xl font-bold tracking-tight">No orders yet.</p>
          <p className="mt-2 text-sm text-muted">
            Place dinner once and it will live here with a live status timeline.
          </p>
          <div className="mt-6">
            <ButtonLink to="/">Start ordering</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <OrderSummaryCard key={order.id} order={order} now={now} />
          ))}
        </div>
      )}
    </div>
  )
}
