# ESTHER — Pharmacy Management System: Full Project Notes

---

## WHAT THIS PROJECT IS

A **Pharmacy Management System** frontend built in React (Vite).
You own two modules:
- **Medicines** — CRUD for medicines
- **Inventory** — stock tracking, movements, dashboard, alerts

You do NOT own: Auth (Diane), Dashboard overview (Chantal), Sales/Purchases (Kelia).

---

## TECH STACK

| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| Tailwind CSS v4 | Styling |
| Axios | API calls |
| React Router DOM v7 | Routing |
| Zustand | Global state |
| React Hook Form + Zod | Forms + validation |
| Recharts | Stock bar chart |
| React Hot Toast | Notifications |
| Lucide React | Icons |

---

## FOLDER STRUCTURE

```
src/
├── app/
│   ├── layouts/AppLayout.jsx         ← Sidebar + topbar + outlet
│   ├── routes/ProtectedRoute.jsx     ← Redirects to /login if not auth
│   ├── routes/GuestRoute.jsx         ← Redirects to /dashboard if auth
│   └── AppRouter.jsx                 ← All routes defined here
│
├── features/
│   ├── auth/
│   │   ├── pages/LoginPage.jsx
│   │   ├── pages/ProfilePage.jsx
│   │   ├── pages/UserManagementPage.jsx
│   │   ├── services/auth.service.js
│   │   ├── store/authStore.js
│   │   └── utils/schemas.js
│   │
│   ├── medicines/
│   │   ├── components/MedicineTable.jsx
│   │   ├── components/MedicineForm.jsx
│   │   ├── components/MedicineCard.jsx
│   │   ├── components/MedicineFilters.jsx
│   │   ├── hooks/useMedicines.js
│   │   ├── hooks/useMedicineForm.js
│   │   ├── services/medicines.service.js
│   │   ├── store/medicineStore.js
│   │   ├── utils/medicine.utils.js
│   │   └── MedicinesPage.jsx
│   │
│   └── inventory/
│       ├── components/InventoryTable.jsx
│       ├── components/StockMovementForm.jsx
│       ├── components/LowStockAlert.jsx
│       ├── components/ExpiryAlert.jsx
│       ├── components/StockChart.jsx
│       ├── hooks/useInventory.js
│       ├── hooks/useStockMovement.js
│       ├── services/inventory.service.js
│       ├── store/inventoryStore.js
│       ├── utils/inventory.utils.js
│       ├── InventoryPage.jsx
│       └── InventoryDashboard.jsx
│
└── shared/
    ├── components/
    │   ├── AlertDrawer.jsx            ← Bell icon + side drawer for alerts
    │   ├── Badge.jsx
    │   ├── Button.jsx                 ← variants: primary, secondary, danger, ghost
    │   ├── ConfirmDialog.jsx
    │   ├── EmptyState.jsx
    │   ├── Input.jsx
    │   ├── Modal.jsx
    │   ├── Pagination.jsx
    │   ├── SearchBar.jsx              ← has built-in debounce (400ms)
    │   ├── Select.jsx
    │   ├── Spinner.jsx
    │   ├── Table.jsx                  ← sortable columns + loading skeleton
    │   └── ThemeToggle.jsx
    ├── constants/
    │   ├── api.constants.js           ← all API route strings
    │   └── status.constants.js        ← MEDICINE_UNITS, STOCK_STATUS etc.
    ├── hooks/
    │   ├── useDebounce.js
    │   ├── usePagination.js
    │   └── useTheme.js
    ├── services/
    │   └── api.js                     ← main axios instance (token + refresh)
    └── utils/
        ├── formatDate.js
        └── formatCurrency.js
```

---

## GIT BRANCHES

| Branch | Purpose | Status |
|---|---|---|
| `main` | Production-ready merged code | ✅ Stable |
| `integration-test` | Active integration work | ✅ Current branch |
| `feature/inventory-management` | Inventory feature work | ✅ Merged to main |
| `feature/api-integration` | axios + vite alias work | ✅ Pushed |
| `feature/authentication` | Login/auth API alignment | ✅ Merged into integration-test |

