#!/bin/bash
################################################################################
# WeddingTech Quick Installation Script
# 
# Simple one-liner installation for fresh Ubuntu 22.04 servers
#
# Usage: 
#   bash <(curl -fsSL YOUR_RAW_GITHUB_URL/scripts/quick-install.sh)
#
################################################################################

set -e

# Colors
G='\033[0;32m'
Y='\033[1;33m'
R='\033[0;31m'
NC='\033[0m'

echo -e "${G}╔════════════════════════════════════════╗${NC}"
echo -e "${G}║   WeddingTech Quick Installer         ║${NC}"
echo -e "${G}╔════════════════════════════════════════╗${NC}"
echo ""

# Check if root
if [[ $EUID -ne 0 ]]; then
   echo -e "${R}This script must be run as root${NC}" 
   echo "Please run: sudo bash <(curl -fsSL ...)"
   exit 1
fi

# Get repository URL
if [ -z "$GIT_REPO" ]; then
    read -p "Enter GitHub repository URL [https://github.com/olegin77/wed.git]: " GIT_REPO
    GIT_REPO=${GIT_REPO:-https://github.com/olegin77/wed.git}
fi

# Get domain
if [ -z "$DOMAIN" ]; then
    read -p "Enter your domain name (or press Enter for localhost): " DOMAIN
    DOMAIN=${DOMAIN:-localhost}
fi

echo ""
echo -e "${Y}Configuration:${NC}"
echo "  Repository: $GIT_REPO"
echo "  Domain: $DOMAIN"
echo ""
read -p "Continue with installation? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Download and run full installer
echo -e "${G}Downloading full installer...${NC}"
TEMP_SCRIPT=$(mktemp)
if curl -fsSL "https://raw.githubusercontent.com/olegin77/wed/main/scripts/auto-install-droplet.sh" -o "$TEMP_SCRIPT"; then
    chmod +x "$TEMP_SCRIPT"
    export GIT_REPO
    export DOMAIN
    bash "$TEMP_SCRIPT"
    rm "$TEMP_SCRIPT"
else
    echo -e "${R}Failed to download installer${NC}"
    echo "Please check your internet connection and repository URL"
    exit 1
fi
