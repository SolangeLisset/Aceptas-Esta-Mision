import { useEffect, useState } from 'react';

type TypewriterProps = {
  lines: string[];
  onDone: () => void;
};

export function Typewriter({ lines, onDone }: TypewriterProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [visible, setVisible] = useState('');

  useEffect(() => {
    if (lineIndex >= lines.length) {
      const doneTimer = window.setTimeout(onDone, 900);
      return () => window.clearTimeout(doneTimer);
    }
    if (visible.length < lines[lineIndex].length) {
      const timer = window.setTimeout(() => setVisible(lines[lineIndex].slice(0, visible.length + 1)), 38);
      return () => window.clearTimeout(timer);
    }
    const pause = window.setTimeout(() => {
      setLineIndex((current) => current + 1);
      setVisible('');
    }, 1100);
    return () => window.clearTimeout(pause);
  }, [lineIndex, lines, onDone, visible]);

  return (
    <div className="min-h-52 rounded-md border-4 border-stone-800 bg-stone-950/90 p-5 font-pixel text-sm leading-8 text-rose-100 shadow-pixel sm:p-8 sm:text-lg">
      {lines.slice(0, lineIndex).map((line) => (
        <p className="mb-5" key={line}>
          {line}
        </p>
      ))}
      {lineIndex < lines.length && (
        <p>
          {visible}
          <span className="animate-pulse">_</span>
        </p>
      )}
    </div>
  );
}