---

## API CONFIGURATION

### Environment Variable
```
VITE_API_URL=http://localhost:5000/api   ← in .env file
```

### Main Axios Instance — `src/shared/services/api.js`
- Base URL: `http://localhost:5000/api`
- Attaches `token` from `localStorage` to every request
- On **401**: calls `/auth/refresh`, gets new token, retries failed request
- On **refresh failure**: clears token, redirects to `/login`
- Uses `withCredentials: true` (sends cookies)

### Secondary Instance
- `axiosInstance.js` was deleted — all services now use `api.js`

---

## API ROUTES (api.constants.js)

```js
MEDICINES:         '/medicines'
INVENTORY:         '/inventory'
INVENTORY_SUMMARY: '/inventory/summary'
STOCK_MOVEMENT:    '/inventory/stock-movement'
TRANSACTIONS:      '/inventory/transactions'
CATEGORIES:        '/categories'
SUPPLIERS:         '/suppliers'
```

---

## AUTH FLOW — LOGIN & SIGNUP BY ROLE

---

### THERE IS NO PUBLIC SIGNUP

This system has **no self-registration page**. Users cannot sign up themselves.
Only an **Owner** can create new accounts via the User Management page (`/users`).

---

### HOW A NEW USER IS CREATED (Owner only)

```
Owner logs in → goes to /users → clicks "Add User"
    ↓
Fills in: Full Name, Email, Password, Role (owner | pharmacist), Phone
    ↓
POST /api/users
{
  name: "Jane Doe",
  email: "jane@pharmacy.com",
  password: "password123",
  role: "pharmacist"   ← or "owner"
  phone: "+250 788 000 000"  ← optional
}
    ↓
Backend creates the user account
    ↓
New user can now log in at /login with their email + password
```

**Role options when creating:**
| Role | Value sent to API | Access level |
|---|---|---|
| Pharmacist | `"pharmacist"` | All pages except /users |
| Owner | `"owner"` | All pages including /users |

---

### LOGIN FLOW (same for both roles)

```
User visits any protected route (e.g. /dashboard)
    ↓
ProtectedRoute checks isAuthenticated (Zustand store)
    ↓ not authenticated
Redirected to /login
    ↓
User fills email + password → form validated by Zod (loginSchema)
    ↓
POST /api/auth/login  →  { email, password }
    ↓
Backend returns:
{
  data: {
    accessToken: "eyJ...",
    user: { _id, name, email, role, isActive, ... }
  }
}
    ↓
authStore.login() saves:
  - accessToken → localStorage (key: "accessToken")
  - user object → Zustand state
  - isAuthenticated: true
    ↓
navigate('/dashboard')  ← both roles land here
```

---

### AFTER LOGIN — ROLE-BASED ACCESS

```
ProtectedRoute (no allowedRoles) — both owner and pharmacist can access:
  /dashboard, /medicines, /inventory, /inventory/dashboard
  /pos, /sales, /purchases, /purchases/new
  /reports/sales, /reports/inventory, /reports/profit-loss, /reports/purchases
  /profile

ProtectedRoute (allowedRoles: ["owner"]) — owner only:
  /users  ← UserManagementPage
        ↓ if pharmacist tries to visit /users
  Redirected to /dashboard
```

---

### SESSION REHYDRATION (page refresh)

```
User refreshes browser
    ↓
AppRouter mounts → useEffect runs:
  if (localStorage.getItem('accessToken')) fetchProfile()
    ↓
GET /api/auth/me  →  returns current user object
    ↓
authStore sets: user, isAuthenticated: true
    ↓
User stays logged in, no redirect to /login

If token is invalid/expired:
    ↓
fetchProfile catches the error
    ↓
Clears localStorage + sets isAuthenticated: false
    ↓
Redirected to /login
```

---

### LOGOUT

