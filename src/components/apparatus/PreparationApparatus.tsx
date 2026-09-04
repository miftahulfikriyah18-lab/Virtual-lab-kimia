import React from 'react';

interface VolumetricPipetteProps {
  volumeMl?: number; // 25.00 mL
  isFilled?: boolean;
  hasFiller?: boolean;
}

export const VolumetricPipetteSvg: React.FC<VolumetricPipetteProps> = ({
  isFilled = false,
  hasFiller = true
}) => {
  return (
    <svg viewBox="0 0 80 260" className="w-16 h-auto drop-shadow-md">
      <defs>
        <linearGradient id="pipetteLiquid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Rubber Pipette Filler (Bulb) on top */}
      {hasFiller && (
        <g id="pipette-filler">
          {/* Main green bulb */}
          <ellipse cx="40" cy="30" rx="18" ry="20" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
          {/* Top aspirate valve "A" */}
          <circle cx="40" cy="8" r="4.5" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          <text x="40" y="10" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">A</text>
          {/* Suction valve "S" */}
          <circle cx="28" cy="54" r="4" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          <text x="28" y="56" fill="#ffffff" fontSize="4.5" fontWeight="bold" textAnchor="middle">S</text>
          {/* Drain valve "E" */}
          <circle cx="52" cy="54" r="4" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          <text x="52" y="56" fill="#ffffff" fontSize="4.5" fontWeight="bold" textAnchor="middle">E</text>
        </g>
      )}

      {/* Pipette Upper Stem */}
      <rect x="37.5" y="60" width="5" height="50" rx="1" fill="#f8fafc" fillOpacity="0.3" stroke="#94a3b8" strokeWidth="1" />

      {/* Calibration Ring (Garis Tanda Batas 25 mL) */}
      <line x1="36" y1="85" x2="44" y2="85" stroke="#dc2626" strokeWidth="1.2" />

      {/* Bulbed Center Section */}
      <ellipse cx="40" cy="140" rx="14" ry="30" fill="#f8fafc" fillOpacity="0.3" stroke="#94a3b8" strokeWidth="1.2" />

      {/* Liquid inside bulb if filled */}
      {isFilled && (
        <g>
          <ellipse cx="40" cy="140" rx="12.5" ry="28" fill="url(#pipetteLiquid)" />
          <rect x="38" y="85" width="4" height="25" fill="url(#pipetteLiquid)" />
          <rect x="38.5" y="170" width="3" height="75" fill="url(#pipetteLiquid)" />
        </g>
      )}

      {/* Volume text */}
      <text x="40" y="142" fill="#334155" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        25 mL
      </text>

      {/* Lower Tapered Delivery Tip */}
      <path
        d="M 37.5 170 L 37.5 245 L 39 252 L 41 252 L 42.5 245 L 42.5 170 Z"
        fill="#f8fafc"
        fillOpacity="0.3"
        stroke="#94a3b8"
        strokeWidth="1"
      />
    </svg>
  );
};

export const ReagentBottleSvg: React.FC<{
  label: string;
  sublabel: string;
  colorClass?: string;
  badge?: string;
}> = ({ label, sublabel, colorClass = 'text-amber-400', badge }) => {
  return (
    <svg viewBox="0 0 100 130" className="w-20 h-auto drop-shadow-md">
      {/* Cap */}
      <rect x="38" y="10" width="24" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <line x1="42" y1="14" x2="58" y2="14" stroke="#64748b" strokeWidth="1" />
      <line x1="42" y1="18" x2="58" y2="18" stroke="#64748b" strokeWidth="1" />

      {/* Bottle Shoulder & Body (Amber Chemical Bottle) */}
      <path
        d="M 40 25 L 40 32 C 40 36 22 42 20 50 L 20 115 C 20 122 26 124 35 124 L 65 124 C 74 124 80 122 80 115 L 80 50 C 78 42 60 36 60 32 L 60 25 Z"
        fill="#78350f"
        fillOpacity="0.85"
        stroke="#451a03"
        strokeWidth="2"
      />

      {/* Bottle Glass Highlight */}
      <path
        d="M 24 54 L 24 115"
        fill="none"
        stroke="#fde68a"
        strokeWidth="1.5"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />

      {/* Chemical Label Plaque */}
      <rect x="25" y="52" width="50" height="52" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="28" y="55" width="44" height="2" fill="#ef4444" />

      <text x="50" y="70" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        {label}
      </text>
      <text x="50" y="82" fill="#475569" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
        {sublabel}
      </text>

      {badge && (
        <g>
          <rect x="32" y="88" width="36" height="11" rx="2" fill="#fee2e2" />
          <text x="50" y="96" fill="#dc2626" fontSize="5.5" fontWeight="bold" textAnchor="middle">
            {badge}
          </text>
        </g>
      )}
    </svg>
  );
};

