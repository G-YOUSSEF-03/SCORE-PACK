/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from 'react'
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Filter,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  UserRoundX,
  UsersRound,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { usersApi } from '../../api/resources.js'
import { useToast } from '../../context/ToastContext.jsx'

const stats = [
  {
    icon: UsersRound,
    value: '24',
    label: 'Total utilisateurs',
    detail: 'Tous les comptes créés',
    tone: 'navy',
  },
  {
    icon: UserCheck,
    value: '18',
    label: 'Utilisateurs actifs',
    detail: 'Comptes actifs',
    tone: 'gold',
  },
  {
    icon: UserRoundX,
    value: '4',
    label: 'Utilisateurs inactifs',
    detail: 'Comptes désactivés',
    tone: 'muted',
  },
  {
    icon: CalendarDays,
    value: '12 mai 2024',
    label: 'Dernier utilisateur ajouté',
    detail: 'Il y a 2 jours',
    tone: 'gold',
  },
]

const fallbackUsers = [
  {
    id: 1,
    initials: 'YA',
    name: 'Youssef Admin',
    self: true,
    role: 'Administrateur',
    email: 'youssef.admin@scorepack.ma',
    phone: '+212 6 12 34 56 78',
    status: 'Actif',
    date: '12 mai 2024',
    time: '10:30',
    tone: 'blue',
  },
  {
    id: 2,
    initials: 'SB',
    name: 'Sara Benali',
    role: 'Chef de projet',
    email: 's.benali@scorepack.ma',
    phone: '+212 6 98 76 54 32',
    status: 'Actif',
    date: '10 mai 2024',
    time: '09:15',
    tone: 'gold',
  },
  {
    id: 3,
    initials: 'MA',
    name: 'Mohamed El Amrani',
    role: 'Ingénieur',
    email: 'm.elamrani@scorepack.ma',
    phone: '+212 6 12 34 56 78',
    status: 'Actif',
    date: '8 mai 2024',
    time: '14:20',
    tone: 'purple',
  },
  {
    id: 4,
    initials: 'KE',
    name: 'Khadija Zahraoui',
    role: 'Technicien',
    email: 'k.zahraoui@scorepack.ma',
    phone: '+212 6 22 33 44 55',
    status: 'Inactif',
    date: '6 mai 2024',
    time: '11:45',
    tone: 'green',
  },
  {
    id: 5,
    initials: 'OE',
    name: 'Omar El Fassih',
    role: 'Commercial',
    email: 'o.elfassih@scorepack.ma',
    phone: '+212 6 44 55 66 77',
    status: 'Actif',
    date: '3 mai 2024',
    time: '16:10',
    tone: 'pink',
  },
  {
    id: 6,
    initials: 'NB',
    name: 'Noura Belkacem',
    role: 'Assistante',
    email: 'n.belkacem@scorepack.ma',
    phone: '+212 6 33 22 11 00',
    status: 'Inactif',
    date: '1 mai 2024',
    time: '10:05',
    tone: 'blue',
  },
]

