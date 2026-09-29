import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { HeaderBrandLogo } from '../Ornaments';

interface HeaderSectionProps {
  totalCartCount: number;
  onOpenCart: () => void;
  onOpenLogin?: () => void;
  isLoggedIn?: boolean;
  userDisplayName?: string;
  onToggleUserDisplayName?: () => void;
  onLogout?: () => void;
  forceOpenProfileMenu?: boolean;
  onProfileMenuInteracted?: () => void;
  onOpen3DStudio: () => void;
  onOpenCustomProductModal?: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
}

/**
 * آیتم‌های زیرمنوی «محصولات» دقیقاً مطابق تصویر فیگما
 */
const PRODUCTS_SUBMENU_ITEMS: SubMenuItem[] = [
  { id: 'sub-chandeliers', label: 'کلکسیون لوستر ها', href: '#collection-salehi' },
  { id: 'sub-single-branch', label: 'کلکسیون تک شاخه ها', href: '#collection-salehi' },
  { id: 'sub-kenar-saloni', label: 'کلکسیون کنار سالونی', href: '#collection-salehi' },
  { id: 'sub-abalour', label: 'کلکسیون آباژور', href: '#collection-salehi' },
  { id: 'sub-mirror-console', label: 'کلکسیون آینه و کنسول', href: '#collection-salehi' },
  { id: 'sub-shamdooni', label: 'کلکسیون شمعدونی', href: '#collection-salehi' },
  { id: 'sub-table', label: 'کلکسیون میز', href: '#collection-salehi' },
];

/**
 * آیتم‌های زیرمنوی «موارد دیگر» با همان استایل یکپارچه
 */
const MORE_SUBMENU_ITEMS: SubMenuItem[] = [
  { id: 'more-bestsellers', label: 'پرفروش‌ترین محصولات', href: '#best-sellers' },
  { id: 'more-custom', label: 'سفارش اختصاصی لوستر', href: '#custom-chandelier' },
  { id: 'more-categories', label: 'دسته‌بندی کلکسیون‌ها', href: '#product-categories' },
  { id: 'more-testimonials', label: 'نظرات مشتریان', href: '#customer-reviews' },
  { id: 'more-faq', label: 'سوالات متداول', href: '#faq-section' },
];

/**
 * آیکون پرچم ایران دقیقاً مطابق فایل IR.png ارسالی
 */
const IranFlagIcon: React.FC<{ className?: string }> = ({
  className = 'w-7 h-5',
}) => (
  <svg
    viewBox="0 0 28 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <clipPath id="ir-flag-clip">
      <rect width="28" height="20" rx="4.2" />
    </clipPath>
    <g clipPath="url(#ir-flag-clip)">
      {/* نوار سفید میانی */}
      <rect width="28" height="20" fill="#FFFFFF" />
      {/* نوار سبز بالا */}
      <rect width="28" height="6.5" fill="#6DA544" />
      {/* نوار قرمز پایین */}
      <rect y="13.5" width="28" height="6.5" fill="#D80027" />

      {/* نقش ظریف حاشیه کوفی لبه‌های سبز و قرمز مطابق IR.png */}
      <line
        x1="1"
        y1="5.7"
        x2="27"
        y2="5.7"
        stroke="#A3CC83"
        strokeWidth="0.9"
        strokeDasharray="1.4 1.4"
      />
      <line
        x1="1"
        y1="14.3"
        x2="27"
        y2="14.3"
        stroke="#EA6B7F"
        strokeWidth="0.9"
        strokeDasharray="1.4 1.4"
      />

      {/* نشان وسط پرچم ایران */}
      <g fill="#D80027">
        {/* ستون مرکزی */}
        <rect x="13.45" y="7.1" width="1.1" height="5.8" rx="0.5" />
        {/* هلال‌های طرفین */}
        <path d="M12.2 7.5C11.1 8.3 11.1 11.1 12.4 12.2C12.8 12.5 13.4 12.7 14 12.7C13.2 12.1 12.3 10.6 12.6 8.6C12.7 8.1 12.5 7.7 12.2 7.5Z" />
        <path d="M15.8 7.5C16.9 8.3 16.9 11.1 15.6 12.2C15.2 12.5 14.6 12.7 14 12.7C14.8 12.1 15.7 10.6 15.4 8.6C15.3 8.1 15.5 7.7 15.8 7.5Z" />
        <path d="M11.15 8.1C10.45 9.0 10.55 11.2 11.65 12.1C11.35 11.1 11.35 9.2 11.8 8.3C11.6 8.05 11.35 8.0 11.15 8.1Z" />
        <path d="M16.85 8.1C17.55 9.0 17.45 11.2 16.35 12.1C16.65 11.1 16.65 9.2 16.2 8.3C16.4 8.05 16.65 8.0 16.85 8.1Z" />
      </g>
    </g>
  </svg>
);

