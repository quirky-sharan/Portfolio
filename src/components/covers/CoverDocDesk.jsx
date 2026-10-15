const SOURCES = ['PostgreSQL', 'MySQL', 'NoSQL', 'Excel', 'Word', 'CSV']
const ITEMS = [
  ['Stationery × 12', '480'],
  ['Courier — Bandra', '120'],
  ['Repairs (2)', '350'],
  ['Ink cartridges', '640'],
]

export default function CoverDocDesk({ on }) {
  return (
    <div className="cv" data-on={on}>
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1600" height="1000" fill="#d4f25a" />
        <text x="80" y="110" fill="#0e0e0c" fontSize="24" letterSpacing="2">
          FRONT DESK, AUTOMATED
        </text>
        <text x="80" y="146" fill="#1f2a00" fillOpacity=".6" fontSize="20">
          every format in · one desk out
        </text>

        {SOURCES.map((s, i) => {
          const y = 230 + i * 104
          return (
            <g key={s}>
              <path
                d={`M372 ${y} C 520 ${y}, 520 480, 640 480`}
                pathLength="1"
                className="cv-draw"
                fill="none"
                stroke="#0e0e0c"
                strokeWidth="3"
                style={{ transitionDelay: `${0.25 + i * 0.06}s` }}
              />
              <g className="cv-pop" style={{ transitionDelay: `${i * 0.06}s` }}>
                <rect
                  x="80"
                  y={y - 34}
                  width="292"
                  height="68"
                  rx="34"
                  fill="#eeece6"
                  stroke="#0e0e0c"
                  strokeWidth="3"
                />
                <circle
                  cx="118"
                  cy={y}
                  r="9"
                  fill={['#ff3b1f', '#a9d2f5', '#c7b8ff', '#9ee6c6', '#f6b8e0', '#f3d68c'][i]}
                  stroke="#0e0e0c"
                  strokeWidth="2.5"
                />
                <text x="142" y={y + 8} fill="#0e0e0c" fontSize="24">
                  {s}
                </text>
              </g>
            </g>
          )
        })}

        <g className="cv-pop" style={{ transitionDelay: '0.55s' }}>
          <rect x="640" y="380" width="210" height="200" rx="40" fill="#0e0e0c" />
          <text x="745" y="476" textAnchor="middle" fill="#eeece6" className="cv-display" fontSize="64">
            DD
          </text>
          <rect x="702" y="506" width="86" height="34" rx="17" fill="#d4f25a" />
          <text x="745" y="530" textAnchor="middle" fill="#0e0e0c" fontSize="18">
            AI
          </text>
        </g>
        <path
          d="M850 480 C 900 480, 900 420, 960 420"
          pathLength="1"
          className="cv-draw"
          fill="none"
          stroke="#0e0e0c"
          strokeWidth="3"
          style={{ transitionDelay: '0.8s' }}
        />

        {/* receipt */}
        <g className="cv-print" style={{ transitionDelay: '0.7s' }}>
          <path
            d="M960 150 H1350 V830 l-24 22 -24 -22 -24 22 -24 -22 -24 22 -24 -22 -24 22 -24 -22 -24 22 -24 -22 -24 22 -24 -22 -24 22 -24 -22 -24 22 -24 -22 -22 22 Z"
            fill="#faf9f5"
            stroke="#0e0e0c"
            strokeWidth="3"
          />
          <text x="996" y="218" fill="#0e0e0c" fontSize="22" letterSpacing="2">
            INVOICE #0098
          </text>
          <text x="996" y="250" fill="#6f6e68" fontSize="17">
            auto-generated · 09:30
          </text>
          <line x1="996" x2="1314" y1="282" y2="282" stroke="#0e0e0c" strokeWidth="2" strokeDasharray="6 8" />
          {ITEMS.map(([k, v], i) => (
            <g key={k}>
              <text x="996" y={334 + i * 56} fill="#0e0e0c" fontSize="19">
                {k}
              </text>
              <text x="1314" y={334 + i * 56} textAnchor="end" fill="#0e0e0c" fontSize="19">
                ₹{v}
              </text>
            </g>
          ))}
          <line x1="996" x2="1314" y1="572" y2="572" stroke="#0e0e0c" strokeWidth="2" strokeDasharray="6 8" />
          <text x="996" y="630" fill="#0e0e0c" fontSize="24" letterSpacing="2">
            TOTAL
          </text>
          <text x="1314" y="634" textAnchor="end" fill="#0e0e0c" className="cv-display" fontSize="54">
            ₹1,590
          </text>
          <g transform="rotate(-12 1150 740)">
            <rect x="1060" y="700" width="180" height="76" rx="10" fill="none" stroke="#ff3b1f" strokeWidth="5" />
            <text x="1150" y="752" textAnchor="middle" fill="#ff3b1f" className="cv-display" fontSize="44">
              PAID
            </text>
          </g>
        </g>

        {/* messages */}
        <g className="cv-pop" style={{ transitionDelay: '1.4s' }}>
          <rect x="1100" y="820" width="430" height="74" rx="37" fill="#0e0e0c" />
          <text x="1136" y="866" fill="#eeece6" fontSize="20">
            Reminder sent to 24 customers ✓
          </text>
        </g>
        <g className="cv-pop" style={{ transitionDelay: '1.6s' }}>
          <rect x="1190" y="908" width="340" height="60" rx="30" fill="#eeece6" stroke="#0e0e0c" strokeWidth="3" />
          <text x="1222" y="946" fill="#0e0e0c" fontSize="19">
            Low stock: A4 paper
          </text>
        </g>
      </svg>
    </div>
  )
}
