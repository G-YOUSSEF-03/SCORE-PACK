import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo.jsx'

const visitorLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/scores', label: 'Scores' },
  { to: '/pricing', label: 'Tarifs' },
]

function VisitorLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  if (isLoginPage) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3 font-semibold">
            <Logo variant="light" size="mobile" />
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {visitorLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:bg-white hover:text-slate-950'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-950 sm:inline-flex"
            >
              Connexion
            </NavLink>
            <NavLink
              to="/admin"
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <ShieldCheck size={16} />
              Admin
            </NavLink>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default VisitorLayout
