# 🔐 Password Manager - Vaultify (مکمل جائزہ)

## پروجیکٹ کا مقصد (Project Purpose)

یہ ایک **Password Manager** ایپلیکیشن ہے جو **Next.js** کے ساتھ بنائی گئی ہے۔ اس کا نام **Vaultify** ہے۔ یہ ایپلیکیشن آپ کے تمام passwords، logins اور secure notes کو ایک محفوظ جگہ میں اسٹور کرتی ہے۔

## تکنیکی معلومات (Tech Stack)

### Frontend (سامنے والا حصہ)
- **Next.js 16.1.3** - React framework with App Router
- **React 19.2.3** - UI library
- **Tailwind CSS 4** - Styling framework
- **TypeScript** - Type safety

### Backend (پچھلے والا حصہ)
- **Express.js** - Web server (`server/index.js`)
- **Node.js** - Runtime environment
- **MongoDB** - Database (Mongoose ODM)

### Security & Authentication
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **jose** - JWT handling

### Database
- **MongoDB Atlas** - Cloud database
- **Mongoose** - Database modeling

---

## پروجیکٹ کی ساخت (Project Structure)

```
password-manager-with-nextjs/
├── src/                          # Frontend code (Next.js)
│   ├── app/
│   │   ├── page.tsx             # Home page / Overview
│   │   ├── layout.tsx           # Main layout wrapper
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── vault/               # Password vault section
│   │   │   ├── page.tsx         # Vault list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx     # Single entry detail
│   │   │   │   └── edit/        # Edit entry page
│   │   │   └── new/
│   │   │       └── page.tsx     # Create new entry
│   │   ├── settings/
│   │   │   └── page.tsx         # Settings page
│   │   └── api/                 # API routes (backend endpoints)
│   │       ├── auth/
│   │       │   ├── register/    # Sign up endpoint
│   │       │   ├── login/       # Login endpoint
│   │       │   ├── logout/      # Logout endpoint
│   │       │   └── me/          # Current user info
│   │       ├── entries/         # Password entries API
│   │       │   ├── route.ts     # Get all, create new
│   │       │   └── [id]/        # Get, update, delete single
│   │       └── health/          # Server health check
│   ├── components/              # Reusable React components
│   │   ├── AppShell.tsx        # Main app wrapper
│   │   ├── EntriesPanel.tsx    # Entries display component
│   │   ├── VaultEntriesTable.tsx # Table view
│   │   └── BackendStatus.tsx   # Backend connection status
│   ├── lib/                     # Utility functions
│   │   ├── auth.ts             # Authentication helpers (JWT)
│   │   ├── db.ts               # MongoDB connection
│   │   ├── userModel.ts        # User Mongoose schema
│   │   ├── entryModel.ts       # Password entry schema
│   │   └── password.ts         # Password utilities
│   └── proxy.ts                # API proxy configuration
│
├── server/                      # Express backend (optional/legacy)
│   ├── index.js                # Main server file
│   ├── db.js                   # Database connection
│   ├── models/
│   │   └── Entry.js            # Entry model
│   └── routes/
│       └── entries.js          # Entries routes
│
├── .env                        # Environment variables (private)
├── .env.example                # Example env template
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
└── postcss.config.mjs          # Tailwind config
```

---

## کیسے کام کرتا ہے (How It Works)

### 🔄 User Journey

#### 1️⃣ **رجسٹریشن (Registration)**
```
User → Sign Up Form → /api/auth/register 
→ Password hashed with bcryptjs 
→ User saved in MongoDB 
→ JWT token generated 
→ Cookie set 
→ Redirected to Vault
```

#### 2️⃣ **لاگ ان (Login)**
```
User → Login Form → /api/auth/login 
→ Email verified 
→ Password checked 
→ JWT token created 
→ Cookie set 
→ Access granted to vault
```

#### 3️⃣ **پاس ورڈ محفوظ کرنا (Save Password)**
```
User → Vault New Entry → Form filled 
→ /api/entries (POST) 
→ Entry saved to MongoDB 
→ Displayed in vault list
```

#### 4️⃣ **پاس ورڈ دیکھنا (View Passwords)**
```
/api/entries (GET) → All entries from DB → Displayed in table
/api/entries/[id] (GET) → Single entry details
```

#### 5️⃣ **ترمیم (Edit)**
```
User → Click Edit → /api/entries/[id] (PUT) → Updated in DB
```

#### 6️⃣ **حذف (Delete)**
```
User → Click Delete → /api/entries/[id] (DELETE) → Removed from DB
```

---

## اہم فیچرز (Key Features)

