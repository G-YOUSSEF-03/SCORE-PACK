/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  ChevronRight,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserRoundX,
  UsersRound,
  X,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { usersApi } from '../../api/resources.js'
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const statCards = [
  {
    icon: UsersRound,
    key: 'total',
    label: 'Total utilisateurs',
    detail: 'Tous les comptes créés',
    tone: 'navy',
  },
  {
    icon: UserCheck,
    key: 'active',
    label: 'Utilisateurs actifs',
    detail: 'Comptes actifs',
    tone: 'gold',
  },
  {
    icon: UserRoundX,
    key: 'inactive',
    label: 'Utilisateurs inactifs',
    detail: 'Comptes désactivés',
    tone: 'muted',
  },
  {
    icon: CalendarDays,
    key: 'latest_created_at',
    label: 'Dernier utilisateur ajouté',
    detail: 'Compte le plus récent',
    tone: 'gold',
  },
]

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'admin',
  status: 'active',
}

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, latest_created_at: null })
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 })
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { notify } = useToast()

  const loadUsers = async (nextPage = page) => {
    setLoading(true)
    try {
      const response = await usersApi.list({ page: nextPage })
      const usersPage = response.users || response
      const rows = Array.isArray(usersPage.data) ? usersPage.data : usersPage
      setUsers(rows.map(mapUser))
      setStats(response.stats || calculateStats(rows))
      setMeta({
        current_page: usersPage.current_page || nextPage,
        last_page: usersPage.last_page || 1,
        from: usersPage.from || (rows.length ? 1 : 0),
        to: usersPage.to || rows.length,
        total: usersPage.total || rows.length,
      })
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les utilisateurs.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers(page)
  }, [page])

  const roleOptions = useMemo(() => ['all', ...Array.from(new Set(users.map((user) => user.rawRole).filter(Boolean)))], [users])

  const visibleUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.rawRole === roleFilter
      const matchesSearch = !query || [user.name, user.email, user.phone, user.role, user.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))

      return matchesRole && matchesSearch
    })
  }, [users, searchTerm, roleFilter])

  const openCreate = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = async (user) => {
    setErrors({})
    try {
      const fresh = await usersApi.show(user.id)
      setEditingUser(fresh)
      setForm({
        name: fresh.name || '',
        email: fresh.email || '',
        phone: fresh.phone || '',
        password: '',
        role: fresh.role || 'admin',
        status: fresh.status || 'active',
      })
      setFormOpen(true)
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger l’utilisateur.'), 'error')
    }
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingUser(null)
    setForm(emptyForm)
    setErrors({})
  }

  const saveUser = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: form.status,
      }

      if (form.password) payload.password = form.password

      if (editingUser) {
        await usersApi.update(editingUser.id, payload)
        notify('Utilisateur mis à jour.')
      } else {
        await usersApi.create({ ...payload, password: form.password })
        notify('Utilisateur ajouté.')
      }

      closeForm()
      loadUsers(page)
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(Object.fromEntries(Object.entries(error.response.data.errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])))
      }
      notify(apiErrorMessage(error, 'Opération impossible.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    setDeleting(true)
    try {
      await usersApi.remove(userToDelete.id)
      setUserToDelete(null)
      notify('Utilisateur supprimé.')
      loadUsers(page)
    } catch (error) {
      notify(apiErrorMessage(error, 'Suppression impossible.'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const pages = Array.from({ length: Math.max(1, meta.last_page) }, (_, index) => index + 1)

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

        <button type="button" onClick={openCreate} className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Plus size={22} />
          Ajouter un utilisateur
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} value={formatStatValue(stat.key, stats[stat.key])} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des utilisateurs</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="inline-flex h-[44px] items-center justify-between gap-7 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="inline-flex items-center gap-3">
                <Filter size={17} />
                Rôle
              </span>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="bg-transparent text-[14px] font-extrabold outline-none">
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role === 'all' ? 'Tous les rôles' : roleLabel(role)}</option>
                ))}
              </select>
            </label>
            <label className="inline-flex h-[44px] items-center gap-3 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <Search size={17} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Rechercher..."
                className="h-full min-w-[190px] bg-transparent text-[14px] font-semibold outline-none placeholder:text-[#8a9ab5]"
              />
            </label>
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
              {visibleUsers.map((user) => (
                <UserRow key={user.id} user={user} onEdit={openEdit} onDelete={setUserToDelete} />
              ))}
              {!loading && !visibleUsers.length ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-sm font-bold text-[#52668c]">Aucun utilisateur trouvé</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de {meta.from || 0} à {meta.to || visibleUsers.length} sur {meta.total || visibleUsers.length} utilisateurs</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#8a9ab5] disabled:opacity-40">Précédent</button>
            {pages.map((pageNumber) => (
              <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`grid size-11 place-items-center rounded-[8px] text-[15px] ${page === pageNumber ? 'bg-[#061f49] font-extrabold text-white shadow-[0_10px_20px_rgba(6,31,73,0.18)]' : 'border border-[#dce4ef] font-medium text-[#071f49]'}`}>
                {pageNumber}
              </button>
            ))}
            <button type="button" disabled={page >= meta.last_page} onClick={() => setPage((value) => Math.min(meta.last_page, value + 1))} className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#33496f] disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </section>
      <UserFormModal
        open={formOpen}
        editing={Boolean(editingUser)}
        form={form}
        errors={errors}
        saving={saving}
        onChange={setForm}
        onClose={closeForm}
        onSubmit={saveUser}
      />
      <ConfirmDeleteModal
        open={Boolean(userToDelete)}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        details="Cette action est irréversible."
        loading={deleting}
        onCancel={() => {
          if (!deleting) setUserToDelete(null)
        }}
        onConfirm={confirmDeleteUser}
      />
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

function UserFormModal({ open, editing, form, errors, saving, onChange, onClose, onSubmit }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#061f49]/45 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_24px_70px_rgba(6,31,73,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#c88a22]">Utilisateur</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#071f49]">{editing ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#071f49]">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <FormField label="Nom" error={errors.name}>
            <input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]" />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]" />
          </FormField>
          <FormField label="Téléphone" error={errors.phone}>
            <input value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]" />
          </FormField>
          <FormField label={editing ? 'Mot de passe (optionnel)' : 'Mot de passe'} error={errors.password}>
            <input type="password" value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]" />
          </FormField>
          <FormField label="Rôle" error={errors.role}>
            <select value={form.role} onChange={(event) => onChange({ ...form, role: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]">
              <option value="admin">Administrateur</option>
              <option value="manager">Chef de projet</option>
              <option value="engineer">Ingénieur</option>
              <option value="technician">Technicien</option>
              <option value="commercial">Commercial</option>
              <option value="assistant">Assistante</option>
            </select>
          </FormField>
          <FormField label="Statut" error={errors.status}>
            <select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </FormField>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" disabled={saving} onClick={onClose} className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-sm font-extrabold text-[#071f49] disabled:opacity-50">Annuler</button>
          <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-3 rounded-[8px] bg-[#061f49] px-5 text-sm font-extrabold text-white disabled:opacity-60">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-[#071f49]">{label}</span>
      {children}
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
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

  return <span className={`inline-flex rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold ${tones[role] || tones.Administrateur}`}>{role}</span>
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

function mapUser(user) {
  const createdAt = user.created_at ? new Date(user.created_at) : new Date()
  return {
    id: user.id,
    initials: initialsFor(user.name),
    name: user.name,
    role: roleLabel(user.role),
    rawRole: user.role,
    email: user.email,
    phone: user.phone || '',
    status: user.status === 'active' ? 'Actif' : 'Inactif',
    rawStatus: user.status,
    date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(createdAt),
    time: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(createdAt),
    tone: toneFor(user.id),
  }
}

function calculateStats(rows) {
  const active = rows.filter((user) => user.status === 'active').length
  const latest = rows.reduce((latestDate, user) => {
    if (!user.created_at) return latestDate
    const value = new Date(user.created_at)
    return !latestDate || value > latestDate ? value : latestDate
  }, null)

  return {
    total: rows.length,
    active,
    inactive: rows.length - active,
    latest_created_at: latest?.toISOString() || null,
  }
}

function formatStatValue(key, value) {
  if (key !== 'latest_created_at') return String(value || 0)
  if (!value) return '-'

  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

function initialsFor(name = '') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U'
}

function roleLabel(role) {
  return {
    admin: 'Administrateur',
    manager: 'Chef de projet',
    engineer: 'Ingénieur',
    technician: 'Technicien',
    commercial: 'Commercial',
    assistant: 'Assistante',
  }[role] || role
}

function toneFor(id) {
  return ['blue', 'gold', 'purple', 'green', 'pink'][Number(id || 0) % 5]
}

export default AdminUsers
