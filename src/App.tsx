import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Coffee, Heart, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Celebration } from './components/Celebration';
import { DodgePigeons, FeedCat, MiniGameHotdogs } from './components/MiniGameHotdogs';
import { HiddenClues } from './components/HiddenClues';
import { MemeCatCard } from './components/MemeCatCard';
import { PixelButton } from './components/PixelButton';
import { PixelCat } from './components/PixelCat';
import { SceneFrame } from './components/SceneFrame';
import { Typewriter } from './components/Typewriter';
import { usePersistentState } from './hooks/usePersistentState';
import { useSound } from './hooks/useSound';
import type { Scene, ThemeMode } from './types';

const sceneOrder: Scene[] = ['start', 'intro', 'hotdogs', 'hotdogsDone', 'pigeons', 'feedCat', 'reveal', 'final', 'celebration', 'credits'];
const rejectButtonTexts = ['No, gracias', '¿Segura?', 'No disponible en tu region', 'Consulta con el gato', 'Aceptar es mas facil'];
const activityOptions = [
  { label: 'Cafe', icon: '☕', detail: 'cafecito con conversacion bonita' },
  { label: 'Pelicula', icon: '🎬', detail: 'pelicula y comentario experto de snacks' },
  { label: 'Paseo', icon: '🌿', detail: 'paseo tranquilo sin mision secundaria obligatoria' },
];
type ActivityOption = (typeof activityOptions)[number];

const memeCatImages = {
  intro: 'https://cataas.com/cat/says/SOLO%20ELEGIDOS?fontSize=42&fontColor=white',
  final: 'https://cataas.com/cat/says/NO%20SEAS%20NPC?fontSize=42&fontColor=white',
};

type DateOption = {
  label: string;
  dayText: string;
  hour: string;
};

