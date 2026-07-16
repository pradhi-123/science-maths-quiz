import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight, Home, Maximize2 } from 'lucide-react';
import ConsoleTimer from './ConsoleTimer';
import { playHoverTick, playBackCancel, playCorrect } from '../lib/audio';

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
  toggleFullscreen
}) {
  const activeQuestion = questions[currentIdx];
  const videoRef = useRef(null);

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
          filter: 'contrast(1.1) brightness(0.65)'
        }}
      />
      {/* Dark Cinematic Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(to bottom, rgba(4,5,9,0.3) 0%, rgba(4,5,9,0.9) 100%)',
        zIndex: -1
      }} />

      {/* Main Content Area */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%', right: '10%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10
      }}>
        <div style={{
          padding: '12px 25px', border: `2px solid ${cardColor}`,
          borderRadius: '30px', color: cardColor, fontSize: '1.4rem',
          fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '35px',
          boxShadow: `0 0 25px ${cardColor}55`, backdropFilter: 'blur(8px)',
          animation: 'panel-fade-in 0.8s ease-out'
        }}>
          // EXPERIMENTAL LAB {currentIdx + 1} ACTIVE
        </div>

        <h1 style={{
          fontSize: '3.8rem', fontWeight: 900, lineHeight: '1.4',
          textShadow: '0 5px 25px rgba(0,0,0,0.9), 0 2px 5px rgba(0,0,0,0.8)',
          fontFamily: 'var(--font-display)',
          animation: 'panel-fade-in 1s ease-out',
          maxWidth: '90%'
        }}>
          {activeQuestion.text}
        </h1>

        {isRevealed && (
          <div style={{
            marginTop: '60px', padding: '40px 60px',
            background: 'rgba(0,0,0,0.7)', border: `2px solid ${cardColor}`,
            borderRadius: '25px', backdropFilter: 'blur(20px)',
            boxShadow: `0 0 50px ${cardColor}44`,
            animation: 'panel-fade-in 0.6s ease-out'
          }}>
            <h2 style={{ fontSize: '1.6rem', color: '#bbb', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Verified Phenomenon:
            </h2>
            <div style={{ fontSize: '3.2rem', color: cardColor, fontWeight: 900, fontFamily: 'var(--font-display)', textShadow: `0 0 20px ${cardColor}88` }}>
              {activeQuestion.answer}
            </div>
          </div>
        )}
      </div>

      {/* Timer */}
      {!isRevealed && (
        <div style={{ position: 'absolute', bottom: '150px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
          <ConsoleTimer time={timeLeft} maxTime={activeQuestion.timeLimit || 45} color={cardColor} />
        </div>
      )}

      {/* Presenter Controls (Bottom) */}
      <div className="presenter-floating-safety-bar" style={{
        position: 'absolute', bottom: '35px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', gap: '18px',
        background: 'rgba(10, 13, 22, 0.94)', border: `1.5px solid ${cardColor}aa`,
        borderRadius: '35px', padding: '12px 30px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 25px ${cardColor}33`,
        backdropFilter: 'blur(12px)'
      }}>
        <button onClick={() => { playBackCancel(); navigateTo(''); }} style={navBtnStyle('#ff4444')}><Home size={22} /></button>
        <div style={navDividerStyle} />
        <button onClick={() => triggerWipeTransition(Math.max(0, currentIdx - 1), questions)} style={navBtnStyle('#aaa')}><ChevronLeft size={22} /></button>
        <span style={{ fontSize: '1.2rem', color: '#fff', margin: '0 15px', fontWeight: 'bold' }}>
          {currentIdx + 1} / {questions.length}
        </span>
        <button onClick={() => triggerWipeTransition(Math.min(questions.length - 1, currentIdx + 1), questions)} style={navBtnStyle('#aaa')}><ChevronRight size={22} /></button>
        <div style={navDividerStyle} />
        <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={navBtnStyle('#00ffd1')}>{isTimerRunning ? <Pause size={22} /> : <Play size={22} />}</button>
        <button onClick={() => { setTimeLeft(activeQuestion.timeLimit || 45); setIsTimerRunning(false); playHoverTick(); }} style={navBtnStyle('#ffaa00')}><RotateCcw size={22} /></button>
        <div style={navDividerStyle} />
        <button onClick={() => { setIsRevealed(!isRevealed); isRevealed ? playHoverTick() : playCorrect(); }} style={navBtnStyle(cardColor)}>
          {isRevealed ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
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
        @keyframes panel-fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const navBtnStyle = (color) => ({
  background: 'transparent', border: 'none', color: color, cursor: 'pointer', padding: '6px',
  display: 'flex', alignItems: 'center', transition: 'transform 0.2s'
});
const navDividerStyle = { width: '2px', height: '22px', background: 'rgba(255,255,255,0.2)' };
