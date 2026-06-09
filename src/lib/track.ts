const NC_CAPTURE_URL = import.meta.env.VITE_NC_CAPTURE_URL as string | undefined

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
  if (!NC_CAPTURE_URL) return
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
