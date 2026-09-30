import React from 'react';

/**
 * ۱. وکتور دقیق پترن گل/برگ طلایی کنار لوگو و طرفین قاب قوسی (طراحی شده مو‌به‌مو از روی Vector2ltr.png و Vector2rtl.png)
 * در حالت پیش‌فرض (ltr) نوک برگ به سمت چپ است و در حالت (flip / rtl) نوک برگ به سمت راست است.
 */
export const ExactPalmetteVector: React.FC<{
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
}> = ({ className = '', strokeColor = '#cbb592', strokeWidth = 1.6 }) => (
  <svg
    viewBox="0 0 110 102"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <g
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* کانتور بیرونی برگ ۷ پر اسلیمی (دقیقاً مطابق Vector2ltr.png) */}
      <path d="M103 46.5 C93 42.5, 88.5 36, 87.5 26.5 C94 31, 108.5 29.5, 108.5 16.5 C108.5 6.5, 95 2.5, 81 1.5 C83.5 7.5, 88.5 11.5, 85.5 14.5 C82.5 17, 77 11, 76 5.5 C69 4, 63 3, 58 2.5 C57.5 12.5, 65 19, 73 26 C78.5 31, 78 37.5, 72 37.5 C65.5 37.5, 58 26.5, 49 22 C40 19.5, 33 19, 26.5 18.5 C28.5 26.5, 35.5 33, 43 36 C28.5 35.5, 15.5 41.5, 2 51 C15.5 60.5, 28.5 66.5, 43 66 C35.5 69, 28.5 75.5, 26.5 83.5 C33 83, 40 82.5, 49 80 C58 75.5, 65.5 64.5, 72 64.5 C78 64.5, 78.5 71, 73 76 C65 83, 57.5 89.5, 58 99.5 C63 99, 69 98, 76 96.5 C77 91, 82.5 85, 85.5 87.5 C88.5 90.5, 83.5 94.5, 81 100.5 C95 99.5, 108.5 95.5, 108.5 85.5 C108.5 72.5, 94 71, 87.5 75.5 C88.5 66, 93 59.5, 103 55.5" />

      {/* پرچم ۵ شاخه میانی (با زبانه بلند افقی در وسط و ۴ پرچم کوتاه در بالا و پایین) */}
      <path d="M104.5 49 C95 46, 86 42.5, 80.5 40.5 C78.5 40, 78 42.5, 80 43.5 C83 45, 87 46.5, 89.5 47.5 C83 45.5, 77 43.5, 73.5 43 C71.5 42.8, 71 45.5, 73.5 46.5 C76.5 47.8, 80.5 49, 83.5 49.6 C72 49.5, 58 49.5, 51 50 C49.5 50.2, 49.5 51.8, 51 52 C58 52.5, 72 52.5, 83.5 52.4 C80.5 53, 76.5 54.2, 73.5 55.5 C71 56.5, 71.5 59.2, 73.5 59 C77 58.5, 83 56.5, 89.5 54.5 C87 55.5, 83 57, 80 58.5 C78 59.5, 78.5 62, 80.5 61.5 C86 59.5, 95 56, 104.5 53" />
    </g>
  </svg>
);

/**
 * ۲. وکتور دقیق پترن اسلیمی وینتیج (Centered-Vintage-Ornament-29--Streamline-Ornaments.png)
 * در حالت پیش‌فرض (direction="rtl") نوک نیزه‌ای به سمت راست است (تصویر ۲)
 * و در حالت (direction="ltr") نوک نیزه‌ای به سمت چپ است (تصویر ۳)
 */
