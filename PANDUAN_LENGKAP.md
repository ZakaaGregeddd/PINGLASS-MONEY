# 📚 Panduan Lengkap: Website Pengelola Keuangan FinGlass

## 📋 Daftar Isi
1. [Rekomendasi Database Gratis](#database-gratis)
2. [Tech Stack yang Digunakan](#tech-stack)
3. [Tahap 1: Setup Database (Supabase)](#tahap-1-setup-database)
4. [Tahap 2: Setup Project Backend](#tahap-2-setup-project)
5. [Tahap 3: Membuat API Backend](#tahap-3-api-backend)
6. [Tahap 4: Integrasi Frontend](#tahap-4-frontend)
7. [Tahap 5: Export Excel](#tahap-5-export-excel)
8. [Tahap 6: Deploy ke Vercel](#tahap-6-deploy-vercel)

---

## 🗄️ Database Gratis: Rekomendasi {#database-gratis}

Saya merekomendasikan **SUPABASE** karena:
- ✅ PostgreSQL database gratis dengan 500MB storage
- ✅ Authentication built-in (gratis)
- ✅ Real-time database support
- ✅ REST API auto-generated
- ✅ User management terintegrasi
- ✅ Scalable untuk production
- ✅ Easy to use dashboard

### Alternatif lain (jika ingin):
- **Firebase** - Lebih simple tapi lebih mahal di production
- **MongoDB Atlas** - Free tier 512MB, cocok untuk NoSQL
- **PlanetScale** - MySQL serverless, free tier cukup
- **Neon** - PostgreSQL serverless, seperti Supabase tapi lebih barebones

**Pilihan kami: SUPABASE** ✨

---

## 🛠️ Tech Stack {#tech-stack}

```
Frontend:
├── HTML5
├── Tailwind CSS (sudah ada)
├── Material Symbols (sudah ada)
└── JavaScript Vanilla

Backend:
├── Node.js
├── Express.js
└── API REST

Database:
├── Supabase (PostgreSQL)
├── Auth (Email/Password)
└── Real-time data

Deployment:
├── Frontend/Backend → Vercel
└── Database → Supabase Cloud

Export:
└── ExcelJS library
```

---

## TAHAP 1: Setup Database (Supabase) {#tahap-1-setup-database}

### Langkah 1.1: Daftar Supabase
1. Buka https://supabase.com
2. Klik **"Sign Up"**
3. Pilih "Continue with GitHub" atau email biasa
4. Verifikasi email Anda

### Langkah 1.2: Buat Project Baru
1. Di dashboard Supabase, klik **"New Project"**
2. Nama: `finglass-finance`
3. Pilih region terdekat (e.g., `Asia Pacific (Singapore)`)
4. Buat password database (simpan password ini!)
5. Klik **"Create new project"** (tunggu 2-5 menit)

### Langkah 1.3: Setup Database Schema
1. Masuk ke project Anda
2. Buka menu **"SQL Editor"** di sidebar kiri
3. Jalankan SQL query ini untuk membuat tabel:

```sql
-- Tabel Users (otomatis via Auth, tapi kita buat custom profile)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel untuk Kategori Pengeluaran
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  type TEXT CHECK (type IN ('income', 'expense')) DEFAULT 'expense',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Tabel Transaksi
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id BIGINT REFERENCES categories(id),
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Budget
CREATE TABLE budgets (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id BIGINT REFERENCES categories(id),
  limit_amount DECIMAL(12, 2) NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, category_id, month)
);

-- Tabel Savings Goals
CREATE TABLE savings_goals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security) untuk keamanan
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Policies untuk keamanan
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own budgets"
  ON budgets FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own savings goals"
  ON savings_goals FOR ALL
  USING (auth.uid() = user_id);
```

### Langkah 1.4: Setup Authentication
1. Pergi ke **Authentication** → **Providers**
2. Pastikan **Email** sudah enabled
3. Buka tab **Settings**:
   - Cari "Redirect URLs"
   - Tambahkan:
     - `http://localhost:3000` (development)
     - `https://yourdomain.vercel.app` (production - nanti)

### Langkah 1.5: Ambil API Keys
1. Buka **Settings** → **API**
2. Copy dan simpan:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)

**Simpan keys ini dengan aman!**

---

## TAHAP 2: Setup Project Backend {#tahap-2-setup-project}

### Langkah 2.1: Setup Folder Project
Buka terminal di folder `PINGLASS-MONEY`:

```bash
# Buat folder backend
mkdir backend
cd backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors dotenv @supabase/supabase-js exceljs
npm install -D nodemon
```

### Langkah 2.2: Setup Environment Variables
Buat file `.env` di folder backend:

```
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
NODE_ENV=development
```

Ganti dengan keys dari Supabase Anda.

**⚠️ PENTING**: Jangan commit `.env` ke git! Tambahkan ke `.gitignore`

### Langkah 2.3: Setup NPM Scripts
Update `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "build": "echo \"No build step needed\""
  }
}
```

---

## TAHAP 3: Membuat API Backend {#tahap-3-api-backend}

Saya sudah siapkan semua file backend untuk Anda. Ikuti langkah berikutnya untuk membuat setiap file.

File yang akan dibuat:
- `backend/server.js` - Main server
- `backend/routes/auth.js` - Authentication
- `backend/routes/transactions.js` - Transaction management
- `backend/routes/categories.js` - Category management
- `backend/routes/reports.js` - Reports & Export Excel
- `backend/.env` - Environment variables

**Tunggu instruksi berikutnya untuk file-file ini!**

---

## TAHAP 4: Integrasi Frontend {#tahap-4-frontend}

Setelah backend siap, kita akan:
1. Membuat `js/api.js` - API helper functions
2. Membuat `css/styles.css` - Styles terpisah
3. Update semua HTML dengan JavaScript untuk fetch data
4. Tambahkan login/register functionality

---

## TAHAP 5: Export Excel {#tahap-5-export-excel}

Akan membuat endpoint untuk:
- Export laporan bulanan ke Excel
- Format dengan charts dan summary
- Download file otomatis

---

## TAHAP 6: Deploy ke Vercel {#tahap-6-deploy-vercel}

### Persiapan:
1. Push code ke GitHub
2. Connect Vercel ke GitHub
3. Setup environment variables di Vercel
4. Deploy dalam 1-2 klik!

---

## 📝 Checklist Tahapan

- [ ] Database Supabase setup ✓
- [ ] Backend folder & npm init
- [ ] Backend server.js
- [ ] API routes (auth, transactions, categories, reports)
- [ ] Frontend JS integration
- [ ] CSS styling
- [ ] Excel export functionality
- [ ] Testing local (npm run dev)
- [ ] Push ke GitHub
- [ ] Deploy ke Vercel
- [ ] Test di production

---

## 🆘 Need Help?

Saat kita mulai setiap tahap, saya akan:
1. Menjelaskan konsepnya
2. Memberikan kode siap pakai
3. Menunjukkan langkah demi langkah
4. Test bersama-sama

Mari kita mulai! 🚀
