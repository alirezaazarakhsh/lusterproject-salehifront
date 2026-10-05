import { Pool } from 'pg';

/**
 * ایجاد خودکار جداول PostgreSQL در صورت عدم وجود
 * این تابع به هنگام اجرای npm run dev یا اجرای داکر به صورت خودکار فراخوانی می‌شود.
 */
export async function autoInitPostgresSchema(pool: Pool): Promise<void> {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        -- ۱. جدول کاربران و مدیران
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          uid TEXT NOT NULL UNIQUE,
          phone TEXT NOT NULL DEFAULT '09120759419',
          password TEXT NOT NULL DEFAULT 'sasha9419',
          email TEXT NOT NULL,
          display_name TEXT NOT NULL DEFAULT 'مدیر سیستم',
          role TEXT NOT NULL DEFAULT 'admin',
          avatar_url TEXT NOT NULL DEFAULT '',
          permissions_json TEXT NOT NULL DEFAULT '["dashboard","admins","products","categories","projects","stories","articles","messages","orders","settings"]',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۲. جدول دسته‌بندی‌ها
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          filter_key TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۳. جدول محصولات
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          product_key TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          subtitle TEXT NOT NULL,
          price_formatted TEXT NOT NULL,
          price_numeric INTEGER NOT NULL,
          product_code TEXT NOT NULL,
          image TEXT NOT NULL,
          model_type TEXT NOT NULL,
          default_finish TEXT NOT NULL,
          category_slug TEXT NOT NULL,
          out_of_stock BOOLEAN NOT NULL DEFAULT false,
          has_snapp_pay BOOLEAN NOT NULL DEFAULT true,
          is_featured_salehi BOOLEAN NOT NULL DEFAULT false,
          is_best_seller BOOLEAN NOT NULL DEFAULT false,
          dimensions TEXT NOT NULL,
          branches_count TEXT NOT NULL,
          body_material TEXT NOT NULL,
          warranty TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۴. جدول پروژه‌های اجرایی
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          category_tab TEXT NOT NULL,
          sample_code TEXT NOT NULL,
          district TEXT NOT NULL,
          title TEXT NOT NULL,
          subtitle TEXT NOT NULL,
          description TEXT NOT NULL,
          used_chandeliers_text TEXT NOT NULL,
          main_image TEXT NOT NULL,
          gallery_json TEXT NOT NULL,
          location_badge TEXT NOT NULL,
          date_badge TEXT NOT NULL,
          owner_name TEXT NOT NULL DEFAULT '',
          likes_count INTEGER NOT NULL DEFAULT 0,
          styles_json TEXT NOT NULL DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۵. جدول استوری‌ها
        CREATE TABLE IF NOT EXISTS stories (
          id SERIAL PRIMARY KEY,
          story_key TEXT NOT NULL UNIQUE,
          story_type TEXT NOT NULL DEFAULT 'single-product',
          title TEXT NOT NULL,
          full_title TEXT NOT NULL,
          subtitle TEXT NOT NULL,
          category TEXT NOT NULL,
          category_label TEXT NOT NULL,
          duration_seconds INTEGER NOT NULL DEFAULT 10,
          thumbnail_image TEXT NOT NULL DEFAULT '',
          image TEXT NOT NULL,
          media_url TEXT NOT NULL DEFAULT '',
          video_url TEXT NOT NULL DEFAULT '',
          linked_product_key TEXT NOT NULL DEFAULT 'prod-1',
          slides_json TEXT NOT NULL DEFAULT '[]',
          price TEXT NOT NULL DEFAULT '۱۶,۴۰۰,۰۰۰ تومان',
          model_type TEXT NOT NULL,
          finish TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۶. جدول مقالات
        CREATE TABLE IF NOT EXISTS articles (
          id SERIAL PRIMARY KEY,
          article_key TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          read_time TEXT NOT NULL,
          publish_date TEXT NOT NULL,
          author TEXT NOT NULL,
          image TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۷. جدول پیام‌های تماس با ما
        CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL DEFAULT '',
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۸. جدول سفارشات
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          customer_name TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          items_json TEXT NOT NULL,
          total_price_numeric INTEGER NOT NULL,
          total_price_formatted TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ۹. جدول تنظیمات وب‌سایت
        CREATE TABLE IF NOT EXISTS site_settings (
          id SERIAL PRIMARY KEY,
          setting_key TEXT NOT NULL UNIQUE,
          setting_value_json TEXT NOT NULL DEFAULT '{}',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = current_schema()
              AND table_name = 'site_settings'
              AND column_name = 'setting_value'
          ) AND NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = current_schema()
              AND table_name = 'site_settings'
              AND column_name = 'setting_value_json'
          ) THEN
            ALTER TABLE site_settings
              RENAME COLUMN setting_value TO setting_value_json;
          ELSIF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = current_schema()
              AND table_name = 'site_settings'
              AND column_name = 'setting_value_json'
          ) THEN
            ALTER TABLE site_settings
              ADD COLUMN setting_value_json TEXT NOT NULL DEFAULT '{}';
          END IF;
        END $$;
      `);
      console.log('✅ PostgreSQL database schema verified & ready.');
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('PostgreSQL auto-init notice (running without Postgres or remote DB):', err.message || err);
  }
}
