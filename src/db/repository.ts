import { asc, desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { ensureDefaultAdmin } from './users.ts';
import {
  articles,
  categories,
  contactMessages,
  orders,
  products,
  projects,
  siteSettings,
  stories,
  users,
} from './schema.ts';

let seedPromise: Promise<void> | null = null;

export const ASSET_PATHS = {
  heroBanner: '/src/assets/images/hero_chandelier_banner_1790646227735.jpg',
  shahMalakeh: '/src/assets/images/chandelier_shah_malakeh_1790646240589.jpg',
  shakheh12: '/src/assets/images/chandelier_12_shakheh_1790646251083.jpg',
  ristani: '/src/assets/images/chandelier_ristani_1790646262438.jpg',
  resansRoses: '/src/assets/images/chandelier_resans_roses_1790647324596.jpg',
  crystaliCherub:
    '/src/assets/images/chandelier_crystali_cherub_1790647334691.jpg',
  crystaliGold: '/src/assets/images/chandelier_crystali_1790646272446.jpg',
  projectFereshteh:
    '/src/assets/images/project_fereshteh_interior_1790646283141.jpg',
  projectLobbyHotel:
    '/src/assets/images/project_lobby_hotel_1790681398126.jpg',
  projectMosqueDome:
    '/src/assets/images/project_mosque_dome_1790681415301.jpg',
  projectRoyalRestaurant:
    '/src/assets/images/project_royal_restaurant_1790681438681.jpg',
  projectDuplexVilla:
    '/src/assets/images/project_duplex_villa_1790681451000.jpg',
  storyPortraitRustic:
    '/src/assets/images/story_portrait_rustic_1790682028851.jpg',
  storyPortraitAtrium:
    '/src/assets/images/story_portrait_atrium_1790682040988.jpg',
  storyPortraitPalace:
    '/src/assets/images/story_portrait_palace_1790682052291.jpg',
  aboutShowroom:
    '/src/assets/images/about_gallery_showroom_1790844789780.jpg',
  aboutEmeraldPalace:
    '/src/assets/images/about_gallery_emerald_palace_1790844830735.jpg',
  aboutGrandAtelier:
    '/src/assets/images/about_gallery_grand_atelier_1790845407976.jpg',
  aboutModernVilla:
    '/src/assets/images/about_gallery_modern_villa_1790844817623.jpg',
  aboutRoyalStaircase:
    '/src/assets/images/about_gallery_royal_staircase_1790845421517.jpg',
};

const INITIAL_CATEGORIES_SEED = [
  {
    slug: 'chandeliers',
    title: 'کلکسیون لوستر ها',
    filterKey: 'all',
    sortOrder: 1,
  },
  {
    slug: 'single-branch',
    title: 'کلکسیون تک شاخه ها',
    filterKey: 'single',
    sortOrder: 2,
  },
  {
    slug: 'mirror-console',
    title: 'کلکسیون آینه و کنسول',
    filterKey: 'mirror',
    sortOrder: 3,
  },
  {
    slug: 'abalour',
    title: 'کلکسیون آباژور',
    filterKey: 'abalour',
    sortOrder: 4,
  },
  {
    slug: 'shamdooni',
    title: 'کلکسیون شمعدانی',
    filterKey: 'shamdooni',
    sortOrder: 5,
  },
  {
    slug: 'table',
    title: 'کلکسیون میز',
    filterKey: 'table',
    sortOrder: 6,
  },
  {
    slug: 'kenar-saloni',
    title: 'کلکسیون کنار سالنی',
    filterKey: 'kenar-saloni',
    sortOrder: 7,
  },
];

const INITIAL_PRODUCTS_SEED = [
  // ۱ تا ۸: محصولات اصلی کلکسیون صالحی و پرفروش‌ترین‌ها (در صفحه اصلی و صفحه محصولات)
  {
    productKey: 'prod-crystali',
    name: 'لوستر کریستالی',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۶,۴۰۰,۰۰۰ تومان',
    priceNumeric: 16400000,
    productCode: '۱۲۸۹۸۲',
    image: ASSET_PATHS.crystaliCherub,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: 'قطر ۸۵ سانتی‌متر × ارتفاع ۹۵ سانتی‌متر',
    branchesCount: '۱۲ شاخه (قابل سفارش از ۶ تا ۲۴ شاخه)',
    bodyMaterial:
      'برنز خالص ریخته‌گری با آبکاری طلای ۲۴ عیار و کریستال شامپاینی',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ و اصالت برنز',
    description:
      'لوستر کریستالی کلکسیون صالحی با ترکیب بی‌نظیر شاخه‌های برنزی آبکاری طلا و مجسمه فرشته کلاسیک، جلوه‌ای درخشان و اشرافی به فضای پذیرایی و اتاق خواب کلاسیک می‌بخشد.',
  },
  {
    productKey: 'prod-resans',
    name: 'لوستر رسانس',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۱,۸۰۰,۰۰۰ تومان',
    priceNumeric: 11800000,
    productCode: '۱۲۸۹۸۵',
    image: ASSET_PATHS.resansRoses,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: 'قطر ۸۰ سانتی‌متر × ارتفاع ۱۰۰ سانتی‌متر',
    branchesCount: '۱۰ شاخه دو طبقه (قابل سفارشی‌سازی)',
    bodyMaterial:
      'برنز آنتیک قلم‌زنی شده با گل‌های چینی سفید و منشورهای کریستال',
    warranty: '۱۰ سال ضمانت کتبی گالری لوستر اکبر صالحی',
    description:
      'لوستر رسانس با طراحی کلاسیک، گل‌های سفید ظریف و انحنای چشم‌نواز شاخه‌ها، یکی از محبوب‌ترین انتخاب‌ها برای سالن‌های پذیرایی با چیدمان کلاسیک و نئوکلاسیک است.',
  },
  {
    productKey: 'prod-12-shakheh',
    name: 'لوستر ۱۲ شاخه تک',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۴,۲۰۰,۰۰۰ تومان',
    priceNumeric: 14200000,
    productCode: '۱۲۸۹۸۸',
    image: ASSET_PATHS.shakheh12,
    modelType: '12-shakheh',
    defaultFinish: 'antique-bronze',
    categorySlug: 'chandeliers',
    outOfStock: true,
    hasSnappPay: false,
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: 'قطر ۹۰ سانتی‌متر × ارتفاع ۸۵ سانتی‌متر',
    branchesCount: '۱۲ شاخه تک طبقه اصیل',
    bodyMaterial: 'برنز سنگین قالب‌گیری سنتی با آبکاری آنتیک',
    warranty: '۱۰ سال ضمانت کتبی ثبات آبکاری',
    description:
      'لوستر ۱۲ شاخه تک با شاخه‌های پرکار برنزی و سرپیچ‌های شمعی کلاسیک، نورپردازی یکنواخت، گرم و باشکوهی را برای فضاهای نشیمن و بالای میز ناهارخوری فراهم می‌سازد.',
  },
  {
    productKey: 'prod-shah-malakeh',
    name: 'لوستر شاه ملکه',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۹,۵۰۰,۰۰۰ تومان',
    priceNumeric: 19500000,
    productCode: '۱۲۸۹۹۱',
    image: ASSET_PATHS.shahMalakeh,
    modelType: 'shah-malakeh',
    defaultFinish: 'dark-patina',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: 'قطر ۱۱۰ سانتی‌متر × ارتفاع ۱۴۰ سانتی‌متر',
    branchesCount: '۱۸ شاخه سه طبقه شاهانه با شید مشکی و کرم',
    bodyMaterial:
      'برنز سیاه‌قلم و طلایی همراه با شید پارچه‌ای و ریسه کریستال',
    warranty: '۱۵ سال ضمانت ویژه کلکسیون شاه ملکه',
    description:
      'لوستر طبقاتی شاه ملکه، شاهکار کلکسیون اکبر صالحی با ۳ طبقه شاخه مجلل، شیدهای دست‌دوز و صدها آویز کریستالی برای سقف‌های بلند، دوبلکس و تالارهای مجلل.',
  },
  {
    productKey: 'prod-ristani-gold',
    name: 'لوستر ریستانی طلایی',
    subtitle: 'مناسب کلاسیک پذیرایی | ناهارخوری',
    priceFormatted: '۱۵,۳۰۰,۰۰۰ تومان',
    priceNumeric: 15300000,
    productCode: '۱۲۸۹۹۳',
    image: ASSET_PATHS.ristani,
    modelType: 'ristani',
    defaultFinish: 'gold-24k',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: false,
    dimensions: 'قطر ۸۵ سانتی‌متر × ارتفاع ۹۰ سانتی‌متر',
    branchesCount: '۱۰ شاخه برنزی',
    bodyMaterial: 'برنز خالص ریخته‌گری با آبکاری طلا',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ',
    description:
      'لوستر ریستانی طلایی با تراش‌های ظریف و آبکاری طلای ۲۴ عیار مناسب سالن‌های پذیرایی و ناهارخوری کلاسیک.',
  },
  {
    productKey: 'prod-rose-tala',
    name: 'لوستر رز طلا سلطنتی',
    subtitle: 'مناسب تالار پذیرایی | سقف بلند',
    priceFormatted: '۱۸,۲۰۰,۰۰۰ تومان',
    priceNumeric: 18200000,
    productCode: '۱۲۸۹۹۴',
    image: ASSET_PATHS.crystaliGold,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: 'قطر ۹۵ سانتی‌متر × ارتفاع ۱۱۰ سانتی‌متر',
    branchesCount: '۱۶ شاخه سلطنتی',
    bodyMaterial: 'برنز خالص با کریستال شامپاینی اتریشی',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'لوستر رز طلا سلطنتی ۱۶ شاخه با منشورهای کریستال شامپاینی و بدنه تمام‌برنز.',
  },
  {
    productKey: 'prod-crystali-fereshteh',
    name: 'لوستر کریستالی فرشته‌دار',
    subtitle: 'مناسب نشیمن لوکس | لابی مجلل',
    priceFormatted: '۱۷,۶۰۰,۰۰۰ تومان',
    priceNumeric: 17600000,
    productCode: '۱۲۸۹۹۵',
    image: ASSET_PATHS.crystaliCherub,
    modelType: 'crystali',
    defaultFinish: 'champagne',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: false,
    dimensions: 'قطر ۹۰ سانتی‌متر × ارتفاع ۱۰۰ سانتی‌متر',
    branchesCount: '۱۲ شاخه فرشته‌دار',
    bodyMaterial: 'برنز ریخته‌گری شده با آبکاری شامپاینی',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ',
    description:
      'لوستر کریستالی طرح فرشته با مجسمه برنزی دست‌ساز و کریستال‌های درجه یک.',
  },
  {
    productKey: 'prod-resans-golchini',
    name: 'لوستر رسانس گل چینی',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۳,۹۰۰,۰۰۰ تومان',
    priceNumeric: 13900000,
    productCode: '۱۲۸۹۹۶',
    image: ASSET_PATHS.resansRoses,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: 'قطر ۸۰ سانتی‌متر × ارتفاع ۹۵ سانتی‌متر',
    branchesCount: '۱۰ شاخه گل‌دار',
    bodyMaterial: 'برنز آنتیک با گل‌های سرامیکی دست‌ساز',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'لوستر رسانس گل‌چینی مناسب چیدمان‌های کلاسیک، نئوکلاسیک و جهیزیه عروس.',
  },
  {
    productKey: 'prod-versai-tiered',
    name: 'لوستر طبقاتی ورسای',
    subtitle: 'مناسب دوبلکس | سقف‌های بلند',
    priceFormatted: '۲۱,۴۰۰,۰۰۰ تومان',
    priceNumeric: 21400000,
    productCode: '۱۲۹۱۰۳',
    image: ASSET_PATHS.shahMalakeh,
    modelType: 'shah-malakeh',
    defaultFinish: 'dark-patina',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: true,
    dimensions: 'قطر ۱۱۵ سانتی‌متر × ارتفاع ۱۴۵ سانتی‌متر',
    branchesCount: '۲۴ شاخه سه طبقه',
    bodyMaterial: 'برنز سیاه‌قلم سنگین با شید سلطنتی',
    warranty: '۱۵ سال ضمانت کتبی کلکسیون شاه ملکه',
    description:
      'لوستر طبقاتی ورسای ۲۴ شاخه ویژه سقف‌های بلند، وید دوبلکس و تالارهای پذیرایی.',
  },
  {
    productKey: 'prod-12-shakheh-classic',
    name: 'لوستر ۱۲ شاخه برنزی',
    subtitle: 'مناسب ناهارخوری | پذیرایی کلاسیک',
    priceFormatted: '۱۵,۷۰۰,۰۰۰ تومان',
    priceNumeric: 15700000,
    productCode: '۱۲۹۱۰۴',
    image: ASSET_PATHS.shakheh12,
    modelType: '12-shakheh',
    defaultFinish: 'antique-bronze',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: true,
    dimensions: 'قطر ۹۰ سانتی‌متر × ارتفاع ۸۸ سانتی‌متر',
    branchesCount: '۱۲ شاخه دوبل برنزی',
    bodyMaterial: 'برنز خالص ریخته‌گری سنتی',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ',
    description:
      'لوستر ۱۲ شاخه برنزی با طراحی اصیل ایرانی و پخش نور گرم و یکنواخت.',
  },

  // محصولات دسته‌بندی تک شاخه ها (single-branch)
  {
    productKey: 'prod-single-classic',
    name: 'آویز تک شاخه برنزی کلاسیک',
    subtitle: 'مناسب آشپزخانه | راهرو و ورودی',
    priceFormatted: '۳,۸۵۰,۰۰۰ تومان',
    priceNumeric: 3850000,
    productCode: '۱۳۸۱۰۱',
    image: ASSET_PATHS.shakheh12,
    modelType: '12-shakheh',
    defaultFinish: 'antique-bronze',
    categorySlug: 'single-branch',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'قطر ۳۲ سانتی‌متر × ارتفاع ۶۵ سانتی‌متر',
    branchesCount: 'تک شاخه آویز',
    bodyMaterial: 'برنز خالص ریخته‌گری با حباب تراش‌خورده',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'آویز تک شاخه برنزی کلاسیک مناسب بالای جزیره آشپزخانه، راهرو و ورودی منزل.',
  },
  {
    productKey: 'prod-single-fereshteh',
    name: 'لوستر تک شاخه طرح فرشته طلایی',
    subtitle: 'مناسب اتاق خواب | بالای جزیره',
    priceFormatted: '۴,۴۰۰,۰۰۰ تومان',
    priceNumeric: 4400000,
    productCode: '۱۳۸۱۰۲',
    image: ASSET_PATHS.crystaliCherub,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    categorySlug: 'single-branch',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'قطر ۳۵ سانتی‌متر × ارتفاع ۷۰ سانتی‌متر',
    branchesCount: 'تک شاخه کریستالی',
    bodyMaterial: 'برنز آبکاری طلای ۲۴ عیار با منشور کریستال',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ',
    description:
      'لوستر تک شاخه طرح فرشته طلایی با درخشش کریستال‌های شامپاینی مناسب اتاق خواب و راهرو.',
  },
  {
    productKey: 'prod-single-resans',
    name: 'آویز تک شاخه رسانس گل سفید',
    subtitle: 'مناسب اتاق خواب عروس | راهرو',
    priceFormatted: '۴,۱۰۰,۰۰۰ تومان',
    priceNumeric: 4100000,
    productCode: '۱۳۸۱۰۳',
    image: ASSET_PATHS.resansRoses,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
    categorySlug: 'single-branch',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'قطر ۳۴ سانتی‌متر × ارتفاع ۶۸ سانتی‌متر',
    branchesCount: 'تک شاخه گل‌دار',
    bodyMaterial: 'برنز آنتیک و گل چینی سفید',
    warranty: '۱۰ سال ضمانت کتبی گالری صالحی',
    description:
      'آویز تک شاخه رسانس گل سفید ست کامل لوسترهای کلکسیون رسانس.',
  },

  // محصولات دسته‌بندی آباژور (abalour)
  {
    productKey: 'prod-abalour-7mileh',
    name: 'آباژور کریستالی ۷ میله ای ایتالیایی',
    subtitle: 'مناسب کنار مبلمان | اتاق خواب مستر',
    priceFormatted: '۸,۵۰۰,۰۰۰ تومان',
    priceNumeric: 8500000,
    productCode: '۱۴۲۱۰۱',
    image: ASSET_PATHS.crystaliGold,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    categorySlug: 'abalour',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'قطر ۴۵ سانتی‌متر × ارتفاع ۱۶۵ سانتی‌متر',
    branchesCount: '۳ سرپیچ استاندارد داخل شید',
    bodyMaterial: 'برنز آبکاری طلا و ستون کریستال شامپاینی',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ',
    description:
      'آباژور ایستاده کنار سالنی ۷ میله‌ای ایتالیایی با شید دست‌دوز و بدنه برنز و کریستال.',
  },
  {
    productKey: 'prod-abalour-shahmalakeh',
    name: 'آباژور ایستاده شاه ملکه شید مشکی',
    subtitle: 'مناسب سالن پذیرایی کلاسیک | لابی',
    priceFormatted: '۹,۸۰۰,۰۰۰ تومان',
    priceNumeric: 9800000,
    productCode: '۱۴۲۱۰۲',
    image: ASSET_PATHS.shahMalakeh,
    modelType: 'shah-malakeh',
    defaultFinish: 'dark-patina',
    categorySlug: 'abalour',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'قطر ۵۰ سانتی‌متر × ارتفاع ۱۷۰ سانتی‌متر',
    branchesCount: '۳ شعله شیددار',
    bodyMaterial: 'برنز سیاه‌قلم با شید مخمل مشکی و طلایی',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'آباژور ایستاده شاه ملکه ست مکمل لوسترهای طبقاتی شاه ملکه برای کنار مبلمان استیل.',
  },
  {
    productKey: 'prod-abalour-table-resans',
    name: 'آباژور رومیزی رسانس گل‌دار',
    subtitle: 'مناسب پاتختی | روی میز کنسول',
    priceFormatted: '۴,۹۰۰,۰۰۰ تومان',
    priceNumeric: 4900000,
    productCode: '۱۴۲۱۰۳',
    image: ASSET_PATHS.resansRoses,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
    categorySlug: 'abalour',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'قطر ۳۵ سانتی‌متر × ارتفاع ۶۲ سانتی‌متر',
    branchesCount: '۱ شعله رومیزی',
    bodyMaterial: 'برنز آنتیک با گل‌های چینی دست‌ساز',
    warranty: '۱۰ سال ضمانت کتبی گالری صالحی',
    description:
      'آباژور رومیزی رسانس گل‌دار مناسب روی میز پاتختی اتاق خواب و روی کنسول پذیرایی.',
  },

  // محصولات دسته‌بندی آینه و کنسول (mirror-console)
  {
    productKey: 'prod-mirror-briali',
    name: 'آینه و کنسول بریالیژی برنزی',
    subtitle: 'ست کامل ورودی | سالن پذیرایی لوکس',
    priceFormatted: '۲۴,۵۰۰,۰۰۰ تومان',
    priceNumeric: 24500000,
    productCode: '۱۴۹۳۰۱',
    image: ASSET_PATHS.ristani,
    modelType: 'ristani',
    defaultFinish: 'gold-24k',
    categorySlug: 'mirror-console',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'عرض ۱۲۵ سانتی‌متر × ارتفاع ۱۹۵ سانتی‌متر',
    branchesCount: 'به همراه جفت شمعدان ست',
    bodyMaterial: 'برنز خالص ریخته‌گری سنگین و سنگ مرمر طبیعی',
    warranty: '۱۵ سال ضمانت کتبی اصالت برنز',
    description:
      'ست کامل آینه و کنسول بریالیژی تمام‌برنز با صفحه سنگ مرمر طبیعی و قلم‌زنی استادانه.',
  },
  {
    productKey: 'prod-mirror-console-emerald',
    name: 'کنسول دو کشو برنز و مرمر سبز',
    subtitle: 'مناسب سالن پذیرایی | نشیمن کلاسیک',
    priceFormatted: '۲۳,۲۰۰,۰۰۰ تومان',
    priceNumeric: 23200000,
    productCode: '۱۴۹۳۰۷',
    image: ASSET_PATHS.crystaliGold,
    modelType: 'crystali',
    defaultFinish: 'dark-patina',
    categorySlug: 'mirror-console',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'عرض ۱۲۰ سانتی‌متر × ارتفاع ۱۹۰ سانتی‌متر',
    branchesCount: 'دارای آینه پرکار اسلیمی',
    bodyMaterial: 'برنز سیاه‌قلم و مرمر سبز سلطنتی',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'کنسول دو کشو برنز و مرمر سبز با طراحی کلاسیک اشرافی.',
  },

  // محصولات دسته‌بندی شمعدانی (shamdooni)
  {
    productKey: 'prod-shamdooni-laleh',
    name: 'جفت شمعدان لاله عباسی برنزی',
    subtitle: 'مناسب روی کنسول | سفره عقد و پذیرایی',
    priceFormatted: '۵,۶۰۰,۰۰۰ تومان',
    priceNumeric: 5600000,
    productCode: '۱۵۸۱۰۱',
    image: ASSET_PATHS.resansRoses,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
    categorySlug: 'shamdooni',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'ارتفاع ۵۸ سانتی‌متر',
    branchesCount: 'جفت شمعدان لاله‌دار',
    bodyMaterial: 'برنز خالص با لاله تراش دست‌ساز و آویز کریستال',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ',
    description:
      'جفت شمعدان لاله عباسی برنزی مناسب روی میز کنسول، شومینه و چیدمان کلاسیک.',
  },
  {
    productKey: 'prod-shamdooni-fereshteh',
    name: 'شمعدان ۵ شاخه طرح فرشته طلایی',
    subtitle: 'مناسب میز ناهارخوری | روی کنسول',
    priceFormatted: '۶,۹۰۰,۰۰۰ تومان',
    priceNumeric: 6900000,
    productCode: '۱۵۸۱۰۲',
    image: ASSET_PATHS.crystaliCherub,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    categorySlug: 'shamdooni',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'ارتفاع ۶۴ سانتی‌متر × عرض ۳۸ سانتی‌متر',
    branchesCount: '۵ شاخه شمع‌خور و لامپ‌خور',
    bodyMaterial: 'برنز آبکاری طلای ۲۴ عیار',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'شمعدان ۵ شاخه طرح فرشته طلایی با پایه تمام برنز سنگین و منشورهای کریستالی.',
  },

  // محصولات دسته‌بندی میز (table)
  {
    productKey: 'prod-table-marble-royal',
    name: 'میز جلو مبلی برنزی سلطنتی مرمر',
    subtitle: 'صفحه سنگ مرمر طبیعی | پایه برنز خالص',
    priceFormatted: '۱۴,۵۰۰,۰۰۰ تومان',
    priceNumeric: 14500000,
    productCode: '۱۶۷۲۰۱',
    image: ASSET_PATHS.shahMalakeh,
    modelType: 'shah-malakeh',
    defaultFinish: 'gold-24k',
    categorySlug: 'table',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'طول ۱۱۰ × عرض ۷۰ × ارتفاع ۴۸ سانتی‌متر',
    branchesCount: 'پایه ۴ ستون برنزی',
    bodyMaterial: 'برنز خالص ریخته‌گری و سنگ مرمر سفید رگه‌دار',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'میز جلو مبلی برنزی سلطنتی با صفحه سنگ مرمر طبیعی و رکاب‌های برنزی قلم‌زنی شده.',
  },
  {
    productKey: 'prod-table-asali-3pcs',
    name: 'ست ۳ تکه میز عسلی برنزی کلاسیک',
    subtitle: 'مناسب مبلمان استیل و کلاسیک پذیرایی',
    priceFormatted: '۱۱,۲۰۰,۰۰۰ تومان',
    priceNumeric: 11200000,
    productCode: '۱۶۷۲۰۲',
    image: ASSET_PATHS.ristani,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
    categorySlug: 'table',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: false,
    isBestSeller: false,
    dimensions: 'قطر ۴۵ سانتی‌متر × ارتفاع ۵۲ سانتی‌متر',
    branchesCount: 'ست ۳ عددی میز عسلی',
    bodyMaterial: 'برنز آنتیک و سنگ مرمر کرم',
    warranty: '۱۰ سال ضمانت کتبی اصالت برنز',
    description:
      'ست ۳ تکه میز عسلی برنزی کلاسیک با پایه‌های اسلیمی و صفحه سنگ مرمر.',
  },
];

const DEFAULT_PROJECT_DESCRIPTION =
  'در طراحی روشنایی و نورپردازی این مجموعه فاخر، از لوسترهای برنزی کلکسیون اکبر صالحی با آبکاری طلای ۲۴ عیار و کریستال‌های شامپاینی استفاده شده است. انتخاب تمامی محصولات روشنایی از یک خانواده واحد، انسجام بصری و شکوه معماری کلاسیک فضا را دوچندان ساخته است.';

const INITIAL_PROJECTS_SEED = [
  // ۱. ارگان‌های دولتی (gov) - ۹ پروژه کامل مطابق صفحه /project و صفحه اصلی
  {
    slug: 'kiani-shomali',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۱',
    district: 'منطقه کیانی شمالی',
    title: 'پروژه منطقه کیانی شمالی',
    subtitle: 'منازل مسکونی و تشریفاتی | اهواز، خوزستان',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'ترکیب لوسترهای ۱۲ شاخه دوبل در مرکز سالن به همراه دیوارکوب‌های هم‌خانواده در ستون‌های جانبی، هارمونی بی‌نظیری ایجاد کرده است.',
    mainImage: ASSET_PATHS.projectRoyalRestaurant,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectDuplexVilla,
    ]),
    locationBadge: 'اهواز، خوزستان',
    dateBadge: '۲۵ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'elahiyeh',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۲',
    district: 'منطقه الهیه',
    title: 'پروژه منطقه الهیه',
    subtitle: 'تالار تشریفات و همایش | تهران، شمیرانات',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'در این پروژه از لوسترهای پرشاخه با شیدهای دست‌دوز و کریستال‌های منشوری ضد خیرگی چشم استفاده شده است.',
    mainImage: ASSET_PATHS.projectLobbyHotel,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.heroBanner,
    ]),
    locationBadge: 'تهران، شمیرانات',
    dateBadge: '۲۵ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'zafaraniyeh',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۳',
    district: 'منطقه زعفرانیه',
    title: 'پروژه منطقه زعفرانیه',
    subtitle: 'ساختمان دیپلماتیک و تشریفات | تهران، تهران',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'معمولا برای فضاهای نشیمن لوسترهای گرد و بالای میزهای پذیرایی دیزاین کشیده و لاینر استفاده می‌شود.',
    mainImage: ASSET_PATHS.projectDuplexVilla,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.heroBanner,
    ]),
    locationBadge: 'تهران، تهران',
    dateBadge: '۲۵ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'emami-zar',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۴',
    district: 'منطقه امامی زار',
    title: 'پروژه منطقه امامی زار',
    subtitle: 'مجموعه اداری و تشریفاتی | تهران، پردیس',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'استفاده همزمان از لوسترهای سقفی کلکسیون صالحی و آباژورهای ست کنار سالنی، تقارن نوری کاملی در این مجموعه ایجاد کرده است.',
    mainImage: ASSET_PATHS.aboutRoyalStaircase,
    galleryJson: JSON.stringify([
      ASSET_PATHS.aboutRoyalStaircase,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectLobbyHotel,
    ]),
    locationBadge: 'تهران، پردیس',
    dateBadge: '۲۵ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'heydar-khani',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۵',
    district: 'منطقه حیدر خانی',
    title: 'پروژه منطقه حیدر خانی',
    subtitle: 'مجموعه تشریفاتی | خراسان رضوی، مشهد',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'لوسترهای طبقاتی شاه ملکه به همراه دیوارکوب‌های برنزی ست.',
    mainImage: ASSET_PATHS.storyPortraitAtrium,
    galleryJson: JSON.stringify([
      ASSET_PATHS.storyPortraitAtrium,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectDuplexVilla,
    ]),
    locationBadge: 'خراسان رضوی، مشهد',
    dateBadge: '۱۸ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'sahel-behesht',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۶',
    district: 'منطقه ساحل بهشت',
    title: 'پروژه منطقه ساحل بهشت',
    subtitle: 'تالار همایش ساحلی | بندرعباس، قشم',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'لوسترهای تمام برنز با پوشش محافظ ضد رطوبت مخصوص مناطق ساحلی.',
    mainImage: ASSET_PATHS.aboutShowroom,
    galleryJson: JSON.stringify([
      ASSET_PATHS.aboutShowroom,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
    ]),
    locationBadge: 'بندرعباس، قشم',
    dateBadge: '۱۲ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'jannat-abad',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۷',
    district: 'منطقه جنت آباد',
    title: 'پروژه منطقه جنت آباد',
    subtitle: 'مجموعه فرهنگی و تشریفاتی | تهران، تهران',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'لوسترهای ۱۲ شاخه و ۱۶ شاخه کلکسیون صالحی.',
    mainImage: ASSET_PATHS.aboutModernVilla,
    galleryJson: JSON.stringify([
      ASSET_PATHS.aboutModernVilla,
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectLobbyHotel,
    ]),
    locationBadge: 'تهران، تهران',
    dateBadge: '۰۵ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'fereshteh',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۸',
    district: 'منطقه فرشته',
    title: 'پروژه منطقه فرشته',
    subtitle: 'عمارت دیپلماتیک فرشته | تهران، تهران',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'ست کامل لوستر کریستالی فرشته‌دار و آباژورهای کنار سالنی.',
    mainImage: ASSET_PATHS.projectFereshteh,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectDuplexVilla,
    ]),
    locationBadge: 'تهران، تهران',
    dateBadge: '۰۱ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'masoumian',
    categoryTab: 'gov',
    sampleCode: 'نمونه ۹',
    district: 'منطقه معصومیان',
    title: 'پروژه منطقه معصومیان',
    subtitle: 'تالار پذیرایی و همایش | شیراز، شیراز',
    description: DEFAULT_PROJECT_DESCRIPTION,
    usedChandeliersText:
      'لوسترهای طبقاتی برنز خالص ریخته‌گری با کریستال شامپاینی.',
    mainImage: ASSET_PATHS.aboutGrandAtelier,
    galleryJson: JSON.stringify([
      ASSET_PATHS.aboutGrandAtelier,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectRoyalRestaurant,
    ]),
    locationBadge: 'شیراز، شیراز',
    dateBadge: '۲۸ مرداد ماه ۱۴۰۴',
  },

  // ۲. ارگان‌های تجاری (commercial)
  {
    slug: 'royal-mall-elahiyeh',
    categoryTab: 'commercial',
    sampleCode: 'نمونه ۱',
    district: 'برج تجاری الهیه',
    title: 'پروژه رویال مال الهیه',
    subtitle: 'لابی ورودی برج تجاری با سقف مرتفع ۶.۵ متری',
    description:
      'لابی ورودی برج تجاری الهیه با ارتفاع سقف ۶.۵ متر نیازمند لوستری شاخص و خیره‌کننده بود که در بدو ورود نگاه مراجعین را مجذوب خود سازد. لوستر سه طبقه شاه ملکه با آبکاری سیاه‌قلم و طلایی برای این فضا اختصاصی‌سازی شد.',
    usedChandeliersText:
      'در کنار لوستر مرکزی لابی، ۶ عدد دیوارکوب برنزی و ۲ آباژور ایستاده در بخش انتظار VIP نصب گردیده است.',
    mainImage: ASSET_PATHS.projectLobbyHotel,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.heroBanner,
      ASSET_PATHS.projectFereshteh,
    ]),
    locationBadge: 'تهران، الهیه',
    dateBadge: '۲۰ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'espinas-hotel',
    categoryTab: 'commercial',
    sampleCode: 'نمونه ۲',
    district: 'هتل رویال سعادت‌آباد',
    title: 'پروژه هتل ۵ ستاره اسپیناس',
    subtitle: 'نورپردازی لابی و سالن پذیرش هتل ۵ ستاره',
    description:
      'پروژه روشنایی لابی و سالن پذیرش هتل پنج‌ستاره با استفاده از لوسترهای ۱۲ شاخه و ۱۶ شاخه ریخته‌گری برنز خالص اجرا شده و دارای ۱۰ سال ضمانت کتبی ثبات رنگ است.',
    usedChandeliersText:
      'تمامی سرپیچ‌ها و سیم‌کشی‌های داخلی این پروژه از قطعات نسوز استاندارد هتلی برای روشن ماندن ۲۴ ساعته انتخاب شده‌اند.',
    mainImage: ASSET_PATHS.projectRoyalRestaurant,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.heroBanner,
    ]),
    locationBadge: 'تهران، سعادت‌آباد',
    dateBadge: '۱۵ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'palladium-mall',
    categoryTab: 'commercial',
    sampleCode: 'نمونه ۳',
    district: 'مرکز خرید زعفرانیه',
    title: 'پروژه مرکز خرید پالادیوم',
    subtitle: 'گالری جواهرات و مرکز تجاری زعفرانیه',
    description:
      'در گالری‌های لوکس و مراکز تجاری زعفرانیه، شاخص نمود رنگ و درخشش منشورهای کریستال اهمیت دوچندانی دارد. لوسترهای کریستالی شامپاینی صالحی بازتاب نوری الماس‌گونه در فضای گالری ایجاد کرده‌اند.',
    usedChandeliersText:
      'چیدمان خطی سه دستگاه لوستر کریستالی بالای ویترین‌های مرکزی، جلوه جواهرات و دکوراسیون داخلی را دوچندان نموده است.',
    mainImage: ASSET_PATHS.projectDuplexVilla,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectRoyalRestaurant,
    ]),
    locationBadge: 'تهران، زعفرانیه',
    dateBadge: '۱۰ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'world-trade-tower',
    categoryTab: 'commercial',
    sampleCode: 'نمونه ۴',
    district: 'مجتمع اداری ولنجک',
    title: 'پروژه برج تجارت جهانی',
    subtitle: 'سالن کنفرانس و اتاق هیئت‌مدیره',
    description:
      'برای اتاق هیئت‌مدیره و سالن کنفرانس برج تجاری، لوسترهای نئوکلاسیک ریستانی با پخش نور متعادل و بدون خیرگی روی میز کنفرانس طراحی و نصب گردید.',
    usedChandeliersText:
      'هارمونی رنگ برنز آنتیک لوسترها با دیوارپوش‌های چوب گردو، فضایی باوقار و رسمی برای جلسات مدیریتی فراهم آورده است.',
    mainImage: ASSET_PATHS.heroBanner,
    galleryJson: JSON.stringify([
      ASSET_PATHS.heroBanner,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectLobbyHotel,
    ]),
    locationBadge: 'آذربایجان شرقی، تبریز',
    dateBadge: '۰۳ شهریور ماه ۱۴۰۴',
  },

  // ۳. مساجد ایران (mosques)
  {
    slug: 'fakhrabad-mosque',
    categoryTab: 'mosques',
    sampleCode: 'نمونه ۱',
    district: 'مسجد جامع فخرآباد',
    title: 'پروژه شبستان مسجد جامع فخرآباد',
    subtitle: 'طراحی و ساخت لوسترهای عظیم شبستان با لاله‌های سبز و طلایی',
    description:
      'گالری لوستر اکبر صالحی افتخار طراحی، ساخت و نصب لوسترهای عظیم شبستان مسجد جامع فخرآباد را در کارنامه ۱۸ ساله خود دارد. این لوسترها با ساختار تمام‌برنز تقویت‌شده و لاله‌های اسلامی سبز و طلایی ساخته شده‌اند.',
    usedChandeliersText:
      'مهار مهندسی لوسترهای سنگین به سازه اصلی گنبد با زنجیرهای فولادی آبکاری برنز و رعایت کامل اصول ایمنی انجام شده است.',
    mainImage: ASSET_PATHS.projectMosqueDome,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectMosqueDome,
      ASSET_PATHS.heroBanner,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectRoyalRestaurant,
    ]),
    locationBadge: 'تهران، بهارستان',
    dateBadge: '۲۲ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'chahardah-masoum-mosque',
    categoryTab: 'mosques',
    sampleCode: 'نمونه ۲',
    district: 'مسجد چهارده معصوم',
    title: 'پروژه گنبد اصلی مسجد چهارده معصوم',
    subtitle: 'لوسترهای طبقاتی کریستالی و برنزی متناسب با کاشی‌کاری فیروزه‌ای',
    description:
      'در پروژه نورپردازی مسجد چهارده معصوم، لوسترهای طبقاتی کریستالی و برنزی متناسب با کاشی‌کاری‌های فیروزه‌ای و مقرنس‌کاری‌های سقف طراحی گردید تا جلوه معنوی فضا دوچندان شود.',
    usedChandeliersText:
      'استفاده از سرپیچ‌های سرامیکی نسوز و لامپ‌های شمعی کم‌مصرف گرم، روشنایی یکنواخت و آرامش‌بخشی را در تمام شبستان فراهم کرده است.',
    mainImage: ASSET_PATHS.heroBanner,
    galleryJson: JSON.stringify([
      ASSET_PATHS.heroBanner,
      ASSET_PATHS.projectMosqueDome,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
    ]),
    locationBadge: 'تهران، شهرری',
    dateBadge: '۱۴ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'tajrish-grand-mosque',
    categoryTab: 'mosques',
    sampleCode: 'نمونه ۳',
    district: 'مسجد اعظم تجریش',
    title: 'پروژه رواق مرکزی مسجد اعظم تجریش',
    subtitle: 'لوسترهای برنزی قلم‌زنی‌شده با آبکاری طلای ثابت',
    description:
      'برای رواق‌های تاریخی و سقف‌های بلند مسجد تجریش، لوسترهای برنزی قلم‌زنی‌شده با آبکاری طلای ثابت و آویزهای کریستال تراش‌خورده توسط استادکاران مجموعه صالحی تولید و نصب گردید.',
    usedChandeliersText:
      'تمامی قطعات برنزی این پروژه با لایه محافظ لاک کوره‌ای پوشانده شده‌اند تا در برابر غبار و تغییرات دما کاملاً مقاوم باشند.',
    mainImage: ASSET_PATHS.projectLobbyHotel,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectMosqueDome,
      ASSET_PATHS.heroBanner,
      ASSET_PATHS.projectRoyalRestaurant,
    ]),
    locationBadge: 'تهران، تجریش',
    dateBadge: '۰۸ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'rey-grand-mosalla',
    categoryTab: 'mosques',
    sampleCode: 'نمونه ۴',
    district: 'مصلی بزرگ ری',
    title: 'پروژه تالار محراب مصلی بزرگ ری',
    subtitle: 'نصب ۱۴ دستگاه لوستر پرشاخه هماهنگ در شبستان اصلی',
    description:
      'نصب بیش از ۱۴ دستگاه لوستر پرشاخه هماهنگ در تالار محراب مصلی ری با استفاده از تجهیزات بالابر هیدرولیکی و تیم تخصصی نصب لوستر صالحی در کمترین زمان ممکن به انجام رسید.',
    usedChandeliersText:
      'چیدمان منظم لوسترها در محورهای طولی و عرضی شبستان، توزیع نوری کاملاً مهندسی و بدون سایه ایجاد نموده است.',
    mainImage: ASSET_PATHS.projectRoyalRestaurant,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectMosqueDome,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.heroBanner,
    ]),
    locationBadge: 'تهران، ری',
    dateBadge: '۰۲ شهریور ماه ۱۴۰۴',
  },

  // ۴. رستوران‌های بزرگ (restaurants)
  {
    slug: 'shandiz-royal-restaurant',
    categoryTab: 'restaurants',
    sampleCode: 'نمونه ۱',
    district: 'رستوران سلطنتی نیاوران',
    title: 'پروژه رستوران سلطنتی شاندیز',
    subtitle: 'نورپردازی گرم و مجلل تالار پذیرایی VIP',
    description:
      'در تالار و رستوران سلطنتی، نورپردازی گرم و اشتهاآور با درخشش کریستال‌های شامپاینی و شاخه‌های طلایی طراحی شد تا فضایی مجلل و خاطره‌انگیز برای میهمانان رقم بزند.',
    usedChandeliersText:
      'در بالای هر میز VIP یک لوستر ۸ شاخه کریستالی و در مرکز سالن لوستر ۲۴ شاخه شاه ملکه نصب شده است.',
    mainImage: ASSET_PATHS.projectRoyalRestaurant,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectDuplexVilla,
    ]),
    locationBadge: 'خراسان رضوی، مشهد',
    dateBadge: '۱۹ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'aghdasiyeh-royal-lounge',
    categoryTab: 'restaurants',
    sampleCode: 'نمونه ۲',
    district: 'تراس لانژ اقدسیه',
    title: 'پروژه رویال لانژ اقدسیه',
    subtitle: 'لوسترهای شیددار مشکی و طلایی با نور ملایم و دیمرپذیر',
    description:
      'برای فضای نئوکلاسیک رویال لانژ اقدسیه، لوسترهای شیددار مشکی و طلایی با نور ملایم و دیمرپذیر انتخاب شدند تا در ساعات شب اتمسفری لوکس و آرامش‌بخش ایجاد کنند.',
    usedChandeliersText:
      'شیدهای پارچه‌ای دست‌دوز با نوارهای طلایی، نور را به صورت غیرمستقیم و دلنشین بر روی میزهای پذیرایی هدایت می‌کنند.',
    mainImage: ASSET_PATHS.heroBanner,
    galleryJson: JSON.stringify([
      ASSET_PATHS.heroBanner,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
    ]),
    locationBadge: 'تهران، اقدسیه',
    dateBadge: '۱۱ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'darband-mansion',
    categoryTab: 'restaurants',
    sampleCode: 'نمونه ۳',
    district: 'عمارت سنتی دربند',
    title: 'پروژه عمارت پذیرایی دربند',
    subtitle: 'لوسترهای برنز آنتیک و سیاه‌قلم متناسب با گچ‌بری سنتی',
    description:
      'در عمارت سنتی و تاریخی دربند، استفاده از لوسترهای برنز آنتیک و سیاه‌قلم با لاله‌های تراش‌خورده، اصالت معماری ایرانی و گچ‌بری‌های دستی سقف را به زیبایی برجسته ساخته است.',
    usedChandeliersText:
      'مقاومت بالای آبکاری برنز صالحی در برابر هوای مرطوب کوهستانی دربند، ماندگاری همیشگی این لوسترها را تضمین کرده است.',
    mainImage: ASSET_PATHS.projectLobbyHotel,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.heroBanner,
      ASSET_PATHS.projectMosqueDome,
    ]),
    locationBadge: 'تهران، دربند',
    dateBadge: '۰۶ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'ghasr-sefid-hall',
    categoryTab: 'restaurants',
    sampleCode: 'نمونه ۴',
    district: 'بانکت هال شهرک غرب',
    title: 'پروژه تالار مجلل قصر سفید',
    subtitle: 'نصب ۸ دستگاه لوستر کریستالی فرشته‌دار در سقف تالار',
    description:
      'تالار پذیرایی بزرگ شهرک غرب با سقف کناف و یونولیت، توسط تیم مهندسی نصب گالری صالحی با مهار به تیرآهن اصلی سقف و نصب ۸ دستگاه لوستر کریستالی فرشته‌دار تجهیز گردید.',
    usedChandeliersText:
      'درخشش خیره‌کننده کریستال‌ها در زمان عکاسی و فیلم‌برداری مراسم‌ها، جلوه‌ای بی‌نظیر به این تالار بخشیده است.',
    mainImage: ASSET_PATHS.projectFereshteh,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectLobbyHotel,
    ]),
    locationBadge: 'تهران، شهرک غرب',
    dateBadge: '۰۱ شهریور ماه ۱۴۰۴',
  },

  // ۵. منازل مسکونی (residential)
  {
    slug: 'farmaniyeh',
    categoryTab: 'residential',
    sampleCode: 'نمونه ۱',
    district: 'پنت‌هاوس کامرانیه و فرمانیه',
    title: 'پروژه منطقه فرمانیه',
    subtitle: 'اجرای لوستر طبقاتی شاه ملکه در وید پنت‌هاوس دوبلکس',
    description:
      'در فضای وید پنت‌هاوس دوبلکس فرمانیه و کامرانیه، لوستر طبقاتی شاه ملکه به همراه ست کامل لوستر پذیرایی، لوستر بالای میز ناهارخوری و آباژورهای کنار مبلی از کلکسیون صالحی اجرا شد.',
    usedChandeliersText:
      'انتخاب تمامی المان‌های روشنایی از یک کلکسیون واحد، انسجام و شکوه کم‌نظیری به دکوراسیون داخلی منزل بخشیده است.',
    mainImage: ASSET_PATHS.projectDuplexVilla,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectRoyalRestaurant,
    ]),
    locationBadge: 'تهران، فرمانیه',
    dateBadge: '۲۴ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'lavasanat-classic-mansion',
    categoryTab: 'residential',
    sampleCode: 'نمونه ۲',
    district: 'ویلای کلاسیک لواسان',
    title: 'پروژه عمارت کلاسیک لواسانات',
    subtitle: 'ارسال ویژه و نصب تخصصی در عمارت دوبلکس لواسانات',
    description:
      'ارسال با بسته‌بندی ضدضربه و نصب تخصصی لوسترهای کلکسیون صالحی در عمارت دوبلکس لواسانات توسط اکیپ ویژه نصب خارج از شهر تهران انجام پذیرفت.',
    usedChandeliersText:
      'برای سالن اصلی از لوسترهای کریستالی طلایی و برای اتاق‌های خواب مستر از لوسترهای رسانس گل‌دار سفید استفاده شده است.',
    mainImage: ASSET_PATHS.projectFereshteh,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.heroBanner,
    ]),
    locationBadge: 'تهران، لواسان',
    dateBadge: '۱۶ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'niavaran-private-villa',
    categoryTab: 'residential',
    sampleCode: 'نمونه ۳',
    district: 'باغ‌ویلا نیاوران',
    title: 'پروژه باغ‌ویلا اختصاصی نیاوران',
    subtitle: 'لوسترهای ۱۲ شاخه تک برنزی هماهنگ با مبلمان کلاسیک ایرانی',
    description:
      'برای سالن پذیرایی و نشیمن خصوصی باغ‌ویلا نیاوران، لوسترهای ۱۲ شاخه تک برنزی با آبکاری آنتیک دست‌ساز انتخاب شدند که هماهنگی فوق‌العاده‌ای با فرش‌های دستباف و مبلمان کلاسیک ایرانی دارند.',
    usedChandeliersText:
      'تمامی لوسترها و کنسول‌های برنزی این پروژه دارای ضمانت‌نامه کتبی ۱۰ ساله گالری اکبر صالحی می‌باشند.',
    mainImage: ASSET_PATHS.projectLobbyHotel,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectLobbyHotel,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectRoyalRestaurant,
    ]),
    locationBadge: 'تهران، نیاوران',
    dateBadge: '۰۹ شهریور ماه ۱۴۰۴',
  },
  {
    slug: 'zafaraniyeh-garden-tower',
    categoryTab: 'residential',
    sampleCode: 'نمونه ۴',
    district: 'برج باغ زعفرانیه',
    title: 'پروژه رزیدنس برج باغ زعفرانیه',
    subtitle: 'ترکیب ۳ دستگاه لوستر کریستالی هم‌راستا و دیوارکوب‌های طلایی',
    description:
      'در واحد ۴۲۰ متری برج باغ زعفرانیه، ترکیب گچ‌بری‌های سقف با سه دستگاه لوستر کریستالی هم‌راستا و دیوارکوب‌های برنزی طلایی، فضایی اشرافی و دلنشین را در سالن پذیرایی خلق کرده است.',
    usedChandeliersText:
      'نصب دقیق در مرکز قاب‌های گچ‌بری سقف و تنظیم ارتفاع استاندارد زنجیرها توسط کارشناسان نصب صالحی انجام شده است.',
    mainImage: ASSET_PATHS.projectRoyalRestaurant,
    galleryJson: JSON.stringify([
      ASSET_PATHS.projectRoyalRestaurant,
      ASSET_PATHS.projectDuplexVilla,
      ASSET_PATHS.projectFereshteh,
      ASSET_PATHS.heroBanner,
    ]),
    locationBadge: 'تهران، زعفرانیه',
    dateBadge: '۰۴ شهریور ماه ۱۴۰۴',
  },
];

const INITIAL_STORIES_SEED = [
  {
    storyKey: 'story-1',
    storyType: 'single-product',
    title: 'لوستر کریستالی...',
    fullTitle: 'کلکسیون لوسترهای سلطنتی (لوستر کریستالی)',
    subtitle: 'درخشش کریستال‌های شامپاینی و بدنه برنزی طلای ۲۴ عیار',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 45,
    thumbnailImage: ASSET_PATHS.crystaliCherub,
    image: ASSET_PATHS.storyPortraitRustic,
    mediaUrl: ASSET_PATHS.storyPortraitRustic,
    videoUrl: '',
    linkedProductKey: 'prod-crystali',
    price: '۱۶,۴۰۰,۰۰۰ تومان',
    modelType: 'crystali',
    finish: 'gold-24k',
  },
  {
    storyKey: 'story-2',
    storyType: 'single-product',
    title: 'آباژور درجه یک',
    fullTitle: 'آباژور کریستالی ۷ میله ای ایتالیایی',
    subtitle: 'استوری تک محصول با نمای کامل و بدون برش',
    category: 'abalour',
    categoryLabel: 'آباژور و کنار سالنی',
    durationSeconds: 38,
    thumbnailImage: ASSET_PATHS.crystaliGold,
    image: ASSET_PATHS.storyPortraitPalace,
    mediaUrl: ASSET_PATHS.storyPortraitPalace,
    videoUrl: '',
    linkedProductKey: 'prod-abalour-crystal',
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    modelType: 'crystali',
    finish: 'gold-24k',
  },
  {
    storyKey: 'story-3',
    storyType: 'image-only',
    title: 'آینه بریالیژی',
    fullTitle: 'نمای تالار هتل مجلل',
    subtitle: 'استوری ساده تصویری',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 26,
    thumbnailImage: ASSET_PATHS.projectLobbyHotel,
    image: ASSET_PATHS.projectLobbyHotel,
    mediaUrl: ASSET_PATHS.projectLobbyHotel,
    videoUrl: '',
    linkedProductKey: '',
    price: '۱۸,۴۰۰,۰۰۰ تومان',
    modelType: 'ristani',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-4',
    storyType: 'video',
    title: 'لوستر ملکه ۵ شا...',
    fullTitle: 'ویدیو بررسی درخشش لوستر ملکه ۵ شاخه',
    subtitle: 'نمای ویدئویی از تراش کریستال‌ها و بدنه برنزی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 55,
    thumbnailImage: ASSET_PATHS.shahMalakeh,
    image: ASSET_PATHS.storyPortraitPalace,
    mediaUrl: ASSET_PATHS.storyPortraitPalace,
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
    linkedProductKey: '',
    price: '۱۴,۲۰۰,۰۰۰ تومان',
    modelType: 'shah-malakeh',
    finish: 'dark-patina',
  },
  {
    storyKey: 'story-5',
    storyType: 'single-product',
    title: 'لوستر رز طلا',
    fullTitle: 'لوستر رز طلا کلکسیون کلاسیک',
    subtitle: 'ترکیب اصالت برنز ایرانی و درخشش کریستال شامپاینی',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 50,
    thumbnailImage: ASSET_PATHS.resansRoses,
    image: ASSET_PATHS.storyPortraitAtrium,
    mediaUrl: ASSET_PATHS.storyPortraitAtrium,
    videoUrl: '',
    linkedProductKey: 'prod-resans',
    price: '۱۱,۸۰۰,۰۰۰ تومان',
    modelType: 'crystali',
    finish: 'gold-24k',
  },
  {
    storyKey: 'story-6',
    storyType: 'image-only',
    title: 'دکواتیو میز',
    fullTitle: 'نمای تالار پذیرایی سلطنتی',
    subtitle: 'استوری ساده تصویری',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 30,
    thumbnailImage: ASSET_PATHS.projectRoyalRestaurant,
    image: ASSET_PATHS.projectRoyalRestaurant,
    mediaUrl: ASSET_PATHS.projectRoyalRestaurant,
    videoUrl: '',
    linkedProductKey: '',
    price: '۱۴,۵۰۰,۰۰۰ تومان',
    modelType: 'emerald-hero',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-7',
    storyType: 'single-product',
    title: 'رسانس نقره ای',
    fullTitle: 'لوستر رسانس نقره ای گل‌دار',
    subtitle: 'مناسب دکوراسیون‌های نئوکلاسیک و مدرن',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 42,
    thumbnailImage: ASSET_PATHS.resansRoses,
    image: ASSET_PATHS.projectFereshteh,
    mediaUrl: ASSET_PATHS.projectFereshteh,
    videoUrl: '',
    linkedProductKey: 'prod-resans',
    price: '۱۱,۸۰۰,۰۰۰ تومان',
    modelType: 'ristani',
    finish: 'royal-silver',
  },
  {
    storyKey: 'story-8',
    storyType: 'single-product',
    title: 'لوستر ماتاردان',
    fullTitle: 'لوستر ماتاردان لاله زمردی',
    subtitle: 'شید مشکی سلطنتی با کریستال‌های زمرد سبز',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 48,
    thumbnailImage: ASSET_PATHS.ristani,
    image: ASSET_PATHS.projectDuplexVilla,
    mediaUrl: ASSET_PATHS.projectDuplexVilla,
    videoUrl: '',
    linkedProductKey: 'prod-ristani',
    price: '۱۳,۶۰۰,۰۰۰ تومان',
    modelType: 'emerald-hero',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-9',
    storyType: 'single-product',
    title: 'لوستر ۱۲ شاخه',
    fullTitle: 'لوستر ۱۲ شاخه تک برنزی',
    subtitle: 'مخصوص سالن‌های پذیرایی بزرگ و لابی‌ها',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 34,
    thumbnailImage: ASSET_PATHS.shakheh12,
    image: ASSET_PATHS.heroBanner,
    mediaUrl: ASSET_PATHS.heroBanner,
    videoUrl: '',
    linkedProductKey: 'prod-12-shakheh',
    price: '۱۴,۲۰۰,۰۰۰ تومان',
    modelType: '12-shakheh',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-10',
    storyType: 'image-only',
    title: 'لامپ کم مص...',
    fullTitle: 'نورپردازی شبستان مسجد جامع',
    subtitle: 'طراحی و اجرای لوسترهای عظیم گنبدی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 22,
    thumbnailImage: ASSET_PATHS.projectMosqueDome,
    image: ASSET_PATHS.projectMosqueDome,
    mediaUrl: ASSET_PATHS.projectMosqueDome,
    videoUrl: '',
    linkedProductKey: '',
    price: '۴۸,۰۰۰,۰۰۰ تومان',
    modelType: 'shah-malakeh',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-11',
    storyType: 'single-product',
    title: 'لوستر فرشته طلا',
    fullTitle: 'لوستر کریستالی طرح فرشته طلایی',
    subtitle: 'مجسمه برنزی دست‌ساز با منشورهای کریستال شامپاینی',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 40,
    thumbnailImage: ASSET_PATHS.crystaliCherub,
    image: ASSET_PATHS.storyPortraitPalace,
    mediaUrl: ASSET_PATHS.storyPortraitPalace,
    videoUrl: '',
    linkedProductKey: 'prod-crystali',
    price: '۱۶,۴۰۰,۰۰۰ تومان',
    modelType: 'crystali',
    finish: 'gold-24k',
  },
  {
    storyKey: 'story-12',
    storyType: 'video',
    title: 'لوستر ریستانی',
    fullTitle: 'ویدیو مراحل ریخته‌گری و آبکاری لوستر ریستانی',
    subtitle: 'تولید تخصصی در کارگاه مرکزی لوستر اکبر صالحی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 59,
    thumbnailImage: ASSET_PATHS.ristani,
    image: ASSET_PATHS.storyPortraitRustic,
    mediaUrl: ASSET_PATHS.storyPortraitRustic,
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-crystal-chandelier-in-a-luxury-room-42921-large.mp4',
    linkedProductKey: '',
    price: '۱۳,۶۰۰,۰۰۰ تومان',
    modelType: 'ristani',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-13',
    storyType: 'single-product',
    title: 'دیوارکوب برنزی',
    fullTitle: 'ست دیوارکوب و آباژور برنزی',
    subtitle: 'ست مکمل لوسترهای کلکسیون اکبر صالحی',
    category: 'abalour',
    categoryLabel: 'آباژور و کنار سالنی',
    durationSeconds: 36,
    thumbnailImage: ASSET_PATHS.crystaliGold,
    image: ASSET_PATHS.storyPortraitAtrium,
    mediaUrl: ASSET_PATHS.storyPortraitAtrium,
    videoUrl: '',
    linkedProductKey: 'prod-single-fereshteh',
    price: '۴,۲۰۰,۰۰۰ تومان',
    modelType: 'ristani',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-14',
    storyType: 'image-only',
    title: 'لوستر تالاری ۲۴...',
    fullTitle: 'نمای عمارت کلاسیک فرشته',
    subtitle: 'ویژه سقف‌های دوبلکس، لابی هتل و تالارهای مجلل',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 29,
    thumbnailImage: ASSET_PATHS.projectFereshteh,
    image: ASSET_PATHS.projectFereshteh,
    mediaUrl: ASSET_PATHS.projectFereshteh,
    videoUrl: '',
    linkedProductKey: '',
    price: '۲۴,۵۰۰,۰۰۰ تومان',
    modelType: 'shah-malakeh',
    finish: 'dark-patina',
  },
  {
    storyKey: 'story-15',
    storyType: 'single-product',
    title: 'شمعدان لاله عباسی',
    fullTitle: 'شمعدان لاله عباسی برنز و کریستال',
    subtitle: 'تراش دست‌ساز با پایه تمام برنز سنگین',
    category: 'abalour',
    categoryLabel: 'آباژور و کنار سالنی',
    durationSeconds: 44,
    thumbnailImage: ASSET_PATHS.crystaliGold,
    image: ASSET_PATHS.projectLobbyHotel,
    mediaUrl: ASSET_PATHS.projectLobbyHotel,
    videoUrl: '',
    linkedProductKey: 'prod-shamdooni-laleh',
    price: '۵,۶۰۰,۰۰۰ تومان',
    modelType: 'emerald-hero',
    finish: 'gold-24k',
  },
  {
    storyKey: 'story-16',
    storyType: 'single-product',
    title: 'لوستر نئوکلاسیک',
    fullTitle: 'لوستر نئوکلاسیک ۸ شاخه شیددار',
    subtitle: 'مناسب اتاق خواب مستر و نشیمن‌های مدرن',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 31,
    thumbnailImage: ASSET_PATHS.shakheh12,
    image: ASSET_PATHS.projectRoyalRestaurant,
    mediaUrl: ASSET_PATHS.projectRoyalRestaurant,
    videoUrl: '',
    linkedProductKey: 'prod-12-shakheh',
    price: '۱۴,۲۰۰,۰۰۰ تومان',
    modelType: '12-shakheh',
    finish: 'royal-silver',
  },
  {
    storyKey: 'story-17',
    storyType: 'single-product',
    title: 'آینه و کنسول',
    fullTitle: 'ست کامل آینه بریالیژی و شمعدان',
    subtitle: 'سنگ مرمر طبیعی با بدنه برنز ریخته‌گری',
    category: 'mirror-console',
    categoryLabel: 'آینه و کنسول',
    durationSeconds: 52,
    thumbnailImage: ASSET_PATHS.shahMalakeh,
    image: ASSET_PATHS.storyPortraitRustic,
    mediaUrl: ASSET_PATHS.storyPortraitRustic,
    videoUrl: '',
    linkedProductKey: 'prod-mirror-briali',
    price: '۲۴,۵۰۰,۰۰۰ تومان',
    modelType: 'ristani',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-18',
    storyType: 'single-product',
    title: 'لوستر کریستالی ملکه',
    fullTitle: 'لوستر کریستالی شاه ملکه',
    subtitle: 'گل‌های سرامیکی دست‌ساز با آبکاری آنتیک',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    durationSeconds: 46,
    thumbnailImage: ASSET_PATHS.shahMalakeh,
    image: ASSET_PATHS.storyPortraitPalace,
    mediaUrl: ASSET_PATHS.storyPortraitPalace,
    videoUrl: '',
    linkedProductKey: 'prod-shah-malakeh',
    price: '۱۹,۵۰۰,۰۰۰ تومان',
    modelType: 'shah-malakeh',
    finish: 'antique-bronze',
  },
  {
    storyKey: 'story-19',
    storyType: 'image-only',
    title: 'پنت‌هاوس الهیه',
    fullTitle: 'نمای داخلی پروژه پنت‌هاوس الهیه',
    subtitle: 'اجرای نورپردازی کلاسیک',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 27,
    thumbnailImage: ASSET_PATHS.projectDuplexVilla,
    image: ASSET_PATHS.projectDuplexVilla,
    mediaUrl: ASSET_PATHS.projectDuplexVilla,
    videoUrl: '',
    linkedProductKey: '',
    price: '۱۹,۵۰۰,۰۰۰ تومان',
    modelType: 'crystali',
    finish: 'gold-24k',
  },
  {
    storyKey: 'story-20',
    storyType: 'video',
    title: 'پروژه فرمانیه',
    fullTitle: 'ویدیو اجرای اختصاصی پروژه مسکونی فرمانیه',
    subtitle: 'نصب تخصصی لوسترهای سفارشی کلکسیون صالحی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    durationSeconds: 54,
    thumbnailImage: ASSET_PATHS.projectRoyalRestaurant,
    image: ASSET_PATHS.projectRoyalRestaurant,
    mediaUrl: ASSET_PATHS.projectRoyalRestaurant,
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
    linkedProductKey: '',
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    modelType: 'shah-malakeh',
    finish: 'dark-patina',
  },
];

