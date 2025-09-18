#!/bin/bash

echo "🚀 Starting development server with debug mode..."

# Kill any existing processes
pkill -f "vite" 2>/dev/null

# Start with verbose logging
NODE_ENV=development npm run dev -- --debug