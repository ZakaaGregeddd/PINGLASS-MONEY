# 🚀 Panduan Detail: Deploy ke Vercel

## Overview: Apa itu Vercel?

**Vercel** adalah platform deployment yang dibuat oleh creators of Next.js. Perfect untuk:
- ✅ Static sites (HTML/CSS/JS)
- ✅ Node.js backends
- ✅ Serverless functions
- ✅ FREE tier untuk personal projects
- ✅ Auto-scaling (tidak perlu worry tentang traffic)
- ✅ Auto HTTPS (SSL certificate gratis)

**Alternative**: Heroku, Railway, Render (tapi Vercel paling simple)

---

## Step 1: Setup GitHub Repository

### 1.1: Install Git (jika belum)

1. **Download git** dari https://git-scm.com/download/win
2. **Install dengan default settings**
3. **Test di terminal**:
   ```bash
   git --version
   ```
   Harusnya keluar versi (e.g., "git version 2.40.0")

### 1.2: Create GitHub Account (jika belum)

1. **Buka https://github.com/signup**
2. **Fill form** (username, email, password)
3. **Verify email**
4. **Done!**

### 1.3: Create GitHub Repository

1. **Buka https://github.com/new**
2. **Isi form**:
   ```
   Repository name: finglass-finance (atau nama lain)
   Description: Personal Finance Manager
   Public/Private: Public (untuk Vercel free tier)
   Add .gitignore: Node
   ```
3. **Klik "Create repository"**
4. **Copy SSH/HTTPS URL** (kita butuh ini nanti)

### 1.4: Setup Git di Local Folder

Buka **Command Prompt/PowerShell** di folder `PINGLASS-MONEY`:

```bash
# Initialize git
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/finglass-finance.git

# Create main branch
git branch -M main

# Add all files
git add .

# Commit
git commit -m "Initial commit: Frontend & Backend setup"

# Push ke GitHub (pertama kali)
git push -u origin main
```

**Note**: Ganti `YOUR-USERNAME` dengan username GitHub Anda!

---

## Step 2: Siapkan Folder Untuk Vercel

Vercel butuh struktur yang bisa di-deploy. Kita punya 2 pilihan:

### Option A: Full Stack (Recommended)
Frontend + Backend di repository yang sama, deploy keduanya ke Vercel.

**Folder struktur**:
```
finglass-finance/
├── frontend/           (dari FE-Stitch)
│   ├── index.html
│   ├── dashboard.html
│   └── ...
├── backend/            (dari folder backend)
│   ├── server.js
│   ├── routes/
│   └── ...
├── vercel.json        (Buat file ini)
├── .gitignore
└── package.json       (main project)
```

**vercel.json** (buat file ini di root):
```json
{
  "buildCommand": "npm install",
  "outputDirectory": "frontend",
  "public": true,
  "redirects": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-domain.vercel.app/api/:path*"
    }
  ]
}
```

### Option B: Separate Deployments
Frontend ke Vercel static hosting, Backend ke Vercel serverless.

**Recommended untuk project kecil: Option A** ✅

---

## Step 3: Buat vercel.json di Root

Kalau pilih Option A, buat file ini:

**`vercel.json`** (di folder root):
```json
{
  "version": 2,
  "public": false,
  "buildCommand": "npm install",
  "functions": {
    "backend/server.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"]
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1",
      "methods": ["GET", "HEAD"]
    }
  ]
}
```

---

## Step 4: Vercel Account & Connect GitHub

### 4.1: Daftar Vercel

1. **Buka https://vercel.com/signup**
2. **Klik "Continue with GitHub"**
3. **Authorize Vercel to access GitHub**
4. **Done!**

### 4.2: Import Project ke Vercel

1. **Di Vercel dashboard, klik "Add New"**
2. **Klik "Project"**
3. **Klik "Import Git Repository"**
4. **Search repository**: finglass-finance
5. **Klik "Import"**

### 4.3: Configure Project

