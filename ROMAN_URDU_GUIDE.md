# Password Manager Project - Roman Urdu Main Complete Guide

## Pehle Samajhiye - Yeh Project Kya Hai?

Yeh ek **Password Manager** application hai. Iska matlab: aap apne sab passwords ek secure jagah mein store kar sakte ho. Jaise bank ka vault hota hai - waise hi yeh ek digital vault hai jisme aap passwords, usernames, aur sensitive information rakhte ho.

**Naam:** Vaultify (Valt = Vault, ify = banao)

---

# 🗂️ Har File Ka Maqsad - Detailed Explanation

## 1️⃣ package.json

**Kya hai:** Yeh file aapke project ke liye "ingredient list" jaise hai.

**Ismein kya likha hota hai:**
- Project ka naam: "password-manager"
- Version: "0.1.0"
- Scripts: Kaunsi commands chal sakti hain (`npm run dev`, `npm build`)
- Dependencies: Kaun se libraries chahiye

**Kaam:**
```
npm install → package.json dekha → sab libraries download kiye
npm run dev → "next dev" command chalai → development server start
npm build → project ko production ke liye tayyar kiya
```

**Is mein likhe important packages:**
- `next` - React framework (bada powerful)
- `react` - Frontend banane ke liye
- `mongoose` - MongoDB ke liye
- `bcryptjs` - Passwords ko encrypt karne ke liye
- `jsonwebtoken` - JWT tokens banane ke liye

---

## 2️⃣ .env (Environment Variables)

**Kya hai:** Yeh file mein secret information hoti hai jaise:
- Database ka password
- Secret keys
- Port number

**Ismein kya hai:**
```
MONGO_URI = mongodb+srv://... → Database ka address (jisse DB se connect ho saken)
JWT_SECRET = 6e3b02... → Ek secret key (jisse tokens ko secure banate hain)
PORT = 3000 → Server kis port par chalega
```

**Kyun zaroori hai:**
- Database connect karna padta hai
- Tokens ko sign karna padta hai
- Production aur development mein alag-alag values ho sakti hain

⚠️ **IMPORTANT:** Yeh file KBHI git mein push mat karo! Isme sensitive data hota hai.

---

## 3️⃣ tsconfig.json

**Kya hai:** TypeScript ka configuration file.

**Ismein likha hota hai:**
- Kaunse TypeScript features use karenge
- `"strict": true` → Strict type checking
- `"paths": {"@/*": ["./src/*"]}` → @ se src folder ko access kar sakte hain

**Kaam:**
TypeScript code ko JavaScript mein convert karta hai taake browser samajh sake.

---

## 4️⃣ next.config.ts

**Kya hai:** Next.js ka configuration file.

**Ismein likha hota hai:**
- React compiler settings
- Build optimization
- API routes configuration

**Kaam:**
Next.js ko batata hai ke project ko kaise chalana hai.

---

## 5️⃣ postcss.config.mjs

**Kya hai:** CSS processing ke liye configuration.

**Ismein likha hota hai:**
- Tailwind CSS settings
- CSS transformation rules

**Kaam:**
Tailwind CSS ko styling handle karne mein madad karta hai.

---

# 📁 Main Folders - Har Folder Mein Kya Hai

## SRC FOLDER (Source Code - Main Code)

### src/app/page.tsx

**Kya hai:** Yeh home page hai - jab user website khol de to pehle yeh dikhai deta hai.

**Ismein kya hota hai:**
```
Header dikha de (Logo, Menu, Sign in button)
↓
Welcome message dikha de
↓
Product features batao
↓
Sign up / Sign in ke liye button do
```

**Kaam:**
- Landing page create karta hai
- User ko welcome karta hai
- Buttons deta hai login/signup ke liye

---

### src/app/layout.tsx

**Kya hai:** Yeh master template hai - sab pages ke liye.

**Ismein likha hota hai:**
- Global CSS (sab jagah apply hone wali styling)
- Metadata (page ka title, description)
- Header/Footer (agar sab mein same ho)

**Kaam:**
- Sab pages ko same look deta hai
- Global styling apply karta hai
- Font, theme settings handle karta hai

---

### src/app/globals.css

