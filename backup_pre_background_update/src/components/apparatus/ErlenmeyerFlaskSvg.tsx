import React from 'react';

interface ErlenmeyerFlaskSvgProps {
  deliveredVolumeMl: number; // Volume NaOH added to flask
  pH: number;
  indicatorColorHex: string;
  indicatorAlpha: number;
  isSwirling: boolean;
  pinkCloudIntensity?: number;
  hasDropRipple?: boolean;
}

export const ErlenmeyerFlaskSvg: React.FC<ErlenmeyerFlaskSvgProps> = ({
  deliveredVolumeMl,
  pH,
  indicatorColorHex,
  indicatorAlpha,
  isSwirling,
  pinkCloudIntensity = 0,
  hasDropRipple = false
}) => {
  // Total liquid in flask: 25.00 mL HCl sample + delivered NaOH
  const totalMl = 25.0 + deliveredVolumeMl;

  // Liquid height in flask:
  // Base at Y=230, Rim at Y=40, Conical body from Y=120 to Y=230
  // 25 mL fills up to ~Y=185; 50 mL fills up to ~Y=160; 75 mL fills up to ~Y=140
  const baseLiquidY = 230;
  // Calculate top of liquid level smoothly based on volume
  const liquidTopY = Math.max(130, 190 - (totalMl - 25) * 1.0);
  const liquidHeight = baseLiquidY - liquidTopY;

  // Calculate width of conical flask at liquidTopY:
  // At Y=120 (neck base), half-width = 24
  // At Y=230 (flask base), half-width = 76
  const progress = (liquidTopY - 120) / (230 - 120);
  const halfWidthAtSurface = 24 + (1 - progress) * (76 - 24);

  return (
    <div className={`relative flex flex-col items-center select-none transition-transform duration-300 ${
      isSwirling ? 'animate-swirl' : ''
    }`}>
      <svg
        viewBox="0 0 240 260"
        className="w-full h-auto max-h-[260px] drop-shadow-2xl"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* White porcelain tile gradient */}
          <linearGradient id="tileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Flask Outer Glass Clip */}
          <clipPath id="flaskInteriorClip">
            <path
              d="
                M 104 42
                L 104 115
                L 44 226
                C 44 232 50 236 60 236
                L 180 236
                C 190 236 196 232 196 226
                L 136 115
                L 136 42
                Z
              "
            />
          </clipPath>

          {/* Subtle liquid glass reflection */}
          <linearGradient id="liquidHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* --- WHITE CERAMIC TILE BASE (ALAS PORSELEN PUTIH) --- */}
        <g id="white-tile">
          {/* Tile 3D Perspective Shadow */}
          <polygon
            points="15,245 225,245 235,258 5,258"
            fill="#090d16"
            opacity="0.6"
          />
          {/* Main White Tile Body */}
          <polygon
            points="20,240 220,240 232,253 8,253"
            fill="url(#tileGradient)"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
          {/* Tile Gloss Accent */}
          <line x1="25" y1="242" x2="215" y2="242" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* --- ERLENMEYER FLASK SHADOW --- */}
        <ellipse cx="120" cy="238" rx="72" ry="7" fill="#020617" opacity="0.35" />

        {/* --- LIQUID IN FLASK (BEHIND GLASS) --- */}
        <g clipPath="url(#flaskInteriorClip)">
          {/* Base Aqueous Layer (clear water/acid, pale cyan-tinted baseline) */}
          <rect
            x="30"
            y={liquidTopY}
            width="180"
            height={liquidHeight + 10}
            fill="#e0f2fe"
            fillOpacity={0.65}
          />

          {/* Dynamic Phenolphthalein Pink Color Overlay */}
          {indicatorAlpha > 0 && (
            <rect
              x="30"
              y={liquidTopY}
              width="180"
              height={liquidHeight + 10}
              fill={indicatorColorHex}
              fillOpacity={indicatorAlpha}
              className="transition-all duration-300"
            />
          )}

          {/* Localized Temporary Droplet Pink Cloud before Endpoint */}
          {pinkCloudIntensity > 0 && (
            <ellipse
              cx="120"
              cy={liquidTopY + 12}
              rx={18 + (1 - pinkCloudIntensity) * 22}
              ry={8 + (1 - pinkCloudIntensity) * 8}
              fill="#f43f5e"
              opacity={pinkCloudIntensity * 0.75}
              className="transition-opacity duration-200"
            />
          )}

          {/* Liquid Meniscus / Curved Surface */}
          <ellipse
            cx="120"
            cy={liquidTopY}
            rx={halfWidthAtSurface}
            ry={halfWidthAtSurface * 0.14}
            fill={indicatorAlpha > 0.3 ? indicatorColorHex : '#bae6fd'}
            fillOpacity={indicatorAlpha > 0 ? Math.min(0.9, indicatorAlpha + 0.3) : 0.75}
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />

          {/* Drop Ripple Ring on Surface when droplet lands */}
          {hasDropRipple && (
            <ellipse
              cx="120"
              cy={liquidTopY}
              rx={halfWidthAtSurface * 0.45}
              ry={halfWidthAtSurface * 0.08}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.8"
            >
              <animate
                attributeName="rx"
                from="2"
                to={String(halfWidthAtSurface * 0.85)}
                dur="0.6s"
                repeatCount="1"
              />
              <animate
                attributeName="opacity"
                from="0.9"
                to="0"
                dur="0.6s"
                repeatCount="1"
              />
            </ellipse>
          )}

          {/* Internal Liquid Highlights */}
          <rect
            x="30"
            y={liquidTopY}
            width="180"
            height={liquidHeight + 10}
            fill="url(#liquidHighlight)"
          />
        </g>

        {/* --- ERLENMEYER GLASS OUTLINE & MARKS --- */}
        {/* Flask Glass Wall */}
        <path
          d="
            M 104 38
            L 104 115
            L 44 226
            C 43 232 48 236 58 236
            L 182 236
            C 192 236 197 232 196 226
            L 136 115
            L 136 38
            Z
          "
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Flared Rim Lip at top of neck */}
        <ellipse cx="120" cy="38" rx="19" ry="4.5" fill="#f8fafc" fillOpacity="0.2" stroke="#cbd5e1" strokeWidth="1.8" />
        <ellipse cx="120" cy="38" rx="15" ry="3.2" fill="none" stroke="#64748b" strokeWidth="0.8" />

        {/* Approximate Volume Graduation Lines (50, 100, 150, 200 mL) */}
        <g opacity="0.65">
          {/* 50 mL */}
          <line x1="88" y1="205" x2="108" y2="205" stroke="#cbd5e1" strokeWidth="1.2" />
          <text x="112" y="208" fill="#cbd5e1" fontSize="7" fontFamily="monospace">50 ml</text>

          {/* 100 mL */}
          <line x1="94" y1="180" x2="114" y2="180" stroke="#cbd5e1" strokeWidth="1.2" />
          <text x="118" y="183" fill="#cbd5e1" fontSize="7" fontFamily="monospace">100</text>

          {/* 150 mL */}
          <line x1="100" y1="155" x2="120" y2="155" stroke="#cbd5e1" strokeWidth="1.2" />
          <text x="124" y="158" fill="#cbd5e1" fontSize="7" fontFamily="monospace">150</text>

          {/* 200 mL */}
          <line x1="106" y1="130" x2="124" y2="130" stroke="#cbd5e1" strokeWidth="1.2" />
          <text x="128" y="133" fill="#cbd5e1" fontSize="7" fontFamily="monospace">200</text>
        </g>

        {/* Glass reflection curves */}
        <path
          d="M 108 45 L 108 112 L 62 215"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
        <path
          d="M 180 230 C 188 228 190 224 186 215"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />

        {/* Flask Brand / Spec stamp */}
        <g opacity="0.45">
          <text x="120" y="98" fill="#e2e8f0" fontSize="6" textAnchor="middle" fontFamily="sans-serif">
            BORO 3.3
          </text>
          <text x="120" y="106" fill="#e2e8f0" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            250 mL
          </text>
        </g>
      </svg>
    </div>
  );
};
