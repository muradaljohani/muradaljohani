import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Download, 
  Trash2, 
  Search, 
  Calendar,
  BookOpen,
  Copy,
  Share2,
  Star,
  Tag,
  StickyNote
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  question?: string;
  answer?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  initialAnswer?: string;
}

const NotesModal: React.FC<NotesModalProps> = ({ 
  isOpen, 
  onClose, 
  initialQuestion = '', 
  initialAnswer = '' 
}) => {
  const [notes, setNotes] = useLocalStorage<Note[]>('savedNotes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));
  const tagOptions = ['all', 'مهم', 'برمجة', 'نصائح', 'مواقع', 'تقنية', ...allTags];

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.question && note.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (note.answer && note.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    const matchesFavorites = !showFavoritesOnly || note.isFavorite;
    
    return matchesSearch && matchesTag && matchesFavorites;
  });

  // Initialize form with initial data
  React.useEffect(() => {
    if (initialQuestion && initialAnswer) {
      setQuestion(initialQuestion);
      setAnswer(initialAnswer);
      setTitle(`سؤال: ${initialQuestion.slice(0, 50)}...`);
      setContent(`السؤال: ${initialQuestion}\n\nالإجابة: ${initialAnswer}`);
      setSelectedTags(['برمجة']);
    }
  }, [initialQuestion, initialAnswer]);

  const saveNote = () => {
    if (!title.trim() && !content.trim()) {
      toast.error('يرجى إدخال عنوان أو محتوى للملاحظة');
      return;
    }

    const noteData: Note = {
      id: editingNote?.id || Date.now().toString(),
      title: title.trim() || 'ملاحظة بدون عنوان',
      content: content.trim(),
      question: question.trim() || undefined,
      answer: answer.trim() || undefined,
      tags: selectedTags,
      createdAt: editingNote?.createdAt || new Date(),
      updatedAt: new Date(),
      isFavorite: editingNote?.isFavorite || false
    };

    if (editingNote) {
      setNotes(prev => prev.map(note => note.id === editingNote.id ? noteData : note));
      toast.success('تم تحديث الملاحظة!');
    } else {
      setNotes(prev => [noteData, ...prev]);
      toast.success('تم حفظ الملاحظة!');
    }

    resetForm();
    playSuccessSound();
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success('تم حذف الملاحظة!');
    playClickSound();
  };

  const toggleFavorite = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    ));
    playClickSound();
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setQuestion(note.question || '');
    setAnswer(note.answer || '');
    setSelectedTags(note.tags);
    setIsEditing(true);
    playClickSound();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setQuestion('');
    setAnswer('');
    setSelectedTags([]);
    setEditingNote(null);
    setIsEditing(false);
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ملاحظات-مراد-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('تم تصدير الملاحظات!');
    playSuccessSound();
  };

  const copyNote = (note: Note) => {
    const noteText = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(noteText);
    toast.success('تم نسخ الملاحظة!');
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-gray-200 dark:border-gray-700 notes-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
                </motion.div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold font-cairo">
                    📓 دفتر الملاحظات الذكي
                  </h2>
                  <p className="text-white/80 text-sm font-cairo hidden md:block">
                    احفظ وصنف ملاحظاتك وإجاباتك المفيدة
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <StickyNote className="w-5 h-5 md:w-6 md:h-6" />
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
            <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-700 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-600">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {notes.length}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-cairo">
                    ملاحظة
                  </div>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {notes.filter(n => n.isFavorite).length}
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 font-cairo">
                    مفضلة
                  </div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {allTags.length}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-cairo">
                    تصنيف
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في الملاحظات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-cairo text-sm notes-search-input"
                />
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                      className="w-4 h-4 text-yellow-500 border-2 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-cairo">
                      المفضلة فقط
                    </span>
                  </label>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 font-cairo mb-2">
                    التصنيفات:
                  </h3>
                  <div className="space-y-1">
                    {tagOptions.slice(0, 8).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`w-full text-right p-2 rounded-lg transition-all duration-200 font-cairo text-sm ${
                          selectedTag === tag
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {tag === 'all' ? 'جميع الملاحظات' : tag}
                        {tag !== 'all' && (
                          <span className="float-left text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                            {notes.filter(n => n.tags.includes(tag)).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={exportNotes}
                  disabled={notes.length === 0}
                  className="w-full flex items-center justify-center space-x-2 space-x-reverse p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 font-cairo text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير الملاحظات</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              {/* Add/Edit Note Form */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo mb-4">
                  {isEditing ? 'تعديل ملاحظة' : 'إضافة ملاحظة جديدة'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="عنوان الملاحظة..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-cairo notes-input"
                    />
                  </div>

                  {(question || answer) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-cairo">
                          السؤال:
                        </label>
                        <textarea
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none font-cairo notes-textarea"
                          rows={3}
                          placeholder="السؤال الأصلي..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-cairo">
                          الإجابة:
                        </label>
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none font-cairo notes-textarea"
                          rows={3}
                          placeholder="الإجابة..."
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <textarea
                      placeholder="محتوى الملاحظة..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none font-cairo notes-textarea"
                      rows={4}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <input
                        type="text"
                        placeholder="إضافة تصنيف..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-cairo text-sm notes-input"
                      />
                      <button
                        onClick={addTag}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center space-x-1 space-x-reverse bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-cairo"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 space-x-reverse">
                    <button
                      onClick={saveNote}
                      className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-cairo"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isEditing ? 'تحديث' : 'حفظ'}</span>
                    </button>
                    
                    {isEditing && (
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-cairo"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-cairo">
                  الملاحظات المحفوظة ({filteredNotes.length})
                </h3>

                {filteredNotes.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNotes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 note-card"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 font-cairo text-lg mb-1">
                              {note.title}
                            </h4>
                            <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center space-x-1 space-x-reverse">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(note.createdAt).toLocaleDateString('ar')}</span>
                              </span>
                              {note.updatedAt !== note.createdAt && (
                                <span>• محدث: {new Date(note.updatedAt).toLocaleDateString('ar')}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => toggleFavorite(note.id)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                note.isFavorite 
                                  ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' 
                                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                              }`}
                            >
                              <Star className="w-4 h-4" fill={note.isFavorite ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>

                        {note.question && note.answer && (
                          <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                            <div className="text-sm">
                              <div className="mb-2">
                                <strong className="text-blue-600 dark:text-blue-400">السؤال:</strong>
                                <p className="text-gray-700 dark:text-gray-300 mt-1 font-cairo">{note.question}</p>
                              </div>
                              <div>
                                <strong className="text-green-600 dark:text-green-400">الإجابة:</strong>
                                <p className="text-gray-700 dark:text-gray-300 mt-1 font-cairo">{note.answer}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="text-gray-600 dark:text-gray-400 font-cairo text-sm mb-3 leading-relaxed">
                          {note.content}
                        </p>

                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {note.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-cairo"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => copyNote(note)}
                              className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                              title="نسخ الملاحظة"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => editNote(note)}
                              className="p-2 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                              title="تعديل الملاحظة"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                            title="حذف الملاحظة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                    <div className="text-6xl mb-4">📓</div>
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2 font-cairo">
                      لا توجد ملاحظات
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 font-cairo">
                      {searchTerm || selectedTag !== 'all' 
                        ? 'جرب تغيير مصطلح البحث أو التصنيف'
                        : 'ابدأ بحفظ ملاحظاتك وإجاباتك المفيدة'
                      }
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotesModal;