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

const LOCAL_DB_STORAGE_KEY = 'salehi_cms_fallback_db_v1';

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
}

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
    slug: c.key,
    title: c.title,
    countLabel: c.count,
    image: c.image,
    sortOrder: idx + 1,
  }));

  const seededProjects = EXECUTED_PROJECTS.map((pr, idx) => ({
    id: idx + 1,
    slug: pr.id || `proj-${idx + 1}`,
    categoryTab: pr.categoryTab,
    sampleCode: pr.sampleCode,
    district: pr.district,
    title: pr.title,
    subtitle: pr.subtitle || `${pr.district} | ${pr.locationBadge || 'تهران'}`,
    description: pr.description,
    usedChandeliersText: pr.usedChandeliersText,
    mainImage: pr.mainImage,
    galleryImages: Array.isArray(pr.galleryImages)
      ? pr.galleryImages
      : [pr.mainImage],
    galleryJson: JSON.stringify(
      Array.isArray(pr.galleryImages) ? pr.galleryImages : [pr.mainImage]
    ),
    locationBadge: pr.locationBadge || 'تهران، الهیه',
    dateBadge: pr.dateBadge || '۲۵ شهریور ماه ۱۴۰۴',
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
    readTime: ar.readTime || '۵ دقیقه مطالعه',
    category: ar.category || 'راهنمای دکوراسیون سلطنتی',
    image: ar.image,
    featured: Boolean(ar.featured),
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
          Array.isArray(parsed.products) && parsed.products.length > 0
            ? parsed.products
            : initial.products,
        categories:
          Array.isArray(parsed.categories) && parsed.categories.length > 0
            ? parsed.categories
            : initial.categories,
        projects:
          Array.isArray(parsed.projects) && parsed.projects.length > 0
            ? parsed.projects
            : initial.projects,
        stories:
          Array.isArray(parsed.stories) && parsed.stories.length > 0
            ? parsed.stories
            : initial.stories,
        articles:
          Array.isArray(parsed.articles) && parsed.articles.length > 0
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
      };
    }
  } catch {
    // ignore storage errors
  }
  const fresh = createInitialLocalDb();
  saveLocalDb(fresh);
  return fresh;
}

function saveLocalDb(dbState: LocalDbSchema) {
  try {
    localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(dbState));
  } catch {
    // ignore quota errors
  }
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
      };
      dbState.projects.unshift(created);
      saveLocalDb(dbState);
      return created;
    }
  }
  if (cleanUrl.startsWith('/api/admin/projects/')) {
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PUT') {
      const idx = dbState.projects.findIndex((p) => Number(p.id) === id);
      if (idx !== -1) {
        dbState.projects[idx] = { ...dbState.projects[idx], ...body, id };
        saveLocalDb(dbState);
        return dbState.projects[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.projects = dbState.projects.filter((p) => Number(p.id) !== id);
      saveLocalDb(dbState);
      return { success: true, id };
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
    const id = Number(cleanUrl.split('/').pop());
    if (method === 'PUT') {
      const idx = dbState.stories.findIndex((s) => Number(s.id) === id);
      if (idx !== -1) {
        dbState.stories[idx] = {
          ...dbState.stories[idx],
          ...body,
          id,
          slidesJson: Array.isArray(body.slides)
            ? JSON.stringify(body.slides)
            : body.slidesJson || dbState.stories[idx].slidesJson,
        };
        saveLocalDb(dbState);
        return dbState.stories[idx];
      }
    }
    if (method === 'DELETE') {
      dbState.stories = dbState.stories.filter((s) => Number(s.id) !== id);
      saveLocalDb(dbState);
      return { success: true, id };
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

  return {};
}

/**
 * فراخوانی هوشمند API:
 * ۱. ابتدا سرور Express + PostgreSQL را صدا می‌زند.
 * ۲. اگر روی هاست استاتیک/پروداکشن (مانند Vercel) پاسخ غیر JSON (مثلاً index.html یا 404/405/502) برگشت،
 *    به‌صورت خودکار و بدون خطا از موتور دیتابیس محلی پاسخ می‌دهد.
 */
export async function apiFetchWithFallback(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (res.ok && isJson) {
      const data = await res.json();
      // همگام‌سازی تنظیمات با کش محلی در صورت دریافت از سرور
      if (url === '/api/public/catalog' && data) {
        const local = loadLocalDb();
        if (data.footerSettings) local.footerSettings = data.footerSettings;
        if (data.contactUsSettings)
          local.contactUsSettings = data.contactUsSettings;
        saveLocalDb(local);
      }
      return data;
    }

    // اگر پاسخ سرور JSON واقعی خطای احراز هویت بود ولی مربوط به اکانت پیش‌فرض نبود
    if (isJson && res.status >= 400 && res.status < 500 && res.status !== 404 && res.status !== 405) {
      const errJson = await res.json().catch(() => ({}));
      // اگر در صفحه ورود، کاربر شماره و رمز پیش‌فرض ساشا را وارد کرده باشد، همیشه اجازه ورود بده
      if (url === '/api/admin/login') {
        const body = parseBody(options);
        const normPhone = normalizeAdminPhoneClient(body.phone || '');
        const pass = String(body.password || '').trim();
        if (
          normPhone === DEFAULT_SUPER_ADMIN_PHONE &&
          pass === DEFAULT_SUPER_ADMIN_PASS
        ) {
          return handleLocalApiRequest(url, options);
        }
      }
      // اگر توکن محلی (adm....local) بود، از موتور محلی پاسخ بده
      const authHeader =
        options.headers instanceof Headers
          ? options.headers.get('Authorization')
          : (options.headers as any)?.Authorization;
      if (authHeader && String(authHeader).endsWith('.local')) {
        return handleLocalApiRequest(url, options);
      }
      throw new Error(errJson.error || `خطای درخواست (${res.status})`);
    }

    // در صورت برگشت HTML (ری‌رایت Vercel) یا 404 / 405 / 500 از موتور محلی استفاده کن
    return await handleLocalApiRequest(url, options);
  } catch (err: any) {
    if (
      err?.message === 'شماره موبایل یا رمز عبور اشتباه است.' ||
      err?.message === 'شماره موبایل و رمز عبور الزامی است.' ||
      err?.message?.includes('تنها ادمین')
    ) {
      throw err;
    }
    return await handleLocalApiRequest(url, options);
  }
}
