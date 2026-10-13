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
 * - در موبایل: ابتدا قاب قوسی به همراه وکتورهای پترن برگ ExactPalmetteVector در دو طرف، و متون توضیحات خدمات زیر آن قرار می‌گیرند
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
        {/* ۱. قاب قوسی لوستر طبقاتی با پترن‌های اسلیمی در دو طرف مطابق طرح فیگما */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex items-center justify-center my-2 sm:my-0">
          <div className="relative flex items-center justify-center">
            {/* وکتور اسلیمی سمت راست قاب (ExactPalmetteVector: برگ ۷پر طلایی کمی بیرون‌تر) */}
            <ExactPalmetteVector
              strokeColor="#cbb592"
              strokeWidth={1.7}
              className="-scale-x-100 w-22 xs:w-26 sm:w-30 h-22 xs:h-26 sm:h-30 absolute -right-12 xs:-right-16 sm:-right-20 top-1/2 -translate-y-1/2 z-0 pointer-events-none drop-shadow-[0_2px_4px_rgba(203,181,146,0.15)] opacity-90"
            />

            {/* قاب قوسی سفید با تصویر لوستر و امضای Akbar Salehi Collection */}
            <div className="relative z-10 w-[320px] max-w-full bg-white rounded-t-[160px] rounded-b-[20px] border border-[#e6e2d8] shadow-[0_12px_36px_rgba(0,0,0,0.04)] pt-3 pb-6 px-4 sm:px-5 flex flex-col items-center">
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
              <div className="mt-3 text-center select-none max-w-full px-1" dir="ltr">
                <div className="relative inline-block max-w-full">
                  <span
                    className="font-normal text-[16px] xs:text-[18px] sm:text-[19.5px] tracking-[0.02em] text-[#222222] whitespace-nowrap block"
                    style={{ fontFamily: "'Hiragino Mincho ProN', 'Hiragino', serif" }}
                  >
                    Akbar Salehi Collection
                  </span>
                  {/* ستاره چهارپر طلایی */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="absolute -top-1 -right-3 text-[#b59766]"
                  >
                    <path
                      d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div
                  className="text-[24px] xs:text-[26.5px] sm:text-[29px] text-[#b89562] font-medium -mt-1 tracking-wide whitespace-nowrap"
                  style={{ fontFamily: "'Brianna Qasim', 'Berianna qasim', 'BriannaQasim', cursive" }}
                >
                  Akbarsalehi
                </div>
              </div>
            </div>

            {/* وکتور اسلیمی سمت چپ قاب (ExactPalmetteVector: برگ ۷پر طلایی کمی بیرون‌تر) */}
            <ExactPalmetteVector
              strokeColor="#cbb592"
              strokeWidth={1.7}
              className="w-22 xs:w-26 sm:w-30 h-22 xs:h-26 sm:h-30 absolute -left-12 xs:-left-16 sm:-left-20 top-1/2 -translate-y-1/2 z-0 pointer-events-none drop-shadow-[0_2px_4px_rgba(203,181,146,0.15)] opacity-90"
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
