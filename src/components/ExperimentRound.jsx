import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight, Home, Maximize2, Sparkles, Award } from 'lucide-react';
import ConsoleTimer from './ConsoleTimer';
import { playHoverTick, playBackCancel, playCorrect, playAmbientHum, stopAmbientHum } from '../lib/audio';

export default function ExperimentRound({
  questions,
  currentIdx,
  setCurrentIdx,
  isRevealed,
  setIsRevealed,
  timeLeft,
  isTimerRunning,
  setIsTimerRunning,
  setTimeLeft,
  triggerWipeTransition,
  navigateTo,
  toggleFullscreen,
  handleCompleteRound,
  triggerManualConfetti
}) {
  const activeQuestion = questions[currentIdx];
  const videoRef = useRef(null);

  // The MP3 tracks from the original presentation
  const bgmTracks = [
    '/images/ppt2022/media6.mp3',
    '/images/ppt2022/media4.mp3',
    '/images/ppt2022/media7.mp3',
    '/images/ppt2022/media3.mp3'
  ];
  
  const currentBgm = bgmTracks[currentIdx % bgmTracks.length];

  useEffect(() => {
    if (videoRef.current && activeQuestion?.video) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log(e));
    }
  }, [activeQuestion]);

  if (!activeQuestion) return null;

  const cardColor = activeQuestion.cardColor || '#00ffd1';

  return (
    <div style={{
      width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', color: '#fff',
      fontFamily: 'var(--font-hud)'
    }}>
      {/* Full-screen video background */}
      <video
        ref={videoRef}
        src={activeQuestion.video}
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: -2,
          filter: 'contrast(1.2) brightness(0.6)'
        }}
      />
      
      {/* Dynamic Thrilling Audio Track for this specific slide */}
      <audio 
        src={currentBgm} 
        autoPlay 
        loop 
        style={{ display: 'none' }} 
      />

      {/* Dark Cinematic Overlay & Grander HUD framing */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at center, rgba(4,5,9,0.1) 0%, rgba(4,5,9,0.95) 100%)',
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)',
        zIndex: -1
      }} />

      {/* Space Rover Mascot on the Side */}
      <div style={{
        position: 'absolute', left: '40px', bottom: '120px', zIndex: 5,
        opacity: 0.9, filter: 'drop-shadow(0 0 25px var(--console-cyan))',
        animation: 'float-rover 6s ease-in-out infinite'
      }}>
        <img src="/images/mascots/space.png" alt="Rover Mascot" style={{ width: '280px', objectFit: 'contain' }} />
      </div>

      {/* Main Content Area: Massive Glassmorphism Center */}
      <div style={{
        position: 'absolute', top: '50%', left: '55%', transform: 'translate(-50%, -50%)',
        width: '60%', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', zIndex: 10,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(15px)',
        border: `1.5px solid ${cardColor}66`,
        borderRadius: '35px',
        boxShadow: `0 0 80px ${cardColor}22, inset 0 0 40px rgba(0,0,0,0.8)`,
        padding: '50px 30px'
      }}>
        
        <div style={{
          position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)',
          padding: '12px 35px', background: 'rgba(5,6,11,0.95)', border: `2px solid ${cardColor}`,
          borderRadius: '30px', color: cardColor, fontSize: 'clamp(0.8rem, 1.2vw, 1.2rem)',
          fontWeight: 900, textTransform: 'uppercase', letterSpacing: '6px',
          boxShadow: `0 0 35px ${cardColor}88`,
          whiteSpace: 'nowrap'
        }}>
          // EXPERIMENTAL LAB {currentIdx + 1}
        </div>

        {/* The Hologram Swap Logic */}
        {!isRevealed ? (
          <h1 style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 2.3rem)', fontWeight: 900, lineHeight: '1.5',
            textShadow: `0 8px 30px rgba(0,0,0,1), 0 0 20px ${cardColor}55`,
            fontFamily: "'Cinzel', serif",
            animation: 'hologram-fade-in 1s ease-out',
            width: '85%', margin: '0 auto', padding: '10px',
            wordWrap: 'break-word'
          }}>
            {activeQuestion.text}
          </h1>
        ) : (
          <div style={{ animation: 'hologram-fade-in 0.8s ease-out', padding: '10px', width: '85%', margin: '0 auto' }}>
            <h2 style={{ 
              fontSize: 'clamp(1rem, 1.5vw, 1.6rem)', color: '#bbb', marginBottom: '15px', 
              textTransform: 'uppercase', letterSpacing: '6px', fontFamily: 'var(--font-hud)' 
            }}>
              Verified Phenomenon
            </h2>
            <div style={{ 
              fontSize: 'clamp(1.8rem, 3.2vw, 3.5rem)', color: cardColor, fontWeight: 900, 
              fontFamily: "'Cinzel', serif", 
              textShadow: `0 0 40px ${cardColor}88, 0 10px 20px rgba(0,0,0,1)`,
              lineHeight: '1.35',
              wordWrap: 'break-word'
            }}>
              {activeQuestion.answer}
            </div>
          </div>
        )}
      </div>

      {/* Timer moved to the Right Side */}
      {!isRevealed && (
        <div style={{ 
          position: 'absolute', right: '50px', top: '50%', transform: 'translateY(-50%)', 
          zIndex: 20, filter: `drop-shadow(0 0 25px ${cardColor}66)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <ConsoleTimer timeLeft={timeLeft} maxTime={activeQuestion.timeLimit || 120} color={cardColor} />
          <div style={{ 
            marginTop: '15px', fontSize: '0.85rem', color: cardColor, 
            letterSpacing: '3px', fontWeight: 'bold', textShadow: `0 0 10px ${cardColor}` 
          }}>
            STABILITY
          </div>
        </div>
      )}

      {/* Presenter Controls (Bottom) */}
      <div className="presenter-floating-safety-bar" style={{
        position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', gap: '18px',
        background: 'rgba(10, 13, 22, 0.96)', border: `1.5px solid ${cardColor}aa`,
        borderRadius: '35px', padding: '12px 30px',
        boxShadow: `0 8px 40px rgba(0,0,0,0.9), 0 0 30px ${cardColor}44`,
        backdropFilter: 'blur(15px)'
      }}>
        <button onClick={() => { playBackCancel(); navigateTo(''); }} style={navBtnStyle('#ff4444')} title="Home"><Home size={22} /></button>
        <div style={navDividerStyle} />
        <button onClick={() => triggerWipeTransition(Math.max(0, currentIdx - 1), questions)} style={navBtnStyle('#aaa')}><ChevronLeft size={22} /></button>
        <span style={{ fontSize: '1.2rem', color: '#fff', margin: '0 15px', fontWeight: 'bold' }}>
          {currentIdx + 1} / {questions.length}
        </span>
        <button onClick={() => triggerWipeTransition(Math.min(questions.length - 1, currentIdx + 1), questions)} style={navBtnStyle('#aaa')}><ChevronRight size={22} /></button>
        <div style={navDividerStyle} />
        <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={navBtnStyle('#00ffd1')} title="Play/Pause Timer">{isTimerRunning ? <Pause size={22} /> : <Play size={22} />}</button>
        <button onClick={() => { setTimeLeft(activeQuestion.timeLimit || 120); setIsTimerRunning(false); playHoverTick(); }} style={navBtnStyle('#ffaa00')} title="Reset Timer"><RotateCcw size={22} /></button>
        <div style={navDividerStyle} />
        <button onClick={() => { setIsRevealed(!isRevealed); isRevealed ? playHoverTick() : playCorrect(); }} style={navBtnStyle(cardColor)} title="Reveal Answer">
          {isRevealed ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
        <div style={navDividerStyle} />
        <button onClick={triggerManualConfetti} style={navBtnStyle('var(--console-cyan)')} title="Trigger Confetti"><Sparkles size={22} /></button>
        <button onClick={handleCompleteRound} style={navBtnStyle('var(--console-neon-purple)')} title="Complete Round"><Award size={22} /></button>
      </div>

      {/* Fullscreen Toggle */}
      <button onClick={toggleFullscreen} style={{
        position: 'absolute', top: '35px', right: '35px', zIndex: 9999,
        background: 'rgba(10, 13, 22, 0.6)', border: '1.5px solid rgba(255, 255, 255, 0.15)',
        color: 'rgba(255,255,255,0.7)', borderRadius: '50%', width: '50px', height: '50px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
      >
        <Maximize2 size={20} />
      </button>

      <style>{`
        @keyframes hologram-fade-in { 0% { opacity: 0; filter: blur(15px); transform: scale(1.1); } 100% { opacity: 1; filter: blur(0); transform: scale(1); } }
        @keyframes float-rover { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
      `}</style>
    </div>
  );
}

const navBtnStyle = (color) => ({
  background: 'transparent', border: 'none', color: color, cursor: 'pointer', padding: '6px',
  display: 'flex', alignItems: 'center', transition: 'transform 0.2s'
});
const navDividerStyle = { width: '2px', height: '22px', background: 'rgba(255,255,255,0.2)' };
