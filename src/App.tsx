import { useEffect, useState, type MouseEvent } from 'react'
import {
  ArrowUpRight,
  Menu,
  Mail,
  MapPin,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react'
import {
  AboutSection,
  CertificationsSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  FAQSection,
  PortfolioFooter,
  ProjectsSection,
  ResearchSection,
  SkillsSection,
} from './components/ContentSections'
import { FloatingActions, ScrollProgress } from './components/SiteControls'
import { SiteSearch } from './components/SiteSearch'

type Theme = 'dark' | 'light'

const githubUrl = 'https://github.com/Harshad5557'
const emailAddress = 'harshaddike1232@gmail.com'

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem('portfolio-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function HeroIllustration() {
  return (
    <div aria-hidden="true" className="hero-art">
      <div className="hero-art-label">
        <span>APPLICATION ARCHITECTURE</span>
      </div>
      <svg
        className="architecture-visual"
        fill="none"
        role="presentation"
        viewBox="0 0 520 440"
      >
        <defs>
          <pattern
            height="24"
            id="hero-grid"
            patternUnits="userSpaceOnUse"
            width="24"
          >
            <circle cx="1" cy="1" fill="currentColor" r="1" />
          </pattern>
          <linearGradient id="cube-top" x1="153" x2="350" y1="128" y2="224">
            <stop stopColor="#55a5ff" stopOpacity=".27" />
            <stop offset="1" stopColor="#b49aff" stopOpacity=".12" />
          </linearGradient>
          <linearGradient id="cube-left" x1="153" x2="252" y1="180" y2="329">
            <stop stopColor="#1688ff" stopOpacity=".24" />
            <stop offset="1" stopColor="#1688ff" stopOpacity=".04" />
          </linearGradient>
          <linearGradient id="cube-right" x1="252" x2="350" y1="184" y2="326">
            <stop stopColor="#b49aff" stopOpacity=".19" />
            <stop offset="1" stopColor="#55a5ff" stopOpacity=".07" />
          </linearGradient>
          <radialGradient id="hero-light">
            <stop stopColor="#1688ff" stopOpacity=".22" />
            <stop offset="1" stopColor="#1688ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="260" cy="222" fill="url(#hero-light)" r="210" />
        <circle
          cx="260"
          cy="222"
          r="177"
          stroke="currentColor"
          strokeDasharray="2 9"
          strokeOpacity=".17"
        />
        <circle
          cx="260"
          cy="222"
          r="137"
          stroke="currentColor"
          strokeOpacity=".1"
        />
        <path
          d="M55 222h82m246 0h82M260 38v63m0 247v54"
          stroke="currentColor"
          strokeOpacity=".2"
        />
        <path
          d="m152 151 108-62 108 62v124l-108 62-108-62V151Z"
          fill="url(#hero-grid)"
          fillOpacity=".7"
          stroke="currentColor"
          strokeOpacity=".12"
        />

        <path
          d="m260 112 98 56-98 56-98-56 98-56Z"
          fill="url(#cube-top)"
          stroke="#74b8ff"
          strokeOpacity=".76"
          strokeWidth="1.5"
        />
        <path
          d="M162 168v112l98 56V224l-98-56Z"
          fill="url(#cube-left)"
          stroke="#55a5ff"
          strokeOpacity=".56"
          strokeWidth="1.5"
        />
        <path
          d="M358 168v112l-98 56V224l98-56Z"
          fill="url(#cube-right)"
          stroke="#9a83e9"
          strokeOpacity=".52"
          strokeWidth="1.5"
        />

        <path
          d="m197 188 63 36 63-36m-126 34 63 36 63-36m-126 35 63 36 63-36"
          stroke="#8ac5ff"
          strokeOpacity=".34"
        />
        <path
          d="M260 224v112m-49-140v112m98-112v112"
          stroke="#8ac5ff"
          strokeOpacity=".23"
        />
        <path
          d="M162 168h-45v-36H76m282 36h46v-44h35M162 280h-54v39H79m279-39h49v39h35"
          stroke="#72b4ff"
          strokeOpacity=".46"
          strokeWidth="1.5"
        />
        <path
          d="M260 112V78h57m-57 222v47h-56"
          stroke="#9e8aff"
          strokeOpacity=".56"
          strokeWidth="1.5"
        />

        <circle cx="76" cy="132" fill="#55a5ff" r="4" />
        <circle cx="437" cy="124" fill="#b49aff" r="4" />
        <circle cx="79" cy="319" fill="#b49aff" r="4" />
        <circle cx="463" cy="319" fill="#55a5ff" r="4" />
        <circle cx="317" cy="78" fill="#55a5ff" r="3.5" />
        <circle cx="204" cy="347" fill="#b49aff" r="3.5" />
        <circle cx="260" cy="224" fill="#a5d1ff" r="4" />
        <circle cx="260" cy="224" r="10" stroke="#55a5ff" strokeOpacity=".38" />
      </svg>
      <div className="hero-art-caption">
        <span>Built to scale</span>
        <span className="hero-art-caption-line" />
        <span>WEB · DATA · INTELLIGENCE</span>
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    if (menuOpen) {
      document.getElementById('portfolio-navigation')
        ?.querySelector<HTMLAnchorElement>('a')
        ?.focus()
    }
  }, [menuOpen])

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('#main-content > section')]
    const directions = ['top', 'bottom', 'pop'] as const
    const revealTargets = sections.flatMap((section) => {
      if (section.id === 'top') {
        return [
          section.querySelector<HTMLElement>('.hero-copy'),
          section.querySelector<HTMLElement>('.hero-visual-wrap'),
        ]
      }

      return [
        section,
        ...section.querySelectorAll<HTMLElement>(
          '.principle-card, .skill-category, .experience-card, .portfolio-project-card, .research-card, .education-card, .certification-card, .contact-email-card, .contact-form, .faq-item',
        ),
      ]
    }).filter((element): element is HTMLElement => element !== null)

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return
    }

    revealTargets.forEach((element, index) => {
      element.dataset.reveal = directions[Math.floor(Math.random() * directions.length)]
      element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`)
    })
    document.documentElement.classList.add('reveal-ready')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 })

    revealTargets.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('reveal-ready')
    }
  }, [])

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', openSearch)
    return () => window.removeEventListener('keydown', openSearch)
  }, [])

  const isDark = theme === 'dark'
  const closeMenu = (event?: MouseEvent<HTMLAnchorElement>) => {
    if (!menuOpen) return
    setMenuOpen(false)

    if (event) {
      const targetId = event.currentTarget.hash.slice(1)
      requestAnimationFrame(() => {
        const target = document.getElementById(targetId)
        if (!target) return
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      })
    } else {
      document.querySelector<HTMLButtonElement>('.menu-trigger')?.focus()
    }
  }

  return (
    <>
      <ScrollProgress />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header
        className="site-header portfolio-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) closeMenu()
        }}
      >
        <a aria-label="Harshad Dike, home" className="brand" href="#top" onClick={closeMenu}>
          <span aria-hidden="true" className="brand-mark">HD</span>
          <span className="brand-name">HARSHAD DIKE<span> / ENGINEER</span></span>
        </a>
        <nav
          aria-label="Main navigation"
          className={`header-nav${menuOpen ? ' is-open' : ''}`}
          id="portfolio-navigation"
        >
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <div className="header-actions">
          <button
            aria-keyshortcuts="Control+K Meta+K"
            aria-label="Search portfolio"
            className="icon-button search-trigger"
            onClick={() => setSearchOpen(true)}
            title="Search (Ctrl+K)"
            type="button"
          >
            <Search aria-hidden="true" />
          </button>
          <button
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            className="icon-button theme-toggle"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={`${isDark ? 'Light' : 'Dark'} theme`}
            type="button"
          >
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <button
            aria-controls="portfolio-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="icon-button menu-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <SiteSearch onClose={() => setSearchOpen(false)} open={searchOpen} />
      </header>

      <main id="main-content">
        <section aria-labelledby="hero-title" className="hero-section section-shell" id="top">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span aria-hidden="true" className="hero-kicker-rule" />
              <span>Software Developer</span>
            </div>
            <h1 id="hero-title">
              Software Developer building{' '}
              <span>reliable, intelligent applications.</span>
            </h1>
            <p className="hero-description">
              I build full-stack applications, backend services, real-time
              experiences, and machine learning solutions using modern web
              technologies.
            </p>
            <div className="hero-location">
              <MapPin aria-hidden="true" />
              <span>Pune, Maharashtra, India</span>
            </div>
            <div className="hero-actions">
              <a
                className="button button-primary button-medium"
                href={githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                Explore My Work <ArrowUpRight aria-hidden="true" />
              </a>
              <a
                className="button button-secondary button-medium"
                href={`mailto:${emailAddress}`}
              >
                <Mail aria-hidden="true" /> Get in Touch
              </a>
            </div>
          </div>

          <div className="hero-visual-wrap" id="hero-visual">
            <HeroIllustration />
          </div>
        </section>
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ResearchSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />
        <FAQSection />
      </main>
      <PortfolioFooter />
      <FloatingActions />
    </>
  )
}
