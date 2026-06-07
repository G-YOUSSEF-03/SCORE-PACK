import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileCheck2,
  FileSearch,
  Handshake,
  Lightbulb,
  Mail,
  MapPin,
  Medal,
  Menu,
  Phone,
  PieChart,
  Search,
  Shield,
  Target,
  Users,
} from 'lucide-react'
import heroBuilding from './assets/corporate/hero-building.png'
import aboutHero from './assets/corporate/about-hero-building.png'
import aboutMeeting from './assets/corporate/about-meeting.png'
import ContactVisitorPage from './pages/visitor/ContactPage.jsx'
import ServiceDetails from './pages/visitor/ServiceDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Logo from './components/Logo.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import LoginPage from './pages/visitor/LoginPage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminServices from './pages/admin/AdminServices.jsx'
import AdminProjects from './pages/admin/AdminProjects.jsx'
import AdminQuotes from './pages/admin/AdminQuotes.jsx'
import AdminMessages from './pages/admin/AdminMessages.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminTeams from './pages/admin/AdminTeams.jsx'
import AdminNews from './pages/admin/AdminNews.jsx'
import { apiErrorMessage } from './api/client.js'
import { publicApi } from './api/resources.js'

const routes = [
  { label: 'Accueil', hash: '#accueil' },
  { label: 'À propos', hash: '#a-propos' },
  { label: 'Nos services', hash: '#services' },
  { label: 'Projets', hash: '#projets' },
  { label: 'Contact', hash: '#contact' },
]

const stats = [
  { icon: Users, number: '150+', title: 'Projets réalisés', text: "Dans divers secteurs d'activité" },
  { icon: Shield, number: '98%', title: 'Taux de satisfaction', text: 'La réussite de nos clients est notre priorité' },
  { icon: BriefcaseBusiness, number: '10+', title: "Années d'expérience", text: 'Une expertise reconnue dans les études de projets' },
  { icon: Handshake, number: '50+', title: 'Partenaires & Investisseurs', text: 'Nous collaborons avec un large réseau de partenaires' },
]

const defaultSettings = {
  company_name: 'SCORE PACK',
  tagline: 'Bureau d’études des projets d’investissement',
  email: 'youssefelgourari1@gmail.com',
  phone: '+212 6 12 34 56 78',
  secondary_phone: '+212 5 22 98 76 54',
  address: '123 Boulevard Mohammed V, Résidence Al Qods, 5ème étage',
  city: 'Casablanca',
  country: 'Maroc',
  working_hours: 'Lundi - Vendredi : 08h30 - 18h30 / Samedi : 09h00 - 13h00',
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  youtube_url: '',
}

const approachSteps = [
  {
    icon: Search,
    title: 'Analyse',
    text: 'Compréhension approfondie de vos besoins et de votre environnement.',
  },
  {
    icon: ClipboardCheck,
    title: 'Étude',
    text: "Réalisation d'études détaillées et d'analyses adaptées à votre projet.",
  },
  {
    icon: Lightbulb,
    title: 'Solutions',
    text: 'Proposition de solutions optimisées et personnalisées pour votre réussite.',
  },
  {
    icon: Handshake,
    title: 'Accompagnement',
    text: "Suivi et accompagnement jusqu'à la réalisation et la réussite de votre projet.",
  },
]

const values = [
  { icon: Shield, title: 'Intégrité', text: 'Nous agissons avec transparence, honnêteté et responsabilité dans toutes nos relations.' },
  { icon: Medal, title: 'Excellence', text: "Nous visons l'excellence à chaque étape pour garantir des résultats fiables et durables." },
  { icon: Target, title: 'Engagement', text: "Nous nous engageons pleinement pour la réussite de vos projets, comme si c'étaient les nôtres." },
  { icon: Lightbulb, title: 'Innovation', text: "Nous adoptons des approches modernes et innovantes pour répondre aux défis d'aujourd'hui." },
  { icon: Users, title: 'Collaboration', text: 'Nous croyons au pouvoir du partenariat pour créer une valeur partagée et durable.' },
]

const expertise = [
  'Études de marché et analyses sectorielles',
  'Études techniques et ingénierie de projet',
  'Études financières et montages économiques',
  'Montage de dossiers et recherche de financement',
  "Suivi et accompagnement jusqu'à la réalisation",
]

const serviceIcons = {
  settings: Target,
  'bar-chart-3': BarChart3,
  'pie-chart': PieChart,
  folder: FileCheck2,
  handshake: Handshake,
  'clipboard-list': ClipboardCheck,
}

