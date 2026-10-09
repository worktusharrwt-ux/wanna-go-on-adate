// Cute cartoon-style audio manager & background music engine

const STORAGE_KEY = 'date_sim_sound_enabled';
const DEFAULT_VOLUME = 0.18; // 18% volume (in requested 15-20% range)

// Singleton HTML Audio Element for background tune
let bgmAudio = null;
let isAudioInitialized = false;
let isSoundEnabled = true; // Default sound preference
const stateSubscribers = new Set();

// Web Audio Context for interactive sound effects (chimes, dodges)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function notifySubscribers() {
  const state = getMusicState();
  stateSubscribers.forEach((cb) => {
    try {
      cb(state);
    } catch (e) {
      console.warn('Audio subscriber error:', e);
    }
  });
}

/**
 * Initialize background music singleton.
 * Runs once and never restarts the track across component re-renders.
 */
export function initBackgroundMusic() {
  if (typeof window === 'undefined' || isAudioInitialized) {
    return;
  }
  isAudioInitialized = true;

  // Retrieve saved sound preference (default: true if not explicitly set to 'false')
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      isSoundEnabled = saved === 'true';
    } else {
      isSoundEnabled = true;
    }
  } catch (e) {
    isSoundEnabled = true;
  }

  // Create HTML Audio element
  try {
    bgmAudio = new Audio();
    bgmAudio.preload = 'auto';
    bgmAudio.loop = true;
    bgmAudio.volume = DEFAULT_VOLUME;

    // Provide primary MP3 with WAV fallback
    const sourceMp3 = '/audio/cute-cartoon-melody.mp3';
    const sourceWav = '/audio/cute-cartoon-melody.wav';

    bgmAudio.src = sourceMp3;

    // Graceful fallback to WAV if MP3 is not supported or missing
    bgmAudio.addEventListener('error', (err) => {
      if (bgmAudio.src.endsWith('.mp3')) {
        console.info('Switching background audio source to WAV fallback...');
        bgmAudio.src = sourceWav;
        if (isSoundEnabled) {
          bgmAudio.play().catch(() => {});
        }
      } else {
        console.warn('Background audio could not be loaded (graceful degradation):', err);
      }
    });

    // Handle initial playback or autoplay restriction
    if (isSoundEnabled) {
      attemptPlaybackWithUserGestureFallback();
    }
  } catch (err) {
    console.warn('Could not initialize HTML Audio element:', err);
  }
}

/**
 * Attempt to play audio immediately.
 * If the browser blocks autoplay, register one-time user interaction listeners to start playback.
 */
function attemptPlaybackWithUserGestureFallback() {
  if (!bgmAudio) return;

  const playPromise = bgmAudio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        notifySubscribers();
      })
      .catch((error) => {
        // Autoplay policy prevented playback, wait for first user gesture
        const unlockAudio = () => {
          if (isSoundEnabled && bgmAudio && bgmAudio.paused) {
            bgmAudio.play().then(() => {
              notifySubscribers();
            }).catch(() => {});
            // Also resume Web Audio context if needed
            getAudioContext();
          }
          cleanupGestureListeners();
        };

        const cleanupGestureListeners = () => {
          ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
            window.removeEventListener(evt, unlockAudio);
          });
        };

        ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
          window.addEventListener(evt, unlockAudio, { once: true, passive: true });
        });
      });
  }
}

/**
 * Toggle Background Music ON / OFF
 * Updates persistent preference in localStorage
 */
export function toggleMusic() {
  if (!bgmAudio) {
    initBackgroundMusic();
  }

  isSoundEnabled = !isSoundEnabled;

  try {
    localStorage.setItem(STORAGE_KEY, isSoundEnabled ? 'true' : 'false');
  } catch (e) {}

  if (isSoundEnabled) {
    if (bgmAudio) {
      bgmAudio.play().catch(() => {});
    }
    // Also unlock Web Audio Context
    getAudioContext();
  } else {
    if (bgmAudio) {
      bgmAudio.pause();
    }
  }

  notifySubscribers();
  return isSoundEnabled;
}

/**
 * Get current music/sound status
 */
export function getMusicState() {
  if (!isSoundEnabled) return false;
  if (!bgmAudio) return isSoundEnabled;
  return !bgmAudio.paused;
}

/**
 * Check if sound is enabled overall (including pending autoplay)
 */
export function isSoundPrefEnabled() {
  return isSoundEnabled;
}

/**
 * Subscribe to audio state changes (for UI buttons)
 */
export function subscribeMusicState(callback) {
  stateSubscribers.add(callback);
  return () => {
    stateSubscribers.delete(callback);
  };
}

// ---------------------------------------------------------------------------
// INTERACTIVE SFX SYNTHESIZERS (Respecting master sound preference)
// ---------------------------------------------------------------------------

export function playChime(freq = 523.25, type = 'sine', duration = 0.6) {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export function playCelebrationMelody() {
  if (!isSoundEnabled) return;
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5, 1567.98];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playChime(freq, 'sine', 1.2);
    }, i * 90);
  });
}

export function playDodgeSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

// Aliases for compatibility
export const toggleMute = toggleMusic;
export const getMuteState = () => !isSoundEnabled;
