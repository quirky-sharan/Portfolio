import { useLayoutEffect, useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useFinePointer, useIsDesktop } from '../../lib/hooks'
import { hero, person } from '../../data/content'
import Token from '../ui/Token'

const BASE = { wght: 820, wdth: 62 }
const PEAK = { wght: 180, wdth: 96 }

/* The giant name: fitted edge-to-edge, and on desktop each letter thins
   out and widens as the cursor passes over it (Archivo's wght/wdth axes). */
function HeroName({ interactive }) {
  const ref = useRef(null)
  const isDesktop = useIsDesktop()
  const lines = isDesktop ? [person.name.toUpperCase()] : [person.first.toUpperCase(), person.last.toUpperCase()]

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const letters = [...el.querySelectorAll('.hn-l')]
    const fit = () => {
      const lineEls = [...el.querySelectorAll('.hn-line')]
      letters.forEach((l) => {
        l.style.width = ''
        l.style.fontVariationSettings = ''
      })
      // measure the real laid-out line (kerning, spacer and all) at 100px
      el.style.fontSize = '100px'
      lineEls.forEach((L) => {
        L.style.width = 'max-content'
        L.style.justifyContent = 'flex-start'
      })
      const natural = Math.max(...lineEls.map((L) => L.getBoundingClientRect().width))
      lineEls.forEach((L) => {
        L.style.width = ''
        L.style.justifyContent = ''
      })
      if (!natural) return
      el.style.fontSize = `${(el.clientWidth / natural) * 100 * 0.997}px`
      letters.forEach((l) => {
        l.style.width = `${l.getBoundingClientRect().width}px`
      })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [isDesktop])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !interactive) return
    const letters = [...el.querySelectorAll('.hn-l')]
    const state = letters.map(() => ({ t: 0, v: 0 }))
    let px = -9999
    let py = -9999
    let running = false

    const apply = () => {
      let moving = false
      const radius = window.innerWidth * 0.14
      const rects = letters.map((l) => l.getBoundingClientRect())
      letters.forEach((l, i) => {
        const r = rects[i]
        const dx = px - (r.left + r.width / 2)
        const dy = Math.max(0, Math.abs(py - (r.top + r.height / 2)) - r.height * 0.35)
        const d = Math.hypot(dx, dy * 1.4)
        const s = state[i]
        s.t = Math.exp(-((d / radius) ** 2))
        s.v += (s.t - s.v) * 0.14
        if (Math.abs(s.t - s.v) > 0.002) moving = true
        const wg = BASE.wght + (PEAK.wght - BASE.wght) * s.v
        const wd = BASE.wdth + (PEAK.wdth - BASE.wdth) * s.v
        l.style.fontVariationSettings = `'wght' ${wg.toFixed(1)}, 'wdth' ${wd.toFixed(1)}`
      })
      if (!moving) {
        gsap.ticker.remove(apply)
        running = false
      }
    }
    const kick = () => {
      if (!running) {
        running = true
        gsap.ticker.add(apply)
      }
    }
    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      kick()
    }
    const onLeave = () => {
      px = -9999
      py = -9999
      kick()
    }
    const zone = el.closest('section')
    zone.addEventListener('pointermove', onMove)
    zone.addEventListener('pointerleave', onLeave)
    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerleave', onLeave)
      gsap.ticker.remove(apply)
    }
  }, [interactive, isDesktop])

  return (
    <h1 ref={ref} data-hero-name className="hero-name display relative w-full select-none" aria-label={person.name}>
      {lines.map((line, li) => (
        <span
          key={line}
          className={`hn-line flex w-full ${lines.length > 1 && li === 1 ? 'justify-end' : 'justify-between'}`}
          aria-hidden="true"
        >
          {[...line].map((ch, i) =>
            ch === ' ' ? (
              <span key={i} className="w-[0.16em] shrink-0" />
            ) : (
              <span key={i} className="hn-mask inline-block shrink-0 pb-[0.02em]">
                <span className="hn-l inline-flex justify-center">{ch}</span>
              </span>
            ),
          )}
        </span>
      ))}
    </h1>
  )
}

