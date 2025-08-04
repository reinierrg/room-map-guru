// Tipos para habitaciones
export type RoomType = 'Interno' | 'Expedia' | 'HB' | 'HS';

export interface IRoom {
    id: string
    description?: string
    position: string
    name: string;
    type: RoomType;
    uri?: string; 
    mapExpedia?: string;
    mapHb?: string;
    mapHs?: string;
    map?: string;
    price?: number;
}

export interface IRoomMapping {
    sourceId: string;
    targetId: string;
    provider: RoomType;
    similarity?: number;
}

export interface IHotelSearchResult {
    id: string;
    name: string;
    location: string;
    rating?: number;
    thumbnail?: string;
}

export interface IHotel {
    id: string,
    name:  string,
    color: string,
    icon: string,
}

export interface AutoMapRequest {
    hotelId: string;
    similarityThreshold: number;
}