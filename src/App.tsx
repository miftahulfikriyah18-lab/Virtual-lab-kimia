/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveExperimentSession,
  AppScreen,
  CalculationAnswers,
  ConceptQuestionsAnswer,
  FinalEvaluation,
  LabMode,
  SavedExperimentReport,
  StudentProfile,
  TechniqueLog,
  TrialData
} from './types';
import {
  generateUnknownAcidConcentration,
  STANDARD_BASE_CONCENTRATION,
  STANDARD_SAMPLE_VOLUME
} from './utils/chemistry';
import { evaluateExperiment } from './utils/scoring';
import {
  clearActiveExperiment,
  loadActiveExperiment,
  loadLastReport,
  loadStudentProfile,
  saveActiveExperiment,
  saveLastReport,
  saveStudentProfile
} from './utils/storage';

import { HomePage } from './components/views/HomePage';
import { LearnConceptView } from './components/views/LearnConceptView';
import { EquipmentGuideView } from './components/views/EquipmentGuideView';
import { ModeSelectModal } from './components/views/ModeSelectModal';
import { StudentProfileModal } from './components/views/StudentProfileModal';
import { ExperimentBriefView } from './components/views/ExperimentBriefView';
import { LabWorkspace } from './components/LabWorkspace';
import { CalculationWorksheet } from './components/views/CalculationWorksheet';
import { CurveAnalysisView } from './components/views/CurveAnalysisView';
import { ConceptQuestionsView } from './components/views/ConceptQuestionsView';
import { FinalReportView } from './components/views/FinalReportView';

