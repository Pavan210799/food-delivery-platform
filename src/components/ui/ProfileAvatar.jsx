import { Link } from 'react-router-dom'
import { UserIcon } from './Icons'

function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export default function ProfileAvatar({ user, isAuthenticated, className = '' }) {
  const label = isAuthenticated
    ? `Account, ${user?.name || user?.email || 'profile'}`
    : 'Log in'

  return (
    <Link
      to={isAuthenticated ? '/orders' : '/login'}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-paper text-ink transition hover:border-ink/30 sm:h-11 sm:w-11 ${className}`}
      aria-label={label}
      title={isAuthenticated ? user?.email || user?.name : 'Log in'}
    >
      {isAuthenticated ? (
        <span className="font-display text-[0.72rem] font-bold tracking-wide text-copper sm:text-xs">
          {initials(user?.name) || 'M'}
        </span>
      ) : (
        <UserIcon />
      )}
    </Link>
  )
}
