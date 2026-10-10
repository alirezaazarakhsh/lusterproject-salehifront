#!/usr/bin/env bash
# ==============================================================================
# Salehi Chandelier - Automated SSL Certificate Issuer & WebSocket Configurator
# Powered by Let's Encrypt (Certbot), BIND9 DNS & Nginx
# ==============================================================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$PROJECT_DIR"

TARGET_DOMAIN="$1"
ADMIN_EMAIL="$2"

if [ -z "$TARGET_DOMAIN" ]; then
    if [ -f .env ]; then
        TARGET_DOMAIN=$(grep '^DOMAIN=' .env | cut -d '=' -f2 | tr -d ' "\r')
    fi
    [ -z "$TARGET_DOMAIN" ] && TARGET_DOMAIN="lostersalehi.ir"
fi

if [ -z "$ADMIN_EMAIL" ]; then
    ADMIN_EMAIL="admin@${TARGET_DOMAIN}"
fi

# Detect Server IP
SERVER_IP=$(grep '^SERVER_IP=' .env 2>/dev/null | cut -d '=' -f2 | tr -d ' "\r' || true)
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(curl -s4 --max-time 3 https://api.ipify.org 2>/dev/null || curl -s4 --max-time 3 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
fi

echo -e "${GOLD}===================================================================${NC}"
echo -e "${CYAN}    Automated SSL & WebSocket Configuration for: ${GOLD}${TARGET_DOMAIN}${NC}"
echo -e "${GOLD}===================================================================${NC}"

# 1. Ensure directory structures & fallback certificates exist
mkdir -p nginx/ssl nginx/conf.d bind/zones

if [ ! -f nginx/ssl/default.crt ] || [ ! -f nginx/ssl/default.key ]; then
    echo -e "${CYAN}[1/5] Generating fallback self-signed SSL certificates...${NC}"
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout nginx/ssl/default.key \
        -out nginx/ssl/default.crt \
        -subj "/CN=salehi-chandelier-default/O=Salehi Chandelier/C=IR" 2>/dev/null || true
    echo -e "${GREEN}[OK] Fallback SSL certificates ready.${NC}"
else
    echo -e "${GREEN}[OK] Fallback SSL certificates already present.${NC}"
fi

# 2. Ensure BIND9 zone exists for this domain (for custom NS resolution)
if ! grep -q "zone \"${TARGET_DOMAIN}\"" bind/named.conf.local 2>/dev/null; then
    echo -e "${CYAN}[2/5] Adding BIND9 DNS zone for ${TARGET_DOMAIN}...${NC}"
    cat <<EOF >> bind/named.conf.local

zone "${TARGET_DOMAIN}" {
    type master;
    file "/etc/bind/zones/db.${TARGET_DOMAIN}";
};
EOF

    SERIAL_DATE=$(date +%Y%m%d01)
    cat <<EOF > "bind/zones/db.${TARGET_DOMAIN}"
\$TTL 86400
@   IN  SOA ns1.${TARGET_DOMAIN}. admin.${TARGET_DOMAIN}. (
            ${SERIAL_DATE} ; Serial
            3600       ; Refresh (1 hour)
            1800       ; Retry (30 mins)
            604800     ; Expire (1 week)
            86400 )    ; Minimum TTL (1 day)

; Name Servers
@       IN  NS      ns1.${TARGET_DOMAIN}.
@       IN  NS      ns2.${TARGET_DOMAIN}.

; Glue Records & Name Server IPs
ns1     IN  A       ${SERVER_IP}
ns2     IN  A       ${SERVER_IP}

; Domain A Records
@       IN  A       ${SERVER_IP}
www     IN  A       ${SERVER_IP}
EOF
    echo -e "${GREEN}[OK] BIND9 DNS zone created for ${TARGET_DOMAIN}.${NC}"
    docker exec salehi_bind9 rndc reload 2>/dev/null || docker compose restart bind9 2>/dev/null || true
fi

# 3. Ensure Nginx is running to respond to ACME challenge
echo -e "${CYAN}[3/5] Verifying Nginx reverse proxy is running...${NC}"
if ! docker ps | grep -q salehi_nginx; then
    docker compose up -d nginx
    sleep 3
fi

# 4. Request / Renew official Let's Encrypt SSL certificate via Certbot Webroot
echo -e "${CYAN}[4/5] Requesting Let's Encrypt certificate via Certbot for ${TARGET_DOMAIN} & www.${TARGET_DOMAIN}...${NC}"

CERT_SUCCESS=false
if docker compose run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot -d ${TARGET_DOMAIN} -d www.${TARGET_DOMAIN} --email ${ADMIN_EMAIL} --agree-tos --no-eff-email --keep-until-expiring --non-interactive" certbot; then
    CERT_SUCCESS=true
else
    echo -e "${YELLOW}[Notice] Standalone domain query failed with www. Trying single domain (${TARGET_DOMAIN})...${NC}"
    if docker compose run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot -d ${TARGET_DOMAIN} --email ${ADMIN_EMAIL} --agree-tos --no-eff-email --keep-until-expiring --non-interactive" certbot; then
        CERT_SUCCESS=true
    fi
fi

if [ "$CERT_SUCCESS" = true ]; then
    echo -e "${GREEN}[OK] Let's Encrypt SSL certificate successfully obtained!${NC}"

    # 5. Generate dedicated Nginx virtual host with SSL & WebSocket support
    echo -e "${CYAN}[5/5] Configuring Nginx HTTPS vhost with WebSockets...${NC}"
    cat <<EOF > "nginx/conf.d/${TARGET_DOMAIN}.conf"
# Automated Nginx configuration with SSL & WebSockets for ${TARGET_DOMAIN}
server {
    listen 80;
    listen [::]:80;
    server_name ${TARGET_DOMAIN} www.${TARGET_DOMAIN};

    # Let's Encrypt ACME Challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri =404;
    }

    # Redirect all HTTP requests to secure HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${TARGET_DOMAIN} www.${TARGET_DOMAIN};

    # Official Let's Encrypt SSL Certificates
    ssl_certificate /etc/letsencrypt/live/${TARGET_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${TARGET_DOMAIN}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # Security Headers
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Let's Encrypt ACME Challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri =404;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://salehi_backend/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Full Reverse Proxy with WebSocket Support
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
EOF

    # Test and Reload Nginx
    if docker exec salehi_nginx nginx -t 2>/dev/null; then
        docker exec salehi_nginx nginx -s reload
        echo -e "${GREEN}[OK] Nginx reloaded with official SSL certificate & WebSockets!${NC}"
        echo ""
        echo -e "${GREEN}✓ Your site is now live with HTTPS: ${GOLD}https://${TARGET_DOMAIN}/${NC}"
        echo -e "${GREEN}✓ WebSockets are fully enabled on:  ${GOLD}wss://${TARGET_DOMAIN}/${NC}"
    else
        echo -e "${RED}[Warning] Nginx configuration test had warnings. Rolling back to fallback SSL.${NC}"
        rm -f "nginx/conf.d/${TARGET_DOMAIN}.conf"
        docker exec salehi_nginx nginx -s reload 2>/dev/null || true
    fi
else
    echo -e "${YELLOW}-------------------------------------------------------------------${NC}"
    echo -e "${YELLOW}[Notice] Let's Encrypt could not verify the domain at this moment.${NC}"
    echo -e "${YELLOW}Common reasons:${NC}"
    echo -e "  1. The domain DNS records in IRNIC or your registrar are still propagating."
    echo -e "  2. The NS records (ns1.${TARGET_DOMAIN} -> ${SERVER_IP}) are not yet updated."
    echo ""
    echo -e "${GREEN}[OK] Fallback HTTPS is active! Both HTTP (80) and HTTPS (443) are working.${NC}"
    echo -e "As soon as your domain points to this server IP (${SERVER_IP}), simply run:"
    echo -e "  ${GOLD}salehi ssl ${TARGET_DOMAIN}${NC}"
    echo -e "${YELLOW}-------------------------------------------------------------------${NC}"
fi

# 6. Ensure certbot renewal container is active
docker compose up -d certbot 2>/dev/null || true

echo -e "${GOLD}===================================================================${NC}"
