import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Box,
  RotateCcw,
} from 'lucide-react';
import { Bag, BagCross } from 'iconsax-react';
import { SectionHeading } from '../Ornaments';
import { ChandelierProduct, GENERATED_IMAGES } from '../../data/chandelierData';
import {
  Chandelier3DViewer,
  FinishType,
  FINISH_PRESETS,
} from '../Chandelier3DViewer';
import { TransparentProductImage } from '../TransparentProductImage';
import { navigateToProductCategory } from '../../utils/navigation';

interface ProductsCarouselSectionProps {
  sectionId: string;
  title: string;
  mobileTitle?: string;
  products: ChandelierProduct[];
  variant: 'salehi-collection' | 'best-sellers';
  cartProductIds?: string[];
  cartQuantities?: Record<string, number>;
  onOpenProductModal: (
    product: ChandelierProduct,
    selectedFinish?: FinishType
  ) => void;
  onAddToCart: (product: ChandelierProduct) => void;
}

/**
 * آیکون مربع گوشه‌گرد با علامت بعلاوه (+) دقیقاً مطابق دکمه طلایی کارت سمت راست در تصویر
 */
const PlusSquareIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="5.5" />
    <line x1="12" y1="8.5" x2="12" y2="15.5" />
    <line x1="8.5" y1="12" x2="15.5" y2="12" />
  </svg>
);

/**
 * فقط رنگ‌های واقعی و استاندارد قابل اجرا در آبکاری لوستر (بدون انتخابگر رنگ دلخواه غیرواقعی)
 */
const CARD_PLATING_FINISHES: FinishType[] = [
  'original',
  'gold-24k',
  'antique-bronze',
  'dark-patina',
  'royal-silver',
  'champagne',
  'rose-gold',
];

