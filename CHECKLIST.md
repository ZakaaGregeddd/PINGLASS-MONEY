# 📋 Checklist Lengkap - FinGlass Development

## 📖 STEP 1: Baca Dokumentasi (15 menit)

- [ ] Buka dan baca **START_HERE.md** (file ini menjelaskan semuanya)
- [ ] Buka dan baca **QUICK_START.md** (overview cepat)
- [ ] Buka **README.md** untuk understanding produk
- [ ] Bookmark **GUIDE_SUPABASE.md** untuk reference

---

## 🗄️ STEP 2: Setup Supabase Database (30 menit)

Follow langkah di **GUIDE_SUPABASE.md**:

### 2.1 Account Setup
- [ ] Buka https://supabase.com
- [ ] Sign up dengan GitHub / Email
- [ ] Verifikasi email

### 2.2 Project Creation
- [ ] Buat project baru: "finglass-finance"
- [ ] Region: Singapore (atau dekat lokasi)
- [ ] Copy dan simpan password database

### 2.3 Database Schema
- [ ] Buka SQL Editor
- [ ] Copy-paste SQL dari GUIDE_SUPABASE.md (Langkah 1.3)
- [ ] Jalankan query (Ctrl+Enter)
- [ ] Verify semua tabel ada (Table Editor)

### 2.4 Copy API Keys
- [ ] Settings → API
- [ ] Copy: **SUPABASE_URL**
- [ ] Copy: **SUPABASE_ANON_KEY**
- [ ] Copy: **SUPABASE_SERVICE_KEY**
- [ ] Simpan di file note/1password (JANGAN share!)

### 2.5 Authentication Setup
- [ ] Authentication → Providers
- [ ] Pastikan Email provider ON (biru)
- [ ] Authentication → Settings → Redirect URLs
- [ ] Tambahkan:
  ```
  http://localhost:3000
  http://localhost:3001
  https://yourname-finglass.vercel.app
  ```

### 2.6 Test Database
- [ ] SQL Editor → Select * from categories
- [ ] Seharusnya empty tapi tidak error

**Status**: ✅ Selesai? Lanjut ke Step 3

---

## 🎯 STEP 3: Backend Setup (15 menit)

Follow langkah di **GUIDE_RUNNING_BACKEND.md**:

### 3.1 Buka Terminal
- [ ] Buka Command Prompt di folder `PINGLASS-MONEY`
- [ ] Type: `cd backend`
- [ ] Press Enter

### 3.2 Install Dependencies
- [ ] Type: `npm install`
- [ ] Tunggu selesai (2-3 menit)
- [ ] Lihat folder `node_modules` dibuat

### 3.3 Create .env File
- [ ] Buka file `backend/.env.example`
- [ ] Copy semua isi
- [ ] Buat file baru: `backend/.env` (tanpa extension)
- [ ] Paste dan isi:
  ```env
  PORT=3001
  NODE_ENV=development
  SUPABASE_URL=[dari step 2.4]
  SUPABASE_ANON_KEY=[dari step 2.4]
  SUPABASE_SERVICE_KEY=[dari step 2.4]
  ```
- [ ] Save file

### 3.4 Verify Files
- [ ] Cek file di `backend/`:
  - [ ] `server.js` ada
  - [ ] `routes/auth.js` ada
  - [ ] `routes/transactions.js` ada
  - [ ] `routes/categories.js` ada
  - [ ] `routes/budgets.js` ada
  - [ ] `routes/reports.js` ada
  - [ ] `middleware/auth.js` ada
  - [ ] `utils/database.js` ada
  - [ ] `utils/excel.js` ada
  - [ ] `.env` ada (dengan API keys)

**Status**: ✅ Selesai? Lanjut ke Step 4

---

## 🚀 STEP 4: Run Backend (5 menit)

### 4.1 Start Server
- [ ] Terminal: `npm run dev`
- [ ] Tunggu output: `🚀 Server running on http://localhost:3001`
- [ ] JANGAN tutup terminal ini!

### 4.2 Test di Browser
- [ ] Buka: http://localhost:3001/api/test
- [ ] Seharusnya muncul: `{"message":"Server running!"}`
- [ ] ✅ Backend working!

### 4.3 Test API dengan Postman

#### Install Postman
- [ ] Download dari https://www.postman.com/downloads/
- [ ] Install & open

