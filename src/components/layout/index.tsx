import { Outlet } from 'react-router'

export default function Layout() {
    
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            {/* 
            <header className="h-16 bg-slate-800 text-white flex items-center px-4 shrink-0">
                <span className="font-bold">Mapeo de Habitaciones</span>
            </header>
            */}

            {/* Cuerpo principal */}
            <div className="flex flex-1 overflow-hidden">
                {/* Contenido */}
                <main className="flex-1 bg-white overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