**Kya hai:** Global styling file.

**Ismein likha hota hai:**
```css
* {
  padding: 0;
  margin: 0;
}

body {
  background: black;
  color: white;
}
```

**Kaam:**
- Pura page ka look set karta hai
- Tailwind CSS classes define karta hai
- Dark theme (black background, white text)

---

### src/app/login/page.tsx

**Kya hai:** Login page - user yaha se account mein ghus ta hai.

**Ismein likha hota hai:**
```
Email field (textbox)
↓
Password field (password box)
↓
Login button
↓
"Sign up" link (agar account nahi hai to)
```

**Kaam:**
- User se email aur password leta hai
- Form submit karta hai `/api/auth/login` ko
- Agar sahi ho to dashboard dikha de
- Agar galat ho to error dikha de

---

### src/app/vault/page.tsx

**Kya hai:** Main vault page - yaha sab passwords dikha hote hain.

**Ismein likha hota hai:**
```
Sab saved passwords ka list
↓
Search bar (password dhoondhne ke liye)
↓
Tags/Categories (filter karne ke liye)
↓
"Add new entry" button
```

**Kaam:**
- `/api/entries` se sab passwords fetch karta hai
- Table mein dikha deta hai
- Edit aur Delete options deta hai

---

### src/app/vault/[id]/page.tsx

**Kya hai:** Ek password ka detail page - jab user kisi password par click karey.

**Ismein likha hota hai:**
```
Title dekho
↓
Username dekho
↓
Password dekho (masked hote hain)
↓
URL dekho
↓
Edit aur Delete buttons
```

**Kaam:**
- `/api/entries/[id]` se ek entry fetch karta hai
- Details dikha deta hai
- Edit ke liye redirect karta hai

---

### src/app/vault/new/page.tsx

**Kya hai:** Naya password add karne ka form.

**Ismein likha hota hai:**
```
Title input
↓
Username input
↓
Password input
↓
URL input
↓
Tags input
↓
Notes (memo)
↓
Save button
```

**Kaam:**
- User se information leta hai
- `/api/entries` POST request bhejta hai
- Database mein save hota hai

---

### src/app/vault/[id]/edit/page.tsx

**Kya hai:** Pehle se likha hua password edit karne ka page.

**Ismein likha hota hai:**
```
Pehle likhi gayi information load karo
↓
Form dikha do (sab fields editable)
↓
Update aur Delete buttons
```

**Kaam:**
- `/api/entries/[id]` se pehli information fetch karta hai
- User ko edit karne deta hai
- PUT request bhejta hai update ke liye

---

### src/app/settings/page.tsx

**Kya hai:** Settings page - user apni preferences badal sakte hain.

**Ismein likha hota hai:**
```
Account settings
↓
Security settings
↓
Notification preferences
```

**Kaam:**
- User ka profile dekha deta hai
- Password change karne ke liye option
- Logout button

---

## API Routes (Backend Endpoints)

### src/app/api/auth/register/route.ts

**Kya hai:** Naya account banane ka endpoint.

**Step by step kya hota hai:**
```
1. User email aur password bhejta hai
2. Email pehle se exist karti hai check karo
3. Agar exist karti hai → Error: "Email already in use"
4. Agar nahi → Password ko bcryptjs se hash karo (encrypt karo)
5. User ko database mein save karo
6. JWT token generate karo
7. Token ko cookie mein store karo
8. Response mein email return karo
```

**Code mein:**
```javascript
POST /api/auth/register
Body: { email: "user@example.com", password: "123456" }
Response: { email: "user@example.com" }
Cookie: pm_token = (JWT token)
```

---

### src/app/api/auth/login/route.ts

**Kya hai:** Account mein log in karne ka endpoint.

**Step by step:**
```
1. User email aur password bhejta hai
2. Email se user database mein dhundo
3. Agar user nahi mila → Error: "Invalid credentials"
4. Password ko check karo (bcryptjs se compare karo)
5. Agar galat → Error: "Invalid credentials"
6. Agar sahi → JWT token generate karo
7. Token ko cookie mein store karo
8. Response mein user data return karo
```

