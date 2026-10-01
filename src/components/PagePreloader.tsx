import React, { useEffect, useState } from 'react';
import { ExactPalmetteVector } from './Ornaments';

interface PagePreloaderProps {
  isVisible: boolean;
}

/**
 * پریلودر (Preloader) صفحات سایت هنگام باز شدن اولیه و جابه‌جایی بین صفحات
 * دقیقاً مطابق تصاویر دسکتاپ (Screenshot 13.01.36) و موبایل (Screenshot 13.02.12)
 */
export const PagePreloader: React.FC<PagePreloaderProps> = ({ isVisible }) => {
  // اندیس نقطه خاکستری روشن (پیش‌فرض ۱ یعنی نقطه وسط روشن و دو نقطه کناری تیره دقیقاً مطابق عکس)
  const [lightDotIndex, setLightDotIndex] = useState<number>(1);

  useEffect(() => {
    if (!isVisible) {
      setLightDotIndex(1);
      return;
    }
    const interval = window.setInterval(() => {
      setLightDotIndex((prev) => (prev + 1) % 3);
    }, 320);
    return () => window.clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      dir="ltr"
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری صفحه"
      className="fixed inset-0 z-[120] bg-black/45 flex items-center justify-center px-5 select-none transition-opacity duration-200"
    >
      <div className="w-full max-w-[348px] sm:max-w-[345px] bg-white rounded-[18px] sm:rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.22)] px-5 sm:px-6 pt-6 pb-5 sm:pt-6 sm:pb-5 flex flex-col items-center justify-center">
        {/* عنوان طلایی بالای لوگو */}
        <span className="text-[13.5px] sm:text-[12px] font-semibold tracking-[0.02em] text-[#b58d53] leading-none mb-1.5">
          Chandelier
        </span>

        {/* ردیف لوگو و دو وکتور طلایی چپ و راست */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-2.5">
          {/* وکتور سمت چپ با نوک رو به بیرون (چپ) */}
          <ExactPalmetteVector
            strokeColor="#cbb592"
            strokeWidth={1.6}
            className="w-10 h-9 sm:w-9 sm:h-8 shrink-0"
          />

          {/* نام برند مرکزی */}
          <span className="font-brand-serif text-[23px] xs:text-[25px] sm:text-[22.5px] tracking-[0.04em] text-[#222222] font-normal uppercase leading-none whitespace-nowrap">
            AKBAR SALEHI
          </span>

          {/* وکتور سمت راست با نوک رو به بیرون (راست) */}
          <ExactPalmetteVector
            strokeColor="#cbb592"
            strokeWidth={1.6}
            className="w-10 h-9 sm:w-9 sm:h-8 shrink-0 -scale-x-100"
          />
        </div>

        {/* سه نقطه لودینگ پایین کارت */}
        <div className="flex items-center justify-center gap-2 mt-5 sm:mt-4">
          {[0, 1, 2].map((idx) => {
            const isLight = idx === lightDotIndex;
            return (
              <span
                key={idx}
                className={`w-[8px] h-[8px] sm:w-[7px] sm:h-[7px] rounded-full transition-colors duration-200 ${
                  isLight ? 'bg-[#cccccc]' : 'bg-[#2b2b2b]'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PagePreloader;
