# 💰 FinGlass - Personal Finance Manager

> Website pengelola keuangan pribadi dengan dashboard, analytics, dan export Excel

![Status](https://img.shields.io/badge/status-Development-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📊 Features (MVP)

### Authentication
- ✅ Sign Up / Login dengan email
- ✅ Secure password storage (Supabase Auth)
- ✅ Session management

### Dashboard
- 💰 Total balance summary
- 📈 Income vs Expense chart
- 📝 Recent transactions list
- 📅 Monthly overview

### Transactions
- ➕ Create/Edit/Delete transactions
- 🏷️ Categorize (income/expense)
- 📅 Date-based filtering
- 🔍 Search & filter

### Categories
- 📂 Manage income categories
- 📂 Manage expense categories
- 🎨 Custom icons & colors

### Analytics
- 📊 Spending by category chart
- 📉 Monthly trend analysis
- 💡 Insights & recommendations
- 📥 Export to Excel

### Budget (Phase 2)
- 💼 Set monthly budget per category
- ⚠️ Budget alerts
- 📊 Budget vs actual tracking

### Savings Goals (Phase 2)
- 🎯 Create savings goals
- 📈 Track progress
- 🏆 Achievement badges

---

## 🛠️ Tech Stack

**Frontend**
- HTML5
- Tailwind CSS (Dark Theme)
- Material Symbols
- Vanilla JavaScript

**Backend**
- Node.js
- Express.js
- Supabase SDK

**Database**
- PostgreSQL (Supabase)
- Row Level Security (RLS)
- Real-time updates

**Deployment**
- Vercel (Frontend & Backend)
- Supabase Cloud (Database)

**Export**
- ExcelJS (Excel generation)

---

## 📁 Project Structure

```
finglass-finance/
├── frontend/                 # Frontend
│   ├── dashboard.html            # Dashboard page
│   ├── transactions.html         # Transaction manager
│   ├── budget.html              # Budget tracker
│   ├── analytics.html           # Analytics & reports
│   ├── login.html               # Login/Register
│   ├── js/
│   │   └── api.js              # API client
│   └── css/
│       └── styles.css          # Custom styles
│
├── backend/                      # Backend API
│   ├── server.js               # Express app
│   ├── routes/
│   │   ├── auth.js             # Authentication
│   │   ├── transactions.js     # Transaction CRUD
│   │   ├── categories.js       # Category CRUD
│   │   ├── budgets.js         # Budget CRUD
│   │   └── reports.js         # Reports & Excel export
│   ├── middleware/
│   │   └── auth.js            # Auth middleware
│   ├── utils/
│   │   ├── database.js        # Supabase client
│   │   └── excel.js           # Excel export helper
│   ├── .env                   # Environment variables
│   ├── .gitignore            # Git ignore patterns
│   ├── package.json          # Dependencies
│   └── package-lock.json
│
├── README.md                    # File ini
├── QUICK_START.md              # Quick start guide
├── PANDUAN_LENGKAP.md          # Panduan bahasa Indonesia
├── STRUKTUR_PROJECT.md         # Project structure detail
├── GUIDE_SUPABASE.md          # Supabase setup guide
├── GUIDE_VERCEL.md            # Vercel deployment guide
├── .gitignore                  # Git ignore
└── vercel.json                 # Vercel configuration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Git
- GitHub account
- Vercel account (free)
- Supabase account (free)

### 1. Setup Supabase Database (30 min)
```bash
# Baca: GUIDE_SUPABASE.md
# Atau buka: https://supabase.com
```

### 2. Setup Backend (15 min)
```bash
cd backend
npm install
npm run dev  # Server running on http://localhost:3001
```

### 3. Setup Frontend
```bash
# Open frontend/dashboard.html in browser
# Atau setup live server di VS Code
```

### 4. Test API
```bash
# Use Postman atau Thunder Client
# Endpoint: http://localhost:3001/api/...
```

### 5. Deploy to Vercel
```bash
# Baca: GUIDE_VERCEL.md
# Setup GitHub → Connect to Vercel → Deploy!
```

---

## 📖 Documentation

| Dokumen | Untuk | Waktu |
|---------|-------|-------|
| **QUICK_START.md** | Quick overview & checklist | 5 min |
| **PANDUAN_LENGKAP.md** | Panduan lengkap bahasa Indonesia | 20 min |
| **STRUKTUR_PROJECT.md** | Database schema & architecture | 10 min |
| **GUIDE_SUPABASE.md** | Setup database step-by-step | 30 min |
| **GUIDE_VERCEL.md** | Deploy to production | 20 min |

**Mulai dari**: QUICK_START.md → GUIDE_SUPABASE.md → Setup Backend → Test → GUIDE_VERCEL.md

---

## 🔧 Environment Variables

Create `.env` file di folder `backend/`:

```env
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
```

**⚠️ IMPORTANT**: Add `.env` ke `.gitignore` - jangan commit!

---

## 🧪 Testing

### Test Backend Locally
```bash
cd backend
npm run dev

# Open another terminal
curl http://localhost:3001/api/test
```

### Test dengan Postman
1. Download Postman (free)
2. Create new request
3. Endpoint: `POST http://localhost:3001/api/auth/signup`
4. Body:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

### Test di Production
1. Deploy ke Vercel
2. Open: `https://your-domain.vercel.app`
3. Try login with test account

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup           - Register user
POST   /api/auth/login            - Login user
POST   /api/auth/logout           - Logout
GET    /api/auth/me               - Get current user
```

### Transactions
```
GET    /api/transactions          - Get all transactions
GET    /api/transactions/:id      - Get one transaction
POST   /api/transactions          - Create transaction
PUT    /api/transactions/:id      - Update transaction
DELETE /api/transactions/:id      - Delete transaction
```

### Categories
```
GET    /api/categories            - Get all categories
POST   /api/categories            - Create category
PUT    /api/categories/:id        - Update category
DELETE /api/categories/:id        - Delete category
```

### Reports
```
GET    /api/reports/monthly/:month - Get monthly report
GET    /api/reports/export        - Export to Excel
```

---

## 🔐 Security

### Implemented
- ✅ Row Level Security (RLS) di database
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Environment variables untuk sensitive data
- ✅ Password hashing (Supabase Auth)

### Best Practices
- Use HTTPS always (Vercel auto-provides)
- Validate input di backend & frontend
- Use strong passwords
- Rotate API keys regularly
- Monitor Vercel logs for security issues

---

## 🚨 Troubleshooting

### Database Connection Error
```
Baca: GUIDE_SUPABASE.md → Section "Common Issues"
```

### API Returning 401 Unauthorized
```
✓ Check if user is logged in
✓ Check if JWT token is valid
✓ Check if RLS policy allows access
```

### Deployment Failed on Vercel
```
1. Check build logs di Vercel dashboard
2. Verify .env variables are set
3. Check if package.json is valid
4. Try: npm install && npm start locally
```

---

## 📈 Roadmap

### Phase 1 (MVP - Current)
- [x] Database schema
- [x] Authentication
- [x] Transaction CRUD
- [x] Categories
- [ ] Dashboard & Analytics
- [ ] Excel export

### Phase 2
- [ ] Budget tracking
- [ ] Savings goals
- [ ] Recurring transactions
- [ ] Data visualization charts
- [ ] Mobile responsive design
- [ ] Dark/Light theme toggle

### Phase 3
- [ ] Collaborations (share account)
- [ ] API webhooks
- [ ] Mobile app (React Native)
- [ ] Invoice generation
- [ ] Tax report generator

---

## 💡 Tips & Tricks

### Development
```bash
# Watch for changes and auto-restart
npm run dev

# Test specific endpoint
curl -X GET http://localhost:3001/api/test

# View server logs
# Check VS Code console atau terminal output
```

### Debugging
- Use browser DevTools (F12)
- Check Vercel logs
- Enable detailed logging di backend
- Use Supabase dashboard untuk inspect data

### Performance
- Database indexes sudah di-setup (optimal)
- Use pagination untuk large datasets
- Cache frequently accessed data
- Monitor Vercel analytics

---

## 🤝 Contributing

Ini adalah personal project, tapi welcome feedback & suggestions!

Steps:
1. Fork repository (jika open source)
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Open Pull Request

---

## 📝 License

MIT License - Feel free to use for personal/commercial projects

---

## 📞 Contact & Support

- **Documentation**: See `docs/` folder
- **Issues**: GitHub Issues (jika ada)
- **Email**: [your-email@example.com]
- **Discord/Telegram**: [community link - optional]

---

## 🙏 Acknowledgments

- **Tailwind CSS** - CSS framework
- **Supabase** - Database & Auth
- **Vercel** - Deployment platform
- **Material Design** - Icons & color scheme

---

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [Express.js Docs](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [ExcelJS Docs](https://github.com/exceljs/exceljs)

---

**Happy coding! 🚀**

Last updated: June 2026