export const IndicatorDropperBottleSvg: React.FC<{
  dropsAdded?: number;
}> = ({ dropsAdded = 0 }) => {
  return (
    <svg viewBox="0 0 90 120" className="w-18 h-auto drop-shadow-md">
      {/* Rubber Teat Cap */}
      <path d="M 36 8 C 36 2 54 2 54 8 L 56 22 L 34 22 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
      {/* Collar */}
      <rect x="32" y="22" width="26" height="8" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />

      {/* Glass Dropper Bottle Body */}
      <path
        d="M 35 30 L 22 45 L 22 105 C 22 110 26 114 34 114 L 56 114 C 64 114 68 110 68 105 L 68 45 L 55 30 Z"
        fill="#0284c7"
        fillOpacity="0.4"
        stroke="#0369a1"
        strokeWidth="1.5"
      />

      {/* White label */}
      <rect x="26" y="50" width="38" height="42" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <text x="45" y="66" fill="#be185d" fontSize="6" fontWeight="bold" textAnchor="middle">
        INDIKATOR
      </text>
      <text x="45" y="76" fill="#0f172a" fontSize="6.5" fontWeight="extrabold" textAnchor="middle">
        PP 1%
      </text>
      <text x="45" y="86" fill="#64748b" fontSize="5" textAnchor="middle">
        Fenolftalein
      </text>

      {/* Pipette Pipet Inside Bottle */}
      <line x1="45" y1="28" x2="45" y2="108" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
    </svg>
  );
};

export const BuretteStandIconSvg: React.FC<{ isMounted?: boolean }> = ({ isMounted = false }) => {
  return (
    <svg viewBox="0 0 70 120" className="w-14 h-auto drop-shadow-md">
      {/* Stand Base */}
      <rect x="8" y="106" width="54" height="8" rx="1.5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Upright Rod */}
      <rect x="18" y="8" width="4" height="98" rx="1" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" />
      {/* Clamps */}
      <rect x="16" y="38" width="18" height="3" fill="#64748b" />
      <rect x="16" y="68" width="18" height="3" fill="#64748b" />
      {isMounted ? (
        <g>
          {/* Mounted Burette */}
          <rect x="32" y="14" width="6" height="80" rx="0.8" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" />
          <line x1="32" y1="30" x2="36" y2="30" stroke="#0369a1" strokeWidth="0.7" />
          <line x1="32" y1="50" x2="36" y2="50" stroke="#0369a1" strokeWidth="0.7" />
          <line x1="32" y1="70" x2="36" y2="70" stroke="#0369a1" strokeWidth="0.7" />
          <circle cx="35" cy="85" r="2.5" fill="#ef4444" />
          <line x1="35" y1="88" x2="35" y2="95" stroke="#0284c7" strokeWidth="0.8" />
        </g>
      ) : (
        <g opacity="0.85">
          {/* Unmounted Burette on the side */}
          <rect x="44" y="20" width="6" height="76" rx="0.8" fill="#ffffff" fillOpacity="0.6" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 1.5" />
          <circle cx="47" cy="86" r="2" fill="#ef4444" opacity="0.7" />
        </g>
      )}
    </svg>
  );
};

