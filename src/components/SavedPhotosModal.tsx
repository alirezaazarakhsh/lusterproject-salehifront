import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, Heart, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { getSavedPhotos, removeSavedPhoto, downloadImageFile, SavedPhotoItem } from '../utils/savedPhotos';
import { handleImgErrorFallback, resolveDirectImageUrl } from '../utils/imageCdnHelper';

interface SavedPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

export const SavedPhotosModal: React.FC<SavedPhotosModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [savedList, setSavedList] = useState<SavedPhotoItem[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSavedList(getSavedPhotos());
    }
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<SavedPhotoItem[]>;
      if (custom.detail) {
        setSavedList(custom.detail);
      } else {
        setSavedList(getSavedPhotos());
      }
    };
    window.addEventListener('saved-photos-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('saved-photos-updated', handleUpdate as EventListener);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async (item: SavedPhotoItem) => {
    setDownloadingId(item.id);
    const success = await downloadImageFile(item.url, `${item.title.replace(/\s+/g, '_')}.jpg`);
    setDownloadingId(null);
    if (success && onShowToast) {
      onShowToast(`تصویر "${item.title}" با موفقیت دانلود شد.`);
    }
  };

  const handleRemove = (item: SavedPhotoItem) => {
    removeSavedPhoto(item.id);
    setSavedList(getSavedPhotos());
    if (onShowToast) {
      onShowToast(`تصویر از لیست ذخیره‌شده‌ها حذف شد.`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
      dir="rtl"
    >
      <div className="bg-[#fcfbf9] w-full max-w-4xl rounded-[28px] border border-[#ebdcb9] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* هدر مدال */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ebdcb9]/60 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b59766]/10 flex items-center justify-center text-[#b59766]">
              <Heart className="w-5 h-5 fill-[#b59766]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1a1a1a]">تصاویر و محصولات ذخیره‌شده من</h3>
              <p className="text-xs text-[#777777] mt-0.5">
                مجموعه عکس‌ها، لوسترها و پروژه‌هایی که ذخیره کرده‌اید ({savedList.length} مورد)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-[#ebdcb9] hover:bg-[#2b2b2b] text-[#2b2b2b] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوای گالری ذخیره شده */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#fcfbf9]">
          {savedList.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-[#ebdcb9]/20 flex items-center justify-center text-[#b59766]">
                <ImageIcon className="w-10 h-10 opacity-60" />
              </div>
              <h4 className="text-base font-bold text-[#333333]">هنوز هیچ عکسی ذخیره نکرده‌اید!</h4>
              <p className="text-xs text-[#777777] max-w-sm leading-6">
                شما می‌توانید روی هر محصول، پروژه یا تصویر در سایت دکمه «ذخیره عکس» یا قلب را بزنید تا همیشه اینجا در دسترس شما باشد.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {savedList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#ebdcb9]/70 overflow-hidden shadow-xs flex flex-col group hover:border-[#b59766] transition-all"
                >
                  <div className="relative h-48 bg-[#f5f5f5] overflow-hidden">
                    <img
                      src={resolveDirectImageUrl(item.url, { width: 600, quality: 85 })}
                      alt={item.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImgErrorFallback(e)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-white text-[10px]">
                      <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                      <span>ذخیره شده</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      <h5 className="text-sm font-black text-[#1a1a1a] line-clamp-1">{item.title}</h5>
                      {item.subtitle && (
                        <p className="text-xs text-[#b59766] mt-1 line-clamp-1 font-bold">{item.subtitle}</p>
                      )}
                      <span className="block text-[10px] text-[#999999] mt-2">
                        ذخیره در: {new Date(item.savedAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#f0ece1]">
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        disabled={downloadingId === item.id}
                        className="flex-1 h-9 rounded-xl bg-[#b59766] hover:bg-[#9e7e52] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadingId === item.id ? 'در حال دانلود...' : 'دانلود عکس'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        title="حذف از ذخیره‌ها"
                        className="w-9 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* فوتر مدال */}
        <div className="px-6 py-4 bg-white border-t border-[#ebdcb9]/60 flex items-center justify-between">
          <span className="text-xs text-[#777777]">
            تصاویر در حافظه مرورگر شما به صورت ایمن ذخیره می‌شوند.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2b2b2b] text-white text-xs font-bold hover:bg-[#111] transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};
