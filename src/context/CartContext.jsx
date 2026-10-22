import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getRestaurant } from '../data/restaurants'
import { isLine, addLine } from '../lib/lines'
import { findCoupon, quoteOrder, subtotalOf } from '../lib/pricing'
import { money } from '../lib/format'

const STORAGE_KEY = 'marlow.cart'

const CartContext = createContext(null)

function emptyCart() {
  return {
    restaurantId: null,
    items: [],
    couponCode: null,
    pending: null,
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyCart()
    const parsed = JSON.parse(raw)
    const items = Array.isArray(parsed?.items)
      ? parsed.items.filter(isLine).map((item) => ({
          ...item,
          quantity: Math.min(12, Math.max(1, item.quantity)),
          note: typeof item.note === 'string' ? item.note : '',
          selections: item.selections.filter(
            (selection) => selection && typeof selection.optionName === 'string',
          ),
        }))
      : []
    return {
      restaurantId: items.length ? (parsed.restaurantId ?? null) : null,
      items,
      couponCode: typeof parsed?.couponCode === 'string' ? parsed.couponCode : null,
      pending: null,
    }
  } catch {
    return emptyCart()
  }
}

function applyAdd(cart, payload) {
  return {
    restaurantId: payload.restaurantId,
    items: addLine(cart.items, payload),
    couponCode: cart.couponCode,
    pending: null,
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)
  const cartRef = useRef(cart)

  useEffect(() => {
    cartRef.current = cart
  }, [cart])

  useEffect(() => {
    const { restaurantId, items, couponCode } = cart
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ restaurantId, items, couponCode }),
    )
  }, [cart])

  const restaurant = cart.restaurantId ? getRestaurant(cart.restaurantId) : null
  const coupon = findCoupon(cart.couponCode)
  const quote = useMemo(
    () =>
      quoteOrder({
        items: cart.items,
        coupon,
        deliveryFee: restaurant?.deliveryFee ?? 0,
      }),
    [cart.items, coupon, restaurant],
  )

  const addItem = useCallback((payload) => {
    const current = cartRef.current
    const conflict =
      current.items.length > 0 &&
      current.restaurantId &&
      current.restaurantId !== payload.restaurantId

    if (conflict) {
      setCart((prev) => ({ ...prev, pending: payload }))
      return 'conflict'
    }

    setCart((prev) => applyAdd(prev, payload))
    return 'added'
  }, [])

  const confirmSwitch = useCallback(() => {
    setCart((prev) => {
      if (!prev.pending) return prev
      const next = applyAdd(
        { restaurantId: null, items: [], couponCode: null, pending: null },
        prev.pending,
      )
      return next
    })
  }, [])

  const cancelSwitch = useCallback(() => {
    setCart((prev) => ({ ...prev, pending: null }))
  }, [])

  const setQuantity = useCallback((lineId, quantity) => {
    setCart((prev) => {
      const items = prev.items.flatMap((item) => {
        if (item.lineId !== lineId) return [item]
        if (quantity < 1) return []
        return [{ ...item, quantity: Math.min(12, quantity) }]
      })
      return {
        ...prev,
        items,
        restaurantId: items.length ? prev.restaurantId : null,
        couponCode: items.length ? prev.couponCode : null,
      }
    })
  }, [])

  const removeItem = useCallback((lineId) => {
    setQuantity(lineId, 0)
  }, [setQuantity])

  const clearCart = useCallback(() => {
    setCart(emptyCart())
  }, [])

  const applyCoupon = useCallback((raw) => {
    const found = findCoupon(raw)
    if (!found) {
      return { ok: false, message: 'That code isn’t recognized.' }
    }
    setCart((prev) => ({ ...prev, couponCode: found.code }))
    const subtotal = subtotalOf(cartRef.current.items)
    if (subtotal < found.minSubtotal) {
      return {
        ok: true,
        pending: true,
        message: `Add ${money(found.minSubtotal - subtotal)} more to use ${found.code}.`,
      }
    }
    return { ok: true, message: found.label }
  }, [])

  const removeCoupon = useCallback(() => {
    setCart((prev) => ({ ...prev, couponCode: null }))
  }, [])

  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  const value = useMemo(
    () => ({
      items: cart.items,
      restaurant,
      restaurantId: cart.restaurantId,
      coupon,
      quote,
      count,
      pending: cart.pending,
      addItem,
      confirmSwitch,
      cancelSwitch,
      setQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      cart.items,
      cart.restaurantId,
      cart.pending,
      restaurant,
      coupon,
      quote,
      count,
      addItem,
      confirmSwitch,
      cancelSwitch,
      setQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
