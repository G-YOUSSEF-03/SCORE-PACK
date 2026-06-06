/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from 'react'
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  Inbox,
  MailOpen,
  MessageSquareText,
  Paperclip,
  Reply,
  Send,
  Smile,
  Star,
  Trash2,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { messagesApi } from '../../api/resources.js'
import { useToast } from '../../context/ToastContext.jsx'

const stats = [
  {
    icon: MessageSquareText,
    value: '58',
    label: 'Total des messages',
    detail: 'Tous les messages reçus',
    tone: 'navy',
  },
  {
    icon: Inbox,
    value: '12',
    label: 'Nouveaux messages',
    detail: 'Non lus',
    tone: 'gold',
  },
  {
    icon: MailOpen,
    value: '34',
    label: 'Répondus',
    detail: 'Messages traités',
    tone: 'muted',
  },
  {
    icon: Clock3,
    value: '12',
    label: 'En attente',
    detail: 'Sans réponse',
    tone: 'gold',
  },
]

const fallbackMessages = [
  {
    initials: 'MA',
    sender: 'Mohamed El Amrani',
    subject: "Demande d'information sur vos services",
    preview: "Bonjour, je souhaite avoir plus d'informations sur...",
    time: '10:30',
    unread: true,
    selected: true,
    tone: 'blue',
  },
  {
    initials: 'SB',
    sender: 'Sara Benali',
    subject: 'Devis pour étude technique',
    preview: 'Bonjour, je voudrais demander un devis pour une étude...',
    time: 'Hier',
    unread: true,
    tone: 'gold',
  },
  {
    initials: 'YA',
    sender: 'Youssef Ait El Caid',
    subject: 'Collaboration possible',
    preview: 'Bonjour, nous sommes intéressés par une collaboration...',
    time: '22 mai',
    tone: 'purple',
  },
  {
    initials: 'KZ',
    sender: 'Khadija Zahraoui',
    subject: 'Renseignement sur un projet',
    preview: "Bonjour, j'ai un projet immobilier et j'aimerais avoir...",
    time: '21 mai',
    unread: true,
    tone: 'green',
  },
  {
    initials: 'OE',
    sender: 'Omar El Fassih',
    subject: 'Question concernant les délais',
    preview: "Quels sont les délais moyens pour la réalisation d'une...",
    time: '20 mai',
    tone: 'pink',
  },
  {
    initials: 'NB',
    sender: 'Noura Belkacem',
    subject: 'Information générale',
    preview: "Bonjour, j'aimerais en savoir plus sur votre bureau...",
    time: '19 mai',
    tone: 'slate',
  },
]

