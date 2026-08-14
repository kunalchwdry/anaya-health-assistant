'use client';

import {
  Ambulance,
  Building2,
  Calendar,
  Clock,
  Cross,
  HeartPulse,
  Info,
  MapPin,
  MessageSquare,
  Phone,
  Pill,
  Shield,
  Stethoscope,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

const HEALTH_CARDS = [
  {
    id: 'nearby',
    icon: Building2,
    title: 'Nearby Facilities',
    description: 'Find hospitals, clinics and PHCs close to you.',
    color: 'cyan',
    gradient: 'from-cyan-400/20 to-teal-500/20',
    border: 'border-cyan-400/30',
  },
  {
    id: 'phc',
    icon: Stethoscope,
    title: 'PHC Access',
    description: 'Primary Health Centre timings, services and contacts.',
    color: 'emerald',
    gradient: 'from-emerald-400/20 to-teal-500/20',
    border: 'border-emerald-400/30',
  },
  {
    id: 'emergency',
    icon: Ambulance,
    title: 'Emergency Info',
    description: 'Helplines and what to do while help is on the way.',
    color: 'rose',
    gradient: 'from-rose-400/20 to-orange-500/20',
    border: 'border-rose-400/30',
  },
  {
    id: 'appointments',
    icon: Calendar,
    title: 'Appointment Assistance',
    description: 'Get help booking and preparing for visits.',
    color: 'violet',
    gradient: 'from-violet-400/20 to-purple-500/20',
    border: 'border-violet-400/30',
  },
  {
    id: 'medication',
    icon: Pill,
    title: 'Medication Reminders',
    description: 'Gentle voice reminders, in your language.',
    color: 'amber',
    gradient: 'from-amber-400/20 to-orange-500/20',
    border: 'border-amber-400/30',
  },
  {
    id: 'saved',
    icon: MessageSquare,
    title: 'Saved Conversations',
    description: 'Revisit past guidance whenever you need it.',
    color: 'indigo',
    gradient: 'from-indigo-400/20 to-blue-500/20',
    border: 'border-indigo-400/30',
  },
];

export function HealthAccess() {
  return (
    <section
      id="health-access"
      aria-labelledby="health-access-heading"
      className="px-4 py-12 md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <motion.h2
            id="health-access-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight"
          >
            Health Access
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-slate-300"
          >
            Everything you need for healthcare access, one tap away. Anaya helps you find
            facilities, understand emergency procedures, and manage your health journey.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HEALTH_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                whileHover={{ y: -4 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl p-6',
                  'border bg-white/[0.045] shadow-xl backdrop-blur-2xl transition-all duration-300',
                  card.border,
                  card.gradient.replace('from-', 'from- bg-gradient-to-br').replace('to-', 'to-')
                )}
              >
                {/* Card glow */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                    card.gradient.replace('from-', 'from-').replace('to-', 'to-')
                  )}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={cn(
                      'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
                      `bg-${card.color}-400/10 text-${card.color}-400`
                    )}
                  >
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <h3 className="font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>

                  {/* Action indicator */}
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors group-hover:text-cyan-300">
                    <span>Explore</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5"
        >
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-amber-300">Important</p>
              <p className="mt-1 text-sm text-slate-300">
                Anaya provides general health information and facility discovery only. It does not
                diagnose conditions, prescribe treatments, or replace professional medical care. For
                emergencies, call 112 or 108 immediately.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
