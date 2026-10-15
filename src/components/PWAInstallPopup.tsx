import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share2, PlusSquare, ShieldCheck } from 'lucide-react';

export const PWAInstallPopup: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // بستن خودکار بنر نصب بعد از ۱ دقیقه (۶۰ ثانیه)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDismissed(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  // If already installed or dismissed, hide
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Floating PWA Install Banner */}
      <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[9998] flex items-center justify-between gap-3 rounded-2xl bg-[#1a1815]/95 p-4 text-white shadow-2xl backdrop-blur-md border border-[#dfc18d]/30 shadow-black/50">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#dfc18d] to-[#b38b46] p-0.5 shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#121212]">
              <Smartphone className="h-6 w-6 text-[#dfc18d]" />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#dfc18d]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>نسخه اپلیکیشن نیتیو</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              نصب برنامه لوستر صالحی
            </div>
            <p className="text-[11px] text-gray-400">
              دسترسی بدون مرورگر و سرعت بالاتر
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable ? (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#dfc18d] to-[#b38b46] px-3.5 py-2 text-xs font-extrabold text-[#121212] shadow-lg transition-transform active:scale-95 hover:brightness-110"
            >
              <Download className="h-4 w-4" />
              <span>نصب</span>
            </button>
          ) : isIOS ? (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#dfc18d]/50 bg-[#dfc18d]/10 px-3.5 py-2 text-xs font-extrabold text-[#dfc18d] transition-all hover:bg-[#dfc18d]/20 active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>راهنمای آیفون</span>
            </button>
          ) : (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#dfc18d] to-[#b38b46] px-3.5 py-2 text-xs font-extrabold text-[#121212] shadow-lg transition-transform active:scale-95 hover:brightness-110"
            >
              <Download className="h-4 w-4" />
              <span>راهنما</span>
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            title="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* iOS & Android Guided Installation Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-[#dfc18d]/40 bg-[#181614] p-6 text-white shadow-2xl text-right">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-[#dfc18d]" />
                <h3 className="text-base font-bold text-[#dfc18d]">
                  نصب روی صفحه اصلی (Home Screen)
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="rounded-full bg-white/10 p-1.5 text-gray-300 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-gray-300 leading-relaxed">
              <p className="font-semibold text-white">
                برای تجربه اپلیکیشن مستقل و بدون نوار مرورگر:
              </p>

              <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dfc18d] text-xs font-bold text-[#121212]">
                    ۱
                  </span>
                  <div>
                    در مرورگر Safari آیفون یا Chrome، دکمه <strong className="text-[#dfc18d] inline-flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> اشتراک‌گذاری (Share)</strong> را در پایین صفحه فشار دهید.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dfc18d] text-xs font-bold text-[#121212]">
                    ۲
                  </span>
                  <div>
                    منو را به پایین بکشید و گزینه <strong className="text-[#dfc18d] inline-flex items-center gap-1"><PlusSquare className="h-3.5 w-3.5" /> افزودن به صفحه اصلی (Add to Home Screen)</strong> را انتخاب کنید.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dfc18d] text-xs font-bold text-[#121212]">
                    ۳
                  </span>
                  <div>
                    در بالا سمت راست، روی گزینه <strong>Add (افزودن)</strong> کلیک کنید.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#dfc18d]/10 p-3 text-[11px] text-[#dfc18d] border border-[#dfc18d]/20">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>با این کار برنامه به صورت نیتیو و مستقل روی آیکون‌های گوشی شما قرار می‌گیرد.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#dfc18d] to-[#b38b46] py-2.5 text-xs font-extrabold text-[#121212] transition-transform active:scale-95"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
};
