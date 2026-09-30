import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Home, BookOpen, Phone, Info, FileText, Globe, MapPin } from 'lucide-react';
import { HeaderBrandLogo, ExactPalmetteVector } from '../Ornaments';

interface HeaderSectionProps {
  totalCartCount: number;
  onOpenCart: () => void;
  onOpenLogin?: () => void;
  onLoginSuccess?: () => void;
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
  onLoginSuccess,
  isLoggedIn = false,
  userDisplayName = 'مشتری عزیز!',
  onToggleUserDisplayName,
  onLogout,
  forceOpenProfileMenu = false,
  onProfileMenuInteracted,
  onOpen3DStudio,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [openSubmenu, setOpenSubmenu] = useState<
    'products' | 'more' | 'lang' | 'profile' | null
  >(null);
  const [selectedLang, setSelectedLang] = useState<'fa' | 'en'>('fa');
  const [hoveredLang, setHoveredLang] = useState<'fa' | 'en' | null>(null);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState<boolean>(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState<boolean>(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<string | null>('products');
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'categories' | 'cart' | 'profile'>('home');
  const closeTimeoutRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (forceOpenProfileMenu && isLoggedIn) {
      setOpenSubmenu('profile');
      setIsMobileProfileOpen(true);
      setActiveMobileTab('profile');
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
      {/* هدر مخصوص موبایل و تبلت (< lg) - دقیقاً مطابق تصویر Screenshot 2026-09-30 at 02.34.18.png */}
      <div className="lg:hidden w-full h-24 px-2 sm:px-4 flex items-center justify-between relative overflow-hidden bg-white">
        {/* پترن وکتور سمت راست: Vector2rtl.png پایه چسبیده به لبه راست و نوک به سمت مرکز */}
        <div className="shrink-0 flex items-center -mr-3 sm:-mr-1">
          <ExactPalmetteVector className="w-14 h-14 sm:w-16 sm:h-16 text-[#cbb592]" />
        </div>

        {/* لوگوی مرکزی متمرکز: Chandelier بالای AKBAR SALEHI */}
        <a
          href="#top"
          className="flex flex-col items-center justify-center text-center select-none focus:outline-none py-2"
          dir="ltr"
          aria-label="گالری لوستر اکبر صالحی"
        >
          <span
            className="text-[14px] sm:text-[15.5px] font-semibold tracking-[0.03em] text-[#b58d53] leading-none mb-1"
          >
            Chandelier
          </span>
          <span className="font-brand-serif text-[23px] sm:text-[29px] tracking-[0.05em] text-[#2b2b2b] font-normal uppercase leading-none">
            AKBAR SALEHI
          </span>
        </a>

        {/* پترن وکتور سمت چپ: Vector2ltr.png پایه چسبیده به لبه چپ و نوک به سمت مرکز */}
        <div className="shrink-0 flex items-center -ml-3 sm:-ml-1">
          <ExactPalmetteVector className="w-14 h-14 sm:w-16 sm:h-16 text-[#cbb592] -scale-x-100" />
        </div>
      </div>

      {/* هدر مخصوص دسکتاپ (lg) */}
      <div className="hidden lg:flex w-full max-w-[1800px] mx-auto pr-0 pl-4 sm:pl-8 lg:pl-14 xl:pl-20 h-22 items-center justify-between gap-4">
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

        {/* سمت چپ: انتخاب زبان، سبد خرید و حساب کاربری / پروفایل (ترتیب از راست به چپ در چیدمان RTL مطابق Screenshot 2026-09-30 at 03.19.25.png) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* ۱. دکمه و زیرمنوی تغییر زبان (فارسی / EN) - در سمت راست دکمه‌ها نزدیک لینک‌های منو */}
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
              dir="ltr"
              className="h-12 px-4 rounded-[14px] bg-[#f4f4f4] hover:bg-[#ececec] flex items-center gap-2.5 text-[14px] font-bold text-[#292d32] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ChevronDown
                className={`w-4 h-4 text-[#292d32] stroke-[2] transition-transform duration-200 ${
                  openSubmenu === 'lang' ? 'rotate-180' : ''
                }`}
              />
              <span>{selectedLang === 'fa' ? 'فارسی' : 'EN'}</span>
              {selectedLang === 'fa' ? (
                <IranFlagIcon className="w-7 h-5" />
              ) : (
                <UkFlagIcon className="w-7 h-5" />
              )}
            </button>

            {openSubmenu === 'lang' && (
              <div
                dir="rtl"
                className="absolute top-[calc(100%+10px)] left-0 w-[195px] bg-white rounded-[18px] shadow-[0_14px_44px_rgba(0,0,0,0.12)] border border-[#f1f1f1] overflow-hidden z-50"
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

          {/* ۲. دکمه سبد خرید - در وسط دکمه‌های سمت چپ */}
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

          {/* ۳. دکمه کاربری / لاگین به همراه دراپ‌داون حساب کاربری پس از ورود - در منتهی‌الیه سمت چپ هدر */}
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

                  {/* ۴. خروج از حساب کاربری (قرمز با هاور صورتی روشن) */}
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

      {/* ۱. نوار ثابت ناوبری پایین در حالت موبایل و تبلت (< lg) - مطابق طرح‌های فیگما Mobile Menu 01-04 */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#e5e5e5] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] h-[66px] px-2 flex items-center justify-around">
        {/* تب ۱: صفحه اصلی */}
        <button
          type="button"
          onClick={() => {
            setActiveMobileTab('home');
            setIsMobileCategoriesOpen(false);
            setIsMobileProfileOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
            activeMobileTab === 'home' && !isMobileCategoriesOpen && !isMobileProfileOpen
              ? 'text-[#2b2b2b] font-bold'
              : 'text-[#888888] font-medium'
          }`}
        >
          <Home className="w-[20px] h-[20px]" />
          <span className="text-[11px] leading-none">صفحه اصلی</span>
        </button>

        {/* تب ۲: دسته بندی ها */}
        <button
          type="button"
          onClick={() => {
            setActiveMobileTab('categories');
            setIsMobileCategoriesOpen(true);
            setIsMobileProfileOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
            isMobileCategoriesOpen || activeMobileTab === 'categories'
              ? 'text-[#2b2b2b] font-bold'
              : 'text-[#888888] font-medium'
          }`}
        >
          <ProfileDashboardIcon className="w-[20px] h-[20px]" />
          <span className="text-[11px] leading-none">دسته بندی ها</span>
        </button>

        {/* تب ۳: سبد خرید */}
        <button
          type="button"
          onClick={() => {
            setActiveMobileTab('cart');
            setIsMobileCategoriesOpen(false);
            setIsMobileProfileOpen(false);
            onOpenCart();
          }}
          className="relative flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer text-[#888888] hover:text-[#2b2b2b] font-medium transition-colors"
        >
          <div className="relative">
            <HeaderBagIcon className="w-[20px] h-[20px]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#b59766] text-white text-[10px] font-bold flex items-center justify-center leading-none tabular-nums">
                {totalCartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-none">سبد خرید</span>
        </button>

        {/* تب ۴: پروفایل کاربری */}
        <button
          type="button"
          onClick={() => {
            if (!isLoggedIn) {
              onOpenLogin();
            } else {
              setActiveMobileTab('profile');
              setIsMobileProfileOpen(true);
              setIsMobileCategoriesOpen(false);
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
            isMobileProfileOpen || activeMobileTab === 'profile'
              ? 'text-[#2b2b2b] font-bold'
              : 'text-[#888888] font-medium'
          }`}
        >
          <HeaderUserIcon className="w-[20px] h-[20px]" />
          <span className="text-[11px] leading-none">پروفایل کاربری</span>
        </button>
      </div>

      {/* ۲. کشوی به سمت بالا باز شونده دسته‌بندی‌های موبایل (دقیقاً مطابق عکس چهارم: Bottom Sheet با بک‌دراپ و آیکون درگ هلی) */}
      {isMobileCategoriesOpen && (
        <>
          {/* بک‌دراپ تیره پشت دراور برای بستن راحت تر */}
          <div
            onClick={() => {
              setIsMobileCategoriesOpen(false);
              setActiveMobileTab('home');
            }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* دراور کشویی به سمت بالا با زوایای گرد بالا */}
          <div
            dir="rtl"
            className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-[#fcfbf9] rounded-t-[28px] shadow-[0_-12px_45px_rgba(0,0,0,0.28)] flex flex-col max-h-[80vh] p-5 pb-10 animate-slide-up border-t border-[#e2ddd2]"
          >
            {/* دستگیره کوچک بالای دراور باتم‌شیت (Drag Handle) */}
            <div className="w-12 h-1.5 bg-[#eae5d9] rounded-full mx-auto mb-4 shrink-0" />

            {/* بخش اسکرول‌شونده داخلی */}
            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* هدر کشو: لوگوی لوستر اکبر صالحی کاملاً متمرکز در وسط */}
              <div className="flex flex-col items-center justify-center pb-4 mb-5 border-b border-[#ece7dc] w-full select-none" dir="ltr">
                <span className="text-[10px] font-bold tracking-widest text-[#b59766] uppercase">
                  Chandelier
                </span>
                <div className="flex items-center justify-center gap-3 mt-1 w-full">
                  <ExactPalmetteVector className="w-9 h-7 text-[#cbb592] shrink-0" />
                  <span className="font-brand-serif text-[20px] font-bold text-[#222222] tracking-wide">
                    AKBAR SALEHI
                  </span>
                  <ExactPalmetteVector className="w-9 h-7 text-[#cbb592] -scale-x-100 shrink-0" />
                </div>
              </div>

              {/* کارت‌های آکاردئونی ناوبری موبایل */}
              <div className="space-y-3">
                {/* ۱. محصولات (آکاردئون با ۸ زیرمجموعه) */}
                <div className="rounded-[20px] bg-white border border-[#eae6db] overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileAccordionOpen((prev) =>
                        prev === 'products' ? null : 'products'
                      )
                    }
                    className="w-full p-4 flex items-center justify-between cursor-pointer text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                        <ProfileDashboardIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1f1f1f]">
                          محصولات
                        </h4>
                        <p className="text-[12px] text-[#777777] mt-0.5">
                          خدمات لوستر، آباژور، آینه و کنسول و...
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#666666] transition-transform duration-200 ${
                        mobileAccordionOpen === 'products' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileAccordionOpen === 'products' && (
                    <div className="px-4 pb-4 pt-1 space-y-2 border-t border-[#f2eee5] bg-[#faf8f3]">
                      {PRODUCTS_SUBMENU_ITEMS.map((sub) => (
                        <a
                           key={sub.id}
                           href={sub.href}
                           onClick={() => setIsMobileCategoriesOpen(false)}
                           className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white text-[13.5px] font-medium text-[#333333] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#b59766]" />
                            <span>{sub.label}</span>
                          </span>
                          <span className="text-xs text-[#888888]">←</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* ۲. پروژه ها */}
                <a
                  href="#executed-projects"
                  onClick={() => setIsMobileCategoriesOpen(false)}
                  className="block rounded-[20px] bg-white border border-[#eae6db] p-4 shadow-2xs hover:border-[#b59766] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                        <ProfileOrdersBagIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1f1f1f]">
                          پروژه ها
                        </h4>
                        <p className="text-[12px] text-[#777777] mt-0.5">
                          نمونه کارهای انجام شده در سطح کل ایران!
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#888888]">←</span>
                  </div>
                </a>

                {/* ۳. بلاگ */}
                <a
                  href="#magazine-section"
                  onClick={() => setIsMobileCategoriesOpen(false)}
                  className="block rounded-[20px] bg-white border border-[#eae6db] p-4 shadow-2xs hover:border-[#b59766] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1f1f1f]">
                          بلاگ
                        </h4>
                        <p className="text-[12px] text-[#777777] mt-0.5">
                          مقاله های دانستنی و جذاب
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#888888]">←</span>
                  </div>
                </a>

                {/* ۴. تماس با ما */}
                <a
                  href="#footer-contact"
                  onClick={() => setIsMobileCategoriesOpen(false)}
                  className="block rounded-[20px] bg-white border border-[#eae6db] p-4 shadow-2xs hover:border-[#b59766] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1f1f1f]">
                          تماس با ما
                        </h4>
                        <p className="text-[12px] text-[#777777] mt-0.5">
                          راه ارتباطی با مجموعه لوستر صالحی
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#888888]">←</span>
                  </div>
                </a>

                {/* ۵. درباره ما */}
                <a
                  href="#about-services"
                  onClick={() => setIsMobileCategoriesOpen(false)}
                  className="block rounded-[20px] bg-white border border-[#eae6db] p-4 shadow-2xs hover:border-[#b59766] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1f1f1f]">
                          درباره ما
                        </h4>
                        <p className="text-[12px] text-[#777777] mt-0.5">
                          داستان پیشرفت رشدی بی انتهای ما در ایران!
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#888888]">←</span>
                  </div>
                </a>

                {/* ۶. موارد دیگر */}
                <div className="rounded-[20px] bg-white border border-[#eae6db] overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileAccordionOpen((prev) =>
                        prev === 'more' ? null : 'more'
                      )
                    }
                    className="w-full p-4 flex items-center justify-between cursor-pointer text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1f1f1f]">
                          موارد دیگر
                        </h4>
                        <p className="text-[12px] text-[#777777] mt-0.5">
                          مجوز و گواهی‌ها، قوانین و مقررات مجموعه
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#666666] transition-transform duration-200 ${
                        mobileAccordionOpen === 'more' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileAccordionOpen === 'more' && (
                    <div className="px-4 pb-4 pt-1 space-y-2 border-t border-[#f2eee5] bg-[#faf8f3]">
                      {MORE_SUBMENU_ITEMS.map((more) => (
                        <a
                          key={more.id}
                          href={more.href}
                          onClick={() => setIsMobileCategoriesOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white text-[13.5px] font-medium text-[#333333] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#b59766]" />
                            <span>{more.label}</span>
                          </span>
                          <span className="text-xs text-[#888888]">←</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ۳. کشوی تمام‌صفحه پروفایل کاربری موبایل (دقیقاً مطابق تصویر ۳ فیگما) */}
      {isMobileProfileOpen && (
        <div
          dir="rtl"
          className="lg:hidden fixed inset-0 top-0 bottom-[66px] z-30 bg-[#fcfbf9] overflow-y-auto p-5 select-none flex flex-col justify-start"
        >
          {isLoggedIn ? (
            /* هدر هنگامی که کاربر وارد شده است (تصویر ۳ فیگما) */
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#ece7dc] shrink-0">
              {/* سمت راست: مشتری عزیز! */}
              <div
                onClick={() => onToggleUserDisplayName?.()}
                title="تغییر نمایش عنوان کاربر"
                className="text-right cursor-pointer select-none"
              >
                <span className="text-[15.5px] sm:text-[17px] font-bold text-[#1f1f1f]">
                  {userDisplayName}
                </span>
              </div>

              {/* سمت چپ: دکمه‌های انتخاب زبان و بستن */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLang('en')}
                  className={`h-9 px-3 rounded-[8px] border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedLang === 'en'
                      ? 'bg-[#2d2d2d] border-[#2d2d2d] text-white shadow-xs'
                      : 'bg-white border-[#ece7dc] text-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-white hover:border-[#2d2d2d]'
                  }`}
                >
                  <UkFlagIcon className="w-5 h-3.5" />
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang('fa')}
                  className={`h-9 px-3 rounded-[8px] border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedLang === 'fa'
                      ? 'bg-[#2d2d2d] border-[#2d2d2d] text-white shadow-xs'
                      : 'bg-white border-[#ece7dc] text-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-white hover:border-[#2d2d2d]'
                  }`}
                >
                  <IranFlagIcon className="w-5 h-3.5" />
                  <span>فارسی</span>
                </button>
              </div>
            </div>
          ) : (
            /* هدر هنگامی که کاربر وارد نشده است - تصویر ۲ فیگما: فلش بازگشت چپ و لوگوی وسط */
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#ece7dc] w-full select-none relative shrink-0">
              {/* دکمه بازگشت در سمت چپ (مطابق تصویر) */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileProfileOpen(false);
                  setActiveMobileTab('home');
                }}
                className="w-9 h-9 rounded-full bg-[#f2efe6] hover:bg-[#2b2b2b] text-[#2b2b2b] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="بازگشت"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>

              {/* لوگوی متمرکز در وسط هدر */}
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center" dir="ltr">
                <span className="text-[10px] font-bold tracking-widest text-[#b59766] uppercase leading-none">
                  Chandelier
                </span>
                <span className="font-brand-serif text-[17px] font-bold text-[#222222] tracking-wide mt-1.5 leading-none">
                  AKBAR SALEHI
                </span>
              </div>

              {/* یک دیو خالی توازن‌بخش در سمت راست هدر */}
              <div className="w-9 h-9 opacity-0 shrink-0" />
            </div>
          )}

          {/* لیست اکشن‌های پروفایل موبایل */}
          {isLoggedIn ? (
            <div className="space-y-3 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* ۱. پنل پیشخوان */}
              <button
                type="button"
                onClick={() => setIsMobileProfileOpen(false)}
                className="w-full p-4 rounded-[20px] bg-white border border-[#eae6db] flex items-center justify-between text-right cursor-pointer hover:border-[#b59766] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                    <ProfileDashboardIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-[#1f1f1f]">
                      پنل پیشخوان
                    </h4>
                    <p className="text-[12px] text-[#777777] mt-0.5">
                      مشاهده و ویرایش اطلاعات شخصی
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#888888]">←</span>
              </button>

              {/* ۲. سفارش های من */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileProfileOpen(false);
                  onOpenCart();
                }}
                className="w-full p-4 rounded-[20px] bg-white border border-[#eae6db] flex items-center justify-between text-right cursor-pointer hover:border-[#b59766] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                    <ProfileOrdersBagIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-[#1f1f1f]">
                      سفارش های من
                    </h4>
                    <p className="text-[12px] text-[#777777] mt-0.5">
                      محصولات ثبت شده در انتظار پرداخت
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#888888]">←</span>
              </button>

              {/* ۳. لیست علاقه مندی ها */}
              <button
                type="button"
                onClick={() => setIsMobileProfileOpen(false)}
                className="w-full p-4 rounded-[20px] bg-white border border-[#eae6db] flex items-center justify-between text-right cursor-pointer hover:border-[#b59766] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                    <ProfileArchiveBookmarkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-[#1f1f1f]">
                      لیست علاقه مندی ها
                    </h4>
                    <p className="text-[12px] text-[#777777] mt-0.5">
                      محصولات و مقاله های جذاب ذخیره شده
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#888888]">←</span>
              </button>

              {/* ۴. آدرس مسکونی */}
              <button
                type="button"
                onClick={() => setIsMobileProfileOpen(false)}
                className="w-full p-4 rounded-[20px] bg-white border border-[#eae6db] flex items-center justify-between text-right cursor-pointer hover:border-[#b59766] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f6f3eb] text-[#b59766] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-[#1f1f1f]">
                      آدرس مسکونی
                    </h4>
                    <p className="text-[12px] text-[#777777] mt-0.5">
                      ارسال مرسوله به منزل مسکونی‌تان
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#888888]">←</span>
              </button>

              {/* ۵. خروج از حساب کاربری (دکمه قرمز/صورتی مطابق Mobile 14, 15) */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileProfileOpen(false);
                  onLogout?.();
                }}
                className="w-full p-4 rounded-[20px] bg-[#fdecee] border border-[#f8d4d7] text-[#e02b3a] flex items-center justify-center gap-2.5 font-bold text-[14px] cursor-pointer hover:bg-[#fbd2d6] transition-colors mt-4"
              >
                <ProfileLogoutIcon className="w-5 h-5 shrink-0" />
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between select-none py-2">
              {/* بخش فرم ورود شماره تماس */}
              <div className="flex-1 mt-2">
                <h4 className="text-[18px] font-bold text-[#1a1a1a] text-right">
                  ورود به حساب کاربری
                </h4>
                <p className="text-[13px] text-[#777777] mt-1.5 text-right">
                  برای ورود شماره همراه خود را وارد کنید.
                </p>

                {/* فیلد ورودی شماره همراه */}
                <div className="mt-8">
                  <div className="relative flex items-center border border-[#e4e2dc] bg-white rounded-[14px] h-[52px] px-4 w-full" dir="ltr">
                    <span className="text-[14px] font-bold text-[#222222] pr-3.5 border-r border-[#e4e2dc] shrink-0" dir="rtl">
                      +۹۸
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(val);
                      }}
                      placeholder="۹********* "
                      className="flex-1 bg-transparent text-left outline-none border-none text-[15.5px] font-bold tracking-widest text-[#222222] pl-3.5 placeholder-[#b5b3ad]"
                    />
                  </div>
                </div>

                {/* متن توافقنامه */}
                <p className="text-[11.5px] text-[#777777] mt-4 text-right">
                  ورود شما به منزله موافقت با{' '}
                  <span className="text-[#b59561] font-bold cursor-pointer hover:underline">قوانین و مقررات</span>{' '}
                  است.
                </p>
              </div>

              {/* دکمه پایین: تایید و دریافت کد */}
              <div className="mt-8 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (phoneNumber.length >= 10) {
                      onLoginSuccess?.();
                    }
                  }}
                  disabled={phoneNumber.length < 10}
                  className={`w-full h-[50px] rounded-[14px] font-bold text-[14px] shadow-sm transition-all flex items-center justify-center cursor-pointer ${
                    phoneNumber.length >= 10
                      ? 'bg-[#2d2d2d] hover:bg-black text-white'
                      : 'bg-[#f0ece3] text-[#b0aeaa] cursor-not-allowed'
                  }`}
                >
                  تایید و دریافت کد
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
