import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { path } from '../../data/content'
import SplitReveal from '../ui/SplitReveal'

const TONES = [
  'var(--color-lime)',
  'var(--color-sky)',
  'var(--color-pink)',
  'var(--color-sand)',
  'var(--color-lilac)',
  'var(--color-mint)',
]

/* Internships, open source, clubs, school — a compact itinerary. */
export default function Path() {
  const root = useRef(null)
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const grid = q('.pt-grid')[0]
      const cards = q('.pt-card')
      const mm = gsap.matchMedia()
      // Desktop: the cards start as one stacked deck and get dealt into the
      // grid as you scroll.
      mm.add('(min-width: 640px) and (prefers-reduced-motion: no-preference)', () => {
        const deckX = () => grid.offsetWidth / 2
        const deckY = 150
        cards.forEach((c, i) => (c.style.zIndex = String(cards.length - i)))
        gsap.fromTo(
          cards,
          {
            x: (i, el) => deckX() - (el.offsetLeft + el.offsetWidth / 2),
            y: (i, el) => deckY - (el.offsetTop + el.offsetHeight / 2) + i * -3,
            rotation: (i) => [-8, 5, -3, 9, -6, 3][i % 6],
            scale: 0.94,
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            ease: 'power1.inOut',
            stagger: 0.06,
            scrollTrigger: { trigger: grid, start: 'top 88%', end: 'top 22%', scrub: 0.8, invalidateOnRefresh: true },
          },
        )
      })
      mm.add('(max-width: 639px), (prefers-reduced-motion: reduce)', () => {
        gsap.from(cards, {
          y: 50,
          autoAlpha: 0,
          rotate: (i) => (i % 2 ? 3 : -3),
          duration: 1,
          stagger: 0.08,
          scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="path" ref={root} data-theme="light" className="relative bg-paper pad-x py-[14vh]">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label">
            (06) <span className="text-smoke">The path</span>
          </p>
          <SplitReveal as="h2" className="serif mt-5 text-[clamp(44px,5.6vw,100px)] leading-[0.9]">
            Where I&apos;ve been, <span className="italic">where I&apos;m headed</span>
            <span className="text-signal">.</span>
          </SplitReveal>
        </div>
      </div>

      <div className="pt-grid relative mt-[8vh] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {path.map((p, i) => (
          <article
            key={p.where}
            className="pt-card group relative flex min-h-[180px] sm:min-h-[230px] flex-col justify-between overflow-hidden rounded-[18px] border border-ink/12 bg-paper-2/60 p-6 transition-colors duration-500 hover:border-ink/30"
          >
            <span
              className="absolute -right-10 -top-10 size-36 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: TONES[i % TONES.length] }}
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between gap-4">
              <span className="label text-smoke">{p.when}</span>
              <span className="label rounded-full px-2.5 py-1" style={{ background: TONES[i % TONES.length] }}>
                {p.tag}
              </span>
            </div>
            <div className="relative mt-8 sm:mt-10">
              <h3 className="serif text-[clamp(28px,2.4vw,40px)] italic leading-[1]">{p.what}</h3>
              <p className="mt-3 text-[15px] text-ink/70">{p.where}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
