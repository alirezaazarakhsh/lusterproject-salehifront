/**
 * Direct Image CDN & High-Performance Lazy Loading Helper
 * گالری لوستر اکبر صالحی - پشتیبانی از CDN مستقیم و لودینگ فوق‌العاده سریع تصاویر در محیط Vercel و Production
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  fit?: 'crop' | 'clip' | 'scale';
}

/**
 * نقشه کامل و مستقیم CDN با کیفیت بالا و تحویل پرسرعت WebP برای تمامی محصولات و بخش‌های سایت
 */
export const CHANDELIER_CDN_MAP: Record<string, string> = {
  // ۱. محصولات اصلی و دسته‌بندی‌های لوستر
  shahMalakeh: '/src/assets/images/loster05_1_1791243643370.jpg',
  shakheh12: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&auto=format&fit=crop&q=85',
  ristani: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5c12?w=1200&auto=format&fit=crop&q=85',
  resansRoses: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=85',
  crystaliCherub: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
  crystaliGold: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=85',

  // ۲. بنر اصلی و پس‌زمینه‌ها
  heroBanner: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1920&auto=format&fit=crop&q=85',

  // ۳. پروژه‌های اجرا شده
  projectFereshteh: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=85',
  projectLobbyHotel: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&auto=format&fit=crop&q=85',
  projectMosqueDome: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=85',
  projectRoyalRestaurant: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5c12?w=1200&auto=format&fit=crop&q=85',
  projectDuplexVilla: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&auto=format&fit=crop&q=85',

  // ۴. استوری‌ها (قاب‌های پرتره عمودی)
  storyPortraitRustic: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&auto=format&fit=crop&q=85',
  storyPortraitAtrium: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=85',
  storyPortraitPalace: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85',

  // ۵. گالری و درباره ما
  aboutShowroom: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&auto=format&fit=crop&q=85',
  aboutGrandAtelier: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=85',
  aboutRoyalStaircase: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=85',
  aboutModernVilla: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5c12?w=1200&auto=format&fit=crop&q=85',
  aboutEmeraldPalace: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&auto=format&fit=crop&q=85',
  aboutCraftsmanship: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
};

export const CHANDELIER_CDN_FALLBACKS = CHANDELIER_CDN_MAP;

/**
 * تبدیل آدرس عکس به آدرس مستقیم و پایدار CDN همراه با پارامترهای بهینه‌سازی (عرض، فشرده‌سازی و فرمت)
 */
