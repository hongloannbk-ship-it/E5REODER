import React from 'react';
import { WordCard, WordItem } from './WordCard';

interface AnswerFrameProps {
  slotCount: number;
  placedWords: WordItem[];
  onWordClick: (index: number) => void;
  status: 'idle' | 'wrong' | 'correct';
}

export const AnswerFrame: React.FC<AnswerFrameProps> = ({
  slotCount,
  placedWords,
  onWordClick,
  status,
}) => {
  // Generate slots array
  const slots = Array.from({ length: slotCount });

  let containerBorderClass = 'border-[#facc15] bg-[#fef9c3]/85 shadow-[0_8px_0_#ca8a04]';
  if (status === 'wrong') {
    containerBorderClass = 'border-[#ef4444] bg-[#fee2e2] shadow-[0_8px_0_#b91c1c] animate-shake';
  } else if (status === 'correct') {
    containerBorderClass = 'border-[#22c55e] bg-[#dcfce7] shadow-[0_8px_0_#15803d] animate-correct-glow';
  }

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8
        border-4 sm:border-[6px] transition-all duration-300
        ${containerBorderClass}
      `}
    >
      {/* Visual Status Indicator Icon/Badge */}
      {status === 'wrong' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1.5 animate-bounce">
          <span>❌ Not quite right! Try again</span>
        </div>
      )}

      {status === 'correct' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white px-5 py-1 rounded-full text-base font-bold shadow-md flex items-center gap-1.5 animate-bounce">
          <span>🌟 Awesome! Perfectly arranged!</span>
        </div>
      )}

      {/* Slots row/grid */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 min-h-[85px] sm:min-h-[100px]">
        {slots.map((_, index) => {
          const placedWord = placedWords[index];

          if (placedWord) {
            return (
              <div key={placedWord.id + '_' + index} className="relative z-10 animate-pop-in">
                <WordCard
                  item={placedWord}
                  isFloating={false}
                  onClick={() => onWordClick(index)}
                />
              </div>
            );
          }

          return (
            <div
              key={'empty_slot_' + index}
              className="w-20 sm:w-28 md:w-32 h-14 sm:h-18 md:h-20
                border-[2.5px] sm:border-[3.5px] border-dashed border-[#581c87]/70 rounded-2xl md:rounded-3xl
                bg-[#fef08a]/35 flex items-center justify-center
                transition-all duration-150 hover:bg-[#fef08a]/60"
            >
              <span className="text-[#581c87]/30 text-xs sm:text-sm font-bold">
                {index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
