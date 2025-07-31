import React, { useState, useEffect } from 'react';
import { Moon, Sun, Users, Calendar, Clock, Banknote, TrendingUp, Sparkles, Heart, Star, FileImage, Download, Search, BookOpen } from 'lucide-react';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabase } from '../hooks/useSupabase';
import AuthModal from './AuthModal';
import FileConverter from './FileConverter';
import TemplatesModal from './TemplatesModal';
import SearchModal from './SearchModal';
import { KnowledgeEntry } from '../data/knowledgeBase';
import { 
  getHijriDate, 
  getGregorianDate, 
  getCurrentTime, 
  getDayOfYear,
  getDaysUntilSalary,
  getWeekdayName,
  getMonthProgress
} from '../utils/dateUtils';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { user, signOut, loading } = useSupabase();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [hijriDate] = useState(getHijriDate());
  const [gregorianDate] = useState(getGregorianDate());
  const [weekday] = useState(getWeekdayName());
  const [currentYear] = useState(new Date().getFullYear());
  const [salaryCountdown, setSalaryCountdown] = useState(getDaysUntilSalary());
  const [yearProgress, setYearProgress] = useState(0);
  const [activeUsers] = useState(Math.floor(Math.random() * 150) + 50);
  const [isHovered, setIsHovered] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showConverter, setShowConverter] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegistrationDates, setShowRegistrationDates] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // قائمة الألقاب/التخصصات
  const titles = [
    "🌟 رحلة الإبداع والتميز التقني 🚀",
    "💻 المبرمج مراد - كود يُلهم العالم",
    "🎨 المصمم مراد - تصميم بلا حدود",
    "🤖 خبير الذكاء الاصطناعي مراد",
    "📱 مطور التطبيقات المبدع",
    "🌐 مهندس الويب المتميز",
    "⚡ مراد - سرعة في التنفيذ",
    "🏆 رائد الأعمال التقنية",
    "📊 محلل البيانات الذكي",
    "🔒 خبير الأمن السيبراني",
    "☁️ مهندس الحوسبة السحابية",
    "🎯 استراتيجي التقنية الرقمية",
    "🌍 مراد - تقنية للجميع",
    "💡 مبتكر الحلول الذكية",
    "🚀 قائد التحول الرقمي"
  ];

  // بيانات الجامعات الأهلية السعودية ومواعيد التسجيل
  const privateUniversities = [
    {
      name: "جامعة الأمير سلطان",
      registrationStart: "2025-02-01",
      registrationEnd: "2025-06-15",
      website: "https://www.psu.edu.sa",
      location: "الرياض"
    },
    {
      name: "جامعة عفت",
      registrationStart: "2025-01-15",
      registrationEnd: "2025-06-30",
      website: "https://www.effatuniversity.edu.sa",
      location: "جدة"
    },
    {
      name: "الجامعة العربية المفتوحة",
      registrationStart: "2025-02-15",
      registrationEnd: "2025-07-15",
      website: "https://www.arabou.edu.sa",
      location: "الرياض"
    },
    {
      name: "جامعة دار العلوم",
      registrationStart: "2025-03-01",
      registrationEnd: "2025-07-01",
      website: "https://www.darululum.edu.sa",
      location: "الرياض"
    },
    {
      name: "جامعة الفيصل",
      registrationStart: "2025-02-10",
      registrationEnd: "2025-06-20",
      website: "https://www.alfaisal.edu",
      location: "الرياض"
    },
    {
      name: "كليات الرياض للتقنية",
      registrationStart: "2025-01-20",
      registrationEnd: "2025-06-25",
      website: "https://www.riyadh.edu.sa",
      location: "الرياض"
    },
    {
      name: "جامعة اليمامة",
      registrationStart: "2025-02-05",
      registrationEnd: "2025-06-18",
      website: "https://www.yu.edu.sa",
      location: "الرياض"
    },
    {
      name: "جامعة المعرفة",
      registrationStart: "2025-02-20",
      registrationEnd: "2025-07-10",
      website: "https://www.uc.edu.sa",
      location: "الرياض"
    },
    {
      name: "جامعة الأميرة نورة (أهلي)",
      registrationStart: "2025-01-25",
      registrationEnd: "2025-06-10",
      website: "https://www.pnu.edu.sa",
      location: "الرياض"
    },
    {
      name: "كلية الأمير محمد بن سلمان",
      registrationStart: "2025-03-15",
      registrationEnd: "2025-07-20",
      website: "https://www.mbsc.edu.sa",
      location: "جدة"
    },
    {
      name: "جامعة الملك فيصل (برامج أهلية)",
      registrationStart: "2025-02-12",
      registrationEnd: "2025-06-28",
      website: "https://www.kfu.edu.sa",
      location: "الأحساء"
    },
    {
      name: "كليات الغد الدولية",
      registrationStart: "2025-01-30",
      registrationEnd: "2025-06-22",
      website: "https://www.gic.edu.sa",
      location: "الرياض"
    }
  ];

  // حساب الأيام المتبقية للتسجيل
  const getDaysUntilRegistration = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { status: 'upcoming', days: daysUntilStart, type: 'حتى بداية التسجيل' };
    } else if (now >= start && now <= end) {
      const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { status: 'active', days: daysUntilEnd, type: 'متبقي للتسجيل' };
    } else {
      return { status: 'ended', days: 0, type: 'انتهى التسجيل' };
  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showRegistrationDates) {
        setShowRegistrationDates(false);
      }
      if (showConverter) {
        setShowConverter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRegistrationDates, showConverter]);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setSalaryCountdown(getDaysUntilSalary());
      
      // حساب تقدم السنة
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      const yearProgressCalc = ((now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100;
      setYearProgress(Math.round(yearProgressCalc));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // تبديل الألقاب كل 4 ثوانٍ
  useEffect(() => {
    const titleTimer = setInterval(() => {
      setCurrentTitleIndex(prev => (prev + 1) % titles.length);
    }, 4000);
    
    return () => clearInterval(titleTimer);
  }, [titles.length]);

  const getDaysRemainingInYear = () => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const timeDiff = endOfYear.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const convertToPDF = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);
    
    // محاكاة عملية التحويل (في التطبيق الحقيقي ستحتاج مكتبة تحويل)
    setTimeout(() => {
      // هنا سيتم التحويل الفعلي
      const link = document.createElement('a');
      link.download = selectedFile.name.replace(/\.[^/.]+$/, "") + '.pdf';
      // في التطبيق الحقيقي: link.href = convertedPdfUrl;
      link.click();
      
      setIsConverting(false);
      setSelectedFile(null);
      setShowConverter(false);
    }, 2000);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        {/* Top Info Bar - Horizontal Rectangle */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl p-4 mb-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 text-center">
            {/* الوقت الفعلي */}
            <div className="flex items-center justify-center space-x-2 space-x-reverse bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm border border-blue-100/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-200">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                {currentTime}
              </div>
            </div>

            {/* تاريخ اليوم الفعلي */}
            <div className="flex items-center justify-center space-x-2 space-x-reverse bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm border border-green-100/50 dark:border-green-800/50 hover:shadow-md transition-all duration-200">
              <Calendar className="w-3.5 h-3.5 text-green-500" />
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                <span className="hidden md:inline">{weekday} - </span>
                <span className="text-xs">{new Date().toLocaleDateString('ar-SA')}</span>
              </div>
            </div>

            {/* التاريخ الهجري الفعلي */}
            <div className="flex items-center justify-center space-x-2 space-x-reverse bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm border border-purple-100/50 dark:border-purple-800/50 hover:shadow-md transition-all duration-200 col-span-2 md:col-span-1">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                <span className="hidden lg:inline">هجري: </span>{hijriDate.split(' ').slice(-2).join(' ')}
              </div>
            </div>

            {/* يوم الراتب (27 من كل شهر) */}
            <div className={`flex items-center justify-center space-x-2 space-x-reverse bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm border transition-all duration-200 hover:shadow-md ${
              salaryCountdown.isToday 
                ? 'border-green-200/70 dark:border-green-800/70 ring-1 ring-green-200/50 dark:ring-green-800/50' 
                : 'border-orange-100/50 dark:border-orange-800/50'
            }`}>
              <Banknote className={`w-3.5 h-3.5 ${salaryCountdown.isToday ? 'text-green-500' : 'text-orange-500'}`} />
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                {salaryCountdown.isToday ? 'راتب!' : `${salaryCountdown.days}د`}
              </div>
            </div>

            {/* محول الملفات */}
            <div className="relative">
              <button
                onClick={() => setShowConverter(!showConverter)}
                className="flex items-center justify-center space-x-1.5 space-x-reverse bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl px-3 py-2.5 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 transition-all duration-200 shadow-sm border border-green-100/50 dark:border-green-800/50 hover:shadow-md"
                title="محول الصور إلى PDF"
              >
                <FileImage className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                  <span className="hidden lg:inline">تحويل الملفات</span>
                  <span className="hidden md:inline lg:hidden">تحويل</span>
                  <span className="md:hidden">PDF</span>
                </div>
              </button>
            </div>

            {/* قوالب Canva */}
            <div className="relative">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center justify-center space-x-1.5 space-x-reverse bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl px-3 py-2.5 hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/40 dark:hover:to-purple-900/40 transition-all duration-200 shadow-sm border border-pink-100/50 dark:border-pink-800/50 hover:shadow-md"
                title="قوالب Canva الاحترافية"
              >
                <Palette className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                  <span className="hidden lg:inline">قوالب Canva</span>
                  <span className="hidden md:inline lg:hidden">قوالب</span>
                  <span className="md:hidden">🎨</span>
                </div>
              </button>
            </div>

            {/* البحث المتقدم */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center justify-center space-x-1.5 space-x-reverse bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl px-3 py-2.5 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/40 dark:hover:to-teal-900/40 transition-all duration-200 shadow-sm border border-emerald-100/50 dark:border-emerald-800/50 hover:shadow-md"
                title="البحث المتقدم في قاعدة المعرفة"
              >
                <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                  <span className="hidden lg:inline">البحث المتقدم</span>
                  <span className="hidden md:inline lg:hidden">بحث</span>
                  <span className="md:hidden">🔍</span>
                </div>
              </button>
            </div>

            {/* دفتر الملاحظات */}
            <div className="relative">
              <button
                onClick={() => {/* سيتم ربطه بـ NotesModal في AskMuraad */}}
                className="flex items-center justify-center space-x-1.5 space-x-reverse bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl px-3 py-2.5 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-900/40 dark:hover:to-blue-900/40 transition-all duration-200 shadow-sm border border-indigo-100/50 dark:border-indigo-800/50 hover:shadow-md"
                title="دفتر الملاحظات الذكي"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                  <span className="hidden lg:inline">دفتر الملاحظات</span>
                  <span className="hidden md:inline lg:hidden">ملاحظات</span>
                  <span className="md:hidden">📓</span>
                </div>
              </button>
            </div>

            {/* مواعيد التسجيل بالجامعات الأهلية */}
            <div className="relative">
              <button
                onClick={() => setShowRegistrationDates(!showRegistrationDates)}
                className="flex items-center justify-center space-x-1.5 space-x-reverse bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl px-3 py-2.5 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition-all duration-200 shadow-sm border border-purple-100/50 dark:border-purple-800/50 hover:shadow-md"
                title="مواعيد التسجيل في الجامعات الأهلية"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                  <span className="hidden lg:inline">التسجيل الجامعي</span>
                  <span className="hidden md:inline lg:hidden">تسجيل</span>
                  <span className="md:hidden">🎓</span>
                </div>
              </button>
              
              {/* Registration Dates Modal */}
              {showRegistrationDates && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full mt-2 right-0 z-50 w-[95vw] max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 md:p-5 max-h-[70vh] md:max-h-80 overflow-y-auto"
                >
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo flex items-center space-x-2 space-x-reverse">
                      <span>🎓</span>
                      <span>مواعيد التسجيل بالجامعات الأهلية</span>
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-cairo mt-1">
                      تحديث مستمر لمواعيد القبول والتسجيل
                    </p>
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    {privateUniversities.map((university, index) => {
                      const registrationInfo = getDaysUntilRegistration(university.registrationStart, university.registrationEnd);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-xl border-l-4 ${
                            registrationInfo.status === 'active' 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-400' 
                              : registrationInfo.status === 'upcoming'
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                              : 'bg-gray-50 dark:bg-gray-700/20 border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 space-y-1 md:space-y-0">
                            <h4 className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-200 font-cairo leading-tight">
                              {university.name}
                            </h4>
                            <span className="text-xs text-gray-500 font-cairo flex-shrink-0">
                              📍 {university.location}
                            </span>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                            <div className={`text-xs font-bold ${
                              registrationInfo.status === 'active' 
                                ? 'text-green-600 dark:text-green-400' 
                                : registrationInfo.status === 'upcoming'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500'
                            }`}>
                              {registrationInfo.status === 'ended' 
                                ? '❌ انتهى التسجيل'
                                : `${registrationInfo.days} يوم ${registrationInfo.type}`
                              }
                            </div>
                            
                            <a
                              href={university.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1.5 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200 font-cairo text-center"
                            >
                              زيارة الموقع
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-3 md:mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-3">
                    {/* رابط sajjel.me المميز */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-3 border border-purple-200/50 dark:border-purple-800/50">
                      <div className="text-center space-y-2">
                        <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 font-cairo flex items-center justify-center space-x-2 space-x-reverse">
                          <span>🎓</span>
                          <span>المزيد من الجامعات</span>
                        </h4>
                        <a
                          href="https://sajjel.me/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-cairo font-semibold text-sm shadow-md hover:shadow-lg"
                        >
                          <span>🌐</span>
                          <span>زيارة sajjel.me</span>
                          <span>↗️</span>
                        </a>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-cairo">
                          دليل شامل لجميع الجامعات والكليات
                        </p>
                      </div>
                    </div>
                    
                    {/* نصائح إضافية */}
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400 font-cairo leading-relaxed">
                      💡 <strong>نصيحة:</strong> تأكد من المواعيد من الموقع الرسمي للجامعة
                      <br />
                      📅 يُحدث هذا القسم بانتظام حسب الإعلانات الرسمية
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            {/* السنة الميلادية وما تبقى منها */}
            <div className="flex items-center justify-center space-x-2 space-x-reverse bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm border border-blue-100/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-200">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 font-cairo">
                {currentYear} ({yearProgress}%)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div 
            className="flex items-center space-x-3 space-x-reverse"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              {/* Crown above M - positioned perfectly */}
              <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="text-yellow-400 text-sm md:text-lg drop-shadow-lg filter brightness-110">
                  👑
                </div>
              </div>
              
              <span className="text-white font-bold text-lg md:text-xl relative z-0">M</span>
              
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full shadow-sm animate-pulse"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-cairo truncate">
                مراد الجهني
              </h1>
              
              <div>
                <motion.p 
                  key={currentTitleIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo font-medium truncate"
                >
                  {titles[currentTitleIndex]}
                </motion.p>
              </div>
              
              {/* Academic Project Notice */}
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500 dark:text-gray-500 font-cairo">
                  📚 مشروع أكاديمي علمي قيد التطوير المستمر
                </p>
              </div>
              
              {showWelcome && (
                <div className="text-xs text-blue-500 dark:text-blue-400 font-cairo mt-1">
                  أهلاً وسهلاً بك! 🌟
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* User Auth */}
            {!loading && (
              <div className="flex items-center space-x-2 space-x-reverse">
                {user ? (
                  <div className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-cairo hidden md:block">
                      {user.email?.split('@')[0]}
                    </span>
                    <button
                      onClick={signOut}
                      className="text-xs text-red-500 hover:text-red-600 font-cairo"
                    >
                      خروج
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-colors duration-200 text-sm font-cairo"
                  >
                    <span className="hidden md:inline">تسجيل الدخول</span>
                    <span className="md:hidden">دخول</span>
                  </button>
                )}
              </div>
            )}

            {/* Active Users Counter */}
            <div className="hidden md:flex items-center space-x-2 space-x-reverse bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {activeUsers}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-cairo">
                  نشط
                </span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 md:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="تبديل الوضع الليلي"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      {/* File Converter Modal */}
      <FileConverter 
        isOpen={showConverter} 
        onClose={() => setShowConverter(false)} 
      />
      
      {/* Templates Modal */}
      <TemplatesModal 
        isOpen={showTemplates} 
        onClose={() => setShowTemplates(false)} 
      />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)}
        onSelectResult={(entry: KnowledgeEntry) => {
          // عرض النتيجة المختارة في إشعار
          toast.success(`تم اختيار: ${entry.title}`, {
            icon: '📖',
            duration: 3000
          });
        }}
      />
    </header>
  );
};

export default Header;