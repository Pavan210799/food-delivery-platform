import { motion } from 'framer-motion'
import { useState } from 'react'
import { coupons } from '../../data/coupons'
import { useCart } from '../../context/CartContext'
import { money } from '../../lib/format'
import Photo from '../ui/Photo'

export default function CouponField({ celebrate = false }) {
  const { coupon, quote, applyCoupon, removeCoupon } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function onSubmit(event) {
    event.preventDefault()
    const result = applyCoupon(code)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    setCode('')
  }

  function pick(offerCode) {
    const result = applyCoupon(offerCode)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    setCode('')
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">Available offers</p>
        <ul className="mt-3 space-y-2">
          {coupons.map((offer) => {
            const active = coupon?.code === offer.code
            const meetsMin = quote.subtotal >= offer.minSubtotal
            const shortfall = Math.max(0, offer.minSubtotal - quote.subtotal)

            return (
              <li key={offer.code}>
                <motion.button
                  type="button"
                  onClick={() => (active ? removeCoupon() : pick(offer.code))}
                  aria-pressed={active}
                  animate={
                    active && celebrate
                      ? {
                          scale: [1, 1.045, 1],
                          boxShadow: [
                            '0 0 0 0 rgba(196,92,38,0)',
                            '0 0 0 8px rgba(196,92,38,0.22)',
                            '0 0 0 0 rgba(196,92,38,0)',
                          ],
                        }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`group flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition duration-150 ease-out ${
                    active
                      ? 'border-copper bg-copper/8 ring-1 ring-copper/30'
                      : 'border-line bg-cream hover:border-ink/25'
                  }`}
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Photo
                      src={offer.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-150 group-hover:scale-105"
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold tracking-[0.14em]">{offer.code}</span>
                      {active ? (
                        <motion.span
                          initial={celebrate ? { scale: 0.7, opacity: 0 } : false}
                          animate={{ scale: 1, opacity: 1 }}
                          className="rounded-full bg-copper px-2 py-0.5 text-[0.62rem] font-semibold tracking-wide text-paper uppercase"
                        >
                          Applied
                        </motion.span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink">{offer.label}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {meetsMin
                        ? `Min ${money(offer.minSubtotal)} · Ready to use`
                        : `Add ${money(shortfall)} more · min ${money(offer.minSubtotal)}`}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-copper">
                    {active ? 'Remove' : 'Apply'}
                  </span>
                </motion.button>
              </li>
            )
          })}
        </ul>
      </div>

      {coupon ? (
        <motion.div
          initial={celebrate ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-line bg-cream px-4 py-3"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold tracking-[0.14em]">{coupon.code}</p>
            <button type="button" onClick={removeCoupon} className="text-sm text-muted hover:text-ink">
              Remove
            </button>
          </div>
          <p
            className={`mt-1 text-sm font-semibold ${
              quote.couponStatus?.ok ? 'text-sage' : 'text-danger'
            }`}
          >
            {quote.couponStatus?.message}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit}>
          <p className="mb-2 text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">
            Or enter a code
          </p>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="coupon-code">
              Coupon code
            </label>
            <input
              id="coupon-code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase())
                if (error) setError('')
              }}
              placeholder="Coupon code"
              className="w-full rounded-full border border-line bg-paper px-4 py-3 text-base tracking-wide uppercase outline-none focus:border-ink"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full border border-line px-4 py-3 text-sm font-semibold hover:border-ink"
            >
              Apply
            </button>
          </div>
        </form>
      )}

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
