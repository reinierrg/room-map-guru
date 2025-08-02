export const API_ENDPOINTS = {
    SEARCH_HOTELS: '/search/hotels',
    HOTEL_ROOMS: (hotelId: string) => `/hotels/${hotelId}/rooms`,
    SAVE_MAPPINGS: '/rooms/mappings',
    AUTO_MAP: '/rooms/auto-map',
    CLEAR_MAPPINGS: (hotelId: string) => `/hotels/${hotelId}/clear-mappings`
};