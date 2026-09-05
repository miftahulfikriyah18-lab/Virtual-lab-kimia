import React from 'react';
import { ExperimentRegistryItem } from '../../platform/types';

export const ExperimentThumbnail: React.FC<{
  type: ExperimentRegistryItem['thumbnailType'];
  className?: string;
}> = ({ type, className = 'w-12 h-12' }) => {
  switch (type) {
    case 'titration':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Burette stand */}
          <line x1="20" y1="56" x2="44" y2="56" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="26" y1="56" x2="26" y2="8" strokeWidth="2" />
          <line x1="26" y1="20" x2="34" y2="20" strokeWidth="2" />
          <circle cx="34" cy="20" r="2" fill="currentColor" />
          {/* Burette tube */}
          <rect x="33" y="10" width="4" height="26" rx="1" strokeWidth="1.5" />
          <line x1="33" y1="36" x2="35" y2="44" strokeWidth="1.5" />
          {/* Erlenmeyer flask under burette */}
          <path d="M 32 46 L 38 46 L 43 56 L 27 56 Z" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 29 53 L 41 53" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'calorimetry':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Insulated cup */}
          <path d="M 20 22 L 23 54 C 23 56 26 58 32 58 C 38 58 41 56 41 54 L 44 22 Z" strokeWidth="2" strokeLinejoin="round" />
          <rect x="18" y="18" width="28" height="5" rx="1" strokeWidth="1.5" />
          {/* Thermometer */}
          <line x1="28" y1="8" x2="28" y2="38" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="40" r="3" fill="#ef4444" strokeWidth="1" />
          {/* Stirrer */}
          <path d="M 36 10 L 36 46 L 38 48" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'reaction_rate':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Reaction Flask */}
          <path d="M 16 48 L 22 26 L 22 18 L 28 18 L 28 26 L 34 48 C 35 52 32 54 25 54 C 18 54 15 52 16 48 Z" strokeWidth="1.8" />
          {/* Stopwatch */}
          <circle cx="44" cy="30" r="12" strokeWidth="2" />
          <path d="M 44 18 L 44 15" strokeWidth="2" strokeLinecap="round" />
          <path d="M 44 30 L 44 24" strokeWidth="2" strokeLinecap="round" />
          <path d="M 44 30 L 49 33" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'equilibrium':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Two way reversible arrows */}
          <path d="M 16 22 L 48 22 M 42 16 L 48 22 L 42 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 48 38 L 16 38 M 22 32 L 16 38 L 22 44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Balance Scale base */}
          <path d="M 24 54 L 40 54 M 32 54 L 32 46" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'ph_acid_base':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Beaker with liquid */}
          <path d="M 18 20 L 14 18 L 18 24 L 20 54 C 20 56 22 58 28 58 L 42 58 C 48 58 50 56 50 54 L 52 20 Z" strokeWidth="1.8" />
          {/* pH Indicator test strips dipping */}
          <rect x="26" y="12" width="4" height="34" rx="1" fill="#3b82f6" fillOpacity="0.4" strokeWidth="1.5" />
          <rect x="34" y="10" width="4" height="36" rx="1" fill="#ef4444" fillOpacity="0.4" strokeWidth="1.5" />
          <text x="35" y="52" fontSize="7" fontWeight="bold" fill="currentColor" fontFamily="sans-serif">pH</text>
        </svg>
      );

    case 'voltaic_cell':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Left beaker */}
          <rect x="10" y="28" width="18" height="26" rx="2" strokeWidth="1.6" />
          {/* Right beaker */}
          <rect x="36" y="28" width="18" height="26" rx="2" strokeWidth="1.6" />
          {/* Electrodes */}
          <rect x="15" y="20" width="4" height="24" fill="#cbd5e1" strokeWidth="1.2" />
          <rect x="45" y="20" width="4" height="24" fill="#f59e0b" strokeWidth="1.2" />
          {/* Inverted U-tube salt bridge */}
          <path d="M 23 38 L 23 24 C 23 18 41 18 41 24 L 41 38" strokeWidth="2" strokeLinecap="round" />
          {/* Voltmeter circuit */}
          <path d="M 17 20 L 17 12 L 28 12 M 36 12 L 47 12 L 47 20" strokeWidth="1.5" />
          <circle cx="32" cy="12" r="5" strokeWidth="1.5" fill="none" />
          <text x="32" y="14.5" fontSize="6" fontWeight="bold" fill="currentColor" textAnchor="middle">V</text>
        </svg>
      );

    case 'electrolysis':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* U-tube electrolysis cell */}
          <path d="M 16 16 L 16 42 C 16 52 48 52 48 42 L 48 16" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="19" y="18" width="4" height="24" fill="currentColor" />
          <rect x="41" y="18" width="4" height="24" fill="currentColor" />
          {/* Battery DC source */}
          <line x1="28" y1="12" x2="36" y2="12" strokeWidth="2" />
          <line x1="30" y1="8" x2="34" y2="8" strokeWidth="1.5" />
          <path d="M 21 18 L 21 10 L 28 10 M 36 10 L 43 10 L 43 18" strokeWidth="1.2" />
        </svg>
      );

    case 'corrosion':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Iron nail */}
          <rect x="18" y="14" width="28" height="4" rx="1" fill="currentColor" />
          <path d="M 30 18 L 30 50 L 32 54 L 34 50 L 34 18 Z" strokeWidth="1.5" fill="none" />
          {/* Rust spots */}
          <circle cx="32" cy="28" r="2.5" fill="#ea580c" />
          <circle cx="31" cy="38" r="2" fill="#ea580c" />
          <circle cx="33" cy="46" r="1.5" fill="#ea580c" />
          {/* Droplets / environmental humidity */}
          <path d="M 46 26 C 46 30 42 32 42 32 C 42 32 38 30 38 26 C 38 23 42 19 42 19 C 42 19 46 23 46 26 Z" strokeWidth="1.2" />
        </svg>
      );

    case 'safety':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Safety shield */}
          <path d="M 32 10 L 48 16 C 48 34 38 48 32 54 C 26 48 16 34 16 16 Z" strokeWidth="2" strokeLinejoin="round" />
          {/* Hazard cross/check inside */}
          <path d="M 26 31 L 30 35 L 38 27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'measurement':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Graduated cylinder */}
          <rect x="24" y="12" width="16" height="44" rx="2" strokeWidth="2" />
          <path d="M 18 56 L 46 56" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="20" x2="34" y2="20" strokeWidth="1.5" />
          <line x1="28" y1="28" x2="36" y2="28" strokeWidth="1.5" />
          <line x1="28" y1="36" x2="34" y2="36" strokeWidth="1.5" />
          <line x1="28" y1="44" x2="36" y2="44" strokeWidth="1.5" />
          {/* Curved meniscus curve */}
          <path d="M 24 30 Q 32 32 40 30" stroke="#0284c7" strokeWidth="1.8" />
        </svg>
      );

    case 'reaction':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Test tube rack or dual test tubes reacting */}
          <rect x="18" y="14" width="8" height="34" rx="4" strokeWidth="1.8" />
          <rect x="36" y="14" width="8" height="34" rx="4" strokeWidth="1.8" />
          {/* Bubbles */}
          <circle cx="22" cy="38" r="1.5" fill="currentColor" />
          <circle cx="40" cy="32" r="1.5" fill="currentColor" />
          <circle cx="22" cy="28" r="1" fill="currentColor" />
          <path d="M 12 54 L 52 54" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'mass_conservation':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Dual pan balance */}
          <line x1="14" y1="24" x2="50" y2="24" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="16" x2="32" y2="52" strokeWidth="2" />
          <path d="M 22 52 L 42 52" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left pan */}
          <path d="M 14 24 L 10 38 L 22 38 Z" strokeWidth="1.4" />
          {/* Right pan */}
          <path d="M 50 24 L 42 38 L 54 38 Z" strokeWidth="1.4" />
        </svg>
      );

    case 'limiting_reactant':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Bar chart stoichiometry */}
          <rect x="16" y="32" width="8" height="22" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3" />
          <rect x="28" y="18" width="8" height="36" strokeWidth="1.5" fill="currentColor" fillOpacity="0.7" />
          <rect x="40" y="40" width="8" height="14" strokeWidth="1.5" fill="currentColor" />
          <line x1="12" y1="54" x2="52" y2="54" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'solution_prep':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Volumetric flask with long neck and calibration ring */}
          <path d="M 28 10 L 36 10 L 36 28 L 48 48 C 50 52 46 56 40 56 L 24 56 C 18 56 14 52 16 48 L 28 28 Z" strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="28" y1="20" x2="36" y2="20" strokeWidth="1.4" strokeDasharray="2 1" />
        </svg>
      );

    case 'dilution':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Pipette transferring liquid */}
          <path d="M 24 8 L 28 8 L 28 18 L 32 24 L 32 38 L 28 44 L 28 52 L 24 52 Z" strokeWidth="1.5" />
          {/* Droplet falling into flask */}
          <circle cx="26" cy="58" r="1.5" fill="#38bdf8" />
          <path d="M 38 34 L 46 34 L 52 50 L 34 50 Z" strokeWidth="1.5" />
        </svg>
      );

    case 'flame_test':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Bunsen burner flame */}
          <path d="M 26 56 L 38 56 M 32 56 L 32 44" strokeWidth="2" strokeLinecap="round" />
          <rect x="28" y="40" width="8" height="6" strokeWidth="1.5" />
          {/* Flame shape */}
          <path d="M 32 10 C 38 20 42 26 42 32 C 42 38 38 40 32 40 C 26 40 22 38 22 32 C 22 26 26 20 32 10 Z" strokeWidth="2" fill="#f59e0b" fillOpacity="0.3" />
          {/* Wire loop dipping */}
          <path d="M 48 18 L 34 26" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="33" cy="27" r="1.5" fill="#ef4444" />
        </svg>
      );

    case 'polarity':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Water molecule / dipole charges */}
          <circle cx="32" cy="24" r="8" strokeWidth="1.8" />
          <circle cx="20" cy="38" r="5" strokeWidth="1.5" />
          <circle cx="44" cy="38" r="5" strokeWidth="1.5" />
          <line x1="27" y1="30" x2="23" y2="34" strokeWidth="1.5" />
          <line x1="37" y1="30" x2="41" y2="34" strokeWidth="1.5" />
          <text x="32" y="27" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor">δ-</text>
          <text x="20" y="41" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor">δ+</text>
          <text x="44" y="41" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor">δ+</text>
        </svg>
      );

    case 'buffer':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Shield protecting beaker against acid/base */}
          <path d="M 18 24 L 20 52 C 20 54 22 56 26 56 L 38 56 C 42 56 44 54 44 52 L 46 24 Z" strokeWidth="1.8" />
          <path d="M 32 12 L 42 16 C 42 28 36 36 32 40 C 28 36 22 28 22 16 Z" strokeWidth="1.8" fill="#10b981" fillOpacity="0.25" />
          <path d="M 30 26 L 34 26 M 32 24 L 32 28" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'solubility':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Precipitation beaker */}
          <path d="M 18 20 L 18 52 C 18 56 22 58 26 58 L 38 58 C 42 58 46 56 46 52 L 46 20 Z" strokeWidth="1.8" />
          {/* Precipitate layer at bottom */}
          <rect x="20" y="48" width="24" height="8" rx="1" fill="#cbd5e1" strokeWidth="1" />
          <circle cx="26" cy="38" r="1.5" fill="currentColor" />
          <circle cx="36" cy="34" r="1.5" fill="currentColor" />
          <circle cx="32" cy="42" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'freezing_point':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Thermometer submerged in ice crystal bath */}
          <line x1="32" y1="12" x2="32" y2="40" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="44" r="5" strokeWidth="1.5" fill="#38bdf8" />
          {/* Snowflake / Ice crystal */}
          <line x1="16" y1="44" x2="26" y2="44" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="44" x2="48" y2="44" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="21" y1="39" x2="21" y2="49" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="43" y1="39" x2="43" y2="49" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'functional_group':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Benzene ring or organic functional group formula */}
          <path d="M 32 14 L 46 22 L 46 38 L 32 46 L 18 38 L 18 22 Z" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="32" cy="30" r="8" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="46" y1="22" x2="54" y2="18" strokeWidth="1.8" />
          <text x="54" y="24" fontSize="7" fontWeight="bold" fill="currentColor">OH</text>
        </svg>
      );

    case 'esterification':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Ester bond R-COO-R' */}
          <path d="M 14 36 L 24 36 L 30 26 L 36 26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="29" y1="24" x2="29" y2="16" strokeWidth="2" />
          <line x1="31" y1="24" x2="31" y2="16" strokeWidth="2" />
          <text x="30" y="14" fontSize="7" fontWeight="bold" textAnchor="middle" fill="currentColor">O</text>
          <path d="M 36 26 L 42 36 L 52 36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'saponification':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Soap bar and clean lather bubbles */}
          <rect x="14" y="26" width="30" height="20" rx="4" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
          <circle cx="44" cy="22" r="5" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.3" />
          <circle cx="48" cy="34" r="3" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.3" />
          <circle cx="38" cy="16" r="2.5" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.3" />
        </svg>
      );

    case 'polymer':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          {/* Repeating polymer monomer chain */}
          <circle cx="16" cy="32" r="4" strokeWidth="1.8" />
          <circle cx="28" cy="32" r="4" strokeWidth="1.8" />
          <circle cx="40" cy="32" r="4" strokeWidth="1.8" />
          <circle cx="52" cy="32" r="4" strokeWidth="1.8" />
          <line x1="20" y1="32" x2="24" y2="32" strokeWidth="2" />
          <line x1="32" y1="32" x2="36" y2="32" strokeWidth="2" />
          <line x1="44" y1="32" x2="48" y2="32" strokeWidth="2" />
          <text x="56" y="44" fontSize="7" fontStyle="italic" fill="currentColor">n</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="20" strokeWidth="2" />
          <path d="M 32 16 L 32 48 M 16 32 L 48 32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
