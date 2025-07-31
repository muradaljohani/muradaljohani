export interface KnowledgeEntry {
  id: number;
  keywords: string[];
  response: string | (() => string);
  category: string;
  title: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  // Custom Questions
  {
    id: 1,
    keywords: ['من صنع', 'من برمج'],
    response: 'صُنع في حفر الباطن على يد المطور مراد عبدالرزاق الجهني.',
    category: 'معلومات شخصية',
    title: 'صانع البرنامج',
    tags: ['مراد الجهني', 'مطور'],
    difficulty: 'beginner',
    lastUpdated: '2025-01-30'
  },

  // Programming Resources
  {
    id: 2,
    keywords: ['موقع برمجة', 'تعلم برمجة'],
    response: `أفضل مواقع تعلم البرمجة:
- أكاديمية طويق (https://tuwaiq.edu.sa)
- أكاديمية حسوب (https://hsoub.academy)
- FreeCodeCamp (https://freecodecamp.org)`,
    category: 'تعليم برمجة',
    title: 'مواقع تعلم البرمجة',
    tags: ['تعليم', 'مواقع', 'حسوب', 'طويق'],
    difficulty: 'beginner',
    lastUpdated: '2025-01-30'
  },

  // Development Tools
  {
    id: 7,
    keywords: ['أدوات برمجة', 'git', 'api'],
    response: `أدوات مهمة للمبرمجين:
- VS Code: محرر نصوص.
- Git: لإدارة الإصدارات.
- API: واجهة تواصل بين التطبيقات.`,
    category: 'أدوات تطوير',
    title: 'أدوات البرمجة الأساسية',
    tags: ['vscode', 'git', 'api'],
    difficulty: 'intermediate',
    lastUpdated: '2025-01-30'
  },

  // Saudi Technology & Hackathons
  {
    id: 9,
    keywords: ['أكاديمية طويق', 'سدايا', 'نيوم', 'رؤية 2030'],
    response: `**أبرز المبادرات التقنية السعودية:**
- **أكاديمية طويق:** لتعليم البرمجة.
- **سدايا:** للبيانات والذكاء الاصطناعي.
- **نيوم:** مشروع المدينة الذكية.`,
    category: 'تقنيات سعودية',
    title: 'مبادرات تقنية سعودية',
    tags: ['طويق', 'سدايا', 'نيوم', 'رؤية 2030'],
    difficulty: 'beginner',
    lastUpdated: '2025-01-30'
  },
  {
    id: 21,
    keywords: ['هاكاثون', 'مسابقات برمجة'],
    response: `الهاكاثونات هي مسابقات برمجية. أشهرها في السعودية:
- هاكاثون طويق (تطوير)
- هاكاثون سدايا (ذكاء اصطناعي)
- هاكاثون الحج (خدمة الحجاج)
- هاكاثون نيوم (مدن ذكية)
الجوائز قد تصل إلى 500 ألف ريال أو أكثر.`,
    category: 'تقنيات سعودية',
    title: 'الهاكاثونات في السعودية',
    tags: ['هاكاثون', 'طويق', 'سدايا', 'حج'],
    difficulty: 'intermediate',
    lastUpdated: '2025-01-30'
  },

  // Cybersecurity
  {
    id: 12,
    keywords: ['الأمن السيبراني', 'vpn', 'حماية'],
    response: 'الأمن السيبراني هو حماية الأنظمة من التهديدات. استخدم VPN لحماية خصوصيتك وكلمات مرور قوية.',
    category: 'أمن سيبراني',
    title: 'الأمن السيبراني و VPN',
    tags: ['أمن', 'حماية', 'vpn'],
    difficulty: 'intermediate',
    lastUpdated: '2025-01-30'
  },

  // Modern Technology
  {
    id: 14,
    keywords: ['الذكاء الاصطناعي', 'blockchain', 'الحوسبة السحابية'],
    response: `**أهم التقنيات الحديثة:**
- **الذكاء الاصطناعي (AI):** يحاكي الذكاء البشري.
- **البلوك تشين:** تقنية لامركزية وآمنة.
- **الحوسبة السحابية:** خدمات عبر الإنترنت مثل AWS.`,
    category: 'تقنيات حديثة',
    title: 'تقنيات حديثة',
    tags: ['ai', 'blockchain', 'cloud'],
    difficulty: 'intermediate',
    lastUpdated: '2025-01-30'
  },

  // Programming Tips
  {
    id: 16,
    keywords: ['نصائح برمجة', 'كيف اتعلم'],
    response: `نصائح لتعلم البرمجة:
1. ابدأ بمشاريع صغيرة.
2. انضم إلى مجتمعات المبرمجين.
3. مارس البرمجة يوميًا.`,
    category: 'نصائح برمجة',
    title: 'كيفية تعلم البرمجة',
    tags: ['نصائح', 'تعلم', 'مبتدئين'],
    difficulty: 'beginner',
    lastUpdated: '2025-01-30'
  },

  // General Knowledge
  {
    id: 18,
    keywords: ['الوقت الآن', 'كم الساعة'],
    response: () => `الوقت الآن: ${new Date().toLocaleTimeString('ar-SA')}، التاريخ: ${new Date().toLocaleDateString('ar-SA')}.`,
    category: 'معلومات عامة',
    title: 'الوقت والتاريخ الحالي',
    tags: ['وقت', 'تاريخ'],
    difficulty: 'beginner',
    lastUpdated: '2025-01-30'
  }
];

// Categories for filtering
export const knowledgeCategories = [
  { id: 'all', name: 'الكل', icon: '🌟', color: 'from-blue-500 to-purple-500' },
  { id: 'لغات برمجة', name: 'لغات البرمجة', icon: '💻', color: 'from-green-500 to-teal-500' },
  { id: 'أدوات تطوير', name: 'أدوات التطوير', icon: '🛠️', color: 'from-orange-500 to-red-500' },
  { id: 'تقنيات سعودية', name: 'التقنيات السعودية', icon: '🇸🇦', color: 'from-emerald-500 to-green-500' },
  { id: 'أمن سيبراني', name: 'الأمن السيبراني', icon: '🔒', color: 'from-red-500 to-pink-500' },
  { id: 'تقنيات حديثة', name: 'التقنيات الحديثة', icon: '🚀', color: 'from-purple-500 to-pink-500' },
  { id: 'نصائح برمجة', name: 'نصائح البرمجة', icon: '💡', color: 'from-yellow-500 to-orange-500' },
  { id: 'تعليم برمجة', name: 'تعليم البرمجة', icon: '🌐', color: 'from-cyan-500 to-blue-500' },
  { id: 'معلومات عامة', name: 'معلومات عامة', icon: 'ℹ️', color: 'from-gray-500 to-gray-600' },
  { id: 'معلومات شخصية', name: 'معلومات شخصية', icon: '👤', color: 'from-indigo-500 to-purple-500' }
];

// Difficulty levels
export const difficultyLevels = [
  { id: 'all', name: 'جميع المستويات', icon: '📈', color: 'from-gray-400 to-gray-500' },
  { id: 'beginner', name: 'مبتدئ', icon: '🌱', color: 'from-green-400 to-green-500' },
  { id: 'intermediate', name: 'متوسط', icon: '🔥', color: 'from-orange-400 to-orange-500' },
  { id: 'advanced', name: 'متقدم', icon: '🚀', color: 'from-red-400 to-red-500' }
];