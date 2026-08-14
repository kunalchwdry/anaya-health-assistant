'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Database,
  Download,
  Eye,
  EyeOff,
  HeartPulse,
  Info,
  Languages,
  MapPin,
  MessageSquare,
  Mic,
  Minus,
  Plus,
  Settings,
  Shield,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Upload,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

const MEMORY_CATEGORIES = [
  {
    id: 'health_profile',
    icon: HeartPulse,
    title: 'Health Profile',
    description: 'Age, conditions, medications, allergies, emergency contacts',
    itemCount: 12,
    enabled: true,
    color: 'rose',
  },
  {
    id: 'preferences',
    icon: Settings,
    title: 'Preferences',
    description: 'Language, communication style, notification settings, units',
    itemCount: 8,
    enabled: true,
    color: 'cyan',
  },
  {
    id: 'conversation_history',
    icon: MessageSquare,
    title: 'Conversation History',
    description: 'Past health queries, recommendations, and follow-ups',
    itemCount: 234,
    enabled: true,
    color: 'emerald',
  },
  {
    id: 'insights_data',
    icon: BarChart3,
    title: 'Insights & Analytics',
    description: 'Conversation patterns, topic trends, wellness metrics',
    itemCount: 47,
    enabled: true,
    color: 'violet',
  },
  {
    id: 'location_data',
    icon: MapPin,
    title: 'Location & Facilities',
    description: 'Saved locations, preferred hospitals, PHCs, pharmacies',
    itemCount: 6,
    enabled: false,
    color: 'amber',
  },
  {
    id: 'voice_samples',
    icon: Mic,
    title: 'Voice Samples',
    description: 'Anonymous audio snippets for improving recognition',
    itemCount: 0,
    enabled: false,
    color: 'indigo',
  },
];

export function MemoryPreferences() {
  const [categories, setCategories] = useState(MEMORY_CATEGORIES);
  const [showClearConfirm, setShowClearConfirm] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, enabled: !cat.enabled } : cat))
    );
  };

  const handleClearCategory = (id: string) => {
    setShowClearConfirm(id);
  };

  const confirmClear = (id: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, itemCount: 0 } : cat)));
    setShowClearConfirm(null);
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);
  const enabledCategories = categories.filter((cat) => cat.enabled).length;

  return (
    <section
      id="memory-preferences"
      aria-labelledby="memory-heading"
      className="px-4 py-12 md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <motion.h2
            id="memory-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight"
          >
            Memory & Preferences
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-slate-300"
          >
            Manage what Anaya remembers about you. Control your data, customize preferences, and
            decide what information helps personalize your health conversations.
          </motion.p>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 grid gap-4 sm:grid-cols-3"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
          >
            <p className="text-sm font-medium text-slate-400">Total Memory Items</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">{totalItems}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
          >
            <p className="text-sm font-medium text-slate-400">Active Categories</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">
              {enabledCategories} / {categories.length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
          >
            <p className="text-sm font-medium text-slate-400">Storage Used</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">~2.4 MB</p>
          </motion.div>
        </motion.div>

        {/* Memory Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10 space-y-4"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl p-6',
                  'border bg-white/[0.045] shadow-xl backdrop-blur-2xl transition-all duration-300',
                  `border-${category.color}-400/30`,
                  `bg-gradient-to-br from-${category.color}-400/20 to-${category.color === 'rose' ? 'red' : category.color === 'cyan' ? 'teal' : category.color === 'emerald' ? 'teal' : category.color === 'violet' ? 'purple' : category.color === 'amber' ? 'orange' : 'indigo'}-500/20`
                )}
              >
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div
                      className={cn(
                        'mt-0.5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
                        `bg-${category.color}-400/10 text-${category.color}-400`
                      )}
                    >
                      <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">{category.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{category.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Database className="h-3.5 w-3.5" aria-hidden="true" />
                          {category.itemCount} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                          Encrypted locally
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-3">
                    {showClearConfirm === category.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => confirmClear(category.id)}
                          className="rounded-lg border border-rose-400/30 bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-rose-500/30"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(null)}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="relative flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
                          aria-pressed={category.enabled}
                          aria-label={
                            category.enabled
                              ? `Disable ${category.title} memory`
                              : `Enable ${category.title} memory`
                          }
                        >
                          <span
                            className={cn(
                              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
                              category.enabled ? 'translate-x-5' : 'translate-x-0.5'
                            )}
                            aria-hidden="true"
                          />
                        </button>
                        {category.itemCount > 0 && (
                          <button
                            onClick={() => handleClearCategory(category.id)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-400/10 hover:text-rose-400"
                            aria-label={`Clear ${category.title} data`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Data Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10 grid gap-4 sm:grid-cols-3"
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/5"
          >
            <Download className="h-6 w-6 text-cyan-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Export Data</p>
              <p className="text-sm text-slate-400">Download all your data as JSON</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/5"
          >
            <Upload className="h-6 w-6 text-emerald-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Import Data</p>
              <p className="text-sm text-slate-400">Restore from a previous export</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 backdrop-blur-2xl transition-all hover:border-rose-400/50 hover:bg-rose-400/20"
          >
            <Trash2 className="h-6 w-6 text-rose-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Clear All Data</p>
              <p className="text-sm text-slate-400">Permanently delete everything</p>
            </div>
          </motion.button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5"
        >
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-cyan-300">How Memory Works</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  • All data is encrypted and stored locally on your device
                </li>
                <li className="flex items-start gap-2">
                  • Nothing is sent to servers without your explicit consent
                </li>
                <li className="flex items-start gap-2">
                  • You can disable any category at any time
                </li>
                <li className="flex items-start gap-2">
                  • Export/import lets you backup or transfer your data
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
