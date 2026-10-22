import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createOrderId } from '../lib/orders'

const STORAGE_KEY = 'marlow.orders'
const OrdersContext = createContext(null)

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((order) => order && typeof order.id === 'string')
  } catch {
    return []
  }
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const placeOrder = useCallback(({ items, restaurant, quote, coupon, delivery }) => {
    const order = {
      id: createOrderId(),
      placedAt: Date.now(),
      restaurantId: restaurant?.id ?? null,
      restaurantName: restaurant?.name ?? 'Kitchen',
      restaurantImage: restaurant?.image ?? items[0]?.image ?? '',
      deliveryFee: restaurant?.deliveryFee ?? 0,
      items: items.map((item) => ({
        lineId: item.lineId,
        itemId: item.itemId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        selections: item.selections,
        note: item.note,
        basePrice: item.basePrice,
      })),
      quote: {
        subtotal: quote.subtotal,
        discount: quote.discount,
        delivery: quote.delivery,
        serviceFee: quote.serviceFee,
        tax: quote.tax,
        total: quote.total,
      },
      couponCode: coupon?.code ?? null,
      delivery: {
        name: delivery.name.trim(),
        phone: delivery.phone.trim(),
        address: delivery.address.trim(),
      },
    }

    setOrders((prev) => [order, ...prev])
    return order
  }, [])

  const getOrder = useCallback(
    (id) => orders.find((order) => order.id === id) ?? null,
    [orders],
  )

  const value = useMemo(
    () => ({ orders, placeOrder, getOrder }),
    [orders, placeOrder, getOrder],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider')
  }
  return context
}
