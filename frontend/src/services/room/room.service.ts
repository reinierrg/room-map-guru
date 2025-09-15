import apiClient from '../api/axiosConfig'
import type { IRoom, IHotelSearchResult } from './room.types'
import { mapApiRoomToRoom, mapApiHotelToSearchResult } from './room.mappers'
import type { ApiResponse } from '../../types/api.types'
import { API_ENDPOINTS } from '../api/endpoints'
import { buildSearchHotels } from '../../constants/search-hotel'

class RoomService {
    // Buscar hoteles por nombre
    async searchHotels(query: string): Promise<IHotelSearchResult[]> {
        try {
            const { data, status } = await apiClient.post<ApiResponse<any>>(
                API_ENDPOINTS.SEARCHHOTELS,
                buildSearchHotels({ query }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-typesense-api-key': import.meta.env
                            .VITE_API_HOTEL_SEARCH_TOKEN,
                    },
                }
            )

            if (status === 200 && data) {
                const { results }: any = data
                const hotels = results[0].hits
                return hotels.map(mapApiHotelToSearchResult)
            }
        } catch (error) {
            throw new Error('Error al buscar hoteles')
        }
        return []
    }

    // Obtener habitaciones de un hotel
    async getHotelRooms(hotelId: number): Promise<Partial<IRoom>[]> {
        try {
            const response = await apiClient.get<any>(
                API_ENDPOINTS.ROOMSBYHOTEL(hotelId)
            )
            return response.data.map(mapApiRoomToRoom)
        } catch (error) {
            throw new Error('Error al obtener habitaciones')
        }
    }

    // Guardar habitaciones por hotels
    async saveRooms(relationRooms: Map<number, number>): Promise<void> {
        try {
            const listRooms = Array.from(relationRooms, ([room1, room2]) => ({
                room1: Math.floor(Number(room1)),
                room2: Math.floor(Number(room2)),
            }))

            await apiClient.post<ApiResponse<void>>(
                API_ENDPOINTS.ROOMSRELATIONHOTEL,
                { relationRooms: listRooms }
            )
        } catch (error) {
            throw new Error('Error al guardar mapeos')
        }
    }
}

export const roomService = new RoomService()
