/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { newsApi } from '../../api/resources.js'
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function AdminNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { notify } = useToast()

  const loadNews = async () => {
    setLoading(true)
    try {
      const response = await newsApi.list()
      setArticles((response.data || response).map(mapArticle))
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les actualités.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [])

  const stats = useMemo(() => buildStats(articles), [articles])

  const saveArticle = async (article = null) => {
    const title = window.prompt('Titre de l’actualité', article?.title || '')
    if (!title) return
    const slug = window.prompt('Slug', article?.slug || slugify(title)) || article?.slug || slugify(title)
    const category = window.prompt('Catégorie', article?.category || 'Conseil') || article?.category || ''
    const excerpt = window.prompt('Extrait', article?.excerpt || '') || article?.excerpt || ''
    const content = window.prompt('Contenu', article?.content || '') || article?.content || title
    const status = window.prompt('Statut: published ou draft', article?.rawStatus || 'published') || article?.rawStatus || 'published'
    const publishedAt = window.prompt('Date de publication (YYYY-MM-DD)', article?.publishedInput || todayInput()) || article?.publishedInput || ''
    const image = await pickImage()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('category', category)
    formData.append('excerpt', excerpt)
    formData.append('content', content)
    formData.append('status', status)
    if (publishedAt) formData.append('published_at', publishedAt)
    if (image) formData.append('image', image)

    try {
      article ? await newsApi.update(article.id, formData) : await newsApi.create(formData)
      notify(article ? 'Actualité mise à jour.' : 'Actualité ajoutée.')
      loadNews()
    } catch (error) {
      notify(apiErrorMessage(error, 'Opération impossible.'), 'error')
    }
  }

  const viewArticle = (article) => {
    window.alert(`${article.title}\n\n${article.excerpt || article.content}`)
  }

  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return
    setDeleting(true)
    try {
      await newsApi.remove(articleToDelete.id)
      setArticleToDelete(null)
      notify('Actualité supprimée.')
      loadNews()
    } catch (error) {
      notify(apiErrorMessage(error, 'Suppression impossible.'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Actualités</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d’Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span className="text-[#c88a22]">Actualités</span>
          </nav>
        </div>

        <button type="button" onClick={() => saveArticle()} className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Plus size={22} />
          Ajouter une actualité
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des actualités</h2>
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
              Plus récentes
              <ChevronDown size={17} />
            </button>
          </div>
        </div>
        {loading ? <p className="mt-4 text-sm font-bold text-[#52668c]">Chargement des actualités...</p> : null}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <thead>
              <tr className="border-y border-[#e8edf4] bg-[#fbfcfe] text-[13px] font-extrabold text-[#24395f]">
                <th className="w-[56px] px-3 py-5">#</th>
                <th className="w-[110px] px-3 py-5">Image</th>
                <th className="w-[380px] px-3 py-5">Titre</th>
                <th className="w-[170px] px-3 py-5">Catégorie</th>
                <th className="w-[145px] px-3 py-5">Statut</th>
                <th className="w-[190px] px-3 py-5">Date de publication</th>
                <th className="w-[160px] px-3 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf4]">
              {articles.map((article) => (
                <NewsRow key={article.id} article={article} onView={viewArticle} onEdit={saveArticle} onDelete={setArticleToDelete} />
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !articles.length ? (
          <div className="mt-5 rounded-[14px] border border-[#e4eaf2] bg-[#fbfcfe] p-8 text-center">
            <p className="text-[15px] font-extrabold text-[#071f49]">Aucune actualité enregistrée.</p>
          </div>
        ) : null}
      </section>
      <ConfirmDeleteModal
        open={Boolean(articleToDelete)}
        title="Supprimer l'actualité"
        message="Êtes-vous sûr de vouloir supprimer cette actualité ?"
        details="Cette action est irréversible."
        loading={deleting}
        onCancel={() => {
          if (!deleting) setArticleToDelete(null)
        }}
        onConfirm={confirmDeleteArticle}
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

function NewsRow({ article, onView, onEdit, onDelete }) {
  return (
    <tr className="text-[14px] text-[#071f49]">
      <td className="px-3 py-5 font-medium">{article.id}</td>
      <td className="px-3 py-5">
        {article.image ? (
          <img src={article.image} alt="" className="h-[52px] w-[78px] shrink-0 rounded-[6px] object-cover shadow-[0_8px_18px_rgba(6,31,73,0.1)]" />
        ) : (
          <span className="grid h-[52px] w-[78px] place-items-center rounded-[6px] bg-[#f1f4f9] text-[#c88a22]">
            <Newspaper size={22} />
          </span>
        )}
      </td>
      <td className="px-3 py-5">
        <div>
          <p className="font-extrabold">{article.title}</p>
          <p className="mt-1 max-w-[420px] truncate text-[13px] font-medium text-[#52668c]">{article.excerpt || article.slug}</p>
        </div>
      </td>
      <td className="px-3 py-5 font-medium">{article.category || '-'}</td>
      <td className="px-3 py-5">
        <StatusBadge status={article.status} />
      </td>
      <td className="px-3 py-5 font-medium">{article.date}</td>
      <td className="px-3 py-5">
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => onView(article)} aria-label={`Voir ${article.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#061f49] transition hover:bg-[#f7f9fc]">
            <Eye size={18} />
          </button>
          <button type="button" onClick={() => onEdit(article)} aria-label={`Modifier ${article.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#006dff] transition hover:bg-[#eef6ff]">
            <Pencil size={18} />
          </button>
          <button type="button" onClick={() => onDelete(article)} aria-label={`Supprimer ${article.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#ff1717] transition hover:bg-[#fff0f0]">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function StatusBadge({ status }) {
  const published = status === 'Publié'

  return (
    <span className={`inline-flex items-center gap-2 rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold ${published ? 'bg-[#d9f4e3] text-[#008e43]' : 'bg-[#fbefd9] text-[#b87408]'}`}>
      <span className={`size-1.5 rounded-full ${published ? 'bg-[#008e43]' : 'bg-[#c88a22]'}`} />
      {status}
    </span>
  )
}

function mapArticle(article) {
  return {
    id: article.id,
    image: article.image_url,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    status: article.status === 'published' ? 'Publié' : 'Brouillon',
    rawStatus: article.status,
    date: formatDate(article.published_at || article.created_at),
    publishedInput: article.published_at ? article.published_at.slice(0, 10) : '',
  }
}

function buildStats(articles) {
  const published = articles.filter((article) => article.rawStatus === 'published').length
  const drafts = articles.filter((article) => article.rawStatus === 'draft').length
  const latest = articles[0]

  return [
    {
      icon: Newspaper,
      value: String(articles.length),
      label: 'Total actualités',
      detail: 'Toutes les actualités enregistrées',
      tone: 'navy',
    },
    {
      icon: CheckCircle2,
      value: String(published),
      label: 'Actualités publiées',
      detail: 'Visibles sur le site',
      tone: 'gold',
    },
    {
      icon: EyeOff,
      value: String(drafts),
      label: 'Brouillons',
      detail: 'Non publiés',
      tone: 'muted',
    },
    {
      icon: CalendarDays,
      value: latest?.date || '-',
      label: 'Dernière actualité',
      detail: latest?.title || 'Aucune actualité',
      tone: 'gold',
    },
  ]
}

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function todayInput() {
  return new Date().toISOString().slice(0, 10)
}

function pickImage() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => resolve(input.files?.[0] || null)
    input.oncancel = () => resolve(null)
    input.click()
  })
}

export default AdminNews
