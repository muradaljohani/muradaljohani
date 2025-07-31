import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Brain, Sparkles, Search, Loader, MessageCircle, Zap, MessageSquare, BookOpen, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { inspirationSites } from '../data/sites';
import { playClickSound, playSuccessSound, playTypingSound } from '../utils/soundUtils';
import { sendQuestionNotification, checkWhatsAppAPIStatus } from '../utils/whatsappAPI';
import WhatsAppModal from './WhatsAppModal';
import NotesModal from './NotesModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { knowledgeBase } from '../data/knowledgeBase';

// قواعد التحيات الجديدة
const greetings = {
  'السلام عليكم': 'وعليكم السلام! كيف يمكنني مساعدتك في البرمجة أو التقنية؟',
  'مرحبا': 'أهلا! اسألني عن البرمجة، التقنية، أو الثقافة السعودية!',
  'اهلا': 'أهلا وسهلا! جاهز للإجابة عن أسئلتك.',
  'صباح الخير': 'صباح النور! يوم رائع للبرمجة، أليس كذلك؟',
  'مساء الخير': 'مساء النور! كيف أساعدك اليوم؟',
  'كيف حالك': 'بخير، شكرًا! وأنت، هل أنت مبرمج؟',
  'مرحبا بك': 'شكرًا! أهلا بك، ما سؤالك؟',
  'هلا': 'هلا والله! اسألني أي شيء عن التقنية.',
  'سلام': 'سلام! جاهز لمساعدتك.',
  'أهلين': 'أهلين وسهلين! ما الجديد؟',
  'hello': 'Hello! اسألني عن البرمجة والتقنية!',
  'hi': 'Hi! أهلا بك، كيف أساعدك؟'
};


interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface AIResponse {
  answer: string;
  confidence: number;
  sources?: any[];
  suggestions?: string[];
}

