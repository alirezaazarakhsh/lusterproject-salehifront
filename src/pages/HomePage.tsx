import React, { useState } from 'react';
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
 * کامپوننت صفحه اصلی (HomePage)
 * تمامی بخش‌ها به صورت ماژولار، سبک و خوانا در پوشه src/components/sections قرار دارند.
 */
export const HomePage: React.FC = () => {
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
      {/* ۱. هدر بالای صفحه با لوگو و پترن Vector.png دقیق */}
      <HeaderSection
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

      {/* ۱۰. فوتر تمام‌عرض دو رنگ */}
      <FooterSection />

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
    </div>
  );
};
