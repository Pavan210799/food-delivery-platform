import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroFrames, restaurants } from '../../data/restaurants'
import { serviceSnapshot } from '../../lib/filters'
import Button from '../ui/Button'
import Photo from '../ui/Photo'

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Hero() {
  const snapshot = serviceSnapshot(restaurants)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % heroFrames.length)
    }, 4800)
    return () => window.clearInterval(id)
  }, [])

  const frame = heroFrames[active]

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={frame.restaurantId}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Photo
              src={frame.image}
              alt=""
              priority
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(196,92,38,0.28),transparent_42%)]" />
      </div>

      <div className="page-wrap flex min-h-[min(92vh,52rem)] flex-col justify-end pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-4xl text-cream"
        >
          <motion.p
            variants={fade}
            className="text-[0.72rem] font-semibold tracking-[0.24em] text-copper uppercase"
          >
            Evening service · Open until midnight
          </motion.p>
          <motion.h1
            variants={fade}
            className="mt-4 font-display text-[2.35rem] leading-[0.95] font-bold text-balance min-[400px]:text-[2.85rem] sm:text-6xl lg:text-[5.4rem]"
          >
            Dinner from the city’s best rooms,
            <span className="block text-copper">at your door.</span>
          </motion.h1>
          <motion.p variants={fade} className="mt-5 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            Browse six kitchens, customize every dish, and track the bag from the pass to the hallway.
          </motion.p>

          <motion.div variants={fade} className="mt-7">
            <Button
              variant="copper"
              className="px-6"
              onClick={() => document.getElementById('kitchens')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore kitchens
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-10 grid gap-5 border-t border-cream/15 pt-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-end lg:gap-8"
        >
          <dl className="grid grid-cols-3 gap-3 text-cream">
            <Stat value={String(snapshot.kitchens)} label="Kitchens" />
            <Stat value={`${snapshot.eta}m`} label="Avg ride" />
            <Stat value={snapshot.rating} label="Rating" />
          </dl>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 lg:justify-end">
            <Link
              to={`/restaurant/${frame.restaurantId}`}
              className="group min-w-0 flex-1 text-cream lg:max-w-md lg:text-right"
            >
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-cream/65 uppercase">
                Now featuring
              </p>
              <p className="mt-1 truncate font-display text-xl font-semibold group-hover:text-copper sm:text-2xl">
                {frame.kicker} · {frame.title}
              </p>
            </Link>
            <div
              className="flex shrink-0 items-center gap-1.5 self-start sm:self-auto sm:gap-2"
              aria-label="Featured slides"
            >
              {heroFrames.map((item, index) => (
                <button
                  key={item.restaurantId}
                  type="button"
                  aria-label={`Show ${item.kicker}`}
                  aria-current={index === active ? true : undefined}
                  onClick={() => setActive(index)}
                  className={`h-2 shrink-0 rounded-full transition-all sm:h-2.5 ${
                    index === active
                      ? 'w-6 bg-copper sm:w-8'
                      : 'w-2 bg-cream/35 hover:bg-cream/60 sm:w-2.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ value, label }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-[0.58rem] font-semibold tracking-[0.14em] text-cream/55 uppercase sm:text-[0.62rem] sm:tracking-[0.16em]">
        {label}
      </dt>
      <dd className="mt-1 font-display text-xl font-bold tracking-tight sm:text-3xl">{value}</dd>
    </div>
  )
}
