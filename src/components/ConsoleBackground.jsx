import React, { useEffect, useRef } from 'react';

export default function ConsoleBackground({ questionText = '', keywords = '' }) {
  const canvasRef = useRef(null);
  
  const getActiveTheme = () => {
    const search = `${questionText} ${keywords}`.toLowerCase();
    if (search.includes('cookie') || search.includes('cake') || search.includes('sugar') || search.includes('moisture')) {
      return 'molecules';
    }
    if (search.includes('ice') || search.includes('float') || search.includes('crystal') || search.includes('lattice')) {
      return 'crystals';
    }
    if (search.includes('slinky') || search.includes('spring') || search.includes('gravity') || search.includes('tension')) {
      return 'waves';
    }
    if (search.includes('silver') || search.includes('tarnish') || search.includes('black')) {
      return 'tarnish';
    }
    if (search.includes('iodine') || search.includes('wound') || search.includes('antiseptic') || search.includes('biology')) {
      return 'bioGrid';
    }
    if (search.includes('fizz') || search.includes('bubble') || search.includes('pressure') || search.includes('bottle')) {
      return 'bubbles';
    }
    if (search.includes('winner') || search.includes('victory') || search.includes('trophy')) {
      return 'victory';
    }
    return 'default';
  };

  const activeTheme = getActiveTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    let interpolationAlpha = 1.0;
    let prevTheme = activeTheme;
    let currentTheme = activeTheme;

    if (currentTheme !== activeTheme) {
      prevTheme = currentTheme;
      currentTheme = activeTheme;
      interpolationAlpha = 0.0;
    }

    // --- SEED VISUAL DATA NODES ---

    // Floating Science & Math Equations/Formulas
    const formulas = [
      "E = mc²",
      "iℏ(∂Ψ/∂t) = ĤΨ",
      "∇ × E = -∂B/∂t",
      "F = G(m₁m₂)/r²",
      "PV = nRT",
      "∫ a→b f(x)dx",
      "λ = h/p",
      "Δx·Δp ≥ ℏ/2",
      "H₂O & CO₂",
      "C₆H₁₂O₆",
      "pH = -log[H⁺]"
    ];

    const scienceFloatingSymbols = Array.from({ length: 15 }).map((_, idx) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      text: formulas[idx % formulas.length],
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.35 + 0.1,
      size: Math.floor(Math.random() * 5) + 12,
      fadeRate: (Math.random() - 0.5) * 0.002
    }));

    const crystalShards = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 40 + 20,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
      spinX: (Math.random() - 0.5) * 0.015,
      spinY: (Math.random() - 0.5) * 0.015,
      spinZ: (Math.random() - 0.5) * 0.015
    }));

    const molecules = Array.from({ length: 22 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 8 + 3,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      pulse: Math.random() * Math.PI
    }));

    const bubbles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: h + Math.random() * 200,
      r: Math.random() * 4 + 1.5,
      speedY: -(Math.random() * 3 + 2.5),
      speedX: (Math.random() - 0.5) * 0.4,
      glow: Math.random() * 0.4 + 0.3
    }));

    const coins = Array.from({ length: 14 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 30 + 15,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      tarnish: Math.random() * 0.6
    }));

    const targets = Array.from({ length: 6 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 40 + 20,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02
    }));

    const hudStars = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.5 + 0.3,
      twinkle: Math.random() * 0.02 + 0.005
    }));

    // --- DRAW TEMPLATES ---

    const drawThemeBackground = (themeName, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;

      if (themeName === 'crystals') {
        crystalShards.forEach((s) => {
          s.x += s.speedX;
          s.y += s.speedY;
          s.rotX += s.spinX;
          s.rotY += s.spinY;
          s.rotZ += s.spinZ;

          if (s.x < -s.size) s.x = w + s.size;
          if (s.x > w + s.size) s.x = -s.size;
          if (s.y < -s.size) s.y = h + s.size;
          if (s.y > h + s.size) s.y = -s.size;

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.strokeStyle = 'rgba(0, 210, 255, 0.42)';
          ctx.lineWidth = 1.2;
          ctx.fillStyle = 'rgba(0, 210, 255, 0.05)';
          ctx.beginPath();
          
          const size = s.size;
          const points = [
            { x: Math.sin(s.rotX) * size, y: Math.cos(s.rotY) * size },
            { x: Math.sin(s.rotX + 2) * size * 0.5, y: Math.cos(s.rotY + 2) * size * 0.5 },
            { x: Math.sin(s.rotX + 4) * size, y: Math.cos(s.rotY + 4) * size },
            { x: 0, y: -size * 0.8 },
            { x: 0, y: size * 0.8 }
          ];

          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.lineTo(points[2].x, points[2].y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          points.slice(0, 3).forEach((p) => {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(points[3].x, points[3].y);
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(points[4].x, points[4].y);
          });
          ctx.stroke();
          ctx.restore();
        });

      } else if (themeName === 'molecules') {
        ctx.strokeStyle = 'rgba(255, 170, 0, 0.12)';
        ctx.lineWidth = 1.0;
        
        for (let i = 0; i < molecules.length; i++) {
          for (let j = i + 1; j < molecules.length; j++) {
            const dist = Math.hypot(molecules[i].x - molecules[j].x, molecules[i].y - molecules[j].y);
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(molecules[i].x, molecules[i].y);
              ctx.lineTo(molecules[j].x, molecules[j].y);
              ctx.stroke();
            }
          }
        }

        molecules.forEach((m) => {
          m.x += m.speedX;
          m.y += m.speedY;
          m.pulse += 0.02;

          if (m.x < -20) m.x = w + 20;
          if (m.x > w + 20) m.x = -20;
          if (m.y < -20) m.y = h + 20;
          if (m.y > h + 20) m.y = -20;

          const size = m.r + Math.sin(m.pulse) * 2;
          const glowRad = size * 3;
          
          const grad = ctx.createRadialGradient(m.x, m.y, size * 0.2, m.x, m.y, glowRad);
          grad.addColorStop(0, 'rgba(255, 170, 0, 0.75)');
          grad.addColorStop(0.3, 'rgba(255, 170, 0, 0.2)');
          grad.addColorStop(1, 'rgba(255, 170, 0, 0)');
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(m.x, m.y, glowRad, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (themeName === 'waves') {
        ctx.strokeStyle = 'rgba(189, 0, 255, 0.22)';
        ctx.lineWidth = 2.0;

        const waveSpacing = 60;
        const waveCount = 5;
        
        for (let i = 0; i < waveCount; i++) {
          ctx.beginPath();
          const amp = 40 + Math.sin(time + i) * 15;
          const freq = 0.005 + (i * 0.001);
          const yOffset = h * 0.2 + (i * waveSpacing);

          for (let x = 0; x < w; x += 15) {
            const y = yOffset + Math.sin(x * freq + time * 3) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(0, 210, 255, 0.18)';
        for (let j = 0; j < 8; j++) {
          const rx = w * 0.15 + (j * (w * 0.1));
          const ry = h * 0.5 + Math.sin(time * 2 + j) * 80;
          ctx.beginPath();
          ctx.ellipse(rx, ry, 45, 15, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

      } else if (themeName === 'tarnish') {
        coins.forEach((c) => {
          c.x += c.speedX;
          c.y += c.speedY;

          if (c.x < -c.r) c.x = w + c.r;
          if (c.x > w + c.r) c.x = -c.r;
          if (c.y < -c.r) c.y = h + c.r;
          if (c.y > h + c.r) c.y = -c.r;

          ctx.save();
          ctx.translate(c.x, c.y);

          ctx.strokeStyle = 'rgba(0, 255, 209, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, c.r, 0, Math.PI * 2);
          ctx.stroke();

          const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, c.r);
          grad.addColorStop(0, '#10141d');
          grad.addColorStop(0.7, '#1e2433');
          grad.addColorStop(1, '#080a0f');
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, c.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.beginPath();
          ctx.arc(0, 0, c.r, -Math.PI / 4, Math.PI);
          ctx.globalAlpha = 0.5 + Math.sin(time + c.r) * 0.15;
          ctx.fill();

          ctx.restore();
        });

      } else if (themeName === 'bioGrid') {
        ctx.strokeStyle = 'rgba(0, 255, 209, 0.22)';
        ctx.lineWidth = 1.0;

        const gridGap = 80;
        for (let x = 0; x < w; x += gridGap) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += gridGap) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        targets.forEach((t) => {
          t.angle += t.spin;
          const pulse = t.r + Math.sin(time * 5 + t.r) * 5;

          ctx.save();
          ctx.translate(t.x, t.y);
          ctx.rotate(t.angle);

          ctx.strokeStyle = 'rgba(0, 255, 209, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, pulse, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-pulse - 8, 0); ctx.lineTo(-pulse + 4, 0);
          ctx.moveTo(pulse - 4, 0); ctx.lineTo(pulse + 8, 0);
          ctx.moveTo(0, -pulse - 8); ctx.lineTo(0, -pulse + 4);
          ctx.moveTo(0, pulse - 4); ctx.lineTo(0, pulse + 8);
          ctx.stroke();

          ctx.fillStyle = 'rgba(0, 255, 209, 0.7)';
          ctx.font = '7px Orbitron';
          ctx.fillText(`SCAN_CELL_${Math.floor(t.x % 99)}`, pulse + 12, 3);

          ctx.restore();
        });

      } else if (themeName === 'bubbles') {
        bubbles.forEach((b) => {
          b.y += b.speedY;
          b.x += b.speedX;

          if (b.y < -20) {
            b.y = h + Math.random() * 150;
            b.x = Math.random() * w;
          }

          ctx.strokeStyle = `rgba(0, 210, 255, ${b.glow})`;
          ctx.fillStyle = 'rgba(0, 210, 255, 0.04)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = `rgba(0, 210, 255, ${b.glow * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y + b.r);
          ctx.lineTo(b.x, b.y + b.r + 15);
          ctx.stroke();
        });

      } else if (themeName === 'victory') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, 'rgba(0, 210, 255, 0.03)');
        grad.addColorStop(0.5, 'rgba(189, 0, 255, 0.06)');
        grad.addColorStop(1, 'rgba(255, 170, 0, 0.03)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 170, 0, 0.15)';
        ctx.lineWidth = 1.0;
        const rays = 24;
        const cx = w / 2;
        const cy = h / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.15);
        for (let i = 0; i < rays; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(i * (Math.PI * 2 / rays)) * w, Math.sin(i * (Math.PI * 2 / rays)) * h);
          ctx.stroke();
        }
        ctx.restore();

      } else {
        hudStars.forEach((s) => {
          s.brightness += s.twinkle;
          if (s.brightness > 0.9 || s.brightness < 0.15) {
            s.twinkle = -s.twinkle;
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${s.brightness * 0.65})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.strokeStyle = 'rgba(0, 210, 255, 0.04)';
        ctx.lineWidth = 1.0;
        const gridX = 20;
        const step = w / gridX;
        
        ctx.beginPath();
        for (let i = 0; i <= gridX; i++) {
          const x = i * step;
          ctx.moveTo(x, h * 0.6);
          ctx.lineTo(x + (x - w/2) * 0.8, h);
        }
        const horizY = [0.6, 0.68, 0.77, 0.88, 1.0];
        horizY.forEach((factor) => {
          ctx.moveTo(0, h * factor);
          ctx.lineTo(w, h * factor);
        });
        ctx.stroke();
      }

      ctx.restore();
    };

    // --- ANIMATION LOOP ---

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      time += 0.005;

      // Draw Shifting Colorful background auras directly in canvas (screen blend mode)
      ctx.save();
      
      // Nebula Blob 1 (Cyan)
      const cx1 = w * 0.3 + Math.sin(time) * 120;
      const cy1 = h * 0.4 + Math.cos(time) * 80;
      const grad1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, 400);
      grad1.addColorStop(0, 'rgba(0, 210, 255, 0.08)');
      grad1.addColorStop(0.5, 'rgba(0, 210, 255, 0.02)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath(); ctx.arc(cx1, cy1, 400, 0, Math.PI*2); ctx.fill();

      // Nebula Blob 2 (Neon Purple)
      const cx2 = w * 0.7 + Math.cos(time * 0.7) * 150;
      const cy2 = h * 0.6 + Math.sin(time * 0.7) * 100;
      const grad2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, 450);
      grad2.addColorStop(0, 'rgba(189, 0, 255, 0.07)');
      grad2.addColorStop(0.5, 'rgba(189, 0, 255, 0.01)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath(); ctx.arc(cx2, cy2, 450, 0, Math.PI*2); ctx.fill();

      // Nebula Blob 3 (Hot Pink/Red)
      const cx3 = w * 0.5 + Math.sin(time * 1.2) * 80;
      const cy3 = h * 0.2 + Math.cos(time * 0.8) * 60;
      const grad3 = ctx.createRadialGradient(cx3, cy3, 10, cx3, cy3, 350);
      grad3.addColorStop(0, 'rgba(255, 0, 85, 0.06)');
      grad3.addColorStop(0.5, 'rgba(255, 0, 85, 0.01)');
      grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad3;
      ctx.beginPath(); ctx.arc(cx3, cy3, 350, 0, Math.PI*2); ctx.fill();

      ctx.restore();

      // Draw subtle grid overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.lineWidth = 1;
      const gSize = 120;
      for (let x = 0; x < w; x += gSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Floating Sci-Fi Math/Physics/Chem Telemetry symbols
      scienceFloatingSymbols.forEach((s) => {
        s.x += s.speedX;
        s.y += s.speedY;
        s.opacity += s.fadeRate;

        if (s.opacity > 0.45 || s.opacity < 0.05) {
          s.fadeRate = -s.fadeRate;
        }

        if (s.x < -100) s.x = w + 100;
        if (s.x > w + 100) s.x = -100;
        if (s.y < -50) s.y = h + 50;
        if (s.y > h + 50) s.y = -50;

        ctx.fillStyle = `rgba(0, 210, 255, ${s.opacity * 0.75})`;
        ctx.font = `${s.size}px Orbitron`;
        ctx.fillText(s.text, s.x, s.y);
      });

      // Smooth cross-fade interpolation manager
      if (interpolationAlpha < 1.0) {
        interpolationAlpha = Math.min(1.0, interpolationAlpha + 0.025);
      }

      if (interpolationAlpha < 1.0) {
        drawThemeBackground(prevTheme, 1.0 - interpolationAlpha);
        drawThemeBackground(currentTheme, interpolationAlpha);
      } else {
        drawThemeBackground(currentTheme, 1.0);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [activeTheme]);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -5
      }}
    />
  );
}