export const CenteredVintageOrnament29: React.FC<{
  direction?: 'rtl' | 'ltr';
  color?: string;
  className?: string;
}> = ({ direction = 'rtl', color = '#e8e2d9', className = '' }) => (
  <svg
    viewBox="0 0 260 270"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${
      direction === 'ltr' ? '-scale-x-100' : ''
    } ${className}`}
  >
    {/* بخش‌های توپر میانی و ۵ نقطه دایره‌ای */}
    <g fill={color}>
      {/* نقطه سمت چپ وسط */}
      <circle cx="11" cy="135" r="4.5" />
      {/* نقطه‌های بالا و پایین سمت چپ */}
      <circle cx="54" cy="9" r="4.5" />
      <circle cx="54" cy="261" r="4.5" />
      {/* نقطه‌های بالا و پایین بیرون کادر کارت (نزدیک سرنیزه) */}
      <circle cx="202" cy="101" r="4.5" />
      <circle cx="202" cy="169" r="4.5" />

      {/* بدنه توپر مرکزی و سرنیزه الماسی */}
      <path d="M18 135 C34 132, 48 132, 64 125 C72 131, 98 131, 118 124 C128 119, 136 111, 141 105 L141 125 C135 127, 134 131, 139 133 C143 134, 148 126, 153 128 C165 132, 188 132, 202 124 C210 130, 218 133, 228 135 C218 137, 210 140, 202 146 C188 138, 165 138, 153 142 C148 144, 143 136, 139 137 C134 139, 135 143, 141 145 L141 165 C136 159, 128 151, 118 146 C98 139, 72 139, 64 145 C48 138, 34 138, 18 135 Z" />
    </g>

    {/* خطوط اسلیمی، برگ‌های سه‌پر و ساقه‌های موج‌دار بدون هیچ‌گونه تقاطع اضافی */}
    <g
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* کمان بیرونی سرنیزه سمت راست تا لبه تصویر (x=259) */}
      <path d="M148 96 C164 114, 187 121, 202 110 C217 124, 236 133, 259 135 C236 137, 217 146, 202 160 C187 149, 164 156, 148 174" />

      {/* === نیمه بالایی === */}
      {/* ۱. ستون پیچش عمودی سمت چپ */}
      <path d="M22 134 C8 118, 8 82, 20 56 C16 49, 12 45, 7 45 C14 42, 20 46, 22 52 C11 36, 9 16, 20 9 C29 4, 37 13, 33 22 C30 28, 22 27, 23 20 C24 17, 27 17, 27 19" />

      {/* ۲. برگ سه‌پر بزرگ بالا + حلزون داخلی (یک مسیر پیوسته و بدون تقاطع) */}
      <path d="M60 76 C55 72, 47 75, 47 83 C47 94, 60 98, 68 90 C76 82, 74 66, 63 59 C48 50, 29 62, 29 83 C29 104, 49 119, 71 119 C83 106, 82 76, 68 56 C59 44, 47 48, 45 52 C49 36, 63 34, 72 43 C66 28, 71 15, 83 9 C83 21, 93 28, 90 42 C98 32, 111 34, 114 47 C104 45, 96 53, 93 67 C89 85, 85 106, 76 117 C98 117, 116 102, 136 89 C153 78, 178 84, 178 103 C178 116, 163 122, 155 112 C151 106, 156 98, 164 101 C167 103, 166 108, 163 108" />

      {/* ۳. ساقه موج‌دار مورب بالا */}
      <path d="M93 110 L109 96 C106 90, 112 85, 118 89 C124 93, 129 87, 124 81 C120 76, 126 71, 132 75 L154 53 C160 45, 158 35, 150 35 C145 35, 144 41, 148 43" />

      {/* === نیمه پایینی (قرینه کامل نیمه بالایی) === */}
      {/* ۱. ستون پیچش عمودی سمت چپ پایین */}
      <path d="M22 136 C8 152, 8 188, 20 214 C16 221, 12 225, 7 225 C14 228, 20 224, 22 218 C11 234, 9 254, 20 261 C29 266, 37 257, 33 248 C30 242, 22 243, 23 250 C24 253, 27 253, 27 251" />

      {/* ۲. برگ سه‌پر بزرگ پایین + حلزون داخلی (یک مسیر پیوسته و بدون تقاطع) */}
      <path d="M60 194 C55 198, 47 195, 47 187 C47 176, 60 172, 68 180 C76 188, 74 204, 63 211 C48 220, 29 208, 29 187 C29 166, 49 151, 71 151 C83 164, 82 194, 68 214 C59 226, 47 222, 45 218 C49 234, 63 236, 72 227 C66 242, 71 255, 83 261 C83 249, 93 242, 90 228 C98 238, 111 236, 114 223 C104 225, 96 217, 93 203 C89 185, 85 164, 76 153 C98 153, 116 168, 136 181 C153 192, 178 186, 178 167 C178 154, 163 148, 155 158 C151 164, 156 172, 164 169 C167 167, 166 162, 163 162" />

      {/* ۳. ساقه موج‌دار مورب پایین */}
      <path d="M93 160 L109 174 C106 180, 112 185, 118 181 C124 177, 129 183, 124 189 C120 194, 126 199, 132 195 L154 217 C160 225, 158 235, 150 235 C145 235, 144 229, 148 227" />
    </g>
  </svg>
);

/**
 * ۳. وکتور دقیق گل طلایی دو طرف تیترها (Vectorltr.png و Vectorrtl.png)
 */
export const SectionHeadingFloralOrnament: React.FC<{
  direction: 'rtl' | 'ltr';
  className?: string;
}> = ({ direction, className = '' }) => (
  <svg
    viewBox="0 0 68 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 pointer-events-none select-none ${
      direction === 'rtl' ? '-scale-x-100' : ''
    } ${className}`}
  >
    {/* بخش‌های توپر طلایی داخل گلبرگ میانی و حلزون‌های بالا و پایین (دقیقاً مطابق Vectorltr.png) */}
    <g fill="#b08c57">
      {/* اشک طلایی داخل گلبرگ افقی وسط */}
      <path d="M39 32 C29 28.8, 18 28.8, 11 32 C18 35.2, 29 35.2, 39 32 Z" />
      {/* هلال طلایی داخل پیچش بالایی */}
      <path d="M38 23 C28 21, 22 15, 24 9 C25 5, 31 4, 34 8 C30 6.5, 27 8.5, 27 12.5 C27 17, 32 20.5, 38 23 Z" />
      {/* هلال طلایی داخل پیچش پایینی */}
      <path d="M38 41 C28 43, 22 49, 24 55 C25 59, 31 60, 34 56 C30 57.5, 27 55.5, 27 51.5 C27 47, 32 43.5, 38 41 Z" />
    </g>

    {/* خطوط بیرونی و جام گل در سمت راست */}
    <g
      stroke="#b08c57"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* گلبرگ نوک‌تیز میانی (سمت چپ) */}
      <path d="M43 27.5 C30 22, 13 23.5, 2 32 C13 40.5, 30 42, 43 36.5" />

      {/* گلبرگ حلزونی بالا */}
      <path d="M44 26 C34 24, 21 20, 18 12 C16 5, 22 1.5, 29 2 C36 2.5, 41 8, 38 14.5 C36 18.5, 31 19, 29 15.5 C28 13.5, 30 11, 32 12" />

      {/* گلبرگ حلزونی پایین */}
      <path d="M44 38 C34 40, 21 44, 18 52 C16 59, 22 62.5, 29 62 C36 61.5, 41 56, 38 49.5 C36 45.5, 31 45, 29 48.5 C28 50.5, 30 53, 32 52" />

      {/* لوزی مرکزی و کاسبرگ‌های بالا و پایین */}
      <path d="M56 32 L48 26.5 L40 32 L48 37.5 Z" />
      <path d="M48 26.5 C46 21, 47 16, 49.5 12.5 C51 17.5, 53.5 22, 58 25" />
      <path d="M48 37.5 C46 43, 47 48, 49.5 51.5 C51 46.5, 53.5 42, 58 39" />

      {/* حلقه بیضی پایه در منتهی‌الیه سمت راست */}
      <ellipse cx="61" cy="32" rx="4.2" ry="7.2" />
      <path d="M59.5 25.2 V38.8" />
    </g>
  </svg>
);

