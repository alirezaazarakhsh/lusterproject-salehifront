import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Layers,
  Building2,
  FileText,
  MessageSquare,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  LogOut,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Phone,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  KeyRound,
  PlayCircle,
  Settings,
  Save,
  Upload,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Image,
  Search,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { navigateToRoute, navigateToProjectSlug } from '../utils/navigation';
import { GENERATED_IMAGES } from '../data/chandelierData';
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
import {
  apiFetchWithFallback,
  normalizeAdminPhoneClient,
  isUsingFallbackMode,
  INITIAL_MAIN_SETTINGS,
  INITIAL_SMS_SETTINGS,
  INITIAL_FAQ_SETTINGS,
} from '../utils/localBackendFallback';

interface AdminPanelSectionProps {
  onCatalogUpdated?: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'admins'
  | 'products'
  | 'categories'
  | 'projects'
  | 'stories'
  | 'articles'
  | 'messages'
  | 'orders'
  | 'settings';

type WebsiteSettingsSubTab =
  | 'main'
  | 'sms'
  | 'faq'
  | 'hero_slider'
  | 'about'
  | 'contact'
  | 'footer';

interface AdminSessionUser {
  id: number;
  uid: string;
  phone: string;
  email: string;
  displayName: string;
  role: string;
  password?: string;
  avatarUrl?: string;
  permissions?: string[];
  permissionsJson?: string;
}

const ADMIN_TOKEN_STORAGE_KEY = 'salehi_admin_session_token';
const ADMIN_USER_STORAGE_KEY = 'salehi_admin_session_user';
const ADMIN_SESSION_START_KEY = 'salehi_admin_session_start_ts';
const ADMIN_LAST_ACTIVITY_KEY = 'salehi_admin_last_activity_ts';

// مهلت حضور در پنل: ۱۰ دقیقه عدم فعالیت و حداکثر ۳۰ دقیقه نشست کامل
const ADMIN_INACTIVITY_LIMIT_MS = 10 * 60 * 1000;
const ADMIN_MAX_SESSION_LIMIT_MS = 30 * 60 * 1000;

const DEFAULT_ADMIN_AVATAR_URL =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';

const PRESET_ADMIN_AVATARS = [
  {
    label: 'پرتره مدیر ارشد ۱ (رسمی)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'پرتره مدیر فروش ۲',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'پرتره مدیر اجرایی ۳',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'پرتره کارشناس محتوا ۴',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'تصویر نشان طلایی گالری صالحی',
    url: GENERATED_IMAGES.crystaliCherub,
  },
];

const ALL_ADMIN_PERMISSION_ITEMS: { id: AdminTab; label: string; desc: string }[] = [
  { id: 'dashboard', label: 'داشبورد کلی', desc: 'مشاهده آمار و خلاصه وضعیت سایت' },
  { id: 'admins', label: 'مدیریت ادمین‌ها', desc: 'افزودن، ویرایش و تعیین دسترسی مدیران' },
  { id: 'products', label: 'مدیریت محصولات', desc: 'ثبت، ویرایش و قیمت‌گذاری لوسترها' },
  { id: 'categories', label: 'دسته‌بندی‌ها', desc: 'مدیریت کالکشن‌ها و دسته‌بندی محصولات' },
  { id: 'projects', label: 'پروژه‌های اجرایی', desc: 'مدیریت پروژه‌های مسکونی، تجاری و تالارها' },
  { id: 'stories', label: 'استوری‌های سایت', desc: 'مدیریت دسته‌بندی استوری و انتشار در سایت' },
  { id: 'articles', label: 'مجله و مقالات', desc: 'انتشار و ویرایش مطالب آموزشی مجله' },
  { id: 'messages', label: 'پیام‌های تماس', desc: 'بررسی پیام‌ها و درخواست‌های مشاوره' },
  { id: 'orders', label: 'سفارشات مشتریان', desc: 'مدیریت فاکتورها و وضعیت سفارشات خرید' },
  { id: 'settings', label: 'تنظیمات وب سایت', desc: 'تنظیمات اصلی، پیامک، صفحات و فوتر سایت' },
];

const WEBSITE_SETTINGS_SUBTABS: { id: WebsiteSettingsSubTab; label: string }[] = [
  { id: 'main', label: 'تب تنظیمات اصلی' },
  { id: 'sms', label: 'تب تنظیمات پنل پیامک' },
  { id: 'faq', label: 'تب تنظیمات سوالات متداول صفحات' },
  { id: 'hero_slider', label: 'تب تنظیم اسلایدر سایت' },
  { id: 'about', label: 'تب تنظیم صفحه در باره ما' },
  { id: 'contact', label: 'تب تنظیم صفحه تماس با ما' },
  { id: 'footer', label: 'تب تنظیم فوتر سایت' },
];

const PRESET_PRODUCT_IMAGES = [
  { label: 'لوستر کریستالی طرح فرشته', url: GENERATED_IMAGES.crystaliCherub },
  { label: 'لوستر رسانس رز سرامیکی', url: GENERATED_IMAGES.resansRoses },
  { label: 'لوستر ۱۲ شاخه تک برنزی', url: GENERATED_IMAGES.shakheh12 },
  { label: 'لوستر طبقاتی شاه ملکه', url: GENERATED_IMAGES.shahMalakeh },
  { label: 'لوستر ریستانی آنتیک', url: GENERATED_IMAGES.ristani },
  { label: 'لوستر کریستالی طلایی', url: GENERATED_IMAGES.crystaliGold },
  { label: 'آینه و کنسول سلطنتی', url: GENERATED_IMAGES.ristani },
  { label: 'شمعدانی لاله عباسی', url: GENERATED_IMAGES.resansRoses },
  { label: 'لاله و استکانی کریستال', url: GENERATED_IMAGES.crystaliGold },
  { label: 'ساعت دیواری سلطنتی', url: GENERATED_IMAGES.shakheh12 },
  { label: 'دیوارکوب کلاسیک', url: GENERATED_IMAGES.crystaliCherub },
];

const PRESET_PROJECT_IMAGES = [
  { label: 'پروژه تالار و عمارت فرشته', url: GENERATED_IMAGES.projectFereshteh },
  { label: 'پروژه لابی هتل اسپیناس', url: GENERATED_IMAGES.projectLobbyHotel },
  { label: 'پروژه ویلای دوبلکس لواسان', url: GENERATED_IMAGES.projectDuplexVilla },
  { label: 'پروژه رستوران رویال زعفرانیه', url: GENERATED_IMAGES.projectRoyalRestaurant },
];

const PRESET_ABOUT_GALLERY_IMAGES = [
  {
    label: 'شوروم تالاری لوستر صالحی',
    url: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'آتلیه و کارگاه طراحی مرکزی',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'عمارت فرشته و لوسترهای سلطنتی',
    url: GENERATED_IMAGES.projectFereshteh,
  },
  {
    label: 'راه‌پله دوبلکس و لوستر آبشاری',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  },
  { label: 'ویلای مدرن لواسان', url: GENERATED_IMAGES.projectDuplexVilla },
  { label: 'تالار کاخ زمردی', url: GENERATED_IMAGES.projectRoyalRestaurant },
  { label: 'لابی هتل مجلل', url: GENERATED_IMAGES.projectLobbyHotel },
  { label: 'لوستر طبقاتی شاه ملکه', url: GENERATED_IMAGES.shahMalakeh },
  { label: 'لوستر کریستالی طرح فرشته', url: GENERATED_IMAGES.crystaliCherub },
  { label: 'لوستر رسانس رز سرامیکی', url: GENERATED_IMAGES.resansRoses },
];

const PRESET_STORY_MAIN_IMAGES = [
  {
    label: 'قاب عمودی عمارت کاخ سلطنتی',
    url: GENERATED_IMAGES.storyPortraitPalace,
  },
  {
    label: 'قاب عمودی تالار روستیک و برنز',
    url: GENERATED_IMAGES.storyPortraitRustic,
  },
  {
    label: 'قاب عمودی آتریوم و وید دوبلکس',
    url: GENERATED_IMAGES.storyPortraitAtrium,
  },
  { label: 'نمای پروژه عمارت فرشته', url: GENERATED_IMAGES.projectFereshteh },
  { label: 'نمای لابی هتل مجلل', url: GENERATED_IMAGES.projectLobbyHotel },
  { label: 'نمای تالار پذیرایی سلطنتی', url: GENERATED_IMAGES.projectRoyalRestaurant },
  { label: 'نمای ویلای دوبلکس', url: GENERATED_IMAGES.projectDuplexVilla },
  { label: 'نمای شبستان مسجد جامع', url: GENERATED_IMAGES.projectMosqueDome },
  { label: 'لوستر کریستالی طرح فرشته', url: GENERATED_IMAGES.crystaliCherub },
  { label: 'لوستر طبقاتی شاه ملکه', url: GENERATED_IMAGES.shahMalakeh },
  { label: 'لوستر رسانس رز سرامیکی', url: GENERATED_IMAGES.resansRoses },
  { label: 'لوستر ۱۲ شاخه تک برنزی', url: GENERATED_IMAGES.shakheh12 },
];

const PRESET_STORY_VIDEOS = [
  {
    label: 'ویدیو درخشش لوستر طلایی سلطنتی در سقف تالار',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
  },
  {
    label: 'ویدیو نمای نزدیک کریستال‌های لوستر در سالن مجلل',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-crystal-chandelier-in-a-luxury-room-42921-large.mp4',
  },
];

export const AdminPanelSection: React.FC<AdminPanelSectionProps> = ({
  onCatalogUpdated,
}) => {
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  // فرم ورود با شماره موبایل و رمز عبور
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // داده‌های جداول دیتابیس PostgreSQL
  const [summary, setSummary] = useState<{
    productsCount: number;
    categoriesCount: number;
    projectsCount: number;
    storiesCount: number;
    articlesCount: number;
    messagesCount: number;
    ordersCount: number;
    usersCount: number;
  }>({
    productsCount: 0,
    categoriesCount: 0,
    projectsCount: 0,
    storiesCount: 0,
    articlesCount: 0,
    messagesCount: 0,
    ordersCount: 0,
    usersCount: 0,
  });

  const [adminsList, setAdminsList] = useState<AdminSessionUser[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [storiesList, setStoriesList] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // ۱. فرم مدیریت ادمین‌ها (نام ادمین، شماره موبایل، رمز عبور، عکس ادمین، و تیک دسترسی هر بخش)
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);
  const [showAdminFormPassword, setShowAdminFormPassword] =
    useState<boolean>(false);
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<
    Record<number, boolean>
  >({});
  const [adminForm, setAdminForm] = useState<{
    displayName: string;
    phone: string;
    password: string;
    avatarUrl: string;
    permissions: AdminTab[];
  }>({
    displayName: '',
    phone: '',
    password: '',
    avatarUrl: DEFAULT_ADMIN_AVATAR_URL,
    permissions: ALL_ADMIN_PERMISSION_ITEMS.map((item) => item.id),
  });

  // مودال خروج از حساب ادمین + تایمر حضور ادمین در پنل (۱۰ دقیقه عدم فعالیت / ۳۰ دقیقه کل نشست)
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [isLoggingOutProgress, setIsLoggingOutProgress] =
    useState<boolean>(false);
  const [logoutProgress, setLogoutProgress] = useState<number>(0);
  const [remainingSessionSec, setRemainingSessionSec] = useState<number>(
    30 * 60
  );
  const [remainingIdleSec, setRemainingIdleSec] = useState<number>(10 * 60);

  // ۲. فرم محصول
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: 'مناسب کلاسیک پذیرایی | کلاسیک خواب',
    priceNumeric: 12500000,
    productCode: '۱۲۸۹۸۵',
    image: GENERATED_IMAGES.crystaliCherub,
    modelType: 'crystali',
    defaultFinish: 'gold-24k',
    categorySlug: 'chandeliers',
    outOfStock: false,
    hasSnappPay: true,
    isFeaturedSalehi: true,
    isBestSeller: true,
    dimensions: 'قطر ۸۵ سانتی‌متر | ارتفاع ۱۱۰ سانتی‌متر',
    branchesCount: '۱۲ شاخه (۲۴ شعله)',
    bodyMaterial: 'برنز خالص پرداخت‌شده با کریستال درجه یک',
    warranty: '۱۰ سال ضمانت کتبی اصالت و ثبات رنگ',
    description:
      'ساخته‌شده در کارگاه مرکزی لوستر اکبر صالحی با بهترین متریال برنز و کریستال.',
  });

  // ۳. فرم دسته‌بندی
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [categoryForm, setCategoryForm] = useState({
    title: '',
    slug: '',
    countLabel: '۱۲ محصول',
    image: GENERATED_IMAGES.shahMalakeh,
  });

  // ۴. فرم پروژه اجرایی
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [isSavingProject, setIsSavingProject] = useState<boolean>(false);
  const [projectActionModal, setProjectActionModal] = useState<{
    mode: 'save' | 'delete';
    title: string;
    subtitle: string;
    progress: number;
  } | null>(null);

  const runProjectProgressModal = (
    mode: 'save' | 'delete',
    title: string,
    subtitle: string,
    onComplete: () => Promise<void> | void
  ) => {
    setProjectActionModal({ mode, title, subtitle, progress: 10 });
    let currentProg = 10;
    const intervalId = window.setInterval(() => {
      currentProg = Math.min(100, currentProg + 18);
      setProjectActionModal((prev) =>
        prev ? { ...prev, progress: currentProg } : null
      );
      if (currentProg >= 100) {
        window.clearInterval(intervalId);
        Promise.resolve(onComplete()).finally(() => {
          window.setTimeout(() => {
            setProjectActionModal(null);
          }, 250);
        });
      }
    }, 100);
  };

  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState<string>('');
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    categoryTab: 'residential',
    district: '',
    dateBadge: '',
    ownerName: '',
    sampleCode: 'نمونه ۱',
    description: '',
    usedChandeliersText: '',
    mainImage: '',
    galleryImages: [] as string[],
    chandeliersList: [] as Array<{
      name: string;
      code: string;
      image: string;
      desc: string;
      price?: string;
    }>,
    likesCount: 0,
    stylesJson: '{}',
  });

  const currentProjectStyles = (() => {
    try {
      return JSON.parse(projectForm.stylesJson || '{}');
    } catch {
      return {};
    }
  })();

  const updateProjectStyleField = (key: string, value: any) => {
    const updated = { ...currentProjectStyles, [key]: value };
    setProjectForm((prev) => ({
      ...prev,
      stylesJson: JSON.stringify(updated),
    }));
  };

  // صفحه‌بندی پروژه‌ها و آمار لایک‌ها در پنل ادمین
  const [adminProjectsPage, setAdminProjectsPage] = useState<number>(1);
  const [adminProjectCategoryFilter, setAdminProjectCategoryFilter] = useState<string>('all');
  const [adminProjectSearchQuery, setAdminProjectSearchQuery] = useState<string>('');
  const [projectLikesMap, setProjectLikesMap] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('app_project_likes_stats');
      if (raw) {
        const parsed = JSON.parse(raw);
        // پاک‌سازی مقادیر فیک قدیمی بالای ۵۰۰ تا همه از صفر دقیق شروع شوند
        if (Object.values(parsed).some((v) => typeof v === 'number' && v > 500)) {
          localStorage.removeItem('app_project_likes_stats');
          return {};
        }
        return parsed;
      }
      return {};
    } catch {
      return {};
    }
  });

  // وضعیت فیلد سرچ محصولات برای لوسترها
  const [chandelierSearchQueries, setChandelierSearchQueries] = useState<Record<number, string>>({});
  const [activeChandelierSearchIdx, setActiveChandelierSearchIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleLikesUpdated = () => {
      try {
        const raw = localStorage.getItem('app_project_likes_stats');
        if (raw) setProjectLikesMap(JSON.parse(raw));
      } catch {}
    };
    window.addEventListener('app-project-liked', handleLikesUpdated);
    return () => {
      window.removeEventListener('app-project-liked', handleLikesUpdated);
    };
  }, []);

  // تابع تغییر سریع تعداد لایک‌های پروژه از پنل ادمین
  const handleQuickAdjustProjectLikes = async (
    proj: any,
    deltaOrExact: number,
    isExact: boolean = false
  ) => {
    try {
      const currentLikes =
        (projectLikesMap[proj.slug] ??
        projectLikesMap[proj.id] ??
        Number(proj.likesCount)) ||
        0;
      const targetLikes = isExact
        ? Math.max(0, deltaOrExact)
        : Math.max(0, currentLikes + deltaOrExact);
      const targetId = proj.id;

      await authFetch(`/api/admin/projects/${targetId}/likes`, {
        method: 'PATCH',
        body: JSON.stringify({ likesCount: targetLikes }),
      });

      const statsRaw = localStorage.getItem('app_project_likes_stats');
      const stats = statsRaw ? JSON.parse(statsRaw) : {};
      stats[proj.id] = targetLikes;
      if (proj.slug) stats[proj.slug] = targetLikes;
      localStorage.setItem('app_project_likes_stats', JSON.stringify(stats));
      setProjectLikesMap({ ...stats });

      showNotice(
        'success',
        `تعداد لایک‌های پروژه «${proj.title}» به ${targetLikes.toLocaleString('fa-IR')} تغییر یافت.`
      );
      await loadAllAdminData();
      onCatalogUpdated?.();
      window.dispatchEvent(new CustomEvent('app-catalog-updated'));
      window.dispatchEvent(new CustomEvent('app-projects-updated'));
      window.dispatchEvent(
        new CustomEvent('app-project-liked', {
          detail: {
            projectId: proj.id,
            slug: proj.slug,
            count: targetLikes,
          },
        })
      );
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در تغییر تعداد لایک');
    }
  };

  // ۵. فرم استوری بالای سایت (دسته‌بندی استوری با امکان افزودن تا ۱۰ استوری با تایپ‌های مختلف در هر دسته‌بندی)
  const [editingStoryId, setEditingStoryId] = useState<number | null>(null);
  const [selectedTargetCategoryId, setSelectedTargetCategoryId] = useState<
    number | 'new'
  >('new');
  const [storyFilterType, setStoryFilterType] = useState<
    'all' | 'single-product' | 'image-only' | 'video'
  >('all');
  const [storyPage, setStoryPage] = useState<number>(1);
  const STORIES_PER_PAGE = 10;

  // مودال وضعیت انتشار یا حذف استوری در سایت (با نوار پیشرفت پرشونده)
  const [storyActionModal, setStoryActionModal] = useState<{
    mode: 'save' | 'delete';
    title: string;
    subtitle: string;
    progress: number;
  } | null>(null);

  // اسلایدهای داخل دسته‌بندی استوری فعلی (حداکثر ۱۰ استوری با تایپ‌های مختلف در هر دسته‌بندی)
  const [categorySlides, setCategorySlides] = useState<
    Array<{
      id: string;
      type: 'single-product' | 'image-only' | 'video';
      title: string;
      mediaUrl: string;
      videoUrl: string;
      linkedProductKey: string;
    }>
  >([]);
  const [activeSlideEditIdx, setActiveSlideEditIdx] = useState<number>(0);

  const [storyForm, setStoryForm] = useState<{
    storyType: 'single-product' | 'image-only' | 'video';
    title: string;
    slideTitle: string;
    thumbnailImage: string;
    mediaUrl: string;
    videoUrl: string;
    linkedProductKey: string;
  }>({
    storyType: 'single-product',
    title: '',
    slideTitle: '',
    thumbnailImage: GENERATED_IMAGES.crystaliCherub,
    mediaUrl: GENERATED_IMAGES.storyPortraitPalace,
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
    linkedProductKey: 'prod-crystali',
  });

  const parseStorySlidesFromRow = useCallback(
    (st: any) => {
      if (!st) return [];
      if (typeof st.slidesJson === 'string' && st.slidesJson.trim()) {
        try {
          const parsed = JSON.parse(st.slidesJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, 10).map((sl: any, idx: number) => ({
              id: sl.id || `slide-${st.id}-${idx}`,
              type: (sl.type === 'image-only' || sl.type === 'video'
                ? sl.type
                : 'single-product') as 'single-product' | 'image-only' | 'video',
              title: sl.title || st.title || '',
              mediaUrl:
                sl.mediaUrl ||
                st.mediaUrl ||
                st.image ||
                GENERATED_IMAGES.storyPortraitPalace,
              videoUrl:
                sl.videoUrl ||
                st.videoUrl ||
                'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
              linkedProductKey:
                sl.linkedProductKey ||
                st.linkedProductKey ||
                productsList[0]?.productKey ||
                'prod-crystali',
            }));
          }
        } catch {
          // ignore parse error
        }
      }
      const fallbackType: 'single-product' | 'image-only' | 'video' =
        st.storyType === 'image-only'
          ? 'image-only'
          : st.storyType === 'video'
          ? 'video'
          : 'single-product';
      return [
        {
          id: `slide-${st.id || Date.now()}-0`,
          type: fallbackType,
          title: st.fullTitle || st.title || '',
          mediaUrl:
            st.mediaUrl || st.image || GENERATED_IMAGES.storyPortraitPalace,
          videoUrl:
            st.videoUrl ||
            'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
          linkedProductKey:
            st.linkedProductKey ||
            productsList[0]?.productKey ||
            'prod-crystali',
        },
      ];
    },
    [productsList]
  );

  const runStoryProgressModal = (
    mode: 'save' | 'delete',
    title: string,
    subtitle: string,
    onComplete: () => Promise<void> | void
  ) => {
    setStoryActionModal({ mode, title, subtitle, progress: 8 });
    let currentProg = 8;
    const intervalId = window.setInterval(() => {
      currentProg = Math.min(100, currentProg + 14);
      setStoryActionModal((prev) =>
        prev ? { ...prev, progress: currentProg } : null
      );
      if (currentProg >= 100) {
        window.clearInterval(intervalId);
        Promise.resolve(onComplete()).finally(() => {
          window.setTimeout(() => {
            setStoryActionModal(null);
          }, 260);
        });
      }
    }, 120);
  };

  const handleFileUploadToDataUrl = (
    file: File | undefined,
    onResult: (dataUrl: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onResult(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const moveMenuUp = (idx: number) => {
    if (idx === 0) return;
    const nextMenus = [...(mainSettingsForm.headerMenus || [])];
    const temp = nextMenus[idx];
    nextMenus[idx] = nextMenus[idx - 1];
    nextMenus[idx - 1] = temp;
    setMainSettingsForm({ ...mainSettingsForm, headerMenus: nextMenus });
  };

  const moveMenuDown = (idx: number) => {
    if (idx === (mainSettingsForm.headerMenus || []).length - 1) return;
    const nextMenus = [...(mainSettingsForm.headerMenus || [])];
    const temp = nextMenus[idx];
    nextMenus[idx] = nextMenus[idx + 1];
    nextMenus[idx + 1] = temp;
    setMainSettingsForm({ ...mainSettingsForm, headerMenus: nextMenus });
  };

  const deleteMenu = (idx: number) => {
    const nextMenus = (mainSettingsForm.headerMenus || []).filter((_: any, i: number) => i !== idx);
    setMainSettingsForm({ ...mainSettingsForm, headerMenus: nextMenus });
  };

  const addMainMenu = () => {
    const newItem = {
      id: `menu-custom-${Date.now()}`,
      label: 'منوی جدید',
      href: '#',
      submenuItems: []
    };
    setMainSettingsForm({
      ...mainSettingsForm,
      headerMenus: [...(mainSettingsForm.headerMenus || []), newItem]
    });
  };

  const addSubmenuItem = (menuIdx: number) => {
    const nextMenus = [...(mainSettingsForm.headerMenus || [])];
    const subItems = nextMenus[menuIdx].submenuItems ? [...nextMenus[menuIdx].submenuItems] : [];
    subItems.push({
      id: `sub-custom-${Date.now()}`,
      label: 'زیرمنوی جدید',
      href: '#'
    });
    nextMenus[menuIdx] = {
      ...nextMenus[menuIdx],
      submenuItems: subItems
    };
    setMainSettingsForm({ ...mainSettingsForm, headerMenus: nextMenus });
  };

  const deleteSubmenuItem = (menuIdx: number, subIdx: number) => {
    const nextMenus = [...(mainSettingsForm.headerMenus || [])];
    const subItems = nextMenus[menuIdx].submenuItems.filter((_: any, i: number) => i !== subIdx);
    nextMenus[menuIdx] = {
      ...nextMenus[menuIdx],
      submenuItems: subItems
    };
    setMainSettingsForm({ ...mainSettingsForm, headerMenus: nextMenus });
  };

  // ۶. فرم مقاله مجله
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'راهنمای دکوراسیون سلطنتی',
    readTime: '۵ دقیقه مطالعه',
    publishDate: '۱۸ مهر ۱۴۰۴',
    image: GENERATED_IMAGES.projectFereshteh,
    featured: false,
  });

  // ۷. مدیریت پیام‌های تماس با ما (فقط خواندنی + صفحه‌بندی ۵ تایی)
  const [messagePage, setMessagePage] = useState<number>(1);
  const MESSAGES_PER_PAGE = 5;
  const [viewingMessage, setViewingMessage] = useState<any | null>(null);

  // تب فعال در منوی تنظیمات وب سایت
  const [activeWebsiteSettingsTab, setActiveWebsiteSettingsTab] =
    useState<WebsiteSettingsSubTab>('main');

  // تنظیمات فوتر سایت (تب تنظیم فوتر سایت)
  const [footerSettingsForm, setFooterSettingsForm] =
    useState<FooterSettingsConfig>(INITIAL_FOOTER_SETTINGS);
  const [isSavingFooterSettings, setIsSavingFooterSettings] =
    useState<boolean>(false);

  // تنظیمات صفحه تماس با ما (تب تنظیم صفحه تماس با ما)
  const [contactUsSettingsForm, setContactUsSettingsForm] =
    useState<ContactUsSettingsConfig>(INITIAL_CONTACT_US_SETTINGS);
  const [isSavingContactUsSettings, setIsSavingContactUsSettings] =
    useState<boolean>(false);

  // تنظیمات صفحه درباره ما (تب تنظیم صفحه درباره ما)
  const [aboutUsSettingsForm, setAboutUsSettingsForm] =
    useState<AboutUsSettingsConfig>(INITIAL_ABOUT_US_SETTINGS);
  const [isSavingAboutUsSettings, setIsSavingAboutUsSettings] =
    useState<boolean>(false);

  // تنظیمات اسلایدر بنر اصلی سایت (تب تنظیم اسلایدر سایت)
  const [heroSliderSettingsForm, setHeroSliderSettingsForm] =
    useState<HeroSliderSettingsConfig>(INITIAL_HERO_SLIDER_SETTINGS);
  const [isSavingHeroSliderSettings, setIsSavingHeroSliderSettings] =
    useState<boolean>(false);

  // تنظیمات اصلی سایت
  const [mainSettingsForm, setMainSettingsForm] = useState<any>(INITIAL_MAIN_SETTINGS);
  const [isSavingMainSettings, setIsSavingMainSettings] = useState<boolean>(false);

  // تنظیمات پنل پیامک
  const [smsSettingsForm, setSmsSettingsForm] = useState<any>(INITIAL_SMS_SETTINGS);
  const [isSavingSmsSettings, setIsSavingSmsSettings] = useState<boolean>(false);

  // تنظیمات سوالات متداول صفحات
  const [faqSettingsForm, setFaqSettingsForm] = useState<any>(INITIAL_FAQ_SETTINGS);
  const [isSavingFaqSettings, setIsSavingFaqSettings] = useState<boolean>(false);

  // ۸. فرم سفارش مشتریان
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    totalAmountFormatted: '۱۲,۵۰۰,۰۰۰ تومان',
    totalAmountNumeric: 12500000,
    status: 'pending',
  });

  const showNotice = (type: 'success' | 'error', text: string) => {
    setFeedbackBanner({ type, text });
    window.setTimeout(() => {
      setFeedbackBanner((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!sessionToken) throw new Error('نشست ادمین معتبر نیست');
      const headers = new Headers(options.headers || {});
      headers.set('Authorization', `Bearer ${sessionToken}`);
      if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      return await apiFetchWithFallback(url, { ...options, headers });
    },
    [sessionToken]
  );

  const loadAllAdminData = useCallback(async () => {
    if (!sessionToken) return;
    setIsLoadingData(true);
    try {
      const [
        summaryRes,
        adminsRes,
        productsRes,
        categoriesRes,
        projectsRes,
        storiesRes,
        articlesRes,
        messagesRes,
        ordersRes,
        footerSettingsRes,
        contactUsSettingsRes,
        aboutUsSettingsRes,
        heroSliderSettingsRes,
        mainSettingsRes,
        smsSettingsRes,
        faqSettingsRes,
      ] = await Promise.all([
        authFetch('/api/admin/dashboard'),
        authFetch('/api/admin/users'),
        authFetch('/api/admin/products'),
        authFetch('/api/admin/categories'),
        authFetch('/api/admin/projects'),
        authFetch('/api/admin/stories'),
        authFetch('/api/admin/articles'),
        authFetch('/api/admin/messages'),
        authFetch('/api/admin/orders'),
        authFetch('/api/admin/settings/footer').catch(
          () => INITIAL_FOOTER_SETTINGS
        ),
        authFetch('/api/admin/settings/contact-us').catch(
          () => INITIAL_CONTACT_US_SETTINGS
        ),
        authFetch('/api/admin/settings/about-us').catch(
          () => INITIAL_ABOUT_US_SETTINGS
        ),
        authFetch('/api/admin/settings/hero-slider').catch(
          () => INITIAL_HERO_SLIDER_SETTINGS
        ),
        authFetch('/api/admin/settings/main').catch(
          () => INITIAL_MAIN_SETTINGS
        ),
        authFetch('/api/admin/settings/sms').catch(
          () => INITIAL_SMS_SETTINGS
        ),
        authFetch('/api/admin/settings/faq').catch(
          () => INITIAL_FAQ_SETTINGS
        ),
      ]);

      setIsDemoMode(isUsingFallbackMode());
      setSummary(summaryRes);
      setAdminsList(adminsRes);
      setProductsList(productsRes);
      setCategoriesList(categoriesRes);
      setProjectsList(projectsRes);
      setStoriesList(storiesRes);
      setArticlesList(articlesRes);
      setMessagesList(messagesRes);
      setOrdersList(ordersRes);
      if (footerSettingsRes) {
        setFooterSettingsForm({
          ...INITIAL_FOOTER_SETTINGS,
          ...footerSettingsRes,
          phones:
            Array.isArray(footerSettingsRes.phones) &&
            footerSettingsRes.phones.length > 0
              ? footerSettingsRes.phones
              : INITIAL_FOOTER_SETTINGS.phones,
          otherLicenses:
            Array.isArray(footerSettingsRes.otherLicenses) &&
            footerSettingsRes.otherLicenses.length > 0
              ? footerSettingsRes.otherLicenses
              : INITIAL_FOOTER_SETTINGS.otherLicenses,
        });
      }
      if (contactUsSettingsRes) {
        setContactUsSettingsForm({
          ...INITIAL_CONTACT_US_SETTINGS,
          ...contactUsSettingsRes,
          branchLocations:
            Array.isArray(contactUsSettingsRes.branchLocations) &&
            contactUsSettingsRes.branchLocations.length > 0
              ? contactUsSettingsRes.branchLocations
              : INITIAL_CONTACT_US_SETTINGS.branchLocations,
          branchPhones:
            Array.isArray(contactUsSettingsRes.branchPhones) &&
            contactUsSettingsRes.branchPhones.length > 0
              ? contactUsSettingsRes.branchPhones
              : INITIAL_CONTACT_US_SETTINGS.branchPhones,
        });
      }
      if (aboutUsSettingsRes) {
        setAboutUsSettingsForm({
          ...INITIAL_ABOUT_US_SETTINGS,
          ...aboutUsSettingsRes,
          galleryImages:
            Array.isArray(aboutUsSettingsRes.galleryImages) &&
            aboutUsSettingsRes.galleryImages.length > 0
              ? aboutUsSettingsRes.galleryImages
              : INITIAL_ABOUT_US_SETTINGS.galleryImages,
        });
      }
      if (heroSliderSettingsRes) {
        setHeroSliderSettingsForm({
          ...INITIAL_HERO_SLIDER_SETTINGS,
          ...heroSliderSettingsRes,
          slides:
            Array.isArray(heroSliderSettingsRes.slides) &&
            heroSliderSettingsRes.slides.length > 0
              ? heroSliderSettingsRes.slides
              : INITIAL_HERO_SLIDER_SETTINGS.slides,
        });
      }
      if (mainSettingsRes) {
        setMainSettingsForm({
          ...INITIAL_MAIN_SETTINGS,
          ...mainSettingsRes,
        });
      }
      if (smsSettingsRes) {
        setSmsSettingsForm({
          ...INITIAL_SMS_SETTINGS,
          ...smsSettingsRes,
        });
      }
      if (faqSettingsRes) {
        setFaqSettingsForm({
          ...INITIAL_FAQ_SETTINGS,
          ...faqSettingsRes,
        });
      }
    } catch (err: any) {
      showNotice(
        'error',
        err?.message || 'خطا در دریافت اطلاعات از دیتابیس PostgreSQL'
      );
    } finally {
      setIsLoadingData(false);
    }
  }, [sessionToken, authFetch]);

  useEffect(() => {
    const verifyExistingSession = async () => {
      if (!sessionToken) {
        setAuthChecking(false);
        return;
      }
      try {
        const data = await apiFetchWithFallback('/api/admin/me', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        const resolvedUser = data?.user || data?.admin;
        if (resolvedUser) {
          setAdminUser(resolvedUser);
          localStorage.setItem(
            ADMIN_USER_STORAGE_KEY,
            JSON.stringify(resolvedUser)
          );
        }
      } catch {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
        setSessionToken(null);
        setAdminUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    verifyExistingSession();
  }, [sessionToken]);

  useEffect(() => {
    if (sessionToken && adminUser) {
      loadAllAdminData();
    }
    const handleDataUpdated = () => {
      if (sessionToken && adminUser) {
        loadAllAdminData();
      }
    };
    window.addEventListener('app-contact-message-created', handleDataUpdated);
    window.addEventListener('app-catalog-updated', handleDataUpdated);
    return () => {
      window.removeEventListener('app-contact-message-created', handleDataUpdated);
      window.removeEventListener('app-catalog-updated', handleDataUpdated);
    };
  }, [sessionToken, adminUser, loadAllAdminData]);

  const performDirectLogout = useCallback((reasonMessage?: string) => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
    localStorage.removeItem(ADMIN_SESSION_START_KEY);
    localStorage.removeItem(ADMIN_LAST_ACTIVITY_KEY);
    setSessionToken(null);
    setAdminUser(null);
    setShowLogoutModal(false);
    setIsLoggingOutProgress(false);
    setLogoutProgress(0);
    if (reasonMessage) {
      setAuthError(reasonMessage);
    }
  }, []);

  const formatCountdown = (totalSec: number) => {
    const safe = Math.max(0, Math.floor(totalSec));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    const mStr = mins.toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
    const sStr = secs.toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
    return `${mStr}:${sStr}`;
  };

  // مدیریت زمان حضور ادمین در پنل (۱۰ دقیقه بدون فعالیت و حداکثر ۳۰ دقیقه کل نشست، سپس خروج خودکار و ورود مجدد)
  useEffect(() => {
    if (!sessionToken || !adminUser) return;

    const now = Date.now();
    if (!localStorage.getItem(ADMIN_SESSION_START_KEY)) {
      localStorage.setItem(ADMIN_SESSION_START_KEY, String(now));
    }
    if (!localStorage.getItem(ADMIN_LAST_ACTIVITY_KEY)) {
      localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(now));
    }

    const updateActivity = () => {
      localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(Date.now()));
    };

    window.addEventListener('mousemove', updateActivity, { passive: true });
    window.addEventListener('mousedown', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('touchstart', updateActivity, { passive: true });
    window.addEventListener('scroll', updateActivity, { passive: true });

    const timerId = window.setInterval(() => {
      const currentNow = Date.now();
      const startTs = Number(
        localStorage.getItem(ADMIN_SESSION_START_KEY) || currentNow
      );
      const lastActTs = Number(
        localStorage.getItem(ADMIN_LAST_ACTIVITY_KEY) || currentNow
      );

      const elapsedSessionMs = currentNow - startTs;
      const elapsedIdleMs = currentNow - lastActTs;

      const leftSessionSec = Math.max(
        0,
        Math.ceil((ADMIN_MAX_SESSION_LIMIT_MS - elapsedSessionMs) / 1000)
      );
      const leftIdleSec = Math.max(
        0,
        Math.ceil((ADMIN_INACTIVITY_LIMIT_MS - elapsedIdleMs) / 1000)
      );

      setRemainingSessionSec(leftSessionSec);
      setRemainingIdleSec(leftIdleSec);

      if (leftSessionSec <= 0) {
        window.clearInterval(timerId);
        performDirectLogout(
          'مهلت ۳۰ دقیقه‌ای حضور شما در پنل مدیریت به پایان رسید. لطفاً مجدداً وارد شوید.'
        );
      } else if (leftIdleSec <= 0) {
        window.clearInterval(timerId);
        performDirectLogout(
          'به دلیل ۱۰ دقیقه عدم فعالیت در پنل مدیریت، به صورت خودکار خارج شدید. لطفاً مجدداً وارد شوید.'
        );
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.clearInterval(timerId);
    };
  }, [sessionToken, adminUser, performDirectLogout]);

  const handlePhonePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const normalizedPhone = normalizeAdminPhoneClient(loginPhone);
    const trimmedPassword = loginPassword.trim();
    if (!normalizedPhone || !trimmedPassword) {
      setAuthError('لطفاً شماره موبایل و رمز عبور ادمین را وارد کنید.');
      return;
    }

    setIsSubmittingLogin(true);
    try {
      const data = await apiFetchWithFallback('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizedPhone,
          password: trimmedPassword,
        }),
      });
      const loggedInUser = data?.user || data?.admin;
      if (!data?.token || !loggedInUser) {
        throw new Error(
          data?.error || 'شماره موبایل یا رمز عبور اشتباه است.'
        );
      }

      const now = Date.now();
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(
        ADMIN_USER_STORAGE_KEY,
        JSON.stringify(loggedInUser)
      );
      localStorage.setItem(ADMIN_SESSION_START_KEY, String(now));
      localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(now));
      setRemainingSessionSec(30 * 60);
      setRemainingIdleSec(10 * 60);
      setSessionToken(data.token);
      setAdminUser(loggedInUser);
      const allowedTabs: AdminTab[] =
        Array.isArray(loggedInUser.permissions) &&
        loggedInUser.permissions.length > 0
          ? (loggedInUser.permissions as AdminTab[])
          : ALL_ADMIN_PERMISSION_ITEMS.map((i) => i.id);
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab(allowedTabs[0] || 'dashboard');
      }
      showNotice(
        'success',
        `خوش آمدید ${loggedInUser.displayName || 'مدیر گرامی'}! وارد پنل مدیریت شدید.`
      );
    } catch (err: any) {
      setAuthError(err?.message || 'خطا در ورود به پنل ادمین');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // باز کردن مودال خروج هنگام کلیک روی دکمه خروج
  const handleAdminLogout = () => {
    setShowLogoutModal(true);
    setIsLoggingOutProgress(false);
    setLogoutProgress(0);
  };

  const handleConfirmAdminLogout = () => {
    setIsLoggingOutProgress(true);
    setLogoutProgress(15);
    let prog = 15;
    const intervalId = window.setInterval(() => {
      prog = Math.min(100, prog + 22);
      setLogoutProgress(prog);
      if (prog >= 100) {
        window.clearInterval(intervalId);
        window.setTimeout(() => {
          performDirectLogout();
        }, 180);
      }
    }, 100);
  };

  const formatToman = (num: number) => {
    const formatted = Number(num || 0).toLocaleString('fa-IR');
    return `${formatted} تومان`;
  };

  const parseAdminPermissions = (adm: any): AdminTab[] => {
    if (Array.isArray(adm?.permissions) && adm.permissions.length > 0) {
      const perms = adm.permissions as AdminTab[];
      if (perms.length >= 9 && !perms.includes('settings')) {
        return [...perms, 'settings'];
      }
      return perms;
    }
    if (typeof adm?.permissionsJson === 'string' && adm.permissionsJson.trim()) {
      try {
        const parsed = JSON.parse(adm.permissionsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const perms = parsed as AdminTab[];
          if (perms.length >= 9 && !perms.includes('settings')) {
            return [...perms, 'settings'];
          }
          return perms;
        }
      } catch {
        // ignore
      }
    }
    return ALL_ADMIN_PERMISSION_ITEMS.map((item) => item.id);
  };

  const handleToggleAdminPermission = (tabId: AdminTab) => {
    setAdminForm((prev) => {
      const exists = prev.permissions.includes(tabId);
      const next = exists
        ? prev.permissions.filter((id) => id !== tabId)
        : [...prev.permissions, tabId];
      return {
        ...prev,
        permissions: next,
      };
    });
  };

  // ==================== ۱. عملیات مدیریت ادمین‌ها ====================
  const handleSaveAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.displayName.trim()) {
      showNotice('error', 'لطفاً نام ادمین را وارد نمایید.');
      return;
    }
    if (!adminForm.phone.trim()) {
      showNotice('error', 'شماره موبایل ادمین الزامی است.');
      return;
    }
    if (!editingAdminId && !adminForm.password.trim()) {
      showNotice('error', 'رمز عبور برای ادمین جدید الزامی است.');
      return;
    }
    if (adminForm.permissions.length === 0) {
      showNotice(
        'error',
        'لطفاً حداقل تیک دسترسی یک بخش را برای این ادمین فعال نمایید.'
      );
      return;
    }

    try {
      const payload = {
        displayName: adminForm.displayName.trim(),
        phone: adminForm.phone.trim(),
        password: adminForm.password.trim(),
        avatarUrl: adminForm.avatarUrl.trim() || DEFAULT_ADMIN_AVATAR_URL,
        permissions: adminForm.permissions,
        permissionsJson: JSON.stringify(adminForm.permissions),
        role:
          adminForm.permissions.length === ALL_ADMIN_PERMISSION_ITEMS.length
            ? 'super_admin'
            : 'admin',
      };

      if (editingAdminId) {
        const updated = await authFetch(`/api/admin/users/${editingAdminId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (adminUser && editingAdminId === adminUser.id) {
          const nextCurrentAdmin: AdminSessionUser = {
            ...adminUser,
            displayName: updated.displayName || payload.displayName,
            phone: updated.phone || payload.phone,
            avatarUrl: updated.avatarUrl || payload.avatarUrl,
            permissions: updated.permissions || payload.permissions,
            permissionsJson: payload.permissionsJson,
          };
          setAdminUser(nextCurrentAdmin);
          localStorage.setItem(
            ADMIN_USER_STORAGE_KEY,
            JSON.stringify(nextCurrentAdmin)
          );
        }
        showNotice('success', 'مشخصات، عکس و دسترسی‌های ادمین بروزرسانی شد.');
      } else {
        await authFetch('/api/admin/users', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showNotice('success', 'ادمین جدید با موفقیت ثبت شد.');
      }
      setEditingAdminId(null);
      setAdminForm({
        displayName: '',
        phone: '',
        password: '',
        avatarUrl: DEFAULT_ADMIN_AVATAR_URL,
        permissions: ALL_ADMIN_PERMISSION_ITEMS.map((item) => item.id),
      });
      await loadAllAdminData();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در ذخیره اطلاعات ادمین');
    }
  };

  const handleDeleteAdminUser = async (id: number) => {
    try {
      await authFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      showNotice('success', 'ادمین انتخاب‌شده از دیتابیس حذف شد.');
      await loadAllAdminData();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در حذف ادمین');
    }
  };

  // ==================== ۲. عملیات مدیریت محصولات ====================
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showNotice('error', 'لطفاً نام محصول را وارد نمایید.');
      return;
    }

    try {
      const payload = {
        ...productForm,
        priceNumeric: Number(productForm.priceNumeric) || 0,
        priceFormatted: formatToman(Number(productForm.priceNumeric) || 0),
      };

      if (editingProductId) {
        await authFetch(`/api/admin/products/${editingProductId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showNotice('success', 'محصول با موفقیت در دیتابیس ویرایش شد.');
      } else {
        await authFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showNotice(
          'success',
          'محصول جدید با موفقیت به دیتابیس PostgreSQL اضافه شد.'
        );
      }

      setEditingProductId(null);
      setProductForm({
        ...productForm,
        name: '',
        productCode: `${Math.floor(100000 + Math.random() * 900000).toLocaleString('fa-IR', { useGrouping: false })}`,
      });
      await loadAllAdminData();
      onCatalogUpdated?.();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در ذخیره محصول');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await authFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      showNotice('success', 'محصول از دیتابیس حذف شد.');
      await loadAllAdminData();
      onCatalogUpdated?.();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در حذف محصول');
    }
  };

  // ==================== ۳. عملیات مدیریت دسته‌بندی‌ها ====================
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.title.trim() || !categoryForm.slug.trim()) {
      showNotice('error', 'عنوان و اسلاگ دسته‌بندی الزامی است.');
      return;
    }
    try {
      if (editingCategoryId) {
        await authFetch(`/api/admin/categories/${editingCategoryId}`, {
          method: 'PUT',
          body: JSON.stringify(categoryForm),
        });
        showNotice('success', 'دسته‌بندی با موفقیت در دیتابیس ویرایش شد.');
      } else {
        await authFetch('/api/admin/categories', {
          method: 'POST',
          body: JSON.stringify(categoryForm),
        });
        showNotice('success', 'دسته‌بندی جدید در دیتابیس ثبت شد.');
      }
      setEditingCategoryId(null);
      setCategoryForm({
        title: '',
        slug: '',
        countLabel: '۱۲ محصول',
        image: GENERATED_IMAGES.shahMalakeh,
      });
      await loadAllAdminData();
      onCatalogUpdated?.();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در ذخیره دسته‌بندی');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await authFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      showNotice('success', 'دسته‌بندی از دیتابیس حذف شد.');
      await loadAllAdminData();
      onCatalogUpdated?.();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در حذف دسته‌بندی');
    }
  };

  // ==================== ۴. عملیات مدیریت پروژه‌های اجرایی ====================
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      showNotice('error', 'عنوان پروژه اجرایی الزامی است.');
      return;
    }
    setIsSavingProject(true);
    try {
      // بررسی عدم وجود محصولات تکراری در لوسترهای پروژه (بر اساس فیلد کد محصول)
      const chandelierCodes = (projectForm.chandeliersList || [])
        .map((ch) => ch.code?.trim())
        .filter(Boolean);
      const uniqueChandelierCodes = new Set(chandelierCodes);
      if (chandelierCodes.length !== uniqueChandelierCodes.size) {
        showNotice(
          'error',
          'خطا: محصول تکراری در لیست لوسترهای پروژه وجود دارد! هر محصول را فقط یکبار می‌توانید اضافه کنید.'
        );
        setIsSavingProject(false);
        return;
      }

      const cleanDescText = projectForm.usedChandeliersText
        .replace(/<!--CHANDELIERS_DATA-->[\s\S]*?<!--\/CHANDELIERS_DATA-->/g, '')
        .replace(/(\n|^)\s*\[\s*\{[\s\S]*\}\s*\]\s*$/g, '')
        .trim();

      const finalUsedText =
        projectForm.chandeliersList && projectForm.chandeliersList.length > 0
          ? `${cleanDescText}\n<!--CHANDELIERS_DATA-->${JSON.stringify(projectForm.chandeliersList)}<!--/CHANDELIERS_DATA-->\n${JSON.stringify(projectForm.chandeliersList)}`
          : cleanDescText;

      const finalSlug = projectForm.slug.trim()
        ? projectForm.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-')
        : projectForm.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF_-]/g, '') ||
          `project-${Date.now()}`;

      const finalGalleryImages =
        Array.isArray(projectForm.galleryImages) && projectForm.galleryImages.length > 0
          ? (projectForm.mainImage && !projectForm.galleryImages.includes(projectForm.mainImage)
              ? [projectForm.mainImage, ...projectForm.galleryImages]
              : projectForm.galleryImages)
          : (projectForm.mainImage ? [projectForm.mainImage] : []);

      const payload = {
        ...projectForm,
        slug: finalSlug,
        usedChandeliersText: finalUsedText,
        chandeliersList: projectForm.chandeliersList,
        galleryImages: finalGalleryImages,
        galleryJson: JSON.stringify(finalGalleryImages),
      };

      if (editingProjectId) {
        await authFetch(`/api/admin/projects/${editingProjectId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showNotice('success', 'پروژه اجرایی با موفقیت ویرایش شد.');
      } else {
        await authFetch('/api/admin/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showNotice('success', 'پروژه اجرایی جدید در دیتابیس ثبت شد.');
      }

      setEditingProjectId(null);
      setNewGalleryImageUrl('');
      setProjectForm({
        title: '',
        slug: '',
        categoryTab: 'residential',
        district: '',
        dateBadge: '',
        ownerName: '',
        sampleCode: 'نمونه ۱',
        description: '',
        usedChandeliersText: '',
        mainImage: '',
        galleryImages: [],
        chandeliersList: [],
        likesCount: 0,
        stylesJson: '{}',
      });
      await loadAllAdminData();
      onCatalogUpdated?.();
      window.dispatchEvent(new CustomEvent('app-catalog-updated'));
      window.dispatchEvent(new CustomEvent('app-projects-updated'));
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در ذخیره پروژه');
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = (id: number, title?: string) => {
    const displayTitle = title || 'پروژه اجرایی انتخاب‌شده';
    runProjectProgressModal(
      'delete',
      `در حال حذف پروژه «${displayTitle}»`,
      'در حال پاکسازی اطلاعات پروژه و تصاویر مرتبط از وب‌سایت و دیتابیس...',
      async () => {
        try {
          await authFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
          showNotice('success', `پروژه «${displayTitle}» با موفقیت از دیتابیس حذف شد.`);
          await loadAllAdminData();
          onCatalogUpdated?.();
          window.dispatchEvent(new CustomEvent('app-catalog-updated'));
          window.dispatchEvent(new CustomEvent('app-projects-updated'));
        } catch (err: any) {
          showNotice('error', err?.message || 'خطا در حذف پروژه');
        }
      }
    );
  };

  // ==================== ۵. عملیات مدیریت استوری‌ها (دسته‌بندی استوری با تا ۱۰ استوری از ۳ تایپ مجزا) ====================
  const handleAddCurrentSlideToCategoryBuffer = () => {
    if (categorySlides.length >= 10) {
      showNotice(
        'error',
        'حداکثر ظرفیت هر دسته‌بندی استوری ۱۰ عدد استوری می‌باشد.'
      );
      return;
    }
    const newSlide = {
      id: `slide-${Date.now()}-${categorySlides.length}`,
      type: storyForm.storyType,
      title: storyForm.slideTitle.trim() || storyForm.title.trim() || 'استوری جدید',
      mediaUrl:
        storyForm.storyType === 'video'
          ? storyForm.thumbnailImage.trim()
          : storyForm.mediaUrl.trim(),
      videoUrl:
        storyForm.storyType === 'video' ? storyForm.videoUrl.trim() : '',
      linkedProductKey:
        storyForm.storyType === 'single-product'
          ? storyForm.linkedProductKey
          : '',
    };
    const nextSlides = [...categorySlides, newSlide].slice(0, 10);
    setCategorySlides(nextSlides);
    setActiveSlideEditIdx(nextSlides.length - 1);
    showNotice(
      'success',
      `استوری شماره ${nextSlides.length.toLocaleString('fa-IR')} (از ۱۰) به این دسته‌بندی اضافه شد.`
    );
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.title.trim()) {
      showNotice('error', 'لطفاً عنوان دسته‌بندی / استوری را وارد نمایید.');
      return;
    }
    if (!storyForm.thumbnailImage.trim()) {
      showNotice('error', 'لطفاً عکس شاخص استوری را انتخاب یا آپلود نمایید.');
      return;
    }
    if (
      (storyForm.storyType === 'single-product' ||
        storyForm.storyType === 'image-only') &&
      !storyForm.mediaUrl.trim()
    ) {
      showNotice('error', 'لطفاً تصویر اصلی استوری را انتخاب یا آپلود نمایید.');
      return;
    }
    if (storyForm.storyType === 'video' && !storyForm.videoUrl.trim()) {
      showNotice('error', 'لطفاً لینک یا فایل ویدیوی استوری را وارد نمایید.');
      return;
    }

    const currentActiveSlide = {
      id:
        categorySlides[activeSlideEditIdx]?.id ||
        `slide-${Date.now()}-${activeSlideEditIdx}`,
      type: storyForm.storyType,
      title:
        storyForm.slideTitle.trim() || storyForm.title.trim(),
      mediaUrl:
        storyForm.storyType === 'video'
          ? storyForm.thumbnailImage.trim()
          : storyForm.mediaUrl.trim(),
      videoUrl:
        storyForm.storyType === 'video' ? storyForm.videoUrl.trim() : '',
      linkedProductKey:
        storyForm.storyType === 'single-product'
          ? storyForm.linkedProductKey
          : '',
    };

    // اگر ادمین یک دسته‌بندی استوری موجود را برای افزودن استوری جدید انتخاب کرده باشد
    const targetExistingId =
      editingStoryId ||
      (selectedTargetCategoryId !== 'new' ? selectedTargetCategoryId : null);

    let finalSlides = [...categorySlides];
    if (finalSlides.length === 0) {
      finalSlides = [currentActiveSlide];
    } else if (activeSlideEditIdx >= 0 && activeSlideEditIdx < finalSlides.length) {
      finalSlides[activeSlideEditIdx] = currentActiveSlide;
    } else {
      if (finalSlides.length >= 10) {
        showNotice(
          'error',
          'ظرفیت این دسته‌بندی استوری تکمیل است (حداکثر ۱۰ استوری در هر دسته‌بندی).'
        );
        return;
      }
      finalSlides.push(currentActiveSlide);
    }

    if (finalSlides.length > 10) {
      showNotice(
        'error',
        'در هر دسته‌بندی حداکثر ۱۰ استوری می‌توان قرار داد.'
      );
      return;
    }

    const primarySlide = finalSlides[0] || currentActiveSlide;
    const selectedProd = productsList.find(
      (p) =>
        p.productKey === primarySlide.linkedProductKey ||
        `prod-${p.id}` === primarySlide.linkedProductKey ||
        p.productCode === primarySlide.linkedProductKey
    );

    const payload = {
      storyType: primarySlide.type,
      title: storyForm.title.trim(),
      fullTitle: primarySlide.title || storyForm.title.trim(),
      subtitle:
        finalSlides.length > 1
          ? `دسته‌بندی شامل ${finalSlides.length.toLocaleString('fa-IR')} استوری در سایت`
          : primarySlide.type === 'single-product'
          ? 'استوری متصل به محصول'
          : primarySlide.type === 'image-only'
          ? 'استوری ساده تصویری'
          : 'استوری ویدیویی',
      thumbnailImage: storyForm.thumbnailImage.trim(),
      image: primarySlide.mediaUrl || storyForm.thumbnailImage.trim(),
      mediaUrl: primarySlide.mediaUrl || storyForm.thumbnailImage.trim(),
      videoUrl: primarySlide.type === 'video' ? primarySlide.videoUrl : '',
      linkedProductKey:
        primarySlide.type === 'single-product'
          ? primarySlide.linkedProductKey
          : '',
      slides: finalSlides.slice(0, 10),
      price: selectedProd?.priceFormatted || '۱۶,۴۰۰,۰۰۰ تومان',
      modelType: selectedProd?.modelType || 'crystali',
      finish: selectedProd?.defaultFinish || 'gold-24k',
    };

    runStoryProgressModal(
      'save',
      'استوری در وب‌سایت قرار داده شد',
      'در حال ثبت در بالای لیست و نمایش در اولین جایگاه صفحه اصلی وب‌سایت...',
      async () => {
        try {
          if (targetExistingId) {
            await authFetch(`/api/admin/stories/${targetExistingId}`, {
              method: 'PUT',
              body: JSON.stringify(payload),
            });
          } else {
            await authFetch('/api/admin/stories', {
              method: 'POST',
              body: JSON.stringify(payload),
            });
          }
          setEditingStoryId(null);
          setSelectedTargetCategoryId('new');
          setCategorySlides([]);
          setActiveSlideEditIdx(0);
          setStoryPage(1);
          setStoryForm({
            storyType: storyForm.storyType,
            title: '',
            slideTitle: '',
            thumbnailImage: GENERATED_IMAGES.crystaliCherub,
            mediaUrl: GENERATED_IMAGES.storyPortraitPalace,
            videoUrl:
              'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
            linkedProductKey:
              productsList[0]?.productKey || 'prod-crystali',
          });
          await loadAllAdminData();
          onCatalogUpdated?.();
          showNotice(
            'success',
            'استوری با موفقیت در وب‌سایت قرار داده شد و در ابتدای لیست قرار گرفت.'
          );
        } catch (err: any) {
          showNotice('error', err?.message || 'خطا در انتشار استوری در سایت');
        }
      }
    );
  };

  const handleDeleteStory = async (id: number) => {
    runStoryProgressModal(
      'delete',
      'استوری از وب‌سایت حذف شد',
      'در حال حذف استوری از لیست و بروزرسانی نوار استوری‌های صفحه اصلی سایت...',
      async () => {
        try {
          await authFetch(`/api/admin/stories/${id}`, { method: 'DELETE' });
          await loadAllAdminData();
          onCatalogUpdated?.();
          window.dispatchEvent(new CustomEvent('app-catalog-updated'));
          window.dispatchEvent(new CustomEvent('app-stories-updated'));
          showNotice('success', 'استوری با موفقیت از وب‌سایت حذف شد.');
        } catch (err: any) {
          showNotice('error', err?.message || 'خطا در حذف استوری از سایت');
        }
      }
    );
  };

  // ==================== ۶. عملیات مدیریت مقالات مجله ====================
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) {
      showNotice('error', 'عنوان مقاله الزامی است.');
      return;
    }
    try {
      const payload = {
        ...articleForm,
        fullContent: articleForm.content
          ? articleForm.content
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          : [articleForm.excerpt || articleForm.title],
      };

      if (editingArticleId) {
        await authFetch(`/api/admin/articles/${editingArticleId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showNotice('success', 'مقاله مجله با موفقیت ویرایش شد.');
      } else {
        await authFetch('/api/admin/articles', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showNotice('success', 'مقاله جدید در دیتابیس ثبت شد.');
      }
      setEditingArticleId(null);
      setArticleForm({
        title: '',
        excerpt: '',
        content: '',
        category: 'راهنمای دکوراسیون سلطنتی',
        readTime: '۵ دقیقه مطالعه',
        publishDate: '۱۸ مهر ۱۴۰۴',
        image: GENERATED_IMAGES.projectFereshteh,
        featured: false,
      });
      await loadAllAdminData();
      onCatalogUpdated?.();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در ذخیره مقاله');
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await authFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      showNotice('success', 'مقاله از دیتابیس حذف شد.');
      await loadAllAdminData();
      onCatalogUpdated?.();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در حذف مقاله');
    }
  };

  // ==================== ۷. عملیات مدیریت پیام‌های تماس (فقط خواندنی + تغییر وضعیت و حذف) ====================
  const handleOpenAndReadMessage = async (msg: any) => {
    setViewingMessage(msg);
    if (msg && msg.status === 'new') {
      try {
        await authFetch(`/api/admin/messages/${msg.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'read' }),
        });
        setViewingMessage((prev: any) =>
          prev && prev.id === msg.id ? { ...prev, status: 'read' } : prev
        );
        await loadAllAdminData();
      } catch {
        // ignore status update error on open
      }
    }
  };

  const handleToggleMessageStatus = async (id: number, current: string) => {
    try {
      const next = current === 'new' ? 'read' : 'new';
      await authFetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      });
      await loadAllAdminData();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در تغییر وضعیت پیام');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await authFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      showNotice('success', 'پیام از دیتابیس حذف شد.');
      await loadAllAdminData();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در حذف پیام');
    }
  };

  // ==================== ۸. عملیات مدیریت سفارشات ====================
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName.trim()) {
      showNotice('error', 'نام مشتری الزامی است.');
      return;
    }
    try {
      const payload = {
        ...orderForm,
        totalPriceNumeric: Number(orderForm.totalAmountNumeric) || 0,
        totalPriceFormatted: formatToman(
          Number(orderForm.totalAmountNumeric) || 0
        ),
        totalAmountNumeric: Number(orderForm.totalAmountNumeric) || 0,
        totalAmountFormatted: formatToman(
          Number(orderForm.totalAmountNumeric) || 0
        ),
      };

      if (editingOrderId) {
        await authFetch(`/api/admin/orders/${editingOrderId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showNotice('success', 'سفارش با موفقیت ویرایش شد.');
      } else {
        await apiFetchWithFallback('/api/public/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        showNotice('success', 'سفارش جدید در دیتابیس ثبت شد.');
      }
      setEditingOrderId(null);
      setOrderForm({
        customerName: '',
        customerPhone: '',
        totalAmountFormatted: '۱۲,۵۰۰,۰۰۰ تومان',
        totalAmountNumeric: 12500000,
        status: 'pending',
      });
      await loadAllAdminData();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در ذخیره سفارش');
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await authFetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      showNotice('success', 'وضعیت سفارش بروزرسانی شد.');
      await loadAllAdminData();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در تغییر وضعیت سفارش');
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await authFetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      showNotice('success', 'سفارش از دیتابیس حذف شد.');
      await loadAllAdminData();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در حذف سفارش');
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen w-full bg-[#141414] flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="w-11 h-11 rounded-full border-2 border-[#c09d62] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#e5dec9]">
            در حال بارگذاری پنل مدیریت اختصاصی لوستر صالحی...
          </p>
        </div>
      </div>
    );
  }

  // ==================== صفحه ورود تمام‌صفحه و اختصاصی مدیر (بدون هدر و فوتر سایت + فونت یکپارچه سایت) ====================
  if (!adminUser || !sessionToken) {
    return (
      <section
        dir="rtl"
        style={{
          fontFamily: "'IRANSansX', 'IranSansX', system-ui, -apple-system, sans-serif",
        }}
        className="min-h-screen w-full bg-[#121212] flex flex-col lg:flex-row overflow-hidden font-sans"
      >
        {/* ستون راست در دسکتاپ: ویترین بصری سلطنتی برند لوستر اکبر صالحی */}
        <div className="relative hidden lg:flex lg:w-7/12 xl:w-7/12 flex-col justify-between p-12 xl:p-16 overflow-hidden">
          <img
            src={GENERATED_IMAGES.heroBanner}
            alt="لوستر اکبر صالحی"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#121212]/80 to-[#121212]/55" />

          {/* نشان بالای پنل بصری */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#c09d62]/20 border border-[#c09d62]/50 backdrop-blur-md flex items-center justify-center text-[#dfc18d]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-base font-black text-white tracking-tight">
                  سیستم cms لوستر صالحی
                </span>
                <span className="block text-xs text-[#cbb894] mt-0.5">
                  سامانه یکپارچه مدیریت محتوا
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateToRoute('home')}
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-colors cursor-pointer"
            >
              <span>مشاهده ویترین فروشگاه</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

          {/* متن میانی و آمار اتصال دیتابیس */}
          <div className="relative z-10 max-w-xl space-y-6 my-auto">
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-[1.45]">
              مدیریت مستقیم کلکسیون‌ها، پروژه‌های اجرایی و سفارشات مشتریان
            </h2>
          </div>

          {/* پانویس پنل بصری */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/50">
            <span>پنل مدیریت اختصاصی لوستر اکبر صالحی</span>
            <span>ورود امن با شماره موبایل و رمز عبور مدیریت</span>
          </div>
        </div>

        {/* ستون چپ: فرم ورود شیک و مدرن */}
        <div className="w-full lg:w-5/12 xl:w-5/12 min-h-screen bg-[#fcfbf8] flex flex-col justify-center px-5 sm:px-12 xl:px-16 py-10">
          <div className="w-full max-w-[430px] mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#191919] text-[#dfc18d] flex items-center justify-center mb-6 shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="text-2xl sm:text-[26px] font-black text-[#181818]">
              ورود به پنل مدیریت
            </h1>
            <p className="text-xs sm:text-[13px] text-[#666666] leading-7 mt-2">
              لطفاً شماره موبایل و رمز عبور ادمین را جهت دسترسی به میز کار مدیریت
              وارد نمایید.
            </p>

            {authError && (
              <div className="mt-5 p-3.5 rounded-xl bg-[#fde8ea] border border-[#f8c5ca] text-[#ea1d2c] text-xs font-bold text-right">
                {authError}
              </div>
            )}

            <form onSubmit={handlePhonePasswordLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2b2b2b] mb-2">
                  شماره موبایل ادمین
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="شماره موبایل"
                    className="w-full h-12 rounded-xl border border-[#dcd5c7] bg-white pl-4 pr-11 text-left text-sm font-bold tabular-nums text-[#181818] focus:outline-none focus:border-[#b59766] transition-colors"
                  />
                  <Phone className="w-4 h-4 text-[#8c734b] absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2b2b2b] mb-2">
                  رمز عبور مدیریت
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    dir="ltr"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="رمز عبور"
                    className="w-full h-12 rounded-xl border border-[#dcd5c7] bg-white pl-11 pr-11 text-left text-sm font-bold text-[#181818] focus:outline-none focus:border-[#b59766] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#8c734b] absolute right-4 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#181818] cursor-pointer"
                    aria-label="نمایش رمز عبور"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full h-12 rounded-xl bg-[#b59766] hover:bg-[#9d8052] disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubmittingLogin
                    ? 'در حال احراز هویت و ورود...'
                    : 'ورود امن به میز کار مدیریت'}
                </span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#eae5dc] flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateToRoute('home')}
                className="text-xs font-bold text-[#555] hover:text-[#181818] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت به صفحه اصلی سایت</span>
              </button>
              <span className="text-[11px] text-[#888] tabular-nums">
                نسخه اختصاصی ادمین
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      id: 'dashboard',
      label: 'داشبورد کلی',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'admins',
      label: 'مدیریت ادمین‌ها',
      icon: <Users className="w-4 h-4" />,
      count: adminsList.length || summary.usersCount,
    },
    {
      id: 'products',
      label: 'مدیریت محصولات',
      icon: <Package className="w-4 h-4" />,
      count: productsList.length || summary.productsCount,
    },
    {
      id: 'categories',
      label: 'دسته‌بندی‌ها',
      icon: <Layers className="w-4 h-4" />,
      count: categoriesList.length || summary.categoriesCount,
    },
    {
      id: 'projects',
      label: 'پروژه‌های اجرایی',
      icon: <Building2 className="w-4 h-4" />,
      count: projectsList.length || summary.projectsCount,
    },
    {
      id: 'stories',
      label: 'استوری‌های سایت',
      icon: <PlayCircle className="w-4 h-4" />,
      count: storiesList.length || summary.storiesCount,
    },
    {
      id: 'articles',
      label: 'مجله و مقالات',
      icon: <FileText className="w-4 h-4" />,
      count: articlesList.length || summary.articlesCount,
    },
    {
      id: 'messages',
      label: 'پیام‌های تماس',
      icon: <MessageSquare className="w-4 h-4" />,
      count: messagesList.length || summary.messagesCount,
    },
    {
      id: 'orders',
      label: 'سفارشات مشتریان',
      icon: <ShoppingBag className="w-4 h-4" />,
      count: ordersList.length || summary.ordersCount,
    },
    {
      id: 'settings',
      label: 'تنظیمات وب سایت',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const currentAdminPermissions = parseAdminPermissions(adminUser);
  const visibleNavItems = navItems.filter((item) =>
    currentAdminPermissions.includes(item.id)
  );
  const effectiveNavItems =
    visibleNavItems.length > 0 ? visibleNavItems : navItems;

  const activeTabMeta =
    effectiveNavItems.find((item) => item.id === activeTab) ||
    effectiveNavItems[0] ||
    navItems[0];

  const currentAdminAvatar =
    adminUser.avatarUrl ||
    adminsList.find((a) => a.id === adminUser.id)?.avatarUrl ||
    DEFAULT_ADMIN_AVATAR_URL;

  return (
    <section
      dir="rtl"
      style={{
        fontFamily: "'IRANSansX', 'IranSansX', system-ui, -apple-system, sans-serif",
      }}
      className="min-h-screen w-full bg-[#f3f1ec] flex flex-col lg:flex-row text-[#181818] font-sans"
    >
      {/* سایدبار اختصاصی تیره و سلطنتی در سمت راست (بدون هدر و فوتر سایت) */}
      <aside className="w-full lg:w-[290px] xl:w-[305px] bg-[#151515] text-white shrink-0 lg:min-h-screen lg:sticky lg:top-0 flex flex-col justify-between p-5 border-b lg:border-b-0 lg:border-l border-white/10">
        <div className="space-y-5">
          {/* هدر بالای سایدبار با عکس بزرگ ادمین در باکس انتخاب‌شده (CSS selector 1) */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => setActiveTab('admins')}
                title="مشاهده و تغییر عکس ادمین"
                className="w-16 h-16 rounded-2xl bg-[#c09d62] p-[2px] flex items-center justify-center shadow-md shrink-0 cursor-pointer overflow-hidden group relative"
              >
                <img
                  src={currentAdminAvatar}
                  alt={adminUser.displayName}
                  className="w-full h-full rounded-[14px] object-cover bg-[#1d1d1d]"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black text-white truncate">
                  {adminUser.displayName || 'مدیر سیستم'}
                </h1>
                <p
                  dir="ltr"
                  className="text-xs text-[#d6be92] tabular-nums text-right mt-0.5 font-bold"
                >
                  {adminUser.phone}
                </p>
                <span className="inline-block text-[10.5px] text-emerald-400 font-bold mt-1">
                  ● ادمین آنلاین در پنل
                </span>
                {isDemoMode ? (
                  <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#fff4e5]/10 border border-[#ffe0b2]/20 text-[#ff9800]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff9800] animate-pulse" />
                    <span className="text-[9px] font-bold">وضعیت دمو (آفلاین)</span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-bold">متصل به پایگاه داده</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* باکس وضعیت زمان مجاز حضور ادمین در پنل (۱۰ دقیقه عدم فعالیت / ۳۰ دقیقه نشست کامل) */}
          <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 space-y-2">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-white/75 font-semibold">
                مهلت حضور در پنل (۳۰ دقیقه):
              </span>
              <span className="text-[#dfc18d] font-black tabular-nums">
                {formatCountdown(remainingSessionSec)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-white/75 font-semibold">
                خروج خودکار عدم فعالیت (۱۰ دقیقه):
              </span>
              <span className="text-emerald-400 font-black tabular-nums">
                {formatCountdown(remainingIdleSec)}
              </span>
            </div>
          </div>

          {/* منوی ناوبری بخش‌های دارای دسترسی تیک‌خورده */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {effectiveNavItems.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-3 rounded-xl text-right flex items-center justify-between gap-3 transition-colors cursor-pointer shrink-0 lg:w-full ${
                    active
                      ? 'bg-[#c09d62] text-[#141414] font-black'
                      : 'text-white/75 hover:bg-white/10 hover:text-white font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs whitespace-nowrap">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {typeof tab.count === 'number' && (
                    <span
                      className={`text-[11px] tabular-nums font-bold ${
                        active ? 'text-[#141414]' : 'text-[#cbb793]'
                      }`}
                    >
                      {tab.count.toLocaleString('fa-IR')}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* دکمه‌های پایین سایدبار */}
        <div className="hidden lg:flex flex-col gap-2 pt-5 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={() => navigateToRoute('home')}
            className="w-full h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>مشاهده زنده فروشگاه</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full h-10 px-3.5 rounded-xl bg-[#ea1d2c]/15 hover:bg-[#ea1d2c] text-[#ff7b84] hover:text-white text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>خروج از حساب ادمین</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* فضای کاری اصلی سمت چپ */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* نوار ابزار بالای میز کار (بدون دکمه افزودن ادمین جدید در هدر) */}
        <header className="bg-white border-b border-[#e5dfd3] px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8c734b] font-semibold">
              <span>پنل مدیریت</span>
              <span>/</span>
              <span>{activeTabMeta.label}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#181818] mt-0.5">
              {activeTabMeta.label}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loadAllAdminData}
              className="h-10 px-4 rounded-xl bg-[#f6f2ea] hover:bg-[#ebe3d4] text-[#7c6238] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`}
              />
              <span>بروزرسانی اطلاعات سایت</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToRoute('home')}
              className="lg:hidden h-10 px-3.5 rounded-xl bg-[#f2f2f2] text-[#222] text-xs font-bold cursor-pointer"
            >
              فروشگاه
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="lg:hidden h-10 px-3.5 rounded-xl bg-[#fde8ea] text-[#ea1d2c] text-xs font-bold cursor-pointer"
            >
              خروج
            </button>
          </div>
        </header>

        {/* محتوای داخلی میز کار */}
        <div className="p-5 sm:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          {/* بنر اعلان عملیات */}
          {feedbackBanner && (
            <div
              className={`px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between ${
                feedbackBanner.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-[#fde8ea] text-[#ea1d2c] border border-[#f8c5ca]'
              }`}
            >
              <span>{feedbackBanner.text}</span>
              <button
                type="button"
                onClick={() => setFeedbackBanner(null)}
                className="cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ۱. تب داشبورد */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    title: 'ادمین‌های سیستم',
                    value: adminsList.length || summary.usersCount,
                    sub: 'دسترسی مدیریت فعال',
                    tab: 'admins' as AdminTab,
                  },
                  {
                    title: 'کل محصولات ثبت‌شده',
                    value: productsList.length || summary.productsCount,
                    sub: 'در کاتالوگ فروشگاه',
                    tab: 'products' as AdminTab,
                  },
                  {
                    title: 'دسته‌بندی‌های سایت',
                    value: categoriesList.length || summary.categoriesCount,
                    sub: 'کالکشن‌های فعال',
                    tab: 'categories' as AdminTab,
                  },
                  {
                    title: 'پروژه‌های اجرایی',
                    value: projectsList.length || summary.projectsCount,
                    sub: 'در ۵ دسته اجرایی',
                    tab: 'projects' as AdminTab,
                  },
                  {
                    title: 'استوری‌های بالای سایت',
                    value: storiesList.length || summary.storiesCount,
                    sub: 'نوار استوری صفحه اصلی',
                    tab: 'stories' as AdminTab,
                  },
                  {
                    title: 'مقالات مجله لوستر',
                    value: articlesList.length || summary.articlesCount,
                    sub: 'مطالب آموزشی و تخصصی',
                    tab: 'articles' as AdminTab,
                  },
                  {
                    title: 'پیام‌های مشاوره و تماس',
                    value: messagesList.length || summary.messagesCount,
                    sub: 'فرم ارتباط با ما',
                    tab: 'messages' as AdminTab,
                  },
                  {
                    title: 'سفارشات مشتریان',
                    value: ordersList.length || summary.ordersCount,
                    sub: 'سبدهای خرید ثبت‌شده',
                    tab: 'orders' as AdminTab,
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveTab(stat.tab)}
                    className="bg-white rounded-2xl border border-[#e5dfd3] p-5 hover:border-[#b59766] transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#666]">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-[#181818] tabular-nums mt-2">
                        {stat.value.toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f2efe9] text-[11px]">
                      <span className="text-[#888]">{stat.sub}</span>
                      <span className="font-bold text-[#b59766]">
                        مدیریت ←
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* خلاصه سریع آخرین محصولات و آخرین سفارشات در داشبورد */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-[#e5dfd3] p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0ece3]">
                    <h3 className="text-sm font-black text-[#181818]">
                      آخرین محصولات دیتابیس
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-[#b59766] hover:underline cursor-pointer"
                    >
                      مشاهده همه محصولات ←
                    </button>
                  </div>
                  <div className="divide-y divide-[#f4f1ea]">
                    {productsList.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-[#f5f5f5] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#181818] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#777]">
                              کد {p.productCode} · {p.categorySlug}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#8c6f41] tabular-nums shrink-0">
                          {p.priceFormatted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#e5dfd3] p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0ece3]">
                    <h3 className="text-sm font-black text-[#181818]">
                      آخرین سفارشات و پیام‌های مشتریان
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#b59766] hover:underline cursor-pointer"
                    >
                      مدیریت سفارشات ←
                    </button>
                  </div>
                  <div className="divide-y divide-[#f4f1ea]">
                    {ordersList.slice(0, 3).map((ord) => (
                      <div
                        key={`dash-ord-${ord.id}`}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#181818]">
                            سفارش: {ord.customerName}
                          </p>
                          <p className="text-[11px] text-[#777] tabular-nums">
                            {ord.customerPhone} ·{' '}
                            {ord.status === 'completed'
                              ? 'تکمیل شده'
                              : 'در انتظار بررسی'}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#181818] tabular-nums">
                          {ord.totalPriceFormatted || ord.totalAmountFormatted}
                        </span>
                      </div>
                    ))}
                    {messagesList.slice(0, 2).map((msg) => (
                      <div
                        key={`dash-msg-${msg.id}`}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#181818] truncate">
                            پیام: {msg.fullName} ({msg.subject})
                          </p>
                          <p className="text-[11px] text-[#777] truncate">
                            {msg.message}
                          </p>
                        </div>
                        <span className="text-[11px] text-[#b59766] shrink-0">
                          {msg.phone}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ۲. تب مدیریت ادمین‌ها (نام ادمین، شماره موبایل، رمز عبور، عکس ادمین، و تیک دسترسی هر بخش) */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveAdminUser}
                className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-5 h-5 text-[#b59766]" />
                    <div>
                      <h2 className="text-base font-black text-[#1e1e1e]">
                        {editingAdminId
                          ? 'ویرایش مشخصات، عکس و دسترسی‌های ادمین'
                          : 'افزودن ادمین جدید به سیستم'}
                      </h2>
                      <p className="text-xs text-[#777] mt-0.5">
                        نام ادمین، شماره موبایل، رمز عبور و عکس ادمین را وارد کنید و هر بخشی که می‌خواهید دسترسی داشته باشد را تیک بزنید.
                      </p>
                    </div>
                  </div>
                  {editingAdminId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAdminId(null);
                        setAdminForm({
                          displayName: '',
                          phone: '',
                          password: '',
                          avatarUrl: DEFAULT_ADMIN_AVATAR_URL,
                          permissions: ALL_ADMIN_PERMISSION_ITEMS.map(
                            (item) => item.id
                          ),
                        });
                      }}
                      className="h-9 px-3.5 rounded-xl bg-[#fde8ea] text-[#ea1d2c] text-xs font-bold cursor-pointer hover:bg-[#ea1d2c] hover:text-white transition-colors"
                    >
                      انصراف از ویرایش
                    </button>
                  )}
                </div>

                {/* فیلدهای اصلی: ۱. نام ادمین | ۲. شماره موبایل ادمین | ۳. رمز عبور ادمین */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      نام ادمین
                    </label>
                    <input
                      type="text"
                      required
                      value={adminForm.displayName}
                      onChange={(e) =>
                        setAdminForm({
                          ...adminForm,
                          displayName: e.target.value,
                        })
                      }
                      placeholder="مثلاً: اکبر صالحی / ساشا صالحی"
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold focus:outline-none focus:border-[#b59766]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      شماره موبایل ادمین
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      value={adminForm.phone}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, phone: e.target.value })
                      }
                      placeholder="09120000000"
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-left text-xs font-bold tabular-nums focus:outline-none focus:border-[#b59766]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      رمز عبور ادمین
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminFormPassword ? 'text' : 'password'}
                        dir="ltr"
                        required={!editingAdminId}
                        value={adminForm.password}
                        onChange={(e) =>
                          setAdminForm({
                            ...adminForm,
                            password: e.target.value,
                          })
                        }
                        placeholder={
                          editingAdminId
                            ? 'رمز جدید (خالی = بدون تغییر)'
                            : 'رمز عبور ادمین'
                        }
                        className="w-full h-11 rounded-xl border border-[#e0e0e0] pl-9 pr-3.5 text-left text-xs font-bold focus:outline-none focus:border-[#b59766]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowAdminFormPassword((prev) => !prev)
                        }
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#222] cursor-pointer"
                      >
                        {showAdminFormPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* بخش انتخاب یا آپلود عکس ادمین (با پیش‌نمایش بزرگ که در بالای سایدبار قرار می‌گیرد) */}
                <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3.5 shrink-0">
                    <div className="w-20 h-20 rounded-2xl border-2 border-[#b59766] bg-[#181818] p-[2px] overflow-hidden shadow-md shrink-0">
                      <img
                        src={adminForm.avatarUrl || DEFAULT_ADMIN_AVATAR_URL}
                        alt={adminForm.displayName || 'عکس ادمین'}
                        className="w-full h-full rounded-[14px] object-cover"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-black text-[#1e1e1e]">
                        عکس پروفایل ادمین
                      </span>
                      <span className="block text-[11px] text-[#777] mt-0.5">
                        نمایش در قاب بزرگ بالای سایدبار پنل مدیریت
                      </span>
                      <label className="mt-2 inline-flex h-8 px-3 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[11px] font-bold items-center gap-1.5 cursor-pointer transition-colors">
                        <span>آپلود عکس ادمین از سیستم</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUploadToDataUrl(
                              e.target.files?.[0],
                              (dataUrl) =>
                                setAdminForm((prev) => ({
                                  ...prev,
                                  avatarUrl: dataUrl,
                                }))
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] font-bold text-[#555] mb-1">
                        انتخاب از تصاویر پرتره آماده:
                      </span>
                      <select
                        value={
                          PRESET_ADMIN_AVATARS.some(
                            (a) => a.url === adminForm.avatarUrl
                          )
                            ? adminForm.avatarUrl
                            : ''
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            setAdminForm({
                              ...adminForm,
                              avatarUrl: e.target.value,
                            });
                          }
                        }}
                        className="w-full h-11 rounded-xl border border-[#dcd3c2] px-3 text-xs font-semibold bg-white"
                      >
                        <option value="">-- انتخاب عکس آماده ادمین --</option>
                        {PRESET_ADMIN_AVATARS.map((av, idx) => (
                          <option key={idx} value={av.url}>
                            {av.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-[#555] mb-1">
                        یا لینک مستقیم عکس ادمین (URL):
                      </span>
                      <input
                        type="text"
                        dir="ltr"
                        value={adminForm.avatarUrl}
                        onChange={(e) =>
                          setAdminForm({
                            ...adminForm,
                            avatarUrl: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className="w-full h-11 rounded-xl border border-[#dcd3c2] bg-white px-3 text-xs font-medium text-left"
                      />
                    </div>
                  </div>
                </div>

                {/* بخش تعیین دسترسی‌ها به صورت تیک (چک‌باکس برای هر بخش پنل) */}
                <div className="p-4 rounded-2xl bg-[#f7f3eb] border border-[#dfcfb3] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-black text-[#1e1e1e]">
                        تعیین دسترسی بخش‌ها برای این ادمین (به‌صورت تیک):
                      </label>
                      <p className="text-[11px] text-[#666] mt-0.5">
                        هر بخشی که می‌خواهید این ادمین به آن دسترسی داشته باشد را تیک بزنید ({adminForm.permissions.length.toLocaleString('fa-IR')} از {ALL_ADMIN_PERMISSION_ITEMS.length.toLocaleString('fa-IR')} بخش فعال)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setAdminForm((prev) => ({
                            ...prev,
                            permissions: ALL_ADMIN_PERMISSION_ITEMS.map(
                              (i) => i.id
                            ),
                          }))
                        }
                        className="h-8 px-3 rounded-lg bg-[#1a1814] text-[#d4b27c] text-[11px] font-bold cursor-pointer hover:bg-[#b59766] hover:text-white transition-colors"
                      >
                        تیک زدن همه بخش‌ها
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAdminForm((prev) => ({
                            ...prev,
                            permissions: ['dashboard'],
                          }))
                        }
                        className="h-8 px-3 rounded-lg bg-white border border-[#d5c6ab] text-[#555] text-[11px] font-bold cursor-pointer hover:bg-[#eee] transition-colors"
                      >
                        فقط داشبورد
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {ALL_ADMIN_PERMISSION_ITEMS.map((perm) => {
                      const isChecked = adminForm.permissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          onClick={() => handleToggleAdminPermission(perm.id)}
                          className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition-all ${
                            isChecked
                              ? 'bg-[#1a1814] text-white border-[#b59766] shadow-xs'
                              : 'bg-white text-[#444] border-[#e2d8c5] hover:border-[#b59766]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                              isChecked
                                ? 'bg-[#c09d62] border-[#c09d62] text-[#141414]'
                                : 'bg-white border-[#bbb] text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-black">
                              {perm.label}
                            </span>
                            <span
                              className={`block text-[10.5px] mt-0.5 ${
                                isChecked ? 'text-white/75' : 'text-[#777]'
                              }`}
                            >
                              {perm.desc}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {editingAdminId
                        ? 'ذخیره تغییرات و دسترسی‌های ادمین'
                        : 'ثبت و افزودن ادمین جدید'}
                    </span>
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6">
                <h3 className="text-sm font-black text-[#1e1e1e] mb-4">
                  لیست ادمین‌های ثبت‌شده ({adminsList.length.toLocaleString('fa-IR')})
                </h3>
                <div className="space-y-3">
                  {adminsList.map((adm) => {
                    const isPasswordShown = Boolean(visiblePasswordIds[adm.id]);
                    const admPerms = parseAdminPermissions(adm);
                    const admAvatar = adm.avatarUrl || DEFAULT_ADMIN_AVATAR_URL;
                    return (
                      <div
                        key={adm.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl border border-[#efefef] hover:border-[#d8c7a8] transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          {/* عکس بزرگ ادمین در لیست */}
                          <img
                            src={admAvatar}
                            alt={adm.displayName}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#b59766] bg-[#181818] shrink-0 shadow-xs"
                          />

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-black text-[#1e1e1e]">
                                {adm.displayName}
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#fbf4e6] text-[#9b7639] border border-[#ead6b3] font-bold">
                                دسترسی به {admPerms.length.toLocaleString('fa-IR')} بخش
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-[#555]">
                              <span>
                                شماره موبایل:{' '}
                                <strong
                                  dir="ltr"
                                  className="tabular-nums font-bold text-[#111]"
                                >
                                  {adm.phone.replace(/(\d{4})\d+(\d{3})/, '$1****$2')}
                                </strong>
                              </span>
                              <span className="flex items-center gap-1.5">
                                رمز عبور:{' '}
                                <strong
                                  dir="ltr"
                                  className="tabular-nums font-bold text-[#111]"
                                >
                                  ••••••••
                                </strong>
                              </span>
                            </div>

                            {/* تگ‌های بخش‌های تیک‌خورده برای این ادمین */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {ALL_ADMIN_PERMISSION_ITEMS.filter((item) =>
                                admPerms.includes(item.id)
                              ).map((permItem) => (
                                <span
                                  key={permItem.id}
                                  className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-md bg-[#f4f1ea] text-[#5c4928] font-bold"
                                >
                                  <Check className="w-3 h-3 text-[#b59766] stroke-[2.5]" />
                                  {permItem.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAdminId(adm.id);
                              setAdminForm({
                                displayName: adm.displayName || '',
                                phone: adm.phone || '',
                                password: adm.password || '',
                                avatarUrl:
                                  adm.avatarUrl || DEFAULT_ADMIN_AVATAR_URL,
                                permissions: parseAdminPermissions(adm),
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="h-9 px-3.5 rounded-lg bg-[#f5f5f5] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>ویرایش عکس / رمز / دسترسی</span>
                          </button>

                          {adminsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAdminUser(adm.id)}
                              className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ۳. تب مدیریت محصولات */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveProduct}
                className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#efefef] pb-3.5">
                  <h2 className="text-base font-black text-[#1e1e1e]">
                    {editingProductId
                      ? 'ویرایش محصول در دیتابیس'
                      : 'افزودن محصول جدید به دیتابیس'}
                  </h2>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={() => setEditingProductId(null)}
                      className="text-xs font-bold text-[#ea1d2c] cursor-pointer"
                    >
                      انصراف از ویرایش
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      نام محصول
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      placeholder="مثلاً: لوستر کریستالی ورسای ۱۶ شاخه"
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold focus:outline-none focus:border-[#b59766]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      زیرعنوان کاربرد
                    </label>
                    <input
                      type="text"
                      value={productForm.subtitle}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold focus:outline-none focus:border-[#b59766]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      قیمت (تومان - عددی)
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.priceNumeric}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          priceNumeric: Number(e.target.value),
                        })
                      }
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold focus:outline-none focus:border-[#b59766]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      کد محصول
                    </label>
                    <input
                      type="text"
                      value={productForm.productCode}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          productCode: e.target.value,
                        })
                      }
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold focus:outline-none focus:border-[#b59766]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">
                      دسته‌بندی محصول
                    </label>
                    <select
                      value={productForm.categorySlug}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          categorySlug: e.target.value,
                        })
                      }
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3 text-xs font-semibold bg-white focus:outline-none focus:border-[#b59766]"
                    >
                      <option value="chandeliers">کلکسیون لوستر</option>
                      <option value="mirrors">کلکسیون آینه و کنسول</option>
                      <option value="shamdooni">کلکسیون شمعدانی</option>
                      <option value="laleh-estekani">کلکسیون لاله و استکانی</option>
                      <option value="saat-divari">کلکسیون ساعت دیواری</option>
                      <option value="divarkoub">کلکسیون دیوارکوب</option>
                      <option value="kenar-saloni">کلکسیون کنار سالونی</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      تصویر محصول
                    </label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={productForm.image}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              image: e.target.value,
                            })
                          }
                          className="flex-1 h-11 rounded-xl border border-[#e0e0e0] px-3 text-xs font-semibold bg-white focus:outline-none focus:border-[#b59766]"
                        >
                          <option value="">-- انتخاب از تصاویر آماده --</option>
                          {PRESET_PRODUCT_IMAGES.map((img, idx) => (
                            <option key={idx} value={img.url}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                        <label className="h-11 px-4 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>آپلود عکس</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUploadToDataUrl(
                                e.target.files?.[0],
                                (dataUrl) =>
                                  setProductForm((prev) => ({
                                    ...prev,
                                    image: dataUrl,
                                  }))
                              )
                            }
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        dir="ltr"
                        value={productForm.image}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            image: e.target.value,
                          })
                        }
                        placeholder="یا آدرس مستقیم تصویر (URL)..."
                        className="w-full h-10 rounded-xl border border-[#e0e0e0] px-3.5 text-[11px] text-left tabular-nums focus:outline-none focus:border-[#b59766]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#333] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.hasSnappPay}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          hasSnappPay: e.target.checked,
                        })
                      }
                      className="accent-[#b59766] w-4 h-4"
                    />
                    <span>دارای خرید اقساطی اسنپ‌پی (۴ قسط)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-[#333] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.outOfStock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          outOfStock: e.target.checked,
                        })
                      }
                      className="accent-[#ea1d2c] w-4 h-4"
                    />
                    <span>ناموجود در انبار</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {editingProductId
                        ? 'ذخیره تغییرات محصول'
                        : 'ثبت محصول در دیتابیس'}
                    </span>
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6">
                <h3 className="text-sm font-black text-[#1e1e1e] mb-4">
                  لیست محصولات موجود در دیتابیس ({productsList.length.toLocaleString('fa-IR')})
                </h3>
                <div className="space-y-3">
                  {productsList.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-[#efefef] hover:border-[#d8c7a8] transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 rounded-xl object-cover bg-[#f5f5f5] shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-[#1e1e1e]">
                              {prod.name}
                            </h4>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#f5f2eb] text-[#8c6f41] font-bold">
                              کد: {prod.productCode}
                            </span>
                            {prod.outOfStock && (
                              <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-[#fde8ea] text-[#ea1d2c] font-bold">
                                ناموجود
                              </span>
                            )}
                            {prod.hasSnappPay && (
                              <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                                اسنپ‌پی
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#666] mt-1">
                            {prod.priceFormatted} • دسته: {prod.categorySlug}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProductId(prod.id);
                            setProductForm({
                              name: prod.name,
                              subtitle: prod.subtitle,
                              priceNumeric: prod.priceNumeric,
                              productCode: prod.productCode,
                              image: prod.image,
                              modelType: prod.modelType,
                              defaultFinish: prod.defaultFinish,
                              categorySlug: prod.categorySlug,
                              outOfStock: Boolean(prod.outOfStock),
                              hasSnappPay: Boolean(prod.hasSnappPay),
                              isFeaturedSalehi: Boolean(prod.isFeaturedSalehi),
                              isBestSeller: Boolean(prod.isBestSeller),
                              dimensions: prod.dimensions || '',
                              branchesCount: prod.branchesCount || '',
                              bodyMaterial: prod.bodyMaterial || '',
                              warranty: prod.warranty || '',
                              description: prod.description || '',
                            });
                          }}
                          className="h-9 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>ویرایش</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ۴. تب دسته‌بندی‌ها (با افزودن، ویرایش و حذف) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveCategory}
                className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#efefef] pb-3">
                  <h2 className="text-base font-black text-[#1e1e1e]">
                    {editingCategoryId
                      ? 'ویرایش دسته‌بندی در دیتابیس'
                      : 'افزودن دسته‌بندی جدید'}
                  </h2>
                  {editingCategoryId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(null);
                        setCategoryForm({
                          title: '',
                          slug: '',
                          countLabel: '۱۲ محصول',
                          image: GENERATED_IMAGES.shahMalakeh,
                        });
                      }}
                      className="text-xs font-bold text-[#ea1d2c] cursor-pointer"
                    >
                      انصراف از ویرایش
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    required
                    value={categoryForm.title}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="عنوان دسته‌بندی (مثلاً: کلکسیون لوستر)"
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    required
                    value={categoryForm.slug}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, slug: e.target.value })
                    }
                    placeholder="اسلاگ لاتین (مثلاً: chandeliers)"
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={categoryForm.countLabel}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        countLabel: e.target.value,
                      })
                    }
                    placeholder="برچسب تعداد (مثلاً: ۱۸ محصول)"
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={categoryForm.image}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              image: e.target.value,
                            })
                          }
                          className="flex-1 h-11 rounded-xl border border-[#e0e0e0] px-3 text-xs font-semibold bg-white focus:outline-none focus:border-[#b59766]"
                        >
                          <option value="">-- انتخاب تصویر آماده --</option>
                          {PRESET_PRODUCT_IMAGES.map((img, idx) => (
                            <option key={idx} value={img.url}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                        <label className="h-11 px-4 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUploadToDataUrl(
                                e.target.files?.[0],
                                (dataUrl) =>
                                  setCategoryForm((prev) => ({
                                    ...prev,
                                    image: dataUrl,
                                  }))
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingCategoryId
                      ? 'ذخیره تغییرات دسته‌بندی'
                      : 'ثبت دسته‌بندی'}
                  </span>
                </button>
              </form>

              <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-3">
                <h3 className="text-sm font-black text-[#1e1e1e] mb-3">
                  دسته‌بندی‌های ثبت‌شده در دیتابیس ({categoriesList.length.toLocaleString('fa-IR')})
                </h3>
                {categoriesList.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#efefef]"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-12 h-12 rounded-xl object-cover bg-[#f5f5f5] shrink-0"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#1e1e1e]">
                          {cat.title}
                        </p>
                        <p className="text-xs text-[#777] mt-0.5">
                          مسیر: /product/categories/{cat.slug} • {cat.countLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setCategoryForm({
                            title: cat.title || '',
                            slug: cat.slug || '',
                            countLabel: cat.countLabel || '۱۲ محصول',
                            image: cat.image || GENERATED_IMAGES.shahMalakeh,
                          });
                        }}
                        className="h-9 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ویرایش</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ۵. تب پروژه‌های اجرایی (با افزودن، ویرایش و حذف) */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveProject}
                className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-[#efefef] pb-3">
                  <h2 className="text-base font-black text-[#1e1e1e]">
                    {editingProjectId
                      ? 'ویرایش پروژه اجرایی در وب سایت'
                      : 'ثبت پروژه اجرایی در وب سایت'}
                  </h2>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={() => setEditingProjectId(null)}
                      className="text-xs font-bold text-[#ea1d2c] cursor-pointer"
                    >
                      انصراف از ویرایش
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* ۱. عنوان پروژه */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      عنوان پروژه <span className="text-[#ea1d2c]">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjectForm((prev) => ({
                          ...prev,
                          title: val,
                          slug:
                            !prev.slug || prev.slug.startsWith('project-')
                              ? val
                                  .trim()
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')
                                  .replace(/[^a-z0-9\u0600-\u06FF_-]/g, '')
                              : prev.slug,
                        }));
                      }}
                      placeholder="مثلاً: پروژه تالار نیاوران"
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                    />
                  </div>

                  {/* ۲. دسته‌بندی اجرایی */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      دسته‌بندی اجرایی:
                    </label>
                    <select
                      value={projectForm.categoryTab}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          categoryTab: e.target.value,
                        })
                      }
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3 text-xs font-semibold bg-white"
                    >
                      <option value="gov">ارگان‌های دولتی</option>
                      <option value="commercial">ارگان‌های تجاری</option>
                      <option value="mosques">مساجد و حسینیه‌ها</option>
                      <option value="restaurants">کافه و رستوران‌ها</option>
                      <option value="residential">منازل مسکونی</option>
                    </select>
                  </div>

                  {/* ۳. اسلاگ آدرس URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      اسلاگ پروژه (شناسه URL اختیاری):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={projectForm.slug}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_-]/g, '-'),
                        })
                      }
                      placeholder="niavaran-hall"
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold text-left font-mono"
                    />
                    <p className="text-[10px] text-[#888] truncate dir-ltr">
                      /project/{projectForm.slug || 'slug'}
                    </p>
                  </div>

                  {/* ۴. تعداد لایک‌های پروژه */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      تعداد لایک‌های پروژه:
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        value={projectForm.likesCount}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            likesCount: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                        className="flex-1 min-w-0 h-11 rounded-xl border border-[#e0e0e0] px-2.5 text-xs font-bold text-[#1e1e1e]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setProjectForm((prev) => ({
                            ...prev,
                            likesCount: prev.likesCount + 10,
                          }))
                        }
                        className="h-11 px-2 rounded-xl bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] text-[11px] font-bold shrink-0 transition-colors border border-[#fecdd3] cursor-pointer"
                        title="افزودن ۱۰ لایک"
                      >
                        +۱۰
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setProjectForm((prev) => ({
                            ...prev,
                            likesCount: prev.likesCount + 50,
                          }))
                        }
                        className="h-11 px-2 rounded-xl bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] text-[11px] font-bold shrink-0 transition-colors border border-[#fecdd3] cursor-pointer"
                        title="افزودن ۵۰ لایک"
                      >
                        +۵۰
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setProjectForm((prev) => ({
                            ...prev,
                            likesCount: 0,
                          }))
                        }
                        className="h-11 px-2 rounded-xl bg-[#f5f5f5] hover:bg-gray-200 text-[#777] text-[10px] font-bold shrink-0 transition-colors border border-[#e0e0e0] cursor-pointer"
                        title="صفر کردن لایک"
                      >
                        ۰
                      </button>
                    </div>
                  </div>
                </div>

                {/* ردیف ۲: مشخصات اختیاری پروژه (شهر، تاریخ، مالک، نمونه) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#faf8f4] border border-[#ece4d4]">
                  {/* شهر / منطقه پذیرش */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      شهر / منطقه پذیرش (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={projectForm.district}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          district: e.target.value,
                        })
                      }
                      placeholder="مثلاً: تهران، پردیس"
                      className="w-full h-10 rounded-xl border border-[#e0e0e0] bg-white px-3.5 text-xs font-semibold"
                    />
                  </div>

                  {/* تاریخ انجام پروژه */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      تاریخ انجام پروژه (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={projectForm.dateBadge}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          dateBadge: e.target.value,
                        })
                      }
                      placeholder="مثلاً: ۲۵ شهریور ماه ۱۴۰۴"
                      className="w-full h-10 rounded-xl border border-[#e0e0e0] bg-white px-3.5 text-xs font-semibold"
                    />
                  </div>

                  {/* نام مالک / کارفرمای پروژه */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      نام مالک / کارفرما (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={projectForm.ownerName}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          ownerName: e.target.value,
                        })
                      }
                      placeholder="مثلاً: جناب مهندس علیرضا آذرخش"
                      className="w-full h-10 rounded-xl border border-[#e0e0e0] bg-white px-3.5 text-xs font-semibold"
                    />
                  </div>

                  {/* کد / نام نمونه کار */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      کد یا نام نمونه کار (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={projectForm.sampleCode}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          sampleCode: e.target.value,
                        })
                      }
                      placeholder="مثلاً: نمونه ۱"
                      className="w-full h-10 rounded-xl border border-[#e0e0e0] bg-white px-3.5 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* ردیف ۳: تصویر شاخص و توضیحات کامل */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* تصویر شاخص پروژه */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      تصویر شاخص پروژه (Cover Image):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        dir="ltr"
                        value={projectForm.mainImage}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            mainImage: e.target.value,
                          })
                        }
                        placeholder="https://... یا آپلود تصویر"
                        className="flex-1 h-11 rounded-xl border border-[#e0e0e0] px-3 text-xs font-semibold text-left"
                      />
                      <label className="h-11 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs" title="آپلود تصویر شاخص از حافظه">
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">آپلود شاخص</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUploadToDataUrl(
                              e.target.files?.[0],
                              (dataUrl) =>
                                setProjectForm((prev) => ({
                                  ...prev,
                                  mainImage: dataUrl,
                                  galleryImages:
                                    prev.galleryImages.length === 0
                                      ? [dataUrl]
                                      : prev.galleryImages,
                                }))
                            )
                          }
                        />
                      </label>
                    </div>

                    {/* پیش‌نمایش تصویر شاخص */}
                    {projectForm.mainImage ? (
                      <div className="mt-2 relative rounded-xl overflow-hidden border border-[#d5c6ab] bg-[#faf8f4] p-1.5 flex items-center gap-2.5">
                        <img
                          src={projectForm.mainImage}
                          alt="پیش‌نمایش تصویر شاخص"
                          className="w-16 h-12 rounded-lg object-cover border border-[#e2d8c3] shrink-0 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>تصویر شاخص تعیین شده است</span>
                          </span>
                          <p className="text-[9px] text-[#777] truncate mt-0.5 dir-ltr font-mono">
                            {projectForm.mainImage.startsWith('data:') ? 'عکس آپلود شده' : projectForm.mainImage}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProjectForm((prev) => ({ ...prev, mainImage: '' }))}
                          className="text-[#ea1d2c] hover:bg-[#fde8ea] p-1 rounded-lg cursor-pointer transition-colors"
                          title="پاک کردن عکس شاخص"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#999] italic mt-1">
                        عکسی برای تصویر شاخص پروژه انتخاب نشده است.
                      </p>
                    )}
                  </div>

                  {/* توضیحات کامل پروژه */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#333]">
                      متن و توضیحات کامل پروژه (اختیاری):
                    </label>
                    <textarea
                      rows={4}
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="توضیحات اختصاصی معماری، ارتفاع سقف و نورپردازی این پروژه..."
                      className="w-full rounded-xl border border-[#e0e0e0] p-3 text-xs font-semibold"
                    />
                  </div>

                  {/* بخش سفارشی‌سازی استایل عنوان و توضیحات برای هر پروژه */}
                  <div className="p-4 rounded-xl border border-[#ece4d4] bg-[#faf8f4]/60 space-y-4">
                    <h3 className="text-xs font-black text-[#1a1814] flex items-center gap-2 pb-2 border-b border-[#ece4d4]">
                      <svg className="w-4 h-4 text-[#b59766]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>تنظیمات استایل اختصاصی پروژه (تغییر سایز، رنگ و چیدمان متون در سایت)</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      {/* ستون راست: استایل عنوان (h1) */}
                      <div className="space-y-3.5">
                        <h4 className="text-[11px] font-bold text-[#b59766] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#b59766]"></span>
                          <span>استایل عنوان پروژه (h1)</span>
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {/* رنگ متن عنوان */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">رنگ متن عنوان:</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={currentProjectStyles.titleColor || '#1a1a1a'}
                                onChange={(e) => updateProjectStyleField('titleColor', e.target.value)}
                                className="w-7 h-7 rounded-md border border-[#e0e0e0] cursor-pointer p-0 overflow-hidden"
                              />
                              <input
                                type="text"
                                value={currentProjectStyles.titleColor || '#1a1a1a'}
                                onChange={(e) => updateProjectStyleField('titleColor', e.target.value)}
                                placeholder="#1a1a1a"
                                className="flex-1 min-w-0 h-7 text-[11px] font-mono font-bold text-center border border-[#e0e0e0] rounded-md px-1 bg-white"
                              />
                            </div>
                          </div>

                          {/* چیدمان متن عنوان */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">چیدمان متن عنوان:</label>
                            <select
                              value={currentProjectStyles.titleAlign || 'right'}
                              onChange={(e) => updateProjectStyleField('titleAlign', e.target.value)}
                              className="w-full h-7 text-[11px] font-bold border border-[#e0e0e0] rounded-md px-1 bg-white"
                            >
                              <option value="right">راست‌چین (پیش‌فرض)</option>
                              <option value="center">وسط‌چین</option>
                              <option value="left">چپ‌چین</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* سایز فونت عنوان */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">سایز فونت (دسکتاپ):</label>
                            <select
                              value={currentProjectStyles.titleSize || 'medium'}
                              onChange={(e) => updateProjectStyleField('titleSize', e.target.value)}
                              className="w-full h-7 text-[11px] font-bold border border-[#e0e0e0] rounded-md px-1 bg-white"
                            >
                              <option value="small">کوچک (18px)</option>
                              <option value="medium">متوسط (22px - پیش‌فرض)</option>
                              <option value="large">بزرگ (28px)</option>
                              <option value="xlarge">خیلی بزرگ (34px)</option>
                            </select>
                          </div>

                          {/* ضخامت متن عنوان */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">ضخامت فونت:</label>
                            <select
                              value={currentProjectStyles.titleWeight || 'font-extrabold'}
                              onChange={(e) => updateProjectStyleField('titleWeight', e.target.value)}
                              className="w-full h-7 text-[11px] font-bold border border-[#e0e0e0] rounded-md px-1 bg-white"
                            >
                              <option value="font-normal">عادی (Normal)</option>
                              <option value="font-semibold">نیمه‌ضخیم (SemiBold)</option>
                              <option value="font-bold">ضخیم (Bold)</option>
                              <option value="font-extrabold">بسیار ضخیم (ExtraBold - پیش‌فرض)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* ستون چپ: استایل توضیحات (p) */}
                      <div className="space-y-3.5">
                        <h4 className="text-[11px] font-bold text-[#b59766] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#b59766]"></span>
                          <span>استایل توضیحات کامل پروژه (p)</span>
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          {/* رنگ متن توضیحات */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">رنگ متن توضیحات:</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={currentProjectStyles.descColor || '#555555'}
                                onChange={(e) => updateProjectStyleField('descColor', e.target.value)}
                                className="w-7 h-7 rounded-md border border-[#e0e0e0] cursor-pointer p-0 overflow-hidden"
                              />
                              <input
                                type="text"
                                value={currentProjectStyles.descColor || '#555555'}
                                onChange={(e) => updateProjectStyleField('descColor', e.target.value)}
                                placeholder="#555555"
                                className="flex-1 min-w-0 h-7 text-[11px] font-mono font-bold text-center border border-[#e0e0e0] rounded-md px-1 bg-white"
                              />
                            </div>
                          </div>

                          {/* چیدمان متن توضیحات */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">چیدمان متن توضیحات:</label>
                            <select
                              value={currentProjectStyles.descAlign || 'justify'}
                              onChange={(e) => updateProjectStyleField('descAlign', e.target.value)}
                              className="w-full h-7 text-[11px] font-bold border border-[#e0e0e0] rounded-md px-1 bg-white"
                            >
                              <option value="justify">تراز شده (Justify - پیش‌فرض)</option>
                              <option value="right">راست‌چین</option>
                              <option value="center">وسط‌چین</option>
                              <option value="left">چپ‌چین</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* سایز فونت توضیحات */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">سایز فونت (دسکتاپ):</label>
                            <select
                              value={currentProjectStyles.descSize || 'medium'}
                              onChange={(e) => updateProjectStyleField('descSize', e.target.value)}
                              className="w-full h-7 text-[11px] font-bold border border-[#e0e0e0] rounded-md px-1 bg-white"
                            >
                              <option value="small">کوچک (12.5px)</option>
                              <option value="medium">متوسط (14px - پیش‌فرض)</option>
                              <option value="large">بزرگ (16px)</option>
                            </select>
                          </div>

                          {/* فاصله بین خطوط (Line Height) */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#555]">فاصله بین خطوط:</label>
                            <select
                              value={currentProjectStyles.descLineHeight || '2.25'}
                              onChange={(e) => updateProjectStyleField('descLineHeight', e.target.value)}
                              className="w-full h-7 text-[11px] font-bold border border-[#e0e0e0] rounded-md px-1 bg-white"
                            >
                              <option value="1.8">کوتاه (1.8)</option>
                              <option value="2.0">متوسط (2.0)</option>
                              <option value="2.25">استاندارد (2.25 - پیش‌فرض)</option>
                              <option value="2.5">بلند (2.5)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ردیف ۴: بخش اختصاصی مدیریت گالری تصاویر پروژه */}
                <div className="p-4 rounded-2xl bg-[#fdfcf9] border border-[#d5c6ab] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece4d4] pb-3">
                    <div>
                      <h3 className="text-xs font-black text-[#1e1e1e] flex items-center gap-2">
                        <span>گالری تصاویر پروژه</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#1a1814] text-[#e8d7b8] text-[10px] font-bold">
                          {projectForm.galleryImages.length.toLocaleString('fa-IR')} تصویر
                        </span>
                      </h3>
                      <p className="text-[11px] text-[#777] mt-0.5">
                        می‌توانید بی‌نهایت عکس با کیفیت بالا به گالری و اسلایدر این پروژه اضافه کنید.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="h-9 px-3 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>آپلود گروهی تصاویر</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;
                            files.forEach((file) => {
                              handleFileUploadToDataUrl(file, (dataUrl) => {
                                setProjectForm((prev) => ({
                                  ...prev,
                                  galleryImages: [...prev.galleryImages, dataUrl],
                                  mainImage: prev.mainImage || dataUrl,
                                }));
                              });
                            });
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* افزودن تک تصویر با URL */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={newGalleryImageUrl}
                      onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                      placeholder="لینک URL تصویر برای افزودن به گالری..."
                      className="flex-1 h-9 rounded-xl border border-[#e0e0e0] px-3 text-xs bg-white text-left font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newGalleryImageUrl.trim()) return;
                        setProjectForm((prev) => ({
                          ...prev,
                          galleryImages: [...prev.galleryImages, newGalleryImageUrl.trim()],
                          mainImage: prev.mainImage || newGalleryImageUrl.trim(),
                        }));
                        setNewGalleryImageUrl('');
                      }}
                      className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن به گالری</span>
                    </button>
                  </div>

                  {/* نمایش شبکه کارت‌های تصاویر گالری */}
                  {projectForm.galleryImages && projectForm.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
                      {projectForm.galleryImages.map((imgUrl, imgIdx) => (
                        <div
                          key={`gallery-item-${imgIdx}`}
                          className="group relative h-28 rounded-xl overflow-hidden border border-[#e2d8c3] bg-white shadow-2xs"
                        >
                          <img
                            src={imgUrl}
                            alt={`گالری پروژه ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                                #{imgIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setProjectForm((prev) => ({
                                    ...prev,
                                    galleryImages: prev.galleryImages.filter((_, i) => i !== imgIdx),
                                  }));
                                }}
                                className="w-6 h-6 rounded-md bg-[#ea1d2c] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                                title="حذف این تصویر از گالری"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectForm((prev) => ({
                                  ...prev,
                                  mainImage: imgUrl,
                                }));
                              }}
                              className="text-[9px] font-bold text-white bg-[#b59766]/90 hover:bg-[#b59766] py-1 px-1 rounded text-center cursor-pointer"
                            >
                              تنظیم به عنوان شاخص
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#888] italic py-2">
                      هنوز تصویری به گالری این پروژه افزوده نشده است. از دکمه «آپلود گروهی تصاویر» استفاده کنید یا لینک وارد نمایید.
                    </p>
                  )}
                </div>

                {/* بخش افزودن تعداد بی نهایت لوسترهای به کار رفته در این پروژه */}
                <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ece4d4] pb-2.5">
                    <div>
                      <h3 className="text-xs font-black text-[#181818]">
                        لوسترهای به‌کاررفته در این پروژه (تعداد بی‌نهایت)
                      </h3>
                      <p className="text-[11px] text-[#777] mt-0.5">
                        از طریق سرچبار زیر می‌توانید محصولات سایت را جستجو و پیش‌نمایش آن را به این پروژه متصل نمایید.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setProjectForm({
                          ...projectForm,
                          chandeliersList: [
                            ...(projectForm.chandeliersList || []),
                            {
                              name: 'لوستر برنزی سفارشی',
                              code: '۱۲۸۹',
                              image: GENERATED_IMAGES.crystaliCherub,
                              desc: 'نصب شده در سالن اصلی',
                            },
                          ],
                        })
                      }
                      className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن لوستر به پروژه</span>
                    </button>
                  </div>

                  {projectForm.chandeliersList && projectForm.chandeliersList.length > 0 ? (
                    <div className="space-y-4">
                      {projectForm.chandeliersList.map((chItem, chIdx) => {
                        const currentQuery =
                          chandelierSearchQueries[chIdx] !== undefined
                            ? chandelierSearchQueries[chIdx]
                            : '';
                        const isSearchOpen = activeChandelierSearchIdx === chIdx;

                        const matchingProducts = productsList.filter((p: any) => {
                          if (!currentQuery.trim()) return true;
                          const q = currentQuery.trim().toLowerCase();
                          return (
                            (p.name || '').toLowerCase().includes(q) ||
                            (p.productCode || '').toLowerCase().includes(q) ||
                            (p.subtitle || '').toLowerCase().includes(q)
                          );
                        });

                        return (
                          <div
                            key={`proj-ch-${chIdx}`}
                            className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-3.5 shadow-2xs"
                          >
                            {/* ۱. سرچ‌بار محصول با دیزاین عالی و پیش‌نمایش زنده */}
                            <div className="space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-[11px] font-black text-[#a68452] flex items-center gap-1.5">
                                  <Search className="w-3.5 h-3.5" />
                                  <span>
                                    جستجو و انتخاب لوستر شماره {(chIdx + 1).toLocaleString('fa-IR')} از محصولات سایت:
                                  </span>
                                </label>
                                <span className="text-[10px] text-[#888]">
                                  تایپ نام یا کد کالا برای جستجوی فوری
                                </span>
                              </div>

                              <div className="relative">
                                <div className="relative flex items-center">
                                  <Search className="w-4 h-4 text-[#a68452] absolute right-3 pointer-events-none" />
                                  <input
                                    type="text"
                                    value={currentQuery}
                                    onFocus={() => setActiveChandelierSearchIdx(chIdx)}
                                    onChange={(e) => {
                                      setChandelierSearchQueries((prev) => ({
                                        ...prev,
                                        [chIdx]: e.target.value,
                                      }));
                                      setActiveChandelierSearchIdx(chIdx);
                                    }}
                                    placeholder="جستجوی نام، مدل یا کد لوستر در محصولات سایت..."
                                    className="w-full h-10 pr-9 pl-8 rounded-xl border border-[#d5c6ab] text-xs font-semibold bg-[#faf8f4] text-[#1e1e1e] placeholder:text-[#999] focus:outline-none focus:border-[#b59766] focus:bg-white transition-all"
                                  />
                                  {currentQuery && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setChandelierSearchQueries((prev) => ({
                                          ...prev,
                                          [chIdx]: '',
                                        }));
                                      }}
                                      className="absolute left-2.5 text-[#999] hover:text-[#333] p-1 cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                {/* لیست دراپ‌داون محصولات پیدا شده */}
                                {isSearchOpen && (
                                  <div className="absolute top-full mt-1.5 right-0 left-0 max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl border border-[#e7dfd1] z-50 p-1.5 space-y-1">
                                    <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#f0ece3] text-[10px] text-[#777]">
                                      <span>نتایج جستجو ({matchingProducts.length.toLocaleString('fa-IR')} محصول)</span>
                                      <button
                                        type="button"
                                        onClick={() => setActiveChandelierSearchIdx(null)}
                                        className="text-[#ea1d2c] font-bold cursor-pointer"
                                      >
                                        بستن منو
                                      </button>
                                    </div>
                                    {matchingProducts.length === 0 ? (
                                      <p className="text-xs text-[#888] p-4 text-center">
                                        محصولی با این مشخصات یافت نشد.
                                      </p>
                                    ) : (
                                      matchingProducts.slice(0, 15).map((prod: any, pIdx: number) => (
                                        <div
                                          key={pIdx}
                                          onClick={() => {
                                            const isDuplicate = (projectForm.chandeliersList || []).some(
                                              (item, i) => i !== chIdx && item.code === prod.productCode
                                            );
                                            if (isDuplicate) {
                                              showNotice(
                                                'error',
                                                `لوستر «${prod.name}» (با کد ${prod.productCode}) قبلاً به این پروژه متصل شده است. هر محصول را فقط یکبار می‌توانید اضافه کنید.`
                                              );
                                              return;
                                            }

                                            const next = [...projectForm.chandeliersList];
                                            next[chIdx] = {
                                              name: prod.name,
                                              code: prod.productCode,
                                              image: prod.image,
                                              desc: prod.subtitle || prod.description || '',
                                              price: prod.priceFormatted || 'استعلام قیمت از گالری',
                                            };
                                            setProjectForm({ ...projectForm, chandeliersList: next });
                                            setChandelierSearchQueries((prev) => ({
                                              ...prev,
                                              [chIdx]: prod.name,
                                            }));
                                            setActiveChandelierSearchIdx(null);
                                          }}
                                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#faf7f2] cursor-pointer transition-colors border border-transparent hover:border-[#ebdcc5]"
                                        >
                                          <img
                                            src={prod.image}
                                            alt={prod.name}
                                            className="w-11 h-11 rounded-lg object-contain bg-[#f9f9f9] border border-[#eee] shrink-0"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                              <h4 className="text-xs font-bold text-[#1e1e1e] truncate">{prod.name}</h4>
                                              <span className="text-[10px] font-bold text-[#a68452] bg-[#fbf8f2] px-1.5 py-0.5 rounded border border-[#edd9be] shrink-0">
                                                کد: {prod.productCode}
                                              </span>
                                            </div>
                                            <p className="text-[10px] text-[#777] truncate mt-0.5">
                                              {prod.priceFormatted || prod.subtitle}
                                            </p>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* ۲. کارت پیش‌نمایش محصول متصل‌شده (عکس و مشخصات لوستر انتخابی) */}
                            {chItem.name && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-[#faf7f0] to-[#f4eee2] border border-[#e5d8c3]">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="relative w-14 h-14 rounded-lg bg-white p-1 border border-[#deb887]/50 shrink-0 shadow-2xs flex items-center justify-center">
                                    <img
                                      src={chItem.image || GENERATED_IMAGES.crystaliCherub}
                                      alt={chItem.name}
                                      className="w-full h-full object-contain"
                                    />
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center text-[9px] font-bold">
                                      ✓
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-[10px] font-black text-[#a68452] bg-[#ebdcc5]/60 px-2 py-0.5 rounded-md">
                                        کد کالا: {chItem.code || '۱۲۸۹'}
                                      </span>
                                      {chItem.price && (
                                        <span className="text-[10px] font-bold text-[#1e1e1e] bg-white px-2 py-0.5 rounded-md border border-[#e0d6c5]">
                                          قیمت محصول: {chItem.price}
                                        </span>
                                      )}
                                      <span className="text-[10px] text-[#10b981] font-bold">
                                        ● پیش‌نمایش متصل به پروژه
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-black text-[#1a1814] truncate mt-1">
                                      {chItem.name}
                                    </h4>
                                    {chItem.desc && (
                                      <p className="text-[11px] text-[#666] truncate mt-0.5">
                                        {chItem.desc}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setActiveChandelierSearchIdx(chIdx)}
                                  className="self-end sm:self-auto text-[11px] font-bold text-[#a68452] hover:text-[#1e1e1e] bg-white px-3 py-1.5 rounded-lg border border-[#d5c6ab] cursor-pointer shrink-0 transition-colors shadow-2xs"
                                >
                                  تغییر یا انتخاب مجدد
                                </button>
                              </div>
                            )}

                            {/* ۳. فیلدهای جزئیات و دکمه حذف */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1 border-t border-[#f2ede4]">
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[10px] font-bold text-[#555]">نام لوستر در پروژه:</label>
                                <input
                                  type="text"
                                  value={chItem.name}
                                  onChange={(e) => {
                                    const next = [...projectForm.chandeliersList];
                                    next[chIdx].name = e.target.value;
                                    setProjectForm({ ...projectForm, chandeliersList: next });
                                  }}
                                  placeholder="نام لوستر"
                                  className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold"
                                />
                              </div>

                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-[#555]">کد محصول:</label>
                                <input
                                  type="text"
                                  value={chItem.code}
                                  onChange={(e) => {
                                    const next = [...projectForm.chandeliersList];
                                    next[chIdx].code = e.target.value;
                                    setProjectForm({ ...projectForm, chandeliersList: next });
                                  }}
                                  placeholder="کد"
                                  className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold"
                                />
                              </div>

                              <div className="sm:col-span-5 space-y-1">
                                <label className="text-[10px] font-bold text-[#555]">تصویر و آدرس عکس:</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    dir="ltr"
                                    value={chItem.image}
                                    onChange={(e) => {
                                      const next = [...projectForm.chandeliersList];
                                      next[chIdx].image = e.target.value;
                                      setProjectForm({ ...projectForm, chandeliersList: next });
                                    }}
                                    placeholder="URL تصویر..."
                                    className="flex-1 h-9 rounded-lg border border-[#e0e0e0] px-2 text-[11px] text-left"
                                  />
                                  <label className="h-9 px-2.5 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0">
                                    <Upload className="w-3 h-3" />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) =>
                                        handleFileUploadToDataUrl(
                                          e.target.files?.[0],
                                          (dataUrl) => {
                                            const next = [...projectForm.chandeliersList];
                                            next[chIdx].image = dataUrl;
                                            setProjectForm({ ...projectForm, chandeliersList: next });
                                          }
                                        )
                                      }
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className="sm:col-span-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = projectForm.chandeliersList.filter((_, i) => i !== chIdx);
                                    setProjectForm({ ...projectForm, chandeliersList: next });
                                  }}
                                  className="h-9 px-3 rounded-lg bg-[#fde8ea] text-[#ea1d2c] hover:bg-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#777] italic">
                      هنوز لوستری به این پروژه اضافه نشده است. روی دکمه «افزودن لوستر به پروژه» کلیک کنید یا از سرچ‌بار محصول جستجو نمایید.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="h-11 px-6 rounded-xl bg-[#b59766] hover:bg-[#9f8252] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  {isSavingProject ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        {editingProjectId
                          ? 'در حال ذخیره تغییرات پروژه...'
                          : 'در حال ثبت پروژه جدید در وب سایت...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>
                        {editingProjectId
                          ? 'ویرایش پروژه اجرایی در وب سایت'
                          : 'ثبت پروژه در وب سایت'}
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* ۳. دیو لیست پروژه‌ها همراه با صفحه‌بندی ۱۰ تایی از جدیدترین‌ها و آمار لایک کاربران */}
              {(() => {
                const filteredProjects = projectsList.filter((p) => {
                  const matchesCategory = adminProjectCategoryFilter === 'all' || p.categoryTab === adminProjectCategoryFilter;
                  const matchesSearch = !adminProjectSearchQuery.trim() || 
                    (p.title || '').toLowerCase().includes(adminProjectSearchQuery.toLowerCase()) ||
                    (p.description || '').toLowerCase().includes(adminProjectSearchQuery.toLowerCase()) ||
                    (p.district || '').toLowerCase().includes(adminProjectSearchQuery.toLowerCase()) ||
                    (p.sampleCode || '').toLowerCase().includes(adminProjectSearchQuery.toLowerCase()) ||
                    (p.slug || '').toLowerCase().includes(adminProjectSearchQuery.toLowerCase());
                  return matchesCategory && matchesSearch;
                });
                const sortedAdminProjects = [...filteredProjects].sort(
                  (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
                );
                const ADMIN_PROJECTS_PER_PAGE = 10;
                const totalAdminProjectPages = Math.max(
                  1,
                  Math.ceil(sortedAdminProjects.length / ADMIN_PROJECTS_PER_PAGE)
                );
                const currentAdminProjects = sortedAdminProjects.slice(
                  (adminProjectsPage - 1) * ADMIN_PROJECTS_PER_PAGE,
                  adminProjectsPage * ADMIN_PROJECTS_PER_PAGE
                );

                const getCatCount = (catId: string) => {
                  if (catId === 'all') return projectsList.length;
                  return projectsList.filter((p) => p.categoryTab === catId).length;
                };

                return (
                  <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efefef] pb-3">
                      <div>
                        <h3 className="text-sm font-black text-[#1e1e1e]">
                          پروژه‌های اجرایی در دیتابیس ({projectsList.length.toLocaleString('fa-IR')} پروژه)
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          نمایش ۱۰ پروژه در هر صفحه به‌ترتیب از جدیدترین‌ها (صفحه {adminProjectsPage.toLocaleString('fa-IR')} از {totalAdminProjectPages.toLocaleString('fa-IR')})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#b59766] bg-[#fbf8f2] px-3 py-1.5 rounded-lg border border-[#edd9be]">
                          هر صفحه: ۱۰ پروژه جدید
                        </span>
                      </div>
                    </div>

                    {/* فیلتر جستجوی پروژه‌ها با فیلد ورودی مدرن در تمام دسته‌بندی‌ها */}
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-[#a68452] absolute right-3 pointer-events-none" />
                      <input
                        type="text"
                        value={adminProjectSearchQuery}
                        onChange={(e) => {
                          setAdminProjectSearchQuery(e.target.value);
                          setAdminProjectsPage(1);
                        }}
                        placeholder="جستجوی سریع پروژه در تمام بخش‌ها (نام، توضیحات، منطقه، کد نمونه یا اسلاگ)..."
                        className="w-full h-10 pr-10 pl-8 rounded-xl border border-[#d5c6ab] text-xs font-semibold bg-[#faf8f4] text-[#1e1e1e] placeholder:text-[#999] focus:outline-none focus:border-[#b59766] focus:bg-white transition-all shadow-2xs"
                      />
                      {adminProjectSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setAdminProjectSearchQuery('');
                            setAdminProjectsPage(1);
                          }}
                          className="absolute left-2.5 text-[#999] hover:text-[#333] p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* فیلتر دسته‌بندی پروژه‌ها در پنل ادمین */}
                    <div className="flex flex-wrap items-center gap-2 pb-1">
                      {[
                        { id: 'all', label: 'همه دسته‌ها' },
                        { id: 'gov', label: 'ارگان‌های دولتی' },
                        { id: 'commercial', label: 'ارگان‌های تجاری' },
                        { id: 'mosques', label: 'مساجد و حسینیه‌ها' },
                        { id: 'restaurants', label: 'رستوران‌ها' },
                        { id: 'residential', label: 'منازل مسکونی' },
                      ].map((catTab) => {
                        const isCatSelected = adminProjectCategoryFilter === catTab.id;
                        const cCount = getCatCount(catTab.id);
                        return (
                          <button
                            key={catTab.id}
                            type="button"
                            onClick={() => {
                              setAdminProjectCategoryFilter(catTab.id);
                              setAdminProjectsPage(1);
                            }}
                            className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              isCatSelected
                                ? 'bg-[#1a1814] text-white shadow-xs'
                                : 'bg-[#faf8f4] text-[#666] hover:bg-[#ebdcc5] border border-[#e5d8c3]'
                            }`}
                          >
                            <span>{catTab.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              isCatSelected ? 'bg-[#b59766] text-white' : 'bg-[#eee] text-[#555]'
                            }`}>
                              {cCount.toLocaleString('fa-IR')}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {currentAdminProjects.length === 0 ? (
                      <p className="text-xs text-[#777] py-6 text-center">پروژه‌ای برای نمایش وجود ندارد.</p>
                    ) : (
                      <div className="space-y-3">
                        {currentAdminProjects.map((proj) => {
                          const likesCount =
                            projectLikesMap[proj.slug] ??
                            projectLikesMap[proj.id] ??
                            (Number(proj.likesCount) || 0);

                          return (
                            <div
                              key={proj.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#efefef] bg-white hover:border-[#d9cbba] transition-colors"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <img
                                  src={proj.mainImage || GENERATED_IMAGES.projectRoyalRestaurant}
                                  alt={proj.title}
                                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#eee]"
                                />
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-[#1e1e1e] truncate">
                                      {proj.title}
                                    </h4>
                                    {proj.slug && (
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f0f0f0] text-[#555] dir-ltr">
                                        /{proj.slug}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-[#666] truncate">
                                    دسته: {proj.categoryTab} • منطقه: {proj.district} • {proj.sampleCode}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {/* آمار دقیق لایک‌های کاربران */}
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-[11px] font-black">
                                      <Heart className="w-3.5 h-3.5 fill-[#e11d48]" />
                                      <span>{likesCount.toLocaleString('fa-IR')} لایک کاربر</span>
                                    </div>

                                    {/* دکمه‌های سریع افزایش لایک از پنل ادمین */}
                                    <button
                                      type="button"
                                      onClick={() => handleQuickAdjustProjectLikes(proj, 10)}
                                      className="h-6 px-2 text-[10.5px] font-bold rounded-md bg-[#fff5f5] hover:bg-[#ffe4e6] text-[#e11d48] border border-[#fecdd3] transition-colors cursor-pointer"
                                      title="افزودن ۱۰ لایک به این پروژه"
                                    >
                                      +۱۰ لایک
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickAdjustProjectLikes(proj, 50)}
                                      className="h-6 px-2 text-[10.5px] font-bold rounded-md bg-[#fff5f5] hover:bg-[#ffe4e6] text-[#e11d48] border border-[#fecdd3] transition-colors cursor-pointer"
                                      title="افزودن ۵۰ لایک به این پروژه"
                                    >
                                      +۵۰ لایک
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickAdjustProjectLikes(proj, 0, true)}
                                      className="h-6 px-2 text-[10px] font-bold rounded-md bg-[#f5f5f5] hover:bg-gray-200 text-[#777] border border-[#e0e0e0] transition-colors cursor-pointer"
                                      title="صفر کردن لایک‌های پروژه"
                                    >
                                      صفر
                                    </button>

                                    <span className="text-[10px] text-[#888] bg-[#f9f9f9] px-2 py-1 rounded-md border border-[#eee]">
                                      شناسه پروژه: #{proj.id}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                {/* دکمه مشاهده و اتصال مستقیم به /project */}
                                <a
                                  href={`#project/${proj.slug || proj.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToProjectSlug(proj.slug || proj.id);
                                  }}
                                  className="h-9 px-3 rounded-lg bg-[#faf7f2] hover:bg-[#b59766] text-[#8f6e3c] hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-[#edd9be]"
                                  title="مشاهده مستقیم پروژه در سایت"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>مشاهده در سایت</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProjectId(proj.id);
                                    let parsedChs: any[] = [];

                                    // ۱. بررسی آرایه مستقیم در آبجکت پروژه
                                    if (Array.isArray(proj.chandeliersList) && proj.chandeliersList.length > 0) {
                                      parsedChs = proj.chandeliersList;
                                    } else if (proj.usedChandeliersText) {
                                      // ۲. بررسی تگ داده‌های لوستر
                                      const tagMatch = proj.usedChandeliersText.match(/<!--CHANDELIERS_DATA-->([\s\S]*?)<!--\/CHANDELIERS_DATA-->/);
                                      if (tagMatch) {
                                        try {
                                          const arr = JSON.parse(tagMatch[1]);
                                          if (Array.isArray(arr) && arr.length > 0) parsedChs = arr;
                                        } catch {}
                                      }

                                      // ۳. بررسی جی‌سان انتهای متن یا در کل متن
                                      if (parsedChs.length === 0) {
                                        const jsonMatch = proj.usedChandeliersText.match(/\[\s*\{[\s\S]*\}\s*\]/);
                                        if (jsonMatch) {
                                          try {
                                            const arr = JSON.parse(jsonMatch[0]);
                                            if (Array.isArray(arr) && arr.length > 0) parsedChs = arr;
                                          } catch {}
                                        }
                                      }
                                    }

                                    // ۴. در صورتی که لوستری نبود اما پروژه نمونه دارای usedProducts بود
                                    if (parsedChs.length === 0 && Array.isArray((proj as any).usedProducts) && (proj as any).usedProducts.length > 0) {
                                      parsedChs = (proj as any).usedProducts.map((up: any) => ({
                                        name: up.name || 'لوستر سفارشی صالحی',
                                        code: up.productId ? String(up.productId).replace(/^prod-/, '') : '۱۲۸۹',
                                        image: up.image || GENERATED_IMAGES.crystaliGold,
                                        desc: up.price || 'کلکسیون اختصاصی گالری صالحی',
                                      }));
                                    }

                                    const cleanText = (proj.usedChandeliersText || '')
                                      .replace(/<!--CHANDELIERS_DATA-->[\s\S]*?<!--\/CHANDELIERS_DATA-->/g, '')
                                      .replace(/(\n|^)\s*\[\s*\{[\s\S]*\}\s*\]\s*$/g, '')
                                      .trim();

                                    setProjectForm({
                                      title: proj.title || '',
                                      slug: proj.slug || '',
                                      categoryTab: proj.categoryTab || 'residential',
                                      district: proj.district || (proj as any).locationBadge || '',
                                      sampleCode: proj.sampleCode || 'نمونه ۱',
                                      dateBadge: (proj as any).dateBadge || '',
                                      ownerName: (proj as any).ownerName || '',
                                      description: proj.description || '',
                                      usedChandeliersText: cleanText,
                                      mainImage: proj.mainImage || '',
                                      galleryImages: Array.isArray(proj.galleryImages) && proj.galleryImages.length > 0 ? proj.galleryImages : (proj.mainImage ? [proj.mainImage] : []),
                                      chandeliersList: parsedChs,
                                      likesCount: Number(proj.likesCount) || 0,
                                      stylesJson: (proj as any).stylesJson || '{}',
                                    });
                                    window.scrollTo({ top: 350, behavior: 'smooth' });
                                  }}
                                  className="h-9 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>ویرایش</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* کنترل‌های صفحه‌بندی ۵ تایی پروژه‌ها */}
                    {totalAdminProjectPages > 1 && (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#efefef]">
                        <span className="text-xs text-[#666]">
                          صفحه {adminProjectsPage.toLocaleString('fa-IR')} از {totalAdminProjectPages.toLocaleString('fa-IR')} ({sortedAdminProjects.length.toLocaleString('fa-IR')} پروژه کل)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={adminProjectsPage <= 1}
                            onClick={() => setAdminProjectsPage((p) => Math.max(1, p - 1))}
                            className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              adminProjectsPage <= 1
                                ? 'bg-[#f0f0f0] text-[#aaa] cursor-not-allowed'
                                : 'bg-white border border-[#d5c6ab] text-[#333] hover:bg-[#b59766] hover:text-white'
                            }`}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span>صفحه قبل</span>
                          </button>

                          {Array.from({ length: totalAdminProjectPages }, (_, i) => i + 1).map((pgNum) => (
                            <button
                              key={pgNum}
                              type="button"
                              onClick={() => setAdminProjectsPage(pgNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                adminProjectsPage === pgNum
                                  ? 'bg-[#b59766] text-white shadow-xs'
                                  : 'bg-white border border-[#e0e0e0] text-[#555] hover:bg-[#f5f5f5]'
                              }`}
                            >
                              {pgNum.toLocaleString('fa-IR')}
                            </button>
                          ))}

                          <button
                            type="button"
                            disabled={adminProjectsPage >= totalAdminProjectPages}
                            onClick={() => setAdminProjectsPage((p) => Math.min(totalAdminProjectPages, p + 1))}
                            className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              adminProjectsPage >= totalAdminProjectPages
                                ? 'bg-[#f0f0f0] text-[#aaa] cursor-not-allowed'
                                : 'bg-white border border-[#d5c6ab] text-[#333] hover:bg-[#b59766] hover:text-white'
                            }`}
                          >
                            <span>صفحه بعد</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ۶. تب استوری‌های بالای سایت (پشتیبانی از دسته‌بندی استوری و تا ۱۰ استوری با تایپ‌های مختلف در هر دسته‌بندی) */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* ستون راست: فرم ساخت و ویرایش دسته‌بندی استوری و استوری‌های داخل آن (تا ۱۰ استوری) */}
                <form
                  onSubmit={handleSaveStory}
                  className="xl:col-span-8 bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-5 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base font-black text-[#1e1e1e]">
                        {editingStoryId
                          ? 'ویرایش دسته‌بندی و استوری‌های داخل آن در سایت'
                          : 'افزودن و انتشار استوری جدید در سایت'}
                      </h2>
                      <p className="text-xs text-[#777] mt-1">
                        می‌توانید یک دسته‌بندی استوری انتخاب یا ایجاد کنید و در هر دسته‌بندی تا ۱۰ استوری با تایپ‌های مختلف (محصول‌دار، ساده، ویدیویی) قرار دهید.
                      </p>
                    </div>
                    {(editingStoryId || selectedTargetCategoryId !== 'new') && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStoryId(null);
                          setSelectedTargetCategoryId('new');
                          setCategorySlides([]);
                          setActiveSlideEditIdx(0);
                          setStoryForm({
                            storyType: 'single-product',
                            title: '',
                            slideTitle: '',
                            thumbnailImage: GENERATED_IMAGES.crystaliCherub,
                            mediaUrl: GENERATED_IMAGES.storyPortraitPalace,
                            videoUrl:
                              'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                            linkedProductKey:
                              productsList[0]?.productKey || 'prod-crystali',
                          });
                        }}
                        className="h-9 px-3.5 rounded-xl bg-[#fde8ea] text-[#ea1d2c] text-xs font-bold cursor-pointer hover:bg-[#ea1d2c] hover:text-white transition-colors"
                      >
                        انصراف و ساخت دسته‌بندی جدید
                      </button>
                    )}
                  </div>

                  {/* بخش ۰: انتخاب دسته‌بندی استوری (ایجاد دسته‌بندی جدید یا افزودن به دسته‌بندی‌های موجود تا سقف ۱۰ استوری) */}
                  <div className="p-4 rounded-2xl bg-[#f7f3eb] border border-[#dfcfb3] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-black text-[#1e1e1e]">
                        دسته‌بندی استوری در نوار بالای صفحه اصلی (ظرفیت هر دسته‌بندی: حداکثر ۱۰ استوری):
                      </label>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#1a1814] text-[#d4b27c] font-bold">
                        {Math.max(1, categorySlides.length).toLocaleString('fa-IR')} از ۱۰ استوری در این دسته‌بندی
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="block text-[11px] font-bold text-[#555] mb-1">
                          انتخاب دسته‌بندی استوری موجود یا ساخت دسته‌بندی جدید:
                        </span>
                        <select
                          value={
                            editingStoryId
                              ? editingStoryId
                              : selectedTargetCategoryId
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'new') {
                              setEditingStoryId(null);
                              setSelectedTargetCategoryId('new');
                              setCategorySlides([]);
                              setActiveSlideEditIdx(0);
                              setStoryForm({
                                storyType: 'single-product',
                                title: '',
                                slideTitle: '',
                                thumbnailImage: GENERATED_IMAGES.crystaliCherub,
                                mediaUrl: GENERATED_IMAGES.storyPortraitPalace,
                                videoUrl:
                                  'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                                linkedProductKey:
                                  productsList[0]?.productKey || 'prod-crystali',
                              });
                            } else {
                              const numId = Number(val);
                              const foundCat = storiesList.find(
                                (s) => s.id === numId
                              );
                              if (foundCat) {
                                const existingSlides =
                                  parseStorySlidesFromRow(foundCat);
                                if (existingSlides.length >= 10) {
                                  showNotice(
                                    'error',
                                    'این دسته‌بندی دارای ۱۰ استوری است و ظرفیت آن تکمیل می‌باشد.'
                                  );
                                }
                                setEditingStoryId(foundCat.id);
                                setSelectedTargetCategoryId(foundCat.id);
                                const nextSlides =
                                  existingSlides.length < 10
                                    ? [
                                        ...existingSlides,
                                        {
                                          id: `slide-${Date.now()}`,
                                          type: 'single-product' as const,
                                          title: foundCat.title || '',
                                          mediaUrl:
                                            GENERATED_IMAGES.storyPortraitPalace,
                                          videoUrl:
                                            'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                                          linkedProductKey:
                                            productsList[0]?.productKey ||
                                            'prod-crystali',
                                        },
                                      ]
                                    : existingSlides;
                                setCategorySlides(nextSlides);
                                const targetIdx = nextSlides.length - 1;
                                setActiveSlideEditIdx(targetIdx);
                                const activeSl = nextSlides[targetIdx];
                                setStoryForm({
                                  storyType: activeSl.type,
                                  title: foundCat.title || '',
                                  slideTitle: activeSl.title || foundCat.title || '',
                                  thumbnailImage:
                                    foundCat.thumbnailImage ||
                                    foundCat.image ||
                                    GENERATED_IMAGES.crystaliCherub,
                                  mediaUrl:
                                    activeSl.mediaUrl ||
                                    GENERATED_IMAGES.storyPortraitPalace,
                                  videoUrl:
                                    activeSl.videoUrl ||
                                    'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                                  linkedProductKey:
                                    activeSl.linkedProductKey ||
                                    productsList[0]?.productKey ||
                                    'prod-crystali',
                                });
                              }
                            }
                          }}
                          className="w-full h-11 rounded-xl border border-[#c9b48e] px-3 text-xs font-bold bg-white text-[#1e1e1e]"
                        >
                          <option value="new">
                            + ایجاد دسته‌بندی استوری جدید در سایت
                          </option>
                          {storiesList.map((st) => {
                            const sCount = parseStorySlidesFromRow(st).length;
                            return (
                              <option key={st.id} value={st.id}>
                                دسته‌بندی: {st.title} ({sCount.toLocaleString('fa-IR')} از ۱۰ استوری)
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <span className="block text-[11px] font-bold text-[#555] mb-1">
                          عنوان دسته‌بندی استوری (زیر دایره در صفحه اصلی سایت):
                        </span>
                        <input
                          type="text"
                          required
                          value={storyForm.title}
                          onChange={(e) =>
                            setStoryForm({
                              ...storyForm,
                              title: e.target.value,
                              slideTitle:
                                storyForm.slideTitle || e.target.value,
                            })
                          }
                          placeholder="مثلاً: کلکسیون لوستر سلطنتی / پروژه الهیه..."
                          className="w-full h-11 rounded-xl border border-[#c9b48e] bg-white px-3.5 text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#b59766]"
                        />
                      </div>
                    </div>

                    {/* نوار مدیریت چند استوری داخل همین دسته‌بندی (۱ تا ۱۰ استوری با تایپ‌های مختلف) */}
                    <div className="pt-2 border-t border-[#e5d8c0] space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#444]">
                          استوری‌های داخل این دسته‌بندی (هر استوری می‌تواند تایپ محصول‌دار، ساده یا ویدیویی داشته باشد):
                        </span>
                        <button
                          type="button"
                          disabled={categorySlides.length >= 10}
                          onClick={handleAddCurrentSlideToCategoryBuffer}
                          className={`h-8 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            categorySlides.length >= 10
                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                              : 'bg-[#1a1814] hover:bg-[#b59766] text-white'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            {categorySlides.length >= 10
                              ? 'تکمیل ظرفیت (۱۰ از ۱۰ استوری)'
                              : 'افزودن استوری دیگر به این دسته‌بندی'}
                          </span>
                        </button>
                      </div>

                      {categorySlides.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          {categorySlides.map((sl, sIdx) => {
                            const isCurrent = sIdx === activeSlideEditIdx;
                            const typeLabel =
                              sl.type === 'single-product'
                                ? 'محصول‌دار'
                                : sl.type === 'image-only'
                                ? 'ساده'
                                : 'ویدیو';
                            return (
                              <div
                                key={sl.id}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                                  isCurrent
                                    ? 'bg-[#1a1814] text-[#d4b27c] border-[#b59766]'
                                    : 'bg-white text-[#333] border-[#dcd3c2]'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    // ابتدا اسلاید فعلی را در آرایه ذخیره کنیم
                                    const updated = [...categorySlides];
                                    if (
                                      activeSlideEditIdx >= 0 &&
                                      activeSlideEditIdx < updated.length
                                    ) {
                                      updated[activeSlideEditIdx] = {
                                        ...updated[activeSlideEditIdx],
                                        type: storyForm.storyType,
                                        title:
                                          storyForm.slideTitle ||
                                          storyForm.title,
                                        mediaUrl: storyForm.mediaUrl,
                                        videoUrl: storyForm.videoUrl,
                                        linkedProductKey:
                                          storyForm.linkedProductKey,
                                      };
                                      setCategorySlides(updated);
                                    }
                                    const target = updated[sIdx] || sl;
                                    setActiveSlideEditIdx(sIdx);
                                    setStoryForm((prev) => ({
                                      ...prev,
                                      storyType: target.type,
                                      slideTitle: target.title || prev.title,
                                      mediaUrl: target.mediaUrl,
                                      videoUrl: target.videoUrl,
                                      linkedProductKey: target.linkedProductKey,
                                    }));
                                  }}
                                  className="cursor-pointer"
                                >
                                  استوری {(sIdx + 1).toLocaleString('fa-IR')} ({typeLabel})
                                </button>
                                {categorySlides.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = categorySlides.filter(
                                        (_, i) => i !== sIdx
                                      );
                                      setCategorySlides(next);
                                      const nextIdx = Math.max(
                                        0,
                                        Math.min(activeSlideEditIdx, next.length - 1)
                                      );
                                      setActiveSlideEditIdx(nextIdx);
                                      if (next[nextIdx]) {
                                        setStoryForm((prev) => ({
                                          ...prev,
                                          storyType: next[nextIdx].type,
                                          slideTitle: next[nextIdx].title,
                                          mediaUrl: next[nextIdx].mediaUrl,
                                          videoUrl: next[nextIdx].videoUrl,
                                          linkedProductKey:
                                            next[nextIdx].linkedProductKey,
                                        }));
                                      }
                                    }}
                                    className="text-[#ea1d2c] hover:opacity-80 cursor-pointer"
                                    title="حذف این استوری از دسته‌بندی"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ۱. انتخابگر ۳ تایپ استوری برای استوری فعال داخل این دسته‌بندی */}
                  <div>
                    <label className="block text-xs font-black text-[#1e1e1e] mb-2.5">
                      ۱. انتخاب تایپ استوری (برای استوری شماره {(activeSlideEditIdx + 1).toLocaleString('fa-IR')} در این دسته‌بندی):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* تایپ ۱: استوری متصل به محصول */}
                      <button
                        type="button"
                        onClick={() =>
                          setStoryForm({
                            ...storyForm,
                            storyType: 'single-product',
                            linkedProductKey:
                              storyForm.linkedProductKey ||
                              productsList[0]?.productKey ||
                              'prod-crystali',
                          })
                        }
                        className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                          storyForm.storyType === 'single-product'
                            ? 'bg-[#1a1814] text-white border-[#b59766] shadow-md'
                            : 'bg-[#faf8f4] text-[#333] border-[#e6decb] hover:border-[#b59766]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black">
                            ۱. استوری محصول‌دار
                          </span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              storyForm.storyType === 'single-product'
                                ? 'bg-[#d4b27c]'
                                : 'bg-[#ccc]'
                            }`}
                          />
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            storyForm.storyType === 'single-product'
                              ? 'text-white/75'
                              : 'text-[#666]'
                          }`}
                        >
                          عکس شاخص + عنوان + تصویر اصلی استوری + اتصال به محصول مربوطه
                        </p>
                      </button>

                      {/* تایپ ۲: استوری ساده تصویری */}
                      <button
                        type="button"
                        onClick={() =>
                          setStoryForm({
                            ...storyForm,
                            storyType: 'image-only',
                          })
                        }
                        className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                          storyForm.storyType === 'image-only'
                            ? 'bg-[#1a1814] text-white border-[#b59766] shadow-md'
                            : 'bg-[#faf8f4] text-[#333] border-[#e6decb] hover:border-[#b59766]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black">
                            ۲. استوری ساده
                          </span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              storyForm.storyType === 'image-only'
                                ? 'bg-[#d4b27c]'
                                : 'bg-[#ccc]'
                            }`}
                          />
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            storyForm.storyType === 'image-only'
                              ? 'text-white/75'
                              : 'text-[#666]'
                          }`}
                        >
                          عکس شاخص + عنوان + تصویر اصلی استوری (بدون اتصال به محصول)
                        </p>
                      </button>

                      {/* تایپ ۳: استوری ویدیویی */}
                      <button
                        type="button"
                        onClick={() =>
                          setStoryForm({
                            ...storyForm,
                            storyType: 'video',
                            videoUrl:
                              storyForm.videoUrl ||
                              'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                          })
                        }
                        className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                          storyForm.storyType === 'video'
                            ? 'bg-[#1a1814] text-white border-[#b59766] shadow-md'
                            : 'bg-[#faf8f4] text-[#333] border-[#e6decb] hover:border-[#b59766]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black">
                            ۳. استوری ویدیویی
                          </span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              storyForm.storyType === 'video'
                                ? 'bg-[#d4b27c]'
                                : 'bg-[#ccc]'
                            }`}
                          />
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            storyForm.storyType === 'video'
                              ? 'text-white/75'
                              : 'text-[#666]'
                          }`}
                        >
                          تصویر شاخص + عنوان + ویدیوی استوری (پخش ویدیو در استوری)
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* ۲. فیلد عنوان اختصاصی این استوری در بالای قاب */}
                  <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-2">
                    <label className="block text-xs font-black text-[#1e1e1e]">
                      ۲. عنوان این استوری در بالای قاب بازشده:
                    </label>
                    <input
                      type="text"
                      value={storyForm.slideTitle || storyForm.title}
                      onChange={(e) =>
                        setStoryForm({
                          ...storyForm,
                          slideTitle: e.target.value,
                          title: storyForm.title || e.target.value,
                        })
                      }
                      placeholder="مثلاً: لوستر کریستالی شاه ملکه / نمای تالار فرشته / ویدیو آبکاری..."
                      className="w-full h-11 rounded-xl border border-[#dcd3c2] bg-white px-3.5 text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#b59766]"
                    />
                  </div>

                  {/* ۳. فیلد عکس شاخص (دایره استوری و آواتار بالا) */}
                  <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-[#1e1e1e]">
                        ۳. عکس شاخص استوری (تصویر داخل دایره استوری در سایت و آواتار بالا)
                      </label>
                      <label className="h-8 px-3 rounded-lg bg-[#1e1e1e] hover:bg-[#b59766] text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                        <span>آپلود عکس شاخص از سیستم</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUploadToDataUrl(
                              e.target.files?.[0],
                              (dataUrl) =>
                                setStoryForm((prev) => ({
                                  ...prev,
                                  thumbnailImage: dataUrl,
                                }))
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="block text-[11px] font-bold text-[#666] mb-1">
                          انتخاب سریع از تصاویر گالری:
                        </span>
                        <select
                          value={
                            PRESET_PRODUCT_IMAGES.some(
                              (img) => img.url === storyForm.thumbnailImage
                            ) ||
                            PRESET_STORY_MAIN_IMAGES.some(
                              (img) => img.url === storyForm.thumbnailImage
                            )
                              ? storyForm.thumbnailImage
                              : ''
                          }
                          onChange={(e) => {
                            if (e.target.value) {
                              setStoryForm({
                                ...storyForm,
                                thumbnailImage: e.target.value,
                              });
                            }
                          }}
                          className="w-full h-11 rounded-xl border border-[#dcd3c2] px-3 text-xs font-semibold bg-white"
                        >
                          <option value="">-- انتخاب تصویر آماده --</option>
                          {PRESET_PRODUCT_IMAGES.map((img, i) => (
                            <option key={`thumb-p-${i}`} value={img.url}>
                              {img.label}
                            </option>
                          ))}
                          {PRESET_PROJECT_IMAGES.map((img, i) => (
                            <option key={`thumb-pr-${i}`} value={img.url}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="block text-[11px] font-bold text-[#666] mb-1">
                          یا آدرس مستقیم تصویر شاخص (URL):
                        </span>
                        <input
                          type="text"
                          value={storyForm.thumbnailImage}
                          onChange={(e) =>
                            setStoryForm({
                              ...storyForm,
                              thumbnailImage: e.target.value,
                            })
                          }
                          placeholder="آدرس تصویر شاخص..."
                          dir="ltr"
                          className="w-full h-11 rounded-xl border border-[#dcd3c2] bg-white px-3 text-xs font-medium text-left"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ۴. فیلد تصویر اصلی استوری (مخصوص تایپ ۱ و تایپ ۲) یا ویدیوی استوری (مخصوص تایپ ۳) */}
                  {storyForm.storyType !== 'video' ? (
                    <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-[#1e1e1e]">
                          ۴. تصویر اصلی استوری (عکس بزرگی که بعد از باز شدن استوری در سایت نمایش داده می‌شود)
                        </label>
                        <label className="h-8 px-3 rounded-lg bg-[#1e1e1e] hover:bg-[#b59766] text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                          <span>آپلود تصویر اصلی از سیستم</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUploadToDataUrl(
                                e.target.files?.[0],
                                (dataUrl) =>
                                  setStoryForm((prev) => ({
                                    ...prev,
                                    mediaUrl: dataUrl,
                                  }))
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="block text-[11px] font-bold text-[#666] mb-1">
                            انتخاب سریع از قاب‌های استوری آماده:
                          </span>
                          <select
                            value={
                              PRESET_STORY_MAIN_IMAGES.some(
                                (img) => img.url === storyForm.mediaUrl
                              )
                                ? storyForm.mediaUrl
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value) {
                                setStoryForm({
                                  ...storyForm,
                                  mediaUrl: e.target.value,
                                });
                              }
                            }}
                            className="w-full h-11 rounded-xl border border-[#dcd3c2] px-3 text-xs font-semibold bg-white"
                          >
                            <option value="">-- انتخاب قاب اصلی استوری --</option>
                            {PRESET_STORY_MAIN_IMAGES.map((img, i) => (
                              <option key={`main-st-${i}`} value={img.url}>
                                {img.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="block text-[11px] font-bold text-[#666] mb-1">
                            یا آدرس مستقیم تصویر اصلی استوری (URL):
                          </span>
                          <input
                            type="text"
                            value={storyForm.mediaUrl}
                            onChange={(e) =>
                              setStoryForm({
                                ...storyForm,
                                mediaUrl: e.target.value,
                              })
                            }
                            placeholder="آدرس تصویر اصلی استوری..."
                            dir="ltr"
                            className="w-full h-11 rounded-xl border border-[#dcd3c2] bg-white px-3 text-xs font-medium text-left"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* فیلد ویدیو مخصوص تایپ ۳ (استوری ویدیویی) */
                    <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-[#1e1e1e]">
                          ۴. ویدیوی استوری (فایل یا لینک ویدیوی MP4 / WebM برای نمایش در سایت)
                        </label>
                        <label className="h-8 px-3 rounded-lg bg-[#1e1e1e] hover:bg-[#b59766] text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                          <span>آپلود فایل ویدیو از سیستم</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUploadToDataUrl(
                                e.target.files?.[0],
                                (dataUrl) =>
                                  setStoryForm((prev) => ({
                                    ...prev,
                                    videoUrl: dataUrl,
                                  }))
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="block text-[11px] font-bold text-[#666] mb-1">
                            انتخاب از ویدیوهای نمونه لوستر:
                          </span>
                          <select
                            value={
                              PRESET_STORY_VIDEOS.some(
                                (v) => v.url === storyForm.videoUrl
                              )
                                ? storyForm.videoUrl
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value) {
                                setStoryForm({
                                  ...storyForm,
                                  videoUrl: e.target.value,
                                });
                              }
                            }}
                            className="w-full h-11 rounded-xl border border-[#dcd3c2] px-3 text-xs font-semibold bg-white"
                          >
                            <option value="">-- انتخاب ویدیوی آماده --</option>
                            {PRESET_STORY_VIDEOS.map((vid, i) => (
                              <option key={`vid-${i}`} value={vid.url}>
                                {vid.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="block text-[11px] font-bold text-[#666] mb-1">
                            یا لینک مستقیم ویدیو (MP4 URL):
                          </span>
                          <input
                            type="text"
                            value={storyForm.videoUrl}
                            onChange={(e) =>
                              setStoryForm({
                                ...storyForm,
                                videoUrl: e.target.value,
                              })
                            }
                            placeholder="https://.../video.mp4"
                            dir="ltr"
                            className="w-full h-11 rounded-xl border border-[#dcd3c2] bg-white px-3 text-xs font-medium text-left"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ۵. فیلد اتصال به محصول مربوطه (فقط در تایپ ۱: استوری محصول‌دار) */}
                  {storyForm.storyType === 'single-product' && (
                    <div className="p-4 rounded-2xl bg-[#f5efe4] border border-[#d8c7a8] space-y-3">
                      <label className="block text-xs font-black text-[#1e1e1e]">
                        ۵. اتصال استوری به محصول مربوطه در سایت (نمایش کارت خرید محصول در پایین استوری)
                      </label>
                      <select
                        value={storyForm.linkedProductKey}
                        onChange={(e) =>
                          setStoryForm({
                            ...storyForm,
                            linkedProductKey: e.target.value,
                          })
                        }
                        className="w-full h-11 rounded-xl border border-[#c9b48e] px-3.5 text-xs font-bold bg-white text-[#1e1e1e] focus:outline-none focus:border-[#b59766]"
                      >
                        {productsList.map((prod) => {
                          const pKey = prod.productKey || `prod-${prod.id}`;
                          return (
                            <option key={prod.id} value={pKey}>
                              {prod.name} — کد: {prod.productCode} ({prod.priceFormatted})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {editingStoryId
                          ? 'ذخیره تغییرات استوری در سایت'
                          : 'ثبت و انتشار استوری در سایت'}
                      </span>
                    </button>
                  </div>
                </form>

                {/* ستون چپ: پیش‌نمایش زنده قاب استوری دقیقاً مطابق نمایش در سایت */}
                <div className="xl:col-span-4 bg-white rounded-[22px] border border-[#e7dfd1] p-5 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between border-b border-[#efefef] pb-3 mb-4">
                    <span className="text-xs font-black text-[#1e1e1e]">
                      پیش‌نمایش زنده استوری در سایت
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#f5efe4] text-[#8c6f41] font-bold">
                      {storyForm.storyType === 'single-product'
                        ? 'تایپ ۱: متصل به محصول'
                        : storyForm.storyType === 'image-only'
                        ? 'تایپ ۲: استوری ساده'
                        : 'تایپ ۳: استوری ویدیویی'}
                    </span>
                  </div>

                  {/* پیش‌نمایش دایره استوری در نوار بالای صفحه اصلی */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-16 h-16 rounded-full p-[2px] border-2 border-[#b59766] bg-white overflow-hidden shadow-xs">
                      <img
                        src={
                          storyForm.thumbnailImage ||
                          GENERATED_IMAGES.crystaliCherub
                        }
                        alt={storyForm.title || 'عکس شاخص'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#1e1e1e] mt-1.5 max-w-[110px] truncate">
                      {storyForm.title || 'عنوان دسته‌بندی'}
                    </span>
                    <span className="text-[10px] text-[#888]">
                      نمای دایره در صفحه اصلی سایت ({Math.max(1, categorySlides.length).toLocaleString('fa-IR')} استوری)
                    </span>
                  </div>

                  {/* پیش‌نمایش قاب بازشده استوری */}
                  {(() => {
                    const previewLinkedProd =
                      productsList.find(
                        (p) =>
                          (p.productKey || `prod-${p.id}`) ===
                          storyForm.linkedProductKey
                      ) || productsList[0];
                    const totalPreviewSegments = Math.max(
                      1,
                      categorySlides.length
                    );

                    return (
                      <div className="relative w-[265px] h-[430px] rounded-[20px] overflow-hidden bg-[#181614] shadow-xl flex flex-col justify-between border border-[#2c2824]">
                        {/* تصویر اصلی یا ویدیو در پس‌زمینه قاب */}
                        {storyForm.storyType === 'video' ? (
                          <video
                            key={storyForm.videoUrl}
                            src={storyForm.videoUrl}
                            poster={storyForm.thumbnailImage}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={
                              storyForm.mediaUrl ||
                              storyForm.thumbnailImage ||
                              GENERATED_IMAGES.storyPortraitPalace
                            }
                            alt={storyForm.title || 'پیش‌نمایش استوری'}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}

                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none z-10" />
                        {storyForm.storyType === 'single-product' && (
                          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none z-10" />
                        )}

                        {/* هدر بالای قاب استوری: نوارهای پیشرفت چندگانه + عکس شاخص + عنوان */}
                        <div className="relative z-20 p-3">
                          <div className="flex items-center gap-1 mb-2.5" dir="ltr">
                            {Array.from({ length: totalPreviewSegments }).map(
                              (_, segIdx) => (
                                <div
                                  key={segIdx}
                                  className="flex-1 h-1 rounded-full bg-white/35 overflow-hidden"
                                >
                                  <div
                                    className={`h-full bg-white rounded-full ${
                                      segIdx <= activeSlideEditIdx
                                        ? 'w-full'
                                        : 'w-0'
                                    }`}
                                  />
                                </div>
                              )
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full p-[1.5px] border border-[#b59766] bg-white overflow-hidden shrink-0">
                                <img
                                  src={
                                    storyForm.thumbnailImage ||
                                    GENERATED_IMAGES.crystaliCherub
                                  }
                                  alt=""
                                  className="w-full h-full rounded-full object-cover"
                                />
                              </div>
                              <div className="text-right">
                                <p className="text-[11px] font-bold text-white leading-tight">
                                  {storyForm.slideTitle ||
                                    storyForm.title ||
                                    'عنوان استوری'}
                                </p>
                                <p className="text-[9.5px] text-white/80 mt-0.5">
                                  زمان باقی‌مانده : ۰۰:۱۰
                                </p>
                              </div>
                            </div>
                            <span className="h-6 px-2.5 rounded-full bg-black/45 text-white text-[9.5px] font-bold flex items-center">
                              بستن صفحه
                            </span>
                          </div>
                        </div>

                        {/* فوتر پایین قاب استوری: فقط در تایپ ۱ (محصول‌دار) */}
                        {storyForm.storyType === 'single-product' &&
                          previewLinkedProd && (
                            <div className="relative z-20 p-3">
                              <div className="w-full bg-white rounded-[13px] p-2 shadow-lg flex items-center gap-2.5">
                                <div className="w-11 h-11 rounded-lg bg-[#f4f4f4] p-1 shrink-0 overflow-hidden">
                                  <img
                                    src={previewLinkedProd.image}
                                    alt={previewLinkedProd.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0 flex-1 text-right">
                                  <p className="text-[11.5px] font-bold text-[#141414] truncate">
                                    {previewLinkedProd.name}
                                  </p>
                                  <p className="text-[10px] font-medium text-[#2b2b2b] mt-0.5 truncate">
                                    قیمت : {previewLinkedProd.priceFormatted}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* لیست استوری‌های ثبت‌شده در سایت (جدیدترین‌ها بالا + صفحه‌بندی ۱۰ تایی) */}
              {(() => {
                const filteredStories = storiesList.filter((st) => {
                  if (storyFilterType === 'all') return true;
                  const slidesArr = parseStorySlidesFromRow(st);
                  return (
                    (st.storyType || 'single-product') === storyFilterType ||
                    slidesArr.some((sl) => sl.type === storyFilterType)
                  );
                });
                const totalStoryPages = Math.max(
                  1,
                  Math.ceil(filteredStories.length / STORIES_PER_PAGE)
                );
                const safeCurrentStoryPage = Math.min(
                  storyPage,
                  totalStoryPages
                );
                const paginatedStories = filteredStories.slice(
                  (safeCurrentStoryPage - 1) * STORIES_PER_PAGE,
                  safeCurrentStoryPage * STORIES_PER_PAGE
                );

                return (
                  <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-3.5">
                      <div>
                        <h3 className="text-sm font-black text-[#1e1e1e]">
                          استوری‌های ثبت‌شده در سایت ({filteredStories.length.toLocaleString('fa-IR')})
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          مرتب‌شده از جدیدترین به قدیمی‌ترین (نمایش ۱۰ استوری در هر صفحه)
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: 'all', label: 'همه استوری‌های سایت' },
                          { id: 'single-product', label: '۱. متصل به محصول' },
                          { id: 'image-only', label: '۲. استوری ساده' },
                          { id: 'video', label: '۳. استوری ویدیویی' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              setStoryFilterType(tab.id as any);
                              setStoryPage(1);
                            }}
                            className={`h-8 px-3 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                              storyFilterType === tab.id
                                ? 'bg-[#1a1814] text-[#d4b27c]'
                                : 'bg-[#f5f3ef] text-[#555] hover:bg-[#eae5dc]'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {paginatedStories.map((st, rowIdx) => {
                        const slidesInCat = parseStorySlidesFromRow(st);
                        const stType: 'single-product' | 'image-only' | 'video' =
                          st.storyType === 'image-only'
                            ? 'image-only'
                            : st.storyType === 'video'
                            ? 'video'
                            : 'single-product';
                        const thumbUrl = st.thumbnailImage || st.image;
                        const mainMedia = st.mediaUrl || st.image;
                        const connectedProd = productsList.find(
                          (p) =>
                            (p.productKey || `prod-${p.id}`) ===
                              st.linkedProductKey ||
                            p.productCode === st.linkedProductKey
                        );
                        const globalIndex =
                          (safeCurrentStoryPage - 1) * STORIES_PER_PAGE +
                          rowIdx +
                          1;

                        return (
                          <div
                            key={st.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-2xl border border-[#efefef] hover:border-[#d8c7a8] transition-colors"
                          >
                            <div className="flex items-center gap-3.5">
                              {/* شماره ردیف (جدیدترین‌ها از ۱ در بالا) */}
                              <span className="w-7 h-7 rounded-lg bg-[#f6f2ea] text-[#8c6f41] text-xs font-black flex items-center justify-center shrink-0 tabular-nums">
                                {globalIndex.toLocaleString('fa-IR')}
                              </span>

                              {/* تصویر شاخص دایره‌ای */}
                              <div className="relative shrink-0">
                                <img
                                  src={thumbUrl}
                                  alt={st.title}
                                  title="عکس شاخص استوری"
                                  className="w-13 h-13 rounded-full object-cover border-2 border-[#b59766]"
                                />
                              </div>

                              {/* تصویر اصلی یا پیش‌نمایش ویدیو */}
                              <div className="w-11 h-14 rounded-lg overflow-hidden bg-[#181614] border border-[#e0d6c3] shrink-0 flex items-center justify-center">
                                {stType === 'video' ? (
                                  <PlayCircle className="w-5 h-5 text-[#d4b27c]" />
                                ) : (
                                  <img
                                    src={mainMedia}
                                    alt=""
                                    title="تصویر اصلی استوری"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-sm font-bold text-[#1e1e1e]">
                                    {st.title}
                                  </h4>
                                  <span className="text-[10.5px] px-2.5 py-0.5 rounded-md bg-[#1a1814] text-[#d4b27c] font-bold">
                                    {slidesInCat.length.toLocaleString('fa-IR')} از ۱۰ استوری در این دسته
                                  </span>
                                  <span
                                    className={`text-[10.5px] px-2.5 py-0.5 rounded-md font-bold ${
                                      stType === 'single-product'
                                        ? 'bg-[#f5efe4] text-[#8c6f41]'
                                        : stType === 'image-only'
                                        ? 'bg-stone-100 text-stone-700'
                                        : 'bg-amber-950 text-[#e2c48e]'
                                    }`}
                                  >
                                    {stType === 'single-product'
                                      ? 'استوری محصول‌دار'
                                      : stType === 'image-only'
                                      ? 'استوری ساده'
                                      : 'استوری ویدیویی'}
                                  </span>
                                </div>

                                <p className="text-xs text-[#666] mt-1">
                                  {stType === 'single-product'
                                    ? `متصل به محصول در سایت: ${
                                        connectedProd
                                          ? `${connectedProd.name} (${connectedProd.priceFormatted})`
                                          : st.linkedProductKey || 'لوستر منتخب'
                                      }`
                                    : stType === 'image-only'
                                    ? 'استوری ساده تصویری در سایت (بدون باکس محصول)'
                                    : `استوری ویدیویی فعال در سایت`}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
                              {slidesInCat.length < 10 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextSlides = [
                                      ...slidesInCat,
                                      {
                                        id: `slide-${Date.now()}`,
                                        type: 'single-product' as const,
                                        title: st.title || '',
                                        mediaUrl:
                                          GENERATED_IMAGES.storyPortraitPalace,
                                        videoUrl:
                                          'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                                        linkedProductKey:
                                          productsList[0]?.productKey ||
                                          'prod-crystali',
                                      },
                                    ];
                                    setEditingStoryId(st.id);
                                    setSelectedTargetCategoryId(st.id);
                                    setCategorySlides(nextSlides);
                                    const newIdx = nextSlides.length - 1;
                                    setActiveSlideEditIdx(newIdx);
                                    setStoryForm({
                                      storyType: 'single-product',
                                      title: st.title || '',
                                      slideTitle: st.title || '',
                                      thumbnailImage:
                                        st.thumbnailImage ||
                                        st.image ||
                                        GENERATED_IMAGES.crystaliCherub,
                                      mediaUrl:
                                        GENERATED_IMAGES.storyPortraitPalace,
                                      videoUrl:
                                        'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                                      linkedProductKey:
                                        productsList[0]?.productKey ||
                                        'prod-crystali',
                                    });
                                    window.scrollTo({
                                      top: 0,
                                      behavior: 'smooth',
                                    });
                                  }}
                                  className="h-9 px-3 rounded-lg bg-[#f5efe4] hover:bg-[#b59766] text-[#8c6f41] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>افزودن استوری به این دسته</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStoryId(st.id);
                                  setSelectedTargetCategoryId(st.id);
                                  setCategorySlides(slidesInCat);
                                  setActiveSlideEditIdx(0);
                                  const firstSl = slidesInCat[0];
                                  setStoryForm({
                                    storyType: firstSl?.type || stType,
                                    title: st.title || '',
                                    slideTitle:
                                      firstSl?.title || st.title || '',
                                    thumbnailImage:
                                      st.thumbnailImage ||
                                      st.image ||
                                      GENERATED_IMAGES.crystaliCherub,
                                    mediaUrl:
                                      firstSl?.mediaUrl ||
                                      st.mediaUrl ||
                                      st.image ||
                                      GENERATED_IMAGES.storyPortraitPalace,
                                    videoUrl:
                                      firstSl?.videoUrl ||
                                      st.videoUrl ||
                                      'https://assets.mixkit.co/videos/preview/mixkit-golden-chandelier-hanging-from-the-ceiling-41645-large.mp4',
                                    linkedProductKey:
                                      firstSl?.linkedProductKey ||
                                      st.linkedProductKey ||
                                      productsList[0]?.productKey ||
                                      'prod-crystali',
                                  });
                                  window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                  });
                                }}
                                className="h-9 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>ویرایش</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStory(st.id)}
                                className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* صفحه‌بندی ۱۰ تایی استوری‌ها */}
                    {totalStoryPages > 1 && (
                      <div className="pt-4 border-t border-[#efefef] flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-bold text-[#666]">
                          صفحه {safeCurrentStoryPage.toLocaleString('fa-IR')} از{' '}
                          {totalStoryPages.toLocaleString('fa-IR')} (نمایش ۱۰ استوری در هر صفحه)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={safeCurrentStoryPage <= 1}
                            onClick={() =>
                              setStoryPage((p) => Math.max(1, p - 1))
                            }
                            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              safeCurrentStoryPage <= 1
                                ? 'bg-[#f5f5f5] text-[#bbb] cursor-not-allowed'
                                : 'bg-[#f5efe4] text-[#8c6f41] hover:bg-[#1a1814] hover:text-white'
                            }`}
                          >
                            صفحه قبل
                          </button>

                          {Array.from({ length: totalStoryPages }).map(
                            (_, pIdx) => {
                              const pNum = pIdx + 1;
                              return (
                                <button
                                  key={pNum}
                                  type="button"
                                  onClick={() => setStoryPage(pNum)}
                                  className={`w-9 h-9 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                                    safeCurrentStoryPage === pNum
                                      ? 'bg-[#1a1814] text-[#d4b27c]'
                                      : 'bg-[#f5f5f5] text-[#444] hover:bg-[#eaeaea]'
                                  }`}
                                >
                                  {pNum.toLocaleString('fa-IR')}
                                </button>
                              );
                            }
                          )}

                          <button
                            type="button"
                            disabled={safeCurrentStoryPage >= totalStoryPages}
                            onClick={() =>
                              setStoryPage((p) =>
                                Math.min(totalStoryPages, p + 1)
                              )
                            }
                            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              safeCurrentStoryPage >= totalStoryPages
                                ? 'bg-[#f5f5f5] text-[#bbb] cursor-not-allowed'
                                : 'bg-[#f5efe4] text-[#8c6f41] hover:bg-[#1a1814] hover:text-white'
                            }`}
                          >
                            صفحه بعد
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ۷. تب مقالات مجله (افزودن، ویرایش و حذف) */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveArticle}
                className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#efefef] pb-3">
                  <h2 className="text-base font-black text-[#1e1e1e]">
                    {editingArticleId
                      ? 'ویرایش مقاله مجله لوستر'
                      : 'انتشار مقاله جدید در مجله لوستر'}
                  </h2>
                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={() => setEditingArticleId(null)}
                      className="text-xs font-bold text-[#ea1d2c] cursor-pointer"
                    >
                      انصراف از ویرایش
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, title: e.target.value })
                    }
                    placeholder="عنوان مقاله..."
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={articleForm.category}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        category: e.target.value,
                      })
                    }
                    placeholder="دسته‌بندی مقاله (مثلاً: راهنمای خرید)"
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={articleForm.image}
                          onChange={(e) =>
                            setArticleForm({
                              ...articleForm,
                              image: e.target.value,
                            })
                          }
                          className="flex-1 h-11 rounded-xl border border-[#e0e0e0] px-3 text-xs font-semibold bg-white focus:outline-none focus:border-[#b59766]"
                        >
                          <option value="">-- انتخاب تصویر آماده --</option>
                          {PRESET_PROJECT_IMAGES.map((img, i) => (
                            <option key={i} value={img.url}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                        <label className="h-11 px-4 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUploadToDataUrl(
                                e.target.files?.[0],
                                (dataUrl) =>
                                  setArticleForm((prev) => ({
                                    ...prev,
                                    image: dataUrl,
                                  }))
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={articleForm.excerpt}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, excerpt: e.target.value })
                  }
                  placeholder="خلاصه کوتاه مقاله..."
                  className="w-full h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                />
                <textarea
                  rows={4}
                  value={articleForm.content}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, content: e.target.value })
                  }
                  placeholder="متن کامل مقاله (هر پاراگراف در یک خط)..."
                  className="w-full rounded-xl border border-[#e0e0e0] p-3.5 text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingArticleId ? 'ذخیره تغییرات مقاله' : 'انتشار مقاله'}
                  </span>
                </button>
              </form>

              <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-3">
                <h3 className="text-sm font-black text-[#1e1e1e] mb-3">
                  مقالات منتشرشده در دیتابیس ({articlesList.length.toLocaleString('fa-IR')})
                </h3>
                {articlesList.map((art) => (
                  <div
                    key={art.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl border border-[#efefef]"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#1e1e1e]">
                          {art.title}
                        </h4>
                        <p className="text-xs text-[#666] mt-0.5">
                          {art.category} • {art.publishDate} • {art.readTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingArticleId(art.id);
                          setArticleForm({
                            title: art.title || '',
                            excerpt: art.excerpt || '',
                            content: Array.isArray(art.fullContent)
                              ? art.fullContent.join('\n')
                              : art.excerpt || '',
                            category: art.category || 'راهنمای خرید',
                            readTime: art.readTime || '۵ دقیقه مطالعه',
                            publishDate: art.publishDate || '۱۵ شهریور ۱۴۰۴',
                            image: art.image || GENERATED_IMAGES.projectFereshteh,
                            featured: Boolean(art.featured),
                          });
                        }}
                        className="h-9 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ویرایش</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art.id)}
                        className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ۸. تب پیام‌های تماس با ما (فقط خواندنی + نمایش ۵ پیام در هر صفحه) */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {(() => {
                const totalMessagePages = Math.max(
                  1,
                  Math.ceil(messagesList.length / MESSAGES_PER_PAGE)
                );
                const safeCurrentMessagePage = Math.min(
                  messagePage,
                  totalMessagePages
                );
                const paginatedMessages = messagesList.slice(
                  (safeCurrentMessagePage - 1) * MESSAGES_PER_PAGE,
                  safeCurrentMessagePage * MESSAGES_PER_PAGE
                );

                return (
                  <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-3.5">
                      <div>
                        <h2 className="text-base font-black text-[#1e1e1e]">
                          پیام‌های ارسالی فرم تماس با ما و مشاوره ({messagesList.length.toLocaleString('fa-IR')})
                        </h2>
                        <p className="text-xs text-[#777] mt-1">
                          نمایش ۵ پیام در هر صفحه • برای خواندن متن کامل، روی «مشاهده و خواندن پیام» کلیک کنید (فقط خواندنی)
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#f7f3eb] text-[#8c6f41] border border-[#e5d8c0] self-start sm:self-auto">
                        صفحه {safeCurrentMessagePage.toLocaleString('fa-IR')} از{' '}
                        {totalMessagePages.toLocaleString('fa-IR')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {paginatedMessages.map((msg, idx) => {
                        const globalMsgIndex =
                          (safeCurrentMessagePage - 1) * MESSAGES_PER_PAGE +
                          idx +
                          1;
                        return (
                          <div
                            key={msg.id}
                            onClick={() => handleOpenAndReadMessage(msg)}
                            className="p-4 rounded-2xl border border-[#efefef] hover:border-[#b59766] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer bg-[#fcfbf9]/60 hover:bg-white"
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              <span className="w-7 h-7 rounded-lg bg-[#f6f2ea] text-[#8c6f41] text-xs font-black flex items-center justify-center shrink-0 tabular-nums mt-0.5">
                                {globalMsgIndex.toLocaleString('fa-IR')}
                              </span>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-[#1e1e1e]">
                                    {msg.fullName}
                                  </span>
                                  <span
                                    dir="ltr"
                                    className="text-xs font-bold text-[#b59766] tabular-nums"
                                  >
                                    ({msg.phone})
                                  </span>
                                  {msg.email && (
                                    <span
                                      dir="ltr"
                                      className="text-xs font-semibold text-[#666] font-sans"
                                    >
                                      {msg.email}
                                    </span>
                                  )}
                                  <span
                                    className={`text-[10.5px] px-2 py-0.5 rounded-md font-bold ${
                                      msg.status === 'new'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    }`}
                                  >
                                    {msg.status === 'new'
                                      ? 'پیام جدید (خوانده‌نشده)'
                                      : 'خوانده شده'}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-[#555] mt-1">
                                  موضوع: {msg.subject}
                                </p>
                                <p className="text-xs text-[#444] mt-1 leading-6 line-clamp-1">
                                  {msg.message}
                                </p>
                              </div>
                            </div>

                            <div
                              className="flex items-center gap-2 self-end sm:self-auto shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleOpenAndReadMessage(msg)}
                                className="h-9 px-3.5 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>مشاهده و خواندن پیام</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleMessageStatus(msg.id, msg.status)
                                }
                                className="h-9 px-3 rounded-lg bg-[#f4f4f4] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>تغییر وضعیت</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* صفحه‌بندی ۵ تایی لیست پیام‌ها */}
                    {totalMessagePages > 1 && (
                      <div className="pt-4 border-t border-[#efefef] flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-bold text-[#666]">
                          صفحه {safeCurrentMessagePage.toLocaleString('fa-IR')} از{' '}
                          {totalMessagePages.toLocaleString('fa-IR')} (نمایش ۵ پیام در هر صفحه)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={safeCurrentMessagePage <= 1}
                            onClick={() =>
                              setMessagePage((p) => Math.max(1, p - 1))
                            }
                            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              safeCurrentMessagePage <= 1
                                ? 'bg-[#f5f5f5] text-[#bbb] cursor-not-allowed'
                                : 'bg-[#f5efe4] text-[#8c6f41] hover:bg-[#1a1814] hover:text-white'
                            }`}
                          >
                            صفحه قبل
                          </button>

                          {Array.from({ length: totalMessagePages }).map(
                            (_, pIdx) => {
                              const pNum = pIdx + 1;
                              return (
                                <button
                                  key={pNum}
                                  type="button"
                                  onClick={() => setMessagePage(pNum)}
                                  className={`w-9 h-9 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                                    safeCurrentMessagePage === pNum
                                      ? 'bg-[#1a1814] text-[#d4b27c]'
                                      : 'bg-[#f5f5f5] text-[#444] hover:bg-[#eaeaea]'
                                  }`}
                                >
                                  {pNum.toLocaleString('fa-IR')}
                                </button>
                              );
                            }
                          )}

                          <button
                            type="button"
                            disabled={
                              safeCurrentMessagePage >= totalMessagePages
                            }
                            onClick={() =>
                              setMessagePage((p) =>
                                Math.min(totalMessagePages, p + 1)
                              )
                            }
                            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              safeCurrentMessagePage >= totalMessagePages
                                ? 'bg-[#f5f5f5] text-[#bbb] cursor-not-allowed'
                                : 'bg-[#f5efe4] text-[#8c6f41] hover:bg-[#1a1814] hover:text-white'
                            }`}
                          >
                            صفحه بعد
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ۹. تب سفارشات مشتریان (افزودن، ویرایش، تغییر وضعیت و حذف) */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveOrder}
                className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#efefef] pb-3">
                  <h2 className="text-base font-black text-[#1e1e1e]">
                    {editingOrderId
                      ? 'ویرایش سفارش مشتری در دیتابیس'
                      : 'ثبت سفارش جدید در دیتابیس'}
                  </h2>
                  {editingOrderId && (
                    <button
                      type="button"
                      onClick={() => setEditingOrderId(null)}
                      className="text-xs font-bold text-[#ea1d2c] cursor-pointer"
                    >
                      انصراف از ویرایش
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    value={orderForm.customerName}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        customerName: e.target.value,
                      })
                    }
                    placeholder="نام و نام خانوادگی مشتری"
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    required
                    value={orderForm.customerPhone}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        customerPhone: e.target.value,
                      })
                    }
                    placeholder="شماره تماس مشتری"
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                  <input
                    type="number"
                    required
                    value={orderForm.totalAmountNumeric}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        totalAmountNumeric: Number(e.target.value),
                      })
                    }
                    placeholder="مبلغ کل سفارش (تومان)"
                    className="h-11 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingOrderId ? 'ذخیره تغییرات سفارش' : 'ثبت سفارش'}
                  </span>
                </button>
              </form>

              <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 space-y-3">
                <h2 className="text-base font-black text-[#1e1e1e] mb-4">
                  سفارشات ثبت‌شده مشتریان ({ordersList.length.toLocaleString('fa-IR')})
                </h2>
                {ordersList.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-[#efefef] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#1e1e1e]">
                          {ord.customerName}
                        </span>
                        <span className="text-xs text-[#666]">
                          ({ord.customerPhone})
                        </span>
                        <span className="text-xs font-bold text-[#b59766]">
                          {ord.totalPriceFormatted || ord.totalAmountFormatted}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#777] mt-1">
                        وضعیت فعلی:{' '}
                        {ord.status === 'completed'
                          ? 'تکمیل و ارسال شده'
                          : 'در انتظار بررسی'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingOrderId(ord.id);
                          setOrderForm({
                            customerName: ord.customerName || '',
                            customerPhone: ord.customerPhone || '',
                            totalAmountFormatted:
                              ord.totalPriceFormatted ||
                              ord.totalAmountFormatted ||
                              '۱۲,۵۰۰,۰۰۰ تومان',
                            totalAmountNumeric:
                              Number(
                                ord.totalPriceNumeric ?? ord.totalAmountNumeric
                              ) || 12500000,
                            status: ord.status || 'pending',
                          });
                        }}
                        className="h-9 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#1e1e1e] text-[#333] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ویرایش</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateOrderStatus(
                            ord.id,
                            ord.status === 'completed' ? 'pending' : 'completed'
                          )
                        }
                        className="h-9 px-3.5 rounded-lg bg-[#b59766] text-white text-xs font-bold cursor-pointer"
                      >
                        {ord.status === 'completed'
                          ? 'بازگردانی به در انتظار'
                          : 'تایید و تکمیل سفارش'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="h-9 px-3 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ۱۰. منوی تنظیمات وب سایت (با ۷ تب مجزا و خالی آماده تکمیل) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* نوار تب‌های تنظیمات وب سایت (اسکرول افقی به عرض بدون شکستن خط) */}
              <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-3.5 sm:p-4 overflow-hidden">
                <div
                  className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 touch-pan-x [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {WEBSITE_SETTINGS_SUBTABS.map((subTab) => {
                    const isSubActive = activeWebsiteSettingsTab === subTab.id;
                    return (
                      <button
                        key={subTab.id}
                        type="button"
                        onClick={() => setActiveWebsiteSettingsTab(subTab.id)}
                        className={`shrink-0 whitespace-nowrap h-10 px-4 sm:px-5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-[#1a1814] text-[#d4b27c] shadow-xs ring-1 ring-[#d4b27c]/20'
                            : 'bg-[#f6f3ec] text-[#444] hover:bg-[#ece5d8]'
                        }`}
                      >
                        {subTab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* محتوای تب انتخاب‌شده در تنظیمات وب سایت */}
              {activeWebsiteSettingsTab === 'footer' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingFooterSettings(true);
                    try {
                      const saved = await authFetch(
                        '/api/admin/settings/footer',
                        {
                          method: 'PUT',
                          body: JSON.stringify(footerSettingsForm),
                        }
                      );
                      setFooterSettingsForm({
                        ...INITIAL_FOOTER_SETTINGS,
                        ...saved,
                      });
                      onCatalogUpdated?.();
                      showNotice(
                        'success',
                        'تنظیمات فوتر سایت با موفقیت ذخیره و در وب‌سایت اعمال شد.'
                      );
                    } catch (err: any) {
                      showNotice(
                        'error',
                        err?.message || 'خطا در ذخیره تنظیمات فوتر سایت'
                      );
                    } finally {
                      setIsSavingFooterSettings(false);
                    }
                  }}
                  className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 sm:p-8 space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#181818]">
                        تنظیمات فوتر وب‌سایت
                      </h2>
                      <p className="text-xs text-[#666] mt-1">
                        تغییر رنگ دیو فوتر، متن توضیحات، شماره‌های تماس، لینک شبکه‌های اجتماعی، کد اینماد، تصویر سایر مجوزها و متن کلیه حقوق
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isSavingFooterSettings}
                        onClick={async () => {
                          setFooterSettingsForm(INITIAL_FOOTER_SETTINGS);
                          setIsSavingFooterSettings(true);
                          try {
                            const saved = await authFetch(
                              '/api/admin/settings/footer',
                              {
                                method: 'PUT',
                                body: JSON.stringify(INITIAL_FOOTER_SETTINGS),
                              }
                            );
                            setFooterSettingsForm({
                              ...INITIAL_FOOTER_SETTINGS,
                              ...saved,
                            });
                            onCatalogUpdated?.();
                            showNotice(
                              'success',
                              'تنظیمات فوتر به مقادیر پیش‌فرض بازگردانی و در سایت ذخیره شد.'
                            );
                          } catch {
                            showNotice(
                              'success',
                              'فرم به مقادیر پیش‌فرض بازگردانی شد.'
                            );
                          } finally {
                            setIsSavingFooterSettings(false);
                          }
                        }}
                        className="h-10 px-4 rounded-xl border border-[#d8d0c3] hover:bg-[#f6f3ec] text-[#444] text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
                      >
                        بازگردانی به مقادیر پیش‌فرض
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingFooterSettings}
                        className="h-10 px-5 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        <span>
                          {isSavingFooterSettings
                            ? 'در حال ذخیره...'
                            : 'ذخیره تنظیمات فوتر'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ۱. تغییر رنگ دیو فوتر */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۱. رنگ دیو فوتر (باکس توضیحات و پس‌زمینه فوتر)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* رنگ دیو اصلی فوتر (باکس سمت راست) */}
                      <div className="space-y-4 bg-white p-4 rounded-xl border border-[#e7dfd1]">
                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-[#333]">
                            رنگ دیو اصلی فوتر (باکس VIP سمت راست):
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={footerSettingsForm.cardBgColor || '#b39561'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  cardBgColor: e.target.value,
                                })
                              }
                              className="w-12 h-11 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={footerSettingsForm.cardBgColor || '#b39561'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  cardBgColor: e.target.value,
                                })
                              }
                              placeholder="#b39561"
                              className="h-11 flex-1 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-bold text-left"
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-[#333]">
                            رنگ متن در باکس اصلی (پشتیبانی/توضیحات):
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={footerSettingsForm.descriptionParagraph1Color || '#ffffff'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  descriptionParagraph1Color: e.target.value,
                                })
                              }
                              className="w-12 h-11 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={footerSettingsForm.descriptionParagraph1Color || '#ffffff'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  descriptionParagraph1Color: e.target.value,
                                })
                              }
                              placeholder="#ffffff"
                              className="h-11 flex-1 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-bold text-left"
                            />
                          </div>
                        </div>
                      </div>

                      {/* رنگ دیو سمت چپ فوتر (بخش لینک‌ها و شماره‌ها) */}
                      <div className="space-y-4 bg-white p-4 rounded-xl border border-[#e7dfd1]">
                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-[#333]">
                            رنگ پس‌زمینه دیو سمت چپ فوتر (بخش لینک‌ها):
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={
                                footerSettingsForm.bottomCardBgColor || '#f7f6f2'
                              }
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  bottomCardBgColor: e.target.value,
                                })
                              }
                              className="w-12 h-11 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={
                                footerSettingsForm.bottomCardBgColor || '#f7f6f2'
                              }
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  bottomCardBgColor: e.target.value,
                                })
                              }
                              placeholder="#f7f6f2"
                              className="h-11 flex-1 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-bold text-left"
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-[#333]">
                            رنگ متن در باکس دوم (توضیحات/پشتیبانی):
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={footerSettingsForm.descriptionParagraph2Color || '#231f1c'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  descriptionParagraph2Color: e.target.value,
                                })
                              }
                              className="w-12 h-11 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={footerSettingsForm.descriptionParagraph2Color || '#231f1c'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  descriptionParagraph2Color: e.target.value,
                                })
                              }
                              placeholder="#231f1c"
                              className="h-11 flex-1 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-bold text-left"
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-[#333]">
                            رنگ عناوین ستون‌ها:
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={footerSettingsForm.columnTitleColor || '#222222'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  columnTitleColor: e.target.value,
                                })
                              }
                              className="w-12 h-11 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={footerSettingsForm.columnTitleColor || '#222222'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  columnTitleColor: e.target.value,
                                })
                              }
                              placeholder="#222222"
                              className="h-11 flex-1 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-bold text-left"
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-[#333]">
                            رنگ لینک‌های فوتر:
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={footerSettingsForm.columnLinkColor || '#1c1917'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  columnLinkColor: e.target.value,
                                })
                              }
                              className="w-12 h-11 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              dir="ltr"
                              value={footerSettingsForm.columnLinkColor || '#1c1917'}
                              onChange={(e) =>
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  columnLinkColor: e.target.value,
                                })
                              }
                              placeholder="#1c1917"
                              className="h-11 flex-1 rounded-xl border border-[#e0e0e0] px-3.5 text-xs font-bold text-left"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ۲. متن توضیحات فوتر */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۲. متن توضیحات فوتر
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#333]">
                          متن توضیحات اصلی (پاراگراف اول در باکس فوتر):
                        </label>
                        <textarea
                          rows={4}
                          value={footerSettingsForm.descriptionParagraph1}
                          onChange={(e) =>
                            setFooterSettingsForm({
                              ...footerSettingsForm,
                              descriptionParagraph1: e.target.value,
                            })
                          }
                          placeholder="متن توضیحات فوتر را وارد کنید..."
                          className="w-full rounded-xl border border-[#e0e0e0] bg-white p-3.5 text-xs font-semibold leading-7"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#333]">
                          متن خط دوم توضیحات (جمله پشتیبانی ۲۴ ساعته):
                        </label>
                        <input
                          type="text"
                          value={footerSettingsForm.descriptionParagraph2}
                          onChange={(e) =>
                            setFooterSettingsForm({
                              ...footerSettingsForm,
                              descriptionParagraph2: e.target.value,
                            })
                          }
                          placeholder="پشتیبانی ۲۴ ساعته لوستر صالحی در کنار شما همیشه هستیم :)"
                          className="w-full h-11 rounded-xl border border-[#e0e0e0] bg-white px-3.5 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ۳. ویرایش شماره‌های تماس فوتر */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۳. شماره‌های تماس مجموعه در فوتر
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          عنوان شعبه/بخش و شماره تلفن نمایش‌داده‌شده در ستون شماره‌های فوتر را ویرایش کنید
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFooterSettingsForm({
                            ...footerSettingsForm,
                            phones: [
                              ...footerSettingsForm.phones,
                              {
                                id: `ph-${Date.now()}`,
                                branchTitle: 'شعبه جدید',
                                displayPhone: '021-33459665',
                                phone: '02133459665',
                              },
                            ],
                          })
                        }
                        className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن شماره جدید</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {footerSettingsForm.phones.map((phoneItem, pIdx) => (
                        <div
                          key={phoneItem.id || `ph-row-${pIdx}`}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3.5 rounded-xl border border-[#e7dfd1]"
                        >
                          <div className="sm:col-span-5 space-y-1">
                            <label className="block text-[11px] font-bold text-[#666]">
                              عنوان شعبه / بخش (شماره {(pIdx + 1).toLocaleString('fa-IR')}):
                            </label>
                            <input
                              type="text"
                              value={phoneItem.branchTitle}
                              onChange={(e) => {
                                const updated = [...footerSettingsForm.phones];
                                updated[pIdx] = {
                                  ...updated[pIdx],
                                  branchTitle: e.target.value,
                                };
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  phones: updated,
                                });
                              }}
                              placeholder="مثلاً: شریعتی یا افسریه"
                              className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                            />
                          </div>

                          <div className="sm:col-span-6 space-y-1">
                            <label className="block text-[11px] font-bold text-[#666]">
                              شماره تماس:
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              value={phoneItem.displayPhone}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...footerSettingsForm.phones];
                                updated[pIdx] = {
                                  ...updated[pIdx],
                                  displayPhone: val,
                                  phone: val.replace(/[^0-9+]/g, ''),
                                };
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  phones: updated,
                                });
                              }}
                              placeholder="021-22222635"
                              className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold text-left tabular-nums"
                            />
                          </div>

                          <div className="sm:col-span-1 flex justify-end pt-4">
                            {footerSettingsForm.phones.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setFooterSettingsForm({
                                    ...footerSettingsForm,
                                    phones: footerSettingsForm.phones.filter(
                                      (_, i) => i !== pIdx
                                    ),
                                  })
                                }
                                title="حذف این شماره"
                                className="w-9 h-9 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ۴. لینک شبکه‌های اجتماعی فوتر */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۴. لینک شبکه‌های اجتماعی فوتر
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          لینک لینکدین (آیکون اول):
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={footerSettingsForm.linkedinUrl}
                          onChange={(e) =>
                            setFooterSettingsForm({
                              ...footerSettingsForm,
                              linkedinUrl: e.target.value,
                            })
                          }
                          placeholder="https://linkedin.com/in/..."
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold text-left"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          لینک واتساپ (آیکون دوم):
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={footerSettingsForm.whatsappUrl}
                          onChange={(e) =>
                            setFooterSettingsForm({
                              ...footerSettingsForm,
                              whatsappUrl: e.target.value,
                            })
                          }
                          placeholder="https://wa.me/98912..."
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold text-left"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          لینک اینستاگرام (آیکون سوم):
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={footerSettingsForm.instagramUrl}
                          onChange={(e) =>
                            setFooterSettingsForm({
                              ...footerSettingsForm,
                              instagramUrl: e.target.value,
                            })
                          }
                          placeholder="https://instagram.com/..."
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold text-left"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ۵. کد مجوز اینماد و تصاویر سایر مجوزها */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-5">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۵. مجوز اینماد (کد HTML) و تصاویر سایر مجوزهای فوتر
                    </h3>

                    {/* باکس ۱: کد مجوز اینماد */}
                    <div className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="block text-xs font-black text-[#181818]">
                          کد مجوز اینماد (جایگاه مجوز اول در فوتر):
                        </label>
                        {footerSettingsForm.enamadCode && (
                          <button
                            type="button"
                            onClick={() =>
                              setFooterSettingsForm({
                                ...footerSettingsForm,
                                enamadCode: '',
                              })
                            }
                            className="text-[11px] font-bold text-[#ea1d2c] cursor-pointer"
                          >
                            حذف کد اینماد (نمایش نشان پیش‌فرض)
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-[#777]">
                        کد دریافتی از سامانه اینماد (تگ <code>&lt;a&gt;...&lt;/a&gt;</code>) را در کادر زیر قرار دهید. در صورت خالی بودن، نشان پیش‌فرض نمایش داده می‌شود.
                      </p>
                      <textarea
                        rows={3}
                        dir="ltr"
                        value={footerSettingsForm.enamadCode}
                        onChange={(e) =>
                          setFooterSettingsForm({
                            ...footerSettingsForm,
                            enamadCode: e.target.value,
                          })
                        }
                        placeholder='<a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=..."><img src="https://trustseal.enamad.ir/logo.aspx?id=..." alt="" style="cursor:pointer" code="..."></a>'
                        className="w-full rounded-xl border border-[#e0e0e0] p-3 text-xs font-mono text-left bg-[#fcfbf9]"
                      />
                    </div>

                    {/* باکس‌های ۲، ۳ و ۴: آپلود عکس برای ۳ مجوز دیگر */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[0, 1, 2].map((licIdx) => {
                        const licItem = footerSettingsForm.otherLicenses[
                          licIdx
                        ] || {
                          id: `license-${licIdx + 2}`,
                          title: `مجوز شماره ${licIdx + 2}`,
                          imageUrl: '',
                          linkUrl: '',
                        };
                        return (
                          <div
                            key={licItem.id || `lic-box-${licIdx}`}
                            className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-[#181818]">
                                  تصویر مجوز {(licIdx + 2).toLocaleString('fa-IR')}
                                </span>
                                {licItem.imageUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextLicenses = [
                                        ...footerSettingsForm.otherLicenses,
                                      ];
                                      nextLicenses[licIdx] = {
                                        ...licItem,
                                        imageUrl: '',
                                      };
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        otherLicenses: nextLicenses,
                                      });
                                    }}
                                    className="text-[11px] font-bold text-[#ea1d2c] cursor-pointer"
                                  >
                                    حذف عکس
                                  </button>
                                )}
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-[#666]">
                                  عنوان مجوز:
                                </label>
                                <input
                                  type="text"
                                  value={licItem.title}
                                  onChange={(e) => {
                                    const nextLicenses = [
                                      ...footerSettingsForm.otherLicenses,
                                    ];
                                    nextLicenses[licIdx] = {
                                      ...licItem,
                                      title: e.target.value,
                                    };
                                    setFooterSettingsForm({
                                      ...footerSettingsForm,
                                      otherLicenses: nextLicenses,
                                    });
                                  }}
                                  placeholder="مثلاً: مجوز ساماندهی"
                                  className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold"
                                />
                              </div>

                              {/* پیش‌نمایش و دکمه آپلود عکس مجوز */}
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-xl border border-[#e0dacd] bg-[#faf8f4] flex items-center justify-center overflow-hidden shrink-0 p-1">
                                  {licItem.imageUrl ? (
                                    <img
                                      src={licItem.imageUrl}
                                      alt={licItem.title}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <span className="text-[10px] text-[#888] text-center leading-4">
                                      نشان پیش‌فرض
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 space-y-1.5">
                                  <label className="h-9 px-3 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>انتخاب عکس مجوز</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) =>
                                        handleFileUploadToDataUrl(
                                          e.target.files?.[0],
                                          (dataUrl) => {
                                            const nextLicenses = [
                                              ...footerSettingsForm.otherLicenses,
                                            ];
                                            nextLicenses[licIdx] = {
                                              ...licItem,
                                              imageUrl: dataUrl,
                                            };
                                            setFooterSettingsForm({
                                              ...footerSettingsForm,
                                              otherLicenses: nextLicenses,
                                            });
                                          }
                                        )
                                      }
                                    />
                                  </label>
                                  <input
                                    type="text"
                                    dir="ltr"
                                    value={licItem.imageUrl}
                                    onChange={(e) => {
                                      const nextLicenses = [
                                        ...footerSettingsForm.otherLicenses,
                                      ];
                                      nextLicenses[licIdx] = {
                                        ...licItem,
                                        imageUrl: e.target.value,
                                      };
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        otherLicenses: nextLicenses,
                                      });
                                    }}
                                    placeholder="یا آدرس تصویر (URL)..."
                                    className="w-full h-8 rounded-lg border border-[#e0e0e0] px-2 text-[11px] text-left"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-[#666]">
                                  لینک کلیک روی مجوز (اختیاری):
                                </label>
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={licItem.linkUrl || ''}
                                  onChange={(e) => {
                                    const nextLicenses = [
                                      ...footerSettingsForm.otherLicenses,
                                    ];
                                    nextLicenses[licIdx] = {
                                      ...licItem,
                                      linkUrl: e.target.value,
                                    };
                                    setFooterSettingsForm({
                                      ...footerSettingsForm,
                                      otherLicenses: nextLicenses,
                                    });
                                  }}
                                  placeholder="https://..."
                                  className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs text-left"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ۶. متن کلیه حقوق (کپی‌رایت فوتر) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-3">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۶. متن کلیه حقوق وب‌سایت (کپی‌رایت پایین فوتر)
                    </h3>
                    <input
                      type="text"
                      value={footerSettingsForm.copyrightText}
                      onChange={(e) =>
                        setFooterSettingsForm({
                          ...footerSettingsForm,
                          copyrightText: e.target.value,
                        })
                      }
                      placeholder="کلیه حقوق این سایت محفوظ و متعلق به لوستر اکبر صالحی است."
                      className="w-full h-11 rounded-xl border border-[#e0e0e0] bg-white px-3.5 text-xs font-bold"
                    />
                  </div>

                  {/* ۷. مدیریت عناوین و لینک‌های ستون‌های فوتر */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-5">
                    <div className="flex items-center justify-between border-b border-[#ece4d4] pb-2.5">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۷. مدیریت عناوین و لینک‌های ستون‌های فوتر
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          عناوین ستون‌های اول و دوم فوتر و لیست لینک‌های هر کدام را ویرایش و چیدمان کنید.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-[#b59766] bg-[#f2ecde] px-2.5 py-1 rounded-lg">
                        ستون‌های لینک فوتر
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* ستون اول */}
                      <div className="space-y-4 bg-white p-4 rounded-xl border border-[#e7dfd1]">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-[#333]">
                            عنوان ستون اول (دسترسی سریع تر):
                          </label>
                          <input
                            type="text"
                            value={footerSettingsForm.column1Title || ''}
                            onChange={(e) =>
                              setFooterSettingsForm({
                                ...footerSettingsForm,
                                column1Title: e.target.value,
                              })
                            }
                            placeholder="دسترسی سریع تر"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-[#b59766]">
                              لینک‌های ستون اول:
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const currentLinks = footerSettingsForm.column1Links || [];
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  column1Links: [
                                    ...currentLinks,
                                    {
                                      id: `col1-${Date.now()}`,
                                      label: 'لینک جدید',
                                      href: '/',
                                    },
                                  ],
                                });
                              }}
                              className="h-8 px-2.5 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>افزودن لینک</span>
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                            {(footerSettingsForm.column1Links || []).map((link, idx) => (
                              <div
                                key={link.id || `l1-edit-${idx}`}
                                className="flex flex-col sm:flex-row gap-2 bg-[#fcfbf9] p-3 rounded-lg border border-[#e7dfd1] items-stretch sm:items-center justify-between"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={link.label || ''}
                                    onChange={(e) => {
                                      const updated = [...(footerSettingsForm.column1Links || [])];
                                      updated[idx] = { ...updated[idx], label: e.target.value };
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column1Links: updated,
                                      });
                                    }}
                                    placeholder="عنوان لینک"
                                    className="h-8 rounded-md border border-[#e0e0e0] bg-white px-2 text-[11.5px] font-semibold"
                                  />
                                  <input
                                    type="text"
                                    dir="ltr"
                                    value={link.href || ''}
                                    onChange={(e) => {
                                      const updated = [...(footerSettingsForm.column1Links || [])];
                                      updated[idx] = { ...updated[idx], href: e.target.value };
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column1Links: updated,
                                      });
                                    }}
                                    placeholder="آدرس (مثلاً: /about-us یا #)"
                                    className="h-8 rounded-md border border-[#e0e0e0] bg-white px-2 text-[11.5px] text-left font-mono"
                                  />
                                </div>
                                <div className="flex items-center justify-end gap-1.5 shrink-0 mt-2 sm:mt-0 sm:mr-3">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      if (idx === 0) return;
                                      const updated = [...(footerSettingsForm.column1Links || [])];
                                      const temp = updated[idx];
                                      updated[idx] = updated[idx - 1];
                                      updated[idx - 1] = temp;
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column1Links: updated,
                                      });
                                    }}
                                    className="w-7 h-7 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (footerSettingsForm.column1Links || []).length - 1}
                                    onClick={() => {
                                      if (idx === (footerSettingsForm.column1Links || []).length - 1) return;
                                      const updated = [...(footerSettingsForm.column1Links || [])];
                                      const temp = updated[idx];
                                      updated[idx] = updated[idx + 1];
                                      updated[idx + 1] = temp;
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column1Links: updated,
                                      });
                                    }}
                                    className="w-7 h-7 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40"
                                  >
                                    ↓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (footerSettingsForm.column1Links || []).filter((_, i) => i !== idx);
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column1Links: updated,
                                      });
                                    }}
                                    className="w-7 h-7 rounded bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ستون دوم */}
                      <div className="space-y-4 bg-white p-4 rounded-xl border border-[#e7dfd1]">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-[#333]">
                            عنوان ستون دوم (کلکسیون صالحی):
                          </label>
                          <input
                            type="text"
                            value={footerSettingsForm.column2Title || ''}
                            onChange={(e) =>
                              setFooterSettingsForm({
                                ...footerSettingsForm,
                                column2Title: e.target.value,
                              })
                            }
                            placeholder="کلکسیون صالحی"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-[#b59766]">
                              لینک‌های ستون دوم:
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const currentLinks = footerSettingsForm.column2Links || [];
                                setFooterSettingsForm({
                                  ...footerSettingsForm,
                                  column2Links: [
                                    ...currentLinks,
                                    {
                                      id: `col2-${Date.now()}`,
                                      label: 'لینک جدید',
                                      href: '/',
                                    },
                                  ],
                                });
                              }}
                              className="h-8 px-2.5 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>افزودن لینک</span>
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                            {(footerSettingsForm.column2Links || []).map((link, idx) => (
                              <div
                                key={link.id || `l2-edit-${idx}`}
                                className="flex flex-col sm:flex-row gap-2 bg-[#fcfbf9] p-3 rounded-lg border border-[#e7dfd1] items-stretch sm:items-center justify-between"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={link.label || ''}
                                    onChange={(e) => {
                                      const updated = [...(footerSettingsForm.column2Links || [])];
                                      updated[idx] = { ...updated[idx], label: e.target.value };
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column2Links: updated,
                                      });
                                    }}
                                    placeholder="عنوان لینک"
                                    className="h-8 rounded-md border border-[#e0e0e0] bg-white px-2 text-[11.5px] font-semibold"
                                  />
                                  <input
                                    type="text"
                                    dir="ltr"
                                    value={link.href || ''}
                                    onChange={(e) => {
                                      const updated = [...(footerSettingsForm.column2Links || [])];
                                      updated[idx] = { ...updated[idx], href: e.target.value };
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column2Links: updated,
                                      });
                                    }}
                                    placeholder="آدرس (مثلاً: /product/categories/...)"
                                    className="h-8 rounded-md border border-[#e0e0e0] bg-white px-2 text-[11.5px] text-left font-mono"
                                  />
                                </div>
                                <div className="flex items-center justify-end gap-1.5 shrink-0 mt-2 sm:mt-0 sm:mr-3">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      if (idx === 0) return;
                                      const updated = [...(footerSettingsForm.column2Links || [])];
                                      const temp = updated[idx];
                                      updated[idx] = updated[idx - 1];
                                      updated[idx - 1] = temp;
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column2Links: updated,
                                      });
                                    }}
                                    className="w-7 h-7 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (footerSettingsForm.column2Links || []).length - 1}
                                    onClick={() => {
                                      if (idx === (footerSettingsForm.column2Links || []).length - 1) return;
                                      const updated = [...(footerSettingsForm.column2Links || [])];
                                      const temp = updated[idx];
                                      updated[idx] = updated[idx + 1];
                                      updated[idx + 1] = temp;
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column2Links: updated,
                                      });
                                    }}
                                    className="w-7 h-7 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40"
                                  >
                                    ↓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (footerSettingsForm.column2Links || []).filter((_, i) => i !== idx);
                                      setFooterSettingsForm({
                                        ...footerSettingsForm,
                                        column2Links: updated,
                                      });
                                    }}
                                    className="w-7 h-7 rounded bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>













                  {/* دکمه ذخیره پایانی */}
                  <div className="flex items-center justify-end pt-2 border-t border-[#efefef]">
                    <button
                      type="submit"
                      disabled={isSavingFooterSettings}
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {isSavingFooterSettings
                          ? 'در حال ذخیره و بروزرسانی فوتر...'
                          : 'ثبت و اعمال تغییرات در فوتر سایت'}
                      </span>
                    </button>
                  </div>
                </form>
              ) : activeWebsiteSettingsTab === 'contact' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingContactUsSettings(true);
                    try {
                      const saved = await authFetch(
                        '/api/admin/settings/contact-us',
                        {
                          method: 'PUT',
                          body: JSON.stringify(contactUsSettingsForm),
                        }
                      );
                      setContactUsSettingsForm({
                        ...INITIAL_CONTACT_US_SETTINGS,
                        ...saved,
                      });
                      onCatalogUpdated?.();
                      showNotice(
                        'success',
                        'تنظیمات صفحه تماس با ما و لینک‌های مسیریابی نشان با موفقیت در وب‌سایت بروزرسانی شد.'
                      );
                    } catch (err: any) {
                      showNotice(
                        'error',
                        err?.message || 'خطا در ذخیره تنظیمات صفحه تماس با ما'
                      );
                    } finally {
                      setIsSavingContactUsSettings(false);
                    }
                  }}
                  className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 sm:p-8 space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#181818]">
                        تنظیمات صفحه تماس با ما (`/contact-us`)
                      </h2>
                      <p className="text-xs text-[#666] mt-1">
                        ویرایش ساعات کاری و تعطیلات، ایمیل، شماره مدیریت و شماره ثابت، آدرس شعب، لینک مسیریابی نشان و شماره‌های تماس شعب
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isSavingContactUsSettings}
                        onClick={async () => {
                          setContactUsSettingsForm(INITIAL_CONTACT_US_SETTINGS);
                          setIsSavingContactUsSettings(true);
                          try {
                            const saved = await authFetch(
                              '/api/admin/settings/contact-us',
                              {
                                method: 'PUT',
                                body: JSON.stringify(
                                  INITIAL_CONTACT_US_SETTINGS
                                ),
                              }
                            );
                            setContactUsSettingsForm({
                              ...INITIAL_CONTACT_US_SETTINGS,
                              ...saved,
                            });
                            onCatalogUpdated?.();
                            showNotice(
                              'success',
                              'تنظیمات تماس با ما به مقادیر پیش‌فرض بازگردانی و در سایت ذخیره شد.'
                            );
                          } catch {
                            showNotice(
                              'success',
                              'فرم به مقادیر پیش‌فرض بازگردانی شد.'
                            );
                          } finally {
                            setIsSavingContactUsSettings(false);
                          }
                        }}
                        className="h-10 px-4 rounded-xl border border-[#d8d0c3] hover:bg-[#f6f3ec] text-[#444] text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
                      >
                        بازگردانی به مقادیر پیش‌فرض
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingContactUsSettings}
                        className="h-10 px-5 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        <span>
                          {isSavingContactUsSettings
                            ? 'در حال ذخیره...'
                            : 'ذخیره تنظیمات تماس با ما'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ۱. بخش فروش و امور مشتریان (پشتیبانی، روزهای کاری، روزهای تعطیل) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۱. بخش فروش و امور مشتریان (ساعات کاری و روزهای تعطیل)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* آیتم ۱: پشتیبانی */}
                      <div className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-2.5">
                        <span className="block text-xs font-black text-[#b59766]">
                          باکس اول (پشتیبانی)
                        </span>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            عنوان:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.supportTitle}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                supportTitle: e.target.value,
                              })
                            }
                            placeholder="پشتیبانی :"
                            className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            متن مقدار:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.supportValue}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                supportValue: e.target.value,
                              })
                            }
                            placeholder="بخش پاسخگویی تلفنی"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* آیتم ۲: روزهای کاری */}
                      <div className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-2.5">
                        <span className="block text-xs font-black text-[#b59766]">
                          باکس دوم (روزهای کاری)
                        </span>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            عنوان:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.workingDaysTitle}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                workingDaysTitle: e.target.value,
                              })
                            }
                            placeholder="روز های کاری :"
                            className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            ساعت فعالیت روزهای کاری:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.workingDaysHours}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                workingDaysHours: e.target.value,
                              })
                            }
                            placeholder="۸ صبح الی ۸ شب"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* آیتم ۳: روزهای تعطیل */}
                      <div className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-2.5">
                        <span className="block text-xs font-black text-[#b59766]">
                          باکس سوم (روزهای تعطیل)
                        </span>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            عنوان:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.holidaysTitle}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                holidaysTitle: e.target.value,
                              })
                            }
                            placeholder="روز های تعطیل :"
                            className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            ساعت فعالیت روزهای تعطیل:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.holidaysHours}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                holidaysHours: e.target.value,
                              })
                            }
                            placeholder="۸ صبح الی ۶ بعدظهر"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ۲. بخش تماس با ما (ایمیل، شماره مدیریت، شماره ثابت) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۲. بخش تماس با ما (ایمیل، شماره مدیریت و شماره ثابت)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* آیتم ۱: آدرس ایمیل */}
                      <div className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-2.5">
                        <span className="block text-xs font-black text-[#b59766]">
                          آدرس ایمیل مجموعه
                        </span>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            عنوان:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.emailTitle}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                emailTitle: e.target.value,
                              })
                            }
                            placeholder="آدرس ایمیل :"
                            className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            ایمیل:
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            value={contactUsSettingsForm.emailAddress}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                emailAddress: e.target.value,
                              })
                            }
                            placeholder="info@lostersalehi.ir"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold text-left"
                          />
                        </div>
                      </div>

                      {/* آیتم ۲: شماره مدیریت */}
                      <div className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-2.5">
                        <span className="block text-xs font-black text-[#b59766]">
                          شماره مدیریت
                        </span>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            عنوان:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.managerPhoneTitle}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                managerPhoneTitle: e.target.value,
                              })
                            }
                            placeholder="شماره مدیریت :"
                            className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            شماره تماس مدیریت:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.managerPhone}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                managerPhone: e.target.value,
                              })
                            }
                            placeholder="۰۹۰۱۲۲۲۲۶۳۵"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold tabular-nums"
                          />
                        </div>
                      </div>

                      {/* آیتم ۳: شماره ثابت */}
                      <div className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-2.5">
                        <span className="block text-xs font-black text-[#b59766]">
                          شماره ثابت
                        </span>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            عنوان:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.landlinePhoneTitle}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                landlinePhoneTitle: e.target.value,
                              })
                            }
                            placeholder="شماره ثابت :"
                            className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#666]">
                            شماره تلفن ثابت:
                          </label>
                          <input
                            type="text"
                            value={contactUsSettingsForm.landlinePhone}
                            onChange={(e) =>
                              setContactUsSettingsForm({
                                ...contactUsSettingsForm,
                                landlinePhone: e.target.value,
                              })
                            }
                            placeholder="۰۲۱-۳۳۳۳۳۶۳۲"
                            className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold tabular-nums"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ۳. آدرس شعبه‌های صالحی + لینک نشان برای مسیریابی */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۳. آدرس شعبه‌های صالحی و لینک مسیریابی نشان (Neshan)
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          نام شعبه، آدرس دقیق پستی و لینک مسیریابی نشان (دکمه «لوکیشن با نشان») را برای هر شعبه وارد کنید
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setContactUsSettingsForm({
                            ...contactUsSettingsForm,
                            branchLocations: [
                              ...contactUsSettingsForm.branchLocations,
                              {
                                id: `branch-${Date.now()}`,
                                branchTitle: 'شعبه جدید :',
                                address: 'آدرس شعبه جدید را وارد کنید',
                                neshanUrl: 'https://neshan.org',
                              },
                            ],
                          })
                        }
                        className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن شعبه جدید</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {contactUsSettingsForm.branchLocations.map(
                        (branchItem, bIdx) => (
                          <div
                            key={branchItem.id || `branch-loc-${bIdx}`}
                            className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-[#f0ece3] pb-2">
                              <span className="text-xs font-black text-[#181818]">
                                شعبه شماره {(bIdx + 1).toLocaleString('fa-IR')}
                              </span>
                              {contactUsSettingsForm.branchLocations.length >
                                1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setContactUsSettingsForm({
                                      ...contactUsSettingsForm,
                                      branchLocations:
                                        contactUsSettingsForm.branchLocations.filter(
                                          (_, i) => i !== bIdx
                                        ),
                                    })
                                  }
                                  className="text-[11px] font-bold text-[#ea1d2c] flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف شعبه</span>
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                              <div className="md:col-span-3 space-y-1">
                                <label className="block text-[11px] font-bold text-[#666]">
                                  عنوان شعبه:
                                </label>
                                <input
                                  type="text"
                                  value={branchItem.branchTitle}
                                  onChange={(e) => {
                                    const updated = [
                                      ...contactUsSettingsForm.branchLocations,
                                    ];
                                    updated[bIdx] = {
                                      ...updated[bIdx],
                                      branchTitle: e.target.value,
                                    };
                                    setContactUsSettingsForm({
                                      ...contactUsSettingsForm,
                                      branchLocations: updated,
                                    });
                                  }}
                                  placeholder="مثلاً: شعبه لاله زار :"
                                  className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                                />
                              </div>

                              <div className="md:col-span-5 space-y-1">
                                <label className="block text-[11px] font-bold text-[#666]">
                                  آدرس کامل شعبه:
                                </label>
                                <input
                                  type="text"
                                  value={branchItem.address}
                                  onChange={(e) => {
                                    const updated = [
                                      ...contactUsSettingsForm.branchLocations,
                                    ];
                                    updated[bIdx] = {
                                      ...updated[bIdx],
                                      address: e.target.value,
                                    };
                                    setContactUsSettingsForm({
                                      ...contactUsSettingsForm,
                                      branchLocations: updated,
                                    });
                                  }}
                                  placeholder="آدرس شعبه را وارد کنید..."
                                  className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                                />
                              </div>

                              <div className="md:col-span-4 space-y-1">
                                <label className="block text-[11px] font-bold text-[#b59766]">
                                  لینک نشان برای مسیریابی (لوکیشن با نشان):
                                </label>
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={branchItem.neshanUrl}
                                  onChange={(e) => {
                                    const updated = [
                                      ...contactUsSettingsForm.branchLocations,
                                    ];
                                    updated[bIdx] = {
                                      ...updated[bIdx],
                                      neshanUrl: e.target.value,
                                    };
                                    setContactUsSettingsForm({
                                      ...contactUsSettingsForm,
                                      branchLocations: updated,
                                    });
                                  }}
                                  placeholder="https://neshan.org/maps/... یا https://nshn.ir/..."
                                  className="w-full h-10 rounded-lg border border-[#d8c4a0] bg-[#fcfaf5] px-3 text-xs font-semibold text-left"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* ۴. تماس با شعبات صالحی (شماره تلفن و واتساپ شعب) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۴. تماس با شعبات صالحی (شماره تلفن و واتساپ شعب)
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          عنوان و شماره تلفن هر یک از شعب در ستون «تماس با شعبات صالحی» را ویرایش کنید
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setContactUsSettingsForm({
                            ...contactUsSettingsForm,
                            branchPhones: [
                              ...contactUsSettingsForm.branchPhones,
                              {
                                id: `phone-${Date.now()}`,
                                title: 'شماره تلفن و واتساپ شعبه جدید :',
                                phone: '۰۲۱-۳۳۳۳۳۶۳۲',
                              },
                            ],
                          })
                        }
                        className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن شماره شعبه</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {contactUsSettingsForm.branchPhones.map(
                        (phoneItem, phIdx) => (
                          <div
                            key={phoneItem.id || `branch-ph-${phIdx}`}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3.5 rounded-xl border border-[#e7dfd1]"
                          >
                            <div className="sm:col-span-6 space-y-1">
                              <label className="block text-[11px] font-bold text-[#666]">
                                عنوان (شعبه {(phIdx + 1).toLocaleString('fa-IR')}):
                              </label>
                              <input
                                type="text"
                                value={phoneItem.title}
                                onChange={(e) => {
                                  const updated = [
                                    ...contactUsSettingsForm.branchPhones,
                                  ];
                                  updated[phIdx] = {
                                    ...updated[phIdx],
                                    title: e.target.value,
                                  };
                                  setContactUsSettingsForm({
                                    ...contactUsSettingsForm,
                                    branchPhones: updated,
                                  });
                                }}
                                placeholder="شماره تلفن و واتساپ شعبه لاله زار نو :"
                                className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                              />
                            </div>

                            <div className="sm:col-span-5 space-y-1">
                              <label className="block text-[11px] font-bold text-[#666]">
                                شماره تماس شعبه:
                              </label>
                              <input
                                type="text"
                                value={phoneItem.phone}
                                onChange={(e) => {
                                  const updated = [
                                    ...contactUsSettingsForm.branchPhones,
                                  ];
                                  updated[phIdx] = {
                                    ...updated[phIdx],
                                    phone: e.target.value,
                                  };
                                  setContactUsSettingsForm({
                                    ...contactUsSettingsForm,
                                    branchPhones: updated,
                                  });
                                }}
                                placeholder="۰۲۱-۳۳۳۳۳۶۳۲"
                                className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold tabular-nums"
                              />
                            </div>

                            <div className="sm:col-span-1 flex justify-end pt-4">
                              {contactUsSettingsForm.branchPhones.length >
                                1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setContactUsSettingsForm({
                                      ...contactUsSettingsForm,
                                      branchPhones:
                                        contactUsSettingsForm.branchPhones.filter(
                                          (_, i) => i !== phIdx
                                        ),
                                    })
                                  }
                                  title="حذف این شماره"
                                  className="w-9 h-9 rounded-lg bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* دکمه ذخیره پایانی */}
                  <div className="flex items-center justify-end pt-2 border-t border-[#efefef]">
                    <button
                      type="submit"
                      disabled={isSavingContactUsSettings}
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {isSavingContactUsSettings
                          ? 'در حال ذخیره و بروزرسانی...'
                          : 'ثبت و اعمال تغییرات در صفحه تماس با ما'}
                      </span>
                    </button>
                  </div>
                </form>
              ) : activeWebsiteSettingsTab === 'hero_slider' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingHeroSliderSettings(true);
                    try {
                      const saved = await authFetch(
                        '/api/admin/settings/hero-slider',
                        {
                          method: 'PUT',
                          body: JSON.stringify(heroSliderSettingsForm),
                        }
                      );
                      setHeroSliderSettingsForm({
                        ...INITIAL_HERO_SLIDER_SETTINGS,
                        ...saved,
                        slides:
                          Array.isArray(saved?.slides) &&
                          saved.slides.length > 0
                            ? saved.slides
                            : heroSliderSettingsForm.slides,
                      });
                      onCatalogUpdated?.();
                      showNotice(
                        'success',
                        'تنظیمات اسلایدر بنر اصلی سایت با موفقیت در وب‌سایت ذخیره شد.'
                      );
                    } catch (err: any) {
                      showNotice(
                        'error',
                        err?.message || 'خطا در ذخیره تنظیمات اسلایدر سایت'
                      );
                    } finally {
                      setIsSavingHeroSliderSettings(false);
                    }
                  }}
                  className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 sm:p-8 space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#181818]">
                        تنظیمات اسلایدر و بنر اصلی سایت (`Hero Slider`)
                      </h2>
                      <p className="text-xs text-[#666] mt-1">
                        ویرایش عناوین اصلی، متن توضیحات، دکمه اقدام و مدیریت تصاویر اسلایدر صفحه اول
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isSavingHeroSliderSettings}
                        onClick={async () => {
                          setHeroSliderSettingsForm(INITIAL_HERO_SLIDER_SETTINGS);
                          setIsSavingHeroSliderSettings(true);
                          try {
                            const saved = await authFetch(
                              '/api/admin/settings/hero-slider',
                              {
                                method: 'PUT',
                                body: JSON.stringify(INITIAL_HERO_SLIDER_SETTINGS),
                              }
                            );
                            setHeroSliderSettingsForm({
                              ...INITIAL_HERO_SLIDER_SETTINGS,
                              ...saved,
                            });
                            onCatalogUpdated?.();
                            showNotice(
                              'success',
                              'تنظیمات اسلایدر سایت به مقادیر پیش‌فرض بازگردانی شد.'
                            );
                          } catch {
                            showNotice(
                              'success',
                              'فرم به مقادیر پیش‌فرض بازگردانی شد.'
                            );
                          } finally {
                            setIsSavingHeroSliderSettings(false);
                          }
                        }}
                        className="h-10 px-4 rounded-xl border border-[#d8d0c3] hover:bg-[#f6f3ec] text-[#444] text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
                      >
                        بازگردانی به مقادیر پیش‌فرض
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingHeroSliderSettings}
                        className="h-10 px-5 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        <span>
                          {isSavingHeroSliderSettings
                            ? 'در حال ذخیره...'
                            : 'ذخیره تنظیمات اسلایدر'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* مدیریت کامل اسلایدهای بنر اصلی سایت (عکس، متن و لینک مجزا برای هر اسلاید) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece4d4] pb-2.5">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          مدیریت اسلایدهای بنر اصلی سایت (`Hero Slider`)
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          برای هر اسلاید به صورت مجزا عکس، عنوان خط اول، عنوان خط دوم، توضیحات، متن دکمه و لینک دلخواه وارد کنید (عکس ضروری است و متون/لینک اختیاری می‌باشند).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroSliderSettingsForm({
                            ...heroSliderSettingsForm,
                            slides: [
                              ...heroSliderSettingsForm.slides,
                              {
                                id: `hero-${Date.now()}`,
                                imageUrl: GENERATED_IMAGES.projectRoyalRestaurant,
                                titleLine1: 'عنوان خط اول جدید',
                                titleLine2: 'عنوان خط دوم جدید',
                                description: 'توضیحات مربوط به این اسلاید خاص...',
                                buttonText: 'مشاهده محصولات',
                                buttonUrl: '#collection-salehi',
                              },
                            ],
                          });
                        }}
                        className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن اسلاید جدید به اسلایدر</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {heroSliderSettingsForm.slides.map((slideItem, sIdx) => (
                        <div
                          key={slideItem.id || `hero-slide-${sIdx}`}
                          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e7dfd1] space-y-4 flex flex-col justify-between shadow-xs"
                        >
                          <div className="space-y-3.5">
                            <div className="flex items-center justify-between border-b border-[#f0ece3] pb-2.5">
                              <span className="text-xs font-black text-[#181818] bg-[#f5efe4] text-[#b59766] px-2.5 py-1 rounded-lg">
                                اسلاید شماره {(sIdx + 1).toLocaleString('fa-IR')}
                              </span>
                              {heroSliderSettingsForm.slides.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHeroSliderSettingsForm({
                                      ...heroSliderSettingsForm,
                                      slides: heroSliderSettingsForm.slides.filter(
                                        (_, i) => i !== sIdx
                                      ),
                                    });
                                  }}
                                  title="حذف این اسلاید"
                                  className="text-xs font-bold text-[#ea1d2c] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف اسلاید</span>
                                </button>
                              )}
                            </div>

                            {/* پیش‌نمایش و انتخاب تصویر اسلاید (ضروری) */}
                            <div className="space-y-2">
                              <label className="block text-xs font-black text-[#333]">
                                عکس اسلاید (ضروری):
                              </label>

                              <div className="relative w-full aspect-[16/9] rounded-xl border border-[#e0dacd] bg-[#faf8f4] overflow-hidden flex items-center justify-center">
                                {slideItem.imageUrl ? (
                                  <img
                                    src={slideItem.imageUrl}
                                    alt={`اسلاید ${sIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-[#ea1d2c]">
                                    ⚠️ انتخاب عکس برای اسلاید ضروری است
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <label className="h-9 px-3 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>آپلود عکس از سیستم</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleFileUploadToDataUrl(
                                        e.target.files?.[0],
                                        (dataUrl) => {
                                          const updated = [
                                            ...heroSliderSettingsForm.slides,
                                          ];
                                          updated[sIdx] = {
                                            ...updated[sIdx],
                                            imageUrl: dataUrl,
                                          };
                                          setHeroSliderSettingsForm({
                                            ...heroSliderSettingsForm,
                                            slides: updated,
                                          });
                                        }
                                      )
                                    }
                                  />
                                </label>

                                <select
                                  value={slideItem.imageUrl}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const updated = [
                                        ...heroSliderSettingsForm.slides,
                                      ];
                                      updated[sIdx] = {
                                        ...updated[sIdx],
                                        imageUrl: e.target.value,
                                      };
                                      setHeroSliderSettingsForm({
                                        ...heroSliderSettingsForm,
                                        slides: updated,
                                      });
                                    }
                                  }}
                                  className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2 text-[11px] font-semibold bg-white"
                                >
                                  <option value="">-- انتخاب از نمونه کارها --</option>
                                  {PRESET_PROJECT_IMAGES.map((preset, pIdx) => (
                                    <option
                                      key={`preset-hero-${pIdx}`}
                                      value={preset.url}
                                    >
                                      {preset.label}
                                    </option>
                                  ))}
                                  {PRESET_PRODUCT_IMAGES.map((preset, pIdx) => (
                                    <option
                                      key={`preset-prod-hero-${pIdx}`}
                                      value={preset.url}
                                    >
                                      {preset.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <input
                                type="text"
                                dir="ltr"
                                value={slideItem.imageUrl}
                                onChange={(e) => {
                                  const updated = [
                                    ...heroSliderSettingsForm.slides,
                                  ];
                                  updated[sIdx] = {
                                    ...updated[sIdx],
                                    imageUrl: e.target.value,
                                  };
                                  setHeroSliderSettingsForm({
                                    ...heroSliderSettingsForm,
                                    slides: updated,
                                  });
                                }}
                                placeholder="یا آدرس مستقیم عکس (URL)..."
                                className="w-full h-8 rounded-lg border border-[#e0e0e0] px-2 text-[11px] text-left tabular-nums"
                              />
                            </div>

                            {/* فیلدهای متنی اسلاید (اختیاری) */}
                            <div className="pt-2 border-t border-[#f2ede4] space-y-3">
                              <span className="block text-[11.5px] font-black text-[#856b3e]">
                                متون و لینک این اسلاید (اختیاری - در صورت عدم تمایل خالی بگذارید):
                              </span>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[11px] font-bold text-[#555]">
                                    عنوان خط اول:
                                  </label>
                                  <input
                                    type="text"
                                    value={slideItem.titleLine1 || ''}
                                    onChange={(e) => {
                                      const updated = [
                                        ...heroSliderSettingsForm.slides,
                                      ];
                                      updated[sIdx] = {
                                        ...updated[sIdx],
                                        titleLine1: e.target.value,
                                      };
                                      setHeroSliderSettingsForm({
                                        ...heroSliderSettingsForm,
                                        slides: updated,
                                      });
                                    }}
                                    placeholder="مثلاً: با شکوهی ماندگار فضای"
                                    className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[11px] font-bold text-[#555]">
                                    عنوان خط دوم:
                                  </label>
                                  <input
                                    type="text"
                                    value={slideItem.titleLine2 || ''}
                                    onChange={(e) => {
                                      const updated = [
                                        ...heroSliderSettingsForm.slides,
                                      ];
                                      updated[sIdx] = {
                                        ...updated[sIdx],
                                        titleLine2: e.target.value,
                                      };
                                      setHeroSliderSettingsForm({
                                        ...heroSliderSettingsForm,
                                        slides: updated,
                                      });
                                    }}
                                    placeholder="مثلاً: زندگی‌تان را ارتقا دهید..."
                                    className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-[#555]">
                                  متن توضیحات این اسلاید:
                                </label>
                                <textarea
                                  rows={2}
                                  value={slideItem.description || ''}
                                  onChange={(e) => {
                                    const updated = [
                                      ...heroSliderSettingsForm.slides,
                                    ];
                                    updated[sIdx] = {
                                      ...updated[sIdx],
                                      description: e.target.value,
                                    };
                                    setHeroSliderSettingsForm({
                                      ...heroSliderSettingsForm,
                                      slides: updated,
                                    });
                                  }}
                                  placeholder="توضیحات کوتاه اختصاصی برای این اسلاید..."
                                  className="w-full rounded-lg border border-[#e0e0e0] p-2 text-xs font-normal leading-relaxed"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div className="space-y-1">
                                  <label className="block text-[11px] font-bold text-[#555]">
                                    متن روی دکمه:
                                  </label>
                                  <input
                                    type="text"
                                    value={slideItem.buttonText || ''}
                                    onChange={(e) => {
                                      const updated = [
                                        ...heroSliderSettingsForm.slides,
                                      ];
                                      updated[sIdx] = {
                                        ...updated[sIdx],
                                        buttonText: e.target.value,
                                      };
                                      setHeroSliderSettingsForm({
                                        ...heroSliderSettingsForm,
                                        slides: updated,
                                      });
                                    }}
                                    placeholder="مثلاً: مشاهده کالکشن"
                                    className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[11px] font-bold text-[#555]">
                                    لینک / آدرس دکمه:
                                  </label>
                                  <input
                                    type="text"
                                    dir="ltr"
                                    value={slideItem.buttonUrl || ''}
                                    onChange={(e) => {
                                      const updated = [
                                        ...heroSliderSettingsForm.slides,
                                      ];
                                      updated[sIdx] = {
                                        ...updated[sIdx],
                                        buttonUrl: e.target.value,
                                      };
                                      setHeroSliderSettingsForm({
                                        ...heroSliderSettingsForm,
                                        slides: updated,
                                      });
                                    }}
                                    placeholder="#collection-salehi یا /about-us"
                                    className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold text-left"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* دکمه ذخیره پایانی */}
                  <div className="flex items-center justify-end pt-2 border-t border-[#efefef]">
                    <button
                      type="submit"
                      disabled={isSavingHeroSliderSettings}
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {isSavingHeroSliderSettings
                          ? 'در حال ذخیره و بروزرسانی...'
                          : 'ثبت و اعمال تغییرات در اسلایدر اصلی سایت'}
                      </span>
                    </button>
                  </div>
                </form>
              ) : activeWebsiteSettingsTab === 'about' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingAboutUsSettings(true);
                    try {
                      const saved = await authFetch(
                        '/api/admin/settings/about-us',
                        {
                          method: 'PUT',
                          body: JSON.stringify(aboutUsSettingsForm),
                        }
                      );
                      setAboutUsSettingsForm({
                        ...INITIAL_ABOUT_US_SETTINGS,
                        ...saved,
                        galleryImages:
                          Array.isArray(saved?.galleryImages) &&
                          saved.galleryImages.length > 0
                            ? saved.galleryImages
                            : aboutUsSettingsForm.galleryImages,
                      });
                      if (
                        aboutUsSettingsForm.catalogTitle ||
                        aboutUsSettingsForm.catalogDescription
                      ) {
                        const updatedFooter = {
                          ...footerSettingsForm,
                          catalogTitle: aboutUsSettingsForm.catalogTitle,
                          catalogDescription: aboutUsSettingsForm.catalogDescription,
                          catalogCardTitle: aboutUsSettingsForm.catalogCardTitle,
                          catalogPageCount: aboutUsSettingsForm.catalogPageCount,
                          catalogDownloadUrl: aboutUsSettingsForm.catalogDownloadUrl,
                        };
                        setFooterSettingsForm(updatedFooter);
                        await authFetch('/api/admin/settings/footer', {
                          method: 'PUT',
                          body: JSON.stringify(updatedFooter),
                        }).catch(() => {});
                      }
                      onCatalogUpdated?.();
                      showNotice(
                        'success',
                        'تنظیمات صفحه درباره ما و گالری تصاویر با موفقیت در وب‌سایت ذخیره و اعمال شد.'
                      );
                    } catch (err: any) {
                      showNotice(
                        'error',
                        err?.message || 'خطا در ذخیره تنظیمات صفحه درباره ما'
                      );
                    } finally {
                      setIsSavingAboutUsSettings(false);
                    }
                  }}
                  className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 sm:p-8 space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#181818]">
                        تنظیمات صفحه درباره ما (`/about-us`)
                      </h2>
                      <p className="text-xs text-[#666] mt-1">
                        ویرایش عنوان، متن داستان بی انتهای ما و مدیریت تصاویر اسلایدر/گالری صفحه درباره ما
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isSavingAboutUsSettings}
                        onClick={async () => {
                          setAboutUsSettingsForm(INITIAL_ABOUT_US_SETTINGS);
                          setIsSavingAboutUsSettings(true);
                          try {
                            const saved = await authFetch(
                              '/api/admin/settings/about-us',
                              {
                                method: 'PUT',
                                body: JSON.stringify(INITIAL_ABOUT_US_SETTINGS),
                              }
                            );
                            setAboutUsSettingsForm({
                              ...INITIAL_ABOUT_US_SETTINGS,
                              ...saved,
                            });
                            onCatalogUpdated?.();
                            showNotice(
                              'success',
                              'تنظیمات درباره ما به مقادیر اولیه بازگردانی شد.'
                            );
                          } catch {
                            showNotice(
                              'success',
                              'فرم به مقادیر اولیه بازگردانی شد.'
                            );
                          } finally {
                            setIsSavingAboutUsSettings(false);
                          }
                        }}
                        className="h-10 px-4 rounded-xl border border-[#d8d0c3] hover:bg-[#f6f3ec] text-[#444] text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
                      >
                        بازگردانی به مقادیر پیش‌فرض
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingAboutUsSettings}
                        className="h-10 px-5 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        <span>
                          {isSavingAboutUsSettings
                            ? 'در حال ذخیره...'
                            : 'ذخیره تنظیمات درباره ما'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ۱. عنوان و متن داستان بی انتهای ما (متناظر با انتخابگر کاربر) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ece4d4] pb-2.5">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۱. عنوان و متن داستان بی انتهای ما (درباره لوستر صالحی)
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          این متن در ستون راست بخش اول صفحه درباره ما نمایش داده می‌شود
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-[#b59766] bg-[#f2ecde] px-2.5 py-1 rounded-lg">
                        متن اصلی درباره ما
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#333]">
                          عنوان بخش داستان:
                        </label>
                        <input
                          type="text"
                          value={aboutUsSettingsForm.storyTitle}
                          onChange={(e) =>
                            setAboutUsSettingsForm({
                              ...aboutUsSettingsForm,
                              storyTitle: e.target.value,
                            })
                          }
                          placeholder="داستان بی انتهای ما!"
                          className="w-full h-11 rounded-xl border border-[#e0e0e0] bg-white px-3.5 text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-[#333]">
                            متن کامل داستان و تاریخچه برند (پاراگراف اصلی درباره ما):
                          </label>
                          <span className="text-[11px] text-[#888] tabular-nums">
                            {aboutUsSettingsForm.storyDescription.length.toLocaleString('fa-IR')} کاراکتر
                          </span>
                        </div>
                        <textarea
                          rows={8}
                          value={aboutUsSettingsForm.storyDescription}
                          onChange={(e) =>
                            setAboutUsSettingsForm({
                              ...aboutUsSettingsForm,
                              storyDescription: e.target.value,
                            })
                          }
                          placeholder="متن کامل درباره ما و تاریخچه تولید لوستر صالحی..."
                          className="w-full rounded-xl border border-[#e0e0e0] bg-white p-3.5 text-xs font-semibold leading-7"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ۲. گالری و اسلایدر تصاویر درباره ما (شامل تصویر پنجم و سایر تصاویر) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece4d4] pb-2.5">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۲. اسلایدر و گالری تصاویر درباره ما (تصاویر اسلاید شو)
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          تصاویر اسلایدر کنار متن داستان را اضافه، حذف یا ویرایش کنید (تصویر پنجم و تمامی تصاویر)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAboutUsSettingsForm({
                            ...aboutUsSettingsForm,
                            galleryImages: [
                              ...aboutUsSettingsForm.galleryImages,
                              GENERATED_IMAGES.projectFereshteh,
                            ],
                          });
                        }}
                        className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن تصویر جدید به گالری</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aboutUsSettingsForm.galleryImages.map((imgUrl, imgIdx) => (
                        <div
                          key={`about-gallery-item-${imgIdx}`}
                          className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#181818]">
                                تصویر {(imgIdx + 1).toLocaleString('fa-IR')} {imgIdx === 4 ? '(تصویر پنجم)' : ''}
                              </span>
                              {aboutUsSettingsForm.galleryImages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAboutUsSettingsForm({
                                      ...aboutUsSettingsForm,
                                      galleryImages:
                                        aboutUsSettingsForm.galleryImages.filter(
                                          (_, idx) => idx !== imgIdx
                                        ),
                                    });
                                  }}
                                  className="text-[11px] font-bold text-[#ea1d2c] hover:underline cursor-pointer"
                                >
                                  حذف عکس
                                </button>
                              )}
                            </div>

                            {/* پیش‌نمایش عکس */}
                            <div className="w-full aspect-[16/10] rounded-xl border border-[#e0dacd] bg-[#faf8f4] overflow-hidden relative group">
                              <img
                                src={imgUrl}
                                alt={`اسلاید ${(imgIdx + 1).toLocaleString('fa-IR')}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* انتخاب از تصاویر پیشنهادی */}
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-[#666]">
                                انتخاب از تصاویر آماده کالکشن:
                              </label>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const next = [
                                      ...aboutUsSettingsForm.galleryImages,
                                    ];
                                    next[imgIdx] = e.target.value;
                                    setAboutUsSettingsForm({
                                      ...aboutUsSettingsForm,
                                      galleryImages: next,
                                    });
                                  }
                                }}
                                defaultValue=""
                                className="w-full h-9 rounded-lg border border-[#e0e0e0] bg-white px-2.5 text-[11px] font-semibold text-[#333]"
                              >
                                <option value="" disabled>
                                  انتخاب عکس از گالری لوستر صالحی...
                                </option>
                                {PRESET_ABOUT_GALLERY_IMAGES.map((preset, pIdx) => (
                                  <option key={`preset-about-${pIdx}`} value={preset.url}>
                                    {preset.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* دکمه آپلود تصویر جدید */}
                            <div className="space-y-1.5">
                              <label className="h-9 px-3 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>آپلود عکس از سیستم</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUploadToDataUrl(
                                      e.target.files?.[0],
                                      (dataUrl) => {
                                        const next = [
                                          ...aboutUsSettingsForm.galleryImages,
                                        ];
                                        next[imgIdx] = dataUrl;
                                        setAboutUsSettingsForm({
                                          ...aboutUsSettingsForm,
                                          galleryImages: next,
                                        });
                                      }
                                    )
                                  }
                                />
                              </label>
                              <input
                                type="text"
                                dir="ltr"
                                value={imgUrl}
                                onChange={(e) => {
                                  const next = [
                                    ...aboutUsSettingsForm.galleryImages,
                                  ];
                                  next[imgIdx] = e.target.value;
                                  setAboutUsSettingsForm({
                                    ...aboutUsSettingsForm,
                                    galleryImages: next,
                                  });
                                }}
                                placeholder="یا آدرس تصویر (URL)..."
                                className="w-full h-8 rounded-lg border border-[#e0e0e0] px-2 text-[11px] text-left tabular-nums"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ۳. تنظیمات فایل کاتالوگ محصولات (عنوان، توضیحات، کارت و لینک دانلود PDF) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ece4d4] pb-2.5">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۳. تنظیمات و متون بخش کاتالوگ محصولات (دانلود PDF)
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          ویرایش عنوان بخش کاتالوگ، توضیحات، عنوان کارت، تعداد صفحات و لینک مستقیم دانلود کاتالوگ
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-[#b59766] bg-[#f2ecde] px-2.5 py-1 rounded-lg">
                        کاتالوگ PDF
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* عنوان بخش کاتالوگ (CSS Selector 1) */}
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          عنوان اصلی بخش کاتالوگ:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={
                              aboutUsSettingsForm.catalogTitle ||
                              'فایل کاتالوگ محصولات'
                            }
                            onChange={(e) =>
                              setAboutUsSettingsForm({
                                ...aboutUsSettingsForm,
                                catalogTitle: e.target.value,
                              })
                            }
                            placeholder="فایل کاتالوگ محصولات"
                            className="flex-1 h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                          />
                          <input
                            type="color"
                            value={aboutUsSettingsForm.catalogTitleColor || '#181818'}
                            onChange={(e) =>
                              setAboutUsSettingsForm({
                                ...aboutUsSettingsForm,
                                catalogTitleColor: e.target.value,
                              })
                            }
                            className="w-10 h-10 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white"
                          />
                        </div>
                      </div>

                      {/* عنوان کارت کاتالوگ (CSS Selector 3) */}
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          عنوان روی کارت کاتالوگ:
                        </label>
                        <input
                          type="text"
                          value={
                            aboutUsSettingsForm.catalogCardTitle ||
                            'کاتالوگ محصولات لوستر صالحی'
                          }
                          onChange={(e) =>
                            setAboutUsSettingsForm({
                              ...aboutUsSettingsForm,
                              catalogCardTitle: e.target.value,
                            })
                          }
                          placeholder="کاتالوگ محصولات لوستر صالحی"
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold"
                        />
                      </div>

                      {/* تعداد صفحات / مشخصات کارت (CSS Selector 4) */}
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          تعداد صفحات / مشخصات کارت:
                        </label>
                        <input
                          type="text"
                          value={
                            aboutUsSettingsForm.catalogPageCount ||
                            '۱۲۶ صفحه'
                          }
                          onChange={(e) =>
                            setAboutUsSettingsForm({
                              ...aboutUsSettingsForm,
                              catalogPageCount: e.target.value,
                            })
                          }
                          placeholder="۱۲۶ صفحه"
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold tabular-nums"
                        />
                      </div>

                      {/* لینک مستقیم دانلود کاتالوگ PDF (CSS Selector 5) با قابلیت آپلود فایل PDF */}
                      <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="block text-xs font-bold text-[#333]">
                            لینک / فایل دانلود مستقیم PDF کاتالوگ:
                          </label>
                          {aboutUsSettingsForm.catalogDownloadUrl ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10.5px] font-bold text-[#1f6334] bg-[#e8f5e9] px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Check className="w-3 h-3 text-[#2e7d32]" />
                                <span>فایل PDF آماده دانلود است</span>
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAboutUsSettingsForm({
                                    ...aboutUsSettingsForm,
                                    catalogDownloadUrl: '',
                                  })
                                }
                                className="text-[10.5px] font-bold text-[#ea1d2c] hover:underline cursor-pointer"
                              >
                                حذف فایل
                              </button>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <label className="h-10 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>آپلود فایل PDF کاتالوگ</span>
                            <input
                              type="file"
                              accept="application/pdf,.pdf,image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUploadToDataUrl(
                                  e.target.files?.[0],
                                  (dataUrl) => {
                                    setAboutUsSettingsForm({
                                      ...aboutUsSettingsForm,
                                      catalogDownloadUrl: dataUrl,
                                    });
                                    showNotice(
                                      'success',
                                      'فایل PDF کاتالوگ با موفقیت آپلود شد.'
                                    );
                                  }
                                )
                              }
                            />
                          </label>

                          <input
                            type="text"
                            dir="ltr"
                            value={aboutUsSettingsForm.catalogDownloadUrl || ''}
                            onChange={(e) =>
                              setAboutUsSettingsForm({
                                ...aboutUsSettingsForm,
                                catalogDownloadUrl: e.target.value,
                              })
                            }
                            placeholder="یا آدرس مستقیم (https://.../catalog.pdf)"
                            className="h-10 flex-1 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold text-left"
                          />
                        </div>
                      </div>

                      {/* متن توضیحات کامل بخش کاتالوگ (CSS Selector 2) */}
                      <div className="md:col-span-2 space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          متن کامل توضیحات بخش کاتالوگ:
                        </label>
                        <div className="flex gap-2">
                          <textarea
                            rows={4}
                            value={
                              aboutUsSettingsForm.catalogDescription || ''
                            }
                            onChange={(e) =>
                              setAboutUsSettingsForm({
                                ...aboutUsSettingsForm,
                                catalogDescription: e.target.value,
                              })
                            }
                            placeholder="توضیحات مربوط به دانلود و مشاهده کاتالوگ محصولات..."
                            className="flex-1 rounded-xl border border-[#e0e0e0] p-3 text-xs font-semibold leading-6"
                          />
                          <input
                            type="color"
                            value={aboutUsSettingsForm.catalogDescriptionColor || '#777777'}
                            onChange={(e) =>
                              setAboutUsSettingsForm({
                                ...aboutUsSettingsForm,
                                catalogDescriptionColor: e.target.value,
                              })
                            }
                            className="w-10 h-10 rounded-lg border border-[#d8d0c3] cursor-pointer p-0.5 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* دکمه ذخیره پایانی */}
                  <div className="flex items-center justify-end pt-2 border-t border-[#efefef]">
                    <button
                      type="submit"
                      disabled={isSavingAboutUsSettings}
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {isSavingAboutUsSettings
                          ? 'در حال ذخیره و بروزرسانی...'
                          : 'ثبت و اعمال تغییرات در صفحه درباره ما'}
                      </span>
                    </button>
                  </div>
                </form>
              ) : activeWebsiteSettingsTab === 'main' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingMainSettings(true);
                    try {
                      const saved = await authFetch(
                        '/api/admin/settings/main',
                        {
                          method: 'PUT',
                          body: JSON.stringify(mainSettingsForm),
                        }
                      );
                      setMainSettingsForm({
                        ...INITIAL_MAIN_SETTINGS,
                        ...saved,
                      });
                      onCatalogUpdated?.();
                      showNotice(
                        'success',
                        'تنظیمات اصلی و منوهای سایت با موفقیت ذخیره و اعمال شد.'
                      );
                    } catch (err: any) {
                      showNotice(
                        'error',
                        err?.message || 'خطا در ذخیره تنظیمات اصلی سایت'
                      );
                    } finally {
                      setIsSavingMainSettings(false);
                    }
                  }}
                  className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 sm:p-8 space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#181818]">
                        تنظیمات اصلی وب‌سایت و چیدمان منوها
                      </h2>
                      <p className="text-xs text-[#666] mt-1">
                        مدیریت عنوان و شعار سایت، لینک‌های تماس و شبکه‌های اجتماعی، مخفی‌سازی زبان سایت و مدیریت منوها و زیرمنوها
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isSavingMainSettings}
                        onClick={() => {
                          setMainSettingsForm(INITIAL_MAIN_SETTINGS);
                          showNotice('success', 'فرم به مقادیر پیش‌فرض بازگردانی شد. برای ذخیره نهایی کلیک کنید.');
                        }}
                        className="h-10 px-4 rounded-xl border border-[#d8d0c3] hover:bg-[#f6f3ec] text-[#444] text-xs font-bold cursor-pointer transition-colors"
                      >
                        بازگردانی به مقادیر پیش‌فرض
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingMainSettings}
                        className="h-10 px-5 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>
                          {isSavingMainSettings
                            ? 'در حال ذخیره...'
                            : 'ذخیره تنظیمات اصلی'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ۱. مشخصات عمومی و شبکه‌های اجتماعی */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۱. عنوان، توضیحات، شماره تماس و شبکه‌های اجتماعی
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          عنوان اصلی وب‌سایت:
                        </label>
                        <input
                          type="text"
                          value={mainSettingsForm.siteTitle || ''}
                          onChange={(e) =>
                            setMainSettingsForm({
                              ...mainSettingsForm,
                              siteTitle: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          شعار و زیرعنوان وب‌سایت:
                        </label>
                        <input
                          type="text"
                          value={mainSettingsForm.siteSubtitle || ''}
                          onChange={(e) =>
                            setMainSettingsForm({
                              ...mainSettingsForm,
                              siteSubtitle: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          تلفن پشتیبانی و مشاوره خرید:
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={mainSettingsForm.supportPhone || ''}
                          onChange={(e) =>
                            setMainSettingsForm({
                              ...mainSettingsForm,
                              supportPhone: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold text-left tabular-nums"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          لینک اینستاگرام گالری:
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={mainSettingsForm.instagramUrl || ''}
                          onChange={(e) =>
                            setMainSettingsForm({
                              ...mainSettingsForm,
                              instagramUrl: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold text-left"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          لینک کانال تلگرام:
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={mainSettingsForm.telegramUrl || ''}
                          onChange={(e) =>
                            setMainSettingsForm({
                              ...mainSettingsForm,
                              telegramUrl: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold text-left"
                        />
                      </div>

                      {/* هیدن کردن زبان سایت (مورد ۵ کاربر) */}
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1] flex flex-col justify-center">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(mainSettingsForm.hideLanguageSelector)}
                            onChange={(e) =>
                              setMainSettingsForm({
                                ...mainSettingsForm,
                                hideLanguageSelector: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#b59766] focus:ring-[#b59766]"
                          />
                          <div>
                            <span className="block text-xs font-bold text-[#181818]">
                              مخفی‌سازی انتخاب زبان سایت
                            </span>
                            <span className="block text-[10px] text-[#777] mt-0.5">
                              دکمه انتخاب زبان (FA/EN) در بالای هدر پنهان شود
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ۳. تنظیمات بخش درباره خدمات (مورد درخواست کاربر) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۳. مدیریت محتوای بخش «درباره خدمات لوستر» (About Services)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          عنوان اصلی بخش (دسکتاپ):
                        </label>
                        <input
                          type="text"
                          value={mainSettingsForm.servicesTitle || ''}
                          onChange={(e) =>
                            setMainSettingsForm({
                              ...mainSettingsForm,
                              servicesTitle: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          عنوان اصلی بخش (موبایل):
                        </label>
                        <input
                          type="text"
                          value={mainSettingsForm.servicesSubtitle || ''}
                          onChange={(e) =>
                            setMainSettingsForm({
                              ...mainSettingsForm,
                              servicesSubtitle: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white border border-[#e7dfd1] space-y-3">
                        <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2">
                          <span className="text-xs font-black text-[#181818]">خدمت شماره ۱ (راست)</span>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#777]">عنوان خدمت:</label>
                            <input
                              type="text"
                              value={mainSettingsForm.service1Title || ''}
                              onChange={(e) =>
                                setMainSettingsForm({
                                  ...mainSettingsForm,
                                  service1Title: e.target.value,
                                })
                              }
                              className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#777]">توضیحات کامل خدمت:</label>
                            <textarea
                              rows={3}
                              value={mainSettingsForm.service1Description || ''}
                              onChange={(e) =>
                                setMainSettingsForm({
                                  ...mainSettingsForm,
                                  service1Description: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-[#e0e0e0] p-2.5 text-xs font-medium leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#e7dfd1] space-y-3">
                        <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2">
                          <span className="text-xs font-black text-[#181818]">خدمت شماره ۲ (چپ)</span>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#777]">عنوان خدمت:</label>
                            <input
                              type="text"
                              value={mainSettingsForm.service2Title || ''}
                              onChange={(e) =>
                                setMainSettingsForm({
                                  ...mainSettingsForm,
                                  service2Title: e.target.value,
                                })
                              }
                              className="w-full h-9 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#777]">توضیحات کامل خدمت:</label>
                            <textarea
                              rows={3}
                              value={mainSettingsForm.service2Description || ''}
                              onChange={(e) =>
                                setMainSettingsForm({
                                  ...mainSettingsForm,
                                  service2Description: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-[#e0e0e0] p-2.5 text-xs font-medium leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-[#333]">
                            آدرس / آپلود تصویر شاخص لوستر (داخل قاب قوسی):
                          </label>
                          <label className="h-8 px-3 rounded-lg bg-[#1a1814] hover:bg-[#b59766] text-white text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>آپلود عکس</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUploadToDataUrl(
                                  e.target.files?.[0],
                                  (dataUrl) =>
                                    setMainSettingsForm({
                                      ...mainSettingsForm,
                                      servicesMainImage: dataUrl,
                                    })
                                )
                              }
                            />
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg border border-[#ddd] bg-[#f9f9f9] overflow-hidden flex items-center justify-center shrink-0">
                            {mainSettingsForm.servicesMainImage ? (
                              <img
                                src={mainSettingsForm.servicesMainImage}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Image className="w-6 h-6 text-[#ccc]" />
                            )}
                          </div>
                          <input
                            type="text"
                            dir="ltr"
                            value={mainSettingsForm.servicesMainImage || ''}
                            onChange={(e) =>
                              setMainSettingsForm({
                                ...mainSettingsForm,
                                servicesMainImage: e.target.value,
                              })
                            }
                            placeholder="/src/assets/images/..."
                            className="flex-1 h-10 rounded-lg border border-[#e0e0e0] px-3 text-[11px] font-mono focus:outline-none focus:border-[#b59766]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ۲. منوی هدر سایت (قابلیت تغییر چیدمان، حذف و افزودن و زیر منو) */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece4d4] pb-2.5">
                      <div>
                        <h3 className="text-sm font-black text-[#181818]">
                          ۲. مدیریت و ساختار منوهای ناوبری هدر سایت
                        </h3>
                        <p className="text-[11px] text-[#777] mt-0.5">
                          منوهای بالای سایت را ویرایش کنید، ترتیب آن‌ها را بالا پایین کنید، منوی جدید اضافه کنید یا زیرمنو قرار دهید
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addMainMenu}
                        className="h-9 px-3.5 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن منوی اصلی جدید</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(mainSettingsForm.headerMenus || []).map((menuItem: any, mIdx: number) => (
                        <div
                          key={menuItem.id || `menu-itm-${mIdx}`}
                          className="bg-white p-4 rounded-xl border border-[#e7dfd1] space-y-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0ece3] pb-2">
                            <span className="text-xs font-black text-[#b59766]">
                              منوی اصلی {(mIdx + 1).toLocaleString('fa-IR')}: {menuItem.label || '(بدون عنوان)'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={mIdx === 0}
                                onClick={() => moveMenuUp(mIdx)}
                                className="w-7 h-7 rounded bg-[#f7f6f2] hover:bg-[#eceae1] text-[#444] disabled:opacity-30 flex items-center justify-center cursor-pointer"
                                title="انتقال به بالا"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={mIdx === (mainSettingsForm.headerMenus || []).length - 1}
                                onClick={() => moveMenuDown(mIdx)}
                                className="w-7 h-7 rounded bg-[#f7f6f2] hover:bg-[#eceae1] text-[#444] disabled:opacity-30 flex items-center justify-center cursor-pointer"
                                title="انتقال به پایین"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteMenu(mIdx)}
                                className="w-7 h-7 rounded bg-[#fde8ea] hover:bg-[#ea1d2c] text-[#ea1d2c] hover:text-white flex items-center justify-center cursor-pointer"
                                title="حذف این منو"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-[#555]">
                                عنوان منو:
                              </label>
                              <input
                                type="text"
                                value={menuItem.label || ''}
                                onChange={(e) => {
                                  const updated = [...mainSettingsForm.headerMenus];
                                  updated[mIdx].label = e.target.value;
                                  setMainSettingsForm({ ...mainSettingsForm, headerMenus: updated });
                                }}
                                className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-[#555]">
                                آدرس لینک (در صورت داشتن زیرمنو خالی بگذارید):
                              </label>
                              <input
                                type="text"
                                dir="ltr"
                                value={menuItem.href || ''}
                                onChange={(e) => {
                                  const updated = [...mainSettingsForm.headerMenus];
                                  updated[mIdx].href = e.target.value;
                                  setMainSettingsForm({ ...mainSettingsForm, headerMenus: updated });
                                }}
                                className="w-full h-9 rounded-lg border border-[#e0e0e0] px-2.5 text-xs font-semibold text-left"
                              />
                            </div>
                          </div>

                          {/* زیر منو ها */}
                          <div className="bg-[#fcfbf9] p-3 rounded-lg border border-[#eee6d7] space-y-3">
                            <div className="flex items-center justify-between border-b border-[#ece2cf] pb-1.5">
                              <span className="text-[10.5px] font-black text-[#555] flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5" />
                                <span>زیرمنوهای این آیتم (امکان افزودن زیرمنو)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => addSubmenuItem(mIdx)}
                                className="text-[10.5px] font-bold text-[#b59766] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>افزودن زیرمنو</span>
                              </button>
                            </div>

                            {menuItem.submenuItems && menuItem.submenuItems.length > 0 ? (
                              <div className="space-y-2.5">
                                {menuItem.submenuItems.map((subItem: any, sIdx: number) => (
                                  <div
                                    key={subItem.id || `sub-${mIdx}-${sIdx}`}
                                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-[#e4decb]"
                                  >
                                    <div className="sm:col-span-5">
                                      <input
                                        type="text"
                                        value={subItem.label || ''}
                                        onChange={(e) => {
                                          const updated = [...mainSettingsForm.headerMenus];
                                          updated[mIdx].submenuItems[sIdx].label = e.target.value;
                                          setMainSettingsForm({ ...mainSettingsForm, headerMenus: updated });
                                        }}
                                        placeholder="عنوان زیرمنو"
                                        className="w-full h-8 rounded border border-[#e0e0e0] px-2 text-[11px] font-medium"
                                      />
                                    </div>
                                    <div className="sm:col-span-6">
                                      <input
                                        type="text"
                                        dir="ltr"
                                        value={subItem.href || ''}
                                        onChange={(e) => {
                                          const updated = [...mainSettingsForm.headerMenus];
                                          updated[mIdx].submenuItems[sIdx].href = e.target.value;
                                          setMainSettingsForm({ ...mainSettingsForm, headerMenus: updated });
                                        }}
                                        placeholder="/product/categories/..."
                                        className="w-full h-8 rounded border border-[#e0e0e0] px-2 text-[11px] text-left"
                                      />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => deleteSubmenuItem(mIdx, sIdx)}
                                        className="w-7 h-7 rounded bg-[#fde8ea] text-[#ea1d2c] flex items-center justify-center cursor-pointer hover:bg-[#ea1d2c] hover:text-white transition-colors"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-[#777] italic">
                                این منو فاقد زیرمنو است (مستقیماً به آدرس مشخص‌شده لینک می‌شود).
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* دکمه ذخیره پایانی */}
                  <div className="flex items-center justify-end pt-2 border-t border-[#efefef]">
                    <button
                      type="submit"
                      disabled={isSavingMainSettings}
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {isSavingMainSettings
                          ? 'در حال ذخیره و بروزرسانی...'
                          : 'ثبت و اعمال تغییرات منوها و تنظیمات اصلی'}
                      </span>
                    </button>
                  </div>
                </form>
              ) : activeWebsiteSettingsTab === 'sms' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingSmsSettings(true);
                    try {
                      const saved = await authFetch(
                        '/api/admin/settings/sms',
                        {
                          method: 'PUT',
                          body: JSON.stringify(smsSettingsForm),
                        }
                      );
                      setSmsSettingsForm({
                        ...INITIAL_SMS_SETTINGS,
                        ...saved,
                      });
                      showNotice(
                        'success',
                        'تنظیمات پنل پیامک با موفقیت ذخیره و به‌روزرسانی شد.'
                      );
                    } catch (err: any) {
                      showNotice(
                        'error',
                        err?.message || 'خطا در ذخیره تنظیمات پیامک'
                      );
                    } finally {
                      setIsSavingSmsSettings(false);
                    }
                  }}
                  className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 sm:p-8 space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#181818]">
                        تنظیمات پنل و سامانه پیامک (`SMS Portal`)
                      </h2>
                      <p className="text-xs text-[#666] mt-1">
                        پیکربندی کلید وب‌سرویس، شماره‌های فرستنده، مدیریت اعلان‌های خودکار ثبت سفارش به ادمین و مشتری
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isSavingSmsSettings}
                        onClick={() => {
                          setSmsSettingsForm(INITIAL_SMS_SETTINGS);
                          showNotice('success', 'فرم به مقادیر پیش‌فرض بازگردانی شد. برای ذخیره نهایی کلیک کنید.');
                        }}
                        className="h-10 px-4 rounded-xl border border-[#d8d0c3] hover:bg-[#f6f3ec] text-[#444] text-xs font-bold cursor-pointer transition-colors"
                      >
                        بازگردانی به پیش‌فرض پیامک
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingSmsSettings}
                        className="h-10 px-5 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>
                          {isSavingSmsSettings
                            ? 'در حال ذخیره...'
                            : 'ذخیره تنظیمات پیامک'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ۱. اطلاعات پنل پیامک */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۱. اطلاعات اتصال و وب‌سرویس پیامک
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          کلید API سامانه پیامکی:
                        </label>
                        <input
                          type="password"
                          value={smsSettingsForm.apiKey || ''}
                          onChange={(e) =>
                            setSmsSettingsForm({
                              ...smsSettingsForm,
                              apiKey: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-mono"
                          dir="ltr"
                          placeholder="API Key..."
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          خط اختصاصی فرستنده (Sender Line):
                        </label>
                        <input
                          type="text"
                          value={smsSettingsForm.senderLine || ''}
                          onChange={(e) =>
                            setSmsSettingsForm({
                              ...smsSettingsForm,
                              senderLine: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold tabular-nums"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          شماره موبایل ادمین (دریافت اعلان‌ها):
                        </label>
                        <input
                          type="text"
                          value={smsSettingsForm.adminPhone || ''}
                          onChange={(e) =>
                            setSmsSettingsForm({
                              ...smsSettingsForm,
                              adminPhone: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-bold tabular-nums"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ۲. وضعیت اطلاع‌رسانی‌ها */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۲. فعال‌سازی اعلان‌های خودکار پیامکی
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1] flex items-center">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(smsSettingsForm.enableNewOrderSmsAdmin)}
                            onChange={(e) =>
                              setSmsSettingsForm({
                                ...smsSettingsForm,
                                enableNewOrderSmsAdmin: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#b59766] focus:ring-[#b59766]"
                          />
                          <span className="text-xs font-bold text-[#181818]">
                            ارسال پیامک سفارش جدید به ادمین
                          </span>
                        </label>
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1] flex items-center">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(smsSettingsForm.enableNewOrderSmsCustomer)}
                            onChange={(e) =>
                              setSmsSettingsForm({
                                ...smsSettingsForm,
                                enableNewOrderSmsCustomer: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#b59766] focus:ring-[#b59766]"
                          />
                          <span className="text-xs font-bold text-[#181818]">
                            ارسال پیامک تایید سفارش به مشتری
                          </span>
                        </label>
                      </div>

                      <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#e7dfd1] flex items-center">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(smsSettingsForm.enableNewContactMessageSms)}
                            onChange={(e) =>
                              setSmsSettingsForm({
                                ...smsSettingsForm,
                                enableNewContactMessageSms: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-[#b59766] focus:ring-[#b59766]"
                          />
                          <span className="text-xs font-bold text-[#181818]">
                            ارسال پیامک هشدار پیام تماس با ما به ادمین
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ۳. قالب‌های متنی */}
                  <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                    <h3 className="text-sm font-black text-[#181818]">
                      ۳. متن و الگوهای پیامکی (Templates)
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          متن پیامک خوش‌آمدگویی اعضای جدید:
                        </label>
                        <textarea
                          rows={2}
                          value={smsSettingsForm.welcomeSmsTemplate || ''}
                          onChange={(e) =>
                            setSmsSettingsForm({
                              ...smsSettingsForm,
                              welcomeSmsTemplate: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-[#e0e0e0] p-2.5 text-xs font-medium leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          متن پیامک ثبت سفارش جدید (مخصوص ادمین):
                        </label>
                        <textarea
                          rows={2}
                          value={smsSettingsForm.newOrderSmsTemplateAdmin || ''}
                          onChange={(e) =>
                            setSmsSettingsForm({
                              ...smsSettingsForm,
                              newOrderSmsTemplateAdmin: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-[#e0e0e0] p-2.5 text-xs font-medium leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#e7dfd1]">
                        <label className="block text-xs font-bold text-[#333]">
                          متن پیامک تایید و پرداخت فاکتور (مخصوص مشتری):
                        </label>
                        <textarea
                          rows={2}
                          value={smsSettingsForm.newOrderSmsTemplateCustomer || ''}
                          onChange={(e) =>
                            setSmsSettingsForm({
                              ...smsSettingsForm,
                              newOrderSmsTemplateCustomer: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-[#e0e0e0] p-2.5 text-xs font-medium leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* دکمه ذخیره پایانی */}
                  <div className="flex items-center justify-end pt-2 border-t border-[#efefef]">
                    <button
                      type="submit"
                      disabled={isSavingSmsSettings}
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {isSavingSmsSettings
                          ? 'در حال ذخیره و بروزرسانی...'
                          : 'ثبت و اعمال تغییرات سامانه پیامک'}
                      </span>
                    </button>
                  </div>
                </form>
               ) : activeWebsiteSettingsTab === 'faq' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingFaqSettings(true);
                    try {
                      const saved = await authFetch(
                        '/api/admin/settings/faq',
                        {
                          method: 'PUT',
                          body: JSON.stringify(faqSettingsForm),
                        }
                      );
                      setFaqSettingsForm({
                        ...INITIAL_FAQ_SETTINGS,
                        ...saved,
                      });
                      onCatalogUpdated?.();
                      showNotice(
                        'success',
                        'سوالات متداول صفحات با موفقیت ذخیره و در سایت اعمال شد.'
                      );
                    } catch (err: any) {
                      showNotice(
                        'error',
                        err?.message || 'خطا در ذخیره سوالات متداول'
                      );
                    } finally {
                      setIsSavingFaqSettings(false);
                    }
                  }}
                  className="bg-white rounded-[22px] border border-[#e7dfd1] p-6 sm:p-8 space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efefef] pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#181818]">
                        تنظیمات و مدیریت سوالات متداول صفحات (`FAQs`)
                      </h2>
                      <p className="text-xs text-[#666] mt-1">
                        مدیریت پرسش‌ها و پاسخ‌های پرتکرار مشتریان (حداقل ۱۰ سوال برای هر بخش)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {[
                      { id: 'about', label: 'صفحه درباره ما' },
                      { id: 'rules', label: 'صفحه قوانین و مقررات' },
                    ].map((section) => (
                      <div key={section.id} className="p-5 rounded-2xl bg-[#faf8f4] border border-[#ece4d4] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#ece2cf] pb-2">
                          <h3 className="text-sm font-black text-[#181818]">
                            سوالات متداول {section.label}
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              const currentFaqs = faqSettingsForm.faqs?.[section.id] || [];
                              const newItem = {
                                id: `faq-${section.id}-${Date.now()}`,
                                question: 'عنوان سوال جدید؟',
                                answer: 'متن پاسخ سوال جدید...',
                              };
                              setFaqSettingsForm({
                                ...faqSettingsForm,
                                faqs: {
                                  ...(faqSettingsForm.faqs || { about: [], rules: [] }),
                                  [section.id]: [...currentFaqs, newItem],
                                },
                              });
                            }}
                            className="h-9 px-4 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن سوال جدید</span>
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(faqSettingsForm.faqs?.[section.id] || []).map((faqItem: any, fIdx: number) => (
                            <div key={faqItem.id} className="p-4 rounded-xl bg-white border border-[#e7dfd1] space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-[#181818]">سوال {(fIdx + 1).toLocaleString('fa-IR')}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (faqSettingsForm.faqs?.[section.id] || []).filter((_: any, i: number) => i !== fIdx);
                                    setFaqSettingsForm({
                                      ...faqSettingsForm,
                                      faqs: {
                                        ...(faqSettingsForm.faqs || { about: [], rules: [] }),
                                        [section.id]: next,
                                      },
                                    });
                                  }}
                                  className="text-xs font-bold text-[#ea1d2c] hover:underline"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={faqItem.question || ''}
                                onChange={(e) => {
                                  const next = [...faqSettingsForm.faqs[section.id]];
                                  next[fIdx] = { ...faqItem, question: e.target.value };
                                  setFaqSettingsForm({
                                    ...faqSettingsForm,
                                    faqs: { ...faqSettingsForm.faqs, [section.id]: next },
                                  });
                                }}
                                className="w-full h-10 rounded-lg border border-[#e0e0e0] px-3 text-xs font-semibold"
                                placeholder="پرسش..."
                              />
                              <textarea
                                rows={2}
                                value={faqItem.answer || ''}
                                onChange={(e) => {
                                  const next = [...faqSettingsForm.faqs[section.id]];
                                  next[fIdx] = { ...faqItem, answer: e.target.value };
                                  setFaqSettingsForm({
                                    ...faqSettingsForm,
                                    faqs: { ...faqSettingsForm.faqs, [section.id]: next },
                                  });
                                }}
                                className="w-full rounded-lg border border-[#e0e0e0] p-2 text-xs font-medium"
                                placeholder="پاسخ..."
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* دکمه ذخیره پایانی */}
                  <div className="flex items-center justify-end pt-2 border-t border-[#efefef]">
                    <button
                      type="submit"
                      disabled={isSavingFaqSettings}
                      className="h-11 px-7 rounded-xl bg-[#b59766] hover:bg-[#9f8252] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingFaqSettings ? 'در حال ذخیره...' : 'ثبت و اعمال تغییرات'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white rounded-[22px] border border-[#e7dfd1] p-8 min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#faf8f4] text-[#b59766] flex items-center justify-center border border-[#ece4d4]">
                    <Settings className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#181818]">
                      {WEBSITE_SETTINGS_SUBTABS.find(
                        (t) => t.id === activeWebsiteSettingsTab
                      )?.label || 'تنظیمات وب‌سایت'}
                    </h3>
                    <p className="text-xs text-[#777] mt-1 max-w-md mx-auto leading-6">
                      تنظیمات این بخش با مقادیر پیش‌فرض فعال است. برای مدیریت صفحات «درباره ما»، «تماس با ما» یا «فوتر»، لطفاً از تب‌های بالا استفاده کنید.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* مودال فقط خواندنی مشاهده متن کامل پیام تماس با ما (بدون امکان ویرایش) */}
      {viewingMessage && (
        <div
          onClick={() => setViewingMessage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[24px] bg-white border border-[#e7dfd1] p-6 shadow-2xl space-y-5"
            dir="rtl"
            style={{
              fontFamily: "'IRANSansX', 'IranSansX', system-ui, -apple-system, sans-serif",
            }}
          >
            <div className="flex items-center justify-between border-b border-[#efefef] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#f5efe4] text-[#b59766] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#181818]">
                    مشاهده پیام ارسالی (فقط خواندنی)
                  </h3>
                  <p className="text-[11px] text-[#777] mt-0.5">
                    جزئیات کامل پیام ثبت‌شده توسط کاربر در سایت
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingMessage(null)}
                className="w-8 h-8 rounded-lg bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#444] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#faf8f4] p-4 rounded-2xl border border-[#ece4d4]">
              <div>
                <span className="block text-[11px] font-bold text-[#777]">
                  نام و نام خانوادگی فرستنده:
                </span>
                <span className="block text-sm font-black text-[#181818] mt-1">
                  {viewingMessage.fullName}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[#777]">
                  شماره تماس:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    dir="ltr"
                    className="block text-sm font-black text-[#b59766] tabular-nums text-right"
                  >
                    {viewingMessage.phone}
                  </span>
                  <a
                    href={`tel:${viewingMessage.phone}`}
                    className="px-2 py-0.5 rounded-md bg-[#b59766] hover:bg-[#9f8252] text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-2.5 h-2.5" />
                    <span>تماس</span>
                  </a>
                </div>
              </div>
              {viewingMessage.email && (
                <div className="sm:col-span-2 pt-2 border-t border-[#e8dfd0]">
                  <span className="block text-[11px] font-bold text-[#777]">
                    آدرس ایمیل:
                  </span>
                  <span dir="ltr" className="block text-xs font-bold text-[#181818] mt-1 font-sans text-right">
                    {viewingMessage.email}
                  </span>
                </div>
              )}
              <div className="sm:col-span-2 pt-2 border-t border-[#e8dfd0]">
                <span className="block text-[11px] font-bold text-[#777]">
                  موضوع پیام:
                </span>
                <span className="block text-xs font-bold text-[#222] mt-1">
                  {viewingMessage.subject}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-black text-[#181818]">
                متن کامل پیام:
              </span>
              <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#e5dfd3] text-xs sm:text-sm text-[#2b2b2b] leading-7 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {viewingMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#efefef]">
              <button
                type="button"
                onClick={() => setViewingMessage(null)}
                className="h-10 px-6 rounded-xl bg-[#1a1814] hover:bg-[#b59766] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                بستن پنجره پیام
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال خروج از حساب ادمین (وقتی دکمه خروج زده می‌شود) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
          <div
            className="w-full max-w-md rounded-[24px] bg-white border border-[#e7dfd1] p-6 shadow-2xl text-center space-y-5"
            dir="rtl"
            style={{
              fontFamily: "'IRANSansX', 'IranSansX', system-ui, -apple-system, sans-serif",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl border-2 border-[#c09d62] p-[2px] bg-[#181818] overflow-hidden shadow-md">
                <img
                  src={currentAdminAvatar}
                  alt={adminUser.displayName}
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#181818]">
                  خروج از حساب مدیریت ({adminUser.displayName})
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  آیا مطمئن هستید که می‌خواهید از پنل مدیریت خارج شوید؟ پس از خروج، برای دسترسی مجدد نیاز به وارد کردن شماره موبایل و رمز عبور خواهید داشت.
                </p>
              </div>
            </div>

            {isLoggingOutProgress ? (
              <div className="space-y-2 pt-1">
                <div className="w-full h-3 rounded-full bg-[#f0ece3] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-[#ea1d2c] transition-all duration-100"
                    style={{ width: `${logoutProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#777]">
                  <span>در حال خروج امن از پنل مدیریت...</span>
                  <span className="tabular-nums">
                    {logoutProgress.toLocaleString('fa-IR')}٪
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmAdminLogout}
                  className="h-11 rounded-xl bg-[#ea1d2c] hover:bg-[#c81422] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تایید و خروج از پنل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="h-11 rounded-xl bg-[#f4f1ea] hover:bg-[#e5dec9] text-[#333] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  انصراف و ماندن در پنل
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* مودال وضعیت انتشار یا حذف استوری در وب‌سایت همراه با نوار پیشرفت پرشونده */}
      {storyActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
          <div
            className="w-full max-w-md rounded-[24px] bg-white border border-[#e7dfd1] p-6 shadow-2xl text-center space-y-4"
            dir="rtl"
          >
            <div
              className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${
                storyActionModal.mode === 'save'
                  ? 'bg-[#f5efe4] text-[#b59766]'
                  : 'bg-[#fde8ea] text-[#ea1d2c]'
              }`}
            >
              {storyActionModal.mode === 'save' ? (
                <Check className="w-7 h-7 stroke-[2.5]" />
              ) : (
                <Trash2 className="w-7 h-7 stroke-[2.2]" />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-[#181818]">
                {storyActionModal.title}
              </h3>
              <p className="text-xs text-[#666] leading-relaxed">
                {storyActionModal.subtitle}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3 rounded-full bg-[#f0ece3] overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${
                    storyActionModal.mode === 'save'
                      ? 'bg-[#b59766]'
                      : 'bg-[#ea1d2c]'
                  }`}
                  style={{ width: `${storyActionModal.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-[#777]">
                <span>
                  {storyActionModal.mode === 'save'
                    ? 'در حال قرار دادن در وب‌سایت...'
                    : 'در حال حذف از وب‌سایت...'}
                </span>
                <span className="tabular-nums">
                  {storyActionModal.progress.toLocaleString('fa-IR')}٪
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال پیشرفت و حذف/ثبت پروژه اجرایی در وب‌سایت */}
      {projectActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
          <div
            className="w-full max-w-md rounded-[24px] bg-white border border-[#e7dfd1] p-6 shadow-2xl text-center space-y-4"
            dir="rtl"
          >
            <div
              className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${
                projectActionModal.mode === 'save'
                  ? 'bg-[#f5efe4] text-[#b59766]'
                  : 'bg-[#fde8ea] text-[#ea1d2c]'
              }`}
            >
              {projectActionModal.mode === 'save' ? (
                <Check className="w-7 h-7 stroke-[2.5]" />
              ) : (
                <Trash2 className="w-7 h-7 stroke-[2.2]" />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-[#181818]">
                {projectActionModal.title}
              </h3>
              <p className="text-xs text-[#666] leading-relaxed">
                {projectActionModal.subtitle}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3 rounded-full bg-[#f0ece3] overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${
                    projectActionModal.mode === 'save'
                      ? 'bg-[#b59766]'
                      : 'bg-[#ea1d2c]'
                  }`}
                  style={{ width: `${projectActionModal.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-[#777]">
                <span>
                  {projectActionModal.mode === 'save'
                    ? 'در حال ذخیره و به‌روزرسانی پروژه...'
                    : 'در حال حذف پروژه از دیتابیس...'}
                </span>
                <span className="tabular-nums">
                  {projectActionModal.progress.toLocaleString('fa-IR')}٪
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
