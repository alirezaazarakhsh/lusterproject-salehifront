import React, { useState } from 'react';
import { Box, RotateCcw } from 'lucide-react';
import { Bag, BagCross, NotificationBing } from 'iconsax-react';
import {
  ChandelierProduct,
  CARD_PLATING_FINISHES,
} from '../../data/chandelierData';
import {
  Chandelier3DViewer,
  FinishType,
  FINISH_PRESETS,
} from '../../components/Chandelier3DViewer';
import { TransparentProductImage } from '../../components/TransparentProductImage';

interface ProductRelatedCarouselProps {
  relatedProducts: ChandelierProduct[];
  onSelectProduct: (product: ChandelierProduct) => void;
  onAddToCart: (product: ChandelierProduct, qty: number) => void;
}

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

export const ProductRelatedCarousel: React.FC<ProductRelatedCarouselProps> = ({
  relatedProducts,
  onSelectProduct,
  onAddToCart,
}) => {
  const [active3DCards, setActive3DCards] = useState<Record<string, boolean>>({});
  const [cardFinishes, setCardFinishes] = useState<Record<string, FinishType>>({});

  if (relatedProducts.length === 0) return null;

  const toggleCard3D = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActive3DCards((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="mt-16 sm:mt-24" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
          محصولات مشابه
        </h3>
        <span className="text-xs font-bold text-[#b59766]">
          پیشنهاد ویژه گالری صالحی
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((item) => {
          const isOutOfStock = Boolean(item.outOfStock);
          const isCard3D = Boolean(active3DCards[item.id]);
          const currentFinish =
            cardFinishes[item.id] ||
            item.cardFinishOverride ||
            'original';
          const activeFinishPreset = FINISH_PRESETS[currentFinish];

          return (
            <div
              key={item.id}
              className="group shrink-0 flex flex-col justify-between bg-white rounded-[16px] border border-[#e5e5e5] p-3.5 sm:p-4 pb-5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div>
                <div
                  onClick={() => {
                    if (isOutOfStock) return;
                    if (!isCard3D) {
                      onSelectProduct(item);
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
                        modelType={item.modelType}
                        imageUrl={item.image}
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
                        src={item.image}
                        alt={item.name}
                        filterCss={activeFinishPreset?.filterCss || 'none'}
                        className={`w-full h-full max-h-[205px] max-w-full object-contain transition-transform duration-300 ${
                          isOutOfStock ? '' : 'group-hover:scale-[1.03]'
                        }`}
                      />
                    </div>
                  )}

                  {!isOutOfStock && (
                    <button
                      type="button"
                      onClick={(e) => toggleCard3D(item.id, e)}
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
                                  [item.id]: finishKey,
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
                                [item.id]: 'original',
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

                <div className="mt-4 px-1.5 text-right">
                  <h3
                    onClick={() => {
                      if (isOutOfStock) return;
                      onSelectProduct(item);
                    }}
                    className={`text-[17.5px] sm:text-[18.5px] font-bold text-[#1f1f1f] transition-colors ${
                      isOutOfStock
                        ? 'cursor-not-allowed'
                        : 'hover:text-[#b59766] cursor-pointer'
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#757575] font-medium mt-2.5">
                    {item.subtitle}
                  </p>
                  <p className="text-[14px] sm:text-[14.5px] font-semibold text-[#757575] mt-3.5 tabular-nums">
                    {item.priceFormatted}
                  </p>
                </div>
              </div>

              <div className="mt-5 px-1.5 flex flex-row items-center justify-between gap-2.5" dir="rtl">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(item)}
                    className="h-11 sm:h-12 min-w-[115px] sm:min-w-[142px] px-3.5 sm:px-6 rounded-[12px] text-[12.5px] sm:text-[13px] font-bold transition-colors whitespace-nowrap bg-[#f3f3f3] text-[#222222] hover:bg-[#242424] hover:text-white cursor-pointer"
                  >
                    مشاهده و خرید
                  </button>

                  <div className="relative shrink-0">
                    {isOutOfStock ? (
                      <button
                        type="button"
                        disabled
                        aria-label="محصول در انبار وجود ندارد"
                        className="w-12 h-12 rounded-[14px] bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center transition-colors cursor-not-allowed shrink-0"
                      >
                        <BagCross size="24" color="#ea1d2c" variant="Linear" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(item, 1)}
                        aria-label="افزودن به سبد خرید"
                        className="w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors cursor-pointer shrink-0 bg-[#f3f3f3] hover:bg-[#b59766] text-[#222222] hover:text-white"
                      >
                        <Bag size="24" color="currentColor" variant="Linear" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-left leading-tight shrink-0">
                  <span className="block text-[13px] font-bold text-[#2b2b2b]">
                    کد محصول
                  </span>
                  <span className="block text-[13px] font-medium text-[#757575] tabular-nums mt-1">
                    {item.productCode}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
