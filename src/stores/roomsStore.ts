import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { roomService } from '../services/room/room.service'
import type { IRoom } from '../services/room/room.types'
import { useRelationsStore } from './relationsStore'

interface RoomsState {
    rooms: Partial<IRoom>[]
    loading: boolean
    error: string | null
    setRooms: (newRooms: IRoom[]) => void
    loadRooms: (hotelId: number) => Promise<void>
    processRoomMappings: (newRooms: IRoom[]) => void
    saveRooms: (hotelId: number, newRooms: IRoom[]) => void
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

            loadRooms: async (hotelId: number) => {
                set({ loading: true, error: null })
                try {
                    const data: any[] = await roomService.getHotelRooms(hotelId)
                    useRoomsStore.getState().processRoomMappings(data)
                    set({ rooms: data, loading: false })
                } catch (err: any) {
                    set({
                        error: err.message || 'Error cargando rooms',
                        loading: false,
                    })
                }
            },

            processRoomMappings: (rooms: IRoom[]) => {
                const relations: { [key: number]: number[] } = {}

                rooms.forEach((room: any) => {
                    if (!room.id) return

                    const mappingTypes = [
                        'mapExpedia',
                        'mapHb',
                        'mapHs',
                    ] as const

                    mappingTypes.forEach((mappingType: string) => {
                        const mappings = room[mappingType]

                        if (Array.isArray(mappings) && mappings.length > 0) {
                            mappings.forEach((mappingId) => {
                                if (!relations[room.id!]) {
                                    relations[room.id!] = []
                                }

                                if (!relations[room.id!].includes(mappingId)) {
                                    relations[room.id!].push(mappingId)
                                }
                            })
                        }
                    })
                })
                useRelationsStore.getState().setRelations(relations, false)
            },
            saveRooms: async (hotelId: number, newRooms: IRoom[]) => {
                set({ loading: true, error: null })
                try {
                    await roomService.saveRooms(hotelId, newRooms)
                    useRelationsStore.setState({modified: false})
                    set({ loading: false })
                } catch (err: any) {
                    set({
                        error: err.message || 'Error cargando rooms',
                        loading: false,
                    })
                }
            },
        }),
        { name: 'rooms-store' }
    )
)
