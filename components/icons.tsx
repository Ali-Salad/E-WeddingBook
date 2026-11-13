type IconProps = { className?: string };

export function IconSparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2.1 13.35 8.05 19.5 9.35 13.35 10.7 12 16.7 10.65 10.7 4.5 9.35 10.65 8.05 12 2.1Z" />
      <path d="M18.15 13.1 18.8 15.35 21.05 16 18.8 16.65 18.15 18.9 17.5 16.65 15.25 16 17.5 15.35 18.15 13.1Z" />
      <path d="M6.35 13.55 6.85 15.2 8.5 15.7 6.85 16.2 6.35 17.85 5.85 16.2 4.2 15.7 5.85 15.2 6.35 13.55Z" />
    </svg>
  );
}

export function IconLock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function IconPerson({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <circle cx="12" cy="8" r="3.1" />
      <path d="M6.2 18.6c.7-2.7 2.9-4.1 5.8-4.1s5.1 1.4 5.8 4.1c.2.7-.3 1.4-1 1.4H7.2c-.7 0-1.2-.7-1-1.4Z" />
    </svg>
  );
}

export function IconEye({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M2.8 12S6.2 6.8 12 6.8 21.2 12 21.2 12 17.8 17.2 12 17.2 2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8.2V12l2.6 1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 19.4s-6.6-4.1-6.6-8.3C5.4 8.8 7 7.2 9 7.2c1.2 0 2.2.6 3 1.6.8-1 1.8-1.6 3-1.6 2 0 3.6 1.6 3.6 3.9 0 4.2-6.6 8.3-6.6 8.3Z" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function IconSeal({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="7.2" />
      <path d="m8.8 12.2 2.1 2.1 4.4-4.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
