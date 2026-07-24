'use client'

import { useEffect, useRef } from 'react'

export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = barRef.current
      if (!el) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0
      el.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'rgba(17,32,59,0.07)',
        zIndex: 60,
      }}
    >
      <div ref={barRef} style={{ height: '100%', width: '0%', background: '#b08a42' }} />
    </div>
  )
}