function AdminMessages() {
  const [messages, setMessages] = useState(fallbackMessages)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const { notify } = useToast()

  const loadMessages = async () => {
    setLoading(true)
    try {
      const response = await messagesApi.list()
      const rows = (response.data || response).map(mapMessage)
      setMessages(rows)
      setSelected((current) => current || rows[0] || null)
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les messages.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const selectMessage = async (message) => {
    try {
      const data = await messagesApi.show(message.id)
      setSelected(mapMessage(data, true))
      loadMessages()
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible d’ouvrir le message.'), 'error')
    }
  }

  const deleteMessage = async (message) => {
    if (!window.confirm(`Supprimer le message de ${message.sender} ?`)) return
    try {
      await messagesApi.remove(message.id)
      notify('Message supprimé.')
      setSelected(null)
      loadMessages()
    } catch (error) {
      notify(apiErrorMessage(error, 'Suppression impossible.'), 'error')
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Messages / Contacts</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d’Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span className="text-[#c88a22]">Messages / Contacts</span>
          </nav>
        </div>

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

      <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <InboxCard messages={messages} selected={selected} loading={loading} onSelect={selectMessage} />
        <MessageDetailCard message={selected} onDelete={deleteMessage} onReplied={loadMessages} />
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

function InboxCard({ messages, selected, loading, onSelect }) {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">Boîte de réception</h2>
          <span className="rounded-full bg-[#fbefd9] px-4 py-1.5 text-[13px] font-extrabold text-[#b87408]">12 non lus</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="inline-flex h-[44px] items-center justify-between gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#071f49]">
            <span className="text-[#33496f]">Trier par :</span>
            Plus récents
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
          <MessageListItem key={message.id || message.sender} message={{ ...message, selected: selected?.id === message.id }} onSelect={onSelect} />
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-medium text-[#52668c]">Affichage de 1 à 6 sur 58 messages</p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="grid size-9 place-items-center rounded-[8px] text-[#b7c2d4]">‹</button>
          <button type="button" className="grid size-10 place-items-center rounded-[8px] bg-[#061f49] text-[14px] font-extrabold text-white shadow-[0_10px_20px_rgba(6,31,73,0.18)]">1</button>
          <button type="button" className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[14px] font-medium text-[#071f49]">2</button>
          <button type="button" className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[14px] font-medium text-[#071f49]">3</button>
          <button type="button" className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[14px] font-medium text-[#071f49]">4</button>
          <button type="button" className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[14px] font-medium text-[#071f49]">5</button>
          <span className="px-1 text-[#52668c]">...</span>
          <button type="button" className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[14px] font-medium text-[#071f49]">10</button>
          <button type="button" className="grid size-9 place-items-center rounded-[8px] text-[#071f49]">›</button>
        </div>
      </div>
    </article>
  )
}

function MessageListItem({ message, onSelect }) {
  const messageText = getMessageText(message)
  const preview = message.preview || truncateText(messageText)

  return (
    <button
      type="button"
      onClick={() => onSelect(message)}
      className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-3 py-[18px] text-left transition hover:bg-[#f6f9fe] ${
        message.selected ? 'bg-[#f0f7ff]' : 'bg-white'
      }`}
    >
      <Avatar initials={message.initials} tone={message.tone} />
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-extrabold text-[#071f49]">{message.sender}</span>
        <span className="mt-1 block truncate text-[14px] font-extrabold text-[#102a58]">{message.subject}</span>
        <span className="mt-1 block truncate text-[14px] font-medium text-[#5b6e94]">{preview}</span>
      </span>
      <span className="flex min-w-[58px] flex-col items-end gap-4 text-[13px] font-medium text-[#40577f]">
        {message.time}
        {message.unread ? <span className="size-2.5 rounded-full bg-[#0877ff]" /> : <span className="size-2.5" />}
      </span>
    </button>
  )
}

function MessageDetailCard({ message, onDelete, onReplied }) {
  const [reply, setReply] = useState('')
  const { notify } = useToast()
  const messageText = getMessageText(message)

  const sendReply = async () => {
    if (!message?.id || !reply.trim()) return
    try {
      await messagesApi.reply(message.id, { reply, status: 'replied' })
      notify('Réponse envoyée.')
      setReply('')
      onReplied()
    } catch (error) {
      notify(apiErrorMessage(error, 'Envoi impossible.'), 'error')
    }
  }

  if (!message) {
    return <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">Aucun message sélectionné.</article>
  }

  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">{message.subject}</h2>
        <div className="flex gap-3">
          <IconButton label="Répondre" icon={Reply} />
          <IconButton label="Favori" icon={Star} />
          <IconButton label="Supprimer" icon={Trash2} danger onClick={() => onDelete(message)} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-5">
          <Avatar initials={message.initials} tone={message.tone} large />
          <div>
            <p className="text-[15px] font-extrabold text-[#071f49]">{message.sender}</p>
            <p className="mt-2 text-[14px] font-medium text-[#33496f]">
              {message.email} <span className="px-2 text-[#8a9ab5]">›</span> {message.phone || '—'}
            </p>
            <p className="mt-3 text-[14px] font-medium text-[#071f49]">À : contact@scorepack.ma</p>
          </div>
        </div>
        <p className="text-[14px] font-medium text-[#33496f]">{message.fullDate}</p>
      </div>

      <div className="mt-7 rounded-[12px] bg-[#f7f9fc] px-5 py-5 text-[15px] font-medium leading-8 text-[#071f49]">
        {messageText.split('\n').map((line, index) => <p key={`${index}-${line}`} className="mt-2">{line}</p>)}
      </div>

      <div className="mt-6 border-t border-[#e8edf4] pt-6">
        <h3 className="text-[18px] font-extrabold text-[#071f49]">Répondre</h3>
        <div className="mt-4 rounded-[10px] border border-[#dce4ef] bg-white p-4 focus-within:border-[#c88a22]">
          <textarea
            placeholder="Écrire votre réponse..."
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            className="min-h-[96px] w-full resize-none border-0 bg-transparent text-[15px] font-medium text-[#071f49] outline-none placeholder:text-[#7b8cad]"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[#061f49]">
              <button type="button" aria-label="Ajouter une pièce jointe" className="grid size-8 place-items-center rounded-lg hover:bg-[#f1f4f9]">
                <Paperclip size={19} />
              </button>
              <button type="button" aria-label="Ajouter un emoji" className="grid size-8 place-items-center rounded-lg hover:bg-[#f1f4f9]">
                <Smile size={19} />
              </button>
            </div>
            <button type="button" onClick={sendReply} className="inline-flex h-11 items-center gap-3 rounded-[8px] bg-[#061f49] px-6 text-[14px] font-extrabold text-white shadow-[0_12px_22px_rgba(6,31,73,0.16)] transition hover:bg-[#0b2d63]">
              Envoyer
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function IconButton({ label, icon: Icon, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] transition ${
        danger ? 'text-[#ff1717] hover:bg-[#fff0f0]' : 'text-[#061f49] hover:bg-[#f3f6fb]'
      }`}
    >
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
    <span className={`grid shrink-0 place-items-center rounded-full text-[18px] font-extrabold ${large ? 'size-[58px]' : 'size-[54px]'} ${tones[tone]}`}>
      {initials}
    </span>
  )
}

export default AdminMessages

function mapMessage(message, full = false) {
  const messageText = getMessageText(message)
  const initials = (message.name || '').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SP'
  const createdAt = new Date(message.created_at)
  return {
    id: message.id,
    initials,
    sender: message.name,
    subject: message.subject,
    preview: truncateText(messageText),
    message: full ? messageText : messageText,
    email: message.email,
    phone: message.phone,
    time: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(createdAt),
    fullDate: `${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(createdAt)} à ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(createdAt)}`,
    unread: message.status === 'new',
    tone: 'blue',
  }
}

function getMessageText(message) {
  return message?.message || message?.body || message?.content || ''
}

function truncateText(value) {
  return value.length > 64 ? `${value.slice(0, 64)}...` : value
}
