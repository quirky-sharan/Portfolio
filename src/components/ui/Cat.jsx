/*
 * The streetwear cat: a sleek black cat in an oversized vermilion hoodie,
 * round black shades and chunky white kicks. Pure inline SVG; all motion
 * lives in Cat.css (transform / opacity only).
 *
 * pose     'push'  shoves the loader curtain, facing right; both paws are
 *                  flat against the right edge of the viewBox (x ≈ 232-240)
 *          'wave'  footer goodbye, facing the viewer, other paw in the pocket
 *          'walk'  tiny scroll-progress walker, side view facing right
 * walking  true = walk / push cycle, false = idle only (tail, ear, glint)
 * line     outline colour (pass the paper colour on dark backgrounds)
 *
 * viewBox is 0 0 240 270 for every pose: feet on y = 252, shadow at y = 258.
 */
import './Cat.css'

const INK = '#0e0e0c'
const FUR = '#1b1b18'
const FUR_HI = '#3d3d36'
const PAPER = '#eeece6'
const WHITE = '#ffffff'
const SHOE_FAR = '#dedbd2'
const RED = '#ff3b1f'
const RED_DEEP = '#cf2a12'
const LIME = '#d4f25a'
const PINK = '#f6b8e0'
const LILAC = '#c7b8ff'
const SKY = '#a9d2f5'

const at = (x, y) => ({ transformOrigin: `${x}px ${y}px` })

/* an outlined tube: outline stroke underneath, colour stroke on top */
function Tube({ d, w, fill, line, sw }) {
  return (
    <>
      <path d={d} stroke={line} strokeWidth={w + sw * 2} />
      <path d={d} stroke={fill} strokeWidth={w} />
    </>
  )
}

/* chunky sneaker, toe pointing right; (0,0) is the ankle, sole bottom at y 19 */
function Sneaker({ line, sw, far }) {
  const upper = far ? SHOE_FAR : WHITE
  return (
    <>
      <path
        d="M-12 -9Q-19 -6 -18 3L-17 8H29Q35 8 34 1Q32 -5 21 -7L9 -13Q2 -16 -5 -15Q-11 -13 -12 -9Z"
        fill={upper}
        stroke={line}
        strokeWidth={sw}
      />
      <path d="M-17.5 -1Q-18 5 -16 8H-9V-9Q-15 -8 -17.5 -1Z" fill={RED} stroke={line} strokeWidth={sw * 0.7} />
      <path d="M2 -12.5L6 -6M10 -9.5L14 -4" stroke={INK} strokeWidth={sw * 0.6} />
      <path
        d="M-21 7H35Q39 7 38 12L37 16Q36 19 31 19H-17Q-22 19 -21 14Z"
        fill={far ? '#bcd24e' : LIME}
        stroke={line}
        strokeWidth={sw}
      />
    </>
  )
}

/*
 * Leg rig: hip -> knee -> ankle, drawn hanging straight down and posed by
 * CSS rotations (thigh at the hip, .cat__shin at the knee, .cat__foot at the
 * ankle). Outlines first, fills second, so the knee reads as one limb.
 */
function Leg({ side, hip: [x, y], thigh, shin, w, line, sw, shoe = '', far }) {
  const k = y + thigh
  const a = k + shin
  return (
    <g className={`cat__leg cat__leg--${side}`} style={at(x, y)}>
      <path d={`M${x} ${y}V${k}`} stroke={line} strokeWidth={w + sw * 2} />
      <g className="cat__shin" style={at(x, k)}>
        <path d={`M${x} ${k}V${a}`} stroke={line} strokeWidth={w + sw * 2} />
      </g>
      <path d={`M${x} ${y}V${k}`} stroke={FUR} strokeWidth={w} />
      <g className="cat__shin" style={at(x, k)}>
        <path d={`M${x} ${k}V${a}`} stroke={FUR} strokeWidth={w} />
        <g className="cat__foot" style={at(x, a)}>
          <g transform={`translate(${x} ${a})${shoe}`}>
            <Sneaker line={line} sw={sw} far={far} />
          </g>
        </g>
      </g>
    </g>
  )
}

/* four-point lime glint */
const glint = (x, y, r) =>
  `M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`

/* round black lens with the classic diagonal double-streak shine */
function Lens({ cx, cy, r, sw }) {
  const f = (n) => +n.toFixed(1)
  const streak = (k) =>
    `M${f(cx - 0.62 * r + k)} ${f(cy - 0.05 * r + k)}L${f(cx - 0.05 * r + k)} ${f(cy - 0.62 * r + k)}`
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={INK} stroke={INK} strokeWidth={sw} />
      <path d={streak(0)} stroke={LILAC} strokeWidth={f(0.26 * r)} />
      <path d={streak(0.5 * r)} stroke={LILAC} strokeWidth={f(0.11 * r)} opacity=".8" />
    </>
  )
}