export function resolveDirectImageUrl(
  rawSrc?: string | null,
  options?: ImageOptimizationOptions
): string {
  if (!rawSrc || typeof rawSrc !== 'string' || rawSrc.trim() === '') {
    return CHANDELIER_CDN_MAP.crystaliGold;
  }

  const clean = rawSrc.trim();

  // اگر تصویر دیتا بیس ۶۴ یا بلاب باشد، مستقیماً برگردانده شود
  if (clean.startsWith('data:') || clean.startsWith('blob:')) {
    return clean;
  }

  // بررسی آدرس‌های آنلاین Unsplash و اعمال پارامترهای بهینه‌سازی
  if (clean.startsWith('https://images.unsplash.com')) {
    try {
      const url = new URL(clean);
      if (options?.width) url.searchParams.set('w', String(options.width));
      if (options?.height) url.searchParams.set('h', String(options.height));
      if (options?.quality) url.searchParams.set('q', String(options.quality));
      url.searchParams.set('auto', 'format');
      if (options?.fit) url.searchParams.set('fit', options.fit);
      return url.toString();
    } catch {
      return clean;
    }
  }

  // اگر آدرس آنلاین معتبر دیگری باشد
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // نگاشت مسیرهای لوکال `/assets/images/...` به CDN پرسرعت و پایدار در پروداکشن
  const lower = clean.toLowerCase();

  if (lower.includes('shah_malakeh') || lower.includes('shah-malakeh')) {
    return CHANDELIER_CDN_MAP.shahMalakeh;
  }
  if (lower.includes('12_shakheh') || lower.includes('12-shakheh')) {
    return CHANDELIER_CDN_MAP.shakheh12;
  }
  if (lower.includes('ristani')) {
    return CHANDELIER_CDN_MAP.ristani;
  }
  if (lower.includes('resans')) {
    return CHANDELIER_CDN_MAP.resansRoses;
  }
  if (lower.includes('cherub') || lower.includes('crystali_cherub')) {
    return CHANDELIER_CDN_MAP.crystaliCherub;
  }
  if (lower.includes('crystali')) {
    return CHANDELIER_CDN_MAP.crystaliGold;
  }
  if (lower.includes('hero') || lower.includes('banner')) {
    return CHANDELIER_CDN_MAP.heroBanner;
  }
  if (lower.includes('fereshteh')) {
    return CHANDELIER_CDN_MAP.projectFereshteh;
  }
  if (lower.includes('lobby')) {
    return CHANDELIER_CDN_MAP.projectLobbyHotel;
  }
  if (lower.includes('mosque') || lower.includes('dome')) {
    return CHANDELIER_CDN_MAP.projectMosqueDome;
  }
  if (lower.includes('restaurant') || lower.includes('royal')) {
    return CHANDELIER_CDN_MAP.projectRoyalRestaurant;
  }
  if (lower.includes('villa') || lower.includes('duplex')) {
    return CHANDELIER_CDN_MAP.projectDuplexVilla;
  }
  if (lower.includes('showroom')) {
    return CHANDELIER_CDN_MAP.aboutShowroom;
  }
  if (lower.includes('grand_atelier') || lower.includes('atelier')) {
    return CHANDELIER_CDN_MAP.aboutGrandAtelier;
  }
  if (lower.includes('staircase')) {
    return CHANDELIER_CDN_MAP.aboutRoyalStaircase;
  }
  if (lower.includes('emerald')) {
    return CHANDELIER_CDN_MAP.aboutEmeraldPalace;
  }
  if (lower.includes('craftsmanship')) {
    return CHANDELIER_CDN_MAP.aboutCraftsmanship;
  }
  if (lower.includes('rustic')) {
    return CHANDELIER_CDN_MAP.storyPortraitRustic;
  }
  if (lower.includes('atrium')) {
    return CHANDELIER_CDN_MAP.storyPortraitAtrium;
  }
  if (lower.includes('palace')) {
    return CHANDELIER_CDN_MAP.storyPortraitPalace;
  }

  // در صورتی که مسیر لوکال با هیچ‌کدام مطابقت نداشت ولی در محیط پروداکشن ممکن است مسیر فایل وجود داشته باشد:
  return clean;
}

/**
 * دریافت آدرس CDN فال‌بک تضمینی
 */
export function getFallbackCdnUrl(rawSrc?: string | null): string {
  return resolveDirectImageUrl(rawSrc);
}

/**
 * مدیریت خودکار رویداد خطا در تگ <img> با سوئیچ آنی به CDN مستقیم بدون نمایش آیکون تصویر شکسته
 */
export function handleImgErrorFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback?: string
) {
  const target = e.currentTarget;
  const currentSrc = target.src || '';
  
  if (target.dataset.fallbackTried === 'secondary') {
    // در صورت شکست مجدد، نمایش پس‌زمینه شفاف یا نگهدارنده امن
    target.style.opacity = '0.7';
    return;
  }

  if (target.dataset.fallbackTried === 'primary') {
    target.dataset.fallbackTried = 'secondary';
    target.src = CHANDELIER_CDN_MAP.crystaliGold;
    return;
  }

  target.dataset.fallbackTried = 'primary';
  const fallbackUrl = customFallback || resolveDirectImageUrl(currentSrc);
  
  // اگر آدرس فعلی با فال‌بک یکی بود، به تصویر طلایی کریستالی سوئیچ کند
  if (currentSrc === fallbackUrl) {
    target.src = CHANDELIER_CDN_MAP.crystaliGold;
  } else {
    target.src = fallbackUrl;
  }
}
