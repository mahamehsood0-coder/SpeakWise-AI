import React, { useState } from 'react';
import { PageTab, UserProfile, UserLevel, LearningGoal } from '../types';
import { updateUserProfile, logoutUser } from '../services/firebaseService';
import { 
  User as UserIcon, 
  Sparkles, 
  Save, 
  LogOut, 
  Flame, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface ProfilePageProps {
  setActiveTab: (tab: PageTab) => void;
  user: any;
  userProfile: UserProfile | null;
  onProfileUpdated: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  setActiveTab,
  user,
  userProfile,
  onProfileUpdated,
}) => {
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.email?.split('@')[0] || '');
  const [targetGoal, setTargetGoal] = useState<LearningGoal>(
    userProfile?.targetGoal || 'Academic Essays & College Writing'
  );
  const [targetLevel, setTargetLevel] = useState<UserLevel>(
    userProfile?.targetLevel || 'Intermediate'
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        targetGoal: targetGoal,
        targetLevel: targetLevel,
      });
      setSavedSuccess(true);
      onProfileUpdated();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setActiveTab('home');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <UserIcon className="w-12 h-12 text-indigo-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign in to view your profile</h2>
        <p className="text-xs text-slate-500">Manage your learning goals, target level, and profile settings.</p>
        <button
          onClick={() => setActiveTab('auth')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
          <UserIcon className="w-4 h-4" />
          <span>Student Account Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile & Preferences
        </h1>
        <p className="text-slate-600 text-sm">
          Customize your learning goals and proficiency level so SpeakWise AI provides appropriately calibrated feedback.
        </p>
      </div>

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-md space-y-6">
        
        {/* User Badge Overview */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> {userProfile?.streakDays || 1} Day Streak
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                <ShieldCheck className="w-3 h-3 text-indigo-600" /> Verified Student
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Primary English Learning Goal</label>
            <select
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value as LearningGoal)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Academic Essays & College Writing">Academic Essays & College Writing</option>
              <option value="Speaking & Fluency for Presentations">Speaking & Fluency for Presentations</option>
              <option value="Grammar & Professional Emails">Grammar & Professional Emails</option>
              <option value="IELTS / TOEFL Prep">IELTS / TOEFL Prep</option>
              <option value="General Everyday English">General Everyday English</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Target Proficiency Level</label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value as UserLevel)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Beginner">Beginner (Simple English explanations)</option>
              <option value="Intermediate">Intermediate (Standard College Level)</option>
              <option value="Advanced">Advanced (Academic & Graduate Level)</option>
            </select>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 font-semibold text-xs rounded-xl hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
