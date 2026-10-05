import {
  SALEHI_COLLECTION_PRODUCTS,
  PRODUCT_CATEGORIES,
  EXECUTED_PROJECTS,
  STORY_ITEMS,
  MAGAZINE_ARTICLES,
} from '../data/chandelierData';
import {
  FooterSettingsConfig,
  INITIAL_FOOTER_SETTINGS,
} from '../components/sections/FooterSection';
import {
  ContactUsSettingsConfig,
  INITIAL_CONTACT_US_SETTINGS,
} from '../contact-us';
import {
  AboutUsSettingsConfig,
  INITIAL_ABOUT_US_SETTINGS,
} from '../about-us/AboutUsContentSection';
import {
  HeroSliderSettingsConfig,
  INITIAL_HERO_SLIDER_SETTINGS,
} from '../components/sections/HeroSection';
import { ALL_INITIAL_PROJECTS } from '../data/allDatabaseProjectsSeed';
import {
  fetchAllDataFromFirestore,
  saveAllDataToFirestore,
} from '../lib/firestoreSync';

const LOCAL_DB_STORAGE_KEY = 'salehi_cms_fallback_db_v2';

export const DEFAULT_SUPER_ADMIN_PHONE = '09120759419';
export const DEFAULT_SUPER_ADMIN_PASS = 'sasha9419';

const ALL_ADMIN_SECTIONS = [
  'dashboard',
  'admins',
  'products',
  'categories',
  'projects',
  'stories',
  'articles',
  'messages',
  'orders',
  'settings',
];

