export function filterRestaurants(list, query, category) {
  const needle = query.trim().toLowerCase()

  return list.filter((restaurant) => {
    if (category !== 'all' && restaurant.cuisineId !== category) return false
    if (!needle) return true

    const haystack = [
      restaurant.name,
      restaurant.cuisine,
      restaurant.neighborhood,
      restaurant.blurb,
      ...restaurant.menu.map((item) => `${item.name} ${item.description}`),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(needle)
  })
}

export function sortRestaurants(list, sort) {
  const next = [...list]
  if (sort === 'rating') {
    next.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
  }
  if (sort === 'fastest') {
    next.sort((a, b) => a.etaMin - b.etaMin || b.rating - a.rating)
  }
  return next
}

export function serviceSnapshot(list) {
  const rating = list.reduce((sum, restaurant) => sum + restaurant.rating, 0) / list.length
  const eta = Math.round(list.reduce((sum, restaurant) => sum + restaurant.etaMin, 0) / list.length)
  return {
    kitchens: list.length,
    rating: rating.toFixed(1),
    eta,
  }
}
