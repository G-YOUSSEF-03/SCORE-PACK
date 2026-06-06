import { Check } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader.jsx'

const plans = [
  { name: 'Starter', price: '0 MAD', features: ['Scores publics', 'Calendrier simple', 'Classement basique'] },
  { name: 'Club', price: '149 MAD', highlighted: true, features: ['Dashboard admin', 'Gestion equipes', 'Statistiques hebdo'] },
  { name: 'League', price: '399 MAD', features: ['Multi-competitions', 'Exports', 'Support prioritaire'] },
]

function PricingPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Tarifs"
        title="Une formule pour chaque organisation"
        description="Choisissez le niveau adapte a votre club, ligue ou tournoi."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-lg border p-6 shadow-sm ${
              plan.highlighted ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'
            }`}
          >
            <h2 className="text-lg font-semibold text-slate-950">{plan.name}</h2>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{plan.price}</p>
            <p className="mt-1 text-sm text-slate-500">par mois</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="grid size-5 place-items-center rounded-md bg-white text-emerald-700 ring-1 ring-emerald-100">
                    <Check size={14} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="mt-7 w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              Choisir
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PricingPage
