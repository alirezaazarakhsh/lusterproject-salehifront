import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import path from 'path';
import { pool } from './src/db/index.ts';
import {
  renderHealthHtmlPage,
  type HealthStatusData,
} from './src/utils/healthPageTemplate.ts';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import {
  authenticateAdminByPhoneAndPassword,
  createAdminUser,
  deleteAdminUser,
  getUsers,
  updateAdminUser,
} from './src/db/users.ts';
import {
  getAllCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllProducts,
  createProductRecord,
  updateProductRecord,
  deleteProductRecord,
  getAllProjects,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord,
  toggleProjectLike,
  updateProjectLikesCount,
  getAllStories,
  createStoryRecord,
  updateStoryRecord,
  deleteStoryRecord,
  getAllArticles,
  createArticleRecord,
  updateArticleRecord,
  deleteArticleRecord,
  getAllContactMessages,
  createContactMessageRecord,
  updateContactMessageRecord,
  updateContactMessageStatus,
  deleteContactMessageRecord,
  getAllOrders,
  createOrderRecord,
  updateOrderRecord,
  updateOrderStatus,
  deleteOrderRecord,
  getDashboardSummary,
  getFooterSettings,
  saveFooterSettings,
  getContactUsSettings,
  saveContactUsSettings,
  getAboutUsSettings,
  saveAboutUsSettings,
  getHeroSliderSettings,
  saveHeroSliderSettings,
  getMainSettings,
  saveMainSettings,
  getSmsSettings,
  saveSmsSettings,
  getFaqSettings,
  saveFaqSettings,
  ensureSeeded,
} from './src/db/repository.ts';
import { autoInitPostgresSchema } from './src/db/initSchema.ts';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json({ limit: '50mb' }));
  
  // CORS Fallback
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Swagger Configuration
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'گالری لوستر اکبر صالحی API',
        version: '1.2.0',
        description: 'مستندات کامل و محیط تست APIهای پنل مدیریت و فروشگاه لوستر صالحی. این محیط مشابه Postman امکان تست مستقیم تمام فراخوانی‌ها را فراهم می‌کند.',
        contact: {
          name: 'تیم فنی صالحی',
          url: 'https://lostersalehi.ir',
        },
      },
      servers: [
        {
          url: 'https://lostersalehi.ir',
          description: 'سرور اصلی (Production)',
        },
        {
          url: `http://localhost:${PORT}`,
          description: 'سرور محلی (Development)',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Product: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              productKey: { type: 'string' },
              name: { type: 'string' },
              subtitle: { type: 'string' },
              priceNumeric: { type: 'integer' },
              priceFormatted: { type: 'string' },
              image: { type: 'string', description: 'آدرس تصویر یا Base64' },
              categorySlug: { type: 'string' },
              description: { type: 'string' },
              productCode: { type: 'string' },
              modelType: { type: 'string' },
              defaultFinish: { type: 'string' },
              dimensions: { type: 'string' },
              branchesCount: { type: 'string' },
              bodyMaterial: { type: 'string' },
              warranty: { type: 'string' },
            },
          },
          Category: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              slug: { type: 'string' },
              title: { type: 'string' },
              filterKey: { type: 'string' },
              sortOrder: { type: 'integer' },
            },
          },
          Project: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              slug: { type: 'string' },
              title: { type: 'string' },
              subtitle: { type: 'string' },
              mainImage: { type: 'string' },
              likesCount: { type: 'integer' },
              categoryTab: { type: 'string' },
              district: { type: 'string' },
              description: { type: 'string' },
              galleryJson: { type: 'string' },
              dateBadge: { type: 'string' },
              ownerName: { type: 'string' },
            },
          },
          Order: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              customerName: { type: 'string' },
              customerPhone: { type: 'string' },
              itemsJson: { type: 'string' },
              totalPriceNumeric: { type: 'integer' },
              totalPriceFormatted: { type: 'string' },
              status: { type: 'string', enum: ['pending', 'processing', 'completed', 'cancelled'] },
            },
          },
          Story: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              storyKey: { type: 'string' },
              storyType: { type: 'string' },
              title: { type: 'string' },
              fullTitle: { type: 'string' },
              subtitle: { type: 'string' },
              image: { type: 'string' },
              slidesJson: { type: 'string' },
            },
          },
          Article: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              articleKey: { type: 'string' },
              title: { type: 'string' },
              excerpt: { type: 'string' },
              content: { type: 'string' },
              image: { type: 'string' },
              publishDate: { type: 'string' },
            },
          },
          ContactMessage: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              fullName: { type: 'string' },
              phone: { type: 'string' },
              subject: { type: 'string' },
              message: { type: 'string' },
              status: { type: 'string', enum: ['new', 'read'] },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              uid: { type: 'string' },
              phone: { type: 'string' },
              displayName: { type: 'string' },
              role: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
    apis: [
      path.join(process.cwd(), 'server.ts'),
      './server.ts',
      './src/db/*.ts'
    ],
  };

  let swaggerDocs;
  try {
    swaggerDocs = swaggerJsdoc(swaggerOptions);
    console.log('✅ Swagger documentation generated successfully');
  } catch (err) {
    console.error('❌ Failed to generate Swagger docs:', err);
    swaggerDocs = { openapi: '3.0.0', info: { title: 'Error' }, paths: {} };
  }
  
  // تزریق فونت سایت به سواگر و اصلاح استایل لینک‌ها
  const swaggerCustomCss = `
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
    .swagger-ui { font-family: 'IRANSansX', 'IranSansX', sans-serif !important; direction: rtl !important; }
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #b08c57; font-family: 'IRANSansX', sans-serif !important; }
    .swagger-ui .opblock .opblock-summary-method { border-radius: 8px }
    .swagger-ui input, .swagger-ui select, .swagger-ui textarea { font-family: 'IRANSansX', sans-serif !important; }
    .swagger-ui .opblock .opblock-summary-path { font-weight: bold; color: #333; }
    .swagger-ui .opblock .opblock-summary-description { font-family: 'IRANSansX', sans-serif !important; margin-right: 10px; }
    .swagger-ui .opblock .opblock-summary { flex-direction: row-reverse; }
  `;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss: swaggerCustomCss,
    customSiteTitle: "مستندات API لوستر صالحی (Postman-Like)"
  }));
  app.get('/api/docs.json', (_req, res) => {
    res.json(swaggerDocs);
  });

  // مقداردهی و ایجاد خودکار جداول PostgreSQL و سیدینگ در لوکال هاست یا داکر
  autoInitPostgresSchema(pool)
    .then(() => ensureSeeded())
    .catch((err) => {
      console.warn('Postgres auto init notice:', err?.message || err);
    });

  app.use(express.json({ limit: '50mb' }));
  
  // Explicitly serve public assets in both dev and prod for robustness
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));
  app.use('/assets', express.static(path.join(process.cwd(), 'dist/assets')));
  app.use('/assets', express.static(path.join(process.cwd(), 'src/assets')));
  app.use('/fonts', express.static(path.join(process.cwd(), 'public/fonts')));
  app.use('/fonts', express.static(path.join(process.cwd(), 'dist/fonts')));

  /**
   * @openapi
   * /api/health:
   *   get:
   *     summary: بررسی وضعیت سلامت سرور و دیتابیس
   *     tags: [System]
   *     responses:
   *       200:
   *         description: وضعیت سلامت سیستم
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: 'string' }
   *                 database: { type: 'object' }
   *                 system: { type: 'object' }
   */
  app.get(['/health', '/api/health'], async (req, res) => {
    let dbStatus: 'connected' | 'disconnected' = 'connected';
    let dbLatencyMs: number | null = null;
    let dbError: string | undefined = undefined;

    try {
      const startPing = Date.now();
      await pool.query('SELECT 1 as ping');
      dbLatencyMs = Date.now() - startPing;
    } catch (err: any) {
      dbStatus = 'disconnected';
      dbError = err?.message || 'خطا در اتصال به پایگاه داده';
    }

    const memory = process.memoryUsage();
    const heapUsedMb = Math.round((memory.heapUsed / 1024 / 1024) * 10) / 10;
    const heapTotalMb = Math.round((memory.heapTotal / 1024 / 1024) * 10) / 10;
    const rssMb = Math.round((memory.rss / 1024 / 1024) * 10) / 10;
    const heapPercent =
      heapTotalMb > 0
        ? Math.min(100, Math.round((heapUsedMb / heapTotalMb) * 100))
        : 0;

    const uptimeSec = Math.floor(process.uptime());
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;
    const uptimeFormatted = `${days > 0 ? `${days} روز و ` : ''}${hours > 0 ? `${hours} ساعت و ` : ''}${minutes} دقیقه و ${seconds} ثانیه`;

    const now = new Date();
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Tehran',
    }).format(now);

    const healthData: HealthStatusData = {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      serviceName: 'گالری لوستر اکبر صالحی',
      timestamp: now.toISOString(),
      persianDate,
      uptimeSeconds: uptimeSec,
      uptimeFormatted,
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        error: dbError,
      },
      system: {
        env: process.env.NODE_ENV || 'production',
        port: PORT,
        nodeVersion: process.version,
        memory: {
          heapUsedMb,
          heapTotalMb,
          heapPercent,
          rssMb,
        },
      },
    };

    const wantsJson =
      req.query.format === 'json' ||
      req.headers.accept?.includes('application/json') ||
      !req.headers.accept?.includes('text/html');

    if (wantsJson) {
      res.status(200).json(healthData);
    } else {
      res
        .status(200)
        .setHeader('Content-Type', 'text/html; charset=utf-8')
        .send(renderHealthHtmlPage(healthData));
    }
  });

  let sseClients: any[] = [];
  const broadcastSseEvent = (data: any) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    sseClients.forEach((client) => {
      try {
        client.write(payload);
      } catch {
        // ignore
      }
    });
  };

  /**
   * @openapi
   * /api/realtime/stream:
   *   get:
   *     summary: اتصال ریل‌تایم (SSE)
   *     description: برقراری اتصال مداوم برای دریافت اعلان‌های آنی در صورت بروز هرگونه تغییر در دیتابیس یا کاتالوگ محصولات.
   *     tags: [System - سیستم]
   *     responses:
   *       200:
   *         description: اتصال موفقیت‌آمیز SSE
   */
  app.get('/api/realtime/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
  });

  app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
      const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
      const isAdminMutation = req.path.startsWith('/api/admin/') && req.method !== 'GET';
      const isPublicLikeMutation = req.path.includes('/like') && req.method === 'POST';
      const isPublicContactMutation = (req.path === '/api/contact' || req.path === '/api/public/contact') && req.method === 'POST';

      const result = originalJson.call(this, body);

      if (isSuccess && (isAdminMutation || isPublicLikeMutation || isPublicContactMutation)) {
        setTimeout(() => {
          broadcastSseEvent({ type: 'catalog-updated', path: req.path, method: req.method, timestamp: Date.now() });
        }, 100);
      }
      return result;
    };
    next();
  });

  // ==================== ۱. APIهای عمومی فروشگاه (متصل به دیتابیس PostgreSQL) ====================
  /**
   * @openapi
   * /api/public/catalog:
   *   get:
   *     summary: دریافت کاتالوگ کامل (عمومی)
   *     description: دریافت تمامی اطلاعات مورد نیاز برای صفحه اصلی و فروشگاه شامل محصولات، دسته‌بندی‌ها، پروژه‌ها و تنظیمات کلی سایت.
   *     tags: [Public - عمومی]
   *     responses:
   *       200:
   *         description: کاتالوگ کامل دیتابیس
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
   *                 categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } }
   *                 projects: { type: 'array', items: { $ref: '#/components/schemas/Project' } }
   *                 stories: { type: 'array', items: { $ref: '#/components/schemas/Story' } }
   *                 articles: { type: 'array', items: { $ref: '#/components/schemas/Article' } }
   *                 footerSettings: { type: 'object' }
   *                 mainSettings: { type: 'object' }
   *       500:
   *         description: خطای سرور
   */
  app.get('/api/public/catalog', async (_req, res) => {
    try {
      const [
        categoriesList,
        productsList,
        projectsList,
        storiesList,
        articlesList,
        footerSettings,
        contactUsSettings,
        aboutUsSettings,
        heroSliderSettings,
        mainSettings,
        smsSettings,
        faqSettings,
      ] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
        getAllProjects(),
        getAllStories(),
        getAllArticles(),
        getFooterSettings(),
        getContactUsSettings(),
        getAboutUsSettings(),
        getHeroSliderSettings(),
        getMainSettings(),
        getSmsSettings(),
        getFaqSettings(),
      ]);
      res.json({
        categories: categoriesList,
        products: productsList,
        projects: projectsList,
        stories: storiesList,
        articles: articlesList,
        footerSettings,
        contactUsSettings,
        aboutUsSettings,
        heroSliderSettings,
        mainSettings,
        smsSettings,
        faqSettings,
      });
    } catch (error: any) {
      console.error('Failed to load public catalog:', error);
      res
        .status(500)
        .json({ error: error.message || 'خطا در دریافت اطلاعات فروشگاه' });
    }
  });

  /**
   * @openapi
   * /api/contact:
   *   post:
   *     summary: ثبت پیام جدید در بخش تماس با ما
   *     description: ارسال اطلاعات فرم تماس توسط مشتری برای ادمین.
   *     tags: [Public - عمومی]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fullName: { type: 'string' }
   *               phone: { type: 'string' }
   *               subject: { type: 'string' }
   *               message: { type: 'string' }
   *     responses:
   *       201:
   *         description: پیام با موفقیت ثبت شد
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContactMessage'
   */
  app.post(['/api/contact', '/api/public/contact'], async (req, res) => {
    try {
      const { fullName, phone, mobilePhone, email, subject, message, messageText } = req.body || {};
      const finalName = fullName || '';
      const finalPhone = phone || mobilePhone || '';
      const finalMessage = message || messageText || '';
      const finalSubject = subject || '';
      const finalEmail = email || '';

      if (!String(finalName).trim() || !String(finalPhone).trim() || !String(finalMessage).trim() || !String(finalSubject).trim()) {
        return res
          .status(400)
          .json({ error: 'نام، شماره تماس، موضوع و متن پیام الزامی است.' });
      }
      const created = await createContactMessageRecord({
        fullName: String(finalName).trim(),
        phone: String(finalPhone).trim(),
        email: String(finalEmail).trim(),
        subject: String(finalSubject).trim(),
        message: String(finalMessage).trim(),
      });
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Failed to create contact message:', error);
      res.status(500).json({ error: error.message || 'خطا در ثبت پیام' });
    }
  });

  /**
   * @openapi
   * /api/public/orders:
   *   post:
   *     summary: ثبت سفارش جدید توسط مشتری
   *     description: ثبت اطلاعات خرید مشتری در دیتابیس برای پیگیری توسط ادمین.
   *     tags: [Public - عمومی]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Order'
   *     responses:
   *       201:
   *         description: سفارش با موفقیت ثبت شد
   */
  app.post('/api/public/orders', async (req, res) => {
    try {
      const {
        customerName,
        customerPhone,
        itemsJson,
        totalPriceNumeric,
        totalPriceFormatted,
        totalAmountNumeric,
        totalAmountFormatted,
      } = req.body || {};
      if (!customerName || !customerPhone) {
        return res
          .status(400)
          .json({ error: 'نام و شماره تماس سفارش‌دهنده الزامی است.' });
      }
      const numericPrice =
        Number(totalPriceNumeric ?? totalAmountNumeric) || 0;
      const formattedPrice = String(
        totalPriceFormatted || totalAmountFormatted || '۰ تومان'
      );
      const created = await createOrderRecord({
        customerName: String(customerName),
        customerPhone: String(customerPhone),
        itemsJson:
          typeof itemsJson === 'string'
            ? itemsJson
            : JSON.stringify(itemsJson || []),
        totalPriceNumeric: numericPrice,
        totalPriceFormatted: formattedPrice,
      });
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Failed to create order:', error);
      res.status(500).json({ error: error.message || 'خطا در ثبت سفارش' });
    }
  });

  // ==================== ۲. APIهای احراز هویت و پنل مدیریت گرافیکی ====================
  // Initial admin credentials can be configured through ADMIN_INITIAL_PHONE and ADMIN_INITIAL_PASSWORD.
  /**
   * @openapi
   * /api/admin/login:
   *   post:
   *     summary: ورود به پنل مدیریت
   *     description: احراز هویت ادمین با استفاده از شماره موبایل و رمز عبور. در صورت موفقیت، توکن JWT بازگردانده می‌شود.
   *     tags: [Admin Auth - احراز هویت]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [phone, password]
   *             properties:
   *               phone:
   *                 type: string
   *                 description: شماره موبایل ادمین (مثال 09120759419)
   *               password:
   *                 type: string
   *                 description: رمز عبور پنل مدیریت
   *     responses:
   *       200:
   *         description: ورود موفقیت‌آمیز و دریافت توکن
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token: { type: 'string' }
   *                 user: { $ref: '#/components/schemas/User' }
   *       401:
   *         description: شماره موبایل یا رمز عبور اشتباه است
   *       503:
   *         description: خطا در اتصال به سرویس احراز هویت
   */
  app.post(['/api/admin/login', '/api/auth/admin-login'], async (req, res) => {
    console.log(`Login attempt for: ${req.body?.phone}`);
    try {
      const { phone, password } = req.body || {};
      const authResult = await authenticateAdminByPhoneAndPassword(
        String(phone || ''),
        String(password || '')
      );
      res.json(authResult);
    } catch (error: any) {
      console.error('Admin login error:', error);
      const isInvalidCredentials =
        error?.message === 'شماره موبایل یا رمز عبور اشتباه است.';
      res.status(isInvalidCredentials ? 401 : 503).json({
        error:
          error?.message ||
          (isInvalidCredentials
            ? 'شماره موبایل یا رمز عبور اشتباه است.'
            : 'خطا در اتصال به سرویس ورود.'),
      });
    }
  });

  /**
   * @openapi
   * /api/admin/me:
   *   get:
   *     summary: دریافت اطلاعات پروفایل ادمین
   *     description: دریافت اطلاعات کامل حساب کاربری ادمین جاری شامل نام، نقش و دسترسی‌ها بر اساس توکن فعال.
   *     tags: [Admin Auth - احراز هویت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: اطلاعات پروفایل با موفقیت دریافت شد
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 admin: { $ref: '#/components/schemas/User' }
   */
  app.get('/api/admin/me', requireAuth, async (req: AuthRequest, res) => {
    res.json({ admin: req.user, user: req.user });
  });

  /**
   * @openapi
   * /api/admin/dashboard:
   *   get:
   *     summary: آمار داشبورد مدیریت
   *     description: دریافت تعداد محصولات، دسته‌بندی‌ها، سفارشات، پیام‌ها و سایر آمارهای کلیدی برای نمایش در صفحه اصلی پنل ادمین.
   *     tags: [Admin Dashboard - داشبورد]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: آمار داشبورد
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 productsCount: { type: 'integer' }
   *                 categoriesCount: { type: 'integer' }
   *                 ordersCount: { type: 'integer' }
   *                 messagesCount: { type: 'integer' }
   */
  app.get(
    ['/api/admin/summary', '/api/admin/dashboard'],
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const summary = await getDashboardSummary();
        res.json(summary);
      } catch (error: any) {
        console.error('Failed to fetch dashboard summary:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت آمار داشبورد' });
      }
    }
  );

  // مدیریت ادمین‌ها (دریافت، افزودن ادمین جدید، ویرایش رمز/مشخصات، حذف ادمین)
  /**
   * @openapi
   * /api/admin/users:
   *   get:
   *     summary: لیست ادمین‌های سیستم
   *     description: دریافت لیست تمامی مدیران سایت به همراه شماره تماس و نقش‌های آن‌ها.
   *     tags: [Admin Users - مدیریت ادمین‌ها]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست ادمین‌ها
   *   post:
   *     summary: ایجاد مدیر جدید
   *     description: ثبت یک حساب کاربری جدید برای دسترسی به پنل مدیریت با تعیین دسترسی‌های خاص.
   *     tags: [Admin Users - مدیریت ادمین‌ها]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               phone: { type: 'string' }
   *               password: { type: 'string' }
   *               displayName: { type: 'string' }
   *               email: { type: 'string' }
   *     responses:
   *       201:
   *         description: ادمین با موفقیت ایجاد شد
   */
  app.get('/api/admin/users', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const allUsers = await getUsers();
      res.json(allUsers);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      res
        .status(500)
        .json({ error: error.message || 'خطا در دریافت لیست ادمین‌ها' });
    }
  });

  app.post('/api/admin/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const created = await createAdminUser(req.body || {});
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Failed to create admin user:', error);
      res
        .status(400)
        .json({ error: error.message || 'خطا در افزودن ادمین جدید' });
    }
  });

  /**
   * @openapi
   * /api/admin/users/{id}:
   *   put:
   *     summary: ویرایش اطلاعات ادمین
   *     tags: [Admin Users - ادمین‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *   delete:
   *     summary: حذف ادمین
   *     tags: [Admin Users - ادمین‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   */
  app.put(
    '/api/admin/users/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateAdminUser(id, req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update admin user:', error);
        res.status(400).json({ error: error.message || 'خطا در ویرایش ادمین' });
      }
    }
  );

  app.delete(
    '/api/admin/users/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const result = await deleteAdminUser(id);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete admin user:', error);
        res.status(400).json({ error: error.message || 'خطا در حذف ادمین' });
      }
    }
  );

  // مدیریت محصولات
  /**
   * @openapi
   * /api/admin/products:
   *   get:
   *     summary: لیست تمامی محصولات
   *     description: دریافت لیست کامل محصولات موجود در انبار برای نمایش در پنل مدیریت.
   *     tags: [Admin Products - مدیریت محصولات]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست محصولات
   *   post:
   *     summary: افزودن محصول جدید
   *     description: ثبت یک محصول جدید شامل نام، قیمت، تصویر و سایر مشخصات فنی در دیتابیس.
   *     tags: [Admin Products - مدیریت محصولات]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: محصول با موفقیت ایجاد شد
   */
  app.get(
    '/api/admin/products',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const list = await getAllProducts();
        res.json(list);
      } catch (error: any) {
        console.error('Failed to fetch admin products:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت محصولات' });
      }
    }
  );

  app.post(
    '/api/admin/products',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const created = await createProductRecord(req.body);
        res.status(201).json(created);
      } catch (error: any) {
        console.error('Failed to create product:', error);
        res.status(500).json({ error: error.message || 'خطا در ثبت محصول' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/products/{id}:
   *   put:
   *     summary: ویرایش محصول موجود
   *     description: تغییر مشخصات، قیمت یا تصویر یک محصول ثبت شده با استفاده از شناسه آن.
   *     tags: [Admin Products - مدیریت محصولات]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *   delete:
   *     summary: حذف محصول از انبار
   *     description: حذف دائمی رکورد یک محصول از دیتابیس.
   *     tags: [Admin Products - مدیریت محصولات]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   */
  app.put(
    '/api/admin/products/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateProductRecord(id, req.body);
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update product:', error);
        res.status(500).json({ error: error.message || 'خطا در ویرایش محصول' });
      }
    }
  );

  app.delete(
    '/api/admin/products/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const result = await deleteProductRecord(id);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete product:', error);
        res.status(500).json({ error: error.message || 'خطا در حذف محصول' });
      }
    }
  );

  // مدیریت دسته‌بندی‌ها
  /**
   * @openapi
   * /api/admin/categories:
   *   get:
   *     summary: لیست تمامی دسته‌بندی‌ها
   *     description: دریافت لیست دسته‌بندی‌های محصولات (لوستر، آباژور و غیره).
   *     tags: [Admin Categories - مدیریت دسته‌بندی‌ها]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست دسته‌بندی‌ها
   *   post:
   *     summary: ایجاد دسته‌بندی جدید
   *     tags: [Admin Categories - مدیریت دسته‌بندی‌ها]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Category'
   *     responses:
   *       201:
   *         description: دسته‌بندی با موفقیت ایجاد شد
   */
  app.get(
    '/api/admin/categories',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const list = await getAllCategories();
        res.json(list);
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت دسته‌بندی‌ها' });
      }
    }
  );

  app.post(
    '/api/admin/categories',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const created = await createCategory(req.body);
        res.status(201).json(created);
      } catch (error: any) {
        console.error('Failed to create category:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ثبت دسته‌بندی' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/categories/{id}:
   *   put:
   *     summary: ویرایش دسته‌بندی
   *     tags: [Admin Categories - دسته‌بندی‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *   delete:
   *     summary: حذف دسته‌بندی
   *     tags: [Admin Categories - دسته‌بندی‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   */
  app.put(
    '/api/admin/categories/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateCategoryById(id, req.body);
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update category:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ویرایش دسته‌بندی' });
      }
    }
  );

  app.delete(
    '/api/admin/categories/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const result = await deleteCategoryById(id);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete category:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در حذف دسته‌بندی' });
      }
    }
  );

  // مدیریت پروژه‌های اجرایی
  /**
   * @openapi
   * /api/admin/projects:
   *   get:
   *     summary: لیست تمامی پروژه‌های اجرایی
   *     description: دریافت لیست پروژه‌های بزرگ انجام شده توسط گالری صالحی برای مدیریت در پنل ادمین.
   *     tags: [Admin Projects - مدیریت پروژه‌ها]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست پروژه‌ها
   *   post:
   *     summary: ثبت پروژه جدید
   *     tags: [Admin Projects - مدیریت پروژه‌ها]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Project'
   *     responses:
   *       201:
   *         description: پروژه با موفقیت ثبت شد
   */
  app.get(
    '/api/admin/projects',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const list = await getAllProjects();
        res.json(list);
      } catch (error: any) {
        console.error('Failed to fetch projects:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت پروژه‌ها' });
      }
    }
  );

  app.post(
    '/api/admin/projects',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const created = await createProjectRecord(req.body);
        res.status(201).json(created);
      } catch (error: any) {
        console.error('Failed to create project:', error);
        res.status(500).json({ error: error.message || 'خطا در ثبت پروژه' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/projects/{id}:
   *   put:
   *     summary: ویرایش پروژه اجرایی
   *     tags: [Admin Projects - مدیریت پروژه‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Project'
   *     responses:
   *       200:
   *         description: پروژه با موفقیت ویرایش شد
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *   delete:
   *     summary: حذف پروژه
   *     tags: [Admin Projects - مدیریت پروژه‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: پروژه حذف شد
   */
  app.put(
    '/api/admin/projects/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateProjectRecord(id, req.body);
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update project:', error);
        res.status(500).json({ error: error.message || 'خطا در ویرایش پروژه' });
      }
    }
  );

  app.delete(
    '/api/admin/projects/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const paramId = req.params.id;
        const numId = Number(paramId);
        const target = !isNaN(numId) && numId > 0 ? numId : paramId;
        const result = await deleteProjectRecord(target);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete project:', error);
        res.status(500).json({ error: error.message || 'خطا در حذف پروژه' });
      }
    }
  );

  /**
   * @openapi
   * /api/public/projects:
   *   get:
   *     summary: لیست پروژه‌های اجرایی (عمومی)
   *     description: دریافت لیست پروژه‌ها برای نمایش در گالری پروژه‌های سایت به مشتریان.
   *     tags: [Public - عمومی]
   *     responses:
   *       200:
   *         description: لیست پروژه‌ها
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: { $ref: '#/components/schemas/Project' }
   */
  // دریافت لیست پروژه‌ها (عمومی)
  app.get(['/api/projects', '/api/public/projects'], async (_req, res) => {
    try {
      const list = await getAllProjects();
      res.json(list);
    } catch (error: any) {
      console.error('Failed to fetch public projects:', error);
      res.status(500).json({ error: error.message || 'خطا در دریافت پروژه‌ها' });
    }
  });

  /**
   * @openapi
   * /api/projects/{idOrSlug}/like:
   *   post:
   *     summary: لایک کردن پروژه
   *     description: افزایش یا کاهش تعداد لایک‌های یک پروژه توسط کاربران عمومی سایت.
   *     tags: [Public - عمومی]
   *     parameters:
   *       - in: path
   *         name: idOrSlug
   *         required: true
   *         schema:
   *           type: string
   *         description: شناسه یا اسلاگ پروژه
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               increment:
   *                 type: boolean
   *                 description: افزایش لایک (true) یا کاهش (false)
   *     responses:
   *       200:
   *         description: لایک با موفقیت ثبت شد
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: 'boolean' }
   *                 likesCount: { type: 'integer' }
   */
  // ثبت لایک یا برداشتن لایک پروژه
  app.post(
    ['/api/projects/:idOrSlug/like', '/api/public/projects/:idOrSlug/like'],
    async (req, res) => {
      try {
        const { idOrSlug } = req.params;
        const { increment } = req.body || {};
        const updated = await toggleProjectLike(idOrSlug, increment !== false);
        res.json({
          success: true,
          likesCount: updated.likesCount,
          project: updated,
        });
      } catch (error: any) {
        console.error('Failed to toggle project like:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ثبت لایک پروژه' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/projects/{idOrSlug}/likes:
   *   patch:
   *     summary: مدیریت مستقیم لایک‌ها
   *     description: تنظیم دستی تعداد لایک‌های یک پروژه توسط ادمین در پنل مدیریت.
   *     tags: [Admin Projects - پروژه‌ها]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idOrSlug
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               likesCount:
   *                 type: integer
   *     responses:
   *       200:
   *         description: تعداد لایک‌ها بروزرسانی شد
   */
  // تغییر مستقیم تعداد لایک‌ها از پنل ادمین
  app.patch(
    [
      '/api/projects/:idOrSlug/likes',
      '/api/admin/projects/:idOrSlug/likes',
    ],
    async (req, res) => {
      try {
        const { idOrSlug } = req.params;
        const { likesCount } = req.body || {};
        const updated = await updateProjectLikesCount(
          idOrSlug,
          Number(likesCount) || 0
        );
        res.json({
          success: true,
          likesCount: updated.likesCount,
          project: updated,
        });
      } catch (error: any) {
        console.error('Failed to update project likes:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در به‌روزرسانی لایک پروژه' });
      }
    }
  );

  // مدیریت استوری‌های بالای صفحه
  /**
   * @openapi
   * /api/admin/stories:
   *   get:
   *     summary: لیست استوری‌های سایت
   *     description: دریافت لیست استوری‌های دایره‌ای بالای صفحه اصلی.
   *     tags: [Admin Stories - مدیریت استوری‌ها]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست استوری‌ها
   *   post:
   *     summary: ایجاد استوری جدید
   *     tags: [Admin Stories - مدیریت استوری‌ها]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: استوری با موفقیت ایجاد شد
   */
  app.get(
    '/api/admin/stories',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const list = await getAllStories();
        res.json(list);
      } catch (error: any) {
        console.error('Failed to fetch stories:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت استوری‌ها' });
      }
    }
  );

  app.post(
    '/api/admin/stories',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const created = await createStoryRecord(req.body);
        res.status(201).json(created);
      } catch (error: any) {
        console.error('Failed to create story:', error);
        res.status(500).json({ error: error.message || 'خطا در ثبت استوری' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/stories/{id}:
   *   put:
   *     summary: ویرایش استوری
   *     tags: [Admin Stories - مدیریت استوری‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Story'
   *     responses:
   *       200:
   *         description: استوری ویرایش شد
   *   delete:
   *     summary: حذف استوری
   *     tags: [Admin Stories - مدیریت استوری‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: استوری حذف شد
   */
  app.put(
    '/api/admin/stories/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateStoryRecord(id, req.body);
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update story:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ویرایش استوری' });
      }
    }
  );

  app.delete(
    '/api/admin/stories/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const paramId = req.params.id;
        const numId = Number(paramId);
        const target = !isNaN(numId) && numId > 0 ? numId : paramId;
        const result = await deleteStoryRecord(target);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete story:', error);
        res.status(500).json({ error: error.message || 'خطا در حذف استوری' });
      }
    }
  );

  // مدیریت مقالات مجله
  /**
   * @openapi
   * /api/admin/articles:
   *   get:
   *     summary: لیست مقالات مجله
   *     description: دریافت لیست مقالات و بلاگ‌های ثبت شده در بخش مجله سایت.
   *     tags: [Admin Articles - مدیریت مقالات]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست مقالات
   *   post:
   *     summary: ایجاد مقاله جدید
   *     tags: [Admin Articles - مدیریت مقالات]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: مقاله با موفقیت ثبت شد
   */
  app.get(
    '/api/admin/articles',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const list = await getAllArticles();
        res.json(list);
      } catch (error: any) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: error.message || 'خطا در دریافت مقالات' });
      }
    }
  );

  app.post(
    '/api/admin/articles',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const created = await createArticleRecord(req.body);
        res.status(201).json(created);
      } catch (error: any) {
        console.error('Failed to create article:', error);
        res.status(500).json({ error: error.message || 'خطا در ثبت مقاله' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/articles/{id}:
   *   put:
   *     summary: ویرایش مقاله
   *     tags: [Admin Articles - مدیریت مقالات]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Article'
   *     responses:
   *       200:
   *         description: مقاله ویرایش شد
   *   delete:
   *     summary: حذف مقاله
   *     tags: [Admin Articles - مدیریت مقالات]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: مقاله حذف شد
   */
  app.put(
    '/api/admin/articles/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateArticleRecord(id, req.body);
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update article:', error);
        res.status(500).json({ error: error.message || 'خطا در ویرایش مقاله' });
      }
    }
  );

  app.delete(
    '/api/admin/articles/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const result = await deleteArticleRecord(id);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete article:', error);
        res.status(500).json({ error: error.message || 'خطا در حذف مقاله' });
      }
    }
  );

  // مدیریت پیام‌های تماس با ما
  /**
   * @openapi
   * /api/admin/messages:
   *   get:
   *     summary: لیست پیام‌های دریافتی
   *     description: دریافت تمامی پیام‌های ارسال شده توسط کاربران از طریق فرم تماس با ما.
   *     tags: [Admin Messages - مدیریت پیام‌ها]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست پیام‌ها دریافت شد
   */
  app.get(
    '/api/admin/messages',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const list = await getAllContactMessages();
        res.json(list);
      } catch (error: any) {
        console.error('Failed to fetch messages:', error);
        res.status(500).json({ error: error.message || 'خطا در دریافت پیام‌ها' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/messages/{id}:
   *   put:
   *     summary: ویرایش کامل پیام
   *     tags: [Admin Messages - مدیریت پیام‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: پیام ویرایش شد
   *   patch:
   *     summary: تغییر وضعیت پیام (خوانده شده/نشده)
   *     tags: [Admin Messages - مدیریت پیام‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: وضعیت پیام تغییر کرد
   *   delete:
   *     summary: حذف پیام
   *     tags: [Admin Messages - مدیریت پیام‌ها]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: پیام حذف شد
   */
  app.put(
    '/api/admin/messages/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateContactMessageRecord(id, req.body);
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update message:', error);
        res.status(500).json({ error: error.message || 'خطا در ویرایش پیام' });
      }
    }
  );

  app.patch(
    '/api/admin/messages/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateContactMessageStatus(
          id,
          String(req.body?.status || 'read')
        );
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update message status:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در تغییر وضعیت پیام' });
      }
    }
  );

  app.delete(
    '/api/admin/messages/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const result = await deleteContactMessageRecord(id);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete message:', error);
        res.status(500).json({ error: error.message || 'خطا در حذف پیام' });
      }
    }
  );

  // مدیریت سفارشات
  /**
   * @openapi
   * /api/admin/orders:
   *   get:
   *     summary: لیست سفارشات مشتریان
   *     description: مشاهده تمامی سفارشات ثبت شده در سایت به همراه جزییات محصولات و اطلاعات خریدار.
   *     tags: [Admin Orders - مدیریت سفارشات]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: لیست سفارشات دریافت شد
   */
  app.get('/api/admin/orders', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const list = await getAllOrders();
      res.json(list);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ error: error.message || 'خطا در دریافت سفارشات' });
    }
  });

  /**
   * @openapi
   * /api/admin/orders/{id}:
   *   put:
   *     summary: ویرایش کامل سفارش
   *     tags: [Admin Orders - مدیریت سفارشات]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Order'
   *     responses:
   *       200:
   *         description: سفارش ویرایش شد
   *   patch:
   *     summary: تغییر وضعیت سفارش (تکمیل شده/در حال پردازش)
   *     tags: [Admin Orders - مدیریت سفارشات]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: وضعیت سفارش تغییر کرد
   *   delete:
   *     summary: حذف سفارش
   *     tags: [Admin Orders - مدیریت سفارشات]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: سفارش حذف شد
   */
  app.put(
    '/api/admin/orders/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateOrderRecord(id, req.body);
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update order:', error);
        res.status(500).json({ error: error.message || 'خطا در ویرایش سفارش' });
      }
    }
  );

  app.patch(
    '/api/admin/orders/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const updated = await updateOrderStatus(
          id,
          String(req.body?.status || 'completed')
        );
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to update order:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در تغییر وضعیت سفارش' });
      }
    }
  );

  app.delete(
    '/api/admin/orders/:id',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const id = Number(req.params.id);
        const result = await deleteOrderRecord(id);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete order:', error);
        res.status(500).json({ error: error.message || 'خطا در حذف سفارش' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/settings/footer:
   *   get:
   *     summary: دریافت تنظیمات فوتر
   *     description: دریافت لینک‌ها، متون و اطلاعات تماس موجود در بخش فوتر سایت.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *   put:
   *     summary: بروزرسانی تنظیمات فوتر
   *     description: ویرایش اطلاعات تماس، شبکه‌های اجتماعی و کپی‌رایت فوتر.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   */
  app.get(
    '/api/admin/settings/footer',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const settings = await getFooterSettings();
        res.json(settings);
      } catch (error: any) {
        console.error('Failed to fetch footer settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت تنظیمات فوتر' });
      }
    }
  );

  app.put(
    '/api/admin/settings/footer',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const updated = await saveFooterSettings(req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to save footer settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ذخیره تنظیمات فوتر' });
      }
    }
  );

  // مدیریت تنظیمات صفحه تماس با ما
  /**
   * @openapi
   * /api/admin/settings/contact-us:
   *   get:
   *     summary: تنظیمات صفحه تماس با ما
   *     description: دریافت آدرس شعبات، لوکیشن‌ها و شماره تماس‌های نمایش داده شده در صفحه تماس با ما.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات تماس با ما دریافت شد
   *   put:
   *     summary: بروزرسانی تنظیمات تماس با ما
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات بروزرسانی شد
   */
  app.get(
    '/api/admin/settings/contact-us',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const settings = await getContactUsSettings();
        res.json(settings);
      } catch (error: any) {
        console.error('Failed to fetch contact-us settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت تنظیمات تماس با ما' });
      }
    }
  );

  app.put(
    '/api/admin/settings/contact-us',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const updated = await saveContactUsSettings(req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to save contact-us settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ذخیره تنظیمات تماس با ما' });
      }
    }
  );

  app.get('/api/public/settings/about-us', async (_req, res) => {
    try {
      const settings = await getAboutUsSettings();
      res.json(settings);
    } catch (error: any) {
      console.error('Failed to fetch public about-us settings:', error);
      res
        .status(500)
        .json({ error: error.message || 'خطا در دریافت تنظیمات درباره ما' });
    }
  });

  /**
   * @openapi
   * /api/admin/settings/about-us:
   *   get:
   *     summary: تنظیمات صفحه درباره ما
   *     description: دریافت متون معرفی گالری، تصاویر نمایشگاه و کاتالوگ‌های قابل دانلود.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات درباره ما دریافت شد
   *   put:
   *     summary: بروزرسانی تنظیمات درباره ما
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات بروزرسانی شد
   */
  app.get(
    '/api/admin/settings/about-us',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const settings = await getAboutUsSettings();
        res.json(settings);
      } catch (error: any) {
        console.error('Failed to fetch about-us settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت تنظیمات درباره ما' });
      }
    }
  );

  app.put(
    '/api/admin/settings/about-us',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const updated = await saveAboutUsSettings(req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to save about-us settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ذخیره تنظیمات درباره ما' });
      }
    }
  );

  // مدیریت تنظیمات اسلایدر بنر اصلی سایت
  app.get('/api/public/settings/hero-slider', async (_req, res) => {
    try {
      const settings = await getHeroSliderSettings();
      res.json(settings);
    } catch (error: any) {
      console.error('Failed to fetch public hero-slider settings:', error);
      res
        .status(500)
        .json({ error: error.message || 'خطا در دریافت تنظیمات اسلایدر سایت' });
    }
  });

  /**
   * @openapi
   * /api/admin/settings/hero-slider:
   *   get:
   *     summary: تنظیمات اسلایدر بنر
   *     description: دریافت لیست اسلایدها، متون و تصاویر متحرک بنر اصلی صفحه اول.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات اسلایدر دریافت شد
   *   put:
   *     summary: بروزرسانی اسلایدر
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: اسلایدر بروزرسانی شد
   */
  app.get(
    '/api/admin/settings/hero-slider',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const settings = await getHeroSliderSettings();
        res.json(settings);
      } catch (error: any) {
        console.error('Failed to fetch hero-slider settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت تنظیمات اسلایدر سایت' });
      }
    }
  );

  app.put(
    '/api/admin/settings/hero-slider',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const updated = await saveHeroSliderSettings(req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to save hero-slider settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ذخیره تنظیمات اسلایدر سایت' });
      }
    }
  );

  // ۱. مدیریت تنظیمات اصلی وب‌سایت
  /**
   * @openapi
   * /api/admin/settings/main:
   *   get:
   *     summary: تنظیمات اصلی و هدر
   *     description: دریافت عنوان سایت، لوگو، منوهای هدر و تنظیمات شبکه‌های اجتماعی.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات اصلی دریافت شد
   *   put:
   *     summary: بروزرسانی تنظیمات اصلی سایت
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات بروزرسانی شد
   */
  app.get(
    '/api/admin/settings/main',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const settings = await getMainSettings();
        res.json(settings);
      } catch (error: any) {
        console.error('Failed to fetch main settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت تنظیمات اصلی وب‌سایت' });
      }
    }
  );

  app.put(
    '/api/admin/settings/main',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const updated = await saveMainSettings(req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to save main settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ذخیره تنظیمات اصلی وب‌سایت' });
      }
    }
  );

  /**
   * @openapi
   * /api/admin/settings/sms:
   *   get:
   *     summary: تنظیمات پنل پیامک
   *     description: دریافت وب‌سرویس پیامک و الگوهای ارسال.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *   put:
   *     summary: بروزرسانی تنظیمات پیامک
   *     description: تنظیم الگوهای اطلاع‌رسانی پیامکی به مدیر و مشتری.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   */
  app.get(
    '/api/admin/settings/sms',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const settings = await getSmsSettings();
        res.json(settings);
      } catch (error: any) {
        console.error('Failed to fetch sms settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت تنظیمات پنل پیامک' });
      }
    }
  );

  app.put(
    '/api/admin/settings/sms',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const updated = await saveSmsSettings(req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to save sms settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ذخیره تنظیمات پنل پیامک' });
      }
    }
  );

  // ۳. مدیریت تنظیمات سوالات متداول صفحات
  /**
   * @openapi
   * /api/admin/settings/faq:
   *   get:
   *     summary: تنظیمات سوالات متداول
   *     description: دریافت لیست پرسش و پاسخ‌های متداول برای نمایش در صفحات راهنما و قوانین.
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات سوالات متداول دریافت شد
   *   put:
   *     summary: بروزرسانی سوالات متداول
   *     tags: [Admin Settings - مدیریت تنظیمات سایت]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: تنظیمات بروزرسانی شد
   */
  app.get(
    '/api/admin/settings/faq',
    requireAuth,
    async (_req: AuthRequest, res) => {
      try {
        const settings = await getFaqSettings();
        res.json(settings);
      } catch (error: any) {
        console.error('Failed to fetch faq settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در دریافت تنظیمات سوالات متداول صفحات' });
      }
    }
  );

  app.put(
    '/api/admin/settings/faq',
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const updated = await saveFaqSettings(req.body || {});
        res.json(updated);
      } catch (error: any) {
        console.error('Failed to save faq settings:', error);
        res
          .status(500)
          .json({ error: error.message || 'خطا در ذخیره تنظیمات سوالات متداول صفحات' });
      }
    }
  );

  // Vite middleware for development
  if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace?.(e);
        next(e);
      }
    });
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

export const appReady = startServer();
