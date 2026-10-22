import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSplash } from '../../context/SplashContext'
import Logo from '../ui/Logo'

export default function PageLoader() {
  const { setSplashDone } = useSplash()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const hide = window.setTimeout(() => {
      document.body.style.overflow = previous
      setVisible(false)
      setSplashDone(true)
    }, 1600)

    return () => {
      document.body.style.overflow = previous
      window.clearTimeout(hide)
    }
  }, [setSplashDone])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-busy="true"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-ink"
            >
              <Logo markClassName="h-14 w-14" />
            </motion.div>

            <div className="h-1 w-36 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full origin-left rounded-full bg-copper"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <motion.p
              className="text-[0.68rem] font-semibold tracking-[0.22em] text-muted uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Opening the kitchens
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
