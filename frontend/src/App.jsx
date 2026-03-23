import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Generate from './pages/Generate'
import Verify from './pages/Verify'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen text-slate-100">
      {/* LAYER 1 (BOTTOM): Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-2]"
      >
        <source src="/loop.mp4" type="video/mp4" />
      </video>

      {/* LAYER 2 (MIDDLE): Gradient Dark Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[-1]" />

      {/* LAYER 3 (TOP): App Content Wrapping Engine */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 px-6 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App