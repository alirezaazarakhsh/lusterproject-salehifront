export type AppRoute =
  | 'home'
  | 'rule'
  | 'contact-us'
  | 'about-us'
  | 'project'
  | 'product'
  | 'admin'
  | 'not-found'
  | 'server-error';

export interface AdminRouteInfo {
  tab: string;
  settingsTab?: string;
}

export const getAdminRouteFromLocation = (): AdminRouteInfo => {
  if (typeof window === 'undefined') return { tab: 'dashboard' };
  const raw = window.location.pathname.toLowerCase();
  const parts = raw.split('/').filter(Boolean);
  const adminIdx = parts.indexOf('admin');
  if (adminIdx >= 0) {
    const tab = parts[adminIdx + 1] || 'dashboard';
    const settingsTab = parts[adminIdx + 2];
    return { tab, ...(settingsTab ? { settingsTab } : {}) };
  }
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const hashParts = hash.split('/').filter(Boolean);
  const hashAdminIdx = hashParts.indexOf('admin');
  if (hashAdminIdx >= 0) {
    const tab = hashParts[hashAdminIdx + 1] || 'dashboard';
    const settingsTab = hashParts[hashAdminIdx + 2];
    return { tab, ...(settingsTab ? { settingsTab } : {}) };
  }
  return { tab: 'dashboard' };
};

export const VALID_HOME_HASHES = new Set([
  '',
  '#',
  '#top',
  '#collection-salehi',
  '#best-sellers',
  '#executed-projects',
  '#magazine-section',
  '#about-services',
  '#footer-contact',
]);

let currentMemoryRoute: AppRoute | null = null;
let currentMemoryProjectSlug: string | null = null;
let currentMemoryProductCategorySlug: string | null = null;
let currentMemoryProductSlug: string | null = null;
const routeListeners = new Set<(route: AppRoute) => void>();

