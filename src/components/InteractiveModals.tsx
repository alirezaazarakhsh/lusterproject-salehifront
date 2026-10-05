import React, { useState, useEffect, useRef } from 'react';
import { navigateToRoute } from '../utils/navigation';
import {
  X,
  ShoppingBag,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  PhoneCall,
  ShieldCheck,
  Ruler,
  Layers,
  Palette,
  Upload,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  Loader2,
  Eye,
} from 'lucide-react';
import {
  ChandelierProduct,
  StoryItem,
  STORY_ITEMS,
  STORY_CATEGORIES,
  StoryCategoryType,
  StorySlideType,
  StoryProductAttachment,
  SALEHI_COLLECTION_PRODUCTS,
  MagazineArticle,
  GENERATED_IMAGES,
} from '../data/chandelierData';
import { ExactPalmetteVector } from './Ornaments';
import {
  Chandelier3DViewer,
  FinishType,
  FINISH_PRESETS,
} from './Chandelier3DViewer';
import { TransparentProductImage } from './TransparentProductImage';

export interface CartItem {
  product: ChandelierProduct;
  quantity: number;
}

interface ProductStudioModalProps {
  product: ChandelierProduct | null;
  initialFinish?: FinishType;
  onClose: () => void;
  onAddToCart: (product: ChandelierProduct, qty: number) => void;
  initialTab?: '3d' | 'photo';
}

