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
