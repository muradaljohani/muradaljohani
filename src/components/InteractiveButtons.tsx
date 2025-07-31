import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Zap, 
  Gift, 
  BookOpen, 
  Brain,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Heart,
  Lightbulb,
  Calendar,
  Award
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

interface Challenge {
  id: string;
  text: string;
  category: string;
  points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  points: number;
}

interface Reflection {
  id: string;
  text: string;
  date: Date;
  type: 'achievement' | 'gratitude';
}

const InteractiveButtons: React.FC = () => {
  const [userPoints, setUserPoints] = useLocalStorage('userPoints', 0);
  const [completedChallenges, setCompletedChallenges] = useLocalStorage<string[]>('completedChallenges', []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', []);
  const [reflections, setReflections] = useLocalStorage<Reflection[]>('reflections', []);
  const [lastRewardDate, setLastRewardDate] = useLocalStorage('lastRewardDate', '');
  
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [actionTimer, setActionTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionType, setReflectionType] = useState<'achievement' | 'gratitude'>('achievement');
  const [currentKnowledge, setCurrentKnowledge] = useState<string>('');
  const [showReward, setShowReward] = useState(false);

  const dailyChallenges: Challenge[] = [
    { id: '1', text: 'اشرب 2 لتر من الماء اليوم', category: 'صحة', points: 10 },
    { id: '2', text: 'اقرأ 5 صفحات من كتاب', category: 'تعلم', points: 15 },
    { id: '3', text: 'امشِ لمدة 15 دقيقة', category: 'رياضة', points: 10 },
    { id: '4', text: 'تواصل مع صديق قديم', category: 'اجتماعي', points: 20 },
    { id: '5', text: 'اكتب 3 أشياء ممتن لها', category: 'امتنان', points: 15 },
    { id: '6', text: 'نظم مكتبك أو غرفتك', category: 'تنظيم', points: 15 },
    { id: '7', text: 'تعلم كلمة جديدة بلغة أجنبية', category: 'تعلم', points: 10 },
    { id: '8', text: 'اطبخ وجبة صحية', category: 'صحة', points: 20 },
    { id: '9', text: 'اقضِ 10 دقائق في التأمل', category: 'راحة', points: 15 },
    { id: '10', text: 'ساعد شخصاً في شيء ما', category: 'خير', points: 25 }
  ];

  const quickActions: string[] = [
    'رتب مكتبك في 5 دقائق',
    'اكتب قائمة مهام اليوم',
    'احذف 10 صور غير مهمة من هاتفك',
    'اشرب كوب ماء الآن',
    'تمدد لمدة 3 دقائق',
    'اتصل بأحد أفراد العائلة',
    'اكتب فكرة مشروع جديد',
    'نظف شاشة هاتفك وحاسوبك',
    'اقرأ خبراً إيجابياً',
    'اكتب رسالة شكر لشخص ما'
  ];

  const knowledgeTips: string[] = [
    '💡 تقنية البومودورو: اعمل 25 دقيقة، استرح 5 دقائق',
    '🧠 القاعدة الذهبية: ابدأ بأصعب مهمة في اليوم',
    '⏰ قانون الدقيقتين: إذا كانت المهمة تأخذ أقل من دقيقتين، افعلها فوراً',
    '📝 اكتب أهدافك، الأشخاص الذين يكتبون أهدافهم أكثر نجاحاً بـ42%',
    '🎯 قاعدة 80/20: 80% من النتائج تأتي من 20% من الجهود',
    '🌅 الاستيقاظ المبكر يزيد الإنتاجية بنسبة 13%',
    '💧 شرب الماء يحسن التركيز بنسبة 23%',
    '🚶 المشي 10 دقائق يزيد الطاقة لـ12 ساعة',
    '📱 إغلاق الإشعارات يزيد التركيز بنسبة 40%',
    '😴 النوم 7-8 ساعات يحسن الذاكرة بنسبة 20%'
  ];

  const rewards: string[] = [
    '🎉 أنت رائع! استمر في التقدم',
    '⭐ لقد حققت إنجازاً اليوم!',
    '🏆 أنت بطل حقيقي!',
    '💪 قوتك الداخلية لا تُقهر',
    '🌟 تألق كالنجوم!',
    '🎯 هدفك قريب، لا تستسلم',
    '🚀 أنت في المسار الصحيح',
    '💎 أنت كنز ثمين',
    '🌈 حياتك مليئة بالألوان الجميلة',
    '🎪 اجعل كل يوم احتفالاً بإنجازاتك'
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && actionTimer > 0) {
      interval = setInterval(() => {
        setActionTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            toast.success('انتهى الوقت! كيف كان أداؤك؟');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, actionTimer]);

  // Get daily challenge
  const getDailyChallenge = () => {
    const today = new Date().toDateString();
    const todayIndex = new Date().getDate() % dailyChallenges.length;
    const challenge = dailyChallenges[todayIndex];
    
    if (!completedChallenges.includes(`${today}-${challenge.id}`)) {
      setCurrentChallenge(challenge);
    } else {
      toast.success('لقد أكملت تحدي اليوم! عد غداً للمزيد');
    }
    playClickSound();
  };

  // Complete challenge
  const completeChallenge = () => {
    if (!currentChallenge) return;
    
    const today = new Date().toDateString();
    const challengeKey = `${today}-${currentChallenge.id}`;
    
    setCompletedChallenges(prev => [...prev, challengeKey]);
    setUserPoints(prev => prev + currentChallenge.points);
    
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: `تحدي ${currentChallenge.category}`,
      description: currentChallenge.text,
      date: new Date(),
      points: currentChallenge.points
    };
    
    setAchievements(prev => [newAchievement, ...prev.slice(0, 9)]);
    setAchievements(prev => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return [newAchievement, ...prevArray.slice(0, 9)];
    });
    setCurrentChallenge(null);
    
    toast.success(`مبروك! حصلت على ${currentChallenge.points} نقطة`);
    playSuccessSound();
  };

  // Get random action
  const getRandomAction = () => {
    const randomAction = quickActions[Math.floor(Math.random() * quickActions.length)];
    setCurrentAction(randomAction);
    setActionTimer(300); // 5 minutes
    setIsTimerActive(true);
    playClickSound();
  };

  // Complete action
  const completeAction = () => {
    setUserPoints(prev => prev + 5);
    setCurrentAction('');
    setActionTimer(0);
    setIsTimerActive(false);
    toast.success('رائع! حصلت على 5 نقاط');
    playSuccessSound();
  };

  // Get daily reward
  const getDailyReward = () => {
    const today = new Date().toDateString();
    
    if (lastRewardDate === today) {
      toast.error('لقد حصلت على مكافأة اليوم! عد غداً');
      return;
    }
    
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setShowReward(true);
    setLastRewardDate(today);
    setUserPoints(prev => prev + 3);
    
    setTimeout(() => setShowReward(false), 3000);
    toast.success(randomReward);
    playSuccessSound();
  };

  // Save reflection
  const saveReflection = () => {
    if (!reflectionText.trim()) return;
    
    const newReflection: Reflection = {
      id: Date.now().toString(),
      text: reflectionText.trim(),
      date: new Date(),
      type: reflectionType
    };
    
    setReflections(prev => [newReflection, ...prev.slice(0, 19)]);
    setReflectionText('');
    setShowReflectionModal(false);
    setUserPoints(prev => prev + 2);
    
    toast.success('تم حفظ تأملك! +2 نقطة');
    playSuccessSound();
  };

  // Get knowledge tip
  const getKnowledgeTip = () => {
    const randomTip = knowledgeTips[Math.floor(Math.random() * knowledgeTips.length)];
    setCurrentKnowledge(randomTip);
    playClickSound();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Points Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-2xl px-6 py-3 shadow-lg">
          <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
            {userPoints} نقطة
          </span>
          <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
      </motion.div>

      {/* Interactive Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Challenge Button */}
        <motion.button
          onClick={getDailyChallenge}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative z-10 text-center space-y-2 md:space-y-3">
            <Target className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
            <h3 className="font-bold text-sm md:text-lg font-cairo">التحدي اليومي</h3>
            <p className="text-xs md:text-sm opacity-90 hidden md:block">مهمة يومية جديدة</p>
          </div>
        </motion.button>

        {/* Action Button */}
        <motion.button
          onClick={getRandomAction}
          className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative z-10 text-center space-y-2 md:space-y-3">
            <Zap className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
            <h3 className="font-bold text-sm md:text-lg font-cairo">إنجاز سريع</h3>
            <p className="text-xs md:text-sm opacity-90 hidden md:block">مهمة في 5 دقائق</p>
          </div>
        </motion.button>

        {/* Reward Button */}
        <motion.button
          onClick={getDailyReward}
          className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative z-10 text-center space-y-2 md:space-y-3">
            <Gift className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
            <h3 className="font-bold text-sm md:text-lg font-cairo">المكافأة</h3>
            <p className="text-xs md:text-sm opacity-90 hidden md:block">هدية يومية</p>
          </div>
        </motion.button>

        {/* Reflection Button */}
        <motion.button
          onClick={() => setShowReflectionModal(true)}
          className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative z-10 text-center space-y-2 md:space-y-3">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
            <h3 className="font-bold text-sm md:text-lg font-cairo">اليوميات</h3>
            <p className="text-xs md:text-sm opacity-90 hidden md:block">سجل تأملاتك</p>
          </div>
        </motion.button>

        {/* Knowledge Button */}
        <motion.button
          onClick={getKnowledgeTip}
          className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 col-span-2 md:col-span-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative z-10 text-center space-y-2 md:space-y-3">
            <Brain className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
            <h3 className="font-bold text-sm md:text-lg font-cairo">نصيحة ذكية</h3>
            <p className="text-xs md:text-sm opacity-90 hidden md:block">معلومة مفيدة</p>
          </div>
        </motion.button>
      </div>

      {/* Current Challenge */}
      <AnimatePresence>
        {currentChallenge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <Target className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
                  تحدي اليوم
                </h3>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <p className="text-lg text-gray-800 dark:text-gray-200 font-cairo">
                  {currentChallenge.text}
                </p>
                <div className="flex items-center justify-center space-x-4 space-x-reverse mt-3">
                  <span className="text-sm bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                    {currentChallenge.category}
                  </span>
                  <span className="text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full">
                    {currentChallenge.points} نقطة
                  </span>
                </div>
              </div>
              
              <button
                onClick={completeChallenge}
                className="flex items-center space-x-2 space-x-reverse mx-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200 font-cairo"
              >
                <CheckCircle className="w-5 h-5" />
                <span>أنجزت!</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Action */}
      <AnimatePresence>
        {currentAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <Zap className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
                  إنجاز سريع
                </h3>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="text-lg text-gray-800 dark:text-gray-200 font-cairo mb-3">
                  {currentAction}
                </p>
                
                {isTimerActive && (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-500 font-mono">
                      {formatTime(actionTimer)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 space-x-reverse justify-center">
                <button
                  onClick={completeAction}
                  className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200 font-cairo"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>أنجزت!</span>
                </button>
                
                <button
                  onClick={() => {
                    setCurrentAction('');
                    setActionTimer(0);
                    setIsTimerActive(false);
                  }}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200 font-cairo"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge Tip */}
      <AnimatePresence>
        {currentKnowledge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <Lightbulb className="w-6 h-6 text-teal-500" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
                  نصيحة ذكية
                </h3>
              </div>
              
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                <p className="text-lg text-gray-800 dark:text-gray-200 font-cairo">
                  {currentKnowledge}
                </p>
              </div>
              
              <button
                onClick={() => setCurrentKnowledge('')}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors duration-200 font-cairo"
              >
                شكراً!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflection Modal */}
      <AnimatePresence>
        {showReflectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReflectionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
                    اليوميات
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => setReflectionType('achievement')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 font-cairo ${
                        reflectionType === 'achievement'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      إنجاز اليوم
                    </button>
                    <button
                      onClick={() => setReflectionType('gratitude')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 font-cairo ${
                        reflectionType === 'gratitude'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      شيء ممتن له
                    </button>
                  </div>
                  
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder={reflectionType === 'achievement' ? 'اكتب أكثر شيء أنجزته اليوم...' : 'اكتب شيئاً أنت ممتن له...'}
                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none font-cairo"
                  />
                  
                  <div className="flex space-x-3 space-x-reverse">
                    <button
                      onClick={saveReflection}
                      disabled={!reflectionText.trim()}
                      className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-xl transition-colors duration-200 font-cairo"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setShowReflectionModal(false)}
                      className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200 font-cairo"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Display */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8 shadow-2xl text-center">
              <Gift className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-cairo mb-2">مكافأة يومية!</h3>
              <p className="text-lg">+3 نقاط</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
              آخر الإنجازات
            </h3>
          </div>
          
          <div className="space-y-3">
            {achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    +{achievement.points}
                  </span>
                  <p className="text-xs text-gray-500">
                    {new Date(achievement.date).toLocaleDateString('ar')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveButtons;