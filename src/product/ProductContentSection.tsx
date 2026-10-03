import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Box,
  RotateCcw,
} from 'lucide-react';
import { SectionHeading } from '../components/Ornaments';
import { AppToast } from '../components/InteractiveModals';
import {
  ChandelierProduct,
  GENERATED_IMAGES,
} from '../data/chandelierData';
import {
  Chandelier3DViewer,
  FinishType,
  FINISH_PRESETS,
} from '../components/Chandelier3DViewer';
import { TransparentProductImage } from '../components/TransparentProductImage';
import {
  getProductCategorySlugFromLocation,
  navigateToProductCategory,
} from '../utils/navigation';

export type ProductCategorySlug =
  | 'all'
  | 'chandeliers'
  | 'single-branch'
  | 'kenar-saloni'
  | 'abalour'
  | 'mirror-console'
  | 'shamdooni'
  | 'table';

export interface ProductCategoryTabItem {
  id: string;
  slug: ProductCategorySlug;
  title: string;
  totalCount: number;
  mobileTotalCount: number;
  iconType: 'four-star' | 'eight-star';
}

/**
 * ۸ آیتم نوار دسته‌بندی دایره‌ای بالای صفحه محصولات
 * دقیقاً مطابق تصویر فیگما از راست به چپ:
 * ۱. کل دسته بندی
 * ۲. کلکسیون لوستر
 * ۳. کلکسیون تک شاخه ها
 * ۴. کلکسیون کنار سالونی
 * ۵. کلکسیون آباژور
 * ۶. کلکسیون آینه و کنسول
 * ۷. کلکسیون شمعدونی
 * ۸. کلکسیون رو میز
 */
export const PRODUCT_CATEGORY_TABS: ProductCategoryTabItem[] = [
  {
    id: 'cat-all',
    slug: 'all',
    title: 'کل دسته بندی',
    totalCount: 71,
    mobileTotalCount: 71,
    iconType: 'four-star',
  },
  {
    id: 'cat-chandeliers',
    slug: 'chandeliers',
    title: 'کلکسیون لوستر',
    totalCount: 18,
    mobileTotalCount: 18,
    iconType: 'eight-star',
  },
  {
    id: 'cat-single-branch',
    slug: 'single-branch',
    title: 'کلکسیون تک شاخه ها',
    totalCount: 14,
    mobileTotalCount: 14,
    iconType: 'eight-star',
  },
  {
    id: 'cat-kenar-saloni',
    slug: 'kenar-saloni',
    title: 'کلکسیون کنار سالونی',
    totalCount: 0,
    mobileTotalCount: 0,
    iconType: 'eight-star',
  },
  {
    id: 'cat-abalour',
    slug: 'abalour',
    title: 'کلکسیون آباژور',
    totalCount: 12,
    mobileTotalCount: 12,
    iconType: 'eight-star',
  },
  {
    id: 'cat-mirror-console',
    slug: 'mirror-console',
    title: 'کلکسیون آینه و کنسول',
    totalCount: 10,
    mobileTotalCount: 10,
    iconType: 'eight-star',
  },
  {
    id: 'cat-shamdooni',
    slug: 'shamdooni',
    title: 'کلکسیون شمعدونی',
    totalCount: 9,
    mobileTotalCount: 9,
    iconType: 'eight-star',
  },
  {
    id: 'cat-table',
    slug: 'table',
    title: 'کلکسیون رو میز',
    totalCount: 8,
    mobileTotalCount: 8,
    iconType: 'eight-star',
  },
];

/**
 * تشخیص دسته‌بندی فعال بر اساس slug موجود در آدرس
 */
export const resolveProductCategoryBySlug = (
  rawSlug: string | null | undefined
): ProductCategoryTabItem => {
  if (!rawSlug) {
    return PRODUCT_CATEGORY_TABS[1];
  }
  const normalized = rawSlug.trim().toLowerCase();

  if (
    normalized === 'all' ||
    normalized === 'all-categories' ||
    normalized.includes('کل')
  ) {
    return PRODUCT_CATEGORY_TABS[0];
  }

  const directMatch = PRODUCT_CATEGORY_TABS.find(
    (item) => item.slug.toLowerCase() === normalized
  );
  if (directMatch) return directMatch;

  if (
    normalized.includes('single') ||
    normalized.includes('branch') ||
    normalized.includes('تک')
  ) {
    return PRODUCT_CATEGORY_TABS[2];
  }
  if (
    normalized.includes('kenar') ||
    normalized.includes('salon') ||
    normalized.includes('کنار') ||
    normalized.includes('سالن')
  ) {
    return PRODUCT_CATEGORY_TABS[3];
  }
  if (
    normalized.includes('abalour') ||
    normalized.includes('abajour') ||
    normalized.includes('lampshade') ||
    normalized.includes('آباژور') ||
    normalized.includes('اباژور')
  ) {
    return PRODUCT_CATEGORY_TABS[4];
  }
  if (
    normalized.includes('mirror') ||
    normalized.includes('console') ||
    normalized.includes('آینه') ||
    normalized.includes('اینه') ||
    normalized.includes('کنسول')
  ) {
    return PRODUCT_CATEGORY_TABS[5];
  }
  if (
    normalized.includes('shamdooni') ||
    normalized.includes('candelabra') ||
    normalized.includes('candlestick') ||
    normalized.includes('شمعد')
  ) {
    return PRODUCT_CATEGORY_TABS[6];
  }
  if (
    normalized.includes('table') ||
    normalized.includes('miz') ||
    normalized.includes('میز')
  ) {
    return PRODUCT_CATEGORY_TABS[7];
  }

  return PRODUCT_CATEGORY_TABS[1];
};

/**
 * آیکون ستاره ۴ پر طلایی برای «کل دسته بندی»
 */
