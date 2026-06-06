/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from 'react'
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
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { servicesApi } from '../../api/resources.js'
import { useToast } from '../../context/ToastContext.jsx'

const stats = [
  {
    icon: ClipboardList,
    value: '6',
    label: 'Total des services',
    detail: 'Tous les services disponibles',
    tone: 'navy',
  },
  {
    icon: ClipboardList,
    value: '6',
    label: 'Services actifs',
    detail: 'Visibles sur le site',
    tone: 'gold',
  },
  {
    icon: EyeOff,
    value: '0',
    label: 'Services inactifs',
    detail: 'Masqués du site',
    tone: 'navy',
  },
  {
    icon: CalendarDays,
    value: '12 mai 2024',
    label: 'Dernière mise à jour',
    detail: 'Il y a 2 jours',
    tone: 'gold',
  },
]

const fallbackServices = [
  {
    id: 1,
    icon: BarChart3,
    title: 'Études de faisabilité',
    description: 'Nous analysons la viabilité de votre projet sous tous ses aspects (techniques, économiques, financiers et juridiques).',
    status: 'Actif',
    order: 1,
    date: '10 mai 2024',
  },
  {
    id: 2,
    icon: Settings,
    title: 'Études techniques',
    description: 'Conception technique détaillée, dimensionnement et choix technologiques adaptés à votre projet.',
    status: 'Actif',
    order: 2,
    date: '10 mai 2024',
  },
  {
    id: 3,
    icon: PieChart,
    title: 'Études financières',
    description: 'Prévisions financières, analyses de rentabilité et plans de financement sur mesure.',
    status: 'Actif',
    order: 3,
    date: '10 mai 2024',
  },
  {
    id: 4,
    icon: Folder,
    title: 'Montage de dossiers',
    description: 'Constitution de dossiers solides et complets pour banques, investisseurs et organismes de financement.',
    status: 'Actif',
    order: 4,
    date: '10 mai 2024',
  },
  {
    id: 5,
    icon: Handshake,
    title: 'Accompagnement',
    description: "Nous vous accompagnons à chaque étape de votre projet jusqu'à sa concrétisation.",
    status: 'Actif',
    order: 5,
    date: '10 mai 2024',
  },
  {
    id: 6,
    icon: ClipboardList,
    title: 'Conseil stratégique',
    description: 'Conseils personnalisés pour optimiser vos décisions et maximiser la performance de vos investissements.',
    status: 'Actif',
    order: 6,
    date: '10 mai 2024',
  },
]

function AdminServices() {
  const [services, setServices] = useState(fallbackServices)
  const [loading, setLoading] = useState(true)
  const { notify } = useToast()

  const loadServices = async () => {
    setLoading(true)
    try {
      const response = await servicesApi.list()
      setServices((response.data || response).map(mapService))
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les services.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const addService = async () => {
    const title = window.prompt('Titre du service')
    if (!title) return
    const description = window.prompt('Description du service') || ''
    try {
      await servicesApi.create({ title, description, icon: 'clipboard-list', status: 'active', order: services.length + 1 })
      notify('Service ajouté.')
      loadServices()
    } catch (error) {
      notify(apiErrorMessage(error, 'Création impossible.'), 'error')
    }
  }

  const editService = async (service) => {
    const title = window.prompt('Titre du service', service.title)
    if (!title) return
    const description = window.prompt('Description du service', service.description) || service.description
    try {
      await servicesApi.update(service.id, { title, description, icon: service.iconName || 'clipboard-list', status: service.rawStatus || 'active', order: service.order })
      notify('Service mis à jour.')
      loadServices()
    } catch (error) {
      notify(apiErrorMessage(error, 'Mise à jour impossible.'), 'error')
    }
  }

  const deleteService = async (service) => {
    if (!window.confirm(`Supprimer "${service.title}" ?`)) return
    try {
      await servicesApi.remove(service.id)
      notify('Service supprimé.')
      loadServices()
    } catch (error) {
      notify(apiErrorMessage(error, 'Suppression impossible.'), 'error')
    }
  }

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

        <button type="button" onClick={addService} className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Plus size={22} />
          Ajouter un service
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des services</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex h-[44px] items-center justify-between gap-7 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="inline-flex items-center gap-3">
                <Filter size={17} />
                Tous les statuts
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
        {loading ? <p className="mt-4 text-sm font-bold text-[#52668c]">Chargement des services...</p> : null}

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left">
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
              {services.map((service) => (
                <ServiceRow key={service.id} service={service} onEdit={editService} onDelete={deleteService} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de 1 à 6 sur 6 services</p>
          <div className="flex items-center gap-3">
            <button type="button" className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#8a9ab5]">Précédent</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] bg-[#061f49] text-[15px] font-extrabold text-white shadow-[0_10px_20px_rgba(6,31,73,0.18)]">1</button>
            <button type="button" className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#33496f]">Suivant</button>
          </div>
        </div>
      </section>
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
        <span className="inline-flex items-center gap-2 rounded-[7px] bg-[#d9f4e3] px-3 py-1.5 text-[13px] font-extrabold text-[#008e43]">
          <span className="size-1.5 rounded-full bg-[#008e43]" />
          {service.status}
        </span>
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

export default AdminServices

function mapService(service) {
  const icons = { settings: Settings, 'pie-chart': PieChart, folder: Folder, handshake: Handshake, 'bar-chart-3': BarChart3, 'clipboard-list': ClipboardList }
  return {
    id: service.id,
    icon: icons[service.icon] || ClipboardList,
    iconName: service.icon,
    title: service.title,
    description: service.description,
    status: service.status === 'active' ? 'Actif' : 'Inactif',
    rawStatus: service.status,
    order: service.order,
    date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(service.created_at)),
  }
}
