export type AppRoute = 'home' | 'rule' | 'contact-us';

let currentMemoryRoute: AppRoute | null = null;
const routeListeners = new Set<(route: AppRoute) => void>();

export const detectRouteFromLocation = (): AppRoute => {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (
    pathname === '/rule' ||
    pathname.endsWith('/rule') ||
    pathname.includes('/rule/') ||
    hash === '#rule' ||
    hash === '#/rule' ||
    search.includes('page=rule')
  ) {
    return 'rule';
  }
  if (
    pathname === '/contact-us' ||
    pathname.endsWith('/contact-us') ||
    pathname.includes('/contact-us/') ||
    hash === '#contact-us' ||
    hash === '#/contact-us' ||
    search.includes('page=contact-us')
  ) {
    return 'contact-us';
  }
  return 'home';
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
  currentMemoryRoute = route;
  if (typeof window !== 'undefined') {
    const targetUrl =
      route === 'rule'
        ? '/rule'
        : route === 'contact-us'
          ? '/contact-us'
          : hashAnchor
            ? `/${hashAnchor}`
            : '/';
    try {
      window.history.pushState({ route }, '', targetUrl);
    } catch {
      window.location.hash =
        route === 'home' ? hashAnchor || '' : `#/${route}`;
    }

    routeListeners.forEach((fn) => fn(route));
    window.dispatchEvent(
      new CustomEvent('app-route-change', { detail: route })
    );

    if (!hashAnchor || route === 'rule' || route === 'contact-us') {
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
