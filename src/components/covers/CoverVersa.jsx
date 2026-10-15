/* Forgetting curves that reset — and flatten — at every recall. */
const X0 = 150
const X1 = 1080
const TOP = 230
const BOT = 790

const y = (r) => BOT - (BOT - TOP) * r
const RECALLS = [
  { x: 380, label: '09:42' },
  { x: 640, label: 'D2 · 18:10' },
  { x: 920, label: 'D6 · 07:55' },
]

function curve() {
  const pts = []
  let start = X0
  const stops = [...RECALLS.map((r) => r.x), X1]
  stops.forEach((stop, k) => {
    const tau = 170 * (1 + k * 1.25)
    for (let x = start; x <= stop; x += 10) pts.push([x, y(Math.exp(-(x - start) / tau))])
    if (k < RECALLS.length) pts.push([stop, y(1)])
    start = stop
  })
  return 'M' + pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L')
}

function noRecall() {
  const pts = []
  for (let x = X0; x <= X1; x += 12) pts.push([x, y(Math.exp(-(x - X0) / 210))])
  return 'M' + pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L')
}

export default function CoverVersa({ on }) {
  return (
    <div className="cv" data-on={on}>
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1600" height="1000" fill="#c7b8ff" />
        <text x="80" y="110" fill="#0e0e0c" fontSize="24" letterSpacing="2">
          RECALL ANALYTICS
        </text>
        <text x="80" y="146" fill="#1c1240" fillOpacity=".6" fontSize="20">
          retention over time · timestamped
        </text>

        {[1, 0.5, 0].map((r) => (
          <g key={r}>
            <line x1={X0} x2={X1} y1={y(r)} y2={y(r)} stroke="#0e0e0c" strokeOpacity=".15" strokeWidth="2" />
            <text x={X0 - 20} y={y(r) + 7} textAnchor="end" fill="#1c1240" fontSize="18">
              {Math.round(r * 100)}%
            </text>
          </g>
        ))}
        <text x={X1} y={BOT + 50} textAnchor="end" fill="#1c1240" fontSize="18">
          time →
        </text>

        <path
          d={noRecall()}
          pathLength="1"
          className="cv-draw"
          fill="none"
          stroke="#0e0e0c"
          strokeOpacity=".35"
          strokeWidth="3"
          strokeDasharray="1"
        />
        <path
          d={curve()}
          pathLength="1"
          className="cv-draw"
          fill="none"
          stroke="#0e0e0c"
          strokeWidth="7"
          strokeLinejoin="round"
          style={{ transitionDelay: '0.2s' }}
        />

        {RECALLS.map((r, i) => (
          <g key={r.x} className="cv-pop" style={{ transitionDelay: `${0.7 + i * 0.25}s` }}>
            <line x1={r.x} x2={r.x} y1={y(1) - 10} y2={BOT} stroke="#0e0e0c" strokeWidth="2" strokeDasharray="4 8" />
            <circle cx={r.x} cy={y(1)} r="13" fill="#ff3b1f" stroke="#0e0e0c" strokeWidth="3" />
            <rect x={r.x - 74} y={y(1) - 66} width="148" height="38" rx="19" fill="#0e0e0c" />
            <text x={r.x} y={y(1) - 40} textAnchor="middle" fill="#eeece6" fontSize="17">
              {r.label}
            </text>
          </g>
        ))}

        {/* quiz card */}
        <g className="cv-pop" style={{ transitionDelay: '0.45s' }}>
          <rect x="1150" y="200" width="380" height="560" rx="26" fill="#eeece6" stroke="#0e0e0c" strokeWidth="3" />
          <text x="1186" y="258" fill="#6f6e68" fontSize="17" letterSpacing="1.5">
            Q.07 — ACTIVE RECALL
          </text>
          <text x="1186" y="322" fill="#0e0e0c" className="cv-serif" fontSize="40">
            What does RAG
          </text>
          <text x="1186" y="368" fill="#0e0e0c" className="cv-serif" fontSize="40">
            stand for?
          </text>
          {['Random Attention Graph', 'Recursive Agent Grid', 'Retrieval-Augmented Gen.'].map((o, i) => (
            <g key={o}>
              <rect
                x="1186"
                y={410 + i * 82}
                width="308"
                height="62"
                rx="14"
                fill={i === 2 ? '#0e0e0c' : 'none'}
                stroke="#0e0e0c"
                strokeWidth="2.5"
              />
              <text x="1208" y={448 + i * 82} fill={i === 2 ? '#eeece6' : '#0e0e0c'} fontSize="17">
                {String.fromCharCode(65 + i)} · {o}
              </text>
            </g>
          ))}
          <text x="1186" y="720" fill="#6f6e68" fontSize="16">
            answered 18:10:04 · 3.2 s ✓
          </text>
        </g>

        <g className="cv-pop" style={{ transitionDelay: '1.3s' }} transform="rotate(14 1500 220)">
          <circle cx="1500" cy="220" r="72" fill="#ff3b1f" stroke="#0e0e0c" strokeWidth="3" />
          <circle cx="1500" cy="220" r="60" fill="none" stroke="#eeece6" strokeWidth="2" strokeDasharray="3 6" />
          <text x="1500" y="214" textAnchor="middle" fill="#eeece6" fontSize="17" letterSpacing="1.5">
            PATENT
          </text>
          <text x="1500" y="240" textAnchor="middle" fill="#eeece6" fontSize="17" letterSpacing="1.5">
            FILED
          </text>
        </g>
      </svg>
    </div>
  )
}
