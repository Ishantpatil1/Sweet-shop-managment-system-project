# 🍬 Sweet Shop Management System - Complete Implementation

A **professional full-stack TDD Kata** with role-based architecture featuring an **Admin Management Dashboard** and **Customer E-commerce Storefront**.

## 📊 System Architecture

### Backend
- **Runtime:** Node.js + TypeScript (CommonJS)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT with role in payload
- **Testing:** Jest + Supertest (all tests passing ✅)

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite
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

1. **Setup Environment:**
```bash
# Backend
cd server
echo "MONGODB_URI=mongodb://localhost:27017/sweet-shop" > .env
echo "JWT_SECRET=dev_secret" >> .env
echo "DEFAULT_ADMIN_EMAIL=admin@example.com" >> .env
echo "DEFAULT_ADMIN_PASSWORD=Admin123!" >> .env

# Frontend (uses backend auto-detection)
cd ../web
```

2. **Install & Run:**
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev          # Runs on port 4000

# Terminal 2: Frontend
cd web
npm install
npm run dev          # Runs on port 5174
```

3. **Run Tests:**
```bash
cd server
npm test             # All 5 tests passing ✅
```

4. **Access Application:**
- Frontend: http://localhost:5174
- Backend API: http://localhost:4000

## 📋 Test Coverage

**Backend Tests (Jest + Supertest):**
- ✅ POST /api/auth/register - User registration with role
- ✅ POST /api/auth/login - JWT generation with role
- ✅ GET /api/sweets?search= - Search/filter sweets
- ✅ PUT /api/sweets/:id - Update sweet (admin only)
- ✅ DELETE /api/sweets/:id - Delete sweet (admin only)

**All tests passing** - TDD approach verified

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
    │   ├── context/          # UserContext.tsx (role management)
    │   ├── main.tsx          # Role-based routing
    │   └── styles.css        # Global theme
    └── package.json
```

## 🔧 Key Files

**Authentication & Role Management:**
- [server/src/routes/auth.ts](server/src/routes/auth.ts) - Accept role in register
- [server/src/models/User.ts](server/src/models/User.ts) - User schema with role + name
- [web/src/context/UserContext.tsx](web/src/context/UserContext.tsx) - JWT decode + role state
- [web/src/main.tsx](web/src/main.tsx) - Protected routes + role-based redirects

**Admin Pages:**
- [web/src/pages/AdminDashboard.tsx](web/src/pages/AdminDashboard.tsx) - KPIs + charts + alerts
- [web/src/pages/ManageSweets.tsx](web/src/pages/ManageSweets.tsx) - CRUD + restock interface

**Customer Pages:**
- [web/src/pages/Storefront.tsx](web/src/pages/Storefront.tsx) - E-commerce UI with categories + search + purchase

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
- ✅ Full TDD backend (5 tests passing)
- ✅ Dual role system (Admin + Customer)
- ✅ Role-based authentication & routing
- ✅ Admin dashboard with analytics
- ✅ Inventory management interface
- ✅ Customer e-commerce storefront
- ✅ Protected routes & authorization

**Premium Features:**
- ✅ Warm festive color scheme
- ✅ Micro-animations & transitions
- ✅ Responsive mobile-friendly design
- ✅ Data visualization (Recharts)
- ✅ Toast notifications
- ✅ Loading states & skeleton screens
- ✅ Reusable component library

**Status: 🚀 PRODUCTION-READY**

---

## My AI Usage
- Tools: GitHub Copilot (this assistant), ChatGPT
- How: Used AI to scaffold monorepo, boilerplate for Express routes, Mongoose models, initial Jest/Vitest setup, and React pages/components. I then added validation, role checks, and refined tests.
- Reflection: AI accelerated setup and repetitive code generation, letting me focus on domain logic, TDD cycles, and UX. I ensured transparency by co-authoring commits where AI assistance was used.
