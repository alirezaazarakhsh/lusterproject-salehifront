# گالری لوستر اکبر صالحی

## دریافت و اجرای محلی

پیش‌نیازها: Git، Node.js نسخهٔ 22 و npm.

```bash
git clone https://github.com/alirezaazarakhsh/lusterproject-salehifront.git
cd lusterproject-salehifront
npm install --legacy-peer-deps
npm run dev
```

پس از اجرا، برنامه در نشانی `http://localhost:3000` در دسترس است.

## نصب روی سرور production

برای نصب Docker روی سرور Linux، ابتدا مخزن را دریافت کنید:

```bash
git clone https://github.com/alirezaazarakhsh/lusterproject-salehifront.git && cd lusterproject-salehifront && bash install.sh
```

نصاب به‌صورت تعاملی دامنه و تنظیم HTTPS را می‌پرسد و سرویس‌ها را با Docker Compose اجرا می‌کند. پیش از اجرا، دامنه باید به IP سرور اشاره کند و پورت‌های 80 و 443 در دسترس باشند. نصب Docker ممکن است به دسترسی `sudo` نیاز داشته باشد.

برای مشاهدهٔ وضعیت سرویس‌ها:

```bash
docker compose ps
docker compose logs -f
```
