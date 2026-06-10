import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PixelButton } from './PixelButton';

type CelebrationProps = {
  onCredits: () => void;
};

const confetti = Array.from({ length: 80 }, (_, index) => ({
  id: index,
  left: `${(index * 29) % 100}%`,
  delay: (index % 16) * 0.12,
  color: ['#ff8fab', '#ffd166', '#8ecae6', '#b8f2c7', '#cdb4db'][index % 5],
}));

export function Celebration({ onCredits }: CelebrationProps) {
  const [canShowCredits, setCanShowCredits] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCanShowCredits(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[78vh] overflow-hidden rounded-md border-4 border-stone-800 bg-stone-950 p-6 text-center text-white shadow-pixel">
      {confetti.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute h-3 w-2 rounded-sm"
          style={{ left: piece.left, background: piece.color }}
          initial={{ y: -40, rotate: 0 }}
          animate={{ y: '84vh', rotate: 360 }}
          transition={{ duration: 4.5, delay: piece.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.22),transparent_10%),radial-gradient(circle_at_75%_30%,rgba(255,214,102,.24),transparent_9%),radial-gradient(circle_at_50%_70%,rgba(255,143,171,.24),transparent_11%)]" />
      <div className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center gap-7">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} className="text-7xl">
          ✨
        </motion.div>
        <h2 className="max-w-3xl font-pixel text-xl leading-10 sm:text-3xl">Nueva aventura desbloqueada</h2>
        <p className="max-w-xl text-lg text-rose-100">Has obtenido un recuerdo que recien comienza.</p>
        <PixelButton onClick={onCredits} variant="coffee" disabled={!canShowCredits}>
          Ver creditos
        </PixelButton>
      </div>
    </div>
  );
}
