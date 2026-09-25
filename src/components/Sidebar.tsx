import { useEffect, useRef, useState } from 'react'
import {
  ClipboardList,
  Cloud,
  DollarSign,
  Globe,
  LayoutGrid,
  LogOut,
  Moon,
  Network,
  ShieldCheck,
  Sun,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import CloudImage from '../assets/cloud.png'
import { useTheme } from '../hooks/useTheme'
import { routes } from '../routes/routes'

const moduleIcons: Record<string, LucideIcon> = {
  '/dashboard': LayoutGrid,
  '/planning': ClipboardList,
  '/costs': DollarSign,
  '/infrastructure': Globe,
  '/security': ShieldCheck,
  '/network': Network,
  '/services': Cloud,
}

function itemClasses(isActive: boolean, expanded: boolean) {
  const base =
    'flex items-center rounded-lg py-2.5 font-medium transition-all duration-200 hover:bg-brand-100 hover:text-brand-800 dark:hover:bg-brand-800 dark:hover:text-slate-100'
  const state = isActive
    ? 'bg-brand-700 text-white shadow-sm dark:bg-brand-800 dark:text-slate-100'
    : 'text-muted'
  const layout = expanded ? 'gap-3 px-4' : 'justify-center px-0'
  return `${base} ${state} ${layout}`
}

function labelClass(expanded: boolean) {
  return `overflow-hidden whitespace-nowrap transition-all duration-200 ${expanded ? 'opacity-100' : 'w-0 opacity-0'}`
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [expanded, setExpanded] = useState(true)
  const collapseTimer = useRef<number | null>(null)

  function handleMouseEnter() {
    if (collapseTimer.current !== null) {
      window.clearTimeout(collapseTimer.current)
      collapseTimer.current = null
    }
    setExpanded(true)
  }

  function handleMouseLeave() {
    collapseTimer.current = window.setTimeout(() => {
      setExpanded(false)
      collapseTimer.current = null
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (collapseTimer.current !== null) {
        window.clearTimeout(collapseTimer.current)
      }
    }
  }, [])

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`sticky top-0 flex h-screen flex-col overflow-hidden border-r border-subtle bg-surface px-4 py-6 transition-[width] duration-200 ${expanded ? 'w-56' : 'w-20'}`}
    >
      <div
        className={`flex flex-row items-center gap-2 text-2xl font-semibold text-foreground ${expanded ? 'px-2' : 'justify-center px-0'}`}
      >
        {expanded && <h1>CloudOpus</h1>}
        <img
          src={CloudImage}
          className="w-10 shrink-0 transition-[filter] duration-200 dark:brightness-0 dark:invert"
          alt="CloudOpus logo"
        />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {routes.map(({ path, name }) => {
          const Icon = moduleIcons[path] ?? Cloud
          return (
            <NavLink
              key={path}
              to={path}
              title={name}
              className={({ isActive }) => itemClasses(isActive, expanded)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={labelClass(expanded)}>{name}</span>
            </NavLink>
          )
        })}
      </nav>

      <button
        type="button"
        title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        onClick={toggle}
        className={`${itemClasses(false, expanded)} w-full`}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 shrink-0" />
        ) : (
          <Sun className="h-5 w-5 shrink-0" />
        )}
        <span className={labelClass(expanded)}>
          {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        </span>
      </button>
      <button
        type="button"
        title="Cerrar sesión"
        onClick={() => navigate('/')}
        className={`${itemClasses(false, expanded)} w-full`}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        <span className={labelClass(expanded)}>Cerrar sesión</span>
      </button>
    </aside>
  )
}
