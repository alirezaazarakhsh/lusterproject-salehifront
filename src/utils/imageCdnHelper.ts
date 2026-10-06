export interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: string;
}

export function resolveDirectImageUrl(url: string, options?: ImageOptimizationOptions): string {
  if (!url) return '';
  try {
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    if (url.includes('images.unsplash.com')) {
      const u = new URL(url);
      if (options?.width && !u.searchParams.has('w')) {
        u.searchParams.set('w', String(options.width));
      }
      if (options?.quality && !u.searchParams.has('q')) {
        u.searchParams.set('q', String(options.quality));
      }
      if (!u.searchParams.has('auto')) {
        u.searchParams.set('auto', 'format,compress');
      }
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}

export function getFallbackCdnUrl(url: string): string {
  return url;
}

export function handleImgErrorFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) {
  const target = e.currentTarget;
  if (fallbackUrl && target.src !== fallbackUrl) {
    target.src = fallbackUrl;
    return;
  }
  if (!target.src.includes('images.unsplash.com')) {
    target.src = 'https://images.unsplash.com/photo-1543157145-f761c5f6617a?w=600&auto=format&fit=crop&q=80';
  }
}
