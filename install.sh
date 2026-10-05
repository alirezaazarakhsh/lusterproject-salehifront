#!/usr/bin/env bash
# ==============================================================================
# اسکریپت نصب خودکار و یک‌کلیک سامانه گالری لوستر اکبر صالحی (Docker + Nginx + Postgres)
# ==============================================================================

set -e

# رنگ‌های کنسول
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GOLD='\033[38;5;220m'
NC='\033[0m'

clear
echo -e "${GOLD}"
echo "  ╔═══════════════════════════════════════════════════════════════════╗"
echo "  ║                                                                   ║"
echo "  ║      ✨ اسکریپت نصب و راه‌اندازی خودکار گالری لوستر اکبر صالحی ✨   ║"
echo "  ║           Docker + Nginx + PostgreSQL + Cloud Firestore           ║"
echo "  ║                                                                   ║"
echo "  ╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}[۱/۶] در حال بررسی پیش‌نیازهای سیستم...${NC}"

# ۱. بررسی نصب بودن داکر
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}داکر نصب نیست. در حال نصب خودکار Docker بر روی سرور...${NC}"
    if [ -f /etc/debian_version ]; then
        sudo apt-get update -y
        sudo apt-get install -y curl ca-certificates gnupg lsb-release
        curl -fsSL https://get.docker.com | sh
    elif [ -f /etc/redhat-release ]; then
        curl -fsSL https://get.docker.com | sh
        sudo systemctl start docker
        sudo systemctl enable docker
    else
        echo -e "${RED}سیستم‌عامل ناشناخته است. لطفاً ابتدا Docker را دستی نصب نمایید.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ داکر با موفقیت نصب شد.${NC}"
else
    echo -e "${GREEN}✓ داکر از قبل نصب است.${NC}"
fi

# ۲. بررسی نصب بودن Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}پلاگین docker-compose یافت نشد. در حال نصب...${NC}"
    if [ -f /etc/debian_version ]; then
        sudo apt-get update -y && sudo apt-get install -y docker-compose-plugin
    fi
fi

echo ""
echo -e "${CYAN}[۲/۶] تنظیمات دامنه و شبکه...${NC}"

# دریافت دامنه
DEFAULT_DOMAIN="lostersalehi.ir"
read -rp "$(echo -e "${GOLD}» لطفاً نام دامنه خود را وارد کنید [پیش‌فرض: ${DEFAULT_DOMAIN}]: ${NC}")" USER_DOMAIN
DOMAIN="${USER_DOMAIN:-$DEFAULT_DOMAIN}"

# بررسی SSL
read -rp "$(echo -e "${GOLD}» آیا مایل به فعال‌سازی رایگان گواهی امنیتی HTTPS (SSL Let's Encrypt) هستید؟ (y/n) [پیش‌فرض: y]: ${NC}")" ENABLE_SSL
ENABLE_SSL="${ENABLE_SSL:-y}"

SSL_EMAIL="alirezaazarakhsh20@gmail.com"
if [[ "$ENABLE_SSL" =~ ^[Yy]$ ]]; then
    read -rp "$(echo -e "${GOLD}» ایمیل مدیر جهت دریافت تمدید گواهینامه SSL [پیش‌فرض: ${SSL_EMAIL}]: ${NC}")" USER_EMAIL
    SSL_EMAIL="${USER_EMAIL:-$SSL_EMAIL}"
fi

echo ""
echo -e "${CYAN}[۳/۶] ساخت فایل متغیرهای محیطی (.env)...${NC}"

cat <<EOF > .env
NODE_ENV=production
PORT=3000
DOMAIN=${DOMAIN}
SQL_HOST=postgres
SQL_PORT=5432
SQL_USER=salehi_user
SQL_PASSWORD=salehi_secure_password_2026
SQL_DB_NAME=salehi_chandelier_db
EOF

echo -e "${GREEN}✓ فایل .env با موفقیت پیکربندی شد.${NC}"

echo ""
echo -e "${CYAN}[۴/۶] تنظیم خودکار وب‌سرور Nginx برای دامنه ${DOMAIN}...${NC}"

mkdir -p nginx

if [[ "$ENABLE_SSL" =~ ^[Yy]$ && "$DOMAIN" != "localhost" && "$DOMAIN" != "127.0.0.1" ]]; then
    cat <<EOF > nginx/nginx.conf
worker_processes auto;
events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    client_max_body_size 100M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml font/woff font/woff2;

    upstream salehi_backend {
        server app:3000;
        keepalive 32;
    }

    server {
        listen 80;
        listen [::]:80;
        server_name ${DOMAIN} www.${DOMAIN};

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$host\$request_uri;
        }
    }

    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name ${DOMAIN} www.${DOMAIN};

        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location /health {
            proxy_pass http://salehi_backend/health;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
        }

        location / {
            proxy_pass http://salehi_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_read_timeout 90s;
        }
    }
}
EOF
else
    cat <<EOF > nginx/nginx.conf
