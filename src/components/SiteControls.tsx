import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
        const nextProgress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0
        setProgress(Math.min(100, Math.max(0, nextProgress)))
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      aria-label="Page reading progress"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(progress)}
      className="scroll-progress"
      role="progressbar"
    >
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  )
}

export function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const update = () => setShowBackToTop(window.scrollY > 500)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (!showBackToTop) return null

  return (
    <aside aria-label="Quick actions" className="floating-actions">
      <button
        aria-label="Back to top"
        className="back-to-top"
        onClick={() => window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        })}
        type="button"
      >
        <ArrowUp aria-hidden="true" />
      </button>
    </aside>
  )
}
