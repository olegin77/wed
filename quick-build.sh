#!/bin/bash

# Quick Build Script for WeddingTech Website
# This script handles all the necessary steps to build the project

set -e  # Exit on any error

echo "🚀 Starting Quick Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 20.x or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_warning "Node.js version $NODE_VERSION detected. Recommended version is 20.x or higher."
fi

print_status "Node.js version: $(node -v)"
print_status "npm version: $(npm -v)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the correct directory?"
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next
rm -rf dist
rm -rf build

# Install dependencies
print_status "Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

# Update dependencies if needed
print_status "Checking for security vulnerabilities..."
npm audit fix --force || print_warning "Some vulnerabilities could not be automatically fixed"

# Type checking
print_status "Running TypeScript type checking..."
npx tsc --noEmit || {
    print_error "TypeScript type checking failed!"
    exit 1
}

# Build the project
print_status "Building the project..."
npm run build || {
    print_error "Build failed!"
    exit 1
}

print_success "Build completed successfully! 🎉"

# Display build information
print_status "Build artifacts are in the .next directory"
print_status "To start the production server, run: npm start"
print_status "To start the development server, run: npm run dev"

# Optional: Start the production server
read -p "Do you want to start the production server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting production server on port 3000..."
    npm start
fi

print_success "Quick build process completed! 🚀"
