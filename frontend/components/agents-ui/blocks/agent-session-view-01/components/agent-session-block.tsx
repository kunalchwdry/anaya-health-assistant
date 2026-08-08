'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, type MotionProps, motion } from 'motion/react';
import {
  Activity,
  HeartPulse,
  Mic,
  MicOff,
  Sparkles,
  Stethoscope,
  Volume2,
  Waves,
} from 'lucide-react';

import {
  useAgent,
  useSessionContext,
  useSessionMessages,
} from '@livekit/components-react';

import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';
import {
  AgentControlBar,
  type AgentControlBarControls,
} from '@/components/agents-ui/agent-control-bar';

import { Shimmer } from '@/components/ai-elements/shimmer';
import { cn } from '@/lib/shadcn/utils';
import { TileLayout } from './tile-view';

const MotionMessage = motion.create(Shimmer);

const BOTTOM_VIEW_MOTION_PROPS: MotionProps = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    delay: 0.2,
    ease: 'easeOut',
  },
};

const CHAT_MOTION_PROPS: MotionProps = {
  variants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

const SHIMMER_MOTION_PROPS: MotionProps = {
  variants: {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({
  top = false,
  bottom = false,
  className,
}: FadeProps) {
  return (
    <div
      className={cn(
        'pointer-events-none h-6',
        top
          ? 'bg-gradient-to-b from-[#050b12] to-transparent'
          : '',
        bottom
          ? 'bg-gradient-to-t from-[#050b12] to-transparent'
          : '',
        className,
      )}
    />
  );
}

export interface AgentSessionView_01Props {
  preConnectMessage?: string;
  supportsChatInput?: boolean;
  supportsVideoInput?: boolean;
  supportsScreenShare?: boolean;
  isPreConnectBufferEnabled?: boolean;

  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorShift?: number;
  audioVisualizerBarCount?: number;
  audioVisualizerGridRowCount?: number;
  audioVisualizerGridColumnCount?: number;
  audioVisualizerRadialBarCount?: number;
  audioVisualizerRadialRadius?: number;
  audioVisualizerWaveLineWidth?: number;

  className?: string;
}

export function AgentSessionView_01({
  preConnectMessage = 'Anaya is ready. Speak naturally.',
  supportsChatInput = true,
  supportsVideoInput = false,
  supportsScreenShare = false,
  isPreConnectBufferEnabled = true,

  audioVisualizerType = 'aura',
  audioVisualizerColor = '#22d3ee',
  audioVisualizerColorShift = 0.2,
  audioVisualizerBarCount = 5,
  audioVisualizerGridRowCount = 15,
  audioVisualizerGridColumnCount = 15,
  audioVisualizerRadialBarCount = 25,
  audioVisualizerRadialRadius = 100,
  audioVisualizerWaveLineWidth = 3,

  ref,
  className,
  ...props
}: React.ComponentProps<'section'> & AgentSessionView_01Props) {
  const session = useSessionContext();
  const { messages } = useSessionMessages(session);
  const { state: agentState } = useAgent();

  const [chatOpen, setChatOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  /*
   * ---------------------------------------------------------
   * ANAYA STATE
   * ---------------------------------------------------------
   */

  const isConnected = session.isConnected;
  const isSpeaking = agentState === 'speaking';
  const isListening = agentState === 'listening';
  const isThinking = agentState === 'thinking';

  let statusText = 'Preparing Anaya';
  let statusDescription = 'Connecting to your health companion';

  if (isConnected && isListening) {
    statusText = 'Listening to you';
    statusDescription = 'Anaya is listening';
  } else if (isConnected && isThinking) {
    statusText = 'Thinking';
    statusDescription = 'Anaya is preparing a response';
  } else if (isConnected && isSpeaking) {
    statusText = 'Anaya is speaking';
    statusDescription = 'Listen to your health companion';
  } else if (isConnected) {
    statusText = 'Anaya is ready';
    statusDescription = 'Speak naturally';
  }

  /*
   * ---------------------------------------------------------
   * CONTROLS
   * ---------------------------------------------------------
   */

  const controls: AgentControlBarControls = {
    leave: true,
    microphone: true,
    chat: supportsChatInput,
    camera: supportsVideoInput,
    screenShare: supportsScreenShare,
  };

  /*
   * ---------------------------------------------------------
   * AUTO SCROLL
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section
      ref={ref}
      {...props}
      className={cn(
        'relative z-10 h-full w-full overflow-hidden bg-[#050b12] text-white',
        className,
      )}
    >
      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(8,145,178,0.18),transparent_35%),radial-gradient(circle_at_5%_90%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_95%_85%,rgba(37,99,235,0.12),transparent_30%)]" />

        {/* Cyan glow */}
        <motion.div
          className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Green glow */}
        <motion.div
          className="absolute bottom-[-220px] left-[-100px] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Blue glow */}
        <motion.div
          className="absolute bottom-[-200px] right-[-100px] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]"
          animate={{
            x: [0, -40, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '45px 45px',
          }}
        />
      </div>

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <header className="absolute left-5 right-5 top-5 z-50 flex items-center justify-between md:left-8 md:right-8 md:top-7">
        {/* Anaya branding */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2.5 shadow-lg backdrop-blur-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
            <HeartPulse
              size={20}
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

        {/* Online indicator */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5 backdrop-blur-xl"
        >
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />

          <span className="hidden text-xs font-medium text-emerald-300 sm:block">
            AI SYSTEM ONLINE
          </span>
        </motion.div>
      </header>

      {/* ===================================================== */}
      {/* MAIN AGENT AREA */}
      {/* ===================================================== */}

      <main className="absolute inset-0 flex items-center justify-center px-5 pb-28 pt-24">
        <div className="relative flex h-full w-full max-w-5xl items-center justify-center">
          
          {/* ================================================= */}
          {/* AGENT ORB */}
          {/* ================================================= */}

          {!chatOpen && (
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              
              {/* Outer pulse */}
              <motion.div
                className="absolute -inset-14 rounded-full border border-cyan-400/10"
                animate={{
                  scale: isSpeaking
                    ? [1, 1.25, 1]
                    : [1, 1.08, 1],
                  opacity: isSpeaking
                    ? [0.15, 0.5, 0.15]
                    : [0.1, 0.25, 0.1],
                }}
                transition={{
                  duration: isSpeaking ? 1.2 : 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <motion.div
                className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-3xl"
                animate={{
                  scale: isSpeaking
                    ? [1, 1.3, 1]
                    : [1, 1.1, 1],
                  opacity: isSpeaking
                    ? [0.35, 0.8, 0.35]
                    : [0.2, 0.45, 0.2],
                }}
                transition={{
                  duration: isSpeaking ? 1.1 : 3,
                  repeat: Infinity,
                }}
              />

              {/* Orb */}
              <motion.div
                className="relative flex h-40 w-40 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-[0_0_80px_rgba(34,211,238,0.35)] md:h-52 md:w-52"
                animate={{
                  y: isSpeaking
                    ? [0, -8, 0]
                    : [0, -4, 0],
                  scale: isSpeaking
                    ? [1, 1.04, 1]
                    : [1, 1.015, 1],
                }}
                transition={{
                  duration: isSpeaking ? 1.2 : 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Inner ring */}
                <div className="absolute inset-3 rounded-full border border-white/20" />

                {/* Second ring */}
                <div className="absolute inset-7 rounded-full border border-white/10" />

                <Stethoscope
                  size={58}
                  strokeWidth={1.5}
                  className="relative text-white md:h-[70px] md:w-[70px]"
                />

                {/* AI dot */}
                <motion.div
                  className="absolute right-7 top-7 h-3.5 w-3.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]"
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
          )}

          {/* ================================================= */}
          {/* VISUALIZER */}
          {/* ================================================= */}

          {!chatOpen && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60">
              <TileLayout
                chatOpen={chatOpen}
                audioVisualizerType={audioVisualizerType}
                audioVisualizerColor={audioVisualizerColor}
                audioVisualizerColorShift={audioVisualizerColorShift}
                audioVisualizerBarCount={audioVisualizerBarCount}
                audioVisualizerRadialBarCount={audioVisualizerRadialBarCount}
                audioVisualizerRadialRadius={audioVisualizerRadialRadius}
                audioVisualizerGridRowCount={audioVisualizerGridRowCount}
                audioVisualizerGridColumnCount={audioVisualizerGridColumnCount}
                audioVisualizerWaveLineWidth={audioVisualizerWaveLineWidth}
              />
            </div>
          )}

          {/* ================================================= */}
          {/* STATUS CARD */}
          {/* ================================================= */}

          {!chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-center"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-7 py-4 shadow-2xl backdrop-blur-2xl">
                <div className="mb-1 flex items-center justify-center gap-2">
                  {isSpeaking ? (
                    <Volume2
                      size={16}
                      className="text-cyan-300"
                    />
                  ) : isListening ? (
                    <Mic
                      size={16}
                      className="text-emerald-300"
                    />
                  ) : isThinking ? (
                    <Sparkles
                      size={16}
                      className="text-cyan-300"
                    />
                  ) : (
                    <Activity
                      size={16}
                      className="text-cyan-300"
                    />
                  )}

                  <span className="text-sm font-semibold text-white">
                    {statusText}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  {statusDescription}
                </p>

                {/* Voice activity dots */}
                {(isSpeaking || isListening) && (
                  <div className="mt-3 flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                      <motion.div
                        key={bar}
                        className="w-1 rounded-full bg-cyan-300"
                        animate={{
                          height: [4, 14 + Math.random() * 16, 4],
                        }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          delay: bar * 0.08,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ================================================= */}
          {/* CHAT / TRANSCRIPT */}
          {/* ================================================= */}

          <AnimatePresence>
            {chatOpen && (
              <motion.div
                {...CHAT_MOTION_PROPS}
                className="absolute inset-0 z-30 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl"
              >
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                    <HeartPulse
                      size={18}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Conversation with Anaya
                    </p>

                    <p className="text-xs text-slate-400">
                      Health Access AI
                    </p>
                  </div>
                </div>

                {/* Transcript */}
                <div
                  ref={scrollAreaRef}
                  className="flex-1 overflow-y-auto"
                >
                  <AgentChatTranscript
                    agentState={agentState}
                    messages={messages}
                    className="mx-auto w-full max-w-3xl px-4 [&_.is-user>div]:rounded-[22px] [&>div>div]:px-4 [&>div>div]:pt-6 md:[&>div>div]:px-6"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ===================================================== */}
      {/* BOTTOM CONTROL AREA */}
      {/* ===================================================== */}

      <motion.div
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="absolute inset-x-4 bottom-4 z-50 md:inset-x-10 md:bottom-7"
      >
        {isPreConnectBufferEnabled && !chatOpen && (
          <AnimatePresence>
            {messages.length === 0 && (
              <MotionMessage
                key="pre-connect-message"
                duration={2}
                {...SHIMMER_MOTION_PROPS}
                className="pointer-events-none mx-auto mb-3 block w-full max-w-2xl text-center text-xs font-medium text-cyan-200/80"
              >
                {preConnectMessage}
              </MotionMessage>
            )}
          </AnimatePresence>
        )}

        <div className="mx-auto max-w-2xl">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-2 shadow-2xl backdrop-blur-2xl">
            <AgentControlBar
              variant="livekit"
              controls={controls}
              isChatOpen={chatOpen}
              isConnected={session.isConnected}
              onDisconnect={session.end}
              onIsChatOpenChange={setChatOpen}
            />
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-20 hidden justify-center md:flex">
        <p className="text-[9px] font-medium tracking-[0.2em] text-slate-500">
          ANAYA • VOICE-POWERED HEALTH ACCESS
        </p>
      </div>
    </section>
  );
}