/* head in profile, facing right; local coords, (0,0) ≈ centre of the skull */
function SideHead({ line, sw, mood }) {
  const push = mood === 'push'
  return (
    <g className="cat__head" style={at(-4, 30)}>
      <g className="cat__ear cat__ear--far" style={at(20, -30)}>
        <path d="M6 -32Q16 -54 27 -63Q35 -44 32 -20Z" fill={FUR} stroke={line} strokeWidth={sw} />
        <path d="M14 -34Q20 -46 26 -52Q29 -40 27 -28Z" fill={PINK} />
      </g>
      <g className="cat__ear cat__ear--near" style={at(-14, -30)}>
        <path
          d="M-33 -10Q-35 -30 -34 -42L-27 -45L-32 -51Q-30 -60 -27 -67Q-10 -54 4 -32Z"
          fill={FUR}
          stroke={line}
          strokeWidth={sw}
        />
        <path d="M-26 -20Q-27 -38 -25 -52Q-13 -44 -5 -32Z" fill={PINK} />
      </g>
      <path
        d="M-35 4C-38 -20 -20 -36 2 -36C22 -36 36 -26 39 -10C40 -4 46 0 46 6C46 12 40 16 36 18C34 26 24 32 10 32C0 33 -8 32 -12 30L-20 35L-22 27L-32 31L-30 22L-41 20L-34 12Z"
        fill={FUR}
        stroke={line}
        strokeWidth={sw}
      />
      <path d="M-27 -20Q-18 -31 -3 -33" stroke={FUR_HI} strokeWidth="4" />

      {/* shades: temple to the ear, far lens peeking past the brow */}
      <path d="M8 -9L-16 -15M32 -10Q36 -13 39 -11" stroke={INK} strokeWidth={sw * 0.9} />
      <ellipse cx="43" cy="-8" rx="6" ry="12" fill={INK} stroke={INK} strokeWidth={sw * 0.9} />
      <Lens cx={20} cy={-6} r={14} sw={sw} />
      <path className="cat__glint" d={glint(28, 1, 5.5)} fill={LIME} />

      <path d="M42 2Q47 1 47.5 5Q45 8.5 42 6Z" fill={PINK} />
      {push ? (
        <>
          <path d="M21 14Q33 19 42 12Q43 24 33 27Q22 28 21 14Z" fill={WHITE} stroke={line} strokeWidth={sw * 0.7} />
          <path d="M22 19.5Q33 22.5 42 17.5M31 21V26" stroke={INK} strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M20 15Q21 18 24 18Q34 22 42 12" stroke={PAPER} strokeWidth="3.2" />
          <path d="M33 19.5L34.5 24.5L37 18.5Z" fill={WHITE} />
        </>
      )}
      {!push && <path d="M36 10L52 7M36 14L51 17" stroke={line} strokeWidth="2.4" />}
    </g>
  )
}

/* head facing the viewer; local coords */
function FrontHead({ line, sw }) {
  return (
    <g className="cat__head" style={at(0, 40)}>
      <path d="M-48 -14Q-54 -44 -50 -68Q-28 -54 -14 -36Z" fill={FUR} stroke={line} strokeWidth={sw} />
      <path d="M-42 -22Q-46 -42 -45 -56Q-32 -46 -22 -36Z" fill={PINK} />
      <g className="cat__ear cat__ear--near" style={at(30, -30)}>
        <path
          d="M14 -36Q30 -54 50 -68Q52 -60 50 -55L43 -51L49 -45Q52 -30 48 -14Z"
          fill={FUR}
          stroke={line}
          strokeWidth={sw}
        />
        <path d="M22 -36Q32 -46 42 -54Q43 -40 42 -24Z" fill={PINK} />
        <circle cx="50" cy="-23" r="6" stroke={LIME} strokeWidth="3.2" />
      </g>
      <path
        d="M0 -40C30 -40 50 -24 52 2L62 8L52 14L58 22L46 23C38 38 20 44 0 44C-20 44 -38 38 -46 23L-58 22L-52 14L-62 8L-52 2C-50 -24 -30 -40 0 -40Z"
        fill={FUR}
        stroke={line}
        strokeWidth={sw}
      />
      <path d="M-40 -14Q-34 -30 -18 -36" stroke={FUR_HI} strokeWidth="4" />

      {/* shades */}
      <path d="M-36 1L-51 -1M36 1L51 -1M-3 0Q0 -4 3 0" stroke={INK} strokeWidth={sw} />
      <Lens cx={-19} cy={4} r={17} sw={sw} />
      <Lens cx={19} cy={4} r={17} sw={sw} />
      <path className="cat__glint" d={glint(27, 12, 7)} fill={LIME} />

      <path d="M-5.5 21Q0 19 5.5 21Q3 27 0 27Q-3 27 -5.5 21Z" fill={PINK} />
      <path d="M0 27Q-4 33 -10 30M0 27Q8 34 18 26" stroke={PAPER} strokeWidth="3.2" />
      <path d="M8 30.5L10.5 36L13 29.5Z" fill={WHITE} />
      <path d="M-50 18L-72 14M-50 25L-70 29M50 18L72 14M50 25L70 29" stroke={line} strokeWidth="2.6" />
    </g>
  )
}