```
User clicks logout
    ↓
POST /api/auth/logout  (fire and forget — errors ignored)
    ↓
localStorage.removeItem('accessToken')
    ↓
Zustand: user = null, isAuthenticated = false
    ↓
GuestRoute redirects to /login
```

---

### TOKEN REFRESH (auto, on 401)

```
Any API call returns 401 Unauthorized
    ↓
api.js interceptor catches it
    ↓
POST /api/auth/refresh  (using raw axios, NOT api — prevents recursive loop)
    ↓
Backend returns new accessToken
    ↓
Saved to localStorage + all queued failed requests are retried

If refresh also fails:
    ↓
Clear localStorage → redirect to /login
```

---

### Token Storage
- Key: `accessToken` in localStorage
- All requests: `Authorization: Bearer <token>`
- Refresh endpoint: `POST /api/auth/refresh`
- Profile endpoint: `GET /api/auth/me`

---

## MEDICINES MODULE

### What it does
- Lists all medicines with search + filter (category, supplier, status)
- Add / Edit / Delete via modals
- CSV export
- Pagination (10 per page)

### Data Flow
```
MedicinesPage
  → useMedicines() hook
    → medicineStore (Zustand)
      → medicinesService.getAll(params)
        → GET /api/medicines?search=&category=&supplier=&page=1&limit=10
```

### Form Fields (MedicineForm + useMedicineForm Zod schema)
- name *(required)*
- genericName
- description
- category *(required, dropdown from GET /categories)*
- supplier *(dropdown from GET /suppliers)*
- unit *(tablet | capsule | syrup | injection | cream | drops | other)*
- purchasePrice *(required)*
- sellingPrice *(required)*
- reorderLevel *(default: 10)*
- expiryDate
- status *(active | inactive)*

### medicineStore actions
| Action | What it does |
|---|---|
| `fetchMedicines(page)` | GET medicines with current filters |
| `addMedicine(data)` | POST /medicines → refetch |
| `updateMedicine(id, data)` | PUT /medicines/:id → refetch |
| `deleteMedicine(id)` | DELETE /medicines/:id → refetch |
| `setFilters(obj)` | Updates filter state |

---

## INVENTORY MODULE

### What it does
- **InventoryPage** — full inventory list with search/filter
- **InventoryDashboard** — summary cards, bar chart, low stock table, expiry table
- **StockMovementForm** — record stock in/out/adjustment
- **AlertDrawer** — bell icon in navbar showing live alert count

### Data Flow
```
InventoryDashboard
  → inventoryStore.fetchInventory()     → GET /api/inventory
  → inventoryStore.fetchSummary()       → GET /api/inventory/summary
  → medicinesService.getLowStock()      → GET /api/medicines/low-stock
  → medicinesService.getExpiring()      → GET /api/medicines/expiring
```

### inventoryStore actions
| Action | What it does |
|---|---|
| `fetchInventory(params)` | GET /inventory with filters |
| `fetchSummary()` | GET /inventory/summary |
| `fetchAlerts()` | GET low-stock + expiring |
| `fetchTransactions(params)` | GET /inventory/transactions |
| `recordStockMovement(data)` | POST /inventory/stock-movement |

### Summary Cards (InventoryDashboard)
Reads from `summary` object returned by `/inventory/summary`:
- `summary.totalMedicines`
- `summary.totalStockValue`
- `summary.lowStockCount`
- `summary.expiringCount`
- `summary.expiredCount`
- `summary.outOfStockCount`

### Stock Status Badges
| Status | Color |
|---|---|
| In Stock | Cyan |
| Low Stock | Amber/Orange |
| Out of Stock | Red |
| Expired | Dark Red (crimson) |

---

## USER MANAGEMENT MODULE

### What it does
- Owner-only page (`/users`)
- Table: Name, Email, Role, Status, Last Login, Actions
- Add User / Edit User / Delete User
- Activate / Deactivate toggle

