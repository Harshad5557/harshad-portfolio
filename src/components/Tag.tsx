import type { HTMLAttributes } from 'react'

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'neutral' | 'blue' | 'violet'
}

export function Tag({
  className = '',
  variant = 'neutral',
  ...props
}: TagProps) {
  return (
    <span
      className={`tag tag-${variant} ${className}`.trim()}
      {...props}
    />
  )
}
