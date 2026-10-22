import RestaurantGrid from '../components/home/RestaurantGrid'
import { RestaurantsSkeleton } from '../components/ui/PageSkeletons'
import { usePageSkeleton } from '../hooks/usePageSkeleton'
import { useTitle } from '../hooks/useTitle'

export default function RestaurantsPage() {
  const loading = usePageSkeleton(800)
  useTitle(loading ? 'Loading' : 'Restaurants')

  if (loading) {
    return <RestaurantsSkeleton />
  }

  return (
    <div className="pb-6">
      <div className="page-wrap pt-10 sm:pt-12">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Browse</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Restaurants</h1>
        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
          All six kitchens on Marlow. Filter by cuisine, sort by rating or speed, then open a menu.
        </p>
      </div>
      <RestaurantGrid embedded />
    </div>
  )
}
