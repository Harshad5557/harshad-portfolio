import type { CSSProperties } from 'react'
import type { Skill } from '../data/skills'

type TechnologyIconProps = {
  skill: Skill
}

function needsDarkModeContrast(hex: string): boolean {
  const channels = hex.match(/[a-f\d]{2}/gi)
  if (!channels || channels.length !== 3) return true

  const [red, green, blue] = channels.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return (
    red !== undefined &&
    green !== undefined &&
    blue !== undefined &&
    0.2126 * red + 0.7152 * green + 0.0722 * blue < 0.105
  )
}

export function TechnologyIcon({ skill }: TechnologyIconProps) {
  const isDarkBrand = skill.logo ? needsDarkModeContrast(skill.logo.hex) : false
  const style = skill.logo
    ? ({ '--technology-brand': `#${skill.logo.hex}` } as CSSProperties)
    : undefined
  const FallbackIcon = skill.fallback

  return (
    <div className="technology-icon" style={style}>
      {skill.logo ? (
        <svg
          aria-hidden="true"
          className={isDarkBrand ? 'technology-logo is-dark-brand' : 'technology-logo'}
          focusable="false"
          viewBox="0 0 24 24"
        >
          <path d={skill.logo.path} />
        </svg>
      ) : (
        <FallbackIcon aria-hidden="true" className="technology-fallback" />
      )}
    </div>
  )
}
