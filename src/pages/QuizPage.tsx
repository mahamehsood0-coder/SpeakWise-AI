import React, { useState } from 'react';
import { PageTab, QuizQuestion, QuizResult } from '../types';
import { generateDynamicQuiz } from '../services/aiService';
import { saveQuizResult } from '../services/firebaseService';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  RefreshCw, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface QuizPageProps {
  setActiveTab: (tab: PageTab) => void;
  user: any;
}

export const QuizPage: React.FC<QuizPageProps> = ({ setActiveTab, user }) => {
  const presetQuizzes: { title: string; category: string; questions: QuizQuestion[] }[] = [
    {
      title: 'Weekly College Grammar & Subject-Verb Agreement',
      category: 'Grammar',
      questions: [
        {
          id: 1,
          question: 'Choose the sentence with correct subject-verb agreement for academic writing:',
          options: [
            'Neither the professor nor the students was aware of the schedule change.',
            'Neither the professor nor the students were aware of the schedule change.',
            'Neither the professor nor the students is aware of the schedule change.',
            'Neither the professor nor the students has been aware of the schedule change.'
          ],
          correctAnswer: 1,
          explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("students", which is plural, so "were" is correct).',
          category: 'Grammar',
          ruleSnippet: 'Rule: With "neither/nor", match verb plural/singular to the nearest noun.'
        },
        {
          id: 2,
          question: 'Which connector best completes the formal sentence: "The study yielded promising results; __________, further trials are required."',
          options: ['moreover', 'nevertheless', 'consequently', 'for instance'],
          correctAnswer: 1,
          explanation: '"Nevertheless" expresses contrast (despite promising results, more trials are needed).',
          category: 'Vocabulary',
          ruleSnippet: 'Rule: Use "nevertheless" to introduce a contrast or caveat.'
        },
        {
          id: 3,
          question: 'Identify the sentence that avoids a run-on error:',
          options: [
            'The library was closed, we studied at the coffee shop instead.',
            'The library was closed we studied at the coffee shop instead.',
            'Because the library was closed, we studied at the coffee shop instead.',
            'The library was closed; however we studied at the coffee shop instead.'
          ],
          correctAnswer: 2,
          explanation: 'Option 3 correctly uses a dependent clause ("Because...") followed by a comma to join the main clause cleanly.',
          category: 'Sentence Structure',
          ruleSnippet: 'Rule: Avoid comma splices by using subordinating conjunctions or semicolons.'
        },
        {
          id: 4,
          question: 'Select the sentence with correct verb tense consistency:',
          options: [
            'She entered the lecture hall and opens her notebook.',
            'She entered the lecture hall and opened her notebook.',
            'She enters the lecture hall and opened her notebook.',
            'She entering the lecture hall and opens her notebook.'
          ],
          correctAnswer: 1,
          explanation: 'Both verbs ("entered" and "opened") remain in past tense throughout the sentence.',
          category: 'Grammar',
          ruleSnippet: 'Rule: Maintain consistent verb tenses within a narrative sequence.'
        },
        {
          id: 5,
          question: 'Which word is a formal academic synonym for "prove":',
          options: ['substantiate', 'guess', 'guesswork', 'fancy'],
          correctAnswer: 0,
          explanation: '"Substantiate" means to provide evidence to support or prove the truth of something in research.',
          category: 'Vocabulary',
          ruleSnippet: 'Academic Vocab: Substantiate = back up with evidence.'
        }
      ]
    }
  ];

  const [activeQuiz, setActiveQuiz] = useState<{
    title: string;
    category: string;
    questions: QuizQuestion[];
  } | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCategory, setGenerationCategory] = useState('Academic Vocab & Grammar');

  const startQuiz = (quizData: { title: string; category: string; questions: QuizQuestion[] }) => {
    setActiveQuiz(quizData);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  const handleGenerateAIQuiz = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateDynamicQuiz(generationCategory, 'Intermediate');
      startQuiz({
        title: generated.quizTitle || `AI Generated Quiz: ${generationCategory}`,
        category: generated.category || generationCategory,
        questions: generated.questions,
      });
    } catch (err) {
      console.error('Quiz generation error:', err);
      alert('Failed to generate dynamic quiz. Starting weekly preset quiz instead.');
      startQuiz(presetQuizzes[0]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!activeQuiz) return;
    setQuizFinished(true);

    // Calculate score
    let correctCount = 0;
    const answersArray = activeQuiz.questions.map((q, idx) => {
      const selected = selectedAnswers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return { questionIndex: idx, selectedOption: selected, isCorrect };
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);

    if (user) {
      try {
        await saveQuizResult({
          userId: user.uid,
          quizTitle: activeQuiz.title,
          category: activeQuiz.category,
          score: correctCount,
          totalQuestions: activeQuiz.questions.length,
          percentage: percentage,
          answers: answersArray,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Save quiz score error:', err);
      }
    }
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>College Knowledge Check</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Weekly Grammar & Vocabulary Quizzes
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Test your understanding of subject-verb agreement, transition connectors, academic vocabulary, and sentence structure with immediate feedback and detailed explanations.
        </p>
      </div>

      {/* QUIZ SELECTION DASHBOARD (if no active quiz) */}
      {!activeQuiz && (
        <div className="space-y-6">
          
          {/* Dynamic AI Generator Box */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Dynamic AI Quiz Generator
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">Generate Fresh Custom Quiz with Gemini AI</h3>
              <p className="text-xs text-slate-300">Choose a topic to create a new 5-question test tailored to your goals.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <select
                value={generationCategory}
                onChange={(e) => setGenerationCategory(e.target.value)}
                className="w-full sm:w-auto p-2.5 rounded-xl border border-indigo-400/40 bg-indigo-900/60 text-white text-xs font-semibold outline-none"
              >
                <option value="Academic Vocab & Grammar">Academic Vocab & Grammar</option>
                <option value="Transition Connectors & Flow">Transition Connectors & Flow</option>
                <option value="Punctuation & Comma Splices">Punctuation & Comma Splices</option>
                <option value="IELTS / TOEFL Sentence Correction">IELTS / TOEFL Sentence Correction</option>
              </select>

              <button
                onClick={handleGenerateAIQuiz}
                disabled={isGenerating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Quiz Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Quiz Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Curated Weekly Quizzes</h3>
            <div className="grid grid-cols-1 gap-4">
              {presetQuizzes.map((pq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-800">
                      {pq.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{pq.title}</h4>
                    <p className="text-xs text-slate-500">5 Multiple Choice Questions • ~5 Minutes</p>
                  </div>

                  <button
                    onClick={() => startQuiz(pq)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Start Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ACTIVE QUIZ SCREEN */}
      {activeQuiz && !quizFinished && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
          
          {/* Top progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{activeQuiz.title}</span>
              <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
              {activeQuiz.questions[currentQuestionIndex].category} Question
            </span>
            <p className="text-base font-bold text-slate-900 leading-snug">
              {activeQuiz.questions[currentQuestionIndex].question}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50/80 text-sky-950 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Action Control */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveQuiz(null)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Exit Quiz
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs disabled:opacity-50 transition-all"
            >
              <span>{currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* QUIZ FINISHED REVIEW SCREEN */}
      {activeQuiz && quizFinished && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-3 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Quiz Complete!</h2>
            <p className="text-3xl font-black text-sky-600">
              {calculateScore()} / {activeQuiz.questions.length} Correct ({Math.round((calculateScore() / activeQuiz.questions.length) * 100)}%)
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Review simple explanations for every question below to lock in your learning.
            </p>
          </div>

          {/* Question Explanations Review */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Answer Breakdown & Explanations</h3>

            {activeQuiz.questions.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              const isCorrect = selected === q.correctAnswer;
              return (
                <div 
                  key={q.id || qIdx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Question {qIdx + 1}</span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900">{q.question}</p>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-600">You chose: <span className="font-semibold">{q.options[selected]}</span></p>
                    {!isCorrect && (
                      <p className="text-emerald-800 font-semibold">Correct choice: {q.options[q.correctAnswer]}</p>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">Explanation:</span>
                    <p>{q.explanation}</p>
                    {q.ruleSnippet && (
                      <p className="text-[11px] font-mono text-indigo-700 bg-indigo-50 p-1.5 rounded mt-1">
                        {q.ruleSnippet}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
            >
              Back to Quiz List
            </button>

            <button
              onClick={() => startQuiz(activeQuiz)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake This Quiz</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
