import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  PenTool, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  GraduationCap, 
  Volume2, 
  Zap, 
  MessageSquareText, 
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: PageTab) => void;
  user: any;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, user }) => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);

  const demoExamples = [
    {
      title: 'Discussion Forum Post',
      original: 'I agree with the author because he make good point. The research show that students who study together get better grades than person who study alone.',
      score: 74,
      improved: 'I strongly concur with the author’s perspective because he presents compelling arguments. Research demonstrates that students who collaborate in study groups achieve higher academic marks than those who study independently.',
      explanations: [
        { category: 'Grammar', text: '"he make" should be "he makes" (subject-verb agreement with singular pronoun "he").' },
        { category: 'Vocabulary', text: 'Replaced "good point" with "compelling arguments" for an academic tone.' },
        { category: 'Sentence Structure', text: 'Replaced "person who study alone" with "those who study independently" for clearer plural agreement and formal diction.' }
      ]
    },
    {
      title: 'Email to Professor',
      original: 'Dear Professor, I am writing to ask if I can get extension on assignment because I was sick yesterday and could not finished it on time.',
      score: 68,
      improved: 'Dear Professor Smith, I am writing to respectfully request a short extension on the assignment. Due to illness yesterday, I was unable to complete the submission on time.',
      explanations: [
        { category: 'Grammar', text: '"could not finished" should be "could not finish" (base form after modal verb "could").' },
        { category: 'Vocabulary', text: 'Added "respectfully request a short extension" to maintain professional decorum.' },
        { category: 'Fluency', text: 'Replaced "I was sick yesterday and could not..." with "Due to illness yesterday, I was unable..." for smoother phrasing.' }
      ]
    }
  ];

  const currentDemo = demoExamples[selectedDemoIndex];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-semibold border border-indigo-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Tailored for College Students & ESL Learners</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Speak and Write English with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">Unshakable Confidence</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Get instant AI feedback on your college essays, discussion posts, and spoken paragraphs. Understand your mistakes in simple English and learn how to rewrite them naturally.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setActiveTab('writing')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all text-base"
              >
                <PenTool className="w-5 h-5" />
                <span>Start Writing Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-2xs transition-all text-base"
              >
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Take Weekly Quiz</span>
              </button>
            </div>

            {/* Quick Stats Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-2xl mx-auto border-t border-slate-200/60">
              <div className="p-2">
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500">Simple Explanations</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-slate-900">5 Skills</p>
                <p className="text-xs text-slate-500">Grammar to Fluency</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-slate-900">Daily</p>
                <p className="text-xs text-slate-500">Word of the Day</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-slate-900">Firebase</p>
                <p className="text-xs text-slate-500">Saved History</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Live AI Feedback Demonstration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
                <Zap className="w-4 h-4" />
                <span>Interactive Preview</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">See How SpeakWise AI Transforms Your Writing</h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              {demoExamples.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDemoIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedDemoIndex === idx
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ex.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Original Draft Box */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Original Draft</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">Raw Text</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-mono bg-white p-3.5 rounded-lg border border-slate-200">
                "{currentDemo.original}"
              </p>
            </div>

            {/* Improved Version & AI Analysis */}
            <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Rewritten Version
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Score: {currentDemo.score}/100
                </span>
              </div>
              <p className="text-sm text-slate-900 leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-indigo-100/80 shadow-2xs">
                "{currentDemo.improved}"
              </p>
            </div>

          </div>

          {/* Key Explanations */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simple English Corrections & Explanations:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentDemo.explanations.map((exp, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {exp.category}
                  </span>
                  <p className="text-xs text-slate-600 leading-snug">{exp.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('writing')}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors"
            >
              <span>Try Analyzing Your Own Paragraph Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Designed For Every Aspect of English Mastery</h2>
          <p className="text-slate-600 text-sm">Comprehensive tools to build writing clarity, speaking confidence, and vocabulary depth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div 
            onClick={() => setActiveTab('writing')}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              AI Paragraph Feedback
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Write or speak a paragraph on any prompt. Get detailed score breakdowns across Grammar, Spelling, Vocabulary, Sentence Structure, and Fluency with actionable rewrites.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 pt-2">
              <span>Practice Writing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('vocabulary')}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Word of the Day & Vocab
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Expand your academic vocabulary with daily high-value words, example sentences in college context, phonetic audio pronunciations, and bookmarkable flashcards.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 pt-2">
              <span>Explore Vocabulary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('quiz')}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              Weekly Grammar Quizzes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test your grammar and vocabulary knowledge with interactive multiple-choice quizzes. Get instant explanations for every answer to reinforce correct usage.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 pt-2">
              <span>Take a Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* Student Onboarding & Firebase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Free for College Students
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Track Your English Progress & Save Your AI Feedback
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Create a free account to save all your paragraph submissions, quiz history, and bookmarked vocabulary words securely using Firebase.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab(user ? 'dashboard' : 'auth')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all text-sm"
              >
                {user ? 'Go to My Student Dashboard' : 'Create Student Account'}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
