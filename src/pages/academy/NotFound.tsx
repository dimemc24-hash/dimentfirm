import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Compass, Gamepad2 } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Mascot illustration area */}
        <div className="relative inline-block mb-6">
          <div className="w-28 h-28 bg-white dark:bg-gray-700 rounded-3xl shadow-lg border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center mx-auto">
            <span className="text-6xl" role="img" aria-label="Lost rabbit">🐇</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-700">
            <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        {/* Message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 mb-4">
          <h1 className="text-6xl font-black text-fresh-blue mb-2">404</h1>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Looks like Hariette took a wrong turn!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. 
            Don&apos;t worry — every fresh start includes a few detours.
          </p>

          {/* Primary actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link
              to="/academy/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-fresh-blue text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <Link to="/academy" className="hover:text-fresh-blue transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link to="/academy/arcade" className="hover:text-fresh-blue transition-colors flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" />
            Arcade
          </Link>
          <span>•</span>
          <Link to="/academy/login" className="hover:text-fresh-blue transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
