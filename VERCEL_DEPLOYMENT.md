# 🚀 Vercel Frontend Deployment Guide

Deploy your React frontend to Vercel (Free & Fast!)

---

## ✅ Prerequisites

- [x] Backend deployed on Render: https://online-voting-system-o9eo.onrender.com
- [ ] Vercel account (free): https://vercel.com
- [ ] Code pushed to GitHub

---

## 🎯 Quick Deploy (5 Minutes)

### Step 1: Create `.env.production` File

In your `frontend` folder, create `.env.production`:

```env
REACT_APP_API_URL=https://online-voting-system-o9eo.onrender.com/api
```

**Command:**
```bash
cd frontend
echo REACT_APP_API_URL=https://online-voting-system-o9eo.onrender.com/api > .env.production
cd ..
```

### Step 2: Push to GitHub (if not already done)

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to:** https://vercel.com/new
2. **Sign in** with GitHub
3. **Import your repository**
4. **Configure Project:**
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

5. **Add Environment Variable:**
   - Click **"Environment Variables"**
   - Add:
     ```
     Name: REACT_APP_API_URL
     Value: https://online-voting-system-o9eo.onrender.com/api
     Environment: Production
     ```

6. Click **"Deploy"**
7. ⏳ Wait 2-3 minutes for build

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend folder
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? votingsys-frontend
# - In which directory is your code located? ./
# - Want to override settings? No

# After first deployment, deploy to production:
vercel --prod
```

---

## 🎉 After Deployment

You'll get a URL like:
```
https://votingsys-frontend.vercel.app
```

### Update Backend CORS

1. Go to your Render backend: https://dashboard.render.com/
2. Click on `online-voting-system-o9eo`
3. Go to **Environment** tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://votingsys-frontend.vercel.app
   ```
5. Click **Save Changes**

---

## 📁 Optional: Add vercel.json

Create `frontend/vercel.json` for better configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures proper routing for React Router.

---

## 🔄 Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: For every pull request

No manual deployment needed! 🎉

---

## 🛠️ Vercel Environment Variables

### Via Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add variables:
   - `REACT_APP_API_URL` = `https://online-voting-system-o9eo.onrender.com/api`

### Via CLI

```bash
vercel env add REACT_APP_API_URL production
# Paste: https://online-voting-system-o9eo.onrender.com/api
```

---

## ✅ Verify Deployment

1. Visit your Vercel URL: `https://votingsys-frontend.vercel.app`
2. Check if landing page loads
3. Try to login/register
4. Test voting functionality

---

## 🆚 Vercel vs Render (Frontend)

| Feature | Vercel | Render (Static) |
|---------|--------|-----------------|
| **Speed** | ⚡ Faster (Edge Network) | 🐢 Slower |
| **Free Tier** | 100GB Bandwidth | 100GB Bandwidth |
| **Deploy Time** | ~2 min | ~5-10 min |
| **Custom Domain** | ✅ Free SSL | ✅ Free SSL |
| **Auto-Deploy** | ✅ Git Push | ✅ Git Push |
| **Edge Functions** | ✅ Yes | ❌ No |
| **Best For** | Frontend Apps | Static Sites |

**Recommendation:** ✅ Use Vercel for frontend!

---

## 🔧 Troubleshooting

### Build Fails

**Error: Missing dependencies**
```bash
cd frontend
npm install
npm run build
# If builds locally, commit package-lock.json
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

**Error: Environment variable not found**
- Check spelling: Must start with `REACT_APP_`
- Verify in Vercel dashboard: Settings → Environment Variables
- Redeploy after adding variables

### API Calls Fail

**CORS Error:**
- Update `FRONTEND_URL` on Render backend
- Use exact Vercel URL (no trailing slash)

**404 Errors:**
- Verify `REACT_APP_API_URL` ends with `/api`
- Check backend is running: https://online-voting-system-o9eo.onrender.com/api/health

### Routing Issues (404 on refresh)

Add `vercel.json` with rewrites (see above)

---

## 🌐 Custom Domain (Optional)

### Add Your Domain

1. Go to Vercel project
2. Settings → Domains
3. Add your domain
4. Follow DNS configuration steps

Vercel provides free SSL certificates automatically!

---

## 📊 Your Complete Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| **Backend** | Render | https://online-voting-system-o9eo.onrender.com |
| **Frontend** | Vercel | https://votingsys-frontend.vercel.app |
| **Database** | Supabase | (Your Supabase URL) |

---

## 🎓 Quick Tips

✅ **Use Environment Variables** - Never hardcode API URLs
✅ **Enable Auto-Deploy** - Push to main = instant deployment
✅ **Monitor Builds** - Check Vercel dashboard for errors
✅ **Use Preview Deployments** - Test PRs before merging
✅ **Check Logs** - Vercel provides real-time function logs

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Discord**: https://vercel.com/discord
- **Need Help?** Check the Vercel dashboard logs

---

## 🎉 Success!

Your frontend is now on Vercel's global edge network! 🚀

Share your app:
```
https://votingsys-frontend.vercel.app
```

Enjoy lightning-fast deployments! ⚡

