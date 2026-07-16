// Programmatic Web Audio API synthesizers for cinematic console energy
// Runs offline and in-memory with zero asset load lag.

let audioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientGain = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Start low-pass filtered console background hum drone (PS5 UI hum vibes)
 */
export function playAmbientHum() {
  try {
    const ctx = getAudioContext();
    if (ambientOsc1) return; // already running

    const now = ctx.currentTime;
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.012, now); // quiet background noise

    // 55 Hz sub-bass note (A1)
    ambientOsc1 = ctx.createOscillator();
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(55, now);

    // Minor third overtone (65.4 Hz, C2)
    ambientOsc2 = ctx.createOscillator();
    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(65.4, now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);

    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOsc1.start(now);
    ambientOsc2.start(now);
  } catch (e) {
    console.warn('Could not launch background drone:', e);
  }
}

/**
 * Stop background drone
 */
export function stopAmbientHum() {
  try {
    if (ambientOsc1) {
      ambientOsc1.stop();
      ambientOsc1 = null;
    }
    if (ambientOsc2) {
      ambientOsc2.stop();
      ambientOsc2 = null;
    }
    if (ambientGain) {
      ambientGain.disconnect();
      ambientGain = null;
    }
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Play futuristic menu click
 */
export function playClick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.1);
  } catch (e) {
    console.warn('Audio click failed:', e);
  }
}

/**
 * Play a high-end chime arpeggio for achievement unlocked/reveal answer
 */
export function playCorrect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const playNote = (freq, delay, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.0, now + delay);
      gain.gain.linearRampToValueAtTime(0.06, now + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    // Ascending sci-fi major arpeggio: C5 (523Hz) -> G5 (784Hz) -> C6 (1046Hz) -> E6 (1318Hz)
    playNote(523.25, 0, 0.3);
    playNote(783.99, 0.06, 0.3);
    playNote(1046.50, 0.12, 0.3);
    playNote(1318.51, 0.18, 0.55);
  } catch (e) {
    console.warn('Correct chime failed:', e);
  }
}

/**
 * Play low thud for incorrect
 */
export function playIncorrect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.3);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn('Incorrect thud failed:', e);
  }
}

/**
 * Play high-pitched ticking clock. Speeds up and pitches up when critical.
 */
export function playTick(isFast = false) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    const pitch = isFast ? 1600 : 900;
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    
    const duration = isFast ? 0.035 : 0.02;
    const vol = isFast ? 0.08 : 0.045;
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Tick sound failed:', e);
  }
}

/**
 * Play low warning timeout alarm buzzer
 */
export function playTimeout() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.6);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Buzzer failed:', e);
  }
}

/**
 * Play sweeping synth transition slide whoosh
 */
export function playTransition() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.8;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + duration);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + duration);
    filter.Q.setValueAtTime(2.5, now);
    
    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.warn('Transition whoosh failed:', e);
  }
}

/**
 * Play epic victory arpeggio fanfare
 */
export function playVictory() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const chords = [
      { f: 196.00, d: 0, l: 0.2 },    // G3
      { f: 246.94, d: 0.08, l: 0.2 },  // B3
      { f: 293.66, d: 0.16, l: 0.2 },  // D4
      { f: 392.00, d: 0.24, l: 0.2 },  // G4
      { f: 493.88, d: 0.32, l: 0.3 },  // B4
      { f: 587.33, d: 0.40, l: 0.3 },  // D5
      { f: 783.99, d: 0.48, l: 0.4 },  // G5
      { f: 987.77, d: 0.56, l: 0.4 },  // B5
      { f: 1174.66, d: 0.64, l: 0.9 }  // D6
    ];
    
    chords.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + note.d);
      
      gain.gain.setValueAtTime(0.0, now + note.d);
      gain.gain.linearRampToValueAtTime(0.08, now + note.d + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.d + note.l);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + note.d);
      osc.stop(now + note.d + note.l);
    });
  } catch (e) {
    console.warn('Victory failed:', e);
  }
}

/**
 * Play a short, quiet, high-pass console click sound (PS5 hover tick style)
 */
export function playHoverTick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550, now);
    
    gain.gain.setValueAtTime(0.007, now); // quiet focus tick
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.015);
  } catch (e) {
    // Fail silently to avoid interrupting interactions
  }
}

/**
 * Play a sweeping, sci-fi unlock ping sound (PS5 unlock ping style)
 */
export function playUnlockPing() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const playBellNote = (freq, delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + delay + 0.25);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.07, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.35);
    };
    
    playBellNote(440, 0);
    playBellNote(554.37, 0.05);
    playBellNote(659.25, 0.10);
  } catch (e) {
    console.warn('Unlock ping failed:', e);
  }
}

/**
 * Play a quick sliding-down back/cancel dual tone (PS5 cancel UI style)
 */
export function playBackCancel() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
    
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {
    console.warn('Back cancel failed:', e);
  }
}
