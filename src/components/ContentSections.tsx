import { useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
  Send,
  // Underline,
} from 'lucide-react'
import { Button } from './Button'
import { Tag } from './Tag'
import { SkillsSection } from './SkillsSection'
import {
  aboutPrinciples,
  certifications,
  education,
  experiences,
  portfolioEmail,
  portfolioUpdatedAt,
  projects,
  research,
} from '../data/portfolio'

const githubUrl = 'https://github.com/Harshad5557'
const linkedinUrl = 'https://linkedin.com/in/harshad-dike'
const leetcodeUrl = 'https://leetcode.com/Harshad_Dike'
const phone = '+91-9322665964'

export function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="content-section section-shell" id="about">
      <SectionIntro
        eyebrow="01 / ABOUT"
        title="Thoughtful engineering, from interface to infrastructure."
        description="I’m a Computer Engineering graduate focused on full-stack development, backend engineering, and practical AI integration."
        id="about-title"
      />
      <div className="about-layout">
        <div className="about-story">
          <p>
            Through internships and collaborative projects, I’ve worked on REST
            APIs, data-backed applications, authentication, real-time
            communication, and machine-learning pipelines.
          </p>
          <p>
            I enjoy understanding how systems work beneath the interface—from
            API design and data modeling to performance and deployment.
          </p>
          <p>
            I’m looking for opportunities to contribute to real engineering
            problems, learn from experienced developers, and build software
            that makes a measurable difference.
          </p>
          <div className="about-facts">
            <div><span>BASED IN</span><strong>Pune, India</strong></div>
            <div><span>EDUCATION</span><strong>B.E. Computer Engineering</strong></div>
            <div><span>GRADUATED</span><strong>July 2026</strong></div>
            <div><span>CGPA</span><strong>7.82 / 10</strong></div>
          </div>
        </div>
        <div className="principle-grid">
          {aboutPrinciples.map((principle, index) => (
            <article className="principle-card" key={principle.title}>
              <span className="principle-index">0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ExperienceSection() {
  return (
    <section aria-labelledby="experience-title" className="content-section section-shell" id="experience">
      <SectionIntro
        eyebrow="03 / EXPERIENCE"
        title="Learning by contributing to real systems."
        description="Internships spanning backend APIs, full-stack development, and collaborative delivery."
        id="experience-title"
      />
      <div className="experience-list">
        {experiences.map((experience, index) => (
          <article className="experience-card" key={experience.organization}>
            <div className="experience-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
            <div className="experience-body">
              <div className="experience-topline">
                <div>
                  <span className="eyebrow">{experience.organization}</span>
                  <h3>{experience.role}</h3>
                </div>
                <span className="date-label">{experience.period}</span>
              </div>
              <p className="experience-description">{experience.description}</p>
              <ul className="detail-list">
                {experience.contributions.map((item) => (
                  <li key={item}><Check aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <div className="tag-list" aria-label="Technologies used">
                {experience.technologies.map((technology) => (
                  <Tag key={technology}>{technology}</Tag>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ProjectsSection() {
  return (
    <section aria-labelledby="projects-title" className="content-section section-shell" id="projects">
      <SectionIntro
        eyebrow="04 / SELECTED WORK"
        title="Projects shaped around real engineering problems."
        description="A closer look at full-stack systems, real-time communication, and applied machine learning."
        id="projects-title"
      />
      <div className="project-grid">
        {projects.map((project, index) => (
          <article className="portfolio-project-card" id={`project-${index + 1}`} key={project.title}>
            <div aria-hidden="true" className={`project-visual project-visual-${index + 1}`}>
              <span className="project-visual-index">PROJECT / {String(index + 1).padStart(2, '0')}</span>
              {index === 0 ? <ProjectMessages />: index === 1 ? <ProjectNetwork /> :<ProjectVision />  }
            </div>
            <div className="project-card-copy">
              <div className="project-meta">
                <span className="eyebrow">{project.category}</span>
                <span className="project-period">{project.period}</span>
              </div>
              <h3>{project.title}   {project.url && (
                <a className="project-demo-link" href={project.url} rel="noreferrer" target="_blank">
                  <ArrowUpRight aria-hidden="true" />
                </a>
              )}</h3>
               
              <p>{project.description}</p>
              <ul className="project-highlights">
                {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
              <div className="tag-list" aria-label="Project technologies">
                {project.technologies.map((technology) => <Tag key={technology}>{technology}</Tag>)}
              </div>
             
            </div>
          </article>
        ))}
      </div>
      {/* <a className="section-link" href={githubUrl} rel="noreferrer" target="_blank">
        Browse public repositories <ArrowUpRight aria-hidden="true" />
      </a> */}
    </section>
  )
}

function ProjectNetwork() {
  return (
    <svg fill="none" viewBox="0 0 400 220">
      <path d="M70 110h91m78 0h91M200 35v47m0 54v49" stroke="currentColor" strokeOpacity=".36" />
      <rect height="54" rx="9" width="76" x="162" y="82" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".7" />
      <rect height="34" rx="6" width="52" x="42" y="93" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeOpacity=".45" />
      <rect height="34" rx="6" width="52" x="306" y="93" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeOpacity=".45" />
      <rect height="34" rx="6" width="52" x="174" y="18" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeOpacity=".45" />
      <rect height="34" rx="6" width="52" x="174" y="168" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeOpacity=".45" />
      <circle cx="200" cy="109" fill="currentColor" r="5" />
      <circle cx="68" cy="110" fill="currentColor" r="3" />
      <circle cx="332" cy="110" fill="currentColor" r="3" />
    </svg>
  )
}

function ProjectVision() {
  return (
    <svg fill="none" viewBox="0 0 400 220">
      <rect height="128" rx="10" width="192" x="104" y="46" stroke="currentColor" strokeOpacity=".45" />
      <rect height="80" rx="3" width="126" x="137" y="70" stroke="currentColor" strokeDasharray="5 5" strokeOpacity=".45" />
      <path d="M176 154V96h48v58m-24-58v58" stroke="currentColor" strokeOpacity=".8" />
      <circle cx="200" cy="78" fill="currentColor" r="5" />
      <path d="M95 64h-22v24m232-24h22v24m-232 68v24h22m210-24v24h-22" stroke="currentColor" strokeOpacity=".58" />
      <circle cx="73" cy="88" fill="currentColor" r="3" />
      <circle cx="327" cy="88" fill="currentColor" r="3" />
    </svg>
  )
}

function ProjectMessages() {
  return (
    <svg fill="none" viewBox="0 0 400 220">
      <path d="M91 70h151a18 18 0 0 1 18 18v32a18 18 0 0 1-18 18h-68l-27 22v-22H91a18 18 0 0 1-18-18V88a18 18 0 0 1 18-18Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeOpacity=".6" />
      <path d="M164 96h59m-59 16h42" stroke="currentColor" strokeLinecap="round" strokeOpacity=".8" />
      <path d="M205 39h105a17 17 0 0 1 17 17v25a17 17 0 0 1-17 17h-18v19l-25-19h-62a17 17 0 0 1-17-17V56a17 17 0 0 1 17-17Z" fill="currentColor" fillOpacity=".05" stroke="currentColor" strokeOpacity=".38" />
      <circle cx="100" cy="63" fill="currentColor" r="4" />
      <circle cx="113" cy="63" fill="currentColor" fillOpacity=".55" r="4" />
      <circle cx="126" cy="63" fill="currentColor" fillOpacity=".3" r="4" />
    </svg>
  )
}

export function ResearchSection() {
  return (
    <section aria-labelledby="research-title" className="content-section section-shell" id="research">
      <SectionIntro
        eyebrow="05 / RESEARCH"
        title="Applied computer vision, shared through research."
        description="A research contribution emerging from collaborative work on worker-safety monitoring."
        id="research-title"
      />
      <article className="research-card">
        <div aria-hidden="true" className="research-symbol"><FileText /></div>
        <div className="research-copy">
          <span className="eyebrow">IEEE ICCSGD 2026 · BVICAM, NEW DELHI</span>
          <h3>{research.title}</h3>
          <p>{research.summary}</p>
          <p className="research-venue">{research.venue}</p>
          <div className="tag-list" aria-label="Research topics">
            {research.technologies.map((technology) => <Tag key={technology}>{technology}</Tag>)}
          </div>
            <p className="research-note">
              <a
                href="https://ieeexplore.ieee.org/document/11525560"
                target="_blank"
                rel="noopener noreferrer"
              >
                Publication URL
              </a>
            </p>
          </div>
      </article>
    </section>
  )
}

export function EducationSection() {
  return (
    <section aria-labelledby="education-title" className="content-section section-shell" id="education">
      <SectionIntro
        eyebrow="06 / EDUCATION"
        title="A foundation in computer engineering."
        description="Academic milestones and qualifications."
        id="education-title"
      />
      <div className="education-grid">
        {education.map((item, index) => (
          <article className={`education-card${index === 0 ? ' education-card-primary' : ''}`} key={item.qualification}>
            <div className="education-card-top">
              <div className="education-icon">
                {index === 0 ? <GraduationCap aria-hidden="true" /> : <Award aria-hidden="true" />}
              </div>
              <span className="date-label">{item.date}</span>
            </div>
            <h3>{item.qualification}</h3>
            <p>{item.institution}</p>
            <span className="education-result">{item.result}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export function CertificationsSection() {
  return (
    <section aria-labelledby="certifications-title" className="content-section section-shell" id="certifications">
      <SectionIntro
        eyebrow="07 / CONTINUOUS LEARNING"
        title="Learning across data, cloud, and AI."
        description="Selected learning credentials. Verification links are shown only where available."
        id="certifications-title"
      />
      <div className="certification-grid">
        {certifications.map((certification) => (
          <article className="certification-card" key={certification.title}>
            <BookOpen aria-hidden="true" />
            <div>
              <h3>{certification.title}</h3>
              <p>{certification.issuer}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

type ContactForm = {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactSection() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' })
  const [formMessage, setFormMessage] = useState('')
  const [copyMessage, setCopyMessage] = useState('')

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(portfolioEmail)
      setCopyMessage('Email address copied.')
    } catch {
      setCopyMessage('Could not copy automatically. Select the email address to copy it.')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return

    const subject = encodeURIComponent(form.subject)
    const body = encodeURIComponent(
      `Name: ${form.name}\nReply email: ${form.email}\n\n${form.message}`,
    )
    window.location.href = `mailto:${portfolioEmail}?subject=${subject}&body=${body}`
    setFormMessage(
      'If an email app is configured, a draft will open. The message is not sent until you send it from that app.',
    )
  }

  return (
    <section aria-labelledby="contact-title" className="content-section section-shell" id="contact">
      <SectionIntro
        eyebrow="08 / CONTACT"
        title="Let’s talk about what you’re building."
        description="For software engineering opportunities, project conversations, or a thoughtful technical exchange."
        id="contact-title"
      />
      <div className="contact-grid">
        <div className="contact-details">
          <div className="contact-email-card">
            <span className="eyebrow">EMAIL</span>
            <a href={`mailto:${portfolioEmail}`}>{portfolioEmail}</a>
            <Button onClick={copyEmail} size="small" variant="secondary">
              <Copy aria-hidden="true" /> Copy email
            </Button>
            <span aria-live="polite" className="form-status">{copyMessage}</span>
          </div>
          <div className="contact-link-list">
            <a href={linkedinUrl} rel="noreferrer" target="_blank">
              LinkedIn <ExternalLink aria-hidden="true" />
            </a>
            <a href={githubUrl} rel="noreferrer" target="_blank">
              GitHub <ExternalLink aria-hidden="true" />
            </a>
            <a href={leetcodeUrl} rel="noreferrer" target="_blank">
              LeetCode <ExternalLink aria-hidden="true" />
            </a>
            <a href={`tel:${phone.replaceAll('-', '')}`}>
              {phone} <ArrowUpRight aria-hidden="true" />
            </a>
            <span><MapPin aria-hidden="true" /> Pune, Maharashtra, India</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-heading">
            <span className="eyebrow">EMAIL DRAFT</span>
            <p>This prepares a message in your email app; it does not send from this site.</p>
          </div>
          <label className="field">
            <span className="field-label">Your name</span>
            <input
              autoComplete="name"
              className="field-input"
              maxLength={100}
              name="name"
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              value={form.name}
            />
          </label>
          <label className="field">
            <span className="field-label">Your email</span>
            <input
              autoComplete="email"
              className="field-input"
              maxLength={254}
              name="email"
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label className="field">
            <span className="field-label">Subject</span>
            <input
              className="field-input"
              maxLength={160}
              name="subject"
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
              required
              value={form.subject}
            />
          </label>
          <label className="field">
            <span className="field-label">Message</span>
            <textarea
              className="field-input contact-message"
              maxLength={5000}
              minLength={10}
              name="message"
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              required
              rows={5}
              value={form.message}
            />
          </label>
          <Button type="submit">
            Prepare email <Send aria-hidden="true" />
          </Button>
          <p aria-live="polite" className="form-status">{formMessage}</p>
        </form>
      </div>
    </section>
  )
}

export function FAQSection() {
  return (
    <section aria-labelledby="faq-title" className="content-section section-shell" id="faq">
      <SectionIntro
        eyebrow="09 / FAQ"
        title="A few useful details."
        description="Answers to common questions about my work and background."
        id="faq-title"
      />
      <div className="faq-list">
        {[
          {
            question: 'What kind of engineering work do you focus on?',
            answer: 'Full-stack application development, backend services, real-time experiences, and practical machine-learning solutions.',
          },
          {
            question: 'Where are you based?',
            answer: 'Pune, Maharashtra, India.',
          },
          {
            question: 'Where can I see your work?',
            answer: 'Visit my GitHub profile for available repositories. Project links appear only when a public URL is available.',
          },
          {
            question: 'How can I get in touch?',
            answer: 'Email is the most direct option. The contact section also lets you copy the address or prepare an email draft.',
          },
        ].map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}<span aria-hidden="true">+</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function PortfolioFooter() {
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${portfolioUpdatedAt}T00:00:00Z`))

  return (
    <footer className="portfolio-footer">
      <div className="section-shell footer-main">
        <div className="brand">
          <span aria-hidden="true" className="brand-mark">HD</span>
          <span className="brand-name">HARSHAD DIKE<span> / ENGINEER</span></span>
        </div>
        <p>Building thoughtful software, one system at a time.</p>
      </div>
      <div className="section-shell footer-meta">
        <span>© {new Date().getUTCFullYear()} Harshad Laxman Dike</span>
        <span>Last updated {formattedDate}</span>
        <a href="#top"><ArrowUpRight aria-hidden="true" /></a>
      </div>
    </footer>
  )
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string
  title: string
  description: string
  id: string
}) {
  return (
    <div className="section-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export { SkillsSection }
