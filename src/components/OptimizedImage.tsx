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
 * ۱. لودینگ مستقیم از CDN پرسرعت و مسیرهای استاتیک
 * ۲. بارگذاری تنبل پیشرفته (Lazy Loading) با Native decoding async
 * ۳. نمایش فوری و بدون تاخیر (بدون پرش و بدون مخفی‌سازی opacity-0)
 * ۴. فال‌بک خودکار و بدون شکست در تمام محیط‌ها (ورسل، هاست شخصی و AI Studio)
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'eager',
  priority = false,
  options,
  fallbackSrc,
  containerClassName = '',
  showSkeleton = false,
  aspectRatioClass = '',
  onImageLoad,
  style,
  ...restProps
}) => {
  const directSrc = resolveDirectImageUrl(src, options);
  const [currentSrc, setCurrentSrc] = useState<string>(directSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const newDirect = resolveDirectImageUrl(src, options);
    setCurrentSrc(newDirect);
    setIsLoaded(true);
    setHasError(false);
  }, [src, JSON.stringify(options)]);

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${containerClassName}`}>
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
        className={`${className} opacity-100`}
        {...restProps}
      />
    </div>
  );
};
