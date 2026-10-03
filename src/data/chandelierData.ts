import { ChandelierModelType, FinishType } from '../components/Chandelier3DViewer';
import heroBannerImg from '../assets/images/hero_chandelier_banner_1790646227735.jpg';
import shahMalakehImg from '../assets/images/chandelier_shah_malakeh_1790646240589.jpg';
import shakheh12Img from '../assets/images/chandelier_12_shakheh_1790646251083.jpg';
import ristaniImg from '../assets/images/chandelier_ristani_1790646262438.jpg';
import resansRosesImg from '../assets/images/chandelier_resans_roses_1790647324596.jpg';
import crystaliCherubImg from '../assets/images/chandelier_crystali_cherub_1790647334691.jpg';
import crystaliGoldImg from '../assets/images/chandelier_crystali_1790646272446.jpg';
import projectFereshtehImg from '../assets/images/project_fereshteh_interior_1790646283141.jpg';
import projectLobbyHotelImg from '../assets/images/project_lobby_hotel_1790681398126.jpg';
import projectMosqueDomeImg from '../assets/images/project_mosque_dome_1790681415301.jpg';
import projectRoyalRestaurantImg from '../assets/images/project_royal_restaurant_1790681438681.jpg';
import projectDuplexVillaImg from '../assets/images/project_duplex_villa_1790681451000.jpg';
import storyPortraitRusticImg from '../assets/images/story_portrait_rustic_1790682028851.jpg';
import storyPortraitAtriumImg from '../assets/images/story_portrait_atrium_1790682040988.jpg';
import storyPortraitPalaceImg from '../assets/images/story_portrait_palace_1790682052291.jpg';

/**
 * مسیر تصاویر تولیدشده در پروژه (با Import استاندارد باندلر Vite تا در تمامی محیط‌ها ۱۰۰٪ لود شوند)
 */
export const GENERATED_IMAGES = {
  heroBanner: heroBannerImg,
  shahMalakeh: shahMalakehImg,
  shakheh12: shakheh12Img,
  ristani: ristaniImg,
  resansRoses: resansRosesImg,
  crystaliCherub: crystaliCherubImg,
  crystaliGold: crystaliGoldImg,
  projectFereshteh: projectFereshtehImg,
  projectLobbyHotel: projectLobbyHotelImg,
  projectMosqueDome: projectMosqueDomeImg,
  projectRoyalRestaurant: projectRoyalRestaurantImg,
  projectDuplexVilla: projectDuplexVillaImg,
  storyPortraitRustic: storyPortraitRusticImg,
  storyPortraitAtrium: storyPortraitAtriumImg,
  storyPortraitPalace: storyPortraitPalaceImg,
};

export type StoryCategoryType =
  | 'all'
  | 'chandeliers'
  | 'abalour'
  | 'mirror-console'
  | 'video-projects';

export interface StoryCategoryOption {
  id: StoryCategoryType;
  label: string;
}

export const STORY_CATEGORIES: StoryCategoryOption[] = [
  { id: 'all', label: 'همه استوری‌ها' },
  { id: 'chandeliers', label: 'کلکسیون لوستر' },
  { id: 'abalour', label: 'آباژور و کنار سالنی' },
  { id: 'mirror-console', label: 'آینه و کنسول' },
  { id: 'video-projects', label: 'ویدیو و پروژه‌ها' },
];

export type StorySlideType =
  | 'single-product'
  | 'multi-product'
  | 'image-only'
  | 'video';

export interface StoryProductAttachment {
  id: string;
  name: string;
  price: string;
  image: string;
  productCode?: string;
  modelType?: ChandelierModelType;
  finish?: FinishType;
}

export interface StorySlideItem {
  id: string;
  type: StorySlideType;
  title: string;
  subtitle?: string;
  mediaUrl: string;
  videoUrl?: string;
  durationSeconds?: number;
  videoDurationSec?: number;
  simulateSlowLoadMs?: number;
  products?: StoryProductAttachment[];
}

export interface StoryItem {
  id: string;
  title: string;
  fullTitle: string;
  subtitle: string;
  category: StoryCategoryType;
  categoryLabel: string;
  storyType: StorySlideType;
  durationSeconds: number;
  thumbnailImage?: string;
  image: string;
  mediaUrl?: string;
  productImage?: string;
  videoUrl?: string;
  linkedProductKey?: string;
  price?: string;
  hasDashedRing?: boolean;
  simulateLoading?: boolean;
  modelType: ChandelierModelType;
  finish: FinishType;
  products?: StoryProductAttachment[];
  slides?: StorySlideItem[];
}

/**
 * استوری‌های دایره‌ای بالای صفحه به صورت کروسل قابل اسکرول (۲۰ آیتم متنوع)
 * هر استوری دارای زمان (durationSeconds) اختصاصی خود است.
 */
