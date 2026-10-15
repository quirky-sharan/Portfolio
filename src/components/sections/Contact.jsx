import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useClock, useIsDesktop, useNearViewport } from '../../lib/hooks'
import { contact, hellos, person } from '../../data/content'
import { parseEmphasis } from '../../lib/tokenize'
import ErrorBoundary, { hasWebGL } from '../ui/ErrorBoundary'
import Magnetic from '../ui/Magnetic'
import RollText from '../ui/RollText'
import Logo from '../ui/Logo'

const LanyardScene = lazy(() => import('../three/LanyardScene'))

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

/* *emphasis* → italic serif */
function Emph({ text }) {
  return parseEmphasis(text).map((seg, i) =>
    seg.em ? (
      <span key={i} className="serif italic">
        {seg.text}
      </span>
    ) : (
      seg.text
    ),
  )
}

/* Flat stand-in when WebGL is unavailable: the same badge, hanging still. */
function StaticBadge() {
  return (
    <div className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center lg:left-3/4">
      <span className="block h-[22vh] w-6 bg-signal" />
      <div className="w-[min(280px,70vw)] rounded-[14px] border border-ink/15 bg-[#f1efe9] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]">
        <Logo size={44} decorative />
        <p className="display mt-6 text-[64px] leading-[0.85]">
          {person.first}
          <br />
          {person.last}
        </p>
        <p className="label mt-4">{person.role}</p>
        <p className="label mt-4 text-smoke">{person.email}</p>
        <p className="label text-smoke">{person.phone}</p>
      </div>
    </div>
  )
}

export default function Contact() {
  const root = useRef(null)
  const [sceneRef, near, visible] = useNearViewport('80% 0px')
  const isDesktop = useIsDesktop()
  const time = useClock(person.timezone)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [webgl] = useState(() => hasWebGL())

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
    <section
      id="contact"
      ref={root}
      data-theme="light"
      className="relative flex flex-col overflow-hidden bg-paper pb-12 lg:block lg:min-h-[100svh]"
    >
      {/* the badge hangs from the top of the section */}
      <div
        ref={sceneRef}
        className="relative order-last h-[64svh] min-h-[440px] lg:absolute lg:inset-0 lg:h-full"
        data-cursor={dragging ? 'Fling' : hovering && isDesktop ? 'Grab' : undefined}
      >
        {near &&
          (webgl ? (
            <ErrorBoundary fallback={<StaticBadge />}>
              <Suspense fallback={null}>
                <LanyardScene
                  visible={visible}
                  compact={!isDesktop}
                  anchorX={isDesktop ? 0.5 : 0}
                  onDragChange={setDragging}
                  onHoverChange={setHovering}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <StaticBadge />
          ))}
        <p className="label pointer-events-none absolute bottom-4 right-[var(--pad)] text-smoke">
          {isDesktop ? 'Grab the card — fling it' : 'Tap the card'}
        </p>
      </div>

      <div className="pointer-events-none relative z-10 grid gap-y-10 pad-x pt-[14vh] lg:grid-cols-12 lg:gap-x-6 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="lg:col-span-7">
          <p className="ct-in label">
            (07) <span className="text-smoke">Contact</span>
          </p>
          <h2 className="ct-in display mt-6 text-[clamp(72px,12.5vw,230px)] leading-[0.86]">
            <Hello />
          </h2>
          <p className="ct-in serif mt-6 max-w-[26ch] text-[clamp(24px,2.3vw,38px)] leading-[1.1] text-ink/80">
            <Emph text={contact.lead} />
          </p>
          <div className="ct-in mt-6 flex max-w-[40ch] flex-col items-start gap-3 rounded-[16px] border border-ink/12 bg-paper-2/60 p-5">
            <span className="label inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1.5 text-ink">
              <span className="size-2 rounded-full bg-ink" aria-hidden="true" />
              {contact.collabTag}
            </span>
            <p className="text-[clamp(17px,1.35vw,21px)] leading-[1.4] text-ink/85">
              <Emph text={contact.collab} />
            </p>
          </div>

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

          <div className="ct-in mt-14 grid max-w-[560px] grid-cols-2 gap-4 border-t border-ink/15 pt-5">
            <div>
              <p className="label text-smoke">Elsewhere</p>
              <ul className="mt-3 grid gap-2 text-[17px]">
                {[
                  ['LinkedIn', person.linkedin],
                  ['GitHub', person.github],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2"
                      data-cursor="Open"
                    >
                      <RollText>{label}</RollText>
                      <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-smoke">Local time</p>
              <p className="mt-3 text-[17px] tabular-nums">{time} IST</p>
              <p className="label mt-1 text-smoke">{person.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
