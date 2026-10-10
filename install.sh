#!/usr/bin/env bash
# ==============================================================================
# اسکریپت نصب و مدیریت یکپارچه گالری لوستر اکبر صالحی (Ubuntu 26 / Docker / Nginx)
# مشابه پنل‌های مدیریت حرفه‌ای با منوی تعاملی و قابلیت آپدیت خودکار
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GOLD='\033[38;5;220m'
NC='\033[0m'

INSTALL_DIR="/var/www/salehi-chandelier"
REPO_URL="https://github.com/alirezaazarakhsh/salehi-chandelier.git" # قابل تنظیم با ریپوی کاربر

print_banner() {
    clear
    echo -e "${GOLD}"
    echo "  ╔═══════════════════════════════════════════════════════════════════╗"
    echo "  ║                                                                   ║"
    echo "  ║      ✨ مدیریت هوشمند سامانه گالری لوستر اکبر صالحی ✨           ║"
    echo "  ║           Docker + Nginx + PostgreSQL + Ubuntu 26 Ready           ║"
    echo "  ║                                                                   ║"
    echo "  ╚═══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}[!] لطفاً این اسکریپت را با دسترسی ریشه (sudo یا root) اجرا کنید.${NC}"
        exit 1
    fi
}

install_dependencies() {
    print_banner
    echo -e "${CYAN}[۱/۵] بررسی و نصب پیش‌نیازهای سیستم (Docker, Docker Compose, Git, Curl)...${NC}"
    
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y curl git ufw wget ca-certificates gnupg lsb-release

    # نصب Docker روی Ubuntu 26 / 24 / 22
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}در حال نصب Docker...${NC}"
        curl -fsSL https://get.docker.com | sh
        systemctl start docker
        systemctl enable docker
    else
        echo -e "${GREEN}✓ Docker از قبل نصب است.${NC}"
    fi

    # نصب Docker Compose Plugin
    if ! docker compose version &> /dev/null; then
        echo -e "${YELLOW}در حال نصب Docker Compose Plugin...${NC}"
        apt-get install -y docker-compose-plugin
    else
        echo -e "${GREEN}✓ Docker Compose از قبل نصب است.${NC}"
    fi
    echo -e "${GREEN}✓ پیش‌نیازها با موفقیت آماده شدند.${NC}"
}

setup_project_files() {
    print_banner
    echo -e "${CYAN}[۲/۵] دریافت یا بروزرسانی فایل‌های پروژه...${NC}"

    if [ ! -d "$INSTALL_DIR" ]; then
        mkdir -p /var/www
        if [ -d "." ] && [ -f "package.json" ]; then
            # اگر اسکریپت از داخل پوشه پروژه اجرا شده باشد
            mkdir -p "$INSTALL_DIR"
            cp -r . "$INSTALL_DIR/"
        else
            git clone "$REPO_URL" "$INSTALL_DIR" || {
                echo -e "${YELLOW}کلون از گیت‌هاب انجام نشد، ایجاد ساختار پوشه محلی...${NC}"
                mkdir -p "$INSTALL_DIR"
            }
        fi
    else
        echo -e "${GREEN}پوشه پروژه موجود است، به‌روزرسانی کدها...${NC}"
        cd "$INSTALL_DIR"
        git pull origin main || git pull origin master || true
    fi

    cd "$INSTALL_DIR"
}

configure_environment() {
    print_banner
    echo -e "${CYAN}[۳/۵] پیکربندی دامنه، پورت‌ها و متغیرهای محیطی...${NC}"

    DEFAULT_DOMAIN="lostersalehi.ir"
    read -rp "$(echo -e "${GOLD}» نام دامنه خود را وارد کنید [پیش‌فرض: ${DEFAULT_DOMAIN}]: ${NC}")" USER_DOMAIN
    DOMAIN="${USER_DOMAIN:-$DEFAULT_DOMAIN}"

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

    echo -e "${GREEN}✓ فایل .env با موفقیت ایجاد شد.${NC}"

    # ساخت فایل کانفیگ Nginx
    mkdir -p nginx
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
        server_name ${DOMAIN} www.${DOMAIN};

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
    echo -e "${GREEN}✓ تنظیمات Nginx انجام شد.${NC}"
}

