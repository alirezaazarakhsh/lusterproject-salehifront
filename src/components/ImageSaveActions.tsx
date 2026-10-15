import React, { useState, useEffect } from 'react';
import { Download, Heart } from 'lucide-react';
import { savePhotoItem, removeSavedPhoto, isPhotoSaved, downloadImageFile } from '../utils/savedPhotos';

interface ImageSaveActionsProps {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  onShowToast?: (msg: string) => void;
  className?: string;
}

export const ImageSaveActions: React.FC<ImageSaveActionsProps> = ({
  id,
  url,
  title,
  subtitle,
  onShowToast,
  className = '',
}) => {
  const [saved, setSaved] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    setSaved(isPhotoSaved(id) || isPhotoSaved(url));
    const handleUpdate = () => {
      setSaved(isPhotoSaved(id) || isPhotoSaved(url));
    };
    window.addEventListener('saved-photos-updated', handleUpdate);
    return () => {
      window.removeEventListener('saved-photos-updated', handleUpdate);
    };
  }, [id, url]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeSavedPhoto(id);
      removeSavedPhoto(url);
      setSaved(false);
      if (onShowToast) onShowToast('تصویر از لیست ذخیره‌شده‌ها حذف شد.');
    } else {
      savePhotoItem({ id, url, title, subtitle });
      setSaved(true);
      if (onShowToast) onShowToast('تصویر با موفقیت در تصاویر ذخیره‌شده شما قرار گرفت ❤️');
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    const success = await downloadImageFile(url, `${title.replace(/\s+/g, '_')}.jpg`);
    setDownloading(false);
    if (success && onShowToast) {
      onShowToast('تصویر با موفقیت دانلود شد 📥');
    }
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`} dir="rtl">
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        title="دانلود و ذخیره عکس روی دستگاه"
        className="flex items-center gap-1 h-8 px-3 rounded-lg bg-white/90 hover:bg-white text-[#2b2b2b] shadow-sm backdrop-blur-xs text-[11px] font-bold border border-[#ebdcb9] transition-all cursor-pointer hover:scale-105"
      >
        <Download className="w-3.5 h-3.5 text-[#b59766]" />
        <span className="hidden sm:inline">{downloading ? 'دانلود...' : 'ذخیره عکس'}</span>
      </button>

      <button
        type="button"
        onClick={handleToggleSave}
        title={saved ? 'حذف از ذخیره‌ها' : 'ذخیره در گالری من'}
        className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-xs border transition-all cursor-pointer hover:scale-105 ${
          saved
            ? 'bg-red-500 text-white border-red-500'
            : 'bg-white/90 hover:bg-white text-[#2b2b2b] border-[#ebdcb9]'
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-white' : 'text-[#b59766]'}`} />
      </button>
    </div>
  );
};
