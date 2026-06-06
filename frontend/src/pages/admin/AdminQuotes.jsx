/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  Inbox,
  Pencil,
  Trash2,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { quotesApi } from '../../api/resources.js'
import { useToast } from '../../context/ToastContext.jsx'

const stats = [
  {
    icon: FileText,
    value: '28',
    label: 'Total des demandes',
    detail: 'Toutes les demandes reçues',
    tone: 'navy',
  },
  {
    icon: Inbox,
    value: '12',
    label: 'Nouvelles demandes',
    detail: 'Non traitées',
    tone: 'gold',
  },
  {
    icon: Clock3,
    value: '10',
    label: 'En cours de traitement',
    detail: 'Demandes en cours',
    tone: 'muted',
  },
  {
    icon: CheckCircle2,
    value: '6',
    label: 'Traitées',
    detail: 'Demandes finalisées',
    tone: 'gold',
  },
]

const fallbackQuoteRows = [
  {
    id: 1,
    client: 'Mohamed El Amrani',
    project: 'Complexe résidentiel à Casablanca',
    phone: '+212 6 12 34 56 78',
    email: 'm.elamrani@email.com',
    status: 'Nouvelle',
    date: '24 mai 2024',
    time: '10:30',
  },
  {
    id: 2,
    client: 'Sara Benali',
    project: 'Unité de production industrielle',
    phone: '+212 6 98 76 54 32',
    email: 's.benali@email.com',
    status: 'En cours',
    date: '23 mai 2024',
    time: '15:45',
  },
  {
    id: 3,
    client: 'Youssef Ait El Caid',
    project: 'Centrale solaire à Ouarzazate',
    phone: '+212 6 55 66 77 88',
    email: 'y.aitelcaid@email.com',
    status: 'En cours',
    date: '22 mai 2024',
    time: '09:15',
  },
  {
    id: 4,
    client: 'Khadija Zahraoui',
    project: 'Aménagement routier à Marrakech',
    phone: '+212 6 22 33 44 55',
    email: 'k.zahraoui@email.com',
    status: 'En attente',
    date: '21 mai 2024',
    time: '11:20',
  },
  {
    id: 5,
    client: 'Omar El Fassih',
    project: 'Complexe hôtelier à Agadir',
    phone: '+212 6 44 55 66 77',
    email: 'o.elfassih@email.com',
    status: 'Traitée',
    date: '20 mai 2024',
    time: '16:10',
  },
  {
    id: 6,
    client: 'Noura Belkacem',
    project: 'Extension portuaire à Nador',
    phone: '+212 6 33 22 11 00',
    email: 'n.belkacem@email.com',
    status: 'Traitée',
    date: '19 mai 2024',
    time: '14:05',
  },
]

