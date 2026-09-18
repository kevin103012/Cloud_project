import { useEffect, useRef, useState } from 'react'
import {
  ClipboardList,
  Cloud,
  DollarSign,
  Globe,
  LayoutGrid,
  LogOut,
  Network,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import CloudImage from '../assets/cloud.png'
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
    'flex items-center rounded-lg py-2.5 font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-black hover:text-white'
  const state = isActive ? 'bg-black text-white' : 'text-black'
  const layout = expanded ? 'gap-3 px-4' : 'justify-center px-0'
  return `${base} ${state} ${layout}`
}

function labelClass(expanded: boolean) {
  return `overflow-hidden whitespace-nowrap transition-all duration-200 ${expanded ? 'opacity-100' : 'w-0 opacity-0'}`
}

export default function Sidebar() {
  const navigate = useNavigate()
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
      className={`sticky top-0 flex h-screen flex-col overflow-hidden border-r border-black/10 bg-white px-4 py-6 transition-[width] duration-200 ${expanded ? 'w-56' : 'w-20'}`}
    >
      {/* Logo + nombre */}
      <div
        className={`flex flex-row items-center gap-2 text-2xl font-semibold ${expanded ? 'px-2' : 'justify-center px-0'}`}
      >
        {expanded && <h1>CloudOpus</h1>}
        <img src={CloudImage} className="w-10 shrink-0" alt="CloudOpus logo" />
      </div>

      {/* Módulos */}
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

      {/* Cerrar sesión */}
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
