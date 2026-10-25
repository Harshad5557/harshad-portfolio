type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  id?: string
}

export function SectionHeading({
  description,
  eyebrow,
  id,
  title,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
