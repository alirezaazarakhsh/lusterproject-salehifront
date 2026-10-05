import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Search,
  Box,
  Plus,
  Minus,
  Star,
  Share2,
  Bookmark,
  Truck,
  ArrowRight,
  Layers,
  Ruler,
  BadgeCheck,
  Hash,
  X,
  MessageSquarePlus,
} from 'lucide-react';
import {
  ChandelierProduct,
  GENERATED_IMAGES,
} from '../data/chandelierData';
import {
  Chandelier3DViewer,
  FinishType,
  FINISH_PRESETS,
} from '../components/Chandelier3DViewer';
import { TransparentProductImage } from '../components/TransparentProductImage';
import { toPersianDigits } from '../utils/persianDigits';

interface ProductDetailPageProps {
  product: ChandelierProduct;
  initialFinish?: FinishType;
  allProducts: ChandelierProduct[];
  onAddToCart: (product: ChandelierProduct, qty: number, finish?: FinishType) => void;
  onShowToast?: (
    type: any,
    title: string,
    message: string,
    onAction?: () => void
  ) => void;
  onBack?: () => void;
  onSelectProduct: (product: ChandelierProduct) => void;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
}

interface UserReview {
  id: string;
  authorName: string;
  avatarUrl: string;
  dateStr: string;
  timeStr: string;
  rating: number;
  comment: string;
}

/* ========================================================
   آیکون‌های اختصاصی کارت مشخصات و دکمه‌های آیکونی مطابق فیگما
======================================================== */
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

const ShareCustomIcon: React.FC<{ className?: string }> = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="2.5" stroke="#333333" strokeWidth="1.8"/>
    <circle cx="5" cy="18" r="2.5" stroke="#333333" strokeWidth="1.8"/>
    <circle cx="19" cy="18" r="2.5" stroke="#333333" strokeWidth="1.8"/>
    <path d="M9.8 6.8L6.8 15.8M14.2 6.8L17.2 15.8" stroke="#333333" strokeWidth="1.8"/>
  </svg>
);

