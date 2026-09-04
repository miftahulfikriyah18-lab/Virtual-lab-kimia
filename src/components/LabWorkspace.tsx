import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  BookOpen,
  Volume2,
  VolumeX,
  Home,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Activity,
  ArrowRight,
  HelpCircle,
  Beaker,
  Droplets,
  Calculator
} from 'lucide-react';
import {
  ChemistryState,
  LabMode,
  LabWorkflowStep,
  StopcockRate,
  StudentProfile,
  TechniqueLog,
  TrialData,
  TrialType
} from '../types';
import {
  calculateSolutionChemistry,
  calculateTheoreticalEquivalence,
  formatDecimals,
  STANDARD_BASE_CONCENTRATION
} from '../utils/chemistry';
import { BuretteAssembly } from './apparatus/BuretteAssembly';
import { ErlenmeyerFlaskSvg } from './apparatus/ErlenmeyerFlaskSvg';
import { DigitalPhMeterSvg } from './apparatus/DigitalPhMeterSvg';
import {
  VolumetricPipetteSvg,
  ReagentBottleSvg,
  IndicatorDropperBottleSvg,
  BuretteStandIconSvg
} from './apparatus/PreparationApparatus';
import { TitrationCurve } from './TitrationCurve';
import { MeniscusModal } from './MeniscusModal';
import { NotebookModal } from './NotebookModal';

interface LabWorkspaceProps {
  profile: StudentProfile;
  mode: LabMode;
  trueAcidConcentration: number;
  initialTrials?: TrialData[];
  initialTechniqueLog?: TechniqueLog;
  onTrialsUpdate?: (trials: TrialData[], technique: TechniqueLog) => void;
  onFinishToCalculations: (trials: TrialData[], technique: TechniqueLog) => void;
  onHome: () => void;
  onNewExperiment: () => void;
}

