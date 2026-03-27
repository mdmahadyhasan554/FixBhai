# FixBhai — Source Folder Structure

Component-based architecture following the **UI → Features → Pages → App** pattern.

---

## `src/components/ui/`
Primitive, stateless UI building blocks. Zero business logic.
`Button` `Input` `Card` `Badge` `Modal` `Spinner` + barrel `index.js`

## `src/components/layout/`
App shell: `Navbar` `Footer` `Layout` + barrel `index.js`

## `src/components/common/`
Shared app-aware components used across multiple features.
`SectionHeader` `EmptyState` `StatCard` `StatusBadge` `PageHeader`
`UserAvatar` `ProtectedRoute` `GuestRoute` `ErrorBoundary` + barrel `index.js`

## `src/features/home/`
Homepage sections: `HeroSection` `CategoryStrip` `StatsBar` `HowItWorks`
`TrustBanner` `TestimonialsSection` `CtaSection`

## `src/features/services/`
`ServiceCard` `ServiceGrid` `ServiceSearch`

## `src/features/technicians/`
`TechnicianCard` (exports `StarRating`) `TechnicianList` `TechnicianFilter` `TechnicianSearch`

## `src/features/bookings/`
`BookingForm` `BookingCard` `BookingList` + barrel `index.js`

## `src/features/auth/`
`LoginForm` `RegisterForm` `AuthLayout` `PasswordInput` + barrel `index.js`

## `src/features/dashboard/`
Shared: `DashboardShell` (exports `UserAvatar`) `StatGrid` `DataTable` `ActivityFeed`
Customer tabs: `OverviewTab` `BookingsTab` `ProfileTab`
Admin tabs: `admin/AdminOverviewTab` `admin/AdminBookingsTab` `admin/AdminAnalyticsTab`
Tech tabs: `technician/TechOverviewTab`

## `src/pages/`
Thin route-level orchestrators — zero UI markup.
`HomePage` `ServicesPage` `TechniciansPage` `BookingPage`
`LoginPage` `RegisterPage` `DashboardPage`
`AdminPage` `TechnicianPortalPage` `NotFoundPage`

## `src/hooks/`
`useForm` `useFilter` `useAsync` `useApi` `useLocalStorage`

## `src/context/`
`AuthContext` `BookingContext` `ToastContext` + barrel `index.js`

## `src/api/`
`client.js` (Axios + token refresh) `mock.js` `authApi` `serviceApi` `technicianApi` `bookingApi` + barrel `index.js`

## `src/services/`
`authService` `bookingService` `technicianService` `serviceService`

## `src/routes/`
`index.jsx` — single source of truth for all routes

## `src/utils/`
`formatters.js` `passwordStrength.js` `validators.js` (written via PowerShell)

## `src/constants/`
`index.js` — all static data: routes, nav items, service colours, stat cards, etc.

## Dependency Flow (arrows point downward only)
```
utils/ constants/ api/data.js  ← no dependencies
services/                      ← api/
hooks/                         ← utils/
context/                       ← hooks/ + services/
components/ui/                 ← no app deps
components/common/             ← ui/ + context/ + constants/
components/layout/             ← ui/ + context/
features/                      ← ui/ + common/ + hooks/ + context/ + services/ + constants/
pages/                         ← features/ + common/ + hooks/ + context/ + constants/
routes/                        ← pages/ + common/ + constants/
App.jsx                        ← routes/ + context/ + common/
```


Component-based architecture following the **UI → Features → Pages → App** pattern.
Each folder has a single, clear responsibility. Nothing leaks into the wrong layer.

---

## `src/components/ui/`
**Purpose: Primitive, stateless UI building blocks.**

The lowest layer of the component hierarchy. These components have zero business logic,
zero knowledge of the app domain, and zero side effects. They only receive props and render UI.

Think of this as your internal design system.