#### Test Signup
- [ ] Method: POST
- [ ] URL: http://localhost:3001/api/auth/signup
- [ ] Body (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }
  ```
- [ ] Send
- [ ] ✅ Response: 201 Created dengan user ID

#### Test Login
- [ ] Method: POST
- [ ] URL: http://localhost:3001/api/auth/login
- [ ] Body (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- [ ] Send
- [ ] ✅ Response: 200 OK dengan `accessToken`
- [ ] **COPY token ini** (perlu untuk test berikutnya)

#### Test Get Transactions (dengan Auth)
- [ ] Method: GET
- [ ] URL: http://localhost:3001/api/transactions
- [ ] Headers (add):
  - Key: `Authorization`
  - Value: `Bearer [paste token dari login]`
- [ ] Send
- [ ] ✅ Response: 200 OK dengan empty transactions []

**Status**: ✅ Selesai? Backend fully working!

---

## 🎨 STEP 5: Frontend Integration (TBD)

**Note**: Ini untuk Phase 2, nanti saya bantu step-by-step

- [ ] Update `dashboard.html` dengan JavaScript
- [ ] Add form handlers di `transactions.html`
- [ ] Add category management di `categories.html` (buat page)
- [ ] Add budget tracking di `budget.html`
- [ ] Add analytics & export di `analytics.html`
- [ ] Test semua pages

---

## 🌐 STEP 6: Deploy to Vercel (20 menit)

Follow langkah di **GUIDE_VERCEL.md**:

### 6.1 Setup Git
- [ ] Install Git: https://git-scm.com
- [ ] Terminal: `git init`
- [ ] Terminal: `git add .`
- [ ] Terminal: `git commit -m "Initial commit"`

### 6.2 Create GitHub Repo
- [ ] Buka https://github.com/new
- [ ] Name: `finglass-finance`
- [ ] Public
- [ ] Create

### 6.3 Push ke GitHub
- [ ] Terminal:
  ```bash
  git remote add origin https://github.com/YOUR-USERNAME/finglass-finance.git
  git branch -M main
  git push -u origin main
  ```

### 6.4 Connect Vercel
- [ ] Buka https://vercel.com
- [ ] Sign up with GitHub
- [ ] Import repository: `finglass-finance`
- [ ] Configure: Root Directory: `.`

### 6.5 Setup Environment Variables
- [ ] Di Vercel dashboard, add:
  - `SUPABASE_URL` = [dari step 2.4]
  - `SUPABASE_ANON_KEY` = [dari step 2.4]
  - `SUPABASE_SERVICE_KEY` = [dari step 2.4]
  - `PORT` = 3001
  - `NODE_ENV` = production

### 6.6 Deploy!
- [ ] Click "Deploy"
- [ ] Tunggu ~2-5 menit
- [ ] Selesai! URL production ready

**Status**: ✅ Website sudah live di production!

---

## 📊 Progress Tracker

```
[████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 20% - Dokumentasi

Step 1: Dokumentasi           [████████░░░░░░░░░░░░░░░░░░░] - START HERE
Step 2: Supabase Setup        [░░░░░░░░░░░░░░░░░░░░░░░░░░] - NEXT
Step 3: Backend Setup         [░░░░░░░░░░░░░░░░░░░░░░░░░░] - THEN
Step 4: Run & Test Backend    [░░░░░░░░░░░░░░░░░░░░░░░░░░] - THEN
Step 5: Frontend Integration  [░░░░░░░░░░░░░░░░░░░░░░░░░░] - PHASE 2
Step 6: Deploy to Vercel      [░░░░░░░░░░░░░░░░░░░░░░░░░░] - FINAL
```

---

## 🎯 Quick Reference: File Locations

```
PANDUAN_LENGKAP.md      ← Semua tahapan dijelaskan
QUICK_START.md          ← Ringkasan cepat
README.md               ← Project overview
GUIDE_SUPABASE.md       ← Database setup (WAJIB baca)
GUIDE_RUNNING_BACKEND.md ← Run server lokal
GUIDE_VERCEL.md         ← Deployment
START_HERE.md           ← Ini jadi entry point
CHECKLIST.md            ← File ini

backend/
  ├── server.js         ← Express app
  ├── routes/           ← API endpoints
  ├── middleware/       ← Auth middleware
  ├── utils/            ← Helpers
  ├── .env              ← CREATE INI (API keys)
  ├── package.json      ← Dependencies
  └── .env.example      ← Template

FE-Stitch/
  ├── login.html        ← New: Login page
  ├── dashboard.html    ← Update dengan JS
  ├── transactions.html ← Update dengan JS
  ├── budget.html       ← Update dengan JS
  ├── analytics.html    ← Update dengan JS
  ├── js/
  │   └── api.js        ← New: API client
  └── css/
      └── styles.css    ← New: Custom styles
```

---

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| "npm not found" | Install Node.js dari nodejs.org |
| "Port 3001 already used" | Ganti PORT di .env ke 3002 |
| "Cannot find module" | Jalankan `npm install` di backend/ |
| "SUPABASE_URL undefined" | Buat `.env` file dengan API keys |
| "401 Unauthorized" | Token sudah expired, login ulang |
| "Database error" | Check SQL query syntax di GUIDE_SUPABASE |
| "Deploy failed" | Check build logs di Vercel dashboard |

Lihat **README.md** atau **GUIDE_VERCEL.md** untuk detail.

---

## 💡 Tips & Tricks

✅ **WAJIB BACA**:
- Start dengan QUICK_START.md
- Baca GUIDE_SUPABASE.md sebelum coding
- Jangan hardcode API keys di code

✅ **BEST PRACTICES**:
- Test di lokal dulu sebelum deploy
- Commit ke Git frequently
- Save API keys di safe place (1Password/Lastpass)
- Monitor Vercel logs untuk errors

✅ **DEVELOPMENT FLOW**:
1. Code di lokal
2. Test dengan `npm run dev`
3. Test dengan Postman
4. Commit ke Git
5. Auto-deploy ke Vercel
6. Test di production

---

## 📞 Next Steps

1. **Buka START_HERE.md** untuk penjelasan detail
2. **Follow QUICK_START.md** untuk step-by-step
3. **Mulai dari Step 2: Supabase Setup**

**Estimasi waktu**: ~2 jam untuk MVP lengkap

**Questions?** Saya siap bantu setiap step! 🤝

---

**Let's build something awesome! 🚀**

Status: Ready to start
Last update: June 9, 2026
