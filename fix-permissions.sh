#!/bin/bash

echo "🔧 Fixing Vite permission issues..."

# Kill any running dev servers
pkill -f "vite"

# Remove problematic directories
echo "Cleaning cache directories..."
rm -rf node_modules/.vite
rm -rf node_modules/.vite-temp
rm -rf .vite

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies with proper permissions
echo "Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "✅ Permissions fixed! You can now run 'npm run dev'"