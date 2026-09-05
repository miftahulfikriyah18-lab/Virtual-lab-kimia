import React, { useState } from 'react';

interface TitrationCurveProps {
  points: Array<{ volume: number; pH: number }>;
  currentVolume: number;
  currentPh: number;
  isEquivalenceRevealed?: boolean;
  equivalenceVolume?: number;
  maxVolume?: number; // default 35 or 40
  compact?: boolean;
}

export const TitrationCurve: React.FC<TitrationCurveProps> = ({
  points,
  currentVolume,
  currentPh,
  isEquivalenceRevealed = false,
  equivalenceVolume = 25.0,
  maxVolume = 35.0,
  compact = false
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ volume: number; pH: number; x: number; y: number } | null>(null);

  // SVG Dimension setups
  const width = compact ? 280 : 540;
  const height = compact ? 180 : 340;
  const margin = compact
    ? { top: 15, right: 15, bottom: 28, left: 32 }
    : { top: 25, right: 30, bottom: 45, left: 52 };

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Coordinate transforms
  const scaleX = (vol: number) => {
    return margin.left + Math.min(plotWidth, Math.max(0, (vol / maxVolume) * plotWidth));
  };

  const scaleY = (ph: number) => {
    return margin.top + plotHeight - Math.min(plotHeight, Math.max(0, (ph / 14) * plotHeight));
  };

  // Phenolphthalein transition band coordinates (pH 8.2 to 10.0)
  const ppTopY = scaleY(10.0);
  const ppBottomY = scaleY(8.2);
  const ppBandHeight = ppBottomY - ppTopY;

  // Build SVG Path from recorded points
  const sortedPoints = [...points].sort((a, b) => a.volume - b.volume);
  let pathD = '';
  if (sortedPoints.length > 0) {
    pathD = sortedPoints.reduce((acc, pt, idx) => {
      const x = scaleX(pt.volume);
      const y = scaleY(pt.pH);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }

  // Grid Ticks
  const yTicks = compact ? [0, 7, 14] : [0, 2, 4, 6, 7, 8, 10, 12, 14];
  const xTicks = compact ? [0, 10, 20, 30] : [0, 5, 10, 15, 20, 25, 30, 35];

  return (
    <div className="relative flex flex-col items-center bg-white border border-[#1D1D1B]/20 p-2.5 shadow-sm select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <defs>
          <pattern id="gridLines" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E0D8" strokeWidth="0.8" strokeDasharray="2,2" />
          </pattern>
        </defs>

        {/* Plot Background */}
        <rect
          x={margin.left}
          y={margin.top}
          width={plotWidth}
          height={plotHeight}
          fill="#FAF8F5"
          stroke="#1D1D1B"
          strokeWidth="0.8"
        />

        {/* Grid Background Pattern */}
        <rect
          x={margin.left}
          y={margin.top}
          width={plotWidth}
          height={plotHeight}
          fill="url(#gridLines)"
          opacity="0.8"
        />

        {/* Phenolphthalein Transition Zone Band (pH 8.2 - 10.0) */}
        <rect
          x={margin.left}
          y={ppTopY}
          width={plotWidth}
          height={ppBandHeight}
          fill="#C4A484"
          fillOpacity={compact ? 0.2 : 0.25}
        />
        {!compact && (
          <text
            x={margin.left + 8}
            y={ppTopY + 12}
            fill="#1D1D1B"
            fontSize="8.5"
            fontWeight="bold"
            letterSpacing="0.3"
            fontFamily="serif"
          >
            Daerah Transisi PP (pH 8.2 – 10.0)
          </text>
        )}

        {/* Neutral Line pH 7.0 */}
        <line
          x1={margin.left}
          y1={scaleY(7)}
          x2={margin.left + plotWidth}
          y2={scaleY(7)}
          stroke="#1D1D1B"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
        {!compact && (
          <text
            x={margin.left + plotWidth - 6}
            y={scaleY(7) - 4}
            fill="#1D1D1B"
            fillOpacity="0.6"
            fontSize="8"
            textAnchor="end"
            fontFamily="serif"
          >
            Netral (pH 7.00)
          </text>
        )}

        {/* Revealed Theoretical Equivalence Point Marker & Line */}
        {isEquivalenceRevealed && equivalenceVolume > 0 && (
          <g>
            {/* Vertical Equivalence Line */}
            <line
              x1={scaleX(equivalenceVolume)}
              y1={margin.top}
              x2={scaleX(equivalenceVolume)}
              y2={margin.top + plotHeight}
              stroke="#1D1D1B"
              strokeWidth="1.2"
              strokeDasharray="3,3"
            />
            {/* Equivalence Point Target Dot */}
            <circle
              cx={scaleX(equivalenceVolume)}
              cy={scaleY(7.0)}
              r="4.5"
              fill="#1D1D1B"
              stroke="#C4A484"
              strokeWidth="1.5"
            />
            {!compact && (
              <g>
                <rect
                  x={scaleX(equivalenceVolume) - 46}
                  y={scaleY(7.0) - 24}
                  width="92"
                  height="18"
                  fill="#1D1D1B"
                  stroke="#1D1D1B"
                  strokeWidth="1"
                />
                <text
                  x={scaleX(equivalenceVolume)}
                  y={scaleY(7.0) - 12}
                  fill="#F9F7F2"
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="serif"
                >
                  Titik Ekuivalen ({equivalenceVolume.toFixed(2)} mL)
                </text>
              </g>
            )}
          </g>
        )}

        {/* Y-Axis (pH) Grid lines and labels */}
        {yTicks.map((ph) => {
          const y = scaleY(ph);
          return (
            <g key={`y-${ph}`}>
              <line
                x1={margin.left - 4}
                y1={y}
                x2={margin.left}
                y2={y}
                stroke="#1D1D1B"
                strokeWidth="1"
              />
              <text
                x={margin.left - 7}
                y={y + 3.5}
                fill="#1D1D1B"
                fontSize={compact ? '7.5' : '9'}
                textAnchor="end"
                fontFamily="monospace"
              >
                {ph}
              </text>
            </g>
          );
        })}

        {/* X-Axis (Volume) Grid lines and labels */}
        {xTicks.map((vol) => {
          const x = scaleX(vol);
          return (
            <g key={`x-${vol}`}>
              <line
                x1={x}
                y1={margin.top + plotHeight}
                x2={x}
                y2={margin.top + plotHeight + 4}
                stroke="#1D1D1B"
                strokeWidth="1"
              />
              <text
                x={x}
                y={margin.top + plotHeight + (compact ? 12 : 16)}
                fill="#1D1D1B"
                fontSize={compact ? '7.5' : '9'}
                textAnchor="middle"
                fontFamily="monospace"
              >
                {vol}
              </text>
            </g>
          );
        })}

        {/* Axis Titles */}
        {!compact && (
          <>
            <text
              x={margin.left + plotWidth / 2}
              y={height - 6}
              fill="#1D1D1B"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="serif"
            >
              Volume NaOH Ditambahkan (mL)
            </text>
            <text
              transform={`rotate(-90 ${16} ${margin.top + plotHeight / 2})`}
              x={16}
              y={margin.top + plotHeight / 2}
              fill="#1D1D1B"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="serif"
            >
              pH Larutan
            </text>
          </>
        )}

        {/* Titration Live Curve Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#1D1D1B"
            strokeWidth={compact ? '2' : '2.5'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Active Current Head Point */}
        {currentVolume > 0 && (
          <g>
            <circle
              cx={scaleX(currentVolume)}
              cy={scaleY(currentPh)}
              r={compact ? '4' : '5'}
              fill="#C4A484"
              stroke="#1D1D1B"
              strokeWidth="1.5"
            >
              <animate
                attributeName="r"
                values="4;6;4"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* Invisible mouse hover overlay */}
        <rect
          x={margin.left}
          y={margin.top}
          width={plotWidth}
          height={plotHeight}
          fill="transparent"
          className="cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const svgX = (mouseX / rect.width) * width;
            const plotX = svgX - margin.left;
            if (plotX >= 0 && plotX <= plotWidth) {
              const estVol = (plotX / plotWidth) * maxVolume;
              // Find nearest point
              if (sortedPoints.length > 0) {
                let closest = sortedPoints[0];
                let minDiff = Math.abs(closest.volume - estVol);
                for (const p of sortedPoints) {
                  const diff = Math.abs(p.volume - estVol);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closest = p;
                  }
                }
                setHoveredPoint({
                  volume: closest.volume,
                  pH: closest.pH,
                  x: scaleX(closest.volume),
                  y: scaleY(closest.pH)
                });
              }
            }
          }}
        />

        {/* Hover Crosshair tooltip */}
        {hoveredPoint && (
          <g>
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r="4"
              fill="#C4A484"
              stroke="#1D1D1B"
              strokeWidth="1.2"
            />
            <rect
              x={Math.min(width - 95, Math.max(5, hoveredPoint.x - 45))}
              y={Math.max(5, hoveredPoint.y - 30)}
              width="90"
              height="24"
              fill="#1D1D1B"
              stroke="#1D1D1B"
              strokeWidth="0.8"
              opacity="0.95"
            />
            <text
              x={Math.min(width - 95, Math.max(5, hoveredPoint.x - 45)) + 45}
              y={Math.max(5, hoveredPoint.y - 30) + 16}
              fill="#F9F7F2"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {hoveredPoint.volume.toFixed(2)} mL | pH {hoveredPoint.pH.toFixed(2)}
            </text>
          </g>
        )}
      </svg>

      {compact && (
        <div className="w-full flex items-center justify-between text-[10px] text-[#1D1D1B]/70 mt-1 px-1 font-mono">
          <span>V: <strong className="text-[#1D1D1B]">{currentVolume.toFixed(2)} mL</strong></span>
          <span>pH: <strong className="text-[#1D1D1B]">{currentPh.toFixed(2)}</strong></span>
        </div>
      )}
    </div>
  );
};
