import React from 'react';

export default function CuteMascot({ mood = 'asking' }) {
  const isHappy = mood === 'happy';

  return (
    <div className={`mascot-container ${isHappy ? 'is-happy' : 'is-asking'}`}>
      <svg
        viewBox="0 0 200 200"
        className="mascot-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={isHappy ? 'Cute happy bear celebrating' : 'Cute bear holding a rose'}
        role="img"
      >
        <defs>
          {/* Bear Body Gradient */}
          <linearGradient id="bearFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE2D2" />
            <stop offset="100%" stopColor="#ECC6B0" />
          </linearGradient>

          {/* Rose Gradient */}
          <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#C9184A" />
          </linearGradient>

          {/* Golden Crown Gradient for Celebration */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#F59F00" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient floating sparkles/hearts around mascot */}
        <g className="mascot-ambient">
          {isHappy ? (
            <>
              <text x="32" y="45" className="sparkle-float sparkle-1">💖</text>
              <text x="148" y="40" className="sparkle-float sparkle-2">✨</text>
              <text x="25" y="110" className="sparkle-float sparkle-3">🌸</text>
              <text x="155" y="115" className="sparkle-float sparkle-4">💕</text>
            </>
          ) : (
            <>
              <text x="35" y="55" className="sparkle-float sparkle-1">✨</text>
              <text x="145" y="60" className="sparkle-float sparkle-2">💗</text>
            </>
          )}
        </g>

        {/* Outer subtle shadow under the bear */}
        <ellipse cx="100" cy="180" rx="48" ry="12" fill="rgba(215, 130, 160, 0.18)" />

        {/* Bear Main Group with gentle breathe/bounce */}
        <g className="bear-body-group">
          {/* Ears */}
          {/* Left Ear */}
          <circle cx="60" cy="68" r="22" fill="url(#bearFur)" />
          <circle cx="60" cy="68" r="13" fill="#F8B4C0" opacity="0.8" />

          {/* Right Ear */}
          <circle cx="140" cy="68" r="22" fill="url(#bearFur)" />
          <circle cx="140" cy="68" r="13" fill="#F8B4C0" opacity="0.8" />

          {/* Celebratory Flower Crown / Tiny Heart Crown */}
          {isHappy && (
            <g className="bear-crown" transform="translate(100, 44)">
              <path
                d="M -22 0 L -15 -14 L -6 -3 L 0 -18 L 6 -3 L 15 -14 L 22 0 Z"
                fill="url(#goldGrad)"
                filter="url(#softGlow)"
              />
              <circle cx="0" cy="-18" r="3" fill="#FF4D6D" />
              <circle cx="-15" cy="-14" r="2.5" fill="#C084FC" />
              <circle cx="15" cy="-14" r="2.5" fill="#38BDF8" />
            </g>
          )}

          {/* Body */}
          <ellipse cx="100" cy="138" rx="46" ry="40" fill="url(#bearFur)" />
          {/* Tummy highlight */}
          <ellipse cx="100" cy="142" rx="30" ry="24" fill="#FFF5EC" />

          {/* Feet */}
          <ellipse cx="72" cy="172" rx="15" ry="10" fill="url(#bearFur)" />
          <circle cx="72" cy="172" r="6" fill="#F8B4C0" opacity="0.75" />
          <ellipse cx="128" cy="172" rx="15" ry="10" fill="url(#bearFur)" />
          <circle cx="128" cy="172" r="6" fill="#F8B4C0" opacity="0.75" />

          {/* Head */}
          <circle cx="100" cy="98" r="44" fill="url(#bearFur)" />

          {/* Snout */}
          <ellipse cx="100" cy="108" rx="19" ry="15" fill="#FFF5EC" />
          {/* Nose */}
          <path
            d="M 94 103 C 94 100, 106 100, 106 103 C 106 107, 100 110, 100 110 C 100 110, 94 107, 94 103 Z"
            fill="#5C3D2E"
          />

          {/* Mouth */}
          {isHappy ? (
            /* Open joyous smile */
            <g>
              <path
                d="M 92 112 Q 100 124 108 112"
                fill="#FF6584"
                stroke="#5C3D2E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 95 117 Q 100 123 105 117"
                fill="#FF8DA1"
              />
            </g>
          ) : (
            /* Shy sweet smile */
            <path
              d="M 93 112 Q 100 118 107 112"
              fill="none"
              stroke="#5C3D2E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="72" cy="110" rx="9" ry="6" fill="#FF85A1" opacity="0.55" className="blush-cheek" />
          <ellipse cx="128" cy="110" rx="9" ry="6" fill="#FF85A1" opacity="0.55" className="blush-cheek" />

          {/* Eyes */}
          {isHappy ? (
            /* Joyful closed happy crescent eyes */
            <g className="bear-happy-eyes">
              <path
                d="M 76 96 Q 84 88 92 96"
                fill="none"
                stroke="#4A2835"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 108 96 Q 116 88 124 96"
                fill="none"
                stroke="#4A2835"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            /* Big starry, pleading cute eyes with twinkle highlights */
            <g className="bear-asking-eyes">
              {/* Left Eye */}
              <circle cx="83" cy="95" r="7.5" fill="#3D201A" />
              <circle cx="81" cy="92.5" r="3" fill="#FFFFFF" />
              <circle cx="85.5" cy="97" r="1.5" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="117" cy="95" r="7.5" fill="#3D201A" />
              <circle cx="115" cy="92.5" r="3" fill="#FFFFFF" />
              <circle cx="119.5" cy="97" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Paws & Prop */}
          {isHappy ? (
            /* Celebrating bear arms holding heart balloon / bouquet */
            <g className="celebration-arms">
              {/* Left Paw waving */}
              <ellipse cx="58" cy="120" rx="12" ry="10" transform="rotate(-30 58 120)" fill="url(#bearFur)" />
              {/* Right Paw waving */}
              <ellipse cx="142" cy="120" rx="12" ry="10" transform="rotate(30 142 120)" fill="url(#bearFur)" />

              {/* Big Bouquet of Roses held in front */}
              <g transform="translate(100, 142)" className="mascot-bouquet">
                <circle cx="-10" cy="-6" r="10" fill="url(#roseGrad)" />
                <circle cx="10" cy="-6" r="10" fill="url(#roseGrad)" />
                <circle cx="0" cy="-14" r="11" fill="#FF4D6D" filter="url(#softGlow)" />
                <path d="M -16 6 Q 0 16 16 6" fill="#F8B4C0" stroke="#FF85A1" strokeWidth="2" />
                <text x="0" y="-10" textAnchor="middle" fontSize="12" fill="#FFFFFF">💖</text>
              </g>
            </g>
          ) : (
            /* Asking bear holding a delicate blooming rose */
            <g className="asking-arms">
              {/* Left paw tucked */}
              <ellipse cx="76" cy="138" rx="11" ry="9" fill="url(#bearFur)" />

              {/* Rose Stem & Leaves */}
              <path
                d="M 100 152 Q 112 142 118 124"
                fill="none"
                stroke="#52B788"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Leaf */}
              <path
                d="M 107 142 Q 118 140 115 148 Q 106 148 107 142 Z"
                fill="#74C69D"
              />

              {/* Rose Petals Flower */}
              <g transform="translate(120, 118)" className="mascot-rose">
                {/* Petal layers */}
                <circle cx="0" cy="0" r="11" fill="url(#roseGrad)" />
                <path
                  d="M -7 -4 Q 0 -12 7 -4 Q 6 7 -7 -4 Z"
                  fill="#FF758F"
                />
                <circle cx="0" cy="-1" r="5" fill="#FFE5EC" opacity="0.8" />
                {/* Tiny romantic aura around the rose */}
                <circle cx="0" cy="0" r="15" fill="none" stroke="#FF85A1" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" className="rose-aura" />
              </g>

              {/* Right paw holding the rose */}
              <ellipse cx="108" cy="140" rx="11" ry="9" fill="url(#bearFur)" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
