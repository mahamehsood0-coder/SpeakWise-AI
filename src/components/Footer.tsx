import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { PageTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">
                SpeakWise<span className="text-indigo-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering college students worldwide with instant AI feedback on English speaking and academic writing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('writing')} className="hover:text-indigo-400 transition-colors">
                  AI Paragraph Feedback
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vocabulary')} className="hover:text-indigo-400 transition-colors">
                  Word of the Day & Vocab
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('quiz')} className="hover:text-indigo-400 transition-colors">
                  Grammar & Vocab Quizzes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('progress')} className="hover:text-indigo-400 transition-colors">
                  Progress Analytics
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">College Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Academic Essay Templates</li>
              <li>Emailing Professors Guide</li>
              <li>Discussion Post Starters</li>
              <li>IELTS & TOEFL Vocabulary</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">AI Engine</h4>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              Powered by Google Gemini 2.5 Flash API for high-accuracy grammar, vocabulary, and natural fluency tutoring.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-md text-[11px] font-medium text-indigo-300 border border-slate-700">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Gemini AI Powered
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SpeakWise AI. Designed for College ESL & Academic Writing Success.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for English Learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
