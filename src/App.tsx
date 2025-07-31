import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import InspirationButton from './components/InspirationButton';
import InteractiveButtons from './components/InteractiveButtons';
import GamesSection from './components/GamesSection';
import AskMuraad from './components/AskMuraad';
import SaudiTechNews from './components/SaudiTechNews';
import InspirationSites from './components/InspirationSites';
import CareerGuidance from './components/CareerGuidance';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 font-cairo">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontFamily: 'Cairo, sans-serif',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
      
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section with Inspiration Button */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <InspirationButton />
        </motion.section>

        {/* Interactive Buttons Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="py-8"
        >
          <InteractiveButtons />
        </motion.section>

        {/* Games Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-16"
        >
          <GamesSection />
        </motion.section>

        {/* Ask Muraad Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-16"
        >
          <AskMuraad />
        </motion.section>

        {/* Saudi Tech News Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="py-16"
        >
          <SaudiTechNews />
        </motion.section>

        {/* Career Guidance Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="py-16"
        >
          <CareerGuidance />
        </motion.section>

        {/* Inspiration Sites Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-16"
        >
          <InspirationSites />
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 border-t border-gray-200 dark:border-gray-700 py-12 transition-all duration-500">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          {/* AI Power Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-8"
          >
            <div className="inline-flex items-center space-x-4 space-x-reverse bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-blue-200/30 dark:border-blue-700/30 shadow-lg">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🧠</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </motion.div>
              
              <div className="text-center">
                <motion.h3 
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-cairo bg-[length:200%_100%]"
                >
                  مدعوم بذكاء مراد الجهني
                </motion.h3>
                <div className="flex items-center justify-center space-x-2 space-x-reverse mt-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  ></motion.div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-cairo">
                    نشط ويتعلم باستمرار
                  </span>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-yellow-500"
                  >
                    ✨
                  </motion.div>
                </div>
              </div>
              
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-2xl"
              >
                🚀
              </motion.div>
            </div>
          </motion.div>

          {/* Dream Vision Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 mb-8"
          >
            <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-200/30 dark:border-pink-700/30 shadow-lg">
              <motion.h2
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(236, 72, 153, 0.3)',
                    '0 0 20px rgba(147, 51, 234, 0.3)',
                    '0 0 10px rgba(59, 130, 246, 0.3)',
                    '0 0 10px rgba(236, 72, 153, 0.3)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-cairo mb-3"
              >
                🌟 موقع حالم يؤمن بقوة الأحلام 🌟
              </motion.h2>
              <p className="text-gray-700 dark:text-gray-300 font-cairo text-lg leading-relaxed">
                نحن نؤمن أن كل حلم يمكن أن يصبح حقيقة بالإرادة والعمل الجاد
              </p>
              <div className="flex items-center justify-center space-x-4 space-x-reverse mt-4">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  💫
                </motion.span>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-cairo">
                  حيث تلتقي التكنولوجيا بالأحلام
                </span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🌙
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 mb-6"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <motion.p 
                animate={{ 
                  color: [
                    'rgb(59, 130, 246)',
                    'rgb(147, 51, 234)', 
                    'rgb(236, 72, 153)',
                    'rgb(59, 130, 246)'
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-xl font-bold font-cairo mb-2 flex items-center justify-center space-x-3 space-x-reverse"
              >
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ❤️
                </motion.span>
                <span>صُنع بحب وشغف في السعودية لنشر الإلهام والإنتاجية</span>
                <motion.span
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🇸🇦
                </motion.span>
              </motion.p>
              
              <div className="flex items-center justify-center space-x-6 space-x-reverse mt-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>مشروع حي ومتطور</span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                  <span>تحديثات مستمرة</span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
                  <span>مدعوم بذكاء مراد الجهني</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative z-10"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50 shadow-md">
              <motion.p 
                whileHover={{ scale: 1.02 }}
                className="text-sm text-gray-600 dark:text-gray-400 font-cairo leading-relaxed"
              >
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block"
                >
                  © 2025
                </motion.span>
                {' '}
                <motion.span
                  whileHover={{ 
                    color: '#3b82f6',
                    scale: 1.05
                  }}
                  className="font-semibold cursor-pointer transition-all duration-300"
                >
                  مراد الجهني
                </motion.span>
                {' '}
                <span className="mx-2">•</span>
                <motion.span
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_100%]"
                >
                  مشروع للأغراض الأكاديمية
                </motion.span>
                {' '}
                <span className="mx-2">•</span>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center space-x-1 space-x-reverse"
                >
                  <span>تحت التطوير المستمر</span>
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  >
                    ⚙️
                  </motion.span>
                </motion.span>
                <br />
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs mt-2 inline-block"
                >
                  جميع الحقوق محفوظة للمبرمج مراد عبدالرزاق الجهني - صنع بتقنيات حديثة ومحبة كبيرة
                </motion.span>
              </motion.p>
            </div>
          </motion.div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 left-4 text-2xl opacity-30"
          >
            💭
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-8 right-8 text-3xl opacity-20"
          >
            ✨
          </motion.div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-4 left-1/4 text-xl"
          >
            🌟
          </motion.div>
          
          <motion.div
            animate={{ 
              x: [0, 10, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-8 right-1/4 text-2xl opacity-25"
          >
            🚀
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;