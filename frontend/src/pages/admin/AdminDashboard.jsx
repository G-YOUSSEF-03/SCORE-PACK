import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  CalendarDays,
  ChevronDown,
  FileText,
  FolderKanban,
  MessageSquareText,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiErrorMessage } from "../../api/client.js";
import { dashboardApi } from "../../api/resources.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const quoteData = [
  { month: "Déc", demandes: 8 },
  { month: "Jan", demandes: 13 },
  { month: "Fév", demandes: 15 },
  { month: "Mar", demandes: 20 },
  { month: "Avr", demandes: 15 },
  { month: "Mai", demandes: 18 },
];

const fallbackDistribution = [
  { name: "Immobilier", value: 12, percent: "37.5%", color: "#061f49" },
  { name: "Industrie", value: 8, percent: "25.0%", color: "#c88a22" },
  { name: "Infrastructure", value: 7, percent: "21.9%", color: "#6f87ad" },
  { name: "Énergie", value: 3, percent: "9.4%", color: "#a9c8eb" },
  { name: "Agriculture", value: 2, percent: "6.2%", color: "#edd09b" },
];

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { notify } = useToast();

  useEffect(() => {
    dashboardApi
      .get()
      .then(setDashboard)
      .catch((error) =>
        notify(
          apiErrorMessage(error, "Impossible de charger le tableau de bord."),
          "error",
        ),
      )
      .finally(() => setLoading(false));
  }, [notify]);

  const stats = useMemo(
    () => [
      {
        label: "Projets",
        value: String(dashboard?.totals?.projects ?? 32),
        growth: "↗ 12% ce mois",
        icon: FolderKanban,
        tone: "navy",
      },
      {
        label: "Demandes de devis",
        value: String(dashboard?.totals?.quote_requests ?? 18),
        growth: "↗ 8% ce mois",
        icon: FileText,
        tone: "gold",
      },
      {
        label: "Messages",
        value: String(dashboard?.totals?.messages ?? 25),
        growth: "↗ 15% ce mois",
        icon: MessageSquareText,
        tone: "navy",
      },
      {
        label: "Utilisateurs",
        value: String(dashboard?.totals?.users ?? 6),
        growth: "↗ 0% ce mois",
        icon: UsersRound,
        tone: "gold",
        muted: true,
      },
    ],
    [dashboard],
  );

  const quoteRows = dashboard?.recent_quote_requests?.length
    ? dashboard.recent_quote_requests.map((quote) => ({
        title: quote.project_title,
        category: quote.full_name,
        status: quote.status === "new" ? "Nouveau" : quote.status === "treated" ? "Traité" : "En cours",
        date: formatDate(quote.created_at),
      }))
    : [
        {
          title: "Complexe résidentiel à Casablanca",
          category: "Immobilier",
          status: "Nouveau",
          date: "24 mai 2024",
        },
        {
          title: "Unité de production industrielle",
          category: "Industrie",
          status: "En cours",
          date: "23 mai 2024",
        },
        {
          title: "Centrale solaire à Ouarzazate",
          category: "Énergie",
          status: "Nouveau",
          date: "22 mai 2024",
        },
        {
          title: "Aménagement routier à Marrakech",
          category: "Infrastructure",
          status: "En cours",
          date: "21 mai 2024",
        },
      ];

  const activities = dashboard?.recent_activity?.length
    ? dashboard.recent_activity.map((activity) => ({
        icon: activity.type === "quote_request" ? FileText : MessageSquareText,
        title: activity.title,
        detail: activity.description,
        time: formatRelative(activity.created_at),
        tone: activity.type === "quote_request" ? "gold" : "blue",
      }))
    : [
        {
          icon: FileText,
          title: "Nouvelle demande de devis reçue",
          detail: "Complexe hôtelier à Agadir",
          time: "Il y a 10 minutes",
          tone: "gold",
        },
        {
          icon: MessageSquareText,
          title: "Nouveau message de contact",
          detail: "De la part de Société XYZ",
          time: "Il y a 1 heure",
          tone: "gold",
        },
        {
          icon: BellRing,
          title: "Projet mis à jour",
          detail: "Unité de production à Berrechid",
          time: "Il y a 3 heures",
          tone: "blue",
        },
        {
          icon: UsersRound,
          title: "Nouvel utilisateur ajouté",
          detail: "Sara Benali a rejoint l'équipe",
          time: "Il y a 5 heures",
          tone: "blue",
        },
      ];

  const distribution = useMemo(() => {
    const rows = dashboard?.project_category_distribution || [];
    const total = rows.reduce((sum, row) => sum + Number(row.total), 0);
    const colors = ["#061f49", "#c88a22", "#6f87ad", "#a9c8eb", "#edd09b"];
    return rows.length
      ? rows.map((row, index) => ({
          name: row.category,
          value: Number(row.total),
          percent: `${((Number(row.total) / total) * 100).toFixed(1)}%`,
          color: colors[index % colors.length],
        }))
      : fallbackDistribution;
  }, [dashboard]);

  return (
    <div className="mx-auto max-w-[1480px] space-y-7">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[31px] font-extrabold leading-tight tracking-[-0.04em] text-[#061f49] sm:text-[34px]">
            Bonjour, {user?.name?.split(" ")[0] || "Youssef"}
          </h1>
          <p className="mt-2 text-[16px] font-medium text-[#4b5f86]">
            Voici ce qui se passe sur votre plateforme aujourd&apos;hui.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-[52px] w-fit items-center gap-3 rounded-[9px] border border-[#dce4ef] bg-white px-5 text-[15px] font-extrabold text-[#061f49] shadow-[0_8px_22px_rgba(6,31,73,0.04)]"
        >
          <CalendarDays size={18} />
          24 mai 2024
          <ChevronDown size={18} />
        </button>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      {loading ? (
        <p className="text-sm font-bold text-[#52668c]">
          Chargement des données...
        </p>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
        <LineChartCard />
        <DonutChartCard projectDistribution={distribution} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <QuotesCard quoteRows={quoteRows} />
        <ActivityCard activities={activities} />
      </section>
    </div>
  );
}

function StatCard({ label, value, growth, icon: Icon, tone, muted }) {
  return (
    <article className="flex min-h-[142px] items-center gap-6 rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <span
        className={`grid size-[64px] shrink-0 place-items-center rounded-full text-white shadow-[0_12px_24px_rgba(6,31,73,0.14)] ${tone === "gold" ? "bg-[linear-gradient(145deg,#d9a23b,#bb7b16)]" : "bg-[#061f49]"}`}
      >
        <Icon size={29} strokeWidth={2.1} />
      </span>
      <div>
        <p className="text-[31px] font-extrabold leading-none tracking-[-0.03em] text-[#061f49]">
          {value}
        </p>
        <h2 className="mt-3 text-[15px] font-extrabold text-[#061f49]">
          {label}
        </h2>
        <p
          className={`mt-3 text-[14px] font-semibold ${muted ? "text-[#4b5f86]" : "text-[#008c45]"}`}
        >
          {growth}
        </p>
      </div>
    </article>
  );
}

function LineChartCard() {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[18px] font-extrabold text-[#061f49]">
          Demandes de devis
        </h2>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-extrabold text-[#061f49]"
        >
          Les 6 derniers mois
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="mt-5 h-[296px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={quoteData}
            margin={{ left: -16, right: 18, top: 16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="quoteArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#9fc8ec" stopOpacity={0.54} />
                <stop offset="100%" stopColor="#d9ecfb" stopOpacity={0.18} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e5ebf3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              dy={12}
              tick={{ fill: "#263a5f", fontSize: 14, fontWeight: 600 }}
            />
            <YAxis
              ticks={[0, 10, 20, 30, 40]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#263a5f", fontSize: 14, fontWeight: 600 }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="demandes"
              stroke="#061f49"
              fill="url(#quoteArea)"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#061f49", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function DonutChartCard({ projectDistribution }) {
  const total = projectDistribution.reduce((sum, item) => sum + item.value, 0);
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[18px] font-extrabold text-[#061f49]">
        Répartition des projets
      </h2>
      <div className="mt-6 grid items-center gap-6 md:grid-cols-[240px_1fr]">
        <div className="relative h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectDistribution}
                dataKey="value"
                innerRadius={70}
                outerRadius={108}
                paddingAngle={1}
                stroke="#fff"
                strokeWidth={2}
              >
                {projectDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-[32px] font-extrabold leading-none text-[#061f49]">
                {total}
              </p>
              <p className="mt-2 text-[16px] font-medium text-[#061f49]">
                Projets
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {projectDistribution.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[1fr_auto] items-center gap-4 text-[14px] font-semibold text-[#061f49]"
            >
              <span className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
              <span>
                {item.value} ({item.percent})
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function QuotesCard({ quoteRows }) {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[18px] font-extrabold text-[#061f49]">
        Dernières demandes de devis
      </h2>
      <div className="mt-6 divide-y divide-[#e9eef5]">
        {quoteRows.map((row) => (
          <div
            key={`${row.title}-${row.date}`}
            className="grid gap-4 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#edf4fd] text-[#061f49]">
                <UserRound size={21} />
              </span>
              <div>
                <p className="text-[14px] font-extrabold text-[#061f49]">
                  {row.title}
                </p>
                <p className="mt-1 text-[14px] font-medium text-[#52668c]">
                  {row.category}
                </p>
              </div>
            </div>
            <StatusPill status={row.status} />
            <p className="text-[14px] font-medium text-[#52668c] sm:text-right">
              {row.date}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ActivityCard({ activities }) {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[18px] font-extrabold text-[#061f49]">
        Activité récente
      </h2>
      <div className="mt-7 space-y-[22px]">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={`${activity.title}-${activity.detail}`}
              className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div className="flex items-center gap-5">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full ${activity.tone === "gold" ? "bg-[#f7ead8] text-[#c88a22]" : "bg-[#e6f2ff] text-[#006bd6]"}`}
                >
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-[14px] font-extrabold text-[#061f49]">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-[14px] font-medium text-[#52668c]">
                    {activity.detail}
                  </p>
                </div>
              </div>
              <p className="text-[14px] font-medium text-[#52668c] sm:text-right">
                {activity.time}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function StatusPill({ status }) {
  const isNew = status === "Nouveau";
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-4 py-1.5 text-[13px] font-extrabold ${isNew ? "bg-[#f7ead8] text-[#b87408]" : "bg-[#e6f2ff] text-[#006bd6]"}`}
    >
      {status}
    </span>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatRelative(value) {
  const diff = Math.max(
    1,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );
  if (diff < 60) return `Il y a ${diff} minutes`;
  if (diff < 1440) return `Il y a ${Math.round(diff / 60)} heures`;
  return formatDate(value);
}

export default AdminDashboard;
