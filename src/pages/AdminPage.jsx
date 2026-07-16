import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  LogIn, 
  Lock, 
  Compass, 
  ArrowLeft,
  ChevronRight,
  User,
  Award
} from 'lucide-react';
import { getSavedQuestions, saveQuestions } from '../lib/questions';
import { publishSyncEvent } from '../lib/sync';
import { playClick } from '../lib/audio';

export default function AdminPage({ navigateTo }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active round selection (1, 2, or 3)
  const [activeRound, setActiveRound] = useState(1);

  // Master questions list
  const [masterQuestions, setMasterQuestions] = useState([]);
  
  // Filtered questions for active round
  const [questions, setQuestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Question editing sheets
  const [qText, setQText] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qTime, setQTime] = useState(15);
  const [qKeywords, setQKeywords] = useState('');
  const [qImage, setQImage] = useState('');
  const [qImages, setQImages] = useState([]);

  // Explorer Profile Settings (PS5 Mascot Customization)
  const [expName, setExpName] = useState('Astro Ranger');
  const [expLevel, setExpLevel] = useState('Lvl 01');
  const [expXP, setExpXP] = useState('1,200 XP');

  // 1. Initial configuration
  useEffect(() => {
    const list = getSavedQuestions();
    setMasterQuestions(list);
    
    const roundNumber = Number(localStorage.getItem('active_round') || 1);
    setActiveRound(roundNumber);

    const roundQ = list.filter(q => q.round === roundNumber);
    setQuestions(roundQ);
    if (roundQ[0]) {
      loadQuestionIntoForm(roundQ[0]);
    }

    // Load Explorer Profile
    setExpName(localStorage.getItem('explorer_name') || 'Astro Ranger');
    setExpLevel(localStorage.getItem('explorer_level') || 'Lvl 01');
    setExpXP(localStorage.getItem('explorer_xp') || '1,200 XP');
  }, []);

  // Filter questions when round changes
  const handleSelectRound = (roundNum) => {
    playClick();
    localStorage.setItem('active_round', String(roundNum));
    setActiveRound(roundNum);

    const filtered = masterQuestions.filter(q => q.round === roundNum);
    setQuestions(filtered);
    setActiveIdx(0);
    if (filtered[0]) {
      loadQuestionIntoForm(filtered[0]);
    } else {
      clearQuestionForm();
    }

    // Notify presenter tab of round shift and reset
    publishSyncEvent('RESTART_EXPEDITION');
  };

  const clearQuestionForm = () => {
    setQText('');
    setQAnswer('');
    setQTime(15);
    setQKeywords('');
    setQImage('');
    setQImages([]);
  };

  const loadQuestionIntoForm = (q) => {
    setQText(q.text);
    setQAnswer(q.answer);
    setQTime(q.timeLimit);
    setQKeywords(q.keywords);
    setQImage(q.image || '');
    setQImages(q.images || []);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    playClick();
    if (password === 'quiz2026') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid access password.');
    }
  };

  // 2. Cross-tab trigger actions
  const sendSyncAction = (type, payload = {}) => {
    playClick();
    publishSyncEvent(type, payload);
  };

  const handleCompleteRound = () => {
    const completed = JSON.parse(localStorage.getItem('completed_rounds') || '[]');
    if (!completed.includes(activeRound)) {
      const updated = [...completed, activeRound];
      localStorage.setItem('completed_rounds', JSON.stringify(updated));
    }
    sendSyncAction('COMPLETE_ROUND');
  };

  const handleBackToLauncher = (e) => {
    e.preventDefault();
    playClick();
    publishSyncEvent('REDIRECT_LAUNCHER');
    navigateTo('');
  };

  const handleSelectQuestion = (index) => {
    playClick();
    setActiveIdx(index);
    const q = questions[index];
    if (q) {
      loadQuestionIntoForm(q);
      
      // Map back to absolute indices in master list for jump events
      const masterIdx = masterQuestions.findIndex(mq => mq.id === q.id);
      publishSyncEvent('JUMP_QUESTION', { index: index, questions: masterQuestions });
    }
  };

  const handleSaveQuestion = () => {
    playClick();
    if (!qText.trim() || !qAnswer.trim()) {
      alert('Question and Answer text cannot be blank.');
      return;
    }

    // Find active question in master list
    const activeQ = questions[activeIdx];
    if (!activeQ) return;

    const updatedMaster = masterQuestions.map((mq) => {
      if (mq.id === activeQ.id) {
        return {
          ...mq,
          text: qText,
          answer: qAnswer,
          timeLimit: Number(qTime),
          keywords: qKeywords,
          image: qImage,
          images: qImages
        };
      }
      return mq;
    });

    setMasterQuestions(updatedMaster);
    saveQuestions(updatedMaster);

    // Refresh active round list
    const filtered = updatedMaster.filter(q => q.round === activeRound);
    setQuestions(filtered);

    publishSyncEvent('SYNC_QUESTIONS', { questions: updatedMaster });
    alert('Presenter synced successfully!');
  };

  // Save Explorer profile backstage
  const handleSaveProfile = () => {
    playClick();
    localStorage.setItem('explorer_name', expName);
    localStorage.setItem('explorer_level', expLevel);
    localStorage.setItem('explorer_xp', expXP);
    
    // Broadcast sync to force Presenter Page state update
    publishSyncEvent('SYNC_QUESTIONS', { questions: masterQuestions });
    alert('Explorer Profile Synced Live with Presenter Screen!');
  };

  const handleAddNewQuestion = () => {
    playClick();
    const newQ = {
      id: `r${activeRound}-q-${Date.now()}`,
      round: activeRound,
      text: "New Scientific reasoning query?",
      answer: "Decoded explanation detail text.",
      timeLimit: 15,
      keywords: "default, generic",
      image: ""
    };
    const updatedMaster = [...masterQuestions, newQ];
    setMasterQuestions(updatedMaster);
    saveQuestions(updatedMaster);

    // Refresh filtered questions list
    const filtered = updatedMaster.filter(q => q.round === activeRound);
    setQuestions(filtered);

    publishSyncEvent('SYNC_QUESTIONS', { questions: updatedMaster });
    handleSelectQuestion(filtered.length - 1);
  };

  const handleDeleteQuestion = () => {
    if (questions.length <= 1) {
      alert('Round requires at least one question sector.');
      return;
    }
    if (!confirm('Are you sure you want to delete this question?')) return;

    playClick();
    const activeQ = questions[activeIdx];
    const updatedMaster = masterQuestions.filter(mq => mq.id !== activeQ.id);
    
    setMasterQuestions(updatedMaster);
    saveQuestions(updatedMaster);

    // Refresh filtered list
    const filtered = updatedMaster.filter(q => q.round === activeRound);
    setQuestions(filtered);
    publishSyncEvent('SYNC_QUESTIONS', { questions: updatedMaster });
    
    const nextIdx = Math.max(0, activeIdx - 1);
    handleSelectQuestion(nextIdx);
  };

  const handlePreviewBackground = () => {
    handleSaveQuestion();
  };

  // --- PASSWORD LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#07080c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'sans-serif'
        }}
      >
        <div 
          className="console-panel"
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'rgba(14, 17, 26, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}
        >
          <div style={{ display: 'inline-flex', background: 'rgba(0, 210, 255, 0.08)', padding: '14px', borderRadius: '50%', marginBottom: '20px', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
            <Lock size={26} color="var(--console-electric-blue)" />
          </div>
          
          <h2 style={{ fontFamily: 'var(--font-hud)', letterSpacing: '1.5px', fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '8px' }}>
            Backstage Deck Locked
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '30px' }}>
            Enter credential code to authorize synchronization.
          </p>

          <form onSubmit={handleLogin}>
            <input 
              type="password"
              placeholder="Authorization Key..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: '#07080c',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                marginBottom: '15px',
                textAlign: 'center',
                fontFamily: 'monospace'
              }}
            />
            {loginError && <p style={{ color: 'var(--console-red)', fontSize: '0.75rem', marginBottom: '15px' }}>{loginError}</p>}
            
            <button 
              type="submit"
              className="console-btn console-btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogIn size={16} /> Link Deck
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN PANEL ---
  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        background: "url('/images/ppt2022/image90.jpeg') no-repeat center center / cover",
        color: '#cbd5e1',
        display: 'grid',
        gridTemplateColumns: '290px 1fr',
        fontFamily: 'var(--font-main)',
        position: 'relative'
      }}
    >
      {/* Dim overlay behind content */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, background: 'rgba(8, 9, 15, 0.65)' }} />

      {/* 1. LEFT SIDEBAR CONFIG SHEET */}
      <div 
        style={{
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          background: 'rgba(11, 12, 19, 0.92)',
          padding: '20px 15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <Compass size={18} color="var(--console-cyan)" />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#ffffff', fontFamily: 'var(--font-hud)' }}>
              Live Deck
            </h2>
          </div>

          {/* ACTIVE ROUND BAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>
              ACTIVE SECTOR
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((rNum) => (
                <button
                  key={rNum}
                  onClick={() => handleSelectRound(rNum)}
                  style={{
                    padding: '8px 0',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    color: activeRound === rNum ? '#05060b' : 'rgba(255,255,255,0.6)',
                    background: activeRound === rNum ? 'var(--console-cyan)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  Round {rNum}
                </button>
              ))}
            </div>
          </div>

          {/* MAP & SCROLL PROGRESS CONTROLLER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>
              Map Quest Progress
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((sNum) => {
                const completed = JSON.parse(localStorage.getItem('completed_rounds') || '[]');
                const isCompleted = completed.includes(sNum);
                return (
                  <button
                    key={sNum}
                    onClick={() => {
                      playClick();
                      let updated;
                      if (isCompleted) {
                        updated = completed.filter(n => n !== sNum);
                      } else {
                        updated = [...completed, sNum];
                      }
                      localStorage.setItem('completed_rounds', JSON.stringify(updated));
                      publishSyncEvent('SYNC_QUESTIONS');
                    }}
                    style={{
                      padding: '6px 0',
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      color: isCompleted ? '#05060b' : 'rgba(255,255,255,0.5)',
                      background: isCompleted ? 'var(--console-cyan)' : 'rgba(255,255,255,0.03)',
                      border: isCompleted ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    title={isCompleted ? "Completed (Click to lock)" : "Locked (Click to complete)"}
                  >
                    S0{sNum}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold', marginBottom: '2px', display: 'block' }}>
              QUESTION SECTOR INDEX
            </span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '42vh', overflowY: 'auto' }}>
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(idx)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    border: activeIdx === idx ? '1px solid var(--console-cyan)' : '1px solid rgba(255,255,255,0.04)',
                    background: activeIdx === idx ? 'rgba(0,255,209,0.1)' : 'rgba(255,255,255,0.02)',
                    color: activeIdx === idx ? '#ffffff' : 'rgba(255,255,255,0.55)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: activeIdx === idx ? 'bold' : 'normal',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Q {idx + 1}: {q.text}</span>
                  {activeIdx === idx && <ChevronRight size={12} color="var(--console-cyan)" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleAddNewQuestion}
            className="console-btn"
            style={{
              width: '100%',
              padding: '9px',
              borderStyle: 'dashed',
              background: 'transparent',
              color: 'var(--console-cyan)',
              borderColor: 'rgba(0, 255, 209, 0.4)',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={12} /> Append Question
          </button>

          <a
            href="#/"
            className="console-btn"
            onClick={handleBackToLauncher}
            style={{
              width: '100%',
              padding: '9px',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={12} /> Back to Launcher
          </a>
        </div>
      </div>

      {/* 2. MAIN ADMIN CONTROLLER */}
      <div 
        style={{
          padding: '20px 30px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 10
        }}
      >
        {/* Remote Live Timer Control */}
        <div 
          style={{
            background: 'rgba(14,17,26,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold', letterSpacing: '0.5px' }}>Live Display Timer Signal</h3>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>Publish countdown signals to the live stage tab.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => sendSyncAction('START_TIMER')}
              className="console-btn"
              style={{ padding: '6px 14px', background: 'rgba(0, 255, 209, 0.15)', color: 'var(--console-cyan)', borderColor: 'var(--console-cyan)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Play size={10} /> Start
            </button>
            <button 
              onClick={() => sendSyncAction('PAUSE_TIMER')}
              className="console-btn"
              style={{ padding: '6px 14px', background: 'rgba(255, 170, 0, 0.1)', color: 'var(--console-amber)', borderColor: 'var(--console-amber)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Pause size={10} /> Pause
            </button>
            <button 
              onClick={() => sendSyncAction('RESET_TIMER', { timeLeft: questions[activeIdx]?.timeLimit || 15 })}
              className="console-btn"
              style={{ padding: '6px 14px', background: 'rgba(255, 0, 85, 0.1)', color: 'var(--console-red)', borderColor: 'var(--console-red)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <RotateCcw size={10} /> Reset
            </button>
          </div>
        </div>

        {/* Action deck */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px' }}>
          {/* Card 1: Reveal Answer */}
          <div 
            style={{ 
              background: 'rgba(14,17,26,0.85)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '6px', 
              padding: '15px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px' 
            }}
          >
            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Answer Decryption</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => sendSyncAction('REVEAL_ANSWER')}
                className="console-btn console-btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
              >
                <Eye size={12} /> Reveal Answer
              </button>
              <button
                onClick={() => sendSyncAction('HIDE_ANSWER')}
                className="console-btn"
                style={{ flex: 1, padding: '10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
              >
                <EyeOff size={12} /> Hide Answer
              </button>
            </div>
          </div>

          {/* Card 2: Special FX and victory */}
          <div 
            style={{ 
              background: 'rgba(14,17,26,0.85)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '6px', 
              padding: '15px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px' 
            }}
          >
            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Auditorium Celebrations</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => sendSyncAction('TRIGGER_CONFETTI')}
                className="console-btn"
                style={{ flex: 1.1, padding: '8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--console-cyan)', borderColor: 'var(--console-cyan)' }}
              >
                <Sparkles size={10} /> Confetti
              </button>
              <button
                onClick={handleCompleteRound}
                className="console-btn console-btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'linear-gradient(135deg, #ffaa00 0%, #d87000 100%)' }}
              >
                Complete Round
              </button>
            </div>
            <button
              onClick={() => sendSyncAction('RESTART_EXPEDITION')}
              className="console-btn"
              style={{ padding: '5px', fontSize: '0.62rem', color: 'var(--console-red)', borderColor: 'rgba(255,0,85,0.25)', width: '100%' }}
            >
              Reboot Round {activeRound} System
            </button>
          </div>
        </div>

        {/* Row 3: Explorer Mascot Customization Panel */}
        <div 
          style={{ 
            background: 'rgba(14,17,26,0.85)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '6px', 
            padding: '15px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
            <User size={14} color="var(--console-cyan)" />
            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Mascot Explorer Customization (School Uniform profile)
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>EXPLORER NAME</label>
              <input 
                type="text"
                value={expName}
                onChange={(e) => setExpName(e.target.value)}
                style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>RANK / LEVEL</label>
              <input 
                type="text"
                value={expLevel}
                onChange={(e) => setExpLevel(e.target.value)}
                style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>XP ACCUMULATION</label>
              <input 
                type="text"
                value={expXP}
                onChange={(e) => setExpXP(e.target.value)}
                style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSaveProfile}
              className="console-btn console-btn-primary"
              style={{ padding: '6px 16px', fontSize: '0.7rem' }}
            >
              Sync Explorer Profile
            </button>
          </div>
        </div>

        {/* Content Editor Sheet */}
        <div 
          style={{ 
            background: 'rgba(14,17,26,0.85)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '6px', 
            padding: '15px 25px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>
              EDIT CONTENT FOR QUERY {activeIdx + 1}
            </h4>
            <button
              onClick={handleDeleteQuestion}
              className="console-btn"
              style={{ padding: '4px 8px', background: 'rgba(255, 0, 85, 0.1)', color: 'var(--console-red)', borderColor: 'rgba(255, 0, 85, 0.25)', fontSize: '0.62rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={10} /> Delete Sheet
            </button>
          </div>

          {questions.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>Question Text</label>
                  <textarea 
                    rows="2"
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>Answer Explanation</label>
                  <textarea 
                    rows="2"
                    value={qAnswer}
                    onChange={(e) => setQAnswer(e.target.value)}
                    style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>Time (Secs)</label>
                    <input 
                      type="number"
                      value={qTime}
                      onChange={(e) => setQTime(Number(e.target.value))}
                      style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>Keywords</label>
                    <input 
                      type="text"
                      value={qKeywords}
                      onChange={(e) => setQKeywords(e.target.value)}
                      style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>
                </div>

                 {qImages && qImages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>Connect Clues Images (Comma-separated)</label>
                    <input 
                      type="text"
                      value={qImages.join(', ')}
                      onChange={(e) => setQImages(e.target.value.split(',').map(s => s.trim()))}
                      style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '3px' }}>
                      {qImages.map((imgUrl, i) => (
                        <div key={i} style={{ height: '35px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#05060b', display: 'flex', alignItems: 'center', padding: '2px' }}>
                          <img src={imgUrl} alt={`clue-${i}`} style={{ height: '100%', objectFit: 'contain' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>Image Path</label>
                      <input 
                        type="text"
                        value={qImage}
                        onChange={(e) => setQImage(e.target.value)}
                        style={{ padding: '8px', background: '#05060b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>
                    {qImage && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>ASSET THUMBNAIL</span>
                        <div style={{ width: '100%', height: '50px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05060b' }}>
                          <img src={qImage} alt="thumbnail" style={{ height: '100%', objectFit: 'contain' }} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
              No questions found in this Round sector.
            </div>
          )}

          {questions.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '5px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={handlePreviewBackground}
                className="console-btn"
                style={{ padding: '6px 14px', fontSize: '0.68rem', color: 'var(--console-cyan)', borderColor: 'rgba(0, 255, 209, 0.4)' }}
              >
                Preview Background
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="console-btn console-btn-primary"
                style={{ padding: '6px 18px', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Save size={12} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