export const WashBottleSvg: React.FC<{ isSpraying?: boolean }> = ({ isSpraying = false }) => {
  return (
    <svg viewBox="0 0 100 130" className="w-20 h-auto drop-shadow-md">
      <defs>
        <linearGradient id="washBottleBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="40%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="waterInsideWashBottle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Swan-neck delivery spout tube */}
      <path
        d="M 50 32 L 50 14 C 50 4 68 4 72 16 L 78 28"
        fill="none"
        stroke="#0284c7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 50 32 L 50 14 C 50 4 68 4 72 16 L 78 28"
        fill="none"
        stroke="#e0f2fe"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Water spray jet if active */}
      {isSpraying && (
        <path
          d="M 78 28 Q 88 36 96 46"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          className="animate-pulse"
        />
      )}

      {/* Screw Cap */}
      <rect x="36" y="28" width="28" height="12" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
      <line x1="40" y1="31" x2="40" y2="37" stroke="#38bdf8" strokeWidth="1" />
      <line x1="46" y1="31" x2="46" y2="37" stroke="#38bdf8" strokeWidth="1" />
      <line x1="52" y1="31" x2="52" y2="37" stroke="#38bdf8" strokeWidth="1" />
      <line x1="58" y1="31" x2="58" y2="37" stroke="#38bdf8" strokeWidth="1" />

      {/* Bottle Body */}
      <path
        d="M 38 40 L 26 56 C 24 59 24 64 24 70 L 24 116 C 24 122 28 126 36 126 L 64 126 C 72 126 76 122 76 116 L 76 70 C 76 64 76 59 74 56 L 62 40 Z"
        fill="url(#washBottleBodyGrad)"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Water level inside bottle */}
      <path
        d="M 25 78 Q 50 75 75 78 L 75 116 C 75 121 71 125 64 125 L 36 125 C 29 125 25 121 25 116 Z"
        fill="url(#waterInsideWashBottle)"
      />

      {/* Inner suction straw */}
      <line x1="48" y1="40" x2="44" y2="124" stroke="#94a3b8" strokeWidth="2.5" strokeOpacity="0.6" />

      {/* Label */}
      <rect x="29" y="82" width="42" height="24" rx="2" fill="#ffffff" stroke="#93c5fd" strokeWidth="0.8" />
      <text x="50" y="93" fill="#0369a1" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        AQUADES
      </text>
      <text x="50" y="102" fill="#64748b" fontSize="5" textAnchor="middle" fontFamily="sans-serif">
        Air Suling (H₂O)
      </text>
    </svg>
  );
};

export const WasteBeakerSvg: React.FC<{ liquidMl?: number }> = ({ liquidMl = 40 }) => {
  return (
    <svg viewBox="0 0 100 120" className="w-18 h-auto drop-shadow-md">
      {/* Beaker Body */}
      <path
        d="M 18 20 L 12 18 L 18 25 L 20 106 C 20 112 24 116 32 116 L 68 116 C 76 116 80 112 80 106 L 82 20 Z"
        fill="#f8fafc"
        fillOpacity="0.4"
        stroke="#64748b"
        strokeWidth="1.6"
      />
      {/* Liquid inside */}
      <path
        d="M 21 68 Q 50 66 79 68 L 79 106 C 79 111 75 115 68 115 L 32 115 C 25 115 21 111 21 106 Z"
        fill="#bae6fd"
        fillOpacity="0.75"
      />
      {/* Graduation lines */}
      <line x1="22" y1="95" x2="32" y2="95" stroke="#94a3b8" strokeWidth="1" />
      <text x="35" y="97" fill="#64748b" fontSize="5" fontFamily="monospace">50</text>
      <line x1="22" y1="78" x2="34" y2="78" stroke="#94a3b8" strokeWidth="1" />
      <text x="37" y="80" fill="#64748b" fontSize="5" fontFamily="monospace">100</text>
      <line x1="21" y1="60" x2="32" y2="60" stroke="#94a3b8" strokeWidth="1" />
      <text x="35" y="62" fill="#64748b" fontSize="5" fontFamily="monospace">150</text>

      {/* Label */}
      <rect x="36" y="86" width="40" height="15" rx="1.5" fill="#fef2f2" stroke="#fca5a5" strokeWidth="0.8" />
      <text x="56" y="94" fill="#b91c1c" fontSize="5" fontWeight="bold" textAnchor="middle">
        BEAKER LIMBAH
      </text>
      <text x="56" y="99" fill="#7f1d1d" fontSize="3.8" textAnchor="middle">
        Penampung Bilasan
      </text>
    </svg>
  );
};
