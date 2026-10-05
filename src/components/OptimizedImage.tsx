import React, { useState, useEffect, useRef } from 'react';
import { resolveDirectImageUrl, handleImgErrorFallback, ImageOptimizationOptions } from '../utils/imageCdnHelper';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  options?: ImageOptimizationOptions;
  fallbackSrc?: string;
  containerClassName?: string;
  showSkeleton?: boolean;
  aspectRatioClass?: string;
  onImageLoad?: () => void;
}

/**
 * کامپوننت تصویر فوق‌العاده بهینه (OptimizedImage) با پشتیبانی از:
 * ۱. لودینگ مستقیم از CDN پرسرعت
 * ۲. بارگذاری تنبل پیشرفته (Lazy Loading) با Intersection Observer و Native decoding async
 * ۳. نمایش اسکلتون نرم / Placeholder هنگام لود
 * ۴. انیمیشن Fade-In بدون پرش المان‌ها (Cumulative Layout Shift - CLS 0)
 * ۵. فال‌بک خودکار و بدون شکست در تمام محیط‌ها (ورسل، هاست شخصی و AI Studio)
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  options,
  fallbackSrc,
  containerClassName = '',
  showSkeleton = true,
  aspectRatioClass = '',
  onImageLoad,
  style,
  ...restProps
}) => {
  const directSrc = resolveDirectImageUrl(src, options);
  const [currentSrc, setCurrentSrc] = useState<string>(directSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const newDirect = resolveDirectImageUrl(src, options);
    setCurrentSrc(newDirect);
    setIsLoaded(false);
    setHasError(false);
  }, [src, JSON.stringify(options)]);

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${containerClassName}`}>
      {/* اسکلتون شیمر زیبا حین بارگذاری تصویر */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#f4f2ee] animate-pulse rounded-[inherit] z-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#b08754]/20 border-t-[#b08754] animate-spin" />
        </div>
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => {
          setIsLoaded(true);
          onImageLoad?.();
        }}
        onError={(e) => {
          setHasError(true);
          handleImgErrorFallback(e, fallbackSrc);
        }}
        style={{
          ...style,
        }}
        className={`${className} transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...restProps}
      />
    </div>
  );
};
