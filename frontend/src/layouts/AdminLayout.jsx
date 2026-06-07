import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Newspaper,
  Search,
  Settings,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Logo from '../components/Logo.jsx'

const adminLinks = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/services', label: 'Services', icon: BriefcaseBusiness },
  { to: '/admin/projects', label: 'Projets', icon: FolderKanban },
  { to: '/admin/quotes', label: 'Demandes de devis', icon: FileText },
  { to: '/admin/messages', label: 'Gestion des Messages', icon: MessageSquareText },
  { to: '/admin/news', label: 'Actualités', icon: Newspaper },
  { to: '/admin/teams', label: 'Équipes', icon: UsersRound },
  { to: '/admin/users', label: 'Utilisateurs', icon: UserRound },
  { to: '/admin/settings', label: 'Paramètres', icon: Settings },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { notify } = useToast()

  const adminName = user?.name || 'Youssef Admin'
  const adminRole = user?.role === 'admin' ? 'Administrateur' : user?.role || 'Administrateur'

  const handleLogout = async () => {
    await logout()
    notify('Déconnexion réussie.')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#061f49]">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-[#061f49]/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[radial-gradient(circle_at_18%_10%,rgba(23,70,135,0.55),transparent_32%),linear-gradient(150deg,#001b3f_0%,#062b61_100%)] px-4 py-7 text-white shadow-[18px_0_52px_rgba(6,31,73,0.2)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <a href="/admin" className="flex items-center gap-3">
            <Logo variant="dark" size="sidebar" />
          </a>
          <button type="button" aria-label="Fermer" className="grid size-10 place-items-center rounded-xl bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-14 space-y-3">
          {adminLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex h-[56px] items-center gap-4 rounded-[10px] px-4 text-[16px] font-semibold transition ${
                    isActive
                      ? 'bg-[#123563] text-[#c88a22] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                      : 'text-white hover:bg-white/8 hover:text-[#f3c46f]'
                  }`
                }
              >
                <Icon size={22} strokeWidth={2.1} />
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-white/12 pt-6">
          <button type="button" className="flex w-full items-center gap-4 rounded-[14px] p-2 text-left transition hover:bg-white/8" onClick={handleLogout}>
            <AdminAvatar />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[16px] font-extrabold">{adminName}</span>
              <span className="mt-1 block text-[14px] font-medium text-white/82">{adminRole}</span>
            </span>
            <ChevronDown size={19} />
          </button>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-[#e6ebf2] bg-white/92 px-5 backdrop-blur sm:px-8">
          <div className="flex h-[82px] items-center gap-5">
            <button type="button" aria-label="Ouvrir le menu" className="grid size-11 place-items-center rounded-xl text-[#061f49] transition hover:bg-[#f1f4f9]" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>

            <div className="ml-auto hidden h-[48px] w-full max-w-[330px] items-center gap-3 rounded-[9px] border border-[#dce4ef] bg-white px-4 text-[#061f49] shadow-[0_8px_22px_rgba(6,31,73,0.04)] sm:flex">
              <input
                type="search"
                placeholder="Rechercher..."
                className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-medium outline-none placeholder:text-[#52668c]"
              />
              <Search size={22} />
            </div>

            <button type="button" aria-label="Notifications" className="relative grid size-11 place-items-center rounded-xl text-[#061f49] transition hover:bg-[#f1f4f9]">
              <Bell size={22} />
              <span className="absolute -right-1 top-0 grid size-[20px] place-items-center rounded-full bg-[#c88a22] text-[11px] font-extrabold text-white">3</span>
            </button>

            <button type="button" className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-[#f1f4f9]" onClick={handleLogout}>
              <AdminAvatar />
              <span className="hidden min-w-0 sm:block">
                <span className="block text-[15px] font-extrabold leading-5">{adminName}</span>
                <span className="text-[13px] font-medium text-[#52668c]">{adminRole}</span>
              </span>
              <ChevronDown size={18} className="hidden sm:block" />
            </button>
          </div>
        </header>

        <main className="px-5 py-7 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function AdminAvatar() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#f8ecd3,#c88a22)] text-white shadow-[0_8px_18px_rgba(200,138,34,0.26)]">
      <UserRound size={24} fill="currentColor" strokeWidth={1.8} />
    </span>
  )
}

export default AdminLayout