const AskMuraad: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "مرحباً! أنا مساعد مراد الذكي 🤖\n\nأساعدك في العثور على أفضل المواقع التعليمية والإنتاجية. اسألني عن أي موضوع!\n\nيمكنك أيضاً مشاركة الأسئلة والأجوبة عبر واتساب.",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "مواقع تعلم البرمجة",
        "مواقع الذكاء الاصطناعي",
        "جامعات سعودية",
        "دورات مجانية",
        "من صنعك؟"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{question: string, answer: string} | null>(null);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [noteData, setNoteData] = useState<{question: string, answer: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(false);
  const [chatHistory, setChatHistory] = useLocalStorage<string[]>('chatHistory', []);

  // قاعدة البيانات الذكية
  const sites = inspirationSites.filter(site => site.isVisible);

  // فحص حالة واتساب API عند تحميل المكون
  useEffect(() => {
    checkWhatsAppAPIStatus().then(status => {
      setWhatsappEnabled(status);
      if (status) {
        console.log('✅ WhatsApp API متاح');
      } else {
        console.log('❌ WhatsApp API غير متاح - تحقق من الإعدادات');
      }
    });
  }, []);

  // Generate smart suggestions based on input
  const generateQuickSuggestions = (text: string): string[] => {
    if (text.length < 2) return [];
    
    const suggestions: string[] = [];
    const textLower = text.toLowerCase();
    
    // Search in knowledge base for matching keywords
    knowledgeBase.forEach(entry => {
      entry.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(textLower) && 
            !suggestions.includes(keyword) && 
            suggestions.length < 6) {
          suggestions.push(keyword);
        }
      });
    });
    
    // Add from chat history
    chatHistory.forEach(msg => {
      if (msg.toLowerCase().includes(textLower) && 
          !suggestions.includes(msg) && 
          suggestions.length < 8) {
        suggestions.push(msg);
      }
    });
    
    return suggestions.slice(0, 6);
  };

  // Handle input change with suggestions
  const handleInputChange = (value: string) => {
    setInput(value);
    const suggestions = generateQuickSuggestions(value);
    setQuickSuggestions(suggestions);
    setShowQuickSuggestions(suggestions.length > 0 && value.length >= 2);
  };
  // الكلمات المفتاحية الذكية
  const keywordCategories = {
    programming: ['برمجة', 'برمجه', 'كود', 'تطوير', 'مطور', 'developer', 'programming', 'coding'],
    education: ['تعليم', 'تعلم', 'دراسة', 'جامعة', 'كلية', 'دورة', 'كورس', 'education'],
    ai: ['ذكاء اصطناعي', 'ai', 'artificial intelligence', 'machine learning', 'تعلم آلي'],
    saudi: ['سعودي', 'سعودية', 'المملكة', 'رياض', 'جدة', 'مكة', 'المدينة', 'saudi'],
    university: ['جامعة', 'كلية', 'university', 'college', 'academic'],
    free: ['مجاني', 'مجانا', 'free', 'مجانية'],
    design: ['تصميم', 'design', 'graphic', 'ui', 'ux'],
    business: ['أعمال', 'ريادة', 'مشروع', 'business', 'entrepreneur'],
    health: ['صحة', 'طب', 'صحي', 'health', 'medical'],
    technology: ['تقنية', 'تكنولوجيا', 'technology', 'tech']
  };

  // محرك الذكاء الاصطناعي
  const processQuery = (query: string): AIResponse => {
    const q = query.toLowerCase().trim();
    
    // دالة لتوليد اقتراحات ذكية
    const generateSmartSuggestions = (query: string): string[] => {
      const suggestions: string[] = [];
      
      if (query.includes('برمجة') || query.includes('programming')) {
        suggestions.push("لغات البرمجة", "أدوات التطوير", "نصائح البرمجة", "مواقع برمجة");
      }
      if (query.includes('أمن') || query.includes('security')) {
        suggestions.push("الأمن السيبراني", "VPN", "جدران الحماية");
      }
      if (query.includes('ذكاء') || query.includes('ai')) {
        suggestions.push("الذكاء الاصطناعي", "التعلم الآلي", "تقنيات AI");
      }
      if (query.includes('سعود') || query.includes('saudi')) {
        suggestions.push("رؤية 2030", "أكاديمية طويق", "سدايا", "نيوم");
      }
      
      // اقتراحات افتراضية
      if (suggestions.length === 0) {
        suggestions.push("مواقع تعليمية", "لغات البرمجة", "الذكاء الاصطناعي", "أدوات التطوير", "نصائح برمجة");
      }
      
      return suggestions.slice(0, 5);
    };
    
    // التحقق من التحيات أولاً
    for (const [greeting, response] of Object.entries(greetings)) {
      if (q === greeting.toLowerCase() || q.includes(greeting.toLowerCase())) {
        return {
          answer: response,
          confidence: 100,
          suggestions: ["مواقع برمجة", "لغات البرمجة", "أدوات التطوير", "نصائح برمجة", "الذكاء الاصطناعي"]
        };
      }
    }
    
    // البحث في قاعدة البيانات المعرفية الجديدة
    for (const entry of knowledgeBase) {
      const matchFound = entry.keywords.some(keyword => 
        q.includes(keyword.toLowerCase())
      );
      
      if (matchFound) {
        let answer = '';
        if (typeof entry.response === 'function') {
          answer = entry.response();
        } else {
          answer = entry.response;
        }
        
        return {
          answer,
          confidence: 95,
          suggestions: generateSmartSuggestions(q)
        };
      }
    }
    
    if (q.includes('ماذا تستطيع') || q.includes('what can you do') || q.includes('مساعدة')) {
      return {
        answer: `أستطيع مساعدتك في العديد من المجالات التقنية:

🔍 **البحث في المواقع**: أكثر من ${sites.length} موقع تعليمي وإنتاجي
💻 **البرمجة**: لغات البرمجة، أدوات التطوير، نصائح البرمجة
🛡️ **الأمن السيبراني**: حماية البيانات، VPN، جدران الحماية  
🤖 **الذكاء الاصطناعي**: شرح تقنيات AI والتعلم الآلي
🌐 **التقنيات الحديثة**: 5G، البلوك تشين، إنترنت الأشياء
🇸🇦 **المحتوى السعودي**: رؤية 2030، سدايا، أكاديمية طويق
🎓 **التعليم التقني**: أفضل الجامعات والمعاهد التقنية

فقط اسألني أي سؤال تقني أو اطلب مني البحث عن موقع معين!`,
        confidence: 100,
        suggestions: ["لغات البرمجة", "أفضل لاب توب", "الأمن السيبراني", "أكاديمية طويق", "الذكاء الاصطناعي"]
      };
    }

    if (q.includes('اليوم') || q.includes('today') || q.includes('التاريخ')) {
      const today = new Date().toLocaleDateString('ar-SA', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return {
        answer: `اليوم هو ${today} 📅 يوم رائع للتعلم والبرمجة! ماذا تريد أن تتعلم اليوم؟`,
        confidence: 100,
        suggestions: ["نصائح برمجة", "لغات جديدة", "أدوات التطوير", "مواقع تعليمية"]
      };
    }

    // البحث الذكي في المواقع
    let matchedSites: any[] = [];
    let confidence = 0;
    
    // البحث في أسماء ووصف المواقع
    sites.forEach(site => {
      const searchText = `${site.name} ${site.description}`.toLowerCase();
      let score = 0;

      // مطابقة مباشرة للكلمات
      const queryWords = q.split(' ').filter(word => word.length > 2);
      queryWords.forEach(word => {
        if (searchText.includes(word)) {
          score += 10;
        }
      });

      // إضافة نقاط للمطابقات المهمة
      if (searchText.includes('سعود') || searchText.includes('السعودية')) score += 15;
      if (searchText.includes('برمج') || searchText.includes('تطوير')) score += 15;
      if (searchText.includes('تعليم') || searchText.includes('جامعة')) score += 15;
      if (searchText.includes('ذكاء') || searchText.includes('ai')) score += 15;
      if (searchText.includes('مجان')) score += 10;
      if (searchText.includes('تصميم')) score += 15;

      if (score > 0) {
        matchedSites.push({ ...site, score });
      }
    });

    matchedSites.sort((a, b) => b.score - a.score);
    matchedSites = matchedSites.slice(0, 6);

    if (matchedSites.length > 0) {
      confidence = Math.min(90, matchedSites[0].score * 2);
      
      let answer = `وجدت ${matchedSites.length} موقع رائع لك! 🎯\n\n`;
      
      matchedSites.forEach((site, index) => {
        answer += `**${index + 1}. ${site.name}** ${site.icon}\n`;
        answer += `📝 ${site.description}\n`;
        answer += `🔗 [زيارة الموقع](${site.url})\n\n`;
      });

      // اقتراحات ذكية
      const suggestions = [];
      suggestions.push("المزيد من المواقع", "مجالات أخرى", "نصائح تقنية");
      
      return {
        answer,
        confidence,
        sources: matchedSites,
        suggestions
      };
    }

    // إجابة افتراضية ذكية
    return {
      answer: `لم أجد إجابة مطابقة تماماً لسؤالك 🤔 \n\nيمكنك تجربة:\n• أسئلة حول البرمجة ولغاتها\n• أسئلة عن الأدوات التقنية\n• البحث عن مواقع محددة\n• أسئلة عن التقنيات الحديثة\n\nأو جرب هذه الاقتراحات الذكية! 👇`,
      confidence: 30,
      suggestions: [
        "لغات البرمجة", 
        "أدوات التطوير", 
        "الذكاء الاصطناعي", 
        "أكاديمية طويق",
        "مواقع تعليمية"
      ]
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add to chat history
    setChatHistory(prev => {
      const newHistory = [input.trim(), ...prev.filter(msg => msg !== input.trim())].slice(0, 20);
      return newHistory;
    });
    const userMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickSuggestions(false);
    setIsTyping(true);
    playClickSound();

    // محاكاة وقت المعالجة
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const aiResponse = processQuery(userMessage.text);
    
    const botMessage: Message = {
      id: Date.now() + 1,
      text: aiResponse.answer,
      isBot: true,
      timestamp: new Date(),
      suggestions: aiResponse.suggestions
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
    playSuccessSound();

    // إرسال إشعار واتساب (اختياري)
    if (whatsappEnabled && aiResponse.confidence > 70) {
      try {
        await sendQuestionNotification(userMessage.text, aiResponse.answer);
        console.log('✅ تم إرسال إشعار واتساب');
      } catch (error) {
        console.error('❌ خطأ في إرسال إشعار واتساب:', error);
      }
    }

    // إشعار بمستوى الثقة
    if (aiResponse.confidence > 80) {
      toast.success(`وجدت إجابة ممتازة! (${aiResponse.confidence}% ثقة)`, { icon: '🎯' });
    } else if (aiResponse.confidence > 50) {
      toast.success(`وجدت إجابة جيدة! (${aiResponse.confidence}% ثقة)`, { icon: '👍' });
    }
  };

  // مسح المحادثة
  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "مرحباً! أنا مساعد مراد الذكي 🤖 أساعدك في العثور على أفضل المواقع التعليمية والإنتاجية. اسألني عن أي موضوع! يمكنك أيضاً مشاركة الأسئلة والأجوبة عبر واتساب.",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "مواقع تعلم البرمجة",
        "مواقع الذكاء الاصطناعي",
        "جامعات سعودية",
        "دورات مجانية",
        "من صنعك؟"
      ]
    }]);
    toast.success('تم مسح المحادثة!', { icon: '🗑️' });
    playClickSound();
  };

  const handleWhatsAppShare = (userText: string, botText: string) => {
    setSelectedMessage({ question: userText, answer: botText });
    setShowWhatsAppModal(true);
    playClickSound();
  };

  const handleSaveNote = (userText: string, botText: string) => {
    setNoteData({ question: userText, answer: botText });
    setShowNotesModal(true);
    playClickSound();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowQuickSuggestions(false);
    playTypingSound();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setShowQuickSuggestions(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 md:mb-8 px-2"
      >
        <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          </motion.div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 font-cairo">
            🤖 مساعد مراد الذكي
          </h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-cairo px-2 leading-relaxed">
          مدعوم بذكاء اصطناعي متطور يجيب على أسئلتك التقنية ويبحث في أكثر من {sites.length} موقع
        </p>
      </motion.div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Messages Area */}
        <div className="h-96 md:h-96 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-4 bg-gray-50 dark:bg-gray-800">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-full max-w-[85%] md:max-w-xs lg:max-w-md xl:max-w-lg ${
                  message.isBot ? 'order-2' : 'order-1'
                }`}>
                  <div className={`flex items-start space-x-2 space-x-reverse ${
                    message.isBot ? 'flex-row' : 'flex-row-reverse'
                  }`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                      message.isBot 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-r from-green-500 to-teal-500'
                    }`}>
                      {message.isBot ? (
                        <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      ) : (
                        <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`rounded-xl px-4 md:px-4 py-3 md:py-3 shadow-md ${
                      message.isBot
                        ? 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}>
                      <div className={`text-xs md:text-sm leading-relaxed font-cairo ${
                        message.isBot ? 'text-gray-800 dark:text-gray-200' : 'text-white'
                      }`}>
                        {message.text.split('\n').map((line, index) => {
                          // تنسيق النص المميز
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <div key={index} className="font-bold text-blue-600 dark:text-blue-400 mb-1">
                                {line.replace(/\*\*/g, '')}
                              </div>
                            );
                          }
                          // تنسيق الروابط
                          if (line.includes('[') && line.includes('](')) {
                            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                            const parts = line.split(linkRegex);
                            return (
                              <div key={index} className="mb-1">
                                {parts.map((part, i) => {
                                  if (i % 3 === 1) {
                                    const url = parts[i + 1];
                                    return (
                                      <a
                                        key={i}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 underline font-semibold"
                                        onClick={() => playClickSound()}
                                      >
                                        {part}
                                      </a>
                                    );
                                  }
                                  if (i % 3 === 0) {
                                    return <span key={i}>{part}</span>;
                                  }
                                  return null;
                                })}
                              </div>
                            );
                          }
                          return <div key={index} className="mb-1">{line}</div>;
                        })}
                      </div>
                      
                      {/* WhatsApp Share Button for Bot Messages */}
                      {message.isBot && messages.length > 1 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="grid grid-cols-2 gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const previousUserMessage = messages[messages.findIndex(m => m.id === message.id) - 1];
                              if (previousUserMessage && !previousUserMessage.isBot) {
                                handleWhatsAppShare(previousUserMessage.text, message.text);
                              }
                            }}
                            className={`flex items-center justify-center space-x-1 space-x-reverse px-2 py-2 rounded-lg transition-all duration-200 text-xs font-cairo ${
                              whatsappEnabled 
                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!whatsappEnabled}
                            title={whatsappEnabled ? 'مشاركة عبر واتساب' : 'واتساب غير متاح'}
                          >
                            <MessageSquare className="w-3 h-3 flex-shrink-0" />
                            <span>واتساب</span>
                            {!whatsappEnabled && <span className="text-xs">(غير متاح)</span>}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const previousUserMessage = messages[messages.findIndex(m => m.id === message.id) - 1];
                              if (previousUserMessage && !previousUserMessage.isBot) {
                                handleSaveNote(previousUserMessage.text, message.text);
                              }
                            }}
                            className="flex items-center justify-center space-x-1 space-x-reverse px-2 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-all duration-200 text-xs font-cairo"
                            title="حفظ كملاحظة"
                          >
                            <BookOpen className="w-3 h-3 flex-shrink-0" />
                            <span>حفظ</span>
                          </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-cairo">
                            اقتراحات ذكية:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-cairo transition-colors duration-200"
                              >
                                {suggestion}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={`text-xs mt-2 ${
                        message.isBot ? 'text-gray-400' : 'text-white/70'
                      }`}>
                        {message.timestamp.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-2 space-x-reverse">
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-xl px-3 md:px-4 py-2 md:py-3 shadow-md border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 space-x-reverse">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  const suggestions = generateQuickSuggestions(input);
                  setQuickSuggestions(suggestions);
                  setShowQuickSuggestions(suggestions.length > 0 && input.length >= 2);
                }}
                onBlur={() => setTimeout(() => setShowQuickSuggestions(false), 200)}
                placeholder="اكتب سؤال (مثل: مواقع برمجة، ما هو Git، من صنع البرنامج)"
                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none font-cairo text-base"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isTyping}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              {/* Auto-complete Suggestions */}
              <AnimatePresence>
                {showQuickSuggestions && quickSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-cairo mb-2 px-2">
                        اقتراحات ذكية:
                      </div>
                      {quickSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-right p-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Brain className="w-3 h-3 text-blue-500" />
                              <span className="text-sm font-cairo text-gray-800 dark:text-gray-200">
                                {suggestion}
                              </span>
                            </div>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 space-x-reverse text-base min-w-[60px] ${
                input.trim() && !isTyping
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              whileHover={input.trim() && !isTyping ? { scale: 1.02 } : {}}
              whileTap={input.trim() && !isTyping ? { scale: 0.95 } : {}}
            >
              {isTyping ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="font-cairo hidden sm:inline">إرسال</span>
            </motion.button>
            
            {/* Clear Chat Button */}
            <motion.button
              onClick={clearChat}
              className="px-3 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 flex items-center justify-center text-base font-cairo min-w-[50px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              title="مسح المحادثة"
            >
              <span className="hidden sm:inline">مسح</span>
              <span className="sm:hidden text-lg">🗑️</span>
            </motion.button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 space-y-3">
            {/* Recent Chat History */}
            {chatHistory.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-cairo mb-2 flex items-center space-x-1 space-x-reverse">
                  <Clock className="w-3 h-3" />
                  <span>أسئلة حديثة:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {chatHistory.slice(0, 4).map((msg, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestionClick(msg)}
                      className="px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-cairo transition-colors duration-200 flex items-center space-x-1 space-x-reverse"
                    >
                      <History className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[150px]">{msg}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Action Buttons */}
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-cairo mb-2 flex items-center space-x-1 space-x-reverse">
                <TrendingUp className="w-3 h-3" />
                <span>أسئلة شائعة:</span>
              </div>
              <div className="flex flex-wrap gap-2">
            {[
              "مواقع تعلم البرمجة",
              "جامعات سعودية",
              "دورات مجانية",
              "مواقع الذكاء الاصطناعي",
              "أدوات الإنتاجية",
              "السلام عليكم",
              "من صنع البرنامج"
            ].map((quickAction, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(quickAction)}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-cairo transition-colors duration-200 flex items-center space-x-1 space-x-reverse"
              >
                <Zap className="w-3 h-3 flex-shrink-0" />
                <span>{quickAction}</span>
              </motion.button>
            ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 md:mt-6 text-center px-2"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl px-3 md:px-6 py-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">
              {messages.length - 1} محادثة
            </span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Search className="w-4 h-4 text-green-500" />
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">
              {sites.length} موقع
            </span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">
              AI مدعوم
            </span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <MessageSquare className="w-4 h-4 text-green-500" />
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">
              {whatsappEnabled ? 'واتساب متاح' : 'واتساب غير متاح'}
            </span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse hidden md:flex">
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-cairo">
              {Object.keys(greetings).length} تحية
            </span>
          </div>
        </div>
      </motion.div>

      {/* WhatsApp Modal */}
      {selectedMessage && (
        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={() => {
            setShowWhatsAppModal(false);
            setSelectedMessage(null);
          }}
          question={selectedMessage.question}
          answer={selectedMessage.answer}
        />
      )}
      
      {/* Notes Modal */}
      {noteData && (
        <NotesModal
          isOpen={showNotesModal}
          onClose={() => {
            setShowNotesModal(false);
            setNoteData(null);
          }}
          initialQuestion={noteData.question}
          initialAnswer={noteData.answer}
        />
      )}
      
      {/* Standalone Notes Modal */}
      <NotesModal
        isOpen={showNotesModal && !noteData}
        onClose={() => setShowNotesModal(false)}
      />
    </div>
  );
};

export default AskMuraad;