import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { sendCustomWhatsAppMessage, validatePhoneNumber, formatPhoneNumber } from '../utils/whatsappAPI';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ 
  isOpen, 
  onClose, 
  question, 
  answer 
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendingStep, setSendingStep] = useState('');

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setIsValid(validatePhoneNumber(value));
  };

  const handleSend = async () => {
    if (!isValid || !phoneNumber.trim()) {
      toast.error('يرجى إدخال رقم واتساب صحيح');
      return;
    }

    setIsSending(true);
    setSendingStep('جاري التحضير...');
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      setSendingStep('جاري الإرسال...');
      
      const result = await sendCustomWhatsAppMessage(formattedPhone, question, answer);
      
      if (result.success) {
        setSendingStep('تم الإرسال بنجاح!');
        toast.success('تم إرسال الرسالة بنجاح!', {
          icon: '✅',
          duration: 4000,
        });
        playSuccessSound();
        
        setTimeout(() => {
          onClose();
          setPhoneNumber('');
          setSendingStep('');
        }, 2000);
      } else {
        throw new Error(result.error || 'فشل في الإرسال');
      }
    } catch (error) {
      setSendingStep('');
      toast.error(`خطأ في الإرسال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`, {
        icon: '❌',
        duration: 5000,
      });
      console.error('خطأ إرسال واتساب:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      onClose();
      setPhoneNumber('');
      setSendingStep('');
      playClickSound();
    }
  };

  const quickNumbers = [
    { label: 'رقمي', value: '' },
    { label: 'مثال سعودي', value: '+966501234567' },
    { label: 'مثال دولي', value: '+1234567890' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Phone className="w-6 h-6" />
                </motion.div>
                <h2 className="text-xl font-bold font-cairo">إرسال عبر واتساب</h2>
              </div>
              {!isSending && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-white/80 mt-2 font-cairo text-sm">
              شارك السؤال والإجابة مع أصدقائك
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 font-cairo">
                معاينة الرسالة:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-r-4 border-blue-500">
                  <strong className="text-blue-600 dark:text-blue-400">السؤال:</strong>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 font-cairo">
                    {question.length > 100 ? question.substring(0, 100) + '...' : question}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-r-4 border-green-500">
                  <strong className="text-green-600 dark:text-green-400">الإجابة:</strong>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 font-cairo">
                    {answer.length > 150 ? answer.substring(0, 150) + '...' : answer}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-cairo">
                  رقم الواتساب
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+966501234567"
                    className={`w-full pr-12 pl-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200 ${
                      phoneNumber && !isValid 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                        : isValid 
                        ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                    dir="ltr"
                    disabled={isSending}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {phoneNumber && (
                      isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                </div>
                
                {phoneNumber && !isValid && (
                  <p className="text-red-500 text-xs mt-1 font-cairo">
                    يرجى إدخال رقم واتساب صحيح (مثال: +966501234567)
                  </p>
                )}
              </div>

              {/* Quick Numbers */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-cairo">أرقام سريعة:</p>
                <div className="flex space-x-2 space-x-reverse">
                  {quickNumbers.map((num, index) => (
                    <button
                      key={index}
                      onClick={() => handlePhoneChange(num.value)}
                      disabled={isSending}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-cairo transition-colors duration-200 disabled:opacity-50"
                    >
                      {num.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sending Status */}
            {isSending && sendingStep && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-blue-700 dark:text-blue-300 font-cairo font-medium">
                    {sendingStep}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!isValid || isSending}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse font-cairo ${
                isValid && !isSending
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>إرسال الرسالة</span>
                </>
              )}
            </button>

            {/* Info */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-700 dark:text-green-300 font-cairo">
                <p className="font-semibold mb-2 flex items-center space-x-2 space-x-reverse">
                  <CheckCircle className="w-4 h-4" />
                  <span>معلومات مهمة:</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>سيتم إرسال الرسالة مباشرة إلى رقم الواتساب المحدد</li>
                  <li>تأكد من صحة الرقم قبل الإرسال</li>
                  <li>الخدمة مجانية ومدعومة بـ Whats360 API</li>
                  <li>الرسالة ستحتوي على السؤال والإجابة ورابط الموقع</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WhatsAppModal;