function AdminUsers() {
  const [users, setUsers] = useState(fallbackUsers)
  const [loading, setLoading] = useState(true)
  const { notify } = useToast()

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await usersApi.list()
      setUsers((response.data || response).map(mapUser))
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les utilisateurs.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const saveUser = async (user = null) => {
    const name = window.prompt('Nom', user?.name || '')
    if (!name) return
    const email = window.prompt('Email', user?.email || '')
    if (!email) return
    const phone = window.prompt('Téléphone', user?.phone || '') || ''
    const status = window.prompt('Statut: active ou inactive', user?.rawStatus || 'active') || user?.rawStatus || 'active'
    const payload = { name, email, phone, role: 'admin', status }
    if (!user) payload.password = window.prompt('Mot de passe', 'password123') || 'password123'
    try {
      user ? await usersApi.update(user.id, payload) : await usersApi.create(payload)
      notify(user ? 'Utilisateur mis à jour.' : 'Utilisateur ajouté.')
      loadUsers()
    } catch (error) {
      notify(apiErrorMessage(error, 'Opération impossible.'), 'error')
    }
  }

  const deleteUser = async (user) => {
    if (!window.confirm(`Supprimer ${user.name} ?`)) return
    try {
      await usersApi.remove(user.id)
      notify('Utilisateur supprimé.')
      loadUsers()
    } catch (error) {
      notify(apiErrorMessage(error, 'Suppression impossible.'), 'error')
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Utilisateurs</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d’Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span className="text-[#c88a22]">Utilisateurs</span>
          </nav>
        </div>

        <button type="button" onClick={() => saveUser()} className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Plus size={22} />
          Ajouter un utilisateur
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des utilisateurs</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-[44px] items-center justify-between gap-7 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="inline-flex items-center gap-3">
                <Filter size={17} />
                Tous les rôles
              </span>
              <ChevronDown size={17} />
            </button>
            <button type="button" className="inline-flex h-[44px] items-center justify-between gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="text-[#33496f]">Trier par :</span>
              Plus récents
              <ChevronDown size={17} />
            </button>
          </div>
        </div>
        {loading ? <p className="mt-4 text-sm font-bold text-[#52668c]">Chargement des utilisateurs...</p> : null}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1260px] border-collapse text-left">
            <thead>
              <tr className="border-y border-[#e8edf4] bg-[#fbfcfe] text-[13px] font-extrabold text-[#24395f]">
                <th className="w-[56px] px-3 py-5">#</th>
                <th className="w-[240px] px-3 py-5">Utilisateur</th>
                <th className="w-[160px] px-3 py-5">Rôle</th>
                <th className="w-[260px] px-3 py-5">Email</th>
                <th className="w-[190px] px-3 py-5">Téléphone</th>
                <th className="w-[130px] px-3 py-5">Statut</th>
                <th className="w-[170px] px-3 py-5">Date d&apos;ajout</th>
                <th className="w-[130px] px-3 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf4]">
              {users.map((user) => (
                <UserRow key={user.id} user={user} onEdit={saveUser} onDelete={deleteUser} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de 1 à 6 sur 24 utilisateurs</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#8a9ab5]">Précédent</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] bg-[#061f49] text-[15px] font-extrabold text-white shadow-[0_10px_20px_rgba(6,31,73,0.18)]">1</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">2</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">3</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">4</button>
            <button type="button" className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#33496f]">Suivant</button>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, detail, tone }) {
  const isGold = tone === 'gold'
  const isMuted = tone === 'muted'

  return (
    <article className="flex min-h-[145px] items-center gap-6 rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <span
        className={`grid size-[64px] shrink-0 place-items-center rounded-full text-white shadow-[0_12px_24px_rgba(6,31,73,0.14)] ${
          isGold ? 'bg-[linear-gradient(145deg,#d9a23b,#bb7b16)]' : isMuted ? 'bg-[#657998]' : 'bg-[#061f49]'
        }`}
      >
        <Icon size={29} strokeWidth={2.1} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[29px] font-extrabold leading-none tracking-[-0.03em] text-[#071f49]">{value}</p>
        <h3 className="mt-3 text-[15px] font-extrabold text-[#071f49]">{label}</h3>
        <p className="mt-3 text-[14px] font-medium text-[#33496f]">{detail}</p>
      </div>
    </article>
  )
}

function UserRow({ user, onEdit, onDelete }) {
  return (
    <tr className="text-[14px] text-[#071f49]">
      <td className="px-3 py-5 font-medium">{user.id}</td>
      <td className="px-3 py-5">
        <div className="flex items-center gap-4">
          <Avatar initials={user.initials} tone={user.tone} />
          <span className="flex min-w-0 items-center gap-3">
            <span className="truncate font-extrabold">{user.name}</span>
            {user.self ? <span className="rounded-[7px] bg-[#dcecff] px-2 py-1 text-[12px] font-extrabold text-[#006dff]">Vous</span> : null}
          </span>
        </div>
      </td>
      <td className="px-3 py-5">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-3 py-5 font-medium">{user.email}</td>
      <td className="px-3 py-5 font-medium">{user.phone}</td>
      <td className="px-3 py-5">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-3 py-5 font-medium">
        <span className="block">{user.date}</span>
        <span className="mt-1 block">{user.time}</span>
      </td>
      <td className="px-3 py-5">
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => onEdit(user)} aria-label={`Modifier ${user.name}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#006dff] transition hover:bg-[#eef6ff]">
            <Pencil size={18} />
          </button>
          <button type="button" onClick={() => onDelete(user)} aria-label={`Supprimer ${user.name}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#ff1717] transition hover:bg-[#fff0f0]">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function Avatar({ initials, tone }) {
  const tones = {
    blue: 'bg-[#dceaff] text-[#006dff]',
    gold: 'bg-[#fbefd9] text-[#b87408]',
    purple: 'bg-[#ece5ff] text-[#6340bd]',
    green: 'bg-[#d9f4e3] text-[#008e43]',
    pink: 'bg-[#ffe1e8] text-[#ff1717]',
  }

  return <span className={`grid size-10 shrink-0 place-items-center rounded-full text-[14px] font-extrabold ${tones[tone]}`}>{initials}</span>
}

function RoleBadge({ role }) {
  const tones = {
    Administrateur: 'bg-[#dcecff] text-[#006dff]',
    'Chef de projet': 'bg-[#fbefd9] text-[#b87408]',
    Ingénieur: 'bg-[#d9f4e3] text-[#008e43]',
    Technicien: 'bg-[#edf1f6] text-[#33496f]',
    Commercial: 'bg-[#ece5ff] text-[#7344d9]',
    Assistante: 'bg-[#ffe1e8] text-[#d51d42]',
  }

  return <span className={`inline-flex rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold ${tones[role]}`}>{role}</span>
}

function StatusBadge({ status }) {
  const active = status === 'Actif'

  return (
    <span className={`inline-flex items-center gap-2 rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold ${active ? 'bg-[#d9f4e3] text-[#008e43]' : 'bg-[#edf1f6] text-[#33496f]'}`}>
      <span className={`size-1.5 rounded-full ${active ? 'bg-[#008e43]' : 'bg-[#33496f]'}`} />
      {status}
    </span>
  )
}

export default AdminUsers

function mapUser(user) {
  const createdAt = new Date(user.created_at)
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return {
    id: user.id,
    initials,
    name: user.name,
    self: user.email === 'youssef.admin@scorepack.ma',
    role: user.role === 'admin' ? 'Administrateur' : user.role,
    email: user.email,
    phone: user.phone || '',
    status: user.status === 'active' ? 'Actif' : 'Inactif',
    rawStatus: user.status,
    date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(createdAt),
    time: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(createdAt),
    tone: 'blue',
  }
}
