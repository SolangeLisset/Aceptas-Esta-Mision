import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { HiddenClues } from './HiddenClues';
import { PixelButton } from './PixelButton';

type FallingItem = {
  id: number;
  kind: 'hotdog' | 'rock';
  left: number;
  duration: number;
};

type MiniGameHotdogsProps = {
  onComplete: () => void;
  playSound: (name: 'catch' | 'bonk' | 'success') => void;
};

export function MiniGameHotdogs({ onComplete, playSound }: MiniGameHotdogsProps) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [catcherLeft, setCatcherLeft] = useState(50);
  const catcherLeftRef = useRef(catcherLeft);
  const resolvedItemsRef = useRef(new Set<number>());

  useEffect(() => {
    catcherLeftRef.current = catcherLeft;
  }, [catcherLeft]);

  useEffect(() => {
    const timer = window.setInterval(() => setTime((current) => current - 1), 1000);
    const landingTimers: number[] = [];
    const spawner = window.setInterval(() => {
      const item: FallingItem = {
        id: Date.now() + Math.random(),
        kind: Math.random() > 0.22 ? 'hotdog' : 'rock',
        left: 8 + Math.random() * 84,
        duration: 3.3 + Math.random() * 1.6,
      };

      setItems((current) => [...current.slice(-12), item]);
      const landingTimer = window.setTimeout(() => {
        if (resolvedItemsRef.current.has(item.id)) return;
        resolvedItemsRef.current.add(item.id);
        setItems((current) => current.filter((candidate) => candidate.id !== item.id));

        if (Math.abs(item.left - catcherLeftRef.current) <= 12) {
          setScore((current) => Math.max(0, current + (item.kind === 'hotdog' ? 10 : -7)));
          playSound(item.kind === 'hotdog' ? 'catch' : 'bonk');
        }
      }, item.duration * 1000);

      landingTimers.push(landingTimer);
    }, 560);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(spawner);
      landingTimers.forEach((landingTimer) => window.clearTimeout(landingTimer));
    };
  }, [playSound]);

  useEffect(() => {
    if (time <= 0) {
      playSound('success');
      onComplete();
    }
  }, [onComplete, playSound, time]);

  useEffect(() => {
    const moveWithKeys = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        setCatcherLeft((current) => Math.max(6, current - 7));
      }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        setCatcherLeft((current) => Math.min(90, current + 7));
      }
    };

    window.addEventListener('keydown', moveWithKeys);
    return () => window.removeEventListener('keydown', moveWithKeys);
  }, []);

  const catchItem = (item: FallingItem) => {
    resolvedItemsRef.current.add(item.id);
    setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    setScore((current) => Math.max(0, current + (item.kind === 'hotdog' ? 10 : -7)));
    playSound(item.kind === 'hotdog' ? 'catch' : 'bonk');
  };

  return (
    <div className="game-stage">
      <HiddenClues />
      <div className="hud">
        <span>Puntos: {score}</span>
        <span>Tiempo: {Math.max(0, time)}s</span>
      </div>
      <div className="text-center">
        <h2 className="mb-2 font-pixel text-lg sm:text-2xl">Atrapa completos cosmicos</h2>
        <p className="text-sm opacity-80">Mueve la canasta con el mouse, dedo o flechas. Las piedras arruinan la once.</p>
      </div>
      <div
        className="relative h-[52vh] min-h-96 overflow-hidden rounded-md border-4 border-stone-800 bg-sky-100/70 shadow-pixel dark:bg-slate-900/70"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const nextLeft = ((event.clientX - bounds.left) / bounds.width) * 100;
          setCatcherLeft(Math.min(90, Math.max(6, nextLeft)));
        }}
        onPointerDown={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const nextLeft = ((event.clientX - bounds.left) / bounds.width) * 100;
          setCatcherLeft(Math.min(90, Math.max(6, nextLeft)));
        }}
      >
        {items.map((item) => (
          <motion.button
            key={item.id}
            className="absolute top-0 text-4xl drop-shadow"
            initial={{ y: -60, rotate: -12 }}
            animate={{ y: '58vh', rotate: item.kind === 'rock' ? 90 : 20 }}
            transition={{ duration: item.duration, ease: 'linear' }}
            style={{ left: `${item.left}%` }}
            onClick={() => catchItem(item)}
            title={item.kind === 'hotdog' ? 'Completo' : 'Piedra'}
          >
            {item.kind === 'hotdog' ? '🌭' : '🪨'}
          </motion.button>
        ))}
        <motion.div
          className="pointer-events-none absolute bottom-5 -translate-x-1/2 text-5xl"
          animate={{ left: `${catcherLeft}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          🧺
        </motion.div>
      </div>
    </div>
  );
}

type Pigeon = {
  id: number;
  top: number;
  duration: number;
};

type DodgePigeonsProps = {
  onComplete: () => void;
  playSound: (name: 'bonk' | 'success') => void;
};

export function DodgePigeons({ onComplete, playSound }: DodgePigeonsProps) {
  const [time, setTime] = useState(20);
  const [hits, setHits] = useState(0);
  const [playerY, setPlayerY] = useState(50);
  const [pigeons, setPigeons] = useState<Pigeon[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setTime((current) => current - 1), 1000);
    const spawner = window.setInterval(() => {
      const top = 10 + Math.random() * 75;
      setPigeons((current) => [...current.slice(-9), { id: Date.now() + Math.random(), top, duration: 2.2 + Math.random() }]);
      if (Math.abs(top - playerY) < 18 && Math.random() > 0.45) {
        setHits((current) => current + 1);
        playSound('bonk');
      }
    }, 750);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(spawner);
    };
  }, [playSound, playerY]);

  useEffect(() => {
    if (time <= 0) {
      playSound('success');
      onComplete();
    }
  }, [onComplete, playSound, time]);

  return (
    <div className="game-stage">
      <HiddenClues message="No todo lo que vuela es una senal, pero casi." />
      <div className="hud">
        <span>Choques: {hits}</span>
        <span>Tiempo: {Math.max(0, time)}s</span>
      </div>
      <div className="text-center">
        <h2 className="mb-2 font-pixel text-lg sm:text-2xl">Esquiva palomas dramaticas</h2>
        <p className="text-sm opacity-80">Mueve el cursor o toca la pantalla para subir y bajar.</p>
      </div>
      <div
        className="relative h-[52vh] min-h-96 overflow-hidden rounded-md border-4 border-stone-800 bg-cyan-100/70 shadow-pixel dark:bg-indigo-950/70"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          setPlayerY(((event.clientY - bounds.top) / bounds.height) * 100);
        }}
      >
        {pigeons.map((pigeon) => (
          <motion.div
            key={pigeon.id}
            className="absolute -right-14 text-5xl"
            style={{ top: `${pigeon.top}%` }}
            initial={{ x: 0 }}
            animate={{ x: '-112vw' }}
            transition={{ duration: pigeon.duration, ease: 'linear' }}
          >
            🕊️
          </motion.div>
        ))}
        <motion.div className="absolute left-12 text-5xl" animate={{ top: `${playerY}%` }} transition={{ type: 'spring', stiffness: 160 }}>
          🛡️
        </motion.div>
      </div>
    </div>
  );
}

type FeedCatProps = {
  onComplete: () => void;
  playSound: (name: 'catch' | 'sad' | 'success') => void;
};

export function FeedCat({ onComplete, playSound }: FeedCatProps) {
  const [fed, setFed] = useState(0);
  const [mood, setMood] = useState<'happy' | 'sad'>('happy');

  const feed = (kind: 'fish' | 'shoe' | 'rock') => {
    if (kind === 'fish') {
      setFed((current) => current + 1);
      setMood('happy');
      playSound('catch');
    } else {
      setMood('sad');
      playSound('sad');
    }
  };

  useEffect(() => {
    if (fed >= 4) {
      playSound('success');
      const timer = window.setTimeout(onComplete, 850);
      return () => window.clearTimeout(timer);
    }
  }, [fed, onComplete, playSound]);

  const foods = [
    { kind: 'fish' as const, icon: '🐟' },
    { kind: 'shoe' as const, icon: '👞' },
    { kind: 'rock' as const, icon: '🪨' },
  ];

  return (
    <div className="game-stage">
      <HiddenClues message="Un corazon bien alimentado recuerda." />
      <div className="hud">
        <span>Confianza: {fed}/4</span>
        <span>{fed >= 4 ? 'El gato confia en ti.' : 'Alimenta al gato'}</span>
      </div>
      <div className="text-center">
        <h2 className="mb-2 font-pixel text-lg sm:text-2xl">Operacion snack felino</h2>
        <p className="text-sm opacity-80">Arrastra el pescado al gato. Tiene estandares.</p>
      </div>
      <div className="relative flex min-h-96 flex-col items-center justify-between gap-8 rounded-md border-4 border-stone-800 bg-emerald-100/70 p-6 shadow-pixel dark:bg-emerald-950/70 sm:flex-row">
        <div className="flex gap-4">
          {foods.map((food) => (
            <motion.button
              key={food.kind}
              drag
              dragSnapToOrigin
              whileDrag={{ scale: 1.25, rotate: 8 }}
              onDragEnd={(_, info) => {
                if (info.point.x > window.innerWidth * 0.46) feed(food.kind);
              }}
              onClick={() => feed(food.kind)}
              className="grid h-20 w-20 place-items-center rounded-md border-4 border-stone-800 bg-white/80 text-4xl shadow-pixel"
              title={`Arrastrar ${food.kind}`}
            >
              {food.icon}
            </motion.button>
          ))}
        </div>
        <div className="drop-zone">
          <div className="mb-4 font-pixel text-[10px]">Zona gato</div>
          <div className="text-8xl">{mood === 'sad' ? '😿' : fed >= 4 ? '😻' : '🐱'}</div>
        </div>
      </div>
    </div>
  );
}
