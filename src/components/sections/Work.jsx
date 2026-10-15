import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { scrollToTarget } from '../../lib/smooth'
import { useIsDesktop, useNearViewport } from '../../lib/hooks'
import { person, projects, sideQuests } from '../../data/content'
import ProjectCard from './ProjectCard'
import Switch from '../ui/Switch'
import RollText from '../ui/RollText'
import SplitReveal from '../ui/SplitReveal'

const N = projects.length
const ROWS = 5
const COLS = 8
const EASE = [0.16, 1, 0.3, 1]

function Digit({ d, className = '' }) {
  return (
    <span className={`mask relative inline-block h-[0.86em] ${className}`}>
      <motion.span className="flex flex-col" animate={{ y: `${-d * 10}%` }} transition={{ duration: 1.1, ease: EASE }}>
        {[...Array(10).keys()].map((n) => (
          <span key={n} className="block h-[0.86em] leading-[0.86]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

function ResultPill({ project }) {
  return (
    <span
      className="label inline-flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{ background: project.color, color: project.ink }}
    >
      <span aria-hidden="true">★</span>
      {project.result}
    </span>
  )
}

function Links({ project, tone = 'ink' }) {
  if (!project.links.length) {
    return <span className="label opacity-40">Code private · ask me for a demo</span>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {project.links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className={`label group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 transition-colors duration-300 ${
            tone === 'ink'
              ? 'border-ink/25 hover:bg-ink hover:text-paper'
              : 'border-paper/30 hover:bg-paper hover:text-ink'
          }`}
          data-cursor="Open"
        >
          <RollText>{l.label}</RollText>
          <span className="transition-transform duration-500 group-hover:rotate-45" aria-hidden="true">
            ↗
          </span>
        </a>
      ))}
    </div>
  )
}

function Tags({ project }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {project.stack.map((s) => (
        <li key={s} className="label rounded-[4px] border border-ink/15 px-2 py-1 text-ink/70">
          {s}
        </li>
      ))}
    </ul>
  )
}

/* ── Desktop: pinned, one project per viewport of scroll ───────── */
function WorkPinned() {
  const root = useRef(null)
  const cells = useRef(null)
  const bars = useRef([])
  const st = useRef(null)
  const tl = useRef(null)
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(0)
  const [brief, setBrief] = useState(false)
  const project = projects[shown]

  useGSAP(
    () => {
      st.current = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (N - 0.2)}`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const f = self.progress * N
          const i = Math.min(N - 1, Math.floor(f))
          setActive(i)
          bars.current.forEach((b, j) => {
            if (b) b.style.transform = `scaleX(${gsap.utils.clamp(0, 1, f - j)})`
          })
        },
      })
      gsap.from(root.current.querySelectorAll('.wk-in'), {
        autoAlpha: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
    },
    { scope: root },
  )

  // Grid-cell wipe between projects.
  useGSAP(
    () => {
      if (active === shown) return
      const el = [...cells.current.children]
      tl.current?.kill()
      tl.current = gsap
        .timeline()
        .set(el, { backgroundColor: projects[active].color })
        .to(el, {
          scale: 1.04,
          duration: 0.42,
          ease: 'quart',
          stagger: { grid: [ROWS, COLS], from: 'random', amount: 0.22 },
        })
        .call(() => setShown(active))
        .to(
          el,
          { scale: 0, duration: 0.55, ease: 'quart', stagger: { grid: [ROWS, COLS], from: 'random', amount: 0.3 } },
          '+=0.06',
        )
    },
    { dependencies: [active] },
  )

  const jump = (i) => {
    const s = st.current
    if (!s) return
    scrollToTarget(s.start + ((i + 0.08) / N) * (s.end - s.start), { duration: 1.4 })
  }

  return (
    <div ref={root} className="relative flex h-[100svh] flex-col pad-x pb-6 pt-7">
      <div className="wk-in flex items-center justify-between label">
        <span>
          (03) <span className="text-smoke">Selected work</span>
        </span>
        <span className="text-smoke">0{N} projects — scroll to browse</span>
        <Switch
          on={brief}
          onChange={setBrief}
          offLabel="Visual"
          onLabel="Brief"
          label="Show project brief"
          tone="light"
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6 pt-6">
        {/* left: index + minimal info */}
        <div className="wk-in col-span-4 flex min-h-0 flex-col">
          <div data-skew className="display flex items-start text-[clamp(110px,13.5vw,250px)]">
            <Digit d={0} />
            <Digit d={shown + 1} />
            <span className="label ml-3 mt-3 text-smoke">/ 0{N}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={shown}
              className="mt-auto flex flex-col gap-5"
              initial="in"
              animate="show"
              exit="out"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              <h3 className="display text-[clamp(44px,4.7vw,90px)] leading-[0.88]">
                {[project.title, project.titleAlt].filter(Boolean).map((t) => (
                  <span key={t} className="mask block pb-[0.04em]">
                    <motion.span
                      className="block"
                      variants={{ in: { y: '105%' }, show: { y: '0%' }, out: { y: '-105%' } }}
                      transition={{ duration: 0.7, ease: EASE }}
                    >
                      {t}
                    </motion.span>
                  </span>
                ))}
              </h3>
              {[
                <p key="s" className="serif text-[clamp(22px,1.9vw,32px)] italic leading-[1.05] text-ink/80">
                  {project.subtitle}
                </p>,
                <div key="r" className="flex flex-wrap items-center gap-3">
                  <ResultPill project={project} />
                  <span className="label text-smoke">{project.event}</span>
                </div>,
                <Tags key="t" project={project} />,
                <Links key="l" project={project} />,
              ].map((node, i) => (
                <motion.div
                  key={i}
                  variants={{ in: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 }, out: { opacity: 0, y: -8 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {node}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* right: the card + tabs */}
        <div className="wk-in col-span-8 flex min-h-0 flex-col items-end justify-end">
          <div style={{ width: 'min(100%, calc((100svh - 190px) * 1.6))' }}>
            <ProjectCard project={project} flipped={brief} on>
              <div
                ref={cells}
                className="pointer-events-none absolute inset-0 grid overflow-hidden rounded-[clamp(10px,1.2vw,20px)]"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
                aria-hidden="true"
              >
                {[...Array(ROWS * COLS)].map((_, i) => (
                  <span key={i} className="block scale-0 will-change-transform" />
                ))}
              </div>
              <button
                type="button"
                className="absolute inset-0 rounded-[clamp(10px,1.2vw,20px)]"
                onClick={() => setBrief((b) => !b)}
                aria-label={brief ? 'Show project visual' : 'Show project brief'}
                data-cursor={brief ? 'Visual' : 'Brief'}
              />
            </ProjectCard>

            <div className="mt-4 grid w-full grid-cols-4 gap-3">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => jump(i)}
                  className={`label group text-left transition-opacity duration-500 ${
                    i === active ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <span className="relative mb-2 block h-[2px] w-full overflow-hidden bg-ink/15">
                    <span
                      ref={(el) => (bars.current[i] = el)}
                      className="absolute inset-0 origin-left scale-x-0 bg-ink"
                    />
                  </span>
                  <span className="text-smoke">{p.index}</span> {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Mobile / tablet: stacked articles, brief opens underneath ─── */
function MobileProject({ project }) {
  const [open, setOpen] = useState(false)
  const [ref, near] = useNearViewport('0px 0px -25% 0px')
  return (
    <article ref={ref} className="border-t border-ink/15 py-10">
      <div className="flex items-start justify-between">
        <span className="display text-[26vw] leading-[0.8] sm:text-[18vw]">{project.index}</span>
        <ResultPill project={project} />
      </div>
      <h3 className="display mt-6 text-[13vw] leading-[0.88] sm:text-[9vw]">
        {project.title}
        {project.titleAlt && <span className="block">{project.titleAlt}</span>}
      </h3>
      <p className="serif mt-3 text-[26px] italic leading-[1.05] text-ink/80">{project.subtitle}</p>
      <ProjectCard project={project} flipped={false} on={near} className="mt-6" />
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="label text-smoke">{project.event}</span>
        <Switch on={open} onChange={setOpen} offLabel="" onLabel="Brief" label="Show project brief" tone="light" />
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-[14px] p-5" style={{ background: project.color, color: project.ink }}>
              {project.brief.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0 ? 'text-[19px] font-medium leading-[1.25]' : 'mt-3 text-[15px] leading-[1.45] opacity-80'
                  }
                >
                  {p}
                </p>
              ))}
              <p className="label mt-4 opacity-70">
                {project.role} · {project.team}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-5 grid gap-4">
        <Tags project={project} />
        <Links project={project} />
      </div>
    </article>
  )
}

function WorkStacked() {
  return (
    <div className="pad-x pb-6 pt-[12vh]">
      <div className="mb-8 flex items-end justify-between label">
        <span>
          (03) <span className="text-smoke">Selected work</span>
        </span>
        <span className="text-smoke">0{N} projects</span>
      </div>
      {projects.map((p) => (
        <MobileProject key={p.id} project={p} />
      ))}
    </div>
  )
}

function SideQuests() {
  const root = useRef(null)
  useGSAP(
    () => {
      gsap.from(root.current.querySelectorAll('.sq-row'), {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="pad-x pb-[14vh] pt-[10vh]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SplitReveal as="h3" className="serif text-[clamp(40px,5vw,84px)] leading-[0.9]">
          Side <span className="italic">quests</span>
          <span className="text-signal">.</span>
        </SplitReveal>
        <a
          href={person.github}
          target="_blank"
          rel="noreferrer"
          className="label group flex items-center gap-2"
          data-cursor="GitHub"
        >
          <RollText>Everything on GitHub</RollText>
          <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
        </a>
      </div>
      <ul data-skew>
        {sideQuests.map((q, i) => (
          <li key={q.title} className="sq-row">
            <a
              href={q.href}
              target="_blank"
              rel="noreferrer"
              className="group relative grid grid-cols-12 items-center gap-4 overflow-hidden border-t border-ink/15 py-6 last:border-b"
              data-cursor="Open"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <span className="label relative col-span-2 text-smoke transition-colors duration-500 group-hover:text-paper/50 md:col-span-1">
                0{i + 1}
              </span>
              <span className="display relative col-span-10 text-[clamp(40px,5.4vw,96px)] transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-paper md:col-span-4">
                {q.title}
              </span>
              <span className="relative col-span-12 text-[15px] leading-snug transition-colors duration-500 group-hover:text-paper md:col-span-4">
                {q.note}
              </span>
              <span className="label relative col-span-10 text-smoke transition-colors duration-500 group-hover:text-paper/60 md:col-span-2">
                {q.tags}
              </span>
              <span className="relative col-span-2 justify-self-end text-2xl transition-[color,transform] duration-500 group-hover:rotate-45 group-hover:text-signal md:col-span-1">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Work() {
  const isDesktop = useIsDesktop()
  return (
    <section id="work" data-theme="light" className="relative z-10 bg-paper">
      {isDesktop ? <WorkPinned /> : <WorkStacked />}
      <SideQuests />
    </section>
  )
}
