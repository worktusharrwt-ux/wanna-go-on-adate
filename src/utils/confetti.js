import confetti from 'canvas-confetti';

const romanticColors = [
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

// Custom heart shape
let heartShape = null;
try {
  heartShape = confetti.shapeFromPath({
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
  });
} catch (e) {
  heartShape = null;
}

export function launchGrandCelebration() {
  const shapes = heartShape ? [heartShape, 'circle'] : ['circle'];

  // Wave 1: Center heart burst
  confetti({
    particleCount: 70,
    spread: 100,
    origin: { y: 0.6 },
    colors: romanticColors,
    shapes: shapes,
    scalar: 1.4,
    ticks: 200,
    gravity: 0.8,
  });

  // Wave 2: Left and right cannons
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.7 },
      colors: romanticColors,
      shapes: shapes,
      scalar: 1.2,
      ticks: 220,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.7 },
      colors: romanticColors,
      shapes: shapes,
      scalar: 1.2,
      ticks: 220,
    });
  }, 250);

  // Wave 3: Raining heart shower from top
  setTimeout(() => {
    const duration = 2500;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 15;
      confetti({
        particleCount,
        startVelocity: 0,
        ticks: 250,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.2 - 0.1,
        },
        colors: romanticColors,
        shapes: shapes,
        gravity: 0.6,
        scalar: 1.1,
        drift: (Math.random() - 0.5) * 1.5,
      });
    }, 180);
  }, 600);
}

export function launchHeartBurst(x = 0.5, y = 0.5) {
  const shapes = heartShape ? [heartShape] : ['circle'];
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { x, y },
    colors: romanticColors,
    shapes: shapes,
    scalar: 1.3,
    ticks: 150,
    gravity: 0.9,
  });
}
