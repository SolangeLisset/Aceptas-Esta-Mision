import { useState } from 'react';

type MemeCatCardProps = {
  caption: string;
  imageUrl: string;
  tone?: 'pink' | 'blue' | 'dark';
};

export function MemeCatCard({ caption, imageUrl, tone = 'pink' }: MemeCatCardProps) {
  const [failed, setFailed] = useState(false);
  const toneClass = {
    pink: 'from-rose-200 to-amber-100',
    blue: 'from-cyan-200 to-lime-100',
    dark: 'from-stone-950 to-indigo-950 text-white',
  }[tone];

  return (
    <figure className={`meme-cat-card bg-gradient-to-br ${toneClass}`}>
      {!failed && (
        <img
          src={imageUrl}
          alt={caption}
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle,#ffd7e8,transparent_58%)] text-7xl">
          🐱
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
