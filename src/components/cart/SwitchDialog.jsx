import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import Button from '../ui/Button'

export default function SwitchDialog() {
  const { pending, restaurant, confirmSwitch, cancelSwitch } = useCart()
  const currentName = restaurant?.name ?? 'your current kitchen'
  const nextName = pending?.restaurantName ?? 'the other kitchen'

  return (
    <AnimatePresence>
      {pending ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-ink/55" aria-label="Keep current cart" onClick={cancelSwitch} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="switch-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="relative z-10 w-full rounded-t-[1.75rem] bg-paper p-6 sm:max-w-md sm:rounded-[1.75rem]"
          >
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-copper uppercase">One kitchen at a time</p>
            <h2 id="switch-title" className="mt-2 font-display text-3xl tracking-tight">
              Start a new order?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {currentName} is already on this order. Adding {pending.name} from {nextName} replaces the cart.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button variant="ghost" className="flex-1" onClick={cancelSwitch}>
                Keep {currentName}
              </Button>
              <Button variant="primary" className="flex-1" onClick={confirmSwitch}>
                Start {nextName}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
