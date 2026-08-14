'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Mic, Sparkles, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface VoiceOrbProps {
  state?: VoiceState;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES = {
  sm: 'h-24 w-24',
  md: 'h-32 w-32',
  lg: 'h-40 w-40',
  xl: 'h-52 w-52',
};

const INNER_SIZE_CLASSES = {
  sm: 'inset-2',
  md: 'inset-3',
  lg: 'inset-3',
  xl: 'inset-4',
};

const ICON_SIZES = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 52,
};

const WAVE_COUNTS = {
  sm: 5,
  md: 7,
  lg: 9,
  xl: 11,
};

export function VoiceOrb({ state = 'idle', onClick, className, size = 'lg' }: VoiceOrbProps) {
  const orbRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const [waveHeights, setWaveHeights] = useState<number[]>([]);
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Initialize particles for thinking state
  useEffect(() => {
    if (state === 'thinking') {
      const count = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
      setParticles(Array.from({ length: count }, (_, i) => i));
    } else {
      setParticles([]);
    }
  }, [state, size]);

  // Initialize wave heights for speaking state
  useEffect(() => {
    if (state === 'speaking') {
      const count = WAVE_COUNTS[size];
      setWaveHeights(Array.from({ length: count }, () => Math.random() * 30 + 10));
    } else {
      setWaveHeights([]);
    }
  }, [state, size]);

  // Animate wave heights when speaking
  useEffect(() => {
    if (state !== 'speaking' || prefersReducedMotion.current) return;

    const interval = setInterval(() => {
      setWaveHeights((prev) => prev.map(() => Math.random() * 50 + 10));
    }, 80);

    return () => clearInterval(interval);
  }, [state]);

  const getStateIcon = () => {
    switch (state) {
      case 'listening':
        return <Mic className="text-white" size={ICON_SIZES[size]} strokeWidth={2} />;
      case 'speaking':
        return <Volume2 className="text-white" size={ICON_SIZES[size]} strokeWidth={2} />;
      case 'thinking':
        return <Sparkles className="text-cyan-300" size={ICON_SIZES[size]} strokeWidth={2} />;
      case 'error':
        return <AlertCircle className="text-rose-300" size={ICON_SIZES[size]} strokeWidth={2} />;
      default:
        return <Sparkles className="text-white" size={ICON_SIZES[size]} strokeWidth={2} />;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return 'Listening…';
      case 'thinking':
        return 'Anaya is thinking…';
      case 'speaking':
        return 'Anaya is speaking…';
      case 'error':
        return 'Something went wrong';
      default:
        return 'Tap to talk';
    }
  };

  const getAriaLabel = () => {
    switch (state) {
      case 'listening':
        return 'Anaya is listening. Tap to stop.';
      case 'thinking':
        return 'Anaya is thinking. Please wait.';
      case 'speaking':
        return 'Anaya is speaking. Tap to stop.';
      case 'error':
        return 'Anaya encountered an error. Tap to try again.';
      default:
        return 'Talk to Anaya. Tap to start speaking.';
    }
  };

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Orb Stage */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: SIZE_CLASSES[size], height: SIZE_CLASSES[size] }}
      >
        {/* Outer glow rings - LISTENING */}
        <AnimatePresence mode="wait">
          {state === 'listening' && !prefersReducedMotion.current && (
            <>
              <motion.div
                key="ring-1"
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                key="ring-2"
                className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7, ease: 'easeOut' }}
              />
              <motion.div
                key="ring-3"
                className="absolute inset-0 rounded-full border-2 border-teal-400/20"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.4, ease: 'easeOut' }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Outer pulse ring - IDLE/THINKING */}
        <AnimatePresence mode="wait">
          {(state === 'idle' || state === 'thinking') && !prefersReducedMotion.current && (
            <motion.div
              key="pulse-ring"
              className={cn(
                'absolute rounded-full border',
                state === 'idle'
                  ? 'inset-[-8px] border-cyan-400/15'
                  : 'inset-[-16px] border-cyan-400/30'
              )}
              initial={{ scale: 1, opacity: state === 'idle' ? 0.4 : 0.5 }}
              animate={{
                scale: state === 'idle' ? [1, 1.05, 1] : [1, 1.1, 1],
                opacity: state === 'idle' ? [0.4, 0.15, 0.4] : [0.5, 0.1, 0.5],
              }}
              transition={{
                duration: state === 'idle' ? 4 : 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </AnimatePresence>

        {/* Error state ring */}
        <AnimatePresence mode="wait">
          {state === 'error' && !prefersReducedMotion.current && (
            <motion.div
              key="error-ring"
              className="absolute inset-[-4px] rounded-full border-2 border-rose-400/40"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        {/* Main Orb */}
        <motion.button
          ref={orbRef}
          onClick={onClick}
          className={cn(
            'relative flex items-center justify-center overflow-hidden rounded-full',
            'border border-cyan-300/30',
            'bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600',
            'shadow-[0_0_80px_rgba(34,211,238,0.35),0_0_40px_rgba(20,184,166,0.2),inset_0_0_60px_rgba(255,255,255,0.1)]',
            'transition-all duration-500 ease-out',
            SIZE_CLASSES[size],
            state === 'listening' &&
              'shadow-[0_0_120px_rgba(55,212,208,0.45),0_0_60px_rgba(34,211,238,0.3),inset_0_0_80px_rgba(255,255,255,0.15)]',
            state === 'speaking' &&
              'shadow-[0_0_100px_rgba(34,211,238,0.4),0_0_50px_rgba(20,184,166,0.25),inset_0_0_70px_rgba(255,255,255,0.12)]',
            state === 'error' &&
              'shadow-[0_0_60px_rgba(230,106,122,0.4),0_0_30px_rgba(230,106,122,0.2),inset_0_0_40px_rgba(255,255,255,0.1)]',
            isHovered &&
              state === 'idle' &&
              'shadow-[0_0_100px_rgba(34,211,238,0.45),0_0_50px_rgba(20,184,166,0.25),inset_0_0_70px_rgba(255,255,255,0.15)]'
          )}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={getAriaLabel()}
          aria-pressed={state === 'listening' || state === 'speaking'}
          disabled={!onClick}
          initial={false}
          animate={{
            scale: state === 'speaking' ? [1, 1.03, 1] : 1,
            y: state === 'speaking' ? [0, -4, 0] : 0,
          }}
          transition={{
            duration: state === 'speaking' ? 0.8 : 0.5,
            repeat: state === 'speaking' ? Infinity : 0,
            ease: 'easeInOut',
          }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Inner rings */}
          <div
            className={cn('absolute rounded-full border border-white/20', INNER_SIZE_CLASSES[size])}
          />
          <div
            className={cn(
              'absolute rounded-full border border-white/10',
              INNER_SIZE_CLASSES[size],
              { inset: 8 }
            )}
          />

          {/* Particles for thinking state */}
          <AnimatePresence mode="wait">
            {state === 'thinking' &&
              !prefersReducedMotion.current &&
              particles.map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(55,212,208,0.9)]"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    scale: [0.5, 1, 0.5],
                    rotate: [0, 360],
                    x: [0, Math.cos((i / particles.length) * Math.PI * 2) * 60],
                    y: [0, Math.sin((i / particles.length) * Math.PI * 2) * 60],
                  }}
                  transition={{
                    duration: 2.5 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
          </AnimatePresence>

          {/* State icon */}
          <div className="relative z-10 flex items-center justify-center">{getStateIcon()}</div>

          {/* AI dot indicator */}
          {(state === 'idle' || state === 'listening' || state === 'speaking') &&
            !prefersReducedMotion.current && (
              <motion.div
                className="absolute top-[8%] right-[8%] h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_15px_rgba(110,231,183,0.9)]"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
        </motion.button>

        {/* Waveform bars for speaking state */}
        <AnimatePresence mode="wait">
          {state === 'speaking' && waveHeights.length > 0 && !prefersReducedMotion.current && (
            <div
              className="absolute bottom-[-12%] left-1/2 flex -translate-x-1/2 items-end gap-1"
              role="img"
              aria-label="Audio waveform"
            >
              {waveHeights.map((height, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-cyan-300 to-teal-400"
                  style={{ height: `${height}%` }}
                  initial={{ height: '10%', opacity: 0 }}
                  animate={{
                    height: [`${height}%`, `${Math.max(10, height - 20)}%`, `${height}%`],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.06,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Listening indicator */}
        <AnimatePresence mode="wait">
          {state === 'listening' && !prefersReducedMotion.current && (
            <motion.div
              className="absolute bottom-[-10%] left-1/2 flex -translate-x-1/2 items-center gap-1"
              role="img"
              aria-label="Microphone active"
            >
              {[1, 2, 3, 4, 5].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-1 rounded-full bg-cyan-300"
                  initial={{ height: 4, opacity: 0 }}
                  animate={{
                    height: [4, 20 + Math.random() * 20, 4],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: bar * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Text */}
      <motion.p
        className="mt-5 text-center text-sm font-medium tracking-wide transition-all duration-300"
        style={{
          color:
            state === 'listening'
              ? '#37d4d0'
              : state === 'speaking'
                ? '#37d4d0'
                : state === 'thinking'
                  ? '#6674f4'
                  : state === 'error'
                    ? '#e66a7a'
                    : '#9aa5c1',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {getStatusText()}
      </motion.p>

      {/* Language indicator */}
      <motion.p
        className="mt-2 text-center text-xs font-medium tracking-wider text-cyan-300/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🌐 Speaking in English
      </motion.p>
    </div>
  );
}
