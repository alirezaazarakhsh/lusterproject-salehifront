import React, { useState, useEffect, useRef } from 'react';
import {
  SALEHI_COLLECTION_PRODUCTS,
  PRODUCT_CATEGORIES,
  EXECUTED_PROJECTS,
  STORY_ITEMS,
  MAGAZINE_ARTICLES,
  ChandelierProduct,
  CategoryItem,
  ExecutedProject,
  StoryItem,
  MagazineArticle,
} from '../data/chandelierData';
import { FinishType } from '../components/Chandelier3DViewer';
import { ALL_INITIAL_PROJECTS } from '../data/allDatabaseProjectsSeed';
import { HeaderSection } from '../components/sections/HeaderSection';
import { StoriesSection } from '../components/sections/StoriesSection';
import {
  HeroSection,
  HeroSliderSettingsConfig,
  INITIAL_HERO_SLIDER_SETTINGS,
} from '../components/sections/HeroSection';
import { CategorySection } from '../components/sections/CategorySection';
import { AboutServicesSection } from '../components/sections/AboutServicesSection';
import { ProductsCarouselSection } from '../components/sections/ProductsCarouselSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { MagazineSection } from '../components/sections/MagazineSection';
import {
  FooterSection,
  FooterSettingsConfig,
  INITIAL_FOOTER_SETTINGS,
} from '../components/sections/FooterSection';
import { RuleContentSection } from '../rule';
import {
  ContactUsContentSection,
  ContactUsSettingsConfig,
  INITIAL_CONTACT_US_SETTINGS,
} from '../contact-us';
import {
  AboutUsContentSection,
  AboutUsSettingsConfig,
  INITIAL_ABOUT_US_SETTINGS,
} from '../about-us/AboutUsContentSection';
import { ProjectContentSection } from '../project';
import { ProductContentSection } from '../product';
import { AdminPanelSection } from '../admin';
import { NotFoundContentSection } from '../components/sections/NotFoundContentSection';
import { ServerErrorContentSection } from '../components/sections/ServerErrorContentSection';
import { PagePreloader } from '../components/PagePreloader';
import {
  AppRoute,
  VALID_HOME_HASHES,
  getCurrentRoute,
  navigateToRoute,
  subscribeToRoute,
} from '../utils/navigation';
import { apiFetchWithFallback, loadLocalDb, INITIAL_MAIN_SETTINGS, INITIAL_FAQ_SETTINGS } from '../utils/localBackendFallback';
import {
  ProductStudioModal,
  CustomProduct3DModal,
  StorySpotlightModal,
  ArticleReaderModal,
  CartDrawer,
  CartItem,
  LoginModal,
  LogoutConfirmModal,
  AppToastContainer,
  AppToast,
} from '../components/InteractiveModals';

/**
 * کامپوننت صفحه اصلی (HomePage) و صفحه قوانین و مقررات (/rule)
 * با هدر و فوتر و سبد خرید یکپارچه در دسکتاپ و موبایل
 */
