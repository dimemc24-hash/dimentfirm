# Merge Fresh Start Academy into Diment Firm Website

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Combine the Diment & Associates law firm website and Fresh Start Academy course app into a single deployable repo, with the firm site as the public front door and the academy nested under `/academy/*`.

**Architecture:** The course app (React 18 + TypeScript + Tailwind + Supabase + Stripe) becomes the base project since it has the richer toolchain. The firm site's 4 pages (Home, SheldonPath, HariettePath, UnderConstruction) plus 3 components (Navigation, Footer, DeskPetWidget, Quiz) are ported in as TSX files. Firm pages are top-level public routes; academy pages live under `/academy/...`. The firm's CSS custom properties and inline-style approach coexist with Tailwind via a scoped import — Tailwind's preflight is limited to academy pages.

**Tech Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 3, Supabase, Stripe, React Router 6, Lucide React, Vitest

---

## Constraints & Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| React version | 18.3.1 (course app) | Course app deps (Supabase, Stripe, Zustand) tested on 18; firm pages use no React 19 features |
| TypeScript | Yes (course app standard) | Firm's 4 JSX files converted to TSX with minimal typing |
| Tailwind preflight | Scoped to academy | Firm pages rely on browser defaults + custom CSS; preflight would break them |
| Router style | `createBrowserRouter` (course app) | Firm pages added as top-level entries; academy pages keep existing structure |
| Landing page | Firm's `Home.jsx` → `/` | Academy's `Landing.tsx` → `/academy` |
| Entry point | `src/main.tsx` (course app) | Firm's `main.jsx` is retired |
| Styling | Firm CSS imported globally, Tailwind for academy | CSS variables coexist; no conflicts |
| Public assets | Merge both `public/` dirs | Firm images go to `public/firm/` subfolder to avoid collisions |
| Course docs | `course/*.docx` stays at repo root | Reference material, not deployed |

---

## Task 1: Set Up Merged Project Scaffold

**Files:**
- Modify: `C:/Users/Viccar/Downloads/diment-firm-website/package.json`
- Overwrite: `C:/Users/Viccar/Downloads/diment-firm-website/vite.config.js` → `vite.config.ts`
- Create: `C:/Users/Viccar/Downloads/diment-firm-website/tsconfig.json`
- Create: `C:/Users/Viccar/Downloads/diment-firm-website/tsconfig.app.json`
- Create: `C:/Users/Viccar/Downloads/diment-firm-website/tsconfig.node.json`
- Create: `C:/Users/Viccar/Downloads/diment-firm-website/tailwind.config.js`
- Create: `C:/Users/Viccar/Downloads/diment-firm-website/postcss.config.js`
- Modify: `C:/Users/Viccar/Downloads/diment-firm-website/index.html`

**Step 1: Copy config files from course-app**

Copy these files from `D:/Apps_for_Git/course-app/` into `C:/Users/Viccar/Downloads/diment-firm-website/`:
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `tailwind.config.js`, `postcss.config.js`
- `.env.example`
- `vercel.json`

**Step 2: Merge package.json**

Replace `diment-firm-website/package.json` with course-app's `package.json`, but:
- Change `"name"` to `"diment-firm-website"`
- Keep all course-app dependencies (React 18, Supabase, Stripe, Zustand, Tailwind, etc.)
- lucide-react: use course-app's version (both repos use it)

**Step 3: Convert vite.config.js → vite.config.ts**

Replace with course-app's `vite.config.ts` (has path aliases, test config).

**Step 4: Update index.html**

Replace with course-app's `index.html`, but:
- Keep firm's `<title>`: "Diment & Associates | Bankruptcy Law"
- Keep firm's favicon: `<link rel="icon" type="image/png" href="/logo.png" />`
- Entry point changes to `/src/main.tsx`

**Step 5: Install dependencies**

```bash
cd C:/Users/Viccar/Downloads/diment-firm-website
rm -rf node_modules package-lock.json
npm install
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold merged project with course-app toolchain"
```

---

## Task 2: Copy Academy Source Code

**Step 1: Copy src directories from course-app**

