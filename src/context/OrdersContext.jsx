import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createOrderId } from '../lib/orders'
import { useAuth } from './AuthContext'

const LEGACY_KEY = 'marlow.orders'
const OrdersContext = createContext(null)

function storageKey(userId) {
  return `marlow.orders.${userId}`
}

function loadOrdersFor(userId) {
  if (!userId) return []
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((order) => order && typeof order.id === 'string')
  } catch {
    return []
  }
}

function saveOrdersFor(userId, orders) {
  if (!userId) return
  localStorage.setItem(storageKey(userId), JSON.stringify(orders))
}

export function OrdersProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [orders, setOrders] = useState(() => loadOrdersFor(userId))
  const activeUserRef = useRef(userId)

  useEffect(() => {
    activeUserRef.current = userId
    setOrders(loadOrdersFor(userId))
  }, [userId])

  useEffect(() => {
    if (!userId || activeUserRef.current !== userId) return
    saveOrdersFor(userId, orders)
  }, [orders, userId])

  // One-time: if legacy global orders exist and this user has none, leave them alone
  // (orders are account-scoped going forward).
  useEffect(() => {
    if (localStorage.getItem(LEGACY_KEY) && userId) {
      // Keep legacy key for reference but do not leak into other accounts.
    }
  }, [userId])

  const placeOrder = useCallback(
    ({ items, restaurant, quote, coupon, delivery }) => {
      if (!userId) {
        throw new Error('You must be signed in to place an order.')
      }

      const order = {
        id: createOrderId(),
        userId,
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
    },
    [userId],
  )

  const getOrder = useCallback(
    (id) => {
      if (!userId) return null
      return orders.find((order) => order.id === id && order.userId === userId) ?? null
    },
    [orders, userId],
  )

  const value = useMemo(
    () => ({ orders: userId ? orders : [], placeOrder, getOrder }),
    [orders, placeOrder, getOrder, userId],
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