/* side-view paw pressed flat against a wall on its right; (0,0) = wrist */
function WallPaw({ line, sw, cuff }) {
  return (
    <>
      <path
        d="M-2 -12C6 -15 12 -15 16 -13C19 -16 25 -16 27.5 -12.5Q30.5 -11 30.5 -6V7Q30.5 12 26 12.5C16 14.5 6 14.5 -2 12Z"
        fill={FUR}
        stroke={line}
        strokeWidth={sw}
      />
      <path d="M30 -2.5H24M30 3.5H24" stroke={FUR_HI} strokeWidth="2.5" />
      <rect x="-9" y="-15" width="12" height="30" rx="6" fill={cuff} stroke={line} strokeWidth={sw} />
    </>
  )
}

function Push({ line }) {
  const sw = 5.5
  const leg = { hip: [100, 186], thigh: 34, shin: 38, w: 15, line, sw }
  return (
    <>
      <ellipse cx="108" cy="258" rx="84" ry="6.5" fill={INK} opacity=".12" />
      <g className="cat__dust" fill={PAPER} stroke={line} strokeWidth="4">
        <circle cx="26" cy="243" r="11" />
        <circle cx="12" cy="230" r="7" />
        <circle cx="42" cy="232" r="6" />
      </g>
      <g className="cat__tail" style={at(82, 178)}>
        <Tube d="M82 178C56 192 34 184 31 158C29 138 23 126 13 131" w={11} fill={FUR} line={line} sw={sw} />
      </g>
      <Leg side="far" {...leg} far />
      <Leg side="near" {...leg} />

      <g className="cat__upper">
        {/* far arm */}
        <Tube d="M150 128Q180 118 206 124" w={19} fill={RED_DEEP} line={line} sw={sw} />
        <g transform="translate(206 124)">
          <WallPaw line={line} sw={sw} cuff={RED_DEEP} />
        </g>

        {/* oversized hoodie, leaning hard into the push */}
        <g transform="rotate(40 100 186)" strokeWidth={sw} stroke={line}>
          <path d="M72 104C62 132 62 168 68 194H134C140 168 140 134 129 108C118 96 86 94 72 104Z" fill={RED} />
          <path d="M66 182H136L134 194H68Z" fill={RED_DEEP} />
          <path d="M138 146Q120 146 112 154L114 182" />
          <rect x="74" y="168" width="7" height="10" rx="1.5" fill={LIME} strokeWidth={sw * 0.6} />
          <path d="M68 114C56 94 78 80 98 86C112 90 112 104 98 108C88 110 78 112 68 114Z" fill={RED_DEEP} />
        </g>

        <g transform="translate(176 80) rotate(10)">
          <SideHead line={line} sw={sw} mood="push" />
        </g>

        {/* near arm */}
        <Tube d="M156 140Q184 158 206 156" w={20} fill={RED} line={line} sw={sw} />
        <g transform="translate(206 156)">
          <WallPaw line={line} sw={sw} cuff={RED_DEEP} />
        </g>
      </g>

      {/* effort: speed lines, pressure ticks at the wall, flying sweat */}
      <g className="cat__effort" stroke={line} strokeWidth="4.5">
        <path d="M98 128H76M86 150H62M112 108H94" />
        <path d="M224 178L231 186M213 182L216 190" />
      </g>
      <path
        className="cat__sweat"
        d="M146 30Q139 41 143 46Q149 50 152 43Q153 38 146 30Z"
        fill={SKY}
        stroke={line}
        strokeWidth="3.5"
      />
    </>
  )
}

function Walk({ line }) {
  const sw = 7
  const leg = { hip: [116, 182], thigh: 26, shin: 26, w: 15, line, sw }
  return (
    <>
      <ellipse cx="116" cy="258" rx="54" ry="6.5" fill={INK} opacity=".12" />
      <g className="cat__body">
        <g className="cat__tail" style={at(92, 184)}>
          <Tube d="M92 184C64 190 48 176 50 152C52 132 42 120 32 124" w={12} fill={FUR} line={line} sw={sw} />
        </g>
        <Leg side="far" {...leg} far />
        <Leg side="near" {...leg} />
        <g className="cat__upper">
          <g transform="rotate(6 116 190)" strokeWidth={sw} stroke={line}>
            <path d="M90 114C82 140 81 170 85 194H147C152 170 152 142 142 116C130 104 102 104 90 114Z" fill={RED} />
            <path d="M84 182H149L147 194H85Z" fill={RED_DEEP} />
            <path d="M84 122C72 100 96 88 116 96C128 100 126 114 112 116C102 118 92 120 84 122Z" fill={RED_DEEP} />
            {/* paw in the kangaroo pocket */}
            <Tube d="M112 126Q106 152 132 164" w={20} fill={RED} line={line} sw={sw} />
            <path d="M152 146Q134 146 127 156L129 182H151" fill={RED} />
          </g>
          <g transform="translate(126 74) scale(1.06)">
            <SideHead line={line} sw={sw / 1.06} mood="cool" />
          </g>
        </g>
      </g>
    </>
  )
}

