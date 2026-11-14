import React from 'react';

export interface WordItem {
  id: string;
  text: string;
  originalIndex: number;
}

interface WordCardProps {
  item: WordItem;
  floatIndex?: number;
  isFloating?: boolean;
  onClick: () => void;
  showPointerHint?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  item,
  floatIndex = 0,
  isFloating = false,
  onClick,
  showPointerHint = false,
}) => {
  const floatClasses = [
    'animate-float-1',
    'animate-float-2',
    'animate-float-3',
    'animate-float-4',
    'animate-float-5',
  ];

  const chosenFloatClass = isFloating ? floatClasses[floatIndex % floatClasses.length] : '';

  return (
    <div className="relative inline-block select-none touch-manipulation">
      <button
        type="button"
        onClick={onClick}
        className={`group relative bg-white border-4 border-[#ff4d88] rounded-2xl md:rounded-3xl
          px-4 sm:px-6 py-2.5 sm:py-3.5 
          text-xl sm:text-2xl md:text-3xl font-extrabold text-[#38093c] tracking-tight
          word-card-shadow active:scale-95 transition-transform duration-150 cursor-pointer
          focus:outline-none focus:ring-4 focus:ring-pink-300
          ${chosenFloatClass} ${!isFloating ? 'animate-pop-in' : ''}
        `}
        aria-label={`Word: ${item.text}`}
      >
        <span>{item.text}</span>
      </button>

      {/* Cute pointing finger / cursor hint (matching image sample) */}
      {showPointerHint && (
        <div className="absolute -bottom-10 right-0 pointer-events-none z-30 animate-finger flex flex-col items-center">
          <svg
            className="w-8 h-8 text-[#f43f5e] drop-shadow-md"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sparkle lines */}
            <path
              d="M12 2V5M19 6L16.5 8.5M5 6L7.5 8.5"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Cursor Pointer */}
            <path
              d="M8.5 7.5L16.5 14L12.5 15L15 20L13 21L10.5 16L7.5 19L8.5 7.5Z"
              fill="white"
              stroke="#38093c"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <span className="bg-[#fef08a] text-[#713f12] text-xs font-bold px-2 py-0.5 rounded-full shadow border border-amber-300 mt-1 whitespace-nowrap">
            Tap here!
          </span>
        </div>
      )}
    </div>
  );
};
