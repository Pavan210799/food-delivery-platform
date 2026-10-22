import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { money } from '../../lib/format'
import { currentStatus, etaLabel } from '../../lib/orders'
import Photo from '../ui/Photo'

export default function OrderSummaryCard({ order, now }) {
  const status = currentStatus(order, now)
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/orders/${order.id}`}
        className="group flex origin-center gap-3 rounded-[1.5rem] border border-line bg-paper p-3 transition duration-150 ease-out hover:z-10 hover:scale-[1.02] hover:border-ink/20 hover:shadow-[0_18px_36px_-24px_rgba(22,19,17,0.35)] sm:gap-4 sm:p-4"
      >
        <div className="shrink-0 overflow-hidden rounded-[1.1rem]">
          <Photo
            src={order.restaurantImage}
            alt=""
            className="h-20 w-20 object-cover transition duration-150 ease-out group-hover:scale-[1.08] sm:h-24 sm:w-24"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[0.65rem] font-semibold tracking-[0.14em] text-muted uppercase">
                {order.id}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold tracking-tight transition group-hover:text-copper sm:text-xl">
                {order.restaurantName}
              </h3>
            </div>
            <p className="text-sm font-semibold tabular-nums">{money(order.quote.total)}</p>
          </div>
          <p className="mt-2 text-sm text-muted">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · {status.label}
          </p>
          <p className="mt-1 text-sm font-medium text-copper">{etaLabel(order, now)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
