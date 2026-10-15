/* Vermilion name seal — シャ / ラン (Sha-ran), the site's mark. */
export default function Hanko({ size = 34, className = '' }) {
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center rounded-[22%] bg-signal text-paper ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="font-ja grid leading-[0.92] text-center"
        style={{ fontSize: size * 0.34, letterSpacing: '-0.04em' }}
      >
        <span>シャ</span>
        <span>ラン</span>
      </span>
      <span className="absolute inset-[7%] rounded-[18%] border border-paper/70" />
    </span>
  )
}
