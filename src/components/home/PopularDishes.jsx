import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { restaurants } from '../../data/restaurants'
import { money } from '../../lib/format'
import Photo from '../ui/Photo'
import Reveal, { RevealStagger, revealItem } from '../ui/Reveal'

const dishes = restaurants
  .flatMap((restaurant) =>
    restaurant.menu
      .filter((item) => item.popular)
      .map((item) => ({
        ...item,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      })),
  )
  .slice(0, 6)

export default function PopularDishes() {
  return (
    <section id="popular" className="page-wrap py-10 sm:py-14" aria-labelledby="popular-heading">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Popular tonight</p>
            <h2 id="popular-heading" className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Dishes people reorder
            </h2>
          </div>
          <button
            type="button"
            onClick={() => document.getElementById('kitchens')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-semibold text-copper transition hover:text-copper-dark"
          >
            Browse kitchens
          </button>
        </div>
      </Reveal>

      <RevealStagger className="mt-8 grid gap-4 overflow-x-clip sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
        {dishes.map((dish) => (
          <motion.div key={`${dish.restaurantId}-${dish.id}`} variants={revealItem} className="min-w-0">
            <Link
              to={`/restaurant/${dish.restaurantId}`}
              className="group flex h-full origin-center items-center gap-3 rounded-[1.5rem] border border-line bg-paper p-3 transition duration-150 ease-out hover:z-10 hover:scale-[1.02] hover:border-ink/20 hover:shadow-[0_18px_36px_-24px_rgba(22,19,17,0.35)] sm:gap-4"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
                <Photo
                  src={dish.image}
                  alt=""
                  className="h-full w-full rounded-2xl object-cover transition duration-150 ease-out group-hover:scale-[1.08]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted uppercase">
                  {dish.restaurantName}
                </p>
                <h3 className="mt-1 font-display text-xl leading-tight font-bold transition group-hover:text-copper">
                  {dish.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted">{dish.description}</p>
                <p className="mt-3 text-sm font-semibold tabular-nums">{money(dish.price)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </RevealStagger>
    </section>
  )
}
