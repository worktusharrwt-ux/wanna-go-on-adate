import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';
import CuteMascot from './CuteMascot';
import { playDodgeSound, playChime } from '../utils/audio';

const NO_PHRASES = [
  'No 🙈',
  'Wait, really? 🥺',
  'Are you sure? 🙈',
  'Think again! 🌸',
  'Nice try! 😜',
  'Can\'t catch me! 🏃‍♀️',
  'Pretty please? 🥺',
  'Look at Yes! 👉',
  'No is out of stock! 💖',
  'Resistance is futile! 🥰',
];

export default function QuestionCard({ onYes, recipientName = 'Pretty Girl', onEditName }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isDodging, setIsDodging] = useState(false);
  const [dodgeNotice, setDodgeNotice] = useState('');

  const containerRef = useRef(null);
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);

  // Safely compute new position within container bounds without overlapping Yes button
  const handleDodge = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    playDodgeSound();

    setDodgeCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === 1) {
        setDodgeNotice('Hehe, that button is a bit slippery! 😜');
      } else if (nextCount === 3) {
        setDodgeNotice('Notice how the Yes button is glowing? ✨');
      } else if (nextCount >= 6) {
        setDodgeNotice('The universe clearly wants you to click YES! 💖');
      }
      return nextCount;
    });

    const container = containerRef.current;
    const noBtn = noButtonRef.current;
    const yesBtn = yesButtonRef.current;

    if (!container || !noBtn) {
      // Fallback relative bounce
      const randomX = (Math.random() - 0.5) * 160;
      const randomY = (Math.random() - 0.5) * 80;
      setNoPosition({ x: randomX, y: randomY });
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;

    // Boundaries relative to the container action area
    // Allow dodging horizontally within +/- 150px and vertically within +/- 75px
    const maxDeltaX = Math.min(150, Math.floor(containerRect.width / 2 - btnRect.width / 2 - 16));
    const maxDeltaY = 65;

    let targetX = 0;
    let targetY = 0;
    let attempts = 0;

    // Find a spot that doesn't overlap Yes button and is not too close to current position
    while (attempts < 12) {
      attempts++;
      // Generate candidate
      const rawX = (Math.random() * 2 - 1) * maxDeltaX;
      const rawY = (Math.random() * 2 - 1) * maxDeltaY;

      // Ensure it actually moved at least 60px from current
      const distFromCurrent = Math.hypot(rawX - noPosition.x, rawY - noPosition.y);
      if (distFromCurrent < 55) continue;

      // Check distance from initial center to not cover Yes button
      // In flex layout, Yes is on the left, No is on the right
      // Avoid pushing No too far left into Yes's territory
      if (rawX < -80 && Math.abs(rawY) < 30) continue;

      targetX = Math.round(rawX);
      targetY = Math.round(rawY);
      break;
    }

    setIsDodging(true);
    setNoPosition({ x: targetX, y: targetY });

    setTimeout(() => {
      setIsDodging(false);
    }, 320);
  }, [noPosition]);

  // Calculate dynamic scale for Yes button as No is dodged
  const yesButtonScale = 1 + Math.min(dodgeCount * 0.05, 0.35);

  const currentNoPhrase = NO_PHRASES[Math.min(dodgeCount, NO_PHRASES.length - 1)];

  return (
    <div className="card-outer-wrapper">
      <div className="romantic-card main-question-card" ref={containerRef}>
        {/* Soft Decorative Card Corner Hearts */}
        <span className="card-deco-heart top-left" aria-hidden="true">🌸</span>
        <span className="card-deco-heart top-right" aria-hidden="true">✨</span>

        {/* Mascot at top */}
        <div className="mascot-section">
          <CuteMascot mood="asking" />
        </div>

        {/* Header Greeting */}
        <div className="card-header-block">
          <div className="greeting-wrapper">
            <h2 className="greeting-text">
              Hey, <span className="highlight-name">{recipientName}</span>! 💗
            </h2>
            {onEditName && (
              <button
                className="edit-name-btn"
                onClick={onEditName}
                title="Change name"
                aria-label="Customize name"
              >
                ✏️
              </button>
            )}
          </div>
          <p className="sub-intro">I have something to ask you...</p>
        </div>

        {/* Main Question */}
        <div className="main-question-block">
          <h1 className="romantic-question">
            Will you go on a date with me? <span className="question-emoji">🥹💕</span>
          </h1>
          <p className="romantic-subtitle">
            I promise good vibes, lots of laughter, and maybe a little bit of blushing. 🌷
          </p>
        </div>

        {/* Interactive Buttons Container */}
        <div className="buttons-playground">
          <div className="buttons-container">
            {/* YES BUTTON */}
            <button
              ref={yesButtonRef}
              className="btn btn-yes"
              style={{
                transform: `scale(${yesButtonScale})`,
              }}
              onClick={() => {
                playChime(659.25, 'sine', 0.8);
                onYes();
              }}
              aria-label="Yes, I would love to go on a date"
            >
              <span className="btn-yes-glow" />
              <Heart className="btn-icon heart-pulse" size={22} fill="currentColor" />
              <span className="btn-text">Yes! 💖</span>
              <Sparkles className="btn-icon-sparkle" size={18} />
            </button>

            {/* NO BUTTON (Dodging Button) */}
            <div
              className="no-btn-anchor"
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <button
                ref={noButtonRef}
                className={`btn btn-no ${isDodging ? 'dodging' : ''}`}
                onMouseEnter={handleDodge}
                onMouseMove={handleDodge}
                onTouchStart={handleDodge}
                onPointerDown={(e) => {
                  // Catch touch & click right as pointer goes down
                  if (e.pointerType === 'touch' || e.pointerType === 'mouse') {
                    handleDodge(e);
                  }
                }}
                onClick={handleDodge}
                tabIndex={-1}
                aria-label="No option (playfully evasive)"
              >
                <span className="no-text">{currentNoPhrase}</span>
              </button>
            </div>
          </div>

          {/* Playful hint text if dodged */}
          {dodgeNotice && (
            <div className="dodge-notice-pill" role="status">
              <span className="notice-icon">💬</span>
              <span>{dodgeNotice}</span>
            </div>
          )}
        </div>

        {/* Card Footer detail */}
        <div className="card-footer-note">
          <span>Handcrafted with all my heart 💌</span>
        </div>
      </div>
    </div>
  );
}