export const ProductsCarouselSection: React.FC<ProductsCarouselSectionProps> = ({
  sectionId,
  title,
  mobileTitle,
  products,
  variant,
  cartProductIds = [],
  cartQuantities = {},
  onOpenProductModal,
  onAddToCart,
}) => {
  const [active3DCards, setActive3DCards] = useState<Record<string, boolean>>({});
  const [cardFinishes, setCardFinishes] = useState<Record<string, FinishType>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [recentTooltipId, setRecentTooltipId] = useState<string | null>(null);
  const tooltipTimeoutRef = useRef<Record<string, number>>({});
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const desktopIndexRef = useRef<number>(0);
  const isButtonScrollingRef = useRef<boolean>(false);
  const buttonScrollTimeoutRef = useRef<number | null>(null);

  // استفاده مستقیم از محصولات دیتابیس (حداکثر ۲۰ محصول جدید)
  const limitedProducts = products.slice(0, 20);
  const allCarouselItems = limitedProducts.map((item, idx) => ({
    product: item,
    desktopOnly: idx >= 4,
  }));

  const handleCarouselScroll = () => {
    if (isButtonScrollingRef.current) return;
    const container = carouselRef.current;
    if (!container || window.innerWidth < 768) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-card="true"]')
    ).filter((el) => el.offsetParent !== null);
    if (cards.length === 0) return;

    const containerRight = container.getBoundingClientRect().right;
    let closestIdx = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const diff = Math.abs(card.getBoundingClientRect().right - containerRight);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    desktopIndexRef.current = closestIdx;
  };

  const scrollDesktopCarousel = (direction: 'next' | 'prev') => {
    const container = carouselRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-card="true"]')
    ).filter((el) => el.offsetParent !== null);
    if (cards.length === 0) return;

    const visibleCount = window.innerWidth >= 1024 ? 4 : 2;
    const maxStartIndex = Math.max(0, cards.length - visibleCount);

    let nextIndex = desktopIndexRef.current;
    if (direction === 'next') {
      nextIndex = nextIndex >= maxStartIndex ? 0 : nextIndex + 1;
    } else {
      nextIndex = nextIndex <= 0 ? maxStartIndex : nextIndex - 1;
    }
    desktopIndexRef.current = nextIndex;

    const targetCard = cards[nextIndex];
    if (!targetCard) return;

    isButtonScrollingRef.current = true;
    if (buttonScrollTimeoutRef.current) {
      window.clearTimeout(buttonScrollTimeoutRef.current);
    }
    buttonScrollTimeoutRef.current = window.setTimeout(() => {
      isButtonScrollingRef.current = false;
    }, 550);

    const containerRight = container.getBoundingClientRect().right;
    const targetRight = targetCard.getBoundingClientRect().right;
    const deltaX = targetRight - containerRight;

    container.scrollBy({
      left: deltaX,
      behavior: 'smooth',
    });
  };

  const triggerTemporaryTooltip = (productId: string) => {
    if (tooltipTimeoutRef.current[productId]) {
      window.clearTimeout(tooltipTimeoutRef.current[productId]);
    }
    setRecentTooltipId(productId);
    tooltipTimeoutRef.current[productId] = window.setTimeout(() => {
      setRecentTooltipId((prev) => (prev === productId ? null : prev));
    }, 2400);
  };

  const clearTemporaryTooltip = (productId: string) => {
    if (tooltipTimeoutRef.current[productId]) {
      window.clearTimeout(tooltipTimeoutRef.current[productId]);
      delete tooltipTimeoutRef.current[productId];
    }
    setRecentTooltipId((prev) => (prev === productId ? null : prev));
  };

  const toggleCard3D = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActive3DCards((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleViewAndBuyClick = (
    product: ChandelierProduct,
    finish: FinishType
  ) => {
    if (loadingMap[product.id]) return;
    setLoadingMap((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => {
      setLoadingMap((prev) => ({ ...prev, [product.id]: false }));
      const targetUrl = `/product/${encodeURIComponent(product.id)}`;
      try {
        window.history.pushState(
          { route: 'product', productCategorySlug: product.id },
          '',
          targetUrl
        );
      } catch {
        window.location.hash = `#/product/${encodeURIComponent(product.id)}`;
      }
      window.dispatchEvent(
        new CustomEvent('app-route-change', { detail: 'product' })
      );
    }, 400);
  };

  const handleAddClick = (product: ChandelierProduct) => {
    if (product.outOfStock) {
      triggerTemporaryTooltip(product.id);
      return;
    }
    onAddToCart(product);
    triggerTemporaryTooltip(product.id);
  };

  return (
    <section
      id={sectionId}
      className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-10 overflow-hidden"
    >
      <SectionHeading title={title} mobileTitle={mobileTitle} className="mb-6 sm:mb-10" />

      {/* در موبایل کاروسل افقی عریض با پوزیشن چسبیده به راست (کاملاً دست‌نخورده) و در دسکتاپ کاروسل افقی ۴ ستونه */}
      <div
        ref={carouselRef}
        onScroll={handleCarouselScroll}
        className="flex gap-3.5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pr-4 pl-6 xs:pr-5 xs:pl-8 md:px-0 py-2 touch-pan-x [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCarouselItems.map(({ product, desktopOnly }) => {
          const isOutOfStock = Boolean(product.outOfStock);
          const qtyInCart = cartQuantities[product.id] || 0;
          const isHighlighted =
            !isOutOfStock && (qtyInCart > 0 || cartProductIds.includes(product.id));
          const isCard3D = Boolean(active3DCards[product.id]);
          const currentFinish = cardFinishes[product.id] || 'original';
          const activeFinishPreset = FINISH_PRESETS[currentFinish];

          const isTooltipActive = recentTooltipId === product.id;
          const showOutOfStockTooltip = isOutOfStock && isTooltipActive;
          const showAddedTooltip =
            !isOutOfStock && qtyInCart > 0 && isTooltipActive;

          return (
            <div
              key={`${sectionId}-${product.id}`}
              data-carousel-card="true"
              onMouseLeave={() => {
                clearTemporaryTooltip(product.id);
              }}
              className={`group shrink-0 snap-start w-[83vw] max-w-[345px] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] md:max-w-none bg-white rounded-[16px] border border-[#e5e5e5] p-3.5 sm:p-4 pb-5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.06)] transition-all duration-300 ${
                desktopOnly ? 'hidden md:flex' : 'flex'
              } flex-col justify-between`}
            >
              <div>
                {/* باکس عریض‌تر عکس با پس‌زمینه طوسی کم‌رنگ و گوشه‌های گرد */}
                <div
                  onClick={() => {
                    if (isOutOfStock) {
                      triggerTemporaryTooltip(product.id);
                      return;
                    }
                    if (!isCard3D) {
                      onOpenProductModal(product, currentFinish);
                    }
                  }}
                  className={`relative w-full h-56 sm:h-60 rounded-[12px] bg-[#f5f5f5] flex items-center justify-center overflow-hidden ${
                    isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isCard3D ? (
                    <div
                      className="w-full h-full rounded-[12px] overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Chandelier3DViewer
                        modelType={product.modelType}
                        imageUrl={product.image}
                        initialFinish={currentFinish}
                        initialTheme="light"
                        compact
                        showControls={false}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center p-2.5">
                      <TransparentProductImage
                        src={product.image}
                        alt={product.name}
                        filterCss={activeFinishPreset?.filterCss || 'none'}
                        className={`w-full h-full max-h-[205px] max-w-full object-contain transition-transform duration-300 ${
                          isOutOfStock ? '' : 'group-hover:scale-[1.03]'
                        }`}
                      />
                    </div>
                  )}

                  {/* دکمه تغییر بین عکس و مدل سه‌بعدی */}
                  {!isOutOfStock && (
                    <button
                      type="button"
                      onClick={(e) => toggleCard3D(product.id, e)}
                      title={
                        isCard3D
                          ? 'بازگشت به تصویر محصول'
                          : 'تبدیل فوری به مدل سه‌بعدی (3D)'
                      }
                      className={`absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                        isCard3D
                          ? 'bg-[#b59766] text-white opacity-100'
                          : 'bg-white/95 hover:bg-[#262626] text-[#262626] hover:text-white border border-[#e5e5e5] opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Box className="w-3 h-3" />
                      <span>{isCard3D ? 'نمای 3D فعال' : '3D خودکار'}</span>
                    </button>
                  )}

                  {/* نوار انتخاب رنگ‌های واقعی آبکاری لوستر روی کارت (برای محصولات موجود) */}
                  {!isOutOfStock && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#e8e4dc] shadow-2xs transition-opacity ${
                        currentFinish !== 'original' || isCard3D
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {CARD_PLATING_FINISHES.map((finishKey) => {
                          const preset = FINISH_PRESETS[finishKey];
                          return (
                            <button
                              key={finishKey}
                              type="button"
                              onClick={() =>
                                setCardFinishes((prev) => ({
                                  ...prev,
                                  [product.id]: finishKey,
                                }))
                              }
                              title={preset.label}
                              className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                                currentFinish === finishKey
                                  ? 'scale-125 border-[#222222] ring-1 ring-[#b59766]'
                                  : 'border-black/20 hover:scale-110'
                              }`}
                              style={{
                                background: preset.swatch,
                              }}
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-medium text-[#666] truncate max-w-[90px]">
                          {activeFinishPreset.label}
                        </span>
                        {currentFinish !== 'original' && (
                          <button
                            type="button"
                            onClick={() =>
                              setCardFinishes((prev) => ({
                                ...prev,
                                [product.id]: 'original',
                              }))
                            }
                            title="بازنشانی به رنگ اصلی"
                            className="text-[10px] text-[#666] hover:text-[#222] flex items-center cursor-pointer"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* عنوان، زیرعنوان و قیمت محصول */}
                <div className="mt-4 px-1.5 text-right">
                  <h3
                    onClick={() => {
                      if (isOutOfStock) {
                        triggerTemporaryTooltip(product.id);
                        return;
                      }
                      onOpenProductModal(product, currentFinish);
                    }}
                    className={`text-[17.5px] sm:text-[18.5px] font-bold text-[#1f1f1f] transition-colors ${
                      isOutOfStock
                        ? 'cursor-not-allowed'
                        : 'hover:text-[#b59766] cursor-pointer'
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#757575] font-medium mt-2.5">
                    {product.subtitle}
                  </p>
                  <p className="text-[14px] sm:text-[14.5px] font-semibold text-[#757575] mt-3.5 tabular-nums">
                    {product.priceFormatted}
                  </p>
                </div>
              </div>

              {/* نوار پایین کارت: دکمه‌های مشاهده و خرید در راست، دکمه سبد خرید با تولتیپ در وسط، و کد محصول در چپ */}
              <div className="mt-5 px-1.5 flex flex-row items-center justify-between gap-2.5" dir="rtl">
                <div className="flex items-center gap-2.5">
                  {loadingMap[product.id] ? (
                    <button
                      type="button"
                      disabled
                      className="h-12 min-w-[142px] px-6 rounded-[15px] bg-[#242424] text-white flex items-center justify-center gap-2 transition-all cursor-wait"
                      title="در حال بارگذاری..."
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-white/45 animate-pulse [animation-delay:160ms]" />
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse [animation-delay:320ms]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleViewAndBuyClick(product, currentFinish)}
                      className="h-11 sm:h-12 min-w-[115px] sm:min-w-[142px] px-3.5 sm:px-6 rounded-[12px] text-[12.5px] sm:text-[13px] font-bold transition-colors whitespace-nowrap bg-[#f3f3f3] text-[#222222] hover:bg-[#242424] hover:text-white cursor-pointer"
                    >
                      مشاهده و خرید
                    </button>
                  )}

                  {/* دکمه افزودن به سبد خرید / وضعیت ناموجود به همراه تولتیپ موقت در زمان افزودن یا هاور */}
                  <div
                    className="relative shrink-0"
                    onMouseEnter={() => {
                      if (isOutOfStock || qtyInCart > 0) {
                        triggerTemporaryTooltip(product.id);
                      }
                    }}
                    onMouseLeave={() => {
                      clearTemporaryTooltip(product.id);
                    }}
                  >
                    {isOutOfStock ? (
                      <>
                        {/* تولتیپ قرمز/صورتی «محصول در انبار وجود ندارد!» فقط هنگام هاور یا تلاش برای انتخاب */}
                        <div
                          className={`absolute bottom-[calc(100%+11px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-200 ${
                            showOutOfStockTooltip
                              ? 'opacity-100 translate-y-0 scale-100'
                              : 'opacity-0 translate-y-1 scale-95'
                          }`}
                        >
                          <div className="relative bg-[#fde8ea] text-[#ea1d2c] text-[12px] font-bold px-3.5 py-2.5 rounded-[11px] whitespace-nowrap shadow-xs">
                            محصول در انبار وجود ندارد!
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fde8ea] rotate-45 rounded-[2px]" />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddClick(product)}
                          aria-label="محصول در انبار وجود ندارد"
                          className="w-12 h-12 rounded-[12px] bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center transition-colors cursor-not-allowed shrink-0"
                        >
                          <BagCross size="24" color="#ea1d2c" variant="Linear" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* تولتیپ تیره «X محصول اضافه شد» هنگام افزودن به سبد خرید (موقت) یا هاور */}
                        <div
                          className={`absolute bottom-[calc(100%+11px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-200 ${
                            showAddedTooltip
                              ? 'opacity-100 translate-y-0 scale-100'
                              : 'opacity-0 translate-y-1 scale-95'
                          }`}
                        >
                          <div className="relative bg-[#2b2b2b] text-white text-[12px] font-bold px-3.5 py-2.5 rounded-[11px] whitespace-nowrap shadow-md">
                            {qtyInCart.toLocaleString('fa-IR')} محصول اضافه شد
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2b2b2b] rotate-45 rounded-[2px]" />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddClick(product)}
                          aria-label="افزودن به سبد خرید"
                          className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isHighlighted
                              ? 'bg-[#b59766] hover:bg-[#a38554] text-white'
                              : 'bg-[#f3f3f3] hover:bg-[#b59766] text-[#222222] hover:text-white'
                          }`}
                        >
                          {isHighlighted ? (
                            <PlusSquareIcon className="w-[22px] h-[22px]" />
                          ) : (
                            <Bag size="24" color="currentColor" variant="Linear" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* سمت چپ: کد محصول ۱۲۸۹۸۲ */}
                <div className="text-left leading-tight shrink-0">
                  <span className="block text-[13px] font-bold text-[#2b2b2b]">
                    کد محصول
                  </span>
                  <span className="block text-[13px] font-medium text-[#757575] tabular-nums mt-1">
                    {product.productCode}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* کارت عمودی «مشاهده محصولات» در انتهای کاروسل موبایل (باریک‌تر و با فاصله بیشتر، دقیقاً مطابق Screenshot 2026-09-30 at 03.39.14.png) */}
        <a
          href="/product/categories/chandeliers"
          onClick={(e) => {
            navigateToProductCategory('chandeliers', e);
          }}
          className="md:hidden shrink-0 snap-center h-[200px] xs:h-[220px] my-auto w-[38px] xs:w-[42px] mr-2 xs:mr-3 rounded-[14px] xs:rounded-[16px] bg-[#c7a975] hover:bg-[#b59766] active:bg-[#9e7f4c] text-white flex items-center justify-center cursor-pointer shadow-sm transition-all self-center"
        >
          <span
            className="font-bold text-[12px] xs:text-[13px] tracking-wider text-white select-none whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            مشاهده محصولات
          </span>
        </a>
      </div>

      {/* دکمه‌های صفحه‌بندی پایین بخش (فقط در دسکتاپ و زمانی که محصولات بیشتر از ۴ تا باشند) */}
      {allCarouselItems.length > 4 && (
        <div className="hidden md:flex mt-8 items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollDesktopCarousel('prev')}
            aria-label="قبلی"
            className="w-10 h-10 rounded-[8px] bg-white hover:bg-[#b59766] hover:text-white hover:border-[#b59766] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <a
            href="/product/categories/chandeliers"
            onClick={(e) => navigateToProductCategory('chandeliers', e)}
            className="h-10 px-6 rounded-[8px] bg-white hover:bg-[#b59766] text-[#b59766] hover:text-white border border-[#c9b28b] text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
          >
            مشاهده محصولات
          </a>

          <button
            type="button"
            onClick={() => scrollDesktopCarousel('next')}
            aria-label="بعدی"
            className="w-10 h-10 rounded-[8px] bg-white hover:bg-[#b59766] hover:text-white hover:border-[#b59766] border border-[#e5e5e5] flex items-center justify-center text-[#444] transition-colors cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
