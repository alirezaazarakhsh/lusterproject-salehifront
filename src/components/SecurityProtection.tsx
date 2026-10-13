import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CameraOff, ShieldAlert, AlertOctagon, X, Lock } from 'lucide-react';

interface SecurityAlertState {
  isOpen: boolean;
  title: string;
  message: string;
  subMessage?: string;
  triggerType: 'screenshot' | 'image-save' | 'inspect' | 'gesture';
}

/**
 * تشخیص می‌دهد که آیا یک المان جزء تصاویر، استوری‌ها، یا بخش‌های دارای عکس است یا خیر
 */
function isPhotoOrStoryElement(target: Element | null): boolean {
  if (!target) return false;

  // ۱. تگ‌های مستقیم تصویر و رسانه
  if (
    target.tagName === 'IMG' ||
    target.tagName === 'PICTURE' ||
    target.tagName === 'CANVAS' ||
    target.tagName === 'VIDEO' ||
    target.getAttribute('data-protected-image') === 'true'
  ) {
    return true;
  }

  // ۲. بخش‌های استوری، اسلایدرها، گالری‌ها، کارت محصولات و پروژه‌ها
  const container = target.closest(
    'img, picture, canvas, [data-protected-image], .story-item, [data-section="stories"], [data-section="hero"], [data-section="products"], [data-section="projects"], [data-section="magazine"], [data-story-modal], [data-product-modal], .product-card, .project-card, [style*="background-image"]'
  );
  if (container) return true;

  // ۳. بررسی بک‌گراند ایمیج المان
  try {
    const computed = window.getComputedStyle(target);
    if (computed.backgroundImage && computed.backgroundImage !== 'none') {
      return true;
    }
  } catch {
    // نادیده گرفتن
  }

  return false;
}

/**
 * آیا در حال حاضر مودال استوری یا مودال عکس محصول در صفحه باز است؟
 */
function isAnyPhotoModalOpen(): boolean {
  return Boolean(
    document.querySelector(
      '[data-story-modal="true"], [data-product-modal="true"], [aria-label="نمایش استوری"], .story-modal-open'
    )
  );
}

/**
 * سیستم جامع محافظت از تصاویر و ممانعت از اسکرین‌شات و کپی
 * ویژه بخش‌های تصاویر و استوری‌های گالری لوستر اکبر صالحی
 */
