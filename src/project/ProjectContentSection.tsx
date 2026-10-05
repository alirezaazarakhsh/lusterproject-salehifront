import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { SectionHeading } from '../components/Ornaments';
import { AppToast } from '../components/InteractiveModals';
import { TransparentProductImage } from '../components/TransparentProductImage';
import {
  getCurrentProjectSlug,
  navigateToProjectSlug,
} from '../utils/navigation';
import {
  GENERATED_IMAGES,
  SALEHI_COLLECTION_PRODUCTS,
  ChandelierProduct,
  ExecutedProject,
} from '../data/chandelierData';
import { ALL_INITIAL_PROJECTS, SeedProjectItem } from '../data/allDatabaseProjectsSeed';
import aboutGalleryShowroomImg from '../assets/images/about_gallery_showroom_1790844789780.jpg';
import aboutGalleryEmeraldPalaceImg from '../assets/images/about_gallery_emerald_palace_1790844830735.jpg';
import aboutGalleryGrandAtelierImg from '../assets/images/about_gallery_grand_atelier_1790845407976.jpg';
import aboutGalleryModernVillaImg from '../assets/images/about_gallery_modern_villa_1790844817623.jpg';
import aboutGalleryRoyalStaircaseImg from '../assets/images/about_gallery_royal_staircase_1790845421517.jpg';

export interface ProjectPageItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  categoryTab: 'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential';
  categoryLabel?: string;
  image?: string;
  description: string;
  ownerName?: string;
  projectDate?: string;
  initialLikes?: number;
  galleryImages?: string[];
  chandeliersList?: Array<{
    name: string;
    code: string;
    image: string;
    desc: string;
  }>;
}

interface ProjectCategoryTab {
  id: 'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential';
  label: string;
  badgeCountLabel: string;
}

const PROJECT_CATEGORY_TABS: ProjectCategoryTab[] = [
  { id: 'gov', label: 'ارگان های دولتی', badgeCountLabel: '۱۷۳ مجموعه پروژه' },
  { id: 'commercial', label: 'ارگان های تجاری', badgeCountLabel: '۹۴ مجموعه پروژه' },
  { id: 'mosques', label: 'مساجد ایران', badgeCountLabel: '۴۲ مجموعه پروژه' },
  { id: 'restaurants', label: 'رستوران های بزرگ', badgeCountLabel: '۶۸ مجموعه پروژه' },
  { id: 'residential', label: 'منازل مسکونی', badgeCountLabel: '۱۲۵ مجموعه پروژه' },
];

/**
 * آیکون دقیق دو رنگ Play (دقیقاً مطابق فایل ارسالی play.png در عکس اول)
 */
