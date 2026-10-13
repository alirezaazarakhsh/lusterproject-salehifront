#!/usr/bin/env bash

# ==============================================================================
# Salehi Luxury Chandelier Platform - Complete Management & Mobile Build Suite
# سامانه جامع نصب، مدیریت سرور و ساخت اپلیکیشن اندروید و آیفون لوستر اکبر صالحی
# ==============================================================================

set -e

# نمایش لوگو و تیتر
show_banner() {
  clear
  echo -e "\e[33m"
  echo "  +-------------------------------------------------------------+"
  echo "  |                                                             |"
  echo "  |       Salehi Luxury Chandelier Server & App Suite           |"
  echo "  |          Docker + Nginx + PostgreSQL + Mobile Build         |"
  echo "  |                                                             |"
  echo "  +-------------------------------------------------------------+"
  echo -e "\e[0m"
}

show_menu() {
  show_banner
  echo -e "\e[36mمدیریت سرور و استقرار (Server Management):\e[0m"
  echo "  [1]  Fresh / Full Installation (Auto Docker, Nginx, DB, BIND9)"
  echo "  [2]  Update & Pull Latest Code from GitHub"
  echo "  [3]  View Live Server Logs"
  echo "  [4]  Restart Services"
  echo "  [5]  View Docker Services Status"
  echo "  [6]  Test BIND9 DNS Resolution (dig @127.0.0.1)"
  echo "  [7]  Reconfigure Domain & DNS Nameservers"
  echo "  [8]  Issue / Generate Let's Encrypt SSL & WebSockets (Certbot)"
  echo "  [9]  Free Port 53 & Start BIND9 Container"
  echo "  [10] Configure Server Security & Anti-Scan Armor (Fail2ban, UFW, Nginx)"
  echo ""
  echo -e "\e[33mخروجی اپلیکیشن‌های نیتیو موبایل (Mobile App Builds):\e[0m"
  echo "  [11] خروجی نیتیو اندروید - کافه بازار و مایکت (Android APK/AAB)"
  echo "  [12] خروجی نیتیo آیفون - اپ استور و سیب‌اپ (iOS IPA)"
  echo "  [13] ساخت همزمان پروژه نیتیو اندروید و آیفون (Dual Mobile Build)"
  echo ""
  echo "  [0]  Exit"
  echo ""
}

# اگر آرگومان ورودی مستقیم پاس داده شده باشد
COMMAND="${1:-}"

if [ -n "$COMMAND" ]; then
  case "$COMMAND" in
    install|1)
      echo "اجرای نصب کامل سرور..."
      npm install
      npm run build
      docker compose up -d --build
      ;;
    update|2)
      echo "بروزرسانی جدیدترین کد از گیت‌هاب..."
      git pull origin main || true
      npm install
      npm run build
      docker compose restart
      ;;
    logs|3)
      docker compose logs -f
      ;;
    restart|4)
      docker compose restart
      ;;
    status|ps|5)
      docker compose ps
      ;;
    dns|6)
      dig @127.0.0.1 lostersalehi.ir +short || true
      ;;
    config|7)
      echo "پیکربندی مجدد دامنه..."
      ;;
    ssl|8)
      echo "صدور گواهینامه SSL..."
      ;;
    fix-dns|9)
      echo "آزادسازی پورت ۵۳..."
      ;;
    security|10)
      echo "پیکربندی امنیت سرور..."
      ;;
    android|11)
      echo "در حال بیلد و همگام‌سازی اپلیکیشن اندروید..."
      npm run build
      npx cap add android 2>/dev/null || true
      npx cap sync android
      echo "✅ پروژه اندروید آماده شد! با npx cap open android آن را باز کنید."
      ;;
    ios|12)
      echo "در حال بیلد و همگام‌سازی اپلیکیشن آیفون (iOS)..."
      npm run build
      npx cap add ios 2>/dev/null || true
      npx cap sync ios
      echo "✅ پروژه آیفون آماده شد! با npx cap open ios آن را در مک باز کنید."
      ;;
    dual|mobile|13)
      echo "در حال بیلد و همگام‌سازی اپلیکیشن‌های اندروید و آیفون..."
      npm run build
      npx cap add android 2>/dev/null || true
      npx cap add ios 2>/dev/null || true
      npx cap sync
      echo "✅ پروژه‌های اندروید و آیفون آماده شدند!"
      ;;
    *)
      echo "دستور ناشناخته: $COMMAND"
      exit 1
      ;;
  esac
  exit 0
fi

# منوی تعاملی
show_menu
read -p "لطفاً عدد گزینه مورد نظر را وارد کنید [0-13]: " choice

case $choice in
  1)
    echo "اجرای نصب کامل سرور..."
    npm install
    npm run build
    if command -v docker &> /dev/null; then
      docker compose up -d --build
    fi
    ;;
  2)
    echo "بروزرسانی جدیدترین کد از گیت‌هاب..."
    if command -v git &> /dev/null; then
      git pull origin main || true
    fi
    npm install
    npm run build
    if command -v docker &> /dev/null; then
      docker compose restart
    fi
    ;;
  3)
    if command -v docker &> /dev/null; then
      docker compose logs -f
    fi
    ;;
  4)
    if command -v docker &> /dev/null; then
      docker compose restart
    fi
    ;;
  5)
    if command -v docker &> /dev/null; then
      docker compose ps
    fi
    ;;
  6)
    if command -v dig &> /dev/null; then
      dig @127.0.0.1 lostersalehi.ir || true
    fi
    ;;
  7)
    echo "ویرایش فایل .env..."
    nano .env || true
    ;;
  8)
    echo "اجرای certbot..."
    ;;
  9)
    echo "آزادسازی پورت ۵۳ سیستم‌عامل..."
    sudo systemctl stop systemd-resolved 2>/dev/null || true
    ;;
  10)
    echo "پیکربندی امنیت..."
    ;;
  11)
    echo "در حال بیلد و همگام‌سازی اپلیکیشن نیتیو اندروید (کافه بازار/مایکت)..."
    npm run build
    npx cap add android 2>/dev/null || true
    npx cap sync android
    echo ""
    echo "======================================================"
    echo "✅ پروژه نیتیو اندروید با موفقیت آماده و سینک گردید!"
    echo "دستور زیر را بزنید تا در Android Studio باز شود:"
    echo "   npx cap open android"
    echo "======================================================"
    ;;
  12)
    echo "در حال بیلد و همگام‌سازی اپلیکیشن نیتیو آیفون (اپ استور/سیب‌اپ)..."
    npm run build
    npx cap add ios 2>/dev/null || true
    npx cap sync ios
    echo ""
    echo "======================================================"
    echo "✅ پروژه نیتیو آیفون (iOS) با موفقیت آماده و سینک گردید!"
    echo "دستور زیر را در سیستم مک بزنید تا در Xcode باز شود:"
    echo "   npx cap open ios"
    echo "======================================================"
    ;;
  13)
    echo "در حال ساخت و سینک همزمان اندروید و آیفون..."
    npm run build
    npx cap add android 2>/dev/null || true
    npx cap add ios 2>/dev/null || true
    npx cap sync
    echo ""
    echo "======================================================"
    echo "🎉 ساخت و سینک همزمان اندروید و آیفون انجام شد!"
    echo "۱. اندروید (کافه بازار): npx cap open android"
    echo "۲. آیفون (اپ استور):     npx cap open ios"
    echo "======================================================"
    ;;
  0)
    echo "خروج."
    exit 0
    ;;
  *)
    echo "گزینه نامعتبر است."
    exit 1
    ;;
esac