**Code mein:**
```javascript
POST /api/auth/login
Body: { email: "user@example.com", password: "123456" }
Response: { email: "user@example.com" }
Cookie: pm_token = (JWT token)
```

---

### src/app/api/auth/logout/route.ts

**Kya hai:** Account se log out karne ka endpoint.

**Step by step:**
```
1. Cookie se token clear karo
2. Response success dedo
```

**Code mein:**
```javascript
POST /api/auth/logout
Response: { message: "Logged out" }
Cookie: pm_token = (deleted)
```

---

### src/app/api/auth/me/route.ts

**Kya hai:** Currently logged in user ki information deta hai.

**Step by step:**
```
1. Cookie se JWT token nikalo
2. Token ko verify karo
3. Token mein se userId nikalo
4. Database mein user dhundo
5. User data return karo
```

**Code mein:**
```javascript
GET /api/auth/me
Response: { email: "user@example.com", userId: "12345" }
```

---

### src/app/api/entries/route.ts

**Kya hai:** Sab passwords ke liye endpoint (GET - list karne ke liye, POST - naya add karne ke liye).

**GET Request (list dekho):**
```
1. JWT token verify karo
2. Current user ki userId nikalo
3. Database se sab entries fetch karo (jo is user ke hain)
4. Array mein return karo
```

**POST Request (naya add karo):**
```
1. JWT token verify karo
2. User se title, username, password, url, tags, notes lo
3. Entry object banao: { userId, title, username, password, url, tags, notes }
4. Database mein save karo
5. Response mein saved entry return karo
```

**Code mein:**
```javascript
GET /api/entries
Response: [
  { _id: "1", title: "Facebook", username: "xyz", ... },
  { _id: "2", title: "Gmail", username: "abc", ... }
]

POST /api/entries
Body: { title: "Instagram", username: "myusername", password: "123456", ... }
Response: { _id: "3", title: "Instagram", ... }
```

---

### src/app/api/entries/[id]/route.ts

**Kya hai:** Ek specific password ke liye endpoint (GET - detail dekho, PUT - update karo, DELETE - delete karo).

**GET Request (detail dekho):**
```
1. JWT token verify karo
2. URL se [id] nikalo
3. Database se us entry ko dhundo
4. Entry return karo
```

**PUT Request (update karo):**
```
1. JWT token verify karo
2. URL se [id] nikalo
3. Naye fields le lo (title, username, password, etc.)
4. Database mein entry update karo
5. Updated entry return karo
```

**DELETE Request (delete karo):**
```
1. JWT token verify karo
2. URL se [id] nikalo
3. Database se entry delete karo
4. Success message return karo
```

**Code mein:**
```javascript
GET /api/entries/1
Response: { _id: "1", title: "Facebook", username: "xyz", ... }

PUT /api/entries/1
Body: { title: "Facebook Updated", password: "newpass" }
Response: { _id: "1", title: "Facebook Updated", ... }

DELETE /api/entries/1
Response: { message: "Entry deleted" }
```

---

### src/app/api/health/route.ts

**Kya hai:** Server ke health check ka endpoint.

**Kaam:**
```
Server se sirf request aao
↓
Response: { status: "ok" }
↓
Iska matlab server chalra hai
```

**Code mein:**
```javascript
GET /api/health
Response: { status: "ok" }
```

---

## Library Functions (Utilities)

### src/lib/auth.ts

**Kya hai:** JWT tokens handle karne ke liye functions.

**Functions:**
```
1. signToken(data) - Token banao
   Input: { userId: "123", email: "user@example.com" }
   Output: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

2. verifyToken(token) - Token check karo
   Input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   Output: { userId: "123", email: "user@example.com" }
   Ya Error: "Invalid token"
```

**Kaam:**
- Login/Register ke time token banata hai
- API calls ke time token verify karta hai
- Agar token valid nahi → Access deny

---

### src/lib/db.ts

**Kya hai:** MongoDB se connect karne ke liye function.

**Kaam:**
```
1. .env mein se MONGO_URI nikalo
2. MongoDB se connect karo
3. Connection cache mein store karo (taake har baar reconnect na karna pade)
4. Connection return karo
```

