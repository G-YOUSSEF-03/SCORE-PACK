import { Loader2, Trash2, X } from 'lucide-react'

function ConfirmDeleteModal({
  open,
  title = 'Supprimer',
  message = 'Etes-vous sur de vouloir supprimer cet element ?',
  details = 'Cette action est irreversible.',
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-[#061f49]/55 px-4 backdrop-blur-[2px]">
      <article className="w-full max-w-[460px] rounded-[18px] border border-[#e4eaf2] bg-white p-6 shadow-[0_28px_80px_rgba(6,31,73,0.28)]">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#fff0f0] text-[#ff1717]">
            <Trash2 size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#071f49]">{title}</h2>
            <p className="mt-3 text-[15px] font-semibold leading-7 text-[#33496f]">{message}</p>
            <p className="mt-1 text-[14px] font-medium leading-6 text-[#657998]">{details}</p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            disabled={loading}
            onClick={onCancel}
            className="grid size-9 shrink-0 place-items-center rounded-[8px] text-[#52668c] transition hover:bg-[#f3f6fb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#dce4ef] bg-white px-6 text-sm font-extrabold text-[#071f49] transition hover:bg-[#f3f6fb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#ff1717] px-6 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(255,23,23,0.22)] transition hover:bg-[#d91414] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
            {confirmLabel}
          </button>
        </div>
      </article>
    </div>
  )
}

export default ConfirmDeleteModal