export const STORY_ITEMS: StoryItem[] = [
  {
    id: 'story-1',
    title: 'لوستر کریستالی...',
    fullTitle: 'کلکسیون لوسترهای سلطنتی (۳ محصول)',
    subtitle: 'مشاهده و مقایسه همزمان ۳ محصول منتخب در یک استوری',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'multi-product',
    durationSeconds: 45,
    price: '۳,۵۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitRustic,
    productImage: GENERATED_IMAGES.crystaliGold,
    modelType: 'shah-malakeh',
    finish: 'dark-patina',
    products: [
      {
        id: 'prod-mirror-briali',
        name: 'آینه بریالیژی',
        price: '۳,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.crystaliGold,
        productCode: '۱۲۸۹۸۲',
        modelType: 'shah-malakeh',
        finish: 'dark-patina',
      },
      {
        id: 'prod-shah-malakeh',
        name: 'لوستر طبقاتی شاه ملکه',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shahMalakeh,
        productCode: '۱۲۸۹۸۵',
        modelType: 'crystali',
        finish: 'gold-24k',
      },
      {
        id: 'prod-resans',
        name: 'لوستر رسانس گل‌دار آنتیک',
        price: '۱۱,۹۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.resansRoses,
        productCode: '۱۲۸۹۹۰',
        modelType: 'ristani',
        finish: 'antique-bronze',
      },
    ],
    slides: [
      {
        id: 's1-slide-1',
        type: 'multi-product',
        title: 'ست کامل لوسترهای سلطنتی (۳ محصول)',
        subtitle: 'امکان انتخاب بین ۳ محصول در همین استوری',
        mediaUrl: GENERATED_IMAGES.storyPortraitRustic,
        durationSeconds: 45,
        products: [
          {
            id: 'prod-mirror-briali',
            name: 'آینه بریالیژی',
            price: '۳,۵۰۰,۰۰۰ تومان',
            image: GENERATED_IMAGES.crystaliGold,
          },
          {
            id: 'prod-shah-malakeh',
            name: 'لوستر طبقاتی شاه ملکه',
            price: '۱۲,۵۰۰,۰۰۰ تومان',
            image: GENERATED_IMAGES.shahMalakeh,
          },
          {
            id: 'prod-resans',
            name: 'لوستر رسانس گل‌دار آنتیک',
            price: '۱۱,۹۰۰,۰۰۰ تومان',
            image: GENERATED_IMAGES.resansRoses,
          },
        ],
      },
      {
        id: 's1-slide-2',
        type: 'single-product',
        title: 'آباژور کریستالی ۷ میله ای ایتالیایی',
        subtitle: 'استوری تک محصول با نمایش کامل تصویر محصول',
        mediaUrl: GENERATED_IMAGES.storyPortraitPalace,
        durationSeconds: 32,
        products: [
          {
            id: 'prod-crystali',
            name: 'آباژور کریستالی ۷ میله ای ایتالیایی',
            price: '۱۲,۵۰۰,۰۰۰ تومان',
            image: GENERATED_IMAGES.crystaliCherub,
          },
        ],
      },
      {
        id: 's1-slide-3',
        type: 'image-only',
        title: 'نمای تالار پذیرایی فرشته',
        mediaUrl: GENERATED_IMAGES.projectLobbyHotel,
        durationSeconds: 24,
        products: [],
      },
      {
        id: 's1-slide-4',
        type: 'video',
        title: 'ویدیو درخشش کریستال‌های شاه ملکه',
        mediaUrl: GENERATED_IMAGES.storyPortraitAtrium,
        durationSeconds: 58,
        videoDurationSec: 58,
        products: [
          {
            id: 'prod-shah-malakeh',
            name: 'لوستر طبقاتی شاه ملکه ۱۸ شاخه',
            price: '۱۲,۵۰۰,۰۰۰ تومان',
            image: GENERATED_IMAGES.shahMalakeh,
          },
        ],
      },
      {
        id: 's1-slide-5',
        type: 'image-only',
        title: 'نمای پنت‌هاوس دوبلکس الهیه',
        mediaUrl: GENERATED_IMAGES.projectDuplexVilla,
        durationSeconds: 28,
        products: [],
      },
    ],
  },
  {
    id: 'story-2',
    title: 'آباژور درجه یک',
    fullTitle: 'آباژور کریستالی ۷ میله ای ایتالیایی',
    subtitle: 'استوری تک محصول با نمای کامل و بدون برش',
    category: 'abalour',
    categoryLabel: 'آباژور و کنار سالنی',
    storyType: 'single-product',
    durationSeconds: 38,
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    hasDashedRing: false,
    image: GENERATED_IMAGES.storyPortraitPalace,
    productImage: GENERATED_IMAGES.crystaliCherub,
    modelType: 'crystali',
    finish: 'gold-24k',
    products: [
      {
        id: 'prod-crystali',
        name: 'آباژور کریستالی ۷ میله ای ایتالیایی',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.crystaliCherub,
      },
    ],
  },
  {
    id: 'story-3',
    title: 'آینه بریالیژی',
    fullTitle: 'نمای تالار هتل مجلل',
    subtitle: 'استوری تک عکسی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'image-only',
    durationSeconds: 26,
    image: GENERATED_IMAGES.projectLobbyHotel,
    modelType: 'ristani',
    finish: 'antique-bronze',
    products: [],
  },
  {
    id: 'story-4',
    title: 'لوستر ملکه ۵ شا...',
    fullTitle: 'ویدیو بررسی درخشش لوستر ملکه ۵ شاخه',
    subtitle: 'نمای ویدئویی از تراش کریستال‌ها و بدنه برنزی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'video',
    durationSeconds: 55,
    price: '۱۴,۲۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitPalace,
    productImage: GENERATED_IMAGES.shahMalakeh,
    modelType: 'shah-malakeh',
    finish: 'dark-patina',
    products: [
      {
        id: 'prod-shah-malakeh',
        name: 'لوستر ملکه ۵ شاخه و طبقاتی',
        price: '۱۴,۲۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shahMalakeh,
      },
    ],
  },
  {
    id: 'story-5',
    title: 'لوستر رز طلا',
    fullTitle: 'لوستر رز طلا کلکسیون کلاسیک',
    subtitle: 'ترکیب اصالت برنز ایرانی و درخشش کریستال شامپاینی',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'single-product',
    durationSeconds: 50,
    simulateLoading: true,
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitAtrium,
    productImage: GENERATED_IMAGES.crystaliGold,
    modelType: 'crystali',
    finish: 'gold-24k',
    products: [
      {
        id: 'prod-crystali',
        name: 'لوستر رز طلا کلکسیون کلاسیک',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.crystaliGold,
      },
    ],
  },
  {
    id: 'story-6',
    title: 'دکواتیو میز',
    fullTitle: 'نمای تالار پذیرایی سلطنتی',
    subtitle: 'استوری تک عکسی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'image-only',
    durationSeconds: 30,
    image: GENERATED_IMAGES.projectRoyalRestaurant,
    modelType: 'emerald-hero',
    finish: 'antique-bronze',
    products: [],
  },
  {
    id: 'story-7',
    title: 'رسانس نقره ای',
    fullTitle: 'لوستر رسانس نقره ای گل‌دار',
    subtitle: 'مناسب دکوراسیون‌های نئوکلاسیک و مدرن',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'single-product',
    durationSeconds: 42,
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.projectFereshteh,
    productImage: GENERATED_IMAGES.resansRoses,
    modelType: 'ristani',
    finish: 'royal-silver',
    products: [
      {
        id: 'prod-resans',
        name: 'لوستر رسانس نقره ای گل‌دار',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.resansRoses,
      },
    ],
  },
  {
    id: 'story-8',
    title: 'لوستر ماتاردان',
    fullTitle: 'لوستر ماتاردان لاله زمردی (۲ محصول)',
    subtitle: 'شید مشکی سلطنتی با کریستال‌های زمرد سبز',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'multi-product',
    durationSeconds: 48,
    price: '۱۶,۹۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.projectDuplexVilla,
    productImage: GENERATED_IMAGES.shahMalakeh,
    modelType: 'emerald-hero',
    finish: 'antique-bronze',
    products: [
      {
        id: 'prod-shah-malakeh',
        name: 'لوستر ماتاردان لاله زمردی',
        price: '۱۶,۹۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shahMalakeh,
      },
      {
        id: 'prod-12-shakheh',
        name: 'دیوارکوب ست ماتاردان',
        price: '۴,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shakheh12,
      },
    ],
  },
  {
    id: 'story-9',
    title: 'لوستر ۱۲ شاخه',
    fullTitle: 'لوستر ۱۲ شاخه تک برنزی',
    subtitle: 'مخصوص سالن‌های پذیرایی بزرگ و لابی‌ها',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'single-product',
    durationSeconds: 34,
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.heroBanner,
    productImage: GENERATED_IMAGES.shakheh12,
    modelType: '12-shakheh',
    finish: 'antique-bronze',
    products: [
      {
        id: 'prod-12-shakheh',
        name: 'لوستر ۱۲ شاخه تک برنزی',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shakheh12,
      },
    ],
  },
  {
    id: 'story-10',
    title: 'لامپ کم مص...',
    fullTitle: 'نورپردازی شبستان مسجد جامع',
    subtitle: 'طراحی و اجرای لوسترهای عظیم گنبدی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'image-only',
    durationSeconds: 22,
    image: GENERATED_IMAGES.projectMosqueDome,
    modelType: 'shah-malakeh',
    finish: 'antique-bronze',
    products: [],
  },
  {
    id: 'story-11',
    title: 'لوستر فرشته طلا',
    fullTitle: 'لوستر کریستالی طرح فرشته طلایی',
    subtitle: 'مجسمه برنزی دست‌ساز با منشورهای کریستال شامپاینی',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'single-product',
    durationSeconds: 40,
    price: '۱۳,۸۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitPalace,
    productImage: GENERATED_IMAGES.crystaliCherub,
    modelType: 'crystali',
    finish: 'gold-24k',
    products: [
      {
        id: 'prod-crystali',
        name: 'لوستر کریستالی طرح فرشته طلایی',
        price: '۱۳,۸۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.crystaliCherub,
      },
    ],
  },
  {
    id: 'story-12',
    title: 'لوستر ریستانی',
    fullTitle: 'ویدیو مراحل ریخته‌گری و آبکاری لوستر ریستانی',
    subtitle: 'تولید تخصصی در کارگاه مرکزی لوستر اکبر صالحی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'video',
    durationSeconds: 59,
    price: '۱۱,۹۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitRustic,
    productImage: GENERATED_IMAGES.ristani,
    modelType: 'ristani',
    finish: 'antique-bronze',
    products: [
      {
        id: 'prod-ristani',
        name: 'لوستر ریستانی ۱۰ شاخه آنتیک',
        price: '۱۱,۹۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.ristani,
      },
    ],
  },
  {
    id: 'story-13',
    title: 'دیوارکوب برنزی',
    fullTitle: 'ست دیوارکوب و آباژور برنزی (۲ محصول)',
    subtitle: 'ست مکمل لوسترهای کلکسیون اکبر صالحی',
    category: 'abalour',
    categoryLabel: 'آباژور و کنار سالنی',
    storyType: 'multi-product',
    durationSeconds: 36,
    price: '۴,۲۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitAtrium,
    productImage: GENERATED_IMAGES.resansRoses,
    modelType: 'ristani',
    finish: 'antique-bronze',
    products: [
      {
        id: 'prod-resans',
        name: 'دیوارکوب دو شاخه برنزی',
        price: '۴,۲۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.resansRoses,
      },
      {
        id: 'prod-crystali',
        name: 'آباژور رومیزی ست برنزی',
        price: '۵,۸۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.crystaliCherub,
      },
    ],
  },
  {
    id: 'story-14',
    title: 'لوستر تالاری ۲۴...',
    fullTitle: 'نمای عمارت کلاسیک فرشته',
    subtitle: 'ویژه سقف‌های دوبلکس، لابی هتل و تالارهای مجلل',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'image-only',
    durationSeconds: 29,
    image: GENERATED_IMAGES.projectFereshteh,
    modelType: 'shah-malakeh',
    finish: 'dark-patina',
    products: [],
  },
  {
    id: 'story-15',
    title: 'شمعدان لاله عباسی',
    fullTitle: 'شمعدان لاله عباسی برنز و کریستال',
    subtitle: 'تراش دست‌ساز با پایه تمام برنز سنگین',
    category: 'abalour',
    categoryLabel: 'آباژور و کنار سالنی',
    storyType: 'single-product',
    durationSeconds: 44,
    price: '۵,۶۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.projectLobbyHotel,
    productImage: GENERATED_IMAGES.crystaliGold,
    modelType: 'emerald-hero',
    finish: 'gold-24k',
    products: [
      {
        id: 'prod-crystali',
        name: 'شمعدان لاله عباسی برنز و کریستال',
        price: '۵,۶۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.crystaliGold,
      },
    ],
  },
  {
    id: 'story-16',
    title: 'لوستر نئوکلاسیک',
    fullTitle: 'لوستر نئوکلاسیک ۸ شاخه شیددار',
    subtitle: 'مناسب اتاق خواب مستر و نشیمن‌های مدرن',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'single-product',
    durationSeconds: 31,
    price: '۱۰,۴۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.projectRoyalRestaurant,
    productImage: GENERATED_IMAGES.shakheh12,
    modelType: '12-shakheh',
    finish: 'royal-silver',
    products: [
      {
        id: 'prod-12-shakheh',
        name: 'لوستر نئوکلاسیک ۸ شاخه شیددار',
        price: '۱۰,۴۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shakheh12,
      },
    ],
  },
  {
    id: 'story-17',
    title: 'آینه و کنسول',
    fullTitle: 'ست کامل آینه بریالیژی و شمعدان (۳ محصول)',
    subtitle: 'سنگ مرمر طبیعی با بدنه برنز ریخته‌گری',
    category: 'mirror-console',
    categoryLabel: 'آینه و کنسول',
    storyType: 'multi-product',
    durationSeconds: 52,
    price: '۱۸,۴۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitRustic,
    productImage: GENERATED_IMAGES.ristani,
    modelType: 'ristani',
    finish: 'antique-bronze',
    products: [
      {
        id: 'prod-ristani',
        name: 'آینه بریالیژی و کنسول',
        price: '۱۸,۴۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.ristani,
      },
      {
        id: 'prod-resans',
        name: 'جفت شمعدان لاله عباسی',
        price: '۶,۸۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.resansRoses,
      },
      {
        id: 'prod-crystali-gold',
        name: 'ساعت ایستاده برنزی ست',
        price: '۹,۲۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.crystaliGold,
      },
    ],
  },
  {
    id: 'story-18',
    title: 'لوستر کریستالی ملکه',
    fullTitle: 'لوستر کریستالی ملکه سفید (۳ محصول)',
    subtitle: 'گل‌های سرامیکی دست‌ساز با آبکاری آنتیک',
    category: 'chandeliers',
    categoryLabel: 'کلکسیون لوستر',
    storyType: 'multi-product',
    durationSeconds: 46,
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.storyPortraitPalace,
    productImage: GENERATED_IMAGES.resansRoses,
    modelType: 'ristani',
    finish: 'antique-bronze',
    products: [
      {
        id: 'prod-resans',
        name: 'لوستر کریستالی ملکه سفید',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.resansRoses,
      },
      {
        id: 'prod-shah-malakeh',
        name: 'لوستر شاه ملکه ۱۶ شاخه',
        price: '۱۸,۹۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shahMalakeh,
      },
      {
        id: 'prod-12-shakheh',
        name: 'لوستر ۱۲ شاخه کلاسیک',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shakheh12,
      },
    ],
  },
  {
    id: 'story-19',
    title: 'پنت‌هاوس الهیه',
    fullTitle: 'نمای داخلی پروژه پنت‌هاوس الهیه',
    subtitle: 'اجرای نورپردازی کلاسیک',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'image-only',
    durationSeconds: 27,
    image: GENERATED_IMAGES.projectDuplexVilla,
    modelType: 'crystali',
    finish: 'gold-24k',
    products: [],
  },
  {
    id: 'story-20',
    title: 'پروژه فرمانیه',
    fullTitle: 'ویدیو اجرای اختصاصی پروژه مسکونی فرمانیه',
    subtitle: 'نصب تخصصی لوسترهای سفارشی کلکسیون صالحی',
    category: 'video-projects',
    categoryLabel: 'ویدیو و پروژه‌ها',
    storyType: 'video',
    durationSeconds: 54,
    price: '۱۲,۵۰۰,۰۰۰ تومان',
    image: GENERATED_IMAGES.projectRoyalRestaurant,
    productImage: GENERATED_IMAGES.shahMalakeh,
    modelType: 'shah-malakeh',
    finish: 'dark-patina',
    products: [
      {
        id: 'prod-shah-malakeh',
        name: 'لوستر سفارشی پروژه فرمانیه',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        image: GENERATED_IMAGES.shahMalakeh,
      },
    ],
  },
];

