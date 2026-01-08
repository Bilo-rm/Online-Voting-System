# 🎯 Your Deployment Information

## ✅ Backend Deployment Complete

**Backend URL:** https://online-voting-system-o9eo.onrender.com

---

## 📝 Next Steps: Deploy Frontend

### Step 1: Create Frontend Environment File

Create a file named `.env.production` in the `frontend` folder with this content:

```env
REACT_APP_API_URL=https://online-voting-system-o9eo.onrender.com/api
```

**How to create it:**

**Option A: Using Command Line**
```bash
cd frontend
echo REACT_APP_API_URL=https://online-voting-system-o9eo.onrender.com/api > .env.production
```

**Option B: Manually**
1. Open the `frontend` folder
2. Create a new file named `.env.production`
3. Add this line:
   ```
   REACT_APP_API_URL=https://online-voting-system-o9eo.onrender.com/api
   ```
4. Save the file

### Step 2: Commit Changes (if using Git)

```bash
git add .
git commit -m "Add production environment configuration"
git push
```

### Step 3: Deploy Frontend on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. **Configure:**
   - **Name**: `votingsys-frontend` (or your preferred name)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

5. **Add Environment Variable:**
   - Key: `REACT_APP_API_URL`
   - Value: `https://online-voting-system-o9eo.onrender.com/api`

6. Click **"Create Static Site"**
7. Wait for build to complete (5-10 minutes)

### Step 4: After Frontend Deploys

Once your frontend is deployed, you'll get a URL like:
`https://votingsys-frontend.onrender.com`

**Update Backend CORS:**
1. Go to your backend service in Render
2. Go to **Environment** tab
3. Add/Update variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend-url.onrender.com` (use your actual URL)
4. Save (will auto-redeploy)

---

## 🧪 Testing Your Backend

Test if your backend is working:

```bash
# Health check
curl https://online-voting-system-o9eo.onrender.com/api/health

# Should return: {"status": "healthy"}
```

Or visit in browser:
https://online-voting-system-o9eo.onrender.com/api/health

---

## 📊 Environment Variables Summary

### Backend (Already Set ✅)
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `FRONTEND_URL` (update after frontend deploys)

### Frontend (Set in Step 3 👆)
- `REACT_APP_API_URL` = `https://online-voting-system-o9eo.onrender.com/api`

---

## 🎉 Final Result

After completing all steps:
- **Backend**: https://online-voting-system-o9eo.onrender.com ✅
- **Frontend**: https://your-frontend-url.onrender.com (pending)
- **Database**: Your Supabase instance ✅

---

## 🆘 Troubleshooting

### Backend returns 404
- Make sure you're adding `/api` at the end of the URL
- Example: `https://online-voting-system-o9eo.onrender.com/api/health`

### CORS errors after frontend deployment
- Update `FRONTEND_URL` in backend environment variables
- Wait for backend to redeploy (automatic)

### Frontend build fails
- Check if `.env.production` file is created correctly
- Verify `REACT_APP_API_URL` is set in Render environment variables

---

## 📞 Need Help?

Check the detailed guide: `RENDER_DEPLOYMENT.md`

