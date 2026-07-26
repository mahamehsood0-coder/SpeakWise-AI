import React, { useState } from 'react';
import { PageTab, UserProfile } from '../types';
import { 
  Sparkles, 
  Home, 
  LayoutDashboard, 
  PenTool, 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Flame
} from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  user: any;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  userProfile,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode; requiresAuth?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, requiresAuth: true },
    { id: 'writing', label: 'Writing Practice', icon: <PenTool className="w-4 h-4" /> },
    { id: 'vocabulary', label: 'Vocabulary', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" />, requiresAuth: true },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, requiresAuth: true },
  ];

  const handleTabClick = (tab: PageTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  SpeakWise <span className="text-indigo-600">AI</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                  College ESL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">AI English Coach for College Success</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 pb-1 text-sm transition-all duration-150 ${
                    isActive
                      ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {userProfile && (
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{userProfile.streakDays || 1} Days</span>
                  </div>
                )}
                
                <div 
                  onClick={() => handleTabClick('profile')}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-slate-900 max-w-[120px] truncate">{userProfile?.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{userProfile?.targetLevel || 'Intermediate'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-400 overflow-hidden flex items-center justify-center text-slate-800 font-bold text-sm shadow-2xs group-hover:ring-2 group-hover:ring-indigo-500 transition-all">
                    {(userProfile?.displayName || user.email || 'A').charAt(0).toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('auth')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                <span>Student Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            {user && userProfile && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-1 rounded-full border border-amber-200">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{userProfile.streakDays || 1}d</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
            {user ? (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {(userProfile?.displayName || user.email || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{userProfile?.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-xs text-rose-600 font-medium bg-rose-50 px-3 py-1.5 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('auth')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium text-sm py-2.5 rounded-lg shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Student Login / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