const INITIAL_ARTICLES_SEED = [
  {
    articleKey: 'art-1',
    title: 'لوستر چگونه آبکاری میشود؟ (مراحل طلای ۲۴ عیار و آنتیک)',
    excerpt:
      'فرآیند آبکاری لوسترهای برنزی و کلاسیک یکی از حساس‌ترین مراحل تولید در گالری لوستر اکبر صالحی است که ضامن درخشش و ثبات رنگ ۱۰ ساله محصول می‌باشد...',
    content:
      'فرآیند آبکاری لوسترهای برنزی و کلاسیک یکی از حساس‌ترین مراحل تولید در گالری لوستر اکبر صالحی است. ابتدا قطعات برنزی ریخته‌گری‌شده طی چند مرحله پرداخت‌کاری، چربی‌گیری التراسونیک و اسیدشویی می‌شوند تا سطحی کاملاً صیقلی و آماده جذب یون‌های فلزی به دست آید.\nسپس بسته به سفارش مشتری، آبکاری طلای ۲۴ عیار، برنز آنتیک، نقره‌ای کروم یا سیاه‌قلم سلطنتی در وان‌های الکترولیت انجام شده و در نهایت با لایه محافظ لاک الکتروفورز کوره دیده تثبیت می‌شود.',
    category: 'آموزش تخصصی',
    readTime: '۵ دقیقه مطالعه',
    publishDate: '۲۵ شهریور ۱۴۰۴',
    author: 'مهندس اکبر صالحی',
    image: ASSET_PATHS.projectFereshteh,
  },
  {
    articleKey: 'art-2',
    title: 'راهنمای انتخاب رنگ آبکاری لوستر متناسب با دکوراسیون پذیرایی',
    excerpt:
      'در انتخاب نوع آبکاری لوستر باید به رنگ چوب مبلمان، پرده‌ها و گچ‌بری سقف توجه ویژه داشت. آبکاری آنتیک و طلایی گرمای خاصی به فضاهای کلاسیک ایرانی می‌بخشد...',
    content:
      'در انتخاب نوع آبکاری لوستر باید به رنگ چوب مبلمان، پرده‌ها و گچ‌بری سقف توجه ویژه داشت. آبکاری آنتیک و طلایی گرمای خاصی به فضاهای کلاسیک ایرانی می‌بخشد.\nگالری لوستر صالحی علاوه بر تولید لوسترهای نو، خدمات بازسازی و آبکاری مجدد انواع لوستر، آینه و کنسول و شمعدان‌های قدیمی شما را با کیفیت کارخانه‌ای انجام می‌دهد.',
    category: 'راهنمای خرید',
    readTime: '۶ دقیقه مطالعه',
    publishDate: '۲۵ شهریور ۱۴۰۴',
    author: 'تیم طراحی لوستر صالحی',
    image: ASSET_PATHS.heroBanner,
  },
  {
    articleKey: 'art-3',
    title: 'اصول مهندسی نصب لوسترهای سنگین و طبقاتی در سقف‌های کناف',
    excerpt:
      'نصب لوسترهای سنگین و طبقاتی در سقف‌های کاذب، کناف و یونولیت نیازمند مهارت مهندسی و مهار ایمن به سقف اصلی یا تیرآهن با نردبان هیدرولیکی ۱۲ متری است...',
    content:
      'نصب لوسترهای سنگین و طبقاتی در سقف‌های کاذب، کناف و یونولیت نیازمند مهارت مهندسی و مهار ایمن به سقف اصلی یا تیرآهن با نردبان هیدرولیکی ۱۲ متری است.\nتمامی خدمات بسته‌بندی ضدضربه، حمل تخصصی و نصب کلاب لوستر در محدوده تهران، کرج و لواسانات توسط تکنسین‌های مجرب مجموعه انجام می‌پذیرد.',
    category: 'خدمات نصب',
    readTime: '۴ دقیقه مطالعه',
    publishDate: '۲۵ شهریور ۱۴۰۴',
    author: 'واحد فنی و مهندسی صالحی',
    image: ASSET_PATHS.projectFereshteh,
  },
  {
    articleKey: 'art-4',
    title: 'تشخیص کریستال اصل شامپاینی و برنز خالص در هنگام خرید لوستر',
    excerpt:
      'کریستال‌های به‌کاررفته در لوسترهای کلکسیون صالحی دارای درصد اکسید سرب استاندارد و تراش‌های منشوری دقیق هستند که نور لامپ‌های شمعی را به طیف‌های چشم‌نواز تجزیه می‌کنند...',
    content:
      'کریستال‌های به‌کاررفته در لوسترهای کلکسیون صالحی دارای درصد اکسید سرب استاندارد و تراش‌های منشوری دقیق هستند که نور لامپ‌های شمعی را به طیف‌های چشم‌نواز تجزیه می‌کنند.\nبرنز خالص نیز دارای چگالی بالا، صدای زنگ‌دار هنگام ضربه ملایم و عدم جذب به آهنربا است که در تمامی محصولات گالری با ضمانت کتبی ۱۰ ساله عرضه می‌گردد.',
    category: 'راهنمای اصالت',
    readTime: '۵ دقیقه مطالعه',
    publishDate: '۲۵ شهریور ۱۴۰۴',
    author: 'تیم تحریریه لوستر صالحی',
    image: ASSET_PATHS.heroBanner,
  },
];

