'use client';

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  HeartPulse,
  Target,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

const INSIGHT_CARDS = [
  {
    id: 'conversations',
    icon: BarChart3,
    title: 'Conversations',
    value: '24',
    change: '+12% from last week',
    trend: 'up',
    description: 'Total health conversations with Anaya',
    color: 'cyan',
  },
  {
    id: 'topics',
    icon: Target,
    title: 'Top Topics',
    value: 'Symptoms, Diet, Exercise',
    change: '3 most discussed',
    trend: 'neutral',
    description: 'Most frequent health topics discussed',
    color: 'emerald',
  },
  {
    id: 'duration',
    icon: Clock,
    title: 'Avg Duration',
    value: '4m 32s',
    change: '-15s vs last month',
    trend: 'down',
    description: 'Average conversation length',
    color: 'violet',
  },
  {
    id: 'followups',
    icon: CheckCircle,
    title: 'Follow-ups',
    value: '8',
    change: '3 pending actions',
    trend: 'up',
    description: 'Health actions recommended & tracked',
    color: 'amber',
  },
];

const METRICS = [
  { label: 'This Week', value: '12', icon: Activity, color: 'cyan' },
  { label: 'This Month', value: '47', icon: TrendingUp, color: 'emerald' },
  { label: 'Total', value: '234', icon: BarChart3, color: 'violet' },
  { label: 'Languages Used', value: '4', icon: HeartPulse, color: 'rose' },
];

export function Insights() {
  return (
    <section id="insights" aria-labelledby="insights-heading" className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <motion.h2
            id="insights-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight"
          >
            Health Insights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-slate-300"
          >
            Track your health conversation patterns, understand your wellness journey, and get
            personalized insights from your interactions with Anaya.
          </motion.p>
        </div>

        {/* Summary Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{metric.label}</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl',
                      `bg-${metric.color}-400/10 text-${metric.color}-400`
                    )}
                  >
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Insight Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {INSIGHT_CARDS.map((card, index) => {
            const Icon = card.icon;
            const trendColors: Record<string, string> = {
              up: 'text-emerald-400',
              down: 'text-rose-400',
              neutral: 'text-slate-400',
            };
            const trendIcons: Record<string, React.ReactNode> = {
              up: <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />,
              down: <Activity className="h-3.5 w-3.5" aria-hidden="true" />,
              neutral: <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />,
            };
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                whileHover={{ y: -4 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl p-6',
                  'border bg-white/[0.045] shadow-xl backdrop-blur-2xl transition-all duration-300',
                  `border-${card.color}-400/30`,
                  `bg-gradient-to-br from-${card.color}-400/20 to-${card.color === 'cyan' ? 'teal' : card.color === 'emerald' ? 'teal' : card.color === 'violet' ? 'purple' : 'orange'}-500/20`
                )}
              >
                <div className="relative z-10">
                  <div
                    className={cn(
                      'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
                      `bg-${card.color}-400/10 text-${card.color}-400`
                    )}
                  >
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <h3 className="font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-white">{card.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{card.description}</p>

                  <div className="mt-4 flex items-center gap-1.5">
                    <span className={cn('text-xs font-medium', trendColors[card.trend])}>
                      {trendIcons[card.trend]}
                      {card.change}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Health Trends Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Weekly Conversation Trend</h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Conversations
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Duration
              </span>
            </div>
          </div>
          <div
            className="flex h-64 items-end justify-center gap-4 px-2"
            role="img"
            aria-label="Weekly conversation trend chart showing 7 days of data"
          >
            {[65, 45, 78, 52, 88, 72, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                className="relative flex max-w-20 flex-1 flex-col items-center justify-end"
              >
                <div
                  className="relative w-full rounded-t-lg bg-gradient-to-t from-cyan-400 to-cyan-300 transition-all hover:from-cyan-300 hover:to-cyan-200"
                  style={{ height: `${height}%`, minHeight: 4 }}
                >
                  <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-slate-900/90 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {height} min
                  </div>
                </div>
                <span className="mt-2 font-mono text-xs text-slate-400">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5"
        >
          <div className="flex gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-amber-300">Insights Disclaimer</p>
              <p className="mt-1 text-sm text-slate-300">
                Insights are generated from your conversation history with Anaya and are for
                informational purposes only. They do not constitute medical advice. Data is stored
                locally on your device and never shared without your explicit consent.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