**Code mein:**
```javascript
await connectDb()
→ MongoDB se connect hota hai
→ User, Entry collections ready ho jaati hain
```

---

### src/lib/userModel.ts

**Kya hai:** User ka database schema.

**Ismein likha hota hai:**
```javascript
User {
  _id: ObjectId (unique ID)
  email: String (unique, lowercase) → "user@example.com"
  passwordHash: String → "bcrypt encrypted password"
  timestamps: true → createdAt, updatedAt automatically set
}
```

**Kaam:**
- Database mein user ka structure define karta hai
- Email unique hona chahiye (do user same email nahi rakh sakte)
- Password ka original nahi, hash likha hota hai

---

### src/lib/entryModel.ts

**Kya hai:** Password entry ka database schema.

**Ismein likha hota hai:**
```javascript
Entry {
  _id: ObjectId (unique ID)
  userId: ObjectId (kis user ka entry hai)
  title: String → "Facebook"
  username: String → "myusername"
  password: String → "mypassword"
  url: String → "https://facebook.com"
  tags: [String] → ["social", "important"]
  notes: String → "Account for games"
  timestamps: true → createdAt, updatedAt
}
```

**Kaam:**
- Database mein entry ka structure define karta hai
- Entry aur User ko connect karta hai (userId se)
- Sab important fields store karta hai

---

### src/lib/password.ts

**Kya hai:** Password utilities.

**Functions:**
```
1. generatePassword() - Random strong password banao
   Output: "aB3$xYz9@mK"

2. checkPasswordStrength(password) - Password kitna strong hai check karo
   Input: "abc123"
   Output: { score: 2, feedback: "Add uppercase, numbers" }

3. encryptPassword(password) - Password encrypt karo
   Input: "mypassword"
   Output: "encrypted..."

4. decryptPassword(encrypted) - Password decrypt karo
   Input: "encrypted..."
   Output: "mypassword"
```

**Kaam:**
- Password security handle karta hai
- Strong password suggest karta hai
- Password store/retrieve karta hai

---

## Components (Reusable UI Parts)

### src/components/AppShell.tsx

**Kya hai:** Pura app ka wrapper - layout provide karta hai.

**Ismein likha hota hai:**
```
Header (Top bar with menu)
├── Logo
├── Navigation (Vault, Settings, etc.)
└── User Profile

Sidebar (Left mein)
├── Menu items
├── Quick links
└── Logout button

Main Content Area
└── Pages change hote hain yaha

Footer (Bottom)
```

**Kaam:**
- Consistent layout sab pages ke liye
- Navigation handle karta hai
- User profile menu deta hai

---

### src/components/EntriesPanel.tsx

**Kya hai:** Passwords ke liye panel component.

**Ismein likha hota hai:**
```
Entries ki list
├── Each entry as card
├── Title likha ho
├── Tags dikha do
└── Quick action buttons (Edit, Delete)
```

**Kaam:**
- Entries ko card format mein dikha deta hai
- User ko entries easily browse karne deta hai
- Click karne par detail page jaata hai

---

### src/components/VaultEntriesTable.tsx

**Kya hai:** Entries ko table format mein dikha ta hai.

**Ismein likha hota hai:**
```
┌──────────────────────────────────────┐
│ Title    │ Username │ URL    │ Edit │
├──────────────────────────────────────┤
│ Facebook │ myuser   │ fb.com │ ✎   │
│ Gmail    │ myemail  │ gm.com │ ✎   │
└──────────────────────────────────────┘
```

**Kaam:**
- Entries ko structured table format mein show karta hai
- Sorting aur filtering ke liye columns
- Edit/Delete action buttons

---

### src/components/BackendStatus.tsx

**Kya hai:** Backend server ke status ko show karta hai.

**Ismein likha hota hai:**
```
Server Status: ✅ Online
Last Check: 2 minutes ago
Response Time: 45ms
```

**Kaam:**
- `/api/health` call karta hai
- Green dot agr server on hai
- Red dot agar server off hai
- User ko batata hai server chalra hai ya nahi

---

## SERVER Folder (Backend - Express)

### server/index.js

**Kya hai:** Express server (alternative backend).

