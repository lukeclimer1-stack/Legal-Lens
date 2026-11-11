'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface OpenTerm {
  term: string
  slug: string
  definition: string
  top: number
  left: number
  arrowLeft: number
}

const CARD_WIDTH = 320
const EDGE = 12

/**
 * Shows a plain-English definition when a reader taps or clicks an underlined legal term.
 * The terms themselves are marked up at build time by annotateGlossaryTerms (lib/glossary.ts).
 */
export default function GlossaryPopover() {
  const [open, setOpen] = useState<OpenTerm | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const close = useCallback((returnFocus = false) => {
    const anchor = anchorRef.current
    if (anchor) {
      anchor.setAttribute('aria-expanded', 'false')
      if (returnFocus) anchor.focus()
    }
    anchorRef.current = null
    setOpen(null)
  }, [])

  const show = useCallback(
    (el: HTMLElement) => {
      if (anchorRef.current === el) {
        close()
        return
      }
      if (anchorRef.current) anchorRef.current.setAttribute('aria-expanded', 'false')
      const rect = el.getBoundingClientRect()
      const width = Math.min(CARD_WIDTH, window.innerWidth - EDGE * 2)
      const center = rect.left + rect.width / 2
      const left = Math.max(EDGE, Math.min(center - width / 2, window.innerWidth - width - EDGE))
      anchorRef.current = el
      el.setAttribute('aria-expanded', 'true')
      setOpen({
        term: el.dataset.term || el.textContent || '',
        slug: el.dataset.slug || '',
        definition: el.dataset.def || '',
        top: rect.bottom + window.scrollY + 10,
        left: left + window.scrollX,
        arrowLeft: Math.max(16, Math.min(center - left, width - 16)),
      })
    },
    [close]
  )

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const term = target?.closest?.('.gloss') as HTMLElement | null
      if (term) {
        e.preventDefault()
        show(term)
        return
      }
      if (cardRef.current && target && cardRef.current.contains(target)) return
      if (anchorRef.current) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && anchorRef.current) {
        close(true)
        return
      }
      const target = e.target as HTMLElement | null
      if ((e.key === 'Enter' || e.key === ' ') && target?.classList?.contains('gloss')) {
        e.preventDefault()
        show(target)
      }
    }
    const onResize = () => {
      if (anchorRef.current) close()
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [show, close])

  if (!open) return null

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-label={`Definition of ${open.term}`}
      className="gloss-card"
      style={{ top: open.top, left: open.left, width: `min(${CARD_WIDTH}px, calc(100vw - ${EDGE * 2}px))` }}
    >
      <span className="gloss-card-arrow" style={{ left: open.arrowLeft }} aria-hidden="true" />
      <div className="gloss-card-head">
        <span className="gloss-card-label">In plain English</span>
        <button type="button" className="gloss-card-close" aria-label="Close definition" onClick={() => close(true)}>
          ×
        </button>
      </div>
      <p className="gloss-card-term">{open.term}</p>
      <p className="gloss-card-def" aria-live="polite">
        {open.definition}
      </p>
      <Link href={`/glossary#${open.slug}`} className="gloss-card-link">
        Full glossary →
      </Link>
    </div>
  )
}
