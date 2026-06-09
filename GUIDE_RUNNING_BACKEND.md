# 🚀 Cara Menjalankan Backend FinGlass

## Prerequisites

Sebelum mulai, pastikan:
- ✅ Node.js v16+ sudah installed (download dari https://nodejs.org)
- ✅ Supabase database sudah setup (lihat GUIDE_SUPABASE.md)
- ✅ API keys sudah dicopy

## Step 1: Setup Backend (First Time Only)

### 1.1 Buka Terminal
```bash
# Navigasi ke folder backend
cd d:\User\Documents\PINGLASS-MONEY\backend
```

### 1.2 Install Dependencies
```bash
npm install
```

Tunggu sampai selesai (akan download ~200MB). Anda akan melihat folder `node_modules` dibuat.

### 1.3 Setup Environment File
1. **Buka file** `backend/.env.example`
2. **Copy isi semuanya**
3. **Buat file baru** `backend/.env` (tanpa extension)
4. **Paste dan isi values**:

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (copy dari Supabase dashboard)
SUPABASE_SERVICE_KEY=eyJhbGc... (copy dari Supabase dashboard)
```

**Simpan file!**

---

## Step 2: Run Backend (Every Time)

### Cara 1: Development Mode (Recommended)
```bash
# Di folder backend, jalankan:
npm run dev

# Output:
# 🚀 Server running on http://localhost:3001
# 📚 API Documentation:
#    - POST   /api/auth/signup
#    - POST   /api/auth/login
#    - GET    /api/transactions
#    ...
```

Server akan **auto-reload** setiap kali ada perubahan file (karena nodemon).

### Cara 2: Production Mode
```bash
npm start

# Output sama seperti di atas
# Tapi tidak auto-reload (perlu manual restart)
```

---

## Step 3: Test Server (Verify It Works)

### Test 1: Browser
1. **Buka browser**
2. **Pergi ke**: http://localhost:3001/api/test
3. **Seharusnya keluar**: `{"message":"Server running!"}`

### Test 2: Gunakan Postman/Thunder Client

#### Download Tool:
- **Postman** (recommend): https://www.postman.com/downloads/
- **Thunder Client** (VS Code extension): Di VS Code → Extensions

#### Test SignUp:
1. **Create new request**
2. **Method**: POST
3. **URL**: http://localhost:3001/api/auth/signup
4. **Body (JSON)**:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User"
}
```
5. **Send** → Seharusnya response success dengan user ID

#### Test Login:
1. **Create new request**
2. **Method**: POST
3. **URL**: http://localhost:3001/api/auth/login
4. **Body (JSON)**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
5. **Send** → Seharusnya return access token

**Simpan token ini! Anda perlu untuk test endpoint lain.**

#### Test Transactions (Dengan Auth):
1. **Create new request**
2. **Method**: GET
3. **URL**: http://localhost:3001/api/transactions
4. **Headers** (tambah):
   - **Key**: Authorization
   - **Value**: Bearer [paste token dari login step sebelumnya]
5. **Send** → Seharusnya return array transactions (kosong jika belum ada)

---

## 🐛 Troubleshooting

### Error: "npm: command not found"
**Solusi**: Node.js belum installed
```bash
# Check versi
node --version
npm --version

# Jika error, download dari https://nodejs.org
```

### Error: "Cannot find module '@supabase/supabase-js'"
**Solusi**: Dependencies belum install
```bash
npm install
```

### Error: "Port 3001 already in use"
**Solusi**: Port 3001 sudah dipakai program lain
```bash
# Ganti PORT di .env file
PORT=3002

# Atau kill program yang pakai port 3001
# Di Windows: taskkill /F /IM node.exe
# Di Mac: lsof -ti:3001 | xargs kill -9
```

### Error: "SUPABASE_URL is undefined"
**Solusi**: .env file belum dibuat atau values kosong
```bash
# Pastikan file .env ada di folder backend
# Isi SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
```

### Error: "Invalid or expired token"
**Solusi**: Token lama atau salah
- Login ulang untuk dapat token baru
- Copy token baru untuk request berikutnya

---

## 📊 Monitoring Backend

### Lihat Request Logs
Setiap request akan print di terminal:
```
[2024-01-15T10:30:45.123Z] POST /api/auth/signup
[2024-01-15T10:30:46.456Z] GET /api/transactions
```

### Lihat Error
Jika ada error di code, akan muncul di terminal dengan warna merah:
```
Error: something went wrong
```

---

## 🛑 Stop Backend

1. **Pergi ke terminal yang running server**
2. **Press Ctrl+C**
3. **Confirm**: y (yes)

Server akan stop.

---

## 📝 Struktur Backend

```
backend/
├── server.js                # Main app
├── routes/
│   ├── auth.js             # Login/SignUp
│   ├── transactions.js     # CRUD transaksi
│   ├── categories.js       # CRUD kategori
│   ├── budgets.js         # CRUD budget
│   └── reports.js         # Report & Excel export
├── middleware/
│   └── auth.js            # Auth check
├── utils/
│   ├── database.js        # Supabase client
│   └── excel.js           # Excel generator
├── .env                   # Environment (CREATE INI!)
├── .env.example          # Template
├── .gitignore           # Git settings
├── package.json         # Dependencies
└── node_modules/        # Installed packages (auto created)
```

---

## 🚀 Next Steps

Setelah backend running:
1. **Test semua endpoints** menggunakan Postman
2. **Create frontend files** (login form, dashboard)
3. **Integrate frontend** dengan backend API
4. **Test end-to-end**
5. **Deploy to Vercel**

---

## 💡 Tips

- **Auto-reload**: Gunakan `npm run dev` agar otomatis reload saat code berubah
- **Save responses**: Di Postman, save collection untuk reuse nanti
- **Use environment vars**: Jangan hardcode sensitive data
- **Check logs**: Setiap error ada di terminal, baca messagenya

---

Siap? Jalankan `npm run dev` dan mulai! 🚀
