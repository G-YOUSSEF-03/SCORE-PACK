import { useState } from "react";
import { Eye, LogIn, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import heroBuilding from "../../assets/corporate/login.png";
import { apiErrorMessage } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Logo from "../../components/Logo.jsx";

function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-5 text-[#061f49] sm:px-6 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1680px] flex-col justify-center">
        <section className="grid overflow-hidden rounded-[22px] bg-white shadow-[0_18px_52px_rgba(6,31,73,0.13)] ring-1 ring-[#e4e9f1] lg:min-h-[calc(100vh-88px)] lg:grid-cols-[0.43fr_0.57fr]">
          <BrandPanel />
          <LoginForm />
        </section>

        <p className="py-7 text-center text-[16px] font-medium text-[#415680]">
          © 2026 <span className="font-bold text-[#045ddd]">SCORE PACK.</span>{" "}
          Tous droits réservés.
        </p>
      </div>
    </main>
  );
}

function BrandPanel() {
  return (
    <aside className="relative order-2 min-h-[560px] overflow-hidden bg-[linear-gradient(145deg,#001b3f_0%,#062b61_100%)] px-7 py-9 text-white sm:px-12 lg:order-1 lg:min-h-0 lg:px-[9.2%] lg:py-[9.4%]">
      <Watermark className="left-[-26px] top-12 opacity-[0.08]" />
      <Watermark className="left-20 top-[118px] scale-[0.48] opacity-[0.07]" />
      <Watermark className="left-[-38px] top-[41%] scale-[0.72] opacity-[0.06]" />

      <div className="relative z-10">
        <a href="/" className="flex items-center gap-4">
          <Logo variant="dark" size="login" />
        </a>

        <div className="mt-[70px] h-[3px] w-[54px] rounded-full bg-[#d59a22]" />

        <h1 className="mt-9 max-w-[470px] text-[35px] font-extrabold leading-[1.18] tracking-[-0.045em] sm:text-[40px] lg:text-[37px] xl:text-[40px]">
          Bienvenue sur votre
          <span className="block text-[#d59a22]">espace d’administration</span>
        </h1>

        <p className="mt-7 max-w-[450px] text-[20px] font-medium leading-[1.55] text-white/95 lg:text-[18px] xl:text-[20px]">
          Connectez-vous pour accéder à votre tableau de bord et gérer votre
          activité.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[46%] overflow-hidden">
        <img
          src={heroBuilding}
          alt="Immeuble de bureaux moderne"
          className="h-full w-full object-cover object-center brightness-[0.56] contrast-[1.05] saturate-[0.92]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#062b61_0%,rgba(6,43,97,0.28)_35%,rgba(0,11,31,0.34)_100%)]" />
      </div>
    </aside>
  );
}

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      notify("Connexion réussie.");
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (error) {
      notify(apiErrorMessage(error, "Connexion impossible."), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="order-1 flex items-center justify-center bg-white px-7 py-12 sm:px-10 lg:order-2 lg:px-12">
      <div className="w-full max-w-[575px]">
        <div>
          <h2 className="text-[42px] font-extrabold leading-none tracking-[-0.045em] text-[#061f49]">
            Connexion
          </h2>
          <p className="mt-5 text-[18px] font-medium text-[#425784]">
            Veuillez vous connecter à votre compte admin
          </p>
        </div>

        <form className="mt-[74px]" onSubmit={onSubmit}>
          <Field
            icon={Mail}
            label="Adresse email"
            placeholder="Entrez votre adresse email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
          />
          <Field
            icon={LockKeyhole}
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            trailingIcon={Eye}
            className="mt-[49px]"
          />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-[16px] font-medium">
            <label className="inline-flex items-center gap-3 text-[#061f49]">
              <input
                type="checkbox"
                defaultChecked
                className="size-[18px] rounded-[4px] border-[#061f49] accent-[#061f49]"
              />
              Se souvenir de moi
            </label>
            <a
              href="#forgot-password"
              className="font-semibold text-[#0057ff] transition hover:text-[#d59a22]"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-[52px] flex h-[63px] w-full items-center justify-center gap-5 rounded-[8px] bg-[#061f49] text-[18px] font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#092b62]"
          >
            <LogIn size={23} />
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-[52px] flex items-center justify-center gap-4 text-center text-[16px] font-medium text-[#536994]">
          <ShieldCheck size={24} className="shrink-0 text-[#8fa1c2]" />
          Accès sécurisé. Toutes les données sont protégées.
        </p>
      </div>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type,
  name,
  value,
  onChange,
  trailingIcon: TrailingIcon,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[16px] font-extrabold text-[#061f49]">{label}</span>
      <span className="mt-4 flex h-[58px] items-center rounded-[8px] border border-[#cfd8e8] bg-white px-5 text-[#061f49] shadow-[0_1px_0_rgba(6,31,73,0.02)] transition focus-within:border-[#d59a22]">
        <Icon size={22} className="shrink-0" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-5 text-[17px] font-medium text-[#061f49] outline-none placeholder:text-[#536994]"
        />
        {TrailingIcon ? <TrailingIcon size={21} className="shrink-0" /> : null}
      </span>
    </label>
  );
}

function Watermark({ className }) {
  return (
    <span
      className={`pointer-events-none absolute h-[170px] w-[148px] ${className}`}
    >
      <span className="absolute inset-0 border border-white/30 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
      <span className="absolute inset-[38px] border border-white/25 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
      <span className="absolute inset-[62px] border border-white/20 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
    </span>
  );
}

export default LoginPage;
