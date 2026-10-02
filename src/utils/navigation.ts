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
const routeListeners = new Set<(route: AppRoute) => void>();

export const extractProjectSlugFromLocation = (): string | null => {
  if (typeof window === 'undefined') return null;

  const rawPathname = decodeURIComponent(window.location.pathname);
  const cleanPathname =
    rawPathname.length > 1 && rawPathname.endsWith('/')
      ? rawPathname.slice(0, -1)
      : rawPathname;

  const pathMatch = cleanPathname.match(/^\/(?:project|projects)\/([^/?#]+)$/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1].trim();
  }

  const rawHash = decodeURIComponent(window.location.hash);
  const hashMatch = rawHash.match(/^#\/?(?:project|projects)\/([^/?#]+)$/i);
  if (hashMatch && hashMatch[1]) {
    return hashMatch[1].trim();
  }

  const searchParams = new URLSearchParams(window.location.search);
  const querySlug = searchParams.get('slug') || searchParams.get('project');
  if (querySlug) {
    return querySlug.trim();
  }

  return null;
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

export const getCurrentProjectSlug = (): string | null => {
  if (currentMemoryProjectSlug !== null) {
    return currentMemoryProjectSlug;
  }
  return extractProjectSlugFromLocation();
};

export const getCurrentProductCategorySlug = (): string | null => {
  if (currentMemoryProductCategorySlug !== null) {
    return currentMemoryProductCategorySlug;
  }
  return extractProductCategorySlugFromLocation();
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
    pathname.endsWith('/admin') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    search.includes('page=admin')
  ) {
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
    if (hash && !VALID_HOME_HASHES.has(hash)) {
      return 'not-found';
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
  let resolvedRoute: AppRoute = route;
  const normalizedHash = hashAnchor ? hashAnchor.toLowerCase().trim() : '';

  if (
    route === 'home' &&
    normalizedHash &&
    !VALID_HOME_HASHES.has(normalizedHash)
  ) {
    if (
      normalizedHash === '#500' ||
      normalizedHash === '#/500' ||
      normalizedHash === '#server-error' ||
      normalizedHash === '#/server-error'
    ) {
      resolvedRoute = 'server-error';
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
      resolvedRoute = 'not-found';
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
