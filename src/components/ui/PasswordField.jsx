import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './Icons'

export default function PasswordField({
  label,
  error,
  hint,
  required = false,
  id,
  name,
  autoComplete = 'current-password',
  ...props
}) {
  const [visible, setVisible] = useState(false)
  const fieldId = id || name
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-2 block text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">
        {label}
        {required ? <span className="text-copper"> *</span> : null}
      </span>
      <span className="relative block">
        <input
          id={fieldId}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`w-full rounded-2xl border bg-paper py-3 pr-12 pl-4 text-base text-ink transition placeholder:text-muted/80 focus:border-ink ${
            error ? 'border-danger' : 'border-line'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute top-1/2 right-3 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-sand hover:text-ink"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
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
