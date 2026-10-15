import React from 'react';
import { ChandelierProduct } from '../../data/chandelierData';

interface ProductHeroInfoProps {
  product: ChandelierProduct;
}

export const ProductHeroInfo: React.FC<ProductHeroInfoProps> = ({ product }) => {
  return (
    <div className="flex flex-col text-right">
      {/* عنوان بزرگ محصول */}
      <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] tracking-tight text-right">
        {product.name}
      </h1>

      {/* زیرعنوان و کاربری لوستر */}
      <p className="text-[13px] font-bold mt-1.5 text-right">
        <span className="text-[#b58c5e]">مناسب کلاسیک پذیرایی</span>{' '}
        <span className="text-[#777]">| کلاسیک خواب</span>
      </p>

      {/* توضیحات خلاصه متنی با اسکرول داخلی در صورت طولانی بودن */}
      <div className="max-h-[160px] overflow-y-auto custom-scrollbar pr-0.5 pl-2 mt-3">
        <p className="text-xs sm:text-[13px] leading-relaxed text-[#666] font-normal text-justify">
          {product.description ||
            'نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر استفاده می‌شود، البته که همانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ می‌شود.'}
        </p>
      </div>
    </div>
  );
};
