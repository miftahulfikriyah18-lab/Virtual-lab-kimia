export type LabMode = 'guided' | 'challenge';

export type AppStep =
  | 'HOME'
  | 'MODE_SELECT'
  | 'PROFILE'
  | 'SAFETY'
  | 'BRIEF'
  | 'LAB'
  | 'CALCULATION'
  | 'CURVE_ANALYSIS'
  | 'CONCEPT_QUESTIONS'
  | 'FINAL_REPORT'
  | 'LEARN_CONCEPT'
  | 'EQUIPMENT_GUIDE';

export type AppScreen = AppStep;

export type LabWorkflowStep =
  | 'BURETTE_MOUNT'
  | 'BURETTE_RINSE_WATER'
  | 'BURETTE_RINSE_NAOH'
  | 'BURETTE_FILL'
  | 'CHECK_AIR_BUBBLE'
  | 'READ_INITIAL_MENISCUS'
  | 'SAMPLE_PIPETTE'
  | 'SAMPLE_TRANSFER'
  | 'ADD_INDICATOR'
  | 'PLACE_FLASK'
  | 'READY_TITRATE'
  | 'TITRATING'
  | 'TITRATION_PAUSED'
  | 'READ_FINAL_MENISCUS'
  | 'TRIAL_DONE';

export type TrialType = 'rough' | 'accurate1' | 'accurate2' | 'accurate3';

export type StopcockRate = 'closed' | 'dropwise' | 'slow' | 'fast';

export interface StudentProfile {
  name: string;
  className: string;
  school: string;
  rememberMe: boolean;
}

export interface TrialData {
  id: string;
  type: TrialType;
  title: string;
  isRough: boolean;
  initialReading: number;
  studentInitialReading?: number;
  finalReading: number;
  studentFinalReading?: number;
  deliveredVolume: number;
  studentDeliveredVolume?: number;
  pH: number;
  indicatorColor: string;
  swirlCount: number;
  airBubblePresent: boolean;
  bubbleFlushed: boolean;
  overtitration: boolean;
  stoppedEarly: boolean;
  durationSeconds: number;
  curvePoints: Array<{ volume: number; pH: number }>;
  isConcordant?: boolean;
}

export interface ChemistryState {
  trueAcidConcentration: number;
  acidVolumeL: number; // 0.025 L (25.00 mL)
  baseConcentration: number; // 0.1000 M
  initialReading: number; // e.g. 0.40 mL
  currentReading: number;
  deliveredVolume: number;
  acidMoles: number;
  baseMoles: number;
  totalVolumeL: number;
  pH: number;
  indicatorColorHex: string;
  indicatorAlpha: number;
  pinkCloudIntensity: number; // 0 to 1 for localized temporary cloud
  isEquivalenceReached: boolean;
  equivalenceVolumeMl: number;
}

export interface TechniqueLog {
  ppeComplete: boolean;
  buretteMounted: boolean;
  buretteRinsedWater: boolean;
  buretteConditionedWithNaOH: boolean;
  airBubbleChecked: boolean;
  airBubbleFlushed: boolean;
  pipetteFillerUsed: boolean;
  sampleVolumeExact: boolean;
  indicatorDropCount: number;
  flaskPlacedOnTile: boolean;
  flaskSwirlCountTotal: number;
  titrationSlowedNearEndpoint: boolean;
  overtitrationObserved: boolean;
  meniscusReadingAttempts: number;
  meniscusPrecisionOk: boolean;
}

export interface CalculationAnswers {
  avgNaOHVolume: string; // mL
  molesNaOH: string; // mol
  moleRatio: string; // "1:1"
  molesHCl: string; // mol
  concentrationHCl: string; // mol/L
  isSubmitted: boolean;
  scores: {
    avgVolumeCorrect: boolean;
    molesNaOHCorrect: boolean;
    moleRatioCorrect: boolean;
    molesHClCorrect: boolean;
    concentrationCorrect: boolean;
  };
}

export interface ConceptQuestionsAnswer {
  q1: string; // slow drops near endpoint
  q2: string; // endpoint vs equivalence
  q3: string; // repeatable concordant trials
  isSubmitted: boolean;
  score: number;
}

export interface FinalEvaluation {
  techniqueScore: number; // max 30
  accuracyScore: number; // max 30
  precisionScore: number; // max 20
  calculationScore: number; // max 15
  safetyScore: number; // max 5
  totalScore: number; // max 100
  percentError: number;
  calculatedConcentration: number;
  trueConcentration: number;
  concordantSpread: number;
  ratingTitle: 'Master Titrasi' | 'Analis Terampil' | 'Praktikan Berkembang' | 'Perlu Latihan';
  feedbackNotes: string[];
}

export interface SavedExperimentReport {
  id?: string;
  timestamp: string;
  student: StudentProfile;
  mode: LabMode;
  trials: TrialData[];
  trueAcidConcentration: number;
  calculatedConcentration: number;
  percentError: number;
  concordantTrials: string[];
  averageTitre: number;
  scores: FinalEvaluation;
  feedbackNotes?: string[];
}

export interface ActiveExperimentSession {
  currentScreen: AppScreen;
  mode: LabMode;
  profile: StudentProfile;
  trueAcidConcentration: number;
  trials: TrialData[];
  techniqueLog: TechniqueLog;
  calculatedConcentration: number;
  calculationAnswers?: CalculationAnswers;
  conceptAnswers?: ConceptQuestionsAnswer;
  evaluation?: FinalEvaluation | null;
  lastUpdated: number;
}

export const UNKNOWN_HCL_BANK = [
  0.0850,
  0.0900,
  0.0925,
  0.0950,
  0.1000,
  0.1050,
  0.1075,
  0.1100,
  0.1150
];
