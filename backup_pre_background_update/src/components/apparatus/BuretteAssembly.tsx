import React from 'react';
import { StopcockRate } from '../../types';

export interface BuretteFlaskProps {
  isPlaced: boolean; // whether flask is resting on the white tile under burette
  deliveredVolumeMl: number;
  pH: number;
  indicatorColorHex: string;
  indicatorAlpha: number;
  isSwirling: boolean;
  pinkCloudIntensity?: number;
  hasDropRipple?: boolean;
  onPlaceFlask?: () => void;
  isPlaceActive?: boolean;
  showPhMeter?: boolean;
}

export interface BuretteAssemblyProps {
  currentReading: number; // 0.00 to 50.00 mL
  stopcockState: StopcockRate;
  isDropping: boolean;
  hasAirBubble: boolean;
  onStopcockChange?: (rate: StopcockRate) => void;
  interactiveStopcock?: boolean;
  isMounted?: boolean; // false = detached on table, true = clamped on retort stand
  onMountBurette?: () => void; // user mounts burette on retort stand
  flaskProps?: BuretteFlaskProps; // Erlenmeyer flask placed directly under burette
  // New props for rinsing and air bubble inspection:
  rinseMode?: 'none' | 'water' | 'naoh';
  isRinsingActive?: boolean;
  isFlushingBubble?: boolean;
  showBubbleInspector?: boolean;
  onFlushBubble?: () => void;
}

