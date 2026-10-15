/* Text that rolls up to a copy of itself on hover (CSS only). */
export default function RollText({ children, className = '' }) {
  return (
    <span className={`roll group/roll relative inline-flex overflow-hidden align-top ${className}`}>
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/roll:-translate-y-full">
        {children}
      </span>
      <span
        className="absolute left-0 top-full block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/roll:-translate-y-full"
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}
