import { ArrowRight, BellRing, CalendarDays, Radio, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredMatches } from '../../data/mockData.js'
import StatusPill from '../../components/ui/StatusPill.jsx'

function HomePage() {
  const liveMatch = featuredMatches[0]

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
              <Radio size={16} />
              Scores en direct
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Suivez vos matchs, equipes et classements au meme endroit.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Score Pack centralise les resultats live, le calendrier, les equipes et les statistiques pour une gestion sportive rapide et claire.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/scores" className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                Voir les scores
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                Espace admin
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white shadow-xl">
            <div className="rounded-md bg-white/8 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <StatusPill tone="live">Live</StatusPill>
                <span className="text-sm text-slate-300">{liveMatch.league}</span>
              </div>
              <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <TeamScore name={liveMatch.home} score={liveMatch.homeScore} />
                <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950">{liveMatch.time}</div>
                <TeamScore name={liveMatch.away} score={liveMatch.awayScore} align="right" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Feature icon={BellRing} label="Alertes" value="24/7" />
              <Feature icon={CalendarDays} label="Matchs" value="156" />
              <Feature icon={Trophy} label="Ligues" value="12" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function TeamScore({ name, score, align = 'left' }) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <p className="text-sm text-slate-300">{name}</p>
      <p className="mt-2 text-5xl font-semibold tracking-tight">{score}</p>
    </div>
  )
}

function Feature({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md bg-white/8 p-3 ring-1 ring-white/10">
      <Icon size={17} className="text-emerald-300" />
      <p className="mt-3 text-xs text-slate-300">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

export default HomePage
