import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Palette,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserCog,
  UserRound,
} from "lucide-react";
import { apiErrorMessage } from "../../api/client.js";
import { adminSettingsApi } from "../../api/resources.js";
import { useToast } from "../../context/ToastContext.jsx";

const tabs = [
  { label: "Général", icon: Settings, active: true },
  { label: "Profil", icon: UserRound },
  { label: "Sécurité", icon: ShieldCheck },
  { label: "Notifications", icon: Bell },
  { label: "Apparence", icon: Palette },
  { label: "Sauvegarde", icon: Upload },
];

const defaultForm = {
  company_name: "SCORE PACK",
  tagline: "Bureau d’études des projets d’investissement",
  email: "youssefelgourari1@gmail.com",
  phone: "+212 6 12 34 56 78",
  secondary_phone: "+212 5 22 98 76 54",
  address: "RUE SARIA BEN ZOUNAIM ETG 3 APPT 3, PALMIER, CASABLANCA, MOROCCO",
  city: "Casablanca",
  country: "Maroc",
  working_hours: "Lundi - Vendredi : 08h30 - 18h30 / Samedi : 09h00 - 13h00",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  youtube_url: "",
};

function AdminSettings() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { notify } = useToast();

  useEffect(() => {
    adminSettingsApi
      .get()
      .then((settings) => setForm({ ...defaultForm, ...(settings || {}) }))
      .catch((error) => {
        const text = apiErrorMessage(
          error,
          "Impossible de charger les paramètres.",
        );
        setMessage({ type: "error", text });
        notify(text, "error");
      })
      .finally(() => setLoading(false));
  }, [notify]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value || ""),
    );

    try {
      const settings = await adminSettingsApi.update(formData);
      setForm({ ...defaultForm, ...(settings || {}) });
      setMessage({
        type: "success",
        text: "Paramètres enregistrés avec succès.",
      });
      notify("Paramètres enregistrés avec succès.");
    } catch (error) {
      const text = apiErrorMessage(error, "Enregistrement impossible.");
      setMessage({ type: "error", text });
      notify(text, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1480px] space-y-5">
      <section>
        <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">
          Paramètres
        </h1>
        <nav
          className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]"
          aria-label="Fil d’Ariane"
        >
          <a href="/admin" className="transition hover:text-[#c88a22]">
            Accueil
          </a>
          <ChevronRight size={17} className="text-[#8a9ab5]" />
          <span className="text-[#c88a22]">Paramètres</span>
        </nav>
      </section>

      <TabsBar />
      {loading ? (
        <p className="text-sm font-bold text-[#52668c]">
          Chargement des paramètres...
        </p>
      ) : null}
      {message.text ? (
        <p
          className={`text-sm font-bold ${message.type === "success" ? "text-emerald-700" : "text-red-600"}`}
        >
          {message.text}
        </p>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_0.6fr]">
        <div className="space-y-6">
          <GeneralInfoCard
            form={form}
            onChange={onChange}
            onSubmit={saveSettings}
            saving={saving}
          />
          <RegionalPreferencesCard
            form={form}
            onChange={onChange}
            onSubmit={saveSettings}
            saving={saving}
          />
        </div>

        <aside className="space-y-6">
          <AdminProfileCard />
          <SecurityCard />
          <DangerCard />
        </aside>
      </section>

      <p className="pb-4 pt-5 text-center text-[14px] font-medium text-[#33496f]">
        © 2026 {form.company_name || "SCORE PACK"}. Tous droits réservés.
      </p>
    </div>
  );
}

