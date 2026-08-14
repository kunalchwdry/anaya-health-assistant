'use client';

import { Brain, HeartPulse, Home, MessageSquare, Settings, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

interface BottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  { id: 'health', label: 'Health Access', icon: HeartPulse },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ activeSection, onNavigate }: BottomNavProps) {
  return (
    <motion.nav
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed right-0 bottom-0 left-0 z-50 md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div
        className="pb-safe mx-auto flex max-w-[1400px] items-center justify-around gap-1 p-2"
        style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}
      >
        <div className="relative flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.045] px-2 py-1.5 shadow-2xl backdrop-blur-2xl">
          {/* Background indicator */}
          <motion.div
            layout
            className="absolute inset-0 rounded-[22px] bg-gradient-to-r from-cyan-400/20 to-teal-500/20"
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          />

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'relative z-10 flex flex-1 flex-col items-center gap-1 rounded-[20px] px-3 py-2 transition-all',
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                <Icon
                  className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'text-[10px] font-medium tracking-wide transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-70'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
