import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Play, MousePointer } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import Confetti from 'react-confetti';

interface ClickSpeedStats {
  bestScore: number;
  gamesPlayed: number;
  totalClicks: number;
  averageScore: number;
}

interface ClickSpeedGameProps {
  isEmbedded?: boolean;
}

const ClickSpeedGame: React.FC<ClickSpeedGameProps> = ({ isEmbedded = false }) => {
  const [gameStats, setGameStats] = useLocalStorage<ClickSpeedStats>('clickSpeedStats', {
    bestScore: 0,
    gamesPlayed: 0,
    totalClicks: 0,
    averageScore: 0
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [buttonColor, setButtonColor] = useState('from-blue-500 to-purple-500');

  const colors = [
    'from-blue-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-red-500 to-pink-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-blue-500',
    'from-purple-500 to-pink-500'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gameStarted && timeLeft > 0) {
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
  }, [isPlaying, gameStarted, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setGameStarted(false);
    setClickCount(0);
    setTimeLeft(5);
    setShowResult(false);
    setButtonColor(colors[Math.floor(Math.random() * colors.length)]);
    playClickSound();
  };

  const handleClick = () => {
    if (!isPlaying) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    setClickCount(prev => prev + 1);
    setButtonColor(colors[Math.floor(Math.random() * colors.length)]);
    playClickSound();
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameStarted(false);
    setShowResult(true);

    const newStats = {
      ...gameStats,
      gamesPlayed: gameStats.gamesPlayed + 1,
      totalClicks: gameStats.totalClicks + clickCount
    };

    newStats.averageScore = Math.round(newStats.totalClicks / newStats.gamesPlayed * 10) / 10;

    if (clickCount > gameStats.bestScore) {
      newStats.bestScore = clickCount;
      setShowConfetti(true);
      playSuccessSound();
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setGameStats(newStats);
  };

  const getResultMessage = () => {
    if (clickCount >= 30) return '🚀 سرعة البرق!';
    if (clickCount >= 25) return '⚡ سريع جداً!';
    if (clickCount >= 20) return '🔥 سريع!';
    if (clickCount >= 15) return '👍 جيد!';
    if (clickCount >= 10) return '😊 لا بأس!';
    return '😅 حاول مرة أخرى!';
  };

  const getClicksPerSecond = () => {
    return (clickCount / 5).toFixed(1);
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
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {gameStats.bestScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">أفضل نتيجة</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {gameStats.averageScore || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">المتوسط</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {gameStats.gamesPlayed}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">الألعاب</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="text-center space-y-6">
        {/* Timer and Click Counter */}
        {isPlaying && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-100 dark:bg-red-900 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {timeLeft}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400 font-cairo">ثانية</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {clickCount}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 font-cairo">نقرة</div>
            </div>
          </div>
        )}

        {/* Click Button */}
        <div className="flex justify-center">
          {isPlaying ? (
            <motion.button
              onClick={handleClick}
              className={`w-48 h-48 rounded-full bg-gradient-to-br ${buttonColor} text-white text-4xl font-bold shadow-2xl transition-all duration-100`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: gameStarted ? [
                  '0 0 0 0 rgba(59, 130, 246, 0.7)',
                  '0 0 0 20px rgba(59, 130, 246, 0)',
                  '0 0 0 0 rgba(59, 130, 246, 0.7)',
                ] : '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}
              transition={{
                boxShadow: { duration: 0.5, repeat: gameStarted ? Infinity : 0 }
              }}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Zap className="w-12 h-12" />
                <span className="text-lg font-cairo">
                  {!gameStarted ? 'ابدأ!' : 'اضغط!'}
                </span>
              </div>
            </motion.button>
          ) : (
            <button
              onClick={startGame}
              className="flex items-center space-x-3 space-x-reverse px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-colors duration-200 font-cairo text-xl"
            >
              <Play className="w-6 h-6" />
              <span>ابدأ التحدي</span>
            </button>
          )}
        </div>

        {/* Instructions */}
        {isPlaying && !gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-100 dark:bg-blue-900 rounded-xl p-4"
          >
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2 font-cairo">
              جاهز؟
            </h3>
            <p className="text-blue-600 dark:text-blue-400 font-cairo">
              اضغط على الزر أكبر عدد ممكن من المرات خلال 5 ثوانٍ!
            </p>
          </motion.div>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl p-6 text-center"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 font-cairo">
                انتهت اللعبة!
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {clickCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">نقرة</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {getClicksPerSecond()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">نقرة/ثانية</div>
                </div>
              </div>
              
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 font-cairo">
                {getResultMessage()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!isPlaying && !showResult && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-cairo">
          اختبر سرعة ردة فعلك!<br/>
          اضغط على الزر أكبر عدد ممكن من المرات خلال 5 ثوانٍ
        </div>
      )}
    </div>
  );
};

export default ClickSpeedGame;