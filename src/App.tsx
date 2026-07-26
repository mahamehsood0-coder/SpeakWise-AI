import React, { useState, useEffect } from 'react';
import { PageTab, UserProfile } from './types';
import { onAuthChange, getUserProfile, logoutUser } from './services/firebaseService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { WritingPracticePage } from './pages/WritingPracticePage';
import { VocabularyPage } from './pages/VocabularyPage';
import { QuizPage } from './pages/QuizPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Subscribe to Auth changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'home' && (
          <HomePage setActiveTab={setActiveTab} user={user} />
        )}

        {activeTab === 'auth' && (
          <AuthPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage 
            setActiveTab={setActiveTab} 
            userProfile={userProfile} 
            user={user} 
          />
        )}

        {activeTab === 'writing' && (
          <WritingPracticePage 
            setActiveTab={setActiveTab} 
            user={user} 
            userProfile={userProfile} 
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyPage 
            setActiveTab={setActiveTab} 
            user={user} 
          />
        )}

        {activeTab === 'quiz' && (
          <QuizPage 
            setActiveTab={setActiveTab} 
            user={user} 
          />
        )}

        {activeTab === 'progress' && (
          <ProgressPage 
            setActiveTab={setActiveTab} 
            user={user} 
            userProfile={userProfile} 
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage 
            setActiveTab={setActiveTab} 
            user={user} 
            userProfile={userProfile} 
            onProfileUpdated={refreshProfile} 
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
