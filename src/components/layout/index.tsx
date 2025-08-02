import { useState } from 'react'
import { Link, Outlet } from 'react-router'
import { Home, Map, FileText } from 'lucide-react'

export default function Layout() {
    const [rightOpen, setRightOpen] = useState(false)

    const navItems = [
        { label: 'Home', path: '/', icon: <Home size={18} /> },
        { label: 'Reglas', path: '/reglas', icon: <FileText size={18} /> },
    ]

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="h-16 bg-slate-800 text-white flex items-center px-4 shrink-0">
                <span className="font-bold">Mapeo de Habitaciones</span>
                <div className="ml-auto space-x-2">
                    {/*<button
                        onClick={() => setRightOpen(!rightOpen)}
                        className="bg-teal-600 px-3 py-1 rounded"
                    >
                        {rightOpen ? 'Ocultar' : 'Mostrar'} Der
                    </button>*/}
                </div>
            </header>

            {/* Cuerpo principal */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar izquierda */}
                <aside className="bg-slate-50 w-56 shrink-0 h-screen border-r border-slate-200 flex flex-col">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-slate-800 mb-6">
                            Menú
                        </h2>
                        <nav>
                            <ul className="space-y-1">
                                {navItems.map(({ label, path, icon }) => {
                                    const isActive = location.pathname === path
                                    console.log(location.pathname, path, isActive)
                                    return (
                                        <li key={path}>
                                            <Link
                                                to={path}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                          isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                                            >
                                                {icon}
                                                {label}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* Contenido */}
                <main className="flex-1 bg-white overflow-y-auto">
                    <Outlet />
                </main>

                {/* Sidebar derecha */}
                <aside
                    className={`bg-slate-100 transition-all duration-300 shrink-0
                ${rightOpen ? 'w-64' : 'w-0'} overflow-hidden`}
                >
                    <div className="p-4">
                        <h2 className="font-bold mb-2">Widgets</h2>
                        <ul>
                            <li>Notificaciones</li>
                            <li>Chat</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    )
}
