'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Network,
  Phone,
  Server,
  Shield,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

const PRIVACY_SECTIONS = [
  {
    id: 'data-collection',
    icon: Database,
    title: 'Data Collection',
    description: 'What information we gather and why',
    items: [
      {
        label: 'Health profile data',
        detail: 'Age, conditions, medications, allergies (only with consent)',
      },
      {
        label: 'Conversation transcripts',
        detail: 'Stored locally, encrypted, never sent to servers',
      },
      {
        label: 'Voice recordings',
        detail: 'Processed in real-time, not stored unless explicitly enabled',
      },
      { label: 'Usage analytics', detail: 'Anonymous, aggregated metrics for improving Anaya' },
      { label: 'Device information', detail: 'OS, browser, language for compatibility only' },
    ],
  },
  {
    id: 'data-storage',
    icon: Server,
    title: 'Data Storage & Security',
    description: 'How your data is protected',
    items: [
      {
        label: 'Local-first architecture',
        detail: 'All personal data stays on your device by default',
      },
      { label: 'End-to-end encryption', detail: 'AES-256 encryption for all stored data' },
      { label: 'No cloud backup', detail: 'Data never leaves your device unless you export it' },
      {
        label: 'Secure key management',
        detail: 'Encryption keys derived from your device, not stored',
      },
      {
        label: 'Automatic cleanup',
        detail: 'Option to auto-delete old conversations after 90 days',
      },
    ],
  },
  {
    id: 'data-sharing',
    icon: Network,
    title: 'Data Sharing & Third Parties',
    description: 'Who has access to your information',
    items: [
      {
        label: 'No third-party sharing',
        detail: 'Your health data is never sold or shared with advertisers',
      },
      {
        label: 'LiveKit for voice',
        detail: 'Only audio streams during active calls, no recording',
      },
      { label: 'Murf for TTS', detail: 'Text-to-speech processing, no personal data transmitted' },
      { label: 'Deepgram for STT', detail: 'Speech-to-text processing, audio discarded after' },
      {
        label: 'Google Gemini for LLM',
        detail: 'Conversation context only, no persistent storage',
      },
    ],
  },
  {
    id: 'user-rights',
    icon: UserCheck,
    title: 'Your Rights & Controls',
    description: 'What you can do with your data',
    items: [
      { label: 'Access your data', detail: 'View all stored information in Memory & Preferences' },
      { label: 'Export everything', detail: 'Download complete data as encrypted JSON' },
      { label: 'Delete selectively', detail: 'Remove specific categories or individual items' },
      { label: 'Delete everything', detail: 'One-click complete data erasure' },
      { label: 'Opt-out anytime', detail: 'Disable any data collection category instantly' },
    ],
  },
  {
    id: 'compliance',
    icon: FileText,
    title: 'Compliance & Standards',
    description: 'Regulatory adherence and certifications',
    items: [
      {
        label: 'DPDP Act 2023 (India)',
        detail: 'Full compliance with Digital Personal Data Protection Act',
      },
      {
        label: 'HIPAA-aligned practices',
        detail: 'Health data handling follows HIPAA security principles',
      },
      { label: 'GDPR-ready', detail: 'Designed for EU data protection standards' },
      { label: 'SOC 2 Type II', detail: 'Infrastructure providers maintain SOC 2 certification' },
      { label: 'ISO 27001', detail: 'Cloud providers certified for information security' },
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact & Support',
    description: 'Reach out for privacy concerns',
    items: [
      { label: 'Privacy Officer', detail: 'privacy@anaya.health — response within 48 hours' },
      { label: 'Data Protection Officer', detail: 'dpo@anaya.health — for regulatory inquiries' },
      { label: 'Security Issues', detail: 'security@anaya.health — responsible disclosure' },
      { label: 'General Support', detail: 'support@anaya.health — help with data requests' },
      { label: 'Postal Address', detail: 'Anaya Health, Bangalore, Karnataka, India' },
    ],
  },
];

export function PrivacyCenter() {
  const [expandedSection, setExpandedSection] = useState<string | null>('data-collection');

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  return (
    <section id="privacy-center" aria-labelledby="privacy-heading" className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <motion.h2
            id="privacy-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight"
          >
            Privacy Center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-slate-300"
          >
            Your health data is yours alone. Anaya is built on a privacy-first architecture with
            local-only storage, end-to-end encryption, and complete user control. Learn how we
            protect your information.
          </motion.p>
        </div>

        {/* Privacy Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6 text-center backdrop-blur-2xl"
          >
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-400" aria-hidden="true" />
            <p className="font-semibold text-white">Local-First</p>
            <p className="mt-1 text-sm text-slate-400">Data stays on your device</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6 text-center backdrop-blur-2xl"
          >
            <Lock className="mx-auto mb-3 h-10 w-10 text-cyan-400" aria-hidden="true" />
            <p className="font-semibold text-white">Encrypted</p>
            <p className="mt-1 text-sm text-slate-400">AES-256 encryption</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-violet-400/30 bg-violet-400/5 p-6 text-center backdrop-blur-2xl"
          >
            <UserCheck className="mx-auto mb-3 h-10 w-10 text-violet-400" aria-hidden="true" />
            <p className="font-semibold text-white">You Control</p>
            <p className="mt-1 text-sm text-slate-400">Full data ownership</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6 text-center backdrop-blur-2xl"
          >
            <Shield className="mx-auto mb-3 h-10 w-10 text-amber-400" aria-hidden="true" />
            <p className="font-semibold text-white">Compliant</p>
            <p className="mt-1 text-sm text-slate-400">DPDP, HIPAA, GDPR</p>
          </motion.div>
        </motion.div>

        {/* Privacy Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          {PRIVACY_SECTIONS.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            return (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur-2xl"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none focus-visible:ring-inset"
                  aria-expanded={isExpanded}
                  aria-controls={`${section.id}-content`}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">{section.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-400">{section.description}</p>
                  </div>
                  <motion.div
                    className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                  </motion.div>
                </button>

                <motion.div
                  id={`${section.id}-content`}
                  className="overflow-hidden"
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0,
                    paddingBottom: isExpanded ? 24 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="border-t border-white/5 px-6 pb-6">
                    <dl className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 + itemIndex * 0.05 }}
                          className="flex items-start gap-4"
                        >
                          <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                            <CheckCircle className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div>
                            <dt className="font-medium text-white">{item.label}</dt>
                            <dd className="mt-1 text-sm text-slate-400">{item.detail}</dd>
                          </div>
                        </motion.div>
                      ))}
                    </dl>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            href="#memory"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/5"
          >
            <Download className="h-6 w-6 text-cyan-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Export My Data</p>
              <p className="text-sm text-slate-400">Download everything</p>
            </div>
          </motion.a>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/5"
          >
            <Trash2 className="h-6 w-6 text-rose-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Delete All Data</p>
              <p className="text-sm text-slate-400">Permanent erasure</p>
            </div>
          </motion.button>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            href="mailto:privacy@anaya.health"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/5"
          >
            <Mail className="h-6 w-6 text-emerald-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Contact Privacy Team</p>
              <p className="text-sm text-slate-400">Email our DPO</p>
            </div>
          </motion.a>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75 }}
            href="/privacy-policy"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/5"
          >
            <FileText className="h-6 w-6 text-violet-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">Full Policy</p>
              <p className="text-sm text-slate-400">Read complete policy</p>
            </div>
          </motion.a>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 text-center text-sm text-slate-500"
        >
          <p>Last updated: January 2025 • Version 1.0</p>
          <p className="mt-1">Anaya Health Privacy Center — Your data, your control</p>
        </motion.div>
      </div>
    </section>
  );
}
