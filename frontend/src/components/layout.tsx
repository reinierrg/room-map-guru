import { Outlet } from 'react-router'

export default function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 bg-white overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
