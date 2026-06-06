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
  ClipboardList,
  EyeOff,
  Filter,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { projectsApi } from '../../api/resources.js'
import { useToast } from '../../context/ToastContext.jsx'
import projectFactory from '../../assets/corporate/project-factory.png'
import projectResidential from '../../assets/corporate/project-residential.png'
import projectRoad from '../../assets/corporate/project-road.png'
import projectSolar from '../../assets/corporate/project-solar.png'
import aboutHero from '../../assets/corporate/about-hero-building.png'
import heroBuilding from '../../assets/corporate/hero-building.png'

const stats = [
  {
    icon: ClipboardList,
    value: '32',
    label: 'Total des projets',
    detail: 'Tous les projets enregistrés',
    tone: 'navy',
  },
  {
    icon: CheckCircle2,
    value: '28',
    label: 'Projets publiés',
    detail: 'Visibles sur le site',
    tone: 'gold',
  },
  {
    icon: EyeOff,
    value: '4',
    label: 'Projets en brouillon',
    detail: 'Non publiés',
    tone: 'muted',
  },
  {
    icon: CalendarDays,
    value: '12 mai 2024',
    label: 'Dernier projet ajouté',
    detail: 'Il y a 2 jours',
    tone: 'gold',
  },
]

const fallbackProjects = [
  {
    id: 1,
    image: projectResidential,
    title: 'Complexe résidentiel à Casablanca',
    category: 'Immobilier',
    location: 'Casablanca',
    status: 'Publié',
    date: '12 mai 2024',
  },
  {
    id: 2,
    image: projectFactory,
    title: 'Unité de production industrielle',
    category: 'Industrie',
    location: 'Tanger',
    status: 'Publié',
    date: '10 mai 2024',
  },
  {
    id: 3,
    image: projectSolar,
    title: 'Centrale solaire à Ouarzazate',
    category: 'Énergie',
    location: 'Ouarzazate',
    status: 'Publié',
    date: '8 mai 2024',
  },
  {
    id: 4,
    image: projectRoad,
    title: 'Aménagement routier à Marrakech',
    category: 'Infrastructure',
    location: 'Marrakech',
    status: 'Brouillon',
    date: '6 mai 2024',
  },
  {
    id: 5,
    image: aboutHero,
    title: 'Complexe hôtelier à Agadir',
    category: 'Tourisme',
    location: 'Agadir',
    status: 'Publié',
    date: '3 mai 2024',
  },
  {
    id: 6,
    image: heroBuilding,
    title: 'Extension portuaire à Nador',
    category: 'Infrastructure',
    location: 'Nador',
    status: 'Brouillon',
    date: '1 mai 2024',
  },
]

function AdminProjects() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [loading, setLoading] = useState(true)
  const { notify } = useToast()

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await projectsApi.list()
      setProjects((response.data || response).map(mapProject))
    } catch (error) {
      notify(apiErrorMessage(error, 'Impossible de charger les projets.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const saveProject = async (project = null) => {
    const title = window.prompt('Titre du projet', project?.title || '')
    if (!title) return
    const category = window.prompt('Catégorie', project?.category || 'Immobilier') || project?.category || 'Immobilier'
    const location = window.prompt('Localisation', project?.location || 'Casablanca') || project?.location || 'Casablanca'
    const description = window.prompt('Description', project?.description || '') || project?.description || title
    const status = window.prompt('Statut: published ou draft', project?.rawStatus || 'published') || project?.rawStatus || 'published'
    const image = await pickImage()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('location', location)
    formData.append('description', description)
    formData.append('status', status)
    if (image) formData.append('image', image)

    try {
      project ? await projectsApi.update(project.id, formData) : await projectsApi.create(formData)
      notify(project ? 'Projet mis à jour.' : 'Projet ajouté.')
      loadProjects()
    } catch (error) {
      notify(apiErrorMessage(error, 'Opération impossible.'), 'error')
    }
  }

  const deleteProject = async (project) => {
    if (!window.confirm(`Supprimer "${project.title}" ?`)) return
    try {
      await projectsApi.remove(project.id)
      notify('Projet supprimé.')
      loadProjects()
    } catch (error) {
      notify(apiErrorMessage(error, 'Suppression impossible.'), 'error')
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Projets</h1>
          <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d’Ariane">
            <a href="/admin" className="transition hover:text-[#c88a22]">Accueil</a>
            <ChevronRight size={17} className="text-[#8a9ab5]" />
            <span className="text-[#c88a22]">Projets</span>
          </nav>
        </div>

        <button type="button" onClick={() => saveProject()} className="inline-flex h-[54px] w-fit items-center gap-3 rounded-[8px] bg-[#061f49] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63]">
          <Plus size={22} />
          Ajouter un projet
        </button>
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
              Plus récents
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
                <th className="w-[170px] px-3 py-5">Catégorie</th>
                <th className="w-[170px] px-3 py-5">Localisation</th>
                <th className="w-[145px] px-3 py-5">Statut</th>
                <th className="w-[175px] px-3 py-5">Date de création</th>
                <th className="w-[130px] px-3 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf4]">
              {projects.map((project) => (
                <ProjectRow key={project.id} project={project} onEdit={saveProject} onDelete={deleteProject} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e8edf4] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#33496f]">Affichage de 1 à 6 sur 32 projets</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="h-11 rounded-[8px] border border-[#dce4ef] px-5 text-[14px] font-medium text-[#8a9ab5]">Précédent</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] bg-[#061f49] text-[15px] font-extrabold text-white shadow-[0_10px_20px_rgba(6,31,73,0.18)]">1</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">2</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">3</button>
            <button type="button" className="grid size-11 place-items-center rounded-[8px] border border-[#dce4ef] text-[15px] font-medium text-[#071f49]">6</button>
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

function ProjectRow({ project, onEdit, onDelete }) {
  return (
    <tr className="text-[14px] text-[#071f49]">
      <td className="px-3 py-5 font-medium">{project.id}</td>
      <td className="px-3 py-5">
        <div className="flex items-center gap-4">
          <img
            src={project.image}
            alt=""
            className="h-[52px] w-[78px] shrink-0 rounded-[6px] object-cover shadow-[0_8px_18px_rgba(6,31,73,0.1)]"
          />
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
          <button type="button" onClick={() => onEdit(project)} aria-label={`Modifier ${project.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#006dff] transition hover:bg-[#eef6ff]">
            <Pencil size={18} />
          </button>
          <button type="button" onClick={() => onDelete(project)} aria-label={`Supprimer ${project.title}`} className="grid size-10 place-items-center rounded-[8px] border border-[#dce4ef] text-[#ff1717] transition hover:bg-[#fff0f0]">
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

export default AdminProjects

function mapProject(project) {
  return {
    id: project.id,
    image: project.image_url || projectResidential,
    title: project.title,
    category: project.category,
    location: project.location,
    description: project.description,
    status: project.status === 'published' ? 'Publié' : 'Brouillon',
    rawStatus: project.status,
    date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(project.created_at)),
  }
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
