'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HeartPulse,
  Loader2,
  MapPin,
  Phone,
  Shield,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

const EMERGENCY_NUMBERS = [
  {
    name: 'National Emergency',
    number: '112',
    description: 'All emergencies — Police, Fire, Ambulance',
    icon: AlertTriangle,
    color: 'rose',
  },
  {
    name: 'Ambulance (108)',
    number: '108',
    description: 'Free ambulance service across India',
    icon: HeartPulse,
    color: 'red',
  },
  {
    name: 'Women Helpline',
    number: '1091',
    description: '24/7 women safety helpline',
    icon: Shield,
    color: 'violet',
  },
  {
    name: 'Child Helpline',
    number: '1098',
    description: 'Child protection and rescue',
    icon: HeartPulse,
    color: 'amber',
  },
  {
    name: 'Mental Health',
    number: '1800-599-0019',
    description: 'KIRAN mental health helpline',
    icon: Shield,
    color: 'cyan',
  },
  {
    name: 'Poison Control',
    number: '1800-116-116',
    description: 'National Poisons Information Centre',
    icon: AlertTriangle,
    color: 'orange',
  },
];

const NEARBY_FACILITIES = [
  {
    name: 'AIIMS Delhi',
    type: 'Government Hospital',
    distance: '2.3 km',
    phone: '011-26588500',
    open24: true,
  },
  {
    name: 'Safdarjung Hospital',
    type: 'Government Hospital',
    distance: '3.1 km',
    phone: '011-26707000',
    open24: true,
  },
  {
    name: 'Max Super Speciality',
    type: 'Private Hospital',
    distance: '1.8 km',
    phone: '011-40554055',
    open24: true,
  },
  {
    name: 'Fortis Escorts',
    type: 'Private Hospital',
    distance: '4.2 km',
    phone: '011-47135000',
    open24: true,
  },
  {
    name: 'PHC Connaught Place',
    type: 'Primary Health Centre',
    distance: '0.9 km',
    phone: '011-23365678',
    open24: false,
  },
];

interface EmergencyFABProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function EmergencyFAB({ isOpen, onClose, onOpen }: EmergencyFABProps) {
  const [expandedCategory, setExpandedCategory] = useState<'numbers' | 'facilities' | null>(
    'numbers'
  );
  const [callingNumber, setCallingNumber] = useState<string | null>(null);

  const handleCall = async (number: string) => {
    setCallingNumber(number);
    // In a real app, this would trigger a tel: link or use a calling API
    window.open(`tel:${number.replace(/\s/g, '')}`, '_self');
    setTimeout(() => setCallingNumber(null), 2000);
  };