deploy_services() {
    print_banner
    echo -e "${CYAN}[۴/۵] بیلد و راه‌اندازی کانتینرهای Docker...${NC}"
    cd "$INSTALL_DIR"
    
    docker compose down --remove-orphans 2>/dev/null || true
    docker compose up -d --build

    echo -e "${CYAN}[۵/۵] بررسی سلامت سرویس‌ها...${NC}"
    sleep 5
    echo -e "${GREEN}✓ سامانه با موفقیت نصب و راه‌اندازی شد!${NC}"
}

create_cli_shortcut() {
    # ساخت دستور میانبر `salehi` در سیستم برای مدیریت سریع
    cat << 'EOF' > /usr/local/bin/salehi
#!/usr/bin/env bash
bash /var/www/salehi-chandelier/install.sh
EOF
    chmod +x /usr/local/bin/salehi
}

show_success_info() {
    print_banner
    echo -e "${GOLD}════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}   🎉 سامانه گالری لوستر اکبر صالحی با موفقیت نصب و فعال شد! 🎉   ${NC}"
    echo -e "${GOLD}════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  🌐 ${CYAN}آدرس وب‌سایت:${NC}          http://${DOMAIN}"
    echo -e "  🔐 ${CYAN}ورود به پنل مدیریت:${NC}    http://${DOMAIN}/admin"
    echo -e "  🩺 ${CYAN}مانیتورینگ سلامت:${NC}      http://${DOMAIN}/health"
    echo ""
    echo -e "  👤 ${YELLOW}شماره موبایل ادمین:${NC}    09120759419"
    echo -e "  🔑 ${YELLOW}رمز عبور ادمین:${NC}        sasha9419"
    echo ""
    echo -e "${GOLD}--------------------------------------------------------------------${NC}"
    echo -e "  💡 ${BLUE}نکته:${NC} از این پس برای دسترسی به منوی مدیریت سرور، کافیست در هر جایی از ترمینال دستور زیر را وارد کنید:"
    echo -e "     👉 ${GREEN}salehi${NC}"
    echo -e "${GOLD}════════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

update_system() {
    print_banner
    echo -e "${YELLOW}در حال به‌روزرسانی سیستم، پکیج‌ها و دریافت آخرین تغییرات از مخزن...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main || git pull origin master || true
    docker compose down
    docker compose up -d --build
    echo -e "${GREEN}✓ سامانه با موفقیت به‌روزرسانی شد.${NC}"
    read -p "برای بازگشت به منو اینتر بزنید..."
}

# منوی تعاملی (Interactive Menu)
interactive_menu() {
    while true; do
        print_banner
        echo -e "  ${CYAN}[1]${NC} نصب کامل سامانه (Fresh Installation)"
        echo -e "  ${CYAN}[2]${NC} به‌روزرسانی سامانه و دریافت کدهای جدید (Update & Pull)"
        echo -e "  ${CYAN}[3]${NC} مشاهده لاگ‌های زنده سرور (Live Logs)"
        echo -e "  ${CYAN}[4]${NC} راه‌اندازی مجدد سرویس‌ها (Restart Services)"
        echo -e "  ${CYAN}[5]${NC} بررسی وضعیت کانتینرها (Docker Status)"
        echo -e "  ${CYAN}[0]${NC} خروج (Exit)"
        echo ""
        read -rp "لطفاً یک گزینه را انتخاب کنید [0-5]: " choice

        case $choice in
            1)
                check_root
                install_dependencies
                setup_project_files
                configure_environment
                deploy_services
                create_cli_shortcut
                show_success_info
                read -p "برای بازگشت به منو اینتر بزنید..."
                ;;
            2)
                check_root
                update_system
                ;;
            3)
                cd "$INSTALL_DIR"
                docker compose logs -f
                ;;
            4)
                check_root
                cd "$INSTALL_DIR"
                docker compose restart
                echo -e "${GREEN}✓ سرویس‌ها ریستارت شدند.${NC}"
                sleep 2
                ;;
            5)
                cd "$INSTALL_DIR"
                docker compose ps
                read -p "برای بازگشت به منو اینتر بزنید..."
                ;;
            0)
                echo "خروج..."
                exit 0
                ;;
            *)
                echo -e "${RED}گزینه نامعتبر!${NC}"
                sleep 1
                ;;
        esac
    done
}

# اجرای مستقیم منو یا نصب
if [ "$1" == "install" ]; then
    check_root
    install_dependencies
    setup_project_files
    configure_environment
    deploy_services
    create_cli_shortcut
    show_success_info
else
    interactive_menu
fi
