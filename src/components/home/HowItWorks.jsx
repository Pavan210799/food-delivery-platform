import { motion } from 'framer-motion'
import Reveal, { RevealStagger, revealItem } from '../ui/Reveal'

const steps = [
  {
    n: '01',
    title: 'Pick a kitchen',
    copy: 'Browse Restaurants, filter by cuisine, or search by dish name up top.',
  },
  {
    n: '02',
    title: 'Build the plate',
    copy: 'Customize heat, sides, and notes. Quantities stay exact in your cart.',
  },
  {
    n: '03',
    title: 'Track the ride',
    copy: 'Checkout in a minute, then follow the order from kitchen to door.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="page-wrap py-14 sm:py-16" aria-labelledby="how-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">How it works</p>
        <h2 id="how-heading" className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Three steps to dinner
        </h2>
      </Reveal>

      <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <motion.article
            key={step.n}
            variants={revealItem}
            className="rounded-[1.75rem] border border-line bg-paper p-6 text-center transition duration-300 ease-out hover:border-ink/20 hover:shadow-[0_16px_32px_-28px_rgba(22,19,17,0.35)] sm:p-7"
          >
            <p className="font-display text-sm font-bold tracking-[0.2em] text-copper">{step.n}</p>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{step.copy}</p>
          </motion.article>
        ))}
      </RevealStagger>
    </section>
  )
}
