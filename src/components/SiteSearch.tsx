import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import { searchableContent } from '../data/portfolio'
import { skillCategories } from '../data/skills'

type SearchEntry = {
  title: string
  section: string
  keywords: string
}

const searchEntries: SearchEntry[] = [
  ...searchableContent,
  ...skillCategories.map((category) => ({
    title: category.name,
    section: 'skills',
    keywords: `${category.description} ${category.skills.map((skill) => skill.name).join(' ')}`,
  })),
]

export function SiteSearch({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase()

  const results = useMemo(() => {
    if (!normalizedQuery) return searchEntries.slice(0, 6)
    return searchEntries.filter((entry) =>
      `${entry.title} ${entry.keywords}`.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [normalizedQuery])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      const activeElement = document.activeElement
      returnFocusRef.current = activeElement instanceof HTMLElement && activeElement !== document.body
        ? activeElement
        : document.querySelector<HTMLElement>('.search-trigger')
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function close(restoreFocus = true) {
    setQuery('')
    if (dialogRef.current?.open) dialogRef.current.close()
    onClose()
    if (restoreFocus) {
      requestAnimationFrame(() => returnFocusRef.current?.focus())
    }
  }

  function navigateToResult(event: MouseEvent<HTMLAnchorElement>) {
    const targetId = event.currentTarget.hash.slice(1)
    close(false)
    requestAnimationFrame(() => {
      const target = document.getElementById(targetId)
      if (!target) return
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    })
  }

  return (
    <dialog
      aria-labelledby="site-search-title"
      className="search-dialog"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close()
      }}
      ref={dialogRef}
    >
      <div className="search-dialog-content">
        <div className="search-dialog-heading">
          <div>
            <span className="eyebrow">PORTFOLIO SEARCH</span>
            <h2 id="site-search-title">Find something.</h2>
          </div>
          <button aria-label="Close search" className="icon-button" onClick={() => close()} type="button">
            <X aria-hidden="true" />
          </button>
        </div>
        <label className="search-input-wrap">
          <Search aria-hidden="true" />
          <span className="visually-hidden">Search portfolio</span>
          <input
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills, projects, experience..."
            ref={inputRef}
            type="search"
            value={query}
          />
          <kbd>ESC</kbd>
        </label>
        <ul className="search-results" aria-label="Search results">
          {results.map((result) => (
            <li key={`${result.section}-${result.title}`}>
              <a href={`#${result.section}`} onClick={navigateToResult}>
                <span>{result.title}</span>
                <ArrowRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <p className="search-empty" role="status">
            No matching sections. Try a project, skill, or topic.
          </p>
        )}
        <p className="search-hint">Search stays on this device; no query is sent to a server.</p>
      </div>
    </dialog>
  )
}
