import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../Ornaments';
import { MAGAZINE_ARTICLES, MagazineArticle } from '../../data/chandelierData';

interface MagazineSectionProps {
  onSelectArticle: (article: MagazineArticle) => void;
}

/**
 * بخش «مجله های لوستر» (دقیقاً مطابق نیمه بالایی عکس چهارم)
 */
export const MagazineSection: React.FC<MagazineSectionProps> = ({
  onSelectArticle,
}) => {
  return (
    <section
      id="magazine-section"
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-12"
    >
      <SectionHeading title="مجله های لوستر" className="mb-10" />

      {/* شبکه ۴ ستونه کارت‌های مقاله */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MAGAZINE_ARTICLES.map((article) => (
          <article
            key={article.id}
            className="group bg-white rounded-[24px] border border-[#eeeeee] p-4 shadow-[0_6px_26px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_36px_rgba(181,151,102,0.12)] transition-all flex flex-col justify-between"
          >
            <div>
              {/* تصویر مقاله */}
              <div
                onClick={() => onSelectArticle(article)}
                className="rounded-[18px] h-48 sm:h-52 overflow-hidden bg-[#f2f2f2] cursor-pointer"
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
                <p className="text-xs text-[#666666] leading-6 mt-2.5 text-justify line-clamp-4">
                  {article.excerpt}
                </p>
              </div>
            </div>

            {/* ردیف پایین کارت: دکمه مطالعه بیشتر در راست و تاریخ ۲۵ شهریور ۱۴۰۴ در چپ */}
            <div className="mt-5 pt-2 px-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectArticle(article)}
                className={`h-9 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  article.isDarkButtonDefault
                    ? 'bg-[#272727] text-white hover:bg-[#3d3d3d]'
                    : 'bg-[#f2f2f2] text-[#222222] hover:bg-[#272727] hover:text-white'
                }`}
              >
                مطالعه بیشتر
              </button>

              <span className="text-xs text-[#666666] tabular-nums">
                {article.date}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* دکمه‌های صفحه‌بندی پایین مجله: [ < ] [ مشاهده مقالات ] [ > ] */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onSelectArticle(MAGAZINE_ARTICLES[0])}
          aria-label="قبلی"
          className="w-10 h-10 rounded-xl bg-white hover:bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onSelectArticle(MAGAZINE_ARTICLES[2])}
          className="h-10 px-7 rounded-xl bg-white hover:bg-[#b59766] text-[#b59766] hover:text-white border border-[#c9b28b] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          مشاهده مقالات
        </button>

        <button
          type="button"
          onClick={() => onSelectArticle(MAGAZINE_ARTICLES[3])}
          aria-label="بعدی"
          className="w-10 h-10 rounded-xl bg-white hover:bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
