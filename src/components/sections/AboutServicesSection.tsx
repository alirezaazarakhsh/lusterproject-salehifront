import React from 'react';
import { SectionHeading, ExactPalmetteVector } from '../Ornaments';
import { GENERATED_IMAGES, ChandelierProduct } from '../../data/chandelierData';
import { TransparentProductImage } from '../TransparentProductImage';

interface AboutServicesSectionProps {
  featuredProduct?: ChandelierProduct;
  onOpenProductModal?: (product: ChandelierProduct) => void;
  mainSettings?: any;
}

/**
 * بخش «درباره خدمات لوستر»
 * - در موبایل: ابتدا قاب قوسی به همراه وکتورهای پترن برگ Vector2rtl.png و Vector2ltr.png در دو طرف نمایش داده می‌شود، و سپس متون عملکرد پیاده‌سازی زیر آن قرار می‌گیرند (دقیقاً مطابق Screenshot 2026-09-30 at 03.25.25.png)
 * - در دسکتاپ: چیدمان دو ستونه لوکس
 */
export const AboutServicesSection: React.FC<AboutServicesSectionProps> = ({
  mainSettings,
}) => {
  return (
    <section
      id="about-services"
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-12 overflow-hidden"
    >
      {/* تیتر اصلی بخش */}
      <SectionHeading
        title={mainSettings?.servicesTitle || 'درباره خدمات لوستر'}
        mobileTitle={mainSettings?.servicesSubtitle || 'درباره خدمات'}
        className="mb-6 sm:mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ۱. قاب قوسی لوستر طبقاتی با پترن‌های Vector2rtl.png در راست و Vector2ltr.png در چپ (در موبایل اول می‌آید order-1) */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex items-center justify-center my-2 sm:my-0">
          <div className="relative flex items-center justify-center">
            {/* وکتور اسلیمی سمت راست قاب (Vector2rtl.png: برگ ۷پر طلایی) */}
            <ExactPalmetteVector
              strokeColor="#cbb592"
              className="-scale-x-100 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 absolute -right-8 xs:-right-11 sm:-right-14 top-1/2 -translate-y-1/2 -z-10 pointer-events-none"
            />

            {/* قاب قوسی سفید با تصویر لوستر و امضای Akbar Salehi Collection */}
            <div className="relative z-10 w-[270px] xs:w-[300px] sm:w-[340px] bg-white rounded-t-[140px] xs:rounded-t-[160px] sm:rounded-t-[175px] rounded-b-[24px] sm:rounded-b-[26px] border border-[#e6e2d8] shadow-[0_12px_36px_rgba(0,0,0,0.04)] pt-3 pb-6 px-4 sm:px-5 flex flex-col items-center">
              {/* تصویر لوستر متمایز و تمام‌پر */}
              <div className="w-full h-[250px] xs:h-[280px] sm:h-[290px] flex items-start justify-center overflow-hidden rounded-t-[125px] xs:rounded-t-[145px] sm:rounded-t-[155px] rounded-b-xl">
                <TransparentProductImage
                  src={
                    mainSettings?.servicesMainImage ||
                    GENERATED_IMAGES.shahMalakeh
                  }
                  alt="Akbar Salehi Collection"
                  className="max-h-[240px] xs:max-h-[270px] sm:max-h-[280px] w-auto object-contain"
                />
              </div>

              {/* برند و لوگوتایپ Akbar Salehi Collection همراه با ستاره طلایی */}
              <div className="mt-3 text-center select-none" dir="ltr">
                <div className="relative inline-block">
                  <span className="font-brand-italic font-normal text-[19px] xs:text-[21px] sm:text-[23px] tracking-[0.02em] text-[#222222]">
                    Akbar Salehi Collection
                  </span>
                  {/* ستاره چهارپر طلایی */}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="absolute -top-1.5 -right-3.5 text-[#b59766]"
                  >
                    <path
                      d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="font-brand-italic italic text-[15px] xs:text-[16px] sm:text-[17px] text-[#cbb592] -mt-1.5 tracking-wide">
                  Akbarsalehi
                </div>
              </div>
            </div>

            {/* وکتور اسلیمی سمت چپ قاب (Vector2ltr.png: برگ ۷پر طلایی) */}
            <ExactPalmetteVector
              strokeColor="#cbb592"
              className="w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 absolute -left-8 xs:-left-11 sm:-left-14 top-1/2 -translate-y-1/2 -z-10 pointer-events-none"
            />
          </div>
        </div>

        {/* ۲. متون توضیحات خدمات با خط عمودی طلایی (در موبایل زیر قاب قوسی می‌آید order-2) */}
        <div className="order-2 lg:order-1 lg:col-span-7 space-y-7 sm:space-y-9 mt-2 lg:mt-0">
          {/* بلوک اول: عملکرد پیاده سازی */}
          <div>
            <div className="border-r-[3px] border-[#b59766] pr-3 mb-3">
              <h3 className="text-[15px] sm:text-[16.5px] font-bold text-[#222222]">
                {mainSettings?.service1Title || 'عملکرد پیاده سازی'}
              </h3>
            </div>
            <p className="text-[12px] sm:text-[13.5px] leading-7 sm:leading-8 text-[#222222] text-justify font-normal">
              {mainSettings?.service1Description ||
                'گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری، آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز به نردبان هیدرولیکی به متر 12 . محدوده نصب خدمات تهران، کرج، لواسانات را برای شما مشتریان عزیز انجام میدهد. لوستر صالحی با بیش از 18 سال سابقه کاری در صنعت لوستر ایران دارای رزومه کاری فرودگاه امام خمینی ، مسجد فخر آباد مسجد چهارده معصوم و انواع مساجد سینما آستارای تجریش و غیره آماده ارائه خدمات برای شما مشتریان عزیز می باشد.'}
            </p>
          </div>

          {/* بلوک دوم: خدمات بسته بندی، نصب لوستر */}
          <div>
            <div className="border-r-[3px] border-[#b59766] pr-3 mb-3">
              <h3 className="text-[15px] sm:text-[16.5px] font-bold text-[#222222]">
                {mainSettings?.service2Title || 'خدمات بسته بندی، نصب لوستر'}
              </h3>
            </div>
            <p className="text-[12px] sm:text-[13.5px] leading-7 sm:leading-8 text-[#222222] text-justify font-normal">
              {mainSettings?.service2Description ||
                'گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری، آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب لوستر طبقاتی و نصب کلاب میباشد. آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز میباشد،'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
