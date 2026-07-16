import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { subscribeToSyncEvents } from '../lib/sync';
import { getSavedQuestions } from '../lib/questions';
import { 
  playCorrect, 
  playTick, 
  playTimeout, 
  playTransition, 
  playVictory, 
  playAmbientHum, 
  stopAmbientHum,
  playHoverTick,
  playBackCancel
} from '../lib/audio';
import ConsoleTimer from '../components/ConsoleTimer';
import ConsoleBackground from '../components/ConsoleBackground';
import { Play, Pause, RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight, Sparkles, Home, Award, Maximize2 } from 'lucide-react';
import ExperimentRound from '../components/ExperimentRound';

export default function PresenterPage({ navigateTo }) {
  const getTimeForQuestion = (q) => {
    if (!q) return 60;
    if (Number(q.round) === 5) return 120;
    return Number(q.timeLimit) > 0 ? Number(q.timeLimit) : 60;
  };

  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Active Round coordinates
  const [activeRound, setActiveRound] = useState(1);

  // Navigation sequences
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const [showBoot, setShowBoot] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(15);
  const [maxTime, setMaxTime] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Screen transition states
  const [wipeActive, setWipeActive] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Continuous animation frame time
  const [animationTime, setAnimationTime] = useState(0);

  // Scrolling computer logs state
  const [consoleLogs, setConsoleLogs] = useState([
    "[SYS] INITIATING DECRYPTION ENGINE...",
    "[OK] SYNC_MATRIX_CONNECTED",
    "[SYS] READY_FOR_DECODE"
  ]);

  // Backstage explorer profile stats (synced via localStorage)
  const [explorerName, setExplorerName] = useState("Astro Ranger");
  const [explorerLevel, setExplorerLevel] = useState("Lvl 01");
  const [explorerXP, setExplorerXP] = useState("1,200 XP");

  // Refs
  const timerRef = useRef(null);
  const logCounter = useRef(0);
  const videoRef = useRef(null);

  // State refs to completely eliminate stale closures in sync event listeners
  const currentIdxRef = useRef(currentIdx);
  const activeRoundRef = useRef(activeRound);
  const questionsRef = useRef(questions);

  useEffect(() => {
    currentIdxRef.current = currentIdx;
  }, [currentIdx]);

  useEffect(() => {
    activeRoundRef.current = activeRound;
  }, [activeRound]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // Force play background video on index shift to bypass browser autoplay blocks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay blocked/failed. User gesture required:", err);
        });
      }
    }
  }, [currentIdx, questions]);

  // Diagnostic logs
  const diagnosticLogs = [
    "[OK] COGNITIVE_GRID_ACTIVE",
    "[SYS] SOLUBILITY_FACTOR_CALC",
    "[SYS] LATENT_HEAT_DECRYPTED",
    "[SYS] GRAVITATIONAL_WAVE_LOCK",
    "[OK] SYNC_MATRIX_TRUE",
    "[OK] THEME_PROJECTION_LOADED",
    "[OK] ST_JUDE_CORE_SECURE",
    "[OK] DECRYPTION_PIPELINE_STABLE",
    "[SYS] ENTROPY_VAL=0.045_J/K",
    "[SYS] CALCULATION_ENGINE_NOMINAL",
    "[OK] LATTICE_DENSITY_STABLE",
    "[SYS] PRESSURE_COEFF=0.998"
  ];

  // Refresh profile parameters
  const updateProfileStats = () => {
    setExplorerName(localStorage.getItem('explorer_name') || "Astro Ranger");
    setExplorerLevel(localStorage.getItem('explorer_level') || "Lvl 01");
    setExplorerXP(localStorage.getItem('explorer_xp') || "1,200 XP");
  };

  // Determine active round details (Mascots & default backgrounds)
  const getRoundConfig = () => {
    switch (activeRound) {
      case 2:
        return {
          mascot: "/images/mascots/jungle.png",
          background: "url('/images/ppt2022/image71.gif') no-repeat center center / 100% 100%",
          zone: "ALGEBRAIC MATRICES",
          title: "ROUND 02: algebraic matrices"
        };
      case 3:
        return {
          mascot: "/images/mascots/ice.png",
          background: "url('/images/ppt2022/image62.gif') no-repeat center center / 100% 100%",
          zone: "COSMIC EXPLORATION",
          title: "ROUND 03: cosmic exploration"
        };
      case 4:
        return {
          mascot: "/images/mascots/water.png",
          background: "url('/images/ppt2022/image64.gif') no-repeat center center / 100% 100%",
          zone: "VISUAL INTEL",
          title: "ROUND 04: visual intel"
        };
      case 5:
        return {
          mascot: "/images/mascots/sky.png",
          background: "url('/images/ppt2022/image67.gif') no-repeat center center / 100% 100%",
          zone: "EXPERIMENTAL ROUND",
          title: "ROUND 05: experimental round"
        };
      case 1:
      default:
        return {
          mascot: "/images/mascots/space.png",
          background: "url('/images/ppt2022/image73.gif') no-repeat center center / 100% 100%",
          zone: "REASONING ROUND",
          title: "ROUND 01: reasoning round"
        };
    }
  };

  const roundConfig = getRoundConfig();
  const activeQuestion = questions[currentIdx];

  // Load background image dynamically from the active question's slide config
  const getActiveBackground = () => {
    if (activeQuestion && activeQuestion.bg) {
      return activeQuestion.bg;
    }
    return activeRound === 5 ? roundConfig.background : 'none';
  };

  // Continuous loop for floating coordinates and logs
  useEffect(() => {
    let animHandle;
    const tick = () => {
      setAnimationTime((prev) => prev + 0.05);
      animHandle = requestAnimationFrame(tick);
    };
    animHandle = requestAnimationFrame(tick);

    const logInterval = setInterval(() => {
      setConsoleLogs((prev) => {
        const nextLog = diagnosticLogs[logCounter.current % diagnosticLogs.length];
        logCounter.current += 1;
        return [...prev.slice(-4), nextLog];
      });
    }, 2000);

    // Initial profile load
    updateProfileStats();

    return () => {
      cancelAnimationFrame(animHandle);
      clearInterval(logInterval);
    };
  }, []);

  // 1. Initial configuration mount load
  useEffect(() => {
    const roundNumber = Number(localStorage.getItem('active_round') || 1);
    setActiveRound(roundNumber);

    const qList = getSavedQuestions();
    setAllQuestions(qList);
    
    const roundQ = qList.filter(q => q.round === roundNumber);
    setQuestions(roundQ);

    if (roundQ[0]) {
      
      setTimeLeft(getTimeForQuestion(roundQ[0]));
      setMaxTime(getTimeForQuestion(roundQ[0]));
    }

    playAmbientHum();

    // Boot loading bar
    const bootInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(bootInterval);
          setTimeout(() => {
            setShowBoot(false);
            playTransition();
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 14 + 7);
      });
    }, 180);

    return () => {
      clearInterval(bootInterval);
      stopAmbientHum();
    };
  }, []);

  // 2. Real-time sync listener subscription
  // IMPORTANT: pendingJump is used to break stale closure on triggerWipeTransition.
  // The sync useEffect runs with [] deps (mount-only), so triggerWipeTransition is stale.
  // We store jump targets in a ref and execute them from a fresh effect that watches questionsRef.
  const pendingJumpRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToSyncEvents((event) => {
      const { type, payload } = event;
      
      // Fetch latest round and question sheets directly from source to ensure fresh data
      const currentStoredRound = Number(localStorage.getItem('active_round') || 1);
      setActiveRound(currentStoredRound);

      const freshQuestions = getSavedQuestions();
      setAllQuestions(freshQuestions);
      
      const roundQuestions = freshQuestions.filter(q => q.round === currentStoredRound);
      setQuestions(roundQuestions);

      switch (type) {
        case 'SYNC_QUESTIONS': {
          const activeQ = roundQuestions[currentIdxRef.current];
          if (activeQ) {
            setTimeLeft(getTimeForQuestion(activeQ));
            setMaxTime(getTimeForQuestion(activeQ));
          }
          updateProfileStats();
          break;
        }

        case 'JUMP_QUESTION': {
          // Store as pending — will be picked up by fresh effect below
          if (payload && payload.index !== undefined) {
            pendingJumpRef.current = { index: payload.index };
            // Trigger re-render so the watching useEffect fires
            setQuestions([...roundQuestions]);
          }
          break;
        }

        case 'START_TIMER':
          setIsTimerRunning(true);
          break;

        case 'PAUSE_TIMER':
          setIsTimerRunning(false);
          break;

        case 'RESET_TIMER': {
          setIsTimerRunning(false);
          if (payload && payload.timeLeft !== undefined) {
            setTimeLeft(payload.timeLeft);
            setMaxTime(payload.timeLeft);
          } else {
            const activeQReset = roundQuestions[currentIdxRef.current];
            if (activeQReset) {
              
              setTimeLeft(getTimeForQuestion(activeQReset));
              setMaxTime(getTimeForQuestion(activeQReset));
            }
          }
          break;
        }

        case 'REVEAL_ANSWER':
          setIsRevealed(true);
          setIsTimerRunning(false);
          setFlashActive(true);
          playCorrect();
          confetti({
            particleCount: 110,
            spread: 90,
            origin: { y: 0.65 },
            colors: ['#00d2ff', '#bd00ff', '#ffffff']
          });
          setTimeout(() => setFlashActive(false), 300);
          break;

        case 'HIDE_ANSWER':
          setIsRevealed(false);
          break;

        case 'COMPLETE_ROUND': {
          setRoundCompleted(true);
          setIsTimerRunning(false);
          playVictory();
          const completedRounds = JSON.parse(localStorage.getItem('completed_rounds') || '[]');
          if (!completedRounds.includes(activeRoundRef.current)) {
            const updated = [...completedRounds, activeRoundRef.current];
            localStorage.setItem('completed_rounds', JSON.stringify(updated));
          }
          const end = Date.now() + 3.5 * 1000;
          const victoryTimer = setInterval(() => {
            confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.8 } });
            confetti({ particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.8 } });
            if (Date.now() > end) {
              clearInterval(victoryTimer);
              navigateTo('');
            }
          }, 250);
          break;
        }

        case 'REDIRECT_LAUNCHER':
          navigateTo('');
          break;

        case 'TRIGGER_CONFETTI':
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.55 }
          });
          break;

        case 'RESTART_EXPEDITION': {
          setRoundCompleted(false);
          setCurrentIdx(0);
          setIsRevealed(false);
          setIsTimerRunning(false);
          const restartedFirstQ = roundQuestions[0];
          if (restartedFirstQ) {
            setTimeLeft(getTimeForQuestion(restartedFirstQ));
            setMaxTime(getTimeForQuestion(restartedFirstQ));
          }
          setShowBoot(true);
          setBootProgress(0);
          playTransition();
          break;
        }

        default:
          break;
      }
    });

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const currentQuestions = questionsRef.current;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          setCurrentIdx((prevIdx) => {
            const nextIdx = Math.min(currentQuestions.length - 1, prevIdx + 1);
            if (nextIdx !== prevIdx) {
              triggerWipeTransition(nextIdx, currentQuestions);
            }
            return prevIdx;
          });
          break;
        case 'ArrowLeft':
        case 'PageUp':
          setCurrentIdx((prevIdx) => {
            const nextIdx = Math.max(0, prevIdx - 1);
            if (nextIdx !== prevIdx) {
              triggerWipeTransition(nextIdx, currentQuestions);
            }
            return prevIdx;
          });
          break;
        case 'Enter':
          e.preventDefault();
          setIsRevealed((prev) => !prev);
          break;
        case 't':
        case 'T':
        case 's':
        case 'S':
          setIsTimerRunning((prev) => !prev);
          break;
        case 'r':
        case 'R':
          setCurrentIdx((currIdx) => {
            const q = currentQuestions[currIdx];
            if (q) {
              
              setTimeLeft(getTimeForQuestion(q));
              setIsTimerRunning(false);
            }
            return currIdx;
          });
          break;
        case 'Escape':
          navigateTo('');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Ticking count logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const nextTime = prev - 1;
          if (nextTime <= 3 && nextTime > 0) {
            playTick(true);
          } else if (nextTime > 0) {
            playTick(false);
          } else if (nextTime === 0) {
            setIsTimerRunning(false);
            playTimeout();
          }
          return nextTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  // Panel wipe triggers
  const triggerWipeTransition = (newIdx, activeList) => {
    setWipeActive(true);
    playTransition();
    
    setTimeout(() => {
      setCurrentIdx(newIdx);
      setIsRevealed(false);
      const q = activeList[newIdx];
      if (q) {
        
        setTimeLeft(getTimeForQuestion(q));
        setMaxTime(getTimeForQuestion(q));
      }
      setIsTimerRunning(false);
    }, 450);

    setTimeout(() => {
      setWipeActive(false);
    }, 900);
  };

  const handleNextQuestion = () => {
    const nextIdx = Math.min(questions.length - 1, currentIdx + 1);
    if (nextIdx !== currentIdx) {
      triggerWipeTransition(nextIdx, questions);
    }
  };

  const handlePrevQuestion = () => {
    const nextIdx = Math.max(0, currentIdx - 1);
    if (nextIdx !== currentIdx) {
      triggerWipeTransition(nextIdx, questions);
    }
  };

  const triggerManualConfetti = () => {
    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.55 }
    });
  };

  const handleCompleteRound = () => {
    setRoundCompleted(true);
    setIsTimerRunning(false);
    playVictory();
    const completedRounds = JSON.parse(localStorage.getItem('completed_rounds') || '[]');
    if (!completedRounds.includes(activeRound)) {
      const updated = [...completedRounds, activeRound];
      localStorage.setItem('completed_rounds', JSON.stringify(updated));
    }
    const end = Date.now() + 3.5 * 1000;
    const victoryTimer = setInterval(() => {
      confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.8 } });
      confetti({ particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.8 } });
      if (Date.now() > end) {
        clearInterval(victoryTimer);
        navigateTo('');
      }
    }, 250);
  };

  // Execute pending JUMP_QUESTION using fresh questions state (breaks stale closure)
  useEffect(() => {
    if (pendingJumpRef.current && questions.length > 0) {
      const { index } = pendingJumpRef.current;
      pendingJumpRef.current = null;
      const clampedIndex = Math.min(Math.max(0, index), questions.length - 1);
      triggerWipeTransition(clampedIndex, questions);
    }
  }, [questions]);

  const activeQuestionBg = activeQuestion?.bg || roundConfig.background;
  const dnaNodes = Array.from({ length: 9 }).map((_, i) => i);

  const getBGM = () => {
    switch (activeRound) {
      case 1: return "/images/backgrounds/dheema.mpeg";
      case 2: return "/images/backgrounds/youth.mpeg";
      case 3: return "/images/backgrounds/chellamagale.mpeg";
      case 4: return "/images/backgrounds/withlove.mpeg";
      default: return null;
    }
  };
  const activeBGM = getBGM();

  if (activeRound === 5) {
    return (
      <ExperimentRound
        questions={questions}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        isRevealed={isRevealed}
        setIsRevealed={setIsRevealed}
        timeLeft={timeLeft}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
        setTimeLeft={setTimeLeft}
        triggerWipeTransition={triggerWipeTransition}
        navigateTo={navigateTo}
        toggleFullscreen={toggleFullscreen}
        handleCompleteRound={handleCompleteRound}
        triggerManualConfetti={triggerManualConfetti}
      />
    );
  }

  return (
    <div 
      className={timeLeft <= 3 && isTimerRunning ? 'shake-active' : ''}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px 40px',
        overflow: 'hidden',
        color: '#ffffff',
        background: 'transparent'
      }}
    >
      {activeBGM && (
        <audio 
          key={activeBGM}
          src={activeBGM}
          autoPlay 
          loop 
          onCanPlay={(e) => { e.target.volume = 0.06; }}
          onTimeUpdate={(e) => {
            if (activeBGM.includes('youth.mpeg') && e.target.currentTime >= 45) {
              e.target.currentTime = 0;
            }
          }}
          style={{ display: 'none' }}
        />
      )}
      {/* Layer 1: Solid base matte backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#040509',
          zIndex: -10,
          pointerEvents: 'none'
        }}
      />

      {/* Layer 2: Slide fallback background image (renders if no video is present) */}
      {!(activeQuestion && activeQuestion.video) && (
        <div 
          key={getActiveBackground()}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: getActiveBackground(),
            zIndex: -9,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Layer 3: Background HTML5 Video player for moving slide backdrops */}
      {activeQuestion && activeQuestion.video && (
        <video 
          ref={videoRef}
          key={activeQuestion.id}
          autoPlay 
          loop 
          muted 
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            zIndex: -8,
            pointerEvents: 'none'
          }}
        >
          <source src={activeQuestion.video} type="video/mp4" />
        </video>
      )}

      {/* Dim overlay behind content (made lighter to let colorful backdrops shine through) */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: -4, 
          background: 'rgba(5, 6, 11, 0.22)',
          pointerEvents: 'none'
        }} 
      />

      {/* Canvas Projections overlaying background (reduced opacity so backdrop is visible) */}
      {activeQuestion && (
        <ConsoleBackground 
          questionText={activeQuestion.text} 
          keywords={activeQuestion.keywords} 
        />
      )}

      {/* Critical Red Pulse Vignette Overlay */}
      {timeLeft <= 3 && isTimerRunning && (
        <div className="vignette-pulse-danger" />
      )}

      {/* Geometric Wipe Transition Wipes */}
      <AnimatePresence>
        {wipeActive && (
          <>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
              className="console-wipe-panel console-wipe-left"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
              className="console-wipe-panel console-wipe-right"
            />
          </>
        )}
      </AnimatePresence>

      {/* Flash overlay */}
      {flashActive && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#ffffff',
            opacity: 0.95,
            zIndex: 9999,
            pointerEvents: 'none',
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* HEADER HUD BAR */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
          paddingBottom: '15px',
          fontFamily: 'var(--font-hud)',
          zIndex: 5,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '2px' }}>
            DECRYPTION PORT
          </span>
          <motion.span 
            animate={{ boxShadow: ['0 0 8px #00ffd1', '0 0 25px #00ffd1', '0 0 8px #00ffd1'], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00ffd1', display: 'inline-block' }} 
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '3px', textTransform: 'uppercase' }}>
            {roundConfig.title}
          </span>
        </div>
        
        <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 800, letterSpacing: '2.5px' }}>
          AUDITORIUM ENGINE LINKED
        </span>
      </div>

      {/* 3-COLUMN HIGH-ENERGY SCI-FI HUD LAYOUT */}
      {activeQuestion && (
        <div 
          className="presenter-hud-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr 240px',
            gap: '30px',
            flex: 1,
            alignItems: 'center',
            padding: '15px 0',
            zIndex: 5
          }}
        >
          {/* COLUMN 1: MASCOT EXPEDITION HUD (GLOWING GRADIENT GLASS PANEL) */}
          <div 
            className="console-panel hud-cut-tr presenter-mascot-col"
            style={{
              padding: '20px 15px',
              border: `1.5px solid ${activeQuestion.cardColor || 'rgba(0, 210, 255, 0.7)'}`,
              boxShadow: `0 0 25px ${activeQuestion.cardColor || 'rgba(0, 210, 255, 0.45)'}`,
              height: '100%',
              maxHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.45) 0%, rgba(10, 12, 20, 0.85) 100%)',
              transition: 'all 0.6s ease-in-out'
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', color: 'var(--console-cyan)', letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>
                // EXPEDITION STATUS
              </span>

              {/* Glowing Space Uniform Mascot inside HUD */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  margin: '20px 0 30px 0',
                  animation: 'float-mascot-hud 3.5s infinite ease-in-out'
                }}
              >
                <div 
                  style={{
                    position: 'relative',
                    width: '160px',
                    height: '175px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <img 
                    src={roundConfig.mascot} 
                    alt="Explorer Mascot" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))'
                    }} 
                  />
                </div>
              </div>

              {/* Character stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-hud)', fontSize: '0.68rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>EXPLORER:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{explorerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>ROUND:</span>
                  <span style={{ color: 'var(--console-cyan)', fontWeight: 'bold' }}>ROUND 0{activeRound}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>ZONE:</span>
                  <span style={{ color: 'var(--console-cyan)', textTransform: 'uppercase', fontWeight: 'bold' }}>{roundConfig.zone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: CENTRAL QUESTION PANEL WITH INTEGRATED CONCEPT ART IMAGES (VIBRANT GLOW MATRIX CARD) */}
          <div 
            className="tilt-card-container"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              animation: 'slow-float-sway 7s infinite ease-in-out'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuestion.id}
                initial={{ scale: 0.94, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: -30 }}
                transition={{ type: 'spring', stiffness: 55, damping: 14 }}
                className={`console-panel hud-cut-tr`}
                style={{
                  width: '100%',
                  minHeight: (activeRound === 1 || activeRound === 3) ? '380px' : '340px',
                  padding: (activeRound === 1 || activeRound === 3) ? '55px 60px' : '40px 45px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: (activeRound === 1 || activeRound === 3) 
                    ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.16) 0%, rgba(189, 0, 255, 0.16) 100%)' 
                    : (activeQuestion.cardGradient || 'linear-gradient(135deg, rgba(0, 210, 255, 0.35) 0%, rgba(189, 0, 255, 0.35) 100%)'),
                  backdropFilter: (activeRound === 1 || activeRound === 3) ? 'blur(10px)' : 'blur(25px)',
                  border: `2.5px solid ${activeQuestion.cardColor || 'var(--console-electric-blue)'}`,
                  boxShadow: (activeRound === 1 || activeRound === 3)
                    ? `0 0 35px ${activeQuestion.cardColor || 'rgba(0, 210, 255, 0.35)'}`
                    : `0 0 50px ${activeQuestion.cardColor || 'rgba(0, 210, 255, 0.55)'}`,
                  transition: 'all 0.6s ease-in-out'
                }}
              >
                <div 
                  style={{ 
                    display: 'flex',
                    flexDirection: activeRound === 4 ? 'column' : 'row',
                    gap: '30px', 
                    alignItems: 'stretch',
                    width: '100%'
                  }}
                >
                  {/* Holographic conceptual image display (swaps dynamically on answer reveal) */}
                  {(activeQuestion.image || activeQuestion.images) && (
                    <div 
                      style={{ 
                        position: 'relative',
                        borderRadius: '8px',
                        border: isRevealed ? '2.5px solid rgba(0, 255, 209, 0.85)' : '2.5px solid rgba(0, 210, 255, 0.85)',
                        boxShadow: isRevealed ? '0 0 30px rgba(0, 255, 209, 0.45)' : '0 0 30px rgba(0, 210, 255, 0.45)',
                        overflow: 'hidden',
                        height: activeRound === 4 ? '380px' : '260px',
                        width: activeRound === 4 ? '100%' : '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(4, 5, 9, 0.45)',
                        padding: '12px',
                        transition: 'all 0.4s ease'
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isRevealed && activeQuestion.answerImage ? (
                          <motion.img 
                            key="answer-image-reveal"
                            initial={{ opacity: 0, scale: 0.4, x: 150, filter: 'blur(15px)' }}
                            animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.2, x: -100, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
                            src={activeQuestion.answerImage} 
                            alt="Answer Illustration" 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : activeQuestion.images ? (
                          <motion.div 
                            key={`clue-grid-${isRevealed}`}
                            initial={{ opacity: 0, scale: 0.4, x: 150 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 1.2, x: -100 }}
                            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
                            style={{ display: 'flex', gap: '15px', width: '100%', height: '100%', justifyContent: 'space-around', alignItems: 'center' }}
                          >
                            {activeQuestion.images.map((imgSrc, i) => (
                              <div 
                                key={i}
                                style={{ 
                                  width: `${95 / activeQuestion.images.length}%`, 
                                  height: '100%', 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  borderRadius: '6px',
                                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                                  padding: '8px',
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                                }}
                              >
                                <img 
                                  src={imgSrc} 
                                  alt={`Clue ${i+1}`} 
                                  style={{ width: '100%', height: (activeQuestion.captions && activeQuestion.captions[i]) ? '85%' : '100%', objectFit: 'contain', borderRadius: '4px' }}
                                />
                                {activeQuestion.captions && activeQuestion.captions[i] && (
                                  <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', marginTop: '10px', textAlign: 'center', fontFamily: 'var(--font-hud)', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                    {activeQuestion.captions[i]}
                                  </div>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.img 
                            key={`concept-image-${isRevealed}`}
                            initial={{ opacity: 0, scale: 0.4, x: 150, filter: 'blur(15px)' }}
                            animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.2, x: -100, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
                            src={activeQuestion.image} 
                            alt="Concept Illustration" 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain'
                            }} 
                          />
                        )}
                      </AnimatePresence>
                      
                      <div className="console-overlay-scanlines" style={{ position: 'absolute', opacity: 0.35, pointerEvents: 'none' }} />
                      
                      {/* HUD bracket overlays */}
                      <div style={{ position: 'absolute', top: '8px', left: '8px', width: '12px', height: '12px', borderTop: '2px solid #ffffff', borderLeft: '2px solid #ffffff' }} />
                      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '12px', height: '12px', borderTop: '2px solid #ffffff', borderRight: '2px solid #ffffff' }} />
                      <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '12px', height: '12px', borderBottom: '2px solid #ffffff', borderLeft: '2px solid #ffffff' }} />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '12px', height: '12px', borderBottom: '2px solid #ffffff', borderRight: '2px solid #ffffff' }} />

                      <span style={{ position: 'absolute', bottom: '8px', left: '20px', fontFamily: 'var(--font-hud)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textShadow: '0 0 5px rgba(0,0,0,0.8)' }}>
                        SECTOR_DECRYPT_0{currentIdx + 1}.PNG
                      </span>
                    </div>
                  )}

                  {/* Question and Answer content side */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      width: (activeRound === 4 || activeRound === 2) ? '100%' : '50%',
                      textAlign: (activeRound === 4 || activeRound === 2) ? 'center' : 'left',
                      marginTop: (activeRound === 4 || activeRound === 2) ? '15px' : '0',
                      background: activeRound === 2 ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                      padding: activeRound === 2 ? '50px' : '0',
                      borderRadius: activeRound === 2 ? '25px' : '0',
                      border: activeRound === 2 ? '2px solid rgba(0, 255, 136, 0.4)' : 'none',
                      boxShadow: activeRound === 2 ? '0 0 80px rgba(0, 255, 136, 0.15), inset 0 0 40px rgba(0, 255, 136, 0.1)' : 'none',
                      backdropFilter: activeRound === 2 ? 'blur(15px)' : 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <AnimatePresence mode="wait">
                        {!isRevealed ? (
                          <motion.div
                            key="question-text"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                          >
                            <span 
                              style={{ 
                                fontFamily: 'var(--font-hud)', 
                                fontSize: '0.7rem', 
                                color: activeRound === 2 ? '#00ff88' : 'var(--console-cyan)', 
                                fontWeight: 900, 
                                textTransform: 'uppercase', 
                                letterSpacing: '4px',
                                display: 'block',
                                marginBottom: '15px',
                                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                              }}
                            >
                              QUERY_DECODE_0{currentIdx + 1}
                            </span>
                            
                            {(activeRound === 1 || activeRound === 3) ? (
                              <motion.h2 
                                key={`q-r1-${activeQuestion.id}`}
                                initial={{ opacity: 0, y: 15, filter: 'blur(8px)', scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                                transition={{ duration: 0.65, ease: [0.25, 0.8, 0.25, 1] }}
                                style={{ 
                                  fontSize: activeRound === 2 ? '2.4rem' : ((activeQuestion.image || activeQuestion.images) ? '2.4rem' : '3.3rem'), 
                                  whiteSpace: activeRound === 2 ? 'pre-wrap' : 'normal',
                                  fontWeight: 800, 
                                  fontFamily: "'Outfit', sans-serif", 
                                  color: '#ffffff', 
                                  lineHeight: '1.45',
                                  letterSpacing: '0.5px',
                                  textShadow: '0 2px 15px rgba(0,0,0,0.95), 0 1px 5px rgba(0,0,0,0.95)'
                                }}
                              >
                                {activeQuestion.text}
                              </motion.h2>
                            ) : (
                              <h2 
                                className="digital-assemble"
                                style={{ 
                                  fontSize: activeRound === 2 ? '2.4rem' : ((activeQuestion.image || activeQuestion.images) ? '2.0rem' : '2.8rem'),
                                  whiteSpace: activeRound === 2 ? 'pre-wrap' : 'normal',
                                  fontWeight: 800, 
                                  fontFamily: 'var(--font-display)', 
                                  color: '#ffffff', 
                                  lineHeight: '1.45',
                                  letterSpacing: '0.5px',
                                  textShadow: '0 2px 15px rgba(0,0,0,0.95), 0 1px 5px rgba(0,0,0,0.95)'
                                }}
                              >
                                {activeQuestion.text}
                              </h2>
                            )}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="answer-text"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                          >
                            <span 
                              style={{ 
                                fontFamily: 'var(--font-hud)', 
                                fontSize: '0.7rem', 
                                color: activeRound === 2 ? '#00ff88' : 'var(--console-cyan)', 
                                fontWeight: 900, 
                                textTransform: 'uppercase', 
                                letterSpacing: '4px',
                                display: 'block',
                                marginBottom: '15px',
                                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                              }}
                            >
                              ★ Decrypted Explanation Staged
                            </span>

                        {(activeRound === 1 || activeRound === 3) ? (
                          <motion.h3 
                            key={`a-r1-${activeQuestion.id}`}
                            initial={{ opacity: 0, y: 15, filter: 'blur(8px)', scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                            transition={{ duration: 0.65, ease: [0.25, 0.8, 0.25, 1] }}
                            style={{ 
                              fontSize: activeQuestion.answer.length > 180 ? '1.3rem' : activeQuestion.answer.length > 100 ? '1.6rem' : ((activeQuestion.image || activeQuestion.images) ? '2.0rem' : '2.8rem'), 
                              fontWeight: 800, 
                              fontFamily: "'Outfit', sans-serif", 
                              color: 'var(--console-cyan)', 
                              lineHeight: '1.5',
                              whiteSpace: 'pre-wrap',
                              textShadow: '0 2px 15px rgba(0,0,0,0.95), 0 0 10px rgba(0, 255, 209, 0.45)'
                            }}
                          >
                            {activeQuestion.answer}
                          </motion.h3>
                        ) : (
                          <h3 
                            className="digital-assemble"
                            style={{ 
                              fontSize: activeRound === 2 ? '1.6rem' : (activeQuestion.answer.length > 180 ? '1.2rem' : activeQuestion.answer.length > 100 ? '1.5rem' : ((activeQuestion.image || activeQuestion.images) ? '1.7rem' : '2.4rem')), 
                              fontWeight: 700, 
                              fontFamily: 'var(--font-main)', 
                              color: 'var(--console-cyan)', 
                              lineHeight: '1.5',
                              whiteSpace: activeRound === 2 ? 'pre' : 'pre-wrap',
                              textShadow: '0 2px 15px rgba(0,0,0,0.95), 0 0 10px rgba(0, 255, 209, 0.45)'
                            }}
                          >
                            {activeQuestion.answer}
                          </h3>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* COLUMN 3: RIGHT SYSTEM HUD (TIMER, DNA SCROLL, SCROLLING CALCULATOR LOGS) */}
          <div 
            className="presenter-leaderboard-col"
            style={{
              height: '100%',
              maxHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            {/* HUD Circular Timer */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConsoleTimer 
                timeLeft={timeLeft}
                maxTime={maxTime}
              />
            </div>

            {/* Winding DNA Helix + Logging console (VIBRANT GLOW MATRIX CARD) */}
            <div 
              className="console-panel presenter-helix-panel"
              style={{
                padding: '12px 15px',
                border: `1.5px solid ${activeQuestion.cardColor || 'rgba(189, 0, 255, 0.7)'}`,
                boxShadow: `0 0 25px ${activeQuestion.cardColor || 'rgba(189, 0, 255, 0.45)'}`,
                borderRadius: '6px',
                background: 'linear-gradient(135deg, rgba(189, 0, 255, 0.45) 0%, rgba(10, 12, 20, 0.85) 100%)',
                display: 'grid',
                gridTemplateColumns: '90px 1fr',
                gap: '12px',
                alignItems: 'center',
                transition: 'all 0.6s ease-in-out'
              }}
            >
              {/* Vertical DNA double-helix or sandglass timer for Round 1 & Round 2 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {(activeRound === 1 || activeRound === 3) ? (
                  <svg width="80" height="135" viewBox="0 0 100 170" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 209, 0.5))' }}>
                    {/* Sandglass plates */}
                    <line x1="15" y1="15" x2="85" y2="15" stroke="var(--console-cyan)" strokeWidth="6" strokeLinecap="round" />
                    <line x1="15" y1="155" x2="85" y2="155" stroke="var(--console-cyan)" strokeWidth="6" strokeLinecap="round" />
                    
                    {/* Glass outer curvature */}
                    <path d="M 22 18 C 22 65, 45 80, 45 85 C 45 90, 22 105, 22 152" fill="none" stroke="rgba(0, 255, 209, 0.85)" strokeWidth="4" />
                    <path d="M 78 18 C 78 65, 55 80, 55 85 C 55 90, 78 105, 78 152" fill="none" stroke="rgba(0, 255, 209, 0.85)" strokeWidth="4" />
                    
                    {/* Top bulb sand draining */}
                    <path 
                      d="M 26 22 Q 50 22 74 22 C 68 50, 54 75, 48 83" 
                      fill="rgba(0, 255, 209, 0.5)" 
                      style={{ transformOrigin: '50% 50%', scaleY: Math.max(0.05, timeLeft / maxTime) }}
                    />
                    
                    {/* Falling sand line stream */}
                    {isTimerRunning && timeLeft > 0 && (
                      <line 
                        x1="50" 
                        y1="82" 
                        x2="50" 
                        y2="148" 
                        stroke="var(--console-cyan)" 
                        strokeWidth="3" 
                        strokeDasharray="6,4" 
                        style={{
                          animation: 'sand-stream-flow 0.5s infinite linear'
                        }}
                      />
                    )}
                    
                    {/* Bottom bulb sand pile growing */}
                    <path 
                      d="M 26 148 Q 50 115 74 148 Z" 
                      fill="rgba(0, 255, 209, 0.8)" 
                      style={{ transformOrigin: '50% 148px', scaleY: Math.min(1.0, 1.1 - (timeLeft / maxTime)) }}
                    />
                  </svg>
                ) : (
                  <svg width="80" height="135" viewBox="0 0 100 170">
                    {dnaNodes.map((i) => {
                      const phase = (animationTime + i) * 0.75;
                      const w = Math.sin(phase) * 32;
                      const leftX = 50 + w;
                      const rightX = 50 - w;
                      const y = i * 18 + 10;
                      
                      const pairColor = Math.cos(phase) > 0 ? 'rgba(0, 210, 255, 0.65)' : 'rgba(189, 0, 255, 0.65)';

                      return (
                        <g key={i}>
                          <line x1={leftX} y1={y} x2={rightX} y2={y} stroke={pairColor} strokeWidth="1.5" />
                          <circle cx={leftX} cy={y} r="3" fill="var(--console-electric-blue)" />
                          <circle cx={rightX} cy={y} r="3" fill="var(--console-cyan)" />
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* Scrolling terminal logs */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px', 
                  fontFamily: 'monospace', 
                  fontSize: '0.62rem', 
                  color: 'rgba(0, 255, 209, 0.95)', 
                  height: '110px', 
                  overflow: 'hidden',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}
              >
                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px', fontWeight: 'bold' }}>
                  TELEMETRY_LOG
                </span>
                {consoleLogs.map((log, index) => (
                  <div key={index} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER STATS HUD */}
      {activeQuestion && (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 5
          }}
        >
          <div 
            className="console-panel"
            style={{
              padding: '12px 35px',
              borderRadius: '20px',
              background: 'rgba(14, 17, 26, 0.93)',
              border: `1px solid ${activeQuestion.cardColor || 'rgba(255, 255, 255, 0.22)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontFamily: 'var(--font-hud)',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              transition: 'all 0.6s ease-in-out'
            }}
          >
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1.5px', fontWeight: 'bold' }}>
              DATABASE INDEX
            </span>
            <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--console-cyan)', fontWeight: 900, letterSpacing: '3px' }}>
              QUESTION {currentIdx + 1} OF {questions.length}
            </span>
          </div>
          {/* FLOATING PRESENTER CONTROLS (Always visible, fits touch screens) */}
          <div 
            className="presenter-floating-safety-bar"
            style={{
              position: 'fixed',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(10, 13, 22, 0.94)',
              border: `1.5px solid ${activeQuestion.cardColor || 'rgba(0, 210, 255, 0.7)'}`,
              borderRadius: '24px',
              padding: '8px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 15px rgba(0, 255, 209, 0.15)',
              backdropFilter: 'blur(12px)',
              opacity: 0.9,
              transition: 'all 0.3s ease',
              pointerEvents: 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.95), 0 0 25px ${activeQuestion.cardColor || 'rgba(0, 210, 255, 0.4)'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6), 0 0 15px rgba(0, 255, 209, 0.1)';
            }}
          >
            {/* Exit/Home button */}
            <button 
              onClick={() => { playBackCancel(); navigateTo(''); }}
              title="Return to Main Menu (Escape)"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ff4444',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                playHoverTick();
                e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Home size={16} />
            </button>

            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.15)' }} />

            {/* Prev Question */}
            <button 
              onClick={handlePrevQuestion}
              disabled={currentIdx === 0}
              title="Previous Question (Left Arrow)"
              style={{
                background: 'transparent',
                border: 'none',
                color: currentIdx === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={playHoverTick}
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-hud)', color: 'rgba(255,255,255,0.55)', userSelect: 'none', minWidth: '70px', textAlign: 'center' }}>
              Q {currentIdx + 1} / {questions.length}
            </span>

            {/* Next Question */}
            <button 
              onClick={handleNextQuestion}
              disabled={currentIdx === questions.length - 1}
              title="Next Question (Right Arrow)"
              style={{
                background: 'transparent',
                border: 'none',
                color: currentIdx === questions.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                cursor: currentIdx === questions.length - 1 ? 'not-allowed' : 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={playHoverTick}
            >
              <ChevronRight size={16} />
            </button>

            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.15)' }} />

            {/* Timer Toggle */}
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              title="Toggle Timer (T / S)"
              style={{
                background: 'transparent',
                border: 'none',
                color: isTimerRunning ? 'var(--console-cyan)' : '#fff',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={playHoverTick}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Timer Reset */}
            <button 
              onClick={() => {
                
                setTimeLeft(getTimeForQuestion(activeQuestion));
                setIsTimerRunning(false);
              }}
              title="Reset Timer (R)"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={playHoverTick}
            >
              <RotateCcw size={13} />
            </button>

            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.15)' }} />

            {/* Reveal Answer */}
            <button 
              onClick={() => setIsRevealed(!isRevealed)}
              title="Reveal Answer (Enter)"
              style={{
                background: 'transparent',
                border: 'none',
                color: isRevealed ? 'var(--console-amber)' : '#fff',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={playHoverTick}
            >
              {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>

            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.15)' }} />

            {/* Confetti Trigger */}
            <button 
              onClick={triggerManualConfetti}
              title="Trigger Celebration Confetti"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--console-cyan)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                playHoverTick();
                e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Sparkles size={14} />
            </button>

            {/* Complete Round Trigger */}
            <button 
              onClick={handleCompleteRound}
              title="Finish & Complete This Round"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--console-neon-purple)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                playHoverTick();
                e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Award size={15} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-mascot-hud {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes slow-float-sway {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(0.4deg) rotateX(2deg); }
          50% { transform: translateY(-10px) rotate(-0.2deg) rotateY(-2deg); }
          75% { transform: translateY(-4px) rotate(-0.5deg) rotateX(-1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      {/* Floating Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        title="Toggle Fullscreen"
        style={{
          position: 'absolute',
          top: '25px',
          right: '25px',
          zIndex: 9999,
          background: 'rgba(10, 13, 22, 0.6)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          color: 'rgba(255,255,255,0.7)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto'
        }}
        onMouseEnter={(e) => {
          playHoverTick();
          e.currentTarget.style.borderColor = 'var(--console-cyan)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.boxShadow = '0 0 10px var(--console-glow-cyan)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
        }}
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
}