Copy these directories from `D:/Apps_for_Git/course-app/src/` into `C:/Users/Viccar/Downloads/diment-firm-website/src/`:
- `components/auth/`
- `components/billing/`
- `components/course/`
- `components/layout/`
- `components/ui/`
- `components/ErrorBoundary.tsx`
- `components/LoadingSpinner.tsx`
- `components/SuspenseWrapper.tsx`
- `hooks/`
- `lib/`
- `types/`
- `data/`
- `games/`
- `content/`
- `test/`
- `assets/` (if any non-overlapping)
- `vite-env.d.ts`

**Step 2: Copy academy pages into `src/pages/academy/`**

Create `src/pages/academy/` and copy ALL course-app pages there:
- `Landing.tsx`, `Dashboard.tsx`, `Module.tsx`, `Lesson.tsx`
- `Arcade.tsx`, `Game.tsx`, `Profile.tsx`, `Badges.tsx`
- `Billing.tsx`, `Settings.tsx`, `Invite.tsx`
- `Privacy.tsx`, `Terms.tsx`, `NotFound.tsx`
- `Login.tsx`, `Register.tsx`
- `admin/` (entire directory)

**Step 3: Copy public assets from course-app**

Copy from `D:/Apps_for_Git/course-app/public/` into `C:/Users/Viccar/Downloads/diment-firm-website/public/`:
- `content/` (lesson markdown files)
- `icons/`
- `mascots/`
- `manifest.json`

**Step 4: Copy server-side directories**

Copy from course-app root:
- `api/` (Stripe webhook)
- `supabase/` (edge functions + migrations)

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: copy Fresh Start Academy source into firm repo"
```

---

## Task 3: Convert Firm Pages from JSX to TSX

**Files:**
- Rename: `src/pages/Home.jsx` → `src/pages/Home.tsx`
- Rename: `src/pages/SheldonPath.jsx` → `src/pages/SheldonPath.tsx`
- Rename: `src/pages/HariettePath.jsx` → `src/pages/HariettePath.tsx`
- Rename: `src/pages/UnderConstruction.jsx` → `src/pages/UnderConstruction.tsx`
- Rename: `src/components/Navigation.jsx` → `src/components/Navigation.tsx`
- Rename: `src/components/Footer.jsx` → `src/components/Footer.tsx`
- Rename: `src/components/DeskPetWidget.jsx` → `src/components/DeskPetWidget.tsx`
- Rename: `src/components/Quiz.jsx` → `src/components/Quiz.tsx`
- Delete: `src/App.jsx`, `src/main.jsx`, `src/App.css`

**Step 1: Rename all .jsx → .tsx**

```bash
cd C:/Users/Viccar/Downloads/diment-firm-website/src
for f in pages/*.jsx components/*.jsx; do
  mv "$f" "${f%.jsx}.tsx"
done
```

**Step 2: Add minimal type annotations**

For each converted file, add types where TypeScript requires them:
- Component props: `function UnderConstruction({ title }: { title: string })`
- Event handlers: `(e: React.FormEvent<HTMLFormElement>)`
- State: `useState<boolean>(false)`, `useState<string>('')`
- Refs: `useRef<HTMLDivElement>(null)`
- Custom event listeners: type the `CustomEvent` properly

**Step 3: Update Home.tsx Fresh Start Academy link**

Change the localhost:5174 link to `/academy`:
```tsx
// Before: href="http://localhost:5174"
// After:  href="/academy"
```

**Step 4: Delete retired files**

```bash
rm src/App.jsx src/main.jsx src/App.css
```

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: convert firm pages from JSX to TSX"
```

---

## Task 4: Merge Styling Systems

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

**Step 1: Merge CSS files**

Create a combined `src/index.css` that:
1. Starts with Tailwind directives: `@tailwind base; @tailwind components; @tailwind utilities;`
2. Imports the firm's CSS custom properties (`:root` block with all `--color-*`, `--spacing-*`, `--radius-*` variables)
3. Imports the firm's utility classes (`.container`, `.section`, `.btn-*`, `.glass-card`, `.shadow-*`, `.theme-*`, `.animate-*`)
4. Appends the course-app's custom CSS (dark mode, safe area, touch targets, scrollbar-hide, animations, typography, mobile polish, print styles)

**Step 2: Scope Tailwind preflight**

In `tailwind.config.js`, add preflight scoping so Tailwind's CSS reset only applies inside `.academy-scope`:

```js
// In tailwind.config.js
module.exports = {
  // ... existing config
  corePlugins: {
    preflight: false, // disable global preflight
  },
}
```

Then add a manual preflight import scoped to academy layouts in `src/index.css`:

```css
/* Academy-scoped Tailwind base styles */
.academy-scope {
  /* Tailwind base resets applied only inside academy pages */
}
```

Alternatively, since the firm pages use CSS custom properties that don't conflict with Tailwind utility classes, we can keep preflight enabled and fix any specific style breakages in the firm CSS. This is simpler — **try preflight ON first**, check firm pages, fix conflicts if any.

**Step 3: Extend Tailwind theme with firm colors**

In `tailwind.config.js`, add the firm's color palette:

```js
extend: {
  colors: {
    // Existing academy colors...
    'turtle-green': 'var(--color-turtle-green)',
    'turtle-green-light': 'var(--color-turtle-green-light)',
    'turtle-brown': 'var(--color-turtle-brown)',
    'turtle-shell': 'var(--color-turtle-shell)',
    'hare-orange': 'var(--color-hare-orange)',
    'hare-orange-light': 'var(--color-hare-orange-light)',
    'hare-brown': 'var(--color-hare-brown)',
    'hare-cream': 'var(--color-hare-cream)',
  },
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "style: merge firm CSS variables with Tailwind system"
```

---

## Task 5: Build Unified Router

**Files:**
- Create: `src/router.tsx` (replace course-app's version)
- Modify: `src/main.tsx`
- Create: `src/components/layout/FirmLayout.tsx`

**Step 1: Create FirmLayout wrapper**

Create `src/components/layout/FirmLayout.tsx` — wraps firm pages with Navigation + Footer + DeskPetWidget (mirrors the old `App.jsx` structure):

```tsx
import { Outlet } from 'react-router-dom'
import Navigation from '../Navigation'
import Footer from '../Footer'
import DeskPetWidget from '../DeskPetWidget'

export default function FirmLayout() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <DeskPetWidget />
      <Footer />
    </div>
  )
}
```

**Step 2: Create unified router**

Create `src/router.tsx` combining both sets of routes:

```tsx
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import FirmLayout from './components/layout/FirmLayout'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { SuspenseWrapper } from './components/SuspenseWrapper'
import { ErrorBoundary } from './components/ErrorBoundary'

