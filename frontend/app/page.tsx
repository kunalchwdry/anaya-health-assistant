'use client';

import { useCallback, useEffect, useState } from 'react';
import { TokenSource } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import { useSession } from '@livekit/components-react';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import { APP_CONFIG_DEFAULTS, type AppConfig } from '@/app-config';
import { VoiceOrb } from '@/components/VoiceOrb';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { StartAudioButton } from '@/components/agents-ui/start-audio-button';
import { BottomNav } from '@/components/app/bottom-nav';
import { EmergencyFAB } from '@/components/app/emergency-fab';
import { Header } from '@/components/app/header';
import { HealthAccess } from '@/components/app/health-access';
import { Insights } from '@/components/app/insights';
import { Languages } from '@/components/app/languages';
import { MemoryPreferences } from '@/components/app/memory-preferences';
import { PrivacyCenter } from '@/components/app/privacy-center';
import { Toast } from '@/components/app/toast';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/ui/sonner';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { getSandboxTokenSource } from '@/lib/utils';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();
  return null;
}

function getPersistentIdentity(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const key = 'anaya_user_identity';
  let identity = window.localStorage.getItem(key);
  if (!identity) {
    identity = `voice_assistant_user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    window.localStorage.setItem(key, identity);
  }
  return identity;
}

export default function Page() {
  const [appConfig] = useState<AppConfig>(APP_CONFIG_DEFAULTS);
  const [activeSection, setActiveSection] = useState<
    'home' | 'conversations' | 'health' | 'insights' | 'memory' | 'profile'
  >('home');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [orbState, setOrbState] = useState<
    'idle' | 'listening' | 'thinking' | 'speaking' | 'error'
  >('idle');
  const [showEmergency, setShowEmergency] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error' | 'info';
  } | null>(null);

  const tokenSource =
    typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string'
      ? getSandboxTokenSource(appConfig)
      : TokenSource.endpoint('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // @ts-expect-error - body is required for our custom endpoint
          body: JSON.stringify({
            participant_identity: getPersistentIdentity(),
          }),
        });

  const session = useSession(
    tokenSource,
    appConfig.agentName ? { agentName: appConfig.agentName } : undefined
  );

  const isConnected = session.isConnected;

  // Sync orb state with agent state
  useEffect(() => {
    // This would ideally come from the agent state via LiveKit
    // For now we keep local state
  }, []);

  const handleLanguageChange = useCallback((lang: string) => {
    setCurrentLanguage(lang);
    showToast(`Language switched to ${lang}`, 'success');
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    showToast(isMuted ? 'Microphone on' : 'Microphone muted', 'info');
  }, [isMuted]);

  const handleToggleSpeaker = useCallback(() => {
    setIsSpeakerOff((prev) => !prev);
    showToast(isSpeakerOff ? 'Speaker on' : 'Speaker off', 'info');
  }, [isSpeakerOff]);

  const handleStartConversation = useCallback(() => {
    if (orbState === 'idle') {
      setOrbState('listening');
      // Simulate conversation flow
      setTimeout(() => setOrbState('thinking'), 3000);
      setTimeout(() => setOrbState('speaking'), 5500);
      setTimeout(() => {
        setOrbState('idle');
        showToast('Response added to transcript', 'success');
      }, 10500);
    } else {
      setOrbState('idle');
    }
  }, [orbState]);

  const handleStopConversation = useCallback(() => {
    setOrbState('idle');
    showToast('Listening stopped', 'info');
  }, []);

  const handleEndConversation = useCallback(() => {
    setOrbState('idle');
    session.end();
    showToast('Conversation ended', 'info');
  }, [session]);

  const handleReplay = useCallback(() => {
    setOrbState('speaking');
    setTimeout(() => setOrbState('idle'), 4000);
    showToast('Replaying last response', 'info');
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section as typeof activeSection);
  }, []);

  return (
    <AgentSessionProvider session={session}>
      <AppSetup />
      <div className="relative min-h-screen bg-[#0a0f1e] text-white">
        {/* Header */}
        <Header
          isConnected={isConnected}
          onLanguageChange={handleLanguageChange}
          currentLanguage={currentLanguage}
          onToggleMute={handleToggleMute}
          onToggleSpeaker={handleToggleSpeaker}
          isMuted={isMuted}
          isSpeakerOff={isSpeakerOff}
          onOpenSettings={() => setActiveSection('profile')}
          onOpenProfile={() => setActiveSection('profile')}
        />

        <main id="main" className="min-h-screen pt-16 pb-24 md:pb-0">
          {/* Voice Agent Section - Home */}
          <section id="home" className={activeSection === 'home' ? 'block' : 'hidden'}>
            <AgentSessionProvider session={session}>
              <AppSetup />
              <div className="grid h-svh grid-cols-1 place-content-center">
                <ViewController appConfig={appConfig} />
              </div>
              <StartAudioButton label="Start Audio" />
              <Toaster
                icons={{ warning: <WarningIcon weight="bold" /> }}
                position="top-center"
                className="toaster group"
                style={
                  {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                  } as React.CSSProperties
                }
              />
            </AgentSessionProvider>

            {/* Landing Hero with VoiceOrb when not connected */}
            {!isConnected && (
              <div className="relative flex min-h-[calc(100svh-16rem)] flex-col items-center justify-center px-4 md:px-8">
                {/* Anaya Orb Centerpiece */}
                <VoiceOrb size="xl" state={orbState} onClick={handleStartConversation} />

                {/* Control Buttons */}
                <div
                  className="mt-8 flex flex-wrap items-center justify-center gap-4"
                  role="group"
                  aria-label="Voice controls"
                >
                  <button
                    onClick={handleStopConversation}
                    disabled={orbState === 'idle'}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Stop listening"
                  >
                    <svg
                      className="h-6 w-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                  <button
                    onClick={handleToggleMute}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 backdrop-blur-xl transition-all hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none ${
                      isMuted
                        ? 'border-rose-400/30 bg-rose-400/10 text-rose-400'
                        : 'bg-white/[0.045] text-white'
                    }`}
                    aria-pressed={isMuted}
                    aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {isMuted ? (
                        <>
                          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9a3 3 0 0 0 5.12 2.12M17 17l-5-5M2 2l22 22" />
                          <line x1="9" y1="12" x2="15" y2="12" />
                        </>
                      ) : (
                        <>
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="22" />
                        </>
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={handleToggleSpeaker}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 backdrop-blur-xl transition-all hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none ${
                      isSpeakerOff
                        ? 'border-rose-400/30 bg-rose-400/10 text-rose-400'
                        : 'bg-white/[0.045] text-white'
                    }`}
                    aria-pressed={isSpeakerOff}
                    aria-label={isSpeakerOff ? 'Turn on speaker' : 'Turn off speaker'}
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {isSpeakerOff ? (
                        <>
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </>
                      ) : (
                        <>
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </>
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={handleReplay}
                    disabled={orbState === 'idle'}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Replay last response"
                  >
                    <svg
                      className="h-6 w-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </svg>
                  </button>
                  <button
                    onClick={handleEndConversation}
                    disabled={orbState === 'idle'}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-400/30 bg-rose-400/10 backdrop-blur-xl transition-all hover:border-rose-400/50 hover:bg-rose-400/20 focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="End conversation"
                  >
                    <svg
                      className="h-6 w-6 text-rose-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Control Labels */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                  <span>Stop</span>
                  <span>{isMuted ? 'Muted' : 'Mute'}</span>
                  <span>{isSpeakerOff ? 'Speaker Off' : 'Speaker'}</span>
                  <span>Replay</span>
                  <span>End</span>
                </div>
              </div>
            )}
          </section>

          {/* Conversations Section */}
          <section
            id="conversations"
            className={activeSection === 'conversations' ? 'block' : 'hidden'}
          >
            <div className="min-h-[calc(100svh-16rem)] px-4 py-12 md:px-8">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-8 text-3xl font-bold tracking-tight">Conversations</h2>
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
                  <p className="text-center text-slate-400">
                    Conversation history will appear here after you start talking with Anaya.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Health Access Section */}
          <section id="health" className={activeSection === 'health' ? 'block' : 'hidden'}>
            <HealthAccess />
          </section>

          {/* Insights Section */}
          <section id="insights" className={activeSection === 'insights' ? 'block' : 'hidden'}>
            <Insights />
          </section>

          {/* Memory & Preferences Section */}
          <section id="memory" className={activeSection === 'memory' ? 'block' : 'hidden'}>
            <MemoryPreferences />
            <PrivacyCenter />
          </section>

          {/* Profile/Settings Section */}
          <section id="profile" className={activeSection === 'profile' ? 'block' : 'hidden'}>
            <div className="min-h-[calc(100svh-16rem)] px-4 py-12 md:px-8">
              <div className="mx-auto max-w-2xl">
                <h2 className="mb-8 text-3xl font-bold tracking-tight">Profile & Settings</h2>
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
                  <p className="text-center text-slate-400">Profile and settings coming soon.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeSection={activeSection} onNavigate={handleNavigate} />

        {/* Emergency FAB */}
        <EmergencyFAB
          isOpen={showEmergency}
          onClose={() => setShowEmergency(false)}
          onOpen={() => setShowEmergency(true)}
        />

        {/* Toast */}
        <Toast message={toast?.message ?? ''} type={toast?.type} isVisible={!!toast} />
      </div>
    </AgentSessionProvider>
  );
}
