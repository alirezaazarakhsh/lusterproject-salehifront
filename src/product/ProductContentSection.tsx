import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Box,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Plus,
  CheckCircle2,
  ZoomIn,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { SectionHeading } from '../components/Ornaments';
import { AppToast, NotifyAvailabilityModal } from '../components/InteractiveModals';
import {
  ChandelierProduct,
  GENERATED_IMAGES,
  SALEHI_COLLECTION_PRODUCTS,
  CARD_PLATING_FINISHES,
} from '../data/chandelierData';
import {
  Chandelier3DViewer,
  FinishType,
  FINISH_PRESETS,
} from '../components/Chandelier3DViewer';
import { TransparentProductImage } from '../components/TransparentProductImage';
import { OptimizedImage } from '../components/OptimizedImage';
import { handleImgErrorFallback, resolveDirectImageUrl } from '../utils/imageCdnHelper';
import {
  getProductCategorySlugFromLocation,
  getCurrentProductSlug,
  navigateToProductCategory,
  scrollToTopImmediate,
} from '../utils/navigation';
import {
  loadLocalDb,
  INITIAL_PRODUCT_FILTER_SETTINGS,
  ProductFilterSettingsConfig,
} from '../utils/localBackendFallback';
import { toPersianDigits } from '../utils/persianDigits';

import {
  Verify,
  Ruler,
  Layer,
  HashtagUp,
  AddSquare,
  MinusSquare,
  Archive,
  SearchNormal,
  Share,
  BagTick,
  TruckFast,
  Bag,
  BagCross,
  NotificationBing,
} from 'iconsax-react';

/**
 * آیکون مربع گوشه‌گرد با علامت بعلاوه (+)
 */
const PlusSquareIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="5.5" />
    <line x1="12" y1="8.5" x2="12" y2="15.5" />
    <line x1="8.5" y1="12" x2="15.5" y2="12" />
  </svg>
);

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

