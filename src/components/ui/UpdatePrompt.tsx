import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { applyUpdate } from '../../lib/sw-register';

/**
 * Toast banner shown when a new service worker version is available.
 * Prompts the user to reload and get the latest version.
 */
export function UpdatePrompt() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Listen for the custom event dispatched from main.tsx
    const handler = (e: CustomEvent<ServiceWorkerRegistration>) => {
      setRegistration(e.detail);
      setDismissed(false);
    };

    window.addEventListener(
      'sw-update-available',
      handler as EventListener
    );
    return () => {
      window.removeEventListener(
        'sw-update-available',
        handler as EventListener
      );
    };
  }, []);

  if (!registration || dismissed) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md
        rounded-xl border border-blue-200 bg-white p-4 shadow-lg
        dark:border-blue-800 dark:bg-gray-900
        animate-in slide-in-from-bottom-4 duration-300
        sm:left-auto sm:right-4"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
          <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Update Available
          </p>
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
            A new version of Fresh Start Academy is ready.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => applyUpdate(registration)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600
                px-3 py-1.5 text-xs font-medium text-white
                hover:bg-blue-700 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Update Now
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="inline-flex items-center rounded-lg px-3 py-1.5
                text-xs font-medium text-gray-600 hover:text-gray-900
                hover:bg-gray-100 dark:text-gray-400
                dark:hover:text-gray-200 dark:hover:bg-gray-800
                transition-colors"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="rounded-lg p-1 text-gray-400 hover:text-gray-600
            dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss update notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
