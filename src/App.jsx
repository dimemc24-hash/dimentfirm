import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import DeskPetWidget from './components/DeskPetWidget'
import Home from './pages/Home'
import SheldonPath from './pages/SheldonPath'
import HariettePath from './pages/HariettePath'
import UnderConstruction from './pages/UnderConstruction'

function App() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sheldon" element={<SheldonPath />} />
          <Route path="/hariette" element={<HariettePath />} />
          <Route path="/family-law" element={<UnderConstruction title="Family Law" />} />
          <Route path="/small-business" element={<UnderConstruction title="Small Business" />} />
          <Route path="/criminal-law" element={<UnderConstruction title="Criminal Law" />} />
        </Routes>
      </main>
      <DeskPetWidget />
      <Footer />
    </div>
  )
}

export default App
