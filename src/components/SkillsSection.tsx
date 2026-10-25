import { Layers3 } from 'lucide-react'
import { skillCategories } from '../data/skills'
import { TechnologyIcon } from './TechnologyIcon'

export function SkillsSection() {
  return (
    <section aria-labelledby="skills-title" className="skills-section section-shell" id="skills">
      <div className="skills-heading">
        <div className="skills-heading-copy">
          <span className="eyebrow">CAPABILITIES / 01—10</span>
          <h2 id="skills-title">Technical skills, built for the whole stack.</h2>
          <p>
            From product interfaces to backend systems and applied machine
            learning, these are the tools and concepts I work with.
          </p>
        </div>
        <div aria-hidden="true" className="skills-heading-mark">
          <Layers3 />
        </div>
      </div>

      <div className="skill-category-grid">
        {skillCategories.map((category, categoryIndex) => (
          <article
            aria-labelledby={`skill-category-${categoryIndex}`}
            className="skill-category"
            key={category.name}
          >
            <header className="skill-category-heading">
              <div>
                <span className="skill-category-index">
                  {String(categoryIndex + 1).padStart(2, '0')}
                </span>
                <h3 id={`skill-category-${categoryIndex}`}>{category.name}</h3>
              </div>
            </header>
            <p className="skill-category-description">{category.description}</p>

            <ul className="technology-grid">
              {category.skills.map((skill, skillIndex) => (
                <li className="technology-cell" key={`${skill.name}-${skillIndex}`}>
                  <TechnologyIcon skill={skill} />
                  <span className="technology-name">{skill.name}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
