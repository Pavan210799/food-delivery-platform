import { motion } from 'framer-motion'
import { useState } from 'react'
import { coupons } from '../../data/coupons'
import Photo from '../ui/Photo'
import Reveal, { RevealStagger, revealItem } from '../ui/Reveal'

export default function Offers() {
  const [copied, setCopied] = useState('')

  async function copy(code) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
    } catch {
      setCopied('')
      return
    }
    window.setTimeout(() => setCopied(''), 1600)
  }

  return (
    <section id="offers" className="page-wrap py-4" aria-labelledby="offers-heading">
      <Reveal>
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">This week</p>
        <h2 id="offers-heading" className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Offers for the table
        </h2>
      </Reveal>

      <RevealStagger className="mt-8 grid gap-4 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <motion.article
            key={coupon.code}
            variants={revealItem}
            className="group relative min-h-[16rem] overflow-hidden rounded-4xl p-6 text-cream transition duration-150 ease-out hover:shadow-[0_18px_36px_-28px_rgba(22,19,17,0.4)] sm:p-7"
          >
            <Photo
              src={coupon.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-150 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/35" />
            <div className="relative flex h-full min-h-[13rem] flex-col">
              <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-cream/75 uppercase">
                {coupon.minSubtotal ? `From $${coupon.minSubtotal}` : 'Tonight'}
              </p>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">{coupon.label}</h3>
              <p className="mt-3 font-mono text-sm tracking-[0.18em] text-cream/90">{coupon.code}</p>
              <button
                type="button"
                onClick={() => copy(coupon.code)}
                className="mt-auto w-fit rounded-full bg-paper/15 px-4 py-2 text-sm font-semibold text-cream ring-1 ring-paper/30 transition hover:bg-paper/30"
              >
                {copied === coupon.code ? 'Copied' : 'Copy code'}
              </button>
            </div>
          </motion.article>
        ))}
      </RevealStagger>
    </section>
  )
}