/**
 * آیکون پرچم انگلیس (UK Flag) با همان ابعاد و گوشه‌های گرد پرچم ایران
 */
const UkFlagIcon: React.FC<{ className?: string }> = ({
  className = 'w-7 h-5',
}) => (
  <svg
    viewBox="0 0 28 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <clipPath id="uk-flag-clip">
      <rect width="28" height="20" rx="4.2" />
    </clipPath>
    <g clipPath="url(#uk-flag-clip)">
      {/* پس‌زمینه آبی سرمه‌ای */}
      <rect width="28" height="20" fill="#012169" />
      {/* خطوط قطری سفید */}
      <path d="M0 0L28 20M28 0L0 20" stroke="#FFFFFF" strokeWidth="4" />
      {/* خطوط قطری قرمز */}
      <path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" strokeWidth="1.8" />
      {/* صلیب سفید مرکزی */}
      <path d="M14 0V20M0 10H28" stroke="#FFFFFF" strokeWidth="6" />
      {/* صلیب قرمز مرکزی */}
      <path d="M14 0V20M0 10H28" stroke="#C8102E" strokeWidth="3.4" />
    </g>
  </svg>
);

/**
 * آیکون سبد خرید دقیقاً مطابق فایل bag-2.png ارسالی (کیف خرید با دسته نیم‌دایره و دو نقطه در داخل)
 */
const HeaderBagIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.3 8.2V6.9C8.3 4.75 9.96 3 12 3C14.04 3 15.7 4.75 15.7 6.9V8.2"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.1 21H14.9C18.45 21 19.15 19.55 19.4 17.7L20.05 12.4C20.3 9.95 19.65 8.2 15.75 8.2H8.25C4.35 8.2 3.7 9.95 3.95 12.4L4.6 17.7C4.85 19.55 5.55 21 9.1 21Z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9.35" cy="12.25" r="1.15" fill="currentColor" />
    <circle cx="14.65" cy="12.25" r="1.15" fill="currentColor" />
  </svg>
);

/**
 * آیکون حساب کاربری دقیقاً مطابق فایل frame.png ارسالی (دایره بالا + بیضی بسته در پایین)
 */