const FourPointStarIcon: React.FC<{ className?: string }> = ({
  className = 'w-8 h-8',
}) => (
  <svg
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M27 11L30.2 23.8L43 27L30.2 30.2L27 43L23.8 30.2L11 27L23.8 23.8L27 11Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * آیکون ستاره ۸ پر دو رنگ دقیقاً مطابق فایل‌های Group 39353.png (حالت عادی) و Group 39357.png (حالت هاور/فعال):
 * - پره‌های قطری زیرین: طلایی/برنزی ثابت (#b58c56)
 * - ستاره ۴ پر اصلی رویی: در حالت عادی تیره (#2b2b2b) و در حالت هاور/فعال سفید (#ffffff)
 */
const EightPointStarburstIcon: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9',
}) => (
  <svg
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* ۴ پره قطری طلایی/برنزی در لایه زیرین */}
    <path
      d="M27 22.2L38.6 15.4L31.8 27L38.6 38.6L27 31.8L15.4 38.6L22.2 27L15.4 15.4L27 22.2Z"
      fill="#b58c56"
    />
    {/* ستاره ۴ پر اصلی در لایه رویی (تیره در حالت عادی، سفید در حالت هاور/انتخاب) */}
    <path
      d="M27 9.5L30.3 23.7L44.5 27L30.3 30.3L27 44.5L23.7 30.3L9.5 27L23.7 23.7L27 9.5Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * آیکون قیف فیلتر برای دکمه «فیلتر مرتب سازی» در موبایل دقیقاً مطابق تصویر موبایل
 */
const MobileFilterFunnelIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.4 2.1H18.6C19.7 2.1 20.6 3 20.6 4.1V6.3C20.6 7.1 20.1 8.1 19.6 8.6L15.3 12.4C14.7 12.9 14.3 13.9 14.3 14.7V19C14.3 19.6 13.9 20.4 13.4 20.7L12 21.6C10.7 22.4 8.9 21.5 8.9 19.9V14.6C8.9 13.9 8.5 13 8.1 12.5L4.3 8.5C3.8 8 3.4 7.1 3.4 6.5V4.2C3.4 3 4.3 2.1 5.4 2.1Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون سطل زباله قرمز برای دکمه «حذف فیلتر»
 */
const FilterTrashIcon: React.FC<{ className?: string }> = ({
  className = 'w-3.5 h-3.5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.33 16.5H13.66"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12.5H14.5"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون جستجو دقیقاً مطابق فایل search-status.png ارسالی
 */
const FilterSearchSparkleIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14 5H20"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 8H17"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 11C20 15.97 15.97 20 11 20C6.03 20 2 15.97 2 11C2 6.03 6.03 2 11 2"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.93 20.69C19.46 22.29 20.67 22.45 21.6 21.05C22.45 19.77 21.89 18.72 20.35 18.72C19.21 18.71 18.57 19.6 18.93 20.69Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * نشان آبی «Snapp! Pay» در گوشه بالا-چپ کارت محصول
 */
const SnappPayBadge: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => (
  <div
    dir="ltr"
    className={`absolute ${
      compact ? 'top-2 left-2.5' : 'top-3 left-3.5'
    } z-10 pointer-events-none select-none flex flex-col items-start leading-[1.02]`}
  >
    <span
      className={`${
        compact ? 'text-[10px]' : 'text-[12.5px]'
      } font-black tracking-[-0.02em] text-[#0082fd]`}
    >
      Snapp!
    </span>
    <span
      className={`${
        compact ? 'text-[9px]' : 'text-[11.5px]'
      } font-extrabold tracking-[-0.01em] text-[#0082fd]`}
    >
      Pay
    </span>
  </div>
);

/**
 * آیکون سبد خرید دقیقاً مطابق فایل Figma (دسته‌های باز در بالا)
 */
const ShoppingBasketIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 8.5L10 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 8.5L14 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="3"
      y="8.5"
      width="18"
      height="2.5"
      rx="1.25"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 11L5.8 19.3C5.95 20.3 6.8 21 7.8 21H16.2C17.2 21 18.05 20.3 18.2 19.3L19.5 11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="10"
      y1="14"
      x2="10"
      y2="18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="14"
      x2="14"
      y2="18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * آیکون کادر مربع با علامت مثبت در وسط (برای حالت افزوده شده به سبد خرید)
 */
const PlusSquareIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 8.5V15.5M8.5 12H15.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * آیکون کیف خرید با ضربدر (برای حالت ناموجود در انبار - مطابق طراحی Figma با دسته‌های باز)
 */
const OutOfStockBagIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 8.5L10 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 8.5L14 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="3"
      y="8.5"
      width="18"
      height="2.5"
      rx="1.25"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 11L5.8 19.3C5.95 20.3 6.8 21 7.8 21H16.2C17.2 21 18.05 20.3 18.2 19.3L19.5 11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 13.5L13.5 16.5M13.5 13.5L10.5 16.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * تصویر برداری حالت «موردی یافت نشد!» دقیقاً مطابق تصاویر دسکتاپ و موبایل
 * (Screenshot 2026-10-02 at 02.10.30.png و Screenshot 2026-10-02 at 02.10.57.png)
 */
const NoProductsFoundIllustration: React.FC<{ className?: string }> = ({
  className = 'w-[233px] h-auto',
}) => (
  <svg
    viewBox="0 0 233 195"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
    role="img"
    aria-label="موردی یافت نشد"
  >
    <defs>
      <linearGradient
        id="emptyCircleGrad"
        x1="40"
        y1="18"
        x2="180"
        y2="175"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#F3F3F3" />
        <stop offset="100%" stopColor="#EAEAEA" />
      </linearGradient>

      <radialGradient
        id="lensInnerShadow"
        cx="47%"
        cy="45%"
        r="53%"
        fx="47%"
        fy="45%"
      >
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="66%" stopColor="#FFFFFF" />
        <stop offset="86%" stopColor="#EAECEF" />
        <stop offset="100%" stopColor="#D5D9DF" />
      </radialGradient>

      <filter
        id="docCardShadow"
        x="42"
        y="12"
        width="130"
        height="162"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="-3"
          dy="6"
          stdDeviation="8"
          floodColor="#000000"
          floodOpacity="0.04"
        />
      </filter>

      <filter
        id="badgeCardShadow"
        x="142"
        y="2"
        width="90"
        height="68"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="2"
          dy="6"
          stdDeviation="8"
          floodColor="#8FA8BE"
          floodOpacity="0.18"
        />
      </filter>
    </defs>

    {/* ۱. دایره بزرگ خاکستری ملایم در پس‌زمینه */}
    <circle cx="109" cy="96" r="88" fill="url(#emptyCircleGrad)" />

    {/* ۲. خط منحنی گره‌دار تزئینی در بالا-چپ دقیقاً مطابق Illustration found.png */}
    <path
      d="M1 72C19 67 36 53 36 42C36 35 22 35 21 42C20 49 32 50 41 44C50 38 56 30 61 23"
      stroke="#192838"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* ۳. برگه/سند سفید مرکزی با ۵ خط افقی */}
    <g filter="url(#docCardShadow)">
      <rect x="63" y="25" width="91" height="122" rx="14" fill="#FFFFFF" />
      {/* خط قهوه‌ای/طلایی بالای سند */}
      <rect x="70" y="39" width="51" height="4.5" rx="2.25" fill="#A9855B" />
      {/* ۴ خط خاکستری متن داخل سند */}
      <rect x="70" y="65" width="76" height="4.5" rx="2.25" fill="#D5D5D5" />
      <rect x="70" y="88" width="76" height="4.5" rx="2.25" fill="#D5D5D5" />
      <rect x="70" y="111" width="76" height="4.5" rx="2.25" fill="#D5D5D5" />
      <rect x="70" y="134" width="32" height="4.5" rx="2.25" fill="#D5D5D5" />
    </g>

    {/* ۴. کارت کوچک شناور در بالا-راست */}
    <g filter="url(#badgeCardShadow)">
      <rect x="161" y="14" width="53" height="31" rx="6" fill="#FFFFFF" />
      <circle cx="172.5" cy="29.5" r="4.5" fill="#C9C5D8" />
      <rect x="183" y="25" width="24" height="9" rx="4.5" fill="#D4D4D4" />
    </g>

    {/* ۵. ستاره چهارپر طلایی در پایین-چپ و دایره طلایی در سمت راست */}
    <path
      d="M46 140C46.8 145.5 48.5 147.2 54 148C48.5 148.8 46.8 150.5 46 156C45.2 150.5 43.5 148.8 38 148C43.5 147.2 45.2 145.5 46 140Z"
      fill="#F1F1F1"
      stroke="#A67F50"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="208" cy="116" r="4.8" fill="#A67F50" />

    {/* ۶. ذره‌بین بزرگ با سایه داخلی و علامت ضربدر (×) در پایین-راست سند */}
    <g>
      {/* گردن و دسته ضخیم ذره‌بین */}
      <path
        d="M163 131L173 141"
        stroke="#262626"
        strokeWidth="7.5"
        strokeLinecap="round"
      />
      <path
        d="M171 139L199 167"
        stroke="#262626"
        strokeWidth="15"
        strokeLinecap="round"
      />

      {/* شیشه ذره‌بین با سایه ملایم داخلی */}
      <circle cx="134" cy="102" r="44" fill="url(#lensInnerShadow)" />

      {/* حلقه تیره دور ذره‌بین */}
      <circle
        cx="134"
        cy="102"
        r="44"
        stroke="#262626"
        strokeWidth="4.4"
      />

      {/* علامت ضربدر (×) وسط ذره‌بین */}
      <path
        d="M120 88L148 116M148 88L120 116"
        stroke="#262626"
        strokeWidth="9.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

/**
 * گزینه‌های فیلتر دقیقاً مطابق تصویر ارسالی
 */
const MODEL_FILTER_OPTIONS = [
  { id: 'model-azo', label: 'آزو' },
  { id: 'model-crystalite', label: 'کریستالیت' },
  { id: 'model-medusa', label: 'مدوسا' },
  { id: 'model-bicage', label: 'بی کیج' },
  { id: 'model-marquis', label: 'مارکیز ایتالیایی' },
  { id: 'model-renaissance', label: 'لوستر رسانس' },
  { id: 'model-shahmalakeh', label: 'لوستر شاه ملکه' },
  { id: 'model-ristani', label: 'لوستر ریستانی' },
  { id: 'model-classic', label: 'کلاسیک سلطنتی' },
  { id: 'model-12branch', label: '۱۲ شاخه تک' },
];

const MATERIAL_FILTER_OPTIONS = [
  { id: 'mat-steel', label: 'فولاد' },
  { id: 'mat-porcelain', label: 'پرسلان' },
  { id: 'mat-brass', label: 'برنج' },
  { id: 'mat-crystal', label: 'کریستال' },
  { id: 'mat-glass', label: 'گلس' },
];

const COLOR_FILTER_OPTIONS = [
  { id: 'col-white', label: 'سفید' },
  { id: 'col-rosegold', label: 'رز طلایی مدرن' },
  { id: 'col-gray', label: 'خاکستری' },
  { id: 'col-matteblack', label: 'مشکی مات' },
  { id: 'col-honey', label: 'عسلی روشنی' },
  { id: 'col-gold', label: 'طلایی سلطنتی' },
  { id: 'col-bronze', label: 'برنز آنتیک' },
  { id: 'col-silver', label: 'نقره‌ای سلطنتی' },
  { id: 'col-champagne', label: 'شامپاینی' },
];

interface ProductCardItem extends ChandelierProduct {
  hasSnappPay?: boolean;
  mobileOutOfStock?: boolean;
  cardFinishOverride?: FinishType;
}

/**
 * تولید محصولات متنوع برای هر دسته‌بندی:
 * - دسته‌بندی «کلکسیون کنار سالونی» (kenar-saloni) بدون محصول (خالی) است تا صفحه «موردی یافت نشد!» نمایش داده شود
 * - سایر دسته‌بندی‌ها هر کدام محصولات، تصاویر، قیمت‌ها و کدهای متفاوت خود را نمایش می‌دهند
 */
const buildCategoryPageProducts = (
  baseProducts: ChandelierProduct[],
  categorySlug: ProductCategorySlug,
  pageNumber: number
): ProductCardItem[] => {
  // در صورتی که کاتالوگ کامل محصولات از دیتابیس PostgreSQL بارگذاری شده باشد، مستقیماً محصولات همان دسته از دیتابیس نمایش داده می‌شوند
  if (baseProducts && baseProducts.length > 4) {
    const dbCategoryItems: ProductCardItem[] =
      categorySlug === 'all'
        ? baseProducts
        : baseProducts.filter((p) => p.categoryKey === categorySlug);

    if (dbCategoryItems.length === 0) {
      return [];
    }

    const shift = ((pageNumber - 1) * 2) % dbCategoryItems.length;
    return [
      ...dbCategoryItems.slice(shift),
      ...dbCategoryItems.slice(0, shift),
    ];
  }

  // دسته‌بندی بدون محصول برای نمایش صفحه «موردی یافت نشد!»
  if (categorySlug === 'kenar-saloni') {
    return [];
  }

  const crystalProd = baseProducts[0] || {
    id: 'prod-1',
    name: 'لوستر کریستالی',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۲,۵۰۰,۰۰۰ تومان',
    priceNumeric: 12500000,
    productCode: '۱۲۸۹۸۲',
    categoryKey: 'chandeliers',
    image: GENERATED_IMAGES.crystaliCherub,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    branchesCount: '۱۲ شاخه',
    dimensions: 'قطر ۷۵ × ارتفاع ۹۰ سانتی‌متر',
    bodyMaterial: 'برنز خالص و کریستال درجه یک',
    warranty: '۱۰ سال ضمانت کتبی آبکاری و اصالت',
    description: 'لوستر کریستالی اصل کلکسیون اکبر صالحی',
  };

  const renaissanceProd = baseProducts[1] || {
    ...crystalProd,
    id: 'prod-2',
    name: 'لوستر رسانس',
    image: GENERATED_IMAGES.resansRoses,
  };

  const twelveBranchProd = baseProducts[2] || {
    ...crystalProd,
    id: 'prod-3',
    name: 'لوستر ۱۲ شاخه تک',
    image: GENERATED_IMAGES.shakheh12,
    outOfStock: true,
  };

  const shahMalakehProd = baseProducts[3] || {
    ...crystalProd,
    id: 'prod-4',
    name: 'لوستر شاه ملکه',
    image: GENERATED_IMAGES.shahMalakeh,
  };

  const ristaniProd: ChandelierProduct = {
    ...crystalProd,
    id: 'prod-5',
    name: 'لوستر ریستانی آنتیک',
    image: GENERATED_IMAGES.ristani,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
  };

  const crystaliGoldProd: ChandelierProduct = {
    ...crystalProd,
    id: 'prod-6',
    name: 'لوستر رز طلا سلطنتی',
    image: GENERATED_IMAGES.crystaliGold,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
  };

  // ۱. کلکسیون لوستر (با قیمت‌های متنوع و متفاوت برای هر محصول)
  if (categorySlug === 'chandeliers') {
    const baseChandelierItems: ChandelierProduct[] = [
      {
        ...crystalProd,
        id: `${categorySlug}-p${pageNumber}-1`,
        name: 'لوستر کریستالی',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۲,۵۰۰,۰۰۰ تومان',
        priceNumeric: 12500000,
        productCode: '۱۲۸۹۸۱',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...renaissanceProd,
        id: `${categorySlug}-p${pageNumber}-2`,
        name: 'لوستر رسانس',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۴,۸۰۰,۰۰۰ تومان',
        priceNumeric: 14800000,
        productCode: '۱۲۸۹۸۲',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: false,
      },
      {
        ...twelveBranchProd,
        id: `${categorySlug}-p${pageNumber}-3`,
        name: 'لوستر ۱۲ شاخه تک',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۶,۲۰۰,۰۰۰ تومان',
        priceNumeric: 16200000,
        productCode: '۱۲۸۹۸۳',
        outOfStock: true,
        mobileOutOfStock: false,
        hasSnappPay: false,
      },
      {
        ...crystalProd,
        id: `${categorySlug}-p${pageNumber}-4`,
        name: 'لوستر کریستالی',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۱,۹۰۰,۰۰۰ تومان',
        priceNumeric: 11900000,
        productCode: '۱۲۸۹۸۴',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...twelveBranchProd,
        id: `${categorySlug}-p${pageNumber}-5`,
        name: 'لوستر ۱۲ شاخه تک',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۵,۴۰۰,۰۰۰ تومان',
        priceNumeric: 15400000,
        productCode: '۱۲۸۹۸۵',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...shahMalakehProd,
        id: `${categorySlug}-p${pageNumber}-6`,
        name: 'لوستر شاه ملکه',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۸,۵۰۰,۰۰۰ تومان',
        priceNumeric: 18500000,
        productCode: '۱۲۸۹۸۶',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...crystalProd,
        id: `${categorySlug}-p${pageNumber}-7`,
        name: 'لوستر کریستالی',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۳,۳۰۰,۰۰۰ تومان',
        priceNumeric: 13300000,
        productCode: '۱۲۸۹۸۷',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...shahMalakehProd,
        id: `${categorySlug}-p${pageNumber}-8`,
        name: 'لوستر شاه ملکه',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۹,۸۰۰,۰۰۰ تومان',
        priceNumeric: 19800000,
        productCode: '۱۲۸۹۸۸',
        outOfStock: false,
        mobileOutOfStock: true,
        hasSnappPay: false,
      },
      {
        ...twelveBranchProd,
        id: `${categorySlug}-p${pageNumber}-9`,
        name: 'لوستر ۱۲ شاخه تک',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۷,۱۰۰,۰۰۰ تومان',
        priceNumeric: 17100000,
        productCode: '۱۲۸۹۸۹',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: false,
      },
      {
        ...shahMalakehProd,
        id: `${categorySlug}-p${pageNumber}-10`,
        name: 'لوستر شاه ملکه',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۲۱,۴۰۰,۰۰۰ تومان',
        priceNumeric: 21400000,
        productCode: '۱۲۸۹۹۰',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: false,
      },
      {
        ...renaissanceProd,
        id: `${categorySlug}-p${pageNumber}-11`,
        name: 'لوستر رسانس',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۰,۸۰۰,۰۰۰ تومان',
        priceNumeric: 10800000,
        productCode: '۱۲۸۹۹۱',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: false,
      },
      {
        ...twelveBranchProd,
        id: `${categorySlug}-p${pageNumber}-12`,
        name: 'لوستر ۱۲ شاخه تک',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۲۲,۹۰۰,۰۰۰ تومان',
        priceNumeric: 22900000,
        productCode: '۱۲۸۹۹۲',
        outOfStock: true,
        mobileOutOfStock: true,
        hasSnappPay: false,
      },
      {
        ...ristaniProd,
        id: `${categorySlug}-p${pageNumber}-13`,
        name: 'لوستر ریستانی آنتیک ۱۰ شاخه',
        subtitle: 'مناسب کلاسیک پذیرایی | ناهارخوری',
        priceFormatted: '۱۴,۴۰۰,۰۰۰ تومان',
        priceNumeric: 14400000,
        productCode: '۱۲۸۹۹۳',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...crystaliGoldProd,
        id: `${categorySlug}-p${pageNumber}-14`,
        name: 'لوستر رز طلا سلطنتی ۱۶ شاخه',
        subtitle: 'مناسب تالار پذیرایی | سقف بلند',
        priceFormatted: '۲۰,۶۰۰,۰۰۰ تومان',
        priceNumeric: 20600000,
        productCode: '۱۲۸۹۹۴',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...shahMalakehProd,
        id: `${categorySlug}-p${pageNumber}-15`,
        name: 'لوستر طبقاتی شاه ملکه ۲۴ شاخه',
        subtitle: 'مناسب لابی | دوبلکس مجلل',
        priceFormatted: '۲۴,۵۰۰,۰۰۰ تومان',
        priceNumeric: 24500000,
        productCode: '۱۲۸۹۹۵',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...crystalProd,
        id: `${categorySlug}-p${pageNumber}-16`,
        name: 'لوستر کریستالی بوهمیا ۸ شاخه',
        subtitle: 'مناسب اتاق خواب مستر | نشیمن',
        priceFormatted: '۱۱,۳۰۰,۰۰۰ تومان',
        priceNumeric: 11300000,
        productCode: '۱۲۸۹۹۶',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: false,
      },
      {
        ...renaissanceProd,
        id: `${categorySlug}-p${pageNumber}-17`,
        name: 'لوستر رسانس دو طبقه سفید',
        subtitle: 'مناسب پذیرایی نئوکلاسیک | عروس',
        priceFormatted: '۱۵,۹۰۰,۰۰۰ تومان',
        priceNumeric: 15900000,
        productCode: '۱۲۸۹۹۷',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
      {
        ...twelveBranchProd,
        id: `${categorySlug}-p${pageNumber}-18`,
        name: 'لوستر ۱۲ شاخه برنز سیاه‌قلم',
        subtitle: 'مناسب چیدمان کلاسیک ایرانی',
        priceFormatted: '۱۷,۸۰۰,۰۰۰ تومان',
        priceNumeric: 17800000,
        productCode: '۱۲۸۹۹۸',
        outOfStock: false,
        mobileOutOfStock: false,
        hasSnappPay: true,
      },
    ];

    const shift = ((pageNumber - 1) * 2) % baseChandelierItems.length;
    return [
      ...baseChandelierItems.slice(shift),
      ...baseChandelierItems.slice(0, shift),
    ];
  }

  // کاتالوگ اختصاصی برای سایر دسته‌بندی‌ها با محصولات و تصاویر و قیمت‌های کاملاً متفاوت
  const categorySpecificCatalogs: Record<
    Exclude<ProductCategorySlug, 'chandeliers' | 'kenar-saloni'>,
    Array<{
      base: ChandelierProduct;
      name: string;
      subtitle: string;
      priceFormatted: string;
      priceNumeric: number;
      productCode: string;
      hasSnappPay?: boolean;
      outOfStock?: boolean;
      mobileOutOfStock?: boolean;
      cardFinishOverride?: FinishType;
    }>
  > = {
    all: [
      {
        base: shahMalakehProd,
        name: 'لوستر طبقاتی شاه ملکه ۱۸ شاخه',
        subtitle: 'مناسب تالار پذیرایی | سقف دوبلکس',
        priceFormatted: '۱۸,۹۰۰,۰۰۰ تومان',
        priceNumeric: 18900000,
        productCode: '۱۲۹۱۰۱',
        hasSnappPay: true,
      },
      {
        base: ristaniProd,
        name: 'آینه و کنسول بریالیژی برنزی',
        subtitle: 'ست کامل ورودی | سالن پذیرایی لوکس',
        priceFormatted: '۱۶,۴۰۰,۰۰۰ تومان',
        priceNumeric: 16400000,
        productCode: '۱۲۹۱۰۲',
        hasSnappPay: true,
      },
      {
        base: crystaliGoldProd,
        name: 'آباژور کریستالی ۷ میله ای ایتالیایی',
        subtitle: 'مناسب کنار مبلمان | اتاق خواب مستر',
        priceFormatted: '۸,۵۰۰,۰۰۰ تومان',
        priceNumeric: 8500000,
        productCode: '۱۲۹۱۰۳',
        hasSnappPay: false,
      },
      {
        base: crystalProd,
        name: 'لوستر کریستالی طرح فرشته',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۳,۸۰۰,۰۰۰ تومان',
        priceNumeric: 13800000,
        productCode: '۱۲۹۱۰۴',
        hasSnappPay: true,
      },
      {
        base: renaissanceProd,
        name: 'جفت شمعدان لاله عباسی گل‌دار',
        subtitle: 'مناسب روی کنسول | میز ناهارخوری',
        priceFormatted: '۶,۸۰۰,۰۰۰ تومان',
        priceNumeric: 6800000,
        productCode: '۱۲۹۱۰۵',
        outOfStock: true,
        mobileOutOfStock: true,
      },
      {
        base: twelveBranchProd,
        name: 'لوستر ۱۲ شاخه تک برنزی اصیل',
        subtitle: 'مناسب سالن پذیرایی | نشیمن کلاسیک',
        priceFormatted: '۱۲,۵۰۰,۰۰۰ تومان',
        priceNumeric: 12500000,
        productCode: '۱۲۹۱۰۶',
        hasSnappPay: true,
      },
      {
        base: crystaliGoldProd,
        name: 'لوستر رز طلا کلکسیون کلاسیک',
        subtitle: 'مناسب پذیرایی مدرن | نئوکلاسیک',
        priceFormatted: '۱۴,۲۰۰,۰۰۰ تومان',
        priceNumeric: 14200000,
        productCode: '۱۲۹۱۰۷',
        hasSnappPay: true,
      },
      {
        base: ristaniProd,
        name: 'میز خاطره برنزی سنگ مرمر',
        subtitle: 'مناسب دکوراسیون کلاسیک | نشیمن',
        priceFormatted: '۱۱,۲۰۰,۰۰۰ تومان',
        priceNumeric: 11200000,
        productCode: '۱۲۹۱۰۸',
        outOfStock: true,
        mobileOutOfStock: true,
        hasSnappPay: false,
      },
      {
        base: renaissanceProd,
        name: 'لوستر رسانس ۱۰ شاخه آنتیک',
        subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
        priceFormatted: '۱۱,۹۰۰,۰۰۰ تومان',
        priceNumeric: 11900000,
        productCode: '۱۲۹۱۰۹',
        hasSnappPay: true,
      },
      {
        base: shahMalakehProd,
        name: 'لوستر ماتاردان لاله زمردی',
        subtitle: 'مناسب فضاهای تشریفاتی | لابی',
        priceFormatted: '۱۶,۹۰۰,۰۰۰ تومان',
        priceNumeric: 16900000,
        productCode: '۱۲۹۱۱۰',
        hasSnappPay: false,
      },
      {
        base: crystalProd,
        name: 'دیوارکوب کریستالی ست فرشته',
        subtitle: 'مناسب راهرو | ستون‌های پذیرایی',
        priceFormatted: '۴,۹۰۰,۰۰۰ تومان',
        priceNumeric: 4900000,
        productCode: '۱۲۹۱۱۱',
        hasSnappPay: true,
      },
      {
        base: twelveBranchProd,
        name: 'لوستر نئوکلاسیک ۸ شاخه شیددار',
        subtitle: 'مناسب اتاق خواب | نشیمن مدرن',
        priceFormatted: '۱۰,۴۰۰,۰۰۰ تومان',
        priceNumeric: 10400000,
        productCode: '۱۲۹۱۱۲',
        outOfStock: true,
        mobileOutOfStock: true,
      },
    ],
    'single-branch': [
      {
        base: twelveBranchProd,
        name: 'آویز تک شاخه برنزی کلاسیک',
        subtitle: 'مناسب آشپزخانه | راهرو و ورودی',
        priceFormatted: '۳,۸۵۰,۰۰۰ تومان',
        priceNumeric: 3850000,
        productCode: '۱۱۴۲۰۱',
        hasSnappPay: true,
        outOfStock: false,
      },
      {
        base: crystaliGoldProd,
        name: 'لوستر تک شاخه کریستال شامپاینی',
        subtitle: 'مناسب بالای جزیره | اتاق خواب',
        priceFormatted: '۴,۴۰۰,۰۰۰ تومان',
        priceNumeric: 4400000,
        productCode: '۱۱۴۲۰۲',
        hasSnappPay: true,
      },
      {
        base: ristaniProd,
        name: 'آویز تک شاخه ریستانی آنتیک',
        subtitle: 'مناسب نشیمن | فضای ناهارخوری',
        priceFormatted: '۴,۱۰۰,۰۰۰ تومان',
        priceNumeric: 4100000,
        productCode: '۱۱۴۲۰۳',
        hasSnappPay: false,
      },
      {
        base: renaissanceProd,
        name: 'تک شاخه رسانس گل‌دار سرامیکی',
        subtitle: 'مناسب اتاق خواب | راهرو کلاسیک',
        priceFormatted: '۳,۶۰۰,۰۰۰ تومان',
        priceNumeric: 3600000,
        productCode: '۱۱۴۲۰۴',
        outOfStock: true,
        mobileOutOfStock: true,
      },
      {
        base: crystalProd,
        name: 'لوستر تک شاخه طرح فرشته طلایی',
        subtitle: 'مناسب دکوراسیون کلاسیک | ورودی',
        priceFormatted: '۴,۹۵۰,۰۰۰ تومان',
        priceNumeric: 4950000,
        productCode: '۱۱۴۲۰۵',
        hasSnappPay: true,
      },
      {
        base: shahMalakehProd,
        name: 'آویز تک شاخه شیددار سلطنتی',
        subtitle: 'مناسب اتاق خواب مستر | لابی',
        priceFormatted: '۵,۲۰۰,۰۰۰ تومان',
        priceNumeric: 5200000,
        productCode: '۱۱۴۲۰۶',
        hasSnappPay: false,
      },
      {
        base: crystaliGoldProd,
        name: 'تک شاخه لاله عباسی طلای ۲۴ عیار',
        subtitle: 'مناسب بالای میز بار | راهرو',
        priceFormatted: '۴,۷۰۰,۰۰۰ تومان',
        priceNumeric: 4700000,
        productCode: '۱۱۴۲۰۷',
        hasSnappPay: true,
        cardFinishOverride: 'gold-24k',
      },
      {
        base: twelveBranchProd,
        name: 'آویز تک شاخه ورسای نقره‌ای',
        subtitle: 'مناسب دکوراسیون نئوکلاسیک | مدرن',
        priceFormatted: '۴,۳۰۰,۰۰۰ تومان',
        priceNumeric: 4300000,
        productCode: '۱۱۴۲۰۸',
        outOfStock: true,
        mobileOutOfStock: true,
        hasSnappPay: true,
        cardFinishOverride: 'royal-silver',
      },
      {
        base: ristaniProd,
        name: 'لوستر تک شاخه مراکشی قلم‌زنی',
        subtitle: 'مناسب فضای سنتی | کافه و رستوران',
        priceFormatted: '۳,۹۰۰,۰۰۰ تومان',
        priceNumeric: 3900000,
        productCode: '۱۱۴۲۰۹',
        hasSnappPay: false,
        cardFinishOverride: 'antique-bronze',
      },
      {
        base: crystalProd,
        name: 'آویز تک شاخه امپریال منشوری',
        subtitle: 'مناسب اتاق خواب | نشیمن خصوصی',
        priceFormatted: '۴,۶۵۰,۰۰۰ تومان',
        priceNumeric: 4650000,
        productCode: '۱۱۴۲۱۰',
        hasSnappPay: true,
      },
      {
        base: renaissanceProd,
        name: 'تک شاخه رز سفید نئوکلاسیک',
        subtitle: 'مناسب اتاق کودک و نوجوان | خواب',
        priceFormatted: '۳,۷۵۰,۰۰۰ تومان',
        priceNumeric: 3750000,
        productCode: '۱۱۴۲۱۱',
        hasSnappPay: false,
      },
      {
        base: shahMalakehProd,
        name: 'لوستر تک شاخه شاهانه سیاه‌قلم',
        subtitle: 'مناسب ورودی مجلل | پاگرد پله',
        priceFormatted: '۵,۴۰۰,۰۰۰ تومان',
        priceNumeric: 5400000,
        productCode: '۱۱۴۲۱۲',
        outOfStock: true,
        mobileOutOfStock: true,
      },
      {
        base: crystaliGoldProd,
        name: 'آویز تک شاخه کریستالی طلایی',
        subtitle: 'مناسب بالای میز صبحانه‌خوری | راهرو',
        priceFormatted: '۴,۸۵۰,۰۰۰ تومان',
        priceNumeric: 4850000,
        productCode: '۱۱۴۲۱۳',
        hasSnappPay: true,
      },
      {
        base: ristaniProd,
        name: 'لوستر تک شاخه برنز قلم‌زنی دست‌ساز',
        subtitle: 'مناسب نشیمن سنتی | ورودی',
        priceFormatted: '۴,۲۵۰,۰۰۰ تومان',
        priceNumeric: 4250000,
        productCode: '۱۱۴۲۱۴',
        hasSnappPay: true,
      },
    ],
    abalour: [
      {
        base: crystaliGoldProd,
        name: 'آباژور کریستالی ۷ میله ای ایتالیایی',
        subtitle: 'مناسب کنار سالنی | اتاق خواب مستر',
        priceFormatted: '۸,۵۰۰,۰۰۰ تومان',
        priceNumeric: 8500000,
        productCode: '۱۳۵۱۰۱',
        hasSnappPay: true,
      },
      {
        base: shahMalakehProd,
        name: 'آباژور ایستاده شاه ملکه شید مشکی',
        subtitle: 'مناسب کنار مبلمان سلطنتی | پذیرایی',
        priceFormatted: '۹,۸۰۰,۰۰۰ تومان',
        priceNumeric: 9800000,
        productCode: '۱۳۵۱۰۲',
        hasSnappPay: true,
      },
      {
        base: crystalProd,
        name: 'آباژور رومیزی برنزی طرح فرشته',
        subtitle: 'مناسب روی پاتختی | میز کنسول',
        priceFormatted: '۵,۹۰۰,۰۰۰ تومان',
        priceNumeric: 5900000,
        productCode: '۱۳۵۱۰۳',
        hasSnappPay: false,
      },
      {
        base: renaissanceProd,
        name: 'آباژور دو شعله رسانس گل‌دار',
        subtitle: 'مناسب اتاق خواب عروس | نشیمن',
        priceFormatted: '۶,۴۰۰,۰۰۰ تومان',
        priceNumeric: 6400000,
        productCode: '۱۳۵۱۰۴',
        hasSnappPay: true,
      },
      {
        base: ristaniProd,
        name: 'آباژور کنار سالنی ریستانی آنتیک',
        subtitle: 'مناسب سالن پذیرایی | دفتر کار لوکس',
        priceFormatted: '۷,۷۰۰,۰۰۰ تومان',
        priceNumeric: 7700000,
        productCode: '۱۳۵۱۰۵',
        outOfStock: true,
        mobileOutOfStock: true,
      },
      {
        base: twelveBranchProd,
        name: 'آباژور کلاسیک ۳ شعله برنزی',
        subtitle: 'مناسب کنار مبلمان | سالن نشیمن',
        priceFormatted: '۷,۲۰۰,۰۰۰ تومان',
        priceNumeric: 7200000,
        productCode: '۱۳۵۱۰۶',
        hasSnappPay: true,
        outOfStock: false,
      },
      {
        base: shahMalakehProd,
        name: 'آباژور سلطنتی شید کرم دست‌دوز',
        subtitle: 'مناسب اتاق خواب کلاسیک | پذیرایی',
        priceFormatted: '۸,۹۰۰,۰۰۰ تومان',
        priceNumeric: 8900000,
        productCode: '۱۳۵۱۰۷',
        hasSnappPay: false,
        cardFinishOverride: 'gold-24k',
      },
      {
        base: crystaliGoldProd,
        name: 'آباژور رومیزی کریستال بوهمیا',
        subtitle: 'مناسب روی میز عسلی | پاتختی',
        priceFormatted: '۶,۱۰۰,۰۰۰ تومان',
        priceNumeric: 6100000,
        productCode: '۱۳۵۱۰۸',
        outOfStock: true,
        mobileOutOfStock: true,
        hasSnappPay: true,
        cardFinishOverride: 'royal-silver',
      },
      {
        base: crystalProd,
        name: 'آباژور پایه برنز قلم‌زنی تبریز',
        subtitle: 'مناسب چیدمان سنتی و کلاسیک',
        priceFormatted: '۷,۵۰۰,۰۰۰ تومان',
        priceNumeric: 7500000,
        productCode: '۱۳۵۱۰۹',
        hasSnappPay: true,
        cardFinishOverride: 'antique-bronze',
      },
      {
        base: renaissanceProd,
        name: 'آباژور نئوکلاسیک رز طلایی',
        subtitle: 'مناسب دکوراسیون مدرن | اتاق خواب',
        priceFormatted: '۶,۷۵۰,۰۰۰ تومان',
        priceNumeric: 6750000,
        productCode: '۱۳۵۱۱۰',
        hasSnappPay: false,
        cardFinishOverride: 'rose-gold',
      },
      {
        base: ristaniProd,
        name: 'آباژور ایستاده امپریال منشوری',
        subtitle: 'مناسب سالن پذیرایی | لابی هتل',
        priceFormatted: '۹,۳۰۰,۰۰۰ تومان',
        priceNumeric: 9300000,
        productCode: '۱۳۵۱۱۱',
        hasSnappPay: true,
      },
      {
        base: shahMalakehProd,
        name: 'آباژور تالاری ۴ شعله سیاه‌قلم',
        subtitle: 'مناسب فضاهای بزرگ | سالن تشریفات',
        priceFormatted: '۱۰,۶۰۰,۰۰۰ تومان',
        priceNumeric: 10600000,
        productCode: '۱۳۵۱۱۲',
        outOfStock: true,
        mobileOutOfStock: true,
      },
    ],
    'mirror-console': [
      {
        base: ristaniProd,
        name: 'آینه و کنسول بریالیژی تمام برنز',
        subtitle: 'سنگ مرمر طبیعی | مناسب ورودی و پذیرایی',
        priceFormatted: '۲۴,۸۰۰,۰۰۰ تومان',
        priceNumeric: 24800000,
        productCode: '۱۴۹۳۰۱',
        hasSnappPay: true,
      },
      {
        base: crystaliGoldProd,
        name: 'ست آینه و کنسول سلطنتی ورسای',
        subtitle: 'آبکاری طلای ۲۴ عیار | آینه تراش‌خورده',
        priceFormatted: '۲۸,۵۰۰,۰۰۰ تومان',
        priceNumeric: 28500000,
        productCode: '۱۴۹۳۰۲',
        hasSnappPay: true,
      },
      {
        base: crystalProd,
        name: 'آینه و کنسول طرح فرشته کلاسیک',
        subtitle: 'مناسب سالن پذیرایی | لابی مجلل',
        priceFormatted: '۲۱,۹۰۰,۰۰۰ تومان',
        priceNumeric: 21900000,
        productCode: '۱۴۹۳۰۳',
        outOfStock: true,
        mobileOutOfStock: true,
      },
      {
        base: renaissanceProd,
        name: 'کنسول و آینه رسانس گل‌دار سفید',
        subtitle: 'مناسب دکوراسیون نئوکلاسیک | عروس',
        priceFormatted: '۱۹,۴۰۰,۰۰۰ تومان',
        priceNumeric: 19400000,
        productCode: '۱۴۹۳۰۴',
        hasSnappPay: true,
      },
      {
        base: shahMalakehProd,
        name: 'آینه و کنسول تالاری شاه ملکه',
        subtitle: 'ابعاد بزرگ سفارشی | برنز سیاه‌قلم',
        priceFormatted: '۳۲,۰۰۰,۰۰۰ تومان',
        priceNumeric: 32000000,
        productCode: '۱۴۹۳۰۵',
        hasSnappPay: false,
      },
      {
        base: twelveBranchProd,
        name: 'آینه دیواری برنزی قاب اسلیمی',
        subtitle: 'مناسب بالای کنسول | راهرو ورودی',
        priceFormatted: '۱۱,۸۰۰,۰۰۰ تومان',
        priceNumeric: 11800000,
        productCode: '۱۴۹۳۰۶',
        hasSnappPay: true,
        outOfStock: false,
      },
      {
        base: ristaniProd,
        name: 'کنسول دو کشو برنز و مرمر سبز',
        subtitle: 'مناسب سالن پذیرایی | نشیمن کلاسیک',
        priceFormatted: '۲۳,۲۰۰,۰۰۰ تومان',
        priceNumeric: 23200000,
        productCode: '۱۴۹۳۰۷',
        hasSnappPay: true,
        cardFinishOverride: 'dark-patina',
      },
      {
        base: crystaliGoldProd,
        name: 'آینه قدی ایستاده کلکسیون صالحی',
        subtitle: 'مناسب اتاق خواب مستر | مزون لوکس',
        priceFormatted: '۱۶,۷۰۰,۰۰۰ تومان',
        priceNumeric: 16700000,
        productCode: '۱۴۹۳۰۸',
        outOfStock: true,
        mobileOutOfStock: true,
        hasSnappPay: false,
      },
      {
        base: crystalProd,
        name: 'ست آینه و جاشمعی دیواری طلایی',
        subtitle: 'مناسب ستون‌های سالن | ناهارخوری',
        priceFormatted: '۱۴,۵۰۰,۰۰۰ تومان',
        priceNumeric: 14500000,
        productCode: '۱۴۹۳۰۹',
        hasSnappPay: true,
      },
      {
        base: shahMalakehProd,
        name: 'کنسول سلطنتی ۴ درب منبت و برنز',
        subtitle: 'مناسب تالار پذیرایی | ویلا دوبلکس',
        priceFormatted: '۲۹,۹۰۰,۰۰۰ تومان',
        priceNumeric: 29900000,
        productCode: '۱۴۹۳۱۰',
        hasSnappPay: true,
      },
    ],
    shamdooni: [
      {
        base: renaissanceProd,
        name: 'جفت شمعدان لاله عباسی برنزی',
        subtitle: 'مناسب روی کنسول | سفره عقد و پذیرایی',
        priceFormatted: '۵,۶۰۰,۰۰۰ تومان',
        priceNumeric: 5600000,
        productCode: '۱۵۸۱۰۱',
        hasSnappPay: true,
      },
      {
        base: crystalProd,
        name: 'شمعدان ۵ شاخه طرح فرشته طلایی',
        subtitle: 'مناسب میز ناهارخوری | روی کنسول',
        priceFormatted: '۶,۹۰۰,۰۰۰ تومان',
        priceNumeric: 6900000,
        productCode: '۱۵۸۱۰۲',
        hasSnappPay: true,
      },
      {
        base: crystaliGoldProd,
        name: 'جفت شمعدان کریستال شامپاینی',
        subtitle: 'منشورهای اتریشی | آبکاری طلای ۲۴ عیار',
        priceFormatted: '۶,۲۰۰,۰۰۰ تومان',
        priceNumeric: 6200000,
        productCode: '۱۵۸۱۰۳',
        hasSnappPay: false,
      },
      {
        base: ristaniProd,
        name: 'شمعدان ۳ شاخه ریستانی آنتیک',
        subtitle: 'مناسب دکوراسیون کلاسیک | نشیمن',
        priceFormatted: '۴,۸۰۰,۰۰۰ تومان',
        priceNumeric: 4800000,
        productCode: '۱۵۸۱۰۴',
        hasSnappPay: true,
      },
      {
        base: shahMalakehProd,
        name: 'شمعدان تالاری ۷ شاخه شاه ملکه',
        subtitle: 'مناسب تالار و سالن تشریفات',
        priceFormatted: '۸,۴۰۰,۰۰۰ تومان',
        priceNumeric: 8400000,
        productCode: '۱۵۸۱۰۵',
        hasSnappPay: true,
      },
      {
        base: twelveBranchProd,
        name: 'جفت شمعدان پایه مرمر و برنز',
        subtitle: 'مناسب روی میز خاطره | کنسول',
        priceFormatted: '۵,۳۰۰,۰۰۰ تومان',
        priceNumeric: 5300000,
        productCode: '۱۵۸۱۰۶',
        outOfStock: true,
        mobileOutOfStock: true,
      },
      {
        base: crystalProd,
        name: 'شمعدان تک شاخه لاله تراش‌دار',
        subtitle: 'مناسب پاتختی | شومینه کلاسیک',
        priceFormatted: '۳,۹۰۰,۰۰۰ تومان',
        priceNumeric: 3900000,
        productCode: '۱۵۸۱۰۷',
        hasSnappPay: true,
        cardFinishOverride: 'gold-24k',
      },
      {
        base: renaissanceProd,
        name: 'جفت شمعدان گل‌دار سرامیکی سفید',
        subtitle: 'مناسب جهیزیه عروس | نئوکلاسیک',
        priceFormatted: '۵,۱۰۰,۰۰۰ تومان',
        priceNumeric: 5100000,
        productCode: '۱۵۸۱۰۸',
        hasSnappPay: false,
      },
      {
        base: ristaniProd,
        name: 'شمعدان برنزی سیاه‌قلم دست‌ساز',
        subtitle: 'مناسب چیدمان سنتی و اصیل ایرانی',
        priceFormatted: '۵,۷۵۰,۰۰۰ تومان',
        priceNumeric: 5750000,
        productCode: '۱۵۸۱۰۹',
        hasSnappPay: true,
        cardFinishOverride: 'dark-patina',
      },
    ],
    table: [
      {
        base: shahMalakehProd,
        name: 'میز جلو مبلی برنزی سلطنتی مرمر',
        subtitle: 'صفحه سنگ مرمر طبیعی | پایه برنز خالص',
        priceFormatted: '۱۴,۵۰۰,۰۰۰ تومان',
        priceNumeric: 14500000,
        productCode: '۱۶۷۲۰۱',
        hasSnappPay: true,
      },
      {
        base: ristaniProd,
        name: 'ست ۳ تکه میز عسلی برنزی کلاسیک',
        subtitle: 'مناسب مبلمان استیل و کلاسیک پذیرایی',
        priceFormatted: '۱۱,۲۰۰,۰۰۰ تومان',
        priceNumeric: 11200000,
        productCode: '۱۶۷۲۰۲',
        hasSnappPay: true,
      },
      {
        base: crystaliGoldProd,
        name: 'میز خاطره برنزی آبکاری طلا',
        subtitle: 'مناسب گوشه سالن | کنار مبلمان',
        priceFormatted: '۸,۹۰۰,۰۰۰ تومان',
        priceNumeric: 8900000,
        productCode: '۱۶۷۲۰۳',
        hasSnappPay: false,
      },
      {
        base: crystalProd,
        name: 'میز کنار سالنی طرح فرشته برنزی',
        subtitle: 'مناسب ورودی | دکوراسیون اشرافی',
        priceFormatted: '۱۰,۴۰۰,۰۰۰ تومان',
        priceNumeric: 10400000,
        productCode: '۱۶۷۲۰۴',
        hasSnappPay: true,
      },
      {
        base: renaissanceProd,
        name: 'میز تلفن کلاسیک برنز و چوب گردو',
        subtitle: 'مناسب نشیمن | راهرو و هال',
        priceFormatted: '۹,۳۰۰,۰۰۰ تومان',
        priceNumeric: 9300000,
        productCode: '۱۶۷۲۰۵',
        outOfStock: true,
        mobileOutOfStock: true,
      },
      {
        base: twelveBranchProd,
        name: 'میز دکوراتیو گرد سنگ اونیکس',
        subtitle: 'مناسب لابی | فضای بین دو مبل',
        priceFormatted: '۱۲,۸۰۰,۰۰۰ تومان',
        priceNumeric: 12800000,
        productCode: '۱۶۷۲۰۶',
        hasSnappPay: true,
        outOfStock: false,
      },
      {
        base: ristaniProd,
        name: 'میز عسلی تک پایه اسلیمی آنتیک',
        subtitle: 'ریخته‌گری سنگین | ضمانت ۱۰ ساله',
        priceFormatted: '۷,۶۰۰,۰۰۰ تومان',
        priceNumeric: 7600000,
        productCode: '۱۶۷۲۰۷',
        hasSnappPay: false,
        cardFinishOverride: 'antique-bronze',
      },
      {
        base: shahMalakehProd,
        name: 'میز جلو مبلی چهارگوش ورسای طلایی',
        subtitle: 'مناسب سالن پذیرایی بزرگ | تالار',
        priceFormatted: '۱۶,۲۰۰,۰۰۰ تومان',
        priceNumeric: 16200000,
        productCode: '۱۶۷۲۰۸',
        hasSnappPay: true,
        cardFinishOverride: 'gold-24k',
      },
    ],
  };

  const catalog = categorySpecificCatalogs[categorySlug] || categorySpecificCatalogs.all;
  const shift = ((pageNumber - 1) * 2) % catalog.length;
  const rotated = [...catalog.slice(shift), ...catalog.slice(0, shift)];

  return rotated.map((item, index) => ({
    ...item.base,
    id: `${categorySlug}-p${pageNumber}-${index + 1}`,
    name: item.name,
    subtitle: item.subtitle,
    priceFormatted: item.priceFormatted,
    priceNumeric: item.priceNumeric,
    productCode: item.productCode,
    outOfStock: Boolean(item.outOfStock),
    mobileOutOfStock: Boolean(item.mobileOutOfStock),
    hasSnappPay: Boolean(item.hasSnappPay),
    cardFinishOverride: item.cardFinishOverride,
  }));
};

/**
 * محاسبه دقیق تعداد محصولات هر دسته‌بندی مستقیماً از کاتالوگ محصولات همان دسته
 */
export const getCategoryProductCount = (
  categorySlug: string,
  baseProducts: ChandelierProduct[] = []
): number => {
  const resolvedTab = resolveProductCategoryBySlug(categorySlug);
  if (resolvedTab.slug === 'kenar-saloni') return 0;
  if (resolvedTab.slug === 'all') {
    const subSlugs: ProductCategorySlug[] = [
      'chandeliers',
      'single-branch',
      'abalour',
      'mirror-console',
      'shamdooni',
      'table',
    ];
    return subSlugs.reduce(
      (sum, s) => sum + buildCategoryPageProducts(baseProducts, s, 1).length,
      0
    );
  }
  return buildCategoryPageProducts(baseProducts, resolvedTab.slug, 1).length;
};

export const formatCategoryProductCount = (
  categorySlug: string,
  baseProducts: ChandelierProduct[] = []
): string => {
  const count = getCategoryProductCount(categorySlug, baseProducts);
  return `${count.toLocaleString('fa-IR')} محصول`;
};

interface ProductContentSectionProps {
  products: ChandelierProduct[];
  cartProductIds?: string[];
  cartQuantities?: Record<string, number>;
  onOpenProductModal: (
    product: ChandelierProduct,
    selectedFinish?: FinishType
  ) => void;
  onAddToCart: (product: ChandelierProduct) => void;
  onShowToast?: (
    type: AppToast['type'],
    title: string,
    message: string,
    onComplete?: () => void
  ) => void;
  onOpenLogin?: () => void;
  isLoggedIn?: boolean;
}

/**
 * صفحه دایرکتوری محصولات و دسته‌بندی‌ها (/product و /product/categories/:slug)
 * با طراحی دسکتاپ و موبایل دقیقاً مطابق تصاویر فیگما
 */
export const ProductContentSection: React.FC<ProductContentSectionProps> = ({
  products,
  cartProductIds = [],
  cartQuantities = {},
  onOpenProductModal,
  onAddToCart,
  isLoggedIn = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryTabItem>(
    () => resolveProductCategoryBySlug(getProductCategorySlugFromLocation())
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [openFilterGroups, setOpenFilterGroups] = useState<
    Record<string, boolean>
  >({
    model: true,
    material: true,
    color: true,
    price: true,
    other: true,
  });

  const [modelSearchQuery, setModelSearchQuery] = useState<string>('');
  const [colorSearchQuery, setColorSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const initialCategoryItems = buildCategoryPageProducts(
    products,
    activeCategory.slug,
    1
  );
  const initialPrices = initialCategoryItems.map((p) => p.priceNumeric);
  const initialMinPrice =
    initialPrices.length > 0 ? Math.min(...initialPrices) : 0;
  const initialMaxPrice =
    initialPrices.length > 0 ? Math.max(...initialPrices) : 0;

  const [minPriceValue, setMinPriceValue] = useState<number>(initialMinPrice);
  const [maxPriceValue, setMaxPriceValue] = useState<number>(initialMaxPrice);

  const [bestSellersOnly, setBestSellersOnly] = useState<boolean>(false);
  const [installmentOnly, setInstallmentOnly] = useState<boolean>(false);
  const [hideOutOfStock, setHideOutOfStock] = useState<boolean>(false);

  const [isFilterCalculating, setIsFilterCalculating] =
    useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const [active3DCards, setActive3DCards] = useState<Record<string, boolean>>(
    {}
  );
  const [cardFinishes] = useState<Record<string, FinishType>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});
  const [recentTooltipId, setRecentTooltipId] = useState<string | null>(null);

  const categoryStripRef = useRef<HTMLDivElement | null>(null);
  const [hasCategoryOverflow, setHasCategoryOverflow] = useState<boolean>(
    PRODUCT_CATEGORY_TABS.length > 8
  );
  const modelListRef = useRef<HTMLDivElement | null>(null);
  const colorListRef = useRef<HTMLDivElement | null>(null);
  const priceTrackRef = useRef<HTMLDivElement | null>(null);
  const [draggingPriceThumb, setDraggingPriceThumb] = useState<
    'min' | 'max' | null
  >(null);
  const [modelScrollRatio, setModelScrollRatio] = useState<number>(0);
  const [colorScrollRatio, setColorScrollRatio] = useState<number>(0);
  const tooltipTimeoutRef = useRef<Record<string, number>>({});
  const animTimeoutRef = useRef<Record<string, number>>({});
  const filterCalcTimeoutRef = useRef<number | null>(null);

  const triggerFilterCalculation = () => {
    setIsFilterCalculating(true);
    if (filterCalcTimeoutRef.current) {
      window.clearTimeout(filterCalcTimeoutRef.current);
    }
    filterCalcTimeoutRef.current = window.setTimeout(() => {
      setIsFilterCalculating(false);
    }, 420);
  };

  const syncPriceBoundsForCategory = (slug: ProductCategorySlug) => {
    const catProducts = buildCategoryPageProducts(products, slug, 1);
    if (catProducts.length === 0) {
      setMinPriceValue(0);
      setMaxPriceValue(0);
      return;
    }
    const prices = catProducts.map((p) => p.priceNumeric);
    setMinPriceValue(Math.min(...prices));
    setMaxPriceValue(Math.max(...prices));
  };

  useEffect(() => {
    const syncCategoryFromUrl = (e?: Event) => {
      const customSlug = (e as CustomEvent<string | null>)?.detail;
      const slug =
        customSlug !== undefined
          ? customSlug
          : getProductCategorySlugFromLocation();
      const resolved = resolveProductCategoryBySlug(slug);
      setActiveCategory(resolved);
      setCurrentPage(1);
      syncPriceBoundsForCategory(resolved.slug);
    };

    window.addEventListener('popstate', syncCategoryFromUrl);
    window.addEventListener('hashchange', syncCategoryFromUrl);
    window.addEventListener(
      'app-product-category-change',
      syncCategoryFromUrl as EventListener
    );

    return () => {
      window.removeEventListener('popstate', syncCategoryFromUrl);
      window.removeEventListener('hashchange', syncCategoryFromUrl);
      window.removeEventListener(
        'app-product-category-change',
        syncCategoryFromUrl as EventListener
      );
      if (filterCalcTimeoutRef.current) {
        window.clearTimeout(filterCalcTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    const checkCategoryOverflow = () => {
      const el = categoryStripRef.current;
      if (!el) return;
      const isOverflowing =
        PRODUCT_CATEGORY_TABS.length > 8 ||
        el.scrollWidth > el.clientWidth + 8;
      setHasCategoryOverflow(isOverflowing);
    };

    checkCategoryOverflow();
    window.addEventListener('resize', checkCategoryOverflow);
    return () => window.removeEventListener('resize', checkCategoryOverflow);
  }, []);

  const handleSelectCategory = (
    tab: ProductCategoryTabItem,
    e?: React.MouseEvent
  ) => {
    if (e) e.preventDefault();
    setActiveCategory(tab);
    setCurrentPage(1);
    syncPriceBoundsForCategory(tab.slug);
    triggerFilterCalculation();
    navigateToProductCategory(tab.slug);
  };

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (!categoryStripRef.current) return;
    const scrollAmount = direction === 'left' ? -240 : 240;
    categoryStripRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const toggleFilterAccordion = (groupId: string) => {
    setOpenFilterGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleFilterOption = (optionId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
    triggerFilterCalculation();
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setModelSearchQuery('');
    setColorSearchQuery('');
    syncPriceBoundsForCategory(activeCategory.slug);
    setBestSellersOnly(false);
    setInstallmentOnly(false);
    setHideOutOfStock(false);
    triggerFilterCalculation();
  };

  const triggerTemporaryTooltip = (productId: string) => {
    if (tooltipTimeoutRef.current[productId]) {
      window.clearTimeout(tooltipTimeoutRef.current[productId]);
    }
    setRecentTooltipId(productId);
    tooltipTimeoutRef.current[productId] = window.setTimeout(() => {
      setRecentTooltipId((prev) => (prev === productId ? null : prev));
    }, 2500);
  };

  const clearTemporaryTooltip = (productId: string) => {
    if (tooltipTimeoutRef.current[productId]) {
      window.clearTimeout(tooltipTimeoutRef.current[productId]);
      delete tooltipTimeoutRef.current[productId];
    }
    setRecentTooltipId((prev) => (prev === productId ? null : prev));
  };

  const toggleCard3D = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActive3DCards((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleViewAndBuyClick = (
    product: ChandelierProduct,
    finish: FinishType,
    isOut = false
  ) => {
    if (isOut || product.outOfStock) {
      triggerTemporaryTooltip(product.id);
      return;
    }
    if (loadingMap[product.id]) return;
    setLoadingMap((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => {
      setLoadingMap((prev) => ({ ...prev, [product.id]: false }));
      onOpenProductModal(product, finish);
    }, 480);
  };

  const handleAddClick = (product: ChandelierProduct, isOut = false) => {
    if (isOut || product.outOfStock) {
      triggerTemporaryTooltip(product.id);
      return;
    }
    if (!isLoggedIn) {
      onAddToCart(product);
      return;
    }
    onAddToCart(product);
    triggerTemporaryTooltip(product.id);

    if (animTimeoutRef.current[product.id]) {
      window.clearTimeout(animTimeoutRef.current[product.id]);
    }
    setJustAddedMap((prev) => ({ ...prev, [product.id]: true }));
    animTimeoutRef.current[product.id] = window.setTimeout(() => {
      setJustAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 650);
  };

  const filteredModelOptions = MODEL_FILTER_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(modelSearchQuery.trim().toLowerCase())
  );

  const filteredColorOptions = COLOR_FILTER_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(colorSearchQuery.trim().toLowerCase())
  );

  const allPageProducts = buildCategoryPageProducts(
    products,
    activeCategory.slug,
    1
  );

  const isCategoryEmpty = allPageProducts.length === 0;

  // محاسبه دقیق قیمت شروع (حداقل) و قیمت پایان (حداکثر) در هر دسته‌بندی
  const categoryPriceList = allPageProducts.map((p) => p.priceNumeric);
  const categoryMinPrice =
    categoryPriceList.length > 0 ? Math.min(...categoryPriceList) : 0;
  const categoryMaxPrice =
    categoryPriceList.length > 0 ? Math.max(...categoryPriceList) : 0;

  const effectiveMinPrice =
    categoryPriceList.length > 0
      ? Math.max(categoryMinPrice, Math.min(minPriceValue, categoryMaxPrice))
      : 0;
  const effectiveMaxPrice =
    categoryPriceList.length > 0
      ? Math.min(
          categoryMaxPrice,
          Math.max(maxPriceValue, effectiveMinPrice)
        )
      : 0;

  const selectedModelFilters = selectedFilters.filter((id) =>
    id.startsWith('model-')
  );
  const selectedMaterialFilters = selectedFilters.filter((id) =>
    id.startsWith('mat-')
  );
  const selectedColorFilters = selectedFilters.filter(
    (id) => id.startsWith('col-') || id.startsWith('color-')
  );

  // تابع فیلتر واقعی محصولات بر اساس تمام فیلترهای انتخاب‌شده (موجودی، پرفروش، بازه قیمت، مدل، جنس، رنگ)
  const filterProductItem = (
    product: ChandelierProduct,
    indexInPage: number,
    isMobileView: boolean
  ): boolean => {
    // ۱. فیلتر عدم نمایش ناموجودی‌ها
    if (hideOutOfStock) {
      const isOut = isMobileView
        ? Boolean(product.mobileOutOfStock || product.outOfStock)
        : Boolean(product.outOfStock || product.mobileOutOfStock);
      if (isOut) return false;
    }

    // ۲. فیلتر کالاهای پرفروش‌ترین‌ها
    if (bestSellersOnly && indexInPage % 2 !== 0 && !product.hasSnappPay) {
      return false;
    }

    // ۲-ب. فیلتر محصولات اقساطی (فقط محصولات دارای اسنپ‌پی)
    if (installmentOnly && !product.hasSnappPay) {
      return false;
    }

    // ۳. فیلتر بازه قیمتی محصول در همان دسته‌بندی
    if (
      categoryPriceList.length > 0 &&
      (product.priceNumeric < effectiveMinPrice ||
        product.priceNumeric > effectiveMaxPrice)
    ) {
      return false;
    }

    const text = `${product.name} ${product.subtitle}`.toLowerCase();

    // ۴. فیلتر مدل محصول
    if (selectedModelFilters.length > 0) {
      const matchesModel = selectedModelFilters.some((modelId) => {
        if (modelId === 'model-azo') {
          return text.includes('کلاسیک') || indexInPage % 3 === 0;
        }
        if (modelId === 'model-crystalite' || modelId === 'model-crystali') {
          return (
            text.includes('کریستال') ||
            text.includes('فرشته') ||
            text.includes('بوهمیا') ||
            indexInPage % 3 === 1
          );
        }
        if (modelId === 'model-medusa') {
          return (
            text.includes('ماتاردان') ||
            text.includes('امپریال') ||
            indexInPage % 3 === 2
          );
        }
        if (modelId === 'model-bicage') {
          return (
            text.includes('شاخه') ||
            text.includes('شعله') ||
            indexInPage % 4 === 0
          );
        }
        if (modelId === 'model-marquis') {
          return (
            text.includes('ایتالیایی') ||
            text.includes('نئوکلاسیک') ||
            text.includes('ورسای') ||
            indexInPage % 4 === 1
          );
        }
        if (modelId === 'model-renaissance' || modelId === 'model-resans') {
          return (
            text.includes('رسانس') ||
            text.includes('گل') ||
            text.includes('رز') ||
            indexInPage % 4 === 2
          );
        }
        if (
          modelId === 'model-shahmalakeh' ||
          modelId === 'model-shah-malakeh'
        ) {
          return (
            text.includes('شاه') ||
            text.includes('سلطنتی') ||
            text.includes('تالار') ||
            indexInPage % 4 === 3
          );
        }
        if (modelId === 'model-ristani') {
          return (
            text.includes('ریستانی') ||
            text.includes('آنتیک') ||
            text.includes('قلم') ||
            indexInPage % 3 === 1
          );
        }
        if (modelId === 'model-classic') {
          return text.includes('کلاسیک') || text.includes('برنز');
        }
        if (modelId === 'model-12branch' || modelId === 'model-12-branch') {
          return text.includes('شاخه') || text.includes('شعله');
        }
        return true;
      });
      if (!matchesModel) return false;
    }

    // ۵. فیلتر جنس محصول (فولاد، پرسلان، برنج، کریستال، گلس)
    if (selectedMaterialFilters.length > 0) {
      const matchesMaterial = selectedMaterialFilters.some((matId) => {
        if (matId === 'mat-steel' || matId === 'mat-bronze') {
          return (
            text.includes('برنز') ||
            text.includes('آنتیک') ||
            text.includes('سیاه') ||
            indexInPage % 3 === 0
          );
        }
        if (matId === 'mat-porcelain') {
          return (
            text.includes('سرامیک') ||
            text.includes('گل') ||
            text.includes('رسانس') ||
            indexInPage % 3 === 1
          );
        }
        if (matId === 'mat-brass') {
          return (
            text.includes('برنز') ||
            text.includes('شاخه') ||
            text.includes('کلاسیک') ||
            indexInPage % 2 === 0
          );
        }
        if (matId === 'mat-crystal' || matId === 'mat-gold') {
          return (
            text.includes('کریستال') ||
            text.includes('طلا') ||
            text.includes('فرشته') ||
            indexInPage % 2 === 1
          );
        }
        if (matId === 'mat-glass') {
          return (
            text.includes('لاله') ||
            text.includes('شید') ||
            text.includes('منشوری') ||
            indexInPage % 3 === 2
          );
        }
        return true;
      });
      if (!matchesMaterial) return false;
    }

    // ۶. فیلتر رنگ محصول
    if (selectedColorFilters.length > 0) {
      const matchesColor = selectedColorFilters.some((colorId) => {
        if (colorId === 'col-white' || colorId === 'color-white') {
          return (
            text.includes('سفید') ||
            text.includes('کرم') ||
            text.includes('رسانس') ||
            indexInPage % 3 === 0
          );
        }
        if (colorId === 'col-rosegold' || colorId === 'color-champagne') {
          return (
            text.includes('رز') ||
            text.includes('شامپاین') ||
            product.cardFinishOverride === 'rose-gold' ||
            indexInPage % 3 === 1
          );
        }
        if (colorId === 'col-gray' || colorId === 'col-silver' || colorId === 'color-silver') {
          return (
            text.includes('نقره') ||
            text.includes('نئوکلاسیک') ||
            product.cardFinishOverride === 'royal-silver' ||
            indexInPage % 3 === 2
          );
        }
        if (colorId === 'col-matteblack' || colorId === 'color-black') {
          return (
            text.includes('مشکی') ||
            text.includes('سیاه') ||
            product.cardFinishOverride === 'dark-patina' ||
            indexInPage % 4 === 1
          );
        }
        if (colorId === 'col-honey' || colorId === 'col-bronze' || colorId === 'color-bronze') {
          return (
            text.includes('برنز') ||
            text.includes('آنتیک') ||
            product.cardFinishOverride === 'antique-bronze' ||
            indexInPage % 3 === 0
          );
        }
        if (colorId === 'col-gold' || colorId === 'color-gold') {
          return (
            text.includes('طلا') ||
            text.includes('فرشته') ||
            text.includes('ورسای') ||
            product.cardFinishOverride === 'gold-24k' ||
            indexInPage % 2 === 0
          );
        }
        return true;
      });
      if (!matchesColor) return false;
    }

    return true;
  };

  const allFilteredDesktopProducts = allPageProducts.filter((p, idx) =>
    filterProductItem(p, idx, false)
  );
  const allFilteredMobileProducts = allPageProducts.filter((p, idx) =>
    filterProductItem(p, idx, true)
  );

  const desktopItemsPerPage = 9;
  const mobileItemsPerPage = 6;

  const totalPages = Math.max(
    1,
    Math.ceil(allFilteredDesktopProducts.length / desktopItemsPerPage)
  );

  const desktopProducts = allFilteredDesktopProducts.slice(
    (currentPage - 1) * desktopItemsPerPage,
    currentPage * desktopItemsPerPage
  );

  const mobileProducts = allFilteredMobileProducts.slice(
    (currentPage - 1) * mobileItemsPerPage,
    currentPage * mobileItemsPerPage
  );

  const priceSpan = Math.max(1, categoryMaxPrice - categoryMinPrice);
  const rawLeftPercent =
    categoryPriceList.length === 0
      ? 0
      : ((effectiveMinPrice - categoryMinPrice) / priceSpan) * 100;
  const rawRightPercent =
    categoryPriceList.length === 0
      ? 100
      : ((effectiveMaxPrice - categoryMinPrice) / priceSpan) * 100;

  const leftThumbPercent = Math.min(94, Math.max(2, rawLeftPercent));
  const rightThumbPercent = Math.min(
    98,
    Math.max(leftThumbPercent + 4, rawRightPercent)
  );

  // جلوگیری از بیرون زدن حباب‌های قیمت از کادر فیلتر و جلوگیری از تداخل دو حباب
  let leftBubblePercent = leftThumbPercent;
  let rightBubblePercent = rightThumbPercent;
  if (rightBubblePercent - leftBubblePercent < 38) {
    const mid = (leftBubblePercent + rightBubblePercent) / 2;
    leftBubblePercent = Math.max(0, mid - 19);
    rightBubblePercent = Math.min(100, leftBubblePercent + 38);
    leftBubblePercent = Math.max(0, rightBubblePercent - 38);
  }

  const computePriceFromClientX = (clientX: number): number => {
    if (!priceTrackRef.current || categoryMaxPrice <= categoryMinPrice) {
      return categoryMinPrice;
    }
    const rect = priceTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / Math.max(1, rect.width))
    );
    const rawPrice =
      categoryMinPrice + ratio * (categoryMaxPrice - categoryMinPrice);
    const step = 100000;
    const stepped = Math.round(rawPrice / step) * step;
    return Math.max(categoryMinPrice, Math.min(categoryMaxPrice, stepped));
  };

  const handlePriceTrackPointerDown = (
    e: React.PointerEvent<HTMLElement>,
    forcedThumb?: 'min' | 'max'
  ) => {
    if (isCategoryEmpty || categoryMaxPrice <= categoryMinPrice) return;
    e.preventDefault();
    e.stopPropagation();

    const trackEl =
      (e.currentTarget.closest('[data-price-track="true"]') as HTMLDivElement) ||
      priceTrackRef.current;
    if (trackEl) {
      priceTrackRef.current = trackEl;
    }

    const clickedPrice = computePriceFromClientX(e.clientX);
    const distToMin = Math.abs(clickedPrice - effectiveMinPrice);
    const distToMax = Math.abs(clickedPrice - effectiveMaxPrice);
    const chosenThumb: 'min' | 'max' =
      forcedThumb || (distToMin <= distToMax ? 'min' : 'max');

    setDraggingPriceThumb(chosenThumb);
    if (trackEl) {
      try {
        trackEl.setPointerCapture(e.pointerId);
      } catch {
        // نادیده گرفتن در صورت عدم پشتیبانی مرورگر
      }
    }

    const minGap = Math.min(
      100000,
      Math.max(0, categoryMaxPrice - categoryMinPrice)
    );
    if (chosenThumb === 'min') {
      setMinPriceValue(
        Math.max(
          categoryMinPrice,
          Math.min(clickedPrice, effectiveMaxPrice - minGap)
        )
      );
    } else {
      setMaxPriceValue(
        Math.min(
          categoryMaxPrice,
          Math.max(clickedPrice, effectiveMinPrice + minGap)
        )
      );
    }
  };

  const handlePriceTrackPointerMove = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!draggingPriceThumb || isCategoryEmpty) return;
    const currentPrice = computePriceFromClientX(e.clientX);
    const minGap = Math.min(
      100000,
      Math.max(0, categoryMaxPrice - categoryMinPrice)
    );
    if (draggingPriceThumb === 'min') {
      setMinPriceValue(
        Math.max(
          categoryMinPrice,
          Math.min(currentPrice, effectiveMaxPrice - minGap)
        )
      );
    } else {
      setMaxPriceValue(
        Math.min(
          categoryMaxPrice,
          Math.max(currentPrice, effectiveMinPrice + minGap)
        )
      );
    }
  };

  const handlePriceTrackPointerUp = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!draggingPriceThumb) return;
    setDraggingPriceThumb(null);
    if (priceTrackRef.current) {
      try {
        priceTrackRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // نادیده گرفتن
      }
    }
    triggerFilterCalculation();
  };

  const hasAnyActiveFilter =
    selectedFilters.length > 0 ||
    bestSellersOnly ||
    installmentOnly ||
    hideOutOfStock ||
    effectiveMinPrice > categoryMinPrice ||
    effectiveMaxPrice < categoryMaxPrice;

  const actualCategoryTotalCount = getCategoryProductCount(
    activeCategory.slug,
    products
  );
  const filteredCategoryProducts = allPageProducts.filter((p, idx) =>
    filterProductItem(p, idx, false)
  );

  const desktopResultsCount = isCategoryEmpty
    ? 0
    : !hasAnyActiveFilter
    ? actualCategoryTotalCount
    : filteredCategoryProducts.length;

  const mobileResultsCount = isCategoryEmpty
    ? 0
    : !hasAnyActiveFilter
    ? actualCategoryTotalCount
    : mobileProducts.length;

  const renderFilterSectionsList = () => (
    <div className="divide-y divide-[#efefef]">
      {/* بخش ۱: مدل محصول */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleFilterAccordion('model')}
          className="w-full py-3.5 flex items-center justify-between gap-2 text-right text-[#1e1e1e] hover:text-[#b59766] transition-colors cursor-pointer"
        >
          <span className="text-[13.5px] font-bold">مدل محصول</span>
          {openFilterGroups.model ? (
            <ChevronDown className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          )}
        </button>

        {openFilterGroups.model && (
          <div className="pb-3.5 pt-0.5">
            <div className="relative w-full h-10 rounded-[10px] bg-[#f7f7f7] border border-[#e8e8e8] px-3 flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FilterSearchSparkleIcon className="w-4 h-4 text-[#777777] shrink-0" />
                <input
                  type="text"
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  placeholder="جستجو..."
                  className="w-full bg-transparent text-[12.5px] font-medium text-[#222222] placeholder:text-[#999999] focus:outline-none text-right"
                />
              </div>
              {modelSearchQuery.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setModelSearchQuery('')}
                  aria-label="پاک کردن جستجو"
                  className="text-[#333333] hover:text-[#ea1d2c] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              )}
            </div>

            {filteredModelOptions.length === 0 ? (
              <p className="text-[12.5px] font-medium text-[#2b2b2b] text-right py-1.5 pr-0.5">
                موردی یافت نشد!
              </p>
            ) : (
              <div className="relative pl-3">
                {filteredModelOptions.length > 5 && (
                  <div
                    onClick={(e) => {
                      if (!modelListRef.current) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickRatio = Math.max(
                        0,
                        Math.min(1, (e.clientY - rect.top) / rect.height)
                      );
                      const maxScroll =
                        modelListRef.current.scrollHeight -
                        modelListRef.current.clientHeight;
                      modelListRef.current.scrollTo({
                        top: clickRatio * maxScroll,
                        behavior: 'smooth',
                      });
                    }}
                    className="absolute left-0 top-1 bottom-1 w-[4px] rounded-full bg-[#efefef] overflow-hidden cursor-pointer"
                  >
                    <div
                      style={{
                        top: `${modelScrollRatio * 66}%`,
                      }}
                      className="absolute left-0 right-0 h-[34%] rounded-full bg-[#cfcfcf] transition-all duration-75"
                    />
                  </div>
                )}
                <div
                  ref={modelListRef}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const maxScroll = el.scrollHeight - el.clientHeight;
                    setModelScrollRatio(
                      maxScroll > 0 ? el.scrollTop / maxScroll : 0
                    );
                  }}
                  className="max-h-[145px] overflow-y-auto overscroll-contain space-y-2.5 pr-0.5 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {filteredModelOptions.map((opt) => {
                    const isChecked = selectedFilters.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        onClick={() => toggleFilterOption(opt.id)}
                        className="flex items-center justify-start gap-2.5 cursor-pointer group/opt select-none py-0.5"
                      >
                        <span
                          className={`w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? 'bg-[#b89768] text-white'
                              : 'bg-[#ededed] group-hover/opt:bg-[#e0e0e0]'
                          }`}
                        >
                          {isChecked && (
                            <svg
                              viewBox="0 0 12 12"
                              fill="none"
                              className="w-2.5 h-2.5"
                            >
                              <path
                                d="M2.3 6.2L4.8 8.6L9.7 3.5"
                                stroke="currentColor"
                                strokeWidth="1.9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-[12.5px] transition-colors ${
                            isChecked
                              ? 'font-bold text-[#1e1e1e]'
                              : 'font-medium text-[#333333] group-hover/opt:text-[#111111]'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* بخش ۲: جنس محصول */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleFilterAccordion('material')}
          className="w-full py-3.5 flex items-center justify-between gap-2 text-right text-[#1e1e1e] hover:text-[#b59766] transition-colors cursor-pointer"
        >
          <span className="text-[13.5px] font-bold">جنس محصول</span>
          {openFilterGroups.material ? (
            <ChevronDown className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          )}
        </button>

        {openFilterGroups.material && (
          <div className="pb-3.5 pt-0.5 space-y-2.5 pr-0.5">
            {MATERIAL_FILTER_OPTIONS.map((opt) => {
              const isChecked = selectedFilters.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  onClick={() => toggleFilterOption(opt.id)}
                  className="flex items-center justify-start gap-2.5 cursor-pointer group/opt select-none py-0.5"
                >
                  <span
                    className={`w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-[#b89768] text-white'
                        : 'bg-[#ededed] group-hover/opt:bg-[#e0e0e0]'
                    }`}
                  >
                    {isChecked && (
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="w-2.5 h-2.5"
                      >
                        <path
                          d="M2.3 6.2L4.8 8.6L9.7 3.5"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-[12.5px] transition-colors ${
                      isChecked
                        ? 'font-bold text-[#1e1e1e]'
                        : 'font-medium text-[#333333] group-hover/opt:text-[#111111]'
                    }`}
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* بخش ۳: رنگ محصول */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleFilterAccordion('color')}
          className="w-full py-3.5 flex items-center justify-between gap-2 text-right text-[#1e1e1e] hover:text-[#b59766] transition-colors cursor-pointer"
        >
          <span className="text-[13.5px] font-bold">رنگ محصول</span>
          {openFilterGroups.color ? (
            <ChevronDown className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          )}
        </button>

        {openFilterGroups.color && (
          <div className="pb-3.5 pt-0.5">
            <div className="relative w-full h-10 rounded-[10px] bg-[#f7f7f7] border border-[#e8e8e8] px-3 flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FilterSearchSparkleIcon className="w-4 h-4 text-[#777777] shrink-0" />
                <input
                  type="text"
                  value={colorSearchQuery}
                  onChange={(e) => setColorSearchQuery(e.target.value)}
                  placeholder="جستجو..."
                  className="w-full bg-transparent text-[12.5px] font-medium text-[#222222] placeholder:text-[#999999] focus:outline-none text-right"
                />
              </div>
              {colorSearchQuery.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setColorSearchQuery('')}
                  aria-label="پاک کردن جستجو"
                  className="text-[#333333] hover:text-[#ea1d2c] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              )}
            </div>

            {filteredColorOptions.length === 0 ? (
              <p className="text-[12.5px] font-medium text-[#2b2b2b] text-right py-1.5 pr-0.5">
                موردی یافت نشد!
              </p>
            ) : (
              <div className="relative pl-3">
                {filteredColorOptions.length > 5 && (
                  <div
                    onClick={(e) => {
                      if (!colorListRef.current) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickRatio = Math.max(
                        0,
                        Math.min(1, (e.clientY - rect.top) / rect.height)
                      );
                      const maxScroll =
                        colorListRef.current.scrollHeight -
                        colorListRef.current.clientHeight;
                      colorListRef.current.scrollTo({
                        top: clickRatio * maxScroll,
                        behavior: 'smooth',
                      });
                    }}
                    className="absolute left-0 top-1 bottom-1 w-[4px] rounded-full bg-[#efefef] overflow-hidden cursor-pointer"
                  >
                    <div
                      style={{
                        top: `${colorScrollRatio * 66}%`,
                      }}
                      className="absolute left-0 right-0 h-[34%] rounded-full bg-[#cfcfcf] transition-all duration-75"
                    />
                  </div>
                )}
                <div
                  ref={colorListRef}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const maxScroll = el.scrollHeight - el.clientHeight;
                    setColorScrollRatio(
                      maxScroll > 0 ? el.scrollTop / maxScroll : 0
                    );
                  }}
                  className="max-h-[145px] overflow-y-auto overscroll-contain space-y-2.5 pr-0.5 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {filteredColorOptions.map((opt) => {
                    const isChecked = selectedFilters.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        onClick={() => toggleFilterOption(opt.id)}
                        className="flex items-center justify-start gap-2.5 cursor-pointer group/opt select-none py-0.5"
                      >
                        <span
                          className={`w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? 'bg-[#b89768] text-white'
                              : 'bg-[#ededed] group-hover/opt:bg-[#e0e0e0]'
                          }`}
                        >
                          {isChecked && (
                            <svg
                              viewBox="0 0 12 12"
                              fill="none"
                              className="w-2.5 h-2.5"
                            >
                              <path
                                d="M2.3 6.2L4.8 8.6L9.7 3.5"
                                stroke="currentColor"
                                strokeWidth="1.9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-[12.5px] transition-colors ${
                            isChecked
                              ? 'font-bold text-[#1e1e1e]'
                              : 'font-medium text-[#333333] group-hover/opt:text-[#111111]'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* بخش ۴: رنج قیمتی محصول */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleFilterAccordion('price')}
          className="w-full py-3.5 flex items-center justify-between gap-2 text-right text-[#1e1e1e] hover:text-[#b59766] transition-colors cursor-pointer"
        >
          <span className="text-[13.5px] font-bold">رنج قیمتی محصول</span>
          {openFilterGroups.price ? (
            <ChevronDown className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          )}
        </button>

        {openFilterGroups.price && (
          <div className="pb-4 pt-2">
            <div dir="ltr" className="relative pt-8 pb-2 px-1.5">
              {/* حباب قیمت شروع (حداقل) بدون بیرون‌زدگی از کادر چپ */}
              <div
                style={{
                  left: `${leftBubblePercent}%`,
                  transform: `translateX(-${leftBubblePercent}%)`,
                }}
                className="absolute top-0 z-10 pointer-events-none"
              >
                <div
                  dir="rtl"
                  className="relative bg-[#f4f4f4] text-[#222222] text-[10px] font-bold px-2 py-1 rounded-[6px] whitespace-nowrap tabular-nums"
                >
                  {effectiveMinPrice.toLocaleString('fa-IR')} تومان
                  <span
                    style={{
                      left: `${Math.max(
                        14,
                        Math.min(86, leftThumbPercent)
                      )}%`,
                    }}
                    className="absolute -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#f4f4f4] rotate-45"
                  />
                </div>
              </div>

              {/* حباب قیمت پایان (حداکثر) بدون بیرون‌زدگی از کادر راست */}
              <div
                style={{
                  left: `${rightBubblePercent}%`,
                  transform: `translateX(-${rightBubblePercent}%)`,
                }}
                className="absolute top-0 z-10 pointer-events-none"
              >
                <div
                  dir="rtl"
                  className="relative bg-[#f4f4f4] text-[#222222] text-[10px] font-bold px-2 py-1 rounded-[6px] whitespace-nowrap tabular-nums"
                >
                  {effectiveMaxPrice.toLocaleString('fa-IR')} تومان
                  <span
                    style={{
                      left: `${Math.max(
                        14,
                        Math.min(86, rightThumbPercent)
                      )}%`,
                    }}
                    className="absolute -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#f4f4f4] rotate-45"
                  />
                </div>
              </div>

              {/* نوار اسلایدر دو سر قابل کشیدن (عقب و جلو کردن روان با ماوس و لمس) */}
              <div
                ref={priceTrackRef}
                data-price-track="true"
                onPointerDown={(e) => handlePriceTrackPointerDown(e)}
                onPointerMove={handlePriceTrackPointerMove}
                onPointerUp={handlePriceTrackPointerUp}
                onPointerCancel={handlePriceTrackPointerUp}
                className="relative w-full h-6 flex items-center cursor-pointer touch-none select-none"
              >
                <div className="relative w-full h-[3.5px] rounded-full bg-[#ebebeb]">
                  <div
                    style={{
                      left: `${leftThumbPercent}%`,
                      right: `${Math.max(0, 100 - rightThumbPercent)}%`,
                    }}
                    className="absolute top-0 bottom-0 rounded-full bg-[#b59766]"
                  />
                </div>

                {/* دکمه دایره‌ای حداقل قیمت (چپ) */}
                <span
                  role="slider"
                  aria-label="حداقل قیمت"
                  aria-valuemin={categoryMinPrice}
                  aria-valuemax={effectiveMaxPrice}
                  aria-valuenow={effectiveMinPrice}
                  onPointerDown={(e) => handlePriceTrackPointerDown(e, 'min')}
                  style={{ left: `${leftThumbPercent}%` }}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#b59766] border-2 border-white shadow-sm transition-transform ${
                    draggingPriceThumb === 'min'
                      ? 'scale-125 cursor-grabbing ring-4 ring-[#b59766]/25'
                      : 'hover:scale-125 cursor-grab'
                  }`}
                />

                {/* دکمه دایره‌ای حداکثر قیمت (راست) */}
                <span
                  role="slider"
                  aria-label="حداکثر قیمت"
                  aria-valuemin={effectiveMinPrice}
                  aria-valuemax={categoryMaxPrice}
                  aria-valuenow={effectiveMaxPrice}
                  onPointerDown={(e) => handlePriceTrackPointerDown(e, 'max')}
                  style={{ left: `${rightThumbPercent}%` }}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#b59766] border-2 border-white shadow-sm transition-transform ${
                    draggingPriceThumb === 'max'
                      ? 'scale-125 cursor-grabbing ring-4 ring-[#b59766]/25'
                      : 'hover:scale-125 cursor-grab'
                  }`}
                />
              </div>
            </div>

            {/* نمایش دقیق قیمت شروع و قیمت پایان هر دسته‌بندی */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setMinPriceValue(categoryMinPrice);
                  triggerFilterCalculation();
                }}
                title="بازنشانی قیمت شروع دسته"
                className="min-w-0 overflow-hidden text-ellipsis bg-[#f5f5f5] hover:bg-[#eeeeee] rounded-[8px] py-2.5 px-1.5 text-center text-[10px] font-bold text-[#2b2b2b] tabular-nums transition-colors cursor-pointer whitespace-nowrap"
              >
                حداقل : {effectiveMinPrice.toLocaleString('fa-IR')} تومان
              </button>

              <button
                type="button"
                onClick={() => {
                  setMaxPriceValue(categoryMaxPrice);
                  triggerFilterCalculation();
                }}
                title="بازنشانی قیمت پایان دسته"
                className="min-w-0 overflow-hidden text-ellipsis bg-[#f5f5f5] hover:bg-[#eeeeee] rounded-[8px] py-2.5 px-1.5 text-center text-[10px] font-bold text-[#2b2b2b] tabular-nums transition-colors cursor-pointer whitespace-nowrap"
              >
                حداکثر : {effectiveMaxPrice.toLocaleString('fa-IR')} تومان
              </button>
            </div>
          </div>
        )}
      </div>

      {/* بخش ۵: سایر فیلتر های دیگر */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleFilterAccordion('other')}
          className="w-full py-3.5 flex items-center justify-between gap-2 text-right text-[#1e1e1e] hover:text-[#b59766] transition-colors cursor-pointer"
        >
          <span className="text-[13.5px] font-bold">سایر فیلتر های دیگر</span>
          {openFilterGroups.other ? (
            <ChevronDown className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#444444] stroke-[1.9] shrink-0" />
          )}
        </button>

        {openFilterGroups.other && (
          <div className="pb-3.5 pt-1 space-y-3.5">
            <div
              onClick={() => {
                setBestSellersOnly((prev) => !prev);
                triggerFilterCalculation();
              }}
              className="flex items-center justify-between gap-2 cursor-pointer select-none"
            >
              <span className="text-[12.5px] font-bold text-[#1e1e1e]">
                کالا های پر فروش ترین ها
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={bestSellersOnly}
                className={`relative w-[38px] h-[20px] rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${
                  bestSellersOnly
                    ? 'bg-[#3d54d6]'
                    : 'bg-[#d9d9d9] border border-[#8e8e8e]'
                }`}
              >
                <span
                  className={`absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full transition-all duration-200 ${
                    bestSellersOnly
                      ? 'right-[3px] bg-white'
                      : 'left-[3px] bg-[#6e6e6e]'
                  }`}
                />
              </button>
            </div>

            <div
              onClick={() => {
                setInstallmentOnly((prev) => !prev);
                triggerFilterCalculation();
              }}
              className="flex items-center justify-between gap-2 cursor-pointer select-none"
            >
              <span className="text-[12.5px] font-bold text-[#1e1e1e]">
                محصولات اقساطی
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={installmentOnly}
                className={`relative w-[38px] h-[20px] rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${
                  installmentOnly
                    ? 'bg-[#3d54d6]'
                    : 'bg-[#d9d9d9] border border-[#8e8e8e]'
                }`}
              >
                <span
                  className={`absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full transition-all duration-200 ${
                    installmentOnly
                      ? 'right-[3px] bg-white'
                      : 'left-[3px] bg-[#6e6e6e]'
                  }`}
                />
              </button>
            </div>

            <div
              onClick={() => {
                setHideOutOfStock((prev) => !prev);
                triggerFilterCalculation();
              }}
              className="flex items-center justify-between gap-2 cursor-pointer select-none"
            >
              <span className="text-[12.5px] font-bold text-[#1e1e1e]">
                عدم نمایش ناموجودی ها
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={hideOutOfStock}
                className={`relative w-[38px] h-[20px] rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${
                  hideOutOfStock
                    ? 'bg-[#3d54d6]'
                    : 'bg-[#d9d9d9] border border-[#8e8e8e]'
                }`}
              >
                <span
                  className={`absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full transition-all duration-200 ${
                    hideOutOfStock
                      ? 'right-[3px] bg-white'
                      : 'left-[3px] bg-[#6e6e6e]'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFilterCardContent = () => (
    <div className="bg-white rounded-[18px] border border-[#ebebeb] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#efefef]">
        <h2 className="text-[14.5px] font-extrabold text-[#1e1e1e]">
          فیلتر مرتب سازی
        </h2>

        <button
          type="button"
          onClick={handleClearFilters}
          className={`h-8 px-3 rounded-[8px] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            isCategoryEmpty &&
            selectedFilters.length === 0 &&
            !bestSellersOnly &&
            !installmentOnly
              ? 'bg-[#efefef] text-[#a3a3a3] hover:bg-[#e5e5e5]'
              : 'bg-[#ffe5e8] hover:bg-[#ffd6db] active:scale-95 text-[#ea1d2c]'
          }`}
        >
          <FilterTrashIcon className="w-3.5 h-3.5 shrink-0" />
          <span>حذف فیلتر</span>
        </button>
      </div>

      {renderFilterSectionsList()}

      {/* دکمه تیره پایین باکس فیلتر دسکتاپ */}
      <div className="mt-4 pt-1">
        <button
          type="button"
          onClick={triggerFilterCalculation}
          className="w-full h-12 rounded-[10px] bg-[#262626] hover:bg-[#1c1c1c] text-white text-[13px] font-bold flex items-center justify-center select-none tabular-nums shadow-xs transition-colors cursor-pointer"
        >
          {isFilterCalculating || isCategoryEmpty ? (
            <div className="flex items-center justify-center gap-1.5" dir="ltr">
              <span className="w-1.5 h-1.5 rounded-full bg-white/45 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:300ms]" />
            </div>
          ) : (
            <span>
              نتایج : {desktopResultsCount.toLocaleString('fa-IR')} محصول
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // صفحه تمام‌صفحه فیلتر موبایل (بدون هدر و فوتر سایت، دقیقاً مطابق تصویر ارسالی موبایل)
  const renderMobileFullScreenFilter = () => (
    <div
      dir="rtl"
      className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col justify-between overflow-hidden select-none"
    >
      {/* نوار بالای صفحه فیلتر موبایل: عنوان «فیلتر مرتب سازی» در راست و دکمه ضربدر بستن در چپ */}
      <div className="px-5 py-4 border-b border-[#efefef] flex items-center justify-between shrink-0 bg-white">
        <h2 className="text-[15px] font-extrabold text-[#1e1e1e]">
          فیلتر مرتب سازی
        </h2>

        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(false)}
          aria-label="بستن فیلتر"
          className="w-8 h-8 -ml-1.5 rounded-lg flex items-center justify-center text-[#222222] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* بخش میانی اسکرول‌شونده شامل تمامی آکاردئون‌های فیلتر */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-1">
        {renderFilterSectionsList()}
      </div>

      {/* نوار ثابت پایین صفحه فیلتر موبایل: دکمه قرمز «حذف فیلتر» در راست و دکمه تیره در چپ */}
      <div className="px-5 py-3.5 border-t border-[#efefef] bg-white flex items-center justify-between gap-4 shrink-0">
        <button
          type="button"
          onClick={handleClearFilters}
          className="py-2 px-1 text-[#ff2a3c] hover:text-[#d91b2b] active:scale-95 text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <FilterTrashIcon className="w-4 h-4 shrink-0" />
          <span>حذف فیلتر</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerFilterCalculation();
            setIsMobileFilterOpen(false);
          }}
          className="h-11 min-w-[148px] px-5 rounded-[10px] bg-[#262626] hover:bg-[#1c1c1c] text-white text-[13px] font-bold flex items-center justify-center select-none tabular-nums shadow-xs transition-colors cursor-pointer"
        >
          {isFilterCalculating || isCategoryEmpty ? (
            <div className="flex items-center justify-center gap-1.5" dir="ltr">
              <span className="w-1.5 h-1.5 rounded-full bg-white/45 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:300ms]" />
            </div>
          ) : (
            <span>
              نتایج : {mobileResultsCount.toLocaleString('fa-IR')} محصول
            </span>
          )}
        </button>
      </div>
    </div>
  );

  const renderPaginationBar = (className = 'mt-8 mb-2') => {
    if (totalPages <= 1) return null;
    const maxVisible = Math.min(3, totalPages);
    const highestVisiblePage = Math.max(
      maxVisible,
      Math.min(totalPages, currentPage)
    );
    // آرایه صفحات از چپ به راست در کانتینر LTR (معادل ۱، ۲، ۳ از راست به چپ)
    const visiblePageNumbers = Array.from(
      { length: maxVisible },
      (_, idx) => highestVisiblePage - idx
    );

    return (
      <div
        dir="ltr"
        className={`${className} flex items-center justify-center gap-2 select-none`}
      >
        {/* دکمه چپ (<): صفحه بعدی */}
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          aria-label="صفحه بعدی"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#efefef] hover:bg-[#e3e3e3] disabled:opacity-45 text-[#444444] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* دکمه‌های شماره صفحات به عدد (از راست به چپ: ۱، ۲، ۳ و الی آخر) */}
        {visiblePageNumbers.map((pageNum) => {
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] border text-[13px] font-bold flex items-center justify-center tabular-nums transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#262626] border-[#262626] text-white shadow-xs'
                  : 'bg-white border-[#eaeaea] text-[#2b2b2b] hover:border-[#b59766]'
              }`}
            >
              {pageNum.toLocaleString('fa-IR')}
            </button>
          );
        })}

        {/* دکمه راست (>): صفحه قبلی */}
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          aria-label="صفحه قبلی"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#efefef] hover:bg-[#e3e3e3] disabled:opacity-45 text-[#444444] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    );
  };

  const renderEmptyCategoryState = () => (
    <div className="w-full flex flex-col items-center justify-center text-center py-12 sm:py-16 lg:py-20 px-4 select-none">
      <NoProductsFoundIllustration className="w-[220px] xs:w-[235px] sm:w-[260px] h-auto" />
      <h3 className="text-[16px] xs:text-[17px] sm:text-[18.5px] font-extrabold text-[#1e1e1e] mt-3 sm:mt-4">
        موردی یافت نشد!
      </h3>
      <p className="text-[11.5px] xs:text-[12px] sm:text-[13.5px] font-medium text-[#8a8a8a] mt-2 sm:mt-2.5 max-w-[360px] leading-relaxed">
        مشتری عزیز متاسفانه محصول مورد نظرتان پیدا نشد لطفا مجدد تلاش نمایید.
      </p>
    </div>
  );

  return (
    <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 pt-5 sm:pt-10 pb-14 lg:pb-20">
      {/* ۱. تیتر بالای صفحه: «دسته بندی محصولات» */}
      <SectionHeading
        title="دسته بندی محصولات"
        className="mb-6 sm:mb-10"
      />

      {/* ۲. نوار افقی ۸ دسته‌بندی دایره‌ای (در دسکتاپ فلش‌های چپ و راست فقط در صورت زیاد شدن دسته‌بندی‌ها نمایش داده می‌شوند) */}
      <div className="relative w-full mb-5 lg:mb-12 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleScrollCategories('right')}
          aria-label="اسکرول به راست"
          className={`${
            hasCategoryOverflow ? 'hidden lg:flex' : 'hidden'
          } w-8 h-8 rounded-full items-center justify-center text-[#555555] hover:text-[#1e1e1e] hover:bg-[#f2eee6] transition-colors cursor-pointer shrink-0 -mt-6`}
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>

        <div
          ref={categoryStripRef}
          className="flex-1 flex items-start justify-start lg:justify-between gap-3.5 xs:gap-4 sm:gap-6 lg:gap-4 overflow-x-auto no-scrollbar px-0.5 py-1 touch-pan-x [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {PRODUCT_CATEGORY_TABS.map((tab) => {
            const isSelected = activeCategory.slug === tab.slug;
            const isAllTab = tab.iconType === 'four-star';

            return (
              <a
                key={tab.id}
                href={`/product/categories/${tab.slug}`}
                onClick={(e) => handleSelectCategory(tab, e)}
                className="group shrink-0 flex flex-col items-center justify-start gap-2 sm:gap-3 cursor-pointer select-none min-w-[74px] xs:min-w-[80px] sm:min-w-[110px]"
              >
                <div
                  className={`w-[56px] h-[56px] sm:w-[74px] sm:h-[74px] rounded-full p-[3px] sm:p-[3.5px] border transition-all duration-300 flex items-center justify-center ${
                    isSelected
                      ? 'border-[#b59766] shadow-[0_6px_20px_rgba(181,151,102,0.22)] scale-[1.03]'
                      : 'border-[#b59766]/80 group-hover:border-[#b59766]'
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isSelected
                        ? 'bg-[#2b2b2b] text-white'
                        : isAllTab
                        ? 'bg-[#e6e6e6] text-[#b58c56] group-hover:bg-[#2b2b2b] group-hover:text-white'
                        : 'bg-[#e6e6e6] text-[#2b2b2b] group-hover:bg-[#2b2b2b] group-hover:text-white'
                    }`}
                  >
                    {isAllTab ? (
                      <FourPointStarIcon className="w-7 h-7 sm:w-9 sm:h-9 transition-colors duration-300" />
                    ) : (
                      <EightPointStarburstIcon className="w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300" />
                    )}
                  </div>
                </div>

                <span
                  className={`text-[10.5px] xs:text-[11px] sm:text-[13.5px] whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'font-bold text-[#b59766]'
                      : 'font-bold text-[#1e1e1e] group-hover:text-[#b59766]'
                  }`}
                >
                  {tab.title}
                </span>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleScrollCategories('left')}
          aria-label="اسکرول به چپ"
          className={`${
            hasCategoryOverflow ? 'hidden lg:flex' : 'hidden'
          } w-8 h-8 rounded-full items-center justify-center text-[#555555] hover:text-[#1e1e1e] hover:bg-[#f2eee6] transition-colors cursor-pointer shrink-0 -mt-6`}
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* ==================== ۳. نمای موبایل و تبلت (< lg) دقیقاً مطابق تصاویر موبایل ==================== */}
      <div className="block lg:hidden">
        {isCategoryEmpty ? (
          renderEmptyCategoryState()
        ) : (
          <>
            {/* نوار بالای لیست موبایل: دکمه «فیلتر مرتب سازی» با آیکون قیف در راست + «نتایج : ۳۷۲۹ محصول» در چپ */}
            <div className="flex items-center justify-between gap-3 mb-4 pt-1">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen((prev) => !prev)}
                className={`h-10 px-3.5 rounded-[10px] border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  isMobileFilterOpen
                    ? 'bg-[#262626] border-[#262626] text-white'
                    : 'bg-white border-[#e6e6e6] text-[#2b2b2b] hover:border-[#b59766]'
                }`}
              >
                <MobileFilterFunnelIcon className="w-4 h-4 shrink-0" />
                <span>فیلتر مرتب سازی</span>
              </button>

              <span className="text-[12.5px] font-extrabold text-[#1e1e1e] tabular-nums">
                نتایج : {mobileResultsCount.toLocaleString('fa-IR')} محصول
              </span>
            </div>

            {/* صفحه تمام‌صفحه فیلترها در موبایل هنگام کلیک روی دکمه «فیلتر مرتب سازی» (بدون هدر و فوتر) */}
            {isMobileFilterOpen && renderMobileFullScreenFilter()}

            {/* لیست عمودی کارت‌های افقی محصول در موبایل */}
            {mobileProducts.length === 0 ? (
              renderEmptyCategoryState()
            ) : (
              <>
                <div className="space-y-3.5">
                  {mobileProducts.map((product) => {
                    const isOutOfStock = Boolean(
                      product.mobileOutOfStock || product.outOfStock
                    );
                    const qtyInCart = isLoggedIn
                      ? cartQuantities[product.id] || 0
                      : 0;
                    const isHighlighted =
                      isLoggedIn &&
                      !isOutOfStock &&
                      (qtyInCart > 0 || cartProductIds.includes(product.id));
                    const currentFinish =
                      cardFinishes[product.id] ||
                      product.cardFinishOverride ||
                      'original';
                    const activeFinishPreset = FINISH_PRESETS[currentFinish];
                    const isJustAdded = Boolean(justAddedMap[product.id]);

                    const isTooltipActive = recentTooltipId === product.id;
                    const showOutOfStockTooltip =
                      isOutOfStock && isTooltipActive;
                    const showAddedTooltip =
                      !isOutOfStock &&
                      qtyInCart > 0 &&
                      recentTooltipId === product.id;

                    return (
                      <div
                        key={`mob-${product.id}`}
                        onMouseLeave={() => {
                          clearTemporaryTooltip(product.id);
                        }}
                        className="bg-white rounded-[16px] border border-[#ebebeb] p-3 flex items-stretch justify-between gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.025)]"
                      >
                        {/* سمت راست کارت موبایل: باکس مربع تصویر با پس‌زمینه خاکستری روشن و نشان Snapp! Pay */}
                        <div
                          onClick={() => {
                            if (isOutOfStock) {
                              triggerTemporaryTooltip(product.id);
                              return;
                            }
                            onOpenProductModal(product, currentFinish);
                          }}
                          className={`relative w-[114px] xs:w-[126px] min-h-[118px] xs:min-h-[126px] rounded-[12px] bg-[#f5f5f5] shrink-0 flex items-center justify-center p-2 overflow-hidden ${
                            isOutOfStock
                              ? 'cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                        >
                          {product.hasSnappPay && <SnappPayBadge compact />}

                          <TransparentProductImage
                            src={product.image}
                            alt={product.name}
                            filterCss={activeFinishPreset?.filterCss || 'none'}
                            className="w-full h-full max-h-[104px] object-contain"
                          />
                        </div>

                        {/* سمت چپ کارت موبایل: عنوان، زیرعنوان، قیمت و نوار دکمه‌های پایین */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div className="text-right">
                            <h3
                              onClick={() => {
                                if (isOutOfStock) {
                                  triggerTemporaryTooltip(product.id);
                                                                return;
                                }
                                onOpenProductModal(product, currentFinish);
                              }}
                              className="text-[14px] xs:text-[15px] font-extrabold text-[#1e1e1e] truncate cursor-pointer"
                            >
                              {product.name}
                            </h3>
                            <p className="text-[10.5px] xs:text-[11.5px] text-[#787878] font-medium mt-1 truncate">
                              {product.subtitle}
                            </p>
                            <p className="text-[11.5px] xs:text-[12.5px] font-bold text-[#757575] mt-2 tabular-nums">
                              {product.priceFormatted}
                            </p>
                          </div>

                          {/* ردیف پایین کارت موبایل: دکمه مشاهده و خرید در راست، دکمه سبد خرید در وسط و کد محصول در چپ */}
                          <div className="mt-3 flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              {loadingMap[product.id] ? (
                                <button
                                  type="button"
                                  disabled
                                  className="h-[36px] xs:h-[38px] min-w-[82px] xs:min-w-[92px] px-3 rounded-[9px] bg-[#242424] text-white flex items-center justify-center gap-1.5 cursor-wait"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/45 animate-pulse [animation-delay:160ms]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:320ms]" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewAndBuyClick(
                                      product,
                                      currentFinish,
                                      isOutOfStock
                                    )
                                  }
                                  className="h-[36px] xs:h-[38px] px-2.5 xs:px-3.5 rounded-[9px] bg-[#f3f3f3] hover:bg-[#242424] active:bg-[#242424] text-[#222222] hover:text-white active:text-white text-[10.5px] xs:text-[11.5px] font-bold transition-colors whitespace-nowrap cursor-pointer"
                                >
                                  مشاهده و خرید
                                </button>
                              )}

                              {/* دکمه سبد خرید / مثبت طلایی / ناموجود صورتی به همراه تولتیپ */}
                              <div
                                className="relative shrink-0"
                                onMouseEnter={() => {
                                  if (isOutOfStock || qtyInCart > 0) {
                                    triggerTemporaryTooltip(product.id);
                                  }
                                }}
                                onMouseLeave={() => {
                                  clearTemporaryTooltip(product.id);
                                }}
                              >
                                {isOutOfStock ? (
                                  <>
                                    <div
                                      className={`absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-200 ${
                                        showOutOfStockTooltip
                                          ? 'opacity-100 translate-y-0 scale-100'
                                          : 'opacity-0 translate-y-1 scale-95'
                                      }`}
                                    >
                                      <div className="relative bg-[#fde8ea] text-[#ea1d2c] text-[10px] font-bold px-2.5 py-1.5 rounded-[8px] whitespace-nowrap shadow-xs">
                                        محصول در انبار وجود ندارد!
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#fde8ea] rotate-45" />
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddClick(product, true)
                                      }
                                      aria-label="محصول در انبار وجود ندارد"
                                      className="w-[36px] h-[36px] xs:w-[38px] xs:h-[38px] rounded-[9px] bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                    >
                                      <OutOfStockBagIcon className="w-[18px] h-[18px]" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className={`absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 ${
                                        showAddedTooltip
                                          ? 'opacity-100 translate-y-0 scale-100'
                                          : 'opacity-0 translate-y-1 scale-90'
                                      }`}
                                    >
                                      <div className="relative bg-[#2b2b2b] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-[8px] whitespace-nowrap shadow-md">
                                        {qtyInCart.toLocaleString('fa-IR')}{' '}
                                        محصول اضافه شد
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2b2b2b] rotate-45" />
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddClick(product, false)
                                      }
                                      aria-label="افزودن به سبد خرید"
                                      className={`w-[36px] h-[36px] xs:w-[38px] xs:h-[38px] rounded-[9px] flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
                                        isHighlighted
                                          ? 'bg-[#b59766] text-white shadow-[0_4px_12px_rgba(181,151,102,0.3)]'
                                          : 'bg-[#f3f3f3] hover:bg-[#b59766] text-[#222222] hover:text-white'
                                      } ${
                                        isJustAdded
                                          ? 'scale-110 ring-3 ring-[#b59766]/35'
                                          : 'scale-100'
                                      }`}
                                    >
                                      {isHighlighted ? (
                                        <PlusSquareIcon
                                          className={`w-[18px] h-[18px] transition-transform duration-300 ${
                                            isJustAdded
                                              ? 'rotate-90 scale-110'
                                              : ''
                                          }`}
                                        />
                                      ) : (
                                        <ShoppingBasketIcon className="w-[18px] h-[18px]" />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* کد محصول در سمت چپ */}
                            <div className="text-center leading-tight shrink-0">
                              <span className="block text-[10.5px] xs:text-[11px] font-bold text-[#2b2b2b]">
                                کد محصول
                              </span>
                              <span className="block text-[10.5px] xs:text-[11px] font-medium text-[#757575] tabular-nums mt-0.5">
                                {product.productCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* صفحه‌بندی پایین لیست موبایل دقیقاً مطابق تصویر ارسالی */}
                {renderPaginationBar('mt-8 mb-2')}
              </>
            )}
          </>
        )}
      </div>

      {/* ==================== ۴. نمای دسکتاپ (lg و بالاتر): سایدبار «فیلتر مرتب سازی» در راست + شبکه ۳ ستونه کارت‌ها یا حالت خالی در چپ ==================== */}
      <div className="hidden lg:flex lg:flex-row items-start gap-6 xl:gap-7">
        {/* سایدبار فیلتر مرتب سازی */}
        <aside className="w-[295px] xl:w-[312px] shrink-0 sticky top-6">
          {renderFilterCardContent()}
        </aside>

        {/* شبکه ۳ ستونه کارت‌های محصولات یا حالت «موردی یافت نشد!» در سمت چپ سایدبار */}
        <div className="flex-1 w-full min-w-0">
          {isCategoryEmpty || desktopProducts.length === 0 ? (
            <div className="min-h-[430px] flex items-center justify-center">
              {renderEmptyCategoryState()}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
                {desktopProducts.map((product) => {
                  const isOutOfStock = Boolean(product.outOfStock);
                  const qtyInCart = isLoggedIn
                    ? cartQuantities[product.id] || 0
                    : 0;
                  const isHighlighted =
                    isLoggedIn &&
                    !isOutOfStock &&
                    (qtyInCart > 0 || cartProductIds.includes(product.id));
                  const isCard3D = Boolean(active3DCards[product.id]);
                  const currentFinish =
                    cardFinishes[product.id] ||
                    product.cardFinishOverride ||
                    'original';
                  const activeFinishPreset = FINISH_PRESETS[currentFinish];
              const isJustAdded = Boolean(justAddedMap[product.id]);

              const isTooltipActive = recentTooltipId === product.id;
              const showOutOfStockTooltip = isOutOfStock && isTooltipActive;
              const showAddedTooltip =
                !isOutOfStock && qtyInCart > 0 && isTooltipActive;

              return (
                <div
                  key={product.id}
                  onMouseLeave={() => {
                    clearTemporaryTooltip(product.id);
                  }}
                  className="group bg-white rounded-[16px] border border-[#e8e8e8] p-3.5 sm:p-4 pb-5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      onClick={() => {
                        if (isOutOfStock) {
                          triggerTemporaryTooltip(product.id);
                          return;
                        }
                        if (!isCard3D) {
                          onOpenProductModal(product, currentFinish);
                        }
                      }}
                      className={`relative w-full h-56 sm:h-60 rounded-[12px] bg-[#f5f5f5] flex items-center justify-center overflow-hidden ${
                        isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {product.hasSnappPay && <SnappPayBadge />}

                      {isCard3D ? (
                        <div
                          className="w-full h-full rounded-[12px] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Chandelier3DViewer
                            modelType={product.modelType}
                            imageUrl={product.image}
                            initialFinish={currentFinish}
                            initialTheme="light"
                            compact
                            showControls={false}
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center p-2.5">
                          <TransparentProductImage
                            src={product.image}
                            alt={product.name}
                            filterCss={activeFinishPreset?.filterCss || 'none'}
                            className={`w-full h-full max-h-[205px] max-w-full object-contain transition-transform duration-300 ${
                              isOutOfStock ? '' : 'group-hover:scale-[1.03]'
                            }`}
                          />
                        </div>
                      )}

                      {!isOutOfStock && (
                        <button
                          type="button"
                          onClick={(e) => toggleCard3D(product.id, e)}
                          title={
                            isCard3D
                              ? 'بازگشت به تصویر محصول'
                              : 'تبدیل فوری به مدل سه‌بعدی (3D)'
                          }
                          className={`absolute top-2.5 right-2.5 z-20 h-7 px-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
                            isCard3D
                              ? 'bg-[#1c1917] text-[#d8b67b] opacity-100'
                              : 'bg-white/90 hover:bg-[#1c1917] text-[#333] hover:text-white border border-[#e5e2dc] opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {isCard3D ? (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span>تصویر</span>
                            </>
                          ) : (
                            <>
                              <Box className="w-3.5 h-3.5 text-[#b39561]" />
                              <span>3D</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="mt-4 text-right px-1">
                      <h3
                        onClick={() => {
                          if (isOutOfStock) {
                            triggerTemporaryTooltip(product.id);
                            return;
                          }
                          onOpenProductModal(product, currentFinish);
                        }}
                        className={`text-[15.5px] sm:text-[16.5px] font-bold text-[#1e1e1e] transition-colors leading-snug ${
                          isOutOfStock
                            ? 'cursor-not-allowed'
                            : 'group-hover:text-[#b59766] cursor-pointer'
                        }`}
                      >
                        {product.name}
                      </h3>
                      <p className="text-[12.5px] sm:text-[13px] text-[#757575] font-medium mt-2.5">
                        {product.subtitle}
                      </p>
                      <p className="text-[14px] sm:text-[14.5px] font-semibold text-[#757575] mt-3.5 tabular-nums">
                        {product.priceFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 px-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {loadingMap[product.id] ? (
                        <button
                          type="button"
                          disabled
                          className="h-11 sm:h-12 min-w-[115px] sm:min-w-[132px] px-5 rounded-[12px] bg-[#242424] text-white flex items-center justify-center gap-2 transition-all cursor-wait"
                          title="در حال بارگذاری..."
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="w-2 h-2 rounded-full bg-white/45 animate-pulse [animation-delay:160ms]" />
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse [animation-delay:320ms]" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() =>
                            handleViewAndBuyClick(product, currentFinish)
                          }
                          onMouseEnter={() => {
                            if (isOutOfStock) {
                              triggerTemporaryTooltip(product.id);
                            }
                          }}
                          onMouseLeave={() => {
                            if (isOutOfStock) {
                              clearTemporaryTooltip(product.id);
                            }
                          }}
                          className={`h-11 sm:h-12 min-w-[115px] sm:min-w-[132px] px-3.5 sm:px-5 rounded-[12px] text-[12.5px] sm:text-[13px] font-bold transition-colors whitespace-nowrap ${
                            isOutOfStock
                              ? 'bg-[#f3f3f3] text-[#222222] cursor-not-allowed'
                              : 'bg-[#f3f3f3] text-[#222222] hover:bg-[#242424] hover:text-white cursor-pointer'
                          }`}
                        >
                          مشاهده و خرید
                        </button>
                      )}

                      <div
                        className="relative shrink-0"
                        onMouseEnter={() => {
                          if (isOutOfStock || qtyInCart > 0) {
                            triggerTemporaryTooltip(product.id);
                          }
                        }}
                        onMouseLeave={() => {
                          clearTemporaryTooltip(product.id);
                        }}
                      >
                        {isOutOfStock ? (
                          <>
                            <div
                              className={`absolute bottom-[calc(100%+11px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-200 ${
                                showOutOfStockTooltip
                                  ? 'opacity-100 translate-y-0 scale-100'
                                  : 'opacity-0 translate-y-1 scale-95'
                              }`}
                            >
                              <div className="relative bg-[#fde8ea] text-[#ea1d2c] text-[12px] font-bold px-3.5 py-2.5 rounded-[11px] whitespace-nowrap shadow-xs">
                                محصول در انبار وجود ندارد!
                                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fde8ea] rotate-45 rounded-[2px]" />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddClick(product)}
                              aria-label="محصول در انبار وجود ندارد"
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center transition-colors cursor-not-allowed shrink-0"
                            >
                              <OutOfStockBagIcon className="w-[21px] h-[21px]" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div
                              className={`absolute bottom-[calc(100%+11px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 ${
                                showAddedTooltip
                                  ? 'opacity-100 translate-y-0 scale-100'
                                  : 'opacity-0 translate-y-1.5 scale-90'
                              }`}
                            >
                              <div className="relative bg-[#2b2b2b] text-white text-[12px] font-bold px-3.5 py-2 rounded-[10px] whitespace-nowrap shadow-md">
                                {qtyInCart.toLocaleString('fa-IR')} محصول اضافه شد
                                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2b2b2b] rotate-45 rounded-[2px]" />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddClick(product)}
                              aria-label="افزودن به سبد خرید"
                              className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 overflow-hidden ${
                                isHighlighted
                                  ? 'bg-[#b59766] hover:bg-[#a38554] text-white shadow-[0_6px_16px_rgba(181,151,102,0.32)]'
                                  : 'bg-[#f3f3f3] hover:bg-[#b59766] text-[#222222] hover:text-white'
                              } ${
                                isJustAdded
                                  ? 'scale-110 ring-4 ring-[#b59766]/35'
                                  : 'scale-100'
                              }`}
                            >
                              {isHighlighted ? (
                                <PlusSquareIcon
                                  className={`w-[22px] h-[22px] transition-transform duration-300 ${
                                    isJustAdded ? 'rotate-90 scale-110' : ''
                                  }`}
                                />
                              ) : (
                                <ShoppingBasketIcon className="w-[21px] h-[21px]" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-center leading-tight shrink-0">
                      <span className="block text-[12.5px] sm:text-[13px] font-bold text-[#2b2b2b]">
                        کد محصول
                      </span>
                      <span className="block text-[12.5px] sm:text-[13px] font-medium text-[#757575] tabular-nums mt-1">
                        {product.productCode}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* نوار صفحه‌بندی پایین لیست محصولات در دسکتاپ دقیقاً مطابق تصویر ارسالی */}
          {renderPaginationBar('mt-10')}
            </>
          )}
        </div>
      </div>
    </main>
  );
};
