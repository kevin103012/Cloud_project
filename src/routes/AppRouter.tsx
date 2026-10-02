import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import { Suspense } from 'react'
import Loader from '../components/Loader'
import Sidebar from '../components/Sidebar'
import { ProposalsProvider } from '../context/ProposalsContext'
import { ThemeProvider } from '../context/ThemeContext'
import Contacto from '../pages/Contacto'
import Landing from '../pages/Landing'
import NotFound from '../pages/NotFound'
import SobreNosotros from '../pages/SobreNosotros'
import { routes } from './routes'

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-canvas text-foreground transition-colors duration-200 lg:flex-row">
      <Sidebar />
      <main className="mx-auto min-w-0 w-full max-w-7xl flex-1 overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6">
        <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Loader size={80} /></div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <ProposalsProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route element={<AppLayout />}>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ProposalsProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
