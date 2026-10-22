import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { count, money } from '../../lib/format'
import Badge from '../ui/Badge'
import { StarIcon } from '../ui/Icons'
import Photo from '../ui/Photo'

export default function RestaurantCard({ restaurant, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        to={`/restaurant/${restaurant.id}`}
        className="group relative block h-full rounded-[1.75rem] outline-none transition duration-150 ease-out hover:z-10"
      >
        <div className="h-full origin-center overflow-hidden rounded-[1.75rem] border border-line/70 bg-paper transition duration-150 ease-out group-hover:scale-[1.025] group-hover:border-ink/20 group-hover:shadow-[0_22px_40px_-24px_rgba(22,19,17,0.4)]">
          <div className="relative aspect-[5/4] overflow-hidden bg-sand">
            <Photo
              src={restaurant.image}
              alt={`${restaurant.name} dining room`}
              className="h-full w-full object-cover transition duration-150 ease-out group-hover:scale-[1.06]"
            />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-paper/92 px-2.5 py-1 text-xs font-semibold backdrop-blur">
              <StarIcon />
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="absolute top-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs text-cream backdrop-blur">
              {restaurant.etaLabel}
            </span>
          </div>
          <div className="px-4 pt-4 pb-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl font-bold tracking-tight transition duration-150 group-hover:text-copper">
                {restaurant.name}
              </h3>
              <span className="pt-1 text-sm text-muted">{restaurant.priceLevel}</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {restaurant.cuisine} · {restaurant.neighborhood}
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/80">{restaurant.blurb}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>{count(restaurant.reviews)} ratings</span>
              <span aria-hidden="true">·</span>
              <span>{restaurant.distance}</span>
              <span aria-hidden="true">·</span>
              <span>{money(restaurant.deliveryFee)} delivery</span>
            </div>
            {restaurant.offer ? (
              <div className="mt-3">
                <Badge tone="offer">{restaurant.offer}</Badge>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