export function App() {
  const [scene, setScene] = usePersistentState<Scene>('aceptar-la-mision.scene', 'start');
  const [theme, setTheme] = usePersistentState<ThemeMode>('aceptar-la-mision.theme', 'light');
  const [sound, setSound] = usePersistentState('aceptar-la-mision.sound', true);
  const [showDateInvite, setShowDateInvite] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [rejectDodges, setRejectDodges] = useState(0);
  const [rejectPosition, setRejectPosition] = useState({ x: 0, y: 0 });
  const { play, startMusic, setCalmMusic } = useSound(sound);

  const dateOptions = useMemo(() => buildDateOptions(), []);

  useEffect(() => {
    setCalmMusic(scene === 'reveal' || scene === 'final' || scene === 'celebration' || scene === 'credits');
  }, [scene, setCalmMusic]);

  const go = (next: Scene) => {
    play('click');
    if (next === 'reveal' || next === 'final') {
      startMusic(true);
    }
    setScene(next);
  };

  const reset = () => {
    localStorage.removeItem('aceptar-la-mision.scene');
    setScene('start');
  };

  const celebrateMission = (dateOption: DateOption) => {
    setSelectedDate(dateOption);
    setScene('celebration');
    window.setTimeout(() => play('sparkle'), 0);
  };

  const acceptMission = () => {
    setMissionAccepted(true);
    play('sparkle');
  };

  const askWhen = () => {
    setShowDateInvite(true);
    play('click');
  };

  const chooseActivity = (activity: ActivityOption) => {
    setSelectedActivity(activity);
    setShowDateInvite(false);
    play('catch');
  };

  const dodgeReject = () => {
    const nextDodges = rejectDodges + 1;
    setRejectDodges(nextDodges);
    setRejectPosition({
      x: [-78, 86, -44, 64, -92][nextDodges % 5],
      y: [-36, 28, 42, -30, 18][nextDodges % 5],
    });
    play('bonk');

    if (nextDodges >= 3) {
      setMissionAccepted(true);
    }
  };

  const index = Math.max(0, sceneOrder.indexOf(scene));

  return (
    <SceneFrame
      theme={theme}
      sound={sound}
      onToggleSound={() => setSound((current) => !current)}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      onReset={reset}
    >
      <div className="mb-4 h-3 overflow-hidden rounded-full border-2 border-stone-800 bg-white/60">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-300 via-amber-200 to-emerald-300"
          animate={{ width: `${((index + 1) / sceneOrder.length) * 100}%` }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {scene === 'start' && (
            <div className="scene-card min-h-[76vh]">
              <HiddenClues />
              <div className="flex flex-col items-center gap-8 text-center">
                <MemeCatCard
                  caption="Yo despues de aceptar una mision sin leer los terminos"
                  imageUrl="/assets/meme-cats/gato-serio.webp"
                  tone="dark"
                />
                <motion.h1 className="font-pixel text-2xl leading-10 sm:text-5xl" animate={{ textShadow: ['0 0 0 #fff', '0 0 18px #fff', '0 0 0 #fff'] }} transition={{ repeat: Infinity, duration: 2.2 }}>
                  El destino del universo depende de ti.
                </motion.h1>
                <PixelButton onClick={() => go('intro')}>
                  <span className="inline-flex items-center gap-2">
                    <Play size={16} /> Iniciar mision
                  </span>
                </PixelButton>
              </div>
            </div>
          )}

          {scene === 'intro' && (
            <div className="scene-card min-h-[76vh]">
              <HiddenClues />
              <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.8 }}>
                <MemeCatCard caption="mision.exe pide permiso para ponerse rara" imageUrl={memeCatImages.intro} />
              </motion.div>
              <h2 className="max-w-2xl text-center font-pixel text-xl leading-9 sm:text-3xl">Solo las personas elegidas pueden completar esta mision.</h2>
              <PixelButton onClick={() => go('hotdogs')}>Aceptar</PixelButton>
            </div>
          )}

          {scene === 'hotdogs' && <MiniGameHotdogs onComplete={() => setScene('hotdogsDone')} playSound={play} />}

          {scene === 'hotdogsDone' && (
            <div className="scene-card min-h-[60vh]">
              <PixelCat mood="happy" />
              <h2 className="font-pixel text-3xl">Excelente trabajo.</h2>
              <p>El universo ha sobrevivido a la lluvia de completos.</p>
              <PixelButton onClick={() => go('pigeons')}>Continuar</PixelButton>
            </div>
          )}

          {scene === 'pigeons' && <DodgePigeons onComplete={() => setScene('feedCat')} playSound={play} />}
          {scene === 'feedCat' && <FeedCat onComplete={() => setScene('reveal')} playSound={play} />}

          {scene === 'reveal' && (
            <div className="flex min-h-[76vh] flex-col justify-center gap-8">
              <Typewriter
                lines={['Hay algo que queria decirte...', 'No sabia como hacerlo sin que fuera raro.', 'Asi que hice un videojuego.']}
                onDone={() => setScene('final')}
              />
            </div>
          )}

          {scene === 'final' && (
            <div className="scene-card min-h-[78vh] text-center">
              <div className="grid w-full max-w-4xl items-center gap-5 sm:grid-cols-[180px_1fr_180px]">
                <MemeCatCard caption="el gato ya sabe" imageUrl={memeCatImages.final} tone="blue" />
                <PixelCat mood="coffee" size="lg" />
                <MemeCatCard caption="cara cuando toca elegir" imageUrl="https://cataas.com/cat/says/ACEPTA%20PO?fontSize=44&fontColor=white" tone="pink" />
              </div>
              <h2 className="font-pixel text-2xl leading-10 sm:text-4xl">🏆 Mision secreta desbloqueada.</h2>
              <div className="max-w-3xl space-y-4 text-lg leading-8">
                <p>La verdadera mision nunca fueron los minijuegos.</p>
                <p>La verdadera mision era preguntarte algo.</p>
              </div>
              <motion.p className="max-w-4xl font-pixel text-sm leading-8 sm:text-xl" initial={{ scale: 0.94 }} animate={{ scale: 1 }}>
                ¿Te gustaria salir conmigo a tomar un cafe, ver una pelicula o simplemente pasar un rato juntos?
              </motion.p>
              <p className="max-w-2xl whitespace-pre-line text-base text-stone-700 dark:text-rose-100">
                Sin presion.
                {'\n'}Solo pense que seria bonito compartir un momento contigo.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <PixelButton
                  onClick={acceptMission}
                  disabled={missionAccepted}
                >
                  <span className="inline-flex items-center gap-2">
                    <Heart size={16} /> {missionAccepted ? 'Mision aceptada' : 'Aceptar mision'}
                  </span>
                </PixelButton>
                <AnimatePresence>
                  {missionAccepted && selectedActivity && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -12, scale: 0.95 }}
                    >
                      <PixelButton variant="coffee" onClick={askWhen}>
                        <span className="inline-flex items-center gap-2">
                          <Coffee size={16} /> ¿Cuando vamos?
                        </span>
                      </PixelButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative h-20 w-full max-w-xl">
                <motion.button
                  aria-disabled="true"
                  tabIndex={-1}
                  className="fake-no-button"
                  animate={{ x: rejectPosition.x, y: rejectPosition.y, rotate: rejectDodges % 2 ? -3 : 3 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  onPointerEnter={dodgeReject}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    dodgeReject();
                  }}
                >
                  {rejectButtonTexts[Math.min(rejectDodges, rejectButtonTexts.length - 1)]}
                </motion.button>
              </div>
              {rejectDodges > 0 && (
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MemeCatCard
                    caption="Opcion rechazada por el comite felino"
                    imageUrl="/assets/meme-cats/gato-enojado.webp"
                    tone="dark"
                  />
                  <p className="font-pixel text-[10px] leading-5 text-rose-700 dark:text-rose-200">
                    Error 404: rechazo no encontrado. La mision insiste amablemente.
                  </p>
                </motion.div>
              )}
              {missionAccepted && (
                <motion.div
                  className="w-full max-w-3xl rounded-md border-4 border-stone-800 bg-white/80 p-4 shadow-pixel dark:bg-stone-950/80"
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <p className="mb-4 font-pixel text-[10px] leading-5 sm:text-xs">Antes de fijar coordenadas: ¿que actividad prefieres?</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activityOptions.map((activity) => (
                      <button
                        key={activity.label}
                        className={`relative rounded-md border-4 px-3 py-4 text-left shadow-[4px_4px_0_rgba(41,37,36,.18)] transition hover:-translate-y-1 ${
                          selectedActivity?.label === activity.label
                            ? 'border-rose-700 bg-rose-200 text-stone-950 ring-4 ring-rose-300'
                            : 'border-stone-800 bg-white/80 text-stone-900'
                        }`}
                        onClick={() => chooseActivity(activity)}
                        aria-pressed={selectedActivity?.label === activity.label}
                      >
                        {selectedActivity?.label === activity.label && (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-rose-700 px-2 py-1 text-[10px] font-black uppercase text-white">
                            <CheckCircle2 size={14} /> Elegido
                          </span>
                        )}
                        <span className="mb-2 block text-3xl">{activity.icon}</span>
                        <strong className="block font-pixel text-[10px]">{activity.label}</strong>
                        <span className="mt-2 block text-sm leading-5">{activity.detail}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              <AnimatePresence>
                {showDateInvite && (
                  <motion.div
                    className="grid w-full max-w-4xl gap-5 rounded-md border-4 border-stone-800 bg-white/85 p-4 shadow-pixel dark:bg-stone-950/85 md:grid-cols-[220px_1fr]"
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  >
                    <MemeCatCard
                      caption="Agenda ocupada fingiendo que no esperaba esto"
                      imageUrl="/assets/meme-cats/gato-calendario.webp"
                      tone="blue"
                    />
                    <div>
                      <p className="mb-4 font-pixel text-[10px] leading-5 sm:text-xs">
                        Coordenadas para {selectedActivity?.detail}:
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {dateOptions.map((option) => (
                          <button
                            key={option.label}
                            className="rounded-md border-4 border-stone-800 bg-amber-100 px-3 py-4 text-sm font-bold text-stone-950 shadow-[4px_4px_0_rgba(41,37,36,.18)] transition hover:-translate-y-1 hover:bg-amber-50"
                            onClick={() => celebrateMission(option)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-stone-700 dark:text-rose-100">Tambien acepto contraofertas bonitas.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {scene === 'celebration' && <Celebration onCredits={() => go('credits')} />}

          {scene === 'credits' && (
            <div className="flex min-h-[78vh] flex-col items-center justify-center gap-7 rounded-md bg-black p-8 text-center text-white shadow-pixel">
              <MemeCatCard
                caption="Mision cumplida, ahora toca ponerse nerviosos en persona"
                imageUrl="/assets/meme-cats/gato-celebrando.webp"
                tone="dark"
              />
              <p className="font-pixel text-lg leading-9 sm:text-3xl">Gracias por llegar hasta aqui.</p>
              {selectedDate && selectedActivity && (
                <div className="max-w-2xl rounded-md border-4 border-rose-200 bg-white/10 p-5 text-left shadow-glow">
                  <p className="mb-3 font-pixel text-[10px] leading-5 text-rose-200 sm:text-xs">Resumen oficial de la mision:</p>
                  <p className="text-lg leading-8">
                    El dia <strong>{selectedDate.dayText}</strong> tienes una salida a hacer{' '}
                    <strong>{selectedActivity.detail}</strong> a las <strong>{selectedDate.hour}</strong>.
                  </p>
                  <p className="mt-3 text-sm text-rose-100">
                    Llevar: ganas, sonrisa opcional y permiso emocional del gato. Estado: cita desbloqueada.
                  </p>
                </div>
              )}
              <p className="max-w-2xl text-lg leading-8">Si sonreiste al menos una vez durante esta aventura, entonces la mision ya fue un exito.</p>
              <p className="text-sm text-rose-200">PD: La invitacion es completamente real. ❤️</p>
              <PixelButton onClick={reset} variant="quiet">
                Jugar de nuevo
              </PixelButton>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </SceneFrame>
  );
}

function buildDateOptions(): DateOption[] {
  const targets = [
    { day: 5, label: 'viernes', hour: '18:30' },
    { day: 6, label: 'sabado', hour: '17:00' },
    { day: 0, label: 'domingo', hour: '16:00' },
  ];

  return targets.map((target) => {
    const date = nextWeekday(target.day);
    const dayText = `${target.label} ${date.getDate()}/${date.getMonth() + 1}`;
    return {
      label: `${dayText} - ${target.hour}`,
      dayText,
      hour: target.hour,
    };
  });
}

function nextWeekday(day: number) {
  const date = new Date();
  const distance = (day - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + distance);
  return date;
}
