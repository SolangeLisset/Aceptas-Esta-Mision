import { motion } from 'framer-motion';

type PixelCatProps = {
  mood?: 'happy' | 'walk' | 'watch' | 'sad' | 'coffee';
  size?: 'sm' | 'md' | 'lg';
};

export function PixelCat({ mood = 'happy', size = 'md' }: PixelCatProps) {
  const scale = { sm: 'scale-75', md: 'scale-100', lg: 'scale-125' }[size];
  const eyes = mood === 'sad' ? 'T T' : mood === 'watch' ? 'o o' : '^ ^';
  const mouth = mood === 'sad' ? '_' : mood === 'coffee' ? 'w' : 'u';

  return (
    <motion.div
      className={`pixel-sprite ${scale}`}
      animate={mood === 'walk' ? { x: [-90, 90, -90] } : { y: [0, -5, 0] }}
      transition={{ duration: mood === 'walk' ? 5 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Gato pixelado"
    >
      <div className="cat-ear left" />
      <div className="cat-ear right" />
      <div className="cat-face">
        <span className="cat-eyes">{eyes}</span>
        <span className="cat-mouth">{mouth}</span>
        {mood === 'coffee' && <span className="coffee-cup">☕</span>}
      </div>
      <div className="cat-body" />
      <div className="cat-tail" />
    </motion.div>
  );
}
