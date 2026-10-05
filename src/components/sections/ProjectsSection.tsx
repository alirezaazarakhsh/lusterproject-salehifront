import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading, CategoryStarSeal } from '../Ornaments';
import { navigateToRoute, navigateToProjectSlug } from '../../utils/navigation';
import {
  PROJECT_TABS,
  EXECUTED_PROJECTS,
  SALEHI_COLLECTION_PRODUCTS,
  ChandelierProduct,
  ExecutedProject,
} from '../../data/chandelierData';
import { buildProjectsForTabAndPage } from '../../project/ProjectContentSection';

interface ProjectsSectionProps {
  projects?: ExecutedProject[];
  products?: ChandelierProduct[];
  onOpenProductModal: (product: ChandelierProduct) => void;
}

const SAMPLE_LABELS = ['نمونه ۱', 'نمونه ۲', 'نمونه ۳', 'نمونه ۴'];

/**
 * کامپوننت هوشمند نمایش تصویر گالری:
 * - برای عکس‌های محیطی عریض (پروژه‌های اجرایی): نمایش تمام‌کادر متوازن
 * - در صورتی که عکس محصول (مربعی یا عمودی) قرار داده شود: تنظیم خودکار روی حالت کامل (object-contain)
 *   تا ۱۰۰٪ لوستر از زنجیر بالا تا کریستال پایین بدون برش و بزرگ‌نمایی اضافی دیده شود.
 */
const AdaptiveGalleryImage: React.FC<{
  src: string;
  alt: string;
  isThumbnail?: boolean;
}> = ({ src, alt, isThumbnail = false }) => {
  const [isPortraitOrSquare, setIsPortraitOrSquare] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setIsPortraitOrSquare(ratio < 1.22);
    }
    setIsLoaded(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
      {isPortraitOrSquare && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-35 pointer-events-none"
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        className={`relative z-10 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          !isLoaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${
          isPortraitOrSquare
            ? isThumbnail
              ? 'object-contain p-1'
              : 'object-contain p-3'
            : 'object-cover object-center'
        }`}
      />
    </div>
  );
};

