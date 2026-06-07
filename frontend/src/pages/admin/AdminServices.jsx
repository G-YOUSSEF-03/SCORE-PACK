/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  EyeOff,
  Filter,
  Folder,
  Handshake,
  Pencil,
  PieChart,
  Plus,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { servicesApi } from '../../api/resources.js'
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const statCards = [
  {
    icon: ClipboardList,
    key: 'total',
    label: 'Total des services',
    detail: 'Tous les services disponibles',
    tone: 'navy',
  },
  {
    icon: ClipboardList,
    key: 'active',
    label: 'Services actifs',
    detail: 'Visibles sur le site',
    tone: 'gold',
  },
  {
    icon: EyeOff,
    key: 'inactive',
    label: 'Services inactifs',
    detail: 'Masqués du site',
    tone: 'navy',
  },
  {
    icon: CalendarDays,
    key: 'latest_updated_at',
    label: 'Dernière mise à jour',
    detail: 'Service le plus récent',
    tone: 'gold',
  },
]

const emptyForm = {
  title: '',
  description: '',
  icon: 'clipboard-list',
  order: 0,
  is_active: true,
}

function AdminServices() {
  const [services, setServices] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, latest_updated_at: null })
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 })
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { notify } = useToast()

  const loadServices = async (nextPage = page) => {
    setLoading(true)
    try {
      const response = await servicesApi.list({ page: nextPage })
      const servicePage = response.services || response
      const rows = Array.isArray(servicePage.data) ? servicePage.data : servicePage
      setServices(rows.map(mapService))
      setStats(response.stats || calculateStats(rows))
      setMeta({
        current_page: servicePage.current_page || nextPage,
        last_page: servicePage.last_page || 1,
        from: servicePage.from || (rows.length ? 1 : 0),
        to: servicePage.to || rows.length,
        total: servicePage.total || rows.length,
      })
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les services.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices(page)
  }, [page])

  const visibleServices = useMemo(() => services.filter((service) => (
    statusFilter === 'all' || service.rawStatus === statusFilter
  )), [services, statusFilter])

  const openCreate = () => {
    setEditingService(null)
    setForm({ ...emptyForm, order: services.length + 1 })
    setErrors({})
  }

  const openEdit = async (service) => {
    setErrors({})
    try {
      const fresh = await servicesApi.show(service.id)
      setEditingService(fresh)
      setForm({
        title: fresh.title || '',
        description: fresh.description || '',
        icon: fresh.icon || 'clipboard-list',
        order: fresh.order ?? 0,
        is_active: Boolean(fresh.is_active),
      })
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger le service.'), 'error')
    }
  }

  const closeForm = () => {
    setEditingService(null)
    setForm(emptyForm)
    setErrors({})
  }

  const saveService = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const payload = {
        ...form,
        order: Number(form.order || 0),
        is_active: Boolean(form.is_active),
      }

      if (editingService) {
        await servicesApi.update(editingService.id, payload)
        notify('Service mis à jour.')
      } else {
        await servicesApi.create(payload)
        notify('Service ajouté.')
      }

      closeForm()
      loadServices(page)
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(Object.fromEntries(Object.entries(error.response.data.errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])))
      }
      notify(apiErrorMessage(error, editingService ? 'Mise à jour impossible.' : 'Création impossible.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return
    setDeleting(true)
    try {
      await servicesApi.remove(serviceToDelete.id)
      setServiceToDelete(null)
      notify('Service supprimé.')
      loadServices(page)
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
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Services</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d’Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span>Services</span>
          </nav>
        </div>

        <button type="button" onClick={openCreate} className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Plus size={22} />
          Ajouter un service
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} value={formatStatValue(stat.key, stats[stat.key])} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des services</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="inline-flex h-[44px] items-center justify-between gap-7 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="inline-flex items-center gap-3">
                <Filter size={17} />
                Statut
              </span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-transparent text-[14px] font-extrabold outline-none">
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </label>
            <button type="button" className="inline-flex h-[44px] items-center justify-between gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="text-[#33496f]">Trier par :</span>
              Ordre
              <ChevronDown size={17} />
            </button>
          </div>
        </div>
        {loading ? <p className="mt-4 text-sm font-bold text-[#52668c]">Chargement des services...</p> : null}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <thead>
              <tr className="border-y border-[#e8edf4] bg-[#fbfcfe] text-[13px] font-extrabold text-[#24395f]">
                <th className="w-[56px] px-3 py-5">#</th>
                <th className="w-[250px] px-3 py-5">Service</th>
                <th className="px-3 py-5">Description</th>
                <th className="w-[130px] px-3 py-5">Statut</th>
                <th className="w-[110px] px-3 py-5 text-center">Ordre</th>
                <th className="w-[165px] px-3 py-5">Date de création</th>
                <th className="w-[130px] px-3 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf4]">
              {visibleServices.map((service) => (
                <ServiceRow key={service.id} service={service} onEdit={openEdit} onDelete={setServiceToDelete} />
              ))}
              {!loading && !visibleServices.length ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm font-bold text-[#52668c]">Aucun service trouvé</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de {meta.from || 0} à {meta.to || visibleServices.length} sur {meta.total || visibleServices.length} services</p>
          <div className="flex items-center gap-3">
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

      <ServiceFormModal
        open={Boolean(editingService) || form !== emptyForm}
        editing={Boolean(editingService)}
        form={form}
        errors={errors}
        saving={saving}
        onChange={setForm}
        onClose={closeForm}
        onSubmit={saveService}
      />
      <ConfirmDeleteModal
        open={Boolean(serviceToDelete)}
        title="Supprimer le service"
        message="Êtes-vous sûr de vouloir supprimer ce service ?"
        details="Cette action est irréversible."
        loading={deleting}
        onCancel={() => {
          if (!deleting) setServiceToDelete(null)
        }}
        onConfirm={confirmDeleteService}
      />
    </div>
  )
}

function StatCard({ icon: Icon, value, label, detail, tone }) {
  const isGold = tone === 'gold'

  return (
    <article className="flex min-h-[145px] items-center gap-6 rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <span className={`grid size-[64px] shrink-0 place-items-center rounded-full text-white shadow-[0_12px_24px_rgba(6,31,73,0.14)] ${isGold ? 'bg-[linear-gradient(145deg,#d9a23b,#bb7b16)]' : 'bg-[#061f49]'}`}>
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

function ServiceRow({ service, onEdit, onDelete }) {
  const Icon = service.icon

  return (
    <tr className="text-[14px] text-[#071f49]">
      <td className="px-3 py-5 font-medium">{service.id}</td>
      <td className="px-3 py-5">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#fbf3e7] text-[#c88a22]">
            <Icon size={23} strokeWidth={2.1} />
          </span>
          <span className="font-extrabold">{service.title}</span>
        </div>
      </td>
      <td className="max-w-[470px] px-3 py-5">
        <p className="leading-7 text-[#071f49]">{service.description}</p>
      </td>
      <td className="px-3 py-5">
        <StatusBadge status={service.rawStatus} />
      </td>
      <td className="px-3 py-5 text-center font-medium">{service.order}</td>
      <td className="px-3 py-5 font-medium">{service.date}</td>
      <td className="px-3 py-5">
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => onEdit(service)} aria-label={`Modifier ${service.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#006dff] transition hover:bg-[#eef6ff]">
            <Pencil size={18} />
          </button>
          <button type="button" onClick={() => onDelete(service)} aria-label={`Supprimer ${service.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#ff1717] transition hover:bg-[#fff0f0]">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function ServiceFormModal({ open, editing, form, errors, saving, onChange, onClose, onSubmit }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#061f49]/45 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_24px_70px_rgba(6,31,73,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#c88a22]">Service</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#071f49]">{editing ? 'Modifier le service' : 'Ajouter un service'}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#071f49]">
            <X size={18} />
          </button>
        </div>

        <FormField label="Titre" error={errors.title}>
          <input value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]" />
        </FormField>
        <FormField label="Description" error={errors.description} className="mt-4">
          <textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className="mt-2 min-h-28 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 py-3 outline-none focus:border-[#c88a22]" />
        </FormField>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <FormField label="Icône" error={errors.icon}>
            <select value={form.icon} onChange={(event) => onChange({ ...form, icon: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]">
              <option value="bar-chart-3">Analyse</option>
              <option value="settings">Technique</option>
              <option value="pie-chart">Finance</option>
              <option value="folder">Dossier</option>
              <option value="handshake">Accompagnement</option>
              <option value="clipboard-list">Conseil</option>
            </select>
          </FormField>
          <FormField label="Ordre" error={errors.order}>
            <input type="number" min="0" value={form.order} onChange={(event) => onChange({ ...form, order: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]" />
          </FormField>
          <label className="block pt-7">
            <span className="inline-flex items-center gap-3 text-sm font-extrabold text-[#071f49]">
              <input type="checkbox" checked={form.is_active} onChange={(event) => onChange({ ...form, is_active: event.target.checked })} className="size-4 accent-[#c88a22]" />
              Actif
            </span>
          </label>
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

function FormField({ label, error, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-extrabold text-[#071f49]">{label}</span>
      {children}
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  )
}

function StatusBadge({ status }) {
  const active = status === 'active'

  return (
    <span className={`inline-flex items-center gap-2 rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold ${active ? 'bg-[#d9f4e3] text-[#008e43]' : 'bg-[#fff0f0] text-[#c61a1a]'}`}>
      <span className={`size-1.5 rounded-full ${active ? 'bg-[#008e43]' : 'bg-[#c61a1a]'}`} />
      {active ? 'Actif' : 'Inactif'}
    </span>
  )
}

function mapService(service) {
  const icons = { settings: Settings, 'pie-chart': PieChart, folder: Folder, handshake: Handshake, 'bar-chart-3': BarChart3, 'clipboard-list': ClipboardList }
  const active = Boolean(service.is_active)
  return {
    id: service.id,
    icon: icons[service.icon] || ClipboardList,
    iconName: service.icon,
    title: service.title,
    description: service.description,
    rawStatus: active ? 'active' : 'inactive',
    order: service.order,
    date: service.created_at ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(service.created_at)) : '-',
  }
}

function calculateStats(rows) {
  const active = rows.filter((service) => Boolean(service.is_active)).length
  const latest = rows.reduce((latestDate, service) => {
    if (!service.updated_at) return latestDate
    const value = new Date(service.updated_at)
    return !latestDate || value > latestDate ? value : latestDate
  }, null)

  return {
    total: rows.length,
    active,
    inactive: rows.length - active,
    latest_updated_at: latest?.toISOString() || null,
  }
}

function formatStatValue(key, value) {
  if (key !== 'latest_updated_at') return String(value || 0)
  if (!value) return '-'

  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

export default AdminServices
