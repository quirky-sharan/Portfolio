/*
 * “Tok” — a little token-bot. It pushes the loader curtain open and
 * waves goodbye in the footer. Pure SVG + CSS keyframes (see Mascot.css).
 * pose: 'push' | 'wave'
 */
import './Mascot.css'

const INK = '#0e0e0c'

export default function Mascot({ pose = 'push', walking = true, line = INK, className = '', style }) {
  const isPush = pose === 'push'
  return (
    <svg
      viewBox="0 0 240 270"
      className={`mascot ${isPush ? 'mascot--push' : 'mascot--wave'} ${walking ? 'is-walking' : ''} ${className}`}
      style={style}
      aria-hidden="true"
      fill="none"
      stroke={line}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ground shadow */}
      <ellipse cx="112" cy="258" rx="70" ry="7" fill={INK} opacity=".12" stroke="none" />

      {/* dust puffs kicked up behind */}
      {isPush && (
        <g className="mascot__dust" strokeWidth="4" fill="#eeece6">
          <circle cx="30" cy="246" r="9" />
          <circle cx="14" cy="236" r="6" />
          <circle cx="44" cy="232" r="5" />
        </g>
      )}

      {/* back leg */}
      <g className="mascot__leg mascot__leg--back">
        <path d="M108 186 L82 236" strokeWidth="11" />
        <path d="M68 244 Q70 230 86 236 L94 240 Q96 248 86 249 L70 249 Q64 249 68 244Z" fill={line} strokeWidth="3" />
      </g>

      {/* upper body, leaning into the push */}
      <g className="mascot__torso">
        {/* back arm */}
        {isPush ? (
          <g className="mascot__arm mascot__arm--back">
            <path d="M160 132 L214 118" strokeWidth="11" />
            <circle cx="220" cy="117" r="11" fill="#eeece6" strokeWidth="5" />
          </g>
        ) : (
          <path d="M70 140 Q50 160 56 182" strokeWidth="11" />
        )}

        {/* antenna */}
        <g className="mascot__antenna">
          <path d="M112 64 Q106 38 118 22" strokeWidth="5" />
          <circle cx="119" cy="18" r="10" fill="#d4f25a" strokeWidth="5" />
        </g>

        {/* body */}
        <rect x="52" y="60" width="126" height="128" rx="34" fill="#ff3b1f" strokeWidth="5.5" />
        {/* body highlight */}
        <path d="M70 82 Q72 72 84 70" stroke="#fff" strokeOpacity=".55" strokeWidth="6" />

        {/* visor */}
        <rect x="92" y="84" width="76" height="52" rx="18" fill="#eeece6" strokeWidth="5" />

        {isPush ? (
          <g className="mascot__face" strokeWidth="4.5" stroke={INK}>
            {/* squeezed “> <” effort eyes */}
            <path d="M112 100 L122 107 L112 114" />
            <path d="M150 100 L140 107 L150 114" />
            <path d="M124 124 Q131 120 138 124" />
          </g>
        ) : (
          <g className="mascot__face" stroke={INK}>
            <g className="mascot__eyes" fill={INK} stroke="none">
              <ellipse cx="117" cy="106" rx="5.5" ry="7.5" />
              <ellipse cx="145" cy="106" rx="5.5" ry="7.5" />
            </g>
            <path d="M121 122 Q131 130 141 122" strokeWidth="4.5" />
          </g>
        )}

        {/* blush */}
        <ellipse cx="84" cy="134" rx="9" ry="5.5" fill="#f6b8e0" stroke="none" />

        {/* chest token id */}
        <text
          x="72"
          y="172"
          fill={INK}
          stroke="none"
          fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="700"
          letterSpacing=".5"
        >
          #0098
        </text>

        {/* front arm */}
        {isPush ? (
          <g className="mascot__arm mascot__arm--front">
            <path d="M150 156 L212 150" strokeWidth="11" />
            <circle cx="219" cy="150" r="11" fill="#eeece6" strokeWidth="5" />
          </g>
        ) : (
          <g className="mascot__wave-arm">
            <path d="M172 128 Q198 112 204 82" strokeWidth="11" />
            <circle cx="205" cy="74" r="11" fill="#eeece6" strokeWidth="5" />
          </g>
        )}
      </g>

      {/* front leg */}
      <g className="mascot__leg mascot__leg--front">
        <path d="M132 186 L146 238" strokeWidth="11" />
        <path
          d="M134 246 Q136 232 152 238 L162 242 Q164 250 154 251 L138 251 Q130 251 134 246Z"
          fill={line}
          strokeWidth="3"
        />
      </g>

      {/* effort marks + sweat */}
      {isPush && (
        <g className="mascot__effort" strokeWidth="4.5">
          <path d="M36 70 L22 62" />
          <path d="M32 92 L16 92" />
          <path d="M40 50 L32 36" />
          <path
            className="mascot__sweat"
            d="M58 50 Q50 62 56 68 Q64 72 66 62 Q66 56 58 50Z"
            fill="#a9d2f5"
            strokeWidth="3.5"
          />
        </g>
      )}
    </svg>
  )
}