export function normalizeAdminPhoneClient(raw: string): string {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  let cleaned = String(raw || '')
    .trim()
    .replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
    .replace(/[\s\-()]+/g, '');
  if (cleaned.startsWith('+98')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('0098')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.length === 10 && cleaned.startsWith('9')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

interface LocalDbSchema {
  users: any[];
  products: any[];
  categories: any[];
  projects: any[];
  stories: any[];
  articles: any[];
  messages: any[];
  orders: any[];
  footerSettings: FooterSettingsConfig;
  contactUsSettings: ContactUsSettingsConfig;
  aboutUsSettings: AboutUsSettingsConfig;
  heroSliderSettings: HeroSliderSettingsConfig;
  mainSettings: any;
  smsSettings: any;
  faqSettings: any;
}

export const INITIAL_MAIN_SETTINGS = {
  hideLanguageSelector: false,
  siteTitle: 'گالری لوستر اکبر صالحی',
  siteSubtitle: 'بزرگترین تولیدکننده لوسترهای برنزی و کریستال در تهران',
  supportPhone: '09120759419',
  instagramUrl: 'https://instagram.com/lostersalehi',
  telegramUrl: 'https://t.me/lostersalehi',
  servicesTitle: 'درباره خدمات لوستر',
  servicesSubtitle: 'درباره خدمات',
  service1Title: 'عملکرد پیاده سازی',
  service1Description: 'گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری، آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز به نردبان هیدرولیکی به متر 12 . محدوده نصب خدمات تهران، کرج، لواسانات را برای شما مشتریان عزیز انجام میدهد. لوستر صالحی با بیش از 18 سال سابقه کاری در صنعت لوستر ایران دارای رزومه کاری فرودگاه امام خمینی ، مسجد فخر آباد مسجد چهارده معصوم و انواع مساجد سینما آستارای تجریش و غیره آماده ارائه خدمات برای شما مشتریان عزیز می باشد.',
  service2Title: 'خدمات بسته بندی، نصب لوستر',
  service2Description: 'گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری، آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب لوستر طبقاتی و نصب کلاب میباشد. آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز میباشد،',
  servicesMainImage: '/src/assets/images/chandelier_shah_malakeh_1790646240589.jpg',
  headerMenus: [
    {
      id: 'menu-products',
      label: 'محصولات',
      href: '',
      submenuItems: [
        { id: 'sub-chandeliers', label: 'کلکسیون لوستر ها', href: '/product/categories/chandeliers' },
        { id: 'sub-single-branch', label: 'کلکسیون تک شاخه ها', href: '/product/categories/single-branch' },
        { id: 'sub-kenar-saloni', label: 'کلکسیون کنار سالونی', href: '/product/categories/kenar-saloni' },
        { id: 'sub-abalour', label: 'کلکسیون آباژور', href: '/product/categories/abalour' },
        { id: 'sub-mirror-console', label: 'کلکسیون آینه و کنسول', href: '/product/categories/mirror-console' },
        { id: 'sub-shamdooni', label: 'کلکسیون شمعدونی', href: '/product/categories/shamdooni' },
        { id: 'sub-table', label: 'کلکسیون میز', href: '/product/categories/table' },
      ],
    },
    {
      id: 'menu-projects',
      label: 'پروژه ها',
      href: '/project',
    },
    {
      id: 'menu-blog',
      label: 'بلاگ',
      href: '#magazine-section',
    },
    {
      id: 'menu-contact',
      label: 'تماس با ما',
      href: '/contact-us',
    },
    {
      id: 'menu-about',
      label: 'درباره ما',
      href: '/about-us',
    },
    {
      id: 'menu-more',
      label: 'موارد دیگر',
      href: '',
      submenuItems: [
        { id: 'more-admin', label: 'پنل مدیریت (Admin)', href: '/admin' },
        { id: 'more-rules', label: 'قوانین و مقررات', href: '/rule' },
        { id: 'more-bestsellers', label: 'پرفروش‌ترین محصولات', href: '/product/categories/chandeliers' },
        { id: 'more-custom', label: 'سفارش اختصاصی لوستر', href: '#custom-chandelier' },
        { id: 'more-categories', label: 'دسته‌بندی کلکسیون‌ها', href: '/product/categories/chandeliers' },
        { id: 'more-testimonials', label: 'نظرات مشتریان', href: '#customer-reviews' },
        { id: 'more-faq', label: 'سوالات متداول', href: '#faq-section' },
      ],
    },
  ],
};

export const INITIAL_SMS_SETTINGS = {
  apiKey: 'YOUR_SMS_API_KEY_HERE',
  senderLine: '10008585',
  adminPhone: '09120759419',
  enableNewOrderSmsAdmin: true,
  enableNewOrderSmsCustomer: true,
  enableNewContactMessageSms: true,
  welcomeSmsTemplate: 'سلام %name% عزیز، به گالری لوستر صالحی خوش آمدید.',
  newOrderSmsTemplateAdmin: 'ادمین گرامی، سفارش جدید شماره %orderId% با مبلغ %amount% ثبت شد.',
  newOrderSmsTemplateCustomer: 'سلام %name% عزیز، سفارش شماره %orderId% با موفقیت ثبت شد و در حال پردازش است.',
};

export const INITIAL_FAQ_SETTINGS = {
  faqs: {
    about: [
      {
        id: 'faq-about-1',
        question: 'پشتیبانی لوستر صالحی به چه صورت است ؟',
        answer: 'تمامی محصولات لوستر صالحی دارای پشتیبانی و خدمات پس از فروش مادام‌العمر هستند. شما می‌توانید در هر ساعت از شبانه‌روز با تیم پشتیبانی ما تماس بگیرید.',
      },
      {
        id: 'faq-about-2',
        question: 'همکاری در فروش چه شرایطی لازم است ؟',
        answer: 'برای همکاری در فروش، داشتن فروشگاه فیزیکی یا آنلاین معتبر و ارائه مدارک شناسایی الزامی است. پس از بررسی درخواست توسط واحد بازرگانی، قرارداد همکاری منعقد می‌گردد.',
      },
      {
        id: 'faq-about-3',
        question: 'مواد اولیه لوستر از کجا تامین میشود؟',
        answer: 'مواد اولیه محصولات ما شامل برنز درجه یک و کریستال‌های باکیفیت از بهترین منابع داخلی و خارجی تامین می‌شوند تا دوام و زیبایی محصول تضمین شود.',
      },
      {
        id: 'faq-about-4',
        question: 'پیاده سازی عملکرد آبکاری لوستر صالحی به چه صورتی است ؟',
        answer: 'آبکاری محصولات با استفاده از تکنولوژی‌های نوین و طلا یا کروم با عیار بالا انجام می‌شود که ثبات رنگ ۱۰ ساله کتبی را برای مشتریان عزیز به همراه دارد.',
      },
    ],
    rules: [
      {
        id: 'faq-rules-1',
        question: 'شرایط تعویض یا مرجوعی کالا چیست؟',
        answer: 'در صورت وجود هرگونه نقص فنی یا مغایرت با سفارش، کالا تا ۷ روز پس از تحویل قابل تعویض یا مرجوعی می‌باشد، مشروط بر اینکه محصول در شرایط اولیه خود باقی مانده باشد.',
      },
      {
        id: 'faq-rules-2',
        question: 'زمان تحویل سفارشات چقدر است؟',
        answer: 'سفارشات آماده ارسال ظرف ۲۴ تا ۴۸ ساعت و سفارشات اختصاصی با توجه به پیچیدگی طراحی، بین ۱۰ تا ۲۰ روز کاری زمان می‌برند.',
      },
    ],
  },
};

function createInitialLocalDb(): LocalDbSchema {
  const defaultAdmin = {
    id: 1,
    uid: `admin-${DEFAULT_SUPER_ADMIN_PHONE}`,
    phone: DEFAULT_SUPER_ADMIN_PHONE,
    password: DEFAULT_SUPER_ADMIN_PASS,
    email: `${DEFAULT_SUPER_ADMIN_PHONE}@salehi-admin.local`,
    displayName: 'اکبر صالحی (مدیر ارشد)',
    role: 'super_admin',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    permissions: [...ALL_ADMIN_SECTIONS],
    permissionsJson: JSON.stringify(ALL_ADMIN_SECTIONS),
    createdAt: new Date().toISOString(),
  };

  const seededProducts = SALEHI_COLLECTION_PRODUCTS.map((p, idx) => ({
    id: idx + 1,
    productKey: p.id || `prod-${idx + 1}`,
    name: p.name,
    subtitle: p.subtitle,
    priceFormatted: p.priceFormatted,
    priceNumeric: Number(p.priceNumeric) || 0,
    productCode: p.productCode,
    image: p.image,
    modelType: p.modelType || 'crystali',
    defaultFinish: p.defaultFinish || 'gold-24k',
    categorySlug: p.categoryKey || 'chandeliers',
    outOfStock: Boolean(p.outOfStock),
    hasSnappPay: Boolean(p.hasSnappPay),
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: p.dimensions || 'قطر ۸۵ سانتی‌متر | ارتفاع ۱۱۰ سانتی‌متر',
    branchesCount: p.branchesCount || '۱۲ شاخه (۲۴ شعله)',
    bodyMaterial:
      p.bodyMaterial || 'برنز خالص پرداخت‌شده با کریستال درجه یک',
    warranty: p.warranty || '۱۰ سال ضمانت کتبی اصالت و ثبات رنگ',
    description:
      p.description ||
      'ساخته‌شده در کارگاه مرکزی لوستر اکبر صالحی با بهترین متریال برنز و کریستال.',
  }));

  const seededCategories = PRODUCT_CATEGORIES.map((c, idx) => ({
    id: idx + 1,
    slug: c.slug,
    title: c.title,
    countLabel: c.countText,
    image: (c as any).image || '',
    sortOrder: idx + 1,
  }));

  const seededProjects = ALL_INITIAL_PROJECTS.map((pr, idx) => ({
    id: idx + 1,
    slug: pr.slug,
    categoryTab: pr.categoryTab,
    sampleCode: pr.sampleCode,
    district: pr.district,
    title: pr.title,
    subtitle: pr.subtitle,
    description: pr.description,
    usedChandeliersText: pr.usedChandeliersText,
    mainImage: pr.mainImage,
    galleryImages: pr.galleryImages,
    galleryJson: pr.galleryJson,
    locationBadge: pr.locationBadge,
    dateBadge: pr.dateBadge,
    likesCount: 0,
    chandeliersList: pr.chandeliersList,
  }));

  const seededStories = STORY_ITEMS.map((st, idx) => ({
    id: idx + 1,
    storyKey: st.id || `story-${idx + 1}`,
    storyType: st.storyType || 'single-product',
    title: st.title,
    fullTitle: st.fullTitle || st.title,
    subtitle: st.subtitle || '',
    category: st.category || 'chandeliers',
    categoryLabel: st.categoryLabel || 'کلکسیون لوستر',
    durationSeconds: st.durationSeconds || 10,
    thumbnailImage: st.thumbnailImage || st.image,
    image: st.image,
    mediaUrl: st.mediaUrl || st.image,
    videoUrl: st.videoUrl || '',
    linkedProductKey:
      st.linkedProductKey || st.products?.[0]?.id || 'prod-crystali',
    price: st.price || '۱۶,۴۰۰,۰۰۰ تومان',
    modelType: st.modelType || 'crystali',
    finish: st.finish || 'gold-24k',
    slidesJson: JSON.stringify(
      st.slides && st.slides.length > 0
        ? st.slides
        : [
            {
              id: `slide-${idx + 1}-0`,
              type: st.storyType || 'single-product',
              title: st.fullTitle || st.title,
              mediaUrl: st.mediaUrl || st.image,
              videoUrl: st.videoUrl || '',
              linkedProductKey:
                st.linkedProductKey || st.products?.[0]?.id || 'prod-crystali',
            },
          ]
    ),
  }));

  const seededArticles = MAGAZINE_ARTICLES.map((ar, idx) => ({
    id: idx + 1,
    articleKey: ar.id || `mag-${idx + 1}`,
    slug: ar.id || `mag-${idx + 1}`,
    title: ar.title,
    excerpt: ar.excerpt,
    content: Array.isArray(ar.fullContent)
      ? ar.fullContent.join('\n')
      : ar.excerpt,
    fullContent: Array.isArray(ar.fullContent) ? ar.fullContent : [ar.excerpt],
    publishDate: ar.date || '۱۸ مهر ۱۴۰۴',
    readTime: '۵ دقیقه مطالعه',
    category: 'راهنمای دکوراسیون سلطنتی',
    image: ar.image,
    featured: false,
  }));

  return {
    users: [defaultAdmin],
    products: seededProducts,
    categories: seededCategories,
    projects: seededProjects,
    stories: seededStories,
    articles: seededArticles,
    messages: [
      {
        id: 1,
        fullName: 'امیرحسین رضایی',
        phone: '09123456789',
        subject: 'مشاوره خرید لوستر تالاری و مسکونی',
        message:
          'سلام، برای سالن پذیرایی با ارتفاع سقف ۴ متر قصد سفارش لوستر ۱۲ شاخه برنزی داشتم. لطفاً راهنمایی بفرمایید.',
        status: 'new',
        createdAt: new Date().toISOString(),
      },
    ],
    orders: [
      {
        id: 1,
        customerName: 'محمدرضا کریمی',
        customerPhone: '09121112233',
        itemsJson: JSON.stringify([
          { name: 'لوستر کریستالی', quantity: 1, price: '۱۶,۴۰۰,۰۰۰ تومان' },
        ]),
        totalPriceNumeric: 16400000,
        totalPriceFormatted: '۱۶,۴۰۰,۰۰۰ تومان',
        totalAmountNumeric: 16400000,
        totalAmountFormatted: '۱۶,۴۰۰,۰۰۰ تومان',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ],
    footerSettings: INITIAL_FOOTER_SETTINGS,
    contactUsSettings: INITIAL_CONTACT_US_SETTINGS,
    aboutUsSettings: INITIAL_ABOUT_US_SETTINGS,
    heroSliderSettings: INITIAL_HERO_SLIDER_SETTINGS,
    mainSettings: INITIAL_MAIN_SETTINGS,
    smsSettings: INITIAL_SMS_SETTINGS,
    faqSettings: INITIAL_FAQ_SETTINGS,
  };
}

function loadLocalDb(): LocalDbSchema {
  try {
    const raw = localStorage.getItem(LOCAL_DB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const initial = createInitialLocalDb();
      const usersList =
        Array.isArray(parsed.users) && parsed.users.length > 0
          ? parsed.users
          : initial.users;
      // تضمین وجود اکانت پیش‌فرض ساشا در لیست کاربران محلی
      const hasDefaultAdmin = usersList.some(
        (u: any) =>
          normalizeAdminPhoneClient(u.phone) === DEFAULT_SUPER_ADMIN_PHONE
      );
      if (!hasDefaultAdmin) {
        usersList.unshift(initial.users[0]);
      }
      return {
        users: usersList,
        products:
          Array.isArray(parsed.products)
            ? parsed.products
            : initial.products,
        categories:
          Array.isArray(parsed.categories)
            ? parsed.categories
            : initial.categories,
        projects:
          Array.isArray(parsed.projects)
            ? parsed.projects
            : initial.projects,
        stories:
          Array.isArray(parsed.stories)
            ? parsed.stories
            : initial.stories,
        articles:
          Array.isArray(parsed.articles)
            ? parsed.articles
            : initial.articles,
        messages: Array.isArray(parsed.messages)
          ? parsed.messages
          : initial.messages,
        orders: Array.isArray(parsed.orders) ? parsed.orders : initial.orders,
        footerSettings: {
          ...INITIAL_FOOTER_SETTINGS,
          ...(parsed.footerSettings || {}),
        },
        contactUsSettings: {
          ...INITIAL_CONTACT_US_SETTINGS,
          ...(parsed.contactUsSettings || {}),
        },
        aboutUsSettings: {
          ...INITIAL_ABOUT_US_SETTINGS,
          ...(parsed.aboutUsSettings || {}),
        },
        heroSliderSettings: {
          ...INITIAL_HERO_SLIDER_SETTINGS,
          ...(parsed.heroSliderSettings || {}),
        },
        mainSettings: {
          ...INITIAL_MAIN_SETTINGS,
          ...(parsed.mainSettings || {}),
        },
        smsSettings: {
          ...INITIAL_SMS_SETTINGS,
          ...(parsed.smsSettings || {}),
        },
        faqSettings: {
          ...INITIAL_FAQ_SETTINGS,
          ...(parsed.faqSettings || {}),
        },
      };
    }
  } catch {
    // ignore storage errors
  }
  return createInitialLocalDb();
}

function saveLocalDb(dbState: LocalDbSchema) {
  try {
    localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(dbState));
  } catch {
    // ignore quota errors
  }
  // ذخیره دائم و بلادرنگ در Cloud Firestore تا با پاک شدن لوکال استوریج داده‌ها از بین نروند
  saveAllDataToFirestore(dbState).catch((err) => {
    console.warn('Firestore cloud sync notice:', err);
  });
}

let hasInitiatedFirestoreSync = false;

export async function syncFromFirestore(): Promise<void> {
  try {
    const cloudData = await fetchAllDataFromFirestore();
    if (cloudData && typeof cloudData === 'object') {
      const current = loadLocalDb();
      const merged: LocalDbSchema = {
        users:
          Array.isArray(cloudData.users)
            ? cloudData.users
            : current.users,
        products:
          Array.isArray(cloudData.products)
            ? cloudData.products
            : current.products,
        categories:
          Array.isArray(cloudData.categories)
            ? cloudData.categories
            : current.categories,
        projects:
          Array.isArray(cloudData.projects)
            ? cloudData.projects
            : current.projects,
        stories:
          Array.isArray(cloudData.stories)
            ? cloudData.stories
            : current.stories,
        articles:
          Array.isArray(cloudData.articles)
            ? cloudData.articles
            : current.articles,
        messages: Array.isArray(cloudData.messages)
          ? cloudData.messages
          : current.messages,
        orders: Array.isArray(cloudData.orders)
          ? cloudData.orders
          : current.orders,
        footerSettings: {
          ...current.footerSettings,
          ...(cloudData.footerSettings || {}),
        },
        contactUsSettings: {
          ...current.contactUsSettings,
          ...(cloudData.contactUsSettings || {}),
        },
        aboutUsSettings: {
          ...current.aboutUsSettings,
          ...(cloudData.aboutUsSettings || {}),
        },
        heroSliderSettings: {
          ...current.heroSliderSettings,
          ...(cloudData.heroSliderSettings || {}),
        },
        mainSettings: {
          ...current.mainSettings,
          ...(cloudData.mainSettings || {}),
        },
        smsSettings: {
          ...current.smsSettings,
          ...(cloudData.smsSettings || {}),
        },
        faqSettings: {
          ...current.faqSettings,
          ...(cloudData.faqSettings || {}),
        },
      };
      try {
        localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(merged));
      } catch {}
    }
  } catch (e) {
    console.warn('Failed to sync from Firestore:', e);
  }
}

export function initFirestoreAutoSync(): void {
  if (hasInitiatedFirestoreSync) return;
  hasInitiatedFirestoreSync = true;
  syncFromFirestore().catch(() => {});
}

function parseBody(options?: RequestInit): any {
  if (!options?.body) return {};
  if (typeof options.body === 'string') {
    try {
      return JSON.parse(options.body);
    } catch {
      return {};
    }
  }
  return options.body;
}

export async function handleLocalApiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const method = (options.method || 'GET').toUpperCase();
  const body = parseBody(options);
  const dbState = loadLocalDb();
  const cleanUrl = url.split('?')[0];

  // ۱. ورود ادمین
  if (cleanUrl === '/api/admin/login' && method === 'POST') {
    const phone = normalizeAdminPhoneClient(body.phone || '');
    const password = String(body.password || '').trim();

    if (!phone || !password) {
      throw new Error('شماره موبایل و رمز عبور الزامی است.');
    }

    let matched = dbState.users.find(
      (u) =>
        normalizeAdminPhoneClient(u.phone) === phone && u.password === password
    );

    if (
      !matched &&
      phone === DEFAULT_SUPER_ADMIN_PHONE &&
      password === DEFAULT_SUPER_ADMIN_PASS
    ) {
      matched = {
        id: 1,
        uid: `admin-${DEFAULT_SUPER_ADMIN_PHONE}`,
        phone: DEFAULT_SUPER_ADMIN_PHONE,
        password: DEFAULT_SUPER_ADMIN_PASS,
        email: `${DEFAULT_SUPER_ADMIN_PHONE}@salehi-admin.local`,
        displayName: 'اکبر صالحی (مدیر ارشد)',
        role: 'super_admin',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        permissions: [...ALL_ADMIN_SECTIONS],
        permissionsJson: JSON.stringify(ALL_ADMIN_SECTIONS),
        createdAt: new Date().toISOString(),
      };
    }

    if (!matched) {
      throw new Error('شماره موبایل یا رمز عبور اشتباه است.');
    }

    const permissions = Array.isArray(matched.permissions)
      ? matched.permissions
      : [...ALL_ADMIN_SECTIONS];
    const userPayload = {
      ...matched,
      permissions,
      permissionsJson: JSON.stringify(permissions),
    };
    const tokenPayload = btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify({
            id: userPayload.id,
            uid: userPayload.uid,
            phone: userPayload.phone,
            role: userPayload.role,
            iat: Date.now(),
            exp: Date.now() + 30 * 60 * 1000,
          })
        )
      )
    );
    return {
      token: `adm.${tokenPayload}.local`,
      expiresInMs: 30 * 60 * 1000,
      admin: userPayload,
      user: userPayload,
    };
  }

  // ۲. بررسی نشست فعلی ادمین
  if (cleanUrl === '/api/admin/me' && method === 'GET') {
    const savedUserRaw = localStorage.getItem('salehi_admin_session_user');
    if (savedUserRaw) {
      try {
        const parsedUser = JSON.parse(savedUserRaw);
        return { admin: parsedUser, user: parsedUser };
      } catch {
        // ignore
      }
    }
    const fallbackAdmin = dbState.users[0];
    return { admin: fallbackAdmin, user: fallbackAdmin };
  }

  // ۳. کاتالوگ عمومی سایت
  if (cleanUrl === '/api/public/catalog' && method === 'GET') {
    return {
      categories: dbState.categories,
      products: dbState.products,
      projects: dbState.projects,
      stories: dbState.stories,
      articles: dbState.articles,
      footerSettings: dbState.footerSettings,
      contactUsSettings: dbState.contactUsSettings,
      aboutUsSettings: dbState.aboutUsSettings,
      heroSliderSettings: dbState.heroSliderSettings,
      mainSettings: dbState.mainSettings,
      smsSettings: dbState.smsSettings,
      faqSettings: dbState.faqSettings,
    };
  }

  // ۴. ثبت پیام تماس با ما عمومی
  if (cleanUrl === '/api/public/contact' && method === 'POST') {
    const nextId =
      dbState.messages.reduce((max, m) => Math.max(max, Number(m.id) || 0), 0) +
      1;
    const created = {
      id: nextId,
      fullName: String(body.fullName || 'مشتری گالری'),
      phone: String(body.phone || ''),
      subject: String(body.subject || 'مشاوره خرید'),
      message: String(body.message || ''),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    dbState.messages.unshift(created);
    saveLocalDb(dbState);
    return created;
  }

  // ۵. ثبت سفارش عمومی
  if (cleanUrl === '/api/public/orders' && method === 'POST') {
    const nextId =
      dbState.orders.reduce((max, o) => Math.max(max, Number(o.id) || 0), 0) +
      1;
    const numericPrice =
      Number(body.totalPriceNumeric ?? body.totalAmountNumeric) || 0;
    const formattedPrice = String(
      body.totalPriceFormatted || body.totalAmountFormatted || '۰ تومان'
    );
    const created = {
      id: nextId,
      customerName: String(body.customerName || ''),
      customerPhone: String(body.customerPhone || ''),
      itemsJson:
        typeof body.itemsJson === 'string'
          ? body.itemsJson
          : JSON.stringify(body.itemsJson || []),
      totalPriceNumeric: numericPrice,
      totalPriceFormatted: formattedPrice,
      totalAmountNumeric: numericPrice,
      totalAmountFormatted: formattedPrice,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    dbState.orders.unshift(created);
    saveLocalDb(dbState);
    return created;
  }

  // ۶. آمار داشبورد ادمین
  if (
    (cleanUrl === '/api/admin/dashboard' ||
      cleanUrl === '/api/admin/summary') &&
    method === 'GET'
  ) {
    return {
      productsCount: dbState.products.length,
      categoriesCount: dbState.categories.length,
      projectsCount: dbState.projects.length,
      storiesCount: dbState.stories.length,
      articlesCount: dbState.articles.length,
      messagesCount: dbState.messages.length,
      ordersCount: dbState.orders.length,
      usersCount: dbState.users.length,
    };
  }

  // ۷. مدیریت ادمین‌ها
  if (cleanUrl === '/api/admin/users') {
    if (method === 'GET') {
      return dbState.users;
    }
    if (method === 'POST') {
      const phone = normalizeAdminPhoneClient(body.phone || '');
      const nextId =
        dbState.users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) +
        1;
      const permissions = Array.isArray(body.permissions)
        ? body.permissions
        : [...ALL_ADMIN_SECTIONS];
      const created = {
        id: nextId,
        uid: `admin-${phone}-${Date.now()}`,
        phone,
        password: String(body.password || '').trim(),
        email: `${phone}@salehi-admin.local`,
        displayName: String(body.displayName || `ادمین (${phone})`),
        role:
          permissions.length === ALL_ADMIN_SECTIONS.length
            ? 'super_admin'
            : 'admin',
        avatarUrl:
          body.avatarUrl ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        permissions,
        permissionsJson: JSON.stringify(permissions),
        createdAt: new Date().toISOString(),
      };
      dbState.users.push(created);
      saveLocalDb(dbState);
      return created;
    }
  }
  if (cleanUrl.startsWith('/api/admin/users/')) {
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PUT') {
      const idx = dbState.users.findIndex((u) => Number(u.id) === id);
      if (idx !== -1) {
        const current = dbState.users[idx];
        const permissions = Array.isArray(body.permissions)
          ? body.permissions
          : current.permissions || [...ALL_ADMIN_SECTIONS];
        const updated = {
          ...current,
          displayName: body.displayName || current.displayName,
          phone: body.phone
            ? normalizeAdminPhoneClient(body.phone)
            : current.phone,
          password:
            body.password && String(body.password).trim()
              ? String(body.password).trim()
              : current.password,
          avatarUrl: body.avatarUrl || current.avatarUrl,
          permissions,
          permissionsJson: JSON.stringify(permissions),
        };
        dbState.users[idx] = updated;
        saveLocalDb(dbState);
        return updated;
      }
    }
    if (method === 'DELETE') {
      if (dbState.users.length <= 1) {
        throw new Error('امکان حذف تنها ادمین باقی‌مانده وجود ندارد.');
      }
      dbState.users = dbState.users.filter((u) => Number(u.id) !== id);
      saveLocalDb(dbState);
      return { success: true, id };
    }
  }

  // ۸. مدیریت محصولات
  if (cleanUrl === '/api/admin/products') {
    if (method === 'GET') return dbState.products;
    if (method === 'POST') {
      const nextId =
        dbState.products.reduce(
          (max, p) => Math.max(max, Number(p.id) || 0),
          0
        ) + 1;
      const created = {
        ...body,
        id: nextId,
        productKey: body.productKey || `prod-custom-${nextId}`,
      };
      dbState.products.unshift(created);
      saveLocalDb(dbState);
      return created;
    }
  }
  if (cleanUrl.startsWith('/api/admin/products/')) {
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PUT') {
      const idx = dbState.products.findIndex((p) => Number(p.id) === id);
      if (idx !== -1) {
        dbState.products[idx] = { ...dbState.products[idx], ...body, id };
        saveLocalDb(dbState);
        return dbState.products[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.products = dbState.products.filter((p) => Number(p.id) !== id);
      saveLocalDb(dbState);
      return { success: true, id };
    }
  }

  // ۹. مدیریت دسته‌بندی‌ها
  if (cleanUrl === '/api/admin/categories') {
    if (method === 'GET') return dbState.categories;
    if (method === 'POST') {
      const nextId =
        dbState.categories.reduce(
          (max, c) => Math.max(max, Number(c.id) || 0),
          0
        ) + 1;
      const created = { ...body, id: nextId };
      dbState.categories.push(created);
      saveLocalDb(dbState);
      return created;
    }
  }
  if (cleanUrl.startsWith('/api/admin/categories/')) {
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PUT') {
      const idx = dbState.categories.findIndex((c) => Number(c.id) === id);
      if (idx !== -1) {
        dbState.categories[idx] = { ...dbState.categories[idx], ...body, id };
        saveLocalDb(dbState);
        return dbState.categories[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.categories = dbState.categories.filter(
        (c) => Number(c.id) !== id
      );
      saveLocalDb(dbState);
      return { success: true, id };
    }
  }

  // ۱۰. مدیریت پروژه‌ها
  if (cleanUrl === '/api/admin/projects') {
    if (method === 'GET') return dbState.projects;
    if (method === 'POST') {
      const nextId =
        dbState.projects.reduce(
          (max, p) => Math.max(max, Number(p.id) || 0),
          0
        ) + 1;
      const created = {
        ...body,
        id: nextId,
        slug: body.slug || `proj-${nextId}`,
        chandeliersList: Array.isArray(body.chandeliersList) ? body.chandeliersList : [],
        likesCount: Math.max(0, Number(body.likesCount) || 0),
      };
      dbState.projects.unshift(created);
      saveLocalDb(dbState);
      return created;
    }
  }
  if (cleanUrl.startsWith('/api/admin/projects/')) {
    const rawParam = cleanUrl.split('/').pop() || '';
    const numId = Number(rawParam);
    const isNum = !isNaN(numId) && rawParam.trim() !== '';
    const cleanParam = rawParam.replace(/^proj-/, '').toLowerCase();

    if (method === 'PUT') {
      const idx = dbState.projects.findIndex((p) => {
        if (isNum && Number(p.id) === numId) return true;
        if (String(p.id).toLowerCase() === rawParam.toLowerCase() || String(p.id).toLowerCase() === cleanParam) return true;
        if (p.slug && (p.slug.toLowerCase() === rawParam.toLowerCase() || p.slug.toLowerCase() === cleanParam)) return true;
        return false;
      });
      if (idx !== -1) {
        dbState.projects[idx] = {
          ...dbState.projects[idx],
          ...body,
          chandeliersList:
            body.chandeliersList !== undefined
              ? body.chandeliersList
              : dbState.projects[idx].chandeliersList,
          likesCount:
            body.likesCount !== undefined
              ? Math.max(0, Number(body.likesCount) || 0)
              : (Number(dbState.projects[idx].likesCount) || 0),
        };
        saveLocalDb(dbState);
        return dbState.projects[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.projects = dbState.projects.filter((p) => {
        if (isNum && Number(p.id) === numId) return false;
        if (String(p.id).toLowerCase() === rawParam.toLowerCase() || String(p.id).toLowerCase() === cleanParam) return false;
        if (p.slug && (p.slug.toLowerCase() === rawParam.toLowerCase() || p.slug.toLowerCase() === cleanParam)) return false;
        return true;
      });
      saveLocalDb(dbState);
      return { success: true, id: rawParam };
    }
  }

  // دریافت لیست پروژه‌ها (عمومی)
  if ((cleanUrl === '/api/projects' || cleanUrl === '/api/public/projects') && method === 'GET') {
    return dbState.projects;
  }

  // ثبت لایک یا برداشتن لایک پروژه
  if ((cleanUrl.startsWith('/api/projects/') || cleanUrl.startsWith('/api/public/projects/')) && cleanUrl.endsWith('/like') && method === 'POST') {
    const parts = cleanUrl.split('/');
    const idOrSlug = parts[parts.length - 2];
    const numId = Number(idOrSlug);
    const isNum = !isNaN(numId) && idOrSlug.trim() !== '';
    const cleanParam = idOrSlug.replace(/^proj-/, '').toLowerCase();
    const idx = dbState.projects.findIndex((p) => {
      if (isNum && Number(p.id) === numId) return true;
      if (String(p.id).toLowerCase() === idOrSlug.toLowerCase() || String(p.id).toLowerCase() === cleanParam) return true;
      if (p.slug && (p.slug.toLowerCase() === idOrSlug.toLowerCase() || p.slug.toLowerCase() === cleanParam)) return true;
      return false;
    });
    if (idx !== -1) {
      const inc = body?.increment !== false;
      const cur = Number(dbState.projects[idx].likesCount) || 0;
      const nextLikes = inc ? cur + 1 : Math.max(0, cur - 1);
      dbState.projects[idx].likesCount = nextLikes;
      saveLocalDb(dbState);
      return { success: true, likesCount: nextLikes, project: dbState.projects[idx] };
    }
  }

  // تنظیم یا افزایش تعداد لایک‌ها از پنل ادمین
  if ((cleanUrl.startsWith('/api/projects/') || cleanUrl.startsWith('/api/admin/projects/')) && cleanUrl.endsWith('/likes') && (method === 'PATCH' || method === 'POST')) {
    const parts = cleanUrl.split('/');
    const idOrSlug = parts[parts.length - 2];
    const numId = Number(idOrSlug);
    const isNum = !isNaN(numId) && idOrSlug.trim() !== '';
    const cleanParam = idOrSlug.replace(/^proj-/, '').toLowerCase();
    const idx = dbState.projects.findIndex((p) => {
      if (isNum && Number(p.id) === numId) return true;
      if (String(p.id).toLowerCase() === idOrSlug.toLowerCase() || String(p.id).toLowerCase() === cleanParam) return true;
      if (p.slug && (p.slug.toLowerCase() === idOrSlug.toLowerCase() || p.slug.toLowerCase() === cleanParam)) return true;
      return false;
    });
    if (idx !== -1) {
      const nextLikes = Math.max(0, Number(body?.likesCount) || 0);
      dbState.projects[idx].likesCount = nextLikes;
      saveLocalDb(dbState);
      return { success: true, likesCount: nextLikes, project: dbState.projects[idx] };
    }
  }

  // ۱۱. مدیریت استوری‌ها
  if (cleanUrl === '/api/admin/stories') {
    if (method === 'GET') return dbState.stories;
    if (method === 'POST') {
      const nextId =
        dbState.stories.reduce(
          (max, s) => Math.max(max, Number(s.id) || 0),
          0
        ) + 1;
      const created = {
        ...body,
        id: nextId,
        storyKey: body.storyKey || `story-${nextId}`,
        slidesJson: Array.isArray(body.slides)
          ? JSON.stringify(body.slides)
          : body.slidesJson || '[]',
      };
      dbState.stories.unshift(created);
      saveLocalDb(dbState);
      return created;
    }
  }
  if (cleanUrl.startsWith('/api/admin/stories/')) {
    const rawParam = cleanUrl.split('/').pop() || '';
    const numId = Number(rawParam);
    const isNum = !isNaN(numId) && rawParam.trim() !== '';

    if (method === 'PUT') {
      const idx = dbState.stories.findIndex((s) => {
        if (isNum && Number(s.id) === numId) return true;
        if (String(s.id) === rawParam || s.storyKey === rawParam) return true;
        return false;
      });
      if (idx !== -1) {
        dbState.stories[idx] = {
          ...dbState.stories[idx],
          ...body,
          slidesJson: Array.isArray(body.slides)
            ? JSON.stringify(body.slides)
            : body.slidesJson || dbState.stories[idx].slidesJson,
        };
        saveLocalDb(dbState);
        return dbState.stories[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.stories = dbState.stories.filter((s) => {
        if (isNum && Number(s.id) === numId) return false;
        if (String(s.id) === rawParam || s.storyKey === rawParam) return false;
        return true;
      });
      saveLocalDb(dbState);
      return { success: true, id: rawParam };
    }
  }

  // ۱۲. مدیریت مقالات مجله
  if (cleanUrl === '/api/admin/articles') {
    if (method === 'GET') return dbState.articles;
    if (method === 'POST') {
      const nextId =
        dbState.articles.reduce(
          (max, a) => Math.max(max, Number(a.id) || 0),
          0
        ) + 1;
      const created = {
        ...body,
        id: nextId,
        articleKey: `mag-${nextId}`,
        slug: `mag-${nextId}`,
      };
      dbState.articles.unshift(created);
      saveLocalDb(dbState);
      return created;
    }
  }
  if (cleanUrl.startsWith('/api/admin/articles/')) {
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PUT') {
      const idx = dbState.articles.findIndex((a) => Number(a.id) === id);
      if (idx !== -1) {
        dbState.articles[idx] = { ...dbState.articles[idx], ...body, id };
        saveLocalDb(dbState);
        return dbState.articles[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.articles = dbState.articles.filter((a) => Number(a.id) !== id);
      saveLocalDb(dbState);
      return { success: true, id };
    }
  }

  // ۱۳. مدیریت پیام‌ها
  if (cleanUrl === '/api/admin/messages' && method === 'GET') {
    return dbState.messages;
  }
  if (cleanUrl.startsWith('/api/admin/messages/')) {
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PATCH' || method === 'PUT') {
      const idx = dbState.messages.findIndex((m) => Number(m.id) === id);
      if (idx !== -1) {
        dbState.messages[idx] = { ...dbState.messages[idx], ...body, id };
        saveLocalDb(dbState);
        return dbState.messages[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.messages = dbState.messages.filter((m) => Number(m.id) !== id);
      saveLocalDb(dbState);
      return { success: true, id };
    }
  }

  // ۱۴. مدیریت سفارشات
  if (cleanUrl === '/api/admin/orders' && method === 'GET') {
    return dbState.orders;
  }
  if (cleanUrl.startsWith('/api/admin/orders/')) {
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PATCH' || method === 'PUT') {
      const idx = dbState.orders.findIndex((o) => Number(o.id) === id);
      if (idx !== -1) {
        dbState.orders[idx] = { ...dbState.orders[idx], ...body, id };
        saveLocalDb(dbState);
        return dbState.orders[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.orders = dbState.orders.filter((o) => Number(o.id) !== id);
      saveLocalDb(dbState);
      return { success: true, id };
    }
  }

  // ۱۵. تنظیمات فوتر سایت
  if (cleanUrl === '/api/admin/settings/footer') {
    if (method === 'GET') {
      return dbState.footerSettings;
    }
    if (method === 'PUT') {
      dbState.footerSettings = {
        ...INITIAL_FOOTER_SETTINGS,
        ...dbState.footerSettings,
        ...body,
      };
      if (
        body.catalogTitle !== undefined ||
        body.catalogDescription !== undefined ||
        body.catalogCardTitle !== undefined ||
        body.catalogPageCount !== undefined ||
        body.catalogDownloadUrl !== undefined
      ) {
        dbState.aboutUsSettings = {
          ...dbState.aboutUsSettings,
          catalogTitle: body.catalogTitle ?? dbState.aboutUsSettings.catalogTitle,
          catalogDescription: body.catalogDescription ?? dbState.aboutUsSettings.catalogDescription,
          catalogCardTitle: body.catalogCardTitle ?? dbState.aboutUsSettings.catalogCardTitle,
          catalogPageCount: body.catalogPageCount ?? dbState.aboutUsSettings.catalogPageCount,
          catalogDownloadUrl: body.catalogDownloadUrl ?? dbState.aboutUsSettings.catalogDownloadUrl,
        };
      }
      saveLocalDb(dbState);
      return dbState.footerSettings;
    }
  }

  // ۱۶. تنظیمات صفحه تماس با ما
  if (cleanUrl === '/api/admin/settings/contact-us') {
    if (method === 'GET') {
      return dbState.contactUsSettings;
    }
    if (method === 'PUT') {
      dbState.contactUsSettings = {
        ...INITIAL_CONTACT_US_SETTINGS,
        ...dbState.contactUsSettings,
        ...body,
      };
      saveLocalDb(dbState);
      return dbState.contactUsSettings;
    }
  }

  // ۱۷. تنظیمات صفحه درباره ما
  if (
    cleanUrl === '/api/admin/settings/about-us' ||
    cleanUrl === '/api/public/settings/about-us'
  ) {
    if (method === 'GET') {
      return dbState.aboutUsSettings;
    }
    if (method === 'PUT') {
      dbState.aboutUsSettings = {
        ...INITIAL_ABOUT_US_SETTINGS,
        ...dbState.aboutUsSettings,
        ...body,
        galleryImages:
          Array.isArray(body.galleryImages) && body.galleryImages.length > 0
            ? body.galleryImages
            : dbState.aboutUsSettings.galleryImages,
      };
      if (
        body.catalogTitle !== undefined ||
        body.catalogDescription !== undefined ||
        body.catalogCardTitle !== undefined ||
        body.catalogPageCount !== undefined ||
        body.catalogDownloadUrl !== undefined
      ) {
        dbState.footerSettings = {
          ...dbState.footerSettings,
          catalogTitle: body.catalogTitle ?? dbState.footerSettings.catalogTitle,
          catalogDescription: body.catalogDescription ?? dbState.footerSettings.catalogDescription,
          catalogCardTitle: body.catalogCardTitle ?? dbState.footerSettings.catalogCardTitle,
          catalogPageCount: body.catalogPageCount ?? dbState.footerSettings.catalogPageCount,
          catalogDownloadUrl: body.catalogDownloadUrl ?? dbState.footerSettings.catalogDownloadUrl,
        };
      }
      saveLocalDb(dbState);
      return dbState.aboutUsSettings;
    }
  }

  // ۱۸. تنظیمات اسلایدر بنر اصلی سایت
  if (
    cleanUrl === '/api/admin/settings/hero-slider' ||
    cleanUrl === '/api/public/settings/hero-slider'
  ) {
    if (method === 'GET') {
      return dbState.heroSliderSettings;
    }
    if (method === 'PUT') {
      dbState.heroSliderSettings = {
        ...INITIAL_HERO_SLIDER_SETTINGS,
        ...dbState.heroSliderSettings,
        ...body,
        slides:
          Array.isArray(body.slides) && body.slides.length > 0
            ? body.slides
            : dbState.heroSliderSettings.slides,
      };
      saveLocalDb(dbState);
      return dbState.heroSliderSettings;
    }
  }

  // ۱۹. تنظیمات اصلی وب‌سایت
  if (
    cleanUrl === '/api/admin/settings/main' ||
    cleanUrl === '/api/public/settings/main'
  ) {
    if (method === 'GET') {
      return dbState.mainSettings;
    }
    if (method === 'PUT') {
      dbState.mainSettings = {
        ...INITIAL_MAIN_SETTINGS,
        ...dbState.mainSettings,
        ...body,
      };
      saveLocalDb(dbState);
      return dbState.mainSettings;
    }
  }

  // ۲۰. تنظیمات پنل پیامک
  if (cleanUrl === '/api/admin/settings/sms') {
    if (method === 'GET') {
      return dbState.smsSettings;
    }
    if (method === 'PUT') {
      dbState.smsSettings = {
        ...INITIAL_SMS_SETTINGS,
        ...dbState.smsSettings,
        ...body,
      };
      saveLocalDb(dbState);
      return dbState.smsSettings;
    }
  }

  // ۲۱. تنظیمات سوالات متداول صفحات
  if (cleanUrl === '/api/admin/settings/faq') {
    if (method === 'GET') {
      return dbState.faqSettings;
    }
    if (method === 'PUT') {
      dbState.faqSettings = {
        ...INITIAL_FAQ_SETTINGS,
        ...dbState.faqSettings,
        ...body,
      };
      saveLocalDb(dbState);
      return dbState.faqSettings;
    }
  }

  return {};
}

/**
 * فراخوانی هوشمند API:
 * ۱. ابتدا سرور Express + PostgreSQL را صدا می‌زند.
 * ۲. اگر روی هاست استاتیک/پروداکشن (مانند Vercel) پاسخ غیر JSON (مثلاً index.html یا 404/405/502) برگشت،
 *    به‌صورت خودکار و بدون خطا از موتور دیتابیس محلی پاسخ می‌دهد.
 */
// وضعیت فعلی اتصال به سرور (جهت نمایش در پنل ادمین)
let isCurrentlyUsingFallback = false;

export function isUsingFallbackMode(): boolean {
  return isCurrentlyUsingFallback;
}

export async function apiFetchWithFallback(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    initFirestoreAutoSync();
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (res.ok && isJson) {
      isCurrentlyUsingFallback = false;
      const data = await res.json();
      // همگام‌سازی تنظیمات با کش محلی و کلود در صورت دریافت از سرور
      if (url === '/api/public/catalog' && data) {
        const local = loadLocalDb();
        if (data.footerSettings) local.footerSettings = data.footerSettings;
        if (data.contactUsSettings)
          local.contactUsSettings = data.contactUsSettings;
        if (data.aboutUsSettings) local.aboutUsSettings = data.aboutUsSettings;
        if (data.heroSliderSettings)
          local.heroSliderSettings = data.heroSliderSettings;
        if (data.mainSettings) local.mainSettings = data.mainSettings;
        if (data.smsSettings) local.smsSettings = data.smsSettings;
        if (data.faqSettings) local.faqSettings = data.faqSettings;
        saveLocalDb(local);
      }
      return data;
    }

    // اگر سرور ارور احراز هویت داد (۴۰۱ یا ۴۰۳)
    if (isJson && (res.status === 401 || res.status === 403)) {
      const errJson = await res.json().catch(() => ({}));
      if (url === '/api/admin/login') {
        const body = parseBody(options);
        const normPhone = normalizeAdminPhoneClient(body.phone || '');
        const pass = String(body.password || '').trim();
        if (
          normPhone === DEFAULT_SUPER_ADMIN_PHONE &&
          pass === DEFAULT_SUPER_ADMIN_PASS
        ) {
          isCurrentlyUsingFallback = true;
          return await handleLocalApiRequest(url, options);
        }
      }
      throw new Error(errJson.error || 'شماره موبایل یا رمز عبور اشتباه است.');
    }

    // در هاست‌های استاتیک یا سرورهایی که ۴۰۵ (Method Not Allowed) یا ۴۰۴ یا ۵۰۰ برمی‌گردانند، مستقیماً از موتور دیتابیس کلود فایراستور پاسخ بده
    if (res.status === 405 || res.status === 404 || res.status >= 500 || !res.ok) {
      console.warn(
        `API ${options.method || 'GET'} ${url} returned status ${res.status}. Seamlessly processed via Cloud Firestore database.`
      );
      isCurrentlyUsingFallback = true;
      return await handleLocalApiRequest(url, options);
    }

    throw new Error(`خطای ارتباط (${res.status})`);
  } catch (err: any) {
    // در صورت خطای شبکه یا اجرای استاتیک بدون سرور Node، مستقیماً از Cloud Firestore پاسخ بده
    if (
      err.message?.includes('شماره موبایل') ||
      err.message?.includes('رمز عبور') ||
      err.message?.includes('الزامی')
    ) {
      throw err;
    }
    console.warn(
      `Network/Execution fallback for ${url}: Handled by Cloud Firestore.`
    );
    isCurrentlyUsingFallback = true;
    return await handleLocalApiRequest(url, options);
  }
}
