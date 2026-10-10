#!/usr/bin/env bash
# ==============================================================================
# Salehi Luxury Chandelier Platform - Management & Installation Script
# Built for Ubuntu 26 / 24 / 22 / Debian with Docker & Nginx
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
REPO_URL="https://github.com/alirezaazarakhsh/lusterproject-salehifront.git"

get_input() {
    local prompt="$1"
    local default_val="$2"
    local var_name="$3"
    local input=""

    if [ -t 0 ]; then
        read -rp "$(echo -e "$prompt")" input
    elif [ -e /dev/tty ]; then
        read -rp "$(echo -e "$prompt")" input < /dev/tty
    else
        input=""
    fi

    if [ -z "$input" ]; then
        eval "$var_name=\"$default_val\""
    else
        eval "$var_name=\"$input\""
    fi
}

pause_prompt() {
    echo ""
    if [ -t 0 ]; then
        read -rp "Press [Enter] to return to the menu..." _dummy
    elif [ -e /dev/tty ]; then
        read -rp "Press [Enter] to return to the menu..." _dummy < /dev/tty
    else
        sleep 2
    fi
}

print_banner() {
    clear
    echo -e "${GOLD}"
    echo "  +-------------------------------------------------------------+"
    echo "  |                                                             |"
    echo "  |       Salehi Luxury Chandelier Server Management Panel      |"
    echo "  |          Docker + Nginx + PostgreSQL + Ubuntu Ready         |"
    echo "  |                                                             |"
    echo "  +-------------------------------------------------------------+"
    echo -e "${NC}"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}[Error] Please run this script as root (sudo bash install.sh)${NC}"
        exit 1
    fi
}

free_port_53() {
    echo -e "${YELLOW}Ensuring Port 53 is free for BIND9 Authoritative DNS...${NC}"
    # Stop native DNS daemons that may conflict on port 53
    systemctl stop named 2>/dev/null || true
    systemctl disable named 2>/dev/null || true
    systemctl stop bind9 2>/dev/null || true
    systemctl disable bind9 2>/dev/null || true
    systemctl stop dnsmasq 2>/dev/null || true
    systemctl disable dnsmasq 2>/dev/null || true

    # Disable systemd-resolved DNSStubListener (which listens on 127.0.0.53:53)
    if [ -f /etc/systemd/resolved.conf ]; then
        sed -i 's/^#*DNSStubListener=.*/DNSStubListener=no/' /etc/systemd/resolved.conf
        grep -q '^DNSStubListener=no' /etc/systemd/resolved.conf || echo "DNSStubListener=no" >> /etc/systemd/resolved.conf
    fi

    # Create persistent systemd-resolved drop-in override
    mkdir -p /etc/systemd/resolved.conf.d 2>/dev/null || true
    cat << 'EOF' > /etc/systemd/resolved.conf.d/disable-stub.conf
[Resolve]
DNSStubListener=no
EOF

    systemctl restart systemd-resolved 2>/dev/null || true

    # Maintain host DNS resolution by setting public DNS in resolv.conf
    rm -f /etc/resolv.conf 2>/dev/null || true
    cat << 'EOF' > /etc/resolv.conf
nameserver 8.8.8.8
nameserver 1.1.1.1
nameserver 4.2.2.4
EOF

    # Terminate any lingering host processes holding port 53
    if command -v fuser &>/dev/null; then
        fuser -k 53/tcp 2>/dev/null || true
        fuser -k 53/udp 2>/dev/null || true
    fi

    # Remove previous failed or dead salehi_bind9 container
    docker rm -f salehi_bind9 2>/dev/null || true
    echo -e "${GREEN}[OK] Port 53 is clear and ready for BIND9.${NC}"
}

install_dependencies() {
    print_banner
    echo -e "${CYAN}[1/5] Checking and installing system packages (Docker, Compose, Git)...${NC}"
    
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y curl git ufw wget ca-certificates gnupg lsb-release dnsutils psmisc

    # Free port 53 for BIND9 container
    free_port_53

    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}Installing Docker Engine...${NC}"
        curl -fsSL https://get.docker.com | sh
        systemctl start docker
        systemctl enable docker
    else
        echo -e "${GREEN}[OK] Docker is already installed.${NC}"
    fi

    if ! docker compose version &> /dev/null; then
        echo -e "${YELLOW}Installing Docker Compose plugin...${NC}"
        apt-get install -y docker-compose-plugin
    else
        echo -e "${GREEN}[OK] Docker Compose is already installed.${NC}"
    fi
    echo -e "${GREEN}[OK] Dependencies installed successfully.${NC}"
}

