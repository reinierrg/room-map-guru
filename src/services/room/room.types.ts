// Tipos para habitaciones
export type RoomType = 'Interno' | 'Expedia' | 'HB' | 'HS';

export interface Room {
    id: string;
    name: string;
    type: RoomType;
    uri?: string; 
    mapExpedia?: string;
    mapHb?: string;
    mapHs?: string;
    map?: string;
    price?: number;
}

export interface RoomMapping {
    sourceId: string;
    targetId: string;
    provider: RoomType;
    similarity?: number;
}

export interface HotelSearchResult {
    id: string;
    name: string;
    location: string;
    rating?: number;
    thumbnail?: string;
}

export interface AutoMapRequest {
    hotelId: string;
    similarityThreshold: number;
}