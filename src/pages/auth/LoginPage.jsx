import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import PasswordField from '../../components/ui/PasswordField'
import { useAuth } from '../../context/AuthContext'
import { useTitle } from '../../hooks/useTitle'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useTitle('Log in')

  function afterLoginPath() {
    const from = location.state?.from
    // Never return to orders after login — account switches start from Orders logout.
    if (!from || from === '/orders' || String(from).startsWith('/orders/')) return '/'
    return from
  }

  if (isAuthenticated) {
    return <Navigate to={afterLoginPath()} replace />
  }

  function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    const result = login({ email, password })
    setBusy(false)
    if (!result.ok) {
      setErrors(result.errors || {})
      return
    }
    navigate(afterLoginPath(), { replace: true })
  }

  return (
    <AuthShell
      panelKey="login"
      eyebrow="Welcome back"
      title="Log in to Marlow"
      subtitle="Your kitchens, cart, and order timeline stay with your account."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" state={location.state} className="font-semibold text-copper hover:text-copper-dark">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {errors.form ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {errors.form}
          </motion.p>
        ) : null}

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (errors.email || errors.form) setErrors({})
          }}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (errors.password || errors.form) setErrors({})
          }}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-semibold text-copper hover:text-copper-dark">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="copper" className="w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  )
}
