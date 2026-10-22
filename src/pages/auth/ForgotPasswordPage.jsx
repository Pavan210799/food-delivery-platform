import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useTitle } from '../../hooks/useTitle'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useTitle('Forgot password')

  function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    const result = requestPasswordReset({ email })
    setBusy(false)
    if (!result.ok) {
      setErrors(result.errors || {})
      return
    }

    navigate('/reset-password', {
      replace: true,
      state: {
        email: result.email,
        token: result.token,
        issued: result.issued,
      },
    })
  }

  return (
    <AuthShell
      panelKey="forgot"
      eyebrow="Account recovery"
      title="Forgot password?"
      subtitle="Enter the email on your Marlow account. We’ll open a secure reset step next."
      footer={
        <>
          Remembered it?{' '}
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
            if (errors.email) setErrors({})
          }}
        />

        <Button type="submit" variant="copper" className="w-full" disabled={busy}>
          {busy ? 'Checking…' : 'Continue'}
        </Button>
      </form>
    </AuthShell>
  )
}
