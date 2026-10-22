import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import PasswordField from '../../components/ui/PasswordField'
import { useAuth } from '../../context/AuthContext'
import { useTitle } from '../../hooks/useTitle'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { resetPassword } = useAuth()

  const bootstrap = useMemo(
    () => ({
      email: location.state?.email || params.get('email') || '',
      token: location.state?.token || params.get('token') || '',
      issued: location.state?.issued ?? Boolean(params.get('token')),
    }),
    [location.state, params],
  )

  const [email, setEmail] = useState(bootstrap.email)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useTitle('Reset password')

  if (!bootstrap.email && !bootstrap.token) {
    return <Navigate to="/forgot-password" replace />
  }

  function onSubmit(event) {
    event.preventDefault()
    if (!bootstrap.issued || !bootstrap.token) {
      setErrors({ form: 'No reset link is available for that email. Try again from forgot password.' })
      return
    }

    setBusy(true)
    const result = resetPassword({
      email,
      token: bootstrap.token,
      password,
      confirm,
    })
    setBusy(false)
    if (!result.ok) {
      setErrors(result.errors || {})
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <AuthShell
      panelKey="reset"
      eyebrow="New password"
      title="Choose a new password"
      subtitle={
        bootstrap.issued
          ? 'Set a fresh password for your Marlow account. You’ll stay signed in after saving.'
          : 'If that email has an account, a reset step appears here. Double-check the address if nothing unlocks.'
      }
      footer={
        <>
          <Link to="/login" className="font-semibold text-copper hover:text-copper-dark">
            Back to log in
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
        ) : bootstrap.issued ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-sage/10 px-4 py-3 text-sm font-semibold text-sage"
          >
            Reset link ready for {bootstrap.email}. Choose a new password below.
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-sand px-4 py-3 text-sm text-muted"
          >
            We couldn’t open a reset for that email. Try another address or create an account.
          </motion.p>
        )}

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={Boolean(bootstrap.email)}
        />

        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (errors.password || errors.form) setErrors({})
          }}
        />
        <PasswordField
          label="Confirm password"
          name="confirm"
          autoComplete="new-password"
          required
          value={confirm}
          error={errors.confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />

        <Button
          type="submit"
          variant="copper"
          className="w-full"
          disabled={busy || !bootstrap.issued}
        >
          {busy ? 'Saving…' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
  )
}
