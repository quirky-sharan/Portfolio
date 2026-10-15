import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

/* One Lenis instance for the whole page, driven by GSAP's ticker so
   ScrollTrigger and smooth scrolling share the exact same frame. */
export const smooth = { lenis: null }

export function startSmoothScroll() {
  if (smooth.lenis) return smooth.lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = new Lenis({
    lerp: reduce ? 1 : 0.085,
    smoothWheel: !reduce,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  smooth.lenis = lenis
  smooth.dispose = () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    smooth.lenis = null
  }
  return lenis
}

export function scrollToTarget(target, options = {}) {
  const lenis = smooth.lenis
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...options })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }
}
