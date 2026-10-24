import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { STORE_INFO } from '../data/initialData';
import { Sparkles, MapPin, Phone, Users, Clock, Printer, X, ShieldCheck } from 'lucide-react';

interface Props {
  language: Language;
  currentUser: UserProfile | null;
  onOpenGoogleAuth: () => void;
  onNavigate: (view: string) => void;
}

export const WelcomeBanner: React.FC<Props> = ({
  language,
  currentUser,
  onOpenGoogleAuth,
  onNavigate
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950 text-white border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Welcome Text Content */}
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>China · Sierra Leone Trade Hub</span>
              </span>

              {currentUser?.isLoggedIn ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Welcome back, {currentUser.name}!</span>
                </span>
              ) : (
                <button
                  onClick={onOpenGoogleAuth}
                  className="text-[11px] text-amber-300 hover:text-white underline font-medium cursor-pointer"
                >
                  {t.signInWithGoogle}
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold font-display tracking-tight text-white">
              {t.welcomeTitle}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.welcomeSub}
            </p>

            {/* Quick Contact & Store Location Ribbon */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300 pt-0.5 font-mono">
              <span className="flex items-center gap-1 text-amber-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{STORE_INFO.address}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{STORE_INFO.primaryContact} / {STORE_INFO.secondaryContact}</span>
              </span>
              <span className="text-slate-400">
                Manager: <strong className="text-white font-sans">{STORE_INFO.managerName}</strong> · Consignee: <strong className="text-white font-sans">{STORE_INFO.consigneeName}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('waitingRoom')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer border border-white/10"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.waitingRoom}</span>
            </button>

            <button
              onClick={() => onNavigate('printingShop')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printingShop}</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss banner"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
