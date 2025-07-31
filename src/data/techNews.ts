export interface TechNews {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  date: string;
  image: string;
  url: string;
  isHot: boolean;
  tags: string[];
}

export const saudiTechNews: TechNews[] = [
  {
    id: '1',
    title: 'أكاديمية طويق تطلق برنامج جديد للذكاء الاصطناعي 2025',
    summary: 'برنامج تدريبي مكثف لمدة 6 أشهر يهدف إلى تأهيل 1000 متدرب في مجال الذكاء الاصطناعي وتعلم الآلة',
    category: 'تعليم تقني',
    source: 'أكاديمية طويق',
    date: '2025-01-29',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    url: 'https://tuwaiq.edu.sa',
    isHot: true,
    tags: ['ذكاء اصطناعي', 'تدريب', 'طويق']
  },
  {
    id: '2',
    title: 'نيوم تكشف عن مشروع "THE LINE" التقني الجديد',
    summary: 'مدينة خطية ذكية بطول 170 كم تعتمد على الذكاء الاصطناعي والطاقة المتجددة بالكامل',
    category: 'مدن ذكية',
    source: 'نيوم',
    date: '2025-01-28',
    image: 'https://images.pexels.com/photos/3862365/pexels-photo-3862365.jpeg',
    url: 'https://neom.com',
    isHot: true,
    tags: ['نيوم', 'مدن ذكية', 'رؤية 2030']
  },
  {
    id: '3',
    title: 'سدايا تطلق منصة جديدة لتحليل البيانات الحكومية',
    summary: 'منصة متقدمة تستخدم الذكاء الاصطناعي لتحليل البيانات الحكومية وتحسين الخدمات العامة',
    category: 'ذكاء اصطناعي',
    source: 'سدايا',
    date: '2025-01-27',
    image: 'https://images.pexels.com/photos/6804581/pexels-photo-6804581.jpeg',
    url: 'https://sdaia.gov.sa',
    isHot: false,
    tags: ['سدايا', 'بيانات', 'حكومة رقمية']
  },
  {
    id: '4',
    title: 'جامعة الملك فهد تفتح معهد جديد لأمن المعلومات',
    summary: 'معهد متخصص في أمن المعلومات والأمن السيبراني بشراكة مع شركات عالمية',
    category: 'أمن سيبراني',
    source: 'جامعة الملك فهد',
    date: '2025-01-26',
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
    url: 'https://kfupm.edu.sa',
    isHot: false,
    tags: ['أمن سيبراني', 'جامعة', 'تعليم']
  },
  {
    id: '5',
    title: 'صندوق الاستثمارات العامة يستثمر في شركة تقنية سعودية ناشئة',
    summary: 'استثمار بقيمة 500 مليون ريال في شركة تطور حلول الذكاء الاصطناعي للقطاع الصحي',
    category: 'استثمار تقني',
    source: 'صندوق الاستثمارات العامة',
    date: '2025-01-25',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    url: 'https://pif.gov.sa',
    isHot: true,
    tags: ['استثمار', 'ناشئة', 'صحة رقمية']
  },
  {
    id: '6',
    title: 'شركة أرامكو تطور نظام ذكي لمراقبة المنشآت النفطية',
    summary: 'نظام متطور يستخدم الذكاء الاصطناعي والاستشعار عن بُعد لمراقبة وصيانة المنشآت',
    category: 'طاقة ذكية',
    source: 'أرامكو السعودية',
    date: '2025-01-24',
    image: 'https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg',
    url: 'https://aramco.com',
    isHot: false,
    tags: ['أرامكو', 'طاقة', 'ذكاء اصطناعي']
  },
  {
    id: '7',
    title: 'هيئة الاتصالات تطلق خدمة إنترنت الجيل السادس تجريبياً',
    summary: 'تجربة محدودة لتقنية 6G في مدينة الرياض بسرعات تصل إلى 1 تيرابت في الثانية',
    category: 'اتصالات',
    source: 'هيئة الاتصالات وتقنية المعلومات',
    date: '2025-01-23',
    image: 'https://images.pexels.com/photos/8377249/pexels-photo-8377249.jpeg',
    url: 'https://citc.gov.sa',
    isHot: true,
    tags: ['6G', 'اتصالات', 'سرعة عالية']
  },
  {
    id: '8',
    title: 'مؤتمر الذكاء الاصطناعي السعودي 2025 ينطلق في الرياض',
    summary: 'مؤتمر دولي يجمع خبراء الذكاء الاصطناعي من حول العالم لمناقشة أحدث التطورات',
    category: 'مؤتمرات',
    source: 'وزارة الاتصالات',
    date: '2025-01-22',
    image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg',
    url: 'https://mcit.gov.sa',
    isHot: false,
    tags: ['مؤتمر', 'ذكاء اصطناعي', 'رياض']
  },
  {
    id: '9',
    title: 'البنك المركزي السعودي يطلق عملة رقمية تجريبية',
    summary: 'مشروع تجريبي لعملة رقمية مركزية باستخدام تقنية البلوك تشين المتطورة',
    category: 'تقنية مالية',
    source: 'البنك المركزي السعودي',
    date: '2025-01-21',
    image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
    url: 'https://sama.gov.sa',
    isHot: true,
    tags: ['عملة رقمية', 'بلوك تشين', 'مالية']
  },
  {
    id: '10',
    title: 'أكاديمية MiSK تطلق برنامج تدريب المبرمجات السعوديات',
    summary: 'برنامج مخصص لتدريب 500 مبرمجة سعودية في مجالات تطوير التطبيقات والذكاء الاصطناعي',
    category: 'تمكين المرأة',
    source: 'مؤسسة misk',
    date: '2025-01-20',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    url: 'https://misk.org.sa',
    isHot: false,
    tags: ['تمكين', 'مبرمجات', 'misk']
  },
  {
    id: '11',
    title: 'شركة الاتصالات السعودية STC تطلق شبكة 5G في 50 مدينة جديدة',
    summary: 'توسيع كبير لشبكة الجيل الخامس لتغطي معظم مدن المملكة بحلول نهاية 2025',
    category: 'اتصالات',
    source: 'STC',
    date: '2025-01-19',
    image: 'https://images.pexels.com/photos/8349916/pexels-photo-8349916.jpeg',
    url: 'https://stc.com.sa',
    isHot: false,
    tags: ['5G', 'STC', 'شبكات']
  },
  {
    id: '12',
    title: 'القدية تكشف عن حديقة ألعاب افتراضية بتقنية الواقع المختلط',
    summary: 'أول حديقة ألعاب في العالم تدمج الواقع الحقيقي مع الافتراضي باستخدام تقنيات متطورة',
    category: 'ترفيه تقني',
    source: 'شركة القدية',
    date: '2025-01-18',
    image: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg',
    url: 'https://qiddiya.com',
    isHot: true,
    tags: ['واقع مختلط', 'ألعاب', 'ترفيه']
  }
];

export const categories = [
  { id: 'all', name: 'جميع الأخبار', color: 'from-blue-500 to-purple-500' },
  { id: 'تعليم تقني', name: 'التعليم التقني', color: 'from-green-500 to-teal-500' },
  { id: 'ذكاء اصطناعي', name: 'الذكاء الاصطناعي', color: 'from-purple-500 to-pink-500' },
  { id: 'مدن ذكية', name: 'المدن الذكية', color: 'from-cyan-500 to-blue-500' },
  { id: 'أمن سيبراني', name: 'الأمن السيبراني', color: 'from-red-500 to-orange-500' },
  { id: 'اتصالات', name: 'الاتصالات', color: 'from-indigo-500 to-purple-500' },
  { id: 'استثمار تقني', name: 'الاستثمار التقني', color: 'from-yellow-500 to-orange-500' },
  { id: 'تقنية مالية', name: 'التقنية المالية', color: 'from-emerald-500 to-green-500' }
];