| File | What it does |
|------|-------------|
| `Button.jsx` | Renders a Bootstrap button with optional loading spinner |
| `Input.jsx` | Labeled input with icon slot and inline error message |
| `Card.jsx` | Rounded card wrapper with consistent shadow |
| `Modal.jsx` | Accessible overlay modal with backdrop dismiss |
| `Spinner.jsx` | Loading spinner, supports full-page overlay mode |
| `Badge.jsx` | Coloured pill badge — info, success, warning, danger |

**Rule:** Never import from `context/`, `hooks/`, `features/`, or `pages/` here.

---

## `src/components/layout/`
**Purpose: App-wide structural shell components.**

These define the visual skeleton of every page — the persistent chrome that wraps content.
They are aware of routing (Navbar links) but not of business domain data.

| File | What it does |
|------|-------------|
| `Navbar.jsx` | Top navigation bar with FixBhai branding, links, auth state |
| `Footer.jsx` | Site-wide footer with links, contact info, social icons |
| `Layout.jsx` | Composes Navbar + children + Footer into a full page shell |

**Rule:** Only import from `components/ui/` and `context/` (for auth state in Navbar).

---

## `src/components/common/`
**Purpose: Reusable app-aware components shared across multiple features.**

These are smarter than `ui/` components — they may read from context or constants —
but they are still not tied to any single feature. If two or more features need the
same pattern, it lives here.

| File | What it does |
|------|-------------|
| `SectionHeader.jsx` | Title + subtitle + optional right-side action button |
| `EmptyState.jsx` | No-results / empty list placeholder with icon and CTA |
| `StatCard.jsx` | Gradient stat card used in Dashboard summary |
| `StatusBadge.jsx` | Maps booking status strings to coloured Badge variants |
| `ProtectedRoute.jsx` | Route guard — redirects to /login if not authenticated |
| `ErrorBoundary.jsx` | Class component that catches render errors app-wide |

**Rule:** Can import from `components/ui/`, `context/`, and `constants/`.

---

## `src/features/services/`
**Purpose: All UI components specific to the Services domain.**

Self-contained feature slice. Everything needed to display, search, and interact
with services lives here. Pages consume these components but don't duplicate their logic.

| File | What it does |
|------|-------------|
| `ServiceCard.jsx` | Single service tile with icon, price, rating, click-to-book |
| `ServiceGrid.jsx` | Responsive grid layout that maps an array of services to cards |
| `ServiceSearch.jsx` | Search input wired to filter services by name |

---

## `src/features/technicians/`
**Purpose: All UI components specific to the Technicians domain.**

| File | What it does |
|------|-------------|
| `TechnicianCard.jsx` | Technician profile card with avatar, rating, availability, book button |
| `TechnicianList.jsx` | Maps technician array to cards with empty state fallback |
| `TechnicianFilter.jsx` | Filter bar — service, availability, sort controls |

---

## `src/features/bookings/`
**Purpose: Multi-step booking flow UI.**

| File | What it does |
|------|-------------|
| `BookingForm.jsx` | 3-step wizard: service picker → schedule → confirm. Calls `bookingService` on submit |

Internal sub-components (`StepIndicator`, `ServiceStep`, `ScheduleStep`, `ConfirmStep`)
are co-located inside this file since they are only used by BookingForm.

---

## `src/features/auth/`
**Purpose: Authentication form components.**

| File | What it does |
|------|-------------|
| `LoginForm.jsx` | Email + password form. Uses `useForm`, `useAsync`, `authService` |
| `RegisterForm.jsx` | Name, email, phone, password form. Same hook pattern |

---

## `src/features/dashboard/`
**Purpose: Customer dashboard split into focused tab components.**

The dashboard is complex enough to warrant its own feature slice. Each tab is an
independent component so `DashboardPage` is just an orchestrator.

| File | What it does |
|------|-------------|
| `DashboardSidebar.jsx` | Left nav with tab links and logout |
| `BookingTable.jsx` | Responsive table of bookings with status badges and actions |
| `OverviewTab.jsx` | Stats grid + recent bookings + quick action cards |
| `BookingsTab.jsx` | Full booking list with new booking CTA |
| `ProfileTab.jsx` | User profile display with account details |

