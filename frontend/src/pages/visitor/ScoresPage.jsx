import PageHeader from '../../components/ui/PageHeader.jsx'
import StatusPill from '../../components/ui/StatusPill.jsx'
import { featuredMatches, teams } from '../../data/mockData.js'

function ScoresPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Resultats"
        title="Scores et classements"
        description="Une vue claire des matchs en direct, termines et programmes."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {featuredMatches.map((match) => (
            <article key={match.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <StatusPill tone={match.status}>{statusLabel(match.status)}</StatusPill>
                <span className="text-sm font-medium text-slate-500">{match.league}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <p className="font-semibold text-slate-950">{match.home}</p>
                <div className="min-w-28 rounded-md bg-slate-100 px-4 py-2 text-center text-xl font-semibold">
                  {match.homeScore === null ? match.time : `${match.homeScore} - ${match.awayScore}`}
                </div>
                <p className="text-right font-semibold text-slate-950">{match.away}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Classement</h2>
          <div className="mt-4 space-y-3">
            {teams.map((team, index) => (
              <div key={team.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-md bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-500">{index + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{team.name}</p>
                  <p className="text-xs text-slate-500">{team.played} matchs</p>
                </div>
                <span className="text-sm font-semibold text-emerald-700">{team.points} pts</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

function statusLabel(status) {
  return {
    live: 'Live',
    scheduled: 'Programme',
    finished: 'Termine',
  }[status]
}

export default ScoresPage
