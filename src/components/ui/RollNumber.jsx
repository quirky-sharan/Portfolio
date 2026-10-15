import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'

const STRIP = Array.from({ length: 30 }, (_, i) => i % 10)

/* Slot-machine digits that spin into place when scrolled into view. */
export default function RollNumber({ value, className = '', delay = 0 }) {
  const ref = useRef(null)
  const chars = String(value).split('')

  useGSAP(
    () => {
      const strips = gsap.utils.toArray('.rn-strip', ref.current)
      strips.forEach((s) => {
        const d = Number(s.dataset.digit)
        gsap.fromTo(
          s,
          { yPercent: 0 },
          {
            yPercent: -((20 + d) / 30) * 100,
            duration: 2.1,
            ease: 'expo',
            delay: delay + Number(s.dataset.i) * 0.12,
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          },
        )
      })
    },
    { scope: ref, dependencies: [value] },
  )

  return (
    <span ref={ref} className={`inline-flex ${className}`} aria-label={String(value)}>
      {chars.map((c, i) =>
        /\d/.test(c) ? (
          <span key={i} className="mask relative inline-block h-[1em] leading-none" aria-hidden="true">
            <span className="rn-strip flex flex-col" data-digit={c} data-i={i}>
              {STRIP.map((n, j) => (
                <span key={j} className="block h-[1em] leading-none">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className="inline-block h-[1em] leading-none" aria-hidden="true">
            {c}
          </span>
        ),
      )}
    </span>
  )
}
