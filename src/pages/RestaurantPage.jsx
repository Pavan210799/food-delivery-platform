import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CustomizeDialog from '../components/menu/CustomizeDialog'
import MenuBoard from '../components/menu/MenuBoard'
import { ButtonLink } from '../components/ui/Button'
import { StarIcon } from '../components/ui/Icons'
import { RestaurantSkeleton } from '../components/ui/PageSkeletons'
import Photo from '../components/ui/Photo'
import { getRestaurant } from '../data/restaurants'
import { usePageSkeleton } from '../hooks/usePageSkeleton'
import { useTitle } from '../hooks/useTitle'
import { count, money } from '../lib/format'

export default function RestaurantPage() {
  const { id } = useParams()
  const restaurant = getRestaurant(id)
  const loading = usePageSkeleton(800)
  const [course, setCourse] = useState('All')
  const [diet, setDiet] = useState('all')
  const [active, setActive] = useState(null)
  const closeDialog = useCallback(() => setActive(null), [])

  useTitle(loading ? 'Loading' : restaurant?.name ?? 'Kitchen')

  useEffect(() => {
    setCourse('All')
    setDiet('all')
    setActive(null)
  }, [id])

  if (loading) {
    return <RestaurantSkeleton />
  }

  if (!restaurant) {
    return (
      <div className="page-wrap py-24">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Missing</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          That kitchen isn’t on tonight’s list.
        </h1>
        <div className="mt-8">
          <ButtonLink to="/">Back home</ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="page-wrap pt-6 sm:pt-8">
        <div className="relative h-64 overflow-hidden rounded-4xl bg-sand sm:h-[26rem]">
          <Photo
            src={restaurant.image}
            alt={`${restaurant.name} dining room`}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-6 max-w-3xl">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-copper uppercase">
            {restaurant.cuisine} · {restaurant.neighborhood}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {restaurant.name}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">{restaurant.story}</p>
        </div>
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-5 text-sm">
          <div className="inline-flex items-center gap-1.5 font-medium">
            <StarIcon />
            {restaurant.rating.toFixed(1)}
            <span className="font-normal text-muted">({count(restaurant.reviews)})</span>
          </div>
          <div>{restaurant.etaLabel}</div>
          <div>{money(restaurant.deliveryFee)} delivery</div>
          <div>{restaurant.priceLevel}</div>
          <div className="text-muted">{restaurant.address}</div>
          {restaurant.offer ? <div className="text-copper">{restaurant.offer}</div> : null}
        </dl>
      </section>

      <div className="mt-8">
        <MenuBoard
          menu={restaurant.menu}
          course={course}
          diet={diet}
          onCourse={setCourse}
          onDiet={setDiet}
          onSelect={setActive}
        />
      </div>

      <CustomizeDialog restaurant={restaurant} item={active} onClose={closeDialog} />
    </>
  )
}
