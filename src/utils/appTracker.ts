import { saveSettingToFirestore, fetchAllDataFromFirestore } from '../lib/firestoreSync';

export interface MobileBuildItem {
  id: string;
  platform: 'android' | 'ios' | 'pwa' | 'all';
  title: string;
  version: string;
  buildNumber: number;
  fileSize: string;
  downloadUrl: string;
  releaseNotes: string;
  releaseDate: string;
  isPublished: boolean;
  targetStore: string;
}

export interface AppInstallStats {
  androidCount: number;
  iosCount: number;
  pwaCount: number;
  webCount: number;
  totalCount: number;
  lastUpdated: string;
}

export const INITIAL_MOBILE_BUILDS: MobileBuildItem[] = [
  {
    id: 'build-android-v1',
    platform: 'android',
    title: 'اپلیکیشن اندروید گالری لوستر اکبر صالحی (نسخه بازار & مایکت)',
    version: '1.0.0',
    buildNumber: 100,
    fileSize: '18.4 MB',
    downloadUrl: '/downloads/salehi-chandelier-v1.0.0.apk',
    releaseNotes: 'نسخه رسمی اندروید با پشتیبانی کامل از کاتالوگ ۳ بعدی، ثبت سفارش آنلاین، نمایش محصولات و قفل امنیتی نیتیو اسپات‌پلیر.',
    releaseDate: new Date().toISOString().split('T')[0],
    isPublished: true,
    targetStore: 'کافه بازار، مایکت & دانلود مستقیم APK',
  },
  {
    id: 'build-ios-v1',
    platform: 'ios',
    title: 'اپلیکیشن آیفون iOS گالری لوستر اکبر صالحی (نسخه اپ استور & سیب‌اپ)',
    version: '1.0.0',
    buildNumber: 100,
    fileSize: '22.1 MB',
    downloadUrl: '/downloads/salehi-chandelier-v1.0.0.ipa',
    releaseNotes: 'نسخه نیتیو آیفون با سازگاری کامل با iOS، طراحی لوکس هدر و فوتر و امکان نصب مستقیم.',
    releaseDate: new Date().toISOString().split('T')[0],
    isPublished: true,
    targetStore: 'سیب‌اپ، آی‌اپس & App Store',
  },
  {
    id: 'build-pwa-v1',
    platform: 'pwa',
    title: 'نسخه وب‌اپلیکیشن پیشرو و نصب شونده (PWA Web Build)',
    version: '1.0.0',
    buildNumber: 100,
    fileSize: '4.2 MB',
    downloadUrl: '/downloads/salehi-chandelier-pwa.zip',
    releaseNotes: 'بسته کامل وب‌اپلیکیشن مستقل (PWA) با قابلیت آفلاین و آیکون‌های رزولوشن بالای آیفون و اندروید.',
    releaseDate: new Date().toISOString().split('T')[0],
    isPublished: true,
    targetStore: 'نصب روی صفحه اصلی (Add to Home Screen)',
  },
];

export const INITIAL_INSTALL_STATS: AppInstallStats = {
  androidCount: 148,
  iosCount: 94,
  pwaCount: 230,
  webCount: 580,
  totalCount: 1052,
  lastUpdated: new Date().toISOString(),
};

const STATS_STORAGE_KEY = 'salehi_app_install_stats_v1';
const BUILDS_STORAGE_KEY = 'salehi_app_mobile_builds_v1';
const SESSION_TRACKED_KEY = 'salehi_app_install_session_tracked';

export function getLocalInstallStats(): AppInstallStats {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return INITIAL_INSTALL_STATS;
}

export function saveLocalInstallStats(stats: AppInstallStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    saveSettingToFirestore('appInstallStats', stats).catch(() => {});
  } catch {}
}

export function getLocalMobileBuilds(): MobileBuildItem[] {
  try {
    const stored = localStorage.getItem(BUILDS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return INITIAL_MOBILE_BUILDS;
}

export function saveLocalMobileBuilds(builds: MobileBuildItem[]) {
  try {
    localStorage.setItem(BUILDS_STORAGE_KEY, JSON.stringify(builds));
    saveSettingToFirestore('mobileBuilds', builds).catch(() => {});
  } catch {}
}

export function detectAppPlatform(): 'android' | 'ios' | 'pwa' | 'web' {
  if (typeof window === 'undefined') return 'web';
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

  if (isAndroid) {
    return isStandalone ? 'android' : 'android';
  }
  if (isIOS) {
    return isStandalone ? 'ios' : 'ios';
  }
  if (isStandalone) {
    return 'pwa';
  }
  return 'web';
}

export function trackCurrentAppSession(): AppInstallStats {
  const currentStats = getLocalInstallStats();
  try {
    const sessionTracked = sessionStorage.getItem(SESSION_TRACKED_KEY);
    if (sessionTracked) {
      return currentStats;
    }

    const platform = detectAppPlatform();
    const updatedStats: AppInstallStats = {
      ...currentStats,
      androidCount: platform === 'android' ? currentStats.androidCount + 1 : currentStats.androidCount,
      iosCount: platform === 'ios' ? currentStats.iosCount + 1 : currentStats.iosCount,
      pwaCount: platform === 'pwa' ? currentStats.pwaCount + 1 : currentStats.pwaCount,
      webCount: platform === 'web' ? currentStats.webCount + 1 : currentStats.webCount,
      totalCount: currentStats.totalCount + 1,
      lastUpdated: new Date().toISOString(),
    };

    sessionStorage.setItem(SESSION_TRACKED_KEY, 'true');
    saveLocalInstallStats(updatedStats);
    return updatedStats;
  } catch {
    return currentStats;
  }
}
