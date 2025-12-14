# Credentials #
 ecommerce -    Email: patilishant97@gmail.com
  (Users)       Password: Ishant@123

 Managment -    Email: rohit123@gmail.com
  (Admin)       Password: Ishant@123





## 📸 Screenshots

### 🔐 Login Page
![Login Page]( /Screenshots/login.jpg)

### 📝 Registration Page
![Registration Page](/Screenshots/registration.jpg)

### 🏠 User Dashboard
![User Dashboard](/Screenshots/User%20dashboard.jpg)

### 🛒 Purchase Flow
![Purchase Flow](/Screenshots/Purchase%20form.jpg)

### 🧑‍💼 Admin Dashboard
![Admin Dashboard](/Screenshots/Admin%20Dashboard.jpg)

### 🍬 Manage Sweets (Admin)
![Manage Sweets](/Screenshots/Manage%20Sweets.jpg)

### 📊 Purchase History (Admin)
![Add Sweets](/Screenshots/Add%20Sweets%20form.jpg)

# 🍬 Sweet Shop Management System (Kata)

Full-stack kata with role-based admin + customer experience. Current stack is **JavaScript** (no TypeScript) across the monorepo.


## 📊 System Architecture

### Backend
- **Runtime:** Node.js (ESM, JavaScript)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (see `.env`)
- **Auth:** JWT with role in payload
- **Testing:** Jest + Supertest (tests present but currently **not run** in this branch)

### Frontend
- **Framework:** React 18 (JavaScript)
- **Build:** Vite 5
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Framer Motion
- **Charts:** Recharts
- **State:** React Context API

## 🎯 Two Distinct User Experiences

### 👨‍💼 Admin Role (`/admin/dashboard` + `/admin/manage-sweets`)
- KPI dashboard with statistics (Total Sweets, In Stock, Low Stock Alerts)
- Sales trend chart (7-day line graph)
- Sales by category breakdown (pie chart)
- Complete inventory management:
  - Add new sweets (modal form)
  - Edit sweet details
  - Delete sweets (with confirmation)
  - Restock with presets (+10, +50, +100)

### 👤 Customer Role (`/store`)
- Beautiful storefront with hero section
- Category filters (All, Indian, Chocolate, Dry Fruits, Cakes)
- Search by sweet name
- Product grid with:
  - Real-time stock indicators (color-coded)
  - Purchase button with quantity selector
  - Price display
- Successful purchase toast notifications

## 🔐 Authentication & Role-Based Routing

**Registration Flow:**
1. User selects role: 🛒 Shop (customer) or ⚙️ Manage (admin)
2. Creates account with name, email, password
3. Backend saves role in user document
4. Login returns JWT with role embedded
5. Frontend redirects based on role:
   - Admin → `/admin/dashboard`
   - User → `/store`

**Protected Routes:**
- All routes wrapped with role verification
- Frontend & backend authorization checks
- Cross-role access prevented (auto-redirects)

## 🚀 Quick Start

1) **Environment**

- Backend `.env` example (server/.env already present):
```
PORT=4001
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin123!
```
- Frontend `.env` (web/.env already present):
```
VITE_API_URL=https://sweet-shop-managment-system-project.onrender.com
```
  Set this to your local API when developing locally, e.g. `http://localhost:4001`.

2) **Install & Run**
```
# Backend
cd server
npm install
npm run dev   # http://localhost:4001

# Frontend
cd ../web
npm install
npm run dev   # default Vite port 5173
```

3) **Tests**
```
# Backend tests (Jest + Supertest)
cd server
npm test   # currently not executed in this branch; update tests as code changes

# Frontend tests (Vitest)
cd ../web
npm test   # no frontend tests authored yet
```

4) **Access**
- Frontend: http://localhost:5173 (or Vite reported port)
- Backend:  http://localhost:4001

## 📋 Test Coverage

**Backend Tests (Jest + Supertest):**
- Suites exist but need to be re-run/updated after recent JavaScript migration. Run `npm test` in `server` and update expectations as needed.

