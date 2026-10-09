import fs from 'fs';
import path from 'path';

// 44.1kHz Stereo 16-bit WAV Generator
const SAMPLE_RATE = 44100;
const BPM = 96;
const BEAT_DURATION = 60 / BPM; // 0.625s per quarter note
const TOTAL_BARS = 8;
const BEATS_PER_BAR = 4;
const TOTAL_BEATS = TOTAL_BARS * BEATS_PER_BAR; // 32 beats
const DURATION = TOTAL_BEATS * BEAT_DURATION; // 20.0s
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

const leftChannel = new Float32Array(TOTAL_SAMPLES);
const rightChannel = new Float32Array(TOTAL_SAMPLES);

// Note frequencies (Hz)
const NOTES = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.50
};

// --- SYNTHESIZERS ---

// 1. Pizzicato / Cartoon Bouncy Bass ("TUN")
function addPizzBass(startTime, freq, duration = 0.5, volume = 0.45, pan = 0.0) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const totalNoteSamples = Math.floor(duration * SAMPLE_RATE);

  for (let i = 0; i < totalNoteSamples; i++) {
    const idx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;

    // Fast pluck decay with bouncy slight pitch drop
    const pitchEnv = 1 + 0.15 * Math.exp(-t * 25);
    const f = freq * pitchEnv;

    // Natural plucked string harmonics (fundamental + 2nd + 3rd harmonic)
    const fundamental = Math.sin(2 * Math.PI * f * t);
    const h2 = 0.5 * Math.sin(2 * Math.PI * f * 2 * t);
    const h3 = 0.25 * Math.sin(2 * Math.PI * f * 3 * t);
    const wave = fundamental + h2 + h3;

    // Amplitude envelope
    const env = Math.exp(-t * 6.5);
    const sample = wave * env * volume;

    leftChannel[idx] += sample * (1 - pan) * 0.7;
    rightChannel[idx] += sample * (1 + pan) * 0.7;
  }
}

// 2. Cute Marimba / Wood Xylophone ("tu-tun")
function addMarimba(startTime, freq, duration = 0.4, volume = 0.35, pan = -0.2) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const totalNoteSamples = Math.floor(duration * SAMPLE_RATE);

  for (let i = 0; i < totalNoteSamples; i++) {
    const idx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;

    // Wooden percussive transient
    const transient = Math.sin(2 * Math.PI * freq * 4 * t) * Math.exp(-t * 80) * 0.3;
    const f1 = Math.sin(2 * Math.PI * freq * t);
    const f2 = 0.35 * Math.sin(2 * Math.PI * freq * 2.76 * t); // inharmonic wooden overtone
    const f3 = 0.15 * Math.sin(2 * Math.PI * freq * 5.4 * t);
    const wave = (f1 + f2 + f3 + transient);

    // Warm snappy decay
    const env = Math.exp(-t * 8.0);
    const sample = wave * env * volume;

    leftChannel[idx] += sample * (1 - pan) * 0.7;
    rightChannel[idx] += sample * (1 + pan) * 0.7;
  }
}

// 3. Cute Glockenspiel / Toy Bell Melody (Whimsical cartoon sparkle)
function addGlockenspiel(startTime, freq, duration = 0.8, volume = 0.28, pan = 0.3) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const totalNoteSamples = Math.floor(duration * SAMPLE_RATE);

  for (let i = 0; i < totalNoteSamples; i++) {
    const idx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;

    const f1 = Math.sin(2 * Math.PI * freq * t);
    const f2 = 0.4 * Math.sin(2 * Math.PI * freq * 2.0 * t);
    const f3 = 0.2 * Math.sin(2 * Math.PI * freq * 3.0 * t);
    const f4 = 0.1 * Math.sin(2 * Math.PI * freq * 4.0 * t);
    const wave = (f1 + f2 + f3 + f4);

    const env = Math.exp(-t * 3.5);
    const sample = wave * env * volume;

    leftChannel[idx] += sample * (1 - pan) * 0.7;
    rightChannel[idx] += sample * (1 + pan) * 0.7;
  }
}

// 4. Cartoon Woodblock / Percussion Click ("clack")
function addWoodblock(startTime, highPitch = false, volume = 0.25, pan = 0.1) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const baseFreq = highPitch ? 850 : 620;
  const duration = 0.08;
  const totalNoteSamples = Math.floor(duration * SAMPLE_RATE);

  for (let i = 0; i < totalNoteSamples; i++) {
    const idx = (startSample + i) % TOTAL_SAMPLES;
    const t = i / SAMPLE_RATE;

    const pitch = baseFreq * (1 + 0.3 * Math.exp(-t * 120));
    const wave = Math.sin(2 * Math.PI * pitch * t) + 0.3 * Math.sin(2 * Math.PI * pitch * 1.8 * t);
    const env = Math.exp(-t * 70);
    const sample = wave * env * volume;

    leftChannel[idx] += sample * (1 - pan) * 0.7;
    rightChannel[idx] += sample * (1 + pan) * 0.7;
  }
}

