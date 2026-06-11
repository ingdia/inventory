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
    │   ├── api.js                     ← main axios instance (token + refresh)
    │   └── axiosInstance.js           ← secondary axios (created during integration test)
    └── utils/
        ├── formatDate.js
        └── formatCurrency.js
```

---

## GIT BRANCHES

| Branch | Purpose | Status |
|---|---|---|
| `main` | Production-ready merged code | ✅ Stable |
| `feature/inventory-management` | Your main feature work | ✅ Merged to main |
| `feature/api-integration` | axios + vite alias work | ✅ Pushed, not merged |
| `feature/authentication` | Login/auth API alignment | ✅ Pushed, not merged |

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

### Secondary Instance — `src/shared/services/axiosInstance.js`
- Created during integration testing
- Also reads `token` from localStorage
- On 401: clears localStorage, redirects to /login
- **Not used by any real code** — can be deleted or kept

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

## AUTH FLOW

```
User visits /dashboard
    ↓
ProtectedRoute checks isAuthenticated (Zustand)
    ↓ not authenticated
Redirect to /login
    ↓
LoginPage submits { email, password } to POST /auth/login
    ↓
Backend returns { token, user }
    ↓
authStore saves token to localStorage + sets isAuthenticated: true
    ↓
navigate('/dashboard')
```

### Token Storage
- Key: `token` (in localStorage)
- All requests: `Authorization: Bearer <token>`
- Refresh endpoint: `POST /auth/refresh`

### Profile
- Fetched from: `GET /profile`
- Returns user object directly (not nested in `data.data`)

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
- Fix: Backend team needs to create `GET /api/suppliers`
- Currently: silently fails (`.catch(() => {})`) so app doesn't crash, but supplier dropdown is empty

### 2. ❌ /api/categories likely also missing
- Same situation as suppliers
- `GET /api/categories` called on MedicinesPage load
- Backend needs to build this too

### 3. ⚠️ Axios refresh loop (FIXED in feature/authentication)
- Old bug: refresh token was called multiple times simultaneously
- Fix applied: use raw `axios` (not `api`) for the refresh call, update `api.defaults.headers.common.Authorization` after refresh so all future requests use new token automatically
- **This fix is on `feature/authentication` branch — needs to be merged to main**

### 4. ⚠️ axiosInstance.js is redundant
- `src/shared/services/axiosInstance.js` was created during testing
- It's not imported by any real feature file
- Can safely be deleted or ignored

### 5. ⚠️ ProfilePage uses firstName/lastName
- `ProfilePage.jsx` still renders `user.firstName` and `user.lastName`
- But backend `POST /users` now uses `name` (single field)
- If backend consistently returns `name` only, ProfilePage will show blank name
- **Needs to be checked against backend `/profile` response shape**

### 6. ⚠️ authStore mock data removed but fetchMe not called on app load
- Old code had `isAuthenticated: true` hardcoded (mock)
- Now it's `false` by default
- `fetchMe()` is never called on app startup to rehydrate session from token in localStorage
- **If user refreshes the page, they get logged out even with a valid token**
- Fix needed: call `fetchMe()` on app mount if token exists in localStorage

### 7. ⚠️ formatCurrency uses USD
- `formatCurrency` formats as `$` (USD)
- If your pharmacy is in Rwanda/Africa, should be RWF
- Easy fix in `src/shared/utils/formatCurrency.js`

---

## WHAT NEEDS TO BE BUILT ON BACKEND (Mentioned in logs)

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
- MedicinesPage layout (table, filters, modals, pagination, CSV export)
- InventoryPage layout (table, search, filter, pagination)
- InventoryDashboard layout (cards, chart, alert tables)
- StockMovementForm (stock in/out/adjustment with validation)
- AlertDrawer in navbar (bell icon, side drawer, low stock + expiry)
- ProfilePage (edit name/phone, change password)
- UserManagementPage (table, add/edit/delete, activate/deactivate)
- All shared components (Button, Input, Modal, Table, Badge, Pagination, etc.)
- Axios interceptor with token refresh queue (fixed)
- ThemeToggle (light/dark)

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

## QUICK FIX CHECKLIST (Priority Order)

1. **Merge `feature/authentication` to main** — contains axios fix + login alignment
2. **Add `fetchMe()` on app startup** — so page refresh doesn't log user out
3. **Ask backend team for `GET /api/suppliers` and `GET /api/categories`**
4. **Check ProfilePage against backend `/profile` response** — name vs firstName/lastName
5. **Change currency to RWF** if needed in `formatCurrency.js`
6. **Delete or keep `axiosInstance.js`** — it's unused

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

*Last updated during current session. Branch: `feature/authentication`*
