import { Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { teams } from '../../data/mockData.js'

function AdminTeams() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestion"
        title="Equipes"
        description="Organisez les equipes, villes, matchs joues et points."
        action={
          <button className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <Plus size={16} />
            Ajouter
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teams.map((team) => (
          <article key={team.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid size-11 place-items-center rounded-md bg-slate-950 text-sm font-semibold text-white">
              {team.name.split(' ').map((word) => word[0]).join('')}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{team.name}</h2>
            <p className="text-sm text-slate-500">{team.city}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Matchs</p>
                <p className="text-lg font-semibold text-slate-950">{team.played}</p>
              </div>
              <div className="rounded-md bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700">Points</p>
                <p className="text-lg font-semibold text-emerald-800">{team.points}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminTeams
