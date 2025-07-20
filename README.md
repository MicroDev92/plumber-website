# Vodoinstaler Zekić - Production Website

Professional plumber showcase website built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js 18+
- Supabase account (free)
- Vercel account (free)

### 2. Installation
\`\`\`bash
git clone <your-repo>
cd vodoinstaler-zekic
npm install
cp .env.local.example .env.local
\`\`\`

### 3. Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Run SQL scripts in order:
   - `scripts/01-setup-database.sql`
   - `scripts/02-setup-security.sql`
   - `scripts/03-setup-storage.sql`
   - `scripts/04-sample-data.sql` (optional)
3. Get API keys from Settings > API
4. Update `.env.local` with your keys

### 4. Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 🔧 Features
- ✅ Contact form with database storage
- ✅ Photo gallery with cloud storage
- ✅ Admin dashboard
- ✅ Analytics tracking
- ✅ Responsive design
- ✅ SEO optimized

## 🔐 Admin Access
- URL: `/admin/login`
- Username: `admin`
- Password: `plumber2024`

## 📞 Support
Check browser console and Vercel/Supabase logs for errors.

---

**Production Checklist:**
- [ ] Supabase project created and configured
- [ ] Database tables created
- [ ] Environment variables set
- [ ] Local testing completed
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] Email notifications set up (optional)
- [ ] Admin password changed
- [ ] Contact information updated
