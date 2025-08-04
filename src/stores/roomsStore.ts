import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { roomService } from '../services/room/room.service'
import type { IHotel, IRoom } from '../services/room/room.types'

interface RoomsState {
    rooms: Partial<IRoom>[]
    loading: boolean
    error: string | null
    setRooms: (newRooms: IRoom[]) => void
    loadRooms: (hotels: IHotel[]) => Promise<void>
}

export const useRoomsStore = create<RoomsState>()(
    devtools(
        (set) => ({
            rooms: [],
            loading: false,
            error: null,

            setRooms: (newRooms) =>
                set(() => ({
                    rooms: newRooms,
                })),

           /*loadRooms: async (hotels: IHotel[]) => {
                set({ loading: true, error: null })
                try {
                    
                    const res = await fetch('http://localhost:4000/rooms')
                    const data: IRoom[] = await res.json()
                    //const data: any[] = mockRooms
                    set({ rooms: data, loading: false })
                } catch (err: any) {
                    set({
                        error: err.message || 'Error cargando rooms',
                        loading: false,
                    })
                }
            }, */
           /*     
            searchHotels: async (query: string) => {
                set({ loading: true, error: null })
                try {
                    const hotels = await roomService.searchHotels(query)
                    set({ hotels })
                } catch (error) {
                    set({ error: 'Error al buscar hoteles' })
                } finally {
                    set({ loading: false })
                }
            }, */

            loadRooms: async (hotels: IHotel[]) => {
                set({ loading: true, error: null })

                try {
                    let roomsByHotel: Partial<IRoom>[] = [] 
                    for (const hotel of hotels) {
                        try {
                            const rooms = await roomService.getHotelRooms(
                                hotel.id
                            )
                            roomsByHotel = [...roomsByHotel, ...rooms]
                        } catch (error) {
                            console.error(
                                `Error al obtener habitaciones del hotel ${hotel.id}:`,
                                error
                            )
                        }
                    }

                    set({ rooms: roomsByHotel })
                } catch (error) {
                    set({ error: 'Error al obtener habitaciones' })
                } finally {
                    set({ loading: false })
                }
            },
            /*
            saveMappings: async (mappings: RoomMapping[]) => {
                set({ loading: true, error: null })
                try {
                    await roomService.saveRoomMappings(mappings)
                    set({ mappings }) // opcional: solo si necesitas actualizarlos
                } catch (error) {
                    set({ error: 'Error al guardar mapeos' })
                } finally {
                    set({ loading: false })
                }
            },

            autoMapRooms: async (request: AutoMapRequest) => {
                set({ loading: true, error: null })
                try {
                    const mappings = await roomService.autoMapRooms(request)
                    set({ mappings })
                } catch (error) {
                    set({ error: 'Error en mapeo automático' })
                } finally {
                    set({ loading: false })
                }
            },

            clearMappings: async (hotelId: string) => {
                set({ loading: true, error: null })
                try {
                    await roomService.clearMappings(hotelId)
                    set({ mappings: [] })
                } catch (error) {
                    set({ error: 'Error al limpiar mapeos' })
                } finally {
                    set({ loading: false })
                }
            },*/
        }),
        { name: 'rooms-store' } // etiqueta para el DevTools
    )
)
