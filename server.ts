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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // مقداردهی و ایجاد خودکار جداول PostgreSQL و سیدینگ در لوکال هاست یا داکر
  autoInitPostgresSchema(pool)
    .then(() => ensureSeeded())
    .catch((err) => {
      console.warn('Postgres auto init notice:', err?.message || err);
    });

  app.use(express.json({ limit: '50mb' }));

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
  app.post('/api/admin/login', async (req, res) => {
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

  app.get('/api/admin/me', requireAuth, async (req: AuthRequest, res) => {
    res.json({ admin: req.user, user: req.user });
  });

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
        const id = Number(req.params.id);
        const result = await deleteStoryRecord(id);
        res.json(result);
      } catch (error: any) {
        console.error('Failed to delete story:', error);
        res.status(500).json({ error: error.message || 'خطا در حذف استوری' });
      }
    }
  );

  // مدیریت مقالات مجله
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
  app.get('/api/admin/orders', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const list = await getAllOrders();
      res.json(list);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ error: error.message || 'خطا در دریافت سفارشات' });
    }
  });

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

  // مدیریت تنظیمات فوتر سایت
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

  // ۲. مدیریت تنظیمات پنل پیامک
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