const normalizeProjectSlugInput = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const cleaned = decodeURIComponent(String(value)).trim().replace(/^\/+|\/+$/g, '');
  if (!cleaned) return null;

  const pathMatch = cleaned.match(/^(?:project|projects)\/(.+)$/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1].trim();
  }

  const hashMatch = cleaned.match(/^#?(?:\/)?(?:project|projects)\/(.+)$/i);
  if (hashMatch && hashMatch[1]) {
    return hashMatch[1].trim();
  }

  return cleaned.replace(/^#\/?/, '').trim() || null;
};

export const extractProjectSlugFromLocation = (): string | null => {
  if (typeof window === 'undefined') return null;

  const rawPathname = decodeURIComponent(window.location.pathname);
  const cleanPathname =
    rawPathname.length > 1 && rawPathname.endsWith('/')
      ? rawPathname.slice(0, -1)
      : rawPathname;

  const pathMatch = cleanPathname.match(/^\/(?:project|projects)\/([^/?#]+)$/i);
  if (pathMatch && pathMatch[1]) {
    return normalizeProjectSlugInput(pathMatch[1]);
  }

  const rawHash = decodeURIComponent(window.location.hash);
  const hashMatch = rawHash.match(/^#\/?(?:project|projects)\/([^/?#]+)$/i);
  if (hashMatch && hashMatch[1]) {
    return normalizeProjectSlugInput(hashMatch[1]);
  }

  const searchParams = new URLSearchParams(window.location.search);
  const querySlug = searchParams.get('slug') || searchParams.get('project');
  return normalizeProjectSlugInput(querySlug);
};

export const extractProductCategorySlugFromLocation = (): string | null => {
  if (typeof window === 'undefined') return null;

  const rawPathname = decodeURIComponent(window.location.pathname);
  const cleanPathname =
    rawPathname.length > 1 && rawPathname.endsWith('/')
      ? rawPathname.slice(0, -1)
      : rawPathname;

  const catPathMatch = cleanPathname.match(
    /^\/(?:product|products)\/(?:categories|category)\/([^/?#]+)$/i
  );
  if (catPathMatch && catPathMatch[1]) {
    return catPathMatch[1].trim();
  }

  const directPathMatch = cleanPathname.match(
    /^\/(?:product|products)\/([^/?#]+)$/i
  );
  if (
    directPathMatch &&
    directPathMatch[1] &&
    directPathMatch[1].toLowerCase() !== 'categories' &&
    directPathMatch[1].toLowerCase() !== 'category'
  ) {
    return directPathMatch[1].trim();
  }

  const rawHash = decodeURIComponent(window.location.hash);
  const catHashMatch = rawHash.match(
    /^#\/?(?:product|products)\/(?:categories|category)\/([^/?#]+)$/i
  );
  if (catHashMatch && catHashMatch[1]) {
    return catHashMatch[1].trim();
  }

  const directHashMatch = rawHash.match(
    /^#\/?(?:product|products)\/([^/?#]+)$/i
  );
  if (
    directHashMatch &&
    directHashMatch[1] &&
    directHashMatch[1].toLowerCase() !== 'categories' &&
    directHashMatch[1].toLowerCase() !== 'category'
  ) {
    return directHashMatch[1].trim();
  }

  const searchParams = new URLSearchParams(window.location.search);
  const queryCategory = searchParams.get('category');
  if (queryCategory) {
    return queryCategory.trim();
  }

  return null;
};

export const extractProductSlugFromLocation = (): string | null => {
  if (typeof window === 'undefined') return null;

  const rawPathname = decodeURIComponent(window.location.pathname);
  const cleanPathname =
    rawPathname.length > 1 && rawPathname.endsWith('/')
      ? rawPathname.slice(0, -1)
      : rawPathname;

  const catPathMatch = cleanPathname.match(
    /^\/(?:product|products)\/(?:categories|category)\/([^/?#]+)$/i
  );
  if (catPathMatch) return null;

  const directPathMatch = cleanPathname.match(
    /^\/(?:product|products)\/([^/?#]+)$/i
  );
  if (
    directPathMatch &&
    directPathMatch[1] &&
    directPathMatch[1].toLowerCase() !== 'categories' &&
    directPathMatch[1].toLowerCase() !== 'category'
  ) {
    return directPathMatch[1].trim();
  }

  const rawHash = decodeURIComponent(window.location.hash);
  const directHashMatch = rawHash.match(
    /^#\/?(?:product|products)\/([^/?#]+)$/i
  );
  if (
    directHashMatch &&
    directHashMatch[1] &&
    directHashMatch[1].toLowerCase() !== 'categories' &&
    directHashMatch[1].toLowerCase() !== 'category'
  ) {
    return directHashMatch[1].trim();
  }

  const searchParams = new URLSearchParams(window.location.search);
  const querySlug =
    searchParams.get('product') ||
    searchParams.get('productSlug') ||
    searchParams.get('slug');
  if (querySlug) return querySlug.trim();

  return null;
};

export const getCurrentProductSlug = (): string | null => {
  const detected = extractProductSlugFromLocation();
  if (detected) {
    currentMemoryProductSlug = detected;
    return detected;
  }
  if (currentMemoryProductSlug !== null) {
    return currentMemoryProductSlug;
  }
  return null;
};

export const navigateToProductSlug = (
  slug: string | null,
  eventOrOptions?: { preventDefault?: () => void } | null
) => {
  if (eventOrOptions && typeof eventOrOptions.preventDefault === 'function') {
    eventOrOptions.preventDefault();
  }
  const cleanSlug = slug ? slug.trim().replace(/^\/+|\/+$/g, '') : null;
  currentMemoryRoute = 'product';
  currentMemoryProjectSlug = null;
  currentMemoryProductCategorySlug = null;
  currentMemoryProductSlug = cleanSlug;

  if (typeof window !== 'undefined') {
    const targetUrl = cleanSlug
      ? `/product/${encodeURIComponent(cleanSlug)}`
      : '/product';
    try {
      window.history.pushState(
        { route: 'product', productSlug: cleanSlug },
        '',
        targetUrl
      );
    } catch {
      window.location.hash = cleanSlug
        ? `#/product/${encodeURIComponent(cleanSlug)}`
        : '#/product';
    }

    routeListeners.forEach((fn) => fn('product'));
    window.dispatchEvent(
      new CustomEvent('app-route-change', { detail: 'product' })
    );
    window.dispatchEvent(
      new CustomEvent('app-product-slug-change', { detail: cleanSlug })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export const getCurrentProjectSlug = (): string | null => {
  const detectedSlug = extractProjectSlugFromLocation();
  if (detectedSlug) {
    currentMemoryProjectSlug = detectedSlug;
    return detectedSlug;
  }
  if (currentMemoryProjectSlug !== null) {
    return currentMemoryProjectSlug;
  }
  return null;
};

export const getCurrentProductCategorySlug = (): string | null => {
  const detectedCategory = extractProductCategorySlugFromLocation();
  if (detectedCategory) {
    currentMemoryProductCategorySlug = detectedCategory;
    return detectedCategory;
  }
  if (currentMemoryProductCategorySlug !== null) {
    return currentMemoryProductCategorySlug;
  }
  return null;
};

export const getProductCategorySlugFromLocation =
  getCurrentProductCategorySlug;

export const detectRouteFromLocation = (): AppRoute => {
  if (typeof window === 'undefined') return 'home';
  const rawPathname = window.location.pathname.toLowerCase();
  const pathname =
    rawPathname.length > 1 && rawPathname.endsWith('/')
      ? rawPathname.slice(0, -1)
      : rawPathname;
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (
    pathname === '/rule' ||
    pathname.endsWith('/rule') ||
    hash === '#rule' ||
    hash === '#/rule' ||
    search.includes('page=rule')
  ) {
    return 'rule';
  }
  if (
    pathname === '/contact-us' ||
    pathname.endsWith('/contact-us') ||
    hash === '#contact-us' ||
    hash === '#/contact-us' ||
    search.includes('page=contact-us')
  ) {
    return 'contact-us';
  }
  if (
    pathname === '/about-us' ||
    pathname.endsWith('/about-us') ||
    hash === '#about-us' ||
    hash === '#/about-us' ||
    search.includes('page=about-us')
  ) {
    return 'about-us';
  }
  if (
    pathname === '/project' ||
    pathname === '/projects' ||
    pathname.startsWith('/project/') ||
    pathname.startsWith('/projects/') ||
    pathname.endsWith('/project') ||
    pathname.endsWith('/projects') ||
    hash === '#project' ||
    hash === '#/project' ||
    hash === '#projects' ||
    hash === '#/projects' ||
    hash.startsWith('#project/') ||
    hash.startsWith('#/project/') ||
    hash.startsWith('#projects/') ||
    hash.startsWith('#/projects/') ||
    search.includes('page=project')
  ) {
    return 'project';
  }
  if (
    pathname === '/product' ||
    pathname === '/products' ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/products/') ||
    pathname.endsWith('/product') ||
    pathname.endsWith('/products') ||
    hash === '#product' ||
    hash === '#/product' ||
    hash === '#products' ||
    hash === '#/products' ||
    hash.startsWith('#product/') ||
    hash.startsWith('#/product/') ||
    hash.startsWith('#products/') ||
    hash.startsWith('#/products/') ||
    search.includes('page=product')
  ) {
    return 'product';
  }
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.startsWith('#admin/') ||
    hash.startsWith('#/admin/') ||
    search.includes('page=admin')
  ) {
    return 'admin';
  }
  if (pathname.endsWith('/admin')) {
    return 'admin';
  }
  if (
    pathname === '/500' ||
    pathname === '/server-error' ||
    pathname === '/down' ||
    pathname === '/maintenance' ||
    hash === '#500' ||
    hash === '#/500' ||
    hash === '#server-error' ||
    hash === '#/server-error' ||
    search.includes('page=500') ||
    search.includes('page=server-error')
  ) {
    return 'server-error';
  }
  if (
    pathname === '/404' ||
    pathname === '/not-found' ||
    hash === '#404' ||
    hash === '#/404' ||
    hash === '#not-found' ||
    hash === '#/not-found' ||
    search.includes('page=404')
  ) {
    return 'not-found';
  }

  if (pathname === '' || pathname === '/' || pathname === '/index.html') {
    if (hash && (hash === '#404' || hash === '#/404' || hash === '#not-found')) {
      return 'not-found';
    }
    if (hash && (hash === '#500' || hash === '#/500' || hash === '#server-error')) {
      return 'server-error';
    }
    return 'home';
  }

  return 'not-found';
};

export const getCurrentRoute = (): AppRoute => {
  if (currentMemoryRoute) return currentMemoryRoute;
  return detectRouteFromLocation();
};

export const subscribeToRoute = (listener: (route: AppRoute) => void) => {
  routeListeners.add(listener);
  return () => {
    routeListeners.delete(listener);
  };
};

export const navigateToProjectSlug = (slug: string | null) => {
  const cleanSlug = slug ? slug.trim().replace(/^\/+|\/+$/g, '') : null;
  const wasAlreadyOnProject = currentMemoryRoute === 'project';
  currentMemoryRoute = 'project';
  currentMemoryProjectSlug = cleanSlug;

  if (typeof window !== 'undefined') {
    const targetUrl = cleanSlug
      ? `/project/${encodeURIComponent(cleanSlug)}`
      : '/project';
    try {
      window.history.pushState(
        { route: 'project', projectSlug: cleanSlug },
        '',
        targetUrl
      );
    } catch {
      window.location.hash = cleanSlug
        ? `#/project/${encodeURIComponent(cleanSlug)}`
        : '#/project';
    }

    if (!wasAlreadyOnProject) {
      routeListeners.forEach((fn) => fn('project'));
      window.dispatchEvent(
        new CustomEvent('app-route-change', { detail: 'project' })
      );
    }

    window.dispatchEvent(
      new CustomEvent('app-project-slug-change', { detail: cleanSlug })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export const navigateToProductCategory = (
  slug: string | null,
  eventOrOptions?:
    | { preventDefault?: () => void; skipRouteChangeIfAlreadyOnProduct?: boolean }
    | null
) => {
  if (eventOrOptions && typeof eventOrOptions.preventDefault === 'function') {
    eventOrOptions.preventDefault();
  }
  const cleanSlug = slug ? slug.trim().replace(/^\/+|\/+$/g, '') : null;
  const wasAlreadyOnProduct = currentMemoryRoute === 'product';
  currentMemoryRoute = 'product';
  currentMemoryProjectSlug = null;
  currentMemoryProductCategorySlug = cleanSlug;

  if (typeof window !== 'undefined') {
    const targetUrl = cleanSlug
      ? `/product/categories/${encodeURIComponent(cleanSlug)}`
      : '/product';
    try {
      window.history.pushState(
        { route: 'product', productCategorySlug: cleanSlug },
        '',
        targetUrl
      );
    } catch {
      window.location.hash = cleanSlug
        ? `#/product/categories/${encodeURIComponent(cleanSlug)}`
        : '#/product';
    }

    if (
      !wasAlreadyOnProduct ||
      !eventOrOptions?.skipRouteChangeIfAlreadyOnProduct
    ) {
      routeListeners.forEach((fn) => fn('product'));
      window.dispatchEvent(
        new CustomEvent('app-route-change', { detail: 'product' })
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.dispatchEvent(
      new CustomEvent('app-product-category-change', { detail: cleanSlug })
    );
  }
};

export const navigateToRoute = (route: AppRoute, hashAnchor?: string) => {
  if (route === 'admin' && hashAnchor) {
    const normalizedHash = hashAnchor.replace(/^#\/?/, '').toLowerCase();
    const parts = normalizedHash.split('/').filter(Boolean);
    const tabIndex = parts.indexOf('admin') >= 0 ? parts.indexOf('admin') + 1 : 0;
    const tab = parts[tabIndex] || 'dashboard';
    const settingsTab = parts[tabIndex + 1] || 'main';
    const url = `/admin${tab === 'dashboard' ? '' : `/${tab}${tab === 'settings' ? `/${settingsTab}` : ''}`}`;
    currentMemoryRoute = 'admin';
    if (typeof window !== 'undefined') {
      window.history.pushState({ route: 'admin' }, '', url);
      const adminRoute = getAdminRouteFromLocation();
      window.dispatchEvent(
        new CustomEvent('app-admin-route-change', { detail: adminRoute })
      );
      window.dispatchEvent(
        new CustomEvent('app-route-change', { detail: 'admin' })
      );
    }
    return;
  }
  if (route === 'project' && hashAnchor) {
    const cleanSlug = hashAnchor.replace(/^[#/]*(?:project|projects)\/?/i, '');
    if (cleanSlug) {
      return navigateToProjectSlug(cleanSlug);
    }
  }

  let resolvedRoute: AppRoute = route;
  const normalizedHash = hashAnchor ? hashAnchor.toLowerCase().trim() : '';

  if (route === 'home' && normalizedHash) {
    if (
      normalizedHash === '#500' ||
      normalizedHash === '#/500' ||
      normalizedHash === '#server-error' ||
      normalizedHash === '#/server-error'
    ) {
      resolvedRoute = 'server-error';
    } else if (
      normalizedHash === '#404' ||
      normalizedHash === '#/404' ||
      normalizedHash === '#not-found'
    ) {
      resolvedRoute = 'not-found';
    } else if (
      normalizedHash === '#project' ||
      normalizedHash === '#/project' ||
      normalizedHash === '#projects' ||
      normalizedHash === '#/projects' ||
      normalizedHash.startsWith('#project/') ||
      normalizedHash.startsWith('#/project/')
    ) {
      resolvedRoute = 'project';
    } else if (
      normalizedHash === '#product' ||
      normalizedHash === '#/product' ||
      normalizedHash === '#products' ||
      normalizedHash === '#/products' ||
      normalizedHash.startsWith('#product/') ||
      normalizedHash.startsWith('#/product/')
    ) {
      resolvedRoute = 'product';
    } else if (
      normalizedHash === '#admin' ||
      normalizedHash === '#/admin'
    ) {
      resolvedRoute = 'admin';
    } else {
      resolvedRoute = 'home';
    }
  }

  currentMemoryRoute = resolvedRoute;
  currentMemoryProjectSlug = null;
  if (resolvedRoute !== 'product') {
    currentMemoryProductCategorySlug = null;
  }

  if (typeof window !== 'undefined') {
    const targetUrl =
      resolvedRoute === 'rule'
        ? '/rule'
        : resolvedRoute === 'contact-us'
          ? '/contact-us'
          : resolvedRoute === 'about-us'
            ? '/about-us'
            : resolvedRoute === 'project'
              ? '/project'
              : resolvedRoute === 'product'
                ? currentMemoryProductCategorySlug
                  ? `/product/categories/${encodeURIComponent(currentMemoryProductCategorySlug)}`
                  : '/product'
                : resolvedRoute === 'admin'
                  ? '/admin'
                  : resolvedRoute === 'server-error'
                  ? '/500'
                  : resolvedRoute === 'not-found'
                    ? '/404'
                    : hashAnchor
                      ? `/${hashAnchor}`
                      : '/';
    try {
      window.history.pushState(
        {
          route: resolvedRoute,
          projectSlug: null,
          productCategorySlug:
            resolvedRoute === 'product'
              ? currentMemoryProductCategorySlug
              : null,
        },
        '',
        targetUrl
      );
    } catch {
      window.location.hash =
        resolvedRoute === 'home' ? hashAnchor || '' : `#/${resolvedRoute}`;
    }

    routeListeners.forEach((fn) => fn(resolvedRoute));
    window.dispatchEvent(
      new CustomEvent('app-route-change', { detail: resolvedRoute })
    );
    window.dispatchEvent(
      new CustomEvent('app-project-slug-change', { detail: null })
    );
    if (resolvedRoute !== 'product') {
      window.dispatchEvent(
        new CustomEvent('app-product-category-change', { detail: null })
      );
    }

    if (
      !hashAnchor ||
      resolvedRoute === 'rule' ||
      resolvedRoute === 'contact-us' ||
      resolvedRoute === 'about-us' ||
      resolvedRoute === 'project' ||
      resolvedRoute === 'product' ||
      resolvedRoute === 'admin' ||
      resolvedRoute === 'not-found' ||
      resolvedRoute === 'server-error'
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const el = document.querySelector(hashAnchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    }
  }
};

if (typeof window !== 'undefined') {
  currentMemoryProjectSlug = extractProjectSlugFromLocation();
  currentMemoryProductCategorySlug = extractProductCategorySlugFromLocation();

  window.addEventListener('popstate', (event) => {
    const stateSlug =
      event.state && typeof event.state.projectSlug !== 'undefined'
        ? event.state.projectSlug
        : extractProjectSlugFromLocation();
    const stateCategorySlug =
      event.state && typeof event.state.productCategorySlug !== 'undefined'
        ? event.state.productCategorySlug
        : extractProductCategorySlugFromLocation();
    currentMemoryProjectSlug = stateSlug ?? null;
    currentMemoryProductCategorySlug = stateCategorySlug ?? null;
    currentMemoryRoute = detectRouteFromLocation();
    routeListeners.forEach((fn) => fn(currentMemoryRoute || 'home'));
    window.dispatchEvent(
      new CustomEvent('app-project-slug-change', {
        detail: currentMemoryProjectSlug,
      })
    );
    window.dispatchEvent(
      new CustomEvent('app-product-category-change', {
        detail: currentMemoryProductCategorySlug,
      })
    );
  });
}

/**
 * ناوبری هوشمند برای تمام لینک‌های داخلی، خارجی، دسته‌بندی‌ها و هش‌های بخش‌های مختلف سایت
 */
export const navigateFromHref = (
  rawHref: string,
  e?: React.SyntheticEvent | React.MouseEvent
) => {
  if (!rawHref) return;
  const href = rawHref.trim();

  // ۱. لینک‌های خارجی (http, https, tel, mailto, tg, whatsapp)
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('tg:') ||
    href.startsWith('whatsapp:')
  ) {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      if (typeof window !== 'undefined') {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }
    return;
  }

  // ۲. لینک دسته‌بندی محصولات (مانند /product/categories/chandeliers)
  const catMatch = href.match(
    /^\/?(?:product|products)\/(?:categories|category)\/([^/?#]+)/i
  );
  if (catMatch && catMatch[1]) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    navigateToProductCategory(decodeURIComponent(catMatch[1]));
    return;
  }

  // ۳. لینک پروژه‌ها (مانند /project/sample-1)
  const projMatch = href.match(/^\/?(?:project|projects)\/([^/?#]+)/i);
  if (projMatch && projMatch[1]) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    navigateToProjectSlug(decodeURIComponent(projMatch[1]));
    return;
  }

  // ۴. صفحات داخلی منو (/rule, /contact-us, /about-us, /project, /product, /admin)
  const cleanPath = href.split('#')[0].split('?')[0].toLowerCase().trim();
  const hashPart = href.includes('#') ? `#${href.split('#')[1]}` : '';

  if (cleanPath === '/rule' || cleanPath === 'rule') {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    navigateToRoute('rule');
    return;
  }
  if (cleanPath === '/contact-us' || cleanPath === 'contact-us') {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    navigateToRoute('contact-us');
    return;
  }
  if (cleanPath === '/about-us' || cleanPath === 'about-us') {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    navigateToRoute('about-us');
    return;
  }
  if (
    cleanPath === '/project' ||
    cleanPath === '/projects' ||
    cleanPath === 'project' ||
    cleanPath === 'projects'
  ) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    navigateToRoute('project');
    return;
  }
  if (
    cleanPath === '/product' ||
    cleanPath === '/products' ||
    cleanPath === 'product' ||
    cleanPath === 'products'
  ) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    navigateToRoute('product');
    return;
  }
  if (cleanPath === '/admin' || cleanPath === 'admin') {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    navigateToRoute('admin');
    return;
  }

  // ۵. انکرهای داخلی بخش‌ها (#...) یا صفحه اصلی
  if (href.startsWith('#') || cleanPath === '/' || cleanPath === '' || cleanPath === '/index.html') {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    navigateToRoute('home', href.startsWith('#') ? href : hashPart);
    return;
  }

  // لینک‌های غیرمنتظره
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  navigateToRoute('home', href);
};
