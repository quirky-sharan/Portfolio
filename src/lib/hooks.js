import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/* Becomes true once the element is within `margin` of the viewport, and
   reports live visibility so heavy scenes can pause off-screen. */
export function useNearViewport(margin = '50% 0px') {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nearObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true)
      },
      { rootMargin: margin },
    )
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '0px' })
    nearObs.observe(el)
    visObs.observe(el)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
    }
  }, [margin])
  return [ref, near, visible]
}

/* Live clock for a timezone, ticking once a second. */
export function useClock(timeZone) {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone])
  return time
}

/* Scale a single line of text so it spans its container edge to edge. */
export function useFitText(ref, deps = []) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '100px'
      el.style.width = 'max-content'
      const natural = el.getBoundingClientRect().width
      el.style.width = ''
      const ps = getComputedStyle(el.parentElement)
      const avail = el.parentElement.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight)
      if (natural) el.style.fontSize = `${(avail / natural) * 100 * 0.995}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
