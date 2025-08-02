import { House } from 'lucide-react'
import { useEffect } from 'react'
import { useRooms } from '../hooks/useRooms'
import { RoomCard } from './RoomCard'
import Loading from './Loading'

export const RoomsDashboard = () => {
    const { rooms, loading, error, fetchRooms } = useRooms()
    
    useEffect(() => {
        fetchRooms()
    }, [])

    const getManagersOnly = () => {
        return rooms.filter((room) => room.type === 'internal')
    }

    if (loading) return <Loading />
    if (error)
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <House size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error
                </h3>
                <p className="text-gray-500">Error al cargar del Dashboard</p>
            </div>
        )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getManagersOnly().map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>

                {getManagersOnly().length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <House size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay habitaciones internas
                        </h3>
                        <p className="text-gray-500">
                            Agrega al menos una habitacion interna para comenzar
                            a construir la jerarquía
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
