import { useEffect, useRef, useState } from 'react'
import { smooth } from '../../lib/smooth'
import { useReducedMotion } from '../../lib/hooks'
import Cat from './Cat'

/* The cat doubles as a scroll-progress bar: it walks along the bottom
   edge as you scroll, turns around when you scroll back up, and steps
   aside when the footer (where it waves goodbye) comes into view. */
export default function ScrollCat({ ready }) {
  const wrap = useRef(null)
  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState(1)
  const [hidden, setHidden] = useState(true)
  const [onDark, setOnDark] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!ready || reduce) return
    let idle
    let footerIn = false
    let lastP = -1
    let lastProbe = 0
    const el = wrap.current
    let w = el.offsetWidth

    // what's under the cat only changes every few hundred pixels, so a hit
    // test ten times a second is plenty (it forces a hit-test pass)
    const probe = (now) => {
      if (now - lastProbe < 100) return
      lastProbe = now
      const r = el.getBoundingClientRect()
      const under = document.elementFromPoint(r.left + r.width / 2, r.bottom - 4)
      setOnDark(under?.closest('[data-theme]')?.dataset.theme === 'dark')
    }

    const place = () => {
      const lenis = smooth.lenis
      let p
      let y
      if (lenis) {
        p = lenis.progress || 0
        y = lenis.animatedScroll
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight
        y = window.scrollY
        p = max > 0 ? y / max : 0
      }
      p = Math.min(1, Math.max(0, p))
      const pad = 12
      el.style.transform = `translate3d(${pad + p * (window.innerWidth - w - pad * 2)}px,0,0)`
      setHidden(footerIn || y < window.innerHeight * 0.6)
      probe(performance.now())
      if (lastP >= 0 && Math.abs(p - lastP) > 0.00005) {
        setFacing(p > lastP ? 1 : -1)
        setWalking(true)
        clearTimeout(idle)
        idle = setTimeout(() => {
          setWalking(false)
          lastProbe = 0
          probe(performance.now())
        }, 180)
      }
      lastP = p
    }

    const onResize = () => {
      w = el.offsetWidth
      lastProbe = 0
      place()
    }

    const footer = document.querySelector('footer')
    const io = new IntersectionObserver(([e]) => {
      footerIn = e.isIntersecting
      place()
    })
    if (footer) io.observe(footer)

    const lenis = smooth.lenis
    let off
    if (lenis) {
      lenis.on('scroll', place)
      off = () => lenis.off('scroll', place)
    } else {
      window.addEventListener('scroll', place, { passive: true })
      off = () => window.removeEventListener('scroll', place)
    }
    window.addEventListener('resize', onResize)
    place()
    return () => {
      off()
      io.disconnect()
      window.removeEventListener('resize', onResize)
      clearTimeout(idle)
    }
  }, [ready, reduce])

  if (reduce) return null

  return (
    <div
      ref={wrap}
      className="pointer-events-none fixed bottom-1 left-0 z-40 w-[32px] transition-opacity duration-500 sm:w-[40px] md:w-[52px]"
      style={{ opacity: hidden ? 0 : 1 }}
      aria-hidden="true"
    >
      <div style={{ transform: `scaleX(${facing})`, transition: 'transform .25s' }}>
        <Cat pose="walk" walking={walking} line={onDark ? '#eeece6' : undefined} />
      </div>
    </div>
  )
}
