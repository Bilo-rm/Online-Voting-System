# 🚀 Quick Deployment Checklist

Follow these steps in order to deploy your voting system to Render.

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] Supabase database is set up
- [ ] SQL schemas are applied (supabase_schema.sql & admin_schema.sql)
- [ ] You have your Supabase credentials ready

## 📝 Step-by-Step Deployment

### 1️⃣ Deploy Backend (15 minutes)

- [ ] Go to https://dashboard.render.com/
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repo
- [ ] Set **Root Directory**: `backend`
- [ ] Set **Build Command**: `pip install -r requirements.txt`
- [ ] Set **Start Command**: `gunicorn app:app`
- [ ] Add environment variables:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_KEY
  - [ ] SUPABASE_SERVICE_KEY
  - [ ] JWT_SECRET (generate using: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
  - [ ] FRONTEND_URL (leave blank for now)
- [ ] Click "Create Web Service"
- [x] **Copy Backend URL**: https://online-voting-system-o9eo.onrender.com ✅

### 2️⃣ Deploy Frontend (10 minutes)

- [ ] Create `.env.production` in frontend folder
- [ ] Add: `REACT_APP_API_URL=https://online-voting-system-o9eo.onrender.com/api`
- [ ] Push changes to GitHub (if needed)
- [ ] In Render, click "New +" → "Static Site"
- [ ] Connect your GitHub repo
- [ ] Set **Root Directory**: `frontend`
- [ ] Set **Build Command**: `npm install && npm run build`
- [ ] Set **Publish Directory**: `build`
- [ ] Add environment variable:
  - [ ] REACT_APP_API_URL (same as above)
- [ ] Click "Create Static Site"
- [ ] **Copy Frontend URL**: _______________________________

### 3️⃣ Final Configuration (5 minutes)

- [ ] Go back to Backend service in Render
- [ ] Update environment variable:
  - [ ] FRONTEND_URL = `https://YOUR-FRONTEND-URL.onrender.com`
- [ ] Save changes (auto-redeploys)

### 4️⃣ Test Your Deployment (5 minutes)

- [ ] Visit your frontend URL
- [ ] Create a test account
- [ ] Login successfully
- [ ] Test voting (if elections exist)
- [ ] Check results page

### 5️⃣ Create Admin User

- [ ] Go to Supabase SQL Editor
- [ ] Run: 
  ```sql
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
  WHERE email = 'your-email@example.com';
  ```
- [ ] Logout and login again
- [ ] Verify admin panel access

## 🎉 Deployment Complete!

Your app is now live at:
- **Frontend**: https://YOUR-FRONTEND-URL.onrender.com
- **Backend**: https://YOUR-BACKEND-URL.onrender.com

## 📚 Full Documentation

See `RENDER_DEPLOYMENT.md` for detailed instructions and troubleshooting.

## ⚠️ Important Reminders

- Free tier backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid plan ($7/month) for production use
- Keep your environment variables secure (never commit to Git)

## 🆘 Need Help?

Check the troubleshooting section in `RENDER_DEPLOYMENT.md`

