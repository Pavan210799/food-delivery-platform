import { motion } from 'framer-motion'
import Reveal, { RevealStagger, revealItem } from '../ui/Reveal'

const points = [
  {
    title: 'One kitchen per cart',
    copy: 'Orders stay coherent. Switch rooms only when you mean to.',
  },
  {
    title: 'Real customization',
    copy: 'Temps, sauces, heat, and kitchen notes travel with every line.',
  },
  {
    title: 'Live order timeline',
    copy: 'From confirmation to delivery, the status updates as dinner moves.',
  },
  {
    title: 'Coupons that compute',
    copy: 'Discounts, free delivery, and tax stay clear on the bill.',
  },
]

export default function WhyMarlow() {
  return (
    <section id="why" className="page-wrap py-10 sm:py-16" aria-labelledby="why-heading">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-cream sm:px-10 sm:py-14 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Why Marlow</p>
              <h2 id="why-heading" className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Built for the way people actually order dinner.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-cream/70 sm:text-base">
                A quieter interface, sharper menus, and a checkout that asks only what the courier needs.
              </p>
            </div>
            <RevealStagger className="grid gap-4 sm:grid-cols-2">
              {points.map((point) => (
                <motion.article
                  key={point.title}
                  variants={revealItem}
                  className="rounded-3xl border border-cream/10 bg-cream/5 p-5 transition duration-300 ease-out hover:bg-cream/10"
                >
                  <h3 className="font-display text-xl font-bold tracking-tight">{point.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-cream/65">{point.copy}</p>
                </motion.article>
              ))}
            </RevealStagger>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
