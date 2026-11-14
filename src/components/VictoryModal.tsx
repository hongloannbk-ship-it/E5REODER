import React from 'react';
import { sounds } from '../utils/soundEffects';

interface VictoryModalProps {
  isOpen: boolean;
  totalQuestions: number;
  wrongAttempts: number;
  onRestart: () => void;
  onOpenAdmin: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  totalQuestions,
  wrongAttempts,
  onRestart,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 to-pink-50 border-4 md:border-6 border-[#f59e0b] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-center animate-pop-in">
        {/* Animated Trophy / Star Badge */}
        <div className="relative mx-auto w-24 h-24 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#fde047] rounded-full blur-md opacity-60 animate-pulse" />
          <div className="relative text-7xl animate-bounce">🏆</div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#581c87] mb-2 tracking-tight">
          CONGRATULATIONS!
        </h2>
        <p className="text-base sm:text-lg font-bold text-pink-600 mb-6">
          You completed the sentences well. 🎉
        </p>

        {/* Stats card */}
        <div className="bg-white/80 border-2 border-pink-200 rounded-2xl p-4 mb-6 shadow-inner flex justify-around">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#581c87]">
              {totalQuestions} / {totalQuestions}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase">
              Completed
            </div>
          </div>
          <div className="w-[1px] bg-pink-200" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {Math.max(1, 3 - Math.min(2, Math.floor(wrongAttempts / 2)))} ⭐
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase">
              Star Rating
            </div>
          </div>
          <div className="w-[1px] bg-pink-200" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {wrongAttempts}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase">
              Retries
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onRestart();
            }}
            className="btn-candy-pink px-7 py-3 rounded-full text-lg font-black text-white cursor-pointer active:translate-y-0.5"
          >
            🔄 Play Again
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenAdmin();
            }}
            className="btn-candy-yellow px-6 py-3 rounded-full text-lg font-black text-[#713f12] cursor-pointer active:translate-y-0.5"
          >
            ⚙️ Edit Sentences
          </button>
        </div>
      </div>
    </div>
  );
};
