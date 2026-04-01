import { Outlet } from 'react-router-dom'
import Navigation from '../Navigation'
import Footer from '../Footer'
import DeskPetWidget from '../DeskPetWidget'

export default function FirmLayout() {
  return (
    <div className="firm-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <DeskPetWidget />
      <Footer />
    </div>
  )
}
