import React, { useState, useEffect } from 'react';
import { ChandelierProduct, GENERATED_IMAGES } from '../data/chandelierData';
import { FinishType } from '../components/Chandelier3DViewer';
import { ProductHeroInfo } from './components/ProductHeroInfo';
import { ProductSpecsCard } from './components/ProductSpecsCard';
import { ProductActionsCard } from './components/ProductActionsCard';
import { ProductVisualGallery } from './components/ProductVisualGallery';
import { ProductRelatedCarousel } from './components/ProductRelatedCarousel';
import { ProductReviewsSection, UserReview } from './components/ProductReviewsSection';
import { ProductModals } from './components/ProductModals';

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

  // وقتی محصول عوض شد یا کامپوننت لود شد
  useEffect(() => {
    setSelectedFinish(product.defaultFinish || 'original');
    setActiveThumbIdx(0);
    setViewMode('photo');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product.id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
        'error',
        'عدم موجودی',
        'این محصول در حال حاضر در انبار موجود نمی‌باشد.'
      );
      return;
    }
    onAddToCart(product, quantity, selectedFinish);
    onShowToast?.(
      'success',
      'به سبد خرید افزوده شد',
      `${quantity} عدد ${product.name} با موفقیت در سبد خرید قرار گرفت.`
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
      'success',
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
      {/* تنظیمات عرض و پدینگ درخواست شده */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 pt-2">

        {/* ۱. بخش اصلی هیرو و گالری محصول */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
          
          {/* ستون راست */}
          <div className="lg:col-span-8 flex flex-col order-1">
            <ProductHeroInfo product={product} />
            <ProductSpecsCard
              product={product}
              onOpenFeaturesModal={() => setIsFeaturesModalOpen(true)}
            />
            <ProductActionsCard
              product={product}
              selectedFinish={selectedFinish}
              setSelectedFinish={setSelectedFinish}
              quantity={quantity}
              onIncreaseQty={handleIncreaseQty}
              onDecreaseQty={handleDecreaseQty}
              onAddToCartClick={handleAddToCartClick}
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
              onShowToast={onShowToast}
            />
          </div>

          {/* ستون چپ */}
          <div className="lg:col-span-4 order-2">
            <ProductVisualGallery
              product={product}
              selectedFinish={selectedFinish}
              viewMode={viewMode}
              setViewMode={setViewMode}
              activeThumbIdx={activeThumbIdx}
              setActiveThumbIdx={setActiveThumbIdx}
              galleryImages={galleryImages}
            />
          </div>

        </div>

        {/* ۲. بخش نظرات کاربران */}
        <ProductReviewsSection
          reviewsList={reviewsList}
          onOpenAddReviewModal={() => setIsAddReviewModalOpen(true)}
        />

        {/* ۳. بخش محصولات مشابه */}
        <ProductRelatedCarousel
          relatedProducts={relatedProducts}
          onSelectProduct={onSelectProduct}
          onAddToCart={(prod, qty) => onAddToCart(prod, qty, selectedFinish)}
        />

      </div>

      {/* مودال‌های ویژگی‌ها و ثبت نظر */}
      <ProductModals
        isFeaturesModalOpen={isFeaturesModalOpen}
        onCloseFeaturesModal={() => setIsFeaturesModalOpen(false)}
        isAddReviewModalOpen={isAddReviewModalOpen}
        onCloseAddReviewModal={() => setIsAddReviewModalOpen(false)}
        newReviewAuthor={newReviewAuthor}
        setNewReviewAuthor={setNewReviewAuthor}
        newReviewComment={newReviewComment}
        setNewReviewComment={setNewReviewComment}
        newReviewRating={newReviewRating}
        setNewReviewRating={setNewReviewRating}
        onSubmitReview={handleAddReviewSubmit}
      />
    </div>
  );
};
