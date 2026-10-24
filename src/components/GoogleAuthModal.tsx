import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, CheckCircle, LogOut, ShieldCheck, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const GoogleAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => {
  const [customName, setCustomName] = useState('Abdul Karim Sesay');
  const [customEmail, setCustomEmail] = useState('sesayabdulkarim12345@gmail.com');
  const [customPhone, setCustomPhone] = useState('+232 73 775786');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: `google-${Date.now()}`,
        name: customName || 'Abdul Karim Sesay',
        email: customEmail || 'sesayabdulkarim12345@gmail.com',
        avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google',
        phone: customPhone,
        address: '15 Macdonald Street, Freetown, Sierra Leone',
        isLoggedIn: true,
        memberSince: 'October 2026',
        ordersCount: 2
      };
      onLogin(user);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h3 className="font-bold text-slate-900 text-sm font-display">
              {currentUser?.isLoggedIn ? 'Customer Google Account' : 'Sign In with Google'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {currentUser?.isLoggedIn ? (
          /* Profile Overview */
          <div className="p-6 space-y-5 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-lg shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{currentUser.name}</h4>
                <div className="text-slate-500 font-mono text-[11px]">{currentUser.email}</div>
                <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-semibold mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Verified Customer</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-b border-slate-100 py-3 text-slate-600">
              <div className="flex justify-between">
                <span>Contact Phone:</span>
                <span className="font-mono text-slate-900 font-medium">{currentUser.phone || '+232 73 775786'}</span>
              </div>
              <div className="flex justify-between">
                <span>Default Address:</span>
                <span className="text-slate-900 font-medium">{currentUser.address}</span>
              </div>
              <div className="flex justify-between">
                <span>Membership:</span>
                <span className="text-amber-700 font-semibold">Priority Customer Club</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Google</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="p-6 space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Sign in with your Google account for faster checkout, automated order tracking to 15 Macdonald Street, and synchronized invoices.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Google Email Address</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Sierra Leone Mobile Phone</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isSubmitting ? 'Authenticating...' : 'One-Click Sign In with Google'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