// --- SONG ARRANGEMENT ---
// 8 Bars in C Major / A Minor with the classic playful cartoon "tun... tutun tutun" groove!

const beatSec = BEAT_DURATION; // 0.625s

// Chord progression per bar:
// Bar 0: C Major
// Bar 1: F Major
// Bar 2: G Major
// Bar 3: C Major
// Bar 4: A Minor
// Bar 5: D Minor
// Bar 6: G7
// Bar 7: C Major (resolves seamlessly back to bar 0!)

const barHarmonies = [
  { bass: NOTES.C3, m1: NOTES.E4, m2: NOTES.G4, m3: NOTES.C5 },
  { bass: NOTES.F2, m1: NOTES.F4, m2: NOTES.A4, m3: NOTES.C5 },
  { bass: NOTES.G2, m1: NOTES.G4, m2: NOTES.B4, m3: NOTES.D5 },
  { bass: NOTES.C3, m1: NOTES.E4, m2: NOTES.G4, m3: NOTES.C5 },
  { bass: NOTES.A2, m1: NOTES.E4, m2: NOTES.A4, m3: NOTES.C5 },
  { bass: NOTES.D3, m1: NOTES.F4, m2: NOTES.A4, m3: NOTES.D5 },
  { bass: NOTES.G2, m1: NOTES.F4, m2: NOTES.G4, m3: NOTES.B4 },
  { bass: NOTES.C3, m1: NOTES.E4, m2: NOTES.G4, m3: NOTES.C5 },
];

for (let bar = 0; bar < TOTAL_BARS; bar++) {
  const barStart = bar * 4 * beatSec;
  const harmony = barHarmonies[bar];

  // --- 1. THE CARTOON BASS: "TUN ... TU-TUN TU-TUN" ---
  // Beat 1 (t=0.0): Big bouncy TUN!
  addPizzBass(barStart + 0.0 * beatSec, harmony.bass, 0.45, 0.5, -0.1);
  addWoodblock(barStart + 0.0 * beatSec, false, 0.2, -0.3);

  // Beat 2.5 (t=1.5): "tu-TUN"
  addPizzBass(barStart + 1.5 * beatSec, harmony.bass * 1.5, 0.25, 0.35, -0.1); // 5th above
  addPizzBass(barStart + 1.75 * beatSec, harmony.bass, 0.35, 0.45, -0.1);      // root bounce
  addWoodblock(barStart + 1.75 * beatSec, true, 0.22, 0.2);

  // Beat 3.5 (t=2.5): "tu-TUN"
  addPizzBass(barStart + 2.5 * beatSec, harmony.bass * 1.5, 0.25, 0.35, -0.1);
  addPizzBass(barStart + 2.75 * beatSec, harmony.bass, 0.38, 0.45, -0.1);
  addWoodblock(barStart + 2.75 * beatSec, true, 0.22, -0.2);

  // Beat 4 (t=3.0): Cute light walk into next bar
  if (bar % 2 === 1) {
    addPizzBass(barStart + 3.5 * beatSec, harmony.bass * 1.25, 0.22, 0.3, -0.1);
  }

  // --- 2. MARIMBA CHORDS (Bouncing offbeats & fills) ---
  // Offbeat marimba "plink plink"
  addMarimba(barStart + 0.5 * beatSec, harmony.m1, 0.25, 0.26, -0.3);
  addMarimba(barStart + 0.5 * beatSec, harmony.m2, 0.25, 0.22, 0.3);

  addMarimba(barStart + 1.5 * beatSec, harmony.m2, 0.25, 0.26, -0.2);
  addMarimba(barStart + 1.5 * beatSec, harmony.m3, 0.25, 0.24, 0.2);

  addMarimba(barStart + 2.5 * beatSec, harmony.m1, 0.25, 0.26, -0.3);
  addMarimba(barStart + 2.5 * beatSec, harmony.m2, 0.25, 0.22, 0.3);

  addMarimba(barStart + 3.5 * beatSec, harmony.m2, 0.25, 0.24, -0.1);
  addMarimba(barStart + 3.5 * beatSec, harmony.m3, 0.25, 0.24, 0.1);
}

