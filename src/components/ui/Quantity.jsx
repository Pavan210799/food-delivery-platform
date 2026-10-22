export default function Quantity({ value, onChange, min = 1, max = 12 }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="h-10 w-10 rounded-full text-lg leading-none text-ink disabled:text-muted/50"
      >
        −
      </button>
      <span className="min-w-6 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="h-10 w-10 rounded-full text-lg leading-none text-ink disabled:text-muted/50"
      >
        +
      </button>
    </div>
  )
}