export const isProductInProductCategory = (
  p: ChandelierProduct,
  categorySlug: string
): boolean => {
  const pCat = String(p.categoryKey || (p as any).categorySlug || (p as any).category || '').trim().toLowerCase();
  const target = String(categorySlug || '').trim().toLowerCase();
  if (!target || target === 'all') return true;
  if (!pCat) return false;
  if (pCat === target) return true;

  if (target === 'chandeliers') {
    return pCat === 'chandeliers' || pCat.includes('لوستر');
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
  // ۱. بررسی وجود محصولات ثبت‌شده در دیتابیس برای این دسته‌بندی
  if (baseProducts && baseProducts.length > 0) {
    const dbCategoryItems: ProductCardItem[] =
      categorySlug === 'all'
        ? baseProducts
        : baseProducts.filter((p) => isProductInProductCategory(p, categorySlug));

    const shift = dbCategoryItems.length > 0 ? ((pageNumber - 1) * 2) % dbCategoryItems.length : 0;
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
  if (baseProducts && baseProducts.length > 0) {
    if (resolvedTab.slug === 'all') return baseProducts.length;
    return baseProducts.filter((p) => isProductInProductCategory(p, resolvedTab.slug)).length;
  }
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
  userPhone?: string;
}

interface FilterScrollContainerProps {
  id: string;
  className?: string;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

/**
 * کانتینر اسکرول فوق‌العاده ظریف ۳.۵ پیکسلی با نمایش دائمی اسکرول‌بار در گوشی (موبایل) و دسکتاپ
 * دقیقاً مطابق طراحی فیگما
 */
const FilterScrollContainer: React.FC<FilterScrollContainerProps> = ({
  id,
  className = '',
  innerRef,
  children,
}) => {
  const localRef = useRef<HTMLDivElement | null>(null);
  const containerRef = innerRef || localRef;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(44);
  const [isScrollable, setIsScrollable] = useState(true);
  const isDraggingRef = useRef(false);
  const startDragYRef = useRef(0);
  const startScrollTopRef = useRef(0);

  const updateScrollbar = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 2) {
      setIsScrollable(false);
      return;
    }
    setIsScrollable(true);
    const minHeight = 32;
    const calculatedHeight = Math.max(
      minHeight,
      (clientHeight / scrollHeight) * clientHeight
    );
    const maxTop = clientHeight - calculatedHeight;
    const scrollableRange = scrollHeight - clientHeight;
    const scrollRatio = scrollableRange > 0 ? scrollTop / scrollableRange : 0;
    const calculatedTop = scrollRatio * maxTop;

    setThumbHeight(calculatedHeight);
    setThumbTop(calculatedTop);
  }, [containerRef]);

  useEffect(() => {
    updateScrollbar();
    const el = containerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      updateScrollbar();
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateScrollbar, containerRef, children]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.max(
      0,
      Math.min(1, (clickY - thumbHeight / 2) / (rect.height - thumbHeight))
    );
    const targetScroll = ratio * (el.scrollHeight - el.clientHeight);
    el.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    startDragYRef.current = e.clientY;
    startScrollTopRef.current = containerRef.current
      ? containerRef.current.scrollTop
      : 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const deltaY = moveEvent.clientY - startDragYRef.current;
      const el = containerRef.current;
      const trackHeight = el.clientHeight;
      const scrollableRange = el.scrollHeight - el.clientHeight;
      const maxTop = trackHeight - thumbHeight;
      if (maxTop <= 0) return;
      const scrollDelta = (deltaY / maxTop) * scrollableRange;
      el.scrollTop = startScrollTopRef.current + scrollDelta;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleThumbTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.touches.length === 0) return;
    isDraggingRef.current = true;
    startDragYRef.current = e.touches[0].clientY;
    startScrollTopRef.current = containerRef.current
      ? containerRef.current.scrollTop
      : 0;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (
        !isDraggingRef.current ||
        !containerRef.current ||
        moveEvent.touches.length === 0
      )
        return;
      const deltaY = moveEvent.touches[0].clientY - startDragYRef.current;
      const el = containerRef.current;
      const trackHeight = el.clientHeight;
      const scrollableRange = el.scrollHeight - el.clientHeight;
      const maxTop = trackHeight - thumbHeight;
      if (maxTop <= 0) return;
      const scrollDelta = (deltaY / maxTop) * scrollableRange;
      el.scrollTop = startScrollTopRef.current + scrollDelta;
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div className="relative pl-3.5 pr-0.5">
      <div
        id={id}
        ref={containerRef}
        onScroll={updateScrollbar}
        onWheel={(e) => {
          e.stopPropagation();
          if (containerRef.current) {
            containerRef.current.scrollTop += e.deltaY;
          }
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`h-[180px] max-h-[180px] overflow-y-scroll overflow-x-hidden space-y-2.5 pl-1.5 filter-scroll-list touch-pan-y ${className}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>

      {/* اسکرول‌بار ظریف ۳.۵ پیکسلی با نمایش دائمی در موبایل و دسکتاپ دقیقاً مطابق فیگما */}
      {isScrollable && (
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#f2f2f2] rounded-full cursor-pointer z-10 select-none"
          title="پیمایش لیست"
        >
          <div
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleThumbTouchStart}
            className="absolute left-0 w-[3.5px] bg-[#cdcdcd] hover:bg-[#b59766] active:bg-[#b59766] rounded-full cursor-grab active:cursor-grabbing transition-colors duration-150"
            style={{
              height: `${thumbHeight}px`,
              top: `${thumbTop}px`,
            }}
          />
        </div>
      )}
    </div>
  );
};

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
  onShowToast,
  onOpenLogin,
  isLoggedIn = false,
  userPhone = '۰۹۱۲۳۴۵۶۷۸۹',
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryTabItem>(
    () => resolveProductCategoryBySlug(getProductCategorySlugFromLocation())
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [active3DCards, setActive3DCards] = useState<Record<string, boolean>>({});
  const [cardFinishes, setCardFinishes] = useState<Record<string, FinishType>>({});

  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);
  const [notifyProduct, setNotifyProduct] = useState<ChandelierProduct | null>(null);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState<boolean>(false);
  const [pendingActionAfterLogin, setPendingActionAfterLogin] = useState<'notify' | 'comment' | null>(null);
  const [notifiedProducts, setNotifiedProducts] = useState<Record<string, boolean>>({});
  const [suggestionScores, setSuggestionScores] = useState<Record<string, number>>({
    item1: 5.0,
    item2: 4.7,
    item3: 1.5,
    item4: 3.2,
    item5: 4.7,
  });

  const toggleProductNotified = (productId: string) => {
    setNotifiedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  useEffect(() => {
    if (isLoggedIn && pendingActionAfterLogin) {
      const action = pendingActionAfterLogin;
      setPendingActionAfterLogin(null);
      if (action === 'comment') {
        setIsAddCommentModalOpen(true);
        setIsNotifyModalOpen(false);
      } else if (action === 'notify') {
        setIsNotifyModalOpen(true);
        setIsAddCommentModalOpen(false);
      }
    }
  }, [isLoggedIn, pendingActionAfterLogin]);

  const toggleCard3D = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActive3DCards((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const findProductBySlugOrCode = (
    slug: string | null | undefined
  ): ChandelierProduct | null => {
    if (!slug) return null;
    const clean = decodeURIComponent(slug).trim().toLowerCase();

    // If it's a category slug, it's not a product
    const isCategory =
      PRODUCT_CATEGORY_TABS.some(
        (cat) => cat.slug.toLowerCase() === clean
      ) ||
      clean === 'all' ||
      clean === 'categories' ||
      clean === 'category';
    if (isCategory) return null;

    // 1. Search in products prop
    let found = products.find(
      (p) =>
        p.id?.toLowerCase() === clean ||
        p.productCode?.toLowerCase() === clean ||
        (p as any).slug?.toLowerCase() === clean
    );
    if (found) return found;

    // 2. Search in SALEHI_COLLECTION_PRODUCTS
    found = SALEHI_COLLECTION_PRODUCTS.find(
      (p) =>
        p.id?.toLowerCase() === clean ||
        p.productCode?.toLowerCase() === clean ||
        p.slug?.toLowerCase() === clean
    );
    return found || null;
  };

  const [selectedProduct, setSelectedProduct] = useState<ChandelierProduct | null>(() => {
    const productSlug = getCurrentProductSlug();
    if (productSlug) {
      const found = findProductBySlugOrCode(productSlug);
      if (found) return found;
    }
    return null;
  });

  const navigateToProductDetail = (productId: string) => {
    const found = findProductBySlugOrCode(productId);
    if (found) {
      setSelectedProduct(found);
      setSelectedFinish(found.defaultFinish || 'original');
      setActiveSlideIdx(0);
      setQty(1);
    }
    if (typeof window !== 'undefined') {
      const targetUrl = `/product/${encodeURIComponent(productId)}`;
      try {
        window.history.pushState(
          { route: 'product', productCategorySlug: productId },
          '',
          targetUrl
        );
      } catch {
        window.location.hash = `#/product/${encodeURIComponent(productId)}`;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateBackToProducts = () => {
    setSelectedProduct(null);
    if (typeof window !== 'undefined') {
      const targetUrl = '/product';
      try {
        window.history.pushState(
          { route: 'product', productCategorySlug: null },
          '',
          targetUrl
        );
      } catch {
        window.location.hash = '#/product';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [isProductLightboxOpen, setIsProductLightboxOpen] = useState<boolean>(false);
  const [productLightboxIdx, setProductLightboxIdx] = useState<number>(0);
  const [selectedFinish, setSelectedFinish] = useState<FinishType>('original');
  const [qty, setQty] = useState<number>(1);

  const similarCarouselRef = useRef<HTMLDivElement | null>(null);
  const similarDesktopIndexRef = useRef<number>(0);
  const isSimilarButtonScrollingRef = useRef<boolean>(false);
  const similarButtonScrollTimeoutRef = useRef<number | null>(null);

  const handleSimilarCarouselScroll = () => {
    if (isSimilarButtonScrollingRef.current) return;
    const container = similarCarouselRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-card="true"]')
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
    similarDesktopIndexRef.current = closestIdx;
  };

  const scrollSimilarCarousel = (direction: 'next' | 'prev') => {
    const container = similarCarouselRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-card="true"]')
    ).filter((el) => el.offsetParent !== null);
    if (cards.length === 0) return;

    const visibleCount = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1;
    const maxStartIndex = Math.max(0, cards.length - visibleCount);

    let nextIndex = similarDesktopIndexRef.current;
    if (direction === 'next') {
      nextIndex = nextIndex >= maxStartIndex ? 0 : nextIndex + 1;
    } else {
      nextIndex = nextIndex <= 0 ? maxStartIndex : nextIndex - 1;
    }
    similarDesktopIndexRef.current = nextIndex;

    const targetCard = cards[nextIndex];
    if (!targetCard) return;

    isSimilarButtonScrollingRef.current = true;
    if (similarButtonScrollTimeoutRef.current) {
      window.clearTimeout(similarButtonScrollTimeoutRef.current);
    }
    similarButtonScrollTimeoutRef.current = window.setTimeout(() => {
      isSimilarButtonScrollingRef.current = false;
    }, 550);

    const containerRight = container.getBoundingClientRect().right;
    const targetRight = targetCard.getBoundingClientRect().right;
    const deltaX = targetRight - containerRight;

    container.scrollBy({
      left: deltaX,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (selectedProduct) {
      setSelectedFinish(selectedProduct.defaultFinish || 'original');
      setActiveSlideIdx(0);
      setQty(1);
      similarDesktopIndexRef.current = 0;
      if (similarCarouselRef.current) {
        similarCarouselRef.current.scrollTo({ left: 0, behavior: 'instant' });
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedProduct]);

  // ساخت آواتارهای وکتور تضمینی با گرادینت لوکس و حروف اول نام کاربر
  const makeAvatarSvg = (initials: string, bg1: string, bg2: string) => {
    const cleanId = encodeURIComponent(initials.trim().replace(/\s+/g, '_'));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g_${cleanId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#g_${cleanId})"/>
      <circle cx="50" cy="38" r="17" fill="rgba(255,255,255,0.85)"/>
      <path d="M22 84 C22 62 78 62 78 84 Z" fill="rgba(255,255,255,0.85)"/>
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2.5"/>
      <text x="50" y="55" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="13" fill="${bg1}">${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  // نظرات کاربران درباره محصول با ترتیب جدیدترین در بالا و قدیمی‌ترین در پایین
  const [activeCommentPage, setActiveCommentPage] = useState<number>(0);
  const [commentSlideDir, setCommentSlideDir] = useState<'next' | 'prev'>('next');
  const [commentModalTab, setCommentModalTab] = useState<'rating' | 'description'>('rating');
  const [commentRatingStarsOpen, setCommentRatingStarsOpen] = useState<boolean>(true);
  const [commentRecommendationOpen, setCommentRecommendationOpen] = useState<boolean>(false);
  const [selectedCommentStar, setSelectedCommentStar] = useState<number>(5);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('yes');
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState<boolean>(false);
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCommentRating, setNewCommentRating] = useState<number>(5);
  const [commentToast, setCommentToast] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const ratingCardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ratingCardHeight, setRatingCardHeight] = useState<number | undefined>(undefined);
  const [currentScrollOffset, setCurrentScrollOffset] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      if (ratingCardRef.current && window.innerWidth >= 1024) {
        setRatingCardHeight(ratingCardRef.current.offsetHeight);
      } else {
        setRatingCardHeight(undefined);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const updateOffset = () => {
      if (cardRefs.current[activeCommentPage]) {
        setCurrentScrollOffset(cardRefs.current[activeCommentPage]?.offsetTop || 0);
      }
    };
    // اجرای به‌روزرسانی آفست با تاخیر فریم برای دقت در رندر کامل
    const rafId = requestAnimationFrame(updateOffset);
    window.addEventListener('resize', updateOffset);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateOffset);
    };
  }, [activeCommentPage]);

  const [commentItems, setCommentItems] = useState([
    {
      id: 'c1',
      name: 'ساشا آذرخش آلوچه',
      date: 'تاریخ نظر دهی : ۱۳ شهریور ماه ۱۴۰۳',
      time: 'ساعت ۱۴:۲۵',
      rating: '۴.۳',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      avatarSvg: makeAvatarSvg('س.آ', '#8b5cf6', '#6d28d9'),
      content:
        'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.',
    },
    {
      id: 'c2',
      name: 'پرهام رحیمی',
      date: 'تاریخ نظر دهی : ۲۴ آبان ماه ۱۴۰۳',
      time: 'ساعت ۱۴:۲۵',
      rating: '۴.۳',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      avatarSvg: makeAvatarSvg('پ.ر', '#b58c5e', '#8c673d'),
      content:
        'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم',
    },
    {
      id: 'c3',
      name: 'مهندس کیانوش علیزاده',
      date: 'تاریخ نظر دهی : ۲۸ تیر ماه ۱۴۰۳',
      time: 'ساعت ۱۱:۱۵',
      rating: '۴.۹',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      avatarSvg: makeAvatarSvg('ک.ع', '#0284c7', '#0369a1'),
      content:
        'طراحی این مدل به شدت با دکوراسیون کلاسیک و مدرن منزل ما همخوانی داشت. خدمات پشتیبانی و مشاوره قبل از خرید بسیار حرفه‌ای و صبورانه بود. تشکر ویژه از تیم تولید و گارانتی معتبر مجموعه صالحی.',
    },
    {
      id: 'c4',
      name: 'دکتر نیلوفر سپهری',
      date: 'تاریخ نظر دهی : ۱۶ خرداد ماه ۱۴۰۳',
      time: 'ساعت ۲۰:۱۰',
      rating: '۴.۶',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      avatarSvg: makeAvatarSvg('ن.س', '#059669', '#047857'),
      content:
        'جنس برنج و آبکاری طلایی مات بعد از چند ماه استفاده همچنان کیفیت و درخشش روز اول رو حفظ کرده و هیچ‌گونه تغییر رنگ یا کدر شدنی نداشته. حتما خریدش رو به دوستانی که دنبال کار لوکس و ماندگار هستند پیشنهاد می‌کنم.',
    },
    {
      id: 'c5',
      name: 'علیرضا کریمی',
      date: 'تاریخ نظر دهی : ۱۹ اردیبهشت ماه ۱۴۰۳',
      time: 'ساعت ۰۹:۴۵',
      rating: '۴.۲',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      avatarSvg: makeAvatarSvg('ع.ک', '#d97706', '#b45309'),
      content:
        'هماهنگی برای ارسال در ساعت مشخص شده بسیار دقیق بود. بسته‌بندی چندلایه با فوم‌های ضربه‌گیر باعث شد با خیال راحت در شهرستان تحویل بگیرم. ممنون از توجه ویژه به رضایت مشتری.',
    },
    {
      id: 'c6',
      name: 'زهرا صادقیان',
      date: 'تاریخ نظر دهی : ۴ فروردین ماه ۱۴۰۳',
      time: 'ساعت ۱۸:۳۰',
      rating: '۴.۷',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      avatarSvg: makeAvatarSvg('ز.ص', '#db2777', '#be185d'),
      content:
        'یک خرید کاملاً مطمئن و با اصالت. نوردهی فوق‌العاده یکدست بدون پرش نوری داره و کریستال‌های تراش‌خورده جلوه بی‌نظیری به سالن پذیرایی داده است.',
    },
  ]);

  const totalCommentPages = Math.max(1, commentItems.length - 2);

  const handlePrevCommentPage = () => {
    if (activeCommentPage > 0) {
      setCommentSlideDir('prev');
      setActiveCommentPage((prev) => prev - 1);
    }
  };

  const handleNextCommentPage = () => {
    const totalPages = Math.max(1, commentItems.length - 2);
    if (activeCommentPage < totalPages - 1) {
      setCommentSlideDir('next');
      setActiveCommentPage((prev) => prev + 1);
    }
  };

  const handleSelectCommentDot = (pageIdx: number) => {
    if (pageIdx !== activeCommentPage) {
      setCommentSlideDir(pageIdx > activeCommentPage ? 'next' : 'prev');
      setActiveCommentPage(pageIdx);
    }
  };

  const handleSubmitNewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const initials = newCommentName.trim().slice(0, 2);
    const newObj = {
      id: `c-new-${Date.now()}`,
      name: newCommentName.trim(),
      date: 'تاریخ نظر دهی : ۲۷ مهرماه ۱۴۰۵',
      time: 'ساعت ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      rating: newCommentRating.toFixed(1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      avatarSvg: makeAvatarSvg(initials, '#b58c5e', '#8c673d'),
      content: newCommentText.trim(),
    };

    setCommentItems((prev) => [newObj, ...prev]);
    setNewCommentName('');
    setNewCommentText('');
    setNewCommentRating(5);
    setIsAddCommentModalOpen(false);
    setCommentSlideDir('next');
    setActiveCommentPage(0);
    setCommentToast('نظر شما با موفقیت ثبت شد و در بالای نظرات قرار گرفت.');
    setTimeout(() => setCommentToast(null), 4000);
  };

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

  const [filterSettings, setFilterSettings] = useState<ProductFilterSettingsConfig>(() => {
    try {
      const db = loadLocalDb();
      return db.productFilterSettings || INITIAL_PRODUCT_FILTER_SETTINGS;
    } catch {
      return INITIAL_PRODUCT_FILTER_SETTINGS;
    }
  });

  useEffect(() => {
    const updateFilterConfig = (e?: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && (detail.models || detail.materials || detail.colors)) {
        setFilterSettings(detail);
      } else {
        const db = loadLocalDb();
        setFilterSettings(db.productFilterSettings || INITIAL_PRODUCT_FILTER_SETTINGS);
      }
    };
    window.addEventListener('app-filter-settings-updated', updateFilterConfig as EventListener);
    window.addEventListener('storage', updateFilterConfig as EventListener);
    return () => {
      window.removeEventListener('app-filter-settings-updated', updateFilterConfig as EventListener);
      window.removeEventListener('storage', updateFilterConfig as EventListener);
    };
  }, []);

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
    scrollToTopImmediate();
  }, [activeCategory.slug]);

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

      // When category changes, user is viewing category catalog, NOT a product detail
      if (customSlug !== undefined) {
        setSelectedProduct(null);
      } else {
        const prodSlug = getCurrentProductSlug();
        const found = prodSlug ? findProductBySlugOrCode(prodSlug) : null;
        setSelectedProduct(found);
      }
      scrollToTopImmediate();
    };

    const syncProductFromUrl = (e?: Event) => {
      const customSlug = (e as CustomEvent<string | null>)?.detail;
      const prodSlug =
        customSlug !== undefined
          ? customSlug
          : getCurrentProductSlug();
      const found = prodSlug ? findProductBySlugOrCode(prodSlug) : null;
      setSelectedProduct(found);
      if (found) {
        setSelectedFinish(found.defaultFinish || 'original');
      }
      scrollToTopImmediate();
    };

    window.addEventListener('popstate', syncCategoryFromUrl);
    window.addEventListener('hashchange', syncCategoryFromUrl);
    window.addEventListener(
      'app-product-category-change',
      syncCategoryFromUrl as EventListener
    );
    window.addEventListener(
      'app-product-slug-change',
      syncProductFromUrl as EventListener
    );

    return () => {
      window.removeEventListener('popstate', syncCategoryFromUrl);
      window.removeEventListener('hashchange', syncCategoryFromUrl);
      window.removeEventListener(
        'app-product-category-change',
        syncCategoryFromUrl as EventListener
      );
      window.removeEventListener(
        'app-product-slug-change',
        syncProductFromUrl as EventListener
      );
      if (filterCalcTimeoutRef.current) {
        window.clearTimeout(filterCalcTimeoutRef.current);
      }
    };
  }, [products]);

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

  const handleViewAndBuyClick = (
    product: ChandelierProduct,
    finish?: FinishType,
    _isOut = false
  ) => {
    setSelectedProduct(product);
    if (finish) {
      setSelectedFinish(finish);
    } else if (product.defaultFinish) {
      setSelectedFinish(product.defaultFinish);
    }
    setActiveSlideIdx(0);
    setQty(1);

    if (typeof window !== 'undefined') {
      const targetUrl = `/product/${encodeURIComponent(product.id)}`;
      try {
        window.history.pushState(
          { route: 'product', productCategorySlug: product.id },
          '',
          targetUrl
        );
      } catch {
        window.location.hash = `#/product/${encodeURIComponent(product.id)}`;
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
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

  const modelOptionsList =
    filterSettings?.models && filterSettings.models.length >= INITIAL_PRODUCT_FILTER_SETTINGS.models.length
      ? filterSettings.models
      : INITIAL_PRODUCT_FILTER_SETTINGS.models;
  const materialOptionsList =
    filterSettings?.materials && filterSettings.materials.length >= INITIAL_PRODUCT_FILTER_SETTINGS.materials.length
      ? filterSettings.materials
      : INITIAL_PRODUCT_FILTER_SETTINGS.materials;
  const colorOptionsList =
    filterSettings?.colors && filterSettings.colors.length >= INITIAL_PRODUCT_FILTER_SETTINGS.colors.length
      ? filterSettings.colors
      : INITIAL_PRODUCT_FILTER_SETTINGS.colors;

  const filteredModelOptions = modelOptionsList.filter((opt) =>
    opt.label.toLowerCase().includes(modelSearchQuery.trim().toLowerCase())
  );

  const filteredColorOptions = colorOptionsList.filter((opt) =>
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
        const foundOpt = modelOptionsList.find((opt) => opt.id === modelId);
        if (foundOpt && foundOpt.label) {
          const labelClean = foundOpt.label.toLowerCase().replace(/لوستر\s*/g, '').trim();
          if (labelClean && text.includes(labelClean)) return true;
        }
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
        const foundOpt = materialOptionsList.find((opt) => opt.id === matId);
        if (foundOpt && foundOpt.label) {
          const labelClean = foundOpt.label.toLowerCase().trim();
          if (labelClean && (text.includes(labelClean) || (product.bodyMaterial && product.bodyMaterial.toLowerCase().includes(labelClean)))) return true;
        }
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
        const foundOpt = colorOptionsList.find((opt) => opt.id === colorId);
        if (foundOpt && foundOpt.label) {
          const labelClean = foundOpt.label.toLowerCase().trim();
          if (labelClean && text.includes(labelClean)) return true;
        }
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
              <FilterScrollContainer
                id="filter-model-scroll-list"
                innerRef={modelListRef}
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
              </FilterScrollContainer>
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
          <div className="pb-3.5 pt-0.5">
            <FilterScrollContainer id="filter-material-scroll-list">
              {materialOptionsList.map((opt) => {
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
            </FilterScrollContainer>
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
              <FilterScrollContainer
                id="filter-color-scroll-list"
                innerRef={colorListRef}
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
              </FilterScrollContainer>
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
      <style>{`
        .filter-scroll-list {
          height: 180px !important;
          max-height: 180px !important;
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .filter-scroll-list::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
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
      <style>{`
        .mobile-filter-modal-scroll,
        div#root:nth-of-type(1) > div#top:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .mobile-filter-modal-scroll::-webkit-scrollbar,
        div#root:nth-of-type(1) > div#top:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2)::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .filter-scroll-list,
        #filter-model-scroll-list,
        #filter-material-scroll-list,
        #filter-color-scroll-list {
          height: 180px !important;
          max-height: 180px !important;
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .filter-scroll-list::-webkit-scrollbar,
        #filter-model-scroll-list::-webkit-scrollbar,
        #filter-material-scroll-list::-webkit-scrollbar,
        #filter-color-scroll-list::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
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
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-1 mobile-filter-modal-scroll">
        {renderFilterSectionsList()}
      </div>

      {/* نوار ثابت پایین صفحه فیلتر موبایل: دکمه قرمز «حذف فیلتر» در راست و دکمه تیره در چپ */}
      <div className="px-5 py-4 bg-white flex items-center justify-between gap-4 shrink-0">
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
    const maxVisible = 3;
    let startPage = Math.max(1, Math.min(currentPage - 1, totalPages - maxVisible + 1));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    const visiblePageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePageNumbers.push(i);
    }

    return (
      <div
        dir="ltr"
        className={`${className} flex items-center justify-center gap-2 select-none`}
      >
        {/* دکمه چپ (<): بازگشت به صفحه قبلی */}
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          aria-label="صفحه قبلی"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#efefef] hover:bg-[#e3e3e3] disabled:opacity-45 text-[#444444] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* دکمه‌های شماره صفحات به عدد (۱، ۲، ۳ و الی آخر) */}
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

        {/* دکمه راست (>): رفتن به صفحه بعدی */}
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          aria-label="صفحه بعدی"
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

  const renderProductDetailPage = (product: ChandelierProduct) => {
    const toPersianDigits = (str: string | number) => {
      return String(str).replace(/\d/g, (x) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(x)]);
    };

    // محاسبه قیمت کل با ضرب قیمت واحد محصول در تعداد (Qty)
    const unitPriceNumeric = (() => {
      if (typeof product.priceNumeric === 'number' && product.priceNumeric > 0) {
        return product.priceNumeric;
      }
      const rawDigits = String(product.priceFormatted || '')
        .replace(/[۰-۹]/g, (ch) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(ch)))
        .replace(/[^\d]/g, '');
      const parsed = parseInt(rawDigits, 10);
      return !isNaN(parsed) && parsed > 0 ? parsed : 11800000;
    })();

    const calculatedTotalPrice = unitPriceNumeric * qty;
    const formattedTotalPrice = `${toPersianDigits(calculatedTotalPrice.toLocaleString('fa-IR'))} تومان`;

    const handleAdd = () => {
      for (let i = 0; i < qty; i++) {
        onAddToCart(product);
      }
    };

    const galleryPhotos = [
      { type: 'image' as const, url: GENERATED_IMAGES.projectRoyalRestaurant },
      { type: 'video' as const, url: 'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4', poster: GENERATED_IMAGES.projectLobbyHotel },
      { type: 'image' as const, url: GENERATED_IMAGES.projectMosqueDome },
      { type: 'image' as const, url: GENERATED_IMAGES.projectFereshteh },
    ];

    const slideItems = [
      { type: '3d' as const, url: product.image },
      ...galleryPhotos,
    ];

    const CustomVerifyIcon = () => (
      <Verify size="28" color="#b59766" variant="Linear" className="shrink-0" />
    );

    const CustomHashtagUpIcon = () => (
      <HashtagUp size="28" color="#b59766" variant="Linear" className="shrink-0" />
    );

    const CustomLayerIcon = () => (
      <Layer size="28" color="#b59766" variant="Linear" className="shrink-0" />
    );

    const CustomRulerIcon = () => (
      <Ruler size="28" color="#b59766" variant="Linear" className="shrink-0" />
    );

    const CustomPlayDuotoneIcon: React.FC<{ className?: string }> = ({
      className = 'w-8 h-8 sm:w-9 sm:h-9',
    }) => (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* بخش اصلی سفید در بالا-چپ مثلث پخش */}
        <path
          d="M9.5 11.2C9.5 7.7 13.3 5.5 16.3 7.3L26.6 13.3C27.5 13.8 28.1 14.6 28.4 15.5L10.2 26.1C9.7 25.3 9.5 24.3 9.5 23.2V11.2Z"
          fill="#ffffff"
        />
        {/* نوار سایه خاکستری در لبه پایین-راست با فاصله مورب دقیقاً مطابق play.png */}
        <path
          d="M12.1 27.9L28.8 18.1C28.7 19.4 28.0 20.6 26.6 21.4L16.3 27.4C14.8 28.3 13.2 28.4 12.1 27.9Z"
          fill="#ffffff"
          fillOpacity="0.48"
        />
      </svg>
    );

    // سایر محصولات به عنوان محصولات مشابه (تعداد افزایش یافته جهت فعال‌سازی کاروسل و تست دکمه‌ها)
    const baseSimilar = products.filter((p) => p.id !== product.id);
    const fallbackList = SALEHI_COLLECTION_PRODUCTS.filter((p) => p.id !== product.id);
    const combinedSimilar = [
      ...baseSimilar,
      ...fallbackList.filter((fb) => !baseSimilar.some((p) => p.id === fb.id)),
    ];
    // تعداد ۱۲ محصول برای کاروسل با قابلیت جابجایی و تست روان
    const similarProducts = combinedSimilar.length > 4 ? combinedSimilar.slice(0, 12) : combinedSimilar;
    const isOutOfStock = Boolean(product.outOfStock || (typeof window !== 'undefined' && window.innerWidth < 640 && product.mobileOutOfStock));

    return (
      <div className="w-full min-h-screen bg-[#fcfbf9] text-[#222222] font-medium py-6 sm:py-10 pb-20 px-4 sm:px-8 lg:px-14 xl:px-20" dir="rtl">
        {/* بخش اول: اطلاعات و خرید محصول (سمت راست) + گالری عکس (سمت چپ) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12" dir="ltr">

          {/* ۱. ستون گالری عکس (سمت چپ) - ۵ ستون */}
          <div className="lg:col-span-5 space-y-4 w-full" dir="rtl">
            <div className="relative w-full h-[320px] sm:h-[400px] md:h-[440px] rounded-2xl bg-[#f9f9f9] border border-[#E4E5E7] overflow-hidden shadow-xs flex items-center justify-center group">
              {activeSlideIdx === 0 ? (
                <div className="w-full h-full relative">
                  <Chandelier3DViewer
                    modelType={product.modelType}
                    imageUrl={product.image}
                    initialFinish={selectedFinish}
                    onFinishChange={(fin) => setSelectedFinish(fin)}
                    initialTheme="light"
                    className="w-full h-full"
                  />
                  {/* لیبل راهنمای سه‌بعدی */}
                  <span className="absolute bottom-3 left-3 bg-[#2b2b2b]/85 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg pointer-events-none select-none font-bold">
                    چرخش ۳۶۰ درجه فعال است 🌟
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (slideItems[activeSlideIdx].type === 'image') {
                      setProductLightboxIdx(activeSlideIdx - 1);
                      setIsProductLightboxOpen(true);
                    }
                  }}
                  className="w-full h-full flex items-center justify-center cursor-pointer relative"
                >
                  {slideItems[activeSlideIdx].type === 'video' ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <video
                        src={slideItems[activeSlideIdx].url}
                        poster={slideItems[activeSlideIdx].poster}
                        playsInline
                        className="w-full h-full object-cover object-center"
                      />
                      {/* دکمه دایره‌ای شیشه‌ای وسط صفحه با آیکون دقیق پلی پروژه */}
                      <button
                        type="button"
                        onClick={() => {}}
                        aria-label="پخش ویدیو"
                        className="absolute z-20 w-[78px] h-[78px] sm:w-[88px] sm:h-[88px] rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-md border-[1.5px] border-white/85 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                      >
                        <CustomPlayDuotoneIcon className="w-8 h-8 sm:w-9 sm:h-9 translate-x-0.5" />
                      </button>

                      {/* نوار کنترل پایین ویدیو (چپ به راست دقیقاً مطابق پروژه) */}
                      <div
                        dir="ltr"
                        className="absolute bottom-9 sm:bottom-11 inset-x-5 sm:inset-x-7 z-20 flex items-center gap-3.5 sm:gap-4 text-white"
                      >
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveSlideIdx((prev) => (prev <= 0 ? slideItems.length - 1 : prev - 1))}
                            className="hover:opacity-80 cursor-pointer"
                            aria-label="قبلی"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <rect x="4" y="5" width="2.4" height="14" rx="1" />
                              <path d="M18.5 5.8C19.3 5.3 20.2 5.9 20.2 6.8V17.2C20.2 18.1 19.3 18.7 18.5 18.2L9.8 13C9.1 12.5 9.1 11.5 9.8 11L18.5 5.8Z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => {}}
                            className="hover:opacity-80 cursor-pointer"
                            aria-label="پخش یا توقف"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <rect x="6" y="5" width="4" height="14" rx="1" />
                              <rect x="14" y="5" width="4" height="14" rx="1" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSlideIdx((prev) => (prev >= slideItems.length - 1 ? 0 : prev + 1))}
                            className="hover:opacity-80 cursor-pointer"
                            aria-label="بعدی"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <rect x="17.6" y="5" width="2.4" height="14" rx="1" />
                              <path d="M5.5 5.8C4.7 5.3 3.8 5.9 3.8 6.8V17.2C3.8 18.1 4.7 18.7 5.5 18.2L14.2 13C14.9 12.5 14.9 11.5 14.2 11L5.5 5.8Z" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex-1 h-[4.5px] rounded-full bg-white/40 overflow-hidden cursor-pointer">
                          <div className="h-full bg-white rounded-full transition-all duration-200 w-1/3" />
                        </div>

                        <button
                          type="button"
                          onClick={() => {}}
                          className="hover:opacity-80 cursor-pointer shrink-0"
                          aria-label="صدا"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <OptimizedImage
                      src={slideItems[activeSlideIdx].url}
                      alt={`${product.name} نمای گالری ${activeSlideIdx}`}
                      loading="eager"
                      options={{ width: 900, quality: 85 }}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>
              )}

              {/* دکمه‌های ناوبری چپ و راست روی تصویر شاخص دقیقاً مطابق طرح */}
              <button
                type="button"
                onClick={() => setActiveSlideIdx((prev) => (prev <= 0 ? slideItems.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/70 hover:bg-[#2b2b2b] text-[#2b2b2b] hover:text-white transition-all flex items-center justify-center shadow-xs cursor-pointer z-20"
                aria-label="عکس قبلی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSlideIdx((prev) => (prev >= slideItems.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/70 hover:bg-[#2b2b2b] text-[#2b2b2b] hover:text-white transition-all flex items-center justify-center shadow-xs cursor-pointer z-20"
                aria-label="عکس بعدی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              </div>

            {/* بندانگشتی‌های ۵گانه ثابت گالری با 3D در اولی */}
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
              {slideItems.map((item, index) => {
                const isSelected = activeSlideIdx === index;
                const thumbSrc = item.type === '3d' ? product.image : (item.type === 'video' ? (item.poster || item.url) : item.url);
                return (
                  <button
                    key={`detail-thumb-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveSlideIdx(index);
                      if (index > 0 && item.type === 'image') {
                        setProductLightboxIdx(index - 1);
                        setIsProductLightboxOpen(true);
                      }
                    }}
                    className={`relative rounded-[11px] sm:rounded-[12px] h-[58px] sm:h-[72px] md:h-[82px] bg-white border-2 transition-all cursor-pointer flex items-center justify-center p-0 overflow-hidden ${
                      isSelected
                        ? 'border-[#b59766] ring-2 ring-[#b59766]/30 shadow-xs'
                        : 'border-[#D9D9D9] hover:border-[#b59766]/60'
                    }`}
                  >
                    <OptimizedImage
                      src={thumbSrc}
                      alt={index === 0 ? 'نمای سه‌بعدی محصول' : 'محیط اجرایی گالری'}
                      loading="eager"
                      options={{ width: 300, quality: 85 }}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover object-center rounded-[9px] sm:rounded-[10px]"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-1 right-1 bg-[#b59766] text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-black shadow-xs z-10">
                        3D
                      </span>
                    )}
                    {item.type === 'video' && (
                      <span className="absolute inset-0 bg-black/35 flex items-center justify-center z-10">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۲. ستون اطلاعات و خرید محصول (سمت راست) - ۷ ستون */}
          <div className="lg:col-span-7 flex flex-col justify-start space-y-6 text-right w-full" dir="rtl">
            {/* سربرگ اطلاعات متنی بالا */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] leading-tight">
                {product.name === 'لوستر رسانس' ? 'لوستر کریستالی ملکه ۵ شاخه' : product.name}
              </h2>
              
              <p className="text-xs sm:text-[13px] leading-7 text-[#777777] text-justify mt-4">
                <span className="text-xs font-bold text-[#b58c56] inline-flex items-center gap-1.5 ml-2.5 select-none">
                  <span>مناسب کلاسیک پذیرایی</span>
                  <span className="text-[#E4E5E7]">|</span>
                  <span>کلاسیک خواب</span>
                  <span className="text-[#E4E5E7] font-normal mr-0.5">-</span>
                </span>
                نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود.
              </p>
            </div>

            {/* گرید داخلی دو ستونه مجزا برای مشخصات و خرید بر اساس طرح دقیق عکس فیگما */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1.5 items-stretch">

              {/* ب. کارت مشخصات اصلی لوستر (ستون راست) - ۵ ستون با فواصل یکنواخت و فراخ */}
              <div className="md:col-span-5 bg-white rounded-xl border border-[#E4E5E7] p-6 sm:p-7 shadow-2xs text-right flex flex-col justify-between h-full min-h-[340px] space-y-5 sm:space-y-6">
                
                {/* مدل */}
                <div className="flex items-center gap-4 py-1">
                  <div className="w-12 h-12 rounded-xl bg-[#f6f3ee] flex items-center justify-center shrink-0 border border-[#E4E5E7] shadow-3xs">
                    <CustomVerifyIcon />
                  </div>
                  <div className="flex flex-col justify-center space-y-1 min-w-0">
                    <span className="block text-[13px] sm:text-[14px] font-medium text-[#777777]">مدل :</span>
                    <span className="block text-xs sm:text-[13px] font-semibold text-[#1a1a1a] leading-tight truncate">
                      {product.name === 'لوستر رسانس' ? 'ملکه کریستالی برزنت ایتالیایی' : product.name}
                    </span>
                  </div>
                </div>

                {/* کد محصول */}
                <div className="flex items-center gap-4 py-1">
                  <div className="w-12 h-12 rounded-xl bg-[#f6f3ee] flex items-center justify-center shrink-0 border border-[#E4E5E7] shadow-3xs">
                    <CustomHashtagUpIcon />
                  </div>
                  <div className="flex flex-col justify-center space-y-1 min-w-0">
                    <span className="block text-[13px] sm:text-[14px] font-medium text-[#777777]">کد محصول :</span>
                    <span className="block text-xs sm:text-[13px] font-semibold text-[#1a1a1a] leading-tight tabular-nums">
                      به شماره انبار {product.productCode === '۱۲۸۹۸۵' ? '۱۲۸۵۷۹' : product.productCode}
                    </span>
                  </div>
                </div>

                {/* جنس بدنه */}
                <div className="flex items-center gap-4 py-1">
                  <div className="w-12 h-12 rounded-xl bg-[#f6f3ee] flex items-center justify-center shrink-0 border border-[#E4E5E7] shadow-3xs">
                    <CustomLayerIcon />
                  </div>
                  <div className="flex flex-col justify-center space-y-1 min-w-0">
                    <span className="block text-[13px] sm:text-[14px] font-medium text-[#777777]">جنس بدنه :</span>
                    <span className="block text-xs sm:text-[13px] font-semibold text-[#1a1a1a] leading-tight">
                      {product.bodyMaterial || 'برنج'}
                    </span>
                  </div>
                </div>

                {/* ابعاد */}
                <div className="flex items-center gap-4 py-1">
                  <div className="w-12 h-12 rounded-xl bg-[#f6f3ee] flex items-center justify-center shrink-0 border border-[#E4E5E7] shadow-3xs">
                    <CustomRulerIcon />
                  </div>
                  <div className="flex flex-col justify-center space-y-1 min-w-0">
                    <span className="block text-[13px] sm:text-[14px] font-medium text-[#777777]">ابعاد :</span>
                    <span className="block text-xs sm:text-[13px] font-semibold text-[#1a1a1a] leading-tight tabular-nums">
                      {product.dimensions || 'H49 * D20'}
                    </span>
                  </div>
                </div>

              </div>
              
              {/* الف. ستون خرید شامل دو کارت مجزای بالا و پایین عطف به تصویر فیگما */}
              <div className="md:col-span-7 flex flex-col gap-3 text-right justify-start">
                
                {/* کارت اول: ثبت تعداد محصول */}
                <div className="bg-white rounded-xl border border-[#E4E5E7] px-5 py-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex flex-col justify-center gap-1">
                    <span className="block text-sm font-semibold text-[#1a1a1a]">تعداد محصول :</span>
                    <span className="block text-xs text-[#777777] font-medium">
                      * حداکثر ۱۲ عدد و حداقل ۱ عدد میباشد
                    </span>
                  </div>
                  
                  {/* کنترلر تعداد با دکمه‌های آیکون‌ساکس مجزا و وسط مشکی */}
                  <div className="flex items-center gap-3 bg-[#f6f3ee] px-3.5 py-1.5 rounded-xl select-none border border-[#E4E5E7]">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(12, q + 1))}
                      disabled={isOutOfStock || qty >= 12}
                      aria-label="افزایش تعداد"
                      className={`transition-colors focus:outline-none flex items-center justify-center p-0.5 ${
                        isOutOfStock || qty >= 12
                          ? 'opacity-30 cursor-not-allowed text-[#999]'
                          : 'text-[#1a1a1a] hover:text-[#b59766] cursor-pointer'
                      }`}
                    >
                      <AddSquare size="26" color={isOutOfStock || qty >= 12 ? '#999999' : '#1a1a1a'} variant="Linear" className="shrink-0" />
                    </button>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm tabular-nums shadow-xs select-none ${
                      isOutOfStock ? 'bg-[#c5c5c5] text-[#666666]' : 'bg-[#2b2b2b] text-white'
                    }`}>
                      {toPersianDigits(isOutOfStock ? 0 : qty)}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={isOutOfStock || qty <= 1}
                      aria-label="کاهش تعداد"
                      className={`transition-colors focus:outline-none flex items-center justify-center p-0.5 ${
                        isOutOfStock || qty <= 1
                          ? 'opacity-30 cursor-not-allowed text-[#999]'
                          : 'text-[#1a1a1a] hover:text-[#b59766] cursor-pointer'
                      }`}
                    >
                      <MinusSquare size="26" color={isOutOfStock || qty <= 1 ? '#999999' : '#1a1a1a'} variant="Linear" className="shrink-0" />
                    </button>
                  </div>
                </div>

                {/* کارت دوم: رنگ، قیمت و افزودن به سبد خرید */}
                <div className="bg-white rounded-xl border border-[#E4E5E7] px-4.5 py-4 flex flex-col shadow-2xs space-y-3">
                  
                  {/* ردیف رنگ‌ها و ۳ دکمه نمادین فیگما با آیکون‌های رسمی Iconsax */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-start gap-2 pt-2">
                      <span className="block text-sm font-semibold text-[#1a1a1a]">رنگ :</span>
                      <div className="flex items-center gap-2">
                        {(Object.keys(FINISH_PRESETS) as FinishType[]).slice(0, 5).map((fKey) => {
                          const cfg = FINISH_PRESETS[fKey];
                          const isActive = selectedFinish === fKey;
                          return (
                            <div key={fKey} className="relative group/swatch">
                              {/* تولتیپ مشکی با رادیوس کمتر و فاصله مناسب از کادر */}
                              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/swatch:opacity-100 pointer-events-none transition-all duration-200 z-30 flex flex-col items-center">
                                <div className="bg-[#323232] text-white text-[11.5px] font-bold px-3.5 py-2 rounded-[7px] shadow-md whitespace-nowrap leading-none flex items-center justify-center">
                                  {cfg.label}
                                </div>
                                <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#323232] -mt-[0.5px]" />
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedFinish(fKey)}
                                style={{ background: cfg.swatch }}
                                className={`w-6.5 h-6.5 rounded-full border transition-all cursor-pointer ${
                                  isActive
                                    ? 'ring-2 ring-[#b59766] scale-115 border-white shadow-2xs'
                                    : 'border-black/15 hover:scale-105'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setProductLightboxIdx(0);
                          setIsProductLightboxOpen(true);
                        }}
                        className="group w-12 h-12 rounded-[14px] bg-[#f6f6f6] hover:bg-[#71747d] text-[#1a1a1a] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
                      >
                        <SearchNormal size="22" color="currentColor" variant="Linear" className="transition-colors" />
                      </button>
                      <button
                        type="button"
                        className="group w-12 h-12 rounded-[14px] bg-[#f6f6f6] hover:bg-[#b58c5e] text-[#1a1a1a] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
                      >
                        <Archive size="22" color="currentColor" variant="Linear" className="transition-colors" />
                      </button>
                      <button
                        type="button"
                        className="group w-12 h-12 rounded-[14px] bg-[#f6f6f6] hover:bg-[#b58c5e] text-[#1a1a1a] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
                      >
                        <Share size="22" color="currentColor" variant="Linear" className="transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* خط جداکننده افقی توسی کم‌رنگ و تمیز */}
                  <div className="h-px bg-[#eaeaea] w-full my-3" />

                  {/* ردیف قیمت در سمت راست و دکمه سبد خرید در سمت چپ */}
                  <div className="flex items-center justify-between gap-3">
                    {/* قیمت در سمت راست */}
                    <div className="text-right flex flex-col justify-center leading-tight">
                      <span className="block text-sm font-semibold text-[#1a1a1a]">قیمت :</span>
                      <span className="text-[17px] sm:text-[18px] font-bold text-[#1a1a1a] tabular-nums mt-1 transition-all duration-200">
                        {formattedTotalPrice}
                      </span>
                    </div>

                    {/* دکمه سبد خرید در سمت چپ / دکمه قرمز «موجود شد خبرم کنید» با آیکون NotificationBing در سمت چپ */}
                    {isOutOfStock ? (
                      <button
                        type="button"
                        dir="rtl"
                        onClick={() => {
                          if (isLoggedIn) {
                            if (notifiedProducts[product.id]) {
                              // لغو اطلاع‌رسانی: نمایش توست فیگما و پس از اتمام/پر شدن، تغییر حالت دکمه به موجود شد خبرم کنید
                              if (onShowToast) {
                                onShowToast(
                                  'notify-cancel-success',
                                  'با موفقیت لغو شد',
                                  'لغو اطلاع رسانی کالا با موفقیت ثبت شد.',
                                  () => {
                                    toggleProductNotified(product.id);
                                  }
                                );
                              } else {
                                toggleProductNotified(product.id);
                              }
                            } else {
                              // هر بار که کاربر روی موجود شد خبرم کن کلیک می‌کند، پاپ‌آپ اطلاع‌رسانی باز شود
                              setNotifyProduct(product);
                              setIsNotifyModalOpen(true);
                            }
                          } else {
                            setNotifyProduct(product);
                            setPendingActionAfterLogin('notify');
                            (window as any).__pendingModalAfterLogin = () => {
                              (window as any).__clearAppToasts?.();
                              setIsNotifyModalOpen(true);
                              setIsAddCommentModalOpen(false);
                            };
                            if (onShowToast) {
                              onShowToast(
                                'cart-auth-required',
                                'مورد ضروری',
                                'برای اطلاع رسانی کالا ابتدا وارد حساب کاربری خود شوید.',
                                () => {
                                  if (onOpenLogin) onOpenLogin();
                                }
                              );
                            } else if (onOpenLogin) {
                              onOpenLogin();
                            }
                          }
                        }}
                        className={`h-12.5 px-6 rounded-[16px] flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-98 text-[14.5px] font-bold ${
                          notifiedProducts[product.id]
                            ? 'bg-[#fff5f5] border border-[#ff1f3d] text-[#ff1f3d]'
                            : 'bg-[#f42f3c] hover:bg-[#de2330] text-white'
                        }`}
                      >
                        <div className="relative flex items-center justify-center shrink-0">
                          <NotificationBing
                            size="22"
                            color={notifiedProducts[product.id] ? '#ff1f3d' : '#ffffff'}
                            variant="Linear"
                            className="shrink-0"
                          />
                          {notifiedProducts[product.id] && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="w-5.5 h-[1.5px] bg-[#ff1f3d] rotate-45 rounded-full" />
                            </div>
                          )}
                        </div>
                        <span>{notifiedProducts[product.id] ? 'لغو اطلاع‌رسانی، منصرف شدم' : 'موجود شد خبرم کنید'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAdd}
                        className="h-12.5 px-5.5 rounded-xl bg-[#2b2b2b] hover:bg-black text-white text-[14px] font-bold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer shrink-0"
                      >
                        <BagTick size="22" color="#ffffff" variant="Linear" className="shrink-0" />
                        <span>افزودن به سبد خرید</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* بخش دوم: توضیحات تکمیلی و مشخصات فنی (پایین عکس) - کاملاً مطابق طراحی فیگما */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* جدول مشخصات فنی (ستون راست) - ۴ ستون */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="bg-white rounded-[22px] border border-[#E4E5E7] p-5 sm:p-6 shadow-2xs text-right flex flex-col justify-between h-full">
              {/* لیست ۱۵ ویژگی و مشخصات فنی لوستر - اسکرول بسیار نازک دقیقاً مطابق فیگما */}
              <div className="product-specs-scroll-list flex-1 overflow-y-auto max-h-[295px] min-h-[280px] divide-y divide-[#E4E5E7] text-xs sm:text-[13px] pl-4 pr-1">
                {[
                  { label: 'قطر لوستر :', value: '۳۵×۳۵×۳۰ سانتی‌متر' },
                  { label: 'ارتفاع :', value: '۳۰ سانتی‌متر' },
                  { label: 'وزن :', value: '۲۸۰۰ گرم' },
                  { label: 'تعداد سرپیچ لامپ LED :', value: '۶ عدد' },
                  { label: 'منبع برق :', value: 'برق شهری' },
                  { label: 'جنس بدنه و اسکلت :', value: 'برنج اصل درجه یک' },
                  { label: 'نوع و کیفیت کریستال :', value: 'کریستال اصل اتریشی تراش‌خورده' },
                  { label: 'پوشش و آبکاری بدنه :', value: 'آبکاری فورتیک با لاک کوره مقاوم' },
                  { label: 'نوع سرپیچ لامپ :', value: 'سرامیکی نسوز استاندارد' },
                  { label: 'ضمانت و خدمات پس از فروش :', value: 'ضمانت مادام‌العمر ثبات رنگ' },
                  { label: 'قابلیت نصب روی انواع سقف :', value: 'کناف، گچ، بتن و یونولیت' },
                  { label: 'نوع لامپ‌های سازگار :', value: 'LED و SMD کم‌مصرف شمعی' },
                  { label: 'مقاومت در برابر شرایط محیطی :', value: 'مقاوم در برابر رطوبت و شرجی' },
                  { label: 'استاندارد بسته‌بندی :', value: '۵ لایه صادراتی فوم‌دار ضربه‌گیر' },
                  { label: 'اصالت و برند محصول :', value: 'دارای شناسنامه اصالت اکبر صالحی' },
                ].map((spec, sIdx) => (
                  <div key={sIdx} className="flex justify-between items-center py-3.5">
                    <span className="font-bold text-[#555555] shrink-0">{spec.label}</span>
                    <span className="font-extrabold text-[#1a1a1a] tabular-nums text-left">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* نمایش ۱۵ ویژگی محصول روی دکمه برنزی دقیقاً مطابق فیگما */}
              <button
                type="button"
                className="w-full mt-3.5 py-3.5 bg-[#b58c5e] text-white text-xs sm:text-[13px] font-black rounded-xl text-center shadow-xs select-none cursor-default transition-colors flex items-center justify-center gap-2"
              >
                <span>۱۵ ویژگی محصول</span>
              </button>
            </div>
          </div>

          {/* توضیحات تکمیلی و بازه زمانی تحویل (ستون چپ) - ۸ ستون */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <div className="bg-white rounded-[22px] border border-[#E4E5E7] p-6 shadow-2xs text-right flex-1 flex flex-col justify-between">
              <h3 className="text-sm sm:text-[15px] font-extrabold text-[#1a1a1a] mb-3.5 shrink-0">
                توضیحات تکمیلی
              </h3>
              <p
                id="product-description-scroll"
                className="text-xs sm:text-[13px] leading-7 text-[#777777] text-justify flex-1 overflow-y-auto space-y-3"
              >
                <span className="block">
                  نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر استفاده می‌شود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ می‌شود. معمولاً برای فضاهای نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر آن استفاده می‌شود تا هماهنگی بصری و توزیع یکنواخت نور در سرتاسر محیط سالن پذیرایی حفظ گردد.
                </span>
                <span className="block">
                  در ساخت بدنه و اسکلت این اثر لوکس از شمش برنج اصل با عیار استاندارد و آلیاژ تقویت‌شده استفاده شده است. پوشش آبکاری از نوع فورتیک با لاک کوره حرارتی بالا است که درخشندگی ماندگار، مقاومت کامل در برابر اکسیداسیون، رطوبت و هوای شرجی را به همراه ضمانت کتبی مادام‌العمر ثبات رنگ برای شما به ارمغان می‌آورد.
                </span>
                <span className="block">
                  کریستال‌های منشوری تراش‌خورده با کیفیت ممتاز بازتاب نوری چندوجهی و پرتلألو ایجاد می‌کنند. سرپیچ‌های سرامیکی نسوز استاندارد E14 با قابلیت تحمل حرارت بالا، امکان استفاده از انواع لامپ‌های کم‌مصرف LED اشکی و شمعی را فراهم می‌سازند. ارتفاع لوستر به کمک زنجیرهای مستحکم تعبیه‌شده متناسب با سقف‌های کناف، بتنی، گچی و یونولیت به آسانی قابل تنظیم و رگلاژ است.
                </span>
                <span className="block">
                  کلیه محصولات گالری لوستر اکبر صالحی دارای شناسنامه اصالت، ۱۰ سال خدمات پس از فروش و تامین قطعات یدکی بوده و در بسته‌بندی پنج‌لایه صادراتی ضد ضربه به تمام نقاط کشور ارسال می‌گردد.
                </span>
              </p>
            </div>

            {/* بازه زمانی تحویل با کامیون طلایی */}
            <div className="bg-white rounded-[16px] border border-[#E4E5E7] p-4 shadow-2xs flex items-center justify-between text-right gap-4">
              <div className="flex items-center gap-3">
                {/* آیکون کامیون باربری طلایی */}
                <div className="w-12 h-12 rounded-[12px] bg-[#fbf8f2] flex items-center justify-center shrink-0 border border-[#E4E5E7]">
                  <TruckFast size="24" color="#b58c56" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#1a1a1a]">بازه زمانی تحویل :</span>
                  <div className="mt-1">
                    <span className="text-[11px] font-bold text-[#555]">تاریخ حدودی تحویل مرسوله (۲ مهر ۱۴۰۴ - ۷ مهر ۱۴۰۴)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#fcf9f2] border border-[#E4E5E7] px-3.5 py-2 rounded-xl">
                <span className="text-xs font-bold text-[#555]">ساعت حدودی :</span>
                <span className="text-xs font-extrabold text-[#222] bg-white border border-[#E4E5E7] px-2.5 py-0.5 rounded-md tabular-nums">۱۲ : ۵۵</span>
                <span className="text-xs font-bold text-[#888]">الی</span>
                <span className="text-xs font-extrabold text-[#222] bg-white border border-[#E4E5E7] px-2.5 py-0.5 rounded-md tabular-nums">۱۴ : ۴۵</span>
              </div>
            </div>
          </div>

        </div>

        {/* بخش سوم: نظرات کاربران درباره این محصول */}
        <div className="border-t border-[#E4E5E7] pt-8 mt-10 text-right">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
                نظرات کاربران درباره این محصول
              </h3>
              <span className="text-xs text-[#8c8273] font-bold tabular-nums">
                ۱۶ نظر ثبت شده · صفحه {toPersianDigits(activeCommentPage + 1)} از {toPersianDigits(totalCommentPages)}
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* گروه ناوبری عقب و جلو به همراه نقاط صفحه‌بندی */}
              <div className="flex items-center gap-2">
                {/* دکمه اول: رفتن به جلو (صفحه بعد / پایینی‌ها) با هاور سفید آیکون */}
                <button
                  type="button"
                  onClick={handleNextCommentPage}
                  disabled={activeCommentPage >= totalCommentPages - 1}
                  aria-label="بعدی"
                  title="صفحه بعد (پایینی‌ها / جلو)"
                  className={`group w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#f5f5f5] hover:bg-[#b58c5e] hover:border-[#b58c5e] border border-transparent flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 text-[#555555] hover:text-white ${
                    activeCommentPage >= totalCommentPages - 1
                      ? 'opacity-35 cursor-not-allowed hover:bg-[#f5f5f5] hover:border-transparent hover:text-gray-400'
                      : ''
                  }`}
                >
                  <ChevronRight
                    className={`w-5 h-5 transition-colors text-current group-hover:text-white ${
                      activeCommentPage >= totalCommentPages - 1
                        ? 'text-gray-400'
                        : 'text-[#555555] group-hover:text-white'
                    }`}
                  />
                </button>

                <div
                  className="flex items-center gap-1.5 sm:gap-2 px-1"
                  dir="ltr"
                >
                  {Array.from({ length: totalCommentPages }).map((_, pageIdx) => (
                    <button
                      key={`comment-dot-${pageIdx}`}
                      type="button"
                      onClick={() => handleSelectCommentDot(pageIdx)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        activeCommentPage === pageIdx
                          ? 'w-2.5 h-2.5 bg-[#2b2b2b] scale-110'
                          : 'w-2 h-2 bg-[#e2e2e2] hover:bg-[#b58c5e]'
                      }`}
                      aria-label={`صفحه ${pageIdx + 1}${pageIdx === totalCommentPages - 1 ? ' (آخرین صفحه)' : pageIdx === 0 ? ' (صفحه اول)' : ''}`}
                      title={`صفحه ${pageIdx + 1}${pageIdx === totalCommentPages - 1 ? ' (آخرین صفحه)' : pageIdx === 0 ? ' (صفحه اول)' : ''}`}
                    />
                  ))}
                </div>

                {/* دکمه دوم: رفتن به عقب (صفحه قبل / قبلی‌ها) با هاور سفید آیکون */}
                <button
                  type="button"
                  onClick={handlePrevCommentPage}
                  disabled={activeCommentPage === 0}
                  aria-label="قبلی"
                  title="صفحه قبل (قبلی‌ها / عقب)"
                  className={`group w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#f5f5f5] hover:bg-[#b58c5e] hover:border-[#b58c5e] border border-transparent flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 text-[#555555] hover:text-white ${
                    activeCommentPage === 0
                      ? 'opacity-35 cursor-not-allowed hover:bg-[#f5f5f5] hover:border-transparent hover:text-gray-400'
                      : ''
                  }`}
                >
                  <ChevronLeft
                    className={`w-5 h-5 transition-colors text-current group-hover:text-white ${
                      activeCommentPage === 0
                        ? 'text-gray-400'
                        : 'text-[#555555] group-hover:text-white'
                    }`}
                  />
                </button>
              </div>

              {/* دکمه افزودن نظر با ارتفاع مشخص مطابق تصویر - آیکون مثبت در سمت راست متن */}
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) {
                    setIsAddCommentModalOpen(true);
                  } else {
                    setPendingActionAfterLogin('comment');
                    (window as any).__pendingModalAfterLogin = () => {
                      (window as any).__clearAppToasts?.();
                      setIsAddCommentModalOpen(true);
                      setIsNotifyModalOpen(false);
                    };
                    if (onShowToast) {
                      onShowToast(
                        'cart-auth-required',
                        'مورد ضروری',
                        'برای ثبت نظرات کاربران ابتدا وارد حساب کاربری خود شوید.',
                        () => {
                          if (onOpenLogin) onOpenLogin();
                        }
                      );
                    } else if (onOpenLogin) {
                      onOpenLogin();
                    }
                  }
                }}
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-[14px] border border-[#e2e2e2] bg-white hover:bg-gray-50 text-[#1a1a1a] font-bold text-sm sm:text-[15px] flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#1a1a1a] stroke-[2.2]" />
                <span>افزودن نظر</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-stretch">
            
            {/* کارت میانگین امتیازات (سمت راست) - ۴ ستون */}
            <div className="lg:col-span-4 flex flex-col">
              <div ref={ratingCardRef} className="bg-white rounded-[22px] border border-[#E4E5E7] p-6 shadow-2xs space-y-5">
                {/* هدر امتیاز */}
                <div className="flex items-center justify-between border-b-0 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#1a1a1a] tabular-nums">۴.۷</span>
                    <span className="text-base sm:text-lg font-black text-[#1a1a1a]">امتیاز</span>
                  </div>
                  <span className="bg-[#edfcf2] text-[#39b533] border border-[#39b533]/25 px-4 py-1 rounded-full text-xs font-black">
                    خیلی خوب
                  </span>
                </div>

                {/* ردیف‌های پیشرفت جنبه‌های کیفی با تراز عمودی */}
                <div className="space-y-4">
                  {[
                    { label: 'وضعیت محصول', score: 4.5, pct: '85%' },
                    { label: 'موقعیت مکانی و دسترسی', score: 4.2, pct: '78%' },
                    { label: 'امکانات کالا', score: 3.7, pct: '66%' },
                    { label: 'رعایت پروتکل های بسته بندی', score: 4.9, pct: '96%' },
                    { label: 'به موقع رساندن کالا', score: 4.8, pct: '92%' },
                    { label: 'کیفیت ارسال کالا', score: 3.3, pct: '58%' },
                    { label: 'خدمات سرویس دهی', score: 4.4, pct: '82%' },
                  ].map((row, rIdx) => (
                    <div key={`rating-row-${rIdx}`} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-[12.5px] font-bold">
                        <span className="text-[#555555]">{row.label}</span>
                        <span className="text-[#1a1a1a] tabular-nums">{row.score.toLocaleString('fa-IR')}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#f0f0ee] rounded-full overflow-hidden" dir="ltr">
                        <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: row.pct }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* لیست کامنت‌ها (سمت چپ) - ۸ ستون - حرکت کاملاً نرم و شناور هنگام تعویض صفحه */}
            <div
              ref={commentsContainerRef}
              id="comments-cards-scroll-container"
              className="lg:col-span-8 overflow-hidden min-h-0 h-full relative"
              style={ratingCardHeight ? { height: `${ratingCardHeight}px`, maxHeight: `${ratingCardHeight}px` } : undefined}
            >
              <div
                key={`comment-page-${activeCommentPage}`}
                className={`space-y-4 ${
                  commentSlideDir === 'next'
                    ? 'animate-comment-glide-next'
                    : 'animate-comment-glide-prev'
                }`}
              >
                {commentItems
                  .slice(activeCommentPage, activeCommentPage + 3)
                  .map((comment, localIdx) => {
                    const globalIdx = activeCommentPage + localIdx;
                    const isCutCard = localIdx === 2;
                    return (
                      <div
                        key={comment.id}
                        id={`comment-card-${globalIdx}`}
                        className={`bg-white border border-[#E4E5E7] hover:border-[#b58c5e]/50 p-5 sm:p-6 shadow-2xs space-y-3.5 transition-all duration-300 ${
                          isCutCard
                            ? 'rounded-t-[22px] rounded-b-none border-b-0 h-[88px] max-h-[88px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-11 after:bg-gradient-to-t after:from-white after:via-white/80 after:to-transparent after:pointer-events-none'
                            : 'rounded-[22px]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full shrink-0 shadow-2xs">
                              <img
                                src={comment.avatar}
                                alt={comment.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (comment.avatarSvg && target.src !== comment.avatarSvg) {
                                    target.src = comment.avatarSvg;
                                  }
                                }}
                                className="w-full h-full rounded-full object-cover border border-[#E4E5E7]"
                              />
                              <span
                                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#39b533] border-2 border-white flex items-center justify-center shadow-xs"
                                title="خریدار تایید شده"
                              >
                                <svg className="w-2.5 h-2.5 text-white stroke-[3.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs sm:text-[14px] font-black text-[#1a1a1a] block">
                                {comment.name}
                              </span>
                              <span className="block text-[11px] text-[#777777] font-semibold mt-1">
                                {comment.date}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="bg-[#1e1e1e] text-white px-3.5 h-10 rounded-[10px] text-xs font-bold tabular-nums shadow-2xs flex items-center justify-center">
                              {comment.time}
                            </span>
                            <span className="bg-[#b58c5e] text-white px-3.5 h-10 rounded-[10px] text-xs font-black tabular-nums shadow-2xs flex items-center justify-center gap-1.5 select-none">
                              <Star className="w-3.5 h-3.5 fill-white text-white shrink-0 self-center -translate-y-[1px]" />
                              <span className="leading-none flex items-center justify-center">{comment.rating}</span>
                            </span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-[13px] leading-7 text-[#555555] text-justify font-medium">
                          {comment.content}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>


        {/* بخش چهارم: محصولات مشابه */}
        <div className="border-t border-[#E4E5E7] pt-8 mt-14 text-right">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
              محصولات مشابه
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateBackToProducts()}
                className="h-10 px-6 bg-[#b58c5e]/5 hover:bg-[#b58c5e] border border-[#b58c5e] text-[#b58c5e] hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                مشاهده محصولات
              </button>
              {similarProducts.length > 4 && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => scrollSimilarCarousel('prev')}
                    aria-label="قبلی"
                    className="group w-10 h-10 rounded-lg bg-[#f6f6f5] hover:bg-[#b58c5e] hover:border-[#b58c5e] border border-[#e5e5e4] flex items-center justify-center text-[#444444] hover:text-white transition-colors cursor-pointer active:scale-95 shrink-0"
                  >
                    <ChevronRight className="w-4 h-4 text-[#444444] group-hover:text-white transition-colors" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSimilarCarousel('next')}
                    aria-label="بعدی"
                    className="group w-10 h-10 rounded-lg bg-[#f6f6f5] hover:bg-[#b58c5e] hover:border-[#b58c5e] border border-[#e5e5e4] flex items-center justify-center text-[#444444] hover:text-white transition-colors cursor-pointer active:scale-95 shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#444444] group-hover:text-white transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* کاروسل افقی محصولات مشابه */}
          <div
            ref={similarCarouselRef}
            onScroll={handleSimilarCarouselScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pr-1 pl-4 sm:px-1 py-2 touch-pan-x [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {similarProducts.map((simProd) => {
              const isOutOfStock = Boolean(simProd.outOfStock);
              const qtyInCart = isLoggedIn ? cartQuantities[simProd.id] || 0 : 0;
              const isHighlighted =
                isLoggedIn &&
                !isOutOfStock &&
                (qtyInCart > 0 || cartProductIds.includes(simProd.id));
              const isCard3D = Boolean(active3DCards[simProd.id]);
              const currentFinish =
                cardFinishes[simProd.id] ||
                simProd.cardFinishOverride ||
                'original';
              const activeFinishPreset = FINISH_PRESETS[currentFinish];

              const isTooltipActive = recentTooltipId === simProd.id;
              const showOutOfStockTooltip = isOutOfStock && isTooltipActive;
              const showAddedTooltip =
                !isOutOfStock && qtyInCart > 0 && isTooltipActive;

              return (
                <div
                  key={`sim-${simProd.id}`}
                  data-carousel-card="true"
                  onMouseLeave={() => {
                    clearTemporaryTooltip(simProd.id);
                  }}
                  className="group shrink-0 snap-start w-[83vw] max-w-[345px] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] sm:max-w-none flex flex-col justify-between bg-white rounded-[16px] border border-[#e5e5e5] p-3.5 sm:p-4 pb-5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <div>
                    {/* باکس عکس با پس‌زمینه طوسی کم‌رنگ و گوشه‌های گرد */}
                    <div
                      onClick={() => {
                        if (isOutOfStock) {
                          triggerTemporaryTooltip(simProd.id);
                          return;
                        }
                        if (!isCard3D) {
                          handleViewAndBuyClick(simProd, currentFinish);
                        }
                      }}
                      className={`relative w-full h-56 sm:h-60 rounded-[12px] bg-[#f5f5f5] flex items-center justify-center overflow-hidden ${
                        isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {simProd.hasSnappPay && <SnappPayBadge />}

                      {isCard3D ? (
                        <div
                          className="w-full h-full rounded-[12px] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Chandelier3DViewer
                            modelType={simProd.modelType}
                            imageUrl={simProd.image}
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
                            src={simProd.image}
                            alt={simProd.name}
                            filterCss={activeFinishPreset?.filterCss || 'none'}
                            className={`w-full h-full max-h-[205px] max-w-full object-contain transition-transform duration-300 ${
                              isOutOfStock ? '' : 'group-hover:scale-[1.03]'
                            }`}
                          />
                        </div>
                      )}

                      {/* دکمه تغییر بین عکس و مدل سه‌بعدی */}
                        <button
                          type="button"
                          onClick={(e) => toggleCard3D(simProd.id, e)}
                          title={
                            isCard3D
                              ? 'بازگشت به تصویر محصول'
                              : 'تبدیل فوری به مدل سه‌بعدی (3D)'
                          }
                          className={`absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                            isCard3D
                              ? 'bg-[#b59766] text-white opacity-100'
                              : 'bg-white/95 hover:bg-[#262626] text-[#262626] hover:text-white border border-[#e5e5e5] opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Box className="w-3 h-3" />
                          <span>{isCard3D ? 'نمای 3D فعال' : '3D خودکار'}</span>
                        </button>

                      {/* نوار انتخاب رنگ‌های واقعی آبکاری لوستر روی کارت */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#e8e4dc] shadow-2xs transition-opacity ${
                            currentFinish !== 'original' || isCard3D
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {CARD_PLATING_FINISHES.map((finishKey) => {
                              const preset = FINISH_PRESETS[finishKey];
                              return (
                                <button
                                  key={finishKey}
                                  type="button"
                                  onClick={() =>
                                    setCardFinishes((prev) => ({
                                      ...prev,
                                      [simProd.id]: finishKey,
                                    }))
                                  }
                                  title={preset.label}
                                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                                    currentFinish === finishKey
                                      ? 'scale-125 border-[#222222] ring-1 ring-[#b59766]'
                                      : 'border-black/20 hover:scale-110'
                                  }`}
                                  style={{
                                    background: preset.swatch,
                                  }}
                                />
                              );
                            })}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium text-[#666] truncate max-w-[90px]">
                              {activeFinishPreset.label}
                            </span>
                            {currentFinish !== 'original' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setCardFinishes((prev) => ({
                                    ...prev,
                                    [simProd.id]: 'original',
                                  }))
                                }
                                title="بازنشانی به رنگ اصلی"
                                className="text-[10px] text-[#666] hover:text-[#222] flex items-center cursor-pointer"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                    </div>

                    {/* عنوان، زیرعنوان و قیمت محصول */}
                    <div className="mt-4 px-1.5 text-right">
                      <h3
                        onClick={() => {
                          if (isOutOfStock) {
                            triggerTemporaryTooltip(simProd.id);
                            return;
                          }
                          handleViewAndBuyClick(simProd, currentFinish);
                        }}
                        className={`text-[17.5px] sm:text-[18.5px] font-bold text-[#1f1f1f] transition-colors ${
                          isOutOfStock
                            ? 'cursor-not-allowed'
                            : 'hover:text-[#b59766] cursor-pointer'
                        }`}
                      >
                        {simProd.name}
                      </h3>
                      <p className="text-[12.5px] sm:text-[13px] text-[#757575] font-medium mt-2.5">
                        {simProd.subtitle}
                      </p>
                      <p className="text-[14px] sm:text-[14.5px] font-semibold text-[#757575] mt-3.5 tabular-nums">
                        {simProd.priceFormatted}
                      </p>
                    </div>
                  </div>

                  {/* نوار پایین کارت: دکمه‌های مشاهده و خرید در راست، دکمه سبد خرید با تولتیپ در وسط، و کد محصول در چپ */}
                  <div className="mt-5 px-1.5 flex flex-row items-center justify-between gap-2.5" dir="rtl">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleViewAndBuyClick(simProd, currentFinish)}
                        className="h-11 sm:h-12 min-w-[115px] sm:min-w-[142px] px-3.5 sm:px-6 rounded-[12px] text-[12.5px] sm:text-[13px] font-bold transition-colors whitespace-nowrap bg-[#f3f3f3] text-[#222222] hover:bg-[#242424] hover:text-white cursor-pointer"
                      >
                        مشاهده و خرید
                      </button>

                      {/* دکمه افزودن به سبد خرید / وضعیت ناموجود به همراه تولتیپ موقت در زمان افزودن یا هاور */}
                      <div
                        className="relative shrink-0"
                        onMouseEnter={() => {
                          if (isOutOfStock || qtyInCart > 0) {
                            triggerTemporaryTooltip(simProd.id);
                          }
                        }}
                        onMouseLeave={() => {
                          clearTemporaryTooltip(simProd.id);
                        }}
                      >
                        {isOutOfStock ? (
                          <>
                            {/* تولتیپ قرمز/صورتی «محصول در انبار وجود ندارد!» فقط هنگام هاور یا تلاش برای انتخاب */}
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
                              onClick={() => triggerTemporaryTooltip(simProd.id)}
                              aria-label="محصول در انبار وجود ندارد"
                              className="w-12 h-12 rounded-[14px] bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center transition-colors cursor-not-allowed shrink-0"
                            >
                              <BagCross size="24" color="#ea1d2c" variant="Linear" />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* تولتیپ تیره «X محصول اضافه شد» هنگام افزودن به سبد خرید (موقت) یا هاور */}
                            <div
                              className={`absolute bottom-[calc(100%+11px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-200 ${
                                showAddedTooltip
                                  ? 'opacity-100 translate-y-0 scale-100'
                                  : 'opacity-0 translate-y-1 scale-95'
                              }`}
                            >
                              <div className="relative bg-[#2b2b2b] text-white text-[12px] font-bold px-3.5 py-2.5 rounded-[11px] whitespace-nowrap shadow-md">
                                {qtyInCart.toLocaleString('fa-IR')} محصول اضافه شد
                                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2b2b2b] rotate-45 rounded-[2px]" />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddClick(simProd)}
                              aria-label="افزودن به سبد خرید"
                              className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                isHighlighted
                                  ? 'bg-[#b59766] hover:bg-[#a38554] text-white'
                                  : 'bg-[#f3f3f3] hover:bg-[#b59766] text-[#222222] hover:text-white'
                              }`}
                            >
                              {isHighlighted ? (
                                <PlusSquareIcon className="w-[22px] h-[22px]" />
                              ) : (
                                <Bag size="24" color="currentColor" variant="Linear" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* سمت چپ: کد محصول */}
                    <div className="text-left leading-tight shrink-0">
                      <span className="block text-[13px] font-bold text-[#2b2b2b]">
                        کد محصول
                      </span>
                      <span className="block text-[13px] font-medium text-[#757575] tabular-nums mt-1">
                        {simProd.productCode}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* مودال ثبت نظرات کاربران دقیقاً مطابق طرح ۱۰۰٪ فیگما */}
        {isAddCommentModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
            dir="rtl"
            onClick={() => setIsAddCommentModalOpen(false)}
          >
            <div
              className="bg-white rounded-[10px] max-w-[430px] w-full p-6 sm:p-7 shadow-2xl border border-[#eaeaea] relative text-right flex flex-col max-h-[92vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* هدر: عنوان «ثبت نظرات کاربران» در سمت راست و دکمه بستن در سمت چپ */}
              <div className="flex items-center justify-between pb-4 -mt-1">
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#1a1a1a]">
                  ثبت نظرات کاربران
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddCommentModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#1a1a1a] transition-colors cursor-pointer"
                  aria-label="بستن"
                >
                  <X className="w-5 h-5 stroke-[2.2]" />
                </button>
              </div>

              {/* کانتینر اصلی بدنه با پس‌زمینه طوسی بسیار روشن #fafafa پشت ویجت‌ها */}
              <div className="bg-[#fafafa] -mx-6 sm:-mx-7 p-6 sm:p-7 -mb-6 sm:-mb-7 flex-1 overflow-y-auto space-y-4">
                {/* تب‌های انتخاب: «امتیازدهی محصول» و «متن توضیحات» */}
                <div className="bg-[#f0f0f2] p-1.5 rounded-[10px] flex items-center border border-[#e5e5e8]">
                  <button
                    type="button"
                    onClick={() => setCommentModalTab('rating')}
                    className={`flex-1 py-2.5 rounded-[8px] text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer text-center ${
                      commentModalTab === 'rating'
                        ? 'bg-[#262626] text-white shadow-xs'
                        : 'bg-transparent text-[#555555] hover:text-[#1a1a1a]'
                    }`}
                  >
                    امتیازدهی محصول
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentModalTab('description')}
                    className={`flex-1 py-2.5 rounded-[8px] text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer text-center ${
                      commentModalTab === 'description'
                        ? 'bg-[#262626] text-white shadow-xs'
                        : 'bg-transparent text-[#555555] hover:text-[#1a1a1a]'
                    }`}
                  >
                    متن توضیحات
                  </button>
                </div>

                {/* بدنه اسکرول‌پذیر متناسب با تب انتخاب شده */}
                <div className="space-y-3.5 pb-2">
                  {commentModalTab === 'rating' ? (
                    <>
                      {/* آکاردئون ۱: ستاره مورد نظر خود را انتخاب نمایید */}
                      <div className="rounded-[10px] border border-[#d8d8d8] bg-white overflow-hidden transition-all shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setCommentRatingStarsOpen(!commentRatingStarsOpen)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-right cursor-pointer hover:bg-gray-50/70 transition-colors bg-white"
                        >
                          <span className="text-[13.5px] sm:text-[14.5px] font-bold text-[#1a1a1a]">
                            ستاره مورد نظر خود را انتخاب نمایید
                          </span>
                          {commentRatingStarsOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#666666]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#666666]" />
                          )}
                        </button>

                        {commentRatingStarsOpen && (
                          <div className="px-5 pb-2 pt-1 border-t border-[#f0f0f0] bg-white">
                            {[
                              { value: 5, label: 'ستاره ۵ از ۵' },
                              { value: 4, label: 'ستاره ۴ از ۵' },
                              { value: 3, label: 'ستاره ۳ از ۵' },
                              { value: 2, label: 'ستاره ۲ از ۵' },
                              { value: 1.5, label: 'ستاره ۱.۵ از ۵' },
                            ].map((item) => {
                              const isSelected = selectedCommentStar === item.value;
                              return (
                                <div
                                  key={`star-opt-${item.value}`}
                                  onClick={() => {
                                    setSelectedCommentStar(item.value);
                                    setNewCommentRating(Math.round(item.value));
                                  }}
                                  className="flex items-center justify-between cursor-pointer py-2.5 border-b border-[#f0f0f0] last:border-b-0 select-none group"
                                >
                                  <span
                                    className={`text-[12.5px] sm:text-[13px] font-bold transition-colors ${
                                      isSelected ? 'text-[#1a1a1a]' : 'text-[#666666]'
                                    }`}
                                  >
                                    {item.label}
                                  </span>

                                  <div
                                    className={`w-5 h-5 rounded-[4px] flex items-center justify-center transition-all shrink-0 ${
                                      isSelected
                                        ? 'bg-[#b58c5e] text-white shadow-xs'
                                        : 'bg-[#eeeeee] group-hover:bg-[#e2e2e2]'
                                    }`}
                                  >
                                    {isSelected && (
                                      <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-3.5 h-3.5"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* آکاردئون ۲: پیشنهاد مورد نظر خود را انتخاب نمایید */}
                      <div className="rounded-[10px] border border-[#d8d8d8] bg-white overflow-hidden transition-all shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setCommentRecommendationOpen(!commentRecommendationOpen)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-right cursor-pointer hover:bg-gray-50/70 transition-colors bg-white"
                        >
                          <span className="text-[13.5px] sm:text-[14.5px] font-bold text-[#1a1a1a]">
                            پیشنهاد مورد نظر خود را انتخاب نمایید
                          </span>
                          {commentRecommendationOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#666666]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#666666]" />
                          )}
                        </button>

                        {commentRecommendationOpen && (
                          <div className="px-5 pb-3 pt-1 border-t border-[#f0f0f0] bg-white space-y-2">
                            {[
                              { id: 'item1', title: 'مورد اول' },
                              { id: 'item2', title: 'مورد دوم' },
                              { id: 'item3', title: 'مورد سوم' },
                              { id: 'item4', title: 'مورد چهارم' },
                              { id: 'item5', title: 'مورد پنجم' },
                            ].map((item) => {
                              const currentVal = suggestionScores[item.id] ?? 4.0;
                              const fillPercent = (currentVal / 5.0) * 100;
                              return (
                                <div
                                  key={item.id}
                                  className="py-2 space-y-3"
                                >
                                  {/* عنوان مورد در سمت راست و عدد امتیاز دستی در سمت چپ */}
                                  <div className="flex items-center justify-between text-xs sm:text-[13px] font-bold">
                                    <span className="text-[#1a1a1a]">{item.title}</span>
                                    <span className="text-[#1a1a1a] tabular-nums font-extrabold text-[13px]">
                                      {currentVal.toFixed(1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)])}
                                    </span>
                                  </div>

                                  {/* نوار پر کردن دستی چپ به راست و ریزتر */}
                                  <div dir="ltr" className="relative w-full h-[6px] bg-[#e8e8e8] rounded-full overflow-hidden flex items-center cursor-pointer">
                                    <div
                                      className="h-full bg-[#b58c5e] rounded-full transition-all duration-75"
                                      style={{ width: `${fillPercent}%` }}
                                    />
                                    <input
                                      type="range"
                                      min="0.5"
                                      max="5.0"
                                      step="0.1"
                                      value={currentVal}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setSuggestionScores((prev) => ({ ...prev, [item.id]: val }));
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* تب متن توضیحات - دقیقاً مطابق تصویر اول فیگما */
                    <div className="bg-white p-4.5 rounded-[10px] border border-[#e2e2e2] shadow-2xs space-y-3">
                      <textarea
                        rows={6}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="متن مورد نظر خود را بنویسید..."
                        className="w-full text-xs sm:text-[13.5px] font-medium text-[#1a1a1a] placeholder-[#888888] border-0 focus:outline-hidden resize-none leading-relaxed bg-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* دکمه اصلی پایین: ثبت دیدگاه / مرحله بعدی */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSubmittingComment}
                    onClick={(e) => {
                      if (isSubmittingComment) return;

                      // اگر در مرحله اول (امتیازدهی محصول) هستیم، رفتن به مرحله بعدی (متن توضیحات)
                      if (commentModalTab === 'rating') {
                        setIsSubmittingComment(true);
                        setTimeout(() => {
                          setIsSubmittingComment(false);
                          setCommentModalTab('description');
                        }, 450);
                        return;
                      }

                      // اگر در مرحله دوم (متن توضیحات) هستیم، بررسی خالی نبودن متن
                      if (!newCommentText.trim()) {
                        if (onShowToast) {
                          onShowToast(
                            'error',
                            'خطایی رخ داد!',
                            'مشتری عزیز فیلد متن توضیحات خالی میباشد.'
                          );
                        }
                        return;
                      }

                      // ثبت نهایی دیدگاه همراه با لودینگ ۳ نقطه و توست سبز تایید مطابق تصویر سوم
                      setIsSubmittingComment(true);

                      setTimeout(() => {
                        setIsSubmittingComment(false);
                        
                        let profileName = '';
                        if (typeof window !== 'undefined') {
                          const storedName = localStorage.getItem('app_user_display_name');
                          if (storedName && storedName.trim() && storedName.trim() !== 'مشتری عزیز!') {
                            profileName = storedName.trim();
                          } else {
                            const adminUser = localStorage.getItem('salehi_admin_session_user');
                            if (adminUser) {
                              try {
                                const parsed = JSON.parse(adminUser);
                                if (parsed?.name) profileName = parsed.name;
                              } catch {}
                            }
                          }
                        }
                        const fallbackName = newCommentName.trim() || profileName || 'علیرضا آذرخش';
                        const fallbackText = newCommentText.trim();
                        const initials = fallbackName.slice(0, 2);
                        const formattedRating = selectedCommentStar.toFixed(1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);

                        const newObj = {
                          id: `c-new-${Date.now()}`,
                          name: fallbackName,
                          date: 'تاریخ نظر دهی : ۲۷ مهرماه ۱۴۰۵',
                          time: 'ساعت ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                          rating: formattedRating,
                          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                          avatarSvg: makeAvatarSvg(initials, '#b58c5e', '#8c673d'),
                          content: fallbackText,
                        };

                        setCommentItems((prev) => [newObj, ...prev]);
                        setNewCommentName('');
                        setNewCommentText('');
                        setIsAddCommentModalOpen(false);
                        setCommentSlideDir('next');
                        setActiveCommentPage(0);
                        setCommentModalTab('rating');

                        if (onShowToast) {
                          onShowToast(
                            'success',
                            'دیدگاه با موفقیت ثبت شد',
                            'پس از بررسی و تایید های دیدگاه نمایش داده میشود.'
                          );
                        } else {
                          setCommentToast('دیدگاه با موفقیت ثبت شد. پس از بررسی و تایید های دیدگاه نمایش داده میشود.');
                          setTimeout(() => setCommentToast(null), 4000);
                        }
                      }, 750);
                    }}
                    className="w-full h-11 rounded-[10px] bg-[#262626] hover:bg-black text-white text-[14px] font-bold flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-98 disabled:opacity-90"
                  >
                    {isSubmittingComment ? (
                      /* انیمیشن ۳ نقطه سفید هنگام لودینگ ثبت دیدگاه مطابق تصویر اول */
                      <div className="flex items-center justify-center gap-1.5" dir="ltr">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse [animation-delay:300ms]" />
                      </div>
                    ) : (
                      <span>{commentModalTab === 'rating' ? 'مرحله بعدی' : 'ثبت دیدگاه'}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* مودال ۱۵ ویژگی انحصاری ساختاری و استانداردها */}
        {isFeaturesModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsFeaturesModalOpen(false)}
            dir="rtl"
          >
            <div
              className="w-full max-w-2xl bg-[#fcfbf9] rounded-3xl border border-[#e5dec9] shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ebdcb9]">
                <h3 className="text-base sm:text-lg font-black text-[#1a1a1a]">
                  ۱۵ ویژگی انحصاری ساختاری و استانداردهای محصول
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFeaturesModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f4f3ef] hover:bg-[#2b2b2b] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  'ضمانت کتبی مادام‌العمر ثبات رنگ و آبکاری بدنه',
                  'استفاده از برنج خالص درجه یک و آلیاژ استاندارد',
                  'کریستال‌های ۱۰۰٪ اصل اتریشی و چک با بازتاب نور منشوری',
                  'سرپیچ‌های سرامیکی نسوز استاندارد با قابلیت تحمل حرارت بالا',
                  'مجهز به سیستم نصب آسان در انواع سقف‌های کاذب و یونولیت',
                  'دارای تاییدیه استاندارد ملی و گواهینامه کیفیت اروپا CE',
                  'بسته‌بندی تخصصی ضد ضربه با پوشش وکیوم فشرده جهت ارسال امن',
                  'پشتیبانی ۲۴ ساعته و مشاوره رایگان دکوراسیون داخلی',
                  'امکان سفارشی‌سازی ابعاد، تعداد شاخه‌ها و رنگ آبکاری',
                  'مقاومت کامل در برابر رطوبت و شرایط آب و هوایی شرجی',
                  'سیم‌کشی داخلی تمام مس استاندارد با پوشش عایق نسوز',
                  'طراحی انحصاری توسط استودیو معماری صالحی',
                  'ارسال به سراسر کشور با بیمه کامل باربری',
                  'امکان تست نور و هماهنگی با لوسترهای دیواری و آباژور ست',
                  'تامین کلیه قطعات یدکی کریستالی و اتصالات به مدت ۱۰ سال',
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#f0eee8] shadow-2xs"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#b59766] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-bold text-[#333] leading-relaxed text-right">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* پیام تأیید ثبت نظر */}
        {commentToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] text-white px-5 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-300">
            {commentToast}
          </div>
        )}

        {/* مودال اطلاع‌رسانی موجودی کالا */}
        <NotifyAvailabilityModal
          isOpen={isNotifyModalOpen}
          onClose={() => setIsNotifyModalOpen(false)}
          product={notifyProduct}
          userPhone={userPhone}
          onSubmitSuccess={() => {
            if (notifyProduct) {
              toggleProductNotified(notifyProduct.id);
            }
            if (onShowToast) {
              onShowToast(
                'success',
                'با موفقیت ثبت شد',
                'محصول به محض موجود شدن، به شما خبر میدهیم.'
              );
            }
          }}
        />

        {/* لایت‌باکس عکس‌های گالری محصول */}
        {isProductLightboxOpen && (
          <div
            onClick={() => {
              setIsProductLightboxOpen(false);
              if (onShowToast) {
                onShowToast('success', 'زوم غیرفعال شد', 'از حالت زوم خارج شدید.');
              }
            }}
            className="fixed inset-0 z-[80] bg-black md:bg-black/65 md:backdrop-blur-[2px] flex items-center justify-center p-0 md:p-6"
            dir="rtl"
          >
            <button
              type="button"
              onClick={() => {
                setIsProductLightboxOpen(false);
                if (onShowToast) {
                  onShowToast('success', 'زوم غیرفعال شد', 'از حالت زوم خارج شدید.');
                }
              }}
              className="fixed top-6 left-5 md:top-5 md:left-7 z-[90] h-[38px] md:h-[40px] px-4 md:px-5 rounded-[10px] bg-[#1e1e1e] hover:bg-black text-white text-[12px] md:text-[12.5px] font-bold flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            >
              بستن صفحه
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full md:w-auto flex items-center justify-center md:gap-6 lg:gap-9"
            >
              {galleryPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setProductLightboxIdx((prev) => (prev + 1) % galleryPhotos.length);
                  }}
                  aria-label="اسلاید بعدی"
                  className="hidden md:flex w-[42px] h-[42px] rounded-[10px] bg-white/60 hover:bg-white text-[#222222] hover:text-[#111111] items-center justify-center shadow-md transition-all duration-200 shrink-0 cursor-pointer z-30"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.1]" />
                </button>
              )}

              <div className="relative w-full md:w-[76vw] lg:w-[860px] xl:w-[950px] max-w-[960px] aspect-[4/3.5] md:aspect-auto md:h-[510px] lg:h-[565px] md:rounded-[22px] overflow-hidden bg-[#141414] shadow-2xl flex items-center justify-center select-none">
                {galleryPhotos.map((item, slideIdx) => {
                  const isCurrent = productLightboxIdx === slideIdx;
                  if (item.type === 'video') {
                    return (
                      <div
                        key={`prod-lb-slide-${slideIdx}`}
                        className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ${
                          isCurrent
                            ? 'opacity-100 z-[2]'
                            : 'opacity-0 z-[1] pointer-events-none'
                        }`}
                      >
                        <video
                          src={item.url}
                          poster={item.poster}
                          playsInline
                          className="w-full h-full object-cover object-center"
                        />
                        {/* Center play button overlay matching Project view */}
                        {isCurrent && (
                          <button
                            type="button"
                            onClick={() => {}}
                            aria-label="پخش ویدیو"
                            className="absolute z-20 w-[78px] h-[78px] sm:w-[88px] sm:h-[88px] rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-md border-[1.5px] border-white/85 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                          >
                            <CustomPlayDuotoneIcon className="w-8 h-8 sm:w-9 sm:h-9 translate-x-0.5" />
                          </button>
                        )}
                        {/* Bottom control bar and pagination dots matching project view */}
                        {isCurrent && (
                          <>
                            <div
                              dir="ltr"
                              className="absolute bottom-9 sm:bottom-11 inset-x-5 sm:inset-x-7 z-25 flex items-center gap-3.5 sm:gap-4 text-white"
                            >
                              <div className="flex items-center gap-3 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductLightboxIdx((prev) => (prev <= 0 ? galleryPhotos.length - 1 : prev - 1));
                                  }}
                                  className="hover:opacity-80 cursor-pointer"
                                  aria-label="قبلی"
                                >
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <rect x="4" y="5" width="2.4" height="14" rx="1" />
                                    <path d="M18.5 5.8C19.3 5.3 20.2 5.9 20.2 6.8V17.2C20.2 18.1 19.3 18.7 18.5 18.2L9.8 13C9.1 12.5 9.1 11.5 9.8 11L18.5 5.8Z" />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {}}
                                  className="hover:opacity-80 cursor-pointer"
                                  aria-label="پخش یا توقف"
                                >
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <rect x="6" y="5" width="4" height="14" rx="1" />
                                    <rect x="14" y="5" width="4" height="14" rx="1" />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductLightboxIdx((prev) => (prev >= galleryPhotos.length - 1 ? 0 : prev + 1));
                                  }}
                                  className="hover:opacity-80 cursor-pointer"
                                  aria-label="بعدی"
                                >
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <rect x="17.6" y="5" width="2.4" height="14" rx="1" />
                                    <path d="M5.5 5.8C4.7 5.3 3.8 5.9 3.8 6.8V17.2C3.8 18.1 4.7 18.7 5.5 18.2L14.2 13C14.9 12.5 14.9 11.5 14.2 11L5.5 5.8Z" />
                                  </svg>
                                </button>
                              </div>

                              <div className="flex-1 h-[4.5px] rounded-full bg-white/40 overflow-hidden cursor-pointer">
                                <div className="h-full bg-white rounded-full transition-all duration-200 w-1/3" />
                              </div>

                              <button
                                type="button"
                                onClick={() => {}}
                                className="hover:opacity-80 cursor-pointer shrink-0"
                                aria-label="صدا"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="absolute bottom-3.5 inset-x-0 z-20 flex items-center justify-center gap-2">
                              {galleryPhotos.map((_, dIdx) => (
                                <button
                                  key={`dot-${dIdx}`}
                                  type="button"
                                  onClick={() => setProductLightboxIdx(dIdx)}
                                  aria-label={`اسلاید ${dIdx + 1}`}
                                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                                    productLightboxIdx === dIdx
                                      ? 'w-3 h-3 bg-white shadow-xs'
                                      : 'w-2 h-2 bg-white/65 hover:bg-white'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={`prod-lb-slide-${slideIdx}`}
                        className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isCurrent
                            ? 'opacity-100 z-[2]'
                            : 'opacity-0 z-[1] pointer-events-none'
                        }`}
                        onMouseMove={(e) => {
                          if (isCurrent) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                            const y = ((e.clientY - rect.top) / rect.height) * 100;
                            e.currentTarget.style.setProperty('--x', `${x}%`);
                            e.currentTarget.style.setProperty('--y', `${y}%`);
                          }
                        }}
                        style={{
                          backgroundImage: `url(${item.url})`,
                          backgroundPosition: 'var(--x, 50%) var(--y, 50%)',
                          backgroundSize: '200%',
                        }}
                      >
                        <img
                          src={item.url}
                          alt={`${product.name} گالری ${slideIdx + 1}`}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                            isCurrent ? 'opacity-100' : 'opacity-0'
                          } hover:opacity-0`}
                        />
                      </div>
                    );
                  }
                })}

                {galleryPhotos.length > 1 && (
                  <div className="absolute bottom-3.5 inset-x-0 z-20 flex items-center justify-center gap-2">
                    {galleryPhotos.map((_, dotIdx) => {
                      const isActiveDot = productLightboxIdx === dotIdx;
                      const dist = Math.abs(dotIdx - productLightboxIdx);
                      return (
                        <button
                          key={`prod-lb-dot-${dotIdx}`}
                          type="button"
                          onClick={() => setProductLightboxIdx(dotIdx)}
                          aria-label={`اسلاید ${dotIdx + 1}`}
                          className={`rounded-full transition-all duration-300 cursor-pointer ${
                            isActiveDot
                              ? 'w-3 h-3 bg-white shadow-xs'
                              : dist === 1
                                ? 'w-2 h-2 bg-white/85'
                                : 'w-1.5 h-1.5 bg-white/65'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {galleryPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setProductLightboxIdx((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
                  }}
                  aria-label="اسلاید قبلی"
                  className="hidden md:flex w-[42px] h-[42px] rounded-[10px] bg-white/60 hover:bg-white text-[#222222] hover:text-[#111111] items-center justify-center shadow-md transition-all duration-200 shrink-0 cursor-pointer z-30"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.1]" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (selectedProduct) {
    return renderProductDetailPage(selectedProduct);
  }

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
                        className="rounded-[16px] border border-[#ebebeb] p-3 flex items-stretch justify-between gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.025)]"
                      >
                        {/* سمت راست کارت موبایل: باکس مربع تصویر با پس‌زمینه خاکستری روشن و نشان Snapp! Pay */}
                        <div
                          onClick={() => {
                            handleViewAndBuyClick(product, currentFinish);
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
                                handleViewAndBuyClick(product, currentFinish);
                              }}
                              className="text-[14px] xs:text-[15px] font-extrabold text-[#1e1e1e] truncate cursor-pointer hover:text-[#b59766] transition-colors"
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
                          <div className="mt-3 flex flex-row items-center justify-between gap-1.5" dir="rtl">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleViewAndBuyClick(
                                    product,
                                    currentFinish,
                                    isOutOfStock
                                  )
                                }
                                className="h-[36px] xs:h-[38px] px-2.5 xs:px-3.5 rounded-[9px] bg-[#f3f3f3] hover:bg-[#242424] active:bg-[#242424] text-[#222222] hover:text-white active:text-white text-[10.5px] xs:text-[11.5px] font-bold transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                              >
                                مشاهده و خرید
                              </button>

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
                                      className="w-[36px] h-[36px] xs:w-[38px] xs:h-[38px] rounded-[10px] bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center transition-colors cursor-not-allowed shrink-0"
                                    >
                                      <BagCross size="20" color="#ea1d2c" variant="Linear" />
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
                                        <Bag size="20" color="currentColor" variant="Linear" />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* کد محصول در سمت چپ */}
                            <div className="text-left leading-tight shrink-0">
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

        {/* شبکه ۳ ستونه کارت‌های محصولات یا حالت «موردی یافت نشد!» در سمت چپ سایدبار (بدون لایه بک‌گراند زیرین) */}
        <div className="flex-1 w-full min-w-0 bg-transparent p-0">
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
                  className="group rounded-[16px] border border-[#e5e5e5] p-3.5 sm:p-4 pb-5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      onClick={() => {
                        if (isOutOfStock) return;
                        if (!isCard3D) {
                          handleViewAndBuyClick(product, currentFinish);
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

                        <button
                          type="button"
                          onClick={(e) => toggleCard3D(product.id, e)}
                          title={
                            isCard3D
                              ? 'بازگشت به تصویر محصول'
                              : 'تبدیل فوری به مدل سه‌بعدی (3D)'
                          }
                          className={`absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                            isCard3D
                              ? 'bg-[#b59766] text-white opacity-100'
                              : 'bg-white/95 hover:bg-[#262626] text-[#262626] hover:text-white border border-[#e5e5e5] opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Box className="w-3 h-3" />
                          <span>{isCard3D ? 'نمای 3D فعال' : '3D خودکار'}</span>
                        </button>

                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#e8e4dc] shadow-2xs transition-opacity ${
                            currentFinish !== 'original' || isCard3D
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {CARD_PLATING_FINISHES.map((finishKey) => {
                              const preset = FINISH_PRESETS[finishKey];
                              return (
                                <button
                                  key={finishKey}
                                  type="button"
                                  onClick={() =>
                                    setCardFinishes((prev) => ({
                                      ...prev,
                                      [product.id]: finishKey,
                                    }))
                                  }
                                  title={preset.label}
                                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                                    currentFinish === finishKey
                                      ? 'scale-125 border-[#222222] ring-1 ring-[#b59766]'
                                      : 'border-black/20 hover:scale-110'
                                  }`}
                                  style={{
                                    background: preset.swatch,
                                  }}
                                />
                              );
                            })}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium text-[#666] truncate max-w-[90px]">
                              {activeFinishPreset.label}
                            </span>
                            {currentFinish !== 'original' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setCardFinishes((prev) => ({
                                    ...prev,
                                    [product.id]: 'original',
                                  }))
                                }
                                title="بازنشانی به رنگ اصلی"
                                className="text-[10px] text-[#666] hover:text-[#222] flex items-center cursor-pointer"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                    </div>

                    <div className="mt-4 px-1.5 text-right">
                      <h3
                        onClick={() => {
                          if (isOutOfStock) return;
                          handleViewAndBuyClick(product, currentFinish);
                        }}
                        className={`text-[17.5px] sm:text-[18.5px] font-bold text-[#1f1f1f] transition-colors ${
                          isOutOfStock
                            ? 'cursor-not-allowed'
                            : 'hover:text-[#b59766] cursor-pointer'
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

                  <div className="mt-5 px-1.5 flex flex-row items-center justify-between gap-2.5" dir="rtl">
                    <div className="flex items-center gap-2.5">
                      {loadingMap[product.id] ? (
                        <button
                          type="button"
                          disabled
                          className="h-11 sm:h-12 min-w-[115px] sm:min-w-[142px] px-3.5 sm:px-6 rounded-[12px] bg-[#242424] text-white flex items-center justify-center gap-2 transition-all cursor-wait"
                          title="در حال بارگذاری..."
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="w-2 h-2 rounded-full bg-white/45 animate-pulse [animation-delay:160ms]" />
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse [animation-delay:320ms]" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleViewAndBuyClick(product, currentFinish)}
                          className="h-11 sm:h-12 min-w-[115px] sm:min-w-[142px] px-3.5 sm:px-6 rounded-[12px] text-[12.5px] sm:text-[13px] font-bold transition-colors whitespace-nowrap bg-[#f3f3f3] text-[#222222] hover:bg-[#242424] hover:text-white cursor-pointer"
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
                              onClick={() => triggerTemporaryTooltip(product.id)}
                              aria-label="محصول در انبار وجود ندارد"
                              className="w-12 h-12 rounded-[14px] bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center transition-colors cursor-not-allowed shrink-0"
                            >
                              <BagCross size="24" color="#ea1d2c" variant="Linear" />
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
                              className={`relative w-12 h-12 rounded-[12px] flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
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
                                <Bag size="24" color="currentColor" variant="Linear" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-left leading-tight shrink-0">
                      <span className="block text-[13px] font-bold text-[#2b2b2b]">
                        کد محصول
                      </span>
                      <span className="block text-[13px] font-medium text-[#757575] tabular-nums mt-1">
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
