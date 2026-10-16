/*
 * The mark: an S that is half pixel-grid (model) and half smooth curve
 * (motion). Geometry lives in logoData.js.
 */
import { useId } from 'react'
import { LOGO_CELL, LOGO_CELL_R, LOGO_CELLS, LOGO_CURVE, LOGO_SPLIT } from './logoData'

export default function Logo({ size = 34, boxed = true, className = '', title = 'Sharan Soni', decorative = false }) {
  const clip = useId()
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`logo shrink-0 ${className}`}
      {...(decorative ? { 'aria-hidden': true, focusable: 'false' } : { role: 'img', 'aria-label': title })}
    >
      {boxed && <rect width="64" height="64" rx="15" fill="#0e0e0c" />}
      <defs>
        <clipPath id={clip}>
          <rect x="0" y={LOGO_SPLIT} width="64" height="64" />
        </clipPath>
      </defs>
      <g fill="#eeece6">
        {LOGO_CELLS.map(([x, y], i) => (
          <rect
            key={i}
            className="logo-px"
            x={x}
            y={y}
            width={LOGO_CELL}
            height={LOGO_CELL}
            rx={LOGO_CELL_R}
            style={{ '--i': i }}
          />
        ))}
      </g>
      <path className="logo-curve" clipPath={`url(#${clip})`} fill="#ff3b1f" d={LOGO_CURVE} />
    </svg>
  )
}
