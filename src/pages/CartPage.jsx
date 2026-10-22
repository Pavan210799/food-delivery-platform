import { AnimatePresence, motion } from 'framer-motion'
import Bill from '../components/cart/Bill'
import CartLine from '../components/cart/CartLine'
import { ButtonLink } from '../components/ui/Button'
import { CartSkeleton } from '../components/ui/PageSkeletons'
import { useCart } from '../context/CartContext'
import { usePageSkeleton } from '../hooks/usePageSkeleton'
import { useTitle } from '../hooks/useTitle'

export default function CartPage() {
  const { items, restaurant, quote, setQuantity, removeItem, clearCart } = useCart()
  const loading = usePageSkeleton(750)
  useTitle(loading ? 'Loading' : 'Your order')

  if (loading) {
    return <CartSkeleton />
  }

  if (items.length === 0) {
    return (
      <div className="page-wrap py-20 sm:py-28">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Cart</p>
        <h1 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
          The table is clear.
        </h1>
        <p className="mt-4 max-w-md text-muted">Nothing is waiting. The kitchens are.</p>
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
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase">Cart</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Your order</h1>
        </div>
        <button type="button" onClick={clearCart} className="text-sm text-muted hover:text-danger">
          Clear
        </button>
      </div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.lineId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <CartLine item={item} onQuantity={setQuantity} onRemove={removeItem} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <Bill quote={quote} restaurantName={restaurant?.name}>
          <ButtonLink to="/checkout" className="mt-6 w-full">
            Checkout
          </ButtonLink>
        </Bill>
      </div>
    </div>
  )
}
