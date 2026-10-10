import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, MessageCircle, Copy, PartyPopper, Send, Edit3 } from 'lucide-react';
import CuteMascot from './CuteMascot';
import { launchHeartBurst } from '../utils/confetti';
import { playChime } from '../utils/audio';
import { triggerWhatsAppMessage, DISPLAY_PHONE, WHATSAPP_PHONE } from '../utils/whatsapp';

const SWEET_REACTIONS = [
  'Counting down the seconds! ⏳💕',
  'Officially smiling ear to ear! ☺️🌸',
  'Best news of the entire year! 🥹✨',
  'Butterflies in my stomach confirmed! 🦋💗',
  'I promise you the sweetest time ever! 🍨🌷',
  'You just made my heart do a little happy dance! 💃💖',
];

const QUICK_INSPIRATIONS = [
  { emoji: '🥟', text: 'momo date? or whatever you like' },
  { emoji: '🍻', text: '1-1 beer ho jaye ?' },
  { emoji: '🎬', text: "let's go out for a movie" },
  { emoji: '🚶', text: 'walk pe chlte h' },
  { emoji: '🌅', text: 'sunset ya sunrise dekhne chalte h' },
];

export default function SuccessCard({ recipientName = 'Pretty Girl', onReplay, senderName = 'Tushar' }) {
  const [customDatePlan, setCustomDatePlan] = useState('🥟 momo date? or whatever you like');
  const [copied, setCopied] = useState(false);
  const [reactionIndex, setReactionIndex] = useState(0);
  const [reactionText, setReactionText] = useState('');
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);

  const handleMadeMyDay = (e) => {
    let originX = 0.5;
    let originY = 0.5;
    if (e && e.clientX && window.innerWidth) {
      originX = e.clientX / window.innerWidth;
      originY = e.clientY / window.innerHeight;
    }
    launchHeartBurst(originX, originY);
    playChime(783.99, 'sine', 0.9);

    const nextIndex = (reactionIndex + 1) % SWEET_REACTIONS.length;
    setReactionIndex(nextIndex);
    setReactionText(SWEET_REACTIONS[nextIndex]);
  };

  const handleSendCustomWhatsApp = () => {
    playChime(880, 'sine', 0.5);
    triggerWhatsAppMessage({
      recipientName,
      customDatePlan,
    });
    setHasSentWhatsApp(true);
  };

  const handleApplyInspiration = (item) => {
    playChime(659.25, 'sine', 0.25);
    setCustomDatePlan(`${item.emoji} ${item.text}`);
  };

  const handleCopyConfirmation = () => {
    const text = `Officially sealed with a YES! 🥰 My date wish: "${customDatePlan}"! 💖✨`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    playChime(880, 'sine', 0.5);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="card-outer-wrapper success-animation-enter">
      <div className="romantic-card success-card">
        {/* Decorative corner glows */}
        <span className="card-deco-heart top-left">✨</span>
        <span className="card-deco-heart top-right">💖</span>

        {/* Big Beating Heart Emblem */}
        <div className="success-heart-emblem-wrap">
          <div className="glowing-heart-pulse">
            <svg
              viewBox="0 0 100 100"
              className="success-giant-heart"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="heartGradient" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#FF4D6D" />
                  <stop offset="60%" stopColor="#FF758F" />
                  <stop offset="100%" stopColor="#C9184A" />
                </radialGradient>
              </defs>
              <path
                d="M 50,88 C 20,68 4,50 4,28 C 4,12 16,4 30,4 C 39,4 46,9 50,16 C 54,9 61,4 70,4 C 84,4 96,12 96,28 C 96,50 80,68 50,88 Z"
                fill="url(#heartGradient)"
              />
              <path
                d="M 22,22 C 24,14 30,10 38,10"
                fill="none"
                stroke="#FFE5EC"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>

        {/* Celebrating Mascot */}
        <div className="mascot-section">
          <CuteMascot mood="happy" />
        </div>

        {/* Success Header Message */}
        <div className="success-message-block">
          <h1 className="success-title">
            YAYYYYY! <span className="title-emoji">🥹💗</span>
          </h1>

          <p className="success-tagline">
            You just made me the happiest person ever! 💕
          </p>

          <p className="success-body-text">
            I can't wait to spend some beautiful moments with you. 🌷✨
          </p>

          <div className="sealed-date-banner">
            <p className="sealed-text">
              So... it's a date? <span className="sealed-emoji">🥰💖</span>
            </p>
          </div>
        </div>

        {/* CUSTOM DATE PLANNER SECTION */}
        <div className="custom-date-planner-box">
          <div className="planner-header">
            <div className="planner-title-wrap">
              <span className="planner-emoji">💌</span>
              <div>
                <h3 className="planner-title">Describe Your Dream Date</h3>
                <p className="planner-subtitle">Tell him what kind of date you want to go on!</p>
              </div>
            </div>
          </div>

          {/* Quick inspiration chips */}
          <div className="quick-inspirations-wrap">
            <span className="inspiration-label">Quick ideas:</span>
            <div className="inspiration-chips">
              {QUICK_INSPIRATIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="chip-btn"
                  onClick={() => handleApplyInspiration(item)}
                >
                  <span>{item.emoji} {item.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area for her to type her custom date idea */}
          <div className="textarea-container">
            <textarea
              className="custom-date-textarea"
              rows={3}
              value={customDatePlan}
              onChange={(e) => setCustomDatePlan(e.target.value)}
              placeholder="Write your dream date idea here... (e.g. cozy dinner, sunset walk, pottery class, stargazing, amusement park, or anything you'd love! 🌸)"
              maxLength={280}
            />
            <span className="char-counter">{customDatePlan.length}/280</span>
          </div>

          {/* WhatsApp Message Live Preview */}
          <div className="whatsapp-preview-box">
            <div className="whatsapp-preview-header">
              <MessageCircle size={15} className="text-emerald" />
              <span>WhatsApp message preview to {senderName}:</span>
            </div>
            <p className="whatsapp-preview-content">
              💬 "Hey! 💕 I said YES on your date proposal website! 🥰<br />
              <strong>The date I'd love to go on:</strong><br />
              <em>"{customDatePlan.trim() || 'Surprise me! Anything fun with you! 💕'}"</em> 🌷✨<br />
              Can't wait! 🥂💖"
            </p>
          </div>

          {/* WhatsApp Send Button */}
          <button
            className="btn btn-whatsapp-confirm"
            onClick={handleSendCustomWhatsApp}
            aria-label={`Send custom date wish to ${senderName} on WhatsApp`}
          >
            <Send size={18} />
            <span>{hasSentWhatsApp ? `Update & Resend to ${senderName} on WhatsApp 💬` : `Send My Date Wish to ${senderName} on WhatsApp! 💬✨`}</span>
          </button>
        </div>

        {/* Interactive "You made my day! 💌" button */}
        <div className="success-actions-block">
          <button
            className="btn btn-made-my-day"
            onClick={handleMadeMyDay}
            aria-label="You made my day! Trigger more love confetti"
          >
            <Sparkles size={18} className="icon-spin" />
            <span>You made my day! 💌</span>
            <Heart size={18} fill="currentColor" className="icon-pulse" />
          </button>

          {reactionText && (
            <div className="reaction-bubble-pill" role="status">
              <span>{reactionText}</span>
            </div>
          )}
        </div>

        {/* Share & Screenshot celebration badge */}
        <div className="confirmation-badge-wrapper">
          <div className="confirmation-badge">
            <PartyPopper size={20} className="badge-icon" />
            <div className="badge-details">
              <strong>Official Date Agreement 📜💕</strong>
              <span>Status: Happily Confirmed!</span>
            </div>
            <button
              className="btn-copy-promise"
              onClick={handleCopyConfirmation}
              title="Copy sweet message"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Copied! 💗</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Replay or rethink option */}
        {onReplay && (
          <div className="replay-wrapper">
            <button className="btn-replay" onClick={onReplay}>
              🔄 See question again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
