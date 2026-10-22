import { CloseIcon, SearchIcon } from './Icons'

export default function SearchField({
  id,
  value,
  onChange,
  onSubmit,
  placeholder = 'Search kitchens or dishes',
}) {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(value)
      }}
      className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2.5 shadow-[0_18px_50px_-32px_rgba(28,22,18,0.65)] sm:gap-3 sm:px-4 sm:py-3"
    >
      <SearchIcon />
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted sm:text-base"
        aria-label="Search kitchens or dishes"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-muted hover:text-ink"
          aria-label="Clear search"
        >
          <CloseIcon />
        </button>
      ) : null}
    </form>
  )
}
