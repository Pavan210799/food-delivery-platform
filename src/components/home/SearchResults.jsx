import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { restaurants as allRestaurants } from '../../data/restaurants'
import { useKitchenQuery } from '../../hooks/useKitchenQuery'
import { filterRestaurants, sortRestaurants } from '../../lib/filters'
import { money } from '../../lib/format'
import Button from '../ui/Button'
import Photo from '../ui/Photo'
import RestaurantCard from './RestaurantCard'

export default function SearchResults() {
  const { query, sort, update, clearSearch } = useKitchenQuery()
  const needle = query.trim()

  const kitchens = useMemo(
    () => sortRestaurants(filterRestaurants(allRestaurants, needle, 'all'), sort),
    [needle, sort],
  )

  const dishes = useMemo(() => {
    const lower = needle.toLowerCase()
    return allRestaurants.flatMap((restaurant) =>
      restaurant.menu
        .filter((item) => {
          const hay = `${item.name} ${item.description} ${item.category} ${restaurant.name} ${restaurant.cuisine}`.toLowerCase()
          return hay.includes(lower)
        })
        .map((item) => ({
          ...item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        })),
    )
  }, [needle])

  return (
    <div className="page-wrap py-10 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Search</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Results for “{needle}”
          </h1>
          <p className="mt-2 text-sm text-muted">
            {kitchens.length} {kitchens.length === 1 ? 'kitchen' : 'kitchens'}
            {dishes.length ? ` · ${dishes.length} matching dishes` : ''}
          </p>
        </div>
        <Button variant="ghost" onClick={clearSearch}>
          Clear search
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted">
          Sort kitchens
          <select
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
            className="ml-2 rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink"
          >
            <option value="featured">Featured</option>
            <option value="rating">Rating</option>
            <option value="fastest">Fastest</option>
          </select>
        </label>
      </div>

      {kitchens.length === 0 && dishes.length === 0 ? (
        <div className="mt-10 rounded-[1.75rem] border border-dashed border-line bg-paper px-6 py-16 text-center">
          <p className="font-display text-3xl font-bold">No matches</p>
          <p className="mt-2 text-sm text-muted">Try another dish or kitchen name.</p>
          <button type="button" onClick={clearSearch} className="mt-6 text-sm font-semibold text-copper">
            Back to home
          </button>
        </div>
      ) : (
        <>
          {kitchens.length > 0 ? (
            <section className="mt-10" aria-labelledby="search-kitchens">
              <h2 id="search-kitchens" className="font-display text-2xl font-bold tracking-tight">
                Kitchens
              </h2>
              <div className="mt-6 grid gap-x-6 gap-y-10 overflow-x-clip sm:grid-cols-2 lg:grid-cols-3">
                {kitchens.map((restaurant, index) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
                ))}
              </div>
            </section>
          ) : null}

          {dishes.length > 0 ? (
            <section className="mt-14" aria-labelledby="search-dishes">
              <h2 id="search-dishes" className="font-display text-2xl font-bold tracking-tight">
                Dishes
              </h2>
              <div className="mt-6 grid gap-4 overflow-x-clip sm:grid-cols-2 lg:grid-cols-3">
                {dishes.map((dish) => (
                  <Link
                    key={`${dish.restaurantId}-${dish.id}`}
                    to={`/restaurant/${dish.restaurantId}`}
                    className="group flex min-w-0 origin-center items-center gap-3 rounded-[1.5rem] border border-line bg-paper p-3 transition duration-150 ease-out hover:z-10 hover:scale-[1.02] hover:border-ink/20 hover:shadow-[0_18px_36px_-24px_rgba(22,19,17,0.35)] sm:gap-4"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
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
                      <h3 className="mt-1 font-display text-xl font-bold group-hover:text-copper">{dish.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">{dish.description}</p>
                      <p className="mt-3 text-sm font-semibold tabular-nums">{money(dish.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
