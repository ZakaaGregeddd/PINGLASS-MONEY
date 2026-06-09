# 🔧 Panduan Detail: Supabase Setup

## Step-by-Step: Membuat Database Supabase

### Langkah 1: Daftar & Buat Project

1. **Buka https://supabase.com**
2. **Klik "Sign Up"** di sudut kanan atas
3. **Pilih metode login**:
   - Recommended: GitHub (paling mudah)
   - Atau: Email + Password
4. **Verifikasi email** (cek inbox atau spam folder)

### Langkah 2: Buat Project Baru

1. **Di dashboard, klik "New Project"** atau "Create Project"
2. **Isi form**:
   ```
   Project Name: finglass-finance
   Password: [SIMPAN PASSWORD INI!] (minimal 12 karakter)
   Region: Asia Pacific (Singapore) [atau pilih terdekat]
   ```
3. **Klik "Create new project"**
4. **Tunggu 2-5 menit** hingga project selesai dibuat

### Langkah 3: Copy API Keys

Setelah project jadi, pergi ke **Settings** → **API**:

1. **Cari "Project Settings"** di sidebar
2. Buka tab **"API"**
3. **Copy dan simpan di file note**:
   ```
   Project URL: https://[your-project-ref].supabase.co
   anon public: eyJhbGc... [long string]
   service_role (admin): eyJhbGc... [berbeda dari anon]
   ```

**File `.env` backend Anda akan:**
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (anon public key)
SUPABASE_SERVICE_KEY=eyJhbGc... (service_role key)
```

### Langkah 4: Buat Database Schema

1. **Di sidebar, klik "SQL Editor"**
2. **Klik "New Query"** (atau "+" icon)
3. **Copy-paste SQL schema dari PANDUAN_LENGKAP.md** (bagian TAHAP 1.3)
4. **Klik "Run"** atau tekan `Ctrl+Enter`
5. **Tunggu sebentar, harus sukses tanpa error**

Jika ada error, lihat error messagenya dan perbaiki (biasanya syntax error).

### Langkah 5: Setup Authentication

1. **Di sidebar, klik "Authentication"**
2. **Buka tab "Providers"**
3. **Pastikan "Email" provider sudah ON** (warna biru)

#### Konfigurasi Email Provider:
1. **Klik "Email"** untuk expand
2. **Biarkan default settings**, hanya pastikan:
   - **"Enable Email Provider"** = ON
   - **"Confirm Email"** = OFF (untuk development, optional)

#### Setup Redirect URLs:
1. **Kembali ke Authentication menu**
2. **Buka tab "Settings"**
3. **Cari "Redirect URLs"**
4. **Tambahkan URL ini** (satu per baris):
   ```
   http://localhost:3000
   http://localhost:3001
   https://yourdomain.vercel.app
   ```
   
   *Note: `yourdomain` ganti dengan nama Vercel project Anda nanti*

### Langkah 6: Verify Database Structure

1. **Di sidebar, klik "Table Editor"**
2. **Anda seharusnya lihat tabel**:
   - `profiles`
   - `categories`
   - `transactions`
   - `budgets`
   - `savings_goals`

Klik setiap tabel untuk verify column names benar.

### Langkah 7: Test Connection (Optional tapi recommended)

Kita akan test nanti saat backend jadi, tapi untuk sekarang:

1. **Pergi ke SQL Editor**
2. **Buat query test**:
   ```sql
   SELECT * FROM categories LIMIT 5;
   ```
3. **Klik Run** - seharusnya empty tapi tidak error

---

## 🔐 Understanding Supabase Keys

### Anon Public Key
- **Digunakan di**: Frontend (public, aman)
- **Untuk**: Fetch data, authenticate users
- **Batasan**: Hanya bisa akses public data atau data milik user tersebut (RLS)
- **Aman di**: localStorage, localStorage, atau bahkan dihardcode

### Service Role Key
- **Digunakan di**: Backend only
- **Untuk**: Admin operations, bypass RLS
- **Batasan**: Powerful, jangan expose ke frontend!
- **Jangan di**: localStorage, frontend, atau public repo
- **Simpan di**: Environment variable backend saja

### User JWT Token
- **Dari**: Supabase Auth setelah login
- **Digunakan di**: Frontend untuk authenticate requests
- **Lifetime**: Short-lived (1 hour biasanya)
- **Simpan di**: localStorage atau sessionStorage

---

## 🧪 Test Supabase Dari Dashboard

### Test Insert Data:

1. **Buka Table Editor**
2. **Klik tabel "categories"**
3. **Klik "Insert row"**
4. **Isi form** (tanpa mengisi user_id, karena belum ada user):
   - name: "Makan"
   - icon: "🍔"
   - color: "#FF6B6B"
   - type: "expense"
5. **Klik "Save"**

Berhasil? Bagus! Database sudah siap.

---

## ⚠️ Common Issues & Solutions

### Issue: "Project creation failed"
**Solusi**: 
- Refresh halaman
- Coba buat project dengan nama berbeda
- Cek internet connection

### Issue: "SQL Error: syntax error"
**Solusi**:
- Copy-paste SQL lagi, pastikan lengkap
- Jalankan query per-table satu-satu (bukan semuanya sekaligus)

### Issue: "Cannot find API keys"
**Solusi**:
- Pergi ke Settings → API (bukan sidebar menu API)
- Project harus sudah fully initialized (tunggu 5 min)

### Issue: "Error: No rows returned" saat test
**Solusi**:
- Normal! Belum ada data di database
- Akan ada data saat user create transactions nanti

---

## 🎓 Struktur SQL Explanation

Setiap tabel dirancang seperti ini:

```sql
-- Transaksi (income/expense)
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,           -- Unique ID
  user_id UUID REFERENCES auth.users, -- User pemilik
  category_id BIGINT REFERENCES,      -- Link ke kategori
  amount DECIMAL(12, 2),              -- Rp dengan 2 decimal
  type TEXT CHECK (...),              -- 'income' atau 'expense'
  description TEXT,                   -- Catatan transaksi
  date DATE,                          -- Tanggal
  created_at TIMESTAMP DEFAULT NOW()  -- Auto-filled waktu buat
);
```

### RLS (Row Level Security)

```sql
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);  -- Hanya bisa lihat punya sendiri
```

Ini berarti: Database sudah protect data, user A tidak bisa lihat data user B. Aman!

---

## 📊 Database Relationships

```
auth.users (dari Supabase)
    ↓
profiles (user profile data)
    ↓
categories (expense/income categories)
    ↓ 
transactions (transaksi keuangan)

budgets (monthly spending limit)
    ↓
categories

savings_goals (target saving user)
```

---

## Siap ke Tahap Berikutnya? ✅

Setelah Supabase setup, save API keys Anda di file aman (notepad/1Password), kemudian kita lanjut ke **backend setup**!

Lanjut? 🚀
