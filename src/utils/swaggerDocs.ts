/**
 * OpenAPI 3.0 Complete Specification & Standalone Swagger UI Renderer
 * گالری لوستر اکبر صالحی - مستندات و محیط تست جامع API
 */

export const completeSwaggerSpec: any = {
  openapi: '3.0.0',
  info: {
    title: 'گالری لوستر اکبر صالحی API',
    version: '1.2.0',
    description: `
### محیط تست تعاملی و مستندات کامل APIهای فروشگاه و پنل مدیریت لوستر صالحی (مشابه Postman)

این مستندات شامل تمامی اندپوینت‌های عمومی (Public) و مدیریتی (Admin) است:
* **تست مستقیم اندپوینت‌ها:** روی دکمه **Try it out** در هر بخش کلیک کرده و **Execute** را بزنید.
* **احراز هویت مدیر:** ابتدا در اندپوینت \`/api/admin/login\` لاگین کرده و توکن دریافتی را در دکمه سبز **Authorize** وارد کنید.
    `,
    contact: {
      name: 'پشتیبانی فنی گالری لوستر صالحی',
      url: 'https://lostersalehi.ir',
    },
  },
  servers: [
    {
      url: 'https://lostersalehi.ir',
      description: 'سرور اصلی تولید (Production Server)',
    },
    {
      url: 'http://localhost:3000',
      description: 'سرور محلی توسعه (Development Server)',
    },
  ],
  tags: [
    { name: 'System - وضعیت سیستم', description: 'بررسی سلامت سرور، رم، آپ‌تایم و اتصال دیتابیس' },
    { name: 'Auth - احراز هویت ادمین', description: 'ورود به پنل مدیریت، دریافت مشخصات مدیر فعلی' },
    { name: 'Public Store - کاتالوگ عمومی', description: 'دریافت محصولات، دسته‌بندی‌ها، ثبت پیام و ثبت سفارش مشتری' },
    { name: 'Admin Users - مدیریت مدیران', description: 'مدیریت کاربران و سطوح دسترسی پنل' },
    { name: 'Admin Products - مدیریت محصولات', description: 'ایجاد، ویرایش، حذف و دسته‌بندی محصولات لوستر' },
    { name: 'Admin Categories - دسته‌بندی‌ها', description: 'مدیریت دسته‌بندی‌های لوستر' },
    { name: 'Admin Projects - پروژه‌ها و نمونه‌کارها', description: 'مدیریت پروژه‌های اجرا شده، گالری و لایک‌ها' },
    { name: 'Admin Stories - استوری‌ها', description: 'مدیریت استوری‌ها و اسلایدهای اینستاگرامی' },
    { name: 'Admin Articles - مقالات و وبلاگ', description: 'مدیریت اخبار و مقالات تخصصی روشنایی' },
    { name: 'Admin Orders - سفارشات مشتریان', description: 'مدیریت و تغییر وضعیت سفارشات ثبت شده' },
    { name: 'Admin Messages - پیام‌های تماس', description: 'مدیریت پیام‌های ارسالی از فرم تماس با ما' },
    { name: 'Admin Settings - تنظیمات سایت', description: 'مدیریت تنظیمات هدر، فوتر، درباره ما، بنر و پیامک' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'توکن دریافتی از لاگین را با فرمت "Bearer {token}" وارد کنید',
      },
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          timestamp: { type: 'string', example: '2026-10-05T20:00:00.000Z' },
          database: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'connected' },
              latencyMs: { type: 'number', example: 12 },
            },
          },
          system: {
            type: 'object',
            properties: {
              uptimeSeconds: { type: 'number', example: 3600 },
              uptimeFormatted: { type: 'string', example: '1 ساعت و 0 دقیقه' },
              memory: {
                type: 'object',
                properties: {
                  heapUsedMb: { type: 'number', example: 45.2 },
                  heapTotalMb: { type: 'number', example: 68.0 },
                  heapPercent: { type: 'number', example: 66 },
                },
              },
            },
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['phone', 'password'],
        properties: {
          phone: { type: 'string', example: '09121234567' },
          password: { type: 'string', example: 'admin123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'mock-jwt-token-12345' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              phone: { type: 'string', example: '09121234567' },
              displayName: { type: 'string', example: 'مدیر ارشد' },
              role: { type: 'string', example: 'super_admin' },
            },
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          productKey: { type: 'string', example: 'p1' },
          name: { type: 'string', example: 'لوستر شاه و ملکه ۲۴ شاخه' },
          subtitle: { type: 'string', example: 'لوستر کلاسیک برنز و کریستال چک' },
          priceNumeric: { type: 'integer', example: 48500000 },
          priceFormatted: { type: 'string', example: '۴۸,۵۰۰,۰۰۰ تومان' },
          image: { type: 'string', example: '/assets/images/chandelier_shah_malakeh_1790646240589.jpg' },
          categorySlug: { type: 'string', example: 'classic' },
          description: { type: 'string', example: 'لوستر فوق لوکس برنزی با آبکاری طلای ۲۴ عیار' },
          productCode: { type: 'string', example: 'CH-CLASSIC-01' },
          modelType: { type: 'string', example: 'شاخه ای' },
          defaultFinish: { type: 'string', example: 'طلایی براق' },
          dimensions: { type: 'string', example: 'قطر ۱۲۰ سانتی متر، ارتفاع ۱۴۰ سانتی متر' },
          branchesCount: { type: 'string', example: '۲۴ شاخه' },
          bodyMaterial: { type: 'string', example: 'برنز خالص و کریستال درجه یک' },
          warranty: { type: 'string', example: '۱۰ سال ضمانت ثبات رنگ و بدنه' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          slug: { type: 'string', example: 'classic' },
          title: { type: 'string', example: 'لوستر کلاسیک' },
          filterKey: { type: 'string', example: 'classic' },
          sortOrder: { type: 'integer', example: 1 },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          slug: { type: 'string', example: 'royal-restaurant' },
          title: { type: 'string', example: 'رستوران و تالار مجلل رویال' },
          subtitle: { type: 'string', example: 'طراحی و تولید ست لوسترهای مدرن سفارشی' },
          mainImage: { type: 'string', example: '/assets/images/project_royal_restaurant_1790681438681.jpg' },
          likesCount: { type: 'integer', example: 142 },
          categoryTab: { type: 'string', example: 'commercial' },
          district: { type: 'string', example: 'تهران، فرشته' },
          description: { type: 'string', example: 'پروژه جامع تجهیز نورپردازی و لوسترهای سالن اصلی' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          customerName: { type: 'string', example: 'علی رضایی' },
          customerPhone: { type: 'string', example: '09120000000' },
          itemsJson: { type: 'string', example: '[{"name":"لوستر شاه و ملکه","quantity":1,"price":48500000}]' },
          totalPriceNumeric: { type: 'integer', example: 48500000 },
          totalPriceFormatted: { type: 'string', example: '۴۸,۵۰۰,۰۰۰ تومان' },
          status: { type: 'string', enum: ['pending', 'processing', 'completed', 'cancelled'], example: 'pending' },
        },
      },
      ContactMessage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          fullName: { type: 'string', example: 'مریم احمدی' },
          phone: { type: 'string', example: '09121111111' },
          subject: { type: 'string', example: 'استعلام قیمت پروژه ویلایی' },
          message: { type: 'string', example: 'سلام، برای یک سالن با ارتفاع ۵ متر لوستر نیاز داریم.' },
          status: { type: 'string', enum: ['new', 'read'], example: 'new' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['System - وضعیت سیستم'],
        summary: 'بررسی سلامت سرور و اتصال دیتابیس',
        description: 'نمایش وضعیت زنده، میزان رم، زمان روشن بودن سرور و تاخیر اتصال به PostgreSQL.',
        responses: {
          200: {
            description: 'وضعیت سلامت سیستم',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } },
          },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['System - وضعیت سیستم'],
        summary: 'بررسی سلامت سرور و دیتابیس (API Route)',
        responses: {
          200: {
            description: 'وضعیت سلامت سیستم',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } },
          },
        },
      },
    },
    '/api/admin/login': {
      post: {
        tags: ['Auth - احراز هویت ادمین'],
        summary: 'ورود به پنل مدیریت',
        description: 'احراز هویت با شماره موبایل و رمز عبور. در صورت موفقیت، JWT Token بازگردانده می‌شود.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'ورود موفقیت‌آمیز',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          401: { description: 'اطلاعات ورود اشتباه است' },
        },
      },
    },
    '/api/auth/admin-login': {
      post: {
        tags: ['Auth - احراز هویت ادمین'],
        summary: 'ورود به پنل مدیریت (Endpoint مستعار)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'ورود موفقیت‌آمیز',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
        },
      },
    },
    '/api/admin/me': {
      get: {
        tags: ['Auth - احراز هویت ادمین'],
        summary: 'دریافت مشخصات مدیر وارد شده',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'اطلاعات مدیر' },
          401: { description: 'توکن نامعتبر یا منقضی شده' },
        },
      },
    },
    '/api/public/catalog': {
      get: {
        tags: ['Public Store - کاتالوگ عمومی'],
        summary: 'دریافت کاتالوگ کامل محصولات، دسته‌بندی‌ها و تنظیمات فروشگاه',
        description: 'این اندپوینت داده‌های اولیه فروشگاه را به صورت یکپارچه برمی‌گرداند.',
        responses: {
          200: { description: 'کاتالوگ عمومی با موفقیت دریافت شد' },
        },
      },
    },
    '/api/projects': {
      get: {
        tags: ['Admin Projects - پروژه‌ها و نمونه‌کارها'],
        summary: 'دریافت لیست نمونه‌کارها و پروژه‌ها',
        responses: {
          200: { description: 'لیست پروژه‌ها' },
        },
      },
    },
    '/api/public/projects': {
      get: {
        tags: ['Public Store - کاتالوگ عمومی'],
        summary: 'دریافت لیست پروژه‌ها برای نمایش به مشتری',
        responses: {
          200: { description: 'لیست پروژه‌ها' },
        },
      },
    },
    '/api/projects/{id}/like': {
      post: {
        tags: ['Admin Projects - پروژه‌ها و نمونه‌کارها'],
        summary: 'افزودن لایک به پروژه',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'تعداد لایک جدید بازگردانده شد' },
        },
      },
    },
    '/api/public/orders': {
      post: {
        tags: ['Public Store - کاتالوگ عمومی'],
        summary: 'ثبت سفارش جدید توسط مشتری',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' },
            },
          },
        },
        responses: {
          201: { description: 'سفارش با موفقیت ثبت شد' },
        },
      },
    },
    '/api/public/contact': {
      post: {
        tags: ['Public Store - کاتالوگ عمومی'],
        summary: 'ارسال پیام در فرم تماس با ما',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactMessage' },
            },
          },
        },
        responses: {
          201: { description: 'پیام با موفقیت ارسال شد' },
        },
      },
    },
    '/api/admin/products': {
      get: {
        tags: ['Admin Products - مدیریت محصولات'],
        summary: 'دریافت تمام محصولات فروشگاه',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'لیست محصولات' },
        },
      },
      post: {
        tags: ['Admin Products - مدیریت محصولات'],
        summary: 'ایجاد محصول جدید',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } },
        },
        responses: {
          201: { description: 'محصول با موفقیت ایجاد شد' },
        },
      },
    },
    '/api/admin/products/{id}': {
      put: {
        tags: ['Admin Products - مدیریت محصولات'],
        summary: 'بروزرسانی مشخصات محصول',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } },
        },
        responses: {
          200: { description: 'محصول بروزرسانی شد' },
        },
      },
      delete: {
        tags: ['Admin Products - مدیریت محصولات'],
        summary: 'حذف محصول',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'محصول با موفقیت حذف شد' },
        },
      },
    },
    '/api/admin/categories': {
      get: {
        tags: ['Admin Categories - دسته‌بندی‌ها'],
        summary: 'دریافت تمام دسته‌بندی‌های لوستر',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'لیست دسته‌بندی‌ها' } },
      },
      post: {
        tags: ['Admin Categories - دسته‌بندی‌ها'],
        summary: 'ایجاد دسته‌بندی جدید',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } },
        },
        responses: { 201: { description: 'دسته‌بندی جدید ایجاد شد' } },
      },
    },
    '/api/admin/orders': {
      get: {
        tags: ['Admin Orders - سفارشات مشتریان'],
        summary: 'دریافت لیست تمام سفارشات ثبت شده',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'لیست سفارشات' } },
      },
    },
    '/api/admin/orders/{id}/status': {
      patch: {
        tags: ['Admin Orders - سفارشات مشتریان'],
        summary: 'تغییر وضعیت سفارش (در حال بررسی، تکمیل شده، لغو شده)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { status: { type: 'string', enum: ['pending', 'processing', 'completed', 'cancelled'] } },
              },
            },
          },
        },
        responses: { 200: { description: 'وضعیت سفارش بروز شد' } },
      },
    },
    '/api/admin/messages': {
      get: {
        tags: ['Admin Messages - پیام‌های تماس'],
        summary: 'دریافت تمام پیام‌های ارسال شده از فرم تماس',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'لیست پیام‌ها' } },
      },
    },
    '/api/admin/stories': {
      get: {
        tags: ['Admin Stories - استوری‌ها'],
        summary: 'دریافت استوری‌ها',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'لیست استوری‌ها' } },
      },
      post: {
        tags: ['Admin Stories - استوری‌ها'],
        summary: 'ایجاد استوری جدید',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'استوری ایجاد شد' } },
      },
    },
    '/api/admin/articles': {
      get: {
        tags: ['Admin Articles - مقالات و وبلاگ'],
        summary: 'دریافت لیست مقالات',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'لیست مقالات' } },
      },
      post: {
        tags: ['Admin Articles - مقالات و وبلاگ'],
        summary: 'ایجاد مقاله جدید',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'مقاله ایجاد شد' } },
      },
    },
    '/api/admin/dashboard/summary': {
      get: {
        tags: ['System - وضعیت سیستم'],
        summary: 'آمار کلی داشبورد ادمین (تعداد سفارشات، محصولات، درآمد و پیام‌ها)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'خلاصه آمار داشبورد' } },
      },
    },
    '/api/admin/settings/footer': {
      get: {
        tags: ['Admin Settings - مدیریت تنظیمات سایت'],
        summary: 'دریافت تنظیمات فوتر',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'تنظیمات فوتر' } },
      },
      put: {
        tags: ['Admin Settings - مدیریت تنظیمات سایت'],
        summary: 'بروزرسانی تنظیمات فوتر',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'تنظیمات فوتر ذخیره شد' } },
      },
    },
    '/api/admin/settings/contact-us': {
      get: {
        tags: ['Admin Settings - مدیریت تنظیمات سایت'],
        summary: 'دریافت تنظیمات اطلاعات تماس',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'تنظیمات تماس' } },
      },
      put: {
        tags: ['Admin Settings - مدیریت تنظیمات سایت'],
        summary: 'بروزرسانی تنظیمات اطلاعات تماس',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'تنظیمات تماس ذخیره شد' } },
      },
    },
  },
};

