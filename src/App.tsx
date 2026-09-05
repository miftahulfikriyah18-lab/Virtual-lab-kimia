/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ExperimentProgressRecord,
  ExperimentRegistryItem,
  PlatformNavigationTab,
  StudentDashboardSummary,
  StudentUser
} from './platform/types';
import { AuthService } from './services/authService';
import { ProgressService } from './services/progressService';
import { EXPERIMENTS_REGISTRY } from './platform/experimentsRegistry';

import { SplashScreen } from './components/platform/SplashScreen';
import { AuthView } from './components/platform/AuthView';
import { PlatformHeader } from './components/platform/PlatformHeader';
import { StudentDashboard } from './components/platform/StudentDashboard';
import { CatalogView } from './components/platform/CatalogView';
import { ProgressView } from './components/platform/ProgressView';
import { HistoryView } from './components/platform/HistoryView';
import { StudentProfileView } from './components/platform/StudentProfileView';
import { ComingSoonModal } from './components/platform/ComingSoonModal';
import { TitrationLabModule } from './labs/acid-base-titration/TitrationLabModule';
import { FinalReportView } from './components/views/FinalReportView';

export default function App() {
  // 1. Splash screen: display on initial load, dismissible
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Only show splash once per session
    return !sessionStorage.getItem('vlab_splash_seen');
  });

  const handleDismissSplash = () => {
    sessionStorage.setItem('vlab_splash_seen', 'true');
    setShowSplash(false);
  };

  // 2. Authentication: check current session or local demo user
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    return AuthService.getCurrentUser();
  });

  // 3. Platform navigation & view state
  const [currentView, setCurrentView] = useState<'PLATFORM' | 'TITRATION_LAB' | 'TITRATION_REPORT_VIEW'>('PLATFORM');
  const [platformTab, setPlatformTab] = useState<PlatformNavigationTab>('beranda');

  // 4. Modal for coming soon previews
  const [selectedComingSoon, setSelectedComingSoon] = useState<ExperimentRegistryItem | null>(null);

  // 5. Success banner state after completing an experiment
  const [justCompletedScore, setJustCompletedScore] = useState<number | null>(null);

  // 6. Selected report for detailed viewing from History/Dashboard
  const [selectedReportRecord, setSelectedReportRecord] = useState<ExperimentProgressRecord | null>(null);

  // 7. Live progress data for current student
  const [progressSummary, setProgressSummary] = useState<StudentDashboardSummary>(() => {
    const userId = currentUser ? currentUser.userId : 'demo-student';
    return ProgressService.getDashboardSummary(userId);
  });

  const [titrationProgress, setTitrationProgress] = useState<ExperimentProgressRecord | null>(() => {
    const userId = currentUser ? currentUser.userId : 'demo-student';
    return ProgressService.getExperimentProgress(userId, 'XI-06');
  });

  const [allProgressMap, setAllProgressMap] = useState<Record<string, ExperimentProgressRecord>>(() => {
    const userId = currentUser ? currentUser.userId : 'demo-student';
    return ProgressService.getAllProgress(userId);
  });

  const [historyList, setHistoryList] = useState<ExperimentProgressRecord[]>(() => {
    const userId = currentUser ? currentUser.userId : 'demo-student';
    return ProgressService.getHistory(userId);
  });

  // Refresh progress state whenever user changes or action completes
  const refreshProgress = () => {
    if (!currentUser) return;
    setProgressSummary(ProgressService.getDashboardSummary(currentUser.userId));
    setTitrationProgress(ProgressService.getExperimentProgress(currentUser.userId, 'XI-06'));
    setAllProgressMap(ProgressService.getAllProgress(currentUser.userId));
    setHistoryList(ProgressService.getHistory(currentUser.userId));
  };

  useEffect(() => {
    refreshProgress();
  }, [currentUser]);

  // Auth Handlers
  const handleAuthenticated = (user: StudentUser) => {
    setCurrentUser(user);
    refreshProgress();
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setCurrentView('PLATFORM');
  };

  // Lab Navigation Handlers
  const handleStartTitration = () => {
    setCurrentView('TITRATION_LAB');
  };

  const handleResumeTitration = () => {
    setCurrentView('TITRATION_LAB');
  };

  const handleReturnFromLabToDashboard = (score?: number | null) => {
    setCurrentView('PLATFORM');
    refreshProgress();
    if (score !== undefined && score !== null) {
      setJustCompletedScore(score);
    }
  };

  // Catalog Experiment Selection
  const handleSelectExperiment = (exp: ExperimentRegistryItem) => {
    if (exp.status === 'available') {
      setCurrentView('TITRATION_LAB');
    } else {
      setSelectedComingSoon(exp);
    }
  };

  // View Report Handler
  const handleViewTitrationReport = (record?: ExperimentProgressRecord) => {
    const rec = record || titrationProgress;
    if (rec && rec.reportData) {
      setSelectedReportRecord(rec);
      setCurrentView('TITRATION_REPORT_VIEW');
    }
  };

  // ===================== RENDER ROUTING =====================

  const renderCurrentView = () => {
    // 1. Splash Screen
    if (showSplash) {
      return <SplashScreen onProceed={handleDismissSplash} />;
    }

    // 2. Auth / Login Screen if not authenticated
    if (!currentUser) {
      return <AuthView onAuthenticated={handleAuthenticated} />;
    }

    // 3. Titration Lab Active Workspace
    if (currentView === 'TITRATION_LAB') {
      return (
        <TitrationLabModule
          user={currentUser}
          onReturnToDashboard={handleReturnFromLabToDashboard}
          initialStartScreen="BRIEF"
        />
      );
    }

    // 4. Standalone Titration Report View (from History or Dashboard)
    if (currentView === 'TITRATION_REPORT_VIEW' && selectedReportRecord?.reportData) {
      const rep = selectedReportRecord.reportData;
      return (
        <div className="min-h-screen text-[#1D1D1B] py-6 px-4 selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
          <div className="max-w-4xl mx-auto mb-4">
            <button
              onClick={() => setCurrentView('PLATFORM')}
              className="px-4 py-2 bg-white hover:bg-[#F4EFE6] border border-[#1D1D1B] text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1B] shadow-[2px_2px_0px_#1D1D1B] transition cursor-pointer"
            >
              ← Kembali ke Dashboard V-Lab
            </button>
          </div>
          <FinalReportView
            profile={rep.student}
            mode={rep.mode}
            trials={rep.trials}
            evaluation={rep.scores}
            onRestart={() => {
              setCurrentView('TITRATION_LAB');
            }}
            onSwitchMode={() => {
              setCurrentView('TITRATION_LAB');
            }}
            onHome={() => setCurrentView('PLATFORM')}
          />
        </div>
      );
    }

    // 5. Main Platform Shell (Dashboard, Catalog, Progress, History, Profile)
    return (
      <div className="min-h-screen text-[#1D1D1B] flex flex-col selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
        {/* Platform Top Header */}
        <PlatformHeader
          user={currentUser}
          activeTab={platformTab}
          onTabChange={setPlatformTab}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {platformTab === 'beranda' && (
            <StudentDashboard
              user={currentUser}
              summary={progressSummary}
              titrationProgress={titrationProgress}
              onNavigateTab={setPlatformTab}
              onStartTitration={handleStartTitration}
              onResumeTitration={handleResumeTitration}
              onSelectExperiment={handleSelectExperiment}
              onViewReport={() => handleViewTitrationReport()}
              justCompletedScore={justCompletedScore}
              onDismissCompletionNotice={() => setJustCompletedScore(null)}
            />
          )}

          {platformTab === 'katalog' && (
            <CatalogView
              userGrade={currentUser.grade}
              progressMap={allProgressMap}
              onSelectExperiment={handleSelectExperiment}
            />
          )}

          {platformTab === 'progres' && (
            <ProgressView
              summary={progressSummary}
              titrationProgress={titrationProgress}
              onGoToLab={handleStartTitration}
            />
          )}

          {platformTab === 'riwayat' && (
            <HistoryView
              historyRecords={historyList}
              onViewReport={handleViewTitrationReport}
              onRepeatExperiment={() => handleStartTitration()}
              onGoToCatalog={() => setPlatformTab('katalog')}
            />
          )}

          {platformTab === 'profil' && (
            <StudentProfileView
              user={currentUser}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                refreshProgress();
              }}
            />
          )}
        </main>

        {/* Platform Academic Footer */}
        <footer className="border-t border-[#1D1D1B]/20 bg-[#F4EFE6]/70 py-6 px-4 text-xs font-mono text-[#1D1D1B]/70">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#1D1D1B]">V-LAB KIMIA SMA</p>
              <p className="text-[11px] text-[#1D1D1B]/60">
                Laboratorium Kimia Virtual Kelas X, XI, dan XII • Standar Analis Kimia Kuantitatif
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Kurikulum Kimia SMA</span>
              <span>•</span>
              <span>Versi 2.0 Platform</span>
            </div>
          </div>
        </footer>

        {/* Coming Soon Preview Modal */}
        <ComingSoonModal
          experiment={selectedComingSoon}
          onClose={() => setSelectedComingSoon(null)}
        />
      </div>
    );
  };

  return (
    <div className="vlab-app-canvas selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* 1. Full-page fixed background with laboratory image */}
      <div className="vlab-bg-canvas" aria-hidden="true" />
      {/* 2. Dark Navy / Teal Overlay (25–35% opacity) */}
      <div className="vlab-bg-overlay" aria-hidden="true" />

      {/* 3. Main Semi-Transparent White Frosted Glass Panel Container */}
      <div className="vlab-frosted-panel">
        {renderCurrentView()}
      </div>
    </div>
  );
}