const ArchiveCustomIcon: React.FC<{ className?: string; isFilled?: boolean }> = ({ className = "w-4.5 h-4.5", isFilled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={isFilled ? "#ea1d2c" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3.5H18C19.1 3.5 20 4.4 20 5.5V20.5L12 16.5L4 20.5V5.5C4 4.4 4.9 3.5 6 3.5Z" stroke={isFilled ? "#ea1d2c" : "#333333"} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 9.5H15" stroke={isFilled ? "#ffffff" : "#333333"} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const SearchNormalIcon: React.FC<{ className?: string }> = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="#333333" strokeWidth="1.8"/>
    <path d="M20 20L16 16" stroke="#333333" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="1.5" stroke="#333333" strokeWidth="1.5"/>
  </svg>
);

const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    authorName: 'ساشا آذرخش آلوچه',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    dateStr: '۱۳ شهریور ماه ۱۴۰۳',
    timeStr: '۱۴:۲۵',
    rating: 4.3,
    comment:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی میباشد.',
  },
  {
    id: 'rev-2',
    authorName: 'پرهام رحیمی',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    dateStr: '۲۴ آبان ماه ۱۴۰۳',
    timeStr: '۱۴:۲۵',
    rating: 4.3,
    comment:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. لورم ایپسوم',
  },
];

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  initialFinish = 'original',
  allProducts,
  onAddToCart,
  onShowToast,
  onBack,
  onSelectProduct,
  isLoggedIn = false,
  onOpenLogin,
}) => {
  // ۱. وضعیت فینیش / رنگ بدنه
  const [selectedFinish, setSelectedFinish] = useState<FinishType>(
    initialFinish || product.defaultFinish || 'original'
  );

  // ۲. وضعیت نمایش: سه‌بعدی ۳۶۰ درجه یا تصاویر گالری
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('photo');
  const [activeThumbIdx, setActiveThumbIdx] = useState<number>(0);

  // ۳. شمارنده تعداد خرید
  const [quantity, setQuantity] = useState<number>(4);

  // ۴. وضعیت ذخیره در علاقه‌مندی‌ها
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // ۵. پاپ‌آپ ویژگی‌های تکمیلی (۱۵ ویژگی محصول)
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState<boolean>(false);

  // ۶. پاپ‌آپ ثبت نظر جدید
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState<boolean>(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState<UserReview[]>(INITIAL_REVIEWS);

  // تصاویر گالری مربوط به محصول
  const galleryImages = [
    product.image || GENERATED_IMAGES.shahMalakeh,
    GENERATED_IMAGES.crystaliGold,
    GENERATED_IMAGES.projectFereshteh,
    GENERATED_IMAGES.projectRoyalRestaurant,
  ];

  // وقتی محصول عوض شد
  useEffect(() => {
    setSelectedFinish(product.defaultFinish || 'original');
    setActiveThumbIdx(0);
    setViewMode('photo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // پالت‌های رنگی دایره‌ای روی کارت خرید
  const colorOptions: Array<{ finish: FinishType; hex: string; label: string }> = [
    { finish: 'dark-patina', hex: '#6366f1', label: 'سرمه‌ای سلطنتی' },
    { finish: 'antique-bronze', hex: '#ef4444', label: 'قرمز یاقوتی' },
    { finish: 'gold-24k', hex: '#eab308', label: 'طلایی ۲۴ عیار' },
    { finish: 'original', hex: '#4a4a4a', label: 'دودی کلاسیک' },
  ];

  // افزایش / کاهش تعداد
  const handleIncreaseQty = () => {
    if (quantity < 12) setQuantity((prev) => prev + 1);
  };
  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // افزودن به سبد خرید
  const handleAddToCartClick = () => {
    if (product.outOfStock) {
      onShowToast?.(
        'product-out-of-stock',
        'عدم موجودی',
        'این محصول در حال حاضر در انبار موجود نمی‌باشد.'
      );
      return;
    }
    onAddToCart(product, quantity, selectedFinish);
    onShowToast?.(
      'add-to-cart-success',
      'به سبد خرید افزوده شد',
      `${toPersianDigits(quantity)} عدد ${product.name} با موفقیت در سبد خرید قرار گرفت.`
    );
  };

  // افزودن نظر جدید
  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      authorName: newReviewAuthor.trim(),
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      dateStr: 'امروز (به‌تازگی)',
      timeStr: 'همین حالا',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setIsAddReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
    onShowToast?.(
      'review-submitted',
      'ثبت نظر موفقیت‌آمیز بود',
      'نظر ارزشمند شما پس از تایید مدیریت در این صفحه منتشر گردید.'
    );
  };

  // محصولات مشابه (۴ محصول)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#faf9f6] text-[#1e1e1e] pb-24 pt-4 sm:pt-6 font-sans antialiased" dir="rtl">
      {/* تمام‌عرض در تمامی نمایشگرها مطابق درخواست دقیق کاربر */}
      <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 pt-2">

        {/* ========================================================
            بخش اول (هیرو محصول مطابق دقیق اسکرین‌شات فیگما):
            ستون راست (مشخصات و خرید): عنوان + توضیح + ۲ کارت مجزا
            ستون چپ (ویژوال): عکس اصلی + ۴ عکس بندانگشتی پایین
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-10">
          {/* ستون راست در دسکتاپ (عنوان، توضیح و دو کارت مشخصات و خرید) */}
          <div className="lg:col-span-6 flex flex-col order-1 lg:order-1">
            {/* عنوان بزرگ محصول */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] tracking-tight text-right">
              {product.name}
            </h1>

            {/* زیرعنوان و کاربری لوستر */}
            <p className="text-[13px] font-bold mt-1.5 text-right">
              <span className="text-[#b58c5e]">مناسب کلاسیک پذیرایی</span>{' '}
              <span className="text-[#777]">| کلاسیک خواب</span>
            </p>

            {/* توضیحات خلاصه متنی */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#666] mt-3 font-normal text-justify">
              {product.description ||
                'نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر استفاده می‌شود، البته که همانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ می‌شود.'}
            </p>

            {/* دو کارت اصلی کنار هم دقیقاً مطابق اسکرین‌شات فیگما */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* کارت راست: مشخصات شناختی (مدل، کد محصول، جنس بدنه، ابعاد با آیکون‌های طلایی) */}
              <div className="rounded-[24px] border border-[#f0eee8] bg-white p-5 space-y-4 shadow-2xs">
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

              {/* کارت چپ: استپر تعداد، رنگ، دکمه‌های آیکونی، قیمت و افزودن به سبد خرید */}
              <div className="rounded-[24px] border border-[#f0eee8] bg-white p-5 flex flex-col justify-between shadow-2xs">
                <div>
                  {/* تعداد محصول + استپر */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-[#f5f5f5] rounded-[14px] p-1.5">
                      <button
                        type="button"
                        onClick={handleDecreaseQty}
                        aria-label="کاهش تعداد"
                        className="w-7 h-7 rounded-[10px] bg-white border border-[#e5e5e5] text-[#222] hover:bg-[#eaeaea] flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      {/* عدد تعداد داخل باکس مشکی پر کادر مطابق فیگما */}
                      <span className="w-7 h-7 rounded-[8px] bg-[#222222] text-white font-extrabold flex items-center justify-center text-xs tabular-nums shadow-2xs">
                        {toPersianDigits(quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={handleIncreaseQty}
                        aria-label="افزایش تعداد"
                        className="w-7 h-7 rounded-[10px] bg-white border border-[#e5e5e5] text-[#222] hover:bg-[#eaeaea] flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-0">
                      <span className="block text-xs font-extrabold text-[#222]">
                        تعداد محصول :
                      </span>
                      <span className="block text-[9.5px] text-[#888] mt-0.5 truncate">
                        * حداکثر ۱۲ عدد و حداقل ۱ عدد میباشد
                      </span>
                    </div>
                  </div>

                  {/* دکمه‌های آیکونی سمت چپ و رنگ سمت راست مطابق دقیق فیگما */}
                  <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[#f4f2ec]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: product.name, url: window.location.href });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            onShowToast?.('share', 'لینک کپی شد', 'آدرس این محصول کپی شد.');
                          }
                        }}
                        className="w-10 h-10 rounded-[14px] bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#333] flex items-center justify-center transition-colors cursor-pointer"
                        title="اشتراک گذاری"
                      >
                        <ShareCustomIcon className="w-4.5 h-4.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsBookmarked(!isBookmarked);
                          onShowToast?.(
                            'bookmark-toggle',
                            !isBookmarked ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
                            `${product.name}`
                          );
                        }}
                        className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'bg-[#fee8ea] text-[#ea1d2c]'
                            : 'bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#333]'
                        }`}
                        title="ذخیره"
                      >
                        <ArchiveCustomIcon className="w-4.5 h-4.5" isFilled={isBookmarked} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewMode('photo')}
                        className="w-10 h-10 rounded-[14px] bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#333] flex items-center justify-center transition-colors cursor-pointer"
                        title="بزرگنمایی"
                      >
                        <SearchNormalIcon className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#333]">رنگ :</span>
                      <div className="flex items-center gap-1.5">
                        {colorOptions.map((opt) => (
                          <button
                            key={opt.finish}
                            type="button"
                            onClick={() => setSelectedFinish(opt.finish)}
                            title={opt.label}
                            className={`w-5 h-5 rounded-full transition-transform cursor-pointer relative ${
                              selectedFinish === opt.finish
                                ? 'scale-125 ring-2 ring-[#a68452] ring-offset-1'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: opt.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* قیمت و دکمه افزودن به سبد خرید */}
                <div className="mt-4 pt-3.5 border-t border-[#f4f2ec] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className="h-11 px-5 rounded-[14px] bg-[#222222] hover:bg-black text-white text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                    <span>افزودن به سبد خرید</span>
                  </button>

                  <div className="text-left">
                    <span className="block text-[11px] font-bold text-[#777]">قیمت :</span>
                    <span className="block text-[15px] font-black text-[#1a1a1a] tabular-nums mt-0.5">
                      {product.priceFormatted || '۱۲,۵۰۰,۰۰۰ تومان'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ستون چپ در دسکتاپ (ویژوال و گالری - فشرده‌تر و با اندازه متناسب) */}
          <div className="lg:col-span-6 flex flex-col items-center order-2 lg:order-2 w-full">
            {/* قاب فشرده نمایش تصویر با عرض و ارتفاع کنترل شده */}
            <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-[20px] overflow-hidden bg-[#f8f7f4] border border-[#e8e4dc] shadow-2xs mx-auto">
              {viewMode === '3d' && activeThumbIdx === 0 ? (
                /* نمایشگر زنده سه‌بعدی فقط برای تصویر شاخص اصلی */
                <div className="w-full h-full relative">
                  <Chandelier3DViewer
                    modelType={product.modelType || 'shah-malakeh'}
                    imageUrl={galleryImages[0]}
                    initialFinish={selectedFinish}
                    onFinishChange={setSelectedFinish}
                    showControls={true}
                    className="w-full h-full"
                  />

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none z-10">
                    <Box className="w-3 h-3 text-[#d4af37]" />
                    <span>حالت سه‌بعدی ۳۶۰ درجه</span>
                  </div>
                </div>
              ) : (
                /* نمایش عکس با ابعاد مناسب و کوچک‌تر جهت دیده‌شدن کامل */
                <div
                  className="w-full h-full relative flex items-center justify-center p-6 sm:p-8 bg-[#f8f7f4]"
                  style={{
                    filter:
                      selectedFinish !== 'original'
                        ? FINISH_PRESETS[selectedFinish]?.filterCss
                        : undefined,
                  }}
                >
                  <TransparentProductImage
                    src={galleryImages[activeThumbIdx]}
                    alt={product.name}
                    className="w-full h-full object-contain max-h-[85%] transition-all duration-300 transform scale-95"
                  />
                </div>
              )}

              {/* دکمه سوئیچ سه‌بعدی تنها برای تصویر شاخص اصلی */}
              {activeThumbIdx === 0 && (
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === '3d' ? 'photo' : '3d')}
                    className={`h-8 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all cursor-pointer ${
                      viewMode === '3d'
                        ? 'bg-[#d4af37] text-white hover:bg-[#b08754]'
                        : 'bg-black/70 text-white hover:bg-black'
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    <span>{viewMode === '3d' ? 'تصویر دوبعدی' : 'مدل سه‌بعدی ۳۶۰°'}</span>
                  </button>
                </div>
              )}

              {/* فلش‌های ناوبری تصویر (دکمه‌های مربعی نرم با رادیوس ملایم مطابق فیگما، نه دایره‌ای) */}
              <button
                type="button"
                onClick={() =>
                  setActiveThumbIdx((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1
                  )
                }
                aria-label="تصویر قبلی"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[10px] bg-black/25 hover:bg-black/45 text-white shadow-xs flex items-center justify-center transition-all cursor-pointer z-20 backdrop-blur-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveThumbIdx((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1
                  )
                }
                aria-label="تصویر بعدی"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[10px] bg-black/25 hover:bg-black/45 text-white shadow-xs flex items-center justify-center transition-all cursor-pointer z-20 backdrop-blur-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* ۴ تصویر بندانگشتی با انحنای ملایم و کاور کامل مطابق فیگما */}
            <div className="grid grid-cols-4 gap-3 mt-3 w-full max-w-[440px] mx-auto">
              {galleryImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveThumbIdx(idx);
                    setViewMode('photo');
                  }}
                  className={`relative aspect-[16/10] sm:aspect-[4/3] rounded-[14px] overflow-hidden bg-[#f4f2ee] border-2 transition-all flex items-center justify-center cursor-pointer ${
                    activeThumbIdx === idx && viewMode === 'photo'
                      ? 'border-[#a68452] shadow-2xs scale-[1.02]'
                      : 'border-transparent hover:border-[#ddd]'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover rounded-[12px]"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            بخش دوم: توضیحات تکمیلی + مشخصات فنی + بازه زمانی تحویل
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* توضیحات تکمیلی و بازه زمانی تحویل (سمت چپ) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <div className="rounded-[22px] border border-[#ece8e0] bg-white p-6 shadow-2xs">
              <h2 className="text-sm font-extrabold text-[#1a1a1a] mb-3">
                توضیحات تکمیلی
              </h2>
              <p className="text-xs leading-relaxed text-[#666] text-justify font-normal">
                نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر استفاده می‌شود، البته که همانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ می‌شود. معمولاً برای فضاهای نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر آن استفاده می‌شود، البته که همانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ می‌شود. معمولاً برای فضاهای نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر آن استفاده می‌شود، البته که همانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ می‌شود. معمولاً برای فضاهای نشیمن لوسترهای گرد و بالای میزهای پذیرایی می‌باشد.
              </p>
            </div>

            {/* کارت بازه زمانی تحویل */}
            <div className="rounded-[22px] border border-[#ece8e0] bg-white p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#fbf8f3] border border-[#f3eee5] text-[#b08754] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-extrabold text-[#222]">
                    بازه زمانی تحویل :
                  </span>
                  <span className="block text-[11px] text-[#777] mt-0.5 tabular-nums">
                    تاریخ حدودی تحویل مرسوله (۲ مهر ۱۴۰۴ - ۷ مهر ۱۴۰۴)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#f8f7f4] border border-[#eee] px-3.5 py-2 rounded-xl">
                <span className="text-xs font-bold text-[#555]">ساعت حدودی :</span>
                <span className="text-xs font-extrabold text-[#222] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded-md tabular-nums">۱۲ : ۵۵</span>
                <span className="text-xs font-bold text-[#888]">الی</span>
                <span className="text-xs font-extrabold text-[#222] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded-md tabular-nums">۱۴ : ۴۵</span>
              </div>
            </div>
          </div>

          {/* مشخصات فنی لوستر (کارت سمت راست) */}
          <div className="lg:col-span-4 rounded-[22px] border border-[#ece8e0] bg-white p-6 flex flex-col justify-between shadow-2xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#f4f2ec]">
                <span className="font-bold text-[#777]">قطر لوستر :</span>
                <span className="font-extrabold text-[#222] tabular-nums">سانتی‌متر ۳۵x۳۵x۳۰</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#f4f2ec]">
                <span className="font-bold text-[#777]">ارتفاع :</span>
                <span className="font-extrabold text-[#222] tabular-nums">۳۰ سانتی‌متر</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#f4f2ec]">
                <span className="font-bold text-[#777]">وزن :</span>
                <span className="font-extrabold text-[#222] tabular-nums">۲۸۰۰ گرم</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#f4f2ec]">
                <span className="font-bold text-[#777]">تعداد سرپیچ لامپ LED :</span>
                <span className="font-extrabold text-[#222] tabular-nums">۶ عدد</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#777]">منبع برق :</span>
                <span className="font-extrabold text-[#222]">برق شهری</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFeaturesModalOpen(true)}
              className="mt-6 w-full h-11 rounded-[14px] bg-[#b58c5e] hover:bg-[#9d784b] text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            >
              ۱۵ ویژگی محصول
            </button>
          </div>
        </div>

        {/* ========================================================
            بخش سوم: نظرات کاربران درباره این محصول (عکس ۲ فیگما)
        ======================================================== */}
        <div className="mb-14">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-black text-[#1a1a1a]">
                نظرات کاربران درباره این محصول
              </h2>
              <span className="text-xs font-bold text-[#777]">
                ۱۶ نظر ثبت شد
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsAddReviewModalOpen(true)}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#f5f5f5] hover:bg-[#e8e8e8] text-[#222] text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن نظر</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* لیست نظرات کاربران (سمت راست) */}
            <div className="lg:col-span-8 space-y-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-[22px] border border-[#ece8e0] bg-white p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatarUrl}
                        alt={rev.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-[#eee]"
                      />
                      <div>
                        <span className="block text-xs font-extrabold text-[#111]">
                          {rev.authorName}
                        </span>
                        <span className="block text-[10.5px] text-[#888] mt-0.5">
                          تاریخ نظر دهی : {rev.dateStr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-[#222] text-white px-2.5 py-1 rounded-lg tabular-nums">
                        ساعت {toPersianDigits(rev.timeStr)}
                      </span>
                      <span className="text-xs font-extrabold bg-[#b58c5e] text-white px-2.5 py-1 rounded-lg flex items-center gap-1 tabular-nums">
                        <span>★</span>
                        <span>{toPersianDigits(rev.rating.toFixed(1))}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-[#555] text-justify">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* نوار امتیاز و معیارهای ارزیابی (سمت چپ) */}
            <div className="lg:col-span-4 rounded-[22px] border border-[#ece8e0] bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f4f2ec]">
                <span className="text-xs font-extrabold bg-[#e8f5e9] text-[#2e7d32] px-3 py-1 rounded-lg">
                  خیلی خوب
                </span>
                <span className="text-xl font-black text-[#1a1a1a] tabular-nums">
                  ۴.۷ امتیاز
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'وضعیت محصول', score: '۴.۵', pct: '90%' },
                  { label: 'موقعیت مکانی و دسترسی', score: '۴.۲', pct: '84%' },
                  { label: 'امکانات کالا', score: '۳.۷', pct: '74%' },
                  { label: 'رعایت پروتکل های بسته بندی', score: '۴.۹', pct: '98%' },
                  { label: 'به موقع رساندن کالا', score: '۴.۸', pct: '96%' },
                  { label: 'کیفیت ارسال کالا', score: '۳.۳', pct: '66%' },
                  { label: 'خدمات سرویس دهی', score: '۴.۴', pct: '88%' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#111] tabular-nums">
                        {item.score}
                      </span>
                      <span className="font-bold text-[#777]">{item.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#f0ede6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#111] rounded-full"
                        style={{ width: item.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            بخش چهارم: محصولات مشابه
        ======================================================== */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-base sm:text-lg font-black text-[#1a1a1a]">
              محصولات مشابه
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="h-9 px-4 rounded-xl border border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] text-[#222] text-xs font-bold transition-all cursor-pointer"
              >
                مشاهده محصولات
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relProd) => (
              <div
                key={relProd.id}
                onClick={() => onSelectProduct(relProd)}
                className="bg-white rounded-[22px] border border-[#ece8e0] p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
              >
                <div className="w-full aspect-square rounded-[18px] bg-[#f8f7f4] border border-[#f0eee8] p-3 flex items-center justify-center overflow-hidden mb-3">
                  <TransparentProductImage
                    src={relProd.image}
                    alt={relProd.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="text-right space-y-1">
                  <h3 className="text-sm font-extrabold text-[#1a1a1a] truncate group-hover:text-[#a68452] transition-colors">
                    {relProd.name}
                  </h3>
                  <p className="text-[11px] text-[#888] truncate">
                    {relProd.subtitle || 'مناسب کلاسیک پذیرایی | کلاسیک خواب'}
                  </p>
                  <p className="text-xs font-extrabold text-[#1a1a1a] tabular-nums pt-1">
                    {relProd.priceFormatted}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#f4f2ec]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(relProd);
                    }}
                    className="h-9 px-3.5 rounded-xl bg-[#f5f5f5] group-hover:bg-[#222] group-hover:text-white text-[#222] text-xs font-bold transition-all"
                  >
                    مشاهده و خرید
                  </button>

                  <span className="text-[10.5px] font-bold text-[#888] tabular-nums">
                    کد محصول {toPersianDigits(relProd.productCode)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          پاپ‌آپ ۱۵ ویژگی محصول
      ======================================================== */}
      {isFeaturesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#eee] mb-4">
              <h3 className="text-base font-extrabold text-[#111]">
                ۱۵ ویژگی شاخص {product.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsFeaturesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f5] text-[#555] hover:bg-[#e5e5e5] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 text-xs text-[#444]">
              {[
                '۱. تولید شده از برنز خالص سنگین به روش قالب‌گیری دقیق',
                '۲. پوشش آبکاری طلای ۲۴ عیار با تثبیت‌کننده کیفیت آلمانی',
                '۳. کریستال‌های تراش‌خورده شامپاینی درجه یک با بالاترین شفافیت',
                '۴. قابلیت تنظیم ارتفاع توسط زنجیر و کانوپی برنزی مطبق',
                '۵. استفاده از سرپیچ‌های استاندارد E14 سرامیکی نسوز',
                '۶. سیم‌کشی داخلی تمام مس مسلّح با عایق حرارتی تا ۱۸۰ درجه',
                '۷. طراحی منحصربه‌فرد فرشته و گل‌های دست قلم‌زنی‌شده',
                '۸. وزن و استحکام استاندارد ساختار بدون نوسان در نصب سقف',
                '۹. همراه با شناسنامه اصالت کالا و کد حک‌شده گالری صالحی',
                '۱۰. ۱۰ سال ضمانت کتبی ثبات آبکاری و عدم تغییر رنگ',
                '۱۱. قابلیت سفارشی‌سازی ابعاد و تعداد شاخه‌ها',
                '۱۲. سازگار با تمامی لامپ‌های فوق کم‌مصرف فیلامنتی و LED',
                '۱۳. بسته‌بندی ۵ لایه ضدضربه مخصوص ارسال به سراسر کشور',
                '۱۴. امکان ست‌کردن با دیوارکوب و آباژور هم‌خانواده',
                '۱۵. پشتیبانی و تامین قطعات یدکی مادام‌العمر در گالری صالحی',
              ].map((feat, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#f0eee8] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b58c5e] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsFeaturesModalOpen(false)}
              className="mt-5 w-full h-11 bg-[#222] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          پاپ‌آپ افزودن نظر جدید
      ======================================================== */}
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#eee] mb-4">
              <h3 className="text-base font-extrabold text-[#111]">
                ثبت نظر برای {product.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f5] text-[#555] hover:bg-[#e5e5e5] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#444] mb-1">
                  نام و نام خانوادگی :
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="مثال: علیرضا آذرخش"
                  className="w-full h-10 rounded-xl border border-[#ddd] px-3 text-xs focus:outline-none focus:border-[#b58c5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#444] mb-1">
                  امتیاز شما به این محصول :
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`text-lg transition-transform cursor-pointer ${
                        star <= newReviewRating ? 'text-[#eab308]' : 'text-[#ddd]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#444] mb-1">
                  متن نظر و تجربیات شما :
                </label>

                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="تجربه خود از کیفیت، نورپردازی و تحویل محصول بنویسید..."
                  className="w-full rounded-xl border border-[#ddd] p-3 text-xs focus:outline-none focus:border-[#b58c5e]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#b58c5e] text-white text-xs font-bold rounded-xl hover:bg-[#9d784b] transition-colors cursor-pointer"
              >
                ثبت و انتشار نظر
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