const HeaderUserIcon: React.FC<{ className?: string }> = ({
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
      cy="7.8"
      r="4.1"
      stroke="currentColor"
      strokeWidth="1.9"
    />
    <ellipse
      cx="12"
      cy="17.3"
      rx="6.3"
      ry="3.6"
      stroke="currentColor"
      strokeWidth="1.9"
    />
  </svg>
);

/**
 * آیکون «پنل پیشخوان» دقیقاً مطابق فایل element-3.png ارسالی (۴ مربع گوشه‌گرد ۲×۲)
 */
const ProfileDashboardIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="13.5"
      y="2"
      width="8.5"
      height="8.5"
      rx="2.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="2"
      y="2"
      width="8.5"
      height="8.5"
      rx="2.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="13.5"
      y="13.5"
      width="8.5"
      height="8.5"
      rx="2.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="2"
      y="13.5"
      width="8.5"
      height="8.5"
      rx="2.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون «سفارش های من» دقیقاً مطابق فایل shopping-bag.png ارسالی
 */
const ProfileOrdersBagIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.4 6.5H15.6C19 6.5 19.34 8.09 19.57 10.03L20.47 17.53C20.76 19.99 20 22 16.5 22H7.51C4 22 3.24 19.99 3.54 17.53L4.44 10.03C4.66 8.09 5 6.5 8.4 6.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8V4.5C8 3 9 2 10.5 2H13.5C15 2 16 3 16 4.5V8"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.41 17.03H8"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون «لیست علاقه مندی ها» دقیقاً مطابق فایل archive.png ارسالی
 */
const ProfileArchiveBookmarkIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.82 2H7.18C5.05 2 3.32 3.74 3.32 5.86V19.95C3.32 21.75 4.61 22.51 6.19 21.64L11.07 18.93C11.59 18.64 12.43 18.64 12.94 18.93L17.82 21.64C19.4 22.52 20.69 21.76 20.69 19.95V5.86C20.68 3.74 18.95 2 16.82 2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.59 9.05C11.17 9.75 12.83 9.75 14.41 9.05"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون «خروج از حساب کاربری» دقیقاً مطابق فایل logout.png ارسالی
 */
const ProfileLogoutIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12H3.62"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.85 8.65L2.5 12L5.85 15.35"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * بخش هدر بالای صفحه (تمام‌عرض و سبک)
 * شامل لوگو و پترن Vector.png در لبه راست، منوی ناوبری در وسط و دکمه‌های زبان/سبد خرید/کاربر در چپ
 */
export const HeaderSection: React.FC<HeaderSectionProps> = ({
  totalCartCount,
  onOpenCart,
  onOpenLogin,
  isLoggedIn = false,
  userDisplayName = 'مشتری عزیز!',
  onToggleUserDisplayName,
  onLogout,
  forceOpenProfileMenu = false,
  onProfileMenuInteracted,
  onOpen3DStudio,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<
    'products' | 'more' | 'lang' | 'profile' | null
  >(null);
  const [selectedLang, setSelectedLang] = useState<'fa' | 'en'>('fa');
  const [hoveredLang, setHoveredLang] = useState<'fa' | 'en' | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (forceOpenProfileMenu && isLoggedIn) {
      setOpenSubmenu('profile');
    }
  }, [forceOpenProfileMenu, isLoggedIn]);

  const handleMenuEnter = (
    menu: 'products' | 'more' | 'lang' | 'profile'
  ) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenSubmenu(menu);
  };

  const handleMenuLeave = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenSubmenu(null);
      setHoveredLang(null);
    }, 160);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const activeHighlightedLang = hoveredLang ?? selectedLang;

  return (
    <header
      ref={headerRef}
      className="w-full bg-white border-b border-[#efefef] relative z-40"
    >
      <div className="w-full max-w-[1800px] mx-auto pr-0 pl-4 sm:pl-8 lg:pl-14 xl:pl-20 h-22 flex items-center justify-between gap-4">
        {/* سمت راست: لوگو چسبیده به پترن طلایی لبه راست دقیقاً مطابق عکس ارسالی */}
        <a
          href="#top"
          className="shrink-0 focus:outline-none flex items-center overflow-hidden"
          aria-label="گالری لوستر اکبر صالحی"
        >
          <HeaderBrandLogo />
        </a>

        {/* وسط: لینک‌های منوی ناوبری به همراه زیرمنوهای آبشاری دقیقاً مطابق طرح فیگما */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#2b2b2b]">
          {/* ۱. منوی محصولات با زیرمنوی ۷ آیتمی مطابق تصویر */}
          <div
            className="relative py-3"
            onMouseEnter={() => handleMenuEnter('products')}
            onMouseLeave={handleMenuLeave}
          >
            <button
              type="button"
              onClick={() =>
                setOpenSubmenu((prev) =>
                  prev === 'products' ? null : 'products'
                )
              }
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                openSubmenu === 'products'
                  ? 'text-[#141414]'
                  : 'hover:text-[#b59766]'
              }`}
            >
              <span>محصولات</span>
              <ChevronDown
                className={`w-4 h-4 text-[#2b2b2b] stroke-[1.9] transition-transform duration-200 ${
                  openSubmenu === 'products' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubmenu === 'products' && (
              <div
                dir="rtl"
                className="absolute top-[calc(100%+2px)] right-0 w-[235px] bg-white rounded-[18px] shadow-[0_14px_44px_rgba(0,0,0,0.12)] border border-[#f1f1f1] overflow-hidden py-1 z-50"
              >
                {PRODUCTS_SUBMENU_ITEMS.map((item, idx) => {
                  const isLast = idx === PRODUCTS_SUBMENU_ITEMS.length - 1;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpenSubmenu(null)}
                      className="group/item block w-full px-5 text-right text-[14px] font-medium text-[#1e1e1e] hover:bg-[#f6f1e7] hover:text-[#b59766] transition-colors"
                    >
                      <span
                        className={`block py-3.5 ${
                          !isLast
                            ? 'border-b border-[#efefef] group-hover/item:border-transparent'
                            : ''
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <a
            href="#executed-projects"
            className="hover:text-[#b59766] transition-colors whitespace-nowrap py-3"
          >
            پروژه ها
          </a>
          <a
            href="#magazine-section"
            className="hover:text-[#b59766] transition-colors whitespace-nowrap py-3"
          >
            بلاگ
          </a>
          <a
            href="#footer-contact"
            className="hover:text-[#b59766] transition-colors whitespace-nowrap py-3"
          >
            تماس با ما
          </a>
          <a
            href="#about-services"
            className="hover:text-[#b59766] transition-colors whitespace-nowrap py-3"
          >
            درباره ما
          </a>

          {/* ۶. منوی موارد دیگر با همان طراحی زیرمنو */}
          <div
            className="relative py-3"
            onMouseEnter={() => handleMenuEnter('more')}
            onMouseLeave={handleMenuLeave}
          >
            <button
              type="button"
              onClick={() =>
                setOpenSubmenu((prev) => (prev === 'more' ? null : 'more'))
              }
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                openSubmenu === 'more'
                  ? 'text-[#141414]'
                  : 'hover:text-[#b59766]'
              }`}
            >
              <span>موارد دیگر</span>
              <ChevronDown
                className={`w-4 h-4 text-[#2b2b2b] stroke-[1.9] transition-transform duration-200 ${
                  openSubmenu === 'more' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubmenu === 'more' && (
              <div
                dir="rtl"
                className="absolute top-[calc(100%+2px)] right-0 w-[235px] bg-white rounded-[18px] shadow-[0_14px_44px_rgba(0,0,0,0.12)] border border-[#f1f1f1] overflow-hidden py-1 z-50"
              >
                {MORE_SUBMENU_ITEMS.map((item, idx) => {
                  const isLast = idx === MORE_SUBMENU_ITEMS.length - 1;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpenSubmenu(null)}
                      className="group/item block w-full px-5 text-right text-[14px] font-medium text-[#1e1e1e] hover:bg-[#f6f1e7] hover:text-[#b59766] transition-colors"
                    >
                      <span
                        className={`block py-3.5 ${
                          !isLast
                            ? 'border-b border-[#efefef] group-hover/item:border-transparent'
                            : ''
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* سمت چپ: انتخاب زبان (همراه با زیرمنوی EN / زبان فارسی)، سبد خرید و پروفایل با حالت هاور طلایی و آیکون سفید دقیقاً مطابق تصویر */}
        <div className="flex items-center gap-3 shrink-0">
          {/* دکمه و زیرمنوی تغییر زبان (فارسی / EN) */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('lang')}
            onMouseLeave={handleMenuLeave}
          >
            <button
              type="button"
              onClick={() =>
                setOpenSubmenu((prev) => (prev === 'lang' ? null : 'lang'))
              }
              title="تغییر زبان"
              className="h-12 px-4 rounded-[14px] bg-[#f4f4f4] hover:bg-[#ececec] flex items-center gap-2.5 text-[14px] font-bold text-[#292d32] transition-colors cursor-pointer whitespace-nowrap"
            >
              {selectedLang === 'fa' ? (
                <IranFlagIcon className="w-7 h-5" />
              ) : (
                <UkFlagIcon className="w-7 h-5" />
              )}
              <span>{selectedLang === 'fa' ? 'فارسی' : 'EN'}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#292d32] stroke-[2] transition-transform duration-200 ${
                  openSubmenu === 'lang' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubmenu === 'lang' && (
              <div
                dir="rtl"
                className="absolute top-[calc(100%+10px)] right-0 w-[195px] bg-white rounded-[18px] shadow-[0_14px_44px_rgba(0,0,0,0.12)] border border-[#f1f1f1] overflow-hidden z-50"
              >
                {/* گزینه اول: EN */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredLang('en')}
                  onClick={() => {
                    setSelectedLang('en');
                    setOpenSubmenu(null);
                  }}
                  className={`w-full px-5 text-right text-[15px] font-bold transition-colors cursor-pointer ${
                    activeHighlightedLang === 'en'
                      ? 'bg-[#f5f0e8] text-[#b59766]'
                      : 'bg-white text-[#2b2b2b]'
                  }`}
                >
                  <span
                    className={`block py-4 ${
                      activeHighlightedLang !== 'en' &&
                      activeHighlightedLang !== 'fa'
                        ? 'border-b border-[#efefef]'
                        : 'border-b border-[#efefef]/60'
                    }`}
                  >
                    EN
                  </span>
                </button>

                {/* گزینه دوم: زبان فارسی */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredLang('fa')}
                  onClick={() => {
                    setSelectedLang('fa');
                    setOpenSubmenu(null);
                  }}
                  className={`w-full px-5 py-4 text-right text-[15px] font-semibold transition-colors cursor-pointer ${
                    activeHighlightedLang === 'fa'
                      ? 'bg-[#f5f0e8] text-[#b59766]'
                      : 'bg-white text-[#2b2b2b]'
                  }`}
                >
                  زبان فارسی
                </button>
              </div>
            )}
          </div>

          {/* دکمه سبد خرید (در حالت عادی خاکستری با آیکون تیره، در حالت هاور طلایی #b59766 با آیکون سفید دقیقاً مطابق تصویر) */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="سبد خرید"
            dir="ltr"
            className={`group h-12 ${
              totalCartCount > 0 ? 'px-3 gap-2.5' : 'w-12'
            } rounded-[14px] bg-[#f4f4f4] hover:bg-[#b59766] text-[#292d32] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer`}
          >
            <HeaderBagIcon className="w-[22px] h-[22px] shrink-0 transition-colors" />
            {totalCartCount > 0 && (
              <span className="min-w-[22px] h-[26px] px-1.5 rounded-[7px] bg-[#2b2b2b] text-white text-[13px] font-bold flex items-center justify-center leading-none tabular-nums">
                {totalCartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </button>

          {/* دکمه کاربری / لاگین به همراه دراپ‌داون حساب کاربری پس از ورود (دقیقاً مطابق Profile Dropdown 01 و 02) */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (isLoggedIn) {
                onProfileMenuInteracted?.();
                handleMenuEnter('profile');
              }
            }}
            onMouseLeave={() => {
              if (isLoggedIn) {
                handleMenuLeave();
              }
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn) {
                  onProfileMenuInteracted?.();
                  setOpenSubmenu((prev) =>
                    prev === 'profile' ? null : 'profile'
                  );
                } else {
                  (onOpenLogin || onOpen3DStudio)();
                }
              }}
              aria-label="حساب کاربری"
              className="w-12 h-12 rounded-[14px] bg-[#f4f4f4] hover:bg-[#b59766] text-[#292d32] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
            >
              <HeaderUserIcon className="w-[22px] h-[22px] transition-colors" />
            </button>

            {isLoggedIn && openSubmenu === 'profile' && (
              <div
                dir="rtl"
                className="absolute top-[calc(100%+14px)] left-0 w-[265px] bg-white rounded-[18px] shadow-[0_14px_44px_rgba(0,0,0,0.12)] border border-[#efefef] z-50"
              >
                {/* مثلث اشاره‌گر بالای دراپ‌داون در زیر آیکون کاربری */}
                <span className="pointer-events-none absolute -top-[7px] left-[18px] w-3.5 h-3.5 bg-white rotate-45 border-l border-t border-[#efefef]" />

                <div className="relative z-10 rounded-[18px] overflow-hidden bg-white">
                  {/* هدر بالای دراپ‌داون: مشتری عزیز! / نام کاربر */}
                  <div
                    onClick={() => onToggleUserDisplayName?.()}
                    title="تغییر نمایش عنوان کاربر (مشتری عزیز! / علیرضا آذرخش)"
                    className="px-5 py-4 border-b border-[#efefef] text-right cursor-pointer select-none"
                  >
                    <span className="text-[15.5px] font-bold text-[#1e1e1e]">
                      {userDisplayName}
                    </span>
                  </div>

                  {/* ۱. پنل پیشخوان */}
                  <button
                    type="button"
                    onClick={() => setOpenSubmenu(null)}
                    className="group/row w-full px-4 text-right transition-colors hover:bg-[#f5f5f5] cursor-pointer"
                  >
                    <div className="py-3.5 px-1 flex items-center justify-start gap-2.5 border-b border-[#efefef] group-hover/row:border-transparent text-[#6c6c6c]">
                      <ProfileDashboardIcon className="w-[20px] h-[20px] shrink-0" />
                      <span className="text-[14px] font-medium">
                        پنل پیشخوان
                      </span>
                    </div>
                  </button>

                  {/* ۲. سفارش های من */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSubmenu(null);
                      onOpenCart();
                    }}
                    className="group/row w-full px-4 text-right transition-colors hover:bg-[#f5f5f5] cursor-pointer"
                  >
                    <div className="py-3.5 px-1 flex items-center justify-start gap-2.5 border-b border-[#efefef] group-hover/row:border-transparent text-[#6c6c6c]">
                      <ProfileOrdersBagIcon className="w-[20px] h-[20px] shrink-0" />
                      <span className="text-[14px] font-medium">
                        سفارش های من
                      </span>
                    </div>
                  </button>

                  {/* ۳. لیست علاقه مندی ها */}
                  <button
                    type="button"
                    onClick={() => setOpenSubmenu(null)}
                    className="group/row w-full px-4 text-right transition-colors hover:bg-[#f5f5f5] cursor-pointer"
                  >
                    <div className="py-3.5 px-1 flex items-center justify-start gap-2.5 border-b border-[#efefef] group-hover/row:border-transparent text-[#6c6c6c]">
                      <ProfileArchiveBookmarkIcon className="w-[20px] h-[20px] shrink-0" />
                      <span className="text-[14px] font-medium">
                        لیست علاقه مندی ها
                      </span>
                    </div>
                  </button>

                  {/* ۴. خروج از حساب کاربری (قرمز با هاور صورتی روشن مطابق تصویر اول) */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSubmenu(null);
                      onLogout?.();
                    }}
                    className="w-full px-5 py-4 flex items-center justify-start gap-2.5 text-right text-[#ff001f] hover:bg-[#fdecee] transition-colors cursor-pointer"
                  >
                    <ProfileLogoutIcon className="w-[20px] h-[20px] shrink-0" />
                    <span className="text-[14px] font-medium">
                      خروج از حساب کاربری
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
