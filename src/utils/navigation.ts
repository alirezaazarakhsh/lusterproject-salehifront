export type AppRoute = 'home' | 'rule' | 'contact-us';

export const getCurrentRoute = (): AppRoute => {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (
    pathname === '/rule' ||
    pathname.startsWith('/rule/') ||
    hash === '#rule' ||
    hash === '#/rule'
  ) {
    return 'rule';
  }
  if (
    pathname === '/contact-us' ||
    pathname.startsWith('/contact-us/') ||
    hash === '#contact-us' ||
    hash === '#/contact-us'
  ) {
    return 'contact-us';
  }
  return 'home';
};

export const navigateToRoute = (route: AppRoute, hashAnchor?: string) => {
  if (typeof window === 'undefined') return;
  const targetUrl =
    route === 'rule'
      ? '/rule'
      : route === 'contact-us'
        ? '/contact-us'
        : hashAnchor
          ? `/${hashAnchor}`
          : '/';
  window.history.pushState({}, '', targetUrl);
  window.dispatchEvent(new CustomEvent('app-route-change', { detail: route }));
  if (!hashAnchor || route === 'rule' || route === 'contact-us') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
