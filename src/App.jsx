import React, { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import SuccessCard from './components/SuccessCard';
import BackgroundFloatingHearts from './components/BackgroundFloatingHearts';
import SparkleTrail from './components/SparkleTrail';
import FloatingControls from './components/FloatingControls';
import { launchGrandCelebration } from './utils/confetti';
import { playCelebrationMelody, initBackgroundMusic } from './utils/audio';
import './App.css';

export default function App() {
  const [hasSaidYes, setHasSaidYes] = useState(false);
  const [recipientName, setRecipientName] = useState('Pretty Girl');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Initialize background music engine & read name parameter from URL
  useEffect(() => {
    initBackgroundMusic();

    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      if (name && name.trim()) {
        setRecipientName(name.trim());
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleYes = () => {
    // Grand celebration with heart confetti & romantic melody
    launchGrandCelebration();
    playCelebrationMelody();
    setHasSaidYes(true);
    // Note: Does NOT send WhatsApp immediately; she will write her dream date on the success screen!
  };

  const handleReplay = () => {
    setHasSaidYes(false);
  };

  return (
    <div className="date-simulator-app">
      {/* Dreamy ambient floating hearts and glowing orbs */}
      <BackgroundFloatingHearts />

      {/* Gentle interactive cursor/touch sparkle trail */}
      <SparkleTrail />

      {/* Top action controls (background music toggle, personalization) */}
      <FloatingControls
        recipientName={recipientName}
        onUpdateName={setRecipientName}
        isNameModalOpen={isNameModalOpen}
        setIsNameModalOpen={setIsNameModalOpen}
      />

      {/* Centered Main Stage */}
      <main className="main-content-viewport">
        {!hasSaidYes ? (
          <QuestionCard
            recipientName={recipientName}
            onYes={handleYes}
            onEditName={() => setIsNameModalOpen(true)}
          />
        ) : (
          <SuccessCard
            recipientName={recipientName}
            onReplay={handleReplay}
          />
        )}
      </main>

      {/* Subtle bottom love signature */}
      <footer className="app-footer-credit">
        <span>Made with infinite love & butterflies in the stomach 💕</span>
      </footer>
    </div>
  );
}
