type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="22.4" fill="var(--terracotta)" stroke="var(--green)" strokeWidth="1.2" />
      <path
        d="M24.8 6.5c1.7.9 1.2 3.4 2.7 5.1 1.1 1.3 3.1 1.7 3.2 3.8.1 2.1 2.3 3.1 3.6 4.6 1.5 1.7-.1 3.8.1 5.7.3 2.6-2.1 3.8-3.3 5.6-1.3 1.9-1 4.4-2.7 6.2-1.1 1.2-1.8 3.9-4 4.2-2.1.3-2.9-2.1-4.1-3.8-1.2-1.6-1.4-3.5-2.8-5-1.3-1.4-2.4-2.8-3.2-4.7-.7-1.8.4-3.3-.3-5.1-.7-1.9 1.7-3 2.9-4.5 1.4-1.7.8-3.8 2.6-5.2 1.8-1.4 1.7-4.2 3.2-6.1.5-.7 1.3-1 2.1-.8Z"
        fill="var(--paper)"
      />
      <path
        d="M23 12.3c-.8 3.8 3.2 5.1 2.1 8.4-.8 2.4-4.5 3-4.1 5.9.4 2.7 4.7 3 4.3 5.8-.2 1.6-1.2 2.7-1.8 4"
        stroke="var(--green)"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <circle cx="22.9" cy="12.3" r="1.7" fill="var(--gold)" stroke="var(--paper)" strokeWidth=".8" />
      <circle cx="21" cy="26.6" r="1.7" fill="var(--gold)" stroke="var(--paper)" strokeWidth=".8" />
      <circle cx="25.3" cy="32.6" r="1.7" fill="var(--gold)" stroke="var(--paper)" strokeWidth=".8" />
      <circle cx="14.5" cy="14.4" r="2.15" fill="var(--gold)" />
    </svg>
  );
}
