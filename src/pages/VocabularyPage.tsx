import React, { useState, useEffect } from 'react';
import { PageTab, WordOfDay, SavedWord } from '../types';
import { fetchWordOfTheDay } from '../services/aiService';
import { 
  saveWordToFirestore, 
  getSavedWordsFromFirestore, 
  deleteSavedWordFromFirestore 
} from '../services/firebaseService';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  RotateCw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Layers,
  GraduationCap
} from 'lucide-react';

interface VocabularyPageProps {
  setActiveTab: (tab: PageTab) => void;
  user: any;
}

export const VocabularyPage: React.FC<VocabularyPageProps> = ({ setActiveTab, user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'flashcards' | 'saved'>('catalog');
  const [wordOfDay, setWordOfDay] = useState<WordOfDay | null>(null);
  const [loadingWod, setLoadingWod] = useState(true);

  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [savingWord, setSavingWord] = useState(false);
  const [isWodSaved, setIsWodSaved] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Flashcard state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const curatedWordsList = [
    {
      word: 'Corroborate',
      phonetic: '/kəˈrɑː.bə.reɪt/',
      partOfSpeech: 'verb',
      definition: 'To confirm or give support to a statement, theory, or finding with evidence.',
      exampleSentence: 'The experimental data corroborates the hypothesis proposed in the original paper.',
      category: 'Academic Writing',
      speakingTip: 'Use when agreeing with a peer in class: "This study corroborates what Alex mentioned..."'
    },
    {
      word: 'Elucidate',
      phonetic: '/iˈluː.sə.deɪt/',
      partOfSpeech: 'verb',
      definition: 'To make something clear or explain thoroughly.',
      exampleSentence: 'The professor asked the presenter to elucidate the methodology section.',
      category: 'Academic Writing',
      speakingTip: 'Great for asking questions: "Could you elucidate on the third variable?"'
    },
    {
      word: 'Pragmatic',
      phonetic: '/præɡˈmæt.ɪk/',
      partOfSpeech: 'adjective',
      definition: 'Dealing with things sensibly and realistically in a way that is based on practical considerations.',
      exampleSentence: 'Adopting a pragmatic approach to project deadlines allowed the team to deliver on time.',
      category: 'College Essentials',
      speakingTip: 'Stress the second syllable "MAT".'
    },
    {
      word: 'Notwithstanding',
      phonetic: '/ˌnɑːt.wɪθˈstæn.dɪŋ/',
      partOfSpeech: 'preposition / adverb',
      definition: 'In spite of; despite the fact.',
      exampleSentence: 'Notwithstanding the inclement weather, attendance at the guest lecture was exceptionally high.',
      category: 'Speaking & Discussion Connectors',
      speakingTip: 'Useful transition in formal debates or essay conclusions.'
    },
    {
      word: 'Expedite',
      phonetic: '/ˈek.spə.daɪt/',
      partOfSpeech: 'verb',
      definition: 'To make an action or process happen more quickly.',
      exampleSentence: 'I am writing to inquire if we can expedite the grading of my transfer credits.',
      category: 'Formal Emails & Professors',
      speakingTip: 'Professional verb to use when asking for urgent email assistance.'
    },
    {
      word: 'Inadvertent',
      phonetic: '/ˌɪn.ədˈvɝː.t̬ənt/',
      partOfSpeech: 'adjective',
      definition: 'Not resulting from or achieved through deliberate planning; unintentional.',
      exampleSentence: 'The exclusion of the survey data was an inadvertent error during file merging.',
      category: 'College Essentials',
      speakingTip: 'Polite way to explain a minor mistake without taking full fault.'
    }
  ];

  useEffect(() => {
    async function loadWod() {
      setLoadingWod(true);
      try {
        const wod = await fetchWordOfTheDay();
        setWordOfDay(wod);
      } catch (err) {
        console.error('Error fetching word of the day:', err);
      } finally {
        setLoadingWod(false);
      }
    }
    loadWod();
  }, []);

  useEffect(() => {
    async function loadSaved() {
      if (!user) return;
      try {
        const list = await getSavedWordsFromFirestore(user.uid);
        setSavedWords(list);
      } catch (err) {
        console.error('Error loading saved words:', err);
      }
    }
    loadSaved();
  }, [user]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBookmarkWod = async () => {
    if (!wordOfDay || !user) {
      if (!user) setActiveTab('auth');
      return;
    }
    setSavingWord(true);
    try {
      await saveWordToFirestore({
        userId: user.uid,
        word: wordOfDay.word,
        phonetic: wordOfDay.phonetic,
        partOfSpeech: wordOfDay.partOfSpeech,
        definition: wordOfDay.definition,
        exampleSentence: wordOfDay.exampleSentence,
        category: 'Word of the Day',
        createdAt: new Date().toISOString(),
      });
      setIsWodSaved(true);
      // reload saved words
      const list = await getSavedWordsFromFirestore(user.uid);
      setSavedWords(list);
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setSavingWord(false);
    }
  };

  const handleSaveCurated = async (w: typeof curatedWordsList[0]) => {
    if (!user) {
      setActiveTab('auth');
      return;
    }
    try {
      await saveWordToFirestore({
        userId: user.uid,
        word: w.word,
        phonetic: w.phonetic,
        partOfSpeech: w.partOfSpeech,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        category: w.category,
        createdAt: new Date().toISOString(),
      });
      const list = await getSavedWordsFromFirestore(user.uid);
      setSavedWords(list);
    } catch (err) {
      console.error('Save curated error:', err);
    }
  };

  const handleDeleteSaved = async (docId: string) => {
    try {
      await deleteSavedWordFromFirestore(docId);
      setSavedWords((prev) => prev.filter((w) => w.id !== docId));
    } catch (err) {
      console.error('Delete word error:', err);
    }
  };

  const filteredWords = curatedWordsList.filter((w) => {
    const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Academic Writing', 'Formal Emails & Professors', 'Speaking & Discussion Connectors', 'College Essentials'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Academic Vocabulary Builder</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Vocabulary & Word of the Day
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Elevate your academic vocabulary for college essays, presentations, and formal emails. Study daily words, flashcards, and save terms to your personal Firestore collection.
        </p>
      </div>

      {/* Featured Word of the Day Card */}
      {wordOfDay && (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Daily Spotlight • Word of the Day
            </span>

            <button
              onClick={handleBookmarkWod}
              disabled={savingWord || isWodSaved}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                isWodSaved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-indigo-950 hover:bg-slate-100'
              }`}
            >
              {isWodSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Bookmarked in Firestore</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>{savingWord ? 'Saving...' : 'Bookmark Word'}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{wordOfDay.word}</h2>
                <button
                  onClick={() => speakText(wordOfDay.word)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm font-mono text-indigo-300">
                {wordOfDay.phonetic} • <span className="italic">{wordOfDay.partOfSpeech}</span>
              </p>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {wordOfDay.definition}
              </p>
            </div>

            <div className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">College Example Sentence:</span>
              <p className="text-xs text-white italic leading-relaxed">"{wordOfDay.exampleSentence}"</p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
                <span className="font-bold text-indigo-200">Speaking Tip:</span> {wordOfDay.speakingTip}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'catalog'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>College Word Catalog</span>
        </button>

        <button
          onClick={() => setActiveSubTab('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'flashcards'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Interactive Flashcards</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My Saved Words ({savedWords.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: CATALOG MODE */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((w, idx) => {
              const isSaved = savedWords.some((sw) => sw.word.toLowerCase() === w.word.toLowerCase());
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{w.word}</h3>
                        <button
                          onClick={() => speakText(w.word)}
                          className="p-1 rounded-full text-indigo-600 hover:bg-indigo-50"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">{w.phonetic} • <span className="italic">{w.partOfSpeech}</span></p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800">
                        {w.category}
                      </span>
                      <button
                        onClick={() => handleSaveCurated(w)}
                        disabled={isSaved}
                        className={`text-xs flex items-center gap-1 mt-1 font-semibold ${
                          isSaved ? 'text-emerald-600' : 'text-slate-500 hover:text-indigo-600'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{w.definition}</p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Example:</span>
                    <p className="italic text-slate-800">"{w.exampleSentence}"</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: FLASHCARDS MODE */}
      {activeSubTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span>Flashcard {currentFlashcardIndex + 1} of {curatedWordsList.length}</span>
            <span>Click card to flip</span>
          </div>

          {/* Flashcard container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[280px] bg-white rounded-3xl border-2 border-indigo-200 shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-indigo-400 select-none relative"
          >
            <span className="absolute top-4 right-4 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {curatedWordsList[currentFlashcardIndex].category}
            </span>

            {!isFlipped ? (
              <div className="space-y-3">
                <h3 className="text-4xl font-extrabold text-slate-900">
                  {curatedWordsList[currentFlashcardIndex].word}
                </h3>
                <p className="text-sm font-mono text-slate-500">
                  {curatedWordsList[currentFlashcardIndex].phonetic}
                </p>
                <p className="text-xs text-indigo-600 font-semibold pt-4">🔄 Tap to reveal definition & example</p>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Definition:</span>
                <p className="text-base text-slate-800 font-semibold leading-relaxed">
                  {curatedWordsList[currentFlashcardIndex].definition}
                </p>
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-indigo-900 block">Example Sentence:</span>
                  <p className="italic text-slate-700 mt-0.5">"{curatedWordsList[currentFlashcardIndex].exampleSentence}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentFlashcardIndex((prev) => (prev > 0 ? prev - 1 : curatedWordsList.length - 1));
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
            >
              Previous Word
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentFlashcardIndex((prev) => (prev < curatedWordsList.length - 1 ? prev + 1 : 0));
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
            >
              Next Flashcard
            </button>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: SAVED WORDS FROM FIRESTORE */}
      {activeSubTab === 'saved' && (
        <div className="space-y-6">
          {!user ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Bookmark className="w-10 h-10 text-indigo-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Sign in to sync saved words</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Create a student account to store your custom vocabulary notebook in Firestore across all devices.
              </p>
              <button
                onClick={() => setActiveTab('auth')}
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl"
              >
                Sign In or Register
              </button>
            </div>
          ) : savedWords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedWords.map((sw) => (
                <div key={sw.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{sw.word}</h3>
                        <button
                          onClick={() => speakText(sw.word)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-full"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">{sw.phonetic} • <span className="italic">{sw.partOfSpeech}</span></p>
                    </div>

                    <button
                      onClick={() => sw.id && handleDeleteSaved(sw.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete from saved words"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">{sw.definition}</p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Example:</span>
                    <p className="italic text-slate-800">"{sw.exampleSentence}"</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No saved words in your notebook yet</p>
              <p className="text-[11px] text-slate-500">Explore the word catalog above or daily spotlight and click 'Save' to add them here.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