const INITIAL_MESSAGES_SEED = [
  {
    fullName: 'مهندس کامران فرهادی',
    phone: '09123456789',
    subject: 'مشاوره خرید لوستر تالاری و دوبلکس',
    message:
      'سلام، برای وید دوبلکس ویلای لواسان به ارتفاع ۵.۵ متر نیاز به مشاوره و بازدید حضوری برای لوستر شاه ملکه ۲۴ شاخه داشتم.',
    status: 'new',
  },
  {
    fullName: 'سرکار خانم نازنین راد',
    phone: '09129876543',
    subject: 'استعلام قیمت ست آینه و کنسول بریالیژی',
    message:
      'وقت بخیر، آیا امکان سفارش ست آینه و کنسول بریالیژی با آبکاری طلای ۲۴ عیار و سنگ مرمر سفید وجود دارد؟',
    status: 'new',
  },
  {
    fullName: 'حاج آقا محمودی (هیئت امنای مسجد)',
    phone: '09121112233',
    subject: 'طراحی لوستر شبستان مسجد',
    message:
      'با سلام، جهت سفارش ۳ دستگاه لوستر مسجدی برنزی برای گنبد اصلی مسجد درخواست پیش‌فاکتور و هماهنگی بازدید داشتیم.',
    status: 'read',
  },
];

