import { Moon, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { ReactNode } from 'react';
import { PixelButton } from './PixelButton';
import { ParticleField } from './ParticleField';
import type { ThemeMode } from '../types';

type SceneFrameProps = {
  children: ReactNode;
  theme: ThemeMode;
  sound: boolean;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onReset: () => void;
};

export function SceneFrame({ children, theme, sound, onToggleTheme, onToggleSound, onReset }: SceneFrameProps) {
  return (
    <main className={`min-h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <section className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#fff7ad,transparent_30%),linear-gradient(135deg,#ffd7e8,#d8f3ff_45%,#dcfce7)] p-4 text-stone-900 transition dark:bg-[radial-gradient(circle_at_top_left,#51315b,transparent_30%),linear-gradient(135deg,#151225,#222141_45%,#1b3830)] dark:text-rose-50 sm:p-6">
        <ParticleField />
        <div className="absolute inset-0 opacity-[.18] bg-[linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] bg-[length:32px_32px]" />
        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button className="icon-button" onClick={onToggleTheme} title="Cambiar modo oscuro">
            <Moon size={18} />
          </button>
          <button className="icon-button" onClick={onToggleSound} title={sound ? 'Silenciar' : 'Activar sonido'}>
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="icon-button" onClick={onReset} title="Reiniciar progreso">
            <RotateCcw size={18} />
          </button>
        </div>
        <div className="relative z-10 w-full max-w-5xl">{children}</div>
        <div className="sr-only">
          <PixelButton onClick={onReset}>Reiniciar</PixelButton>
        </div>
      </section>
    </main>
  );
}
