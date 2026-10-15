import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../../lib/gsap'

/* Headings that rise in word-by-word from behind a line mask the first time
   they scroll into view. Re-splits itself on resize / font load. */
export default function SplitReveal({ as = 'h2', className = '', children, delay = 0, ...rest }) {
  const Tag = as
  const ref = useRef(null)
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      let played = false
      const split = SplitText.create(ref.current, {
        type: 'lines,words',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          if (played) return
          return gsap.from(self.words, {
            yPercent: 115,
            rotate: 5,
            transformOrigin: '0% 100%',
            duration: 1.15,
            ease: 'expo',
            stagger: 0.035,
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 88%',
              once: true,
              onEnter: () => {
                played = true
              },
            },
          })
        },
      })
      return () => split.revert()
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
