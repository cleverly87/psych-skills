# Vercel Deployment Guide

## Quick Deploy (2 minutes)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your `psych-skills` repository
   - Click "Deploy" (it auto-detects Next.js)

3. **Add Environment Variables** in Vercel:
   - Go to Project Settings → Environment Variables
   - Add these:
     ```
     DATABASE_URL=postgresql://postgres.qdlsnpdvlmqxptofglpw:fiShx4K34GTS0lFX@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?pgbouncer=true
     DIRECT_URL=postgresql://postgres.qdlsnpdvlmqxptofglpw:fiShx4K34GTS0lFX@aws-1-eu-central-2.pooler.supabase.com:5432/postgres
     NEXTAUTH_SECRET=AF6d8vLZM9SDBfeUtwYyOKQzjx1XcVpr
     ADMIN_EMAIL=info@psych-skills.co.uk
     ADMIN_PASSWORD=AndrewCleverly1987!
     EMAIL_SERVER_HOST=smtp.gmail.com
     EMAIL_SERVER_PORT=587
     EMAIL_SERVER_USER=your-email@gmail.com
     EMAIL_SERVER_PASSWORD=your-app-password
     EMAIL_FROM=Psych-Skills <noreply@psych-skills.com>
     ```
   - **IMPORTANT**: Set `NEXTAUTH_URL` to your Vercel URL (e.g., `https://psych-skills.vercel.app`)
   - Redeploy after adding variables

4. **Run the password reset script** on your live site:
   - In Vercel, go to your deployment
   - You'll get a URL like `https://psych-skills-xyz.vercel.app`
   - Update `NEXTAUTH_URL` to that URL
   - Click "Redeploy"

5. **Custom Domain** (when ready):
   - In Vercel → Project Settings → Domains
   - Add your Wix domain
   - Follow DNS instructions to point domain to Vercel

## Alternative: Quick Tunnel (for immediate preview)

If you just want to show it NOW without deployment:

**Using ngrok** (exposes localhost):
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3000
```

This gives you a public URL like `https://abc123.ngrok.io` that works immediately.
But it only lasts while your computer is running.

## Recommended: Vercel

Vercel is best because:
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Easy custom domain setup
- ✅ Works with your Wix domain
- ✅ Serverless functions work perfectly
- ✅ Auto-deploys on git push
