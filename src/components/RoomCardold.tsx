import {
    ChevronDown,
    ChevronRight,
    Search,
    Trash2,
    UserPlus,
    Users,
    X,
} from 'lucide-react'
import { useState } from 'react'

import { useRelations } from '../hooks/useRelations'
import { useRooms } from '../hooks/useRooms'
import type { IRoom } from '../types/types'

export const RoomCard = ({ room }: { room: IRoom }) => {
    const {
        rooms,
        loading: roomLoading,
        error: roomError,
        setRooms
    } = useRooms()

    const {
        relations,
        loading: relationsLoading,
        error: relationsError,
        setRelations,
        addRelation,
        removeRelation,
    } = useRelations()

    const [expandedPeople, setExpandedPeople] = useState({})
    const [showSubordinateSelector, setShowSubordinateSelector] = useState({})
    const [subordinateSearchTerm, setSubordinateSearchTerm] = useState('')

    const [roomTypes] = useState([
        { id: 'internal', name: 'Internal', color: 'bg-blue-500', icon: '👔' },
        { id: 'expedia', name: 'Expedia', color: 'bg-green-500', icon: '💻' },
        {
            id: 'hotelbeds',
            name: 'Hotelbeds',
            color: 'bg-purple-500',
            icon: '🎨',
        },
        {
            id: 'hotelunico',
            name: 'HotelUnico',
            color: 'bg-orange-500',
            icon: '📊',
        },
    ])

    const getRoomById = (id: number) =>
        rooms.find((room: any) => room.id === id)
    const getTypeById = (id: string) =>
        roomTypes.find((type: any) => type.id === id)

    // Función para evitar referencias circulares
    const isRoomDescendant = (
        roomId: number,
        potentialSupervisorId: number
    ): boolean => {
        const subordinates = relations[roomId] || []
        if (subordinates.includes(potentialSupervisorId)) return true
        return subordinates.some((subordinateId: number) =>
            isRoomDescendant(subordinateId, potentialSupervisorId)
        )
    }

    const getAvailableSubordinates = (supervisorId: number) => {
        const supervisor = getRoomById(supervisorId)
        const currentSubordinates = relations[supervisorId] || []

        return rooms.filter((room) => {
            // No puede ser subordinado de sí mismo
            if (room.id === supervisorId) return false

            // No está ya como subordinado
            if (currentSubordinates.includes(room.id)) return false

            // Evitar ciclos
            if (isRoomDescendant(room.id, supervisorId)) return false

            // Filtro por búsqueda
            if (
                !room.name
                    .toLowerCase()
                    .includes(subordinateSearchTerm.toLowerCase())
            )
                return false

            // Reglas de jerarquía
            if (supervisor && supervisor.type === 'internal') {
                // Los gerentes pueden tener subordinados de cualquier tipo excepto gerentes
                return room.type !== 'internal'
            } else {
                // Los no gerentes pueden tener subordinados de cualquier tipo
                return true
            }
        })
    }

    const subordinates: number[] = relations[room.id] || []
    const isExpanded = expandedPeople[room.id]
    const showSelector = showSubordinateSelector[room.id]
    const roomType = getTypeById(room.type)
    const availableSubordinates = getAvailableSubordinates(room.id)
    const isManager = room.type === 'internal'

    const toggleExpanded = (roomId: number) => {
        setExpandedPeople((prev) => ({
            ...prev,
            [roomId]: !prev[roomId],
        }))
    }

    const toggleSubordinateSelector = (roomId: number) => {
        setShowSubordinateSelector((prev) => ({
            ...prev,
            [roomId]: !prev[roomId],
        }))
    }

    const addSubordinate = (supervisorId: number, subordinateId: number) => {
        addRelation(supervisorId, subordinateId)

        setShowSubordinateSelector((prev) => ({
            ...prev,
            [supervisorId]: false,
        }))
        setSubordinateSearchTerm('')
    }

    const deleteRoom = (roomId: number) => {
        const room = rooms.find((p) => p.id === roomId)

        // No permitir eliminar gerentes base
        if (room && room.type === 'internal') {
            const hasSubordinates =
                relations[roomId] && relations[roomId].length > 0
            if (hasSubordinates) {
                alert(
                    'No se puede eliminar una habitacion interna que tiene habitaciones hijas. Primero elimine las relaciones.'
                )
                return
            }
        }

        // No permitir eliminar si la rooma tiene subordinados
        const hasSubordinates =
            relations[roomId] && relations[roomId].length > 0
        if (hasSubordinates) {
            alert(
                'No se puede eliminar una habitacion interna que tiene habitaciones hijas. Primero elimine las relaciones.'
            )
            return
        }

        setRooms(rooms.filter((room) => room.id !== roomId))
        // Eliminar relaciones donde esta rooma es supervisor
        const newRelations = { ...relations }
        delete newRelations[roomId]
        // Eliminar esta rooma de los subordinados de otros
        Object.keys(newRelations).forEach((supervisorId) => {
            newRelations[supervisorId] = newRelations[supervisorId].filter(
                (id: number) => id !== roomId
            )
        })

        setRelations(newRelations)
    }

    const SubordinateItem = ({ room, supervisorId, level = 0 }: { room: IRoom, supervisorId: number, level: number }) => {
        const subordinates = relations[room.id] || []
        const isExpanded = expandedPeople[room.id]
        const roomType = getTypeById(room.type)
        const showSelector = showSubordinateSelector[room.id]
        const availableSubordinates = getAvailableSubordinates(room.id)

        return (
            <div
                className={`ml-${level * 4} border-l-2 border-gray-200 pl-4 py-2`}
            >
                <div className="flex items-center gap-2 group">
                    {subordinates.length > 0 && (
                        <button
                            onClick={() => toggleExpanded(room.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            {isExpanded ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>
                    )}

                    <div
                        className={`w-4 h-4 rounded-full ${roomType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}
                    >
                        {roomType?.icon || '👤'}
                    </div>

                    <div className="flex-1">
                        <div className="font-medium text-gray-900">
                            {room.name}
                        </div>
                        <div className="text-sm text-gray-500">
                            {room.position}
                        </div>
                    </div>

                    <button
                        onClick={() => toggleSubordinateSelector(room.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-100 rounded text-green-500 transition-opacity"
                        title="Agregar habitacion hija"
                    >
                        <UserPlus size={16} />
                    </button>

                    <button
                        onClick={() =>
                            removeRelation(supervisorId, room.id)
                        }
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-opacity"
                        title="Eliminar relación"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Selector de subordinados para elemento hijo */}
                {showSelector && (
                    <div className="mt-2 p-3 bg-gray-50 border rounded">
                        <div className="mb-2">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={14}
                                />
                                <input
                                    type="text"
                                    value={subordinateSearchTerm}
                                    onChange={(e) =>
                                        setSubordinateSearchTerm(e.target.value)
                                    }
                                    placeholder="Buscar habitaciones hijas..."
                                    className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="max-h-24 overflow-y-auto">
                            {availableSubordinates.length > 0 ? (
                                availableSubordinates.map((subordinate: IRoom) => {
                                    const subType = getTypeById(
                                        subordinate.type
                                    )
                                    return (
                                        <button
                                            key={subordinate.id}
                                            onClick={() =>
                                                addSubordinate(
                                                    room.id,
                                                    subordinate.id
                                                )
                                            }
                                            className="w-full px-2 py-1 text-left hover:bg-white rounded text-xs flex items-center gap-2"
                                        >
                                            <div
                                                className={`w-3 h-3 rounded-full ${subType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}
                                            >
                                                {subType?.icon || '👤'}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {subordinate.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {subordinate.position}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="text-center py-2 text-gray-500 text-xs">
                                    No hay habitaciones disponibles
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isExpanded && subordinates.length > 0 && (
                    <div className="mt-2">
                        {subordinates.map((subordinateId) => {
                            const subordinate = getRoomById(subordinateId)
                            return subordinate ? (
                                <SubordinateItem
                                    key={subordinateId}
                                    room={subordinate}
                                    supervisorId={room.id}
                                    level={level + 1}
                                />
                            ) : null
                        })}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            {
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {subordinates.length > 0 && (
                                <button
                                    onClick={() => toggleExpanded(room.id)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    {isExpanded ? (
                                        <ChevronDown size={18} />
                                    ) : (
                                        <ChevronRight size={18} />
                                    )}
                                </button>
                            )}

                            <div
                                className={`w-8 h-8 rounded-full ${roomType?.color || 'bg-gray-400'} flex items-center justify-center text-white`}
                            >
                                {roomType?.icon || '👤'}
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {room.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {room.position}
                                </p>
                                {isManager && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                        Habitacion Base
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {subordinates.length > 0 && (
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Users size={14} />
                                    {subordinates.length}
                                </span>
                            )}
                            <button
                                onClick={() =>
                                    toggleSubordinateSelector(room.id)
                                }
                                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-500"
                                title="Agregar habitacion"
                            >
                                <UserPlus size={18} />
                            </button>
                            {!isManager && (
                                <button
                                    onClick={() => deleteRoom(room.id)}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500"
                                    title="Eliminar habitacion"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            }

            {/* Selector de subordinados */}
            {showSelector && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="mb-3">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                value={subordinateSearchTerm}
                                onChange={(e) =>
                                    setSubordinateSearchTerm(e.target.value)
                                }
                                placeholder="Buscar habitacion para relacionarla..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="max-h-32 overflow-y-auto">
                        {availableSubordinates.length > 0 ? (
                            availableSubordinates.map((subordinate) => {
                                const subType = getTypeById(subordinate.type)
                                return (
                                    <button
                                        key={subordinate.id}
                                        onClick={() =>
                                            addSubordinate(
                                                room.id,
                                                subordinate.id
                                            )
                                        }
                                        className="w-full px-3 py-2 text-left hover:bg-white rounded text-sm flex items-center gap-2"
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full ${subType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}
                                        >
                                            {subType?.icon || '👤'}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {subordinate.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {subordinate.position}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                {subordinateSearchTerm
                                    ? 'No se encontraron habitaciones'
                                    : 'No hay habitaciones disponibles'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Subordinados */}
            {isExpanded && subordinates.length > 0 && (
                <div className="p-4">
                    {subordinates.map((subordinateId: number) => {
                        const subordinate = getRoomById(subordinateId)
                        return subordinate ? (
                            <SubordinateItem
                                key={subordinateId}
                                room={subordinate}
                                supervisorId={room.id}
                                level={0}
                            />
                        ) : null
                    })}
                </div>
            )}
        </div>
    )
}
