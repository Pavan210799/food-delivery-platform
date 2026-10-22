const MAX_QTY = 12

export function lineKey(item) {
  const options = item.selections
    .map((selection) => `${selection.groupId}:${selection.optionId}`)
    .sort()
    .join('|')
  return `${item.itemId}::${options}::${(item.note || '').trim().toLowerCase()}`
}

export function addLine(items, payload) {
  const lineId = lineKey(payload)
  const existing = items.find((item) => item.lineId === lineId)

  if (existing) {
    return items.map((item) =>
      item.lineId === lineId
        ? { ...item, quantity: Math.min(MAX_QTY, item.quantity + payload.quantity) }
        : item,
    )
  }

  return [
    ...items,
    {
      lineId,
      restaurantId: payload.restaurantId,
      itemId: payload.itemId,
      name: payload.name,
      image: payload.image,
      basePrice: payload.basePrice,
      quantity: Math.min(MAX_QTY, payload.quantity),
      selections: payload.selections,
      note: payload.note?.trim() ?? '',
    },
  ]
}

export function selectionLabel(item) {
  const parts = item.selections.map((selection) => selection.optionName).filter(Boolean)
  if (item.note) parts.push(item.note)
  return parts.join(' · ')
}

export function isLine(item) {
  return Boolean(
    item &&
      typeof item.lineId === 'string' &&
      typeof item.itemId === 'string' &&
      typeof item.name === 'string' &&
      typeof item.basePrice === 'number' &&
      typeof item.quantity === 'number' &&
      Array.isArray(item.selections),
  )
}
