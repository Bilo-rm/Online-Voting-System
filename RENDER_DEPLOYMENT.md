# 🚀 Render Deployment Guide

This guide will help you deploy your Online Voting System to Render (both frontend and backend).

---

## 📋 Prerequisites

1. ✅ GitHub account with your code pushed to a repository
2. ✅ [Render account](https://render.com/) (free tier works)
3. ✅ Supabase project already set up
4. ✅ Database schema already applied (supabase_schema.sql & admin_schema.sql)

---

## 🔧 Part 1: Deploy Backend (Flask API)

### Step 1: Prepare Backend

The backend files are already prepared:
- ✅ `gunicorn` added to `requirements.txt`
- ✅ CORS updated to support production URLs

### Step 2: Create Backend Web Service

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. **Configure Service:**
   - **Name**: `votingsys-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free` (or upgrade to paid for always-on)

5. **Add Environment Variables** (in Render dashboard):
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-role-key
   JWT_SECRET=generate-a-random-secret-32-characters-or-more
   FRONTEND_URL=leave-blank-for-now
   ```

   **How to get Supabase keys:**
   - Go to your Supabase project dashboard
   - Click on **Settings** → **API**
   - Copy `Project URL` → Use as `SUPABASE_URL`
   - Copy `anon/public` key → Use as `SUPABASE_KEY`
   - Copy `service_role` key → Use as `SUPABASE_SERVICE_KEY`
   
   **Generate JWT_SECRET:**
   ```bash
   # Use Python to generate a secure secret
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

6. Click **"Create Web Service"**
7. Wait for deployment to complete
8. **Copy your backend URL**: `https://votingsys-backend.onrender.com`

---

## 🎨 Part 2: Deploy Frontend (React)

### Step 1: Prepare Frontend

1. **Create `.env.production` file** in the `frontend` folder:
   ```bash
   cd frontend
   cp env.production.example .env.production
   ```

2. **Edit `.env.production`** and update the backend URL:
   ```env
   REACT_APP_API_URL=https://votingsys-backend.onrender.com/api
   ```
   Replace `votingsys-backend` with your actual backend service name.

### Step 2: Create Frontend Static Site

1. **Go to Render Dashboard**
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. **Configure Service:**
   - **Name**: `votingsys-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

5. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://votingsys-backend.onrender.com/api
   ```

6. Click **"Create Static Site"**
7. Wait for deployment to complete
8. **Copy your frontend URL**: `https://votingsys-frontend.onrender.com`

---

## 🔄 Part 3: Final Configuration

### Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to your **Backend Web Service** in Render
2. Go to **Environment** tab
3. **Update** the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://votingsys-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. The service will automatically redeploy

---

## ✅ Part 4: Verify Deployment

### Test Your Application

1. **Visit your frontend URL**: `https://votingsys-frontend.onrender.com`
2. **Register a new account**
3. **Login**
4. **Test voting functionality**

### Create Admin User

If you need to create an admin user:

1. Go to your Supabase project
2. Go to **SQL Editor**
3. Run the admin creation script from `backend/make_admin.sql`:
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
   WHERE email = 'your-admin-email@example.com';
   ```

---

## 🎯 Deployment Summary

| Component | Type | URL |
|-----------|------|-----|
| **Backend** | Web Service | `https://votingsys-backend.onrender.com` |
| **Frontend** | Static Site | `https://votingsys-frontend.onrender.com` |
| **Database** | Supabase | `https://your-project.supabase.co` |

---

## ⚠️ Important Notes

### Free Tier Limitations

⏰ **Backend will sleep after 15 minutes of inactivity**
- First request after sleep takes ~30-60 seconds to wake up
- Consider upgrading to paid plan ($7/month) for always-on service

💾 **Databases are always running**
- Supabase free tier is always available

### Environment Variables Checklist

**Backend** (`votingsys-backend`):
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_KEY`
- ✅ `SUPABASE_SERVICE_KEY`
- ✅ `JWT_SECRET`
- ✅ `FRONTEND_URL`

**Frontend** (`votingsys-frontend`):
- ✅ `REACT_APP_API_URL`

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend shows "Application failed to respond"
- **Solution**: Check logs in Render dashboard → Look for Python errors
- Verify all environment variables are set correctly

**Problem**: CORS errors in browser
- **Solution**: Ensure `FRONTEND_URL` is set correctly in backend
- Check browser console for specific error

### Frontend Issues

**Problem**: "Failed to fetch" errors
- **Solution**: Verify `REACT_APP_API_URL` is correct
- Check if backend is awake (visit backend URL directly)

**Problem**: Build fails
- **Solution**: Check build logs in Render
- Ensure all npm dependencies are in package.json

### Database Issues

**Problem**: Authentication errors
- **Solution**: Verify Supabase keys are correct
- Check if RLS policies are applied

**Problem**: Can't create admin
- **Solution**: Run SQL scripts in Supabase SQL Editor
- Check user exists in auth.users table

---

## 🔄 Updating Your Deployment

### Update Backend
1. Push changes to GitHub
2. Render will automatically redeploy
3. Or manually trigger deploy in Render dashboard

### Update Frontend
1. Push changes to GitHub
2. Render will automatically rebuild and deploy
3. Or manually trigger deploy in Render dashboard

---

## 💰 Upgrading to Paid Plans

For better performance, consider:

**Render Pricing:**
- **Starter Plan**: $7/month per service (always-on, no sleep)
- **Standard Plan**: $25/month (more resources)

**When to upgrade:**
- Production applications
- Need always-on availability
- Handling more than minimal traffic

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Issues**: Check browser console and Render logs

---

## 🎉 Success!

Your Online Voting System is now live! Share your frontend URL with users:
```
https://votingsys-frontend.onrender.com
```

Remember to:
- Create admin accounts using SQL
- Test all functionality in production
- Monitor logs for any issues
- Keep your environment variables secure

Happy voting! 🗳️

