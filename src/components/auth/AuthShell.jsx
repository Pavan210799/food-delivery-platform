import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  panelKey = 'auth',
}) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <motion.div
          className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-copper/15 blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-sage/10 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 22, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="page-wrap flex min-h-screen flex-col justify-center py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex text-ink" aria-label="Marlow home">
            <Logo />
          </Link>
        </motion.div>

        <div className="mx-auto w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={panelKey}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                },
              }}
              className="overflow-hidden rounded-[1.75rem] border border-line bg-paper/95 p-6 shadow-[0_28px_60px_-40px_rgba(22,19,17,0.45)] backdrop-blur-sm sm:p-8"
            >
              <motion.p
                variants={fadeUp}
                className="text-[0.7rem] font-semibold tracking-[0.22em] text-copper uppercase"
              >
                {eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {title}
              </motion.h1>
              {subtitle ? (
                <motion.p variants={fadeUp} className="mt-3 text-sm leading-6 text-muted sm:text-base">
                  {subtitle}
                </motion.p>
              ) : null}

              <motion.div variants={fadeUp} className="mt-7">
                {children}
              </motion.div>

              {footer ? (
                <motion.div variants={fadeUp} className="mt-6 text-center text-sm text-muted">
                  {footer}
                </motion.div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export { fadeUp }
