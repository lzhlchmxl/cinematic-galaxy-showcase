#!/bin/bash

echo "🧹 Cleaning up dependencies for Cinematic Galaxy Showcase..."

# Remove problematic files
rm -rf node_modules
rm -f package-lock.json
rm -f npm-debug.log*

# Clear npm cache
npm cache clean --force 2>/dev/null || true

echo "📦 Installing dependencies with legacy peer deps..."

# Install with legacy peer deps to bypass React Native conflicts
npm install --legacy-peer-deps

echo "✅ Dependencies installed successfully!"
echo ""
echo "🚀 You can now run:"
echo "  npm run dev     # Start development server"
echo "  npm run build   # Build for production"
echo "  npm run type-check # Check TypeScript"
echo ""
echo "🌌 Galaxy showcase will be available at http://localhost:5173/"