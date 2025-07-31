import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trophy, Play, Clock, Lightbulb } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import Confetti from 'react-confetti';

interface WordPuzzleStats {
  bestTime: number;
  gamesPlayed: number;
  totalCorrect: number;
  currentStreak: number;
}

interface WordData {
  word: string;
  hint: string;
  missingIndex: number;
  options: string[];
}

interface WordPuzzleGameProps {
  isEmbedded?: boolean;
}

const WordPuzzleGame: React.FC<WordPuzzleGameProps> = ({ isEmbedded = false }) => {
  const [gameStats, setGameStats] = useLocalStorage<WordPuzzleStats>('wordPuzzleStats', {
    bestTime: 0,
    gamesPlayed: 0,
    totalCorrect: 0,
    currentStreak: 0
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);

  const words = [
    { word: 'برمجة', hint: 'كتابة الأكواد' },
    { word: 'حاسوب', hint: 'جهاز إلكتروني' },
    { word: 'إنترنت', hint: 'شبكة عالمية' },
    { word: 'تطبيق', hint: 'برنامج للهاتف' },
    { word: 'موقع', hint: 'صفحة على الويب' },
    { word: 'تصميم', hint: 'فن الإبداع' },
    { word: 'تطوير', hint: 'تحسين وبناء' },
    { word: 'شبكة', hint: 'اتصال بين الأجهزة' },
    { word: 'ذكاء', hint: 'تقنية المستقبل' },
    { word: 'تعلم', hint: 'اكتساب المعرفة' },
    { word: 'إبداع', hint: 'التفكير خارج الصندوق' },
    { word: 'نجاح', hint: 'تحقيق الأهداف' },
    { word: 'علم', hint: 'المعرفة والدراسة' },
    { word: 'فكرة', hint: 'خاطرة أو رأي' },
    { word: 'حلم', hint: 'أمنية أو هدف' },
    { word: 'أمل', hint: 'توقع إيجابي' },
    { word: 'جهد', hint: 'عمل وتعب' },
    { word: 'وقت', hint: 'الزمن والساعات' },
    { word: 'مال', hint: 'النقود والثروة' },
    { word: 'بيت', hint: 'المنزل والسكن' }
  ];

  const arabicLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const generateWordPuzzle = (): WordData => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const missingIndex = Math.floor(Math.random() * randomWord.word.length);
    const correctLetter = randomWord.word[missingIndex];
    
    // Generate wrong options
    const wrongLetters = arabicLetters.filter(letter => letter !== correctLetter);
    const shuffledWrong = wrongLetters.sort(() => Math.random() - 0.5).slice(0, 3);
    
    const options = [correctLetter, ...shuffledWrong].sort(() => Math.random() - 0.5);

    return {
      word: randomWord.word,
      hint: randomWord.hint,
      missingIndex,
      options
    };
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setFeedback('');
    setGameStartTime(Date.now());
    generateNewWord();
    playClickSound();
  };

  const generateNewWord = () => {
    const wordPuzzle = generateWordPuzzle();
    setCurrentWord(wordPuzzle);
  };

  const handleAnswer = (selectedLetter: string) => {
    if (!currentWord) return;

    const correctLetter = currentWord.word[currentWord.missingIndex];
    
    if (selectedLetter === correctLetter) {
      setScore(prev => prev + 1);
      setFeedback('🎉 صحيح!');
      playSuccessSound();
      
      setTimeout(() => {
        if (timeLeft > 0) {
          generateNewWord();
          setFeedback('');
        }
      }, 1000);
    } else {
      setFeedback(`❌ خطأ! الحرف الصحيح: ${correctLetter}`);
      playClickSound();
      
      setTimeout(() => {
        if (timeLeft > 0) {
          generateNewWord();
          setFeedback('');
        }
      }, 1500);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    const gameTime = (Date.now() - gameStartTime) / 1000;
    
    const newStats = {
      ...gameStats,
      gamesPlayed: gameStats.gamesPlayed + 1,
      totalCorrect: gameStats.totalCorrect + score
    };

    if (score > 0) {
      const timePerWord = gameTime / score;
      if (gameStats.bestTime === 0 || timePerWord < gameStats.bestTime) {
        newStats.bestTime = Math.round(timePerWord * 10) / 10;
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }

    setGameStats(newStats);
    setFeedback(`🏁 انتهت اللعبة! النتيجة: ${score} كلمة صحيحة`);
  };

  const displayWord = () => {
    if (!currentWord) return '';
    
    return currentWord.word.split('').map((letter, index) => 
      index === currentWord.missingIndex ? '_' : letter
    ).join('');
  };

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={150}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {score}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">النقاط</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {timeLeft}s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">الوقت</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {gameStats.bestTime || '-'}s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">أفضل وقت</div>
        </div>
      </div>

      {/* Game Area */}
      {isPlaying && currentWord && (
        <div className="text-center space-y-6">
          {/* Word Display */}
          <div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 rounded-xl p-6">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 font-cairo tracking-wider mb-4">
              {displayWord()}
            </div>
            <div className="flex items-center justify-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-400">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-cairo">تلميح: {currentWord.hint}</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentWord.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                className="py-4 px-6 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 hover:from-green-200 hover:to-teal-200 dark:hover:from-green-800 dark:hover:to-teal-800 text-gray-800 dark:text-gray-200 rounded-xl transition-all duration-200 font-bold text-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`text-center p-4 rounded-xl font-semibold ${
              feedback.includes('صحيح') 
                ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                : feedback.includes('خطأ')
                ? 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            }`}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center">
        <button
          onClick={startGame}
          className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-cairo"
        >
          <Play className="w-5 h-5" />
          <span>{isPlaying ? 'لعبة جديدة' : 'ابدأ اللعب'}</span>
        </button>
      </div>

      {/* Instructions */}
      {!isPlaying && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-cairo">
          اختر الحرف الصحيح لتكملة الكلمة!<br/>
          لديك 30 ثانية لحل أكبر عدد من الكلمات
        </div>
      )}
    </div>
  );
};

export default WordPuzzleGame;