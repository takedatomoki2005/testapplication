# Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

- [x] `.gitignore` is configured (`.env.local` is ignored)
- [x] `env.local.example` exists with template
- [x] Repository is connected to GitHub
- [x] `vercel.json` is configured
- [ ] All code is committed and pushed to GitHub
- [ ] Supabase project is set up
- [ ] Database schema is created in Supabase

## 🚀 GitHub Upload Steps

1. **Authenticate with GitHub** (choose one method):

   **Method A: GitHub CLI (Easiest)**
   ```bash
   gh auth login
   git push origin main
   ```

   **Method B: Personal Access Token**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` permissions
   - When `git push` asks for password, paste the token

   **Method C: SSH Key**
   ```bash
   git remote set-url origin git@github.com:takedatomoki2005/testapplication.git
   git push origin main
   ```

2. **Verify on GitHub:**
   - Visit: https://github.com/takedatomoki2005/testapplication
   - Confirm all files are there (except `.env.local`)

## 🌐 Vercel Deployment Steps

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Sign in with GitHub (recommended)

2. **Import Project:**
   - Click "Add New Project"
   - Select `takedatomoki2005/testapplication`
   - Click "Import"

3. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = [your-supabase-url]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-supabase-anon-key]
   ```
   - Add to: Production, Preview, Development

4. **Deploy:**
   - Click "Deploy"
   - Wait ~2 minutes
   - Get your live URL!

## 🔗 Your Repository

- GitHub: https://github.com/takedatomoki2005/testapplication
- Vercel: https://vercel.com/dashboard (after import)

## ⚠️ Important Reminders

- Never commit `.env.local` (already in `.gitignore`)
- Always add environment variables in Vercel dashboard
- Test your deployment after it goes live
- Check Vercel logs if something doesn't work

