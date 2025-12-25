import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Map, Crosshair, BarChart3, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { logOut } from '../services/firebase'

const navItems = [
  { to: '/campaign', label: 'Campaign', icon: Map },
  { to: '/arena', label: 'Arena', icon: Crosshair },
  { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
]

const linkClasses = ({ isActive }) =>
  [
    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-white/10 text-white'
      : 'text-gray-300 hover:bg-white/5 hover:text-white',
  ].join(' ')

function Navbar() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = async () => {
    try {
      await logOut()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setIsDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          <span className="font-bold text-red-500">DSA</span> Stories
        </Link>

        <nav className="flex items-center gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClasses}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {currentUser ? (
          <div className="relative flex items-center gap-3" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900/60 px-2 py-1 transition-colors hover:border-neutral-600 hover:bg-neutral-900/80"
            >
              <img
                src={currentUser.photoURL || '/default-avatar.png'}
                alt={currentUser.displayName || 'User'}
                className="h-8 w-8 rounded-full border border-neutral-700 object-cover"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Novice
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl">
                {/* Header */}
                <div className="border-b border-neutral-800 px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    {currentUser.displayName || 'Anonymous Operative'}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{currentUser.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                  >
                    <User size={16} />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-neutral-800 hover:text-red-500"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className={linkClasses}>
            <LogIn size={18} />
            Login
          </NavLink>
        )}
      </div>
    </header>
  )
}

export default Navbar

