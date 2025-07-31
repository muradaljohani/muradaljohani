import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Share2, Copy, Volume2, Zap, Heart, Star } from 'lucide-react';
import { inspirationalQuotes, programmingTips, arabicLearningSites, arabicEducationalVideos, techFacts, wisdomQuotes } from '../data/quotes';
import { Quote } from '../types';
import { playInspirationSound, playInspirationSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

const InspirationButton: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [contentType, setContentType] = useState<'quotes' | 'programming' | 'sites' | 'videos' | 'tech' | 'wisdom'>('quotes');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // نصوص متنوعة للزر
  const buttonTexts = [
    "ألهمني",
    "أعطني فكرة جديدة", 
    "شيء جديد اليوم",
    "فاجئني بمعرفة",
    "أريد إلهام جديد",
    "اكتشف شيئاً مميزاً",
    "نصيحة اليوم",
    "معلومة مثيرة",
    "حكمة جديدة",
    "شيء يلهمني"
  ];

  // ألوان متنوعة للزر
  const buttonColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-pink-500 to-rose-600', 
    'from-orange-500 to-red-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-teal-500 to-cyan-600',
    'from-amber-500 to-orange-600'
  ];

  const getContentArray = () => {
    switch (contentType) {
      case 'programming':
        return programmingTips;
      case 'sites':
        return arabicLearningSites;
      case 'videos':
        return arabicEducationalVideos;
      case 'tech':
        return techFacts;
      case 'wisdom':
        return wisdomQuotes;
      default:
        return inspirationalQuotes;
    }
  };

  const getContentTitle = () => {
    switch (contentType) {
      case 'programming':
        return 'نصيحة برمجية';
      case 'sites':
        return 'موقع تعليمي';
      case 'videos':
        return 'قناة تعليمية';
      case 'tech':
        return 'معلومة تقنية';
      case 'wisdom':
        return 'حكمة ملهمة';
      default:
        return 'اقتباس ملهم';
    }
  };

  const getRandomQuote = () => {
    playInspirationSound();
    setIsAnimating(true);
    setClickCount(prev => prev + 1);
    setCurrentTextIndex(prev => (prev + 1) % buttonTexts.length);
    setIsPressed(true);
    
    setTimeout(() => {
      const contentArray = getContentArray();
      const randomIndex = Math.floor(Math.random() * contentArray.length);
      setCurrentQuote(contentArray[randomIndex]);
      setIsAnimating(false);
      setIsPressed(false);
      playInspirationSuccessSound();
    }, 300);
  };

  // معالج السحب (Swipe)
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // تغيير نوع المحتوى حسب اتجاه السحب
    if (direction === 'right') {
      const types = ['quotes', 'programming', 'sites', 'videos', 'tech', 'wisdom'] as const;
      const currentIndex = types.indexOf(contentType);
      const nextIndex = (currentIndex + 1) % types.length;
      setContentType(types[nextIndex]);
    } else {
      const types = ['quotes', 'programming', 'sites', 'videos', 'tech', 'wisdom'] as const;
      const currentIndex = types.indexOf(contentType);
      const prevIndex = currentIndex === 0 ? types.length - 1 : currentIndex - 1;
      setContentType(types[prevIndex]);
    }
    
    getRandomQuote();
    
    setTimeout(() => {
      setSwipeDirection(null);
    }, 500);
  };

  const copyQuote = () => {
    if (currentQuote) {
      navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
      toast.success('تم نسخ الاقتباس!');
      playInspirationSound();
    }
  };

  const shareOnTwitter = () => {
    if (currentQuote) {
      const text = encodeURIComponent(`"${currentQuote.text}" - ${currentQuote.author}`);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      playInspirationSound();
    }
  };

  const shareOnWhatsApp = () => {
    if (currentQuote) {
      const text = encodeURIComponent(`"${currentQuote.text}" - ${currentQuote.author}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
      playInspirationSound();
    }
  };

  const readAloud = () => {
    if (currentQuote && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuote.text);
      utterance.lang = 'ar';
      speechSynthesis.speak(utterance);
      playInspirationSound();
    }
  };

  return (
    <div className="text-center space-y-8">
      <div className="relative">
        {/* Main enhanced button */}
        <motion.button
          onClick={getRandomQuote}
          className="relative group overflow-hidden cursor-pointer"
          whileHover={{ 
            scale: 1.05,
            rotate: [0, -1, 1, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ 
            scale: 0.95,
            rotate: [0, -2, 2, -1, 1, 0],
            transition: { duration: 0.4 }
          }}
          animate={isAnimating ? {
            x: [0, -10, 10, -5, 5, 0],
            y: [0, -5, 5, -2, 2, 0],
            rotate: [0, -3, 3, -2, 2, 0],
            transition: { 
              duration: 0.6,
              ease: "easeInOut"
            }
          } : {}}
          drag="x"
          dragConstraints={{ left: -50, right: 50 }}
          dragElastic={0.7}
          onDragEnd={(event, info) => {
            if (info.offset.x > 30) {
              handleSwipe('right');
            } else if (info.offset.x < -30) {
              handleSwipe('left');
            }
          }}
        >
          {/* Background with animated gradient */}
          <motion.div
            className={`relative px-8 md:px-16 py-4 md:py-8 rounded-full shadow-lg transition-all duration-500 ${
              isPressed || isAnimating 
                ? `bg-gradient-to-r ${buttonColors[currentTextIndex % buttonColors.length]}` 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
            animate={isAnimating ? {
              boxShadow: [
                '0 4px 20px rgba(59, 130, 246, 0.3)',
                '0 8px 30px rgba(147, 51, 234, 0.5)',
                '0 12px 40px rgba(236, 72, 153, 0.4)',
                '0 4px 20px rgba(59, 130, 246, 0.3)'
              ],
              transition: { duration: 0.6 }
            } : {}}
          >
            {/* Swipe indicators */}
            <motion.div
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white/40"
              animate={swipeDirection === 'left' ? { x: [0, -10, 0], opacity: [0.4, 1, 0.4] } : {}}
            >
              ← اسحب
            </motion.div>
            <motion.div
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white/40"
              animate={swipeDirection === 'right' ? { x: [0, 10, 0], opacity: [0.4, 1, 0.4] } : {}}
            >
              اسحب →
            </motion.div>
            
            {/* Content */}
            <div className="relative flex items-center space-x-4 space-x-reverse text-white">
              {/* Animated icons */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <motion.div
                  animate={isAnimating ? { 
                    rotate: [0, 360, 720],
                    scale: [1, 1.3, 1.1, 1],
                    transition: { duration: 0.8 }
                  } : {
                    rotate: [0, 5, -5, 0],
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <Sparkles className="w-5 h-5 md:w-7 md:h-7" />
                </motion.div>
              </div>
              
              {/* Dynamic text with smooth transitions */}
              <motion.span 
                key={currentTextIndex}
                className="text-lg md:text-2xl font-bold font-cairo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  color: isAnimating ? 
                    ['#ffffff', '#ffd700', '#ff69b4', '#00ffff', '#ffffff'] : 
                    '#ffffff'
                }}
                transition={{ 
                  duration: isAnimating ? 0.6 : 0.3,
                  ease: "easeOut"
                }}
              >
                {isAnimating ? "جاري البحث..." : buttonTexts[currentTextIndex]}
              </motion.span>
              
              {/* Pulse effect */}
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={isAnimating ? {
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                  transition: { 
                    duration: 0.5,
                    repeat: Infinity
                  }
                } : {
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                  transition: { 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
            </div>
          </motion.div>
          
          {/* Ripple effect */}
          {isPressed && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </motion.button>
        
        {/* Swipe instructions */}
        
        {/* Click counter */}
        {clickCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <motion.div 
              className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700"
              animate={{
                scale: [1, 1.05, 1],
                transition: { 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-4 h-4 text-yellow-500" />
              </motion.div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-cairo">
                {clickCount} إلهام
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Inspiration Discovery Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1,
          y: 0
        }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut"
        }}
        className="text-center mb-4"
      >
        <motion.div
          className="inline-block text-sm text-gray-500 dark:text-gray-400 font-cairo bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800/50 dark:via-gray-700/50 dark:to-gray-800/50 px-6 py-2 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_100%] font-medium"
          >
            ✨ جرب السحب يميناً ويساراً لمحتوى متنوع ✨
          </motion.span>
        </motion.div>
      </motion.div>
      
      {/* Content Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-6"
      >
        {[
          { key: 'quotes', label: '💫 اقتباسات', color: 'from-purple-500 to-pink-500' },
          { key: 'programming', label: '💻 نصائح برمجة', color: 'from-blue-500 to-cyan-500' },
          { key: 'tech', label: '🔬 معلومات تقنية', color: 'from-indigo-500 to-purple-500' },
          { key: 'wisdom', label: '🌟 حكم ملهمة', color: 'from-amber-500 to-orange-500' },
          { key: 'sites', label: '🌐 مواقع تعليمية', color: 'from-green-500 to-emerald-500' },
          { key: 'videos', label: '📺 قنوات يوتيوب', color: 'from-red-500 to-orange-500' }
        ].map((type) => (
          <motion.button
            key={type.key}
            onClick={() => setContentType(type.key as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={contentType === type.key ? {
              boxShadow: [
                '0 0 0 rgba(59, 130, 246, 0)',
                '0 0 20px rgba(59, 130, 246, 0.4)',
                '0 0 0 rgba(59, 130, 246, 0)'
              ],
              transition: { 
                duration: 2,
                repeat: Infinity
              }
            } : {}}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 font-cairo ${
              contentType === type.key
                ? `bg-gradient-to-r ${type.color} text-white`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {type.label}
          </motion.button>
        ))}
      </motion.div>
      
      <AnimatePresence mode="wait">
        {currentQuote && (
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeInOut",
              type: "spring",
              stiffness: 100
            }}
            className="max-w-2xl mx-auto"
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200 dark:border-gray-700"
            >
              {/* Content Type Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block mb-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full"
              >
                {getContentTitle()}
              </motion.div>
              
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative text-lg md:text-2xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-4 font-cairo"
              >
                <span className="text-4xl md:text-6xl text-blue-200 dark:text-blue-800 absolute -top-2 md:-top-4 -right-1 md:-right-2 font-serif">"</span>
                "{currentQuote.text}"
                <span className="text-4xl md:text-6xl text-blue-200 dark:text-blue-800 absolute -bottom-4 md:-bottom-8 -left-1 md:-left-2 font-serif">"</span>
              </motion.blockquote>
              
              <motion.cite
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-base md:text-lg text-blue-600 dark:text-blue-400 font-semibold font-cairo flex items-center space-x-2 space-x-reverse mb-4"
              >
                <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                - {currentQuote.author}
              </motion.cite>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="flex flex-wrap justify-center gap-2 md:gap-3"
              >
                <motion.button
                  onClick={copyQuote}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 space-x-reverse px-3 md:px-5 py-2 md:py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm"
                >
                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                  <span>نسخ</span>
                </motion.button>
                
                <motion.button
                  onClick={shareOnTwitter}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 space-x-reverse px-3 md:px-5 py-2 md:py-3 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200 text-sm text-blue-700 dark:text-blue-300"
                >
                  <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span>تويتر</span>
                </motion.button>
                
                <motion.button
                  onClick={shareOnWhatsApp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 space-x-reverse px-3 md:px-5 py-2 md:py-3 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors duration-200 text-sm text-green-700 dark:text-green-300"
                >
                  <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span>واتساب</span>
                </motion.button>
                
                <motion.button
                  onClick={readAloud}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 space-x-reverse px-3 md:px-5 py-2 md:py-3 bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-lg transition-colors duration-200 text-sm text-purple-700 dark:text-purple-300"
                >
                  <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span>استمع</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InspirationButton;