/**
 * Render Standalone, 100% Reliable Swagger UI HTML with CDN Assets & Persian RTL Style
 */
export function renderSwaggerHtml(specUrl: string = '/api/docs.json'): string {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مستندات و محیط تست API گالری لوستر اکبر صالحی (Postman-Like)</title>
  <link rel="icon" type="image/svg+xml" href="/assets/images/Logo-Enamad1.svg" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css" />
  <style>
    @font-face {
      font-family: 'IRANSansX';
      src: url('/fonts/IRANSansX-Regular.woff2') format('woff2'),
           url('/fonts/IRANSansX-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'IRANSansX';
      src: url('/fonts/IRANSansX-Bold.woff2') format('woff2'),
           url('/fonts/IRANSansX-Bold.woff') format('woff');
      font-weight: bold;
      font-style: normal;
    }

    * {
      box-sizing: border-box;
      font-family: 'IRANSansX', 'IranSansX', system-ui, -apple-system, sans-serif !important;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #0f1115;
      color: #e5e7eb;
      direction: rtl;
    }

    /* Top Banner Header */
    .custom-header {
      background: linear-gradient(135deg, #1a1612 0%, #111216 100%);
      border-bottom: 2px solid #b08c57;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .custom-header .brand-box {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .custom-header .logo-badge {
      width: 44px;
      height: 44px;
      background: #b08c57;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 22px;
      color: #111;
      box-shadow: 0 0 15px rgba(176, 140, 87, 0.4);
    }

    .custom-header h1 {
      margin: 0;
      font-size: 19px;
      font-weight: bold;
      color: #fff;
    }

    .custom-header p {
      margin: 2px 0 0 0;
      font-size: 12px;
      color: #b08c57;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-header {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: bold;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .btn-gold {
      background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%);
      color: #111;
      border: none;
    }
    .btn-gold:hover {
      background: linear-gradient(135deg, #f3cf65 0%, #c49424 100%);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(176, 140, 87, 0.4);
      color: #e5e7eb;
    }
    .btn-outline:hover {
      background: rgba(176, 140, 87, 0.15);
      border-color: #b08c57;
    }

    /* Swagger UI Overrides */
    .swagger-ui {
      padding-bottom: 50px;
      background: #0f1115 !important;
      color: #d1d5db !important;
    }

    .swagger-ui .wrapper {
      max-width: 1280px;
      padding: 0 20px;
    }

    .swagger-ui .topbar { display: none !important; }

    .swagger-ui .info {
      margin: 25px 0;
      background: #171920;
      border: 1px solid rgba(176, 140, 87, 0.2);
      border-radius: 12px;
      padding: 24px;
    }

    .swagger-ui .info .title {
      color: #d4af37 !important;
      font-size: 26px !important;
      font-weight: bold !important;
    }

    .swagger-ui .info p, .swagger-ui .info li {
      color: #9ca3af !important;
      font-size: 14px !important;
      line-height: 1.8 !important;
    }

    .swagger-ui .scheme-container {
      background: #171920 !important;
      box-shadow: none !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 10px !important;
      padding: 16px 20px !important;
      margin-bottom: 24px !important;
    }

    .swagger-ui .opblock-tag {
      font-size: 18px !important;
      color: #f3f4f6 !important;
      border-bottom: 1px solid rgba(176, 140, 87, 0.3) !important;
      padding: 14px 0 10px 0 !important;
      margin-top: 20px !important;
    }

    .swagger-ui .opblock {
      border-radius: 10px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      margin-bottom: 14px !important;
      border-width: 1px !important;
    }

    .swagger-ui .opblock .opblock-summary {
      padding: 10px 16px !important;
    }

    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 6px !important;
      font-weight: bold !important;
      min-width: 80px !important;
      text-align: center !important;
    }

    .swagger-ui .opblock .opblock-summary-path {
      font-size: 14px !important;
      font-weight: 600 !important;
    }

    .swagger-ui .opblock .opblock-summary-description {
      font-size: 13px !important;
      color: #9ca3af !important;
    }

    .swagger-ui .btn.authorize {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      border: none !important;
      color: #fff !important;
      border-radius: 8px !important;
      padding: 8px 20px !important;
      font-weight: bold !important;
    }

    .swagger-ui .btn.authorize svg {
      fill: #fff !important;
    }

    .swagger-ui .btn.execute {
      background: linear-gradient(135deg, #d4af37 0%, #b08c57 100%) !important;
      border: none !important;
      color: #111 !important;
      font-weight: bold !important;
      border-radius: 8px !important;
      padding: 8px 30px !important;
    }

    .swagger-ui .opblock-body pre {
      border-radius: 8px !important;
      background: #1e222d !important;
      color: #a7f3d0 !important;
    }

    .swagger-ui select, .swagger-ui input[type=text], .swagger-ui textarea {
      border-radius: 6px !important;
      background: #1e222d !important;
      color: #fff !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      padding: 8px 12px !important;
    }
  </style>
</head>
<body>

  <header class="custom-header">
    <div class="brand-box">
      <div class="logo-badge">💎</div>
      <div>
        <h1>مستندات API و محیط تست تعاملی لوستر صالحی</h1>
        <p>محیط اجرای زنده و آزمایش APIهای Backend مشابه Postman</p>
      </div>
    </div>
    <div class="header-actions">
      <a href="/admin" class="btn-header btn-outline">← پنل مدیریت</a>
      <a href="/health" target="_blank" class="btn-header btn-outline">وضعیت سرور (Health)</a>
      <a href="/api/docs.json" target="_blank" class="btn-header btn-gold">دریافت OpenAPI JSON</a>
    </div>
  </header>

  <div id="swagger-ui"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "${specUrl}",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout",
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        docExpansion: "list",
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
        persistAuthorization: true,
        onComplete: function() {
          console.log('✅ Swagger UI Initialized');
        }
      });
      window.ui = ui;
    };
  </script>
</body>
</html>`;
}
