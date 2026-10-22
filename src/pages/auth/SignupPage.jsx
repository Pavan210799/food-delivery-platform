import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import PasswordField from '../../components/ui/PasswordField'
import { useAuth } from '../../context/AuthContext'
import { useTitle } from '../../hooks/useTitle'

export default function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup, isAuthenticated } = useAuth()
  const alreadySignedIn = useRef(isAuthenticated)
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useTitle('Sign up')

  if (alreadySignedIn.current) {
    return <Navigate to={location.state?.from || '/'} replace />
  }

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field] || errors.form) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        delete next.form
        return next
      })
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    const result = signup(values)
    setBusy(false)
    if (!result.ok) {
      setErrors(result.errors || {})
      return
    }
    navigate('/signup-success', {
      replace: true,
      state: { from: location.state?.from || '/', name: result.user?.name },
    })
  }

  return (
    <AuthShell
      panelKey="signup"
      eyebrow="Join Marlow"
      title="Create your account"
      subtitle="Save orders to your profile and pick up right where you left dinner."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-copper hover:text-copper-dark">
            Log in
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
          label="Name"
          name="name"
          autoComplete="name"
          required
          value={values.name}
          error={errors.name}
          onChange={(event) => update('name', event.target.value)}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          error={errors.email}
          onChange={(event) => update('email', event.target.value)}
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          required
          hint="At least 6 characters."
          value={values.password}
          error={errors.password}
          onChange={(event) => update('password', event.target.value)}
        />
        <PasswordField
          label="Confirm password"
          name="confirm"
          autoComplete="new-password"
          required
          value={values.confirm}
          error={errors.confirm}
          onChange={(event) => update('confirm', event.target.value)}
        />

        <Button type="submit" variant="copper" className="w-full" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}