function usePublicSiteData() {
  const [servicesData, setServicesData] = useState([])
  const [projectsData, setProjectsData] = useState([])
  const [settingsData, setSettingsData] = useState(defaultSettings)
  const [loading, setLoading] = useState({ services: true, projects: true, settings: true })
  const [errors, setErrors] = useState({ services: '', projects: '', settings: '' })

  useEffect(() => {
    let ignore = false

    publicApi.services()
      .then((response) => {
        if (!ignore) setServicesData(normalizeApiRows(response).filter((service) => service.status === 'active'))
      })
      .catch((error) => {
        if (!ignore) setErrors((current) => ({ ...current, services: apiErrorMessage(error, 'Impossible de charger les services.') }))
      })
      .finally(() => {
        if (!ignore) setLoading((current) => ({ ...current, services: false }))
      })

    publicApi.projects()
      .then((response) => {
        if (!ignore) setProjectsData(normalizeApiRows(response).filter((project) => project.status === 'published'))
      })
      .catch((error) => {
        if (!ignore) setErrors((current) => ({ ...current, projects: apiErrorMessage(error, 'Impossible de charger les projets.') }))
      })
      .finally(() => {
        if (!ignore) setLoading((current) => ({ ...current, projects: false }))
      })

    publicApi.settings()
      .then((response) => {
        if (!ignore && response) setSettingsData({ ...defaultSettings, ...response })
      })
      .catch((error) => {
        if (!ignore) setErrors((current) => ({ ...current, settings: apiErrorMessage(error, 'Impossible de charger les paramètres.') }))
      })
      .finally(() => {
        if (!ignore) setLoading((current) => ({ ...current, settings: false }))
      })

    return () => {
      ignore = true
    }
  }, [])

  const mappedServices = useMemo(() => servicesData
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map(mapApiService), [servicesData])

  const mappedProjects = useMemo(() => projectsData.map(mapApiProject), [projectsData])

  return { services: mappedServices, projects: mappedProjects, settings: settingsData, loading, errors }
}

function normalizeApiRows(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

function mapApiService(service) {
  return {
    id: service.id,
    icon: serviceIcons[service.icon] || ClipboardCheck,
    title: service.title,
    text: service.description,
    slug: service.slug,
    bullets: [],
    order: service.order,
    status: service.status,
  }
}

function mapApiProject(project) {
  return {
    id: project.id,
    image: project.image_url || null,
    category: project.category,
    name: project.title,
    city: project.location,
    year: project.created_at ? String(new Date(project.created_at).getFullYear()) : '',
    investment: project.status === 'published' ? 'Publié' : project.status,
    description: project.description,
    status: project.status,
  }
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
      <Route path="/services/:slug" element={<VisitorSite serviceDetails />} />
      <Route path="*" element={<VisitorSite />} />
    </Routes>
  )
}

function VisitorSite({ serviceDetails = false }) {
  const [activeHash, setActiveHash] = useState(getCurrentHash)
  const publicData = usePublicSiteData()

  useEffect(() => {
    if (!serviceDetails && !window.location.hash) {
      window.history.replaceState(null, '', '#accueil')
    }

    const onHashChange = () => setActiveHash(getCurrentHash())
    window.addEventListener('hashchange', onHashChange)
    onHashChange()

    return () => window.removeEventListener('hashchange', onHashChange)
  }, [serviceDetails])

  const Page = useMemo(() => {
    if (serviceDetails) return ServiceDetails

    const pages = {
      '#accueil': HomePage,
      '#a-propos': AboutPage,
      '#services': ServicesPage,
      '#projets': ProjectsPage,
      '#contact': ContactVisitorPage,
      '#devis': QuoteRequestPage,
    }

    return pages[activeHash] || HomePage
  }, [activeHash, serviceDetails])

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0F2747]">
      <Header activeHash={serviceDetails ? '#services' : activeHash} linkPrefix={serviceDetails ? '/' : ''} />
      <main className="mx-auto max-w-[1400px] px-5 pb-7 pt-[128px] sm:px-8">
        <Page publicData={publicData} />
      </main>
      <Footer settings={publicData.settings} linkPrefix={serviceDetails ? '/' : ''} />
    </div>
  )
}

function getCurrentHash() {
  const hash = window.location.hash || '#accueil'
  return routes.some((route) => route.hash === hash) || hash === '#devis' ? hash : '#accueil'
}

