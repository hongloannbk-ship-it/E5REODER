import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BackgroundSky } from './components/BackgroundSky';
import { WordCard, WordItem } from './components/WordCard';
import { AnswerFrame } from './components/AnswerFrame';
import { AdminModal } from './components/AdminModal';
import { VictoryModal } from './components/VictoryModal';
import { sounds, speakText } from './utils/soundEffects';
import { ParticleEffect } from './utils/confetti';
import {
  Volume2,
  VolumeX,
  Settings,
  RotateCcw,
  Undo2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

// Default starter questions (First sentence matches the attached user image!)
const INITIAL_SENTENCES = [
  'I like reading books.',
  'The cat is sleeping.',
  'Bé thích đọc sách mỗi ngày.',
  'She plays the piano very well.',
  'Mặt trời mọc ở đằng đông.',
];

export default function App() {
  // Question database state (loaded from localStorage or defaults)
  const [sentences, setSentences] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('reorder_sentences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial
    }
    return INITIAL_SENTENCES;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [floatingWords, setFloatingWords] = useState<WordItem[]>([]);
  const [placedWords, setPlacedWords] = useState<WordItem[]>([]);
  const [frameStatus, setFrameStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Modals and settings
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Confetti canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleEffectRef = useRef<ParticleEffect | null>(null);

  // Initialize Canvas Confetti effect
  useEffect(() => {
    if (canvasRef.current) {
      particleEffectRef.current = new ParticleEffect(canvasRef.current);
    }
    const handleResize = () => {
      particleEffectRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      particleEffectRef.current?.stop();
    };
  }, []);

  // Split sentence into words and shuffle for the floating zone
  const loadSentence = useCallback(
    (index: number) => {
      if (!sentences || sentences.length === 0) return;
      const safeIndex = Math.min(Math.max(0, index), sentences.length - 1);
      const rawSentence = sentences[safeIndex]?.trim() || '';

      // Split by whitespace
      const words = rawSentence.split(/\s+/).filter((w) => w.length > 0);
      setTargetWords(words);

      // Create items with original indices
      const items: WordItem[] = words.map((w, i) => ({
        id: `${i}_${w}_${Math.random().toString(36).substring(2, 6)}`,
        text: w,
        originalIndex: i,
      }));

      // Shuffle words thoroughly
      const shuffled = [...items];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      setFloatingWords(shuffled);
      setPlacedWords([]);
      setFrameStatus('idle');
      setIsChecking(false);
    },
    [sentences]
  );

  // Reload when sentence index changes
  useEffect(() => {
    loadSentence(currentIndex);
  }, [currentIndex, loadSentence]);

  // Handle word selection: Move from floating to placed slot
  const handlePickWord = (item: WordItem) => {
    if (isChecking) return;
    setHasInteracted(true);
    sounds.playPop();
    sounds.playDrop();

    setFloatingWords((prev) => prev.filter((w) => w.id !== item.id));
    setPlacedWords((prev) => [...prev, item]);
  };

  // Handle removing a placed word: Returns back to floating
  const handleRemovePlacedWord = (slotIndex: number) => {
    if (isChecking) return;
    sounds.playUndo();

    const removed = placedWords[slotIndex];
    if (!removed) return;

    setPlacedWords((prev) => prev.filter((_, idx) => idx !== slotIndex));
    setFloatingWords((prev) => [...prev, removed]);
  };

  // Undo button
  const handleUndo = () => {
    if (isChecking || placedWords.length === 0) return;
    handleRemovePlacedWord(placedWords.length - 1);
  };

  // Reset current question
  const handleResetCurrent = () => {
    if (isChecking) return;
    sounds.playPop();
    loadSentence(currentIndex);
  };

  // Audio speech pronunciation button
  const handlePronounce = () => {
    sounds.playPop();
    const currentSentence = sentences[currentIndex] || '';
    speakText(currentSentence);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // Next question handler (activated when student answers correctly)
  const handleNextQuestion = () => {
    if (frameStatus !== 'correct') return;
    sounds.playPop();

    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Victory on completion of all sentences!
      sounds.playApplauseAndFanfare();
      particleEffectRef.current?.burst(200);
      setIsVictoryOpen(true);
    }
  };

  // Automatic Check when all slots are filled
  useEffect(() => {
    if (
      targetWords.length > 0 &&
      placedWords.length === targetWords.length &&
      !isChecking &&
      frameStatus === 'idle'
    ) {
      setIsChecking(true);

      const isCorrect = placedWords.every(
        (item, idx) => item.text === targetWords[idx]
      );

      if (isCorrect) {
        // CORRECT: celebrate and enable the "Tiếp Tục" button
        sounds.playCorrect();
        setFrameStatus('correct');
        particleEffectRef.current?.burst(90);
        setIsChecking(false);
      } else {
        // WRONG: shake and return words
        sounds.playWrong();
        setFrameStatus('wrong');
        setWrongAttempts((prev) => prev + 1);

        const timer = setTimeout(() => {
          // Return words back to floating after shake
          setFloatingWords((prev) => [...prev, ...placedWords]);
          setPlacedWords([]);
          setFrameStatus('idle');
          setIsChecking(false);
        }, 1200);

        return () => clearTimeout(timer);
      }
    }
  }, [placedWords, targetWords, isChecking, frameStatus]);

  // Restart entire game
  const handleRestartGame = () => {
    setIsVictoryOpen(false);
    setWrongAttempts(0);
    setCurrentIndex(0);
    loadSentence(0);
  };

  // Save updated questions from Admin Modal
  const handleSaveQuestions = (newSentences: string[]) => {
    setSentences(newSentences);
    try {
      localStorage.setItem('reorder_sentences', JSON.stringify(newSentences));
    } catch {
      // safe fallback
    }
    setCurrentIndex(0);
    setWrongAttempts(0);
    setIsAdminOpen(false);
    loadSentence(0);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-fredoka">
      {/* Background with sky, clouds, and cartoon hills */}
      <BackgroundSky />

      {/* Confetti & Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col min-h-screen">
        {/* Top Control Bar */}
        <header className="flex items-center justify-between gap-3 mb-2 sm:mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-[#701a75] border-2 border-[#f472b6] font-bold text-xs sm:text-sm shadow-[0_3px_0_#f472b6] active:translate-y-0.5 transition-all cursor-pointer"
              title="Settings & Edit Sentences"
            >
              <Settings className="w-4 h-4 text-[#f43f5e]" />
              <span className="hidden sm:inline">Settings / Edit</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-[#701a75] border-2 border-[#f472b6] shadow-[0_3px_0_#f472b6] active:translate-y-0.5 transition-all cursor-pointer"
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
              aria-label="Toggle Sound"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#f43f5e]" />
              )}
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/90 border-2 border-[#fde047] px-4 py-1.5 rounded-full shadow-[0_3px_0_#facc15] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold text-[#713f12] text-xs sm:text-sm">
              Sentence {currentIndex + 1} / {sentences.length}
            </span>
          </div>

          {/* Audio TTS Speaker Button */}
          <button
            type="button"
            onClick={handlePronounce}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] border-2 border-[#38bdf8] font-extrabold text-xs sm:text-sm shadow-[0_3px_0_#0284c7] active:translate-y-0.5 transition-all cursor-pointer"
            title="Listen to sentence pronunciation"
          >
            <Volume2 className="w-4 h-4 animate-pulse text-[#0284c7]" />
            <span>Pronounce</span>
          </button>
        </header>

        {/* Title & Cute Subtitle Banner (Matching Image) */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#3b0764] tracking-wider uppercase drop-shadow-[0_4px_0_#fbcfe8] mb-2 sm:mb-3">
            REORDER THE WORDS
          </h1>

          <div className="inline-flex items-center gap-2 bg-[#fef08a] border-3 sm:border-4 border-[#fde047] px-5 sm:px-7 py-1.5 sm:py-2 rounded-full shadow-[0_4px_0_#ca8a04]">
            <span className="text-sm sm:text-base md:text-lg font-bold text-[#713f12]">
              Drag and drop to arrange the words.
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#86198f] mt-1.5">
            Tap or click words to arrange the correct sentence
          </p>
        </div>

        {/* Khu vực trên: Vùng thả nổi chứa các ô chữ (từ) xáo trộn */}
        <section
          aria-label="Vùng thả nổi các từ"
          className="relative min-h-[160px] sm:min-h-[190px] md:min-h-[220px] flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-6 p-4 sm:p-6 mb-2"
        >
          {floatingWords.length === 0 && placedWords.length < targetWords.length ? (
            <div className="text-gray-400 font-bold text-sm italic">
              Đang tải từ...
            </div>
          ) : null}

          {floatingWords.map((item, index) => (
            <WordCard
              key={item.id}
              item={item}
              floatIndex={index}
              isFloating={true}
              onClick={() => handlePickWord(item)}
              showPointerHint={!hasInteracted && index === 0}
            />
          ))}
        </section>

        {/* Khu vực dưới: Khung viền màu vàng chứa các ô trống nét đứt */}
        <section aria-label="Khung đáp án sắp xếp" className="my-2 sm:my-4">
          <AnswerFrame
            slotCount={targetWords.length}
            placedWords={placedWords}
            onWordClick={handleRemovePlacedWord}
            status={frameStatus}
          />
        </section>

        {/* Action Controls: UNDO, REPLAY, and NEXT */}
        <footer className="mt-auto pt-3 pb-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5 relative z-20">
          <button
            type="button"
            onClick={handleUndo}
            disabled={placedWords.length === 0 || isChecking || frameStatus === 'correct'}
            className={`btn-candy-pink inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base font-extrabold text-white cursor-pointer active:translate-y-0.5 transition-all
              ${placedWords.length === 0 || isChecking || frameStatus === 'correct' ? 'opacity-50 pointer-events-none' : ''}`}
            title="Undo last word"
          >
            <Undo2 className="w-5 h-5" />
            <span>UNDO</span>
          </button>

          <button
            type="button"
            onClick={handleResetCurrent}
            disabled={placedWords.length === 0 || isChecking || frameStatus === 'correct'}
            className={`btn-candy-yellow inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base font-extrabold text-[#713f12] cursor-pointer active:translate-y-0.5 transition-all
              ${placedWords.length === 0 || isChecking || frameStatus === 'correct' ? 'opacity-50 pointer-events-none' : ''}`}
            title="Replay this sentence"
          >
            <RotateCcw className="w-5 h-5 text-[#854d0e]" />
            <span>REPLAY</span>
          </button>

          {/* Nút NEXT bên cạnh nút REPLAY để sang câu tiếp theo khi học sinh đã làm đúng */}
          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={frameStatus !== 'correct'}
            className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base font-extrabold transition-all cursor-pointer active:translate-y-0.5
              ${
                frameStatus === 'correct'
                  ? 'btn-candy-green text-white animate-bounce'
                  : 'bg-white/60 text-gray-400 border-2 border-gray-200 opacity-60 cursor-not-allowed shadow-none'
              }`}
            title={frameStatus === 'correct' ? 'Click to proceed to the next sentence' : 'Complete the sentence correctly to continue'}
          >
            <span>NEXT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </footer>
      </div>

      {/* Admin / Settings Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        sentences={sentences}
        onSave={handleSaveQuestions}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryOpen}
        totalQuestions={sentences.length}
        wrongAttempts={wrongAttempts}
        onRestart={handleRestartGame}
        onOpenAdmin={() => {
          setIsVictoryOpen(false);
          setIsAdminOpen(true);
        }}
      />
    </div>
  );
}