const INITIAL_ORDERS_SEED = [
  {
    customerName: 'علیرضا آذرخش',
    customerPhone: '09120759419',
    itemsJson: JSON.stringify([
      {
        id: 'prod-shah-malakeh',
        name: 'لوستر شاه ملکه (۱۸ شاخه)',
        quantity: 1,
        priceFormatted: '۱۹,۵۰۰,۰۰۰ تومان',
      },
      {
        id: 'prod-crystali',
        name: 'لوستر کریستالی فرشته‌دار',
        quantity: 2,
        priceFormatted: '۱۶,۴۰۰,۰۰۰ تومان',
      },
    ]),
    totalPriceNumeric: 52300000,
    totalPriceFormatted: '۵۲,۳۰۰,۰۰۰ تومان',
    status: 'pending',
  },
  {
    customerName: 'دکتر امیرحسین رستگار',
    customerPhone: '09123334455',
    itemsJson: JSON.stringify([
      {
        id: 'prod-mirror-briali',
        name: 'آینه و کنسول بریالیژی برنزی',
        quantity: 1,
        priceFormatted: '۲۴,۵۰۰,۰۰۰ تومان',
      },
    ]),
    totalPriceNumeric: 24500000,
    totalPriceFormatted: '۲۴,۵۰۰,۰۰۰ تومان',
    status: 'completed',
  },
];

