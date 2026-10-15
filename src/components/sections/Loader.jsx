import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { smooth } from '../../lib/smooth'
import { scripts } from '../../data/content'
import Cat from '../ui/Cat'

const SEEN_KEY = 'ss:intro-seen'

function waitForFonts(timeout = 1600) {
  const fonts = document.fonts?.ready ?? Promise.resolve()
  return Promise.race([fonts, new Promise((r) => setTimeout(r, timeout))])
}

/*
 * Intro: the name resolves through every script Sharan speaks, then
 * Tok walks in and shoves the black curtain off-screen, revealing the
 * hero underneath (huyml.co's push, reimagined).
 */
export default function Loader({ onReveal, onDone }) {
  const root = useRef(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      let cancelled = false
      const q = gsap.utils.selector(root)
      const curtain = q('.ld-curtain')[0]
      const mascot = q('.ld-mascot')[0]
      const counter = q('.ld-count')[0]
      const names = q('.ld-name')
      const langs = q('.ld-lang')

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let seen = false
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === '1'
      } catch {
        /* storage blocked — play the full intro */
      }

      if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
      smooth.lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      document.getElementById('boot')?.remove()

      // The page is usable the moment the curtain is gone; Tok just
      // finishes walking off-screen on top of it.
      let released = false
      const release = () => {
        if (released) return
        released = true
        root.current.style.pointerEvents = 'none'
        document.documentElement.style.overflow = ''
        smooth.lenis?.start()
        try {
          sessionStorage.setItem(SEEN_KEY, '1')
        } catch {
          /* ignore */
        }
        onDone?.()
      }
      const finish = () => {
        release()
        setGone(true)
      }

      gsap.set(names, { yPercent: 110 })
      gsap.set(q('.ld-meta'), { autoAlpha: 0, y: 10 })
      mascot.style.transform = `translate3d(${-mascot.offsetWidth - 20}px,0,0)`

      // Tok walks along the top of the hero name if there is room for it.
      const placeMascot = () => {
        const mh = mascot.offsetHeight
        let top = window.innerHeight / 2 - mh / 2
        const nameEl = document.querySelector('[data-hero-name]')
        if (nameEl) {
          const r = nameEl.getBoundingClientRect()
          const t = r.top - mh * 0.93 + r.height * 0.06
          if (t > 70) top = t
        }
        mascot.style.top = `${top}px`
      }

      const run = async () => {
        await waitForFonts()
        if (cancelled) return
        placeMascot()

        if (reduce) {
          onReveal?.()
          gsap.to(root.current, { autoAlpha: 0, duration: 0.5, ease: 'power1.out', onComplete: finish })
          return
        }

        const tl = gsap.timeline()
        const step = seen ? 0.22 : 0.56
        const count = { v: 0 }
        const total = step * scripts.length + 0.35

        tl.to(q('.ld-meta'), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0)
        tl.to(
          count,
          {
            v: 100,
            duration: total,
            ease: 'power2.inOut',
            onUpdate: () => {
              counter.textContent = String(Math.round(count.v)).padStart(3, '0')
            },
          },
          0,
        )
        tl.to(q('.ld-bar-fill'), { scaleX: 1, duration: total, ease: 'power2.inOut' }, 0)

        names.forEach((el, i) => {
          const t = 0.15 + i * step
          tl.to(el, { yPercent: 0, duration: seen ? 0.35 : 0.6, ease: 'expo' }, t)
          tl.call(() => langs.forEach((l, j) => l.classList.toggle('is-on', j <= i)), null, t)
          if (i < names.length - 1) {
            tl.to(el, { yPercent: -110, duration: seen ? 0.3 : 0.5, ease: 'quart' }, t + step - (seen ? 0.12 : 0.2))
          }
        })

        // clear the stage, then push
        const pushAt = 0.15 + step * scripts.length + (seen ? 0.05 : 0.12)
        tl.to(q('.ld-stage'), { yPercent: -18, autoAlpha: 0, duration: 0.6, ease: 'quart' }, pushAt - 0.2)
        tl.to(q('.ld-meta'), { autoAlpha: 0, duration: 0.3 }, pushAt - 0.2)
        tl.call(() => onReveal?.(), null, pushAt)

        const edge = { x: 0 }
        const vw = () => window.innerWidth
        tl.to(
          edge,
          {
            x: () => vw() + mascot.offsetWidth + 40,
            duration: seen ? 1.2 : 2.2,
            ease: 'push',
            onUpdate: () => {
              const clip = Math.min(100, (Math.max(0, edge.x) / vw()) * 100)
              curtain.style.clipPath = `inset(0 0 0 ${clip}%)`
              mascot.style.transform = `translate3d(${edge.x - mascot.offsetWidth}px,0,0)`
              if (clip >= 100) release()
            },
          },
          pushAt,
        )
        tl.call(finish)
      }
      run()

      return () => {
        cancelled = true
        document.documentElement.style.overflow = ''
      }
    },
    { scope: root },
  )

  if (gone) return null

  return (
    <div ref={root} className="fixed inset-0 z-[100] pointer-events-auto" aria-hidden="true">
      <div className="ld-curtain absolute inset-0 bg-ink text-paper" style={{ clipPath: 'inset(0 0 0 0%)' }}>
        <div className="pad-x absolute inset-x-0 top-0 flex justify-between pt-5 label text-paper/60">
          <span className="ld-meta">Sharan Soni — Portfolio ©2026</span>
          <span className="ld-meta hidden sm:block">Loading 4 scripts</span>
        </div>

        <div className="ld-stage absolute inset-0 grid place-items-center">
          <div className="relative w-full text-center">
            <div className="mask relative h-[1.25em] text-[clamp(44px,10.5vw,170px)] leading-[1.2]">
              {scripts.map((s) => (
                <span
                  key={s.lang}
                  className={`ld-name absolute inset-x-0 top-0 whitespace-nowrap ${s.className}`}
                  style={s.lang === 'EN' ? { fontStretch: '62%', fontWeight: 800, lineHeight: 1.2 } : undefined}
                >
                  {s.text}
                </span>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-5 label">
              {scripts.map((s) => (
                <span key={s.lang} className="ld-lang">
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="ld-meta pad-x absolute inset-x-0 bottom-0 pb-5">
          <div className="flex items-end justify-between">
            <span className="ld-count display text-[clamp(64px,11vw,180px)] tabular-nums">000</span>
            <span className="label text-paper/60 pb-2">Half model. Half motion.</span>
          </div>
          <div className="mt-3 h-px w-full bg-paper/15">
            <div className="ld-bar-fill h-full origin-left scale-x-0 bg-signal" />
          </div>
        </div>
      </div>

      <div className="ld-mascot absolute left-0 top-1/2 will-change-transform">
        <Cat pose="push" style={{ width: 'clamp(170px, 29vh, 310px)', display: 'block' }} />
      </div>
    </div>
  )
}