**Ismein likha hota hai:**
```javascript
1. Express app create karo
2. CORS enable karo (taake frontend call kar sake)
3. JSON parsing enable karo
4. /api/health endpoint set karo
5. /api/entries routes set karo
6. PORT 4000 par server start karo
7. MongoDB se connect karo
```

**Kaam:**
- Separate backend server chalata hai
- Agar Next.js API routes use na karne hon
- Express ke sath traditional setup

---

### server/db.js

**Kya hai:** MongoDB connection (backend ke liye).

**Ismein likha hota hai:**
```javascript
function connectDb(mongoUri) {
  return mongoose.connect(mongoUri)
}
```

**Kaam:**
- MongoDB se connect karta hai
- Collections ready karta hai
- Error handling

---

### server/models/Entry.js

**Kya hai:** Mongoose model for Entry (backend).

**Ismein likha hota hai:**
```javascript
Entry {
  userId: ObjectId
  title: String
  username: String
  password: String
  url: String
  tags: [String]
  notes: String
}
```

**Kaam:**
- Backend mein entry structure define karta hai
- Database operations help karta hai

---

### server/routes/entries.js

**Kya hai:** Entries ke liye API routes (backend).

**Routes:**
```
GET /api/entries → Sab entries return karo
POST /api/entries → Naya entry create karo
GET /api/entries/:id → Ek entry return karo
PUT /api/entries/:id → Entry update karo
DELETE /api/entries/:id → Entry delete karo
```

**Kaam:**
- Backend API endpoints define karta hai
- Database operations handle karta hai

---

# 🔄 Pura Flow - Start Se End Tak

## Scenario: Naya User Register Hona

```
1. User "https://vaultify.com" par jaata hai
   ↓ (Home page load hota hai)

2. "Sign Up" button par click karta hai
   ↓

3. "Register" page khul jaata hai
   ↓ (src/app/login/page.tsx load hota hai)

4. Email aur password fill karta hai
   ↓

5. "Register" button par click karta hai
   ↓

6. POST request jaati hai: /api/auth/register
   ↓ (src/app/api/auth/register/route.ts)

7. Backend mein:
   - Email check karta hai (pehle se exist to nahi)
   - Password ko bcryptjs se encrypt karta hai
   - User ko database mein save karta hai
   - JWT token generate karta hai
   ↓

8. Response mein cookie mein token store hota hai
   ↓

9. User ko automatically /vault page par redirect karta hai
   ↓

10. Done! User register ho gaya! ✅
```

---

## Scenario: Password Save Karna

```
1. User /vault/new page jaata hai
   ↓

2. Form fill karta hai:
   - Title: "Facebook"
   - Username: "myusername"
   - Password: "mypassword123"
   - URL: "https://facebook.com"
   ↓

3. "Save" button par click karta hai
   ↓

4. POST request jaati hai: /api/entries
   ↓ (src/app/api/entries/route.ts)

5. Backend mein:
   - JWT token verify hota hai
   - User ID nikalta hai
   - Entry object banata hai
   - Database mein save karta hai
   ↓

6. Response mein entry ka ID return hota hai
   ↓

7. User ko /vault page par redirect karta hai (list dekh sakte hain)
   ↓

8. Done! Password save ho gaya! ✅
```

---

## Scenario: Password Edit Karna

```
1. User /vault page par apne entries ki list dekh ta hai
   ↓

2. "Facebook" entry par click karta hai
   ↓

3. /vault/[id] page khul jaata hai (detail page)
   ↓

4. "Edit" button par click karta hai
   ↓

5. /vault/[id]/edit page khul jaata hai
   ↓ (form filled nikalta hai)

6. Password change karta hai (new password: "mynewpassword123")
   ↓

7. "Update" button par click karta hai
   ↓

8. PUT request jaati hai: /api/entries/[id]
   ↓ (src/app/api/entries/[id]/route.ts)

9. Backend mein:
   - JWT token verify hota hai
   - Entry ID se entry find karta hai
   - New data se update karta hai
   ↓

10. Response mein updated entry return hota hai
    ↓

11. Done! Password update ho gaya! ✅
```

---

# 🔐 Security - Kaunse Features Hain?

