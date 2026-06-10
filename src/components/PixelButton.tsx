import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type PixelButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'coffee' | 'quiet';
  disabled?: boolean;
  title?: string;
};

export function PixelButton({ children, onClick, variant = 'primary', disabled, title }: PixelButtonProps) {
  const variants = {
    primary: 'bg-rose-300 text-stone-900 hover:bg-rose-200',
    coffee: 'bg-amber-200 text-stone-950 hover:bg-amber-100',
    quiet: 'bg-white/70 text-stone-900 hover:bg-white',
  };

  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ y: 2, scale: 0.98 }}
      className={`rounded-md px-5 py-4 font-pixel text-[11px] leading-5 shadow-pixel transition disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </motion.button>
  );
}
