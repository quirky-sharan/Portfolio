import { lazy, Suspense, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { useIsDesktop, useNearViewport } from '../../lib/hooks'
import { toolbox } from '../../data/content'
import ErrorBoundary, { hasWebGL } from '../ui/ErrorBoundary'
import Magnetic from '../ui/Magnetic'
import RollText from '../ui/RollText'

const ToolboxScene = lazy(() => import('../three/ToolboxScene'))

function StaticChips() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-wrap content-end justify-center gap-2 pad-x pb-10">
      {toolbox.items.map(([label, group]) => (
        <span
          key={label}
          className="label rounded-[10px] border border-ink/20 px-4 py-3 text-[13px]"
          style={{ background: toolbox.groups[group].color }}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

export default function Toolbox() {
  const [ref, near, visible] = useNearViewport('120% 0px')
  const isDesktop = useIsDesktop()
  const shakeRef = useRef(null)
  const [active, setActive] = useState(false)
  const [webgl] = useState(() => hasWebGL())

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 55%', once: true, onEnter: () => setActive(true) })
      gsap.from(ref.current.querySelectorAll('.tb-in'), {
        autoAlpha: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      id="toolbox"
      ref={ref}
      data-theme="light"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-paper-2"
      data-cursor-zone="drag"
    >
      <h2 className="display pointer-events-none absolute inset-x-0 top-[30%] select-none text-center text-[23vw] leading-[0.8] text-ink/[0.055]">
        Toolbox
      </h2>

      <div className="pointer-events-none relative z-10 grid gap-6 pad-x pt-[calc(var(--header-h)+16px)] md:grid-cols-12">
        <div className="tb-in md:col-span-6">
          <p className="label">
            (04) <span className="text-smoke">Toolbox</span>
          </p>
          <p className="serif mt-5 max-w-[15ch] text-[clamp(38px,4.4vw,76px)] leading-[0.92]">
            Everything I reach for. <span className="italic text-ink/55">Go on — throw them.</span>
          </p>
        </div>
        <div className="tb-in flex flex-col items-start gap-5 md:col-span-4 md:col-start-9 md:items-end">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
            {Object.values(toolbox.groups).map((g) => (
              <li key={g.label} className="label flex items-center gap-2">
                <span className="size-3 rounded-[3px] border border-ink/30" style={{ background: g.color }} />
                {g.label}
              </li>
            ))}
          </ul>
          <Magnetic className="pointer-events-auto">
            <button
              type="button"
              onClick={() => shakeRef.current?.()}
              className="label flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-paper"
              data-cursor="Shake"
            >
              <RollText>Shake the box</RollText>
              <span aria-hidden="true">↻</span>
            </button>
          </Magnetic>
          <p className="label hidden text-smoke md:block">Drag · throw · repeat</p>
          <p className="label text-smoke md:hidden">Tap to flick</p>
        </div>
      </div>

      <ul className="sr-only">
        {toolbox.items.map(([label]) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      {near &&
        (webgl ? (
          <ErrorBoundary fallback={<StaticChips />}>
            <Suspense fallback={null}>
              <ToolboxScene active={active} visible={visible} shakeRef={shakeRef} compact={!isDesktop} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <StaticChips />
        ))}
    </section>
  )
}