export async function ensureSeeded(): Promise<void> {
  if (seedPromise) {
    return seedPromise;
  }
  seedPromise = (async () => {
    try {
      await ensureDefaultAdmin();

      // ۱. دسته‌بندی‌ها
      const existingCategories = await db.select().from(categories);
      if (existingCategories.length < INITIAL_CATEGORIES_SEED.length) {
        await db
          .insert(categories)
          .values(INITIAL_CATEGORIES_SEED)
          .onConflictDoNothing();
      }

      // ۲. محصولات (تکمیل تمامی محصولات سایت در دیتابیس)
      const existingProducts = await db.select().from(products);
      if (existingProducts.length <= 4) {
        await db
          .insert(products)
          .values(INITIAL_PRODUCTS_SEED)
          .onConflictDoNothing();
      }

      // ۳. پروژه‌های اجرایی (تکمیل تمامی پروژه‌های ۵ تب در دیتابیس)
      const existingProjects = await db.select().from(projects);
      if (existingProjects.length <= 3) {
        await db
          .insert(projects)
          .values(INITIAL_PROJECTS_SEED)
          .onConflictDoNothing();
      }

      // ۴. استوری‌های بالای صفحه (تکمیل تمامی ۲۰ استوری در دیتابیس و به‌روزرسانی فیلدهای تایپ استوری)
      const existingStories = await db.select().from(stories);
      if (existingStories.length === 0) {
        await db
          .insert(stories)
          .values(INITIAL_STORIES_SEED)
          .onConflictDoNothing();
      } else {
        for (const seedSt of INITIAL_STORIES_SEED) {
          const matchRow = existingStories.find(
            (r) => r.storyKey === seedSt.storyKey
          );
          if (matchRow && !matchRow.thumbnailImage) {
            await db
              .update(stories)
              .set({
                storyType: seedSt.storyType,
                thumbnailImage: seedSt.thumbnailImage,
                mediaUrl: seedSt.mediaUrl,
                videoUrl: seedSt.videoUrl,
                linkedProductKey: seedSt.linkedProductKey,
              })
              .where(eq(stories.id, matchRow.id));
          }
        }
      }

      // ۵. مقالات مجله لوستر (تکمیل ۴ مقاله در دیتابیس)
      const existingArticles = await db.select().from(articles);
      if (existingArticles.length <= 2) {
        await db
          .insert(articles)
          .values(INITIAL_ARTICLES_SEED)
          .onConflictDoNothing();
      }

      // ۶. پیام‌های تماس با ما اولیه
      const existingMessages = await db.select().from(contactMessages);
      if (existingMessages.length === 0) {
        await db.insert(contactMessages).values(INITIAL_MESSAGES_SEED);
      }

      // ۷. سفارشات اولیه
      const existingOrders = await db.select().from(orders);
      if (existingOrders.length === 0) {
        await db.insert(orders).values(INITIAL_ORDERS_SEED);
      }
    } catch (error) {
      console.error('Seed check error:', error);
      seedPromise = null;
    }
  })();

  return seedPromise;
}

// ==================== ۱. دسته‌بندی‌ها ====================
export async function getAllCategories() {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.id));
  } catch (error) {
    console.error('Database query failed in getAllCategories:', error);
    throw new Error('خطا در دریافت دسته‌بندی‌ها از دیتابیس.', { cause: error });
  }
}

export async function createCategory(data: {
  slug: string;
  title: string;
  filterKey?: string;
  sortOrder?: number;
}) {
  try {
    const cleanSlug = String(data.slug || `cat-${Date.now()}`).trim();
    const result = await db
      .insert(categories)
      .values({
        slug: cleanSlug,
        title: String(data.title || '').trim(),
        filterKey: data.filterKey || cleanSlug,
        sortOrder: Number(data.sortOrder) || 1,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createCategory:', error);
    throw new Error('خطا در ثبت دسته‌بندی جدید.', { cause: error });
  }
}

export async function updateCategoryById(
  id: number,
  data: Partial<{
    slug: string;
    title: string;
    filterKey: string;
    sortOrder: number;
  }>
) {
  try {
    const result = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in updateCategoryById:', error);
    throw new Error('خطا در ویرایش دسته‌بندی.', { cause: error });
  }
}

export async function deleteCategoryById(id: number) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteCategoryById:', error);
    throw new Error('خطا در حذف دسته‌بندی.', { cause: error });
  }
}

// ==================== ۲. محصولات ====================
export async function getAllProducts() {
  try {
    await ensureSeeded();
    return await db.select().from(products).orderBy(asc(products.id));
  } catch (error) {
    console.error('Database query failed in getAllProducts:', error);
    throw new Error('خطا در دریافت محصولات از دیتابیس.', { cause: error });
  }
}