---

## `src/pages/`
**Purpose: Route-level components — thin orchestrators only.**

Pages are the glue between routing and features. They should contain almost no logic —
just compose feature components, pass props, and handle top-level layout.

| File | Route |
|------|-------|
| `HomePage.jsx` | `/` |
| `ServicesPage.jsx` | `/services` |
| `TechniciansPage.jsx` | `/technicians` |
| `BookingPage.jsx` | `/booking` |
| `LoginPage.jsx` | `/login` |
| `RegisterPage.jsx` | `/register` |
| `DashboardPage.jsx` | `/dashboard` (protected) |

**Rule:** Pages import from `features/` and `components/`. Never contain raw HTML logic.

---

## `src/hooks/`
**Purpose: Reusable stateful logic extracted from components.**

Custom hooks separate the *what* (UI) from the *how* (logic). Any stateful pattern
used in more than one place becomes a hook.

| File | What it does |
|------|-------------|
| `useForm.js` | Form values, per-field errors, validation runner, reset |
| `useFilter.js` | Generic filter + sort over any array with memoisation |
| `useAsync.js` | Wraps any async function with `loading` and `error` state |
| `useLocalStorage.js` | Typed `useState` backed by `localStorage` with JSON handling |

**Rule:** Hooks are pure logic — no JSX, no imports from `pages/` or `features/`.

---

## `src/context/`
**Purpose: Global shared state via React Context.**

Only state that is truly global (needed by many unrelated components) lives here.
Feature-local state stays inside the feature.

| File | What it provides |
|------|-----------------|
| `AuthContext.jsx` | `user`, `token`, `isAuthenticated`, `login()`, `logout()` |
| `BookingContext.jsx` | `bookings[]`, `addBooking()`, `updateStatus()`, `getStats()` |

**Rule:** Contexts use `useLocalStorage` for persistence. Always export a named hook
(`useAuth`, `useBooking`) — never consume `useContext` directly in components.

---

## `src/api/`
**Purpose: Raw data layer and HTTP client configuration.**

| File | What it does |
|------|-------------|
| `axios.js` | Configured Axios instance with base URL, auth token interceptor, 401 handler |
| `data.js` | Static mock data for `SERVICES`, `TECHNICIANS`, `BOOKINGS` — replace with API calls |

**Rule:** Components never import from `api/` directly. They go through `services/`.

---

## `src/routes/`
**Purpose: Single source of truth for all application routes.**

| File | What it does |
|------|-------------|
| `index.jsx` | Declares every `<Route>` in one place. Applies `ProtectedRoute` where needed |

Keeping routes centralised means adding, removing, or protecting a route is a
one-file change. `App.jsx` just mounts `<AppRoutes />`.

---

## `src/utils/`
**Purpose: Pure, stateless helper functions.**

No React, no hooks, no side effects. Just functions that take input and return output.
Easily unit-testable in isolation.

| File | What it does |
|------|-------------|
| `formatters.js` | `formatCurrency`, `formatDate`, `buildBookingUrl`, `capitalize`, `generateBookingId` |
| `validators.js` | `required`, `isEmail`, `minLength`, `validate` — used by `useForm` |

---

## Dependency Flow

```
utils/          ← no dependencies
constants/      ← no dependencies
api/            ← no dependencies
services/       ← api/ + utils/
hooks/          ← utils/ only
context/        ← hooks/ + services/
components/ui/  ← no app dependencies
components/layout/ ← ui/ + context/
components/common/ ← ui/ + context/ + constants/
features/       ← ui/ + common/ + hooks/ + context/ + services/ + constants/
pages/          ← features/ + common/ + hooks/ + context/ + constants/
routes/         ← pages/ + common/ + constants/
App.jsx         ← routes/ + context/ + common/
```

Arrows only point **downward**. No circular dependencies.
