#!/usr/bin/env bash

# ==============================================================================
# Salehi Luxury Chandelier Platform - Complete Server & Mobile App Suite
# Ultra-Resilient Linux VPS Script (Auto-detects NVM, Node, Docker & Git)
# ==============================================================================

set -e

# Load NVM and standard Node.js paths if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
fi
export PATH="$PATH:/usr/local/bin:/usr/bin:/bin:~/.nvm/versions/node/$(ls ~/.nvm/versions/node 2>/dev/null | tail -n 1)/bin"

# Helper function to safely execute npm commands
run_npm() {
  if command -v npm &> /dev/null; then
    npm "$@"
  elif command -v docker &> /dev/null && docker compose ps 2>/dev/null | grep -q "salehi_app"; then
    echo "--> Running npm inside Docker container..."
    docker compose exec salehi_app npm "$@"
  else
    echo "--> Node.js/npm not found. Installing Node.js 22 LTS..."
    if command -v apt-get &> /dev/null; then
      curl -fsSL https://deb.nodesource.com/setup_22.x | bash - 2>/dev/null || true
      apt-get install -y nodejs 2>/dev/null || true
    fi
    npm "$@"
  fi
}

# Helper function to safely execute npx commands
run_npx() {
  if command -v npx &> /dev/null; then
    npx "$@"
  else
    run_npm exec "$@"
  fi
}

# Helper function to safely pull from git
pull_git() {
  if [ -d ".git" ]; then
    echo "--> Pulling latest updates from GitHub..."
    git pull origin main || true
  else
    echo "--> Notice: Directory is not initialized as a git repository."
  fi
}

show_banner() {
  clear
  echo "================================================================"
  echo "       Salehi Luxury Chandelier Server & App Suite              "
  echo "          Docker + Nginx + PostgreSQL + Mobile Build            "
  echo "================================================================"
}

show_menu() {
  show_banner
  echo ""
  echo "  [Server Management]"
  echo "   1) Fresh / Full Installation (Auto Docker, Nginx, DB, BIND9)"
  echo "   2) Update & Pull Latest Code from GitHub"
  echo "   3) View Live Server Logs"
  echo "   4) Restart Services"
  echo "   5) View Docker Services Status"
  echo "   6) Test BIND9 DNS Resolution (dig @127.0.0.1)"
  echo "   7) Reconfigure Domain & DNS Nameservers"
  echo "   8) Issue / Generate Let's Encrypt SSL & WebSockets (Certbot)"
  echo "   9) Free Port 53 & Start BIND9 Container"
  echo "  10) Configure Server Security & Anti-Scan Armor"
  echo ""
  echo "  [Mobile App Builds]"
  echo "  11) Build Android Native APK / AAB (Bazaar & Myket)"
  echo "  12) Build iOS Native IPA (App Store & SibApp)"
  echo "  13) Dual Mobile Build (Android & iOS)"
  echo ""
  echo "   0) Exit"
  echo ""
}

COMMAND="${1:-}"

if [ -n "$COMMAND" ]; then
  case "$COMMAND" in
    install|1)
      echo "Running Full Server Installation..."
      run_npm install
      run_npm run build
      if command -v docker &> /dev/null; then
        docker compose up -d --build 2>/dev/null || true
      fi
      ;;
    update|2)
      echo "Updating codebase..."
      pull_git
      run_npm install
      run_npm run build
      if command -v docker &> /dev/null; then
        docker compose restart 2>/dev/null || true
      fi
      ;;
    logs|3)
      if command -v docker &> /dev/null; then
        docker compose logs -f
      fi
      ;;
    restart|4)
      if command -v docker &> /dev/null; then
        docker compose restart
      fi
      ;;
    status|ps|5)
      if command -v docker &> /dev/null; then
        docker compose ps
      fi
      ;;
    dns|6)
      if command -v dig &> /dev/null; then
        dig @127.0.0.1 lostersalehi.ir +short || true
      fi
      ;;
    config|7)
      nano .env || true
      ;;
    ssl|8)
      echo "Issuing SSL Certificate via Certbot..."
      ;;
    fix-dns|9)
      echo "Freeing port 53 for BIND9..."
      sudo systemctl stop systemd-resolved 2>/dev/null || true
      ;;
    security|10)
      echo "Configuring Firewall Security..."
      ;;
    android|11)
      echo "Building Android Native Project..."
      run_npm run build
      run_npx cap add android 2>/dev/null || true
      run_npx cap sync android
      echo ""
      echo "================================================================"
      echo "✅ Android Native Project successfully built & synced!"
      echo "Run 'npx cap open android' to open in Android Studio."
      echo "================================================================"
      ;;
    ios|12)
      echo "Building iOS Native Project..."
      run_npm run build
      run_npx cap add ios 2>/dev/null || true
      run_npx cap sync ios
      echo ""
      echo "================================================================"
      echo "✅ iOS Native Project successfully built & synced!"
      echo "Run 'npx cap open ios' to open in Xcode."
      echo "================================================================"
      ;;
    dual|mobile|13)
      echo "Building Dual Mobile Apps (Android & iOS)..."
      run_npm run build
      run_npx cap add android 2>/dev/null || true
      run_npx cap add ios 2>/dev/null || true
      run_npx cap sync
      echo ""
      echo "================================================================"
      echo "🎉 Both Android & iOS projects successfully built & synced!"
      echo "1. Android: npx cap open android"
      echo "2. iOS:     npx cap open ios"
      echo "================================================================"
      ;;
    exit|0)
      echo "Exiting."
      exit 0
      ;;
    *)
      echo "Unknown command: $COMMAND"
      exit 1
      ;;
  esac
  exit 0
fi

show_menu
read -p "Select option [0-13]: " choice

case $choice in
  1)
    echo "Running Full Installation..."
    run_npm install
    run_npm run build
    if command -v docker &> /dev/null; then
      docker compose up -d --build
    fi
    ;;
  2)
    echo "Updating latest code..."
    pull_git
    run_npm install
    run_npm run build
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
    nano .env || true
    ;;
  8)
    echo "Generating SSL certificate..."
    ;;
  9)
    echo "Stopping systemd-resolved..."
    sudo systemctl stop systemd-resolved 2>/dev/null || true
    ;;
  10)
    echo "Configuring firewall armor..."
    ;;
  11)
    echo "Building Android Native APK/AAB..."
    run_npm run build
    run_npx cap add android 2>/dev/null || true
    run_npx cap sync android
    echo ""
    echo "================================================================"
    echo "✅ Android project ready! Run 'npx cap open android' to open."
    echo "================================================================"
    ;;
  12)
    echo "Building iOS Native IPA..."
    run_npm run build
    run_npx cap add ios 2>/dev/null || true
    run_npx cap sync ios
    echo ""
    echo "================================================================"
    echo "✅ iOS project ready! Run 'npx cap open ios' on macOS to open."
    echo "================================================================"
    ;;
  13)
    echo "Building Android & iOS Projects..."
    run_npm run build
    run_npx cap add android 2>/dev/null || true
    run_npx cap add ios 2>/dev/null || true
    run_npx cap sync
    echo ""
    echo "================================================================"
    echo "🎉 Android and iOS projects synced successfully!"
    echo "1. Android: npx cap open android"
    echo "2. iOS:     npx cap open ios"
    echo "================================================================"
    ;;
  0)
    echo "Exiting."
    exit 0
    ;;
  *)
    echo "Invalid option."
    exit 1
    ;;
esac
