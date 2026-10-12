import React from 'react';
import { ExactPalmetteVector } from './Ornaments';

/**
 * وکتور آیکون GalleryRemove دقیقاً مطابق طراحی فیگما
 * - بدنه، فریم و کوه‌ها: مشکی لوکس (#1E1E1E)
 * - ضربدر بالا سمت راست (X): طلایی / بژ کاراملی (#B8986C) با ضخامت بولدتر
 */
export const FigmaGalleryRemoveIcon: React.FC<{
  className?: string;
  size?: number | string;
}> = ({ className = '', size = 76 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`pointer-events-none select-none ${className}`}
  >
    {/* نقطه / خورشید بالا سمت چپ */}
    <path
      d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      stroke="#1e1e1e"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* فریم کلی با گوشه‌های نرم */}
    <path
      d="M13 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-5"
      stroke="#1e1e1e"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* ضربدر اختصاصی گوشه بالا سمت راست با رنگ طلایی لوکس */}
    <path
      d="m16.56 6.94 3.88-3.88M20.44 6.94l-3.88-3.88"
      stroke="#b8986c"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    {/* کوه‌ها و امواج پایینی عکس */}
    <path
      d="m2.67 18.95 4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9"
      stroke="#1e1e1e"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface SliderPhotoLoaderProps {
  className?: string;
  compact?: boolean;
}

/**
 * کامپوننت لودر عکس اسلایدر دقیقاً مطابق آرت‌بورد طراحی فیگما (Loster Salehi - Loader Photo)
 * شامل:
 * ۱. آیکون GalleryRemove با فریم مشکی و ضربدر طلایی
 * ۲. متن طلایی Chandelier
 * ۳. نام برند AKBAR SALEHI به همراه پترن‌های شاه‌عباسی / اسلیمی طلایی در دو طرف
 * ۴. متن «در حال بارگذاری تصویر»
 * ۵. سه نقطه متحرک لودینگ به رنگ طلایی
 */
export const SliderPhotoLoader: React.FC<SliderPhotoLoaderProps> = ({
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full bg-[#f6f6f6] flex flex-col items-center justify-center select-none pointer-events-none z-0 px-4 text-center overflow-hidden transition-opacity duration-500 ${className}`}
      dir="rtl"
    >
      <div className="flex flex-col items-center justify-center max-w-[92%] sm:max-w-[460px]">
        {/* ۱. آیکون GalleryRemove */}
        <div className="transition-transform duration-300">
          <FigmaGalleryRemoveIcon
            size={compact ? 56 : 78}
            className={compact ? 'w-14 h-14' : 'w-16 h-16 sm:w-20 sm:h-20'}
          />
        </div>

        {/* ۲. عنوان انگلیسی Chandelier */}
        <span
          className={`text-[#b8986c] font-serif font-medium tracking-[0.22em] uppercase mt-3 sm:mt-4 ${
            compact ? 'text-[11px]' : 'text-[12px] sm:text-[14px] lg:text-[15px]'
          }`}
        >
          Chandelier
        </span>

        {/* ۳. نام برند AKBAR SALEHI با پترن اسلیمی طلایی در دو طرف (جای سمت راست و چپ طبق درخواست دقیقاً جابه‌جا شد) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3.5 my-1 sm:my-1.5 w-full">
          {/* پترن سمت راست در RTL (دارای مقیاس معکوس -scale-x-100) */}
          <ExactPalmetteVector
            strokeColor="#cbb592"
            strokeWidth={1.5}
            className={`text-[#cbb592] opacity-85 shrink-0 -scale-x-100 ${
              compact ? 'w-6 h-auto' : 'w-7 sm:w-10 lg:w-11 h-auto'
            }`}
          />
          <h2
            className={`text-[#222222] font-serif font-bold tracking-[0.14em] uppercase whitespace-nowrap ${
              compact
                ? 'text-base'
                : 'text-lg xs:text-xl sm:text-2xl lg:text-[25px]'
            }`}
          >
            AKBAR SALEHI
          </h2>
          {/* پترن سمت چپ در RTL (بدون معکوس شدن) */}
          <ExactPalmetteVector
            strokeColor="#cbb592"
            strokeWidth={1.5}
            className={`text-[#cbb592] opacity-85 shrink-0 ${
              compact ? 'w-6 h-auto' : 'w-7 sm:w-10 lg:w-11 h-auto'
            }`}
          />
        </div>

        {/* ۴. متن فارسی در حال بارگذاری تصویر */}
        <p
          className={`text-[#666666] font-medium tracking-normal mt-1 sm:mt-1.5 ${
            compact ? 'text-[10.5px]' : 'text-[11.5px] sm:text-[13px]'
          }`}
        >
          در حال بارگذاری تصویر
        </p>

        {/* ۵. سه نقطه متحرک لودینگ طلایی */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-2.5">
          <span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#b8986c] animate-bounce"
            style={{ animationDuration: '0.9s', animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#b8986c] animate-bounce"
            style={{ animationDuration: '0.9s', animationDelay: '160ms' }}
          />
          <span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#b8986c] animate-bounce"
            style={{ animationDuration: '0.9s', animationDelay: '320ms' }}
          />
        </div>
      </div>
    </div>
  );
};
