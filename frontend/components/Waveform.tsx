import { useEffect, useState } from 'react';
import clsx from 'clsx';

type WaveformState = 'IDLE' | 'LISTENING' | 'SPEAKING' | 'THINKING';

export const WaveformVisualization = ({ state = 'IDLE' }: { state?: WaveformState }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when state changes
  useEffect(() => {
    if (state !== 'IDLE') {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const baseClass = 'w-full max-w-64 mx-auto h-4 bg-gray-200 rounded overflow-hidden';
  const stateClasses = {
    LISTENING: 'bg-blue-500 animate-pulse',
    SPEAKING: 'bg-amber-500 animate-bounce',
    THINKING: 'bg-indigo-500 animate-pulse',
    IDLE: 'bg-gray-200',
  };

  return (
    <div
      className={clsx(baseClass, stateClasses[state], {
        'opacity-75': state === 'IDLE',
      })}
    >
      {state !== 'IDLE' && (
        <div className="absolute inset-0 animate-pulse rounded bg-gradient-to-r from-gray-300 to-transparent opacity-25" />
      )}
    </div>
  );
};
