import { SavedExperimentReport, StudentProfile } from '../types';

export type GradeLevel = 'Kelas X' | 'Kelas XI' | 'Kelas XII';

export type ExperimentStatus = 'available' | 'coming_soon' | 'in_progress' | 'completed';

export interface ExperimentRegistryItem {
  id: string; // e.g. 'XI-06'
  code: string; // e.g. 'XI-06'
  title: string;
  topic: string;
  grade: GradeLevel[];
  description: string;
  status: 'available' | 'coming_soon';
  durationMinutes: number;
  difficulty: 'Mudah' | 'Sedang' | 'Lanjutan';
  curriculumStandard: string; // e.g. 'Kurikulum Merdeka / K-13'
  route: string;
  futureActivities?: string[];
  thumbnailType:
    | 'titration'
    | 'safety'
    | 'measurement'
    | 'reaction'
    | 'mass_conservation'
    | 'limiting_reactant'
    | 'solution_prep'
    | 'dilution'
    | 'flame_test'
    | 'polarity'
    | 'calorimetry'
    | 'reaction_rate'
    | 'equilibrium'
    | 'ph_acid_base'
    | 'buffer'
    | 'solubility'
    | 'freezing_point'
    | 'voltaic_cell'
    | 'electrolysis'
    | 'corrosion'
    | 'functional_group'
    | 'esterification'
    | 'saponification'
    | 'polymer';
}

export interface StudentUser {
  userId: string;
  name: string;
  email: string;
  school: string;
  grade: GradeLevel;
  createdAt: string;
  lastLogin: string;
  isDemo?: boolean;
}

export interface ExperimentProgressRecord {
  experimentId: string;
  userId: string;
  status: ExperimentStatus;
  grade: GradeLevel[];
  topic: string;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  attempts: number;
  bestScore?: number;
  latestResult?: {
    concentration?: number;
    percentError?: number;
    ratingTitle?: string;
  };
  reportData?: SavedExperimentReport;
}

export interface StudentDashboardSummary {
  availableCount: number; // Only counting active/available experiments (currently 1)
  completedCount: number;
  inProgressCount: number;
  bestScore: number | null;
  totalAttempts: number;
  completionPercentage: number; // e.g. 100% if 1/1 completed
}

export type PlatformNavigationTab = 'beranda' | 'katalog' | 'progres' | 'riwayat' | 'profil';
