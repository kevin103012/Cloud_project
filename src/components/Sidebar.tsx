import { useEffect, useRef, useState } from 'react'
import {
  ClipboardList,
  Cloud,
  DollarSign,
  Globe,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Network,
  ShieldCheck,
  Sun,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false)
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

  function closeMobile() {
    setMobileOpen(false)
  }

  useEffect(() => {
    return () => {
      if (collapseTimer.current !== null) {
        window.clearTimeout(collapseTimer.current)
      }
    }
  }, [])

  // Bloquea el scroll del fondo mientras el drawer móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Cierra el drawer con Escape.
  useEffect(() => {
    if (!mobileOpen) return
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mobileOpen])

  const navItems = (
    <>
      {routes.map(({ path, name }) => {
        const Icon = moduleIcons[path] ?? Cloud
        return (
          <NavLink
            key={path}
            to={path}
            title={name}
            onClick={closeMobile}
            className={({ isActive }) => itemClasses(isActive, true)}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="overflow-hidden whitespace-nowrap">{name}</span>
          </NavLink>
        )
      })}
    </>
  )

  const footerButtons = (onNavigate: () => void) => (
    <>
      <button
        type="button"
        title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        onClick={toggle}
        className={`${itemClasses(false, true)} w-full`}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 shrink-0" />
        ) : (
          <Sun className="h-5 w-5 shrink-0" />
        )}
        <span className="overflow-hidden whitespace-nowrap">
          {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        </span>
      </button>
      <button
        type="button"
        title="Cerrar sesión"
        onClick={() => {
          onNavigate()
          navigate('/')
        }}
        className={`${itemClasses(false, true)} w-full`}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        <span className="overflow-hidden whitespace-nowrap">Cerrar sesión</span>
      </button>
    </>
  )

  return (
    <>
      {/* Barra superior solo visible en móvil */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-subtle bg-surface px-4 py-3 lg:hidden">
        <div className="flex min-w-0 items-center gap-2 text-xl font-semibold text-foreground">
          <img
            src={CloudImage}
            className="w-8 shrink-0 transition-[filter] duration-200 dark:brightness-0 dark:invert"
            alt="CloudOpus logo"
          />
          <span className="truncate">CloudOpus</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú de navegación"
          aria-expanded={mobileOpen}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-subtle bg-surface text-foreground transition hover:bg-surface-muted"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {/* Overlay + drawer móvil */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={closeMobile}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navegación principal"
          className={`absolute top-0 left-0 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-subtle bg-surface px-4 py-6 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between gap-2 px-2 text-2xl font-semibold text-foreground">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate">CloudOpus</span>
              <img
                src={CloudImage}
                className="w-10 shrink-0 transition-[filter] duration-200 dark:brightness-0 dark:invert"
                alt="CloudOpus logo"
              />
            </div>
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Cerrar menú de navegación"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-subtle text-foreground transition hover:bg-surface-muted"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1">{navItems}</nav>

          <div className="mt-4 flex flex-col gap-1">{footerButtons(closeMobile)}</div>
        </aside>
      </div>

      {/* Sidebar de escritorio */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-subtle bg-surface px-4 py-6 transition-[width] duration-200 lg:flex ${expanded ? 'w-56' : 'w-20'}`}
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
    </>
  )
}
