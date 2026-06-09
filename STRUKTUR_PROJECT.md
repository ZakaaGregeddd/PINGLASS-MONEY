# 📁 Struktur Project FinGlass

```
PINGLASS-MONEY/
│
├── FE-Stitch/                    # Frontend Anda (existing)
│   ├── dashboard.html
│   ├── transactions.html
│   ├── budget.html
│   ├── analytics.html
│   ├── css/
│   │   └── styles.css            # Buat file ini
│   └── js/
│       └── api.js                # Buat file ini (client API)
│
├── backend/                      # Backend Node.js (buat baru)
│   ├── server.js                 # Main Express server
│   ├── routes/
│   │   ├── auth.js               # Authentication
│   │   ├── transactions.js       # Transaction CRUD
│   │   ├── categories.js         # Category CRUD
│   │   ├── budgets.js            # Budget CRUD
│   │   └── reports.js            # Reports & Excel export
│   ├── middleware/
│   │   └── auth.js               # Auth middleware
│   ├── utils/
│   │   ├── database.js           # Supabase client
│   │   └── excel.js              # Excel export helper
│   ├── .env                      # Environment variables
│   ├── .gitignore                # Exclude sensitive files
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore                    # Git config
├── PANDUAN_LENGKAP.md            # Panduan ini
└── STRUKTUR_PROJECT.md           # File ini
```

## 🎯 Target Fitur

### MVP (Minimum Viable Product)
- ✅ Authentication (Login/Register)
- ✅ Dashboard (Summary, recent transactions)
- ✅ Transactions Management (CRUD)
- ✅ Categories Management
- ✅ Analytics/Reports
- ✅ Export ke Excel

### Advanced (Phase 2)
- Real-time notifications
- Recurring transactions
- Budgeting & alerts
- Savings goals tracking
- Data visualization charts
- Mobile responsive design

## 📊 Database Schema Summary

```
auth.users (Supabase built-in)
├── id (UUID)
├── email
└── created_at

profiles
├── id (FK to auth.users)
├── email
├── full_name
└── created_at

categories
├── id
├── user_id (FK)
├── name
├── icon
├── color
├── type (income/expense)
└── created_at

transactions
├── id
├── user_id (FK)
├── category_id (FK)
├── amount
├── type (income/expense)
├── description
├── date
└── created_at

budgets
├── id
├── user_id (FK)
├── category_id (FK)
├── limit_amount
├── month
└── created_at

savings_goals
├── id
├── user_id (FK)
├── name
├── target_amount
├── current_amount
├── deadline
└── created_at
```

## 🔐 Security Notes

1. **Row Level Security (RLS)**: Enabled di database
   - Setiap user hanya bisa akses data mereka sendiri
   - Tidak perlu check di backend, DB handle langsung

2. **Environment Variables**:
   - `.env` tidak di-commit ke git
   - Sensitive keys disimpan di Vercel dashboard

3. **Authentication Flow**:
   - Frontend → Supabase Auth (Login)
   - Supabase return JWT token
   - Token disimpan di localStorage
   - Token dipakai untuk setiap request ke backend

4. **CORS**:
   - Backend allow requests dari FE domain Anda
   - Strict CORS policy untuk security

## 📦 Dependencies Explanation

```json
{
  "express": "Web framework untuk Node.js",
  "cors": "Handle Cross-Origin Requests",
  "dotenv": "Load environment variables dari .env",
  "@supabase/supabase-js": "Supabase JavaScript client",
  "exceljs": "Create Excel files dengan styling"
}
```

Dev dependencies:
```json
{
  "nodemon": "Auto-reload server saat code berubah"
}
```

## 🚀 Tahap per Tahap (Quick Reference)

1. **Supabase Setup** (30 min)
   - [ ] Sign up & create project
   - [ ] Run SQL schema
   - [ ] Setup auth
   - [ ] Copy API keys

2. **Backend Setup** (15 min)
   - [ ] npm init & install dependencies
   - [ ] Create folder structure
   - [ ] Create .env file
   - [ ] Update package.json scripts

3. **Backend Code** (45 min)
   - [ ] Create server.js
   - [ ] Create all routes
   - [ ] Create middleware
   - [ ] Test dengan Postman/Thunder Client

4. **Frontend Integration** (30 min)
   - [ ] Create api.js helper
   - [ ] Create css/styles.css
   - [ ] Add login form
   - [ ] Add JavaScript untuk fetch & display data

5. **Excel Export** (15 min)
   - [ ] Add excel generation logic
   - [ ] Add export endpoint
   - [ ] Test export functionality

6. **Deployment** (20 min)
   - [ ] Push ke GitHub
   - [ ] Connect Vercel
   - [ ] Setup env vars
   - [ ] Deploy!

**Total Estimasi: 2-3 jam untuk MVP lengkap**

## 💡 Pro Tips

1. **Test API dengan Postman** (free tool) sebelum integrate ke frontend
2. **Browser Console** untuk debug JavaScript errors
3. **Vercel dashboard** untuk monitor logs & error
4. **Git commit frequently** untuk easy rollback jika ada masalah
5. **Start dengan MVP**, tambah fitur advanced kemudian

---

Siap lanjut ke tahap berikutnya? 🎯
