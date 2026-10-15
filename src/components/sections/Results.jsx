import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { person, results } from '../../data/content'
import RollText from '../ui/RollText'

const BADGE = {
  P1: { bg: 'var(--color-signal)', fg: 'var(--color-paper)', hover: 'var(--color-signal)' },
  P2: { bg: 'var(--color-paper)', fg: 'var(--color-ink)', hover: 'var(--color-paper)' },
  PAT: { bg: 'var(--color-lilac)', fg: 'var(--color-ink)', hover: 'var(--color-lilac)' },
  FIN: { bg: 'transparent', fg: 'var(--color-paper)', hover: 'var(--color-ink-2)' },
}

/* Hackathons as an F1 timing board. */
export default function Results() {
  const root = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      // F1 start: five lights come on as you scroll in… then lights out,
      // and the classification races onto the board.
      const lights = q('.rs-light')
      const status = q('.rs-status')[0]
      const rows = q('.rs-row')
      gsap.set(rows, { xPercent: -8, clipPath: 'inset(0 100% 0 0)' })
      let raced = false
      let said = ''
      const say = (t) => {
        if (t !== said) status.textContent = said = t
      }
      const race = () => {
        lights.forEach((l) => l.classList.remove('is-on'))
        say('Lights out — and away we go')
        if (raced) return
        raced = true
        gsap.to(rows, { xPercent: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo', stagger: 0.07 })
      }
      ScrollTrigger.create({
        trigger: q('.rs-board')[0],
        start: 'top 95%',
        end: 'top 45%',
        onUpdate: (self) => {
          if (self.progress >= 0.999) return race()
          const on = Math.min(5, Math.floor(self.progress * 6))
          lights.forEach((l, i) => l.classList.toggle('is-on', i < on))
          say(on ? `Start sequence ${on}/5` : 'Grid is forming')
        },
        onLeave: race,
        onRefresh: (self) => self.progress >= 0.999 && race(),
      })
      gsap.from(q('.rs-title .rs-c'), {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      })
      gsap.to(q('.rs-checkers'), {
        backgroundPositionX: '+=200px',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  const title = 'Results'

  return (
    <section id="results" ref={root} data-theme="dark" className="relative overflow-hidden bg-ink pb-[14vh] text-paper">
      <div className="rs-checkers checkers h-6 w-full text-paper/90 [--c:12px]" aria-hidden="true" />

      <div className="pad-x pt-[12vh]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-paper/50">
              <span className="text-paper">(05)</span> Hackathons &amp; recognition
            </p>
            <h2 data-skew className="rs-title display mask mt-4 text-[clamp(84px,15vw,270px)]">
              {[...title].map((c, i) => (
                <span key={i} className="rs-c inline-block">
                  {c}
                </span>
              ))}
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 pb-3 md:items-end">
            <div className="flex gap-1.5 rounded-[10px] bg-[#1b1b18] p-2 ring-1 ring-paper/10" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="rs-light grid gap-1.5 rounded-[6px] bg-black/50 p-1.5">
                  <i className="block size-3.5 rounded-full md:size-4" />
                  <i className="block size-3.5 rounded-full md:size-4" />
                </span>
              ))}
            </div>
            <span className="rs-status label text-paper/60" aria-hidden="true">
              Grid is forming
            </span>
          </div>
        </div>

        <div className="rs-board mt-10">
          <div className="label hidden grid-cols-12 gap-4 border-b border-paper/15 pb-3 text-paper/40 md:grid">
            <span className="col-span-1">Pos</span>
            <span className="col-span-4">Event</span>
            <span className="col-span-3">Organiser</span>
            <span className="col-span-3">Result</span>
            <span className="col-span-1 text-right">Prize</span>
          </div>
          <ul>
            {results.map((r, i) => {
              const b = BADGE[r.pos] ?? BADGE.FIN
              return (
                <li
                  key={r.event}
                  className="rs-row group relative grid grid-cols-12 items-center gap-x-4 gap-y-1 border-b border-paper/15 py-4 md:py-5"
                >
                  <span
                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                    style={{ background: b.hover, opacity: r.pos === 'FIN' ? 1 : 0.12 }}
                  />
                  <span className="relative col-span-3 md:col-span-1">
                    <span
                      className="label inline-flex h-8 min-w-12 items-center justify-center rounded-[6px] border px-2 text-[12px] tabular-nums"
                      style={{
                        background: b.bg,
                        color: b.fg,
                        borderColor: r.pos === 'FIN' ? 'rgba(238,236,230,.3)' : b.bg,
                      }}
                    >
                      {r.pos}
                    </span>
                  </span>
                  <span className="display relative col-span-9 text-[clamp(28px,3.1vw,54px)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:col-span-4">
                    {r.event}
                  </span>
                  <span className="label relative col-span-12 text-paper/50 md:col-span-3">{r.org || '—'}</span>
                  <span className="relative col-span-8 text-[15px] md:col-span-3">{r.note}</span>
                  <span className="label relative col-span-4 text-right tabular-nums text-paper/80 md:col-span-1">
                    {r.prize}
                  </span>
                  <span className="label pointer-events-none absolute right-0 top-2 hidden text-paper/25 md:block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </li>
              )
            })}
          </ul>
          <a
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
            className="label group mt-6 inline-flex items-center gap-2 text-paper/60 hover:text-paper"
            data-cursor="LinkedIn"
          >
            <RollText>Workshops — Spark Lab &amp; more · certificates on LinkedIn</RollText>
            <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