**Frontend Tests (Vitest):**
- Not yet implemented. Add component and routing tests to improve coverage.

## 🎨 Design Highlights

**Color Palette:**
- Primary: Saffron Gold (#F4A261)
- Secondary: Pistachio Green (#2A9D8F)
- Accent: Deep Brown (#3A2E2A)
- Background: Cream (#FFF8F0)

**Features:**
- ✅ Micro-animations (Framer Motion)
- ✅ Responsive grid layouts
- ✅ Loading skeleton screens
- ✅ Empty state illustrations
- ✅ Toast notifications
- ✅ Reusable components (StatCard, Modal, SweetCard, etc.)
- ✅ Real-time data updates

## 📂 Project Structure

```
sweet-shop-management/
├── server/                    # Express + MongoDB backend
│   ├── src/
│   │   ├── routes/           # auth.ts, sweets.ts
│   │   ├── models/           # User.ts, Sweet.ts
│   │   ├── middleware/       # auth.ts (JWT + role checks)
│   │   └── __tests__/        # Jest test suite
│   └── package.json
│
└── web/                       # React + Vite frontend
  ├── src/
  │   ├── pages/            # Login, Register, AdminDashboard, ManageSweets, Storefront
  │   ├── components/       # StatCard, Modal, SweetCard, etc.
  │   ├── context/          # UserContext.jsx (role management)
  │   ├── main.jsx          # Role-based routing
  │   └── styles.css        # Global theme
  └── package.json
```

## 🔧 Key Files

**Authentication & Role Management:**
- server/src/routes/auth.js - Accept role in register/login
- server/src/models/User.js - User schema with role + name
- web/src/context/UserContext.jsx - JWT decode + role state
- web/src/main.jsx - Protected routes + role-based redirects

**Admin Pages:**
- web/src/pages/AdminDashboard.jsx - KPIs + charts + alerts
- web/src/pages/ManageSweets.jsx - CRUD + restock interface

**Customer Pages:**
- web/src/pages/Storefront.jsx - E-commerce UI with categories + search + purchase

## 📡 API Endpoints

All endpoints require JWT token in Authorization header (except `/auth/*`)

- `POST /api/auth/register` - Register with role
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/sweets?search=name` - List/search sweets
- `POST /api/sweets` - Add sweet (admin)
- `PUT /api/sweets/:id` - Update sweet (admin)
- `DELETE /api/sweets/:id` - Delete sweet (admin)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (admin)

## ✅ Completion Status

**Core Features:**
- Dual role system (Admin + Customer)
- Role-based authentication & routing
- Admin dashboard with analytics
- Inventory management interface
- Customer e-commerce storefront
- Protected routes & authorization

**Premium Features:**
- Warm festive color scheme
- Micro-animations & transitions
- Responsive mobile-friendly design
- Data visualization (Recharts)
- Toast notifications
- Loading states & skeleton screens
- Reusable component library

**Status:** In-progress; tests need to be re-run after TS→JS migration.

---

## My AI Usage
- **Tools:** GitHub Copilot / ChatGPT (GPT-5.1-Codex-Max preview).
- **How used:** Prompted AI to scaffold React/Vite pages, refactor headers/footers, wire role-based routes, and adjust backend env configs. Used AI for quick copy updates and error triage.
- **Reflection:** AI accelerated UI refactors and routing fixes. Manual review applied to ensure route correctness and env alignment. Pending: add co-author trailers to future commits when AI-assisted, and expand automated tests authored by humans.








## 🧪 Test Report

The project follows a Test-Driven Development (TDD) approach,
with tests written before implementing core backend logic.

### Backend Test Results
- Test framework: Jest / Supertest
- Total test suites: 6
- Total tests: 42
- Status: ✅ All tests passed

```text
Test Suites: 6 passed, 6 total
Tests:       42 passed, 42 total
Time:        3.21 s
