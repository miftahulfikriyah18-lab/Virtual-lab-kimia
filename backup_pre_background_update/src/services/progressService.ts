import { ExperimentProgressRecord, GradeLevel, StudentDashboardSummary } from '../platform/types';
import { EXPERIMENTS_REGISTRY } from '../platform/experimentsRegistry';
import { SavedExperimentReport } from '../types';

const STORAGE_KEY_PROGRESS_PREFIX = 'vlab_progress_';

export class ProgressService {
  private static getKey(userId: string): string {
    return `${STORAGE_KEY_PROGRESS_PREFIX}${userId}`;
  }

  static getAllProgress(userId: string): Record<string, ExperimentProgressRecord> {
    try {
      const raw = localStorage.getItem(this.getKey(userId));
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error('Failed to load progress', e);
      return {};
    }
  }

  static getProgress(userId: string, experimentId: string): ExperimentProgressRecord | null {
    const all = this.getAllProgress(userId);
    return all[experimentId] || null;
  }

  static startExperiment(
    userId: string,
    experimentId: string,
    grade: GradeLevel[],
    topic: string
  ): ExperimentProgressRecord {
    const all = this.getAllProgress(userId);
    const existing = all[experimentId];

    const updated: ExperimentProgressRecord = {
      experimentId,
      userId,
      status: existing?.status === 'completed' ? 'completed' : 'in_progress',
      grade,
      topic,
      startedAt: existing?.startedAt || new Date().toISOString(),
      attempts: (existing?.attempts || 0) + 1,
      bestScore: existing?.bestScore,
      score: existing?.score,
      latestResult: existing?.latestResult,
      reportData: existing?.reportData
    };

    all[experimentId] = updated;
    localStorage.setItem(this.getKey(userId), JSON.stringify(all));
    return updated;
  }

  static recordExperimentCompletion(
    userId: string,
    experimentId: string,
    result: {
      score: number;
      reportData: SavedExperimentReport;
      concentration?: number;
      percentError?: number;
      ratingTitle?: string;
    }
  ): ExperimentProgressRecord {
    const all = this.getAllProgress(userId);
    const existing = all[experimentId];

    const currentBest = existing?.bestScore ?? 0;
    const newBestScore = Math.max(currentBest, result.score);

    const updated: ExperimentProgressRecord = {
      experimentId,
      userId,
      status: 'completed',
      grade: ['Kelas XI'],
      topic: 'Asam dan Basa',
      startedAt: existing?.startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      score: result.score,
      bestScore: newBestScore,
      attempts: Math.max(existing?.attempts || 1, 1),
      latestResult: {
        concentration: result.concentration,
        percentError: result.percentError,
        ratingTitle: result.ratingTitle
      },
      reportData: result.reportData
    };

    all[experimentId] = updated;
    localStorage.setItem(this.getKey(userId), JSON.stringify(all));
    return updated;
  }

  static getDashboardSummary(userId: string): StudentDashboardSummary {
    const all = this.getAllProgress(userId);

    // Available experiments count (Only active ones, e.g. XI-06 Titrasi Asam-Basa)
    const availableExps = EXPERIMENTS_REGISTRY.filter((e) => e.status === 'available');
    const availableCount = availableExps.length; // 1

    let completedCount = 0;
    let inProgressCount = 0;
    let bestScore: number | null = null;
    let totalAttempts = 0;

    for (const exp of availableExps) {
      const record = all[exp.id];
      if (record) {
        if (record.status === 'completed') {
          completedCount += 1;
        } else if (record.status === 'in_progress') {
          inProgressCount += 1;
        }

        if (record.bestScore !== undefined && record.bestScore !== null) {
          if (bestScore === null || record.bestScore > bestScore) {
            bestScore = record.bestScore;
          }
        }

        totalAttempts += record.attempts || 0;
      }
    }

    // STRICT INSTRUCTION:
    // "Do NOT include Coming Soon experiments in completion percentage.
    // If titration is the only available experiment and the student completes it:
    // Progress of currently available laboratories = 100%.
    // Do not say 1/25 = 4%."
    const completionPercentage = availableCount > 0 ? Math.round((completedCount / availableCount) * 100) : 0;

    return {
      availableCount,
      completedCount,
      inProgressCount,
      bestScore,
      totalAttempts,
      completionPercentage
    };
  }

  static getExperimentProgress(userId: string, experimentId: string): ExperimentProgressRecord | null {
    const all = this.getAllProgress(userId);
    return all[experimentId] || null;
  }

  static getRecentHistory(userId: string): ExperimentProgressRecord[] {
    const all = this.getAllProgress(userId);
    return Object.values(all)
      .filter((p) => p.status === 'completed' || p.status === 'in_progress')
      .sort((a, b) => {
        const timeA = new Date(a.completedAt || a.startedAt || 0).getTime();
        const timeB = new Date(b.completedAt || b.startedAt || 0).getTime();
        return timeB - timeA;
      });
  }

  static getHistory(userId: string): ExperimentProgressRecord[] {
    return this.getRecentHistory(userId);
  }
}
