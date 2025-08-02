import {
    ChevronDown,
    ChevronRight,
    Search,
    UserPlus,
    Users,
    X,
} from 'lucide-react'
import { useState } from 'react'
import type { IRoom } from '../stores/roomsStore'

import { useRelations } from '../hooks/useRoomsRelations'
import { useRooms } from '../hooks/useRooms'

export const RoomCard = ({ room }: {room: IRoom}) => {
    const { relations, loading, error, addRelation, removeRelation, deleteRelation} = useRelations()
    const { rooms, loading: roomLoading, error: roomError, fetchRooms } = useRooms()
    const [expandedPeople, setExpandedPeople] = useState({})
    const [showSubordinateSelector, setShowSubordinateSelector] = useState({})
    const [subordinateSearchTerm, setSubordinateSearchTerm] = useState('')

      const [personTypes] = useState([
        { id: 'internal', name: 'Internal', color: 'bg-blue-500', icon: '👔' },
        { id: 'expedia', name: 'Expedia', color: 'bg-green-500', icon: '💻' },
        { id: 'hotelbeds', name: 'Hotelbeds', color: 'bg-purple-500', icon: '🎨' },
        { id: 'hotelunico', name: 'HotelUnico', color: 'bg-orange-500', icon: '📊' }
      ]);

      
    const getPersonById = (id: number) => rooms.find((person: any) => person.id === id)
    const getTypeById = (id: number) => personTypes.find((type: any) => type.id === id)

    
  const getAvailableSubordinates = (supervisorId: number) => {
    const supervisor = getPersonById(supervisorId);
    const currentSubordinates = relations[supervisorId] || [];
    
    return rooms.filter(person => {
      // No puede ser subordinado de sí mismo
      if (person.id === supervisorId) return false;
      
      // No está ya como subordinado
      if (currentSubordinates.includes(person.id)) return false;
      
      // Evitar ciclos
      if (isPersonDescendant(person.id, supervisorId)) return false;
      
      // Filtro por búsqueda
      if (!person.name.toLowerCase().includes(subordinateSearchTerm.toLowerCase())) return false;
      
      // Reglas de jerarquía
      if (supervisor && supervisor.type === 'internal') {
        // Los gerentes pueden tener subordinados de cualquier tipo excepto gerentes
        return person.type !== 'internal';
      } else {
        // Los no gerentes pueden tener subordinados de cualquier tipo
        return true;
      }
    });
  };


  // Función para evitar referencias circulares
  const isPersonDescendant = (personId: number, potentialSupervisorId: number) => {
    const subordinates = relations[personId] || [];
    if (subordinates.includes(potentialSupervisorId)) return true;
    return subordinates.some((subordinateId: number) => isPersonDescendant(subordinateId, potentialSupervisorId));
  };


    const subordinates = relations[room.id] || []
    const isExpanded = expandedPeople[room.id]
    const showSelector = showSubordinateSelector[room.id]
    const personType = getTypeById(room.type)
    const availableSubordinates = getAvailableSubordinates(room.id)
    const isManager = room.type === 'internal'

    const toggleExpanded = (personId: number) => {
        setExpandedPeople((prev) => ({
            ...prev,
            [personId]: !prev[personId],
        }))
    }

    const toggleSubordinateSelector = (personId) => {
        setShowSubordinateSelector((prev) => ({
            ...prev,
            [personId]: !prev[personId],
        }))
    }

    const addSubordinate = (supervisorId, subordinateId) => {
        setPersonRelations((prev) => ({
            ...prev,
            [supervisorId]: [...(prev[supervisorId] || []), subordinateId],
        }))
        setShowSubordinateSelector((prev) => ({
            ...prev,
            [supervisorId]: false,
        }))
        setSubordinateSearchTerm('')
    }

    const deletePerson = (personId) => {
        const person = people.find((p) => p.id === personId)

        // No permitir eliminar gerentes base
        if (person && person.type === 'internal') {
            const hasSubordinates =
                relations[personId] &&
                relations[personId].length > 0
            if (hasSubordinates) {
                alert(
                    'No se puede eliminar una habitacion interna que tiene habitaciones hijas. Primero elimine las relaciones.'
                )
                return
            }
        }

        // No permitir eliminar si la persona tiene subordinados
        const hasSubordinates =
            relations[personId] && relations[personId].length > 0
        if (hasSubordinates) {
            alert(
                'No se puede eliminar una habitacion interna que tiene habitaciones hijas. Primero elimine las relaciones.'
            )
            return
        }

        setPeople(people.filter((person) => person.id !== personId))
        // Eliminar relaciones donde esta persona es supervisor
        const newRelations = { ...personRelations }
        delete newRelations[personId]
        // Eliminar esta persona de los subordinados de otros
        Object.keys(newRelations).forEach((supervisorId) => {
            newRelations[supervisorId] = newRelations[supervisorId].filter(
                (id) => id !== personId
            )
        })
        setPersonRelations(newRelations)
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
           { <div className="p-4 border-b border-gray-100">
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
                            className={`w-8 h-8 rounded-full ${personType?.color || 'bg-gray-400'} flex items-center justify-center text-white`}
                        >
                            {personType?.icon || '👤'}
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
                            onClick={() => toggleSubordinateSelector(room.id)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-500"
                            title="Agregar habitacion"
                        >
                            <UserPlus size={18} />
                        </button>
                        {!isManager && (
                            <button
                                onClick={() => deletePerson(room.id)}
                                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500"
                                title="Eliminar habitacion"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>}

            {/* Selector de subordinados */}
            {/*showSelector && (
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
            )*/}

            {/* Subordinados */}
            {/*isExpanded && subordinates.length > 0 && (
                <div className="p-4">
                    {subordinates.map((subordinateId: string) => {
                        const subordinate = getPersonById(subordinateId)
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
            )*/}
        </div>
    );
}
