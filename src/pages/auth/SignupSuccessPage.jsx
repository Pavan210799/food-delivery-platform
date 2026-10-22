import { motion } from 'framer-motion'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import { ButtonLink } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useTitle } from '../../hooks/useTitle'

export default function SignupSuccessPage() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const name = location.state?.name || user?.name || 'there'
  const next = location.state?.from || '/'

  useTitle('Welcome')

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />
  }

  return (
    <AuthShell
      panelKey="signup-success"
      eyebrow="You’re in"
      title={`Welcome, ${name.split(' ')[0]}.`}
      subtitle="Your Marlow account is ready. Orders you place will stay private to this profile."
    >
      <div className="space-y-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage/15 text-sage"
          aria-hidden="true"
        >
          <motion.svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <motion.path
              d="M5 12.5 9.5 17 19 7.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            />
          </motion.svg>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="space-y-2 text-sm text-muted"
        >
          {[
            'Browse kitchens and customize dishes',
            'Checkout saves orders to your account only',
            'Track every bag from the pass to the door',
          ].map((item) => (
            <motion.li
              key={item}
              variants={{
                hidden: { opacity: 0, x: -8 },
                show: { opacity: 1, x: 0 },
              }}
              className="flex gap-2 rounded-2xl bg-cream px-3 py-2.5"
            >
              <span className="font-semibold text-copper">·</span>
              <span>{item}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={next.startsWith('/') ? next : '/'} className="w-full sm:flex-1">
            Start ordering
          </ButtonLink>
          <ButtonLink to="/orders" variant="ghost" className="w-full sm:flex-1">
            View orders
          </ButtonLink>
        </div>

        <p className="text-center text-sm text-muted">
          Signed in as{' '}
          <span className="font-semibold text-ink">{user?.email}</span>
          .{' '}
          <Link to="/" className="font-semibold text-copper hover:text-copper-dark">
            Go home
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
