import { forwardRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useFinePointer } from '../../lib/hooks'
import { covers } from '../covers'

/* Front: the visual. Back: the brief. The BRIEF switch flips it. */
const ProjectCard = forwardRef(function ProjectCard({ project, flipped, on = true, children, className = '' }, ref) {
  const Cover = covers[project.cover] ?? covers.f1
  const fine = useFinePointer()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const tiltX = useSpring(rx, { stiffness: 140, damping: 18 })
  const tiltY = useSpring(ry, { stiffness: 140, damping: 18 })
  const onMove = (e) => {
    if (!fine) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 9)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }
  return (
    <div
      ref={ref}
      className={`relative aspect-[16/10] w-full [perspective:2200px] ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div className="relative size-full [transform-style:preserve-3d]" style={{ rotateX: tiltX }}>
        <motion.div className="relative size-full [transform-style:preserve-3d]" style={{ rotateY: tiltY }}>
          <motion.div
            className="relative size-full [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 16, mass: 1.1 }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[clamp(10px,1.2vw,20px)] [backface-visibility:hidden] [container-type:inline-size]"
              style={{ background: project.color }}
            >
              <Cover on={on && !flipped} project={project} />
            </div>

            <div
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[clamp(10px,1.2vw,20px)] p-[clamp(18px,3.2cqw,48px)] [backface-visibility:hidden] [transform:rotateY(180deg)] [container-type:inline-size]"
              style={{ background: project.color, color: project.ink }}
            >
              <div className="label flex items-center justify-between opacity-70">
                <span>Brief — {project.title}</span>
                <span>{project.index} / 04</span>
              </div>
              <p className="serif mt-[3cqw] max-w-[16ch] text-[clamp(26px,5.4cqw,72px)] italic leading-[0.95]">
                {project.title}, in brief<span className="not-italic">.</span>
              </p>
              <div className="mt-auto grid gap-[1.6cqw]">
                {project.brief.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'text-[clamp(17px,3.2cqw,40px)] leading-[1.12] tracking-[-0.01em]'
                        : 'max-w-[62ch] text-[clamp(13px,1.55cqw,18px)] leading-[1.45] opacity-80'
                    }
                    style={i === 0 ? { fontStretch: '90%', fontWeight: 500 } : undefined}
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-[2.4cqw] flex flex-wrap gap-x-6 gap-y-1 border-t border-current/20 pt-[1.6cqw] label opacity-70">
                <span>{project.role}</span>
                <span>{project.team}</span>
              </div>
            </div>
          </motion.div>
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
})

export default ProjectCard
