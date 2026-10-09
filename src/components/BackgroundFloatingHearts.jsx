import React, { useMemo } from 'react';

export default function BackgroundFloatingHearts() {
  // Pre-generate stable positions for floating hearts and sparkles
  const floatingHearts = useMemo(() => {
    const emojis = ['💖', '💕', '💗', '🌸', '✨', '🤍', '🌷', '💘'];
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(i * 4.7 + 3) % 94}%`,
      bottom: `-${10 + (i % 5) * 5}px`,
      size: `${14 + (i % 5) * 6}px`,
      duration: `${10 + (i % 7) * 2.5}s`,
      delay: `${(i * 0.8) % 8}s`,
      swayDuration: `${3 + (i % 4)}s`,
      opacity: 0.35 + ((i % 4) * 0.15),
    }));
  }, []);

  const ambientTwinkles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      top: `${(i * 13 + 5) % 90}%`,
      left: `${(i * 17 + 8) % 92}%`,
      size: `${8 + (i % 4) * 4}px`,
      delay: `${(i * 0.5) % 4}s`,
      duration: `${2 + (i % 3)}s`,
    }));
  }, []);

  return (
    <div className="dreamy-background-container" aria-hidden="true">
      {/* Soft Ambient Glowing Orbs */}
      <div className="ambient-glow orb-1" />
      <div className="ambient-glow orb-2" />
      <div className="ambient-glow orb-3" />
      <div className="ambient-glow orb-4" />

      {/* Floating Hearts Layer */}
      <div className="floating-hearts-layer">
        {floatingHearts.map((item) => (
          <span
            key={item.id}
            className="floating-heart"
            style={{
              left: item.left,
              fontSize: item.size,
              animationDuration: `${item.duration}, ${item.swayDuration}`,
              animationDelay: `${item.delay}, ${item.delay}`,
              opacity: item.opacity,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Twinkling ambient stars */}
      <div className="ambient-twinkles-layer">
        {ambientTwinkles.map((star) => (
          <div
            key={star.id}
            className="twinkle-star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
