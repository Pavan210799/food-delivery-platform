import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bill from '../components/cart/Bill'
import Button, { ButtonLink } from '../components/ui/Button'
import Field from '../components/ui/Field'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import { useTitle } from '../hooks/useTitle'
import { emptyCheckout, validateCheckout } from '../lib/checkout'
import { money } from '../lib/format'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, restaurant, quote, coupon, clearCart } = useCart()
  const { placeOrder } = useOrders()
  const [values, setValues] = useState(emptyCheckout)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [banner, setBanner] = useState('')

  useTitle('Checkout')

  function update(name, value) {
    const next = { ...values, [name]: value }
    setValues(next)
    if (submitted) {
      const nextErrors = validateCheckout(next)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length === 0) setBanner('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    const nextErrors = validateCheckout(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setBanner('Check the highlighted fields.')
      document.getElementById(Object.keys(nextErrors)[0])?.focus()
      return
    }

    if (coupon && quote.couponStatus && !quote.couponStatus.ok) {
      setBanner(quote.couponStatus.message)
      return
    }

    const order = placeOrder({
      items,
      restaurant,
      quote,
      coupon,
      delivery: values,
    })
    clearCart()
    navigate(`/orders/${order.id}`, { replace: true })
  }

  if (items.length === 0) {
    return (
      <div className="page-wrap py-20 sm:py-28">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Nothing to check out.</h1>
        <p className="mt-4 text-muted">Add a dish, then come back for the bill.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/#kitchens">See kitchens</ButtonLink>
          <ButtonLink to="/orders" variant="ghost">
            Order history
          </ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrap py-10 sm:py-14">
      <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Checkout</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Delivery details</h1>
      <p className="mt-3 max-w-lg text-muted">Just the three things we need to reach you.</p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <motion.form
          id="checkout"
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-[1.75rem] border border-line bg-paper p-5 sm:p-7"
        >
          {banner ? (
            <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {banner}
            </p>
          ) : null}

          <Field
            label="Name"
            name="name"
            required
            autoComplete="name"
            value={values.name}
            error={errors.name}
            onChange={(event) => update('name', event.target.value)}
          />
          <Field
            label="Phone"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            error={errors.phone}
            onChange={(event) => update('phone', event.target.value)}
          />
          <Field
            as="textarea"
            label="Delivery address"
            name="address"
            required
            autoComplete="street-address"
            placeholder="Street, apartment, city"
            value={values.address}
            error={errors.address}
            onChange={(event) => update('address', event.target.value)}
          />
        </motion.form>

        <Bill quote={quote} restaurantName={restaurant?.name}>
          <Button type="submit" form="checkout" className="mt-6 w-full">
            Place order · {money(quote.total)}
          </Button>
        </Bill>
      </div>
    </div>
  )
}
