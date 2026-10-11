# گالری لوستر اکبر صالحی | Salehi Luxury Chandelier Platform

<div align="center">

![Salehi Chandelier Platform](public/favicon.ico)

**پلتفرم جامع و فوق‌پیشرفته فروشگاهی و نمایشگاهی لوستر و صنایع روشنایی لوکس صالحی**
*توسعه‌یافته با معماری مدرن فول‌استک: React 19، Express.js، PostgreSQL، BIND9 DNS، Nginx و Docker*

[![Node.js Version](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?logo=nginx&logoColor=white)](https://nginx.org/)
[![License](https://img.shields.io/badge/License-Proprietary-gold.svg)]()

[اسکریپت نصب سریع](#-اسکریپت-نصب-سریع-و-خودکار-quick-install) •
[دستورات مدیریتی CLI](#-دستورات-مدیریتی-و-کلیدهای-میانبر-salehi-cli) •
[استقرار با داکر](#-استقرار-با-docker-compose) •
[توسعه محلی](#-راهاندازی-در-محیط-توسعه-local-development) •
[مستندات و تنظیمات](#-تنظیمات-متغیرهای-محیطی-env)

</div>

---

## 💎 معرفی پروژه

پلتفرم **گالری لوستر اکبر صالحی** یک سامانه اختصاصی، پرسرعت و مدرن برای مدیریت و معرفی محصولات روشنایی لوکس، لوسترهای کریستالی و برنزی، آباژورها، پروژه‌های دکوراسیون و اکسسوری‌های سلطنتی است. این پروژه به همراه پنل مدیریت ادمین پیشرفته، سامانه همگام‌سازی لحظه‌ای داده‌ها، سرور اختصاصی DNS داخلی (BIND9)، وب‌سوکت دوطرفه و گواهینامه‌های خودکار SSL ارائه شده است.

### 🌟 ویژگی‌های کلیدی
- **طراحی لوکس و اختصاصی:** رابط کاربری مدرن با تم طلایی-تیره سلطنتی، انیمیشن‌های نرم Framer Motion، فونت استاندارد ایران‌سنس ایکس (`IRANSansX`) و چیدمان کاملاً راست‌چین (RTL).
- **نمایشگر سه‌بعدی تعاملی (Three.js):** امکان چرخش و بررسی مدل‌های سه‌بعدی لوسترها به صورت بلادرنگ در مرورگر.
- **پنل ادمین جامع و یکپارچه (`/admin`):**
  - مدیریت محصولات، دسته‌بندی‌ها و گالری تصاویر
  - مدیریت سفارش‌ها، فاکتورها و وضعیت ارسال
  - مدیریت کاربران، مشتریان و سطوح دسترسی
  - مدیریت مقالات وبلاگ، داستان برند و پروژه‌های اجراشده
  - تنظیمات کامل متون سایت، هدر، اسلایدر اصلی، پاورقی، درباره ما و سوالات متداول (FAQ)
  - مدیریت فایل‌های کاتالوگ PDF و لینک‌های دانلود مستقیم
  - سامانه ارسال و پیکربندی پیامک‌ها (SMS Provider Settings)
  - گزارش‌های تحلیلی داشبورد با ارقام لحظه‌ای
- **پایگاه داده رابطه‌ای پایدار (PostgreSQL 16 + Drizzle ORM):** ساختار بهینه‌سازی شده با ایندکس‌گذاری‌های دقیق.
- **همگام‌سازی ابری دوطرفه (Dual Firestore Sync):** همگام‌سازی خودکار و لحظه‌ای پایگاه داده PostgreSQL با Cloud Firestore در هنگام استارت‌آپ و پس از هر تغییر در پنل ادمین.
- **سرور DNS اختصاصی Authoritative (BIND9):** مدیریت مستقیم رکوردهای دامنه‌های ملی (`.ir`) با نیم‌سرورهای اختصاصی (`ns1.lostersalehi.ir` و `ns2.lostersalehi.ir`) بدون وابستگی به کلودفلر یا نیم‌سرورهای اشتراکی.
- **وب‌سرور Nginx امن و پرسرعت:** فشرده‌سازی خودکار Gzip، پراکسی معکوس WebSocket و SSE، کش فایل‌های استاتیک و محافظت در برابر حملات اسکن پورت و دیداس.
- **صدور و تمدید خودکار SSL (Certbot Let's Encrypt):** تولید گواهینامه معتبر HTTPS و اسکریپت تمدید دوره‌ای هر ۱۲ ساعت یک‌بار.
- **مستندات تعاملی API با Swagger:** دسترسی به کلیه مستندات اندپوئینت‌های سرور در آدرس `/api-docs`.
- **اپلیکیشن وب پیش‌رونده (PWA):** پشتیبانی از کش آفلاین، Service Worker و قابلیت نصب روی موبایل و دسکتاپ.

---

## 🚀 اسکریپت نصب سریع و خودکار (Quick Install)

روی سرور ابری یا سرور اختصاصی خام (Ubuntu 22.04 / 24.04 / 26.04 یا Debian)، اسکریپت نصب تمام وابستگی‌ها، داکر، ان‌جینکس، دیتابیس پستگرس و سرور DNS را به صورت صفر تا صد و خودکار نصب می‌کند:

### روش اول: اجرای تک‌خطی (توصیه‌شده)
```bash
curl -sSL https://raw.githubusercontent.com/alirezaazarakhsh/lusterproject-salehifront/main/install.sh | sudo bash
```

### روش دوم: کلون مخزن و اجرای دستی
```bash
# ۱. دریافت آخرین نسخه پروژه از گیت‌هاب
git clone https://github.com/alirezaazarakhsh/lusterproject-salehifront.git /var/www/salehi-chandelier

# ۲. ورود به مسیر پروژه
cd /var/www/salehi-chandelier

# ۳. اعطای دسترسی اجرایی به اسکریپت
chmod +x install.sh

# ۴. اجرای اسکریپت نصب
sudo bash install.sh
```

> **نکته:** پس از نصب موفقیت‌آمیز، دستور میانبر **`salehi`** در خط فرمان سرور فعال می‌شود و در هر زمان با تایپ `salehi` منوی مدیریتی سرور باز خواهد شد.

---

## 🛠 دستورات مدیریتی و کلیدهای میانبر (Salehi CLI)

اسکریپت `install.sh` دارای هر دو حالت **منوی تعاملی (Interactive Menu)** و **دستورات مستقیم ترمینال (Direct CLI)** است:

```
  +-------------------------------------------------------------+
  |                                                             |
  |       Salehi Luxury Chandelier Server Management Panel      |
  |          Docker + Nginx + PostgreSQL + Ubuntu Ready         |
  |                                                             |
  +-------------------------------------------------------------+

  [1]  Fresh / Full Installation (Auto Docker, Nginx, DB, BIND9)
  [2]  Update & Pull Latest Code from GitHub
  [3]  View Live Server Logs
  [4]  Restart Services
  [5]  View Docker Services Status
  [6]  Test BIND9 DNS Resolution (dig @127.0.0.1)
  [7]  Reconfigure Domain & DNS Nameservers
  [8]  Issue / Generate Let's Encrypt SSL & WebSockets (Certbot)
  [9]  Free Port 53 & Start BIND9 Container
  [10] Configure Server Security & Anti-Scan Armor (Fail2ban, UFW, Nginx)
  [0]  Exit
```

### راهنمای دستورات مستقیم ترمینال:

| دستور | توضیح عملکرد |
| :--- | :--- |
| `salehi` | باز کردن منوی تعاملی و مانیتورینگ سیستم |
| `salehi install` | اجرای نصب اولیه کامل (پکیج‌ها، داکر، تنظیمات محیطی، بیلد و راه‌اندازی) |
| `salehi update` | دریافت جدیدترین کامیت‌ها از گیت‌هاب و بیلد مجدد سرویس‌ها بدون قطعی |
| `salehi logs` | مانیتورینگ زنده لاگ‌های اپلیکیشن، دیتابیس و پراکسی (`docker compose logs -f`) |
| `salehi restart` | ریستارت ایمن تمامی کانتینرهای فعال |
| `salehi status` یا `salehi ps` | مشاهده وضعیت سلامت، مصرف منابع و پورت‌های داکر |
| `salehi dns` | تست کارکرد BIND9 با کوئری `dig @127.0.0.1` روی دامنه‌ها و نیم‌سرورها |
| `salehi config` | تغییر دامنه، آی‌پی پابلیک سرور و به‌روزرسانی رکوردهای DNS و ان‌جینکس |
| `salehi ssl [domain]` | دریافت یا تمدید آنی گواهینامه معتبر Let's Encrypt برای دامنه |
| `salehi fix-dns` | آزادسازی تداخل پورت ۵۳ سیستم‌عامل (systemd-resolved) و استارت کانتینر BIND9 |
| `salehi security` | پیکربندی فایروال UFW، نصب Fail2ban و مسدودسازی ابزارهای پویش و حمله |

---

## 🔒 اطلاعات پیش‌فرض ورود به پنل ادمین

پس از راه‌اندازی، می‌توانید از طریق آدرس‌های زیر وارد پنل مدیریت شوید:

- **آدرس وب‌سایت:** `https://your-domain.ir` یا `http://SERVER_IP`
- **آدرس پنل ادمین:** `https://your-domain.ir/admin`
- **شماره موبایل پیش‌فرض ادمین:** `09120759419`
- **رمز عبور پیش‌فرض ادمین:** `sasha9419`
- **مستندات سواگر API:** `https://your-domain.ir/api-docs`
- **بررسی سلامت سرور:** `https://your-domain.ir/health`

---

## 🌐 تنظیمات دامنه و نیم‌سرورهای ایرنیک (IRNIC DNS)

سرور شامل یک کانتینر مجهز به **BIND9 DNS Server** است که روی پورت ۵۳ (UDP و TCP) مستقیماً به کوئری‌های DNS پاسخ می‌دهد. برای اتصال دامنه ملی خود (مثلاً `lostersalehi.ir`):

1. وارد پنل مدیریت دامنه در سامانه **ایرنیک (nic.ir)** شوید.
2. به بخش **تنظیمات سامانه نام دامنه (DNS / Nameservers)** بروید.
3. مقادیر زیر را درج نمایید:
   - **نام کارگزار اول (NS1):** `ns1.lostersalehi.ir` | **آی‌پی:** `<آی‌پی_سرور_شما>`
   - **نام کارگزار دوم (NS2):** `ns2.lostersalehi.ir` | **آی‌پی:** `<آی‌پی_سرور_شما>`
4. ذخیره کنید. پس از اعمال تغییرات، دامنه شما مستقیماً به سرور خودتان متصل خواهد شد.

---

## 📦 استقرار با Docker Compose

اگر می‌خواهید کانتینرها را به صورت دستی مدیریت و اجرا کنید:

```bash
# ۱. ایجاد فایل متغیرهای محیطی بر اساس نمونه
cp .env.example .env

# ۲. ویرایش مقادیر دامنه و آی‌پی در .env
nano .env

# ۳. بیلد و اجرای پس‌زمینه کانتینرها
docker compose up -d --build

# ۴. بررسی وضعیت کانتینرها
docker compose ps

# ۵. مشاهده لاگ‌های در حال اجرا
docker compose logs -f app
```

### معماری کانتینرها (`docker-compose.yml`):
- `salehi_postgres`: پایگاه داده PostgreSQL نسخه ۱۶ به همراه Persistent Volume
- `salehi_app`: هسته اپلیکیشن Node.js فول‌استک (Express + کلاینت بیلدشده Vite) روی پورت ۳۰۰۰
- `salehi_nginx`: سرور پروکسی معکوس روی پورت‌های ۸۰ و ۴۴۳ با فشرده‌سازی و مدیریت کش
- `salehi_certbot`: ربات تمدید خودکار گواهینامه‌های SSL لِتس‌انکریپت
- `salehi_bind9`: سرور DNS معتبر و مستقل روی پورت ۵۳ پروتکل‌های TCP و UDP

---

## 💻 راه‌اندازی در محیط توسعه (Local Development)

برای توسعه‌دهندگان و تست محلی روی رایانه شخصی:

### پیش‌نیازها
- **Node.js**: نسخه `20.x` یا `22.x`
- **npm**: نسخه `10.x` به بالا

### مراحل اجرا:
```bash
# ۱. کلون پروژه
git clone https://github.com/alirezaazarakhsh/lusterproject-salehifront.git
cd lusterproject-salehifront

# ۲. نصب وابستگی‌های پکیج‌ها
npm install

# ۳. تنظیم فایل محیطی
cp .env.example .env

# ۴. اجرای سرور توسعه همراه با Vite و Express
npm run dev

# ۵. بیلد نهایی پروژه
npm run build

# ۶. بررسی تایپ‌ها و عدم وجود خطای تایپ‌اسکریپت
npm run lint
```

پس از اجرای `npm run dev`، پروژه روی آدرس `http://localhost:3000` در دسترس خواهد بود.

---

## ⚙️ تنظیمات متغیرهای محیطی (`.env`)

فایل `.env` تنظیمات ارتباطی پایگاه داده و زیرساخت شبکه را تعیین می‌کند:

```env
# وضعیت محیط اجرا (production یا development)
NODE_ENV=production
PORT=3000

# نام دامنه اختصاصی و آی‌پی پابلیک سرور
DOMAIN=lostersalehi.ir
SERVER_IP=185.190.150.100

# اتصال پایگاه داده PostgreSQL
SQL_HOST=postgres
SQL_PORT=5432
SQL_USER=salehi_user
SQL_PASSWORD=salehi_secure_password_2026
SQL_DB_NAME=salehi_chandelier_db

# در صورت استفاده از کلید جمینای جهت بهینه‌سازی کاتالوگ
GEMINI_API_KEY=""
```

---

## 🛡️ عیب‌یابی و پرسش‌های متداول (Troubleshooting)

### ۱. تداخل پورت ۵۳ (Port 53 conflict) هنگام اجرای BIND9:
در سیستم‌عامل‌های اوبونتو سرویس `systemd-resolved` یا `named` به طور پیش‌فرض پورت ۵۳ را اشغال می‌کند. برای رفع فوری این تداخل:
```bash
salehi fix-dns
```
این دستور استاب لیسنر اوبونتو را خاموش کرده، فایل `/etc/resolv.conf` را به DNSهای عمومی (`8.8.8.8` و `1.1.1.1`) هدایت می‌کند و کانتینر BIND9 را بدون تداخل اجرا می‌نماید.

### ۲. صدور گواهینامه SSL با دامنه جدید:
در صورتی که دامنه جدیدی تعریف کرده‌اید و قصد صدور گواهینامه رایگان Let's Encrypt دارید:
```bash
salehi ssl your-new-domain.ir
```

### ۳. بررسی عملکرد سرور و مشاهده لاگ‌های زنده:
```bash
docker logs -f salehi_app --tail 100
```

### ۴. بازنشانی دسترسی‌های فایروال و ارتقای امنیت:
```bash
salehi security
```
این اسکریپت پورت‌های غیرضروری را بسته و پورت‌های ۲۲ (SSH)، ۸۰ (HTTP)، ۴۴۳ (HTTPS) و ۵۳ (DNS) را تنظیم می‌نماید.

---

<div align="center">

**طراحی و توسعه‌یافته برای شکوه و ماندگاری صنایع لوستر و دکوراسیون صالحی**  
*تمامی حقوق محفوظ است © 2026*

</div>