export const BuretteAssembly: React.FC<BuretteAssemblyProps> = ({
  currentReading,
  stopcockState,
  isDropping,
  hasAirBubble,
  onStopcockChange,
  interactiveStopcock = true,
  isMounted = true,
  onMountBurette,
  flaskProps,
  rinseMode = 'none',
  isRinsingActive = false,
  isFlushingBubble = false,
  showBubbleInspector = false,
  onFlushBubble
}) => {
  // Tube height coordinates
  // Scale: 0 mL at Y=75, 50 mL at Y=345 (Height = 270px => 5.4px per mL)
  const topY = 75;
  const bottomY = 345;
  const totalScaleHeight = bottomY - topY;

  // Clamped reading between 0 and 50
  const clampedReading = Math.max(0, Math.min(50, currentReading));
  const liquidTopY = topY + (clampedReading / 50) * totalScaleHeight;
  const liquidHeight = Math.max(0, bottomY - liquidTopY + 36); // Extends into taper & stopcock

  // Centerline for mounted burette and flask
  const cx = 160;

  // Stopcock visual rotation angle
  const getStopcockAngle = () => {
    // When actively rinsing or flushing bubble, stopcock is fully opened vertically
    if (isRinsingActive || isFlushingBubble) {
      return 90;
    }
    switch (stopcockState) {
      case 'closed':
        return 0; // Horizontal (perpendicular to tube)
      case 'dropwise':
        return 28;
      case 'slow':
        return 58;
      case 'fast':
        return 90; // Vertical (aligned with flow)
    }
  };

  // Generate graduation marks (every 1 mL, every 5 mL major with number)
  const ticks = [];
  for (let ml = 0; ml <= 50; ml += 1) {
    const y = topY + (ml / 50) * totalScaleHeight;
    const isMajor = ml % 5 === 0;
    const isMid = ml % 1 === 0 && !isMajor;

    ticks.push(
      <g key={`tick-${ml}`}>
        <line
          x1={cx + 6}
          y1={y}
          x2={isMajor ? cx + 18 : isMid ? cx + 13 : cx + 10}
          y2={y}
          stroke="#94a3b8"
          strokeWidth={isMajor ? 1.4 : 0.8}
        />
        {isMajor && (
          <text
            x={cx + 21}
            y={y + 3.2}
            fill="#475569"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="700"
          >
            {ml}
          </text>
        )}
      </g>
    );

    // Minor ticks between major ticks
    if (ml < 50) {
      for (let sub = 1; sub < 5; sub++) {
        const subY = y + (sub * (totalScaleHeight / 50)) / 5;
        ticks.push(
          <line
            key={`sub-${ml}-${sub}`}
            x1={cx + 6}
            y1={subY}
            x2={sub === 2 ? cx + 11 : cx + 9}
            y2={subY}
            stroke="#cbd5e1"
            strokeWidth={0.6}
          />
        );
      }
    }
  }

  // Calculate liquid inside Erlenmeyer flask if placed
  const totalFlaskMl = flaskProps ? 25.0 + flaskProps.deliveredVolumeMl : 25.0;
  // Base at Y=578, Conical body from Y=475 to Y=578 (height 103px)
  const baseFlaskLiquidY = 578;
  const flaskLiquidTopY = Math.max(490, 545 - (totalFlaskMl - 25) * 1.3);
  const flaskLiquidHeight = baseFlaskLiquidY - flaskLiquidTopY;
  const flaskProgress = (flaskLiquidTopY - 475) / (578 - 475);
  const halfWidthAtSurface = 14 + (1 - flaskProgress) * (55 - 14);

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 340 635"
        className="w-full h-auto max-h-[580px] drop-shadow-xl"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glass tube linear gradient */}
          <linearGradient id="buretteGlassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
          </linearGradient>

          {/* Liquid NaOH gradient */}
          <linearGradient id="naohLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#e0f2fe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.8" />
          </linearGradient>

          {/* Metal Retort Stand Gradient */}
          <linearGradient id="retortMetalStand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="40%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* White Porcelain Tile Gradient */}
          <linearGradient id="whiteTileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fdfbf7" />
            <stop offset="100%" stopColor="#eae4d7" />
          </linearGradient>

          {/* Water stream gradient for rinsing */}
          <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>

          {/* NaOH rinse stream gradient */}
          <linearGradient id="naohFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>

          {/* Magnifying Loupe Glass Radial Gradient */}
          <radialGradient id="loupeGlassGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f0f9ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.6" />
          </radialGradient>

          {/* Burette inner clipping mask for liquid */}
          <clipPath id="mountedBuretteInside">
            <rect x={cx - 7} y="70" width="14" height="310" rx="1" />
          </clipPath>

          {/* Flask interior clipping mask */}
          <clipPath id="erlenmeyerInteriorClip">
            <path
              d={`
                M ${cx - 15} 434
                L ${cx - 14} 475
                L ${cx - 52} 572
                C ${cx - 52} 577 ${cx - 46} 578 ${cx - 36} 578
                L ${cx + 36} 578
                C ${cx + 46} 578 ${cx + 52} 577 ${cx + 52} 572
                L ${cx + 14} 475
                L ${cx + 15} 434
                Z
              `}
            />
          </clipPath>
        </defs>

        {/* --- 1. RETORT STAND (STATIF LABORATORIUM) --- */}
        {/* Retort Stand Heavy Cast Iron Base */}
        <g id="retort-stand-base">
          {/* Base plate 3D bevel bottom */}
          <polygon
            points="25,600 275,600 268,614 20,614"
            fill="#0f172a"
            opacity="0.8"
          />
          {/* Main heavy base plate */}
          <polygon
            points="30,594 270,594 275,600 25,600"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* Top surface of stand base */}
          <rect
            x="30"
            y="592"
            width="240"
            height="3"
            fill="#334155"
          />
        </g>

        {/* Vertical Stainless Steel Rod (Batang Statif) */}
        <g id="retort-stand-rod">
          <rect
            x="64"
            y="22"
            width="10"
            height="572"
            rx="2"
            fill="url(#retortMetalStand)"
            stroke="#1e293b"
            strokeWidth="1"
          />
          {/* Rod metallic reflection */}
          <line x1="67" y1="24" x2="67" y2="590" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
        </g>

        {/* --- 2. WHITE PORCELAIN TILE (ALAS PUTIH DI BAWAH BURET) --- */}
        <g id="white-porcelain-tile">
          {/* Tile sits directly centered under the burette (cx = 160) */}
          <polygon
            points="82,580 238,580 244,592 76,592"
            fill="url(#whiteTileGrad)"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
          {/* Tile top gloss edge */}
          <line x1="84" y1="581" x2="236" y2="581" stroke="#ffffff" strokeWidth="1.5" />
          <text
            x={cx}
            y="589"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="6.5"
            fontFamily="sans-serif"
            letterSpacing="0.1em"
            opacity="0.75"
          >
            ALAS PORSELEN PUTIH
          </text>
        </g>

        {/* --- 3. CLAMPS & BOSSHEADS --- */}
        {/* Upper Clamp Arm */}
        <g id="clamp-upper">
          {/* Bosshead on rod */}
          <rect x="58" y="146" width="22" height="18" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <circle cx="61" cy="155" r="3.5" fill="#94a3b8" />
          {/* Horizontal clamp rod extending towards cx=160 */}
          <rect x="79" y="153" width="70" height="4" fill="url(#retortMetalStand)" stroke="#334155" strokeWidth="0.8" />

          {/* Clamp Prongs (Upper) */}
          {isMounted ? (
            /* Jaws tightly gripping mounted burette */
            <g>
              <path
                d={`M 149 148 C 149 148 168 144 172 150 C 172 156 150 159 150 159`}
                fill="none"
                stroke="#dc2626"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d={`M 149 164 C 149 164 168 167 172 161 C 172 157 150 154 150 154`}
                fill="none"
                stroke="#dc2626"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          ) : (
            /* Jaws spread OPEN waiting for burette */
            <g
              className="cursor-pointer"
              onClick={onMountBurette}
            >
              <path
                d={`M 148 142 C 148 142 170 134 176 142`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
              <path
                d={`M 148 168 C 148 168 170 176 176 168`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
            </g>
          )}
        </g>

        {/* Lower Clamp Arm */}
        <g id="clamp-lower">
          {/* Bosshead on rod */}
          <rect x="58" y="286" width="22" height="18" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <circle cx="61" cy="295" r="3.5" fill="#94a3b8" />
          {/* Horizontal clamp rod extending towards cx=160 */}
          <rect x="79" y="293" width="70" height="4" fill="url(#retortMetalStand)" stroke="#334155" strokeWidth="0.8" />

          {/* Clamp Prongs (Lower) */}
          {isMounted ? (
            /* Jaws tightly gripping mounted burette */
            <g>
              <path
                d={`M 149 288 C 149 288 168 284 172 290 C 172 296 150 299 150 299`}
                fill="none"
                stroke="#dc2626"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d={`M 149 304 C 149 304 168 307 172 301 C 172 297 150 294 150 294`}
                fill="none"
                stroke="#dc2626"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          ) : (
            /* Jaws spread OPEN waiting for burette */
            <g
              className="cursor-pointer"
              onClick={onMountBurette}
            >
              <path
                d={`M 148 282 C 148 282 170 274 176 282`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
              <path
                d={`M 148 308 C 148 308 170 316 176 308`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
            </g>
          )}
        </g>

        {/* --- 4. BURETTE RENDERING: UNMOUNTED VS MOUNTED --- */}
        {!isMounted ? (
          /* =======================================================
             UNMOUNTED STATE:
             Burette is sitting on the lab bench beside the statif
             waiting for the user to mount it!
             ======================================================= */
          <g id="unmounted-burette-stage">
            {/* Ghost outline on the statif showing where to clamp */}
            <g
              className="cursor-pointer"
              onClick={onMountBurette}
            >
              <rect
                x={cx - 8}
                y="65"
                width="16"
                height="350"
                rx="2"
                fill="#38bdf8"
                fillOpacity="0.06"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              {/* Arrow and hint */}
              <text
                x={cx}
                y="225"
                textAnchor="middle"
                fill="#0284c7"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                Klem Statif Kosong
              </text>
              <text
                x={cx}
                y="238"
                textAnchor="middle"
                fill="#64748b"
                fontSize="7.5"
                fontFamily="sans-serif"
              >
                Pasang Buret di Sini ↓
              </text>
            </g>

            {/* Unmounted Burette resting safely on a laboratory stand/rest on the table */}
            <g
              id="unmounted-burette-item"
              className="cursor-pointer group"
              onClick={onMountBurette}
            >
              {/* Bench resting block for burette */}
              <rect
                x="220"
                y="430"
                width="85"
                height="150"
                rx="4"
                fill="#f8fafc"
                stroke="#94a3b8"
                strokeWidth="1.2"
                strokeDasharray="3 2"
                opacity="0.8"
              />
              <text
                x="262"
                y="450"
                textAnchor="middle"
                fill="#475569"
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                RAK BURET
              </text>

              {/* The clean glass burette standing in holder */}
              <ellipse cx="262" cy="72" rx="9" ry="3" fill="#bae6fd" fillOpacity="0.4" stroke="#7dd3fc" strokeWidth="1.2" />
              <rect
                x="254"
                y="74"
                width="16"
                height="285"
                rx="1"
                fill="url(#buretteGlassGradient)"
                stroke="#64748b"
                strokeWidth="1.2"
              />
              {/* Ticks on unmounted burette */}
              <line x1="266" y1="90" x2="274" y2="90" stroke="#94a3b8" strokeWidth="1.2" />
              <text x="277" y="93" fill="#64748b" fontSize="7" fontFamily="monospace">0</text>
              <line x1="266" y1="145" x2="274" y2="145" stroke="#94a3b8" strokeWidth="1.2" />
              <text x="277" y="148" fill="#64748b" fontSize="7" fontFamily="monospace">10</text>
              <line x1="266" y1="200" x2="274" y2="200" stroke="#94a3b8" strokeWidth="1.2" />
              <text x="277" y="203" fill="#64748b" fontSize="7" fontFamily="monospace">20</text>
              <line x1="266" y1="255" x2="274" y2="255" stroke="#94a3b8" strokeWidth="1.2" />
              <text x="277" y="258" fill="#64748b" fontSize="7" fontFamily="monospace">30</text>
              <line x1="266" y1="310" x2="274" y2="310" stroke="#94a3b8" strokeWidth="1.2" />
              <text x="277" y="313" fill="#64748b" fontSize="7" fontFamily="monospace">40</text>
              <line x1="266" y1="355" x2="274" y2="355" stroke="#94a3b8" strokeWidth="1.2" />
              <text x="277" y="358" fill="#64748b" fontSize="7" fontFamily="monospace">50</text>

              {/* Stopcock housing and valve */}
              <circle cx="262" cy="378" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
              <rect x="249" y="375" width="26" height="5.5" rx="2.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
              {/* Delivery tip */}
              <path d="M 260 386 L 260 412 L 261.5 420 L 262.5 420 L 264 412 L 264 386 Z" fill="url(#buretteGlassGradient)" stroke="#64748b" strokeWidth="1" />

              {/* Interactive badge & button over the unmounted burette */}
              <g className="animate-pulse">
                <rect
                  x="205"
                  y="470"
                  width="115"
                  height="44"
                  rx="4"
                  fill="#1D1D1B"
                  stroke="#C4A484"
                  strokeWidth="1.5"
                />
                <text
                  x="262.5"
                  y="488"
                  textAnchor="middle"
                  fill="#F9F7F2"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  letterSpacing="0.05em"
                >
                  PASANG BURET
                </text>
                <text
                  x="262.5"
                  y="502"
                  textAnchor="middle"
                  fill="#C4A484"
                  fontSize="7"
                  fontFamily="sans-serif"
                >
                  Klik untuk Memasang ➔
                </text>
              </g>
            </g>
          </g>
        ) : (
          /* =======================================================
             MOUNTED STATE:
             Burette is securely clamped inside the statif!
             ======================================================= */
          <g id="mounted-burette-stage">
            {/* --- POURING APPARATUS AT TOP RIM (DURING RINSING) --- */}
            {/* Wash Bottle at top rim during water rinse */}
            {rinseMode === 'water' && (
              <g id="wash-bottle-rinse-top" transform="translate(92, -8)">
                {/* Tilted Wash Bottle body */}
                <g transform="rotate(-28 35 48)">
                  <rect x="20" y="24" width="30" height="52" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
                  <rect x="21" y="44" width="28" height="30" rx="4" fill="#bae6fd" fillOpacity="0.8" />
                  <rect x="29" y="16" width="12" height="9" rx="1.5" fill="#0284c7" />
                  {/* Label */}
                  <rect x="23" y="50" width="24" height="12" rx="1" fill="#ffffff" stroke="#93c5fd" strokeWidth="0.6" />
                  <text x="35" y="58" fill="#0369a1" fontSize="4.5" fontWeight="bold" textAnchor="middle">AQUADES</text>
                  <text x="35" y="61.5" fill="#64748b" fontSize="3.2" textAnchor="middle">Air Suling</text>
                  {/* Delivery swan tube curving down to burette mouth */}
                  <path
                    d="M 35 16 L 35 4 C 35 -6 56 -6 60 6 L 68 34"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 35 16 L 35 4 C 35 -6 56 -6 60 6 L 68 34"
                    fill="none"
                    stroke="#e0f2fe"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </g>
                {/* Active Water Spray Jet into burette flared mouth */}
                {isRinsingActive && (
                  <g>
                    <path
                      d={`M 152 42 Q 157 52 ${cx} 66`}
                      fill="none"
                      stroke="url(#waterFlowGrad)"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                    />
                    {/* Splash drops around rim */}
                    <circle cx={cx - 3} cy="65" r="1.4" fill="#38bdf8">
                      <animate attributeName="cy" from="66" to="61" dur="0.22s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={cx + 3} cy="65" r="1.2" fill="#38bdf8">
                      <animate attributeName="cy" from="66" to="62" dur="0.26s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
              </g>
            )}

            {/* Beaker of NaOH at top rim during NaOH conditioning */}
            {rinseMode === 'naoh' && (
              <g id="naoh-rinse-top" transform="translate(95, -2)">
                <g transform="rotate(-32 40 45)">
                  <path
                    d="M 24 16 L 18 14 L 24 20 L 26 56 C 26 60 30 63 36 63 L 50 63 C 56 63 60 60 60 56 L 62 16 Z"
                    fill="#f8fafc"
                    fillOpacity="0.8"
                    stroke="#64748b"
                    strokeWidth="1.3"
                  />
                  {/* NaOH solution inside beaker */}
                  <path
                    d="M 26 28 L 19 16 L 56 38 L 58 56 C 58 59 55 62 50 62 L 36 62 C 31 62 27 59 27 56 Z"
                    fill="#7dd3fc"
                    fillOpacity="0.8"
                  />
                  <rect x="30" y="44" width="24" height="11" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                  <text x="42" y="52" fill="#0f172a" fontSize="4.2" fontWeight="bold" textAnchor="middle">NaOH 0.1M</text>
                </g>
                {/* Active pouring stream */}
                {isRinsingActive && (
                  <g>
                    <path
                      d={`M 152 44 Q 156 54 ${cx} 66`}
                      fill="none"
                      stroke="url(#naohFlowGrad)"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                    />
                    <circle cx={cx} cy="66" r="1.4" fill="#38bdf8">
                      <animate attributeName="cy" from="66" to="62" dur="0.24s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
              </g>
            )}

            {/* Flared top rim of burette */}
            <ellipse cx={cx} cy="66" rx="9" ry="3" fill="#38bdf8" fillOpacity="0.3" stroke="#e0f2fe" strokeWidth="1.2" />

            {/* Burette Glass Column Outer Body */}
            <rect
              x={cx - 8}
              y="68"
              width="16"
              height="288"
              rx="1"
              fill="url(#buretteGlassGradient)"
              stroke="#94a3b8"
              strokeWidth="1.2"
            />

            {/* Liquid Column inside Burette */}
            <g clipPath="url(#mountedBuretteInside)">
              {liquidHeight > 0 && !isRinsingActive && (
                <>
                  <rect
                    x={cx - 8}
                    y={liquidTopY}
                    width="16"
                    height={liquidHeight}
                    fill="url(#naohLiquidGrad)"
                  />
                  {/* Concave Meniscus at liquid surface */}
                  {clampedReading <= 49.8 && (
                    <path
                      d={`M ${cx - 8} ${liquidTopY} Q ${cx} ${liquidTopY + 3.2} ${cx + 8} ${liquidTopY} L ${cx + 8} ${liquidTopY + 1} Q ${cx} ${liquidTopY + 4.2} ${cx - 8} ${liquidTopY + 1} Z`}
                      fill="#38bdf8"
                      opacity="0.9"
                    />
                  )}
                </>
              )}

              {/* ACTIVE RINSING LIQUID CASCADING THROUGH BURETTE TUBE */}
              {isRinsingActive && (
                <g id="cascading-rinse-liquid">
                  {/* Full column cascading translucent sheet */}
                  <rect
                    x={cx - 7}
                    y="70"
                    width="14"
                    height="286"
                    fill={rinseMode === 'naoh' ? 'url(#naohFlowGrad)' : 'url(#waterFlowGrad)'}
                    fillOpacity="0.45"
                  />
                  {/* Left wall streaming ribbon */}
                  <path
                    d={`M ${cx - 6} 70 Q ${cx - 4} 140 ${cx - 6} 210 T ${cx - 5} 280 T ${cx - 6} 356`}
                    stroke="#ffffff"
                    strokeWidth="1.6"
                    strokeDasharray="14 10"
                    fill="none"
                    opacity="0.85"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="0.26s" repeatCount="indefinite" />
                  </path>
                  {/* Right wall streaming ribbon */}
                  <path
                    d={`M ${cx + 6} 70 Q ${cx + 4} 130 ${cx + 6} 200 T ${cx + 5} 270 T ${cx + 6} 356`}
                    stroke="#ffffff"
                    strokeWidth="1.6"
                    strokeDasharray="12 8"
                    fill="none"
                    opacity="0.85"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="0.22s" repeatCount="indefinite" />
                  </path>
                  {/* Downward traveling water turbulence bubbles */}
                  <circle cx={cx - 2} cy="110" r="1.4" fill="#ffffff" opacity="0.9">
                    <animate attributeName="cy" from="70" to="356" dur="0.32s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={cx + 2} cy="180" r="1.2" fill="#ffffff" opacity="0.9">
                    <animate attributeName="cy" from="90" to="356" dur="0.36s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={cx} cy="240" r="1.3" fill="#ffffff" opacity="0.9">
                    <animate attributeName="cy" from="70" to="356" dur="0.29s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </g>

            {/* Graduation lines and numbers */}
            <g>{ticks}</g>

            {/* Glass reflection highlight line */}
            <line
              x1={cx - 5.5}
              y1="70"
              x2={cx - 5.5}
              y2="350"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />

            {/* Taper to stopcock */}
            <path
              d={`M ${cx - 8} 356 L ${cx - 2} 374 L ${cx + 2} 374 L ${cx + 8} 356 Z`}
              fill="url(#buretteGlassGradient)"
              stroke="#94a3b8"
              strokeWidth="1"
            />

            {/* Stopcock Housing Barrel */}
            <circle cx={cx} cy="382" r="9" fill="#0f172a" stroke="#64748b" strokeWidth="1.4" />
            <circle cx={cx} cy="382" r="6.5" fill="#334155" />

            {/* Rotatable PTFE Stopcock Key Handle */}
            <g
              transform={`rotate(${getStopcockAngle()} ${cx} 382)`}
              className={interactiveStopcock ? 'cursor-pointer' : ''}
              onClick={() => {
                if (!interactiveStopcock || !onStopcockChange) return;
                const cycle: StopcockRate[] = ['closed', 'dropwise', 'slow', 'fast'];
                const nextIdx = (cycle.indexOf(stopcockState) + 1) % cycle.length;
                onStopcockChange(cycle[nextIdx]);
              }}
            >
              <rect
                x={cx - 16}
                y="379"
                width="32"
                height="6"
                rx="3"
                fill="#ef4444"
                stroke="#991b1b"
                strokeWidth="1"
              />
              <circle cx={cx - 15} cy="382" r="3.8" fill="#b91c1c" />
              <circle cx={cx + 15} cy="382" r="3.8" fill="#b91c1c" />
              <circle cx={cx} cy="382" r="3.2" fill="#fef2f2" />
            </g>

            {/* Delivery capillary tip below stopcock */}
            <path
              d={`M ${cx - 2} 391 L ${cx - 2} 412 L ${cx - 0.9} 422 L ${cx + 0.9} 422 L ${cx + 2} 412 L ${cx + 2} 391 Z`}
              fill="url(#buretteGlassGradient)"
              stroke="#94a3b8"
              strokeWidth="1"
            />

            {/* Tip Liquid */}
            {(clampedReading < 50 || isRinsingActive || isFlushingBubble) && (
              <path
                d={`M ${cx - 1} 391 L ${cx - 1} 412 L ${cx} 421 L ${cx + 1} 412 L ${cx + 1} 391 Z`}
                fill="#7dd3fc"
                fillOpacity="0.85"
              />
            )}

            {/* AIR BUBBLE IN TIP (HIGH VISIBILITY) */}
            {hasAirBubble && (
              <g id="tip-air-bubble-group" className={isFlushingBubble ? 'transition-all duration-300' : ''}>
                {/* Pulsing attention halo so student immediately notices */}
                <ellipse
                  cx={cx}
                  cy="406"
                  rx="3.6"
                  ry="5.2"
                  fill="#fef08a"
                  fillOpacity="0.4"
                  stroke="#f59e0b"
                  strokeWidth="0.8"
                  strokeDasharray="2 1"
                  className="animate-pulse"
                />
                {/* Meniscus upper boundary */}
                <path
                  d={`M ${cx - 1.8} 402 Q ${cx} 404 ${cx + 1.8} 402`}
                  stroke="#0284c7"
                  strokeWidth="0.7"
                  fill="none"
                />
                {/* Main trapped air body */}
                <ellipse
                  cx={cx}
                  cy={isFlushingBubble ? 420 : 406}
                  rx="2.2"
                  ry="3.4"
                  fill="#ffffff"
                  fillOpacity="0.96"
                  stroke="#0284c7"
                  strokeWidth="0.8"
                />
                {/* Glass reflection glint */}
                <circle cx={cx - 0.7} cy={isFlushingBubble ? 418 : 404} r="0.6" fill="#ffffff" />
                {/* Meniscus lower boundary */}
                <path
                  d={`M ${cx - 1.8} 409.5 Q ${cx} 408 ${cx + 1.8} 409.5`}
                  stroke="#0284c7"
                  strokeWidth="0.7"
                  fill="none"
                />
              </g>
            )}

            {/* STREAMING JET FROM TIP INTO WASTE BEAKER (DURING ACTIVE RINSING) */}
            {isRinsingActive && (
              <g id="rinsing-tip-stream">
                {/* Continuous liquid stream down to waste beaker (Y=422 to Y=530) */}
                <path
                  d={`M ${cx - 1.2} 422 L ${cx - 1.2} 530 L ${cx + 1.2} 530 L ${cx + 1.2} 422 Z`}
                  fill={rinseMode === 'naoh' ? '#7dd3fc' : '#38bdf8'}
                  opacity="0.9"
                />
                <line
                  x1={cx}
                  y1="422"
                  x2={cx}
                  y2="530"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeDasharray="10 6"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="0.18s" repeatCount="indefinite" />
                </line>
                {/* Splashing droplets inside waste beaker */}
                <circle cx={cx - 4} cy="527" r="1.3" fill="#38bdf8">
                  <animate attributeName="cy" from="530" to="522" dur="0.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.9" to="0" dur="0.2s" repeatCount="indefinite" />
                </circle>
                <circle cx={cx + 5} cy="527" r="1.2" fill="#38bdf8">
                  <animate attributeName="cy" from="530" to="523" dur="0.22s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.9" to="0" dur="0.22s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* HIGH VELOCITY JET FLUSH TO EXPEL BUBBLE */}
            {isFlushingBubble && (
              <g id="bubble-flush-jet">
                {/* Fast rushing liquid stream */}
                <path
                  d={`M ${cx - 1.6} 422 L ${cx - 2} 530 L ${cx + 2} 530 L ${cx + 1.6} 422 Z`}
                  fill="#38bdf8"
                  opacity="0.95"
                />
                <line
                  x1={cx}
                  y1="422"
                  x2={cx}
                  y2="530"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="8 4"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.12s" repeatCount="indefinite" />
                </line>
                {/* Animated expelled bubble shooting downward and popping */}
                <circle cx={cx} cy="480" r="2.8" fill="#ffffff" stroke="#0284c7" strokeWidth="0.8">
                  <animate attributeName="cy" from="424" to="530" dur="0.4s" repeatCount="indefinite" />
                  <animate attributeName="r" from="2.8" to="4.5" dur="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="1" to="0" dur="0.4s" repeatCount="indefinite" />
                </circle>
                {/* Tapping vibration text */}
                <text x={cx - 14} y="408" fill="#d97706" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
                  *Tuk!*
                </text>
              </g>
            )}

            {/* MAGNIFIED BUBBLE INSPECTION LOUPE (ZOOM 5X) */}
            {(hasAirBubble || isFlushingBubble || showBubbleInspector) && (
              <g id="magnified-bubble-inspector">
                {/* Dotted pointer leader from real tip to loupe */}
                <line
                  x1={cx + 3}
                  y1="406"
                  x2="218"
                  y2="400"
                  stroke="#0284c7"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <circle cx={cx + 3} cy="406" r="2.2" fill="#0284c7" />

                {/* Loupe Outer Shadow and Bezel */}
                <circle cx="260" cy="400" r="42" fill="#0f172a" opacity="0.12" />
                <circle cx="258" cy="398" r="40" fill="#334155" stroke="#1e293b" strokeWidth="2" />
                <circle cx="258" cy="398" r="37" fill="url(#loupeGlassGrad)" />

                {/* Glass reflection highlight arc */}
                <path
                  d="M 232 382 A 30 30 0 0 1 284 382"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                  strokeLinecap="round"
                />

                {/* Header text */}
                <rect x="222" y="348" width="72" height="14" rx="2" fill="#1D1D1B" />
                <text x="258" y="357.5" fill="#f8fafc" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  INSPEKSI TIP (ZOOM 5X)
                </text>

                {/* Magnified Capillary Glass Channel */}
                <rect x="249" y="364" width="18" height="66" rx="1.5" fill="#e0f2fe" stroke="#64748b" strokeWidth="1.4" />

                {/* Magnified Solution Column */}
                <rect x="250.5" y="365" width="15" height="64" fill="#7dd3fc" fillOpacity="0.8" />

                {/* Trapped Air Bubble inside Magnified Capillary */}
                {hasAirBubble && !isFlushingBubble && (
                  <g id="loupe-trapped-bubble">
                    <ellipse cx="258" cy="398" rx="6.5" ry="11" fill="#ffffff" fillOpacity="0.96" stroke="#0284c7" strokeWidth="1.5" />
                    <path d="M 252 389 Q 258 393 264 389" stroke="#0369a1" strokeWidth="1.2" fill="none" />
                    <path d="M 252 407 Q 258 403 264 407" stroke="#0369a1" strokeWidth="1.2" fill="none" />
                    <circle cx="255" cy="394" r="1.8" fill="#ffffff" />

                    {/* Alert Label Badge */}
                    <rect x="226" y="420" width="64" height="12" rx="2" fill="#fee2e2" stroke="#ef4444" strokeWidth="0.8" />
                    <text x="258" y="428.5" fill="#b91c1c" fontSize="5.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      ⚠ GELEMBUNG UDARA
                    </text>
                  </g>
                )}

                {/* Flushing State inside Loupe */}
                {isFlushingBubble && (
                  <g id="loupe-flushing-bubble">
                    <line x1="258" y1="365" x2="258" y2="430" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 3">
                      <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.12s" repeatCount="indefinite" />
                    </line>
                    <ellipse cx="258" cy="418" rx="4.5" ry="7" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2">
                      <animate attributeName="cy" from="380" to="430" dur="0.3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="1" to="0.2" dur="0.3s" repeatCount="indefinite" />
                    </ellipse>
                    <rect x="226" y="420" width="64" height="12" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
                    <text x="258" y="428.5" fill="#b45309" fontSize="5.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      MENGELUARKAN...
                    </text>
                  </g>
                )}

                {/* Clear State after Flushed */}
                {!hasAirBubble && !isFlushingBubble && (
                  <g id="loupe-clear-tip">
                    <rect x="226" y="420" width="64" height="12" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" />
                    <text x="258" y="428.5" fill="#15803d" fontSize="5.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      ✓ BEBAS GELEMBUNG
                    </text>
                  </g>
                )}

                {/* Interactive Flush Button inside Loupe */}
                {hasAirBubble && !isFlushingBubble && onFlushBubble && (
                  <g className="cursor-pointer" onClick={onFlushBubble}>
                    <rect x="222" y="438" width="72" height="15" rx="2.5" fill="#1D1D1B" stroke="#333330" strokeWidth="0.8" />
                    <text x="258" y="448" fill="#f8fafc" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      Keluarkan Gelembung ➔
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* Falling Droplets Animation directly from tip into flask */}
            {isDropping && (
              <g>
                {/* Hanging droplet at tip */}
                <path
                  d={`M ${cx - 0.8} 422 C ${cx - 1.5} 424 ${cx - 2.5} 426 ${cx} 429 C ${cx + 2.5} 426 ${cx + 1.5} 424 ${cx + 0.8} 422 Z`}
                  fill="#38bdf8"
                  opacity="0.85"
                />
                {/* Falling drop traveling into Erlenmeyer mouth */}
                <circle cx={cx} cy="445" r="2.2" fill="#38bdf8" opacity="0.9">
                  <animate
                    attributeName="cy"
                    from="424"
                    to={flaskProps?.isPlaced ? String(flaskLiquidTopY) : "575"}
                    dur={stopcockState === 'fast' ? '0.2s' : stopcockState === 'slow' ? '0.42s' : '0.8s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="1"
                    to="0.2"
                    dur={stopcockState === 'fast' ? '0.2s' : stopcockState === 'slow' ? '0.42s' : '0.8s'}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}
          </g>
        )}

        {/* --- 5. ERLENMEYER FLASK (TERLETAK TEPAT DI BAWAH BURET) --- */}
        {flaskProps && (
          <g id="erlenmeyer-flask-under-burette">
            {flaskProps.isPlaced ? (
              /* FLASK IS PLACED ON THE TILE DIRECTLY UNDER BURETTE */
              <g
                className={`transition-transform duration-300 origin-bottom ${
                  flaskProps.isSwirling ? 'animate-swirl' : ''
                }`}
                style={{ transformOrigin: `${cx}px 578px` }}
              >
                {/* Flask Base Contact Shadow */}
                <ellipse cx={cx} cy="578" rx="55" ry="5" fill="#020617" opacity="0.35" />

                {/* Solution Layer Inside Flask */}
                <g clipPath="url(#erlenmeyerInteriorClip)">
                  {/* Baseline clear acid solution */}
                  <rect
                    x={cx - 70}
                    y={flaskLiquidTopY}
                    width="140"
                    height={flaskLiquidHeight + 10}
                    fill="#e0f2fe"
                    fillOpacity="0.65"
                  />

                  {/* Phenolphthalein Color Tint (Clear -> Light Pink -> Fuchsia) */}
                  {flaskProps.indicatorAlpha > 0 && (
                    <rect
                      x={cx - 70}
                      y={flaskLiquidTopY}
                      width="140"
                      height={flaskLiquidHeight + 10}
                      fill={flaskProps.indicatorColorHex}
                      fillOpacity={flaskProps.indicatorAlpha}
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Localized Temporary Pink Cloud before Endpoint */}
                  {(flaskProps.pinkCloudIntensity ?? 0) > 0 && (
                    <ellipse
                      cx={cx}
                      cy={flaskLiquidTopY + 10}
                      rx={16 + (1 - (flaskProps.pinkCloudIntensity ?? 0)) * 18}
                      ry={7 + (1 - (flaskProps.pinkCloudIntensity ?? 0)) * 6}
                      fill="#f43f5e"
                      opacity={(flaskProps.pinkCloudIntensity ?? 0) * 0.75}
                      className="transition-opacity duration-200"
                    />
                  )}

                  {/* Liquid Meniscus at Flask Surface */}
                  <ellipse
                    cx={cx}
                    cy={flaskLiquidTopY}
                    rx={halfWidthAtSurface}
                    ry={halfWidthAtSurface * 0.14}
                    fill={flaskProps.indicatorAlpha > 0.3 ? flaskProps.indicatorColorHex : '#bae6fd'}
                    fillOpacity={flaskProps.indicatorAlpha > 0 ? Math.min(0.9, flaskProps.indicatorAlpha + 0.3) : 0.75}
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    strokeOpacity="0.8"
                  />

                  {/* Drop ripple when droplet lands */}
                  {flaskProps.hasDropRipple && (
                    <ellipse
                      cx={cx}
                      cy={flaskLiquidTopY}
                      rx={halfWidthAtSurface * 0.4}
                      ry={halfWidthAtSurface * 0.08}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      opacity="0.8"
                    >
                      <animate attributeName="rx" from="2" to={String(halfWidthAtSurface * 0.85)} dur="0.5s" repeatCount="1" />
                      <animate attributeName="opacity" from="0.9" to="0" dur="0.5s" repeatCount="1" />
                    </ellipse>
                  )}
                </g>

                {/* Flask Glass Wall Outline */}
                <path
                  d={`
                    M ${cx - 15} 434
                    L ${cx - 14} 475
                    L ${cx - 52} 572
                    C ${cx - 52} 577 ${cx - 46} 578 ${cx - 36} 578
                    L ${cx + 36} 578
                    C ${cx + 46} 578 ${cx + 52} 577 ${cx + 52} 572
                    L ${cx + 14} 475
                    L ${cx + 15} 434
                    Z
                  `}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Flared Mouth / Rim Lip (Positioned directly under burette tip) */}
                <ellipse cx={cx} cy="434" rx="16" ry="4" fill="#f8fafc" fillOpacity="0.3" stroke="#cbd5e1" strokeWidth="1.6" />
                <ellipse cx={cx} cy="434" rx="12" ry="2.8" fill="none" stroke="#64748b" strokeWidth="0.8" />

                {/* Volume graduation lines on flask (50, 100, 150 mL) */}
                <g opacity="0.6">
                  <line x1={cx - 24} y1="550" x2={cx - 10} y2="550" stroke="#cbd5e1" strokeWidth="1.2" />
                  <text x={cx - 6} y="552.5" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">50</text>
                  <line x1={cx - 20} y1="528" x2={cx - 8} y2="528" stroke="#cbd5e1" strokeWidth="1.2" />
                  <text x={cx - 4} y="530.5" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">100</text>
                  <line x1={cx - 16} y1="504" x2={cx - 6} y2="504" stroke="#cbd5e1" strokeWidth="1.2" />
                  <text x={cx - 2} y="506.5" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">150</text>
                </g>

                {/* Glass reflection curves */}
                <path
                  d={`M ${cx - 12} 438 L ${cx - 11} 474 L ${cx - 44} 565`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                  strokeOpacity="0.45"
                  strokeLinecap="round"
                />

                {/* Brand label */}
                <text x={cx} y="492" fill="#94a3b8" fontSize="5.5" textAnchor="middle" fontFamily="sans-serif" opacity="0.7">
                  BORO 3.3 250mL
                </text>

                {/* Optional submerged pH meter probe */}
                {flaskProps.showPhMeter && (
                  <g id="submerged-ph-probe">
                    <rect x={cx + 6} y="440" width="5" height="95" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
                    <circle cx={cx + 8.5} cy="535" r="3.5" fill="#38bdf8" opacity="0.8" />
                  </g>
                )}
              </g>
            ) : (
              /* FLASK IS NOT YET ON THE TILE:
                 Show clear placement placeholder directly under the burette */
              <g
                id="tile-placement-placeholder"
                className={flaskProps.isPlaceActive ? 'cursor-pointer animate-pulse' : ''}
                onClick={flaskProps.onPlaceFlask}
              >
                {/* Dashed outline of Erlenmeyer base on tile */}
                <ellipse
                  cx={cx}
                  cy="578"
                  rx="45"
                  ry="8"
                  fill="#ffffff"
                  fillOpacity="0.7"
                  stroke={flaskProps.isPlaceActive ? '#C4A484' : '#cbd5e1'}
                  strokeWidth={flaskProps.isPlaceActive ? '2' : '1.2'}
                  strokeDasharray="4 3"
                />
                {/* Upright conical dashed silhouette */}
                <path
                  d={`
                    M ${cx - 14} 440
                    L ${cx - 13} 475
                    L ${cx - 45} 572
                    C ${cx - 45} 576 ${cx - 38} 578 ${cx - 30} 578
                    L ${cx + 30} 578
                    C ${cx + 38} 578 ${cx + 45} 576 ${cx + 45} 572
                    L ${cx + 13} 475
                    L ${cx + 14} 440
                    Z
                  `}
                  fill="none"
                  stroke={flaskProps.isPlaceActive ? '#C4A484' : '#cbd5e1'}
                  strokeWidth="1.2"
                  strokeDasharray="5 3"
                  opacity={flaskProps.isPlaceActive ? '1' : '0.5'}
                />
                {/* Guide Text */}
                <text
                  x={cx}
                  y="520"
                  textAnchor="middle"
                  fill={flaskProps.isPlaceActive ? '#1D1D1B' : '#94a3b8'}
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {flaskProps.isPlaceActive ? 'Klik untuk Meletakkan Erlenmeyer' : 'Posisi Labu Erlenmeyer'}
                </text>
                <text
                  x={cx}
                  y="533"
                  textAnchor="middle"
                  fill={flaskProps.isPlaceActive ? '#C4A484' : '#94a3b8'}
                  fontSize="6.5"
                  fontFamily="sans-serif"
                >
                  {flaskProps.isPlaceActive ? 'Tepat di Bawah Ujung Buret ↓' : '(Di Atas Alas Putih)'}
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