export interface CategoryItem {
  id: string;
  title: string;
  countText: string;
  filterKey: string;
  slug: string;
}

/**
 * ۴ کارت دسته‌بندی محصولات (هر کدام ۴۰ محصول مطابق عکس اول)
 */
export const PRODUCT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-chandeliers',
    title: 'کلکسیون لوستر ها',
    countText: '۱۸ محصول',
    filterKey: 'all',
    slug: 'chandeliers',
  },
  {
    id: 'cat-single-branch',
    title: 'کلکسیون تک شاخه ها',
    countText: '۱۴ محصول',
    filterKey: 'single',
    slug: 'single-branch',
  },
  {
    id: 'cat-mirror-console',
    title: 'کلکسیون آینه و کنسول',
    countText: '۱۰ محصول',
    filterKey: 'mirror',
    slug: 'mirror-console',
  },
  {
    id: 'cat-lampshade',
    title: 'کلکسیون آباژور',
    countText: '۱۲ محصول',
    filterKey: 'abalour',
    slug: 'abalour',
  },
];

export interface ChandelierProduct {
  id: string;
  name: string;
  subtitle: string;
  priceFormatted: string;
  priceNumeric: number;
  productCode: string;
  image: string;
  modelType: ChandelierModelType;
  defaultFinish: FinishType;
  categoryKey: string;
  isHighlightedDefault?: boolean;
  outOfStock?: boolean;
  mobileOutOfStock?: boolean;
  hasSnappPay?: boolean;
  cardFinishOverride?: FinishType;
  dimensions: string;
  branchesCount: string;
  bodyMaterial: string;
  warranty: string;
  description: string;
}

