import React, { useState, useRef, useEffect } from 'react';
import { HeroTitleOrnament } from '../Ornaments';
import { GENERATED_IMAGES } from '../../data/chandelierData';

/**
 * بخش بنر اصلی (Hero Slider)
 * - در موبایل و تبلت (چه عمودی/portrait چه افقی/landscape): اسلایدر افقی لایه‌ای با کارت‌های کناری (Peek Slider) + نقطه‌های افقی ۵گانه
 * - در دسکتاپ بزرگ: بنر عریض ماندگار با نقطه‌های عمودی در سمت چپ
 */
export const HeroSection: React.FC = () => {
  const [activeDot, setActiveDot] = useState(2);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const heroImages = [
    GENERATED_IMAGES.heroBanner,
    GENERATED_IMAGES.projectFereshteh,
    GENERATED_IMAGES.heroBanner,
    GENERATED_IMAGES.projectLobbyHotel,
    GENERATED_IMAGES.projectDuplexVilla,
  ];

  // همگام‌سازی فوق‌العاده دقیق سوایپ و اسکرول لمسی موبایل با نقطه‌های ۵گانه با متد جئومتری مرکز
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerCenter =
      container.getBoundingClientRect().left + container.offsetWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    children.forEach((child, idx) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const diff = Math.abs(containerCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeDot) {
      setActiveDot(closestIdx);
    }
  };

  // اسکرول نرم و مطمئن به اسلاید انتخابی به روش Cross-Browser
  const scrollToSlide = (index: number) => {
    setActiveDot(index);
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[index] as HTMLElement;
    if (card) {
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  useEffect(() => {
    // اسکرول اولیه به اسلاید مرکز (اسلاید شماره ۳)
    const initialTimer = setTimeout(() => {
      scrollToSlide(2);
    }, 100);

    // اسلایدر اتوماتیک با زمان ۵.۵ ثانیه جهت تغییر نرم و بدون عجله
    const interval = setInterval(() => {
      setActiveDot((prev) => {
        const nextIdx = (prev + 1) % heroImages.length;
        if (scrollRef.current && window.innerWidth < 1024) {
          const container = scrollRef.current;
          const card = container.children[nextIdx] as HTMLElement;
          if (card) {
            const scrollLeft =
              card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
        return nextIdx;
      });
    }, 5500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [heroImages.length]);

  return (
    <section className="w-full max-w-[1800px] mx-auto px-0 sm:px-6 lg:px-14 xl:px-20 pb-6 sm:pb-12">
      {/* ==================== حالت موبایل و تبلت ==================== */}
      <div className="block lg:hidden relative w-full overflow-hidden py-2">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3.5 sm:gap-5 overflow-x-auto snap-x snap-mandatory px-[8vw] sm:px-[12vw] py-2 touch-pan-x [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {heroImages.map((imgUrl, idx) => {
            const isCurrent = activeDot === idx;
            return (
              <div
                key={`mobile-hero-${idx}`}
                onClick={() => scrollToSlide(idx)}
                className={`relative w-[84vw] max-w-[640px] shrink-0 snap-center rounded-[24px] sm:rounded-[30px] overflow-hidden h-[270px] xs:h-[300px] sm:h-[350px] bg-[#121110] shadow-[0_12px_36px_rgba(0,0,0,0.18)] flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'opacity-100 scale-100 ring-1 ring-white/10'
                    : 'opacity-75 scale-[0.98]'
                }`}
              >
                {/* تصویر پس‌زمینه اسلاید */}
                <img
                  src={imgUrl}
                  alt="با شکوهی ماندگار فضای زندگی‌تان را ارتقا دهید"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* گرادینت تیره روی تصویر برای خوانایی کامل متن */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/65 to-black/30" />

                {/* محتوای متن و دکمه اسلاید */}
                <div className="relative z-10 p-4 xs:p-5 sm:p-7 flex flex-col items-start justify-center text-right h-full my-auto pt-4 pb-10 pr-5 xs:pr-6 sm:pr-8 pl-3 max-w-[90%]">
                  <div className="flex items-center justify-start gap-1.5 xs:gap-2 mb-2">
                    <HeroTitleOrnament flip className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-white shrink-0" />
                    <h1 className="text-right">
                      <span className="block text-sm xs:text-base sm:text-lg font-black text-white leading-tight tracking-tight whitespace-nowrap">
                        با شکوهی ماندگار فضای
                      </span>
                      <span className="block text-[11px] xs:text-[12.5px] sm:text-[14px] font-bold text-white/95 mt-0.5 leading-tight whitespace-nowrap">
                        زندگی‌تان را ارتقا دهید...
                      </span>
                    </h1>
                    <HeroTitleOrnament className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-white shrink-0" />
                  </div>

                  <p className="text-[10px] xs:text-[11px] sm:text-[12.5px] text-[#e5e5e5] font-normal leading-relaxed mt-1 text-right max-w-[95%]">
                    مجموعه‌ای برگزیده از لوسترهای لوکس برای سبک زندگی مدرن را کشف کنید.
                  </p>

                  <div className="mt-3 sm:mt-4 text-right">
                    <a
                      href="#collection-salehi"
                      className="inline-flex items-center justify-center px-3.5 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 rounded-[10px] sm:rounded-[12px] bg-white hover:bg-[#f5f5f5] text-[#1e1e1e] text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold shadow-md transition-colors whitespace-nowrap"
                    >
                      محصولات کلکسیون
                    </a>
                  </div>
                </div>

                {/* نقطه‌های افقی ۵گانه */}
                <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
                  {heroImages.map((_, dotIndex) => (
                    <button
                      key={`dot-m-${dotIndex}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSlide(dotIndex);
                      }}
                      aria-label={`اسلاید ${dotIndex + 1}`}
                      className={`rounded-full transition-all cursor-pointer ${
                        activeDot === dotIndex
                          ? 'w-3 h-3 bg-white shadow-xs'
                          : 'w-2 h-2 bg-white/45 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== حالت دسکتاپ بزرگ (lg به بالا) ==================== */}
      <div className="hidden lg:flex relative w-full rounded-[28px] overflow-hidden min-h-[480px] lg:min-h-[520px] 2xl:min-h-[550px] bg-[#121110] shadow-[0_18px_50px_rgba(0,0,0,0.14)] items-center justify-start">
        {/* تصویر پس‌زمینه اسلایدر */}
        <img
          src={heroImages[activeDot] || heroImages[0]}
          alt="با شکوهی ماندگار فضای زندگی‌تان را ارتقا دهید"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-left"
        />

        {/* گرادینت تیره سمت راست برای کنتراست کامل متن سفید راست‌چین */}
        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent" />

        {/* بلوک محتوای کاملاً راست‌چین با سایز فونت استاندارد و فوق‌العاده شکیل‌تر دسکتاپ */}
        <div className="relative z-10 w-full lg:w-[62%] pr-8 lg:pr-14 pl-6 py-12 flex flex-col items-start justify-center text-right">
          <div className="flex items-center justify-start gap-3">
            <HeroTitleOrnament flip className="hidden sm:block" />

            <h1 className="text-right">
              <span className="block text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-black text-white leading-[1.28] tracking-tight whitespace-nowrap">
                با شکوهی ماندگار فضای
              </span>
              <span className="block text-xl lg:text-[23px] xl:text-[26px] font-extrabold text-white leading-[1.35] mt-1.5 text-right whitespace-nowrap">
                زندگی‌تان را ارتقا دهید...
              </span>
            </h1>

            <HeroTitleOrnament className="hidden sm:block" />
          </div>

          <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#d4d4d4] font-normal leading-7 mt-5 text-right max-w-[85%]">
            مجموعه ای برگزیده از لوستر های لوکس برای سبک زندگی مدرن را کشف کنید.
          </p>

          <div className="mt-6 self-start">
            <a
              href="#collection-salehi"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-[10px] bg-white hover:bg-[#f2f2f2] text-[#222222] text-xs sm:text-[13px] font-semibold shadow-md transition-colors whitespace-nowrap"
            >
              محصولات کلکسیون
            </a>
          </div>
        </div>

        {/* نقطه‌های عمودی اسلایدر در لبه چپ بنر (دسکتاپ) */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5">
          {heroImages.map((_, dotIndex) => {
            const isSelected = activeDot === dotIndex;
            return (
              <button
                key={`dot-d-${dotIndex}`}
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
