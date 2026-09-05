import React from 'react';

interface DigitalPhMeterSvgProps {
  pH: number;
  visible: boolean;
  onToggleVisible?: () => void;
}

export const DigitalPhMeterSvg: React.FC<DigitalPhMeterSvgProps> = ({
  pH,
  visible,
  onToggleVisible
}) => {
  if (!visible) return null;

  return (
    <div className="relative flex items-center select-none">
      <svg
        viewBox="0 0 170 140"
        className="w-44 h-auto drop-shadow-xl"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="meterBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="probeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Meter Casing */}
        <rect
          x="10"
          y="15"
          width="110"
          height="80"
          rx="10"
          fill="url(#meterBodyGrad)"
          stroke="#475569"
          strokeWidth="2"
        />
        {/* Beveled edge */}
        <rect x="14" y="19" width="102" height="72" rx="7" fill="none" stroke="#334155" strokeWidth="1" />

        {/* Brand label */}
        <text x="22" y="32" fill="#94a3b8" fontSize="6" fontWeight="bold" letterSpacing="0.5">
          HANNA pH-200
        </text>
        <circle cx="108" cy="30" r="2.5" fill="#22c55e" />

        {/* LCD Display Window */}
        <rect
          x="20"
          y="38"
          width="90"
          height="42"
          rx="5"
          fill="#064e3b"
          stroke="#047857"
          strokeWidth="1.5"
        />
        <rect x="22" y="40" width="86" height="38" rx="3" fill="#022c22" opacity="0.6" />

        {/* LCD Units indicator */}
        <text x="26" y="52" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">
          pH
        </text>
        <text x="86" y="52" fill="#34d399" fontSize="6.5" fontFamily="monospace">
          25.0°C
        </text>

        {/* LCD Main Numerical Value */}
        <text
          x="94"
          y="72"
          fill="#4ade80"
          fontSize="18"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="end"
          letterSpacing="0.5"
          filter="drop-shadow(0 0 3px rgba(74, 222, 128, 0.6))"
        >
          {pH.toFixed(2)}
        </text>

        {/* Cable exiting right towards probe */}
        <path
          d="M 120 55 C 135 55 140 70 148 95"
          fill="none"
          stroke="#1e293b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 120 55 C 135 55 140 70 148 95"
          fill="none"
          stroke="#475569"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Electrode Probe Body */}
        <g transform="translate(144, 90)">
          {/* Probe shaft */}
          <rect x="-3" y="0" width="8" height="42" rx="2" fill="url(#probeGrad)" stroke="#0f172a" strokeWidth="1" />
          {/* Glass bulb tip */}
          <ellipse cx="1" cy="45" rx="4.5" ry="5.5" fill="#38bdf8" fillOpacity="0.75" stroke="#bae6fd" strokeWidth="1" />
          <ellipse cx="2" cy="44" rx="2" ry="2" fill="#ffffff" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
};
