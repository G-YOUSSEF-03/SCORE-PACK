function StatusPill({ children, tone = 'slate' }) {
  const tones = {
    live: 'bg-red-50 text-red-700 ring-red-100',
    scheduled: 'bg-sky-50 text-sky-700 ring-sky-100',
    finished: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  )
}

export default StatusPill
