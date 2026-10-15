import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useClock, useIsDesktop, useNearViewport } from '../../lib/hooks'
import { hellos, person } from '../../data/content'
import ErrorBoundary, { hasWebGL } from '../ui/ErrorBoundary'
import Magnetic from '../ui/Magnetic'
import RollText from '../ui/RollText'
import Hanko from '../ui/Hanko'

const HankoScene = lazy(() => import('../three/HankoScene'))

/* “Let's talk” cycling through every language Sharan speaks. */
function Hello() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % hellos.length), 2400)
    return () => clearInterval(id)
  }, [])
  const h = hellos[i]
  return (
    <span className="mask relative block h-[1.08em]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className={`absolute left-0 top-0 block whitespace-nowrap ${h.className === 'font-display' ? '' : h.className}`}
          style={
            h.className === 'font-display'
              ? undefined
              : { fontSize: '0.78em', lineHeight: '1.35', textTransform: 'none' }
          }
          initial={{ y: '105%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-105%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {h.text}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{hellos[0].text}</span>
    </span>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${person.email}`
    }
  }
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        className="block max-w-full text-left"
        data-cursor={copied ? 'Copied' : 'Copy'}
        aria-label={`Copy email address ${person.email}`}
      >
        <span className="display block whitespace-nowrap text-[clamp(26px,7.4vw,84px)] normal-case leading-[0.95] tracking-[-0.02em] [font-stretch:72%] transition-colors duration-300 group-hover:text-signal lg:text-[clamp(30px,4.4vw,84px)]">
          {person.email}
        </span>
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            className="label absolute -top-7 left-0 rounded-full bg-ink px-3 py-1 text-paper"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            Copied to clipboard ✓
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

function Action({ href, children, external, cursor }) {
  return (
    <Magnetic strength={0.25}>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className="label group inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2.5 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
        data-cursor={cursor}
      >
        <RollText>{children}</RollText>
        <span className="transition-transform duration-500 group-hover:rotate-45" aria-hidden="true">
          ↗
        </span>
      </a>
    </Magnetic>
  )
}

export default function Contact() {
  const root = useRef(null)
  const [sceneRef, near, visible] = useNearViewport('80% 0px')
  const isDesktop = useIsDesktop()
  const time = useClock(person.timezone)
  const stampRef = useRef(null)
  const [stamps, setStamps] = useState(0)
  const [webgl] = useState(() => hasWebGL())
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let alive = true
    const done = () => alive && setFontReady(true)
    if (document.fonts?.load) document.fonts.load('700 64px "Sharan Japanese"', 'シャラン').then(done, done)
    else done()
    return () => {
      alive = false
    }
  }, [])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.from(q('.ct-in'), {
        autoAlpha: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.07,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" ref={root} data-theme="light" className="relative overflow-hidden bg-paper pb-10 pt-[14vh]">
      <div className="grid gap-y-10 pad-x lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          <p className="ct-in label">
            (07) <span className="text-smoke">Contact</span>
          </p>
          <h2 className="ct-in display mt-6 text-[clamp(72px,12.5vw,230px)] leading-[0.86]">
            <Hello />
          </h2>
          <p className="ct-in serif mt-6 max-w-[26ch] text-[clamp(24px,2.3vw,38px)] leading-[1.1] text-ink/80">
            Internships, hackathon teams, a frontend that needs to <span className="italic">feel</span> something — say
            hi.
          </p>

          <div className="ct-in mt-12">
            <p className="label mb-3 text-smoke">Email — click to copy</p>
            <CopyEmail />
            <div className="mt-5 flex flex-wrap gap-2">
              <Action href={`mailto:${person.email}`} cursor="Write">
                Write an email
              </Action>
            </div>
          </div>

          <div className="ct-in mt-12">
            <p className="label mb-3 text-smoke">Phone · WhatsApp</p>
            <a
              href={`tel:${person.phoneRaw}`}
              className="display block text-[clamp(30px,5.2vw,96px)] leading-[0.95] [font-stretch:72%] transition-colors duration-300 hover:text-signal"
              data-cursor="Call"
            >
              {person.phone}
            </a>
            <div className="mt-5 flex flex-wrap gap-2">
              <Action href={`tel:${person.phoneRaw}`} cursor="Call">
                Call
              </Action>
              <Action href={person.whatsapp} external cursor="Chat">
                WhatsApp
              </Action>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col lg:col-span-5">
          <div className="ct-in grid grid-cols-2 gap-4 border-t border-ink/15 pt-5 lg:mt-[7.5rem]">
            <div>
              <p className="label text-smoke">Elsewhere</p>
              <ul className="mt-3 grid gap-2 text-[17px]">
                <li>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2"
                    data-cursor="Open"
                  >
                    <RollText>LinkedIn</RollText>
                    <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href={person.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2"
                    data-cursor="Open"
                  >
                    <RollText>GitHub</RollText>
                    <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="label text-smoke">Local time</p>
              <p className="mt-3 text-[17px] tabular-nums">{time} IST</p>
              <p className="label mt-1 text-smoke">{person.location}</p>
            </div>
          </div>

          <div
            ref={sceneRef}
            className="ct-in relative mt-8 h-[52svh] min-h-[340px] lg:h-auto lg:flex-1"
            data-cursor="Stamp"
          >
            {near && webgl && fontReady && (
              <ErrorBoundary fallback={<Hanko size={180} className="absolute left-1/2 top-1/2 -translate-1/2" />}>
                <Suspense fallback={null}>
                  <HankoScene visible={visible} compact={!isDesktop} stampRef={stampRef} onStamp={setStamps} />
                </Suspense>
              </ErrorBoundary>
            )}
            {!webgl && <Hanko size={180} className="absolute left-1/2 top-1/2 -translate-1/2" />}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between">
              <span className="label text-smoke">
                {stamps
                  ? `${stamps} stamp${stamps > 1 ? 's' : ''} — hanko approved`
                  : isDesktop
                    ? 'Click the seal to stamp'
                    : 'Tap the seal to stamp'}
              </span>
              <button
                type="button"
                className="label pointer-events-auto rounded-full border border-ink/20 px-3 py-1.5 hover:bg-ink hover:text-paper"
                onClick={() => stampRef.current?.()}
              >
                Stamp ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
