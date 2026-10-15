import { useMemo } from 'react'

const LAPS = 12
const CARS = 8
const X0 = 190
const X1 = 1130
const Y0 = 210
const DY = 82

/* Deterministic little race: adjacent overtakes lap by lap. */
function simulate() {
  let seed = 7
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  let order = [...Array(CARS).keys()]
  const laps = [order.slice()]
  for (let l = 1; l < LAPS; l++) {
    order = order.slice()
    for (let k = 0; k < 2; k++) {
      const i = Math.floor(rand() * (CARS - 1))
      ;[order[i], order[i + 1]] = [order[i + 1], order[i]]
    }
    // car 4 charges through the field
    const h = order.indexOf(4)
    if (h > 0 && l % 2 === 1) [order[h - 1], order[h]] = [order[h], order[h - 1]]
    laps.push(order)
  }
  return [...Array(CARS).keys()].map((car) => laps.map((o) => o.indexOf(car)))
}

const px = (lap) => X0 + (lap * (X1 - X0)) / (LAPS - 1)
const py = (pos) => Y0 + pos * DY

function bump(positions) {
  return positions
    .map((p, i) => {
      if (i === 0) return `M${px(0)} ${py(p)}`
      const xa = px(i - 1)
      const xb = px(i)
      const m = (xb - xa) / 2
      return `C${xa + m} ${py(positions[i - 1])} ${xb - m} ${py(p)} ${xb} ${py(p)}`
    })
    .join(' ')
}

const TRACKS = [
  'M1385 560 C1340 480 1270 470 1262 410 C1255 360 1300 340 1330 362 C1352 380 1340 410 1316 404',
  'M1385 560 C1450 500 1520 470 1528 410 C1534 368 1500 352 1478 370',
  'M1385 560 C1420 640 1500 690 1540 700',
  'M1385 560 C1330 620 1300 700 1250 720 C1218 732 1200 708 1214 690 C1226 676 1246 684 1242 698',
  'M1385 560 C1395 470 1410 360 1440 300',
  'M1385 560 C1300 560 1250 590 1238 560',
  'M1385 560 C1440 590 1470 650 1456 700 C1446 734 1412 730 1414 708',
]

export default function CoverF1({ on }) {
  const cars = useMemo(() => simulate(), [])
  const hero = 4
  const predicted = cars[hero].map((p, i) => (i > 3 && i < 8 ? Math.max(0, p - 1) : p))
  return (
    <div className="cv" data-on={on}>
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1600" height="1000" fill="#121210" />
        <text x="80" y="110" fill="#eeece6" fontSize="24" letterSpacing="2">
          RACE OUTCOME MODEL
        </text>
        <text x="80" y="146" fill="#6f6e68" fontSize="20">
          position per lap · predicted vs actual
        </text>

        {[...Array(CARS)].map((_, i) => (
          <g key={i}>
            <line x1={X0} x2={X1} y1={py(i)} y2={py(i)} stroke="#262622" strokeWidth="2" />
            <text x="96" y={py(i) + 8} fill="#6f6e68" fontSize="22">
              P{i + 1}
            </text>
          </g>
        ))}
        {[...Array(LAPS)].map((_, l) => (
          <text key={l} x={px(l)} y="900" textAnchor="middle" fill="#4a4a45" fontSize="18">
            L{String(l + 1).padStart(2, '0')}
          </text>
        ))}

        {cars.map((pos, c) =>
          c === hero ? null : (
            <path
              key={c}
              d={bump(pos)}
              pathLength="1"
              className="cv-draw"
              fill="none"
              stroke={['#3c3c37', '#55554f', '#2f2f2b', '#6f6e68', '#45453f', '#5d5d57', '#36362f', '#4f4f49'][c]}
              strokeWidth="7"
              strokeLinecap="round"
              style={{ transitionDelay: `${c * 0.05}s` }}
            />
          ),
        )}
        <path
          d={bump(predicted)}
          className="cv-fade"
          fill="none"
          stroke="#d4f25a"
          strokeWidth="4"
          strokeDasharray="10 12"
          style={{ transitionDelay: '1.1s' }}
        />
        <path
          d={bump(cars[hero])}
          pathLength="1"
          className="cv-draw"
          fill="none"
          stroke="#ff3b1f"
          strokeWidth="11"
          strokeLinecap="round"
          style={{ transitionDelay: '0.35s' }}
        />
        <g className="cv-pop" style={{ transitionDelay: '1.6s' }}>
          <circle cx={px(LAPS - 1)} cy={py(cars[hero][LAPS - 1])} r="16" fill="#ff3b1f" />
          <rect x={px(LAPS - 1) + 30} y={py(cars[hero][LAPS - 1]) - 22} width="44" height="44" fill="url(#chk)" />
        </g>

        <g className="cv-fade" style={{ transitionDelay: '0.8s' }}>
          <line x1="780" x2="822" y1="104" y2="104" stroke="#ff3b1f" strokeWidth="8" strokeLinecap="round" />
          <text x="836" y="111" fill="#a3a29b" fontSize="18">
            ACTUAL
          </text>
          <line x1="940" x2="982" y1="104" y2="104" stroke="#d4f25a" strokeWidth="4" strokeDasharray="10 8" />
          <text x="996" y="111" fill="#a3a29b" fontSize="18">
            PREDICTED
          </text>
        </g>

        {/* Masked Collider panel */}
        <rect x="1210" y="210" width="340" height="660" rx="22" fill="#1b1b18" stroke="#2a2a26" strokeWidth="2" />
        <text x="1236" y="256" fill="#eeece6" fontSize="18" letterSpacing="1.5">
          MASKED COLLIDER
        </text>
        <text x="1236" y="284" fill="#6f6e68" fontSize="16">
          t = 0.42 s · x = 1.3 m
        </text>
        {TRACKS.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength="1"
            className="cv-draw"
            fill="none"
            stroke={i % 3 === 0 ? '#ff3b1f' : i % 3 === 1 ? '#a9d2f5' : '#eeece6'}
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ transitionDelay: `${0.6 + i * 0.07}s` }}
          />
        ))}
        <circle cx="1385" cy="560" r="10" fill="#eeece6" className="cv-pop" style={{ transitionDelay: '0.5s' }} />
        <circle
          cx="1385"
          cy="560"
          r="26"
          fill="none"
          stroke="#eeece6"
          strokeOpacity=".35"
          strokeWidth="2"
          className="cv-pop"
          style={{ transitionDelay: '0.6s' }}
        />

        <defs>
          <pattern id="chk" width="22" height="22" patternUnits="userSpaceOnUse">
            <rect width="22" height="22" fill="#eeece6" />
            <rect width="11" height="11" fill="#121210" />
            <rect x="11" y="11" width="11" height="11" fill="#121210" />
          </pattern>
        </defs>
      </svg>
    </div>
  )
}
