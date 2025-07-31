import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  Calendar,
  ExternalLink,
  Filter,
  TrendingUp,
  Clock,
  Tag,
  Flame,
  Eye,
  Share2,
  Bookmark,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { saudiTechNews, categories, TechNews } from '../data/techNews';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

const SaudiTechNews: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useLocalStorage('techNewsExpanded', true);
  const [bookmarkedNews, setBookmarkedNews] = useLocalStorage<string[]>('bookmarkedNews', []);
  const [showOnlyHot, setShowOnlyHot] = useState(false);

  // Filter news based on category, search, and hot filter
  const filteredNews = saudiTechNews.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesHot = !showOnlyHot || news.isHot;
    
    return matchesCategory && matchesSearch && matchesHot;
  });

  // Sort news by date (newest first)
  const sortedNews = filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleBookmark = (newsId: string) => {
    setBookmarkedNews(prev => {
      const newBookmarks = prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId];
      
      const news = saudiTechNews.find(n => n.id === newsId);
      toast.success(
        newBookmarks.includes(newsId) 
          ? `تم حفظ: ${news?.title.slice(0, 30)}...`
          : `تم إزالة: ${news?.title.slice(0, 30)}...`,
        { icon: newBookmarks.includes(newsId) ? '🔖' : '🗑️', duration: 2000 }
      );
      
      return newBookmarks;
    });
    playClickSound();
  };

  const shareNews = (news: TechNews) => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.summary,
        url: news.url,
      });
    } else {
      navigator.clipboard.writeText(`${news.title}\n${news.summary}\n${news.url}`);
      toast.success('تم نسخ الرابط!', { icon: '📋' });
    }
    playClickSound();
  };

  const visitNews = (url: string) => {
    window.open(url, '_blank');
    playSuccessSound();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const newsDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - newsDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `منذ ${diffInWeeks} أسبوع`;
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
            أخبار التقنية السعودية
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6 font-cairo">
            آخر أخبار التقنية والابتكار في المملكة
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-cairo"
          >
            عرض الأخبار
          </button>
        </div>
      </motion.div>
    );
  }

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
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Newspaper className="w-8 h-8 text-blue-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
            🇸🇦 أخبار التقنية السعودية
          </h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 font-cairo mb-6">
          آخر أخبار التقنية والابتكار في المملكة العربية السعودية
        </p>
        
        <button
          onClick={() => setIsExpanded(false)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg transition-colors duration-200 text-sm font-cairo"
        >
          إخفاء القسم
        </button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4 max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {saudiTechNews.length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400 font-cairo">خبر</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {saudiTechNews.filter(n => n.isHot).length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400 font-cairo">ساخن</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {bookmarkedNews.length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 font-cairo">محفوظ</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {filteredNews.length}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400 font-cairo">ظاهر</div>
        </div>
      </motion.div>

      {/* Filters */}
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
            placeholder="ابحث في الأخبار..."
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
              className={`px-4 py-2 rounded-xl transition-all duration-200 font-cairo text-sm ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
        
        {/* Hot Filter Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyHot}
                onChange={(e) => setShowOnlyHot(e.target.checked)}
                className="w-5 h-5 text-red-500 border-2 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="flex items-center space-x-1 space-x-reverse text-gray-700 dark:text-gray-300 font-cairo">
                <Flame className="w-4 h-4 text-red-500" />
                <span>الأخبار الساخنة فقط</span>
              </span>
            </label>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 font-cairo">
            {filteredNews.length} من {saudiTechNews.length} خبر
          </div>
        </div>
      </motion.div>

      {/* News Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {sortedNews.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Hot Badge */}
              {news.isHot && (
                <div className="absolute top-4 left-4 z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center space-x-1 space-x-reverse bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  >
                    <Flame className="w-3 h-3" />
                    <span>ساخن</span>
                  </motion.div>
                </div>
              )}
              
              {/* Bookmark Button */}
              <div className="absolute top-4 right-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(news.id);
                  }}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    bookmarkedNews.includes(news.id)
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={bookmarkedNews.includes(news.id) ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                    {news.category}
                  </span>
                  <div className="flex items-center space-x-1 space-x-reverse text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{getTimeAgo(news.date)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {news.title}
                </h3>

                {/* Summary */}
                <p className="text-gray-600 dark:text-gray-400 text-sm font-cairo leading-relaxed mb-4 line-clamp-3">
                  {news.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {news.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center space-x-1 space-x-reverse bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                    >
                      <Tag className="w-2 h-2" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-500 text-xs">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📰</span>
                    </div>
                    <span className="font-cairo">{news.source}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        shareNews(news);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        visitNews(news.url);
                      }}
                      className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-xs font-cairo"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>اقرأ المزيد</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredNews.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
            لا توجد أخبار
          </h3>
          <p className="text-gray-500 dark:text-gray-500 font-cairo">
            جرب تغيير الفئة أو مصطلح البحث
          </p>
        </motion.div>
      )}

      {/* Footer Info */}
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
            📡
          </motion.div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-cairo">
            مركز أخبار التقنية السعودية
          </h3>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🇸🇦
          </motion.div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-base font-cairo mb-4 leading-relaxed">
          نتابع لك آخر أخبار التقنية والابتكار في المملكة العربية السعودية
        </p>
        <div className="flex items-center justify-center space-x-6 space-x-reverse text-sm">
          <div className="flex items-center space-x-2 space-x-reverse text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-cairo">تحديث يومي</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-purple-600 dark:text-purple-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="font-cairo">مصادر موثوقة</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-pink-600 dark:text-pink-400">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="font-cairo">محتوى حصري</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SaudiTechNews;