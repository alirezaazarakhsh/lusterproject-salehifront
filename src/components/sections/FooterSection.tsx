import React, { useState } from 'react';
import { ArrowUp, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { FooterBrandLogo, CalligraphyTrustBadge } from '../Ornaments';
import { SALEHI_PHONE_NUMBERS } from '../../data/chandelierData';

/**
 * بخش فوتر دو رنگ تمام‌عرض (دقیقاً مطابق نیمه پایینی عکس چهارم)
 */
export const FooterSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    <footer id="footer-contact" className="w-full mt-12 bg-[#f7f6f2]">
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
              className="h-11 px-5 rounded-xl bg-[#272727] hover:bg-[#1a1a1a] text-white text-xs font-bold flex items-center gap-2.5 shadow-md transition-colors cursor-pointer"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-8">
            {/* ستون ۱: دسترسی سریع تر */}
            <div className="xl:col-span-3">
              <h4 className="text-[13.5px] font-bold text-[#222222] pb-3 mb-4 border-b border-[#e4e2dc]">
                دسترسی سریع تر
              </h4>
              <ul className="space-y-3 text-xs text-[#444444]">
                <li>
                  <a href="#top" className="hover:text-[#b39561] transition-colors">
                    صفحه اصلی
                  </a>
                </li>
                <li>
                  <a
                    href="#about-services"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    درباره ما
                  </a>
                </li>
                <li>
                  <a
                    href="#footer-contact"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    تماس با ما
                  </a>
                </li>
                <li>
                  <a
                    href="#executed-projects"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    شعبه های مرکز
                  </a>
                </li>
                <li>
                  <a
                    href="#about-services"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    گواهی ها
                  </a>
                </li>
                <li>
                  <a
                    href="#executed-projects"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    نمونه کارهای صالحی
                  </a>
                </li>
              </ul>
            </div>

            {/* ستون ۲: کلکسیون صالحی */}
            <div className="xl:col-span-3">
              <h4 className="text-[13.5px] font-bold text-[#222222] pb-3 mb-4 border-b border-[#e4e2dc]">
                کلکسیون صالحی
              </h4>
              <ul className="space-y-3 text-xs text-[#444444]">
                <li>
                  <a
                    href="#collection-salehi"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    لوستر های کلاسیک
                  </a>
                </li>
                <li>
                  <a
                    href="#best-sellers"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    لوستر های مدرن
                  </a>
                </li>
                <li>
                  <a
                    href="#collection-salehi"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    آباژور کلاسیک
                  </a>
                </li>
                <li>
                  <a
                    href="#collection-salehi"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    آینه، کنسول
                  </a>
                </li>
                <li>
                  <a
                    href="#magazine-section"
                    className="text-[#b39561] font-bold hover:underline"
                  >
                    مجله های لوستر
                  </a>
                </li>
                <li>
                  <a
                    href="#magazine-section"
                    className="hover:text-[#b39561] transition-colors"
                  >
                    فرایند آبکاری
                  </a>
                </li>
              </ul>
            </div>

            {/* ستون ۳: شماره های مجموعه صالحی */}
            <div className="xl:col-span-3">
              <h4 className="text-[13.5px] font-bold text-[#222222] pb-3 mb-4 border-b border-[#e4e2dc]">
                شماره های مجموعه صالحی
              </h4>
              <div className="space-y-2.5">
                {SALEHI_PHONE_NUMBERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCopyPhone(item.id, item.phone)}
                    className={`w-full py-2 px-2.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap text-center tabular-nums ${
                      item.highlighted
                        ? 'bg-[#b39561] text-white shadow-xs'
                        : 'bg-[#eae9e4] text-[#333333] hover:bg-[#dfddd6]'
                    }`}
                  >
                    {copiedId === item.id ? 'شماره کپی شد ✓' : item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ستون ۴: شبکه‌های اجتماعی و ۴ نشان لوستر صالحی */}
            <div className="xl:col-span-3 flex flex-col items-center sm:items-end justify-start">
              {/* ۳ دکمه شبکه‌های اجتماعی (لینکدین، واتساپ طلایی، اینستاگرام) */}
              <div className="flex items-center gap-2.5 mb-4">
                <a
                  href="#footer-contact"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-xl bg-[#eae9e4] hover:bg-[#222222] text-[#222222] hover:text-white flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#footer-contact"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-xl bg-[#b39561] hover:bg-[#9c8050] text-white flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="#footer-contact"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-[#eae9e4] hover:bg-[#222222] text-[#222222] hover:text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>

              {/* شبکه ۲×۲ از نشان‌های خوشنویسی لوستر صالحی */}
              <div className="grid grid-cols-2 gap-2.5">
                {[0, 1, 2, 3].map((idx) => (
                  <CalligraphyTrustBadge key={idx} index={idx} />
                ))}
              </div>
            </div>
          </div>

          {/* نوار کپی‌رایت پایین فوتر */}
          <div className="mt-10 pt-5 border-t border-[#e4e2dc] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#222222]">
            <p className="font-semibold">
              کلیه حقوق این سایت محفوظ و متعلق به لوستر اکبر صالحی است.
            </p>
            <p className="font-medium" dir="ltr">
              Design &amp; Develope By{' '}
              <span className="text-[#b39561] font-semibold">Sevin Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
