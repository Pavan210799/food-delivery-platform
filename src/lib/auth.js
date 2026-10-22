const USERS_KEY = 'marlow.users'
const SESSION_KEY = 'marlow.session'

export function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
}

export function hashPassword(password) {
  const input = `marlow.v1:${password}`
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `m1_${(hash >>> 0).toString(16)}`
}

export function validateEmail(email) {
  const value = normalizeEmail(email)
  if (!value) return 'Enter your email.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email.'
  return ''
}

export function validatePassword(password, { confirm } = {}) {
  if (!password || password.length < 6) return 'Use at least 6 characters.'
  if (confirm !== undefined && password !== confirm) return 'Passwords do not match.'
  return ''
}

export function validateName(name) {
  if (!name || name.trim().length < 2) return 'Enter your name.'
  return ''
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (user) => user && typeof user.id === 'string' && typeof user.email === 'string',
    )
  } catch {
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.userId) return null
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function createUserId() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function createResetToken() {
  return `rt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}
