import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  once = true,
  as = 'div',
}) {
  const Component = motion[as] ?? motion.div

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-48px' }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </Component>
  )
}

export function RevealStagger({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export const revealItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
}
