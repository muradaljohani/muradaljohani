import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Users, 
  ExternalLink,
  Filter,
  Search,
  BookOpen,
  Target,
  Award,
  Building,
  GraduationCap,
  Lightbulb,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';
import careerData from '../data/career.json';

const CareerGuidance: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteCompanies, setFavoriteCompanies] = useLocalStorage<string[]>('favoriteCompanies', []);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { techCompanies, generalCareerTips, educationPaths, industryTrends } = careerData;

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'جميع الشركات', icon: '🌟', color: 'from-blue-500 to-purple-500' },
    { id: 'اتصالات', name: 'الاتصالات', icon: '📱', color: 'from-green-500 to-teal-500' },
    { id: 'طاقة', name: 'الطاقة', icon: '⛽', color: 'from-orange-500 to-red-500' },
    { id: 'ذكاء اصطناعي', name: 'الذكاء الاصطناعي', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { id: 'مدن ذكية', name: 'المدن الذكية', icon: '🏙️', color: 'from-cyan-500 to-blue-500' },
    { id: 'تعليم تقني', name: 'التعليم التقني', icon: '🎓', color: 'from-emerald-500 to-green-500' },
    { id: 'أمن سيبراني', name: 'الأمن السيبراني', icon: '🔒', color: 'from-red-500 to-pink-500' }
  ];

  // Filter companies
  const filteredCompanies = techCompanies.filter(company => {
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFavorites = !showOnlyFavorites || favoriteCompanies.includes(company.id);
    
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  const toggleFavorite = (companyId: string) => {
    setFavoriteCompanies(prev => {
      const newFavorites = prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId];
      
      const company = techCompanies.find(c => c.id === companyId);
      toast.success(
        newFavorites.includes(companyId) 
          ? `تم إضافة ${company?.name} للمفضلة`
          : `تم إزالة ${company?.name} من المفضلة`,
        { icon: newFavorites.includes(companyId) ? '❤️' : '💔', duration: 2000 }
      );
      
      return newFavorites;
    });
    playClickSound();
  };

  const visitCompany = (url: string, companyName: string) => {
    window.open(url, '_blank');
    toast.success(`تم فتح موقع ${companyName}!`, { icon: '🌐', duration: 2000 });
    playSuccessSound();
  };

  const getHiringStatusColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'محدود': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900';
      case 'مغلق': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getHiringStatusIcon = (status: string) => {
    switch (status) {
      case 'متاح': return '✅';
      case 'محدود': return '⚠️';
      case 'مغلق': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3 space-x-reverse mb-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Briefcase className="w-8 h-8 text-blue-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
            🇸🇦 التوجيه الوظيفي التقني
          </h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-8 h-8 text-green-500" />
          </motion.div>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 font-cairo mb-6">
          دليلك الشامل للوظائف التقنية في أفضل الشركات السعودية
        </p>
      </div>

      {/* Industry Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-cairo mb-4 flex items-center space-x-2 space-x-reverse">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <span>اتجاهات السوق التقني السعودي</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {industryTrends.map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{trend.icon}</div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 font-cairo text-sm">
                  {trend.title}
                </h4>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {trend.trend}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-cairo">
                  {trend.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث في الشركات والتخصصات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-cairo"
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl transition-all duration-200 font-cairo text-sm ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Favorites Toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyFavorites}
              onChange={(e) => setShowOnlyFavorites(e.target.checked)}
              className="w-5 h-5 text-red-500 border-2 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="flex items-center space-x-1 space-x-reverse text-gray-700 dark:text-gray-300 font-cairo">
              <Heart className="w-4 h-4 text-red-500" />
              <span>المفضلة فقط</span>
            </span>
          </label>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 font-cairo">
            {filteredCompanies.length} من {techCompanies.length} شركة
          </div>
        </div>
      </motion.div>

      {/* Companies Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group relative"
            >
              {/* Favorite Button */}
              <div className="absolute top-4 left-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(company.id)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    favoriteCompanies.includes(company.id)
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={favoriteCompanies.includes(company.id) ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {/* Company Header */}
              <div className="p-6">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="text-4xl">{company.logo}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 font-cairo text-lg leading-tight">
                      {company.name}
                    </h3>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-cairo">
                        {company.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 font-cairo text-sm mb-4 leading-relaxed">
                  {company.description}
                </p>

                {/* Status and Salary */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`flex items-center space-x-1 space-x-reverse px-3 py-1 rounded-full text-xs font-semibold ${getHiringStatusColor(company.hiringStatus)}`}>
                    <span>{getHiringStatusIcon(company.hiringStatus)}</span>
                    <span>{company.hiringStatus}</span>
                  </span>
                  <div className="flex items-center space-x-1 space-x-reverse text-green-600 dark:text-green-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-semibold font-cairo">{company.salaryRange}</span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-cairo mb-2">
                    التخصصات المطلوبة:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {company.specializations.slice(0, 3).map((spec, specIndex) => (
                      <span
                        key={specIndex}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-cairo"
                      >
                        {spec}
                      </span>
                    ))}
                    {company.specializations.length > 3 && (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-cairo">
                        +{company.specializations.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Application Tips Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-cairo mb-2 flex items-center space-x-1 space-x-reverse">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span>نصائح التقديم:</span>
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-cairo">
                    {company.applicationTips[0]}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => visitCompany(company.website, company.name)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse font-cairo text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>زيارة الموقع</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setExpandedTip(expandedTip === company.id ? null : company.id);
                      playClickSound();
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-cairo text-sm"
                  >
                    تفاصيل
                  </motion.button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedTip === company.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      {/* Requirements */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-cairo mb-2 flex items-center space-x-1 space-x-reverse">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>المتطلبات:</span>
                        </h5>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 font-cairo space-y-1">
                          {company.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start space-x-2 space-x-reverse">
                              <span className="text-green-500">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-cairo mb-2 flex items-center space-x-1 space-x-reverse">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>المزايا:</span>
                        </h5>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 font-cairo space-y-1">
                          {company.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start space-x-2 space-x-reverse">
                              <span className="text-yellow-500">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Application Tips */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 font-cairo mb-2 flex items-center space-x-1 space-x-reverse">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span>نصائح التقديم:</span>
                        </h5>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 font-cairo space-y-1">
                          {company.applicationTips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-2 space-x-reverse">
                              <span className="text-blue-500">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredCompanies.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
            لا توجد شركات
          </h3>
          <p className="text-gray-500 dark:text-gray-500 font-cairo">
            جرب تغيير مصطلح البحث أو الفئة
          </p>
        </motion.div>
      )}

      {/* Career Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-cairo mb-6 flex items-center space-x-3 space-x-reverse">
          <BookOpen className="w-7 h-7 text-green-500" />
          <span>نصائح عامة للتطوير المهني</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalCareerTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{tip.icon}</div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 font-cairo text-lg">
                  {tip.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-cairo mt-2">
                  {tip.description}
                </p>
              </div>
              
              <ul className="space-y-2">
                {tip.tips.map((tipItem, tipIndex) => (
                  <li key={tipIndex} className="flex items-start space-x-2 space-x-reverse text-sm text-gray-700 dark:text-gray-300 font-cairo">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tipItem}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Education Paths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-cairo mb-6 flex items-center space-x-3 space-x-reverse">
          <GraduationCap className="w-7 h-7 text-purple-500" />
          <span>مسارات التعليم التقني</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="text-3xl">{path.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 font-cairo text-lg">
                    {path.title}
                  </h4>
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{path.duration}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 font-cairo text-sm mb-4">
                {path.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-gray-200 font-cairo text-sm mb-2">
                    الجهات المقدمة:
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {(path.universities || path.providers)?.map((provider, providerIndex) => (
                      <span
                        key={providerIndex}
                        className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-cairo"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-gray-200 font-cairo text-sm mb-2">
                    المسارات الوظيفية:
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {path.careerPaths.map((career, careerIndex) => (
                      <span
                        key={careerIndex}
                        className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-cairo"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-600"
      >
        <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Target className="w-8 h-8 text-blue-500" />
          </motion.div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-cairo">
            مركز التوجيه الوظيفي التقني
          </h3>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award className="w-8 h-8 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-cairo mb-6 leading-relaxed">
          استكشف الفرص الوظيفية في أفضل الشركات التقنية السعودية واحصل على النصائح المهنية
        </p>
        <div className="flex items-center justify-center space-x-8 space-x-reverse text-sm">
          <div className="flex items-center space-x-2 space-x-reverse text-blue-600 dark:text-blue-400">
            <Building className="w-5 h-5" />
            <span className="font-cairo">{techCompanies.length} شركة رائدة</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-green-600 dark:text-green-400">
            <Lightbulb className="w-5 h-5" />
            <span className="font-cairo">{generalCareerTips.length} نصيحة مهنية</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-purple-600 dark:text-purple-400">
            <GraduationCap className="w-5 h-5" />
            <span className="font-cairo">{educationPaths.length} مسار تعليمي</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerGuidance;