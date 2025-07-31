import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bookmark, 
  ExternalLink, 
  Search, 
  Filter, 
  Heart,
  Download,
  Edit,
  Copy,
  Sparkles,
  Palette,
  FileImage,
  Layout,
  Star
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Template {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  canvaUrl: string;
  description: string;
  tags: string[];
  isPremium: boolean;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose }) => {
  const [savedTemplates, setSavedTemplates] = useLocalStorage<string[]>('savedTemplates', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // قوالب من Canva (استناداً على القوالب الشائعة)
  const templates: Template[] = [
    // قوالب وسائل التواصل الاجتماعي
    {
      id: '1',
      title: 'منشور انستقرام عربي',
      category: 'social',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/EAFaQMz6_OA-brown-rusty-mystery-novel-book-cover/',
      description: 'قالب منشور انستقرام باللغة العربية',
      tags: ['انستقرام', 'عربي', 'منشور'],
      isPremium: false
    },
    {
      id: '2',
      title: 'قصة انستقرام تفاعلية',
      category: 'social',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/stories/',
      description: 'قالب قصة انستقرام تفاعلية',
      tags: ['قصة', 'انستقرام', 'تفاعلي'],
      isPremium: true
    },
    // قوالب العروض التقديمية
    {
      id: '3',
      title: 'عرض تقديمي احترافي',
      category: 'presentation',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/presentations/',
      description: 'قالب عرض تقديمي احترافي للأعمال',
      tags: ['عرض', 'احترافي', 'أعمال'],
      isPremium: false
    },
    {
      id: '4',
      title: 'عرض تعليمي للطلاب',
      category: 'presentation',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/presentations/education/',
      description: 'قالب عرض تعليمي مناسب للطلاب',
      tags: ['تعليمي', 'طلاب', 'مدرسة'],
      isPremium: false
    },
    // قوالب التصميم الجرافيكي
    {
      id: '5',
      title: 'بوستر إعلاني',
      category: 'design',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/posters/',
      description: 'قالب بوستر إعلاني جذاب',
      tags: ['بوستر', 'إعلان', 'تسويق'],
      isPremium: true
    },
    {
      id: '6',
      title: 'شعار احترافي',
      category: 'design',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/logos/',
      description: 'قالب شعار احترافي للشركات',
      tags: ['شعار', 'لوجو', 'شركة'],
      isPremium: false
    },
    // قوالب المواقع والتطبيقات
    {
      id: '7',
      title: 'واجهة تطبيق جوال',
      category: 'web',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/phone-wallpapers/',
      description: 'قالب واجهة تطبيق جوال حديثة',
      tags: ['تطبيق', 'جوال', 'واجهة'],
      isPremium: true
    },
    {
      id: '8',
      title: 'تصميم موقع ويب',
      category: 'web',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/websites/',
      description: 'قالب تصميم موقع ويب متجاوب',
      tags: ['موقع', 'ويب', 'متجاوب'],
      isPremium: false
    },
    // قوالب المطبوعات
    {
      id: '9',
      title: 'بطاقة عمل احترافية',
      category: 'print',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/business-cards/',
      description: 'قالب بطاقة عمل احترافية',
      tags: ['بطاقة', 'عمل', 'احترافي'],
      isPremium: false
    },
    {
      id: '10',
      title: 'فلاير تسويقي',
      category: 'print',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/flyers/',
      description: 'قالب فلاير تسويقي جذاب',
      tags: ['فلاير', 'تسويق', 'دعاية'],
      isPremium: true
    },
    // قوالب السيرة الذاتية
    {
      id: '11',
      title: 'سيرة ذاتية حديثة',
      category: 'resume',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/resumes/',
      description: 'قالب سيرة ذاتية حديثة وأنيقة',
      tags: ['سيرة', 'ذاتية', 'وظيفة'],
      isPremium: false
    },
    {
      id: '12',
      title: 'CV إبداعي',
      category: 'resume',
      imageUrl: 'https://marketplace.canva.com/EAFaQMz6_OA/2/0/1600w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBE.jpg',
      canvaUrl: 'https://www.canva.com/templates/resumes/creative/',
      description: 'قالب CV إبداعي للمصممين',
      tags: ['CV', 'إبداعي', 'مصمم'],
      isPremium: true
    }
  ];

  const categories = [
    { id: 'all', name: 'الكل', icon: '🌟', count: templates.length },
    { id: 'social', name: 'وسائل التواصل', icon: '📱', count: templates.filter(t => t.category === 'social').length },
    { id: 'presentation', name: 'العروض التقديمية', icon: '📊', count: templates.filter(t => t.category === 'presentation').length },
    { id: 'design', name: 'التصميم الجرافيكي', icon: '🎨', count: templates.filter(t => t.category === 'design').length },
    { id: 'web', name: 'المواقع والتطبيقات', icon: '💻', count: templates.filter(t => t.category === 'web').length },
    { id: 'print', name: 'المطبوعات', icon: '🖨️', count: templates.filter(t => t.category === 'print').length },
    { id: 'resume', name: 'السيرة الذاتية', icon: '📄', count: templates.filter(t => t.category === 'resume').length }
  ];

  // تصفية القوالب
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleSaveTemplate = (templateId: string) => {
    setSavedTemplates(prev => {
      const newSaved = prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId];
      
      const template = templates.find(t => t.id === templateId);
      toast.success(
        newSaved.includes(templateId) 
          ? `تم حفظ ${template?.title}` 
          : `تم إزالة ${template?.title} من المحفوظات`,
        { 
          icon: newSaved.includes(templateId) ? '💾' : '🗑️', 
          duration: 2000 
        }
      );
      
      return newSaved;
    });
    playClickSound();
  };

  const openTemplateInCanva = (template: Template) => {
    window.open(template.canvaUrl, '_blank');
    toast.success(`تم فتح ${template.title} في Canva!`, {
      icon: '🎨',
      duration: 2000
    });
    playSuccessSound();
  };

  const copyTemplateLink = (template: Template) => {
    navigator.clipboard.writeText(template.canvaUrl);
    toast.success(`تم نسخ رابط ${template.title}!`, {
      icon: '📋',
      duration: 2000
    });
    playClickSound();
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Palette className="w-6 h-6 md:w-7 md:h-7" />
                </motion.div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold font-cairo">قوالب Canva الاحترافية</h2>
                  <p className="text-white/80 text-sm font-cairo hidden md:block">
                    اكتشف آلاف القوالب الجاهزة للتخصيص والاستخدام
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-full max-h-[calc(95vh-120px)]">
            {/* Sidebar */}
            <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-700 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-600">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في القوالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-cairo text-sm"
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 font-cairo flex items-center space-x-2 space-x-reverse">
                  <Filter className="w-4 h-4" />
                  <span>الفئات</span>
                </h3>
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 font-cairo text-sm ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 shadow-md'
                        : 'hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-base">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {category.count}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Saved Templates Count */}
              {savedTemplates.length > 0 && (
                <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 space-x-reverse text-blue-700 dark:text-blue-300">
                    <Bookmark className="w-4 h-4" />
                    <span className="font-semibold text-sm font-cairo">
                      {savedTemplates.length} قالب محفوظ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo">
                  {filteredTemplates.length} قالب متاح
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-cairo">
                  🎨 مدعوم من Canva
                </div>
              </div>

              {/* Templates Grid */}
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-600 overflow-hidden group relative"
                    >
                      {/* Premium Badge */}
                      {template.isPremium && (
                        <div className="absolute top-2 left-2 z-10">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                            <Star className="w-3 h-3 inline mr-1" />
                            Pro
                          </div>
                        </div>
                      )}

                      {/* Saved Badge */}
                      {savedTemplates.includes(template.id) && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                            <Bookmark className="w-3 h-3" fill="currentColor" />
                          </div>
                        </div>
                      )}

                      {/* Template Image */}
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileImage className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Template Info */}
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 font-cairo text-sm mb-1 truncate">
                          {template.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-cairo mb-3 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full font-cairo"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openTemplateInCanva(template)}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-3 rounded-lg text-xs font-semibold font-cairo transition-all duration-200 flex items-center justify-center space-x-1 space-x-reverse"
                          >
                            <Edit className="w-3 h-3" />
                            <span>تعديل</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSaveTemplate(template.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              savedTemplates.includes(template.id)
                                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" fill={savedTemplates.includes(template.id) ? "currentColor" : "none"} />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyTemplateLink(template)}
                            className="p-2 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-all duration-200"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
                    لا توجد قوالب
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 font-cairo">
                    جرب تغيير مصطلح البحث أو الفئة
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400 font-cairo">
                <Sparkles className="w-4 h-4" />
                <span>جميع القوالب من</span>
                <a 
                  href="https://www.canva.com/templates/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  Canva.com
                </a>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                <span>{templates.length} قالب متاح</span>
                <span>•</span>
                <span>{savedTemplates.length} محفوظ</span>
                <span>•</span>
                <span>مجاني ومدفوع</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplatesModal;