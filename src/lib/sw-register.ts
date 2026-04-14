/**
 * Service Worker Registration Utility
 *
 * Registers the service worker in production, handles updates,
 * and provides hooks for offline/online status and update prompts.
 */

export interface SWRegistrationCallbacks {
  /** Called when new content is available (SW updated) */
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  /** Called when content is cached for offline use (first install) */
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  /** Called when SW registration fails */
  onError?: (error: Error) => void;
}

const IS_LOCALHOST = Boolean(
  typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/.test(
        window.location.hostname
      ))
);

/**
 * Register the service worker.
 * Only runs in production (or localhost for testing).
 */
export function registerSW(callbacks: SWRegistrationCallbacks = {}): void {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return;
  }

  // In development, skip unless explicitly enabled
  const isDev = import.meta.env.DEV;
  if (isDev && !IS_LOCALHOST) {
    console.log('[SW] Skipping registration in development');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;

    if (IS_LOCALHOST && isDev) {
      // In localhost dev mode, check if SW exists before registering
      checkValidSW(swUrl, callbacks);
    } else {
      registerValidSW(swUrl, callbacks);
    }
  });
}

async function registerValidSW(
  swUrl: string,
  callbacks: SWRegistrationCallbacks
): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.register(swUrl);

    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state !== 'installed') return;

        if (navigator.serviceWorker.controller) {
          // New content is available — an update was installed
          console.log(
            '[SW] New content available; close all tabs to update.'
          );
          callbacks.onUpdate?.(registration);
        } else {
          // Content is cached for offline use (first install)
          console.log('[SW] Content cached for offline use.');
          callbacks.onSuccess?.(registration);
        }
      };
    };
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    callbacks.onError?.(error as Error);
  }
}

async function checkValidSW(
  swUrl: string,
  callbacks: SWRegistrationCallbacks
): Promise<void> {
  try {
    const response = await fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    });
    const contentType = response.headers.get('content-type');

    if (
      response.status === 404 ||
      (contentType && !contentType.includes('javascript'))
    ) {
      // No SW found — probably a different app. Unregister and reload.
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      window.location.reload();
    } else {
      registerValidSW(swUrl, callbacks);
    }
  } catch {
    console.log('[SW] No internet connection; running in offline mode.');
  }
}

/**
 * Unregister the service worker (useful for development/debugging).
 */
export async function unregisterSW(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.unregister();
  } catch (error) {
    console.error('[SW] Unregister failed:', error);
    return false;
  }
}

/**
 * Signal the waiting service worker to skip waiting and activate.
 * Call this when the user accepts an update prompt.
 */
export function applyUpdate(
  registration: ServiceWorkerRegistration
): void {
  const waitingWorker = registration.waiting;
  if (waitingWorker) {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    // Reload once the new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}
