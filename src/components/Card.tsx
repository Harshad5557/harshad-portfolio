import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'interactive'
}

export function Card({
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <div
      className={`card card-${variant} ${className}`.trim()}
      {...props}
    />
  )
}
