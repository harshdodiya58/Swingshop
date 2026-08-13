import { cn } from "@/lib/utils";

export function LogoMark({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  const seat = dark ? "#f7f3ea" : "#633816";
  const badge = dark ? "#8f5426" : "#ffffff";
  const badgeEdge = dark ? "#45220d" : "#efe3cc";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-10", className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient
          id={`scs-badge-${tone}`}
          cx="32%"
          cy="28%"
          r="85%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={badge} />
          <stop offset="100%" stopColor={badgeEdge} />
        </radialGradient>
        <linearGradient
          id={`scs-gold-${tone}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#e7c38a" />
          <stop offset="50%" stopColor="#b58a4a" />
          <stop offset="100%" stopColor="#8f6226" />
        </linearGradient>
      </defs>

      {/* Seal badge */}
      <circle cx="24" cy="24" r="22" fill={`url(#scs-badge-${tone})`} />
      <circle
        cx="24"
        cy="24"
        r="21.2"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.3"
      />
      <circle
        cx="24"
        cy="24"
        r="19.2"
        stroke={`url(#scs-gold-${tone})`}
        strokeOpacity="0.45"
        strokeWidth="0.6"
      />

      {/* Freestanding garden-swing frame */}
      {/* Awning finial */}
      <circle cx="24" cy="6.2" r="1.1" fill={`url(#scs-gold-${tone})`} />
      {/* Awning canopy */}
      <path
        d="M14.5 17 C14.5 9.5 18.5 7.5 24 7.5 C29.5 7.5 33.5 9.5 33.5 17"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Top crossbar */}
      <path
        d="M15.5 17.5 H32.5"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Side posts (MS/SS frame) */}
      <path
        d="M15.5 17.5 V35"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M32.5 17.5 V35"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Bottom foot bar */}
      <path
        d="M17.5 35 H30.5"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Chains */}
      <path
        d="M19 17.5 L18 30.5"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M29 17.5 L30 30.5"
        stroke={`url(#scs-gold-${tone})`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Brass washers */}
      <circle cx="18" cy="30.5" r="1.1" fill={`url(#scs-gold-${tone})`} />
      <circle cx="30" cy="30.5" r="1.1" fill={`url(#scs-gold-${tone})`} />

      {/* Soft ground shadow */}
      <ellipse cx="24" cy="38" rx="9" ry="1.8" fill={`url(#scs-gold-${tone})`} opacity="0.2" />

      {/* Hanging seat */}
      <path
        d="M16 31.5 C20 33.5 28 33.5 32 31.5"
        stroke={seat}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
