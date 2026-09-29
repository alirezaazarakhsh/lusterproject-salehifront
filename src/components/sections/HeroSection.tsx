import React, { useState } from 'react';
import { HeroTitleOrnament } from '../Ornaments';
import { GENERATED_IMAGES } from '../../data/chandelierData';

/**
 * بخش بنر اصلی (Hero Slider) دقیقاً مطابق تصویر دوم ارسالی:
 * - بدون نمای سه‌بعدی در اسلایدر
 * - چیدمان کاملاً راست‌چین با فونت‌های درشت‌تر و خوانا
 * - دکمه سفید «محصولات کلکسیون» در سمت راست
 */
export const HeroSection: React.FC = () => {
  const [activeDot, setActiveDot] = useState(3);

  const heroImages = [
    GENERATED_IMAGES.heroBanner,
    GENERATED_IMAGES.projectFereshteh,
    GENERATED_IMAGES.heroBanner,
    GENERATED_IMAGES.heroBanner,
    GENERATED_IMAGES.projectFereshteh,
    GENERATED_IMAGES.heroBanner,
    GENERATED_IMAGES.heroBanner,
  ];

  return (
    <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 pb-12">
      <div className="relative w-full rounded-[28px] overflow-hidden min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] 2xl:min-h-[580px] bg-[#121110] shadow-[0_18px_50px_rgba(0,0,0,0.14)] flex items-center justify-start">
        {/* تصویر پس‌زمینه اسلایدر */}
        <img
          src={heroImages[activeDot]}
          alt="با شکوهی ماندگار فضای زندگی‌تان را ارتقا دهید"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-left"
        />

        {/* گرادینت تیره سمت راست برای کنتراست کامل متن سفید راست‌چین (مشابه عکس دوم) */}
        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent" />

        {/* بلوک محتوای کاملاً راست‌چین در سمت راست بنر */}
        <div className="relative z-10 w-full lg:w-[62%] pr-6 sm:pr-10 lg:pr-14 pl-6 py-12 flex flex-col items-start justify-center text-right">
          {/* تیتر دوخطی درشت به همراه نقوش اسلیمی سفید در طرفین */}
          <div className="flex items-center justify-start gap-2 sm:gap-3.5">
            {/* اسلیمی سمت راست (نوک به سمت راست، پایه حلزونی چسبیده به ابتدای متن) */}
            <HeroTitleOrnament flip className="hidden sm:block" />

            <h1 className="text-right">
              <span className="block text-2xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black text-white leading-[1.28] tracking-tight sm:whitespace-nowrap">
                با شکوهی ماندگار فضای
              </span>
              <span className="block text-xl sm:text-2xl lg:text-[30px] xl:text-[33px] font-extrabold text-white leading-[1.35] mt-2 text-right sm:whitespace-nowrap">
                زندگی‌تان را ارتقا دهید...
              </span>
            </h1>

            {/* اسلیمی سمت چپ (پایه حلزونی چسبیده به انتهای خط اول، نوک به سمت چپ) */}
            <HeroTitleOrnament className="hidden sm:block" />
          </div>

          {/* زیرتیتر راست‌چین با سایز بزرگ‌تر */}
          <p className="text-sm sm:text-base lg:text-[17px] text-[#d4d4d4] font-normal leading-8 mt-6 text-right">
            مجموعه ای برگزیده از لوستر های لوکس برای سبک زندگی مدرن را کشف کنید.
          </p>

          {/* دکمه سفید محصولات کلکسیون در سمت راست */}
          <div className="mt-8 self-start">
            <a
              href="#collection-salehi"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-[12px] bg-white hover:bg-[#f2f2f2] text-[#222222] text-sm sm:text-[15px] font-semibold shadow-md transition-colors whitespace-nowrap"
            >
              محصولات کلکسیون
            </a>
          </div>
        </div>

        {/* نقطه‌های عمودی اسلایدر در لبه چپ بنر (۳ نقطه ریز بالا، ۱ نقطه سفید درشت وسط، ۳ نقطه ریز پایین) */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5">
          {[0, 1, 2, 3, 4, 5, 6].map((dotIndex) => {
            const isSelected = activeDot === dotIndex;
            return (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setActiveDot(dotIndex)}
                aria-label={`اسلاید ${dotIndex + 1}`}
                className={`rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'w-3 h-3 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/45 hover:bg-white/80'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
