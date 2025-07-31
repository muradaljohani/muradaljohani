import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Filter, 
  BookOpen, 
  Clock, 
  Tag,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  Zap,
  Star,
  Bookmark,
  History,
  ChevronRight
} from 'lucide-react';
import * as fuzzball from 'fuzzball';
import { knowledgeBase, knowledgeCategories, difficultyLevels, KnowledgeEntry } from '../data/knowledgeBase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (entry: KnowledgeEntry) => void;
}

interface SearchResult extends KnowledgeEntry {
  score: number;
  matchedKeywords: string[];
}

interface SearchSuggestion {
  text: string;
  type: 'query' | 'category' | 'tag';
  icon: string;
  count?: number;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedSearches, setSavedSearches] = useLocalStorage<string[]>('savedSearches', []);
  const [popularSearches, setPopularSearches] = useLocalStorage<{[key: string]: number}>('popularSearches', {});
  const [searchCache, setSearchCache] = useLocalStorage<{[key: string]: SearchResult[]}>('searchCache', {});

  // Enhanced popular searches based on user behavior
  const defaultPopularSearches = [
    'لغات البرمجة',
    'أكاديمية طويق',
    'الذكاء الاصطناعي',
    'Git',
    'Python',
    'JavaScript',
    'الأمن السيبراني',
    'سدايا',
    'نصائح برمجة',
    'مواقع تعليمية',
    'هاكاثون',
    'نيوم',
    'البلوك تشين',
    'API'
  ];

  // Generate smart search suggestions
  const generateSuggestions = (query: string): SearchSuggestion[] => {
    if (query.length < 2) return [];
    
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();
    
    // Search in knowledge base titles and keywords
    knowledgeBase.forEach(entry => {
      // Title matching
      if (entry.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: entry.title,
          type: 'query',
          icon: '📖'
        });
      }
      
      // Keywords matching
      entry.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(queryLower) && 
            !suggestions.find(s => s.text === keyword)) {
          suggestions.push({
            text: keyword,
            type: 'query',
            icon: '🔍'
          });
        }
      });
      
      // Tags matching
      entry.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower) && 
            !suggestions.find(s => s.text === tag)) {
          suggestions.push({
            text: tag,
            type: 'tag',
            icon: '🏷️'
          });
        }
      });
    });
    
    // Add category suggestions
    knowledgeCategories.forEach(category => {
      if (category.name.toLowerCase().includes(queryLower) && category.id !== 'all') {
        const count = knowledgeBase.filter(entry => entry.category === category.id).length;
        suggestions.push({
          text: category.name,
          type: 'category',
          icon: category.icon,
          count
        });
      }
    });
    
    // Sort by relevance and limit
    return suggestions
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.text.toLowerCase() === queryLower ? 1 : 0;
        const bExact = b.text.toLowerCase() === queryLower ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        
        // Then by text length (shorter = more relevant)
        return a.text.length - b.text.length;
      })
      .slice(0, 8);
  };

  // Load data on component mount
  useEffect(() => {
    // Load popular searches from user behavior
    const topSearches = Object.entries(popularSearches)
      .sort(([,a], [,b]) => b - a)
      .map(([search]) => search)
      .slice(0, 10);
    
    if (topSearches.length === 0) {
      // Fallback to default popular searches
      defaultPopularSearches.forEach(search => {
        setPopularSearches(prev => ({ ...prev, [search]: 1 }));
      });
    }
  }, []);

  // Generate suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const newSuggestions = generateSuggestions(searchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Perform fuzzy search
  const performSearch = useMemo(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // Check cache first
    const cacheKey = `${searchTerm.toLowerCase()}-${selectedCategory}-${selectedDifficulty}`;
    if (searchCache[cacheKey]) {
      setSearchResults(searchCache[cacheKey]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Filter by category and difficulty first
    let filteredEntries = knowledgeBase.filter(entry => {
      const categoryMatch = selectedCategory === 'all' || entry.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || entry.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });

    // Perform fuzzy search
    const results: SearchResult[] = [];

    filteredEntries.forEach(entry => {
      let bestScore = 0;
      let matchedKeywords: string[] = [];

      // Search in title
      const titleScore = fuzzball.ratio(searchTerm.toLowerCase(), entry.title.toLowerCase());
      if (titleScore > bestScore) {
        bestScore = titleScore;
      }

      // Search in description
      const descScore = fuzzball.ratio(searchTerm.toLowerCase(), entry.description.toLowerCase());
      if (descScore > bestScore) {
        bestScore = descScore;
      }

      // Search in keywords
      entry.keywords.forEach(keyword => {
        const keywordScore = fuzzball.ratio(searchTerm.toLowerCase(), keyword.toLowerCase());
        if (keywordScore > bestScore) {
          bestScore = keywordScore;
          matchedKeywords = [keyword];
        } else if (keywordScore === bestScore && keywordScore > 60) {
          matchedKeywords.push(keyword);
        }
      });

      // Search in tags
      entry.tags.forEach(tag => {
        const tagScore = fuzzball.ratio(searchTerm.toLowerCase(), tag.toLowerCase());
        if (tagScore > bestScore) {
          bestScore = tagScore;
        }
      });

      // Search in response text
      const responseText = typeof entry.response === 'string' ? entry.response : '';
      const responseScore = fuzzball.partial_ratio(searchTerm.toLowerCase(), responseText.toLowerCase());
      if (responseScore > bestScore) {
        bestScore = responseScore;
      }

      // Include results with score > 30
      if (bestScore > 30) {
        results.push({
          ...entry,
          score: bestScore,
          matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : entry.keywords.slice(0, 2)
        });
      }
    });

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);

    // Cache the results
    setSearchCache(prev => ({
      ...prev,
      [cacheKey]: results.slice(0, 20) // Cache top 20 results
    }));

    setSearchResults(results);
    setIsSearching(false);
    
    // Hide suggestions when showing results
    setShowSuggestions(false);
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  // Handle search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch;
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [performSearch]);

  // Handle search submission
  const handleSearch = (term: string) => {
    if (!term.trim()) return;

    setSearchTerm(term);
    
    // Add to search history
    const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 10);
    setSearchHistory(newHistory);
    
    // Update popular searches count
    setPopularSearches(prev => ({
      ...prev,
      [term]: (prev[term] || 0) + 1
    }));
    
    playClickSound();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(knowledgeCategories.find(cat => cat.name === suggestion.text)?.id || 'all');
      setSearchTerm('');
    } else {
      setSearchTerm(suggestion.text);
      handleSearch(suggestion.text);
    }
    setShowSuggestions(false);
    playClickSound();
  };

  // Save search for later
  const saveSearch = (term: string) => {
    if (!savedSearches.includes(term)) {
      setSavedSearches(prev => [term, ...prev.slice(0, 9)]);
      toast.success(`تم حفظ البحث: ${term}`, { icon: '🔖' });
    } else {
      setSavedSearches(prev => prev.filter(search => search !== term));
      toast.success(`تم إزالة البحث المحفوظ: ${term}`, { icon: '🗑️' });
    }
    playClickSound();
  };

  // Handle result selection
  const handleSelectResult = (entry: KnowledgeEntry) => {
    onSelectResult(entry);
    onClose();
    
    // Add to popular searches
    setPopularSearches(prev => ({
      ...prev,
      [entry.title]: (prev[entry.title] || 0) + 1
    }));
    
    toast.success(`تم اختيار: ${entry.title}`);
    playSuccessSound();
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setShowSuggestions(false);
    playClickSound();
  };

  // Get top popular searches for display
  const getTopPopularSearches = () => {
    return Object.entries(popularSearches)
      .sort(([,a], [,b]) => b - a)
      .map(([search]) => search)
      .slice(0, 8);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'intermediate': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900';
      case 'advanced': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700 mx-2 md:mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-3 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-6 h-6 md:w-7 md:h-7" />
                </motion.div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold font-cairo">البحث المتقدم</h2>
                  <p className="text-white/80 text-sm font-cairo hidden md:block">
                    ابحث في {knowledgeBase.length} مادة معرفية باستخدام البحث الذكي
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col h-full max-h-[calc(95vh-100px)] md:max-h-[calc(90vh-120px)]">
            {/* Sidebar */}
            <div className="w-full bg-gray-50 dark:bg-gray-700 p-3 md:p-4 border-b border-gray-200 dark:border-gray-600 md:hidden">
              {/* Mobile Header */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo">
                  🔍 البحث في قاعدة المعرفة
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-cairo">
                  {knowledgeBase.length} مادة معرفية متاحة
                </p>
              </div>
              
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في قاعدة المعرفة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-cairo text-base"
                />
              </div>

              {/* Mobile Categories - Horizontal Scroll */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 font-cairo mb-2 flex items-center space-x-2 space-x-reverse">
                  <Filter className="w-4 h-4" />
                  <span>الفئات</span>
                </h3>
                <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2 scrollbar-hide">
                  {knowledgeCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex-shrink-0 flex items-center space-x-1.5 space-x-reverse p-2.5 rounded-lg transition-all duration-200 font-cairo text-sm whitespace-nowrap ${
                        selectedCategory === category.id
                          ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                          : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-500'
                      }`}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-500 text-gray-500 dark:text-gray-400'
                      }`}>
                        {category.id === 'all' ? knowledgeBase.length : knowledgeBase.filter(entry => entry.category === category.id).length}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Difficulty Filter */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 font-cairo mb-2">مستوى الصعوبة</h3>
                <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2 scrollbar-hide">
                  {difficultyLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`flex-shrink-0 flex items-center space-x-1.5 space-x-reverse p-2 rounded-lg transition-all duration-200 font-cairo text-sm whitespace-nowrap ${
                        selectedDifficulty === level.id
                          ? `bg-gradient-to-r ${level.color} text-white shadow-md`
                          : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-500'
                      }`}
                    >
                      <span className="text-sm">{level.icon}</span>
                      <span className="text-sm">{level.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-72 bg-gray-50 dark:bg-gray-700 p-4 border-r border-gray-200 dark:border-gray-600 flex-col">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في قاعدة المعرفة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-cairo text-sm"
                />
                
                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-right p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="text-sm">{suggestion.icon}</span>
                              <span className="text-sm font-cairo text-gray-800 dark:text-gray-200">
                                {suggestion.text}
                              </span>
                              {suggestion.type === 'category' && suggestion.count && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  {suggestion.count}
                                </span>
                              )}
                            </div>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Categories */}
              <div className="space-y-2 mb-6">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 font-cairo flex items-center space-x-2 space-x-reverse">
                  <Filter className="w-4 h-4" />
                  <span>الفئات</span>
                </h3>
                {knowledgeCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 font-cairo text-sm ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                        : 'hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-base">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {category.id === 'all' ? knowledgeBase.length : knowledgeBase.filter(entry => entry.category === category.id).length}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Desktop Difficulty Filter */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 font-cairo">مستوى الصعوبة</h3>
                <div className="space-y-1">
                  {difficultyLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`w-full flex items-center space-x-2 space-x-reverse p-2 rounded-lg transition-all duration-200 font-cairo text-sm ${
                        selectedDifficulty === level.id
                          ? `bg-gradient-to-r ${level.color} text-white shadow-md`
                          : 'hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-sm">{level.icon}</span>
                      <span>{level.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-3 md:p-6 overflow-y-auto">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo">
                  {searchResults.length > 0 ? `${searchResults.length} نتيجة` : 'ابدأ البحث'}
                </h3>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-red-500 hover:text-red-600 font-cairo"
                  >
                    مسح البحث
                  </button>
                )}
              </div>

              {/* Quick Searches */}
              {!searchTerm && (
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  {/* Saved Searches */}
                  {savedSearches.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-cairo flex items-center space-x-1.5 space-x-reverse">
                        <Bookmark className="w-4 h-4" />
                        <span>عمليات بحث محفوظة:</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {savedSearches.map((search, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSearch(search)}
                            className="flex items-center space-x-1 space-x-reverse px-2.5 md:px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-xs md:text-sm font-cairo hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
                          >
                            <Bookmark className="w-3 h-3" />
                            <span>{search}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recent Searches */}
                  {searchHistory.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-cairo flex items-center space-x-1.5 space-x-reverse">
                        <History className="w-4 h-4" />
                        <span>عمليات بحث حديثة:</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {searchHistory.slice(0, 5).map((search, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSearch(search)}
                            className="px-2.5 md:px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs md:text-sm font-cairo hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                          >
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-cairo flex items-center space-x-1.5 space-x-reverse">
                      <TrendingUp className="w-4 h-4" />
                      <span>عمليات بحث شائعة:</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {(getTopPopularSearches().length > 0 ? getTopPopularSearches() : defaultPopularSearches).slice(0, 8).map((search, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSearch(search)}
                          className="flex items-center space-x-1 space-x-reverse px-2.5 md:px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs md:text-sm font-cairo hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          <Star className="w-3 h-3" />
                          <span>{search}</span>
                          {popularSearches[search] && popularSearches[search] > 1 && (
                            <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 px-1 py-0.5 rounded-full">
                              {popularSearches[search]}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  <AnimatePresence>
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 md:p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 group active:scale-95"
                        onClick={() => handleSelectResult(result)}
                      >
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                          <div className="flex-1">
                            <div className="flex items-start flex-col md:flex-row md:items-center md:space-x-3 md:space-x-reverse mb-2">
                              <h3 className="font-bold text-gray-800 dark:text-gray-200 font-cairo text-base md:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                                {result.title}
                              </h3>
                              <div className="flex items-center space-x-1 space-x-reverse mt-1 md:mt-0">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getDifficultyColor(result.difficulty)}`}>
                                  {result.difficulty === 'beginner' ? 'مبتدئ' : 
                                   result.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                                </span>
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                                  {Math.round(result.score)}%
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-cairo mb-2 leading-relaxed">
                              {result.description}
                            </p>
                            
                            <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center space-x-1 space-x-reverse">
                                <Tag className="w-3 h-3" />
                                <span>{result.category}</span>
                              </span>
                              <span className="flex items-center space-x-1 space-x-reverse">
                                <Clock className="w-3 h-3" />
                                <span>{result.lastUpdated}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                saveSearch(result.title);
                              }}
                              className={`p-1.5 rounded-lg transition-colors duration-200 ${
                                savedSearches.includes(result.title)
                                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-green-500'
                              }`}
                              title={savedSearches.includes(result.title) ? 'إزالة من المحفوظات' : 'حفظ البحث'}
                            >
                              <Bookmark className="w-4 h-4" fill={savedSearches.includes(result.title) ? "currentColor" : "none"} />
                            </motion.button>
                            
                          <motion.div
                            whileHover={{ x: 3 }}
                            className="opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200 flex-shrink-0 ml-2"
                          >
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                          </motion.div>
                          </div>
                        </div>
                        
                        {/* Matched Keywords */}
                        {result.matchedKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.matchedKeywords.slice(0, 3).map((keyword, keyIndex) => (
                              <span
                                key={keyIndex}
                                className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs px-1.5 py-0.5 rounded-full font-cairo"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : searchTerm && !isSearching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 md:py-12"
                >
                  <div className="text-4xl md:text-6xl mb-3 md:mb-4">🔍</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
                    لا توجد نتائج
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-500 font-cairo mb-3 md:mb-4 px-4">
                    جرب مصطلحات بحث مختلفة أو قم بتغيير الفلاتر
                  </p>
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-cairo text-sm md:text-base"
                  >
                    مسح البحث
                  </button>
                </motion.div>
              ) : !searchTerm ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 md:py-12"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-4xl md:text-6xl mb-3 md:mb-4"
                  >
                    🔍
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
                    ابدأ البحث
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-500 font-cairo px-4">
                    اكتب كلمة أو جملة للبحث في قاعدة المعرفة
                  </p>
                </motion.div>
              ) : null}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-1.5 space-x-reverse text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">
                <Sparkles className="w-4 h-4" />
                <span>البحث مدعوم بـ</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">Fuzzball.js</span>
                <span>+ تقنيات ذكية</span>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                <span>{knowledgeBase.length} مادة</span>
                <span>•</span>
                <span>{knowledgeCategories.length - 1} فئة</span>
                <span>•</span>
                <span>{Object.keys(searchCache).length} نتيجة محفوظة</span>
                <span>•</span>
                <span>{savedSearches.length} بحث محفوظ</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;