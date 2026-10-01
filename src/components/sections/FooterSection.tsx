import React, { useState } from 'react';
import { ArrowUp, Instagram, Linkedin, MessageCircle, ChevronDown } from 'lucide-react';
import { FooterBrandLogo, CalligraphyTrustBadge } from '../Ornaments';
import { SALEHI_PHONE_NUMBERS } from '../../data/chandelierData';
import {
  AppRoute,
  getCurrentRoute,
  navigateToRoute,
} from '../../utils/navigation';

interface FooterSectionProps {
  currentRoute?: AppRoute;
  onNavigateRoute?: (route: AppRoute, hashAnchor?: string) => void;
}

/**
 * بخش فوتر دو رنگ تمام‌عرض (دقیقاً مطابق نیمه پایینی عکس چهارم)
 */
export const FooterSection: React.FC<FooterSectionProps> = ({
  currentRoute,
  onNavigateRoute,
}) => {
  const activeRoute = currentRoute ?? getCurrentRoute();

  const triggerRouteNavigation = (route: AppRoute, hashAnchor?: string) => {
    if (onNavigateRoute) {
      onNavigateRoute(route, hashAnchor);
    } else {
      navigateToRoute(route, hashAnchor);
    }
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quickAccess: false,
    collection: false,
    phones: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPhone = (id: string, phone: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <footer id="footer-contact" className="w-full mt-12 bg-[#f7f6f2] pb-20 lg:pb-0">
      <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* باکس طلایی سمت راست (شعبه VIP لوستر اکبر صالحی) */}
        <div className="lg:col-span-5 bg-[#b39561] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          {/* طرح خطی گل و برگ در گوشه پایین-چپ باکس طلایی (مطابق عکس چهارم) */}
          <svg
            viewBox="0 0 220 220"
            fill="none"
            className="w-52 h-52 absolute -bottom-8 -left-6 text-[#6f5932] opacity-45 pointer-events-none select-none"
          >
            <g stroke="currentColor" strokeWidth="1.2">
              <path d="M20 200C30 140 70 90 130 65C105 115 75 160 20 200Z" />
              <path d="M20 200C65 155 125 130 185 135C135 175 80 195 20 200Z" />
              <path d="M20 200C15 145 25 85 60 40C65 95 50 150 20 200Z" />
              <path d="M55 165L95 110" />
              <path d="M75 175L135 150" />
            </g>
          </svg>

          <div className="relative z-10">
            {/* لوگوی فوتر با ۳ پروانه تیره در سمت راست */}
            <div className="flex justify-start mb-7">
              <FooterBrandLogo />
            </div>

            {/* متن شعبه VIP */}
            <p className="text-xs sm:text-[13.5px] leading-7 text-white/95 text-justify mb-6">
              شعبه VIP مجموعه لوستر صالحی یکی از بخش‌های منحصربه‌فرد این مجموعه است که با
              هدف ارائه تجربه‌ای ویژه برای شما عزیزان طراحی شده است. در این شعبه، امکان ثبت
              سفارش تمامی محصولات مجموعه مطابق با سلیقه و نیاز شخصی شما فراهم شده است.
            </p>

            {/* متن پشتیبانی ۲۴ ساعته تیره */}
            <p className="text-xs sm:text-[13px] font-bold text-[#231f1c]">
              پشتیبانی ۲۴ ساعته لوستر صالحی در کنار شما همیشه هستیم :)
            </p>
          </div>

          {/* دکمه برو به بالا در پایین سمت راست باکس طلایی */}
          <div className="relative z-10 pt-8 flex justify-start">
            <button
              type="button"
              onClick={scrollToTop}
              className="h-11 px-5 rounded-[8px] bg-[#272727] hover:bg-[#1a1a1a] text-white text-xs font-bold flex items-center gap-2.5 shadow-md transition-colors cursor-pointer"
            >
              <span>برو به بالا</span>
              <span className="w-5 h-5 rounded-full bg-white text-[#272727] flex items-center justify-center">
                <ArrowUp className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        {/* باکس کرم/خاکستری روشن سمت چپ (لینک‌ها، شماره‌ها و نشان‌ها) */}
        <div className="lg:col-span-7 bg-[#f7f6f2] p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* ستون ۱: دسترسی سریع تر */}
            <div className="flex flex-col bg-white md:bg-transparent p-5 md:p-0 rounded-[12px] shadow-xs md:shadow-none mb-4 md:mb-0 border-b border-transparent md:border-none">
              {/* هدر دسکتاپ */}
              <h4 className="hidden md:block text-[13.5px] font-bold text-[#222222] pb-3 mb-4 border-b border-[#e4e2dc]">
                دسترسی سریع تر
              </h4>
              {/* هدر موبایل */}
              <button
                type="button"
                onClick={() => toggleSection('quickAccess')}
                className="flex md:hidden items-center justify-between w-full text-right py-2 text-[14px] font-bold text-[#222222] focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full transition-all shrink-0 ${openSections.quickAccess ? 'bg-[#b39561]' : 'bg-[#d8d8d8]'}`} />
                  <span>دسترسی سریع تر</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#555555] transition-transform duration-200 ${
                    openSections.quickAccess ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* محتوای ستون (همیشه در دسکتاپ باز، در موبایل آکاردئونی) */}
              <div className={`${openSections.quickAccess ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
                <ul className="relative pr-6 md:pr-0 space-y-4 text-xs text-[#1c1917] before:absolute before:right-[3.5px] before:top-1 before:bottom-3 before:w-[1px] before:bg-[#b39561]/40 md:before:hidden">
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerRouteNavigation('home');
                      }}
                      className="hover:text-[#b39561] transition-colors cursor-pointer"
                    >
                      صفحه اصلی
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="/rule"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerRouteNavigation('rule');
                      }}
                      className={`transition-colors cursor-pointer ${
                        activeRoute === 'rule'
                          ? 'text-[#b39561]'
                          : 'hover:text-[#b39561]'
                      }`}
                    >
                      قوانین و مقررات
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="/about-us"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerRouteNavigation('about-us');
                      }}
                      className={`transition-colors cursor-pointer ${
                        activeRoute === 'about-us'
                          ? 'text-[#b39561]'
                          : 'hover:text-[#b39561]'
                      }`}
                    >
                      درباره ما
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="/contact-us"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerRouteNavigation('contact-us');
                      }}
                      className={`transition-colors cursor-pointer ${
                        activeRoute === 'contact-us'
                          ? 'text-[#b39561]'
                          : 'hover:text-[#b39561]'
                      }`}
                    >
                      تماس با ما
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#executed-projects"
                      onClick={(e) => {
                        if (activeRoute !== 'home') {
                          e.preventDefault();
                          triggerRouteNavigation('home', '#executed-projects');
                        }
                      }}
                      className="hover:text-[#b39561] transition-colors"
                    >
                      شعبه های مرکز
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#about-services"
                      onClick={(e) => {
                        if (activeRoute !== 'home') {
                          e.preventDefault();
                          triggerRouteNavigation('home', '#about-services');
                        }
                      }}
                      className="hover:text-[#b39561] transition-colors"
                    >
                      گواهی ها
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#executed-projects"
                      onClick={(e) => {
                        if (activeRoute !== 'home') {
                          e.preventDefault();
                          triggerRouteNavigation('home', '#executed-projects');
                        }
                      }}
                      className="hover:text-[#b39561] transition-colors"
                    >
                      نمونه کارهای صالحی
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* ستون ۲: کلکسیون صالحی */}
            <div className="flex flex-col bg-white md:bg-transparent p-5 md:p-0 rounded-[12px] shadow-xs md:shadow-none mb-4 md:mb-0 border-b border-transparent md:border-none">
              {/* هدر دسکتاپ */}
              <h4 className="hidden md:block text-[13.5px] font-bold text-[#222222] pb-3 mb-4 border-b border-[#e4e2dc]">
                کلکسیون صالحی
              </h4>
              {/* هدر موبایل */}
              <button
                type="button"
                onClick={() => toggleSection('collection')}
                className="flex md:hidden items-center justify-between w-full text-right py-2 text-[14px] font-bold text-[#222222] focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full transition-all shrink-0 ${openSections.collection ? 'bg-[#b39561]' : 'bg-[#d8d8d8]'}`} />
                  <span>کلکسیون صالحی</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#555555] transition-transform duration-200 ${
                    openSections.collection ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* محتوای ستون (همیشه در دسکتاپ باز، در موبایل آکاردئونی) */}
              <div className={`${openSections.collection ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
                <ul className="relative pr-6 md:pr-0 space-y-4 text-xs text-[#1c1917] before:absolute before:right-[3.5px] before:top-1 before:bottom-3 before:w-[1px] before:bg-[#b39561]/40 md:before:hidden">
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#collection-salehi"
                      className="hover:text-[#b39561] transition-colors"
                    >
                      لوستر های کلاسیک
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#best-sellers"
                      className="hover:text-[#b39561] transition-colors"
                    >
                      لوستر های مدرن
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#collection-salehi"
                      className="hover:text-[#b39561] transition-colors"
                    >
                      آباژور کلاسیک
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#collection-salehi"
                      className="hover:text-[#b39561] transition-colors"
                    >
                      آینه، کنسول
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#magazine-section"
                      className="hover:text-[#b39561] transition-colors"
                    >
                      مجله های لوستر
                    </a>
                  </li>
                  <li className="relative md:static">
                    <span className="absolute right-[-20.5px] top-1/2 -translate-y-1/2 w-[17px] h-[1px] bg-[#b39561]/40 md:hidden" />
                    <a
                      href="#magazine-section"
                      className="hover:text-[#b39561] transition-colors"
                    >
                      فرایند آبکاری
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* ستون ۳: شماره های مجموعه صالحی */}
            <div className="flex flex-col bg-white md:bg-transparent p-5 md:p-0 rounded-[12px] shadow-xs md:shadow-none mb-4 md:mb-0 border-b border-transparent md:border-none">
              {/* هدر دسکتاپ */}
              <h4 className="hidden md:block text-[13.5px] font-bold text-[#222222] pb-3 mb-4 border-b border-[#e4e2dc]">
                شماره های مجموعه صالحی
              </h4>
              {/* هدر موبایل */}
              <button
                type="button"
                onClick={() => toggleSection('phones')}
                className="flex md:hidden items-center justify-between w-full text-right py-2 text-[14px] font-bold text-[#222222] focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full transition-all shrink-0 ${openSections.phones ? 'bg-[#b39561]' : 'bg-[#d8d8d8]'}`} />
                  <span>شماره های مجموعه صالحی</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#555555] transition-transform duration-200 ${
                    openSections.phones ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* محتوای ستون (همیشه در دسکتاپ باز، در موبایل آکاردئونی) */}
              <div className={`${openSections.phones ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
                <div className="space-y-2.5">
                  {SALEHI_PHONE_NUMBERS.map((item) => {
                    // تفکیک نام شعبه و شماره تلفن جهت چیدمان فوق‌العاده شیک دوطرفه و جلوگیری از بیرون‌زدگی
                    const isMatch = item.label.match(/(.+)\s*\((.+)\)/);
                    const title = isMatch ? isMatch[1].replace('شماره تلفن', '').trim() : 'افسریه';
                    const phoneNumber = isMatch ? isMatch[2].trim() : '۰۹۹۱۲۳۴۸۹۷۵';

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleCopyPhone(item.id, item.phone)}
                        className="w-full py-2 px-3 rounded-[6px] text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between gap-1.5 tabular-nums bg-[#eae9e4] text-[#333333] hover:bg-[#b39561] hover:text-white hover:shadow-xs"
                      >
                        {copiedId === item.id ? (
                          <span className="w-full text-center text-[10.5px]">شماره کپی شد ✓</span>
                        ) : (
                          <>
                            <span className="text-[10px] opacity-80 shrink-0">{title}</span>
                            <span className="tracking-wide">{phoneNumber}</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ستون ۴: شبکه‌های اجتماعی و ۴ نشان لوستر صالحی */}
            <div className="flex flex-col items-center md:items-end justify-start bg-transparent p-0 mb-4 md:mb-0 w-full max-w-sm">
              {/* شبکه نشان‌های خوشنویسی (۴ نشان در یک ردیف در موبایل و ۲×۲ در دسکتاپ) */}
              <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-3 w-full max-w-sm md:max-w-[172px] mb-4 md:mb-0 order-1 md:order-2 md:mt-6">
                {[0, 1, 2, 3].map((idx) => (
                  <CalligraphyTrustBadge key={idx} index={idx} />
                ))}
              </div>

              {/* بخش شبکه‌های اجتماعی: ردیف دوطرفه در موبایل و ساده در دسکتاپ */}
              <div className="w-full max-w-sm flex flex-row items-center justify-between md:justify-end gap-3 mt-2 md:mt-0 md:border-none md:pt-0 order-2 md:order-1">
                <span className="text-xs font-bold text-[#222222] md:hidden">
                  شبکه های اجتماعی :
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="#footer-contact"
                    aria-label="LinkedIn"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-[8px] bg-[#eae9e4] hover:bg-[#222222] text-[#222222] hover:text-white flex items-center justify-center transition-all cursor-pointer group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 md:w-5 md:h-5 fill-current"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="#footer-contact"
                    aria-label="WhatsApp"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-[8px] bg-[#eae9e4] hover:bg-[#222222] text-[#222222] hover:text-white flex items-center justify-center transition-all cursor-pointer group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 md:w-5 md:h-5 fill-current"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                  <a
                    href="#footer-contact"
                    aria-label="Instagram"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-[8px] bg-[#eae9e4] hover:bg-[#222222] text-[#222222] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* نوار کپی‌رایت پایین فوتر */}
          <div className="mt-10 pt-6 border-t-2 border-[#e4e2dc] flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-[#222222] w-full font-bold">
            <p className="text-center md:text-right whitespace-nowrap text-[10px] xs:text-[11.5px] md:text-[12px] lg:text-[13.5px]">
              کلیه حقوق این سایت محفوظ و متعلق به لوستر اکبر صالحی است.
            </p>
            <p className="text-center md:text-left text-[10px] xs:text-[11.5px] md:text-[12px] lg:text-[13.5px]" dir="ltr">
              Design &amp; Develope By{' '}
              <span className="text-[#b39561] font-bold">Sevin Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
