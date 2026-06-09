# ⚡ Quick Start Guide - 6 Langkah Sederhana

Kalau kamu impatient dan ingin langsung mulai, ikuti 6 langkah ini:

## 1️⃣ Setup Supabase (30 menit)

```bash
1. Buka https://supabase.com
2. Sign up dengan GitHub
3. Create project baru: "finglass-finance"
4. Region: Singapore (atau dekat lokasi mu)
5. Buka SQL Editor dan paste SQL dari GUIDE_SUPABASE.md
6. Jalankan query (Ctrl+Enter)
7. Copy API keys dari Settings → API
```

**Simpan di note**:
```
SUPABASE_URL = [copy dari sini]
SUPABASE_ANON_KEY = [copy dari sini]
SUPABASE_SERVICE_KEY = [copy dari sini]
```

---

## 2️⃣ Setup Backend Lokal (15 menit)

```bash
# Buka Command Prompt di folder PINGLASS-MONEY
mkdir backend
cd backend

npm init -y
npm install express cors dotenv @supabase/supabase-js exceljs
npm install -D nodemon

# Create .env file (copy dari template di GUIDE_SUPABASE.md)
```

---

## 3️⃣ Code Backend

**Tunggu instruksi file-by-file di langkah berikutnya!**

Saya akan memberikan:
- `backend/server.js`
- `backend/routes/*.js`
- `backend/middleware/*.js`
- `backend/utils/*.js`

---

## 4️⃣ Test Backend Lokal

```bash
cd backend
npm run dev

# Buka browser: http://localhost:3001
# Seharusnya keluar: {"message":"Server running!"}
```

---

## 5️⃣ Setup Frontend Integration

Buat file baru:
- `frontend/js/api.js` - API client
- `frontend/css/styles.css` - Styling

Update HTML untuk tambah login form.

---

## 6️⃣ Deploy ke Vercel

```bash
# Setup GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/finglass-finance.git
git push -u origin main

# Di Vercel dashboard: Import project dari GitHub
# Setup environment variables
# Deploy!
```

**Voila! Website live!** 🎉

---

## 📚 Panduan Lengkap (Baca sesuai kebutuhan)

| File | Untuk | Waktu |
|------|-------|-------|
| **PANDUAN_LENGKAP.md** | Overview lengkap | 20 min |
| **STRUKTUR_PROJECT.md** | Struktur & database schema | 10 min |
| **GUIDE_SUPABASE.md** | Database setup detail | 30 min |
| **GUIDE_VERCEL.md** | Deployment detail | 20 min |

---

## 🎯 Milestone Checklist

```
Week 1:
[ ] Supabase setup done
[ ] GitHub account created
[ ] Backend folder created

Week 2:
[ ] Backend server.js done
[ ] All routes done
[ ] Test dengan Postman/cURL

Week 3:
[ ] Frontend JS integration done
[ ] CSS styling done
[ ] Test locally

Week 4:
[ ] Push ke GitHub
[ ] Deploy ke Vercel
[ ] Test di production
[ ] Celebrate! 🎉
```

---

## 💡 Rekomendasi Tools

### Development
- **VS Code** - Code editor (free) ✅
- **Postman** atau **Thunder Client** - Test API (free)
- **Git** - Version control (free)

### Design
- **Figma** - UI design (free tier)
- **Tailwind CSS** - Styling (free, sudah ada)

### Productivity
- **1Password** atau **LastPass** - Save API keys (free tier)
- **Notion** - Project planning (free)

---

## 🚨 Hal yang JANGAN dilakukan

❌ Jangan commit `.env` ke GitHub (sensitive keys!)
❌ Jangan share API keys di public chat
❌ Jangan hardcode domain production di code
❌ Jangan lupa backup database (Supabase sudah auto-backup)
❌ Jangan skip security setup (RLS, CORS, validation)

---

## ✅ Hal yang HARUS dilakukan

✅ Simpan Supabase API keys di tempat aman
✅ Add `.env` ke `.gitignore`
✅ Test setiap feature sebelum deploy
✅ Use HTTPS (Vercel provide auto)
✅ Monitor Vercel logs untuk errors
✅ Regular update dependencies (`npm update`)

---

## 📞 Support

Jika stuck:

1. **Cek documentation** file yang relevan
2. **Google error message** (90% masalah sudah solved orang lain)
3. **Ask me** - saya siap bantu anytime! 🤝

---

Siap dimulai? Mari kita ke **Step 1: Supabase Setup!** 🚀

Atau langsung ke **Step 3: Code Backend** kalau Supabase sudah siap?
