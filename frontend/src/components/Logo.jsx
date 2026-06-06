import logoScorePack from '../assets/logo-score-pack.png'

const heights = {
  navbar: 48,
  footer: 50,
  sidebar: 55,
  login: 90,
  mobile: 42,
  icon: 42,
}

function Logo({ variant = 'light', size = 'navbar', icon = false, className = '' }) {
  const height = heights[size] || heights.navbar
  const isDark = variant === 'dark'

  if (icon) {
    return (
      <span
        className={`inline-flex overflow-hidden ${isDark ? 'rounded-[10px] bg-white p-1.5 shadow-sm' : ''} ${className}`}
        style={{ width: height, height }}
      >
        <img
          src={logoScorePack}
          alt="SCORE PACK Bureau d'études"
          className="h-full max-w-none object-contain object-left"
        />
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center ${isDark ? 'rounded-[12px] bg-white px-3 py-2 shadow-sm' : ''} ${className}`}>
      <img
        src={logoScorePack}
        alt="SCORE PACK Bureau d'études"
        className="w-auto object-contain"
        style={{ height }}
      />
    </span>
  )
}

export default Logo
