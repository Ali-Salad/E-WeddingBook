export function MonogramMark() {
  return (
    <div
      style={{ width: "36px", height: "36px" }}
      className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center shadow-[inset_0_1px_2px_rgba(44,34,36,0.04)] shrink-0"
    >
      <span className="font-signature text-secondary text-signature italic font-normal">H</span>
    </div>
  );
}

export function RingsEmblem() {
  return (
    <div
      style={{ width: "80px", height: "80px" }}
      className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center p-2 shadow-sm transition-transform duration-500 hover:scale-105 mx-auto"
    >
      <svg
        viewBox="0 0 100 100"
        width="80"
        height="80"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(119,90,25,0.22)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldGradient" x1="10" y1="15" x2="90" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9F1DE" />
            <stop offset="25%" stopColor="#E5C787" />
            <stop offset="55%" stopColor="#C5A059" />
            <stop offset="85%" stopColor="#8C6D32" />
            <stop offset="100%" stopColor="#5D4201" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Left Wedding Ring */}
        <ellipse
          cx="40"
          cy="42"
          rx="22"
          ry="22"
          stroke="url(#goldGradient)"
          strokeWidth="3.2"
          className="transition-all"
        />

        {/* Right Wedding Ring (Intertwined) */}
        <ellipse
          cx="60"
          cy="42"
          rx="22"
          ry="22"
          stroke="url(#goldGradient)"
          strokeWidth="3.2"
        />

        {/* Overlap Intertwine Arc to create true 3D interlock */}
        <path
          d="M 50 22 A 22 22 0 0 1 54 35"
          stroke="url(#goldGradient)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Diamond / Sparkle Crest at Top */}
        <path
          d="M 50 14 L 52.5 19 L 57.5 21 L 52.5 23 L 50 28 L 47.5 23 L 42.5 21 L 47.5 19 Z"
          fill="#FAF8F5"
          stroke="#C5A059"
          strokeWidth="0.8"
          filter="url(#softGlow)"
        />

        {/* Letterpress Title Below Rings */}
        <text
          x="50"
          y="77"
          textAnchor="middle"
          fill="#775a19"
          fontFamily="var(--font-playfair), Georgia, serif"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="2.5"
        >
          HAMBALYO
        </text>

        {/* Gold Script Accent */}
        <text
          x="50"
          y="88"
          textAnchor="middle"
          fill="#C5A059"
          fontFamily="var(--font-playfair), Georgia, serif"
          fontSize="8.5"
          fontStyle="italic"
        >
          Weddings
        </text>
      </svg>
    </div>
  );
}
