/* A word rendered as an LLM token: pastel chip + tiny token id. */
export default function Token({ children, color = 'var(--color-lime)', id, className = '', chipClass = '' }) {
  return (
    <span className={`token relative inline-block whitespace-nowrap ${className}`}>
      <span
        className={`token-chip absolute -inset-x-[0.08em] inset-y-[0.08em] -z-0 origin-left rounded-[0.12em] ${chipClass}`}
        style={{ background: color }}
        aria-hidden="true"
      />
      {id != null && (
        <span
          className="token-id absolute left-full top-[0.2em] ml-[0.35em] whitespace-nowrap font-mono not-italic uppercase tracking-wide text-smoke"
          style={{ fontSize: 'max(10px, 0.085em)', lineHeight: 1 }}
          aria-hidden="true"
        >
          {id}
        </span>
      )}
      <span className="relative">{children}</span>
    </span>
  )
}
