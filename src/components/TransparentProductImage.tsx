import React, { useEffect, useState } from 'react';
import { removeImageWhiteBackground } from '../utils/removeBackground';

interface TransparentProductImageProps {
  src: string;
  alt: string;
  className?: string;
  filterCss?: string;
  customHexColor?: string | null;
}

/**
 * کامپوننت تصویر محصول بدون پس‌زمینه (Transparent Cutout)
 * به صورت خودکار پس‌زمینه سفید هر عکس محصول را حذف می‌کند
 * و در صورت انتخاب رنگ دلخواه توسط کاربر، فقط بدنه خود لوستر را رنگ‌آمیزی می‌کند.
 */
export const TransparentProductImage: React.FC<TransparentProductImageProps> = ({
  src,
  alt,
  className = '',
  filterCss = 'none',
  customHexColor = null,
}) => {
  const [cleanSrc, setCleanSrc] = useState<string>(src);
  const [tintedSrc, setTintedSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    removeImageWhiteBackground(src).then((result) => {
      if (isMounted) {
        setCleanSrc(result);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [src]);

  // اگر کاربر رنگ دلخواه آزاد (Custom Hex) انتخاب کرده باشد، فقط پیکسل‌های غیرشفاف لوستر رنگ می‌شوند
  useEffect(() => {
    if (!customHexColor) {
      setTintedSrc(null);
      return;
    }

    let isMounted = true;
    const img = new Image();
    if (cleanSrc.startsWith('http') && !cleanSrc.includes(window.location.host)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const hex = customHexColor.replace('#', '');
        const tr = parseInt(hex.substring(0, 2), 16) || 212;
        const tg = parseInt(hex.substring(2, 4), 16) || 175;
        const tb = parseInt(hex.substring(4, 6), 16) || 55;

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 10) continue;

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // حفظ بخش‌های خیلی روشن (لامپ‌ها و گل‌های سفید) و اعمال رنگ فلزی روی بدنه
          if (lum > 0.88) continue;

          const shade = Math.pow(lum, 0.85) * 1.15;
          data[i] = Math.min(255, Math.round(r * 0.25 + tr * shade * 0.75));
          data[i + 1] = Math.min(255, Math.round(g * 0.25 + tg * shade * 0.75));
          data[i + 2] = Math.min(255, Math.round(b * 0.25 + tb * shade * 0.75));
        }

        ctx.putImageData(imgData, 0, 0);
        if (isMounted) {
          setTintedSrc(canvas.toDataURL('image/png'));
        }
      } catch {
        if (isMounted) setTintedSrc(null);
      }
    };
    img.src = cleanSrc;

    return () => {
      isMounted = false;
    };
  }, [cleanSrc, customHexColor]);

  return (
    <img
      src={tintedSrc || cleanSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      style={{
        filter: customHexColor ? 'none' : filterCss,
      }}
      className={className}
    />
  );
};
