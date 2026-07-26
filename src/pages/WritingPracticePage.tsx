import React, { useState, useEffect } from 'react';
import { PageTab, FeedbackResult, UserProfile } from '../types';
import { requestAIFeedback } from '../services/aiService';
import { saveWritingSubmission } from '../services/firebaseService';
import { 
  PenTool, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  ArrowRight,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';

interface WritingPracticePageProps {
  setActiveTab: (tab: PageTab) => void;
  user: any;
  userProfile: UserProfile | null;
}

export const WritingPracticePage: React.FC<WritingPracticePageProps> = ({
  setActiveTab,
  user,
  userProfile,
}) => {
  const promptOptions = [
    { title: 'Discussion Forum Response', description: 'Practice expressing an academic opinion on a class topic.' },
    { title: 'College Application Essay', description: 'Write a compelling personal statement paragraph.' },
    { title: 'Email to Department Professor', description: 'Practice formal, respectful academic correspondence.' },
    { title: 'Argumentative Essay Topic', description: 'Construct a structured argument with thesis support.' },
    { title: 'Free Topic Paragraph', description: 'Write freely about any topic or daily event.' },
  ];

  const [selectedPrompt, setSelectedPrompt] = useState(promptOptions[0].title);
  const [inputText, setInputText] = useState('');
  const [targetLevel, setTargetLevel] = useState(userProfile?.targetLevel || 'Intermediate');
  const [practiceMode, setPracticeMode] = useState<'Writing' | 'Speaking'>('Writing');

  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported by your browser. Please type your paragraph.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setPracticeMode('Speaking');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly clearer pace
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please write or speak a paragraph before requesting feedback.');
      return;
    }

    setErrorMsg(null);
    setAnalyzing(true);
    setFeedback(null);
    setSaveSuccess(false);

    try {
      const result = await requestAIFeedback({
        text: inputText,
        promptTitle: selectedPrompt,
        mode: practiceMode,
        targetLevel: targetLevel,
      });

      setFeedback(result);

      // Auto save to Firestore if user logged in
      if (user) {
        try {
          await saveWritingSubmission({
            userId: user.uid,
            title: `${selectedPrompt} Practice`,
            promptTitle: selectedPrompt,
            text: inputText,
            overallScore: result.overallScore,
            scores: result.scores,
            improvedText: result.improvedText,
            summary: result.summary,
            corrections: result.corrections,
            vocabSuggestions: result.vocabSuggestions,
            createdAt: new Date().toISOString(),
          });
          setSaveSuccess(true);
        } catch (err) {
          console.error('Auto save error:', err);
        }
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'Failed to analyze writing. Please check your network or try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualSave = async () => {
    if (!feedback || !user) return;
    setIsSaving(true);
    try {
      await saveWritingSubmission({
        userId: user.uid,
        title: `${selectedPrompt} Practice`,
        promptTitle: selectedPrompt,
        text: inputText,
        overallScore: feedback.overallScore,
        scores: feedback.scores,
        improvedText: feedback.improvedText,
        summary: feedback.summary,
        corrections: feedback.corrections,
        vocabSuggestions: feedback.vocabSuggestions,
        createdAt: new Date().toISOString(),
      });
      setSaveSuccess(true);
    } catch (err) {
      console.error('Manual save error:', err);
      alert('Failed to save submission.');
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
          <PenTool className="w-4 h-4" />
          <span>Interactive AI Coach</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          English Writing & Speaking Practice
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Write or speak a paragraph on any prompt. Our AI evaluates grammar, spelling, vocabulary, sentence structure, and fluency, providing clear explanations in simple English and suggesting an elevated rewrite.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Input Settings & Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            
            {/* Prompt Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Practice Prompt Context
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {promptOptions.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setSelectedPrompt(p.title)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPrompt === p.title
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <p className="text-xs">{p.title}</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Level & Mode options */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Proficiency Level</label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Beginner">Beginner (Simple Explanations)</option>
                  <option value="Intermediate">Intermediate (Standard College ESL)</option>
                  <option value="Advanced">Advanced (Academic & Professional)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Practice Focus</label>
                <select
                  value={practiceMode}
                  onChange={(e) => setPracticeMode(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Writing">Writing & Academic Grammar</option>
                  <option value="Speaking">Speaking & Conversational Fluency</option>
                </select>
              </div>
            </div>

            {/* Paragraph Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Your Paragraph Draft
                </label>
                
                {/* Speech to text toggle */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Speech Recording...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Speech-to-Text Mode</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-4 sm:p-6 shadow-inner relative space-y-2">
                <textarea
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type or paste your paragraph here (or click Speech-to-Text to record speaking)... E.g., 'In my opinion, studying in group is better because we can exchange idea and help each other...'"
                  className="w-full resize-none border-none focus:ring-0 text-base leading-relaxed text-slate-800 placeholder:text-slate-300 outline-none bg-transparent"
                />
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>{wordCount} words • {charCount} characters</span>
                  {isListening && (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Listening to your speech...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Clear Text
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing || !inputText.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get AI Feedback</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right Info & Stats Rail */}
        <div className="space-y-6">
          {/* Word of the Day Box */}
          <div className="bg-indigo-50/90 rounded-2xl border border-indigo-100 p-5 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Word of the Day</h3>
            <p className="text-xl font-bold text-slate-900">Resilient</p>
            <p className="text-xs italic text-slate-600 font-mono">/rɪˈzɪl.jənt/ • adj</p>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Able to withstand or recover quickly from difficult conditions or academic challenges.
            </p>
            <button 
              type="button"
              onClick={() => setActiveTab('vocabulary')}
              className="mt-2 w-full py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors shadow-2xs"
            >
              SAVE TO VOCAB
            </button>
          </div>

          {/* Quick Stats Rail */}
          <div className="flex flex-col gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Stats</h3>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-600 font-semibold">Weekly Streak</span>
              <span className="text-sm font-bold text-amber-500">🔥 {userProfile?.streakDays || 5} Days</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-600 font-semibold">Target Level</span>
              <span className="text-sm font-bold text-indigo-600">{targetLevel}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-600 font-semibold">Avg. Writing Score</span>
              <span className="text-sm font-bold text-emerald-500">84%</span>
            </div>
          </div>

          {/* Motivational Quote Box */}
          <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-xs text-slate-500 text-center italic leading-relaxed">
            "The only way to learn a language is to speak it poorly until you speak it well."
          </div>
        </div>

      </div>

      {/* AI Feedback Output Results */}
      {feedback && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 sm:p-8 space-y-8 animate-fadeIn">
          
          {/* Header Score summary */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200/80 pb-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5" /> SpeakWise AI Analysis Complete
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Evaluation & Suggestions</h2>
              <p className="text-xs text-slate-600 max-w-xl">{feedback.summary}</p>
            </div>

            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0">
              <div className="text-center">
                <p className="text-3xl font-black text-indigo-600">{feedback.overallScore}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overall Score</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-xs space-y-0.5">
                <p className="text-slate-600 font-medium">Tone: <span className="font-bold text-slate-900">{feedback.toneAnalysis}</span></p>
                <p className="text-slate-600 font-medium">Mistakes found: <span className="font-bold text-slate-900">{feedback.corrections.length}</span></p>
              </div>
            </div>
          </div>

          {/* 5 Sub-score breakdown bars */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Grammar', score: feedback.scores.grammar },
              { label: 'Spelling', score: feedback.scores.spelling },
              { label: 'Vocabulary', score: feedback.scores.vocabulary },
              { label: 'Structure', score: feedback.scores.sentenceStructure },
              { label: 'Fluency', score: feedback.scores.fluency },
            ].map((s) => (
              <div key={s.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="text-slate-900">{s.score}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${s.score}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommended Rewritten Version */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/50 border border-indigo-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Recommended Better Version</h3>
              </div>
              <button
                type="button"
                onClick={() => speakText(feedback.improvedText)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors shadow-2xs"
              >
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>Listen to Native Audio</span>
              </button>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-sans bg-white p-4 rounded-xl border border-indigo-100/90 shadow-2xs">
              "{feedback.improvedText}"
            </p>
          </div>

          {/* Detailed Corrections in Simple English */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Detailed Error Explanations in Simple English
            </h3>

            {feedback.corrections.length > 0 ? (
              <div className="space-y-4">
                {feedback.corrections.map((corr, idx) => {
                  const isCritical = corr.severity === 'critical';
                  return (
                    <div 
                      key={corr.id || idx}
                      className={`p-4 rounded-r-xl border-l-4 space-y-2 shadow-2xs ${
                        isCritical 
                          ? 'bg-red-50/80 border-red-500' 
                          : 'bg-amber-50/80 border-amber-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isCritical ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {corr.category || (isCritical ? 'Grammar Correction' : 'Fluency & Style')}
                        </span>
                        <span className={`text-xs font-semibold ${
                          isCritical ? 'text-red-400' : 'text-amber-500'
                        }`}>
                          {isCritical ? 'Critical' : 'Improvement'}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 mb-1">
                        You wrote: <span className="line-through opacity-60 font-mono">"{corr.originalText}"</span>
                      </p>

                      <p className="text-sm font-bold text-slate-900 mb-2">
                        Suggested: <span className="text-emerald-600 font-bold">"{corr.suggestedText}"</span>
                      </p>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-slate-200/50">
                        {corr.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                🎉 Outstanding job! No significant grammatical or spelling errors were detected in this paragraph.
              </p>
            )}
          </div>

          {/* Vocabulary Upgrade Suggestions */}
          {feedback.vocabSuggestions && feedback.vocabSuggestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold text-slate-900">Academic Vocabulary Upgrades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedback.vocabSuggestions.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-mono">Original: <span className="line-through">{v.originalWord}</span></span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        Upgrade: {v.suggestedWord}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{v.meaning}</p>
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">"{v.exampleSentence}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2">
              {saveSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Saved to Firestore History!
                </span>
              ) : user ? (
                <button
                  type="button"
                  onClick={handleManualSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save to History'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('auth')}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Log in to save this feedback to your student profile
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => { setFeedback(null); setInputText(''); }}
              className="text-xs text-slate-600 font-semibold hover:text-slate-900 hover:underline"
            >
              Start Another Paragraph Practice
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
