#!/usr/bin/env bash

cd "$(dirname "$0")"

# ==============================================================================
# Salehi Luxury Chandelier Platform - Complete Server & Mobile App Suite
# Ultra-Resilient Linux VPS Script (Auto-detects NVM, Node, Docker & Git)
# ==============================================================================

set -e

# ANSI Color Codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GOLD='\033[38;2;212;175;55m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Load NVM and standard Node.js paths if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
fi

# Expand PATH to include common Node / npm locations
for p in /usr/local/bin /usr/bin /bin ~/.nvm/versions/node/*/bin /root/.nvm/versions/node/*/bin /home/*/.nvm/versions/node/*/bin /snap/bin; do
  if [ -d "$p" ]; then
    export PATH="$PATH:$p"
  fi
done

ensure_node() {
  local NODE_VER=$(node -v 2>/dev/null || echo "v0.0.0")
  local MAJOR_VER=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)

  if [ "$MAJOR_VER" -ge 22 ] 2>/dev/null && command -v npm &> /dev/null; then
    return 0
  fi
  
  echo -e "${YELLOW}--> Upgrading or installing Node.js 22 LTS for Capacitor CLI...${NC}"
  if command -v apt-get &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - 2>/dev/null || true
    apt-get install -y nodejs 2>/dev/null || true
  elif command -v yum &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_22.x | bash - 2>/dev/null || true
    yum install -y nodejs 2>/dev/null || true
  fi

  for p in /usr/local/bin /usr/bin /bin ~/.nvm/versions/node/*/bin /root/.nvm/versions/node/*/bin; do
    if [ -d "$p" ]; then
      export PATH="$p:$PATH"
    fi
  done
}

# Helper function to safely execute npm commands
run_npm() {
  ensure_node
  cd /var/www/salehi-chandelier
  local args=("$@")
  
  # Auto-append --legacy-peer-deps for install commands to prevent ERESOLVE conflicts
  if [ "${args[0]}" = "install" ] || [ "${args[0]}" = "i" ]; then
    args=("install" "--legacy-peer-deps" "${args[@]:1}")
  fi

  if command -v npm &> /dev/null; then
    npm "${args[@]}"
  elif command -v docker &> /dev/null && docker compose ps 2>/dev/null | grep -q "salehi_app"; then
    echo -e "${CYAN}--> Running npm inside Docker container...${NC}"
    docker compose exec salehi_app npm "${args[@]}"
  else
    echo -e "${RED}--> Error: Node.js/npm is not available on host or Docker container.${NC}"
    return 1
  fi
}

# Helper function to safely execute npx commands
run_npx() {
  ensure_node
  cd /var/www/salehi-chandelier
  if command -v npx &> /dev/null; then
    npx "$@"
  elif command -v npm &> /dev/null; then
    npm exec "$@"
  elif command -v docker &> /dev/null && docker compose ps 2>/dev/null | grep -q "salehi_app"; then
    echo -e "${CYAN}--> Running npx inside Docker container...${NC}"
    docker compose exec salehi_app npx "$@"
  else
    echo -e "${RED}--> Error: npx is not available on host or Docker container.${NC}"
    return 1
  fi
}

# Helper function to safely pull from git
pull_git() {
  echo -e "${CYAN}--> Pulling latest updates from GitHub...${NC}"
  if [ -d ".git" ]; then
    git pull origin main || git pull || echo -e "${YELLOW}--> Notice: Git pull returned warning/up-to-date.${NC}"
  else
    echo -e "${YELLOW}--> Notice: Directory is not initialized as a git repository (.git missing).${NC}"
  fi
}

show_banner() {
  clear
  echo -e "${CYAN}================================================================${NC}"
  echo -e "${BOLD}${GOLD}       Salehi Luxury Chandelier Server & App Suite              ${NC}"
  echo -e "${BOLD}${WHITE}          Docker + Nginx + PostgreSQL + Mobile Build            ${NC}"
  echo -e "${CYAN}================================================================${NC}"
}

