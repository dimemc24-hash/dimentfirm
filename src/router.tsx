import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import FirmLayout from './components/layout/FirmLayout'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { SuspenseWrapper } from './components/SuspenseWrapper'
import { ErrorBoundary } from './components/ErrorBoundary'

// Firm pages (eagerly loaded — small, public-facing)
import Home from './pages/Home'
import Bankruptcy from './pages/Bankruptcy'
import SheldonPath from './pages/SheldonPath'
import HariettePath from './pages/HariettePath'
import FamilyLaw from './pages/FamilyLaw'
import SmallBusiness from './pages/SmallBusiness'
import Taxes from './pages/Taxes'
import MallLanding from './pages/MallLanding'
import FirmAdmin from './pages/FirmAdmin'
import UnderConstruction from './pages/UnderConstruction'

// Blog articles (lazily loaded)
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'))
const HowChapter7Works = lazy(() => import('./pages/blog/HowChapter7Works'))
const LouisianaExemptions = lazy(() => import('./pages/blog/LouisianaExemptions'))
const Chapter7vsChapter13 = lazy(() => import('./pages/blog/Chapter7vsChapter13'))
const BankruptcyCreditReport = lazy(() => import('./pages/blog/BankruptcyCreditReport'))
const KeepCarBankruptcy = lazy(() => import('./pages/blog/KeepCarBankruptcy'))
const BankruptcyMeansTest = lazy(() => import('./pages/blog/BankruptcyMeansTest'))
const StopWageGarnishment = lazy(() => import('./pages/blog/StopWageGarnishment'))
const StopRepossession = lazy(() => import('./pages/blog/StopRepossession'))
const StopForeclosure = lazy(() => import('./pages/blog/StopForeclosure'))
const DebtSettlementVsBankruptcy = lazy(() => import('./pages/blog/DebtSettlementVsBankruptcy'))

// Academy public pages (eagerly loaded)
import AcademyLanding from './pages/academy/Landing'
// NOTE: Login, Register, Invite commented out while Coming Soon overlay is active.
// import Login from './pages/academy/Login'
// import Register from './pages/academy/Register'
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
// const Invite = lazy(() => import('./pages/academy/Invite'))
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
      { path: '/bankruptcy', element: <Bankruptcy /> },
      { path: '/sheldon', element: <SheldonPath /> },
      { path: '/hariette', element: <HariettePath /> },
      { path: '/family-law', element: <FamilyLaw /> },
      { path: '/small-business', element: <SmallBusiness /> },
      { path: '/taxes', element: <Taxes /> },
      { path: '/criminal-law', element: <UnderConstruction title="Criminal Law" /> },
      { path: '/firm-admin', element: <FirmAdmin /> },

      // Blog index + articles
      { path: '/blog', element: <SuspenseWrapper><BlogIndex /></SuspenseWrapper> },
      { path: '/blog/how-chapter-7-works-louisiana', element: <SuspenseWrapper><HowChapter7Works /></SuspenseWrapper> },
      { path: '/blog/louisiana-bankruptcy-exemptions', element: <SuspenseWrapper><LouisianaExemptions /></SuspenseWrapper> },
      { path: '/blog/chapter-7-vs-chapter-13', element: <SuspenseWrapper><Chapter7vsChapter13 /></SuspenseWrapper> },
      { path: '/blog/bankruptcy-credit-report', element: <SuspenseWrapper><BankruptcyCreditReport /></SuspenseWrapper> },
      { path: '/blog/keep-car-bankruptcy-louisiana', element: <SuspenseWrapper><KeepCarBankruptcy /></SuspenseWrapper> },
      { path: '/blog/bankruptcy-means-test', element: <SuspenseWrapper><BankruptcyMeansTest /></SuspenseWrapper> },
      { path: '/blog/stop-wage-garnishment-louisiana', element: <SuspenseWrapper><StopWageGarnishment /></SuspenseWrapper> },
      { path: '/blog/stop-repossession-louisiana', element: <SuspenseWrapper><StopRepossession /></SuspenseWrapper> },
      { path: '/blog/stop-foreclosure-louisiana', element: <SuspenseWrapper><StopForeclosure /></SuspenseWrapper> },
      { path: '/blog/debt-settlement-vs-bankruptcy', element: <SuspenseWrapper><DebtSettlementVsBankruptcy /></SuspenseWrapper> },
    ],
  },

  // ── Mall ad landing page (no firm chrome — focused funnel) ──
  { path: '/mall', element: <MallLanding /> },

  // ── Academy public routes (no firm chrome) ──
  // NOTE: Login/Register redirect to landing while Coming Soon overlay is active.
  // Restore these when Academy launches:
  //   { path: '/academy/login', element: <Login /> },
  //   { path: '/academy/register', element: <Register /> },
  //   { path: '/academy/invite/:code', element: <SuspenseWrapper><Invite /></SuspenseWrapper> },
  { path: '/academy', element: <AcademyLanding /> },
  { path: '/academy/login', element: <AcademyLanding /> },
  { path: '/academy/register', element: <AcademyLanding /> },
  { path: '/academy/privacy', element: <SuspenseWrapper><Privacy /></SuspenseWrapper> },
  { path: '/academy/terms', element: <SuspenseWrapper><Terms /></SuspenseWrapper> },
  { path: '/academy/invite/:code', element: <AcademyLanding /> },

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
