import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STORY_ITEMS, StoryItem } from '../../data/chandelierData';
import { handleImgErrorFallback, resolveDirectImageUrl } from '../../utils/imageCdnHelper';
import { StoryLoadingImageIcon } from '../Ornaments';

interface StoriesSectionProps {
  stories?: StoryItem[];
  activeStoryId?: string | null;
  onSelectStory: (story: StoryItem) => void;
}

/**
 * بخش استوری‌های دایره‌ای بالای صفحه به صورت کروسل افقی (با ۲۰ آیتم قابل اسکرول و درگ):
 * - در حالت عادی: خط صاف و ممتد طلایی دور دایره
 * - هنگام کلیک و باز شدن استوری: تبدیل به خط‌چین تیره و چرخش نرم (Spin)
 * - پس از مشاهده و بستن استوری: بازگشت خودکار به حالت خط صاف عادی
 */
export const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories = STORY_ITEMS,
  activeStoryId = null,
  onSelectStory,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [loadingStoryId, setLoadingStoryId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const timerRef = useRef<number | null>(null);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  // پشتیبانی از کشیدن کروسل با موس (Drag to Scroll)
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  // وقتی استوری باز شد یا تغییر کرد، وضعیت لودینگ و چرخش بلافاصله متوقف می‌شود
  useEffect(() => {
    setLoadingStoryId(null);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [activeStoryId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleStoryClick = (story: StoryItem) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // اگر همین استوری در حال باز بودن است، نیازی به لودینگ مجدد نیست
    if (activeStoryId === story.id) {
      return;
    }

    if (loadingStoryId === story.id) {
      return;
    }

    setLoadingStoryId(story.id);

    // خط‌چین دور دایره با سرعت آرام و نرم می‌چرخد و پس از تکمیل، استوری باز شده و چرخش کاملاً متوقف می‌شود
    timerRef.current = window.setTimeout(() => {
      setLoadingStoryId(null);
      timerRef.current = null;
      onSelectStory(story);
    }, 1500);
  };

  const handleScroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const step = 340;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX - scrollRef.current.offsetLeft;
    dragStartScrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - dragStartXRef.current;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    scrollRef.current.scrollLeft = dragStartScrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="w-full max-w-[1800px] mx-auto px-3 sm:px-8 lg:px-14 xl:px-20 pt-4 sm:pt-6 pb-4 sm:pb-5">
      <div className="relative flex items-center justify-between w-full gap-2">
        {/* دکمه فلش سمت راست دسکتاپ (بدون بک‌گراند گرد - فقط آیکون خالی) */}
        {stories.length > 10 && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="اسکرول به راست"
            className="hidden md:flex items-center justify-center text-[#333333] hover:text-[#b08c57] shrink-0 transition-colors cursor-pointer z-10 p-1.5"
          >
            <ChevronRight className="w-5 h-5 text-[#333333] hover:text-[#b08c57] transition-colors" />
          </button>
        )}

        {/* ردیف کروسل استوری‌های دایره‌ای با قابلیت لمسی/سوایپ و درگ روی تمامی دستگاه‌ها */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-center justify-start gap-3.5 sm:gap-6 overflow-x-auto py-1 w-full select-none cursor-grab active:cursor-grabbing touch-pan-x [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {stories.map((story) => {
            const isCurrentlyOpen = activeStoryId === story.id;
            // چرخش فقط در بازه لودینگ قبل از باز شدن استوری فعال است و به محض باز شدن استوری کاملاً متوقف می‌شود
            const isLoadingThis = loadingStoryId === story.id && !isCurrentlyOpen;
            const isDashed =
              isLoadingThis || isCurrentlyOpen || Boolean(story.hasDashedRing);

            return (
              <button
                key={story.id}
                type="button"
                onClick={() => handleStoryClick(story)}
                className="group flex flex-col items-center gap-2.5 shrink-0 w-[86px] sm:w-[96px] cursor-pointer focus:outline-none"
              >
                {/* حلقه دور تصویر استوری */}
                <div className="relative w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] flex items-center justify-center">
                  {isLoadingThis ? (
                    /* هنگام کلیک قبل از باز شدن استوری: چرخش نرم خط‌چین کاملاً مشکی با تعداد کمتر */
                    <svg
                      viewBox="0 0 88 88"
                      className="absolute inset-0 w-full h-full text-[#111111] animate-spin"
                      style={{ animationDuration: '2.5s', animationTimingFunction: 'linear' }}
                    >
                      <circle
                        cx="44"
                        cy="44"
                        r="41"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeDasharray="22 14"
                      />
                    </svg>
                  ) : isDashed ? (
                    /* حالت استوری بازشده، فعال یا مشاهده‌شده: خط‌چین مشکی با تعداد کمتر ثابت بدون چرخش */
                    <svg
                      viewBox="0 0 88 88"
                      className="absolute inset-0 w-full h-full text-[#111111]"
                    >
                      <circle
                        cx="44"
                        cy="44"
                        r="41"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="22 14"
                      />
                    </svg>
                  ) : (
                    /* حالت عادی: خط صاف و ممتد طلایی لوکس */
                    <svg
                      viewBox="0 0 88 88"
                      className="absolute inset-0 w-full h-full text-[#b8986b] group-hover:scale-[1.03] transition-transform duration-300"
                    >
                      <circle
                        cx="44"
                        cy="44"
                        r="41"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                      />
                    </svg>
                  )}

                  {/* تصویر دایره‌ای با پس‌زمینه لایت و نرم همراه با آیکون ارسالی کاربر در مرکز */}
                  <div className={`relative w-[66px] h-[66px] sm:w-[71px] sm:h-[71px] rounded-full overflow-hidden bg-[#f4f4f4] border border-[#dedede] transition-all duration-300 flex items-center justify-center ${isLoadingThis ? 'scale-95 brightness-95 ring-2 ring-black/30' : ''}`}>
                    {/* آیکون لودینگ استوری در مرکز دایره (دقیقاً آیکون مشکی کوه و خورشید) */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 transition-opacity duration-300 ${
                        loadedImages[story.id] ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <StoryLoadingImageIcon
                        size={28}
                        color="#1e1e1e"
                        className={isLoadingThis ? 'animate-pulse' : ''}
                      />
                    </div>

                    {/* عکس استوری که پس از لود شدن روی دایره می‌نشیند */}
                    <img
                      src={resolveDirectImageUrl(story.thumbnailImage || story.image, { width: 300, quality: 80 })}
                      alt={story.fullTitle}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onLoad={() => handleImageLoad(story.id)}
                      onError={(e) => handleImgErrorFallback(e)}
                      draggable={false}
                      className={`relative z-10 w-full h-full object-cover object-center rounded-full transition-all duration-300 ${loadedImages[story.id] ? 'opacity-100' : 'opacity-0'} ${isLoadingThis ? 'scale-105' : 'group-hover:scale-110'}`}
                    />
                  </div>
                </div>

                <span className={`text-[12px] sm:text-[12.5px] font-bold transition-colors truncate w-full text-center ${isLoadingThis ? 'text-[#b8986b]' : 'text-[#1e1e1e] group-hover:text-[#b59766]'}`}>
                  {story.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* دکمه فلش سمت چپ دسکتاپ (بدون بک‌گراند گرد - فقط آیکون خالی) */}
        {stories.length > 10 && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="اسکرول به چپ"
            className="hidden md:flex items-center justify-center text-[#333333] hover:text-[#b08c57] shrink-0 transition-colors cursor-pointer z-10 p-1.5"
          >
            <ChevronLeft className="w-5 h-5 text-[#333333] hover:text-[#b08c57] transition-colors" />
          </button>
        )}
      </div>
    </section>
  );
};
