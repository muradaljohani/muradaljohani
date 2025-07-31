import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, X, Eye, EyeOff, GripVertical, Sparkles, TrendingUp, Filter, Grid, List, Search, Star, Heart, Bookmark } from 'lucide-react';
import { InspirationSite } from '../types';
import { inspirationSites as initialSites } from '../data/sites';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

interface SortableCardProps {
  site: InspirationSite;
  onToggleVisibility: (id: string) => void;
  onVisit: (url: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

const SortableCard: React.FC<SortableCardProps> = ({ site, onToggleVisibility, onVisit, onToggleFavorite, isFavorite }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: site.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  if (!site.isVisible) {
    return null;
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer relative"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Favorite Badge */}
      {isFavorite && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 left-2 z-20"
        >
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <Star className="w-3 h-3 text-white" fill="currentColor" />
          </div>
        </motion.div>
      )}
      
      <div className="p-6 relative z-10">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 right-1 md:top-2 md:right-2 p-1 md:p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          title="اسحب لإعادة الترتيب"
        >
          <GripVertical className="w-3 h-3 md:w-4 md:h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-1 left-1 md:top-2 md:left-2 flex space-x-0.5 md:space-x-1 space-x-reverse opacity-0 group-hover:opacity-100 transition-all duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(site.id);
            }}
            className={`p-1 md:p-1.5 rounded-lg transition-colors duration-200 ${
              isFavorite 
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-yellow-500'
            }` + (isFavorite 
                ? ' bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' 
                : ' hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-yellow-500')}
            title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" fill={isFavorite ? "currentColor" : "none"} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(site.id);
            }}
            className="p-1 md:p-1.5 hover:bg-red-100 dark:hover:bg-red-900 text-gray-400 hover:text-red-500 rounded-lg transition-colors duration-200"
            title="إخفاء الموقع"
          >
            <X className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
          </motion.button>
        </div>

        {/* Icon */}
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-12 h-12 md:w-16 md:h-16 ${site.color} rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl mb-3 md:mb-4 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
        >
          {site.icon}
        </motion.div>

        {/* Content */}
        <div className="text-center space-y-1 md:space-y-2">
          <motion.h3 
            className="text-sm md:text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight"
          >
            {site.name}
          </motion.h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo leading-relaxed hidden md:block">
            {site.description}
          </p>
        </div>

        {/* Visit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onVisit(site.url);
          }}
          className="w-full mt-3 md:mt-6 py-2 md:py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 space-x-reverse font-cairo font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl group-hover:shadow-2xl"
        >
          <motion.div
            whileHover={{ x: 2 }}
          >
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
          </motion.div>
          <span>زيارة الموقع</span>
        </motion.button>
      </div>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-200 dark:group-hover:border-primary-700 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

const InspirationSites: React.FC = () => {
  const [sites, setSites] = useLocalStorage<InspirationSite[]>('inspirationSites', initialSites);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteSites', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'favorites'>('name');
  const [expandFilteredSites, setExpandFilteredSites] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter and search logic
  const filteredSites = sites.filter(site => {
    if (!site.isVisible) return false;
    
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           selectedCategory === 'favorites' && favorites.includes(site.id) ||
                           site.description.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  // Sort sites
  const sortedSites = [...filteredSites].sort((a, b) => {
    switch (sortBy) {
      case 'favorites':
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      case 'name':
        return a.name.localeCompare(b.name, 'ar');
      default:
        return 0;
    }
  });

  // Limit sites display for mobile
  const sitesToShow = isMobile && !expandFilteredSites ? sortedSites.slice(0, 12) : sortedSites;
  const remainingSitesCount = sortedSites.length - sitesToShow.length;
  const hiddenSitesData = sites.filter(site => !site.isVisible);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'الكل', icon: '🌟' },
    { id: 'favorites', name: 'المفضلة', icon: '❤️' },
    { id: 'تعليم', name: 'التعليم', icon: '📚' },
    { id: 'برمجة', name: 'البرمجة', icon: '💻' },
    { id: 'ريادة', name: 'ريادة الأعمال', icon: '🚀' },
    { id: 'إنتاجية', name: 'الإنتاجية', icon: '⚡' },
    { id: 'تصميم', name: 'التصميم', icon: '🎨' }
  ];

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSites((items) => {
        const visibleItems = items.filter(item => item.isVisible);
        const hiddenItems = items.filter(item => !item.isVisible);
        
        const oldIndex = visibleItems.findIndex(item => item.id === active.id);
        const newIndex = visibleItems.findIndex(item => item.id === over.id);
        
        const reorderedVisible = arrayMove(visibleItems, oldIndex, newIndex);
        
        return [...reorderedVisible, ...hiddenItems];
      });
      
      toast.success('تم إعادة ترتيب المواقع!', {
        icon: '🔄',
        duration: 2000
      });
    }
  };

  const toggleSiteVisibility = (id: string) => {
    setSites(prev => prev.map(site => 
      site.id === id ? { ...site, isVisible: !site.isVisible } : site
    ));
    
    const site = sites.find(s => s.id === id);
    toast.success(
      site?.isVisible ? `تم إخفاء ${site.name}` : `تم إظهار ${site?.name}`,
      { icon: site?.isVisible ? '👁️‍🗨️' : '👁️', duration: 2000 }
    );
    playClickSound();
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      
      const site = sites.find(s => s.id === id);
      toast.success(
        newFavorites.includes(id) ? `تم إضافة ${site?.name} للمفضلة` : `تم إزالة ${site?.name} من المفضلة`,
        { icon: newFavorites.includes(id) ? '❤️' : '💔', duration: 2000 }
      );
      
      return newFavorites;
    });
    playClickSound();
  };

  const visitSite = (url: string) => {
    window.open(url, '_blank');
    toast.success('تم فتح الموقع في تبويب جديد!', {
      icon: '🌐',
      duration: 2000
    });
    playClickSound();
  };

  const showAllSites = () => {
    setSites(prev => prev.map(site => ({ ...site, isVisible: true })));
    toast.success('تم إظهار جميع المواقع!', {
      icon: '👁️',
      duration: 2000
    });
    playClickSound();
  };

  const resetOrder = () => {
    setSites(initialSites);
    toast.success('تم إعادة تعيين ترتيب المواقع!', {
      icon: '🔄',
      duration: 2000
    });
    playClickSound();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 font-cairo flex items-center justify-center space-x-2 md:space-x-3 space-x-reverse"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-yellow-500" />
          </motion.div>
          مواقع الإلهام
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-green-500" />
          </motion.div>
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400 font-cairo text-sm md:text-base max-w-2xl mx-auto px-4">
          مجموعة شاملة من أفضل المواقع العربية والسعودية والعالمية للتعلم والإنتاجية وريادة الأعمال
        </p>
      </div>
      
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto px-4"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
          <div className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">
            {sites.filter(s => s.isVisible).length}
          </div>
          <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-cairo">مواقع نشطة</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
          <div className="text-lg md:text-2xl font-bold text-red-600 dark:text-red-400">
            {favorites.length}
          </div>
          <div className="text-xs md:text-sm text-red-600 dark:text-red-400 font-cairo">مفضلة</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
          <div className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
            {sites.filter(s => s.description.includes('سعود') || s.description.includes('عرب')).length}
          </div>
          <div className="text-xs md:text-sm text-green-600 dark:text-green-400 font-cairo">عربية</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
          <div className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">
            {filteredSites.length}
          </div>
          <div className="text-xs md:text-sm text-purple-600 dark:text-purple-400 font-cairo">ظاهرة</div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 md:p-6 mx-2 md:mx-0"
      >
        {/* Search Bar */}
        <div className="relative mb-3 md:mb-6">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث في المواقع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-cairo text-sm md:text-base"
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-6">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1 md:space-x-2 space-x-reverse px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl transition-all duration-200 font-cairo text-xs md:text-sm ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }` + (selectedCategory === category.id
                ? ' bg-primary-500 text-white shadow-lg'
                : ' bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600')}
            >
              <span className="text-xs md:text-sm">{category.icon}</span>
              <span>{category.name}</span>
              {category.id === 'favorites' && favorites.length > 0 && (
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-2 md:gap-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">العرض:</span>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 md:p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }` + (viewMode === 'grid' 
                    ? ' bg-white dark:bg-gray-600 text-primary-500 shadow-sm' 
                    : ' text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}
                >
                  <Grid className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 md:p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }` + (viewMode === 'list' 
                    ? ' bg-white dark:bg-gray-600 text-primary-500 shadow-sm' 
                    : ' text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}
                >
                  <List className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse hidden md:flex">
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">ترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-cairo focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="name">الاسم</option>
                <option value="favorites">المفضلة أولاً</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetOrder}
              className="px-3 py-1 md:px-4 md:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-xs md:text-sm font-cairo"
            >
              إعادة تعيين
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Sites Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedSites.map(site => site.id)} strategy={rectSortingStrategy}>
          <motion.div 
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6' 
                : 'grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'
            }` + (viewMode === 'grid' 
                ? ' grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6' 
                : ' grid-cols-1 md:grid-cols-2 gap-3 md:gap-4')}
            style={{ padding: '0 8px' }}
            layout
          >
            <AnimatePresence>
              {sitesToShow.map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                <SortableCard
                  site={site}
                  onToggleVisibility={toggleSiteVisibility}
                  onVisit={visitSite}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(site.id)}
                />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>
      
      {/* Show More Button for Mobile */}
      {isMobile && remainingSitesCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setExpandFilteredSites(true);
            }}
            className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 font-cairo font-semibold"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              📚
            </motion.div>
            <span>عرض {remainingSitesCount} موقع إضافي</span>
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ⬇️
            </motion.div>
          </motion.button>
        </motion.div>
      )}
      {/* No Results */}
      {sitesToShow.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-4xl md:text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 dark:text-gray-500 font-cairo">
            جرب تغيير مصطلح البحث أو الفئة
          </p>
        </motion.div>
      )}

      {/* Hidden Sites Indicator */}
      {hiddenSitesData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="inline-flex items-center space-x-2 md:space-x-4 space-x-reverse bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl md:rounded-2xl px-3 md:px-6 py-2 md:py-4 shadow-lg">
            <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-400">
              <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-cairo">
                {hiddenSitesData.length} موقع مخفي
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={showAllSites}
              className="flex items-center space-x-1 md:space-x-2 space-x-reverse px-2 md:px-4 py-1 md:py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg md:rounded-xl transition-all duration-200 font-cairo text-xs md:text-sm shadow-md hover:shadow-lg"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span>إظهار الكل</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Usage Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl md:rounded-2xl p-3 md:p-6 font-cairo shadow-lg mx-2 md:mx-0"
      >
        <div className="flex items-center justify-center space-x-3 md:space-x-6 space-x-reverse flex-wrap gap-2 md:gap-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <GripVertical className="w-3 h-3 md:w-4 md:h-4" />
            <span>اسحب لإعادة الترتيب</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Heart className="w-3 h-3 md:w-4 md:h-4" />
            <span>أضف للمفضلة</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <X className="w-3 h-3 md:w-4 md:h-4" />
            <span>إخفاء الموقع</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Search className="w-3 h-3 md:w-4 md:h-4" />
            <span>ابحث وصنف</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InspirationSites;