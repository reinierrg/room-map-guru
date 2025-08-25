import {
    ChevronDown,
    ChevronRight,
    HousePlus,
    House,
    X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useRelations } from '../hooks/useRelations'
import { useRooms } from '../hooks/useRooms'
import { SubordinateSelector } from './SubordinateSelector'
import { SubordinateItem } from './SubordinateItem'
import type { IRoom } from '../services/room/room.types'

export const RoomCard = ({ room }: { room: IRoom }) => {
    const { rooms, setRooms } = useRooms()
    const { relations, setRelations, addRelation, removeRelation } = useRelations()

    const [expandedPeople, setExpandedPeople] = useState<Record<number, boolean>>({})
    const [showSubordinateSelector, setShowSubordinateSelector] = useState<Record<number, boolean>>({})
    const [subordinateSearchTerm, setSubordinateSearchTerm] = useState('')

    const roomTypes = useMemo(() => [
        { id: 'Interno', name: 'Interno', color: 'bg-blue-500', icon: '👔' },
        { id: 'Expedia', name: 'Expedia', color: 'bg-green-500', icon: '💻' },
        { id: 'HB', name: 'Hotelbeds', color: 'bg-purple-500', icon: '🎨' },
        { id: 'HS', name: 'HotelUnico', color: 'bg-orange-500', icon: '📊' },
    ], [])

    const roomsMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms])
    const getRoomById = (id: any) => roomsMap.get(id)
    const getTypeById = (id: string) => roomTypes.find((type) => type.id === id)

    const toggleExpanded = (id: number) => {
        setExpandedPeople(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const toggleSubordinateSelector = (id: number) => {
        setShowSubordinateSelector(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const isRoomDescendant = (roomId: number, potentialSupervisorId: number): boolean => {
        const subs = relations[roomId] || []
        if (subs.includes(potentialSupervisorId)) return true
        return subs.some((subId) => isRoomDescendant(subId, potentialSupervisorId))
    }

    const getAvailableSubordinates = (supervisorId: number): Partial<IRoom>[] => {
        const supervisor = getRoomById(supervisorId)
        const currentSubs = relations[supervisorId] || []
        return rooms.filter((r: any) =>
            r.id !== supervisorId &&
            !currentSubs.includes(r.id) &&
            !isRoomDescendant(r.id, supervisorId) &&
            r.name.toLowerCase().includes(subordinateSearchTerm.toLowerCase()) &&
            (supervisor?.type !== 'Interno' || r.type !== 'Interno')
        )
    }

    const addSubordinate = (supId: number, subId: number) => {
        addRelation(supId, subId)
        setShowSubordinateSelector(prev => ({ ...prev, [supId]: false }))
        setSubordinateSearchTerm('')
    }

    const deleteRoom = (roomId: number) => {
        const hasSubordinates = (relations[roomId] || []).length > 0
        if (hasSubordinates) {
            alert('No se puede eliminar una habitación con hijas.')
            return
        }

        const updatedRooms = rooms.filter((r) => r.id !== roomId)
        const newRelations = { ...relations }
        delete newRelations[roomId]
        Object.keys(newRelations).forEach((supId) => {
            newRelations[Number(supId)] = newRelations[Number(supId)].filter((id) => id !== roomId)
        })

        setRooms(updatedRooms)
        setRelations(newRelations)
    }

    const isManager = room.type === 'Interno'
    const subordinates = relations[room.id] || []
    const isExpanded = expandedPeople[room.id]
    const showSelector = showSubordinateSelector[room.id]
    const roomType = getTypeById(room.type)
    const availableSubordinates = getAvailableSubordinates(room.id)

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {subordinates.length > 0 && (
                            <button onClick={() => toggleExpanded(room.id)} className="p-1 hover:bg-gray-100 rounded">
                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                        )}
                        <div className={`w-8 h-8 rounded-full ${roomType?.color || 'bg-gray-400'} flex items-center justify-center text-white`}>
                            {roomType?.icon || '👤'}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{room.name}</h3>
                            <p className="text-sm text-gray-500">{room.position}</p>
                            {isManager && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                    Habitacion Base
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {subordinates.length > 0 && (
                            <span className="text-sm text-gray-500 flex items-center gap-1 ms-0.5">
                                <House size={18} /> {subordinates.length}
                            </span>
                        )}
                        <button onClick={() => toggleSubordinateSelector(room.id)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-500">
                            <HousePlus size={18} />
                        </button>
                        {!isManager && (
                            <button onClick={() => deleteRoom(room.id)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showSelector && (
                <SubordinateSelector
                    availableSubordinates={availableSubordinates}
                    onSelect={(id) => addSubordinate(room.id, id)}
                    onSearchChange={setSubordinateSearchTerm}
                    searchValue={subordinateSearchTerm}
                    getTypeById={getTypeById}
                />
            )}

            {isExpanded && subordinates.length > 0 && (
                <div className="p-4">
                    {subordinates.map((subordinateId) => {
                        const subordinate = getRoomById(subordinateId)
                        return subordinate ? (
                            <SubordinateItem
                                key={subordinateId}
                                room={subordinate}
                                supervisorId={room.id}
                                level={0}
                                expandedPeople={expandedPeople}
                                toggleExpanded={toggleExpanded}
                                removeRelation={removeRelation}
                                getTypeById={getTypeById}
                                relations={relations}
                              
                            />
                        ) : null
                    })}
                </div>
            )}
        </div>
    )
}