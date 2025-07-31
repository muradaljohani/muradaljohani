import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Download, 
  FileImage, 
  FileText, 
  X, 
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

interface FileConverterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConvertedFile {
  name: string;
  size: string;
  downloadUrl: string;
}

const FileConverter: React.FC<FileConverterProps> = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => supportedFormats.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast.error('بعض الملفات غير مدعومة! يرجى رفع صور فقط');
    }
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      toast.success(`تم إضافة ${validFiles.length} ملف`);
      playClickSound();
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => supportedFormats.includes(file.type));
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      toast.success(`تم إضافة ${validFiles.length} ملف`);
      playClickSound();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    playClickSound();
  };

  const convertToPDF = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsConverting(true);
    toast.loading('جاري التحويل...', { id: 'converting' });
    
    try {
      for (const file of selectedFiles) {
        const pdf = new jsPDF();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            // حساب الأبعاد المناسبة للـ PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgAspectRatio = img.width / img.height;
            const pdfAspectRatio = pdfWidth / pdfHeight;
            
            let imgWidth, imgHeight;
            
            if (imgAspectRatio > pdfAspectRatio) {
              imgWidth = pdfWidth;
              imgHeight = pdfWidth / imgAspectRatio;
            } else {
              imgHeight = pdfHeight;
              imgWidth = pdfHeight * imgAspectRatio;
            }
            
            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
            
            const pdfBlob = pdf.output('blob');
            const fileName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
            
            setConvertedFiles(prev => [...prev, {
              name: fileName,
              size: (pdfBlob.size / 1024 / 1024).toFixed(2) + ' MB',
              downloadUrl: URL.createObjectURL(pdfBlob)
            }]);
            
            resolve(void 0);
          };
          
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      }
      
      toast.success('تم التحويل بنجاح!', { id: 'converting' });
      playSuccessSound();
      
    } catch (error) {
      toast.error('حدث خطأ في التحويل', { id: 'converting' });
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadFile = (file: ConvertedFile) => {
    const link = document.createElement('a');
    link.href = file.downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`تم تنزيل ${file.name}`);
    playSuccessSound();
  };

  const downloadAllFiles = () => {
    convertedFiles.forEach(file => {
      setTimeout(() => downloadFile(file), 200);
    });
  };

  const resetConverter = () => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setIsConverting(false);
    playClickSound();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                <h2 className="text-xl md:text-2xl font-bold font-cairo">تحويل الملفات للصيغات</h2>
                <FileImage className="w-6 h-6" />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-white/80 mt-2 font-cairo">
              حوّل صورك إلى ملفات PDF عالية الجودة في ثوانٍ معدودة
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <motion.div
                animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                className="space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo mb-2">
                    اسحب الصور هنا أو اضغط للاختيار
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-cairo">
                    يدعم: JPG, PNG, GIF, WebP (حتى 10 صور)
                  </p>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 font-cairo font-semibold"
                >
                  اختيار الصور
                </button>
              </motion.div>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo">
                    الصور المختارة ({selectedFiles.length})
                  </h3>
                  <button
                    onClick={resetConverter}
                    className="text-red-500 hover:text-red-600 font-cairo text-sm"
                  >
                    مسح الكل
                  </button>
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <FileImage className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 font-cairo">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-500 hover:text-red-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Convert Button */}
            {selectedFiles.length > 0 && (
              <motion.button
                onClick={convertToPDF}
                disabled={isConverting}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 font-bold text-lg font-cairo disabled:cursor-not-allowed"
                whileHover={!isConverting ? { scale: 1.02 } : {}}
                whileTap={!isConverting ? { scale: 0.98 } : {}}
              >
                {isConverting ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري التحويل...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Zap className="w-5 h-5" />
                    <span>تحويل إلى PDF</span>
                  </div>
                )}
              </motion.button>
            )}

            {/* Converted Files */}
            {convertedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 font-cairo flex items-center space-x-2 space-x-reverse">
                    <Check className="w-5 h-5" />
                    <span>تم التحويل بنجاح!</span>
                  </h3>
                  <button
                    onClick={downloadAllFiles}
                    className="text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 font-cairo"
                  >
                    تنزيل الكل
                  </button>
                </div>
                
                <div className="space-y-2">
                  {convertedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 font-cairo">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={() => downloadFile(file)}
                        className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-cairo"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4" />
                        <span>تنزيل</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300 font-cairo">
                  <p className="font-semibold mb-1">ملاحظات مهمة:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>الحد الأقصى: 10 صور في المرة الواحدة</li>
                    <li>الصور تُحول بجودة عالية</li>
                    <li>جميع العمليات تتم محلياً في متصفحك</li>
                    <li>لا يتم حفظ أو إرسال ملفاتك للخوادم</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FileConverter;