#!/bin/bash

# Development Setup Script for WeddingTech Website
# This script sets up the development environment

set -e

echo "🔧 Setting up development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success ".env file created from .env.example"
    else
        print_warning "No .env.example found. You may need to create .env manually."
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run type checking
print_status "Running type checking..."
npm run type-check

print_success "Development environment setup complete! 🎉"
print_status "Run 'npm run dev' to start the development server"
print_status "Run './quick-build.sh' to build the project"
