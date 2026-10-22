import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { money } from '../../lib/format'
import CouponField from './CouponField'

const CONFETTI_COLORS = ['#c45c26', '#5f7a5a', '#e8b86d', '#161311', '#f4ebe0', '#d97757']

function buildConfetti(seed = 0, count = 48) {
  return Array.from({ length: count }, (_, index) => {
    const jitter = ((seed * 17 + index * 13) % 11) - 5
    const angle = (Math.PI * 2 * index) / count + jitter * 0.04
    const distance = 80 + (index % 7) * 30 + Math.abs(jitter) * 6
    return {
      id: `${seed}-${index}`,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      left: 40 + (index % 11) * 2 + jitter * 0.3,
      top: 36 + (index % 5) * 3,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.55 - 50 - (index % 6) * 20,
      rotate: (index % 2 === 0 ? 1 : -1) * (220 + (index % 8) * 50),
      w: index % 4 === 0 ? 11 : 7,
      h: index % 3 === 0 ? 4 : index % 5 === 0 ? 11 : 6,
      round: index % 6 === 0,
      delay: (index % 12) * 0.016,
      duration: 1.4 + (index % 5) * 0.14,
    }
  })
}

export default function Bill({ quote, restaurantName, children }) {
  const { coupon } = useCart()
  const [pricingBusy, setPricingBusy] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const prevCoupon = useRef(coupon?.code ?? null)
  const pieces = useMemo(() => buildConfetti(burstKey), [burstKey])

  useEffect(() => {
    const next = coupon?.code ?? null
    if (prevCoupon.current === next) return undefined

    const applied = Boolean(next)
    const qualifies = applied && Boolean(quote.couponStatus?.ok)
    prevCoupon.current = next
    setPricingBusy(true)
    setCelebrate(false)

    const timer = window.setTimeout(() => {
      setPricingBusy(false)
      if (qualifies) {
        setBurstKey((key) => key + 1)
        setCelebrate(true)
        window.setTimeout(() => setCelebrate(false), 2600)
      }
    }, 500)

    return () => window.clearTimeout(timer)
  }, [coupon?.code, quote.couponStatus?.ok])

  return (
    <aside className="relative h-fit overflow-hidden rounded-4xl border border-line bg-paper p-6 lg:sticky lg:top-24">
      <AnimatePresence>
        {celebrate ? (
          <motion.div
            key={`coupon-burst-${burstKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-copper/25 via-cream/40 to-sage/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.45, 0] }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute left-1/2 top-[38%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper/30 blur-2xl"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 1.8, 2.2], opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            {pieces.map((piece) => (
              <motion.span
                key={piece.id}
                className="absolute"
                style={{
                  left: `${piece.left}%`,
                  top: `${piece.top}%`,
                  width: piece.w,
                  height: piece.h,
                  backgroundColor: piece.color,
                  borderRadius: piece.round ? 999 : 2,
                }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: piece.x,
                  y: [0, piece.y, piece.y + 90 + (piece.id % 4) * 20],
                  scale: [0.4, 1.15, 1, 0.7],
                  rotate: piece.rotate,
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">The bill</p>
      <h2 className="mt-1 font-display text-3xl tracking-tight">{restaurantName || 'Your order'}</h2>
      <div className="mt-5">
        <CouponField celebrate={celebrate} />
      </div>

      <div className="mt-5" aria-busy={pricingBusy} aria-live="polite">
        {pricingBusy ? (
          <PricingSkeleton />
        ) : (
          <motion.dl
            key={coupon?.code ?? 'none'}
            initial={celebrate ? { opacity: 0.4, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2.5"
          >
            <Row label="Subtotal" value={money(quote.subtotal)} />
            {quote.discount > 0 ? (
              <motion.div
                initial={celebrate ? { scale: 0.96, backgroundColor: 'rgba(196,92,38,0.18)' } : false}
                animate={{ scale: 1, backgroundColor: 'rgba(196,92,38,0)' }}
                transition={{ duration: 0.9 }}
                className="-mx-2 rounded-xl px-2 py-1"
              >
                <Row label="Discount" value={`−${money(quote.discount)}`} tone="text-sage" />
              </motion.div>
            ) : null}
            <Row
              label="Delivery"
              value={quote.delivery === 0 ? 'Free' : money(quote.delivery)}
              tone={quote.delivery === 0 && celebrate ? 'text-sage' : ''}
            />
            <Row label="Service 5%" value={money(quote.serviceFee)} />
            <Row label="Tax" value={money(quote.tax)} />
            <motion.div
              className="flex items-baseline justify-between gap-4 border-t border-line pt-3"
              initial={celebrate ? { color: '#c45c26', scale: 1.04 } : false}
              animate={{ color: '#161311', scale: 1 }}
              transition={{ duration: 0.85 }}
            >
              <dt className="font-display text-2xl">Total</dt>
              <dd className="font-display text-2xl tabular-nums">{money(quote.total)}</dd>
            </motion.div>
          </motion.dl>
        )}
      </div>

      <AnimatePresence mode="wait">
        {celebrate ? (
          <motion.p
            key="applied"
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="relative z-10 mt-3 text-center font-display text-lg text-copper"
          >
            Coupon applied!
          </motion.p>
        ) : (
          <motion.p
            key="tax"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-xs leading-5 text-muted"
          >
            Tax is estimated at 8.875%. Service is 5% of the food.
          </motion.p>
        )}
      </AnimatePresence>
      {children}
    </aside>
  )
}

function Row({ label, value, tone = '' }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className={`tabular-nums ${tone}`}>{value}</dd>
    </div>
  )
}

function PricingSkeleton() {
  return (
    <div className="space-y-3" aria-label="Updating prices">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <div className="h-3 w-20 animate-pulse rounded-full bg-line" />
          <div className="h-3 w-14 animate-pulse rounded-full bg-line" />
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
        <div className="h-6 w-16 animate-pulse rounded-full bg-line" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-line" />
      </div>
      <p className="pt-1 text-center text-[0.65rem] font-semibold tracking-[0.16em] text-muted uppercase">
        Updating total
      </p>
    </div>
  )
}
