#!/bin/bash

# Clean install commands for the plumber website

echo "🧹 Cleaning previous installations..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing dependencies..."
npm install

echo "✅ Installation complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Copy .env.local.example to .env.local"
echo "2. Fill in your Supabase credentials"
echo "3. Run 'npm run dev' to start development server"
