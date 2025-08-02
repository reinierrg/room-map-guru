import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { mockRooms } from '../../mock/mockRooms'
import type { IRoom } from '../types/types'

interface RoomsState {
    rooms: IRoom[]
    loading: boolean
    error: string | null
    setRooms: (newRooms: IRoom[]) => void
    fetchRooms: () => Promise<void>
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

            fetchRooms: async () => {
                set({ loading: true, error: null })
                try {
                    //const res = await fetch('/api/rooms');
                    //const data: IRoom[] = await res.json();
                    const data: any[] = mockRooms
                    set({ rooms: data, loading: false })
                } catch (err: any) {
                    set({
                        error: err.message || 'Error cargando rooms',
                        loading: false,
                    })
                }
            },
        }),
        { name: 'rooms-store' } // etiqueta para el DevTools
    )
)
