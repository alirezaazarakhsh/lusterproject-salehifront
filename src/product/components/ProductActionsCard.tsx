import React from 'react';
import { ChandelierProduct } from '../../data/chandelierData';
import { FinishType } from '../../components/Chandelier3DViewer';
import { toPersianDigits } from '../../utils/persianDigits';
import { ShoppingBag, Heart, Share2, Plus, Minus } from 'lucide-react';

interface ProductActionsCardProps {
  product: ChandelierProduct;
  selectedFinish: FinishType;
  setSelectedFinish: (finish: FinishType) => void;
  quantity: number;
  onIncreaseQty: () => void;
  onDecreaseQty: () => void;
  onAddToCartClick: () => void;
  isBookmarked: boolean;
  setIsBookmarked: React.Dispatch<React.SetStateAction<boolean>>;
  onShowToast?: (type: any, title: string, message: string) => void;
}

const ShareCustomIcon: React.FC<{ className?: string }> = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="2.5" stroke="#333333" strokeWidth="1.8"/>
    <circle cx="5" cy="18" r="2.5" stroke="#333333" strokeWidth="1.8"/>
    <circle cx="19" cy="18" r="2.5" stroke="#333333" strokeWidth="1.8"/>
    <path d="M9.8 6.8L6.8 15.8M14.2 6.8L17.2 15.8" stroke="#333333" strokeWidth="1.8"/>
  </svg>
);

const ArchiveCustomIcon: React.FC<{ className?: string; isFilled?: boolean }> = ({ className = "w-4.5 h-4.5", isFilled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={isFilled ? "#ea1d2c" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3.5H18C19.1 3.5 20 4.4 20 5.5V20.5L12 16.5L4 20.5V5.5C4 4.4 4.9 3.5 6 3.5Z" stroke={isFilled ? "#ea1d2c" : "#333333"} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 9.5H15" stroke={isFilled ? "#ffffff" : "#333333"} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const ProductActionsCard: React.FC<ProductActionsCardProps> = ({
  product,
  selectedFinish,
  setSelectedFinish,
  quantity,
  onIncreaseQty,
  onDecreaseQty,
  onAddToCartClick,
  isBookmarked,
  setIsBookmarked,
  onShowToast,
}) => {
  const colorOptions: Array<{ finish: FinishType; hex: string; label: string }> = [
    { finish: 'dark-patina', hex: '#6366f1', label: 'سرمه‌ای سلطنتی' },
    { finish: 'antique-bronze', hex: '#ef4444', label: 'قرمز یاقوتی' },
    { finish: 'gold-24k', hex: '#eab308', label: 'طلایی ۲۴ عیار' },
    { finish: 'original', hex: '#4a4a4a', label: 'دودی کلاسیک' },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast?.('success', 'لینک کپی شد', 'لینک صفحه محصول در کلیپ‌بورد کپی شد.');
    }
  };

  return (
    <div className="rounded-[28px] border border-[#e8ded0] bg-white p-6 md:p-7 space-y-6 shadow-xs mt-6">
      {/* قیمت و وضعیت موجودی */}
      <div className="flex items-center justify-between pb-5 border-b border-[#f0eee8]">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl font-black text-[#1a1a1a] tabular-nums">
            {product.priceFormatted || '۱۶,۴۰۰,۰۰۰ تومان'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {product.outOfStock ? (
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-extrabold border border-red-200">
              ناموجود
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
              موجود در انبار مرکزی
            </span>
          )}
        </div>
      </div>

      {/* انتخاب رنگ بدنه / پوشش */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#777]">رنگ / آبکاری بدنه:</span>
          <span className="text-xs font-extrabold text-[#111]">
            {colorOptions.find((c) => c.finish === selectedFinish)?.label || 'استاندارد'}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          {colorOptions.map((opt) => {
            const isSelected = selectedFinish === opt.finish;
            return (
              <button
                key={opt.finish}
                type="button"
                onClick={() => setSelectedFinish(opt.finish)}
                title={opt.label}
                className={`relative w-9 h-9 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-[#b59766] scale-110 shadow-sm'
                    : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: opt.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* تعداد و دکمه افزودن به سبد خرید */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-2">
        {/* کنترل تعداد */}
        <div className="sm:col-span-4 h-13 rounded-[16px] bg-[#fbf9f5] border border-[#e8ded0] flex items-center justify-between px-4">
          <button
            type="button"
            onClick={onIncreaseQty}
            aria-label="افزایش تعداد"
            className="w-8 h-8 rounded-full bg-white hover:bg-[#b59766] hover:text-white border border-[#e5dec9] text-[#222] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>

          <span className="text-sm font-extrabold text-[#1a1a1a] tabular-nums">
            {toPersianDigits(quantity)} عدد
          </span>

          <button
            type="button"
            onClick={onDecreaseQty}
            aria-label="کاهش تعداد"
            className="w-8 h-8 rounded-full bg-white hover:bg-[#b59766] hover:text-white border border-[#e5dec9] text-[#222] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* دکمه افزودن به سبد خرید */}
        <button
          type="button"
          onClick={onAddToCartClick}
          className="sm:col-span-8 h-13 rounded-[16px] bg-[#1a1a1a] hover:bg-[#333] text-white font-extrabold text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>افزودن به سبد خرید</span>
        </button>
      </div>

      {/* دکمه‌های اشتراک‌گذاری و ذخیره */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            setIsBookmarked((prev) => !prev);
            onShowToast?.(
              'success',
              isBookmarked ? 'حذف از نشان‌شده‌ها' : 'ذخیره در نشان‌شده‌ها',
              isBookmarked ? 'محصول از لیست علاقه‌مندی‌ها خارج شد.' : 'محصول به لیست علاقه‌مندی‌ها اضافه شد.'
            );
          }}
          className="flex items-center gap-2 text-xs font-bold text-[#555] hover:text-[#111] transition-colors cursor-pointer"
        >
          <ArchiveCustomIcon isFilled={isBookmarked} className="w-4.5 h-4.5" />
          <span>{isBookmarked ? 'نشان شده' : 'افزودن به نشان‌شده‌ها'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 text-xs font-bold text-[#555] hover:text-[#111] transition-colors cursor-pointer"
        >
          <ShareCustomIcon className="w-4.5 h-4.5" />
          <span>اشتراک‌گذاری محصول</span>
        </button>
      </div>
    </div>
  );
};