function Wave({ line }) {
  const sw = 5.5
  return (
    <>
      <ellipse cx="120" cy="258" rx="58" ry="6" fill={INK} opacity=".12" />
      <g className="cat__tail" style={at(98, 202)}>
        <Tube d="M98 202C62 210 42 194 44 166C46 144 36 132 26 138" w={12} fill={FUR} line={line} sw={sw} />
      </g>
      <Leg side="left" hip={[104, 196]} thigh={18} shin={19} w={16} line={line} sw={sw} shoe=" scale(-0.8 1)" />
      <Leg side="right" hip={[132, 196]} thigh={18} shin={19} w={16} line={line} sw={sw} shoe=" scale(0.8 1)" />

      <g className="cat__upper">
        <g transform="rotate(-2 118 200)">
          <g strokeWidth={sw} stroke={line}>
            <path d="M72 192H164V200Q164 208 156 208H80Q72 208 72 200Z" fill={RED_DEEP} />
            <path
              d="M86 122Q64 126 58 148Q54 172 62 186Q66 193 74 193H162Q170 193 174 186Q182 172 178 148Q172 126 150 122Z"
              fill={RED}
            />
            <path
              d="M84 200V207M96 200V207M108 200V207M120 200V207M132 200V207M144 200V207M156 200V207"
              strokeWidth="2"
              opacity=".45"
            />
            <rect x="163" y="168" width="7" height="11" rx="1.5" fill={LIME} strokeWidth={sw * 0.6} />
          </g>
          {/* paw tucked in the pocket */}
          <Tube d="M72 140Q56 166 86 180" w={22} fill={RED} line={line} sw={sw} />
          <path d="M88 164H148L157 191H79Z" fill={RED} stroke={line} strokeWidth={sw} />
          {/* hood down, bunched behind the neck */}
          <path
            d="M76 134C66 114 90 104 118 104C146 104 170 114 160 134C142 126 94 126 76 134Z"
            fill={RED_DEEP}
            stroke={line}
            strokeWidth={sw}
          />
          {/* drawstrings */}
          <path d="M110 122L106 158M126 122L130 156" stroke={line} strokeWidth="8.5" />
          <path d="M110 122L106 158M126 122L130 156" stroke={PAPER} strokeWidth="3.5" />
          <path d="M105.6 160L105 167M130.4 158L131 165" stroke={line} strokeWidth="10" />
          <path d="M105.6 160L105 167M130.4 158L131 165" stroke={LIME} strokeWidth="5" />

          <g transform="translate(118 80) rotate(-5) scale(.88)">
            <FrontHead line={line} sw={sw / 0.88} />
          </g>

          {/* waving arm */}
          <g className="cat__wave" style={at(164, 142)}>
            <Tube d="M163 141C182 136 194 126 195 108" w={22} fill={RED} line={line} sw={sw} />
            <g className="cat__paw" style={at(195, 100)}>
              <path
                d="M179 95C173 84 174 68 183 64C184 56 193 54 196.5 59.5C201 55 210 57 211.5 65C217 69 217 85 209 95C200 102 187 102 179 95Z"
                fill={FUR}
                stroke={line}
                strokeWidth={sw}
              />
              <g fill={PINK}>
                <ellipse cx="195" cy="85" rx="8.5" ry="6.5" />
                <circle cx="185.5" cy="72" r="3.3" />
                <circle cx="195.5" cy="67" r="3.5" />
                <circle cx="205" cy="72" r="3.3" />
              </g>
            </g>
            <Tube d="M195 112L195.5 100" w={25} fill={RED_DEEP} line={line} sw={sw} />
          </g>
        </g>
      </g>
    </>
  )
}

export default function Cat({ pose = 'push', walking = true, line = INK, className = '', style }) {
  const kind = pose === 'wave' || pose === 'walk' ? pose : 'push'
  const Pose = kind === 'wave' ? Wave : kind === 'walk' ? Walk : Push
  return (
    <svg
      viewBox="0 0 240 270"
      className={`cat cat--${kind}${walking ? ' is-walking' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Pose line={line} />
    </svg>
  )
}
