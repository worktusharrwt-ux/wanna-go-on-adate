import React, { useEffect, useState } from 'react';

const SPARKLE_CHARS = ['✨', '💖', '🌸', '💕', '⭐'];

export default function SparkleTrail() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    let lastTime = 0;

    const handlePointerMove = (e) => {
      const now = Date.now();
      // Throttle creation to every 70ms so it stays buttery smooth
      if (now - lastTime < 70) return;
      lastTime = now;

      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (x === undefined || y === undefined) return;

      const id = `${now}-${Math.random()}`;
      const char = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
      const size = 12 + Math.floor(Math.random() * 12);
      const driftX = (Math.random() - 0.5) * 40;

      const newSparkle = { id, x, y, char, size, driftX };

      setSparkles((prev) => [...prev.slice(-18), newSparkle]);

      // Remove after animation completes (750ms)
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 750);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <div className="sparkle-trail-container" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="cursor-sparkle"
          style={{
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            '--drift-x': `${s.driftX}px`,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
