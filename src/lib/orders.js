export const ORDER_STATUSES = [
  {
    id: 'placed',
    label: 'Order placed',
    detail: 'We received your order.',
    afterMin: 0,
  },
  {
    id: 'confirmed',
    label: 'Kitchen confirmed',
    detail: 'The kitchen accepted your ticket.',
    afterMin: 2,
  },
  {
    id: 'preparing',
    label: 'Preparing',
    detail: 'Your food is on the pass.',
    afterMin: 8,
  },
  {
    id: 'on_the_way',
    label: 'On the way',
    detail: 'A courier picked up your bag.',
    afterMin: 18,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    detail: 'Enjoy dinner.',
    afterMin: 32,
  },
]

export function statusIndexAt(placedAt, now = Date.now()) {
  const minutes = Math.max(0, (now - placedAt) / 60000)
  let index = 0
  for (let i = 0; i < ORDER_STATUSES.length; i += 1) {
    if (minutes >= ORDER_STATUSES[i].afterMin) index = i
  }
  return index
}

export function currentStatus(order, now = Date.now()) {
  return ORDER_STATUSES[statusIndexAt(order.placedAt, now)]
}

export function etaLabel(order, now = Date.now()) {
  const deliveredAt = order.placedAt + ORDER_STATUSES.at(-1).afterMin * 60000
  if (now >= deliveredAt) return 'Delivered'
  const minutes = Math.max(1, Math.ceil((deliveredAt - now) / 60000))
  return `~${minutes} min left`
}

export function createOrderId() {
  return `ML-${Date.now().toString(36).toUpperCase()}`
}
