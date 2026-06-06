import { Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader.jsx'
import StatusPill from '../../components/ui/StatusPill.jsx'
import { featuredMatches } from '../../data/mockData.js'

function AdminMatches() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestion"
        title="Matchs"
        description="Creez, planifiez et mettez a jour les scores."
        action={
          <button className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <Plus size={16} />
            Nouveau match
          </button>
        }
      />

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_120px_130px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Affiche</span>
          <span>Competition</span>
          <span>Score</span>
          <span>Statut</span>
        </div>
        {featuredMatches.map((match) => (
          <div key={match.id} className="grid grid-cols-[1.4fr_1fr_120px_130px] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
            <div>
              <p className="text-sm font-semibold text-slate-950">{match.home}</p>
              <p className="text-sm text-slate-500">{match.away}</p>
            </div>
            <p className="text-sm text-slate-600">{match.league}</p>
            <p className="text-sm font-semibold text-slate-950">{match.homeScore === null ? match.time : `${match.homeScore} - ${match.awayScore}`}</p>
            <StatusPill tone={match.status}>{match.status}</StatusPill>
          </div>
        ))}
      </section>
    </div>
  )
}

export default AdminMatches