export async function createProductRecord(data: {
  productKey?: string;
  name: string;
  subtitle: string;
  priceFormatted: string;
  priceNumeric: number;
  productCode: string;
  image: string;
  modelType: string;
  defaultFinish: string;
  categorySlug: string;
  outOfStock?: boolean;
  hasSnappPay?: boolean;
  isFeaturedSalehi?: boolean;
  isBestSeller?: boolean;
  dimensions?: string;
  branchesCount?: string;
  bodyMaterial?: string;
  warranty?: string;
  description?: string;
}) {
  try {
    const result = await db
      .insert(products)
      .values({
        productKey: data.productKey || `prod-${Date.now()}`,
        name: data.name,
        subtitle: data.subtitle,
        priceFormatted: data.priceFormatted,
        priceNumeric: Number(data.priceNumeric) || 0,
        productCode: data.productCode,
        image: data.image || ASSET_PATHS.crystaliCherub,
        modelType: data.modelType || 'crystali',
        defaultFinish: data.defaultFinish || 'gold-24k',
        categorySlug: data.categorySlug || 'chandeliers',
        outOfStock: Boolean(data.outOfStock),
        hasSnappPay: data.hasSnappPay ?? true,
        isFeaturedSalehi: data.isFeaturedSalehi ?? true,
        isBestSeller: data.isBestSeller ?? true,
        dimensions: data.dimensions || 'قطر ۸۵ سانتی‌متر × ارتفاع ۹۵ سانتی‌متر',
        branchesCount: data.branchesCount || '۱۲ شاخه',
        bodyMaterial: data.bodyMaterial || 'برنز خالص ریخته‌گری',
        warranty: data.warranty || '۱۰ سال ضمانت کتبی اصالت برنز',
        description: data.description || data.subtitle,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createProductRecord:', error);
    throw new Error('خطا در ثبت محصول جدید در دیتابیس.', { cause: error });
  }
}

export async function updateProductRecord(
  id: number,
  data: Partial<{
    name: string;
    subtitle: string;
    priceFormatted: string;
    priceNumeric: number;
    productCode: string;
    image: string;
    modelType: string;
    defaultFinish: string;
    categorySlug: string;
    outOfStock: boolean;
    hasSnappPay: boolean;
    isFeaturedSalehi: boolean;
    isBestSeller: boolean;
    dimensions: string;
    branchesCount: string;
    bodyMaterial: string;
    warranty: string;
    description: string;
  }>
) {
  try {
    const result = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in updateProductRecord:', error);
    throw new Error('خطا در ویرایش محصول در دیتابیس.', { cause: error });
  }
}

export async function deleteProductRecord(id: number) {
  try {
    await db.delete(products).where(eq(products.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteProductRecord:', error);
    throw new Error('خطا در حذف محصول از دیتابیس.', { cause: error });
  }
}

// ==================== ۳. پروژه‌های اجرایی ====================
export async function getAllProjects() {
  try {
    await ensureSeeded();
    return await db.select().from(projects).orderBy(asc(projects.id));
  } catch (error) {
    console.error('Database query failed in getAllProjects:', error);
    throw new Error('خطا در دریافت پروژه‌ها از دیتابیس.', { cause: error });
  }
}

export async function createProjectRecord(data: {
  slug?: string;
  categoryTab: string;
  sampleCode?: string;
  district: string;
  title: string;
  subtitle: string;
  description: string;
  usedChandeliersText?: string;
  mainImage?: string;
  galleryJson?: string;
  locationBadge?: string;
  dateBadge?: string;
}) {
  try {
    const mainImg = data.mainImage || ASSET_PATHS.projectLobbyHotel;
    const result = await db
      .insert(projects)
      .values({
        slug: data.slug || `project-${Date.now()}`,
        categoryTab: data.categoryTab || 'gov',
        sampleCode: data.sampleCode || 'نمونه جدید',
        district: data.district || 'تهران',
        title: data.title,
        subtitle: data.subtitle || data.district || 'پروژه اجرایی لوستر صالحی',
        description: data.description || DEFAULT_PROJECT_DESCRIPTION,
        usedChandeliersText:
          data.usedChandeliersText ||
          'طراحی و اجرای سفارشی توسط گالری لوستر اکبر صالحی',
        mainImage: mainImg,
        galleryJson:
          data.galleryJson ||
          JSON.stringify([
            mainImg,
            ASSET_PATHS.projectFereshteh,
            ASSET_PATHS.projectRoyalRestaurant,
            ASSET_PATHS.projectDuplexVilla,
          ]),
        locationBadge: data.locationBadge || data.district || 'تهران',
        dateBadge: data.dateBadge || '۲۵ شهریور ماه ۱۴۰۴',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createProjectRecord:', error);
    throw new Error('خطا در ثبت پروژه جدید در دیتابیس.', { cause: error });
  }
}

export async function updateProjectRecord(
  id: number,
  data: Partial<{
    slug: string;
    categoryTab: string;
    sampleCode: string;
    district: string;
    title: string;
    subtitle: string;
    description: string;
    usedChandeliersText: string;
    mainImage: string;
    galleryJson: string;
    locationBadge: string;
    dateBadge: string;
  }>
) {
  try {
    const result = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in updateProjectRecord:', error);
    throw new Error('خطا در ویرایش پروژه.', { cause: error });
  }
}

export async function deleteProjectRecord(id: number) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteProjectRecord:', error);
    throw new Error('خطا در حذف پروژه از دیتابیس.', { cause: error });
  }
}

// ==================== ۴. استوری‌های بالای صفحه ====================
export async function getAllStories() {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(stories)
      .orderBy(desc(stories.createdAt), desc(stories.id));
  } catch (error) {
    console.error('Database query failed in getAllStories:', error);
    throw new Error('خطا در دریافت استوری‌ها.', { cause: error });
  }
}

export async function createStoryRecord(data: {
  storyKey?: string;
  storyType?: string;
  title: string;
  fullTitle?: string;
  subtitle?: string;
  category?: string;
  categoryLabel?: string;
  durationSeconds?: number;
  thumbnailImage?: string;
  image?: string;
  mediaUrl?: string;
  videoUrl?: string;
  linkedProductKey?: string;
  slidesJson?: string;
  slides?: any[];
  price?: string;
  modelType?: string;
  finish?: string;
}) {
  try {
    const cleanType = data.storyType || 'single-product';
    const thumbImg =
      data.thumbnailImage || data.image || ASSET_PATHS.crystaliCherub;
    const mainMediaImg =
      data.mediaUrl ||
      data.image ||
      data.thumbnailImage ||
      ASSET_PATHS.storyPortraitPalace;

    let serializedSlides = '[]';
    if (Array.isArray(data.slides) && data.slides.length > 0) {
      serializedSlides = JSON.stringify(data.slides.slice(0, 10));
    } else if (typeof data.slidesJson === 'string' && data.slidesJson.trim()) {
      try {
        const parsed = JSON.parse(data.slidesJson);
        if (Array.isArray(parsed)) {
          serializedSlides = JSON.stringify(parsed.slice(0, 10));
        }
      } catch {
        serializedSlides = '[]';
      }
    } else {
      serializedSlides = JSON.stringify([
        {
          id: `slide-${Date.now()}`,
          type: cleanType,
          title: data.fullTitle || data.title,
          subtitle: data.subtitle || '',
          mediaUrl: mainMediaImg,
          videoUrl: cleanType === 'video' ? data.videoUrl || '' : '',
          linkedProductKey:
            cleanType === 'single-product'
              ? data.linkedProductKey || 'prod-crystali'
              : '',
          durationSeconds: 10,
        },
      ]);
    }

    const result = await db
      .insert(stories)
      .values({
        storyKey: data.storyKey || `story-${Date.now()}`,
        storyType: cleanType,
        title: data.title,
        fullTitle: data.fullTitle || data.title,
        subtitle:
          data.subtitle || 'کلکسیون اختصاصی گالری لوستر اکبر صالحی',
        category:
          data.category ||
          (cleanType === 'video' ? 'video-projects' : 'chandeliers'),
        categoryLabel:
          data.categoryLabel ||
          (cleanType === 'video' ? 'ویدیو و پروژه‌ها' : 'کلکسیون لوستر'),
        durationSeconds: Number(data.durationSeconds) || 40,
        thumbnailImage: thumbImg,
        image: mainMediaImg,
        mediaUrl: mainMediaImg,
        videoUrl: cleanType === 'video' ? data.videoUrl || '' : '',
        linkedProductKey:
          cleanType === 'single-product'
            ? data.linkedProductKey || 'prod-crystali'
            : '',
        slidesJson: serializedSlides,
        price: data.price || '۱۶,۴۰۰,۰۰۰ تومان',
        modelType: data.modelType || 'crystali',
        finish: data.finish || 'gold-24k',
        createdAt: new Date(),
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createStoryRecord:', error);
    throw new Error('خطا در ثبت استوری جدید در سایت.', { cause: error });
  }
}

export async function updateStoryRecord(
  id: number,
  data: Partial<{
    storyType: string;
    title: string;
    fullTitle: string;
    subtitle: string;
    category: string;
    categoryLabel: string;
    durationSeconds: number;
    thumbnailImage: string;
    image: string;
    mediaUrl: string;
    videoUrl: string;
    linkedProductKey: string;
    slidesJson: string;
    slides: any[];
    price: string;
    modelType: string;
    finish: string;
  }>
) {
  try {
    const updatePayload: Record<string, any> = { ...data, createdAt: new Date() };
    delete updatePayload.slides;
    if (Array.isArray(data.slides)) {
      updatePayload.slidesJson = JSON.stringify(data.slides.slice(0, 10));
    } else if (typeof data.slidesJson === 'string') {
      try {
        const parsed = JSON.parse(data.slidesJson);
        if (Array.isArray(parsed)) {
          updatePayload.slidesJson = JSON.stringify(parsed.slice(0, 10));
        }
      } catch {
        // ignore
      }
    }
    if (data.mediaUrl && !data.image) {
      updatePayload.image = data.mediaUrl;
    } else if (data.image && !data.mediaUrl) {
      updatePayload.mediaUrl = data.image;
    }
    if (data.storyType === 'image-only') {
      updatePayload.linkedProductKey = '';
      updatePayload.videoUrl = '';
    } else if (data.storyType === 'video') {
      updatePayload.linkedProductKey = '';
    } else if (data.storyType === 'single-product') {
      updatePayload.videoUrl = '';
    }
    const result = await db
      .update(stories)
      .set(updatePayload)
      .where(eq(stories.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in updateStoryRecord:', error);
    throw new Error('خطا در ویرایش استوری در سایت.', { cause: error });
  }
}

export async function deleteStoryRecord(id: number) {
  try {
    await db.delete(stories).where(eq(stories.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteStoryRecord:', error);
    throw new Error('خطا در حذف استوری.', { cause: error });
  }
}

// ==================== ۵. مقالات مجله لوستر ====================
export async function getAllArticles() {
  try {
    await ensureSeeded();
    return await db.select().from(articles).orderBy(asc(articles.id));
  } catch (error) {
    console.error('Database query failed in getAllArticles:', error);
    throw new Error('خطا در دریافت مقالات از دیتابیس.', { cause: error });
  }
}

export async function createArticleRecord(data: {
  articleKey?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime?: string;
  publishDate?: string;
  author?: string;
  image?: string;
}) {
  try {
    const result = await db
      .insert(articles)
      .values({
        articleKey: data.articleKey || `art-${Date.now()}`,
        title: data.title,
        excerpt: data.excerpt || data.title,
        content: data.content || data.excerpt || data.title,
        category: data.category || 'راهنمای خرید',
        readTime: data.readTime || '۵ دقیقه مطالعه',
        publishDate: data.publishDate || '۲۵ شهریور ۱۴۰۴',
        author: data.author || 'تیم تحریریه لوستر صالحی',
        image: data.image || ASSET_PATHS.projectFereshteh,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createArticleRecord:', error);
    throw new Error('خطا در ثبت مقاله جدید.', { cause: error });
  }
}

export async function updateArticleRecord(
  id: number,
  data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    publishDate: string;
    author: string;
    image: string;
  }>
) {
  try {
    const result = await db
      .update(articles)
      .set(data)
      .where(eq(articles.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in updateArticleRecord:', error);
    throw new Error('خطا در ویرایش مقاله.', { cause: error });
  }
}

export async function deleteArticleRecord(id: number) {
  try {
    await db.delete(articles).where(eq(articles.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteArticleRecord:', error);
    throw new Error('خطا در حذف مقاله.', { cause: error });
  }
}

// ==================== ۶. پیام‌های تماس با ما ====================
export async function getAllContactMessages() {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.id));
  } catch (error) {
    console.error('Database query failed in getAllContactMessages:', error);
    throw new Error('خطا در دریافت پیام‌های تماس.', { cause: error });
  }
}

export async function createContactMessageRecord(data: {
  fullName: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const result = await db
      .insert(contactMessages)
      .values({
        fullName: data.fullName,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        status: 'new',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createContactMessageRecord:', error);
    throw new Error('خطا در ثبت پیام شما.', { cause: error });
  }
}

export async function updateContactMessageRecord(
  id: number,
  data: Partial<{
    fullName: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
  }>
) {
  try {
    const result = await db
      .update(contactMessages)
      .set(data)
      .where(eq(contactMessages.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in updateContactMessageRecord:', error);
    throw new Error('خطا در ویرایش پیام تماس.', { cause: error });
  }
}

export async function updateContactMessageStatus(id: number, status: string) {
  return updateContactMessageRecord(id, { status });
}

export async function deleteContactMessageRecord(id: number) {
  try {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteContactMessageRecord:', error);
    throw new Error('خطا در حذف پیام.', { cause: error });
  }
}

// ==================== ۷. سفارشات مشتریان ====================
export async function getAllOrders() {
  try {
    await ensureSeeded();
    return await db.select().from(orders).orderBy(desc(orders.id));
  } catch (error) {
    console.error('Database query failed in getAllOrders:', error);
    throw new Error('خطا در دریافت سفارشات.', { cause: error });
  }
}

export async function createOrderRecord(data: {
  customerName: string;
  customerPhone: string;
  itemsJson: string;
  totalPriceNumeric: number;
  totalPriceFormatted: string;
}) {
  try {
    const result = await db
      .insert(orders)
      .values({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        itemsJson: data.itemsJson,
        totalPriceNumeric: Number(data.totalPriceNumeric) || 0,
        totalPriceFormatted: data.totalPriceFormatted,
        status: 'pending',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createOrderRecord:', error);
    throw new Error('خطا در ثبت سفارش.', { cause: error });
  }
}

export async function updateOrderRecord(
  id: number,
  data: Partial<{
    customerName: string;
    customerPhone: string;
    itemsJson: string;
    totalPriceNumeric: number;
    totalPriceFormatted: string;
    status: string;
  }>
) {
  try {
    const result = await db
      .update(orders)
      .set(data)
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in updateOrderRecord:', error);
    throw new Error('خطا در ویرایش سفارش.', { cause: error });
  }
}

export async function updateOrderStatus(id: number, status: string) {
  return updateOrderRecord(id, { status });
}

export async function deleteOrderRecord(id: number) {
  try {
    await db.delete(orders).where(eq(orders.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteOrderRecord:', error);
    throw new Error('خطا در حذف سفارش.', { cause: error });
  }
}

export async function getDashboardSummary() {
  try {
    await Promise.all([ensureSeeded(), ensureDefaultAdmin()]);
    const [
      allProducts,
      allCategories,
      allProjects,
      allStories,
      allArticles,
      allMessages,
      allOrders,
      allUsers,
    ] = await Promise.all([
      db.select().from(products),
      db.select().from(categories),
      db.select().from(projects),
      db.select().from(stories),
      db.select().from(articles),
      db.select().from(contactMessages),
      db.select().from(orders),
      db.select().from(users),
    ]);

    return {
      productsCount: allProducts.length,
      categoriesCount: allCategories.length,
      projectsCount: allProjects.length,
      storiesCount: allStories.length,
      articlesCount: allArticles.length,
      messagesCount: allMessages.length,
      ordersCount: allOrders.length,
      usersCount: allUsers.length,
    };
  } catch (error) {
    console.error('Database query failed in getDashboardSummary:', error);
    throw new Error('خطا در دریافت آمار داشبورد.', { cause: error });
  }
}

// ==================== ۸. تنظیمات فوتر و وب‌سایت ====================
export interface FooterPhoneItem {
  id: string;
  branchTitle: string;
  displayPhone: string;
  phone?: string;
}

export interface FooterLicenseBadge {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
}

export interface FooterSettingsData {
  cardBgColor: string;
  bottomCardBgColor: string;
  descriptionParagraph1: string;
  descriptionParagraph2: string;
  phones: FooterPhoneItem[];
  linkedinUrl: string;
  whatsappUrl: string;
  instagramUrl: string;
  enamadCode: string;
  otherLicenses: FooterLicenseBadge[];
  copyrightText: string;
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettingsData = {
  cardBgColor: '#b39561',
  bottomCardBgColor: '#f7f6f2',
  descriptionParagraph1:
    'شعبه VIP مجموعه لوستر صالحی یکی از بخش‌های منحصربه‌فرد این مجموعه است که با هدف ارائه تجربه‌ای ویژه برای شما عزیزان طراحی شده است. در این شعبه، امکان ثبت سفارش تمامی محصولات مجموعه مطابق با سلیقه و نیاز شخصی شما فراهم شده است.',
  descriptionParagraph2:
    'پشتیبانی ۲۴ ساعته لوستر صالحی در کنار شما همیشه هستیم :)',
  phones: [
    {
      id: 'ph-1',
      branchTitle: 'شریعتی',
      displayPhone: '021-22222635',
      phone: '02122222635',
    },
    {
      id: 'ph-2',
      branchTitle: 'لاله زار نو',
      displayPhone: '021-33333632',
      phone: '02133333632',
    },
    {
      id: 'ph-3',
      branchTitle: 'غرب بزودی',
      displayPhone: '02144444653',
      phone: '02144444653',
    },
    {
      id: 'ph-4',
      branchTitle: 'افسریه',
      displayPhone: '021-33459665',
      phone: '02133459665',
    },
    {
      id: 'ph-5',
      branchTitle: 'همراه',
      displayPhone: '0912-3779149',
      phone: '09123779149',
    },
  ],
  linkedinUrl: '#footer-contact',
  whatsappUrl: '#footer-contact',
  instagramUrl: '#footer-contact',
  enamadCode: '',
  otherLicenses: [
    {
      id: 'license-2',
      title: 'مجوز ساماندهی',
      imageUrl: '',
      linkUrl: '',
    },
    {
      id: 'license-3',
      title: 'مجوز اتحادیه لوستر',
      imageUrl: '',
      linkUrl: '',
    },
    {
      id: 'license-4',
      title: 'گواهی اصالت و ضمانت',
      imageUrl: '',
      linkUrl: '',
    },
  ],
  copyrightText: 'کلیه حقوق این سایت محفوظ و متعلق به لوستر اکبر صالحی است.',
};

export async function getFooterSettings(): Promise<FooterSettingsData> {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, 'footer'))
      .limit(1);

    if (rows.length === 0) {
      await db.insert(siteSettings).values({
        settingKey: 'footer',
        settingValueJson: JSON.stringify(DEFAULT_FOOTER_SETTINGS),
      });
      return DEFAULT_FOOTER_SETTINGS;
    }

    const parsed = JSON.parse(rows[0].settingValueJson || '{}');
    return {
      cardBgColor: parsed.cardBgColor || DEFAULT_FOOTER_SETTINGS.cardBgColor,
      bottomCardBgColor:
        parsed.bottomCardBgColor || DEFAULT_FOOTER_SETTINGS.bottomCardBgColor,
      descriptionParagraph1:
        typeof parsed.descriptionParagraph1 === 'string'
          ? parsed.descriptionParagraph1
          : DEFAULT_FOOTER_SETTINGS.descriptionParagraph1,
      descriptionParagraph2:
        typeof parsed.descriptionParagraph2 === 'string'
          ? parsed.descriptionParagraph2
          : DEFAULT_FOOTER_SETTINGS.descriptionParagraph2,
      phones:
        Array.isArray(parsed.phones) && parsed.phones.length > 0
          ? parsed.phones.map((item: any, idx: number) => {
              const disp = String(
                item?.displayPhone ||
                  DEFAULT_FOOTER_SETTINGS.phones[idx]?.displayPhone ||
                  ''
              ).trim();
              return {
                id: item?.id || `ph-${idx + 1}`,
                branchTitle: String(
                  item?.branchTitle ??
                    DEFAULT_FOOTER_SETTINGS.phones[idx]?.branchTitle ??
                    `شماره ${idx + 1}`
                ).trim(),
                displayPhone: disp,
                phone: String(
                  item?.phone || disp.replace(/[^0-9+]/g, '')
                ).trim(),
              };
            })
          : DEFAULT_FOOTER_SETTINGS.phones,
      linkedinUrl:
        typeof parsed.linkedinUrl === 'string'
          ? parsed.linkedinUrl
          : DEFAULT_FOOTER_SETTINGS.linkedinUrl,
      whatsappUrl:
        typeof parsed.whatsappUrl === 'string'
          ? parsed.whatsappUrl
          : DEFAULT_FOOTER_SETTINGS.whatsappUrl,
      instagramUrl:
        typeof parsed.instagramUrl === 'string'
          ? parsed.instagramUrl
          : DEFAULT_FOOTER_SETTINGS.instagramUrl,
      enamadCode:
        typeof parsed.enamadCode === 'string'
          ? parsed.enamadCode
          : DEFAULT_FOOTER_SETTINGS.enamadCode,
      otherLicenses:
        Array.isArray(parsed.otherLicenses) && parsed.otherLicenses.length > 0
          ? parsed.otherLicenses.slice(0, 3).map((lic: any, idx: number) => ({
              id: lic?.id || `license-${idx + 2}`,
              title:
                typeof lic?.title === 'string'
                  ? lic.title
                  : DEFAULT_FOOTER_SETTINGS.otherLicenses[idx]?.title ||
                    `مجوز شماره ${idx + 2}`,
              imageUrl: typeof lic?.imageUrl === 'string' ? lic.imageUrl : '',
              linkUrl: typeof lic?.linkUrl === 'string' ? lic.linkUrl : '',
            }))
          : DEFAULT_FOOTER_SETTINGS.otherLicenses,
      copyrightText:
        typeof parsed.copyrightText === 'string'
          ? parsed.copyrightText
          : DEFAULT_FOOTER_SETTINGS.copyrightText,
    };
  } catch (error) {
    console.error('Database query failed in getFooterSettings:', error);
    return DEFAULT_FOOTER_SETTINGS;
  }
}

export async function saveFooterSettings(
  data: Partial<FooterSettingsData>
): Promise<FooterSettingsData> {
  try {
    const current = await getFooterSettings();
    const merged: FooterSettingsData = {
      cardBgColor: String(data.cardBgColor || current.cardBgColor || '#b39561'),
      bottomCardBgColor: String(
        data.bottomCardBgColor || current.bottomCardBgColor || '#f7f6f2'
      ),
      descriptionParagraph1:
        data.descriptionParagraph1 !== undefined
          ? String(data.descriptionParagraph1)
          : current.descriptionParagraph1,
      descriptionParagraph2:
        data.descriptionParagraph2 !== undefined
          ? String(data.descriptionParagraph2)
          : current.descriptionParagraph2,
      phones:
        Array.isArray(data.phones) && data.phones.length > 0
          ? data.phones.map((item, idx) => {
              const disp = String(item?.displayPhone || '').trim();
              return {
                id: item?.id || `ph-${idx + 1}`,
                branchTitle: String(item?.branchTitle || '').trim(),
                displayPhone: disp,
                phone: String(
                  item?.phone || disp.replace(/[^0-9+]/g, '')
                ).trim(),
              };
            })
          : current.phones,
      linkedinUrl:
        data.linkedinUrl !== undefined
          ? String(data.linkedinUrl)
          : current.linkedinUrl,
      whatsappUrl:
        data.whatsappUrl !== undefined
          ? String(data.whatsappUrl)
          : current.whatsappUrl,
      instagramUrl:
        data.instagramUrl !== undefined
          ? String(data.instagramUrl)
          : current.instagramUrl,
      enamadCode:
        data.enamadCode !== undefined
          ? String(data.enamadCode)
          : current.enamadCode,
      otherLicenses:
        Array.isArray(data.otherLicenses) && data.otherLicenses.length > 0
          ? data.otherLicenses.slice(0, 3).map((lic, idx) => ({
              id: lic?.id || `license-${idx + 2}`,
              title: String(
                lic?.title ||
                  current.otherLicenses[idx]?.title ||
                  `مجوز شماره ${idx + 2}`
              ),
              imageUrl: String(lic?.imageUrl || ''),
              linkUrl: String(lic?.linkUrl || ''),
            }))
          : current.otherLicenses,
      copyrightText:
        data.copyrightText !== undefined
          ? String(data.copyrightText)
          : current.copyrightText,
    };

    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, 'footer'))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({
          settingValueJson: JSON.stringify(merged),
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.settingKey, 'footer'));
    } else {
      await db.insert(siteSettings).values({
        settingKey: 'footer',
        settingValueJson: JSON.stringify(merged),
      });
    }

    return merged;
  } catch (error) {
    console.error('Database query failed in saveFooterSettings:', error);
    throw new Error('خطا در ذخیره تنظیمات فوتر سایت.', { cause: error });
  }
}

// ==================== ۹. تنظیمات صفحه تماس با ما ====================
export interface ContactUsBranchLocationItem {
  id: string;
  branchTitle: string;
  address: string;
  neshanUrl: string;
}

export interface ContactUsBranchPhoneItem {
  id: string;
  title: string;
  phone: string;
}

export interface ContactUsSettingsData {
  supportTitle: string;
  supportValue: string;
  workingDaysTitle: string;
  workingDaysHours: string;
  holidaysTitle: string;
  holidaysHours: string;
  emailTitle: string;
  emailAddress: string;
  managerPhoneTitle: string;
  managerPhone: string;
  landlinePhoneTitle: string;
  landlinePhone: string;
  branchLocations: ContactUsBranchLocationItem[];
  branchPhones: ContactUsBranchPhoneItem[];
}

export const DEFAULT_CONTACT_US_SETTINGS: ContactUsSettingsData = {
  supportTitle: 'پشتیبانی :',
  supportValue: 'بخش پاسخگویی تلفنی',
  workingDaysTitle: 'روز های کاری :',
  workingDaysHours: '۸ صبح الی ۸ شب',
  holidaysTitle: 'روز های تعطیل :',
  holidaysHours: '۸ صبح الی ۶ بعدظهر',
  emailTitle: 'آدرس ایمیل :',
  emailAddress: 'info@lostersalehi.ir',
  managerPhoneTitle: 'شماره مدیریت :',
  managerPhone: '۰۹۰۱۲۲۲۲۶۳۵',
  landlinePhoneTitle: 'شماره ثابت :',
  landlinePhone: '۰۲۱-۳۳۳۳۳۶۳۲',
  branchLocations: [
    {
      id: 'branch-lalehzar',
      branchTitle: 'شعبه لاله زار :',
      address: 'لاله زار نو خیابان امین زاده پاساژ پردیس طبقه ۴ پلاک ۳',
      neshanUrl: 'https://neshan.org',
    },
    {
      id: 'branch-shariati',
      branchTitle: 'شعبه شریعتی :',
      address:
        'خیابان ظفر، خیابان گوی آبادی، خیابان پور اردکانی، خیابان قره گوزلو پلاک ۵',
      neshanUrl: 'https://neshan.org',
    },
    {
      id: 'branch-afsarieh',
      branchTitle: 'شعبه سه راه افسریه :',
      address:
        'افسریه مسعودیه خ اردیبهشت جنب پاساژ خانواده پلاک ۱۳۳۵ لوستر صالحی',
      neshanUrl: 'https://neshan.org',
    },
  ],
  branchPhones: [
    {
      id: 'phone-lalehzar',
      title: 'شماره تلفن و واتساپ شعبه لاله زار نو :',
      phone: '۰۲۱-۳۳۳۳۳۶۳۲',
    },
    {
      id: 'phone-shariati',
      title: 'شماره تلفن و واتساپ شعبه شریعتی :',
      phone: '۰۲۱-۳۳۳۳۳۶۳۲',
    },
    {
      id: 'phone-afsarieh',
      title: 'شماره تلفن و واتساپ شعبه سه راه افسریه :',
      phone: '۰۲۱-۳۳۳۳۳۶۳۲',
    },
  ],
};

export async function getContactUsSettings(): Promise<ContactUsSettingsData> {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, 'contact_us'))
      .limit(1);

    if (rows.length === 0) {
      await db.insert(siteSettings).values({
        settingKey: 'contact_us',
        settingValueJson: JSON.stringify(DEFAULT_CONTACT_US_SETTINGS),
      });
      return DEFAULT_CONTACT_US_SETTINGS;
    }

    const parsed = JSON.parse(rows[0].settingValueJson || '{}');
    return {
      supportTitle:
        typeof parsed.supportTitle === 'string'
          ? parsed.supportTitle
          : DEFAULT_CONTACT_US_SETTINGS.supportTitle,
      supportValue:
        typeof parsed.supportValue === 'string'
          ? parsed.supportValue
          : DEFAULT_CONTACT_US_SETTINGS.supportValue,
      workingDaysTitle:
        typeof parsed.workingDaysTitle === 'string'
          ? parsed.workingDaysTitle
          : DEFAULT_CONTACT_US_SETTINGS.workingDaysTitle,
      workingDaysHours:
        typeof parsed.workingDaysHours === 'string'
          ? parsed.workingDaysHours
          : DEFAULT_CONTACT_US_SETTINGS.workingDaysHours,
      holidaysTitle:
        typeof parsed.holidaysTitle === 'string'
          ? parsed.holidaysTitle
          : DEFAULT_CONTACT_US_SETTINGS.holidaysTitle,
      holidaysHours:
        typeof parsed.holidaysHours === 'string'
          ? parsed.holidaysHours
          : DEFAULT_CONTACT_US_SETTINGS.holidaysHours,
      emailTitle:
        typeof parsed.emailTitle === 'string'
          ? parsed.emailTitle
          : DEFAULT_CONTACT_US_SETTINGS.emailTitle,
      emailAddress:
        typeof parsed.emailAddress === 'string'
          ? parsed.emailAddress
          : DEFAULT_CONTACT_US_SETTINGS.emailAddress,
      managerPhoneTitle:
        typeof parsed.managerPhoneTitle === 'string'
          ? parsed.managerPhoneTitle
          : DEFAULT_CONTACT_US_SETTINGS.managerPhoneTitle,
      managerPhone:
        typeof parsed.managerPhone === 'string'
          ? parsed.managerPhone
          : DEFAULT_CONTACT_US_SETTINGS.managerPhone,
      landlinePhoneTitle:
        typeof parsed.landlinePhoneTitle === 'string'
          ? parsed.landlinePhoneTitle
          : DEFAULT_CONTACT_US_SETTINGS.landlinePhoneTitle,
      landlinePhone:
        typeof parsed.landlinePhone === 'string'
          ? parsed.landlinePhone
          : DEFAULT_CONTACT_US_SETTINGS.landlinePhone,
      branchLocations:
        Array.isArray(parsed.branchLocations) &&
        parsed.branchLocations.length > 0
          ? parsed.branchLocations.map((loc: any, idx: number) => ({
              id:
                loc?.id ||
                DEFAULT_CONTACT_US_SETTINGS.branchLocations[idx]?.id ||
                `branch-${idx + 1}`,
              branchTitle: String(
                loc?.branchTitle ??
                  DEFAULT_CONTACT_US_SETTINGS.branchLocations[idx]
                    ?.branchTitle ??
                  `شعبه ${idx + 1} :`
              ),
              address: String(
                loc?.address ??
                  DEFAULT_CONTACT_US_SETTINGS.branchLocations[idx]?.address ??
                  ''
              ),
              neshanUrl: String(
                loc?.neshanUrl ??
                  DEFAULT_CONTACT_US_SETTINGS.branchLocations[idx]?.neshanUrl ??
                  'https://neshan.org'
              ),
            }))
          : DEFAULT_CONTACT_US_SETTINGS.branchLocations,
      branchPhones:
        Array.isArray(parsed.branchPhones) && parsed.branchPhones.length > 0
          ? parsed.branchPhones.map((ph: any, idx: number) => ({
              id:
                ph?.id ||
                DEFAULT_CONTACT_US_SETTINGS.branchPhones[idx]?.id ||
                `phone-${idx + 1}`,
              title: String(
                ph?.title ??
                  DEFAULT_CONTACT_US_SETTINGS.branchPhones[idx]?.title ??
                  `شماره تلفن شعبه ${idx + 1} :`
              ),
              phone: String(
                ph?.phone ??
                  DEFAULT_CONTACT_US_SETTINGS.branchPhones[idx]?.phone ??
                  ''
              ),
            }))
          : DEFAULT_CONTACT_US_SETTINGS.branchPhones,
    };
  } catch (error) {
    console.error('Database query failed in getContactUsSettings:', error);
    return DEFAULT_CONTACT_US_SETTINGS;
  }
}

export async function saveContactUsSettings(
  data: Partial<ContactUsSettingsData>
): Promise<ContactUsSettingsData> {
  try {
    const current = await getContactUsSettings();
    const merged: ContactUsSettingsData = {
      supportTitle:
        data.supportTitle !== undefined
          ? String(data.supportTitle)
          : current.supportTitle,
      supportValue:
        data.supportValue !== undefined
          ? String(data.supportValue)
          : current.supportValue,
      workingDaysTitle:
        data.workingDaysTitle !== undefined
          ? String(data.workingDaysTitle)
          : current.workingDaysTitle,
      workingDaysHours:
        data.workingDaysHours !== undefined
          ? String(data.workingDaysHours)
          : current.workingDaysHours,
      holidaysTitle:
        data.holidaysTitle !== undefined
          ? String(data.holidaysTitle)
          : current.holidaysTitle,
      holidaysHours:
        data.holidaysHours !== undefined
          ? String(data.holidaysHours)
          : current.holidaysHours,
      emailTitle:
        data.emailTitle !== undefined
          ? String(data.emailTitle)
          : current.emailTitle,
      emailAddress:
        data.emailAddress !== undefined
          ? String(data.emailAddress)
          : current.emailAddress,
      managerPhoneTitle:
        data.managerPhoneTitle !== undefined
          ? String(data.managerPhoneTitle)
          : current.managerPhoneTitle,
      managerPhone:
        data.managerPhone !== undefined
          ? String(data.managerPhone)
          : current.managerPhone,
      landlinePhoneTitle:
        data.landlinePhoneTitle !== undefined
          ? String(data.landlinePhoneTitle)
          : current.landlinePhoneTitle,
      landlinePhone:
        data.landlinePhone !== undefined
          ? String(data.landlinePhone)
          : current.landlinePhone,
      branchLocations:
        Array.isArray(data.branchLocations) && data.branchLocations.length > 0
          ? data.branchLocations.map((loc, idx) => ({
              id: loc?.id || `branch-${idx + 1}`,
              branchTitle: String(loc?.branchTitle || '').trim(),
              address: String(loc?.address || '').trim(),
              neshanUrl: String(loc?.neshanUrl || 'https://neshan.org').trim(),
            }))
          : current.branchLocations,
      branchPhones:
        Array.isArray(data.branchPhones) && data.branchPhones.length > 0
          ? data.branchPhones.map((ph, idx) => ({
              id: ph?.id || `phone-${idx + 1}`,
              title: String(ph?.title || '').trim(),
              phone: String(ph?.phone || '').trim(),
            }))
          : current.branchPhones,
    };

    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, 'contact_us'))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({
          settingValueJson: JSON.stringify(merged),
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.settingKey, 'contact_us'));
    } else {
      await db.insert(siteSettings).values({
        settingKey: 'contact_us',
        settingValueJson: JSON.stringify(merged),
      });
    }

    return merged;
  } catch (error) {
    console.error('Database query failed in saveContactUsSettings:', error);
    throw new Error('خطا در ذخیره تنظیمات صفحه تماس با ما.', { cause: error });
  }
}
