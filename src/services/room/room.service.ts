import apiClient from '../api/axiosConfig';
import type {
    Room,
    RoomMapping,
    HotelSearchResult,
    AutoMapRequest
} from './room.types';
import {
    mapApiRoomToRoom,
    mapApiHotelToSearchResult
} from './room.mappers';
import type { ApiResponse, PaginatedResponse } from '../../types/api.types';

class RoomService {
    // Buscar hoteles por nombre
    async searchHotels(query: string): Promise<HotelSearchResult[]> {
        try {
            const response = await apiClient.get<ApiResponse<any[]>>(
                '/search/hotels',
                { params: { query } }
            );

            return response.data.data.map(mapApiHotelToSearchResult);
        } catch (error) {
            throw new Error('Error al buscar hoteles');
        }
    }

    // Obtener habitaciones de un hotel
    async getHotelRooms(hotelId: string): Promise<Room[]> {
        try {
            const response = await apiClient.get<ApiResponse<any[]>>(
                `/hotels/${hotelId}/rooms`
            );

            return response.data.data.map(mapApiRoomToRoom);
        } catch (error) {
            throw new Error('Error al obtener habitaciones');
        }
    }

    // Guardar mapeos de habitaciones
    async saveRoomMappings(mappings: RoomMapping[]): Promise<void> {
        try {
            await apiClient.post<ApiResponse<void>>(
                '/rooms/mappings',
                { mappings }
            );
        } catch (error) {
            throw new Error('Error al guardar mapeos');
        }
    }

    // Auto-mapear habitaciones por similitud
    async autoMapRooms(request: AutoMapRequest): Promise<RoomMapping[]> {
        try {
            const response = await apiClient.post<ApiResponse<any[]>>(
                '/rooms/auto-map',
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
                `/hotels/${hotelId}/clear-mappings`
            );
        } catch (error) {
            throw new Error('Error al limpiar mapeos');
        }
    }
}

export const roomService = new RoomService();