/**
 * ۴. آیکون دقیق تیک کنگره‌دار طلایی (verify.png)
 */
export const CategoryStarSeal: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 46, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* کادر ۸ پر موج‌دار نرم دقیقاً مشابه verify.png */}
    <path
      d="M24 4.5 C26.6 4.5, 28.5 7.4, 30.9 8.4 C33.3 9.4, 36.8 8.3, 38.6 10.1 C40.4 11.9, 39.3 15.4, 40.3 17.8 C41.3 20.2, 44.2 22.1, 44.2 24.7 C44.2 27.3, 41.3 29.2, 40.3 31.6 C39.3 34.0, 40.4 37.5, 38.6 39.3 C36.8 41.1, 33.3 40.0, 30.9 41.0 C28.5 42.0, 26.6 44.9, 24 44.9 C21.4 44.9, 19.5 42.0, 17.1 41.0 C14.7 40.0, 11.2 41.1, 9.4 39.3 C7.6 37.5, 8.7 34.0, 7.7 31.6 C6.7 29.2, 3.8 27.3, 3.8 24.7 C3.8 22.1, 6.7 20.2, 7.7 17.8 C8.7 15.4, 7.6 11.9, 9.4 10.1 C11.2 8.3, 14.7 9.4, 17.1 8.4 C19.5 7.4, 21.4 4.5, 24 4.5 Z"
      stroke="#b08c57"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* تیک وسط */}
    <path
      d="M17.5 24.8 L22.1 29.3 L31.2 20.2"
      stroke="#b08c57"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * لوگوی اصلی هدر همراه با پترن دقیق Vector.png در سمت راست
 */
