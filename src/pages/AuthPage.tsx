import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle 
} from '../services/firebaseService';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface AuthPageProps {
  setActiveTab: (tab: PageTab) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ setActiveTab }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!displayName.trim()) {
          throw new Error('Please enter your full name or nickname.');
        }
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Incorrect email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isRegister ? 'Join SpeakWise AI' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister 
              ? 'Create your free college student account to save writing progress' 
              : 'Sign in to access your feedback history and quiz scores'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all ${
              !isRegister ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all ${
              isRegister ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
            {errorMsg.includes('operation-not-allowed') && (
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await loginWithEmail('student@university.edu', 'demo123');
                    setActiveTab('dashboard');
                  } catch (e) {
                    setActiveTab('dashboard');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-1 w-full py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 transition-colors"
              >
                Continue as Guest Student
              </button>
            )}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Full Name or Student Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-pulse">Processing...</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Student Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to SpeakWise</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center border-t border-slate-200 pt-4">
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute -top-2.5">
            Or Continue With
          </span>
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Guest Demo Student Option */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                await loginWithEmail('alex.chen@university.edu', 'demo123');
              } catch (e) {
                console.log('Using guest mode');
              } finally {
                setLoading(false);
                setActiveTab('dashboard');
              }
            }}
            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200/80 transition-all flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Quick Demo Student Access</span>
          </button>
        </div>

      </div>
    </div>
  );
};
