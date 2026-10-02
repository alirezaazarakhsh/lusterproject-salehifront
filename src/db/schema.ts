import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// ۱. جدول کاربران و مدیران سایت (با شماره موبایل، رمز عبور، تصویر پروفایل و دسترسی تیکی بخش‌ها)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  phone: text('phone').default('09120759419').notNull(),
  password: text('password').default('sasha9419').notNull(),
  email: text('email').notNull(),
  displayName: text('display_name').default('مدیر سیستم').notNull(),
  role: text('role').default('admin').notNull(),
  avatarUrl: text('avatar_url').default('').notNull(),
  permissionsJson: text('permissions_json')
    .default(
      '["dashboard","admins","products","categories","projects","stories","articles","messages","orders"]'
    )
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۲. جدول دسته‌بندی‌های محصولات
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  filterKey: text('filter_key').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۳. جدول محصولات فروشگاه (کلکسیون صالحی، پرفروش‌ها و دسته‌بندی‌ها)
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  productKey: text('product_key').notNull().unique(),
  name: text('name').notNull(),
  subtitle: text('subtitle').notNull(),
  priceFormatted: text('price_formatted').notNull(),
  priceNumeric: integer('price_numeric').notNull(),
  productCode: text('product_code').notNull(),
  image: text('image').notNull(),
  modelType: text('model_type').notNull(),
  defaultFinish: text('default_finish').notNull(),
  categorySlug: text('category_slug').notNull(),
  outOfStock: boolean('out_of_stock').default(false).notNull(),
  hasSnappPay: boolean('has_snapp_pay').default(true).notNull(),
  isFeaturedSalehi: boolean('is_featured_salehi').default(false).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  dimensions: text('dimensions').notNull(),
  branchesCount: text('branches_count').notNull(),
  bodyMaterial: text('body_material').notNull(),
  warranty: text('warranty').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۴. جدول پروژه‌های اجرایی (ارگان‌های دولتی، تجاری، مساجد، رستوران‌ها، مسکونی)
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  categoryTab: text('category_tab').notNull(),
  sampleCode: text('sample_code').notNull(),
  district: text('district').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  usedChandeliersText: text('used_chandeliers_text').notNull(),
  mainImage: text('main_image').notNull(),
  galleryJson: text('gallery_json').notNull(),
  locationBadge: text('location_badge').notNull(),
  dateBadge: text('date_badge').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۵. جدول استوری‌های بالای صفحه (پشتیبانی از ۳ تایپ: محصول‌دار، ساده تصویری، و ویدیویی)
export const stories = pgTable('stories', {
  id: serial('id').primaryKey(),
  storyKey: text('story_key').notNull().unique(),
  storyType: text('story_type').default('single-product').notNull(),
  title: text('title').notNull(),
  fullTitle: text('full_title').notNull(),
  subtitle: text('subtitle').notNull(),
  category: text('category').notNull(),
  categoryLabel: text('category_label').notNull(),
  durationSeconds: integer('duration_seconds').default(10).notNull(),
  thumbnailImage: text('thumbnail_image').default('').notNull(),
  image: text('image').notNull(),
  mediaUrl: text('media_url').default('').notNull(),
  videoUrl: text('video_url').default('').notNull(),
  linkedProductKey: text('linked_product_key').default('prod-1').notNull(),
  slidesJson: text('slides_json').default('[]').notNull(),
  price: text('price').default('۱۶,۴۰۰,۰۰۰ تومان').notNull(),
  modelType: text('model_type').notNull(),
  finish: text('finish').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۶. جدول مقالات مجله لوستر
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  articleKey: text('article_key').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  readTime: text('read_time').notNull(),
  publishDate: text('publish_date').notNull(),
  author: text('author').notNull(),
  image: text('image').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۷. جدول پیام‌های فرم تماس با ما و درخواست مشاوره
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۸. جدول سفارشات ثبت‌شده
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  itemsJson: text('items_json').notNull(),
  totalPriceNumeric: integer('total_price_numeric').notNull(),
  totalPriceFormatted: text('total_price_formatted').notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ۹. جدول تنظیمات وب‌سایت (شامل تنظیمات فوتر، تنظیمات اصلی، پیامک و صفحات)
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValueJson: text('setting_value_json').default('{}').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