export const SecurityProtection: React.FC = () => {
  const [modalState, setModalState] = useState<SecurityAlertState>({
    isOpen: false,
    title: '',
    message: '',
    triggerType: 'screenshot',
  });

  const lastAlertTimeRef = useRef<number>(0);
  const currentHoveredElementRef = useRef<Element | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // لرزش ملایم گوشی
  const triggerHaptic = useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([60, 30, 80]);
      }
    } catch {
      // نادیده گرفتن
    }
  }, []);

  // صدای ملایم هشدار امنیتی
  const playAlertSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // نادیده گرفتن
    }
  }, []);

  // نمایش الرت مودال سفید و سازگار با فونت ایران سانس پرو
  const triggerSecurityModal = useCallback(
    (reason: 'screenshot' | 'image-save' | 'gesture' = 'screenshot') => {
      const now = Date.now();
      if (now - lastAlertTimeRef.current < 2500) return;
      lastAlertTimeRef.current = now;

      triggerHaptic();
      playAlertSound();

      // پاکسازی متن کلیپ‌بورد در صورت تلاش برای کپی
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(
            'تصاویر و استوری‌های این وب‌سایت دارای حق کپی‌رایت اختصاصی گالری لوستر اکبر صالحی است.'
          );
        }
      } catch {
        // نادیده گرفتن
      }

      setModalState({
        isOpen: true,
        title: 'تصویربرداری و ذخیره عکس مسدود است',
        message:
          'عکسبرداری (اسکرین‌شات)، ذخیره و کپی تصاویر در این بخش امکان‌پذیر نمی‌باشد. تمامی تصاویر، استوری‌ها و مدل‌های سه‌بعدی گالری لوستر اکبر صالحی دارای نشان ثبت تجاری و کپی‌رایت انحصاری هستند.',
        subMessage:
          reason === 'gesture'
            ? 'سیستم ژست تصویربرداری از روی عکس را در دستگاه شما مسدود نمود.'
            : reason === 'image-save'
            ? 'تلاش برای ذخیره یا کپی مستقیم این تصویر مسدود گردید.'
            : 'تلاش برای ثبت اسکرین‌شات از عکس‌ها و استوری‌های گالری شناسایی شد.',
        triggerType: reason === 'gesture' ? 'gesture' : reason === 'image-save' ? 'image-save' : 'screenshot',
      });

      // پر شدن خط تایمر در ۴ ثانیه و بستن خودکار
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      dismissTimerRef.current = setTimeout(() => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
      }, 4000);
    },
    [triggerHaptic, playAlertSound]
  );

  const handleCloseModal = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    // ردیابی المانی که نشانگر ماوس در حال حاضر روی آن است
    const handlePointerOver = (e: PointerEvent) => {
      currentHoveredElementRef.current = e.target as Element | null;
    };

    // ۱. جلوگیری از کلیک راست روی تصاویر و استوری‌ها
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (isPhotoOrStoryElement(target) || isAnyPhotoModalOpen()) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityModal('image-save');
      }
    };

    // ۲. جلوگیری از کشیدن و رها کردن (Drag & Drop) تصاویر
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (isPhotoOrStoryElement(target)) {
        e.preventDefault();
        triggerSecurityModal('image-save');
      }
    };

    // ۳. جلوگیری از کلیدهای میانبر اسکرین‌شات و ذخیره (فقط وقتی روی بخش‌های عکس یا استوری هستیم)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isOverMedia =
        isPhotoOrStoryElement(currentHoveredElementRef.current) ||
        isPhotoOrStoryElement(document.activeElement) ||
        isAnyPhotoModalOpen();

      // کلید PrintScreen
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        if (isOverMedia) {
          e.preventDefault();
          triggerSecurityModal('screenshot');
        }
        return;
      }

      // ترکیب Win + Shift + S یا Cmd + Shift + 3/4/5
      if (
        (e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))
      ) {
        if (isOverMedia) {
          e.preventDefault();
          triggerSecurityModal('screenshot');
        }
        return;
      }

      // ذخیره مستقیم صفحه با میانبر (Ctrl + S یا Cmd + S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
        if (isOverMedia) {
          e.preventDefault();
          triggerSecurityModal('image-save');
        }
        return;
      }

      // پرینت صفحه (Ctrl + P یا Cmd + P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        if (isOverMedia) {
          e.preventDefault();
          triggerSecurityModal('screenshot');
        }
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        const isOverMedia =
          isPhotoOrStoryElement(currentHoveredElementRef.current) ||
          isPhotoOrStoryElement(document.activeElement) ||
          isAnyPhotoModalOpen();

        if (isOverMedia) {
          e.preventDefault();
          triggerSecurityModal('screenshot');
        }
      }
    };

    // ۴. مدیریت تاچ در گوشی: نگه‌داشتن دست روی عکس (Long-press) یا ژست ۳ انگشتی روی عکس
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      currentHoveredElementRef.current = target;

      const isOverMedia = isPhotoOrStoryElement(target) || isAnyPhotoModalOpen();

      // ژست ۳ انگشتی اسکرین‌شات در گوشی وقتی روی عکس یا استوری است
      if (e.touches && e.touches.length >= 3 && isOverMedia) {
        e.preventDefault();
        triggerSecurityModal('gesture');
        return;
      }

      // نگه‌داشتن دست روی عکس در گوشی (منوی دانلود تصویر در مرورگر موبایل)
      if (isOverMedia && e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
        }

        longPressTimerRef.current = setTimeout(() => {
          triggerSecurityModal('image-save');
        }, 360);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (longPressTimerRef.current && touchStartPosRef.current && e.touches[0]) {
        const dx = Math.abs(e.touches[0].clientX - touchStartPosRef.current.x);
        const dy = Math.abs(e.touches[0].clientY - touchStartPosRef.current.y);
        // لغو در صورت اسکرول عادی دست
        if (dx > 12 || dy > 12) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }
    };

    const handleTouchEnd = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    // ثبت شنوندگان رویدادها
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [triggerSecurityModal]);

  if (!modalState.isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes modalFillProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-modal-fill-progress {
          animation: modalFillProgress 4000ms linear forwards;
        }
      `}</style>

      {/* بک‌دراپ تیره و تار مطابق سایر مودال‌های سایت */}
      <div
        className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={handleCloseModal}
      />

      {/* کارت مودال کاملاً سفید و راست‌چین با فونت ایران‌سانس پرو هم در دسکتاپ و هم در موبایل */}
      <div
        dir="rtl"
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'IRANSansX', 'IranSansX', sans-serif" }}
        className="fixed z-[99999] 
          /* استایل‌های موبایل: دراور پایین صفحه کاملاً سفید */
          bottom-0 inset-x-0 bg-white rounded-t-[32px] px-6 pb-8 pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] flex flex-col items-stretch justify-start animate-in slide-in-from-bottom duration-300
          /* استایل‌های دسکتاپ: کادر سفید وسط‌چین */
          sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[500px] sm:rounded-[24px] sm:px-8 sm:py-7 sm:shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:border sm:border-[#ece8df]"
      >
        {/* دستگیره تاچ برای دراور موبایل */}
        <div className="w-12 h-1 bg-[#e4e2dc] rounded-full mx-auto mb-4 sm:hidden shrink-0" />

        {/* دکمه ضربدر بستن در دسکتاپ */}
        <button
          type="button"
          onClick={handleCloseModal}
          aria-label="بستن"
          className="hidden sm:flex absolute top-5 left-5 w-7 h-7 rounded-full items-center justify-center text-[#2b2b2b] hover:text-[#e52e40] hover:bg-[#f6f6f6] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2]" />
        </button>

        {/* هدر مودال با آیکون سپر و دوربین خط‌خورده */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] border border-[#fca5a5] flex items-center justify-center text-[#e52e40] shrink-0 shadow-xs">
            <CameraOff className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ffe4e6] text-[#e11d48] mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>محافظت از گالری و تصاویر</span>
            </div>
            <h3 className="text-[16px] sm:text-[17.5px] font-extrabold text-[#1a1a1a] leading-tight">
              {modalState.title}
            </h3>
          </div>
        </div>

        {/* توضیحات متن به فونت ایران سانس */}
        <p className="text-[13px] sm:text-[13.5px] text-[#333333] leading-[1.85] mb-3 text-right">
          {modalState.message}
        </p>

        {/* ساب مسیج راهنما */}
        {modalState.subMessage && (
          <div className="p-3 rounded-xl bg-[#fff5f5] border border-[#fed7d7] text-[11.5px] text-[#c53030] flex items-start gap-2 mb-4">
            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{modalState.subMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-[#777777] mb-4">
          <Lock className="w-3.5 h-3.5 text-[#b08754]" />
          <span>برای مشاهده جزییات یا استعلام قیمت، محصول را باز کنید.</span>
        </div>

        {/* دکمه تایید «متوجه شدم» */}
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-full sm:w-auto min-w-[130px] h-[44px] px-6 rounded-[12px] bg-[#e52e40] hover:bg-[#cf2234] active:bg-[#b81d2e] text-white text-[13.5px] font-bold transition-all cursor-pointer shadow-sm text-center flex items-center justify-center"
          >
            متوجه شدم
          </button>
        </div>

        {/* نوار پیشرفت تایمر که پر می‌شود («و پر شه هم تو دسکتاپ هم تو موبایل») */}
        <div className="w-full h-[4px] bg-[#f0ede6] rounded-full overflow-hidden mt-4">
          <div className="h-full bg-[#e52e40] rounded-full animate-modal-fill-progress" />
        </div>
      </div>
    </>
  );
};

export default SecurityProtection;