### ✅ Authentication System
- User registration with email & password
- Secure password hashing (bcryptjs)
- JWT-based authentication
- Persistent login with cookies
- Logout functionality

### ✅ Password Vault
- Store multiple password entries
- Each entry has:
  - **Title** - Website/app name
  - **Username** - Login username
  - **Password** - Encrypted password
  - **URL** - Website link
  - **Tags** - For organization
  - **Notes** - Additional info

### ✅ CRUD Operations
- **Create** - Add new password entry
- **Read** - View all entries or specific entry
- **Update** - Edit existing entry
- **Delete** - Remove entry

### ✅ Security
- Password hashing with bcryptjs (rounds: 10)
- JWT tokens for session management
- HTTPOnly cookies (not accessible via JavaScript)
- Email validation
- Unique email constraints

### ✅ User Interface
- Dark theme (Tailwind CSS)
- Responsive design (mobile-friendly)
- Clean, modern UI
- Settings page
- Vault dashboard
- Login/Register pages

---

## Environment Variables (.env)

```dotenv
MONGO_URI=mongodb+srv://...  # MongoDB connection string
JWT_SECRET=abc123...         # Secret key for JWT signing
PORT=3000                    # Server port (default 3000)
```

### کہاں سے ملے (Where to get them):
- **MONGO_URI**: MongoDB Atlas account سے
- **JWT_SECRET**: Random 32-char hex string
- **PORT**: کون سا port چاہتے ہو

---

## نقصان کی جگہ (Potential Issues & Fixes)

### ❌ Problem: 500 Error on /api/auth/register
**وجہ (Cause):** `.env` file missing یا MONGO_URI undefined
**حل (Solution):** `.env` file create کریں MONGO_URI کے ساتھ

### ❌ Problem: Database connection failed
**وجہ:** MongoDB credentials غلط ہیں
**حل:** .env میں صحیح MONGO_URI ڈالیں

### ❌ Problem: Token verification failed
**وجہ:** JWT_SECRET مختلف ہے
**حل:** پرانا اور نیا JWT_SECRET match کریں

---

## Commands چلانے کے لیے

```bash
# Development mode میں چلائیں
npm run dev

# Production کے لیے build کریں
npm build

# Production میں چلائیں
npm start

# Linting چیک کریں
npm run lint

# Backend server الگ سے چلائیں (اگر ضرورت ہو)
node server/index.js
```

---

## Database Models (ڈیٹابیس کی ساخت)

### 👤 User Model
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 🔑 Entry Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  title: String,
  username: String,
  password: String,
  url: String,
  tags: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints (ایندپوائنٹس)

### Authentication
| Method | Endpoint | مقصد |
|--------|----------|------|
| POST | `/api/auth/register` | نیا اکاؤنٹ بنائیں |
| POST | `/api/auth/login` | لاگ ان کریں |
| POST | `/api/auth/logout` | لاگ آؤٹ کریں |
| GET | `/api/auth/me` | موجودہ صارف کی معلومات |

### Entries (پاس ورڈ)
| Method | Endpoint | مقصد |
|--------|----------|------|
| GET | `/api/entries` | تمام اندراجات |
| POST | `/api/entries` | نیا اندراج بنائیں |
| GET | `/api/entries/[id]` | ایک اندراج دیکھیں |
| PUT | `/api/entries/[id]` | اندراج کو تبدیل کریں |
| DELETE | `/api/entries/[id]` | اندراج حذف کریں |

### Health
| Method | Endpoint | مقصد |
|--------|----------|------|
| GET | `/api/health` | سرور کی حالت |

---

## فائل کا مقصد (Purpose of Key Files)

| فائل | مقصد |
|------|------|
| `src/lib/auth.ts` | JWT sign/verify کریں |
| `src/lib/db.ts` | MongoDB سے جڑیں |
| `src/lib/userModel.ts` | User schema define کریں |
| `src/lib/entryModel.ts` | Entry schema define کریں |
| `src/lib/password.ts` | Password utilities |
| `server/index.js` | Express server |
| `server/db.js` | MongoDB connection (backend) |

---

## خلاصہ (Summary)

یہ **Vaultify** ایک **Full-Stack Password Manager** ہے جو:

✅ صارفین کو رجسٹر اور لاگ ان کرنے دیتا ہے
✅ محفوظ پاس ورڈ اسٹور کرتا ہے
✅ پاس ورڈ تبدیل اور حذف کر سکتے ہیں
✅ سارے پاس ورڈ MongoDB میں محفوظ رہتے ہیں
✅ JWT سے محفوظ ہے
✅ Modern UI ہے Tailwind کے ساتھ

---

**تیار ہو گیا! پروجیکٹ چلانے کے لیے `npm run dev` کریں۔** 🚀
