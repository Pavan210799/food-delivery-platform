export default function Field({
  label,
  error,
  hint,
  as = 'input',
  required = false,
  id,
  name,
  ...props
}) {
  const fieldId = id || name
  const errorId = error ? `${fieldId}-error` : undefined
  const Control = as === 'textarea' ? 'textarea' : 'input'

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-2 block text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">
        {label}
        {required ? <span className="text-copper"> *</span> : null}
      </span>
      <Control
        id={fieldId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full rounded-2xl border bg-paper px-4 py-3 text-base text-ink transition placeholder:text-muted/80 focus:border-ink ${
          as === 'textarea' ? 'min-h-28 resize-y' : ''
        } ${error ? 'border-danger' : 'border-line'}`}
        {...props}
      />
      {error ? (
        <span id={errorId} className="mt-1.5 block text-sm text-danger">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-sm text-muted">{hint}</span>
      ) : null}
    </label>
  )
}
