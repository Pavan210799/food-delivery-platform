import { coupons } from '../data/coupons'
import { money, roundMoney } from './format'

export const SERVICE_RATE = 0.05
export const TAX_RATE = 0.08875

export function unitPrice(item) {
  const extras = item.selections.reduce((sum, selection) => sum + selection.price, 0)
  return item.basePrice + extras
}

export function subtotalOf(items) {
  return roundMoney(
    items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0),
  )
}

export function findCoupon(code) {
  if (!code) return null
  return coupons.find((coupon) => coupon.code === code.trim().toUpperCase()) ?? null
}

export function quoteOrder({ items, coupon, deliveryFee }) {
  const subtotal = subtotalOf(items)
  const qualified = Boolean(coupon) && subtotal >= coupon.minSubtotal
  let discount = 0
  let delivery = items.length ? deliveryFee : 0
  let couponStatus = null

  if (coupon) {
    if (!qualified) {
      const remaining = roundMoney(coupon.minSubtotal - subtotal)
      couponStatus = {
        ok: false,
        message: `Add ${money(remaining)} more to use ${coupon.code}.`,
      }
    } else if (coupon.type === 'percent') {
      discount = roundMoney(subtotal * (coupon.value / 100))
      couponStatus = { ok: true, message: coupon.label }
    } else if (coupon.type === 'flat') {
      discount = roundMoney(Math.min(coupon.value, subtotal))
      couponStatus = { ok: true, message: coupon.label }
    } else if (coupon.type === 'delivery') {
      delivery = 0
      couponStatus = { ok: true, message: coupon.label }
    }
  }

  delivery = roundMoney(delivery)
  const serviceFee = roundMoney(subtotal * SERVICE_RATE)
  const taxable = subtotal - discount + serviceFee + delivery
  const tax = roundMoney(taxable * TAX_RATE)
  const total = roundMoney(subtotal - discount + serviceFee + delivery + tax)

  return {
    subtotal,
    discount,
    delivery,
    serviceFee,
    tax,
    total,
    couponStatus,
  }
}