function TabsBar() {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-[#e4eaf2] bg-white px-3 shadow-[0_12px_30px_rgba(6,31,73,0.06)]">
      <div className="flex min-w-[760px] items-center gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              type="button"
              className={`relative inline-flex h-[64px] items-center gap-3 px-4 text-[14px] font-extrabold transition ${
                tab.active
                  ? "text-[#c88a22]"
                  : "text-[#24395f] hover:text-[#c88a22]"
              }`}
            >
              <Icon size={17} />
              {tab.label}
              {tab.active ? (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#c88a22]" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GeneralInfoCard({ form, onChange, onSubmit, saving }) {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">
        Informations générales
      </h2>
      <form onSubmit={onSubmit} className="mt-6 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Nom de l’entreprise"
            name="company_name"
            value={form.company_name}
            onChange={onChange}
          />
          <Field
            label="Email de contact"
            name="email"
            value={form.email}
            type="email"
            onChange={onChange}
          />
          <Field
            label="Téléphone"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />
          <Field
            label="Téléphone secondaire"
            name="secondary_phone"
            value={form.secondary_phone}
            onChange={onChange}
          />
          <Field
            label="Adresse"
            name="address"
            value={form.address}
            onChange={onChange}
          />
          <Field
            label="Ville"
            name="city"
            value={form.city}
            onChange={onChange}
          />
          <Field
            label="Pays"
            name="country"
            value={form.country}
            onChange={onChange}
          />
        </div>
        <label className="block">
          <span className="text-[14px] font-extrabold text-[#071f49]">
            Slogan
          </span>
          <textarea
            name="tagline"
            value={form.tagline}
            onChange={onChange}
            className="mt-3 min-h-[86px] w-full resize-y rounded-[8px] border border-[#dce4ef] bg-white px-4 py-3 text-[15px] font-medium leading-6 text-[#071f49] outline-none transition focus:border-[#c88a22]"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 w-fit items-center rounded-[8px] bg-[#061f49] px-5 text-[14px] font-extrabold text-white shadow-[0_12px_22px_rgba(6,31,73,0.16)] transition hover:bg-[#0b2d63] disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </article>
  );
}

function RegionalPreferencesCard({ form, onChange, onSubmit, saving }) {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">
        Préférences régionales
      </h2>
      <form onSubmit={onSubmit} className="mt-6 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Horaires de travail"
            name="working_hours"
            value={form.working_hours}
            onChange={onChange}
          />
          <Field
            label="Facebook"
            name="facebook_url"
            value={form.facebook_url}
            onChange={onChange}
          />
          <Field
            label="Instagram"
            name="instagram_url"
            value={form.instagram_url}
            onChange={onChange}
          />
          <Field
            label="LinkedIn"
            name="linkedin_url"
            value={form.linkedin_url}
            onChange={onChange}
          />
          <Field
            label="YouTube"
            name="youtube_url"
            value={form.youtube_url}
            onChange={onChange}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 w-fit items-center rounded-[8px] bg-[#061f49] px-5 text-[14px] font-extrabold text-white shadow-[0_12px_22px_rgba(6,31,73,0.16)] transition hover:bg-[#0b2d63] disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </article>
  );
}

function AdminProfileCard() {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">
        Profil de l&apos;administrateur
      </h2>
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <span className="grid size-[86px] shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#f8ecd3,#c88a22)] text-[#c88a22]">
          <UserRound size={58} fill="currentColor" strokeWidth={1.4} />
        </span>
        <div>
          <p className="text-[20px] font-extrabold text-[#071f49]">
            Youssef Admin
          </p>
          <p className="mt-2 text-[14px] font-medium text-[#33496f]">
            Administrateur
          </p>
          <p className="mt-3 text-[14px] font-medium text-[#33496f]">
            youssef.admin@scorepack.ma
          </p>
        </div>
      </div>
      <button
        type="button"
        className="mt-7 inline-flex h-11 items-center gap-3 rounded-[8px] border border-[#dce4ef] bg-white px-5 text-[14px] font-extrabold text-[#071f49] transition hover:bg-[#f7f9fc]"
      >
        <UserCog size={18} />
        Modifier le profil
      </button>
    </article>
  );
}

function SecurityCard() {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#071f49]">
        Sécurité du compte
      </h2>
      <div className="mt-7 divide-y divide-[#e8edf4]">
        <div className="flex items-center justify-between gap-4 pb-5">
          <div>
            <p className="text-[15px] font-extrabold text-[#071f49]">
              Mot de passe
            </p>
            <p className="mt-2 text-[14px] font-medium text-[#33496f]">
              Dernière modification : 15 mars 2024
            </p>
          </div>
          <button
            type="button"
            className="h-10 rounded-[8px] border border-[#dce4ef] bg-white px-5 text-[14px] font-extrabold text-[#071f49] transition hover:bg-[#f7f9fc]"
          >
            Modifier
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-[15px] font-extrabold text-[#071f49]">
              Authentification à deux facteurs (2FA)
            </p>
            <p className="mt-2 max-w-[360px] text-[14px] font-medium leading-6 text-[#33496f]">
              Renforcez la sécurité de votre compte en activant
              l’authentification à deux facteurs.
            </p>
          </div>
          <button
            type="button"
            aria-label="2FA activée"
            className="relative h-8 w-14 shrink-0 rounded-full bg-[#061f49] shadow-inner"
          >
            <span className="absolute right-1 top-1 size-6 rounded-full bg-white shadow-[0_3px_8px_rgba(6,31,73,0.28)]" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 pt-5">
          <div>
            <p className="text-[15px] font-extrabold text-[#071f49]">
              Sessions actives
            </p>
            <p className="mt-2 text-[14px] font-medium text-[#33496f]">
              Vous êtes connecté sur 1 appareil
            </p>
          </div>
          <button
            type="button"
            className="h-10 rounded-[8px] border border-[#dce4ef] bg-white px-5 text-[14px] font-extrabold text-[#071f49] transition hover:bg-[#f7f9fc]"
          >
            Voir les sessions
          </button>
        </div>
      </div>
    </article>
  );
}

function DangerCard() {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-[#d00000]">
        Zone dangereuse
      </h2>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Trash2 size={21} className="mt-1 shrink-0 text-[#ff1717]" />
          <div>
            <p className="text-[15px] font-extrabold text-[#d00000]">
              Supprimer le compte
            </p>
            <p className="mt-2 max-w-[360px] text-[13px] font-medium leading-5 text-[#33496f]">
              Cette action est irréversible. Toutes vos données seront
              définitivement supprimées.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="h-11 rounded-[8px] border border-[#ff6b6b] bg-white px-6 text-[14px] font-extrabold text-[#ff1717] transition hover:bg-[#fff0f0]"
        >
          Supprimer
        </button>
      </div>
    </article>
  );
}

function Field({ label, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="text-[14px] font-extrabold text-[#071f49]">{label}</span>
      <input
        type={type}
        className="mt-3 h-[46px] w-full rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[15px] font-medium text-[#071f49] outline-none transition focus:border-[#c88a22]"
        {...props}
      />
    </label>
  );
}

export default AdminSettings;