// Firm pages (eagerly loaded — small, public-facing)
import Home from './pages/Home'
import SheldonPath from './pages/SheldonPath'
import HariettePath from './pages/HariettePath'
import UnderConstruction from './pages/UnderConstruction'

// Academy public pages (eagerly loaded)
import AcademyLanding from './pages/academy/Landing'
import Login from './pages/academy/Login'
import Register from './pages/academy/Register'
import NotFound from './pages/academy/NotFound'

// Academy lazy pages
const Privacy = lazy(() => import('./pages/academy/Privacy'))
const Terms = lazy(() => import('./pages/academy/Terms'))
const Dashboard = lazy(() => import('./pages/academy/Dashboard'))
const Module = lazy(() => import('./pages/academy/Module'))
const Lesson = lazy(() => import('./pages/academy/Lesson'))
const Game = lazy(() => import('./pages/academy/Game'))
const Arcade = lazy(() => import('./pages/academy/Arcade'))
const Profile = lazy(() => import('./pages/academy/Profile'))
const Badges = lazy(() => import('./pages/academy/Badges'))
const Settings = lazy(() => import('./pages/academy/Settings'))
const Billing = lazy(() => import('./pages/academy/Billing'))
const Invite = lazy(() => import('./pages/academy/Invite'))
const AdminLayout = lazy(() => import('./pages/academy/admin/AdminLayout'))
const AdminClients = lazy(() => import('./pages/academy/admin/Clients'))
const AdminInvites = lazy(() => import('./pages/academy/admin/Invites'))
const AdminAnalytics = lazy(() => import('./pages/academy/admin/Analytics'))

