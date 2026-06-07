import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  EyeOff,
  Filter,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { projectsApi } from '../../api/resources.js'
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { notify } = useToast()

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await projectsApi.list()
      setProjects(normalizeRows(response).map(mapProject))
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les projets.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    setDeleting(true)
    try {
      await projectsApi.remove(projectToDelete.id)
      setProjects((current) => current.filter((project) => project.id !== projectToDelete.id))
      notify('Projet supprimé avec succès')
      setProjectToDelete(null)
    } catch (error) {
      notify(apiErrorMessage(error, 'Erreur lors de la suppression du projet'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const stats = useMemo(() => buildStats(projects), [projects])

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Projets</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d'Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span className="text-[#c88a22]">Projets</span>
          </nav>
        </div>

        <Link to="/admin/projects/create" className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Plus size={22} />
          Ajouter un projet
        </Link>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-[18px] border border-[#e4eaf2] bg-white p-5 shadow-[0_16px_40px_rgba(6,31,73,0.07)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#071f49]">Liste des projets</h2>
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
              Plus recents
              <ChevronDown size={17} />
            </button>
          </div>
        </div>
        {loading ? <p className="mt-4 text-sm font-bold text-[#52668c]">Chargement des projets...</p> : null}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <thead>
              <tr className="border-y border-[#e8edf4] bg-[#fbfcfe] text-[13px] font-extrabold text-[#24395f]">
                <th className="w-[56px] px-3 py-5">#</th>
                <th className="w-[360px] px-3 py-5">Projet</th>
                <th className="w-[170px] px-3 py-5">Categorie</th>
                <th className="w-[170px] px-3 py-5">Localisation</th>
                <th className="w-[145px] px-3 py-5">Statut</th>
                <th className="w-[175px] px-3 py-5">Date de creation</th>
                <th className="w-[130px] px-3 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf4]">
              {projects.map((project) => (
                <ProjectRow key={project.id} project={project} onDelete={setProjectToDelete} />
              ))}
            </tbody>
          </table>
          {!loading && !projects.length ? <p className="py-8 text-sm font-bold text-[#52668c]">Aucun projet enregistre.</p> : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de {projects.length ? 1 : 0} a {projects.length} sur {projects.length} projets</p>
        </div>
      </section>
      <ConfirmDeleteModal
        open={Boolean(projectToDelete)}
        title="Supprimer le projet"
        message="Êtes-vous sûr de vouloir supprimer ce projet ?"
        details="Cette action est irréversible."
        loading={deleting}
        onCancel={() => {
          if (!deleting) setProjectToDelete(null)
        }}
        onConfirm={confirmDeleteProject}
      />
    </div>
  )
}

function buildStats(projects) {
  const published = projects.filter((project) => project.isPublished).length
  const drafts = projects.length - published
  const lastProject = projects[0]

  return [
    { icon: ClipboardList, value: String(projects.length), label: 'Total des projets', detail: 'Tous les projets enregistres', tone: 'navy' },
    { icon: CheckCircle2, value: String(published), label: 'Projets publies', detail: 'Visibles sur le site', tone: 'gold' },
    { icon: EyeOff, value: String(drafts), label: 'Projets en brouillon', detail: 'Non publies', tone: 'muted' },
    { icon: CalendarDays, value: lastProject?.date || '-', label: 'Dernier projet ajoute', detail: lastProject ? lastProject.title : 'Aucun projet', tone: 'gold' },
  ]
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

function ProjectRow({ project, onDelete }) {
  return (
    <tr className="text-[14px] text-[#071f49]">
      <td className="px-3 py-5 font-medium">{project.id}</td>
      <td className="px-3 py-5">
        <div className="flex items-center gap-4">
          <ProjectThumbnail src={project.image} />
          <span className="font-extrabold">{project.title}</span>
        </div>
      </td>
      <td className="px-3 py-5 font-medium">{project.category}</td>
      <td className="px-3 py-5 font-medium">{project.location}</td>
      <td className="px-3 py-5">
        <StatusBadge status={project.status} />
      </td>
      <td className="px-3 py-5 font-medium">{project.date}</td>
      <td className="px-3 py-5">
        <div className="flex justify-center gap-3">
          <Link to={`/admin/projects/${project.id}/edit`} aria-label={`Modifier ${project.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#006dff] transition hover:bg-[#eef6ff]">
            <Pencil size={18} />
          </Link>
          <button type="button" onClick={() => onDelete(project)} aria-label={`Supprimer ${project.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#ff1717] transition hover:bg-[#fff0f0]">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function ProjectThumbnail({ src }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <span className="h-[52px] w-[78px] shrink-0 rounded-[6px] bg-[#eef2f7]" />
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="h-[52px] w-[78px] shrink-0 rounded-[6px] object-cover shadow-[0_8px_18px_rgba(6,31,73,0.1)]"
    />
  )
}

function StatusBadge({ status }) {
  const published = status === 'Publie'

  return (
    <span className={`inline-flex items-center gap-2 rounded-[7px] px-3 py-1.5 text-[13px] font-extrabold ${published ? 'bg-[#d9f4e3] text-[#008e43]' : 'bg-[#fbefd9] text-[#b87408]'}`}>
      <span className={`size-1.5 rounded-full ${published ? 'bg-[#008e43]' : 'bg-[#c88a22]'}`} />
      {status}
    </span>
  )
}

function normalizeRows(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

function mapProject(project) {
  return {
    id: project.id,
    image: project.image_url,
    title: project.title,
    category: project.category,
    location: project.location,
    status: project.is_published ? 'Publie' : 'Brouillon',
    isPublished: Boolean(project.is_published),
    date: project.created_at ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(project.created_at)) : '-',
  }
}

export default AdminProjects
