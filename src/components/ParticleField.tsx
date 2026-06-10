import { memo } from 'react';

const particles = Array.from({ length: 46 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: `${(index % 9) * 0.35}s`,
  size: 3 + (index % 4) * 2,
}));

export const ParticleField = memo(function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          className="absolute rounded-sm bg-white/60 shadow-[0_0_14px_rgba(255,255,255,.7)] animate-drift"
          key={particle.id}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
});
