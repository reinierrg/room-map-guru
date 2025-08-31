import { useEffect, useState } from 'react'
import { RoomsDashboard } from '../components/RoomsDashboard'
import type { IHotel, IRoom } from '../services/room/room.types'
import { useHotels } from '../hooks/useHotels'
import { useRooms } from '../hooks/useRooms'
import { useRelations } from '../hooks/useRelations'
import RoomMapper from '../models/RoomMapper'
import { useAgents } from '../hooks/useAgents'
import { RoomsByType } from '../components/RoomsByType'
import { Search } from 'lucide-react'
import Loading from '../components/Loading'
import { Notification } from '../components/Notification'

export default function HomePage() {
    const { hotels, loading: hotelsLoading, searchHotels } = useHotels()
    const {
        rooms,
        loading: roomsLoading,
        loadRooms,
        setRooms,
        saveRooms,
    } = useRooms()
    const { modified, relations } = useRelations()
    const { getAgentById } = useAgents()

    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedItem, setSelectedItem] = useState<IHotel | null>(null)
    const [showResults, setShowResults] = useState(false)

    const [activeTab, setActiveTab] = useState<
        'interno' | 'expedia' | 'hb' | 'hs'
    >('interno')

    const handleSearchTerm = async () => {
        if (searchTerm.length >= 3) {
            //@ts-ignore
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
        setRooms([])
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
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4">
                <div className="container mx-auto px-2">
                    <div className="flex flex-col items-center max-w-5xl mx-auto ">
                        {/* Contenedor principal de búsqueda y selección */}
                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 p-0 bg-white rounded-xl">
                            {/* Área de búsqueda/selección */}
                            <div className="flex-grow">
                                {!selectedItem ? (
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                    if (selectedItem)
                                                        setSelectedItem(null)
                                                }}
                                                onFocus={handleInputFocus}
                                                placeholder="Buscar hotel..."
                                                className="w-full px-2 py-2 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                className="ml-3 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                                title="Buscar"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
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
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-2">
                                        <div>
                                            <p className="font-semibold text-blue-800 text-sm">
                                                HOTEL SELECCIONADO:
                                            </p>
                                            <p className="text-blue-600 text-xl font-bold">
                                                {selectedItem.name}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleClearSelection}
                                            className="ml-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                            title="Limpiar selección"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
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
                                    </div>
                                )}
                            </div>

                            {/* Botón de salvar - siempre visible pero condicional en estilo */}
                            <button
                                onClick={handleSave}
                                disabled={!modified || !rooms?.length}
                                className={`px-4 py-2 text-lg rounded-lg shadow font-medium transition-colors duration-200 min-w-[120px]
          ${
              modified && rooms?.length
                  ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
                            >
                                Salvar
                            </button>
                        </div>

                        {/* Resultados de búsqueda */}
                        {showResults && !selectedItem && hotels.length > 0 && (
                            <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-72 overflow-auto mt-2">
                                {hotels.map((hotel: IHotel) => (
                                    <div
                                        key={hotel.id}
                                        className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                        onClick={() =>
                                            handleSelectedItem(hotel)
                                        }
                                    >
                                        <p className="font-medium text-lg">
                                            {hotel.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showResults &&
                            !hotelsLoading &&
                            !selectedItem &&
                            hotels.length === 0 &&
                            searchTerm.length > 0 && (
                                <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-2">
                                    <p className="text-yellow-800">
                                        No se encontraron hoteles con "
                                        {searchTerm}"
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </header>
            {/* Espacio para el header fijo */}
            <div className="h-20"></div>
            <main className="max-w-6xl mx-auto">
                {roomsLoading && <Loading />}
                {selectedItem && !roomsLoading ? (
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
                                    <div className="flex gap-1.5">
                                        <img
                                            src={`${getAgentById('Interno').icon}`}
                                            width="16"
                                            height="16"
                                        />{' '}
                                        PriceTravel ({internalRooms.length})
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('expedia')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'expedia'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex gap-1.5">
                                        <img
                                            src={`${getAgentById('Expedia').icon}`}
                                            width="16"
                                            height="16"
                                        />{' '}
                                        Expedia ({expediaRooms.length})
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('hb')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'hb'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex gap-1.5">
                                        <img
                                            src={`${getAgentById('HB').icon}`}
                                            width="16"
                                            height="16"
                                        />{' '}
                                        HotelBeds ({hbRooms.length})
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('hs')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'hs'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex gap-1.5">
                                        <img
                                            src={`${getAgentById('HS').icon}`}
                                            width="16"
                                            height="16"
                                        />{' '}
                                        Unico ({hsRooms.length})
                                    </div>
                                </button>
                            </nav>
                        </div>

                        {/* Contenido de los tabs */}
                        <div className="bg-white rounded-lg shadow p-6">
                            {activeTab === 'interno' && (
                                <div>
                                    <div className="flex gap-2">
                                        <h2 className="text-xl font-bold mb-4">
                                            Rooms PriceTravel
                                        </h2>
                                        <span
                                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 "
                                            style={{ height: '1.8rem' }}
                                        >
                                            Habitacion Base
                                        </span>
                                    </div>

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
                                    />
                                </div>
                            )}

                            {activeTab === 'hb' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">
                                        Rooms HotelBeds
                                    </h2>
                                    <RoomsByType
                                        rooms={rooms}
                                        type="HB"
                                    />
                                </div>
                            )}

                            {activeTab === 'hs' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">
                                        Rooms Unico
                                    </h2>
                                    <RoomsByType
                                        rooms={rooms}
                                        type="HS"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : !roomsLoading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Busca y selecciona un hotel para ver sus
                            habitaciones
                        </h3>
                        <p className="text-gray-500">
                            Escribe en el campo de búsqueda para filtrar
                        </p>
                    </div>
                    
                ): ''}
            </main>
          <Notification />
        </div>
    )
}