function AdminQuotes() {
  const [quoteRows, setQuoteRows] = useState(fallbackQuoteRows)
  const [loading, setLoading] = useState(true)
  const { notify } = useToast()

  const loadQuotes = async () => {
    setLoading(true)
    try {
      const response = await quotesApi.list()
      setQuoteRows((response.data || response).map(mapQuote))
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les demandes.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuotes()
  }, [])

  const updateQuote = async (quote) => {
    const status = window.prompt('Statut: new, in_progress, pending, processed', quote.rawStatus || 'new')
    if (!status) return
    try {
      await quotesApi.update(quote.id, { status })
      notify('Demande mise à jour.')
      loadQuotes()
    } catch (error) {
      notify(apiErrorMessage(error, 'Mise à jour impossible.'), 'error')
    }
  }

  const deleteQuote = async (quote) => {
    if (!window.confirm(`Supprimer la demande de ${quote.client} ?`)) return
    try {
      await quotesApi.remove(quote.id)
      notify('Demande supprimée.')
      loadQuotes()
    } catch (error) {
      notify(apiErrorMessage(error, 'Suppression impossible.'), 'error')
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Demandes de devis</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d’Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span className="text-[#c88a22]">Demandes de devis</span>
          </nav>
        </div>
        {loading ? <p className="mt-4 text-sm font-bold text-[#52668c]">Chargement des demandes...</p> : null}

        <button type="button" className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Download size={20} />
          Exporter
          <ChevronDown size={18} />
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des demandes de devis</h2>
          <div className="flex flex-col gap-3 md:flex-row">
            <button type="button" className="inline-flex h-[44px] items-center justify-between gap-7 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="inline-flex items-center gap-3">
                <Filter size={17} />
                Tous les statuts
              </span>
              <ChevronDown size={17} />
            </button>
            <button type="button" className="inline-flex h-[44px] items-center justify-between gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <CalendarDays size={17} />
              Du 01/05/2024 au 24/05/2024
              <ChevronDown size={17} />
            </button>
            <button type="button" className="inline-flex h-[44px] items-center justify-center gap-3 rounded-[8px] border border-[#dce4ef] bg-white px-5 text-[14px] font-extrabold text-[#071f49]">
              <Filter size={17} />
              Filtres
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1240px] border-collapse text-left">
            <thead>
              <tr className="border-y border-[#e8edf4] bg-[#fbfcfe] text-[13px] font-extrabold text-[#24395f]">
                <th className="w-[56px] px-3 py-5">#</th>
                <th className="w-[185px] px-3 py-5">Client</th>
                <th className="w-[230px] px-3 py-5">Projet</th>
                <th className="w-[170px] px-3 py-5">Téléphone</th>
                <th className="w-[210px] px-3 py-5">Email</th>
                <th className="w-[130px] px-3 py-5">Statut</th>
                <th className="w-[170px] px-3 py-5">Date de la demande</th>
                <th className="w-[170px] px-3 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf4]">
              {quoteRows.map((quote) => (
                <QuoteRow key={quote.id} quote={quote} onEdit={updateQuote} onDelete={deleteQuote} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de 1 à 6 sur 28 demandes</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#33496f]">Précédent</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] bg-[#061f49] text-[15px] font-extrabold text-white shadow-[0_10px_20px_rgba(6,31,73,0.18)]">1</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">2</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">3</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">4</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">5</button>
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

function QuoteRow({ quote, onEdit, onDelete }) {
  return (
    <tr className="text-[14px] text-[#071f49]">
      <td className="px-3 py-5 font-medium">{quote.id}</td>
      <td className="px-3 py-5 font-extrabold">{quote.client}</td>
      <td className="px-3 py-5 font-extrabold leading-7">{quote.project}</td>
      <td className="px-3 py-5 font-medium">{quote.phone}</td>
      <td className="px-3 py-5 font-medium">{quote.email}</td>
      <td className="px-3 py-5">
        <StatusBadge status={quote.status} />
      </td>
      <td className="px-3 py-5 font-medium">
        <span className="block">{quote.date}</span>
        <span className="mt-1 block">{quote.time}</span>
      </td>
      <td className="px-3 py-5">
        <div className="flex justify-center gap-3">
          <button type="button" aria-label={`Voir ${quote.client}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#061f49] transition hover:bg-[#f3f6fb]">
            <Eye size={18} />
          </button>
          <button type="button" onClick={() => onEdit(quote)} aria-label={`Modifier ${quote.client}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#006dff] transition hover:bg-[#eef6ff]">
            <Pencil size={18} />
          </button>
          <button type="button" onClick={() => onDelete(quote)} aria-label={`Supprimer ${quote.client}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#ff1717] transition hover:bg-[#fff0f0]">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function StatusBadge({ status }) {
  const tones = {
    Nouvelle: 'bg-[#d9f4e3] text-[#008e43] before:bg-[#008e43]',
    'En cours': 'bg-[#dcecff] text-[#006dff] before:bg-[#006dff]',
    'En attente': 'bg-[#fbefd9] text-[#b87408] before:bg-[#c88a22]',
    Traitée: 'bg-[#d9f4e3] text-[#008e43] before:bg-[#008e43]',
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold before:size-1.5 before:rounded-full before:content-[''] ${tones[status]}`}>
      {status}
    </span>
  )
}

export default AdminQuotes

function mapQuote(quote) {
  const labels = { new: 'Nouvelle', in_progress: 'En cours', pending: 'En attente', processed: 'Traitée' }
  const date = new Date(quote.created_at)
  return {
    id: quote.id,
    client: quote.client_name,
    project: quote.project_title,
    phone: quote.phone,
    email: quote.email,
    status: labels[quote.status] || quote.status,
    rawStatus: quote.status,
    date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date),
    time: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date),
  }
}
