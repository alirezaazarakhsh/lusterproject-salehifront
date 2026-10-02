import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../Ornaments';
import { MAGAZINE_ARTICLES, MagazineArticle } from '../../data/chandelierData';

interface MagazineSectionProps {
  articles?: MagazineArticle[];
  onSelectArticle: (article: MagazineArticle) => void;
}

/**
 * بخش «مجله های لوستر» (دقیقاً مطابق نیمه بالایی عکس چهارم)
 */
export const MagazineSection: React.FC<MagazineSectionProps> = ({
  articles,
  onSelectArticle,
}) => {
  const displayArticles =
    articles && articles.length > 0 ? articles : MAGAZINE_ARTICLES;
  return (
    <section
      id="magazine-section"
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-12 overflow-hidden"
    >
      <SectionHeading title="مجله های لوستر" mobileTitle="مجله لوستر" className="mb-8 sm:mb-10" />

      {/* در موبایل کاروسل افقی با پوزیشن سوایپ روان و در دسکتاپ شبکه ۴ ستونه */}
      <div
        className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pr-4 pl-6 xs:pr-5 xs:pl-8 md:px-0 py-2 md:py-0 touch-pan-x [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayArticles.map((article) => (
          <article
            key={article.id}
            className="group shrink-0 snap-start w-[83vw] max-w-[345px] md:w-auto md:max-w-none md:shrink bg-white rounded-[16px] border border-[#eeeeee] p-4 shadow-[0_6px_26px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_36px_rgba(181,151,102,0.12)] transition-all flex flex-col justify-between"
          >
            <div>
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
              <div className="mt-4 px-1 text-right">
                <h3
                  onClick={() => onSelectArticle(article)}
                  className="text-[14.5px] font-bold text-[#222222] hover:text-[#b59766] transition-colors cursor-pointer"
                >
                  {article.title}
                </h3>
                <p className="text-xs text-[#222222] leading-6 mt-2.5 text-justify line-clamp-4">
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

      {/* دکمه‌های صفحه‌بندی پایین مجله (فقط در دسکتاپ) */}
      <div className="hidden md:flex mt-8 items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => displayArticles[0] && onSelectArticle(displayArticles[0])}
          aria-label="قبلی"
          className="w-10 h-10 rounded-[8px] bg-white hover:bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            (displayArticles[2] || displayArticles[0]) &&
            onSelectArticle(displayArticles[2] || displayArticles[0])
          }
          className="h-10 px-7 rounded-[8px] bg-white hover:bg-[#b59766] text-[#b59766] hover:text-white border border-[#c9b28b] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          مشاهده تمامی مقالات
        </button>

        <button
          type="button"
          onClick={() =>
            (displayArticles[3] || displayArticles[0]) &&
            onSelectArticle(displayArticles[3] || displayArticles[0])
          }
          aria-label="بعدی"
          className="w-10 h-10 rounded-[8px] bg-white hover:bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
