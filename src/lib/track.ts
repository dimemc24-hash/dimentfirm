const NC_CAPTURE_URL = 'https://newchapter-production.up.railway.app/api/leads/website-capture'

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

function fireOaiqConversion(eventName: string) {
  if (typeof window === 'undefined' || !window.oaiq) return
  window.oaiq('measure', eventName, {
    type: 'customer_action',
    amount: 0,
    currency: 'USD',
  })
}

// Delegated listener catches every tel: and booking-CTA link site-wide —
// there's no shared PhoneLink/BookingLink component to hook individually.
export function initConversionTracking() {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement)?.closest('a')
    if (!link) return
    const href = link.getAttribute('href') || ''
    if (href.startsWith('tel:')) {
      fireOaiqConversion('phone_call_click')
    } else if (href.includes('outlook.office.com/book/')) {
      fireOaiqConversion('consultation_booking_click')
    }
  })
}

type SessionPage = { path: string; practiceArea: string; ts: number }

function getSessionPages(): SessionPage[] {
  try {
    return JSON.parse(sessionStorage.getItem('nc_session_pages') || '[]')
  } catch {
    return []
  }
}

export function trackPageView(practiceArea: string, path: string) {
  const pages = getSessionPages()
  if (!pages.find(p => p.path === path)) {
    pages.push({ practiceArea, path, ts: Date.now() })
    sessionStorage.setItem('nc_session_pages', JSON.stringify(pages))
  }
}

export function trackConsultationClick(currentPath: string) {
  const practiceArea = inferPracticeArea(currentPath)
  const payload = {
    event: 'consultation_click',
    path: currentPath,
    practiceArea,
    sessionPages: getSessionPages(),
    referrer: document.referrer,
  }
  // Fire-and-forget — never block navigation to the booking page
  if (navigator.sendBeacon) {
    navigator.sendBeacon(NC_CAPTURE_URL, JSON.stringify(payload))
  } else {
    fetch(NC_CAPTURE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }
}

function inferPracticeArea(path: string): string {
  if (/bankruptcy|sheldon|hariette/.test(path)) return 'bankruptcy'
  if (/family-law/.test(path)) return 'family_law'
  if (/small-business/.test(path)) return 'small_business'
  if (/taxes/.test(path)) return 'taxes'
  return 'general'
}
