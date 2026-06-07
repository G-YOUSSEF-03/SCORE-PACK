import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  Inbox,
  MailOpen,
  MessageSquareText,
  Reply,
  Send,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { messagesApi } from '../../api/resources.js'
import { useToast } from '../../context/ToastContext.jsx'

const statTemplates = [
  { key: 'total', icon: MessageSquareText, label: 'Total des messages', detail: 'Tous les messages recus', tone: 'navy' },
  { key: 'unread', icon: Inbox, label: 'Nouveaux messages', detail: 'Non lus', tone: 'gold' },
  { key: 'read', icon: MailOpen, label: 'Messages lus', detail: 'Traites', tone: 'muted' },
  { key: 'pending', icon: Clock3, label: 'En attente', detail: 'Non lus', tone: 'gold' },
]

const emptyStats = {
  total: 0,
  unread: 0,
  read: 0,
  pending: 0,
}

function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyOpen, setReplyOpen] = useState(false)
  const { notify } = useToast()

  const loadMessages = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await messagesApi.list()
      const rows = (response.messages || []).map(mapMessage)
      setMessages(rows)
      setStats({ ...emptyStats, ...(response.stats || {}) })
      setSelected((current) => rows.find((message) => message.id === current?.id) || rows[0] || null)
    } catch (requestError) {
      const message = apiErrorMessage(requestError, 'Impossible de charger les messages.')
      setError(message)
      notify(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const selectMessage = async (message) => {
    setSelected(message)

    if (!message.unread) return

    const readMessage = { ...message, unread: false, is_read: true, statusLabel: 'Lu', tone: 'blue' }
    setSelected(readMessage)
    setMessages((current) => current.map((item) => (item.id === message.id ? readMessage : item)))
    setStats((current) => ({
      ...current,
      unread: Math.max(Number(current.unread || 0) - 1, 0),
      read: Number(current.read || 0) + 1,
      pending: Math.max(Number(current.pending || 0) - 1, 0),
    }))

    try {
      const data = await messagesApi.markRead(message.id)
      const updated = mapMessage(data)
      setSelected(updated)
      setMessages((current) => current.map((item) => (item.id === message.id ? updated : item)))
      loadMessages()
    } catch (requestError) {
      notify(apiErrorMessage(requestError, 'Mise a jour impossible.'), 'error')
      loadMessages()
    }
  }

  const deleteMessage = async (message) => {
    if (!window.confirm(`Supprimer le message de ${message.sender} ?`)) return
    try {
      await messagesApi.remove(message.id)
      notify('Message supprime.')
      setSelected(null)
      loadMessages()
    } catch (requestError) {
      notify(apiErrorMessage(requestError, 'Suppression impossible.'), 'error')
    }
  }

  const openReply = (message) => {
    setSelected(message)
    setReplyOpen(true)
  }

  const sendReply = async (message, replyMessage) => {
    try {
      await messagesApi.reply(message.id, { message: replyMessage })
      notify('Reponse envoyee.')
      setReplyOpen(false)
      loadMessages()
    } catch (requestError) {
      throw new Error(apiErrorMessage(requestError, 'Impossible d envoyer la reponse.'))
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Gestion des Messages</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d'Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span className="text-[#c88a22]">Gestion des Messages</span>
          </nav>
        </div>

        <button type="button" className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Download size={20} />
          Exporter
          <ChevronDown size={18} />
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {buildStats(stats).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {error ? <p className="rounded-[12px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

      <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <InboxCard messages={messages} selected={selected} loading={loading} unreadCount={stats.unread} totalCount={stats.total} onSelect={selectMessage} />
        <MessageDetailCard message={selected} onDelete={deleteMessage} onReply={openReply} />
      </section>

      {replyOpen && selected ? (
        <ReplyModal message={selected} onClose={() => setReplyOpen(false)} onSend={sendReply} />
      ) : null}
    </div>
  )
}

function buildStats(stats) {
  return statTemplates.map((stat) => ({
    ...stat,
    value: String(stats[stat.key] ?? 0),
  }))
}

function StatCard({ icon: Icon, value, label, detail, tone }) {
  const isGold = tone === 'gold'
  const isMuted = tone === 'muted'

  return (
    <article className="flex min-h-[145px] items-center gap-6 rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <span className={`grid size-[64px] shrink-0 place-items-center rounded-full text-white shadow-[0_12px_24px_rgba(6,31,73,0.14)] ${isGold ? 'bg-[linear-gradient(145deg,#d9a23b,#bb7b16)]' : isMuted ? 'bg-[#657998]' : 'bg-[#061f49]'}`}>
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

function InboxCard({ messages, selected, loading, unreadCount, totalCount, onSelect }) {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">Boite de reception</h2>
          <span className="rounded-full bg-[#fbefd9] px-4 py-1.5 text-[13px] font-extrabold text-[#b87408]">{unreadCount} non lus</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="inline-flex h-[44px] items-center justify-between gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
            <span className="text-[#33496f]">Trier par :</span>
            Plus recents
            <ChevronDown size={17} />
          </button>
          <button type="button" className="inline-flex h-[44px] items-center justify-center gap-3 rounded-[8px] border border-[#dce4ef] bg-white px-5 text-[14px] font-extrabold text-[#071f49]">
            <Filter size={17} />
            Filtres
          </button>
        </div>
      </div>
      {loading ? <p className="mt-4 text-sm font-bold text-[#52668c]">Chargement des messages...</p> : null}

      <div className="mt-5 divide-y divide-[#e8edf4]">
        {messages.map((message) => (
          <MessageListItem key={message.id} message={{ ...message, selected: selected?.id === message.id }} onSelect={onSelect} />
        ))}
        {!loading && !messages.length ? <p className="py-8 text-sm font-bold text-[#52668c]">Aucun message reçu</p> : null}
      </div>

      <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-medium text-[#52668c]">Affichage de {messages.length ? 1 : 0} a {messages.length} sur {totalCount} messages</p>
      </div>
    </article>
  )
}

function MessageListItem({ message, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(message)} className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-3 py-[18px] text-left transition hover:bg-[#f6f9fe] ${message.selected ? 'bg-[#f0f7ff]' : 'bg-white'}`}>
      <Avatar initials={message.initials} tone={message.tone} />
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-extrabold text-[#071f49]">{message.sender}</span>
        <span className="mt-1 block truncate text-[14px] font-extrabold text-[#102a58]">{message.subject}</span>
        <span className="mt-1 block truncate text-[14px] font-medium text-[#5b6e94]">{message.email} / {message.phone}</span>
      </span>
      <span className="flex min-w-[78px] flex-col items-end gap-3 text-[13px] font-medium text-[#40577f]">
        {message.time}
        {message.unread ? <span className="rounded-full bg-[#eaf3ff] px-2 py-1 text-[11px] font-extrabold text-[#0877ff]">{message.statusLabel}</span> : <span className="size-2.5" />}
      </span>
    </button>
  )
}

function MessageDetailCard({ message, onDelete, onReply }) {
  const messageText = getMessageText(message)

  if (!message) {
    return <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">Aucun message selectionne.</article>
  }

  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">{message.subject}</h2>
        <div className="flex gap-3">
          <IconButton label="Repondre" icon={Reply} onClick={() => onReply(message)} />
          <IconButton label="Favori" icon={Star} />
          <IconButton label="Supprimer" icon={Trash2} danger onClick={() => onDelete(message)} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-5">
          <Avatar initials={message.initials} tone={message.tone} large />
          <div>
            <p className="text-[15px] font-extrabold text-[#071f49]">{message.sender}</p>
            <p className="mt-2 text-[14px] font-medium text-[#33496f]">{message.email} / {message.phone}</p>
            <p className="mt-3 text-[14px] font-medium text-[#071f49]">Statut : {message.statusLabel}</p>
          </div>
        </div>
        <p className="text-[14px] font-medium text-[#33496f]">{message.fullDate}</p>
      </div>

      <div className="mt-7 rounded-[12px] bg-[#f7f9fc] px-5 py-5 text-[15px] font-medium leading-8 text-[#071f49]">
        {messageText.split('\n').map((line, index) => <p key={`${index}-${line}`} className="mt-2">{line}</p>)}
      </div>
    </article>
  )
}

function ReplyModal({ message, onClose, onSend }) {
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!replyMessage.trim()) {
      setError('Le message est obligatoire.')
      return
    }

    setSending(true)
    try {
      await onSend(message, replyMessage)
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#061f49]/45 px-4">
      <form onSubmit={submit} className="w-full max-w-[620px] rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_24px_70px_rgba(6,31,73,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Repondre</h2>
            <p className="mt-2 text-sm font-semibold text-[#52668c]">To: {message.email}</p>
            <p className="mt-1 text-sm font-semibold text-[#52668c]">Subject: Re: {message.subject}</p>
          </div>
          <button type="button" aria-label="Fermer" onClick={onClose} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#061f49] transition hover:bg-[#f3f6fb]">
            <X size={18} />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-extrabold text-[#071f49]">Message</span>
          <textarea
            value={replyMessage}
            onChange={(event) => setReplyMessage(event.target.value)}
            className="mt-2 min-h-[170px] w-full resize-none rounded-[12px] border border-[#dce4ef] bg-[#f7f9fc] px-4 py-3 text-[15px] font-medium text-[#071f49] outline-none transition focus:border-[#c88a22] focus:bg-white"
          />
        </label>

        {error ? <p className="mt-3 text-sm font-bold text-red-600">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-[8px] border border-[#dce4ef] bg-white px-5 text-sm font-extrabold text-[#071f49] transition hover:bg-[#f3f6fb]">
            Annuler
          </button>
          <button type="submit" disabled={sending} className="inline-flex h-11 items-center gap-3 rounded-[8px] bg-[#061f49] px-6 text-sm font-extrabold text-white shadow-[0_12px_22px_rgba(6,31,73,0.16)] transition hover:bg-[#0b2d63] disabled:opacity-60">
            {sending ? 'Envoi...' : 'Envoyer'}
            <Send size={17} />
          </button>
        </div>
      </form>
    </div>
  )
}

function IconButton({ label, icon: Icon, danger = false, disabled = false, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={`grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] transition disabled:cursor-not-allowed disabled:opacity-45 ${danger ? 'text-[#ff1717] hover:bg-[#fff0f0]' : 'text-[#061f49] hover:bg-[#f3f6fb]'}`}>
      <Icon size={18} />
    </button>
  )
}

function Avatar({ initials, tone, large = false }) {
  const tones = {
    blue: 'bg-[#dceaff] text-[#006dff]',
    gold: 'bg-[#fbefd9] text-[#b87408]',
    purple: 'bg-[#ece5ff] text-[#6340bd]',
    green: 'bg-[#d9f4e3] text-[#008e43]',
    pink: 'bg-[#ffe1e8] text-[#d51d42]',
    slate: 'bg-[#e9edf4] text-[#415577]',
  }

  return (
    <span className={`grid shrink-0 place-items-center rounded-full text-[18px] font-extrabold ${large ? 'size-[58px]' : 'size-[54px]'} ${tones[tone] || tones.blue}`}>
      {initials}
    </span>
  )
}

function mapMessage(message) {
  const createdAt = message.created_at ? new Date(message.created_at) : new Date()
  const sender = message.full_name || ''
  const unread = !message.is_read

  return {
    id: message.id,
    initials: sender.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SP',
    sender,
    subject: message.subject,
    message: message.message || '',
    email: message.email,
    phone: message.phone,
    is_read: message.is_read,
    time: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(createdAt),
    fullDate: `${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(createdAt)} a ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(createdAt)}`,
    unread,
    statusLabel: unread ? 'Non lu' : 'Lu',
    tone: unread ? 'gold' : 'blue',
  }
}

function getMessageText(message) {
  return message?.message || ''
}

export default AdminMessages