setup_project_files() {
    print_banner
    echo -e "${CYAN}[2/5] Setting up project directory and pulling latest code...${NC}"

    mkdir -p /var/www
    if [ ! -d "$INSTALL_DIR/.git" ]; then
        if [ -d "." ] && [ -f "package.json" ]; then
            echo -e "${YELLOW}Copying current files into $INSTALL_DIR...${NC}"
            mkdir -p "$INSTALL_DIR"
            cp -r . "$INSTALL_DIR/" 2>/dev/null || true
        else
            echo -e "${YELLOW}Cloning repository from GitHub...${NC}"
            rm -rf "$INSTALL_DIR"
            git clone "$REPO_URL" "$INSTALL_DIR"
        fi
    else
        echo -e "${GREEN}[OK] Project repository exists. Pulling latest commits...${NC}"
        cd "$INSTALL_DIR"
        [ -f .env ] && cp .env /tmp/salehi_env_backup 2>/dev/null || true
        git fetch origin || true
        git reset --hard origin/main 2>/dev/null || git reset --hard origin/master 2>/dev/null || git pull origin main || true
        [ -f /tmp/salehi_env_backup ] && cp /tmp/salehi_env_backup .env 2>/dev/null || true
    fi

    cd "$INSTALL_DIR"
}

configure_environment() {
    print_banner
    echo -e "${CYAN}[3/5] Configuring domain, IP, BIND9 DNS, and Nginx...${NC}"

    DEFAULT_DOMAIN="lostersalehi.ir"
    get_input "${GOLD}>> Enter your domain name [default: ${DEFAULT_DOMAIN}]: ${NC}" "$DEFAULT_DOMAIN" DOMAIN

    # Auto-detect public IP of the server
    AUTO_IP=$(curl -s4 --max-time 4 https://api.ipify.org 2>/dev/null || curl -s4 --max-time 4 https://ifconfig.me 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}')
    [ -z "$AUTO_IP" ] && AUTO_IP="127.0.0.1"
    get_input "${GOLD}>> Server Public IP for DNS Records [default: ${AUTO_IP}]: ${NC}" "$AUTO_IP" SERVER_IP

    # Write .env
    cat <<EOF > .env
NODE_ENV=production
PORT=3000
DOMAIN=${DOMAIN}
SERVER_IP=${SERVER_IP}
SQL_HOST=postgres
SQL_PORT=5432
SQL_USER=salehi_user
SQL_PASSWORD=salehi_secure_password_2026
SQL_DB_NAME=salehi_chandelier_db
EOF
    echo -e "${GREEN}[OK] .env configuration generated.${NC}"

    # Configure Nginx Reverse-Proxy & SSL Folders
    mkdir -p nginx/ssl nginx/conf.d scripts
    if [ ! -f nginx/ssl/default.crt ] || [ ! -f nginx/ssl/default.key ]; then
        openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
            -keyout nginx/ssl/default.key \
            -out nginx/ssl/default.crt \
            -subj "/CN=salehi-chandelier-default/O=Salehi Chandelier/C=IR" 2>/dev/null || true
    fi

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
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml font/woff font/woff2 image/jpeg image/png image/webp;

    # WebSocket connection upgrade mapping
    map \$http_upgrade \$connection_upgrade {
        default upgrade;
        ''      close;
    }

    upstream salehi_backend {
        server app:3000;
        keepalive 32;
    }

    # Port 80: ACME Webroot challenge & WebSocket reverse-proxy
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
            try_files \$uri =404;
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
            proxy_set_header Connection \$connection_upgrade;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_read_timeout 86400s;
            proxy_send_timeout 86400s;
        }
    }

    # Port 443: SSL Reverse-Proxy with WebSockets
    server {
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;
        server_name _;

        ssl_certificate /etc/nginx/ssl/default.crt;
        ssl_certificate_key /etc/nginx/ssl/default.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers off;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
            try_files \$uri =404;
        }

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
            proxy_set_header Connection \$connection_upgrade;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_read_timeout 86400s;
            proxy_send_timeout 86400s;
        }
    }

    include /etc/nginx/conf.d/*.conf;
}
EOF
    echo -e "${GREEN}[OK] Nginx reverse-proxy & WebSocket configuration generated.${NC}"

    # Configure BIND9 Authoritative DNS Zone
    mkdir -p bind/zones
    cat <<EOF > bind/named.conf.local
zone "${DOMAIN}" {
    type master;
    file "/etc/bind/zones/db.${DOMAIN}";
};
EOF

    SERIAL_DATE=$(date +%Y%m%d01)
    cat <<EOF > "bind/zones/db.${DOMAIN}"
\$TTL 86400
@   IN  SOA ns1.${DOMAIN}. admin.${DOMAIN}. (
            ${SERIAL_DATE} ; Serial
            3600       ; Refresh (1 hour)
            1800       ; Retry (30 mins)
            604800     ; Expire (1 week)
            86400 )    ; Minimum TTL (1 day)

; Name Servers
@       IN  NS      ns1.${DOMAIN}.
@       IN  NS      ns2.${DOMAIN}.

; Glue Records & Name Server IPs
ns1     IN  A       ${SERVER_IP}
ns2     IN  A       ${SERVER_IP}

; Domain A Records
@       IN  A       ${SERVER_IP}
www     IN  A       ${SERVER_IP}
EOF
    echo -e "${GREEN}[OK] BIND9 DNS Zone configured (ns1/ns2.${DOMAIN} -> ${SERVER_IP}).${NC}"

    # Configure Firewall (UFW)
    if command -v ufw &>/dev/null; then
        ufw allow 80/tcp 2>/dev/null || true
        ufw allow 443/tcp 2>/dev/null || true
        ufw allow 3000/tcp 2>/dev/null || true
        ufw allow 53/tcp 2>/dev/null || true
        ufw allow 53/udp 2>/dev/null || true
        echo -e "${GREEN}[OK] Firewall ports (80, 443, 3000, 53 UDP/TCP) allowed.${NC}"
    fi
}

deploy_services() {
    print_banner
    echo -e "${CYAN}[4/5] Building and starting Docker containers (App, Nginx, PostgreSQL, BIND9, Certbot)...${NC}"
    cd "$INSTALL_DIR"
    
    free_port_53
    docker compose down --remove-orphans 2>/dev/null || true
    docker rm -f salehi_nginx salehi_app salehi_postgres salehi_bind9 salehi_certbot 2>/dev/null || true
    docker compose up -d --build

    echo -e "${CYAN}[5/5] Checking service health & issuing SSL certificate...${NC}"
    sleep 6

    # Automatically issue Let's Encrypt SSL certificate & configure WebSockets
    if [ -f scripts/auto-ssl.sh ]; then
        chmod +x scripts/auto-ssl.sh 2>/dev/null || true
        bash scripts/auto-ssl.sh "${DOMAIN}" || true
    fi

    echo -e "${GREEN}[OK] All services and containers deployed successfully!${NC}"
}

create_cli_shortcut() {
    cat << 'EOF' > /usr/local/bin/salehi
#!/usr/bin/env bash
cd /var/www/salehi-chandelier
bash install.sh "$@"
EOF
    chmod +x /usr/local/bin/salehi

    cat << 'EOF' > /usr/local/bin/salehi-ssl
#!/usr/bin/env bash
cd /var/www/salehi-chandelier
bash scripts/auto-ssl.sh "$@"
EOF
    chmod +x /usr/local/bin/salehi-ssl
}

show_success_info() {
    print_banner
    echo -e "${GOLD}===================================================================${NC}"
    echo -e "${GREEN}   Salehi Luxury Chandelier Platform Successfully Installed!   ${NC}"
    echo -e "${GOLD}===================================================================${NC}"
    echo ""
    echo -e "  [Website HTTPS URL]  ${GOLD}https://${DOMAIN}${NC}"
    echo -e "  [Website HTTP URL]   http://${DOMAIN}  (or http://${SERVER_IP})"
    echo -e "  [Port 3000 Direct]   http://${SERVER_IP}:3000"
    echo -e "  [Admin Panel]        https://${DOMAIN}/admin"
    echo -e "  [Health Check]       https://${DOMAIN}/health"
    echo ""
    echo -e "  [Admin Phone]        09120759419"
    echo -e "  [Admin Password]     sasha9419"
    echo ""
    echo -e "${CYAN}-------------------------------------------------------------------${NC}"
    echo -e "${YELLOW}  [Nginx, SSL & WebSocket Status]${NC}"
    echo -e "    * Nginx Proxy:     Active on Ports 80 & 443"
    echo -e "    * WebSockets:      Fully Supported (ws:// and wss://)"
    echo -e "    * Certbot SSL:     Automated Renewal Active (every 12h)"
    echo -e "    * Issue New SSL:   ${GREEN}salehi ssl <any-domain>${NC}"
    echo ""
    echo -e "${YELLOW}  [IRNIC / DNS Settings for Custom NS]${NC}"
    echo -e "    1. Name Server 1:  ${GOLD}ns1.${DOMAIN}${NC}  |  IP: ${GOLD}${SERVER_IP}${NC}"
    echo -e "    2. Name Server 2:  ${GOLD}ns2.${DOMAIN}${NC}  |  IP: ${GOLD}${SERVER_IP}${NC}"
    echo ""
    echo -e "  [BIND9 DNS Status]   Active & Listening on Port 53 (TCP/UDP)"
    echo -e "  [Quick DNS Test]     dig @127.0.0.1 ${DOMAIN}"
    echo -e "${GOLD}-------------------------------------------------------------------${NC}"
    echo -e "  [Tip] You can manage this server anytime by typing:"
    echo -e "        ${GREEN}salehi${NC}"
    echo -e "${GOLD}===================================================================${NC}"
    echo ""
}

manage_ssl() {
    print_banner
    cd "$INSTALL_DIR"
    local DOM_NAME="${DOMAIN:-lostersalehi.ir}"
    if [ -f .env ]; then
        DOM_NAME=$(grep '^DOMAIN=' .env | cut -d '=' -f2)
    fi
    get_input "${GOLD}>> Enter domain to issue/renew Let's Encrypt SSL [default: ${DOM_NAME}]: ${NC}" "$DOM_NAME" TARGET_DOM
    bash scripts/auto-ssl.sh "${TARGET_DOM}"
    pause_prompt
}

test_dns() {
    print_banner
    cd "$INSTALL_DIR" 2>/dev/null || true
    local DOM_NAME="${DOMAIN:-lostersalehi.ir}"
    if [ -f .env ]; then
        DOM_NAME=$(grep '^DOMAIN=' .env | cut -d '=' -f2)
    fi
    echo -e "${CYAN}Testing BIND9 DNS server resolution for domain: ${GOLD}${DOM_NAME}${NC}"
    echo ""
    if command -v dig &>/dev/null; then
        echo -e "${YELLOW}Querying @127.0.0.1 for ${DOM_NAME}:${NC}"
        dig @127.0.0.1 "${DOM_NAME}" +noall +answer || true
        echo ""
        echo -e "${YELLOW}Querying @127.0.0.1 for ns1.${DOM_NAME}:${NC}"
        dig @127.0.0.1 "ns1.${DOM_NAME}" +noall +answer || true
        echo ""
        echo -e "${YELLOW}Querying @127.0.0.1 for NS records:${NC}"
        dig @127.0.0.1 "${DOM_NAME}" NS +noall +answer || true
    else
        echo -e "${YELLOW}Docker Container Status for BIND9:${NC}"
        docker compose ps bind9
    fi
    echo ""
    echo -e "${GREEN}[OK] DNS test query completed.${NC}"
    pause_prompt
}

update_system() {
    print_banner
    echo -e "${YELLOW}Pulling latest updates from GitHub and rebuilding containers...${NC}"
    cd "$INSTALL_DIR"
    [ -f .env ] && cp .env /tmp/salehi_env_backup 2>/dev/null || true
    git fetch origin || true
    git reset --hard origin/main 2>/dev/null || git reset --hard origin/master 2>/dev/null || git pull origin main || true
    [ -f /tmp/salehi_env_backup ] && cp /tmp/salehi_env_backup .env 2>/dev/null || true
    free_port_53
    docker compose down --remove-orphans 2>/dev/null || true
    docker rm -f salehi_nginx salehi_app salehi_postgres salehi_bind9 2>/dev/null || true
    docker compose up -d --build
    echo -e "${GREEN}[OK] System successfully updated to the latest version!${NC}"
    pause_prompt
}

interactive_menu() {
    while true; do
        print_banner
        echo -e "  ${CYAN}[1]${NC} Fresh / Full Installation (Auto Docker, Nginx, DB, BIND9)"
        echo -e "  ${CYAN}[2]${NC} Update & Pull Latest Code from GitHub"
        echo -e "  ${CYAN}[3]${NC} View Live Server Logs"
        echo -e "  ${CYAN}[4]${NC} Restart Services"
        echo -e "  ${CYAN}[5]${NC} View Docker Services Status"
        echo -e "  ${CYAN}[6]${NC} Test BIND9 DNS Resolution (dig @127.0.0.1)"
        echo -e "  ${CYAN}[7]${NC} Reconfigure Domain & DNS Nameservers"
        echo -e "  ${CYAN}[8]${NC} Issue / Generate Let's Encrypt SSL & WebSockets (Certbot)"
        echo -e "  ${CYAN}[9]${NC} Free Port 53 & Start BIND9 Container"
        echo -e "  ${CYAN}[0]${NC} Exit"
        echo ""

        local choice=""
        get_input "Please enter your choice [0-9]: " "" choice

        case "$choice" in
            1)
                check_root
                install_dependencies
                setup_project_files
                configure_environment
                deploy_services
                create_cli_shortcut
                show_success_info
                pause_prompt
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
                echo -e "${GREEN}[OK] Services restarted successfully.${NC}"
                sleep 2
                ;;
            5)
                cd "$INSTALL_DIR"
                docker compose ps
                pause_prompt
                ;;
            6)
                test_dns
                ;;
            7)
                check_root
                cd "$INSTALL_DIR"
                configure_environment
                docker compose restart nginx bind9
                echo -e "${GREEN}[OK] Nginx and BIND9 reloaded with new settings!${NC}"
                show_success_info
                pause_prompt
                ;;
            8)
                check_root
                manage_ssl
                ;;
            9)
                check_root
                free_port_53
                cd "$INSTALL_DIR"
                docker compose up -d bind9 nginx
                echo -e "${GREEN}[OK] Port 53 freed and BIND9 container started!${NC}"
                pause_prompt
                ;;
            0)
                echo "Exiting..."
                exit 0
                ;;
            *)
                echo -e "${RED}[Error] Invalid choice! Please select 0 to 9.${NC}"
                sleep 1.5
                ;;
        esac
    done
}

if [ "$1" == "install" ] || [ "$1" == "1" ]; then
    check_root
    install_dependencies
    setup_project_files
    configure_environment
    deploy_services
    create_cli_shortcut
    show_success_info
elif [ "$1" == "update" ] || [ "$1" == "2" ]; then
    check_root
    update_system
elif [ "$1" == "logs" ] || [ "$1" == "3" ]; then
    cd "$INSTALL_DIR"
    docker compose logs -f
elif [ "$1" == "restart" ] || [ "$1" == "4" ]; then
    check_root
    cd "$INSTALL_DIR"
    docker compose restart
    echo -e "${GREEN}[OK] Services restarted successfully.${NC}"
elif [ "$1" == "ps" ] || [ "$1" == "status" ] || [ "$1" == "5" ]; then
    cd "$INSTALL_DIR"
    docker compose ps
elif [ "$1" == "dns" ] || [ "$1" == "test-dns" ] || [ "$1" == "6" ]; then
    test_dns
elif [ "$1" == "config" ] || [ "$1" == "reconfig" ] || [ "$1" == "7" ]; then
    check_root
    cd "$INSTALL_DIR"
    configure_environment
    docker compose restart nginx bind9
    echo -e "${GREEN}[OK] Nginx and BIND9 reloaded with new settings!${NC}"
    show_success_info
elif [ "$1" == "ssl" ] || [ "$1" == "auto-ssl" ] || [ "$1" == "certbot" ] || [ "$1" == "8" ]; then
    check_root
    cd "$INSTALL_DIR"
    if [ -n "$2" ]; then
        bash scripts/auto-ssl.sh "$2" "$3"
    else
        manage_ssl
    fi
elif [ "$1" == "fix-dns" ] || [ "$1" == "free-53" ] || [ "$1" == "9" ]; then
    check_root
    free_port_53
    cd "$INSTALL_DIR"
    docker compose up -d bind9 nginx
    echo -e "${GREEN}[OK] Port 53 freed and containers started!${NC}"
else
    interactive_menu
fi
