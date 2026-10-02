import { useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import CloudImage from '../assets/cloud.png'
import Loader from '../components/Loader'
import { useTheme } from '../hooks/useTheme'

const linkClass =
  'rounded-md px-4 py-2 font-medium text-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-brand-700 hover:text-white'

const mobileLinkClass =
  'block w-full rounded-md px-4 py-2.5 text-left font-medium text-foreground transition-colors duration-200 hover:bg-brand-700 hover:text-white'

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  function handleStart() {
    if (loading) return
    setLoading(true)
    window.setTimeout(() => navigate('/dashboard'), 1500)
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-canvas font-poppins text-foreground transition-colors duration-200">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas">
          <Loader size={160} />
        </div>
      )}
      {/* Nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-subtle bg-surface">
        <div className="flex w-full flex-row items-center justify-between gap-2 px-4 py-3 sm:px-6 md:px-10">
          <a href="#inicio" className="flex min-w-0 flex-row items-center gap-2 text-xl font-semibold hover:cursor-pointer sm:text-2xl">
            <h1 className="truncate">CloudOpus</h1>
            <img src={CloudImage} className="w-8 shrink-0 sm:w-10 dark:brightness-0 dark:invert" alt="CloudOpus logo" />
          </a>
          {/* Links de escritorio */}
          <div className="hidden flex-row items-center gap-1 md:flex md:gap-2">
            <a href="/" className={linkClass}>
              Inicio
            </a>
            <a href="/sobre-nosotros" className={linkClass}>
              Sobre nosotros
            </a>
            <a href="/contacto" className={linkClass}>
              Contacto
            </a>
            <button
              type="button"
              onClick={toggle}
              title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-subtle bg-surface text-foreground transition-colors duration-200 hover:bg-surface-muted"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Sun className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {/* Controles móviles */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggle}
              title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-subtle bg-surface text-foreground transition-colors duration-200 hover:bg-surface-muted"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Sun className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-subtle bg-surface text-foreground transition-colors duration-200 hover:bg-surface-muted"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {/* Panel móvil desplegable */}
        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-subtle bg-surface px-4 py-3 md:hidden">
            <a href="/" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
              Inicio
            </a>
            <a href="/sobre-nosotros" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
              Sobre nosotros
            </a>
            <a href="/contacto" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
              Contacto
            </a>
          </div>
        )}
      </nav>

      {/* Contenido principal */}
      <main>
        <section
          id="inicio"
          className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 py-12 text-center sm:px-6"
        >
          <h2 className="text-4xl font-bold break-words sm:text-5xl">CloudOpus</h2>
          <p className="max-w-2xl text-base text-muted sm:text-lg">
            La plataforma para visualizar y gestionar tu infraestructura en la
            nube: costos, servicios, seguridad y regiones en un solo lugar.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="w-full rounded-lg bg-brand-700 px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:bg-brand-800 sm:w-auto"
          >
            Iniciar
          </button>
        </section>

      </main>
    </div>
  )
}
