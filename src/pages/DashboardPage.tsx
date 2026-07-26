import React, { useState, useEffect } from 'react';
import { PageTab, UserProfile, WritingSubmission, QuizResult, WordOfDay } from '../types';
import { 
  getWritingHistory, 
  getQuizHistory 
} from '../services/firebaseService';
import { fetchWordOfTheDay } from '../services/aiService';
import { 
  Flame, 
  PenTool, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Volume2,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: PageTab) => void;
  userProfile: UserProfile | null;
  user: any;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  userProfile,
  user,
}) => {
  const [writings, setWritings] = useState<WritingSubmission[]>([]);
  const [quizzes, setQuizzes] = useState<QuizResult[]>([]);
  const [wordOfDay, setWordOfDay] = useState<WordOfDay | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setLoadingData(true);
      try {
        const [wList, qList, word] = await Promise.all([
          getWritingHistory(user.uid),
          getQuizHistory(user.uid),
          fetchWordOfTheDay().catch(() => null),
        ]);
        setWritings(wList);
        setQuizzes(qList);
        setWordOfDay(word);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const avgWritingScore = writings.length > 0
    ? Math.round(writings.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / writings.length)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/30 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-400/30">
                {userProfile?.targetGoal || 'College Academic Writing'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-400/30">
                {userProfile?.targetLevel || 'Intermediate'} Level
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {userProfile?.displayName || 'Student'}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Ready to elevate your English fluency today? Check your daily word or submit a paragraph for AI feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-400/30">
              <Flame className="w-7 h-7 fill-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-amber-300">{userProfile?.streakDays || 1} Days</p>
              <p className="text-[11px] text-slate-300 font-medium">Active Learning Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <button
          onClick={() => setActiveTab('writing')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <PenTool className="w-4 h-4" />
              <span>Writing Practice</span>
            </div>
            <p className="text-xs text-slate-500">Submit text or spoken audio for AI review</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-600 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Weekly Quiz</span>
            </div>
            <p className="text-xs text-slate-500">5-question grammar & vocabulary test</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => setActiveTab('vocabulary')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Vocabulary Hub</span>
            </div>
            <p className="text-xs text-slate-500">Study flashcards & college words</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </button>

      </div>

      {/* Main Grid: Word of the Day Spotlight & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Word of the Day Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/50 rounded-2xl border border-indigo-100 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Word of the Day
              </span>
              <button 
                onClick={() => setActiveTab('vocabulary')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View Catalog
              </button>
            </div>

            {wordOfDay ? (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between border-b border-indigo-100 pb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{wordOfDay.word}</h3>
                    <p className="text-xs text-slate-500 font-mono">{wordOfDay.phonetic} • <span className="italic">{wordOfDay.partOfSpeech}</span></p>
                  </div>
                  <button
                    onClick={() => speakText(wordOfDay.word)}
                    className="p-2 rounded-full bg-white text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-colors shadow-2xs"
                    title="Listen to Pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Definition</p>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{wordOfDay.definition}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wider">Example Sentence:</span>
                  <p className="italic">"{wordOfDay.exampleSentence}"</p>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">Speaking Tip:</span> {wordOfDay.speakingTip}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                Loading Word of the Day...
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learning Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xl font-black text-indigo-600">{writings.length}</p>
                <p className="text-[11px] text-slate-500">Paragraphs Reviewed</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xl font-black text-emerald-600">{avgWritingScore > 0 ? `${avgWritingScore}%` : 'N/A'}</p>
                <p className="text-[11px] text-slate-500">Avg Writing Score</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xl font-black text-sky-600">{quizzes.length}</p>
                <p className="text-[11px] text-slate-500">Quizzes Completed</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xl font-black text-amber-600">{userProfile?.streakDays || 1}</p>
                <p className="text-[11px] text-slate-500">Days Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Writing Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Recent Writing Practice</h3>
              </div>
              <button
                onClick={() => setActiveTab('writing')}
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>New Session</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {writings.length > 0 ? (
              <div className="space-y-3">
                {writings.slice(0, 4).map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                        {item.promptTitle || 'General Practice'}
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.overallScore >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : item.overallScore >= 60 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        Score: {item.overallScore}/100
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-2 italic font-mono bg-white p-2.5 rounded-lg border border-slate-200/60">
                      "{item.text}"
                    </p>

                    <p className="text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Summary:</span> {item.summary}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <PenTool className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">No writing submissions saved yet</p>
                  <p className="text-[11px] text-slate-500">Write a short paragraph to receive AI feedback and record your progress.</p>
                </div>
                <button
                  onClick={() => setActiveTab('writing')}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-lg shadow-2xs hover:bg-indigo-700 transition-colors"
                >
                  Start First Writing Practice
                </button>
              </div>
            )}
          </div>

          {/* Recent Quiz Scores */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-bold text-slate-900">Recent Quiz Results</h3>
              </div>
              <button
                onClick={() => setActiveTab('quiz')}
                className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>Take Quiz</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizzes.slice(0, 4).map((q, i) => (
                  <div key={q.id || i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{q.quizTitle}</span>
                      <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                        {q.score}/{q.totalQuestions} ({q.percentage}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Category: {q.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No quiz results logged yet. <button onClick={() => setActiveTab('quiz')} className="text-sky-600 font-bold underline">Take a 5-question quiz</button> to test your skills!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
