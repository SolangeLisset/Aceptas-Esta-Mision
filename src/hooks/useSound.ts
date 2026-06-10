import { useCallback, useEffect, useRef } from 'react';

type SoundName = 'start' | 'click' | 'catch' | 'bonk' | 'sad' | 'success' | 'sparkle';
type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

const notes: Record<SoundName, number[]> = {
  start: [523.25, 659.25, 783.99],
  click: [659.25],
  catch: [880, 1174.66],
  bonk: [130.81, 98],
  sad: [293.66, 246.94],
  success: [523.25, 659.25, 783.99, 1046.5],
  sparkle: [987.77, 1318.51, 1567.98],
};

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const getContext = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AudioContextCtor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
        if (!AudioContextCtor) return null;
        ctxRef.current = new AudioContextCtor();
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      const ctx = getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      try {
        if (ctx.state === 'suspended') void ctx.resume();
        notes[name].forEach((frequency, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = name === 'bonk' ? 'square' : 'sine';
          osc.frequency.setValueAtTime(frequency, now + index * 0.08);
          gain.gain.setValueAtTime(0.0001, now + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.07, now + index * 0.08 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.16);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.18);
        });
      } catch {
        // Sound is decorative; UI flow should always keep working.
      }
    },
    [enabled, getContext],
  );

  const startMusic = useCallback(
    (calm = false) => {
      if (!enabled || musicRef.current) return;
      const ctx = getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = calm ? 174.61 : 220;
      gain.gain.value = calm ? 0.022 : 0.018;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      musicRef.current = { osc, gain };
    },
    [enabled, getContext],
  );

  const setCalmMusic = useCallback((calm: boolean) => {
    const current = musicRef.current;
    const ctx = ctxRef.current;
    if (!current || !ctx) return;
    current.osc.frequency.setTargetAtTime(calm ? 174.61 : 220, ctx.currentTime, 0.5);
    current.gain.gain.setTargetAtTime(calm ? 0.03 : 0.018, ctx.currentTime, 0.5);
  }, []);

  useEffect(() => {
    if (!enabled && musicRef.current) {
      musicRef.current.osc.stop();
      musicRef.current = null;
    }
  }, [enabled]);

  return { play, startMusic, setCalmMusic };
}
