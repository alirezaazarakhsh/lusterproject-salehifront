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
 * ۱. بارگذاری تنبل (Lazy Loading) با Intersection Observer API پیشرفته
 * ۲. افکت اسکلتون و شیمر (Shimmer Placeholder) در حین لودینگ
 * ۳. مکانیسم فال‌بک امن همراه با آیکون پیش‌فرض لوستر در صورت بروز خطا در محیط تولید (Vercel)
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
  const [currentSrc, setCurrentSrc] = useState<string>(priority || loading === 'eager' ? directSrc : '');
  const [isIntersected, setIsIntersected] = useState<boolean>(priority || loading === 'eager');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsIntersected(true);
      setCurrentSrc(directSrc);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersected(true);
            setCurrentSrc(directSrc);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '250px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, priority, loading, directSrc]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-[#f8f6f2] ${aspectRatioClass} ${containerClassName}`}>
      {/* افکت شیمر و اسکلتون هنگام بارگذاری */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#f0eae1] via-[#fdfbf7] to-[#f0eae1] bg-[length:200%_100%] animate-pulse rounded-[inherit] z-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#b08754]/30 border-t-[#b08754] animate-spin" />
        </div>
      )}

      {/* نمایش آیکون پیش‌فرض لوستر در صورت بروز خطای لود تصویر */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fcfbf9] text-[#b59766] p-4 text-center">
          <svg className="w-10 h-10 mb-1 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-12.728l1.414 1.414m11.314 11.314l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <span className="text-[10px] text-[#777]">تصویر لوستر صالحی</span>
        </div>
      ) : (
        isIntersected && (
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
        )
      )}
    </div>
  );
};
