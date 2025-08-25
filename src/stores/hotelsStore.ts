import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { IHotel, IHotelSearchResult } from '../services/room/room.types'
import { roomService } from '../services/room/room.service'

interface HotelsState {
    hotels: IHotel[]
    hotelsTemp: IHotel[]
    loading: boolean
    error: string | null
    setHotels: (newHotels: IHotel[]) => void
    searchHotels: () => Promise<void>
    loadHotels: () => Promise<void>
}

export const useHotelsStore = create<HotelsState>()(
    devtools(
        (set, get) => ({
            hotelsTemp: [],
            hotels: [],
            loading: false,
            error: null,

            setHotels: (newHotels: IHotel[]) =>
                set(() => ({ hotels: newHotels })),
            loadHotels: async () => {
                set({ loading: true, error: null })
                try {
                    // Implementar logica para cargar lista de hoteles
                    const data: any[] = await roomService.loadHotels()
                    set({ hotels: data, hotelsTemp: data, loading: false })
                } catch (err: any) {
                    set({
                        error: err.message || 'Error cargando rooms',
                        loading: false,
                    }) 
                }
            },
            searchHotels: async (query: any) => {
                if (query.length > 3) {
                    set({ loading: true, error: null })
                    try {
                        const result = get().hotels.filter(
                            (h) =>
                                h.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase()) ||
                                h.id.toString().includes(query.toLowerCase())
                        )
                        set({ hotelsTemp: result, loading: false })
                    } catch (err: any) {
                        set({
                            error: err.message || 'Error cargando rooms',
                            loading: false,
                        })
                    }
                }
            },
        }),
        { name: 'hotels-store' }
    )
)
