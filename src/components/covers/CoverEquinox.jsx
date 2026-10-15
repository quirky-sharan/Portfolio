export default function CoverEquinox({ on, project }) {
  const [main, second] = project.images
  return (
    <div className="cv" data-on={on} style={{ background: project.color }}>
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 610 H520 L560 540 L600 700 L650 380 L700 760 L740 610 H1600"
          pathLength="1"
          className="cv-draw"
          fill="none"
          stroke="#0b3b2b"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 610 H520 L560 540 L600 700 L650 380 L700 760 L740 610 H1600"
          pathLength="1"
          className="cv-pulse"
          fill="none"
          stroke="#ff3b1f"
          strokeWidth="4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <figure className="cv-pop absolute left-[6%] top-[10%] w-[66%] overflow-hidden rounded-[1.2%] bg-[#0b0d12] shadow-[0_30px_80px_-30px_rgba(11,59,43,0.55)]">
        <div className="flex h-[3.4cqw] min-h-[14px] items-center gap-[0.6cqw] bg-[#15181f] px-[1cqw]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[0.7cqw] min-h-[5px] min-w-[5px] rounded-full bg-white/25" />
          ))}
        </div>
        <img
          src={`${main.src}-1600.webp`}
          srcSet={`${main.src}-800.webp 800w, ${main.src}-1600.webp 1600w`}
          sizes="(min-width: 1024px) 40vw, 80vw"
          alt={main.alt}
          className="block aspect-[1920/989] w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </figure>

      <figure
        className="cv-pop absolute bottom-[9%] right-[5%] w-[44%] overflow-hidden rounded-[1.2%] bg-[#0b0d12] shadow-[0_30px_80px_-24px_rgba(11,59,43,0.6)]"
        style={{ transitionDelay: '0.25s' }}
      >
        <img
          src={`${second.src}-800.webp`}
          srcSet={`${second.src}-800.webp 800w, ${second.src}-1600.webp 1600w`}
          sizes="(min-width: 1024px) 28vw, 50vw"
          alt={second.alt}
          className="block aspect-[1919/991] w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </figure>

      {['RAG', 'Llama 3.3 70B', 'Multilingual'].map((t, i) => (
        <span
          key={t}
          className="cv-pop label absolute rounded-full border border-[#0b3b2b] bg-paper px-[1.1cqw] py-[0.6cqw] text-[max(9px,1.05cqw)] text-ink"
          style={{
            transitionDelay: `${0.5 + i * 0.12}s`,
            left: ['74%', '64%', '8%'][i],
            top: ['14%', '28%', '82%'][i],
          }}
        >
          {t}
        </span>
      ))}
    </div>
  )
}