export const HomePage: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    getCurrentRoute()
  );
  const [isPagePreloading, setIsPagePreloading] = useState<boolean>(true);
  const preloaderTimeoutRef = useRef<number | null>(null);

  const triggerPagePreloader = (durationMs = 1350) => {
    setIsPagePreloading(true);
    if (preloaderTimeoutRef.current) {
      window.clearTimeout(preloaderTimeoutRef.current);
    }
    preloaderTimeoutRef.current = window.setTimeout(() => {
      setIsPagePreloading(false);
      preloaderTimeoutRef.current = null;
    }, durationMs);
  };

  useEffect(() => {
    // بارگذاری کامل اطلاعات از دیتابیس همزمان با نمایش پریلودر تا زمانی که لود کامل انجام شود
    const initApp = async () => {
      setIsPagePreloading(true);
      try {
        await fetchLiveCatalogFromDb();
      } catch (err) {
        console.warn('initApp error:', err);
      } finally {
        window.setTimeout(() => {
          setIsPagePreloading(false);
          document.body.style.overflow = '';
        }, 350);
      }
    };
    initApp();

    // اطمینان از رفع هرگونه قفل ناخواسته اسکرول صفحه
    document.body.style.overflow = '';
    const safetyScrollTimer = window.setTimeout(() => {
      setIsPagePreloading(false);
      document.body.style.overflow = '';
    }, 1500);

    // راه‌اندازی ریل تایم با SSE برای به‌روزرسانی آنی صفحات سایت در هنگام هرگونه تغییر در ادمین
    let eventSource: EventSource | null = null;
    let fallbackPollingTimer: number | null = null;

    const setupPolling = () => {
      if (!fallbackPollingTimer) {
        fallbackPollingTimer = window.setInterval(() => {
          fetchLiveCatalogFromDb();
        }, 25000);
      }
    };

    try {
      eventSource = new EventSource('/api/realtime/stream');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.type === 'catalog-updated') {
            console.log('Real-time database update event received:', parsed);
            window.dispatchEvent(new CustomEvent('app-catalog-updated'));
          } else if (parsed && parsed.mode === 'polling') {
            // در محیط Vercel برای جلوگیری از خطای ۵۰۰ و اسپم ریکوئست، اتصال بسته شده و پاتلینگ زمان‌بندی‌شده فعال می‌شود
            if (eventSource) {
              eventSource.close();
              eventSource = null;
            }
            setupPolling();
          }
        } catch (e) {
          console.error('Failed to parse realtime event data:', e);
        }
      };
      eventSource.onerror = () => {
        // مدیریت نرم قطعی SSE
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        setupPolling();
      };
    } catch (e) {
      console.error('Failed to connect to realtime stream:', e);
      setupPolling();
    }

    const unsubscribe = subscribeToRoute((nextRoute) => {
      setCurrentRoute((prev) => {
        if (prev !== nextRoute) {
          triggerPagePreloader(800);
        }
        return nextRoute;
      });
    });
    const syncRoute = (e?: Event) => {
      const customRoute = (e as CustomEvent<AppRoute>)?.detail;
      const nextRoute = customRoute ?? getCurrentRoute();
      setCurrentRoute((prev) => {
        if (prev !== nextRoute) {
          triggerPagePreloader(800);
        }
        return nextRoute;
      });
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('app-route-change', syncRoute);

    // رهگیری کلیک روی لینک‌های داخلی یا هش‌هایی که در سایت وجود ندارند و هدایت به صفحه 404
    const handleGlobalLinkClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href')?.trim();
      if (!rawHref) return;

      if (
        rawHref.startsWith('http://') ||
        rawHref.startsWith('https://') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tg:') ||
        rawHref.startsWith('whatsapp:')
      ) {
        return;
      }

      const lowerHref = rawHref.toLowerCase();

      if (lowerHref.startsWith('#')) {
        if (
          lowerHref === '#500' ||
          lowerHref === '#/500' ||
          lowerHref === '#server-error' ||
          lowerHref === '#/server-error'
        ) {
          e.preventDefault();
          setCurrentRoute('server-error');
          navigateToRoute('server-error');
          return;
        }
        if (
          lowerHref === '#404' ||
          lowerHref === '#/404' ||
          lowerHref === '#not-found' ||
          lowerHref === '#/not-found'
        ) {
          e.preventDefault();
          setCurrentRoute('not-found');
          navigateToRoute('not-found');
          return;
        }
        return;
      }

      if (lowerHref.startsWith('/')) {
        const cleanPath =
          lowerHref.length > 1 && lowerHref.endsWith('/')
            ? lowerHref.slice(0, -1)
            : lowerHref;
        if (
          cleanPath === '/500' ||
          cleanPath === '/server-error' ||
          cleanPath === '/down' ||
          cleanPath === '/maintenance'
        ) {
          e.preventDefault();
          setCurrentRoute('server-error');
          navigateToRoute('server-error');
          return;
        }
        if (
          cleanPath !== '/' &&
          cleanPath !== '/index.html' &&
          cleanPath !== '/rule' &&
          cleanPath !== '/contact-us' &&
          cleanPath !== '/about-us' &&
          cleanPath !== '/project' &&
          cleanPath !== '/projects' &&
          !cleanPath.startsWith('/project/') &&
          !cleanPath.startsWith('/projects/') &&
          cleanPath !== '/product' &&
          cleanPath !== '/products' &&
          !cleanPath.startsWith('/product/') &&
          !cleanPath.startsWith('/products/') &&
          cleanPath !== '/admin' &&
          !cleanPath.startsWith('/admin/')
        ) {
          e.preventDefault();
          setCurrentRoute('not-found');
          navigateToRoute('not-found');
        }
      }
    };

    // تشخیص خودکار قطعی اینترنت/سرور و نمایش صفحه قطعی سرور
    const handleServerDown = () => {
      setCurrentRoute('server-error');
      navigateToRoute('server-error');
    };

    window.addEventListener('offline', handleServerDown);
    window.addEventListener('app-server-error', handleServerDown);
    window.addEventListener('app-catalog-updated', fetchLiveCatalogFromDb);
    window.addEventListener('app-projects-updated', fetchLiveCatalogFromDb);
    window.addEventListener('app-stories-updated', fetchLiveCatalogFromDb);
    document.addEventListener('click', handleGlobalLinkClick);
    return () => {
      unsubscribe();
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('app-route-change', syncRoute);
      window.removeEventListener('offline', handleServerDown);
      window.removeEventListener('app-server-error', handleServerDown);
      window.removeEventListener('app-catalog-updated', fetchLiveCatalogFromDb);
      window.removeEventListener('app-projects-updated', fetchLiveCatalogFromDb);
      window.removeEventListener('app-stories-updated', fetchLiveCatalogFromDb);
      document.removeEventListener('click', handleGlobalLinkClick);
      if (preloaderTimeoutRef.current) {
        window.clearTimeout(preloaderTimeoutRef.current);
      }
      if (eventSource) {
        eventSource.close();
      }
      if (fallbackPollingTimer) {
        window.clearInterval(fallbackPollingTimer);
      }
    };
  }, []);
  const [productsList, setProductsList] = useState<ChandelierProduct[]>(() => {
    try {
      const local = loadLocalDb();
      if (local && Array.isArray(local.products) && local.products.length > 0) {
        return local.products.map((row: any) => ({
          id: row.productKey || `db-prod-${row.id}`,
          name: row.name,
          subtitle: row.subtitle,
          priceFormatted: row.priceFormatted,
          priceNumeric: Number(row.priceNumeric) || 0,
          productCode: row.productCode,
          image: row.image,
          modelType: (row.modelType as any) || 'crystali',
          defaultFinish: (row.defaultFinish as any) || 'gold-24k',
          categoryKey: row.categorySlug || 'all',
          outOfStock: Boolean(row.outOfStock),
          hasSnappPay: Boolean(row.hasSnappPay),
          dimensions: row.dimensions || '',
          branchesCount: row.branchesCount || '',
          bodyMaterial: row.bodyMaterial || '',
          warranty: row.warranty || '',
          description: row.description || '',
        }));
      }
    } catch {}
    return SALEHI_COLLECTION_PRODUCTS;
  });

  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    try {
      const local = loadLocalDb();
      if (local && Array.isArray(local.categories) && local.categories.length > 0) {
        return local.categories.map((catRow: any, idx: number) => {
          const fallbackCat =
            PRODUCT_CATEGORIES.find(
              (c) => c.slug === catRow.slug || c.filterKey === catRow.slug
            ) ||
            PRODUCT_CATEGORIES[idx] ||
            PRODUCT_CATEGORIES[0];
          return {
            id: `cat-${catRow.id || idx}`,
            title: catRow.title || fallbackCat.title,
            countText:
              catRow.countLabel || catRow.countText || fallbackCat.countText,
            filterKey: catRow.slug || fallbackCat.filterKey,
            slug: catRow.slug || fallbackCat.slug,
          };
        });
      }
    } catch {}
    return PRODUCT_CATEGORIES;
  });

  const [projectsList, setProjectsList] = useState<ExecutedProject[]>(() => {
    try {
      const local = loadLocalDb();
      if (local && Array.isArray(local.projects) && local.projects.length > 0) {
        return local.projects.map((projRow: any, idx: number) => {
          let parsedGallery: string[] = [];
          if (Array.isArray(projRow.galleryImages)) {
            parsedGallery = projRow.galleryImages;
          } else if (typeof projRow.galleryJson === 'string') {
            try {
              parsedGallery = JSON.parse(projRow.galleryJson);
            } catch {
              parsedGallery = [];
            }
          }
          let parsedChs: any[] = [];
          if (Array.isArray(projRow.chandeliersList) && projRow.chandeliersList.length > 0) {
            parsedChs = projRow.chandeliersList;
          }
          return {
            id: projRow.id ?? (projRow.slug ? `proj-${projRow.slug}` : `proj-${idx + 1}`),
            slug: projRow.slug,
            sampleCode: projRow.sampleCode || `نمونه ${idx + 1}`,
            district: projRow.district || 'فرشته',
            categoryTab: (projRow.categoryTab as any) || 'gov',
            title: projRow.title,
            description: projRow.description,
            usedChandeliersText: projRow.usedChandeliersText || '',
            chandeliersList: parsedChs,
            usedProducts: parsedChs.map((ch: any, cIdx: number) => ({
              id: `up-${projRow.id}-${cIdx + 1}`,
              name: ch.name || 'لوستر سفارشی صالحی',
              price: ch.price || '۱۲,۵۰۰,۰۰۰ تومان',
              productId: ch.productId || 'prod-custom',
            })),
            mainImage: projRow.mainImage,
            galleryImages: parsedGallery,
            likesCount: Number(projRow.likesCount) || 0,
          };
        });
      }
    } catch {}
    return ALL_INITIAL_PROJECTS.map((pr, idx) => ({
      id: String(idx + 1),
      slug: pr.slug,
      sampleCode: pr.sampleCode,
      district: pr.district,
      categoryTab: pr.categoryTab,
      title: pr.title,
      description: pr.description,
      usedChandeliersText: pr.usedChandeliersText,
      mainImage: pr.mainImage,
      galleryImages: pr.galleryImages,
      likesCount: 0,
      usedProducts: [
        {
          id: `up-${idx + 1}-1`,
          name: 'لوستر ۱۲ شاخه تک',
          price: '۱۲,۵۰۰,۰۰۰ تومان',
          productId: 'prod-3',
        },
        {
          id: `up-${idx + 1}-2`,
          name: 'لوستر شاه ملکه',
          price: '۱۲,۵۰۰,۰۰۰ تومان',
          productId: 'prod-4',
        },
      ],
    }));
  });

  const [storiesList, setStoriesList] = useState<StoryItem[]>(() => {
    try {
      const local = loadLocalDb();
      if (local && Array.isArray(local.stories) && local.stories.length > 0) {
        return local.stories;
      }
    } catch {}
    return STORY_ITEMS;
  });

  const [articlesList, setArticlesList] = useState<MagazineArticle[]>(() => {
    try {
      const local = loadLocalDb();
      if (local && Array.isArray(local.articles) && local.articles.length > 0) {
        return local.articles;
      }
    } catch {}
    return MAGAZINE_ARTICLES;
  });

  const [footerSettings, setFooterSettings] = useState<FooterSettingsConfig>(() => {
    try {
      const local = loadLocalDb();
      if (local && local.footerSettings) {
        return {
          ...INITIAL_FOOTER_SETTINGS,
          ...local.footerSettings,
        };
      }
    } catch {}
    return INITIAL_FOOTER_SETTINGS;
  });

  const [contactUsSettings, setContactUsSettings] = useState<ContactUsSettingsConfig>(() => {
    try {
      const local = loadLocalDb();
      if (local && local.contactUsSettings) {
        return {
          ...INITIAL_CONTACT_US_SETTINGS,
          ...local.contactUsSettings,
        };
      }
    } catch {}
    return INITIAL_CONTACT_US_SETTINGS;
  });

  const [aboutUsSettings, setAboutUsSettings] = useState<AboutUsSettingsConfig>(() => {
    try {
      const local = loadLocalDb();
      if (local && local.aboutUsSettings) {
        return {
          ...INITIAL_ABOUT_US_SETTINGS,
          ...local.aboutUsSettings,
        };
      }
    } catch {}
    return INITIAL_ABOUT_US_SETTINGS;
  });

  const [heroSliderSettings, setHeroSliderSettings] = useState<HeroSliderSettingsConfig>(() => {
    try {
      const local = loadLocalDb();
      if (local && local.heroSliderSettings) {
        return {
          ...INITIAL_HERO_SLIDER_SETTINGS,
          ...local.heroSliderSettings,
        };
      }
    } catch {}
    return INITIAL_HERO_SLIDER_SETTINGS;
  });

  const [mainSettings, setMainSettings] = useState<any>(() => {
    try {
      const local = loadLocalDb();
      if (local && local.mainSettings) {
        return {
          ...INITIAL_MAIN_SETTINGS,
          ...local.mainSettings,
        };
      }
    } catch {}
    return INITIAL_MAIN_SETTINGS;
  });

  const [faqSettings, setFaqSettings] = useState<any>(() => {
    try {
      const local = loadLocalDb();
      if (local && local.faqSettings) {
        return {
          ...INITIAL_FAQ_SETTINGS,
          ...local.faqSettings,
        };
      }
    } catch {}
    return INITIAL_FAQ_SETTINGS;
  });

  const fetchLiveCatalogFromDb = async () => {
    try {
      const data = await apiFetchWithFallback('/api/public/catalog');
      if (!data) return;
      if (data.footerSettings) {
        setFooterSettings((prev) => ({
          ...prev,
          ...data.footerSettings,
        }));
      }
      if (data.contactUsSettings) {
        setContactUsSettings((prev) => ({
          ...prev,
          ...data.contactUsSettings,
        }));
      }
      if (data.aboutUsSettings) {
        setAboutUsSettings((prev) => ({
          ...prev,
          ...data.aboutUsSettings,
        }));
      }
      if (data.heroSliderSettings) {
        setHeroSliderSettings((prev) => ({
          ...prev,
          ...data.heroSliderSettings,
        }));
      }
      if (data.mainSettings) {
        setMainSettings((prev: any) => ({
          ...prev,
          ...data.mainSettings,
        }));
      }
      if (data.faqSettings) {
        setFaqSettings((prev: any) => ({
          ...prev,
          ...data.faqSettings,
        }));
      }

      let currentProducts = SALEHI_COLLECTION_PRODUCTS;
      if (Array.isArray(data.products)) {
        const mappedProducts: ChandelierProduct[] = data.products.map(
          (row: any) => ({
            id: row.productKey || `db-prod-${row.id}`,
            name: row.name,
            subtitle: row.subtitle,
            priceFormatted: row.priceFormatted,
            priceNumeric: Number(row.priceNumeric) || 0,
            productCode: row.productCode,
            image: row.image,
            modelType: (row.modelType as any) || 'crystali',
            defaultFinish: (row.defaultFinish as any) || 'gold-24k',
            categoryKey: row.categorySlug || 'all',
            outOfStock: Boolean(row.outOfStock),
            hasSnappPay: Boolean(row.hasSnappPay),
            dimensions: row.dimensions || '',
            branchesCount: row.branchesCount || '',
            bodyMaterial: row.bodyMaterial || '',
            warranty: row.warranty || '',
            description: row.description || '',
          })
        );
        currentProducts = mappedProducts;
        setProductsList(mappedProducts);
      }

      if (Array.isArray(data.categories)) {
        const mappedCategories: CategoryItem[] = data.categories.map(
          (catRow: any, idx: number) => {
            const fallbackCat =
              PRODUCT_CATEGORIES.find(
                (c) => c.slug === catRow.slug || c.filterKey === catRow.slug
              ) ||
              PRODUCT_CATEGORIES[idx] ||
              PRODUCT_CATEGORIES[0];
            return {
              id: `cat-${catRow.id || idx}`,
              title: catRow.title || fallbackCat.title,
              countText:
                catRow.countLabel || catRow.countText || fallbackCat.countText,
              filterKey: catRow.slug || fallbackCat.filterKey,
              slug: catRow.slug || fallbackCat.slug,
            };
          }
        );
        setCategoriesList(mappedCategories);
      }

      if (Array.isArray(data.projects)) {
        const mappedProjects: ExecutedProject[] = data.projects.map(
          (projRow: any, idx: number) => {
            let parsedGallery: string[] = [];
            if (Array.isArray(projRow.galleryImages)) {
              parsedGallery = projRow.galleryImages;
            } else if (typeof projRow.galleryJson === 'string') {
              try {
                parsedGallery = JSON.parse(projRow.galleryJson);
              } catch {
                parsedGallery = [];
              }
            }

            let parsedChs: any[] = [];
            if (Array.isArray(projRow.chandeliersList) && projRow.chandeliersList.length > 0) {
              parsedChs = projRow.chandeliersList;
            } else if (projRow.usedChandeliersText) {
              const tagMatch = projRow.usedChandeliersText.match(/<!--CHANDELIERS_DATA-->([\s\S]*?)<!--\/CHANDELIERS_DATA-->/);
              if (tagMatch) {
                try {
                  const arr = JSON.parse(tagMatch[1]);
                  if (Array.isArray(arr) && arr.length > 0) parsedChs = arr;
                } catch {}
              }
              if (parsedChs.length === 0) {
                const jsonMatch = projRow.usedChandeliersText.match(/\[\s*\{[\s\S]*\}\s*\]/);
                if (jsonMatch) {
                  try {
                    const arr = JSON.parse(jsonMatch[0]);
                    if (Array.isArray(arr) && arr.length > 0) parsedChs = arr;
                  } catch {}
                }
              }
            }

            return {
              id: projRow.id ?? (projRow.slug ? `proj-${projRow.slug}` : `proj-${idx + 1}`),
              slug: projRow.slug,
              sampleCode: projRow.sampleCode || 'نمونه ۱',
              district: projRow.district || 'فرشته',
              categoryTab: (projRow.categoryTab as any) || 'gov',
              title: projRow.title,
              description: projRow.description,
              usedChandeliersText: projRow.usedChandeliersText || '',
              chandeliersList: parsedChs,
              usedProducts: parsedChs.map((ch: any, cIdx: number) => ({
                id: `up-${projRow.id}-${cIdx + 1}`,
                name: ch.name || 'لوستر سفارشی صالحی',
                price:
                  ch.price ||
                  ch.priceFormatted ||
                  (ch.desc && !ch.desc.includes('استعلام') ? ch.desc : null) ||
                  ['۱۲,۴۶۰,۰۰۰ تومان', '۳۴,۵۸۲,۰۰۰ تومان', '۱۱۲,۵۰۰,۰۰۰ تومان', '۱۸,۹۰۰,۰۰۰ تومان'][cIdx % 4],
                productId: ch.code || `prod-${cIdx + 1}`,
              })),
              mainImage: projRow.mainImage,
              galleryImages:
                parsedGallery.length > 0 ? parsedGallery : [projRow.mainImage],
              dateBadge: projRow.dateBadge || '',
              ownerName: projRow.ownerName || '',
              locationBadge: projRow.locationBadge || projRow.district || '',
              likesCount: Number(projRow.likesCount) || 0,
            };
          }
        );
        setProjectsList(mappedProjects);
      }

      if (Array.isArray(data.stories)) {
        const mappedStories: StoryItem[] = data.stories.map(
          (stRow: any, idx: number) => {
            const rawType = stRow.storyType || 'single-product';
            const normalizedType =
              rawType === 'image-only' || rawType === 'simple'
                ? 'image-only'
                : rawType === 'video'
                ? 'video'
                : 'single-product';

            const linkedProd =
              currentProducts.find(
                (p) =>
                  p.id === stRow.linkedProductKey ||
                  p.productCode === stRow.linkedProductKey
              ) ||
              currentProducts[idx % currentProducts.length] ||
              SALEHI_COLLECTION_PRODUCTS[0];

            const thumbImg =
              stRow.thumbnailImage || stRow.image || linkedProd.image;
            const mainImg =
              stRow.mediaUrl || stRow.image || stRow.thumbnailImage || thumbImg;

            let parsedSlides: any[] = [];
            if (typeof stRow.slidesJson === 'string' && stRow.slidesJson.trim()) {
              try {
                const arr = JSON.parse(stRow.slidesJson);
                if (Array.isArray(arr) && arr.length > 0) {
                  parsedSlides = arr.slice(0, 10).map((sl: any, sIdx: number) => {
                    const slType =
                      sl.type === 'image-only' || sl.type === 'simple'
                        ? 'image-only'
                        : sl.type === 'video'
                        ? 'video'
                        : 'single-product';
                    const slLinkedProd =
                      currentProducts.find(
                        (p) =>
                          p.id === sl.linkedProductKey ||
                          p.productCode === sl.linkedProductKey
                      ) || linkedProd;
                    return {
                      id: sl.id || `slide-${stRow.id}-${sIdx}`,
                      type: slType,
                      title: sl.title || stRow.title,
                      subtitle: sl.subtitle || '',
                      mediaUrl: sl.mediaUrl || mainImg,
                      videoUrl:
                        slType === 'video'
                          ? sl.videoUrl ||
                            'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4'
                          : '',
                      durationSeconds: 10,
                      products:
                        slType === 'single-product'
                          ? [
                              {
                                id: slLinkedProd.id,
                                name: slLinkedProd.name,
                                price: slLinkedProd.priceFormatted,
                                image: slLinkedProd.image,
                                productCode: slLinkedProd.productCode,
                                modelType: slLinkedProd.modelType,
                                finish: slLinkedProd.defaultFinish,
                              },
                            ]
                          : [],
                    };
                  });
                }
              } catch {
                parsedSlides = [];
              }
            }

            return {
              id: stRow.storyKey || `story-${stRow.id}`,
              storyType: normalizedType,
              title: stRow.title,
              fullTitle: stRow.fullTitle || stRow.title,
              subtitle: stRow.subtitle || '',
              category: (stRow.category as any) || 'chandeliers',
              categoryLabel: stRow.categoryLabel || 'کلکسیون لوستر',
              durationSeconds: Number(stRow.durationSeconds) || 10,
              thumbnailImage: thumbImg,
              image: mainImg,
              mediaUrl: mainImg,
              productImage: linkedProd.image,
              videoUrl:
                normalizedType === 'video'
                  ? stRow.videoUrl ||
                    'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4'
                  : '',
              linkedProductKey:
                normalizedType === 'single-product'
                  ? stRow.linkedProductKey || linkedProd.id
                  : '',
              price: stRow.price || linkedProd.priceFormatted,
              modelType: (stRow.modelType as any) || linkedProd.modelType,
              finish: (stRow.finish as any) || linkedProd.defaultFinish,
              products:
                normalizedType === 'single-product'
                  ? [
                      {
                        id: linkedProd.id,
                        name: linkedProd.name,
                        price: linkedProd.priceFormatted,
                        image: linkedProd.image,
                        productCode: linkedProd.productCode,
                        modelType: linkedProd.modelType,
                        finish: linkedProd.defaultFinish,
                      },
                    ]
                  : [],
              slides: parsedSlides.length > 0 ? parsedSlides : undefined,
            };
          }
        );
        setStoriesList(mappedStories);
      }

      if (Array.isArray(data.articles) && data.articles.length > 0) {
        const mappedArticles: MagazineArticle[] = data.articles.map(
          (artRow: any, idx: number) => ({
            id: artRow.articleKey || artRow.slug || `mag-${artRow.id}`,
            title: artRow.title,
            excerpt: artRow.excerpt,
            fullContent: Array.isArray(artRow.fullContent)
              ? artRow.fullContent
              : artRow.content
                ? String(artRow.content)
                    .split('\n')
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : [artRow.excerpt],
            date: artRow.publishDate || '۱۵ شهریور ۱۴۰۴',
            readTime: artRow.readTime || '۴ دقیقه مطالعه',
            category: artRow.category || 'راهنمای دکوراسیون سلطنتی',
            image: artRow.image,
            featured: idx === 0 || Boolean(artRow.featured),
          })
        );
        setArticlesList(mappedArticles);
      }
    } catch {
      // حفظ داده‌های محلی در صورت عدم پاسخگویی موقت
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] =
    useState<boolean>(false);
  const [appToasts, setAppToasts] = useState<AppToast[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userDisplayName, setUserDisplayName] =
    useState<string>('مشتری عزیز!');
  const [forceOpenProfileMenu, setForceOpenProfileMenu] =
    useState<boolean>(false);
  const [isCustom3DModalOpen, setIsCustom3DModalOpen] =
    useState<boolean>(false);

  const [activeProductModal, setActiveProductModal] = useState<{
    product: ChandelierProduct;
    finish: FinishType;
  } | null>(null);

  const [activeStoryModal, setActiveStoryModal] = useState<StoryItem | null>(
    null
  );
  const [activeArticleModal, setActiveArticleModal] =
    useState<MagazineArticle | null>(null);

  const addAppToast = (
    type: AppToast['type'],
    title: string,
    message: string,
    onComplete?: () => void
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setAppToasts((prev) => [
      ...prev.slice(-2),
      { id, type, title, message, onComplete },
    ]);
  };

  const triggerCartAuthRequiredToast = () => {
    if (isLoginModalOpen) return;
    setAppToasts((prev) => {
      if (prev.some((t) => t.type === 'cart-auth-required')) {
        return prev;
      }
      const id = `${Date.now()}-${Math.random()}`;
      return [
        ...prev.slice(-2),
        {
          id,
          type: 'cart-auth-required',
          title: 'مورد ضروری',
          message: 'برای فعال شدن سبد خرید ابتدا وارد حساب کاربری شوید.',
          onComplete: () => {
            setIsLoginModalOpen(true);
          },
        },
      ];
    });
  };

  const handleConfirmLogout = () => {
    setIsLogoutConfirmOpen(false);
    setIsLoggedIn(false);
    setIsCartOpen(false);
    setCartItems([]);
    setForceOpenProfileMenu(false);
    addAppToast(
      'logout-success',
      'خروج موفقیت آمیز',
      'مشتری گرامی از پنل کاربری خود خارج شده اید.'
    );
  };

  const handleOpenProductModal = (
    product: ChandelierProduct,
    finish: FinishType = 'original'
  ) => {
    if (product.outOfStock) return;
    // به جای باز کردن مودال، به صفحه داخلی محصول تمام عرض هدایت می‌کنیم
    navigateToRoute('product');
    window.setTimeout(() => {
      const targetUrl = `/product/${encodeURIComponent(product.id)}`;
      try {
        window.history.pushState(
          { route: 'product', productCategorySlug: product.id },
          '',
          targetUrl
        );
      } catch {
        window.location.hash = `#/product/${encodeURIComponent(product.id)}`;
      }
      window.dispatchEvent(
        new CustomEvent('app-route-change', { detail: 'product' })
      );
      window.dispatchEvent(
        new CustomEvent('app-product-category-change', { detail: product.id })
      );
    }, 40);
  };

  const handleAddToCart = (product: ChandelierProduct, qty = 1) => {
    if (product.outOfStock) return;
    if (!isLoggedIn) {
      setActiveProductModal(null);
      triggerCartAuthRequiredToast();
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleAddNewCustomProduct = (newProduct: ChandelierProduct) => {
    setProductsList((prev) => [newProduct, ...prev]);
    setActiveProductModal({
      product: newProduct,
      finish: newProduct.defaultFinish || 'original',
    });
  };

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const cartProductIds = cartItems.map((item) => item.product.id);
  const cartQuantities = cartItems.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.product.id] = item.quantity;
      return acc;
    },
    {}
  );

  return (
    <div
      id="top"
      dir="rtl"
      className="min-h-screen w-full bg-[#fcfbf9] text-[#222222] overflow-x-clip"
    >
      {/* ۱. هدر بالای صفحه (در پنل ادمین حذف شده و در صفحات 404 و 500 فقط در دسکتاپ نمایش داده می‌شود) */}
      {currentRoute !== 'admin' && (
        <div
          className={
            currentRoute === 'not-found' || currentRoute === 'server-error'
              ? 'hidden md:block'
              : ''
          }
        >
          <HeaderSection
            currentRoute={currentRoute}
            onNavigateRoute={(route, hashAnchor) => {
              setCurrentRoute(route);
              navigateToRoute(route, hashAnchor);
            }}
            totalCartCount={totalCartCount}
            isCartOpen={isCartOpen}
            onOpenCart={() => setIsCartOpen(true)}
            onCloseCart={() => setIsCartOpen(false)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              addAppToast(
                'success',
                'ورود موفقیت آمیز',
                'مشتری گرامی از پنل کاربری خود وارد شده اید.'
              );
            }}
            isLoggedIn={isLoggedIn}
            userDisplayName={userDisplayName}
            onToggleUserDisplayName={() =>
              setUserDisplayName((prev) =>
                prev === 'مشتری عزیز!' ? 'علیرضا آذرخش' : 'مشتری عزیز!'
              )
            }
            onLogout={() => setIsLogoutConfirmOpen(true)}
            forceOpenProfileMenu={forceOpenProfileMenu}
            onProfileMenuInteracted={() => setForceOpenProfileMenu(false)}
            onOpen3DStudio={() =>
              handleOpenProductModal(productsList[3] || productsList[0])
            }
            onOpenCustomProductModal={() => setIsCustom3DModalOpen(true)}
            mainSettings={mainSettings}
          />
        </div>
      )}

      {currentRoute === 'server-error' ? (
        /* محتوای صفحه خطای سرور / دان شدن سایت (/500) */
        <ServerErrorContentSection
          onRetry={() => {
            setCurrentRoute('home');
            navigateToRoute('home');
          }}
        />
      ) : currentRoute === 'not-found' ? (
        /* محتوای صفحه ۴۰۴ (پیدا نشد) */
        <NotFoundContentSection
          onBackToHome={() => {
            setCurrentRoute('home');
            navigateToRoute('home');
          }}
        />
      ) : currentRoute === 'rule' ? (
        /* محتوای میانی صفحه قوانین و مقررات (/rule) */
        <RuleContentSection faqSettings={faqSettings} />
      ) : currentRoute === 'contact-us' ? (
        /* محتوای میانی صفحه تماس با ما (/contact-us) */
        <ContactUsContentSection
          contactUsSettings={contactUsSettings}
          onShowToast={addAppToast}
        />
      ) : currentRoute === 'about-us' ? (
        /* محتوای میانی صفحه درباره ما (/about-us) */
        <AboutUsContentSection
          aboutUsSettings={aboutUsSettings}
          footerSettings={footerSettings}
          faqSettings={faqSettings}
          onShowToast={addAppToast}
        />
      ) : currentRoute === 'project' ? (
        /* محتوای میانی صفحه پروژه‌ها (/project) */
        <ProjectContentSection
          projects={projectsList}
          products={productsList}
          onOpenProductModal={(prod) => handleOpenProductModal(prod)}
          onAddToCart={handleAddToCart}
          onShowToast={addAppToast}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          isLoggedIn={isLoggedIn}
        />
      ) : currentRoute === 'admin' ? (
        /* محتوای پنل مدیریت گرافیکی (/admin) متصل به PostgreSQL و Express */
        <AdminPanelSection onCatalogUpdated={fetchLiveCatalogFromDb} />
      ) : currentRoute === 'product' ? (
        /* محتوای میانی صفحه محصولات و دسته‌بندی‌ها (/product و /product/categories/:slug) */
        <ProductContentSection
          products={productsList}
          cartProductIds={cartProductIds}
          cartQuantities={cartQuantities}
          onOpenProductModal={handleOpenProductModal}
          onAddToCart={(prod) => handleAddToCart(prod, 1)}
          onShowToast={addAppToast}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        <>
          {/* ۲. نوار استوری‌های دایره‌ای */}
          <StoriesSection
            stories={storiesList}
            activeStoryId={activeStoryModal?.id || null}
            onSelectStory={(story) => setActiveStoryModal(story)}
          />

          {/* ۳. بنر اصلی (Hero) با قابلیت نمای سه‌بعدی */}
          <HeroSection heroSettings={heroSliderSettings} />

          {/* ۴. دسته بندی محصولات */}
          <CategorySection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={categoriesList}
            products={productsList}
          />

          {/* ۵. درباره خدمات لوستر + قاب قوسی سه‌بعدی */}
          <AboutServicesSection
            featuredProduct={productsList[3] || productsList[0]}
            onOpenProductModal={(prod) => handleOpenProductModal(prod)}
            mainSettings={mainSettings}
          />

          {/* ۶. محصولات کلکسیون صالحی (با قابلیت سه‌بعدی خودکار و تغییر رنگ روی هر محصول) */}
          <ProductsCarouselSection
            sectionId="collection-salehi"
            title="محصولات کلکسیون صالحی"
            mobileTitle="کلکسیون صالحی"
            products={productsList}
            variant="salehi-collection"
            cartProductIds={cartProductIds}
            cartQuantities={cartQuantities}
            onOpenProductModal={handleOpenProductModal}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
          />

          {/* ۷. پروژه های اجرایی */}
          <ProjectsSection
            projects={projectsList}
            products={productsList}
            onOpenProductModal={(prod) => handleOpenProductModal(prod)}
          />

          {/* ۸. محصولات کلکسیون پرفروش ترین ها */}
          <ProductsCarouselSection
            sectionId="best-sellers"
            title="محصولات کلکسیون پرفروش ترین ها"
            mobileTitle="پرفروش‌ترین‌ها"
            products={productsList}
            variant="best-sellers"
            cartProductIds={cartProductIds}
            cartQuantities={cartQuantities}
            onOpenProductModal={handleOpenProductModal}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
          />

          {/* ۹. مجله های لوستر */}
          <MagazineSection
            articles={articlesList}
            onSelectArticle={(article) => setActiveArticleModal(article)}
          />
        </>
      )}

      {/* ۱۰. فوتر تمام‌عرض دو رنگ (در پنل ادمین و صفحات 404 و 500 نمایش داده نمی‌شود) */}
      {currentRoute !== 'not-found' &&
        currentRoute !== 'server-error' &&
        currentRoute !== 'admin' && (
          <FooterSection
            currentRoute={currentRoute}
            footerSettings={footerSettings}
            onNavigateRoute={(route, hashAnchor) => {
              setCurrentRoute(route);
              navigateToRoute(route, hashAnchor);
            }}
          />
        )}

      {/* پنجره مودال استودیو سه‌بعدی و تغییر رنگ محصول */}
      {activeProductModal && (
        <ProductStudioModal
          product={activeProductModal.product}
          initialFinish={activeProductModal.finish || 'original'}
          onClose={() => setActiveProductModal(null)}
          onAddToCart={handleAddToCart}
          initialTab="3d"
        />
      )}

      {/* پنجره مودال آپلود هر عکس جدید و تبدیل خودکار به مدل سه‌بعدی */}
      <CustomProduct3DModal
        isOpen={isCustom3DModalOpen}
        onClose={() => setIsCustom3DModalOpen(false)}
        onAddNewProduct={handleAddNewCustomProduct}
      />

      {activeStoryModal && (
        <StorySpotlightModal
          story={activeStoryModal}
          stories={storiesList}
          allProducts={productsList}
          onClose={() => setActiveStoryModal(null)}
          onSelectStory={(nextStory) => setActiveStoryModal(nextStory)}
          onOpenProduct={(prod) => handleOpenProductModal(prod, 'original')}
        />
      )}

      {activeArticleModal && (
        <ArticleReaderModal
          article={activeArticleModal}
          onClose={() => setActiveArticleModal(null)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onClearCart={() => setCartItems([])}
        onShowToast={addAppToast}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setForceOpenProfileMenu(true);
        }}
      />

      {/* پنجره مودال تایید خروج از حساب کاربری */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      {/* کانتینر نمایش پاپ‌آپ‌های نوتیفیکیشن خروج */}
      <AppToastContainer
        toasts={appToasts}
        onDismiss={(id) =>
          setAppToasts((prev) => prev.filter((t) => t.id !== id))
        }
      />

      {/* پریلودر بارگذاری اولیه سایت و انتقال بین صفحات (دسکتاپ و موبایل) */}
      <PagePreloader isVisible={isPagePreloading} />
    </div>
  );
};
