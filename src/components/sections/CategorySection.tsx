import React, { useState, useRef } from 'react';
import {
  SectionHeading,
  CategoryStarSeal,
  CenteredVintageOrnament29,
} from '../Ornaments';
import {
  PRODUCT_CATEGORIES,
  CategoryItem,
  ChandelierProduct,
} from '../../data/chandelierData';
import { navigateToProductCategory } from '../../utils/navigation';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (filterKey: string) => void;
  categories?: CategoryItem[];
  products?: ChandelierProduct[];
}

/**
 * بخش «دسته بندی محصولات»
 * - در موبایل: اسلایدر/کاروسل افقی لایه‌ای (Peek Carousel) با آیکون وریفای سمت راست و متن سمت چپ + ۵ نقطه پیجینیشن + پترن‌های ظریف و کوچک‌تر اسلیمی در طرفین (دقیقاً مطابق طرح فیگما در Screenshot 2026-09-30 at 03.04.59.png)
 * - در دسکتاپ: شبکه ۴ ستونه لوکس به همراه پترن‌های لبه صفحه
 */
export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
  products = [],
}) => {
  const getProductCountText = (catSlug: string) => {
    const isMatchingCategory = (pCatRaw: string, targetSlug: string): boolean => {
      const pCat = String(pCatRaw || '').trim().toLowerCase();
      const target = String(targetSlug || '').trim().toLowerCase();
      if (!pCat || !target) return false;
      if (pCat === target) return true;

      if (target === 'chandeliers' || target === 'all') {
        return pCat === 'chandeliers' || pCat === 'all' || pCat.includes('لوستر');
      }
      if (target === 'single-branch') {
        return pCat === 'single-branch' || pCat === 'single' || pCat.includes('تک') || pCat.includes('شاخه');
      }
      if (target === 'mirror-console') {
        return pCat === 'mirror-console' || pCat === 'mirror' || pCat === 'mirrors' || pCat.includes('آینه') || pCat.includes('کنسول');
      }
      if (target === 'abalour') {
        return pCat === 'abalour' || pCat === 'lampshade' || pCat === 'abajour' || pCat.includes('آباژور');
      }
      if (target === 'shamdooni') {
        return pCat === 'shamdooni' || pCat === 'shamdan' || pCat.includes('شمعدان');
      }
      if (target === 'table') {
        return pCat === 'table' || pCat.includes('میز');
      }
      if (target === 'kenar-saloni') {
        return pCat === 'kenar-saloni' || pCat.includes('کنار') || pCat.includes('سالن');
      }
      return false;
    };

    let count = 0;
    if (products && products.length > 0) {
      if (catSlug === 'all') {
        count = products.length;
      } else {
        const matching = products.filter((p) => {
          const pCat = p.categoryKey || (p as any).categorySlug || (p as any).category || '';
          return isMatchingCategory(pCat, catSlug);
        });
        count = matching.length;
      }
    } else {
      if (catSlug === 'chandeliers') count = 18;
      else if (catSlug === 'single-branch') count = 14;
      else if (catSlug === 'abalour') count = 12;
      else if (catSlug === 'mirror-console') count = 10;
      else if (catSlug === 'shamdooni') count = 9;
      else if (catSlug === 'table') count = 8;
      else if (catSlug === 'all') count = 71;
      else count = 12;
    }

    const persianCount = String(count).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
    return `${persianCount} محصول`;
  };

  const displayCategories =
    categories && categories.length > 0
      ? categories.slice(0, 4)
      : PRODUCT_CATEGORIES;
  const [activeCategoryDot, setActiveCategoryDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // همگام‌سازی دقیق سوایپ کاروسل دسته‌بندی با نقطه‌های ۵گانه با متد getBoundingClientRect
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

    if (closestIdx !== activeCategoryDot) {
      setActiveCategoryDot(closestIdx);
    }
  };

  const scrollToCategory = (index: number) => {
    setActiveCategoryDot(index);
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

  return (
    <section className="relative w-full pt-8 sm:pt-10 pb-12 sm:pb-24 overflow-hidden md:overflow-visible">
      {/* تیتر بخش دسته بندی محصولات */}
      <SectionHeading
        title="دسته بندی محصولات"
        className="mb-6 sm:mb-12 relative z-10 px-4"
      />

      {/* ==================== حالت موبایل (کاروسل افقی Peek Slider مطابق طرح فیگما) ==================== */}
      <div className="block md:hidden relative w-full py-2">
        {/* پترن اسلیمی سمت راست (کوچک‌تر، ظریف‌تر و چسبیده به لبه راست right-0) */}
        <CenteredVintageOrnament29
          direction="rtl"
          color="#ebdcc7"
          className="block absolute right-0 top-1/2 -translate-y-1/2 w-[110px] sm:w-[130px] h-[130px] sm:h-[150px] z-0 pointer-events-none opacity-65"
        />

        {/* پترن اسلیمی سمت چپ (کوچک‌تر، ظریف‌تر و چسبیده به لبه چپ left-0) */}
        <CenteredVintageOrnament29
          direction="ltr"
          color="#ebdcc7"
          className="block absolute left-0 top-1/2 -translate-y-1/2 w-[110px] sm:w-[130px] h-[130px] sm:h-[150px] z-0 pointer-events-none opacity-65"
        />

        {/* کاروسل کارت‌های دسته‌بندی با قابلیت سوایپ */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative z-10 flex gap-3 overflow-x-auto snap-x snap-mandatory px-[8vw] py-2.5 touch-pan-x [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayCategories.map((category, idx) => {
            const catFilterKey = category.filterKey || (category as any).key || 'all';
            const catSlug = category.slug || (category as any).key || 'chandeliers';
            const isActive = selectedCategory === catFilterKey;
            const isDotActive = activeCategoryDot === idx;

            return (
              <a
                key={category.id}
                href={`/product/categories/${catSlug}`}
                onClick={(e) => {
                  onSelectCategory(catFilterKey);
                  scrollToCategory(idx);
                  navigateToProductCategory(catSlug, e);
                }}
                className={`group shrink-0 snap-center w-[78vw] max-w-[340px] flex items-center justify-between gap-4 px-5 py-5 rounded-[22px] bg-white border transition-all duration-300 cursor-pointer text-right shadow-[0_6px_25px_rgba(0,0,0,0.03)] ${
                  isActive || isDotActive
                    ? 'border-[#b08c57] ring-1 ring-[#b08c57]/20 shadow-[0_8px_30px_rgba(176,140,87,0.1)]'
                    : 'border-[#e8e8e8] hover:border-[#d5c5a8]'
                }`}
              >
                {/* ۱. آیکون تیک وریفای طلایی (CategoryStarSeal) در سمت راست کارت در چیدمان RTL */}
                <CategoryStarSeal
                  size={44}
                  className="shrink-0 group-hover:scale-105 transition-transform duration-300"
                />

                {/* ۲. عنوان دسته‌بندی در سمت چپ آیکون وریفای */}
                <div className="text-right flex-1 min-w-0">
                  <h3 className="text-[16px] xs:text-[17px] font-black text-[#1e1e1e] group-hover:text-[#b08c57] transition-colors leading-snug">
                    {category.title}
                  </h3>
                  <p className="text-[12px] text-[#7a7a7a] mt-1 font-bold">
                    {getProductCountText(catSlug)}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* نقطه‌های پیجینیشن ۵گانه مدرن پایین کاروسل دسته‌بندی (دقیقاً مطابق Screenshot 2026-09-30 at 03.12.16.png) */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-5">
          {[0, 1, 2, 3, 4].map((dotIdx) => {
            const len = Math.max(1, displayCategories.length);
            const activeIndex = activeCategoryDot % len;
            const dist = Math.abs(dotIdx - activeIndex);

            return (
              <button
                key={`cat-dot-${dotIdx}`}
                type="button"
                onClick={() => scrollToCategory(dotIdx % len)}
                aria-label={`اسلاید ${dotIdx + 1}`}
                className={`rounded-full transition-all cursor-pointer ${
                  dist === 0
                    ? 'w-3.5 h-3.5 bg-[#222222] shadow-2xs'
                    : dist === 1
                    ? 'w-2.5 h-2.5 bg-[#dcdcdc] hover:bg-[#b08c57]'
                    : 'w-1.5 h-1.5 bg-[#eaeaea] hover:bg-[#b08c57]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ==================== حالت دسکتاپ (شبکه ۴ ستونه) ==================== */}
      <div className="hidden md:block relative w-full py-10">
        {/* پترن سمت راست دسکتاپ */}
        <CenteredVintageOrnament29
          direction="rtl"
          color="#ebe5dc"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[215px] lg:w-[245px] h-[225px] lg:h-[255px] z-0 pointer-events-none"
        />

        {/* پترن سمت چپ دسکتاپ */}
        <CenteredVintageOrnament29
          direction="ltr"
          color="#ebe5dc"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[215px] lg:w-[245px] h-[225px] lg:h-[255px] z-0 pointer-events-none"
        />

        {/* شبکه ۴ ستونه کارت‌ها */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-10 md:px-14 lg:px-[62px] xl:px-[68px] grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {displayCategories.map((category) => {
            const catFilterKey = category.filterKey || (category as any).key || 'all';
            const catSlug = category.slug || (category as any).key || 'chandeliers';
            const isActive = selectedCategory === catFilterKey;
            return (
              <a
                key={category.id}
                href={`/product/categories/${catSlug}`}
                onClick={(e) => {
                  onSelectCategory(catFilterKey);
                  navigateToProductCategory(catSlug, e);
                }}
                className={`group flex items-center justify-between gap-4 px-6 py-6 rounded-[22px] bg-white/90 backdrop-blur-[2px] border transition-all duration-300 cursor-pointer text-right ${
                  isActive
                    ? 'border-[#b08c57] shadow-[0_10px_30px_rgba(176,140,87,0.12)] bg-white'
                    : 'border-[#ededed] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#d5c5a8]'
                }`}
              >
                {/* آیکون تیک وریفای طلایی در سمت راست در دسکتاپ */}
                <CategoryStarSeal
                  size={42}
                  className="shrink-0 group-hover:scale-105 transition-transform duration-300"
                />

                {/* عنوان دسته‌بندی */}
                <div className="text-right flex-1 min-w-0">
                  <h3 className="text-[17px] font-bold text-[#1e1e1e] group-hover:text-[#b08c57] transition-colors leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-[12.5px] text-[#7a7a7a] mt-1.5 font-bold">
                    {getProductCountText(catSlug)}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
