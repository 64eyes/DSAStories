import { NavLink, Link } from 'react-router-dom'
import { Map, Crosshair, BarChart3, LogIn, LogOut } from 'lucide-react'
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

  const handleLogout = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
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
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900/60 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 transition-colors hover:border-white/60 hover:bg-neutral-800 hover:text-white"
              title="View Profile"
              aria-label="View Profile"
            >
              <img
                src={currentUser.photoURL || '/default-avatar.png'}
                alt={currentUser.displayName || 'User'}
                className="h-8 w-8 rounded-full border border-neutral-700 object-cover"
              />
              <span>Novice</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
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

