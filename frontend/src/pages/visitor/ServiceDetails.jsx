import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Folder,
  Handshake,
  PieChart,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Target,
} from 'lucide-react'
import aboutMeeting from '../../assets/corporate/about-meeting.png'
import { apiErrorMessage } from '../../api/client.js'
import { publicApi } from '../../api/resources.js'

const serviceIcons = {
  'bar-chart-3': BarChart3,
  settings: Settings,
  'pie-chart': PieChart,
  folder: Folder,
  handshake: Handshake,
  'clipboard-list': ClipboardList,
}

const benefitIcons = [BarChart3, Target, ShieldCheck, PieChart]
const processIcons = [FileText, Search, Settings, Calculator, Scale, CheckCircle2]

function ServiceDetails() {
  const { slug } = useParams()
  const [request, setRequest] = useState({
    slug: null,
    service: null,
    loading: true,
    error: '',
  })

  useEffect(() => {
    let active = true

    window.scrollTo({ top: 0, behavior: 'smooth' })

    publicApi.serviceDetails(slug)
      .then((data) => {
        if (!active) return
        setRequest({ slug, service: data, loading: false, error: '' })
      })
      .catch((requestError) => {
        if (!active) return
        setRequest({
          slug,
          service: null,
          loading: false,
          error: apiErrorMessage(requestError, 'Impossible de charger ce service.'),
        })
      })

    return () => {
      active = false
    }
  }, [slug])

  const loading = request.slug !== slug || request.loading
  const error = request.slug === slug ? request.error : ''
  const service = request.slug === slug ? request.service : null

  const details = useMemo(() => {
    if (!service) return null

    return {
      title: service.title || '',
      description: service.full_description || service.short_description || service.description || '',
      image: service.image_url || service.image || aboutMeeting,
      icon: serviceIcons[service.icon] || ClipboardCheck,
      advantages: asArray(service.advantages),
      processSteps: asArray(service.process_steps),
      deliverables: asArray(service.deliverables),
      ctaTitle: service.cta_title || 'Vous avez un projet ?',
      ctaDescription: service.cta_description || 'Contactez-nous pour une étude personnalisée.',
    }
  }, [service])

  if (loading) {
    return (
      <section className="min-h-[58vh] rounded-[18px] border border-[#E5EAF0] bg-white px-8 py-12 shadow-[0_18px_52px_rgba(15,39,71,0.08)]">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#A77A33]">Nos services</p>
        <h1 className="mt-4 text-[38px] font-extrabold leading-tight tracking-[-0.04em] text-[#0F2747]">Chargement du service...</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#3D4E66]">Nous préparons les informations détaillées de ce service.</p>
      </section>
    )
  }

  if (error || !details) {
    return (
      <section className="min-h-[58vh] rounded-[18px] border border-[#E5EAF0] bg-white px-8 py-12 shadow-[0_18px_52px_rgba(15,39,71,0.08)]">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#A77A33]">Nos services</p>
        <h1 className="mt-4 text-[38px] font-extrabold leading-tight tracking-[-0.04em] text-[#0F2747]">Service introuvable</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-red-600">{error || 'Ce service n’est pas disponible pour le moment.'}</p>
        <a href="/#services" className="mt-7 inline-flex h-12 items-center gap-4 rounded-[8px] bg-[#0F2747] px-6 text-sm font-extrabold text-white">
          Retour aux services
          <ArrowRight size={18} />
        </a>
      </section>
    )
  }

  const ServiceIcon = details.icon

  return (
    <>
      <section className="grid items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
        <div>
          <div className="mb-11 flex flex-wrap items-center gap-3 text-sm font-medium text-[#263A58]">
            <a href="/#accueil" className="hover:text-[#A77A33]">Accueil</a>
            <ChevronRight size={15} className="text-[#C79A4A]" />
            <a href="/#services" className="hover:text-[#A77A33]">Nos services</a>
            <ChevronRight size={15} className="text-[#C79A4A]" />
            <span>{details.title}</span>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7D9BE] bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#A77A33] shadow-[0_10px_28px_rgba(15,39,71,0.06)]">
            <span className="size-1.5 rounded-full bg-[#C79A4A]" />
            Nos services
          </span>

          <h1 className="mt-5 max-w-[650px] text-[45px] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#0F2747] sm:text-[58px]">
            {details.title}
          </h1>
          <p className="mt-6 max-w-[650px] text-[17px] leading-9 text-[#2F405A]">
            {details.description}
          </p>

          {details.advantages.length ? (
            <div className="mt-10 grid gap-0 sm:grid-cols-2 xl:grid-cols-4">
              {details.advantages.slice(0, 4).map((item, index) => (
                <Reveal key={item.title || index} as="div" delay={revealDelay(index)} className="border-[#E0E5EC] py-3 sm:border-r last:border-r-0">
                  <BenefitItem item={item} icon={benefitIcons[index % benefitIcons.length]} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>

        <img
          src={details.image}
          alt={details.title}
          className="h-[330px] w-full rounded-[24px] object-cover shadow-[0_24px_70px_rgba(15,39,71,0.14)] sm:h-[430px]"
        />
      </section>

      {details.processSteps.length ? (
        <Reveal className="mt-16">
          <div className="text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A77A33]">Notre approche</p>
            <h2 className="mx-auto mt-3 max-w-[760px] text-[30px] font-extrabold leading-tight tracking-[-0.035em] text-[#0F2747] sm:text-[38px]">
              Une étude complète et structurée
            </h2>
            <span className="mx-auto mt-4 block h-px w-14 bg-[#C79A4A]" />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
            {details.processSteps.map((step, index) => (
              <Reveal key={step.title || index} as="div" delay={revealDelay(index)}>
                <ProcessCard step={step} index={index} icon={processIcons[index % processIcons.length]} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      ) : null}

      <Reveal className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.72fr_0.62fr]">
        <img
          src={details.image}
          alt=""
          className="h-[300px] w-full rounded-[18px] object-cover shadow-[0_18px_52px_rgba(15,39,71,0.1)] lg:h-full"
        />

        <Reveal as="div" delay={0.1} className="rounded-[18px] bg-white p-7">
          <h2 className="text-[28px] font-extrabold tracking-[-0.035em] text-[#0F2747]">Livrables</h2>
          <span className="mt-3 block h-px w-12 bg-[#C79A4A]" />
          <ul className="mt-7 space-y-4">
            {details.deliverables.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3 text-[15px] leading-6 text-[#263A58]">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#A77A33]" />
                <span>{formatListItem(item)}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="aside" delay={0.2} className="h-fit rounded-[18px] bg-[#F4F1ED] p-8 shadow-[0_16px_42px_rgba(15,39,71,0.06)]">
          <span className="grid size-12 place-items-center rounded-full bg-white text-[#A77A33]">
            <ServiceIcon size={24} />
          </span>
          <h2 className="mt-5 text-[26px] font-extrabold leading-tight tracking-[-0.035em] text-[#0F2747]">{details.ctaTitle}</h2>
          <p className="mt-4 text-[15px] leading-7 text-[#2F405A]">{details.ctaDescription}</p>
          <a href="/#devis" className="mt-6 inline-flex h-12 items-center gap-5 rounded-[8px] bg-[#0F2747] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,39,71,0.18)]">
            Demander un devis
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </Reveal>
    </>
  )
}

function BenefitItem({ item, icon: Icon }) {
  return (
    <div className="px-4 text-center">
      <Icon className="mx-auto text-[#A77A33]" size={36} strokeWidth={2} />
      <h3 className="mt-4 text-sm font-extrabold text-[#0F2747]">{item.title || item}</h3>
      {item.description ? <p className="mt-2 text-[13px] leading-5 text-[#3D4E66]">{item.description}</p> : null}
    </div>
  )
}

function ProcessCard({ step, index, icon: Icon }) {
  return (
    <article className="min-h-[198px] rounded-[16px] border border-[#E5EAF0] bg-white p-6 shadow-[0_14px_38px_rgba(15,39,71,0.06)]">
      <Icon className="text-[#A77A33]" size={36} strokeWidth={1.9} />
      <h3 className="mt-6 text-[15px] font-extrabold leading-6 text-[#A77A33]">
        {index + 1}. {step.title || step}
      </h3>
      {step.description ? <p className="mt-3 text-sm leading-6 text-[#263A58]">{step.description}</p> : null}
    </article>
  )
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatListItem(value) {
  if (typeof value === 'string') return value
  return value?.title || value?.name || ''
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

export default ServiceDetails
