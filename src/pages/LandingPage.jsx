import React, { useState, useEffect } from 'react';
import { Monitor, Settings, Lock, Sparkles, User, Award, ShieldAlert, Cpu, Play, Scroll } from 'lucide-react';
import { playClick, playTransition } from '../lib/audio';
import { subscribeToSyncEvents } from '../lib/sync';

const HOUSE_PLAYERS = {
  fraternity: {
    name: "FRATERNITY",
    color: "#00c853",
    glow: "rgba(0, 200, 83, 0.4)",
    mascot: "/images/mascots/jungle.png",
    teamA: [
      { name: "M Akhilesh Yadav", class: "XI D" },
      { name: "Jaykumar Rameshbhai", class: "XI C" },
      { name: "Hasin Hasana G", class: "XII C" },
      { name: "Nitika J", class: "XII C" }
    ],
    teamB: [
      { name: "Josith R I", class: "XI C" },
      { name: "Pacharaphat", class: "XI B" },
      { name: "Vishnuram M", class: "XII A" },
      { name: "Mukund Satija", class: "XII B" }
    ]
  },
  eternity: {
    name: "ETERNITY",
    color: "#ff0080",
    glow: "rgba(255, 0, 128, 0.4)",
    mascot: "/images/mascots/space.png",
    teamA: [
      { name: "S Sai Shravvan", class: "XI C" },
      { name: "Sarang A P", class: "XI C" },
      { name: "Samyaa Sri B", class: "XII B" },
      { name: "Pranav V", class: "XII B" }
    ],
    teamB: [
      { name: "Abinav J B", class: "XI C" },
      { name: "Guru Aadhith U K", class: "XI C" },
      { name: "Kashika Vivekanandan", class: "XII C" },
      { name: "Ashwath Gopalakrishnan", class: "XII C" }
    ]
  },
  equality: {
    name: "EQUALITY",
    color: "#00b0ff",
    glow: "rgba(0, 176, 255, 0.4)",
    mascot: "/images/mascots/ice.png",
    teamA: [
      { name: "E K Kaneamutan", class: "XI E" },
      { name: "S Adhithya Arnav", class: "XI B" },
      { name: "Rushyendra Chowdary", class: "XII D" },
      { name: "Tarun Dominic", class: "XII B" }
    ],
    teamB: [
      { name: "S P Sanjay Pranav", class: "XI C" },
      { name: "S Subanethra", class: "XI A" },
      { name: "Pranaya E", class: "XII A" },
      { name: "Surya Rashmi S", class: "XII A" }
    ]
  }
};

const SCROLL_LOCATIONS = [
  {
    round: 1,
    title: "QUANTUM SYLLOGISMS",
    desc: "Scientific Reasoning & logic gates. Spot Scroll 01 to decrypt Sector 1!",
    name: "School Entrance",
    image: "/images/corridors/entrance.jpg",
    mascot: "/images/mascots/space.png",
    mascotMsg: "Rangers! A hidden data scroll has drifted onto the roadway on the right side. Spot it to decrypt Sector 01!",
    scrollPos: { top: "78%", left: "88%" },
    route: "presenter"
  },
  {
    round: 2,
    title: "BIOMETRIC EQUATIONS",
    desc: "PPT Questions 1-6. Spot Scroll 02 in the canopy sports hall to boot Sector 2!",
    name: "Canopy Corridor",
    image: "/images/corridors/corridor.jpg",
    mascot: "/images/mascots/jungle.png",
    mascotMsg: "The second coordinates are drifting around the sports hall black screen area. Find it to decrypt Sector 02!",
    scrollPos: { top: "70%", left: "49%" },
    route: "presenter"
  },
  {
    round: 3,
    title: "GLACIAL MATRICES",
    desc: "PPT Questions 7-12 (Picture Connect). Spot Scroll 03 in the dormitory to boot Sector 3!",
    name: "School Hostel",
    image: "/images/corridors/hostel.png",
    mascot: "/images/mascots/ice.png",
    mascotMsg: "Explorers! A cryptographic scroll has slipped onto the window sill of the bunk beds. Discover it for Sector 03!",
    scrollPos: { top: "62%", left: "26%" },
    route: "presenter"
  },
  {
    round: 4,
    title: "THERMODYNAMIC ENTROPY",
    desc: "Entropy & Thermodynamic laws. Spot Scroll 04 in the lobby reception desks to boot Sector 4!",
    name: "School Office",
    image: "/images/corridors/office.jpg",
    mascot: "/images/mascots/water.png",
    mascotMsg: "The fourth data scroll is lodged somewhere in the lobby reception desks. Find it to unlock training logs!",
    scrollPos: { top: "20%", left: "84%" },
    route: "presenter"
  },
  {
    round: 5,
    title: "EXPERIMENTAL VECTOR FIELDS",
    desc: "Live laboratory demonstrations. Spot Scroll 05 on the volleyball court to boot Stage Sector 5!",
    name: "Volleyball Court",
    image: "/images/corridors/volleyball.jpg",
    mascot: "/images/mascots/sky.png",
    mascotMsg: "Rangers! The final scroll is floating in mid-air on the volleyball court. Secure it to lock in your score!",
    scrollPos: { top: "21%", left: "50.5%" },
    route: "presenter"
  }
];

