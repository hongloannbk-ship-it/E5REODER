import React, { useState } from 'react';
import { generateSingleFileHtml, downloadHtmlFile } from '../utils/exportSingleHtml';
import { sounds } from '../utils/soundEffects';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  sentences: string[];
  onSave: (newSentences: string[]) => void;
}

const PRESET_ENGLISH = [
  'I like reading books.',
  'The cat is sleeping.',
  'She plays the piano very well.',
  'We have a happy family.',
  'The sun shines bright in the sky.',
];

const PRESET_VIETNAMESE = [
  'Bé thích đọc sách mỗi ngày.',
  'Mặt trời mọc ở đằng đông.',
  'Em yêu trường lớp và thầy cô.',
  'Mùa xuân chim hót líu lo.',
  'Chú mèo con cuộn tròn ngủ say.',
];

const PRESET_SIMPLE = [
  'I love my mom.',
  'Birds can fly high.',
  'The dog is barking.',
  'Apples are sweet.',
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  sentences,
  onSave,
}) => {
  const [textInput, setTextInput] = useState(() => sentences.join('\n'));
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: string[]) => {
    sounds.playPop();
    setTextInput(preset.join('\n'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setTextInput(content.trim());
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    const lines = textInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      alert('Please enter at least one sentence!');
      return;
    }

    sounds.playCorrect();
    onSave(lines);
    setSaveSuccessMsg('Successfully saved to browser storage!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      onClose();
    }, 700);
  };

  const handleExportHtml = () => {
    sounds.playPop();
    const lines = textInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const targetList = lines.length > 0 ? lines : sentences;
    const html = generateSingleFileHtml(targetList);
    downloadHtmlFile(html, 'reorder-the-words-game.html');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-white border-4 border-[#ff4d88] rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-2xl font-black text-[#581c87]">
              Settings & Question Editor
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 font-black flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Preset quick buttons */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🎯 Choose preset sentences:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset(PRESET_ENGLISH)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 transition-colors cursor-pointer"
            >
              🇬🇧 Basic English (Sample)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(PRESET_VIETNAMESE)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
            >
              🇻🇳 Primary Vietnamese
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(PRESET_SIMPLE)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
            >
              ⭐ Easy Short Sentences (3-4 words)
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-gray-700">
              📝 Enter sentences (one sentence per line):
            </label>
            <span className="text-xs text-gray-500">
              Automatically splits words by spaces
            </span>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={6}
            placeholder="I like reading books.&#10;The cat is sleeping.&#10;She plays the piano very well."
            className="w-full p-3.5 rounded-2xl border-2 border-pink-200 focus:border-[#ff4d88] focus:ring-2 focus:ring-pink-200 text-base font-medium text-gray-800 outline-none transition-all resize-y"
          />
        </div>

        {/* File upload option */}
        <div className="mb-5 p-3.5 bg-pink-50/70 rounded-2xl border border-pink-100">
          <label className="block text-xs font-bold text-pink-900 mb-1">
            📂 Upload sentence list (.txt):
          </label>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#ff4d88] file:text-white hover:file:opacity-90 cursor-pointer"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            * Supports .txt files (teachers can export from Word or Notepad)
          </p>
        </div>

        {/* Export Single-file HTML feature */}
        <div className="mb-6 p-3.5 bg-yellow-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
              <span>📦</span> Download Standalone Single-File HTML
            </h4>
            <p className="text-[11px] text-amber-800">
              Bundle entire game into 1 single HTML file to play offline without internet!
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportHtml}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#ca8a04] hover:bg-[#a16207] text-white shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            ⬇️ Download .HTML
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="mb-4 p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center">
            {saveSuccessMsg}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl text-sm font-black bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-md active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>💾</span> Save & Start
          </button>
        </div>
      </div>
    </div>
  );
};
