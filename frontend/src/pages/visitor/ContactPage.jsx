import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BarChart3, BriefcaseBusiness, ChevronDown, Clock3, FileCheck2, Mail, MapPin, Phone } from 'lucide-react'
import aboutMeeting from '../../assets/corporate/about-meeting.png'
import { apiErrorMessage } from '../../api/client.js'
import { publicApi } from '../../api/resources.js'

const companyAddress = 'RUE SARIA BEN ZOUNAIM ETG 3 APPT 3, PALMIER, CASABLANCA, MOROCCO'
const publicDisplayEmail = 'contact@casacar.ma'

const fallbackSettings = {
  company_name: 'SCORE PACK',
  tagline: 'Bureau d’études des projets d’investissement',
  email: publicDisplayEmail,
  phone: '+212 6 12 34 56 78',
  secondary_phone: '+212 5 22 98 76 54',
  address: '123 Boulevard Mohammed V, Résidence Al Qods, 5ème étage',
  city: 'Casablanca',
  country: 'Maroc',
  working_hours: 'Lundi - Vendredi : 08h30 - 18h30 / Samedi : 09h00 - 13h00',
}

const contactCards = [
  {
    icon: MapPin,
    title: 'Adresse',
    lines: ['Casablanca, Maroc', 'Bureau d’études SCORE PACK'],
  },
  {
    icon: Phone,
    title: 'Téléphone',
    lines: ['+212 6 12 34 56 78', '+212 5 22 00 00 00'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: [publicDisplayEmail],
  },
  {
    icon: Clock3,
    title: 'Horaires d’ouverture',
    lines: ['Lun - Ven : 9h00 - 18h00', 'Sam : 9h00 - 13h00'],
  },
]

const reasons = [
  {
    icon: BarChart3,
    title: 'Études de faisabilité',
    text: 'Validez la viabilité de votre projet avec une analyse technique, économique et stratégique complète.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Études financières',
    text: 'Structurez vos prévisions, votre rentabilité et votre plan de financement avec des données fiables.',
  },
  {
    icon: FileCheck2,
    title: 'Montage de dossiers',
    text: 'Préparez des dossiers solides pour les investisseurs, banques, administrations et partenaires.',
  },
]

const faqs = [
  'Comment demander un devis ?',
  'Travaillez-vous partout au Maroc ?',
  'Quel est le délai pour une étude ?',
  'Quels types de projets accompagnez-vous ?',
]

function ContactPage({ publicData }) {
  const settings = { ...fallbackSettings, ...(publicData?.settings || {}) }
  const cards = buildContactCards(settings)
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', subject: '', message: '' })
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
    const nextErrors = validateContactForm(form)
    setErrors(nextErrors)
    setStatus({ type: '', message: '' })

    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      await publicApi.contactMessage(form)
      setForm({ full_name: '', phone: '', email: '', subject: '', message: '' })
      setStatus({ type: 'success', message: 'Votre message a été envoyé avec succès.' })
    } catch (error) {
      setStatus({ type: 'error', message: apiErrorMessage(error, 'Impossible d’envoyer votre message.') })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-7 text-[#061f49]">
      <section className="grid items-center gap-10 rounded-[26px] bg-[#f7f9fc] py-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <nav className="flex items-center gap-2 text-[13px] font-bold text-[#6f7d91]" aria-label="Fil d’Ariane">
            <a href="#accueil" className="transition hover:text-[#b8842c]">Accueil</a>
            <span className="text-[#b8842c]">&gt;</span>
            <span className="text-[#061f49]">Contact</span>
          </nav>

          <h1 className="mt-7 max-w-[610px] text-[46px] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[64px]">
            Contactez-<span className="text-[#b8842c]">nous</span>
          </h1>
          <div className="mt-5 h-[4px] w-16 rounded-full bg-[#b8842c]" />
          <p className="mt-7 max-w-[640px] text-[17px] leading-8 text-[#43526a]">
            Notre équipe est à votre disposition pour répondre à vos questions et vous accompagner dans vos projets d’investissement.
          </p>
        </div>

        <div className="relative">
          <img
            src={aboutMeeting}
            alt="Reunion professionnelle dans un bureau"
            className="h-[330px] w-full rounded-[28px] object-cover shadow-[0_24px_70px_rgba(6,31,73,0.14)] sm:h-[430px]"
          />
        </div>
      </section>

      <Reveal className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <Reveal key={card.title} as="div" delay={revealDelay(index)}>
            <ContactInfoCard {...card} />
          </Reveal>
        ))}
      </Reveal>

      <Reveal className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <Reveal as="form" delay={0.1} onSubmit={onSubmit} className="rounded-[22px] border border-[#e6ebf2] bg-white p-6 shadow-[0_18px_50px_rgba(6,31,73,0.08)] sm:p-8">
          <h2 className="text-[28px] font-extrabold tracking-[-0.025em] text-[#061f49]">Envoyez-nous un message</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field label="Nom complet *" name="full_name" value={form.full_name} onChange={onChange} error={errors.full_name} />
            <Field label="Téléphone *" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
            <Field label="Email *" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} />
            <Field label="Sujet *" name="subject" value={form.subject} onChange={onChange} error={errors.subject} />
          </div>
          <label className="mt-5 block">
            <span className="text-sm font-extrabold text-[#061f49]">Votre message *</span>
            <textarea name="message" value={form.message} onChange={onChange} className="mt-2 min-h-[154px] w-full resize-none rounded-[13px] border border-[#dfe6ef] bg-[#f7f9fc] px-4 py-3 text-[#061f49] outline-none transition focus:border-[#b8842c] focus:bg-white" />
            {errors.message ? <p className="mt-2 text-xs font-bold text-red-600">{errors.message}</p> : null}
          </label>
          {status.message ? <p className={`mt-4 text-sm font-bold ${status.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>{status.message}</p> : null}
          <button type="submit" disabled={submitting} className="mt-6 inline-flex h-14 items-center gap-5 rounded-[10px] bg-[#061f49] px-7 text-sm font-extrabold text-white shadow-[0_16px_32px_rgba(6,31,73,0.2)] transition hover:bg-[#0d2d62] disabled:opacity-60">
            {submitting ? 'Envoi...' : 'Envoyer le message'}
            <ArrowRight size={18} />
          </button>
        </Reveal>

        <Reveal as="div" delay={0.2}>
          <MapCard settings={settings} />
        </Reveal>
      </Reveal>

      <Reveal className="rounded-[24px] bg-[#f7f9fc] py-7">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[38px] font-extrabold leading-tight tracking-[-0.035em] text-[#061f49]">Pourquoi nous contacter ?</h2>
          <div className="mx-auto mt-4 h-[4px] w-16 rounded-full bg-[#b8842c]" />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} as="div" delay={revealDelay(index)}>
              <ReasonCard {...reason} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="grid gap-5 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <div>
          <h2 className="text-[38px] font-extrabold leading-tight tracking-[-0.035em] text-[#061f49]">Questions fréquentes</h2>
          <div className="mt-4 h-[4px] w-16 rounded-full bg-[#b8842c]" />
        </div>
        <div className="space-y-4">
          {faqs.map((question, index) => (
            <Reveal key={question} as="div" delay={revealDelay(index)}>
              <button
                type="button"
                className="flex min-h-[68px] w-full items-center justify-between gap-4 rounded-[18px] border border-[#e6ebf2] bg-white px-6 text-left text-[16px] font-extrabold text-[#061f49] shadow-[0_14px_38px_rgba(6,31,73,0.07)]"
              >
                {question}
                <ChevronDown size={20} className="shrink-0 text-[#b8842c]" />
              </button>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <ContactCta />
    </div>
  )
}

function ContactInfoCard({ icon: Icon, title, lines }) {
  return (
    <article className="min-h-[178px] rounded-[20px] border border-[#e6ebf2] bg-white p-6 shadow-[0_18px_48px_rgba(6,31,73,0.08)]">
      <span className="grid size-14 place-items-center rounded-full bg-[#f5efe7] text-[#b8842c]">
        <Icon size={25} strokeWidth={2.3} />
      </span>
      <h2 className="mt-5 text-[18px] font-extrabold tracking-[-0.015em] text-[#061f49]">{title}</h2>
      <div className="mt-3 space-y-1 text-[14px] font-semibold leading-6 text-[#53647c]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  )
}

function buildContactCards(settings) {
  const address = companyAddress
  const hours = String(settings.working_hours || fallbackSettings.working_hours).split('/').map((line) => line.trim())

  return [
    {
      icon: contactCards[0].icon,
      title: contactCards[0].title,
      lines: [address || 'Casablanca, Maroc', settings.tagline || fallbackSettings.tagline],
    },
    {
      icon: contactCards[1].icon,
      title: 'Téléphone',
      lines: [settings.phone, settings.secondary_phone].filter(Boolean),
    },
    {
      icon: contactCards[2].icon,
      title: contactCards[2].title,
      lines: [publicDisplayEmail],
    },
    {
      icon: contactCards[3].icon,
      title: 'Horaires d’ouverture',
      lines: hours,
    },
  ]
}

function Field({ label, type = 'text', error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-[#061f49]">{label}</span>
      <input
        type={type}
        className="mt-2 h-13 w-full rounded-[13px] border border-[#dfe6ef] bg-[#f7f9fc] px-4 text-[#061f49] outline-none transition focus:border-[#b8842c] focus:bg-white"
        {...props}
      />
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  )
}

function validateContactForm(form) {
  const errors = {}
  if (!form.full_name.trim()) errors.full_name = 'Le nom est obligatoire.'
  if (!form.phone.trim()) errors.phone = 'Le téléphone est obligatoire.'
  if (form.phone && !/^\+?[0-9\s().-]{7,20}$/.test(form.phone.trim())) errors.phone = 'Le téléphone est invalide.'
  if (!form.email.trim()) errors.email = 'L’email est obligatoire.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'L’email est invalide.'
  if (!form.subject.trim()) errors.subject = 'Le sujet est obligatoire.'
  if (!form.message.trim()) errors.message = 'Le message est obligatoire.'
  return errors
}

function MapCard({ settings }) {
  const encodedAddress = encodeURIComponent(companyAddress)
  const mapSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[22px] border border-[#e6ebf2] bg-[#dfe7df] shadow-[0_18px_50px_rgba(6,31,73,0.08)]">
      <iframe
        title="SCORE PACK Google Maps"
        src={mapSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
      />
      <div className="absolute left-1/2 top-[55%] z-20 w-[260px] -translate-x-1/2 rounded-[16px] bg-white p-4 shadow-[0_18px_44px_rgba(6,31,73,0.18)]">
        <p className="text-[15px] font-extrabold text-[#061f49]">{settings.company_name}</p>
        <p className="mt-2 text-[13px] font-semibold leading-5 text-[#53647c]">{companyAddress}</p>
      </div>
      <a href={directionsHref} target="_blank" rel="noreferrer" className="absolute left-5 top-5 rounded-[10px] bg-white px-4 py-2 text-xs font-extrabold text-[#061f49] shadow-[0_10px_24px_rgba(6,31,73,0.12)] transition hover:text-[#b8842c]">Get Directions</a>
    </div>
  )
}

function ReasonCard({ icon: Icon, title, text }) {
  return (
    <article className="min-h-[238px] rounded-[22px] border border-[#e6ebf2] bg-white p-7 text-center shadow-[0_18px_48px_rgba(6,31,73,0.08)]">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#f5efe7] text-[#b8842c]">
        <Icon size={29} strokeWidth={2.4} />
      </span>
      <h3 className="mt-6 text-xl font-extrabold tracking-[-0.02em] text-[#061f49]">{title}</h3>
      <p className="mt-4 text-[14px] leading-7 text-[#53647c]">{text}</p>
    </article>
  )
}

function ContactCta() {
  return (
    <Reveal className="pb-1">
      <div className="relative overflow-hidden rounded-[26px] bg-[#061f49] px-7 py-8 text-white shadow-[0_24px_60px_rgba(6,31,73,0.22)] sm:px-10 lg:flex lg:min-h-[176px] lg:items-center lg:justify-between">
        <div className="pointer-events-none absolute -right-10 top-1/2 text-[96px] font-extrabold tracking-[-0.06em] text-white/5 sm:right-10 sm:text-[118px]">
          SCORE PACK
        </div>
        <div className="relative">
          <h2 className="text-[31px] font-extrabold tracking-[-0.035em]">Vous avez un projet en tête ?</h2>
          <p className="mt-3 max-w-[620px] text-[16px] leading-7 text-white/88">
            Contactez-nous dès aujourd&apos;hui pour une étude personnalisée et gratuite.
          </p>
        </div>
        <a href="#devis" className="relative mt-7 inline-flex h-14 items-center gap-7 rounded-[10px] bg-[#b8842c] px-8 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(184,132,44,0.28)] lg:mt-0">
          Demander un devis
          <ArrowRight size={18} />
        </a>
      </div>
    </Reveal>
  )
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

export default ContactPage
