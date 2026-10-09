import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, User, Link as LinkIcon, Check, Music } from 'lucide-react';
import {
  toggleMusic,
  isSoundPrefEnabled,
  subscribeMusicState,
  playChime,
} from '../utils/audio';

export default function FloatingControls({
  recipientName,
  onUpdateName,
  isNameModalOpen,
  setIsNameModalOpen,
}) {
  const [soundEnabled, setSoundEnabled] = useState(isSoundPrefEnabled());
  const [copiedLink, setCopiedLink] = useState(false);
  const [tempName, setTempName] = useState(recipientName);

  useEffect(() => {
    // Keep in sync with audio manager state
    const unsubscribe = subscribeMusicState((state) => {
      setSoundEnabled(isSoundPrefEnabled());
    });
    return unsubscribe;
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleMusic();
    setSoundEnabled(newState);
    if (newState) {
      playChime(659.25, 'sine', 0.4);
    }
  };

  const handleSaveName = (e) => {
    e?.preventDefault();
    const clean = tempName.trim() || 'Pretty Girl';
    onUpdateName(clean);
    setIsNameModalOpen(false);
    playChime(784, 'sine', 0.5);

    // Update URL query param without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('name', clean);
    window.history.replaceState({}, '', url.toString());
  };

  const handleCopyPersonalizedLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', recipientName);
    navigator.clipboard?.writeText(url.toString());
    setCopiedLink(true);
    playChime(880, 'sine', 0.4);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="floating-top-bar">
        {/* Background Music & Sound Toggle */}
        <button
          className={`icon-pill-btn sound-toggle-btn ${soundEnabled ? 'sound-active' : 'sound-muted'}`}
          onClick={handleSoundToggle}
          title={soundEnabled ? 'Click to Mute Melody & Sound 🔇' : 'Click to Play Cute Background Melody 🎵'}
          aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={17} className="sound-icon-playing" />
              <span className="pill-text">Sound: ON 🎵</span>
            </>
          ) : (
            <>
              <VolumeX size={17} />
              <span className="pill-text">Sound: OFF 🔇</span>
            </>
          )}
        </button>

        {/* Personalize Button */}
        <button
          className="icon-pill-btn"
          onClick={() => {
            setTempName(recipientName);
            setIsNameModalOpen(true);
          }}
          title="Personalize Name 💗"
          aria-label="Customize recipient name"
        >
          <User size={16} />
          <span className="pill-text">For: {recipientName}</span>
        </button>

        {/* Share Personalized Link */}
        <button
          className="icon-pill-btn link-btn"
          onClick={handleCopyPersonalizedLink}
          title="Copy personalized link to share with her"
          aria-label="Copy personalized link"
        >
          {copiedLink ? <Check size={16} className="text-green" /> : <LinkIcon size={16} />}
          <span className="pill-text">{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
        </button>
      </div>

      {/* Modal to customize name */}
      {isNameModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNameModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <span className="modal-emoji">💌</span>
              <h2 id="modal-title" className="modal-title">Personalize Your Date Ask</h2>
            </div>
            <p className="modal-subtitle">
              Enter her name or nickname to make this experience uniquely hers:
            </p>

            <form onSubmit={handleSaveName} className="modal-form">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Sophia, Cutie, Maya..."
                maxLength={30}
                className="modal-input"
                autoFocus
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsNameModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  Save & Apply 💖
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