export const HeaderBrandLogo: React.FC = () => {
  return (
    <div className="inline-flex items-center select-none" dir="ltr">
      <div className="flex flex-col items-end pr-3">
        <span
          className="text-[13px] sm:text-[14px] font-semibold tracking-[0.03em] text-[#b58d53] leading-none mb-1.5"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          Chandelier
        </span>
        <span className="font-brand-serif text-[21px] sm:text-[26px] tracking-[0.04em] text-[#2b2b2b] font-normal uppercase leading-none">
          AKBAR SALEHI
        </span>
      </div>

      {/* پترن وکتور دقیق چسبیده به سمت راست لوگو */}
      <ExactPalmetteVector className="w-12 h-14 sm:w-14 sm:h-16 -mr-2 shrink-0" />
    </div>
  );
};

/**
 * لوگوی فوتر در باکس طلایی همراه با ۳ پروانه تیره و خط عمودی
 */
export const FooterBrandLogo: React.FC = () => {
  return (
    <div className="inline-flex items-center select-none" dir="ltr">
      <div className="relative flex flex-col items-end pr-3 border-r border-[#2b2b2b]/60">
        <svg
          width="42"
          height="28"
          viewBox="0 0 48 32"
          fill="none"
          className="absolute -top-4 -left-7 text-[#231f1c]"
        >
          <path
            d="M12 10C8 3 2 2 1 6C0 10 6 12 12 10ZM12 10C16 3 22 2 23 6C24 10 18 12 12 10ZM12 10C9 14 4 17 3 14C2 11 7 10 12 10ZM12 10C15 14 20 17 21 14C22 11 17 10 12 10Z"
            fill="currentColor"
          />
          <path
            d="M28 18C25 13 21 12 20 15C19 18 24 19 28 18ZM28 18C31 13 35 12 36 15C37 18 32 19 28 18Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M19 24C17 21 14 20 13 22C12 24 16 25 19 24ZM19 24C21 21 24 20 25 22C26 24 22 25 19 24Z"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>

        <span
          className="text-xs tracking-[0.03em] text-[#231f1c] font-semibold mb-1"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          Chandelier
        </span>
        <span className="font-brand-serif text-2xl sm:text-[26px] tracking-[0.05em] text-white font-normal uppercase leading-none">
          AKBAR SALEHI
        </span>
      </div>
    </div>
  );
};

/**
 * تیتر بخش‌های صفحه همراه با وکتور دقیق Vectorrtl.png در راست، Vectorltr.png در چپ و خط طلایی زیر تیتر
 */
