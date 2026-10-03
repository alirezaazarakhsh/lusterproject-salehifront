import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
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
} from './src/db/repository.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

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

  app.post('/api/public/contact', async (req, res) => {
    try {
      const { fullName, phone, subject, message } = req.body || {};
      if (!fullName || !phone || !message) {
        return res
          .status(400)
          .json({ error: 'نام، شماره تماس و متن پیام الزامی است.' });
      }
      const created = await createContactMessageRecord({
        fullName: String(fullName),
        phone: String(phone),
        subject: String(subject || 'مشاوره خرید'),
        message: String(message),
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
  // ورود ادمین با شماره موبایل و رمز عبور (پیش‌فرض: 09120759419 / sasha9419)
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
      res
        .status(401)
        .json({ error: error.message || 'شماره موبایل یا رمز عبور اشتباه است.' });
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
  if (process.env.NODE_ENV !== 'production') {
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
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
