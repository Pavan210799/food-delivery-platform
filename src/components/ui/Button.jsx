import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-ink text-cream hover:bg-copper',
  copper: 'bg-copper text-paper hover:bg-copper-dark',
  ghost: 'border border-line bg-transparent text-ink hover:border-ink',
  paper: 'bg-paper text-ink hover:bg-sand',
}

function classes(variant, className) {
  return `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`
}

export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  children,
  ...props
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={classes(variant, className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function ButtonLink({ to, variant = 'primary', className = '', children }) {
  return (
    <Link to={to} className={classes(variant, className)}>
      {children}
    </Link>
  )
}
