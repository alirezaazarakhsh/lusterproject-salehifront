import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../Ornaments';
import { MAGAZINE_ARTICLES, MagazineArticle } from '../../data/chandelierData';

interface MagazineSectionProps {
  articles?: MagazineArticle[];
  onSelectArticle: (article: MagazineArticle) => void;
}

/**
 * بخش «مجله های لوستر» (کاروسل افقی مشابه محصولات با حداکثر ۲۰ مقاله و دکمه‌های ناوبری دسکتاپ)
 */
export const MagazineSection: React.FC<MagazineSectionProps> = ({
  articles,
  onSelectArticle,
}) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const desktopIndexRef = useRef<number>(0);
  const isButtonScrollingRef = useRef<boolean>(false);
  const buttonScrollTimeoutRef = useRef<number | null>(null);

  const allArticles =
    articles && articles.length > 0 ? articles : MAGAZINE_ARTICLES;
  const displayArticles = allArticles.slice(0, 20);

  const handleCarouselScroll = () => {
    if (isButtonScrollingRef.current) return;
    const container = carouselRef.current;
    if (!container || window.innerWidth < 768) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-magazine-card="true"]')
    ).filter((el) => el.offsetParent !== null);
    if (cards.length === 0) return;

    const containerRight = container.getBoundingClientRect().right;
    let closestIdx = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const diff = Math.abs(card.getBoundingClientRect().right - containerRight);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    desktopIndexRef.current = closestIdx;
  };

  const scrollDesktopCarousel = (direction: 'next' | 'prev') => {
    const container = carouselRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-magazine-card="true"]')
    ).filter((el) => el.offsetParent !== null);
    if (cards.length === 0) return;

    const visibleCount = window.innerWidth >= 1024 ? 4 : 2;
    const maxStartIndex = Math.max(0, cards.length - visibleCount);

    let nextIndex = desktopIndexRef.current;
    if (direction === 'next') {
      nextIndex = nextIndex >= maxStartIndex ? 0 : nextIndex + 1;
    } else {
      nextIndex = nextIndex <= 0 ? maxStartIndex : nextIndex - 1;
    }
    desktopIndexRef.current = nextIndex;

    const targetCard = cards[nextIndex];
    if (!targetCard) return;

    isButtonScrollingRef.current = true;
    if (buttonScrollTimeoutRef.current) {
      window.clearTimeout(buttonScrollTimeoutRef.current);
    }
    buttonScrollTimeoutRef.current = window.setTimeout(() => {
      isButtonScrollingRef.current = false;
    }, 550);

    const containerRight = container.getBoundingClientRect().right;
    const targetRight = targetCard.getBoundingClientRect().right;
    const deltaX = targetRight - containerRight;

    container.scrollBy({
      left: deltaX,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="magazine-section"
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-12 overflow-hidden"
    >
      <SectionHeading title="مجله های لوستر" mobileTitle="مجله لوستر" className="mb-8 sm:mb-10" />

      {/* کاروسل افقی مقالات در موبایل و دسکتاپ */}
      <div
        ref={carouselRef}
        onScroll={handleCarouselScroll}
        className="flex gap-3.5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pr-4 pl-6 xs:pr-5 xs:pl-8 md:px-0 py-2 touch-pan-x [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayArticles.map((article) => (
          <article
            key={article.id}
            data-magazine-card="true"
            className="group shrink-0 snap-start w-[83vw] max-w-[345px] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] md:max-w-none bg-white rounded-[16px] border border-[#eeeeee] p-4 shadow-[0_6px_26px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_36px_rgba(181,151,102,0.12)] transition-all flex flex-col justify-between min-w-0"
          >
            <div className="min-w-0">
              {/* تصویر مقاله */}
              <div
                onClick={() => onSelectArticle(article)}
                className="rounded-[12px] h-48 sm:h-52 overflow-hidden bg-[#f2f2f2] cursor-pointer"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* عنوان و خلاصه متن مقاله */}
              <div className="mt-4 px-1 text-right min-w-0">
                <h3
                  onClick={() => onSelectArticle(article)}
                  className="text-[14.5px] font-bold text-[#222222] hover:text-[#b59766] transition-colors cursor-pointer"
                >
                  {article.title}
                </h3>
                <p className="text-xs text-[#222222] leading-6 mt-2.5 text-right overflow-hidden break-words line-clamp-4 max-w-full">
                  {article.excerpt}
                </p>
              </div>
            </div>

            {/* ردیف پایین کارت: دکمه مطالعه بیشتر در راست و تاریخ در چپ */}
            <div className="mt-5 pt-2 px-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectArticle(article)}
                className="h-9 px-4 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap bg-[#f2f2f2] text-[#222222] hover:bg-[#272727] hover:text-white"
              >
                مطالعه بیشتر
              </button>

              <span className="text-xs text-[#222222] tabular-nums">
                {article.date}
              </span>
            </div>
          </article>
        ))}

        {/* دکمه عمودی «مشاهده تمامی مقالات» در انتهای کاروسل مجله در موبایل */}
        {displayArticles[0] && (
          <button
            type="button"
            onClick={() => onSelectArticle(displayArticles[0])}
            className="md:hidden shrink-0 snap-center h-[200px] xs:h-[220px] my-auto w-[38px] xs:w-[42px] mr-2 xs:mr-3 rounded-[14px] xs:rounded-[16px] bg-[#c7a975] hover:bg-[#b59766] active:bg-[#9e7f4c] text-white flex items-center justify-center cursor-pointer shadow-sm transition-all self-center"
          >
            <span
              className="font-bold text-[12px] xs:text-[13px] tracking-wider text-white select-none whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              مشاهده تمامی مقالات
            </span>
          </button>
        )}
      </div>

      {/* دکمه‌های صفحه‌بندی پایین مجله (فقط در دسکتاپ و هنگامی که تعداد مقالات بیشتر از ۴ تا باشد) */}
      {displayArticles.length > 4 && (
        <div className="hidden md:flex mt-8 items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollDesktopCarousel('prev')}
            aria-label="قبلی"
            className="w-10 h-10 rounded-[8px] bg-white hover:bg-[#b59766] hover:text-white hover:border-[#b59766] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              displayArticles[0] && onSelectArticle(displayArticles[0])
            }
            className="h-10 px-7 rounded-[8px] bg-white hover:bg-[#b59766] text-[#b59766] hover:text-white border border-[#c9b28b] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            مشاهده تمامی مقالات
          </button>

          <button
            type="button"
            onClick={() => scrollDesktopCarousel('next')}
            aria-label="بعدی"
            className="w-10 h-10 rounded-[8px] bg-white hover:bg-[#b59766] hover:text-white hover:border-[#b59766] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