export const SectionHeading: React.FC<{
  title: string;
  mobileTitle?: string;
  className?: string;
}> = ({ title, mobileTitle, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center my-2 ${className}`}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {/* سمت راست متن (در چیدمان RTL): Vectorrtl.png (نوک گل به سمت راست) */}
        <SectionHeadingFloralOrnament
          direction="rtl"
          className="w-5 h-5 xs:w-6 xs:h-6 sm:w-9 sm:h-9"
        />
        <h2 className="text-[15.5px] xs:text-[16.5px] sm:text-[23px] font-extrabold text-[#141414] tracking-tight whitespace-nowrap">
          <span className="sm:hidden">{mobileTitle || title}</span>
          <span className="hidden sm:inline">{title}</span>
        </h2>
        {/* سمت چپ متن (در چیدمان RTL): Vectorltr.png (نوک گل به سمت چپ) */}
        <SectionHeadingFloralOrnament
          direction="ltr"
          className="w-5 h-5 xs:w-6 xs:h-6 sm:w-9 sm:h-9"
        />
      </div>
      <div className="w-10 sm:w-12 h-[2px] sm:h-[2.5px] bg-[#b08c57] rounded-full mt-2 sm:mt-3" />
    </div>
  );
};

/**
 * نقوش اسلیمی سفید طرفین تیتر داخل بنر اصلی (Hero) با استفاده از وکتور دقیق CenteredVintageOrnament29
 */
export const HeroTitleOrnament: React.FC<{
  flip?: boolean;
  className?: string;
}> = ({ flip = false, className = '' }) => (
  <CenteredVintageOrnament29
    direction={flip ? 'rtl' : 'ltr'}
    color="rgba(255, 255, 255, 0.9)"
    className={`w-15 h-16 sm:w-20 sm:h-21 lg:w-24 lg:h-25 shrink-0 ${className}`}
  />
);

/**
 * بال‌های اسلیمی طلایی طرفین قاب قوسی «Akbar Salehi Collection» (دقیقاً مطابق Vector2rtl.png در راست و Vector2ltr.png در چپ)
 */
export const ArchSideFiligreeWing: React.FC<{
  flip?: boolean;
  className?: string;
}> = ({ flip = false, className = '' }) => (
  <div className={`${flip ? '' : '-scale-x-100'} ${className}`}>
    <ExactPalmetteVector
      className="w-20 sm:w-24 h-18 sm:h-22"
      strokeColor="#cbb592"
      strokeWidth={1.6}
    />
  </div>
);

/**
 * پترن اسلیمی بزرگ پس‌زمینه در دو طرف بخش دسته‌بندی محصولات (Centered-Vintage-Ornament-29)
 */
export const ArabesqueCornerPattern: React.FC<{
  flip?: boolean;
  className?: string;
}> = ({ flip = false, className = '' }) => (
  <CenteredVintageOrnament29
    direction={flip ? 'ltr' : 'rtl'}
    color="#ede7de"
    className={className}
  />
);

/**
 * نشان خوشنویسی «لوستر صالحی» در شبکه ۲×۲ فوتر
 */
export const CalligraphyTrustBadge: React.FC<{ index: number }> = ({
  index,
}) => (
  <div
    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#eeede9] hover:bg-[#e4e2dc] transition-colors flex flex-col items-center justify-center border border-[#e5e3dd] cursor-pointer group"
    title={`گواهینامه و نشان اصالت شماره ${index + 1}`}
  >
    <svg
      viewBox="0 0 48 44"
      fill="none"
      className="w-9 h-9 text-[#222222] group-hover:scale-105 transition-transform"
    >
      <path
        d="M12 28C18 26 28 16 35 10C32 17 26 24 30 28C33 30 37 26 38 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M14 20C18 18 23 14 26 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="19" cy="11" r="1.6" fill="currentColor" />
      <circle cx="29" cy="31" r="1.5" fill="currentColor" />
      <text
        x="24"
        y="39"
        textAnchor="middle"
        fontSize="5"
        fill="#555"
        className="font-sans"
      >
        لوستر صالحی
      </text>
    </svg>
  </div>
);
