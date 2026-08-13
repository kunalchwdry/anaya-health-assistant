import { useEffect, useState } from 'react';
import clsx from 'clsx';

type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'CONNECTED';

export const VoiceOrb = ({
  state = 'IDLE',
  onClick,
}: {
  state?: VoiceState;
  onClick?: () => void;
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger animation on state change or click
  useEffect(() => {
    if (onClick) {
      setIsAnimated(true);
      const timeout = setTimeout(() => setIsAnimated(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [state, onClick]);

  const baseClasses = 'w-16 h-16 rounded-full cursor-pointer transition-transform duration-500 ease-in-out';
  const stateClasses = {
    IDLE: 'bg-blue-100 text-blue-800 shadow-sm',
    LISTENING: 'bg-cyan-100 text-cyan-800 shadow-lg animate-pulse',
    THINKING: 'bg-indigo-100 text-indigo-800 shadow-lg',
    SPEAKING: 'bg-amber-100 text-amber-800 shadow-lg animate-pulse',
    CONNECTED: 'bg-green-100 text-green-800 shadow-md',
  };

  const classes = clsx(baseClasses, stateClasses[state], {
    'scale-105': isAnimated,
    'shadow-2xl': state === 'CONNECTED',
  });

  // Render different wave animations based on state
  const renderWave = () => {
    switch (state) {
      case 'LISTENING':
        return <div className="absolute -bottom-4 left-1/2 -translate-x-4 bottom-2 w-12 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>;
      case 'SPEAKING':
        return (
          <div className="absolute -bottom-4 left-1/2 -translate-x-4 bottom-2 w-16 h-1 rounded-full bg-blue-500 animate-bounce">
            <div className="absolute left-0 w-3 h-1 bg-blue-500 rounded"></div>
            <div className="absolute left-4 w-3 h-1 bg-blue-500 rounded"></div>
            <div className="absolute left-8 w-3 h-1 bg-blue-500 rounded"></div>
          </div>
        );
      case 'THINKING':
        return (
          <div className="absolute -bottom-4 left-1/2 -translate-x-4 bottom-2 w-12 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
        );
      case 'CONNECTED':
        return (
          <div className="absolute -bottom-4 left-1/2 -translate-x-4 bottom-2 w-16 h-1 rounded-full bg-green-500 animate-pulse"></div>
        );
      default:
        return null;
      }
  };

  return (
    <div
      className={classes}
      onClick={onClick}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <span className="text-lg font-medium">{state}</span>
      {renderWave()}
    </div>
  );
};