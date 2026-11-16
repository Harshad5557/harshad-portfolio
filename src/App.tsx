import { memo, useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Menu, Mail, MapPin, Search, X } from 'lucide-react';
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
} from './components/ContentSections';
import { FloatingActions, ScrollProgress } from './components/SiteControls';
import { SiteSearch } from './components/SiteSearch';
import { InkTransition } from './ink/inkTransition';
import { iconShapePath, iconShapePoints } from './ink/iconShape';

type Theme = 'dark' | 'light';

const githubUrl = 'https://github.com/Harshad5557';
const emailAddress = 'harshaddike1232@gmail.com';

function getInitialTheme(): Theme {
  const initialTheme = document.documentElement.dataset.theme;
  if (initialTheme === 'light' || initialTheme === 'dark') return initialTheme;
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function HeroIllustration() {
  return (
    <div aria-hidden="true" className="hero-art">
      <img className="hero-portrait" src="/harshad-portrait.png" alt="" />
    </div>
  );
}

const ThemeToggleIcon = memo(function ThemeToggleIcon({ initialTheme }: { initialTheme: Theme }) {
  const isDark = initialTheme === 'dark';
  const rays = [
    [12, 1.5, 12, 4],
    [12, 20, 12, 22.5],
    [1.5, 12, 4, 12],
    [20, 12, 22.5, 12],
    [4.58, 4.58, 6.35, 6.35],
    [17.65, 17.65, 19.42, 19.42],
    [17.65, 6.35, 19.42, 4.58],
    [4.58, 19.42, 6.35, 17.65],
  ];

  return (
    <svg
      aria-hidden="true"
      fill="none"
      style={{ transform: isDark ? 'rotate(-25deg)' : undefined }}
      viewBox="0 0 24 24"
    >
      <g
        className="theme-toggle__rays"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      >
        {rays.map(([x1, y1, x2, y2], index) => (
          <line key={index} opacity={isDark ? 0 : 1} x1={x1} x2={x2} y1={y1} y2={y2} />
        ))}
      </g>
      <path
        className="theme-toggle__body"
        d={iconShapePath(iconShapePoints(initialTheme))}
        fill="currentColor"
      />
    </svg>
  );
});

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inkTransition = useRef<InkTransition | null>(null);
  const initialTheme = useRef(theme).current;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.portfolio-header');
    if (!header) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'ink-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('data-html2canvas-ignore', '');
    header.append(canvas);

    const transition = new InkTransition(
      canvas,
      header.querySelector<HTMLButtonElement>('.theme-toggle'),
    );
    inkTransition.current = transition;

    return () => {
      transition.destroy();
      canvas.remove();
      inkTransition.current = null;
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document
        .getElementById('portfolio-navigation')
        ?.querySelector<HTMLAnchorElement>('a')
        ?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('#main-content > section')];
    const directions = ['top', 'bottom', 'pop'] as const;
    const revealTargets = sections
      .flatMap((section) => {
        if (section.id === 'top') {
          return [
            section.querySelector<HTMLElement>('.hero-copy'),
            section.querySelector<HTMLElement>('.hero-visual-wrap'),
          ];
        }

        return [
          section,
          ...section.querySelectorAll<HTMLElement>(
            '.principle-card, .skill-category, .experience-card, .portfolio-project-card, .research-card, .education-card, .certification-card, .contact-email-card, .contact-form, .faq-item',
          ),
        ];
      })
      .filter((element): element is HTMLElement => element !== null);

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    revealTargets.forEach((element, index) => {
      element.dataset.reveal = directions[Math.floor(Math.random() * directions.length)];
      element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    });
    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );

    revealTargets.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  const isDark = theme === 'dark';
  const closeMenu = (event?: MouseEvent<HTMLAnchorElement>) => {
    if (!menuOpen) return;
    setMenuOpen(false);

    if (event) {
      const targetId = event.currentTarget.hash.slice(1);
      requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    } else {
      document.querySelector<HTMLButtonElement>('.menu-trigger')?.focus();
    }
  };

  return (
    <>
      <ScrollProgress />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header
        className="site-header portfolio-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) closeMenu();
        }}
      >
        <a aria-label="Harshad Dike, home" className="brand" href="#top" onClick={closeMenu}>
          <span aria-hidden="true" className="brand-mark">
            HD
          </span>
          <span className="brand-name">
            HARSHAD DIKE<span> / ENGINEER</span>
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className={`header-nav${menuOpen ? ' is-open' : ''}`}
          id="portfolio-navigation"
        >
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="#skills" onClick={closeMenu}>
            Skills
          </a>
          <a href="#projects" onClick={closeMenu}>
            Projects
          </a>
          <a href="#experience" onClick={closeMenu}>
            Experience
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
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
            aria-pressed={isDark}
            className="icon-button theme-toggle"
            data-ink-live
            onClick={(event) => {
              const nextTheme = isDark ? 'light' : 'dark';
              const point = event.detail === 0 ? undefined : { x: event.clientX, y: event.clientY };
              if (inkTransition.current) {
                inkTransition.current.toggle(point, undefined, setTheme);
              } else {
                document.documentElement.dataset.theme = nextTheme;
                setTheme(nextTheme);
              }
            }}
            title={`${isDark ? 'Light' : 'Dark'} theme`}
            type="button"
          >
            <ThemeToggleIcon initialTheme={initialTheme} />
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
              Software Developer building <span>reliable, intelligent applications.</span>
            </h1>
            <p className="hero-description">
              I build full-stack applications, backend services, real-time experiences, and machine
              learning solutions using modern web technologies.
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
              <a className="button button-secondary button-medium" href={`mailto:${emailAddress}`}>
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
  );
}