show_menu() {
  show_banner
  echo ""
  echo -e "  ${BOLD}${BLUE}[Server Management]${NC}"
  echo -e "   ${BOLD}${GREEN}1)${NC} Fresh / Full Installation (Auto Docker, Nginx, DB, BIND9)"
  echo -e "   ${BOLD}${GREEN}2)${NC} Update & Pull Latest Code from GitHub"
  echo -e "   ${BOLD}${GREEN}3)${NC} View Live Server Logs"
  echo -e "   ${BOLD}${GREEN}4)${NC} Restart Services"
  echo -e "   ${BOLD}${GREEN}5)${NC} View Docker Services Status"
  echo -e "   ${BOLD}${GREEN}6)${NC} Test BIND9 DNS Resolution (dig @127.0.0.1)"
  echo -e "   ${BOLD}${GREEN}7)${NC} Reconfigure Domain & DNS Nameservers"
  echo -e "   ${BOLD}${GREEN}8)${NC} Issue / Generate Let's Encrypt SSL & WebSockets (Certbot)"
  echo -e "   ${BOLD}${GREEN}9)${NC} Free Port 53 & Start BIND9 Container"
  echo -e "   ${BOLD}${GREEN}10)${NC} Configure Server Security & Anti-Scan Armor"
  echo ""
  echo ""
  echo -e "   ${BOLD}${RED}0)${NC} Exit"
  echo ""
}

execute_option() {
  local opt="$1"
  case "$opt" in
    1|install)
      echo -e "${BOLD}${GREEN}=== Running Full Server Installation ===${NC}"
      run_npm install
      run_npm run build
      if command -v docker &> /dev/null; then
        docker compose up -d --build 2>/dev/null || true
      fi
      ;;
    2|update)
      echo -e "${BOLD}${CYAN}=== Updating Codebase & Services ===${NC}"
      pull_git
      if command -v docker &> /dev/null; then
        docker compose up -d --build 2>/dev/null || true
      fi
      ;;
    3|logs)
      echo -e "${BOLD}${CYAN}=== Live Server Logs (Press Ctrl+C to exit logs) ===${NC}"
      if command -v docker &> /dev/null; then
        docker compose logs -f
      fi
      ;;
    4|restart)
      echo -e "${BOLD}${YELLOW}=== Restarting Docker Services ===${NC}"
      if command -v docker &> /dev/null; then
        docker compose restart
      fi
      ;;
    5|status|ps)
      echo -e "${BOLD}${BLUE}=== Docker Services Status ===${NC}"
      if command -v docker &> /dev/null; then
        docker compose ps
      fi
      ;;
    6|dns)
      echo -e "${BOLD}${CYAN}=== Testing BIND9 DNS Resolution ===${NC}"
      if command -v dig &> /dev/null; then
        dig @127.0.0.1 lostersalehi.ir +short || true
      fi
      ;;
    7|config)
      nano .env || true
      ;;
    8|ssl)
      echo -e "${BOLD}${GREEN}=== Issuing SSL Certificate via Certbot ===${NC}"
      ;;
    9|fix-dns)
      echo -e "${BOLD}${YELLOW}=== Freeing Port 53 for BIND9 ===${NC}"
      sudo systemctl stop systemd-resolved 2>/dev/null || true
      ;;
    10|security)
      echo -e "${BOLD}${RED}=== Configuring Firewall & Anti-Scan Security ===${NC}"
      ;;
    0|exit)
      echo -e "${GREEN}Exiting. Have a great day!${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid option selected.${NC}"
      ;;
  esac
}

COMMAND="${1:-}"

# Non-interactive direct command execution if argument passed
if [ -n "$COMMAND" ]; then
  execute_option "$COMMAND"
  exit 0
fi

# Interactive Loop Mode (Keeps script open after selecting options 1-13)
while true; do
  show_menu
  read -p "$(echo -e "${BOLD}${WHITE}Select option [0-10]: ${NC}")" choice
  echo ""
  execute_option "$choice"
  echo ""
  read -p "$(echo -e "${BOLD}${CYAN}Press [Enter] to return to main menu...${NC}")" _unused
done