Di halaman configuration:
1. **Framework Preset**: Pilih "Other"
2. **Build Command**: `npm install`
3. **Output Directory**: `frontend`
4. **Root Directory**: `.` (default)
5. **Environment Variables**: (lihat langkah berikutnya)

---

## Step 5: Setup Environment Variables di Vercel

1. **Di halaman configuration, cari "Environment Variables"**
2. **Tambahkan variables** (dari .env backend Anda):
   ```
   PORT=3001
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_KEY=eyJhbGc...
   NODE_ENV=production
   ```

**⚠️ PENTING**: Jangan hardcode keys! Isi di sini via Vercel dashboard.

3. **Klik "Deploy"**

---

## Step 6: Monitor Deployment

Setelah klik "Deploy":

1. **Vercel akan build project** (~2-5 menit)
2. **Monitor progress** di dashboard
3. **Lihat logs** untuk debugging jika ada error
4. **Selesai?** Klik "Visit"

---

## Step 7: Update Frontend URLs

Setelah backend deployed, update `.env` atau config di frontend:

**Sebelum** (development):
```javascript
const API_URL = "http://localhost:3001";
```

**Sesudah** (production):
```javascript
const API_URL = "https://finglass-finance.vercel.app/api";
```

Atau better, gunakan `.env.local`:
```
VITE_API_URL=https://finglass-finance.vercel.app/api
```

---

## Step 8: Custom Domain (Optional)

1. **Di Vercel dashboard, klik project**
2. **Buka Settings → Domains**
3. **Add custom domain** (e.g., finglass.finance)
4. **Update DNS records** di domain registrar
5. **Wait 24 hours** untuk propagate

---

## 🔍 Common Deployment Issues

### Issue: "Build failed"
**Debug**:
1. Lihat build logs di Vercel dashboard
2. Cek apakah `npm install` berjalan dengan baik
3. Pastikan `.env` variables ada

**Solusi**:
```bash
# Local test
npm install
npm run build
npm start
```

### Issue: "Cannot find module"
**Solusi**:
- Pastikan `package.json` ada
- Pastikan semua dependencies di `package.json`
- Jalankan `npm install` lagi

### Issue: "Function Timeout"
**Solusi**:
- Vercel function timeout default: 60 detik
- Optimize database queries
- Add timeout handling di code

### Issue: "Environment variables undefined"
**Solusi**:
- Pastikan sudah set di Vercel dashboard
- Redeploy setelah set variables
- Use console.log untuk debug (lihat di logs)

---

## 📝 Checklist: Sebelum Deploy

- [ ] Git repository sudah public
- [ ] `backend/server.js` berfungsi (test local dengan `npm run dev`)
- [ ] `frontend/` folder ada dengan semua HTML
- [ ] `.env` file ada dengan benar di gitignore
- [ ] Database schema sudah dibuat di Supabase
- [ ] API keys sudah di copy dengan benar
- [ ] `vercel.json` sudah di root
- [ ] `package.json` sudah ada dengan dependencies
- [ ] Tested locally dengan: `npm run dev`

---

## 🎓 Workflow setelah Deploy

### Development Loop:
```
1. Edit code locally
2. Test dengan npm run dev (localhost:3001)
3. git add . && git commit -m "message"
4. git push (automatic deploy ke Vercel!)
5. Test di production (https://your-domain.vercel.app)
```

### Vercel Auto-Deploy:
- Setiap `git push` ke `main` branch
- Vercel automatic build & deploy
- No need untuk manual deploy!

---

## 🚀 Setelah Deployed

1. **Share domain** ke temanmu
2. **Monitor performance** di Vercel Analytics
3. **Setup monitoring/alerts** untuk errors
4. **Plan upgrade** jika traffic meningkat

---

## Estimasi Timeline

| Tahap | Waktu |
|-------|-------|
| Setup GitHub | 10 min |
| Setup Vercel account | 5 min |
| Connect & deploy | 10 min |
| Fix issues (jika ada) | 10-30 min |
| **Total** | **35-55 min** |

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Docs**: https://docs.github.com
- **Community**: vercel.com/help

Siap lanjut? 🚀
