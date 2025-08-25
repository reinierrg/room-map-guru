import apiClient from '../api/axiosConfig';
import type {
    IRoom,
    IRoomMapping,
    IHotelSearchResult,
    AutoMapRequest
} from './room.types';
import {
    mapApiRoomToRoom,
    mapApiHotelToSearchResult,
    mapApiHotellocalToSearchResult
} from './room.mappers';
import type { ApiResponse } from '../../types/api.types';
import { API_ENDPOINTS } from '../api/endpoints';

class RoomService {
    // Buscar hoteles por nombre
    async searchHotels(query: string): Promise<IHotelSearchResult[]> {
        try {
            const {data} = await apiClient.get<ApiResponse<any[]>>(
                API_ENDPOINTS.HOTELS,
                { params: { query } }
            );
            
            return data.map(mapApiHotelToSearchResult);
        } catch (error) {
            throw new Error('Error al buscar hoteles');
        }
    }
 
    // Obtener listado de hoteles
    async loadHotels(): Promise<Partial<IHotelSearchResult>[]> {
        try {
            const response = await apiClient.get<ApiResponse<any[]>>(
                API_ENDPOINTS.HOTELS
            );
            const {data, status} = response
            if (status === 200) {
                
                return data.map(mapApiHotellocalToSearchResult);
            }
            
        } catch (error) {
            throw new Error('Error al buscar hoteles');
        }
    }

    // Obtener habitaciones de un hotel
    async getHotelRooms(hotelId: number): Promise<Partial<IRoom>[]> {
        try {
            const response = await apiClient.get<any>(
                API_ENDPOINTS.HOTEL_ROOMS(hotelId)
            );
            return response.data.map(mapApiRoomToRoom);
        } catch (error) {
            throw new Error('Error al obtener habitaciones');
        }
    }

    // Guardar habitaciones por hotels
    async saveRooms(hotelId: number, newRooms: IRoom[]): Promise<void> {
        try {
            /*await apiClient.post<ApiResponse<void>>(
                API_ENDPOINTS.SAVE_ROOMS(hotelId),
                { newRooms }
            );*/
        } catch (error) {
            throw new Error('Error al guardar mapeos');
        }
    }

   
}

export const roomService = new RoomService();