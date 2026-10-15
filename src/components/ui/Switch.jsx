import { motion } from 'motion/react'

/* Labeled toggle: [off] ( ●) [on] */
export default function Switch({ on, onChange, offLabel, onLabel, label, className = '', tone = 'dark' }) {
  const track = tone === 'dark' ? 'border-paper/30' : 'border-ink/25'
  const knob = tone === 'dark' ? 'bg-paper' : 'bg-ink'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`label group inline-flex select-none items-center gap-2.5 ${className}`}
      data-cursor={on ? offLabel : onLabel}
    >
      <span className={`transition-opacity duration-300 ${on ? 'opacity-40' : 'opacity-100'}`}>{offLabel}</span>
      <span
        className={`relative inline-flex h-[24px] w-[46px] shrink-0 items-center rounded-full border transition-colors duration-500 ${track} ${
          on ? '!border-signal bg-signal' : ''
        }`}
      >
        <motion.span
          className={`absolute left-[3px] size-[16px] rounded-full ${on ? 'bg-paper' : knob}`}
          animate={{ x: on ? 22 : 0, scaleX: [1, 1.35, 1] }}
          transition={{ x: { type: 'spring', stiffness: 520, damping: 32 }, scaleX: { duration: 0.35 } }}
          key={on ? 'on' : 'off'}
        />
      </span>
      <span className={`transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-40'}`}>{onLabel}</span>
    </button>
  )
}