/**
 * لیست محصولات کلکسیون صالحی و پرفروش‌ترین‌ها (مطابق عکس دوم و سوم)
 */
export const SALEHI_COLLECTION_PRODUCTS: ChandelierProduct[] = [
  {
    id: 'prod-crystali',
    name: 'لوستر کریستالی',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۶,۴۰۰,۰۰۰ تومان',
    priceNumeric: 16400000,
    productCode: '۱۲۸۹۸۲',
    image: GENERATED_IMAGES.crystaliCherub,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    categoryKey: 'all',
    dimensions: 'قطر ۸۵ سانتی‌متر × ارتفاع ۹۵ سانتی‌متر',
    branchesCount: '۱۲ شاخه (قابل سفارش از ۶ تا ۲۴ شاخه)',
    bodyMaterial: 'برنز خالص ریخته‌گری با آبکاری طلای ۲۴ عیار و کریستال شامپاینی',
    warranty: '۱۰ سال ضمانت کتبی ثبات رنگ و اصالت برنز',
    description:
      'لوستر کریستالی کلکسیون صالحی با ترکیب بی‌نظیر شاخه‌های برنزی آبکاری طلا و مجسمه فرشته کلاسیک، جلوه‌ای درخشان و اشرافی به فضای پذیرایی و اتاق خواب کلاسیک می‌بخشد.',
  },
  {
    id: 'prod-resans',
    name: 'لوستر رسانس',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۱,۸۰۰,۰۰۰ تومان',
    priceNumeric: 11800000,
    productCode: '۱۲۸۹۸۵',
    image: GENERATED_IMAGES.resansRoses,
    modelType: 'ristani',
    defaultFinish: 'antique-bronze',
    categoryKey: 'mirror',
    isHighlightedDefault: true,
    dimensions: 'قطر ۸۰ سانتی‌متر × ارتفاع ۱۰۰ سانتی‌متر',
    branchesCount: '۱۰ شاخه دو طبقه (قابل سفارشی‌سازی)',
    bodyMaterial: 'برنز آنتیک قلم‌زنی شده با گل‌های چینی سفید و منشورهای کریستال',
    warranty: '۱۰ سال ضمانت کتبی گالری لوستر اکبر صالحی',
    description:
      'لوستر رسانس با طراحی کلاسیک، گل‌های سفید ظریف و انحنای چشم‌نواز شاخه‌ها، یکی از محبوب‌ترین انتخاب‌ها برای سالن‌های پذیرایی با چیدمان کلاسیک و نئوکلاسیک است.',
  },
  {
    id: 'prod-12-shakheh',
    name: 'لوستر ۱۲ شاخه تک',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۴,۲۰۰,۰۰۰ تومان',
    priceNumeric: 14200000,
    productCode: '۱۲۸۹۸۸',
    image: GENERATED_IMAGES.shakheh12,
    modelType: '12-shakheh',
    defaultFinish: 'antique-bronze',
    categoryKey: 'single',
    outOfStock: true,
    dimensions: 'قطر ۹۰ سانتی‌متر × ارتفاع ۸۵ سانتی‌متر',
    branchesCount: '۱۲ شاخه تک طبقه اصیل',
    bodyMaterial: 'برنز سنگین قالب‌گیری سنتی با آبکاری آنتیک',
    warranty: '۱۰ سال ضمانت کتبی ثبات آبکاری',
    description:
      'لوستر ۱۲ شاخه تک با شاخه‌های پرکار برنزی و سرپیچ‌های شمعی کلاسیک، نورپردازی یکنواخت، گرم و باشکوهی را برای فضاهای نشیمن و بالای میز ناهارخوری فراهم می‌سازد.',
  },
  {
    id: 'prod-shah-malakeh',
    name: 'لوستر شاه ملکه',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceFormatted: '۱۹,۵۰۰,۰۰۰ تومان',
    priceNumeric: 19500000,
    productCode: '۱۲۸۹۹۱',
    image: GENERATED_IMAGES.shahMalakeh,
    modelType: 'shah-malakeh',
    defaultFinish: 'dark-patina',
    categoryKey: 'abalour',
    dimensions: 'قطر ۱۱۰ سانتی‌متر × ارتفاع ۱۴۰ سانتی‌متر',
    branchesCount: '۱۸ شاخه سه طبقه شاهانه با شید مشکی و کرم',
    bodyMaterial: 'برنز سیاه‌قلم و طلایی همراه با شید پارچه‌ای و ریسه کریستال',
    warranty: '۱۵ سال ضمانت ویژه کلکسیون شاه ملکه',
    description:
      'لوستر طبقاتی شاه ملکه، شاهکار کلکسیون اکبر صالحی با ۳ طبقه شاخه مجلل، شیدهای دست‌دوز و صدها آویز کریستالی برای سقف‌های بلند، دوبلکس و تالارهای مجلل.',
  },
];

export interface ExecutedProject {
  id: string;
  slug?: string;
  sampleCode: string;
  district: string;
  categoryTab: string;
  title: string;
  description: string;
  usedChandeliersText: string;
  mainImage: string;
  galleryImages: string[];
  usedProducts: {
    id: string;
    name: string;
    price: string;
    productId: string;
  }[];
}

export const PROJECT_TABS = [
  { id: 'gov', label: 'ارگان های دولتی' },
  { id: 'commercial', label: 'ارگان های تجاری' },
  { id: 'mosques', label: 'مساجد ایران' },
  { id: 'restaurants', label: 'رستوران های بزرگ' },
  { id: 'residential', label: 'منازل مسکونی' },
];

/**
 * پروژه‌های اجرایی تفکیک‌شده برای هر ۵ تب (استپ) و ۴ نمونه مجزا در هر تب
 * با عناوین، توضیحات، لوسترهای استفاده‌شده و تصاویر متفاوت
 */
