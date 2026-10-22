import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  createResetToken,
  createUserId,
  hashPassword,
  loadSession,
  loadUsers,
  normalizeEmail,
  publicUser,
  saveSession,
  saveUsers,
  validateEmail,
  validateName,
  validatePassword,
} from '../lib/auth'

const AuthContext = createContext(null)

function findUser(users, email) {
  const key = normalizeEmail(email)
  return users.find((user) => user.email === key) ?? null
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)
  const [session, setSession] = useState(loadSession)

  const user = useMemo(() => {
    if (!session?.userId) return null
    const found = users.find((item) => item.id === session.userId)
    return publicUser(found)
  }, [session, users])

  const persistUsers = useCallback((next) => {
    setUsers(next)
    saveUsers(next)
  }, [])

  const persistSession = useCallback((next) => {
    setSession(next)
    saveSession(next)
  }, [])

  const signup = useCallback(
    ({ name, email, password, confirm }) => {
      const nameError = validateName(name)
      const emailError = validateEmail(email)
      const passwordError = validatePassword(password)
      const confirmError =
        !confirm || confirm !== password ? 'Passwords do not match.' : ''
      if (nameError || emailError || passwordError || confirmError) {
        return {
          ok: false,
          errors: {
            name: nameError,
            email: emailError,
            password: passwordError,
            confirm: passwordError ? '' : confirmError,
          },
        }
      }

      const normalized = normalizeEmail(email)
      if (findUser(users, normalized)) {
        return { ok: false, errors: { email: 'An account with that email already exists.' } }
      }

      const nextUser = {
        id: createUserId(),
        name: name.trim(),
        email: normalized,
        passwordHash: hashPassword(password),
        resetToken: null,
        resetExpires: null,
        createdAt: Date.now(),
      }

      persistUsers([...users, nextUser])
      persistSession({ userId: nextUser.id, at: Date.now() })
      return { ok: true, user: publicUser(nextUser) }
    },
    [persistSession, persistUsers, users],
  )

  const login = useCallback(
    ({ email, password }) => {
      const emailError = validateEmail(email)
      if (emailError) return { ok: false, errors: { email: emailError } }
      if (!password) return { ok: false, errors: { password: 'Enter your password.' } }

      const found = findUser(users, email)
      if (!found || found.passwordHash !== hashPassword(password)) {
        return { ok: false, errors: { form: 'Email or password is incorrect.' } }
      }

      persistSession({ userId: found.id, at: Date.now() })
      return { ok: true, user: publicUser(found) }
    },
    [persistSession, users],
  )

  const logout = useCallback(() => {
    persistSession(null)
  }, [persistSession])

  const requestPasswordReset = useCallback(
    ({ email }) => {
      const emailError = validateEmail(email)
      if (emailError) return { ok: false, errors: { email: emailError } }

      const found = findUser(users, email)
      // Always look successful to avoid account enumeration in the UI copy,
      // but only issue a token when the account exists.
      if (!found) {
        return { ok: true, issued: false, token: null, email: normalizeEmail(email) }
      }

      const token = createResetToken()
      const next = users.map((item) =>
        item.id === found.id
          ? {
              ...item,
              resetToken: token,
              resetExpires: Date.now() + 1000 * 60 * 30,
            }
          : item,
      )
      persistUsers(next)
      return { ok: true, issued: true, token, email: found.email }
    },
    [persistUsers, users],
  )

  const resetPassword = useCallback(
    ({ email, token, password, confirm }) => {
      const emailError = validateEmail(email)
      const passwordError = validatePassword(password)
      const confirmError =
        !confirm || confirm !== password ? 'Passwords do not match.' : ''
      if (emailError || passwordError || confirmError) {
        return {
          ok: false,
          errors: {
            email: emailError,
            password: passwordError,
            confirm: passwordError ? '' : confirmError,
          },
        }
      }
      if (!token) return { ok: false, errors: { form: 'Reset link is missing or invalid.' } }

      const found = findUser(users, email)
      if (
        !found ||
        found.resetToken !== token ||
        !found.resetExpires ||
        found.resetExpires < Date.now()
      ) {
        return { ok: false, errors: { form: 'This reset link is invalid or has expired.' } }
      }

      const next = users.map((item) =>
        item.id === found.id
          ? {
              ...item,
              passwordHash: hashPassword(password),
              resetToken: null,
              resetExpires: null,
            }
          : item,
      )
      persistUsers(next)
      persistSession({ userId: found.id, at: Date.now() })
      return { ok: true, user: publicUser(found) }
    },
    [persistSession, persistUsers, users],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      requestPasswordReset,
      resetPassword,
    }),
    [user, signup, login, logout, requestPasswordReset, resetPassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