export default function Hero({ play }) {
  const root = useRef(null)
  const fine = useFinePointer()

  // Hidden until the curtain has gone.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('.hx-word'), { yPercent: 115 })
      gsap.set(q('.token-chip'), { scaleX: 0 })
      gsap.set(q('.token-id'), { autoAlpha: 0 })
      gsap.set(q('.hx-fade'), { autoAlpha: 0, y: 18 })
      gsap.set(q('.hx-line'), { scaleY: 0 })
      gsap.set(q('.hx-rule'), { scaleX: 0 })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!play) return
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ defaults: { ease: 'expo' } })
      tl.to(q('.hx-line'), { scaleY: 1, duration: 1.6, stagger: 0.08, ease: 'quart' }, 0)
        .to(q('.hx-word'), { yPercent: 0, duration: 1.3, stagger: 0.08 }, 0.05)
        .to(q('.token-chip'), { scaleX: 1, duration: 1, stagger: 0.15, ease: 'quart' }, 0.55)
        .to(q('.token-id'), { autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 0.95)
        .to(q('.hx-rule'), { scaleX: 1, duration: 1.2, stagger: 0.06, ease: 'quart' }, 0.3)
        .to(q('.hx-fade'), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.05 }, 0.35)
    },
    { scope: root, dependencies: [play] },
  )

  return (
    <section
      id="top"
      ref={root}
      data-theme="light"
      className="hero sticky top-0 h-[100svh] min-h-[600px] overflow-hidden bg-paper"
    >
      <div className="hero-inner relative flex h-full flex-col origin-[50%_0%]">
        {/* grid lines */}
        <div className="pointer-events-none absolute inset-0 pad-x" aria-hidden="true">
          <div className="relative grid h-full grid-cols-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`hx-line absolute top-0 h-full w-px origin-top bg-ink/[0.07] ${i > 0 && i < 4 ? 'hidden md:block' : ''}`}
                style={{ left: `${i * 25}%` }}
              />
            ))}
          </div>
        </div>

        <div className="relative grid flex-1 grid-cols-12 gap-x-4 pad-x pt-[calc(var(--header-h)+5vh)] md:gap-x-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="hx-fade label mb-[3vh] flex items-center gap-3 text-smoke">
              <span className="text-ink">(01)</span> {hero.kicker}{' '}
              <span className="hidden sm:inline">— AI/ML × Frontend</span>
            </p>
            <p className="serif text-[clamp(58px,9.4vw,168px)] leading-[0.86]">
              <span className="block mask pb-[0.06em]">
                <span className="hx-word inline-block">Half&nbsp;</span>
                <span className="hx-word inline-block italic">
                  <Token color="var(--color-lime)" id="tok 2746">
                    model.
                  </Token>
                </span>
              </span>
              <span className="block mask pb-[0.08em] pt-[0.18em] -mt-[0.18em]">
                <span className="hx-word inline-block">Half&nbsp;</span>
                <span className="hx-word inline-block italic">
                  <Token color="var(--color-pink)" id="tok 11597">
                    motion.
                  </Token>
                </span>
              </span>
            </p>
          </div>

          <div className="col-span-12 mt-8 self-end pb-8 sm:col-span-9 md:col-span-7 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:pb-[4vh]">
            <p className="hx-fade max-w-[34ch] text-[15px] leading-[1.45] text-ink/80 md:text-base">{hero.intro}</p>
            <dl className="mt-6">
              {hero.facts.map((f) => (
                <div key={f.k} className="relative grid grid-cols-[64px_1fr] gap-3 py-2.5 text-[13px]">
                  <span className="hx-rule absolute inset-x-0 top-0 h-px origin-left bg-ink/15" />
                  <dt className="hx-fade label pt-[2px] text-smoke">{f.k}</dt>
                  <dd className="hx-fade">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative pad-x pb-[1.2vh]">
          <div className="hx-fade label mb-3 flex items-end justify-between text-smoke">
            <span className="flex items-center gap-3">
              <span className="relative block h-7 w-px overflow-hidden bg-ink/15">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-in-out-quart)_infinite] bg-ink" />
              </span>
              Scroll
            </span>
            <span className="hidden tabular-nums md:block">12.92°N · 79.13°E</span>
            <span>{person.location.split(',')[0]} — IN</span>
          </div>
          <HeroName interactive={play && fine} />
        </div>
      </div>
      <div className="hero-shade pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden="true" />
    </section>
  )
}
