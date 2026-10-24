import React from 'react';
import { Currency, Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { CURRENCY_LABELS } from '../services/currency';
import { 
  ShoppingBag, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Clock, 
  Printer, 
  Globe, 
  User, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserProfile | null;
  onOpenGoogleAuth: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
  isOnline: boolean;
}

export const Header: React.FC<Props> = ({
  currentView,
  onNavigate,
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  currentUser,
  onOpenGoogleAuth,
  cartCount,
  onOpenCart,
  onOpenAI,
  isOnline
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const supportedCurrencies: Currency[] = ['SLE', 'USD', 'CNY', 'EUR', 'GBP', 'NGN', 'XOF'];
  const supportedLanguages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'kri', label: 'Krio (Salone)', flag: '🇸🇱' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 h-16">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('store')}
          className="text-left font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-amber-800 transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>Mauwiltus</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-slate-700 font-medium">Global Lite</span>
        </button>

        {/* Zone 2: Primary Nav Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('store')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'store' ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            {t.storefront}
          </button>
          <button
            onClick={() => onNavigate('tracking')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'tracking' ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            {t.tracking}
          </button>
          <button
            onClick={() => onNavigate('waitingRoom')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              currentView === 'waitingRoom' ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.waitingRoom}</span>
          </button>
          <button
            onClick={() => onNavigate('printingShop')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              currentView === 'printingShop' ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.printingShop}</span>
          </button>
          <button
            onClick={() => onNavigate('customs')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'customs' ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            {t.customs}
          </button>
          <button
            onClick={() => onNavigate('calculator')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'calculator' ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            {t.calculator}
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'admin' ? 'text-amber-800 font-bold border-b-2 border-amber-800 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            {t.admin}
          </button>
        </nav>

        {/* Zone 3: Controls (Language, Currency, Google Account, Bag) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Language Selector */}
          <div className="relative flex items-center">
            <select
              aria-label="Select interface language"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="appearance-none bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:border-slate-900 transition-colors"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
          </div>

          {/* Currency Dropdown Selector */}
          <div className="relative flex items-center">
            <select
              aria-label="Select display currency"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="appearance-none bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-mono font-bold py-1.5 pl-2.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:border-slate-900 transition-colors"
            >
              {supportedCurrencies.map((c) => (
                <option key={c} value={c}>
                  {c} ({CURRENCY_LABELS[c]?.symbol || c})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
          </div>

          {/* Google Auth / Customer Profile */}
          {currentUser?.isLoggedIn ? (
            <button
              onClick={onOpenGoogleAuth}
              title={`Logged in as ${currentUser.name} (${currentUser.email})`}
              className="flex items-center gap-1.5 py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden md:inline max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </button>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-1.5 py-1.5 px-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="hidden sm:inline">Google Sign In</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 text-[10px] rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Subnavigation Bar for Medium & Small Screens */}
      <div className="xl:hidden flex items-center gap-1 border-t border-slate-100 px-3 py-2 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
        <button
          onClick={() => onNavigate('store')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${currentView === 'store' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
        >
          {t.storefront}
        </button>
        <button
          onClick={() => onNavigate('tracking')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${currentView === 'tracking' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
        >
          {t.tracking}
        </button>
        <button
          onClick={() => onNavigate('waitingRoom')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer flex items-center gap-1 ${currentView === 'waitingRoom' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
        >
          <Clock className="w-3 h-3 text-amber-500" />
          <span>{t.waitingRoom}</span>
        </button>
        <button
          onClick={() => onNavigate('printingShop')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer flex items-center gap-1 ${currentView === 'printingShop' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
        >
          <Printer className="w-3 h-3 text-amber-500" />
          <span>{t.printingShop}</span>
        </button>
        <button
          onClick={() => onNavigate('customs')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${currentView === 'customs' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
        >
          {t.customs}
        </button>
        <button
          onClick={() => onNavigate('calculator')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${currentView === 'calculator' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
        >
          {t.calculator}
        </button>
        <button
          onClick={() => onNavigate('admin')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${currentView === 'admin' ? 'bg-amber-800 text-white font-bold' : 'hover:bg-slate-100 text-amber-800'}`}
        >
          {t.admin}
        </button>
      </div>
    </header>
  );
};
