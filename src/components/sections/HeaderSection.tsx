import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Home, BookOpen, Phone, Info, FileText, Globe, MapPin } from 'lucide-react';
import { HeaderBrandLogo, ExactPalmetteVector } from '../Ornaments';
import { AppRoute, getCurrentRoute, navigateToRoute } from '../../utils/navigation';

interface HeaderSectionProps {
  totalCartCount: number;
  isCartOpen?: boolean;
  onOpenCart: () => void;
  onCloseCart?: () => void;
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
  { id: 'more-rules', label: 'قوانین و مقررات', href: '/rule' },
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
  isCartOpen = false,
  onOpenCart,
  onCloseCart,
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
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'categories' | 'cart' | 'profile'>('home');
  const [activeRoute, setActiveRoute] = useState<AppRoute>(() => getCurrentRoute());
  const closeTimeoutRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const syncHeaderRoute = () => {
      setActiveRoute(getCurrentRoute());
    };
    window.addEventListener('popstate', syncHeaderRoute);
    window.addEventListener('hashchange', syncHeaderRoute);
    window.addEventListener('app-route-change', syncHeaderRoute);
    return () => {
      window.removeEventListener('popstate', syncHeaderRoute);
      window.removeEventListener('hashchange', syncHeaderRoute);
      window.removeEventListener('app-route-change', syncHeaderRoute);
    };
  }, []);

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
          href="/"
          onClick={(e) => {
            if (getCurrentRoute() !== 'home') {
              e.preventDefault();
              navigateToRoute('home');
            }
          }}
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
          href="/"
          onClick={(e) => {
            if (getCurrentRoute() !== 'home') {
              e.preventDefault();
              navigateToRoute('home');
            }
          }}
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
            onClick={(e) => {
              if (getCurrentRoute() !== 'home') {
                e.preventDefault();
                navigateToRoute('home', '#executed-projects');
              }
            }}
            className="hover:text-[#b59766] transition-colors whitespace-nowrap py-3"
          >
            پروژه ها
          </a>
          <a
            href="#magazine-section"
            onClick={(e) => {
              if (getCurrentRoute() !== 'home') {
                e.preventDefault();
                navigateToRoute('home', '#magazine-section');
              }
            }}
            className="hover:text-[#b59766] transition-colors whitespace-nowrap py-3"
          >
            بلاگ
          </a>
          <a
            href="/contact-us"
            onClick={(e) => {
              e.preventDefault();
              setActiveRoute('contact-us');
              navigateToRoute('contact-us');
            }}
            className={`transition-colors whitespace-nowrap py-3 ${
              activeRoute === 'contact-us'
                ? 'text-[#b59766]'
                : 'hover:text-[#b59766]'
            }`}
          >
            تماس با ما
          </a>
          <a
            href="#about-services"
            onClick={(e) => {
              if (getCurrentRoute() !== 'home') {
                e.preventDefault();
                navigateToRoute('home', '#about-services');
              }
            }}
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
                      onClick={(e) => {
                        setOpenSubmenu(null);
                        if (item.href === '/rule') {
                          e.preventDefault();
                          navigateToRoute('rule');
                        } else if (getCurrentRoute() !== 'home') {
                          e.preventDefault();
                          navigateToRoute('home', item.href);
                        }
                      }}
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
            onCloseCart?.();
            if (getCurrentRoute() !== 'home') {
              navigateToRoute('home');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
            activeMobileTab === 'home' &&
            !isMobileCategoriesOpen &&
            !isMobileProfileOpen &&
            !isCartOpen
              ? 'text-[#1e1e1e] font-bold'
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
            onCloseCart?.();
            setMobileAccordionOpen(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
            (isMobileCategoriesOpen || activeMobileTab === 'categories') &&
            !isCartOpen
              ? 'text-[#1e1e1e] font-bold'
              : 'text-[#888888] font-medium'
          }`}
        >
          {(isMobileCategoriesOpen || activeMobileTab === 'categories') &&
          !isCartOpen ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
              <rect x="3" y="3" width="8" height="8" rx="2.2" />
              <rect x="13" y="3" width="8" height="8" rx="2.2" />
              <rect x="3" y="13" width="8" height="8" rx="2.2" />
              <rect x="13" y="13" width="8" height="8" rx="2.2" />
            </svg>
          ) : (
            <ProfileDashboardIcon className="w-[20px] h-[20px]" />
          )}
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
          className={`relative flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
            isCartOpen
              ? 'text-[#1e1e1e] font-bold'
              : 'text-[#888888] hover:text-[#2b2b2b] font-medium'
          }`}
        >
          <div className="relative">
            {isCartOpen ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
                <path
                  d="M16.41 6.76C16.11 3.79 14.68 2 12 2C9.32 2 7.89 3.79 7.59 6.76H16.41Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                />
                <path d="M15.75 7H8.25C4.65 7 3.85 8.65 4.1 11.1L4.75 18.2C5.02 20.65 5.8 22 9.25 22H14.75C18.2 22 18.98 20.65 19.25 18.2L19.9 11.1C20.15 8.65 19.35 7 15.75 7ZM12 13.75C10.07 13.75 8.5 12.18 8.5 10.25C8.5 9.84 8.84 9.5 9.25 9.5C9.66 9.5 10 9.84 10 10.25C10 11.35 10.9 12.25 12 12.25C13.1 12.25 14 11.35 14 10.25C14 9.84 14.34 9.5 14.75 9.5C15.16 9.5 15.5 9.84 15.5 10.25C15.5 12.18 13.93 13.75 12 13.75Z" />
              </svg>
            ) : (
              <>
                <HeaderBagIcon className="w-[20px] h-[20px]" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#b59766] text-white text-[10px] font-bold flex items-center justify-center leading-none tabular-nums">
                    {totalCartCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </>
            )}
          </div>
          <span className="text-[11px] leading-none">سبد خرید</span>
        </button>

        {/* تب ۴: پروفایل کاربری */}
        <button
          type="button"
          onClick={() => {
            onCloseCart?.();
            if (!isLoggedIn) {
              onOpenLogin?.();
            } else {
              setActiveMobileTab('profile');
              setIsMobileProfileOpen(true);
              setIsMobileCategoriesOpen(false);
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
            (isMobileProfileOpen || activeMobileTab === 'profile') &&
            !isCartOpen
              ? 'text-[#1e1e1e] font-bold'
              : 'text-[#888888] font-medium'
          }`}
        >
          <HeaderUserIcon className="w-[20px] h-[20px]" />
          <span className="text-[11px] leading-none">پروفایل کاربری</span>
        </button>
      </div>

      {/* ۲. صفحه دسته‌بندی‌های موبایل تمام‌صفحه بالای نوار پایین (دقیقاً مطابق عکس دوم فیگما) */}
      {isMobileCategoriesOpen && (
        <div
          dir="rtl"
          className="lg:hidden fixed inset-0 top-0 bottom-[66px] z-30 bg-white overflow-y-auto flex flex-col justify-start select-none [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* هدر بالای صفحه دسته‌بندی‌ها با پترن‌های طلایی چسبیده به دو لبه و لوگوی مرکزی */}
          <div className="w-full h-24 px-2 sm:px-4 flex items-center justify-between relative overflow-hidden bg-white border-b border-[#efefef] shrink-0">
            <div className="shrink-0 flex items-center -mr-3 sm:-mr-1">
              <ExactPalmetteVector className="w-14 h-14 sm:w-16 sm:h-16 text-[#cbb592]" />
            </div>

            <div
              className="flex flex-col items-center justify-center text-center select-none py-2"
              dir="ltr"
            >
              <span className="text-[14px] sm:text-[15.5px] font-semibold tracking-[0.03em] text-[#b58d53] leading-none mb-1">
                Chandelier
              </span>
              <span className="font-brand-serif text-[23px] sm:text-[29px] tracking-[0.05em] text-[#2b2b2b] font-normal uppercase leading-none">
                AKBAR SALEHI
              </span>
            </div>

            <div className="shrink-0 flex items-center -ml-3 sm:-ml-1">
              <ExactPalmetteVector className="w-14 h-14 sm:w-16 sm:h-16 text-[#cbb592] -scale-x-100" />
            </div>
          </div>

          {/* لیست کارت‌های دسته‌بندی موبایل دقیقاً مطابق عکس دوم */}
          <div className="px-5 py-5 space-y-3.5 flex-1">
            {/* ۱. محصولات (آکاردئون با زیرمجموعه‌ها) */}
            <div className="rounded-[18px] bg-white border border-[#e9e9e9] overflow-hidden transition-colors">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordionOpen((prev) =>
                    prev === 'products' ? null : 'products'
                  )
                }
                className={`group w-full px-4 py-4 flex items-center justify-between cursor-pointer text-right transition-colors ${
                  mobileAccordionOpen === 'products'
                    ? 'bg-[#f5f5f5]'
                    : 'bg-white hover:bg-[#f5f5f5] active:bg-[#f5f5f5]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
                      mobileAccordionOpen === 'products'
                        ? 'bg-[#b59766] text-white'
                        : 'bg-[#f5f5f5] text-[#292d32] group-hover:bg-[#b59766] group-hover:text-white group-active:bg-[#b59766] group-active:text-white'
                    }`}
                  >
                    {/* آیکون سند با گوشه تاخورده مطابق عکس دوم */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                      <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" />
                      <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2" />
                      <path d="M8 13h4" />
                      <path d="M8 17h8" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1e1e1e]">
                      محصولات
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-1">
                      خدمات لوستر، آباژور، آینه و کنسول و...
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#292d32] stroke-[1.8] transition-transform duration-200 shrink-0 ${
                    mobileAccordionOpen === 'products' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileAccordionOpen === 'products' && (
                <div className="bg-white border-t border-[#efefef]">
                  {PRODUCTS_SUBMENU_ITEMS.map((sub, idx) => {
                    const isLast = idx === PRODUCTS_SUBMENU_ITEMS.length - 1;
                    return (
                      <a
                        key={sub.id}
                        href={sub.href}
                        onClick={() => {
                          setIsMobileCategoriesOpen(false);
                          setActiveMobileTab('home');
                        }}
                        className="group/item block w-full px-4 text-right text-[14px] font-medium text-[#1e1e1e] hover:bg-[#f6f1e7] hover:text-[#b59766] active:bg-[#f6f1e7] active:text-[#b59766] transition-colors"
                      >
                        <span
                          className={`block py-4 ${
                            !isLast
                              ? 'border-b border-[#efefef] group-hover/item:border-transparent'
                              : ''
                          }`}
                        >
                          {sub.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ۲. پروژه ها */}
            <a
              href="#executed-projects"
              onClick={() => {
                setIsMobileCategoriesOpen(false);
                setActiveMobileTab('home');
              }}
              className="group block rounded-[18px] bg-white hover:bg-[#f5f5f5] active:bg-[#f5f5f5] border border-[#e9e9e9] px-4 py-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] bg-[#f5f5f5] text-[#292d32] group-hover:bg-[#b59766] group-hover:text-white group-active:bg-[#b59766] group-active:text-white flex items-center justify-center shrink-0 transition-colors">
                    {/* آیکون پوشه مطابق عکس دوم */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                      <path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1e1e1e]">
                      پروژه ها
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-1">
                      نمونه کار های انجام شده در سطح کل ایران!
                    </p>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#292d32] shrink-0">
                  <path d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67" />
                </svg>
              </div>
            </a>

            {/* ۳. بلاگ */}
            <a
              href="#magazine-section"
              onClick={() => {
                setIsMobileCategoriesOpen(false);
                setActiveMobileTab('home');
              }}
              className="group block rounded-[18px] bg-white hover:bg-[#f5f5f5] active:bg-[#f5f5f5] border border-[#e9e9e9] px-4 py-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] bg-[#f5f5f5] text-[#292d32] group-hover:bg-[#b59766] group-hover:text-white group-active:bg-[#b59766] group-active:text-white flex items-center justify-center shrink-0 transition-colors">
                    {/* آیکون کتاب باز مطابق عکس دوم */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                      <path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98Z" />
                      <path d="M12 5.49v15" />
                      <path d="M7.75 8.49H5.5" />
                      <path d="M8.5 11.49h-3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1e1e1e]">
                      بلاگ
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-1">
                      مقاله های دانستنی و جذاب
                    </p>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#292d32] shrink-0">
                  <path d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67" />
                </svg>
              </div>
            </a>

            {/* ۴. تماس با ما */}
            <a
              href="/contact-us"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileCategoriesOpen(false);
                setActiveMobileTab('home');
                navigateToRoute('contact-us');
              }}
              className="group block rounded-[18px] bg-white hover:bg-[#f5f5f5] active:bg-[#f5f5f5] border border-[#e9e9e9] px-4 py-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] bg-[#f5f5f5] text-[#292d32] group-hover:bg-[#b59766] group-hover:text-white group-active:bg-[#b59766] group-active:text-white flex items-center justify-center shrink-0 transition-colors">
                    {/* آیکون تلفن در حال تماس مطابق عکس دوم */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                      <path d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98a28.75 28.75 0 0 1-3.28-2.8 28.414 28.414 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41-.48-1.13-.72-2.21-.72-3.24 0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67.64-.63 1.34-.94 2.08-.94.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z" />
                      <path d="M18.5 9c0-.6-.47-1.52-1.17-2.23-.64-.65-1.49-1.27-2.33-1.27" />
                      <path d="M22 9c0-3.87-3.13-7-7-7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1e1e1e]">
                      تماس با ما
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-1">
                      راه ارتباطی با مجموعه لوستر صالحی
                    </p>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#292d32] shrink-0">
                  <path d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67" />
                </svg>
              </div>
            </a>

            {/* ۵. درباره ما */}
            <a
              href="#about-services"
              onClick={() => {
                setIsMobileCategoriesOpen(false);
                setActiveMobileTab('home');
              }}
              className="group block rounded-[18px] bg-white hover:bg-[#f5f5f5] active:bg-[#f5f5f5] border border-[#e9e9e9] px-4 py-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] bg-[#f5f5f5] text-[#292d32] group-hover:bg-[#b59766] group-hover:text-white group-active:bg-[#b59766] group-active:text-white flex items-center justify-center shrink-0 transition-colors">
                    {/* آیکون سکوی افتخار و ستاره مطابق عکس دوم */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                      <path d="M8.67 14H4c-1.1 0-2 .9-2 2v6h6.67v-8Z" />
                      <path d="M13.33 10h-2.66c-1.1 0-2 .9-2 2v10h6.66V12c0-1.1-.9-2-2-2Z" />
                      <path d="M20 17h-4.67v5H22v-3c0-1.1-.9-2-2-2Z" />
                      <path d="M12.52 2.07l.53 1.06c.07.15.25.28.41.31l.96.16c.61.1.75.54.31.98l-.75.75c-.13.13-.2.37-.16.55l.21.92c.17.73-.22 1.02-.86.64l-.9-.53c-.16-.1-.43-.1-.59 0l-.9.53c-.64.38-1.03.09-.86-.64l.21-.92c.04-.18-.03-.42-.16-.55l-.75-.75c-.44-.44-.3-.88.31-.98l.96-.16c.16-.03.34-.16.41-.31l.53-1.06c.29-.58.76-.58 1.05 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1e1e1e]">
                      درباره ما
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-1">
                      داستان پیشرفت رشدی بی انتهای ما در ایران!
                    </p>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#292d32] shrink-0">
                  <path d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67" />
                </svg>
              </div>
            </a>

            {/* ۶. موارد دیگر */}
            <div className="rounded-[18px] bg-white border border-[#e9e9e9] overflow-hidden transition-colors">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordionOpen((prev) =>
                    prev === 'more' ? null : 'more'
                  )
                }
                className={`group w-full px-4 py-4 flex items-center justify-between cursor-pointer text-right transition-colors ${
                  mobileAccordionOpen === 'more'
                    ? 'bg-[#f5f5f5]'
                    : 'bg-white hover:bg-[#f5f5f5] active:bg-[#f5f5f5]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
                      mobileAccordionOpen === 'more'
                        ? 'bg-[#b59766] text-white'
                        : 'bg-[#f5f5f5] text-[#292d32] group-hover:bg-[#b59766] group-hover:text-white group-active:bg-[#b59766] group-active:text-white'
                    }`}
                  >
                    {/* آیکون سند با خطوط داخلی مطابق عکس دوم */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                      <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" />
                      <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2" />
                      <path d="M8 13h4" />
                      <path d="M8 17h8" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1e1e1e]">
                      موارد دیگر
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-1">
                      مجوز و گواهی ها، قوانین و مقررات مجموعه
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#292d32] stroke-[1.8] transition-transform duration-200 shrink-0 ${
                    mobileAccordionOpen === 'more' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileAccordionOpen === 'more' && (
                <div className="bg-white border-t border-[#efefef]">
                  {MORE_SUBMENU_ITEMS.map((more, idx) => {
                    const isLast = idx === MORE_SUBMENU_ITEMS.length - 1;
                    return (
                      <a
                        key={more.id}
                        href={more.href}
                        onClick={(e) => {
                          setIsMobileCategoriesOpen(false);
                          setActiveMobileTab('home');
                          if (more.href === '/rule') {
                            e.preventDefault();
                            navigateToRoute('rule');
                          } else if (getCurrentRoute() !== 'home') {
                            e.preventDefault();
                            navigateToRoute('home', more.href);
                          }
                        }}
                        className="group/item block w-full px-4 text-right text-[14px] font-medium text-[#1e1e1e] hover:bg-[#f6f1e7] hover:text-[#b59766] active:bg-[#f6f1e7] active:text-[#b59766] transition-colors"
                      >
                        <span
                          className={`block py-4 ${
                            !isLast
                              ? 'border-b border-[#efefef] group-hover/item:border-transparent'
                              : ''
                          }`}
                        >
                          {more.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
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
                  <span
                    onClick={() => {
                      setIsMobileProfileOpen(false);
                      navigateToRoute('rule');
                    }}
                    className="text-[#b59561] font-bold cursor-pointer hover:underline"
                  >
                    قوانین و مقررات
                  </span>{' '}
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
