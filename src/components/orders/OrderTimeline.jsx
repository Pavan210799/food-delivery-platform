import { motion } from 'framer-motion'
import { currentStatus, ORDER_STATUSES, statusIndexAt } from '../../lib/orders'

export default function OrderTimeline({ order, now }) {
  const active = statusIndexAt(order.placedAt, now)
  const status = currentStatus(order, now)

  return (
    <div>
      <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-copper uppercase">Status</p>
      <h2 className="mt-1 font-display text-3xl font-bold tracking-tight">{status.label}</h2>
      <p className="mt-2 text-sm text-muted">{status.detail}</p>

      <ol className="relative mt-8 space-y-0">
        {ORDER_STATUSES.map((step, index) => {
          const done = index <= active
          const current = index === active
          return (
            <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
              {index < ORDER_STATUSES.length - 1 ? (
                <span
                  className={`absolute top-8 left-[11px] h-[calc(100%-1.25rem)] w-px ${
                    index < active ? 'bg-ink' : 'bg-line'
                  }`}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  done ? 'border-ink bg-ink text-cream' : 'border-line bg-paper'
                }`}
              >
                {current ? (
                  <motion.span
                    className="h-2 w-2 rounded-full bg-copper"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                  />
                ) : done ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-cream" />
                ) : null}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className={`font-semibold ${done ? 'text-ink' : 'text-muted'}`}>{step.label}</p>
                <p className="mt-1 text-sm text-muted">{step.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