function Header({ activeHash, linkPrefix = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 pt-3 sm:px-8">
      <div className="mx-auto max-w-[1470px] rounded-[16px] border border-white/80 bg-white/95 px-5 shadow-[0_16px_42px_rgba(15,39,71,0.1)] backdrop-blur xl:px-10">
        <div className="flex h-[76px] items-center justify-between">
          <a href={`${linkPrefix}#accueil`} className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Logo variant="light" size="navbar" />
          </a>

          <nav className="hidden items-center gap-[52px] text-sm font-extrabold text-[#0F2747] lg:flex">
            {routes.map((route) => (
              <a key={route.hash} href={`${linkPrefix}${route.hash}`} className={activeHash === route.hash ? 'nav-active text-[#A77A33]' : 'transition hover:text-[#A77A33]'}>
                {route.label}
              </a>
            ))}
          </nav>

          <a href={`${linkPrefix}#devis`} className="hidden h-12 items-center gap-5 rounded-[8px] bg-[#0F2747] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,39,71,0.18)] md:inline-flex">
            Demander un devis
            <ArrowRight size={18} />
          </a>

          <button className="grid size-11 place-items-center rounded-[9px] border border-[#E2E7EE] lg:hidden" aria-label="Menu" onClick={() => setOpen((value) => !value)}>
            <Menu size={22} />
          </button>
        </div>

        {open ? (
          <nav className="grid gap-1 border-t border-[#E8ECF1] py-4 text-sm font-bold lg:hidden">
            {routes.map((route) => (
              <a
                key={route.hash}
                href={`${linkPrefix}${route.hash}`}
                className={`rounded-[10px] px-3 py-3 ${activeHash === route.hash ? 'bg-[#F4F1ED] text-[#A77A33]' : 'hover:bg-[#F8F9FB]'}`}
                onClick={() => setOpen(false)}
              >
                {route.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  )
}

function HomePage({ publicData }) {
  const homeServices = publicData.services.slice(0, 4)
  const homeProjects = publicData.projects.slice(0, 4)

  return (
    <>
      <section id="accueil" className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel>Bienvenue chez SCORE PACK</SectionLabel>
          <h1 className="mt-4 max-w-[650px] text-[46px] font-extrabold leading-[1.03] tracking-[-0.045em] text-[#0F2747] sm:text-[64px]">
            Bureau d&apos;études des projets <span className="text-[#A77A33]">d&apos;investissement</span>
          </h1>
          <p className="mt-7 max-w-[590px] text-[17px] leading-8 text-[#2F405A]">
            SCORE PACK accompagne les porteurs de projets, investisseurs et entreprises avec des études fiables, des analyses solides et des solutions sur mesure.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#services" className="inline-flex h-14 items-center gap-4 rounded-[10px] bg-[#0F2747] px-7 text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(15,39,71,0.2)]">
              Découvrir nos services
              <ArrowRight size={18} />
            </a>
            <a href="#a-propos" className="inline-flex h-14 items-center gap-4 rounded-[10px] border border-[#D9E0E8] bg-white px-7 text-sm font-extrabold text-[#0F2747] shadow-sm">
              À propos de nous
              <ChevronRight size={18} />
            </a>
          </div>
        </div>

        <img
          src={heroBuilding}
          alt="Siège corporate moderne"
          className="h-[330px] w-full rounded-[30px] object-cover shadow-[0_24px_70px_rgba(15,39,71,0.14)] sm:h-[430px]"
        />
      </section>

      <Reveal className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {homeServices.map((service, index) => (
          <Reveal key={service.title} as="div" delay={revealDelay(index)}>
            <ServiceCard {...service} />
          </Reveal>
        ))}
      </Reveal>
      <ResourceState loading={publicData.loading.services} error={publicData.errors.services} empty={!homeServices.length} emptyText="Aucun service actif disponible pour le moment." />

      <Reveal className="mt-7 overflow-hidden rounded-[16px] border border-[#E5EAF0] bg-white shadow-[0_18px_52px_rgba(15,39,71,0.08)]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <Reveal key={item.title} as="div" delay={revealDelay(index)}>
              <StatCard {...item} isLast={index === stats.length - 1} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {homeProjects.map((project, index) => (
          <Reveal key={project.id} as="div" delay={revealDelay(index)}>
            <ProjectCard {...project} />
          </Reveal>
        ))}
      </Reveal>
      <ResourceState loading={publicData.loading.projects} error={publicData.errors.projects} empty={!homeProjects.length} emptyText="Aucun projet publié disponible pour le moment." />

      <CtaBanner />
    </>
  )
}

function AboutPage() {
  return (
    <>
      <section id="a-propos" className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.32fr]">
        <div className="pl-0 lg:pl-1">
          <div className="mb-5 flex items-center gap-3 text-sm font-medium text-[#263A58]">
            <a href="#accueil">Accueil</a>
            <ChevronRight size={15} className="text-[#C79A4A]" />
            <span>À propos</span>
          </div>
          <h1 className="max-w-[520px] text-[46px] font-extrabold leading-[1.03] tracking-[-0.045em] text-[#0F2747] sm:text-[60px]">
            À propos de <span className="block text-[#A77A33]">SCORE PACK</span>
          </h1>
          <p className="mt-7 max-w-[575px] text-[16px] leading-8 text-[#2F405A]">
            SCORE PACK est un bureau d&apos;études spécialisé dans l&apos;accompagnement des porteurs de projets et des investisseurs dans la réussite de leurs projets d&apos;investissement. Nous transformons vos idées en projets viables, durables et rentables.
          </p>
        </div>

        <img
          src={aboutHero}
          alt="Bâtiment corporate moderne SCORE PACK"
          className="h-[315px] w-full rounded-[24px] object-cover shadow-[0_22px_55px_rgba(15,39,71,0.12)] sm:h-[365px] lg:h-[320px]"
        />
      </section>

      <Reveal className="mt-7 overflow-hidden rounded-[16px] border border-[#E5EAF0] bg-white shadow-[0_18px_52px_rgba(15,39,71,0.08)]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <Reveal key={item.title} as="div" delay={revealDelay(index)}>
              <StatCard {...item} isLast={index === stats.length - 1} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="pt-7">
        <div className="text-center">
          <SectionLabel>Nos valeurs</SectionLabel>
          <h2 className="mt-2 text-[29px] font-extrabold leading-tight tracking-[-0.035em] text-[#0F2747]">
            Nos valeurs guident chacun de nos engagements
          </h2>
          <span className="mx-auto mt-4 block h-px w-8 bg-[#C79A4A]" />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {values.map((value, index) => (
            <Reveal key={value.title} as="div" delay={revealDelay(index)}>
              <ValueCard {...value} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.95fr_1.08fr]">
        <Reveal as="div" delay={0.1} className="rounded-[15px] border border-[#E5EAF0] bg-white p-8 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
          <InfoBlock
            icon={Target}
            label="Notre mission"
            text="Accompagner nos clients de l'idée à la réalisation à travers des études fiables, des analyses précises et des solutions adaptées pour des projets d'investissement réussis."
          />
          <div className="mt-10">
            <InfoBlock
              icon={Eye}
              label="Notre vision"
              text="Devenir un cabinet de référence en études de projets d'investissement, reconnu pour la qualité, la rigueur et l'impact de nos accompagnements."
            />
          </div>
        </Reveal>

        <Reveal as="div" delay={0.2}>
          <img
            src={aboutMeeting}
            alt="Consultants SCORE PACK autour de plans et rapports financiers"
            className="h-full min-h-[275px] w-full rounded-[14px] object-cover shadow-[0_16px_44px_rgba(15,39,71,0.11)]"
          />
        </Reveal>

        <Reveal as="div" delay={0.3} className="rounded-[15px] border border-[#E5EAF0] bg-white p-8 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
          <SectionLabel>Notre expertise</SectionLabel>
          <ul className="mt-6 space-y-5">
            {expertise.map((item) => (
              <li key={item} className="flex items-start gap-4 text-[15px] leading-6 text-[#263A58]">
                <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-[#C79A4A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Reveal>

      <CtaBanner />
    </>
  )
}

function ServicesPage({ publicData }) {
  return (
    <>
      <section id="services" className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <div className="mb-5 flex items-center gap-3 text-sm font-medium text-[#263A58]">
            <a href="#accueil">Accueil</a>
            <ChevronRight size={15} className="text-[#C79A4A]" />
            <span>Nos services</span>
          </div>
          <h1 className="text-[48px] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0F2747] sm:text-[64px]">
            Nos <span className="text-[#A77A33]">services</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-[17px] leading-8 text-[#2F405A]">
            Des solutions sur mesure pour accompagner vos projets à chaque étape, avec rigueur, expertise et engagement.
          </p>
        </div>

        <img
          src={aboutMeeting}
          alt="Ingénieurs et consultants analysant des plans"
          className="h-[300px] w-full rounded-[18px] object-cover object-center shadow-[0_22px_55px_rgba(15,39,71,0.12)] sm:h-[350px] lg:h-[305px]"
        />
      </section>

      <Reveal className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {publicData.services.map((service, index) => (
          <Reveal key={service.title} as="div" delay={revealDelay(index)}>
            <ServiceDetailCard {...service} />
          </Reveal>
        ))}
      </Reveal>
      <ResourceState loading={publicData.loading.services} error={publicData.errors.services} empty={!publicData.services.length} emptyText="Aucun service actif disponible pour le moment." />

      <ApproachSection />
      <CtaBanner />
    </>
  )
}

function ProjectsPage({ publicData }) {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)
  const pageSize = 4
  const projectRows = publicData.projects
  const dynamicCategories = useMemo(() => ['Tous', ...Array.from(new Set(projectRows.map((project) => project.category).filter(Boolean)))], [projectRows])

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return projectRows
      .filter((project) => activeCategory === 'Tous' || project.category === activeCategory)
      .filter((project) => {
        if (!normalizedSearch) return true
        return [project.name, project.city, project.category, project.description]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') return Number(a.year) - Number(b.year)
        if (sortBy === 'city') return a.city.localeCompare(b.city)
        return Number(b.year) - Number(a.year)
      })
  }, [activeCategory, projectRows, searchTerm, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize))
  const visibleProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize)

  const resetFilters = () => {
    setActiveCategory('Tous')
    setSearchTerm('')
    setSortBy('recent')
    setViewMode('grid')
    setPage(1)
  }

  return (
    <PageShell eyebrow="Projets" title="Des réalisations qui parlent d'elles-mêmes">
      <Reveal as="div" className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Reveal as="aside" delay={0.1} className="h-fit rounded-[18px] border border-[#E5EAF0] bg-white p-6 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#0F2747]">Filtres</h2>
            <button type="button" onClick={resetFilters} className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#A77A33]">
              Réinitialiser
            </button>
          </div>

          <div className="mt-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#6D7890]">Catégories</p>
            <div className="mt-4 space-y-2">
              {dynamicCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category)
                    setPage(1)
                  }}
                  className={`flex w-full items-center justify-between rounded-[10px] px-4 py-3 text-left text-sm font-extrabold transition ${
                    activeCategory === category
                      ? 'bg-[#0F2747] text-white shadow-[0_12px_24px_rgba(15,39,71,0.18)]'
                      : 'bg-[#F8F9FB] text-[#263A58] hover:bg-[#F4F1ED] hover:text-[#A77A33]'
                  }`}
                >
                  <span>{category}</span>
                  <span className={activeCategory === category ? 'text-[#C79A4A]' : 'text-[#AEB8C6]'}>
                    {category === 'Tous' ? projectRows.length : projectRows.filter((project) => project.category === category).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="rounded-[18px] border border-[#E5EAF0] bg-white p-5 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
            <div className="grid gap-4 xl:grid-cols-[1fr_210px_auto] xl:items-center">
              <label className="relative block">
                <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A77A33]" />
                <input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Rechercher un projet, une ville, une catégorie..."
                  className="h-12 w-full rounded-[10px] border border-[#DDE4EC] bg-[#F8F9FB] pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#C79A4A]"
                />
              </label>

              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value)
                  setPage(1)
                }}
                className="h-12 rounded-[10px] border border-[#DDE4EC] bg-[#F8F9FB] px-4 text-sm font-extrabold text-[#0F2747] outline-none focus:border-[#C79A4A]"
              >
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="city">Ville A-Z</option>
              </select>

              <div className="flex rounded-[10px] border border-[#DDE4EC] bg-[#F8F9FB] p-1">
                <ViewButton
                  label="Grille"
                  active={viewMode === 'grid'}
                  onClick={() => {
                    setViewMode('grid')
                    setPage(1)
                  }}
                >
                  <span className="grid grid-cols-2 gap-0.5">
                    <span className="size-1.5 rounded-sm bg-current" />
                    <span className="size-1.5 rounded-sm bg-current" />
                    <span className="size-1.5 rounded-sm bg-current" />
                    <span className="size-1.5 rounded-sm bg-current" />
                  </span>
                </ViewButton>
                <ViewButton
                  label="Liste"
                  active={viewMode === 'list'}
                  onClick={() => {
                    setViewMode('list')
                    setPage(1)
                  }}
                >
                  <span className="space-y-1">
                    <span className="block h-0.5 w-4 rounded bg-current" />
                    <span className="block h-0.5 w-4 rounded bg-current" />
                    <span className="block h-0.5 w-4 rounded bg-current" />
                  </span>
                </ViewButton>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 text-sm font-semibold text-[#5A6B82]">
            <p>{filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}</p>
            <p className="hidden sm:block">Page {page} sur {pageCount}</p>
          </div>
          <ResourceState loading={publicData.loading.projects} error={publicData.errors.projects} empty={false} emptyText="" />

          <div className={viewMode === 'grid' ? 'mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4' : 'mt-5 space-y-5'}>
            {visibleProjects.map((project, index) => (
              <Reveal key={project.id} as="div" delay={revealDelay(index)}>
                <ProjectCard {...project} viewMode={viewMode} />
              </Reveal>
            ))}
          </div>

          {visibleProjects.length === 0 ? (
            <div className="mt-5 rounded-[18px] border border-[#E5EAF0] bg-white p-10 text-center shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
              <p className="text-lg font-extrabold text-[#0F2747]">Aucun projet ne correspond à votre recherche.</p>
              <button type="button" onClick={resetFilters} className="mt-4 text-sm font-extrabold text-[#A77A33]">Réinitialiser les filtres</button>
            </div>
          ) : null}

          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </Reveal>
      </Reveal>
      <CtaBanner />
    </PageShell>
  )
}

function QuoteRequestPage() {
  const [form, setForm] = useState({
    client_name: '',
    email: '',
    phone: '',
    project_type: '',
    project_title: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateQuoteForm(form)
    setErrors(nextErrors)
    setStatus({ type: '', message: '' })

    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      await publicApi.quoteRequest({
        client_name: form.client_name,
        email: form.email,
        phone: form.phone,
        project_title: form.project_title,
        message: formatQuoteMessage(form),
      })
      setForm({ client_name: '', email: '', phone: '', project_type: '', project_title: '', budget: '', message: '' })
      setStatus({ type: 'success', message: 'Votre demande de devis a été envoyée avec succès.' })
    } catch (error) {
      setStatus({ type: 'error', message: apiErrorMessage(error, 'Impossible d’envoyer votre demande de devis.') })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell eyebrow="Demander un devis" title="Parlons de votre projet d'investissement">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[16px] border border-[#E5EAF0] bg-white p-8 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
          <h2 className="text-2xl font-extrabold">Votre demande</h2>
          <p className="mt-4 text-[15px] leading-7 text-[#3D4E66]">
            Envoyez-nous les premières informations de votre projet. Notre équipe reviendra vers vous avec une réponse adaptée.
          </p>
          <div className="mt-6 space-y-5 text-[15px] font-semibold text-[#263A58]">
            <a href="tel:+212612345678" className="flex items-center gap-4">
              <Phone className="text-[#C79A4A]" size={20} />
              +212 6 12 34 56 78
            </a>
            <a href="mailto:youssefelgourari1@gmail.com" className="flex items-center gap-4">
              <Mail className="text-[#C79A4A]" size={20} />
              youssefelgourari1@gmail.com
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-[16px] border border-[#E5EAF0] bg-white p-8 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nom complet" name="client_name" value={form.client_name} onChange={onChange} error={errors.client_name} />
            <Input label="Téléphone" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
          </div>
          <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} className="mt-4" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Type de projet" name="project_type" value={form.project_type} onChange={onChange} error={errors.project_type} />
            <Input label="Budget" name="budget" value={form.budget} onChange={onChange} error={errors.budget} />
          </div>
          <Input label="Titre du projet" name="project_title" value={form.project_title} onChange={onChange} error={errors.project_title} className="mt-4" />
          <label className="mt-4 block">
            <span className="text-sm font-extrabold text-[#0F2747]">Message</span>
            <textarea name="message" value={form.message} onChange={onChange} className="mt-2 min-h-32 w-full rounded-[10px] border border-[#DDE4EC] bg-[#F8F9FB] px-4 py-3 outline-none focus:border-[#C79A4A]" />
            {errors.message ? <p className="mt-2 text-xs font-bold text-red-600">{errors.message}</p> : null}
          </label>
          {status.message ? <p className={`mt-4 text-sm font-bold ${status.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>{status.message}</p> : null}
          <button disabled={submitting} type="submit" className="mt-5 inline-flex h-12 items-center gap-4 rounded-[8px] bg-[#0F2747] px-6 text-sm font-extrabold text-white disabled:opacity-60">
            {submitting ? 'Envoi...' : 'Envoyer la demande'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </PageShell>
  )
}

function validateQuoteForm(form) {
  const errors = {}
  if (!form.client_name.trim()) errors.client_name = 'Le nom est obligatoire.'
  if (!form.phone.trim()) errors.phone = 'Le téléphone est obligatoire.'
  if (!form.email.trim()) errors.email = 'L’email est obligatoire.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'L’email est invalide.'
  if (!form.project_type.trim()) errors.project_type = 'Le type de projet est obligatoire.'
  if (!form.project_title.trim()) errors.project_title = 'Le titre du projet est obligatoire.'
  if (!form.budget.trim()) errors.budget = 'Le budget est obligatoire.'
  return errors
}

function formatQuoteMessage(form) {
  return [
    `Type de projet: ${form.project_type}`,
    `Budget: ${form.budget}`,
    '',
    form.message,
  ].filter(Boolean).join('\n')
}

// eslint-disable-next-line no-unused-vars
function ContactPage() {
  return (
    <PageShell eyebrow="Contact" title="Parlons de votre projet d'investissement">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[16px] border border-[#E5EAF0] bg-white p-8 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
          <h2 className="text-2xl font-extrabold">Coordonnées</h2>
          <div className="mt-6 space-y-5 text-[15px] font-semibold text-[#263A58]">
            <a href="tel:+212612345678" className="flex items-center gap-4">
              <Phone className="text-[#C79A4A]" size={20} />
              +212 6 12 34 56 78
            </a>
            <a href="mailto:youssefelgourari1@gmail.com" className="flex items-center gap-4">
              <Mail className="text-[#C79A4A]" size={20} />
              youssefelgourari1@gmail.com
            </a>
          </div>
        </div>
        <form className="rounded-[16px] border border-[#E5EAF0] bg-white p-8 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nom complet" />
            <Input label="Téléphone" />
          </div>
          <Input label="Email" className="mt-4" />
          <label className="mt-4 block">
            <span className="text-sm font-extrabold text-[#0F2747]">Message</span>
            <textarea className="mt-2 min-h-32 w-full rounded-[10px] border border-[#DDE4EC] bg-[#F8F9FB] px-4 py-3 outline-none focus:border-[#C79A4A]" />
          </label>
          <button type="button" className="mt-5 inline-flex h-12 items-center gap-4 rounded-[8px] bg-[#0F2747] px-6 text-sm font-extrabold text-white">
            Envoyer
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </PageShell>
  )
}

function PageShell({ eyebrow, title, children }) {
  return (
    <section>
      <div className="mb-8">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className="mt-3 max-w-[850px] text-[42px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-[58px]">{title}</h1>
      </div>
      {children}
    </section>
  )
}

function CtaBanner() {
  return (
    <Reveal className="mt-6">
      <div className="relative overflow-hidden rounded-[18px] bg-[#0F2747] px-8 py-7 text-white shadow-[0_22px_55px_rgba(15,39,71,0.2)] sm:px-10 lg:flex lg:items-center lg:justify-between">
        <div className="pointer-events-none absolute right-[330px] top-1/2 hidden size-40 -translate-y-1/2 opacity-[0.07] lg:block">
          <Logo variant="dark" size="icon" icon />
        </div>
        <div className="flex items-center gap-6">
          <span className="grid size-16 shrink-0 place-items-center rounded-[10px] border border-[#C79A4A]/45 text-[#C79A4A]">
            <FileSearch size={34} />
          </span>
          <div>
            <h2 className="text-[30px] font-extrabold tracking-[-0.035em]">Vous avez un projet en tête ?</h2>
            <p className="mt-1 text-[15px] text-white/90">Contactez-nous dès aujourd&apos;hui pour une étude personnalisée et gratuite.</p>
          </div>
        </div>
        <a href="#devis" className="mt-7 inline-flex h-14 items-center gap-9 rounded-[8px] bg-[#C79A4A] px-9 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(199,154,74,0.26)] lg:mt-0">
          Demander un devis
          <ArrowRight size={19} />
        </a>
      </div>
    </Reveal>
  )
}

function StatCard({ icon: Icon, number, title, text, isLast }) {
  return (
    <article className={`flex items-center gap-6 px-9 py-7 ${isLast ? '' : 'lg:border-r lg:border-[#DDE4EC]'}`}>
      <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#F4F5F7] text-[#0F2747]">
        <Icon size={31} strokeWidth={2.6} />
      </span>
      <div>
        <p className="text-[37px] font-extrabold leading-none tracking-[-0.045em] text-[#0F2747]">{number}</p>
        <h3 className="mt-2 text-sm font-extrabold text-[#0F2747]">{title}</h3>
        <p className="mt-2 max-w-[210px] text-[13px] leading-5 text-[#3D4E66]">{text}</p>
      </div>
    </article>
  )
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A77A33]">{children}</p>
}

function ServiceCard({ icon: Icon, title, text, slug }) {
  const detailsHref = slug ? `/services/${slug}` : '#services'

  return (
    <article className="rounded-[16px] border border-[#E5EAF0] bg-white p-7 shadow-[0_16px_44px_rgba(15,39,71,0.07)]">
      <span className="grid size-14 place-items-center rounded-full bg-[#F4F1ED] text-[#A77A33]">
        <Icon size={27} />
      </span>
      <h2 className="mt-5 text-lg font-extrabold tracking-[-0.02em]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#3D4E66]">{text}</p>
      <a href={detailsHref} className="mt-5 inline-flex items-center gap-3 text-sm font-extrabold text-[#A77A33]">
        En savoir plus
        <ArrowRight size={16} />
      </a>
    </article>
  )
}

function ServiceDetailCard({ icon: Icon, title, text, bullets = [], order, status, slug }) {
  const detailsHref = slug ? `/services/${slug}` : '#services'

  return (
    <article className="flex min-h-[390px] flex-col rounded-[16px] border border-[#E5EAF0] bg-white p-7 shadow-[0_18px_48px_rgba(15,39,71,0.08)]">
      <div className="flex items-start gap-5">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#F4F1ED] text-[#A77A33]">
          <Icon size={32} strokeWidth={2.25} />
        </span>
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#0F2747]">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#3D4E66]">{text}</p>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#A77A33]">
            Ordre {order ?? '-'} · {status === 'active' ? 'Actif' : status}
          </p>
        </div>
      </div>

      {bullets.length ? <ul className="mt-7 space-y-4">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm leading-5 text-[#263A58]">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#A77A33]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul> : null}

      <a href={detailsHref} className="mt-auto inline-flex items-center gap-4 pt-8 text-sm font-extrabold text-[#A77A33]">
        En savoir plus
        <ArrowRight size={17} />
      </a>
    </article>
  )
}

function ApproachSection() {
  return (
    <Reveal className="mt-5 rounded-[18px] border border-[#E5EAF0] bg-white px-6 py-8 text-center shadow-[0_18px_52px_rgba(15,39,71,0.08)] sm:px-10">
      <SectionLabel>Notre approche</SectionLabel>
      <h2 className="mx-auto mt-2 max-w-[780px] text-[28px] font-extrabold leading-tight tracking-[-0.035em] text-[#0F2747] sm:text-[34px]">
        Une approche méthodique pour des résultats concrets
      </h2>
      <span className="mx-auto mt-4 block h-px w-8 bg-[#C79A4A]" />

      <div className="mt-10 grid gap-8 md:grid-cols-4">
        {approachSteps.map((step, index) => (
          <Reveal key={step.title} as="div" delay={revealDelay(index)}>
            <ApproachStep index={index + 1} {...step} />
          </Reveal>
        ))}
      </div>
    </Reveal>
  )
}

function ApproachStep({ icon: Icon, index, title, text }) {
  return (
    <div className="relative text-center">
      {index < approachSteps.length ? (
        <span className="absolute left-[68%] top-8 hidden h-px w-[78%] border-t border-dashed border-[#AEB8C6] md:block" />
      ) : null}
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#F4F5F7] text-[#A77A33]">
        <Icon size={29} />
      </span>
      <h3 className="mt-6 text-sm font-extrabold text-[#0F2747]">{index}. {title}</h3>
      <p className="mx-auto mt-3 max-w-[190px] text-sm leading-6 text-[#3D4E66]">{text}</p>
    </div>
  )
}

function ValueCard({ icon: Icon, title, text }) {
  return (
    <article className="flex min-h-[106px] items-center gap-5 rounded-[12px] border border-[#E7ECF2] bg-white p-6 shadow-[0_14px_38px_rgba(15,39,71,0.07)]">
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#F4F1ED] text-[#A77A33]">
        <Icon size={27} />
      </span>
      <div>
        <h3 className="text-sm font-extrabold text-[#0F2747]">{title}</h3>
        <p className="mt-3 text-[13px] leading-5 text-[#3D4E66]">{text}</p>
      </div>
    </article>
  )
}

function InfoBlock({ icon: Icon, label, text }) {
  return (
    <div className="flex gap-6">
      <span className="mt-1 grid size-14 shrink-0 place-items-center rounded-full bg-[#F4F1ED] text-[#C79A4A]">
        <Icon size={27} />
      </span>
      <div>
        <SectionLabel>{label}</SectionLabel>
        <p className="mt-4 text-[15px] leading-7 text-[#2F405A]">{text}</p>
      </div>
    </div>
  )
}

function ViewButton({ active, onClick, children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid size-10 place-items-center rounded-[8px] transition ${
        active ? 'bg-[#0F2747] text-white shadow-sm' : 'text-[#6D7890] hover:bg-white hover:text-[#0F2747]'
      }`}
    >
      {children}
    </button>
  )
}

function Pagination({ page, pageCount, onChange }) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(Math.max(1, page - 1))}
        className="h-10 rounded-[9px] border border-[#DDE4EC] bg-white px-4 text-sm font-extrabold text-[#0F2747] shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Précédent
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onChange(pageNumber)}
          className={`grid size-10 place-items-center rounded-[9px] text-sm font-extrabold shadow-sm transition ${
            page === pageNumber
              ? 'bg-[#0F2747] text-white'
              : 'border border-[#DDE4EC] bg-white text-[#0F2747] hover:border-[#C79A4A] hover:text-[#A77A33]'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        className="h-10 rounded-[9px] border border-[#DDE4EC] bg-white px-4 text-sm font-extrabold text-[#0F2747] shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Suivant
      </button>
    </nav>
  )
}

function ProjectCard({ image, category, name, city, year, investment, description, viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <article className="grid overflow-hidden rounded-[18px] border border-[#E5EAF0] bg-white shadow-[0_16px_44px_rgba(15,39,71,0.07)] md:grid-cols-[260px_1fr]">
        <div className="relative">
          {image ? (
            <img src={image} alt={name} className="h-56 w-full object-cover md:h-full" />
          ) : (
            <div className="h-56 w-full bg-[#F4F5F7] md:h-full" />
          )}
          <CategoryBadge category={category} />
        </div>
        <div className="flex flex-col p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#0F2747]">{name}</h2>
              <p className="mt-2 text-sm font-semibold text-[#5A6B82]">{city} · {year}</p>
            </div>
            <span className="rounded-full bg-[#F4F1ED] px-4 py-2 text-sm font-extrabold text-[#A77A33]">{investment}</span>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-[#3D4E66]">{description}</p>
          <a href="#contact" className="mt-auto inline-flex items-center gap-3 pt-6 text-sm font-extrabold text-[#A77A33]">
            Voir le projet
            <ArrowRight size={17} />
          </a>
        </div>
      </article>
    )
  }

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#E5EAF0] bg-white shadow-[0_16px_44px_rgba(15,39,71,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(15,39,71,0.11)]">
      <div className="relative">
        {image ? (
          <img src={image} alt={name} className="h-44 w-full object-cover" />
        ) : (
          <div className="h-44 w-full bg-[#F4F5F7]" />
        )}
        <CategoryBadge category={category} />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#5A6B82]">{city}</p>
          <p className="text-sm font-extrabold text-[#A77A33]">{year}</p>
        </div>
        <h2 className="mt-3 text-lg font-extrabold leading-tight tracking-[-0.02em] text-[#0F2747]">{name}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#3D4E66]">{description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E8ECF1] pt-4">
          <span className="text-sm font-extrabold text-[#0F2747]">{investment}</span>
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#A77A33]">
            Détails
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </article>
  )
}

function CategoryBadge({ category }) {
  return (
    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.11em] text-[#A77A33] shadow-[0_10px_22px_rgba(15,39,71,0.12)]">
      {category}
    </span>
  )
}

function ResourceState({ loading, error, empty, emptyText }) {
  if (loading) {
    return <p className="mt-4 text-sm font-bold text-[#5A6B82]">Chargement des données...</p>
  }

  if (error) {
    return <p className="mt-4 text-sm font-bold text-red-600">{error}</p>
  }

  if (empty) {
    return <p className="mt-4 text-sm font-bold text-[#5A6B82]">{emptyText}</p>
  }

  return null
}

function Input({ label, className = '', error, ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-extrabold text-[#0F2747]">{label}</span>
      <input className="mt-2 h-12 w-full rounded-[10px] border border-[#DDE4EC] bg-[#F8F9FB] px-4 outline-none focus:border-[#C79A4A]" {...props} />
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  )
}

function Footer({ settings = defaultSettings, linkPrefix = '' }) {
  const address = [settings.address, settings.city, settings.country].filter(Boolean).join(', ') || 'Casablanca, Maroc'
  const withPrefix = (href) => (href.startsWith('#') ? `${linkPrefix}${href}` : href)

  return (
    <footer className="mt-0 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
        <Reveal as="div" className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_0.9fr_1.25fr_0.85fr]">
          <div>
            <a href={withPrefix('#accueil')} className="flex items-center gap-3">
              <Logo variant="light" size="footer" />
            </a>
          </div>

          <FooterColumn title="Entreprise" linkPrefix={linkPrefix} links={[['À propos', '#a-propos'], ['Notre mission', '#a-propos'], ['Nos valeurs', '#a-propos'], ['Carrières', '#contact']]} />
          <FooterColumn title="Services" linkPrefix={linkPrefix} links={[['Études de faisabilité', '#services'], ['Études techniques', '#services'], ['Études financières', '#services'], ['Montage de dossiers', '#services']]} />
          <FooterColumn title="Liens rapides" linkPrefix={linkPrefix} links={[['Projets', '#projets'], ['FAQ', '#contact'], ['Contact', '#contact']]} />

          <div>
            <h3 className="text-sm font-extrabold text-[#0F2747]">Contact</h3>
            <div className="mt-5 space-y-4 text-sm font-semibold text-[#263A58]">
              <a href={`tel:${phoneHref(settings.phone)}`} className="flex items-center gap-3">
                <Phone size={17} />
                {settings.phone || defaultSettings.phone}
              </a>
              <a href={`mailto:${settings.email || defaultSettings.email}`} className="flex items-center gap-3">
                <Mail size={17} />
                {settings.email || defaultSettings.email}
              </a>
              <span className="flex items-center gap-3">
                <MapPin size={17} />
                {address}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-[#0F2747]">Suivez-nous</h3>
            <div className="mt-6 flex gap-3">
              <a href={settings.linkedin_url || withPrefix('#accueil')} aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full bg-[#0F2747] text-xs font-extrabold text-white">in</a>
              <a href={settings.facebook_url || withPrefix('#accueil')} aria-label="Facebook" className="grid size-9 place-items-center rounded-full bg-[#0F2747] text-sm font-extrabold text-white">f</a>
              <a href={settings.instagram_url || withPrefix('#accueil')} aria-label="Instagram" className="grid size-9 place-items-center rounded-full bg-[#0F2747] text-sm font-extrabold text-white">◎</a>
              <a href={settings.youtube_url || withPrefix('#accueil')} aria-label="YouTube" className="grid size-9 place-items-center rounded-full bg-[#0F2747] text-xs font-extrabold text-white">▶</a>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-sm text-[#5A6B82]">© 2024 {settings.company_name || defaultSettings.company_name}. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, linkPrefix = '' }) {
  const withPrefix = (href) => (href.startsWith('#') ? `${linkPrefix}${href}` : href)

  return (
    <div>
      <h3 className="text-sm font-extrabold text-[#0F2747]">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm font-semibold text-[#3D4E66]">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={withPrefix(href)} className="hover:text-[#A77A33]">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function phoneHref(value) {
  return String(value || '').replace(/[^\d+]/g, '')
}

function Reveal({ as: Tag = 'section', className = '', delay = 0, children, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => (
    typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={className}
      {...props}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}

function revealDelay(index) {
  return Math.min((index + 1) * 0.1, 0.4)
}

export default App
