'use client'

export function InfinityMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18.5 6C15.5 6 13 9 12 11.5 11 9 8.5 6 5.5 6 3 6 1.5 8 1.5 12S3 18 5.5 18c3 0 5.5-3 6.5-5.5C13 15 15.5 18 18.5 18 21 18 22.5 16 22.5 12S21 6 18.5 6Z"
        stroke="url(#infinity-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="infinity-grad" x1="1.5" y1="12" x2="22.5" y2="12">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#c084fc" />
        </linearGradient>
      </defs>
    </svg>
  )
}
