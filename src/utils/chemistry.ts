import { ChemistryState } from '../types';

export const STANDARD_BASE_CONCENTRATION = 0.1000; // M (mol/L)
export const STANDARD_ACID_VOLUME_ML = 25.00; // mL
export const STANDARD_SAMPLE_VOLUME = 25.00; // mL
export const STANDARD_ACID_VOLUME_L = 0.025; // L

/**
 * Generates realistic unknown acid concentration for high school titration (0.0850 - 0.1150 M)
 */
export function generateUnknownAcidConcentration(): number {
  const min = 0.0850;
  const max = 0.1150;
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(4));
}

/**
 * Calculates the theoretical equivalence volume of NaOH in mL
 */
export function calculateTheoreticalEquivalence(
  trueAcidConcentration: number,
  acidVolumeL: number = STANDARD_ACID_VOLUME_L,
  baseConcentration: number = STANDARD_BASE_CONCENTRATION
): number {
  const acidMoles = trueAcidConcentration * acidVolumeL;
  const baseVolumeL = acidMoles / baseConcentration;
  return Number((baseVolumeL * 1000).toFixed(2));
}

/**
 * Deterministic calculation of solution pH and Phenolphthalein color
 */
export function calculateSolutionChemistry(
  trueAcidConcentration: number,
  deliveredVolumeMl: number,
  initialReadingMl: number,
  baseConcentration: number = STANDARD_BASE_CONCENTRATION,
  pinkCloudDecay: number = 0
): ChemistryState {
  const acidVolumeL = STANDARD_ACID_VOLUME_L;
  const deliveredVolumeL = Math.max(0, deliveredVolumeMl) / 1000;
  const totalVolumeL = acidVolumeL + deliveredVolumeL;

  const acidMoles = trueAcidConcentration * acidVolumeL;
  const baseMoles = baseConcentration * deliveredVolumeL;

  const epsilon = 1e-9;
  const diff = acidMoles - baseMoles;

  let pH = 7.00;

  if (diff > epsilon) {
    // Before Equivalence (Excess H+)
    const remainingH = diff;
    const hConcentration = remainingH / totalVolumeL;
    pH = -Math.log10(hConcentration);
    // Clamp safely for realistic high school simulation
    pH = Math.max(0.70, Math.min(6.99, pH));
  } else if (Math.abs(diff) <= epsilon) {
    // Exact Equivalence (Strong Acid + Strong Base at 25 °C)
    pH = 7.00;
  } else {
    // After Equivalence (Excess OH-)
    const remainingOH = -diff;
    const ohConcentration = remainingOH / totalVolumeL;
    const pOH = -Math.log10(ohConcentration);
    pH = 14.00 - pOH;
    pH = Math.min(13.50, Math.max(7.01, pH));
  }

  // Phenolphthalein color behavior
  // pH < 8.2: colorless
  // pH 8.2 - 8.5: subtle pink tint
  // pH 8.5 - 9.2: pale pink (ideal endpoint)
  // pH 9.2 - 10.0: visible light pink
  // pH > 10.0: intense pink / magenta
  let indicatorAlpha = 0;
  let indicatorColorHex = '#f43f5e'; // Rose / Pink 500

  if (pH < 8.2) {
    indicatorAlpha = 0;
  } else if (pH >= 8.2 && pH < 8.5) {
    // 0.08 to 0.22
    const factor = (pH - 8.2) / (8.5 - 8.2);
    indicatorAlpha = 0.08 + factor * 0.14;
    indicatorColorHex = '#fca5a5'; // Soft rose tint
  } else if (pH >= 8.5 && pH < 9.2) {
    // 0.25 to 0.45 (Ideal pale pink)
    const factor = (pH - 8.5) / (9.2 - 8.5);
    indicatorAlpha = 0.25 + factor * 0.20;
    indicatorColorHex = '#f472b6'; // Pale clear pink
  } else if (pH >= 9.2 && pH <= 10.0) {
    // 0.50 to 0.75 (Visible distinct pink)
    const factor = (pH - 9.2) / (10.0 - 9.2);
    indicatorAlpha = 0.50 + factor * 0.25;
    indicatorColorHex = '#ec4899'; // Distinct pink
  } else {
    // Over-titrated strong magenta / fuchsia
    const factor = Math.min(1, (pH - 10.0) / 2.5);
    indicatorAlpha = 0.78 + factor * 0.20;
    indicatorColorHex = '#db2777'; // Vivid deep pink/magenta
  }

  const equivalenceVolumeMl = calculateTheoreticalEquivalence(
    trueAcidConcentration,
    acidVolumeL,
    baseConcentration
  );

  const currentReading = Number((initialReadingMl + deliveredVolumeMl).toFixed(2));

  return {
    trueAcidConcentration,
    acidVolumeL,
    baseConcentration,
    initialReading: initialReadingMl,
    currentReading,
    deliveredVolume: Number(deliveredVolumeMl.toFixed(2)),
    acidMoles,
    baseMoles,
    totalVolumeL,
    pH: Number(pH.toFixed(2)),
    indicatorColorHex,
    indicatorAlpha,
    pinkCloudIntensity: Math.max(0, Math.min(1, pinkCloudDecay)),
    isEquivalenceReached: deliveredVolumeMl >= equivalenceVolumeMl,
    equivalenceVolumeMl
  };
}

/**
 * Parses user numeric input supporting Indonesian comma format (e.g., "24,85" or "24.85")
 */
export function parseInputNumber(raw: string): number | null {
  if (!raw || typeof raw !== 'string') return null;
  const sanitized = raw.trim().replace(/\s+/g, '').replace(',', '.');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Formats a number with specified decimals
 */
export function formatDecimals(num: number, decimals: number = 2): string {
  if (isNaN(num) || num === null || num === undefined) return '0.00';
  return num.toFixed(decimals);
}

/**
 * Generates an ideal titration curve reference dataset for comparison / plotting
 */
export function generateTitrationCurvePoints(
  trueAcidConcentration: number,
  maxVolumeMl: number = 40.0,
  stepMl: number = 0.2
): Array<{ volume: number; pH: number }> {
  const points: Array<{ volume: number; pH: number }> = [];
  const eqVol = calculateTheoreticalEquivalence(trueAcidConcentration);

  for (let v = 0; v <= maxVolumeMl; v += stepMl) {
    const vRounded = Number(v.toFixed(2));
    const state = calculateSolutionChemistry(trueAcidConcentration, vRounded, 0);
    points.push({
      volume: vRounded,
      pH: state.pH
    });

    // Add extra dense points right around equivalence for razor-sharp curve visualization
    if (Math.abs(v - eqVol) < 0.5 && stepMl > 0.05) {
      for (let sub = -0.4; sub <= 0.4; sub += 0.05) {
        const subV = Number((eqVol + sub).toFixed(3));
        if (subV > 0 && subV < maxVolumeMl) {
          const subState = calculateSolutionChemistry(trueAcidConcentration, subV, 0);
          points.push({ volume: subV, pH: subState.pH });
        }
      }
    }
  }

  // Sort and remove duplicates
  points.sort((a, b) => a.volume - b.volume);
  const uniquePoints: Array<{ volume: number; pH: number }> = [];
  let lastVol = -1;
  for (const pt of points) {
    if (Math.abs(pt.volume - lastVol) > 0.02) {
      uniquePoints.push(pt);
      lastVol = pt.volume;
    }
  }

  return uniquePoints;
}
