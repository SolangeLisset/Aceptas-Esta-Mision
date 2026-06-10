import { PixelCat } from './PixelCat';

type HiddenCluesProps = {
  message?: string;
};

export function HiddenClues({ message = 'La mejor recompensa siempre esta al final.' }: HiddenCluesProps) {
  return (
    <>
      <div className="absolute bottom-4 left-4 hidden rounded-md border-2 border-stone-800 bg-white/75 px-3 py-2 font-pixel text-[8px] shadow-pixel dark:bg-stone-900/75 sm:block">
        NPC: "{message}"
      </div>
      <div className="absolute right-5 top-20 hidden rotate-3 rounded-md border-2 border-stone-800 bg-lime-100 px-3 py-2 font-pixel text-[8px] shadow-pixel dark:bg-lime-900/70 md:block">
        No abandones la mision principal
      </div>
      <div className="absolute bottom-16 right-10 text-xl opacity-60">❤</div>
      <div className="absolute left-8 top-24 opacity-70">
        <PixelCat mood="watch" size="sm" />
      </div>
    </>
  );
}
