import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import Offers from '../components/home/Offers'
import PopularDishes from '../components/home/PopularDishes'
import RestaurantGrid from '../components/home/RestaurantGrid'
import SearchResults from '../components/home/SearchResults'
import WhyMarlow from '../components/home/WhyMarlow'
import { HomeSkeleton } from '../components/ui/PageSkeletons'
import { useKitchenQuery } from '../hooks/useKitchenQuery'
import { usePageSkeleton } from '../hooks/usePageSkeleton'
import { useTitle } from '../hooks/useTitle'

export default function HomePage() {
  const { searching, query } = useKitchenQuery()
  const loading = usePageSkeleton(850)
  useTitle(searching ? `Search · ${query.trim()}` : loading ? 'Loading' : '')

  if (loading && !searching) {
    return <HomeSkeleton />
  }

  if (searching) {
    return <SearchResults />
  }

  return (
    <>
      <Hero />
      <HowItWorks />
      <RestaurantGrid />
      <PopularDishes />
      <Offers />
      <WhyMarlow />
    </>
  )
}
