'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/shadcn/utils';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '', rtl: false },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '', rtl: false },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '', rtl: false },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '', rtl: false },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '', rtl: false },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '', rtl: false },
  { code: 'gu', name: 'Gujarati', native: 'ગુરાતી', flag: '', rtl: false },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '', rtl: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '', rtl: false },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਾਬੀ', flag: '', rtl: false },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '', rtl: true },
  { code: 'or', name: 'Odia', native: '', flag: '', rtl: false },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '', rtl: false },
];

interface LanguagesProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  className?: string;
}

export function Languages({ currentLanguage, onLanguageChange, className }: LanguagesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <div className={cn('relative inline-flex', className)} aria-hidden="true">
        <button
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-400"
          disabled
        >
          <Globe className="h-4 w-4" />
          <span>{currentLang.native}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-slate-300" />
        <span className="text-sm font-medium text-white">{currentLang.native}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400"
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-white/[0.045] py-2 shadow-2xl backdrop-blur-2xl"
            role="listbox"
            aria-label="Available languages"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                role="option"
                aria-selected={lang.code === currentLanguage}
                dir={lang.rtl ? 'rtl' : 'ltr'}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                  lang.code === currentLanguage
                    ? 'bg-cyan-400/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <span className="text-lg" aria-hidden="true">
                  {lang.flag}
                </span>
                <span className="flex-1 text-sm font-medium">{lang.native}</span>
                <span className="text-xs text-slate-400">{lang.name}</span>
                {lang.code === currentLanguage && (
                  <Check className="h-4 w-4 flex-shrink-0 text-cyan-400" aria-hidden="true" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Also export a standalone LanguageSelector for use in header
export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}) {
  return <Languages currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />;
}