worker_processes auto;
events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml font/woff font/woff2;

    upstream salehi_backend {
        server app:3000;
        keepalive 32;
    }

    server {
        listen 80;
        listen [::]:80;
        server_name _;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location /health {
            proxy_pass http://salehi_backend/health;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location / {
            proxy_pass http://salehi_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_read_timeout 90s;
        }
    }
}
EOF
fi

echo -e "${GREEN}✓ کانفیگ Nginx با موفقیت ایجاد شد.${NC}"

echo ""
echo -e "${CYAN}[۵/۶] در حال بیلد و بالا آوردن سرویس‌ها با Docker Compose...${NC}"

# توقف و اجرای مجدد در صورت وجود کانتینرهای قبلی
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d --build

echo ""
echo -e "${CYAN}[۶/۶] در حال بررسی سلامت سرویس‌ها (/health)...${NC}"

# صبر برای آماده شدن کانتینرها
for i in {1..30}; do
    if curl -s -f http://localhost:3000/health > /dev/null 2>&1 || curl -s -f http://127.0.0.1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ تمامی سرویس‌ها و پایگاه‌داده با موفقیت آماده و سالم هستند.${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

PROTO="http"
if [[ "$ENABLE_SSL" =~ ^[Yy]$ && "$DOMAIN" != "localhost" && "$DOMAIN" != "127.0.0.1" ]]; then
    PROTO="https"
fi

echo ""
echo -e "${GOLD}════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   🎉 سامانه گالری لوستر اکبر صالحی با موفقیت نصب و فعال شد! 🎉   ${NC}"
echo -e "${GOLD}════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  🌐 ${CYAN}آدرس وب‌سایت:${NC}          ${PROTO}://${DOMAIN}"
echo -e "  🔐 ${CYAN}ورود به پنل مدیریت:${NC}    ${PROTO}://${DOMAIN}/admin"
echo -e "  🩺 ${CYAN}مانیتورینگ سلامت:${NC}      ${PROTO}://${DOMAIN}/health"
echo -e "  📦 ${CYAN}کاتالوگ عمومی API:${NC}     ${PROTO}://${DOMAIN}/api/public/catalog"
echo ""
echo -e "  👤 ${YELLOW}شماره موبایل ادمین:${NC}    09120759419"
echo -e "  🔑 ${YELLOW}رمز عبور ادمین:${NC}        sasha9419"
echo ""
echo -e "${GOLD}--------------------------------------------------------------------${NC}"
echo -e "  📌 ${BLUE}دستورات کاربردی مدیریت سرویس:${NC}"
echo -e "     • مشاهده وضعیت کانتینرها:  ${GREEN}docker compose ps${NC}"
echo -e "     • مشاهده لاگ‌های زنده:      ${GREEN}docker compose logs -f${NC}"
echo -e "     • ریستارت کردن برنامه:     ${GREEN}docker compose restart${NC}"
echo -e "     • خاموش کردن سرویس‌ها:     ${GREEN}docker compose down${NC}"
echo -e "${GOLD}════════════════════════════════════════════════════════════════════${NC}"
echo ""
