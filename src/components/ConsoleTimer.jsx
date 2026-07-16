import React from 'react';

export default function ConsoleTimer({ timeLeft, maxTime }) {
  const displayTime = timeLeft ?? 0;
  const safeMax = maxTime || 60;
  const pct = safeMax > 0 ? Math.max(0, Math.min(1, displayTime / safeMax)) : 0;
  
  // Radius and circumference for SVG circle
  const radius = 70;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius; // 439.82
  const strokeDashoffset = circumference * (1 - pct);

  // Dynamic colors and shadows based on percentage
  let color = 'var(--console-electric-blue)';
  let shadow = 'var(--console-glow-blue)';
  let isWarning = false;
  let isCritical = false;

  if (pct <= 0.2) {
    color = 'var(--console-red)';
    shadow = 'var(--console-glow-red)';
    isCritical = true;
  } else if (pct <= 0.5) {
    color = 'var(--console-amber)';
    shadow = 'var(--console-glow-amber)';
    isWarning = true;
  }

  // Speed of pulsing heartbeat
  let pulseDuration = '2s';
  if (isCritical) {
    pulseDuration = '0.4s';
  } else if (isWarning) {
    pulseDuration = '0.9s';
  }

  return (
    <div 
      className="timer-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '220px',
        height: '220px',
        animation: `timer-heartbeat ${pulseDuration} infinite ease-in-out`,
        transition: 'transform 0.2s ease-in-out'
      }}
    >
      <svg 
        width="200" 
        height="200" 
        viewBox="0 0 160 160"
        style={{
          transform: 'rotate(-90deg)',
          filter: `drop-shadow(0 0 15px ${color})`,
          transition: 'filter 0.4s ease-in-out'
        }}
      >
        <defs>
          <filter id="timerGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Shadow Track (Dim) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={strokeWidth}
        />

        {/* Outer Tech Accents */}
        <circle
          cx="80"
          cy="80"
          r={radius + 4}
          fill="none"
          stroke="rgba(0, 210, 255, 0.08)"
          strokeWidth="1.5"
          strokeDasharray="10 30 50 15"
          style={{
            transformOrigin: 'center',
            animation: 'timer-spin-clockwise 25s infinite linear'
          }}
        />

        <circle
          cx="80"
          cy="80"
          r={radius - 6}
          fill="none"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="1"
          strokeDasharray="4 8"
          style={{
            transformOrigin: 'center',
            animation: 'timer-spin-counter 15s infinite linear'
          }}
        />

        {/* Glowing Progress Ring */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#timerGlow)"
          style={{
            transition: 'stroke-dashoffset 0.25s linear, stroke 0.4s ease-in-out'
          }}
        />
      </svg>

      {/* Timer Numerals Layer */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '3rem',
            fontWeight: 900,
            color: color,
            textShadow: `0 0 15px ${shadow}`,
            letterSpacing: '-1px',
            lineHeight: '1',
            transition: 'color 0.4s ease-in-out, text-shadow 0.4s ease-in-out'
          }}
        >
          {displayTime}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.65rem',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginTop: '4px'
          }}
        >
          Secs
        </span>
      </div>

      <style>{`
        @keyframes timer-heartbeat {
          0% { transform: scale(1.0); }
          50% { transform: scale(1.035); }
          100% { transform: scale(1.0); }
        }
        @keyframes timer-spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes timer-spin-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
