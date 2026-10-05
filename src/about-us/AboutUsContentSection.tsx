import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, FileText, Download, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/Ornaments';
import { AppToast } from '../components/InteractiveModals';
import { GENERATED_IMAGES } from '../data/chandelierData';
import aboutGalleryShowroomImg from '../assets/images/about_gallery_showroom_1790844789780.jpg';
import aboutGalleryGrandAtelierImg from '../assets/images/about_gallery_grand_atelier_1790845407976.jpg';
import aboutGalleryRoyalStaircaseImg from '../assets/images/about_gallery_royal_staircase_1790845421517.jpg';
import aboutGalleryModernVillaImg from '../assets/images/about_gallery_modern_villa_1790844817623.jpg';
import aboutGalleryEmeraldPalaceImg from '../assets/images/about_gallery_emerald_palace_1790844830735.jpg';

import { FooterSettingsConfig } from '../components/sections/FooterSection';

export interface AboutUsSettingsConfig {
  storyTitle: string;
  storyDescription: string;
  galleryImages: string[];
  catalogTitle?: string;
  catalogTitleColor?: string;
  catalogDescription?: string;
  catalogDescriptionColor?: string;
  catalogCardTitle?: string;
  catalogPageCount?: string;
  catalogDownloadUrl?: string;
}

export const INITIAL_ABOUT_US_SETTINGS: AboutUsSettingsConfig = {
  storyTitle: 'داستان بی انتهای ما!',
  storyDescription:
    'شرکت صنایع لوستر صالحی از سال 1352 تا کنون فعالیت خود را در زمینه ساخت انواع لوستر و دیگر تجهیزات لوکس آغاز نموده و امروزه بیش از 100 محصول متنوع را با بهره گیری از برترین تکنولوژی روز دنیا و مرغوب ترین مواد اولیه مطابق با استانداردهای اروپایی ، تولید نموده تا فخر صنعت لوستر سازی کشور باشد. این شرکت مفتخر است کلیه محصولات خود را به بیش از 10 کشور اروپایی و آسیایی معرفی نموده که بتواند قدمی در جهت شکوفایی نام ایران بردارد. شرکت صنایع لوستر صالحی از سال 1352 تا کنون فعالیت خود را در زمینه ساخت انواع لوستر و دیگر تجهیزات لوکس آغاز نموده و امروزه بیش از 100 محصول متنوع را با بهره گیری از برترین تکنولوژی روز دنیا و مرغوب ترین مواد اولیه مطابق با استانداردهای اروپایی ، تولید نموده تا فخر صنعت لوستر سازی کشور باشد. این شرکت مفتخر است کلیه محصولات خود را به بیش از 10 کشور اروپایی و آسیایی معرفی نموده که بتواند قدمی در جهت شکوفایی نام ایران بردارد. شرکت صنایع لوستر صالحی از سال 1352 تا کنون فعالیت خود را در زمینه ساخت انواع لوستر و دیگر تجهیزات میباشد.',
  galleryImages: [
    aboutGalleryShowroomImg,
    aboutGalleryGrandAtelierImg,
    GENERATED_IMAGES.projectFereshteh,
    aboutGalleryRoyalStaircaseImg,
    aboutGalleryModernVillaImg,
    aboutGalleryEmeraldPalaceImg,
  ],
  catalogTitle: 'فایل کاتالوگ محصولات',
  catalogTitleColor: '#181818',
  catalogDescription:
    'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
  catalogDescriptionColor: '#777777',
  catalogCardTitle: 'کاتالوگ محصولات لوستر صالحی',
  catalogPageCount: '۱۲۶ صفحه',
  catalogDownloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
};

interface AboutUsContentSectionProps {
  aboutUsSettings?: AboutUsSettingsConfig;
  footerSettings?: FooterSettingsConfig;
  faqSettings?: any;
  onShowToast?: (
    type: AppToast['type'],
    title: string,
    message: string,
    onComplete?: () => void
  ) => void;
}

const toPersianDigits = (val: string | number): string =>
  String(val).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/**
 * ۱. آیکون دانلود فایل (frame.png) - دقیقاً مطابق تصویر اول
 */
const FrameDownloadVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[20px] h-[20px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.44 8.90002C20.04 9.21002 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.73998C4.26998 21.5 2.47998 19.71 2.47998 15.24V15.11C2.47998 11.09 3.92998 9.24002 7.46998 8.91002"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V14.88"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.35 12.65L12 16L8.65002 12.65"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۲. آیکون صاعقه / پشتیبانی ۲۴ ساعته (flash.png) - دقیقاً مطابق تصویر دوم
 */
const FlashVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[34px] h-[34px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.32004 13.28H12.41V20.48C12.41 21.54 13.73 22.04 14.43 21.24L22.0001 12.64C22.6601 11.89 22.13 10.72 21.13 10.72H18.04V3.52002C18.04 2.46002 16.72 1.96002 16.02 2.76002L8.45004 11.36C7.80004 12.11 8.33004 13.28 9.32004 13.28Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۳. آیکون جعبه بسته‌بندی (box.png) - دقیقاً مطابق تصویر سوم
 */
const BoxVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[34px] h-[34px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.17004 7.44001L12 12.55L20.77 7.46997"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21.61V12.54"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 13.24V9.58002L7.51001 4.09998"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۴. آیکون کامیون حمل و نقل سریع (truck-fast.png) - دقیقاً مطابق تصویر چهارم
 */
const TruckFastVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[34px] h-[34px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 14H13C14.1 14 15 13.1 15 12V2H6C4.5 2 3.19 2.83 2.51 4.05"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17C2 18.66 3.34 20 5 20H6C6 18.9 6.9 18 8 18C9.1 18 10 18.9 10 20H14C14 18.9 14.9 18 16 18C17.1 18 18 18.9 18 20H19C20.66 20 22 18.66 22 17V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L18.58 6.01C18.22 5.39 17.56 5 16.84 5H15V12C15 13.1 14.1 14 13 14H12"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 12V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L22 12Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 8H8"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 11H6"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 14H4"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۵. آیکون کتاب کاتالوگ (book.png) - دقیقاً مطابق تصویر پنجم
 */
const BookVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M22 16.74V4.67C22 3.47 21.02 2.58 19.83 2.68H19.77C17.67 2.86 14.48 3.93 12.7 5.05L12.53 5.16C12.24 5.34 11.76 5.34 11.47 5.16L11.22 5.01C9.44 3.9 6.26 2.84 4.16 2.67C2.97 2.57 2 3.47 2 4.66V16.74C2 17.7 2.78 18.6 3.74 18.72L4.03 18.76C6.2 19.05 9.55 20.15 11.47 21.2L11.51 21.22C11.78 21.37 12.21 21.37 12.47 21.22C14.39 20.16 17.75 19.05 19.93 18.76L20.26 18.72C21.22 18.6 22 17.7 22 16.74Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5.48999V20.49"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.75 8.48999H5.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 11.49H5.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۶. آیکون کادر تخصصی نصب در محل (format-square.png) - دقیقاً مطابق تصویر ششم
 */
const FormatSquareVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[34px] h-[34px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 6.95V17.05C18.6 17.05 17.05 18.6 17.05 20H6.95C6.95 18.6 5.4 17.05 4 17.05V6.95C5.4 6.95 6.95 5.4 6.95 4H17.05C17.05 5.4 18.6 6.95 20 6.95Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 4.5C7 5.88 5.88 7 4.5 7C3.12 7 2 5.88 2 4.5C2 3.12 3.12 2 4.5 2C5.88 2 7 3.12 7 4.5Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 4.5C22 5.88 20.88 7 19.5 7C18.12 7 17 5.88 17 4.5C17 3.12 18.12 2 19.5 2C20.88 2 22 3.12 22 4.5Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 19.5C7 20.88 5.88 22 4.5 22C3.12 22 2 20.88 2 19.5C2 18.12 3.12 17 4.5 17C5.88 17 7 18.12 7 19.5Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 19.5C22 20.88 20.88 22 19.5 22C18.12 22 17 20.88 17 19.5C17 18.12 18.12 17 19.5 17C20.88 17 22 18.12 22 19.5Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۷ و ۸. وکتور دقیق سرگل‌های بالا و پایین کارت‌های ویژگی (Vectorup-about.png و Vectordown-about.png)
 * در حالت غیرفعال به صورت خطی طلایی روشن و در حالت فعال/هاور به صورت توپر طلایی تیره
 */
const AboutCardPalmetteOrnament: React.FC<{
  direction: 'up' | 'down';
  active?: boolean;
  className?: string;
}> = ({ direction, active = false, className = '' }) => (
  <svg
    viewBox="0 0 110 102"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none transition-all duration-200 ${
      direction === 'up' ? 'rotate-90' : '-rotate-90'
    } ${className}`}
  >
    <g
      stroke={active ? '#a98552' : '#d2bea0'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M103 46.5 C93 42.5, 88.5 36, 87.5 26.5 C94 31, 108.5 29.5, 108.5 16.5 C108.5 6.5, 95 2.5, 81 1.5 C83.5 7.5, 88.5 11.5, 85.5 14.5 C82.5 17, 77 11, 76 5.5 C69 4, 63 3, 58 2.5 C57.5 12.5, 65 19, 73 26 C78.5 31, 78 37.5, 72 37.5 C65.5 37.5, 58 26.5, 49 22 C40 19.5, 33 19, 26.5 18.5 C28.5 26.5, 35.5 33, 43 36 C28.5 35.5, 15.5 41.5, 2 51 C15.5 60.5, 28.5 66.5, 43 66 C35.5 69, 28.5 75.5, 26.5 83.5 C33 83, 40 82.5, 49 80 C58 75.5, 65.5 64.5, 72 64.5 C78 64.5, 78.5 71, 73 76 C65 83, 57.5 89.5, 58 99.5 C63 99, 69 98, 76 96.5 C77 91, 82.5 85, 85.5 87.5 C88.5 90.5, 83.5 94.5, 81 100.5 C95 99.5, 108.5 95.5, 108.5 85.5 C108.5 72.5, 94 71, 87.5 75.5 C88.5 66, 93 59.5, 103 55.5 Z"
        fill={active ? '#a98552' : 'none'}
      />
      <path
        d="M104.5 49 C95 46, 86 42.5, 80.5 40.5 C78.5 40, 78 42.5, 80 43.5 C83 45, 87 46.5, 89.5 47.5 C83 45.5, 77 43.5, 73.5 43 C71.5 42.8, 71 45.5, 73.5 46.5 C76.5 47.8, 80.5 49, 83.5 49.6 C72 49.5, 58 49.5, 51 50 C49.5 50.2, 49.5 51.8, 51 52 C58 52.5, 72 52.5, 83.5 52.4 C80.5 53, 76.5 54.2, 73.5 55.5 C71 56.5, 71.5 59.2, 73.5 59 C77 58.5, 83 56.5, 89.5 54.5 C87 55.5, 83 57, 80 58.5 C78 59.5, 78.5 62, 80.5 61.5 C86 59.5, 95 56, 104.5 53 Z"
        fill={active ? '#fcfbf9' : 'none'}
        stroke={active ? '#fcfbf9' : '#d2bea0'}
      />
    </g>
  </svg>
);

interface WhyBuyFeatureItem {
  id: string;
  title: string;
  icon: 'flash' | 'format-square' | 'truck-fast' | 'box';
}

const WHY_BUY_FEATURES: WhyBuyFeatureItem[] = [
  {
    id: 'support-24',
    title: 'پشتیبانی مجموعه ۲۴ ساعته',
    icon: 'flash',
  },
  {
    id: 'expert-install',
    title: 'نصب تخصصی لوستر در محل',
    icon: 'format-square',
  },
  {
    id: 'free-shipping',
    title: 'حمل و نقل رایگان محصول',
    icon: 'truck-fast',
  },
  {
    id: 'safe-packaging',
    title: 'بسته‌بندی دقیق و ایمن (مستحکم)',
    icon: 'box',
  },
];

const GALLERY_SLIDES = [
  aboutGalleryShowroomImg,
  aboutGalleryGrandAtelierImg,
  GENERATED_IMAGES.projectFereshteh,
  aboutGalleryRoyalStaircaseImg,
  aboutGalleryModernVillaImg,
  aboutGalleryEmeraldPalaceImg,
];

export const AboutUsContentSection = (props: AboutUsContentSectionProps) => {
  const {
    aboutUsSettings,
    footerSettings,
    faqSettings = { faqs: { about: [], rules: [] } },
    onShowToast,
  } = props;
  const effectiveStoryTitle =
    aboutUsSettings?.storyTitle || INITIAL_ABOUT_US_SETTINGS.storyTitle;
  const effectiveCatalogTitle =
    aboutUsSettings?.catalogTitle ||
    footerSettings?.catalogTitle ||
    INITIAL_ABOUT_US_SETTINGS.catalogTitle;
  const effectiveCatalogDescription =
    aboutUsSettings?.catalogDescription ||
    footerSettings?.catalogDescription ||
    INITIAL_ABOUT_US_SETTINGS.catalogDescription;
  const effectiveCatalogCardTitle =
    aboutUsSettings?.catalogCardTitle ||
    footerSettings?.catalogCardTitle ||
    INITIAL_ABOUT_US_SETTINGS.catalogCardTitle;
  const effectiveCatalogPageCount =
    aboutUsSettings?.catalogPageCount ||
    footerSettings?.catalogPageCount ||
    INITIAL_ABOUT_US_SETTINGS.catalogPageCount;
  const effectiveCatalogDownloadUrl =
    aboutUsSettings?.catalogDownloadUrl ||
    footerSettings?.catalogDownloadUrl ||
    INITIAL_ABOUT_US_SETTINGS.catalogDownloadUrl;
  const effectiveStoryDescription =
    aboutUsSettings?.storyDescription ||
    INITIAL_ABOUT_US_SETTINGS.storyDescription;
  const effectiveGallerySlides =
    aboutUsSettings?.galleryImages && aboutUsSettings.galleryImages.length > 0
      ? aboutUsSettings.galleryImages
      : GALLERY_SLIDES;

  const effectiveAboutFaqs = faqSettings?.faqs?.about || [];

  // اسلایدر عکس بخش اول (درباره لوستر صالحی)
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isGalleryPaused, setIsGalleryPaused] = useState<boolean>(false);

  // چرخش اتوماتیک و نرم کروسل تصاویر بخش اول
  useEffect(() => {
    if (isGalleryPaused || effectiveGallerySlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentSlideIndex((prev) =>
        prev >= effectiveGallerySlides.length - 1 ? 0 : prev + 1
      );
    }, 3800);
    return () => window.clearInterval(timer);
  }, [isGalleryPaused, currentSlideIndex, effectiveGallerySlides.length]);

  // کارت در حال هاور در بخش «چرا باید از لوستر صالحی خرید کنیم ؟!» (فقط هنگام هاور روشن شود و ثابت نماند)
  const [activeDesktopFeatureId, setActiveDesktopFeatureId] =
    useState<string | null>(null);
  // اسلاید فعال در موبایل (در موبایل پیش‌فرض کارت ۱ مطابق عکس دهم)
  const [mobileFeatureIndex, setMobileFeatureIndex] = useState<number>(1);
  const [isMobileFeaturePaused, setIsMobileFeaturePaused] =
    useState<boolean>(false);

  // چرخش اتوماتیک و نرم کروسل کارت‌های ویژگی در نمای موبایل
  useEffect(() => {
    if (isMobileFeaturePaused) return;
    const timer = window.setInterval(() => {
      setMobileFeatureIndex((prev) => (prev + 1) % WHY_BUY_FEATURES.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [isMobileFeaturePaused, mobileFeatureIndex]);

  // وضعیت باز بودن سوالات متداول (در حالت عادی پیش‌فرض بسته باشند)
  const [openRightFaqId, setOpenRightFaqId] = useState<number | string | null>(null);
  const [openLeftFaqId, setOpenLeftFaqId] = useState<number | string | null>(null);

  // وضعیت دانلود کاتالوگ
  const [isDownloadingCatalog, setIsDownloadingCatalog] =
    useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const downloadAttemptRef = useRef<number>(0);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev === 0 ? GALLERY_SLIDES.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev === GALLERY_SLIDES.length - 1 ? 0 : prev + 1
    );
  };

  const renderFeatureIcon = (iconType: WhyBuyFeatureItem['icon']) => {
    switch (iconType) {
      case 'flash':
        return <FlashVectorIcon className="w-[34px] h-[34px]" />;
      case 'format-square':
        return <FormatSquareVectorIcon className="w-[34px] h-[34px]" />;
      case 'truck-fast':
        return <TruckFastVectorIcon className="w-[34px] h-[34px]" />;
      case 'box':
        return <BoxVectorIcon className="w-[34px] h-[34px]" />;
    }
  };

  const handleDownloadCatalog = () => {
    if (isDownloadingCatalog) return;
    setIsDownloadingCatalog(true);
    setDownloadProgress(0);

    const downloadUrl = (effectiveCatalogDownloadUrl && effectiveCatalogDownloadUrl.trim()) 
      || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    let currentProg = 0;
    const intervalId = window.setInterval(() => {
      // شبیه‌سازی سرعت متغیر بارگذاری برای مودال گرافیکی
      const increment = Math.floor(Math.random() * 8) + 4;
      currentProg = Math.min(100, currentProg + increment);
      setDownloadProgress(currentProg);

      if (currentProg >= 100) {
        window.clearInterval(intervalId);
        
        // شروع دانلود واقعی فایل دقیقا پس از پر شدن ۱۰۰ درصدی نوار پیشرفت مودال
        try {
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Salehi-Chandelier-Catalog.pdf';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          console.error('Error initiating catalog download:', e);
        }

        // یک تاخیر کوتاه برای نمایش حالت تکمیل شده ۱۰۰٪ و سپس بستن مودال
        window.setTimeout(() => {
          setIsDownloadingCatalog(false);
          setDownloadProgress(0);
          onShowToast?.(
            'catalog-download-success',
            'دانلود فایل PDF',
            'فایل کاتالوگ محصولات با موفقیت دریافت شد.'
          );
        }, 1000);
      }
    }, 95);
  };

  const renderFaqAccordionColumn = (
    faqs: any[],
    openId: number | string | null,
    setOpenId: React.Dispatch<React.SetStateAction<number | string | null>>,
    keyPrefix: string
  ) => (
    <div className="divide-y divide-[#ebebeb] border-b border-[#ebebeb]">
      {faqs.map((item, idx) => {
        const isOpen = openId === item.id;
        return (
          <div key={`${keyPrefix}-${item.id || idx}`} className="py-4">
            <button
              type="button"
              onClick={() =>
                setOpenId((prev) => (prev === item.id ? null : item.id))
              }
              className="w-full flex items-center justify-between gap-3 text-right cursor-pointer focus:outline-none group"
            >
              <div className="flex items-center justify-start gap-3.5 min-w-0">
                <span
                  className={`w-[38px] h-[38px] rounded-[9px] border flex items-center justify-center text-[13.5px] font-bold shrink-0 tabular-nums transition-colors ${
                    isOpen
                      ? 'border-[#c5a877] bg-[#faf7f2] text-[#a98552]'
                      : 'border-[#eaeaea] bg-white text-[#2b2b2b] group-hover:border-[#c5a877]'
                  }`}
                >
                  {toPersianDigits(idx + 1)}
                </span>
                <span className="text-[13px] sm:text-[14px] font-bold text-[#1e1e1e] leading-snug">
                  <span>{item.question}</span>
                </span>
              </div>

              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-[#2b2b2b] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#2b2b2b] shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="mt-3.5 mr-[18px] pr-5 border-r-[1.5px] border-dashed border-[#c5a877] text-right space-y-3">
                <p
                  className="text-[12px] sm:text-[12.5px] leading-[2.15] text-[#666666] text-justify"
                  style={{ textAlignLast: 'right' }}
                >
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const activeMobileFeature =
    WHY_BUY_FEATURES[mobileFeatureIndex] || WHY_BUY_FEATURES[0];

  return (
    <main className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20 pt-8 sm:pt-12 pb-12 sm:pb-20">
      {/* ==================== ۱. عنوان «درباره لوستر صالحی» و بخش «داستان بی انتهای ما!» ==================== */}
      <section>
        <SectionHeading title="درباره لوستر صالحی" className="mb-8 sm:mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center">
          {/* ستون راست در دسکتاپ / بالا در موبایل: متن داستان بی انتهای ما */}
          <div className="lg:col-span-7 text-right">
            <h3 className="text-[16px] sm:text-[18.5px] font-extrabold text-[#1e1e1e] mb-4">
              {effectiveStoryTitle}
            </h3>
            <p
              className="text-[13px] sm:text-[14px] lg:text-[14.5px] leading-[2.3] text-[#4a4a4a] text-justify whitespace-pre-line"
              style={{ textAlignLast: 'right' }}
            >
              {effectiveStoryDescription}
            </p>
          </div>

          {/* ستون چپ در دسکتاپ / پایین در موبایل: اسلایدر تصویر لوستر تالار */}
          <div className="lg:col-span-5">
            <div
              onMouseEnter={() => setIsGalleryPaused(true)}
              onMouseLeave={() => setIsGalleryPaused(false)}
              onTouchStart={() => setIsGalleryPaused(true)}
              onTouchEnd={() => setIsGalleryPaused(false)}
              className="relative w-full aspect-[16/10] rounded-[18px] sm:rounded-[20px] overflow-hidden shadow-sm bg-[#ebe7df] group"
            >
              {effectiveGallerySlides.map((slideSrc, idx) => {
                const isCurrent = idx === currentSlideIndex;
                return (
                  <img
                    key={idx}
                    src={slideSrc}
                    alt="لوستر کلاسیک اکبر صالحی"
                    referrerPolicy="no-referrer"
                    onClick={handleNextSlide}
                    className={`w-full h-full object-cover cursor-pointer transition-all duration-700 ease-in-out ${
                      idx === 0 ? 'relative' : 'absolute inset-0'
                    } ${
                      isCurrent
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 pointer-events-none z-0'
                    }`}
                  />
                );
              })}

              {/* دکمه‌های چپ و راست اسلایدر در دسکتاپ مطابق عکس نهم */}
              {effectiveGallerySlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="تصویر قبلی"
                    className="hidden sm:flex absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-[8px] bg-white/90 hover:bg-white text-[#2b2b2b] items-center justify-center shadow-xs transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="تصویر بعدی"
                    className="hidden sm:flex absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-[8px] bg-white/90 hover:bg-white text-[#2b2b2b] items-center justify-center shadow-xs transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* نقطه‌های صفحه‌بندی پایین تصویر */}
              {effectiveGallerySlides.length > 1 && (
                <div className="absolute bottom-3.5 inset-x-0 z-20 flex items-center justify-center gap-1.5">
                  {effectiveGallerySlides.map((_, idx) => {
                    const isActive = idx === currentSlideIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        aria-label={`اسلاید ${idx + 1}`}
                        className={`rounded-full transition-all duration-500 cursor-pointer ${
                          isActive
                            ? 'w-6 h-1.5 bg-[#b59766] shadow-xs'
                            : 'w-2 h-1.5 bg-white/70 hover:bg-white'
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ۲. بخش «چرا باید از لوستر صالحی خرید کنیم ؟!» ==================== */}
      <section className="mt-14 sm:mt-20">
        <h3 className="text-[16px] sm:text-[18.5px] font-extrabold text-[#1e1e1e] text-right mb-10 sm:mb-12">
          چرا باید از لوستر صالحی خرید کنیم ؟!
        </h3>

        {/* نمای دسکتاپ: ۴ کارت در یک ردیف با سرگل‌های Vectorup-about و Vectordown-about */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 py-6">
          {WHY_BUY_FEATURES.map((feature) => {
            const isActive = activeDesktopFeatureId === feature.id;
            return (
              <div
                key={feature.id}
                onMouseEnter={() => setActiveDesktopFeatureId(feature.id)}
                onMouseLeave={() => setActiveDesktopFeatureId(null)}
                className="relative flex flex-col items-center cursor-pointer group"
              >
                {/* سرگل بالایی (Vectorup-about.png) */}
                <div className="-mb-[3px] z-10">
                  <AboutCardPalmetteOrnament
                    direction="up"
                    active={isActive}
                    className="w-11 h-10"
                  />
                </div>

                {/* بدنه کارت */}
                <div
                  className={`w-full h-[168px] rounded-[18px] bg-white border transition-all duration-200 flex flex-col items-center justify-center px-4 text-center ${
                    isActive
                      ? 'border-[#c5a877] shadow-[0_10px_30px_rgba(176,140,87,0.08)]'
                      : 'border-[#ebebeb]'
                  }`}
                >
                  <div
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-[#a98552]' : 'text-[#292d32]'
                    }`}
                  >
                    {renderFeatureIcon(feature.icon)}
                  </div>

                  <h4 className="text-[13.5px] lg:text-[14px] font-extrabold text-[#1e1e1e] mt-4">
                    {feature.title}
                  </h4>

                  {/* خط طلایی زیر عنوان در حالت فعال مطابق عکس نهم */}
                  <span
                    className={`h-[3px] rounded-full transition-all duration-200 mt-3 ${
                      isActive ? 'w-10 bg-[#a98552]' : 'w-0 bg-transparent'
                    }`}
                  />
                </div>

                {/* سرگل پایینی (Vectordown-about.png) */}
                <div className="-mt-[3px] z-10">
                  <AboutCardPalmetteOrnament
                    direction="down"
                    active={isActive}
                    className="w-11 h-10"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* نمای موبایل: اسلایدر تکی با سرگل‌های بالا و پایین و نقطه‌های اسلایدر مطابق عکس دهم */}
        <div
          onMouseEnter={() => setIsMobileFeaturePaused(true)}
          onMouseLeave={() => setIsMobileFeaturePaused(false)}
          onTouchStart={() => setIsMobileFeaturePaused(true)}
          onTouchEnd={() => setIsMobileFeaturePaused(false)}
          className="md:hidden flex flex-col items-center pt-2"
        >
          <div className="-mb-[3px] z-10">
            <AboutCardPalmetteOrnament
              direction="up"
              active={false}
              className="w-12 h-11"
            />
          </div>

          <div
            onClick={() =>
              setMobileFeatureIndex(
                (prev) => (prev + 1) % WHY_BUY_FEATURES.length
              )
            }
            className="relative w-full min-h-[162px] rounded-[18px] bg-white border border-[#eaeaea] flex flex-col items-center justify-center px-5 py-7 text-center cursor-pointer overflow-hidden"
          >
            {WHY_BUY_FEATURES.map((featureItem, idx) => {
              const isSelected = idx === mobileFeatureIndex;
              return (
                <div
                  key={featureItem.id}
                  className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
                    idx === 0 ? 'relative' : 'absolute inset-0 px-5 py-7'
                  } ${
                    isSelected
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="text-[#292d32]">
                    {renderFeatureIcon(featureItem.icon)}
                  </div>
                  <h4 className="text-[14.5px] font-extrabold text-[#1e1e1e] mt-4">
                    {featureItem.title}
                  </h4>
                </div>
              );
            })}
          </div>

          <div className="-mt-[3px] z-10">
            <AboutCardPalmetteOrnament
              direction="down"
              active={false}
              className="w-12 h-11"
            />
          </div>

          {/* نقطه‌های صفحه‌بندی زیر کارت موبایل */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {WHY_BUY_FEATURES.map((item, idx) => {
              const isSelected = idx === mobileFeatureIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMobileFeatureIndex(idx)}
                  aria-label={item.title}
                  className={`rounded-full transition-all duration-500 cursor-pointer ${
                    isSelected
                      ? 'w-2 h-2 bg-[#2b2b2b]'
                      : 'w-1.5 h-1.5 bg-[#dcdcdc]'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== ۳. بخش «پرسش و پاسخ سوالات مهم» ==================== */}
      {effectiveAboutFaqs.length > 0 && (
        <section className="mt-14 sm:mt-20">
          <h3 className="text-[16px] sm:text-[18.5px] font-extrabold text-[#1e1e1e] text-right mb-5 sm:mb-6">
            پرسش و پاسخ سوالات مهم
          </h3>

          {/* در دسکتاپ ۲ ستون موازی (عکس نهم) و در موبایل ۱ ستون (عکس دهم) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
            <div>
              {renderFaqAccordionColumn(
                effectiveAboutFaqs.slice(0, Math.ceil(effectiveAboutFaqs.length / 2)),
                openRightFaqId,
                setOpenRightFaqId,
                'right-faq'
              )}
            </div>
            <div className="hidden lg:block">
              {renderFaqAccordionColumn(
                effectiveAboutFaqs.slice(Math.ceil(effectiveAboutFaqs.length / 2)),
                openLeftFaqId,
                setOpenLeftFaqId,
                'left-faq'
              )}
            </div>
          </div>

          {/* دکمه «نمایش سوالات بیشتر» در پایین لیست موبایل مطابق عکس دهم */}
          {effectiveAboutFaqs.length > 4 && (
            <div className="lg:hidden mt-5 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setOpenRightFaqId((prev) => {
                    const currentIdx = effectiveAboutFaqs.findIndex((f: any) => f.id === prev);
                    const nextIdx = (currentIdx + 1) % effectiveAboutFaqs.length;
                    return effectiveAboutFaqs[nextIdx].id;
                  })
                }
                className="text-[12.5px] font-semibold text-[#8a8a8a] hover:text-[#2b2b2b] transition-colors cursor-pointer"
              >
                نمایش سوالات بیشتر
              </button>
            </div>
          )}
        </section>
      )}

      {/* ==================== ۴. بخش «فایل کاتالوگ محصولات» و کارت دانلود PDF ==================== */}
      <section className="mt-14 sm:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
          {/* سمت راست در دسکتاپ / بالا در موبایل: عنوان و توضیحات کاتالوگ */}
          <div className="lg:col-span-8 xl:col-span-9 text-right">
            <h3
              className="text-[16px] sm:text-[18.5px] font-extrabold mb-4"
              style={{ color: aboutUsSettings?.catalogTitleColor || '#1e1e1e' }}
            >
              {effectiveCatalogTitle}
            </h3>
            <p
              className="text-[13px] sm:text-[14px] leading-[2.3] text-justify whitespace-pre-line"
              style={{
                textAlignLast: 'right',
                color: aboutUsSettings?.catalogDescriptionColor || '#4a4a4a',
              }}
            >
              {effectiveCatalogDescription}
            </p>
          </div>

          {/* سمت چپ در دسکتاپ / پایین در موبایل: کارت دانلود کاتالوگ PDF */}
          <div className="lg:col-span-4 xl:col-span-3 flex justify-end">
            <div className="w-full lg:max-w-[295px] rounded-[18px] border border-[#eaeaea] bg-white p-5 sm:p-6 shadow-[0_6px_28px_rgba(0,0,0,0.03)]">
              {/* ردیف بالا: آیکون کتاب در راست و Format PDF در چپ */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f5f5f5] text-[#292d32] flex items-center justify-center shrink-0">
                  <BookVectorIcon className="w-[22px] h-[22px]" />
                </div>

                <span
                  dir="ltr"
                  className="text-[13px] font-bold text-[#1e1e1e] font-sans"
                >
                  Format <span className="text-[#a98552]">PDF</span>
                </span>
              </div>

              {/* عنوان و تعداد صفحات کاتالوگ */}
              <div className="text-right mb-5">
                <h4 className="text-[14px] sm:text-[14.5px] font-extrabold text-[#1e1e1e]">
                  {effectiveCatalogCardTitle}
                </h4>
                <span className="block text-[12.5px] font-semibold text-[#555555] mt-1.5 tabular-nums">
                  {effectiveCatalogPageCount}
                </span>
              </div>

              {/* دکمه «دانلود فایل» با آیکون frame.png */}
              <button
                type="button"
                onClick={handleDownloadCatalog}
                disabled={isDownloadingCatalog}
                className="w-full h-[46px] rounded-[10px] bg-[#f4f1ea] hover:bg-[#ebe5d8] active:bg-[#e2dac9] text-[#a98552] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-80"
              >
                {isDownloadingCatalog ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-[#a98552]/30 border-t-[#a98552] animate-spin shrink-0" />
                    <span>در حال آماده‌سازی...</span>
                  </>
                ) : (
                  <>
                    <span>دانلود فایل</span>
                    <FrameDownloadVectorIcon className="w-[19px] h-[19px]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* مودال گرافیکی پیشرفت دانلود کاتالوگ PDF مطابق درخواست کاربر */}
      {isDownloadingCatalog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-[28px] border border-[#e5dec9] shadow-2xl p-7 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#f5f1ea]" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-[#b59766] transition-all duration-300 ease-out"
                style={{ 
                  clipPath: `inset(0 0 0 0)`, 
                  strokeDasharray: '251.2', 
                  strokeDashoffset: (251.2 - (251.2 * downloadProgress) / 100) 
                }} 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {downloadProgress < 100 ? (
                  <FileText className="w-8 h-8 text-[#b59766] animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-[#b59766]" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#1e1e1e]">
                {downloadProgress < 100 ? 'در حال آماده‌سازی کاتالوگ...' : 'آماده دانلود شد!'}
              </h3>
              <p className="text-xs text-[#777] font-medium">
                لطفاً تا پایان پردازش و شروع دانلود فایل PDF منتظر بمانید.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#b59766] tabular-nums">
                <span>پیشرفت عملیات:</span>
                <span>{downloadProgress.toLocaleString('fa-IR')}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f5f1ea] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-l from-[#b59766] to-[#d2bea0] transition-all duration-300 ease-out rounded-full shadow-sm"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>

            {downloadProgress === 100 && (
              <p className="text-[11px] font-bold text-[#b59766] animate-bounce pt-2">
                فایل در حال دریافت می‌باشد...
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default AboutUsContentSection;
