import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderTimeline from '../components/orders/OrderTimeline'
import { ButtonLink } from '../components/ui/Button'
import Photo from '../components/ui/Photo'
import { useOrders } from '../context/OrdersContext'
import { useTitle } from '../hooks/useTitle'
import { money } from '../lib/format'
import { selectionLabel } from '../lib/lines'
import { unitPrice } from '../lib/pricing'
import { etaLabel } from '../lib/orders'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const { getOrder } = useOrders()
  const order = getOrder(id)
  const [now, setNow] = useState(() => Date.now())

  useTitle(order ? `Order ${order.id}` : 'Order')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000)
    return () => window.clearInterval(timer)
  }, [])

  if (!order) {
    return (
      <div className="page-wrap py-20 sm:py-28">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Missing</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          We couldn’t find that order.
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/orders">Order history</ButtonLink>
          <ButtonLink to="/" variant="ghost">
            Home
          </ButtonLink>
        </div>
      </div>
    )
  }

  const placed = new Date(order.placedAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="page-wrap py-10 sm:py-14">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Order confirmation</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">The kitchen has it.</h1>
            <p className="mt-3 text-lg">
              {order.id}
              <span className="text-muted"> · {money(order.quote.total)} · {etaLabel(order, now)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink to="/orders" variant="ghost">
              All orders
            </ButtonLink>
            <ButtonLink to="/">Order again</ButtonLink>
          </div>
        </div>
      </motion.div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-7">
          <OrderTimeline order={order} now={now} />
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-7">
            <div className="flex gap-4">
              <Photo
                src={order.restaurantImage}
                alt=""
                className="h-20 w-20 shrink-0 rounded-[1.1rem] object-cover"
              />
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted uppercase">From</p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">{order.restaurantName}</h2>
                <p className="mt-1 text-sm text-muted">Placed {placed}</p>
                {order.restaurantId ? (
                  <Link to={`/restaurant/${order.restaurantId}`} className="mt-2 inline-block text-sm font-semibold text-copper">
                    View menu
                  </Link>
                ) : null}
              </div>
            </div>

            <ul className="mt-6 space-y-4 border-t border-line pt-5">
              {order.items.map((item) => {
                const label = selectionLabel(item)
                const each = unitPrice(item)
                return (
                  <li key={item.lineId} className="flex gap-3">
                    <Photo src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="font-semibold">
                          {item.quantity}× {item.name}
                        </p>
                        <p className="shrink-0 text-sm tabular-nums">{money(each * item.quantity)}</p>
                      </div>
                      {label ? <p className="mt-1 text-sm text-muted">{label}</p> : null}
                    </div>
                  </li>
                )
              })}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <Row label="Subtotal" value={money(order.quote.subtotal)} />
              {order.quote.discount > 0 ? (
                <Row label="Discount" value={`−${money(order.quote.discount)}`} />
              ) : null}
              <Row label="Delivery" value={order.quote.delivery === 0 ? 'Free' : money(order.quote.delivery)} />
              <Row label="Service" value={money(order.quote.serviceFee)} />
              <Row label="Tax" value={money(order.quote.tax)} />
              <div className="flex justify-between border-t border-line pt-3 font-display text-xl font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{money(order.quote.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-7">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">Delivering to</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight">{order.delivery.name}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{order.delivery.address}</p>
            <p className="mt-1 text-sm text-muted">{order.delivery.phone}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
