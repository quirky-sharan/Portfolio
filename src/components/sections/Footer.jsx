import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { scrollToTarget } from '../../lib/smooth'
import { nav, person } from '../../data/content'
import { useFitText } from '../../lib/hooks'
import Cat from '../ui/Cat'
import RollText from '../ui/RollText'
import SplitReveal from '../ui/SplitReveal'

export default function Footer() {
  const root = useRef(null)
  const name = useRef(null)
  useFitText(name)
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.from(q('.ft-l'), {
        yPercent: 105,
        duration: 1.1,
        stagger: { each: 0.05, from: 'center' },
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: q('.ft-name')[0], start: 'top 95%', once: true },
      })
      gsap.from(q('.ft-cat'), {
        yPercent: 100,
        duration: 1.2,
        delay: 0.5,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: q('.ft-name')[0], start: 'top 95%', once: true },
      })
    },
    { scope: root },
  )

  const go = (e, href) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <footer ref={root} data-theme="dark" className="relative overflow-hidden bg-ink pt-[12vh] text-paper">
      <div className="grid gap-10 pad-x sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SplitReveal as="p" className="serif max-w-[18ch] text-[clamp(30px,2.6vw,44px)] leading-[1.02]">
            Built with care, curiosity and <span className="italic">far too many</span> easing curves.
          </SplitReveal>
        </div>
        <nav className="lg:col-span-2 lg:col-start-7" aria-label="Footer">
          <p className="label text-paper/40">Index</p>
          <ul className="mt-4 grid gap-1.5">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={(e) => go(e, n.href)} className="label">
                  <RollText>{n.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-2">
          <p className="label text-paper/40">Say hi</p>
          <ul className="mt-4 grid gap-1.5">
            <li>
              <a href={`mailto:${person.email}`} className="label">
                <RollText>Email</RollText>
              </a>
            </li>
            <li>
              <a href={`tel:${person.phoneRaw}`} className="label">
                <RollText>{person.phone}</RollText>
              </a>
            </li>
            <li>
              <a href={person.whatsapp} target="_blank" rel="noreferrer" className="label">
                <RollText>WhatsApp</RollText>
              </a>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="label text-paper/40">Social</p>
          <ul className="mt-4 grid gap-1.5">
            <li>
              <a href={person.linkedin} target="_blank" rel="noreferrer" className="label">
                <RollText>LinkedIn ↗</RollText>
              </a>
            </li>
            <li>
              <a href={person.github} target="_blank" rel="noreferrer" className="label">
                <RollText>GitHub ↗</RollText>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mt-[12vh] pad-x">
        <div className="ft-cat pointer-events-none absolute bottom-[86%] right-[6%] w-[clamp(90px,11vw,170px)]">
          <Cat pose="wave" walking={false} line="#eeece6" />
        </div>
        <p ref={name} data-skew className="ft-name display mask flex leading-[0.8]" aria-hidden="true">
          {[...'SHARAN SONI'].map((c, i) =>
            c === ' ' ? (
              <span key={i} className="w-[0.16em] shrink-0" />
            ) : (
              <span key={i} className="ft-l inline-block">
                {c}
              </span>
            ),
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pad-x py-5 label text-paper/50">
        <span>
          © {new Date().getFullYear()} {person.name}
        </span>
        <span className="hidden md:inline">React · GSAP · Three.js · Lenis · Motion</span>
        <a href="#top" onClick={(e) => go(e, 0)} className="text-paper" data-cursor="Top">
          <RollText>Back to top ↑</RollText>
        </a>
      </div>
    </footer>
  )
}
