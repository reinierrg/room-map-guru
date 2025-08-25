import {
    ChevronDown,
    ChevronRight,
    Trash2,
} from 'lucide-react'
import type { IRoom } from '../services/room/room.types'

export const SubordinateItem = ({
    room,
    supervisorId,
    level,
    expandedPeople,
    toggleExpanded,
    removeRelation,
    getTypeById,
    relations,
}: {
    room: IRoom
    supervisorId: number
    level: number
    expandedPeople: Record<number, boolean>
    toggleExpanded: (id: number) => void
    removeRelation: (sup: number, sub: number) => void
    getTypeById: (id: string) => any
    relations: Record<number, number[]>
}) => {
    const subordinates = relations[room.id] || []
    const isExpanded = expandedPeople[room.id]
    const roomType = getTypeById(room.type)

    return (
        <div style={{ marginLeft: `${level * 16}px` }} className="border-l-2 border-gray-200 pl-4 py-2">
            <div className="flex items-center gap-2 group">
                {subordinates.length > 0 && (
                    <button onClick={() => toggleExpanded(room.id)} className="p-1 hover:bg-gray-100 rounded">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                )}
                <div className={`w-8 h-8 rounded-full ${roomType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}>
                    <img src={roomType?.icon} width={16} height={16}/>
                </div>
                <div className="flex-1">
                    <div className="font-medium text-gray-900">{room.name}</div>
                    <div className="text-sm text-gray-500">{room.position}</div>
                </div>
               
                <button onClick={() => removeRelation(supervisorId, room.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500">
                    <Trash2 size={16} />
                </button>
            </div>

        </div>
    )
}