export default function App() {
  // Check for saved active experiment session on same device/name
  const initialActive = loadActiveExperiment();

  // Screen Router - Restores directly to active step if one was in progress!
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    if (initialActive?.currentScreen && initialActive.currentScreen !== 'SAFETY') {
      return initialActive.currentScreen;
    }
    return 'HOME';
  });

  // Modals over current screen
  const [showModeModal, setShowModeModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Student profile & preferences
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return (
      initialActive?.profile ||
      loadStudentProfile() || {
        name: '',
        className: 'XI MIPA 1',
        school: 'SMA Negeri',
        rememberMe: true
      }
    );
  });

  // Selected mode
  const [mode, setMode] = useState<LabMode>(() => initialActive?.mode || 'guided');

  // Mystery unknown acid concentration (persists for the entire session of trials)
  const [trueAcidConcentration, setTrueAcidConcentration] = useState<number>(() =>
    initialActive?.trueAcidConcentration || generateUnknownAcidConcentration()
  );

  // Experimental trials completed in the lab
  const [trials, setTrials] = useState<TrialData[]>(() => initialActive?.trials || []);

  // Laboratory technique log
  const [techniqueLog, setTechniqueLog] = useState<TechniqueLog>(() =>
    initialActive?.techniqueLog || {
      ppeComplete: true,
      buretteMounted: (initialActive?.trials?.length ?? 0) > 0,
      buretteRinsedWater: (initialActive?.trials?.length ?? 0) > 0,
      buretteConditionedWithNaOH: (initialActive?.trials?.length ?? 0) > 0,
      airBubbleChecked: (initialActive?.trials?.length ?? 0) > 0,
      airBubbleFlushed: (initialActive?.trials?.length ?? 0) > 0,
      pipetteFillerUsed: true,
      sampleVolumeExact: true,
      indicatorDropCount: 0,
      flaskPlacedOnTile: false,
      flaskSwirlCountTotal: 0,
      titrationSlowedNearEndpoint: false,
      overtitrationObserved: false,
      meniscusReadingAttempts: 0,
      meniscusPrecisionOk: true
    }
  );

  // Student calculation result
  const [calculatedConcentration, setCalculatedConcentration] = useState<number>(() =>
    initialActive?.calculatedConcentration ?? 0.1
  );
  const [calculationAnswers, setCalculationAnswers] = useState<CalculationAnswers | undefined>(() =>
    initialActive?.calculationAnswers
  );

  // Concept questions answer
  const [conceptAnswers, setConceptAnswers] = useState<ConceptQuestionsAnswer | undefined>(() =>
    initialActive?.conceptAnswers
  );

  // Evaluation & Final Report
  const [evaluation, setEvaluation] = useState<FinalEvaluation | null>(() =>
    initialActive?.evaluation || null
  );

  // Previous saved report for Homepage
  const [lastReport, setLastReport] = useState<SavedExperimentReport | null>(() => loadLastReport());

  // Auto-persist active session whenever state updates so accidental refreshes never lose progress!
  useEffect(() => {
    if (trials.length > 0 || currentScreen !== 'HOME' || profile.name) {
      saveActiveExperiment({
        currentScreen,
        mode,
        profile,
        trueAcidConcentration,
        trials,
        techniqueLog,
        calculatedConcentration,
        calculationAnswers,
        conceptAnswers,
        evaluation,
        lastUpdated: Date.now()
      });
    }
  }, [
    currentScreen,
    mode,
    profile,
    trueAcidConcentration,
    trials,
    techniqueLog,
    calculatedConcentration,
    calculationAnswers,
    conceptAnswers,
    evaluation
  ]);

  // Handle student clicking "MULAI PRAKTIKUM" on Home
  const handleStartFlow = () => {
    setShowModeModal(true);
  };

  // When mode is selected - directly proceeds to BRIEF without the checklist!
  const handleSelectMode = (selectedMode: LabMode) => {
    setMode(selectedMode);
    setShowModeModal(false);
    if (!profile.name) {
      setShowProfileModal(true);
    } else {
      setCurrentScreen('BRIEF');
    }
  };

  // When profile is submitted - directly proceeds to BRIEF without the checklist!
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    if (newProfile.rememberMe) {
      saveStudentProfile(newProfile);
    }
    setShowProfileModal(false);
    setCurrentScreen('BRIEF');
  };

  // New Experiment button (regenerates mystery concentration, cleans storage, and clears trials)
  const handleStartNewExperiment = () => {
    clearActiveExperiment();
    setTrueAcidConcentration(generateUnknownAcidConcentration());
    setTrials([]);
    setTechniqueLog({
      ppeComplete: true,
      buretteMounted: false,
      buretteRinsedWater: false,
      buretteConditionedWithNaOH: false,
      airBubbleChecked: false,
      airBubbleFlushed: false,
      pipetteFillerUsed: true,
      sampleVolumeExact: true,
      indicatorDropCount: 0,
      flaskPlacedOnTile: false,
      flaskSwirlCountTotal: 0,
      titrationSlowedNearEndpoint: false,
      overtitrationObserved: false,
      meniscusReadingAttempts: 0,
      meniscusPrecisionOk: true
    });
    setCalculatedConcentration(0.1);
    setCalculationAnswers(undefined);
    setConceptAnswers(undefined);
    setEvaluation(null);
    setCurrentScreen('BRIEF');
  };

  // Active session representation for HomePage status card
  const activeSessionData: ActiveExperimentSession | null =
    trials.length > 0 || currentScreen === 'LAB' || currentScreen === 'CALCULATION' || currentScreen === 'CURVE_ANALYSIS'
      ? {
          currentScreen,
          mode,
          profile,
          trueAcidConcentration,
          trials,
          techniqueLog,
          calculatedConcentration,
          calculationAnswers,
          conceptAnswers,
          evaluation,
          lastUpdated: Date.now()
        }
      : null;

  // Transition from Lab to Calculations
  const handleFinishLabToCalculations = (
    recordedTrials: TrialData[],
    recordedTechnique: TechniqueLog
  ) => {
    setTrials(recordedTrials);
    setTechniqueLog(recordedTechnique);
    setCurrentScreen('CALCULATION');
  };

  // Transition from Calculations to Curve Analysis
  const handleCalculationComplete = (
    answersOrConc: CalculationAnswers | number,
    maybeConc?: number
  ) => {
    if (typeof answersOrConc === 'number') {
      setCalculatedConcentration(answersOrConc);
    } else if (typeof maybeConc === 'number') {
      setCalculationAnswers(answersOrConc);
      setCalculatedConcentration(maybeConc);
    } else if (answersOrConc && typeof answersOrConc === 'object') {
      setCalculationAnswers(answersOrConc);
      const parsed = parseFloat(answersOrConc.concentrationHCl);
      if (!isNaN(parsed) && parsed > 0) {
        setCalculatedConcentration(parsed);
      }
    }
    setCurrentScreen('CURVE_ANALYSIS');
  };

  // Transition from Concept questions to Final Report
  const handleConceptQuestionsComplete = (answers: ConceptQuestionsAnswer) => {
    setConceptAnswers(answers);

    // Compute final rubric scores using student's actual calculations
    const evalResult = evaluateExperiment(
      trueAcidConcentration,
      calculatedConcentration,
      trials,
      techniqueLog,
      calculationAnswers || {
        avgNaOHVolume: '25.00',
        molesNaOH: '0.0025',
        moleRatio: '1:1',
        molesHCl: '0.0025',
        concentrationHCl: calculatedConcentration.toFixed(4),
        isSubmitted: true,
        scores: {
          avgVolumeCorrect: true,
          molesNaOHCorrect: true,
          moleRatioCorrect: true,
          molesHClCorrect: true,
          concentrationCorrect: true
        }
      },
      techniqueLog.ppeComplete
    );

    setEvaluation(evalResult);

    const accurateTrials = trials.filter((t) => !t.isRough);
    const avgTitre =
      accurateTrials.length > 0
        ? accurateTrials.reduce((a, b) => a + b.deliveredVolume, 0) / accurateTrials.length
        : 0;

    // Persist completed experiment report
    const reportData: SavedExperimentReport = {
      id: `report-${Date.now()}`,
      student: profile,
      mode,
      timestamp: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      trials,
      trueAcidConcentration,
      calculatedConcentration,
      percentError: evalResult.percentError,
      concordantTrials: accurateTrials.map((t) => t.title),
      averageTitre: Number(avgTitre.toFixed(2)),
      scores: evalResult,
      feedbackNotes: evalResult.feedbackNotes
    };

    saveLastReport(reportData);
    setLastReport(reportData);
    setCurrentScreen('FINAL_REPORT');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1D1D1B] font-sans selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* 1. HOME SCREEN */}
      {currentScreen === 'HOME' && (
        <HomePage
          lastReport={lastReport}
          activeSession={activeSessionData}
          onStart={handleStartFlow}
          onResumeActive={() => {
            if (trials.length > 0) {
              setCurrentScreen('LAB');
            } else {
              setCurrentScreen('BRIEF');
            }
          }}
          onStartNew={handleStartNewExperiment}
          onLearnConcept={() => setCurrentScreen('LEARN_CONCEPT')}
          onEquipmentGuide={() => setCurrentScreen('EQUIPMENT_GUIDE')}
          onViewLastReport={() => {
            if (lastReport) {
              setProfile(lastReport.student);
              setMode(lastReport.mode);
              setTrials(lastReport.trials);
              setCalculatedConcentration(lastReport.calculatedConcentration);
              setEvaluation(lastReport.scores);
              setCurrentScreen('FINAL_REPORT');
            }
          }}
        />
      )}

      {/* 2. LEARN CONCEPT VIEW */}
      {currentScreen === 'LEARN_CONCEPT' && (
        <LearnConceptView
          onBack={() => setCurrentScreen('HOME')}
          onStartLab={handleStartFlow}
        />
      )}

      {/* 3. EQUIPMENT GUIDE VIEW */}
      {currentScreen === 'EQUIPMENT_GUIDE' && (
        <EquipmentGuideView
          onBack={() => setCurrentScreen('HOME')}
          onStartLab={handleStartFlow}
        />
      )}

      {/* 4. EXPERIMENT BRIEF VIEW (Safety checklist bypassed as requested) */}
      {currentScreen === 'BRIEF' && (
        <ExperimentBriefView
          profile={profile}
          mode={mode}
          onStartExperiment={() => setCurrentScreen('LAB')}
          onBack={() => setCurrentScreen('HOME')}
        />
      )}

      {/* 5. LAB WORKSPACE VIEW */}
      {currentScreen === 'LAB' && (
        <LabWorkspace
          profile={profile}
          mode={mode}
          trueAcidConcentration={trueAcidConcentration}
          initialTrials={trials}
          initialTechniqueLog={techniqueLog}
          onTrialsUpdate={(updatedTrials, updatedTechnique) => {
            setTrials(updatedTrials);
            setTechniqueLog(updatedTechnique);
          }}
          onFinishToCalculations={handleFinishLabToCalculations}
          onHome={() => setCurrentScreen('HOME')}
          onNewExperiment={handleStartNewExperiment}
        />
      )}

      {/* 7. CALCULATION WORKSHEET VIEW */}
      {currentScreen === 'CALCULATION' && (
        <CalculationWorksheet
          trials={trials}
          trueAcidConcentration={trueAcidConcentration}
          standardBaseConcentration={STANDARD_BASE_CONCENTRATION}
          sampleVolumeMl={STANDARD_SAMPLE_VOLUME}
          initialAnswers={calculationAnswers}
          onComplete={handleCalculationComplete}
          onContinue={handleCalculationComplete}
          onBackToLab={() => setCurrentScreen('LAB')}
          onBack={() => setCurrentScreen('LAB')}
        />
      )}

      {/* 8. CURVE ANALYSIS VIEW */}
      {currentScreen === 'CURVE_ANALYSIS' && (
        <CurveAnalysisView
          trials={trials}
          trueAcidConcentration={trueAcidConcentration}
          calculatedConcentration={calculatedConcentration}
          onContinue={() => setCurrentScreen('CONCEPT_QUESTIONS')}
          onBack={() => setCurrentScreen('CALCULATION')}
        />
      )}

      {/* 9. CONCEPT QUESTIONS VIEW */}
      {currentScreen === 'CONCEPT_QUESTIONS' && (
        <ConceptQuestionsView
          onComplete={handleConceptQuestionsComplete}
          onBack={() => setCurrentScreen('CURVE_ANALYSIS')}
        />
      )}

      {/* 10. FINAL REPORT VIEW */}
      {currentScreen === 'FINAL_REPORT' && evaluation && (
        <FinalReportView
          profile={profile}
          mode={mode}
          trials={trials}
          evaluation={evaluation}
          onRestart={handleStartNewExperiment}
          onSwitchMode={() => {
            setMode(mode === 'guided' ? 'challenge' : 'guided');
            handleStartNewExperiment();
          }}
          onHome={() => setCurrentScreen('HOME')}
        />
      )}

      {/* MODAL: MODE SELECT */}
      {showModeModal && (
        <ModeSelectModal
          onSelectMode={handleSelectMode}
          onClose={() => setShowModeModal(false)}
        />
      )}

      {/* MODAL: STUDENT PROFILE INPUT */}
      {showProfileModal && (
        <StudentProfileModal
          initialProfile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