export const router = createBrowserRouter([
  // ── Firm public routes (with firm nav/footer) ──
  {
    element: <FirmLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sheldon', element: <SheldonPath /> },
      { path: '/hariette', element: <HariettePath /> },
      { path: '/family-law', element: <UnderConstruction title="Family Law" /> },
      { path: '/small-business', element: <UnderConstruction title="Small Business" /> },
      { path: '/criminal-law', element: <UnderConstruction title="Criminal Law" /> },
    ],
  },

  // ── Academy public routes (no firm chrome) ──
  { path: '/academy', element: <AcademyLanding /> },
  { path: '/academy/login', element: <Login /> },
  { path: '/academy/register', element: <Register /> },
  { path: '/academy/privacy', element: <SuspenseWrapper><Privacy /></SuspenseWrapper> },
  { path: '/academy/terms', element: <SuspenseWrapper><Terms /></SuspenseWrapper> },
  { path: '/academy/invite/:code', element: <SuspenseWrapper><Invite /></SuspenseWrapper> },

  // ── Academy protected routes (with academy AppShell) ──
  {
    path: '/academy',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary><AppShell /></ErrorBoundary>,
    children: [
      { path: 'dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'module/:id', element: <SuspenseWrapper><Module /></SuspenseWrapper> },
      { path: 'module/:id/lesson/:lid', element: <SuspenseWrapper><Lesson /></SuspenseWrapper> },
      { path: 'arcade', element: <SuspenseWrapper><Arcade /></SuspenseWrapper> },
      { path: 'game/:slug', element: <SuspenseWrapper><Game /></SuspenseWrapper> },
      { path: 'profile', element: <SuspenseWrapper><Profile /></SuspenseWrapper> },
      { path: 'badges', element: <SuspenseWrapper><Badges /></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><Settings /></SuspenseWrapper> },
      { path: 'billing', element: <SuspenseWrapper><Billing /></SuspenseWrapper> },
      {
        path: 'admin',
        element: <SuspenseWrapper><AdminLayout /></SuspenseWrapper>,
        children: [
          { index: true, element: <SuspenseWrapper><AdminClients /></SuspenseWrapper> },
          { path: 'clients', element: <SuspenseWrapper><AdminClients /></SuspenseWrapper> },
          { path: 'invites', element: <SuspenseWrapper><AdminInvites /></SuspenseWrapper> },
          { path: 'analytics', element: <SuspenseWrapper><AdminAnalytics /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // ── Catch-all ──
  { path: '*', element: <NotFound /> },
])
```

**Step 3: Update main.tsx**

Use course-app's `main.tsx` as-is (it already renders `RouterProvider` via `App.tsx`). Ensure it imports `./index.css` (the merged CSS).

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: unified router with firm pages at root, academy at /academy"
```

---

## Task 6: Fix Internal Links (Academy Pages)

**Files:**
- Modify: all files under `src/pages/academy/` and `src/components/layout/AppShell.tsx`

All academy pages currently link to `/dashboard`, `/login`, `/module/:id`, etc. These must be prefixed with `/academy/`.

**Step 1: Bulk find-and-replace internal links**

In ALL academy page and component files, update navigation paths:

| Old Path | New Path |
|----------|----------|
| `/dashboard` | `/academy/dashboard` |
| `/login` | `/academy/login` |
| `/register` | `/academy/register` |
| `/module/` | `/academy/module/` |
| `/arcade` | `/academy/arcade` |
| `/game/` | `/academy/game/` |
| `/profile` | `/academy/profile` |
| `/badges` | `/academy/badges` |
| `/settings` | `/academy/settings` |
| `/billing` | `/academy/billing` |
| `/admin` | `/academy/admin` |
| `/privacy` | `/academy/privacy` |
| `/terms` | `/academy/terms` |
| `/invite/` | `/academy/invite/` |
| `to="/"` (in academy context) | `to="/academy"` |

**Important:** Only change links inside `src/pages/academy/`, `src/components/layout/AppShell.tsx`, `src/components/layout/MobileBottomNav.tsx`, `src/components/auth/ProtectedRoute.tsx`, `src/components/billing/TrialBanner.tsx`. Do NOT change firm page links.

**Step 2: Update ProtectedRoute redirect**

In `src/components/auth/ProtectedRoute.tsx`, change the unauthenticated redirect:
```tsx
// Before: navigate('/login')
// After:  navigate('/academy/login')
```

**Step 3: Update useAuth redirect**

In `src/hooks/useAuth.ts`, if signOut redirects to `/`, change to `/academy` or leave as `/` (since `/` is now the firm homepage — this might actually be fine for sign-out UX).

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: prefix all academy internal links with /academy"
```

---

## Task 7: Move Firm Public Assets

**Step 1: Organize public directory**

Move firm-specific images to `public/firm/` to prevent name collisions:

```bash
cd C:/Users/Viccar/Downloads/diment-firm-website/public
mkdir -p firm
mv sheldon_tortoise_final.png firm/
mv sheldon_tortoise_1772079693402.png firm/
mv sheldon_tortoise_adorable_worker_1772080468357.png firm/
mv hariette_hare_final.png firm/
mv "art turtle.png" firm/
mv Gemini_Generated_Image_*.jfif firm/
mv watermarked-*.jpg firm/
# logo.png stays at root (used as favicon)
```

**Step 2: Update image references in firm pages**

In `Home.tsx`, `SheldonPath.tsx`, `HariettePath.tsx`, and `Navigation.tsx`, update all image `src` attributes:

```tsx
// Before: src="/sheldon_tortoise_final.png"
// After:  src="/firm/sheldon_tortoise_final.png"
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: organize public assets into firm/ subfolder"
```

---

## Task 8: Build Verification & Fix TypeScript Errors

**Step 1: Run the build**

```bash
cd C:/Users/Viccar/Downloads/diment-firm-website
npm run build
```

**Step 2: Fix TypeScript errors**

Likely issues:
- Missing type imports in converted firm pages
- Import path mismatches (academy pages moved to `pages/academy/`)
- Any `@/` path aliases not resolving
- Duplicate component names between firm and academy

Fix each error, starting from the top of the error list.

**Step 3: Run dev server and smoke test**

```bash
npm run dev
```

Verify:
- `/` loads firm homepage with Sheldon/Hariette hero
- `/sheldon` loads Sheldon path page
- `/hariette` loads Hariette path page
- `/academy` loads academy landing page
- `/academy/login` loads login form
- Navigation between firm and academy works
- Firm pages retain original styling (CSS variables, inline styles)
- Academy pages retain Tailwind styling

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: resolve TypeScript errors and verify build"
```

---

## Task 9: Cross-Link Firm ↔ Academy

**Files:**
- Modify: `src/components/Navigation.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/pages/academy/Landing.tsx`
- Modify: `src/components/layout/AppShell.tsx`

**Step 1: Add Academy link to firm navigation**

In `Navigation.tsx`, add a nav item linking to `/academy`:
```tsx
<a href="/academy">Fresh Start Academy</a>
```

**Step 2: Add Academy link to firm footer**

In `Footer.tsx`, add Fresh Start Academy to the "Your Paths" or a new section.

**Step 3: Add "Back to Firm" link in academy**

In `AppShell.tsx` sidebar, add a link back to `/`:
```tsx
<a href="/">← Diment & Associates</a>
```

**Step 4: Update academy Landing.tsx**

Add a "Back to main site" link or firm branding to the academy landing page.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: cross-link firm site and academy navigation"
```

---

## Task 10: Final Push

**Step 1: Clean up unused files**

Remove any orphaned files:
- `src/App.css` (if still present)
- `src/assets/react.svg` (Vite boilerplate)
- `public/vite.svg` (Vite boilerplate)

**Step 2: Final build check**

```bash
npm run build
```

**Step 3: Push to GitHub**

```bash
cd C:/Users/Viccar/Downloads/diment-firm-website
git push origin main
```

---

## Summary

After completion, the unified repo at `dimemc24-hash/dimentfirm` will contain:

| URL | Content |
|-----|---------|
| `/` | Firm homepage (Sheldon/Hariette hero, quiz) |
| `/sheldon` | Chapter 13 path page |
| `/hariette` | Chapter 7 path page |
| `/family-law`, `/small-business`, `/criminal-law` | Under construction placeholders |
| `/academy` | Fresh Start Academy landing/marketing page |
| `/academy/login` | Student login |
| `/academy/register` | Student registration |
| `/academy/dashboard` | Student dashboard (protected) |
| `/academy/module/:id` | Module view (protected) |
| `/academy/module/:id/lesson/:lid` | Lesson view (protected) |
| `/academy/arcade` | Game arcade (protected) |
| `/academy/game/:slug` | Individual game (protected) |
| `/academy/profile` | Student profile (protected) |
| `/academy/badges` | Badge collection (protected) |
| `/academy/settings` | Settings (protected) |
| `/academy/billing` | Billing/subscription (protected) |
| `/academy/admin/*` | Admin panel (protected, admin role) |

Single Vercel deployment serves both the firm site and the academy.
