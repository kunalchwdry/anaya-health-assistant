'use client';

import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  HeartPulse,
  Mic,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function WelcomeImage() {
  return (
    <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orb */}
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-[0_0_60px_rgba(34,211,238,0.35)]"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-2 rounded-full border border-white/20" />

        <Stethoscope
          size={42}
          strokeWidth={1.7}
          className="relative text-white"
        />

        {/* Small AI dot */}
        <motion.div
          className="absolute right-3 top-3 h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_15px_rgba(110,231,183,0.9)]"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & WelcomeViewProps
>(({ startButtonText, onStartCall, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050b12] text-white"
    >
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      {/* Main gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(8,145,178,0.20),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(37,99,235,0.12),transparent_30%)]" />

      {/* Animated cyan glow */}
      <motion.div
        className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Green glow */}
      <motion.div
        className="absolute bottom-[-200px] left-[-100px] h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[130px]"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blue glow */}
      <motion.div
        className="absolute bottom-[-180px] right-[-100px] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '45px 45px',
        }}
      />

      {/* ========================================================= */}
      {/* TOP BRAND */}
      {/* ========================================================= */}

      <div className="absolute left-6 top-6 z-20 flex items-center gap-3 md:left-10 md:top-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.12)] backdrop-blur-xl">
          <HeartPulse
            size={21}
            className="text-cyan-300"
            strokeWidth={2}
          />
        </div>

        <div>
          <p className="text-sm font-bold tracking-[0.28em] text-white">
            ANAYA
          </p>

          <p className="text-[9px] font-medium tracking-[0.25em] text-cyan-300/70">
            HEALTH ACCESS AI
          </p>
        </div>
      </div>

      {/* Top right status */}
      <div className="absolute right-6 top-6 z-20 hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 backdrop-blur-xl md:flex">
        <motion.span
          className="h-2 w-2 rounded-full bg-emerald-400"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />

        <span className="text-xs font-medium text-emerald-300">
          AI SYSTEM ONLINE
        </span>
      </div>

      {/* ========================================================= */}
      {/* MAIN CARD */}
      {/* ========================================================= */}

      <motion.main
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: 'easeOut',
        }}
        className="relative z-10 mx-5 w-full max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] px-6 py-12 shadow-2xl backdrop-blur-2xl md:px-14 md:py-14">
          {/* Card glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[90px]" />

          {/* Border highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />

          <div className="relative text-center">
            {/* AI Orb */}
            <WelcomeImage />

            {/* Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-4 flex items-center justify-center gap-2"
            >
              <Sparkles
                size={15}
                className="text-cyan-300"
              />

              <span className="text-xs font-semibold tracking-[0.22em] text-cyan-300">
                YOUR AI HEALTH COMPANION
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold tracking-tight md:text-7xl"
            >
              Meet{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
                Anaya
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg"
            >
              A natural voice-first AI companion that helps you understand
              basic health information in a simple, accessible way.
            </motion.p>

            {/* ================================================= */}
            {/* FEATURES */}
            {/* ================================================= */}

            <div className="mx-auto mt-10 grid max-w-3xl gap-3 md:grid-cols-3">
              {/* Health */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.045] p-5 text-left transition-all hover:border-emerald-400/25 hover:bg-emerald-400/[0.08]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                  <Activity
                    size={20}
                    className="text-emerald-300"
                  />
                </div>

                <h3 className="font-semibold text-white">
                  Health Guidance
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Clear and accessible general health information.
                </p>
              </motion.div>

              {/* Voice */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.045] p-5 text-left transition-all hover:border-cyan-400/25 hover:bg-cyan-400/[0.08]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <Mic
                    size={20}
                    className="text-cyan-300"
                  />
                </div>

                <h3 className="font-semibold text-white">
                  Voice First
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Just speak naturally and have a conversation with Anaya.
                </p>
              </motion.div>

              {/* Safety */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="group rounded-2xl border border-violet-400/10 bg-violet-400/[0.045] p-5 text-left transition-all hover:border-violet-400/25 hover:bg-violet-400/[0.08]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">
                  <ShieldCheck
                    size={20}
                    className="text-violet-300"
                  />
                </div>

                <h3 className="font-semibold text-white">
                  Safe Guidance
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  General information — not diagnosis or prescriptions.
                </p>
              </motion.div>
            </div>

            {/* ================================================= */}
            {/* START BUTTON */}
            {/* ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-10"
            >
              <Button
                size="lg"
                onClick={onStartCall}
                className="group relative h-14 w-full max-w-sm overflow-hidden rounded-full border border-cyan-300/20 bg-gradient-to-r from-cyan-500 to-emerald-500 text-sm font-bold tracking-wide text-white shadow-[0_0_35px_rgba(20,184,166,0.22)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(20,184,166,0.35)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Mic
                    size={18}
                    strokeWidth={2}
                  />

                  {startButtonText || 'Start talking'}

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>

                {/* Button shine */}
                <motion.span
                  className="absolute inset-y-0 left-[-100%] w-1/2 skew-x-[-20deg] bg-white/20"
                  animate={{
                    left: ['-100%', '160%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'easeInOut',
                  }}
                />
              </Button>
            </motion.div>

            {/* Disclaimer */}
            <p className="mx-auto mt-5 max-w-lg text-[11px] leading-5 text-slate-500">
              Anaya provides general health information and does not replace
              advice from a qualified healthcare professional.
            </p>
          </div>
        </div>
      </motion.main>

      {/* Bottom status */}
      <div className="absolute bottom-5 left-0 right-0 z-20 text-center">
        <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.18em] text-slate-600">
          <Sparkles size={11} />
          POWERED BY AI • VOICE-FIRST HEALTH ACCESS
        </div>
      </div>
    </div>
  );
});

WelcomeView.displayName = 'WelcomeView';