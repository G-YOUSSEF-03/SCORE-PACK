import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlignLeft,
  Bold,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clipboard,
  FileText,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Save,
  Send,
  UploadCloud,
  X,
} from 'lucide-react'
import { apiErrorMessage } from '../../api/client.js'
import { projectsApi } from '../../api/resources.js'
import { useToast } from '../../context/ToastContext.jsx'

const initialForm = {
  title: '',
  category: '',
  location: '',
  status: '',
  short_description: '',
  detailed_description: '',
  client: '',
  project_date: '',
  estimated_budget: '',
  duration: '',
  slug: '',
  meta_title: '',
  meta_description: '',
}

function AdminProjectEdit() {
  const { id } = useParams()
  const [form, setForm] = useState(initialForm)
  const [currentImage, setCurrentImage] = useState('')
  const [currentImageFailed, setCurrentImageFailed] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [slugTouched, setSlugTouched] = useState(true)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { notify } = useToast()

  useEffect(() => {
    let ignore = false
    setLoading(true)
    projectsApi.show(id)
      .then((project) => {
        if (ignore) return
        setForm(projectToForm(project))
        setCurrentImage(project.image_url || '')
        setCurrentImageFailed(false)
        setSlugTouched(true)
      })
      .catch((error) => {
        notify(apiErrorMessage(error, 'Impossible de charger le projet.'), 'error')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id, notify])

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => {
      const next = { ...current, [name]: value }
      if (name === 'title' && !slugTouched) {
        next.slug = slugify(value)
      }
      return next
    })
    if (name === 'slug') setSlugTouched(true)
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const nextErrors = {}
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      nextErrors.project_image = 'Formats acceptes : JPG, PNG, WEBP.'
    }
    if (file.size > 5 * 1024 * 1024) {
      nextErrors.project_image = 'La taille maximale est 5MB.'
    }
    if (Object.keys(nextErrors).length) {
      setErrors((current) => ({ ...current, ...nextErrors }))
      event.target.value = ''
      return
    }

    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setCurrentImageFailed(false)
    setErrors((current) => ({ ...current, project_image: '' }))
  }

  const submit = async (isPublished) => {
    const clientErrors = validateForm(form)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) return

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    formData.append('is_published', isPublished ? '1' : '0')
    formData.append('status', isPublished ? 'published' : 'draft')
    if (image) formData.append('project_image', image)

    setSubmitting(true)
    try {
      await projectsApi.update(id, formData)
      notify(isPublished ? 'Projet mis a jour et publie.' : 'Projet enregistre en brouillon.')
      navigate('/admin/projects')
    } catch (error) {
      setErrors(apiValidationErrors(error))
      notify(apiErrorMessage(error, 'Impossible de mettre a jour le projet.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-[1480px] rounded-[18px] border border-[#e4eaf2] bg-white p-6 text-sm font-bold text-[#52668c] shadow-[0_16px_40px_rgba(6,31,73,0.07)]">Chargement du projet...</div>
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section>
        <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] text-[#071f49]">Modifier le projet</h1>
        <nav className="mt-4 flex items-center gap-3 text-[15px] font-medium text-[#33496f]" aria-label="Fil d'Ariane">
          <Link to="/admin" className="transition hover:text-[#c88a22]">Accueil</Link>
          <ChevronRight size={17} className="text-[#8a9ab5]" />
          <Link to="/admin/projects" className="transition hover:text-[#c88a22]">Projets</Link>
          <ChevronRight size={17} className="text-[#8a9ab5]" />
          <span className="text-[#c88a22]">Modifier le projet</span>
        </nav>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.03fr_1fr]">
        <Panel title="1. Informations generales" icon={Clipboard}>
          <Field label="Titre du projet" name="title" value={form.title} onChange={updateField} error={errors.title} required />
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.9fr_0.85fr]">
            <SelectField label="Categorie" name="category" value={form.category} onChange={updateField} error={errors.category} required>
              <option value="">Selectionner une categorie</option>
              <option>Immobilier</option>
              <option>Industrie</option>
              <option>Energie</option>
              <option>Infrastructure</option>
              <option>Tourisme</option>
              <option>Agriculture</option>
            </SelectField>
            <Field label="Localisation / Ville" name="location" value={form.location} onChange={updateField} error={errors.location} required />
            <SelectField label="Statut" name="status" value={form.status} onChange={updateField} error={errors.status} required>
              <option value="">Selectionner un statut</option>
              <option value="published">Publie</option>
              <option value="draft">Brouillon</option>
            </SelectField>
          </div>
        </Panel>

        <Panel title="2. Image du projet" icon={ImageIcon}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-extrabold text-[#071f49]">Image actuelle</p>
              <div className="grid min-h-[184px] place-items-center overflow-hidden rounded-[9px] bg-[#edf1f6]">
                {preview || (currentImage && !currentImageFailed) ? (
                  <img src={preview || currentImage} alt="" onError={() => setCurrentImageFailed(true)} className="h-full min-h-[184px] w-full object-cover" />
                ) : (
                  <ImageIcon size={70} className="text-[#cbd3df]" fill="currentColor" strokeWidth={1.4} />
                )}
              </div>
              <p className="mt-3 text-xs font-semibold text-[#52668c]">Laissez vide pour conserver l'image actuelle</p>
            </div>
            <div>
              <p className="mb-3 text-sm font-extrabold text-[#071f49]">Changer l'image</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="min-h-[184px] w-full rounded-[14px] border-2 border-dashed border-[#d7e1ee] bg-white text-center transition hover:border-[#c88a22]">
                <span className="mx-auto grid size-12 place-items-center text-[#c88a22]">
                  <UploadCloud size={34} strokeWidth={2.1} />
                </span>
                <span className="mt-5 block text-[14px] font-extrabold text-[#071f49]">Cliquez pour uploader une image</span>
                <span className="mt-2 block text-[13px] font-semibold text-[#52668c]">ou glissez-deposez</span>
                <span className="mt-4 block text-[12px] font-bold text-[#52668c]">JPG, PNG, WEBP - Max 5MB</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={chooseImage} />
            </div>
          </div>
          {errors.project_image ? <p className="mt-2 text-xs font-bold text-red-600">{errors.project_image}</p> : null}
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.03fr_1fr]">
        <Panel title="3. Description" icon={FileText}>
          <TextArea label="Description courte" name="short_description" value={form.short_description} onChange={updateField} error={errors.short_description} required rows={2} />
          <label className="mt-5 block">
            <span className="text-sm font-extrabold text-[#071f49]">Description detaillee <span className="text-red-500">*</span></span>
            <div className="mt-2 overflow-hidden rounded-[9px] border border-[#dce4ef] bg-white">
              <div className="flex h-12 items-center gap-1 border-b border-[#e4eaf2] px-4 text-[#061f49]">
                <button type="button" className="inline-flex h-8 min-w-[130px] items-center justify-between rounded-md px-2 text-xs font-medium text-[#52668c] hover:bg-[#f3f6fb]">
                  Paragraphe
                  <ChevronDown size={13} />
                </button>
                {[Bold, Italic, AlignLeft, List, ListOrdered, Link2].map((Icon, index) => (
                  <button key={index} type="button" className="grid size-8 place-items-center rounded-md hover:bg-[#f3f6fb]">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
              <textarea name="detailed_description" value={form.detailed_description} onChange={updateField} className="min-h-[120px] w-full resize-none border-0 bg-white px-4 py-3 text-[#071f49] outline-none" />
            </div>
            {errors.detailed_description ? <p className="mt-2 text-xs font-bold text-red-600">{errors.detailed_description}</p> : null}
          </label>
        </Panel>

        <Panel title="4. Details du projet" icon={Clipboard}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Client / Promoteur" name="client" value={form.client} onChange={updateField} error={errors.client} />
            <Field label="Date du projet" type="date" name="project_date" value={form.project_date} onChange={updateField} error={errors.project_date} icon={Calendar} />
            <Field label="Budget estime" name="estimated_budget" value={form.estimated_budget} onChange={updateField} error={errors.estimated_budget} />
            <Field label="Duree de realisation" name="duration" value={form.duration} onChange={updateField} error={errors.duration} />
          </div>
        </Panel>
      </section>

      <Panel title="5. SEO (Referencement)" icon={FileText}>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1fr_1.3fr]">
          <Field label="Slug" name="slug" value={form.slug} onChange={updateField} error={errors.slug} required help="Genere automatiquement a partir du titre" />
          <Field label="Meta title" name="meta_title" value={form.meta_title} onChange={updateField} error={errors.meta_title} help="Recommande: 50-60 caracteres" />
          <TextArea label="Meta description" name="meta_description" value={form.meta_description} onChange={updateField} error={errors.meta_description} rows={2} help="Recommande: 150-160 caracteres" />
        </div>
      </Panel>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/admin/projects" className="inline-flex h-12 w-fit items-center gap-4 rounded-[8px] border border-[#dce4ef] bg-white px-7 text-sm font-extrabold text-[#071f49] shadow-sm transition hover:bg-[#f3f6fb]">
          <X size={18} />
          Annuler
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" disabled={submitting} onClick={() => submit(false)} className="inline-flex h-12 items-center gap-4 rounded-[8px] border border-[#e4bd75] bg-white px-7 text-sm font-extrabold text-[#b87408] shadow-sm transition hover:bg-[#fff8ec] disabled:opacity-60">
            <Save size={17} />
            Enregistrer en brouillon
          </button>
          <button type="button" disabled={submitting} onClick={() => submit(true)} className="inline-flex h-12 items-center gap-5 rounded-[8px] bg-[#061f49] px-8 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(6,31,73,0.18)] transition hover:bg-[#0b2d63] disabled:opacity-60">
            {submitting ? 'Mise a jour...' : 'Publier / Mettre a jour'}
            <Send size={17} />
          </button>
        </div>
      </section>
    </div>
  )
}

function projectToForm(project) {
  return {
    title: project.title || '',
    category: project.category || '',
    location: project.location || '',
    status: project.is_published ? 'published' : 'draft',
    short_description: project.short_description || '',
    detailed_description: project.detailed_description || '',
    client: project.client || '',
    project_date: formatDate(project.project_date),
    estimated_budget: project.estimated_budget || '',
    duration: project.duration || '',
    slug: project.slug || '',
    meta_title: project.meta_title || '',
    meta_description: project.meta_description || '',
  }
}

function Panel({ title, icon: Icon, children }) {
  return (
    <article className="rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_16px_40px_rgba(6,31,73,0.07)]">
      <h2 className="mb-5 flex items-center gap-3 text-[18px] font-extrabold tracking-[-0.025em] text-[#071f49]">
        <Icon size={18} />
        {title}
      </h2>
      {children}
    </article>
  )
}

function Field({ label, name, value, onChange, error, help, icon: Icon, required = false, type = 'text', ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-[#071f49]">{label} {required ? <span className="text-red-500">*</span> : null}</span>
      <span className="relative mt-2 block">
        <input type={type} name={name} value={value} onChange={onChange} className="h-11 w-full rounded-[8px] border border-[#dce4ef] bg-white px-4 text-[14px] font-medium text-[#071f49] outline-none transition placeholder:text-[#7d8ca6] focus:border-[#c88a22]" {...props} />
        {Icon ? <Icon size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52668c]" /> : null}
      </span>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : help ? <p className="mt-2 text-xs font-semibold text-[#52668c]">{help}</p> : null}
    </label>
  )
}

function SelectField({ label, name, value, onChange, error, required = false, children }) {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-[#071f49]">{label} {required ? <span className="text-red-500">*</span> : null}</span>
      <span className="relative mt-2 block">
        <select name={name} value={value} onChange={onChange} className="h-11 w-full appearance-none rounded-[8px] border border-[#dce4ef] bg-white px-4 pr-10 text-[14px] font-medium text-[#52668c] outline-none transition focus:border-[#c88a22]">
          {children}
        </select>
        <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52668c]" />
      </span>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  )
}

function TextArea({ label, name, value, onChange, error, help, required = false, rows = 3, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-[#071f49]">{label} {required ? <span className="text-red-500">*</span> : null}</span>
      <textarea name={name} value={value} onChange={onChange} rows={rows} className="mt-2 w-full resize-none rounded-[8px] border border-[#dce4ef] bg-white px-4 py-3 text-[14px] font-medium text-[#071f49] outline-none transition placeholder:text-[#7d8ca6] focus:border-[#c88a22]" {...props} />
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : help ? <p className="mt-2 text-xs font-semibold text-[#52668c]">{help}</p> : null}
    </label>
  )
}

function validateForm(form) {
  const errors = {}
  const required = ['title', 'category', 'location', 'status', 'short_description', 'detailed_description', 'client', 'project_date', 'estimated_budget', 'duration', 'slug', 'meta_title', 'meta_description']
  required.forEach((key) => {
    if (!String(form[key] || '').trim()) errors[key] = 'Ce champ est obligatoire.'
  })
  return errors
}

function apiValidationErrors(error) {
  const fields = error.response?.data?.errors || {}
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value?.[0] || 'Champ invalide.']))
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatDate(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

export default AdminProjectEdit
