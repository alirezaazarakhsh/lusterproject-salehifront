import React, { useState, useEffect, useRef } from 'react';
import {
  SALEHI_COLLECTION_PRODUCTS,
  STORY_ITEMS,
  ChandelierProduct,
  StoryItem,
  MagazineArticle,
} from '../data/chandelierData';
import { FinishType } from '../components/Chandelier3DViewer';
import { HeaderSection } from '../components/sections/HeaderSection';
import { StoriesSection } from '../components/sections/StoriesSection';
import { HeroSection } from '../components/sections/HeroSection';
import { CategorySection } from '../components/sections/CategorySection';
import { AboutServicesSection } from '../components/sections/AboutServicesSection';
import { ProductsCarouselSection } from '../components/sections/ProductsCarouselSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { MagazineSection } from '../components/sections/MagazineSection';
import { FooterSection } from '../components/sections/FooterSection';
import { RuleContentSection } from '../rule';
import { ContactUsContentSection } from '../contact-us';
import { AboutUsContentSection } from '../about-us';
import { ProjectContentSection } from '../project';
import { NotFoundContentSection } from '../not-found';
import { ServerErrorContentSection } from '../server-error';
import { PagePreloader } from '../components/PagePreloader';
import {
  AppRoute,
  VALID_HOME_HASHES,
  getCurrentRoute,
  navigateToRoute,
  subscribeToRoute,
} from '../utils/navigation';
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
    // نمایش پریلودر هنگام باز شدن اولیه سایت
    triggerPagePreloader(1650);

    const unsubscribe = subscribeToRoute((nextRoute) => {
      triggerPagePreloader(1350);
      setCurrentRoute(nextRoute);
    });
    const syncRoute = (e?: Event) => {
      const customRoute = (e as CustomEvent<AppRoute>)?.detail;
      triggerPagePreloader(1350);
      setCurrentRoute(customRoute ?? getCurrentRoute());
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
        rawHref.startsWith('mailto:')
      ) {
        return;
      }

      const lowerHref = rawHref.toLowerCase();

      if (lowerHref.startsWith('#')) {
        if (
          lowerHref === '#rule' ||
          lowerHref === '#/rule' ||
          lowerHref === '#contact-us' ||
          lowerHref === '#/contact-us' ||
          lowerHref === '#about-us' ||
          lowerHref === '#/about-us' ||
          lowerHref === '#project' ||
          lowerHref === '#/project' ||
          lowerHref === '#projects' ||
          lowerHref === '#/projects' ||
          lowerHref.startsWith('#project/') ||
          lowerHref.startsWith('#/project/') ||
          lowerHref.startsWith('#projects/') ||
          lowerHref.startsWith('#/projects/')
        ) {
          return;
        }
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
        if (!VALID_HOME_HASHES.has(lowerHref)) {
          e.preventDefault();
          setCurrentRoute('not-found');
          navigateToRoute('not-found');
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
          !cleanPath.startsWith('/projects/')
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
    document.addEventListener('click', handleGlobalLinkClick);
    return () => {
      unsubscribe();
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('app-route-change', syncRoute);
      window.removeEventListener('offline', handleServerDown);
      window.removeEventListener('app-server-error', handleServerDown);
      document.removeEventListener('click', handleGlobalLinkClick);
      if (preloaderTimeoutRef.current) {
        window.clearTimeout(preloaderTimeoutRef.current);
      }
    };
  }, []);
  const [productsList, setProductsList] = useState<ChandelierProduct[]>(
    SALEHI_COLLECTION_PRODUCTS
  );
  const [storiesList] = useState<StoryItem[]>(STORY_ITEMS);
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
    setActiveProductModal({ product, finish });
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
      className="min-h-screen w-full bg-[#fcfbf9] text-[#222222] overflow-x-hidden"
    >
      {/* ۱. هدر بالای صفحه (در صفحات 404 و قطعی سرور 500 فقط در دسکتاپ نمایش داده می‌شود و در موبایل مخفی است مطابق تصاویر) */}
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
            // show a beautiful success toast for logging in
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
        />
      </div>

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
        <RuleContentSection />
      ) : currentRoute === 'contact-us' ? (
        /* محتوای میانی صفحه تماس با ما (/contact-us) */
        <ContactUsContentSection onShowToast={addAppToast} />
      ) : currentRoute === 'about-us' ? (
        /* محتوای میانی صفحه درباره ما (/about-us) */
        <AboutUsContentSection onShowToast={addAppToast} />
      ) : currentRoute === 'project' ? (
        /* محتوای میانی صفحه پروژه‌ها (/project) */
        <ProjectContentSection
          onOpenProductModal={(prod) => handleOpenProductModal(prod)}
          onAddToCart={handleAddToCart}
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
          <HeroSection />

          {/* ۴. دسته بندی محصولات */}
          <CategorySection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* ۵. درباره خدمات لوستر + قاب قوسی سه‌بعدی */}
          <AboutServicesSection
            featuredProduct={productsList[3] || productsList[0]}
            onOpenProductModal={(prod) => handleOpenProductModal(prod)}
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
            onSelectArticle={(article) => setActiveArticleModal(article)}
          />
        </>
      )}

      {/* ۱۰. فوتر تمام‌عرض دو رنگ (در صفحات 404 و 500 نمایش داده نمی‌شود مطابق تصاویر) */}
      {currentRoute !== 'not-found' && currentRoute !== 'server-error' && (
        <FooterSection
          currentRoute={currentRoute}
          onNavigateRoute={(route, hashAnchor) => {
            setCurrentRoute(route);
            navigateToRoute(route, hashAnchor);
          }}
        />
      )}

      {/* پنجره مودال استودیو سه‌بعدی و تغییر رنگ محصول */}
      <ProductStudioModal
        product={activeProductModal?.product || null}
        initialFinish={activeProductModal?.finish || 'original'}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCart}
        initialTab="3d"
      />

      {/* پنجره مودال آپلود هر عکس جدید و تبدیل خودکار به مدل سه‌بعدی */}
      <CustomProduct3DModal
        isOpen={isCustom3DModalOpen}
        onClose={() => setIsCustom3DModalOpen(false)}
        onAddNewProduct={handleAddNewCustomProduct}
      />

      <StorySpotlightModal
        story={activeStoryModal}
        stories={storiesList}
        onClose={() => setActiveStoryModal(null)}
        onSelectStory={(nextStory) => setActiveStoryModal(nextStory)}
        onOpenProduct={(prod) => handleOpenProductModal(prod, 'original')}
      />

      <ArticleReaderModal
        article={activeArticleModal}
        onClose={() => setActiveArticleModal(null)}
      />

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