export default function LandingPage({ navigateTo }) {
  // Use sessionStorage to remember if the finalists intro has been seen in this tab session
  const hasEntered = sessionStorage.getItem('finalists_introduced') === 'true';
  
  const [viewState, setViewState] = useState(hasEntered ? 'map' : 'launcher'); // 'launcher', 'intro', 'map', 'zooming'
  const [selectedHouse, setSelectedHouse] = useState('fraternity');
  const [activeScrollIdx, setActiveScrollIdx] = useState(0);
  const [scrollFound, setScrollFound] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [zoomTarget, setZoomTarget] = useState({ top: "50%", left: "50%" });

  // Sync active scroll index based on completed rounds from localStorage (with real-time cross-tab sync)
  useEffect(() => {
    const syncScrollIndex = () => {
      const completed = Array.from(new Set(JSON.parse(localStorage.getItem('completed_rounds') || '[]')));
      const activeIdx = Math.min(4, completed.length);
      setActiveScrollIdx(activeIdx);
    };

    syncScrollIndex();

    // Statically subscribe to sync events to update map in real-time
    const unsubscribe = subscribeToSyncEvents((event) => {
      if (event.type === 'SYNC_QUESTIONS' || event.type === 'COMPLETE_ROUND' || event.type === 'RESTART_EXPEDITION') {
        syncScrollIndex();
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleEnterPortal = () => {
    playTransition();
    sessionStorage.setItem('finalists_introduced', 'true');
    setViewState('map');
  };

  const handleScrollClick = (loc) => {
    playTransition();
    setZoomTarget(loc.scrollPos);
    setScrollFound(true);
    setTimeout(() => {
      setShowUnlockModal(true);
    }, 600);
  };

  const handleBootRound = (loc) => {
    setShowUnlockModal(false);
    playTransition();
    setViewState('zooming');
    
    // PS5 game boot zoom transition
    setTimeout(() => {
      localStorage.setItem('active_round', String(loc.round));
      navigateTo(loc.route);
    }, 1200);
  };

  // Reset scroll progress utility for Admin/Hosts
  const handleResetMapProgress = () => {
    playClick();
    localStorage.removeItem('completed_rounds');
    setActiveScrollIdx(0);
    setScrollFound(false);
    setShowUnlockModal(false);
  };

  const currentHouse = HOUSE_PLAYERS[selectedHouse];
  const activeLoc = SCROLL_LOCATIONS[activeScrollIdx];

  // PS5 Game Boot full-screen zoom render state
  if (viewState === 'zooming') {
    return (
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#040509',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url('${activeLoc.image}')`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            transformOrigin: `${zoomTarget.left} ${zoomTarget.top}`,
            animation: 'ps5-boot-zoom 1.5s cubic-bezier(0.7, 0, 0.3, 1) forwards'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, transparent 20%, #040509 90%)',
            animation: 'fade-to-black 1.5s ease-in forwards',
            zIndex: 5
          }}
        />
        
        {/* Holographic boot status text overlay */}
        <div style={{ zIndex: 10, textAlign: 'center', fontFamily: 'var(--font-hud)', color: 'var(--console-cyan)', textShadow: '0 0 10px var(--console-cyan)' }}>
          <h2 style={{ fontSize: '1.2rem', letterSpacing: '8px', textTransform: 'uppercase', animation: 'blink 0.5s infinite alternate' }}>
            // LAUNCHING SYSTEM_DECRYPT_0{activeLoc.round}
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#fff', opacity: 0.6, display: 'block', marginTop: '10px' }}>
            CONNECTING ST. JUDE'S HOST PORTAL...
          </span>
        </div>

        <style>{`
          @keyframes ps5-boot-zoom {
            0% { transform: scale(1); filter: blur(0px); }
            100% { transform: scale(7); filter: blur(5px); }
          }
          @keyframes fade-to-black {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes blink {
            from { opacity: 0.3; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Map search game loop screen
  if (viewState === 'map') {
    const completed = Array.from(new Set(JSON.parse(localStorage.getItem('completed_rounds') || '[]')));
    const isGameFinished = completed.length === 5;

    if (isGameFinished) {
      return (
        <div 
          style={{
            width: '100vw',
            height: '100vh',
            background: "url('/images/ppt2022/image67.gif') no-repeat center center / cover",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#ffffff',
            overflow: 'hidden',
            position: 'relative',
            padding: '40px'
          }}
        >
          {/* Dim overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(5,6,11,0.5) 0%, rgba(5,6,11,0.9) 100%)', zIndex: 1 }} />

          <div 
            style={{
              zIndex: 10,
              textAlign: 'center',
              background: 'rgba(10,13,22,0.85)',
              border: '2px solid #ffaa00',
              boxShadow: '0 0 45px rgba(255, 170, 0, 0.35)',
              borderRadius: '12px',
              padding: '50px 70px',
              maxWidth: '750px',
              backdropFilter: 'blur(10px)',
              animation: 'panel-fade-in 0.8s ease-out',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <Award size={64} color="#ffaa00" style={{ filter: 'drop-shadow(0 0 15px #ffaa00)', animation: 'spin-trophy 8s infinite linear' }} />
            
            <span style={{ fontSize: '0.8rem', color: '#ffaa00', fontWeight: 800, letterSpacing: '6px', fontFamily: 'var(--font-hud)', textTransform: 'uppercase' }}>
              // ALL SECURE ARCHIVES DECRYPTED
            </span>

            <h1 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3.2rem',
                fontWeight: 900,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                margin: '10px 0',
                textShadow: '0 0 30px rgba(255, 170, 0, 0.45)',
                background: 'linear-gradient(to bottom, #ffffff 40%, #ffaa00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Thank You For Playing!
            </h1>

            <p style={{ fontFamily: 'var(--font-main)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', maxWidth: '580px' }}>
              The St. Jude's Tech Hub Zone decryption expedition has concluded. All cadet house files and experimental telemetry have been logged successfully.
            </p>

            <div style={{ height: '1.5px', background: 'rgba(255,255,255,0.1)', width: '100%', margin: '10px 0' }} />

            {/* Reset button to start over */}
            <button
              onClick={() => {
                playClick();
                localStorage.removeItem('completed_rounds');
                sessionStorage.removeItem('finalists_introduced');
                window.location.reload();
              }}
              style={{
                padding: '12px 35px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                borderRadius: '5px',
                background: 'transparent',
                border: '1.5px solid var(--console-cyan)',
                color: 'var(--console-cyan)',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0, 255, 209, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 209, 0.1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 209, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 209, 0.1)';
              }}
            >
              Reboot System
            </button>
          </div>
          <style>{`
            @keyframes spin-trophy {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes panel-fade-in {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      );
    }

    return (
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          background: `url('${activeLoc.image}') no-repeat center center / cover`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '30px 40px',
          color: '#ffffff',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.8s ease-in-out'
        }}
      >
        {/* Dark map vignette overlay */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 1, 
            background: 'radial-gradient(circle at center, rgba(4,5,9,0.1) 0%, rgba(4,5,9,0.7) 100%)',
            pointerEvents: 'none'
          }} 
        />

        {/* Map Header HUD */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-badge" style={{ backgroundColor: 'var(--console-cyan)', boxShadow: '0 0 8px var(--console-cyan)' }} />
              <span style={{ fontFamily: 'var(--font-hud)', color: 'var(--console-cyan)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '3px' }}>
                MISSION LOCATIONS ENGINE
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '3px' }}>
              SPOT THE HIDDEN ROUND SCROLL
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => { playClick(); setViewState('intro'); }} 
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.7rem',
                letterSpacing: '2px',
                padding: '6px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              VIEW FINALISTS SQUAD
            </button>
            <button 
              onClick={handleResetMapProgress}
              style={{
                background: 'rgba(255,0,85,0.1)',
                border: '1.5px solid rgba(255,0,85,0.3)',
                color: '#ff0055',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.7rem',
                letterSpacing: '2px',
                padding: '6px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              RESET MAP
            </button>
          </div>
        </div>

        {/* HIDDEN SCROLL INTERACTION LAYER */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>
          {!scrollFound && (
            <div
              onClick={() => handleScrollClick(activeLoc)}
              style={{
                position: 'absolute',
                top: activeLoc.scrollPos.top,
                left: activeLoc.scrollPos.left,
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                border: '1.2px solid rgba(223, 194, 141, 0.55)',
                background: 'rgba(15, 12, 8, 0.7)',
                animation: 'pulse-traditional-scroll 2.5s infinite ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animation = 'none';
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(223, 194, 141, 0.5)';
                e.currentTarget.style.background = 'rgba(223, 194, 141, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animation = 'pulse-traditional-scroll 2.5s infinite ease-in-out';
              }}
            >
              {/* Glowing scroll SVG symbol */}
              <Scroll size={22} color="#dfc28d" style={{ filter: 'drop-shadow(0 0 3px rgba(223, 194, 141, 0.4))' }} />
            </div>
          )}
        </div>

        {/* MASCOT TALK OVERLAY BOX */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '20px', alignItems: 'flex-end', width: '50%', maxWidth: '650px', background: 'rgba(11,13,22,0.9)', borderLeft: '4px solid var(--console-cyan)', padding: '18px 25px', borderRadius: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', zIndex: 10, alignSelf: 'flex-start', marginLeft: '20px', marginTop: '20px' }}>
          <img src={activeLoc.mascot} alt="Mascot Guide" style={{ width: '100px', height: '110px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px var(--console-cyan))' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.62rem', color: 'var(--console-cyan)', fontWeight: 'bold', letterSpacing: '2px' }}>
              // DECRYPT GUIDE: {activeLoc.name}
            </span>
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '0.85rem', color: '#fff', lineHeight: '1.4' }}>
              "{activeLoc.mascotMsg}"
            </p>
          </div>
        </div>

        {/* HUD FOOTER TELEMETRY MAP STATS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,13,22,0.85)', padding: '12px 25px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '30px', fontFamily: 'var(--font-hud)', fontSize: '0.7rem' }}>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>CURRENT LOCATION:</span>
              <span style={{ color: 'var(--console-cyan)', fontWeight: 'bold', marginLeft: '8px', textTransform: 'uppercase' }}>{activeLoc.name}</span>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>TARGET SECTOR:</span>
              <span style={{ color: '#fff', fontWeight: 'bold', marginLeft: '8px' }}>ROUND 0{activeLoc.round}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4, 5].map((rNum) => {
              const isCompleted = JSON.parse(localStorage.getItem('completed_rounds') || '[]').includes(rNum);
              const isActive = activeLoc.round === rNum;
              return (
                <div 
                  key={rNum}
                  style={{
                    width: '35px',
                    height: '24px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    background: isCompleted 
                      ? 'rgba(0, 255, 209, 0.25)' 
                      : isActive 
                        ? 'rgba(0, 210, 255, 0.4)' 
                        : 'rgba(255,255,255,0.05)',
                    border: isActive 
                      ? '1px solid var(--console-cyan)' 
                      : isCompleted 
                        ? '1px solid rgba(0, 255, 209, 0.4)' 
                        : '1px solid rgba(255,255,255,0.1)',
                    color: isCompleted ? 'var(--console-cyan)' : isActive ? '#fff' : 'rgba(255,255,255,0.3)'
                  }}
                >
                  R0{rNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* DECIPHER ROUND DESCRIPTION MODAL (PS5 BOOT DECK OVERLAY) */}
        {showUnlockModal && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(4,5,9,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
          >
            <div 
              className="console-panel hud-cut-tr"
              style={{
                width: '520px',
                background: 'linear-gradient(135deg, rgba(14,17,26,0.98) 0%, rgba(10,12,20,0.95) 100%)',
                border: '2.5px solid var(--console-cyan)',
                boxShadow: '0 0 45px var(--console-glow-cyan)',
                padding: '40px',
                textAlign: 'center',
                animation: 'scale-up-modal 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
            >
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.75rem', color: 'var(--console-cyan)', letterSpacing: '4px', display: 'block', marginBottom: '10px' }}>
                ★ SECURITY DATA SCROLL DECRYPTED ★
              </span>
              
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '1.5px', marginBottom: '15px' }}>
                ROUND 0{activeLoc.round}: {activeLoc.title}
              </h2>
              
              <p style={{ fontFamily: 'var(--font-main)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '30px' }}>
                {activeLoc.desc}
              </p>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    playClick();
                    setScrollFound(false);
                    setShowUnlockModal(false);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.85rem',
                    letterSpacing: '2px',
                    padding: '12px 25px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  DISMISS
                </button>
                
                {activeLoc.locked ? (
                  <button
                    disabled
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)',
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.85rem',
                      letterSpacing: '2px',
                      padding: '12px 25px',
                      borderRadius: '4px',
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Lock size={14} /> LOCKED
                  </button>
                ) : (
                  <button
                    onClick={() => handleBootRound(activeLoc)}
                    style={{
                      background: 'linear-gradient(135deg, var(--console-cyan) 0%, var(--console-electric-blue) 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      padding: '12px 30px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(0, 255, 209, 0.4)'
                    }}
                  >
                    BOOT ROUND 0{activeLoc.round}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes scale-up-modal {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .live-badge {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            animation: pulse-green 1.5s infinite alternate;
          }
          @keyframes pulse-green {
            from { transform: scale(0.95); opacity: 0.5; }
            to { transform: scale(1.15); opacity: 1; }
          }
          @keyframes pulse-traditional-scroll {
            0% {
              opacity: 0.45;
              box-shadow: 0 0 6px rgba(223, 194, 141, 0.15);
              background: rgba(223, 194, 141, 0.03);
            }
            50% {
              opacity: 0.8;
              box-shadow: 0 0 16px rgba(223, 194, 141, 0.45);
              background: rgba(223, 194, 141, 0.15);
            }
            100% {
              opacity: 0.45;
              box-shadow: 0 0 6px rgba(223, 194, 141, 0.15);
              background: rgba(223, 194, 141, 0.03);
            }
          }
        `}</style>
      </div>
    );
  }

  // Splash/Launcher screen for Tech Hub Zone
  if (viewState === 'launcher') {
    return (
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          background: "url('/images/ppt2022/image58.gif') no-repeat center center / cover",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Dim overlay behind content */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 1, 
            background: 'radial-gradient(circle, rgba(5,6,11,0.55) 0%, rgba(5,6,11,0.85) 100%)' 
          }} 
        />

        {/* Center Panel Container */}
        <div 
          style={{
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
            textAlign: 'center',
            padding: '40px 50px',
            background: 'rgba(10,13,22,0.82)',
            border: '1.5px solid rgba(0, 255, 209, 0.25)',
            borderRadius: '10px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(0, 255, 209, 0.05)',
            maxWidth: '680px',
            backdropFilter: 'blur(10px)',
            animation: 'panel-fade-in 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards'
          }}
        >
          {/* St. Jude Badge / Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--console-cyan)', letterSpacing: '5px', textTransform: 'uppercase', fontFamily: 'var(--font-hud)' }}>
              ST. JUDE'S PUBLIC SCHOOL & JUNIOR COLLEGE
            </span>
            <div style={{ width: '40px', height: '1.5px', background: 'var(--console-cyan)', opacity: 0.6, marginTop: '5px' }} />
          </div>

          {/* Glowing Welcome Title */}
          <div>
            <h1 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.8rem',
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                background: 'linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.72) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 25px rgba(0, 255, 209, 0.25)'
              }}
            >
              Welcome to St. Jude's<br />
              <span style={{ color: 'var(--console-cyan)', WebkitTextFillColor: 'initial', textShadow: '0 0 30px var(--console-glow-cyan)' }}>
                Tech Hub Zone
              </span>
            </h1>
            <p style={{ fontFamily: 'var(--font-hud)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '3px', marginTop: '12px' }}>
              DECRYPTION CORES ACTIVE | SYSTEM STATUS: ONLINE
            </p>
          </div>

          {/* Interactive Launch Button */}
          <button
            onClick={() => {
              playTransition();
              setViewState('intro');
            }}
            style={{
              padding: '15px 40px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              borderRadius: '5px',
              background: 'linear-gradient(135deg, var(--console-cyan) 0%, #0088cc 100%)',
              border: 'none',
              boxShadow: '0 0 25px var(--console-glow-cyan)',
              color: '#05060b',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 35px var(--console-glow-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px var(--console-glow-cyan)';
            }}
          >
            <Play size={15} fill="#05060b" /> Launch Game Mode
          </button>
        </div>

        <style>{`
          @keyframes panel-fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Default: PS5 finalists squad card deck screen
  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        background: "url('/images/ppt2022/image58.gif') no-repeat center center / cover",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '35px 50px',
        color: '#ffffff',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Dim overlay behind content */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1, 
          background: 'rgba(5, 6, 11, 0.45)' 
        }} 
      />

      {/* HEADER BRANDING */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--console-cyan)', boxShadow: '0 0 10px var(--console-cyan)' }} />
            <span style={{ fontFamily: 'var(--font-hud)', color: 'var(--console-cyan)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>
              ST. JUDE'S PUBLIC SCHOOL & JUNIOR COLLEGE
            </span>
          </div>
          <h1 
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginTop: '5px',
              textShadow: '0 0 20px rgba(0, 255, 209, 0.3)'
            }}
          >
            MATHS & SCIENCE QUIZ – FINALIST 2026
          </h1>
        </div>
        <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 15px', borderRadius: '4px' }}>
          SELECT HOUSE TO REVEAL SQUAD
        </div>
      </div>

      {/* MAIN GAME INTRO DECKS */}
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: '20px', flex: 1, margin: '20px 0', zIndex: 10 }}>
        {/* HOUSE SELECTION TABS (PS5 Game Carousel Tabs) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
          {Object.keys(HOUSE_PLAYERS).map((key) => {
            const h = HOUSE_PLAYERS[key];
            const isSelected = selectedHouse === key;
            return (
              <div 
                key={key}
                onClick={() => {
                  playClick();
                  setSelectedHouse(key);
                }}
                className="console-panel"
                style={{
                  padding: '12px 35px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${h.color}` : '1.5px solid rgba(255,255,255,0.1)',
                  background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(10, 13, 22, 0.85)',
                  boxShadow: isSelected ? `0 0 25px ${h.glow}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <img src={h.mascot} alt={h.name} style={{ width: '32px', height: '32px', objectFit: 'contain', filter: isSelected ? `drop-shadow(0 0 8px ${h.color})` : 'grayscale(0.6)' }} />
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '1.05rem', fontWeight: 900, letterSpacing: '3px', color: isSelected ? h.color : '#a0a0a0' }}>
                  {h.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* SQUAD DETAILS CONTAINER */}
        <div className="roster-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 280px 1.2fr', gap: '30px', alignItems: 'center', height: '100%', minHeight: '320px' }}>
          {/* Team A Card */}
          <div 
            className="console-panel hud-cut-tr"
            style={{
              background: 'linear-gradient(135deg, rgba(14,17,26,0.95) 0%, rgba(10,12,20,0.8) 100%)',
              borderLeft: `5px solid ${currentHouse.color}`,
              boxShadow: `0 0 35px ${currentHouse.glow}`,
              padding: '30px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'all 0.5s ease-in-out'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: currentHouse.color, letterSpacing: '3px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              TEAM A
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentHouse.teamA.map((player, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 15px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'var(--font-main)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-hud)', color: currentHouse.color, fontWeight: 'bold', fontSize: '0.8rem' }}>
                      0{idx + 1}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
                      {player.name}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '4px' }}>
                    {player.class}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Central Mascot Hologram */}
          <div className="roster-mascot-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div 
              style={{
                animation: 'float-mascot 4s infinite ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <img 
                src={currentHouse.mascot} 
                alt="House Mascot" 
                style={{
                  width: '180px',
                  height: '220px',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 25px ${currentHouse.color})`,
                  transition: 'all 0.5s ease-in-out'
                }}
              />
            </div>
            <div 
              style={{
                width: '150px',
                height: '25px',
                background: `radial-gradient(ellipse at center, ${currentHouse.color} 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'scaleY(0.3)',
                boxShadow: `0 0 20px ${currentHouse.color}`,
                marginTop: '-15px',
                opacity: 0.7
              }}
            />
          </div>

          {/* Team B Card */}
          <div 
            className="console-panel hud-cut-tr"
            style={{
              background: 'linear-gradient(135deg, rgba(14,17,26,0.95) 0%, rgba(10,12,20,0.8) 100%)',
              borderLeft: `5px solid ${currentHouse.color}`,
              boxShadow: `0 0 35px ${currentHouse.glow}`,
              padding: '30px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'all 0.5s ease-in-out'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: currentHouse.color, letterSpacing: '3px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              TEAM B
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentHouse.teamB.map((player, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 15px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'var(--font-main)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-hud)', color: currentHouse.color, fontWeight: 'bold', fontSize: '0.8rem' }}>
                      0{idx + 1}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
                      {player.name}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '4px' }}>
                    {player.class}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LAUNCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <button
          onClick={handleEnterPortal}
          style={{
            padding: '16px 50px',
            fontFamily: 'var(--font-hud)',
            fontSize: '1.15rem',
            fontWeight: 900,
            letterSpacing: '5px',
            color: '#ffffff',
            background: 'linear-gradient(135deg, var(--console-cyan) 0%, var(--console-electric-blue) 100%)',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 0 35px var(--console-glow-cyan)',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 209, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 35px var(--console-glow-cyan)';
          }}
        >
          <Play size={20} fill="#ffffff" /> ENTER EXPEDITION
        </button>
      </div>

      {/* FOOTER BAR */}
      <div 
        style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          paddingTop: '20px', 
          marginTop: '20px',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-hud)',
          fontSize: '0.68rem',
          color: 'rgba(255, 255, 255, 0.4)',
          zIndex: 10
        }}
      >
        <span>QUEST MATRIX V8.1 • ST. JUDE'S</span>
        <span>AUDITORIUM SQUAD DEPLOYED</span>
      </div>

      <style>{`
        @keyframes float-mascot {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
