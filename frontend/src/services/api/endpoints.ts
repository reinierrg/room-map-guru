const API_BASE_URL = '/api';
const API_HOTEL_SEARCH = import.meta.env.VITE_API_HOTEL_SEARCH;

export const API_ENDPOINTS = {
    SEARCHHOTELS: API_HOTEL_SEARCH,
    ROOMSBYHOTEL: (hotelId: number) => `${API_BASE_URL}/rooms/${hotelId}`,
    ROOMSRELATIONHOTEL: `${API_BASE_URL}/rooms/relations`,
};