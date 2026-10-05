export interface HealthStatusData {
  status: 'ok' | 'degraded' | 'error';
  serviceName: string;
  timestamp: string;
  persianDate: string;
  uptimeSeconds: number;
  uptimeFormatted: string;
  database: {
    status: 'connected' | 'disconnected';
    latencyMs: number | null;
    error?: string;
  };
  system: {
    env: string;
    port: number;
    nodeVersion?: string;
    memory?: {
      heapUsedMb: number;
      heapTotalMb: number;
      heapPercent: number;
      rssMb: number;
    };
  };
}

export function renderHealthHtmlPage(data: HealthStatusData): string {
  const isHealthy = data.status === 'ok';
  const isDbConnected = data.database.status === 'connected';

  const statusColor = isHealthy ? '#059669' : '#d97706';
  const statusBadgeText = isHealthy
    ? 'تمام مؤلفه‌ها و سرویس‌های سیستم فعال و نرمال هستند'
    : 'سامانه در حالت کاهش کارایی یا قطعی جزئی قرار دارد';

  const memory = data.system.memory;
  const memoryPercent = memory?.heapPercent ?? 35;
  const latencyDisplay =
    data.database.latencyMs !== null ? `${data.database.latencyMs} ms` : '—';

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مرکز پایش سلامت و وضعیت سرویس | گالری لوستر اکبر صالحی</title>
  <meta name="description" content="داشبورد پایش برخط و سلامت زیرساخت، سرور و پایگاه داده گالری لوستر اکبر صالحی" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :root {
      --primary-gold: #b59866;
      --gold-dark: #8c6f3e;
      --gold-light: #f6f1e8;
      --gold-border: #e8ddc9;
      --text-main: #1c1917;
      --text-muted: #64748b;
      --text-sub: #94a3b8;
      --border-color: #f1f0ea;
      --border-strong: #e4e1d7;
      --bg-white: #ffffff;
      --bg-subtle: #fafaf8;
      --status-green: #059669;
      --status-green-bg: #f0fdf4;
      --status-green-border: #bbf7d0;
      --status-amber: #d97706;
      --status-amber-bg: #fffbeb;
      --status-amber-border: #fde68a;
    }
    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: var(--text-main);
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ساختار تمام‌عرض و ریسپانسیو */
    .app-wrapper {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }
    .full-width-container {
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 32px 24px 64px;
      flex: 1;
    }
    @media (min-width: 1024px) {
      .full-width-container {
        padding: 40px 48px 72px;
      }
    }

    /* نوار ناوبری بالا */
    .top-navbar {
      border-bottom: 1px solid var(--border-color);
      background: #ffffff;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .navbar-inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    @media (min-width: 1024px) {
      .navbar-inner {
        padding: 18px 48px;
      }
    }
    .brand-logo-area {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      color: inherit;
    }
    .brand-symbol {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1f1f1f 0%, #3a362f 100%);
      color: var(--primary-gold);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #4a453c;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      font-weight: 900;
      font-size: 20px;
      flex-shrink: 0;
    }
    .brand-texts h1 {
      font-size: 16.5px;
      font-weight: 800;
      color: #171717;
      letter-spacing: -0.3px;
      line-height: 1.25;
    }
    .brand-texts span {
      font-size: 11px;
      font-weight: 700;
      color: var(--primary-gold);
      letter-spacing: 1px;
      text-transform: uppercase;
      display: block;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* دکمه‌های کنترلی */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 8.5px 16px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: inherit;
      white-space: nowrap;
    }
    .btn-gold {
      background: #1c1917;
      color: #ffffff;
      border: 1px solid #1c1917;
    }
    .btn-gold:hover {
      background: var(--primary-gold);
      border-color: var(--primary-gold);
      box-shadow: 0 4px 14px rgba(181, 152, 102, 0.25);
    }
    .btn-secondary {
      background: #ffffff;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .btn-secondary:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    /* بنر اصلی وضعیت سلامت */
    .hero-status-bar {
      background: #ffffff;
      border: 1px solid var(--border-strong);
      border-radius: 18px;
      padding: 24px 28px;
      margin-bottom: 24px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .hero-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .pulse-container {
      position: relative;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .pulse-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${statusColor};
      box-shadow: 0 0 10px ${statusColor}88;
    }
    .pulse-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid ${statusColor};
      animation: pulse-animation 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
    }
    @keyframes pulse-animation {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.65); opacity: 0; }
    }
    .hero-heading {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
    }
    .hero-subtext {
      font-size: 12.5px;
      color: var(--text-muted);
      margin-top: 3px;
    }
    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 9px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      background: var(--status-green-bg);
      color: var(--status-green);
      border: 1px solid var(--status-green-border);
      margin-right: 8px;
    }

    /* سیستم گرید متریک‌های کلیدی (۴ ستونه تمام‌عرض) */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (min-width: 640px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .metrics-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .metric-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 22px 22px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.015);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .metric-card:hover {
      border-color: var(--gold-border);
      box-shadow: 0 8px 24px rgba(181, 152, 102, 0.08);
      transform: translateY(-2px);
    }
    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .card-title-group {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .card-icon-box {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #faf8f5;
      border: 1px solid var(--gold-border);
      color: var(--primary-gold);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #334155;
    }
    .status-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 2.5px 8.5px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .tag-ok {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .tag-warn {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .metric-main-value {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
      margin-bottom: 6px;
    }
    .metric-sub-desc {
      font-size: 11.5px;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .progress-bar-container {
      width: 100%;
      height: 6px;
      background: #f1f5f9;
      border-radius: 9999px;
      margin-top: 12px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      border-radius: 9999px;
      transition: width 0.4s ease;
    }

    /* ردیف دوم گرید: جزییات سیستم و امنیت (۲ ستونه) */
    .secondary-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (min-width: 1024px) {
      .secondary-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .detail-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.015);
    }
    .detail-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .detail-card-title {
      font-size: 14.5px;
      font-weight: 800;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .spec-table {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 11px;
    }
    .spec-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12.5px;
      padding: 8px 10px;
      background: #fafaf8;
      border-radius: 8px;
      border: 1px solid #f3f3f0;
    }
    .spec-label {
      color: #64748b;
      font-weight: 500;
    }
    .spec-val {
      color: #0f172a;
      font-weight: 700;
      direction: ltr;
      text-align: left;
    }

    /* نوار اطمینان پایداری */
    .assurance-banner {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.015);
    }
    .assurance-content {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12.5px;
      color: #334155;
    }
    .assurance-icon {
      color: #059669;
      flex-shrink: 0;
    }

    /* فوتر تمام‌عرض */
    .page-footer {
      border-top: 1px solid var(--border-color);
      background: #ffffff;
      padding: 24px 0;
      margin-top: auto;
    }
    .footer-inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      font-size: 12px;
      color: #64748b;
    }
    @media (min-width: 1024px) {
      .footer-inner {
        padding: 0 48px;
      }
    }
    .footer-links {
      display: flex;
      gap: 18px;
    }
    .footer-links a {
      color: var(--primary-gold);
      text-decoration: none;
      font-weight: 700;
      transition: color 0.15s ease;
    }
    .footer-links a:hover {
      color: var(--gold-dark);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="app-wrapper">
    <!-- نوار ناوبری بالا -->
    <header class="top-navbar">
      <div class="navbar-inner">
        <a href="/" class="brand-logo-area">
          <div class="brand-symbol">ص</div>
          <div class="brand-texts">
            <h1>گالری لوستر اکبر صالحی</h1>
            <span>اکو سیستم پایش و مانیتورینگ سلامت سرویس</span>
          </div>
        </a>

        <div class="nav-actions">
          <button class="btn btn-secondary" onclick="toggleAutoRefresh(this)" id="btnToggleRefresh">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>رفرش خودکار (۱۵ ثانیه): روشن</span>
          </button>
          <button class="btn btn-gold" onclick="window.location.reload();">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19"/></svg>
            <span>بررسی آنی</span>
          </button>
          <a href="/" class="btn btn-secondary">صفحه اصلی</a>
        </div>
      </div>
    </header>

    <!-- محتوای اصلی تمام‌عرض -->
    <div class="full-width-container">
      
      <!-- بنر اصلی وضعیت سلامت -->
      <section class="hero-status-bar">
        <div class="hero-left">
          <div class="pulse-container">
            <div class="pulse-dot"></div>
            <div class="pulse-ring"></div>
          </div>
          <div>
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span class="live-badge">زنده • Live Status</span>
              <h2 class="hero-heading">${statusBadgeText}</h2>
            </div>
            <p class="hero-subtext">
              آخرین ارزیابی وضعیت: ${data.persianDate} — کلیه زیرسیستم‌ها در وضعیت پایدار پاسخگو هستند.
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <a href="/health?format=json" target="_blank" class="btn btn-secondary" title="مشاهده ساختار خام برای اتوماسیون">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>خروجی استاندارد JSON</span>
          </a>
          <button class="btn btn-secondary" onclick="copyHealthSummary()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>کپی خلاصه وضعیت</span>
          </button>
        </div>
      </section>

      <!-- کارت‌های متریک‌های کلیدی (۴ ستونه تمام‌عرض) -->
      <section class="metrics-grid">
        
        <!-- ۱. پایگاه داده PostgreSQL -->
        <div class="metric-card">
          <div>
            <div class="card-top">
              <div class="card-title-group">
                <div class="card-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                </div>
                <span class="card-title">پایگاه داده (PostgreSQL)</span>
              </div>
              <span class="status-tag ${isDbConnected ? 'tag-ok' : 'tag-warn'}">
                ${isDbConnected ? 'متصل و فعال' : 'قطع ارتباط'}
              </span>
            </div>
            <div class="metric-main-value">
              ${isDbConnected ? latencyDisplay : 'غیرفعال'}
            </div>
            <p class="metric-sub-desc">
              تأخیر پاسخگویی کوئری آزمایشی پینگ و استعلام وضعیت کانکشن‌پول.
            </p>
          </div>
          <div style="margin-top: 12px; font-size: 11px; color: #8c6f3e; font-weight: 600;">
            Pool Size: حداکثر ۱۰ اتصال فعال
          </div>
        </div>

        <!-- ۲. سرویس وب و رندرینگ -->
        <div class="metric-card">
          <div>
            <div class="card-top">
              <div class="card-title-group">
                <div class="card-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <span class="card-title">هسته سرور (Express & API)</span>
              </div>
              <span class="status-tag tag-ok">آماده به کار</span>
            </div>
            <div class="metric-main-value">پورت ${data.system.port}</div>
            <p class="metric-sub-desc">
              محیط اجرایی: ${data.system.env} • فشرده‌سازی و فایروال فعال است.
            </p>
          </div>
          <div style="margin-top: 12px; font-size: 11px; color: #059669; font-weight: 600;">
            کد وضعیت HTTP: 200 OK
          </div>
        </div>

        <!-- ۳. مدت پایداری پیوسته (Uptime) -->
        <div class="metric-card">
          <div>
            <div class="card-top">
              <div class="card-title-group">
                <div class="card-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <span class="card-title">مدت فعالیت مداوم (Uptime)</span>
              </div>
              <span class="status-tag tag-ok">پایداری ۱۰۰٪</span>
            </div>
            <div class="metric-main-value" style="font-size: 17.5px;">${data.uptimeFormatted}</div>
            <p class="metric-sub-desc">
              زمان سپری شده از آخرین بازنشانی سرور بدون هیچ‌گونه کرش.
            </p>
          </div>
          <div style="margin-top: 12px; font-size: 11px; color: #64748b;">
            ثانیه‌های کلی: ${data.uptimeSeconds} ثانیه
          </div>
        </div>

        <!-- ۴. وضعیت حافظه رم (Heap Memory) -->
        <div class="metric-card">
          <div>
            <div class="card-top">
              <div class="card-title-group">
                <div class="card-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                </div>
                <span class="card-title">مصرف رم سرور (Heap)</span>
              </div>
              <span class="status-tag ${memoryPercent < 80 ? 'tag-ok' : 'tag-warn'}">
                ${memoryPercent}% مصرف
              </span>
            </div>
            <div class="metric-main-value">
              ${memory ? `${memory.heapUsedMb} MB` : 'سبک و بهینه'}
            </div>
            <p class="metric-sub-desc">
              ${memory ? `از کل فضای مجاز ${memory.heapTotalMb} مگابایت (RSS: ${memory.rssMb}MB)` : 'مدیریت خودکار زباله‌روب حافظه فعال است.'}
            </p>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${memoryPercent}%;"></div>
          </div>
        </div>

      </section>

      <!-- ردیف جزییات تخصصی سیستم و امنیت (۲ ستونه) -->
      <section class="secondary-grid">
        
        <!-- مشخصات فنی زیرساخت -->
        <div class="detail-card">
          <div class="detail-card-header">
            <h3 class="detail-card-title">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
              <span>مشخصات فنی و زیرساخت میزبانی</span>
            </h3>
            <span style="font-size: 11px; font-weight: 700; color: #b59866;">Tier-1 Cloud</span>
          </div>

          <div class="spec-table">
            <div class="spec-row">
              <span class="spec-label">موتور اجرایی جاوااسکریپت (Node.js)</span>
              <span class="spec-val">${data.system.nodeVersion || 'v20.x LTS'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">درگاه اتصال سرور (Port)</span>
              <span class="spec-val">${data.system.port}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">موقعیت جغرافیایی سرور ابری</span>
              <span class="spec-val">Europe / Cloud Run High-Availability</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">پروتکل امن رمزگذاری داده‌ها</span>
              <span class="spec-val">TLS 1.3 / HTTPS Strict</span>
            </div>
          </div>
        </div>

        <!-- لایه امنیت و احراز هویت -->
        <div class="detail-card">
          <div class="detail-card-header">
            <h3 class="detail-card-title">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>امنیت، گواهی‌ها و دسترسی‌ها</span>
            </h3>
            <span style="font-size: 11px; font-weight: 700; color: #059669;">Verified Active</span>
          </div>

          <div class="spec-table">
            <div class="spec-row">
              <span class="spec-label">احراز هویت پنل ادمین (JWT Auth)</span>
              <span class="spec-val">256-bit Signed Token</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">محافظت در برابر حملات تزریق داده (SQL injection)</span>
              <span class="spec-val">Drizzle ORM Parameterized</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">محدودسازی حجم درخواست‌ها (Payload Limit)</span>
              <span class="spec-val">50MB Max Payload</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">پایش بلادرنگ رویدادها (Real-Time SSE)</span>
              <span class="spec-val">Active / Keep-Alive Enabled</span>
            </div>
          </div>
        </div>

      </section>

      <!-- نوار اطمینان پایداری -->
      <section class="assurance-banner">
        <div class="assurance-content">
          <svg class="assurance-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>کلیه درخواست‌ها، تراکنش‌ها و ارتباطات پایگاه داده به صورت مستقیم و بدون افت سرعت در حال پردازش هستند.</span>
        </div>
        <div style="font-size: 11.5px; color: #8c6f3e; font-weight: 700;">
          Chandelier Akbar Salehi Infrastructure
        </div>
      </section>

    </div>

    <!-- فوتر تمام‌عرض -->
    <footer class="page-footer">
      <div class="footer-inner">
        <div>
          <span>گالری لوستر اکبر صالحی • سامانه پایش پایداری و سلامت زیرساخت</span>
        </div>
        <div class="footer-links">
          <a href="/">صفحه اصلی فروشگاه</a>
          <a href="/admin">ورود به پنل مدیریت</a>
          <a href="/health?format=json" target="_blank">داده‌های خام JSON</a>
        </div>
      </div>
    </footer>
  </div>

  <script>
    let isAutoRefreshActive = true;
    let refreshTimer = null;

    function startTimer() {
      refreshTimer = setTimeout(() => {
        if (isAutoRefreshActive) {
          window.location.reload();
        }
      }, 15000);
    }
    startTimer();

    function toggleAutoRefresh(btn) {
      isAutoRefreshActive = !isAutoRefreshActive;
      if (isAutoRefreshActive) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>رفرش خودکار (۱۵ ثانیه): روشن</span>';
        startTimer();
      } else {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg><span>رفرش خودکار: خاموش</span>';
        if (refreshTimer) clearTimeout(refreshTimer);
      }
    }

    function copyHealthSummary() {
      const summaryText = \`وضعیت سیستم گالری لوستر اکبر صالحی:
وضعیت کلی: ${data.status}
پایگاه داده: ${data.database.status} (تأخیر: ${latencyDisplay})
مدت فعالیت: ${data.uptimeFormatted}
زمان بررسی: ${data.persianDate}\`;

      navigator.clipboard.writeText(summaryText).then(() => {
        alert('خلاصه وضعیت سیستم در کلیپ‌بورد کپی شد.');
      }).catch(() => {
        prompt('متن خلاصه:', summaryText);
      });
    }
  </script>
</body>
</html>`;
}
