import React from 'react';
import { ChandelierProduct } from '../../data/chandelierData';
import { toPersianDigits } from '../../utils/persianDigits';

interface ProductSpecsCardProps {
  product: ChandelierProduct;
  onOpenFeaturesModal: () => void;
}

const VerifyBadgeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 4.1L17.7 3.7L18.8 6.8L21.9 8L21.5 11.3L23.6 13.7L21.5 16.1L21.9 19.4L18.8 20.6L17.7 23.7L14.4 23.3L12 25.4L9.6 23.3L6.3 23.7L5.2 20.6L2.1 19.4L2.5 16.1L0.4 13.7L2.5 11.3L2.1 8L5.2 6.8L6.3 3.7L9.6 4.1L12 2Z" fill="none" stroke="#b08754" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 12.5L11 15L15.5 9.5" stroke="#b08754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HashtagUpIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="#b08754" strokeWidth="1.8"/>
    <path d="M8 8.5H16M8 12.5H13M10 5.5V13.5M14 5.5V10" stroke="#b08754" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 18.5V13.5M16 13.5L14 15.5M16 13.5L18 15.5" stroke="#b08754" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LayerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="#b08754" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 13L12 18L22 13" stroke="#b08754" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17.5L12 22.5L22 17.5" stroke="#b08754" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RulerCustomIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="2" width="10" height="20" rx="3" stroke="#b08754" strokeWidth="1.8"/>
    <path d="M10 6.5H14M10 10.5H12M10 14.5H14M10 18.5H12" stroke="#b08754" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const ProductSpecsCard: React.FC<ProductSpecsCardProps> = ({ product, onOpenFeaturesModal }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {/* کارت راست: مشخصات شناختی (مدل، کد محصول، جنس بدنه، ابعاد با آیکون‌های طلایی) */}
      <div className="rounded-[24px] border border-[#f0eee8] bg-white p-5 space-y-7 shadow-2xs">
        {/* مدل */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#111]">
            {product.name.replace('لوستر', '').trim() || 'ملکه کریستالی'} برنزت ایتالیایی
          </span>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[#777]">مدل :</span>
            <div className="w-10 h-10 rounded-[12px] bg-[#fbf8f3] border border-[#f2eee8] flex items-center justify-center shrink-0">
              <VerifyBadgeIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* کد محصول */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#111] tabular-nums">
            به شماره انبار {toPersianDigits(product.productCode || '۱۲۸۵۷۹')}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[#777]">کد محصول :</span>
            <div className="w-10 h-10 rounded-[12px] bg-[#fbf8f3] border border-[#f2eee8] flex items-center justify-center shrink-0">
              <HashtagUpIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* جنس بدنه */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#111]">
            {product.bodyMaterial ? product.bodyMaterial.split(' ')[0] : 'برنج'}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[#777]">جنس بدنه :</span>
            <div className="w-10 h-10 rounded-[12px] bg-[#fbf8f3] border border-[#f3eee5] flex items-center justify-center shrink-0">
              <LayerIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ابعاد */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#111] tabular-nums" dir="ltr">
            H۴۹ * D۲۰
          </span>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[#777]">ابعاد :</span>
            <div className="w-10 h-10 rounded-[12px] bg-[#fbf8f3] border border-[#f3eee5] flex items-center justify-center shrink-0">
              <RulerCustomIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* کارت چپ: دکمه مشاهده ویژگی‌های ۱۵گانه تکمیلی محصول */}
      <div className="rounded-[24px] border border-[#f0eee8] bg-white p-5 flex flex-col justify-between shadow-2xs">
        <div>
          <h3 className="text-sm font-extrabold text-[#1a1a1a] text-right">
            ویژگی‌های ساختاری و گارانتی اصالت
          </h3>
          <p className="text-xs text-[#777] mt-2 leading-relaxed text-right">
            مشاهده ۱۵ ویژگی انحصاری شامل مقاومت در برابر رطوبت، ضمانت آبکاری مادام‌العمر، سرپیچ سرامیکی نسوز و...
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFeaturesModal}
          className="w-full mt-4 py-3 px-4 rounded-[16px] bg-[#faf6ef] hover:bg-[#f3ece1] border border-[#e8dfcf] text-[#a98552] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>مشاهده مشخصات کامل و ۱۵ ویژگی</span>
        </button>
      </div>
    </div>
  );
};
