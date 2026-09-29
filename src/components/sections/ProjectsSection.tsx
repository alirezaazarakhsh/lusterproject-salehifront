import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading, CategoryStarSeal } from '../Ornaments';
import {
  PROJECT_TABS,
  EXECUTED_PROJECTS,
  SALEHI_COLLECTION_PRODUCTS,
  ChandelierProduct,
} from '../../data/chandelierData';

interface ProjectsSectionProps {
  onOpenProductModal: (product: ChandelierProduct) => void;
}

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

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setIsPortraitOrSquare(ratio < 1.22);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f6f5f2] flex items-center justify-center">
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
        className={`relative z-10 w-full h-full transition-all duration-300 ${
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
 * - نوار تب‌های بالا (ارگان‌های دولتی، تجاری، مساجد، رستوران‌ها، منازل مسکونی) با خط طلایی زیر تب فعال دقیقاً مطابق تصویر دوم
 * - تغییر کامل لیست نمونه‌ها، عنوان، توضیحات، لوسترهای استفاده‌شده و تصاویر محیطی گالری با تغییر هر تب یا هر نمونه (نمونه ۱ تا ۴)
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onOpenProductModal,
}) => {
  const [activeTab, setActiveTab] = useState<string>('gov');
  const [selectedSampleIdx, setSelectedSampleIdx] = useState<number>(2); // پیش‌فرض نمونه ۳
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);

  // فیلتر ۴ پروژه مربوط به تب (استپ) انتخاب‌شده
  const tabProjects = EXECUTED_PROJECTS.filter(
    (p) => p.categoryTab === activeTab
  );

  const currentProject =
    tabProjects[selectedSampleIdx] || tabProjects[0] || EXECUTED_PROJECTS[0];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedSampleIdx(0);
    setActiveGalleryIdx(0);
  };

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIdx(idx);
    setActiveGalleryIdx(0);
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
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-12"
    >
      <SectionHeading title="پروژه های اجرایی" className="mb-8" />

      {/* نوار تب‌های بالای پروژه‌ها دقیقاً مطابق تصویر دوم با خط طلایی زیر تب انتخاب‌شده */}
      <div className="relative flex flex-wrap items-end justify-between gap-4 border-b border-[#eaeaea] mb-8">
        {/* تب‌های دسته‌بندی پروژه در سمت راست */}
        <div className="flex items-center gap-7 sm:gap-11 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {PROJECT_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`relative pt-2 pb-4 px-1 text-[13.5px] sm:text-[15px] transition-colors cursor-pointer whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'font-extrabold text-[#161616]'
                    : 'font-medium text-[#9e9e9e] hover:text-[#222222]'
                }`}
              >
                <span>{tab.label}</span>
                {/* خط رنگی طلایی زیر استپ/تب انتخاب‌شده دقیقاً مطابق تصویر دوم */}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[3.5px] bg-[#b08c57] rounded-full z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* دکمه مشاهده پروژه ها در سمت چپ */}
        <div className="pb-3">
          <button
            type="button"
            onClick={() => {
              const nextSample = (selectedSampleIdx + 1) % tabProjects.length;
              handleSelectSample(nextSample);
            }}
            className="h-11 px-6 rounded-[14px] bg-[#f4f4f4] hover:bg-[#272727] text-[#222222] hover:text-white text-xs sm:text-[13px] font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            مشاهده پروژه ها
          </button>
        </div>
      </div>

      {/* چیدمان ۳ ستونه محتوای پروژه اجرایی */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* ستون اول (سمت راست - ۲ ستون): کارت‌های نمونه ۱ تا ۴ */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3.5">
          {tabProjects.map((proj, idx) => {
            const isSelected = idx === selectedSampleIdx;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => handleSelectSample(idx)}
                className={`relative overflow-hidden rounded-[18px] py-4 px-4 text-right border transition-all cursor-pointer ${
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

        {/* ستون دوم (وسط - ۵ ستون): عنوان، توضیحات اختصاصی پروژه و لوسترهای استفاده شده */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 px-1">
          <div>
            <h3 className="text-[16.5px] font-extrabold text-[#222222] mb-2.5">
              {currentProject.title}
            </h3>
            <p className="text-xs sm:text-[13px] leading-7 text-[#555555] text-justify mb-5">
              {currentProject.description}
            </p>

            <h4 className="text-[14px] font-bold text-[#222222] mb-2">
              لوستر های استفاده شده :
            </h4>
            <p className="text-xs sm:text-[13px] leading-7 text-[#555555] text-justify mb-5">
              {currentProject.usedChandeliersText}
            </p>

            {/* لیست ۲ محصول استفاده شده در پروژه */}
            <div className="space-y-3 pt-1">
              {currentProject.usedProducts.map((up) => {
                const linkedProduct =
                  SALEHI_COLLECTION_PRODUCTS.find(
                    (p) => p.id === up.productId
                  ) || SALEHI_COLLECTION_PRODUCTS[2];

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
                const firstUsedProductId =
                  currentProject.usedProducts[0]?.productId;
                const targetProduct =
                  SALEHI_COLLECTION_PRODUCTS.find(
                    (p) => p.id === firstUsedProductId
                  ) || SALEHI_COLLECTION_PRODUCTS[0];
                onOpenProductModal(targetProduct);
              }}
              className="h-10 px-6 rounded-xl bg-white hover:bg-[#b59766] text-[#b59766] hover:text-white border border-[#c9b28b] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              اطلاعات بیشتر
            </button>
          </div>
        </div>

        {/* ستون سوم (سمت چپ - ۵ ستون): گالری تصاویر پروژه به همراه ۴ تصویر کوچک زیرین */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* تصویر بزرگ اصلی پروژه */}
          <div className="relative rounded-[22px] overflow-hidden h-64 sm:h-72 bg-[#f6f5f2] shadow-xs">
            <AdaptiveGalleryImage
              key={`${currentProject.id}-${activeGalleryIdx}`}
              src={
                currentProject.galleryImages[activeGalleryIdx] ||
                currentProject.mainImage
              }
              alt={currentProject.title}
            />

            {/* دکمه فلش راست داخل عکس */}
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="تصویر بعدی"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-[#222222] flex items-center justify-center shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* دکمه فلش چپ داخل عکس */}
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="تصویر قبلی"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-white/65 hover:bg-white text-[#222222] flex items-center justify-center shadow-md cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ۴ تصویر بندانگشتی (Thumbnail) زیر عکس اصلی */}
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
                  {/* خط طلایی بالای تصویر کوچک فعال */}
                  {isThumbActive && (
                    <span className="absolute top-0 inset-x-1 h-[2.5px] bg-[#b59766] rounded-full" />
                  )}
                  <div
                    className={`h-16 sm:h-20 rounded-[14px] overflow-hidden border transition-all ${
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
        </div>
      </div>
    </section>
  );
};
