'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Circle,
  Languages,
  Menu,
  Mic,
  MicOff,
  Settings,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

interface HeaderProps {
  isConnected: boolean;
  onLanguageChange: (lang: string) => void;
  currentLanguage: string;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  isMuted: boolean;
  isSpeakerOff: boolean;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export function Header({
  isConnected,
  onLanguageChange,
  currentLanguage,
  onToggleMute,
  onToggleSpeaker,
  isMuted,
  isSpeakerOff,
  onOpenSettings,
  onOpenProfile,
}: HeaderProps) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const handleLangSelect = (code: string) => {
    onLanguageChange(code);
    setShowLangMenu(false);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (!e.currentTarget.contains(e.target as Node)) {
      setShowLangMenu(false);
      setShowUserMenu(false);
    }
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 right-0 left-0 z-50 h-16" aria-hidden="true">
        <div className="h-full" />
      </header>
    );
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16" onClick={handleClickOutside}>
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a
            href="#main"
            className="flex items-center gap-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
            aria-label="Anaya - Voice of Bharat"
          >
            <motion.div
              className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600" />
              <div className="absolute inset-1.5 rounded-full bg-[#0a0f1e]" />
              <svg
                className="relative h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8z" />
                <path d="M12 6v4" />
                <path d="M12 14h.01" />
              </svg>
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-tight text-white">ANAYA</p>
              <p className="text-[10px] font-medium tracking-wide text-cyan-300/80">
                Voice of Bharat
              </p>
            </div>
          </a>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Main navigation">
          {['Home', 'Conversations', 'Health Access', 'Insights', 'Memory', 'Settings'].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {item}
              </a>
            )
          )}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <motion.div
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 backdrop-blur-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              className={cn(
                'h-2 w-2 rounded-full',
                isConnected
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-slate-500'
              )}
              animate={isConnected ? { opacity: [0.4, 1, 0.4] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-slate-300">
              {isConnected ? 'Connected' : 'Connecting…'}
            </span>
          </motion.div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 backdrop-blur-xl transition-all hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
              aria-expanded={showLangMenu}
              aria-haspopup="listbox"
              aria-label="Select language"
            >
              <Globe className="h-4 w-4 text-slate-300" />
              <span className="hidden text-sm font-medium text-white sm:inline">
                {currentLang.native}
              </span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-slate-400 transition-transform',
                  showLangMenu && 'rotate-180'
                )}
              />
            </button>

            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-white/[0.045] py-2 shadow-2xl backdrop-blur-2xl"
                role="listbox"
                aria-label="Available languages"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangSelect(lang.code)}
                    role="option"
                    aria-selected={lang.code === currentLanguage}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
                      lang.code === currentLanguage
                        ? 'bg-cyan-400/10 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <span className="text-sm font-medium">{lang.native}</span>
                    <span className="ml-auto text-xs text-slate-400">{lang.name}</span>
                    {lang.code === currentLanguage && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Microphone Toggle */}
          <button
            onClick={onToggleMute}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
              isMuted && 'border-rose-400/30 bg-rose-400/10 text-rose-400'
            )}
            aria-pressed={isMuted}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Speaker Toggle */}
          <button
            onClick={onToggleSpeaker}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
              isSpeakerOff && 'border-rose-400/30 bg-rose-400/10 text-rose-400'
            )}
            aria-pressed={isSpeakerOff}
            aria-label={isSpeakerOff ? 'Turn on speaker' : 'Turn off speaker'}
          >
            {isSpeakerOff ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-slate-300" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 backdrop-blur-xl transition-all hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
              aria-label="User menu"
            >
              <User className="h-5 w-5 text-white" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-white/[0.045] py-2 shadow-2xl backdrop-blur-2xl"
                role="menu"
              >
                <button
                  onClick={onOpenProfile}
                  role="menuitem"
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                <button
                  onClick={onOpenSettings}
                  role="menuitem"
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none md:hidden"
            aria-label="Open menu"
            aria-expanded={false}
          >
            <Menu className="h-5 w-5 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
