import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { path } from '../../data/content'

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
      gsap.from(q('.pt-card'), {
        y: 60,
        autoAlpha: 0,
        rotate: (i) => (i % 2 ? 2 : -2),
        duration: 1.2,
        stagger: 0.08,
        scrollTrigger: { trigger: q('.pt-grid')[0], start: 'top 80%', once: true },
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
          <h2 className="serif mt-5 text-[clamp(44px,5.6vw,100px)] leading-[0.9]">
            Where I&apos;ve been, <span className="italic">where I&apos;m headed</span>
            <span className="text-signal">.</span>
          </h2>
        </div>
      </div>

      <div className="pt-grid mt-[8vh] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
