import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { parseEmphasis, tokenize } from '../../lib/tokenize'
import { languages, manifesto, stats } from '../../data/content'
import Switch from '../ui/Switch'
import RollNumber from '../ui/RollNumber'

const segments = parseEmphasis(manifesto)

function HumanText() {
  return (
    <p className="mf-human">
      {segments.map((seg, si) =>
        seg.text.split(/(\s+)/).map((w, wi) =>
          /^\s+$/.test(w) || !w ? (
            w
          ) : (
            <span
              key={`${si}-${wi}`}
              className={`mf-w inline-block ${seg.em ? 'serif italic text-[1.08em] leading-none' : ''}`}
            >
              {w}
            </span>
          ),
        ),
      )}
    </p>
  )
}

function TokenText({ tokens }) {
  return (
    <p className="mf-tokens" aria-hidden="true">
      {tokens.map((t, i) => (
        <motion.span
          key={i}
          data-id={t.id}
          className={`tk relative whitespace-pre-wrap rounded-[0.08em] text-ink [box-decoration-break:clone] ${
            t.em ? 'serif italic text-[1.08em] leading-none' : ''
          }`}
          style={{ background: t.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25, delay: i * 0.008 }}
        >
          {t.text}
        </motion.span>
      ))}
    </p>
  )
}

export default function About() {
  const root = useRef(null)
  const [tokens, setTokens] = useState(false)
  const tokenList = useMemo(() => tokenize(segments), [])
  const chars = useMemo(() => segments.reduce((n, s) => n + s.text.length, 0), [])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)

      // Hero gets pushed back as this sheet slides over it.
      const hero = document.querySelector('.hero')
      if (hero) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true },
        })
        tl.to(hero.querySelector('.hero-inner'), { scale: 0.92, yPercent: -6, ease: 'none' }, 0)
          .to(hero.querySelector('.hero-shade'), { opacity: 0.55, ease: 'none' }, 0)
          .to(
            hero.querySelectorAll('.hn-l'),
            { yPercent: (i) => 22 + (i % 3) * 14, ease: 'none', stagger: { each: 0.02 } },
            0,
          )
        gsap.fromTo(
          root.current,
          { borderTopLeftRadius: 'clamp(20px, 4vw, 64px)', borderTopRightRadius: 'clamp(20px, 4vw, 64px)' },
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 40%', end: 'top top', scrub: true },
          },
        )
      }

      // Words light up as you read.
      gsap.fromTo(
        q('.mf-w'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: q('.mf-stack')[0], start: 'top 82%', end: 'bottom 55%', scrub: 0.6 },
        },
      )

      gsap.from(q('.ab-rule'), {
        scaleX: 0,
        duration: 1.4,
        ease: 'quart',
        stagger: 0.08,
        scrollTrigger: { trigger: q('.ab-stats')[0], start: 'top 85%', once: true },
      })
      gsap.from(q('.ab-fade'), {
        autoAlpha: 0,
        y: 24,
        duration: 1.2,
        stagger: 0.06,
        scrollTrigger: { trigger: q('.ab-stats')[0], start: 'top 85%', once: true },
      })
      gsap.from(q('.lang'), {
        autoAlpha: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.08,
        scrollTrigger: { trigger: q('.ab-langs')[0], start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  const onToggle = (v) => {
    setTokens(v)
    // token view can change the paragraph height
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  return (
    <section
      id="about"
      ref={root}
      data-theme="dark"
      className="relative z-10 overflow-hidden bg-ink pad-x pb-[14vh] pt-[16vh] text-paper"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 label text-paper/50">
        <span>
          <span className="text-paper">(02)</span> About
        </span>
        <div className="flex items-center gap-5">
          <AnimatePresence>
            {tokens && (
              <motion.span
                className="hidden text-lime md:inline"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
              >
                {tokenList.length} tokens · {chars} characters
              </motion.span>
            )}
          </AnimatePresence>
          <Switch
            on={tokens}
            onChange={onToggle}
            offLabel="Human"
            onLabel="Tokens"
            label="Read the manifesto as tokens"
          />
        </div>
      </div>

      <div className="mf-stack mt-[7vh] grid text-[clamp(30px,4.7vw,88px)] [font-weight:460] leading-[1.06] tracking-[-0.02em] [font-stretch:88%] [&>*]:[grid-area:1/1]">
        <div className={`transition-opacity duration-500 ${tokens ? 'opacity-0' : 'opacity-100'}`}>
          <HumanText />
        </div>
        <AnimatePresence>{tokens && <TokenText key="tokens" tokens={tokenList} />}</AnimatePresence>
      </div>

      <div className="ab-stats mt-[14vh] grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
        {stats.map((s, i) => (
          <div key={s.label} className="relative pt-5">
            <span className="ab-rule absolute inset-x-0 top-0 h-px origin-left bg-paper/20" />
            <div className="display text-[clamp(72px,10vw,170px)] leading-[0.9]">
              <RollNumber
                value={`${s.prefix ?? ''}${String(s.value).padStart(s.pad, '0')}${s.suffix ?? ''}`}
                delay={i * 0.1}
              />
            </div>
            <p className="ab-fade label mt-3 text-paper/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="ab-langs mt-[16vh] grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <p className="label text-paper/50">Languages</p>
          <p className="serif mt-4 max-w-[14ch] text-[clamp(36px,3.6vw,60px)] leading-[0.95]">
            Four languages. Four scripts<span className="text-signal">.</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:col-span-8 md:grid-cols-4 md:gap-x-6">
          {languages.map((l) => (
            <div key={l.name} className="lang border-t border-paper/20 pt-5">
              <p className={`${l.className} whitespace-nowrap text-[clamp(26px,2.5vw,44px)] leading-[1.25]`}>
                {l.hello}
              </p>
              <p className="label mt-3 flex justify-between text-paper/60">
                <span>{l.name}</span>
                <span className={l.level === 'Learning' ? 'text-lime' : ''}>{l.level}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
