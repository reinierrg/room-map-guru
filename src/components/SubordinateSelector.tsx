import { Search } from 'lucide-react'
import type { IRoom } from '../types/types'

export const SubordinateSelector = ({
    availableSubordinates,
    onSelect,
    onSearchChange,
    searchValue,
    getTypeById,
}: {
    availableSubordinates: IRoom[]
    onSelect: (id: number) => void
    onSearchChange: (value: string) => void
    searchValue: string
    getTypeById: (id: string) => any
}) => (
    <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="mb-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
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
                            onClick={() => onSelect(subordinate.id)}
                            className="w-full px-3 py-2 text-left hover:bg-white rounded text-sm flex items-center gap-2"
                        >
                            <div className={`w-4 h-4 rounded-full ${subType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}>
                                {subType?.icon || '👤'}
                            </div>
                            <div>
                                <div className="font-medium">{subordinate.name}</div>
                                <div className="text-xs text-gray-500">{subordinate.position}</div>
                            </div>
                        </button>
                    )
                })
            ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                    {searchValue ? 'No se encontraron habitaciones' : 'No hay habitaciones disponibles'}
                </div>
            )}
        </div>
    </div>
)