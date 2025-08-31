import type { RoomType, IRoom } from '../services/room/room.types'
import { Bed, Binoculars, House, ShieldQuestionMark } from 'lucide-react'
import { useAgents } from '../hooks/useAgents'
import { useRelations } from '../hooks/useRelations'

export const RoomsByType = ({
    rooms,
    type,
}: {
    rooms: IRoom[]
    type: RoomType
}) => {
    const filteredRooms = rooms.filter((room) => room.type === type)
    const { getAgentById } = useAgents()
    const agent = getAgentById(type)
    const { relations } = useRelations()

    // Función para verificar si un room está relacionado
    const isRoomRelated = (roomId: number): boolean => {
        // Un room está relacionado si aparece como clave en relations O si aparece en algún array de valores
        if (
            typeof roomId === 'number' &&
            relations[roomId] &&
            relations[roomId].length > 0
        ) {
            return true
        }

        // Verificar si el roomId aparece en los valores de otras relaciones
        return Object.values(relations).some((relatedIds) =>
            relatedIds.includes(roomId)
        )
    }

    return (
        <div>
            {/* Estadísticas rápidas */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                    Relacionados:{' '}
                    {
                        filteredRooms.filter(
                            (room) => room.id && isRoomRelated(room.id)
                        ).length
                    }{' '}
                    / {filteredRooms.length}
                </p>
            </div>
            {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map((room) => {
                        const related = room.id ? isRoomRelated(room.id) : false

                        return (
                            <div
                                key={room.id}
                                className={`rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                                    related
                                        ? 'bg-blue-50 border-blue-200 transform hover:scale-105'
                                        : 'bg-white border-gray-200'
                                } `}
                            >
                                <div className="p-4 border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-16 h-16 rounded-full flex items-center justify-center text-white`}
                                            >
                                                <img
                                                    src={agent?.icon}
                                                    width={16}
                                                    height={16}
                                                />
                                            </div>
                                            <h4 className="font-medium text-gray-800">
                                                {room.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                ID: {room.id}
                                            </p>
                                            <div className="mt-2 text-xs">
                                                {room.occupancy && (
                                                    <p>
                                                        <ShieldQuestionMark
                                                            size={18}
                                                        />
                                                        : {room.occupancy}
                                                    </p>
                                                )}
                                                {room.bed && (
                                                    <p>
                                                        <Bed size={18} /> :{' '}
                                                        {room.bed}
                                                    </p>
                                                )}
                                                {room.view && (
                                                    <p>
                                                        <Binoculars size={18} />
                                                        : {room.view}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <House size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay rooms de tipo {type}
                    </h3>
                </div>
            )}
        </div>
    )
}
