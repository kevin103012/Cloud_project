import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router'
import CloudImage from '../assets/cloud.png'
import Loader from '../components/Loader'
import { useTheme } from '../hooks/useTheme'

const linkClass =
  'rounded-md px-4 py-2 font-medium text-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-brand-700 hover:text-white'

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [loading, setLoading] = useState(false)

  function handleStart() {
    if (loading) return
    setLoading(true)
    window.setTimeout(() => navigate('/dashboard'), 1500)
  }

  return (
    <div className="min-h-screen bg-canvas font-poppins text-foreground transition-colors duration-200">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas">
          <Loader size={160} />
        </div>
      )}
      {/* Nav */}
      <nav className="sticky top-0 flex w-full flex-row items-center justify-between border-b border-subtle bg-surface px-6 py-3 md:px-10">
        <a href="#inicio" className="flex flex-row items-center gap-2 text-2xl font-semibold hover:cursor-pointer">
          <h1>CloudOpus</h1>
          <img src={CloudImage} className="w-10 dark:brightness-0 dark:invert" alt="CloudOpus logo" />
        </a>
        <div className="flex flex-row items-center gap-1 md:gap-2">
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
      </nav>

      {/* Contenido principal */}
      <main>
        <section
          id="inicio"
          className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center"
        >
          <h2 className="text-5xl font-bold">CloudOpus</h2>
          <p className="max-w-2xl text-lg text-muted">
            La plataforma para visualizar y gestionar tu infraestructura en la
            nube: costos, servicios, seguridad y regiones en un solo lugar.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="rounded-lg bg-brand-700 px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:bg-brand-800"
          >
            Iniciar
          </button>
        </section>

      </main>
    </div>
  )
}