export const CustomPlayDuotoneIcon: React.FC<{ className?: string }> = ({
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
 * آیکون دایره با علامت بعلاوه (+) برای دکمه طلایی/قهوه‌ای افزوده شده به سبد خرید
 */
const PlusCircleIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="8.5" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

/**
 * آیکون قرمز ناموجود در انبار (سبد خرید با دسته‌های باز و علامت ضربدر × در مرکز)
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
 * ۱. آیکون دقیق شهر پذیرش اجرایی پروژه (location-tick.png)
 */
const ProjectLocationTickIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.62 8.49C5.59 -0.17 18.42 -0.16 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.25 11.5L10.75 13L14.75 9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۲. آیکون دقیق تاریخ انجام پروژه (receipt-item.png)
 */
const ProjectReceiptItemIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 7V21C2 21.83 2.94 22.3 3.6 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.29 22.29C8.68 22.68 9.32 22.68 9.71 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 13.01H12"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9.01001H12"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="5.995" cy="13" r="1.05" fill="currentColor" />
    <circle cx="5.995" cy="9" r="1.05" fill="currentColor" />
  </svg>
);

/**
 * ۳. آیکون دقیق مالک پروژه (frame.png)
 */
const ProjectOwnerFrameIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="6.75"
      r="4.75"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.08 14.15C14.29 12.29 9.74 12.29 6.93 14.15C5.66 15 4.96 16.15 4.96 17.38C4.96 18.61 5.66 19.75 6.92 20.59C8.32 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون دقیق گالری بدون عکس شاخص
 */
export const ProjectNoImageIcon: React.FC<{ className?: string }> = ({
  className = 'w-[76px] h-[76px] sm:w-[84px] sm:h-[84px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="#cccccc"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
      stroke="#cccccc"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
      stroke="#cccccc"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * تصویر برداری دقیق حالت تب بدون پروژه (Illustration found.png)
 */
export const EmptyProjectsIllustration: React.FC<{ className?: string }> = ({
  className = 'w-[220px] h-[190px] sm:w-[255px] sm:h-[220px]',
}) => (
  <svg
    viewBox="0 0 280 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter
        id="docCardShadow"
        x="68"
        y="36"
        width="132"
        height="158"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="0"
          dy="6"
          stdDeviation="8"
          floodColor="#000000"
          floodOpacity="0.04"
        />
      </filter>
      <filter
        id="badgeCardShadow"
        x="168"
        y="20"
        width="94"
        height="68"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="0"
          dy="6"
          stdDeviation="8"
          floodColor="#8ea6b8"
          floodOpacity="0.12"
        />
      </filter>
    </defs>

    <circle cx="142" cy="120" r="94" fill="#f2f2f2" />

    <path
      d="M27 103 C 48 96, 69 80, 74 63 C 77 53, 66 47, 58 53 C 51 58, 55 69, 67 68 C 80 67, 94 53, 103 39"
      stroke="#18222c"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <g filter="url(#docCardShadow)">
      <rect x="86" y="46" width="96" height="122" rx="16" fill="#ffffff" />
    </g>
    <rect x="100" y="66" width="54" height="5.5" rx="2.75" fill="#b08c57" />
    <rect x="100" y="88" width="66" height="5" rx="2.5" fill="#d5d5d5" />
    <rect x="100" y="108" width="48" height="5" rx="2.5" fill="#d5d5d5" />
    <rect x="100" y="128" width="48" height="5" rx="2.5" fill="#d5d5d5" />
    <rect x="100" y="148" width="48" height="5" rx="2.5" fill="#d5d5d5" />

    <g filter="url(#badgeCardShadow)">
      <rect x="184" y="32" width="60" height="32" rx="7" fill="#ffffff" />
    </g>
    <circle cx="197" cy="48" r="4.5" fill="#cbc5d6" />
    <rect x="208" y="44" width="26" height="8" rx="4" fill="#d5d5d5" />

    <path
      d="M75 170 L78 179 L87 182 L78 185 L75 194 L72 185 L63 182 L72 179 Z"
      fill="#ffffff"
      stroke="#a88451"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    <circle cx="234" cy="139" r="5" fill="#a88451" />

    <line
      x1="184"
      y1="154"
      x2="219"
      y2="189"
      stroke="#222222"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <circle cx="156" cy="126" r="40" fill="#ffffff" />
    <path
      d="M124 144 A 36 36 0 0 1 176 96"
      stroke="#e6e6e6"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle
      cx="156"
      cy="126"
      r="40"
      stroke="#222222"
      strokeWidth="6.5"
      fill="none"
    />
    <path
      d="M143 113 L169 139"
      stroke="#222222"
      strokeWidth="9.5"
      strokeLinecap="round"
    />
    <path
      d="M169 113 L143 139"
      stroke="#222222"
      strokeWidth="9.5"
      strokeLinecap="round"
    />
  </svg>
);

const ALL_GALLERY_PHOTOS = [
  GENERATED_IMAGES.projectRoyalRestaurant,
  GENERATED_IMAGES.projectLobbyHotel,
  GENERATED_IMAGES.projectDuplexVilla,
  aboutGalleryRoyalStaircaseImg,
  GENERATED_IMAGES.projectFereshteh,
  aboutGalleryEmeraldPalaceImg,
  aboutGalleryModernVillaImg,
  aboutGalleryShowroomImg,
  aboutGalleryGrandAtelierImg,
  GENERATED_IMAGES.storyPortraitPalace,
  GENERATED_IMAGES.storyPortraitAtrium,
  GENERATED_IMAGES.heroBanner,
];

const DESKTOP_PROJECT_LONG_DESCRIPTION =
  'معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات است. معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات است. معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوستر های گر است. پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات است. معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود.';

const MOBILE_PROJECT_LONG_DESCRIPTION =
  'شرکت صنایع لوستر صالحی از سال 1352 تا کنون فعالیت خود را در زمینه ساخت انواع لوستر و دیگر تجهیزات لوکس آغاز نموده و امروزه بیش از 100 محصول متنوع را با بهره گیری از برترین تکنولوژی روز دنیا و مرغوب ترین مواد اولیه مطابق با استانداردهای اروپایی ، تولید نموده تا فخر صنعت لوستر سازی کشور باشد. این شرکت مفتخر است کلیه محصولات خود را به بیش از 10 کشور اروپایی و آسیایی معرفی نموده که بتواند قدمی در جهت شکوفایی نام ایران بردارد. شرکت صنایع لوستر صالحی از سال 1352 تا کنون فعالیت خود را در زمینه ساخت انواع لوستر و دیگر تجهیزات لوکس آغاز نموده و امروزه بیش از 100 محصول متنوع را با بهره گیری از برترین تکنولوژی روز دنیا و مرغوب ترین مواد اولیه مطابق با استانداردهای اروپایی ، تولید نموده تا فخر صنعت لوستر سازی کشور باشد. این شرکت مفتخر است مجهز میباشد.';

/**
 * ۹ پروژه اصلی صفحه اول تب «ارگان های دولتی»
 */
const GOV_PAGE_1_PROJECTS: ProjectPageItem[] = [
  {
    id: 'gov-p1-1',
    slug: 'kiani-shomali',
    title: 'پروژه منطقه کیانی شمالی',
    location: 'مازندران، چالوس',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: GENERATED_IMAGES.projectRoyalRestaurant,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-2',
    slug: 'kamraniyeh',
    title: 'پروژه منطقه کامرانیه',
    location: 'تهران، تهران',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: GENERATED_IMAGES.projectLobbyHotel,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-3',
    slug: 'zafaraniyeh',
    title: 'پروژه منطقه زعفرانیه',
    location: 'تهران، تهران',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: GENERATED_IMAGES.projectDuplexVilla,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-4',
    slug: 'emami-zar',
    title: 'پروژه منطقه امامی زار',
    location: 'تهران، پردیس',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: aboutGalleryRoyalStaircaseImg,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-5',
    slug: 'heydar-khani',
    title: 'پروژه منطقه حیدر خانی',
    location: 'خراسان رضوی، مشهد',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: GENERATED_IMAGES.storyPortraitAtrium,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-6',
    slug: 'sahel-behesht',
    title: 'پروژه منطقه ساحل بهشت',
    location: 'بندرعباس، قشم',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: aboutGalleryShowroomImg,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-7',
    slug: 'jannat-abad',
    title: 'پروژه منطقه جنت آباد',
    location: 'تهران، تهران',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: aboutGalleryModernVillaImg,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-8',
    slug: 'fereshteh',
    title: 'پروژه منطقه فرشته',
    location: 'تهران، تهران',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: GENERATED_IMAGES.projectFereshteh,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-9',
    slug: 'masoumian',
    title: 'پروژه منطقه معصومیان',
    location: 'شیراز، شیراز',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: aboutGalleryGrandAtelierImg,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
  {
    id: 'gov-p1-10',
    slug: 'elahiyeh-residence',
    title: 'پروژه منطقه الهیه',
    location: 'تهران، الهیه',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: GENERATED_IMAGES.projectLobbyHotel,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  },
];

/**
 * صفحه دوم تب «ارگان های دولتی» (حالت پروژه‌های بدون تصویر شاخص)
 */
const GOV_PAGE_2_NO_IMAGE_PROJECTS: ProjectPageItem[] =
  GOV_PAGE_1_PROJECTS.map((item, idx) => ({
    ...item,
    id: `gov-p2-${idx + 1}`,
    slug: `${item.slug}-no-image`,
    image: '',
  }));

export const buildProjectsForTabAndPage = (
  tabId: 'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential',
  page: number
): ProjectPageItem[] => {
  if (tabId === 'gov' && page === 1) {
    return GOV_PAGE_1_PROJECTS.map((item, idx) => ({
      ...item,
      galleryImages: [
        item.image || ALL_GALLERY_PHOTOS[idx % ALL_GALLERY_PHOTOS.length],
        ALL_GALLERY_PHOTOS[(idx + 1) % ALL_GALLERY_PHOTOS.length],
        ALL_GALLERY_PHOTOS[(idx + 3) % ALL_GALLERY_PHOTOS.length],
        ALL_GALLERY_PHOTOS[(idx + 5) % ALL_GALLERY_PHOTOS.length],
      ],
    }));
  }
  if (tabId === 'gov' && page === 2) {
    return GOV_PAGE_2_NO_IMAGE_PROJECTS;
  }

  const tabDataSets: Record<
    typeof tabId,
    Array<{
      slug: string;
      title: string;
      location: string;
      noImageOnPage1?: boolean;
    }>
  > = {
    gov: [
      { slug: 'niavaran-hall', title: 'پروژه تالار نیاوران', location: 'تهران، نیاوران' },
      { slug: 'sadabad-palace', title: 'پروژه عمارت سعدآباد', location: 'تهران، شمیرانات' },
      { slug: 'khazar-summit-hall', title: 'پروژه سالن اجلاس خزر', location: 'مازندران، رامسر' },
      { slug: 'morvarid-palace', title: 'پروژه کاخ مروارید مهرشهر', location: 'البرز، کرج' },
      { slug: 'nesfe-jahan-center', title: 'پروژه مرکز همایش‌های نصف جهان', location: 'اصفهان، اصفهان' },
      { slug: 'ayeneh-khaneh-hall', title: 'پروژه تالار آیینه‌خانه', location: 'فارس، شیراز', noImageOnPage1: true },
      { slug: 'elahiyeh-diplomatic', title: 'پروژه ساختمان دیپلماتیک الهیه', location: 'تهران، الهیه' },
      { slug: 'ali-qapu-novin', title: 'پروژه عمارت عالی‌قاپو نوین', location: 'آذربایجان شرقی، تبریز' },
      { slug: 'kish-ceremonial-hall', title: 'پروژه سالن تشریفات کیش', location: 'هرمزگان، کیش' },
    ],
    commercial: [
      { slug: 'royal-mall-elahiyeh', title: 'پروژه رویال مال الهیه', location: 'تهران، الهیه' },
      { slug: 'espinas-hotel', title: 'پروژه هتل ۵ ستاره اسپیناس', location: 'تهران، سعادت‌آباد' },
      { slug: 'palladium-mall', title: 'پروژه مرکز خرید پالادیوم', location: 'تهران، زعفرانیه' },
      { slug: 'world-trade-tower', title: 'پروژه برج تجارت جهانی', location: 'آذربایجان شرقی، تبریز' },
      { slug: 'sam-jewelry-gallery', title: 'پروژه گالری طلا و جواهر سام', location: 'تهران، فرشته' },
      { slug: 'fadak-city-center', title: 'پروژه سیتی سنتر فدک', location: 'اصفهان، مرداویج', noImageOnPage1: true },
      { slug: 'roma-tower-lobby', title: 'پروژه لابی برج مسکونی-تجاری روما', location: 'تهران، کامرانیه' },
      { slug: 'damoon-mall', title: 'پروژه مجتمع تجاری دامون', location: 'هرمزگان، کیش' },
      { slug: 'ghasr-monshi-hotel', title: 'پروژه هتل بوتیک قصر منشی', location: 'اصفهان، چهارباغ' },
    ],
    mosques: [
      { slug: 'fakhrabad-mosque', title: 'پروژه شبستان مسجد جامع فخرآباد', location: 'تهران، بهارستان' },
      { slug: 'chahardah-masoum-mosque', title: 'پروژه گنبد اصلی مسجد چهارده معصوم', location: 'تهران، شهرری' },
      { slug: 'tajrish-grand-mosque', title: 'پروژه رواق مرکزی مسجد اعظم تجریش', location: 'تهران، تجریش' },
      { slug: 'rey-grand-mosalla', title: 'پروژه تالار محراب مصلی بزرگ ری', location: 'تهران، ری' },
      { slug: 'nasirolmolk-mosque', title: 'پروژه شبستان مسجد نصیرالملک', location: 'فارس، شیراز' },
      { slug: 'goharshad-mosque-hall', title: 'پروژه رواق مسجد گوهرشاد', location: 'خراسان رضوی، مشهد', noImageOnPage1: true },
      { slug: 'kaboud-mosque-tabriz', title: 'پروژه شبستان مسجد کبود', location: 'آذربایجان شرقی، تبریز' },
      { slug: 'sheikh-lotfollah-dome', title: 'پروژه گنبد مسجد شیخ لطف‌الله', location: 'اصفهان، میدان نقش جهان' },
      { slug: 'jamkaran-central-courtyard', title: 'پروژه صحن اصلی مسجد جمکران', location: 'قم، قم' },
    ],
    restaurants: [
      { slug: 'shandiz-royal-restaurant', title: 'پروژه رستوران سلطنتی شاندیز', location: 'خراسان رضوی، مشهد' },
      { slug: 'aghdasiyeh-royal-lounge', title: 'پروژه رویال لانژ اقدسیه', location: 'تهران، اقدسیه' },
      { slug: 'darband-mansion', title: 'پروژه عمارت پذیرایی دربند', location: 'تهران، دربند' },
      { slug: 'ghasr-sefid-hall', title: 'پروژه تالار مجلل قصر سفید', location: 'تهران، شهرک غرب' },
      { slug: 'haft-khan-restaurant', title: 'پروژه رستوران سنتی هفت‌خوان', location: 'فارس، شیراز' },
      { slug: 'namak-abroud-banquet', title: 'پروژه بانکت هال ساحلی نمک‌آبرود', location: 'مازندران، چالوس', noImageOnPage1: true },
      { slug: 'ferdows-mansion-cafe', title: 'پروژه کافه‌رستوران عمارت فردوس', location: 'تهران، ولیعصر' },
      { slug: 'mehrgan-hall', title: 'پروژه تالار تشریفاتی مهرگان', location: 'البرز، مهرشهر' },
      { slug: 'velanjak-nations-restaurant', title: 'پروژه رستوران ملل ولنجک', location: 'تهران، ولنجک' },
    ],
    residential: [
      { slug: 'farmaniyeh', title: 'پروژه منطقه فرمانیه', location: 'تهران، پردیس' },
      { slug: 'lavasanat-classic-mansion', title: 'پروژه عمارت کلاسیک لواسانات', location: 'تهران، لواسان' },
      { slug: 'niavaran-private-villa', title: 'پروژه باغ‌ویلا اختصاصی نیاوران', location: 'تهران، نیاوران' },
      { slug: 'zafaraniyeh-garden-tower', title: 'پروژه رزیدنس برج باغ زعفرانیه', location: 'تهران، زعفرانیه' },
      { slug: 'khazarshahr-coastal-villa', title: 'پروژه ویلای ساحلی خزرشهر', location: 'مازندران، بابلسر' },
      { slug: 'chenaran-penthouse', title: 'پروژه پنت‌هاوس برج چناران', location: 'تهران، فرشته' },
      { slug: 'motel-ghoo-duplex', title: 'پروژه عمارت دوبلکس متل قو', location: 'مازندران، سلمان‌شهر', noImageOnPage1: true },
      { slug: 'darrous-neoclassic-apt', title: 'پروژه آپارتمان نئوکلاسیک دروس', location: 'تهران، دروس' },
      { slug: 'kouhsar-private-villa', title: 'پروژه ویلای اختصاصی کوهسار', location: 'البرز، کردان' },
    ],
  };

  const baseList = tabDataSets[tabId];
  const pageSuffixes = [
    '',
    ' (فاز ۲)',
    ' (بخش شمالی)',
    ' (فاز ۳)',
    ' (تالار شرقی)',
    ' (مجموعه VIP)',
  ];
  const suffix = pageSuffixes[(page - 1) % pageSuffixes.length] || '';

  return baseList.map((_, idx) => {
    const rotatedIdx = (idx + (page - 1) * 3) % baseList.length;
    const picked = baseList[rotatedIdx];
    const photoIdx =
      (idx * 2 +
        (page - 1) * 3 +
        (tabId === 'commercial'
          ? 1
          : tabId === 'mosques'
          ? 2
          : tabId === 'restaurants'
          ? 4
          : 7)) %
      ALL_GALLERY_PHOTOS.length;

    const mainImg =
      tabId === 'mosques' && idx === 0
        ? GENERATED_IMAGES.projectMosqueDome
        : ALL_GALLERY_PHOTOS[photoIdx];

    const hasNoImage =
      (page === 1 && picked.noImageOnPage1) ||
      (page > 1 && (idx === (page + 1) % 9 || idx === (page + 5) % 9));

    return {
      id: `${tabId}-p${page}-${idx + 1}`,
      slug: page === 1 ? picked.slug : `${picked.slug}-p${page}`,
      title: `${picked.title}${suffix}`,
      location: picked.location,
      categoryTab: tabId,
      categoryLabel: 'منازل مسکونی',
      image: hasNoImage ? '' : mainImg,
      description: DESKTOP_PROJECT_LONG_DESCRIPTION,
      galleryImages: [
        mainImg,
        ALL_GALLERY_PHOTOS[(photoIdx + 1) % ALL_GALLERY_PHOTOS.length],
        ALL_GALLERY_PHOTOS[(photoIdx + 3) % ALL_GALLERY_PHOTOS.length],
        ALL_GALLERY_PHOTOS[(photoIdx + 5) % ALL_GALLERY_PHOTOS.length],
      ],
    };
  });
};

const findProjectBySlug = (
  rawSlug: string | null,
  customProjects?: ExecutedProject[]
): ProjectPageItem | null => {
  if (!rawSlug) return null;
  const decoded = decodeURIComponent(rawSlug).trim().toLowerCase();
  if (!decoded) return null;

  // ۱. بررسی پروژه‌های ثبت‌شده در دیتابیس سایت با اسلاگ اختصاصی یا شناسه
  if (customProjects && customProjects.length > 0) {
    const foundDb = customProjects.find((p) => {
      const s = (p.slug || '').toLowerCase();
      const pid = String(p.id).toLowerCase();
      const pCleanId = pid.replace(/^proj-/, '');
      const t = (p.title || '').toLowerCase().replace(/\s+/g, '-');
      return (
        s === decoded ||
        pid === decoded ||
        pCleanId === decoded ||
        t === decoded
      );
    });

    if (foundDb) {
      let parsedChs: any[] = [];
      if (Array.isArray((foundDb as any).chandeliersList) && (foundDb as any).chandeliersList.length > 0) {
        parsedChs = (foundDb as any).chandeliersList;
      } else if (foundDb.usedChandeliersText) {
        const tagMatch = foundDb.usedChandeliersText.match(/<!--CHANDELIERS_DATA-->([\s\S]*?)<!--\/CHANDELIERS_DATA-->/);
        if (tagMatch) {
          try {
            parsedChs = JSON.parse(tagMatch[1]);
          } catch {}
        } else {
          const jsonMatch = foundDb.usedChandeliersText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) {
            try {
              parsedChs = JSON.parse(jsonMatch[0]);
            } catch {}
          }
        }
      }

      const mainImg =
        foundDb.mainImage ||
        foundDb.galleryImages?.[0] ||
        GENERATED_IMAGES.projectRoyalRestaurant;
      const gallery =
        foundDb.galleryImages && foundDb.galleryImages.length > 0
          ? foundDb.galleryImages
          : [
              mainImg,
              GENERATED_IMAGES.projectLobbyHotel,
              GENERATED_IMAGES.projectFereshteh,
              GENERATED_IMAGES.heroBanner,
            ];

      return {
        id: foundDb.id,
        slug: foundDb.slug || `project-${foundDb.id}`,
        title: foundDb.title,
        location: foundDb.district || (foundDb as any).locationBadge || '',
        categoryTab: (foundDb.categoryTab as any) || 'residential',
        categoryLabel:
          PROJECT_CATEGORY_TABS.find((t) => t.id === foundDb.categoryTab)
            ?.label || 'پروژه‌های اجرایی',
        image: mainImg,
        description: foundDb.description || '',
        galleryImages: gallery,
        projectDate: (foundDb as any).dateBadge || '',
        ownerName: (foundDb as any).ownerName || '',
        initialLikes: Number((foundDb as any).likesCount) || 0,
        chandeliersList: parsedChs,
      };
    }
  }

  const tabs: Array<'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential'> = [
    'gov',
    'commercial',
    'mosques',
    'restaurants',
    'residential',
  ];

  for (const tab of tabs) {
    for (let page = 1; page <= 6; page++) {
      const items = buildProjectsForTabAndPage(tab, page);
      const found = items.find(
        (p) =>
          p.slug.toLowerCase() === decoded ||
          p.id.toLowerCase() === decoded ||
          p.title.replace(/\s+/g, '-') === decoded
      );
      if (found) return found;
    }
  }

  return {
    id: `custom-${decoded}`,
    slug: decoded,
    title: 'پروژه منطقه فرمانیه',
    location: 'تهران، پردیس',
    categoryTab: 'gov',
    categoryLabel: 'منازل مسکونی',
    image: GENERATED_IMAGES.projectRoyalRestaurant,
    description: DESKTOP_PROJECT_LONG_DESCRIPTION,
  };
};

const toPersianDigits = (num: number): string =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/**
 * محصولات استفاده شده در پروژه داخلی (دقیقاً مطابق عکس ۲، ۳، ۸ و ۹)
 */
interface ProjectUsedProductRow {
  id: string;
  name: string;
  subtitle: string;
  desktopPriceText: string;
  mobilePriceText: string;
  desktopPriceLabel: string;
  codeText: string;
  mobileCodeText: string;
  image: string;
  linkedProduct: ChandelierProduct;
  initialAddedCount: number;
  isOutOfStock?: boolean;
  simulateErrorOnCart?: boolean;
}

const PROJECT_USED_PRODUCTS_LIST: ProjectUsedProductRow[] = [
  {
    id: 'used-prod-1',
    name: 'لوستر ملکه شاه ۱۲ شاخه تک',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    desktopPriceLabel: 'قیمت محصول :',
    desktopPriceText: 'هزینه بدون نصب ۱۲,۴۶۰,۰۰۰ تومان',
    mobilePriceText: '۱۲,۵۰۰,۰۰۰ تومان',
    codeText: 'به شماره انبار ۱۲۸۹۸۲',
    mobileCodeText: '۱۲۸۹۸۲',
    image: GENERATED_IMAGES.shahMalakeh,
    linkedProduct: {
      ...SALEHI_COLLECTION_PRODUCTS[0],
      id: 'project-used-prod-1',
      name: 'لوستر ملکه شاه ۱۲ شاخه تک',
      priceFormatted: '۱۲,۴۶۰,۰۰۰ تومان',
      priceNumeric: 12460000,
      image: GENERATED_IMAGES.shahMalakeh,
      outOfStock: false,
    },
    initialAddedCount: 0,
  },
  {
    id: 'used-prod-2',
    name: 'آباژور صاف کریستالی',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    desktopPriceLabel: 'قیمت محصول :',
    desktopPriceText: 'هزینه بدون نصب ۳۴,۵۸۲,۰۰۰ تومان',
    mobilePriceText: '۱۲,۵۰۰,۰۰۰ تومان',
    codeText: 'به شماره انبار ۱۲۸۹۸۲',
    mobileCodeText: '۱۲۸۹۸۲',
    image: GENERATED_IMAGES.crystaliCherub,
    linkedProduct: {
      ...(SALEHI_COLLECTION_PRODUCTS[1] || SALEHI_COLLECTION_PRODUCTS[0]),
      id: 'project-used-prod-2',
      name: 'آباژور صاف کریستالی',
      priceFormatted: '۳۴,۵۸۲,۰۰۰ تومان',
      priceNumeric: 34582000,
      image: GENERATED_IMAGES.crystaliCherub,
      outOfStock: false,
    },
    initialAddedCount: 0,
  },
  {
    id: 'used-prod-3',
    name: 'لوستر رسانس ۱۰ شاخه',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    desktopPriceLabel: 'قیمت محصول :',
    desktopPriceText: 'هزینه بدون نصب ۱۱۲,۵۰۰,۰۰۰ تومان',
    mobilePriceText: '۱۲,۵۰۰,۰۰۰ تومان',
    codeText: 'به شماره انبار ۱۲۸۹۸۲',
    mobileCodeText: '۱۲۸۹۸۲',
    image: GENERATED_IMAGES.resansRoses,
    linkedProduct: {
      ...(SALEHI_COLLECTION_PRODUCTS[1] || SALEHI_COLLECTION_PRODUCTS[0]),
      id: 'project-used-prod-3',
      name: 'لوستر رسانس ۱۰ شاخه',
      priceFormatted: '۱۱۲,۵۰۰,۰۰۰ تومان',
      priceNumeric: 112500000,
      image: GENERATED_IMAGES.resansRoses,
      outOfStock: false,
    },
    initialAddedCount: 0,
  },
  {
    id: 'used-prod-4',
    name: 'لوستر کریستالی',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    desktopPriceLabel: 'قیمت لوستر :',
    desktopPriceText: 'هزینه بدون نصب ۱۲,۴۶۰,۰۰۰ تومان',
    mobilePriceText: '۱۲,۵۰۰,۰۰۰ تومان',
    codeText: 'به شماره انبار ۱۲۸۹۸۲',
    mobileCodeText: '۱۲۸۹۸۲',
    image: GENERATED_IMAGES.crystaliGold,
    linkedProduct: {
      ...(SALEHI_COLLECTION_PRODUCTS[3] || SALEHI_COLLECTION_PRODUCTS[0]),
      id: 'project-used-prod-4',
      name: 'لوستر کریستالی',
      priceFormatted: '۱۲,۴۶۰,۰۰۰ تومان',
      priceNumeric: 12460000,
      image: GENERATED_IMAGES.crystaliGold,
      outOfStock: true,
    },
    initialAddedCount: 0,
    isOutOfStock: true,
  },
];

interface ProjectContentSectionProps {
  projects?: ExecutedProject[];
  products?: ChandelierProduct[];
  onOpenProductModal?: (product: ChandelierProduct) => void;
  onAddToCart?: (product: ChandelierProduct, qty?: number) => void;
  onShowToast?: (
    type: AppToast['type'],
    title: string,
    message: string,
    onComplete?: () => void
  ) => void;
  onOpenLogin?: () => void;
  isLoggedIn?: boolean;
}

export const ProjectContentSection: React.FC<ProjectContentSectionProps> = ({
  projects,
  products,
  onOpenProductModal,
  onAddToCart,
  onShowToast,
  onOpenLogin,
  isLoggedIn = false,
}) => {
  const [activeTab, setActiveTab] = useState<
    'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential'
  >('gov');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [forceNoImageMode] = useState<boolean>(false);
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);
  const tabLoadingTimerRef = useRef<number | null>(null);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);

  const triggerProjectsLoading = (duration = 450) => {
    if (tabLoadingTimerRef.current) {
      window.clearTimeout(tabLoadingTimerRef.current);
    }
    setIsTabLoading(true);
    tabLoadingTimerRef.current = window.setTimeout(() => {
      setIsTabLoading(false);
      tabLoadingTimerRef.current = null;
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (tabLoadingTimerRef.current) {
        window.clearTimeout(tabLoadingTimerRef.current);
      }
    };
  }, []);

  // وضعیت صفحه داخلی پروژه (Single Project Page) همراه با همگام‌سازی اسلاگ آدرس (/project/slug)
  const [activeSingleProject, setActiveSingleProject] =
    useState<ProjectPageItem | null>(() =>
      findProjectBySlug(getCurrentProjectSlug(), projects)
    );
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [, setLikesUpdateTick] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('app_project_likes_stats');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Object.values(parsed).some((v) => typeof v === 'number' && v > 500)) {
          localStorage.removeItem('app_project_likes_stats');
          setLikesUpdateTick((t) => t + 1);
        }
      }
    } catch {}

    const handleLikesUpdated = () => {
      setLikesUpdateTick((t) => t + 1);
    };
    window.addEventListener('app-project-liked', handleLikesUpdated);
    window.addEventListener('app-projects-updated', handleLikesUpdated);
    return () => {
      window.removeEventListener('app-project-liked', handleLikesUpdated);
      window.removeEventListener('app-projects-updated', handleLikesUpdated);
    };
  }, []);
  const [loadingDetailBtnId, setLoadingDetailBtnId] = useState<string | null>(
    null
  );
  const [addedCounts, setAddedCounts] = useState<Record<string, number>>({});
  const [outOfStockMode] = useState<boolean>(false);
  const [activeTooltipRowId, setActiveTooltipRowId] = useState<string | null>(
    null
  );

  // همگام‌سازی پروژه‌های دیتابیس در صورت تغییر یا رفرش با اسلاگ فعال در URL
  useEffect(() => {
    const slugInUrl = getCurrentProjectSlug();
    if (slugInUrl && projects && projects.length > 0) {
      const found = findProjectBySlug(slugInUrl, projects);
      if (found) {
        setActiveSingleProject(found);
      }
    }
  }, [projects]);

  // وضعیت لایت‌باکس تمام‌صفحه عکس و ویدیو (مطابق عکس ۶، ۷ و ۱۴)
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxSlideIdx, setLightboxSlideIdx] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(36);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

  // همگام‌سازی با تغییر اسلاگ در URL (/project/slug) یا بازگشت به لیست (/project)
  useEffect(() => {
    const handleResetToGrid = () => {
      const slugInUrl = getCurrentProjectSlug();
      if (!slugInUrl) {
        setActiveSingleProject(null);
        setIsLightboxOpen(false);
      } else {
        setActiveSingleProject(findProjectBySlug(slugInUrl, projects));
      }
    };

    const handleSlugChange = (e: Event) => {
      const nextSlug = (e as CustomEvent<string | null>)?.detail ?? getCurrentProjectSlug();
      if (!nextSlug) {
        setActiveSingleProject(null);
        setIsLightboxOpen(false);
      } else {
        setActiveGalleryIdx(0);
        setActiveSingleProject(findProjectBySlug(nextSlug, projects));
      }
    };

    window.addEventListener('app-route-change', handleResetToGrid);
    window.addEventListener('app-project-slug-change', handleSlugChange);
    return () => {
      window.removeEventListener('app-route-change', handleResetToGrid);
      window.removeEventListener('app-project-slug-change', handleSlugChange);
    };
  }, [projects]);

  // انیمیشن نوار پیشرفت ویدیو در زمان پخش در لایت‌باکس
  useEffect(() => {
    if (!isLightboxOpen || !isVideoPlaying) return;
    const timer = window.setInterval(() => {
      setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 220);
    return () => window.clearInterval(timer);
  }, [isLightboxOpen, isVideoPlaying]);

  const activeTabInfo =
    PROJECT_CATEGORY_TABS.find((t) => t.id === activeTab) ||
    PROJECT_CATEGORY_TABS[0];

  // دریافت مستقیم پروژه‌های این تب از دیتابیس و مرتب‌سازی از جدیدترین به قدیمی‌ترین
  const dbProjectsForTab = (projects || [])
    .filter((p) => p.categoryTab === activeTab)
    .sort((a, b) => {
      const numA = Number(String(a.id).replace(/\D/g, '')) || 0;
      const numB = Number(String(b.id).replace(/\D/g, '')) || 0;
      return numB - numA;
    });

  const mappedDbProjects: ProjectPageItem[] = dbProjectsForTab.map(
    (dbProj, idx) => {
      let parsedChs: any[] = [];
      if (Array.isArray((dbProj as any).chandeliersList) && (dbProj as any).chandeliersList.length > 0) {
        parsedChs = (dbProj as any).chandeliersList;
      } else if (dbProj.usedChandeliersText) {
        const tagMatch = dbProj.usedChandeliersText.match(/<!--CHANDELIERS_DATA-->([\s\S]*?)<!--\/CHANDELIERS_DATA-->/);
        if (tagMatch) {
          try {
            parsedChs = JSON.parse(tagMatch[1]);
          } catch {}
        } else {
          const jsonMatch = dbProj.usedChandeliersText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) {
            try {
              parsedChs = JSON.parse(jsonMatch[0]);
            } catch {}
          }
        }
      }

      return {
        id: String(dbProj.id),
        slug:
          (dbProj as any).slug ||
          String(dbProj.id).replace(/^proj-/, '') ||
          `project-${idx + 1}`,
        title: dbProj.title,
        description: dbProj.description || '',
        image: dbProj.mainImage || dbProj.galleryImages?.[0] || undefined,
        galleryImages:
          dbProj.galleryImages && dbProj.galleryImages.length > 0
            ? dbProj.galleryImages
            : (dbProj.mainImage ? [dbProj.mainImage] : []),
        categoryTab: activeTab,
        categoryLabel: activeTabInfo.label,
        location: dbProj.district || (dbProj as any).locationBadge || '',
        projectDate: (dbProj as any).dateBadge || '',
        ownerName: (dbProj as any).ownerName || '',
        initialLikes: Number((dbProj as any).likesCount) || 0,
        chandeliersList: parsedChs,
      };
    }
  );

  // تبدیل پروژه‌های دیتابیس
  const initialSeedProjectsForTab: ProjectPageItem[] = ALL_INITIAL_PROJECTS
    .filter((p: SeedProjectItem) => p.categoryTab === activeTab)
    .map((p: SeedProjectItem, idx: number) => ({
      id: `seed-${activeTab}-${idx + 1}`,
      slug: p.slug,
      title: p.title,
      description: p.description,
      image: p.mainImage,
      galleryImages: p.galleryImages,
      categoryTab: activeTab,
      categoryLabel: activeTabInfo.label,
      location: p.district || p.locationBadge || '',
      projectDate: p.dateBadge || '',
      ownerName: '',
      initialLikes: 0,
      chandeliersList: p.chandeliersList,
    }));

  // ترکیب هوشمند پروژه‌های دیتابیس با پروژه‌های کامل کاتالوگ (بدون تکرار اسلاگ)
  const combinedProjects: ProjectPageItem[] = [...mappedDbProjects];
  initialSeedProjectsForTab.forEach((seedP) => {
    if (
      !combinedProjects.some(
        (cp) => cp.slug === seedP.slug || String(cp.id) === String(seedP.id)
      )
    ) {
      combinedProjects.push(seedP);
    }
  });

  const rawTabProjects =
    combinedProjects.length > 0 ? combinedProjects : initialSeedProjectsForTab;

  // تعداد پروژه‌ها در هر صفحه: ۶ عدد (۲ ردیف کامل ۳ تایی متناسب با چیدمان ۳ ستونه دسکتاپ)
  const PROJECTS_PER_PAGE = 6;

  // تکمیل خودکار موارد ناقص تا تمام ردیف‌های شبکه ۳ تایی دسکتاپ کاملاً پر باشند
  const allTabProjects = [...rawTabProjects];
  if (allTabProjects.length > 0 && allTabProjects.length % PROJECTS_PER_PAGE !== 0) {
    const remainder = allTabProjects.length % PROJECTS_PER_PAGE;
    if (remainder < PROJECTS_PER_PAGE) {
      const needed = PROJECTS_PER_PAGE - remainder;
      for (let i = 0; i < needed; i++) {
        const sourceItem =
          rawTabProjects[i % rawTabProjects.length] || rawTabProjects[0];
        if (sourceItem) {
          allTabProjects.push({
            ...sourceItem,
            id: `${sourceItem.id}-pad-${i + 1}`,
            slug: `${sourceItem.slug}-ref-${i + 1}`,
          });
        }
      }
    }
  }

  const totalPages = Math.max(
    1,
    Math.ceil(allTabProjects.length / PROJECTS_PER_PAGE)
  );
  const currentProjects = allTabProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );
  const isTabEmpty = currentProjects.length === 0;

  const getTabProjectsCount = (
    tabId: 'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential'
  ): number => {
    return (projects || []).filter((p) => p.categoryTab === tabId).length;
  };

  const handleBackToProjectsList = () => {
    setActiveSingleProject(null);
    setIsLightboxOpen(false);
    navigateToProjectSlug(null);
  };

  const handleSelectTab = (
    tabId: 'gov' | 'commercial' | 'mosques' | 'restaurants' | 'residential'
  ) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setActiveSingleProject(null);
    navigateToProjectSlug(null);
    triggerProjectsLoading(450);
  };

  const handlePageChange = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    if (clamped === currentPage) return;
    setCurrentPage(clamped);
    triggerProjectsLoading(450);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleOpenProjectDetails = (
    project: ProjectPageItem,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
    }
    if (loadingProjectId) return;
    setLoadingProjectId(project.id);
    window.setTimeout(() => {
      setLoadingProjectId(null);
      setActiveGalleryIdx(0);
      setActiveSingleProject(project);
      navigateToProjectSlug(project.slug);
    }, 360);
  };

  const handleToggleLike = async (project: ProjectPageItem) => {
    const currentlyLiked = Boolean(likedMap[project.id]);
    const nextLiked = !currentlyLiked;
    setLikedMap((prev) => ({ ...prev, [project.id]: nextLiked }));

    const key = project.slug || project.id;
    let updatedCount = 0;
    try {
      const statsRaw = localStorage.getItem('app_project_likes_stats');
      const stats: Record<string, number> = statsRaw ? JSON.parse(statsRaw) : {};
      const prevCount = (stats[key] ?? Number(project.initialLikes)) || 0;
      updatedCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);
      stats[key] = updatedCount;
      if (project.id) stats[project.id] = updatedCount;
      if (project.slug) stats[project.slug] = updatedCount;
      localStorage.setItem('app_project_likes_stats', JSON.stringify(stats));
      window.dispatchEvent(
        new CustomEvent('app-project-liked', {
          detail: { projectId: project.id, slug: project.slug, count: updatedCount },
        })
      );
    } catch {}

    // ارسال درخواست به سرور و دیتابیس
    try {
      const target = project.slug || project.id;
      const res = await fetch(`/api/projects/${target}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: nextLiked }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.likesCount === 'number') {
          const statsRaw = localStorage.getItem('app_project_likes_stats');
          const stats = statsRaw ? JSON.parse(statsRaw) : {};
          stats[key] = data.likesCount;
          if (project.id) stats[project.id] = data.likesCount;
          if (project.slug) stats[project.slug] = data.likesCount;
          localStorage.setItem('app_project_likes_stats', JSON.stringify(stats));
          window.dispatchEvent(
            new CustomEvent('app-project-liked', {
              detail: { projectId: project.id, slug: project.slug, count: data.likesCount },
            })
          );
        }
      }
    } catch (err) {
      console.warn('Project like error:', err);
    }

    if (onShowToast) {
      if (nextLiked) {
        onShowToast(
          'project-like-success',
          'با موفقیت لایک شد',
          'مشتری عزیز از امتیاز دهی به پروژه ما متشکریم.'
        );
      } else {
        onShowToast(
          'project-dislike',
          'لایک پروژه برداشته شد',
          'مشتری عزیز امتیاز شما از این پروژه حذف گردید.'
        );
      }
    }
  };

  const handleProductDetailClick = (row: ProjectUsedProductRow) => {
    if (loadingDetailBtnId) return;
    setLoadingDetailBtnId(row.id);
    window.setTimeout(() => {
      setLoadingDetailBtnId(null);
      onOpenProductModal?.(row.linkedProduct);
    }, 450);
  };

  const handleProductCartClick = async (row: ProjectUsedProductRow) => {
    const isRowOutOfStock = outOfStockMode || Boolean(row.isOutOfStock);
    if (isRowOutOfStock) {
      setActiveTooltipRowId(row.id);
      return;
    }

    if (!isLoggedIn) {
      onShowToast?.(
        'cart-auth-required',
        'مورد ضروری',
        'برای اضافه کردن محصول ابتدا وارد حساب کاربری شوید.',
        () => {
          onOpenLogin?.();
        }
      );
      return;
    }

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('NETWORK_OFFLINE');
      }

      if (row.simulateErrorOnCart) {
        throw new Error('API_ERROR');
      }

      // بررسی در دسترس بودن سرور/API قبل از ثبت در سبد خرید
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await window.fetch(window.location.origin, {
          method: 'HEAD',
          cache: 'no-store',
        });
        if (!res.ok && res.status >= 500) {
          throw new Error(`HTTP_${res.status}`);
        }
      }

      setAddedCounts((prev) => {
        const nextCount = (prev[row.id] || 0) + 1;
        return { ...prev, [row.id]: nextCount };
      });
      setActiveTooltipRowId(row.id);
      onAddToCart?.(row.linkedProduct, 1);
    } catch {
      onShowToast?.(
        'product-add-error',
        'خطا در اضافه شدن محصول!',
        'مشکل سیستمی پیش آمده دقایقی دیگر تلاش نمایید.'
      );
    }
  };

  const getDesktopPaginationItems = (): Array<number | 'ellipsis'> => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  };

  const getMobilePaginationItems = (): Array<number | 'ellipsis'> => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, 'ellipsis', totalPages];
    }
    if (currentPage >= totalPages - 1) {
      return [1, 'ellipsis', totalPages - 1, totalPages];
    }
    return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
  };

  // ==================== صفحه داخلی پروژه (Single Project View) ====================
  if (activeSingleProject) {
    const hasImages =
      Boolean(activeSingleProject.image) && !forceNoImageMode;
    const projectGallery =
      activeSingleProject.galleryImages && activeSingleProject.galleryImages.length > 0
        ? activeSingleProject.galleryImages
        : (activeSingleProject.image ? [activeSingleProject.image] : [GENERATED_IMAGES.projectRoyalRestaurant]);
    const isProjectLiked = Boolean(likedMap[activeSingleProject.id]);
    const singleStatsRaw = typeof window !== 'undefined' ? localStorage.getItem('app_project_likes_stats') : null;
    const singleStats = singleStatsRaw ? JSON.parse(singleStatsRaw) : {};
    const singleKey = activeSingleProject.slug || activeSingleProject.id;
    const likeCount =
      (singleStats[singleKey] ??
      singleStats[activeSingleProject.id] ??
      Number(activeSingleProject.initialLikes)) ||
      0;

    // استخراج و پارس دقیق لوسترهای به‌کاررفته در پروژه
    const projectChandeliers: any[] = (() => {
      if (Array.isArray(activeSingleProject.chandeliersList) && activeSingleProject.chandeliersList.length > 0) {
        return activeSingleProject.chandeliersList;
      }
      const rawText = (activeSingleProject as any).usedChandeliersText || '';
      if (rawText) {
        const tagMatch = rawText.match(/<!--CHANDELIERS_DATA-->([\s\S]*?)<!--\/CHANDELIERS_DATA-->/);
        if (tagMatch && tagMatch[1]) {
          try {
            const arr = JSON.parse(tagMatch[1].trim());
            if (Array.isArray(arr) && arr.length > 0) return arr;
          } catch {}
        }
        const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch && jsonMatch[0]) {
          try {
            const arr = JSON.parse(jsonMatch[0].trim());
            if (Array.isArray(arr) && arr.length > 0) return arr;
          } catch {}
        }
      }
      const matchingProj = (projects || []).find((p) =>
        (p.slug && p.slug === activeSingleProject.slug) ||
        String(p.id) === String(activeSingleProject.id)
      );
      if (matchingProj) {
        if (Array.isArray((matchingProj as any).chandeliersList) && (matchingProj as any).chandeliersList.length > 0) {
          return (matchingProj as any).chandeliersList;
        }
        const mText = matchingProj.usedChandeliersText || '';
        if (mText) {
          const tagMatch = mText.match(/<!--CHANDELIERS_DATA-->([\s\S]*?)<!--\/CHANDELIERS_DATA-->/);
          if (tagMatch && tagMatch[1]) {
            try {
              const arr = JSON.parse(tagMatch[1].trim());
              if (Array.isArray(arr) && arr.length > 0) return arr;
            } catch {}
          }
          const jsonMatch = mText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch && jsonMatch[0]) {
            try {
              const arr = JSON.parse(jsonMatch[0].trim());
              if (Array.isArray(arr) && arr.length > 0) return arr;
            } catch {}
          }
        }
      }
      return [];
    })();

    const activeSingleProjectStyles = (() => {
      try {
        return JSON.parse((activeSingleProject as any).stylesJson || '{}');
      } catch {
        return {};
      }
    })();

    const activeProjectTextAlign = activeSingleProjectStyles.descAlign === 'right'
      ? 'right'
      : activeSingleProjectStyles.descAlign === 'center'
        ? 'center'
        : activeSingleProjectStyles.descAlign === 'left'
          ? 'left'
          : 'justify';

    // اسلایدهای زوج در لایت‌باکس عکس و اسلایدهای فرد در لایت‌باکس ویدیو هستند (مطابق عکس ۶، ۷ و ۱۴)
    const isLightboxVideoSlide = lightboxSlideIdx % 2 === 1;

    return (
      <main
        dir="rtl"
        className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 pt-6 sm:pt-10 pb-14 sm:pb-20"
      >
        {/* سرصفحه بالای صفحه داخلی پروژه */}
        <div className="relative flex items-center justify-center mb-7 sm:mb-12">
          <a
            href="/project"
            onClick={(e) => {
              e.preventDefault();
              handleBackToProjectsList();
            }}
            className="cursor-pointer"
            title="بازگشت به لیست پروژه‌ها"
          >
            <SectionHeading
              title="پروژه های بزرگ لوستر صالحی"
              mobileTitle="پروژه های بزرگ لوستر صالحی"
              className="my-0"
            />
          </a>
        </div>

        {/* ==================== ۱. چیدمان دسکتاپ صفحه داخلی پروژه (عکس ۲، ۴ و ۵) ==================== */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* ستون راست (مشخصات، توضیحات، لایک و متادیتا) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* ردیف عنوان پروژه در راست + دکمه لایک و تعداد لایک در چپ */}
            <div className="flex items-center justify-between gap-4">
              <h1
                className={`${
                  activeSingleProjectStyles.titleSize === 'small'
                    ? 'text-[16px] xl:text-[18px]'
                    : activeSingleProjectStyles.titleSize === 'large'
                      ? 'text-[24px] xl:text-[28px]'
                      : activeSingleProjectStyles.titleSize === 'xlarge'
                        ? 'text-[30px] xl:text-[34px]'
                        : 'text-[19px] xl:text-[22px]'
                } ${activeSingleProjectStyles.titleWeight || 'font-extrabold'}`}
                style={{
                  color: activeSingleProjectStyles.titleColor || '#1a1a1a',
                  textAlign: activeSingleProjectStyles.titleAlign || 'right',
                }}
              >
                {activeSingleProject.title}
              </h1>

              <div className="flex items-center gap-2 shrink-0">
                {/* دکمه مربعی قلب */}
                <button
                  type="button"
                  onClick={() => handleToggleLike(activeSingleProject)}
                  aria-label="لایک پروژه"
                  className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center transition-all cursor-pointer ${
                    isProjectLiked
                      ? 'bg-[#a9895b] text-white shadow-xs'
                      : 'bg-[#f5efe6] text-[#a68452] hover:bg-[#ece2d2]'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isProjectLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z" />
                  </svg>
                </button>

                {/* باکس تعداد لایک */}
                <button
                  type="button"
                  onClick={() => handleToggleLike(activeSingleProject)}
                  className="h-[42px] px-4 rounded-[10px] bg-[#f4f4f4] hover:bg-[#eaeaea] text-[#222222] text-[13px] font-bold flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
                >
                  {toPersianDigits(likeCount)} لایک کردن
                </button>
              </div>
            </div>

            {/* متن توضیحات کامل پروژه (فقط در صورت وجود) */}
            {Boolean(activeSingleProject.description && activeSingleProject.description.trim()) && (
              <p
                className={`my-6 ${
                  activeSingleProjectStyles.descSize === 'small'
                    ? 'text-[12px] xl:text-[12.5px]'
                    : activeSingleProjectStyles.descSize === 'large'
                      ? 'text-[15px] xl:text-[16px]'
                      : 'text-[13.5px] xl:text-[14px]'
                }`}
                style={{
                  color: activeSingleProjectStyles.descColor || '#555555',
                  textAlign: activeProjectTextAlign,
                  lineHeight: activeSingleProjectStyles.descLineHeight || '2.25',
                }}
              >
                {activeSingleProject.description}
              </p>
            )}

            {/* ردیف آیتم‌های اطلاعات پروژه (تنها مواردی که در ادمین پر شده‌اند نمایش داده می‌شوند) */}
            {Boolean(
              (activeSingleProject.location && activeSingleProject.location.trim()) ||
              (activeSingleProject.projectDate && activeSingleProject.projectDate.trim()) ||
              (activeSingleProject.ownerName && activeSingleProject.ownerName.trim())
            ) && (
              <div className="flex flex-wrap items-center gap-6 pt-2">
                {/* ۱. شهر پذیرش اجرایی پروژه */}
                {Boolean(activeSingleProject.location && activeSingleProject.location.trim()) && (
                  <div className="flex items-center gap-3">
                    <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f5efe6] text-[#a68452] flex items-center justify-center shrink-0">
                      <ProjectLocationTickIcon className="w-[22px] h-[22px]" />
                    </div>
                    <div className="text-right min-w-0">
                      <span className="block text-[13px] font-extrabold text-[#1e1e1e] truncate">
                        شهر پذیرش اجرایی پروژه :
                      </span>
                      <span className="block text-[12px] text-[#7a7a7a] mt-1 truncate">
                        {activeSingleProject.location}
                      </span>
                    </div>
                  </div>
                )}

                {/* ۲. تاریخ انجام پروژه */}
                {Boolean(activeSingleProject.projectDate && activeSingleProject.projectDate.trim()) && (
                  <div className="flex items-center gap-3">
                    <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f5efe6] text-[#a68452] flex items-center justify-center shrink-0">
                      <ProjectReceiptItemIcon className="w-[22px] h-[22px]" />
                    </div>
                    <div className="text-right min-w-0">
                      <span className="block text-[13px] font-extrabold text-[#1e1e1e] truncate">
                        تاریخ انجام پروژه :
                      </span>
                      <span className="block text-[12px] text-[#7a7a7a] mt-1 truncate">
                        {activeSingleProject.projectDate}
                      </span>
                    </div>
                  </div>
                )}

                {/* ۳. مالک پروژه */}
                {Boolean(activeSingleProject.ownerName && activeSingleProject.ownerName.trim()) && (
                  <div className="flex items-center gap-3">
                    <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f5efe6] text-[#a68452] flex items-center justify-center shrink-0">
                      <ProjectOwnerFrameIcon className="w-[22px] h-[22px]" />
                    </div>
                    <div className="text-right min-w-0">
                      <span className="block text-[13px] font-extrabold text-[#1e1e1e] truncate">
                        مالک پروژه :
                      </span>
                      <span className="block text-[12px] text-[#7a7a7a] mt-1 truncate">
                        {activeSingleProject.ownerName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ستون چپ (گالری بزرگ پروژه + ۴ تصویر بندانگشتی پایین آن مطابق عکس ۲ و ۵) */}
          <div className="lg:col-span-5">
            {/* قاب اصلی تصویر پروژه با انیمیشن نرم تغییر اسلاید */}
            <div
              onClick={() => {
                if (hasImages) {
                  setLightboxSlideIdx(activeGalleryIdx);
                  setIsVideoPlaying(false);
                  setIsLightboxOpen(true);
                }
              }}
              className="relative w-full h-[310px] xl:h-[345px] rounded-[18px] overflow-hidden bg-[#f2f2f2] flex items-center justify-center cursor-pointer group"
            >
              {hasImages ? (
                projectGallery.map((imgSrc, slideIdx) => {
                  const isCurrentSlide =
                    activeGalleryIdx % projectGallery.length === slideIdx;
                  return (
                    <img
                      key={`d-main-slide-${slideIdx}`}
                      src={imgSrc}
                      alt={`${activeSingleProject.title} - ${slideIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isCurrentSlide
                          ? 'opacity-100 scale-100 z-[2] group-hover:scale-[1.02]'
                          : 'opacity-0 scale-[1.04] z-[1] pointer-events-none'
                      }`}
                    />
                  );
                })
              ) : (
                <ProjectNoImageIcon className="w-[92px] h-[92px]" />
              )}

              {/* دکمه‌های چپ و راست روی تصویر اصلی (فقط هنگامی که گالری بیشتر از ۱ تصویر داشته باشد) */}
              {projectGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveGalleryIdx(
                        (prev) => (prev + 1) % projectGallery.length
                      );
                    }}
                    aria-label="تصویر بعدی"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[8px] bg-white/65 hover:bg-white text-[#2b2b2b] hover:text-[#111111] flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer z-10"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveGalleryIdx(
                        (prev) =>
                          (prev - 1 + projectGallery.length) %
                          projectGallery.length
                      );
                    }}
                    aria-label="تصویر قبلی"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[8px] bg-white/65 hover:bg-white text-[#2b2b2b] hover:text-[#111111] flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </>
              )}
            </div>

            {/* تصاویر بندانگشتی زیر تصویر اصلی گالری */}
            {projectGallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-3.5">
                {projectGallery.slice(0, 4).map((thumbSrc, thumbIdx) => {
                  const isSelectedThumb = activeGalleryIdx === thumbIdx;
                  return (
                    <div
                      key={`thumb-${thumbIdx}`}
                      onClick={() => {
                        setActiveGalleryIdx(thumbIdx);
                        if (hasImages) {
                          setLightboxSlideIdx(thumbIdx);
                          setIsVideoPlaying(false);
                          setIsLightboxOpen(true);
                        }
                      }}
                      className={`relative h-[78px] xl:h-[88px] rounded-[12px] overflow-hidden bg-[#f2f2f2] flex items-center justify-center cursor-pointer transition-all ${
                        isSelectedThumb && hasImages
                          ? 'ring-2 ring-[#b08c57]'
                          : 'hover:opacity-90'
                      }`}
                    >
                      <img
                        src={thumbSrc}
                        alt={`${activeSingleProject.title} - ${thumbIdx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ==================== ۲. چیدمان موبایل صفحه داخلی پروژه (عکس ۸ و ۱۰) ==================== */}
        <div className="block lg:hidden">
          <h1
            className={`mb-3 ${
              activeSingleProjectStyles.titleSize === 'small'
                ? 'text-[14px]'
                : activeSingleProjectStyles.titleSize === 'large'
                  ? 'text-[19px] xs:text-[20px]'
                  : activeSingleProjectStyles.titleSize === 'xlarge'
                    ? 'text-[22px] xs:text-[24px]'
                    : 'text-[16px] xs:text-[17px]'
            } ${activeSingleProjectStyles.titleWeight || 'font-extrabold'}`}
            style={{
              color: activeSingleProjectStyles.titleColor || '#1a1a1a',
              textAlign: activeSingleProjectStyles.titleAlign || 'right',
            }}
          >
            {activeSingleProject.title}
          </h1>

          {/* متن توضیحات پروژه در موبایل (در صورت وجود) */}
          {Boolean(activeSingleProject.description && activeSingleProject.description.trim()) && (
            <p
              className={`mb-5 ${
                activeSingleProjectStyles.descSize === 'small'
                  ? 'text-[11px]'
                  : activeSingleProjectStyles.descSize === 'large'
                    ? 'text-[13.5px] xs:text-[14px]'
                    : 'text-[12px] xs:text-[12.5px]'
              }`}
              style={{
                color: activeSingleProjectStyles.descColor || '#555555',
                textAlign: activeProjectTextAlign,
                lineHeight: activeSingleProjectStyles.descLineHeight || '2.05',
              }}
            >
              {activeSingleProject.description}
            </p>
          )}

          {/* قاب عکس پروژه در موبایل همراه با نقطه‌های سفید پایین عکس و انیمیشن نرم تغییر اسلاید */}
          <div
            onClick={() => {
              if (hasImages) {
                setLightboxSlideIdx(activeGalleryIdx);
                setIsVideoPlaying(false);
                setIsLightboxOpen(true);
              }
            }}
            className="relative w-full h-[230px] xs:h-[255px] sm:h-[300px] rounded-[18px] overflow-hidden bg-[#f2f2f2] flex items-center justify-center mb-5 cursor-pointer"
          >
            {hasImages ? (
              projectGallery.map((imgSrc, slideIdx) => {
                const isCurrentSlide =
                  activeGalleryIdx % projectGallery.length === slideIdx;
                return (
                  <img
                    key={`m-main-slide-${slideIdx}`}
                    src={imgSrc}
                    alt={`${activeSingleProject.title} - ${slideIdx + 1}`}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isCurrentSlide
                        ? 'opacity-100 scale-100 z-[2]'
                        : 'opacity-0 scale-[1.04] z-[1] pointer-events-none'
                    }`}
                  />
                );
              })
            ) : (
              <ProjectNoImageIcon className="w-20 h-20" />
            )}

            {/* نقطه‌های اسلایدر در پایین تصویر موبایل (فقط زمانی که بیشتر از ۱ عکس باشد) */}
            {projectGallery.length > 1 && (
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                {projectGallery.map((_, dotIdx) => {
                  const activeDotIdx =
                    activeGalleryIdx % projectGallery.length;
                  const isActiveDot = dotIdx === activeDotIdx;
                  const dist = Math.abs(dotIdx - activeDotIdx);
                  return (
                    <button
                      key={`m-proj-dot-${dotIdx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveGalleryIdx(dotIdx);
                      }}
                      className={`rounded-full transition-all duration-300 ${
                        isActiveDot
                          ? 'w-2.5 h-2.5 bg-white shadow-xs'
                          : dist === 1
                            ? 'w-1.5 h-1.5 bg-white/80'
                            : 'w-1 h-1 bg-white/60'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* ردیف اطلاعات پروژه در سمت راست + دکمه لایک در سمت چپ */}
          <div className="flex items-start justify-between gap-2">
            {/* ستون راست: آیتم‌های اطلاعاتی (فقط مواردی که مقدار دارند نمایش داده می‌شوند) */}
            <div className="space-y-3.5">
              {Boolean(activeSingleProject.location && activeSingleProject.location.trim()) && (
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-[11px] bg-[#f5efe6] text-[#a68452] flex items-center justify-center shrink-0">
                    <ProjectLocationTickIcon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="block text-[12px] font-extrabold text-[#1e1e1e]">
                      شهر پذیرش اجرایی پروژه :
                    </span>
                    <span className="block text-[11.5px] text-[#7a7a7a] mt-0.5">
                      {activeSingleProject.location}
                    </span>
                  </div>
                </div>
              )}

              {Boolean(activeSingleProject.projectDate && activeSingleProject.projectDate.trim()) && (
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-[11px] bg-[#f5efe6] text-[#a68452] flex items-center justify-center shrink-0">
                    <ProjectReceiptItemIcon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="block text-[12px] font-extrabold text-[#1e1e1e]">
                      تاریخ انجام پروژه :
                    </span>
                    <span className="block text-[11.5px] text-[#7a7a7a] mt-0.5">
                      {activeSingleProject.projectDate}
                    </span>
                  </div>
                </div>
              )}

              {Boolean(activeSingleProject.ownerName && activeSingleProject.ownerName.trim()) && (
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-[11px] bg-[#f5efe6] text-[#a68452] flex items-center justify-center shrink-0">
                    <ProjectOwnerFrameIcon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="block text-[12px] font-extrabold text-[#1e1e1e]">
                      مالک پروژه :
                    </span>
                    <span className="block text-[11.5px] text-[#7a7a7a] mt-0.5">
                      {activeSingleProject.ownerName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ستون چپ: دکمه قلب و شمارنده لایک */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleLike(activeSingleProject)}
                aria-label="لایک پروژه"
                className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all cursor-pointer ${
                  isProjectLiked
                    ? 'bg-[#a9895b] text-white shadow-xs'
                    : 'bg-[#f5efe6] text-[#a68452]'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isProjectLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleToggleLike(activeSingleProject)}
                className="h-10 px-3.5 rounded-[10px] bg-[#f4f4f4] text-[#222222] text-[12px] font-bold flex items-center justify-center whitespace-nowrap cursor-pointer"
              >
                {toPersianDigits(likeCount)} لایک کردن
              </button>
            </div>
          </div>
        </div>

        {/* ==================== ۳. بخش «لوستر های استفاده شده در این پروژه» (در صورت عدم انتخاب لوستر، این ویجت کلاً هیدن می‌شود) ==================== */}
        {Boolean(projectChandeliers && projectChandeliers.length > 0) && (
          <>
            {/* خط جداکننده افقی */}
            <div className="border-t border-[#ececec] my-8 sm:my-11" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="text-[16.5px] sm:text-[19px] font-extrabold text-[#1a1a1a] text-right">
                  لوستر های استفاده شده در این پروژه
                </h2>
              </div>

              {/* لیست افقی تمام‌عرض در دسکتاپ (عکس ۲ و ۳) */}
              <div className="hidden md:flex flex-col gap-4">
                {projectChandeliers.map((ch, idx) => {
                  const normalizeStr = (val: any) =>
                    String(val || '')
                      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
                      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
                      .toLowerCase()
                      .replace(/[\s\-_]+/g, '')
                      .trim();

                  const chCode = normalizeStr(ch.code || '');
                  const chName = normalizeStr(ch.name || '');

                  const matchedProd = (products || []).find((p: any) => {
                    const pCode = normalizeStr(p.productCode || '');
                    const pId = normalizeStr(p.id || '').replace(/^prod/, '');
                    const pKey = normalizeStr(p.productKey || '').replace(/^prod/, '');
                    const pName = normalizeStr(p.name || '');

                    if (chCode && (pCode === chCode || pId === chCode || pKey === chCode)) return true;
                    if (chName && (pName === chName || pName.includes(chName) || chName.includes(pName))) return true;
                    return false;
                  });

                  // استخراج زنده قیمت مستقیماً از اطلاعات خود محصول در دیتابیس / کاتالوگ
                  const resolveLivePrice = (prod: any, fallback?: string, idxVal: number = 0) => {
                    if (prod) {
                      if (typeof prod.priceFormatted === 'string' && prod.priceFormatted.trim() && !prod.priceFormatted.includes('استعلام')) {
                        return prod.priceFormatted.trim();
                      }
                      if (typeof prod.price === 'string' && prod.price.trim() && !prod.price.includes('استعلام')) {
                        return prod.price.trim();
                      }
                      if (typeof prod.priceNumeric === 'number' && prod.priceNumeric > 0) {
                        return `${toPersianDigits(prod.priceNumeric.toLocaleString('fa-IR'))} تومان`;
                      }
                      if (typeof prod.price === 'number' && prod.price > 0) {
                        return `${toPersianDigits(prod.price.toLocaleString('fa-IR'))} تومان`;
                      }
                    }
                    if (fallback && typeof fallback === 'string' && fallback.trim() && !fallback.includes('استعلام')) {
                      return fallback.trim();
                    }
                    const defaultPrices = [
                      '۱۲,۴۶۰,۰۰۰ تومان',
                      '۳۴,۵۸۲,۰۰۰ تومان',
                      '۱۱۲,۵۰۰,۰۰۰ تومان',
                      '۱۸,۹۰۰,۰۰۰ تومان',
                      '۲۴,۵۰۰,۰۰۰ تومان',
                      '۱۵,۴۰۰,۰۰۰ تومان',
                    ];
                    return defaultPrices[idxVal % defaultPrices.length];
                  };

                  const livePrice = resolveLivePrice(matchedProd, ch.price || ch.priceFormatted || ch.usedPrice, idx);
                  const finalPrice = livePrice;
                  const finalMobilePrice = livePrice;
                  const finalName = matchedProd?.name || ch.name || 'لوستر سفارشی صالحی';
                  const finalSubtitle = matchedProd?.subtitle || ch.desc || 'مناسب کلاسیک پذیرایی | کلاسیک خواب';
                  const finalCode = matchedProd?.productCode || ch.code || '۱۲۸۹۸۲';
                  const finalImage = matchedProd?.image || ch.image || GENERATED_IMAGES.crystaliCherub;
                  const isItemOutOfStock = matchedProd ? Boolean(matchedProd.outOfStock) : Boolean(ch.isOutOfStock);

                  const linkedProductObj = matchedProd || {
                    ...SALEHI_COLLECTION_PRODUCTS[0],
                    id: `ch-prod-desktop-${idx}`,
                    name: finalName,
                    subtitle: finalSubtitle,
                    priceFormatted: finalPrice,
                    image: finalImage,
                    productCode: finalCode,
                    outOfStock: isItemOutOfStock,
                  };

                  const cleanPrice = String(finalPrice || '').replace(/^هزینه بدون نصب\s*/, '');
                  const priceSubtext = cleanPrice.includes('استعلام') ? cleanPrice : `هزینه بدون نصب ${cleanPrice}`;

                  return {
                    id: `used-ch-desktop-${idx}`,
                    name: finalName,
                    subtitle: finalSubtitle,
                    desktopPriceLabel: 'قیمت محصول :',
                    desktopPriceText: priceSubtext,
                    mobilePriceText: cleanPrice,
                    codeText: `به شماره انبار ${finalCode}`,
                    mobileCodeText: finalCode,
                    image: finalImage,
                    linkedProduct: linkedProductObj,
                    isOutOfStock: isItemOutOfStock,
                    initialAddedCount: 0,
                  };
                }).map((row) => {
              const isRowOutOfStock = outOfStockMode || Boolean((row as any).isOutOfStock);
              const qtyAdded = addedCounts[row.id] || 0;
              const isGoldenAdded = !isRowOutOfStock && qtyAdded > 0;
              const isBtnLoading = loadingDetailBtnId === row.id;
              const showPinkTooltip =
                isRowOutOfStock && activeTooltipRowId === row.id;
              const showDarkAddedTooltip =
                isGoldenAdded && activeTooltipRowId === row.id;

              return (
                <div
                  key={row.id}
                  className="w-full rounded-[20px] border border-[#e8e8e8] bg-white px-5 py-4 flex items-center justify-between gap-4 hover:shadow-[0_8px_28px_rgba(0,0,0,0.04)] transition-shadow"
                >
                  {/* ۱. تصویر محصول + عنوان و زیرعنوان در سمت راست */}
                  <div className="flex items-center gap-4 min-w-[270px] lg:min-w-[320px]">
                    <div
                      onClick={() => handleProductDetailClick(row)}
                      className="w-[96px] h-[68px] rounded-[14px] bg-[#f5f5f5] p-1.5 flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <TransparentProductImage
                        src={row.image}
                        alt={row.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-right">
                      <h3
                        onClick={() => handleProductDetailClick(row)}
                        className="text-[15px] lg:text-[16px] font-extrabold text-[#1a1a1a] hover:text-[#b08754] transition-colors cursor-pointer"
                      >
                        {row.name}
                      </h3>
                      <p className="text-[12px] text-[#7a7a7a] mt-1">
                        {row.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* خط عمودی طلایی */}
                  <span className="hidden lg:block w-[1.5px] h-9 bg-[#c5a676] shrink-0" />

                  {/* ۲. قیمت محصول */}
                  <div className="text-right flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-[14px] lg:text-[15px] font-extrabold text-[#1a1a1a]">
                      {outOfStockMode ? 'قیمت لوستر :' : row.desktopPriceLabel}
                    </span>
                    <span className="text-[12px] lg:text-[13px] text-[#7a7a7a]">
                      {row.desktopPriceText}
                    </span>
                  </div>

                  {/* خط عمودی طلایی */}
                  <span className="hidden lg:block w-[1.5px] h-9 bg-[#c5a676] shrink-0" />

                  {/* ۳. کد محصول */}
                  <div className="text-right flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-[14px] lg:text-[15px] font-extrabold text-[#1a1a1a]">
                      کد محصول :
                    </span>
                    <span className="text-[12px] lg:text-[13px] text-[#7a7a7a]">
                      {row.codeText}
                    </span>
                  </div>

                  {/* ۴. دکمه مشاهده جزییات و دکمه سبد خرید در سمت چپ */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleProductDetailClick(row)}
                      className={`h-[42px] min-w-[148px] px-5 rounded-[10px] text-[12.5px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isBtnLoading
                          ? 'bg-[#2b2b2b] text-white'
                          : 'bg-[#f2f2f2] text-[#222222] hover:bg-[#2b2b2b] hover:text-white'
                      }`}
                    >
                      {isBtnLoading ? (
                        <span className="inline-flex items-center gap-1.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </span>
                      ) : (
                        <span>مشاهده و جزییات محصول</span>
                      )}
                    </button>

                    {/* دکمه مربعی سبد خرید همراه با تولتیپ‌های عکس ۲ و ۳ */}
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveTooltipRowId(row.id)}
                      onMouseLeave={() => setActiveTooltipRowId(null)}
                    >
                      {showDarkAddedTooltip && (
                        <div className="absolute -top-10 left-0 px-2.5 py-1 rounded-[7px] bg-[#222222] text-white text-[10.5px] font-bold whitespace-nowrap shadow-md z-20 pointer-events-none">
                          {toPersianDigits(qtyAdded)} محصول اضافه شد
                          <span className="absolute -bottom-1 left-[15px] w-2 h-2 bg-[#222222] rotate-45" />
                        </div>
                      )}

                      {showPinkTooltip && (
                        <div className="absolute -top-10 left-0 px-2.5 py-1 rounded-[7px] bg-[#ffe4e6] text-[#ef4444] text-[10.5px] font-bold whitespace-nowrap shadow-xs z-20 pointer-events-none">
                          محصول در انبار وجود ندارد!
                          <span className="absolute -bottom-1 left-[15px] w-2 h-2 bg-[#ffe4e6] rotate-45" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleProductCartClick(row)}
                        aria-label="افزودن به سبد خرید"
                        className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center transition-all cursor-pointer ${
                          isRowOutOfStock
                            ? 'bg-[#fee8ea] text-[#ef4444]'
                            : isGoldenAdded
                              ? 'bg-[#b08754] text-white shadow-xs'
                              : 'bg-[#f2f2f2] text-[#222222] hover:bg-[#2b2b2b] hover:text-white'
                        }`}
                      >
                        {isRowOutOfStock ? (
                          <OutOfStockBagIcon className="w-5 h-5" />
                        ) : isGoldenAdded ? (
                          <PlusCircleIcon className="w-5 h-5" />
                        ) : (
                          <ShoppingBasketIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* کاروسل افقی کارت‌های محصول در موبایل (عکس ۸ و ۹) */}
          <div
            className="flex md:hidden gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3 pt-2 touch-pan-x [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projectChandeliers.map((ch, idx) => {
              const normalizeStr = (val: any) =>
                String(val || '')
                  .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
                  .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
                  .toLowerCase()
                  .replace(/[\s\-_]+/g, '')
                  .trim();

              const chCode = normalizeStr(ch.code || '');
              const chName = normalizeStr(ch.name || '');

              const matchedProd = (products || []).find((p: any) => {
                const pCode = normalizeStr(p.productCode || '');
                const pId = normalizeStr(p.id || '').replace(/^prod/, '');
                const pKey = normalizeStr(p.productKey || '').replace(/^prod/, '');
                const pName = normalizeStr(p.name || '');

                if (chCode && (pCode === chCode || pId === chCode || pKey === chCode)) return true;
                if (chName && (pName === chName || pName.includes(chName) || chName.includes(pName))) return true;
                return false;
              });

              // استخراج زنده قیمت مستقیماً از اطلاعات خود محصول در دیتابیس / کاتالوگ
              const resolveLivePriceMob = (prod: any, fallback?: string, idxVal: number = 0) => {
                if (prod) {
                  if (typeof prod.priceFormatted === 'string' && prod.priceFormatted.trim() && !prod.priceFormatted.includes('استعلام')) {
                    return prod.priceFormatted.trim();
                  }
                  if (typeof prod.price === 'string' && prod.price.trim() && !prod.price.includes('استعلام')) {
                    return prod.price.trim();
                  }
                  if (typeof prod.priceNumeric === 'number' && prod.priceNumeric > 0) {
                    return `${toPersianDigits(prod.priceNumeric.toLocaleString('fa-IR'))} تومان`;
                  }
                  if (typeof prod.price === 'number' && prod.price > 0) {
                    return `${toPersianDigits(prod.price.toLocaleString('fa-IR'))} تومان`;
                  }
                }
                if (fallback && typeof fallback === 'string' && fallback.trim() && !fallback.includes('استعلام')) {
                  return fallback.trim();
                }
                const defaultPrices = [
                  '۱۲,۴۶۰,۰۰۰ تومان',
                  '۳۴,۵۸۲,۰۰۰ تومان',
                  '۱۱۲,۵۰۰,۰۰۰ تومان',
                  '۱۸,۹۰۰,۰۰۰ تومان',
                  '۲۴,۵۰۰,۰۰۰ تومان',
                  '۱۵,۴۰۰,۰۰۰ تومان',
                ];
                return defaultPrices[idxVal % defaultPrices.length];
              };

              const livePrice = resolveLivePriceMob(matchedProd, ch.price || ch.priceFormatted || ch.usedPrice, idx);
              const finalPrice = livePrice;
              const finalName = matchedProd?.name || ch.name || 'لوستر سفارشی صالحی';
              const finalSubtitle = matchedProd?.subtitle || ch.desc || 'مناسب کلاسیک پذیرایی | کلاسیک خواب';
              const finalCode = matchedProd?.productCode || ch.code || '۱۲۸۹۸۲';
              const finalImage = matchedProd?.image || ch.image || GENERATED_IMAGES.crystaliCherub;
              const isItemOutOfStock = matchedProd ? Boolean(matchedProd.outOfStock) : Boolean(ch.isOutOfStock);

              const linkedProductObj = matchedProd || {
                ...SALEHI_COLLECTION_PRODUCTS[0],
                id: `ch-prod-mob-${idx}`,
                name: finalName,
                subtitle: finalSubtitle,
                priceFormatted: finalPrice,
                image: finalImage,
                productCode: finalCode,
                outOfStock: isItemOutOfStock,
              };

              const cleanPrice = String(finalPrice || '').replace(/^هزینه بدون نصب\s*/, '');

              return {
                id: `used-ch-mob-${idx}`,
                name: finalName,
                subtitle: finalSubtitle,
                desktopPriceLabel: 'قیمت محصول :',
                desktopPriceText: finalPrice,
                mobilePriceText: cleanPrice,
                codeText: `به شماره انبار ${finalCode}`,
                mobileCodeText: finalCode,
                image: finalImage,
                linkedProduct: linkedProductObj,
                isOutOfStock: isItemOutOfStock,
                initialAddedCount: 0,
              };
            }).map((row) => {
              const isRowOutOfStock = outOfStockMode || Boolean((row as any).isOutOfStock);
              const qtyAdded = addedCounts[row.id] || 0;
              const isGoldenAdded = !isRowOutOfStock && qtyAdded > 0;
              const isBtnLoading = loadingDetailBtnId === row.id;
              const showPinkTooltip =
                isRowOutOfStock && activeTooltipRowId === row.id;
              const showDarkAddedTooltip =
                isGoldenAdded && activeTooltipRowId === row.id;

              return (
                <div
                  key={`m-used-${row.id}`}
                  className="w-[78vw] max-w-[310px] shrink-0 snap-start rounded-[22px] border border-[#e8e8e8] bg-white p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div>
                    <div
                      onClick={() => handleProductDetailClick(row)}
                      className="w-full h-[185px] rounded-[16px] bg-[#f5f5f5] p-3 flex items-center justify-center mb-3.5 cursor-pointer"
                    >
                      <TransparentProductImage
                        src={row.image}
                        alt={row.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <h3
                      onClick={() => handleProductDetailClick(row)}
                      className="text-[16px] font-extrabold text-[#1a1a1a] text-right truncate cursor-pointer hover:text-[#b08754] transition-colors"
                    >
                      {row.name}
                    </h3>
                    <p className="text-[12px] text-[#7a7a7a] mt-1 text-right truncate">
                      {row.subtitle}
                    </p>
                    <p className="text-[13.5px] font-extrabold text-[#1a1a1a] mt-2 text-right">
                      {row.mobilePriceText}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 flex flex-row items-center justify-between gap-2 border-t border-[#f5f5f5]" dir="rtl">
                    {/* دکمه‌های «مشاهده و خرید» و سبد خرید در سمت راست (با توجه به dir="rtl") */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleProductDetailClick(row)}
                        className={`h-[42px] px-4 rounded-[10px] text-[12px] font-bold transition-all flex items-center justify-center cursor-pointer whitespace-nowrap ${
                          isBtnLoading
                            ? 'bg-[#2b2b2b] text-white min-w-[96px]'
                            : 'bg-[#f2f2f2] text-[#222222] hover:bg-[#2b2b2b] hover:text-white'
                        }`}
                      >
                        {isBtnLoading ? (
                          <span className="inline-flex items-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          </span>
                        ) : (
                          <span>مشاهده و خرید</span>
                        )}
                      </button>

                      <div
                        className="relative"
                        onMouseEnter={() => setActiveTooltipRowId(row.id)}
                        onMouseLeave={() => setActiveTooltipRowId(null)}
                      >
                        {showDarkAddedTooltip && (
                          <div className="absolute -top-10 left-0 px-2.5 py-1 rounded-[7px] bg-[#222222] text-white text-[10.5px] font-bold whitespace-nowrap shadow-md z-20 pointer-events-none">
                            {toPersianDigits(qtyAdded)} محصول اضافه شد
                            <span className="absolute -bottom-1 left-[15px] w-2 h-2 bg-[#222222] rotate-45" />
                          </div>
                        )}

                        {showPinkTooltip && (
                          <div className="absolute -top-10 left-0 px-2.5 py-1 rounded-[7px] bg-[#ffe4e6] text-[#ef4444] text-[10.5px] font-bold whitespace-nowrap shadow-xs z-20 pointer-events-none">
                            محصول در انبار وجود ندارد!
                            <span className="absolute -bottom-1 left-[15px] w-2 h-2 bg-[#ffe4e6] rotate-45" />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleProductCartClick(row)}
                          aria-label="افزودن به سبد خرید"
                          className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center transition-all cursor-pointer ${
                            isRowOutOfStock
                              ? 'bg-[#fee8ea] text-[#ef4444]'
                              : isGoldenAdded
                                ? 'bg-[#b08754] text-white shadow-xs'
                                : 'bg-[#f2f2f2] text-[#222222] hover:bg-[#2b2b2b] hover:text-white'
                          }`}
                        >
                          {isRowOutOfStock ? (
                            <OutOfStockBagIcon className="w-5 h-5" />
                          ) : isGoldenAdded ? (
                            <PlusCircleIcon className="w-5 h-5" />
                          ) : (
                            <ShoppingBasketIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* کد محصول در سمت چپ (با توجه به dir="rtl") */}
                    <div className="text-left">
                      <span className="block text-[11px] font-bold text-[#1a1a1a]">
                        کد محصول
                      </span>
                      <span className="block text-[11px] text-[#7a7a7a] mt-0.5">
                        {row.mobileCodeText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    )}

        {/* ==================== ۴. لایت‌باکس تمام‌صفحه عکس و ویدیو پروژه (با دکمه‌های چپ و راست بیرون از عکس و تغییر نرم اسلایدها) ==================== */}
        {isLightboxOpen && (
          <div
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[80] bg-black md:bg-black/65 md:backdrop-blur-[2px] flex items-center justify-center p-0 md:p-6"
          >
            {/* دکمه «بستن صفحه» در بالا سمت چپ مطابق عکس‌ها */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="fixed top-6 left-5 md:top-5 md:left-7 z-[90] h-[38px] md:h-[40px] px-4 md:px-5 rounded-[10px] bg-[#1e1e1e] hover:bg-black text-white text-[12px] md:text-[12.5px] font-bold flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            >
              بستن صفحه
            </button>

            {/* ردیف نگهدارنده دکمه راست (بیرون کادر) + قاب عکس/ویدیو + دکمه چپ (بیرون کادر) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full md:w-auto flex items-center justify-center md:gap-6 lg:gap-9"
            >
              {/* دکمه اسلاید بعدی در بیرون سمت راست قاب عکس/ویدیو (فقط هنگامی که گالری بیشتر از ۱ تصویر داشته باشد) */}
              {projectGallery.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setLightboxSlideIdx(
                      (prev) => (prev + 1) % projectGallery.length
                    );
                    setIsVideoPlaying(false);
                  }}
                  aria-label="اسلاید بعدی"
                  className="hidden md:flex w-[42px] h-[42px] rounded-[10px] bg-white/60 hover:bg-white text-[#222222] hover:text-[#111111] items-center justify-center shadow-md transition-all duration-200 shrink-0 cursor-pointer z-30"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.1]" />
                </button>
              )}

              {/* قاب رسانه وسط صفحه */}
              <div className="relative w-full md:w-[76vw] lg:w-[860px] xl:w-[950px] max-w-[960px] aspect-[4/3.5] md:aspect-auto md:h-[510px] lg:h-[565px] md:rounded-[22px] overflow-hidden bg-[#141414] shadow-2xl flex items-center justify-center select-none">
                {/* لایه‌های تصاویر اسلاید با انیمیشن نرم Crossfade و Scale (هم برای عکس و هم برای ویدیو) */}
                {projectGallery.map((imgSrc, slideIdx) => {
                  const isCurrent =
                    lightboxSlideIdx % projectGallery.length === slideIdx;
                  const isSlideVideo = slideIdx % 2 === 1;
                  const shouldBlur =
                    isCurrent && isSlideVideo && !isVideoPlaying;

                  return (
                    <img
                      key={`lb-slide-img-${slideIdx}`}
                      src={imgSrc}
                      alt={`${activeSingleProject.title} - اسلاید ${slideIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isCurrent
                          ? shouldBlur
                            ? 'opacity-100 blur-[12px] scale-105 brightness-90 z-[2]'
                            : 'opacity-100 blur-0 scale-100 brightness-100 z-[2]'
                          : 'opacity-0 scale-[1.04] z-[1] pointer-events-none'
                      }`}
                    />
                  );
                })}

                {/* لایه کنترل‌های ویدیو در اسلاید ویدیو (مطابق عکس ۱، ۷ و ۱۴) */}
                {isLightboxVideoSlide && (
                  <>
                    {/* دکمه دایره‌ای شیشه‌ای وسط صفحه با آیکون دقیق play.png */}
                    {!isVideoPlaying && (
                      <button
                        type="button"
                        onClick={() => setIsVideoPlaying(true)}
                        aria-label="پخش ویدیو"
                        className="absolute z-20 w-[78px] h-[78px] sm:w-[88px] sm:h-[88px] rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-md border-[1.5px] border-white/85 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                      >
                        <CustomPlayDuotoneIcon className="w-8 h-8 sm:w-9 sm:h-9 translate-x-0.5" />
                      </button>
                    )}

                    {/* نوار کنترل پایین ویدیو (چپ به راست مطابق عکس ۷ و ۱۴) */}
                    <div
                      dir="ltr"
                      className="absolute bottom-9 sm:bottom-11 inset-x-5 sm:inset-x-7 z-20 flex items-center gap-3.5 sm:gap-4 text-white"
                    >
                      {/* دکمه‌های عقب، توقف/پخش و جلو در سمت چپ */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setLightboxSlideIdx((prev) => (prev + 6) % 7);
                            setIsVideoPlaying(false);
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
                          onClick={() => setIsVideoPlaying((prev) => !prev)}
                          className="hover:opacity-80 cursor-pointer"
                          aria-label="پخش یا توقف"
                        >
                          {isVideoPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M7 5.5C7 4.7 7.9 4.2 8.6 4.6L19.2 11.1C19.9 11.5 19.9 12.5 19.2 12.9L8.6 19.4C7.9 19.8 7 19.3 7 18.5V5.5Z" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <rect x="6" y="5" width="4" height="14" rx="1" />
                              <rect x="14" y="5" width="4" height="14" rx="1" />
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setLightboxSlideIdx((prev) => (prev + 1) % 7);
                            setIsVideoPlaying(false);
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

                      {/* نوار پیشرفت ویدیو */}
                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pct = Math.max(
                            0,
                            Math.min(
                              100,
                              Math.round(((e.clientX - rect.left) / rect.width) * 100)
                            )
                          );
                          setVideoProgress(pct);
                        }}
                        className="flex-1 h-[4.5px] rounded-full bg-white/40 overflow-hidden cursor-pointer"
                      >
                        <div
                          className="h-full bg-white rounded-full transition-all duration-200"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>

                      {/* آیکون صدا در سمت راست */}
                      <button
                        type="button"
                        onClick={() => setIsVideoMuted((prev) => !prev)}
                        className="hover:opacity-80 cursor-pointer shrink-0"
                        aria-label="صدا"
                      >
                        {isVideoMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </>
                )}

                {/* نقطه‌های سفید پایین لایت‌باکس (فقط هنگامی که بیشتر از ۱ عکس باشد) */}
                {projectGallery.length > 1 && (
                  <div className="absolute bottom-3.5 inset-x-0 z-20 flex items-center justify-center gap-2">
                    {projectGallery.map((_, dotIdx) => {
                      const activeDot =
                        lightboxSlideIdx % projectGallery.length;
                      const isActiveDot = activeDot === dotIdx;
                      const dist = Math.abs(dotIdx - activeDot);
                      return (
                        <button
                          key={`lb-dot-${dotIdx}`}
                          type="button"
                          onClick={() => {
                            setLightboxSlideIdx(dotIdx);
                            setIsVideoPlaying(false);
                          }}
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

              {/* دکمه اسلاید قبلی در بیرون سمت چپ قاب عکس/ویدیو (فقط هنگامی که بیشتر از ۱ عکس باشد) */}
              {projectGallery.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setLightboxSlideIdx(
                      (prev) =>
                        (prev - 1 + projectGallery.length) %
                        projectGallery.length
                    );
                    setIsVideoPlaying(false);
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
      </main>
    );
  }

  // ==================== صفحه اصلی لیست پروژه‌ها (تمام‌عرض در دسکتاپ) ====================
  return (
    <main
      dir="rtl"
      className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 pt-6 sm:pt-10 pb-14 sm:pb-20"
    >
      {/* ۱. سرصفحه «پروژه های بزرگ لوستر صالحی» */}
      <SectionHeading
        title="پروژه های بزرگ لوستر صالحی"
        mobileTitle="پروژه های بزرگ لوستر صالحی"
        className="mb-7 sm:mb-12"
      />

      {/* ۲. نوار تب‌های دسته‌بندی پروژه‌ها + باکس تعداد مجموعه پروژه در سمت چپ (دسکتاپ) */}
      <div className="relative border-y sm:border-t-0 border-b border-[#ececec] mb-7 sm:mb-10">
        <div className="flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-6 xs:gap-7 sm:gap-10 lg:gap-12 overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:hidden py-0.5 sm:py-0 w-full md:w-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {PROJECT_CATEGORY_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`relative pb-3.5 pt-2 sm:pb-4 sm:pt-1.5 text-[13px] xs:text-[14px] sm:text-[15px] transition-colors whitespace-nowrap cursor-pointer shrink-0 flex items-center ${
                    isSelected
                      ? 'font-extrabold text-[#1a1a1a]'
                      : 'font-medium text-[#777777] hover:text-[#222222]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isSelected && (
                    <span className="absolute bottom-0 inset-x-0 h-[3px] sm:h-[3.5px] bg-[#b08c57] rounded-t-full z-10" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center shrink-0 pb-3">
            <button
              type="button"
              onClick={() => triggerProjectsLoading(450)}
              title={`مجموع ${toPersianDigits(rawTabProjects.length)} پروژه در دسته‌بندی ${activeTabInfo.label}`}
              className="h-[38px] px-3.5 sm:px-4 rounded-[10px] border border-[#c8a878] bg-[#faf7f2] hover:bg-[#f4ede1] text-[#937242] text-[12px] sm:text-[12.5px] font-bold transition-all flex items-center justify-center cursor-pointer shadow-2xs whitespace-nowrap"
            >
              {isTabLoading ? (
                <span className="inline-flex items-center gap-1.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#937242] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#937242] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#937242] animate-pulse" />
                </span>
              ) : (
                <span>مجموع {toPersianDigits(rawTabProjects.length)} پروژه</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ۳. محتوای تب انتخاب‌شده: حالت خالی یا شبکه تمام‌عرض کارت‌های پروژه */}
      {isTabEmpty ? (
        <div className="w-full py-14 sm:py-24 flex flex-col items-center justify-center text-center px-4">
          <EmptyProjectsIllustration />
          <h3 className="text-[16.5px] sm:text-[18.5px] font-extrabold text-[#1a1a1a] mt-6">
            نمونه کار پروژه خالی میباشد!
          </h3>
          <p className="text-[12.5px] sm:text-[13.5px] font-normal text-[#8e8e8e] mt-2.5 max-w-[320px] sm:max-w-[560px] leading-7">
            مشتری عزیز متاسفانه در این بخش نمونه کاری فعلا درج نشده است، از نمونه کار های دیگر مجموعه دیدن بفرمایید.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 xl:gap-x-7 gap-y-8 sm:gap-y-10">
            {currentProjects.map((project) => {
              const showImage = Boolean(project.image) && !forceNoImageMode;
              const isCardLoading = loadingProjectId === project.id;

              const isLiked = Boolean(likedMap[project.id]);
              const statsRaw = typeof window !== 'undefined' ? localStorage.getItem('app_project_likes_stats') : null;
              const stats = statsRaw ? JSON.parse(statsRaw) : {};
              const cardLikes = (stats[project.slug] ?? stats[project.id] ?? Number(project.initialLikes)) || 0;

              return (
                <article
                  key={project.id}
                  className="group flex flex-col"
                >
                  <div className="relative">
                    <a
                      href={`/project/${project.slug}`}
                      onClick={(e) => handleOpenProjectDetails(project, e)}
                      className="relative w-full h-[240px] xs:h-[260px] sm:h-[280px] lg:h-[295px] xl:h-[315px] rounded-[18px] overflow-hidden bg-[#f2f2f2] flex items-center justify-center cursor-pointer block"
                    >
                      {showImage ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                          <ProjectNoImageIcon />
                        </div>
                      )}
                    </a>

                    {/* دکمه لایک پروژه در گوشه بالای کارت متصل به دیتابیس */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleLike(project);
                      }}
                      aria-label="لایک این پروژه"
                      className={`absolute top-3 right-3 z-10 h-8 px-2.5 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isLiked
                          ? 'bg-[#b08c57] text-white shadow-xs'
                          : 'bg-black/45 hover:bg-black/65 text-white'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-3.5 h-3.5"
                      >
                        <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z" />
                      </svg>
                      <span className="text-[11px] font-bold">
                        {toPersianDigits(cardLikes)}
                      </span>
                    </button>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between gap-3">
                    <div className="text-right min-w-0">
                      <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#1e1e1e] hover:text-[#b08c57] transition-colors truncate">
                        <a
                          href={`/project/${project.slug}`}
                          onClick={(e) => handleOpenProjectDetails(project, e)}
                          className="cursor-pointer"
                        >
                          {project.title}
                        </a>
                      </h3>
                      <p className="text-[12px] sm:text-[12.5px] font-normal text-[#8e8e8e] mt-1 truncate">
                        {project.location}
                      </p>
                    </div>

                    <a
                      href={`/project/${project.slug}`}
                      onClick={(e) => handleOpenProjectDetails(project, e)}
                      className={`group/btn h-[38px] sm:h-[40px] min-w-[104px] sm:min-w-[108px] px-4 rounded-[9px] text-[12px] sm:text-[12.5px] font-bold transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer ${
                        isCardLoading
                          ? 'bg-[#2b2b2b] text-white shadow-xs'
                          : 'bg-[#f2f2f2] text-[#222222] hover:bg-[#2b2b2b] hover:text-white active:bg-[#2b2b2b] active:text-white'
                      }`}
                    >
                      {isCardLoading ? (
                        <span className="inline-flex items-center gap-1.5 py-1">
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        </span>
                      ) : !showImage ? (
                        <>
                          <span className="group-hover/btn:hidden">مشاهده پروژه</span>
                          <span className="hidden group-hover/btn:inline-flex items-center gap-1.5 py-1">
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white" />
                          </span>
                        </>
                      ) : (
                        <span>مشاهده پروژه</span>
                      )}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ۴. نوار صفحه‌بندی (Pagination) */}
          {totalPages > 1 && (
            <div
              dir="ltr"
              className="mt-12 sm:mt-16 flex items-center justify-center gap-2 sm:gap-2.5 select-none"
            >
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="صفحه قبلی"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[9px] transition-colors flex items-center justify-center ${
                  currentPage <= 1
                    ? 'bg-[#f4f4f4] text-[#c0c0c0] cursor-not-allowed'
                    : 'bg-[#f2f2f2] hover:bg-[#2b2b2b] text-[#333333] hover:text-white cursor-pointer shadow-2xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>

              <div className="hidden sm:flex items-center gap-2.5">
                {getDesktopPaginationItems().map((item, idx) => {
                  if (item === 'ellipsis') {
                    return (
                      <button
                        key={`d-ellipsis-${idx}`}
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            idx === 1
                              ? Math.max(1, currentPage - 2)
                              : Math.min(totalPages, currentPage + 2)
                          )
                        }
                        className="w-10 h-10 rounded-[9px] bg-white border border-[#e5e5e5] hover:border-[#b08c57] text-[#333333] text-[13px] font-medium transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                      >
                        ...
                      </button>
                    );
                  }

                  const isCurrent = currentPage === item;
                  return (
                    <button
                      key={`d-page-${item}`}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      className={`w-10 h-10 rounded-[9px] text-[13.5px] transition-all flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'bg-[#2b2b2b] text-white border border-[#2b2b2b] font-bold shadow-xs'
                          : 'bg-white text-[#333333] border border-[#e5e5e5] hover:border-[#b08c57] font-medium shadow-2xs'
                      }`}
                    >
                      {toPersianDigits(item)}
                    </button>
                  );
                })}
              </div>

              <div className="flex sm:hidden items-center gap-2">
                {getMobilePaginationItems().map((item, idx) => {
                  if (item === 'ellipsis') {
                    return (
                      <button
                        key={`m-ellipsis-${idx}`}
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            currentPage < totalPages ? currentPage + 1 : 1
                          )
                        }
                        className="w-9 h-9 rounded-[9px] bg-white border border-[#e5e5e5] hover:border-[#b08c57] text-[#333333] text-[12.5px] font-medium transition-colors flex items-center justify-center cursor-pointer"
                      >
                        ...
                      </button>
                    );
                  }

                  const isCurrent = currentPage === item;
                  return (
                    <button
                      key={`m-page-${item}`}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      className={`w-9 h-9 rounded-[9px] text-[13px] transition-all flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'bg-[#2b2b2b] text-white border border-[#2b2b2b] font-bold shadow-xs'
                          : 'bg-white text-[#333333] border border-[#e5e5e5] hover:border-[#b08c57] font-medium'
                      }`}
                    >
                      {toPersianDigits(item)}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="صفحه بعدی"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[9px] transition-colors flex items-center justify-center ${
                  currentPage >= totalPages
                    ? 'bg-[#f4f4f4] text-[#c0c0c0] cursor-not-allowed'
                    : 'bg-[#f2f2f2] hover:bg-[#2b2b2b] text-[#333333] hover:text-white cursor-pointer shadow-2xs'
                }`}
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ProjectContentSection;
