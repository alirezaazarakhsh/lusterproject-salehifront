import React from 'react';
import { ChandelierProduct, GENERATED_IMAGES } from '../../data/chandelierData';
import { Chandelier3DViewer, FinishType } from '../../components/Chandelier3DViewer';
import { OptimizedImage } from '../../components/OptimizedImage';
import { resolveDirectImageUrl, handleImgErrorFallback } from '../../utils/imageCdnHelper';

interface ProductVisualGalleryProps {
  product: ChandelierProduct;
  selectedFinish: FinishType;
  viewMode: '3d' | 'photo';
  setViewMode: (mode: '3d' | 'photo') => void;
  activeThumbIdx: number;
  setActiveThumbIdx: (idx: number) => void;
  galleryImages: string[];
}

const SearchNormalIcon: React.FC<{ className?: string }> = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="#333333" strokeWidth="1.8"/>
    <path d="M20 20L16 16" stroke="#333333" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="1.5" stroke="#333333" strokeWidth="1.5"/>
  </svg>
);

export const ProductVisualGallery: React.FC<ProductVisualGalleryProps> = ({
  product,
  selectedFinish,
  viewMode,
  setViewMode,
  activeThumbIdx,
  setActiveThumbIdx,
  galleryImages,
}) => {
  return (
    <div className="lg:col-span-6 flex flex-col order-2 lg:order-2 space-y-4">
      {/* باکس نمایش اصلی (عکس یا استودیو ۳بعدی) */}
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[490px] rounded-[32px] bg-white border border-[#e8ded0] overflow-hidden flex items-center justify-center shadow-xs group">
        {viewMode === '3d' ? (
          <div className="w-full h-full relative bg-[#fcfbf9]">
            <Chandelier3DViewer
              modelType={product.modelType || 'shah-malakeh'}
              imageUrl={product.image || GENERATED_IMAGES.shahMalakeh}
              initialFinish={selectedFinish}
              onFinishChange={() => {}}
              showControls={true}
              className="w-full h-full"
            />
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#e5dec9] text-xs font-extrabold text-[#b59766] shadow-sm">
              مدل سه‌بعدی ۳۶۰ درجه
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center p-6 bg-[#fbfaf7]">
            <OptimizedImage
              src={resolveDirectImageUrl(galleryImages[activeThumbIdx] || product.image || GENERATED_IMAGES.shahMalakeh)}
              alt={product.name}
              className="w-full h-full object-contain max-h-[85%] transition-all duration-300 transform scale-95 group-hover:scale-100"
              onError={handleImgErrorFallback}
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#e5dec9] text-[11px] font-extrabold text-[#777] shadow-2xs">
              تصویر باکیفیت گالری
            </div>
          </div>
        )}

        {/* دکمه تغییر حالت بین عکس و نمای سه‌بعدی */}
        <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'photo'
                ? 'bg-[#111] text-white shadow-md'
                : 'bg-white/90 hover:bg-white text-[#333] border border-[#e5dec9]'
            }`}
          >
            تصاویر گالری
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-[#111] text-white shadow-md'
                : 'bg-white/90 hover:bg-white text-[#333] border border-[#e5dec9]'
            }`}
          >
            <SearchNormalIcon className="w-4 h-4" />
            <span>نمای ۳۶۰ درجه سه‌بعدی</span>
          </button>
        </div>
      </div>

      {/* تصاویر بندانگشتی (Thumbnails) */}
      <div className="grid grid-cols-4 gap-3">
        {galleryImages.map((imgSrc, idx) => {
          const isActive = viewMode === 'photo' && activeThumbIdx === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setViewMode('photo');
                setActiveThumbIdx(idx);
              }}
              className={`relative h-20 sm:h-24 rounded-2xl bg-white border overflow-hidden p-2 transition-all cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'border-[#b59766] ring-2 ring-[#b59766]/30 shadow-sm scale-[1.02]'
                  : 'border-[#e8ded0] hover:border-[#b59766] opacity-80 hover:opacity-100'
              }`}
            >
              <OptimizedImage
                src={resolveDirectImageUrl(imgSrc)}
                alt={`${product.name} ${idx + 1}`}
                className="w-full h-full object-contain"
                onError={handleImgErrorFallback}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
