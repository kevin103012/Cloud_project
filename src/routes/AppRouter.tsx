import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import Sidebar from '../components/Sidebar'
import { ProposalsProvider } from '../context/ProposalsContext'
import Contacto from '../pages/Contacto'
import Landing from '../pages/Landing'
import SobreNosotros from '../pages/SobreNosotros'
import { routes } from './routes'

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <main className="min-w-0 flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
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
      </Routes>
      </ProposalsProvider>
    </BrowserRouter>
  )
}
