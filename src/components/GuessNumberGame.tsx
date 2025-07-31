import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Play, RotateCcw, Lightbulb } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import Confetti from 'react-confetti';

interface GuessGameStats {
  bestAttempts: number;
  gamesPlayed: number;
  totalAttempts: number;
  averageAttempts: number;
}

interface GuessNumberGameProps {
  isEmbedded?: boolean;
}

const GuessNumberGame: React.FC<GuessNumberGameProps> = ({ isEmbedded = false }) => {
  const [gameStats, setGameStats] = useLocalStorage<GuessGameStats>('guessNumberStats', {
    bestAttempts: 0,
    gamesPlayed: 0,
    totalAttempts: 0,
    averageAttempts: 0
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [guessHistory, setGuessHistory] = useState<{guess: number, feedback: string}[]>([]);

  const startGame = () => {
    const newTarget = Math.floor(Math.random() * 50) + 1; // 1-50
    setTargetNumber(newTarget);
    setIsPlaying(true);
    setGuess('');
    setAttempts(0);
    setFeedback('خمن رقم بين 1 و 50! 🎯');
    setGameWon(false);
    setGuessHistory([]);
    playClickSound();
  };

  const makeGuess = () => {
    const guessNumber = parseInt(guess);
    
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 50) {
      setFeedback('يرجى إدخال رقم صحيح بين 1 و 50');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    let newFeedback = '';
    if (guessNumber === targetNumber) {
      newFeedback = `🎉 مبروك! الرقم الصحيح هو ${targetNumber}`;
      setGameWon(true);
      setIsPlaying(false);
      endGame(newAttempts);
      playSuccessSound();
    } else if (guessNumber < targetNumber) {
      newFeedback = `📈 الرقم أكبر من ${guessNumber}`;
      playClickSound();
    } else {
      newFeedback = `📉 الرقم أصغر من ${guessNumber}`;
      playClickSound();
    }
    
    setFeedback(newFeedback);
    setGuessHistory(prev => [...prev, { guess: guessNumber, feedback: newFeedback }]);
    setGuess('');
  };

  const endGame = (finalAttempts: number) => {
    const newStats = {
      ...gameStats,
      gamesPlayed: gameStats.gamesPlayed + 1,
      totalAttempts: gameStats.totalAttempts + finalAttempts
    };

    newStats.averageAttempts = Math.round(newStats.totalAttempts / newStats.gamesPlayed * 10) / 10;

    if (gameStats.bestAttempts === 0 || finalAttempts < gameStats.bestAttempts) {
      newStats.bestAttempts = finalAttempts;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setGameStats(newStats);
  };

  const getHint = () => {
    const guessNumber = parseInt(guess);
    if (isNaN(guessNumber)) return '';
    
    const difference = Math.abs(targetNumber - guessNumber);
    if (difference <= 2) return '🔥 قريب جداً!';
    if (difference <= 5) return '🌡️ دافئ';
    if (difference <= 10) return '❄️ بارد';
    return '🧊 بارد جداً';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isPlaying && guess.trim()) {
      makeGuess();
    }
  };

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {gameStats.bestAttempts || '-'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">أفضل نتيجة</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {gameStats.averageAttempts || '-'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">المتوسط</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {gameStats.gamesPlayed}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">الألعاب</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="text-center space-y-6">
        {/* Attempts Counter */}
        {isPlaying && (
          <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
            المحاولة: {attempts}
          </div>
        )}
        
        {/* Input Field */}
        <div className="space-y-4">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="أدخل رقمك (1-50)"
            disabled={!isPlaying}
            min="1"
            max="50"
            className="w-full px-6 py-4 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
          
          {/* Guess Button */}
          <motion.button
            onClick={makeGuess}
            disabled={!isPlaying || !guess.trim()}
            className={`w-full py-4 rounded-xl font-bold text-white text-xl shadow-lg transition-all duration-200 ${
              isPlaying && guess.trim()
                ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 cursor-pointer' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            whileTap={isPlaying && guess.trim() ? { scale: 0.95 } : {}}
            whileHover={isPlaying && guess.trim() ? { scale: 1.02 } : {}}
          >
            {isPlaying ? 'خمن!' : 'ابدأ اللعبة'}
          </motion.button>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl text-lg font-semibold ${
                gameWon 
                  ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              }`}
            >
              {feedback}
              {isPlaying && guess && !gameWon && (
                <div className="mt-2 text-sm opacity-75">
                  {getHint()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 space-x-reverse">
        <button
          onClick={startGame}
          className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-cairo"
        >
          <Play className="w-5 h-5" />
          <span>{isPlaying ? 'لعبة جديدة' : 'ابدأ'}</span>
        </button>
      </div>

      {/* Game History */}
      {guessHistory.length > 0 && (
        <div className="max-h-40 overflow-y-auto space-y-2">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3 font-cairo">
            سجل المحاولات
          </div>
          {guessHistory.slice(-5).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
            >
              <span className="font-bold">#{index + 1}</span>
              <span>خمنت: {item.guess}</span>
              <span className="text-gray-500">
                {item.feedback.includes('أكبر') ? '📈' : 
                 item.feedback.includes('أصغر') ? '📉' : '🎉'}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Win Message */}
      {gameWon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center space-x-2 space-x-reverse bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 rounded-lg p-4"
        >
          <Trophy className="w-6 h-6" />
          <span className="font-semibold text-lg">
            {attempts <= 3 ? 'ممتاز! 🏆' : 
             attempts <= 6 ? 'جيد جداً! 🥈' : 
             'أحسنت! 🥉'}
          </span>
        </motion.div>
      )}

      {/* Instructions */}
      {!isPlaying && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-cairo">
          خمن الرقم بين 1 و 50 في أقل عدد محاولات!<br/>
          ستحصل على تلميحات لتساعدك في الوصول للرقم الصحيح
        </div>
      )}
    </div>
  );
};

export default GuessNumberGame;