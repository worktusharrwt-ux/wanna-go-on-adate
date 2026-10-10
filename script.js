/**
 * ============================================================================
 * DATE SIMULATOR - INTERACTIVE JAVASCRIPT ENGINE
 * ============================================================================
 * Handles state, ambient audio, synthesized SFX, playful evasive physics,
 * heart bursts, confetti showers, name customization, and WhatsApp integration.
 */

(() => {
  'use strict';

  // --------------------------------------------------------------------------
  // CONSTANTS & CONFIGURATION
  // --------------------------------------------------------------------------
  const WHATSAPP_PHONE = '918445848985';
  const DISPLAY_PHONE = '+91 84458 48985';
  const STORAGE_KEY = 'date_sim_sound_enabled';
  const DEFAULT_VOLUME = 0.18; // 18% gentle volume

  const NO_PHRASES = [
    'No 🙈',
    'Wait, really? 🥺',
    'Are you sure? 🙈',
    'Think again! 🌸',
    'Nice try! 😜',
    "Can't catch me! 🏃‍♀️",
    'Pretty please? 🥺',
    'Look at Yes! 👉',
    'No is out of stock! 💖',
    'Resistance is futile! 🥰',
  ];

  const SWEET_REACTIONS = [
    'Counting down the seconds! ⏳💕',
    'Officially smiling ear to ear! ☺️🌸',
    'Best news of the entire year! 🥹✨',
    'Butterflies in my stomach confirmed! 🦋💗',
    'I promise you the sweetest time ever! 🍨🌷',
    'You just made my heart do a little happy dance! 💃💖',
  ];

  const SPARKLE_CHARS = ['✨', '💖', '🌸', '💕', '⭐'];

  const ROMANTIC_COLORS = [
    '#FF6584', // bright rose
    '#FF8DA1', // pastel rose
    '#FFB6C1', // light pink
    '#FFD1DC', // soft blush
    '#E6C2FF', // soft lavender
    '#FFC0CB', // pink
    '#FFF0F5', // lavender blush
    '#FFB7B2', // melon blush
    '#FFD700', // golden sparkle
  ];

  // --------------------------------------------------------------------------
  // APPLICATION STATE
  // --------------------------------------------------------------------------
  let recipientName = 'Pretty Girl';
  let dodgeCount = 0;
  let noPosition = { x: 0, y: 0 };
  let isDodging = false;
  let hasSaidYes = false;
  let reactionIndex = 0;
  let hasSentWhatsApp = false;
  let isSoundEnabled = true;

  // --------------------------------------------------------------------------
  // AUDIO & SOUND ENGINE
  // --------------------------------------------------------------------------
  let bgmAudio = null;
  let audioCtx = null;
  let heartConfettiShape = null;

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

  function initAudioEngine() {
    // Read user sound preference
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      isSoundEnabled = saved !== 'false';
    } catch (e) {
      isSoundEnabled = true;
    }

    try {
      bgmAudio = new Audio();
      bgmAudio.preload = 'auto';
      bgmAudio.loop = true;
      bgmAudio.volume = DEFAULT_VOLUME;

      const sourceMp3 = './audio/cute-cartoon-melody.mp3';
      const sourceWav = './audio/cute-cartoon-melody.wav';

      bgmAudio.src = sourceMp3;

      bgmAudio.addEventListener('error', () => {
        if (bgmAudio.src.endsWith('.mp3')) {
          bgmAudio.src = sourceWav;
          if (isSoundEnabled) {
            bgmAudio.play().catch(() => {});
          }
        }
      });

      if (isSoundEnabled) {
        attemptAutoplayWithGestureUnlock();
      }
    } catch (err) {
      console.warn('HTML Audio initialization note:', err);
    }
  }

  function attemptAutoplayWithGestureUnlock() {
    if (!bgmAudio) return;

    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateSoundToggleUI();
        })
        .catch(() => {
          // Autoplay policy prevented playback, unlock on first user gesture
          const unlockAudio = () => {
            if (isSoundEnabled && bgmAudio && bgmAudio.paused) {
              bgmAudio.play().then(updateSoundToggleUI).catch(() => {});
              getAudioContext();
            }
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

  function toggleSoundPreference() {
    if (!bgmAudio) {
      initAudioEngine();
    }

    isSoundEnabled = !isSoundEnabled;

    try {
      localStorage.setItem(STORAGE_KEY, isSoundEnabled ? 'true' : 'false');
    } catch (e) {}

    if (isSoundEnabled) {
      if (bgmAudio) {
        bgmAudio.play().catch(() => {});
      }
      getAudioContext();
      playChime(659.25, 'sine', 0.4);
    } else {
      if (bgmAudio) {
        bgmAudio.pause();
      }
    }

    updateSoundToggleUI();
    return isSoundEnabled;
  }

  function updateSoundToggleUI() {
    const soundBtn = document.getElementById('soundToggleBtn');
    const soundText = document.getElementById('soundToggleText');
    if (!soundBtn || !soundText) return;

    if (isSoundEnabled) {
      soundBtn.classList.add('sound-active');
      soundBtn.classList.remove('sound-muted');
      soundBtn.title = 'Click to Mute Melody & Sound 🔇';
      soundBtn.setAttribute('aria-label', 'Turn sound off');
      soundBtn.innerHTML = `
        <svg class="sound-icon-playing" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <span class="pill-text">Sound: ON 🎵</span>
      `;
    } else {
      soundBtn.classList.remove('sound-active');
      soundBtn.classList.add('sound-muted');
      soundBtn.title = 'Click to Play Cute Background Melody 🎵';
      soundBtn.setAttribute('aria-label', 'Turn sound on');
      soundBtn.innerHTML = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
        <span class="pill-text">Sound: OFF 🔇</span>
      `;
    }
  }

  // Synthesized Chimes & Interactive SFX
  function playChime(freq = 523.25, type = 'sine', duration = 0.6) {
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

  function playCelebrationMelody() {
    if (!isSoundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5, 1567.98];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playChime(freq, 'sine', 1.2);
      }, i * 90);
    });
  }

  function playDodgeSound() {
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

  // --------------------------------------------------------------------------
  // CONFETTI CELEBRATION ENGINE
  // --------------------------------------------------------------------------
  function initConfettiShape() {
    if (typeof window.confetti === 'function' && typeof window.confetti.shapeFromPath === 'function') {
      try {
        heartConfettiShape = window.confetti.shapeFromPath({
          path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
        });
      } catch (e) {
        heartConfettiShape = null;
      }
    }
  }

  function triggerConfetti(options) {
    if (typeof window.confetti === 'function') {
      const shapes = heartConfettiShape ? [heartConfettiShape, 'circle'] : ['circle'];
      window.confetti({
        shapes,
        colors: ROMANTIC_COLORS,
        ...options,
      });
    }
  }

  function launchGrandCelebration() {
    initConfettiShape();

    // Wave 1: Center heart burst
    triggerConfetti({
      particleCount: 75,
      spread: 100,
      origin: { y: 0.6 },
      scalar: 1.4,
      ticks: 200,
      gravity: 0.8,
    });

    // Wave 2: Left and right cannons
    setTimeout(() => {
      triggerConfetti({
        particleCount: 50,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.7 },
        scalar: 1.2,
        ticks: 220,
      });
      triggerConfetti({
        particleCount: 50,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.7 },
        scalar: 1.2,
        ticks: 220,
      });
    }, 250);

    // Wave 3: Raining heart shower from the top
    setTimeout(() => {
      const duration = 2500;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        triggerConfetti({
          particleCount: 15,
          startVelocity: 0,
          ticks: 250,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.2 - 0.1,
          },
          gravity: 0.6,
          scalar: 1.1,
          drift: (Math.random() - 0.5) * 1.5,
        });
      }, 180);
    }, 600);
  }

  function launchHeartBurst(x = 0.5, y = 0.5) {
    initConfettiShape();
    triggerConfetti({
      particleCount: 40,
      spread: 80,
      origin: { x, y },
      scalar: 1.3,
      ticks: 150,
      gravity: 0.9,
    });
  }

  // --------------------------------------------------------------------------
  // BACKGROUND FLOATING HEARTS & TWINKLES GENERATOR
  // --------------------------------------------------------------------------
  function initBackgroundParticles() {
    const heartsLayer = document.getElementById('floatingHeartsLayer');
    const twinklesLayer = document.getElementById('ambientTwinklesLayer');
    if (!heartsLayer || !twinklesLayer) return;

    // Generate 22 floating hearts with randomized yet stable CSS custom properties
    const emojis = ['💖', '💕', '💗', '🌸', '✨', '🤍', '🌷', '💘'];
    const heartFragment = document.createDocumentFragment();

    for (let i = 0; i < 22; i++) {
      const span = document.createElement('span');
      span.className = 'floating-heart';
      span.textContent = emojis[i % emojis.length];

      const leftPercent = `${(i * 4.7 + 3) % 94}%`;
      const sizePx = `${14 + (i % 5) * 6}px`;
      const durationSec = `${10 + (i % 7) * 2.5}s`;
      const delaySec = `${(i * 0.8) % 8}s`;
      const swaySec = `${3 + (i % 4)}s`;
      const opacityVal = (0.35 + (i % 4) * 0.15).toFixed(2);

      span.style.setProperty('--heart-left', leftPercent);
      span.style.setProperty('--heart-size', sizePx);
      span.style.setProperty('--heart-duration', durationSec);
      span.style.setProperty('--heart-delay', delaySec);
      span.style.setProperty('--heart-sway', swaySec);
      span.style.setProperty('--heart-opacity', opacityVal);

      heartFragment.appendChild(span);
    }
    heartsLayer.appendChild(heartFragment);

    // Generate 16 twinkle stars
    const twinkleFragment = document.createDocumentFragment();
    for (let i = 0; i < 16; i++) {
      const star = document.createElement('div');
      star.className = 'twinkle-star';

      const topPercent = `${(i * 13 + 5) % 90}%`;
      const leftPercent = `${(i * 17 + 8) % 92}%`;
      const sizePx = `${8 + (i % 4) * 4}px`;
      const delaySec = `${(i * 0.5) % 4}s`;
      const durationSec = `${2 + (i % 3)}s`;

      star.style.setProperty('--star-top', topPercent);
      star.style.setProperty('--star-left', leftPercent);
      star.style.setProperty('--star-size', sizePx);
      star.style.setProperty('--star-delay', delaySec);
      star.style.setProperty('--star-duration', durationSec);

      twinkleFragment.appendChild(star);
    }
    twinklesLayer.appendChild(twinkleFragment);
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE CURSOR & TOUCH SPARKLE TRAIL
  // --------------------------------------------------------------------------
  function initSparkleTrail() {
    const container = document.getElementById('sparkleTrailContainer');
    if (!container) return;

    let lastTime = 0;

    const handlePointerMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 70) return;
      lastTime = now;

      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      const sparkle = document.createElement('span');
      sparkle.className = 'cursor-sparkle';
      sparkle.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];

      const size = 12 + Math.floor(Math.random() * 12);
      const driftX = (Math.random() - 0.5) * 40;

      sparkle.style.setProperty('--sparkle-x', `${clientX}px`);
      sparkle.style.setProperty('--sparkle-y', `${clientY}px`);
      sparkle.style.setProperty('--sparkle-size', `${size}px`);
      sparkle.style.setProperty('--drift-x', `${driftX}px`);

      container.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 750);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
  }

  // --------------------------------------------------------------------------
  // NO-BUTTON PLAYFUL DODGE LOGIC
  // --------------------------------------------------------------------------
  function handleNoDodge(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    playDodgeSound();

    dodgeCount++;

    // Update dodge notice pill
    const dodgeNoticePill = document.getElementById('dodgeNoticePill');
    const dodgeNoticeText = document.getElementById('dodgeNoticeText');

    if (dodgeNoticePill && dodgeNoticeText) {
      if (dodgeCount === 1) {
        dodgeNoticeText.textContent = 'Hehe, that button is a bit slippery! 😜';
        dodgeNoticePill.classList.remove('hidden');
      } else if (dodgeCount === 3) {
        dodgeNoticeText.textContent = 'Notice how the Yes button is glowing? ✨';
        dodgeNoticePill.classList.remove('hidden');
      } else if (dodgeCount >= 6) {
        dodgeNoticeText.textContent = 'The universe clearly wants you to click YES! 💖';
        dodgeNoticePill.classList.remove('hidden');
      }
    }

    // Dynamic scale on Yes button
    const yesBtn = document.getElementById('yesBtn');
    if (yesBtn) {
      const yesScale = (1 + Math.min(dodgeCount * 0.05, 0.35)).toFixed(3);
      yesBtn.style.setProperty('--yes-scale', yesScale);
    }

    // Dynamic text phrase on No button
    const noBtnText = document.getElementById('noBtnText');
    if (noBtnText) {
      const phraseIndex = Math.min(dodgeCount, NO_PHRASES.length - 1);
      noBtnText.textContent = NO_PHRASES[phraseIndex];
    }

    // Calculate evasion coordinate
    const container = document.getElementById('questionCard');
    const noBtn = document.getElementById('noBtn');
    const noAnchor = document.getElementById('noBtnAnchor');

    if (!container || !noBtn || !noAnchor) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxDeltaX = Math.min(150, Math.floor(containerRect.width / 2 - btnRect.width / 2 - 16));
    const maxDeltaY = 65;

    let targetX = 0;
    let targetY = 0;
    let attempts = 0;

    while (attempts < 12) {
      attempts++;
      const rawX = (Math.random() * 2 - 1) * maxDeltaX;
      const rawY = (Math.random() * 2 - 1) * maxDeltaY;

      const dist = Math.hypot(rawX - noPosition.x, rawY - noPosition.y);
      if (dist < 55) continue;

      if (rawX < -80 && Math.abs(rawY) < 30) continue;

      targetX = Math.round(rawX);
      targetY = Math.round(rawY);
      break;
    }

    noPosition = { x: targetX, y: targetY };
    noAnchor.style.setProperty('--no-x', `${targetX}px`);
    noAnchor.style.setProperty('--no-y', `${targetY}px`);

    noBtn.classList.add('dodging');
    setTimeout(() => {
      noBtn.classList.remove('dodging');
    }, 320);
  }

  // --------------------------------------------------------------------------
  // YES BUTTON & REPLAY TRANSITIONS
  // --------------------------------------------------------------------------
  function handleYesClick() {
    playChime(659.25, 'sine', 0.8);
    playCelebrationMelody();
    launchGrandCelebration();

    hasSaidYes = true;

    const questionWrapper = document.getElementById('questionCardWrapper');
    const successWrapper = document.getElementById('successCardWrapper');

    if (questionWrapper && successWrapper) {
      questionWrapper.classList.add('hidden');
      successWrapper.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleReplayClick() {
    hasSaidYes = false;
    dodgeCount = 0;
    noPosition = { x: 0, y: 0 };

    const questionWrapper = document.getElementById('questionCardWrapper');
    const successWrapper = document.getElementById('successCardWrapper');
    const yesBtn = document.getElementById('yesBtn');
    const noAnchor = document.getElementById('noBtnAnchor');
    const noBtnText = document.getElementById('noBtnText');
    const dodgeNoticePill = document.getElementById('dodgeNoticePill');

    if (yesBtn) yesBtn.style.setProperty('--yes-scale', '1');
    if (noAnchor) {
      noAnchor.style.setProperty('--no-x', '0px');
      noAnchor.style.setProperty('--no-y', '0px');
    }
    if (noBtnText) noBtnText.textContent = NO_PHRASES[0];
    if (dodgeNoticePill) dodgeNoticePill.classList.add('hidden');

    if (questionWrapper && successWrapper) {
      successWrapper.classList.add('hidden');
      questionWrapper.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --------------------------------------------------------------------------
  // CUSTOM DATE PLANNER & WHATSAPP
  // --------------------------------------------------------------------------
  function buildWhatsAppLink(planText) {
    let message = `Hey! 💕 I said YES on your date proposal website! 🥰\n\n`;
    if (planText && planText.trim()) {
      message += `The date I'd love to go on with you:\n"${planText.trim()}" 🌷✨\n\n`;
    } else {
      message += `I'm up for anything fun with you! 🌷✨\n\n`;
    }
    message += `Can't wait for our date! You made my heart smile. 🥂💖`;

    const encoded = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encoded}`;
  }

  function updateWhatsAppPreview() {
    const textarea = document.getElementById('customDateTextarea');
    const previewContent = document.getElementById('whatsappPreviewContent');
    const charCounter = document.getElementById('charCounter');
    if (!textarea || !previewContent) return;

    const text = textarea.value;
    if (charCounter) {
      charCounter.textContent = `${text.length}/280`;
    }

    const trimmed = text.trim();
    const wishDisplay = trimmed || 'Surprise me! Anything fun with you! 💕';

    previewContent.innerHTML = `
      💬 "Hey! 💕 I said YES on your date proposal website! 🥰<br />
      <strong>The date I'd love to go on:</strong><br />
      <em>"${escapeHtml(wishDisplay)}"</em> 🌷✨<br />
      Can't wait! 🥂💖"
    `;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function handleSendWhatsApp() {
    const textarea = document.getElementById('customDateTextarea');
    const planText = textarea ? textarea.value : '';
    const url = buildWhatsAppLink(planText);

    playChime(880, 'sine', 0.5);

    try {
      window.open(url, '_blank');
    } catch (err) {
      window.location.href = url;
    }

    hasSentWhatsApp = true;
    const btnText = document.getElementById('whatsappBtnText');
    if (btnText) {
      btnText.textContent = 'Update & Resend on WhatsApp 💬';
    }
  }

  function handleMadeMyDay(e) {
    let originX = 0.5;
    let originY = 0.5;
    if (e && e.clientX && window.innerWidth) {
      originX = e.clientX / window.innerWidth;
      originY = e.clientY / window.innerHeight;
    }
    launchHeartBurst(originX, originY);
    playChime(783.99, 'sine', 0.9);

    reactionIndex = (reactionIndex + 1) % SWEET_REACTIONS.length;
    const bubblePill = document.getElementById('reactionBubblePill');
    const bubbleText = document.getElementById('reactionBubbleText');

    if (bubblePill && bubbleText) {
      bubbleText.textContent = SWEET_REACTIONS[reactionIndex];
      bubblePill.classList.remove('hidden');
    }
  }

  function handleCopyPromise() {
    const textarea = document.getElementById('customDateTextarea');
    const plan = textarea ? textarea.value.trim() : '🥟 momo date? ✨';
    const text = `Officially sealed with a YES! 🥰 My date wish: "${plan}"! 💖✨`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }

    playChime(880, 'sine', 0.5);

    const copyBtn = document.getElementById('copyPromiseBtn');
    const copyText = document.getElementById('copyPromiseText');
    const copyIcon = document.getElementById('copyPromiseIcon');

    if (copyText && copyIcon) {
      copyText.textContent = 'Copied! 💗';
      copyIcon.innerHTML = `
        <polyline points="20 6 9 17 4 12"></polyline>
      `;
      setTimeout(() => {
        copyText.textContent = 'Copy text';
        copyIcon.innerHTML = `
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        `;
      }, 2500);
    }
  }

  // --------------------------------------------------------------------------
  // NAME PERSONALIZATION & SHARE LINK
  // --------------------------------------------------------------------------
  function setRecipient(name) {
    recipientName = (name && name.trim()) ? name.trim() : 'Pretty Girl';

    const nameDisplay = document.getElementById('recipientNameDisplay');
    const pillText = document.getElementById('personalizePillText');

    if (nameDisplay) nameDisplay.textContent = recipientName;
    if (pillText) pillText.textContent = `For: ${recipientName}`;
  }

  function openNameModal() {
    const modal = document.getElementById('nameModalBackdrop');
    const input = document.getElementById('nameInput');
    if (!modal) return;

    if (input) {
      input.value = recipientName;
      setTimeout(() => input.focus(), 50);
    }
    modal.classList.remove('hidden');
  }

  function closeNameModal() {
    const modal = document.getElementById('nameModalBackdrop');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  function handleSaveName(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('nameInput');
    const newName = input ? input.value : '';

    setRecipient(newName);
    closeNameModal();
    playChime(784, 'sine', 0.5);

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('name', recipientName);
      window.history.replaceState({}, '', url.toString());
    } catch (err) {}
  }

  function handleShareLink() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('name', recipientName);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url.toString()).catch(() => {});
      }
    } catch (err) {}

    playChime(880, 'sine', 0.4);

    const shareBtn = document.getElementById('shareLinkBtn');
    const shareText = document.getElementById('shareLinkText');
    const shareIcon = document.getElementById('shareLinkIcon');

    if (shareText && shareIcon) {
      shareText.textContent = 'Link Copied!';
      shareIcon.innerHTML = `
        <polyline points="20 6 9 17 4 12" class="text-green"></polyline>
      `;
      setTimeout(() => {
        shareText.textContent = 'Share Link';
        shareIcon.innerHTML = `
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        `;
      }, 2000);
    }
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS BINDING
  // --------------------------------------------------------------------------
  function bindEventListeners() {
    // Top floating controls
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', toggleSoundPreference);
    }

    const personalizeBtn = document.getElementById('personalizeBtn');
    if (personalizeBtn) {
      personalizeBtn.addEventListener('click', openNameModal);
    }

    const editNameBtn = document.getElementById('editNameBtn');
    if (editNameBtn) {
      editNameBtn.addEventListener('click', openNameModal);
    }

    const shareLinkBtn = document.getElementById('shareLinkBtn');
    if (shareLinkBtn) {
      shareLinkBtn.addEventListener('click', handleShareLink);
    }

    // Modal events
    const nameForm = document.getElementById('nameForm');
    if (nameForm) {
      nameForm.addEventListener('submit', handleSaveName);
    }

    const cancelNameBtn = document.getElementById('cancelNameBtn');
    if (cancelNameBtn) {
      cancelNameBtn.addEventListener('click', closeNameModal);
    }

    const modalBackdrop = document.getElementById('nameModalBackdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeNameModal();
        }
      });
    }

    // Question Card Buttons
    const yesBtn = document.getElementById('yesBtn');
    if (yesBtn) {
      yesBtn.addEventListener('click', handleYesClick);
    }

    const noBtn = document.getElementById('noBtn');
    if (noBtn) {
      noBtn.addEventListener('mouseenter', handleNoDodge);
      noBtn.addEventListener('mousemove', handleNoDodge);
      noBtn.addEventListener('touchstart', handleNoDodge, { passive: false });
      noBtn.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' || e.pointerType === 'mouse') {
          handleNoDodge(e);
        }
      });
      noBtn.addEventListener('click', handleNoDodge);
    }

    // Success Screen Actions
    const customTextarea = document.getElementById('customDateTextarea');
    if (customTextarea) {
      customTextarea.value = '🥟 momo date?';
      customTextarea.addEventListener('input', updateWhatsAppPreview);
      updateWhatsAppPreview();
    }

    // Quick Inspiration Chips
    const chipsContainer = document.getElementById('inspirationChipsContainer');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip-btn');
        if (!btn) return;
        const idea = btn.getAttribute('data-idea');
        if (idea && customTextarea) {
          customTextarea.value = idea;
          playChime(659.25, 'sine', 0.25);
          updateWhatsAppPreview();
        }
      });
    }

    const whatsappSendBtn = document.getElementById('whatsappSendBtn');
    if (whatsappSendBtn) {
      whatsappSendBtn.addEventListener('click', handleSendWhatsApp);
    }

    const madeMyDayBtn = document.getElementById('madeMyDayBtn');
    if (madeMyDayBtn) {
      madeMyDayBtn.addEventListener('click', handleMadeMyDay);
    }

    const copyPromiseBtn = document.getElementById('copyPromiseBtn');
    if (copyPromiseBtn) {
      copyPromiseBtn.addEventListener('click', handleCopyPromise);
    }

    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
      replayBtn.addEventListener('click', handleReplayClick);
    }
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // --------------------------------------------------------------------------
  function init() {
    // Read recipient name from URL parameters if available
    try {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name');
      if (nameParam && nameParam.trim()) {
        recipientName = nameParam.trim();
      }
    } catch (e) {}

    setRecipient(recipientName);
    initAudioEngine();
    updateSoundToggleUI();
    initBackgroundParticles();
    initSparkleTrail();
    bindEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
