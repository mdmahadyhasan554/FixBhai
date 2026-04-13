# Project Cleanup Plan

## Files to Delete (Temporary/Debug/Duplicate)

### Root Directory - Documentation Files (Keep only essential)
- ❌ DELETE: `ADMIN_FIXES_COMPLETE.md` (temporary fix documentation)
- ❌ DELETE: `ADMIN_PANEL_FIX_COMPLETE.md` (temporary fix documentation)
- ❌ DELETE: `AUTH_FIX_GUIDE.md` (temporary fix documentation)
- ❌ DELETE: `AUTH_SYSTEM_AUDIT.md` (temporary fix documentation)
- ❌ DELETE: `AUTHENTICATION_COMPLETE.md` (temporary fix documentation)
- ❌ DELETE: `BUGFIX_APPLIED.md` (temporary fix documentation)
- ❌ DELETE: `BUGFIX_LO.md` (temporary fix documentation)
- ❌ DELETE: `DEBUG_ADMIN_ISSUES.md` (temporary debug guide)
- ❌ DELETE: `FINAL_FIX_INSTRUCTIONS.md` (temporary fix documentation)
- ❌ DELETE: `FIX_401_NOW.md` (temporary fix documentation)
- ❌ DELETE: `FIXED_DATABASE_CONNECTION.md` (temporary fix documentation)
- ❌ DELETE: `QUICK_FIX_TEST.md` (temporary test guide)
- ❌ DELETE: `SESSION_AUTH_COMPLETE.md` (temporary fix documentation)
- ❌ DELETE: `USER_ROLE_CHANGE_FIX.md` (temporary fix documentation)
- ✅ KEEP: `README.md` (main documentation)
- ✅ KEEP: `SETUP.md` (setup instructions)

### Root Directory - Test Files
- ❌ DELETE: `test-admin-api.html` (temporary test file)
- ❌ DELETE: `test-auth-debug.html` (temporary test file)
- ❌ DELETE: `test-session-debug.html` (temporary test file)

### Backend API - Test/Debug Files
- ❌ DELETE: `backend/api/debug-session.php` (debug file)
- ❌ DELETE: `backend/api/test-session-write.php` (test file)
- ❌ DELETE: `backend/api/admin/test-admin.php` (test file)
- ❌ DELETE: `backend/api/auth/test-auth.php` (test file)

### Environment Files (Consolidate)
- ✅ KEEP: `.env.local` (local development config)
- ✅ KEEP: `.env.example` (template for others)
- ❌ DELETE: `.env` (duplicate, use .env.local)
- ✅ KEEP: `backend/config/.env` (backend config)
- ✅ KEEP: `backend/config/.env.example` (backend template)

## Code Duplications to Fix

### 1. Database Connection
- ✅ FIXED: All files now use `getDB()` consistently

### 2. CORS Headers
- Check if all API files use `cors()` helper consistently

### 3. Authentication
- Check if all protected endpoints use `requireAuth()` consistently

## Organization Improvements

### 1. Create docs/ folder for documentation
Move essential docs to organized structure:
```
docs/
  ├── SETUP.md
  └── API.md (create from README)
```

### 2. Backend structure is good
```
backend/
  ├── api/
  │   ├── admin/      ✅ Admin endpoints
  │   ├── auth/       ✅ Authentication
  │   ├── bookings/   ✅ Booking management
  │   ├── users/      ✅ User management
  │   └── ...
  ├── config/         ✅ Configuration
  └── uploads/        ✅ File uploads
```

### 3. Frontend structure is good
```
src/
  ├── api/            ✅ API clients
  ├── components/     ✅ Reusable components
  ├── context/        ✅ React contexts
  ├── features/       ✅ Feature modules
  ├── hooks/          ✅ Custom hooks
  ├── pages/          ✅ Page components
  ├── routes/         ✅ Routing
  ├── services/       ✅ Business logic
  └── utils/          ✅ Utilities
```

## Summary
- 14 temporary documentation files to delete
- 3 test HTML files to delete
- 4 backend test/debug PHP files to delete
- 1 duplicate .env file to delete
- Total: 22 files to clean up
