import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { IHotel } from '../types/types'
import { mockHotels } from '../mock/mocks'

interface HotelsState {
    hotels: IHotel[]
    loading: boolean
    error: string | null
    setHotels: (newHotels: IHotel[]) => void
    loadHotels: () => Promise<void>
}

export const useHotelsStore = create<HotelsState>()(
    devtools(
        (set) => ({
            hotels: [],
            loading: false,
            error: null,

            setHotels: (newHotels: IHotel[]) =>
                set(() => ({ hotels: newHotels })),

            loadHotels: async () => {
                set({ loading: true, error: null })
                try {
                    // Implementar logica para cargar lista de hoteles
                    const data: any[] = mockHotels
                    set({ hotels: data, loading: false })
                } catch (err: any) {
                    set({
                        error: err.message || 'Error cargando rooms',
                        loading: false,
                    })
                }
            },
        }),
        { name: 'hotels-store' }
    )
)
