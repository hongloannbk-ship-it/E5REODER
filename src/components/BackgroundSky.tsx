import React from 'react';

export const BackgroundSky: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Soft Pastel Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fce7f3] via-[#fdf2f8] to-[#fef9c3]" />

      {/* Floating Clouds */}
      <div className="absolute top-[6%] left-[4%] animate-cloud-drift opacity-80 scale-90 md:scale-100">
        <svg width="150" height="75" viewBox="0 0 150 75" fill="none">
          <ellipse cx="65" cy="45" rx="55" ry="25" fill="white" />
          <ellipse cx="90" cy="30" rx="35" ry="28" fill="white" />
          <ellipse cx="45" cy="36" rx="30" ry="24" fill="white" />
        </svg>
      </div>

      <div className="absolute top-[12%] right-[6%] animate-cloud-drift opacity-75 [animation-delay:-10s] scale-75 md:scale-110">
        <svg width="160" height="85" viewBox="0 0 160 85" fill="none">
          <ellipse cx="75" cy="50" rx="60" ry="28" fill="white" />
          <ellipse cx="105" cy="35" rx="38" ry="30" fill="white" />
          <ellipse cx="50" cy="40" rx="32" ry="26" fill="white" />
        </svg>
      </div>

      <div className="hidden sm:block absolute top-[28%] left-[1%] opacity-60 animate-cloud-drift [animation-delay:-18s] scale-70">
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <ellipse cx="55" cy="35" rx="45" ry="20" fill="white" />
          <ellipse cx="75" cy="24" rx="28" ry="22" fill="white" />
          <ellipse cx="35" cy="28" rx="24" ry="18" fill="white" />
        </svg>
      </div>

      {/* Rolling Cartoon Hills & Flowers at the bottom (matching sample image) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 md:h-36 pointer-events-none">
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back lighter green hill */}
          <path
            d="M0 110 C 320 60, 680 150, 1020 90 C 1240 50, 1380 80, 1440 100 L 1440 200 L 0 200 Z"
            fill="#bbf7d0"
          />
          {/* Front fresh lime hill */}
          <path
            d="M0 140 C 260 100, 520 170, 840 120 C 1140 70, 1340 130, 1440 135 L 1440 200 L 0 200 Z"
            fill="#86efac"
          />

          {/* Left cute bush & flower */}
          <g transform="translate(45, 115)">
            <ellipse cx="20" cy="25" rx="24" ry="22" fill="#4ade80" />
            <ellipse cx="40" cy="28" rx="20" ry="18" fill="#22c55e" />
            {/* Pink daisy */}
            <g transform="translate(62, 5) scale(0.9)">
              <circle cx="16" cy="16" r="14" fill="#f472b6" />
              <circle cx="16" cy="16" r="6" fill="#fef08a" />
            </g>
          </g>

          {/* Center-left small sprouts */}
          <g transform="translate(220, 150)">
            <ellipse cx="10" cy="15" rx="12" ry="16" fill="#22c55e" />
            <ellipse cx="22" cy="14" rx="10" ry="14" fill="#4ade80" />
          </g>

          {/* Center-right small sprout */}
          <g transform="translate(1120, 145)">
            <ellipse cx="10" cy="15" rx="12" ry="16" fill="#22c55e" />
            <ellipse cx="22" cy="14" rx="10" ry="14" fill="#4ade80" />
          </g>

          {/* Right cute flower */}
          <g transform="translate(1340, 120)">
            <ellipse cx="30" cy="30" rx="28" ry="24" fill="#4ade80" />
            {/* Hot pink flower */}
            <g transform="translate(15, -2) scale(0.95)">
              <circle cx="16" cy="16" r="14" fill="#f43f5e" />
              <circle cx="16" cy="16" r="6" fill="#fef08a" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
