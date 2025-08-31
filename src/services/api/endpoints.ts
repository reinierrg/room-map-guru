export const API_ENDPOINTS = {
    SEARCH_HOTELS: import.meta.env.VITE_API_HOTEL_SEARCH,
    //GET_ROOMS_BY_HOTEL: (hotelId: number) => `${import.meta.env.VITE_API_BASE_URL}/rooms/${hotelId}`,
    //@ts-ignore
    GET_ROOMS_BY_HOTEL: (hotelId: number) => `${import.meta.env.VITE_API_BASE_URL}/rooms/`,
    //SAVE_ROOMS: (hotelId: number) => `${import.meta.env.VITE_API_BASE_URL}/rooms/${hotelId}`,
    SAVE_ROOMS: (hotelId: number) => `${import.meta.env.VITE_API_BASE_URL}/rooms/${hotelId}`,
};