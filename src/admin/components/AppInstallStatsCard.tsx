import React from 'react';
import { Smartphone, Apple, Globe, Download, RefreshCw, BarChart3, Users, CheckCircle2 } from 'lucide-react';
import { AppInstallStats, getLocalInstallStats, saveLocalInstallStats } from '../../utils/appTracker';

interface AppInstallStatsCardProps {
  stats?: AppInstallStats;
  onRefresh?: () => void;
}

export const AppInstallStatsCard: React.FC<AppInstallStatsCardProps> = ({
  stats = getLocalInstallStats(),
  onRefresh,
}) => {
  const currentStats = stats || getLocalInstallStats();

  return (
    <div className="w-full bg-[#1e1c18] border border-[#3a352c] rounded-2xl p-5 sm:p-7 text-right dir-rtl shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#3a352c]">
        <div>
          <h3 className="text-xl sm:text-22px font-bold text-[#e6c28b] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#d4af37]" />
            آمار نصب و استفاده اپلیکیشن موبایل (اندروید & آیفون)
          </h3>
          <p className="text-xs sm:text-sm text-[#a39784] mt-1">
            آمار دقیق نصب، راه‌اندازی و کاربران فعال در پلتفرم‌های مختلف
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2a2620] hover:bg-[#38322a] text-[#e6c28b] text-xs sm:text-sm font-semibold border border-[#4a4235] transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#d4af37]" />
            بروزرسانی آمار
          </button>
        )}
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Android Card */}
        <div className="bg-[#26221c] border border-[#443c30] hover:border-[#388e3c] rounded-xl p-5 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#388e3c]/20 border border-[#388e3c]/40 flex items-center justify-center text-[#4caf50]">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#388e3c]/20 text-[#81c784] border border-[#388e3c]/30">
              اندروید (Android)
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentStats.androidCount.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-[#a39784] mt-1">نصب و اجرا (Bazaar / APK)</p>
          </div>
        </div>

        {/* iOS Card */}
        <div className="bg-[#26221c] border border-[#443c30] hover:border-[#1976d2] rounded-xl p-5 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#1976d2]/20 border border-[#1976d2]/40 flex items-center justify-center text-[#64b5f6]">
              <Apple className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1976d2]/20 text-[#64b5f6] border border-[#1976d2]/30">
              آیفون (iOS / SibApp)
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentStats.iosCount.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-[#a39784] mt-1">نصب و اجرا (App Store / IPA)</p>
          </div>
        </div>

        {/* PWA Card */}
        <div className="bg-[#26221c] border border-[#443c30] hover:border-[#d4af37] rounded-xl p-5 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#e6c28b]">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#d4af37]/20 text-[#e6c28b] border border-[#d4af37]/30">
              وب‌اپلیکیشن (PWA)
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentStats.pwaCount.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-[#a39784] mt-1">افزوده به صفحه اصلی (Home Screen)</p>
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-gradient-to-br from-[#2d271f] to-[#1e1b15] border border-[#d4af37]/60 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37] text-[#121212] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#d4af37] text-[#121212]">
              مجموع کل کاربران
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#f5d77f] tracking-tight">
              {currentStats.totalCount.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-[#d4af37]/80 mt-1">کل نصب و بازدیدهای ثبت شده</p>
          </div>
        </div>
      </div>
    </div>
  );
};
