import { gsap } from './gsap'
import { smooth } from './smooth'

/* Big type leans into your scroll: every [data-skew] element skews with the
   (smoothed) Lenis velocity and springs back when you stop. */
export function startVelocitySkew() {
  let skew = 0
  let els = []
  const collect = () => {
    els = [...document.querySelectorAll('[data-skew]')]
  }
  const apply = () => {
    const t = `skewY(${skew.toFixed(3)}deg)`
    for (const el of els) el.style.transform = t
  }
  const tick = () => {
    const v = smooth.lenis?.velocity ?? 0
    const target = gsap.utils.clamp(-5, 5, v * 0.16)
    const next = skew + (target - skew) * 0.12
    if (Math.abs(next) < 0.005 && Math.abs(target) < 0.005) {
      if (skew !== 0) {
        skew = 0
        apply()
      }
      return
    }
    skew = next
    apply()
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return () => {}
  collect()
  let queued = false
  const mo = new MutationObserver(() => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      collect()
    })
  })
  mo.observe(document.body, { childList: true, subtree: true })
  gsap.ticker.add(tick)
  return () => {
    mo.disconnect()
    gsap.ticker.remove(tick)
  }
}
