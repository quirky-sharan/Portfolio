import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { smooth } from '../../lib/smooth'

const LINES = [
  ['Open for Summer ’27 internships', 'Hackathon teams', 'Freelance frontend', 'AI × Interfaces'],
  ['RAG', 'LLMs', 'React', 'GSAP', 'Three.js', 'FastAPI', 'Motion', 'Python'],
]

/* Two crossing tapes that speed up — and reverse — with your scroll. */
function Tape({ items, dir, className, rotate }) {
  const track = useRef(null)
  useGSAP(() => {
    const el = track.current
    let x = 0
    let sign = dir
    let on = false
    const tick = (_, dt) => {
      const v = smooth.lenis?.velocity ?? 0
      if (Math.abs(v) > 0.2) sign = Math.sign(v) * dir
      const speed = 0.045 + Math.min(Math.abs(v) * 0.04, 0.9)
      x -= sign * speed * (dt / 16.67)
      const half = el.scrollWidth / 2
      if (half) x = gsap.utils.wrap(-half, 0, x)
      el.style.transform = `translate3d(${x}px,0,0)`
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) gsap.ticker.add(tick)
      if (!e.isIntersecting && on) gsap.ticker.remove(tick)
      on = e.isIntersecting
    })
    io.observe(el.parentElement)
    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
    }
  })
  const row = [...items, ...items]
  return (
    <div
      className={`-mx-[4vw] overflow-hidden py-3 md:py-4 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((t, i) => (
              <span
                key={i}
                className="display flex items-center whitespace-nowrap text-[clamp(34px,4.6vw,80px)] leading-none"
              >
                <span className="px-[0.35em]">{t}</span>
                <svg viewBox="0 0 24 24" className="size-[0.5em] shrink-0" aria-hidden="true">
                  <path
                    d="M12 0l2.4 8.2L22.4 4 17.6 12l4.8 8-8-4.2L12 24l-2.4-8.2-8 4.2 4.8-8-4.8-8 8 4.2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section className="relative z-10 overflow-hidden bg-paper-2 py-[9vh]" aria-label="Availability">
      <div className="relative">
        <Tape items={LINES[1]} dir={-1} rotate={2.2} className="bg-ink text-paper/90" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <Tape
            items={LINES[0]}
            dir={1}
            rotate={-2.6}
            className="bg-signal text-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </section>
  )
}
