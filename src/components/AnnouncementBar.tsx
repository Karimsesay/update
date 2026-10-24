import React, { useState } from 'react';
import { AdBanner } from '../types';
import { X, ArrowRight } from 'lucide-react';

interface Props {
  ads: AdBanner[];
  onNavigate: (view: string) => void;
}

export const AnnouncementBar: React.FC<Props> = ({ ads, onNavigate }) => {
  const [dismissed, setDismissed] = useState(false);
  const activeAd = ads.find(a => a.active);

  if (dismissed || !activeAd) return null;

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="font-semibold text-amber-400 whitespace-nowrap shrink-0">
            {activeAd.title}:
          </span>
          <span className="text-slate-300 truncate">
            {activeAd.message}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate(activeAd.targetView)}
            className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 hover:underline whitespace-nowrap cursor-pointer"
          >
            {activeAd.linkText}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
