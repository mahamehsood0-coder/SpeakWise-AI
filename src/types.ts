export type PageTab = 
  | 'home'
  | 'auth'
  | 'dashboard'
  | 'writing'
  | 'vocabulary'
  | 'quiz'
  | 'progress'
  | 'profile';

export type UserLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LearningGoal = 
  | 'Academic Essays & College Writing'
  | 'Speaking & Fluency for Presentations'
  | 'Grammar & Professional Emails'
  | 'IELTS / TOEFL Prep'
  | 'General Everyday English';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  targetGoal: LearningGoal;
  targetLevel: UserLevel;
  streakDays: number;
  lastActiveDate?: string;
  totalWritingSubmissions: number;
  totalQuizzesTaken: number;
  createdAt: string;
}

export interface CorrectionItem {
  id: string;
  originalText: string;
  suggestedText: string;
  category: 'Grammar' | 'Spelling' | 'Vocabulary' | 'Sentence Structure' | 'Fluency' | 'Punctuation';
  explanation: string;
  severity: 'minor' | 'important' | 'critical';
}

export interface VocabSuggestion {
  originalWord: string;
  suggestedWord: string;
  meaning: string;
  exampleSentence: string;
}

export interface FeedbackResult {
  overallScore: number; // 0 to 100
  scores: {
    grammar: number;
    spelling: number;
    vocabulary: number;
    sentenceStructure: number;
    fluency: number;
  };
  summary: string; // Encouraging summary
  improvedText: string; // Better version
  corrections: CorrectionItem[];
  vocabSuggestions: VocabSuggestion[];
  keyTakeaways: string[];
  toneAnalysis: string;
}

export interface WritingSubmission {
  id?: string;
  userId: string;
  title: string;
  text: string;
  promptTitle?: string;
  overallScore: number;
  scores: {
    grammar: number;
    spelling: number;
    vocabulary: number;
    sentenceStructure: number;
    fluency: number;
  };
  improvedText: string;
  summary: string;
  corrections: CorrectionItem[];
  vocabSuggestions?: VocabSuggestion[];
  createdAt: string;
}

export interface QuizQuestion {
  id: number | string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  category: 'Grammar' | 'Vocabulary' | 'Sentence Structure' | 'Punctuation';
  ruleSnippet?: string;
}

export interface QuizResult {
  id?: string;
  userId: string;
  quizTitle: string;
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: { questionIndex: number; selectedOption: number; isCorrect: boolean }[];
  createdAt: string;
}

export interface WordOfDay {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  academicContext: string;
  synonyms: string[];
  speakingTip: string;
}

export interface SavedWord {
  id?: string;
  userId: string;
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition: string;
  exampleSentence: string;
  category: string;
  notes?: string;
  mastered?: boolean;
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}