/**
 * بخش «پروژه های اجرایی»
 * - خواندن ۴ پروژه جدید هر تب مستقیماً از صفحه پروژه‌ها (/project)
 * - چرخش خودکار تصاویر گالری پروژه همراه با انیمیشن نرم Crossfade
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  products,
  onOpenProductModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential'
  >('gov');
  const [selectedSampleIdx, setSelectedSampleIdx] = useState<number>(0); // پیش‌فرض نمونه ۱
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const projectScrollRef = useRef<HTMLDivElement | null>(null);

  const liveProducts =
    products && products.length > 0 ? products : SALEHI_COLLECTION_PRODUCTS;

  // خواندن ۴ پروژه مربوط به تب انتخاب‌شده مستقیماً از دیتابیس PostgreSQL (مرتب‌شده از جدیدترین به قدیمی‌ترین)
  const dbTabProjects = (projects || [])
    .filter((p) => p.categoryTab === activeTab)
    .sort((a, b) => {
      const numA = Number(String(a.id).replace(/\D/g, '')) || 0;
      const numB = Number(String(b.id).replace(/\D/g, '')) || 0;
      return numB - numA;
    })
    .slice(0, 4);
  const fallbackTabProjects = EXECUTED_PROJECTS.filter(
    (p) => p.categoryTab === activeTab
  ).slice(0, 4);
  const latestPageProjects = buildProjectsForTabAndPage(activeTab, 1).slice(0, 4);

  const tabProjects = (
    dbTabProjects.length > 0
      ? dbTabProjects.map((dbProj, idx) => ({
          ...dbProj,
          sampleCode: SAMPLE_LABELS[idx] || dbProj.sampleCode || `نمونه ${idx + 1}`,
          slug:
            (dbProj as any).slug ||
            dbProj.id.replace(/^proj-/, '') ||
            'kiani-shomali',
        }))
      : latestPageProjects.map((pageProj, idx) => {
          const fallbackProj =
            fallbackTabProjects[idx] ||
            fallbackTabProjects[0] ||
            EXECUTED_PROJECTS[0];
          const cleanDistrict = pageProj.title.replace(/^پروژه\s+/, '').trim();
          const galleryList =
            pageProj.galleryImages && pageProj.galleryImages.length >= 4
              ? pageProj.galleryImages.slice(0, 4)
              : fallbackProj.galleryImages;

          return {
            ...fallbackProj,
            id: pageProj.id,
            slug: pageProj.slug,
            sampleCode: SAMPLE_LABELS[idx] || `نمونه ${idx + 1}`,
            district: cleanDistrict || pageProj.location,
            categoryTab: activeTab,
            title: pageProj.title,
            mainImage: pageProj.image || galleryList[0] || fallbackProj.mainImage,
            galleryImages: galleryList,
          };
        })
  ).slice(0, 4);

  const currentProject =
    tabProjects[selectedSampleIdx] || tabProjects[0] || {
      ...EXECUTED_PROJECTS[0],
      slug: 'kiani-shomali',
    };

  // چرخش خودکار و نرم تصاویر گالری پروژه
  useEffect(() => {
    const totalSlides = currentProject.galleryImages.length;
    if (totalSlides <= 1) return;

    const timer = window.setInterval(() => {
      setActiveGalleryIdx((prev) => (prev + 1) % totalSlides);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [
    activeTab,
    selectedSampleIdx,
    activeGalleryIdx,
    currentProject.galleryImages.length,
  ]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(
      tabId as 'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential'
    );
    setSelectedSampleIdx(0);
    setActiveGalleryIdx(0);
    if (projectScrollRef.current) {
      projectScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSample = (idx: number) => {
    const validIdx = Math.min(tabProjects.length - 1, Math.max(0, idx));
    setSelectedSampleIdx(validIdx);
    setActiveGalleryIdx(0);
    if (projectScrollRef.current) {
      const card = projectScrollRef.current.children[validIdx] as HTMLElement;
      if (card) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  // همگام‌سازی سوایپ لمسی کاروسل نمونه‌های پروژه با نقطه‌چین‌های ۵گانه
  const handleProjectScroll = () => {
    if (!projectScrollRef.current) return;
    const container = projectScrollRef.current;
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

    if (closestIdx !== selectedSampleIdx) {
      setSelectedSampleIdx(closestIdx);
      setActiveGalleryIdx(0);
    }
  };

  const handleNextImage = () => {
    setActiveGalleryIdx(
      (prev) => (prev + 1) % currentProject.galleryImages.length
    );
  };

  const handlePrevImage = () => {
    setActiveGalleryIdx(
      (prev) =>
        (prev - 1 + currentProject.galleryImages.length) %
        currentProject.galleryImages.length
    );
  };

  return (
    <section
      id="executed-projects"
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-12"
    >
      <SectionHeading title="پروژه های اجرایی" mobileTitle="پروژه‌های اجرایی" className="mb-4 sm:mb-8" />

      {/* نوار تب‌های بالای پروژه‌ها (دقیقاً مطابق Screenshot 2026-09-30 at 04.05.36.png) */}
      <div className="relative border-b border-[#e5e5e5] mb-5 sm:mb-8 pb-0">
        <div
          className="flex items-center gap-6 sm:gap-10 overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:hidden px-1 w-full pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {PROJECT_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`relative pb-3 pt-1 transition-all cursor-pointer whitespace-nowrap focus:outline-none shrink-0 ${
                  isActive
                    ? 'font-bold text-[#1a1a1a] text-[14.5px] xs:text-[15.5px] sm:text-[16.5px]'
                    : 'font-medium text-[#888888] hover:text-[#222222] text-[13.5px] xs:text-[14.5px] sm:text-[15.5px]'
                }`}
              >
                <span>{tab.label}</span>
                {/* نشانگر طلایی با گوشه‌های بالای گرد چسبیده به خط مرزی پایینی (دقیقاً مطابق Screenshot 2026-09-30 at 04.05.36.png) */}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[6px] bg-[#c09d62] rounded-t-[7px] z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* دکمه مشاهده پروژه‌ها در سمت چپ هدر تب‌ها (فقط در دسکتاپ) */}
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 shrink-0">
          <button
            type="button"
            onClick={() => {
              navigateToRoute('project');
            }}
            className="h-9 px-4 rounded-[8px] bg-[#f4f4f4] hover:bg-[#272727] text-[#222222] hover:text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            مشاهده پروژه ها
          </button>
        </div>
      </div>

      {/* محتوای پروژه اجرایی: در موبایل کاروسل نمونه‌ها + نقطه‌چین ۵گانه قرار دارد */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ستون اول (سمت راست در دسکتاپ / کاروسل افقی با کارت‌های نمونه ۱ تا ۴ در موبایل) */}
        <div className="lg:col-span-2">
          {/* حالت موبایل: کاروسل افقی نمونه‌ها با گردی کمتر گوشه‌ها و سایز فونت بهینه‌شده */}
          <div
            ref={projectScrollRef}
            onScroll={handleProjectScroll}
            className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-3 pr-1 pl-6 py-1 touch-pan-x [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabProjects.map((proj, idx) => {
              const isSelected = idx === selectedSampleIdx;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectSample(idx)}
                  className={`relative shrink-0 snap-center w-[50vw] max-w-[200px] rounded-[8px] py-3.5 px-4 text-center border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#2b2b2b] text-white border-[#2b2b2b] shadow-xs'
                      : 'bg-white text-[#222222] border-[#e8e8e8] hover:border-[#b59766] shadow-2xs'
                  }`}
                >
                  <span className="block text-[14.5px] xs:text-[15px] font-bold">
                    {proj.sampleCode}
                  </span>
                  <span
                    className={`block text-[11.5px] xs:text-[12px] mt-1 truncate ${
                      isSelected ? 'text-white/80' : 'text-[#777777]'
                    }`}
                  >
                    {proj.district}
                  </span>
                </button>
              );
            })}
          </div>

          {/* نقطه‌های پیجینیشن ۵گانه پایین کاروسل نمونه‌ها در موبایل (با عملکرد کامل کلیک و هدایت اسکرول) */}
          <div className="flex lg:hidden items-center justify-center gap-2 mt-4 mb-2">
            {[0, 1, 2, 3, 4].map((dotIdx) => {
              const activeIndex = selectedSampleIdx % (tabProjects.length || 1);
              const dist = Math.abs(dotIdx - activeIndex);

              return (
                <button
                  key={`proj-dot-${dotIdx}`}
                  type="button"
                  onClick={() => handleSelectSample(dotIdx % tabProjects.length)}
                  aria-label={`نمونه ${dotIdx + 1}`}
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

          {/* حالت دسکتاپ: لیست عمودی ۴ نمونه */}
          <div className="hidden lg:grid grid-cols-1 gap-3.5">
            {tabProjects.map((proj, idx) => {
              const isSelected = idx === selectedSampleIdx;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectSample(idx)}
                  className={`relative overflow-hidden rounded-[8px] py-4 px-4 text-right border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#272727] text-white border-[#272727] shadow-md'
                      : 'bg-white text-[#222222] border-[#e8e8e8] hover:border-[#b59766]'
                  }`}
                >
                  {/* خط عمودی سفید داخل کارت فعال در سمت چپ */}
                  {isSelected && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-white rounded-full" />
                  )}
                  <span className="block text-[13.5px] font-bold">
                    {proj.sampleCode}
                  </span>
                  <span
                    className={`block text-xs mt-1.5 truncate ${
                      isSelected ? 'text-white/85' : 'text-[#888888]'
                    }`}
                  >
                    {proj.district}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ستون دوم (وسط - ۵ ستون): عنوان، توضیحات اختصاصی پروژه و لوسترهای استفاده شده (مخصوص دسکتاپ - در موبایل طبق درخواست حذف شد) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-5 px-1">
          <div>
            <h3 className="text-[16.5px] font-semibold text-[#222222] mb-2.5">
              {currentProject.title}
            </h3>
            <p className="text-xs sm:text-[13px] leading-7 text-[#222222] text-justify mb-5">
              {currentProject.description}
            </p>

            <h4 className="text-[14px] font-bold text-[#222222] mb-3">
              لوستر های استفاده شده :
            </h4>

            {/* لیست ۲ محصول استفاده شده در پروژه */}
            <div className="space-y-3 pt-1">
              {currentProject.usedProducts.map((up) => {
                const linkedProduct =
                  liveProducts.find((p) => p.id === up.productId) ||
                  liveProducts[2] ||
                  liveProducts[0];

                return (
                  <div
                    key={up.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-1 text-xs sm:text-[13px]"
                  >
                    <div className="flex items-center gap-2.5 font-semibold text-[#222222]">
                      <CategoryStarSeal size={24} />
                      <span>{up.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-bold text-[#222222] tabular-nums">
                        {up.price}
                      </span>
                      <span className="text-[#dddddd]">|</span>
                      <button
                        type="button"
                        onClick={() => onOpenProductModal(linkedProduct)}
                        className="text-[#b59766] hover:underline font-medium cursor-pointer whitespace-nowrap"
                      >
                        مشاهده محصول
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* دکمه اطلاعات بیشتر */}
          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={() => {
                if (currentProject.slug) {
                  navigateToProjectSlug(currentProject.slug);
                  return;
                }
                const firstUsedProductId =
                  currentProject.usedProducts[0]?.productId;
                const targetProduct =
                  liveProducts.find((p) => p.id === firstUsedProductId) ||
                  liveProducts[0];
                onOpenProductModal(targetProduct);
              }}
              className="h-10 px-6 rounded-[8px] bg-white hover:bg-[#b59766] text-[#b59766] hover:text-white border border-[#c9b28b] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              اطلاعات بیشتر
            </button>
          </div>
        </div>

        {/* ستون سوم (سمت چپ - ۵ ستون): گالری تصاویر پروژه به همراه ۴ تصویر کوچک زیرین (مخصوص دسکتاپ - در موبایل طبق درخواست حذف شد) */}
        <div className="hidden lg:block lg:col-span-5 space-y-3.5">
          {/* تصویر بزرگ اصلی پروژه با انیمیشن چرخش خودکار و انتقال نرم (Crossfade + Scale) */}
          <div className="relative rounded-[12px] overflow-hidden h-64 sm:h-72 bg-[#f6f5f2] shadow-xs">
            <div className="relative w-full h-full overflow-hidden bg-[#f6f5f2] flex items-center justify-center">
              {currentProject.galleryImages.map((imgUrl, idx) => {
                const isActiveSlide =
                  activeGalleryIdx % currentProject.galleryImages.length === idx;
                return (
                  <img
                    key={`${currentProject.id}-slide-${idx}`}
                    src={imgUrl}
                    alt={`${currentProject.title} - تصویر ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
                      isActiveSlide
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-[1.04] z-0 pointer-events-none'
                    }`}
                  />
                );
              })}
            </div>

            {/* دکمه‌های چپ و راست داخل عکس (فقط هنگامی که گالری بیشتر از ۱ تصویر داشته باشد) */}
            {currentProject.galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="تصویر بعدی"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-[#222222] flex items-center justify-center shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="تصویر قبلی"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-white/65 hover:bg-white text-[#222222] flex items-center justify-center shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* تصاویر بندانگشتی (Thumbnail) زیر عکس اصلی (فقط هنگامی که گالری بیشتر از ۱ تصویر داشته باشد) */}
          {currentProject.galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {currentProject.galleryImages.map((imgUrl, idx) => {
                const isThumbActive = activeGalleryIdx === idx;
                return (
                  <button
                    key={`${currentProject.id}-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveGalleryIdx(idx)}
                    className="relative pt-1.5 focus:outline-none cursor-pointer group"
                  >
                    {/* خط طلایی بالای تصویر کوچک فعال با انیمیشن نرم */}
                    <span
                      className={`absolute top-0 inset-x-1 h-[2.5px] bg-[#b59766] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isThumbActive
                          ? 'opacity-100 scale-x-100'
                          : 'opacity-0 scale-x-50'
                      }`}
                    />
                    <div
                      className={`h-16 sm:h-20 rounded-[8px] overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isThumbActive
                          ? 'border-[#b59766] opacity-100'
                          : 'border-transparent opacity-80 group-hover:opacity-100'
                      }`}
                    >
                      <AdaptiveGalleryImage
                        src={imgUrl}
                        alt={`${currentProject.title} نمای ${idx + 1}`}
                        isThumbnail
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
