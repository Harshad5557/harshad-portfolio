import { useId, type InputHTMLAttributes } from 'react'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  hint?: string
  error?: string
}

export function TextField({
  error,
  hint,
  label,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const descriptionId = `${generatedId}-description`
  const description = error ?? hint

  return (
    <div className="field">
      <label className="field-label" htmlFor={generatedId}>
        {label}
      </label>
      <input
        className="field-input"
        id={generatedId}
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {description && (
        <span
          className={`field-hint${error ? ' field-error' : ''}`}
          id={descriptionId}
        >
          {description}
        </span>
      )}
    </div>
  )
}
