import { useEffect, useState } from 'react'
import { RoomsDashboard } from '../components/RoomsDashboard'
import type { IHotel, IRoom } from '../services/room/room.types'

import { useHotels } from '../hooks/useHotels'
import { useRooms } from '../hooks/useRooms'
import { useRelations } from '../hooks/useRelations'
import RoomMapper from '../models/RoomMapper'

const RoomsByType = ({
    rooms,
    type,
    relations,
}: {
    rooms: IRoom[]
    type: string
    relations: object
}) => {
    const filteredRooms = rooms.filter((room) => room.type === type)

    // Función para verificar si un room está relacionado
    const isRoomRelated = (roomId: number): boolean => {
        // Un room está relacionado si aparece como clave en relations O si aparece en algún array de valores
        if (relations[roomId] && relations[roomId].length > 0) {
            return true
        }

        // Verificar si el roomId aparece en los valores de otras relaciones
        return Object.values(relations).some((relatedIds) =>
            relatedIds.includes(roomId)
        )
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">
                {type} Rooms ({filteredRooms.length})
            </h3>
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
                                }`}
                            >
                                <div className="p-4 border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-medium text-gray-800">
                                                {room.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                ID: {room.id}
                                            </p>
                                            <div className="mt-2 text-xs">
                                                {room.mapExpedia && (
                                                    <p>
                                                        Expedia:{' '}
                                                        {room.mapExpedia}
                                                    </p>
                                                )}
                                                {room.mapHb && (
                                                    <p>HB: {room.mapHb}</p>
                                                )}
                                                {room.mapHs && (
                                                    <p>HS: {room.mapHs}</p>
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
                <p className="text-gray-500 text-center py-8">
                    No hay rooms de tipo {type}
                </p>
            )}
        </div>
    )
}

export default function HomePage() {
    const {
        hotelsTemp,
        loading: hotelsLoading,
        loadHotels,
        searchHotels,
    } = useHotels()
    const { rooms, loading: roomsLoading, loadRooms, saveRooms } = useRooms()
    const { modified, relations } = useRelations()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedItem, setSelectedItem] = useState<IHotel | null>(null)
    const [showResults, setShowResults] = useState(false)
    const [saveMessage, setSaveMessage] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)
    const [activeTab, setActiveTab] = useState<
        'interno' | 'expedia' | 'hb' | 'hs'
    >('interno')

    useEffect(() => {
        loadHotels()
    }, [])

    const handleSearchTerm = async () => {
        if (searchTerm.length > 0) {
            await searchHotels(searchTerm)
            setShowResults(true)
        } else {
            setShowResults(false)
        }
    }

    useEffect(() => {
        handleSearchTerm()
    }, [searchTerm])

    const handleClearSelection = () => {
        setSelectedItem(null)
        setSearchTerm('')
        setShowResults(false)
    }

    const handleInputFocus = () => {
        if (searchTerm.length > 0 && !selectedItem) {
            setShowResults(true)
        }
    }

    const handleSelectedItem = async (item: IHotel) => {
        setSelectedItem(item)
        setSearchTerm(item.name)
        setShowResults(false)
        await loadRooms(item.id)
    }

    const handleSave = async () => {
        try {
            const roomsToSave = RoomMapper.mapRelationsToRoomTypes(
                relations,
                rooms as IRoom[]
            )
            console.log(roomsToSave)

            if (selectedItem?.id) {
                await saveRooms(selectedItem.id, roomsToSave)
            }
        } catch (error) {
            console.error('Error al guardar:', error)
        }
    }

    // Filtrar rooms por tipo
    const internalRooms = rooms.filter((room) => room.type === 'Interno')
    const expediaRooms = rooms.filter((room) => room.type === 'Expedia')
    const hbRooms = rooms.filter((room) => room.type === 'HB')
    const hsRooms = rooms.filter((room) => room.type === 'HS')

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20">
            {' '}
            {/* Añadido padding-bottom para evitar que el botón tape contenido */}
            <header className="max-w-2xl mx-auto mb-8">
                <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-md">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    if (selectedItem) setSelectedItem(null)
                                }}
                                onFocus={handleInputFocus}
                                placeholder={
                                    selectedItem ? '' : 'Buscar hotel...'
                                }
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                disabled={!!selectedItem}
                            />
                            {selectedItem ? (
                                <button
                                    type="button"
                                    onClick={handleClearSelection}
                                    className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    title="Limpiar selección"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    title="Buscar"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {selectedItem && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="font-semibold text-blue-800">
                                    Hotel seleccionado:
                                </p>
                                <p className="text-blue-600">
                                    {selectedItem.name}
                                </p>
                            </div>
                        )}

                        {showResults &&
                            !selectedItem &&
                            hotelsTemp.length > 0 && (
                                <div className="mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                                    {hotelsTemp.map((hotel: IHotel) => (
                                        <div
                                            key={hotel.id}
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            onClick={() =>
                                                handleSelectedItem(hotel)
                                            }
                                        >
                                            <p className="font-medium">
                                                {hotel.name}
                                            </p>
                                            {hotel.location && (
                                                <p className="text-sm text-gray-500">
                                                    {hotel.location}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        {showResults &&
                            !selectedItem &&
                            hotelsTemp.length === 0 &&
                            searchTerm.length > 0 && (
                                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-800">
                                        No se encontraron hoteles
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </header>
            <main className="max-w-6xl mx-auto">
                {selectedItem ? (
                    <div className="mt-6">
                        {/* Tabs de navegación */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('interno')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'interno'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Interno ({internalRooms.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('expedia')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'expedia'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Expedia ({expediaRooms.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('hb')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'hb'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    HB ({hbRooms.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('hs')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'hs'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    HS ({hsRooms.length})
                                </button>
                            </nav>
                        </div>

                        {/* Contenido de los tabs */}
                        <div className="bg-white rounded-lg shadow p-6">
                            {activeTab === 'interno' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">
                                        Rooms Internos
                                    </h2>
                                    <RoomsDashboard />
                                </div>
                            )}

                            {activeTab === 'expedia' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">
                                        Rooms Expedia
                                    </h2>
                                    <RoomsByType
                                        rooms={rooms}
                                        type="Expedia"
                                        relations={relations}
                                    />
                                </div>
                            )}

                            {activeTab === 'hb' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">
                                        Rooms HB
                                    </h2>
                                    <RoomsByType
                                        rooms={rooms}
                                        type="HB"
                                        relations={relations}
                                    />
                                </div>
                            )}

                            {activeTab === 'hs' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">
                                        Rooms HS
                                    </h2>
                                    <RoomsByType
                                        rooms={rooms}
                                        type="HS"
                                        relations={relations}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>
                            Busca y selecciona un hotel para ver sus
                            habitaciones
                        </p>
                        <p className="text-sm mt-2">
                            Escribe en el campo de búsqueda para filtrar
                        </p>
                    </div>
                )}
            </main>
            {/* Mensaje de guardado */}
            {saveMessage && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                        saveMessage.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                >
                    {saveMessage.message}
                </div>
            )}
            {/* Botón Flotante "Salvar" */}
            {rooms.length > 0 && (
                <button
                    onClick={handleSave}
                    disabled={!modified}
                    className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg font-medium transition-colors duration-200 z-50
          ${
              modified
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
                >
                    Salvar
                </button>
            )}
        </div>
    )
}
