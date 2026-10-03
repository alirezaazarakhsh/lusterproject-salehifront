import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STORY_ITEMS, StoryItem } from '../../data/chandelierData';

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
  const timerRef = useRef<number | null>(null);

  // پشتیبانی از کشیدن کروسل با موس (Drag to Scroll)
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  useEffect(() => {
    if (!activeStoryId) {
      setLoadingStoryId(null);
    }
  }, [activeStoryId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
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
    }

    setLoadingStoryId(story.id);

    timerRef.current = window.setTimeout(() => {
      onSelectStory(story);
    }, 320);
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
            const isDashed =
              loadingStoryId === story.id || activeStoryId === story.id || Boolean(story.hasDashedRing);

            return (
              <button
                key={story.id}
                type="button"
                onClick={() => handleStoryClick(story)}
                className="group flex flex-col items-center gap-2.5 shrink-0 w-[86px] sm:w-[96px] cursor-pointer focus:outline-none"
              >
                {/* حلقه دور تصویر استوری */}
                <div className="relative w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] flex items-center justify-center">
                  {isDashed ? (
                    /* حالت فعال یا در حال لود: خط‌چین تیره بدون چرخش */
                    <svg
                      viewBox="0 0 88 88"
                      className="absolute inset-0 w-full h-full text-[#2b2b2b]"
                    >
                      <circle
                        cx="44"
                        cy="44"
                        r="41"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="9.5 7.5"
                      />
                    </svg>
                  ) : (
                    /* حالت عادی: خط صاف و ممتد طلایی */
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

                  {/* تصویر دایره‌ای تمام‌پر (۱۰۰٪ داخل گردی) با فاصله سفید تمیز از حلقه بیرونی */}
                  <div className="w-[66px] h-[66px] sm:w-[71px] sm:h-[71px] rounded-full overflow-hidden bg-[#1b1815]">
                    <img
                      src={story.thumbnailImage || story.image}
                      alt={story.fullTitle}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="w-full h-full object-cover object-center rounded-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                <span className="text-[12px] sm:text-[12.5px] font-bold text-[#1e1e1e] group-hover:text-[#b59766] transition-colors truncate w-full text-center">
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
