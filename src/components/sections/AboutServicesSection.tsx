import React from 'react';
import { SectionHeading, ArchSideFiligreeWing } from '../Ornaments';
import { GENERATED_IMAGES, ChandelierProduct } from '../../data/chandelierData';
import { TransparentProductImage } from '../TransparentProductImage';

interface AboutServicesSectionProps {
  featuredProduct?: ChandelierProduct;
  onOpenProductModal?: (product: ChandelierProduct) => void;
}

/**
 * بخش «درباره خدمات لوستر»
 * شامل توضیحات عملکرد پیاده‌سازی و خدمات بسته‌بندی در راست
 * و قاب قوسی ساده و تمیز «Akbar Salehi Collection» با وکتورهای Vector2rtl.png و Vector2ltr.png در طرفین
 */
export const AboutServicesSection: React.FC<AboutServicesSectionProps> = () => {
  return (
    <section
      id="about-services"
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-12"
    >
      <SectionHeading title="درباره خدمات لوستر" className="mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* ستون راست: متون خدمات با خط عمودی طلایی در سمت راست تیترها */}
        <div className="lg:col-span-7 space-y-9">
          {/* بلوک اول: عملکرد پیاده سازی */}
          <div>
            <div className="border-r-[3px] border-[#b59766] pr-3 mb-3.5">
              <h3 className="text-[15.5px] font-bold text-[#222222]">
                عملکرد پیاده سازی
              </h3>
            </div>
            <p className="text-xs sm:text-[13.5px] leading-8 text-[#555555] text-justify">
              گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری،
              آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب
              لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز به نردبان هیدرولیکی به
              متر 12 . محدوده نصب خدمات تهران، کرج، لواسانات را برای شما مشتریان عزیز انجام
              میدهد. لوستر صالحی با بیش از 18 سال سابقه کاری در صنعت لوستر ایران دارای
              رزومه کاری فرودگاه امام خمینی ، مسجد فخر آباد مسجد چهارده معصوم و انواع مساجد
              سینما آستارای تجریش و غیره آماده ارائه خدمات برای شما مشتریان عزیز می باشد.
            </p>
          </div>

          {/* بلوک دوم: خدمات بسته بندی، نصب لوستر */}
          <div>
            <div className="border-r-[3px] border-[#b59766] pr-3 mb-3.5">
              <h3 className="text-[15.5px] font-bold text-[#222222]">
                خدمات بسته بندی، نصب لوستر
              </h3>
            </div>
            <p className="text-xs sm:text-[13.5px] leading-8 text-[#555555] text-justify">
              گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری،
              آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب
              لوستر طبقاتی و نصب کلاب میباشد. آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در
              سقف های یونولیت مجهز میباشد،
            </p>
          </div>
        </div>

        {/* ستون چپ: قاب قوسی لوستر طبقاتی با وکتورهای Vector2rtl.png در راست و Vector2ltr.png در چپ */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* بال اسلیمی سمت راست قاب (Vector2rtl.png چسبیده به کادر) */}
            <ArchSideFiligreeWing className="hidden sm:block -ml-[2px] mt-6" />

            {/* قاب قوسی سفید با تصویر ساده و تمیز لوستر */}
            <div className="relative z-10 w-[300px] sm:w-[340px] bg-white rounded-t-[175px] rounded-b-[26px] border border-[#e6e6e6] shadow-[0_12px_40px_rgba(0,0,0,0.03)] pt-3 pb-6 px-5 flex flex-col items-center">
              {/* تصویر ساده لوستر بدون دکمه‌های سه‌بعدی یا کاتالوگ */}
              <div className="w-full h-[290px] flex items-start justify-center overflow-hidden rounded-t-[155px] rounded-b-xl">
                <TransparentProductImage
                  src={GENERATED_IMAGES.shahMalakeh}
                  alt="Akbar Salehi Collection"
                  className="max-h-[280px] w-auto object-contain"
                />
              </div>

              {/* نوشته Akbar Salehi Collection به همراه ستاره طلایی و امضای دست‌نویس زیرین */}
              <div className="mt-3 text-center select-none" dir="ltr">
                <div className="relative inline-block">
                  <span className="font-brand-italic font-normal text-[21px] sm:text-[23px] tracking-[0.02em] text-[#222222]">
                    Akbar Salehi Collection
                  </span>
                  {/* ستاره چهارپر طلایی بالای حرف n */}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="absolute -top-1.5 -right-3 text-[#b59766]"
                  >
                    <path
                      d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="font-brand-italic italic text-[17px] text-[#cbb592] -mt-2 tracking-wide">
                  Akbarsalehi
                </div>
              </div>
            </div>

            {/* بال اسلیمی سمت چپ قاب (Vector2ltr.png چسبیده به کادر) */}
            <ArchSideFiligreeWing flip className="hidden sm:block -mr-[2px] mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
};
