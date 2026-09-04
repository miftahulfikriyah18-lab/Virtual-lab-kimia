import { ActiveExperimentSession, SavedExperimentReport, StudentProfile } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'vlab_student_profile',
  LAST_REPORT: 'vlab_last_experiment_report',
  SETTINGS: 'vlab_user_settings',
  ACTIVE_EXPERIMENT: 'vlab_active_experiment_state'
};

export interface AppSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  showPhMeterInChallenge: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  reducedMotion: false,
  showPhMeterInChallenge: true
};

export function loadSavedProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string') {
      return parsed;
    }
  } catch (e) {
    console.warn('Gagal membaca profil dari penyimpanan lokal', e);
  }
  return null;
}

export function saveProfile(profile: StudentProfile): void {
  try {
    if (profile.rememberMe) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    }
  } catch (e) {
    console.warn('Gagal menyimpan profil', e);
  }
}

export const loadStudentProfile = loadSavedProfile;
export const saveStudentProfile = saveProfile;

export function loadLastReport(): SavedExperimentReport | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_REPORT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca laporan terakhir', e);
  }
  return null;
}

export function saveLastReport(report: SavedExperimentReport): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_REPORT, JSON.stringify(report));
  } catch (e) {
    console.warn('Gagal menyimpan laporan', e);
  }
}

export function loadActiveExperiment(): ActiveExperimentSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_EXPERIMENT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca sesi eksperimen aktif', e);
  }
  return null;
}

export function saveActiveExperiment(session: ActiveExperimentSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_EXPERIMENT, JSON.stringify(session));
  } catch (e) {
    console.warn('Gagal menyimpan sesi eksperimen aktif', e);
  }
}

export function clearActiveExperiment(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXPERIMENT);
  } catch (e) {
    console.warn('Gagal membersihkan eksperimen', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Gagal memuat pengaturan', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Gagal menyimpan pengaturan', e);
  }
}
