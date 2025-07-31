// Whats360 API Integration
interface WhatsAppMessage {
  to: string;
  message: string;
  type: 'text' | 'media';
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// إعدادات Whats360 API (يجب إضافتها لمتغيرات البيئة)
const WHATS360_API_URL = import.meta.env.VITE_WHATS360_API_URL || 'https://api.whats360.com/v1';
const WHATS360_API_KEY = import.meta.env.VITE_WHATS360_API_KEY || '';
const WHATS360_PHONE_ID = import.meta.env.VITE_WHATS360_PHONE_ID || '';
const NOTIFICATION_PHONE = import.meta.env.VITE_NOTIFICATION_PHONE || '+966501234567';

// دالة إرسال رسالة واتساب
export const sendWhatsAppMessage = async (
  phoneNumber: string, 
  message: string
): Promise<WhatsAppResponse> => {
  try {
    if (!WHATS360_API_KEY || !WHATS360_PHONE_ID) {
      throw new Error('إعدادات Whats360 API غير مكتملة');
    }

    const response = await fetch(`${WHATS360_API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATS360_API_KEY}`,
        'X-Phone-Number-ID': WHATS360_PHONE_ID,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber.replace(/\D/g, ''), // إزالة الرموز غير الرقمية
        type: 'text',
        text: {
          body: message
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error('خطأ في إرسال رسالة واتساب:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير معروف',
    };
  }
};

// دالة إرسال إشعار سؤال جديد
export const sendQuestionNotification = async (
  question: string, 
  answer: string, 
  userInfo?: string
): Promise<WhatsAppResponse> => {
  const timestamp = new Date().toLocaleString('ar-SA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `🤖 *سؤال جديد - مساعد مراد الذكي*

📅 *التاريخ والوقت:* ${timestamp}
${userInfo ? `👤 *المستخدم:* ${userInfo}` : ''}

❓ *السؤال:*
${question}

💬 *الرد:*
${answer.length > 200 ? answer.substring(0, 200) + '...' : answer}

🌐 *الموقع:* ${window.location.origin}

---
مرسل تلقائياً من مساعد مراد الذكي 🇸🇦`;

  return await sendWhatsAppMessage(NOTIFICATION_PHONE, message);
};

// دالة إرسال رسالة مخصصة
export const sendCustomWhatsAppMessage = async (
  phoneNumber: string,
  question: string,
  answer: string
): Promise<WhatsAppResponse> => {
  const message = `🤖 *مشاركة من مساعد مراد الذكي*

❓ *السؤال:*
${question}

💬 *الإجابة:*
${answer}

🔗 *جرب المساعد بنفسك:*
${window.location.origin}

---
مساعد ذكي مدعوم بتقنيات متطورة 🚀`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

// دالة فحص صحة رقم الواتساب
export const validatePhoneNumber = (phone: string): boolean => {
  // إزالة المسافات والرموز
  const cleanPhone = phone.replace(/\D/g, '');
  
  // فحص الأرقام السعودية (05xxxxxxxx أو 9665xxxxxxxx)
  const saudiPattern = /^(05|9665)[0-9]{8}$/;
  
  // فحص الأرقام الدولية العامة
  const internationalPattern = /^[1-9][0-9]{7,14}$/;
  
  return saudiPattern.test(cleanPhone) || internationalPattern.test(cleanPhone);
};

// دالة تنسيق رقم الهاتف
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // إذا كان رقم سعودي يبدأ بـ 05، حوله إلى التنسيق الدولي
  if (cleanPhone.startsWith('05')) {
    return '+966' + cleanPhone.substring(1);
  }
  
  // إذا لم يبدأ بـ +، أضف +
  if (!phone.startsWith('+')) {
    return '+' + cleanPhone;
  }
  
  return phone;
};

// دالة فحص حالة Whats360 API
export const checkWhatsAppAPIStatus = async (): Promise<boolean> => {
  try {
    if (!WHATS360_API_KEY || !WHATS360_PHONE_ID) {
      return false;
    }

    const response = await fetch(`${WHATS360_API_URL}/phone_numbers/${WHATS360_PHONE_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${WHATS360_API_KEY}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('خطأ في فحص حالة واتساب API:', error);
    return false;
  }
};