  const toggleCategory = (category: 'numbers' | 'facilities') => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={isOpen ? onClose : onOpen}
        className={cn(
          'fixed right-4 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 md:right-6 md:bottom-28',
          'bg-gradient-to-br from-rose-500 via-red-500 to-rose-600',
          'border-2 border-rose-400/50 text-white',
          'hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.6)]',
          'focus-visible:ring-4 focus-visible:ring-rose-400/50 focus-visible:outline-none',
          isOpen && 'rotate-45 bg-rose-600'
        )}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close emergency help' : 'Open emergency help'}
        aria-haspopup="dialog"
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-full w-full items-center justify-center"
        >
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </motion.span>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-rose-500/50"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          />
        )}
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 bottom-0 left-0 z-50 md:top-1/2 md:right-auto md:bottom-auto md:left-1/2 md:max-h-[85vh] md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="emergency-title"
            >
              <div className="flex h-full max-h-[85vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1e] shadow-2xl md:max-h-[85vh] md:rounded-3xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-rose-500/10 to-red-500/10 p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                      <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="emergency-title" className="text-xl font-bold text-white">
                        Emergency Help
                      </h2>
                      <p className="text-sm text-slate-400">
                        Immediate assistance for health emergencies
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:outline-none"
                    aria-label="Close emergency help"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  {/* Warning Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-medium text-amber-300">Life-threatening emergency?</p>
                        <p className="mt-1 text-sm text-slate-300">
                          Call <strong className="text-white">112</strong> or{' '}
                          <strong className="text-white">108</strong> immediately. Do not wait for
                          an app. These numbers work even without balance or SIM.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Category Tabs */}
                  <div
                    className="mb-6 flex gap-2 rounded-xl bg-white/5 p-1"
                    role="tablist"
                    aria-label="Emergency categories"
                  >
                    <button
                      onClick={() => toggleCategory('numbers')}
                      role="tab"
                      aria-selected={expandedCategory === 'numbers'}
                      aria-controls="numbers-panel"
                      className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                        expandedCategory === 'numbers'
                          ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-slate-200'
                      )}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Emergency Numbers
                    </button>
                    <button
                      onClick={() => toggleCategory('facilities')}
                      role="tab"
                      aria-selected={expandedCategory === 'facilities'}
                      aria-controls="facilities-panel"
                      className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                        expandedCategory === 'facilities'
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-slate-200'
                      )}
                    >
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      Nearby Facilities
                    </button>
                  </div>

                  {/* Emergency Numbers Panel */}
                  <AnimatePresence mode="wait">
                    {expandedCategory === 'numbers' && (
                      <motion.div
                        key="numbers"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        id="numbers-panel"
                        role="tabpanel"
                        aria-labelledby="numbers-tab"
                      >
                        <div className="space-y-3">
                          {EMERGENCY_NUMBERS.map((item) => {
                            const Icon = item.icon;
                            const isCalling = callingNumber === item.number;
                            return (
                              <motion.button
                                key={item.number}
                                onClick={() => handleCall(item.number)}
                                disabled={isCalling}
                                className={cn(
                                  'group relative flex w-full items-center gap-4 rounded-xl p-4',
                                  'border bg-white/[0.045] backdrop-blur-2xl transition-all',
                                  `border-${item.color}-400/30`,
                                  `bg-gradient-to-r from-${item.color}-400/10 to-transparent`,
                                  'hover:border-white/20 hover:bg-white/5',
                                  'focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:outline-none',
                                  'text-left'
                                )}
                                aria-label={`Call ${item.name} at ${item.number}`}
                              >
                                <div
                                  className={cn(
                                    'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
                                    `bg-${item.color}-400/20 text-${item.color}-400`
                                  )}
                                >
                                  <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-semibold text-white">{item.name}</p>
                                  <p className="text-{item.color}-300 font-mono text-lg font-bold">
                                    {item.number}
                                  </p>
                                  <p className="mt-1 truncate text-sm text-slate-400">
                                    {item.description}
                                  </p>
                                </div>
                                {isCalling ? (
                                  <Loader2
                                    className="text-{item.color}-400 h-6 w-6 animate-spin"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ExternalLink
                                    className={cn(
                                      'h-5 w-5 transition-transform group-hover:translate-x-1',
                                      `text-${item.color}-400`
                                    )}
                                    aria-hidden="true"
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Quick Dial Row */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          {['112', '108'].map((num) => (
                            <motion.button
                              key={num}
                              onClick={() => handleCall(num)}
                              className="flex flex-col items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/20 px-4 py-5 transition-all hover:bg-rose-500/30 focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:outline-none"
                              aria-label={`Quick dial ${num}`}
                            >
                              <Phone className="h-6 w-6 text-rose-400" aria-hidden="true" />
                              <span className="font-mono text-2xl font-bold text-white">{num}</span>
                              <span className="text-xs text-rose-300">
                                {num === '112' ? 'National Emergency' : 'Ambulance'}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nearby Facilities Panel */}
                  <AnimatePresence mode="wait">
                    {expandedCategory === 'facilities' && (
                      <motion.div
                        key="facilities"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        id="facilities-panel"
                        role="tabpanel"
                        aria-labelledby="facilities-tab"
                      >
                        <div className="space-y-3">
                          {NEARBY_FACILITIES.map((facility) => (
                            <motion.button
                              key={facility.name}
                              onClick={() => handleCall(facility.phone)}
                              className="group relative flex w-full items-center gap-4 rounded-xl border bg-white/[0.045] p-4 text-left backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
                              aria-label={`Call ${facility.name} at ${facility.phone}`}
                            >
                              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-400">
                                <HeartPulse className="h-6 w-6" aria-hidden="true" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate font-semibold text-white">
                                    {facility.name}
                                  </p>
                                  <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-xs font-medium text-cyan-300">
                                    {facility.type}
                                  </span>
                                  {facility.open24 && (
                                    <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                                      <span
                                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
                                        aria-hidden="true"
                                      />
                                      24/7
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                                  {facility.distance} away
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                                <span className="font-mono text-sm text-cyan-300">
                                  {facility.phone}
                                </span>
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-slate-300 transition-colors hover:border-white/20 hover:bg-white/5"
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          <span>Open in Maps for directions</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* When no category selected */}
                  <AnimatePresence mode="wait">
                    {!expandedCategory && (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="py-12 text-center"
                      >
                        <AlertTriangle
                          className="mx-auto mb-4 h-12 w-12 text-slate-500"
                          aria-hidden="true"
                        />
                        <p className="text-slate-400">
                          Select a category above to see emergency numbers or nearby facilities
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 bg-white/[0.02] p-4 md:p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <motion.a
                      href="tel:112"
                      className="flex items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/20 px-4 py-3 font-medium text-rose-300 transition-all hover:bg-rose-500/30"
                    >
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      Call 112 Now
                    </motion.a>
                    <motion.a
                      href="tel:108"
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 font-medium text-red-300 transition-all hover:bg-red-500/30"
                    >
                      <HeartPulse className="h-5 w-5" aria-hidden="true" />
                      Call 108 Ambulance
                    </motion.a>
                  </div>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Your location is used only to show nearby facilities. It is not stored or
                    shared.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
