import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const linkStyle = (path) =>
    `px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
      location.pathname === path
        ? 'bg-white/20 text-white backdrop-blur-sm shadow-lg'
        : 'text-white/90 hover:text-white hover:bg-white/10 active:bg-white/20'
    }`

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl md:text-3xl font-black text-white drop-shadow-lg tracking-tight">
          QR Platform
        </Link>

        <div className="flex gap-2 md:gap-4">
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
      </div>
    </nav>
  )
}

export default Navbar