## 1. Password Hashing (Passwords Ko Encrypt Karna)

```
User ka password: "mypassword123"
        ↓
bcryptjs (encryption)
        ↓
Database mein likha: "$2a$10$5f3e9c2b1a6d8f4e7c9a1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
        ↓
Original password kabhi database mein nahi save hota!
```

**Benefit:** Agar database hack ho jaey to passwords safe hain.

---

## 2. JWT Tokens (Session Management)

```
User login karta hai
        ↓
JWT token generate hota hai: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        ↓
Token ko cookie mein store karta hai (httpOnly = JavaScript access nahi kar sakta)
        ↓
Har API call mein token bhejta hai
        ↓
Backend verify karta hai: "Yeh token valid hai? Sahi user hai?"
```

**Benefit:** Fake requests block hote hain.

---

## 3. Email Validation (Same Email Do Bar Register Na Ho Sake)

```
User email: "user@example.com"
        ↓
Database check: "Yeh email pehle se hai?"
        ↓
Agar hai: Error - "Email already in use"
        ↓
Agar nahi: Registration allowed
```

**Benefit:** Same email se ek hi account ban sakta hai.

---

## 4. HTTPOnly Cookies (Token Secure)

```
Token cookie mein likha: httpOnly: true
        ↓
Matlab JavaScript se access nahi kar sakte (XSS attack safe)
        ↓
Sirf browser hi automatic bhejta hai requests mein
```

**Benefit:** Token ko steal nahi kar sakte JavaScript mein.

---

## 5. CORS (Cross-Origin Security)

```
Frontend domain: "https://vaultify.com"
Backend domain: "https://api.vaultify.com"
        ↓
CORS check karta hai
        ↓
Allowed domains se requests allow hote hain
        ↓
Unauthorized domains se requests block hote hain
```

**Benefit:** Sirf allowed websites hi backend ko call kar sakte hain.

---

# ⚡ Important Commands

```bash
# 1. Dependencies install karo
npm install

# 2. Development server start karo (port 3000)
npm run dev

# 3. Production ke liye build karo
npm build

# 4. Production server start karo
npm start

# 5. Code check karo (linting)
npm run lint

# 6. Specific file build karo
npm build -- src/app/api/auth/register/route.ts
```

---

# 🎯 Summary - Pura Project Ek Nazar Mein

```
┌─────────────────────────────────────────────────────┐
│           PASSWORD MANAGER (VAULTIFY)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FRONTEND (Next.js + React + Tailwind)             │
│  ├─ Login Page (src/app/login/page.tsx)            │
│  ├─ Vault Page (src/app/vault/page.tsx)            │
│  ├─ New Entry (src/app/vault/new/page.tsx)         │
│  ├─ Edit Entry (src/app/vault/[id]/edit/page.tsx) │
│  └─ Settings (src/app/settings/page.tsx)           │
│                                                     │
│  API ROUTES (Next.js API)                          │
│  ├─ Auth: Register, Login, Logout, Me             │
│  ├─ Entries: GET, POST, PUT, DELETE               │
│  └─ Health: Server status check                    │
│                                                     │
│  UTILITIES (Helpers)                               │
│  ├─ JWT Token handling (auth.ts)                   │
│  ├─ Database connection (db.ts)                    │
│  ├─ User model (userModel.ts)                      │
│  ├─ Entry model (entryModel.ts)                    │
│  └─ Password utilities (password.ts)               │
│                                                     │
│  DATABASE (MongoDB)                                │
│  ├─ Users collection                               │
│  └─ Entries collection                             │
│                                                     │
│  OPTIONAL: BACKEND (Express)                       │
│  └─ server/index.js (Alternative backend)          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**Bas! Pura project samjh gaya! Ab aap kisi bhi file ko dekh sakte ho aur samjh sakta ho ke woh kya kar rha hai! 🚀**

Is project mein:
✅ Users register aur login kar sakte hain
✅ Passwords securely save kar sakte hain
✅ Edit aur delete kar sakte hain
✅ Token-based secure authentication
✅ MongoDB mein sab data save hota hai
✅ Beautiful UI with Tailwind CSS
✅ TypeScript se type safety

Koi question ho to pucho! 😊
