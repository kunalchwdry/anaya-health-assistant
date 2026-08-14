'use client';

import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose?: () => void;
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
  error: 'bg-rose-500/20 border-rose-400/30 text-rose-300',
  info: 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300',
};

export function Toast({ message, type = 'info', isVisible, onClose }: ToastProps) {
  const Icon = ICONS[type];

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed top-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3.5',
            'border shadow-2xl backdrop-blur-2xl',
            'max-w-[90vw] md:max-w-md',
            COLORS[type]
          )}
          role="alert"
          aria-live="polite"
        >
          <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <p className="flex-1 text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
