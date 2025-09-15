import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { roomService } from '../services/room/room.service'
import type { IRoom } from '../services/room/room.types'
import { useRelationsStore } from './relationsStore'
import { useNotificationStore } from './notificationStore'

interface RoomsState {
    rooms: IRoom[]
    loading: boolean
    error: string | null
    setRooms: (newRooms: IRoom[]) => void
    loadRooms: (hotelId: number) => Promise<void>
    processRoomMappings: (newRooms: IRoom[]) => void
    saveRooms: (relationRooms: Map<number, number>) => void
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
            saveRooms: async (relationRooms: Map<number, number>) => {
                set({ loading: true, error: null })
                try {
                    await roomService.saveRooms(relationRooms)
                    useRelationsStore.setState({ modified: false })
                    useNotificationStore
                        .getState()
                        .addNotification({
                            type: 'info',
                            message: 'habitacioens salvadas con exito',
                            id: crypto.randomUUID(),
                        })
                    set({ loading: false })
                } catch (err: any) {

                    useNotificationStore
                        .getState()
                        .addNotification({
                            type: 'error',
                            message: 'Error al salvar las habitaciones del hotel',
                            id: crypto.randomUUID(),
                        })
                        
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
