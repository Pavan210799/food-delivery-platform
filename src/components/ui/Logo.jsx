export default function Logo({
  className = '',
  markOnly = false,
  compactMobile = false,
  markClassName = 'h-9 w-9',
}) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className={`shrink-0 ${markClassName}`} aria-hidden="true">
        <rect width="64" height="64" rx="18" fill="currentColor" className="text-ink" />
        <path
          d="M18 44V20.5L32 34.2 46 20.5V44"
          fill="none"
          stroke="#F3EEE6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="16" r="3.2" fill="#C45C26" />
      </svg>
      {markOnly ? null : (
        <span
          className={`font-display text-[1.55rem] leading-none font-bold tracking-tight ${
            compactMobile ? 'hidden min-[400px]:inline' : ''
          }`}
        >
          Marlow
        </span>
      )}
    </span>
  )
}
