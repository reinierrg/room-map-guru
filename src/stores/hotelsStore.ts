import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { IHotel } from '../services/room/room.types'
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
        (set) => ({
            hotelsTemp: [],
            hotels: [],
            loading: false,
            error: null,

            setHotels: (newHotels: IHotel[]) =>
                set(() => ({ hotels: newHotels })),
          
            searchHotels: async (query: string) => {
                if (query.length > 3) {
                    set({ loading: true, error: null })
                    try {
                        const hotels: any[] = await roomService.searchHotels(query)
                        set({ hotels, loading: false })
                    } catch (err: any) {
                        set({
                            error: err.message || 'Error cargando rooms',
                            loading: false,
                        })
                    }
                }
            },
            
        }),
        { name: 'hotel-store' }
    )
)
