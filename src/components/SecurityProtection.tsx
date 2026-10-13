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
  const [isBlackoutActive, setIsBlackoutActive] = useState<boolean>(false);

  const lastAlertTimeRef = useRef<number>(0);
  const currentHoveredElementRef = useRef<Element | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const blackoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // فعال کردن مشکی شدن عکس‌ها
  const triggerBlackout = useCallback((durationMs = 5000) => {
    setIsBlackoutActive(true);
    document.documentElement.classList.add('protected-blackout-active');
    document.body?.classList.add('protected-blackout-active');
    const rootEl = document.getElementById('root');
    if (rootEl) rootEl.classList.add('protected-blackout-active');

    if (blackoutTimerRef.current) {
      clearTimeout(blackoutTimerRef.current);
    }
    blackoutTimerRef.current = setTimeout(() => {
      setIsBlackoutActive(false);
      document.documentElement.classList.remove('protected-blackout-active');
      document.body?.classList.remove('protected-blackout-active');
      if (rootEl) rootEl.classList.remove('protected-blackout-active');
    }, durationMs);
  }, []);

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
      // هنگام هرگونه تلاش برای اسکرین‌شات یا ذخیره، عکس‌ها بلافاصله مشکی می‌شوند
      triggerBlackout(5000);

      const now = Date.now();
      if (now - lastAlertTimeRef.current < 2500) return;
      lastAlertTimeRef.current = now;

      triggerHaptic();
      playAlertSound();

      // پاکسازی متن کلیپ‌بورد با مدیریت ایمن خطای فوکوس
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(
            'تصاویر و استوری‌های این وب‌سایت دارای حق کپی‌رایت اختصاصی گالری لوستر اکبر صالحی است.'
          ).catch(() => {});
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
            : 'تلاش برای ثبت اسکرین‌شات شناسایی شد و تمامی تصاویر مخفی و مشکی گردیدند.',
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
    [triggerHaptic, playAlertSound, triggerBlackout]
  );

  const handleCloseModal = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setIsBlackoutActive(false);
    document.documentElement.classList.remove('protected-blackout-active');
    document.body?.classList.remove('protected-blackout-active');
    const rootEl = document.getElementById('root');
    if (rootEl) rootEl.classList.remove('protected-blackout-active');
  };

  useEffect(() => {
    const isEditableInput = (target: Element | null): boolean => {
      if (!target) return false;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
      if (target.getAttribute('contenteditable') === 'true' || (target as HTMLElement).isContentEditable) return true;
      return Boolean(target.closest('input, textarea, [contenteditable="true"]'));
    };

    // ۱. جلوگیری سراسری از کلیک راست (Context Menu) در تمام صفحات سایت
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (isEditableInput(target)) {
        return; // اجازه استفاده عادی در فیلدهای ورودی
      }
      e.preventDefault();
      e.stopPropagation();
      triggerSecurityModal('image-save');
    };

    // ۲. جلوگیری سراسری از کپی برداری (Copy Event) در سایت
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (isEditableInput(target)) {
        return;
      }
      e.preventDefault();
      try {
        if (e.clipboardData) {
          e.clipboardData.setData(
            'text/plain',
            'محتوا، تصاویر و مدل‌های این وب‌سایت دارای حق کپی‌رایت اختصاصی گالری لوستر اکبر صالحی است.'
          );
        }
      } catch {}
      triggerSecurityModal('image-save');
    };

    // ۳. جلوگیری سراسری از هایلایت و انتخاب متن (Select Start)
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (isEditableInput(target)) {
        return;
      }
      e.preventDefault();
    };

    // ۴. جلوگیری سراسری از کشیدن و رها کردن (Drag & Drop) تمام المان‌ها و عکس‌ها
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (isEditableInput(target)) return;
      e.preventDefault();
      triggerSecurityModal('image-save');
    };

    // ۵. جلوگیری سراسری از تمامی کلیدهای میانبر اسکرین‌شات (مک، ویندوز، لینوکس)
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = (e.target || currentHoveredElementRef.current) as HTMLElement | null;
      const inInput = isEditableInput(target);

      // الف) مشکی کردن فوری و آنی تمام عکس‌ها به محض فشردن اولین کلید Modifier (Cmd, Ctrl, Shift, Alt, PrintScreen)
      // این کار باعث می‌شود قبل از اینکه کلیدهای ۳ یا ۴ یا S فشرده شوند و OS عکس بگیرد، عکس‌ها کاملاً مشکی شوند.
      if (!inInput && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.key === 'Meta' || e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'PrintScreen' || e.code === 'PrintScreen')) {
        document.documentElement.classList.add('protected-blackout-active');
        document.body?.classList.add('protected-blackout-active');
        const rootEl = document.getElementById('root');
        if (rootEl) rootEl.classList.add('protected-blackout-active');
        setIsBlackoutActive(true);
      }

      // ب) تشخیص ترکیبات اسکرین‌شات (Cmd/Ctrl + Shift یا Cmd/Ctrl + Alt)
      if ((e.metaKey || e.ctrlKey) && (e.shiftKey || e.altKey)) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityModal('screenshot');
        return;
      }

      // ج) کلید PrintScreen (دکمه اسکرین‌شات ویندوز)
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityModal('screenshot');
        return;
      }

      // د) میانبر کپی (Ctrl + C یا Cmd + C) خارج از فیلدهای ورودی
      if (!inInput && (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.code === 'KeyC' || e.key === 'ز')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityModal('image-save');
        return;
      }

      // هـ) ذخیره مستقیم صفحه با میانبر (Ctrl + S یا Cmd + S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS' || e.key === 'س')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityModal('image-save');
        return;
      }

      // و) پرینت صفحه (Ctrl + P یا Cmd + P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.code === 'KeyP' || e.key === 'ح')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityModal('screenshot');
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerSecurityModal('screenshot');
        return;
      }

      // اگر مودال باز نیست و هیچ کلید Modifier دیگری فشرده نشده است، مشکی بودن عکس‌ها را پاک کن
      if (!modalState.isOpen && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        if (blackoutTimerRef.current) clearTimeout(blackoutTimerRef.current);
        blackoutTimerRef.current = setTimeout(() => {
          if (!modalState.isOpen) {
            setIsBlackoutActive(false);
            document.documentElement.classList.remove('protected-blackout-active');
            document.body?.classList.remove('protected-blackout-active');
            const rootEl = document.getElementById('root');
            if (rootEl) rootEl.classList.remove('protected-blackout-active');
          }
        }, 300);
      }
    };

    // ۶. مدیریت تاچ در آیفون و اندروید: نگه‌داشتن دست (Long-press) یا ژست‌های چندانگشتی اسکرین‌شات
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      currentHoveredElementRef.current = target;
      if (isEditableInput(target)) return;

      // ژست‌های چندانگشتی اسکرین‌شات در آیفون و اندروید (۲ یا ۳ انگشت)
      if (e.touches && e.touches.length >= 2) {
        document.documentElement.classList.add('protected-blackout-active');
        document.body?.classList.add('protected-blackout-active');
        const rootEl = document.getElementById('root');
        if (rootEl) rootEl.classList.add('protected-blackout-active');
        setIsBlackoutActive(true);
        triggerSecurityModal('gesture');
        return;
      }

      // نگه‌داشتن دست روی عکس یا متن در گوشی برای ذخیره
      if (e.touches.length === 1) {
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

    const handlePointerOver = (e: PointerEvent) => {
      currentHoveredElementRef.current = e.target as Element | null;
    };

    // ۷. مسدودسازی برنامه‌های ضبط ویدیو و فیلمبرداری از صفحه (Screen Recording Interception)
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getDisplayMedia === 'function'
      ) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getDisplayMedia = async (options?: DisplayMediaStreamOptions) => {
          triggerSecurityModal('screenshot');
          triggerBlackout(8000);
          throw new DOMException('ضبط فیلم از وب‌سایت گالری لوستر اکبر صالحی به علت کپی‌رایت مسدود است.', 'NotAllowedError');
        };
      }
    } catch {}

    // ۸. مشکی کردن عکس‌ها هنگام باز شدن برنامه اسکرین‌شات/ضبط فیلم در آیفون و اندروید (Blur, Visibility, PageHide, Freeze)
    const handleWindowBlur = () => {
      triggerBlackout(6000);
    };

    const handleWindowFocus = () => {
      if (blackoutTimerRef.current) clearTimeout(blackoutTimerRef.current);
      setIsBlackoutActive(false);
      document.documentElement.classList.remove('protected-blackout-active');
      document.body?.classList.remove('protected-blackout-active');
      const rootEl = document.getElementById('root');
      if (rootEl) rootEl.classList.remove('protected-blackout-active');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerBlackout(6000);
      } else {
        handleWindowFocus();
      }
    };

    // ثبت شنوندگان رویدادها سراسری
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('copy', handleCopy, { capture: true });
    window.addEventListener('selectstart', handleSelectStart, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('pagehide', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('copy', handleCopy, { capture: true });
      window.removeEventListener('selectstart', handleSelectStart, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('pagehide', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [triggerSecurityModal, triggerBlackout]);

  return (
    <>
      <style>{`
        /* جلوگیری سراسری از انتخاب متن و هایلایت در تمام صفحات سایت */
        body, html, #root {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }

        /* واترمارک همیشگی کپی‌رایت روی کارت محصولات، استوری‌ها و عکس‌ها جهت مسدودسازی سودجویی از فیلمبرداری */
        .product-card, .story-item, .project-card, [data-protected-image] {
          position: relative;
        }
        .product-card::before,
        .story-item::before,
        .project-card::before {
          content: 'لوستر اکبر صالحی © Akbar Salehi';
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 15;
          font-size: 10px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.92);
          background: rgba(18, 18, 18, 0.75);
          padding: 3px 8px;
          border-radius: 6px;
          pointer-events: none;
          letter-spacing: 0.3px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 2px 5px rgba(0,0,0,0.25);
        }

        /* غیرفعال کردن کشیدن تصویر با موس یا نگه داشتن تاچ روی عکس در گوشی و دسکتاپ */
        img, picture, canvas, video, [data-protected-image] {
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
          -webkit-touch-callout: none !important;
        }

        /* مشکی شدن کامل تمامی عکس‌ها و محصولات در هنگام اسکرین‌شات یا ابزار Snipping Tool / Blur / Screen Recording */
        .protected-blackout-active img,
        .protected-blackout-active picture,
        .protected-blackout-active canvas,
        .protected-blackout-active video,
        .protected-blackout-active [data-protected-image],
        .protected-blackout-active [style*="background-image"],
        .protected-blackout-active .story-item,
        .protected-blackout-active .product-card,
        .protected-blackout-active .project-card,
        html.protected-blackout-active img,
        body.protected-blackout-active img {
          filter: brightness(0) contrast(100%) grayscale(100%) !important;
          background-color: #000000 !important;
          background-image: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }

        /* مسدودسازی کامل محتوا در زمان پرینت یا ذخیره به فایل PDF */
        @media print {
          html, body, #root {
            display: none !important;
            visibility: hidden !important;
          }
          body::after {
            content: 'امکان پرینت و ذخیره فایل PDF از وب‌سایت لوستر اکبر صالحی به علت کپی‌رایت مسدود شده است.';
            display: block !important;
            visibility: visible !important;
            font-size: 20px;
            font-weight: bold;
            color: #e52e40;
            text-align: center;
            padding: 100px 20px;
          }
        }
        /* استثنا برای فیلدهای ورودی فرم‌ها تا کاربر و ادمین به راحتی تایپ کنند */
        input, textarea, [contenteditable="true"], .selectable-text {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

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

      {/* پرده مشکی کامل روی کل صفحه در زمان ثبت اسکرین‌شات یا ابزار برش تصویر */}
      {isBlackoutActive && (
        <div
          dir="rtl"
          style={{ fontFamily: "'IRANSansX', 'IranSansX', sans-serif" }}
          className="fixed inset-0 z-[999999] bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none animate-in fade-in duration-75"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
            <CameraOff className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            تصویربرداری و ثبت اسکرین‌شات مسدود است
          </h2>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            تمامی تصاویر، مدل‌ها و محتوای گالری لوستر اکبر صالحی دارای نشان ثبت تجاری و کپی‌رایت انحصاری می‌باشند.
          </p>
        </div>
      )}

      {modalState.isOpen && (
        <>
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
              bottom-0 inset-x-0 bg-white rounded-t-[32px] px-6 pb-8 pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] flex flex-col items-stretch justify-start animate-in slide-in-from-bottom duration-300
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

            {/* نوار پیشرفت تایمر که پر می‌شود */}
            <div className="w-full h-[4px] bg-[#f0ede6] rounded-full overflow-hidden mt-4">
              <div className="h-full bg-[#e52e40] rounded-full animate-modal-fill-progress" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SecurityProtection;
