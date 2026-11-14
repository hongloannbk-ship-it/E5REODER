/**
 * Web Audio API synthesizer for child-friendly game sound effects.
 * 100% synthesized in real-time, no external audio files or network requests needed.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Cute bubble pop sound when tapping a word card
   */
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      // High to low frequency drop creates a cartoon pop/bubble effect
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext safe fail
    }
  }

  /**
   * Satisfying slot landing sound
   */
  public playDrop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // AudioContext safe fail
    }
  }

  /**
   * Reverse swoosh when undoing/returning a card
   */
  public playUndo() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // AudioContext safe fail
    }
  }

  /**
   * Cartoon buzzer / wobble "uh-oh" for wrong answer
   */
  public playWrong() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Two quick downward buzzes
      [0, 0.18].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now + delay);
        osc.frequency.linearRampToValueAtTime(120, now + delay + 0.15);

        gain.gain.setValueAtTime(0.22, now + delay);
        gain.gain.linearRampToValueAtTime(0.01, now + delay + 0.15);

        // Low-pass filter to soften the harshness of sawtooth for children
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now + delay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.16);
      });
    } catch {
      // AudioContext safe fail
    }
  }

  /**
   * Bright crystal chime / ting for correct answer
   */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Arpeggio chords: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const startTime = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.26, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        // Add subtle harmonic sparkle
        const shimmer = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(freq * 2, startTime);
        shimmerGain.gain.setValueAtTime(0.06, startTime);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        shimmer.connect(shimmerGain);
        shimmerGain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
        shimmer.start(startTime);
        shimmer.stop(startTime + 0.45);
      });
    } catch {
      // AudioContext safe fail
    }
  }

  /**
   * Synthesized victory fanfare + applause clapping for completion
   */
  public playApplauseAndFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Fanfare notes: G4, C5, E5, G5, long C6
      const fanfareNotes = [
        { freq: 392.00, time: 0, dur: 0.15 },
        { freq: 523.25, time: 0.16, dur: 0.15 },
        { freq: 659.25, time: 0.32, dur: 0.15 },
        { freq: 783.99, time: 0.48, dur: 0.2 },
        { freq: 1046.50, time: 0.72, dur: 0.8 },
      ];

      fanfareNotes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.28, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });

      // 2. Synthesized clapping bursts (white noise pulses)
      const clapCount = 36;
      for (let i = 0; i < clapCount; i++) {
        const clapTime = now + 0.3 + (i * 0.06) + (Math.random() * 0.03);
        const bufferSize = ctx.sampleRate * 0.04; // 40ms burst
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1100 + Math.random() * 600;
        filter.Q.value = 1.8;

        const clapGain = ctx.createGain();
        clapGain.gain.setValueAtTime(0.18 + Math.random() * 0.1, clapTime);
        clapGain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.05);

        noise.connect(filter);
        filter.connect(clapGain);
        clapGain.connect(ctx.destination);

        noise.start(clapTime);
      }
    } catch {
      // AudioContext safe fail
    }
  }
}

export const sounds = new SoundSynthesizer();

/**
 * Text-to-Speech using standard Web Speech API
 */
export function speakText(text: string, preferredLang?: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    // Clean text of ending punctuation for clear vocalization
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Slightly slower for children
    utterance.pitch = 1.05;

    // Detect if text is mostly Vietnamese or English
    const isVietnamese = preferredLang?.startsWith('vi') || /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (isVietnamese) {
        const viVoice = voices.find((v) => v.lang.toLowerCase().includes('vi') || v.name.toLowerCase().includes('vietnam'));
        if (viVoice) {
          utterance.voice = viVoice;
          utterance.lang = 'vi-VN';
        } else {
          utterance.lang = 'vi-VN';
        }
      } else {
        const enVoice = voices.find(
          (v) => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))) || v.lang.startsWith('en')
        );
        if (enVoice) {
          utterance.voice = enVoice;
          utterance.lang = enVoice.lang;
        } else {
          utterance.lang = 'en-US';
        }
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis safe fail
  }
}
