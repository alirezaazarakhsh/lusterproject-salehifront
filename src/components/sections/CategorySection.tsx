import React from 'react';
import {
  SectionHeading,
  CategoryStarSeal,
  CenteredVintageOrnament29,
} from '../Ornaments';
import { PRODUCT_CATEGORIES } from '../../data/chandelierData';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (filterKey: string) => void;
}

/**
 * بخش «دسته بندی محصولات» دقیقاً مطابق طرح فیگما (Screenshot 2026-09-29 at 06.11.01.png):
 * - پترن‌های سمت راست و چپ کاملاً چسبیده به لبه‌های صفحه (right-0 و left-0 بدون فاصله از بغل‌ها)
 * - نمایش ۱۰۰٪ کامل پترن از بالا تا پایین بدون بریده شدن و با ابعاد دقیق طرح فیگما
 */
export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="relative w-full pt-10 pb-24">
      {/* تیتر بخش دسته بندی محصولات */}
      <SectionHeading
        title="دسته بندی محصولات"
        className="mb-12 relative z-10 px-4"
      />

      {/* ردیف کارت‌ها به همراه پترن‌های اسلیمی چسبیده به لبه راست و چپ صفحه */}
      <div className="relative w-full py-10">
        {/* پترن سمت راست: کاملاً چسبیده به لبه راست صفحه (right-0) و بدون بریدگی */}
        <CenteredVintageOrnament29
          direction="rtl"
          color="#ebe5dc"
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[215px] lg:w-[245px] h-[225px] lg:h-[255px] z-0"
        />

        {/* پترن سمت چپ: کاملاً چسبیده به لبه چپ صفحه (left-0) و بدون بریدگی */}
        <CenteredVintageOrnament29
          direction="ltr"
          color="#ebe5dc"
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[215px] lg:w-[245px] h-[225px] lg:h-[255px] z-0"
        />

        {/* شبکه ۴ ستونه کارت‌ها با فاصله کناری دقیق تا سرنیزه و ۲ نقطه پترن بیرون کادر کارت قرار بگیرد */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-10 md:px-14 lg:px-[62px] xl:px-[68px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {PRODUCT_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.filterKey;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  onSelectCategory(category.filterKey);
                  const el = document.getElementById('collection-salehi');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group flex items-center justify-start gap-4 px-6 py-6 rounded-[22px] bg-white/82 backdrop-blur-[1px] border transition-all duration-300 cursor-pointer text-right ${
                  isActive
                    ? 'border-[#b08c57] shadow-[0_10px_30px_rgba(176,140,87,0.1)]'
                    : 'border-[#ededed] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#d5c5a8]'
                }`}
              >
                {/* آیکون تیک کنگره‌دار طلایی (verify.png) */}
                <CategoryStarSeal
                  size={46}
                  className="group-hover:scale-105 transition-transform duration-300"
                />

                {/* عنوان دسته‌بندی و تعداد محصول */}
                <div className="text-right">
                  <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1e1e1e] group-hover:text-[#b08c57] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-[13.5px] text-[#777777] font-normal mt-2">
                    {category.countText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