// --- 3. WHIMSICAL TOP MELODY (GLOCKENSPIEL / TOY BELLS) ---
// Catchy, cute, slow anime-comedy motif
const melodyNotes = [
  // Bar 0 (C)
  { t: 0.0, n: NOTES.E5, d: 0.4 },
  { t: 0.5, n: NOTES.G5, d: 0.4 },
  { t: 1.0, n: NOTES.A5, d: 0.5 },
  { t: 1.75, n: NOTES.G5, d: 0.35 },
  { t: 2.5, n: NOTES.E5, d: 0.6 },

  // Bar 1 (F)
  { t: 4.0, n: NOTES.F5, d: 0.4 },
  { t: 4.5, n: NOTES.A5, d: 0.4 },
  { t: 5.0, n: NOTES.C6, d: 0.5 },
  { t: 5.75, n: NOTES.A5, d: 0.35 },
  { t: 6.5, n: NOTES.F5, d: 0.6 },

  // Bar 2 (G)
  { t: 8.0, n: NOTES.D5, d: 0.35 },
  { t: 8.5, n: NOTES.E5, d: 0.35 },
  { t: 9.0, n: NOTES.F5, d: 0.4 },
  { t: 9.75, n: NOTES.E5, d: 0.35 },
  { t: 10.25, n: NOTES.D5, d: 0.35 },
  { t: 10.75, n: NOTES.C5, d: 0.4 },

  // Bar 3 (C) - cute pause and bounce
  { t: 12.0, n: NOTES.E5, d: 0.5 },
  { t: 12.75, n: NOTES.G5, d: 0.5 },
  { t: 13.5, n: NOTES.C6, d: 0.8 },

  // Bar 4 (Am) - slightly mysterious, comical tip-toe
  { t: 16.0, n: NOTES.C5, d: 0.35 },
  { t: 16.5, n: NOTES.E5, d: 0.35 },
  { t: 17.0, n: NOTES.A5, d: 0.5 },
  { t: 17.75, n: NOTES.G5, d: 0.35 },
  { t: 18.5, n: NOTES.E5, d: 0.5 },

  // Bar 5 (Dm)
  { t: 20.0, n: NOTES.D5, d: 0.4 },
  { t: 20.5, n: NOTES.F5, d: 0.4 },
  { t: 21.0, n: NOTES.A5, d: 0.5 },
  { t: 21.75, n: NOTES.F5, d: 0.35 },
  { t: 22.5, n: NOTES.D5, d: 0.5 },

  // Bar 6 (G7) - comical questioning climb
  { t: 24.0, n: NOTES.B4, d: 0.35 },
  { t: 24.5, n: NOTES.D5, d: 0.35 },
  { t: 25.0, n: NOTES.F5, d: 0.4 },
  { t: 25.75, n: NOTES.G5, d: 0.4 },
  { t: 26.5, n: NOTES.B5, d: 0.6 },

  // Bar 7 (C) - happy resolution into seamless loop
  { t: 28.0, n: NOTES.C6, d: 0.6 },
  { t: 29.0, n: NOTES.G5, d: 0.4 },
  { t: 29.75, n: NOTES.E5, d: 0.35 },
  { t: 30.5, n: NOTES.D5, d: 0.35 },
  { t: 31.0, n: NOTES.C5, d: 0.6 },
];

melodyNotes.forEach(m => {
  addGlockenspiel(m.t * beatSec, m.n, m.d, 0.3, 0.15);
  // Double lightly with marimba for extra cartoon bounce
  addMarimba(m.t * beatSec, m.n * 0.5, m.d * 0.6, 0.18, -0.2);
});

// Normalize and build 16-bit WAV buffer
let maxPeak = 0.001;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  if (Math.abs(leftChannel[i]) > maxPeak) maxPeak = Math.abs(leftChannel[i]);
  if (Math.abs(rightChannel[i]) > maxPeak) maxPeak = Math.abs(rightChannel[i]);
}

// Master gain normalization to ~0.85
const masterGain = 0.85 / maxPeak;
const byteLength = TOTAL_SAMPLES * 4; // 2 channels * 2 bytes
const wavBuffer = Buffer.alloc(44 + byteLength);

// WAV Header
wavBuffer.write('RIFF', 0);
wavBuffer.writeUInt32LE(36 + byteLength, 4);
wavBuffer.write('WAVE', 8);
wavBuffer.write('fmt ', 12);
wavBuffer.writeUInt32LE(16, 16); // subchunk1 size
wavBuffer.writeUInt16LE(1, 20);  // PCM format
wavBuffer.writeUInt16LE(2, 22);  // 2 channels
wavBuffer.writeUInt32LE(SAMPLE_RATE, 24);
wavBuffer.writeUInt32LE(SAMPLE_RATE * 4, 28); // byte rate
wavBuffer.writeUInt16LE(4, 32);  // block align
wavBuffer.writeUInt16LE(16, 34); // bits per sample
wavBuffer.write('data', 36);
wavBuffer.writeUInt32LE(byteLength, 40);

let offset = 44;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const l = Math.max(-1, Math.min(1, leftChannel[i] * masterGain));
  const r = Math.max(-1, Math.min(1, rightChannel[i] * masterGain));

  const sampleL = l < 0 ? l * 32768 : l * 32767;
  const sampleR = r < 0 ? r * 32768 : r * 32767;

  wavBuffer.writeInt16LE(Math.round(sampleL), offset);
  wavBuffer.writeInt16LE(Math.round(sampleR), offset + 2);
  offset += 4;
}

const outDir = path.resolve('public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outFile = path.join(outDir, 'cute-cartoon-melody.wav');
fs.writeFileSync(outFile, wavBuffer);
console.log(`Generated cute cartoon melody WAV successfully: ${outFile} (${(wavBuffer.length / 1024).toFixed(1)} KB)`);
