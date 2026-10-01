export type AppRoute =
  | 'home'
  | 'rule'
  | 'contact-us'
  | 'about-us'
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
const routeListeners = new Set<(route: AppRoute) => void>();

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
    } else {
      resolvedRoute = 'not-found';
    }
  }

  currentMemoryRoute = resolvedRoute;
  if (typeof window !== 'undefined') {
    const targetUrl =
      resolvedRoute === 'rule'
        ? '/rule'
        : resolvedRoute === 'contact-us'
          ? '/contact-us'
          : resolvedRoute === 'about-us'
            ? '/about-us'
            : resolvedRoute === 'server-error'
              ? '/500'
              : resolvedRoute === 'not-found'
                ? '/404'
                : hashAnchor
                  ? `/${hashAnchor}`
                  : '/';
    try {
      window.history.pushState({ route: resolvedRoute }, '', targetUrl);
    } catch {
      window.location.hash =
        resolvedRoute === 'home' ? hashAnchor || '' : `#/${resolvedRoute}`;
    }

    routeListeners.forEach((fn) => fn(resolvedRoute));
    window.dispatchEvent(
      new CustomEvent('app-route-change', { detail: resolvedRoute })
    );

    if (
      !hashAnchor ||
      resolvedRoute === 'rule' ||
      resolvedRoute === 'contact-us' ||
      resolvedRoute === 'about-us' ||
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
  window.addEventListener('popstate', () => {
    currentMemoryRoute = detectRouteFromLocation();
    routeListeners.forEach((fn) => fn(currentMemoryRoute || 'home'));
  });
}
