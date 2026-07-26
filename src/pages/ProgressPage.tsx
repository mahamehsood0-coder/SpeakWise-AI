import React, { useState, useEffect } from 'react';
import { PageTab, UserProfile, WritingSubmission, QuizResult } from '../types';
import { getWritingHistory, getQuizHistory } from '../services/firebaseService';
import { 
  TrendingUp, 
  Award, 
  Flame, 
  PenTool, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  Download, 
  Clock, 
  Sparkles,
  BarChart2
} from 'lucide-react';

interface ProgressPageProps {
  setActiveTab: (tab: PageTab) => void;
  user: any;
  userProfile: UserProfile | null;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  setActiveTab,
  user,
  userProfile,
}) => {
  const [writings, setWritings] = useState<WritingSubmission[]>([]);
  const [quizzes, setQuizzes] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      setLoading(true);
      try {
        const [wList, qList] = await Promise.all([
          getWritingHistory(user.uid),
          getQuizHistory(user.uid),
        ]);
        setWritings(wList);
        setQuizzes(qList);
      } catch (err) {
        console.error('Error loading history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  // Compute average category scores
  const avgScores = writings.length > 0 ? {
    grammar: Math.round(writings.reduce((a, b) => a + (b.scores?.grammar || 0), 0) / writings.length),
    spelling: Math.round(writings.reduce((a, b) => a + (b.scores?.spelling || 0), 0) / writings.length),
    vocabulary: Math.round(writings.reduce((a, b) => a + (b.scores?.vocabulary || 0), 0) / writings.length),
    sentenceStructure: Math.round(writings.reduce((a, b) => a + (b.scores?.sentenceStructure || 0), 0) / writings.length),
    fluency: Math.round(writings.reduce((a, b) => a + (b.scores?.fluency || 0), 0) / writings.length),
  } : {
    grammar: 85,
    spelling: 90,
    vocabulary: 78,
    sentenceStructure: 80,
    fluency: 82
  };

  const badges = [
    {
      title: 'First Essay',
      desc: 'Completed 1st paragraph analysis',
      unlocked: writings.length >= 1,
      icon: '✍️'
    },
    {
      title: 'Writing Enthusiast',
      desc: 'Submitted 5+ paragraphs',
      unlocked: writings.length >= 5,
      icon: '📝'
    },
    {
      title: 'Quiz Champion',
      desc: 'Scored 100% on a grammar quiz',
      unlocked: quizzes.some(q => q.percentage === 100),
      icon: '🏆'
    },
    {
      title: 'Consistent Learner',
      desc: 'Maintained a 3+ day streak',
      unlocked: (userProfile?.streakDays || 1) >= 3,
      icon: '🔥'
    }
  ];

  const handleExportSummary = () => {
    const summaryText = `SpeakWise AI Progress Report for ${userProfile?.displayName || 'Student'}\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `Total Writings Reviewed: ${writings.length}\n` +
      `Total Quizzes Completed: ${quizzes.length}\n` +
      `Active Streak: ${userProfile?.streakDays || 1} Days\n` +
      `Grammar Average: ${avgScores.grammar}%\n` +
      `Vocabulary Average: ${avgScores.vocabulary}%\n` +
      `Sentence Structure Average: ${avgScores.sentenceStructure}%\n`;

    navigator.clipboard.writeText(summaryText);
    alert('Progress Report copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Student Progress Analytics</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Learning Journey & History
            </h1>
            <p className="text-slate-600 text-sm">
              Track your skill growth across grammar, vocabulary, and writing fluency over time.
            </p>
          </div>

          <button
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Copy Report Summary</span>
          </button>
        </div>
      </div>

      {/* Category Breakdown Bar Gauges */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-600" />
          Skill Proficiency Breakdown
        </h2>

        <div className="space-y-4">
          {[
            { label: 'Grammar Accuracy', score: avgScores.grammar, color: 'bg-indigo-600' },
            { label: 'Spelling Accuracy', score: avgScores.spelling, color: 'bg-emerald-600' },
            { label: 'Vocabulary Choice', score: avgScores.vocabulary, color: 'bg-amber-500' },
            { label: 'Sentence Structure & Variety', score: avgScores.sentenceStructure, color: 'bg-sky-600' },
            { label: 'Natural Spoken & Written Fluency', score: avgScores.fluency, color: 'bg-indigo-500' },
          ].map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">{item.label}</span>
                <span className="text-slate-900 font-bold">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification Badges Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Achievement Badges
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <div 
              key={i}
              className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                b.unlocked 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="text-3xl">{b.icon}</div>
              <div>
                <p className="text-xs font-bold">{b.title}</p>
                <p className="text-[10px] leading-tight">{b.desc}</p>
              </div>
              {b.unlocked && (
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* History Log Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Complete Submission History
        </h2>

        {writings.length > 0 ? (
          <div className="space-y-3">
            {writings.map((w, idx) => (
              <div key={w.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{w.promptTitle || 'General Practice'}</span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Score: {w.overallScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                  "{w.text}"
                </p>
                <p className="text-[11px] text-slate-500">Summary: {w.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No history recorded yet. Complete writing practices to see them logged here.
          </div>
        )}
      </div>

    </div>
  );
};