export const EXECUTED_PROJECTS: ExecutedProject[] = [
  // ==================== ۱. ارگان های دولتی (gov) ====================
  {
    id: 'gov-1',
    sampleCode: 'نمونه ۱',
    district: 'منطقه جردن',
    categoryTab: 'gov',
    title: 'پروژه ساختمان دیپلماتیک جردن',
    description:
      'در طراحی روشنایی سالن تشریفات و جلسات ساختمان دیپلماتیک جردن، از لوسترهای برنزی کلاسیک با آبکاری طلای ۲۴ عیار استفاده شده است تا ضمن تامین نور استاندارد، شکوه معماری نئوکلاسیک فضا حفظ گردد.',
    usedChandeliersText:
      'ترکیب لوسترهای ۱۲ شاخه دوبل در مرکز سالن به همراه دیوارکوب‌های هم‌خانواده در ستون‌های جانبی، هارمونی بی‌نظیری ایجاد کرده است.',
    mainImage: GENERATED_IMAGES.projectLobbyHotel,
    galleryImages: [
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.heroBanner,
    ],
    usedProducts: [
      {
        id: 'up-gov-1a',
        name: 'لوستر کریستالی سلطنتی ۱۲ شاخه',
        price: '۲۴,۸۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
      {
        id: 'up-gov-1b',
        name: 'لوستر ۱۲ شاخه تک برنزی',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
    ],
  },
  {
    id: 'gov-2',
    sampleCode: 'نمونه ۲',
    district: 'منطقه کیانی شمالی',
    categoryTab: 'gov',
    title: 'پروژه تالار همایش کیانی شمالی',
    description:
      'برای سقف بلند تالار همایش کیانی شمالی، لوسترهای طبقاتی لاله زمردی و برنز آنتیک به صورت سفارشی طراحی و با نردبان هیدرولیکی ۱۲ متری توسط تیم فنی گالری اکبر صالحی نصب گردید.',
    usedChandeliersText:
      'در این پروژه از لوسترهای پرشاخه با شیدهای دست‌دوز و کریستال‌های منشوری ضد خیرگی چشم استفاده شده است.',
    mainImage: GENERATED_IMAGES.projectRoyalRestaurant,
    galleryImages: [
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectDuplexVilla,
    ],
    usedProducts: [
      {
        id: 'up-gov-2a',
        name: 'لوستر طبقاتی شاه ملکه ۱۸ شاخه',
        price: '۳۸,۹۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
      {
        id: 'up-gov-2b',
        name: 'لوستر رسانس ۱۰ شاخه آنتیک',
        price: '۱۵,۲۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
    ],
  },
  {
    id: 'gov-3',
    sampleCode: 'نمونه ۳',
    district: 'منطقه فرمانیه',
    categoryTab: 'gov',
    title: 'پروژه فرمانیه',
    description:
      'معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه اگر تمام محصولات از یک خانواده انتخاب شود، یکپارچگی محصولات روشنایی پروژه حفظ میشود و جلوه‌ای اصیل به تالارهای رسمی می‌بخشد.',
    usedChandeliersText:
      'معمولا برای فضا های نشیمن لوستر های گرد و بالای میز های پذیرایی دیزاین کشیده و لاینر استفاده میشود، البته که بمانند این پروژه تمام محصولات از یک خانواده انتخاب شده‌اند.',
    mainImage: GENERATED_IMAGES.projectFereshteh,
    galleryImages: [
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.heroBanner,
    ],
    usedProducts: [
      {
        id: 'up-gov-3a',
        name: 'لوستر ملکه شاه ۱۲ شاخه تک',
        price: '۱۲,۴۶۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
      {
        id: 'up-gov-3b',
        name: 'آباژور صاف کریستالی',
        price: '۳۴,۵۸۲,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
    ],
  },
  {
    id: 'gov-4',
    sampleCode: 'نمونه ۴',
    district: 'منطقه خراسانیه',
    categoryTab: 'gov',
    title: 'پروژه خراسانیه',
    description:
      'در پروژه مجموعه اداری و تشریفاتی خراسانیه، تمرکز اصلی بر استفاده از لوسترهای تمام‌برنز با گل‌های چینی سفید و کریستال‌های شامپاینی بوده است تا نورپردازی گرم و رسمی در تمامی سالن‌ها برقرار شود.',
    usedChandeliersText:
      'استفاده همزمان از لوسترهای سقفی کلکسیون صالحی و آباژورهای ست کنار سالنی، تقارن نوری کاملی در این مجموعه ایجاد کرده است.',
    mainImage: GENERATED_IMAGES.projectDuplexVilla,
    galleryImages: [
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectLobbyHotel,
    ],
    usedProducts: [
      {
        id: 'up-gov-4a',
        name: 'لوستر رسانس گل‌دار سفید',
        price: '۱۴,۸۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
      {
        id: 'up-gov-4b',
        name: 'لوستر کریستالی فرشته‌دار',
        price: '۱۹,۶۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
    ],
  },

  // ==================== ۲. ارگان های تجاری (commercial) ====================
  {
    id: 'com-1',
    sampleCode: 'نمونه ۱',
    district: 'برج تجاری الهیه',
    categoryTab: 'commercial',
    title: 'پروژه لابی برج تجاری الهیه',
    description:
      'لابی ورودی برج تجاری الهیه با ارتفاع سقف ۶.۵ متر نیازمند لوستری شاخص و خیره‌کننده بود که در بدو ورود نگاه مراجعین را مجذوب خود سازد. لوستر سه طبقه شاه ملکه با آبکاری سیاه‌قلم و طلایی برای این فضا اختصاصی‌سازی شد.',
    usedChandeliersText:
      'در کنار لوستر مرکزی لابی، ۶ عدد دیوارکوب برنزی و ۲ آباژور ایستاده در بخش انتظار VIP نصب گردیده است.',
    mainImage: GENERATED_IMAGES.projectLobbyHotel,
    galleryImages: [
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectFereshteh,
    ],
    usedProducts: [
      {
        id: 'up-com-1a',
        name: 'لوستر شاه ملکه ۲۴ شاخه لابی',
        price: '۴۲,۰۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
      {
        id: 'up-com-1b',
        name: 'لوستر کریستالی طلایی الهیه',
        price: '۱۸,۵۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
    ],
  },
  {
    id: 'com-2',
    sampleCode: 'نمونه ۲',
    district: 'مرکز خرید زعفرانیه',
    categoryTab: 'commercial',
    title: 'پروژه گالری جواهرات زعفرانیه',
    description:
      'در گالری‌های لوکس و مراکز تجاری زعفرانیه، شاخص نمود رنگ (CRI) و درخشش منشورهای کریستال اهمیت دوچندانی دارد. لوسترهای کریستالی شامپاینی صالحی بازتاب نوری الماس‌گونه در فضای گالری ایجاد کرده‌اند.',
    usedChandeliersText:
      'چیدمان خطی سه دستگاه لوستر کریستالی بالای ویترین‌های مرکزی، جلوه جواهرات و دکوراسیون داخلی را دوچندان نموده است.',
    mainImage: GENERATED_IMAGES.projectDuplexVilla,
    galleryImages: [
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectRoyalRestaurant,
    ],
    usedProducts: [
      {
        id: 'up-com-2a',
        name: 'لوستر کریستالی آبکاری طلا ۲۴ عیار',
        price: '۲۱,۴۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
      {
        id: 'up-com-2b',
        name: 'لوستر رسانس نقره‌ای کروم',
        price: '۱۳,۹۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
    ],
  },
  {
    id: 'com-3',
    sampleCode: 'نمونه ۳',
    district: 'هتل رویال سعادت‌آباد',
    categoryTab: 'commercial',
    title: 'پروژه لابی هتل پنج‌ستاره سعادت‌آباد',
    description:
      'پروژه روشنایی لابی و سالن پذیرش هتل رویال سعادت‌آباد با استفاده از لوسترهای ۱۲ شاخه و ۱۶ شاخه ریخته‌گری برنز خالص اجرا شده و دارای ۱۰ سال ضمانت کتبی ثبات رنگ در برابر رطوبت و حرارت است.',
    usedChandeliersText:
      'تمامی سرپیچ‌ها و سیم‌کشی‌های داخلی این پروژه از قطعات نسوز استاندارد هتلی برای روشن ماندن ۲۴ ساعته انتخاب شده‌اند.',
    mainImage: GENERATED_IMAGES.projectRoyalRestaurant,
    galleryImages: [
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.heroBanner,
    ],
    usedProducts: [
      {
        id: 'up-com-3a',
        name: 'لوستر ۱۲ شاخه تک برنزی سنگین',
        price: '۱۶,۸۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
      {
        id: 'up-com-3b',
        name: 'لوستر شاه ملکه شید مشکی',
        price: '۲۹,۵۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
    ],
  },
  {
    id: 'com-4',
    sampleCode: 'نمونه ۴',
    district: 'مجتمع اداری ولنجک',
    categoryTab: 'commercial',
    title: 'پروژه سالن کنفرانس برج ولنجک',
    description:
      'برای اتاق هیئت‌مدیره و سالن کنفرانس برج تجاری ولنجک، لوسترهای نئوکلاسیک ریستانی با پخش نور متعادل و بدون خیرگی روی میز کنفرانس طراحی و نصب گردید.',
    usedChandeliersText:
      'هارمونی رنگ برنز آنتیک لوسترها با دیوارپوش‌های چوب گردو، فضایی باوقار و رسمی برای جلسات مدیریتی فراهم آورده است.',
    mainImage: GENERATED_IMAGES.heroBanner,
    galleryImages: [
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectLobbyHotel,
    ],
    usedProducts: [
      {
        id: 'up-com-4a',
        name: 'لوستر ریستانی کلاسیک ۱۰ شاخه',
        price: '۱۴,۲۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
      {
        id: 'up-com-4b',
        name: 'لوستر ۱۲ شاخه برنز آنتیک',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
    ],
  },

  // ==================== ۳. مساجد ایران (mosques) ====================
  {
    id: 'mos-1',
    sampleCode: 'نمونه ۱',
    district: 'مسجد جامع فخرآباد',
    categoryTab: 'mosques',
    title: 'پروژه شبستان مسجد جامع فخرآباد',
    description:
      'گالری لوستر اکبر صالحی افتخار طراحی، ساخت و نصب لوسترهای عظیم شبستان مسجد جامع فخرآباد را در کارنامه ۱۸ ساله خود دارد. این لوسترها با ساختار تمام‌برنز تقویت‌شده و لاله‌های اسلامی سبز و طلایی ساخته شده‌اند.',
    usedChandeliersText:
      'مهار مهندسی لوسترهای سنگین به سازه اصلی گنبد با زنجیرهای فولادی آبکاری برنز و رعایت کامل اصول ایمنی انجام شده است.',
    mainImage: GENERATED_IMAGES.projectMosqueDome,
    galleryImages: [
      GENERATED_IMAGES.projectMosqueDome,
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectRoyalRestaurant,
    ],
    usedProducts: [
      {
        id: 'up-mos-1a',
        name: 'لوستر تالاری و مسجدی ۳۶ شاخه زمردی',
        price: '۶۵,۰۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
      {
        id: 'up-mos-1b',
        name: 'لوستر ۱۲ شاخه برنزی شبستان',
        price: '۱۵,۴۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
    ],
  },
  {
    id: 'mos-2',
    sampleCode: 'نمونه ۲',
    district: 'مسجد چهارده معصوم',
    categoryTab: 'mosques',
    title: 'پروژه گنبد اصلی مسجد چهارده معصوم',
    description:
      'در پروژه نورپردازی مسجد چهارده معصوم، لوسترهای طبقاتی کریستالی و برنزی متناسب با کاشی‌کاری‌های فیروزه‌ای و مقرنس‌کاری‌های سقف طراحی گردید تا جلوه معنوی فضا دوچندان شود.',
    usedChandeliersText:
      'استفاده از سرپیچ‌های سرامیکی نسوز و لامپ‌های شمعی کم‌مصرف گرم، روشنایی یکنواخت و آرامش‌بخشی را در تمام شبستان فراهم کرده است.',
    mainImage: GENERATED_IMAGES.heroBanner,
    galleryImages: [
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectMosqueDome,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectFereshteh,
    ],
    usedProducts: [
      {
        id: 'up-mos-2a',
        name: 'لوستر کریستالی طبقاتی طلایی',
        price: '۴۸,۰۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
      {
        id: 'up-mos-2b',
        name: 'لوستر شاه ملکه سه طبقه',
        price: '۳۶,۵۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
    ],
  },
  {
    id: 'mos-3',
    sampleCode: 'نمونه ۳',
    district: 'مسجد اعظم تجریش',
    categoryTab: 'mosques',
    title: 'پروژه رواق مرکزی مسجد تجریش',
    description:
      'برای رواق‌های تاریخی و سقف‌های بلند مسجد تجریش، لوسترهای برنزی قلم‌زنی‌شده با آبکاری طلای ثابت و آویزهای کریستال تراش‌خورده توسط استادکاران مجموعه صالحی تولید و نصب گردید.',
    usedChandeliersText:
      'تمامی قطعات برنزی این پروژه با لایه محافظ لاک کوره‌ای پوشانده شده‌اند تا در برابر غبار و تغییرات دما کاملاً مقاوم باشند.',
    mainImage: GENERATED_IMAGES.projectLobbyHotel,
    galleryImages: [
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectMosqueDome,
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectRoyalRestaurant,
    ],
    usedProducts: [
      {
        id: 'up-mos-3a',
        name: 'لوستر ۱۲ شاخه تک برنز قلم‌زنی',
        price: '۱۸,۹۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
      {
        id: 'up-mos-3b',
        name: 'لوستر کریستالی سلطنتی',
        price: '۲۲,۰۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
    ],
  },
  {
    id: 'mos-4',
    sampleCode: 'نمونه ۴',
    district: 'مصلی بزرگ ری',
    categoryTab: 'mosques',
    title: 'پروژه تالار محراب مصلی ری',
    description:
      'نصب بیش از ۱۴ دستگاه لوستر پرشاخه هماهنگ در تالار محراب مصلی ری با استفاده از تجهیزات بالابر هیدرولیکی و تیم تخصصی نصب لوستر صالحی در کمترین زمان ممکن به انجام رسید.',
    usedChandeliersText:
      'چیدمان منظم لوسترها در محورهای طولی و عرضی شبستان، توزیع نوری کاملاً مهندسی و بدون سایه ایجاد نموده است.',
    mainImage: GENERATED_IMAGES.projectRoyalRestaurant,
    galleryImages: [
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectMosqueDome,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.heroBanner,
    ],
    usedProducts: [
      {
        id: 'up-mos-4a',
        name: 'لوستر ۱۶ شاخه برنزی مصلی',
        price: '۲۷,۵۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
      {
        id: 'up-mos-4b',
        name: 'لوستر رسانس برنز آنتیک',
        price: '۱۴,۶۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
    ],
  },

  // ==================== ۴. رستوران های بزرگ (restaurants) ====================
  {
    id: 'res-1',
    sampleCode: 'نمونه ۱',
    district: 'رستوران سلطنتی نیاوران',
    categoryTab: 'restaurants',
    title: 'پروژه تالار پذیرایی قصر نیاوران',
    description:
      'در تالار و رستوران سلطنتی نیاوران، نورپردازی گرم و اشتهاآور با درخشش کریستال‌های شامپاینی و شاخه‌های طلایی طراحی شد تا فضایی مجلل و خاطره‌انگیز برای میهمانان رقم بزند.',
    usedChandeliersText:
      'در بالای هر میز VIP یک لوستر ۸ شاخه کریستالی و در مرکز سالن لوستر ۲۴ شاخه شاه ملکه نصب شده است.',
    mainImage: GENERATED_IMAGES.projectRoyalRestaurant,
    galleryImages: [
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectDuplexVilla,
    ],
    usedProducts: [
      {
        id: 'up-res-1a',
        name: 'لوستر شاه ملکه تالاری',
        price: '۳۴,۵۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
      {
        id: 'up-res-1b',
        name: 'لوستر کریستالی شامپاینی',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
    ],
  },
  {
    id: 'res-2',
    sampleCode: 'نمونه ۲',
    district: 'تراس لانژ اقدسیه',
    categoryTab: 'restaurants',
    title: 'پروژه رویال لانژ اقدسیه',
    description:
      'برای فضای نئوکلاسیک رویال لانژ اقدسیه، لوسترهای شیددار مشکی و طلایی با نور ملایم و دیمرپذیر انتخاب شدند تا در ساعات شب اتمسفری لوکس و آرامش‌بخش ایجاد کنند.',
    usedChandeliersText:
      'شیدهای پارچه‌ای دست‌دوز با نوارهای طلایی، نور را به صورت غیرمستقیم و دلنشین بر روی میزهای پذیرایی هدایت می‌کنند.',
    mainImage: GENERATED_IMAGES.heroBanner,
    galleryImages: [
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectFereshteh,
    ],
    usedProducts: [
      {
        id: 'up-res-2a',
        name: 'لوستر ماتاردان شید مشکی',
        price: '۱۹,۸۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
      {
        id: 'up-res-2b',
        name: 'لوستر رسانس نئوکلاسیک',
        price: '۱۳,۲۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
    ],
  },
  {
    id: 'res-3',
    sampleCode: 'نمونه ۳',
    district: 'عمارت سنتی دربند',
    categoryTab: 'restaurants',
    title: 'پروژه سالن VIP عمارت دربند',
    description:
      'در عمارت سنتی و تاریخی دربند، استفاده از لوسترهای برنز آنتیک و سیاه‌قلم با لاله‌های تراش‌خورده، اصالت معماری ایرانی و گچ‌بری‌های دستی سقف را به زیبایی برجسته ساخته است.',
    usedChandeliersText:
      'مقاومت بالای آبکاری برنز صالحی در برابر هوای مرطوب کوهستانی دربند، ماندگاری همیشگی این لوسترها را تضمین کرده است.',
    mainImage: GENERATED_IMAGES.projectLobbyHotel,
    galleryImages: [
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.heroBanner,
      GENERATED_IMAGES.projectMosqueDome,
    ],
    usedProducts: [
      {
        id: 'up-res-3a',
        name: 'لوستر ۱۲ شاخه برنز سیاه‌قلم',
        price: '۱۵,۹۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
      {
        id: 'up-res-3b',
        name: 'لوستر ریستانی آنتیک',
        price: '۱۲,۸۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
    ],
  },
  {
    id: 'res-4',
    sampleCode: 'نمونه ۴',
    district: 'بانکت هال شهرک غرب',
    categoryTab: 'restaurants',
    title: 'پروژه تالار پذیرایی شهرک غرب',
    description:
      'تالار پذیرایی بزرگ شهرک غرب با سقف کناف و یونولیت، توسط تیم مهندسی نصب گالری صالحی با مهار به تیرآهن اصلی سقف و نصب ۸ دستگاه لوستر کریستالی فرشته‌دار تجهیز گردید.',
    usedChandeliersText:
      'درخشش خیره‌کننده کریستال‌ها در زمان عکاسی و فیلم‌برداری مراسم‌ها، جلوه‌ای بی‌نظیر به این تالار بخشیده است.',
    mainImage: GENERATED_IMAGES.projectFereshteh,
    galleryImages: [
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectLobbyHotel,
    ],
    usedProducts: [
      {
        id: 'up-res-4a',
        name: 'لوستر کریستالی طرح فرشته طلایی',
        price: '۲۳,۴۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
      {
        id: 'up-res-4b',
        name: 'لوستر رسانس گل سفید',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
    ],
  },

  // ==================== ۵. منازل مسکونی (residential) ====================
  {
    id: 'home-1',
    sampleCode: 'نمونه ۱',
    district: 'پنت‌هاوس کامرانیه',
    categoryTab: 'residential',
    title: 'پروژه پنت‌هاوس دوبلکس کامرانیه',
    description:
      'در فضای وید (Void) پنت‌هاوس دوبلکس کامرانیه، لوستر طبقاتی شاه ملکه به همراه ست کامل لوستر پذیرایی، لوستر بالای میز ناهارخوری و آباژورهای کنار مبلی از کلکسیون صالحی اجرا شد.',
    usedChandeliersText:
      'انتخاب تمامی المان‌های روشنایی از یک کلکسیون واحد، انسجام و شکوه کم‌نظیری به دکوراسیون داخلی منزل بخشیده است.',
    mainImage: GENERATED_IMAGES.projectDuplexVilla,
    galleryImages: [
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectRoyalRestaurant,
    ],
    usedProducts: [
      {
        id: 'up-home-1a',
        name: 'لوستر شاه ملکه دوبلکس',
        price: '۳۱,۲۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
      {
        id: 'up-home-1b',
        name: 'لوستر ۱۲ شاخه تک پذیرایی',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
    ],
  },
  {
    id: 'home-2',
    sampleCode: 'نمونه ۲',
    district: 'ویلای کلاسیک لواسان',
    categoryTab: 'residential',
    title: 'پروژه عمارت دوبلکس لواسانات',
    description:
      'ارسال با بسته‌بندی ضدضربه و نصب تخصصی لوسترهای کلکسیون صالحی در عمارت دوبلکس لواسانات توسط اکیپ ویژه نصب خارج از شهر تهران انجام پذیرفت.',
    usedChandeliersText:
      'برای سالن اصلی از لوسترهای کریستالی طلایی و برای اتاق‌های خواب مستر از لوسترهای رسانس گل‌دار سفید استفاده شده است.',
    mainImage: GENERATED_IMAGES.projectFereshteh,
    galleryImages: [
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.heroBanner,
    ],
    usedProducts: [
      {
        id: 'up-home-2a',
        name: 'لوستر رسانس گل چینی سفید',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
      {
        id: 'up-home-2b',
        name: 'لوستر کریستالی اتاق خواب',
        price: '۱۰,۸۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
    ],
  },
  {
    id: 'home-3',
    sampleCode: 'نمونه ۳',
    district: 'آپارتمان مدرن فرشته',
    categoryTab: 'residential',
    title: 'پروژه رزیدنس کلاسیک خیابان فرشته',
    description:
      'در واحد ۴۲۰ متری خیابان فرشته، ترکیب گچ‌بری‌های سقف با سه دستگاه لوستر کریستالی هم‌راستا و دیوارکوب‌های برنزی طلایی، فضایی اشرافی و دلنشین را در سالن پذیرایی خلق کرده است.',
    usedChandeliersText:
      'نصب دقیق در مرکز قاب‌های گچ‌بری سقف و تنظیم ارتفاع استاندارد زنجیرها توسط کارشناسان نصب صالحی انجام شده است.',
    mainImage: GENERATED_IMAGES.projectLobbyHotel,
    galleryImages: [
      GENERATED_IMAGES.projectLobbyHotel,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectRoyalRestaurant,
    ],
    usedProducts: [
      {
        id: 'up-home-3a',
        name: 'لوستر کریستالی کلکسیون فرشته',
        price: '۲۶,۴۰۰,۰۰۰ تومان',
        productId: 'prod-crystali',
      },
      {
        id: 'up-home-3b',
        name: 'آباژور کنار سالنی برنز و کریستال',
        price: '۱۴,۹۰۰,۰۰۰ تومان',
        productId: 'prod-shah-malakeh',
      },
    ],
  },
  {
    id: 'home-4',
    sampleCode: 'نمونه ۴',
    district: 'باغ‌ویلا نیاوران',
    categoryTab: 'residential',
    title: 'پروژه سالن پذیرایی باغ‌ویلا نیاوران',
    description:
      'برای سالن پذیرایی و نشیمن خصوصی باغ‌ویلا نیاوران، لوسترهای ۱۲ شاخه تک برنزی با آبکاری آنتیک دست‌ساز انتخاب شدند که هماهنگی فوق‌العاده‌ای با فرش‌های دستباف و مبلمان کلاسیک ایرانی دارند.',
    usedChandeliersText:
      'تمامی لوسترها و کنسول‌های برنزی این پروژه دارای ضمانت‌نامه کتبی ۱۰ ساله گالری اکبر صالحی می‌باشند.',
    mainImage: GENERATED_IMAGES.projectRoyalRestaurant,
    galleryImages: [
      GENERATED_IMAGES.projectRoyalRestaurant,
      GENERATED_IMAGES.projectDuplexVilla,
      GENERATED_IMAGES.projectFereshteh,
      GENERATED_IMAGES.heroBanner,
    ],
    usedProducts: [
      {
        id: 'up-home-4a',
        name: 'لوستر ۱۲ شاخه تک برنز آنتیک',
        price: '۱۲,۵۰۰,۰۰۰ تومان',
        productId: 'prod-12-shakheh',
      },
      {
        id: 'up-home-4b',
        name: 'لوستر ریستانی ۸ شاخه نشیمن',
        price: '۱۱,۲۰۰,۰۰۰ تومان',
        productId: 'prod-resans',
      },
    ],
  },
];

export interface MagazineArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  isDarkButtonDefault?: boolean;
  fullContent: string[];
}

/**
 * مقالات مجله‌های لوستر (دقیقاً مطابق عکس چهارم)
 */
export const MAGAZINE_ARTICLES: MagazineArticle[] = [
  {
    id: 'art-1',
    title: 'لوستر چگونه آبکاری میشود؟',
    excerpt:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با آن استفاده از طراحان گرافیک است، چاپگرها و متون جذاب از آنها برای آزمایشی بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم به ذکر است...',
    date: '۲۵ شهریور ۱۴۰۴',
    image: GENERATED_IMAGES.projectFereshteh,
    fullContent: [
      'فرآیند آبکاری لوسترهای برنزی و کلاسیک یکی از حساس‌ترین مراحل تولید در گالری لوستر اکبر صالحی است. ابتدا قطعات برنزی ریخته‌گری‌شده طی چند مرحله پرداخت‌کاری، چربی‌گیری التراسونیک و اسیدشویی می‌شوند تا سطحی کاملاً صیقلی و آماده جذب یون‌های فلزی به دست آید.',
      'سپس بسته به سفارش مشتری، آبکاری طلای ۲۴ عیار، برنز آنتیک، نقره‌ای کروم یا سیاه‌قلم سلطنتی در وان‌های الکترولیت انجام شده و در نهایت با لایه محافظ لاک الکتروفورز کوره دیده تثبیت می‌شود.',
    ],
  },
  {
    id: 'art-2',
    title: 'لوستر چگونه آبکاری میشود؟',
    excerpt:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با آن استفاده از طراحان گرافیک است، چاپگرها و متون جذاب از آنها برای آزمایشی بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم به ذکر است...',
    date: '۲۵ شهریور ۱۴۰۴',
    image: GENERATED_IMAGES.heroBanner,
    fullContent: [
      'در انتخاب نوع آبکاری لوستر باید به رنگ چوب مبلمان، پرده‌ها و گچ‌بری سقف توجه ویژه داشت. آبکاری آنتیک و طلایی گرمای خاصی به فضاهای کلاسیک ایرانی می‌بخشد.',
      'گالری لوستر صالحی علاوه بر تولید لوسترهای نو، خدمات بازسازی و آبکاری مجدد انواع لوستر، آینه و کنسول و شمعدان‌های قدیمی شما را با کیفیت کارخانه‌ای انجام می‌دهد.',
    ],
  },
  {
    id: 'art-3',
    title: 'لوستر چگونه آبکاری میشود؟',
    excerpt:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با آن استفاده از طراحان گرافیک است، چاپگرها و متون جذاب از آنها برای آزمایشی بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم به ذکر است...',
    date: '۲۵ شهریور ۱۴۰۴',
    image: GENERATED_IMAGES.projectFereshteh,
    isDarkButtonDefault: true,
    fullContent: [
      'نصب لوسترهای سنگین و طبقاتی در سقف‌های کاذب، کناف و یونولیت نیازمند مهارت مهندسی و مهار ایمن به سقف اصلی یا تیرآهن با نردبان هیدرولیکی ۱۲ متری است.',
      'تمامی خدمات بسته‌بندی ضدضربه، حمل تخصصی و نصب کلاب لوستر در محدوده تهران، کرج و لواسانات توسط تکنسین‌های مجرب مجموعه انجام می‌پذیرد.',
    ],
  },
  {
    id: 'art-4',
    title: 'لوستر چگونه آبکاری میشود؟',
    excerpt:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با آن استفاده از طراحان گرافیک است، چاپگرها و متون جذاب از آنها برای آزمایشی بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم به ذکر است...',
    date: '۲۵ شهریور ۱۴۰۴',
    image: GENERATED_IMAGES.heroBanner,
    fullContent: [
      'کریستال‌های به‌کاررفته در لوسترهای کلکسیون صالحی دارای درصد اکسید سرب استاندارد و تراش‌های منشوری دقیق هستند که نور لامپ‌های شمعی را به طیف‌های چشم‌نواز تجزیه می‌کنند.',
    ],
  },
];

/**
 * شماره‌های تماس فوتر (دقیقاً مطابق عکس چهارم)
 */
export const SALEHI_PHONE_NUMBERS = [
  {
    id: 'ph-1',
    branchTitle: 'شریعتی',
    displayPhone: '021-22222635',
    label: 'شریعتی (021-22222635)',
    phone: '02122222635',
    highlighted: false,
  },
  {
    id: 'ph-2',
    branchTitle: 'لاله زار نو',
    displayPhone: '021-33333632',
    label: 'لاله زار نو (021-33333632)',
    phone: '02133333632',
    highlighted: false,
  },
  {
    id: 'ph-3',
    branchTitle: 'غرب بزودی',
    displayPhone: '02144444653',
    label: 'غرب بزودی (02144444653)',
    phone: '02144444653',
    highlighted: false,
  },
  {
    id: 'ph-4',
    branchTitle: 'افسریه',
    displayPhone: '021-33459665',
    label: 'افسریه (021-33459665)',
    phone: '02133459665',
    highlighted: true,
  },
  {
    id: 'ph-5',
    branchTitle: 'همراه',
    displayPhone: '0912-3779149',
    label: 'همراه (0912-3779149)',
    phone: '09123779149',
    highlighted: false,
  },
];
