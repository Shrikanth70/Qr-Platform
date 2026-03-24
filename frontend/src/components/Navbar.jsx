import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const linkStyle = (path) => {
    const isActive = location.pathname === path
    return `px-4 py-3 rounded-xl font-medium transition-all duration-300 block md:inline-block border border-transparent ${
      isActive
        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
        : 'text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10'
    }`
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group z-50">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white group-hover:scale-[1.02] transition-transform duration-300 drop-shadow-lg">
            Quick<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 lg:gap-4 items-center">
          <Link to="/" className={linkStyle('/')}>
            Home
          </Link>
          <Link to="/generate" className={linkStyle('/generate')}>
            Generate
          </Link>
          <Link to="/verify" className={linkStyle('/verify')}>
            Verify
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 -mr-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav Menu Expandable */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-black/80 backdrop-blur-2xl border-b border-white/5 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 py-4 shadow-2xl' : 'max-h-0 opacity-0 py-0 border-transparent shadow-none'
        }`}
      >
        <div className="flex flex-col px-6 gap-2">
          <Link to="/" onClick={closeMenu} className={linkStyle('/')}>
            Home
          </Link>
          <Link to="/generate" onClick={closeMenu} className={linkStyle('/generate')}>
            Generate
          </Link>
          <Link to="/verify" onClick={closeMenu} className={linkStyle('/verify')}>
            Verify
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar