import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HeroTitleOrnament } from '../Ornaments';
import { GENERATED_IMAGES } from '../../data/chandelierData';

export interface HeroSlideConfig {
  id: string;
  imageUrl: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface HeroSliderSettingsConfig {
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  slides: HeroSlideConfig[];
}

export const INITIAL_HERO_SLIDER_SETTINGS: HeroSliderSettingsConfig = {
  slides: [
    {
      id: 'hero-1',
      imageUrl: GENERATED_IMAGES.projectRoyalRestaurant,
      titleLine1: 'با شکوهی ماندگار فضای',
      titleLine2: 'زندگی‌تان را ارتقا دهید...',
      description:
        'مجموعه‌ای برگزیده از لوسترهای لوکس برای سبک زندگی مدرن را کشف کنید.',
      buttonText: 'محصولات کلکسیون',
      buttonUrl: '#collection-salehi',
    },
    {
      id: 'hero-2',
      imageUrl: GENERATED_IMAGES.projectFereshteh,
      titleLine1: 'اصالت هنر ایرانی در عمارت فرشته',
      titleLine2: 'طراحی اختصاصی و سفارشی',
      description: 'لوسترهای دست‌ساز برنزی و کریستال‌های مرغوب اتریشی.',
      buttonText: 'پروژه‌های اجرایی',
      buttonUrl: '#projects-salehi',
    },
    {
      id: 'hero-3',
      imageUrl: GENERATED_IMAGES.heroBanner,
      titleLine1: 'درخشش کریستال‌های ۱۰۰٪ اصیل',
      titleLine2: 'ضمانت کتبی ثبات رنگ و کیفیت',
      description:
        'تولید شده در کارگاه مرکزی لوستر صالحی با نیم قرن سابقه درخشان.',
      buttonText: 'دانلود کاتالوگ محصولات',
      buttonUrl: '#catalog-pdf',
    },
    {
      id: 'hero-4',
      imageUrl: GENERATED_IMAGES.projectLobbyHotel,
      titleLine1: 'شکوه و جلوه ماندگار لابی',
      titleLine2: 'برای هتل‌ها و مجتمع‌های فاخر',
      description: 'مشاوره و ساخت انحصاری لوسترهای غول‌پیکر لابی و دوبلکس.',
      buttonText: 'مشاوره و پشتیبانی',
      buttonUrl: 'tel:09120759419',
    },
    {
      id: 'hero-5',
      imageUrl: GENERATED_IMAGES.projectDuplexVilla,
      titleLine1: 'کالکشن جدید لوستر و روشنایی',
      titleLine2: 'ویژه‌ی ویلاها و منازل لوکس',
      description: 'تنوع بی‌نظیر در مدل‌های سقفی، دیواری و آویز کلاسیک و مدرن.',
      buttonText: 'خرید اینترنتی',
      buttonUrl: '#collection-salehi',
    },
  ],
};

interface HeroSectionProps {
  heroSettings?: HeroSliderSettingsConfig;
}

/**
 * بخش بنر اصلی (Hero Slider)
 * - در موبایل و تبلت (چه عمودی/portrait چه افقی/landscape): اسلایدر افقی لایه‌ای با کارت‌های کناری (Peek Slider) + نقطه‌های افقی ۵گانه با حرکت نرم
 * - در دسکتاپ بزرگ: بنر عریض ماندگار با انیمیشن نرم Crossfade و نقطه‌های عمودی در سمت چپ
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ heroSettings }) => {
  const settings: HeroSliderSettingsConfig = {
    ...INITIAL_HERO_SLIDER_SETTINGS,
    ...(heroSettings || {}),
    slides:
      heroSettings?.slides && heroSettings.slides.length > 0
        ? heroSettings.slides
        : INITIAL_HERO_SLIDER_SETTINGS.slides,
  };

  const heroImages = settings.slides.map((s) => s.imageUrl);
  const [activeDot, setActiveDot] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);

  // اسکرول نرم و دقیق به اسلاید انتخابی در موبایل/تبلت با محاسبه اختلاف مرکز (سازگار با RTL)
  const scrollToSlide = useCallback((index: number, smooth = true) => {
    setActiveDot(index);
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.children[index] as HTMLElement | undefined;
    if (!card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    if (containerRect.width === 0) return;

    const deltaX =
      cardRect.left +
      cardRect.width / 2 -
      (containerRect.left + containerRect.width / 2);

    isProgrammaticScrollRef.current = true;
    if (programmaticTimerRef.current) {
      window.clearTimeout(programmaticTimerRef.current);
    }

    container.scrollBy({
      left: deltaX,
      behavior: smooth ? 'smooth' : 'auto',
    });

    programmaticTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 680);
  }, []);

  // همگام‌سازی سوایپ و اسکرول لمسی موبایل با نقطه‌های ۵گانه با متد جئومتری مرکز
  const handleScroll = () => {
    if (!scrollRef.current || isProgrammaticScrollRef.current) return;
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

  useEffect(() => {
    // قرارگیری اولیه روی اسلاید مرکز (اسلاید شماره ۳) بدون پرش
    const initialTimer = window.setTimeout(() => {
      scrollToSlide(2, false);
    }, 80);

    return () => {
      window.clearTimeout(initialTimer);
      if (programmaticTimerRef.current) {
        window.clearTimeout(programmaticTimerRef.current);
      }
    };
  }, [scrollToSlide]);

  useEffect(() => {
    if (isPaused) return;

    // اسلایدر اتوماتیک با زمان ۵ ثانیه جهت تغییر نرم و بدون عجله
    const interval = window.setInterval(() => {
      setActiveDot((prev) => {
        const nextIdx = (prev + 1) % heroImages.length;
        if (scrollRef.current && window.innerWidth < 1024) {
          const container = scrollRef.current;
          const card = container.children[nextIdx] as HTMLElement | undefined;
          if (card) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const deltaX =
              cardRect.left +
              cardRect.width / 2 -
              (containerRect.left + containerRect.width / 2);

            isProgrammaticScrollRef.current = true;
            if (programmaticTimerRef.current) {
              window.clearTimeout(programmaticTimerRef.current);
            }
            container.scrollBy({ left: deltaX, behavior: 'smooth' });
            programmaticTimerRef.current = window.setTimeout(() => {
              isProgrammaticScrollRef.current = false;
            }, 680);
          }
        }
        return nextIdx;
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [heroImages.length, isPaused]);

  const handleDesktopPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = e.clientX;
  };

  const handleDesktopPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    const diff = e.clientX - dragStartXRef.current;
    dragStartXRef.current = null;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        setActiveDot((prev) => (prev + 1) % heroImages.length);
      } else {
        setActiveDot((prev) => (prev - 1 + heroImages.length) % heroImages.length);
      }
    }
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="w-full max-w-[1800px] mx-auto px-0 sm:px-6 lg:px-14 xl:px-20 pb-6 sm:pb-12"
    >
      {/* ==================== حالت موبایل و تبلت ==================== */}
      <div className="block lg:hidden relative w-full overflow-hidden py-2">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3.5 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[8vw] sm:px-[12vw] py-2 touch-pan-x [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {settings.slides.map((slide, idx) => {
            const isCurrent = activeDot === idx;
            const imgUrl = slide.imageUrl;
            const titleLine1 = slide.titleLine1?.trim();
            const titleLine2 = slide.titleLine2?.trim();
            const description = slide.description?.trim();
            const buttonText = slide.buttonText?.trim();
            const buttonUrl = slide.buttonUrl?.trim();
            const hasTitle = Boolean(titleLine1 || titleLine2);

            return (
              <div
                key={`mobile-hero-${slide.id || idx}`}
                onClick={() => scrollToSlide(idx, true)}
                className={`relative w-[84vw] max-w-[640px] shrink-0 snap-center rounded-[24px] sm:rounded-[30px] overflow-hidden h-[270px] xs:h-[300px] sm:h-[350px] bg-[#121110] shadow-[0_12px_36px_rgba(0,0,0,0.18)] flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                  isCurrent
                    ? 'opacity-100 scale-100 ring-1 ring-white/15'
                    : 'opacity-70 scale-[0.95]'
                }`}
              >
                {/* تصویر پس‌زمینه اسلاید با زوم نرم هنگام فعال شدن */}
                <img
                  src={imgUrl}
                  alt={titleLine1 || titleLine2 || 'اسلایدر اصلی لوستر صالحی'}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCurrent ? 'scale-100' : 'scale-110'
                  }`}
                />

                {/* گرادینت تیره روی تصویر برای خوانایی کامل متن */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/65 to-black/30" />

                {/* محتوای متن و دکمه اسلاید (در صورت وجود) */}
                <div
                  className={`relative z-10 p-4 xs:p-5 sm:p-7 flex flex-col items-start justify-center text-right h-full my-auto pt-4 pb-6 pr-5 xs:pr-6 sm:pr-8 pl-3 max-w-[90%] transition-all duration-700 ease-out ${
                    isCurrent
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-80 translate-y-1'
                  }`}
                >
                  {hasTitle && (
                    <div className="flex items-center justify-start gap-1.5 xs:gap-2 mb-2">
                      <HeroTitleOrnament flip className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-white shrink-0" />
                      <h1 className="text-right">
                        {titleLine1 && (
                          <span className="block text-sm xs:text-base sm:text-lg font-black text-white leading-tight tracking-tight whitespace-nowrap">
                            {titleLine1}
                          </span>
                        )}
                        {titleLine2 && (
                          <span className="block text-[11px] xs:text-[12.5px] sm:text-[14px] font-bold text-white/95 mt-0.5 leading-tight whitespace-nowrap">
                            {titleLine2}
                          </span>
                        )}
                      </h1>
                      <HeroTitleOrnament className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-white shrink-0" />
                    </div>
                  )}

                  {description && (
                    <p className="text-[10px] xs:text-[11px] sm:text-[12.5px] text-[#e5e5e5] font-normal leading-relaxed mt-1 text-right max-w-[95%]">
                      {description}
                    </p>
                  )}

                  {buttonText && (
                    <div className="mt-3 sm:mt-4 text-right">
                      <a
                        href={buttonUrl || '#collection-salehi'}
                        className="inline-flex items-center justify-center px-3.5 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 rounded-[10px] sm:rounded-[12px] bg-white hover:bg-[#f5f5f5] text-[#1e1e1e] text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold shadow-md transition-colors whitespace-nowrap"
                      >
                        {buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* نقطه‌های افقی ناوبری موبایل (تنها یک بار در انتهای باکس اسلایدر) */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          {settings.slides.map((_, dotIndex) => (
            <button
              key={`dot-m-${dotIndex}`}
              type="button"
              onClick={() => scrollToSlide(dotIndex, true)}
              aria-label={`اسلاید ${dotIndex + 1}`}
              className={`rounded-full transition-all duration-500 ease-out cursor-pointer ${
                activeDot === dotIndex
                  ? 'w-3 h-3 bg-black shadow-xs scale-105'
                  : 'w-2 h-2 bg-black/40 hover:bg-black'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ==================== حالت دسکتاپ بزرگ (lg به بالا) ==================== */}
      <div
        onPointerDown={handleDesktopPointerDown}
        onPointerUp={handleDesktopPointerUp}
        className="hidden lg:flex relative w-full rounded-[28px] overflow-hidden min-h-[480px] lg:min-h-[520px] 2xl:min-h-[550px] bg-[#121110] shadow-[0_18px_50px_rgba(0,0,0,0.14)] items-center justify-start select-none"
      >
        {/* تصاویر پس‌زمینه اسلایدر با انیمیشن نرم Crossfade و زوم/لایه سینمایی */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {settings.slides.map((slide, idx) => {
            const isSelected = activeDot === idx;
            return (
              <img
                key={`desktop-hero-slide-${slide.id || idx}`}
                src={slide.imageUrl}
                alt={slide.titleLine1 || slide.titleLine2 || 'لوستر صالحی'}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-left transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
                  isSelected
                    ? 'opacity-100 scale-100 translate-x-0 z-[1]'
                    : idx < activeDot
                      ? 'opacity-0 scale-[1.06] translate-x-5 z-0'
                      : 'opacity-0 scale-[1.06] -translate-x-5 z-0'
                }`}
              />
            );
          })}
        </div>

        {/* گرادینت تیره سمت راست برای کنتراست کامل متن سفید راست‌چین */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none" />

        {/* بلوک محتوای کاملاً راست‌چین با سایز فونت استاندارد دسکتاپ */}
        {(() => {
          const currentSlide = settings.slides[activeDot] || settings.slides[0];
          const t1 = currentSlide?.titleLine1?.trim();
          const t2 = currentSlide?.titleLine2?.trim();
          const desc = currentSlide?.description?.trim();
          const bText = currentSlide?.buttonText?.trim();
          const bUrl = currentSlide?.buttonUrl?.trim();
          const hasTitle = Boolean(t1 || t2);

          if (!hasTitle && !desc && !bText) {
            return null; // اگر هیچ متنی و دکمه‌ای نیست، کاملاً هیدن می‌شود
          }

          return (
            <div className="relative z-10 w-full lg:w-[62%] pr-8 lg:pr-14 pl-6 py-12 flex flex-col items-start justify-center text-right transition-all duration-500">
              {hasTitle && (
                <div className="flex items-center justify-start gap-3">
                  <HeroTitleOrnament flip className="hidden sm:block" />

                  <h1 className="text-right">
                    {t1 && (
                      <span className="block text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-black text-white leading-[1.28] tracking-tight whitespace-nowrap">
                        {t1}
                      </span>
                    )}
                    {t2 && (
                      <span className="block text-xl lg:text-[23px] xl:text-[26px] font-extrabold text-white leading-[1.35] mt-1.5 text-right whitespace-nowrap">
                        {t2}
                      </span>
                    )}
                  </h1>

                  <HeroTitleOrnament className="hidden sm:block" />
                </div>
              )}

              {desc && (
                <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#d4d4d4] font-normal leading-7 mt-5 text-right max-w-[85%]">
                  {desc}
                </p>
              )}

              {bText && (
                <div className="mt-6 self-start">
                  <a
                    href={bUrl || '#collection-salehi'}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-[10px] bg-white hover:bg-[#f2f2f2] text-[#222222] text-xs sm:text-[13px] font-semibold shadow-md transition-colors whitespace-nowrap"
                  >
                    {bText}
                  </a>
                </div>
              )}
            </div>
          );
        })()}

        {/* نقطه‌های عمودی اسلایدر در لبه چپ بنر (دسکتاپ) */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5">
          {settings.slides.map((_, dotIndex) => {
            const isSelected = activeDot === dotIndex;
            return (
              <button
                key={`dot-d-${dotIndex}`}
                type="button"
                onClick={() => setActiveDot(dotIndex)}
                aria-label={`اسلاید ${dotIndex + 1}`}
                className={`rounded-full transition-all duration-500 ease-out cursor-pointer ${
                  isSelected
                    ? 'w-3 h-3 bg-white shadow-xs scale-105'
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
