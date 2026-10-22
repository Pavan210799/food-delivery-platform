import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/categories'
import { restaurants as allRestaurants } from '../../data/restaurants'
import { useKitchenQuery } from '../../hooks/useKitchenQuery'
import { filterRestaurants, sortRestaurants } from '../../lib/filters'
import Photo from '../ui/Photo'
import Reveal from '../ui/Reveal'
import RestaurantCard from './RestaurantCard'

export default function RestaurantGrid({ embedded = false }) {
  const { category, sort, update } = useKitchenQuery()
  const [loading, setLoading] = useState(false)
  const [pendingCategory, setPendingCategory] = useState(null)

  const showFilters = embedded
  const activeCategory = showFilters ? (pendingCategory ?? category) : 'all'
  const appliedCategory = showFilters ? category : 'all'
  const appliedSort = showFilters ? sort : 'featured'

  const restaurants = useMemo(() => {
    return sortRestaurants(filterRestaurants(allRestaurants, '', appliedCategory), appliedSort)
  }, [appliedCategory, appliedSort])

  const activeLabel =
    appliedCategory === 'all' ? null : categories.find((item) => item.id === appliedCategory)?.label

  useEffect(() => {
    if (!showFilters || pendingCategory === null) return undefined
    const next = pendingCategory
    const timer = window.setTimeout(() => {
      update({ cat: next })
      setPendingCategory(null)
      setLoading(false)
    }, 800)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCategory, showFilters])

  function chooseCuisine(id) {
    const next = activeCategory === id ? 'all' : id
    if (next === category && pendingCategory === null) return
    setLoading(true)
    setPendingCategory(next)
    document.getElementById('kitchen-results')?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }

  return (
    <section
      id="kitchens"
      className={`page-wrap ${embedded ? 'pt-8 pb-14 sm:pb-16' : 'py-14 sm:py-16'}`}
      aria-labelledby={embedded ? undefined : 'kitchens-heading'}
    >
      {!embedded ? (
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Tonight</p>
              <h2 id="kitchens-heading" className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Kitchens
              </h2>
              <p className="mt-2 text-sm text-muted">Six rooms cooking tonight. Open one, or browse by cuisine.</p>
            </div>
            <Link to="/restaurants" className="text-sm font-semibold text-copper transition hover:text-copper-dark">
              Filter restaurants
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="flex justify-end">
          <SortSelect sort={sort} onChange={(value) => update({ sort: value })} />
        </div>
      )}

      {showFilters ? (
        <Reveal delay={0.05} className="mt-5">
          <div className="rounded-[1.75rem] border border-line bg-paper p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">
                Filter by cuisine
              </p>
              {activeCategory !== 'all' ? (
                <button
                  type="button"
                  onClick={() => chooseCuisine('all')}
                  className="text-sm font-semibold text-copper"
                >
                  Show all
                </button>
              ) : null}
            </div>

            <div
              className="mt-4 flex gap-3 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-1 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Cuisine filters"
            >
              {categories.map((item) => {
                const active = activeCategory === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseCuisine(item.id)}
                    aria-pressed={active}
                    disabled={loading}
                    className="group w-[6.5rem] shrink-0 text-left disabled:opacity-70 sm:w-auto"
                  >
                    <span
                      className={`block aspect-square overflow-hidden rounded-2xl bg-sand transition ${
                        active
                          ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper'
                          : 'ring-1 ring-transparent group-hover:ring-ink/20'
                      }`}
                    >
                      <Photo
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className={`mt-2.5 block text-sm font-semibold ${active ? 'text-copper' : 'text-ink'}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>
      ) : null}

      <div id="kitchen-results" className={`relative scroll-mt-28 ${showFilters ? 'mt-8' : 'mt-8'}`}>
        {showFilters ? (
          <p className="mb-5 font-display text-xl font-bold tracking-tight">
            {loading
              ? 'Loading kitchens…'
              : activeLabel
                ? `${restaurants.length} ${activeLabel} ${restaurants.length === 1 ? 'kitchen' : 'kitchens'}`
                : `${restaurants.length} kitchens`}
          </p>
        ) : null}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-line bg-paper"
              aria-busy="true"
              aria-live="polite"
            >
              <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <KitchenCardSkeleton key={index} />
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream/70 backdrop-blur-[2px]">
                <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-copper" />
                <p className="mt-4 text-sm font-semibold tracking-wide text-ink">Filtering kitchens…</p>
              </div>
            </motion.div>
          ) : restaurants.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-4xl border border-dashed border-line bg-paper px-6 py-16 text-center"
            >
              <p className="font-display text-3xl font-bold">No kitchens for that cuisine.</p>
              <button
                type="button"
                onClick={() => chooseCuisine('all')}
                className="mt-6 text-sm font-semibold text-copper"
              >
                Show all kitchens
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={appliedCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative grid gap-x-6 gap-y-10 overflow-x-clip sm:grid-cols-2 lg:grid-cols-3"
            >
              {restaurants.map((restaurant, index) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function SortSelect({ sort, onChange }) {
  return (
    <label className="text-sm text-muted">
      Sort
      <select
        value={sort}
        onChange={(event) => onChange(event.target.value)}
        className="ml-2 rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink"
      >
        <option value="featured">Featured</option>
        <option value="rating">Rating</option>
        <option value="fastest">Fastest</option>
      </select>
    </label>
  )
}

function KitchenCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[5/4] rounded-[1.5rem] bg-sand" />
      <div className="mt-4 space-y-2 px-1">
        <div className="h-5 w-2/3 rounded-full bg-line" />
        <div className="h-3 w-1/2 rounded-full bg-line" />
        <div className="h-3 w-full rounded-full bg-line" />
      </div>
    </div>
  )
}