### Backend shape expected
```json
POST /users
{
  "name": "Jane Doe",
  "email": "jane@pharmacy.com",
  "password": "Password1",
  "role": "Pharmacist"
}
```
- `name` = single full name field (NOT firstName/lastName)
- `role` = `"Owner"` or `"Pharmacist"` (capitalized)

### fetchUsers response shape expected
```json
{
  "data": {
    "users": [...],
    "pagination": { "page": 1, "pages": 3, "total": 25 }
  }
}
```

---

## KNOWN ISSUES & WHAT'S BROKEN

### 1. ❌ /api/suppliers returns 404
- `GET /api/suppliers` is called by `useMedicines` on load
- **Backend does not have this route built yet**
- Frontend silently fails (`.catch(() => {})`) — app doesn't crash, supplier dropdown is empty
- Fix: Backend team needs to create `GET /api/suppliers`

### 2. ❌ /api/categories returns 404
- Same situation as suppliers
- Frontend silently fails — category dropdown is empty
- Fix: Backend team needs to create `GET /api/categories`

---

## WHAT NEEDS TO BE BUILT ON BACKEND

| Endpoint | Used by | Priority |
|---|---|---|
| `GET /api/suppliers` | MedicinesPage filter + MedicineForm dropdown | 🔴 High |
| `GET /api/categories` | MedicinesPage filter + MedicineForm dropdown | 🔴 High |
| `GET /api/medicines/low-stock` | InventoryDashboard + AlertDrawer | 🟡 Medium |
| `GET /api/medicines/expiring` | InventoryDashboard + AlertDrawer | 🟡 Medium |
| `GET /api/inventory/summary` | InventoryDashboard summary cards | 🟡 Medium |

---

## WHAT'S FULLY WORKING ✅

- Login page (email + password, toast errors, branded UI)
- Protected routes (redirect to /login if not authenticated)
- Guest routes (redirect to /dashboard if already logged in)
- Session rehydration on page refresh (fetchProfile called on app mount)
- MedicinesPage layout (table, filters, modals, pagination, CSV export)
- InventoryPage layout (table, search, filter, pagination)
- InventoryDashboard layout (cards, chart, alert tables)
- StockMovementForm (stock in/out/adjustment with validation)
- AlertDrawer in navbar (bell icon, side drawer, low stock + expiry)
- ProfilePage (edit name/phone, change password — uses `name` single field)
- UserManagementPage (table, add/edit/delete, activate/deactivate)
- All shared components (Button, Input, Modal, Table, Badge, Pagination, etc.)
- Axios interceptor with token refresh queue (raw axios used for refresh — no loop)
- ThemeToggle (light/dark)
- formatCurrency (RWF)
- QueryClientProvider (react-query works app-wide)
- POS page (medicine search, cart, checkout, receipt)
- Sales list page (table, filters, summary cards, export CSV)
- axiosInstance.js removed — all services use main api.js

---

## ROUTES MAP

| Path | Component | Protected | Role |
|---|---|---|---|
| `/login` | LoginPage | Guest only | — |
| `/dashboard` | Placeholder | ✅ | All |
| `/medicines` | MedicinesPage | ✅ | All |
| `/inventory/dashboard` | InventoryDashboard | ✅ | All |
| `/inventory` | InventoryPage | ✅ | All |
| `/sales` | Placeholder | ✅ | All |
| `/reports` | Placeholder | ✅ | All |
| `/profile` | ProfilePage | ✅ | All |
| `/users` | UserManagementPage | ✅ | Owner only |

---

## QUICK FIX CHECKLIST

1. **Ask backend team for `GET /api/suppliers` and `GET /api/categories`** — dropdowns are empty without them
2. **Ask backend team for `GET /api/medicines/low-stock`, `/expiring`, `/inventory/summary`** — dashboard cards show empty

---

## ENVIRONMENT

```bash
# .env
VITE_API_URL=http://localhost:5000/api

# Run dev server
npm run dev

# Build
npm run build
```

---

*Last updated: integration-test branch*
