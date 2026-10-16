import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ScrollTrigger } from '../../lib/gsap'
import { smooth, scrollToTarget } from '../../lib/smooth'
import { useClock } from '../../lib/hooks'
import { nav, person } from '../../data/content'
import Logo from '../ui/Logo'
import RollText from '../ui/RollText'
import Magnetic from '../ui/Magnetic'

function go(e, href) {
  e.preventDefault()
  scrollToTarget(href, { offset: 0 })
}

export default function Header({ visible }) {
  const time = useClock(person.timezone)
  const [dark, setDark] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)

  // Flip colours over dark sections.
  useEffect(() => {
    const active = new Set()
    const triggers = [...document.querySelectorAll('[data-theme="dark"]')].map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 36px',
        end: 'bottom 36px',
        onToggle: (self) => {
          if (self.isActive) active.add(el)
          else active.delete(el)
          setDark(active.size > 0)
        },
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  // Tuck away while reading down, return on the way up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY.current
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > window.innerHeight * 0.9)
        lastY.current = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // the open menu locks the page; only undo our own lock (on mount the
  // intro holds the page locked and releases it itself)
  useEffect(() => {
    if (!open) return
    smooth.lenis?.stop()
    return () => smooth.lenis?.start()
  }, [open])

  const tone = dark || open ? 'text-paper' : 'text-ink'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pad-x transition-[transform,color] duration-700 ease-[var(--ease-out-expo)] ${tone} ${
          !visible || (hidden && !open) ? '-translate-y-[110%]' : 'translate-y-0'
        }`}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="flex h-full items-center justify-between gap-6">
          <a href="#top" onClick={(e) => go(e, 0)} className="flex items-center gap-3" data-cursor="Top">
            <Logo size={34} decorative />
            <span className="label leading-tight">
              <RollText>Sharan Soni</RollText>
              <span className="block opacity-50">AI/ML × Frontend</span>
            </span>
          </a>

          <div className="label hidden items-center gap-2 md:flex">
            <span className="relative inline-flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative size-2 rounded-full bg-signal" />
            </span>
            <span className="opacity-60">Vellore, IN</span>
            <span className="tabular-nums">{time}</span>
            <span className="opacity-60">IST</span>
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {nav.map((n, i) => (
              <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="label group flex gap-1.5">
                <span className="opacity-40">0{i + 1}</span>
                <RollText>{n.label}</RollText>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block">
              <Magnetic>
                <a
                  href="#contact"
                  onClick={(e) => go(e, '#contact')}
                  className={`label flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors duration-500 ${
                    dark ? 'bg-paper text-ink' : 'bg-ink text-paper'
                  }`}
                  data-cursor="Say hi"
                >
                  <RollText>Let&apos;s talk</RollText>
                  <span aria-hidden="true">↗</span>
                </a>
              </Magnetic>
            </span>
            <button
              className="label relative z-[60] flex h-10 items-center gap-2 rounded-full border border-current px-4 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-2.5 w-4">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'top-1/2 rotate-45' : 'top-0'}`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'top-1/2 -rotate-45' : 'bottom-0'}`}
                />
              </span>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[45] flex flex-col bg-ink pad-x pb-8 text-paper lg:hidden"
            style={{ paddingTop: 'calc(var(--header-h) + 24px)' }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <nav className="flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
              {nav.map((n, i) => (
                <div key={n.href} className="mask">
                  <motion.a
                    href={n.href}
                    onClick={(e) => {
                      setOpen(false)
                      go(e, n.href)
                    }}
                    className="display flex items-baseline gap-3 text-[18vw] leading-[0.9]"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{
                      duration: 0.8,
                      delay: 0.15 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span className="label text-signal">0{i + 1}</span>
                    {n.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <motion.div
              className="grid gap-2 border-t border-paper/15 pt-5 label"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45 }}
            >
              <a href={`mailto:${person.email}`}>{person.email}</a>
              <a href={`tel:${person.phoneRaw}`}>{person.phone}</a>
              <div className="flex gap-5 opacity-70">
                <a href={person.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
                <a href={person.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
