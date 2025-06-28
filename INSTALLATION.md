# Installation Guide

## Quick Fix for npm install errors

If you're getting dependency conflicts, follow these steps:

### Option 1: Clean Install (Recommended)
\`\`\`bash
# Remove existing files
rm -rf node_modules
rm -f package-lock.json

# Install with fixed dependencies
npm install
\`\`\`

### Option 2: Force Install (if Option 1 fails)
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### Option 3: Alternative Package Manager
\`\`\`bash
# Using yarn
yarn install

# Or using pnpm
pnpm install
\`\`\`

## Common Issues and Solutions

### 1. Date-fns Version Conflict
**Error**: `peer date-fns@"^2.28.0 || ^3.0.0" from react-day-picker`
**Solution**: Updated package.json to use date-fns@^3.6.0

### 2. Missing Radix UI Components
**Error**: Cannot resolve '@radix-ui/react-label'
**Solution**: Added missing Radix UI dependencies

### 3. TypeScript Errors
**Error**: Cannot find module types
**Solution**: Updated TypeScript and @types packages

## Verification

After installation, verify everything works:

\`\`\`bash
# Check if all dependencies are installed
npm list

# Run type checking
npm run type-check

# Start development server
npm run dev
\`\`\`

## Environment Setup

1. Copy the environment template:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

2. Fill in your Supabase credentials in `.env.local`

3. Test the application:
\`\`\`bash
npm run dev
\`\`\`

## Troubleshooting

If you still have issues:

1. **Clear npm cache**:
   \`\`\`bash
   npm cache clean --force
   \`\`\`

2. **Use Node.js 18 or 20**:
   \`\`\`bash
   node --version  # Should be 18.x or 20.x
   \`\`\`

3. **Check for global package conflicts**:
   \`\`\`bash
   npm list -g --depth=0
   \`\`\`

4. **Try with different package manager**:
   \`\`\`bash
   npx pnpm install
   \`\`\`

## Success Indicators

✅ No error messages during `npm install`
✅ `npm run dev` starts without errors  
✅ Website loads at http://localhost:3000
✅ Contact form and admin login work
