import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Brain, 
  BookOpen, 
  Calculator, 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff,
  Gamepad2,
  Grid3X3,
  Zap
} from 'lucide-react';
import GuessNumberGame from './GuessNumberGame';
import MemoryCardsGame from './MemoryCardsGame';
import WordPuzzleGame from './WordPuzzleGame';
import TicTacToeGame from './TicTacToeGame';
import ClickSpeedGame from './ClickSpeedGame';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound } from '../utils/soundUtils';

interface GameSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  gameId: string;
}

const GameSection: React.FC<GameSectionProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  children, 
  gameId 
}) => {
  const [isVisible, setIsVisible] = useLocalStorage(`game-${gameId}-visible`, true);
  const [isExpanded, setIsExpanded] = useLocalStorage(`game-${gameId}-expanded`, false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    playClickSound();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    playClickSound();
  };

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-3 md:p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className={`w-8 h-8 md:w-10 md:h-10 ${color} rounded-lg flex items-center justify-center text-white`}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-gray-400 dark:text-gray-500 font-cairo">
                {title} (مخفية)
              </h3>
            </div>
          </div>
          <button
            onClick={toggleVisibility}
            className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <Eye className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-cairo">إظهار</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className={`${color} p-4 md:p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold font-cairo">{title}</h3>
              <p className="text-white/80 text-xs md:text-sm font-cairo hidden md:block">{description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={toggleExpanded}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title={isExpanded ? "إخفاء اللعبة" : "إظهار اللعبة"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={toggleVisibility}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="إخفاء القسم"
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action Bar */}
      {!isExpanded && (
        <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">
              اضغط لفتح اللعبة والبدء في التحدي
            </span>
            <button
              onClick={toggleExpanded}
              className={`px-3 py-2 ${color} text-white rounded-lg hover:opacity-90 transition-opacity duration-200 text-xs md:text-sm font-cairo`}
            >
              ابدأ اللعب
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const GamesSection: React.FC = () => {
  const [allGamesVisible, setAllGamesVisible] = useLocalStorage('all-games-visible', true);

  const toggleAllGames = () => {
    setAllGamesVisible(!allGamesVisible);
    playClickSound();
  };

  if (!allGamesVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
          <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
            قسم الألعاب مخفي
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6 font-cairo">
            يمكنك إظهار جميع الألعاب التفاعلية
          </p>
          <button
            onClick={toggleAllGames}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-cairo"
          >
            إظهار الألعاب
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3 space-x-reverse mb-4"
        >
          <Gamepad2 className="w-8 h-8 text-primary-500" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
            الألعاب التفاعلية
          </h2>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 font-cairo mb-6">
          مجموعة من الألعاب المسلية لتنمية المهارات الذهنية والتفكير
        </p>
        
        <button
          onClick={toggleAllGames}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg transition-colors duration-200 text-sm font-cairo"
        >
          إخفاء جميع الألعاب
        </button>
      </div>

      {/* Games Grid */}
      <div className="space-y-6">
        <GameSection
          gameId="number-guessing"
          title="لعبة التخمين"
          description="خمن الرقم السري بين 1 و 50 في أقل محاولات"
          icon={<Target className="w-6 h-6" />}
          color="bg-gradient-to-r from-blue-500 to-indigo-500"
        >
          <GuessNumberGame />
        </GameSection>

        <GameSection
          gameId="word-puzzle"
          title="لعبة الكلمة المفقودة"
          description="أكمل الكلمات الناقصة بالحرف الصحيح"
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
        >
          <WordPuzzleGame />
        </GameSection>

        <GameSection
          gameId="tic-tac-toe"
          title="لعبة XO"
          description="العب ضد الكمبيوتر في اللعبة الكلاسيكية"
          icon={<Grid3X3 className="w-6 h-6" />}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        >
          <TicTacToeGame />
        </GameSection>

        <GameSection
          gameId="memory-cards"
          title="لعبة الذاكرة"
          description="اعثر على الأزواج المتطابقة في البطاقات المقلوبة"
          icon={<Brain className="w-6 h-6" />}
          color="bg-gradient-to-r from-indigo-500 to-purple-500"
        >
          <MemoryCardsGame />
        </GameSection>

        <GameSection
          gameId="click-speed"
          title="لعبة أسرع ضغط"
          description="اختبر سرعة ردة فعلك في 5 ثوانٍ"
          icon={<Zap className="w-6 h-6" />}
          color="bg-gradient-to-r from-orange-500 to-red-500"
        >
          <ClickSpeedGame />
        </GameSection>
      </div>

      {/* Games Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-3xl p-8 text-center border border-blue-100/50 dark:border-blue-800/20 shadow-sm"
      >
        <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🎮
          </motion.div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-cairo">
            مركز الألعاب البسيطة والممتعة
          </h3>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨
          </motion.div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-base font-cairo mb-4 leading-relaxed">
          استمتع بمجموعة بسيطة من الألعاب الممتعة والسهلة للجميع
        </p>
        <div className="flex items-center justify-center space-x-6 space-x-reverse text-sm">
          <div className="flex items-center space-x-2 space-x-reverse text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-cairo">5 ألعاب متنوعة</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-purple-600 dark:text-purple-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="font-cairo">حفظ تلقائي للنتائج</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-pink-600 dark:text-pink-400">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="font-cairo">ألعاب سهلة وممتعة</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamesSection;