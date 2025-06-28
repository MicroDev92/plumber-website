# Vodoinstaler Žekić - Production Setup Guide

This is a production-ready plumber showcase website built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Step-by-Step Production Setup

### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- A GitHub account
- A Vercel account (free)
- A Supabase account (free)

### 2. Clone and Setup Project

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd vodoinstaler-zekic

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
\`\`\`

### 3. Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization and fill in project details:
   - Name: `vodoinstaler-zekic`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

5. **Set up the database:**
   - Go to your project dashboard
   - Click "SQL Editor" in the sidebar
   - Click "New Query"
   - Copy and paste the content from `scripts/01-setup-database.sql`
   - Click "Run" to execute
   - Repeat for `scripts/02-setup-security.sql`
   - Optionally run `scripts/03-insert-sample-data.sql` for sample content

6. **Get your API keys:**
   - Go to Settings > API
   - Copy the "Project URL" and "anon public" key
   - Copy the "service_role" key (keep this secret!)

### 4. Configure Environment Variables

Edit your `.env.local` file:

\`\`\`env
# Required - Get these from Supabase Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key

# Optional - For email notifications (Resend.com free tier)
RESEND_API_KEY=re_your_resend_api_key

# Optional - Your production URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
\`\`\`

### 5. Test Locally

\`\`\`bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test the contact form
# Test the admin login (admin/plumber2024)
\`\`\`

### 6. Deploy to Vercel

1. Push your code to GitHub:
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. **Add Environment Variables:**
   - Go to Settings > Environment Variables
   - Add all variables from your `.env.local` file
   - Make sure to add them for Production, Preview, and Development

6. Deploy!

### 7. Optional: Set up Email Notifications

1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your domain (or use their test domain for development)
3. Get your API key from the dashboard
4. Add `RESEND_API_KEY` to your environment variables
5. Update the email addresses in `app/api/contact/route.ts`

### 8. Optional: Custom Domain

1. In Vercel dashboard, go to your project
2. Go to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## 🔧 Features

- ✅ **Contact Form**: Stores inquiries in Supabase database
- ✅ **Admin Dashboard**: Manage photos and view analytics
- ✅ **Analytics**: Track page views and contact inquiries
- ✅ **Email Notifications**: Optional email alerts for new inquiries
- ✅ **Responsive Design**: Works on all devices
- ✅ **SEO Optimized**: Proper meta tags and structure
- ✅ **Production Ready**: Error handling, validation, security

## 🔐 Admin Access

- URL: `https://your-domain.com/admin/login`
- Username: `admin`
- Password: `plumber2024`

**⚠️ Important**: Change the admin password in production by updating the database.

## 📊 Analytics

The dashboard tracks:
- Monthly website visits
- Contact form submissions
- Photo gallery metrics
- Pending inquiries

## 🆘 Troubleshooting

### Database Connection Issues
- Check your Supabase URL and keys
- Ensure RLS policies are set up correctly
- Check Supabase logs in the dashboard

### Contact Form Not Working
- Verify environment variables are set
- Check browser console for errors
- Test API endpoints directly

### Email Notifications Not Sending
- Verify Resend API key
- Check email addresses are correct
- Ensure domain is verified (for production)

## 📞 Support

For technical support, check:
1. Browser console for errors
2. Vercel deployment logs
3. Supabase logs and metrics
4. Network tab for failed requests

## 🔄 Updates

To update the website:
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel will automatically deploy

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
