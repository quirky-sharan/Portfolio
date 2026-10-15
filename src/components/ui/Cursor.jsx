import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { useFinePointer, useReducedMotion } from '../../lib/hooks'

/* A vermilion caret that follows the mouse and grows into a label over
   anything with data-cursor="…". Desktop / fine pointers only. */
export default function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const dot = useRef(null)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (!fine || reduce) return
    document.documentElement.classList.add('has-cursor')
    const el = dot.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    let current = ''
    let x = -1
    let y = -1
    let raf = 0

    const read = (target) => {
      const t = target?.closest?.('[data-cursor]')
      let next = t ? t.getAttribute('data-cursor') : ''
      // over the toolbox: only say “drag” when actually over a chip
      const zone = target?.closest?.('[data-cursor-zone="drag"] canvas')
      if (zone) {
        const host = zone.parentElement?.parentElement
        if (host?.dataset.dragging === 'true') next = 'Throw'
        else if (host?.dataset.hover === 'true') next = 'Drag'
      }
      if (next !== current) {
        current = next
        setLabel(next)
      }
    }
    // a click can flip a label (Visual ⇄ Brief) and scrolling slides new
    // things under a still mouse, so look again without waiting for a move
    const reread = () => {
      if (raf || x < 0) return
      raf = requestAnimationFrame(() => {
        raf = 0
        read(document.elementFromPoint(x, y))
      })
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      xTo(x)
      yTo(y)
      setHidden(false)
      // near the right edge the label goes on the pointer's left instead
      setFlip(x > window.innerWidth - 160)
      read(e.target)
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => setHidden(true)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('click', reread)
    window.addEventListener('scroll', reread, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('click', reread)
      window.removeEventListener('scroll', reread)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [fine, reduce])

  if (!fine || reduce) return null

  const big = !!label
  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[120]"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity .3s' }}
      aria-hidden="true"
    >
      <div
        className="label flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-signal text-paper"
        style={{
          width: big ? 'auto' : down ? 8 : 12,
          height: big ? 30 : down ? 8 : 12,
          padding: big ? '0 12px' : 0,
          // the label sits beside the pointer, so it never hides what you're about to click
          transform: !big
            ? 'translate(-50%, -50%)'
            : flip
              ? 'translate(calc(-100% - 14px), 4px)'
              : 'translate(14px, 4px)',
          transition:
            'width .35s var(--ease-out-expo), height .35s var(--ease-out-expo), padding .35s var(--ease-out-expo), transform .35s var(--ease-out-expo)',
        }}
      >
        {big && <span>{label}</span>}
      </div>
    </div>
  )
}
