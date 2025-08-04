import apiClient from '../api/axiosConfig';
import type {
    IRoom,
    IRoomMapping,
    IHotelSearchResult,
    AutoMapRequest
} from './room.types';
import {
    mapApiRoomToRoom,
    mapApiHotelToSearchResult
} from './room.mappers';
import type { ApiResponse, PaginatedResponse } from '../../types/api.types';
import { API_ENDPOINTS } from '../api/endpoints';

class RoomService {
    // Buscar hoteles por nombre
    async searchHotels(query: string): Promise<IHotelSearchResult[]> {
        try {
            const response = await apiClient.get<ApiResponse<any[]>>(
                API_ENDPOINTS.SEARCH_HOTELS,
                { params: { query } }
            );

            return response.data.data.map(mapApiHotelToSearchResult);
        } catch (error) {
            throw new Error('Error al buscar hoteles');
        }
    }

    // Obtener habitaciones de un hotel
    async getHotelRooms(hotelId: string): Promise<Partial<IRoom>[]> {
        try {
            const response = await apiClient.get<any>(
                API_ENDPOINTS.HOTEL_ROOMS(hotelId)
            );
            return response.data.map(mapApiRoomToRoom);
        } catch (error) {
            throw new Error('Error al obtener habitaciones');
        }
    }

    // Guardar mapeos de habitaciones
    async saveRoomMappings(mappings: IRoomMapping[]): Promise<void> {
        try {
            await apiClient.post<ApiResponse<void>>(
                API_ENDPOINTS.SAVE_MAPPINGS,
                { mappings }
            );
        } catch (error) {
            throw new Error('Error al guardar mapeos');
        }
    }

    // Auto-mapear habitaciones por similitud
    async autoMapRooms(request: AutoMapRequest): Promise<IRoomMapping[]> {
        try {
            const response = await apiClient.post<ApiResponse<any[]>>(
                API_ENDPOINTS.AUTO_MAP,
                request
            );

            return response.data.data;
        } catch (error) {
            throw new Error('Error en mapeo automático');
        }
    }

    // Limpiar mapeos de un hotel
    async clearMappings(hotelId: string): Promise<void> {
        try {
            await apiClient.post<ApiResponse<void>>(
                API_ENDPOINTS.CLEAR_MAPPINGS(hotelId)
            );
        } catch (error) {
            throw new Error('Error al limpiar mapeos');
        }
    }
}

export const roomService = new RoomService();