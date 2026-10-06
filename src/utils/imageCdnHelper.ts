export interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: string;
}

export function resolveDirectImageUrl(rawUrl: string, options?: ImageOptimizationOptions): string {
  if (!rawUrl) return '';
  try {
    let url = String(rawUrl).trim();

    // Automatically normalize /src/assets/ or src/assets/ to /assets/ for production rendering
    url = url.replace(/^(https?:\/\/[^\/]+)?\/?src\/assets\//i, '$1/assets/');

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
    return rawUrl;
  }
}

export function getFallbackCdnUrl(url: string): string {
  return resolveDirectImageUrl(url);
}

export function handleImgErrorFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) {
  const target = e.currentTarget;
  if (fallbackUrl && target.src !== fallbackUrl) {
    target.src = resolveDirectImageUrl(fallbackUrl);
    return;
  }
  if (!target.src.includes('images.unsplash.com')) {
    target.src = 'https://images.unsplash.com/photo-1543157145-f761c5f6617a?w=800&auto=format&fit=crop&q=80';
  }
}