export const ProductStudioModal: React.FC<ProductStudioModalProps> = ({
  product,
  initialFinish = 'original',
  onClose,
  onAddToCart,
  initialTab = '3d',
}) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [selectedFinish, setSelectedFinish] =
    useState<FinishType>(initialFinish);
  const [selectedBranches, setSelectedBranches] = useState<string>('۱۲ شاخه');
  const [qty, setQty] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  useEffect(() => {
    setSelectedFinish(initialFinish);
    setActiveSlideIdx(0);
  }, [product, initialFinish]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const toPersianDigits = (str: string | number) => {
    return String(str).replace(/\d/g, (x) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(x)]);
  };

  // گالری تصاویر ثابت به همراه محصول اصلی سه‌بعدی
  const galleryImages = [
    product.image,
    GENERATED_IMAGES.projectRoyalRestaurant,
    GENERATED_IMAGES.projectLobbyHotel,
    GENERATED_IMAGES.projectMosqueDome,
    GENERATED_IMAGES.projectFereshteh,
  ];

  // کامپوننت‌های برداری آیکون‌ها مطابق با طرح فیگما
  const CustomVerifyIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#b59766] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#b59766" fillOpacity="0.1" />
      <path d="M9 11l3 3 6-6" stroke="#b59766" />
    </svg>
  );

  const CustomHashtagUpIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#b59766] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="#b59766" fillOpacity="0.1" />
      <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 11" stroke="#b59766" />
      <path d="M18 19V13M15 16l3-3 3 3" stroke="#b59766" />
    </svg>
  );

  const CustomLayerIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#b59766] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#b59766" />
    </svg>
  );

  const CustomRulerIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#b59766] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="10" rx="3" fill="#b59766" fillOpacity="0.1" stroke="#b59766" />
      <path d="M6 7v4M10 7v4M14 7v4M18 7v4M6 17v-4M10 17v-4M14 17v-4M18 17v-4" stroke="#b59766" />
    </svg>
  );

  const CustomArchiveIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#7a7a7a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );

  const CustomSearchNormalIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#7a7a7a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );

  const CustomShareIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#7a7a7a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );

  const CustomAddSquareIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#2b2b2b] cursor-pointer hover:text-[#b59766] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );

  const CustomMinusSquareIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#2b2b2b] cursor-pointer hover:text-[#b59766] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#fcfbf9] text-[#222222] font-medium"
      dir="rtl"
    >
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-6 sm:py-10 pb-20">
        
        {/* نوار بالای صفحه (هدر و بازگشت) */}
        <div className="flex items-center justify-between border-b border-[#ebdcb9]/40 pb-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1a1a1a]">
              {product.name}
            </h1>
            <p className="text-xs text-[#8c8273] mt-1">
              کلکسیون لوسترهای گالری اکبر صالحی / {product.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 h-10 px-4 rounded-xl border border-[#ebdcb9] hover:bg-[#2b2b2b] text-[#2b2b2b] hover:text-white transition-all cursor-pointer text-xs font-bold"
          >
            <X className="w-4 h-4" />
            <span>بازگشت به گالری</span>
          </button>
        </div>

        {/* بخش اصلی محصول (گالری سه‌بعدی سمت چپ، جزئیات و خرید سمت راست) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* ستون گالری عکس (سمت چپ) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full h-[360px] md:h-[480px] rounded-[24px] bg-[#f9f9f9] border border-[#ebdcb9]/60 overflow-hidden shadow-xs flex items-center justify-center">
              {activeSlideIdx === 0 ? (
                <div className="w-full h-full relative">
                  <Chandelier3DViewer
                    modelType={product.modelType}
                    imageUrl={product.image}
                    initialFinish={selectedFinish}
                    onFinishChange={(fin) => setSelectedFinish(fin)}
                    initialTheme="light"
                    className="w-full h-full"
                  />
                  {/* لیبل راهنمای سه‌بعدی */}
                  <span className="absolute bottom-3 left-3 bg-[#2b2b2b]/85 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg pointer-events-none select-none">
                    چرخش ۳۶۰ درجه فعال است 🌟
                  </span>
                </div>
              ) : (
                <img
                  src={galleryImages[activeSlideIdx]}
                  alt={`${product.name} نمای ${activeSlideIdx}`}
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>

            {/* بندانگشتی‌های ۴گانه ثابت گالری بدون سه‌بعدی شدن */}
            <div className="grid grid-cols-4 gap-3.5">
              {galleryImages.slice(1).map((thumbSrc, tIdx) => {
                const globalIdx = tIdx + 1;
                const isSelected = activeSlideIdx === globalIdx;
                return (
                  <button
                    key={`detail-thumb-${globalIdx}`}
                    type="button"
                    onClick={() => setActiveSlideIdx(globalIdx)}
                    className={`relative rounded-xl overflow-hidden h-[74px] md:h-[94px] bg-[#f2f2f2] border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#b59766] ring-2 ring-[#b59766]/20'
                        : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img
                      src={thumbSrc}
                      alt="محیط اجرایی گالری"
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                );
              })}
            </div>

            {/* بازنشانی به مدل سه‌بعدی */}
            {activeSlideIdx !== 0 && (
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={() => setActiveSlideIdx(0)}
                  className="h-8 px-4 rounded-lg bg-[#b59766] hover:bg-[#9e7e52] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>بازگشت به نمای سه‌بعدی محصول (3D)</span>
                </button>
              </div>
            )}
          </div>

          {/* ستون اطلاعات و خرید محصول (سمت راست) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a]">
                {product.name}
              </h2>
              <p className="text-sm font-bold text-[#b59766] mt-2">
                {product.subtitle}
              </p>
              
              <p className="text-xs sm:text-[13px] text-[#555555] leading-7 text-justify mt-4 pl-1">
                نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود.
              </p>
            </div>

            {/* ردیف دوتایی کارت‌های مشخصات و خرید */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              
              {/* کارت مشخصات اصلی لوستر */}
              <div className="bg-white rounded-[20px] border border-[#ece6da]/80 p-5 space-y-4 shadow-2xs">
                
                {/* مدل */}
                <div className="flex items-center gap-3">
                  <CustomVerifyIcon />
                  <div className="text-right">
                    <span className="block text-[11px] font-bold text-[#777777]">مدل :</span>
                    <span className="block text-xs sm:text-[13px] font-extrabold text-[#1a1a1a] mt-0.5">
                      {product.name || 'ملکه کریستالی برنز ایتالیایی'}
                    </span>
                  </div>
                </div>

                {/* کد محصول */}
                <div className="flex items-center gap-3">
                  <CustomHashtagUpIcon />
                  <div className="text-right">
                    <span className="block text-[11px] font-bold text-[#777777]">کد محصول :</span>
                    <span className="block text-xs sm:text-[13px] font-extrabold text-[#1a1a1a] mt-0.5 tabular-nums">
                      به شماره انبار {product.productCode}
                    </span>
                  </div>
                </div>

                {/* جنس بدنه */}
                <div className="flex items-center gap-3">
                  <CustomLayerIcon />
                  <div className="text-right">
                    <span className="block text-[11px] font-bold text-[#777777]">جنس بدنه :</span>
                    <span className="block text-xs sm:text-[13px] font-extrabold text-[#1a1a1a] mt-0.5">
                      {product.bodyMaterial || 'برنج'}
                    </span>
                  </div>
                </div>

                {/* ابعاد */}
                <div className="flex items-center gap-3">
                  <CustomRulerIcon />
                  <div className="text-right">
                    <span className="block text-[11px] font-bold text-[#777777]">ابعاد :</span>
                    <span className="block text-xs sm:text-[13px] font-extrabold text-[#1a1a1a] mt-0.5 tabular-nums">
                      {product.dimensions || 'H49 * D20'}
                    </span>
                  </div>
                </div>

              </div>

              {/* کارت خرید و ثبت تعداد و رنگ */}
              <div className="bg-white rounded-[20px] border border-[#ece6da]/80 p-5 flex flex-col justify-between shadow-2xs space-y-4">
                
                {/* تعداد محصول */}
                <div>
                  <span className="block text-xs font-bold text-[#1a1a1a]">تعداد محصول :</span>
                  <span className="block text-[10.5px] text-[#ef4444] mt-0.5 font-bold">
                    * حداکثر ۱۲ عدد و حداقل ۱ عدد میباشد
                  </span>
                  
                  <div className="flex items-center gap-3.5 mt-2.5">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(12, q + 1))}
                      aria-label="افزایش تعداد"
                      className="focus:outline-none shrink-0"
                    >
                      <CustomAddSquareIcon />
                    </button>
                    <span className="text-base font-black text-[#1a1a1a] tabular-nums min-w-[18px] text-center">
                      {toPersianDigits(qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="کاهش تعداد"
                      className="focus:outline-none shrink-0"
                    >
                      <CustomMinusSquareIcon />
                    </button>
                  </div>
                </div>

                {/* انتخاب رنگ و دکمه‌های کمکی */}
                <div>
                  <span className="block text-xs font-bold text-[#1a1a1a] mb-2">رنگ :</span>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {(Object.keys(FINISH_PRESETS) as FinishType[]).slice(0, 4).map((fKey) => {
                        const cfg = FINISH_PRESETS[fKey];
                        const isActive = selectedFinish === fKey;
                        return (
                          <button
                            key={fKey}
                            type="button"
                            onClick={() => setSelectedFinish(fKey)}
                            title={cfg.label}
                            className={`w-5 h-5 rounded-full border transition-all ${
                              isActive
                                ? 'ring-2 ring-[#b59766] scale-110 border-white'
                                : 'border-black/20 hover:scale-105'
                            }`}
                            style={{ background: cfg.swatch }}
                          />
                        );
                      })}
                    </div>

                    {/* دکمه‌های کنترل کیفی */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        title="اشتراک‌گذاری"
                        className="w-7 h-7 rounded-lg bg-[#f7f7f7] hover:bg-[#eaeaea] flex items-center justify-center text-[#555] transition-colors cursor-pointer"
                      >
                        <CustomShareIcon />
                      </button>
                      <button
                        type="button"
                        title="نشان کردن"
                        className="w-7 h-7 rounded-lg bg-[#f7f7f7] hover:bg-[#eaeaea] flex items-center justify-center text-[#555] transition-colors cursor-pointer"
                      >
                        <CustomArchiveIcon />
                      </button>
                      <button
                        type="button"
                        title="بزرگنمایی"
                        className="w-7 h-7 rounded-lg bg-[#f7f7f7] hover:bg-[#eaeaea] flex items-center justify-center text-[#555] transition-colors cursor-pointer"
                      >
                        <CustomSearchNormalIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* قیمت نهایی و دکمه سبد خرید */}
                <div className="pt-2 border-t border-[#f5f5f5] flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[11.5px] font-bold text-[#777777]">قیمت محصول :</span>
                    <span className="text-base sm:text-lg font-black text-[#1a1a1a] tabular-nums">
                      {toPersianDigits(product.priceFormatted || '۱۲,۵۰۰,۰۰۰ تومان')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full h-11 rounded-xl bg-[#262626] hover:bg-[#b59766] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0 text-white" />
                    <span>افزودن به سبد خرید</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* بخش توضیحات تکمیلی و مشخصات فنی (پایین عکس) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* توضیحات تکمیلی (Span 7) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-[22px] border border-[#ece6da]/80 p-6 shadow-2xs">
              <h3 className="text-sm sm:text-[15px] font-extrabold text-[#1a1a1a] border-b border-[#f5f5f5] pb-3 mb-4">
                توضیحات تکمیلی
              </h3>
              <p className="text-xs sm:text-[13px] leading-7 text-[#555555] text-justify pl-1">
                نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود،یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود،یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود،یکپارچگی محصولات روشنایی پروژه حفظ میشود معمولا برای فضا های نشیمن لوسترهای گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر آن استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود،یکپارچگی محصولات روشنایی پروژه حفظ میشود.
              </p>
            </div>

            {/* باکس بازه تحویل */}
            <div className="bg-[#fcf8f0]/90 rounded-[20px] border border-[#e3d2b4]/50 p-4.5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-[#b59766] text-white flex items-center justify-center shrink-0 shadow-2xs">
                {/* Truck icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="text-right">
                <span className="block text-xs sm:text-[13px] font-black text-[#1a1a1a]">
                  بازه زمانی تحویل :
                </span>
                <span className="block text-[11.5px] text-[#6e675c] mt-1.5 tabular-nums">
                  تاریخ حدود مرسوله (۲ مهر ۱۴۰۴ - ۷ مهر ۱۴۰۴) <span className="mx-2 text-[#ccc]">|</span> ساعت حدودی : ۱۲:۵۵ الی ۱۴:۴۵
                </span>
              </div>
            </div>
          </div>

          {/* جدول مشخصات فنی لوستر (Span 5) */}
          <div className="lg:col-span-5 bg-white rounded-[22px] border border-[#ece6da]/80 p-6 shadow-2xs">
            <h3 className="text-sm sm:text-[15px] font-extrabold text-[#1a1a1a] border-b border-[#f5f5f5] pb-3 mb-4">
              مشخصات فنی لوستر
            </h3>
            
            <div className="divide-y divide-[#f7f7f7] text-xs sm:text-[13px] mb-6">
              <div className="flex items-center justify-between py-3.5">
                <span className="font-bold text-[#666666]">قطر لوستر :</span>
                <span className="font-black text-[#1a1a1a] tabular-nums">۳۵x۳۵x۳۰ سانتی‌متر</span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="font-bold text-[#666666]">ارتفاع لوستر :</span>
                <span className="font-black text-[#1a1a1a] tabular-nums">۳۰ سانتی‌متر</span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="font-bold text-[#666666]">وزن ناخالص :</span>
                <span className="font-black text-[#1a1a1a] tabular-nums">۲۸۰۰ گرم</span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="font-bold text-[#666666]">تعداد سرپیچ لامپ LED :</span>
                <span className="font-black text-[#1a1a1a] tabular-nums">۶ عدد</span>
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="font-bold text-[#666666]">منبع تغذیه برق :</span>
                <span className="font-black text-[#1a1a1a]">برق شهری ۲۲۰ ولت</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-11 rounded-xl bg-[#b59766] hover:bg-[#9e7e52] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>۱۵ ویژگی محصول</span>
            </button>
          </div>

        </div>

        {/* بخش نظرات کاربران (16 نظر ثبت شد) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14 border-t border-[#ececec] pt-10">
          
          {/* لیست نظرات (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#f5f5f5]">
              <div className="text-right">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#1a1a1a]">
                  نظرات کاربران درباره این محصول
                </h3>
                <span className="text-xs text-[#888888] mt-1 block">
                  ۱۶ نظر ثبت شده است
                </span>
              </div>
              
              <button
                type="button"
                className="h-10 px-4 rounded-xl border border-[#ebdcb9] hover:bg-[#2b2b2b] text-[#2b2b2b] hover:text-white transition-all text-xs font-bold cursor-pointer"
              >
                + افزودن نظر
              </button>
            </div>

            {/* نظر اول */}
            <div className="bg-white rounded-[22px] border border-[#ece6da]/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#ebdcb9]/40 flex items-center justify-center text-[#b59766] font-bold text-sm">
                    سا
                  </div>
                  <div className="text-right">
                    <span className="block text-xs sm:text-sm font-extrabold text-[#1a1a1a]">ساشا آذرخش آلوچه</span>
                    <span className="block text-[11px] text-[#888888] mt-1 tabular-nums">تاریخ نظر دهی: ۱۳ شهریور ماه ۱۴۰۳</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#b59766] text-white text-[11px] font-bold px-2 py-1 rounded-lg tabular-nums">
                    ⭐ ۴.۳
                  </span>
                  <span className="bg-[#f5f5f5] text-[#555] text-[11px] font-semibold px-2.5 py-1 rounded-lg tabular-nums">
                    ساعت ۱۴:۲۵
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-[13px] leading-7 text-[#555555] text-justify pl-1">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
              </p>
            </div>

            {/* نظر دوم */}
            <div className="bg-white rounded-[22px] border border-[#ece6da]/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#ebdcb9]/40 flex items-center justify-center text-[#b59766] font-bold text-sm">
                    پر
                  </div>
                  <div className="text-right">
                    <span className="block text-xs sm:text-sm font-extrabold text-[#1a1a1a]">پرهام رحیمی</span>
                    <span className="block text-[11px] text-[#888888] mt-1 tabular-nums">تاریخ نظر دهی: ۲۴ آبان ماه ۱۴۰۳</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#b59766] text-white text-[11px] font-bold px-2 py-1 rounded-lg tabular-nums">
                    ⭐ ۴.۳
                  </span>
                  <span className="bg-[#f5f5f5] text-[#555] text-[11px] font-semibold px-2.5 py-1 rounded-lg tabular-nums">
                    ساعت ۱۴:۲۵
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-[13px] leading-7 text-[#555555] text-justify pl-1">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
              </p>
            </div>

          </div>

          {/* آمار و فیلترهای نظرات (Span 5) */}
          <div className="lg:col-span-5 bg-white rounded-[22px] border border-[#ece6da]/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#f5f5f5] pb-4.5">
              <div className="text-right">
                <span className="text-3xl font-black text-[#1a1a1a] tabular-nums">۴.۷</span>
                <span className="text-sm font-bold text-[#666] mr-1.5">امتیاز نهایی</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                خیلی خوب
              </span>
            </div>

            {/* پروگرس بارهای امتیازات */}
            <div className="space-y-4 text-xs sm:text-[13px]">
              
              {/* وضعیت محصول */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#555]">وضعیت محصول</span>
                  <span className="font-black text-[#1a1a1a] tabular-nums">۴.۵</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f2f2f2] overflow-hidden">
                  <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              {/* موقعیت مکانی و دسترسی */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#555]">موقعیت مکانی و دسترسی</span>
                  <span className="font-black text-[#1a1a1a] tabular-nums">۴.۲</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f2f2f2] overflow-hidden">
                  <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              {/* امکانات کالا */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#555]">امکانات کالا</span>
                  <span className="font-black text-[#1a1a1a] tabular-nums">۳.۷</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f2f2f2] overflow-hidden">
                  <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: '74%' }} />
                </div>
              </div>

              {/* رعایت پروتکل‌های بسته بندی */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#555]">رعایت پروتکل های بسته بندی</span>
                  <span className="font-black text-[#1a1a1a] tabular-nums">۴.۹</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f2f2f2] overflow-hidden">
                  <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              {/* به موقع رساندن کالا */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#555]">به موقع رساندن کالا</span>
                  <span className="font-black text-[#1a1a1a] tabular-nums">۴.۸</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f2f2f2] overflow-hidden">
                  <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              {/* کیفیت ارسال کالا */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#555]">کیفیت ارسال کالا</span>
                  <span className="font-black text-[#1a1a1a] tabular-nums">۳.۳</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f2f2f2] overflow-hidden">
                  <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              {/* خدمات سرویس دهی */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#555]">خدمات سرویس دهی</span>
                  <span className="font-black text-[#1a1a1a] tabular-nums">۴.۴</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f2f2f2] overflow-hidden">
                  <div className="h-full bg-[#2b2b2b] rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* محصولات مشابه */}
        <div className="border-t border-[#ececec] pt-10">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#1a1a1a]">
              محصولات مشابه
            </h3>
            
            <button
              type="button"
              className="text-xs font-bold text-[#b59766] hover:underline"
            >
              مشاهده محصولات
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {SALEHI_COLLECTION_PRODUCTS.slice(0, 4).map((pItem) => {
              return (
                <div
                  key={`sim-${pItem.id}`}
                  className="bg-white rounded-2xl border border-[#e8e8e8] p-3.5 pb-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="w-full h-44 rounded-xl bg-[#f5f5f5] p-2 flex items-center justify-center overflow-hidden mb-3">
                      <TransparentProductImage
                        src={pItem.image}
                        alt={pItem.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <h4 className="text-sm font-extrabold text-[#1e1e1e] truncate">{pItem.name}</h4>
                    <p className="text-[11px] text-[#757575] truncate mt-1">{pItem.subtitle}</p>
                    <p className="text-xs font-bold text-[#1e1e1e] mt-2.5 tabular-nums">
                      {toPersianDigits(pItem.priceFormatted || '۱۲,۵۰۰,۰۰۰ تومان')}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#f5f5f5] flex items-center justify-between gap-2 text-[10px]">
                    <span className="text-[#77] tabular-nums">کد: {pItem.productCode}</span>
                    <button
                      type="button"
                      className="bg-[#262626] hover:bg-[#b59766] text-white px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      مشاهده و خرید
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

/**
 * مودال تبدیل خودکار هر عکس محصول جدید به مدل سه‌بعدی (Auto Photo-to-3D Studio)
 */
interface CustomProduct3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewProduct: (newProduct: ChandelierProduct) => void;
}

export const CustomProduct3DModal: React.FC<CustomProduct3DModalProps> = ({
  isOpen,
  onClose,
  onAddNewProduct,
}) => {
  const [name, setName] = useState('لوستر سفارشی کلکسیون صالحی');
  const [price, setPrice] = useState('۱۴,۸۰۰,۰۰۰ تومان');
  const [previewUrl, setPreviewUrl] = useState<string>(
    GENERATED_IMAGES.resansRoses
  );
  const [finish, setFinish] = useState<FinishType>('original');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveToCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: ChandelierProduct = {
      id: `custom-${Date.now()}`,
      name: name.trim() || 'لوستر سفارشی جدید',
      subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
      priceFormatted: price,
      priceNumeric: 14800000,
      productCode: '۱۲۸۹۸۲',
      image: previewUrl,
      modelType: 'ristani',
      defaultFinish: finish,
      categoryKey: 'all',
      dimensions: 'قطر ۸۵ سانتی‌متر × ارتفاع ۹۵ سانتی‌متر',
      branchesCount: '۱۲ شاخه سفارشی',
      bodyMaterial: 'برنز خالص ریخته‌گری با آبکاری سفارشی',
      warranty: '۱۰ سال ضمانت کتبی گالری لوستر اکبر صالحی',
      description:
        'این محصول به صورت خودکار توسط موتور سه‌بعدی‌ساز گالری اکبر صالحی به مدل سه‌بعدی تعاملی تبدیل شده و قابلیت تغییر رنگ دلخواه دارد.',
    };
    onAddNewProduct(newProd);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#fcfbf9] rounded-3xl border border-[#e5dec9] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-white hover:bg-[#222] text-[#222] hover:text-white border border-[#e5dec9] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* پیش‌نمایش سه‌بعدی زنده از عکس آپلود شده */}
        <div className="lg:col-span-7 bg-[#f6f4ee] min-h-[380px] lg:min-h-[520px]">
          <Chandelier3DViewer
            imageUrl={previewUrl}
            modelType="ristani"
            initialFinish={finish}
            onFinishChange={(fin) => setFinish(fin)}
            initialTheme="light"
            className="w-full h-full min-h-[380px] lg:min-h-[520px]"
          />
        </div>

        {/* فرم آپلود عکس محصول و افزودن به صفحه */}
        <form
          onSubmit={handleSaveToCatalog}
          className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-4"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcf8f0] border border-[#e3d2b4] text-[#8c6d3b] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تبدیل خودکار هر عکس محصول به مدل سه‌بعدی (Auto 3D)</span>
            </div>

            <h3 className="text-lg font-bold text-[#222222]">
              افزودن محصول جدید و ساخت خودکار 3D
            </h3>
            <p className="text-xs text-[#666666] leading-6">
              کافیست تصویر هر لوستر یا آباژور را انتخاب کنید؛ سیستم به صورت خودکار
              پس‌زمینه را حذف کرده، مدل سه‌بعدی برجسته دقیق همان محصول را می‌سازد و
              امکان تغییر رنگ را فعال می‌کند.
            </p>

            {/* دکمه آپلود تصویر */}
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#cbb692] rounded-2xl bg-[#faf8f3] hover:bg-[#f4efe4] transition-colors cursor-pointer text-center">
              <Upload className="w-6 h-6 text-[#b59766] mb-2" />
              <span className="text-xs font-bold text-[#222222]">
                انتخاب تصویر محصول (JPG / PNG)
              </span>
              <span className="text-[11px] text-[#888888] mt-1">
                بلافاصله در کادر روبرو به مدل سه‌بعدی تبدیل می‌شود
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                نام محصول:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e2ddd2] text-xs focus:outline-none focus:border-[#b59766]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                قیمت محصول:
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e2ddd2] text-xs focus:outline-none focus:border-[#b59766]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#222222] hover:bg-[#b59766] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            افزودن این محصول سه‌بعدی به لیست محصولات سایت
          </button>
        </form>
      </div>
    </div>
  );
};

interface StoryModalProps {
  story: StoryItem | null;
  stories?: StoryItem[];
  allProducts?: ChandelierProduct[];
  onClose: () => void;
  onSelectStory?: (story: StoryItem) => void;
  onOpenProduct?: (product: ChandelierProduct) => void;
}

/**
 * تبدیل ثانیه به فرمت تایمر فارسی (مثلاً ۰۰:۴۵ یا ۰۱:۰۵)
 */
const formatPersianTimer = (totalSeconds: number): string => {
  const safeSec = Math.max(0, totalSeconds);
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  const padPersian = (n: number) =>
    n
      .toString()
      .padStart(2, '0')
      .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
  return `${padPersian(mins)}:${padPersian(secs)}`;
};

/**
 * تشخیص اینکه آیا تصویر مربوط به عکس استودیویی محصول است یا خیر
 */
const isStudioProductImage = (url: string): boolean => {
  return (
    url === GENERATED_IMAGES.shahMalakeh ||
    url === GENERATED_IMAGES.crystaliCherub ||
    url === GENERATED_IMAGES.resansRoses ||
    url === GENERATED_IMAGES.shakheh12 ||
    url === GENERATED_IMAGES.ristani ||
    url === GENERATED_IMAGES.crystaliGold
  );
};

/**
 * آیکون خاکستری کوه و خورشید در کارت‌های کناری هنگام لود شدن استوری (دقیقاً مطابق image.png و تصویر اول)
 */
const SideCardPlaceholderIcon: React.FC = () => (
  <svg
    viewBox="0 0 64 56"
    fill="none"
    className="w-14 h-14 text-[#616161]"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* خورشید دایره‌ای در بالا-چپ */}
    <circle cx="19.5" cy="14.5" r="5.8" stroke="currentColor" strokeWidth="3.8" />
    {/* کانتور بسته کوه دو قله‌ای با گوشه‌های گرد بدون کادر مربعی دور آن */}
    <path
      d="M14 47 H50 C56.5 47 58.5 38.5 54.5 33.5 L45 20.5 C42.5 17.5 39 17.5 36.5 20.5 L28.8 30.5 C27.5 32 25.8 32 24.5 30.8 L22.8 29 C20.5 26.7 17.8 26.7 15.5 29 L9.5 35.5 C5.5 40 7.5 47 14 47 Z"
      stroke="currentColor"
      strokeWidth="3.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * پاپ‌آپ استوری دقیقاً مطابق طرح‌های ارسالی:
 * - حالت لود شدن استوری (دقیقاً مطابق عکس اول: کارت سفید وسط با لوگوی Chandelier AKBAR SALEHI و وکتورهای Vector2ltr و Vector2rtl + ۴ کارت خاکستری در طرفین با آیکون کوه و خورشید image.png)
 * - تایمر اختصاصی مجزا برای هر استوری و هر اسلاید
 * - استوری تک عکسی تمام‌صفحه با عکس‌های زیبا بدون نوار مشکی پایین
 * - استوری تک محصولی و چند محصولی با نمایش کامل تصویر محصول
 */
export const StorySpotlightModal: React.FC<StoryModalProps> = ({
  story,
  stories = STORY_ITEMS,
  allProducts = SALEHI_COLLECTION_PRODUCTS,
  onClose,
  onSelectStory,
  onOpenProduct,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [activeSegment, setActiveSegment] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(45);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const videoElementRef = React.useRef<HTMLVideoElement | null>(null);

  // غیرفعال کردن اسکرول کل سایت هنگام باز بودن استوری
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // مدیریت لود شدن استوری (نمایش کارت سفید لودینگ مطابق عکس اول)
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(true);
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);
  const [showAllMultiProducts, setShowAllMultiProducts] =
    useState<boolean>(false);

  // کنترل‌های ویدیو
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

  const activeList = stories.length > 0 ? stories : STORY_ITEMS;

  const currentIndex = story
    ? activeList.findIndex((item) => item.id === story.id)
    : -1;

  const getStoryAtOffset = (offset: number): StoryItem => {
    const total = activeList.length;
    const baseIdx = currentIndex >= 0 ? currentIndex : 0;
    const targetIdx = (((baseIdx + offset) % total) + total) % total;
    return activeList[targetIdx];
  };

  const handlePrevStory = () => {
    if (!onSelectStory || currentIndex < 0) return;
    onSelectStory(getStoryAtOffset(-1));
  };

  const handleNextStory = () => {
    if (!onSelectStory || currentIndex < 0) {
      onClose();
      return;
    }
    onSelectStory(getStoryAtOffset(1));
  };

  // ساخت پویای اسلایدهای مجزا برای استوری‌ها بر اساس تایپ (محصول‌دار، ساده تصویری، ویدیویی)
  const effectiveSlides = React.useMemo(() => {
    if (!story) return [];
    if (story.storyType === 'multi-product' && story.products && story.products.length > 0) {
      return story.products.map((prod) => ({
        id: prod.id,
        type: 'single-product' as const,
        title: prod.name,
        subtitle: `قیمت : ${prod.price}`,
        mediaUrl: prod.image,
        durationSeconds: 10,
        products: [prod],
      }));
    }
    return story.slides || [{
      id: story.id,
      type: story.storyType || 'single-product',
      title: story.fullTitle,
      subtitle: story.subtitle,
      mediaUrl: story.mediaUrl || story.image,
      videoUrl: story.videoUrl || '',
      durationSeconds: 10,
      products: story.products || []
    }];
  }, [story]);

  const handlePrevSlideOrStory = () => {
    if (activeSegment > 0) {
      setActiveSegment((seg) => seg - 1);
      return;
    }
    handlePrevStory();
  };

  const handleNextSlideOrStory = () => {
    if (activeSegment < effectiveSlides.length - 1) {
      setActiveSegment((seg) => seg + 1);
      return;
    }
    handleNextStory();
  };

  // تعیین اسلاید فعال
  const currentSlide = effectiveSlides[activeSegment] || null;

  // زمان اختصاصی هر استوری / اسلاید - استاندارد ۱۰ ثانیه‌ای اینستاگرام (۱۰ ثانیه)
  const slideDurationSeconds = 10;

  // ریست وضعیت و نمایش حالت لودینگ هنگام باز شدن یا عوض شدن استوری
  useEffect(() => {
    if (!story) return;
    setActiveSegment(0);
    setProgress(0);
    const initialDur = 10;
    setRemainingSeconds(initialDur);
    setSelectedProductIdx(0);
    setShowAllMultiProducts(false);
    setIsVideoPlaying(true);

    // نمایش استوری لودینگ مطابق عکس اول با زمان بیشتر هنگام باز شدن یا تعویض استوری
    setIsMediaLoading(true);
    const loadDelay = story.simulateLoading ? 3800 : 2500;
    const t = window.setTimeout(() => {
      setIsMediaLoading(false);
    }, loadDelay);
    return () => window.clearTimeout(t);
  }, [story?.id]);

  // به‌روزرسانی تایمر اختصاصی هنگام تغییر اسلاید در یک استوری
  useEffect(() => {
    if (!story) return;
    setProgress(0);
    setRemainingSeconds(slideDurationSeconds);
    setSelectedProductIdx(0);
    setShowAllMultiProducts(false);
  }, [activeSegment, slideDurationSeconds]);

  const effectiveType: StorySlideType =
    currentSlide?.type || story?.storyType || 'single-product';

  // لیست محصولات مربوط به این استوری (فقط برای تایپ محصول‌دار نمایش داده می‌شود؛ در تایپ ساده و ویدیویی مخفی است)
  const effectiveProducts: StoryProductAttachment[] = React.useMemo(() => {
    if (!story) return [];
    if (effectiveType === 'image-only' || effectiveType === 'video') {
      return [];
    }
    if (currentSlide?.products && currentSlide.products.length > 0) {
      return currentSlide.products;
    }
    if (story.products && story.products.length > 0) {
      return story.products;
    }
    const catalogPool =
      allProducts && allProducts.length > 0
        ? allProducts
        : SALEHI_COLLECTION_PRODUCTS;
    const matchedProd = story.linkedProductKey
      ? catalogPool.find(
          (p) =>
            p.id === story.linkedProductKey ||
            p.productCode === story.linkedProductKey
        )
      : null;

    if (matchedProd) {
      return [
        {
          id: matchedProd.id,
          name: matchedProd.name,
          price: matchedProd.priceFormatted,
          image: matchedProd.image,
          productCode: matchedProd.productCode,
          modelType: matchedProd.modelType,
          finish: matchedProd.defaultFinish,
        },
      ];
    }

    return [
      {
        id: story.linkedProductKey || story.id,
        name: story.fullTitle || story.title,
        price: story.price || '۱۲,۵۰۰,۰۰۰ تومان',
        image: story.productImage || story.thumbnailImage || story.image,
      },
    ];
  }, [story, effectiveType, currentSlide, allProducts]);

  const safeProductIdx =
    effectiveProducts.length > 0
      ? Math.min(selectedProductIdx, effectiveProducts.length - 1)
      : 0;
  const activeProductAttachment = effectiveProducts[safeProductIdx] || null;

  // تصویر اصلی که در مرکز استوری نمایش داده می‌شود
  const activeMediaUrl =
    currentSlide?.mediaUrl ||
    story?.mediaUrl ||
    story?.image ||
    GENERATED_IMAGES.storyPortraitRustic;

  const activeVideoUrl =
    (currentSlide as any)?.videoUrl ||
    story?.videoUrl ||
    (effectiveType === 'video'
      ? 'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4'
      : '');

  useEffect(() => {
    const vid = videoElementRef.current;
    if (!vid || effectiveType !== 'video') return;
    if (isVideoPlaying && !isPaused && !isMediaLoading) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isVideoPlaying, isPaused, isMediaLoading, effectiveType, activeVideoUrl]);

  // پشتیبانی از درگ افقی ردیف محصولات در استوری چندمحصولی
  const multiProdScrollRef = React.useRef<HTMLDivElement | null>(null);
  const isDraggingMultiRef = React.useRef(false);
  const hasDraggedMultiRef = React.useRef(false);
  const dragStartXMultiRef = React.useRef(0);
  const dragStartScrollLeftMultiRef = React.useRef(0);

  const handleMultiMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!multiProdScrollRef.current) return;
    isDraggingMultiRef.current = true;
    hasDraggedMultiRef.current = false;
    dragStartXMultiRef.current = e.pageX - multiProdScrollRef.current.offsetLeft;
    dragStartScrollLeftMultiRef.current = multiProdScrollRef.current.scrollLeft;
  };

  const handleMultiMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingMultiRef.current || !multiProdScrollRef.current) return;
    const x = e.pageX - multiProdScrollRef.current.offsetLeft;
    const walk = x - dragStartXMultiRef.current;
    if (Math.abs(walk) > 5) {
      hasDraggedMultiRef.current = true;
    }
    multiProdScrollRef.current.scrollLeft =
      dragStartScrollLeftMultiRef.current - walk;
  };

  const handleMultiMouseUpOrLeave = () => {
    isDraggingMultiRef.current = false;
  };

  // تایمر اختصاصی هر استوری (هر استوری بر اساس durationSeconds خودش شمارش معکوس دارد)
  useEffect(() => {
    if (!story || isPaused || isMediaLoading) return;
    if (effectiveType === 'video' && !isVideoPlaying) return;

    const stepPer100Ms = 100 / (slideDurationSeconds * 10);

    const progressTimer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return Math.min(100, prev + stepPer100Ms);
      });
    }, 100);

    const secTimer = window.setInterval(() => {
      setRemainingSeconds((s) => (s > 1 ? s - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(secTimer);
    };
  }, [
    story,
    isPaused,
    isMediaLoading,
    effectiveType,
    isVideoPlaying,
    slideDurationSeconds,
  ]);

  useEffect(() => {
    if (progress >= 100 && story && !isMediaLoading) {
      const maxSegments = effectiveSlides.length - 1;
      if (activeSegment < maxSegments) {
        setActiveSegment((seg) => seg + 1);
      } else {
        handleNextStory();
      }
    }
  }, [progress, activeSegment, isMediaLoading, effectiveSlides.length]);

  if (!story) return null;

  // ۲ استوری سمت راست و ۲ استوری سمت چپ کارت مرکزی
  const rightOuterStory = getStoryAtOffset(-2);
  const rightInnerStory = getStoryAtOffset(-1);
  const leftInnerStory = getStoryAtOffset(1);
  const leftOuterStory = getStoryAtOffset(2);

  const handleProductCardClick = (prodItem: StoryProductAttachment) => {
    if (hasDraggedMultiRef.current) {
      hasDraggedMultiRef.current = false;
      return;
    }
    if (!onOpenProduct) return;
    const catalogPool =
      allProducts && allProducts.length > 0
        ? allProducts
        : SALEHI_COLLECTION_PRODUCTS;
    const found =
      catalogPool.find(
        (p) => p.id === prodItem.id || p.productCode === prodItem.productCode
      ) ||
      catalogPool.find((p) => p.name === prodItem.name) ||
      catalogPool[0] ||
      SALEHI_COLLECTION_PRODUCTS[0];
    onClose();
    onOpenProduct({
      ...found,
      name: prodItem.name || found.name,
      priceFormatted: prodItem.price || found.priceFormatted,
      image: prodItem.image || found.image,
    });
  };

  /**
   * رندر کارت‌های کناری (در حالت لودینگ: کارت خاکستری با آیکون دقیقاً در وسط مطابق عکس ۳؛ در حالت لود شده: کارت تیره استوری)
   */
  const renderSideStoryCard = (
    sideStory: StoryItem,
    visibilityClass: string
  ) => {
    if (isMediaLoading) {
      return (
        <div
          onClick={() => onSelectStory && onSelectStory(sideStory)}
          className={`${visibilityClass} relative h-[430px] rounded-[18px] overflow-hidden bg-[#828282]/90 backdrop-blur-xs cursor-pointer shrink-0 shadow-xl`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <SideCardPlaceholderIcon />
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => onSelectStory && onSelectStory(sideStory)}
        className={`${visibilityClass} relative h-[430px] rounded-[18px] overflow-hidden bg-[#181614] cursor-pointer group shrink-0 shadow-xl`}
      >
        <img
          src={sideStory.mediaUrl || sideStory.image}
          alt={sideStory.fullTitle}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.48] group-hover:brightness-[0.65] group-hover:scale-105 transition-all duration-300"
        />

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
        {/* هدر بالا-راست کارت کناری: آواتار دایره‌ای تمام‌پر (عکس شاخص) + عنوان */}
        <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-start gap-2.5">
          <div className="w-9 h-9 rounded-full p-[1.5px] border border-[#b59766] bg-white shrink-0 overflow-hidden">
            <img
              src={sideStory.thumbnailImage || sideStory.image}
              alt={sideStory.title}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover object-center"
            />
          </div>
          <span className="text-xs font-medium text-white/90 truncate">
            {sideStory.title.replace('...', '')}
          </span>
        </div>
      </div>
    );
  };

  const mainIsStudio = isStudioProductImage(activeMediaUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 sm:bg-black/65 overflow-hidden p-0 sm:px-6"
      onClick={onClose}
    >
      {/* دکمه «بستن صفحه» بیرونی مخصوص دسکتاپ */}
      <button
        type="button"
        onClick={onClose}
        className="hidden sm:flex fixed top-6 left-8 z-50 h-10 px-5 rounded-[10px] bg-[#232323] hover:bg-[#141414] text-white text-xs font-bold items-center justify-center shadow-lg transition-colors cursor-pointer"
      >
        بستن صفحه
      </button>

      {/* ردیف ۵ کارتی استوری (۲ کارت راست + کارت بزرگ وسط + ۲ کارت چپ) */}
      <div
        className="relative w-full h-full sm:h-auto max-w-[1440px] flex items-center justify-center gap-3 sm:gap-4 lg:gap-5 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* کارت ۱ سمت راست (بیرونی) */}
        {renderSideStoryCard(rightOuterStory, 'hidden xl:block w-[235px]')}

        {/* کارت ۲ سمت راست (کنار کارت اصلی) */}
        {renderSideStoryCard(
          rightInnerStory,
          'hidden md:block w-[220px] lg:w-[245px]'
        )}

        {/* دکمه فلش راست (>) بین کارت وسط و کارت سمت راست */}
        <button
          type="button"
          onClick={handlePrevStory}
          aria-label="استوری قبلی"
          className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-white hover:bg-[#f5f5f5] text-[#222222] items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0 z-20"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>

        {/* کارت بزرگ استوری در مرکز */}
        {isMediaLoading ? (
          /* ==================== حالت لود شدن استوری (دقیقاً مطابق تصویر اول: کارت سفید با لوگوی AKBAR SALEHI و وکتورهای Vector2ltr و Vector2rtl) ==================== */
          <div className="relative w-full h-full sm:w-[375px] lg:w-[405px] sm:h-[620px] rounded-none sm:rounded-[22px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.55)] shrink-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="flex flex-col items-center justify-center select-none" dir="ltr">
              <span
                className="text-[12px] sm:text-[13px] font-semibold tracking-[0.03em] text-[#b58d53] leading-none mb-1"
              >
                Chandelier
              </span>

              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                {/* وکتور سمت چپ لوگو: Vector2ltr.png */}
                <ExactPalmetteVector
                  className="w-11 h-10 sm:w-13 sm:h-12 -mr-1 shrink-0"
                  strokeColor="#cbb592"
                  strokeWidth={1.6}
                />
                <span className="font-brand-serif text-[21px] sm:text-[25px] tracking-[0.04em] text-[#2b2b2b] font-normal uppercase leading-none">
                  AKBAR SALEHI
                </span>
                {/* وکتور سمت راست لوگو: Vector2rtl.png */}
                <ExactPalmetteVector
                  className="w-11 h-10 sm:w-13 sm:h-12 -ml-1 -scale-x-100 shrink-0"
                  strokeColor="#cbb592"
                  strokeWidth={1.6}
                />
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-[13px] font-medium text-[#4a4a4a]">
              در حال بارگذاری استوری
            </p>

            {/* سه نقطه طلایی زیر متن در حال بارگذاری استوری */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5">
              <span className="w-[5px] h-[5px] rounded-full bg-[#e2cda9] animate-pulse" />
              <span
                className="w-[5px] h-[5px] rounded-full bg-[#cba872] animate-pulse"
                style={{ animationDelay: '200ms' }}
              />
              <span
                className="w-[5px] h-[5px] rounded-full bg-[#b58c4e] animate-pulse"
                style={{ animationDelay: '400ms' }}
              />
            </div>
          </div>
        ) : (
          /* ==================== کارت استوری پس از بارگذاری ==================== */
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative w-full h-full sm:w-[375px] lg:w-[405px] sm:h-[620px] rounded-none sm:rounded-[22px] overflow-hidden bg-[#181614] shadow-[0_25px_70px_rgba(0,0,0,0.75)] shrink-0 flex flex-col justify-between"
          >
            {/* ۱. محتوای بصری استوری: ویدیو، عکس تک‌صفحه زیبا، یا تصویر کامل محصول */}
            {effectiveType === 'video' ? (
              <div className="absolute inset-0 w-full h-full bg-[#12100e] flex items-center justify-center overflow-hidden">
                <img
                  src={activeMediaUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 brightness-[0.35]"
                />

                {activeVideoUrl ? (
                  <video
                    ref={videoElementRef}
                    src={activeVideoUrl}
                    poster={story.thumbnailImage || activeMediaUrl}
                    autoPlay
                    loop
                    muted={isVideoMuted}
                    playsInline
                    className="relative z-10 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`relative z-10 w-full h-full flex items-center justify-center px-4 ${
                      effectiveProducts.length > 0
                        ? 'pt-18 pb-32'
                        : 'pt-18 pb-8'
                    }`}
                  >
                    <div
                      className={`relative w-full h-full rounded-[18px] overflow-hidden flex items-center justify-center ${
                        mainIsStudio
                          ? 'bg-[#f8f6f1] shadow-inner p-4'
                          : 'bg-black/20'
                      }`}
                    >
                      <img
                        src={activeMediaUrl}
                        alt={story.fullTitle}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${
                          mainIsStudio
                            ? 'object-contain'
                            : 'object-cover rounded-[18px]'
                        } transition-transform duration-700 ${
                          isVideoPlaying ? 'scale-[1.03]' : 'scale-100'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* دکمه‌های کنترل ویدیو (پخش/توقف و قطع/وصل صدا) */}
                <div className="absolute top-20 right-4 z-30 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVideoPlaying((p) => !p)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                    title={isVideoPlaying ? 'توقف ویدیو' : 'پخش ویدیو'}
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVideoMuted((m) => !m)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                    title={isVideoMuted ? 'وصل صدا' : 'قطع صدا'}
                  >
                    {isVideoMuted ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-[#d3b27c]" />
                    )}
                  </button>
                </div>
              </div>
            ) : effectiveType === 'image-only' ? (
              /* ==================== استوری تک عکسی (تمام‌صفحه بدون نوار مشکی پایین) ==================== */
              <img
                src={activeMediaUrl}
                alt={story.fullTitle}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : mainIsStudio ? (
              /* ==================== در صورت استفاده از عکس استودیویی به عنوان پس‌زمینه ==================== */
              <div className="absolute inset-0 w-full h-full bg-[#181614] overflow-hidden">
                <img
                  src={activeMediaUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 brightness-[0.38] pointer-events-none"
                />
                <div className="relative z-10 w-full h-full flex items-center justify-center px-3.5 pt-18 pb-32">
                  <div className="w-full h-full rounded-[18px] overflow-hidden flex items-center justify-center shadow-lg bg-[#f8f6f1] p-3 sm:p-4">
                    <img
                      src={activeMediaUrl}
                      alt={story.fullTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-[12px] transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* ==================== استوری محصول با تصویر تمام‌صفحه دقیقاً مطابق تصویر ۲ ==================== */
              <img
                src={activeMediaUrl}
                alt={story.fullTitle}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* سایه ملایم بالا برای خوانایی خطوط پیشرفت و تایمر */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/65 via-black/25 to-transparent pointer-events-none z-10" />
            {effectiveType !== 'image-only' && (
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none z-10" />
            )}

            {/* بخش بالای کارت مرکز: خطوط پیشرفت چندگانه برای سگمنت‌های هر استوری (مانند اینستاگرام) */}
            <div className="relative z-20 px-4 pt-3.5">
              <div className="flex items-center gap-1.5 w-full" dir="ltr">
                {Array.from({ length: effectiveSlides.length }).map((_, idx) => {
                  let widthPercent = 0;
                  if (idx < activeSegment) {
                    widthPercent = 100;
                  } else if (idx === activeSegment) {
                    widthPercent = progress;
                  } else {
                    widthPercent = 0;
                  }
                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSegment(idx);
                      }}
                      className="flex-1 h-[3.5px] rounded-full bg-white/30 overflow-hidden cursor-pointer"
                    >
                      <div
                        className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* ردیف هدر بالای استوری: شامل اطلاعات استوری در راست و دکمه بستن در چپ (کپسولی مطابق عکس دوم) */}
              <div className="mt-3 flex items-center justify-between" dir="rtl">
                {/* راست: آواتار استوری (عکس شاخص)، عنوان و تایمر */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full p-[1.5px] border border-[#b59766] bg-white shrink-0 overflow-hidden shadow-sm">
                    <img
                      src={story.thumbnailImage || story.image}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[12px] font-bold text-white leading-tight drop-shadow-sm">
                      {(currentSlide?.title || story.title).replace('...', '')}
                    </span>
                    <span className="text-[10px] text-white/80 font-medium tabular-nums drop-shadow-sm mt-0.5">
                      زمان باقی‌مانده : {formatPersianTimer(remainingSeconds)}
                      {effectiveSlides.length > 1
                        ? ` • استوری ${(activeSegment + 1).toLocaleString('fa-IR')} از ${effectiveSlides.length.toLocaleString('fa-IR')}`
                        : ''}
                    </span>
                  </div>
                </div>

                {/* چپ: دکمه کپسولی بستن صفحه مخصوص موبایل و دسکتاپ دقیقاً مطابق عکس دوم فیدما */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="h-8 px-4 rounded-full bg-black/40 hover:bg-black/60 text-white text-[11.5px] font-bold flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/10 shadow-xs"
                >
                  بستن صفحه
                </button>
              </div>
            </div>

            {/* نواحی کلیک چپ و راست روی عکس برای ورق زدن سریع */}
            <div className="relative z-10 flex-1 grid grid-cols-2">
              <div
                onClick={handlePrevSlideOrStory}
                className="h-full cursor-pointer"
                title="استوری قبلی"
              />
              <div
                onClick={handleNextSlideOrStory}
                className="h-full cursor-pointer"
                title="استوری بعدی"
              />
            </div>

            {/* بخش پایین کارت وسط: نمایش کارت‌های سفید محصول (تک‌محصول یا چندمحصولی افقی دقیقاً مطابق تصویر ۲) */}
            {effectiveType !== 'image-only' &&
              effectiveProducts.length > 0 && (
                <div
                  className="relative z-20 pb-3.5 pt-2"
                  dir="rtl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {effectiveProducts.length > 1 ? (
                    /* ==================== حالت استوری چند محصوله دقیقاً مطابق تصویر ۲ (کارت‌های سفید کنار هم با قابلیت اسکرول افقی) ==================== */
                    <div
                      ref={multiProdScrollRef}
                      onMouseDown={handleMultiMouseDown}
                      onMouseMove={handleMultiMouseMove}
                      onMouseUp={handleMultiMouseUpOrLeave}
                      onMouseLeave={handleMultiMouseUpOrLeave}
                      className="flex items-center gap-2.5 overflow-x-auto pr-3.5 pl-3.5 select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {effectiveProducts.map((prod, idx) => (
                        <div
                          key={prod.id + idx}
                          onClick={() => handleProductCardClick(prod)}
                          className="w-[235px] sm:w-[258px] shrink-0 bg-white rounded-[14px] p-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.35)] flex items-center justify-start gap-3 cursor-pointer hover:scale-[1.01] transition-transform"
                        >
                          <div className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-[10px] bg-[#f4f4f4] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              draggable={false}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0 text-right">
                            <h5 className="text-[13px] sm:text-[13.5px] font-bold text-[#141414] truncate">
                              {prod.name}
                            </h5>
                            <p className="text-[11px] sm:text-[11.5px] font-medium text-[#2b2b2b] mt-1.5 tabular-nums truncate">
                              قیمت : {prod.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* ==================== حالت استوری تک محصول ==================== */
                    activeProductAttachment && (
                      <div className="px-3.5">
                        <div
                          onClick={() =>
                            handleProductCardClick(activeProductAttachment)
                          }
                          className="w-full bg-white rounded-[14px] p-2.5 sm:p-3 shadow-[0_10px_28px_rgba(0,0,0,0.35)] flex items-center justify-start gap-3.5 cursor-pointer hover:scale-[1.01] transition-transform"
                        >
                          <div className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-[10px] bg-[#f4f4f4] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={activeProductAttachment.image}
                              alt={activeProductAttachment.name}
                              referrerPolicy="no-referrer"
                              draggable={false}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0 text-right">
                            <h5 className="text-[13px] sm:text-[14px] font-bold text-[#141414] truncate">
                              {activeProductAttachment.name}
                            </h5>
                            <p className="text-[11.5px] sm:text-[12px] font-medium text-[#2b2b2b] mt-1.5 tabular-nums">
                              قیمت : {activeProductAttachment.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        )}

        {/* دکمه فلش چپ (<) بین کارت وسط و کارت سمت چپ */}
        <button
          type="button"
          onClick={handleNextStory}
          aria-label="استوری بعدی"
          className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-white/75 hover:bg-white text-[#222222] items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 z-20"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>

        {/* کارت ۱ سمت چپ (کنار کارت اصلی) */}
        {renderSideStoryCard(
          leftInnerStory,
          'hidden md:block w-[220px] lg:w-[245px]'
        )}

        {/* کارت ۲ سمت چپ (بیرونی) */}
        {renderSideStoryCard(leftOuterStory, 'hidden xl:block w-[235px]')}
      </div>
    </div>
  );
};

interface ArticleModalProps {
  article: MagazineArticle | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
}) => {
  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fcfbf9] rounded-3xl border border-[#e5dec9] overflow-hidden shadow-2xl p-6 md:p-8 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#9c8253] font-medium">
            مجله تخصصی لوستر اکبر صالحی · {article.date}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f4f3ef] hover:bg-[#2b2b2b] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <img
          src={article.image}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-60 object-cover rounded-2xl mb-5"
        />

        <h3 className="text-xl font-bold text-[#2b2b2b] mb-4">
          {article.title}
        </h3>
        <div className="space-y-3 text-xs md:text-sm leading-7 text-[#4f4a42] text-justify">
          <p>{article.excerpt}</p>
          {article.fullContent.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onShowToast?: (
    type: AppToast['type'],
    title: string,
    message: string,
    onComplete?: () => void
  ) => void;
}

/**
 * آیکون سطل زباله قرمز برای دکمه حذف محصول در سبد خرید (دقیقاً مطابق فیگما)
 */
const CartTrashIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.33 16.5H13.66"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12.5H14.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون سبد خرید با تیک تایید برای دکمه «تسویه حساب نهایی» (دقیقاً مطابق فیگما)
 */
const BagTickIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.62 16L11.12 17.5L14.37 14.5"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.81 2L5.19 5.63"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.19 2L18.81 5.63"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 7.85C2 6 2.99 5.85 4.22 5.85H19.78C21.01 5.85 22 6 22 7.85C22 10 21.01 9.85 19.78 9.85H4.22C2.99 9.85 2 10 2 7.85Z"
      stroke="currentColor"
      strokeWidth="1.85"
    />
    <path
      d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
    />
  </svg>
);

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onClearCart,
  onShowToast,
}) => {
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<CartItem | null>(
    null
  );
  const deleteAttemptCountRef = useRef(0);
  const lastSeenTotalCountRef = useRef<number>(0);
  const updateTimerRef = useRef<number | null>(null);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product.priceNumeric || 0) * item.quantity,
    0
  );
  const hasMultiQtyItem = items.some((item) => item.quantity > 1);

  const triggerPriceUpdateAnimation = () => {
    if (updateTimerRef.current) {
      window.clearTimeout(updateTimerRef.current);
    }
    setIsUpdatingPrices(true);
    updateTimerRef.current = window.setTimeout(() => {
      setIsUpdatingPrices(false);
      updateTimerRef.current = null;
    }, 1150);
  };

  useEffect(() => {
    if (!isOpen) {
      setPendingDeleteItem(null);
      setIsCheckingOut(false);
      setIsUpdatingPrices(false);
      if (updateTimerRef.current) {
        window.clearTimeout(updateTimerRef.current);
        updateTimerRef.current = null;
      }
      return;
    }

    // اگر تعداد محصولات افزایش پیدا کرده باشد یا محصولی بیش از ۱ عدد در سبد باشد، هنگام باز شدن یا تغییر، حالت بروزرسانی سه نقطه (•••) نمایش داده شود
    if (
      items.length > 0 &&
      (totalCount !== lastSeenTotalCountRef.current || hasMultiQtyItem)
    ) {
      lastSeenTotalCountRef.current = totalCount;
      triggerPriceUpdateAnimation();
    } else {
      lastSeenTotalCountRef.current = totalCount;
    }
  }, [isOpen, totalCount, items.length, hasMultiQtyItem]);

  if (!isOpen) return null;

  const formatItemTotalPrice = (product: ChandelierProduct, quantity: number) => {
    if (quantity <= 1) return product.priceFormatted;
    const totalNumeric = (product.priceNumeric || 12500000) * quantity;
    return `${totalNumeric.toLocaleString('fa-IR').replace(/٬/g, ',')} تومان`;
  };

  const handleIncrementItemQty = (productId: string) => {
    onUpdateQty(productId, 1);
    triggerPriceUpdateAnimation();
  };

  const handleFinalCheckout = () => {
    if (isCheckingOut || isUpdatingPrices) return;
    setPendingDeleteItem(null);
    setIsCheckingOut(true);

    // ثبت سفارش در جدول orders دیتابیس PostgreSQL
    fetch('/api/public/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'مشتری آنلاین سایت',
        customerPhone: '۰۹۱۲۰۷۵۹۴۱۹',
        totalAmountFormatted: `${toPersianDigits(totalPrice.toLocaleString('en-US'))} تومان`,
        totalAmountNumeric: totalPrice,
        itemsJson: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          priceFormatted: item.product.priceFormatted,
        })),
      }),
    }).catch(() => {});

    if (onShowToast) {
      onShowToast(
        'cart-checkout-redirect',
        'در حال انتقال به صفحه (خرید)',
        'مشتری عزیز چند لحظه منتظر بمانید تا ارتباط برقرار شود.',
        () => {
          setIsCheckingOut(false);
          setOrderSubmitted(true);
          onClearCart();
        }
      );
    } else {
      setTimeout(() => {
        setIsCheckingOut(false);
        setOrderSubmitted(true);
        onClearCart();
      }, 3600);
    }
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteItem) return;
    const itemToDelete = pendingDeleteItem;
    const code = itemToDelete.product.productCode;
    const attempt = deleteAttemptCountRef.current;
    deleteAttemptCountRef.current += 1;

    setPendingDeleteItem(null);

    // در تلاش‌های زوج (اولین حذف و پس از تلاش مجدد) حذف با موفقیت انجام می‌شود؛ در تلاش فرد خطای عدم حذف نمایش داده می‌شود تا هر دو حالت قابل مشاهده باشد
    if (attempt % 2 === 1) {
      onShowToast?.(
        'cart-delete-error',
        'خطایی رخ داد!',
        `محصول کد ${code} حذف نشد مجدد تلاش نمایید.`
      );
      return;
    }

    onUpdateQty(itemToDelete.product.id, -itemToDelete.quantity);
    onShowToast?.(
      'cart-delete-success',
      'با موفقیت حذف شد',
      `محصول کد ${code} شما از سبد خرید حذف شد.`
    );
  };

  const renderGreenBadgeDots = () => (
    <div className="flex items-center justify-center gap-1.5 py-1 px-1" dir="ltr">
      <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]/35 animate-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60] animate-pulse [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60] animate-pulse [animation-delay:300ms]" />
    </div>
  );

  const renderPriceBoxDots = () => (
    <div className="flex items-center justify-center gap-1.5" dir="ltr">
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e]/35 animate-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e] animate-pulse [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e] animate-pulse [animation-delay:300ms]" />
    </div>
  );

  const renderCheckoutBtnDots = () => (
    <div className="flex items-center justify-center gap-1.5" dir="ltr">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse [animation-delay:300ms]" />
    </div>
  );

  const renderEmptyState = () => (
    <div className="my-auto flex flex-col items-center justify-center text-center px-4 py-10">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[78px] h-[78px] text-[#b58d58]"
      >
        <path
          d="M13.39 17.25L10.64 14.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.36 14.53L10.61 17.28"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.81 2L5.19 5.63"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.19 2L18.81 5.63"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 7.85C2 6 2.99 5.85 4.22 5.85H19.78C21.01 5.85 22 6 22 7.85C22 10 21.01 9.85 19.78 9.85H4.22C2.99 9.85 2 10 2 7.85Z"
          stroke="currentColor"
          strokeWidth="1.9"
        />
        <path
          d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>

      <h4 className="mt-5 text-[14.5px] font-bold text-[#1e1e1e]">
        سبد خرید شما خالی است!
      </h4>
      <p className="mt-2 text-[12.5px] text-[#666666] font-normal">
        در حال حاضر هیچ کالایی به سبد خود اضافه نکردید.
      </p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes cartDrawerSlideInRight {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-cart-drawer-right {
          animation: cartDrawerSlideInRight 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* ==================== ۱. نمای موبایل و تبلت (< lg) دقیقاً مطابق عکس ارسالی ==================== */}
      <div
        dir="rtl"
        className="lg:hidden fixed inset-0 top-0 bottom-[66px] z-35 bg-white flex flex-col justify-between select-none overflow-hidden"
      >
        {/* هدر بالای صفحه سبد خرید موبایل با پترن‌های طلایی و لوگوی مرکزی */}
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

        {/* بخش میانی قابل اسکرول در موبایل (بدون فاصله پایینی تا آیتم‌ها زیر دکمه چسبان تسویه حساب اسکرول شوند) */}
        <div
          className="flex-1 overflow-y-auto px-5 pt-5 pb-0 flex flex-col [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* ردیف «سبد خرید شما» و بج سبز تعداد محصول (با نمایش سه نقطه سبز هنگام بروزرسانی) */}
          <div className="pb-4 flex items-center justify-between shrink-0">
            <h3 className="text-[15.5px] font-bold text-[#1e1e1e]">
              سبد خرید شما
            </h3>
            <span className="min-w-[74px] h-[36px] px-4 rounded-[10px] bg-[#eefaf2] text-[#27ae60] text-[13px] font-bold tabular-nums flex items-center justify-center">
              {isUpdatingPrices && items.length > 0
                ? renderGreenBadgeDots()
                : `${totalCount.toLocaleString('fa-IR')} محصول`}
            </span>
          </div>

          {/* خط‌چین افقی با فاصله منظم */}
          <div
            className="w-full h-[1.5px] shrink-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to left, #dcdcdc 0, #dcdcdc 13px, transparent 13px, transparent 25px)',
            }}
          />

          {orderSubmitted ? (
            <div className="my-auto p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">
                سفارش شما با موفقیت ثبت شد
              </h4>
              <p className="text-xs text-emerald-800 leading-6">
                سفارش شما با موفقیت ثبت شد و کارشناسان گالری لوستر اکبر صالحی جهت هماهنگی ارسال و نصب با شما تماس خواهند گرفت.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderSubmitted(false);
                  onClose();
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#2b2b2b] text-white text-xs font-semibold cursor-pointer"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          ) : items.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="divide-y divide-[#efefef]">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-5">
                  {/* ردیف اول آیتم موبایل: عکس و نام و کد در راست، تعداد در چپ (با قابلیت کلیک جهت افزایش تعداد و تست بروزرسانی قیمت) */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-[66px] h-[66px] rounded-[13px] bg-[#f5f5f5] p-1.5 flex items-center justify-center shrink-0">
                        <TransparentProductImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 text-right">
                        <h4 className="text-[14.5px] font-bold text-[#1e1e1e] truncate max-w-[185px] sm:max-w-[260px]">
                          {product.name}
                        </h4>
                        <p className="text-[12px] text-[#7a7a7a] mt-1.5 tabular-nums">
                          کد محصول : {product.productCode}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleIncrementItemQty(product.id)}
                      title="افزایش تعداد محصول"
                      className="h-[34px] px-4 rounded-[9px] bg-[#f5f5f5] hover:bg-[#ececec] active:scale-95 text-[#1e1e1e] text-[13px] font-bold flex items-center justify-center tabular-nums shrink-0 transition-all cursor-pointer"
                    >
                      {quantity.toLocaleString('fa-IR')} عدد
                    </button>
                  </div>

                  {/* ردیف دوم آیتم موبایل: باکس قیمت در راست (با سه نقطه هنگام بروزرسانی) و دکمه مربعی آیکون حذف در چپ */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-[48px] rounded-[12px] bg-[#f5f5f5] border border-[#e6e6e6] flex items-center justify-center text-[14px] font-bold text-[#1e1e1e] tabular-nums">
                      {isUpdatingPrices
                        ? renderPriceBoxDots()
                        : formatItemTotalPrice(product, quantity)}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPendingDeleteItem({ product, quantity })}
                      aria-label="حذف محصول"
                      className="w-[48px] h-[48px] rounded-[12px] bg-[#ffeef0] hover:bg-[#ffdfe3] active:bg-[#ffd0d6] text-[#ff1f3d] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <CartTrashIcon className="w-[21px] h-[21px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* دکمه پایین سبد خرید در موبایل (چسبان به منوی ناوبری پایین بدون فاصله) */}
        {items.length === 0 ? (
          <div className="px-5 pb-4 pt-2 shrink-0">
            <button
              type="button"
              disabled
              className="w-full h-[50px] rounded-[12px] bg-[#f5f5f5] text-[#2b2b2b] flex items-center justify-center gap-2 text-[13.5px] font-bold cursor-default"
            >
              <OctagonCrossIcon className="w-[20px] h-[20px] text-[#2b2b2b] shrink-0" />
              <span>تسویه حساب وجود ندارد!</span>
            </button>
          </div>
        ) : (
          !orderSubmitted && (
            <button
              type="button"
              onClick={handleFinalCheckout}
              disabled={isCheckingOut || isUpdatingPrices}
              className="w-full h-[52px] rounded-none bg-[#2b2b2b] hover:bg-[#1f1f1f] active:bg-black text-white flex items-center justify-center gap-2.5 text-[15px] font-bold transition-colors cursor-pointer shrink-0"
            >
              {isCheckingOut || isUpdatingPrices ? (
                renderCheckoutBtnDots()
              ) : (
                <>
                  <BagTickIcon className="w-[22px] h-[22px] shrink-0" />
                  <span>تسویه حساب نهایی</span>
                </>
              )}
            </button>
          )
        )}
      </div>

      {/* دراور تایید حذف محصول در موبایل (خارج از کانتینر z-35 تا کاملاً روی منوی پایین قرار بگیرد) */}
      {pendingDeleteItem && (
        <div className="lg:hidden">
          <div
            onClick={() => setPendingDeleteItem(null)}
            className="fixed inset-0 z-[85] bg-black/55 animate-in fade-in duration-200"
          />
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-x-0 bottom-0 z-[90] bg-white rounded-t-[30px] px-6 pt-3.5 pb-8 shadow-[0_-12px_45px_rgba(0,0,0,0.22)] animate-slide-up select-none"
          >
            {/* دستگیره بالای دراور موبایل */}
            <div className="w-12 h-1.5 bg-[#dcdcdc] rounded-full mx-auto mb-6" />

            <h4 className="text-[16px] font-bold text-[#1e1e1e] text-right">
              آیا مطمن هستید از حذف محصول خود؟
            </h4>

            <div className="mt-3.5 text-[13px] text-[#555555] leading-[1.9] text-right">
              <p>مشتری گرامی عزیز</p>
              <p>
                در صورت تایید دکمه{' '}
                <span className="text-[#e51c39] font-bold">
                  “بله مطمن هستم”
                </span>{' '}
                محصول کد ({pendingDeleteItem.product.productCode}) از سبد خرید
                شما حذف خواهد شد.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="h-[48px] rounded-[12px] bg-white hover:bg-[#f7f7f7] active:bg-[#efefef] border border-[#dcdcdc] text-[#1e1e1e] text-[13.5px] font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                بله مطمن هستم
              </button>

              <button
                type="button"
                onClick={() => setPendingDeleteItem(null)}
                className="h-[48px] rounded-[12px] bg-[#e51c39] hover:bg-[#cc1630] active:bg-[#b8122a] text-white text-[13.5px] font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                منصرف شدم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ۲. نمای دسکتاپ (lg و بالاتر) دقیقاً مطابق عکس اول ==================== */}
      <div
        dir="rtl"
        className="hidden lg:flex fixed inset-0 z-50 justify-start bg-black/55"
        onClick={onClose}
      >
        <div
          className="w-[430px] bg-white h-full shadow-[-12px_0_45px_rgba(0,0,0,0.18)] px-7 pt-6 pb-6 flex flex-col justify-between overflow-hidden animate-cart-drawer-right select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* بخش بالایی دراور دسکتاپ: هدر لوگو و دکمه بستن + ردیف عنوان سبد خرید و خط‌چین */}
          <div className="shrink-0">
            {/* ردیف ۱: لوگوی AKBAR SALEHI در راست و دکمه فلش راست (→) در چپ */}
            <div className="flex items-center justify-between">
              <div className="text-right select-none" dir="ltr">
                <span className="block text-right text-[11px] font-semibold tracking-[0.02em] text-[#b59766] leading-tight">
                  Chandelier
                </span>
                <span className="block text-right font-brand-serif text-[23px] tracking-[0.03em] text-[#1e1e1e] font-normal uppercase leading-none mt-0.5">
                  AKBAR SALEHI
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="بستن سبد خرید"
                className="w-9 h-9 rounded-[10px] bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#292d32] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M14.43 5.93L20.5 12L14.43 18.07" />
                  <path d="M3.5 12H20.33" />
                </svg>
              </button>
            </div>

            {/* ردیف ۲: عنوان «سبد خرید شما» در راست و بج سبز تعداد محصول در چپ (با سه نقطه سبز هنگام بروزرسانی) */}
            <div className="mt-7 pb-4 flex items-center justify-between">
              <h3 className="text-[14.5px] font-bold text-[#1e1e1e]">
                سبد خرید شما
              </h3>
              <span className="min-w-[68px] h-[32px] px-3.5 rounded-[9px] bg-[#eefaf2] text-[#27ae60] text-[12px] font-bold tabular-nums flex items-center justify-center">
                {isUpdatingPrices && items.length > 0
                  ? renderGreenBadgeDots()
                  : `${totalCount.toLocaleString('fa-IR')} محصول`}
              </span>
            </div>

            {/* خط‌چین افقی با فاصله منظم مطابق طرح فیگما */}
            <div
              className="w-full h-[1.5px]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to left, #dcdcdc 0, #dcdcdc 12px, transparent 12px, transparent 22px)',
              }}
            />
          </div>

          {/* بخش میانی دراور دسکتاپ: وضعیت خالی یا لیست محصولات */}
          <div
            className="flex-1 overflow-y-auto mt-2 mb-0 flex flex-col [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {orderSubmitted ? (
              <div className="my-auto p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">
                  سفارش شما با موفقیت ثبت شد
                </h4>
                <p className="text-xs text-emerald-800 leading-6">
                  سفارش شما با موفقیت ثبت شد و کارشناسان گالری لوستر اکبر صالحی جهت هماهنگی ارسال و نصب با شما تماس خواهند گرفت.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOrderSubmitted(false);
                    onClose();
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#2b2b2b] text-white text-xs font-semibold cursor-pointer"
                >
                  بازگشت به فروشگاه
                </button>
              </div>
            ) : items.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="divide-y divide-[#efefef]">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-5">
                    {/* ردیف اول آیتم دسکتاپ: عکس و نام و کد در راست، تعداد در چپ (با قابلیت کلیک جهت افزایش تعداد و بروزرسانی قیمت) */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-[62px] h-[62px] rounded-[12px] bg-[#f5f5f5] p-1.5 flex items-center justify-center shrink-0">
                          <TransparentProductImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 text-right">
                          <h4 className="text-[13.5px] font-bold text-[#1e1e1e] truncate max-w-[190px]">
                            {product.name}
                          </h4>
                          <p className="text-[11.5px] text-[#7a7a7a] mt-1.5 tabular-nums">
                            کد محصول : {product.productCode}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleIncrementItemQty(product.id)}
                        title="افزایش تعداد محصول"
                        className="h-[28px] px-3 rounded-[7px] bg-[#f5f5f5] hover:bg-[#ececec] active:scale-95 text-[#2b2b2b] text-[11.5px] font-bold flex items-center justify-center tabular-nums shrink-0 transition-all cursor-pointer"
                      >
                        {quantity.toLocaleString('fa-IR')} عدد
                      </button>
                    </div>

                    {/* ردیف دوم آیتم دسکتاپ: باکس قیمت در راست (با سه نقطه هنگام بروزرسانی) و دکمه «حذف محصول» با آیکون در چپ */}
                    <div className="mt-3.5 flex items-center gap-2.5">
                      <div className="flex-1 h-[42px] rounded-[10px] bg-[#f7f7f7] border border-[#ebebeb] flex items-center justify-center text-[13px] font-bold text-[#1e1e1e] tabular-nums">
                        {isUpdatingPrices
                          ? renderPriceBoxDots()
                          : formatItemTotalPrice(product, quantity)}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPendingDeleteItem({ product, quantity })
                        }
                        className="h-[42px] px-3.5 rounded-[10px] bg-[#ffeef0] hover:bg-[#ffdfe3] text-[#ff1f3d] flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer shrink-0"
                      >
                        <CartTrashIcon className="w-[17px] h-[17px] shrink-0" />
                        <span>حذف محصول</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* بخش پایینی دراور دسکتاپ: تایید حذف محصول، دکمه تسویه حساب وجود ندارد، یا تسویه حساب نهایی */}
          <div className="pt-2 shrink-0 bg-white">
            {pendingDeleteItem ? (
              <div className="pt-4 border-t border-[#efefef] text-right">
                <h4 className="text-[13.5px] font-bold text-[#1e1e1e]">
                  آیا مطمن هستید از حذف محصول خود؟
                </h4>
                <p className="mt-2 text-[11.5px] text-[#555555] leading-[1.85]">
                  مشتری گرامی عزیز در صورت تایید دکمه{' '}
                  <span className="text-[#e51c39] font-bold">
                    “بله مطمن هستم”
                  </span>{' '}
                  محصول کد ({pendingDeleteItem.product.productCode}) از سبد خرید
                  شما حذف خواهد شد.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="h-[44px] rounded-[10px] bg-white hover:bg-[#f7f7f7] border border-[#e2e2e2] text-[#1e1e1e] text-[12.5px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    بله مطمن هستم
                  </button>

                  <button
                    type="button"
                    onClick={() => setPendingDeleteItem(null)}
                    className="h-[44px] rounded-[10px] bg-[#e51c39] hover:bg-[#cc1630] text-white text-[12.5px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    منصرف شدم
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <button
                type="button"
                disabled
                className="w-full h-[50px] rounded-[12px] bg-[#f5f5f5] text-[#2b2b2b] flex items-center justify-center gap-2 text-[13.5px] font-bold cursor-default"
              >
                <OctagonCrossIcon className="w-[20px] h-[20px] text-[#2b2b2b] shrink-0" />
                <span>تسویه حساب وجود ندارد!</span>
              </button>
            ) : (
              !orderSubmitted && (
                <button
                  type="button"
                  onClick={handleFinalCheckout}
                  disabled={isCheckingOut || isUpdatingPrices}
                  className="w-full h-[50px] rounded-[12px] bg-[#2b2b2b] hover:bg-[#1f1f1f] text-white flex items-center justify-center gap-2 text-[13.5px] font-bold transition-colors cursor-pointer"
                >
                  {isCheckingOut || isUpdatingPrices ? (
                    renderCheckoutBtnDots()
                  ) : (
                    <>
                      <BagTickIcon className="w-[20px] h-[20px] shrink-0" />
                      <span>تسویه حساب نهایی</span>
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * آیکون اسکن اثر انگشت مرحله اول (دقیقاً مطابق فایل finger-scan.png)
 */
const FingerScanIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 14.88C11.09 14.88 10.35 14.14 10.35 13.23V10.76C10.35 9.85 11.09 9.11 12 9.11C12.91 9.11 13.65 9.85 13.65 10.76V13.23C13.65 14.14 12.91 14.88 12 14.88Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M16.98 13.47C16.78 16.05 14.62 18.07 12 18.07C9.24 18.07 7 15.83 7 13.07V10.93C7 8.17 9.24 5.93 12 5.93C14.59 5.93 16.72 7.9 16.97 10.42"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M15 2H17C20 2 22 4 22 7V9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 9V7C2 4 4 2 7 2H9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 22H17C20 22 22 20 22 17V15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 15V17C2 20 4 22 7 22H9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون سپر تایید مرحله دوم (دقیقاً مطابق فایل shield-tick.png ارسالی در تصویر چهارم)
 */
const ShieldTickIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.49 2.23L5.5 4.11C4.35 4.54 3.41 5.9 3.41 7.12V14.55C3.41 15.73 4.19 17.28 5.14 17.99L9.44 21.2C10.85 22.26 13.17 22.26 14.58 21.2L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12C20.61 5.89 19.67 4.53 18.52 4.1L13.53 2.23C12.68 1.92 11.32 1.92 10.49 2.23Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.05 11.87L10.66 13.48L14.96 9.18"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون سپر خطا (برای خطای کد OTP در نوتیفیکیشن پایین-چپ)
 */
const ShieldCrossIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.49 2.23L5.5 4.11C4.35 4.54 3.41 5.9 3.41 7.12V14.55C3.41 15.73 4.19 17.28 5.14 17.99L9.44 21.2C10.85 22.26 13.17 22.26 14.58 21.2L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12C20.61 5.89 19.67 4.53 18.52 4.1L13.53 2.23C12.68 1.92 11.32 1.92 10.49 2.23Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.15 13.85L13.85 10.15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.85 13.85L10.15 10.15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون هشت‌ضلعی ضربدر (برای خطای فرمت شماره و فیلد ناقص در نوتیفیکیشن پایین-چپ دقیقاً مطابق تصویر دوم و پنجم)
 */
const OctagonCrossIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.1 2H14.9C15.6 2 16.5 2.4 17 2.9L21.1 7C21.6 7.5 22 8.4 22 9.1V14.9C22 15.6 21.6 16.5 21.1 17L17 21.1C16.5 21.6 15.6 22 14.9 22H9.1C8.4 22 7.5 21.6 7 21.1L2.9 17C2.4 16.5 2 15.6 2 14.9V9.1C2 8.4 2.4 7.5 2.9 7L7 2.9C7.5 2.4 8.4 2 9.1 2Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.6 14.4L14.4 9.6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.4 14.4L9.6 9.6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون ساعت (برای خطای انتظار ۱ دقیقه در نوتیفیکیشن پایین-چپ)
 */
const ClockAlertIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون ارسال مجدد کد پس از اتمام تایمر ۱ دقیقه (مطابق تصویر ششم و Mobile 14/16)
 */
const RefreshCodeIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14.89 5.08C14.02 4.82 13.06 4.65 12 4.65C7.21 4.65 3.33 8.53 3.33 13.32C3.33 18.12 7.21 22 12 22C16.79 22 20.67 18.12 20.67 13.33C20.67 11.55 20.13 9.89 19.21 8.51"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.13 5.32L13.24 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.13 5.32L12.76 7.78"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * آیکون سپر امنیت با قفل مرکزی (مطابق نوتیفیکیشن سبز Mobile 07: کد یکبار مصرف ارسال شد)
 */
const ShieldSecurityIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.49 2.23L5.5 4.11C4.35 4.54 3.41 5.9 3.41 7.12V14.55C3.41 15.73 4.19 17.28 5.14 17.99L9.44 21.2C10.85 22.26 13.17 22.26 14.58 21.2L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12C20.61 5.89 19.67 4.53 18.52 4.1L13.53 2.23C12.68 1.92 11.32 1.92 10.49 2.23Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10.8" r="1.8" stroke="currentColor" strokeWidth="1.65" />
    <path
      d="M12 12.6V15.2"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * آیکون هشت‌ضلعی چرخ‌دنده (مطابق نوتیفیکیشن قرمز Mobile 08: خطایی در بخش سیستم فنی!)
 */
const OctagonGearIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.1 2H14.9C15.6 2 16.5 2.4 17 2.9L21.1 7C21.6 7.5 22 8.4 22 9.1V14.9C22 15.6 21.6 16.5 21.1 17L17 21.1C16.5 21.6 15.6 22 14.9 22H9.1C8.4 22 7.5 21.6 7 21.1L2.9 17C2.4 16.5 2 15.6 2 14.9V9.1C2 8.4 2.4 7.5 2.9 7L7 2.9C7.5 2.4 8.4 2 9.1 2Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.65" />
    <path
      d="M12 8.2V9.2M12 14.8V15.8M8.2 12H9.2M14.8 12H15.8M9.3 9.3L10 10M14 14L14.7 14.7M14.7 9.3L14 10M10 14L9.3 14.7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * آیکون فلش بازگشت به چپ در هدر موبایل (مطابق Mobile 01 تا Mobile 16)
 */
const MobileBackArrowIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.57 5.93L3.5 12L9.57 18.07"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.5 12H3.67"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const toPersianDigits = (str: string | number): string =>
  String(str).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const toEnglishDigits = (str: string): string =>
  str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

/**
 * اعتبارسنجی شماره تلفن همراه ایران:
 * ۱. خالی نباشد
 * ۲. حداقل ۱۰ و حداکثر ۱۱ رقم باشد
 * ۳. ارقام تکراری یکسان مانند 00000 یا 00000000000 یا 11111111111 رد شوند
 * ۴. با 09 شروع شود (یا 9xx استاندارد شود به 09xx)
 * ۵. ۹ رقم بعد از 09 تکراری نباشد (مانند 09000000000 یا 09111111111)
 */
export const validateIranianPhoneNumber = (
  rawPhone: string
): { isValid: boolean; message: string; standardizedPhone: string } => {
  const clean = toEnglishDigits(rawPhone).replace(/[^\d]/g, '');

  if (!clean || clean.length === 0) {
    return {
      isValid: false,
      message: 'لطفاً شماره همراه خود را وارد کنید.',
      standardizedPhone: '',
    };
  }

  // رد کردن شماره‌های کوتاه یا اعداد ساختگی تکراری (مثل 00000, 11111, 00000000000)
  if (clean.length < 10 || /^(\d)\1+$/.test(clean)) {
    return {
      isValid: false,
      message: 'فرمت شماره صحیح نیست، لطفاً فرمت درست وارد کنید.',
      standardizedPhone: clean,
    };
  }

  let standardized = clean;
  if (clean.startsWith('9') && clean.length === 10) {
    standardized = `0${clean}`;
  } else if (clean.startsWith('989') && clean.length === 12) {
    standardized = `0${clean.slice(2)}`;
  }

  // باید دقیقا ۱۱ رقم باشد و با 09 شروع شود
  if (standardized.length !== 11 || !standardized.startsWith('09')) {
    return {
      isValid: false,
      message: 'فرمت شماره صحیح نیست، لطفاً فرمت درست وارد کنید.',
      standardizedPhone: standardized,
    };
  }

  // بررسی تکراری نبودن ۹ رقم بعدی (مانند 09000000000 یا 09111111111)
  const rest = standardized.slice(2);
  if (/^(\d)\1+$/.test(rest)) {
    return {
      isValid: false,
      message: 'شماره همراه وارد شده نامعتبر است.',
      standardizedPhone: standardized,
    };
  }

  // بررسی پیش‌شماره‌های معتبر همراه ایران (090, 091, 092, 093, 099, ...)
  const prefix3 = standardized.slice(0, 3);
  const validPrefixes = [
    '090',
    '091',
    '092',
    '093',
    '094',
    '095',
    '096',
    '097',
    '098',
    '099',
  ];
  if (!validPrefixes.includes(prefix3)) {
    return {
      isValid: false,
      message: 'فرمت شماره صحیح نیست، پیش‌شماره همراه نامعتبر است.',
      standardizedPhone: standardized,
    };
  }

  return {
    isValid: true,
    message: '',
    standardizedPhone: standardized,
  };
};

interface AuthToastItem {
  id: string;
  type:
    | 'error-octagon'
    | 'error-shield'
    | 'error-clock'
    | 'error-system'
    | 'otp-resent'
    | 'success';
  title: string;
  message: string;
}

const LocalMobileToast: React.FC<{
  toast: AuthToastItem;
  onDismiss: (id: string) => void;
  renderToastIcon: (type: AuthToastItem['type']) => React.ReactNode;
}> = ({ toast, onDismiss, renderToastIcon }) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const isGreen = toast.type === 'success' || toast.type === 'otp-resent';

  React.useEffect(() => {
    // پر شدن خط پیشرفت در ۳۸۰۰ میلی‌ثانیه به پایان می‌رسد و سپس اسلاید خروج به مدت ۴۰۰ میلی‌ثانیه آغاز می‌شود (جمعاً ۴۲۰۰ میلی‌ثانیه)
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (isClosing) {
      const dismissTimer = setTimeout(() => {
        onDismiss(toast.id);
      }, 380);
      return () => clearTimeout(dismissTimer);
    }
  }, [isClosing, onDismiss, toast.id]);

  const handleDismiss = () => {
    setIsClosing(true);
  };

  return (
    <>
      <style>{`
        @keyframes toastSlideInSpring {
          0% { transform: translateY(110%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes toastSlideOutSlow {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-toast-in {
          animation: toastSlideInSpring 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-toast-out {
          animation: toastSlideOutSlow 400ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }
        @keyframes localToastProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-local-toast-progress {
          animation: localToastProgress 3800ms linear forwards;
        }
        @keyframes localToastProgressVertical {
          0% { height: 0%; }
          100% { height: 100%; }
        }
        .animate-local-toast-progress-vertical {
          animation: localToastProgressVertical 3800ms linear forwards;
        }
      `}</style>
      <div
        onClick={handleDismiss}
        className="fixed inset-0 z-[65] bg-black/55 sm:hidden"
      />
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[30px] pt-3.5 pb-7 px-6 shadow-[0_-12px_45px_rgba(0,0,0,0.22)] sm:hidden ${
          isClosing ? 'animate-toast-out' : 'animate-toast-in'
        }`}
      >
        {/* دستگیره کپسولی بالای باتم‌شیت */}
        <div className="w-12 h-1.5 rounded-full bg-[#dcdcdc] mx-auto mb-6" />

        <div className="flex items-center justify-start gap-3.5">
          <div
            className={`w-12 h-12 rounded-[14px] border flex items-center justify-center shrink-0 ${
              isGreen
                ? 'bg-[#edfcf2] border-[#abefc6] text-[#17b26a]'
                : 'bg-[#fff0f2] border-[#ffccd3] text-[#ff1f3d]'
            }`}
          >
            {renderToastIcon(toast.type)}
          </div>

          <div className="text-right">
            <h4 className="text-[15px] font-bold text-[#1e1e1e]">
              {toast.title}
            </h4>
            <p className="text-[12.5px] text-[#555555] mt-1 leading-relaxed">
              {toast.message}
            </p>
          </div>
        </div>

        {/* نوار پیشرفت افقی پایین باتم‌شیت موبایل با رشد واقعی از راست به چپ */}
        <div className="mt-6 w-full h-[5px] bg-[#efefef] overflow-hidden rounded-full relative">
          <div
            className={`absolute right-0 h-full rounded-full animate-local-toast-progress ${
              isGreen ? 'bg-[#17b26a]' : 'bg-[#ff1f3d]'
            }`}
          />
        </div>
      </div>
    </>
  );
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (phoneNumber: string) => void;
}

/**
 * پاپ‌آپ دو مرحله‌ای ورود به حساب کاربری و تایید کد OTP
 * رسپانسیو کامل:
 * - در دسکتاپ (sm و بالاتر): مودال وسط صفحه دقیقاً مطابق طرح دسکتاپ
 * - در موبایل (زیر sm): صفحه تمام‌صفحه با هدر لوگو AKBAR SALEHI، دکمه بازگشت و باتم‌شیت نوتیفیکیشن دقیقاً مطابق Mobile 01 تا Mobile 16
 */
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const [otpDigits, setOtpDigits] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [focusedOtpIdx, setFocusedOtpIdx] = useState<number | null>(null);
  const [otpIncompleteError, setOtpIncompleteError] = useState(false);
  const [otpWrongError, setOtpWrongError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [resendClickCount, setResendClickCount] = useState(0);
  const [toasts, setToasts] = useState<AuthToastItem[]>([]);
  const loginSuccessTimeoutRef = useRef<number | null>(null);
  const hasCompletedLoginRef = useRef<boolean>(false);

  const desktopOtpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const mobileOtpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const focusOtpBox = (idx: number) => {
    if (window.innerWidth < 640) {
      mobileOtpRefs[idx].current?.focus();
    } else {
      desktopOtpRefs[idx].current?.focus();
    }
  };

  const pushToast = (
    type: AuthToastItem['type'],
    title: string,
    message: string
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, title, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  // ریست کامل فرم‌ها و شماره همراه هنگام باز یا بسته شدن مودال
  useEffect(() => {
    if (loginSuccessTimeoutRef.current) {
      window.clearTimeout(loginSuccessTimeoutRef.current);
      loginSuccessTimeoutRef.current = null;
    }
    hasCompletedLoginRef.current = false;

    if (!isOpen) {
      setStep('phone');
      setPhoneNumber('');
      setPhoneError(false);
      setIsLoading(false);
      setIsResendingOtp(false);
      setOtpDigits(['', '', '', '']);
      setFocusedOtpIdx(null);
      setOtpIncompleteError(false);
      setOtpWrongError(false);
      setSecondsLeft(60);
      setResendClickCount(0);
      setToasts([]);
    } else {
      // هنگام باز شدن مجدد پاپ‌آپ، شماره و خطاها کاملاً پاک و ریست شوند
      setStep('phone');
      setPhoneNumber('');
      setPhoneError(false);
      setIsLoading(false);
      setIsResendingOtp(false);
      setOtpDigits(['', '', '', '']);
      setFocusedOtpIdx(null);
      setOtpIncompleteError(false);
      setOtpWrongError(false);
      setSecondsLeft(60);
      setResendClickCount(0);
      setToasts([]);
    }
  }, [isOpen]);

  // تایمر شمارش معکوس ۱ دقیقه (۶۰ ثانیه) در مرحله دوم
  useEffect(() => {
    if (!isOpen || step !== 'otp' || secondsLeft <= 0) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isOpen, step, secondsLeft]);

  if (!isOpen) return null;

  const validationResult = validateIranianPhoneNumber(phoneNumber);

  const formattedDisplayPhone = (() => {
    const raw = toEnglishDigits(phoneNumber).replace(/[^\d]/g, '');
    if (!raw) return '۰۹۹۱۲۳۴۵۵۲';
    if (validationResult.standardizedPhone) {
      return toPersianDigits(validationResult.standardizedPhone);
    }
    return toPersianDigits(raw);
  })();

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    const remStr = rem < 10 ? `0${rem}` : `${rem}`;
    return toPersianDigits(`${mins}:${remStr}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = toEnglishDigits(e.target.value).replace(/[^\d]/g, '');
    setPhoneNumber(toPersianDigits(raw.slice(0, 11)));
    if (phoneError) setPhoneError(false);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const check = validateIranianPhoneNumber(phoneNumber);

    if (!check.isValid) {
      setPhoneError(true);
      pushToast(
        'error-octagon',
        'خطایی رخ داد!',
        check.message || 'فرمت شماره صحیح نیست، لطفاً فرمت درست وارد کنید.'
      );
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      setPhoneError(false);
      setIsLoading(false);
      setStep('otp');
      setOtpDigits(['', '', '', '']);
      setOtpIncompleteError(false);
      setOtpWrongError(false);
      setSecondsLeft(56);
      setResendClickCount(0);
      window.setTimeout(() => {
        focusOtpBox(0);
      }, 60);
    }, 800);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanDigit = toEnglishDigits(value).replace(/[^\d]/g, '').slice(-1);
    const persianDigit = cleanDigit ? toPersianDigits(cleanDigit) : '';

    const nextDigits = [...otpDigits] as [string, string, string, string];
    nextDigits[index] = persianDigit;
    setOtpDigits(nextDigits);
    setOtpIncompleteError(false);
    setOtpWrongError(false);

    if (persianDigit && index < 3) {
      focusOtpBox(index + 1);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      focusOtpBox(index - 1);
    }
  };

  const handleTimerOrResendClick = () => {
    if (isResendingOtp) return;

    if (secondsLeft > 0) {
      if (resendClickCount % 2 === 0) {
        pushToast(
          'error-clock',
          'خطایی رخ داد!',
          'پس از ۱ دقیقه مجدد برای دریافت کد جدید تلاش کنید.'
        );
      } else {
        pushToast(
          'error-shield',
          'خطایی رخ داد!',
          'کد OTP یکبار برایتان ارسال شده است.'
        );
      }
      setResendClickCount((c) => c + 1);
      return;
    }

    // وقتی تایمر به ۰ رسیده و کاربر روی آیکون رفرش کلیک می‌کند (مطابق Mobile 15 -> Mobile 07)
    setIsResendingOtp(true);
    window.setTimeout(() => {
      setIsResendingOtp(false);
      setSecondsLeft(56);
      setOtpDigits(['', '', '', '']);
      setOtpIncompleteError(false);
      setOtpWrongError(false);
      pushToast(
        'otp-resent',
        'کد یکبار مصرف ارسال شد',
        'کد OTP جدید به شماره همراهتان ارسال شد.'
      );
      focusOtpBox(0);
    }, 800);
  };

  const completeLoginAfterToast = (phoneToPass: string) => {
    if (hasCompletedLoginRef.current) return;
    hasCompletedLoginRef.current = true;
    if (loginSuccessTimeoutRef.current) {
      window.clearTimeout(loginSuccessTimeoutRef.current);
      loginSuccessTimeoutRef.current = null;
    }
    onLoginSuccess?.(phoneToPass);
    onClose();
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || toasts.some((t) => t.type === 'success')) return;

    const englishCode = otpDigits.map((d) => toEnglishDigits(d)).join('');

    // اگر هر ۴ رقم کامل نشده باشد (مطابق تصویر پنجم و Mobile 09/11)
    if (englishCode.length < 4) {
      setOtpIncompleteError(true);
      setOtpWrongError(false);
      pushToast(
        'error-octagon',
        'خطایی رخ داد!',
        'فیلد کد OTP شماره همراه تکمیل نشده است.'
      );
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      // با هر کد ۴ رقمی که کاربر وارد کند، ابتدا نوتیفیکیشن ورود نمایش داده شده، خط پیشرفت کامل پر می‌شود، بسته می‌شود و سپس وارد حساب کاربری می‌شود
      setIsLoading(false);
      setOtpWrongError(false);
      setOtpIncompleteError(false);
      pushToast(
        'success',
        'ورود موفقیت آمیز',
        'مشتری گرامی به پنل خود خوش آمدید!'
      );
      loginSuccessTimeoutRef.current = window.setTimeout(() => {
        completeLoginAfterToast(formattedDisplayPhone);
      }, 4200);
    }, 650);
  };

  const hasAnyOtpDigit = otpDigits.some((d) => d !== '');
  const isPhoneBtnDark =
    isLoading || phoneError || phoneNumber.trim().length > 0;
  const isOtpBtnDark = isLoading || otpWrongError || hasAnyOtpDigit;

  const activeMobileToast = toasts[toasts.length - 1] || null;

  const renderToastIcon = (type: AuthToastItem['type']) => {
    switch (type) {
      case 'success':
        return <ShieldTickIcon className="w-5 h-5" />;
      case 'otp-resent':
        return <ShieldSecurityIcon className="w-5 h-5" />;
      case 'error-octagon':
        return <OctagonCrossIcon className="w-5 h-5" />;
      case 'error-clock':
        return <ClockAlertIcon className="w-5 h-5" />;
      case 'error-system':
        return <OctagonGearIcon className="w-5 h-5" />;
      case 'error-shield':
      default:
        return <ShieldCrossIcon className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* ==================== نمای موبایل (زیر 640px) دقیقاً مطابق Mobile 01 تا Mobile 16 ==================== */}
      <div
        dir="rtl"
        className="fixed inset-0 z-50 bg-white flex flex-col justify-between px-5 pt-6 pb-6 overflow-y-auto sm:hidden"
      >
        {/* بخش بالایی صفحه موبایل */}
        <div>
          {/* هدر موبایل: سمت راست لوگوی Chandelier AKBAR SALEHI و سمت چپ دکمه بازگشت (←) */}
          <div className="flex items-center justify-between">
            <div className="text-right select-none" dir="ltr">
              <span className="block text-right font-serif text-[12px] text-[#b59766] leading-tight">
                Chandelier
              </span>
              <span className="block text-right font-serif text-[22px] tracking-[0.03em] font-medium text-[#1e1e1e] leading-none mt-0.5">
                AKBAR SALEHI
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (step === 'otp') {
                  setStep('phone');
                  setOtpIncompleteError(false);
                  setOtpWrongError(false);
                } else {
                  onClose();
                }
              }}
              aria-label="بازگشت"
              className="w-10 h-10 rounded-[12px] bg-[#f5f5f5] active:bg-[#eaeaea] flex items-center justify-center text-[#292d32] transition-colors cursor-pointer"
            >
              <MobileBackArrowIcon className="w-4 h-4" />
            </button>
          </div>

          {/* عنوان و زیرعنوان راست‌چین دقیقاً مطابق طرح موبایل */}
          <h2 className="mt-9 text-right text-[16.5px] font-bold text-[#1e1e1e]">
            {step === 'phone' ? 'ورود به حساب کاربری' : 'تایید شماره همراه'}
          </h2>
          <p className="mt-2 text-right text-[12.5px] text-[#666666] font-normal">
            {step === 'phone'
              ? 'برای ورود شماره همراه خود را وارد کنید.'
              : `کد ۴ رقمی به شماره (${formattedDisplayPhone}) ارسال شد`}
          </p>

          {step === 'phone' ? (
            /* مرحله اول موبایل (Mobile 01 - Mobile 04) */
            <form
              id="mobile-auth-phone-form"
              onSubmit={handlePhoneSubmit}
              className="mt-5"
            >
              <div
                dir="ltr"
                className={`w-full h-[50px] rounded-[12px] border bg-white px-4 flex items-center transition-colors ${
                  phoneError
                    ? 'border-[#ff1f3d]'
                    : 'border-[#e2e2e2] focus-within:border-[#2b2b2b]'
                }`}
              >
                <span className="text-[13.5px] font-medium text-[#444444] select-none shrink-0">
                  +۹۸
                </span>
                <span className="w-[1px] h-4 bg-[#e2e2e2] mx-3 shrink-0" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full h-full bg-transparent text-[14.5px] font-medium text-[#222222] focus:outline-none tabular-nums text-left"
                />
              </div>

              {/* در مرحله اول موبایل، متن قوانین و مقررات بلافاصله زیر کادر شماره قرار دارد (Mobile 01 تا 04) */}
              <p className="mt-4 text-right text-[11.5px] text-[#555555]">
                ورود شما به منزله موافقت با{' '}
                <span
                  onClick={() => {
                    onClose();
                    navigateToRoute('rule');
                  }}
                  className="text-[#b59766] font-medium cursor-pointer hover:underline"
                >
                  قوانین و مقررات
                </span>{' '}
                است.
              </p>
            </form>
          ) : (
            /* مرحله دوم موبایل (Mobile 05 - Mobile 16) */
            <form
              id="mobile-auth-otp-form"
              onSubmit={handleOtpSubmit}
              className="mt-5"
            >
              <div
                dir="ltr"
                className="flex items-center justify-between gap-2.5"
              >
                {[0, 1, 2, 3].map((idx) => {
                  const digit = otpDigits[idx];
                  const isRedBorder =
                    otpWrongError || (otpIncompleteError && !digit);
                  const isFocused = focusedOtpIdx === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => mobileOtpRefs[idx].current?.focus()}
                      className={`relative w-[52px] h-[50px] rounded-[12px] border bg-white flex items-center justify-center transition-colors cursor-text shrink-0 ${
                        isRedBorder
                          ? 'border-[#ff1f3d]'
                          : isFocused
                            ? 'border-[#2b2b2b] border-[1.5px]'
                            : 'border-[#e0e0e0]'
                      }`}
                    >
                      <input
                        ref={mobileOtpRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onFocus={() => setFocusedOtpIdx(idx)}
                        onBlur={() =>
                          setFocusedOtpIdx((prev) =>
                            prev === idx ? null : prev
                          )
                        }
                        onChange={(e) =>
                          handleOtpDigitChange(idx, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-full h-full bg-transparent text-center text-[15.5px] font-semibold text-[#222222] focus:outline-none tabular-nums"
                      />
                      {!digit && (
                        <span className="pointer-events-none absolute bottom-3.5 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-[#cccccc] rounded-full" />
                      )}
                    </div>
                  );
                })}

                {/* باکس عریض تایمر / رفرش / لودینگ ۳ نقطه در سمت راست ردیف (Mobile 05 تا Mobile 16) */}
                <button
                  type="button"
                  onClick={handleTimerOrResendClick}
                  className="flex-1 h-[50px] min-w-[84px] rounded-[12px] bg-[#efefef] active:bg-[#e4e4e4] text-[#333333] flex items-center justify-center text-[14px] font-semibold tabular-nums transition-colors cursor-pointer"
                >
                  {isResendingOtp ? (
                    /* سه نقطه تیره داخل باکس تایمر هنگام ارسال مجدد کد (Mobile 15) */
                    <div
                      className="flex items-center justify-center gap-1"
                      dir="ltr"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#777777] animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-[#222222] animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#777777] animate-pulse [animation-delay:300ms]" />
                    </div>
                  ) : secondsLeft > 0 ? (
                    <span>{formatTimer(secondsLeft)}</span>
                  ) : (
                    <RefreshCodeIcon className="w-5 h-5 text-[#292d32]" />
                  )}
                </button>
              </div>

              {/* ردیف زیر باکس‌های کد در موبایل: سمت راست متن طلایی و سمت چپ ویرایش شماره همراه */}
              <div className="mt-4 flex items-center justify-between text-[11.5px]">
                <span className="text-[#b59766] font-medium">
                  شماره همراه وارد شده اشتباه است ؟
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtpIncompleteError(false);
                    setOtpWrongError(false);
                  }}
                  className="text-[#2b2b2b] font-semibold hover:text-[#b59766] transition-colors cursor-pointer"
                >
                  ویرایش شماره همراه
                </button>
              </div>
            </form>
          )}
        </div>

        {/* بخش پایین صفحه موبایل */}
        <div className="pt-6">
          {/* در مرحله دوم موبایل، متن قوانین و مقررات بالای دکمه پایین قرار دارد (Mobile 05 تا 16) */}
          {step === 'otp' && (
            <p className="mb-3.5 text-right text-[11.5px] text-[#555555]">
              ورود شما به منزله موافقت با{' '}
              <span
                onClick={() => {
                  onClose();
                  navigateToRoute('rule');
                }}
                className="text-[#b59766] font-medium cursor-pointer hover:underline"
              >
                قوانین و مقررات
              </span>{' '}
              است.
            </p>
          )}

          <button
            type="submit"
            form={
              step === 'phone' ? 'mobile-auth-phone-form' : 'mobile-auth-otp-form'
            }
            className={`w-full h-[50px] rounded-[12px] text-[13.5px] font-semibold flex items-center justify-center transition-colors cursor-pointer ${
              (step === 'phone' ? isPhoneBtnDark : isOtpBtnDark)
                ? 'bg-[#2b2b2b] active:bg-[#1f1f1f] text-white'
                : 'bg-[#f7f7f7] text-[#1a1a1a]'
            }`}
          >
            {isLoading ? (
              <div
                className="flex items-center justify-center gap-1.5"
                dir="ltr"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/75 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-white animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/75 animate-pulse [animation-delay:300ms]" />
              </div>
            ) : step === 'phone' ? (
              'تایید و دریافت کد'
            ) : (
              'تایید و ادامه فرآیند'
            )}
          </button>
        </div>

        {/* باتم‌شیت نوتیفیکیشن موبایل (Mobile 04, 07, 08, 10, 11, 12, 13, 16) */}
        {activeMobileToast && (
          <LocalMobileToast
            key={activeMobileToast.id}
            toast={activeMobileToast}
            onDismiss={(id) => {
              const dismissed = toasts.find((t) => t.id === id);
              setToasts((prev) => prev.filter((t) => t.id !== id));
              if (dismissed?.type === 'success') {
                completeLoginAfterToast(formattedDisplayPhone);
              }
            }}
            renderToastIcon={renderToastIcon}
          />
        )}
      </div>

      {/* ==================== نمای دسکتاپ (sm و بالاتر) ==================== */}
      <div
        className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        {/* کارت اصلی پاپ‌آپ با عرض و ارتفاع بزرگ‌تر دقیقاً مطابق تصاویر فیگما */}
        <div
          dir="rtl"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[430px] min-h-[435px] bg-white rounded-[24px] px-8 sm:px-10 pt-7 pb-7 shadow-[0_24px_60px_rgba(0,0,0,0.25)] flex flex-col justify-between"
        >
          {/* دکمه بستن (×) در گوشه بالا-چپ */}
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center text-[#292d32] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-[18px] h-[18px] stroke-[2]" />
          </button>

          {/* بخش بالایی و میانی مودال */}
          <div className="mt-2">
            {/* آیکون مرحله اول (finger-scan.png) یا مرحله دوم (shield-tick.png) در کادر مربعی وسط */}
            <div className="w-[58px] h-[58px] rounded-[14px] bg-[#f5f5f5] border border-[#ebebeb] flex items-center justify-center mx-auto text-[#292d32]">
              {step === 'phone' ? (
                <FingerScanIcon className="w-7 h-7" />
              ) : (
                <ShieldTickIcon className="w-7 h-7" />
              )}
            </div>

            {/* عنوان و زیرعنوان مرحله */}
            <h2 className="mt-4 text-[17.5px] sm:text-[18.5px] font-bold text-[#1e1e1e] text-center">
              {step === 'phone' ? 'ورود به حساب کاربری' : 'تایید شماره همراه'}
            </h2>
            <p className="mt-2.5 text-[13px] sm:text-[13.5px] text-[#555555] font-normal text-center">
              {step === 'phone'
                ? 'برای ورود شماره همراه خود را وارد کنید.'
                : `کد ۴ رقمی به شماره (${formattedDisplayPhone}) ارسال شد`}
            </p>

            {/* فیلدهای ورودی بر اساس مرحله */}
            {step === 'phone' ? (
              <form
                id="auth-phone-form"
                onSubmit={handlePhoneSubmit}
                className="mt-6"
              >
                <div
                  dir="ltr"
                  className={`w-full h-[48px] rounded-[12px] border bg-white px-4 flex items-center transition-colors ${
                    phoneError
                      ? 'border-[#ff1f3d]'
                      : 'border-[#e2e2e2] focus-within:border-[#b59766]'
                  }`}
                >
                  <span className="text-[13px] font-medium text-[#444444] select-none shrink-0">
                    +۹۸
                  </span>
                  <span className="w-[1px] h-4 bg-[#e2e2e2] mx-3 shrink-0" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="w-full h-full bg-transparent text-[14px] font-medium text-[#222222] focus:outline-none tabular-nums text-left"
                  />
                </div>
              </form>
            ) : (
              <form id="auth-otp-form" onSubmit={handleOtpSubmit} className="mt-6">
                <div
                  dir="ltr"
                  className="flex items-center justify-center gap-2.5 sm:gap-3"
                >
                  {[0, 1, 2, 3].map((idx) => {
                    const digit = otpDigits[idx];
                    const isRedBorder =
                      otpWrongError || (otpIncompleteError && !digit);

                    return (
                      <div
                        key={idx}
                        onClick={() => desktopOtpRefs[idx].current?.focus()}
                        className={`relative w-[48px] h-[48px] rounded-[11px] border bg-white flex items-center justify-center transition-colors cursor-text ${
                          isRedBorder
                            ? 'border-[#ff1f3d]'
                            : 'border-[#e0e0e0] focus-within:border-[#b59766]'
                        }`}
                      >
                        <input
                          ref={desktopOtpRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpDigitChange(idx, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-full h-full bg-transparent text-center text-[15px] font-semibold text-[#222222] focus:outline-none tabular-nums"
                        />
                        {!digit && (
                          <span className="pointer-events-none absolute bottom-3.5 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-[#cccccc] rounded-full" />
                        )}
                      </div>
                    );
                  })}

                  {/* باکس تایمر ۱ دقیقه / آیکون ارسال مجدد در سمت راست */}
                  <button
                    type="button"
                    onClick={handleTimerOrResendClick}
                    className="h-[48px] min-w-[64px] px-3.5 rounded-[11px] bg-[#f3f3f3] hover:bg-[#eaeaea] text-[#333333] flex items-center justify-center text-[13.5px] font-semibold tabular-nums transition-colors cursor-pointer shrink-0"
                  >
                    {isResendingOtp ? (
                      <div
                        className="flex items-center justify-center gap-1"
                        dir="ltr"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#777777] animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-[#222222] animate-pulse [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#777777] animate-pulse [animation-delay:300ms]" />
                      </div>
                    ) : secondsLeft > 0 ? (
                      <span>{formatTimer(secondsLeft)}</span>
                    ) : (
                      <RefreshCodeIcon className="w-5 h-5 text-[#292d32]" />
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* بخش پایینی مودال دسکتاپ: ویرایش شماره همراه + قوانین و مقررات + دکمه اصلی با حالت لودینگ */}
          <div className="mt-8">
            {step === 'otp' && (
              <div className="text-center mb-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtpIncompleteError(false);
                    setOtpWrongError(false);
                  }}
                  className="text-[12px] font-semibold text-[#333333] hover:text-[#b59766] transition-colors cursor-pointer"
                >
                  ویرایش شماره همراه
                </button>
              </div>
            )}

            <p className="text-[11.5px] text-[#555555] text-center">
              ورود شما به منزله موافقت با{' '}
              <span
                onClick={() => {
                  onClose();
                  navigateToRoute('rule');
                }}
                className="text-[#b59766] font-medium cursor-pointer hover:underline"
              >
                قوانین و مقررات
              </span>{' '}
              است.
            </p>

            <button
              type="submit"
              form={step === 'phone' ? 'auth-phone-form' : 'auth-otp-form'}
              className={`mt-3.5 w-full h-[46px] rounded-[12px] text-[13px] font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                (step === 'phone' ? isPhoneBtnDark : isOtpBtnDark)
                  ? 'bg-[#2b2b2b] hover:bg-[#1f1f1f] text-white'
                  : 'bg-[#f5f5f5] hover:bg-[#ececec] text-[#6e6e6e]'
              }`}
            >
              {isLoading ? (
                <div
                  className="flex items-center justify-center gap-1.5"
                  dir="ltr"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/75 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/75 animate-pulse [animation-delay:300ms]" />
                </div>
              ) : step === 'phone' ? (
                'تایید و دریافت کد'
              ) : (
                'تایید و ادامه فرآیند'
              )}
            </button>
          </div>
        </div>

        {/* نوتیفیکیشن‌های گوشه پایین-چپ صفحه دسکتاپ */}
        {toasts.length > 0 && (
          <>
            <style>{`
              @keyframes toastSlideInSpring {
                0% { transform: translateY(110%); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
              }
              @keyframes localToastProgressVertical {
                0% { height: 0%; }
                100% { height: 100%; }
              }
              .animate-desktop-toast-in {
                animation: toastSlideInSpring 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
              .animate-local-toast-progress-vertical {
                animation: localToastProgressVertical 3800ms linear forwards;
              }
            `}</style>
            <div
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-[60] flex flex-col gap-3 pointer-events-auto"
            >
              {toasts.map((t) => {
                const isGreen = t.type === 'success' || t.type === 'otp-resent';
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setToasts((prev) => prev.filter((item) => item.id !== t.id));
                      if (t.type === 'success') {
                        completeLoginAfterToast(formattedDisplayPhone);
                      }
                    }}
                    className="relative w-full sm:w-[370px] bg-white rounded-[18px] shadow-[0_14px_40px_rgba(0,0,0,0.14)] px-4 pt-3.5 pb-4 flex items-center justify-between gap-3.5 overflow-hidden animate-desktop-toast-in cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 pr-1">
                      <div
                        className={`w-11 h-11 rounded-[12px] border flex items-center justify-center shrink-0 ${
                          isGreen
                            ? 'bg-[#edfcf2] border-[#abefc6] text-[#17b26a]'
                            : 'bg-[#fff0f2] border-[#ffccd3] text-[#ff1f3d]'
                        }`}
                      >
                        {renderToastIcon(t.type)}
                      </div>

                      <div className="text-right">
                        <h4 className="text-[13.5px] font-bold text-[#1e1e1e]">
                          {t.title}
                        </h4>
                        <p className="text-[11.5px] text-[#555555] mt-1 leading-relaxed">
                          {t.message}
                        </p>
                      </div>
                    </div>

                    {/* خط عمودی کوچک سمت چپ در دسکتاپ که از بالا به پایین پر می‌شود */}
                    <div
                      className={`w-[3.5px] h-9 rounded-full overflow-hidden shrink-0 flex flex-col justify-start ${
                        isGreen ? 'bg-[#dcfce7]' : 'bg-[#ffe4e8]'
                      }`}
                    >
                      <span
                        className={`w-full rounded-full animate-local-toast-progress-vertical ${
                          isGreen ? 'bg-[#17b26a]' : 'bg-[#ff1f3d]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export interface AppToast {
  id: string;
  type:
    | 'logout-success'
    | 'logout-error'
    | 'success'
    | 'error'
    | 'cart-auth-required'
    | 'cart-checkout-redirect'
    | 'cart-delete-success'
    | 'cart-delete-error'
    | 'contact-success'
    | 'contact-empty-error'
    | 'contact-send-error'
    | 'catalog-download-success'
    | 'catalog-download-error'
    | 'project-like-success'
    | 'project-dislike'
    | 'product-add-error';
  title: string;
  message: string;
  onComplete?: () => void;
}

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

/**
 * مودال تایید خروج از حساب کاربری دقیقاً مطابق با طراحی فیگما
 * عریض با گوشه‌های گرد، متون و دکمه‌های کاملاً راست‌چین
 */
export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* بک‌دراپ تیره برای موبایل و دسکتاپ */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* نگهدارنده محتوا */}
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="fixed z-50 
          /* استایل‌های موبایل: دراور پایین صفحه */
          bottom-0 inset-x-0 bg-white rounded-t-[32px] px-6 pb-10 pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] flex flex-col items-stretch justify-start animate-in slide-in-from-bottom duration-300
          /* استایل‌های دسکتاپ */
          sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[560px] sm:rounded-[22px] sm:px-10 sm:py-8 sm:shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:border sm:border-[#e8e8e8] sm:items-start"
      >
        {/* دستگیره تاچ برای دراور موبایل */}
        <div className="w-12 h-1 bg-[#e4e2dc] rounded-full mx-auto mb-5 sm:hidden shrink-0" />

        {/* دکمه ضربدر بستن - فقط در دسکتاپ */}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="hidden sm:flex absolute top-5 left-5 w-7 h-7 rounded-full flex items-center justify-center text-[#2b2b2b] hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2]" />
        </button>

        {/* عنوان مودال کاملاً راست‌چین و خوانا */}
        <h3 className="w-full text-[16.5px] sm:text-[18px] font-bold text-[#1a1a1a] leading-snug text-right mt-1">
          آیا مطمئن هستید میخواهید از حساب خود خارج شوید؟
        </h3>

        {/* متن توضیحات مشتری عزیز با هایلایت قرمز کاملاً راست‌چین و با کنتراست بالا */}
        <div className="w-full text-[12.5px] sm:text-[13.5px] text-[#2c2c2c] leading-[1.85] mt-4 mb-8 text-right">
          <p className="font-bold text-[#141414] text-[13.5px] sm:text-[14px] mb-1">مشتری گرامی عزیز</p>
          <p>
            در صورت تایید دکمه{' '}
            <span className="text-[#ff1f3d] font-bold">"بله مطمئن هستم"</span>{' '}
            از حساب کاربری خود اتوماسیون
          </p>
          <p>خارج میشوید، از همراهی شما سپاس گزاریم.</p>
        </div>

        {/* دکمه‌های عملیات کاملاً راست‌چین و منعطف */}
        <div className="flex items-center justify-start gap-3.5 w-full">
          {/* دکمه بله مطمئن هستم (در سمت راست در موبایل) */}
          <button
            type="button"
            onClick={onConfirmLogout}
            className="flex-1 sm:flex-none min-w-[130px] sm:min-w-[145px] h-[44px] px-6 rounded-[12px] bg-white hover:bg-[#f7f7f7] active:bg-[#eeeeee] text-[#222222] border border-[#d6d6d6] text-[13.5px] font-bold transition-all cursor-pointer shadow-xs text-center"
          >
            بله مطمئن هستم
          </button>

          {/* دکمه منصرف شدم (در سمت چپ در موبایل) */}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none min-w-[120px] sm:min-w-[135px] h-[44px] px-6 rounded-[12px] bg-[#e52e40] hover:bg-[#cf2234] active:bg-[#b81d2e] text-white text-[13.5px] font-bold transition-all cursor-pointer shadow-sm text-center"
          >
            منصرف شدم
          </button>
        </div>
      </div>
    </>
  );
};

/**
 * پاپ‌آپ‌های نوتیفیکیشن پایین صفحه (شامل مورد ضروری ورود به سبد خرید، خروج موفقیت‌آمیز و خطای خروج) دقیقاً مطابق با تصاویر ارسالی فیگما
 */
const SingleToast: React.FC<{
  toast: AppToast;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const hasCompletedRef = React.useRef(false);
  const isBlue =
    toast.type === 'cart-auth-required' ||
    toast.type === 'cart-checkout-redirect';
  const isGreen =
    toast.type === 'logout-success' ||
    toast.type === 'success' ||
    toast.type === 'cart-delete-success' ||
    toast.type === 'contact-success' ||
    toast.type === 'catalog-download-success' ||
    toast.type === 'project-like-success';

  React.useEffect(() => {
    // پر شدن خط پیشرفت در ۳۶۰۰ میلی‌ثانیه به پایان می‌رسد و سپس اسلاید خروج آغاز می‌شود
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 3600);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (isClosing) {
      const dismissTimer = setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          toast.onComplete?.();
        }
        onDismiss(toast.id);
      }, 380);
      return () => clearTimeout(dismissTimer);
    }
  }, [isClosing, onDismiss, toast]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
  };

  const renderToastBoxIcon = () => {
    if (toast.type === 'cart-checkout-redirect') {
      /* آیکون کیف خرید آبی برای «در حال انتقال به صفحه (خرید)» مطابق عکس اول و دوم */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px] lg:w-[22px] lg:h-[22px]"
        >
          <path
            d="M8.4 8.2V6.8C8.4 4.7 10.01 3 12 3C13.99 3 15.6 4.7 15.6 6.8V8.2"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 21H15C18.4 21 19.1 19.55 19.35 17.7L20 12.2C20.25 9.85 19.6 8.2 15.7 8.2H8.3C4.4 8.2 3.75 9.85 4 12.2L4.65 17.7C4.9 19.55 5.6 21 9 21Z"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.8 12H14.2"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (toast.type === 'cart-auth-required') {
      /* آیکون مثلث هشدار آبی رنگ «مورد ضروری» */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px] lg:w-[22px] lg:h-[22px]"
        >
          <path
            d="M12 9V14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.0001 21.41H5.94005C2.47005 21.41 1.02005 18.93 2.70005 15.9L5.82006 10.28L8.76006 5.00003C10.5401 1.79003 13.4601 1.79003 15.2401 5.00003L18.1801 10.29L21.3001 15.91C22.9801 18.94 21.5201 21.42 18.0601 21.42H12.0001V21.41Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.9945 17H12.0035"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (
      toast.type === 'cart-delete-success' ||
      toast.type === 'contact-success'
    ) {
      /* آیکون تیک کنگره‌دار ۸ پر سبز برای «با موفقیت حذف شد» و «پیام شما با موفقیت ارسال شد» مطابق عکس‌ها */
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px] lg:w-[22px] lg:h-[22px]"
        >
          <path
            d="M24 4.5 C26.6 4.5, 28.5 7.4, 30.9 8.4 C33.3 9.4, 36.8 8.3, 38.6 10.1 C40.4 11.9, 39.3 15.4, 40.3 17.8 C41.3 20.2, 44.2 22.1, 44.2 24.7 C44.2 27.3, 41.3 29.2, 40.3 31.6 C39.3 34.0, 40.4 37.5, 38.6 39.3 C36.8 41.1, 33.3 40.0, 30.9 41.0 C28.5 42.0, 26.6 44.9, 24 44.9 C21.4 44.9, 19.5 42.0, 17.1 41.0 C14.7 40.0, 11.2 41.1, 9.4 39.3 C7.6 37.5, 8.7 34.0, 7.7 31.6 C6.7 29.2, 3.8 27.3, 3.8 24.7 C3.8 22.1, 6.7 20.2, 7.7 17.8 C8.7 15.4, 7.6 11.9, 9.4 10.1 C11.2 8.3, 14.7 9.4, 17.1 8.4 C19.5 7.4, 21.4 4.5, 24 4.5 Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 24.8 L22.1 29.3 L31.2 20.2"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (toast.type === 'contact-empty-error') {
      /* آیکون کلیپ‌بورد قرمز برای «مشتری عزیز فیلد فرم تماس با مجموعه خالی میباشد.» مطابق عکس یازدهم و سیزدهم */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[23px] h-[23px] lg:w-[21px] lg:h-[21px]"
        >
          <path
            d="M8 12.2H15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 16.2H12.38"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 4.02C19.33 4.2 21 5.43 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44 4.67 4.2 8 4.02"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (toast.type === 'project-like-success') {
      /* آیکون قلب با تیک تایید سبز برای «با موفقیت لایک شد» مطابق عکس ۴ و ۱۲ */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px] lg:w-[22px] lg:h-[22px]"
        >
          <path
            d="M22 8.69C22 10.66 21.49 12.4 20.69 13.91C19.86 12.92 18.61 12.3 17.2 12.3C14.66 12.3 12.6 14.36 12.6 16.9C12.6 18.13 13.08 19.25 13.87 20.07C13.19 20.5 12.51 20.75 12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.37 3.1 10.99 3.98 12 5.33C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="17.2"
            cy="16.9"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M15.45 16.9L16.65 18.1L19.05 15.7"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (toast.type === 'project-dislike') {
      /* آیکون قلب با ضربدر قرمز (heart-remove) برای حذف لایک / دیس‌لایک پروژه */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px] lg:w-[22px] lg:h-[22px]"
        >
          <path
            d="M22 8.69C22 10.66 21.49 12.4 20.69 13.91C19.86 12.92 18.61 12.3 17.2 12.3C14.66 12.3 12.6 14.36 12.6 16.9C12.6 18.13 13.08 19.25 13.87 20.07C13.19 20.5 12.51 20.75 12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.37 3.1 10.99 3.98 12 5.33C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="17.2"
            cy="16.9"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M15.95 15.65L18.45 18.15"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.45 15.65L15.95 18.15"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (toast.type === 'product-add-error') {
      /* آیکون چرخ‌دنده قرمز برای «خطا در اضافه شدن محصول!» مطابق عکس ۴ و ۱۳ */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px] lg:w-[22px] lg:h-[22px]"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22 10.07 22 11.12V12.88C22 13.92 21.15 14.78 20.1 14.78C18.29 14.78 17.55 16.06 18.46 17.63C18.98 18.54 18.67 19.7 17.76 20.22L16.03 21.21C15.24 21.68 14.22 21.4 13.75 20.61L13.64 20.42C12.74 18.85 11.26 18.85 10.35 20.42L10.24 20.61C9.77 21.4 8.75 21.68 7.96 21.21L6.23 20.22C5.32 19.7 5.01 18.53 5.53 17.63C6.44 16.06 5.7 14.78 3.89 14.78C2.85 14.78 2 13.92 2 12.88Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (toast.type === 'catalog-download-success') {
      /* آیکون دانلود فایل (frame.png) سبز برای «دانلود فایلPDF» مطابق عکس دوازدهم و سیزدهم */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[23px] h-[23px] lg:w-[21px] lg:h-[21px]"
        >
          <path
            d="M16.44 8.90002C20.04 9.21002 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.73998C4.26998 21.5 2.47998 19.71 2.47998 15.24V15.11C2.47998 11.09 3.92998 9.24002 7.46998 8.91002"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2V14.88"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.35 12.65L12 16L8.65002 12.65"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (
      toast.type === 'contact-send-error' ||
      toast.type === 'catalog-download-error'
    ) {
      /* آیکون هشت‌ضلعی ضربدر قرمز برای «پیام شما ارسال نشد!» و «خطایی دانلود رخ داد!» مطابق عکس‌ها */
      return <OctagonCrossIcon className="w-[23px] h-[23px] lg:w-[21px] lg:h-[21px]" />;
    }

    if (toast.type === 'cart-delete-error') {
      /* آیکون سطل زباله قرمز برای «خطایی رخ داد!» حذف محصول مطابق عکس اول و دوم */
      return <CartTrashIcon className="w-[23px] h-[23px] lg:w-[21px] lg:h-[21px]" />;
    }

    if (isGreen) {
      /* آیکون خروج موفقیت‌آمیز داخل کادر سبز */
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[22px] h-[22px]"
        >
          <path
            d="M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#27ae60]"
          />
          <path
            d="M15 12H3.62"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#27ae60]"
          />
          <path
            d="M5.85 8.65L2.5 12L5.85 15.35"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#27ae60]"
          />
        </svg>
      );
    }

    /* آیکون ضربدر دایره‌ای در خطایی رخ داد داخل کادر قرمز */
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[22px] h-[22px]"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-[#ff1f3d]"
        />
        <path
          d="M9.5 14.5L14.5 9.5M14.5 14.5L9.5 9.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#ff1f3d]"
        />
      </svg>
    );
  };

  return (
    <>
      {/* بک‌دراپ تیره پشت دراور در نمای موبایل و تبلت (< lg) مطابق عکس اول */}
      <div
        onClick={handleDismiss}
        className="fixed inset-0 z-[85] bg-black/55 lg:hidden"
      />

      <div
        onClick={handleDismiss}
        className={`relative z-[90] w-full lg:w-[385px] bg-white rounded-t-[30px] lg:rounded-[18px] shadow-[0_-12px_45px_rgba(0,0,0,0.22)] lg:shadow-[0_14px_40px_rgba(0,0,0,0.16)] border-t border-[#eeeeee] lg:border px-6 lg:px-4 pb-7 lg:pb-4 pt-3.5 lg:pt-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between overflow-hidden cursor-pointer ${
          isClosing ? 'animate-toast-out' : 'animate-toast-in'
        }`}
      >
        {/* دستگیره کشیدن برای دراور موبایل */}
        <div className="w-12 h-1.5 bg-[#dcdcdc] rounded-full mx-auto mb-6 lg:hidden shrink-0" />

        {/* محتوای توست شامل آیکون و متون به همراه ترازبندی دقیق */}
        <div className="flex items-center justify-between gap-4 w-full pr-0.5">
          <div className="flex items-center gap-3.5 text-right">
            {/* آیکون در کادر مربعی گوشه‌گرد در سمت راست */}
            <div
              className={`w-12 h-12 lg:w-11 lg:h-11 rounded-[14px] lg:rounded-[12px] border flex items-center justify-center shrink-0 ${
                isBlue
                  ? 'bg-[#eff3ff] border-[#2952ff] text-[#2952ff]'
                  : isGreen
                    ? 'bg-[#eefaf2] border-[#179c26] text-[#179c26]'
                    : 'bg-[#fff0f2] border-[#ff1f3d] text-[#ff1f3d]'
              }`}
            >
              {renderToastBoxIcon()}
            </div>

            <div className="text-right">
              <h4 className="text-[15px] lg:text-[14px] font-bold text-[#1e1e1e]">
                {toast.title}
              </h4>
              <p className="text-[12.5px] lg:text-[11.5px] text-[#555555] mt-1 leading-relaxed font-normal">
                {toast.message}
              </p>
            </div>
          </div>

          {/* خط باریک شاخص وضعیت در سمت چپ کادر دسکتاپ که از بالا به پایین پر می‌شود */}
          <div className="hidden lg:flex w-[3.5px] h-10 rounded-full bg-[#efefef] overflow-hidden shrink-0 flex-col justify-start">
            <span
              className={`w-full rounded-full animate-toast-progress-vertical ${
                isBlue
                  ? 'bg-[#2952ff]'
                  : isGreen
                    ? 'bg-[#179c26]'
                    : 'bg-[#e50019]'
              }`}
            />
          </div>
        </div>

        {/* خط پیشرفت انیمیشنی پایینی داخل دراور موبایل (پر شدن از راست به چپ مطابق عکس اول) */}
        <div className="lg:hidden mt-6 w-full h-[5px] bg-[#efefef] rounded-full overflow-hidden relative">
          <div
            className={`absolute right-0 top-0 h-full rounded-full animate-toast-progress-full ${
              isBlue
                ? 'bg-[#2952ff]'
                : isGreen
                  ? 'bg-[#179c26]'
                  : 'bg-[#e50019]'
            }`}
          />
        </div>
      </div>
    </>
  );
};

export const AppToastContainer: React.FC<{
  toasts: AppToast[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideInSpring {
          0% { transform: translateY(110%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes toastSlideOutSlow {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-toast-in {
          animation: toastSlideInSpring 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-toast-out {
          animation: toastSlideOutSlow 400ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }
        @keyframes toastProgressFull {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-toast-progress-full {
          animation: toastProgressFull 3600ms linear forwards;
        }
        @keyframes toastProgressVertical {
          0% { height: 0%; }
          100% { height: 100%; }
        }
        .animate-toast-progress-vertical {
          animation: toastProgressVertical 3600ms linear forwards;
        }
      `}</style>
      <div
        dir="rtl"
        className="fixed bottom-0 inset-x-0 lg:bottom-6 lg:left-6 lg:right-auto lg:inset-x-auto z-[90] flex flex-col gap-0 lg:gap-3 pointer-events-auto select-none"
      >
        {toasts.map((toast) => (
          <SingleToast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
};

