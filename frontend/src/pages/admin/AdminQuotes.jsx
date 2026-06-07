/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
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
  Mail,
  Search,
  Trash2,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { quotesApi } from '../../api/resources.js'
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const statusLabels = {
  new: 'Nouvelle',
  in_progress: 'En cours',
  treated: 'Traitée',
}

const statCards = [
  {
    key: 'total',
    icon: FileText,
    label: 'Total des demandes',
    detail: 'Toutes les demandes reçues',
    tone: 'navy',
  },
  {
    key: 'new',
    icon: Inbox,
    label: 'Nouvelles demandes',
    detail: 'Non traitées',
    tone: 'gold',
  },
  {
    key: 'in_progress',
    icon: Clock3,
    label: 'En cours de traitement',
    detail: 'Demandes en cours',
    tone: 'muted',
  },
  {
    key: 'treated',
    icon: CheckCircle2,
    label: 'Traitées',
    detail: 'Demandes finalisées',
    tone: 'gold',
  },
]

function AdminQuotes() {
  const [quoteRows, setQuoteRows] = useState([])
  const [stats, setStats] = useState({ total: 0, new: 0, in_progress: 0, treated: 0 })
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 })
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [quoteToDelete, setQuoteToDelete] = useState(null)
  const [replyQuote, setReplyQuote] = useState(null)
  const [replyForm, setReplyForm] = useState({ subject: '', message: '' })
  const [replying, setReplying] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { notify } = useToast()

  const loadQuotes = async (nextPage = page) => {
    setLoading(true)
    try {
      const response = await quotesApi.list({ page: nextPage })
      const requests = response.requests || response
      const rows = Array.isArray(requests.data) ? requests.data : requests
      setQuoteRows(rows.map(mapQuote))
      setStats(response.stats || calculateStats(rows))
      setMeta({
        current_page: requests.current_page || nextPage,
        last_page: requests.last_page || 1,
        from: requests.from || (rows.length ? 1 : 0),
        to: requests.to || rows.length,
        total: requests.total || rows.length,
      })
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les demandes.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuotes(page)
  }, [page])

  const filteredQuotes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return quoteRows.filter((quote) => {
      const matchesStatus = statusFilter === 'all' || quote.rawStatus === statusFilter
      const matchesSearch = !query || [quote.client, quote.project, quote.phone, quote.email, quote.projectType, quote.budget]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))

      return matchesStatus && matchesSearch
    })
  }, [quoteRows, searchTerm, statusFilter])

  const viewQuote = async (quote) => {
    try {
      const freshQuote = await quotesApi.show(quote.id)
      setSelectedQuote(mapQuote(freshQuote))
      setQuoteRows((rows) => rows.map((row) => (row.id === quote.id ? { ...row, isRead: true } : row)))
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible d’ouvrir la demande.'), 'error')
    }
  }

  const updateStatus = async (quote, status) => {
    try {
      const updated = await quotesApi.updateStatus(quote.id, status)
      setQuoteRows((rows) => rows.map((row) => (row.id === quote.id ? mapQuote(updated) : row)))
      setStats((current) => shiftStats(current, quote.rawStatus, status))
      notify('Statut mis à jour.')
    } catch (error) {
      notify(apiErrorMessage(error, 'Mise à jour impossible.'), 'error')
    }
  }

  const openReply = (quote) => {
    setReplyQuote(quote)
    setReplyForm({ subject: `Re: ${quote.project}`, message: '' })
  }

  const sendReply = async (event) => {
    event.preventDefault()
    if (!replyQuote || !replyForm.message.trim()) {
      notify('Le message de réponse est obligatoire.', 'error')
      return
    }

    setReplying(true)
    try {
      await quotesApi.reply(replyQuote.id, replyForm)
      notify('Réponse envoyée avec succès.')
      setReplyQuote(null)
      setReplyForm({ subject: '', message: '' })
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible d’envoyer la réponse.'), 'error')
    } finally {
      setReplying(false)
    }
  }

  const confirmDeleteQuote = async () => {
    if (!quoteToDelete) return
    setDeleting(true)
    try {
      await quotesApi.remove(quoteToDelete.id)
      setQuoteToDelete(null)
      notify('Demande supprimée.')
      loadQuotes(page)
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
        {statCards.map((stat) => (
          <StatCard key={stat.key} {...stat} value={stats[stat.key] || 0} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des demandes de devis</h2>
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="inline-flex h-[44px] items-center justify-between gap-5 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <span className="inline-flex items-center gap-3">
                <Filter size={17} />
                Statut
              </span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-transparent text-[14px] font-extrabold outline-none">
                <option value="all">Tous</option>
                <option value="new">Nouvelles</option>
                <option value="in_progress">En cours</option>
                <option value="treated">Traitées</option>
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
            <button type="button" className="inline-flex h-[44px] items-center justify-between gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
              <CalendarDays size={17} />
              Données réelles
              <ChevronDown size={17} />
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
                <th className="w-[150px] px-3 py-5">Statut</th>
                <th className="w-[170px] px-3 py-5">Date de la demande</th>
                <th className="w-[210px] px-3 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf4]">
              {filteredQuotes.map((quote) => (
                <QuoteRow key={quote.id} quote={quote} onView={viewQuote} onReply={openReply} onStatus={updateStatus} onDelete={setQuoteToDelete} />
              ))}
              {!loading && !filteredQuotes.length ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-sm font-bold text-[#52668c]">Aucune demande de devis trouvée.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de {meta.from || 0} à {meta.to || filteredQuotes.length} sur {meta.total || filteredQuotes.length} demandes</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#33496f] disabled:opacity-40">Précédent</button>
            {pages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`grid size-11 place-items-center rounded-[8px] text-[15px] ${page === pageNumber ? 'bg-[#061f49] font-extrabold text-white shadow-[0_10px_20px_rgba(6,31,73,0.18)]' : 'border border-[#dce4ef] font-medium text-[#071f49]'}`}
              >
                {pageNumber}
              </button>
            ))}
            <button type="button" disabled={page >= meta.last_page} onClick={() => setPage((value) => Math.min(meta.last_page, value + 1))} className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#33496f] disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </section>

      <QuoteDetailsModal quote={selectedQuote} onClose={() => setSelectedQuote(null)} onReply={openReply} />
      <ReplyModal quote={replyQuote} form={replyForm} replying={replying} onChange={setReplyForm} onClose={() => setReplyQuote(null)} onSubmit={sendReply} />
      <ConfirmDeleteModal
        open={Boolean(quoteToDelete)}
        title="Supprimer la demande"
        message="Êtes-vous sûr de vouloir supprimer cette demande ?"
        details="Cette action est irréversible."
        loading={deleting}
        onCancel={() => {
          if (!deleting) setQuoteToDelete(null)
        }}
        onConfirm={confirmDeleteQuote}
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

function QuoteRow({ quote, onView, onReply, onStatus, onDelete }) {
  return (
    <tr className={`text-[14px] text-[#071f49] ${quote.isRead ? '' : 'bg-[#fffdf8]'}`}>
      <td className="px-3 py-5 font-medium">
        <span>{quote.id}</span>
        {!quote.isRead ? <span className="ml-2 inline-block size-2 rounded-full bg-[#c88a22]" /> : null}
      </td>
      <td className="px-3 py-5 font-extrabold">{quote.client}</td>
      <td className="px-3 py-5 font-extrabold leading-7">{quote.project}</td>
      <td className="px-3 py-5 font-medium">{quote.phone}</td>
      <td className="px-3 py-5 font-medium">{quote.email}</td>
      <td className="px-3 py-5">
        <select value={quote.rawStatus} onChange={(event) => onStatus(quote, event.target.value)} className="rounded-[7px] border border-[#dce4ef] bg-white px-2 py-1.5 text-[13px] font-extrabold text-[#071f49] outline-none">
          <option value="new">Nouvelle</option>
          <option value="in_progress">En cours</option>
          <option value="treated">Traitée</option>
        </select>
      </td>
      <td className="px-3 py-5 font-medium">
        <span className="block">{quote.date}</span>
        <span className="mt-1 block">{quote.time}</span>
      </td>
      <td className="px-3 py-5">
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => onView(quote)} aria-label={`Voir ${quote.client}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#061f49] transition hover:bg-[#f3f6fb]">
            <Eye size={18} />
          </button>
          <button type="button" onClick={() => onReply(quote)} aria-label={`Répondre ${quote.client}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#006dff] transition hover:bg-[#eef6ff]">
            <Mail size={18} />
          </button>
          <button type="button" onClick={() => onDelete(quote)} aria-label={`Supprimer ${quote.client}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#ff1717] transition hover:bg-[#fff0f0]">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function QuoteDetailsModal({ quote, onClose, onReply }) {
  if (!quote) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#061f49]/45 px-4">
      <div className="w-full max-w-2xl rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_24px_70px_rgba(6,31,73,0.2)]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#c88a22]">Demande de devis</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#071f49]">{quote.project}</h2>
          </div>
          <StatusBadge status={quote.rawStatus} />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label="Client" value={quote.client} />
          <Detail label="Email" value={quote.email} />
          <Detail label="Téléphone" value={quote.phone} />
          <Detail label="Type de projet" value={quote.projectType} />
          <Detail label="Budget" value={quote.budget} />
          <Detail label="Date" value={`${quote.date} - ${quote.time}`} />
        </div>
        <div className="mt-5 rounded-[14px] bg-[#f7f9fc] p-4">
          <p className="text-sm font-extrabold text-[#071f49]">Message</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#33496f]">{quote.message}</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-sm font-extrabold text-[#071f49]">Fermer</button>
          <button type="button" onClick={() => onReply(quote)} className="inline-flex h-11 items-center gap-3 rounded-[8px] bg-[#061f49] px-5 text-sm font-extrabold text-white">
            <Mail size={17} />
            Répondre
          </button>
        </div>
      </div>
    </div>
  )
}

function ReplyModal({ quote, form, replying, onChange, onClose, onSubmit }) {
  if (!quote) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#061f49]/45 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_24px_70px_rgba(6,31,73,0.2)]">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#c88a22]">Répondre au client</p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#071f49]">{quote.client}</h2>
        <p className="mt-4 text-sm font-bold text-[#33496f]">To: {quote.email}</p>
        <label className="mt-5 block">
          <span className="text-sm font-extrabold text-[#071f49]">Subject</span>
          <input value={form.subject} onChange={(event) => onChange({ ...form, subject: event.target.value })} className="mt-2 h-12 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 outline-none focus:border-[#c88a22]" />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-extrabold text-[#071f49]">Message</span>
          <textarea value={form.message} onChange={(event) => onChange({ ...form, message: event.target.value })} className="mt-2 min-h-40 w-full rounded-[10px] border border-[#dce4ef] bg-[#f7f9fc] px-4 py-3 outline-none focus:border-[#c88a22]" />
        </label>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" disabled={replying} onClick={onClose} className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-sm font-extrabold text-[#071f49] disabled:opacity-50">Annuler</button>
          <button type="submit" disabled={replying} className="inline-flex h-11 items-center gap-3 rounded-[8px] bg-[#061f49] px-5 text-sm font-extrabold text-white disabled:opacity-60">
            <Mail size={17} />
            {replying ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="rounded-[12px] border border-[#e8edf4] p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a9ab5]">{label}</p>
      <p className="mt-2 text-sm font-bold text-[#071f49]">{value || '-'}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const tones = {
    new: 'bg-[#d9f4e3] text-[#008e43] before:bg-[#008e43]',
    in_progress: 'bg-[#dcecff] text-[#006dff] before:bg-[#006dff]',
    treated: 'bg-[#d9f4e3] text-[#008e43] before:bg-[#008e43]',
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold before:size-1.5 before:rounded-full before:content-[''] ${tones[status] || tones.new}`}>
      {statusLabels[status] || status}
    </span>
  )
}

function mapQuote(quote) {
  const date = quote.created_at ? new Date(quote.created_at) : new Date()
  return {
    id: quote.id,
    client: quote.full_name,
    project: quote.project_title,
    projectType: quote.project_type,
    budget: quote.budget,
    message: quote.message,
    phone: quote.phone,
    email: quote.email,
    status: statusLabels[quote.status] || quote.status,
    rawStatus: quote.status,
    isRead: Boolean(quote.is_read),
    date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date),
    time: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date),
  }
}

function calculateStats(rows) {
  return rows.reduce((current, quote) => ({
    ...current,
    total: current.total + 1,
    [quote.status]: (current[quote.status] || 0) + 1,
  }), { total: 0, new: 0, in_progress: 0, treated: 0 })
}

function shiftStats(current, previous, next) {
  if (previous === next) return current

  return {
    ...current,
    [previous]: Math.max(0, (current[previous] || 0) - 1),
    [next]: (current[next] || 0) + 1,
  }
}

export default AdminQuotes
