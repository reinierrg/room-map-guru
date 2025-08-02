import {
    ChevronDown,
    ChevronRight,
    Trash2,
    UserPlus,
} from 'lucide-react'
import type { IRoom } from '../types/types'
import { SubordinateSelector } from './SubordinateSelector'
import { useMemo } from 'react'
import { useRooms } from '../hooks/useRooms'

export const SubordinateItem = ({
    room,
    supervisorId,
    level,
    expandedPeople,
    toggleExpanded,
    showSelector,
    toggleSubordinateSelector,
    removeRelation,
    getTypeById,
    relations,
    availableSubordinates,
    addSubordinate,
    subordinateSearchTerm,
    setSubordinateSearchTerm
}: {
    room: IRoom
    supervisorId: number
    level: number
    expandedPeople: Record<number, boolean>
    toggleExpanded: (id: number) => void
    showSelector: boolean
    toggleSubordinateSelector: (id: number) => void
    removeRelation: (sup: number, sub: number) => void
    getTypeById: (id: string) => any
    relations: Record<number, number[]>
    availableSubordinates: IRoom[]
    addSubordinate: (sup: number, sub: number) => void
    subordinateSearchTerm: string
    setSubordinateSearchTerm: (v: string) => void
}) => {
  const { rooms } = useRooms()
    const subordinates = relations[room.id] || []
    const isExpanded = expandedPeople[room.id]
    const roomType = getTypeById(room.type)
    
    const roomsMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms])
    const getRoomById = (id: number) => roomsMap.get(id)


    return (
        <div style={{ marginLeft: `${level * 16}px` }} className="border-l-2 border-gray-200 pl-4 py-2">
            <div className="flex items-center gap-2 group">
                {subordinates.length > 0 && (
                    <button onClick={() => toggleExpanded(room.id)} className="p-1 hover:bg-gray-100 rounded">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                )}
                <div className={`w-4 h-4 rounded-full ${roomType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}>
                    {roomType?.icon || '👤'}
                </div>
                <div className="flex-1">
                    <div className="font-medium text-gray-900">{room.name}</div>
                    <div className="text-sm text-gray-500">{room.position}</div>
                </div>
                <button onClick={() => toggleSubordinateSelector(room.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-100 rounded text-green-500">
                    <UserPlus size={16} />
                </button>
                <button onClick={() => removeRelation(supervisorId, room.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500">
                    <Trash2 size={16} />
                </button>
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
                <div className="mt-2">
                    {subordinates.map((subordinateId) => (
                        <SubordinateItem
                            key={subordinateId}
                            room={getRoomById(subordinateId)}
                            supervisorId={room.id}
                            level={level + 1}
                            expandedPeople={expandedPeople}
                            toggleExpanded={toggleExpanded}
                            showSelector={showSelector}
                            toggleSubordinateSelector={toggleSubordinateSelector}
                            removeRelation={removeRelation}
                            getTypeById={getTypeById}
                            relations={relations}
                            availableSubordinates={availableSubordinates}
                            addSubordinate={addSubordinate}
                            subordinateSearchTerm={subordinateSearchTerm}
                            setSubordinateSearchTerm={setSubordinateSearchTerm}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}