export const LabWorkspace: React.FC<LabWorkspaceProps> = ({
  profile,
  mode,
  trueAcidConcentration,
  initialTrials,
  initialTechniqueLog,
  onTrialsUpdate,
  onFinishToCalculations,
  onHome,
  onNewExperiment
}) => {
  // Current trial type and completed trials
  const [completedTrials, setCompletedTrials] = useState<TrialData[]>(() => initialTrials || []);
  const [currentTrialType, setCurrentTrialType] = useState<TrialType>(() => {
    if (!initialTrials || initialTrials.length === 0) return 'rough';
    if (initialTrials.some((t) => t.type === 'accurate2')) return 'accurate3';
    if (initialTrials.some((t) => t.type === 'accurate1')) return 'accurate2';
    if (initialTrials.some((t) => t.type === 'rough')) return 'accurate1';
    return 'rough';
  });

  const hasPriorTrials = (initialTrials && initialTrials.length > 0);

  // Workflow sub-step
  const [labStep, setLabStep] = useState<LabWorkflowStep>(() =>
    hasPriorTrials ? 'SAMPLE_PIPETTE' : 'BURETTE_MOUNT'
  );

  // Burette & Chemistry state
  const [initialReading, setInitialReading] = useState<number>(0.40);
  const [studentInitialReading, setStudentInitialReading] = useState<number | undefined>(undefined);
  const [deliveredVolume, setDeliveredVolume] = useState<number>(0);
  const [studentFinalReading, setStudentFinalReading] = useState<number | undefined>(undefined);
  const [stopcockRate, setStopcockRate] = useState<StopcockRate>('closed');

  // Real-time chemistry
  const [chemState, setChemState] = useState<ChemistryState>(() =>
    calculateSolutionChemistry(trueAcidConcentration, 0, 0.40)
  );

  // Animation & Physical interaction states
  const [isSwirling, setIsSwirling] = useState<boolean>(false);
  const [swirlCountTrial, setSwirlCountTrial] = useState<number>(0);
  const [pinkCloudIntensity, setPinkCloudIntensity] = useState<number>(0);
  const [hasDropRipple, setHasDropRipple] = useState<boolean>(false);
  const [hasAirBubble, setHasAirBubble] = useState<boolean>(() => !hasPriorTrials);
  const [airBubbleFlushed, setAirBubbleFlushed] = useState<boolean>(() => !!hasPriorTrials);
  const [isBuretteMounted, setIsBuretteMounted] = useState<boolean>(() => !!hasPriorTrials);
  const [indicatorDropsAdded, setIndicatorDropsAdded] = useState<number>(0);
  const [isFlaskOnTile, setIsFlaskOnTile] = useState<boolean>(false);
  const [isHClPipetted, setIsHClPipetted] = useState<boolean>(false);
  const [isHClTransferred, setIsHClTransferred] = useState<boolean>(false);
  const [isBuretteRinsedWater, setIsBuretteRinsedWater] = useState<boolean>(() => !!hasPriorTrials);
  const [isBuretteConditionedNaOH, setIsBuretteConditionedNaOH] = useState<boolean>(() => !!hasPriorTrials);
  const [isBuretteFilled, setIsBuretteFilled] = useState<boolean>(() => !!hasPriorTrials);
  const [showPhMeter, setShowPhMeter] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Curve trajectory points
  const [curvePoints, setCurvePoints] = useState<Array<{ volume: number; pH: number }>>([
    { volume: 0, pH: chemState.pH }
  ]);

  // Technique log
  const [techniqueLog, setTechniqueLog] = useState<TechniqueLog>(() => {
    if (initialTechniqueLog) return initialTechniqueLog;
    return {
      ppeComplete: true,
      buretteMounted: !!hasPriorTrials,
      buretteRinsedWater: !!hasPriorTrials,
      buretteConditionedWithNaOH: !!hasPriorTrials,
      airBubbleChecked: !!hasPriorTrials,
      airBubbleFlushed: !!hasPriorTrials,
      pipetteFillerUsed: true,
      sampleVolumeExact: true,
      indicatorDropCount: 0,
      flaskPlacedOnTile: false,
      flaskSwirlCountTotal: 0,
      titrationSlowedNearEndpoint: false,
      overtitrationObserved: false,
      meniscusReadingAttempts: 0,
      meniscusPrecisionOk: true
    };
  });

  // Modals & Navigation confirmation
  const [showMeniscusModal, setShowMeniscusModal] = useState<boolean>(false);
  const [meniscusModalMode, setMeniscusModalMode] = useState<'initial' | 'final'>('initial');
  const [showNotebook, setShowNotebook] = useState<boolean>(false);
  const [showEarlyStopWarning, setShowEarlyStopWarning] = useState<boolean>(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState<boolean>(false);
  const [showNewExpConfirm, setShowNewExpConfirm] = useState<boolean>(false);

  // Animation frame / timer for fluid delivery
  const lastTimeRef = useRef<number | null>(null);

  // Sound effects generator (Web Audio API synth - zero external URL dependencies)
  const playSound = useCallback((type: 'drop' | 'swirl' | 'click' | 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'swirl') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      }
    } catch {
      // Audio context might be restricted before user interaction
    }
  }, [soundEnabled]);

  // Synchronize chemistry state when delivered volume updates
  useEffect(() => {
    const nextChem = calculateSolutionChemistry(
      trueAcidConcentration,
      deliveredVolume,
      initialReading,
      STANDARD_BASE_CONCENTRATION,
      pinkCloudIntensity
    );
    setChemState(nextChem);

    // Track point in curve if difference is notable
    setCurvePoints((prev) => {
      const last = prev[prev.length - 1];
      if (!last || Math.abs(last.volume - deliveredVolume) >= 0.1 || Math.abs(last.pH - nextChem.pH) >= 0.2) {
        return [...prev, { volume: deliveredVolume, pH: nextChem.pH }];
      }
      return prev;
    });

    // Check stopcock control near endpoint
    const eqVol = calculateTheoreticalEquivalence(trueAcidConcentration);
    if (Math.abs(deliveredVolume - eqVol) < 0.8) {
      if (stopcockRate === 'dropwise' || stopcockRate === 'closed') {
        setTechniqueLog((prev) => ({ ...prev, titrationSlowedNearEndpoint: true }));
      }
    }
  }, [deliveredVolume, initialReading, trueAcidConcentration, pinkCloudIntensity, stopcockRate]);

  // Main Burette Flow Rate Animation Loop
  useEffect(() => {
    let animId: number;

    const tick = (time: number) => {
      if (lastTimeRef.current !== null && stopcockRate !== 'closed') {
        const deltaSec = (time - lastTimeRef.current) / 1000;

        // Flow rate: dropwise (~0.08 mL/s), slow (~0.45 mL/s), fast (~1.25 mL/s)
        let rateMlPerSec = 0;
        if (stopcockRate === 'dropwise') rateMlPerSec = 0.09;
        else if (stopcockRate === 'slow') rateMlPerSec = 0.48;
        else if (stopcockRate === 'fast') rateMlPerSec = 1.35;

        const volumeIncrement = rateMlPerSec * deltaSec;

        setDeliveredVolume((prev) => {
          const next = prev + volumeIncrement;
          if (initialReading + next >= 49.9) {
            setStopcockRate('closed');
            return 49.9 - initialReading;
          }
          return next;
        });

        // Trigger drop ripple and temporary pink cloud
        setHasDropRipple(true);
        if (chemState.pH < 8.2) {
          setPinkCloudIntensity(0.8);
        }
      }

      lastTimeRef.current = time;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [stopcockRate, initialReading, chemState.pH]);

  // Pink cloud decay effect (disperses over time or when swirled)
  useEffect(() => {
    if (pinkCloudIntensity > 0) {
      const decayTimer = setTimeout(() => {
        setPinkCloudIntensity((prev) => Math.max(0, prev - (isSwirling ? 0.35 : 0.12)));
      }, 100);
      return () => clearTimeout(decayTimer);
    }
  }, [pinkCloudIntensity, isSwirling]);

  // Reset Ripple trigger
  useEffect(() => {
    if (hasDropRipple) {
      const t = setTimeout(() => setHasDropRipple(false), 500);
      return () => clearTimeout(t);
    }
  }, [hasDropRipple]);

  // Action: Swirl Flask
  const handleSwirlFlask = () => {
    setIsSwirling(true);
    setSwirlCountTrial((prev) => prev + 1);
    setTechniqueLog((prev) => ({
      ...prev,
      flaskSwirlCountTotal: prev.flaskSwirlCountTotal + 1
    }));
    setPinkCloudIntensity(0); // Swirling instantly mixes temporary pink regions
    playSound('swirl');

    setTimeout(() => {
      setIsSwirling(false);
    }, 1200);
  };

  // Preparation Step Handlers
  const handleMountBurette = () => {
    setIsBuretteMounted(true);
    setLabStep('BURETTE_RINSE_WATER');
    setTechniqueLog((prev) => ({ ...prev, buretteMounted: true }));
    playSound('click');
  };

  const handleRinseWater = () => {
    setIsBuretteRinsedWater(true);
    setLabStep('BURETTE_RINSE_NAOH');
    setTechniqueLog((prev) => ({ ...prev, buretteRinsedWater: true }));
    playSound('click');
  };

  const handleRinseNaOH = () => {
    setIsBuretteConditionedNaOH(true);
    setLabStep('BURETTE_FILL');
    setTechniqueLog((prev) => ({ ...prev, buretteConditionedWithNaOH: true }));
    playSound('click');
  };

  const handleFillBurette = () => {
    // Generate realistic initial reading (0.00 to 1.40 mL in increments of 0.05)
    const randomStart = Number((Math.floor(Math.random() * 28) * 0.05).toFixed(2));
    setInitialReading(randomStart);
    setIsBuretteFilled(true);
    setLabStep('CHECK_AIR_BUBBLE');
    playSound('click');
  };

  const handleFlushBubble = () => {
    setHasAirBubble(false);
    setAirBubbleFlushed(true);
    setLabStep('READ_INITIAL_MENISCUS');
    setTechniqueLog((prev) => ({
      ...prev,
      airBubbleChecked: true,
      airBubbleFlushed: true
    }));
    playSound('success');
  };

  const handleIgnoreBubble = () => {
    setLabStep('READ_INITIAL_MENISCUS');
    setTechniqueLog((prev) => ({
      ...prev,
      airBubbleChecked: true,
      airBubbleFlushed: false
    }));
    playSound('click');
  };

  // Sample Preparation Handlers
  const handlePipetteHCl = () => {
    setIsHClPipetted(true);
    setLabStep('SAMPLE_TRANSFER');
    setTechniqueLog((prev) => ({ ...prev, pipetteFillerUsed: true }));
    playSound('click');
  };

  const handleTransferHCl = () => {
    setIsHClTransferred(true);
    setLabStep('ADD_INDICATOR');
    playSound('click');
  };

  const handleAddIndicatorDrop = () => {
    setIndicatorDropsAdded((prev) => {
      const count = prev + 1;
      setTechniqueLog((t) => ({ ...t, indicatorDropCount: count }));
      return count;
    });
    playSound('drop');
    if (indicatorDropsAdded >= 1) {
      setLabStep('PLACE_FLASK');
    }
  };

  const handlePlaceFlaskOnTile = () => {
    setIsFlaskOnTile(true);
    setLabStep('READY_TITRATE');
    setTechniqueLog((prev) => ({ ...prev, flaskPlacedOnTile: true }));
    playSound('click');
  };

  // Finish current titration trial
  const handleOpenFinalMeniscus = () => {
    setStopcockRate('closed');
    // Check if color changed before stopping
    if (chemState.pH < 8.2 && mode === 'guided' && !showEarlyStopWarning) {
      setShowEarlyStopWarning(true);
      return;
    }
    setMeniscusModalMode('final');
    setShowMeniscusModal(true);
  };

  // Complete and save trial
  const handleSaveTrial = (finalStudentReading: number) => {
    const finalActualReading = Number((initialReading + deliveredVolume).toFixed(2));
    const isOver = chemState.pH > 10.0;
    const isEarly = chemState.pH < 8.2;

    const trialTitle =
      currentTrialType === 'rough'
        ? 'Titrasi Kasar'
        : currentTrialType === 'accurate1'
        ? 'Titrasi Teliti 1'
        : currentTrialType === 'accurate2'
        ? 'Titrasi Teliti 2'
        : 'Titrasi Teliti 3';

    const newTrial: TrialData = {
      id: `trial-${Date.now()}`,
      type: currentTrialType,
      title: trialTitle,
      isRough: currentTrialType === 'rough',
      initialReading,
      studentInitialReading,
      finalReading: finalActualReading,
      studentFinalReading,
      deliveredVolume: Number(deliveredVolume.toFixed(2)),
      pH: chemState.pH,
      indicatorColor: chemState.indicatorColorHex,
      swirlCount: swirlCountTrial,
      airBubblePresent: hasAirBubble,
      bubbleFlushed: airBubbleFlushed,
      overtitration: isOver,
      stoppedEarly: isEarly,
      durationSeconds: 60,
      curvePoints: [...curvePoints]
    };

    const nextTrials = [...completedTrials, newTrial];
    setCompletedTrials(nextTrials);
    onTrialsUpdate?.(nextTrials, techniqueLog);
    playSound('success');

    // Determine next phase
    if (currentTrialType === 'rough') {
      setCurrentTrialType('accurate1');
      resetLabForNextTrial();
    } else if (currentTrialType === 'accurate1') {
      setCurrentTrialType('accurate2');
      resetLabForNextTrial();
    } else if (currentTrialType === 'accurate2') {
      // Check concordance between accurate 1 and accurate 2
      const accurate1 = nextTrials.find((t) => t.type === 'accurate1');
      const diff = Math.abs((accurate1?.deliveredVolume || 0) - newTrial.deliveredVolume);
      if (diff > 0.20) {
        // Offer/proceed to accurate 3
        setCurrentTrialType('accurate3');
        resetLabForNextTrial();
      } else {
        // Ready for calculations
        onFinishToCalculations(nextTrials, techniqueLog);
      }
    } else {
      // Accurate 3 finished
      onFinishToCalculations(nextTrials, techniqueLog);
    }
  };

  // Reset between trials (preserves unknown concentration!)
  const resetLabForNextTrial = () => {
    // Fresh sample HCl
    setIsHClPipetted(false);
    setIsHClTransferred(false);
    setIndicatorDropsAdded(0);
    setIsFlaskOnTile(false);
    setDeliveredVolume(0);
    setStopcockRate('closed');
    setSwirlCountTrial(0);
    setPinkCloudIntensity(0);

    // Initial burette reading for next trial
    const randomStart = Number((Math.floor(Math.random() * 20) * 0.05).toFixed(2));
    setInitialReading(randomStart);
    setStudentInitialReading(undefined);
    setStudentFinalReading(undefined);

    // Reset workflow to sample preparation
    setLabStep('SAMPLE_PIPETTE');
  };

  // Helper step text generator for Guided Mode
  const getStepInstruction = () => {
    switch (labStep) {
      case 'BURETTE_MOUNT':
        return {
          title: 'Pasang Buret pada Statif',
          desc: 'Pasang buret 50 mL ke klem statif laboratorium secara tegak lurus.',
          action: 'Pasang Buret'
        };
      case 'BURETTE_RINSE_WATER':
        return {
          title: 'Bilas Buret dengan Air Suling',
          desc: 'Bilas dinding dalam buret dengan akuades untuk membersihkan sisa pengotor.',
          action: 'Bilas dengan Air Suling'
        };
      case 'BURETTE_RINSE_NAOH':
        return {
          title: 'Kondisikan Buret dengan NaOH',
          desc: 'Bilas buret dengan sedikit larutan titran NaOH standar agar air bilasan tidak mengencerkan titran.',
          action: 'Bilas dengan NaOH'
        };
      case 'BURETTE_FILL':
        return {
          title: 'Isi Buret dengan Larutan NaOH 0.1000 M',
          desc: 'Tuangkan larutan titran NaOH ke dalam buret hingga mendekati garis skala 0 mL.',
          action: 'Isi Buret NaOH'
        };
      case 'CHECK_AIR_BUBBLE':
        return {
          title: 'Periksa Gelembung Udara pada Ujung Buret',
          desc: 'Perhatikan ujung buret di bawah kran. Apakah masih terdapat kantung gelembung udara?',
          action: null
        };
      case 'READ_INITIAL_MENISCUS':
        return {
          title: 'Baca Volume Awal Buret (V₀)',
          desc: 'Sejajarkan pandangan mata dan baca posisi dasar cekungan meniskus larutan.',
          action: 'Baca Meniskus Awal'
        };
      case 'SAMPLE_PIPETTE':
        return {
          title: 'Pipet 25.00 mL Sampel HCl',
          desc: 'Gunakan pipet volumetrik 25 mL dan rubber filler untuk menyedot sampel analit HCl hingga garis batas.',
          action: 'Pipet Sampel HCl'
        };
      case 'SAMPLE_TRANSFER':
        return {
          title: 'Pindahkan HCl ke Labu Erlenmeyer',
          desc: 'Sentuhkan ujung pipet ke dinding Erlenmeyer dan alirkan seluruh 25.00 mL sampel analit.',
          action: 'Pindahkan ke Erlenmeyer'
        };
      case 'ADD_INDICATOR':
        return {
          title: 'Tambahkan Indikator Fenolftalein (PP)',
          desc: 'Teteskan 2–3 tetes indikator fenolftalein ke dalam Erlenmeyer.',
          action: 'Teteskan Fenolftalein'
        };
      case 'PLACE_FLASK':
        return {
          title: 'Letakkan Erlenmeyer di Atas Pelat Putih',
          desc: 'Posisikan Erlenmeyer tepat di bawah ujung buret di atas alas porselen putih.',
          action: 'Letakkan di Alas Putih'
        };
      case 'READY_TITRATE':
      case 'TITRATING':
      case 'TITRATION_PAUSED':
        return {
          title: currentTrialType === 'rough' ? 'Lakukan Titrasi Kasar' : 'Lakukan Titrasi Teliti',
          desc:
            chemState.pH < 8.2
              ? 'Buka kran stopcock untuk meneteskan NaOH. Putar Erlenmeyer secara berkala dan perhatikan perubahan warna.'
              : chemState.pH <= 9.2
              ? 'Warna merah muda pucat telah muncul dan bertahan! Titik akhir telah tercapai. Tutup kran dan catat volume akhir.'
              : 'Warna larutan menjadi merah muda pekat (overtitrasi). Tutup kran dan lakukan pembacaan meniskus akhir.',
          action: null
        };
      default:
        return { title: 'Titrasi', desc: '', action: null };
    }
  };

  const instruction = getStepInstruction();

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1D1D1B] flex flex-col select-none relative overflow-hidden">
      {/* --- TOP BAR (64px) --- */}
      <header className="h-16 px-4 md:px-6 bg-white border-b border-[#1D1D1B]/20 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1D1D1B] text-[#F9F7F2] flex items-center justify-center border border-[#1D1D1B]">
            <FlaskConical className="w-4 h-4 text-[#C4A484]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#1D1D1B] tracking-tight">V-LAB KIMIA</span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 border uppercase tracking-wider ${
                  mode === 'guided'
                    ? 'bg-[#F4EFE6] text-[#1D1D1B] border-[#1D1D1B]'
                    : 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                }`}
              >
                {mode === 'guided' ? 'Terbimbing' : 'Tantangan'}
              </span>
            </div>
            <p className="text-[10px] text-[#1D1D1B]/60 font-serif italic hidden sm:block">
              Titrasi Volumetri HCl 25.00 mL vs NaOH 0.1000 M
            </p>
          </div>
        </div>

        {/* Current Trial Stage Badge */}
        <div className="flex items-center gap-2 bg-[#F9F7F2] px-3 py-1.5 border border-[#1D1D1B]/20">
          <span className="w-2 h-2 rounded-full bg-[#C4A484] animate-pulse" />
          <span className="text-xs font-serif font-bold text-[#1D1D1B]">
            {currentTrialType === 'rough'
              ? 'Titrasi Kasar'
              : currentTrialType === 'accurate1'
              ? 'Titrasi Teliti 1'
              : currentTrialType === 'accurate2'
              ? 'Titrasi Teliti 2'
              : 'Titrasi Teliti 3'}
          </span>
          <span className="text-[#1D1D1B]/30 text-xs">|</span>
          <span className="text-[10px] font-mono font-bold text-[#1D1D1B]/70" title="Tersimpan otomatis">
            Selesai: {completedTrials.length}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 hidden sm:inline-flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Tersimpan
          </span>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Proceed to Calculations if at least 1 accurate trial is recorded */}
          {completedTrials.some((t) => !t.isRough) && (
            <button
              onClick={() => onFinishToCalculations(completedTrials, techniqueLog)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.15em] transition cursor-pointer"
              title="Lanjutkan ke Lembar Hitung Kadar HCl"
            >
              <Calculator className="w-3.5 h-3.5 text-[#C4A484]" />
              <span className="hidden sm:inline">Hitung Kadar →</span>
            </button>
          )}

          {/* Notebook shortcut */}
          <button
            onClick={() => setShowNotebook(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4EFE6] text-[10px] font-bold uppercase tracking-[0.15em] text-[#1D1D1B] border border-[#1D1D1B]/25 transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C4A484]" />
            <span className="hidden md:inline">Catatan Praktikum</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-[#1D1D1B]/70 hover:text-[#1D1D1B] bg-white hover:bg-[#F4EFE6] border border-[#1D1D1B]/25 transition cursor-pointer"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* New Experiment */}
          <button
            onClick={() => {
              if (completedTrials.length > 0) {
                setShowNewExpConfirm(true);
              } else {
                onNewExperiment();
              }
            }}
            className="p-2 text-[#1D1D1B]/70 hover:text-[#1D1D1B] bg-white hover:bg-[#F4EFE6] border border-[#1D1D1B]/25 transition cursor-pointer"
            title="Eksperimen Baru (Sampel Misteri Baru)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Home */}
          <button
            onClick={() => {
              if (completedTrials.length > 0) {
                setShowHomeConfirm(true);
              } else {
                onHome();
              }
            }}
            className="p-2 text-[#1D1D1B]/70 hover:text-[#1D1D1B] bg-white hover:bg-[#F4EFE6] border border-[#1D1D1B]/25 transition cursor-pointer"
            title="Kembali ke Beranda"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --- MAIN LABORATORY INTERACTION BODY --- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* === LEFT: EQUIPMENT & REAGENT SHELF (20%) === */}
        <aside className="w-full lg:w-64 bg-white border-r border-[#1D1D1B]/20 p-3.5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1D1D1B]/15 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]">
                Rak Alat & Reagen
              </span>
              <span className="text-[10px] text-[#C4A484] font-serif italic">Baku Mutu</span>
            </div>

            <div className="space-y-2.5">
              {/* Burette & Statif Apparatus Card */}
              <div
                onClick={() => {
                  if (labStep === 'BURETTE_MOUNT') handleMountBurette();
                }}
                className={`p-2.5 border flex items-center gap-3 transition cursor-pointer ${
                  labStep === 'BURETTE_MOUNT'
                    ? 'border-[#1D1D1B] bg-[#F4EFE6] ring-1 ring-[#1D1D1B] animate-pulse'
                    : 'border-[#1D1D1B]/15 bg-[#F9F7F2] hover:border-[#1D1D1B]/40'
                }`}
              >
                <BuretteStandIconSvg isMounted={isBuretteMounted} />
                <div className="text-xs">
                  <div className="font-serif font-bold text-[#1D1D1B]">Buret 50 mL & Statif</div>
                  <div className="text-[10px] font-serif italic text-[#1D1D1B]/60">
                    {isBuretteMounted ? 'Terpasang pada Klem Statif' : 'Belum Terpasang (Klik Pasang)'}
                  </div>
                  {isBuretteMounted ? (
                    <span className="text-[10px] text-[#1D1D1B] font-bold block mt-0.5">
                      ✓ Terpasang pada Statif
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#C4A484] font-bold block mt-0.5">
                      ➔ Klik untuk Pasang
                    </span>
                  )}
                </div>
              </div>

              {/* HCl Reagent Bottle */}
              <div
                onClick={() => {
                  if (labStep === 'SAMPLE_PIPETTE') handlePipetteHCl();
                }}
                className={`p-2.5 border flex items-center gap-3 transition cursor-pointer ${
                  labStep === 'SAMPLE_PIPETTE'
                    ? 'border-[#1D1D1B] bg-[#F4EFE6] ring-1 ring-[#1D1D1B]'
                    : 'border-[#1D1D1B]/15 bg-[#F9F7F2] hover:border-[#1D1D1B]/40'
                }`}
              >
                <ReagentBottleSvg label="HCl" sublabel="Sampel" badge="Analit" />
                <div className="text-xs">
                  <div className="font-serif font-bold text-[#1D1D1B]">Sampel HCl</div>
                  <div className="text-[10px] font-serif italic text-[#1D1D1B]/60">Konsentrasi: ??? M</div>
                  {isHClPipetted && (
                    <span className="text-[10px] text-[#1D1D1B] font-bold block mt-0.5">
                      ✓ 25.00 mL Terpipet
                    </span>
                  )}
                </div>
              </div>

              {/* NaOH Standard Titrant */}
              <div
                onClick={() => {
                  if (labStep === 'BURETTE_FILL') handleFillBurette();
                  else if (labStep === 'BURETTE_RINSE_NAOH') handleRinseNaOH();
                }}
                className={`p-2.5 border flex items-center gap-3 transition cursor-pointer ${
                  labStep === 'BURETTE_FILL' || labStep === 'BURETTE_RINSE_NAOH'
                    ? 'border-[#1D1D1B] bg-[#F4EFE6] ring-1 ring-[#1D1D1B]'
                    : 'border-[#1D1D1B]/15 bg-[#F9F7F2] hover:border-[#1D1D1B]/40'
                }`}
              >
                <ReagentBottleSvg label="NaOH" sublabel="0.1000 M" badge="Titran" />
                <div className="text-xs">
                  <div className="font-serif font-bold text-[#1D1D1B]">NaOH Standar</div>
                  <div className="text-[10px] text-[#1D1D1B]/70 font-mono">0.1000 mol/L</div>
                  {isBuretteFilled && (
                    <span className="text-[10px] text-[#1D1D1B] font-bold block mt-0.5">
                      ✓ Terisi ke Buret
                    </span>
                  )}
                </div>
              </div>

              {/* Phenolphthalein Dropper */}
              <div
                onClick={() => {
                  if (labStep === 'ADD_INDICATOR') handleAddIndicatorDrop();
                }}
                className={`p-2.5 border flex items-center gap-3 transition cursor-pointer ${
                  labStep === 'ADD_INDICATOR'
                    ? 'border-[#1D1D1B] bg-[#F4EFE6] ring-1 ring-[#1D1D1B]'
                    : 'border-[#1D1D1B]/15 bg-[#F9F7F2] hover:border-[#1D1D1B]/40'
                }`}
              >
                <IndicatorDropperBottleSvg dropsAdded={indicatorDropsAdded} />
                <div className="text-xs">
                  <div className="font-serif font-bold text-[#1D1D1B]">Indikator PP 1%</div>
                  <div className="text-[10px] text-[#1D1D1B]/70 font-serif italic">Fenolftalein</div>
                  <span className="text-[10px] text-[#1D1D1B]/70 block mt-0.5">
                    Ditambahkan: <strong className="text-[#1D1D1B] font-mono">{indicatorDropsAdded} tetes</strong>
                  </span>
                </div>
              </div>

              {/* Volumetric Pipette 25 mL */}
              <div
                onClick={() => {
                  if (labStep === 'SAMPLE_PIPETTE') handlePipetteHCl();
                  else if (labStep === 'SAMPLE_TRANSFER') handleTransferHCl();
                }}
                className={`p-2.5 border flex items-center gap-3 transition cursor-pointer ${
                  labStep === 'SAMPLE_PIPETTE' || labStep === 'SAMPLE_TRANSFER'
                    ? 'border-[#1D1D1B] bg-[#F4EFE6] ring-1 ring-[#1D1D1B]'
                    : 'border-[#1D1D1B]/15 bg-[#F9F7F2] hover:border-[#1D1D1B]/40'
                }`}
              >
                <VolumetricPipetteSvg isFilled={isHClPipetted && !isHClTransferred} hasFiller={true} />
                <div className="text-xs">
                  <div className="font-serif font-bold text-[#1D1D1B]">Pipet Volumetrik</div>
                  <div className="text-[10px] text-[#1D1D1B]/60 font-serif">25.00 mL + Filler</div>
                  {isHClTransferred && (
                    <span className="text-[10px] text-[#1D1D1B] font-bold block mt-0.5">
                      ✓ Sampel di Erlenmeyer
                    </span>
                  )}
                </div>
              </div>

              {/* pH Meter Toggle */}
              <div className="pt-2.5 border-t border-[#1D1D1B]/15 flex items-center justify-between text-xs text-[#1D1D1B] px-1">
                <span className="font-serif">pH Meter Digital:</span>
                <button
                  onClick={() => setShowPhMeter(!showPhMeter)}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                    showPhMeter
                      ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                      : 'bg-white text-[#1D1D1B]/60 border-[#1D1D1B]/30'
                  }`}
                >
                  {showPhMeter ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F9F7F2] border border-[#1D1D1B]/15 text-[11px] text-[#1D1D1B]/70 font-serif leading-relaxed mt-4">
            <span className="text-[#1D1D1B] font-bold block mb-0.5 uppercase tracking-wider text-[9px]">Instruksi Meja:</span>
            Peralatan dengan penanda aktif menunjukkan tindakan prosedur volumetri berikutnya.
          </div>
        </aside>

        {/* === CENTER: MAIN LABORATORY BENCH (58% - LARGEST AREA) === */}
        <main className="flex-1 flex flex-col bg-[#F4EFE6] relative overflow-hidden">
          {/* Subtle laboratory bench backdrop with monograph clean styling */}
          <div className="absolute inset-0 bg-[#F4EFE6] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#EAE4D7] to-transparent pointer-events-none border-b-8 border-[#1D1D1B]/25" />

          {/* Central Glassware Stage */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 relative z-10 overflow-y-auto">
            {/* Top Prompt Banner when buret is not mounted yet */}
            {!isBuretteMounted && (
              <div className="mb-3 px-4 py-2.5 bg-white border border-[#1D1D1B] shadow-sm flex items-center justify-between gap-3 max-w-xl w-full animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C4A484] animate-ping" />
                  <span className="text-xs font-serif text-[#1D1D1B]">
                    <strong>Instruksi Praktikum:</strong> Buret belum terpasang pada statif. Pasang buret ke klem statif laboratorium sebelum memulai pengisian.
                  </span>
                </div>
                <button
                  onClick={handleMountBurette}
                  className="px-3.5 py-1.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-wider transition cursor-pointer shrink-0"
                >
                  Pasang Buret
                </button>
              </div>
            )}

            <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 max-w-2xl w-full">
              {/* Main Burette & Stand Assembly with Erlenmeyer Directly Underneath */}
              <div className="relative w-full max-w-sm flex flex-col items-center">
                <BuretteAssembly
                  currentReading={chemState.currentReading}
                  stopcockState={stopcockRate}
                  isDropping={stopcockRate !== 'closed'}
                  hasAirBubble={hasAirBubble}
                  isMounted={isBuretteMounted}
                  onMountBurette={handleMountBurette}
                  onStopcockChange={(rate) => {
                    if (labStep !== 'READY_TITRATE' && labStep !== 'TITRATING' && labStep !== 'TITRATION_PAUSED') {
                      return;
                    }
                    setStopcockRate(rate);
                    if (rate !== 'closed') {
                      setLabStep('TITRATING');
                      playSound('drop');
                    }
                  }}
                  interactiveStopcock={
                    isBuretteMounted && (labStep === 'READY_TITRATE' || labStep === 'TITRATING' || labStep === 'TITRATION_PAUSED')
                  }
                  flaskProps={{
                    isPlaced: isFlaskOnTile,
                    deliveredVolumeMl: deliveredVolume,
                    pH: chemState.pH,
                    indicatorColorHex: chemState.indicatorColorHex,
                    indicatorAlpha: chemState.indicatorAlpha,
                    isSwirling: isSwirling,
                    pinkCloudIntensity: pinkCloudIntensity,
                    hasDropRipple: hasDropRipple,
                    onPlaceFlask: handlePlaceFlaskOnTile,
                    isPlaceActive: labStep === 'PLACE_FLASK',
                    showPhMeter: showPhMeter
                  }}
                />

                {/* Air Bubble Warning prompt in Guided Mode */}
                {labStep === 'CHECK_AIR_BUBBLE' && (
                  <div className="absolute top-72 bg-white border border-[#1D1D1B] p-3.5 shadow-xl z-30 w-64 text-center animate-fadeIn">
                    <p className="text-xs font-serif font-bold text-[#1D1D1B] mb-2.5">
                      Apakah ada gelembung udara pada ujung buret?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleFlushBubble}
                        className="flex-1 py-1.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        Keluarkan Gelembung
                      </button>
                      <button
                        onClick={handleIgnoreBubble}
                        className="flex-1 py-1.5 bg-white hover:bg-[#F4EFE6] text-[#1D1D1B] text-[10px] font-bold uppercase tracking-wider border border-[#1D1D1B]/30 transition cursor-pointer"
                      >
                        Abaikan
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Preparation Side Station: Visible when flask is being prepared before being placed on the tile under the burette */}
              {!isFlaskOnTile && (
                <div className="w-56 p-3 bg-white border border-[#1D1D1B]/20 shadow-sm flex flex-col items-center text-center animate-fadeIn shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C4A484] mb-1">
                    Meja Preparasi Sampel
                  </span>
                  <h5 className="font-serif font-bold text-xs text-[#1D1D1B] mb-2">
                    Labu Erlenmeyer 250 mL
                  </h5>

                  <div className="w-28 h-36 flex items-center justify-center my-1">
                    <ErlenmeyerFlaskSvg
                      deliveredVolumeMl={0}
                      pH={chemState.pH}
                      indicatorColorHex={chemState.indicatorColorHex}
                      indicatorAlpha={indicatorDropsAdded > 0 ? 0.08 : 0}
                      isSwirling={false}
                    />
                  </div>

                  <div className="text-[10px] font-serif text-[#1D1D1B]/70 space-y-1 mb-2">
                    <div>
                      Sampel HCl:{' '}
                      <strong className="text-[#1D1D1B]">
                        {isHClTransferred ? '25.00 mL' : isHClPipetted ? 'Terpipet' : '0 mL'}
                      </strong>
                    </div>
                    <div>
                      Indikator PP:{' '}
                      <strong className="text-[#1D1D1B]">{indicatorDropsAdded} tetes</strong>
                    </div>
                  </div>

                  {labStep === 'PLACE_FLASK' ? (
                    <button
                      onClick={handlePlaceFlaskOnTile}
                      className="w-full py-2 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[9px] font-bold uppercase tracking-widest transition flex items-center justify-center gap-1 cursor-pointer animate-pulse"
                    >
                      <span>Letakkan di Bawah Buret</span>
                      <ArrowRight className="w-3 h-3 text-[#C4A484]" />
                    </button>
                  ) : (
                    <span className="text-[9px] text-[#1D1D1B]/50 italic">
                      {labStep === 'SAMPLE_PIPETTE'
                        ? 'Pipet sampel HCl dari botol reagen'
                        : labStep === 'SAMPLE_TRANSFER'
                        ? 'Pindahkan 25.00 mL HCl ke Erlenmeyer'
                        : 'Tambahkan 2–3 tetes fenolftalein'}
                    </span>
                  )}
                </div>
              )}

              {/* Submerged Digital pH Meter Probe (when enabled and flask is on tile) */}
              {showPhMeter && isFlaskOnTile && (
                <div className="hidden xl:block absolute top-24 right-4">
                  <DigitalPhMeterSvg pH={chemState.pH} visible={showPhMeter} />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Interactive Control Console */}
          <div className="p-3.5 bg-white border-t border-[#1D1D1B]/20 flex flex-wrap items-center justify-between gap-3 relative z-20">
            {/* Swirling Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwirlFlask}
                disabled={!isFlaskOnTile}
                className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition cursor-pointer ${
                  isFlaskOnTile
                    ? 'bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2]'
                    : 'bg-[#F4EFE6] text-[#1D1D1B]/30 cursor-not-allowed border border-[#1D1D1B]/15'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${isSwirling ? 'animate-spin' : ''}`} />
                <span>PUTAR ERLENMEYER</span>
              </button>

              <button
                onClick={() => {
                  setMeniscusModalMode('final');
                  setShowMeniscusModal(true);
                }}
                className="px-3.5 py-2.5 bg-white hover:bg-[#F4EFE6] text-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#1D1D1B] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C4A484]" />
                <span>BACA MENISKUS</span>
              </button>
            </div>

            {/* Stopcock Speed Controls */}
            {(labStep === 'READY_TITRATE' || labStep === 'TITRATING' || labStep === 'TITRATION_PAUSED') && (
              <div className="flex items-center gap-1.5 bg-[#F9F7F2] p-1.5 border border-[#1D1D1B]/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/70 px-2 font-serif">Kran Buret:</span>
                <button
                  onClick={() => {
                    setStopcockRate('closed');
                    playSound('click');
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    stopcockRate === 'closed'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B] hover:bg-white'
                  }`}
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setStopcockRate('dropwise');
                    setLabStep('TITRATING');
                    playSound('drop');
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    stopcockRate === 'dropwise'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B] hover:bg-white'
                  }`}
                >
                  Tetes demi Tetes
                </button>
                <button
                  onClick={() => {
                    setStopcockRate('slow');
                    setLabStep('TITRATING');
                    playSound('drop');
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    stopcockRate === 'slow'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B] hover:bg-white'
                  }`}
                >
                  Lambat
                </button>
                <button
                  onClick={() => {
                    setStopcockRate('fast');
                    setLabStep('TITRATING');
                    playSound('drop');
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    stopcockRate === 'fast'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B] hover:bg-white'
                  }`}
                >
                  Cepat
                </button>
              </div>
            )}

            {/* Finish Trial Button */}
            {(labStep === 'READY_TITRATE' || labStep === 'TITRATING' || labStep === 'TITRATION_PAUSED') && (
              <button
                onClick={handleOpenFinalMeniscus}
                className="px-4 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484]" />
                <span>Akhiri Titrasi & Catat Data</span>
              </button>
            )}
          </div>
        </main>

        {/* === RIGHT: REAL-TIME DATA & INSTRUCTION PANEL (22%) === */}
        <aside className="w-full lg:w-80 bg-white border-l border-[#1D1D1B]/20 p-4 flex flex-col justify-between shrink-0 overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* Step Guidance Card */}
            <div className="p-3.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#1D1D1B] uppercase tracking-[0.2em] mb-1.5 font-serif">
                <span>Panduan Prosedur</span>
                <span className="font-mono text-[#1D1D1B]/60">
                  {labStep === 'BURETTE_MOUNT'
                    ? '1/9'
                    : labStep === 'BURETTE_RINSE_WATER'
                    ? '2/9'
                    : labStep === 'BURETTE_RINSE_NAOH'
                    ? '3/9'
                    : labStep === 'BURETTE_FILL'
                    ? '4/9'
                    : labStep === 'CHECK_AIR_BUBBLE'
                    ? '5/9'
                    : labStep === 'READ_INITIAL_MENISCUS'
                    ? '6/9'
                    : labStep === 'SAMPLE_PIPETTE'
                    ? '7/9'
                    : labStep === 'ADD_INDICATOR'
                    ? '8/9'
                    : '9/9'}
                </span>
              </div>
              <h4 className="text-sm font-serif font-bold text-[#1D1D1B] mb-1">{instruction.title}</h4>
              <p className="text-xs font-serif text-[#1D1D1B]/80 leading-relaxed mb-3">{instruction.desc}</p>

              {instruction.action && (
                <button
                  onClick={() => {
                    if (labStep === 'BURETTE_MOUNT') handleMountBurette();
                    else if (labStep === 'BURETTE_RINSE_WATER') handleRinseWater();
                    else if (labStep === 'BURETTE_RINSE_NAOH') handleRinseNaOH();
                    else if (labStep === 'BURETTE_FILL') handleFillBurette();
                    else if (labStep === 'READ_INITIAL_MENISCUS') {
                      setMeniscusModalMode('initial');
                      setShowMeniscusModal(true);
                    } else if (labStep === 'SAMPLE_PIPETTE') handlePipetteHCl();
                    else if (labStep === 'SAMPLE_TRANSFER') handleTransferHCl();
                    else if (labStep === 'ADD_INDICATOR') handleAddIndicatorDrop();
                    else if (labStep === 'PLACE_FLASK') handlePlaceFlaskOnTile();
                  }}
                  className="w-full py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{instruction.action}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C4A484]" />
                </button>
              )}
            </div>

            {/* Real-time Laboratory Measurement Readouts */}
            <div className="p-3.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 space-y-3 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B] block pb-1 border-b border-[#1D1D1B]/15">
                Data Pembacaan Real-Time
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white border border-[#1D1D1B]/15">
                  <span className="text-[9px] text-[#1D1D1B]/60 block font-serif uppercase tracking-wider">Volume Awal (V₀):</span>
                  <strong className="text-[#1D1D1B] font-mono text-sm font-bold">
                    {formatDecimals(initialReading, 2)} mL
                  </strong>
                </div>

                <div className="p-2 bg-white border border-[#1D1D1B]/15">
                  <span className="text-[9px] text-[#1D1D1B]/60 block font-serif uppercase tracking-wider">Buret Saat Ini:</span>
                  <strong className="text-[#1D1D1B] font-mono text-sm font-bold">
                    {formatDecimals(chemState.currentReading, 2)} mL
                  </strong>
                </div>
              </div>

              <div className="p-2.5 bg-[#F4EFE6] border border-[#1D1D1B] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#1D1D1B] font-bold uppercase tracking-wider block font-serif">Volume NaOH Terpakai:</span>
                  <div className="text-base font-black text-[#1D1D1B] font-mono">
                    {formatDecimals(deliveredVolume, 2)} mL
                  </div>
                </div>
                <Droplets className="w-5 h-5 text-[#C4A484]" />
              </div>

              {/* pH Measurement */}
              <div className="p-2.5 bg-white border border-[#1D1D1B]/20 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#1D1D1B]/70 font-bold uppercase tracking-wider block font-serif">Derajat Keasaman (pH):</span>
                  <div className="text-base font-black text-[#1D1D1B] font-mono">
                    {chemState.pH.toFixed(2)}
                  </div>
                </div>
                <div
                  className="w-4 h-4 rounded-full border border-[#1D1D1B]/40"
                  style={{
                    backgroundColor:
                      chemState.indicatorAlpha > 0 ? chemState.indicatorColorHex : 'transparent',
                    opacity: chemState.indicatorAlpha > 0 ? chemState.indicatorAlpha : 1
                  }}
                  title="Warna Indikator Fenolftalein"
                />
              </div>
            </div>

            {/* Mini Titration Curve */}
            <div>
              <div className="flex items-center justify-between pb-1.5 text-[10px] text-[#1D1D1B] font-bold uppercase tracking-[0.2em] font-serif">
                <span>Kurva Titrasi Langsung</span>
                <span className="text-[10px] text-[#C4A484] font-mono">pH vs V(NaOH)</span>
              </div>
              <TitrationCurve
                points={curvePoints}
                currentVolume={deliveredVolume}
                currentPh={chemState.pH}
                isEquivalenceRevealed={false}
                compact={true}
              />
            </div>
          </div>

          {/* Next Phase Action Button */}
          {completedTrials.filter((t) => !t.isRough).length >= 2 && (
            <button
              onClick={() => onFinishToCalculations(completedTrials, techniqueLog)}
              className="w-full py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#1D1D1B] shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Lanjut ke Perhitungan Konsentrasi</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C4A484]" />
            </button>
          )}
        </aside>
      </div>

      {/* --- MENISCUS MODAL --- */}
      {showMeniscusModal && (
        <MeniscusModal
          actualReading={
            meniscusModalMode === 'initial'
              ? initialReading
              : Number((initialReading + deliveredVolume).toFixed(2))
          }
          title={
            meniscusModalMode === 'initial'
              ? 'Baca Meniskus Awal Buret (V₀)'
              : 'Baca Meniskus Akhir Buret (V₁)'
          }
          mode={mode}
          onConfirm={(val, isAccurate) => {
            if (meniscusModalMode === 'initial') {
              setStudentInitialReading(val);
              setLabStep('SAMPLE_PIPETTE');
            } else {
              setStudentFinalReading(val);
              handleSaveTrial(val);
            }
            setTechniqueLog((prev) => ({
              ...prev,
              meniscusPrecisionOk: prev.meniscusPrecisionOk && isAccurate
            }));
            setShowMeniscusModal(false);
          }}
          onClose={() => setShowMeniscusModal(false)}
        />
      )}

      {/* --- NOTEBOOK MODAL --- */}
      {showNotebook && (
        <NotebookModal
          trials={completedTrials}
          onClose={() => setShowNotebook(false)}
          onProceedToCalculations={() => {
            setShowNotebook(false);
            onFinishToCalculations(completedTrials, techniqueLog);
          }}
        />
      )}

      {/* --- CONFIRM BACK TO HOME MODAL --- */}
      {showHomeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#F9F7F2] border border-[#1D1D1B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-[#C4A484] shrink-0" />
              <h3 className="font-serif font-bold text-base text-[#1D1D1B]">Kembali ke Beranda?</h3>
            </div>
            <p className="text-xs font-serif text-[#1D1D1B]/85 leading-relaxed">
              Catatan praktikum Anda ({completedTrials.length} percobaan tercatat) telah <strong>tersimpan otomatis</strong> di perangkat ini. Anda dapat melanjutkannya kapan saja melalui tombol &ldquo;Lanjutkan Praktikum Terakhir&rdquo; di Beranda.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHomeConfirm(false)}
                className="px-4 py-2 bg-white hover:bg-[#F4EFE6] text-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.15em] border border-[#1D1D1B]/30 transition cursor-pointer"
              >
                Tetap di Meja Lab
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHomeConfirm(false);
                  onHome();
                }}
                className="px-4 py-2 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.15em] transition cursor-pointer"
              >
                Ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM NEW EXPERIMENT MODAL --- */}
      {showNewExpConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#F9F7F2] border border-[#1D1D1B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-[#C4A484] shrink-0" />
              <h3 className="font-serif font-bold text-base text-[#1D1D1B]">Mulai Praktikum Baru?</h3>
            </div>
            <p className="text-xs font-serif text-[#1D1D1B]/85 leading-relaxed">
              Memulai praktikum baru akan mengosongkan catatan meja laboratorium dan mengocok sampel misteri baru. Apakah Anda yakin ingin memulai dari awal?
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowNewExpConfirm(false)}
                className="px-4 py-2 bg-white hover:bg-[#F4EFE6] text-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.15em] border border-[#1D1D1B]/30 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewExpConfirm(false);
                  onNewExperiment();
                }}
                className="px-4 py-2 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.15em] transition cursor-pointer"
              >
                Ya, Mulai Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EARLY STOP WARNING MODAL --- */}
      {showEarlyStopWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#F9F7F2] border border-[#1D1D1B] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#1D1D1B] mb-3">
              <AlertTriangle className="w-5 h-5 text-[#C4A484] shrink-0" />
              <h3 className="font-serif font-bold text-base text-[#1D1D1B]">Warna Indikator Belum Berubah!</h3>
            </div>
            <p className="text-xs font-serif text-[#1D1D1B]/80 leading-relaxed mb-4">
              Larutan di dalam Erlenmeyer masih tampak bening tak berwarna (pH {chemState.pH.toFixed(2)} &lt; 8.2). Titik akhir titrasi belum tercapai. Apakah Anda yakin ingin mengakhiri titrasi sebelum titik akhir?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEarlyStopWarning(false)}
                className="flex-1 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition cursor-pointer"
              >
                Lanjutkan Titrasi
              </button>
              <button
                onClick={() => {
                  setShowEarlyStopWarning(false);
                  setMeniscusModalMode('final');
                  setShowMeniscusModal(true);
                }}
                className="px-3 py-2.5 bg-white hover:bg-[#F4EFE6] text-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#1D1D1B] transition cursor-pointer"
              >
                Akhiri Tetap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
